import { Inter, Roboto, Ubuntu } from '@next/font/google';

export type ThemeColor = {
  main: string;
  500: string;
  400: string;
  300: string;
  200: string;
  100: string;
  50: string;
};

const danger: ThemeColor = {
  main: '#f50055',
  500: '#720025',
  400: '#a80039',
  300: '#d5006b',
  200: '#fc1e97',
  100: '#ffc4e0',
  50: '#ffeef0',
};

const warning: ThemeColor = {
  main: '#ff9800',
  500: '#b26a00',
  400: '#e69100',
  300: '#ffab00',
  200: '#ffc400',
  100: '#ffe0b2',
  50: '#fff8e1',
};

const primary: ThemeColor = {
  main: '#016F54',
  500: '#016F54',
  400: '#018E6F',
  300: '#01a98a',
  200: '#01c4a4',
  100: '#a5e8e4',
  50: '#e5f8f7',
};

const tertiary: ThemeColor = {
  main: '#02abbb',
  500: '#007770',
  400: '#00938a',
  300: '#00b0a4',
  200: '#00ccce',
  100: '#a5e8e4',
  50: '#e5f8f7',
};

const secondary: ThemeColor = {
  main: '#004D5E',
  500: '#004D5E',
  400: '#006A7A',
  300: '#008794',
  200: '#00a4af',
  100: '#a5e8e4',
  50: '#e5f8f7',
};

type AppColors = {
  tertiary: ThemeColor;
  primary: ThemeColor;
  secondary: ThemeColor;
  danger: ThemeColor;
  warning: ThemeColor;
  gradients: {
    primary: string;
  };
};

const colors: AppColors = {
  primary,
  secondary,
  tertiary,
  danger,
  warning,
  gradients: {
    primary:
      'linear-gradient(180deg, rgba(36,11,73,1) 14%, rgba(35,9,73,1) 15%, rgba(123,42,113,1) 35%, rgba(226,156,168,1) 86%);',
  },
};

const breakpoints = {
  desktop: '66.13rem', // 1058px
  large: '62rem', // 992px
  xTablet: '54rem', // 854px
  tablet: '48.06rem', //  769px
  xMd: '48rem', // 768px
  xMedium: '39rem', // 630px
  xMobile: '32rem', // 512px
  mobile: '30rem', // 480px
  '2xsm': '25rem', // 400px
  xsm: '20.375rem', // 326px
  xs: '20rem', // 300px
  xbase: '15.75rem', // 250px
};

const inter = Inter({ variable: '--font-inter' });
const ubuntu = Ubuntu({
  weight: ['400', '500', '700'],
  variable: '--font-primary',
});
const roboto = Roboto({
  weight: ['400', '500', '700'],
  variable: '--font-secondary',
});

const Theme = {
  colors,
  breakpoints,
  fonts: {
    inter,
    ubuntu,
    roboto,
    variables: [inter.variable, ubuntu.variable, roboto.variable],
  },
};

export type AppTheme = typeof Theme;

export default Theme;
