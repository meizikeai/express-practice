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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
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
/* 2 */
/***/ (function(module, exports) {

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

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

﻿var Common = __webpack_require__(0)();
var Header = __webpack_require__(1)();
var Alert = __webpack_require__(2)();

$(function () {
    let Nodes = [];
    let N_username = "#username";
    let N_password = "#password";
    let N_error = ".error";
    let N_enter = ".enter";

    var Login = function () {
        this.init();
    };

    Login.prototype = {
        /**
         * 初始化
         * @method init
         * @param 无
         * @return 无
         */
        init: function () {
            var self = this;

            self.collectNodes();
            self.bindEvent();
        },
        /**
         * 搜集节点
         * @method collectNodes
         * @param 无
         * @return 无
         */
        collectNodes: function () {
            Nodes[N_username] = $(N_username);
            Nodes[N_password] = $(N_password);
            Nodes[N_error] = $(N_error);
            Nodes[N_enter] = $(N_enter);
        },
        /**
         * 绑定事件
         * @method bindEvent
         * @param 无
         * @return 无
         */
        bindEvent: function () {
            var self = this;

            Nodes[N_enter].on("click", function (e) {
                const username = $.trim(Nodes[N_username].val());
                const password = $.trim(Nodes[N_password].val());

                if (!username) {
                    self.tipBox("请输入您的帐号~");
                    return false;
                } else if (!password) {
                    self.tipBox("请输入您的密码~");
                    return false;
                }

                $.ajax({
                    type: "post",
                    url: "/checkonline",
                    data: {
                        username: username,
                        password: password
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data.success) {
                            location.href = data.url;
                        } else {
                            self.tipBox("请确认帐号与密码后重新再尝试！");
                        }
                    },
                    error: function () {
                        self.tipBox("服务器貌似出问题啦~")
                    }
                })
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

    new Login();
});

/***/ })
/******/ ]);