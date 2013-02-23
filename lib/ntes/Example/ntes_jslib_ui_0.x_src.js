/*
 *	NetEase Javascript UI Library (Based on NetEase Javascript Library 1.x)
 *	Version: 0.1.8
 *	Author: heero
 *	Creation date: 2009/7/6
 *
 *	Modifier: heero
 *	Modified time: 2010/1/22 10:43
 *	Modified for: ����ģ���࣬��ʵ����
 */
(function(window, undefined){

var $ = window.NTES || {};
if (!$.ui) {
	$.ui = {};
}

/// ��ʶ��ǰ�汾
$.ui.version = "0.1.8";


/// ģ����
/// @param {Array,Object} 
$.ui.Template = function() {
	this._cache = {};	// ģ�建��
};
$.ui.Template.prototype = {
	
	/// ��ȡָ��ģ��Ĵ���
	/// @param {String} ģ����
	/// @return {String} ģ�����
	get : function(name) {
		return null == this._cache[name] ? "" : this._cache[name];
	},

	/// ģ��ת��
	/// @param {String} ģ����
	/// @param {Object} ֵ����
	/// @return {String} ת����Ĵ���
	parse : function(name, values) {
		return $.util.parseTpl(this.get(name), values);
	},
	
	/// ����ģ��
	/// @param {Array,Object} ģ��Ԫ��
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
// ����Ϊ��̬��ʹ��
$.ui.Template._cache = {};
$.ui.Template.get = $.ui.Template.prototype.get;
$.ui.Template.parse = $.ui.Template.prototype.parse;
$.ui.Template.load = function(tpls) {
	tpls = tpls || $("#templates > *");
	$.ui.Template.prototype.load.call(this, tpls);
};


/// �����������
/// @param {HtmlElement,Array,HtmlCollection} ���Ƶ�����Ԫ��
/// @param {HtmlElement,Array,HtmlCollection} ������
/// @param {String} ������ʾ��������¼���
/// @param {Number} ������ʱ����λ���룬Ĭ��Ϊ300����
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
	/// ��ʾ������
	show : function() {
		$.style.addCss(this._content, "display:block;");
		this.onShow && this.onShow();
	},
	
	/// ���ص�����
	hide : function() {
		$.style.addCss(this._content, "display:none;");
		this.onHide && this.onHide();
	},
	
	/// ��ʱ���ص�����
	delayHide : function() {
		if (this._timerId === undefined) {
			this._timerId = setTimeout(this.hide.bind(this), this.delay);
		}
	},
	
	/// ȡ����ʱ����
	clearDelay : function() {
		if (this._timerId !== undefined) {
			clearTimeout(this._timerId);
			this._timerId = undefined;
		}
	}
};


// ��������
var scrollMode = {
	
	// �������
	left : function(lpf) {
		var t = this;
		t._wrapper.scrollLeft += lpf;
		if (t._copy.offsetWidth - t._wrapper.scrollLeft <= 0) {
			t._wrapper.scrollLeft -= t._body.offsetWidth;
		}
	},
	// ���ҹ���
	right : function(lpf) {
		var t = this, nextValue;
		if (t._wrapper.scrollLeft <= 0) {
			t._wrapper.scrollLeft += t._body.offsetWidth;
		}
		nextValue = t._wrapper.scrollLeft - lpf;
		t._wrapper.scrollLeft = nextValue < 0 ? t._body.offsetWidth + nextValue : nextValue;
	},
	// ���Ϲ���
	top : function(lpf) {
		var t = this;
		t._wrapper.scrollTop += lpf;
		if (t._copy.offsetHeight - t._wrapper.scrollTop <= 0) {
			t._wrapper.scrollTop -= t._body.offsetHeight;
		}
	},
	// ���¹���
	bottom : function(lpf) {
		var t = this, nextValue;
		if (t._wrapper.scrollTop <= 0) {
			t._wrapper.scrollTop += t._body.offsetHeight;
		}
		nextValue = t._wrapper.scrollTop - lpf;
		t._wrapper.scrollTop = nextValue < 0 ? t._body.offsetHeight + nextValue : nextValue;
	}
};

/// �޼�Ϲ����ࣨ��Ҫ�ض���DOM�ṹ��CSS��ʽ��
/// @param {HtmlElement} ��������
/// @param {String} ��������
/// @param {Number} ֡�٣�Ĭ��Ϊ15
/// @param {Number} ÿ֡�������ȣ�Ĭ��Ϊ1
$.ui.Marquee = function(body, direction, fps, lpf) {
	if (!arguments.length) {
		return;
	}
	
	var t = this;
	t.constructor = arguments.callee;
	
	// ��������Ϲ��������DOM�ṹ
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
	
	/// �趨��������
	/// @param {String} ��������: left-��, right-��, top-��, bottom-��
	setDirection : function(direction) {
		this.move = scrollMode[direction];
		if (!this.move) {
			throw "not such direction";
		}
	},
	
	/// ��������
	/// @param {Object} ��������
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
	
	/// ��ʼ����
	/// @param {Number} ��������(px)��Ĭ��Ϊһֱ����
	/// @param {String} ��������
	/// @param {Function} ������ɺ�ִ�еĺ���������length > 0ʱ��Ч
	start : function() {
		var t = this;
		if (0 === t._timerIds.length) {
			var length, direction, callback, args = arguments;
			
			// ����
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
	
	/// ֹͣ����
	stop : function() {
		var t = this;
		while (t._timerIds.length) {
			clearInterval(t._timerIds.pop());
		}
		t._currentScroll = undefined;
	},
	
	/// �ӿ�����ٶ�
	speedUp : function() {
		var t = this;
		t._timerIds.length && t._timerIds.push(setInterval(t._currentScroll, t.fps));
	},
	
	/// ���������ٶ�
	slowDown : function() {
		this._timerIds.length > 1 && clearInterval(this._timerIds.pop());
	},
	
	/// ����ͣ�󣩼�������
	go : function() {
		this._isPause = false;
	},
	
	/// ��ͣ����
	stay : function() {
		this._isPause = true;
	}
};


// ÿ���µ�����
var dayCountInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
/// ������
/// @param {Number} ��ݣ�Ĭ��Ϊ��ǰ���
/// @param {Number} �·ݣ�Ĭ��Ϊ��ǰ�·�
$.ui.Calendar = function(year, month) {
	this.constructor = arguments.callee;
	this.setDate(year, month);
};

// �����෽������
$.ui.Calendar.prototype = {

	/// ��ȡ���
	/// @return {Number} ���
	getYear : function () {
		return this._year;
	},
	
	/// ��ȡ�·�
	/// @return {Number} �·�
	getMonth : function() {
		return this._month + 1;
	},
	
	/// ��������
	/// @param {Number} �꣬Ĭ��Ϊ��ǰ���
	/// @param {Number} �£�Ĭ��Ϊ��ǰ�·�
	setDate : function(y, m) {
		var now = new Date();
		this._year = isNaN(y) ? now.getFullYear() : y;
		this._month = isNaN(m) ? now.getMonth() : m - 1;
	},
	
	/// ��ȡ��������
	/// @return {Object} ��������
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
		
		if (week.length % 7 !== 0) {	// ��ȫ����Ŀհ�
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

/// ��ȡָ����������
/// @param {Number} ���
/// @param {Number} �·�
/// @return {Number} ָ���·�����
$.ui.Calendar.getDayCount = function(y, m) {
	return 2 == m ?  (0 == y % 4 && 0 != y % 100 || 0 == y % 400 ? 29 : 28) : dayCountInMonths[m - 1];
};

})(window);