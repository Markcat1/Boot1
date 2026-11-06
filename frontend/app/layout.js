'use client'
import './globals.css'
import { useEffect } from 'react'

export default function RootLayout({ children }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          },
          function(err) {
            console.log('Service Worker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  return (
    <html lang="es">
      <head>
        <title>SafeZMG & Resilience Core</title>
        <meta name="description" content="Gestión Integral de Riesgos, Ciberseguridad y Tecnología Cívica" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>{children}</body>
    </html>
  )
}
