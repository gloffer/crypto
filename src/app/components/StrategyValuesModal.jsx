import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
} from 'reactstrap'

const StrategyValuesModal = ({
    strategyName,
    neededValues,
    alreadySetValues,
    setValuesPlaceholder,
    valueModificator,
}) => {
    const [modal, setModal] = useState(false)
    const [values, setValues] = useState(alreadySetValues)

    const toggle = () => setModal(!modal)

    const callSetValuesIfCan = () => {
        if (Object.keys(values).length >= neededValues.length) {
            setValuesPlaceholder(values)
        }
    }

    const updateValues = (valueName, event) => {
        const valuesCopy = values
        valuesCopy[valueName] = event.target.value
        setValues(valuesCopy)
    }

    return (
        <div>
            <Button color="primary" onClick={toggle}>Set strategy values</Button>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Set strategy values for {strategyName} </ModalHeader>
                <ModalBody>
                    All values are modified by value {valueModificator}
                    {neededValues.map(neededValue => (
                        <Input
                            onChange={event => updateValues(neededValue, event)}
                            placeholder={neededValue}
                            key={neededValue}
                            defaultValue={values[neededValue]}
                            className="my-2"
                        />
                    ))}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => {
                        toggle()
                        callSetValuesIfCan()
                    }}>Set strategy values</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

StrategyValuesModal.propTypes = {
    strategyName: PropTypes.string.isRequired,
    neededValues: PropTypes.array.isRequired,
    alreadySetValues: PropTypes.object,
    setValuesPlaceholder: PropTypes.func.isRequired,
    valueModificator: PropTypes.number.isRequired,
}

export default StrategyValuesModal
