/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

﻿module.exports = function() {

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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

﻿var Common = __webpack_require__(0)();

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
                $(".header .more").click(function () {
                    var that = $(this),
                        kdAlert = N_body.find('.kd-alert'),
                        kdSeet = N_body.find('.kd-seet'),
                        ytHeader = $('.header');

                    if (kdAlert.length < 1) {
                        var temp = '<div class="kd-alert">' +
                            '<div class="alert">' +
                            '<a href="/"><i class="shouye"></i><span>银泰首页</span></a>' +
                            '<a href="/category"><i class="fenlei"></i><span>分 类</span></a>' +
                            '<a href="/cart"><i class="gouwudai"></i><span>购物车</span></a>' +
                            '<a href="/user"><i class="wode"></i><span>我的银泰</span></a></div></div>';

                        N_body.append('<div class="kd-seet"></div>');
                        ytHeader.append(temp);

                        kdAlert = N_body.find('.kd-alert');
                        kdSeet = N_body.find('.kd-seet');
                    }

                    if (!self.headPass) {
                        kdSeet.css('display', 'block');
                        kdAlert.css('display', 'block');
                        self.headPass = true;
                    } else {
                        kdAlert.css('display', 'none');
                        kdSeet.css('display', 'none');
                        self.headPass = false;
                    }

                    //关闭头部下拉
                    kdSeet.bind('click', function (e) {
                        kdAlert.css('display', 'none');
                        kdSeet.css('display', 'none');
                        self.headPass = false;
                    });
                });

                //搜索框
                var txtKeyword = $("#txtKeyword"),
                    search = $("#search");
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
                search.click(function () {
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
                    links = "/product?id=";
                } else {
                    links = "/search?keyword=";
                }

                location.href = links + keyword;
            }
        };

        new BindHeadEvent();
    });

};

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

﻿var Header = __webpack_require__(1)();
var Lazyload = __webpack_require__(4).lazyload();
var Swipe = __webpack_require__(5);

$(function () {

    var Nodes = [],
        N_ModelDown = '.J-CountTime',

        E_click = "click";

    var HomePage = function () {
        var self = this;
        self.init();
    };
    HomePage.prototype = {
        /**
         * 初始化
         * @method init
         */
        init: function () {
            var self = this;

            self.collectNodes();
            self.bindEvent();
        },
        /**
         * 搜集节点
         * @method collectNodes
         */
        collectNodes: function () {
            Nodes[N_ModelDown] = $(N_ModelDown);
        },
        /**
         * 绑定事件
         * @method bindUI
         */
        bindEvent: function () {
            var self = this;

            //轮播图片
            self.carouselBanner();

            //单行模板
            $(".ProductSingleRow").on('swipe', function (e) {
                self._lazyload();
            });

            //倒计时显示
            if (Nodes[N_ModelDown].length > 0) {
                $.ajax({
                    url: "/home/gettime?t=" + Math.random(),
                    type: 'get',
                    data: '',
                    dataType: 'json',
                    success: function (data) {

                        var nowTime = data.time;

                        Nodes[N_ModelDown].each(function (thatNode, index) {

                            var thetNode = thatNode,
                                startTime = 0,
                                endTime = 0,
                                downtime = 0;
                            if (thetNode) {
                                startTime = parseFloat(nowTime);
                                endTime = parseFloat(thetNode.attr('end'));
                                downtime = (endTime - startTime) / 1000;
                            }
                            if (thetNode && downtime > 0) {
                                self.countDown(thetNode, downtime, Math.random(5));
                            }

                        });

                    }
                });
            }

            //各种点击事件处理
            ($("#J-ViewPort")).delegate('.Msg_GetPromotionTicket,.Msg_FavoriteProduct,.Msg_AddToShopCart,.Msg_BuyNowGeniral,.Msg_BuyNowSecKill', E_click, function (e) {
                var thisNode = $(this),
                    islogin = localStorage.userId,
                    result = []; //[itemCode-商品id, quantity-商品数量, promotionactiveid-优惠券id, type-商品类型, paramID-活动id, seckillid-秒杀商品ID]

                result = self.getTagAttr(thisNode);

                //领优惠券 className=Msg_GetPromotionTicket
                if (thisNode.hasClass('Msg_GetPromotionTicket')) {
                    if (islogin) {
                        self.getFavorableBond(result[2]);
                    } else {
                        location.href = "http://m.yintai.com/UserCenter/Login?returnUrl=" + escape(location.href);
                        return false;
                    }
                }

                //收藏商品 className=Msg_FavoriteProduct
                if (thisNode.hasClass('Msg_FavoriteProduct')) {
                    self.collectProduct(result[0]);
                }

                //加入购物车 className=Msg_AddToShopCart
                if (thisNode.hasClass('Msg_AddToShopCart')) {

                    self.addShoppingCart(result[0], result[1], result[3], result[4]);

                    if (confirm("加入购物车成功，现在查看购物车吗?")) {
                        location.href = "http://m.yintai.com/Sales/ShoppingCart";
                    }
                }

                //立即购买 className=Msg_BuyNowGeniral || Msg_BuyNowSecKill
                if (thisNode.hasClass('Msg_BuyNowGeniral') || thisNode.hasClass('Msg_BuyNowSecKill')) {
                    self.buyNow(result[0], result[1], result[3], result[4], result[5]);
                    //重置结算中心
                    self.resetSettlement();
                    //跳转到结算中心
                    location.href = "http://m.yintai.com/Sales/Settlement#buy"; // #buy不能删除,作为结算时区分立即购买
                }

            });

            //图片延迟加载
            self._lazyload();
        },
        /**
         * 显示倒计时
         * @method countDown
         * @return 无
         */
        countDown: function (curNode, _leftTime, i) {
            var time = null,
                renderTime = [],
                countTmp = '';

            if (_leftTime > 0) {
                var _hour,
                    _minute,
                    _second,
                    timeInfo = null;

                renderTime[i] = function () {
                    timeInfo = {
                        _day: Math.floor(_leftTime / 86400),
                        _hour: Math.floor((_leftTime % 86400) / 3600),
                        _minute: Math.floor((_leftTime % 3600) / 60),
                        _second: Math.floor(_leftTime % 60)
                    };
                    for (var i in timeInfo) {
                        if ((i == '_hour' || i == '_minute' || i == '_second') && timeInfo[i] < 10) {
                            timeInfo[i] = '0' + timeInfo[i];
                        }
                    }

                    if (timeInfo._day <= 0) {
                        countTmp = '<span class="hour">' + timeInfo._hour + '</span>:<span class="minute">' + timeInfo._minute + '</span>:<span class="second">' + timeInfo._second + '</span>';
                    } else {
                        countTmp = '<span class="day">' + timeInfo._day + '</span>:<span class="hour">' + timeInfo._hour + '</span>:<span class="minute">' + timeInfo._minute + '</span>:<span class="second">' + timeInfo._second + '</span>';
                    }

                    curNode.html(countTmp);
                    _leftTime -= 1;

                    if (_leftTime < 0) {
                        clearInterval(curNode.time);
                        curNode.html('');
                    }
                };
                curNode.time = setInterval(renderTime[i], 1000);
            }
        },
        /**
        * 轮播模块事件绑定
        * @method carouselBanner
        * @param null
        * @return null
        */
        carouselBanner: function () {
            var self = this;

            var bannercount = document.querySelectorAll(".BannerList");
            for (var i = 0; i < bannercount.length; i++) {
                var thatNode = bannercount[i];

                var thisBanner = thatNode.querySelector(".listbanner");
                var thisBaLine = thatNode.querySelector(".linelist");
                var thisBannerline = thisBaLine && thisBaLine.getElementsByTagName('span');

                if (thisBanner) {
                    Swipe.swipe(thisBanner, {
                        callback: function (index, node) {
                            var count = thisBannerline.length,
                                thatPic = node.querySelector('img[data-src]'),
                                reallySrc = null;

                            if (thatPic) {
                                reallySrc = thatPic.getAttribute('data-src');

                                if (reallySrc) {
                                    thatPic.setAttribute('src', reallySrc);
                                    thatPic.removeAttribute('data-src');
                                }
                            }

                            if (count > 0) {
                                while (count--) {
                                    thisBannerline[count].className = '';
                                }

                                //把自动复制的复位为对应的小点数目
                                if (thisBannerline.length == 2 && index > 1) {
                                    index = index - 2;
                                }

                                //判断当前的节点
                                if (thisBannerline[index]) {
                                    thisBannerline[index].className = 'on';
                                }
                            }
                        },
                        auto: 4000
                    });
                }
            }
        },
        /**
         * 延迟加载
         * @method _lazyload
         */
        _lazyload: function () {
            Lazyload.init({
                offset: 50,
                throttle: 250,
                unload: false
            });
        }
    };

    new HomePage();

});

/***/ }),
/* 4 */
/***/ (function(module, exports) {


module.exports = {
    /**
     * echo.js v1.7.0
     * @toddmotto (a) 2015
     * Github: https://github.com/toddmotto/echo
     */
    lazyload: function () {
        'use strict';

        var echo = {};
        var callback = function () { };
        var offset, poll, delay, useDebounce, unload;
        var isHidden = function (element) {
            return (element.offsetParent === null);
        };

        var inView = function (element, view) {
            if (isHidden(element)) {
                return false;
            }

            var box = element.getBoundingClientRect();
            return (box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b);
        };

        var debounceOrThrottle = function () {
            if (!useDebounce && !!poll) {
                return;
            }
            clearTimeout(poll);
            poll = setTimeout(function () {
                echo.render();
                poll = null;
            }, delay);
        };

        echo.init = function (opts) {
            opts = opts || {};
            var offsetAll = opts.offset || 0;
            var offsetVertical = opts.offsetVertical || offsetAll;
            var offsetHorizontal = opts.offsetHorizontal || offsetAll;
            var optionToInt = function (opt, fallback) {
                return parseInt(opt || fallback, 10);
            };
            offset = {
                t: optionToInt(opts.offsetTop, offsetVertical),
                b: optionToInt(opts.offsetBottom, offsetVertical),
                l: optionToInt(opts.offsetLeft, offsetHorizontal),
                r: optionToInt(opts.offsetRight, offsetHorizontal)
            };
            delay = optionToInt(opts.throttle, 250);
            useDebounce = opts.debounce !== false;
            unload = !!opts.unload;
            callback = opts.callback || callback;
            echo.render();
            if (document.addEventListener) {
                document.addEventListener('scroll', debounceOrThrottle, false);
                document.addEventListener('load', debounceOrThrottle, false);
            } 
            // else {
            //     root.attachEvent('onscroll', debounceOrThrottle);
            //     root.attachEvent('onload', debounceOrThrottle);
            // }
        };

        echo.render = function () {
            var nodes = document.querySelectorAll('img[data-original], [data-original-background]');
            var length = nodes.length;
            var src, elem;
            var view = {
                l: 0 - offset.l,
                t: 0 - offset.t,
                b: (document.documentElement.clientHeight) + offset.b,
                r: (document.documentElement.clientWidth) + offset.r
            };
            for (var i = 0; i < length; i++) {
                elem = nodes[i];
                if (inView(elem, view)) {

                    if (unload) {
                        elem.setAttribute('data-original-placeholder', elem.src);
                    }

                    if (elem.getAttribute('data-original-background') !== null) {
                        elem.style.backgroundImage = "url(" + elem.getAttribute('data-original-background') + ")";
                    } else {
                        elem.src = elem.getAttribute('data-original');
                    }

                    if (!unload) {
                        elem.removeAttribute('data-original');
                        elem.removeAttribute('data-original-background');
                    }

                    callback(elem, 'load');
                } else if (unload && !!(src = elem.getAttribute('data-original-placeholder'))) {

                    if (elem.getAttribute('data-original-background') !== null) {
                        elem.style.backgroundImage = "url(" + src + ")";
                    } else {
                        elem.src = src;
                    }

                    elem.removeAttribute('data-original-placeholder');
                    callback(elem, 'unload');
                }
            }
            if (!length) {
                echo.detach();
            }
        };

        echo.detach = function () {
            if (document.removeEventListener) {
                document.removeEventListener('scroll', debounceOrThrottle);
            } 
            // else {
            //     root.detachEvent('onscroll', debounceOrThrottle);
            // }
            clearTimeout(poll);
        };

        return echo;
    }
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {
    /**
     * swipe 2.0
     * Brad Birdsall, MIT License
     * CopyRight 2013, Licensed GPL & MIT
     * Github: https://github.com/thebird/swipe
     */
    swipe: function (container, options) {
        "use strict";

        // utilities
        var noop = function () { }; // simple no operation function
        var offloadFn = function (fn) {
            setTimeout(fn || noop, 0)
        }; // offload a functions execution

        // check browser capabilities
        var browser = {
            addEventListener: !!window.addEventListener,
            touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
            transitions: (function (temp) {
                var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
                for (var i in props)
                    if (temp.style[props[i]] !== undefined) return true;
                return false;
            })(document.createElement('swipe'))
        };

        // quit if no root element
        if (!container) return;
        var element = container.children[0];
        var slides, slidePos, width, length;
        options = options || {};
        var index = parseInt(options.startSlide, 10) || 0;
        var speed = options.speed || 300;
        options.continuous = options.continuous !== undefined ? options.continuous : true;

        function setup() {

            // cache slides
            slides = element.children;
            length = slides.length;

            // set continuous to false if only one slide
            if (slides.length < 2) options.continuous = false;

            //special case if two slides
            if (browser.transitions && options.continuous && slides.length < 3) {
                element.appendChild(slides[0].cloneNode(true));
                element.appendChild(element.children[1].cloneNode(true));
                slides = element.children;
            }

            // create an array to store current positions of each slide
            slidePos = new Array(slides.length);

            // determine width of each slide
            width = container.getBoundingClientRect().width || container.offsetWidth;

            element.style.width = (slides.length * width) + 'px';

            // stack elements
            var pos = slides.length;
            while (pos--) {

                var slide = slides[pos];

                slide.style.width = width + 'px';
                slide.setAttribute('data-index', pos);

                if (browser.transitions) {
                    slide.style.left = (pos * -width) + 'px';
                    move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
                }

            }

            // reposition elements before and after index
            if (options.continuous && browser.transitions) {
                move(circle(index - 1), -width, 0);
                move(circle(index + 1), width, 0);
            }

            if (!browser.transitions) element.style.left = (index * -width) + 'px';

            container.style.visibility = 'visible';

        }

        function prev() {

            if (options.continuous) slide(index - 1);
            else if (index) slide(index - 1);

        }

        function next() {

            if (options.continuous) slide(index + 1);
            else if (index < slides.length - 1) slide(index + 1);

        }

        function circle(index) {

            // a simple positive modulo using slides.length
            return (slides.length + (index % slides.length)) % slides.length;

        }

        function slide(to, slideSpeed) {

            // do nothing if already on requested slide
            if (index == to) return;

            if (browser.transitions) {

                var direction = Math.abs(index - to) / (index - to); // 1: backward, -1: forward

                // get the actual position of the slide
                if (options.continuous) {
                    var natural_direction = direction;
                    direction = -slidePos[circle(to)] / width;

                    // if going forward but to < index, use to = slides.length + to
                    // if going backward but to > index, use to = -slides.length + to
                    if (direction !== natural_direction) to = -direction * slides.length + to;

                }

                var diff = Math.abs(index - to) - 1;

                // move all the slides between index and to in the right direction
                while (diff--) move(circle((to > index ? to : index) - diff - 1), width * direction, 0);

                to = circle(to);

                move(index, width * direction, slideSpeed || speed);
                move(to, 0, slideSpeed || speed);

                if (options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place

            } else {

                to = circle(to);
                animate(index * -width, to * -width, slideSpeed || speed);
                //no fallback for a circular continuous if the browser does not accept transitions
            }

            index = to;
            offloadFn(options.callback && options.callback(index, slides[index]));
        }

        function move(index, dist, speed) {

            translate(index, dist, speed);
            slidePos[index] = dist;

        }

        function translate(index, dist, speed) {

            var slide = slides[index];
            var style = slide && slide.style;

            if (!style) return;

            style.webkitTransitionDuration =
                style.MozTransitionDuration =
                style.msTransitionDuration =
                style.OTransitionDuration =
                style.transitionDuration = speed + 'ms';

            style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
            style.msTransform =
                style.MozTransform =
                style.OTransform = 'translateX(' + dist + 'px)';

        }

        function animate(from, to, speed) {

            // if not an animation, just reposition
            if (!speed) {

                element.style.left = to + 'px';
                return;

            }

            var start = +new Date;

            var timer = setInterval(function () {

                var timeElap = +new Date - start;

                if (timeElap > speed) {

                    element.style.left = to + 'px';

                    if (delay) begin();

                    options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

                    clearInterval(timer);
                    return;

                }

                element.style.left = (((to - from) * (Math.floor((timeElap / speed) * 100) / 100)) + from) + 'px';

            }, 4);

        }

        // setup auto slideshow
        var delay = options.auto || 0;
        var interval;

        function begin() {

            interval = setTimeout(next, delay);

        }

        function stop() {

            // delay = 0;
            clearTimeout(interval);

        }


        // setup initial vars
        var start = {};
        var delta = {};
        var isScrolling;

        // setup event capturing
        var events = {

            handleEvent: function (event) {

                switch (event.type) {
                    case 'touchstart':
                        this.start(event);
                        break;
                    case 'touchmove':
                        this.move(event);
                        break;
                    case 'touchend':
                        offloadFn(this.end(event));
                        break;
                    case 'webkitTransitionEnd':
                    case 'msTransitionEnd':
                    case 'oTransitionEnd':
                    case 'otransitionend':
                    case 'transitionend':
                        offloadFn(this.transitionEnd(event));
                        break;
                    case 'resize':
                        offloadFn(setup);
                        break;
                }

                if (options.stopPropagation) event.stopPropagation();

            },
            start: function (event) {

                var touches = event.touches[0];

                // measure start values
                start = {

                    // get initial touch coords
                    x: touches.pageX,
                    y: touches.pageY,

                    // store time to determine touch duration
                    time: +new Date

                };

                // used for testing first move event
                isScrolling = undefined;

                // reset delta and end measurements
                delta = {};

                // attach touchmove and touchend listeners
                element.addEventListener('touchmove', this, false);
                element.addEventListener('touchend', this, false);

            },
            move: function (event) {

                // ensure swiping with one touch and not pinching
                if (event.touches.length > 1 || event.scale && event.scale !== 1) return

                if (options.disableScroll) event.preventDefault();

                var touches = event.touches[0];

                // measure change in x and y
                delta = {
                    x: touches.pageX - start.x,
                    y: touches.pageY - start.y
                }

                // determine if scrolling test has run - one time test
                if (typeof isScrolling == 'undefined') {
                    isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
                }

                // if user is not trying to scroll vertically
                if (!isScrolling) {

                    // prevent native scrolling
                    event.preventDefault();

                    // stop slideshow
                    stop();

                    // increase resistance if first or last slide
                    if (options.continuous) { // we don't add resistance at the end

                        translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0);
                        translate(index, delta.x + slidePos[index], 0);
                        translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);

                    } else {

                        delta.x =
                            delta.x /
                            ((!index && delta.x > 0 // if first slide and sliding left
                                || index == slides.length - 1 // or if last slide and sliding right
                                && delta.x < 0 // and if sliding at all
                            ) ?
                                (Math.abs(delta.x) / width + 1) // determine resistance level
                                : 1); // no resistance if false

                        // translate 1:1
                        translate(index - 1, delta.x + slidePos[index - 1], 0);
                        translate(index, delta.x + slidePos[index], 0);
                        translate(index + 1, delta.x + slidePos[index + 1], 0);
                    }

                }

            },
            end: function (event) {

                // measure duration
                var duration = +new Date - start.time;

                // determine if slide attempt triggers next/prev slide
                var isValidSlide =
                    Number(duration) < 250 // if slide duration is less than 250ms
                    && Math.abs(delta.x) > 20 // and if slide amt is greater than 20px
                    || Math.abs(delta.x) > width / 2; // or if slide amt is greater than half the width

                // determine if slide attempt is past start and end
                var isPastBounds = !index && delta.x > 0 // if first slide and slide amt is greater than 0
                    || index == slides.length - 1 && delta.x < 0; // or if last slide and slide amt is less than 0

                if (options.continuous) isPastBounds = false;

                // determine direction of swipe (true:right, false:left)
                var direction = delta.x < 0;

                // if not scrolling vertically
                if (!isScrolling) {

                    if (isValidSlide && !isPastBounds) {

                        if (direction) {

                            if (options.continuous) { // we need to get the next in this direction in place

                                move(circle(index - 1), -width, 0);
                                move(circle(index + 2), width, 0);

                            } else {
                                move(index - 1, -width, 0);
                            }

                            move(index, slidePos[index] - width, speed);
                            move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
                            index = circle(index + 1);

                        } else {
                            if (options.continuous) { // we need to get the next in this direction in place

                                move(circle(index + 1), width, 0);
                                move(circle(index - 2), -width, 0);

                            } else {
                                move(index + 1, width, 0);
                            }

                            move(index, slidePos[index] + width, speed);
                            move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
                            index = circle(index - 1);

                        }

                        options.callback && options.callback(index, slides[index]);

                    } else {

                        if (options.continuous) {

                            move(circle(index - 1), -width, speed);
                            move(index, 0, speed);
                            move(circle(index + 1), width, speed);

                        } else {

                            move(index - 1, -width, speed);
                            move(index, 0, speed);
                            move(index + 1, width, speed);
                        }

                    }

                }

                // kill touchmove and touchend event listeners until touchstart called again
                element.removeEventListener('touchmove', events, false)
                element.removeEventListener('touchend', events, false)

            },
            transitionEnd: function (event) {

                if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

                    if (delay) begin();

                    options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

                }

            }

        };

        // trigger setup
        setup();

        // start auto slideshow if applicable
        if (delay) begin();


        // add event listeners
        if (browser.addEventListener) {

            // set touchstart event on element
            if (browser.touch) element.addEventListener('touchstart', events, false);

            if (browser.transitions) {
                element.addEventListener('webkitTransitionEnd', events, false);
                element.addEventListener('msTransitionEnd', events, false);
                element.addEventListener('oTransitionEnd', events, false);
                element.addEventListener('otransitionend', events, false);
                element.addEventListener('transitionend', events, false);
            }

            // set resize event on window
            window.addEventListener('resize', events, false);

        } else {

            window.onresize = function () {
                setup()
            }; // to play nice with old IE

        }

        // expose the Swipe API
        return {
            setup: function () {

                setup();

            },
            slide: function (to, speed) {

                // cancel slideshow
                stop();

                slide(to, speed);

            },
            prev: function () {

                // cancel slideshow
                stop();

                prev();

            },
            next: function () {

                // cancel slideshow
                stop();

                next();

            },
            stop: function () {

                // cancel slideshow
                stop();

            },
            getPos: function () {

                // return current index position
                return index;

            },
            getNumSlides: function () {

                // return total number of slides
                return length;
            },
            kill: function () {

                // cancel slideshow
                stop();

                // reset element
                element.style.width = '';
                element.style.left = '';

                // reset slides
                var pos = slides.length;
                while (pos--) {

                    var slide = slides[pos];
                    slide.style.width = '';
                    slide.style.left = '';

                    if (browser.transitions) translate(pos, 0, 0);

                }

                // removed event listeners
                if (browser.addEventListener) {

                    // remove current event listeners
                    element.removeEventListener('touchstart', events, false);
                    element.removeEventListener('webkitTransitionEnd', events, false);
                    element.removeEventListener('msTransitionEnd', events, false);
                    element.removeEventListener('oTransitionEnd', events, false);
                    element.removeEventListener('otransitionend', events, false);
                    element.removeEventListener('transitionend', events, false);
                    window.removeEventListener('resize', events, false);

                } else {

                    window.onresize = null;

                }

            }
        };
    }
};

/***/ })
/******/ ]);