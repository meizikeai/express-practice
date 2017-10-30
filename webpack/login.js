var Common = require("./unit/common")();
var Header = require("./unit/header")();
var Alert = require("./unit/alert")();

$(function () {
    let Nodes = [];
    let N_username = "#username";
    let N_password = "#password";
    let N_error = ".error";
    let N_enter = ".enter";

    var Login = function () {
        this.init();
    };

    Login.prototype = {
        /**
         * 初始化
         * @method init
         * @param 无
         * @return 无
         */
        init: function () {
            var self = this;

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
            Nodes[N_username] = $(N_username);
            Nodes[N_password] = $(N_password);
            Nodes[N_error] = $(N_error);
            Nodes[N_enter] = $(N_enter);
        },
        /**
         * 绑定事件
         * @method bindEvent
         * @param 无
         * @return 无
         */
        bindEvent: function () {
            var self = this;

            Nodes[N_enter].on("click", function (e) {
                const username = $.trim(Nodes[N_username].val());
                const password = $.trim(Nodes[N_password].val());

                if (!username) {
                    self.tipBox("请输入您的帐号~");
                    return false;
                } else if (!password) {
                    self.tipBox("请输入您的密码~");
                    return false;
                }

                $.ajax({
                    type: "post",
                    url: "/checkonline",
                    data: {
                        username: username,
                        password: password
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data.success) {
                            location.href = data.url;
                        } else {
                            self.tipBox("请确认帐号与密码后重新再尝试！");
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
            $("body").alert({
                body: body,
                type: type,
                callback: fn
            });
        }
    };

    new Login();
});