importScripts("https://unpkg.com/idb@5.0.1/build/iife/index-min.js");
importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-messaging.js');

// install
self.addEventListener('install', ev => {
  console.log('installing…');
});

// activate
self.addEventListener('activate', ev => {
  console.log('Activated.');
});

firebase.initializeApp({
  apiKey: "AIzaSyCtB7A5YKHhN5-Gah3LGlrI_miVNLUwLks",
  authDomain: "mask-7f3e4.firebaseapp.com",
  databaseURL: "https://mask-7f3e4.firebaseio.com",
  projectId: "mask-7f3e4",
  storageBucket: "mask-7f3e4.appspot.com",
  messagingSenderId: "217483699441",
  appId: "1:217483699441:web:efbcd653335621afa3b550",
  measurementId: "G-K4G4HZXGPV"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('Received background message');
  let data = payload.notification;
  let options = {
    body: data.body
  };

  return self.registration.showNotification(data.title, options);
});