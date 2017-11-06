
module.exports = {
    /**
     * echo.js v1.7.0
     * @toddmotto (a) 2015
     * Github: https://github.com/toddmotto/echo
     */
    lazyload() {
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
