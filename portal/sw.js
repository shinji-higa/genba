/* 現場管理ポータル：電波がなくても開くための保存係（/portal/ の中だけで働く。今の現場管理とは別）
   ・画面（index.html など）：端末の控えをすぐ出し、裏で新しい版を確かめる。変わっていたら画面に知らせる
   ・部品（Firebase・pdf.js）：一度受け取ったら端末のものを使う
   ・写真・資料（Cloud Storage）：一度開いたものは端末に残す（電波なしでも見られる。通信料も減る） */
const SHELL = 'portal-shell-v1', LIB = 'portal-lib-v1', FILES = 'portal-files-v1', FILES_MAX = 1500;
const SHELL_FILES = ['./', 'app.css', 'i18n.js', 'logo.png', 'manifest.json', 'denpyo.html', 'maru.html', 'cons.html', 'kana.html', 'hood.html', 'kanagu.html'];   // 注文の画面も電波なしで開く（ユーザー指示 2026-10-31）

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => Promise.all(SHELL_FILES.map(u =>
    fetch(u + (u.includes('?') ? '&' : '?') + 'sw=' + Date.now(), { cache: 'no-store' }).then(r => { if (r.ok) return c.put(u, r); }).catch(() => {})
  ))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('portal-') && ![SHELL, LIB, FILES].includes(k)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

async function shell(req, ev) {
  const c = await caches.open(SHELL);
  const path = new URL(req.url).pathname, page = /\/portal\/(index\.html)?$/.test(path), key = page ? './' : path;
  const hit = await c.match(key, { ignoreSearch: true });
  // 控えは画面へ渡すと中身を読めなくなるので、版番号を比べる分を先に写しておく（写さないと比べるところで止まり、新しい版が端末に入らなかった。2026-11-05）
  const hitCopy = hit && page ? hit.clone() : null;
  // 配信元（GitHub）の中継が最大10分ほど古い版を返すので、毎回ちがう印（?sw=）を付けて最新を受け取る（2026-11-05）
  const fresh = new URL(page ? './' : req.url, self.location.href); fresh.searchParams.set('sw', Date.now());
  const net = fetch(fresh.href, { cache: 'no-store' }).then(async r => {
    if (r.ok) {
      // 新しい版かどうかは中身の版番号（APP_VER）で比べる。配信元によって日付・目印（ETag）が変わり、同じ中身でも知らせていた（2026-11-05）
      const ver = t => ((t || '').match(/APP_VER = '([^']+)'/) || [])[1] || '';
      const old = hitCopy ? ver(await hitCopy.text()) : '', now = page ? ver(await r.clone().text()) : '';
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
  if (u.hostname === 'cdn.jsdelivr.net' && u.pathname.startsWith('/npm/pdfjs-dist@')) { e.respondWith(cacheFirst(LIB, req)); return; }   // PDFの日本語の対応表
  if (u.hostname === 'firebasestorage.googleapis.com' && u.searchParams.get('alt') === 'media') { e.respondWith(cacheFirst(FILES, req, FILES_MAX)); return; }
});

/* 音の出る通知：Firebase から届いたものを出す。押したらアプリを前に出す（開いていなければ開く） */
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data.json(); } catch (x) {}
  const n = d.notification || {};
  e.waitUntil(self.registration.showNotification(n.title || '現場管理ポータル', { body: n.body || '', icon: n.icon, badge: n.badge, tag: n.tag, renotify: !!n.tag }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const w = list.find(c => c.url.indexOf(self.registration.scope) === 0 && 'focus' in c);
    return w ? w.focus() : self.clients.openWindow(self.registration.scope);
  }));
});