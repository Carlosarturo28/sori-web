import type { Config } from 'tailwindcss';
import typographyPlugin from '@tailwindcss/typography'; // <-- Cambiado aquí

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sori: {
          yellow: '#FDCB40', // Ajusta según tu logo
          orange: '#F47A4F', // Ajusta según tu logo
          blue: '#5A88C7', // Ajusta según tu logo
          green: '#74B869', // Ajusta según tu logo
          background: '#FCF5F3', // Color de fondo de la app
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        xl: '1rem', // Un poco más redondeado como en la app
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [
    // Asegúrate de que esta línea esté presente
    typographyPlugin,
    // ... otros plugins si tienes
  ],
};
export default config;
