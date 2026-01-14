/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        symtex: {
          // Brand colors using CSS variables
          primary: 'var(--color-primary)',
          'primary-light': 'var(--color-primary-400)',
          'primary-dark': 'var(--color-primary-600)',
          accent: 'var(--color-accent)',
          'accent-light': 'var(--color-accent-400)',
          'accent-dark': 'var(--color-accent-600)',
          gold: 'var(--color-gold)',
          'gold-light': 'var(--color-gold-400)',
          'gold-dark': 'var(--color-gold-600)',
          // Surfaces
          dark: 'var(--color-surface-dark)',
          card: 'var(--color-surface-card)',
          elevated: 'var(--color-surface-elevated)',
          border: 'var(--color-border)',
          'border-subtle': 'var(--color-border-subtle)',
        },
        // Semantic colors
        success: {
          DEFAULT: 'var(--color-success)',
          50: 'var(--color-success-50)',
          500: 'var(--color-success)',
          600: 'var(--color-success-600)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          50: 'var(--color-warning-50)',
          500: 'var(--color-warning)',
          600: 'var(--color-warning-600)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          50: 'var(--color-error-50)',
          500: 'var(--color-error)',
          600: 'var(--color-error-600)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          50: 'var(--color-info-50)',
          500: 'var(--color-info)',
          600: 'var(--color-info-600)',
        },
      },
      boxShadow: {
        'primary': 'var(--shadow-primary)',
        'primary-lg': 'var(--shadow-primary-lg)',
        'accent': 'var(--shadow-accent)',
        'gold': 'var(--shadow-gold)',
        'glow-primary': 'var(--glow-primary)',
        'glow-accent': 'var(--glow-accent)',
      },
      borderRadius: {
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
      },
      transitionDuration: {
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        'bounce': 'var(--ease-bounce)',
        'elastic': 'var(--ease-elastic)',
      },
      spacing: {
        'sidebar': 'var(--width-sidebar)',
        'sidebar-collapsed': 'var(--width-sidebar-collapsed)',
      },
      zIndex: {
        'dropdown': 'var(--z-dropdown)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        'modal': 'var(--z-modal)',
        'popover': 'var(--z-popover)',
        'tooltip': 'var(--z-tooltip)',
        'toast': 'var(--z-toast)',
      },
      animation: {
        'fade-in': 'fadeIn var(--duration-normal) var(--ease-out) forwards',
        'fade-in-up': 'fadeInUp var(--duration-normal) var(--ease-out) forwards',
        'scale-in': 'scaleIn var(--duration-normal) var(--ease-out) forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-subtle': 'pulseSubtle 2s var(--ease-in-out) infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.4)' },
          '50%': { boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)' },
        },
      },
    },
  },
  plugins: [],
}
