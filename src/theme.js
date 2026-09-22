import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#93A7C0',
      light: '#B4C6DD',
      dark: '#2C4A78',
    },
    secondary: {
      main: '#3B6098',
      light: '#5E82BC',
      dark: '#2C4A78',
    },
    background: {
      default: '#0B1121',
      paper: '#1E293B',
    },
    text: {
      primary: '#F3F4F6',
      secondary: '#9CA3AF',
    },
    success: {
      main: '#3B6098',
    },
    error: {
      main: '#EF4444',
    },
    warning: {
      main: '#F59E0B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E293B',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#111827',
          },
        },
      },
    },
  },
});