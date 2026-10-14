// 現場管理システム：通知を受け取る部品（サービスワーカー）
// ・Firebase 設定済みなら、アプリを閉じていても届く通知を表示する（表示は Firebase の部品が行う）
// ・通知を押したら、開いているアプリを前面に出す（開いていなければ開く）
importScripts('firebase-config.js');

var FB = (self.GENBA_FIREBASE && self.GENBA_FIREBASE.config && self.GENBA_FIREBASE.config.apiKey) ? self.GENBA_FIREBASE : null;
if (FB) {
  importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
  firebase.initializeApp(FB.config);
  firebase.messaging();
}

// 入口ページ自体（このサイトのファイル）を端末に保存しておき、次回からはすぐ表示する。
// 保存してあるものを先に返し、裏で新しいものを取りに行って保存し直す（更新は次に開いたときに反映される）。
// アプリ本体（Google 側）や Firebase の通信には手を出さない。
var SHELL_CACHE = 'genba-shell-v1';
self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf(new URL(self.registration.scope).pathname) !== 0) return;
  event.respondWith(
    caches.open(SHELL_CACHE).then(function (cache) {
      return cache.match(req).then(function (hit) {
        var fresh = fetch(req).then(function (res) {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        }).catch(function (err) {
          if (hit) return hit;
          throw err;
        });
        if (hit) { event.waitUntil(fresh.catch(function () {})); return hit; }
        return fresh;
      });
    })
  );
});

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (event) { event.waitUntil(self.clients.claim()); });

// Firebase 経由の通知は Firebase の部品が先に処理する。ここに来るのは、アプリが自分で出した通知
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf(self.registration.scope) === 0 && 'focus' in list[i]) return list[i].focus();
      }
      return self.clients.openWindow(self.registration.scope);
    })
  );
});
