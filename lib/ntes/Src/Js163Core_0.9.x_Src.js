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
 *		���String.prototype.trim��Ч��
 *		���$.Element.addEvent��Ч��
 *		�Ľ�selector���棬����ΪMiniSelDom(�������ܰ汾��SelDom)
 *		���������жϸ���Ϊ===/!==
 *		����toArray���������$.Util.toArray�������ڲ������ٶ�
 *		����$.Ajax.send�е�hasCompletedΪ�ֲ�����
 *
 *	Ver 0.9.6.1
 *		���쳣���׳�
 *		�Ľ�selector����
 *		���eachԪ����չ��������޸�Ԫ����չ��ʵ��
 *		Array.prototype.merge��Ϊ$.Util.merge�����ڻ�������������(��ȥ�ظ�)
 *
 *	Ver 0.9.6.2
 *		����window��document����addEvent���ֵĴ���
 *		����float��ʽ���ļ����ԣ�IE����styleFloat��FF����cssFloat
 *
 *	Ver 0.9.6.3
 *		�Ż�$������������
 *		�Ż�ѡ���������ִ��Ч���Լ���XML�ļ�����
 *		������Css�ַ���������bug��addCss��removeCss����Ҫ������鵽$.style
 *		�Ż�String.prototype.trim
 *
 *	Ver 0.9.6.4
 *		����removeCss�Զ����������ʱ��BUG
 *
 *	Ver 0.9.6.5
 *		��ֹ�ظ�����
 *		������°汾�ĳ�ͻ
 */
 
 
// ������°汾�ĳ�ͻ
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
 

var undefined,		// ���ٶ�undefined��Ӧ��

	// <summary>���������ļ�CSSѡ������ȡHTMLԪ��</summary>
	// <param name="selector">CSSѡ�������ʽ</param>
	// <param name="context">������</param>
	// <returns>ƥ�䵽�ľ���չ��HTMLԪ��</returns>
	NTES = window.NTES = window.$ = function(selector, context) {
		if (null == selector || selector.$) {		// ���selector�����ڻ�����չ������$��������ֱ�ӷ���
			return selector;
		}
		
		var elems;
		if ("string" === typeof selector) {
			// ���������ȼ���context -> this -> document
			context = context || (this.alert ? document : this);
			// ͨ��selector��ȡԪ��
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


// <summary>��ʶ��ǰ�汾</summary>
NTES.version = "0.9.6.5 Build 200908051005";


// <summary>MiniSelDom Selector Engine</summary>
var MiniSelDom = {
	
	SPACE : /\s*([\s>~+,])\s*/g,	// ����ȥ�ո�
	ISSIMPLE : /^#?([\w\u00c0-\uFFFF_-]+)$/,		// �ж��Ƿ��ѡ����(ֻ��id��tagname)
	IMPLIEDALL : /([>\s~\+,]|^)([#\.\[:])/g,		// ���ڲ�ȫѡ����
	ATTRALUES : /=(["'])([^'"]*)\1]/g,				// �����滻����������������ֵ
	ATTR : /\[\s*([\w\u00c0-\uFFFF_-]+)\s*(?:(\S?\=)\s*(.*?))?\s*\]/g,	// �����滻����ѡ����
	BEGINIDAPART : /^(?:\*#([\w\u00c0-\uFFFF_-]+))/,		// ���ڷ��뿪ͷ��idѡ����
	STANDARD : /^[>\s~\+:]/,		// �ж��Ƿ��׼ѡ����(�Կո�>��~��+��ͷ)
	STREAM: /[#\.>\s\[\]:~\+]+|[^#\.>\s\[\]:~\+]+/g,	// ���ڰ�ѡ�������ʽ����ɲ�����/������ ����
	ISINT : /^\d+$/,	// �ж��Ƿ�����

	tempAttrValues : [],	// ��ʱ��¼����/˫���ż������ֵ
	tempAttrs : [],		// ��ʱ��¼���Ա��ʽ
	
	idName : "uniqueidforntes",
	id : 0,
	
	// <summary>����CSSѡ������ں���</summary>
	// <param name="selector">CSSѡ�������ʽ</param>
	// <param name="context">������</param>
	query : function(selector, context) {
		
		var result,			// �����
			selectors,		// selector����
			selCount,		// selector���鳤��
			i, j,			// ѭ������
			temp,			// һ��selector��ÿ���������Ͳ��������������
			matchs,			// ������/������ ����
			streamLen,		// ������/������ ���鳤��
			token,			// ������
			filter;			// ������
		
		// �������Ŀհ�
		selector = selector.trim();
		
		if ("" === selector) {
			return;
		}
		
		// �Ż���ѡ���
		if (this.ISSIMPLE.test(selector)) {
			if (0 === selector.indexOf("#") && typeof context.getElementById !== "undefined") {
				//alert("simple id: " + selector);	// @debug
				return this.getElemById(context, selector.substr(1));
			} else if (typeof context.getElementsByTagName !== "undefined") {
				//alert("simple tagname: " + selector);	// @debug
				return toArray(context.getElementsByTagName(selector));
			}
		}
		
		// ת�������飬ͳһ����
		if (!isArray(context)) {
			context = context.nodeType ? [context] : toArray(context);
		}
		
		selectors = selector.replace(this.SPACE, "$1")		// ȥ�հ�
							.replace(this.ATTRALUES, this.analyzeAttrValues)	// �滻����ֵ
							.replace(this.ATTR, this.analyzeAttrs)	// �滻����ѡ���
							.replace(this.IMPLIEDALL, "$1*$2")		// ��ӱ�Ҫ��"*"(����.class1 => *.class1)
							.split(",");	// ������ѡ����
		selCount = selectors.length;

		i = -1; result = [];

		while (++i < selCount) {
			// ����������
			temp = context;
			
			selector = selectors[i];
			
			// �Ż���idѡ������ͷ����������document�����
			if (this.BEGINIDAPART.test(selector)) {
				if (typeof context[0].getElementById !== "undefined") {
					//alert("begin with id selector: " + RegExp.$1);	// @debug
					temp = [this.getElemById(context[0], RegExp.$1)];
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
				if (!this.STANDARD.test(selector)) {
					selector = " " + selector;
				}
				
				// ���뻻���ַ������飬��0��ʼ˫���ǲ������������ǲ�����(���� " *.class1" => [" ", "*", ".", "class1"])
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
		
		// �����ʱ����
		this.tempAttrValues.length = this.tempAttrs.length = 0;
		
		return result.length > 1 ? this.unique(result) : result;
		//return result;
	},
	
	// <summary>�����滻������</summary>
	analyzeAttrs : function($1, $2, $3, $4) {
		return "[]" + (MiniSelDom.tempAttrs.push([$2, $3, $4]) - 1);
	},
	
	// <summary>����ֵ�滻������</summary>
	analyzeAttrValues : function($1, $2, $3) {
		return "=" + (MiniSelDom.tempAttrValues.push($3) - 1) + "]";
	},
	
	// <summary>��ȡ���ظ���id</summary>
	// <param name="elem">Ԫ��</param>
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
	
	// <summary>ȥ�ظ�</summary>
	// <param name="elems">Ԫ������</param>
	// <returns>ȥ�ظ�������</returns>
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
	
	// <summary>������ӳ��</summary>
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	
	// <summary>��ȡԪ������</summary>
	// <param name="elem">Ԫ��</param>
	// <param name="attrName">������</param>
	// <returns>����ֵ</returns>
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
	
	// <summary>ͨ��id��ȡԪ��</summary>
	// <param name="context">�����ģ�һ����document</param>
	// <param name="id">id</param>
	// <returns>Ԫ��</returns>
	getElemById : function(context, id) {
		var result = context.getElementById(id);
		if (result && result.id !== id && context.all) {	// �޸�IE�µ�id/name bug
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
	
	// <summary>ͨ����ǩ����ȡָ�����λ�õ�Ԫ��</summary>
	// <param name="context">������</param>
	// <param name="first">��һ��Ԫ�����λ��</param>
	// <param name="next">��һ��Ԫ�����λ��</param>
	// <param name="limit">Ԫ����������</param>
	// <returns>���</returns>
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
	
	// <summary>��������ֵ����Ԫ��</summary>
	// <param name="context">������</param>
	// <param name="filter">��������</param>
	// <returns>���˽��</returns>
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
	
	// <summary>������</summary>
	operators : {
		
		// <summary>idѡ���</summary>
		// <param name="context">������</param>
		// <param name="id">id</param>
		// <returns>���˺�Ľ��</returns>
		"#" : function(context, id) {
			return MiniSelDom.getElemsByAttribute(context, ["id", "=", id]);
		},
		
		// <summary>���ѡ���</summary>
		// <param name="context">������</param>
		// <param name="tagName">��ǩ��</param>
		// <returns>���˺�Ľ��</returns>
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
		
		// <summary>����ѡ���</summary>
		// <param name="context">������</param>
		// <param name="className">����</param>
		// <returns>���˺�Ľ��</returns>
		"." : function(context, className) {
			return MiniSelDom.getElemsByAttribute(context, ["class", "~=", className]);
		},
		
		// <summary>��Ԫ��ѡ���</summary>
		// <param name="context">������</param>
		// <param name="tagName">��ǩ��</param>
		// <returns>���˺�Ľ��</returns>
		">" : function(context, tagName) {
			return MiniSelDom.getElemsByTagName(context, "firstChild", "nextSibling", tagName);
		},
		
		// <summary>����ѡ�������@a=b([a=b])</summary>
		// <param name="context">������</param>
		// <param name="filter">����ƥ�������±�</param>
		// <returns>���˺�Ľ��</returns>
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
	
	// <summary>���Բ�����</summary>
	attrOperators : {
		
		// <summary>�Ƿ����ָ������ֵ</summary>
		// <param name="value">ʵ������ֵ</param>
		// <param name="input">�ܼ�������ֵ</param>
		// <returns>�Ƿ��������</returns>
		"" : function(value) {
			return value !== "";
		},
		
		// <summary>�Ƿ���ָ������ֵ���</summary>
		// <param name="value">ʵ������ֵ</param>
		// <param name="input">�ܼ�������ֵ</param>
		// <returns>�Ƿ��������</returns>
		"=" : function(value, input) {
			return input === value;
		},

		// <summary>�Ƿ����ָ������ֵ</summary>
		// <param name="value">ʵ������ֵ</param>
		// <param name="input">�ܼ�������ֵ</param>
		// <returns>�Ƿ��������</returns>
		"~=" : function(value, input) {
			  return (" " + value + " ").indexOf(input) >= 0;
		},
		
		// <summary>�Ƿ���ָ������ֵ����</summary>
		// <param name="value">ʵ������ֵ</param>
		// <param name="input">�ܼ�������ֵ</param>
		// <returns>�Ƿ��������</returns>
		"!=" : function(value, input) {
			return input !== value;
		}
	}
};


// <summary>HTMLԪ�ػ������������ڼ̳�</summary>
NTES.Element = {
	
	// <summary>�Ե�ǰԪ��Ϊ�����Ļ�ȡԪ��</summary>
	// <param name="selector">ѡ����</param>
	// <param name="context">������(����)</param>
	// <returns>ƥ�䵽�ľ���չ��HTMLԪ��</returns>
	$ : function(selector, context) {
		return NTES.call(this, selector, context);
	},

	// <summary>�����ʽ</summary>
	// <param name="css">��������ʽ�ַ���</param>
	// <returns>��ǰԪ��</returns>
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
	
	// <summary>ɾ����ʽ</summary>
	// <param name="css">��������ʽ�ַ���</param>
	// <returns>��ǰԪ��</returns>
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
	
	// <summary>����¼�</summary>
	// <param name="eventName">�¼���</param>
	// <param name="handler">�¼�������</param>
	// <returns>��ǰԪ��</returns>
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
	
	// <summary>��ÿ��Ԫ��ִ��һ�������������е�thisָ��Ԫ��</summary>>
	// <param name="callback">�������</param>
	// <param name="args">��������</param>
	// <returns>��ǰԪ��</returns>
	each : function(callback, args) {
		if (isArray(this)) {
			var i = -1, len = this.length;
			// �ݹ�ִ��
			while (++i < len) {
				callback.apply(this[i], args);
			}
		} else {
			callback.apply(this, args);
		}
		return this;
	},
	
	// <summary>�ѵ�ǰ����ת��Ϊ����</summary>
	// <returns>������ǰ���������</returns>
	toArray : function() {
		if (isArray(this)) {
			return this;
		} else {
			return [this];
		}
	}
};


// <summary>CSS��ʽ������</summary>
var Css = {
	// ��CSS��ʽ���н��͵�������ʽ
	NAMETOFIX : /\-([a-z])/gi,
	FIXFLOAT : /(^|:|;)float(?=:|;|$)/gi,
	FLOATNAME : document.createElement("div").style.styleFloat != null ? "styleFloat" : "cssFloat",
	SPLITER : /([^:;]+)/g,
	SPACE : /\s*([:;\s])\s*/g,
	STYLENAME : /([^:;]+)(?=:)/g,
	CLASSSPLITER : /\s+/,
	
	// <summary>ʶ����ʽ�ַ���</summary>
	// <param name="css">��ʽ�ַ���</param>
	// <returns>��ʶ��ʽ���͵���ʽ������</returns>
	parse : function(css) {
		css = css.trim().replace(this.SPACE, "$1");	// ȥ�ո�
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
	
	// <summary>ת��Ϊjs��׼����ʽ������</summary>
	fixName : function($1, $2) {
		return $2.toUpperCase();
	},
	
	// <summary>�޸�float��ʽ��</summary>
	fixFloat : function($1, $2, $3) {
		return $2 + Css.FLOATNAME + $3;
	}
};


// <summary>�������Ƿ�����</summary>
// <param name="testVar">�������</param>
// <returns>��������Ƿ�����</returns>
var isArray = function(testVar) {
	return Object.prototype.toString.call(testVar) === "[object Array]";
};


// ƥ��ģ���е�ֵ
var tplValues = /#@(\w+)#/g;

// <summary>�����ࡢ���ߺ���</summary>
NTES.Util = {
	
	// <summary>�Ѽ���ת��Ϊ����</summary>
	// <param name="col">����</param>
	// <returns>ת���������</returns>
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
	
	// <summary>ģ��ת��</summary>
	// <param name="tpl">ģ�����</param>
	// <param name="values">ֵ����</param>
	// <param name="re">ƥ��ֵ��������ʽ</param>
	// <returns>ת����Ĵ���</returns>
	parseTpl : function(tpl, values, re) {
		return values ? String(tpl).replace(
			re || tplValues,
			function($1, $2) {
				return values[$2] != null ? values[$2] : $1;
			}
		) : tpl;
	},
	
	// <summary>��Դ��������Ժͷ�����չ��Ŀ�������</summary>
	// <param name="des">Ŀ�����</param>
	// <param name="src">Դ����</param>
	// <returns>����չ��Ŀ�����</param>
	extend : function(des, src) {
		for (var p in src) {
			des[p] = src[p];
		}
		return des;
	},
	
	// <summary>�ϲ�����</summary>
	// <param name="first">ԭ���飬����Ϊ��������</param>
	// <param name="second">��������飬����������������</param>
	// <returns>��Ϻ��ԭ����</returns>
	merge : function(first, second) {
		var i = 0, elem, pos = first.length;
		while ((elem = second[i++]) != null) {
			first[pos++] = elem;
		}
		return first;
	}
};

// �����ڲ�����
var toArray = NTES.Util.toArray, merge = NTES.Util.merge;


// ��ȡ�ͻ�����Ϣ
var userAgent = navigator.userAgent.toLowerCase();
// <summary>�����������</summary>
NTES.Browser = {
	version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0,'0'])[1],
	safari: /webkit/.test(userAgent),
	opera: /opera/.test(userAgent),
	msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
	mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
};


// <summary>AJAX��ز���</summary>
NTES.Ajax = {
	
	// <summary>����XmlHttpRequest����</summary>
	// <returns>XmlHttpRequest����</returns>
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
	
	// <summary>����Ajax����</summary>
	// <param name="url">�����ַ</param>
	// <param name="method">���ͷ�ʽ��POST��GET</param>
	// <param name="data">���͵�����</param>
	// <param name="options">������ѡ����</param>
	// <param name="xhr">���ڷ��������XmlHttpRequest�����粻ָ�����Զ��½�</param>
	// <returns>��ǰXMLHttpRequest����</returns>
	send : function(url, method, data, options, xhr) {
		// ����XMLHttpRequest����
		xhr = xhr || this.createXhr();
		var hasCompleted;
		
		// ��������
		method = method.toUpperCase();
		method = method !== "GET" && method !== "POST" ? "GET" : method;		// Ĭ��ΪGET
		options = options || {};
		options.async = "boolean" === typeof options.async ? options.async : true;
		
		// ���Ӳ�����ֵ��
		var postData;
		if (data) {
			postData = [];
			for (var d in data) {
				postData.push(d + "=" + encodeURIComponent(data[d]));
			}
			postData = postData.join("&").replace(/%20/g, "+");
		}
		
		// ��ʱ����(�첽����ʱ����Ч)
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
		
		// �趨״̬�任ʱ���¼�
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
		
		// �����Ӳ���������
		xhr.open(method, url, options.async, options.username, options.password);

		// ����header
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
	
	// <summary>�����ⲿJavascript�ļ�</summary>
	// <param name="url">js�ļ���ַ</param>
	// <param name="onComplete">��ȡ��ɺ�ִ�е��¼�</param>
	// <param name="charset">js�ļ�����</param>
	importJs : function(url, onComplete, charset) {
		// ȡ��ͷ���ڵ������
		var head = document.getElementsByTagName("head")[0], script = document.createElement("script");
		// ���ýڵ�����
		script.src = url; script.language = "javascript"; script.type = "text/javascript";
		if (charset) {
			script.charset = charset;
		}

		// �趨��ȡ���Ժ�Ĳ���
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


// <summary>Cookie��������</summary>
NTES.Cookie = {
	
	// ���뺯��
	encoder : escape,
	
	// ���뺯��
	decoder : unescape,
	
	// <summary>��ȡCookieֵ</summay>
	// <param name="name">Cookie��</param>
	// <returns>Cookieֵ</returns>
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
	
	// <summary>����Cookieֵ</summary>
	// <param name="name">Cookie��</param>
	// <param name="value">Cookieֵ</param>
	// <param name="expire">����ʱ�䣨���ӣ�</param>
	// <param name="domain">��</param>
	// <param name="path">·��</param>
	// <param name="secure">�Ƿ����Cookie���͸��ܱ����ķ�����</param>
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
	
	// <summary>ɾ��Cookie</summary>
	// <param name="name">Cookie��</param>
	// <param name="domain">��</param>
	// <param name="path">·��</param>
	del : function(name, domain, path) {
		document.cookie = this.encoder(name) + "=" + (path != null && path !== "" ? ";path=" + path : "") + (domain ? ";domain=" + domain : "" ) + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
	}
	
};


// <suummary>�¼���������</summary>
NTES.Event = {
	
	// <summary>�޸���ͬ��������¼�������</summary>
	// <param name="e">�¼�����</param>
	// <returns>�޸�����¼�����</returns>
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


// <summary>˳�򲥷�</summary>
var playByAsc = function(curSeq, total) { return (curSeq + 1) % total; };

// <summary>���潻��</summary>
NTES.UI = {
	
	// <summary>�л�������</summary>
	// <param name="ctrls">�����л���Ԫ������</param>
	// <param name="contents">����Ԫ������</param>
	// <param name="css">�л�ʱ���ӵ�Css</param>
	// <param name="eventName">�����л����¼���</param>
	// <param name="interval">���ż����0Ϊ������</param>
	Slide : function(ctrls, contents, css, eventName, interval) {
		var total = contents.length;
		if (ctrls && total !== ctrls.length) {		// ����������������Ƿ���һһƥ��
			throw "can not match ctrls(" + ctrls.length + ") and contents(" + total + ")";
		}
	
		var curSeq = -1,		// ��ǰ�����
			timerId,			// ��ʱ�����
			showNext,			// ���ź���
			onShow,				// �л�ʱ�������¼�
			getNextSeq = playByAsc,		// ��ǰ���Ų��ԣ�Ĭ��˳�򲥷�
			hasEvent,			// �Ƿ�������Զ���������¼�
			show, play, pause;	// �ڲ�����ָ�룬�ñհ�����this����
		ctrls = NTES(ctrls || []); contents = NTES(contents);		// ��չԪ������
		
		// <summary>���ò��Ų���</summary>
		// <param name="mode">������һ��������ŵĺ���</param>
		this.setPlayMode = function(mode) {
			getNextSeq = mode;
		};
		
		// <summary>�����л�ʱ�������¼�</summary>
		// <param name="handler">�¼�����</param>
		this.setOnShow = function(handler) {
			onShow = handler;
		};
		
		// <summary>��ʾĳһ��</summary>
		// <param name="seq">���</param>
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
		
		// <summary>���ź���</summary>
		showNext = this.showNext = function() {
			if (-1 == curSeq) { curSeq = 0; }
			show(getNextSeq(curSeq, total));
		};
		
		// <summary>��ʼ����</summary>
		// <param name="playInterval">���ż��</param>
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
	
		// <summary>��ͣ����</summary>
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


// <summary>ȥ����ǰ�ַ������˵�ĳ���ַ�����Ĭ��Ϊȥ�����˵Ŀհ�</summary>
// <param name="str">Ҫȥ�����ַ���</param>
// <returns>��������ַ���</returns>
String.prototype.trim = function(str) {
	return this.replace(null == str ? /^\s+|\s+$/g : new RegExp("^" + str + "+|" + str + "+$", "g"), "");
};

// <summary>��鵱ǰ�ַ������Ƿ������ָ���ָ���������һ�����ַ���</summary>
// <param name="str">Ҫ���ҵ����ַ���</param>
// <param name="spliter">�ָ���</param>
// <returns>�Ƿ�������ַ���</returns>
String.prototype.has = function(str, spliter) {
	return "string" === typeof spliter ? (spliter + this + spliter).indexOf(spliter + str + spliter) >= 0 : this.indexOf(str) >= 0;
};

// <summary>�ַ�����ʽ��</summary>
// <param name="str">Ҫ��ʽ�����ַ���</param>
// <param name="arguments[1...n]">����ֵ</param>
// <returns>��ʽ������ַ���</returns>
String.format = function(str) {
	var args = arguments, re = new RegExp("%([1-" + args.length + "])", "g");
	return String(str).replace(
		re,
		function($1, $2) {
			return args[$2];
		}
	);
};

// <summary>Ϊ������this</summary>
// <returns>��thisָ���ĺ���</returns>
Function.prototype.bind = function() {
	if (!arguments.length || null == arguments[0]) {
		return this;
	}
    var method = this, args = Array.prototype.slice.call(arguments), object = args.shift();
    return function() {
		return method.apply(object, args.concat(Array.prototype.slice.call(arguments)));
    };
};

// <summary>�����������Ƿ����ָ��Ԫ��(FF�����д˷���)</summary>
// <param name="elem">ָ��Ԫ��</param>
// <param name="startPos">��ʼ������λ��</param>
// <returns>ָ��Ԫ���������е�λ��</returns>
Array.prototype.indexOf = Array.prototype.indexOf || function(elem, startPos) {
	var i = isNaN(startPos) || startPos < 0 ? -1 : startPos - 1, len = this.length;
	while (++i < len) {
		if (this[i] === elem) {
			return i;
		}
	}
	return -1;
}; 

// ��дtoArray����
window.toArray = document.toArray = function() {
	return [this];
};
// ���each����
window.each = document.each = function(callback, args) {
	callback.apply(this, args);
	return this;
};
// window����document���������¼�����
window.addEvent = document.addEvent = NTES.Element.addEvent;

})();