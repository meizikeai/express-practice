module.exports = {

    /**
     * 根据returnUrl跳转
     * @method goback
     * @param 无
     * @return null
     */
    goback() {
        let returnUrl = this.getUrlParam("returnUrl");

        if (returnUrl) {
            location.href = returnUrl;
        } else {
            window.history.back();
        }
    },

    /**
     * 检查登录
     * @method checkLogin
     * @param null
     * @return {Boolean}
     */
    checkLogin() {
        let pass = true;
        let userName = this.getCookieValue("practice", "kid");

        if (!userName) {
            pass = false;
        }

        return pass;
    },

    /**
     * 替换掉 {内容} 的方法
     * @method langSub
     * @param s {String} / o {Object}
     * @return {String}
     */
    langSub(s, o) {
        let isUndefined = function (u) {
            return typeof u === 'undefined';
        };

        return s.replace ? s.replace(/\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g, function (match, key) {
            return isUndefined(o[key]) ? match : o[key];
        }) : s;
    },


    /**
     * 获取当前url里name参数属性
     * @method getUrlParam
     * @param name {String} / bool {Boolean}
     * @retrun {String}
     */
    getUrlParam(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let data = location.search.substr(1).match(reg);
        let result = null;

        if (data) {
            result = decodeURIComponent(data[2]);
        }

        return result;
    },


    /**
     * 获取当前url里参数属性
     * @method getUrlAttr
     * @retrun {Object}
     */
    getUrlAttr() {
        let result = null;
        let search = location.search;
        if (search !== "") {
            result = this.stringToJSON(search.substring(1));
        }

        return result;
    },


    /**
     * 把符合 a=1&b=2 这类字符串解释成json对象
     * @method stringToJSON
     * @param value {String}
     * @retrun {Object}
     */
    stringToJSON(value) {
        let result = null;
        let content = [];
        let interim = decodeURIComponent(value);

        if (interim && interim.indexOf('&') > 0) {
            content = interim.split("&");
            result = {};

            for (let i = 0; i < content.length; i++) {
                let match = content[i].match(/([^=]+)=([^=]+)/);
                if (match !== null) {
                    result[match[1]] = decodeURIComponent(match[2]);
                }
            }
        }

        return result;
    },


    /**
     * 获取 cookie 值
     * @method getCookieValue
     * @param  {String} key cookie 的名称 / value cookie 里的具体值
     * @return {String} cookie 对应的值
     */
    getCookieValue(key, value) {
        let keyName = key + '=';
        let cookie = decodeURIComponent(document.cookie);
        let start, end, result = null;

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

            let that = JSON.parse(result);
            let answer = that[value];

            if (answer) {
                result = answer;
            } else {
                result = null;
            }
        }

        return result;
    }
};