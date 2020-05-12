const {
  colors
} = require('tailwindcss/defaultTheme')

module.exports = {
  corePlugins: {
    container: true
  },
  theme: {
    // this gives us regular (mobile), sm (641px - 1281px) and lg (1281px+)
    screens: {
      'sm': '801px',
      'lg': '1281px'
    },
    extend: {
      boxShadow: {
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'inner-lg': 'inset 0 1px 5px 0 rgba(0, 0, 0, 0.2)'
      },
      minHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
        '5xl': '1.75rem',
        '6xl': '2rem',
        '7xl': '2.25rem',
        '8xl': '2.5rem',
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
        'full': '100%',
      },
      maxWidth: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
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
        'sans-regular': ['Soleil', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
        'headline': ['omnes-pro', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
        'sans': ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
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
        '100': '1',
      },
      fill: theme => ({
        // 'indigo': theme('colors.indigo.500')
      }),
      colors: {
        cyan: {
          '200': '#9CF9F3',
          '400': '#6FE2DA',
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
          '400': '#2DCEB3',
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
          '900': '#2c1259',
        },
        purple: {
          ...colors.purple,
          '800': '#482299',
          '900': '#421C90',
          '1000': '#2c1259',
          '1100': '#27094C',
          '1200': '#250a45',
          '1300': '#1C073A'
        },
        lightpink: {
          '400': '#FDD8F5',
        },
        orange: {
          ...colors.orange,
          '400': '#FFCB32',
          '500': '#FF9303',
          '600': '#EF7301',
          '700': '#DF5301'
        },
        pink: {
          ...colors.pink,
          '400': '#dc6be5',
          '500': '#E475EB',
          '600': '#a445a3',
          '700': '#943a9B',
          '800': '#873487',
          '1000': '#4d0c39',
          '1100': '#2e0221',
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
        },
      },
    },
  },
  variants: {
    borderColor: [
      'hover',
      'focus',
      'active'
    ],
    textColor: [
      'responsive',
      'hover',
      'focus',
      'active'
    ],
    backgroundColor: [
      'responsive',
      'hover',
      'focus',
      'active'
    ],
    borderRadius: [
      'responsive'
    ],
    opacity: [
      'hover',
      'focus',
      'responsive',
      'disabled'
    ]
  },
  plugins: []
}


