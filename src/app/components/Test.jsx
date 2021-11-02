import React from 'react'
import ReactApexChart from 'react-apexcharts'

export const Test = () => {
    const series =  [ {
        name: 'Line1',
        data: [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
        name: 'Line2',
        data: [null, null, null, null, null, 4, 3.5, 3, null, null],
    },
    {
        name: 'Points',
        data: [null, 1, null, 3, null, 4, null, 3, null, null, null],
    }]

    const options = {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false,
            },
            animations: {
                enabled: false,
            },
        },
        stroke: {
            width: [5, 5, 4],
            curve: 'straight',
        },
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        title: {
            text: 'Missing data (null values)',
        },
        xaxis: {
        },
    }

    return(
        <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={680}
        />
    )
}
