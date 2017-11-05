const alert = require("../unit/alert");
const style = require("../css/download.css");

$(function () {
    let Download = function () {
        this.init();
    };

    Download.prototype = {
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
                model: $(".model-download")
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

            that.model.find(".close").on("click", function (e) {
                that.model.css("display", "none");
            });

            that.model.find(".open").on("click", function (e) {
                let iframe = document.createElement('iframe');

                iframe.src = "mobile://Page?id=Home"; //具体参考调用协议
                iframe.style.display = 'none';
                document.body.appendChild(iframe);

                setTimeout(function () {
                    document.body.removeChild(iframe);
                    self.tipBox("协议不可能是“mobile://Page?id=Home”，请修改后再试一下~");
                }, 600);
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

    new Download();
});