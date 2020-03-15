function requestPermission() {
    if ("Notification" in window) {
        console.log('Requesting permission...');
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
            console.log('Notification permission granted.');
            $.toast({ title: '成功', content: '已授權通知', type: 'success', delay: 2500 });
        } else {
            console.log('Unable to get permission to notify.');
            $.toast({ title: '失敗', content: '無法取得通知授權', type: 'error', delay: 2500 });
        }
        });
    } else {
      console.error("Notification is not available in this browser.");
      $.toast({ title: '失敗', content: '此瀏覽器不支援通知。', type: 'error', delay: 2500 });
    }
}

$("#permitbtn").click((ev) => {
    ev.preventDefault();
    requestPermission();
});

$("#subscribebtn").click((ev) => {
    ev.preventDefault();
    $.toast({ title: '資訊', content: '正在註冊...', type: 'info', delay: 2500 });
    messaging.getToken().then(token => {
        if (token) {
        console.log(`Token: ${token}`);
        let subFunc = firebase.functions().httpsCallable("developerSubscribe");
        subFunc({token: token}).then((res) => {
            let data = res.data;
            if (data.successCount) {
            $.toast({ title: '成功', content: '已註冊', type: 'success', delay: 2500 });
            } else {
            throw Error("Something was wrong when subscribing to dev channel.");
            }
        }).catch((err) => {
            console.error(err);
            $.toast({ title: '失敗', content: '無法註冊', type: 'error', delay: 2500 });
        });
        } else {
            requestPermission();
        }
    });
});

$("#unsubscribebtn").click((ev) => {
    ev.preventDefault();
    $.toast({ title: '資訊', content: '正在取消訂閱...', type: 'info', delay: 2500 });
    messaging.getToken().then(token => {
        if (token) {
            let subFunc = firebase.functions().httpsCallable("developerUnsubscribe");
            subFunc({token: token}).then((res) => {
                let data = res.data;
                if (data.successCount) {
                $.toast({ title: '成功', content: '已取消', type: 'success', delay: 2500 });
                } else {
                throw Error("Something was wrong when unsubscribing from dev channel.");
                }
            }).catch((err) => {
                console.error(err);
                $.toast({ title: '失敗', content: '無法取消', type: 'error', delay: 2500 });
            });
        } else {
            requestPermission();
        }
    });
});


messaging.onMessage(payload => {
    console.log('Message received. ', payload);
    let data = payload.notification;
    let n = new Notification(data.title || "Title", {
        body: data.body
    });
});