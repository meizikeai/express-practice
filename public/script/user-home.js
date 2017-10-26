/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	// var Zepto = require("./unit/zepto");
	var Common = __webpack_require__(2)();
	var Header = __webpack_require__(1)();
	var AuthorizeAjax = __webpack_require__(5)();
	var Alert = __webpack_require__(6)();

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

	                    if (result.success) {

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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * m.yintai.com
	 * 所有页面 - 页头、页尾的事件绑定
	 * 首页页头 - 搜索事件绑定
	 * 回到顶部 - 事件绑定
	 */

	// var Zepto = require("./zepto");
	var Common = __webpack_require__(2)();

	module.exports = function () {

	    $(function () {
	        
	        var BindHeadEvent = function () {
	            this.init();
	        };

	        BindHeadEvent.prototype = {
	            init: function () {
	                this.bindEvent();
	            },
	            bindEvent: function () {
	                var self = this;

	                //检测是否是无痕浏览
	                Common.isWorking();

	                //页面头部下拉
	                var N_body = $('body');
	                $(".xiala").click(function () {
	                    var that = $(this),
	                        kdAlert = N_body.find('.kd-alert'),
	                        kdSeet = N_body.find('.kd-seet'),
	                        ytHeader = $('.header');

	                    if (kdAlert.length < 1) {
	                        var temp = '<div class="kd-alert">' +
	                            '<div class="alert-content">' +
	                            '<a href="/"><i class="shouye"></i><span>银泰首页</span></a>' +
	                            '<a href="/Category"><i class="fenleiye"></i><span>分 类</span></a>' +
	                            '<a href="/Cart"><i class="gouwudai"></i><span>购物车</span></a>' +
	                            '<a href="/UserCenter" class="no-border"><i class="wode"></i><span>我的银泰</span></a></div></div>';

	                        N_body.append('<div class="kd-seet"></div>');
	                        ytHeader.append(temp);

	                        kdAlert = N_body.find('.kd-alert');
	                        kdSeet = N_body.find('.kd-seet');
	                    }

	                    if (!self.headPass) {
	                        that.addClass('xiala-hover');
	                        kdSeet.css('display', 'block');
	                        kdAlert.fadeIn();
	                        self.headPass = true;
	                    } else {
	                        that.removeClass('xiala-hover');
	                        kdAlert.fadeOut();
	                        kdSeet.css('display', 'none');
	                        self.headPass = false;
	                    }

	                    //关闭头部下拉
	                    kdSeet.bind('click', function (e) {
	                        that.removeClass('xiala-hover');
	                        kdAlert.fadeOut();
	                        kdSeet.css('display', 'none');
	                        self.headPass = false;
	                    });
	                });

	                //页脚本购物车链接地址
	                var gouwudai = $('.gouwudai').parent();
	                if (gouwudai.length > 0) {
	                    gouwudai.attr('href', '/Cart');
	                }

	                //没有登录的时候进行跳转
	                if (Common.checkLogin()) {
	                    var outlogin = $(".outlogin"),
	                        nickname = Common.getCookieValue('yt_m_userInfo', 'Name');

	                    if (nickname.length > 8) {
	                        nickname = nickname.substring(0, 8) + "...";
	                    }
	                    $(".login-l").html('<span class="l-username"><a href="/UserCenter">' + nickname + '</a></span>|' + '<span class="outlogin">退出</span>');

	                    if (outlogin.length > 0) {
	                        outlogin.click(function () {
	                            location.href = "/UserCenter/LogOn";
	                        });
	                    }
	                }

	                //后退到上一个页面
	                $(".back-button").click(function () {
	                    Common.goback();
	                });

	                //搜索框
	                var txtKeyword = $("#txtKeyword"),
	                    btnSearch = $("#btnSearch");
	                txtKeyword.click(function () {
	                    txtKeyword.val("");
	                });
	                txtKeyword.keydown(function (e) {
	                    var keyCode = e.keyCode,
	                        text = txtKeyword.val().trim();
	                    if (keyCode == 13) {
	                        if (text && text != '搜索商品or品牌') {
	                            self.search(text);
	                        }
	                    }
	                });
	                btnSearch.click(function () {
	                    var text = txtKeyword.val().trim();
	                    if (text && text != '搜索商品or品牌') {
	                        self.search(text);
	                    }
	                });
	                txtKeyword.focus(function () {
	                    txtKeyword.css("color", "#333");
	                });
	                txtKeyword.blur(function () {
	                    if (txtKeyword.val() === "") {
	                        txtKeyword.val("搜索商品or品牌");
	                        txtKeyword.css("color", "#cacaca");
	                    }
	                });

	            },
	            /**
	             * 搜索
	             * @method search
	             * @param keyword {String} 搜索内容
	             * @return null
	             */
	            search: function (keyword) {
	                var self = this,
	                    repex = /.{2}-.{3}-.{4}$/g,
	                    links = '';

	                if (keyword.length == 11 && repex.test(keyword)) {
	                    links = "/Sales/ProductDetail?itemCode=";
	                } else {
	                    links = "/Sales/ProductList?keyword=";
	                }

	                location.href = links + keyword;
	            }
	        };

	        new BindHeadEvent();
	    });

	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	
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

/***/ },
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

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

/***/ },
/* 6 */
/***/ function(module, exports) {

	// var Zepto = require("./zepto");

	module.exports = function () {
		if ($.fn.alert) {
			console.log('$ 元素已包含 alert 方法，新方法注册失败');
			return;
		}

		/**
		 * 代替浏览器 alert 方法
		 *
		 * @param  {Object} opt    自定义配置对象
		 * @param  {Object} optCss 为默认样式添加的自定义样式
		 *
		 * @return {$ Object}      $ 对象
		 */
		$.fn.alert = function (opt, optCss) {
			var alertAttribute = 'data-alert';
			var _this = this;

			if (this.attr(alertAttribute)) return;

			var _defaultCss = {
				alert: {
					'position': 'fixed',
					'left': 0,
					'right': 0,
					'bottom': 0,
					'top': 0,
					'display': '-webkit-flex',
					'display': 'flex',
					'justify-content': 'center',
					'align-items': 'center',
					'display': '-webkit-box',
					'-webkit-box-orient': 'horizontal',
					'-webkit-box-align': 'center',
					'-webkit-box-pack': 'center',
					'background-color': 'rgba(0, 0, 0, .5)',
					'z-index': '9999'
				},
				content: {
					'width': '80%',
					'max-width': '360px',
					'border-radius': '6px',
					'background-color': '#fff'
				},
				header: {
					'padding': '15px',
					'padding-bottom': 0,
					'font-size': '20px',
					'color': '#333'
				},
				body: {
					'padding': '30px 15px',
					'font-size': '15px',
					'color': '#666',
					'word-wrap': 'break-word',
					'word-break': 'break-all'
				},
				footer: {
					'overflow': 'hidden',
					'border-top': '1px solid #e6e6e6',
					'font-size': '17px',
					'text-align': 'center',
					'line-height': '38px'
				}
			};

			var _default = {
				backdrop: false,
				callback: null,
				cancelCallback: null,
				type: null,
				confirmBtnText: '确定',
				cancelBtnText: '取消',
				header: '温馨提示',
				body: ' ',
				autoRemoveAlert: true,
				cancelAutoRemoveAlert: true
			};
			var _baseBtnCss = {
				'float': 'left',
				'box-sizing': 'border-box',
				'background-color': 'transparent',
				'padding': '0 15px'
			};
			var _confirmBtnCss = {
				'color': '#ff3b7f',
				'border-bottom-left-radius': '6px'
			};
			var _cancenBtnCss = {
				'color': '#666',
				'border-bottom-right-radius': '6px',
				'border-left': '1px solid #e6e6e6'
			};

			// 如果第一个参数为 `function` 则将函数设置到确认的回调方法上
			if (typeof opt === 'function') {
				_default.callback = opt;
				opt = undefined;
				optCss = undefined;
			}

			$.extend(_default, opt);

			if (optCss) {
				$.extend(_defaultCss.alert, optCss.alert);
				$.extend(_defaultCss.content, optCss.content);
				$.extend(_defaultCss.header, optCss.header);
				$.extend(_defaultCss.body, optCss.body);
				$.extend(_defaultCss.footer, optCss.footer);
			}

			// 创建 alert 各部分
			var $alert = $(document.createElement('div'));
			var $content = $(document.createElement('div'));
			var $header = $(document.createElement('div'));
			var $body = $(document.createElement('div'));
			var $footer = $(document.createElement('div'));
			var $confirmBtn = $(document.createElement('div'));
			var _removeAlert = function () {
				$alert.remove();
				_this.removeAttr(alertAttribute);
			};

			// 提供的内容为字符串就用 text()
			// 提供的内容为元素就用 append()
			typeof _default.header === 'string' ? $header.css('text-align', 'center').text(_default.header) : $header.append(_default.header);
			typeof _default.body === 'string' ? $body.css('text-align', 'center').text(_default.body) : $body.append(_default.body);

			// 设置确定按钮的样式和文本
			$confirmBtn.css(_baseBtnCss).css(_confirmBtnCss).text(_default.confirmBtnText);

			// 如果弹出类型为 `confirm`，添加确定跟删除两个按钮
			// 否则只添加确定按钮
			if (_default.type === 'confirm') {
				var $cancelBtn = $(document.createElement('div'));
				$confirmBtn.css('width', '50%');
				$cancelBtn.css(_baseBtnCss).css(_cancenBtnCss).css('width', '50%').text(_default.cancelBtnText);
				$footer.append($confirmBtn).append($cancelBtn);

				// 点击取消按钮事件
				$cancelBtn.on('click', function () {
					if (_default.cancelAutoRemoveAlert) {
						_removeAlert();
					}
					_default.cancelCallback && _default.cancelCallback();
				});
			} else {
				$confirmBtn.css({ 'width': '100%', 'border-bottom-left-radius': '6px' });
				$footer.append($confirmBtn);
			}

			// 点击确定按钮事件
			$confirmBtn.on('click', function () {
				if (_default.autoRemoveAlert) {
					_removeAlert();
				}
				_default.callback && _default.callback();
			});

			// 点击背景关闭弹框
			if (_default.backdrop) {
				$alert.on('click', function (e) {
					if (e.target === $alert[0]) {
						_removeAlert();
					}
				});
			}

			// 组合元素，并最终将弹框添加到调用方法的元素上
			$content.css(_defaultCss.content).append($header.css(_defaultCss.header));
			$content.append($body.css(_defaultCss.body));
			$content.append($footer.css(_defaultCss.footer));
			$alert.css(_defaultCss.alert).append($content);
			$alert.appendTo(this);
			this.attr(alertAttribute, 'true');

			return this;
		};
	};

/***/ }
/******/ ]);