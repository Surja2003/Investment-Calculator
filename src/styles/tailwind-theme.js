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
      // Light surfaces — soft, airy neutrals
      '--color-background': '#F4F6FA',
      '--color-background-elevated': '#FFFFFF',
      '--color-surface': '#FFFFFF',
      '--color-text': '#1C2A3A',
      '--color-text-secondary': '#5A6B7E',
      '--color-border': '#E4E9F1',
      '--color-success': '#4C9A82',
      '--color-error': '#D46A6A',
      '--color-warning': '#D9A45B',
      // Liquid-glass tokens
      '--glass-bg': 'rgba(255, 255, 255, 0.65)',
      '--glass-border': 'rgba(28, 42, 58, 0.10)',
      '--glass-shadow': '0 8px 30px rgba(28, 42, 58, 0.10)',
      '--glass-highlight': 'rgba(255, 255, 255, 0.75)',
    },
    '.dark': {
      // Brand lifts a little for contrast on deep navy
      '--color-primary': '#6E92C0',
      '--color-primary-light': '#8DABD2',
      '--color-primary-dark': '#4E77A8',
      '--color-secondary': '#5FB89C',
      '--color-secondary-light': '#82CBB2',
      '--color-secondary-dark': '#3A7D68',
      // Dark surfaces — deep navy-slate, never pure black
      '--color-background': '#0F1826',
      '--color-background-elevated': '#1B2736',
      '--color-surface': '#16202E',
      '--color-text': '#ECF1F7',
      '--color-text-secondary': '#9BA9BA',
      '--color-border': '#27333F',
      '--color-success': '#5FB89C',
      '--color-error': '#E08C8C',
      '--color-warning': '#E3B675',
      // Liquid-glass tokens (dark)
      '--glass-bg': 'rgba(22, 32, 46, 0.60)',
      '--glass-border': 'rgba(255, 255, 255, 0.08)',
      '--glass-shadow': '0 8px 30px rgba(0, 0, 0, 0.35)',
      '--glass-highlight': 'rgba(255, 255, 255, 0.06)',
    }
  });
});
