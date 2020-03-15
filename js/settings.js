(() => {
    const limit = 5;
    var data;
    async function settings() {
        console.log("switched to settings");
        if (!data) {
            // fetch data
            try {
                let res = await fetch(apiEndpoint + "/area_id.json");
                data = await res.json();
            } catch (err) {
                // todo
                console.error(e);
            }
        }
        for (let [key, value] of Object.entries(data)) {
            let el = createEl("option", {value: key, innerText: value["name"]});
            $("select#city").append(el);
        }

        // load config
        if (config.lastNum >= 0 && config.lastNum <= 9) {
            $("#idNum").val(config.lastNum).trigger("input");
        }

        if (config.area_id) {
            let [city, town] = config.area_id.split(".");
            $("select#city").val(city).trigger("change");
            $("select#town").val(town).trigger("change");
        }
    }
    
    $("#settings-tab").click(settings);

    // select city
    $("select#city").change(function(ev) {
        $("select#town").html("");
        $("select#town").append(createEl("option", {selected: true, innerText: "請選擇區域"}));
        let value = this.value;
        if (value != "請選擇縣市") {
            let townList = data[value]["town"];
            for (let [key, value] of Object.entries(townList).sort((a, b) => parseInt(a) - parseInt(b))) {
                let el = createEl("option", {value: key, innerText: value});
                $("select#town").append(el);
            }
        } else {
            $("#settings-table tbody").html("");
            $("#save-settings-btn").attr("disabled", true);
        }
    });

    // select town
    $("select#town").change(async function(ev) {
        $("#settings-table tbody").html("");
        let value = this.value;
        if (value != "請選擇區域") {
            let code = [$("select#city").val(), value].join(".");
            try {
                let res = await fetch(apiEndpoint + `/area/${code}.json`);
                var storeList = await res.json();
            } catch (e) {
                console.error(e);
            }
            for (let store of storeList.store) {
                let row = createEl("tr");
                row.dataset.code = store["code"];
                if (config.storeList.includes(store["code"])) {
                    row.classList.add("table-success");
                }
                for (let key of ["code", "name", "tel"]) {
                    let d = createEl("td");
                    if (key == "name") {
                        d.innerHTML = `${store[key]}<br><span class="address">${store["address"]}</span>`;
                    } else {
                        d.innerHTML = store[key];
                    }
                    row.appendChild(d);
                }
                $("#settings-table tbody").append(row);
            }
            $("#save-settings-btn").attr("disabled", false);
        } else {
            $("#save-settings-btn").attr("disabled", true);
        }
    });

    // select stores
    $("#settings-table").on("click", "tr", function(ev) {
        ev.preventDefault();
        let $el = $(ev.currentTarget);
        if (!$el.hasClass("table-success") && $("#settings-table tr.table-success").length + 1 > limit) {
            $.toast({ title: '失敗', content: `最多只能登記 ${limit} 間藥局`, type: 'error', delay: 2500 });
            return false;
        }
        $el.toggleClass("table-success");
    });

    // set parity    
    $("#idNum").on("input", function(ev) {
        let el = ev.target;
        if (el.validity.badInput) {
            el.value = "";
        }
        if (!el.value.length) {
            setState(false, false);
            return false;
        }
        if (el.value.length > 1) {
            el.value = el.value.slice(0, 1);
        }
        if (el.value % 2 == 0){
            setState(false, true);
        } else {
            setState(true, false);
        }
        
        function setState(odd, even) {
            $("#idOdd").attr("checked", odd);
            $("#idEven").attr("checked", even);
        }
    })

    // save settings
    $("#save-settings-btn").click(function(ev) {
        ev.preventDefault();

        let city = $("#city").val();
        let town = $("#town").val();
        if (city.length == 1 && town.length == 2) {
            config.area_id = city + "." + town;
        }

        if ($("#settings-table tr.table-success").length > limit) {
            $.toast({ title: '失敗', content: `最多只能登記 ${limit} 間藥局`, type: 'error', delay: 2500 });
            return false;
        }

        let tmpList = [];
        $("#settings-table tr.table-success").each((_i, e) => {
            if (e.dataset.code) {
                tmpList.push(e.dataset.code);
            }
        });
        config.storeList = tmpList;
        
        if ($("#idNum").val() == "") {
            $.toast({ title: '失敗', content: `請輸入身份證字號最後一碼`, type: 'error', delay: 2500 });
            $("#idNum").focus();
            return false;
        }

        $.toast({ title: '成功', content: '已儲存設定', type: 'success', delay: 2500 });
    });
})();