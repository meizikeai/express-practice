import "../unit/alert";
import "../css/download.css";

$(() => {
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
        init() {
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
                model: $(".model-download")
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

            that.model.find(".close").on("click", (e) => {
                that.model.css("display", "none");
            });

            that.model.find(".open").on("click", (e) => {
                let iframe = document.createElement('iframe');

                iframe.src = "mobile://Page?id=Home"; //具体参考调用协议
                iframe.style.display = 'none';
                document.body.appendChild(iframe);

                setTimeout(() => {
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
        tipBox(body, type, fn) {
            $("body").alert({
                body: body,
                type: type,
                callback: fn
            });
        }
    };

    new Download();
});