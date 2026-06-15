import plugin from 'tailwindcss/plugin';

export default plugin(function({ addBase }) {
  addBase({
    ':root': {
      // Light mode colors
      '--color-primary': '#10B981',
      '--color-primary-light': '#34D399',
      '--color-primary-dark': '#059669',
      '--color-secondary': '#06B6D4',
      '--color-secondary-light': '#67E8F9',
      '--color-secondary-dark': '#0891B2',
      '--color-background': '#F8FAFC',
      '--color-surface': '#FFFFFF',
      '--color-text': '#0F172A',
      '--color-text-secondary': '#475569',
      '--color-border': '#E2E8F0',
      '--color-success': '#10B981',
      '--color-error': '#EF4444',
      '--color-warning': '#F59E0B',
    },
    '.dark': {
      // Dark mode colors
      '--color-primary': '#10B981',
      '--color-primary-light': '#34D399',
      '--color-primary-dark': '#059669',
      '--color-secondary': '#06B6D4',
      '--color-secondary-light': '#67E8F9',
      '--color-secondary-dark': '#0891B2',
      '--color-background': '#0B0F19',
      '--color-surface': '#111827',
      '--color-text': '#F9FAFB',
      '--color-text-secondary': '#9CA3AF',
      '--color-border': '#1F2937',
      '--color-success': '#10B981',
      '--color-error': '#EF4444',
      '--color-warning': '#FBBF24',
    }
  });
});