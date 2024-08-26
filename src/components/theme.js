// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Primary color
      contrastText: '#fff', // Text color on primary buttons
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      color: '#1976d2',
    },
    body1: {
      fontSize: '1rem',
      color: '#333',
    },
  },
  shape: {
    borderRadius: 8, // Default border radius for all components
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '16px',
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
