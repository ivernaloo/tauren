(function(){
/*
 *	Js163 Javascript Framework
 *
 *	Author: heero
 *
 *	Create Date: 2008.02.06
 *	Last Update: 2009.08.05
 *
 *	Ver 0.9.6
 *		提高String.prototype.trim的效率
 *		提高$.Element.addEvent的效率
 *		改进selector引擎，改名为MiniSelDom(完整功能版本是SelDom)
 *		部分条件判断更改为===/!==
 *		新增toArray变量，提高$.Util.toArray方法的内部访问速度
 *		修正$.Ajax.send中的hasCompleted为局部变量
 *
 *	Ver 0.9.6.1
 *		简化异常的抛出
 *		改进selector引擎
 *		添加each元素扩展，大幅度修改元素扩展的实现
 *		Array.prototype.merge改为$.Util.merge，用于混合数组和类数组(不去重复)
 *
 *	Ver 0.9.6.2
 *		修正window和document调用addEvent出现的错误
 *		修正float样式名的兼容性，IE下是styleFloat，FF下是cssFloat
 *
 *	Ver 0.9.6.3
 *		优化$函数处理流程
 *		优化选择器引擎的执行效率以及对XML的兼容性
 *		修正对Css字符串解析的bug，addCss和removeCss的主要功能体归到$.style
 *		优化String.prototype.trim
 *
 *	Ver 0.9.6.4
 *		修正removeCss对多个类名操作时的BUG
 *
 *	Ver 0.9.6.5
 *		防止重复加载
 *		解决与新版本的冲突
 */
 
 
// 解决与新版本的冲突
if (window.NTES) {
	var tempNTES = window.NTES;
	tempNTES.Util = tempNTES.Util || tempNTES.util;
	tempNTES.Event = tempNTES.Event || tempNTES.event;
	tempNTES.Browser = tempNTES.Browser || tempNTES.browser;
	tempNTES.Ajax = tempNTES.Ajax || tempNTES.ajax;
	tempNTES.Cookie = tempNTES.Cookie || tempNTES.cookie;
	tempNTES.UI = tempNTES.UI || tempNTES.ui;

	return;
}
 

var undefined,		// 加速对undefined的应用

	// <summary>根据上下文及CSS选择器获取HTML元素</summary>
	// <param name="selector">CSS选择器表达式</param>
	// <param name="context">上下文</param>
	// <returns>匹配到的经扩展的HTML元素</returns>
	NTES = window.NTES = window.$ = function(selector, context) {
		if (null == selector || selector.$) {		// 如果selector不存在或已扩展（包含$方法），直接返回
			return selector;
		}
		
		var elems;
		if ("string" === typeof selector) {
			// 上下文优先级：context -> this -> document
			context = context || (this.alert ? document : this);
			// 通过selector获取元素
			elems = MiniSelDom.query(selector, context);
		} else {
			elems = selector;
		}
		if (elems && !elems.$) {
			if (elems.nodeType) {
				if ("unknown" !== typeof elems.getAttribute) {
					elems = NTES.Util.extend(elems, NTES.Element);
				}
			} else {
				elems = NTES.Util.extend(toArray(elems), NTES.Element);
			}
		}
		return elems;
	};


// <summary>标识当前版本</summary>
NTES.version = "0.9.6.5 Build 200908051005";


// <summary>MiniSelDom Selector Engine</summary>
var MiniSelDom = {
	
	SPACE : /\s*([\s>~+,])\s*/g,	// 用于去空格
	ISSIMPLE : /^#?([\w\u00c0-\uFFFF_-]+)$/,		// 判断是否简单选择器(只有id或tagname)
	IMPLIEDALL : /([>\s~\+,]|^)([#\.\[:])/g,		// 用于补全选择器
	ATTRALUES : /=(["'])([^'"]*)\1]/g,				// 用于替换引号括起来的属性值
	ATTR : /\[\s*([\w\u00c0-\uFFFF_-]+)\s*(?:(\S?\=)\s*(.*?))?\s*\]/g,	// 用于替换属性选择器
	BEGINIDAPART : /^(?:\*#([\w\u00c0-\uFFFF_-]+))/,		// 用于分离开头的id选择器
	STANDARD : /^[>\s~\+:]/,		// 判断是否标准选择器(以空格、>、~或+开头)
	STREAM: /[#\.>\s\[\]:~\+]+|[^#\.>\s\[\]:~\+]+/g,	// 用于把选择器表达式分离成操作符/操作数 数组
	ISINT : /^\d+$/,	// 判断是否整数

	tempAttrValues : [],	// 临时记录引号/双引号间的属性值
	tempAttrs : [],		// 临时记录属性表达式
	
	idName : "uniqueidforntes",
	id : 0,
	
	// <summary>解析CSS选择器入口函数</summary>
	// <param name="selector">CSS选择器表达式</param>
	// <param name="context">上下文</param>
	query : function(selector, context) {
		
		var result,			// 最后结果
			selectors,		// selector数组
			selCount,		// selector数组长度
			i, j,			// 循环变量
			temp,			// 一个selector中每个操作符和操作数的搜索结果
			matchs,			// 操作符/操作数 数组
			streamLen,		// 操作符/操作数 数组长度
			token,			// 操作符
			filter;			// 操作数
		
		// 清除多余的空白
		selector = selector.trim();
		
		if ("" === selector) {
			return;
		}
		
		// 优化简单选择符
		if (this.ISSIMPLE.test(selector)) {
			if (0 === selector.indexOf("#") && typeof context.getElementById !== "undefined") {
				//alert("simple id: " + selector);	// @debug
				return this.getElemById(context, selector.substr(1));
			} else if (typeof context.getElementsByTagName !== "undefined") {
				//alert("simple tagname: " + selector);	// @debug
				return toArray(context.getElementsByTagName(selector));
			}
		}
		
		// 转换成数组，统一处理
		if (!isArray(context)) {
			context = context.nodeType ? [context] : toArray(context);
		}
		
		selectors = selector.replace(this.SPACE, "$1")		// 去空白
							.replace(this.ATTRALUES, this.analyzeAttrValues)	// 替换属性值
							.replace(this.ATTR, this.analyzeAttrs)	// 替换属性选择符
							.replace(this.IMPLIEDALL, "$1*$2")		// 添加必要的"*"(例如.class1 => *.class1)
							.split(",");	// 分离多个选择器
		selCount = selectors.length;

		i = -1; result = [];

		while (++i < selCount) {
			// 重置上下文
			temp = context;
			
			selector = selectors[i];
			
			// 优化以id选择器开头且上下文是document的情况
			if (this.BEGINIDAPART.test(selector)) {
				if (typeof context[0].getElementById !== "undefined") {
					//alert("begin with id selector: " + RegExp.$1);	// @debug
					temp = [this.getElemById(context[0], RegExp.$1)];
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
				if (!this.STANDARD.test(selector)) {
					selector = " " + selector;
				}
				
				// 分离换成字符串数组，从0开始双数是操作符，单数是操作数(例如 " *.class1" => [" ", "*", ".", "class1"])
				matchs = selector.match(this.STREAM) || []; streamLen = matchs.length; j = 0;
				//alert("stream: " + matchs);	// @debug
				while (j < streamLen) {
					token = matchs[j++]; filter = matchs[j++];
					//alert(token + (this.operators[token] ? " is " : " is not ") + "exist"); 	// @debug
					//alert("filter: " + filter);	// @debug
					//alert("context: " + temp);	// @debug
					temp = this.operators[token] ? this.operators[token](temp, filter) : [];
					if (0 === temp.length) {
						break;
					}
				}
			}
			
			merge(result, temp);
		}
		
		// 清空临时数组
		this.tempAttrValues.length = this.tempAttrs.length = 0;
		
		return result.length > 1 ? this.unique(result) : result;
		//return result;
	},
	
	// <summary>属性替换处理函数</summary>
	analyzeAttrs : function($1, $2, $3, $4) {
		return "[]" + (MiniSelDom.tempAttrs.push([$2, $3, $4]) - 1);
	},
	
	// <summary>属性值替换处理函数</summary>
	analyzeAttrValues : function($1, $2, $3) {
		return "=" + (MiniSelDom.tempAttrValues.push($3) - 1) + "]";
	},
	
	// <summary>获取不重复的id</summary>
	// <param name="elem">元素</param>
	// <returns>id</returns>
	generateId : function(elem) {
		var idName = this.idName, id;
		try {
			id = elem[idName] = elem[idName] || ++this.id
		} catch (e) {
			id = elem.getAttribute(idName);
			if (!id) {
				id = ++this.id;
				elem.setAttribute(idName, id);
			}
		}
		return id;
	},
	
	// <summary>去重复</summary>
	// <param name="elems">元素数组</param>
	// <returns>去重复的数组</returns>
	unique : function(elems) {
		var result = [], i = 0, isExist = {}, elem, id;
		while (elem = elems[i++]) {
			if (1 === elem.nodeType) {
				id = this.generateId(elem);
				if (!isExist[id]) {
					isExist[id] = true;
					result.push(elem);
				}
			}
		}
		return result;
	},
	
	// <summary>属性名映射</summary>
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	
	// <summary>获取元素属性</summary>
	// <param name="elem">元素</param>
	// <param name="attrName">属性名</param>
	// <returns>属性值</returns>
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
	
	// <summary>通过id获取元素</summary>
	// <param name="context">上下文，一般是document</param>
	// <param name="id">id</param>
	// <returns>元素</returns>
	getElemById : function(context, id) {
		var result = context.getElementById(id);
		if (result && result.id !== id && context.all) {	// 修复IE下的id/name bug
			result = context.all[id];
			for (var i = 0; i < result.length; i++) {
				if (this.getAttribute(result[i], "id") === id) {
					return result[i];
				}
			}
			result = null;
		}
		return result;
	},
	
	// <summary>通过标签名获取指定相对位置的元素</summary>
	// <param name="context">上下文</param>
	// <param name="first">第一个元素相对位置</param>
	// <param name="next">下一个元素相对位置</param>
	// <param name="limit">元素数量限制</param>
	// <returns>结果</returns>
	getElemsByTagName : function(context, first, next, tagName, limit) {
		var result = [], i = -1, len = context.length, elem, counter, tagNameUpper;
		limit = limit || Number.MAX_VALUE;
		
		if (tagName !== "*") {
			tagNameUpper = tagName.toUpperCase();
		}

		while (++i < len) {
			elem = context[i][first]; counter = 0;
			while (elem && counter < limit) {
				if (elem.nodeName === tagNameUpper || elem.nodeName === tagName || (!tagNameUpper && 1 === elem.nodeType)) {
					result.push(elem);
					counter++;
				}
				elem = elem[next];
			}
		}
		
		return result;
	},
	
	// <summary>根据属性值过滤元素</summary>
	// <param name="context">上下文</param>
	// <param name="filter">属性数组</param>
	// <returns>过滤结果</returns>
	getElemsByAttribute : function(context, filter) {
		var result = [], elem, i = 0,
			check = this.attrOperators[filter[1] || ""], attrValue = "~=" === filter[1] ? " " + filter[2] + " " : filter[2];
		while (elem = context[i++]) {
			if (check(this.getAttribute(elem, filter[0]), attrValue)) {
				result.push(elem);
			}
		}
		return result;
	},
	
	// <summary>操作符</summary>
	operators : {
		
		// <summary>id选择符</summary>
		// <param name="context">上下文</param>
		// <param name="id">id</param>
		// <returns>过滤后的结果</returns>
		"#" : function(context, id) {
			return MiniSelDom.getElemsByAttribute(context, ["id", "=", id]);
		},
		
		// <summary>后代选择符</summary>
		// <param name="context">上下文</param>
		// <param name="tagName">标签名</param>
		// <returns>过滤后的结果</returns>
		" " : function(context, tagName) {
			var len = context.length;
			if (1 === len) {
				return context[0].getElementsByTagName(tagName);
			} else {
				var result = [], i = -1;
				while (++i < len) {
					merge(result, context[i].getElementsByTagName(tagName));
				}
			}
			return result;
		},
		
		// <summary>类名选择符</summary>
		// <param name="context">上下文</param>
		// <param name="className">类名</param>
		// <returns>过滤后的结果</returns>
		"." : function(context, className) {
			return MiniSelDom.getElemsByAttribute(context, ["class", "~=", className]);
		},
		
		// <summary>子元素选择符</summary>
		// <param name="context">上下文</param>
		// <param name="tagName">标签名</param>
		// <returns>过滤后的结果</returns>
		">" : function(context, tagName) {
			return MiniSelDom.getElemsByTagName(context, "firstChild", "nextSibling", tagName);
		},
		
		// <summary>属性选择符，即@a=b([a=b])</summary>
		// <param name="context">上下文</param>
		// <param name="filter">属性匹配数组下标</param>
		// <returns>过滤后的结果</returns>
		"[]" : function(context, filter) {
			filter = MiniSelDom.tempAttrs[filter];
			if (filter) {
				if (MiniSelDom.ISINT.test(filter[2])) {
					filter[2] = MiniSelDom.tempAttrValues[filter[2]];
				}
				return MiniSelDom.getElemsByAttribute(context, filter);
			} else {
				return context;
			}
		}
	},
	
	// <summary>属性操作符</summary>
	attrOperators : {
		
		// <summary>是否包含指定属性值</summary>
		// <param name="value">实际属性值</param>
		// <param name="input">受检测的属性值</param>
		// <returns>是否符合条件</returns>
		"" : function(value) {
			return value !== "";
		},
		
		// <summary>是否与指定属性值相等</summary>
		// <param name="value">实际属性值</param>
		// <param name="input">受检测的属性值</param>
		// <returns>是否符合条件</returns>
		"=" : function(value, input) {
			return input === value;
		},

		// <summary>是否包含指定属性值</summary>
		// <param name="value">实际属性值</param>
		// <param name="input">受检测的属性值</param>
		// <returns>是否符合条件</returns>
		"~=" : function(value, input) {
			  return (" " + value + " ").indexOf(input) >= 0;
		},
		
		// <summary>是否与指定属性值不等</summary>
		// <param name="value">实际属性值</param>
		// <param name="input">受检测的属性值</param>
		// <returns>是否符合条件</returns>
		"!=" : function(value, input) {
			return input !== value;
		}
	}
};


// <summary>HTML元素基本操作，用于继承</summary>
NTES.Element = {
	
	// <summary>以当前元素为上下文获取元素</summary>
	// <param name="selector">选择器</param>
	// <param name="context">上下文(优先)</param>
	// <returns>匹配到的经扩展的HTML元素</returns>
	$ : function(selector, context) {
		return NTES.call(this, selector, context);
	},

	// <summary>添加样式</summary>
	// <param name="css">类名或样式字符串</param>
	// <returns>当前元素</returns>
	addCss : function(css) {
		css = Css.parse(css);
		return this.each(
			"Class" === css.styleType ?
			function(classes, len) {
				var className = " " + this.className + " ";
				for (var i = 0; i < len; i++) {
					if (-1 === className.indexOf(" " + classes[i] + " ")) {
						className += (classes[i] + " ");
					}
				}
				this.className = className.trim();
			}
			:
			function(styles, len) {
				var i = 0;
				while (i < len) {
					this.style[styles[i++]] = styles[i++].replace(/^NULL$/i, "");
				}
			},
			[css, css.length]
		);
	},
	
	// <summary>删除样式</summary>
	// <param name="css">类名或样式字符串</param>
	// <returns>当前元素</returns>
	removeCss : function(css) {
		css = Css.parse(css);
		return this.each(
			"Class" === css.styleType ?
			function(classes, len) {
				var className = " " + this.className + " ";
				for (var i = 0; i < len; i++) {
					className = className.replace(" " + classes[i] + " ", " ");
				}
				this.className = className.trim();
			}
			:
			function(styles, len) {
				for (var i = 0; i < len; i++) {
					if (this.style[styles[i]] != null) {
						this.style[styles[i]] = "";
					}
				}
			},
			[css, css.length]
		);
	},
	
	// <summary>添加事件</summary>
	// <param name="eventName">事件名</param>
	// <param name="handler">事件处理函数</param>
	// <returns>当前元素</returns>
	addEvent : function(eventName, handler) {
		var callback, args
		if (window.attachEvent) {
			callback = function(eventName, handler) {
				this.attachEvent(eventName, handler);
			};
			args = ["on" + eventName, handler];
		} else if (window.addEventListener) {
			callback = function(eventName, handler) {
				this.addEventListener(eventName, handler, false);
			};
			args = arguments;
		}
		return this.each(callback, args);
	},
	
	// <summary>对每个元素执行一个函数，函数中的this指向元素</summary>>
	// <param name="callback">函数句柄</param>
	// <param name="args">参数数组</param>
	// <returns>当前元素</returns>
	each : function(callback, args) {
		if (isArray(this)) {
			var i = -1, len = this.length;
			// 递归执行
			while (++i < len) {
				callback.apply(this[i], args);
			}
		} else {
			callback.apply(this, args);
		}
		return this;
	},
	
	// <summary>把当前对象转换为数组</summary>
	// <returns>包含当前对象的数组</returns>
	toArray : function() {
		if (isArray(this)) {
			return this;
		} else {
			return [this];
		}
	}
};


// <summary>CSS样式解释器</summary>
var Css = {
	// 对CSS样式进行解释的正则表达式
	NAMETOFIX : /\-([a-z])/gi,
	FIXFLOAT : /(^|:|;)float(?=:|;|$)/gi,
	FLOATNAME : document.createElement("div").style.styleFloat != null ? "styleFloat" : "cssFloat",
	SPLITER : /([^:;]+)/g,
	SPACE : /\s*([:;\s])\s*/g,
	STYLENAME : /([^:;]+)(?=:)/g,
	CLASSSPLITER : /\s+/,
	
	// <summary>识别样式字符串</summary>
	// <param name="css">样式字符串</param>
	// <returns>标识样式类型的样式流数组</returns>
	parse : function(css) {
		css = css.trim().replace(this.SPACE, "$1");	// 去空格
		var hasSemi = css.indexOf(";") >= 0, hasColon = css.indexOf(":") >= 0;

		if (hasSemi || hasColon) {
			css = css.replace(
				hasColon ? this.STYLENAME : this.SPLITER,
				function($1, $2) {
					return $2.replace(Css.NAMETOFIX, Css.fixName);
				}
			);
			css = css.replace(this.FIXFLOAT, this.fixFloat).match(this.SPLITER);
			css.styleType = "Style";
			if (hasColon && css.length % 2 !== 0) {
				throw "invalid inline style";
			}
		} else {
			css = css.split(this.CLASSSPLITER);
			css.styleType = "Class";
		}
		
		return css;
	},
	
	// <summary>转换为js标准的样式属性名</summary>
	fixName : function($1, $2) {
		return $2.toUpperCase();
	},
	
	// <summary>修复float样式名</summary>
	fixFloat : function($1, $2, $3) {
		return $2 + Css.FLOATNAME + $3;
	}
};


// <summary>检查变量是否数组</summary>
// <param name="testVar">待测变量</param>
// <returns>待测变量是否数组</returns>
var isArray = function(testVar) {
	return Object.prototype.toString.call(testVar) === "[object Array]";
};


// 匹配模板中的值
var tplValues = /#@(\w+)#/g;

// <summary>工具类、工具函数</summary>
NTES.Util = {
	
	// <summary>把集合转换为数组</summary>
	// <param name="col">集合</param>
	// <returns>转换后的数组</returns>
	toArray : function(col) {
		if (isArray(col)) {
			return col;
		} else if (col.toArray) {
			return col.toArray();
		} else {
			var arr = [], i = col.length;
			while (i) {
				arr[--i] = col[i];
			}
			return arr;
		}
	},
	
	// <summary>模板转换</summary>
	// <param name="tpl">模板代码</param>
	// <param name="values">值集合</param>
	// <param name="re">匹配值的正则表达式</param>
	// <returns>转换后的代码</returns>
	parseTpl : function(tpl, values, re) {
		return values ? String(tpl).replace(
			re || tplValues,
			function($1, $2) {
				return values[$2] != null ? values[$2] : $1;
			}
		) : tpl;
	},
	
	// <summary>把源对象的属性和方法扩展到目标对象上</summary>
	// <param name="des">目标对象</param>
	// <param name="src">源对象</param>
	// <returns>已扩展的目标对象</param>
	extend : function(des, src) {
		for (var p in src) {
			des[p] = src[p];
		}
		return des;
	},
	
	// <summary>合并数组</summary>
	// <param name="first">原数组，必须为数组类型</param>
	// <param name="second">被混合数组，可以是类数组类型</param>
	// <returns>混合后的原数组</returns>
	merge : function(first, second) {
		var i = 0, elem, pos = first.length;
		while ((elem = second[i++]) != null) {
			first[pos++] = elem;
		}
		return first;
	}
};

// 加速内部访问
var toArray = NTES.Util.toArray, merge = NTES.Util.merge;


// 获取客户端信息
var userAgent = navigator.userAgent.toLowerCase();
// <summary>浏览器检测对象</summary>
NTES.Browser = {
	version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0,'0'])[1],
	safari: /webkit/.test(userAgent),
	opera: /opera/.test(userAgent),
	msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
	mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
};


// <summary>AJAX相关操作</summary>
NTES.Ajax = {
	
	// <summary>创建XmlHttpRequest对象</summary>
	// <returns>XmlHttpRequest对象</returns>
	createXhr : function() {
		var xhr;
		try {
			xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		} catch (e) { }
		if (!xhr) {
			throw "failed to create an XMLHttpRequest object";
		}
		return xhr;
	},
	
	// <summary>发送Ajax请求</summary>
	// <param name="url">请求地址</param>
	// <param name="method">发送方式，POST或GET</param>
	// <param name="data">发送的数据</param>
	// <param name="options">其他可选参数</param>
	// <param name="xhr">用于发送请求的XmlHttpRequest对象，如不指定则自动新建</param>
	// <returns>当前XMLHttpRequest对象</returns>
	send : function(url, method, data, options, xhr) {
		// 创建XMLHttpRequest对象
		xhr = xhr || this.createXhr();
		var hasCompleted;
		
		// 修正参数
		method = method.toUpperCase();
		method = method !== "GET" && method !== "POST" ? "GET" : method;		// 默认为GET
		options = options || {};
		options.async = "boolean" === typeof options.async ? options.async : true;
		
		// 连接参数键值对
		var postData;
		if (data) {
			postData = [];
			for (var d in data) {
				postData.push(d + "=" + encodeURIComponent(data[d]));
			}
			postData = postData.join("&").replace(/%20/g, "+");
		}
		
		// 超时处理(异步处理时才有效)
		if (options.async && !isNaN(options.timeout) && options.timeout > 0) {
			setTimeout(
				function() {
					if (!hasCompleted) {
						xhr.abort();
						if (options.onTimeout) {
							options.onTimeout(xhr);
						}
					}
				},
				options.timeout
			);
		}
		
		// 设定状态变换时的事件
		xhr.onreadystatechange = function() {
			if (4 == xhr.readyState) {
				hasCompleted = true;
				var eventName = 200 == xhr.status ? "onSuccess" : "onError";
				if (options[eventName]) {
					options[eventName](xhr);
				}
			}
		};
		
		if (postData && "GET" === method) {
			url += ("?" + postData);
			postData = null;
		}
		
		// 打开连接并发送数据
		xhr.open(method, url, options.async, options.username, options.password);

		// 设置header
		if (options.headers) {
			for (var h in options.headers) {
				xhr.setRequestHeader(h, options.headers[h]);
			}
		}
		if ("POST" === method) {
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}
		xhr.send(postData);
		return xhr;
	},
	
	// <summary>加载外部Javascript文件</summary>
	// <param name="url">js文件地址</param>
	// <param name="onComplete">读取完成后执行的事件</param>
	// <param name="charset">js文件编码</param>
	importJs : function(url, onComplete, charset) {
		// 取得头部节点的引用
		var head = document.getElementsByTagName("head")[0], script = document.createElement("script");
		// 设置节点属性
		script.src = url; script.language = "javascript"; script.type = "text/javascript";
		if (charset) {
			script.charset = charset;
		}

		// 设定读取完以后的操作
		script.onload = script.onreadystatechange = function() {
			if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
				if (onComplete) {
					onComplete(this);
				}
				script.onload = script.onreadystatechange = null;
				this.parentNode.removeChild(script);
			}
		};
		head.appendChild(script);
	}
	
};


// <summary>Cookie操作对象</summary>
NTES.Cookie = {
	
	// 编码函数
	encoder : escape,
	
	// 解码函数
	decoder : unescape,
	
	// <summary>获取Cookie值</summay>
	// <param name="name">Cookie名</param>
	// <returns>Cookie值</returns>
	get : function(name) {
		name = this.encoder(name) + "=";
		var cookie = document.cookie, beginPos = cookie.indexOf(name);
		if (-1 === beginPos) {
			return "";
		}
		beginPos += name.length;
		var endPos = cookie.indexOf(";", beginPos);
		if (endPos === -1) {
			endPos = cookie.length;
		}
		return this.decoder(cookie.substring(beginPos, endPos));
	},
	
	// <summary>设置Cookie值</summary>
	// <param name="name">Cookie名</param>
	// <param name="value">Cookie值</param>
	// <param name="expire">过期时间（分钟）</param>
	// <param name="domain">域</param>
	// <param name="path">路径</param>
	// <param name="secure">是否仅把Cookie发送给受保护的服务器</param>
	set : function(name, value, expires, domain, path, secure) {
		var cookieStr = [this.encoder(name) + "=" + this.encoder(value)];
		if (expires) {
			var date;
			if (!isNaN(expires)) {
				date = new Date();
				date.setTime(date.getTime() + expires * 60 * 1000);
			} else {
				date = expires;
			}
			cookieStr.push("expires=" + date.toUTCString());
		}
		if (path != null && path !== "") {
			cookieStr.push("path=" + path);
		}
		if (domain) {
			cookieStr.push("domain=" + domain);
		}
		if (secure) {
			cookieStr.push("secure");
		}
		document.cookie = cookieStr.join(";");
	},
	
	// <summary>删除Cookie</summary>
	// <param name="name">Cookie名</param>
	// <param name="domain">域</param>
	// <param name="path">路径</param>
	del : function(name, domain, path) {
		document.cookie = this.encoder(name) + "=" + (path != null && path !== "" ? ";path=" + path : "") + (domain ? ";domain=" + domain : "" ) + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
	}
	
};


// <suummary>事件操作对象</summary>
NTES.Event = {
	
	// <summary>修复不同浏览器的事件兼容性</summary>
	// <param name="e">事件对象</param>
	// <returns>修复后的事件对象</returns>
	fix : function(e) {
		e.preventDefault = e.preventDefault || function() {
			e.returnValue = false;
		};
		if (null == e.pageX && null != e.clientX) {
			var doc = document.documentElement, body = document.body;
			e.pageX = e.clientX + (doc.scrollLeft || body.scrollLeft || 0) - (doc.clientLeft || 0);
			e.pageY = e.clientY + (doc.scrollTop || body.scrollTop || 0) - (doc.clientTop || 0);
		}
		return e;
	}
};


// <summary>顺序播放</summary>
var playByAsc = function(curSeq, total) { return (curSeq + 1) % total; };

// <summary>界面交互</summary>
NTES.UI = {
	
	// <summary>切换控制类</summary>
	// <param name="ctrls">控制切换的元素数组</param>
	// <param name="contents">内容元素数组</param>
	// <param name="css">切换时附加的Css</param>
	// <param name="eventName">触发切换的事件名</param>
	// <param name="interval">播放间隔，0为不播放</param>
	Slide : function(ctrls, contents, css, eventName, interval) {
		var total = contents.length;
		if (ctrls && total !== ctrls.length) {		// 检查控制项和内容项是否能一一匹配
			throw "can not match ctrls(" + ctrls.length + ") and contents(" + total + ")";
		}
	
		var curSeq = -1,		// 当前项序号
			timerId,			// 定时器编号
			showNext,			// 播放函数
			onShow,				// 切换时触发的事件
			getNextSeq = playByAsc,		// 当前播放策略，默认顺序播放
			hasEvent,			// 是否已添加自动播放相关事件
			show, play, pause;	// 内部函数指针，用闭包避免this错乱
		ctrls = NTES(ctrls || []); contents = NTES(contents);		// 扩展元素数组
		
		// <summary>设置播放参数</summary>
		// <param name="mode">产生下一个播放序号的函数</param>
		this.setPlayMode = function(mode) {
			getNextSeq = mode;
		};
		
		// <summary>设置切换时触发的事件</summary>
		// <param name="handler">事件函数</param>
		this.setOnShow = function(handler) {
			onShow = handler;
		};
		
		// <summary>显示某一项</summary>
		// <param name="seq">序号</param>
		show = this.show = function(seq) {
			if (seq >= 0 && seq < total && seq != curSeq) {
				var ctrl = ctrls[seq], content = contents[seq];
				ctrls.removeCss(css); contents.removeCss(css);
				if (ctrl) { ctrl.addCss(css); } content.addCss(css);
				curSeq = seq;
				if (onShow) {
					onShow(seq, ctrl, content);
				}
			}
		};
		
		// <summary>播放函数</summary>
		showNext = this.showNext = function() {
			if (-1 == curSeq) { curSeq = 0; }
			show(getNextSeq(curSeq, total));
		};
		
		// <summary>开始播放</summary>
		// <param name="playInterval">播放间隔</param>
		play = this.play = function(playInterval) {
			if (!isNaN(playInterval)) {
				interval = playInterval;
			}
			if (null == timerId) {
				if (!hasEvent) {
					ctrls.addEvent("mouseover", pause); ctrls.addEvent("mouseout", play);
					contents.addEvent("mouseover", pause); contents.addEvent("mouseout", play);
					hasEvent = true;
				}
				timerId = setInterval(showNext, interval);
			}
		};
	
		// <summary>暂停播放</summary>
		pause = this.pause = function() {
			if (timerId != null) {
				clearInterval(timerId);
				timerId = null;
			}
		};
		
		var change = function(event) {
			show(this);
			var e = NTES.Event.fix(event);
			e.preventDefault();
			e.cancelBubble = true;
		};
		for (var ctrl, content, i = contents.length - 1; i >= 0; i--) {
			ctrl = ctrls[i]; contents[i] = NTES(contents[i]);
			if (ctrl) {
				ctrls[i] = NTES(ctrl);
				if (eventName) {
					ctrl.addEvent(eventName, change.bind(new Number(i)));
				}
			}
		}
		
		if (interval > 0) { play(); }
	}
};


// <summary>去掉当前字符串两端的某段字符串，默认为去掉两端的空白</summary>
// <param name="str">要去掉的字符串</param>
// <returns>修整后的字符串</returns>
String.prototype.trim = function(str) {
	return this.replace(null == str ? /^\s+|\s+$/g : new RegExp("^" + str + "+|" + str + "+$", "g"), "");
};

// <summary>检查当前字符串中是否存在以指定分隔符隔开的一段子字符串</summary>
// <param name="str">要查找的子字符串</param>
// <param name="spliter">分隔符</param>
// <returns>是否存在子字符串</returns>
String.prototype.has = function(str, spliter) {
	return "string" === typeof spliter ? (spliter + this + spliter).indexOf(spliter + str + spliter) >= 0 : this.indexOf(str) >= 0;
};

// <summary>字符串格式化</summary>
// <param name="str">要格式化的字符串</param>
// <param name="arguments[1...n]">参数值</param>
// <returns>格式化后的字符串</returns>
String.format = function(str) {
	var args = arguments, re = new RegExp("%([1-" + args.length + "])", "g");
	return String(str).replace(
		re,
		function($1, $2) {
			return args[$2];
		}
	);
};

// <summary>为函数绑定this</summary>
// <returns>绑定this指针后的函数</returns>
Function.prototype.bind = function() {
	if (!arguments.length || null == arguments[0]) {
		return this;
	}
    var method = this, args = Array.prototype.slice.call(arguments), object = args.shift();
    return function() {
		return method.apply(object, args.concat(Array.prototype.slice.call(arguments)));
    };
};

// <summary>搜索数组中是否存在指定元素(FF下已有此方法)</summary>
// <param name="elem">指定元素</param>
// <param name="startPos">开始搜索的位置</param>
// <returns>指定元素在数组中的位置</returns>
Array.prototype.indexOf = Array.prototype.indexOf || function(elem, startPos) {
	var i = isNaN(startPos) || startPos < 0 ? -1 : startPos - 1, len = this.length;
	while (++i < len) {
		if (this[i] === elem) {
			return i;
		}
	}
	return -1;
}; 

// 重写toArray方法
window.toArray = document.toArray = function() {
	return [this];
};
// 添加each方法
window.each = document.each = function(callback, args) {
	callback.apply(this, args);
	return this;
};
// window对象、document对象的添加事件方法
window.addEvent = document.addEvent = NTES.Element.addEvent;

})();