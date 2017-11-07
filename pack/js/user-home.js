import "../unit/reset";
import "../unit/download";
import "../unit/alert";
import Header from "../unit/header";
import Footer from "../unit/footer";
import Common from "../unit/common";
import "../css/user-home.css";

$(() => {
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
        init() {
            Header();
            this.bindEvent();
            Footer();
        },
        /**
         * 搜集节点
         * @method collectNode
         * @param 无
         * @return 无
         */
        collectNode() {
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
        bindEvent() {
            let self = this;
            let that = self.collectNode();

            if (Common.checkLogin()) {
                that.other.find(".nick").removeClass("none");
                that.other.find(".nick span").html(Common.getCookieValue("practice", "name"));
                that.other.find(".login").html("退出");
            }

            // 退出登录
            that.other.find(".login").on("click", () => {
                $.ajax({
                    type: "post",
                    url: "/checklogout",
                    data: {},
                    dataType: 'json',
                    success(data) {
                        if (data.success) {
                            location.href = "/";
                        }
                    },
                    error() {
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
        tipBox(body, type, fn) {
            $('body').alert({
                body: body,
                type: type,
                callback: fn
            });
        }
    };

    new UserCenter();
});