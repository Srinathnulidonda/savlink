// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import Providers from './app/Providers';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);