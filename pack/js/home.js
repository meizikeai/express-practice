const reset = require("../unit/reset");
const header = require("../unit/header");
const footer = require("../unit/footer");
const download = require("../unit/download");
const swipe = require("../unit/swipe");
const style = require("../css/home.css");

$(function () {
    var HomePage = function () {
        this.init();
    };
    HomePage.prototype = {
        /**
         * 初始化
         * @method init
         */
        init: function () {
            this.collectNode();
            this.bindEvent();
        },
        /**
         * 搜集节点
         * @method collectNode
         */
        collectNode: function () {

        },
        /**
         * 绑定事件
         * @method bindUI
         */
        bindEvent: function () {
            var self = this;

            //轮播图片
            self.carouselFigure();

            //搜索框
            var txtKeyword = $("#txtKeyword"),
                search = $("#search");
            txtKeyword.click(function () {
                txtKeyword.val("");
            });
            txtKeyword.keydown(function (e) {
                var keyCode = e.keyCode,
                    text = txtKeyword.val().trim();
                if (keyCode == 13) {
                    if (text && text != '搜索商品or品牌') {
                        self.search(text);
                    }
                }
            });
            search.click(function () {
                var text = txtKeyword.val().trim();
                if (text && text != '搜索商品or品牌') {
                    self.search(text);
                }
            });
            txtKeyword.focus(function () {
                txtKeyword.css("color", "#333");
            });
            txtKeyword.blur(function () {
                if (txtKeyword.val() === "") {
                    txtKeyword.val("搜索商品or品牌");
                    txtKeyword.css("color", "#cacaca");
                }
            });
        },
        /**
         * 搜索
         * @method search
         * @param keyword {String} 搜索内容
         * @return null
         */
        search: function (keyword) {
            var self = this,
                repex = /.{2}-.{3}-.{4}$/g,
                links = '';

            if (keyword.length == 11 && repex.test(keyword)) {
                links = "/product?id=";
            } else {
                links = "/search?keyword=";
            }

            location.href = links + keyword;
        },
        /**
        * 轮播模块事件绑定
        * @method carouselFigure
        * @param null
        * @return null
        */
        carouselFigure: function () {
            var self = this;

            var thatCarousel = document.querySelector(".block-carousel-figure");
            var thisFigure = thatCarousel.querySelector(".carousel-figure");
            var thisMarker = thatCarousel.querySelector(".marker");
            var thisMarkerSpan = thisMarker && thisMarker.querySelectorAll('span');

            if (thisFigure) {
                swipe.swipe(thisFigure, {
                    callback: function (index, node) {
                        var count = thisMarkerSpan.length;

                        if (count > 0) {
                            while (count--) {
                                thisMarkerSpan[count].className = "";
                            }

                            //把自动复制的复位为对应的小点数目
                            if (thisMarkerSpan.length == 2 && index > 1) {
                                index = index - 2;
                            }

                            //判断当前的节点
                            if (thisMarkerSpan[index]) {
                                thisMarkerSpan[index].className = "pointer";
                            }
                        }
                    },
                    // auto: 4000
                });
            }
        }
    };

    new HomePage();
});