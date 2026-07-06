/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wz: {
          bg: '#ffffff',
          'bg-soft': '#f5faf7',
          ink: '#26332f',
          'ink-soft': '#5b6b66',
          sage: '#6fa98f',
          'sage-deep': '#487a63',
          'sage-tint': '#e5f2ec',
          line: '#e2ebe6',
        }
      },
      fontFamily: {
        serif: ["'Fraunces'", 'serif'],
        sans: ["'Inter'", 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
      }
    },
  },
  plugins: [],
}
