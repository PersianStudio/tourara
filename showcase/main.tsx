import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TourProvider } from '@persianstudio/tourara';
import { App } from './App';
import { ColorModeProvider } from './theme';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeProvider>
      <TourProvider>
        <App />
      </TourProvider>
    </ColorModeProvider>
  </StrictMode>,
);
