import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const Accordion = (props) => {
  const { i, expanded, setExpanded, openUpwards } = props

  const isOpen = i === expanded

  const header = (
    <motion.div
      initial={false}
      animate={{}}
      onClick={() => setExpanded(isOpen ? false : i)}
      className='accordion-header'
    >
      {props.header}
    </motion.div>
  )

  return (
    <>
      {!openUpwards && header}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            className='accordion-motion-content'
          >
            <ContentWrapper>{props.content}</ContentWrapper>
          </motion.div>
        )}
      </AnimatePresence>
      {openUpwards && header}
    </>
  )
}

Accordion.defaultProps = {
  openUpwards: false
}

const Content = (props) => <div className='accordion-content'>{props.children}</div>

export const ContentWrapper = (props) => (
  <motion.div
    variants={{ collapsed: { scale: 1 }, open: { scale: 1 } }}
    transition={{ duration: 0.8 }}
    className='accordion-content-placeholder'
  >
    <Content {...props} />
  </motion.div>
)
