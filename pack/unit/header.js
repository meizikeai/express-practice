const common = require("./common")();
const style = require("../css/style.css");

module.exports = function () {
    $(function () {
        var BindHeadEvent = function () {
            this.init();
        };

        BindHeadEvent.prototype = {
            init: function () {
                this.bindEvent();
            },
            bindEvent: function () {
                var self = this;

                //检测是否是无痕浏览
                common.isWorking();

                //页面头部下拉
                var N_body = $('body');
                $(".header .more").click(function () {
                    var that = $(this),
                        kdAlert = N_body.find('.kd-alert'),
                        kdSeet = N_body.find('.kd-seet'),
                        ytHeader = $('.header');

                    if (kdAlert.length < 1) {
                        var temp = '<div class="kd-alert">' +
                            '<div class="alert">' +
                            '<a href="/"><i class="shouye"></i><span>首页</span></a>' +
                            '<a href="/category"><i class="fenlei"></i><span>分类</span></a>' +
                            '<a href="/cart"><i class="gouwudai"></i><span>购物车</span></a>' +
                            '<a href="/user"><i class="wode"></i><span>我的</span></a></div></div>';

                        N_body.append('<div class="kd-seet"></div>');
                        ytHeader.append(temp);

                        kdAlert = N_body.find('.kd-alert');
                        kdSeet = N_body.find('.kd-seet');
                    }

                    if (!self.headPass) {
                        kdSeet.css('display', 'block');
                        kdAlert.css('display', 'block');
                        self.headPass = true;
                    } else {
                        kdAlert.css('display', 'none');
                        kdSeet.css('display', 'none');
                        self.headPass = false;
                    }

                    //关闭头部下拉
                    kdSeet.bind('click', function (e) {
                        kdAlert.css('display', 'none');
                        kdSeet.css('display', 'none');
                        self.headPass = false;
                    });
                });

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
            }
        };

        new BindHeadEvent();
    });

};