import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{css,js,ts,jsx,tsx}', 
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
       lamaSky:"#C3EBFA",
       lamaSkyLight:"#EDF9FD",
       lamaPurple:"#CFCEFF",
       lamaPurpleLight: "#F1F0FF",
       lamaSkyLightLight:"#F1F0FF",
       lamaYellow:"#FAE27C",
       lamaYellowLight:"#FEFCE8",
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
