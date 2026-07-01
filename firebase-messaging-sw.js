// ============================================================
// てくてく Service Worker
// Firebase Cloud Messaging (FCM) のプッシュ通知を受け取る
// ============================================================
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Firebase設定（index.htmlと同じものを使う）
firebase.initializeApp({
  apiKey: "AIzaSyCD7Fqutz9k1AnnEo851LMlhR62rBmozMs",
  authDomain: "tekuteku-7a287.firebaseapp.com",
  projectId: "tekuteku-7a287",
  storageBucket: "tekuteku-7a287.firebasestorage.app",
  messagingSenderId: "427337289800",
  appId: "1:427337289800:web:04a21d39be9b579a64887d"
});

const messaging = firebase.messaging();

// バックグラウンド通知を受け取ったときの処理
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification || {};
  const notificationTitle = title || '📸 今日のお題が届きました';
  const notificationOptions = {
    body: body || '外に出て写真を撮ろう！',
    icon: icon || './icon.svg',
    badge: './icon.svg',
    tag: 'tekuteku-daily-mission',
    renotify: true,
    data: payload.data || {}
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 通知をタップしたときにアプリを開く
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('tekuteku') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('./index.html?openMission=1');
    })
  );
});

// Service Worker インストール・アクティベート
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));
