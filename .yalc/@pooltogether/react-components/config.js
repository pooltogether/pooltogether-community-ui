const { colors } = require('tailwindcss/defaultTheme')
const deepMerge = require('deepmerge')

const pooltogetherReactTailwindUIConfig = {
  experimental: 'all',
  corePlugins: {
    container: true
  },
  theme: {
    // this gives us:
    // null (mobile),
    // xs (tablet),
    // sm (941px - 1481px)
    // lg (1481px+)
    screens: {
      xs: '531px',
      sm: '941px',
      lg: '1481px'
    },
    colors: {
      'actually-black': colors.black,
      'white': colors.white,
      'cyan': {},
      'blue': {},
      'green': {},
      'purple': {},
      'orange': {},
      'pink': {},
      'teal': {},
      'pt-teal': {
        lighter: 'var(--color-pt-teal-lighter)',
        light: 'var(--color-pt-teal-light)',
        bright: 'var(--color-pt-teal-bright)',
        DEFAULT: 'var(--color-pt-teal-default)',
        dark: 'var(--color-pt-teal-dark)'
      },
      'pt-purple': {
        lighter: 'var(--color-pt-purple-lighter)',
        light: 'var(--color-pt-purple-light)',
        bright: 'var(--color-pt-purple-bright)',
        DEFAULT: 'var(--color-pt-purple-default)',
        dark: 'var(--color-pt-purple-dark)'
      }
    },
    extend: {
      backgroundColor: {
        'body': 'var(--color-bg-body)',
        'card': 'var(--color-bg-card)',
        'card-selected': 'var(--color-bg-card-selected)',
        'card-purple': 'var(--color-bg-card-purple)',
        'primary': 'var(--color-bg-primary)',
        'secondary': 'var(--color-bg-secondary)',
        'tertiary': 'var(--color-bg-tertiary)',
        'new-modal': 'var(--color-bg-new-modal)',
        'default': 'var(--color-bg-default)',
        'input': 'var(--color-bg-input)',
        'darkened': 'var(--color-bg-darkened)',
        'inverse': 'var(--color-bg-inverse)',
        'inverse-purple': 'var(--color-bg-inverse-purple)',
        'overlay': 'var(--color-bg-overlay)',
        'overlay-white': 'var(--color-bg-overlay-white)',
        'black': 'var(--color-bg-black)',
        'highlight-1': 'var(--color-bg-highlight-1)',
        'highlight-2': 'var(--color-bg-highlight-2)',
        'highlight-3': 'var(--color-bg-highlight-3)',
        'highlight-4': 'var(--color-bg-highlight-4)',
        'highlight-5': 'var(--color-bg-highlight-5)',
        'highlight-6': 'var(--color-bg-highlight-6)',
        'highlight-7': 'var(--color-bg-highlight-7)',
        'highlight-8': 'var(--color-bg-highlight-8)',
        'highlight-9': 'var(--color-bg-highlight-9)',
        'new-btn': 'var(--color-bg-new-btn)',
        'new-btn-hover': 'var(--color-bg-new-btn-hover)',
        'raspberry': 'var(--color-bg-raspberry)',
        'functional-red': 'var(--color-bg-functional-red)',
        'warning-red': 'var(--color-bg-warning-red)',
        'red': 'var(--color-bg-red)',
        'green': 'var(--color-bg-green)',
        'orange': 'var(--color-bg-orange)',
        'orange-darkened': 'var(--color-bg-orange-darkened)',
        'blue': 'var(--color-bg-blue)',
        'teal': 'var(--color-bg-teal)',
        'accent-grey-1': 'var(--color-bg-accent-grey-1)',
        'accent-grey-2': 'var(--color-bg-accent-grey-2)',
        'accent-grey-3': 'var(--color-bg-accent-grey-3)',
        'accent-grey-4': 'var(--color-bg-accent-grey-4)',
        'accent-grey-5': 'var(--color-bg-accent-grey-5)',
        'purple': 'var(--color-bg-purple)',
        'light-purple-10': 'var(--color-bg-light-purple-10)',
        'light-purple-70': 'var(--color-bg-light-purple-70)'
      },
      textColor: {
        'accent-1': 'var(--color-text-accent-1)',
        'accent-2': 'var(--color-text-accent-2)',
        'accent-3': 'var(--color-text-accent-3)',
        'accent-4': 'var(--color-text-accent-4)',
        'black': 'var(--color-text-black)',
        'primary': 'var(--color-text-primary)',
        'primary-soft': 'var(--color-text-primary-soft)',
        'secondary': 'var(--color-text-secondary)',
        'default': 'var(--color-text-default)',
        'darkened': 'var(--color-text-darkened)',
        'default-soft': 'var(--color-text-default-soft)',
        'inverse': 'var(--color-text-inverse)',
        'inverse-purple': 'var(--color-text-inverse-purple)',
        'inverse-soft': 'var(--color-text-inverse-soft)',
        'match': 'var(--color-text-match)',
        'match-purple': 'var(--color-text-match-purple)',
        'highlight-1': 'var(--color-text-highlight-1)',
        'highlight-2': 'var(--color-text-highlight-2)',
        'highlight-3': 'var(--color-text-highlight-3)',
        'highlight-4': 'var(--color-text-highlight-4)',
        'highlight-6': 'var(--color-text-highlight-6)',
        'highlight-7': 'var(--color-text-highlight-7)',
        'highlight-9': 'var(--color-text-highlight-9)',
        'raspberry': 'var(--color-text-raspberry)',
        'functional-red': 'var(--color-text-functional-red)',
        'red': 'var(--color-text-red)',
        'green': 'var(--color-text-green)',
        'orange': 'var(--color-text-orange)',
        'yellow': 'var(--color-text-yellow)',
        'blue': 'var(--color-text-blue)',
        'teal': 'var(--color-text-teal)',
        'accent-grey-1': 'var(--color-text-accent-grey-1)',
        'purple': 'var(--color-text-purple)'
      },
      borderColor: {
        'body': 'var(--color-border-body)',
        'accent-1': 'var(--color-border-accent-1)',
        'accent-2': 'var(--color-border-accent-2)',
        'accent-3': 'var(--color-border-accent-3)',
        'accent-4': 'var(--color-border-accent-4)',
        'primary': 'var(--color-border-primary)',
        'card': 'var(--color-border-card)',
        'secondary': 'var(--color-border-secondary)',
        'default': 'var(--color-border-default)',
        'inverse': 'var(--color-border-inverse)',
        'highlight-1': 'var(--color-border-highlight-1)',
        'highlight-2': 'var(--color-border-highlight-2)',
        'highlight-3': 'var(--color-border-highlight-3)',
        'highlight-4': 'var(--color-border-highlight-4)',
        'highlight-5': 'var(--color-border-highlight-5)',
        'highlight-6': 'var(--color-border-highlight-6)',
        'highlight-7': 'var(--color-border-highlight-7)',
        'highlight-8': 'var(--color-border-highlight-8)',
        'raspberry': 'var(--color-border-raspberry)',
        'functional-red': 'var(--color-text-functional-red)',
        'red': 'var(--color-border-red)',
        'green': 'var(--color-border-green)',
        'orange': 'var(--color-border-orange)',
        'transparent': 'var(--color-border-transparent)'
      },
      boxShadow: {
        'xs': '0 1px 4px 0 rgba(0, 0, 0, .05), 0 1px 1px -1px rgba(0, 0, 0, .03)',
        'sm': '0 2px 6px 0 rgba(0, 0, 0, .07), 0 1px 2px -1px rgba(0, 0, 0, .04)',
        'md': '0 3px 8px -1px rgba(0, 0, 0, .1), 0 1px 5px -1px rgba(0, 0, 0, .06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05)',
        'xl': '0 10px 25px -1px rgba(0, 0, 0, .1), 0 10px 10px 5px rgba(0, 0, 0, .04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, .25)',
        '3xl': '0 20px 30px -3px rgba(0, 0, 0, .2), 0 15px 15px -3px rgba(0, 0, 0, .1)',
        '4xl': '0 30px 40px -3px rgba(0, 0, 0, .25), 0 20px 20px -3px rgba(0, 0, 0, .15)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'inner-lg': 'inset 0 1px 5px 0 rgba(0, 0, 0, 0.2)'
      },
      minHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%'
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
        '5xl': '1.75rem',
        '6xl': '2rem',
        '7xl': '2.25rem',
        '8xl': '2.5rem'
      },
      height: {
        '28': '7rem',
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
        '112': '28rem',
        '128': '32rem',
        '75vh': '75vh'
      },
      minWidth: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%'
      },
      maxWidth: {
        'xxs': '10rem',
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%'
      },
      lineHeight: {
        relaxed: 1.75
      },
      fontSize: {
        // sm: ['14px', '20px'],
        // base: ['16px', '24px'],
        // lg: ['20px', '28px'], // line height!
        // xl: ['24px', '32px'],
        'xxxxxs': '0.5rem',
        'xxxxs': '0.625rem',
        'xxxs': '0.75rem',
        'xxs': '0.875rem',
        'xs': '1rem',
        'sm': '1.125rem',
        'base': '1.25rem',
        'lg': '1.25rem',
        'xl': '1.5rem',
        '2xl': '1.875rem',
        '3xl': '2.25rem',
        '4xl': '2.5rem',
        '5xl': '2.75rem',
        '6xl': '3rem',
        '7xl': '3.25rem',
        '8xl': '3.5rem',
        '9xl': '3.75rem',
        '10xl': '4rem',
        '11xl': '4.25rem',
        '12xl': '4.5rem',
        '13xl': '4.75rem',
        '14xl': '5rem'
      },
      fontFamily: {
        sans: [
          'Titillium Web',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ],
        serif: [
          'Titillium Web',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ],
        inter: [
          'Inter',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ]
      },
      opacity: {
        0: '0',
        10: '.1',
        20: '.2',
        30: '.3',
        40: '.4',
        50: '.5',
        60: '.6',
        70: '.7',
        80: '.8',
        90: '.9',
        100: '1'
      },
      fill: (theme) => ({
        // 'indigo': theme('colors.indigo.500')
      })
    }
  },
  variants: {
    margin: ['responsive', 'last', 'first'],
    padding: ['responsive', 'last'],
    borderColor: ['hover', 'focus', 'active', 'last'],
    textColor: ['hover', 'focus', 'active', 'responsive'],
    backgroundColor: ['hover', 'focus', 'active', 'responsive'],
    borderRadius: ['responsive'],
    borderWidth: ['hover'],
    opacity: ['hover', 'focus']
  },
  plugins: [],
  purge: false
  // purge: [
  //   './src/components/**/*.jsx',
  //   './src/components/**/*.js',
  //   './src/pages/**/*.jsx',
  //   './src/pages/**/*.js'
  //   './src/views/**/*.jsx',
  //   './src/views/**/*.js'
  //   './src/components/**/*.tsx',
  //   './src/components/**/*.ts',
  //   './src/pages/**/*.tsx',
  //   './src/pages/**/*.ts'
  //   './src/views/**/*.tsx',
  //   './src/views/**/*.ts'
  // ],
}

function arrayMergeFn(destinationArray, sourceArray) {
  return destinationArray.concat(sourceArray).reduce((acc, cur) => {
    if (acc.includes(cur)) return acc
    return [...acc, cur]
  }, [])
}

/**
 * Merge PT-ReactTailwindUI and Tailwind CSS configurations
 * @param {object} tailwindConfig - Tailwind config object
 * @return {object} new config object
 */
function wrapper(tailwindConfig) {
  let purge
  if (Array.isArray(tailwindConfig.purge)) {
    purge = {
      content: tailwindConfig.purge
    }
  } else {
    purge = tailwindConfig.purge
  }
  return deepMerge({ ...tailwindConfig, purge }, pooltogetherReactTailwindUIConfig, {
    arrayMerge: arrayMergeFn
  })
}

module.exports = wrapper
