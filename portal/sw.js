/* 現場管理ポータル：電波がなくても開くための保存係（/portal/ の中だけで働く。今の現場管理とは別）
   ・画面（index.html など）：端末の控えをすぐ出し、裏で新しい版を確かめる。変わっていたら画面に知らせる
   ・部品（Firebase・pdf.js）：一度受け取ったら端末のものを使う
   ・写真・資料（Cloud Storage）：一度開いたものは端末に残す（電波なしでも見られる。通信料も減る） */
const SHELL = 'portal-shell-v1', LIB = 'portal-lib-v1', FILES = 'portal-files-v1', FILES_MAX = 1500;
const SHELL_FILES = ['./', 'app.css', 'logo.png', 'manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => Promise.all(SHELL_FILES.map(u =>
    fetch(u, { cache: 'no-cache' }).then(r => { if (r.ok) return c.put(u, r); }).catch(() => {})
  ))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('portal-') && ![SHELL, LIB, FILES].includes(k)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

async function shell(req, ev) {
  const c = await caches.open(SHELL);
  const key = req.mode === 'navigate' ? './' : new URL(req.url).pathname;
  const hit = await c.match(key, { ignoreSearch: true });
  const net = fetch(req.mode === 'navigate' ? './' : req.url, { cache: 'no-cache' }).then(async r => {
    if (r.ok) {
      const old = hit && (hit.headers.get('etag') || hit.headers.get('last-modified'));
      const now = r.headers.get('etag') || r.headers.get('last-modified');
      await c.put(key, r.clone());
      if (hit && old && now && old !== now && req.mode === 'navigate') {
        (await self.clients.matchAll({ type: 'window' })).forEach(w => w.postMessage({ type: 'portal-update' }));
      }
    }
    return r;
  });
  // 控えを先に返しても、新しい版を受け取り終わるまで保存係を止めない（iPhone は待たせないと途中で打ち切る）
  if (hit) { ev.waitUntil(net.catch(() => {})); return hit; }
  return net;
}
async function cacheFirst(name, req, max) {
  const c = await caches.open(name);
  const hit = await c.match(req);
  if (hit) return hit;
  const r = await fetch(req);
  if (r.ok || r.type === 'opaque') {
    await c.put(req, r.clone());
    if (max) c.keys().then(ks => { if (ks.length > max) ks.slice(0, ks.length - max).forEach(k => c.delete(k)); });
  }
  return r;
}
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.origin === self.location.origin) {
    if (u.searchParams.has('check')) return;   // 新しい版の確認は、端末の控えを通さない
    if (u.pathname.startsWith('/portal/') && !u.pathname.endsWith('/sw.js')) e.respondWith(shell(req, e));
    return;
  }
  if (u.hostname === 'www.gstatic.com' && u.pathname.startsWith('/firebasejs/')) { e.respondWith(cacheFirst(LIB, req)); return; }
  if (u.hostname === 'cdnjs.cloudflare.com' && u.pathname.includes('/pdf.js/')) { e.respondWith(cacheFirst(LIB, req)); return; }
  if (u.hostname === 'firebasestorage.googleapis.com' && u.searchParams.get('alt') === 'media') { e.respondWith(cacheFirst(FILES, req, FILES_MAX)); return; }
});
