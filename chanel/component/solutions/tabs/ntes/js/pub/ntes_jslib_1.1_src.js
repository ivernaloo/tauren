/*
 * NetEase Javascript Library v1.2.5
 *
 * Modified from
 *		jRaiser Javascript Library
 *		http://code.google.com/p/jraiser/
 *		Copyright 2008-2010 Heero.Luo (http://heeroluo.net/)
 *
 * licensed under MIT license
 *
 * Creation date: 2008/2/6
 * Modified date: 2010/7/29
 */
(function(window, undefined) {
 
var version = "1.2.5 Build 201007291456",	// 版本号
	globalName = "NTES";		// 全局标识符
 
// 防止重复加载
if (window[globalName] && window[globalName].version >= version) { return; }


var _$ = window.$,		// 记录当前框架，以便恢复
	document = window.document,

/// @overload 根据CSS选择器和上下文匹配出HTML元素
///		@param {String} CSS选择器
///		@param {HTMLElement,Array,HTMLCollection} 上下文
///		@return {HTMLElement,Array} 匹配到的经扩展的HTML元素
/// @overload 扩展HTML元素
///		@param {HTMLElement,Array,HTMLCollection} 要扩展的Html元素
///		@return {HTMLElement,Array} 经扩展的HTML元素
jRaiser = window[globalName] = window.$ = function(selector, context) {
	if (!selector) { return selector; }

	"string" === typeof selector && (selector = getElemsBySelector(selector, context));

	return extendElems(selector);
};

/// 根据上下文及CSS选择器获取结果集中的第一个元素
/// @param {String} CSS选择器
/// @param {HTMLElement,Array,HTMLCollection} 上下文
///	@return {HTMLElement} 匹配到的经扩展的HTML元素
jRaiser.one = function(selector, context) {
	return extendElems(getElemsBySelector(selector, context, 1));
};

/// 根据上下文及CSS选择器获取所有元素
/// @param {String} CSS选择器
/// @param {HTMLElement,Array,HTMLCollection} 上下文
///	@return {Array} 匹配到的经扩展的HTML元素数组
jRaiser.all = function(selector, context) {
	return extendElems(getElemsBySelector(selector, context, 0));
};

// 根据上下文及CSS选择器获取HTML元素
// @param {String} CSS选择器
// @param {HTMLElement,Array,HTMLCollection} 上下文
// @param {Number} 结果集数量限制：默认返回原结果；为1时只返回第一个元素；为0时把结果按数组形式返回
// @return {HTMLElement,Array} 匹配到的经扩展的HTML元素
function getElemsBySelector(selector, context, limit) {
	// 通过选择器解析引擎获取元素
	var result = selectorQuery.exec(selector, context || document);

	if (limit !== undefined) {
		if (result) {
			var isArray = jRaiser.util.isArray(result);
			if (1 === limit && isArray) {
				return result[0];
			} else if (0 === limit && !isArray) {
				return [result];
			}
		} else if (0 === limit) {
			return [];
		}
	}
	return result;
}

// 扩展HTML元素(数组)
// @param {HTMLElement,Array,HTMLCollection} 元素(数组)
// @return {HtmlElement,Array} 扩展后的元素
function extendElems(elems) {
	if (elems && !elems[globalName]) {
		if (elems.nodeType) {	// 扩展Html元素和非IE下的XML元素
			if ("unknown" !== typeof elems.getAttribute) {
				for (var p in jRaiser.element) {
					// 不覆盖原有的属性和方法
					undefined === elems[p] && (elems[p] = jRaiser.element[p]);
				}
			}
		} else {	// HTMLCollection Or Array
			elems = jRaiser.util.extend(jRaiser.util.toArray(elems), jRaiser.element);
		}
	}
	return elems;
}


/// 标识当前版本
jRaiser.version = version;


/// 恢复本类库对$和jRaiser全局变量的占用
/// @return {Object} jRaiser对象
jRaiser.resume = function() {
	_$ = window.$;
	window.$ = window[globalName] = jRaiser;
	return jRaiser;
};

/// 恢复最近一次本类库加载前或jRaiser.resume方法调用前的$变量
/// @return {Mixed} 原$变量
jRaiser.retire = function() {
	window.$ = _$;
	return _$;
};


// 用于特性检查的元素
var testElem = document.createElement("div");


testElem.innerHTML = "<p class='TEST'></p>";

// selectorQuery选择器解析引擎
var selectorQuery = {

	SPACE : /\s*([\s>~+,])\s*/g, // 用于去空格
	ISSIMPLE : /^#?[\w\u00c0-\uFFFF_-]+$/, 	// 判断是否简单选择器(只有id或tagname，不包括*)
	IMPLIEDALL : /([>\s~\+,]|^)([#\.\[:])/g, 	// 用于补全选择器
	ATTRVALUES : /=(["'])([^'"]*)\1]/g, 		// 用于替换引号括起来的属性值
	ATTR : /\[\s*([\w\u00c0-\uFFFF_-]+)\s*(?:(\S?\=)\s*(.*?))?\s*\]/g, // 用于替换属性选择器
	PSEUDOSEQ : /\(([^\(\)]*)\)$/g, 	// 用于匹配伪类选择器最后的序号
	BEGINIDAPART : /^(?:\*#([\w\u00c0-\uFFFF_-]+))/, 	// 用于分离开头的id选择器
	STANDARD : /^[>\s~\+:]/, 	// 判断是否标准选择器(以空格、>、~或+开头)
	STREAM : /[#\.>\s\[\]:~\+]+|[^#\.>\s\[\]:~\+]+/g, // 用于把选择器表达式分离成操作符/操作数 数组
	ISINT : /^\d+$/, // 判断是否整数
	
	// 判断是否使用浏览器的querySelectorAll
	enableQuerySelector : testElem.querySelectorAll && testElem.querySelectorAll(".TEST").length > 0,

	tempAttrValues : [], // 临时记录引号/双引号间的属性值
	tempAttrs: [], 	// 临时记录属性表达式

	idName : globalName + "UniqueId",
	id : 0,

	// 解析CSS选择器获取元素
	// @param {String} 选择器
	// @param {HTMLElement,Array,HTMLCollection} 上下文
	// @return {HTMLElement,Array,HTMLCollection} 匹配到的元素
	exec : function(selector, context) {

		var result, 	// 最后结果
			selectors, 	// selector数组
			selCount, 	// selector数组长度
			i, j, 		// 循环变量
			temp, 		// 临时搜索结果
			matchs, 	// 操作符/操作数 数组
			streamLen, 	// 操作符/操作数 数组长度
			token, 		// 操作符
			filter, 	// 操作数
			t = this;

		// 清除多余的空白
		selector = selector.trim();

		if ("" === selector) { return; }

		// 对简单选择符的优化操作
		if (t.ISSIMPLE.test(selector)) {
			if (0 === selector.indexOf("#") && typeof context.getElementById !== "undefined") {
				//alert("simple id: " + selector);	// @debug
				return t.getElemById(context, selector.substr(1));
			} else if (typeof context.getElementsByTagName !== "undefined") {
				//alert("simple tagname: " + selector);	// @debug
				return jRaiser.util.toArray(context.getElementsByTagName(selector));
			}
		}

		// 使用querySelectorAll
		if (t.enableQuerySelector && context.nodeType) {
			try {
				return jRaiser.util.toArray(context.querySelectorAll(selector));
			} catch (e) {

			}
		}

		// 转换成数组，统一处理
		context = context.nodeType ? [context] : jRaiser.util.toArray(context);

		selectors = selector.replace(t.SPACE, "$1")		// 去空白
						.replace(t.ATTRVALUES, t.analyzeAttrValues)	// 替换属性值
						.replace(t.ATTR, t.analyzeAttrs)	// 替换属性选择符
						.replace(t.IMPLIEDALL, "$1*$2")		// 添加必要的"*"(例如.class1 => *.class1)
						.split(",");	// 分离多个选择器
		selCount = selectors.length;

		i = -1; result = [];

		while (++i < selCount) {
			// 重置上下文
			temp = context;

			selector = selectors[i];

			if (t.BEGINIDAPART.test(selector)) {	// 优化以id选择器开头且上下文是document的情况
				if (typeof context[0].getElementById !== "undefined") {
					//alert("begin with id selector: " + RegExp.$1);	// @debug
					temp = [t.getElemById(context[0], RegExp.$1)];
					//alert("result: " + temp); // @debug
					if (!temp[0]) {
						continue;
					}
					selector = RegExp.rightContext;
				} else {	// 上下文不是document, 恢复常规查找
					selector = selectors[i];
				}
			}

			// 处理后续的部分
			if (selector !== "") {
				if (!t.STANDARD.test(selector)) {
					selector = " " + selector;
				}

				// 分离换成字符串数组，从0开始双数是操作符，单数是操作数(例如 " *.class1" => [" ", "*", ".", "class1"])
				matchs = selector.match(t.STREAM) || []; streamLen = matchs.length; j = 0;
				//alert("stream: " + matchs);	// @debug
				while (j < streamLen) {
					token = matchs[j++]; filter = matchs[j++];
					//alert(token + (this.operators[token] ? " is " : " is not ") + "exist"); 	// @debug
					//alert("filter: " + filter);	// @debug
					//alert("context: " + temp);	// @debug
					temp = t.operators[token] ? t.operators[token](temp, filter) : [];
					if (0 === temp.length) {
						break;
					}
				}
			}

			jRaiser.util.merge(result, temp);
		}

		// 清空临时数组
		t.tempAttrValues.length = t.tempAttrs.length = 0;

		return result.length > 1 ? t.unique(result) : result;
	},

	// 属性替换处理函数
	analyzeAttrs : function($1, $2, $3, $4) {
		return "[]" + (selectorQuery.tempAttrs.push([$2, $3, $4]) - 1);
	},

	// 属性值替换处理函数
	analyzeAttrValues : function($1, $2, $3) {
		return "=" + (selectorQuery.tempAttrValues.push($3) - 1) + "]";
	},

	// 获取不重复的元素id
	// @param {HTMLElement} 元素
	// @return {Number} id
	generateId : function(elem) {
		var idName = this.idName, id;
		try {
			id = elem[idName] = elem[idName] || new Number(++this.id);
		} catch (e) {
			id = elem.getAttribute(idName);
			if (!id) {
				id = new Number(++this.id);
				elem.setAttribute(idName, id);
			}
		}
		return id.valueOf();
	},

	// 去除数组中的重复元素
	// @param {Array} 元素数组
	// @return {Array} 已去重复的元素数组
	unique : function(elems) {
		var result = [], i = 0, flags = {}, elem, id;
		while (elem = elems[i++]) {
			if (1 === elem.nodeType) {
				id = this.generateId(elem);
				if (!flags[id]) {
					flags[id] = true;
					result.push(elem);
				}
			}
		}
		return result;
	},

	// 属性名映射
	attrMap : {
		"class" : "className",
		"for" : "htmlFor"
	},

	// 获取元素属性
	// @param {HTMLElement} 元素
	// @param {String} 属性名
	// @return {String} 属性值
	getAttribute : function(elem, attrName) {
		var trueName = this.attrMap[attrName] || attrName, attrValue = elem[trueName];
		if ("string" !== typeof attrValue) {
			if ("undefined" !== typeof elem.getAttributeNode) {
				attrValue = elem.getAttributeNode(attrName);
				attrValue = undefined == attrValue ? attrValue : attrValue.value;
			} else if (elem.attributes) {		// for IE5.5
				attrValue = String(elem.attributes[attrName]);
			}
		}
		return null == attrValue ? "" : attrValue;
	},

	// 通过id获取元素
	// @param {HTMLElement} 上下文，一般是document
	// @param {String} id
	// @return {HTMLElement} 元素
	getElemById : function(context, id) {
		var result = context.getElementById(id);
		if (result && result.id !== id && context.all) {	// 修复IE下的id/name bug
			result = context.all[id];
			if (result) {
			    result.nodeType && (result = [result]);
				for (var i = 0; i < result.length; i++) {
					if (this.getAttribute(result[i], "id") === id) {
					    return result[i];
				    }
			    }
			}
		} else {
			return result;
		}
	},

	// 搜索指定位置的某标签名元素
	// @param {Array} 上下文
	// @param {String} 第一个元素相对位置
	// @param {String} 下一个元素相对位置
	// @param {String} 标签名
	// @param {Number} 最多进行多少次查找
	// @return {Array} 搜索结果
	getElemsByTagName : function(context, first, next, tagName, limit) {
		var result = [], i = -1, len = context.length, elem, counter, tagNameUpper;
		tagName !== "*" && (tagNameUpper = tagName.toUpperCase());

		while (++i < len) {
			elem = context[i][first]; counter = 0;
			while (elem && (!limit || counter < limit)) {
				if (1 === elem.nodeType) {
					(elem.nodeName.toUpperCase() === tagNameUpper || !tagNameUpper) && result.push(elem);
					counter++;
				}
				elem = elem[next];
			}
		}

		return result;
	},

	// 根据指定顺序检查上下文父元素的第n个子元素是否该上下文元素
	// @param {Array} 上下文
	// @param {Number} 序号
	// @param {String} 第一个元素相对位置
	// @param {String} 下一个元素相对位置
	// @return {Array} 搜索结果
	checkElemPosition : function(context, seq, first, next) {
		var result = [];
		if (!isNaN(seq)) {
			var len = context.length, i = -1,
				cache = {},		// 节点缓存
				parent, id, current, child;
				
			while (++i < len) {
				parent = context[i].parentNode;		// 找到父节点
				id = this.generateId(parent);		// 为父节点生成一个id作为缓存键值
				
				if (undefined === cache[id]) {	// 如果缓存中没有，则重新寻找父元素的第N个子元素
					current = 0;			// 重置当前序号
					child = parent[first];	// 第一个元素
					while (child) {
						1 === child.nodeType && current++;	// 序号加1
						if (current < seq) {
							child = child[next];	// 还没到指定序号，继续找
						} else {
							break;	// 已经到指定序号，中断循环
						}
					}
					cache[id] = child || 0;		// 记下本次搜索结果
				} else {
					child = cache[id];
				}
				context[i] === child && result.push(context[i]);	// 搜索结果与节点相符
			}
		}
		return result;
	},
	
	// 获取特定位置的元素
	// @param {Array} 上下文
	// @param {Number} 第一个位置
	// @param {Number} 下一个位置递增量
	// @return {Array} 过滤结果
	getElemsByPosition : function(context, first, next) {
		var i = first, len = context.length, result = [];
		while (i >= 0 && i < len) {
			result.push(context[i]);
			i += next;
		}
		return result;
	},

	// 根据属性值过滤元素
	// @param {Array} 上下文
	// @param {Array} 属性数组
	// @return {Array} 过滤结果
	getElemsByAttribute : function(context, filter) {
		var result = [], elem, i = 0,
			check = this.attrOperators[filter[1] || ""],
			attrValue = "~=" === filter[1] ? " " + filter[2] + " " : filter[2];
		if (check) {
			while (elem = context[i++]) {
				check(this.getAttribute(elem, filter[0]), attrValue) && result.push(elem);
			}
		}
		return result;
	},

	// 操作符
	operators : {

		// id选择符
		"#" : function(context, id) {
			return selectorQuery.getElemsByAttribute(context, ["id", "=", id]);
		},

		// 后代选择符
		" " : function(context, tagName) {
			var len = context.length;
			if (1 === len) {
				return context[0].getElementsByTagName(tagName);
			} else {
				var result = [], i = -1;
				while (++i < len) {
					jRaiser.util.merge(result, context[i].getElementsByTagName(tagName));
				}
				return result;
			}
		},

		// 类名选择器
		"." : function(context, className) {
			return selectorQuery.getElemsByAttribute(context, ["class", "~=", className]);
		},

		// 子元素选择符
		">" : function(context, tagName) {
			return selectorQuery.getElemsByTagName(context, "firstChild", "nextSibling", tagName);
		},

		// 同级元素选择符
		"+" : function(context, tagName) {
			return selectorQuery.getElemsByTagName(context, "nextSibling", "nextSibling", tagName, 1);
		},

		// 同级元素选择符
		"~" : function(context, tagName) {
			return selectorQuery.getElemsByTagName(context, "nextSibling", "nextSibling", tagName);
		},

		// 属性选择符
		"[]" : function(context, filter) {
			filter = selectorQuery.tempAttrs[filter];
			if (filter) {
				if (selectorQuery.ISINT.test(filter[2])) {
					filter[2] = selectorQuery.tempAttrValues[filter[2]];
				}
				return selectorQuery.getElemsByAttribute(context, filter);
			} else {
				return context;
			}
		},

		// 伪类选择符
		":" : function(context, filter) {
			var seq;
			if (selectorQuery.PSEUDOSEQ.test(filter)) {
				seq = parseInt(RegExp.$1);
				filter = RegExp.leftContext;
			}
			return selectorQuery.pseOperators[filter] ? selectorQuery.pseOperators[filter](context, seq) : [];
		}
	},

	// 属性操作符
	attrOperators : {

		// 是否包含指定属性值
		"" : function(value) { return value !== ""; },

		// 是否与指定属性值相等
		"=" : function(value, input) { return input === value; },

		// 是否包含指定属性值
		"~=" : function(value, input) { return (" " + value + " ").indexOf(input) >= 0; },

		// 是否与指定属性值不等
		"!=" : function(value, input) { return input !== value; },
		
		// 属性值是否以某段字符串开头
		"^=" : function(value, input) { return value.indexOf(input) === 0; },

		// 属性值是否以某段字符串结尾
		"$=" : function(value, input) { return value.substr(value.length - input.length) === input; },

		// 属性值是否包含某段子字符串
		"*=" : function(value, input) { return value.indexOf(input) >= 0; }
	},

	// 伪类选择符
	pseOperators : {

		// 获取第一个子元素
		"first-child" : function(context) {
			return selectorQuery.checkElemPosition(context, 1, "firstChild", "nextSibling");
		},

		// 获取第n个子元素
		"nth-child" : function(context, seq) {
			return selectorQuery.checkElemPosition(context, seq, "firstChild", "nextSibling");
		},

		// 获取最后一个子元素
		"last-child" : function(context) {
			return selectorQuery.checkElemPosition(context, 1, "lastChild", "previousSibling");
		},

		// 获取倒数第n个子元素
		"nth-last-child" : function(context, seq) {
			return selectorQuery.checkElemPosition(context, seq, "lastChild", "previousSibling");
		},
		
		// 获取第奇数个元素
		"odd" : function(context) {
			return selectorQuery.getElemsByPosition(context, 0, 2);
		},
		
		// 获取第偶数个元素
		"even": function(context) {
			return selectorQuery.getElemsByPosition(context, 1, 2);
		},
		
		// 获取第N个元素前的元素
		"lt" : function(context, seq) {
			return selectorQuery.getElemsByPosition(context, seq - 1, -1);
		},
		
		// 获取第N个元素后的元素
		"gt" : function(context, seq) {
			return selectorQuery.getElemsByPosition(context, seq + 1, 1);
		}
	}
};


// HTML元素扩展操作，用于继承
jRaiser.element = {
	
	/// 获取指定序号的元素
	/// @param {Number} 序号
	/// @return {HTMLElement} 元素
	get : function(i) {
		return this.nodeType === undefined ? this[i] : (0 == i ? this : undefined);
	},
	
	/// @overload 获取指定序号并经过扩展的元素
	/// 	@param {Number} 序号索引
	///		@return {HTMLElement} 指定序号并经过扩展的元素
	/// @overload 以当前元素为上下文通过CSS选择器获取元素
	///		@param {String} CSS选择器
	///		@return {HTMLElement,Array} 匹配到的经扩展的HTML元素
	$ : function(selector) {
		return jRaiser("number" === typeof selector ? this.get(selector) : selector, this);
	},

	/// 检查当前元素是否包含某些样式类
	/// @param {String} 样式类名
	/// @return {Boolean} 元素是否包含某个样式类
	hasClass : function(className) { return jRaiser.style.hasClass(this, className); },

	/// 添加样式
	/// @param {String,Object} 类名或样式，多个类名用空格隔开
	/// @return {HTMLElement,Array} 当前元素
	addCss : function(css) { return jRaiser.style.addCss(this, css); },

	/// 移除样式
	/// @param {String,Object} 类名或样式，多个类名用空格隔开
	/// @return {HTMLElement,Array} 当前元素
	removeCss : function(css) { return jRaiser.style.removeCss(this, css); },

	/// 添加事件委托函数
	/// @param {String} 事件名，多个事件用逗号隔开
	/// @param {Function} 事件委托函数
	/// @param {Mixed} 额外数据
	/// @return {HTMLElement,Array} 当前元素
	addEvent : function(eventName, handler, data) {
		return jRaiser.event.addEvent(this, eventName, handler, data);
	},

	/// 移除事件委托函数
	/// @param {String} 事件名，多个事件用逗号隔开
	/// @param {Function} 事件委托函数
	/// @return {HTMLElement,Array} 当前元素
	removeEvent : function(eventName, handler) {
		return jRaiser.event.removeEvent(this, eventName, handler);
	},

	/// @overload 获取当前元素的属性值
	///		@param {String} 属性名
	///		@return {Mixed} 属性值
	/// @overload 设置当前元素的属性值
	///		@param {String} 属性名
	///		@param {String,Function} 属性值或用于计算属性值的函数
	///		@return {HTMLElement,Array} 当前元素
	attr : function(name, value) {
		var t = this;
		name = selectorQuery.attrMap[name] || name;
		if (value !== undefined) {
			return jRaiser.dom.eachNode(t, function(name, value) {
				this[name] = jRaiser.util.isFunction(value) ? value.call(this) : value;
			}, arguments);
		} else {
			var elem = this.get(0);
			return elem ? elem[name] : undefined;
		}
	},
	
	/// 对每个节点执行特定操作
	/// @param {Function} 要执行的操作
	/// @return {HTMLElement, Array} 当前元素
	each : function(callback) {
		return jRaiser.dom.eachNode(this, callback);
	}
};
jRaiser.element[globalName] = jRaiser.element.$;


// window对象、document对象的添加、移除事件方法
window.addEvent = document.addEvent = jRaiser.element.addEvent;
window.removeEvent = document.removeEvent = jRaiser.element.removeEvent;


var tplCache = {},		// 模板缓存
	slice = Array.prototype.slice,
	toString = Object.prototype.toString;	// 简写toString

/// 工具类、工具函数
jRaiser.util = {
	
	/// 检查变量是否Array类型
	/// @param {Mixed} 待测变量
	/// @return {Boolean} 待测变量是否Array类型
	isArray : function(value) { return toString.call(value) === "[object Array]"; },
	
	/// 检查变量是否函数类型
	/// @param {Mixed} 待测变量
	/// @return {Boolean} 待测变量是否Function类型
	isFunction : function(value) { return toString.call(value) === "[object Function]"; },

	/// 把集合转换为数组
	/// @param {Array,Collection} 数组或集合
	/// @return {Array} 数组
	toArray : function(col) {
		if (jRaiser.util.isArray(col)) { return col; }

		var arr;
		try {
			arr = slice.call(col);
		} catch (e) {
			arr = [];
			var i = col.length;
			while (i) {
				arr[--i] = col[i];
			}
		}
		return arr;
	},

	/// 合并数组
	/// @param {Array} 目标数组
	/// @param {Array,Collection} 源数组
	/// @return {Array} 混合后的目标数组
	merge : function(first, second) {
		var i = second.length, pos = first.length;
		while (--i >= 0) {
			first[pos + i] = second[i];
		}
		return first;
	},

	/// 模板转换
	/// @param {String} 模板代码
	/// @param {Object} 值集合
	/// @param {Boolean} 是否缓存模板，默认为是
	/// @return {String} 转换后的代码
	parseTpl : function(tpl, values, isCached) {
		if (null == tpl) { return; }
		if (null == values) { return tpl; }
		
		var fn = tplCache[tpl];
		if (!fn) {
			fn = new Function("obj", "var _=[];with(obj){_.push('" +
					tpl.replace(/[\r\t\n]/g, " ")
					.replace(/'(?=[^#]*#>)/g, "\t")
					.split("'").join("\\'")
					.split("\t").join("'")
					.replace(/<#=(.+?)#>/g, "',$1,'")
					.split("<#").join("');")
					.split("#>").join("_.push('")
					+ "');}return _.join('');");
			isCached !== false && (tplCache[tpl] = fn);
		}
		
		return fn(values);
	},

	/// 把源对象的属性和方法扩展到目标对象上
	/// @param {Mixed} 目标对象
	/// @param {Mixed} 源对象
	/// @return {Mixed} 已扩展的目标对象
	extend : function(des, src) {
		for (var p in src) {
			des[p] = src[p];
		}
		return des;
	},

	/// 遍历数组或对象，对每个成员执行某个方法
	/// @param {Mixed} 数组或对象
	/// @param {Function} 回调函数
	/// @param {Array} 额外参数
	/// @return {Mixed} 原数组或对象
	each : function(obj, callback, args) {
		var i = -1, len = obj.length,
			isObj = len === undefined || jRaiser.util.isFunction(obj);

		if (args) {
			if (isObj) {
				for (i in obj ) {
					if (false === callback.apply(obj[i], args)) {
						break;
					}
				}
			} else {
				while (++i < len) {
					if (false === callback.apply(obj[i], args)) {
						break;
					}
				}
			}
		} else {
			if (isObj) {
				for (i in obj) {
					if (false === callback.call(obj[i], i, obj[i])) {
						break;
					}
				}
			} else {
				while (++i < len) {
					if (false === callback.call(obj[i], i, obj[i])) {
						break;
					}
				}
			}
		}
		
		return obj;
	}
};
// 快速访问
jRaiser.parseTpl = jRaiser.util.parseTpl;
jRaiser.each = jRaiser.util.each;


var readyList = [],		// DOM Ready函数队列
	isReadyBound,		// 是否已绑定DOM Ready事件
	onDomReady;

if (document.addEventListener) {
	onDomReady = function() {
		document.removeEventListener("DOMContentLoaded", onDomReady, false);
		domReadyNow();
	};
} else if (document.attachEvent) {	// For IE Only
	onDomReady = function() {
		if ("complete" === document.readyState) {
			document.detachEvent("onreadystatechange", onDomReady);
			domReadyNow();
		}
	};
}

// DOM Ready检查 For IE
function doScrollCheck() {
	if (jRaiser.dom.isReady) { return; }

	try {
		document.documentElement.doScroll("left");
	} catch (e) {
		setTimeout(doScrollCheck, 1);
		return;
	}

	domReadyNow();
}
// DOM已就绪
function domReadyNow() {
	if (!jRaiser.dom.isReady) {
		if (!document.body) { return setTimeout(domReadyNow, 13); }

		jRaiser.dom.isReady = true;

		if (readyList) {
			var i = -1, len = readyList.length;
			while (++i < len) {
				readyList[i].call(document, jRaiser);	
			}
			readyList = null;
		}
	}
}
// 绑定DOMReady事件
function bindReady() {
	if (isReadyBound) { return; }

	if ("complete" === document.readyState) { return domReadyNow(); }

	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", domReadyNow, false);
		window.addEventListener("load", domReadyNow, false);
	} else if (document.attachEvent) {
		document.attachEvent("onreadystatechange", domReadyNow);
		window.attachEvent("onload", domReadyNow);
		var isTopLevel;
		try {
			isTopLevel = window.frameElement == null;
		} catch(e) {}

		document.documentElement.doScroll && isTopLevel && doScrollCheck();
	}

	isReadyBound = true;
}


/// DOM操作
jRaiser.dom = {
	
	/// 把节点放到数组容器中
	/// @param {HTMLElement,HTMLCollection,Array} 节点或节点集合
	/// @return {Array} 节点数组
	wrapByArray : function(nodes) {
		if (nodes) {
			if (nodes.nodeType !== undefined || nodes.setInterval) {
				return [nodes];
			} else if (nodes.length) {
				return jRaiser.util.toArray(nodes);
			}
		}
		return [];
	},

	/// 对节点执行指定操作
	/// @param {HTMLElement,Array,HTMLCollection} 节点
	/// @param {Function} 回调函数
	/// @param {Array} 额外的参数
	/// @return {HTMLElement,Array,HTMLCollection} 指定节点
	eachNode : function(nodes, callback, args) {
		jRaiser.each(jRaiser.dom.wrapByArray(nodes), callback, args);
		return nodes;
	},

	/// 在DOM就绪时执行指定函数
	/// @param {Function} 指定函数
	/// @param {Object} 当前对象
	ready : function(fn) {
		// 绑定事件
		bindReady();

		if (jRaiser.dom.isReady) {
			fn.call(document, jRaiser);
		} else {
			readyList.push(fn);
		}

		return this;
	}
};
// 快速访问
jRaiser.ready = jRaiser.dom.ready;


// 对CSS样式字符串进行解释的正则表达式
var CSSSPACE = /\s*([:;])\s*/g,
	STYLENAME = /[^:;]+?(?=:)/g,
	STYLESPLITER = /[^:;]+/g,
	CLASSSPLITER = /[^\s]+/g,
	FIXCSSNAME = /-([a-z])/gi,
	FLOATNAME = testElem.style.styleFloat !== undefined ? "styleFloat" : "cssFloat",
	ISFLOAT = /^float$/i;
	
// 添加样式类
function addClasses(classes, len, str) {
	if (this.className) {
		var className = " " + this.className + " ", i = -1;
		while (++i < len) {
			-1 === className.indexOf(" " + classes[i] + " ") && (className += (classes[i] + " "));
		}
		this.className = className.trim();
	} else {
		this.className = str;
	}
}
// 删除样式类
function removeClasses(classes, len, str) {
	switch (this.className) {
		case str:
			this.className = "";
		break;

		case "":
			return;
		break;
		
		default:
			var className = " " + this.className + " ", i = -1;
			while (++i < len) {
				className = className.replace(" " + classes[i] + " ", " ");
			}
			this.className = className.trim();
		break;
	}
}
// 添加样式
function addStyles(styles, str) {
	if ("" === this.style.cssText && "string" === typeof str) {
		this.style.cssText = str;
	} else {
		for (var s in styles) {
			this.style[s] !== undefined && (this.style[s] = styles[s]);
		}
	}
}

/// 样式控制
jRaiser.style = {
	
	/// 把样式名转换成样式属性名
	/// @param {String} 样式名
	/// @return {String} 样式属性名
	fixStyleName : function(name) {
		return ISFLOAT.test(name) ? FLOATNAME : name.replace(FIXCSSNAME, function($0, $1) {
			return $1.toUpperCase();	// 转换为js标准的样式名
		});
	},
	
	/// 检查指定元素是否包含某些样式类
	/// @param {HTMLElement,HTMLCollection,Array} 指定元素
	/// @param {String} 样式类名
	/// @return {Boolean} 元素是否包含某个样式类
	hasClass : function(elems, className) {
		elems = jRaiser.dom.wrapByArray(elems);
		var i = elems.length;
		if (i > 0) {
			className = " " + className + " ";
			while (--i >= 0) {
				if ((" " + elems[i].className + " ").indexOf(className) >= 0) {
					return true;
				}
			}
		}
		return false;
	},

	// 识别CSS样式
	// @param {String,Object} 样式
	// @return {Array} 标记了样式类型的样式流
	parse : function(css) {
		if ("string" === typeof css) {
			var hasSemi = css.indexOf(";") >= 0, hasColon = css.indexOf(":") >= 0, result;
			if (hasSemi || hasColon) {
				result = {};
				css = css.trim()
					.replace(CSSSPACE, "$1")
					.replace(hasColon ? STYLENAME : STYLESPLITER, jRaiser.style.fixStyleName)
					.match(STYLESPLITER);
				var len = css.length, i = 0;
				if (hasColon) {
					if (len % 2 !== 0) {
						throw "invalid inline style";
					}
					while (i < len) {
						result[css[i++]] = css[i++];
					}
				} else {
					while (i < len) {
						result[css[i++]] = "";
					}
				}
			} else {
				result = css.match(CLASSSPLITER) || [];
			}

			return result;
		}

		return css;
	},

	/// 为指定HTML元素添加样式
	/// @param {HTMLElement,Array,HTMLCollection} 指定元素
	/// @param {String,Object} 样式
	/// @return {HTMLElement,Array,HTMLCollection} 指定元素
	addCss : function(elems, css) {
		var result = jRaiser.style.parse(css);
		if (jRaiser.util.isArray(result)) {
			jRaiser.dom.eachNode(elems, addClasses, [result, result.length, css]);
		} else {
			jRaiser.dom.eachNode(elems, addStyles, [result, css]);
		}
		return elems;
	},

	/// 为指定HTML元素移除样式
	/// @param {HTMLElement,Array,HTMLCollection} 指定元素
	/// @param {String,Object} 样式
	/// @return {HTMLElement,Array,HTMLCollection} 指定元素
	removeCss : function(elems, css) {
		var result = jRaiser.style.parse(css);
		if (jRaiser.util.isArray(result)) {
			jRaiser.dom.eachNode(elems, removeClasses, [result, result.length, css]);
		} else {
			jRaiser.dom.eachNode(elems, addStyles, [result, css]);
		}
		return elems;
	},
	
	/// 获取指定元素的当前样式
	/// @param {HTMLElement,Array,HTMLCollection} 指定元素
	/// @param {String} 样式名
	/// @param {Object} 元素所在的页面的window对象，默认为当前window对象
	/// @return {String} 样式值
	getCurrentStyle : function(node, styleName, w) {
		if (!node) { return undefined; }

		!node.nodeType && (node = node[0]);
		styleName = jRaiser.style.fixStyleName(styleName);

		return node.style[styleName] ||
			( (node.currentStyle || (w || window).getComputedStyle(node, null))[styleName] );
	}
};


// 添加事件
function newEvent(eventName, handler, data) {
	var t = this;
	handler = jRaiser.event.delegate(t, eventName, handler, data);
	if (t.attachEvent) {
		t.attachEvent("on" + eventName, handler);
	} else if (t.addEventListener) {
		t.addEventListener(eventName, handler, false);
	}
}
// 移除事件
function disposeEvent(eventName, handler) {
	var t = this;
	handler = jRaiser.event.getDelegate(t, eventName, handler);
	if (t.detachEvent) {
		t.detachEvent("on" + eventName, handler);
	} else if (t.removeEventListener) {
		t.removeEventListener(eventName, handler, false);
	}
}

var EVENTSPLITER = /\s*,\s*/,	// 事件名分隔符
	eventId = 0;	// 事件编号基值

/// 事件处理
jRaiser.event = {
	
	/// 事件Id属性名
	idName : globalName + "EventId",

	/// 事件容器名
	eventSpace : globalName + "Events",

	/// 为指定HTML元素添加事件委托函数
	/// @param {HTMLElement,Array,HTMLCollection} 指定元素
	/// @param {String} 事件名，多个事件名用逗号隔开
	/// @param {Function} 事件委托函数
	/// @param {Object} 额外传入的数据
	/// @return {HTMLElement,Array,HTMLCollection} 指定元素
	addEvent : function(elems, eventNames, handler, data) {
		eventNames = eventNames.split(EVENTSPLITER);
		var i = eventNames.length;
		while (--i >= 0) {
			jRaiser.dom.eachNode(elems, newEvent, [eventNames[i], handler, data]);
		}
		return elems;
	},

	/// 为指定HTML元素移除事件委托函数
	/// @param {HTMLElement,Array,HTMLCollection} 指定元素
	/// @param {String} 事件名，多个事件名用逗号隔开
	/// @param {Function} 事件处理函数
	/// @return {HTMLElement,Array,HTMLCollection} 指定元素
	removeEvent : function(elems, eventNames, handler) {
		eventNames = eventNames.split(EVENTSPLITER);
		var i = eventNames.length;
		while (--i >= 0) {
			jRaiser.dom.eachNode(elems, disposeEvent, [eventNames[i], handler]);
		}
		return elems;
	},

	/// 生成事件代理
	/// @param {HTMLElement} 元素
	/// @param {String} 事件名
	/// @param {Function} 事件处理函数
	/// @param {Object} 额外传入的数据
	/// @return {Function} 事件代理
	delegate : function(elem, eventName, handler, data) {
		var t = jRaiser.event, events = elem[t.eventSpace] = elem[t.eventSpace] || {}, 	// 取得事件Hash表引用
			id = handler[t.idName] = handler[t.idName] || ++eventId; 	// 获取不重复的事件编号
		// 生成特定事件Hash表
		events[eventName] = events[eventName] || {};

		var trueHandler = events[eventName][id];
		if (!trueHandler) {
			trueHandler = function(e) {
				e = t.fix(e);
				var temp = handler.call(elem, e, data);
				false === temp && e.preventDefault();
				return temp;
			};
			events[eventName][id] = trueHandler;
		}

		return trueHandler;
	},

	/// 获取事件代理
	/// @param {HTMLElement} 元素
	/// @param {String} 事件名
	/// @param {Function} 事件处理函数
	/// @return {Function} 事件代理
	getDelegate : function(elem, eventName, handler) {
		var t = jRaiser.event;
		try {
			return elem[t.eventSpace][eventName][handler[t.idName]];
		} catch (e) {

		}
		return handler;
	},

	/// 修复不同浏览器的事件兼容性
	/// @param {Event} 事件对象
	/// @return {Event} 修复后的事件对象
	fix : function(e) {
		!e.target && (e.target = e.srcElement || document);
		3 == e.target.nodeType && (e.target = e.target.parentNode);
		null == e.timeStamp && (e.timeStamp = Date.now());
		e.preventDefault = e.preventDefault || function() { this.returnValue = false; };
		e.stopPropagation = e.stopPropagation || function() { this.cancelBubble = true; };
		
		if (undefined === e.pageX && undefined !== e.clientX) {
			var doc = document.documentElement, body = document.body;
			e.pageX = e.clientX + (doc.scrollLeft || body.scrollLeft || 0) - (doc.clientLeft || 0);
			e.pageY = e.clientY + (doc.scrollTop || body.scrollTop || 0) - (doc.clientTop || 0);
		}
		
		// 键盘按键事件
		if (!e.which && ((e.charCode || e.charCode === 0) ? e.charCode : e.keyCode)) {
			e.which = e.charCode || e.keyCode;
		}

		// 鼠标单击事件：1 == 左键; 2 == 中键; 3 == 右键
		if (!e.which && e.button !== undefined) {
			e.which = (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));
		}

		return e;
	}
};


// 浏览器检测
var ua = window.navigator.userAgent.toLowerCase(), browserMatch =
	/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
	/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
	/(msie) ([\w.]+)/.exec( ua ) ||
	!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(window.navigator.userAgent.toLowerCase());
jRaiser.browser = {};
if (browserMatch) {
	jRaiser.browser[browserMatch[1] || ""] = true;
	jRaiser.browser.version = browserMatch[2] || "0";
}


/// Ajax操作
jRaiser.ajax = {

	/// 创建XmlHttpRequest对象
	/// @return {XMLHttpRequest} XmlHttpRequest对象
	createXhr : function() {
		var xhr;
		try {
			xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		} catch (e) { }
		if (!xhr) {
			throw "failed to create XMLHttpRequest object";
		}
		return xhr;
	},

	/// 发送Ajax请求
	/// @param {String} 请求地址
	/// @param {String} 发送方式，"GET"或"POST"，默认为GET
	/// @param {Object} 发送的数据
	/// @param {Object} 其他可选参数
	/// @param {XMLHttpRequest} 用于发送请求的XmlHttpRequest对象，如不指定则自动创建
	/// @return {XMLHttpRequest} XmlHttpRequest对象
	send : function(url, method, data, options, xhr) {
		// 创建XMLHttpRequest对象
		xhr = xhr || jRaiser.ajax.createXhr();
		var hasCompleted;
		
		// 修正参数
		"string" === typeof method && (method = method.toUpperCase());
		method = method !== "GET" && method !== "POST" ? "GET" : method;		// 默认为GET
		options = options || {};
		options.async = "boolean" === typeof options.async ? options.async : true;
		
		// 连接参数键值对
		var postData;
		if (data) {
			postData = [];
			for (var d in data) {
				data[d] != null && postData.push(d + "=" + encodeURIComponent(data[d]));
			}
			postData = postData.join("&").replace(/%20/g, "+");
			if ("GET" === method) {
				url += ("?" + postData);
				postData = undefined;
			}
		}
		
		// 超时处理(异步处理时才有效)
		options.async && !isNaN(options.timeout) && options.timeout > 0 && setTimeout(function() {
			if (!hasCompleted) {
				xhr.abort();
				options.onTimeout && options.onTimeout(xhr);
			}
		}, options.timeout);
		
		// 设定状态变换时的事件
		xhr.onreadystatechange = function() {
			if (4 == xhr.readyState) {
				hasCompleted = true;
				var eventName = 200 == xhr.status ? "onSuccess" : "onError";
				options[eventName] && options[eventName](xhr);
			}
		};
		
		// 打开连接并发送数据
		xhr.open(method, url, options.async, options.username, options.password);
		
		var contentType = [];
		"POST" === method && contentType.push("application/x-www-form-urlencoded");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		// 设置header
		if (options.headers) {
			for (var h in options.headers) {
				if ("content-type" === h.toLowerCase()) {
					contentType.push(options.headers[h]);
				} else {
					xhr.setRequestHeader(h, options.headers[h]);
				}
			}
		}
		contentType.length &&
			xhr.setRequestHeader("Content-Type", contentType.join(";").replace(/;+/g, ";").replace(/;$/, ""));
		
		xhr.send(postData);
		return xhr;
	},

	/// 动态加载外部Javascript文件
	/// @param {String} 文件地址
	/// @param {Function} 加载完成后执行的回调函数
	/// @param {String} 编码
	/// @param {Object} 文档对象，默认为当前文档
	importJs : function(url, onComplete, charset, doc) {
		doc = doc || document;
		
		var script = doc.createElement("script");
		script.language = "javascript"; script.type = "text/javascript";
		charset && (script.charset = charset);

		// 读取完后的操作
		script.onload = script.onreadystatechange = function() {
			if (!script.readyState || "loaded" == script.readyState || "complete" == script.readyState) {
				onComplete && onComplete();
				script.onload = script.onreadystatechange = null;
				script.parentNode.removeChild(script);
			}
		};
		
		script.src = url;
		jRaiser.one("head", doc).appendChild(script);
	}
};


// Cookie过期时间格式
var EXPIRESWITHUNIT = /[smhdMy]$/,
	TIMEUNITS = {
		s : 1,
		m : 60,
		h : 60 * 60,
		d : 24 * 60 * 60,
		M : 30 * 24 * 60 * 60,
		y : 365 * 24 * 60 * 60
	};

/// Cookie操作
jRaiser.cookie = {
	
	/// 编码函数
	encoder : window.encodeURIComponent,
	
	/// 解码函数
	decoder : window.decodeURIComponent,

	/// 获取Cookie值
	/// @param {String} Cookie名
	/// @param {Boolean} noUndefined 是否允许返回undefined
	/// @return {String} Cookie值
	get : function(name, allowUndefined) {
		var t = jRaiser.cookie;
		name = t.encoder(name) + "=";
		var cookie = document.cookie, beginPos = cookie.indexOf(name), endPos;
		if (-1 === beginPos) {
			return allowUndefined ? undefined : "";
		}
		beginPos += name.length; endPos = cookie.indexOf(";", beginPos);
		if (endPos === -1) {
			endPos = cookie.length;
		}
		return t.decoder(cookie.substring(beginPos, endPos));
	},

	/// 写入Cookie值
	/// @param {String} Cookie名
	/// @param {Mixed} Cookie值
	/// @param {Number,Date,String} 过期时间
	/// @param {String} 域，默认为当前页
	/// @param {String} 路径，默认为当前路径
	/// @param {Boolean} 是否仅把Cookie发送给受保护的服务器连接(https)，默认为否
	set : function(name, value, expires, domain, path, secure) {
		var t = jRaiser.cookie, cookieStr = [t.encoder(name) + "=" + t.encoder(value)];
		if (expires) {
			var date, unit;
			if ("[object Date]" === toString.call(expires)) {
				date = expires;
			} else {
				if ("string" === typeof expires && EXPIRESWITHUNIT.test(expires)) {
					expires = expires.substring(0, expires.length - 1);
					unit = RegExp.lastMatch;
				}
				if (!isNaN(expires)) {
					date = new Date();
					date.setTime(date.getTime() + expires * TIMEUNITS[unit || "m"] * 1000);
				}
			}
			date && cookieStr.push("expires=" + date.toUTCString());
		}
		path && cookieStr.push("path=" + path);
		domain && cookieStr.push("domain=" + domain);
		secure && cookieStr.push("secure");
		document.cookie = cookieStr.join(";");
	},

	/// 删除Cookie
	/// @param {String} Cookie名
	/// @param {String} 域
	/// @param {String} 路径
	del : function(name, domain, path) {
		document.cookie = jRaiser.cookie.encoder(name) + "=" + (path ? ";path=" + path : "") + (domain ? ";domain=" + domain : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
	}
};


var whiteSpaces = /^\s+|\s+$/g;
/// 去掉当前字符串两端的某段字符串
/// @param {String} 要去掉的字符串，默认为空白
/// @return {String} 修整后的字符串
!String.prototype.trim && (String.prototype.trim = function() { return this.replace(whiteSpaces, ""); });

/// 从左边开始截取一定长度的子字符串
/// @param {Number} 长度
/// @return {String} 子字符串
String.prototype.left = function(n) { return this.substr(0, n); };

/// 从右边开始截取一定长度的子字符串
/// @param {Number} 长度
/// @return {String} 子字符串
String.prototype.right = function(n) { return this.slice(-n); };

/// 格式化字符串
/// @param {String} 要格式化的字符串
/// @param {String} 参数
/// @return {String} 格式化后的字符串
String.format = function(str) {
	var args = arguments, re = new RegExp("%([1-" + args.length + "])", "g");
	return String(str).replace(re, function($0, $1) {
		return args[$1];
	});
};

/// 为函数绑定this和参数
/// @param {Mixed} 需绑定为this的对象
/// @param {Mixed} 参数
/// @return {Function} 绑定this和参数的函数
Function.prototype.bind = function() {
	if (!arguments.length) { return this; }
	var method = this, args = slice.call(arguments), object = args.shift();
	return function() {
		return method.apply(object, args.concat(slice.call(arguments)));
	};
};

/// 在当前数组中检索指定元素
/// @param {Mixed} 指定元素
/// @param {Number} 开始搜索的位置，默认为0
/// @return {Number} 指定元素在数组中第一个匹配项的索引；如果该元素不存在于数组中，返回-1
!Array.prototype.indexOf && (Array.prototype.indexOf = function(elt, from) {
	var len = this.length, from = Number(from) || 0; 
	from = from < 0 ? Math.ceil(from) : Math.floor(from);
	from < 0 && (from += len);

	for (; from < len; from++) {
		if (this[from] === elt)  { return from; }
	}

	return -1;
});

/// 删除当前数组指定位置的元素
/// @param {Number} 指定位置
/// @return {Array} 当前数组
Array.prototype.remove = function(n) {
	n >= 0 && this.splice(n, 1);
	return this;
};


// 把数字转换成两位数的字符串
function toTwoDigit(num) { return num < 10 ? "0" + num : num; }

// 临时记录正在转换的日期
var tempYear, tempMonth, tempDate, tempHour, tempMinute, tempSecond;

// 格式替换函数
function getDatePart(part) {
	switch (part) {
		case "yyyy": return tempYear;
		case "yy": return tempYear.toString().slice(-2);
		case "MM": return toTwoDigit(tempMonth);
		case "M": return tempMonth;
		case "dd": return toTwoDigit(tempDate);
		case "d": return tempDate;
		case "HH": return toTwoDigit(tempHour);
		case "H": return tempHour;
		case "hh": return toTwoDigit(tempHour > 12 ? tempHour - 12 : tempHour);
		case "h": return tempHour > 12 ? tempHour - 12 : tempHour;
		case "mm": return toTwoDigit(tempMinute);
		case "m": return tempMinute;
		case "ss": return toTwoDigit(tempSecond);
		case "s": return tempSecond;
		default: return part;
	}
}

/// 返回当前日期的毫秒表示
/// @param {Number} 当前日期的毫秒表示
Date.now = Date.now || function() { return +new Date; }

/// 返回指定格式的日期字符串
/// @param {String} 格式
/// @return {String} 指定格式的日期字符串
Date.prototype.format = function(formation) {
	tempYear = this.getFullYear();
	tempMonth = this.getMonth() + 1;
	tempDate = this.getDate();
	tempHour = this.getHours();
	tempMinute = this.getMinutes();
	tempSecond = this.getSeconds();

	return formation.replace(/y+|m+|d+|h+|s+|H+|M+/g, getDatePart);
};


// 回收资源
testElem = null;


/// 界面效果
jRaiser.ui = {};

// 顺序播放
function playByAsc(curSeq, total) { return (curSeq + 1) % total; }
// 反序播放
function playByDesc(curSeq, total) { return curSeq <= 0 ? total - 1 : (curSeq - 1) % total; }

/// 切换控制类
/// @param {Array,HtmlCollection} 控制切换的元素数组
/// @param {Array,HtmlCollection} 内容元素数组
/// @param {String} 切换时附加的样式
/// @param {String} 事件名
/// @param {Number} 播放间隔，0或省略为不播放
/// @param {Number} 触发延迟
jRaiser.ui.Slide = function(ctrls, contents, css, eventName, interval, delay) {
	if (!arguments.length) { return; }
	
	var t = this;
	t.total = contents.length;
	if (ctrls && t.total !== ctrls.length) {		// 检查控制项和内容项是否能一一匹配
		throw "can not match ctrls(" + ctrls.length + ") and contents(" + t.total + ")";
	}
	
	t.constructor = arguments.callee;	// 更改构造函数
	
	t._curIndex = -1;		// 当前项，初始化时为-1
	t._ctrls = ctrls; t._contents = contents;
	t._css = css;
	t._eventName = eventName;
	
	t.interval = interval;		// 播放间隔
	t.playMode = playByAsc;		// 默认顺序播放
	t.rollbackMode = playByDesc;	// 默认回退模式
	t.delay = delay;			// 触发延迟
	
	if (t._ctrls && t._ctrls.length && t._eventName) {
		var change, preventChange;
		if (delay) {
			change = function (e, index) {
				!this._delayTimer && (this._delayTimer = setTimeout(this.show.bind(this, index), this.delay));
				e.preventDefault();
			}.bind(t);
			preventChange = function () {
				if (this._delayTimer) {
					clearTimeout(this._delayTimer);
					delete this._delayTimer;
				}
			}.bind(t);
		} else {
			change = function(e, index) {
				this.show(index);
				e.preventDefault();
			}.bind(t);
		}
		
		for (var i = t.total - 1; i >= 0; i--) {
			jRaiser.event.addEvent(t._ctrls[i], eventName, change, new Number(i));
			preventChange && jRaiser.event.addEvent(t._ctrls[i], "mouseout", preventChange);
		}
	}
	
	t.interval && t.play();
};
// 切换控制类方法
jRaiser.ui.Slide.prototype = {
	
	/// 显示某一项
	/// @param {Number} 序号
	show : function(index) {
		var t = this;
		index = index < 0 ? 0 : index >= t.total ? t.total - 1 : index;		// 修正index的值
		var ctrl = t._ctrls ? t._ctrls[index] : null, content = t._contents[index];
		
		if (-1 === t._curIndex) { t._curIndex = 0; }
		
		// 移除当前项样式
		jRaiser.style.removeCss(t._ctrls, t._css);
		jRaiser.style.removeCss(t._contents, t._css);
		
		// 给下一项添加样式
		jRaiser.style.addCss(ctrl, t._css);
		jRaiser.style.addCss(content, t._css);
		
		t.onShow && t.onShow(index, ctrl, content)
		
		t._curIndex = index;
	},
	
	/// 显示下一项
	showNext : function() {
		this.show(this.playMode(this._curIndex, this.total));
	},
	
	/// 显示上一项
	showPrevious : function() {
		this.show(this.rollbackMode(this._curIndex, this.total));
	},
	
	/// 开始播放
	/// @param {Number} 播放间隔
	play : function(interval) {
		var t = this;
		if (!isNaN(interval)) {
			t.interval = parseInt(interval);
		}
		if (!t._playTimer) {
			if (!t._hasEvent) {
				var pause = t.pause.bind(t), play = t.play.bind(t);
				jRaiser.event.addEvent(t._ctrls, "mouseover", pause); jRaiser.event.addEvent(t._ctrls, "mouseout", play);
				jRaiser.event.addEvent(t._contents, "mouseover", pause); jRaiser.event.addEvent(t._contents, "mouseout", play);
				t._hasEvent = 1;
			}
			t._playTimer = setInterval(t.showNext.bind(t), t.interval);
		}
	},
	
	/// 暂停播放
	pause : function() {
		var t = this;
		if (t._playTimer) {
			clearInterval(t._playTimer);
			delete t._playTimer;
			if (t.onStop) {
				var curIndex = t._curIndex;
				t.onStop(curIndex, t._ctrls[curIndex], t._contents[curIndex]);
			}
		}
	},

    ///延时加载
    lazy : function() {
        var t = this;
        var _lazy = function( e ,index ){
            var t = this ,
                url = t._contents[ index ].getAttribute("data-url") || null ,
                con = t._contents[ index ] ,
                isRequest = con.getAttribute("data-request");

            e.preventDefault();

            if( !url || !index || isRequest) return
            jRaiser.ajax.send(
                url,
                "post",
                {},
                {
                    onSuccess : function(xhr){
                        con.innerHTML = xhr.responseText;
                        con.setAttribute( "data-request" , "true")
                    },
                    onerror : function(){
                        throw "ajax loading error"
                    }
                }
            )
        }.bind(t);

        for(var i = 0 ; i < t.total ; i++){
            if( !t._contents[i].getAttribute("data-url") ) continue
            jRaiser.event.addEvent(t._ctrls[i], t._eventName, _lazy, i);
        }

    }


};

})(window);