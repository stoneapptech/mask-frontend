const dbPromise = idb.openDB("mask", 1, function(db) {
    if (!db.objectStoreNames.contains("config")) db.createObjectStore("config", {keyPath: name});
    if (!db.objectStoreNames.contains("cache")) db.createObjectStore("cache", {keyPath: code});
});

const Config = {
    schema: {
        name: "default",
        area_id: "",
        storeList: [],
        lastNum: -1
    },
    load: function() {
        return dbPromise.then(db => {
            let tx = db.transaction("config", "readonly");
            let store = tx.objectStore("config");
            return store.get("default");
        }).then(cfg => {
            return cfg ? cfg : this.schema;
        }).catch(_err => {
            return this.schema;
        });
    },
    set: function(cfg) {
        return dbPromise.then(db => {
            let tx = db.transaction("cache", "readwrite");
            let store = tx.objectStore("cache");
            store.put(cfg);
            return tx.complete;
        });
    }
}

function cacheStoreData(dataList) {
    return dbPromise.then(db => {
        let tx = db.transaction("cache", "readwrite");
        let store = tx.objectStore("cache");
        return Promise.all(dataList.map(function(item) {
            console.log('Adding item: ', item);
            return store.put(item);
        })).catch(function(e) {
            tx.abort();
            console.log(e);
        });
    });
}

function getCacheStoreData() {
    return dbPromise.then(db => {
        let tx = db.transaction("cache", "readwrite");
        let store = tx.objectStore("cache");
        return store.getAll();
    });
}