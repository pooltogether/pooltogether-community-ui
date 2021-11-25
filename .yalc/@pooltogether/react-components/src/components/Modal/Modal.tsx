import React from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import Dialog from '@reach/dialog'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@pooltogether/hooks'

export interface ModalProps {
  isOpen: boolean
  closeModal: () => void
  label: string
  children: React.ReactNode
  className?: string
  widthClassName?: string
  heightClassName?: string
  maxWidthClassName?: string
  maxHeightClassName?: string
  paddingClassName?: string
  bgClassName?: string
  roundedClassName?: string
  shadowClassName?: string
  overflowClassName?: string
  style?: object
}

export const Modal = (props: ModalProps) => {
  const {
    isOpen,
    closeModal,
    children,
    label,
    className,
    widthClassName,
    heightClassName,
    maxWidthClassName,
    maxHeightClassName,
    paddingClassName,
    bgClassName,
    roundedClassName,
    shadowClassName,
    overflowClassName,
    style
  } = props

  const shouldReduceMotion = useReducedMotion()

  if (!label) {
    console.warn('Modal required a label! <Modal /> with children:', children)
  }

  return (
    <Dialog aria-label={label} isOpen={isOpen} onDismiss={closeModal}>
      <motion.div
        id='modal-animation-wrapper'
        key={label}
        transition={{ duration: shouldReduceMotion ? 0 : 0.1, ease: 'easeIn' }}
        initial={{
          opacity: 0
        }}
        exit={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        className={classnames(
          'mx-auto relative',
          widthClassName,
          heightClassName,
          maxWidthClassName,
          maxHeightClassName,
          paddingClassName,
          bgClassName,
          roundedClassName,
          shadowClassName,
          overflowClassName,
          className
        )}
        style={style}
      >
        <CloseModalButton closeModal={closeModal} />
        {children}
      </motion.div>
    </Dialog>
  )
}

Modal.defaultProps = {
  noPad: false,
  noSize: false,
  bgClassName: 'bg-new-modal',
  roundedClassName: 'rounded-none sm:rounded-xl',
  maxWidthClassName: 'sm:max-w-lg',
  widthClassName: 'w-screen sm:w-full',
  heightClassName: 'h-screen sm:h-auto',
  maxHeightClassName: 'max-h-screen',
  paddingClassName: 'px-2 xs:px-8 py-10',
  shadowClassName: 'shadow-3xl',
  overflowClassName: 'overflow-y-auto'
}

const CloseModalButton = (props) => {
  const { closeModal } = props
  return (
    <button
      className='my-auto ml-auto close-button trans text-inverse opacity-80 hover:opacity-100 absolute right-7 top-6'
      onClick={closeModal}
    >
      <FeatherIcon icon='x' className='w-6 h-6' />
    </button>
  )
}
