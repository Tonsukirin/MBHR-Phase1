import type { Config } from 'tailwindcss';

const config: Config = {
  important: true,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        login: '0px 2px 12px 0px rgba(0, 0, 0, 0.07)',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#FF8A45',
          hover: '#FF6F21',
          pressed: '#E65C1F',
          disabled: '#F3F3F3',
        },
        secondary: {
          DEFAULT: '#FFDFB5',
          hover: '#FFCC85',
          pressed: '#F5B970',
          disabled: '#F3F3F3',
        },
        flat: {
          DEFAULT: '#C4C4C4',
          hover: '#A5A5A5',
          pressed: '#8B8B8B',
          disabled: '#F3F3F3',
        },
        textOrange: {
          DEFAULT: '#FF8A45',
          hover: '#FF6F21',
          pressed: '#E65C1F',
          disabled: '#F3F3F3',
        },
        textBlack: {
          DEFAULT: '#333333',
          hover: '#1A1A1A',
          pressed: '#000000',
          disabled: '#F3F3F3',
        },
        inactive: '#A3A3A3',
        disable: 'rgba(0, 0, 0, 0.25)',
      },
      fontSize: {
        '28': '28px',
        '22': '22px',
        '20': '20px',
        '18': '18px',
        '16': '16px',
        '14': '14px',
        '12': '12px',
        '10': '10px',
      },
      fontWeight: {
        light: '200',
        regular: '400',
        medium: '500',
        bold: '700',
      },
    },
  },
  plugins: [],
};
export default config;
