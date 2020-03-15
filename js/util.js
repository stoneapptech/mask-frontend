function createEl(tag, data={}) {
    let el = document.createElement(tag);
    for (let [key, value] of Object.entries(data)) {
        el[key] = value;
    }
    return el;
}