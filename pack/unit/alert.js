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
				'background-color': 'rgba(0, 0, 0, .1)',
				'z-index': '9999'
			},
			content: {
				'margin-top': '-2rem',
				'width': '90%',
				'border-radius': '5px',
				'overflow': 'hidden',
				'box-shadow': '0px 5px 20px 0px rgba(126, 137, 140, .2)',
				'border': '1px solid #B8C8CC',
				'background-color': '#fff'
			},
			header: {
				'padding': '0 .28rem',
				'line-height': '1rem',
				'color': '#333',
				'font-weight': 700,
				'border-bottom': '1px solid #ededed',
				'background-color': '#EDF5F7'
			},
			body: {
				'padding': '.5rem .28rem',
				'color': '#666',
				'word-wrap': 'break-word',
				'word-break': 'break-all'
			},
			footer: {
				'overflow': 'hidden',
				'border-top': '1px solid #ededed',
				'text-align': 'center',
				'line-height': '1rem'
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
			'color': '#f50'
		};
		var _cancenBtnCss = {
			'color': '#999',
			'border-left': '1px solid #ededed'
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
		typeof _default.header === 'string' ? $header.text(_default.header) : $header.append(_default.header);
		typeof _default.body === 'string' ? $body.text(_default.body) : $body.append(_default.body);

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
			$confirmBtn.css({ 'width': '100%' });
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
}();