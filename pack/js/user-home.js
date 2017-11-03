const reset = require("../unit/reset");
const header = require("../unit/header");
const common = require("../unit/common");
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
         * @method collectNode
         * @param 无
         * @return 无
         */
        collectNode: function () {
            return {
                other: $(".app-user .other")
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
            let that = self.collectNode();

            if (common.checkLogin()) {
                that.other.find(".nick").removeClass("none");
                that.other.find(".nick span").html(common.getCookieValue("practice", "name"));
                that.other.find(".login").html("退出");
            }

            // 退出登录
            that.other.find(".login").on("click", function () {
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