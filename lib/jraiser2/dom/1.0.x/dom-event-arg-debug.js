/*!
 * jRaiser 2 Javascript Library
 * dom-event-arg - v1.0.0 (2013-01-09T09:45:06+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define(function(require, exports, module) { 'use strict';

/**
 * 本模块提供事件参数类
 * @module dom/1.0.x/dom-event-arg
 * @catgory Infrastructure
 * @ignore
 */

var base = require('base/1.0.x/');


function returnFalse() { return false; }
function returnTrue() { return true; }


/**
 * 事件参数类
 * @class EventArg
 * @constructor
 * @exports
 * @param {Object|String} src 源事件对象或事件类型
 * @param {Object} [props] 要扩展的属性
 */
var EventArg = base.createClass(function(src, props) {
	var t = this;

	if (src && src.type) {
		t.originalEvent = src;
		t.type = src.type;

		t.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;
	} else {
		t.type = src;
	}

	if (props) {
		for (var p in props) {
			// 不复制方法
			if (typeof props[p] !== 'function') { t[p] = props[p]; }
		}
	}

	 // 生成时间戳
	t.timeStamp = src && src.timeStamp || +new Date;
}, {
	/**
	 * 阻止事件默认行为
	 * @method preventDefault
	 */
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if (!e) { return; }

		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	},

	/**
	 * 停止冒泡
	 * @method stopPropagation
	 */
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if (!e) { return; }

		if (e.stopPropagation) {
			e.stopPropagation();
		}

		e.cancelBubble = true;
	},

	/**
	 * 获取是否已阻止事件默认行为
	 * @method isDefaultPrevented
	 * @return {Boolean} 是否已阻止默认事件行为
	 */
	isDefaultPrevented: returnFalse,

	/**
	 * 获取是否已停止冒泡
	 * @method isPropagationStopped
	 * @return {Boolean} 是否已停止冒泡
	 */
	isPropagationStopped: returnFalse
});


module.exports = EventArg;

});