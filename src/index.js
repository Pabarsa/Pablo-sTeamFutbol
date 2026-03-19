import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Polyfill para window.storage - wrapper de localStorage con API similar a Chrome Storage API
window.storage = {
  get: async (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? { value } : { value: null };
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return { value: null };
    }
  },
  set: async (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  remove: async (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado correctamente');
        // Verificar actualizaciones cada hora
        setInterval(() => {
          registration.update();
        }, 3600000);
      })
      .catch((error) => {
        console.error('❌ Error al registrar el Service Worker:', error);
      });
  });
}