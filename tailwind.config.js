/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'vibe-green': '#5E715B',
        'art-sand': '#D1BFA5',
        'twilight-maroon': '#5A3A31',
        'dark-charcoal': '#1E2326',
        'soft-cream': '#F4F1EA',
      },
      fontFamily: {
        // The clean font for the buttons
        sans: ['Inter_400Regular', 'sans-serif'],
        // The cinematic fonts for the title
        serif: ['EBGaramond_400Regular', 'serif'],
        serifItalic: ['EBGaramond_400Regular_Italic', 'serif'],
      }
    },
  },
  plugins: [],
}
