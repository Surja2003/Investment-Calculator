import plugin from 'tailwindcss/plugin';

/**
 * Sober, trustworthy "investment" palette.
 * Soft light neutrals + a calm steel-blue brand (trust), with a muted
 * sage-green reserved for positive / gains. No neon, no black+gold.
 */
export default plugin(function({ addBase }) {
  addBase({
    ':root': {
      // Brand — calm steel blue (trust)
      '--color-primary': '#3B6098',
      '--color-primary-light': '#5E82BC',
      '--color-primary-dark': '#2C4A78',
      // Accent — muted sage green (growth / gains)
      '--color-secondary': '#4C9A82',
      '--color-secondary-light': '#77B9A4',
      '--color-secondary-dark': '#3A7D68',
      // Light surfaces — soft pearl / dull white
      '--color-background': '#F1F0EC',
      '--color-background-elevated': '#FCFBF9',
      '--color-surface': '#FCFBF9',
      '--color-text': '#1C2430',
      '--color-text-secondary': '#5A6270',
      '--color-border': '#E4E2DB',
      '--color-success': '#4C9A82',
      '--color-error': '#D46A6A',
      '--color-warning': '#D9A45B',
      // Liquid-glass tokens
      '--glass-bg': 'rgba(252, 251, 249, 0.68)',
      '--glass-border': 'rgba(28, 36, 48, 0.10)',
      '--glass-shadow': '0 8px 30px rgba(28, 36, 48, 0.10)',
      '--glass-highlight': 'rgba(255, 255, 255, 0.80)',
    },
    '.dark': {
      // Brand lifts a little for contrast on deep navy
      '--color-primary': '#6E92C0',
      '--color-primary-light': '#8DABD2',
      '--color-primary-dark': '#4E77A8',
      '--color-secondary': '#5FB89C',
      '--color-secondary-light': '#82CBB2',
      '--color-secondary-dark': '#3A7D68',
      // Dark surfaces — deep black
      '--color-background': '#060608',
      '--color-background-elevated': '#141416',
      '--color-surface': '#0F0F12',
      '--color-text': '#F5F6F8',
      '--color-text-secondary': '#9EA0A8',
      '--color-border': '#26262C',
      '--color-success': '#5FB89C',
      '--color-error': '#E08C8C',
      '--color-warning': '#E3B675',
      // Liquid-glass tokens (dark)
      '--glass-bg': 'rgba(20, 20, 24, 0.62)',
      '--glass-border': 'rgba(255, 255, 255, 0.08)',
      '--glass-shadow': '0 8px 30px rgba(0, 0, 0, 0.55)',
      '--glass-highlight': 'rgba(255, 255, 255, 0.05)',
    }
  });
});
