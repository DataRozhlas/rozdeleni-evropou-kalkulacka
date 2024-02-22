import {
    HighchartsChart,
    Chart,
    XAxis,
    YAxis,
    ColumnSeries,
    Tooltip
} from "react-jsx-highcharts";

import data from "../../srv/data/qas.json"

const MiniChart = ({ title, categories, start, end, selectedAnswer, current, index }: { title: string, categories: string[], start: number, end: number, selectedAnswer: number, current: number, index: number }) => {

    const dataPoints = data[current].a[selectedAnswer - 1].slice(start, end + 1)


    return (
        <div>
            <div className="text-sm font-semibold text-center pb-2">{title}</div>
            <HighchartsChart className="w-full h-auto aspect-[1/1]" plotOptions={{
                column: {
                    pointWidth: 40,
                    events: {
                        legendItemClick: function () {
                            return false;
                        }
                    }
                },
                series: {
                    animation: false,
                }
            }}>
                <Chart type="column" marginBottom={80}/>
                <XAxis categories={categories} labels={{ rotation: -45 }} />
                <YAxis max={75} labels={{ enabled: index % 2 === 0 ? true : false, formatter: function () { return this.isLast ? `${this.value} %` : `${this.value}` } }}>
                    <ColumnSeries name="Podíl odpovědí" data={dataPoints} color={"#ccc"} />
                </YAxis>
                <Tooltip valueDecimals={1} valueSuffix="%" />
            </HighchartsChart>
        </div>
    )
}

export default MiniChart;