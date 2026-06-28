import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          100: 'hsl(var(--primary-100))',
          300: 'hsl(var(--primary-300))',
          700: 'hsl(var(--primary-700))',
          900: 'hsl(var(--primary-900))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          soft: 'hsl(var(--accent-soft))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        ink: 'hsl(var(--ink))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          alt: 'hsl(var(--surface-alt))',
        },
        border: 'hsl(var(--border))',
        success: 'hsl(var(--success))',
        danger: 'hsl(var(--danger))',
        warning: 'hsl(var(--warning))',
        background: 'hsl(var(--surface))',
        foreground: 'hsl(var(--ink))',
        ring: 'hsl(var(--primary))',
      },
      fontFamily: {
        display: ['var(--font-anton)', 'Impact', 'sans-serif'],
        kicker: ['var(--font-barlow-condensed)', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Escala fluída con clamp() — definida tamén en globals.css como variables
        'fluid-h1': 'clamp(2.25rem, 6vw, 4.5rem)',
        'fluid-h2': 'clamp(1.75rem, 4.5vw, 3.5rem)',
        'fluid-h3': 'clamp(1.25rem, 2.5vw, 2.25rem)',
        'fluid-h4': 'clamp(1.125rem, 2vw, 1.75rem)',
        'fluid-body': 'clamp(1rem, 1.05vw, 1.125rem)',
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '6px',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 400ms ease-out both',
      },
    },
  },
  plugins: [animate],
};

export default config;
