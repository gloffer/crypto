import React, {
    useEffect, useState,
} from 'react'
import {
    Label,
    Input,
} from 'reactstrap'
import PropTypes from 'prop-types'

const TextInput = ({
    header,
    defaultValue,
    callbackFn,
}) => {
    const [searchTerm, setSearchTerm] = useState(defaultValue)

    useEffect(() => {
        const delayBounceFn = setTimeout(() => {
            if (searchTerm && !isNaN(searchTerm)) {
                callbackFn(searchTerm)
            }
        }, 500)

        return () => clearTimeout(delayBounceFn)
    }, [searchTerm])

    return (
        <>
            {/* {header && <Label for="changeValue">{header}</Label>} */}
            <Input
                type="text"
                name="changeValue"
                id="changeValue"
                onChange={event => setSearchTerm(event.target.value)
                }
                value={searchTerm}
                placeholder={header}
            />
        </>
    )
}

TextInput.propTypes = {
    header: PropTypes.string,
    defaultValue: PropTypes.string.isRequired,
    callbackFn: PropTypes.func.isRequired,
}

export default TextInput
