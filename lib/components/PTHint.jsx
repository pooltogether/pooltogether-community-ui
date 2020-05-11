import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Tooltip from 'react-tooltip-lite'

export const PTHint = class _PTHint extends Component {
  static propTypes = {
    children: PropTypes.object,
    tip: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  state = { tipOpen: false }

  showTip = (e) => {
    e.preventDefault()
    e.stopPropagation()

    this.setState({ tipOpen: true })
  }

  hideTip = (e) => {
    e.preventDefault()
    e.stopPropagation()

    this.setState({ tipOpen: false })
  }

  toggleTip = (e) => {
    e.preventDefault()
    e.stopPropagation()

    this.setState({ tipOpen: !this.state.tipOpen })
  }

  render () {
    const {
      children,
      childrenClassName,
      tip,
      className
    } = this.props

    let buttonText

    const cn = className || ''
    const ccn = childrenClassName || 'cursor-pointer trans'
    const childrenProvided = children

    if (childrenProvided) {
      buttonText = children
    } else {
      buttonText = <span
        className='flex items-center justify-center inline-block bg-white rounded-full w-4 h-4 text-blue-500 text-center font-bold'
      >
        <span
          className='relative text-xs'
          style={{
            top: -1,
            left: '0.03rem'
          }}
        >
          ?
        </span>
      </span>
    }

    return <>
      <span
        onMouseEnter={this.showTip}
        onMouseLeave={this.hideTip}
        onTouchStart={this.toggleTip}
        className={ccn}
      >
        {buttonText}
      </span>

      <Tooltip
        content={tip}
        className={cn}
        isOpen={this.state.tipOpen}
        distance={200}
        forceDirection={false}
        content={
          <span
            className='flex flex-col items-center justify-center h-full'
          >
            {tip}
          </span>
        }
      >
        <></>
      </Tooltip>
    </>

  }
}