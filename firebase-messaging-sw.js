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
