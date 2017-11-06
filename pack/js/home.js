const reset = require("../unit/reset");
const header = require("../unit/header");
const footer = require("../unit/footer");
const download = require("../unit/download");
const swipe = require("../unit/swipe");
const position = require("../unit/position");
const style = require("../css/home.css");

$(() => {
    var HomePage = function () {
        this.init();
    };
    HomePage.prototype = {
        /**
         * 初始化
         * @method init
         */
        init() {
            this.bindEvent();
        },
        /**
         * 搜集节点
         * @method collectNode
         */
        collectNode() {
            return {
                blockhead: $(".block-head")
            }
        },
        /**
         * 绑定事件
         * @method bindUI
         */
        bindEvent() {
            let self = this;
            let that = self.collectNode();

            // 轮播
            self.carouselFigure();

            // 搜索框
            let search = (keyword) => {
                let repex = /.{2}-.{3}-.{4}$/g;
                let links = "";

                if (keyword.length == 11 && repex.test(keyword)) {
                    links = "/product?id=";
                } else {
                    links = "/search?keyword=";
                }

                location.href = links + keyword;
            };
            let searchtxt = that.blockhead.find(".search-txt");
            let searchend = that.blockhead.find(".search-go");

            searchtxt.on("keydown", (e) => {
                let key = e.keyCode;
                let text = searchtxt.val().trim();
                if (text && key === 13) { search(text); }
            });

            searchend.on("click", () => {
                let text = searchtxt.val().trim();
                if (text) { search(text); }
            });

            // 城市
            let checkcity = that.blockhead.find(".check-city span");
            if (localStorage.city) {
                checkcity.html(localStorage.city);
            } else {
                position.getPosition((val) => {
                    localStorage.city = val;
                    checkcity.html(val);
                });
            }

            that.blockhead.find(".check-city").on("click", () => {
                location.href = "/city";
            });
        },
        /**
        * 轮播模块事件绑定
        * @method carouselFigure
        * @param null
        * @return null
        */
        carouselFigure() {
            var self = this;

            var thatCarousel = document.querySelector(".block-carousel-figure");
            var thisFigure = thatCarousel.querySelector(".carousel-figure");
            var thisMarker = thatCarousel.querySelector(".marker");
            var thisMarkerSpan = thisMarker && thisMarker.querySelectorAll('span');

            if (thisFigure) {
                swipe.swipe(thisFigure, {
                    callback(index, node) {
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
                    auto: 4000
                });
            }
        }
    };

    new HomePage();
});