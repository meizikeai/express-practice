import "../css/header.css";

export default function () {
    $(() => {
        var BindHeadEvent = function () {
            this.init();
        };

        BindHeadEvent.prototype = {
            init() {
                this.bindEvent();
            },
            createNode() {
                return {
                    back: $(".model-header .back"),
                    pull: $(".model-header .pull"),
                    entry: $(".model-header .entry"),
                    appseet: $(".model-header .model-seet")
                }
            },
            bindEvent() {
                var self = this;
                var that = self.createNode();

                that.back.on("click", () => {
                    history.back();
                });

                that.pull.on("click", () => {
                    if (that.entry.hasClass("model-block")) {
                        that.entry.removeClass("model-block");
                        that.appseet.removeClass("model-block");
                    } else {
                        that.entry.addClass("model-block");
                        that.appseet.addClass("model-block");
                    }
                });

                that.appseet.on("click", () => {
                    that.entry.removeClass("model-block");
                    that.appseet.removeClass("model-block");
                });
            }
        };

        new BindHeadEvent();
    });
}