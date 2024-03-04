/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,js}',
    './components/**/*.{ts,tsx,js}',
    './app/**/*.{ts,tsx,js}',
    './src/**/*.{ts,tsx}',
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // mui theme
        gray: {
          100: "#FFFFFF",
          200: "#EFEFEF",
          300: "#DADADA",
          400: "#818181",
          500: "#6F767E",
          600: "#404B53",
          650: "#202427",
          700: "#232830", //"#26282C", //"#2B3034",
          750: "#1A1C22",
          800: "#050A0E",
          850: "#26282C",
          900: "#95959E",
        },
        orange: {
          250: "#FF5810",
        },
        yellow: {
          150: "#FF900C",
        },
        // purple: {
        //   350: "#5568FE",
        //   550: "#596BFF",
        //   600: "#586FEA",
        //   650: "#2B3480",
        //   700: "#4F63D2",
        //   750: "#6246FB",
        //   300: "#4658BB",
        // },
        red: { 150: "#D32F2F" },
        pink: {
          150: "#EC4899",
          750: "#2c1a22",
        },
        green: {
          250: "#40A954",
          350: "#34A85333",
          450: "#34A85380",
          550: "#87E5A2",
          650: "#96F3D24D",
        },
        blue: {
          350: "#76d9e6",
        },
        customGray: {
          100: "#252A34",
          150: "#31353B",
          200: "#1E1E1E",
          300: "#454545",
          400: "#282828",
          500: "#848484",
          600: "#C4C4C4",
          700: "#272727",
          800: "#343434",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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