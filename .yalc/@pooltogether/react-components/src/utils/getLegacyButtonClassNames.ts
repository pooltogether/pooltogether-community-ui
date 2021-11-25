import classnames from 'classnames'

export interface LegacyButtonClassNameProps {
  border?: string
  bg?: string
  bold?: boolean
  text?: string
  hoverBg?: string
  hoverBorder?: string
  hoverText?: string
  noAnim?: boolean
  padding?: string
  rounded?: string
  inverse?: boolean
  basic?: boolean
  secondary?: boolean
  tertiary?: boolean
  selected?: boolean
  transition?: string
  className?: string
  textSize?: string
  width?: string
  disabled?: boolean
}

export function getLegacyButtonClassNames(props: LegacyButtonClassNameProps) {
  let {
    border,
    bg,
    bold,
    text,
    hoverBg,
    hoverBorder,
    hoverText,
    noAnim,
    padding,
    rounded,
    inverse,
    basic,
    secondary,
    tertiary,
    selected,
    transition,
    className,
    textSize,
    width,
    disabled
  } = props

  let defaultClasses =
    'border-2 inline-block text-center leading-snug cursor-pointer outline-none focus:outline-none active:outline-none no-underline'
  let animClass = noAnim ? '' : 'button-scale'

  if (selected) {
    defaultClasses += ` opacity-50`
    animClass = ``
  }

  // eg. textSize='sm', textSize='xl'
  textSize = getLegacyTextSize(textSize)

  let defaultPadding = 'px-4 xs:px-6 sm:px-10 lg:px-12 py-2 sm:py-2'
  let defaultRounded = 'rounded-full'
  let defaultTrans = 'trans trans-fast'

  let defaultBorder = 'border-highlight-2'
  let defaultBg = 'bg-transparent'
  let defaultText = 'text-highlight-2'

  let defaultHoverBorder = 'hover:border-highlight-4'
  let defaultHoverBg = 'hover:bg-highlight-4'
  let defaultHoverText = 'hover:text-secondary'

  if (secondary) {
    defaultBorder = 'border-highlight-2 border-2'
    defaultBg = 'bg-primary'
    defaultText = 'text-highlight-2'

    defaultHoverBorder = 'hover:border-highlight-1'
    defaultHoverBg = 'hover:bg-body'
    defaultHoverText = 'hover:text-highlight-1'
  }

  if (tertiary) {
    defaultBorder = 'border-transparent border-2'
    defaultBg = 'bg-highlight-3'
    defaultText = 'text-highlight-9'

    defaultHoverBorder = 'hover:border-transparent'
    defaultHoverBg = 'hover:bg-purple'
    defaultHoverText = 'hover:text-white'
  }

  if (basic) {
    defaultBorder = 'border-transparent border-2'
    defaultBg = 'bg-transparent'
    defaultText = 'text-highlight-2'

    defaultHoverBorder = 'hover:border-transparent'
    defaultHoverBg = 'hover:bg-transparent'
    defaultHoverText = 'hover:text-highlight-1'
  }

  if (inverse) {
    defaultBorder = 'border-inverse'
    defaultBg = 'bg-transparent'
    defaultText = 'text-inverse'

    defaultHoverBorder = 'hover:border-highlight-4'
    defaultHoverBg = 'hover:bg-highlight-4'
    defaultHoverText = 'hover:text-secondary'
  }

  let opacity = ''
  if (disabled) {
    opacity = 'opacity-40 cursor-not-allowed pointer-events-none'
  }

  const boldClassName = bold || bold === undefined ? 'font-bold' : ''

  padding = padding ? `${padding}` : defaultPadding
  rounded = rounded ? `rounded-${rounded}` : defaultRounded
  transition = transition ? `${transition}` : defaultTrans
  width = width ? `${width}` : ''

  border = border ? `border-${border}` : defaultBorder
  bg = bg ? `bg-${bg}` : defaultBg
  text = text ? `text-${text}` : defaultText

  hoverBorder = hoverBorder ? `hover:border-${hoverBorder}` : defaultHoverBorder
  hoverBg = hoverBg ? `hover:bg-${hoverBg}` : defaultHoverBg
  hoverText = hoverText ? `hover:text-${hoverText}` : defaultHoverText

  return classnames(
    className,
    defaultClasses,
    animClass,
    boldClassName,
    bg,
    border,
    padding,
    rounded,
    text,
    hoverBg,
    hoverBorder,
    hoverText,
    textSize,
    transition,
    width,
    opacity
  )
}

const getLegacyTextSize = (size) => {
  switch (size) {
    case 'xxxs':
      return `text-xxxxs xs:text-xxxs sm:text-xxs lg:text-xs`
    case 'xxs':
      return `text-xxxs xs:text-xxs sm:text-xs lg:text-sm`
    case 'xs':
      return `text-xxs xs:text-xs sm:text-sm lg:text-base`
    case 'sm':
      return `text-xs xs:text-sm sm:text-base lg:text-lg`
    case 'lg':
      return `text-sm xs:text-lg sm:text-xl lg:text-2xl`
    case 'xl':
      return `text-lg xs:text-xl sm:text-2xl lg:text-3xl`
    case '2xl':
      return `text-xl xs:text-2xl sm:text-3xl lg:text-4xl`
    default:
      return `text-xxs xs:text-xs sm:text-sm lg:text-base`
  }
}
