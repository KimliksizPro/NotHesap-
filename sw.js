const CACHE_NAME = 'not-hesaplayici-plus-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx',
  '/metadata.json',
  '/types.ts',
  '/App.tsx',
  '/components/CalculatorCard.tsx',
  '/components/Input.tsx',
  '/components/Button.tsx',
  '/components/ResultDisplay.tsx',
  '/components/LiteratureCalculator.tsx',
  '/components/EnglishCalculator.tsx',
  '/components/OverallAverageCalculator.tsx',
  '/components/HistoryDisplay.tsx',
  '/components/CourseGradeCalculator.tsx',
  '/components/More.tsx',
  '/components/Settings.tsx',
  '/components/InfoBox.tsx',
  '/components/Jarvis.tsx',
  '/components/Reports.tsx',
  '/vite.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        self.skipWaiting(); // Force the waiting service worker to become the active service worker.
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  // Network-first strategy for navigation requests (e.g., index.html)
  // to ensure users get the latest version of the app shell.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request); // Fallback to cache if network fails
      })
    );
    return;
  }

  // Cache-first strategy for all other assets for performance.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control of all open clients.
    );
});