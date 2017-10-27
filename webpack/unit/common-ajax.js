module.exports = function () {
	var loadingAttribute = 'data-loading';
	var animationTimeout = 0.5;
	var isLoading = 'true';
	var $body = $('body');
	var $mask;

	// ajax loading
	$(document).on('ajaxStart', function () {
		if (!$mask) {
			$mask = $('<div/>').css({
				'z-index': '9999',
				'position': 'fixed',
				'left': '0',
				'top': '0',
				'right': '0',
				'bottom': '0',
				'width': '100%',
				'background': 'rgba(255, 255, 255, .5) url(http://r.ytrss.com/mobile/img/h5-loading.gif) center 35% no-repeat',
				'opacity': '0',
				'-webkit-transition': 'opacity ' + animationTimeout + 's ease-in',
				'transition': 'opacity ' + animationTimeout + 's ease-in;'
			});
		}

		$mask.appendTo('body').css('opacity', '1');
		$body.attr(loadingAttribute, isLoading);

	}).on('ajaxStop', function () {
		if ($body.attr(loadingAttribute) === isLoading && $mask) {
			$mask.css('opacity', '0');

			// 等动画完成后移除遮罩与 body 的附加属性
			setTimeout(function () {
				$mask.remove();
				$body.removeAttr(loadingAttribute);
			}, animationTimeout * 1000);
		}
	});
};