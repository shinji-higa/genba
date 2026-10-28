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
var IMG_CACHE = 'genba-img-v1';   // 写真の画像（電波がなくても前に見た写真を出す。2026-10-28）
var LIB_CACHE = 'genba-lib-v1';   // PDF を表示する部品（cdnjs）
var IMG_MAX = 1500;               // 写真の画像を残す枚数の上限（古いものから消す）

// ドライブの写真の画像（drive.google.com/thumbnail?id=…&sz=w…）。そのままでは中身を確かめられない形でしか受け取れず
// 端末の容量を大きく使うので、同じ画像を lh3.googleusercontent.com から受け取って残す
function imageFetch(event, req, url) {
  var id = url.searchParams.get('id'), sz = (url.searchParams.get('sz') || 'w400').replace(/[^a-z0-9-]/gi, '');
  event.respondWith(caches.open(IMG_CACHE).then(function (cache) {
    return cache.match(req.url).then(function (hit) {
      var fresh = fetch('https://lh3.googleusercontent.com/d/' + encodeURIComponent(id) + '=' + sz, { mode: 'cors', credentials: 'omit' })
        .then(function (res) {
          if (!res.ok) throw new Error('img ' + res.status);
          return cache.put(req.url, res.clone()).then(function () { trimImages(cache); return res; });
        })
        .catch(function () { return hit || fetch(req); });
      if (hit) { event.waitUntil(fresh.catch(function () {})); return hit; }
      return fresh;
    });
  }));
}
var trimming = false;
function trimImages(cache) {
  if (trimming) return;
  trimming = true;
  cache.keys().then(function (keys) {
    var extra = keys.length - IMG_MAX;
    return Promise.all(keys.slice(0, Math.max(0, extra)).map(function (k) { return cache.delete(k); }));
  }).then(function () { trimming = false; }, function () { trimming = false; });
}

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.hostname === 'drive.google.com' && url.pathname === '/thumbnail' && url.searchParams.get('id')) { imageFetch(event, req, url); return; }
  if (url.hostname === 'cdnjs.cloudflare.com' && url.pathname.indexOf('/ajax/libs/pdf.js/') === 0) {
    // 版の決まった部品なので、一度受け取ったら残したものを使う
    event.respondWith(caches.open(LIB_CACHE).then(function (cache) {
      return cache.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) { if (res.ok) cache.put(req, res.clone()); return res; });
      });
    }));
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf(new URL(self.registration.scope).pathname) !== 0) return;
  event.respondWith(
    caches.open(SHELL_CACHE).then(function (cache) {
      return cache.match(req).then(function (hit) {
        // ブラウザが前に受け取った分（置き場所の都合で最大10分使い回される）ではなく、毎回置き場所に新しいかを確かめる
        var fresh = fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then(function (res) {
          if (res && res.ok) {
            // 画面（app.html）が新しくなっていたら、開いている画面に「新しい版があります」を出してもらう
            var et = res.headers.get('etag'), old = hit && hit.headers.get('etag');
            if (old && et && old !== et && /\/app\.html$/.test(url.pathname)) notifyUpdate();
            cache.put(req, res.clone());
          }
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

function notifyUpdate() {
  self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    list.forEach(function (c) { c.postMessage({ genbaUpdate: true }); });
  });
}

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
