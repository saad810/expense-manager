// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#254D4D',
    },
    secondary: {
      main: '#E2783C',
    },
    success: {
      main: '#566160',
    },
    warning: {
      main: '#E4A163',
    },
    error: {
      main: '#BA8452',
    },
    text: {
      primary: '#566160',
    },
    background: {
      default: '#F1EFE6',
    },
  },
  typography: {
    h1: {
      color: '#254D4D',
    },
  },
});

export default theme;
