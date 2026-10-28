// ■ Firebase の設定（端末への通知用）
//   「通知の設定手順（Firebase）.txt」の【3】【4】で表示された値を、下の '' の中に貼り付けてください。
//   空のままでも動きます（その場合は、アプリを開いている間だけ通知が出ます）。
//   ※ このファイルの値は公開されても問題ないものです（秘密鍵はここには書きません）。
self.GENBA_FIREBASE = {
  config: {
    apiKey: 'AIzaSyA7XXnxdomqRL4BrAT_LaIf4C3Jnb9w3Wk',
    authDomain: 'genba-kanri-1d1df.firebaseapp.com',
    projectId: 'genba-kanri-1d1df',
    storageBucket: 'genba-kanri-1d1df.firebasestorage.app',
    messagingSenderId: '49202695720',
    appId: '1:49202695720:web:cfe735029ceaaa29656f1d'
  },
  // 【4】ウェブプッシュ証明書の「鍵ペア」
  vapidKey: 'BPPWyDgVh_Q4Hqdj5Y7PUinC4dczbghgBPrXP0kRXVRJct90caV-vHZSoJ9UTL-wLTe9sQUbgRY5fowvjh0fgBA'
};
