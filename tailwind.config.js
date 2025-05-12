/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'media', // Se aplica automáticamente según el sistema del usuario. está activado así: 'class'
    content: ["./src/**/*.{html,ts}"],
    theme: {
      extend: {
        colors:{
          light: '#F9FAFB',
          dark: '#111827',
        },
      },
    },
    plugins: [],
  };