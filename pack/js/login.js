import "../unit/alert";
import Header from "../unit/header";
import Common from "../unit/common";
import "../css/login.css";

$(() => {
    let Login = function () {
        this.init();
    };

    Login.prototype = {
        /**
         * 初始化
         * @method init
         * @param 无
         * @return 无
         */
        init() {
            Header();
            this.bindEvent();
        },
        /**
         * 搜集节点
         * @method collectNode
         * @param 无
         * @return 无
         */
        collectNode() {
            return {
                username: $("#username"),
                password: $("#password"),
                enter: $(".enter")
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

            that.enter.on("click", (e) => {
                const username = $.trim(that.username.val());
                const password = $.trim(that.password.val());

                if (!username) {
                    self.tipBox("请输入您的帐号~", "confirm");
                    return false;
                } else if (username.lenght < 4) {
                    self.tipBox("帐号不能少于6位字符");
                    return false;
                } else if (!password) {
                    self.tipBox("请输入您的密码~");
                    return false;
                } else if (password.lenght < 6) {
                    self.tipBox("密码长度不能少于6位字符~");
                    return false;
                }

                $.ajax({
                    type: "post",
                    url: "/checklogin",
                    data: {
                        username: username,
                        password: password
                    },
                    dataType: 'json',
                    success(data) {
                        if (data.success) {
                            location.href = Common.getUrlParam("returnURL") || data.url;
                        } else {
                            self.tipBox(data.description);
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
            $("body").alert({
                body: body,
                type: type,
                callback: fn
            });
        }
    };

    new Login();
});