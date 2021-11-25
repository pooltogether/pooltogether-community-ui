import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useReducedMotion, useScreenSize, ScreenSize } from '@pooltogether/hooks'

import { NotificationBannerList, notificationBannerVisibleAtom } from './NotificationBannerList'

/**
 * Default layout includes a page header, side nav for desktop screens and bottom nav for mobile
 * @param {*} props
 * @returns
 */
export const DefaultLayout = (props) => {
  const { content, header, sideNav, bottomNav, footer, banner, router } = props

  return (
    <AnimatedPageGrid
      router={router}
      banner={<NotificationBannerList>{banner}</NotificationBannerList>}
      header={header}
      content={content}
      sideNavigation={sideNav}
      bottomNavigation={bottomNav}
      footer={footer}
    />
  )
}

/**
 * Simple layout does not include a sidebar or mobile navigation
 * Any navigation is expected to be floating or in the header
 * @param {*} props
 * @returns
 */
export const SimpleLayout = (props) => {
  const { content, header, footer, banner } = props

  return (
    <SimplePageGrid
      banner={<NotificationBannerList>{banner}</NotificationBannerList>}
      header={header}
      content={content}
      footer={footer}
    />
  )
}
//

/**
 * Generic page layout component
 * Small screens displays navigation at the bottom of the page
 * Anything larger than sm has a sidebar
 */
const DefaultPageGrid = ({ banner, header, sideNavigation, bottomNavigation, content, footer }) => {
  const screenSize = useScreenSize()

  if (screenSize <= ScreenSize.sm) {
    return (
      <div className='grid-page-wrapper'>
        <div className='grid-header-wrapper bg-body z-10'>
          <div className='grid-banner'>{banner}</div>
          <div className='grid-header w-full bg-body z-10 mx-auto l-0 r-0'>{header}</div>
        </div>
        <ContentWithFooter content={content} footer={footer} />
        <div className='bottom-navigation fixed b-0'>{bottomNavigation}</div>
      </div>
    )
  }

  return (
    <div className='grid-page-wrapper'>
      <div className='grid-header-wrapper bg-body z-10 w-full'>
        <div className='grid-banner'>{banner}</div>
        <div className='grid-header w-full bg-body z-10 mx-auto l-0 r-0'>{header}</div>
      </div>

      <ContentWithSideNavigation
        content={content}
        footer={footer}
        sideNavigation={sideNavigation}
      />
    </div>
  )
}

/**
 * Generic page layout component
 * Small screens displays navigation at the bottom of the page
 * Anything larger than sm has a sidebar
 */
const SimplePageGrid = ({ banner, header, content, footer }) => {
  return (
    <div className='grid-page-wrapper'>
      <div className='grid-header-wrapper bg-body z-10'>
        <div className='grid-banner'>{banner}</div>
        <div className='grid-header w-full bg-body z-10 mx-auto l-0 r-0'>{header}</div>
      </div>
      <ContentWithFooter content={content} footer={footer} />
    </div>
  )
}

//

/**
 * Simple wrapper for PageGrid with animations on the page content
 * // TODO: Add back the router funnelling for the key!
 */
const AnimatedPageGrid = ({
  banner,
  header,
  sideNavigation,
  bottomNavigation,
  content,
  footer,
  router
}) => (
  <DefaultPageGrid
    banner={banner}
    header={header}
    content={<AnimateContent router={router}>{content}</AnimateContent>}
    footer={footer}
    sideNavigation={sideNavigation}
    bottomNavigation={bottomNavigation}
  />
)

/**
 * Page content with a footer pushed to the bottom of the screen
 */
const ContentWithFooter = ({ content, footer }) => (
  <div className='grid-content-with-footer sticky pb-24 sm:pb-0'>
    <Content>{content}</Content>
    <div className='grid-footer'>{footer}</div>
  </div>
)

/**
 * Page content with a footer pushed to the bottom of the screen
 * and a navigation bar to the left side
 */
const ContentWithSideNavigation = ({ content, footer, sideNavigation }) => {
  const [notificationBannerVisible] = useAtom(notificationBannerVisibleAtom)
  const top = notificationBannerVisible ? 184 : 138

  return (
    <div className='desktop-content-wrapper flex justify-between w-full mx-auto pt-8'>
      <div className='fixed' style={{ top, height: `calc(100% - ${top}px)` }}>
        {sideNavigation}
      </div>
      <div className='push-sidebar-padding flex flex-col flex-1'>
        <Content>{content}</Content>
        {footer}
      </div>
    </div>
  )
}

/**
 * Lowest level wrapper of page content
 * Base padding so content isn't touching the edge of the screen
 */
const Content = ({ children }) => (
  <div className='grid-content p-4 sm:pt-0 sm:px-8 lg:pt-0 lg:px-10 text-inverse max-w-5xl lg:max-w-6xl w-full mx-auto lg:ml-auto'>
    {children}
  </div>
)

/**
 * Simple wrapper for Content with animation
 */
const AnimateContent = (props) => {
  const shouldReduceMotion = useReducedMotion()
  const { router } = props

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        id='content-animation-wrapper'
        key={router?.route}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeIn' }}
        initial={{
          opacity: 0
        }}
        exit={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        className='mx-auto w-full'
      >
        {props.children}
      </motion.div>
    </AnimatePresence>
  )
}
