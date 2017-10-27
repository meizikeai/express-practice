module.exports = function() {

    /**
     * m.yintai.com
     * 公开方法 - 见return mobileMethod
     */

    var mobileMethod = {};


    /**
     * 检测浏览器兼容
     * @method isWorking
     * @param 无
     */
    mobileMethod.isWorking = function () {
        //判断如果是苹果浏览器并且使用无痕浏览即弹出提示
        try {
            localStorage.yt_iosError = '0';
            sessionStorage.yt_iosError = '0';
        } catch (err) {
            alert("银泰网触屏版暂不支持无痕浏览。您可以通过使用正常浏览模式或者下载银泰网客户端获得更好的购物体验。感谢您的支持与理解。");
            location.href = 'http://itunes.apple.com/cn/app/id452703031?mt=8';
        }
    };


    /**
     * 根据returnUrl跳转
     * @method goback
     * @param 无
     * @return null
     */
    mobileMethod.goback = function () {
        var self = this,
            returnUrl = self.getUrlParam("returnUrl");

        if (returnUrl) {
            location.href = returnUrl;
        } else {
            window.history.go(-1);
        }
    };

    /**
     * 转到顶部
     * @method goTop
     * @param null
     * @return null
     */
    mobileMethod.goTop = function () {

        var scrollMove = function (scrollTo, time) {
            var scrollFrom = parseInt(document.body.scrollTop),
                i = 0,
                runEvery = 5; // run every 5ms

            scrollTo = parseInt(scrollTo);
            time /= runEvery;

            var interval = setInterval(function () {
                i++;

                document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;

                if (i >= time) {
                    clearInterval(interval);
                }
            }, runEvery);
        };

        scrollMove(0, 200);
    };


    /**
     * 检查登录
     * @method checkLogin
     * @param null
     * @return {Boolean}
     */
    mobileMethod.checkLogin = function () {
        var self = this,
            pass = true,
            userName = self.getCookieValue('yt_m_userInfo', 'Name');

        if (!userName) {
            pass = false;
        }

        return pass;
    };

    /**
     * 替换掉 {内容} 的方法
     * @method langsub
     * @param s {String} / o {Object}
     * @return {String}
     */
    mobileMethod.langsub = function (s, o) {

        var isUndefined = function (u) {
            return typeof u === 'undefined';
        };

        return s.replace ? s.replace(/\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g, function (match, key) {
            return isUndefined(o[key]) ? match : o[key];
        }) : s;
    };


    /**
     * 获取当前url里name参数属性
     * @method getUrlParam
     * @param name {String} / bool {Boolean}
     * @retrun {String}
     */
    mobileMethod.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
            data = location.search.substr(1).match(reg),
            result = null;
        if (data) {
            result = decodeURIComponent(data[2]);
        }

        return result;
    };


    /**
     * 获取当前url里参数属性
     * @method getUrlAttr
     * @retrun {Object}
     */
    mobileMethod.getUrlAttr = function () {
        var args = null;
        var isearch = location.search;
        if (args === null) {
            if (isearch === "") {
                return "";
            }
            var qs = isearch.substring(1).split("&");
            args = {};
            for (i = 0; i < qs.length; i++) {
                var match = qs[i].match(/([^=]+)=([^=]+)/);
                if (match !== null) {
                    args[match[1]] = decodeURIComponent(match[2]);
                }
            }
        }
        return args;
    };


    /**
     * 把符合 a=1&b=2 这类字符串解释成json对象
     * @method handleStringToJSON
     * @param value {String}
     * @retrun {Object}
     */
    mobileMethod.handleStringToJSON = function (value) {
        var result = null,
            content = [],
            interim = decodeURIComponent(value);

        if (interim && interim.indexOf('&') > 0) {

            content = interim.split("&");
            result = {};

            for (i = 0; i < content.length; i++) {
                var match = content[i].match(/([^=]+)=([^=]+)/);
                if (match !== null) {
                    result[match[1]] = decodeURIComponent(match[2]);
                }
            }
        }

        return result;
    };


    /**
     * 获取 cookie 值
     * @method getCookieValue
     * @param  {String} key cookie 的名称 / value cookie 里的具体值
     * @return {String} cookie 对应的值
     */
    mobileMethod.getCookieValue = function (key, value) {
        var self = this,
            keyName = key + '=',
            cookie = decodeURIComponent(document.cookie),
            start, end, result = null;

        start = cookie.indexOf(keyName);

        if (start === -1) {
            return result;
        }

        end = cookie.indexOf(';', start);

        if (end === -1) {
            end = cookie.length;
        }

        result = cookie.substring(start + keyName.length, end);

        //根据传值个数判断获取具体的value的值
        if (arguments.length > 1 && value) {

            var that = [],
                answer;

            that = self.handleStringToJSON(result);
            answer = that[value];

            if (answer) {
                result = answer;
            } else {
                result = null;
            }
        }

        return result;
    };


    /**
     * 微信中的微信支付方式
     * @method weiXinPay
     * @param  data {String} 支付数据 / showMask 与 hideMask 函数
     * @return null
     */
    mobileMethod.weiXinPay = function (data, showMask, hideMask) {

        //调用微信中微信支付的接口
        var jsApiCall = function () {
            WeixinJSBridge.invoke('getBrandWCPayRequest', JSON.parse(decodeURIComponent(data)), function (res) {
                if (typeof hideMask == "function") {
                    hideMask();
                }
            });
        };

        //增加遮掩层
        if (typeof showMask == "function") {
            showMask();
        }

        //判断微信应用中的微信支付方法是否存在
        if (typeof WeixinJSBridge == "undefined") {

            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
            }

        } else {
            jsApiCall();
        }
    };


    /**
     * 为Ajax提供返回当前系统时间的方法
     * @method interval
     * @param  space {Number} 时间间隔
     * @return {String}
     */
    mobileMethod.interval = function (space) {
        var date = new Date(),
            fill = 0,
            time = '',
            p = function (n) {
                if (Number(n) <= 0) {
                    return '';
                }
                return n < 9 ? '0' + n : '' + n;
            },
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds();

        //保证传参为数字
        if (space) {
            fill = Number(space);
            if (fill >= 0) {
                minute = Math.floor(minute / fill);
                second = '';
            }
        }

        time = year + p(month) + p(day) + p(hour) + p(minute) + p(second);

        return time;
    };

    return mobileMethod;


};