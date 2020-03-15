(() => {
    const adultMax = 400;
    const childMax = 200;
    async function home() {
        console.log("switched to index");

        $("#index-table tbody").html("");

        let now = new Date();
        $("#fetchTime").text(`更新時間: ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);

        try {
            let resTime = await fetch(apiEndpoint + "/update_time.txt");
            let timestamp = await resTime.text();
            let time = new Date(parseInt(timestamp));
            $("#dataTime").text(`資料時間: ${time.toLocaleString()}`);
        } catch (e) {
            // todo
            console.error(e);
        }

        // load config
        if (config.storeList.length) {
            console.log(config.storeList);
            let data = await fetchMaskNumber(config.storeList);
            for (let [key, value] of Object.entries(data)) {
                let row = createEl("tr");
                row.dataset.code = key;
                for (let k of ["name", "adult", "child"]) {
                    let d = createEl("td", {innerText: value[k]});
                    if (k == "name") {
                        d.innerHTML = `<a href="javascript:void(0)">${value[k]}</a>`;
                    }
                    if (k == "adult") {
                        var max = adultMax;
                    } else if (k == "child") {
                        var max = childMax;
                    }
                    if (max) {
                        if (value[k] == 0) {
                            d.classList.add("table-dark");
                        } else if (value[k] <= max * 0.2) {
                            d.classList.add("table-danger");
                        } else if (value[k] <= max * 0.5) {
                            d.classList.add("table-warning");
                        }
                    }
                    row.appendChild(d);
                }
                $("#index-table tbody").append(row);
            }
        } else {
            let row = createEl("tr");
            let d = createEl("td", {col: 3, innerText: "尚未選擇藥局"});
            row.appendChild(d);
            $("#index-table tbody").append(row);
        }
    }

    async function fetchMaskNumber(codeList) {
        let data = {};

        for (let code of codeList) {
            try {
                let res = await fetch(apiEndpoint + `/mask_number/${code}.json`);
                let resInfo = await fetch(apiEndpoint + `/store/${code}.json`);
                var json = await res.json();
                var info = await resInfo.json();
            } catch (e) {
                // todo
                console.error(e);
            }
            json["name"] = info.name;
            data[code] = json;
        }

        return data;
    }
    
    $("#index-tab").click(home);
    home();
})();