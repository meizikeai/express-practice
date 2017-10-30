var Common = require("./unit/common")();
var Header = require("./unit/header")();
var Alert = require("./unit/alert")();

$(function () {
    var Nodes = [];
    var N_user_logout = ".user-logout";
    var N_yintai_hone = ".yintai-phone";
    var E_click = "click";

    var UserCenter = function () {
        this.init();
    };

    UserCenter.prototype = {
        /**
         * 初始化
         * @method init
         * @param 无
         * @return 无
         */
        init: function () {
            var self = this;

            self.iscellphoneconfirmed = false;
            // self.userid = Common.getCookieValue('userid');

            self.collectNodes();
            self.bindEvent();
        },
        /**
         * 搜集节点
         * @method collectNodes
         * @param 无
         * @return 无
         */
        collectNodes: function () {
            Nodes[N_user_logout] = $(N_user_logout);
            Nodes[N_yintai_hone] = $(N_yintai_hone);
        },
        /**
         * 绑定事件
         * @method bindEvent
         * @param 无
         * @return 无
         */
        bindEvent: function () {
            var self = this;

            //退出登录
            Nodes[N_user_logout].click(function () {
                location.href = "/logout";
            });

            //设置支付密码判断
            Nodes[N_yintai_hone].click(function (e) {
                var $eT = $(this);
                e.preventDefault();
                if (!self.iscellphoneconfirmed) {
                    self.tipBox('请绑定手机后设置支付密码');
                    setTimeout(function () {
                        location.href = '/user/phone';
                    }, 1000);
                } else {
                    location.href = $eT.attr('href');
                }
            });
        },
        /**
         * 错误提示
         * @method tipBox
         * @param body {String} / fn {Function} / type {String}
         * @return 无
         */
        tipBox: function (body, type, fn) {
            $('body').alert({
                body: body,
                type: type,
                callback: fn
            });
        }
    };

    new UserCenter();
});