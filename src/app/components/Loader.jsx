import React, { Component } from 'react'
import classnames from 'classnames'

/**
 * @description Base loader definition
 *      USAGE
 *          <Loader
 *              *** PROPS ***
 *          />
 *
 *      PROPS - all props are optional
 *          height    - height of loader
 *          width     - width of loader
 *          className - additional CSS classes
 *
 */

export default class Loader extends Component {
  /**
     * Render
     *
     * @return {*}
     */
  render = () => (
      <div className={classnames({
          'loader': true,
          [this.props.className]: !!this.props.className,
      })}>
          <div className="loader__inner">
              <div className="loader__content">
              </div>
          </div>
      </div>
  )
}
