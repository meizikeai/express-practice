import "../unit/reset";
import "../unit/alert";
import Header from "../unit/header";
import "../css/forget.css";

$(() => {

    Header();

    this.that = (() => {
        return {
            username: $("#username"),
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
            const username = $.trim(this.that.username.val());

            if (!username) {
                this.tipBox("请输入您的帐号~");
            } else if (username.lenght < 4) {
                this.tipBox("帐号不能少于6位字符", "confirm");
            }

            $.ajax({
                type: "post",
                url: "/checkforget",
                data: { username: username },
                dataType: 'json',
                success(data) {
                    if (data.success) {
                        self.tipBox(data.description, null, () => {
                            location.href = data.url;
                        });
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