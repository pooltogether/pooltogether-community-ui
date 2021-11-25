import React, { useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import VisuallyHidden from '@reach/visually-hidden'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@pooltogether/hooks'

/**
 * TODO: Make settings extendible for all apps
 * @param {*} props
 * @returns
 */
export function SettingsContainer (props) {
  const { t, className, sizeClassName } = props
  const [isOpen, setIsOpen] = useState(false)

  const shouldReduceMotion = useReducedMotion()

  const toggleOpen = (e) => {
    e.preventDefault()

    setIsOpen(!isOpen)
  }

  return (
    <>
      <button
        onClick={toggleOpen}
        className={classnames('hover:text-inverse', sizeClassName, className, {
          'text-highlight-2': !isOpen,
          'text-highlight-1': isOpen
        })}
      >
        <FeatherIcon icon='settings' className='w-6 w-6' strokeWidth='0.09rem' />
      </button>

      <motion.div
        key='settings-overlay'
        onClick={toggleOpen}
        className={classnames('fixed t-0 l-0 r-0 b-0 w-full h-full z-40 bg-overlay bg-blur', {
          'pointer-events-none': !isOpen
        })}
        animate={isOpen ? 'enter' : 'exit'}
        initial='initial'
        transition={{ duration: shouldReduceMotion ? 0 : 0.1 }}
        variants={{
          exit: { opacity: 0 },
          enter: { opacity: 1 },
          initial: { opacity: 0 }
        }}
      />

      <motion.div
        className='bg-highlight-3 border-l h-full fixed t-0 b-0 z-40 px-8 pr-16 py-8 shadow-md'
        style={{
          borderColor: 'black',
          height: '100vh',
          right: -30,
          width: '320px'
        }}
        animate={isOpen ? 'enter' : 'exit'}
        initial='initial'
        variants={{
          exit: {
            x: '320px',
            opacity: 0,
            transition: {
              duration: shouldReduceMotion ? 0 : 0.2,
              staggerChildren: shouldReduceMotion ? 0 : 0.1
            }
          },
          enter: {
            x: 0,
            opacity: 1,
            transition: {
              duration: shouldReduceMotion ? 0 : 0.1,
              staggerChildren: shouldReduceMotion ? 0 : 0.1
            }
          },
          initial: {
            x: 0,
            opacity: 0,
            transition: {
              duration: shouldReduceMotion ? 0 : 0.1
            }
          }
        }}
      >
        <button
          onClick={toggleOpen}
          className={classnames(
            'absolute close-button hover:opacity-70 trans text-white hover:text-white',
            'outline-none focus:outline-none active:outline-none top-6 right-12'
          )}
        >
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>
            <FeatherIcon icon='x' className='w-6 h-6 stroke-current' />
          </span>
        </button>

        <h6 className='text-white mt-4 mb-10 uppercase font-semibold'>
          {t('settings', 'Settings')}
        </h6>

        {props.children}
      </motion.div>
    </>
  )
}

SettingsContainer.defaultProps = {
  sizeClassName: 'w-5 h-5 sm:w-6 sm:h-6',
  className: ''
}
