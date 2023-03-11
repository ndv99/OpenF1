import type { NextPage } from "next";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TooltipModel,
    ChartTypeRegistry,
    BubbleDataPoint,
    ScatterDataPoint,
} from "chart.js";

import isEqual from "lodash.isequal";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
import { Line } from "react-chartjs-2";
import { useRef, useState } from "react";

function createDataObjectFromLapData(lapData: Racers) {

    const datasets: { label: string; data: number[]; backgroundColor: string; borderColor: string; borderWidth: number; borderDash: number[]; pointRadius: number; pointBorderColor: string; pointBackgroundColor: string; pointHoverBorderColor: string; pointHoverBackgroundColor: string; }[] = [];
    const encounteredTeams: string[] = [];

    let maxLaps = [0];
    const lapDataArray = Object.entries(lapData);
    lapDataArray.forEach((driverEntry: any) => {
        const smallLabel: string = driverEntry[0];
        const driverLapData: Driver = driverEntry[1];
        if (driverLapData.Laps.length > maxLaps.length) {
            maxLaps = driverLapData.Laps;
        }
        let encounteredTeam = false;
        if (encounteredTeams.includes(driverLapData.TeamColor)) {
            encounteredTeam = true;
        } else {
            encounteredTeams.push(driverLapData.TeamColor);
        }
        datasets.push({
            label: smallLabel,
            data: driverLapData.Positions,
            backgroundColor: `#${driverLapData.TeamColor}`,
            borderColor: `#${driverLapData.TeamColor}`,
            borderWidth: 1,
            borderDash: encounteredTeam ? [5, 5] : [0, 0],
            pointRadius: 10,
            pointBorderColor: "rgba(0, 0, 0, 0)",
            pointBackgroundColor: "rgba(0, 0, 0, 0)",
            pointHoverBorderColor: `#${driverLapData.TeamColor}`,
            pointHoverBackgroundColor: `#${driverLapData.TeamColor}`,

        });
    });
    const data = {
        labels: maxLaps,
        datasets,
    };
    return data;
}
export interface Data {
    labels: number[];
    datasets: Dataset[];
}

export interface Dataset {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderDash: number[];
    pointRadius: number;
    pointBorderColor: string;
    pointBackgroundColor: string;
    pointHoverBorderColor: string;
    pointHoverBackgroundColor: string;
}
function compoundStringToColour(compoundString: string) {
    switch (compoundString) {
        case "SOFT":
            return "red";
        case "HARD":
            return "white";
        case "MEDIUM":
            return "yellow";
        default:
            return "none";
    }
}

interface LapChartProps {
    name: string,
    lapData: Racers
}
interface Driver {
    Name: string;
    Positions: number[];
    Laps: number[];
    TeamColor: string;
    Compounds: string[];
    LapTimes: any[];
}
interface Racers { [key: string]: Driver }

interface contextType {
    chart: ChartJS<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | null)[], unknown>;
    tooltip: TooltipModel<"line">;
}
const LapChart: React.FC<LapChartProps> = (props: LapChartProps) => { //TODO: endpoint data types

    const handleToolTip = (context: contextType) => {
        const tooltipModel = context.tooltip;
        if (!chart || !chart.current) return;

        if (tooltipModel.opacity === 0) {
            if (tooltip.opacity !== 0) setTooltip(prev => ({ ...prev, opacity: 0 }));
            return;
        }
        const position = context.chart.canvas.getBoundingClientRect();
        const CUR_DRIVER_SHORT_NAME: string = tooltipModel.dataPoints[0].dataset.label as string;
        const longname = props.lapData[CUR_DRIVER_SHORT_NAME].Name;
        const compound = props.lapData[CUR_DRIVER_SHORT_NAME].Compounds[tooltipModel.dataPoints[0].dataIndex];
        const laptime = props.lapData[CUR_DRIVER_SHORT_NAME].LapTimes[tooltipModel.dataPoints[0].dataIndex];

        const index = tooltipModel.dataPoints[0].datasetIndex;
        const colour = tooltipModel.dataPoints[0].dataset.borderColor as string;
        const border = (tooltipModel?.dataPoints[0]?.dataset?.borderDash as number[])[0] == 0 ? "solid" : "dashed";
        const newTooltipData = {
            opacity: 1,
            left: position.left + tooltipModel.caretX,
            top: position.top + tooltipModel.caretY,
            lap: tooltipModel.dataPoints[0].label,
            position: tooltipModel.dataPoints[0].formattedValue,
            colour: colour,
            border: border,
            longname: longname,
            compound: compound,
            laptime: laptime,

        };
        if (!isEqual(tooltip, newTooltipData)) setTooltip(newTooltipData);
    };
    // TODO: SPINNER
    if (!Object.entries(props.lapData)) {
        return <div style={{ color: "red" }}>NO LAP DATA</div>;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const chart = useRef(null); //create reference hook
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [tooltip, setTooltip] = useState({
        opacity: 0,
        top: 0,
        left: 0,
        lap: "",
        position: "",
        colour: "#000",
        border: "solid",
        longname: "tempdrivername",
        compound: "tempcompound",
        laptime: "templaptime"
    });
    const lapData = createDataObjectFromLapData(props.lapData);
    const title: string = props.name;

    return (
        <div id='lap-chart-wrapper'>
            <Line data={lapData} ref={chart}
                options={{

                    scales: { y: { position: "left", reverse: true, ticks: { autoSkip: false, stepSize: 1 } } },
                    plugins: {
                        legend: { position: "right" }, title: { text: title, display: true, color: "white", fullSize: true },
                        tooltip: {
                            enabled: false,
                            external: context => {
                                handleToolTip(context);
                            },
                        }
                    },

                }}
            >

            </Line>

            <div className='tooltip' style={{ backgroundColor: "rgb(255,255,255,0.5)", padding: "5px", borderRadius: "5px", position: "absolute", top: tooltip.top, left: tooltip.left, opacity: tooltip.opacity, borderRight: `5px ${tooltip.border} ${tooltip.colour}` }}>
                <p>{tooltip.longname}</p>
                <p>Lap {tooltip.lap} </p>
                <p>Position {tooltip.position} </p>
                <p>Laptime: {tooltip.laptime} </p>
                <p style={{ border: `3px solid ${compoundStringToColour(tooltip.compound)}` }}>Compound {tooltip.compound} </p>

            </div>
        </div>
    );

};

export default LapChart;