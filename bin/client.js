var http = require("http");
var Client = require("../lib/client");

/** 
 * urlParam 拼接
 * param 将要转为URL参数字符串的对象 
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true 
 *  
 * return URL参数字符串 
 */
var urlParam = function (param, key, encode) {
    var result = "";
    var part = "";

    if (param == null) {

    } else {
        var t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            result += part + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                if (result) {
                    part = '&';
                }
                result += part + urlParam(param[i], k, encode);
            }
        }
    }

    return result;
};

function runServiceData(params) {
    this.init();
}

runServiceData.prototype = {
    init: function () {
        this.homePage();
        this.userCenterPage();
    },
    //首页
    homePage: function () {
        var getData = http.request({
            hostname: "m.yintai.com",
            port: "80",
            path: "/Services/Proxy.ashx?" + urlParam({
                r: "201606181201",
                os: "HTML5",
                pageid: "104001",
                previewtime: "0",
                method: "products.template.getpage",
                apptype: "10",
                ver: "1.0.0",
                pageindex: "1"
            }),
            method: "GET"
        }, function (record) {
            var result = "";

            record.setEncoding("utf8");
            record.on("data", function (data) {
                result += data;
            });

            record.on("end", function () {
                Client.clientUpdate('home', JSON.parse(result));
            });
        }).on("error", function (e) {
            console.log("problem with request: " + e.message);
        });

        getData.end();
    },
    //用户中心-首页
    userCenterPage: function () {
        var getData = http.request({
            hostname: "m.yintai.com",
            port: "80",
            path: "/Services/Proxy.ashx?" + urlParam({
                userId: "sHhKtDDMXLlzbLQIWxy6L9o/SWPNGPh2bxIGJjgezrkyCyWRVUPzW9FeBOjdjZzWreF43L6jQifz+9m5I9+hGw==",
                method: "customer.get",
                ver: "1.0"
            }),
            method: "GET"
        }, function (record) {
            var result = "";

            record.setEncoding("utf8");
            record.on("data", function (data) {
                result += data;
            });

            record.on("end", function () {
                Client.clientUpdate('usercenter', JSON.parse(result));
            });
        }).on("error", function (e) {
            console.log("problem with request: " + e.message);
        });

        getData.end();
    }
};

new runServiceData();