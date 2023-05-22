/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        softGreen: '#009CBD',
        primary: '#0275d8',
        miniTxtColor: '#459AB9',
        innoColor1: '#23586b',
        innoColor2: '#41919a',
        innoColor3: '#8cd2ba'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
