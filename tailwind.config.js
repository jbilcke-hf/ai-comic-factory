/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './src/lib/fonts.ts'
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        indieflower: ['var(--font-indieflower)'],
        thegirlnextdoor: ['var(--font-the-girl-next-door)'],
        komika: ['var(--font-komika)'],
        actionman: ['var(--font-action-man)'],
        karantula: ['var(--font-karantula)'],
        manoskope: ['var(--font-manoskope)'],
        paeteround: ['var(--font-paete-round)'],
        qarmic: ['var(--font-qarmic-sans)'],
        archrival: ['var(--font-sf-arch-rival)'],
        cartoonist: ['var(--font-sf-cartoonist-hand)'],
        toontime: ['var(--font-sf-toontime)'],
        vtc: ['var(--font-vtc-letterer-pro)'],
        digitalstrip: ['var(--font-digital-strip-bb)'],
      
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}