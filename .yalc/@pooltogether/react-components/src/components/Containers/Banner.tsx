import React from 'react'
import classnames from 'classnames'

export const BannerTheme = {
  purplePink: 'purplePink',
  rainbow: 'rainbow',
  rainbowBorder: 'rainbowBorder',
  purplePinkBorder: 'purplePinkBorder'
}

interface BannerProps {
  theme?: string
  defaultBorderRadius: string
  defaultPadding: string
  className?: string
  outerClassName?: string
  innerClassName?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

export const Banner = (props: BannerProps) => {
  const { theme, className, children, style, outerClassName, innerClassName } = props
  const { defaultBorderRadius, defaultPadding } = props

  const bannerClasses = {
    'p-6 sm:p-8': defaultPadding,
    'rounded-lg': defaultBorderRadius
  }

  if (theme === BannerTheme.rainbow) {
    return (
      <div
        className={classnames(bannerClasses, 'pool-gradient-3 text-purple', className)}
        style={style}
      >
        {children}
      </div>
    )
  } else if (theme === BannerTheme.rainbowBorder) {
    return (
      <div className={classnames('text-inverse p-1 rounded-lg pool-gradient-3', outerClassName)}>
        <div className={classnames(bannerClasses, 'bg-body', innerClassName)} style={style}>
          {children}
        </div>
      </div>
    )
  } else if (theme === BannerTheme.purplePinkBorder) {
    return (
      <div className={classnames('text-inverse p-1 rounded-lg pool-gradient-1', outerClassName)}>
        <div className={classnames(bannerClasses, 'bg-body', innerClassName)} style={style}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={classnames(bannerClasses, 'pool-gradient-1', className)} style={style}>
      {children}
    </div>
  )
}

Banner.defaultProps = {
  theme: BannerTheme.purplePink,
  defaultBorderRadius: true,
  defaultPadding: true
}
