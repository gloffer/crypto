import React from 'react'
import { Card } from 'reactstrap'
import { PageTitle } from '../../_metronic/layout/core'
import TimeRangeModal from '../components/TimeRangeModal'
import SelectSearch, { fuzzySearch } from 'react-select-search'

// eslint-disable-next-line no-undef
const { REACT_APP_BE_URL: API_URL } = process.env

class CoinAnalysis extends React.Component {
  state = {
      intervals: [],
      interval: '1hr',
      pairs: [],
      pair: 'BTC-USD',
      dateRangeState: [
          {
              startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
              endDate: new Date(),
              key: 'selection',
          },
      ],
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

  render() {
      const {
          intervals,
          interval,
          pairs,
          pair,
          dateRangeState,
          isLoading,
      } = this.state

      if(isLoading){
          return 'Coin analysis is loading...'
      }

      return (
          <>
              <PageTitle breadcrumbs={[]}>Coin analysis</PageTitle>
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
                              onChange={event => {
                                  this.setState({ pair: event }, this.updateData)
                              }}
                              value={pair}
                          />
                      </span>
                  </div>
              </Card>
              <Card className="mt-4"></Card>
          </>
      )
  }
}

export default CoinAnalysis
