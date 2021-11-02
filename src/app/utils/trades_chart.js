function findAvgPercentChange(candlesData){
    let percentChanges = []
    for (let i = 0; i < candlesData.length - 1; i++) {
        let currentCandleCenter = (candlesData[i].high + candlesData[i].close) / 2
        let nextCandleCenter = (candlesData[i + 1].high + candlesData[i + 1].close) / 2
        let percentChange = (nextCandleCenter - currentCandleCenter) / Math.abs(currentCandleCenter)
        percentChanges.push(Math.abs(percentChange))
    }
    let sum = percentChanges.reduce(function (a, b) {
        return a + b
    }, 0)
    let avgPercentChange = sum / percentChanges.length

    return avgPercentChange
}

export function getGraphValues(candlesData, buyPoints, sellPoints, descriptionPoints){
    const candles = []
    const volumes = []
    let min = Number.MAX_SAFE_INTEGER
    let max = 0

    let avgPercentChange = findAvgPercentChange(candlesData)

    candlesData
        ?.forEach(candle => {
            const {
                unixtime, low, high, open, close, volume,
            } = candle

            if (low < min) {
                min = low
            }
            if (high > max) {
                max = high
            }

            candles.push({
                x: new Date(unixtime * 1000),
                y: [open, high, low, close],
            })

            volumes.push({
                x: new Date(unixtime * 1000),
                y: volume,
            })
        })

    const candleSeries = [
        {
            name: 'Candles',
            data: candles,
            type: 'candlestick',
        },
        {
            name: 'Buy points',
            data: buyPoints.map((point => (
                {
                    x: new Date(point[0] * 1000),
                    y: point[1],
                }
            ))),
            type: 'scatter',
        },
        {
            name: 'Sell points',
            data: sellPoints.map((point => (
                {
                    x: new Date(point[0] * 1000),
                    y: point[1],
                }
            ))),
            type: 'scatter',
        },
    ]

    const volumeSeries = [
        {
            name: 'volume',
            data: volumes,
        },
    ]

    const options = {
        chart: {
            type: 'scatter',
            height: 680,
            id: 'candles',
            toolbar: {
                autoSelected: 'pan',
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        xaxis: {
            type: 'datetime',
        },
        yaxis: {
            tooltip: {
                intersect: true,
                enabled: true,
            },
            min,
            max,
        },
        annotations: {
            xaxis: descriptionPoints.map(point => ({
                x: new Date(point[0] * 1000).getTime(),
                strokeDashArray: 0,
                borderColor: '#00E396',
                label: {
                    borderColor: '#00E396',
                    style: {
                        color: '#fff',
                        background: '#00E396',
                    },
                    text: point[1],
                },
            })),
        },
    }

    const optionsBar = {
        chart: {
            height: 200,
            type: 'bar',
            brush: {
                enabled: true,
                target: 'candles',
            },
            selection: {
                enabled: true,
                xaxis: {
                },
                fill: {
                    color: '#ccc',
                    opacity: 0.4,
                },
                stroke: {
                    color: '#0D47A1',
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            bar: {
                columnWidth: '80%',
                colors: {
                    ranges: [
                        {
                            from: -1000,
                            to: 0,
                            color: '#F15B46',
                        }, {
                            from: 1,
                            to: 10000,
                            color: '#FEB019',
                        },
                    ],
                },
            },
        },
        stroke: {
            width: 0,
        },
        xaxis: {
            type: 'datetime',
            axisBorder: {
                offsetX: 13,
            },
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
    }

    return {
        avgPercentChange,
        candleSeries,
        volumeSeries,
        options,
        optionsBar,
    }
}
