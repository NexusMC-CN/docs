/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'hsl(var(--hue, 217), 100%, 97%)',
          100: 'hsl(var(--hue, 217), 95%, 93%)',
          200: 'hsl(var(--hue, 217), 93%, 87%)',
          300: 'hsl(var(--hue, 217), 90%, 78%)',
          400: 'hsl(var(--hue, 217), 87%, 68%)',
          500: 'hsl(var(--hue, 217), 85%, 60%)',
          600: 'hsl(var(--hue, 217), 83%, 53%)',
          700: 'hsl(var(--hue, 217), 78%, 48%)',
          800: 'hsl(var(--hue, 217), 70%, 40%)',
          900: 'hsl(var(--hue, 217), 65%, 33%)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        soft: '0 18px 42px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
