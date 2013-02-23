/*
 *	NetEase Javascript UI Library (Based on NetEase Javascript Library 1.x)
 *	Version: 0.1.8
 *	Author: heero
 *	Creation date: 2009/7/6
 *
 *	Modifier: heero
 *	Modified time: 2010/1/22 10:43
 *	Modified for: 更新模板类，可实例化
 */
(function(window, undefined){

var $ = window.NTES || {};
if (!$.ui) {
	$.ui = {};
}

/// 标识当前版本
$.ui.version = "0.1.8";


/// 模板类
/// @param {Array,Object} 
$.ui.Template = function() {
	this._cache = {};	// 模板缓存
};
$.ui.Template.prototype = {
	
	/// 获取指定模板的代码
	/// @param {String} 模板名
	/// @return {String} 模板代码
	get : function(name) {
		return null == this._cache[name] ? "" : this._cache[name];
	},

	/// 模板转换
	/// @param {String} 模板名
	/// @param {Object} 值集合
	/// @return {String} 转换后的代码
	parse : function(name, values) {
		return $.util.parseTpl(this.get(name), values);
	},
	
	/// 加载模板
	/// @param {Array,Object} 模板元素
	load : function(tpls) {
		var i;
		if ($.util.isArray(tpls)) {
			i = tpls.length;
			while (--i >= 0) {
				this._cache[tpls[i].title] = tpls[i].innerHTML.replace(/(?:^\s*<!--)|(?:-->\s*$)/g, "");
			}
		} else {
			for (i in tpls) {
				tpls.hasOwnProperty(i) && (this._cache[i] = tpls[i]);
			}
		}
	}
};
// 可作为静态类使用
$.ui.Template._cache = {};
$.ui.Template.get = $.ui.Template.prototype.get;
$.ui.Template.parse = $.ui.Template.prototype.parse;
$.ui.Template.load = function(tpls) {
	tpls = tpls || $("#templates > *");
	$.ui.Template.prototype.load.call(this, tpls);
};


/// 弹出层控制类
/// @param {HtmlElement,Array,HtmlCollection} 控制弹出的元素
/// @param {HtmlElement,Array,HtmlCollection} 弹出层
/// @param {String} 触发显示弹出层的事件名
/// @param {Number} 隐藏延时，单位毫秒，默认为300毫秒
$.ui.PopupLayer = function(ctrl, content, eventName, delay) {
	if (!arguments.length) {
		return;
	}
	
	var t = this;
	t.constructor = arguments.callee;
	
	t._ctrl = ctrl;
	t._content = content;
	t.delay = isNaN(delay) ? 300 : delay;
	
	var delayHide = t.delayHide.bind(t),
		clearDelay = t.clearDelay.bind(t);
	
	$.event.addEvent(ctrl, eventName, t.show.bind(t));
	$.event.addEvent(ctrl, "mouseout", delayHide);
	$.event.addEvent(ctrl, "mouseover", clearDelay);
	$.event.addEvent(content, "mouseover", clearDelay);
	$.event.addEvent(content, "mouseout", delayHide);
};
$.ui.PopupLayer.prototype = {
	/// 显示弹出层
	show : function() {
		$.style.addCss(this._content, "display:block;");
		this.onShow && this.onShow();
	},
	
	/// 隐藏弹出层
	hide : function() {
		$.style.addCss(this._content, "display:none;");
		this.onHide && this.onHide();
	},
	
	/// 延时隐藏弹出层
	delayHide : function() {
		if (this._timerId === undefined) {
			this._timerId = setTimeout(this.hide.bind(this), this.delay);
		}
	},
	
	/// 取消延时隐藏
	clearDelay : function() {
		if (this._timerId !== undefined) {
			clearTimeout(this._timerId);
			this._timerId = undefined;
		}
	}
};


// 滚动策略
var scrollMode = {
	
	// 向左滚动
	left : function(lpf) {
		var t = this;
		t._wrapper.scrollLeft += lpf;
		if (t._copy.offsetWidth - t._wrapper.scrollLeft <= 0) {
			t._wrapper.scrollLeft -= t._body.offsetWidth;
		}
	},
	// 向右滚动
	right : function(lpf) {
		var t = this, nextValue;
		if (t._wrapper.scrollLeft <= 0) {
			t._wrapper.scrollLeft += t._body.offsetWidth;
		}
		nextValue = t._wrapper.scrollLeft - lpf;
		t._wrapper.scrollLeft = nextValue < 0 ? t._body.offsetWidth + nextValue : nextValue;
	},
	// 向上滚动
	top : function(lpf) {
		var t = this;
		t._wrapper.scrollTop += lpf;
		if (t._copy.offsetHeight - t._wrapper.scrollTop <= 0) {
			t._wrapper.scrollTop -= t._body.offsetHeight;
		}
	},
	// 向下滚动
	bottom : function(lpf) {
		var t = this, nextValue;
		if (t._wrapper.scrollTop <= 0) {
			t._wrapper.scrollTop += t._body.offsetHeight;
		}
		nextValue = t._wrapper.scrollTop - lpf;
		t._wrapper.scrollTop = nextValue < 0 ? t._body.offsetHeight + nextValue : nextValue;
	}
};

/// 无间断滚动类（需要特定的DOM结构和CSS样式）
/// @param {HtmlElement} 滚动主体
/// @param {String} 滚动方向
/// @param {Number} 帧速，默认为15
/// @param {Number} 每帧滚动长度，默认为1
$.ui.Marquee = function(body, direction, fps, lpf) {
	if (!arguments.length) {
		return;
	}
	
	var t = this;
	t.constructor = arguments.callee;
	
	// 创建不间断滚动所需的DOM结构
	t._body = body; t._wrapper = body.parentNode;
	t._copy = document.createElement(body.tagName); t._copy.className = body.className; t._copy.innerHTML = body.innerHTML;
	t._wrapper.appendChild(t._copy);
	t._wrapper = t._wrapper.parentNode;

	direction = direction ? direction.toLowerCase() : "left";
	t.setDirection(direction);
	t.fps = isNaN(fps) ? 15 : fps;
	t.lpf = isNaN(lpf) ? 1 : lpf;
	
	t._timerIds = [];
};
$.ui.Marquee.prototype = {
	
	/// 设定滚动方向
	/// @param {String} 滚动方向: left-左, right-右, top-上, bottom-下
	setDirection : function(direction) {
		this.move = scrollMode[direction];
		if (!this.move) {
			throw "not such direction";
		}
	},
	
	/// 滚动控制
	/// @param {Object} 参数集合
	_scroll : function(params) {
		var t = this, lpf = t.lpf;
		if (!t._isPause) {
			if (params.length !== 0) {
				if (params.length > 0) {
					lpf = Math.min(params.length, lpf);
					params.length -= lpf;
				}
				t.move(lpf);
			} else {
				t.stop();
				params.callback && params.callback();
			}
		}
	},
	
	/// 开始滚动
	/// @param {Number} 滚动距离(px)，默认为一直滚动
	/// @param {String} 滚动方向
	/// @param {Function} 滚动完成后执行的函数，仅当length > 0时有效
	start : function() {
		var t = this;
		if (0 === t._timerIds.length) {
			var length, direction, callback, args = arguments;
			
			// 重载
			switch (typeof args[0]) {
				case "number":
					length = args[0];
					if ("string" === typeof args[1]) {
						direction = args[1];
						callback = args[2];
					} else {
						callback = args[1];
					}
				break;
				
				case "string":
					direction = args[0];
					length = args[1];
					callback = args[2];
				break;
			}

			direction && t.setDirection(direction);

			var params = {
				length : isNaN(length) ? -1 : parseInt(length)
			};
			if (params.length > 0) {
				params.callback = $.util.isFunction(callback) ? callback : undefined;
			}
			t._currentScroll = t._scroll.bind(t, params);
			t._timerIds.push(setInterval(t._currentScroll, t.fps));
		}
	},
	
	/// 停止滚动
	stop : function() {
		var t = this;
		while (t._timerIds.length) {
			clearInterval(t._timerIds.pop());
		}
		t._currentScroll = undefined;
	},
	
	/// 加快滚动速度
	speedUp : function() {
		var t = this;
		t._timerIds.length && t._timerIds.push(setInterval(t._currentScroll, t.fps));
	},
	
	/// 减慢滚动速度
	slowDown : function() {
		this._timerIds.length > 1 && clearInterval(this._timerIds.pop());
	},
	
	/// （暂停后）继续滚动
	go : function() {
		this._isPause = false;
	},
	
	/// 暂停滚动
	stay : function() {
		this._isPause = true;
	}
};


// 每个月的天数
var dayCountInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
/// 月历类
/// @param {Number} 年份，默认为当前年份
/// @param {Number} 月份，默认为当前月份
$.ui.Calendar = function(year, month) {
	this.constructor = arguments.callee;
	this.setDate(year, month);
};

// 月历类方法定义
$.ui.Calendar.prototype = {

	/// 获取年份
	/// @return {Number} 年份
	getYear : function () {
		return this._year;
	},
	
	/// 获取月份
	/// @return {Number} 月份
	getMonth : function() {
		return this._month + 1;
	},
	
	/// 设置日期
	/// @param {Number} 年，默认为当前年份
	/// @param {Number} 月，默认为当前月份
	setDate : function(y, m) {
		var now = new Date();
		this._year = isNaN(y) ? now.getFullYear() : y;
		this._month = isNaN(m) ? now.getMonth() : m - 1;
	},
	
	/// 获取月历数据
	/// @return {Object} 月历数据
	build : function() {
		var dayCount = NTES.ui.Calendar.getDayCount(this._year, this._month + 1),
			tool = new Date(this._year, this._month, 1), now = new Date(),
			firstDay = tool.getDay(),
			data = { year : this._year, month : this._month + 1, weeks : [] },
			i, state, temp, week = [];
			
		now.setHours(0, 0, 0, 0);
		now = now.getTime();
		
		while (firstDay-- > 0) {
			week.push({
				value : ""
			});
		}
		
		for (i = 1; i <= dayCount; i++) {
			tool.setDate(i); temp = tool.getTime();
			if (temp > now) {
				state = 1;
			} else if (temp < now) {
				state = -1;
			} else {
				state = 0;
			}
			
			week.push({
				value : i,
				state : state
			});
			if (week.length === 7) {
				data.weeks.push(week);
				week = [];
			}
		}
		
		if (week.length % 7 !== 0) {	// 补全后面的空白
			while (week.length < 7) {
				week.push({
					value : ""
				});
			}
			data.weeks.push(week);
		}
		
		return data;
	}
};

/// 获取指定年月天数
/// @param {Number} 年份
/// @param {Number} 月份
/// @return {Number} 指定月份天数
$.ui.Calendar.getDayCount = function(y, m) {
	return 2 == m ?  (0 == y % 4 && 0 != y % 100 || 0 == y % 400 ? 29 : 28) : dayCountInMonths[m - 1];
};

})(window);