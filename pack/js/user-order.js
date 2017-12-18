import "../unit/alert";
import Header from "../unit/header";
import "../css/user-order.css";

$(() => {
    Header();

    let tipBox = (body, type, fn) => {
        $('body').alert({
            body: body,
            type: type,
            callback: fn
        });
    }

    let createTemplate = (state) => {
        let group = state.data;
        let groupHTML = "";

        group.forEach((e, k) => {
            let count = e.oid;
            let every = e.base;
            let template = "";

            every.forEach((o, i) => {
                if (o.cellType === "storage") {
                    let store = o.cellData[0].fields.sellerId;

                    template += '<div class="module-' + o.cellType + '">' +
                        '    <div data-id="' + store + '"></div>' +
                        '</div>';
                }

                if (o.cellType === "seller") {
                    let store = o.cellData[0];
                    let state = o.cellData[1];

                    template += '<div class="module-' + o.cellType + '">' +
                        '        <div class="seller">' +
                        '            <div class="picture"><img src="' + store.fields.shopImg + '" alt="' + store.fields.shopName + '" /></div>' +
                        '            <div class="contact">' +
                        '                <a href="/user/order?id=' + store.fields.id + '">' +
                        '                    <span class="title">' + store.fields.shopName + '</span>' +
                        '                    <span class="arrow"></span>' +
                        '                </a>' +
                        '            </div>' +
                        '            <div class="state">' +
                        '                <p>' + state.fields.text + '</p>' +
                        '            </div>' +
                        '        </div>' +
                        '    </div>';
                }

                if (o.cellType === "item") {
                    let store = o.cellData[0];
                    let service = o.cellData[1];
                    let picture = "", info = "";

                    if (store.fields.pic) {
                        picture = '<div class="picture">' +
                            '    <img src="' + store.fields.pic + '" alt="' + store.fields.title + '" />' +
                            '</div>';
                    }

                    if (service) {
                        let temp = "";
                        service.fields.main.map((v, b) => {
                            temp += '<span data-id="' + v.id + '">' + v.name + '</span>';
                        })
                        info = '<div class="service">' + temp + '</div>';
                    }

                    template += '<div class="module-' + o.cellType + '">' +
                        '    <div class="item ' + (store.fields.pic ? "" : "item-2") + '">'
                        + picture +
                        '        <div class="info">' +
                        '            <h3 class="title">' + store.fields.title + '</h3>' +
                        '            <p class="sku">' + (store.fields.skuText ? store.fields.skuText : "") + '</p>'
                        + info +
                        '        </div>' +
                        '        <div class="pay">' +
                        '            <p class="price">' + (store.fields.priceInfo.original ? store.fields.priceInfo.original : store.fields.priceInfo.promotion) + '</p>' +
                        '            <p class="nums">x' + store.fields.quantity + '</p>' +
                        '        </div>' +
                        '    </div>' +
                        '</div>';
                }

                if (o.cellType === "pay") {
                    let store = o.cellData[0].fields;

                    let total = "", actualFee = "", postFee = "";
                    if (store.total) {
                        total = '<span>' + store.total.prefix + '<b>' + store.total.value + '</b>' + store.total.suffix + '</span>';
                    }
                    if (store.actualFee) {
                        actualFee = '<span>' + store.actualFee.prefix + '<b>' + store.actualFee.value + '</b></span>';
                    }
                    if (store.postFee) {
                        postFee = '<span>' + store.postFee.prefix + '<b>' + store.postFee.value + '</b>' + store.postFee.suffix + '</span>';
                    }

                    template += '<div class="module-' + o.cellType + '">' +
                        '    <div class="pay">' + total + actualFee + postFee + '</div>' +
                        '</div>';
                }

                if (o.cellType === "option") {
                    let store = o.cellData[0].fields.values;
                    let type = {
                        orderRate: "评价",
                        appendRate: "追加评价",
                        delOrder: "删除订单",
                        viewLogistic: "查看物流",
                        applyInvoice: "开票申请",
                        waitPay: "立即支付",
                        waitConfirm: "确认收货"
                    };
                    let option = "";
                    store.reverse().forEach((m, n) => {
                        let pass = false;
                        if (type[m]) {
                            pass = (m === "orderRate" || m === "waitPay" || m === "waitConfirm");
                            option += '<li class="' + (pass ? "cursor" : "") + '" data-name="' + m + '">' + type[m] + '</li>';
                        }
                    });

                    template += '<div class="module-' + o.cellType + '">' +
                        '    <div class="option">' +
                        '        <ul>' + option + '</ul>' +
                        '    </div>' +
                        '</div>';
                }
            });

            groupHTML += '<li class="one" data-key="' + count + '">' + template + '</li>';
        });

        return '<ul class="order-list">' + groupHTML + '</ul>';
    }

    let userOrderList = $(".user-order-list");
    let errorHTML = '<div class="user-order-error">' +
        '    <div class="picture"></div>' +
        '    <p class="txt">您还没有相关的订单</p>' +
        '    <p class="sub-txt">去看看有哪些想买</p>' +
        '    <p class="refresh"><a href="/">随便逛逛</a></p>' +
        '</div>';

    let getOrderData = (option) => {
        $.ajax({
            type: "get",
            url: "/getorder",
            data: {
                type: option.type,
                time: new Date().getTime()
            },
            dataType: "json",
            success(data) {
                if (data.success) {
                    userOrderList.html(createTemplate(data));
                } else {
                    if (data.code == "01") {
                        tipBox(data.description, null, () => {
                            location.href = data.url;
                        });
                    } else {
                        userOrderList.html(errorHTML);
                        // tipBox(data.description);
                    }
                }
            },
            error() {
                tipBox("可能网络有问题~");
            }
        });
    }

    getOrderData({ type: "all" });

    // 绑定事件
    (() => {
        $(".user-order-title").on("click", "li", function (e) {
            let that = $(this);
            let type = that.attr("data-code");

            if (that.hasClass("cursor")) { return false; }

            that.addClass("cursor").siblings().removeClass("cursor");

            getOrderData({ type: type });
        });

        $(".user-order-list").on("click", ".option li", function (e) {
            tipBox("暂未开发此功能~");
        });
    })();

});