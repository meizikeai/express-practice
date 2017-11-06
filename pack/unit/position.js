module.exports = {
    getCurrentPosition() {
        // getCurrentPosition是异步走maps.google.cn、googleapis.com等接口获取位置信息
        // https://maps.google.cn/maps/api/geocode/json?latlng={0},{1}&sensor=true&language=zh-CN
        // http://maps.google.cn/maps/api/geocode/json?latlng=37.09024,-95.712891&sensor=true&language=zh
        // 国内google要梯子才能访问，建议使用第三方提供如高德、百度等
        // 有梯子时的示例：
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position);

                // position有以下的值
                // let position = {
                //     "coords": {
                //         "accuracy": 1488703,
                //         "altitude": null,
                //         "altitudeAccuracy": null,
                //         "heading": null,
                //         "latitude": 37.09024,
                //         "longitude": -95.712891,
                //         "speed": null
                //     },
                //     "timestamp": 1508735751838
                // }

                // 拿到 经度（longitude）纬度（latitude）后像第三方接口请求相关~

                // do something...

            }, (error) => {
                console.log(error);
            }, { timeout: 5000 });
        }
    },
    thirdParty(fn) {
        // http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js 返回以下
        // var remote_ip_info = {
        //     "ret": 1,
        //     "start": -1,
        //     "end": -1,
        //     "country": "中国",
        //     "province": "北京",
        //     "city": "北京",
        //     "district": "",
        //     "isp": "",
        //     "type": "",
        //     "desc": ""
        // };

        // 直接使用第三方获取
        const script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.src = "http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js";
        document.body.appendChild(script);

        //通过循环去获取
        const remote = () => {
            let timer = setTimeout(() => {
                if (typeof window.remote_ip_info === "object") {
                    console.log(window.remote_ip_info);
                    clearTimeout(timer);

                    if (typeof fn === "function") {
                        fn(window.remote_ip_info.city);
                    }
                } else {
                    remote();
                }
            }, 200);
        }

        return remote();
    },
    getPosition(fn) {
        this.getCurrentPosition();
        this.thirdParty(fn);
    }
};