/*!
 * jRaiser 2 Javascript Library
 * dom-base - v1.0.0 (2013-01-09T09:43:02+0800)
 * http://jraiser.org/ | Released under MIT license
 */
define("dom/1.0.x/dom-base",null,function(e,t,n){"use strict";var r="_jRaiserNodeId_",i=0,s=/\s+/;return{isNode:function(e){return"nodeType"in e},isXMLNode:function(e){var t=(e.ownerDocument||e).documentElement;return t?t.nodeName!=="HTML":!1},isWindow:function(e){return e!=null&&e==e.window},getWindow:function(e){return this.isWindow(e)?e:e.nodeType===9?e.defaultView||e.parentWindow:!1},uniqueId:function(e){var t=e[r]=e[r]||new Number(++i);return t.valueOf()},removeUniqueId:function(e){delete e[r]},splitBySpace:function(e){return typeof e=="string"&&(e=e.split(s)),e==null||e.length===0?null:e}}})