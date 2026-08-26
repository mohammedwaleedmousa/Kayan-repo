import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { getSupabaseClient, supabaseUrl } from './lib/supabaseClient.js';
import './styles.css';

window.KAYAN_SUPABASE_CONFIG = Object.freeze({
  url: supabaseUrl,
  keyType: 'publishable',
});

window.KAYAN_SUPABASE_READY = getSupabaseClient()
  .then((client) => {
    window.KAYAN_SUPABASE = client;
    window.dispatchEvent(new CustomEvent('kayan:supabase-ready'));
    return client;
  })
  .catch((error) => {
    console.error('[Kayan] Supabase initialization failed.', error);
    return null;
  });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
