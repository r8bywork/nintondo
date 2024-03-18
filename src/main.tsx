import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { NintondoProvider } from './utils/bell-provider.tsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NintondoProvider>
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
    </NintondoProvider>
  </React.StrictMode>,
);
