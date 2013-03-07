/*******************************************************************************
 * NetEase New Mail System 2010 Version. * * File Name: editor.js * Written by:
 * yhzheng * * Version 1.0 (MSIE 6.0 above,Firefox2.0,Netscape.) * Created Date:
 * 2010-08-30 * Copyright：1997-2010 NetEase.com Inc. All rights reserved. *
 ******************************************************************************/
/**
 * 该文件为网易邮箱极速风格3.5版的HTML编辑器模块行为层 代码注释使用YUI
 * Doc{http://developer.yahoo.com/yui/yuidoc/}标准。
 *
 * @module Editor
 * @version 1.0
 * @author yhzheng
 * @support IE6.0+/Firefox/Chrome/Safari/Opera
 */

/**
 * Editor模块主类
 *
 * @class Editor
 * @constructor
 * @return {void}
 */

function Editor(oSettings) {

    this.editorIframe; // 编辑器的iframe
    this.win; // 编辑器iframe的contentWindow
    this.doc; // 编辑器iframe的document
    this.body; // 编辑器iframe的body
    this.html;// iframe编辑框的初始化内容
    this.format;// 格式化工具实例
    this.query;// 查询器实例
    this.observer;// 监视器实例
    this.history;// 历史记录器实例
    this.editorView;// EditorView对象

    this.debug=false;//是否是调试状态，主要用于控制log
    this.isSimple=false;

    this.system = {}; // 存储浏览器版本，this.system.ie/firefox/chrome/opera/safari,如果
    // 浏览器是IE的，this.system.ie的值是浏览器的版本号，!this.system.ie表示
    // 非IE浏览器

    this.settings = { // 初始化编辑器时的设置
        editorIframe : null,
        editorView : null,
        html : null
    };

    // 类方法
    this.setEditorView=fEditorSetEditorView;//设置EditorView对象
    this.getEditorView=fEditorGetEditorView;//获取EditorView对象
    this.getNode = fEditorGetNode; // 根据ID获取元素
    this.getIframeNode = fEditorGetIframeNode; // 根据ID获取元素
    this.getInitHtml=fEditorGetInitHtml;//获取初始化编辑框的html字符串
    this.init = fEditorInit; // 初始化编辑器
    this.log = fEditorLog; // 输出日志
    this.extend = fEditorExtend; // 扩展对象
    this.focus=fEditorFocus;//聚焦
    this.getUserAgent = fEditorGetUserAgent; // 获取userAgent
    this.getBrowserVersion = fEditorGetBrowserVersion; // 获取浏览器版本信息
    this.edit = fEditorEdit; // 执行浏览器默认编辑命令
    this.getSelection = fEditorGetSelection; // 获取selection对象
    this.getSelectedText = fEditorGetSelectedText; // 获取选中的文本
    this.getSelectedHtml = fEditorGetSelectedHtml; // 获取选中的HTML
    this.getSelectedContent=fEditorGetSelectedContent;//获取选中的内容
    this.getSelectedNodes = fEditorGetSelectedNodes; // 获取光标所在节点
    this.getTime=fEditorGetTime;//获取当前时间
    this.getRange = fEditorGetRange;// 获取当前的range对象
    this.selectRange = fEditorSelectRange;// 选取指定的range
    this.getStyle=fEditorGetStyle;//获取元素样式
    this.num2Rgb = fEditorNum2Rgb; // 将数值转换成RGB颜色
    this.num2HexForIe = fEditorNum2HexForIe; // 将数值转换成十六进制颜色
    this.rgb2Hex = fEditorRgb2Hex; // 将数值转换成RGB颜色
    this.insertHtml = fEditorInsertHtml; // 在光标处插入HTML
    this.createTable = fEditorCreateTable; // 创建一个表格
    this.getContent = fEditorGetContent; // 获取编辑框的内容
    this.getFinalContent=fEditorGetFinalContent;//获取带有默认配置样式（行高、字号、字体颜色等）的内容
    this.setContent = fEditorSetContent; // 设置编辑框的内容
    this.htmlToText = fEditorHtmlToText;// html转换为纯文本
    this.textToHtml = fEditorTextToHtml;// 纯文本转换为html
    this.addEvent = fEditorAddEvent; // 添加事件
    this.removeEvent = fEditorRemoveEvent; // 删除事件
    this.keydown = fEditorKeydown;// 处理浏览器按键
    this.findCommonAncestor = fEditorFindCommonAncestor;// 查找指定两个节点的祖先节点

    //提供给compose的接口
    this.insert=fEditorInsert;//插入元素
    this.del=fEditorDelete;//删除元素

    // 子类
    this.Format = fEditorFormat; // 格式化类，用于格式化操作
    this.Query = fEditorQuery; // 查询器类，用于查询编辑区状态
    this.Observer = fEditorObserver; // 监视器类，用于添加监视器
    this.History = fEditorHistory;// 记录器类，用于撤销、重做
    this.Selection = fEditorSelection;// 自定义选区类
    this.Range = fEditorRange;// 自定义范围类

    // 创建子类的工具函数
    this.createFormat = fEditorCreateFormat; // 创建格式化实例
    this.createQuery = fEditorCreateQuery; // 创建查询器实例
    this.createObserver = fEditorCreateObserver; // 创建监视器实例
    this.createHistory = fEditorCreateHistory;// 创建记录器实例
    this.createSelection = fEditorCreateSelecion;// 创建自定义选区实例
    this.createRange = fEditorCreateRange;// 创建自定义范围实例

    // 初始化
    this.init(oSettings);
}
/**
 * 设置EditorView对象
 *
 * @method setEditorView
 * @param {object}oEditorView
 * @return {void}
 * @for Editor
 */
function fEditorSetEditorView(oEditorView) {
    this.editorView=oEditorView;
}
/**
 * 获取EditorView对象
 *
 * @method getEditorView
 * @param void
 * @return {object}返回EditorView对象
 * @for Editor
 */
function fEditorGetEditorView() {
    return this.editorView;
}
/**
 * 根据id获取元素
 *
 * @method getNode
 * @param {string}sId
 *            元素ID
 * @return {object} 匹配元素
 * @for Editor
 */
function fEditorGetNode(sId) {
    return typeof sId == "string" ? document.getElementById(sId) : sId;
}
/**
 * 根据id获取编辑器iframe内的元素
 *
 * @method getIframeNode
 * @param {string}sId元素ID
 * @return {object} 匹配元素
 * @for Editor
 */
function fEditorGetIframeNode(sId) {
    return typeof sId == "string" ? this.doc
        .getElementById(sId) : sId;
}
/**
 * 获取初始化编辑框的html字符串
 *
 * @method getInitHtml
 * @param {object}oParams
 *                .html编辑框内的默认内容
 *                .fontsize默认文字大小
 *                .forecolor默认文字颜色
 * @return {string}返回初始化编辑框的html字符串
 * @for Editor
 */
function fEditorGetInitHtml(oParams) {
    // 初始化时添加空div是为了解决ie默认的换行问题：默认情况下的换行是<p>，而把内容放在div里，默认换行是div
    return '\
		<head><link href="http://img1.cache.netease.com/bbs/css/bbsglobal_v1.0.0.css" rel="stylesheet" type="text/css" /><style>\
				body{color:'+(oParams["forecolor"]||"#000000")+';font-size:'+(oParams["fontsize"]||"14px")
        +';line-height:1.7;padding:8px 10px;margin:0;\
				background-color:#ffffff;background-image:url("http://bbs.home.163.com/bbs/img/edit/end_n_bg9.gif");background-repeat:no-repeat;background-position:center center;text-align:left;height:90%;background-attachment:fixed}\
				pre{\
					white-space: pre-wrap; /* css-3 */\
					white-space: -moz-pre-wrap; /* Mozilla, since 1999 */\
					white-space: -pre-wrap; /* Opera 4-6 */\
					white-space: -o-pre-wrap; /* Opera 7 */\
					word-wrap: break-word; /* Internet Explorer 5.5+ */\
					/* white-space : normal ;Internet Explorer 5.5+ */\
					font-family:arial,verdana,sans-serif;\
				}\
				a{color:#1F3A87;}\
				a:hover{color:#BA2636;}\
				a:hover span{color:#1F3A87; }\
				ul li{list-style:disc inside;}\
				ol li{list-style:decimal inside;}\
				.postreset{font-weight:normal;font-family:宋体,serif;font-size:14px;background:#fff;color:#000;font-style:normal;text-decoration:none;}\
		</style></head><body>'+(this.system.ie?"<div>"+oParams.html+"</div>":oParams.html)+'</body>\
        ';
}
/**
 * 初始化编辑器对象
 *
 * @method init
 * @param {object}oSettings初始设置
 * @return {void}
 * @see #getBrowserVersion #extend #initEditor
 * @for Editor
 */
function fEditorInit(oSettings) {
    var that=this;
    var oOwnSettings=that.settings;
    // 获取浏览器版本信息
    that.getBrowserVersion();
    // 设置参数
    that.extend(oOwnSettings, oSettings);
    that.editorView = oSettings.editorView;
    that.editorIframe = that.getNode(oOwnSettings.editorIframe);
    that.html=oOwnSettings.html;
    that.win = that.editorIframe.contentWindow;
    var oDoc=that.doc = that.win.document;
    var sHtml=that.html==null||that.html==undefined?"":that.html;
    sHtml = that.getInitHtml({
        "html" : sHtml,
        "fontsize" : oOwnSettings.fontsize,
        "forecolor" : oOwnSettings.forecolor
    });
    oDoc.open("text/html", "replace");
    oDoc.writeln(sHtml);
    oDoc.close();
    // that.win.document.charset = "gb2312";
    // 打开编辑模式
    if (that.system.ie) {
        if (that.system.ie == "5.0") {
            oDoc.designMode = 'on';
        } else {
            // 修复ie下初始化时页面定位到编辑器BUG，当编辑框进入可视范围内后再设置为可编辑
            var fun = function(){
                var _offsetTop = that.editorIframe.parentNode.parentNode.offsetTop;
                if(document.documentElement.scrollTop + document.documentElement.clientHeight > _offsetTop){
                    oDoc.body.contentEditable = true;
                    Event.stopObserving(window, 'scroll', fun);
                    Event.stopObserving(window, 'resize', fun);
                    Event.stopObserving(window, 'load', fun);
                    Event.stopObserving(oDoc, 'click', fun);
                }
            }
            Event.observe(window, 'scroll', fun);
            Event.observe(window, 'resize', fun);
            Event.observe(window, 'load', fun);
            Event.observe(oDoc, 'click', fun);
        }
    } else {
        oDoc.designMode = 'on';
        oDoc.execCommand("useCSS", false, true);
    }
    // 初始化格式化工具实例
    that.format = that.createFormat();
    // 初始化查询器实例
    that.query = that.createQuery();
    // 初始化监视器实例
    that.observer = that.createObserver();
    // 初始化历史记录器实例
    that.history = that.createHistory();
    // 添加键盘监听事件，作用：用自定义的ctrl-z、ctrl-y替换默认的命令
    that.observer.add({
        "el" : oDoc,
        "eventType" : "keydown",
        "fn" : that.keydown,
        "object" : that
    });
}
/**
 * 打印日志
 *
 * @method log
 * @param {string}sLog日志信息
 * @return {void}
 * @for Editor
 */
function fEditorLog(sLog) {
    if(!this.debug){
        return;
    }
    if(typeof console == "object"){
        console.log(sLog);
    } else {
        //alert(sLog);
    }
}
/**
 * 扩展对象
 *
 * @method extend(oTarget,oSource0[,oSource1,...,bOverwrite,oPropertiesList])
 * @param {object}oTarget扩展对象
 * @param {object}oSource扩展源，可以有一个或者多个
 * @param {boolean}bOverwrite重写模式，true表示重写模式，将会覆盖原有的域；false表示一般模式，不会覆盖原有的域
 * @param {object}oPropertiesList重写域列表
 * @return {void}
 * @for Editor
 */
function fEditorExtend(oTarget) {
    var nArgsLength = arguments.length, bOverwrite, oPropertiesList;
    //获取重写模式
    if (typeof(bOverwrite = arguments[nArgsLength - 1]) == 'boolean')
        nArgsLength--;
    else if (typeof(bOverwrite = arguments[nArgsLength - 2]) == 'boolean') {
        //获取重写域列表
        oPropertiesList = arguments[nArgsLength - 1];
        nArgsLength -= 2;
    }
    //遍历源对象，复制域
    for (var i = 1; i < nArgsLength; i++) {
        var oSource = arguments[i];
        for (var sProperty in oSource) {
            //在重写模式下，将会覆盖原有的域
            if (bOverwrite === true || oTarget[sProperty] == undefined) {
                //如果参数中有oPropertiesList，则仅复制指明的域
                if (!oPropertiesList || (sProperty in oPropertiesList))
                    oTarget[sProperty] = oSource[sProperty];

            }
        }
    }
    return oTarget;
}
/**
 * 聚焦
 *
 * @method focus([oData])
 * @param {object}oData(可选)
 *                .name聚焦的对象名（win/doc/body），默认为win
 *                .element要聚焦的元素
 *                .id要聚焦元素的id
 *                .pos聚焦的精确位置
 * @return {void}
 * @for Editor
 */
function fEditorFocus(oData) {
    if(!oData){
        this.win.focus();
    }else{
        // 默认窗体
        var sName = oData["name"] || "win";
        // 聚焦
        if(sName=="win"){
            this.win.focus();
        }else if(sName=="doc"){
            this.doc.focus();
        }else if(sName=="body"){
            this.doc.body.focus();
        }

        // 指定元素
        var oElement = oData["element"];
        // 指定ID
        if(oData["id"]){
            // 指定元素
            oElement = this.getNode(oData["id"]);
        }
        if(oElement){
            // 精确位置
            var nPos = oData["pos"];
            if(isNaN(nPos)){
                nPos = 0;
            }
            var oRange;
            if(window.getSelection){
                // 当前激活选中区
                var oSelection = this.win.getSelection();
                if(!oSelection){
                    return false;
                }
                // 取消选择
                if(oSelection.rangeCount > 0){
                    oSelection.removeAllRanges();
                }
                // 对象范围
                oRange = this.doc.createRange();
                oRange.selectNode(oElement.firstChild || oElement);
                oRange.collapse(true);
                oSelection.addRange(oRange);
            }else{
                oRange = (oElement.createTextRange ? oElement : this.doc.body).createTextRange();
                oRange.moveToElementText(oElement);
                oRange.moveStart("character",nPos);
                oRange.collapse(true);
                oRange.select();
            }
        }
    }
}
/**
 * 获取浏览器UserAgent信息
 *
 * @method getUserAgent
 * @param void
 * @return {string} 浏览器UserAgent信息
 * @for Editor
 */
function fEditorGetUserAgent() {
    return navigator.userAgent.toLowerCase();
}
/**
 * 获取浏览器版本
 *
 * @method getBrowserVersion
 * @param void
 * @return {void}
 * @see #getUserAgent
 * @for Editor
 */
function fEditorGetBrowserVersion() {
    var ua = this.getUserAgent();
    var s;
    // 使用正则表达式在userAgent中提取浏览器版本信息
    (s = ua.match(/msie ([\d.]+)/)) ? this.system.ie = s[1] : (s = ua
        .match(/firefox\/([\d.]+)/))
        ? this.system.firefox = s[1]
        : (s = ua.match(/chrome\/([\d.]+)/))
        ? this.system.chrome = s[1]
        : (s = ua.match(/opera.([\d.]+)/))
        ? this.system.opera = s[1]
        : (s = ua.match(/version\/([\d.]+).*safari/))
        ? this.system.safari = s[1]
        : 0;
}
/**
 * 编辑器执行浏览器自带命令
 *
 * @method edit(sType[,sParam])
 * @param {string}sType命令名,
 * @param {string}sParam命令参数（可选）
 * @return {boolean}true表示成功执行
 * @see #log
 * @for Editor
 */
function fEditorEdit(sType, sParam) {
    //聚焦编辑窗口
    this.win.focus();
    // 执行浏览器原生命令
    try {
        this.doc.execCommand(sType, false, sParam);
        this.log(sType + ";false;" + sParam);
        return true;
    } catch (e) {
        this.log(e);
        return false;
    }
}
/**
 * 用于将数值转换为RGB颜色
 *
 * @method num2Rgb
 * @param {number}nColor
 * @return {string} 返回rgb颜色
 * @for Editor
 */
function fEditorNum2Rgb(nColor) {
    // rgb颜色有3个十进制数字组成，左边的数值是右边数值的256倍
    var n1 = nColor % 256;
    var n2 = (nColor - n1) / 256 % 256;
    var n3 = (nColor - n1 - n2 * 256) / 65536;
    return "rgb(" + n3 + "," + n2 + "," + n1 + ")";
}
/**
 * IE下用于将查询数值转换为长度为七的十六进制颜色
 *
 * @method num2HexForIe
 * @param {number}nColor
 * @return {string} 返回十六进制颜色
 * @for Editor
 */
function fEditorNum2HexForIe(nColor) {
    //颜色是黑色时，nColor的值是false
    if(nColor==false){
        return "#000000";
    }
    var sValue=nColor.toString(16);
    if(sValue.length==1){
        sValue="00000"+sValue;
    }else if(sValue.length==2){
        sValue="0000"+sValue;
    }else if(sValue.length==3){
        sValue="000"+sValue;
    }else if(sValue.length==4){
        sValue="00"+sValue;
    }else if(sValue.length==5){
        sValue="0"+sValue;
    }
    var sValue1=sValue.substring(0,2);
    var sValue2=sValue.substring(2,4);
    var sValue3=sValue.substring(4);
    return "#"+sValue3+sValue2+sValue1;
}
/**
 * 用于将RGB颜色转换为十六位色
 *
 * @method rgb2Hex
 * @param {number}sRgb
 * @return {string} 返回十六位表示的颜色
 * @for Editor
 */
function fEditorRgb2Hex(sRgb) {
    if (!/^rgb/i.test(sRgb)) {
        // 如果不是rgb颜色，则不予处理，直接返回
        return sRgb;
    }
    // 提取数字
    var aNum = sRgb.match(/[0-9]+/g);
    var nNum0 = parseInt(aNum[0]);
    var nNum1 = parseInt(aNum[1]);
    var nNum2 = parseInt(aNum[2]);
    // 转换为十六进制颜色，不足六位的，补足六位
    return "#" + (nNum0 > 15 ? nNum0.toString(16) : '0' + nNum0.toString(16))
        + (nNum1 > 15 ? nNum1.toString(16) : '0' + nNum1.toString(16))
        + (nNum2 > 15 ? nNum2.toString(16) : '0' + nNum2.toString(16));
}
/**
 * 获取selection对象
 *
 * @method getSelection
 * @param void
 * @return {object} 返回selection对象
 * @for Editor
 */
function fEditorGetSelection() {
    return this.system.ie ? this.doc.selection : this.win.getSelection();
}
/**
 * 获取光标选中文本
 *
 * @method getSelectedText
 * @param void
 * @return {string} 返回光标所在位置的文字，如果选中的是图片等标签，返回undefined
 * @for Editor
 */
function fEditorGetSelectedText() {
    if (this.system.ie) {
        return this.doc.selection.createRange().text;
    } else {
        var sText = this.win.getSelection().toString();
        if (sText == "") {
            // 在非ie下，如果sText==""，有可能是选中了图片等标签，需要进一步验证
            var sHtml = this.getSelectedHtml();
            if (/<[^>]*>/.test(sHtml)) {
                // 如果选中的是图片等标签，返回undefined
                return undefined;
            }
        }
        return sText;
    }
}
/**
 * 获取光标选中html
 *
 * @method getSelectedText
 * @param void
 * @return {string} 返回光标所在位置的Html
 * @see #getSelection
 * @for Editor
 */
function fEditorGetSelectedHtml() {
    var sel = this.getSelection();
    if (this.system.ie) {
        this.doc.body.focus();	// 修复ie下不能插入链接的问题。
        return sel.createRange().htmlText;
    } else {
        // 非ie浏览器下，没有办法直接获得选中的html，这里利用一个临时标签的innerHTML属性获取
        var oSpan = document.createElement("span");
        var oFragment = sel.getRangeAt(0).cloneContents();
        oSpan.appendChild(oFragment);
        return oSpan.innerHTML;
    }
}
/**
 * 获取光标选中的内容
 *
 * @method getSelectedContent
 * @param void
 * @return {object} 如果用户选择中有文本，则返回选中的文本，如果没有选中文本，则返回选中的html（例如图片），如果html也没有，则返回null
 * @see #getSelectedText #getSelectedHtml
 * @for Editor
 */
function fEditorGetSelectedContent() {
    var sText=this.getSelectedText();
    if(sText!=undefined&&sText!=""){
        return {"text":sText};
    }else{
        var sHtml=this.getSelectedHtml();
        if(sHtml!=undefined&&sHtml!=""){
            return {"html":sHtml};
        }
    }
    return null;
}
/**
 * 获取光标所在节点
 *
 * @method getSelectedNodes
 * @param void
 * @return {object}返回光标所在节点
 * @see #createRange
 * @see Range#getSelectedNodes
 * @for Editor
 */
function fEditorGetSelectedNodes() {
    return this.createRange().getSelectedNodes();
}
/**
 * 获取当前时间,格式为yyyy-MM-dd或yyyy-MM-dd hh:mm:ss
 *
 * @method getTime([bHasTime])
 * @param {boolean}bHasTime 是否含有时间(可选)
 * @return {boolean} true 表示执行成功
 * @for Editor
 */
function fEditorGetTime(bHasTime) {
    var oDate=new Date();
    var nYear = oDate.getFullYear();
    var nMonth = oDate.getMonth() + 1;
    var nDate = oDate.getDate();
    // 格式化时间
    var sTime = nYear + (nMonth<10 ? '-0' : '-')+ nMonth + (nDate<10 ? '-0' : '-')+ nDate;
    if(bHasTime){
        var nHour = oDate.getHours();
        var nMinute = oDate.getMinutes();
        var nSecond = oDate.getSeconds();
        sTime+=(nHour<10 ? ' 0' : ' ')+ nHour + (nMinute<10 ? ':0' : ":")+ nMinute + (nSecond<10 ? ':0' : ':')+ nSecond;
    }
    return sTime;
}
/**
 * 获取当前range对象
 *
 * @method getRange
 * @param void
 * @return {object} 返回当前range对象
 * @see #getSelection
 * @for Editor
 */
function fEditorGetRange() {
    var oSel = this.getSelection();
    if (this.system.ie) {
        return oSel.createRange();
    } else {
        try{
            var oRange=oSel.getRangeAt(0);
        }catch(e){
            //console.dir(e);
        }
        return oRange;
    }
}
/**
 * 选取给定的range对象
 *
 * @method selectRange
 * @param {object}oRange指定的range对象
 * @return {void}
 * @see #getSelection
 * @for Editor
 */
function fEditorSelectRange(oRange) {
    if (this.system.ie) {
        return oRange.select();
    } else {
        var oSel = this.getSelection();
        oSel.addRange(oRange);
    }
}
/**
 * 在光标出插入HTML
 *
 * @method insertHtml
 * @param {string}sHtml
 * @return {void}
 * @see #getSelection #edit
 * @for Editor
 */
function fEditorInsertHtml(sHtml) {
    this.win.focus();
    if (this.system.ie) {
        this.getSelection().createRange().pasteHTML(sHtml);
    } else {
        // 非ie浏览器下，运用原生的编辑命令
        this.edit("inserthtml", sHtml);
    }
}
/**
 * 获取元素当前的样式
 *
 * @method getStyle
 * @param {object}oEl
 * @param {string}sAttr(可选)指定样式名
 * @return {object}获取元素当前的样式
 * @for Editor
 */
function fEditorGetStyle(oEl, sAttr) {
    return sAttr ? oEl.currentStyle ? oEl.currentStyle[sAttr] : this.win
        .getComputedStyle(oEl, false)[sAttr] : oEl.currentStyle
        ? oEl.currentStyle: this.win.getComputedStyle(oEl, false);
}
/**
 * 创建表格
 *
 * @method createTable
 * @param {object}oParams
 *            .row{string/number}表格行数
 *            .column{string/number}表格列数
 *            .width{string/number}表格宽度
 *            .borderWidth{string/number}边框宽度
 *            .borderSpacing{string/number}单元格边距
 *            .padding{string/number}单元格间距
 *            .other{object}其他参数，如：cellpedding、style等
 * @return {string} 返回新建表格的HTML
 * @for Editor
 */
function fEditorCreateTable(oParams) {
    var aHtml = [];
    //占位符，解决chrome等浏览器空表格显示不正常问题
    var sPlaceholder;
    if(this.system.ie){
        sPlaceholder="<div>&nbsp;</div>";
    }else{
        sPlaceholder="<br>";
    }
    var sStyle;
    aHtml.push("<table  border='1'");
    // 单元格边距
    if (oParams["cellspacing"]) {
        aHtml.push(" cellspacing=");
        aHtml.push(oParams["cellspacing"]);
    }
    // 添加附加参数
    var oOtherParams = oParams["other"];
    if (oOtherParams) {
        for (var key in oOtherParams) {
            if (key == "style") {
                // 把附加的style提取出来，在后边跟width等演示一同添加
                sStyle = oOtherParams[key];
            } else {
                aHtml.push(key);
                aHtml.push("='");
                aHtml.push(oOtherParams[key]);
                aHtml.push("' ");
            }
        }
    }
    aHtml.push(" style='");
    if (sStyle) {
        // 添加附加样式
        aHtml.push(sStyle);
        aHtml.push(";");
    }
    // 表格宽度
    if (oParams["width"]) {
        aHtml.push("width:");
        aHtml.push(oParams["width"]);
    }
    // 边框宽度
    if (oParams["borderWidth"]) {
        aHtml.push(";border-width:");
        aHtml.push(oParams["borderWidth"]);
    }
    // 单元格边距,兼容Firefox
    if (oParams["cellspacing"]) {
        aHtml.push(";border-spacing:");
        aHtml.push(oParams["cellspacing"]);
    }
    aHtml.push(";'>");
    for (var i = 0; i < oParams["row"]; i++) {
        aHtml.push("<tr>");
        for (var j = 0; j < oParams["column"]; j++) {
            // 为使表格在各个浏览器下显示正确的大小，需要添加一个空格作为占位符
            aHtml.push("<td");
            if (oParams["padding"]) {
                aHtml.push(" style='padding:");
                aHtml.push(oParams["padding"]);
                aHtml.push("'>");
                //插入占位符
                if(sPlaceholder){
                    aHtml.push(sPlaceholder);
                }
                aHtml.push("</td>");
            }
        }
        aHtml.push("</tr>");
    }
    //添加空格，解决非ie浏览器中，插入表格后在表格后点击，光标落在表格内的问题
    aHtml.push("</table>");
    return aHtml.join("");
}
/**
 * 获取编辑框内容
 *
 * @method getContent
 * @param void
 * @return {string} 返回编辑框内容
 * @for Editor
 */
function fEditorGetContent() {
    return this.doc.body.innerHTML;
}
/**
 * 设置编辑器默认样式（行高、字号、字体颜色等）
 *
 * @method setDefStyle
 * @param {object}oParams
 *                .fontsize 字号
 *                .fontname 字体
 *                .forecolor 文字颜色
 * @return {void}
 * @for EditorView
 */
function fEditorSetDefStyle(oParams) {
    if(oParams["fontsize"]){
        this.setting["fontsize"]=oParams["fontsize"];
        this.body.style.fontSize=oParams["fontsize"];
    }
    if(oParams["fontname"]){
        this.setting["fontname"]=oParams["fontname"];
        this.body.style.fontFamily=oParams["fontname"];
    }
    if(oParams["forecolor"]){
        this.setting["forecolor"]=oParams["forecolor"];
        this.body.style.color=oParams["forecolor"];
    }
}
/**
 * 获取带有默认配置样式（行高、字号、字体颜色等）的内容
 *
 * @method getFinalContent
 * @param void
 * @return {string} 返回Html内容
 * @for EditorView
 */
function fEditorGetFinalContent() {
    var oSetting=this.setting;
    return "<div style='line-height:1.7;color:"+(oSetting["forecolor"]||"#000000")+";font-size:"+(
        oSetting["fontsize"]||"14px")+";font-family:"+(oSetting["fontname"]||"arial,verdana,sans-serif")
        +this.getContent()+"</div>";
}
/**
 * 设置编辑框内容
 *
 * @method setContent
 * @param {string}sContent要插入的内容
 * @return {void}
 * @for Editor
 */
function fEditorSetContent(sContent) {
    // 设置编辑器iframe的body为指定内容
    this.doc.body.innerHTML = sContent;
}
/**
 * 获取纯文本内容
 *
 * @method htmlToText
 * @param {string}sHtml传入html字符串
 * @return {string} 返回纯文本内容
 * @for Editor
 */
function fEditorHtmlToText(sHtml) {
    sHtml = sHtml.replace(/\n/ig, "");
    sHtml = sHtml.replace(/\\s+/ig, "");
    // 替换块级标签为换行符
    sHtml = sHtml.replace(/<\/(address|blockquote|center|dir|div|dl|fieldset|form|hr|h[1-6]|isindex|iframe|menu|ol|p|pre|table|ul)>/gi,"\n");
    // 替换换行符
    sHtml = sHtml.replace(/<br>/gi, "\n");
    // 处理列表
    sHtml = sHtml.replace(/<li>/gi, " . ");
    // 消除遗留html标签
    sHtml = sHtml.replace(/<[^>]+>/g, "");
    // 处理转义字符
    sHtml = sHtml.replace(/&nbsp;/gi, " ");
    sHtml = sHtml.replace(/&lt;/gi, "<");
    sHtml = sHtml.replace(/&gt;/gi, ">");
    sHtml = sHtml.replace(/&quot;/gi, "\"");
    sHtml = sHtml.replace(/&amp;/gi, "&");
    return sHtml;
}
/**
 * 将纯文本转换为html
 *
 * @method textToHtml
 * @param {string}sText传入纯文本
 * @return {string} 返回html字符串
 * @for Editor
 */
function fEditorTextToHtml(sText) {
    sText = sText.replace(/&/g, "&amp;");
    sText = sText.replace(/</g, "&lt;");
    sText = sText.replace(/>/g, "&gt;");
    sText = sText.replace(/ /ig, "&nbsp;");
    sText = sText.replace(/\"/g, "&quot;");
    sText = sText.replace(/\n/ig, "<br>")
    return sText;
}
/**
 * 添加事件
 *
 * @method addEvent
 * @param {object}oParams
 *            {object}.el要添加事件的元素;
 *            {string}.eventType事件类型;
 *            {function}.fn事件处理函数;
 * @return {void}
 * @for Editor
 */
function fEditorAddEvent(oParams) {
    oParams["el"].addEventListener ? oParams["el"].addEventListener(
        oParams["eventType"], oParams["fn"], false) : oParams["el"].attachEvent(
        'on' + oParams["eventType"], oParams["fn"]);
}
/**
 * 删除事件
 *
 * @method removeEvent
 * @param {object}oParams
 *            {object}.el要删除事件的元素;
 *            {string}.eventType事件类型;
 *            {function}.fn事件处理函数;
 * @return {void}
 * @for Editor
 */
function fEditorRemoveEvent(oParams) {
    if (oParams["el"].detachEvent) {
        // ie删除事件
        oParams["el"].detachEvent('on' + oParams["eventType"], oParams["fn"]);
    } else {
        // 非ie浏览器删除事件
        oParams["el"].removeEventListener(oParams["eventType"], oParams["fn"], false);
    }
}
/**
 * 处理浏览器的按键事件，用自定义的ctrl-z、ctrl-y替换默认的命令
 *
 * @method keydown
 * @param void
 * @return {void}
 * @for Editor
 */
function fEditorKeydown() {
    var that=this;
    var oEditorView=that.getEditorView();
    if (oEditorView) {
        // 获取事件对象
        var oEvent = oEditorView.getEvent(that.win);
        // 没有事件，则返回
        if (!oEvent) {
            return;
        }

        var bStopEvent = false;
        // 如果用户按下了crtl键
        if (oEvent.ctrlKey) {
            if (oEvent.keyCode == 90) {
                // 用户按下ctrl-z,进行撤销操作
                var oHistory=that.history;
                if (oHistory) {
                    oHistory.undo();
                }
                bStopEvent = true;
            } else if (oEvent.keyCode == 89) {
                // 用户按下ctrl-y,进行重做操作
                var oHistory=that.history;
                if (oHistory) {
                    oHistory.redo();
                }
                bStopEvent = true;
            }
        } else if (oEvent.keyCode == 8) {
            // 用户按下了退格键，在ie下会返回上一页
            var sText=oEditorView.editor.getSelectedText();
            //如果sText==undefined，则可能是选中了图片等元素
            if(sText==undefined){
                var oSel=oEditorView.editor.getSelection();
                if(/control/i.test(oSel.type)){
                    //删除选区内容
                    oSel.clear();
                }
                //避免返回上一页
                bStopEvent = true;
            }
        }else if (oEvent.keyCode == 13) {
            // 用户按下了回车键，插入换行
            // that.insertHtml("<br>");
            // bStopEvent=true;
        }
        // 屏蔽浏览器默认事件，阻止浏览器默认行为
        if (bStopEvent) {
            oEvent.returnValue = false;
            oEditorView.changeToolbar();
        }
    }
}
/**
 * 查找指定两个节点的祖先节点
 *
 * @param {object}oNodeA节点A
 * @param {object}oNodeB节点B
 * @return {object}返回指定两个节点的祖先节点
 * @for Editor
 */
function fEditorFindCommonAncestor(oNodeA, oNodeB) {
    var oParentA = oNodeA;
    // 遍历oNodeA的父节点
    while (oParentA) {
        var oParentB = oNodeB;
        // 遍历oNodeB的父节点
        while (oParentB) {
            // 如果找到公共父节点，则直接返回
            if (oParentA == oParentB) {
                return oParentA;
            }
            oParentB = oParentB.parentNode;
        }
        oParentA = oParentA.parentNode;
    }
    return oParentA;
}
/**
 * 插入元素
 *
 * @method insert
 * @param {object}oData
 *                .html要插入的html
 *                .text要插入的纯文本
 *                .image要插入的图片html
 * @return {void}
 * @see #edit #insertHtml
 * @for Editor
 */
function fEditorInsert(oData) {
    var sHtml = oData["html"]|| oData["text"];
    var sImage = oData["image"];
    if (sImage) {
        this.edit("InsertImage", sImage);
    } else if (sHtml) {
        this.insertHtml(sHtml);
    }
    //ie下取消选中
    if (this.system.ie) {
        var oSel = this.doc.selection;
        //如果选区是控制类型，即之前插入的是图片
        if (oSel.type == 'Control') {
            //图片周围会出现编辑框，这里去掉
            oSel.empty();
            var oRange = oSel.createRange();
            //将光标移到插入的图片后
            oRange.move("textedit");
            oRange.select();
        }
    }
}
/**
 * 删除元素
 *
 * @method del
 * @param {object}oData
 *                .element要删除的元素
 *                .tag要删除的元素的标签名
 *                .reg要删除的图片url的正则表达式
 * @return {void}
 * @for Editor
 */
function fEditorDelete(oData) {
    var oElement = oData["element"];
    var sTag = oData["tag"];
    var oReg = oData["reg"];
    if (oElement) {
        // 元素删除
        oElement.parentNode.removeChild(oElement);
    } else if (sTag && oReg) {
        var aImage = this.doc.getElementsByTagName(oData["tag"]);
        // 图片正则匹配删除
        for (var i = 0; i < aImage.length; i++) {
            var oImage=aImage[i];
            var sUrl = oImage.src;
            if (oReg.test(sUrl)) {
                oImage.parentNode.removeChild(oImage);
                i--;
            }
        }
    }
}
/**
 * editor模块子类Format
 *
 * @class Format
 * @constructor
 * @param {object}oEditor 父类实例
 * @return {void}
 * @for Editor
 */
function fEditorFormat(oEditor) {

    //私有变量
    var _editor = oEditor;// 编辑器实例

    //公有变量
    this.span=_editor.doc.createElement("span");//自定义格式命令中，利用cloneNode方法获取新的span标签，提高效率

    // 设置编辑器实例
    this.getEditor = function() {
        return _editor;
    }

    //获取新的span标签
    this.getSpan=function(){
        return this.span.cloneNode(true);
    }

    // 工具函数
    this.dtd=fEditorFormatDtd;//获取dtd格式定义
    this.delTag = fEditorFormatDelTag;// 删除指定节点的标签
    this.isNonFormat=fEditorFormatIsNonFormat;//检查指定节点是否是空节点（不需要添加格式化样式）
    this.isInline=fEditorFormatIsInline;//检查指定标签名的元素是否是内联元素/行级元素
    this.isBlock=fEditorFormatIsBlock;//检查指定标签名的元素是否是块级元素
    this.canRemoveIfEmpty=fEditorFormatCanRemoveIfEmpty;//检查指定标签在没有子节点时是否可以删除
    this.canAddStyle = fEditorFormatCanAddStyle;// 检查指定元素是否可以添加样式
    this.isDtdAlow = fEditorFormatIsDtdAlow;// 检查制定两个元素是否符合dtd标准
    this.getAttrs = fEditorFormatGetAttrs;// 获取指定元素的所有属性
    this.getStyle=fEditorFormatGetStyle;//获取指定元素的样式
    this.addStyle = fEditorFormatAddStyle;// 添加样式
    this.removeStyle = fEditorFormatRemoveStyle;// 删除样式
    this.addStyleForRange=fEditorFormatAddStyleForRange;//为参数选区添加样式
    this.removeStyleForRange=fEditorFormatRemoveStyleForRange;//为参数选区删除样式
    this.edit = fEditorFormatEdit;// 自定义编辑命令
    this.turnToHtml = fEditorFormatTurnToHtml;// 将节点转换为html字符串

    // 命令
    this.undo = fEditorFormatUndo;// 撤销
    this.redo = fEditorFormatRedo;// 重做
    this.copy = fEditorFormatCopy;// 复制
    this.cut = fEditorFormatCut;// 剪切
    this.paste = fEditorFormatPaste;// 粘贴
    this.deleteOut = fEditorFormatDeleteOut;// 删除
    this.insertHtml=fEditorFormatInsertHtml;//插入html字符串
    this.bold = fEditorFormatBold;// 加粗
    this.underline = fEditorFormatUnderline;// 下划线
    this.indent = fEditorFormatIndent;// 缩进
    this.outdent = fEditorFormatOutdent;// 突出
    this.italic = fEditorFormatItalic;// 斜体
    this.strikethrough = fEditorFormatStrikethrough;// 中划线
    this.superscript = fEditorFormatSuperscript;// 上标
    this.subscript = fEditorFormatSubscript;// 下表
    this.insertOrderedList = fEditorFormatInsertOrderedList;// 有序列表/数字列表
    this.insertUnorderedList = fEditorFormatInsertUnorderedList;// 无序列表/符号列表
    this.justifyLeft = fEditorFormatJustifyLeft;// 左对齐
    this.justifyCenter = fEditorFormatJustifyCenter;// 居中对齐
    this.justifyRight = fEditorFormatJustifyRight;// 右对齐
    this.fontname = fEditorFormatFontname;// 字体
    this.createLink = fEditorFormatCreateLink;// 新建链接
    this.unLink=fEditorFormatUnLink;//删除链接
    this.fontsize = fEditorFormatFontsize;// 字号
    this.lineheight = fEditorFormatLineheight;// 行高
    this.backcolor = fEditorFormatBackcolor;// 背景色
    this.forecolor = fEditorFormatForecolor;// 字体颜色
    this.insertHorizontalRule = fEditorFormatInsertHorizontalRule;// 插入水平分割线
    this.insertTable = fEditorFormatInsertTable;// 插入表格
    this.removeFormat = fEditorFormatRemoveFormat;// 清除格式
    this.insertImage = fEditorFormatInsertImage;// 插入图片
    this.insertTime=fEditorFormatInsertTime;//插入当前时间
    this.exec=fEditorFormatExec;//执行指定命令并记录编辑历史

    //初始化dtd格式定义
    this.dtd = this.dtd();
}
/**
 * 创建一个Format对象
 *
 * @method createFormat
 * @param void
 * @return {object} format
 * @see #fEditorFormat
 * @for Editor
 */
function fEditorCreateFormat() {
    return new fEditorFormat(this);
}
/**
 * 获取dtd格式定义
 * @method dtd
 * @return {object}返回dtd格式定义
 * @see #getEditor Editor#extend
 * @for Format
 */
function fEditorFormatDtd() {
    var X = this.getEditor().extend,

        A = {isindex:1,fieldset:1},
        B = {input:1,button:1,select:1,textarea:1,label:1},
        C = X({a:1},B),
        D = X({iframe:1},C),
        E = {hr:1,ul:1,menu:1,div:1,blockquote:1,noscript:1,table:1,center:1,address:1,dir:1,pre:1,h5:1,dl:1,h4:1,noframes:1,h6:1,ol:1,h1:1,h3:1,h2:1},
        F = {ins:1,del:1,script:1,style:1},
        G = X({b:1,acronym:1,bdo:1,'var':1,'#':1,abbr:1,code:1,br:1,i:1,cite:1,kbd:1,u:1,strike:1,s:1,tt:1,strong:1,q:1,samp:1,em:1,dfn:1,span:1},F),
        H = X({sub:1,img:1,object:1,sup:1,basefont:1,map:1,applet:1,font:1,big:1,small:1},G),
        I = X({p:1},H),
        J = X({iframe:1},H,B),
        K = {img:1,noscript:1,br:1,kbd:1,center:1,button:1,basefont:1,h5:1,h4:1,samp:1,h6:1,ol:1,h1:1,h3:1,h2:1,form:1,font:1,'#':1,select:1,menu:1,ins:1,abbr:1,label:1,code:1,table:1,script:1,cite:1,input:1,iframe:1,strong:1,textarea:1,noframes:1,big:1,small:1,span:1,hr:1,sub:1,bdo:1,'var':1,div:1,object:1,sup:1,strike:1,dir:1,map:1,dl:1,applet:1,del:1,isindex:1,fieldset:1,ul:1,b:1,acronym:1,a:1,blockquote:1,i:1,u:1,s:1,tt:1,address:1,q:1,pre:1,p:1,em:1,dfn:1},

        L = X({a:1},J),
        M = {tr:1},
        N = {'#':1},
        O = X({param:1},K),
        P = X({form:1},A,D,E,I),
        Q = {li:1},
        R = {style:1,script:1},
        S = {base:1,link:1,meta:1,title:1},
        T = X(S,R),
        U = {head:1,body:1},
        V = {html:1};

    var block = {address:1,blockquote:1,center:1,dir:1,div:1,dl:1,fieldset:1,form:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,hr:1,isindex:1,menu:1,noframes:1,ol:1,p:1,pre:1,table:1,ul:1};

    return {

        //body外的元素
        $nonBodyContent: X(V,U,S),

        //块级元素
        $block : block,

        //块级限制元素
        $blockLimit : { body:1,div:1,td:1,th:1,caption:1,form:1 },

        //内联元素/行级元素
        $inline : L,

        $body : X({script:1,style:1}, block),

        $cdata : {script:1,style:1},

        //没有子节点的元素
        $empty : {area:1,base:1,br:1,col:1,hr:1,img:1,input:1,link:1,meta:1,param:1},

        //列表项元素
        $listItem : {dd:1,dt:1,li:1},

        //列表元素
        $list: { ul:1,ol:1,dl:1},

        //可以包含文本，但不能编辑的元素
        $nonEditable : {applet:1,button:1,embed:1,iframe:1,map:1,object:1,option:1,script:1,textarea:1,param:1},

        //如果没有子节点，则可以忽略的元素
        $removeEmpty : {abbr:1,acronym:1,address:1,b:1,bdo:1,big:1,cite:1,code:1,del:1,dfn:1,em:1,font:1,i:1,ins:1,label:1,kbd:1,q:1,s:1,samp:1,small:1,span:1,strike:1,strong:1,sub:1,sup:1,tt:1,u:1,'var':1},

        //有tabindex并且默认为0的元素
        $tabIndex : {a:1,area:1,button:1,input:1,object:1,select:1,textarea:1},

        //table内的元素
        $tableContent : {caption:1,col:1,colgroup:1,tbody:1,td:1,tfoot:1,th:1,thead:1,tr:1},

        html: U,
        head: T,
        style: N,
        script: N,
        body: P,
        base: {},
        link: {},
        meta: {},
        title: N,
        col : {},
        tr : {td:1,th:1},
        img : {},
        colgroup : {col:1},
        noscript : P,
        td : P,
        br : {},
        th : P,
        center : P,
        kbd : L,
        button : X(I,E),
        basefont : {},
        h5 : L,
        h4 : L,
        samp : L,
        h6 : L,
        ol : Q,
        h1 : L,
        h3 : L,
        option : N,
        h2 : L,
        form : X(A,D,E,I),
        select : {optgroup:1,option:1},
        font : L,
        ins : L,
        menu : Q,
        abbr : L,
        label : L,
        table : {thead:1,col:1,tbody:1,tr:1,colgroup:1,caption:1,tfoot:1},
        code : L,
        script : N,
        tfoot : M,
        cite : L,
        li : P,
        input : {},
        iframe : P,
        strong : L,
        textarea : N,
        noframes : P,
        big : L,
        small : L,
        span : L,
        hr : {},
        dt : L,
        sub : L,
        optgroup : {option:1},
        param : {},
        bdo : L,
        'var' : L,
        div : P,
        object : O,
        sup : L,
        dd : P,
        strike : L,
        area : {},
        dir : Q,
        map : X({area:1,form:1,p:1},A,F,E),
        applet : O,
        dl : {dt:1,dd:1},
        del : L,
        isindex : {},
        fieldset : X({legend:1},K),
        thead : M,
        ul : Q,
        acronym : L,
        b : L,
        a : J,
        blockquote : P,
        caption : L,
        i : L,
        u : L,
        tbody : M,
        s : L,
        address : X(D,I),
        tt : L,
        legend : L,
        q : L,
        pre : X(G,C),
        p : L,
        em : L,
        dfn : L
    };
}
/**
 * 删除指定节点的标签，如：<p>123</p> -> 123
 *
 * @method delTag
 * @param {object}oNode传入节点
 * @return {void}
 * @for Format
 */
function fEditorFormatDelTag(oNode) {
    if (!oNode.hasChildNodes()) {
        if (oNode && oNode.parentNode) {
            oNode.parentNode.removeChild(oNode);
        }
    } else {
        var aChildren = oNode.childNodes;
        var oParentNode = oNode.parentNode;
        var nLen = aChildren.length;
        // 在当前节点前插入其孩子节点
        for (var j = 0; j < nLen; j++) {
            oParentNode.insertBefore(aChildren[0], oNode);
        }
        // 移除当前节点
        oParentNode.removeChild(oNode);
    }
}
/**
 * 检查指定节点是否是空节点（不需要添加格式化样式）
 *
 * @method isNonFormat
 * @param {string}sNodeName元素名
 * @return {boolean} true表示指定元素名的标签是空节点（不需要添加格式化样式）
 * @for Format
 */
function fEditorFormatIsNonFormat(sNodeName) {
    sNodeName = sNodeName.toLowerCase();
    return this.dtd.$empty[sNodeName]==1?true:false;
}
/**
 * 检查指定节点是内联元素/行级元素
 *
 * @method isInline
 * @param {string}sNodeName元素名
 * @return {boolean} true表示指定元素名的标签是内联元素/行级元素
 * @for Format
 */
function fEditorFormatIsInline(sNodeName) {
    sNodeName = sNodeName.toLowerCase();
    return this.dtd.$inline[sNodeName]==1?true:false;
}
/**
 * 检查指定节点是块级元素
 *
 * @method isBlock
 * @param {string}sNodeName元素名
 * @return {boolean} true表示指定元素名的标签是块级元素
 * @for Format
 */
function fEditorFormatIsBlock(sNodeName) {
    sNodeName = sNodeName.toLowerCase();
    return this.dtd.$block[sNodeName]==1?true:false;
}
/**
 * 检查参数元素在没有子节点时是否可以删除
 *
 * @method canRemoveIfEmpty
 * @param {string}sNodeName元素名
 * @return {boolean} true表示指定元素名的标签在没有子节点时可以删除
 * @for Format
 */
function fEditorFormatCanRemoveIfEmpty(sNodeName) {
    sNodeName = sNodeName.toLowerCase();
    return this.dtd.$removeEmpty[sNodeName]==1?true:false;
}
/**
 * 检查指定节点是否可以添加样式
 *
 * @method canAddStyle
 * @param {string}sNodeName元素名
 * @return {boolean} true表示指定元素名的标签可以添加样式
 * @for Format
 */
function fEditorFormatCanAddStyle(sNodeName) {
    sNodeName = sNodeName.toLowerCase();
    return sNodeName == "span" || sNodeName == "div" || sNodeName == "table"
        || sNodeName == "form";
}
/**
 * 检查指定两个节点的父子关系是否符合dtd标准
 *
 * @method isDtdAlow
 * @param {object}oParent 父节点
 * @param {object}oChild 子节点
 * @return {boolean} true表示指定两个节点符合dtd标准
 * @for Format
 */
function fEditorFormatIsDtdAlow(oParent, oChild) {
    var sParent = oParent.nodeName.toLowerCase();
    var sChild = oChild.nodeName.toLowerCase();
    return this.dtd[sParent] ? (this.dtd[sParent][sChild] == 1
        ? true
        : false) : false;
}
/**
 * 获取指定节点的全部属性
 *
 * @method getAttrs
 * @param {object}oNode参数节点
 * @return {array}返回指定节点的全部属性,json格式
 * @see #getEditor
 * @for Format
 */
function fEditorFormatGetAttrs(oNode) {
    if (this.getEditor().system.ie) {
        var sHtml = this.turnToHtml(oNode);
        var sTag = sHtml.match(/<[^>]+>/)[0];
        var aAttrs = sTag.match(/[^ ]+=[^( |>)]+/g);
        var aResult = [];
        for (var i = 0; aAttrs && i < aAttrs.length; i++) {
            var sAttr = aAttrs[i];
            var oAttr = {};
            oAttr.nodeName = sAttr.substring(0, sAttr.indexOf("="));
            oAttr.nodeValue = sAttr.substring(sAttr.indexOf("=") + 1,
                sAttr.length);
            aResult.push(oAttr);
        }
        return aResult;
    } else {
        return oNode.attributes;
    }
}
/**
 * 获取元素当前的样式,其中lineHeight返回百分值
 *
 * @method getStyle
 * @param {object}oEl
 * @param {string}sAttr(可选)指定样式名
 * @return {object}获取元素当前的样式
 * @for Format
 */
function fEditorFormatGetStyle(oEl, sAttr) {
    var oEditor = this.getEditor();
    var sValue;
    if(sAttr == "lineHeight"){
        sValue=oEl.style.lineHeight;
        if(sValue){
            return sValue;
        }
    }
    sValue = sAttr
        ? oEl.currentStyle ? oEl.currentStyle[sAttr] : oEditor.win
        .getComputedStyle(oEl, false)[sAttr]
        : oEl.currentStyle ? oEl.currentStyle : oEditor.win
        .getComputedStyle(oEl, false);
    if (sAttr == "lineHeight") {
        if (sValue && sValue.indexOf("px") > 0) {
            // 将字体查询结果统一转换为px
            function _changeToPx(sValue) {
                if (typeof sValue == "string" && sValue.indexOf("px") < 0) {
                    if (sValue == "1") {
                        sValue = "10px";
                    } else if (sValue == "2") {
                        sValue = "13px";
                    } else if (sValue == "3") {
                        sValue = "16px";
                    } else if (sValue == "4") {
                        sValue = "18px";
                    } else if (sValue == "5") {
                        sValue = "24px";
                    } else if (sValue == "6") {
                        sValue = "32px";
                    } else if (sValue == "7") {
                        sValue = "48px";
                    }
                }
                return sValue;
            }
            var sSize = this.getStyle(oEl, "fontSize")
                || _changeToPx(oEl.getAttribute("size"));
            sValue = Math.round(parseFloat(sValue.replace(/px/, "")* 10)
                / parseFloat(sSize.replace(/px/, "")))* 10 + "%";
            if (sValue == "110%")
                sValue = "120%";
        }
    }
    return sValue?sValue:null;
}
/**
 * 添加样式，同时清理选区，包括删除冗余标签、合并可以合并的标签等
 *
 * @method addStyle
 * @param {object}oNode 参数节点
 * @param {string}sStyle 样式名
 * @param {string}sValue 样式值
 * @param {array}aNodes 待处理节点数组
 * @return {object}oNode 返回修改后的节点
 * @see #isDtdAlow #canAddStyle
 * @for Format
 */
function fEditorFormatAddStyle(oNode, sStyle, sValue,aNodes) {
    //如果当前参数为空或者参数节点是不需要添加样式的节点，则直接返回
    if(!oNode||this.isNonFormat(oNode.nodeName)){
        return null;
    }else if (oNode.hasChildNodes()) {
        var aChildren = oNode.childNodes;
        var nLength = aChildren.length;
        var aAttrs = this.getAttrs(oNode);
        if(!/span/i.test(oNode.nodeName)){
            if(aAttrs.length==0){
                var oPre = oNode.previousSibling;
                //如果前一个节点可以包含当前节点，则直接将当前节点插入到前一个节点中
                if(oPre&&/span/i.test(oPre.nodeName)&&this.isDtdAlow(oPre,oNode)&&this.getStyle(oPre,sStyle)==sValue){
                    oPre.appendChild(oNode);
                }
            }
        }else {
            // 如果当前节点是span，并且它只有一个sStyle的style属性，如：<span style="sStyle:value">****</span>,
            // 而且父节点的sStyle等于sValue,则删除此节点
            if (aAttrs.length == 1 && aAttrs[0].nodeName == "style"
                && aAttrs[0].nodeValue.split(";").length == 1
                && aAttrs[0].nodeValue.indexOf(sValue) > 0) {
                //如果父节点对应的样式等于当前要添加的样式，则把当前节点的标签删除
                if (this.getStyle(oNode.parentNode, sStyle) == sValue) {
                    var oParent = oNode.parentNode;
                    // 把孩子节点移动到当前节点前
                    for (var i = 0; i < aChildren.length; i++) {
                        oParent.insertBefore(aChildren[0], oNode);
                        if(aChildren[0].nodeType!=3)aNodes.push(aChildren[0]);
                    }
                    // 删除当前节点
                    oParent.removeChild(oNode);
                    return;
                } else {
                    var oPre = oNode.previousSibling;
                    // 如果前一个兄弟节点可以包含当前节点的子节点
                    if (oPre && /span/i.test(oPre.nodeName)
                        && this.getStyle(oPre, sStyle) == sValue) {
                        // 把孩子节点移动到前面的span里
                        for (var i = 0; i < aChildren.length; i++) {
                            oPe.append(aChildren[0]);
                            if(aChildren[0].nodeType!=3)aNodes.push(aChildren[0]);
                        }
                        // 删除当前节点
                        oParent.removeChild(oNode);
                        return;
                    }
                }
            }
        }

        // 如果当前节点对应样式的值是指定值之外的值,则用指定值覆盖原值
        if (this.getStyle(oNode,sStyle)!= sValue) {
            oNode.style[sStyle] = sValue;
        }

        // 把子节点放入处理数组中
        for (var i = 0; i < nLength; i++) {
            aNodes.push(aChildren[i]);
        }
    } else if (oNode.nodeType == 3) {
        // 处理文本节点
        var oParent=oNode.parentNode;
        //如果父节点对应的style跟指定值的不同
        if (this.getStyle(oParent,sStyle) != sValue) {
            var oPre=oNode.previousSibling;
            //如果前一个节点可以包含当前文本，则直接将当前文本插入到前一个节点中
            if(oPre&&/span/i.test(oPre.nodeName)&&this.getStyle(oPre,sStyle) == sValue){
                oPre.appendChild(oNode);
            }else if(oParent.childNodes.length==1&&!/body/i.test(oParent.nodeName)){
                //如果父节点只有一个子节点，则直接在父节点上添加对应style
                oParent.style[sStyle]=sValue;
            }else{
                //否则，新建一个带有指定样式的span，并把当前节点放到span下
                var oSpan = this.getSpan();
                oSpan.style[sStyle] = sValue;
                oParent.insertBefore(oSpan, oNode);
                oSpan.appendChild(oNode);
            }
        }
    } else if (this.canRemoveIfEmpty(oNode.nodeName)) {
        // 删除冗余节点
        oNode.parentNode.removeChild(oNode);
    }
    return oNode;
}
/**
 * 删除样式
 *
 * @method removeStyle
 * @param {object}oNode传入节点 oFormat 当前Format实例{string}sStyle 样式名, sValue样式值
 * @return {object}oNode 返回修改后的节点
 * @for Format
 */
function fEditorFormatRemoveStyle(oNode, sStyle, oFormat) {
    if (oNode && oNode.hasChildNodes()) {
        var aChildren = oNode.childNodes;
        var nLength = aChildren.length;
        oNode.style[sStyle] = "";
        var aAttrs = this.getAttrs(oNode);
        if (/span/i.test(oNode.nodeName) && aAttrs.length == 1
            && aAttrs[0].nodeValue == "") {
            var oParent = oNode.parentNode;
            if (oParent) {
                for (var i = 0; i < nLength; i++) {
                    oParent.insertBefore(aChildren[i], oNode);
                }
                oParent.removeChild(oNode);
                // 设置当前节点
                oNode = oParent;
                aChildren = oNode.childNodes;
                nLength = aChildren.length;
            }
        }
        for (var i = 0; i < nLength; i++) {
            this.removeStyle(aChildren[i], sStyle);
        }
    }
    return oNode;
}
/**
 * 添加样式
 *
 * @method addStyleForRange
 * @param {object}oRange参数选区
 * @param {string}sStyle样式名
 * @param {string}sValue样式值
 * @return {object}oNode 返回修改后的节点
 * @for Format
 */
function fEditorFormatAddStyleForRange(oRange, sStyle, sValue) {
    var aNodes = oRange.getSelectedNodes();
    while(aNodes.length>0) {
        var oNode=aNodes.pop();
        this.addStyle(oNode,sStyle,sValue,aNodes);
    }
}
/**
 * 删除样式
 *
 * @method removeStyleForRange
 * @param {object}oNode
 *            传入节点 oFormat 当前Format实例{string}sStyle 样式名, sValue样式值
 * @return {object}oNode 返回修改后的节点
 * @for Format
 */
function fEditorFormatRemoveStyleForRange(oNode, sStyle, oFormat) {
    if (oNode && oNode.hasChildNodes()) {
        var aChildren = oNode.childNodes;
        var nLength = aChildren.length;
        oNode.style[sStyle] = "";
        var aAttrs = this.getAttrs(oNode);
        if (/span/i.test(oNode.nodeName) && aAttrs.length == 1
            && aAttrs[0].nodeValue == "") {
            var oParent = oNode.parentNode;
            if (oParent) {
                for (var i = 0; i < nLength; i++) {
                    oParent.insertBefore(aChildren[i], oNode);
                }
                oParent.removeChild(oNode);
                // 设置当前节点
                oNode = oParent;
                aChildren = oNode.childNodes;
                nLength = aChildren.length;
            }
        }
        for (var i = 0; i < nLength; i++) {
            this.removeStyle(aChildren[i], sStyle);
        }
    }
    return oNode;
}
/**
 * 执行自定义编辑命令
 *
 * @method edit
 * @param {string}sType命令名,sParam命令参数
 * @return {boolean} true 表示执行成功
 * @see #getEditor,#addStyleForRange
 * @see Editor#createSelection
 * @see Selection#getRange,#addRange
 * @for Format
 */
function fEditorFormatEdit(sType, sParam) {
    var oEditor=this.getEditor();
    try {
        // 获取自定义Selection对象
        var oSel = oEditor.createSelection();
        // 获取自定义Range对象
        var oRange = oSel.getRange();
        // 为选区添加样式
        this.addStyleForRange(oRange, sType, sParam);
        // 重置为高亮
        oSel.addRange(oRange);
        return true;
    } catch (e) {
        oEditor.log(e);
        return false;
    }
}
/**
 * 把传入的节点转换为html字符串
 *
 * @method turnToHtml
 * @param {object}oNode需要转换的节点
 * @return {string} 返回转换后的html
 * @see #getEditor
 * @for Format
 */
function fEditorFormatTurnToHtml(oNode) {
    // 创建一个临时标签
    var oDiv = this.getEditor().doc.createElement("div");
    // 把传入节点的副本添加到临时标签
    oDiv.appendChild(oNode.cloneNode(true));
    return oDiv.innerHTML;
}
/**
 * 撤销
 *
 * @method undo
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor History#undo
 * @for Format
 */
function fEditorFormatUndo() {
    return this.getEditor().history.undo();
}
/**
 * 重做
 *
 * @method redo
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor History#redo
 * @for Format
 */
function fEditorFormatRedo() {
    return this.getEditor().history.redo();
}
/**
 * 复制（只在IE下可用）
 *
 * @method copy
 * @param void
 * @return {boolean} true 表示执行成功,false 表示不成功
 * @for Format
 */
function fEditorFormatCopy() {
    var oEditor=this.getEditor();
    if (oEditor.system.ie) {
        oEditor.edit("copy");
        return true;
    } else {
        // 非ie浏览器由于安全原因，不支持次操作
        return false;
    }
}
/**
 * 剪切（只在IE下可用）
 *
 * @method cut
 * @param void
 * @return {boolean} true 表示执行成功,false 表示不成功
 * @for Format
 */
function fEditorFormatCut() {
    var oEditor=this.getEditor();
    if (oEditor.system.ie) {
        oEditor.edit("cut");
        return true;
    } else {
        // 非ie浏览器由于安全原因，不支持次操作
        return false;
    }
}
/**
 * 粘贴（只在IE下可用）
 *
 * @method paste
 * @param void
 * @return {boolean} true 表示执行成功,false 表示不成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatPaste() {
    var oEditor=this.getEditor();
    if (oEditor.system.ie) {
        oEditor.win.focus();
        oEditor.edit("paste");
        return true;
    } else {
        // 非ie浏览器由于安全原因，不支持此操作
        return false;
    }
}
/**
 * 删除（只在IE下可用）
 *
 * @method deleteOut
 * @param void
 * @return {boolean} true 表示执行成功,false 表示不成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatDeleteOut() {
    var oEditor=this.getEditor();
    if (oEditor.system.ie) {
        oEditor.edit("delete");
        return true;
    } else {
        // 非ie浏览器由于安全原因，不支持次操作
        return false;
    }
}
/**
 * 插入html字符串
 *
 * @method insertHtml
 * @param {string}sHtml要插入的html字符串
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatInsertHtml(sHtml) {
    this.getEditor().insertHtml(sHtml);
    return true;
}
/**
 * 设置/取消加粗
 *
 * @method bold
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatBold() {
    this.getEditor().edit("bold");
    return true;
}
/**
 * 设置/取消下划线
 *
 * @method underline
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatUnderline() {
    this.getEditor().edit("underline");
    return true;
}
/**
 * 设置缩进
 *
 * @method indent
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatIndent() {
    this.getEditor().edit("indent");
    return true;
}
/**
 * 取消缩进
 *
 * @method outdent
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatOutdent() {
    this.getEditor().edit("outdent");
    // ie下如果没有缩进了，要消除多余的p标签
    /*
     * if (this.getEditor().system.ie) { // 查询是否有缩进 var bIsIndent =
     * this.getEditor().query.indent(); // 如果没有缩进 if (!bIsIndent) { // 获取光标所在节点
     * var oNode = this.getEditor().getFocusNode(); // 寻找第一个p节点 while (oNode &&
     * !/p/i.test(oNode.nodeName)) { oNode = oNode.parentNode; } // 删除p节点 if
     * (/p/i.test(oNode.nodeName)) { this.delTag(oNode); } } }
     */
    return true;
}
/**
 * 设置/取消斜体
 *
 * @method italic
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatItalic() {
    this.getEditor().edit("italic");
    return true;
}
/**
 * 设置/取消中划线
 *
 * @method strikethrough
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatStrikethrough() {
    this.getEditor().edit("strikethrough");
    return true;
}
/**
 * 设置/取消上标
 *
 * @method superscript
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatSuperscript() {
    this.getEditor().edit("superscript");
    return true;
}
/**
 * 设置/取消下标
 *
 * @method subscript
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatSubscript() {
    this.getEditor().edit("subscript");
    return true;
}
/**
 * 设置/取消有序列表(数字列表)
 *
 * @method insertOrderedList
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatInsertOrderedList() {
    this.getEditor().edit("InsertOrderedList");
    return true;
}
/**
 * 设置/取消无序列表（符号列表）
 *
 * @method insertUnorderedList
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatInsertUnorderedList() {
    this.getEditor().edit("InsertUnorderedList");
    return true;
}
/**
 * 设置左对齐
 *
 * @method justifyLeft
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatJustifyLeft() {
    this.getEditor().edit("JustifyLeft");
    return true;
}
/**
 * 设置居中对齐
 *
 * @method justifyCenter
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatJustifyCenter() {
    this.getEditor().edit("JustifyCenter");
    return true;
}
/**
 * 设置右对齐
 *
 * @method justifyRight
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatJustifyRight() {
    this.getEditor().edit("JustifyRight");
    return true;
}
/**
 * 创建链接
 *
 * @method createLink
 * @param {string}sTitle链接标题,
 *            sUrl链接地址
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#getSelectedText Editor#insertHtml
 * @for Format
 */
function fEditorFormatCreateLink(sTitle, sUrl) {
    var oEditor=this.getEditor();
    oEditor.win.focus();
    if (sTitle!=undefined) {
        // 如果有标题
        //部分浏览器中插入本域的url时，浏览器会自动转为相对定位url，这里在插入完a标签后，再设置href属性
        oEditor.insertHtml("<a target='_blank' id='editorAddLink010'>" + sTitle + "</a>");
        var oLink=oEditor.doc.getElementById("editorAddLink010");
        oLink.href=sUrl;
        oLink.removeAttribute("id");
    } else {
        var oLnk=oEditor.doc.createElement("a");
        oLnk.href=sUrl;
        oLnk.target="_blank";
        // 如果标题未定义，则可能是为图片等控件添加链接
        if(oEditor.system.ie){
            var oNode=oEditor.getRange().commonParentElement();
            if(oNode){
                oNode.parentNode.insertBefore(oLnk,oNode);
                oLnk.appendChild(oNode);
            }else {
                oEditor.edit("createLink",sUrl);
            }
        }else{
            var oRng=oEditor.getRange();
            var oDocFrag=oRng.extractContents();
            oLnk.appendChild(oDocFrag);
            oRng.insertNode(oLnk);
        }
    }
    return true;
}
/**
 * 删除链接
 *
 * @method unLink
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatUnLink() {
    var oEditor=this.getEditor();
    var sHtml=oEditor.getSelectedHtml();
    if(/<a[^>]+>.+<\/a>/i.test(sHtml)){
        oEditor.edit("unLink");
    }else{
        return false;
    }
    return true;
}
/**
 * 设置字体
 *
 * @method fontname
 * @param {string}sFontName字体名称
 * @return {boolean} true 表示执行成功
 * @see #edit #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatFontname(sFontName) {
    var oEditor=this.getEditor();
    if (true) {//zyh opera下有问题，暂时先用原生命令
        // 非opera下，使用系统原生命令
        oEditor.edit("fontname", sFontName);
    } else if(oEditor.system.opera){
        this.edit("fontFamily", sFontName);
    }
    return true;
}
/**
 * 设置文字大小
 *
 * @method fontsize
 * @param {string}sSize 文字大小，像素表示
 * @return {boolean} true 表示执行成功
 * @see #edit
 * @for Format
 */
function fEditorFormatFontsize(sSize) {
    return this.edit("fontSize", sSize);
}
/**
 * 设置文字行距
 *
 * @method lineheight
 * @param {string}sHeight 行距大小，百分数表示
 * @return {boolean} true 表示执行成功
 * @see #edit
 * @for Format
 */
function fEditorFormatLineheight(sHeight) {
    return this.edit("lineHeight", sHeight);
}
/**
 * 设置背景颜色
 *
 * @method backcolor
 * @param {string}sColor背景颜色
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatBackcolor(sColor) {
    var oEditor=this.getEditor();
    if (oEditor.system.ie) {
        oEditor.edit("backcolor", sColor);
    } else if (this.getEditor().system.firefox) {
        // firefox下需要设置('usecss',false,false)，否则hilitecolor会失效
        oEditor.edit('usecss', false);
        // firefox下直接使用rgb颜色设置可能会出错，所以这里用自定义函数转换为十六位颜色进行设置
        oEditor.edit("hilitecolor", this.getEditor().rgb2Hex(sColor));
        // 执行完"hilitecolor"命令后，要恢复"usecss"设置,让其它命令顺利执行
        oEditor.edit("usecss", true);
    } else {
        oEditor.edit("hilitecolor", sColor);
    }
    return true;
}
/**
 * 设置前景色（字体颜色）
 *
 * @method forecolor
 * @param {string}sColor字体颜色,必须是六位，不能缩写，例如：#FF0000,不能写成#F00
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatForecolor(sColor) {
    var oEditor=this.getEditor();
    if (!oEditor.system.firefox) {
        oEditor.edit("forecolor", sColor);
    } else {
        // firefox下直接使用rgb颜色设置可能会出错，所以这里用自定义函数转换为十六位颜色进行设置
        oEditor.edit("forecolor", this.getEditor().rgb2Hex(sColor));
    }
    return true;
}
/**
 * 插入水平线
 *
 * @method insertHorizontalRule
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatInsertHorizontalRule() {
    this.getEditor().edit("InsertHorizontalRule");
    return true;
}
/**
 * 删除格式
 *
 * @method removeFormat
 * @param void
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatRemoveFormat() {
    //this.getEditor().edit("removeFormat");
    var oEditor = this.getEditor(),
        html;
    html = oEditor.getSelectedHtml();
    //如果没有选中文字，则对全文执行
    if ( html == "" ) {
        html = oEditor.getContent();
        oEditor.setContent("");
    }

    // 去标签的所有属性
    //html = html.replace(/<(?:\s)*(\w+)(?:\s+[^>]*)?>/gi, "<$1>");
    // 去事件
    html = html.replace(/\s+on(?:load|change|submit|select|blur|focus|click|keydown|keypress|keyup|mouseover|mouseout|mouseup|error)=(['"]?)[^\1]*?\1\s*/gi, ' ');
    // 去样式
    html = html.replace(/\s+(?:style|class)=(['"]?)[^\1]*?\1\s*/gi, ' ');
    // 去一些属性
    html = html.replace(/\s+(?:id|name|lang|xml:lang|dir|accesskey|tabindex|error)=(['"]?).*?\1\s*/gi, ' ');
    // 去表格样式
    html = html.replace(/<(table|thead|tfoot|tbody|tr|td|th|caption)((?:\s+[^<>]*)?)>/gi, function($1, $2, $3) {
        return '<' + $2 + ($3.match(/\s(rowspan|colspan|border|cellspacing|cellpadding|width|height|align|valign)="\d+"/ig) || '') + '>';
    });

    // 将所有h标签和p替换为div
    html = html.replace(/<(\/)?(?:h1|h2|h3|h4|h5|h6|p)(?:\s+[^<>]*)?>/gi, '<$1div>');
    // 去掉所有行内标签
    html = html.replace(/<\/?(?:span|strong|b|i|em|o|font|big|small|sub|sup|bdo|u|s)(?:\s+[^<>]*)?>/gi, '');
    // 清除空链接
    html = html.replace(/<a(?:\s+[^<>]*)?>(?:\s*|(?:&nbsp;)*)<\/a>/gi, '');
    // 清除不带href的链接
    html = html.replace(/<a(?:\s*|(?:&nbsp;)*)>((?:.|\s)*?)<\/a>/gi, '$1');
    // 去掉内联样式，内联脚本
    html = html.replace(/<(style|script)(?:\s+[^<>]*)?>[^<]*<\/(style|script)>/gi, '');
    // 清注释
    html = html.replace(/<!--(.|\s)*?-->/gi, '');


    // 删掉ul,ol,dl
    html = html.replace(/<(\/)?(?:ul|ol|dl)(?:\s+[^<>]*)?>/gi, '');
    // 将li,dt,dd替换为div
    html = html.replace(/<(\/)?(?:li|dt|dd)(?:\s+[^<>]*)?>/gi, '<$1div>');

    // 加上默认样式
    if ( html.match(/<(.*)>.*<\/\1>|<(.*) \/>/) == null ) {
        html = '<span class="postreset">' + html + '</span>';
    } else {
        html = '<div class="postreset">' + html + '</div>';
    }

    this.insertHtml(html);

    return true;
}
/**
 * 插入图片
 *
 * @method insertHtml
 * @param {string}sUrl图片的url,sWidth图片宽度,sHeight图片高度
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#insertHtml
 * @for Format
 */
function fEditorFormatInsertImage(sUrl, sWidth, sHeight) {
    this.getEditor().insertHtml("<img src='" + sUrl + "' width='" + sWidth
        + "' height='" + sHeight + "'/>");
    return true;
}
/**
 * 插入当前时间,格式为yyyy-MM-dd或yyyy-MM-dd hh:mm:ss
 *
 * @method insertTime([bHasTime])
 * @param {boolean}bHasTime 是否含有时间(可选)
 * @return {boolean} true 表示执行成功
 * @see #getEditor Editor#insertHtml #getTime
 * @for Format
 */
function fEditorFormatInsertTime(bHasTime) {
    var oEditor=this.getEditor();
    oEditor.insertHtml(oEditor.getTime(bHasTime));
    return true;
}
/**
 * 执行指定命令并记录编辑历史
 *
 * @method exec
 * @param {string}sCommand
 * @param {object}oParams命令参数，可以是string类型，也可以是json类型
 * @return {boolean} true表示成功执行命令
 * @see #getEditor Editor.History#save
 * @for Format
 */
function fEditorFormatExec(sCommand,oParams) {
    //如果第一个参数类型是数组
    var oEditor=this.getEditor();
    var oEditorView=oEditor.getEditorView();
    //尝试执行监听器
    var oResult=oEditorView.notifyListener("onStartFormat",{"command":sCommand});
    //如果监视器要求停止，则立即返回false
    if(oResult["stop"]){
        return false;
    }
    var nLength=arguments.length;
    var bSuccess;
    if(nLength==1){
        bSuccess=this[sCommand]();
    }else{
        //用于存储第2个及其后的参数
        var aArgs=new Array();
        for(var i=1;i<nLength;i++){
            aArgs.push(arguments[i]);
        }
        //调用命令时传入新的参数aArgs
        bSuccess=this[sCommand].apply(this,aArgs);
    }
    // 如果是撤销、重做以外的命令，保存编辑历史
    if (sCommand != "undo" && sCommand != "redo") {
        oEditor.history.save();
    }
    //尝试执行监听器
    oEditorView.notifyListener("onEndFormat",{"command":sCommand});
    return bSuccess;
}
/**
 * 插入表格
 *
 * @method insertTable
 * @param {object}oParams
 *            .row{string/number}表格行数
 *            .column{string/number}表格列数
 *            .width{string/number}表格宽度
 *            .borderWidth{string/number}边框宽度
 *            .borderSpacing{string/number}单元格边距
 *            .padding{string/number}单元格间距
 *            .other{object}其他参数，如：cellpedding、style等
 * @return {boolean} true表示成功插入
 * @see #getEditor Editor#insertHtml Editor#createTable
 * @for Format
 */
function fEditorFormatInsertTable(oParams) {
    var oEditor=this.getEditor();
    oEditor.insertHtml(oEditor.createTable(oParams));
    return true;
}
/**
 * Query类，用于查询编辑区状态
 *
 * @method Query
 * @param {object}oEditor传入编辑器类，方便使用
 * @return {void}
 * @see #getEditor Editor#edit
 * @for Editor
 */
function fEditorQuery(oEditor) {
    var _editor = oEditor;// 编辑器实例
    // 设置编辑器实例
    this.getEditor = function() {
        return _editor;
    }

    this.queryCommandState = fEditorQueryCommandState; // 使用系统命令查询给定命令的状态(true/false)
    this.queryCommandValue = fEditorQueryCommandValue; // 使用系统命令查询给定命令的状态(value)
    this.queryState = fEditorQueryQueryState; // 自定义查询给定命令的状态(value)

    this.undo=fEditorQueryUndo;//查询是否可以执行撤销操作
    this.redo=fEditorQueryRedo;//查询是否可以执行重做操作
    this.bold = fEditorQueryBold; // 查询光标所在区域是否加粗
    this.underline = fEditorQueryUnderline; // 查询光标所在区域是否有下划线
    this.indent = fEditorQueryIndent; // 查询光标所在区域是否有缩进
    this.outdent = fEditorQueryOutdent; // 查询光标所在区域是否突出
    this.italic = fEditorQueryItalic; // 查询光标所在区域是否斜体
    this.strikethrough = fEditorQueryStrikethrough; // 查询光标所在区域是否有中划线
    this.superscript = fEditorQuerySuperscript; // 查询光标所在区域是否上标
    this.subscript = fEditorQuerySubscript; // 查询光标所在区域是否下标
    this.insertOrderedList = fEditorQueryInsertOrderedList; // 查询光标所在区域是否有序列表/数字列表
    this.insertUnorderedList = fEditorQueryInsertUnorderedList; // 查询光标所在区域是否无序列表/符号列表
    this.justify = fEditorQueryJustify; // 查询光标所在区域是否左对齐
    this.justifyLeft = fEditorQueryJustifyLeft; // 查询光标所在区域是否左对齐
    this.justifyCenter = fEditorQueryJustifyCenter; // 查询光标所在区域是否居中对齐
    this.justifyRight = fEditorQueryJustifyRight; // 查询光标所在区域是否右对齐
    this.fontsize = fEditorQueryFontsize; // 查询光标所在区域的字号
    this.fontname = fEditorQueryFontname; // 查询光标所在区域的字体
    this.lineheight = fEditorQueryLineheight; // 查询光标所在区域的行高
    this.backcolor = fEditorQueryBackcolor; // 查询光标所在区域的背景色
    this.forecolor = fEditorQueryForecolor; // 查询光标所在区域的前景色/文字颜色
    this.query=fEditorQueryQuery;//用于查询编辑区域参数命令的状态
    this.queryAll = fEditorQueryAll; // 查询光标所在区域的所有状态

}
/**
 * 用于创建查询器实例
 *
 * @method createQuery
 * @param void
 * @return {object} 返回一个查询器实例
 * @see #fEditorQuery
 * @for Editor
 */
function fEditorCreateQuery() {
    // 新建查询器实例是传入编辑器实例
    return new fEditorQuery(this);
}
/**
 * 使用系统命令查询编辑区状态
 *
 * @method queryCommandState
 * @param {string}sCommand 命令名
 * @return {Boolean} 返回命令状态，true表示编辑区正处于该命令状态
 * @see #getEditor Editor#log
 * @for Query
 */
function fEditorQueryCommandState(sCommand) {
    var oEditor=this.getEditor();
    var bResult=false;
    try{
        bResult=oEditor.doc.queryCommandState(sCommand);
    }catch(e){
        oEditor.log(e);
    }
    return bResult;
}
/**
 * 使用系统命令查询编辑区状态
 *
 * @method queryCommandValue
 * @param {string}sCommand 命令名
 * @return {string} 返回命令状态，例如"forecolor"命令返回前景色/字体颜色的值
 * @see #getEditor
 * @for Query
 */
function fEditorQueryCommandValue(sCommand) {
    var oEditor=this.getEditor();
    var sValue;
    try{
        sValue=oEditor.doc.queryCommandValue(sCommand);
    }catch(e){
        oEditor.log(e);
    }
    return sValue?sValue:false;
}
/**
 * 自定义查询编辑区的特殊状态
 *
 * @method queryState
 * @param {string}sCommand 查询命令名
 * @param {string}sParam 附加参数，用于查询行高时指定结果类型，"per"表示返回百分比，"px"(默认)表示返回像素值
 * @return {string} 返回查询编辑区的特殊状态,如果状态为空，则统一返回false
 * @see #getSelectedNodes
 * @for Query
 */
function fEditorQueryQueryState(sCommand,sParam) {
    var oEditor = this.getEditor();
    var oCurrentNode;
    try {
        // 获取光标所在节点
        var oSel = oEditor.createSelection();
        var oRange = oSel.getRange();
        var aNodes = oRange.getFocusNodes();
        // oSel.addRange(oRange);
        oRange.normalize();
        oSel.addRange(oRange);
    } catch (e) {
        oEditor.log(e);
        return false;
    }

    // 将字体查询结果统一转换为px
    function _changeToPx(sValue) {
        if (typeof sValue == "string" && sValue.indexOf("px") < 0) {
            if (sValue == "1") {
                sValue = "10px";
            } else if (sValue == "2") {
                sValue = "13px";
            } else if (sValue == "3") {
                sValue = "16px";
            } else if (sValue == "4") {
                sValue = "18px";
            } else if (sValue == "5") {
                sValue = "24px";
            } else if (sValue == "6") {
                sValue = "32px";
            } else if (sValue == "7") {
                sValue = "48px";
            }
        }
        return sValue;
    }
    //部分命令需要转换为对应样式名
    if (sCommand == "backcolor") {
        sCommand = "backgroundColor";
    }else if(sCommand == "forecolor"){
        sCommand = "color";
    }else if(sCommand == "fontsize"){
        sCommand = "fontSize";
    }else if(sCommand == "lineheight"){
        sCommand = "lineHeight";
    }else if(sCommand == "fontname"){
        sCommand = "fontFamily";
    }
    //记录查询状态
    var sValue;
    while(aNodes.length>0) {
        var oNode = aNodes.pop();
        //如果当前是文本节点，进入查询
        if (oNode.nodeType == 3) {
            // 如果是文本节点，则替换为其父节点
            oNode = oNode.parentNode;
            var sTmp = oEditor.getStyle(oNode, sCommand);
            if(sParam=="per"&&sCommand=="lineHeight"){
                if(sTmp&&sTmp.indexOf("px")>0){
                    var sSize=oEditor.getStyle(oNode,"fontSize")||_changeToPx(oNode.getAttribute("size"));
                    sTmp=Math.round(parseFloat(sTmp.replace(/px/,""))*10/parseFloat(sSize.replace(/px/,"")))*10+"%";
                    if(sTmp=="110%")sTmp="120%";
                }
            }else if (sCommand == "fontsize" && !sTmp) {
                // 如果一个节点同时有fontsize样式和size属性，以fontsize为准
                sTmp = _changeToPx(oNode.getAttribute("size"));
            }
            if (sTmp) {
                if (!sValue) {
                    sValue = sTmp;
                } else if (sTmp != sValue) {
                    // 如果各节点的状态值不一致，则返回false
                    return false;
                }
            }
        }else if(oNode.hasChildNodes()){
            //如果当前节点有孩子节点，则把除<br>、<img>外的子节点放入查询数组中
            var aChildren=oNode.childNodes;
            var nLen=aChildren.length;
            for(var i=0;i<nLen;i++){
                if(!/(br|img)/i.test(aChildren[i].nodeName))aNodes.push(aChildren[i]);
            }
        }
    }
    return sValue ? sValue : false;
}
/**
 * 用于查询编辑区是否处于加粗状态
 *
 * @method bold
 * @param void
 * @return {boolean} true表示光标所在位置的文字是加粗的
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryPaste() {
    return this.queryCommandState('paste');
}
/**
 * 用于查询是否可以执行撤销操作
 *
 * @method undo
 * @param void
 * @return {boolean} true表示可以执行撤销操作
 * @see History#queryUndo
 * @for Query
 */
function fEditorQueryUndo() {
    return this.getEditor().history.queryUndo();
}
/**
 * 用于查询是否可以执行重做操作
 *
 * @method redo
 * @param void
 * @return {boolean} true表示可以执行重做操作
 * @see History#queryRedo
 * @for Query
 */
function fEditorQueryRedo() {
    return this.getEditor().history.queryRedo();
}
/**
 * 用于查询编辑区是否处于加粗状态
 *
 * @method bold
 * @param void
 * @return {boolean} true表示光标所在位置的文字是加粗的
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryBold() {
    return this.queryCommandState('bold');
}
/**
 * 用于查询编辑区是否有下划线
 *
 * @method underline
 * @param void
 * @return {boolean} true表示光标所在位置的文字有下划线
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryUnderline() {
    return this.queryCommandState('underline');
}
/**
 * 用于查询编辑区是否有缩进
 *
 * @method indent
 * @param void
 * @return {boolean} true表示光标所在位置的文字有缩进
 * @see #queryState
 * @for Query
 */
function fEditorQueryIndent() {
    return this.queryState('indent');
}
/**
 * 用于查询编辑区是否突出/无缩进
 *
 * @method outdent
 * @param void
 * @return {boolean} true表示光标所在位置的文字突出/无缩进
 * @see #isIndent
 * @for Query
 */
function fEditorQueryOutdent() {
    // 利用是否有缩进的命令
    return this.indent() ? false : true;
}
/**
 * 用于查询编辑区是否斜体
 *
 * @method italic
 * @param void
 * @return {boolean} true表示光标所在位置的文字是斜体
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryItalic() {
    return this.queryCommandState('italic');
}
/**
 * 用于查询编辑区是否有中划线
 *
 * @method strikethrough
 * @param void
 * @return {boolean} true表示光标所在位置的文字有中划线
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryStrikethrough() {
    return this.queryCommandState('strikethrough');
}
/**
 * 用于查询编辑区是否上标
 *
 * @method superscript
 * @param void
 * @return {boolean} true表示光标所在位置的文字是上标
 * @see #queryCommandState
 * @for Query
 */
function fEditorQuerySuperscript() {
    return this.queryCommandState('superscript');
}
/**
 * 用于查询编辑区是否下标
 *
 * @method subscript
 * @param void
 * @return {boolean} true表示光标所在位置的文字是下标
 * @see #queryCommandState
 * @for Query
 */
function fEditorQuerySubscript() {
    return this.queryCommandState('subscript');
}
/**
 * 用于查询编辑区是否有序列表/数字列表
 *
 * @method insertOrderedList
 * @param void
 * @return {boolean} true表示光标所在位置的文字是有序列表/数字列表
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryInsertOrderedList() {
    return this.queryCommandState('insertOrderedList');
}
/**
 * 用于查询编辑区是否无序列表/符号列表
 *
 * @method insertUnorderedList
 * @param void
 * @return {boolean} true表示光标所在位置的文字是有序列表
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryInsertUnorderedList() {
    return this.queryCommandState('insertUnorderedList');
}
/**
 * 用于查询编辑区是否左对齐
 *
 * @method justifyLeft
 * @param void
 * @return {boolean} true表示光标所在位置的文字是左对齐
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryJustify() {
    return this.queryCommandState('justify');
}
/**
 * 用于查询编辑区是否左对齐
 *
 * @method justifyLeft
 * @param void
 * @return {boolean} true表示光标所在位置的文字是左对齐
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryJustifyLeft() {
    return this.queryCommandState('justifyLeft');
}
/**
 * 用于查询编辑区是否居中对齐
 *
 * @method justifyCenter
 * @param void
 * @return {boolean} true表示光标所在位置的文字是居中对齐
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryJustifyCenter() {
    return this.queryCommandState('justifyCenter');
}
/**
 * 用于查询编辑区是否右对齐
 *
 * @method justifyRight
 * @param void
 * @return {boolean} true表示光标所在位置的文字是右对齐
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryJustifyRight() {
    return this.queryCommandState('justifyRight');
}
/**
 * 用于查询编辑区文字的字号
 *
 * @method fontsize
 * @param void
 * @return {string} 光标所在位置的文字的字号
 * @see #queryState
 * @for Query
 */
function fEditorQueryFontsize() {
    return this.queryState('fontsize');
}
/**
 * 用于查询编辑区文字的字体
 *
 * @method fontname
 * @param void
 * @return {string} 光标所在位置的文字的字体
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryFontname() {
    //Firefox下会有引号
    return (""+this.queryCommandValue('fontname')).replace(/'|\"/g,"");
}
/**
 * 用于查询编辑区文字的行高
 *
 * @method lineheight
 * @param void
 * @return {string} 光标所在位置的文字的行高
 * @see #queryState
 * @for Query
 */
function fEditorQueryLineheight() {
    return this.getEditor().system.ie?false:this.queryState("lineheight","per");
}
/**
 * 用于查询编辑区域的背景色
 *
 * @method backcolor
 * @param void
 * @return {string} 返回光标所在位置的文字的背景色
 * @see #getEditor #queryCommandValue Editor#num2Rgb,#rgb2Hex,#edit
 * @for Query
 */
function fEditorQueryBackcolor() {
    var oEditor = this.getEditor();
    if (oEditor.system.ie) {
        // 查询的结果是十进制的数值，需要转换
        return oEditor.num2HexForIe(this.queryCommandValue('backcolor'));
    } else if (oEditor.system.firefox) {
        // firefox下需要设置('usecss',false,false)，否则hilitecolor会失效
        oEditor.edit('usecss', false);
        var sValue = "";
        // zyh 解决Firefox下设置背景色后不更改选区，查询出错的问题,只选中一个字符的情况仍未解决
        var oSel;
        var oRange;
        try {
            oSel = oEditor.getSelection();
            oRange = oSel.getRangeAt(0);
            if (oRange.toString().length > 1) {
                //将光标移动到选区末尾
                oSel.collapseToEnd();
                //将选区向前扩展一个字符
                oSel.extend(oSel.anchorNode, oSel.anchorOffset - 2);
                var sValue = this.queryCommandValue('hilitecolor');
                oSel.removeAllRanges();
                oSel.addRange(oRange);
            }else if(oRange.toString().length > 0){
                //将光标移动到选区末尾
                oSel.collapseToEnd();
                //将选区向前扩展一个字符
                oSel.extend(oSel.anchorNode, oSel.anchorOffset - 1);
                var sValue = this.queryCommandValue('hilitecolor');
                oSel.removeAllRanges();
                oSel.addRange(oRange);
            } else {
                sValue = this.queryCommandValue('hilitecolor');
            }
        } catch (e) {
            //当选区只有一个字符时回出现异常
            oEditor.log(e);
            //恢复选区
            if(oSel&&oRange){
                oSel.removeAllRanges();
                oSel.addRange(oRange);
            }
            //设置为下拉列表中没有的颜色
            sValue = "#fff1ff";
        }
        if (sValue == "transparent") {
            //透明转换为十六进制白色
            sValue = "#ffffff";
        } else {
            // firefox下得到的是rgb颜色，所以这里用自定义函数转换为十六位颜色进行设置
            sValue = oEditor.rgb2Hex(sValue);
        }
        // 执行完"hilitecolor"命令后，要恢复"usecss"设置,让其它命令顺利执行
        oEditor.edit("usecss", true);
        return sValue;
    } else if (oEditor.system.opera) {
        return oEditor.rgb2Hex(this.queryCommandValue('hilitecolor'));
    } else {
        return oEditor.rgb2Hex(this.queryCommandValue('backcolor'));
    }
}
/**
 * 用于查询编辑区的前景色/文字颜色
 *
 * @method forcolor
 * @param void
 * @return {string} 返回光标所在位置的文字的前景色/文字颜色
 * @see #getEditor #queryCommandValue
 * @for Query
 */
function fEditorQueryForecolor() {
    // ie下，查询的结果是十进制的数值，需要转换
    var oEditor=this.getEditor();
    var sValue=this.queryCommandValue('forecolor');
    if(oEditor.system.ie){
        //查询的结果是十进制的数值，需要转换
        sValue=oEditor.num2HexForIe(sValue);
    }else if(oEditor.system.chrome||oEditor.system.opera||oEditor.system.safari){
        sValue=oEditor.rgb2Hex(sValue);
    }
    return sValue;
}
/**
 * 用于查询编辑区域参数命令的状态
 *
 * @method query
 * @param {array}参数命令
 * @return {object} 返回光标所在位置文字的状态，json格式
 * @for Query
 */
function fEditorQueryQuery(aCommands) {
    var oResults={};
    for(var i=0;i<aCommands.length;i++){
        oResults[aCommands[i]]=this[aCommands[i]]();
    }
    return oResults;
}
/**
 * 用于查询编辑区域的所有状态
 *
 * @method queryAll
 * @param void
 * @return {object} 返回光标所在位置文字的所有状态，json格式
 * @see #undo #redo #bold #underline #indent #outdent #italic #strikethrough #superscript #subscript #justifyLeft
 *      #justifyCenter #justifyRight #fontname #fontsize #backcolor #forecolor #insertOrderedList #insertUnorderedList
 * @for Query
 */
function fEditorQueryAll() {
    return {
        "undo":this.undo(),
        "redo":this.redo(),
        "bold" : this.bold(),
        "underline" : this.underline(),
        "indent" : this.indent(),
        "outdent" : this.outdent(),
        "italic" : this.italic(),
        "strikethrough" : this.strikethrough(),
        "superscript" : this.superscript(),
        "subscript" : this.subscript(),
        "justifyLeft" : this.justifyLeft(),
        "justifyCenter" : this.justifyCenter(),
        "justifyRight" : this.justifyRight(),
        "fontname" : this.fontname(),
        "fontsize" : this.fontsize(),
        "backcolor" : this.backcolor(),
        "forecolor" : this.forecolor(),
        "insertOrderedList" : this.insertOrderedList(),
        "insertUnorderedList" : this.insertUnorderedList()
    };
}
/**
 * 监视器子类
 *
 * @method Observer
 * @param {object}oEditor父类Editor实例
 * @return {void}
 * @see #fEditorObserverAdd #fEditorObserverRemove
 * @for Editor
 */
function fEditorObserver(oEditor) {

    var _editor = oEditor;// 编辑器实例
    var _handlerId=0;
    var _cache={};//用于缓存事件

    // 设置编辑器实例
    this.getEditor = function() {
        return _editor;
    }
    //获取新的事件缓存id
    this.getNewHandlerId=function(){
        return ""+_handlerId++;
    }
    //根据id获取事件函数
    this.getHandler=function(sId){
        return _cache[sId];
    }
    //缓存事件
    this.cacheHandler=function(sId,fHandler){
        _cache[sId]=fHandler;
    }
    //删除缓存事件
    this.delCacheHandler=function(sId){
        delete _cache[sId];
    }
    this.add = fEditorObserverAdd;// 添加监视器
    this.remove = fEditorObserverRemove;// 删除监视器
}
/**
 * 用于创建监视器实例
 *
 * @method createObserver
 * @param void
 * @return {object} 返回监视器实例
 * @see #fEditorObserver
 * @for Editor
 */
function fEditorCreateObserver() {
    // 新建监视器实例时传入编辑器实例
    return new fEditorObserver(this);
}
/**
 * 添加监视器
 *
 * @method add
 * @param {object}oParams
 *            {object}.el要添加监视器的元素;
 *            {string}.eventType监听事件类型;
 *            {function}.fn监听函数;
 *            {object}.object监听函数绑定的对象
 *            {array}.params监听函数的参数
 * @return {void}
 * @see #getEditor Editor#addEvent
 * @for Observer
 */
function fEditorObserverAdd(oParams) {
    var oHandler = oParams["fn"];
    if (oParams["object"] || oParams["params"]) {
        oHandler = function() {
            oParams["fn"].apply(oParams["object"], oParams["params"]?oParams["params"]:[]);
        }
    }
    this.getEditor().addEvent({"el":oParams["el"],"eventType":oParams["eventType"],"fn":oHandler});
    var sId=this.getNewHandlerId();
    this.cacheHandler(sId,oHandler);
    return sId;
}
/**
 * 删除监视器
 *
 * @method remove
 * @param {object}oParams
 *            {object}.el要添加监视器的元素;
 *            {string}.eventType监听事件类型;
 *            {function}.fn监听函数
 *            {id}特殊绑定的事件函数的id
 * @return {void}
 * @see #getEditor #getHandler Editor#removeEvent
 * @for Observer
 */
function fEditorObserverRemove(oParams) {
    if(oParams["id"]){
        oParams["fn"]=this.getHandler(oParams["id"]);
    }
    this.getEditor().removeEvent(oParams);
}
/**
 * 记录编辑历史，提供撤销、重做操作
 *
 * @method History
 * @param {object}oEditor 编辑器实例
 * @return {void}
 * @for Editor
 */
function fEditorHistory(oEditor) {
    var _editor = oEditor;// 编辑器实例

    // 设置编辑器实例
    this.getEditor = function() {
        return _editor;
    }

    this.isAble=true;//历史记录器是否运行

    this.history = [];// 历史记录数组，用于记录每一次操作历史
    this.pos = -1;// 当前记录位置

    this.getBookmark = fEditorHistoryGetBookmark;// 获取当前书签
    this.setBookmark = fEditorHistorySetBookmark;// 设置书签
    this.save = fEditorHistorySave;// 保存记录
    this.undo = fEditorHistoryUndo;// 撤销
    this.redo = fEditorHistoryRedo;// 重做
    this.start=fEditorHistoryStart;//开始历史记录器
    this.stop=fEditorHistoryStop;//停止历史记录器
    this.queryUndo=fEditorHistoryQueryUndo;//查询是否可以执行撤销操作
    this.queryRedo=fEditorHistoryQueryRedo;//查询是否可以执行重做操作
}
/**
 * 用于创建记录器实例
 *
 * @method createHistory
 * @param void
 * @return {object} 返回记录器实例
 * @see #fEditorHistory
 * @for Editor
 */
function fEditorCreateHistory() {
    // 新建监视器实例时传入编辑器实例
    return new fEditorHistory(this);
}
/**
 * 用于获取当前书签
 *
 * @method getBookmark
 * @param void
 * @return {object}返回当前书签
 * @see #getEditor Editor#getSelection
 * @for History
 */
function fEditorHistoryGetBookmark() {
    var oEditor = this.getEditor();
    if (oEditor.system.ie) {
        // 获取selection对象
        var oSel = oEditor.getSelection();
        if (/text/i.test(oSel.type)) {
            // 如果选区是文本，获取选区书签
            return oSel.createRange().getBookmark();
        } else {
            return null;
        }
    }else{
        try{
            return oEditor.createSelection().getRange().getBookmark();
        }catch(e){
            oEditor.log(e);
            return null;
        }
    }
}
/**
 * 用于设置书签
 *
 * @method setBookmark
 * @param {object}传入书签
 * @return {void}
 * @see #getEditor
 * @for History
 */
function fEditorHistorySetBookmark(oBookmark) {
    if (oBookmark) {
        var oEditor = this.getEditor();
        if (oEditor.system.ie) {
            // 新建一个textRange对象
            var oRange = oEditor.doc.body.createTextRange();
            if (oBookmark != "[object]") {
                // 将选区移动至书签
                if (oRange.moveToBookmark(oBookmark)) {
                    // oRange.collapse(false);
                    // 选中当前选区（高亮）
                    oRange.select();
                    //将选区滚动到可见范围内
                    //oRange.scrollIntoView();
                }
            }
        }else{
            oEditor.createSelection().getRange().moveToBookmark(oBookmark);
        }
    }
}
/**
 * 用于保存记录
 *
 * @method save
 * @param void
 * @return {boolean}是否保存成功
 * @see #getEditor Editor#getContent,#getRange
 * @for History
 */
function fEditorHistorySave() {
    var that=this;
    var aHistory=that.history;
    if (that.pos == -1) {
        // 如果历史记录为空，则直接添加第一个记录
        aHistory.push([that.getEditor().getContent(), that.getBookmark()]);
        // 设置当前记录位置
        that.pos = 0;
        return true;
    } else {
        var sContent = that.getEditor().getContent();
        // 如果当前编辑框内容与最近的历史记录不同，则将当前状态添加进历史记录
        if (aHistory[that.pos][0] != sContent) {
            // 清除当前位置后的历史记录
            for (var i = 1; i < aHistory.length - that.pos; i++) {
                aHistory.pop();
            }
            // 将当前状态添加进历史记录
            aHistory.push([sContent, that.getBookmark()]);
            // 更新当前记录位置
            that.pos++;
            return true;
        }
    }
    return false;
}
/**
 * 撤销
 *
 * @method undo
 * @param void
 * @return {boolean}是否成功撤销
 * @see #getEditor Editor#setContent
 * @for History
 */
function fEditorHistoryUndo() {
    // 如果历史记录不是空的，就可以进行撤销操作
    if (this.pos != 0) {
        // 获取上一步的历史记录
        var oOp = this.history[this.pos - 1];
        // 设置编辑框的内容为上一步的内容
        this.getEditor().setContent(oOp[0]);
        // 设置选区
        this.setBookmark(oOp[1]);
        // 更新当前记录位置
        this.pos--;
        return true;
    } else {
        return false;
    }
}
/**
 * 重做
 *
 * @method redo
 * @param void
 * @return {boolean}是否重做成功
 * @see #getEditor Editor#setContent
 * @for History
 */
function fEditorHistoryRedo() {
    // 如果当前记录位置不是最后一个历史记录，就可以进行重做操作
    if (this.pos != this.history.length - 1) {
        // 获取下一步的历史记录
        var oOp = this.history[this.pos + 1];
        // 设置编辑框的内容为下一步的内容
        this.getEditor().setContent(oOp[0]);
        // 设置选区
        this.setBookmark(oOp[1]);
        // 更新当前记录位置
        this.pos++;
        return true;
    } else {
        return false;
    }
}
/**
 * 开始历史记录器
 *
 * @method start
 * @param void
 * @return {void}
 * @for History
 */
function fEditorHistoryStart() {
    this.isAble=true;
}
/**
 * 停止历史记录器
 *
 * @method stop
 * @param void
 * @return {void}
 * @for History
 */
function fEditorHistoryStop() {
    this.isAble=false;
}
/**
 * 查询是否可以执行撤销操作
 *
 * @method queryUndo
 * @param void
 * @return {boolean}true表示可以执行撤销操作
 * @for History
 */
function fEditorHistoryQueryUndo() {
    // 如果历史记录不是空的，就可以进行撤销操作
    if (this.pos != 0) {
        return true;
    }else{
        return false;
    }
}
/**
 * 查询是否可以执行重做操作
 *
 * @method queryRedo
 * @param void
 * @return {boolean}true表示可以执行重做操作
 * @for History
 */
function fEditorHistoryQueryRedo() {
    // 如果当前记录位置不是最后一个历史记录，就可以进行重做操作
    if (this.pos != this.history.length - 1) {
        return true;
    } else {
        return false;
    }
}
/**
 * 自定义选区类，对ie和非ie浏览器的selection对象进行封装
 *
 * @method Selection
 * @param {object}oEditor编辑器实例
 * @return {void}
 * @for Editor
 */
function fEditorSelection(oEditor) {
    var _editor = oEditor;// 编辑器实例

    // 设置编辑器实例
    this.getEditor = function() {
        return _editor;
    }

    this.selection = oEditor.getSelection();//系统的selection对象
    this.range;//系统的range对象

    this.getRange = fEditorSelectionGetRange;//获取自定义range对象
    this.addRange = fEditorSelectionAddRange;//将自定义range对象加入选区
    this.getRangeAt;

}
/**
 * 用于创建自定义选区实例
 *
 * @method createSelection
 * @param void
 * @return {object} 返回自定义选区实例
 * @see #fEditorSelection
 * @for Editor
 */
function fEditorCreateSelecion() {
    // 新建监视器实例时传入编辑器实例
    return new fEditorSelection(this);
}
/**
 * 获取当前选中范围
 *
 * @method getRange
 * @param void
 * @return {object} 返回当前选中范围
 * @see #getEditor
 * @for Selection
 */
function fEditorSelectionGetRange() {
    return this.getEditor().createRange();
}
/**
 * 设置选区,由于本编辑器暂不支持多选区操作，所以，添加选区操作既是重新设置选区
 *
 * @method addRange
 * @param {object}oRange指定的range对象
 * @return {void}
 * @see #getEditor
 * @for Selection
 */
function fEditorSelectionAddRange(oRange) {
    if (oRange.range) {
        var oRange2 = oRange.range;
        if (this.getEditor().system.ie) {
            oRange2.moveToBookmark(oRange.bookmark);
            oRange2.select();
            this.range = oRange2;
        } else {
            try {
                this.selection.removeAllRanges();
                oRange2.setStart(oRange.startContainer, oRange.startOffset);
                oRange2.setEnd(oRange.endContainer, oRange.endOffset);
                this.selection.addRange(oRange2);
                oRange.range = oRange2;
            } catch (e) {
                //this.selection.addRange(oRange.range);
                this.getEditor().log(e);
            }
        }
    }else{
        if (this.getEditor().system.ie) {
            oRange.select();
        } else {
            this.selection.removeAllRanges();
            this.selection.addRange(oRange);
        }
    }
}
/**
 * 自定义范围类，对ie和非ie浏览器的range对象进行封装
 *
 * @method Range
 * @param {object}oEditor 编辑器实例
 * @return {void}
 * @for Editor
 */
function fEditorRange(oEditor) {
    var _editor = oEditor;// 编辑器实例

    // 设置编辑器实例
    this.getEditor = function() {
        return _editor;
    }

    this.doc;//编辑器iframe的document对象
    this.range;//当前范围对应的原生range对象
    this.bookmark;//书签

    // 初始化状态
    this.startContainer;// 包含范围的开始点的 Document 节点
    this.startOffset;// startContainer 中的开始点位置
    this.endContainer;// 包含范围的结束点的 Document 节点
    this.endOffset;// endContainer 中的结束点位置
    this.collapsed;// 如果范围的开始点和结束点在文档的同一位置，则为 true，即范围是空的，或折叠的
    this.commonAncestorContainer;// 范围的开始点和结束点的公共父节点（即它们的祖先节点）、嵌套最深的 Document
    // 节点

    // 常量
    this.START_TO_START = 0;
    this.START_TO_END = 1;
    this.END_TO_END = 2;
    this.END_TO_START = 3;

    // 私有方法
    this.getPath = _fEditorRangeGetPath;
    this.getNodeByPath = _fEditorRangeGetNodeByPath;

    // 公有方法
    // // 标准方法
    this.init = fEditorRangeInit;//初始化Range对象
    this.setStart = fEditorRangeSetStart;//把该范围的开始点设置为指定的节点中的指定偏移量
    this.setEnd = fEditorRangeSetEnd;//把该范围的结束点设置为指定的节点和偏移量
    this.setStartBefore = fEditorRangeSetStartBefore;//把该范围的开始点设置为紧邻指定节点之前
    this.setStartAfter = fEditorRangeSetStartAfter;//把该范围的开始点设置为紧邻指定节点之后
    this.setEndBefore = fEditorRangeSetEndBefore;//把该范围的结束点设置为紧邻指定节点之前
    this.setEndAfter = fEditorRangeSetEndAfter;//把该范围的结束点设置为紧邻指定节点之后
    this.collapse = fEditorRangeCollapse;//折叠该范围，使它的边界点重合
    this.selectNode = fEditorRangeSelectNode;//设置该范围的边界点，使它包含指定的节点和它的所有子孙节点
    this.selectNodeContents = fEditorRangeSelectNodeContents;//设置该范围的边界点，使它包含指定节点的子孙节点，但不包含指定的节点本身
    this.compareBoundaryPoints = fEditorRangeCompareBoundaryPoints;//比较指定范围的边界点和当前范围的边界点
    this.deleteContents = fEditorRangeDeleteContents;//删除当前 Range 对象表示的文档区域。
    this.extractContents = fEditorRangeExtractContents;//删除当前范围表示的文档区域，并且以 DocumentFragment 对象的形式返回那个区域的内容。
    this.cloneContents = fEditorRangeCloneContents;//返回新的 DocumentFragment 对象，它包含该范围表示的文档区域的副本。
    this.insertNode = fEditorRangeInsertNode;//把指定的节点插入文档范围的开始点或结束点。
    this.surroundContents = fEditorRangeSurroundContents;//把指定的节点插入文档范围的开始点，然后重定范围中的所有节点的父节点，使它们成为新插入的节点的子孙节点。
    this.cloneRange = fEditorRangeCloneRange;//复制范围

    // //扩展方法
    this.getBookmark = fEditorRangeGetBookmark;//获取可用于使 moveToBookmark 返回相同范围的书签。
    this.moveToBookmark = fEditorRangeMoveToBookmark;//移动到书签。
    this.getSelectedNodes = fEditorRangeGetSelectedNodes;//获取选中的节点集
    this.getFocusNodes=fEditorRangeGetFocusNodes;//获取光标所在的节点集
    this.normalize=fEditorRangeNormalize;//整理范围

    // 初始化,复制选区时，不传入oEditor,不进行初始化
    if (_editor) {
        this.init();
    }
}
/**
 * 用于创建自定义范围实例
 *
 * @method createRange
 * @param void
 * @return {object} 返回自定义范围实例
 * @see #fEditorRange
 * @for Editor
 */
function fEditorCreateRange() {
    // 新建范围实例时传入编辑器实例
    return new fEditorRange(this);
}
/**
 * 获取参数节点的路径
 *
 * @method getPath
 * @param {object}oNode参数节点
 * @return {array}返回参数节点的路径
 * @for Range
 */
function _fEditorRangeGetPath(oNode) {
    var aPath = [];
    var oParent = oNode.parentNode;
    // 遍历父节点，直到body标签
    while (!/body/i.test(oNode.nodeName)) {
        var aChildren = oParent.childNodes;
        for (var i = 0; i < aChildren.length; i++) {
            if (aChildren[i] == oNode) {
                // 把当前节点索引加入路径
                aPath.push(i);
            }
        }
        oNode = oParent;
        oParent = oNode.parentNode;
    }
    return aPath;
}
/**
 * 根据参数路径查找节点
 *
 * @method getNodeByPath
 * @param {array}aPath参数路径
 * @return {object}返回查找到的节点，如果路径错误，返回null；
 * @for Range
 */
function _fEditorRangeGetNodeByPath(aPath) {
    //复制路径数组
    var aPaths=aPath.slice();
    var oNode = this.doc.body;
    var nIndex = aPaths.pop();
    while (nIndex!=undefined) {
        var aChildren = oNode.childNodes;
        if (nIndex < 0 || nIndex > aChildren.length) {
            return null;
        } else {
            oNode = aChildren[nIndex];
        }
        nIndex = aPaths.pop();
    }
    return oNode;
}
/**
 * 初始化Range对象
 *
 * @method init
 * @param {object}oEditor 编辑器实例
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
/*function fEditorRangeInit2(oEditor) {
 this.doc = oEditor.doc;
 this.range = oEditor.getRange();
 if (oEditor.system.ie) {// ie
 var oRange = this.range;
 // 记录书签
 var oBookmark = oRange.getBookmark();
 oRange.collapse(true);
 var oStartParent = oRange.parentElement();
 oRange.moveToBookmark(oBookmark);
 oRange.collapse(false);
 var oEndParent = oRange.parentElement();
 oRange.moveToBookmark(oBookmark);
 var oRangeCpy = oRange.duplicate();

 var aChildren = oStartParent.childNodes;
 // 合并连续的文本节点
 if (aChildren.length > 1) {
 for (var i = 1; i < aChildren.length; i++) {
 if (aChildren[i - 1].nodeType == 3
 && aChildren[i].nodeType == 3) {
 aChildren[i - 1].nodeValue = aChildren[i - 1].nodeValue
 + aChildren[i].nodeValue;
 oStartParent.removeChild(aChildren[i]);
 i--;
 }
 }
 }

 oRangeCpy.moveToElementText(oStartParent);
 if (aChildren.length == 1) {
 var oChild = aChildren[0];
 if (oChild.nodeType == 3) {
 console.log(oRangeCpy.compareEndPoints("EndToStart", oRange));
 if (oRangeCpy.compareEndPoints("EndToStart", oRange)) {

 }
 }
 } else {
 }
 this.startContainer = oStartParent.firstChild;
 this.collapsed = true;
 this.commonAncestorContainer = oEditor.findCommonAncestor(
 this.startContainer, this.endContainer);
 } else {
 // firefox等标准浏览器下利用默认属性实现
 this.startContainer = this.range.startContainer;
 this.startOffset = this.range.startOffset;
 this.endContainer = this.range.endContainer;
 this.endOffset = this.range.endOffset;
 this.collapsed = this.range.collapsed;
 this.commonAncestorContainer = this.range.commonAncestorContainer;
 }
 }*/

function fEditorRangeInit() {
    var that=this;
    var oEditor=that.getEditor();
    that.doc = oEditor.doc;
    oEditor.focus();
    //清理内容，合并相邻的文本节点
    that.doc.body.normalize();
    var oRange = oEditor.getRange();
    //如果range对象为空(可能是编辑器隐藏导致)，则直接返回
    if(!oRange){
        oEditor.log("range为空!");
        return null;
    }
    // ie
    if (oEditor.system.ie) {
        var oBookmark=oRange.getBookmark();
        //折叠选区起始点
        oRange.collapse(true);
        // 在选区起始点插入一个临时标签，用于查找选区边界节点
        oRange.pasteHTML("<a id='eidtorRangeStartTmpA'></a>");
        // 重新获取选区
        oRange=oEditor.getRange();
        //折叠选区到结束点
        oRange.collapse(false);
        // 在选区结束点插入一个临时标签，用于查找选区边界节点
        oRange.pasteHTML("<a id='eidtorRangeEndTmpA'></a>");
        // 获取选区开始点的临时标签
        var oStartA = that.doc.getElementById("eidtorRangeStartTmpA");
        // 获取选区结束点的临时标签
        var oEndA = that.doc.getElementById("eidtorRangeEndTmpA");
        //如果用户选区的范围包含文档结尾，pasteHTML方法无法再结尾处插入html，所以要在添加一个标签到文档结尾
        if(!oEndA){
            oEndA=that.doc.createElement("a");
            that.doc.body.appendChild(oEndA);
        }
        var oParentNode = oStartA.parentNode;
        // 获取包含范围的开始点的 Document 节点
        var oPre = oStartA.previousSibling;
        var oNext = oStartA.nextSibling;
        //如果临时标签相邻，说明没有选取任何内容
        if (oNext == oEndA) {
            oNext=oNext.nextSibling;
            //如果前一个节点或后一个节点是文本节点，则将其作为startContainer和endContainer
            if(oPre&&oPre.nodeType==3){
                //如果后面也是文本节点，要进行合并,防止normalize方法后丢失节点
                if(oNext&&oNext.nodeType==3){
                    oPre.nodeValue=oPre.nodeValue+oNext.nodeValue;
                    oParentNode.removeChild(oNext);
                }
                that.startContainer=that.endContainer=oPre;
                that.startOffset=that.endOffset=oPre.nodeValue.length;
            }else if(oNext&&oNext.nodeType==3){
                that.startContainer=that.endContainer=oNext;
                that.startOffset=that.endOffset=0;
            }else{
                ////如果前一个节点和后一个节点都不是文本节点，则将父节点作为startContainer和endContainer
                var oParent=oStartA.parentNode;
                var aChildren=oParent.childNodes;
                var i=0;
                //获取节点索引
                for(i=0;i<aChildren.length;i++){
                    if(aChildren[i]==oStartA)break;
                }
                that.startContainer=that.endContainer=oParent;
                that.startOffset=that.endOffset=i;
            }
            that.collapsed = true;
            // 移除临时节点
            oStartA.parentNode.removeChild(oStartA);
            oEndA.parentNode.removeChild(oEndA);
        }else{
            // 如果前后都是文本节点，则要进行合并，避免normalize方法后节点丢失
            if (oPre && oPre.nodeType == 3 && oNext && oNext.nodeType == 3) {
                that.startOffset = oPre.nodeValue.length;
                // 合并文本节点
                oPre.nodeValue = oPre.nodeValue + oNext.nodeValue;
                oNext.parentNode.removeChild(oNext);
                that.startContainer = oPre;
                // 调整选区范围
                //oRange.moveToBookmark(oBookmark);
                // oRange.moveStart("character",that.startOffset-oPre.nodeValue.length);
            } else if (oNext && oNext.nodeType == 3) {
                // 仅有后一个节点是文本节点
                that.startOffset = 0;
                that.startContainer = oNext;
            } else {
                // 后一个节点不是文本节点，则在后一个节点子孙节点中寻找文本节点
                while (oNext && oNext.nodeType != 3) {
                    oNext = oNext.firstChild;
                }
                // 如果oNext是一个节点
                if (oNext) {
                    that.startOffset = 0;
                    that.startContainer = oNext;
                } else {
                    that.startOffset = 0;
                    that.startContainer = oStartA.parentNode;
                }
            }
            // 移除临时节点
            oStartA.parentNode.removeChild(oStartA);
            that.startContainer = that.startContainer || that.doc.body;

            // 获取包含范围的结束点的 Document 节点
            oPre = oEndA.previousSibling;
            oNext = oEndA.nextSibling;
            // 如果前后都是文本节点，则要合并
            if (oPre && oPre.nodeType == 3 && oNext && oNext.nodeType == 3) {
                // ie下，移除临时a标签后，依然是两个独立的文本节点，所以偏移量要加上前一个文本节点的长度
                that.endOffset = oPre.nodeValue.length;
                // 合并文本节点
                oPre.nodeValue = oPre.nodeValue + oNext.nodeValue;
                oNext.parentNode.removeChild(oNext);
                that.endContainer = oPre;
            } else if (oPre && oPre.nodeType == 3) {
                // 前一个节点是文本节点
                that.endOffset = oPre.nodeValue.length;
                that.endContainer = oPre;
            } else {
                if (oPre) {
                    // 前一个节点不是文本节点，则在前一个节点子孙节点中寻找文本节点
                    while (oPre && oPre.hasChildNodes()) {
                        oPre = oPre.lastChild;
                    }
                    //如果找到文本节点，则以此为结束点
                    if(oPre.nodeType==3){
                        that.endOffset = oPre.nodeValue.length;
                        that.endContainer = oPre;
                    }else{
                        that.endOffset = 0;
                        that.endContainer = oPre;
                    }
                } else {
                    var oNode = oEndA.parentNode;
                    // 尝试向前寻找文本节点
                    while (oNode && oNode.nodeName != "BODY") {
                        oPre = oNode.previousSibling;
                        if (oPre) {
                            while (oPre && oPre.nodeName == "BR")
                                oPre = oPre.previousSibling;
                            while (oPre && oPre.hasChildNodes()) {
                                oPre = oPre.lastChild;
                                while (oPre && oPre.nodeName == "BR")
                                    oPre = oPre.previousSibling;
                            }
                            if (oPre.nodeType == 3)
                                break;
                        } else {
                            oNode = oNode.parentNode;
                        }
                    }
                    if (oPre && oPre.nodeType == 3) {
                        that.endOffset = oPre.nodeValue.length;
                        that.endContainer = oPre;
                    } else {
                        //如果前面没有节点
                        that.endOffset = 0;
                        that.endContainer = oEndA.parentNode;
                    }
                }
            }
            //移除临时节点
            oEndA.parentNode.removeChild(oEndA);
            that.endContainer = that.endContainer || that.doc.body;
            that.collapsed = false;
            that.commonAncestorContainer = oEditor.findCommonAncestor(
                that.startContainer, that.endContainer);
        }
        //调整选区
        oRange.moveToBookmark(oBookmark);
        //oRange=oEditor.getRange();
        // 选中/置为高亮
        oRange.select();
        that.range=oRange;
    } else {
        // firefox等标准浏览器下利用默认属性实现
        that.range=oRange;
        var oStartContainer=that.range.startContainer;
        var nStartOffset=that.range.startOffset;
        var oEndContainer=that.range.endContainer;
        var nEndOffset=that.range.endOffset;
        //尽量找到叶子节点作为范围的起始、结束节点
        if(oStartContainer.nodeType!=3&&oStartContainer.hasChildNodes()){
            oStartContainer=oStartContainer.childNodes[nStartOffset];
            while(oStartContainer.nodeType!=3&&oStartContainer.hasChildNodes()){
                oStartContainer=oStartContainer.childNodes[0];
            }
            nStartOffset=0;
        }
        if(oEndContainer.nodeType!=3&&oEndContainer.hasChildNodes()){
            var aChildren=oEndContainer.childNodes;
            nEndOffset=nEndOffset>=aChildren.length?aChildren.length-1:nEndOffset;
            oEndContainer=aChildren[nEndOffset];
            while(oEndContainer.nodeType!=3&&oEndContainer.hasChildNodes()){
                oEndContainer=oEndContainer.lastChild;
            }
            nEndOffset=oEndContainer.nodeType==3?oEndContainer.nodeValue.length:0;
        }
        that.startContainer = oStartContainer;
        that.startOffset = nStartOffset;
        that.endContainer = oEndContainer;
        that.endOffset = nEndOffset;
        that.collapsed = that.range.collapsed;
        that.commonAncestorContainer = that.range.commonAncestorContainer;
    }
    //保存范围的书签
    that.bookmark=that.getBookmark();
}
/**
 * 把该范围的开始点设置为指定的节点中的指定偏移量
 *
 * @method setStart
 * @param {object}oNode 指定的节点
 * @param {number}nOffset 偏移量
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeSetStart(oNode, nOffset) {
}
/**
 * 把该范围的结束点设置为指定的节点和偏移量
 *
 * @method setEnd
 * @param {object}oNode 指定的节点
 * @param {number}nOffset 偏移量
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeSetEnd(oNode, nOffset) {
}
/**
 * 把该范围的开始点设置为紧邻指定节点之前
 *
 * @method setStartBefore
 * @param {object}oNode 指定的节点
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeSetStartBefore(oNode) {
}
/**
 * 把该范围的开始点设置为紧邻指定节点之后
 *
 * @method setStartAfter
 * @param {object}oNode 指定的节点
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeSetStartAfter(oNode) {
}
/**
 * 把该范围的结束点设置为紧邻指定节点之前
 *
 * @method setEndBefore
 * @param {object}oNode 指定的节点
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeSetEndBefore(oNode) {
}
/**
 * 把该范围的结束点设置为紧邻指定节点之后
 *
 * @method setEndAfter
 * @param {object}oNode 指定的节点
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeSetEndAfter(oNode) {
}
/**
 * 折叠该范围，使它的边界点重合
 *
 * @method collapse
 * @param {boolean}bToStart
 * @return {void}
 * @see #init
 * @for Range
 */
function fEditorRangeCollapse(bToStart) {
    this.range.collapse(bToStart);
    this.init();
}
/**
 * 设置该范围的边界点，使它包含指定的节点和它的所有子孙节点
 *
 * @method selectNode
 * @param {object}oNode
 * @return {void}
 * @see #getEditor
 * @for Range
 */
function fEditorRangeSelectNode(oNode) {
    if (this.getEditor().system.ie) {
        this.insertNode(oNode);
    } else {
        this.range.selectNode(oNode);
    }
}
/**
 * 设置该范围的边界点，使它包含指定节点的子孙节点，但不包含指定的节点本身
 *
 * @method selectNodeContents
 * @param {object}oNode
 * @return {void}
 * @see #getEditor
 * @for Range
 */
function fEditorRangeSelectNodeContents(oNode) {
    if (this.getEditor().system.ie) {
        var aChildren = oNode.childNodes;
        for (var i = 0; i < aChildren.length; i++) {
            this.insertNode(aChildren[i]);
        }
    } else {
        this.range.selectNodeContents(oNode);
    }
}
/**
 * 比较指定范围的边界点和当前范围的边界点，根据它们的顺序返回 -1、0 和 1。比较哪个边界点由它的第一个参数指定， 它的值必须是前面定义的常量之一
 *
 * @method compareBoundaryPoints
 * @param {number}nHow 声明如何执行比较操作（即比较哪些边界点）。它的合法值是 Range 接口定义的常量。
 * @param {object}oSourceRange 要与当前范围进行比较的范围
 * @return {number} 如果当前范围的指定边界点位于 sourceRange 指定的边界点之前，则返回 -1。 如果指定的两个边界点相同，则返回
 *         0。如果当前范围的边界点位于 sourceRange 指定的边界点之后，则返回 1。
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeCompareBoundaryPoints(nHow, oSourceRange) {
}
/**
 * 删除当前 Range 对象表示的文档区域。
 *
 * @method deleteContents
 * @param void
 * @return {void}
 * @see #getEditor
 * @for Range
 */
function fEditorRangeDeleteContents() {
    var oEditor = this.getEditor();
    if (oEditor.system.ie) {
        this.range.pasteHTML("");
    } else {
        this.range.deleteContents();
    }
}
/**
 * 删除当前范围表示的文档区域，并且以 DocumentFragment 对象的形式返回那个区域的内容。
 *
 * @method deleteContents
 * @param void
 * @return {object} 以 DocumentFragment 对象的形式返回当前文档区域的内容
 * @see #getEditor
 * @for Range
 */
function fEditorRangeExtractContents() {
    if (this.getEditor().system.ie) {
        var oDocFrag = this.cloneContents();
        this.deleteContents();
        return oDocFrag;
    } else {
        return this.range.extractContents();
    }
}
/**
 * 返回新的 DocumentFragment 对象，它包含该范围表示的文档区域的副本。
 *
 * @method cloneContents
 * @param void
 * @return {object} 返回新的 DocumentFragment 对象，它包含该范围表示的文档区域的副本。
 * @see #getEditor
 * @for Range
 */
function fEditorRangeCloneContents() {
    if (this.getEditor().system.ie) {
        var oDocFrag = document.createDocumentFragment();
        oDocFrag.innerHTML = this.range.htmlText;
        return oDocFrag;
    } else {
        return this.range.CloneContents();
    }
}
/**
 * 创建一个新的 Range 对象，表示与当前的 Range 对象相同的文档区域。
 *
 * @method cloneRange
 * @param void
 * @return {object} 返回与当前的 Range 对象相同的文档区域
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeCloneRange() {
    // 创建新的自定义Range对象
    var oRange = new fEditorRange();
    // 设置类变量
    oRange.doc = this.doc;
    oRange.range = this.range;
    oRange.startContainer = this.startContainer;
    oRange.startOffset = this.startOffset;
    oRange.endContainer = this.endContainer;
    oRange.endOffset = this.endOffset;
    oRange.collapsed = this.collapsed;
    oRange.commonAncestorContainer = this.commonAncestorContainer;
    return oRange;
}
/**
 * 把指定的节点插入文档范围的开始点或结束点，默认为起点。
 *
 * @method insertNode
 * @param {object}oNode
 *            指定节点
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeInsertNode(oNode, bIsEnd) {
    // 插入到选区结束点
    if (bIsEnd) {
        var oEndContainer = this.endContainer, nEndOffset = this.endOffset, oTextNode, oCurrent;
        // 如果文本节点或者CDATA节点，可能需要切分
        if ((oEndContainer.nodeType === 3 || oEndContainer.nodeType === 4)
            && oEndContainer.nodeValue) {
            if (!nEndOffset || nEndOffset == 0) {
                // 选区起点在文本节点前
                oEndContainer.parentNode.insertBefore(oNode, oEndContainer);
            } else if (nEndOffset >= oEndContainer.nodeValue.length) {
                // 选区起点在文本节点后
                oEndContainer.parentNode.insertAfter(oNode, oEndContainer);
            } else {
                // 选区起点在文本节点中间，则需要切分文本节点
                oTextNode = oEndContainer.splitText(nEndOffset);
                oEndContainer.parentNode.insertBefore(oNode, oTextNode);
            }
        } else {
            // 其余类型的节点，不需要切分
            if (oEndContainer.childNodes.length > 0) {
                oCurrent = oEndContainer.childNodes[nEndOffset];
            }
            if (oCurrent) {
                oEndContainer.insertAfter(oNode, oCurrent);
            } else {
                oEndContainer.appendChild(oNode);
            }
        }
    } else {
        // 插入到选区开始点
        var oStartContainer = this.startContainer, nStartOffset = this.startOffset, oTextNode, oCurrent;
        // 如果文本节点或者CDATA节点，可能需要切分
        if ((oStartContainer.nodeType === 3 || oStartContainer.nodeType === 4)
            && oStartContainer.nodeValue) {
            if (!nStartOffset || nStartOffset == 0) {
                // 选区起点在文本节点前
                oStartContainer.parentNode.insertBefore(oNode, oStartContainer);
            } else if (nStartOffset >= oStartContainer.nodeValue.length) {
                // 选区起点在文本节点后
                oEndContainer.parentNode.insertAfter(oNode, oStartContainer);
            } else {
                // 选区起点在文本节点中间，则需要切分文本节点
                oTextNode = oStartContainer.splitText(nStartOffset);
                oStartContainer.parentNode.insertBefore(oNode, oTextNode);
            }
        } else {
            // 其余类型的节点，不需要切分
            if (oStartContainer.childNodes.length > 0) {
                oCurrent = oStartContainer.childNodes[nStartOffset];
            }
            if (oCurrent) {
                oStartContainer.insertBefore(oNode, oCurrent);
            } else {
                oStartContainer.appendChild(oNode);
            }
        }
    }
    // 重新初始化
    this.init();
}
/**
 * 把指定的节点插入文档范围的开始点，然后重定范围中的所有节点的父节点，使它们成为新插入的节点的子孙节点。
 *
 * @method surroundContents
 * @param {object}oNode参数节点
 * @return {void}
 * @see #getEditor
 * @for Range
 */
function fEditorRangeSurroundContents(oNode) {
    if (this.getEditor().system.ie) {
        oNode.appendChild(this.extractContents());
        this.insertNode(oNode);
    } else {
        try {
            this.range.surroundContents(oNode);
        } catch (e) {
            return false;
        }
    }
    return true;
}
/**
 * 获取可用于使 moveToBookmark 返回相同范围的书签。
 *
 * @method getBookmark
 * @param void
 * @return {object}
 * @see #getEditor
 * @for Range
 */
function fEditorRangeGetBookmark() {
    var oEditor = this.getEditor();
    //整理文档
    oEditor.doc.body.normalize();
    try {
        if (oEditor.system.ie) {
            return this.range.getBookmark();
        } else {
            // 非ie浏览器下
            return {
                // 包含范围起点的节点，用路径表示
                "startContainer" : this.getPath(this.startContainer),
                // startContainer 中的起点位置
                "startOffset" : this.startOffset,
                // 包含范围终点的节点，用路径表示
                "endContainer" : this.getPath(this.endContainer),
                // endContainer 中的结束点位置
                "endOffset" : this.endOffset
            }
        }
    } catch (e) {
        oEditor.log(e);
        return null;
    }
}
/**
 * 移动到书签。
 *
 * @method moveToBookmark
 * @param {object}oBookmark 书签
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeMoveToBookmark(oBookmark) {
    var oEditor = this.getEditor();
    if (oEditor.system.ie) {
        // ie下，直接利用原生方法移动至书签
        this.range.moveToBookmark(oBookmark);
    } else {
        // 根据路径获得书签开始和结束节点
        var oStartContainer = this.getNodeByPath(oBookmark.startContainer);
        var oEndContainer = this.getNodeByPath(oBookmark.endContainer);
        try {
            // 设置选区起点
            this.range.setStart(oStartContainer, oBookmark.startOffset);
            // 设置选区终点
            this.range.setEnd(oEndContainer, oBookmark.endOffset);
        } catch (e) {
            oEditor.log(e);
        }
        var oSel = oEditor.getSelection();
        oSel.removeAllRanges();
        oSel.addRange(this.range);
    }
}
/**
 * 获取选中的节点集，对于选区开始节点和结束节点，如果不是完整的文本节点（即节点内只有部分文字在选区中），则切分该节点，构造新的文本节点，
 * 添加到结果数组中，因此，使用本方法后，可能有部分选取不会丢失高亮。
 *
 * @method getSelectedNodes
 * @param void
 * @return {array} 返回选中的节点集
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeGetSelectedNodes() {
    var that=this;
    var oStartContainer = that.startContainer, oEndContainer = that.endContainer, nStartOffset = that.startOffset, nEndOffset = that.endOffset,
    // 新建一个数组，用于保存选区内的元素
        aNodes = new Array();
    // 清理内容，合并相邻的文本节点
    that.doc.body.normalize();
    // 如果选区开始节点和结束节点是同一个节点
    if (oStartContainer == oEndContainer) {
        //如果没有选中任何文本或者节点，则返回空数组
        if(nStartOffset==nEndOffset){
            return aNodes;
        }
        // 如果是文本节点或者CDATA节点，可能需要切分
        if ((oStartContainer.nodeType === 3 || oStartContainer.nodeType === 4)
            && oStartContainer.nodeValue) {
            if (nStartOffset > 0) {
                //切分节点
                oStartContainer = oStartContainer.splitText(nStartOffset);
                // 更新结束点的索引
                nEndOffset = nEndOffset - nStartOffset;
            }
            if (nEndOffset < oStartContainer.nodeValue.length) {
                oStartContainer.splitText(nEndOffset);
            }
            aNodes.push(oStartContainer);
            // 更新相应变量的值
            that.startContainer = that.endContainer = that.commonAncestorContainer = oStartContainer;
            that.startOffset = 0;
            that.endOffset = nEndOffset;
        } else {
            var aChildren = oStartContainer.childNodes;
            var nLength = aChildren.length;
            for (var i = nStartOffset; i < nEndOffset; i++) {
                aNodes.push(aChildren[i]);
            }
        }
    } else {
        //如果选区开始节点不是公共祖先节点
        if (oStartContainer != that.commonAncestorContainer) {
            // 从选区开始节点开始后序遍历文档树，将合适的节点添加进结果数组中
            var oCurrentLeftNode = oStartContainer;
            // 如果是完整的文本节点，则直接添加到结果数组中
            if (nStartOffset == 0) {
                aNodes.push(oCurrentLeftNode);
            } else if(oCurrentLeftNode.nodeType==3){
                // 如果只是选择了部分文本，则先对开始文本节点进行切分
                oCurrentLeftNode = oCurrentLeftNode.splitText(nStartOffset);
                // 重新设置范围起始节点
                that.startContainer = oCurrentLeftNode;
                that.startOffset = 0;
                // 将切分出来的文本节点添加到结果数组中
                aNodes.push(oCurrentLeftNode);
            }else{
                aNodes.push(oCurrentLeftNode.childNodes[nStartOffset]);
            }
            var oCurrentParent = oCurrentLeftNode.parentNode;
            // 如果当前节点的父节点不是选区的祖先节点，进入循环
            while (oCurrentParent
                && oCurrentParent != that.commonAncestorContainer) {
                var oNext = oCurrentLeftNode.nextSibling;
                // 遍历右兄弟节点
                while (oNext) {
                    if (oNext.nodeType != 8) {
                        // 把出去注释外的节点添加到结果数组中
                        aNodes.push(oNext);
                    }
                    oNext = oNext.nextSibling;
                }
                oCurrentLeftNode = oCurrentParent;
                oCurrentParent = oCurrentLeftNode.parentNode;
            }
        }
        //如果选区结束节点不是公共祖先节点
        if (oEndContainer != that.commonAncestorContainer) {
            // 从选区结束节点开始向上遍历文档树，将合适的节点添加进结果数组中
            var oCurrentRightNode = oEndContainer;
            // 如果只是选择了部分文本，则先对结束文本节点进行切分
            if (oCurrentRightNode.nodeType == 3
                && nEndOffset < oCurrentRightNode.nodeValue.length) {
                oCurrentRightNode.splitText(nEndOffset);
                // 重新设置范围结束节点
                that.endContainer = oCurrentRightNode;
                that.endOffset = oCurrentRightNode.nodeValue.length;
            }
            // 将结束节点添加到结果数组中
            aNodes.push(oCurrentRightNode);
            oCurrentParent = oCurrentRightNode.parentNode;
            // 如果当前节点的父节点不是选区的祖先节点，进入循环
            while (oCurrentParent
                && oCurrentParent != that.commonAncestorContainer) {
                var oPre = oCurrentRightNode.previousSibling;
                // 遍历左兄弟节点
                while (oPre) {
                    if (oPre.nodeType != 8) {
                        // 把出去注释外的节点添加到结果数组中
                        aNodes.push(oPre);
                    }
                    oPre = oPre.previousSibling;
                }
                oCurrentRightNode = oCurrentParent;
                oCurrentParent = oCurrentRightNode.parentNode;
            }
        }

        // 将祖先节点下合适的子节点添加进结果数组中
        var oNext = oCurrentLeftNode.nextSibling;
        while (oNext&&oNext != oCurrentRightNode) {
            if (oNext.nodeType != 8) {
                // 把出去注释外的节点添加到结果数组中
                aNodes.push(oNext);
            }
            oNext = oNext.nextSibling;
        }
    }
    // 返回结果
    return aNodes;
}
/**
 * 获取光标所在的节点集，如果用户没有选中任何文或控件，则返回光标所在的最小节点，否则返回选中节点集
 *
 * @method getFocusNodes
 * @param void
 * @return {array} 返回选中的节点集
 * @see #getSelectedNodes
 * @for Range
 */
function fEditorRangeGetFocusNodes(){
    if(this.startContainer==this.endContainer&&this.startOffset==this.endOffset){
        return [this.startContainer];
    }else{
        return this.getSelectedNodes();
    }
}
/**
 * 整理范围,合并范围前后的文本节点
 *
 * @method normalize
 * @param void
 * @return {void}
 * @for Range
 */
function fEditorRangeNormalize(){
    var that=this;
    var oStartContainer = that.startContainer, oEndContainer = that.endContainer, nStartOffset = that.startOffset, nEndOffset = that.endOffset;
    //如果startContainer是文本节点，则要检查是否可进行合并
    if (oStartContainer.nodeType == 3) {
        var oPre = oStartContainer.previousSibling;
        // 如果startContainer的前一个兄弟节点是文本，则要进行合并
        if (oPre && oPre.nodeType == 3) {
            var sValue=oPre.nodeValue;
            that.startOffset=sValue.length;
            oStartContainer.nodeValue=sValue+oStartContainer.nodeValue;
            oPre.parentNode.removeChild(oPre);
        }
    }
    //如果endContainer是文本节点，则要检查是否可进行合并
    if (oEndContainer.nodeType == 3) {
        var oNext=oEndContainer.nextSibling;
        // 如果endContainer的前一个兄弟节点是文本，则要进行合并
        if (oNext && oNext.nodeType == 3) {
            var sValue=oNext.nodeValue;
            that.endOffset=oEndContainer.length;
            oEndContainer.nodeValue=oEndContainer.nodeValue+sValue;
            oNext.parentNode.removeChild(oNext);
        }
    }
}