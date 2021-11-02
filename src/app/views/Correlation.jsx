/* eslint-disable max-lines */
import React from 'react'
import { Card } from 'reactstrap'
import { PageTitle } from '../../_metronic/layout/core'
import TimeRangeModal from '../components/TimeRangeModal'
import SelectSearch, { fuzzySearch } from 'react-select-search'
import TextInput from '../components/TextInput'
import classNames from 'classnames'

// eslint-disable-next-line no-undef
const { REACT_APP_BE_URL: API_URL } = process.env

class Correlation extends React.Component {
    state = {
        intervals: [],
        interval: '1hr',
        pairs: [],
        selectedPairs: 'BTC-USD',
        index: 1,
        indexes: [
            {
                name: 'All',
                value: '-1',
            },
            {
                name: 'First',
                value: '0',
            },
            {
                name: 'Second',
                value: '1',
            }],
        limit: '8',
        limitTypes: [
            {
                name: 'N best correlations',
                value: 0,
            },
            {
                name: 'Correlations on N',
                value: 1,
            },
        ],
        limitType: 0,
        corrValues: [
            {
                name: 'Low',
                value: 'low',
            },
            {
                name: 'High',
                value: 'high',
            },
            {
                name: 'Open',
                value: 'open',
            },
            {
                name: 'Close',
                value: 'close',
            },
            {
                name: 'Average low high',
                value: 'avg_low_high',
            },
            {
                name: 'Average open close',
                value: 'avg_open_close',
            },
        ],
        corrValue: 'close',
        dateRangeState: [
            {
                startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
                endDate: new Date(),
                key: 'selection',
            },
        ],
        correlations: [],
        isLoading: true,
    }

    componentDidMount() {
        Promise.all([
            fetch(`${API_URL}pairs`).then(data => data.text()),
            fetch(`${API_URL}intervals`).then(data => data.text()),
        ]).then(data => {
            this.setState({ pairs: JSON.parse(JSON.parse(data[0])?.pairs) })
            this.setState({ intervals: JSON.parse(JSON.parse(data[1])?.intervals) })
            this.setState({ isLoading: false })
        })
    }

    updateData = () => {
        const {
            selectedPairs: pair,
            index,
            limit,
            limitType,
            corrValue,
            interval,
            dateRangeState,
        } = this.state

        Promise.all([
            fetch(`${API_URL}correlations/?pair=${pair}&index=${index}&limit_type=${limitType}&limit=${limit}&corr_value=${corrValue}&interval=${interval}&start_date=${Math.round(dateRangeState[0].startDate?.getTime() / 1000)}&end_date=${Math.round(dateRangeState[0].endDate?.getTime() / 1000) || ''}`)
                .then(data => data.text()),
        ]).then(data => {
            if (JSON.parse(data[0])?.correlations) {
                this.setState({ correlations: Object.entries(JSON.parse(data[0])?.correlations[pair]) })
            }
        })
    }


    render() {
        const {
            intervals,
            interval,
            pairs,
            selectedPairs: pair,
            index,
            indexes,
            corrValues,
            corrValue,
            dateRangeState,
            limit,
            limitTypes,
            limitType,
            correlations,
            isLoading,
        } = this.state

        if (isLoading) {
            return 'Correlations are loading...'
        }

        return (
            <>
                <PageTitle breadcrumbs={[]}>Correlation</PageTitle>
                <Card>
                    <div className="m-4 d-flex justify-content-between">
                        <span className="mx-2">
                            <TimeRangeModal
                                setValuesPlaceholder={dateRangeValues => this.setState({ dateRangeState: dateRangeValues }, this.updateData)}
                                currentRange={dateRangeState}
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
                                multiple
                                onChange={event => {
                                    this.setState({ pair: event })
                                }}
                                value={pair}
                            />
                        </span>
                        <span className="mx-2">
                            <SelectSearch
                                options={
                                    indexes.map(indexMap => (
                                        {
                                            name: indexMap.name,
                                            value: indexMap.value,
                                        }
                                    ))
                                }
                                search
                                filterOptions={fuzzySearch}
                                placeholder="Select desired index"
                                onChange={event => {
                                    this.setState({ index: event }, this.updateData)
                                }}
                                value={index}
                            />
                        </span>
                    </div>
                    <div className="m-4 d-flex justify-content-between">
                        <span className="mx-2">
                            <SelectSearch
                                options={
                                    corrValues.map(corrValueMap => (
                                        {
                                            name: corrValueMap.name,
                                            value: corrValueMap.value,
                                        }
                                    ))
                                }
                                search
                                filterOptions={fuzzySearch}
                                placeholder="Select desired correlation value"
                                onChange={event => {
                                    this.setState({ corrValue: event }, this.updateData)
                                }}
                                value={corrValue}
                            />
                        </span>
                        <span className="mx-2">
                            <SelectSearch
                                options={
                                    limitTypes.map(limitTypeMap => (
                                        {
                                            name: limitTypeMap.name,
                                            value: limitTypeMap.value,
                                        }
                                    ))
                                }
                                search
                                filterOptions={fuzzySearch}
                                placeholder="Select desired limit type"
                                onChange={event => {
                                    this.setState({ limitType: event }, this.updateData)
                                }}
                                value={limitType}
                            />
                        </span>
                    </div>
                    <div className="m-4 d-flex justify-content-between">
                        <span className="mx-2">
                            <TextInput
                                header="How many correlations?"
                                defaultValue={limit}
                                callbackFn={value => this.setState({ limit: value }, this.updateData)}
                            />
                        </span>
                    </div>
                </Card>
                <Card className="mt-5">
                    <div className='card-body py-3'>
                        <div className='table-responsive'>
                            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                                <thead>
                                    <tr className='fw-bolder text-muted'>
                                        <th className='w-25px'>
                                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                                <input className='form-check-input' type='checkbox' value='1' data-kt-check='true' data-kt-check-target='.widget-9-check' />
                                            </div>
                                        </th>
                                        <th className='min-w-150px'>Pair</th>
                                        <th className='min-w-120px'>Correlation value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        correlations?.map(correlation => (
                                            <tr key={correlation}>
                                                <td>
                                                    <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                                        <input className='form-check-input widget-9-check' type='checkbox' value='1' />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='d-flex align-items-center'>
                                                        {/* <div className='symbol symbol-45px me-5'>
                                                    <img src={toAbsoluteUrl('/media/avatars/150-11.jpg')} alt='' />
                                                </div> */}
                                                        <div className='d-flex justify-content-start flex-column'>
                                                            <a href='#' className='text-dark fw-bolder text-hover-primary fs-6'>
                                                                {correlation[0]}
                                                            </a>
                                                            {/* <span className='text-muted fw-bold text-muted d-block fs-7'>
                                                                HTML, JS, ReactJS
                                                            </span> */}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='text-end'>
                                                    <div className='d-flex flex-column w-100 me-2'>
                                                        <div className='d-flex flex-stack mb-2'>
                                                            <span className='text-muted me-2 fs-7 fw-bold'>{Math.round(correlation[1] * 100)} %</span>
                                                        </div>
                                                        <div className='progress h-6px w-100'>
                                                            <div className={classNames(
                                                                'progress-bar',
                                                                {
                                                                    'bg-danger': correlation[1] < -0.1,
                                                                    'bg-primary': correlation[1] > -0.1 && correlation[1] < 0.9,
                                                                    'bg-success': correlation[1] > 0.9,
                                                                },
                                                            )} role='progressbar' style={{ width: Math.round(((correlation[1] + 1) / 2) * 100) + '%' }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            </>
        )
    }
}

export default Correlation
