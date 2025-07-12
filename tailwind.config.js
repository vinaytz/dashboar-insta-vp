/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(140 20% 20%)",
        input: "hsl(140 20% 20%)",
        ring: "hsl(140 60% 40%)",
        background: "hsl(140 20% 10%)",
        foreground: "hsl(140 10% 90%)",
        primary: {
          DEFAULT: "hsl(140 60% 40%)",
          foreground: "hsl(140 10% 98%)",
        },
        secondary: {
          DEFAULT: "hsl(140 20% 20%)",
          foreground: "hsl(140 10% 90%)",
        },
        destructive: {
          DEFAULT: "hsl(0 60% 50%)",
          foreground: "hsl(140 10% 98%)",
        },
        muted: {
          DEFAULT: "hsl(140 20% 20%)",
          foreground: "hsl(140 10% 60%)",
        },
        accent: {
          DEFAULT: "hsl(140 20% 20%)",
          foreground: "hsl(140 10% 90%)",
        },
        popover: {
          DEFAULT: "hsl(140 20% 10%)",
          foreground: "hsl(140 10% 90%)",
        },
        card: {
          DEFAULT: "hsl(140 20% 15%)",
          foreground: "hsl(140 10% 90%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
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
