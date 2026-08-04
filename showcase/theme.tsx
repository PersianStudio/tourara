import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ColorMode = 'dark' | 'light';

const ColorModeContext = createContext<{
  mode: ColorMode;
  toggleMode: () => void;
  setMode: (mode: ColorMode) => void;
}>({
  mode: 'dark',
  toggleMode: () => undefined,
  setMode: () => undefined,
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

function buildTheme(mode: ColorMode) {
  const isDark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: { main: '#3b82f6', contrastText: isDark ? '#0b1220' : '#ffffff' },
      secondary: { main: '#f5c542', contrastText: '#0b1220' },
      warning: { main: '#d4a017' },
      background: {
        default: isDark ? '#070b14' : '#f4f7fc',
        paper: isDark ? '#101826' : '#ffffff',
      },
      text: {
        primary: isDark ? '#e8eefc' : '#0f172a',
        secondary: isDark ? '#9bb0d0' : '#475569',
      },
      grey: isDark
        ? { 700: '#243044', 800: '#1a2436', 900: '#0f1726' }
        : { 700: '#cbd5e1', 800: '#e2e8f0', 900: '#0f172a' },
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
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ColorMode>(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('tourara-color-mode') : null;
    return stored === 'light' || stored === 'dark' ? stored : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    window.localStorage.setItem('tourara-color-mode', mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
    }),
    [mode],
  );

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
