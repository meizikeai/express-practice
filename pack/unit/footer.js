const style = require("../css/footer.css");

module.exports = function () {
    $(function () {
        let BindFootEvent = function () {
            this.init();
        };

        BindFootEvent.prototype = {
            init: function () {
                this.bindEvent();
            },
            createNode: function () {
                return {
                    footer: $(".app-footer .mian a")
                }
            },
            bindEvent: function () {
                let self = this;
                let that = self.createNode();
                let pathname = location.pathname;

                $.each(that.footer, function (k, e) {
                    let every = $(e);
                    let href = every.attr("href");
                    if (pathname === href) {
                        every.addClass("cursor");
                    } else {
                        every.removeClass("cursor");
                    }
                });
            }
        };

        new BindFootEvent();
    });
}();