import React from 'react'
import PropTypes from 'prop-types'

const tempPatterns = [
    {
        unixtime: 1635166344000,
        patternName: 'Rising sun',
        bullish: true,
    },
    {
        unixtime: 1635166444000,
        patternName: 'Hammer',
        bullish: true,
    },
    {
        unixtime: 1635166644000,
        patternName: 'Bearish engulfing',
        bullish: false,
    },
    {
        unixtime: 1635166844000,
        patternName: 'Bearish shooting star',
        bullish: false,
    },
]

const options = {
    month: 'numeric',
    day:'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
}

const PatternList = ({ patterns }) => {
    console.log(patterns)

    return (
        <div className={'card'}>
            <div className='card-header align-items-center border-0 mt-4'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='fw-bolder mb-2 text-dark'>Patterns</span>
                </h3>
            </div>
            <div className='card-body pt-5'>
                <div className='timeline-label'>
                    {tempPatterns?.map(pattern => (
                        <div className='timeline-item' key={pattern.unixtime}>
                            <div className='timeline-label fw-bolder text-gray-800 fs-6'>{new Date(pattern.unixtime).toLocaleString('en-US', options)}</div>
                            <div className='timeline-badge'>
                                {
                                    pattern.bullish
                                        ?
                                        <i className='fa fa-genderless text-success fs-1' />
                                        :
                                        <i className='fa fa-genderless text-danger fs-1' />
                                }
                            </div>
                            <div className='fw-mormal timeline-content text-muted ps-3'>
                                {pattern.patternName}
                            </div>
                        </div>
                    ))}
                </div>
                {/* end::Timeline */}
            </div>
            {/* end: Card Body */}
        </div>)
}

PatternList.propTypes = {
    patterns: PropTypes.array.isRequired,
}

export default PatternList
