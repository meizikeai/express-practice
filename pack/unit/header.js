const style = require("../css/header.css");

module.exports = function () {
    $(function () {
        var BindHeadEvent = function () {
            this.init();
        };

        BindHeadEvent.prototype = {
            init: function () {
                this.bindEvent();
            },
            createNode: function () {
                return {
                    back: $(".app-header .back"),
                    pull: $(".app-header .pull"),
                    entry: $(".app-header .entry"),
                    appseet: $(".app-header .app-seet")
                }
            },
            bindEvent: function () {
                var self = this;
                var that = self.createNode();

                that.back.on("click", () => {
                    history.back();
                });

                that.pull.on("click", () => {
                    if (that.entry.hasClass("app-block")) {
                        that.entry.removeClass("app-block");
                        that.appseet.removeClass("app-block");
                    } else {
                        that.entry.addClass("app-block");
                        that.appseet.addClass("app-block");
                    }
                });

                that.appseet.on("click", () => {
                    that.entry.removeClass("app-block");
                    that.appseet.removeClass("app-block");
                });
            }
        };

        new BindHeadEvent();
    });
}();