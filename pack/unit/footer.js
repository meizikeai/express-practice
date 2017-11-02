const style = require("../css/footer.css");

module.exports = function () {
    $(function () {
        var BindFootEvent = function () {
            this.init();
        };

        BindFootEvent.prototype = {
            init: function () {
                this.bindEvent();
            },
            bindEvent: function () {
            }
        };

        new BindFootEvent();
    });
}();