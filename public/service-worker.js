// Service Worker para PWA - Pablo's Team Training
const CACHE_NAME = 'pt-cache-v2';
const RUNTIME_CACHE = 'pt-runtime-v2';

// Archivos que se cachean en la instalación
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
];

// Instalación del Service Worker - Cachear archivos estáticos
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker instalándose...');
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cacheando archivos estáticos');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker activado y listo');
        // Fuerza la activación inmediata
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Error durante la instalación del Service Worker:', error);
      })
  );
});

// Activación - Limpiar cachés antiguos
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activándose...');
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log(`🗑️ Eliminando caché antiguo: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Estrategia de fetch: Network First con caché de respaldo
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignorar solicitudes no-GET
  if (request.method !== 'GET') {
    return;
  }

  // Estrategia: Intentar red primero, luego caché
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Si es una respuesta válida, cachearla para uso offline
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si la red falla, intentar caché
        return caches
          .match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Si no está en caché, intentar caché estático
            return caches.match('/', {
              cacheName: CACHE_NAME,
            });
          })
          .catch((error) => {
            console.error('Error en fetch:', error);
          });
      })
  );
});

// Recibir mensajes de actualización desde el cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('✅ Service Worker cargado correctamente');
