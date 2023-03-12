import {
    Chart as ChartJS,
    TooltipModel,
    ChartTypeRegistry,
    BubbleDataPoint,
    ScatterDataPoint,
} from "chart.js";

export type LapChartProps = {
    name: string,
    lapData: Racers
}
export type Driver = {
    Name: string;
    Positions: number[];
    Laps: number[];
    TeamColor: string;
    Compounds: string[];
    LapTimes: any[];
}
export type Racers = {
    [key: string]: Driver
}

export type contextType = {
    chart: ChartJS<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | null)[], unknown>;
    tooltip: TooltipModel<"line">;
}

