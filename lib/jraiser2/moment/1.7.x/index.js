/*!
 * jRaiser 2 Javascript Library
 * moment - v1.7.2 (2013-01-09T18:22:27+0800)
 * http://jraiser.org/ | Released under MIT license
 *
 * Include moment.js (http://momentjs.com/)
 */
define("moment/1.7.x/",null,function(e,t,n){(function(t){function _(e,t,n,r){var i=n.lang();return i[e].call?i[e](n,r):i[e][t]}function D(e,t){return function(n){return F(e.call(this,n),t)}}function P(e){return function(t){var n=e.call(this,t);return n+this.lang().ordinal(n)}}function H(e,t,n){this._d=e,this._isUTC=!!t,this._a=e._a||null,this._lang=n||!1}function B(e){var t=this._data={},n=e.years||e.y||0,r=e.months||e.M||0,i=e.weeks||e.w||0,s=e.days||e.d||0,o=e.hours||e.h||0,u=e.minutes||e.m||0,a=e.seconds||e.s||0,f=e.milliseconds||e.ms||0;this._milliseconds=f+a*1e3+u*6e4+o*36e5,this._days=s+i*7,this._months=r+n*12,t.milliseconds=f%1e3,a+=j(f/1e3),t.seconds=a%60,u+=j(a/60),t.minutes=u%60,o+=j(u/60),t.hours=o%24,s+=j(o/24),s+=i*7,t.days=s%30,r+=j(s/30),t.months=r%12,n+=j(r/12),t.years=n,this._lang=!1}function j(e){return e<0?Math.ceil(e):Math.floor(e)}function F(e,t){var n=e+"";while(n.length<t)n="0"+n;return n}function I(e,t,n){var r=t._milliseconds,i=t._days,s=t._months,o;r&&e._d.setTime(+e+r*n),i&&e.date(e.date()+i*n),s&&(o=e.date(),e.date(1).month(e.month()+s*n).date(Math.min(o,e.daysInMonth())))}function q(e){return Object.prototype.toString.call(e)==="[object Array]"}function R(e,t){var n=Math.min(e.length,t.length),r=Math.abs(e.length-t.length),i=0,s;for(s=0;s<n;s++)~~e[s]!==~~t[s]&&i++;return i+r}function U(e,t,n,r){var i,s,o=[];for(i=0;i<7;i++)o[i]=e[i]=e[i]==null?i===2?1:0:e[i];return e[7]=o[7]=t,e[8]!=null&&(o[8]=e[8]),e[3]+=n||0,e[4]+=r||0,s=new Date(0),t?(s.setUTCFullYear(e[0],e[1],e[2]),s.setUTCHours(e[3],e[4],e[5],e[6])):(s.setFullYear(e[0],e[1],e[2]),s.setHours(e[3],e[4],e[5],e[6])),s._a=o,s}function z(t,n){var i,s,o=[];!n&&f&&(n=e("./lang/"+t));for(i=0;i<l.length;i++)n[l[i]]=n[l[i]]||u.en[l[i]];for(i=0;i<12;i++)s=r([2e3,i]),o[i]=new RegExp("^"+(n.months[i]||n.months(s,""))+"|^"+(n.monthsShort[i]||n.monthsShort(s,"")).replace(".",""),"i");return n.monthsParse=n.monthsParse||o,u[t]=n,n}function W(e){var t=typeof e=="string"&&e||e&&e._lang||null;return t?u[t]||z(t):r}function X(e){return e.match(/\[.*\]/)?e.replace(/^\[|\]$/g,""):e.replace(/\\/g,"")}function V(e){var t=e.match(h),n,r;for(n=0,r=t.length;n<r;n++)M[t[n]]?t[n]=M[t[n]]:t[n]=X(t[n]);return function(i){var s="";for(n=0;n<r;n++)s+=typeof t[n].call=="function"?t[n].call(i,e):t[n];return s}}function $(e,t){function r(t){return e.lang().longDateFormat[t]||t}var n=5;while(n--&&p.test(t))t=t.replace(p,r);return L[t]||(L[t]=V(t)),L[t](e)}function J(e){switch(e){case"DDDD":return g;case"YYYY":return y;case"S":case"SS":case"SSS":case"DDD":return m;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":case"a":case"A":return b;case"Z":case"ZZ":return w;case"T":return E;case"MM":case"DD":case"YY":case"HH":case"hh":case"mm":case"ss":case"M":case"D":case"d":case"H":case"h":case"m":case"s":return v;default:return new RegExp(e.replace("\\",""))}}function K(e,t,n,r){var i,s;switch(e){case"M":case"MM":n[1]=t==null?0:~~t-1;break;case"MMM":case"MMMM":for(i=0;i<12;i++)if(W().monthsParse[i].test(t)){n[1]=i,s=!0;break}s||(n[8]=!1);break;case"D":case"DD":case"DDD":case"DDDD":t!=null&&(n[2]=~~t);break;case"YY":n[0]=~~t+(~~t>70?1900:2e3);break;case"YYYY":n[0]=~~Math.abs(t);break;case"a":case"A":r.isPm=(t+"").toLowerCase()==="pm";break;case"H":case"HH":case"h":case"hh":n[3]=~~t;break;case"m":case"mm":n[4]=~~t;break;case"s":case"ss":n[5]=~~t;break;case"S":case"SS":case"SSS":n[6]=~~(("0."+t)*1e3);break;case"Z":case"ZZ":r.isUTC=!0,i=(t+"").match(N),i&&i[1]&&(r.tzh=~~i[1]),i&&i[2]&&(r.tzm=~~i[2]),i&&i[0]==="+"&&(r.tzh=-r.tzh,r.tzm=-r.tzm)}t==null&&(n[8]=!1)}function Q(e,t){var n=[0,0,1,0,0,0,0],r={tzh:0,tzm:0},i=t.match(h),s,o;for(s=0;s<i.length;s++)o=(J(i[s]).exec(e)||[])[0],o&&(e=e.slice(e.indexOf(o)+o.length)),M[i[s]]&&K(i[s],o,n,r);return r.isPm&&n[3]<12&&(n[3]+=12),r.isPm===!1&&n[3]===12&&(n[3]=0),U(n,r.isUTC,r.tzh,r.tzm)}function G(e,t){var n,r=e.match(d)||[],i,s=99,o,u,a;for(o=0;o<t.length;o++)u=Q(e,t[o]),i=$(new H(u),t[o]).match(d)||[],a=R(r,i),a<s&&(s=a,n=u);return n}function Y(e){var t="YYYY-MM-DDT",n;if(S.exec(e)){for(n=0;n<4;n++)if(T[n][1].exec(e)){t+=T[n][0];break}return w.exec(e)?Q(e,t+" Z"):Q(e,t)}return new Date(e)}function Z(e,t,n,r,i){var s=i.relativeTime[e];return typeof s=="function"?s(t||1,!!n,e,r):s.replace(/%d/i,t||1)}function et(e,t,n){var r=s(Math.abs(e)/1e3),i=s(r/60),o=s(i/60),u=s(o/24),a=s(u/365),f=r<45&&["s",r]||i===1&&["m"]||i<45&&["mm",i]||o===1&&["h"]||o<22&&["hh",o]||u===1&&["d"]||u<=25&&["dd",u]||u<=45&&["M"]||u<345&&["MM",s(u/30)]||a===1&&["y"]||["yy",a];return f[2]=t,f[3]=e>0,f[4]=n,Z.apply({},f)}function tt(e,t){r.fn[e]=function(e){var n=this._isUTC?"UTC":"";return e!=null?(this._d["set"+n+t](e),this):this._d["get"+n+t]()}}function nt(e){r.duration.fn[e]=function(){return this._data[e]}}function rt(e,t){r.duration.fn["as"+e]=function(){return+this/t}}var r,i="1.7.2",s=Math.round,o,u={},a="en",f=typeof n!="undefined"&&n.exports,l="months|monthsShort|weekdays|weekdaysShort|weekdaysMin|longDateFormat|calendar|relativeTime|ordinal|meridiem".split("|"),c=/^\/?Date\((\-?\d+)/i,h=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?|.)/g,p=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?)/g,d=/([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,v=/\d\d?/,m=/\d{1,3}/,g=/\d{3}/,y=/\d{1,4}/,b=/[0-9a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/i,w=/Z|[\+\-]\d\d:?\d\d/i,E=/T/i,S=/^\s*\d{4}-\d\d-\d\d(T(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,x="YYYY-MM-DDTHH:mm:ssZ",T=[["HH:mm:ss.S",/T\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/T\d\d:\d\d:\d\d/],["HH:mm",/T\d\d:\d\d/],["HH",/T\d\d/]],N=/([\+\-]|\d\d)/gi,C="Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"),k={Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6},L={},A="DDD w M D d".split(" "),O="M D H h m s w".split(" "),M={M:function(){return this.month()+1},MMM:function(e){return _("monthsShort",this.month(),this,e)},MMMM:function(e){return _("months",this.month(),this,e)},D:function(){return this.date()},DDD:function(){var e=new Date(this.year(),this.month(),this.date()),t=new Date(this.year(),0,1);return~~((e-t)/864e5+1.5)},d:function(){return this.day()},dd:function(e){return _("weekdaysMin",this.day(),this,e)},ddd:function(e){return _("weekdaysShort",this.day(),this,e)},dddd:function(e){return _("weekdays",this.day(),this,e)},w:function(){var e=new Date(this.year(),this.month(),this.date()-this.day()+5),t=new Date(e.getFullYear(),0,4);return~~((e-t)/864e5/7+1.5)},YY:function(){return F(this.year()%100,2)},YYYY:function(){return F(this.year(),4)},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return~~(this.milliseconds()/100)},SS:function(){return F(~~(this.milliseconds()/10),2)},SSS:function(){return F(this.milliseconds(),3)},Z:function(){var e=-this.zone(),t="+";return e<0&&(e=-e,t="-"),t+F(~~(e/60),2)+":"+F(~~e%60,2)},ZZ:function(){var e=-this.zone(),t="+";return e<0&&(e=-e,t="-"),t+F(~~(10*e/6),4)}};while(A.length)o=A.pop(),M[o+"o"]=P(M[o]);while(O.length)o=O.pop(),M[o+o]=D(M[o],2);M.DDDD=D(M.DDD,3),r=function(e,n){if(e===null||e==="")return null;var i,s;return r.isMoment(e)?new H(new Date(+e._d),e._isUTC,e._lang):(n?q(n)?i=G(e,n):i=Q(e,n):(s=c.exec(e),i=e===t?new Date:s?new Date(+s[1]):e instanceof Date?e:q(e)?U(e):typeof e=="string"?Y(e):new Date(e)),new H(i))},r.utc=function(e,t){return q(e)?new H(U(e,!0),!0):(typeof e=="string"&&!w.exec(e)&&(e+=" +0000",t&&(t+=" Z")),r(e,t).utc())},r.unix=function(e){return r(e*1e3)},r.duration=function(e,t){var n=r.isDuration(e),i=typeof e=="number",s=n?e._data:i?{}:e,o;return i&&(t?s[t]=e:s.milliseconds=e),o=new B(s),n&&(o._lang=e._lang),o},r.humanizeDuration=function(e,t,n){return r.duration(e,t===!0?null:t).humanize(t===!0?!0:n)},r.version=i,r.defaultFormat=x,r.lang=function(e,t){var n;if(!e)return a;(t||!u[e])&&z(e,t);if(u[e]){for(n=0;n<l.length;n++)r[l[n]]=u[e][l[n]];r.monthsParse=u[e].monthsParse,a=e}},r.langData=W,r.isMoment=function(e){return e instanceof H},r.isDuration=function(e){return e instanceof B},r.lang("en",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},meridiem:function(e,t,n){return e>11?n?"pm":"PM":n?"am":"AM"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinal:function(e){var t=e%10;return~~(e%100/10)===1?"th":t===1?"st":t===2?"nd":t===3?"rd":"th"}}),r.fn=H.prototype={clone:function(){return r(this)},valueOf:function(){return+this._d},unix:function(){return Math.floor(+this._d/1e3)},toString:function(){return this._d.toString()},toDate:function(){return this._d},toArray:function(){var e=this;return[e.year(),e.month(),e.date(),e.hours(),e.minutes(),e.seconds(),e.milliseconds(),!!this._isUTC]},isValid:function(){return this._a?this._a[8]!=null?!!this._a[8]:!R(this._a,(this._a[7]?r.utc(this._a):r(this._a)).toArray()):!isNaN(this._d.getTime())},utc:function(){return this._isUTC=!0,this},local:function(){return this._isUTC=!1,this},format:function(e){return $(this,e?e:r.defaultFormat)},add:function(e,t){var n=t?r.duration(+t,e):r.duration(e);return I(this,n,1),this},subtract:function(e,t){var n=t?r.duration(+t,e):r.duration(e);return I(this,n,-1),this},diff:function(e,t,n){var i=this._isUTC?r(e).utc():r(e).local(),o=(this.zone()-i.zone())*6e4,u=this._d-i._d-o,a=this.year()-i.year(),f=this.month()-i.month(),l=this.date()-i.date(),c;return t==="months"?c=a*12+f+l/30:t==="years"?c=a+(f+l/30)/12:c=t==="seconds"?u/1e3:t==="minutes"?u/6e4:t==="hours"?u/36e5:t==="days"?u/864e5:t==="weeks"?u/6048e5:u,n?c:s(c)},from:function(e,t){return r.duration(this.diff(e)).lang(this._lang).humanize(!t)},fromNow:function(e){return this.from(r(),e)},calendar:function(){var e=this.diff(r().sod(),"days",!0),t=this.lang().calendar,n=t.sameElse,i=e<-6?n:e<-1?t.lastWeek:e<0?t.lastDay:e<1?t.sameDay:e<2?t.nextDay:e<7?t.nextWeek:n;return this.format(typeof i=="function"?i.apply(this):i)},isLeapYear:function(){var e=this.year();return e%4===0&&e%100!==0||e%400===0},isDST:function(){return this.zone()<r([this.year()]).zone()||this.zone()<r([this.year(),5]).zone()},day:function(e){var t=this._isUTC?this._d.getUTCDay():this._d.getDay();return e==null?t:this.add({d:e-t})},startOf:function(e){switch(e.replace(/s$/,"")){case"year":this.month(0);case"month":this.date(1);case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return this},endOf:function(e){return this.startOf(e).add(e.replace(/s?$/,"s"),1).subtract("ms",1)},sod:function(){return this.clone().startOf("day")},eod:function(){return this.clone().endOf("day")},zone:function(){return this._isUTC?0:this._d.getTimezoneOffset()},daysInMonth:function(){return r.utc([this.year(),this.month()+1,0]).date()},lang:function(e){return e===t?W(this):(this._lang=e,this)}};for(o=0;o<C.length;o++)tt(C[o].toLowerCase(),C[o]);tt("year","FullYear"),r.duration.fn=B.prototype={weeks:function(){return j(this.days()/7)},valueOf:function(){return this._milliseconds+this._days*864e5+this._months*2592e6},humanize:function(e){var t=+this,n=this.lang().relativeTime,r=et(t,!e,this.lang()),i=t<=0?n.past:n.future;return e&&(typeof i=="function"?r=i(r):r=i.replace(/%s/i,r)),r},lang:r.fn.lang};for(o in k)k.hasOwnProperty(o)&&(rt(o,k[o]),nt(o.toLowerCase()));rt("Weeks",6048e5),f&&(n.exports=r),typeof ender=="undefined"&&(this.moment=r),typeof define=="function"&&define.amd&&define("moment",[],function(){return r})}).call(this)})