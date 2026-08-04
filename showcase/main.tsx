import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0d6e6e' },
    secondary: { main: '#c45c26' },
    background: { default: '#f3efe6', paper: '#fffdf8' },
  },
  typography: {
    fontFamily: '"Sora", system-ui, sans-serif',
    h1: { fontFamily: '"Fraunces", Georgia, serif' },
    h2: { fontFamily: '"Fraunces", Georgia, serif' },
    h3: { fontFamily: '"Fraunces", Georgia, serif' },
    h4: { fontFamily: '"Fraunces", Georgia, serif' },
    h5: { fontFamily: '"Fraunces", Georgia, serif' },
    h6: { fontFamily: '"Fraunces", Georgia, serif' },
  },
  shape: { borderRadius: 10 },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
