import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { NintondoProvider } from './utils/bell-provider.tsx';
import { Toaster } from 'react-hot-toast';
import { Buffer } from 'buffer';
import { FavoritesProvider } from './hooks/favorites.tsx';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NintondoProvider>
        <FavoritesProvider>
          <App />
          <Toaster
            position='top-center'
            toastOptions={{
              className: 'toast',
              success: {
                duration: 900,
                className: 'toast success',
              },
              error: {
                duration: 4000,
                className: 'toast error',
              },
            }}
          />
        </FavoritesProvider>
      </NintondoProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
