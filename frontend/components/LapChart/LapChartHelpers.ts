import { Driver, Racers } from "./LapChartTypes";


export function createDataObjectFromLapData(lapData: Racers) {

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

export function compoundStringToColour(compoundString: string) {
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
