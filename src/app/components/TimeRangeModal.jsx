import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap'
import { DateRange } from 'react-date-range'


// TODO -> can be replaced with date range picker from metronic?
const StrategyValuesModal = ({
    setValuesPlaceholder,
    currentRange,
}) => {
    const [modal, setModal] = useState(false)
    const [dateRangeState, setDateRangeState] = useState(currentRange)

    const toggle = () => setModal(!modal)

    return (
        <div>
            <Button color="primary" onClick={toggle}>Set time range</Button>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Set time range</ModalHeader>
                <ModalBody>
                    <DateRange
                        editableDateInputs={true}
                        onChange={item => setDateRangeState([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRangeState}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => {
                        toggle()
                        setValuesPlaceholder(dateRangeState)
                    }}>Set</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

StrategyValuesModal.propTypes = {
    setValuesPlaceholder: PropTypes.func.isRequired,
    currentRange: PropTypes.array.isRequired,
}

export default StrategyValuesModal
