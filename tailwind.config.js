/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'accent': 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'border': 'var(--border)',
        'key-bg': 'var(--key-bg)',
        'key-operator-bg': 'var(--key-operator-bg)',
        'key-function-bg': 'var(--key-function-bg)',
        'key-equal-bg': 'var(--key-equal-bg)',
        'display-bg': 'var(--display-bg)',
        'error-color': 'var(--error-color)',
      },
      boxShadow: {
        'key': 'var(--key-shadow)',
        'key-pressed': 'inset var(--key-shadow)',
      },
      fontFamily: {
        'sans': ['Noto Sans SC', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
