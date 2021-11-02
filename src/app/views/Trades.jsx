/* eslint-disable max-lines */
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import SelectSearch, { fuzzySearch } from 'react-select-search'
import StrategyValuesModal from '../components/StrategyValuesModal'
import TimeRangeModal from '../components/TimeRangeModal'
import PatternList from '../components/PatternList'
import { Card } from 'reactstrap'
import { PageTitle } from '../../_metronic/layout/core'
import Loader from '../components/Loader'
import { getGraphValues } from '../utils/trades_chart'

// eslint-disable-next-line no-undef
const { REACT_APP_BE_URL: API_URL } = process.env

class Trades extends React.Component {
    state = {
        candlesData: [],
        buyPoints: [],
        sellPoints: [],
        descriptionPoints: [],
        pairs: [],
        intervals: [],
        strategies: [],
        strategiesNeededValues: null,
        filledValues: {},
        isLoading: true,
        pair: 'BTC-USD',
        interval: '1hr',
        strategy: 'high_low_strategy',
        dateRangeState: [
            {
                startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
                endDate: new Date(),
                key: 'selection',
            },
        ],
    }

    updateData = () => {
        const {
            pair,
            filledValues,
            interval,
            strategy,
            dateRangeState,
        } = this.state

        Promise.all([
            fetch(`${API_URL}candles/?pair=${pair}&strategy_values=${JSON.stringify(filledValues)}&interval=${interval}&strategy=${strategy}&start_date=${dateRangeState[0].startDate?.getTime() / 1000}&end_date=${dateRangeState[0].endDate?.getTime() / 1000 || ''}`)
                .then(data => data.text()),
        ]).then(data => {
            this.setState({ candlesData: JSON.parse(JSON.parse(data[0])?.candles) })
            this.setState({ buyPoints: JSON.parse(JSON.parse(data[0])?.buy_points) })
            this.setState({ sellPoints: JSON.parse(JSON.parse(data[0])?.sell_points) })
            this.setState({ descriptionPoints: JSON.parse(JSON.parse(data[0])?.note_points) })
        })
    }

    componentDidMount() {
        const {
            pair,
            filledValues,
            interval,
            strategy,
            dateRangeState,
        } = this.state

        Promise.all([
            fetch(`${API_URL}candles/?pair=${pair}&strategy_values=${JSON.stringify(filledValues)}&interval=${interval}&strategy=${strategy}&start_date=${dateRangeState[0].startDate?.getTime() / 1000}&end_date=${dateRangeState[0].endDate?.getTime() / 1000 || ''}`)
                .then(data => data.text()),
            fetch(`${API_URL}pairs`).then(data => data.text()),
            fetch(`${API_URL}intervals`).then(data => data.text()),
            fetch(`${API_URL}strategies`).then(data => data.text()),
        ]).then(data => {
            this.setState({ candlesData: JSON.parse(JSON.parse(data[0])?.candles) })
            this.setState({ buyPoints: JSON.parse(JSON.parse(data[0])?.buy_points) })
            this.setState({ sellPoints: JSON.parse(JSON.parse(data[0])?.sell_points) })
            this.setState({ descriptionPoints: JSON.parse(JSON.parse(data[0])?.note_points) })
            this.setState({ pairs: JSON.parse(JSON.parse(data[1])?.pairs) })
            this.setState({ intervals: JSON.parse(JSON.parse(data[2])?.intervals) })
            this.setState({ strategies: JSON.parse(JSON.parse(data[3])?.strategies) })
            this.setState({ strategiesNeededValues: JSON.parse(JSON.parse(data[3])?.strategies_input) })
            this.setState({ isLoading: false })
        })
    }

    render() {
        const {
            candlesData,
            buyPoints,
            sellPoints,
            descriptionPoints,
            isLoading,
            strategiesNeededValues,
            strategy,
            filledValues,
            pairs,
            pair,
            intervals,
            interval,
            strategies,
            dateRangeState,
        } = this.state

        const {
            avgPercentChange,
            candleSeries,
            volumeSeries,
            options,
            optionsBar,
        } = getGraphValues(candlesData, buyPoints, sellPoints, descriptionPoints)

        if(isLoading) {
            return 'Graph is loading...'
        }

        return (
            <>
                {isLoading && <Loader />}
                <PageTitle breadcrumbs={[]}>Trades</PageTitle>
                <Card>
                    <div className="m-4 d-flex justify-content-between">
                        {strategiesNeededValues &&
                            <span className="mx-2">
                                <StrategyValuesModal
                                    strategyName={strategy}
                                    neededValues={strategiesNeededValues[strategy]}
                                    alreadySetValues={filledValues}
                                    setValuesPlaceholder={valuesResult => this.setState({ filledValues: valuesResult }, this.updateData)}
                                    valueModificator={avgPercentChange}
                                />

                            </span>
                        }
                        <span className="mx-2">
                            <TimeRangeModal
                                setValuesPlaceholder={dateRangeValues => this.setState({ dateRangeState: dateRangeValues }, this.updateData)}
                                currentRange={dateRangeState}
                            />
                        </span>
                    </div>
                    <div className="m-4 d-flex justify-content-between">
                        <span className="mx-2">
                            <SelectSearch
                                options={
                                    pairs.map(pairMap => (
                                        {
                                            name: pairMap[0],
                                            value: pairMap[0],
                                        }
                                    ))
                                }
                                search
                                filterOptions={fuzzySearch}
                                placeholder="Select cryptocurrency pair"
                                onChange={event => {
                                    this.setState({ pair: event }, this.updateData)
                                }}
                                value={pair}
                            />
                        </span>
                        <span className="mx-2">
                            <SelectSearch
                                options={
                                    intervals.map(intervalMap => (
                                        {
                                            name: intervalMap,
                                            value: intervalMap,
                                        }
                                    ))
                                }
                                search
                                filterOptions={fuzzySearch}
                                placeholder="Select desired interval"
                                onChange={event => {
                                    this.setState({ interval: event }, this.updateData)
                                }}
                                value={interval}
                            />
                        </span>
                    </div>
                    <div className="m-4 d-flex justify-content-between">
                        <span className="mx-2">
                            <SelectSearch
                                options={
                                    strategies.map(strategyMap => (
                                        {
                                            name: strategyMap,
                                            value: strategyMap,
                                        }
                                    ))
                                }
                                search
                                filterOptions={fuzzySearch}
                                placeholder="Select desired algorithm"
                                onChange={event => {
                                    this.setState({ strategy: event }, this.updateData)
                                }}
                                value={strategy}
                            />
                        </span>
                    </div>
                </Card>
                <Card className="mt-5">
                    <div className="chart-box">
                        <div id="chart-candlestick">
                            <ReactApexChart
                                options={options}
                                series={candleSeries}
                                type="scatter"
                                height={680}
                            />
                        </div>
                        <div id="chart-bar">
                            <ReactApexChart
                                options={optionsBar}
                                series={volumeSeries}
                                type="bar"
                                height={160}
                            />
                        </div>
                    </div>
                </Card>
                <Card className="mt-5">
                    <PatternList patterns={[]} />
                </Card>
            </>
        )
    }
}

export default Trades
