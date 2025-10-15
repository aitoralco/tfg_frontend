// tailwind config temporarily disabled to avoid requiring tailwindcss package during build.
// original content moved below.
// module.exports = {
  content: [
    './src/**/*.{html,ts,css,scss}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a',
        accent: '#ff6a88',
        'accent-2': '#764ba2'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial']
      }
    }
  },
  plugins: []
// };
