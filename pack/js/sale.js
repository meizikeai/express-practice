import "../unit/reset";
import "../unit/alert";
import Header from "../unit/header";
import Footer from "../unit/footer";
import "../css/sale.css";

$(() => {

    Header();
    Footer();

    let bd = $("#bd");
    let saleClass = [
        { "name": "推荐", "code": 1 },
        { "name": "最新", "code": 2 },
        { "name": "品牌", "code": 3 },
        { "name": "预告", "code": 4 }
    ];

    let { pass, int, interval } = { pass: true, int: 1, interval: null };

    let tipBox = (body, type, fn) => {
        $('body').alert({
            body: body,
            type: type,
            callback: fn
        });
    }

    (() => {
        let saleEvery = "";
        $.each(saleClass, (k, e) => {
            saleEvery += '<div class="every">' +
                '    <div class="key' + ((k === 0) ? " current" : "") + '" data-code="' + e.code + '">' + e.name + '</div>' +
                '</div>';
        });

        bd.append('<div class="app-sale-title">' + saleEvery + '</div>');
    })();

    let activity = (data) => {
        let template = "";
        if (data && data.length > 0) {
            $.each(data, (k, e) => {
                let discount = e.label ? '<span class="discount">' + e.discount + '</span>' : '';
                template += '<div class="active">' +
                    '    <div class="link">' +
                    '        <a href="/ProductList?condition=' + e._id + '&title=' + e.title + '">' +
                    '            <img src="' + e.imgurl + '" alt="' + e.title + '">' +
                    '            ' + discount +
                    '        </a>' +
                    '    </div>' +
                    '    <div class="info">' +
                    '        <span class="name">' + e.brandname + '</span>' +
                    '        <span class="time" data-start="' + e.starttime + '" data-end="' + e.endtime + '">倒计时</span>' +
                    '    </div>' +
                    '</div>';
            });
        }

        return template;
    };

    let countdown = () => {
        let activity = $(".app-sale-activity .time");
        let time = [];

        $.each(activity, (k, e) => {
            let that = $(e);
            time.push({
                node: that,
                start: that.attr("data-start"),
                end: that.attr("data-end")
            });
        });

        $.ajax({
            type: "get",
            url: "/servertime",
            data: { time: new Date().getTime() },
            dataType: 'json',
            success(data) {
                let result = [];
                let { day, hour, minute, startTime } = {};

                $.each(time, (k, e) => {
                    let { start, end, node, now } = {
                        start: new Date(e.start).getTime(),
                        end: new Date(e.end).getTime(),
                        node: e.node,
                        now: new Date(data.time).getTime()
                    };
                    if (now > start && now < end) {
                        result.push({ second: (end - now) / 1000, node: node, start: e.start });
                    } else {
                        result.push({ second: 0, node: node, start: e.start });
                    }
                });

                clearInterval(interval);
                interval = setInterval(() => {
                    for (let i = 0; i < result.length; i++) {
                        let temp = result[i];

                        if (int == 4) { //预告
                            startTime = new Date(temp.start);
                            temp.node.html("<i></i>" + (startTime.getMonth() + 1) + "月" + startTime.getDate() + "日");
                            clearInterval(interval);
                        } else {
                            if (temp.second < 0) {
                                temp.node.html("已结束");
                            } else { //进行中
                                day = Math.floor(temp.second / 86400);
                                hour = Math.floor((temp.second % 86400) / 3600);
                                if (day >= 1) {
                                    temp.node.html("<i></i>" + "剩" + day + "天");
                                } else if (hour >= 1) {
                                    temp.node.html("<i></i>" + "剩" + hour + "小时");
                                } else {
                                    minute = Math.floor(((temp.second % 86400) % 3600) / 60);
                                    if (minute <= 0) {
                                        temp.node.html("<i></i>" + "剩1分钟");
                                    } else {
                                        temp.node.html("<i></i>" + "剩" + minute + "分钟");
                                    }
                                }
                            }
                            temp.second--;
                        }
                    }
                }, 1000);
            },
            error() { }
        });
    };

    let getActivity = (code, boolean) => {
        $.ajax({
            type: "get",
            url: "/getsale",
            data: { code: code },
            dataType: 'json',
            success(data) {
                pass = true;
                int = code;

                if (data.success) {
                    if (boolean) {
                        bd.append('<div class="app-sale-activity">' + activity(data.data) + '</div>');
                    } else {
                        bd.find(".app-sale-activity").html(activity(data.data));
                    }

                    countdown();
                } else {
                    tipBox(data.description)
                }
            },
            error() {
                pass = true;
                tipBox("服务器貌似出问题啦~");
            }
        });
    };

    getActivity(1, true);

    // bind event
    (() => {
        let that = $(".app-sale-title .every");
        that.on("click", ".key", function (e) {
            let target = $(this);
            let code = target.attr("data-code");
            that.find(".key").removeClass("current");
            target.addClass("current");

            if (code && pass) {
                pass = false;
                getActivity(code);
            }
        });
    })();

});