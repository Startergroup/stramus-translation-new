// tailwind.config.js
module.exports = {
  prefix: 'tw-',
  darkMode: ['class', '[data-mode="dark"]'],
  corePlugins: {
    preflight: false
  },
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        secondary: '#BCBCBC',
        'secondary-2': '#525252',
        'secondary-3': '#676767',
        'secondary-4': '#7E7E7E',
        black: '#363636',
        'black-15': 'rgba(54, 54, 54, .15)',
        orange: 'var(--orange-color)',
        'orange-light': 'var(--orange-light-color)',
        'orange-light-2': 'var(--orange-light-2-color)',
        'orange-light-4': 'var(--orange-light-4-color)',
        gray: 'var(--gray-color)',
        error: 'var(--error-color)',
        'dark-gray': 'var(--dark-gray-color)',
        'middle-gray': 'var(--middle-gray-color)',
        'light-gray': 'var(--light-gray)',
        'light-gray-2': 'var(--light-gray-2)',
        'light-gray-4': 'var(--light-gray-4)',
        'dark-white': 'var(--dark-white)',
        green: '#12B76A',
        'primary/base': '#6B4EFF',
        'primary/light': '#9990FF',
        'primary/lightest': '#E7E7FF',
        'primary/darkest': '#5538EE',
        'sky/lighter': '#F2F4F5',
        'sky/base': '#CDCFD0',
        'sky/light': '#E3E5E5',
        'sky/dark': '#979C9E',
        'sky/white': '#FFFFFF',
        'ink/dark': '#303437',
        'ink/light': '#6C7072',
        'ink/lighter': '#72777A',
        'ink/darkest': '#090A0A',
        'ink/darker': '#202325',
        'ink/base': '#404446'
      },
      screens: {}
    },
    fontFamily: {
      sans: ['Roboto']
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
