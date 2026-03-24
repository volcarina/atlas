import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { TrpcProvider } from './lib/trpc';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TrpcProvider>
      <App />
    </TrpcProvider>
  </StrictMode>
);
