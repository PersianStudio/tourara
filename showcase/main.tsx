import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3b82f6', contrastText: '#0b1220' },
    secondary: { main: '#f5c542', contrastText: '#0b1220' },
    warning: { main: '#f5c542' },
    background: { default: '#070b14', paper: '#101826' },
    text: { primary: '#e8eefc', secondary: '#9bb0d0' },
    grey: {
      700: '#243044',
      800: '#1a2436',
      900: '#0f1726',
    },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
    h1: { fontFamily: '"IBM Plex Sans", system-ui, sans-serif', fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontFamily: '"IBM Plex Sans", system-ui, sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: '"IBM Plex Sans", system-ui, sans-serif', fontWeight: 650 },
    h4: { fontFamily: '"IBM Plex Sans", system-ui, sans-serif', fontWeight: 650 },
    h5: { fontFamily: '"IBM Plex Sans", system-ui, sans-serif', fontWeight: 650 },
    h6: { fontFamily: '"IBM Plex Sans", system-ui, sans-serif', fontWeight: 650 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.55 },
  },
  shape: { borderRadius: 4 },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
