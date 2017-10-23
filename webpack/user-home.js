
// var Zepto = require("./unit/zepto");
var Common = require("./unit/common")();
var Header = require("./unit/header")();
var AuthorizeAjax = require("./unit/authorize-ajax")();
var Alert = require("./unit/alert")();

$(function () {

    var Nodes = [],
        N_loginout = ".user-logout",
        N_username = ".user-name",
        N_userlevel = ".user-level",
        N_jifen = ".jifen strong",
        N_yinyuan = ".yinyuan strong",
        N_yue = ".yue strong",
        N_card = ".ytcard strong",
        N_waitpay = ".wait-pay span",
        N_waitshouhuo = ".wait-shouhuo span",
        N_youhuiquan = ".yingyongnum",
        N_inforcenternum = ".infor-centernum",
        N_yintaiPhone = ".yintai-phone",
        N_yintaiPaypw = '.yintai-paypw',

        E_click = "click";

    var UserCenter = function () {
        var self = this;

        self.init();
    };

    UserCenter.prototype = {
        /**
         * 初始化
         * @method init
         * @param 无
         * @return 无
         */
        init: function () {
            var self = this;

            // if (!Common.checkLogin()) {
            //     location.href = "/UserCenter/Login?returnUrl=" + escape(location.href);
            //     return false;
            // }

            self.iscellphoneconfirmed = false;
            self.userid = Common.getCookieValue('yt_m_userId');

            self.collectNodes();
            self.bindEvent();
            // self.loadData(); //加载数据
            // self.queryUserAccount();
        },
        /**
         * 搜集节点
         * @method collectNodes
         * @param 无
         * @return 无
         */
        collectNodes: function () {
            Nodes[N_loginout] = $(N_loginout);
            Nodes[N_username] = $(N_username);
            Nodes[N_userlevel] = $(N_userlevel);
            Nodes[N_jifen] = $(N_jifen);
            Nodes[N_yinyuan] = $(N_yinyuan);
            Nodes[N_yue] = $(N_yue);
            Nodes[N_card] = $(N_card);
            Nodes[N_waitpay] = $(N_waitpay);
            Nodes[N_waitshouhuo] = $(N_waitshouhuo);
            Nodes[N_youhuiquan] = $(N_youhuiquan);
            Nodes[N_inforcenternum] = $(N_inforcenternum);
            Nodes[N_yintaiPhone] = $(N_yintaiPhone);
            Nodes[N_yintaiPaypw] = $(N_yintaiPaypw);
        },
        /**
         * 绑定事件
         * @method bindEvent
         * @param 无
         * @return 无
         */
        bindEvent: function () {
            var self = this;

            //退出登录
            Nodes[N_loginout].click(function () {
                self.clearUserInfo();
                location.href = "/UserCenter/LogOn";
            });

            //设置支付密码判断
            if (Nodes[N_yintaiPaypw]) {
                Nodes[N_yintaiPaypw].click(function (e) {
                    var $eT = $(this);
                    e.preventDefault();
                    if (!self.iscellphoneconfirmed) {
                        self.tipBox('请绑定手机后设置支付密码');
                        setTimeout(function () {
                            location.href = '/UserCenter/BindPhone';
                        }, 1000);
                    } else {
                        location.href = $eT.attr('href');
                    }
                });
            }
        },
        /**
         * 加载数据
         * @method loadData
         * @param 无
         * @return 无
         */
        loadData: function () {
            var self = this;

            $.ajax({
                type: "get",
                url: "/Services/Proxy.ashx",
                // url: "http://" + location.host + "/YinTaiSites/m.yintai.com/ajax/userindex.aspx?r=" + Common.interval(),
                dataType: "json",
                data: {
                    userId: self.userid,
                    methodName: "customer.get_1.0",
                    method: "customer.get",
                    ver: "1.0",
                    r: Common.interval()
                },
                success: function (result) {

                    if (result.isSuccessful) {

                        var data = result.data,
                            indexinfo = data.indexinfo,
                            user = data.user;

                        //获取绑定手机&&设置支付密码状态
                        self.iscellphoneconfirmed = user.iscellphoneconfirmed;

                        if (user.name) {
                            Nodes[N_username].html(user.name);
                        }
                        if (user.class) {
                            Nodes[N_userlevel].html(user.class);
                        }

                        //代付款和待收货数量
                        var waitpay_num = indexinfo.needpaycount,
                            wait_shouhuo = indexinfo.waybillcount;

                        if (waitpay_num > 0) {
                            Nodes[N_waitpay].append("<em>" + waitpay_num + "</em>");
                        }

                        if (wait_shouhuo > 0) {
                            Nodes[N_waitshouhuo].append("<em>" + wait_shouhuo + "</em>");
                        }

                        //优惠券和消息的数量
                        var youhuiquan_num = indexinfo.promotioncount,
                            information_num = indexinfo.msgcount;

                        if (youhuiquan_num > 0) {
                            Nodes[N_youhuiquan].find('.pink').html(youhuiquan_num);
                        }
                        if (information_num > 0) {
                            Nodes[N_inforcenternum].find('.pink').html(information_num);
                        }

                        //用户手机号
                        if (user.cellphoneconfusion) {
                            localStorage.phoneno = user.cellphoneconfusion;
                            Nodes[N_yintaiPhone].attr('href', '/UserCenter/BindPhoneStep1');
                            Nodes[N_yintaiPhone].find('.infor-phone span').html("(" + user.cellphoneconfusion + ")");
                        }

                        //设计支付密码-跳转地址
                        if (Nodes[N_yintaiPaypw].length > 0 && self.iscellphoneconfirmed) {
                            if (user.setpassword) {
                                Nodes[N_yintaiPaypw].attr('href', '/UserCenter/EditPayPassword');
                                Nodes[N_yintaiPaypw].html('修改支付密码<div class="infor-phone"><span class="pink"></span></div><em></em>');
                            } else {
                                Nodes[N_yintaiPaypw].attr('href', '/UserCenter/SetPayPassword');
                            }
                        }

                    } else {

                        self.tipBox(result.description, null, function () {
                            location.href = "/UserCenter/Login";
                        });

                    }
                },
                error: function (xhr, status, error) {
                    self.tipBox(error);
                }
            });

        },
        /**
         * 获取银元、余额、银泰卡、积分
         * @method queryUserAccount
         * @param null
         * @return null
         */
        queryUserAccount: function () {
            var self = this;

            AuthorizeAjax.getAuthorize({
                type: "post",
                url: "https://customer-facade-prod.yintai.com/facade/json/com.yintai.user.account/UserAccount/queryUserAccount",
                dataType: "json",
                contentType: "application/x-www-form-urlencoded",
                data: {
                    params: JSON.stringify([self.userid]),
                    r: Common.interval() //随机数
                },
                success: function (result) {

                    if (!result.val && result.err) {
                        self.tipBox(result.err.msg);
                    } else {
                        Nodes[N_jifen].html(result.val.points);
                        Nodes[N_yinyuan].html(result.val.yinyuanAmount.toFixed(2));
                        Nodes[N_yue].html(result.val.amount.toFixed(2));
                        Nodes[N_card].html(result.val.yintaiCardAmount.toFixed(2));
                    }

                },
                error: function (xhr, status, error) {
                    if (error) {
                        self.tipBox(error);
                    }
                }

            });
        },
        /**
         * 清空用户信息
         * @method clearUserInfo
         * @param 无
         * @return 无
         */
        clearUserInfo: function () {
            localStorage.clear();
        },
        /**
         * 错误提示
         * @method tipBox
         * @param body {String} / fn {Function} / type {String}
         * @return 无
         */
        tipBox: function (body, type, fn) {
            $('body').alert({
                body: body,
                type: type,
                callback: fn
            });
        }
    };

    new UserCenter();
});