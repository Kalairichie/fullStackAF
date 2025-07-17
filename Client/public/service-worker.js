const CACHE_NAME = 'sales-app-cache-v1';
const API_BASE_URL = '/api';
const OFFLINE_FORM_STORE = 'offline-sales';

const STATIC_FILES = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.png',
];

// 🔹 Install and cache static assets
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_FILES);
        })
    );
});

// 🔹 Clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            )
        )
    );
});

// 🔹 Intercept requests
self.addEventListener('fetch', event => {
    const { request } = event;

    // Handle form POSTs when offline
    if (request.method === 'POST' && request.url.includes(`${API_BASE_URL}/sales`)) {
        event.respondWith(
            fetch(request).catch(() => {
                return request.clone().json().then(body => {
                    return saveOfflineSale(body).then(() => {
                        return new Response(JSON.stringify({ offline: true }), {
                            headers: { 'Content-Type': 'application/json' }
                        });
                    });
                });
            })
        );
        return;
    }

    // Cache-first strategy for static files
    if (STATIC_FILES.some(url => request.url.includes(url))) {
        event.respondWith(
            caches.match(request).then(cached => {
                return cached || fetch(request);
            })
        );
        return;
    }

    // Network fallback for API GETs or dynamic requests
    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request);
        })
    );
});

// 🔹 Background Sync
self.addEventListener('sync', event => {
    if (event.tag === 'sync-sales') {
        event.waitUntil(
            syncOfflineSales().catch(err =>
                console.error('❌ Background sync failed:', err)
            )
        );
    }
});

// 🔹 Save sale in IndexedDB when offline
function saveOfflineSale(data) {
    return openDB().then(db => {
        const tx = db.transaction(OFFLINE_FORM_STORE, 'readwrite');
        tx.objectStore(OFFLINE_FORM_STORE).add(data);
        return tx.complete;
    });
}

// 🔹 Sync offline sales with server
function syncOfflineSales() {
    return openDB().then(db => {
        const tx = db.transaction(OFFLINE_FORM_STORE, 'readonly');
        const store = tx.objectStore(OFFLINE_FORM_STORE);
        return store.getAll().then(sales => {
            return Promise.all(
                sales.map(sale =>
                    fetch(`${API_BASE_URL}/sales`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(sale),
                    })
                )
            ).then(() => {
                const deleteTx = db.transaction(OFFLINE_FORM_STORE, 'readwrite');
                deleteTx.objectStore(OFFLINE_FORM_STORE).clear();
                return deleteTx.complete;
            });
        });
    });
}

// 🔹 Open IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('SalesAppDB', 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(OFFLINE_FORM_STORE)) {
                db.createObjectStore(OFFLINE_FORM_STORE, { autoIncrement: true });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
