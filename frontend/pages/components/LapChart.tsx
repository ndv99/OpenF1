import type { NextPage } from 'next'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import isEqual from 'lodash.isequal';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
import { Line } from 'react-chartjs-2'
import { useRef, useState } from 'react';
interface DriverLapDataType {
    Name: string;
    Positions: number[];
    Laps: number[];
    TeamColor: string;
    Compounds: string[];
    LapTimes: string[];
}
interface DriverDataset {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
}
function createDataObjectFromLapData(lapData: any) {
    if (lapData.length < 1) {
        return false
    }
    const datasets = []
    const labels = [] // laps
    const encounteredTeams: string[] = []
    //console.log("createDataObj", lapData);

    let maxLaps = [0]
    const lapDataArray = Object.entries(lapData)
    lapDataArray.forEach((driverEntry: any) => {
        //console.log(driverEntry);
        const smallLabel: string = driverEntry[0]
        const driverLapData: DriverLapDataType = driverEntry[1]
        if (driverLapData.Laps.length > maxLaps.length) {
            maxLaps = driverLapData.Laps
        }
        let encounteredTeam = false
        if (encounteredTeams.includes(driverLapData.TeamColor)) {
            encounteredTeam = true
        } else {
            encounteredTeams.push(driverLapData.TeamColor)
        }
        datasets.push({
            label: smallLabel,
            data: driverLapData.Positions,
            backgroundColor: `#${driverLapData.TeamColor}`,
            borderColor: `#${driverLapData.TeamColor}`,
            borderWidth: 1,
            borderDash: encounteredTeam ? [5, 5] : [0, 0],
            pointRadius: 10,
            pointBorderColor: 'rgba(0, 0, 0, 0)',
            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
            pointHoverBorderColor: `#${driverLapData.TeamColor}`,
            pointHoverBackgroundColor: `#${driverLapData.TeamColor}`,

        })
        // console.log(datasets);

    })
    let testDataset = {
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [0, 10, 5, 2, 20, 30, 45],
    }
    const data = {
        labels: maxLaps,
        datasets,
    };

    return data
}
function compoundStringToColour(compoundString: string) {
    switch (compoundString) {
        case 'SOFT':
            return 'red'
        case 'HARD':
            return 'white'
        case 'MEDIUM':
            return 'yellow'
        default:
            return 'none'
    }
}
const LapChart: NextPage = (props: any) => { //TODO: endpoint data types
    // console.log(props.lapData);
    const chart = useRef(null) //create reference hook
    const [tooltip, setTooltip] = useState({
        opacity: 0,
        top: 0,
        left: 0,
        lap: '',
        position: '',
        colour: "#000",
        border: 'solid',
        longname: 'tempdrivername',
        compound: 'tempcompound',
        laptime: 'templaptime'
    })
    const lapData = createDataObjectFromLapData(props.lapData)
    const title: string = props.name;
    //console.log(title);
    // console.log(tooltip);

    return (
        <div id='lap-chart-wrapper'>

            <Line data={lapData} ref={chart}
                options={{

                    scales: { y: { position: 'left', reverse: true, ticks: { autoSkip: false, stepSize: 1 } } },
                    plugins: {
                        legend: { position: 'right' }, title: { text: title, display: true, color: 'white', fullSize: true },
                        tooltip: {
                            enabled: false,
                            external: context => {
                                const tooltipModel = context.tooltip
                                if (!chart || !chart.current) return

                                if (tooltipModel.opacity === 0) {
                                    if (tooltip.opacity !== 0) setTooltip(prev => ({ ...prev, opacity: 0 }))
                                    return
                                }
                                const position = context.chart.canvas.getBoundingClientRect()
                                console.log("test", tooltipModel.dataPoints);
                                const longname = props.lapData[tooltipModel.dataPoints[0].dataset.label].Name
                                const compound = props.lapData[tooltipModel.dataPoints[0].dataset.label].Compounds[tooltipModel.dataPoints[0].dataIndex]
                                const laptime = props.lapData[tooltipModel.dataPoints[0].dataset.label].LapTimes[tooltipModel.dataPoints[0].dataIndex]

                                const index = tooltipModel.dataPoints[0].datasetIndex;
                                const colour = tooltipModel.dataPoints[0].dataset.borderColor;
                                const border = tooltipModel.dataPoints[0].dataset.borderDash[0] == 0 ? 'solid' : 'dashed'
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

                                }
                                if (!isEqual(tooltip, newTooltipData)) setTooltip(newTooltipData)
                            },
                        }
                    },

                }}
            >

            </Line>

            <div className='tooltip' style={{ backgroundColor: 'rgb(255,255,255,0.5)', padding: "5px", borderRadius: "5px", position: "absolute", top: tooltip.top, left: tooltip.left, opacity: tooltip.opacity, borderRight: `5px ${tooltip.border} ${tooltip.colour}` }}>
                <p>{tooltip.longname}</p>
                <p>Lap {tooltip.lap} </p>
                <p>Position {tooltip.position} </p>
                <p>Laptime: {tooltip.laptime} </p>
                <p style={{ border:`3px solid ${compoundStringToColour(tooltip.compound)}`}}>Compound {tooltip.compound} </p>

            </div>
        </div>
    )

}

export default LapChart