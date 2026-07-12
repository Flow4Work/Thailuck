import fs from 'node:fs';
import path from 'node:path';

const distDir = process.argv[2];
if (!distDir) throw new Error('Usage: node kill-sw.mjs <dist-directory>');

const killer = `/* ThaiLuck legacy service-worker shutdown */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    } catch {}
    try { await self.registration.unregister(); } catch {}
    try {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      await Promise.all(clients.map(client => client.navigate('/release-20260713-0750?sw-reset=' + Date.now())));
    } catch {}
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => Response.redirect('/release-20260713-0750?offline-reset=1', 302)));
  }
});
`;

for (const name of ['sw.js', 'service-worker.js', 'serviceWorker.js']) {
  fs.writeFileSync(path.join(distDir, name), killer, 'utf8');
}
console.log('Created legacy service-worker shutdown files');
