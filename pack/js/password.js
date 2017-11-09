import "../unit/reset";
import "../unit/alert";
import Header from "../unit/header";
import "../css/password.css";

$(() => {

    Header();

    this.that = (() => {
        return {
            verify: $("#verify"),
            password: $("#password"),
            checkpassword: $("#checkpassword"),
            enter: $(".enter")
        }
    })();

    this.tipBox = (body, type, fn) => {
        $("body").alert({
            body: body,
            type: type,
            callback: fn
        });
    }

    // bind Event
    (() => {
        this.that.enter.on("click", (e) => {
            const self = this;
            const verify = $.trim(this.that.verify.val());
            const password = $.trim(this.that.password.val());
            const checkpassword = $.trim(this.that.checkpassword.val());

            if (!verify) {
                this.tipBox("请输入您收到的验证码~");
                return false;
            } else if (verify.lenght < 4) {
                this.tipBox("正确的验证码为4位数字，请确认后再输入~");
                return false;
            } else if (!password) {
                self.tipBox("请输入您的密码~");
                return false;
            } else if (password.lenght < 6) {
                self.tipBox("密码长度不能少于6位字符~");
                return false;
            } else if (password !== checkpassword) {
                self.tipBox("两个密码不一致，请确认后再提交~");
                return false;
            }

            $.ajax({
                type: "post",
                url: "/checkpassword",
                data: {
                    verify: verify,
                    password: password,
                    checkpassword: checkpassword
                },
                dataType: 'json',
                success(data) {
                    if (data.success) {
                        self.tipBox(data.description);
                    } else {
                        self.tipBox(data.description);
                    }
                },
                error() {
                    self.tipBox("服务器貌似出问题啦~")
                }
            })
        });
    })();

});