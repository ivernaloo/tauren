/*!
 * jRaiser 2 Javascript Library
 * dom-base - v1.0.0 (2013-01-09T09:43:02+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define(function(require, exports, module) { 'use strict';

/**
 * 本模块提供dom模块的基础接口
 * @module dom/1.0.x/dom-base
 * @catgory Infrastructure
 * @ignore
 */

var ID_ATTR_NAME = '_jRaiserNodeId_',	// 节点ID属性名
	autoId = 0,		// 节点ID递增值
	rMultiSpace = /\s+/;


return {
	/**
	 * 检查对象是否DOM节点
	 * @method isNode
	 * @param {Any} obj 待测对象
	 * @return {Boolean} 待测对象是否DOM节点
	 */
	isNode: function(obj) { return 'nodeType' in obj; },

	/**
	 * 检查节点是否XML节点
	 * @method isXMLNode
	 * @param {Element} node 节点
	 * @return {Boolean} 节点是否XML节点
	 */
	isXMLNode: function(node) {
		var docElt = (node.ownerDocument || node).documentElement;
		return docElt ? docElt.nodeName !== 'HTML' : false;
	},

	/**
	 * 检查对象是否window对象
	 * @method isWindow
	 * @param {Any} obj 待测对象
	 * @return {Boolean} 待测对象是否window对象
	 */
	isWindow: function(obj) { return obj != null && obj == obj.window; },

	/**
	 * 获取节点所在的window
	 * @param {Element} node
	 * @return {Window|Boolean} 节点所在的window。如果不存在，则返回false
	 */
	getWindow: function(node) {
		return this.isWindow(node) ? node :
			(node.nodeType === 9 ? node.defaultView || node.parentWindow : false);
	},

	/**
	 * 生成不重复的节点编号
	 * @method uniqueId
	 * @param {Element} node 节点
	 * @return {Number} 节点编号
	 */
	uniqueId: function(node) {
		// 在IE6-8，如果设置了一个值属性，则此属性会出现在innerHTML中，但对象属性则不会
		var id = node[ID_ATTR_NAME] = node[ID_ATTR_NAME] || new Number(++autoId);
		return id.valueOf();
	},

	/**
	 * 移除节点编号属性
	 * @param {Element} node 节点
	 */
	removeUniqueId: function(node) { delete node[ID_ATTR_NAME]; },

	/**
	 * 把指定字符串以（一个或多个）空格为分隔符分割为数组
	 * @method splitBySpace
	 * @param {String|Array<String>} val 字符串（如果传入数组，则不执行分割操作）
	 * @return {Array<String>} 如果数组的长度为0，则返回null，否则返回数组
	 */
	splitBySpace: function(val) {
		if (typeof val === 'string') { val = val.split(rMultiSpace); }

		return val == null || val.length === 0 ? null : val;
	}
};
	
});