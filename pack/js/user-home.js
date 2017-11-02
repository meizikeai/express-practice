const reset = require("../unit/reset");
const header = require("../unit/header");
const footer = require("../unit/footer");
const alert = require("../unit/alert");
const style = require("../css/user-home.css");

$(function () {
    let UserCenter = function () {
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
            this.bindEvent();
        },
        /**
         * 搜集节点
         * @method collectNodes
         * @param 无
         * @return 无
         */
        collectNodes: function () {
            return {
                logout: $(".user-logout"),
                password: $(".password")
            }
        },
        /**
         * 绑定事件
         * @method bindEvent
         * @param 无
         * @return 无
         */
        bindEvent: function () {
            let self = this;
            let that = self.collectNodes();

            //退出登录
            that.logout.on("click", function () {
                $.ajax({
                    type: "post",
                    url: "/checklogout",
                    data: {},
                    dataType: 'json',
                    success: function (data) {
                        if (data.success) {
                            location.href = "/";
                        }
                    },
                    error: function () {
                        self.tipBox("服务器貌似出问题啦~")
                    }
                })
            });

            //设置支付密码判断
            that.password.on("click", function (e) {
                // var $eT = $(this);
                // e.preventDefault();
                // if (!self.iscellphoneconfirmed) {
                //     self.tipBox('请绑定手机后设置支付密码');
                //     setTimeout(function () {
                //         location.href = '/user/phone';
                //     }, 1000);
                // } else {
                //     location.href = $eT.attr('href');
                // }
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