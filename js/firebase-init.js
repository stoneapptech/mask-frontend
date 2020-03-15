(() => { 
    let firebaseConfig = {
        apiKey: "AIzaSyCtB7A5YKHhN5-Gah3LGlrI_miVNLUwLks",
        authDomain: "mask-7f3e4.firebaseapp.com",
        databaseURL: "https://mask-7f3e4.firebaseio.com",
        projectId: "mask-7f3e4",
        storageBucket: "mask-7f3e4.appspot.com",
        messagingSenderId: "217483699441",
        appId: "1:217483699441:web:efbcd653335621afa3b550",
        measurementId: "G-K4G4HZXGPV"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
})();

const messaging = firebase.messaging();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./js/sw.js', {scope: "/mask"}).then(reg => {
        console.log('SW registered!', reg);
        messaging.useServiceWorker(reg);
        messaging.usePublicVapidKey('BL05SO-oLiMbnasxEcwkX7wI3BqQuxLrVmMzjTWsDtnoOOtU_AiuIg95Ffiex9Me8KUkBtXtqpJA7oCxo9FzlBE');
    }).catch(err => {
        console.error('Error!', err);
    });
}

messaging.onTokenRefresh(() => {
    messaging.getToken().then(refresh => {
        if (refresh) {
            console.log(`Token refreshed: ${refresh}`);
            let subFunc = firebase.functions().httpsCallable("developerSubcribe");
            subFunc({token: token}).then(res => {
                let data = res.data;
                if (!data.successCount) {
                    throw Error("Something was wrong when refreshing token.");
                }
            }).catch(err => {
                console.err(err);
            });
        }
    });
});