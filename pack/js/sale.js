import "../unit/reset";
import "../unit/alert";
import Header from "../unit/header";
import Footer from "../unit/footer";
import "../css/sale.css";

$(() => {

    Header();
    Footer();

    let bd = $("#bd");
    let saleClass = [{ "name": "推荐", "code": 1 }, { "name": "最新", "code": 2 }, { "name": "爆推", "code": 3 }, { "name": "预告", "code": 4 }];

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
                '    <div class="key' + ((k === 0) ? " current" : "") + '">' +
                '        <span>' + e.name + '</span>' +
                '    </div>' +
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
                    '    <div class="info cf">' +
                    '        <span class="name">' + e.brandname + '</span>' +
                    '        <span class="countdown" data-start="' + e.starttime + '" data-end="' + e.endtime + '"></span>' +
                    '    </div>' +
                    '</div>';
            });
        }

        return template;
    };

    (() => {
        $.ajax({
            type: "get",
            url: "/getsale",
            data: { code: 1 },
            dataType: 'json',
            success(data) {
                if (data.success) {
                    if (data.code == 1) {
                        bd.append('<div class="app-sale-activity">' + activity(data.data) + '</div>');
                    } else {
                        bd.find(".app-activity").html();
                    }
                } else {
                    tipBox(data.description)
                }
            },
            error() {
                tipBox("服务器貌似出问题啦~")
            }
        });
    })();
});