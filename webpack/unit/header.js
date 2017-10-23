/**
 * m.yintai.com
 * 所有页面 - 页头、页尾的事件绑定
 * 首页页头 - 搜索事件绑定
 * 回到顶部 - 事件绑定
 */

// var Zepto = require("./zepto");
var Common = require("./common")();

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
                Common.isWorking();

                //页面头部下拉
                var N_body = $('body');
                $(".xiala").click(function () {
                    var that = $(this),
                        kdAlert = N_body.find('.kd-alert'),
                        kdSeet = N_body.find('.kd-seet'),
                        ytHeader = $('.header');

                    if (kdAlert.length < 1) {
                        var temp = '<div class="kd-alert">' +
                            '<div class="alert-content">' +
                            '<a href="/"><i class="shouye"></i><span>银泰首页</span></a>' +
                            '<a href="/Category"><i class="fenleiye"></i><span>分 类</span></a>' +
                            '<a href="/Cart"><i class="gouwudai"></i><span>购物车</span></a>' +
                            '<a href="/UserCenter" class="no-border"><i class="wode"></i><span>我的银泰</span></a></div></div>';

                        N_body.append('<div class="kd-seet"></div>');
                        ytHeader.append(temp);

                        kdAlert = N_body.find('.kd-alert');
                        kdSeet = N_body.find('.kd-seet');
                    }

                    if (!self.headPass) {
                        that.addClass('xiala-hover');
                        kdSeet.css('display', 'block');
                        kdAlert.fadeIn();
                        self.headPass = true;
                    } else {
                        that.removeClass('xiala-hover');
                        kdAlert.fadeOut();
                        kdSeet.css('display', 'none');
                        self.headPass = false;
                    }

                    //关闭头部下拉
                    kdSeet.bind('click', function (e) {
                        that.removeClass('xiala-hover');
                        kdAlert.fadeOut();
                        kdSeet.css('display', 'none');
                        self.headPass = false;
                    });
                });

                //页脚本购物车链接地址
                var gouwudai = $('.gouwudai').parent();
                if (gouwudai.length > 0) {
                    gouwudai.attr('href', '/Cart');
                }

                //没有登录的时候进行跳转
                if (Common.checkLogin()) {
                    var outlogin = $(".outlogin"),
                        nickname = Common.getCookieValue('yt_m_userInfo', 'Name');

                    if (nickname.length > 8) {
                        nickname = nickname.substring(0, 8) + "...";
                    }
                    $(".login-l").html('<span class="l-username"><a href="/UserCenter">' + nickname + '</a></span>|' + '<span class="outlogin">退出</span>');

                    if (outlogin.length > 0) {
                        outlogin.click(function () {
                            location.href = "/UserCenter/LogOn";
                        });
                    }
                }

                //后退到上一个页面
                $(".back-button").click(function () {
                    Common.goback();
                });

                //搜索框
                var txtKeyword = $("#txtKeyword"),
                    btnSearch = $("#btnSearch");
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
                btnSearch.click(function () {
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
                    links = "/Sales/ProductDetail?itemCode=";
                } else {
                    links = "/Sales/ProductList?keyword=";
                }

                location.href = links + keyword;
            }
        };

        new BindHeadEvent();
    });

};