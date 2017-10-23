/**
 * 功能：
 *     1、对H5页面的调用网关的接口通过Ajax获取Token码并写入具体网关接口的请求头
 *     2、对内嵌APP的页面调用网关的接口通过APP提供的 getAppToken 方法获取Token码并写入具体网关接口的请求头
 * 
 * AJAX写入headers：{"Authorization":"Bearer e2564aeb0c0574ab5e8ddad9687b6de3dbe5d5e2"}
 * 
 * 作用：网关进行筛选、过滤不是正常用户发出的请求
 * 
 * 实现、接口文档：http://gitlab.yintai.org/architect/gateway/tree/master
 * 因APP提供的方法是异步，所以内嵌实现，在具体页面里判断是否调用app的提供的方法
 * 
 * 移动获取：{"token_type":"bearer","access_token":"63d0be986b19e4a6aa74ae3f1f6e081cee6dd6d4","expires_in":7200}
 * 应用获取：{"token_type":"bearer","access_token":"fe02c5161211ff3fa4ce2b8d78cc071426216523","expires_in":7200,"gettoken_time":1463538048190}
 * 
 */

// var Zepto = require("./zepto");

module.exports = function () {

    var mobileAuthorize = {};

    /**
     * 根据当前地址判断环境
     * @method isFormal
     * @param 无
     * @return pass {Boolean} 布尔值
     */
    mobileAuthorize.isFormal = function () {
        var host = location.host,
            pass = true;

        host = host.split('.')[2];

        if (host != "com") {
            pass = false;
        }

        return pass;
    };
    /**
     * 获取到当前域名的后缀，并根据此返回帐号信息
     * @method getTokenCredential
     * @param 无
     * @return credential {JSON} 用户信息
     */
    mobileAuthorize.getTokenCredential = function () {
        var self = this,
            credential = {
                client_id: "560b5da9-a046-4f4c-ba1d-2be2cae250ba",
                client_secret: "yhLVp7Nbfp3D"
            };

        if (!self.isFormal()) {
            credential = {
                client_id: "test",
                client_secret: "test"
            };
        }

        return credential;
    };
    /**
     * 获取到当前域名的后缀，并根据此后续返回网关域名
     * @method getHostUre
     * @param 无
     * @return pass {Boolean} 布尔值
     */
    mobileAuthorize.getTokenURL = function () {
        var self = this,
            suffix = "gw";

        if (!self.isFormal()) {
            suffix = "gw-test";
        }

        // 正式 - https://gw.yintai.com | 测试、预发布 - https://gw-test.yintai.com
        return 'https://' + suffix + '.yintai.com/oauth/token';
    };
    /**
     * 获取到token，并执行相应回调方法
     * @method getAuthorize
     * @param INFO {JSON} $.ajax()的参数
     */
    mobileAuthorize.getAuthorize = function (INFO) {

        var self = this;

        var credential = self.getTokenCredential();

        $.ajax({
            type: 'post',
            url: self.getTokenURL(),
            data: {
                grant_type: "client_credentials",
                client_id: credential.client_id,
                client_secret: credential.client_secret
            },
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded",
            success: function (data) {

                var temporary = "";

                if (data.token_type && data.access_token) {
                    temporary = data.token_type.charAt(0).toUpperCase() + data.token_type.substring(1, data.token_type.length);

                    INFO.headers = { Authorization: temporary + " " + data.access_token };

                    self.handleGateWayData(INFO);

                } else if (data.code && data.error_description) {
                    // appMethod.alert(data.error_description);
                }

            },
            error: function (xhr, status, error) {
                if (error) {
                    // appMethod.alert(error);
                }
            }
        });

    };
    /**
     * 根据环境处理请求地址
     * @method handleGateWayData
     * @param data {JSON} $.ajax()的参数
     */
    mobileAuthorize.handleGateWayData = function (data) {
        var self = this, info = data;

        if (!self.isFormal() && info.url) {
            info.url = info.url.replace(/-prod.yintai.com/gi, '-test.yintai.com');
        }

        $.ajax(info);

    };

    return mobileAuthorize;
};