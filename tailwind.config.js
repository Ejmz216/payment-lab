/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        surface2: 'rgb(var(--color-surface2) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        iso: 'rgb(var(--color-iso) / <alpha-value>)',
        scheme: 'rgb(var(--color-scheme) / <alpha-value>)',
        party: 'rgb(var(--color-party) / <alpha-value>)',
        agent: 'rgb(var(--color-agent) / <alpha-value>)',
        infra: 'rgb(var(--color-infra) / <alpha-value>)',
        return: 'rgb(var(--color-return) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        pacs: 'rgb(var(--color-pacs) / <alpha-value>)',
        pain: 'rgb(var(--color-pain) / <alpha-value>)',
        camt: 'rgb(var(--color-camt) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Public Sans Variable"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
