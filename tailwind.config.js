const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  experimental: 'all',
  corePlugins: {
    container: true
  },
  theme: {
    // this gives us regular (mobile), sm (641px - 1281px) and lg (1281px+)
    screens: {
      xs: '531px',
      sm: '941px',
      lg: '1481px'
    },
    extend: {
      backgroundColor: {
        'body': 'var(--color-bg-body)',
        'card': 'var(--color-bg-card)',
        'card-selected': 'var(--color-bg-card-selected)',
        'primary': 'var(--color-bg-primary)',
        'secondary': 'var(--color-bg-secondary)',
        'default': 'var(--color-bg-default)',
        'darkened': 'var(--color-bg-darkened)',
        'inverse': 'var(--color-bg-inverse)',
        'overlay': 'var(--color-bg-overlay)',
        'black': 'var(--color-bg-black)',
        'highlight-1': 'var(--color-bg-highlight-1)',
        'highlight-2': 'var(--color-bg-highlight-2)',
        'highlight-3': 'var(--color-bg-highlight-3)',
        'highlight-4': 'var(--color-bg-highlight-4)',
        'highlight-5': 'var(--color-bg-highlight-5)',
        'grey': 'var(--color-bg-grey)',
        'red-1': 'var(--color-bg-red-1)',
        'light-red': 'var(--color-bg-light-red)',
        'green-1': 'var(--color-bg-green-1)',
        'yellow-1': 'var(--color-bg-yellow-1)',
        'yellow-2': 'var(--color-bg-yellow-2)',
        'blue-1': 'var(--color-bg-blue-1)',
        'blue-2': 'var(--color-bg-blue-2)',
        'teal': 'var(--color-bg-teal)',
        'accent-grey-1': 'var(--color-bg-accent-grey-1)',
        'accent-grey-2': 'var(--color-bg-accent-grey-2)',
        'purple-1': 'var(--color-bg-purple-1)'
      },
      textColor: {
        'accent-1': 'var(--color-text-accent-1)',
        'accent-2': 'var(--color-text-accent-2)',
        'accent-3': 'var(--color-text-accent-3)',
        'black': 'var(--color-text-black)',
        'primary': 'var(--color-text-primary)',
        'primary-soft': 'var(--color-text-primary-soft)',
        'secondary': 'var(--color-text-secondary)',
        'default': 'var(--color-text-default)',
        'default-soft': 'var(--color-text-default-soft)',
        'inverse': 'var(--color-text-inverse)',
        'inverse-soft': 'var(--color-text-inverse-soft)',
        'match': 'var(--color-text-match)',
        'highlight-1': 'var(--color-text-highlight-1)',
        'highlight-2': 'var(--color-text-highlight-2)',
        'highlight-3': 'var(--color-text-highlight-3)',
        'whitesmoke': 'var(--color-text-whitesmoke)',
        'red-1': 'var(--color-text-red-1)',
        'green-1': 'var(--color-text-green-1)',
        'green-2': 'var(--color-text-green-2)',
        'yellow-1': 'var(--color-text-yellow-1)',
        'yellow-2': 'var(--color-text-yellow-2)',
        'blue': 'var(--color-text-blue)',
        'teal': 'var(--color-text-teal)',
        'accent-grey-1': 'var(--color-text-accent-grey-1)',
        'purple': 'var(--color-text-purple)'
      },
      borderColor: {
        'accent-1': 'var(--color-border-accent-1)',
        'accent-2': 'var(--color-border-accent-2)',
        'accent-3': 'var(--color-border-accent-3)',
        'accent-4': 'var(--color-border-accent-4)',
        'primary': 'var(--color-border-primary)',
        'card': 'var(--color-border-card)',
        'secondary': 'var(--color-border-secondary)',
        'default': 'var(--color-border-default)',
        'transparent': 'var(--color-border-transparent)',
        'inverse': 'var(--color-border-inverse)',
        'highlight-1': 'var(--color-border-highlight-1)',
        'highlight-2': 'var(--color-border-highlight-2)',
        'red-1': 'var(--color-border-red-1)',
        'green-1': 'var(--color-border-green-1)',
        'green-2': 'var(--color-border-green-2)'
      },
      boxShadow: {
        'sm': '0 2px 6px 0 rgba(0, 0, 0, .07), 0 1px 2px -1px rgba(0, 0, 0, .04)',
        'md': '0 3px 8px -1px rgba(0, 0, 0, .1), 0 1px 5px -1px rgba(0, 0, 0, .06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05)',
        'xl': '0 10px 25px -1px rgba(0, 0, 0, .1), 0 10px 10px 5px rgba(0, 0, 0, .04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, .25)',
        '3xl': '0 20px 30px -3px rgba(0, 0, 0, .2), 0 15px 15px -3px rgba(0, 0, 0, .1)',
        '4xl': '0 30px 40px -3px rgba(0, 0, 0, .25), 0 20px 20px -3px rgba(0, 0, 0, .15)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'inner-lg': 'inset 0 1px 5px 0 rgba(0, 0, 0, 0.2)',
        'green': '0px 0px 10px #35F0D0;',
        'red': '0px 0px 10px #F11E1E;',
        'gray': '0px 0px 10px #BBBBBB;'
      },
      minHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%'
      },
      borderRadius: {
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
        '128': '32rem'
      },
      minWidth: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%'
      },
      maxWidth: {
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
        'xxxs': '0.5rem',
        'xxs': '0.65rem',
        'md': '1.075rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
        '7xl': '4rem',
        '7.5xl': '4.5rem',
        '8xl': '5rem',
        '9xl': '6rem',
        '10xl': '7rem',
        '12xl': '8.5rem'
      },
      fontFamily: {
        'sans-regular': [
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
        'number': [
          'DM Mono',
          'Courier',
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
        'headline': [
          'omnes-pro',
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
        'sans': ['Roboto', 'Helvetica', 'Arial', 'sans-serif']
      },
      opacity: {
        '0': '0',
        '10': '.1',
        '20': '.2',
        '30': '.3',
        '40': '.4',
        '50': '.5',
        '60': '.6',
        '70': '.7',
        '80': '.8',
        '90': '.9',
        '100': '1'
      },
      backgroundOpacity: {
        '15': '0.15',
        '80': '0.8'
      },
      fill: (theme) => ({
        // 'indigo': theme('colors.indigo.500')
      }),
      colors: {
        gray: {
          ...colors.gray,
          '400': '#bbbbbb'
        },
        cyan: {
          '200': '#9CF9F3',
          '400': '#6FE2DA'
        },
        red: {
          ...colors.red,
          '600': '#FF5050',
          '700': '#F11E1E'
        },
        blue: {
          ...colors.blue,
          '500': '#50A6FF',
          '600': '#4096FB',
          '700': '#2076F4',
          '800': '#2c529f',
          '900': '#1c329f',
          '1000': '#152a7f',
          '1100': '#072355',
          '1200': '#030d30'
        },
        green: {
          ...colors.green,
          '100': '#80FFF7',
          '200': '#72FAE3',
          '300': '#3EF3D4',
          '400': '#35f0d0',
          '500': '#24C5A8',
          '600': '#1cb298',
          '700': '#18a090'
        },
        lightPurple: {
          '200': '#E5C2FF',
          '300': '#D6B2FF',
          '400': '#C2A2F7',
          '500': '#a472f7',
          '600': '#9560eb',
          '700': '#6039BB',
          '800': '#451ba7',
          '900': '#3c1a79',
          '1000': '#2c1259'
        },
        purple: {
          ...colors.purple,
          '800': '#4c249f',
          '900': '#421C90',
          '1000': '#2c1259',
          '1100': '#27094C',
          '1200': '#210a45',
          '1300': '#1C073A'
        },
        lightpink: {
          '400': '#FDD8F5'
        },
        orange: {
          ...colors.orange,
          '300': '#FFCF1A',
          '400': '#FFCB32',
          '500': '#FF9303',
          '600': '#EF7301',
          '700': '#DF5301'
        },
        pink: {
          ...colors.pink,
          '100': '#ff8aff',
          '200': '#f37af8',
          '300': '#ec76f5',
          '400': '#dc6be5',
          '500': '#E475EB',
          '600': '#ca5fca',
          '700': '#bb57bB',
          '800': '#9f4a9f',
          '1000': '#7f3a7f',
          '1100': '#5f325f'
        },
        teal: {
          ...colors.teal,
          '100': '#c1dbef',
          '200': '#a3cff1',
          '300': '#75bbf3',
          '400': '#41a0ed',
          '500': '#1a7fd1',
          '600': '#0761ab',
          '700': '#065698',
          '800': '#035883',
          '900': '#032c57',
          '1000': '#02304b'
        }
      }
    }
  },
  variants: {
    margins: ['first'],
    borderColor: ['hover', 'focus', 'active', 'focus-within'],
    textColor: ['responsive', 'hover', 'focus', 'active'],
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
    borderRadius: ['responsive'],
    opacity: ['hover', 'focus', 'responsive', 'disabled'],
    boxShadow: ['focus-within', 'focus', 'active'],
    backgroundOpacity: ['hover', 'focus', 'active']
  },
  plugins: [],
  purge: false
}
