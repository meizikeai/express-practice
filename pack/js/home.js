var header = require("../unit/header")();
var lazyload = require("../unit/lazyload").lazyload();
var swipe = require("../unit/swipe");
var style = require("../css/home.css");

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
                    swipe.swipe(thisBanner, {
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
            lazyload.init({
                offset: 50,
                throttle: 250,
                unload: false
            });
        }
    };

    new HomePage();

});