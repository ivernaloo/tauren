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
 
var version = "1.2.5 Build 201007291456",	// �汾��
	globalName = "NTES";		// ȫ�ֱ�ʶ��
 
// ��ֹ�ظ�����
if (window[globalName] && window[globalName].version >= version) { return; }


var _$ = window.$,		// ��¼��ǰ��ܣ��Ա�ָ�
	document = window.document,

/// @overload ����CSSѡ������������ƥ���HTMLԪ��
///		@param {String} CSSѡ����
///		@param {HTMLElement,Array,HTMLCollection} ������
///		@return {HTMLElement,Array} ƥ�䵽�ľ���չ��HTMLԪ��
/// @overload ��չHTMLԪ��
///		@param {HTMLElement,Array,HTMLCollection} Ҫ��չ��HtmlԪ��
///		@return {HTMLElement,Array} ����չ��HTMLԪ��
jRaiser = window[globalName] = window.$ = function(selector, context) {
	if (!selector) { return selector; }

	"string" === typeof selector && (selector = getElemsBySelector(selector, context));

	return extendElems(selector);
};

/// ���������ļ�CSSѡ������ȡ������еĵ�һ��Ԫ��
/// @param {String} CSSѡ����
/// @param {HTMLElement,Array,HTMLCollection} ������
///	@return {HTMLElement} ƥ�䵽�ľ���չ��HTMLԪ��
jRaiser.one = function(selector, context) {
	return extendElems(getElemsBySelector(selector, context, 1));
};

/// ���������ļ�CSSѡ������ȡ����Ԫ��
/// @param {String} CSSѡ����
/// @param {HTMLElement,Array,HTMLCollection} ������
///	@return {Array} ƥ�䵽�ľ���չ��HTMLԪ������
jRaiser.all = function(selector, context) {
	return extendElems(getElemsBySelector(selector, context, 0));
};

// ���������ļ�CSSѡ������ȡHTMLԪ��
// @param {String} CSSѡ����
// @param {HTMLElement,Array,HTMLCollection} ������
// @param {Number} ������������ƣ�Ĭ�Ϸ���ԭ�����Ϊ1ʱֻ���ص�һ��Ԫ�أ�Ϊ0ʱ�ѽ����������ʽ����
// @return {HTMLElement,Array} ƥ�䵽�ľ���չ��HTMLԪ��
function getElemsBySelector(selector, context, limit) {
	// ͨ��ѡ�������������ȡԪ��
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

// ��չHTMLԪ��(����)
// @param {HTMLElement,Array,HTMLCollection} Ԫ��(����)
// @return {HtmlElement,Array} ��չ���Ԫ��
function extendElems(elems) {
	if (elems && !elems[globalName]) {
		if (elems.nodeType) {	// ��չHtmlԪ�غͷ�IE�µ�XMLԪ��
			if ("unknown" !== typeof elems.getAttribute) {
				for (var p in jRaiser.element) {
					// ������ԭ�е����Ժͷ���
					undefined === elems[p] && (elems[p] = jRaiser.element[p]);
				}
			}
		} else {	// HTMLCollection Or Array
			elems = jRaiser.util.extend(jRaiser.util.toArray(elems), jRaiser.element);
		}
	}
	return elems;
}


/// ��ʶ��ǰ�汾
jRaiser.version = version;


/// �ָ�������$��jRaiserȫ�ֱ�����ռ��
/// @return {Object} jRaiser����
jRaiser.resume = function() {
	_$ = window.$;
	window.$ = window[globalName] = jRaiser;
	return jRaiser;
};

/// �ָ����һ�α�������ǰ��jRaiser.resume��������ǰ��$����
/// @return {Mixed} ԭ$����
jRaiser.retire = function() {
	window.$ = _$;
	return _$;
};


// �������Լ���Ԫ��
var testElem = document.createElement("div");


testElem.innerHTML = "<p class='TEST'></p>";

// selectorQueryѡ������������
var selectorQuery = {

	SPACE : /\s*([\s>~+,])\s*/g, // ����ȥ�ո�
	ISSIMPLE : /^#?[\w\u00c0-\uFFFF_-]+$/, 	// �ж��Ƿ��ѡ����(ֻ��id��tagname��������*)
	IMPLIEDALL : /([>\s~\+,]|^)([#\.\[:])/g, 	// ���ڲ�ȫѡ����
	ATTRVALUES : /=(["'])([^'"]*)\1]/g, 		// �����滻����������������ֵ
	ATTR : /\[\s*([\w\u00c0-\uFFFF_-]+)\s*(?:(\S?\=)\s*(.*?))?\s*\]/g, // �����滻����ѡ����
	PSEUDOSEQ : /\(([^\(\)]*)\)$/g, 	// ����ƥ��α��ѡ�����������
	BEGINIDAPART : /^(?:\*#([\w\u00c0-\uFFFF_-]+))/, 	// ���ڷ��뿪ͷ��idѡ����
	STANDARD : /^[>\s~\+:]/, 	// �ж��Ƿ��׼ѡ����(�Կո�>��~��+��ͷ)
	STREAM : /[#\.>\s\[\]:~\+]+|[^#\.>\s\[\]:~\+]+/g, // ���ڰ�ѡ�������ʽ����ɲ�����/������ ����
	ISINT : /^\d+$/, // �ж��Ƿ�����
	
	// �ж��Ƿ�ʹ���������querySelectorAll
	enableQuerySelector : testElem.querySelectorAll && testElem.querySelectorAll(".TEST").length > 0,

	tempAttrValues : [], // ��ʱ��¼����/˫���ż������ֵ
	tempAttrs: [], 	// ��ʱ��¼���Ա��ʽ

	idName : globalName + "UniqueId",
	id : 0,

	// ����CSSѡ������ȡԪ��
	// @param {String} ѡ����
	// @param {HTMLElement,Array,HTMLCollection} ������
	// @return {HTMLElement,Array,HTMLCollection} ƥ�䵽��Ԫ��
	exec : function(selector, context) {

		var result, 	// �����
			selectors, 	// selector����
			selCount, 	// selector���鳤��
			i, j, 		// ѭ������
			temp, 		// ��ʱ�������
			matchs, 	// ������/������ ����
			streamLen, 	// ������/������ ���鳤��
			token, 		// ������
			filter, 	// ������
			t = this;

		// �������Ŀհ�
		selector = selector.trim();

		if ("" === selector) { return; }

		// �Լ�ѡ������Ż�����
		if (t.ISSIMPLE.test(selector)) {
			if (0 === selector.indexOf("#") && typeof context.getElementById !== "undefined") {
				//alert("simple id: " + selector);	// @debug
				return t.getElemById(context, selector.substr(1));
			} else if (typeof context.getElementsByTagName !== "undefined") {
				//alert("simple tagname: " + selector);	// @debug
				return jRaiser.util.toArray(context.getElementsByTagName(selector));
			}
		}

		// ʹ��querySelectorAll
		if (t.enableQuerySelector && context.nodeType) {
			try {
				return jRaiser.util.toArray(context.querySelectorAll(selector));
			} catch (e) {

			}
		}

		// ת�������飬ͳһ����
		context = context.nodeType ? [context] : jRaiser.util.toArray(context);

		selectors = selector.replace(t.SPACE, "$1")		// ȥ�հ�
						.replace(t.ATTRVALUES, t.analyzeAttrValues)	// �滻����ֵ
						.replace(t.ATTR, t.analyzeAttrs)	// �滻����ѡ���
						.replace(t.IMPLIEDALL, "$1*$2")		// ��ӱ�Ҫ��"*"(����.class1 => *.class1)
						.split(",");	// ������ѡ����
		selCount = selectors.length;

		i = -1; result = [];

		while (++i < selCount) {
			// ����������
			temp = context;

			selector = selectors[i];

			if (t.BEGINIDAPART.test(selector)) {	// �Ż���idѡ������ͷ����������document�����
				if (typeof context[0].getElementById !== "undefined") {
					//alert("begin with id selector: " + RegExp.$1);	// @debug
					temp = [t.getElemById(context[0], RegExp.$1)];
					//alert("result: " + temp); // @debug
					if (!temp[0]) {
						continue;
					}
					selector = RegExp.rightContext;
				} else {	// �����Ĳ���document, �ָ��������
					selector = selectors[i];
				}
			}

			// ��������Ĳ���
			if (selector !== "") {
				if (!t.STANDARD.test(selector)) {
					selector = " " + selector;
				}

				// ���뻻���ַ������飬��0��ʼ˫���ǲ������������ǲ�����(���� " *.class1" => [" ", "*", ".", "class1"])
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

		// �����ʱ����
		t.tempAttrValues.length = t.tempAttrs.length = 0;

		return result.length > 1 ? t.unique(result) : result;
	},

	// �����滻������
	analyzeAttrs : function($1, $2, $3, $4) {
		return "[]" + (selectorQuery.tempAttrs.push([$2, $3, $4]) - 1);
	},

	// ����ֵ�滻������
	analyzeAttrValues : function($1, $2, $3) {
		return "=" + (selectorQuery.tempAttrValues.push($3) - 1) + "]";
	},

	// ��ȡ���ظ���Ԫ��id
	// @param {HTMLElement} Ԫ��
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

	// ȥ�������е��ظ�Ԫ��
	// @param {Array} Ԫ������
	// @return {Array} ��ȥ�ظ���Ԫ������
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

	// ������ӳ��
	attrMap : {
		"class" : "className",
		"for" : "htmlFor"
	},

	// ��ȡԪ������
	// @param {HTMLElement} Ԫ��
	// @param {String} ������
	// @return {String} ����ֵ
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

	// ͨ��id��ȡԪ��
	// @param {HTMLElement} �����ģ�һ����document
	// @param {String} id
	// @return {HTMLElement} Ԫ��
	getElemById : function(context, id) {
		var result = context.getElementById(id);
		if (result && result.id !== id && context.all) {	// �޸�IE�µ�id/name bug
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

	// ����ָ��λ�õ�ĳ��ǩ��Ԫ��
	// @param {Array} ������
	// @param {String} ��һ��Ԫ�����λ��
	// @param {String} ��һ��Ԫ�����λ��
	// @param {String} ��ǩ��
	// @param {Number} �����ж��ٴβ���
	// @return {Array} �������
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

	// ����ָ��˳���������ĸ�Ԫ�صĵ�n����Ԫ���Ƿ��������Ԫ��
	// @param {Array} ������
	// @param {Number} ���
	// @param {String} ��һ��Ԫ�����λ��
	// @param {String} ��һ��Ԫ�����λ��
	// @return {Array} �������
	checkElemPosition : function(context, seq, first, next) {
		var result = [];
		if (!isNaN(seq)) {
			var len = context.length, i = -1,
				cache = {},		// �ڵ㻺��
				parent, id, current, child;
				
			while (++i < len) {
				parent = context[i].parentNode;		// �ҵ����ڵ�
				id = this.generateId(parent);		// Ϊ���ڵ�����һ��id��Ϊ�����ֵ
				
				if (undefined === cache[id]) {	// ���������û�У�������Ѱ�Ҹ�Ԫ�صĵ�N����Ԫ��
					current = 0;			// ���õ�ǰ���
					child = parent[first];	// ��һ��Ԫ��
					while (child) {
						1 === child.nodeType && current++;	// ��ż�1
						if (current < seq) {
							child = child[next];	// ��û��ָ����ţ�������
						} else {
							break;	// �Ѿ���ָ����ţ��ж�ѭ��
						}
					}
					cache[id] = child || 0;		// ���±����������
				} else {
					child = cache[id];
				}
				context[i] === child && result.push(context[i]);	// ���������ڵ����
			}
		}
		return result;
	},
	
	// ��ȡ�ض�λ�õ�Ԫ��
	// @param {Array} ������
	// @param {Number} ��һ��λ��
	// @param {Number} ��һ��λ�õ�����
	// @return {Array} ���˽��
	getElemsByPosition : function(context, first, next) {
		var i = first, len = context.length, result = [];
		while (i >= 0 && i < len) {
			result.push(context[i]);
			i += next;
		}
		return result;
	},

	// ��������ֵ����Ԫ��
	// @param {Array} ������
	// @param {Array} ��������
	// @return {Array} ���˽��
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

	// ������
	operators : {

		// idѡ���
		"#" : function(context, id) {
			return selectorQuery.getElemsByAttribute(context, ["id", "=", id]);
		},

		// ���ѡ���
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

		// ����ѡ����
		"." : function(context, className) {
			return selectorQuery.getElemsByAttribute(context, ["class", "~=", className]);
		},

		// ��Ԫ��ѡ���
		">" : function(context, tagName) {
			return selectorQuery.getElemsByTagName(context, "firstChild", "nextSibling", tagName);
		},

		// ͬ��Ԫ��ѡ���
		"+" : function(context, tagName) {
			return selectorQuery.getElemsByTagName(context, "nextSibling", "nextSibling", tagName, 1);
		},

		// ͬ��Ԫ��ѡ���
		"~" : function(context, tagName) {
			return selectorQuery.getElemsByTagName(context, "nextSibling", "nextSibling", tagName);
		},

		// ����ѡ���
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

		// α��ѡ���
		":" : function(context, filter) {
			var seq;
			if (selectorQuery.PSEUDOSEQ.test(filter)) {
				seq = parseInt(RegExp.$1);
				filter = RegExp.leftContext;
			}
			return selectorQuery.pseOperators[filter] ? selectorQuery.pseOperators[filter](context, seq) : [];
		}
	},

	// ���Բ�����
	attrOperators : {

		// �Ƿ����ָ������ֵ
		"" : function(value) { return value !== ""; },

		// �Ƿ���ָ������ֵ���
		"=" : function(value, input) { return input === value; },

		// �Ƿ����ָ������ֵ
		"~=" : function(value, input) { return (" " + value + " ").indexOf(input) >= 0; },

		// �Ƿ���ָ������ֵ����
		"!=" : function(value, input) { return input !== value; },
		
		// ����ֵ�Ƿ���ĳ���ַ�����ͷ
		"^=" : function(value, input) { return value.indexOf(input) === 0; },

		// ����ֵ�Ƿ���ĳ���ַ�����β
		"$=" : function(value, input) { return value.substr(value.length - input.length) === input; },

		// ����ֵ�Ƿ����ĳ�����ַ���
		"*=" : function(value, input) { return value.indexOf(input) >= 0; }
	},

	// α��ѡ���
	pseOperators : {

		// ��ȡ��һ����Ԫ��
		"first-child" : function(context) {
			return selectorQuery.checkElemPosition(context, 1, "firstChild", "nextSibling");
		},

		// ��ȡ��n����Ԫ��
		"nth-child" : function(context, seq) {
			return selectorQuery.checkElemPosition(context, seq, "firstChild", "nextSibling");
		},

		// ��ȡ���һ����Ԫ��
		"last-child" : function(context) {
			return selectorQuery.checkElemPosition(context, 1, "lastChild", "previousSibling");
		},

		// ��ȡ������n����Ԫ��
		"nth-last-child" : function(context, seq) {
			return selectorQuery.checkElemPosition(context, seq, "lastChild", "previousSibling");
		},
		
		// ��ȡ��������Ԫ��
		"odd" : function(context) {
			return selectorQuery.getElemsByPosition(context, 0, 2);
		},
		
		// ��ȡ��ż����Ԫ��
		"even": function(context) {
			return selectorQuery.getElemsByPosition(context, 1, 2);
		},
		
		// ��ȡ��N��Ԫ��ǰ��Ԫ��
		"lt" : function(context, seq) {
			return selectorQuery.getElemsByPosition(context, seq - 1, -1);
		},
		
		// ��ȡ��N��Ԫ�غ��Ԫ��
		"gt" : function(context, seq) {
			return selectorQuery.getElemsByPosition(context, seq + 1, 1);
		}
	}
};


// HTMLԪ����չ���������ڼ̳�
jRaiser.element = {
	
	/// ��ȡָ����ŵ�Ԫ��
	/// @param {Number} ���
	/// @return {HTMLElement} Ԫ��
	get : function(i) {
		return this.nodeType === undefined ? this[i] : (0 == i ? this : undefined);
	},
	
	/// @overload ��ȡָ����Ų�������չ��Ԫ��
	/// 	@param {Number} �������
	///		@return {HTMLElement} ָ����Ų�������չ��Ԫ��
	/// @overload �Ե�ǰԪ��Ϊ������ͨ��CSSѡ������ȡԪ��
	///		@param {String} CSSѡ����
	///		@return {HTMLElement,Array} ƥ�䵽�ľ���չ��HTMLԪ��
	$ : function(selector) {
		return jRaiser("number" === typeof selector ? this.get(selector) : selector, this);
	},

	/// ��鵱ǰԪ���Ƿ����ĳЩ��ʽ��
	/// @param {String} ��ʽ����
	/// @return {Boolean} Ԫ���Ƿ����ĳ����ʽ��
	hasClass : function(className) { return jRaiser.style.hasClass(this, className); },

	/// �����ʽ
	/// @param {String,Object} ��������ʽ����������ÿո����
	/// @return {HTMLElement,Array} ��ǰԪ��
	addCss : function(css) { return jRaiser.style.addCss(this, css); },

	/// �Ƴ���ʽ
	/// @param {String,Object} ��������ʽ����������ÿո����
	/// @return {HTMLElement,Array} ��ǰԪ��
	removeCss : function(css) { return jRaiser.style.removeCss(this, css); },

	/// ����¼�ί�к���
	/// @param {String} �¼���������¼��ö��Ÿ���
	/// @param {Function} �¼�ί�к���
	/// @param {Mixed} ��������
	/// @return {HTMLElement,Array} ��ǰԪ��
	addEvent : function(eventName, handler, data) {
		return jRaiser.event.addEvent(this, eventName, handler, data);
	},

	/// �Ƴ��¼�ί�к���
	/// @param {String} �¼���������¼��ö��Ÿ���
	/// @param {Function} �¼�ί�к���
	/// @return {HTMLElement,Array} ��ǰԪ��
	removeEvent : function(eventName, handler) {
		return jRaiser.event.removeEvent(this, eventName, handler);
	},

	/// @overload ��ȡ��ǰԪ�ص�����ֵ
	///		@param {String} ������
	///		@return {Mixed} ����ֵ
	/// @overload ���õ�ǰԪ�ص�����ֵ
	///		@param {String} ������
	///		@param {String,Function} ����ֵ�����ڼ�������ֵ�ĺ���
	///		@return {HTMLElement,Array} ��ǰԪ��
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
	
	/// ��ÿ���ڵ�ִ���ض�����
	/// @param {Function} Ҫִ�еĲ���
	/// @return {HTMLElement, Array} ��ǰԪ��
	each : function(callback) {
		return jRaiser.dom.eachNode(this, callback);
	}
};
jRaiser.element[globalName] = jRaiser.element.$;


// window����document�������ӡ��Ƴ��¼�����
window.addEvent = document.addEvent = jRaiser.element.addEvent;
window.removeEvent = document.removeEvent = jRaiser.element.removeEvent;


var tplCache = {},		// ģ�建��
	slice = Array.prototype.slice,
	toString = Object.prototype.toString;	// ��дtoString

/// �����ࡢ���ߺ���
jRaiser.util = {
	
	/// �������Ƿ�Array����
	/// @param {Mixed} �������
	/// @return {Boolean} ��������Ƿ�Array����
	isArray : function(value) { return toString.call(value) === "[object Array]"; },
	
	/// �������Ƿ�������
	/// @param {Mixed} �������
	/// @return {Boolean} ��������Ƿ�Function����
	isFunction : function(value) { return toString.call(value) === "[object Function]"; },

	/// �Ѽ���ת��Ϊ����
	/// @param {Array,Collection} ����򼯺�
	/// @return {Array} ����
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

	/// �ϲ�����
	/// @param {Array} Ŀ������
	/// @param {Array,Collection} Դ����
	/// @return {Array} ��Ϻ��Ŀ������
	merge : function(first, second) {
		var i = second.length, pos = first.length;
		while (--i >= 0) {
			first[pos + i] = second[i];
		}
		return first;
	},

	/// ģ��ת��
	/// @param {String} ģ�����
	/// @param {Object} ֵ����
	/// @param {Boolean} �Ƿ񻺴�ģ�壬Ĭ��Ϊ��
	/// @return {String} ת����Ĵ���
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

	/// ��Դ��������Ժͷ�����չ��Ŀ�������
	/// @param {Mixed} Ŀ�����
	/// @param {Mixed} Դ����
	/// @return {Mixed} ����չ��Ŀ�����
	extend : function(des, src) {
		for (var p in src) {
			des[p] = src[p];
		}
		return des;
	},

	/// �����������󣬶�ÿ����Աִ��ĳ������
	/// @param {Mixed} ��������
	/// @param {Function} �ص�����
	/// @param {Array} �������
	/// @return {Mixed} ԭ��������
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
// ���ٷ���
jRaiser.parseTpl = jRaiser.util.parseTpl;
jRaiser.each = jRaiser.util.each;


var readyList = [],		// DOM Ready��������
	isReadyBound,		// �Ƿ��Ѱ�DOM Ready�¼�
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

// DOM Ready��� For IE
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
// DOM�Ѿ���
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
// ��DOMReady�¼�
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


/// DOM����
jRaiser.dom = {
	
	/// �ѽڵ�ŵ�����������
	/// @param {HTMLElement,HTMLCollection,Array} �ڵ��ڵ㼯��
	/// @return {Array} �ڵ�����
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

	/// �Խڵ�ִ��ָ������
	/// @param {HTMLElement,Array,HTMLCollection} �ڵ�
	/// @param {Function} �ص�����
	/// @param {Array} ����Ĳ���
	/// @return {HTMLElement,Array,HTMLCollection} ָ���ڵ�
	eachNode : function(nodes, callback, args) {
		jRaiser.each(jRaiser.dom.wrapByArray(nodes), callback, args);
		return nodes;
	},

	/// ��DOM����ʱִ��ָ������
	/// @param {Function} ָ������
	/// @param {Object} ��ǰ����
	ready : function(fn) {
		// ���¼�
		bindReady();

		if (jRaiser.dom.isReady) {
			fn.call(document, jRaiser);
		} else {
			readyList.push(fn);
		}

		return this;
	}
};
// ���ٷ���
jRaiser.ready = jRaiser.dom.ready;


// ��CSS��ʽ�ַ������н��͵�������ʽ
var CSSSPACE = /\s*([:;])\s*/g,
	STYLENAME = /[^:;]+?(?=:)/g,
	STYLESPLITER = /[^:;]+/g,
	CLASSSPLITER = /[^\s]+/g,
	FIXCSSNAME = /-([a-z])/gi,
	FLOATNAME = testElem.style.styleFloat !== undefined ? "styleFloat" : "cssFloat",
	ISFLOAT = /^float$/i;
	
// �����ʽ��
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
// ɾ����ʽ��
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
// �����ʽ
function addStyles(styles, str) {
	if ("" === this.style.cssText && "string" === typeof str) {
		this.style.cssText = str;
	} else {
		for (var s in styles) {
			this.style[s] !== undefined && (this.style[s] = styles[s]);
		}
	}
}

/// ��ʽ����
jRaiser.style = {
	
	/// ����ʽ��ת������ʽ������
	/// @param {String} ��ʽ��
	/// @return {String} ��ʽ������
	fixStyleName : function(name) {
		return ISFLOAT.test(name) ? FLOATNAME : name.replace(FIXCSSNAME, function($0, $1) {
			return $1.toUpperCase();	// ת��Ϊjs��׼����ʽ��
		});
	},
	
	/// ���ָ��Ԫ���Ƿ����ĳЩ��ʽ��
	/// @param {HTMLElement,HTMLCollection,Array} ָ��Ԫ��
	/// @param {String} ��ʽ����
	/// @return {Boolean} Ԫ���Ƿ����ĳ����ʽ��
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

	// ʶ��CSS��ʽ
	// @param {String,Object} ��ʽ
	// @return {Array} �������ʽ���͵���ʽ��
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

	/// Ϊָ��HTMLԪ�������ʽ
	/// @param {HTMLElement,Array,HTMLCollection} ָ��Ԫ��
	/// @param {String,Object} ��ʽ
	/// @return {HTMLElement,Array,HTMLCollection} ָ��Ԫ��
	addCss : function(elems, css) {
		var result = jRaiser.style.parse(css);
		if (jRaiser.util.isArray(result)) {
			jRaiser.dom.eachNode(elems, addClasses, [result, result.length, css]);
		} else {
			jRaiser.dom.eachNode(elems, addStyles, [result, css]);
		}
		return elems;
	},

	/// Ϊָ��HTMLԪ���Ƴ���ʽ
	/// @param {HTMLElement,Array,HTMLCollection} ָ��Ԫ��
	/// @param {String,Object} ��ʽ
	/// @return {HTMLElement,Array,HTMLCollection} ָ��Ԫ��
	removeCss : function(elems, css) {
		var result = jRaiser.style.parse(css);
		if (jRaiser.util.isArray(result)) {
			jRaiser.dom.eachNode(elems, removeClasses, [result, result.length, css]);
		} else {
			jRaiser.dom.eachNode(elems, addStyles, [result, css]);
		}
		return elems;
	},
	
	/// ��ȡָ��Ԫ�صĵ�ǰ��ʽ
	/// @param {HTMLElement,Array,HTMLCollection} ָ��Ԫ��
	/// @param {String} ��ʽ��
	/// @param {Object} Ԫ�����ڵ�ҳ���window����Ĭ��Ϊ��ǰwindow����
	/// @return {String} ��ʽֵ
	getCurrentStyle : function(node, styleName, w) {
		if (!node) { return undefined; }

		!node.nodeType && (node = node[0]);
		styleName = jRaiser.style.fixStyleName(styleName);

		return node.style[styleName] ||
			( (node.currentStyle || (w || window).getComputedStyle(node, null))[styleName] );
	}
};


// ����¼�
function newEvent(eventName, handler, data) {
	var t = this;
	handler = jRaiser.event.delegate(t, eventName, handler, data);
	if (t.attachEvent) {
		t.attachEvent("on" + eventName, handler);
	} else if (t.addEventListener) {
		t.addEventListener(eventName, handler, false);
	}
}
// �Ƴ��¼�
function disposeEvent(eventName, handler) {
	var t = this;
	handler = jRaiser.event.getDelegate(t, eventName, handler);
	if (t.detachEvent) {
		t.detachEvent("on" + eventName, handler);
	} else if (t.removeEventListener) {
		t.removeEventListener(eventName, handler, false);
	}
}

var EVENTSPLITER = /\s*,\s*/,	// �¼����ָ���
	eventId = 0;	// �¼���Ż�ֵ

/// �¼�����
jRaiser.event = {
	
	/// �¼�Id������
	idName : globalName + "EventId",

	/// �¼�������
	eventSpace : globalName + "Events",

	/// Ϊָ��HTMLԪ������¼�ί�к���
	/// @param {HTMLElement,Array,HTMLCollection} ָ��Ԫ��
	/// @param {String} �¼���������¼����ö��Ÿ���
	/// @param {Function} �¼�ί�к���
	/// @param {Object} ���⴫�������
	/// @return {HTMLElement,Array,HTMLCollection} ָ��Ԫ��
	addEvent : function(elems, eventNames, handler, data) {
		eventNames = eventNames.split(EVENTSPLITER);
		var i = eventNames.length;
		while (--i >= 0) {
			jRaiser.dom.eachNode(elems, newEvent, [eventNames[i], handler, data]);
		}
		return elems;
	},

	/// Ϊָ��HTMLԪ���Ƴ��¼�ί�к���
	/// @param {HTMLElement,Array,HTMLCollection} ָ��Ԫ��
	/// @param {String} �¼���������¼����ö��Ÿ���
	/// @param {Function} �¼�������
	/// @return {HTMLElement,Array,HTMLCollection} ָ��Ԫ��
	removeEvent : function(elems, eventNames, handler) {
		eventNames = eventNames.split(EVENTSPLITER);
		var i = eventNames.length;
		while (--i >= 0) {
			jRaiser.dom.eachNode(elems, disposeEvent, [eventNames[i], handler]);
		}
		return elems;
	},

	/// �����¼�����
	/// @param {HTMLElement} Ԫ��
	/// @param {String} �¼���
	/// @param {Function} �¼�������
	/// @param {Object} ���⴫�������
	/// @return {Function} �¼�����
	delegate : function(elem, eventName, handler, data) {
		var t = jRaiser.event, events = elem[t.eventSpace] = elem[t.eventSpace] || {}, 	// ȡ���¼�Hash������
			id = handler[t.idName] = handler[t.idName] || ++eventId; 	// ��ȡ���ظ����¼����
		// �����ض��¼�Hash��
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

	/// ��ȡ�¼�����
	/// @param {HTMLElement} Ԫ��
	/// @param {String} �¼���
	/// @param {Function} �¼�������
	/// @return {Function} �¼�����
	getDelegate : function(elem, eventName, handler) {
		var t = jRaiser.event;
		try {
			return elem[t.eventSpace][eventName][handler[t.idName]];
		} catch (e) {

		}
		return handler;
	},

	/// �޸���ͬ��������¼�������
	/// @param {Event} �¼�����
	/// @return {Event} �޸�����¼�����
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
		
		// ���̰����¼�
		if (!e.which && ((e.charCode || e.charCode === 0) ? e.charCode : e.keyCode)) {
			e.which = e.charCode || e.keyCode;
		}

		// ��굥���¼���1 == ���; 2 == �м�; 3 == �Ҽ�
		if (!e.which && e.button !== undefined) {
			e.which = (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));
		}

		return e;
	}
};


// ��������
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


/// Ajax����
jRaiser.ajax = {

	/// ����XmlHttpRequest����
	/// @return {XMLHttpRequest} XmlHttpRequest����
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

	/// ����Ajax����
	/// @param {String} �����ַ
	/// @param {String} ���ͷ�ʽ��"GET"��"POST"��Ĭ��ΪGET
	/// @param {Object} ���͵�����
	/// @param {Object} ������ѡ����
	/// @param {XMLHttpRequest} ���ڷ��������XmlHttpRequest�����粻ָ�����Զ�����
	/// @return {XMLHttpRequest} XmlHttpRequest����
	send : function(url, method, data, options, xhr) {
		// ����XMLHttpRequest����
		xhr = xhr || jRaiser.ajax.createXhr();
		var hasCompleted;
		
		// ��������
		"string" === typeof method && (method = method.toUpperCase());
		method = method !== "GET" && method !== "POST" ? "GET" : method;		// Ĭ��ΪGET
		options = options || {};
		options.async = "boolean" === typeof options.async ? options.async : true;
		
		// ���Ӳ�����ֵ��
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
		
		// ��ʱ����(�첽����ʱ����Ч)
		options.async && !isNaN(options.timeout) && options.timeout > 0 && setTimeout(function() {
			if (!hasCompleted) {
				xhr.abort();
				options.onTimeout && options.onTimeout(xhr);
			}
		}, options.timeout);
		
		// �趨״̬�任ʱ���¼�
		xhr.onreadystatechange = function() {
			if (4 == xhr.readyState) {
				hasCompleted = true;
				var eventName = 200 == xhr.status ? "onSuccess" : "onError";
				options[eventName] && options[eventName](xhr);
			}
		};
		
		// �����Ӳ���������
		xhr.open(method, url, options.async, options.username, options.password);
		
		var contentType = [];
		"POST" === method && contentType.push("application/x-www-form-urlencoded");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		// ����header
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

	/// ��̬�����ⲿJavascript�ļ�
	/// @param {String} �ļ���ַ
	/// @param {Function} ������ɺ�ִ�еĻص�����
	/// @param {String} ����
	/// @param {Object} �ĵ�����Ĭ��Ϊ��ǰ�ĵ�
	importJs : function(url, onComplete, charset, doc) {
		doc = doc || document;
		
		var script = doc.createElement("script");
		script.language = "javascript"; script.type = "text/javascript";
		charset && (script.charset = charset);

		// ��ȡ���Ĳ���
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


// Cookie����ʱ���ʽ
var EXPIRESWITHUNIT = /[smhdMy]$/,
	TIMEUNITS = {
		s : 1,
		m : 60,
		h : 60 * 60,
		d : 24 * 60 * 60,
		M : 30 * 24 * 60 * 60,
		y : 365 * 24 * 60 * 60
	};

/// Cookie����
jRaiser.cookie = {
	
	/// ���뺯��
	encoder : window.encodeURIComponent,
	
	/// ���뺯��
	decoder : window.decodeURIComponent,

	/// ��ȡCookieֵ
	/// @param {String} Cookie��
	/// @param {Boolean} noUndefined �Ƿ�������undefined
	/// @return {String} Cookieֵ
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

	/// д��Cookieֵ
	/// @param {String} Cookie��
	/// @param {Mixed} Cookieֵ
	/// @param {Number,Date,String} ����ʱ��
	/// @param {String} ��Ĭ��Ϊ��ǰҳ
	/// @param {String} ·����Ĭ��Ϊ��ǰ·��
	/// @param {Boolean} �Ƿ����Cookie���͸��ܱ����ķ���������(https)��Ĭ��Ϊ��
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

	/// ɾ��Cookie
	/// @param {String} Cookie��
	/// @param {String} ��
	/// @param {String} ·��
	del : function(name, domain, path) {
		document.cookie = jRaiser.cookie.encoder(name) + "=" + (path ? ";path=" + path : "") + (domain ? ";domain=" + domain : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
	}
};


var whiteSpaces = /^\s+|\s+$/g;
/// ȥ����ǰ�ַ������˵�ĳ���ַ���
/// @param {String} Ҫȥ�����ַ�����Ĭ��Ϊ�հ�
/// @return {String} ��������ַ���
!String.prototype.trim && (String.prototype.trim = function() { return this.replace(whiteSpaces, ""); });

/// ����߿�ʼ��ȡһ�����ȵ����ַ���
/// @param {Number} ����
/// @return {String} ���ַ���
String.prototype.left = function(n) { return this.substr(0, n); };

/// ���ұ߿�ʼ��ȡһ�����ȵ����ַ���
/// @param {Number} ����
/// @return {String} ���ַ���
String.prototype.right = function(n) { return this.slice(-n); };

/// ��ʽ���ַ���
/// @param {String} Ҫ��ʽ�����ַ���
/// @param {String} ����
/// @return {String} ��ʽ������ַ���
String.format = function(str) {
	var args = arguments, re = new RegExp("%([1-" + args.length + "])", "g");
	return String(str).replace(re, function($0, $1) {
		return args[$1];
	});
};

/// Ϊ������this�Ͳ���
/// @param {Mixed} ���Ϊthis�Ķ���
/// @param {Mixed} ����
/// @return {Function} ��this�Ͳ����ĺ���
Function.prototype.bind = function() {
	if (!arguments.length) { return this; }
	var method = this, args = slice.call(arguments), object = args.shift();
	return function() {
		return method.apply(object, args.concat(slice.call(arguments)));
	};
};

/// �ڵ�ǰ�����м���ָ��Ԫ��
/// @param {Mixed} ָ��Ԫ��
/// @param {Number} ��ʼ������λ�ã�Ĭ��Ϊ0
/// @return {Number} ָ��Ԫ���������е�һ��ƥ����������������Ԫ�ز������������У�����-1
!Array.prototype.indexOf && (Array.prototype.indexOf = function(elt, from) {
	var len = this.length, from = Number(from) || 0; 
	from = from < 0 ? Math.ceil(from) : Math.floor(from);
	from < 0 && (from += len);

	for (; from < len; from++) {
		if (this[from] === elt)  { return from; }
	}

	return -1;
});

/// ɾ����ǰ����ָ��λ�õ�Ԫ��
/// @param {Number} ָ��λ��
/// @return {Array} ��ǰ����
Array.prototype.remove = function(n) {
	n >= 0 && this.splice(n, 1);
	return this;
};


// ������ת������λ�����ַ���
function toTwoDigit(num) { return num < 10 ? "0" + num : num; }

// ��ʱ��¼����ת��������
var tempYear, tempMonth, tempDate, tempHour, tempMinute, tempSecond;

// ��ʽ�滻����
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

/// ���ص�ǰ���ڵĺ����ʾ
/// @param {Number} ��ǰ���ڵĺ����ʾ
Date.now = Date.now || function() { return +new Date; }

/// ����ָ����ʽ�������ַ���
/// @param {String} ��ʽ
/// @return {String} ָ����ʽ�������ַ���
Date.prototype.format = function(formation) {
	tempYear = this.getFullYear();
	tempMonth = this.getMonth() + 1;
	tempDate = this.getDate();
	tempHour = this.getHours();
	tempMinute = this.getMinutes();
	tempSecond = this.getSeconds();

	return formation.replace(/y+|m+|d+|h+|s+|H+|M+/g, getDatePart);
};


// ������Դ
testElem = null;


/// ����Ч��
jRaiser.ui = {};

// ˳�򲥷�
function playByAsc(curSeq, total) { return (curSeq + 1) % total; }
// ���򲥷�
function playByDesc(curSeq, total) { return curSeq <= 0 ? total - 1 : (curSeq - 1) % total; }

/// �л�������
/// @param {Array,HtmlCollection} �����л���Ԫ������
/// @param {Array,HtmlCollection} ����Ԫ������
/// @param {String} �л�ʱ���ӵ���ʽ
/// @param {String} �¼���
/// @param {Number} ���ż����0��ʡ��Ϊ������
/// @param {Number} �����ӳ�
jRaiser.ui.Slide = function(ctrls, contents, css, eventName, interval, delay) {
	if (!arguments.length) { return; }
	
	var t = this;
	t.total = contents.length;
	if (ctrls && t.total !== ctrls.length) {		// ����������������Ƿ���һһƥ��
		throw "can not match ctrls(" + ctrls.length + ") and contents(" + t.total + ")";
	}
	
	t.constructor = arguments.callee;	// ���Ĺ��캯��
	
	t._curIndex = -1;		// ��ǰ���ʼ��ʱΪ-1
	t._ctrls = ctrls; t._contents = contents;
	t._css = css;
	t._eventName = eventName;
	
	t.interval = interval;		// ���ż��
	t.playMode = playByAsc;		// Ĭ��˳�򲥷�
	t.rollbackMode = playByDesc;	// Ĭ�ϻ���ģʽ
	t.delay = delay;			// �����ӳ�
	
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
// �л������෽��
jRaiser.ui.Slide.prototype = {
	
	/// ��ʾĳһ��
	/// @param {Number} ���
	show : function(index) {
		var t = this;
		index = index < 0 ? 0 : index >= t.total ? t.total - 1 : index;		// ����index��ֵ
		var ctrl = t._ctrls ? t._ctrls[index] : null, content = t._contents[index];
		
		if (-1 === t._curIndex) { t._curIndex = 0; }
		
		// �Ƴ���ǰ����ʽ
		jRaiser.style.removeCss(t._ctrls, t._css);
		jRaiser.style.removeCss(t._contents, t._css);
		
		// ����һ�������ʽ
		jRaiser.style.addCss(ctrl, t._css);
		jRaiser.style.addCss(content, t._css);
		
		t.onShow && t.onShow(index, ctrl, content)
		
		t._curIndex = index;
	},
	
	/// ��ʾ��һ��
	showNext : function() {
		this.show(this.playMode(this._curIndex, this.total));
	},
	
	/// ��ʾ��һ��
	showPrevious : function() {
		this.show(this.rollbackMode(this._curIndex, this.total));
	},
	
	/// ��ʼ����
	/// @param {Number} ���ż��
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
	
	/// ��ͣ����
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

    ///��ʱ����
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