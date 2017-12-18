import "../unit/alert";
import Header from "../unit/header";
import Swipe from "../unit/swipe";
import "../css/product.css";

$(() => {
    Header();

    const bd = $("#bd");
    const data = window.fake;
    const tipBox = (body, type, fn) => {
        $('body').alert({
            body: body,
            type: type,
            callback: fn
        });
    }

    // 商品尺码
    ((base) => {
        let colorName = "", sizeName = "", mode = "cart";
        const price = base.price;
        const { props, skus, core } = base.skubase;
        const handleSkuBase = (data) => {
            let color = "", size = "", check = "";
            props.forEach((e, k) => {
                check += '<span>' + e.name + '</span>';
                if (e.name && k === 0) {
                    colorName = e.name;
                } else if (e.name && k === 1) {
                    sizeName = e.name;
                }

                if (e.values.length > 0) {
                    if (k === 0) {
                        e.values.forEach((o, i) => {
                            color += '<span class="color" data-value="' + e.pid + ':' + o.vid + '" data-image="' + o.image + '">' + o.name + '</span>';
                        });
                    } else if (k === 1) {
                        e.values.forEach((o, i) => {
                            size += '<span data-value="' + e.pid + ':' + o.vid + '">' + o.name + '</span>';
                        });
                    }
                }
            });

            if (props.length > 1) {
                size = '<li class="checktwo">' +
                    '   <h3>' + sizeName + '</h3>' +
                    '   <div class="items">' + size + '</div>' +
                    '</li>';
            }
            check = '<span>已选择:</span>' + check;

            return '<div class="module-sku">' +
                '    <div class="cover-bg"></div>' +
                '    <div class="cover-content">' +
                '    <div class="cover-header">' +
                '    <div class="present">' +
                '        <div class="img">' +
                '            <img src="' + props[0].values[0].image + '" alt="选中的商品图" />' +
                '        </div>' +
                '        <div class="main">' +
                '            <div class="price">¥' + price.priceText + '</div>' +
                '            <div class="stock">库存 ' + core["0"].quantity + '件</div>' +
                '            <div class="info">' + check + '</div>' +
                '        </div>' +
                '        <span class="close" title="关闭"></span>' +
                '    </div>' +
                '    </div>' +
                '    <div class="cover-body">' +
                '        <ul class="optional">' +
                '            <li class="checkone">' +
                '                <h3>' + colorName + '</h3>' +
                '                <div class="items">' + color + '</div>' +
                '            </li>' + size +
                '        </ul>' +
                '        <div class="count">' +
                '            <label for="number">购买数量</label>' +
                '            <div class="number">' +
                '                <button class="cut disabled">-</button><input class="quantity"' +
                '                data-count="' + core["0"].quantity + '" type="number" value="1" /><button class="add">+</button>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '    <div class="cover-footer">确定</div>' +
                '    </div>' +
                '</div>';
        }

        const addToCartAjax = (sku, quantity) => {
            $.ajax({
                type: "post",
                url: mode === "cart" ? "/addtocart" : "/addtocart",
                data: {
                    quantity: quantity,
                    sku: sku
                },
                dataType: "json",
                success(data) {
                    if (data.success) {
                        console.log(mode);

                        $('body').alert({
                            body: data.description,
                            type: "confirm",
                            confirmBtnText: mode === "cart" ? "去购物车" : "立即结算",
                            cancelBtnText: "继续购物",
                            callback: () => {
                                location.href = data.url;
                            }
                        });
                    } else {
                        tipBox(data.description);
                    }
                },
                error() {
                    tipBox("服务器貌似出问题啦~")
                }
            })
        }

        const bindEvent = () => {
            let that = $(".module-sku");
            let color = "", size = "", colorText = "", sizeText = "";

            that.on("click", ".cover-bg,.cover-footer,.present .close", function (e) {
                let check = "";
                let tar = $(this);
                let back = that.find(".cover-bg");
                let content = that.find(".cover-content");

                if (tar.hasClass("cover-footer")) {
                    if (color && size) {
                        let option = null;
                        skus.forEach((o, i) => {
                            if (o.path == (color + ";" + size)) {
                                option = o;
                                check = o.sku;
                            }
                        });

                        console.log(option);

                        if (check) {
                            let quantity = that.find(".number .quantity").val();
                            addToCartAjax(check, quantity);
                        }
                    } else if (!color && size) {
                        tipBox("请选择" + colorName);
                    } else if (color && !size) {
                        tipBox("请选择" + sizeName);
                    } else {
                        tipBox("请选择" + colorName + "、" + sizeName);
                    }
                } else {
                    back.css("bottom", "-100%");
                    content.css("bottom", "-100%");
                }
            });

            let checkone = that.find(".checkone");
            let checktwo = that.find(".checktwo");

            const isObject = (e) => {
                return Object.prototype.toString.call(e) === "[object Object]";
            }

            that.on("click", ".optional span", function (e) {
                let target = $(this);
                let picture = that.find(".present .img img");
                let stock = that.find(".present .stock");
                let info = that.find(".present .info");
                let quantity = that.find(".count .quantity");

                if (target.hasClass("color")) {
                    if (target.hasClass("disabled")) {
                        return false;
                    }

                    color = target.attr("data-value");
                    colorText = target.html();
                    picture.attr("src", target.attr("data-image"));
                    target.siblings().removeClass("checked");
                    target.addClass("checked");

                    info.html('<span>已选择:</span><span>' + colorText + '</span>' + (sizeText ? '<span>' + sizeText + '</span>' : '<span>' + sizeName + '</span>'));

                    checktwo.find("span").each((k, e) => {
                        let tar = $(e);
                        let every = tar.attr("data-value");
                        skus.forEach((o, i) => {
                            if (o.path == (color + ";" + every)) {
                                let notes = core[o.sku];
                                if (!isObject(notes)) { return false; }
                                if (notes.quantity < 1) {
                                    tar.addClass("disabled").removeClass("checked");
                                } else {
                                    tar.removeClass("disabled");
                                }
                            }
                        });
                    });

                    console.log(color);
                } else {
                    if (target.hasClass("disabled")) {
                        return false;
                    }

                    size = target.attr("data-value");
                    sizeText = target.html();
                    target.siblings().removeClass("checked");
                    target.addClass("checked");

                    info.html('<span>已选择:</span>' + (colorText ? '<span>' + colorText + '</span>' : '<span>' + colorName) + '</span>' + '<span>' + sizeText + '</span>');

                    checkone.find("span").each((k, e) => {
                        let tar = $(e);
                        let every = tar.attr("data-value");

                        skus.forEach((o, i) => {
                            if (o.path == (every + ";" + size)) {
                                let notes = core[o.sku];
                                if (!isObject(notes)) { return false; }
                                if (notes.quantity < 1) {
                                    tar.addClass("disabled").removeClass("checked");
                                } else {
                                    tar.removeClass("disabled");
                                }
                            }
                        });
                    });

                    if (color) {
                        skus.forEach((o, i) => {
                            if (o.path == (color + ";" + size)) {
                                let notes = core[o.sku];
                                if (!isObject(notes)) { return false; }
                                quantity.attr("data-count", notes.quantity);
                                stock.html("库存" + notes.quantity + "件");
                                if (notes.quantity < 1) {
                                    target.addClass("disabled").removeClass("checked");
                                } else {
                                    target.removeClass("disabled");
                                }
                            }
                        });
                    }

                    console.log(size);
                }
            });

            that.on("click", ".number button", function (e) {
                let tar = $(this);

                if (tar.hasClass("disabled")) {
                    return false;
                }

                let quantity = that.find(".number .quantity");
                let add = that.find(".number .add");
                let cut = that.find(".number .cut");
                let max = quantity.attr("data-count");
                let count = parseInt(quantity.val());

                if (tar.hasClass("add")) {
                    if (max == 0) {
                        console.log(max);
                    } else if (count + 1 < max) {
                        quantity.val(count + 1);
                        cut.removeClass("disabled");
                    } else {
                        if (count + 1 == max) {
                            quantity.val(count + 1);
                        }
                        tar.addClass("disabled");
                        cut.removeClass("disabled");
                    }
                } else if (tar.hasClass("cut")) {
                    if (count - 1 < 1) {
                        tar.addClass("disabled");
                    } else {
                        quantity.val(count - 1);
                        if (count - 1 == 1) {
                            tar.addClass("disabled");
                        }
                        add.removeClass("disabled");
                    }
                }
            });

            that.on("blur", ".number .quantity", function (e) {
                let tar = $(this);
                let val = tar.val();
                let max = tar.attr("data-count");
                let add = that.find(".number .add");
                let cut = that.find(".number .cut");

                if (val < 1) {
                    tar.val(1);
                    add.removeClass("disabled");
                    cut.addClass("disabled");
                }

                if (val > max) {
                    tar.val(max);
                    add.addClass("disabled");
                    cut.removeClass("disabled");
                }
            });
        }

        $(".product-sku,.product-cart .cart,.product-cart .buy").on("click", (e) => {
            let that = $(".module-sku");

            if (that.hasClass("product-sku") || that.hasClass("cart")) {
                mode = "cart";
            } else if (that.hasClass("buy")) {
                mode = "buy";
            }

            if (that.length > 0) {
                that.find(".cover-bg").css("bottom", "0%");
                that.find(".cover-content").css("bottom", "0%");
            } else {
                bd.append(handleSkuBase(base));
                setTimeout(() => {
                    that = $(".module-sku");
                    that.find(".cover-bg").css("bottom", "0%");
                    that.find(".cover-content").css("bottom", "0%");
                }, 100);

                bindEvent();
            }
        });
        
    })(data);


    // 服务保证
    ((base) => {
        const handleService = (data) => {
            let temp = "";

            data.forEach((e, k) => {
                temp += '<dt><img src="' + e.image + '" />' + e.title + '</dt><dd>' + e.desc + '</dd>';
            });

            return '<div class="module-service">' +
                '    <div class="cover-bg"></div>' +
                '    <div class="cover-content">' +
                '        <div class="cover-header">' +
                '            <h3>基础保障</h3>' +
                '        </div>' +
                '        <div class="cover-body">' +
                '            <dl>' + temp + '</dl>' +
                '        </div>' +
                '        <div class="cover-footer">确定</div>' +
                '    </div>' +
                '</div>';
        }

        const bindEvent = () => {
            let that = $(".module-service");
            that.on("click", ".cover-bg,.cover-footer", function (e) {
                let back = that.find(".cover-bg");
                let content = that.find(".cover-content");
                back.css("bottom", "-100%");
                content.css("bottom", "-100%");
            });
        }

        $(".product-service").on("click", (e) => {
            let that = $(".module-service");
            if (that.length > 0) {
                that.find(".cover-bg").css("bottom", "0%");
                that.find(".cover-content").css("bottom", "0%");
            } else {
                bd.append(handleService(base));
                setTimeout(() => {
                    that = $(".module-service");
                    that.find(".cover-bg").css("bottom", "0%");
                    that.find(".cover-content").css("bottom", "0%");
                }, 100);

                bindEvent();
            }
        });

    })(data.protection);

    // 产品图轮播
    (() => {
        const thatCarousel = document.querySelector(".product-carousel");

        if (!thatCarousel) { return false }

        const thisFigure = thatCarousel.querySelector(".carousel-figure");
        const thisMarker = thatCarousel.querySelector(".marker");
        const thisMarkerSpan = thisMarker && thisMarker.querySelectorAll('span');

        if (!thisFigure) { return false }

        Swipe(thisFigure, {
            callback(index, node) {
                let count = thisMarkerSpan.length;

                if (count > 0) {
                    while (count--) {
                        thisMarkerSpan[count].className = "";
                    }

                    // 重新校对
                    if (thisMarkerSpan.length == 2 && index > 1) {
                        index = index - 2;
                    }

                    if (thisMarkerSpan[index]) {
                        thisMarkerSpan[index].className = "pointer";
                    }
                }
            }
        });
    })();

});