import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import isEqual from "lodash.isequal";

import styles from "./LapChart.module.scss";

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
import { contextType, LapChartProps } from "./LapChartTypes";
import { compoundStringToColour, createDataObjectFromLapData } from "./LapChartHelpers";


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
        const newTooltipData = {
            opacity: 1,
            left: position.left + tooltipModel.caretX,
            top: position.top + tooltipModel.caretY,
            lap: tooltipModel.dataPoints[0].label,
            position: tooltipModel.dataPoints[0].formattedValue,
            colour: tooltipModel.dataPoints[0].dataset.borderColor as string,
            border: (tooltipModel?.dataPoints[0]?.dataset?.borderDash as number[])[0] == 0 ? "solid" : "dashed",
            longname: props.lapData[CUR_DRIVER_SHORT_NAME].Name,
            compound: props.lapData[CUR_DRIVER_SHORT_NAME].Compounds[tooltipModel.dataPoints[0].dataIndex],
            laptime: props.lapData[CUR_DRIVER_SHORT_NAME].LapTimes[tooltipModel.dataPoints[0].dataIndex],

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
        <div id='lap-chart-wrapper' className={styles.lapChartWrapper}>
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