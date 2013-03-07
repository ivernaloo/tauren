/*******************************************************************************
 * NetEase New Mail System 2010 Version. * * File Name: editor.view.js * Written
 * by: yhzheng * * Version 1.0 (MSIE 6.0 above,Firefox2.0,Netscape.) * Created
 * Date: 2010-08-30 * Copyright：1997-2010 NetEase.com Inc. All rights reserved. *
 ******************************************************************************/
/**
 * 该文件为网易邮箱极速风格3.5版的HTML编辑器模块表现层 代码注释使用YUI
 * Doc{http://developer.yahoo.com/yui/yuidoc/}标准。
 *
 * @module EditorView
 * @requires Editor
 * @version 1.0
 * @author yhzheng
 * @support IE6.0+/Firefox/Chrome/Safari/Opera
 */

/**
 * EditorView模块主类
 *
 * @class EditorView
 * @constructor
 * @return {void}
 */

function EditorView(oSettings) {

    //类变量
    this.editorDiv; // HTML编辑器所在的div
    this.toolbarDiv; // 工具栏所在div
    this.basicToolbarDiv; // 简单功能工具栏div
    this.fullToolbarDiv; // 全部功能工具栏div
    this.codeToolbarDiv; // 源码编辑模式div
    this.editorAreaDiv; // 编辑区div
    this.editorIframe; // 编辑区iframe
    this.editorSourceTextarea; // 源码编辑textarea
    this.editorTextTextarea; // 纯文本编辑textarea
    this.editMode// "basic" 表示简单功能编辑模式，"full"表示全部功能编辑模式,"source"表示源码编辑模式，"text"表示纯文本编辑模式,"hide"表示隐藏工具栏模式
    this.editModeTmp;//临时保存编辑模式，恢复成html模式时需要用到
    this.editModeTmpForToogle;//用于隐藏/展开工具栏时保存编辑模式
    this.popupDiv; // 弹出div
    this.editor; // Editor实例
    this.format; // Format实例
    this.query; // Query实例
    this.observer; // Observer实例
    this.history;// History实例
    this.range; // 用于在IE下编辑框失去焦点时缓存选择区域，并在编辑框获得焦点是恢复选择区域
    this.img; // 正在编辑的图片
    this.tableWin;//用于缓存插入表格对话框数据
    this.listener={};//监听器列表
    this.editorDivClass;//折叠工具栏时，保存class
    this.historyTimer;//历史记录计时器
    this.toolbar;//工具栏缓存
    this.tablePreviewDiv;//插入表格预览div
    this.debug=false;//是否是调试状态，主要用于控制log
    this.system; // 存储浏览器版本，this.system.ie/firefox/chrome/opera/safari,如果
    // 浏览器是IE的，this.system.ie的值是浏览器的版本号，!this.system.ie表示非IE浏览器
    this.menuContainer;//菜单容器
    this.popupMenus = {}; // 下拉菜单
    this.settings = { // 初始化编辑器视图的设置
        editorDiv : null,//HTML编辑器所在的div或其id
        openToolbar:true,//是否展开工具栏
        tabindex:0,//编辑器起始tabindex的值
        html:null,//初始化body内的html内容
        fontsize:null,//编辑器的默认字号
        fontname:null,//编辑器的默认字号
        forecolor:null,//编辑器的默认文字颜色
        customView:null,//自定义编辑器面板
        menuContainer:null//菜单容器
    };

    //工具栏按钮初始化信息，初始化后删除
    this.toolbarItems = {
        "undo" : {
            func : "format",
            className:"g-editor-btninfo-redo",
            title:"撤销"
        },
        "redo" : {
            func : "format",
            className:"g-editor-btninfo-do",
            title:"重做"
        },
        "cut" : {
            func : "format",
            className:"g-editor-btninfo-cut",
            title:"剪切"
        },
        "copy" : {
            func : "format",
            className:"g-editor-btninfo-copy",
            title:"复制"
        },
        "paste" : {
            func : "format",
            className:"g-editor-btninfo-paste",
            title:"粘贴"
        },
        "fontname" : {
            func : "popup",
            className:"g-editor-btninfo-ffm2",
            title:"字体"
        },
        "fontnameFull" : {
            func : "popup",
            className:"g-editor-btninfo-ffm",
            title:"字体"
        },
        "fontsize" : {
            func : "popup",
            className:"g-editor-btninfo-fsz",
            title:"选择字体大小"
        },
        "fontsizeFull" : {
            func : "popup",
            className:"g-editor-btninfo-fsz2",
            title:"选择字体大小"
        },
        "justify" : {
            func : "popup",
            className:"g-editor-btninfo-align",
            title:"选择对齐方式"
        },
        "list" : {
            func : "popup",
            className:"g-editor-btninfo-lst",
            title:"设置列表"
        },
        "indent" : {
            func : "popup",
            className:"g-editor-btninfo-tid",
            title:"设置缩进"
        },
        "lineheight" : {
            func : "popup",
            className:"g-editor-btninfo-lht",
            title:"设置行高"
        },
        "bold" : {
            func : "format",
            className:"g-editor-btninfo-fwt",
            title:"加粗"
        },
        "italic" : {
            func : "format",
            className:"g-editor-btninfo-fst",
            title:"斜体"
        },
        "underline" : {
            func : "format",
            className:"g-editor-btninfo-udl",
            title:"下划线"
        },
        "forecolor" : {
            func : "popup",
            className:"g-editor-btninfo-fcl",
            title:"选择字体颜色"
        },
        "backcolor" : {
            func : "popup",
            className:" g-editor-btninfo-bgc",
            title:"选择字体背景"
        },
        "insertHorizontalRule" : {
            func : "format",
            className:"g-editor-btninfo-line",
            title:"插入横线"
        },
        "insertTime" : {
            func : "format",
            className:"g-editor-btninfo-date",
            title:"添加日期"
        },
        "insertTable" : {
            func : "custom",
            className:"g-editor-btninfo-table",
            title:"添加表格"
        },
        "removeFormat" : {
            func : "format",
            className:"g-editor-btninfo-clear",
            title:"消除格式"
        },
        "link" : {
            func : "custom",
            className:"g-editor-btninfo-uri",
            title:"插入/删除链接"
        },
        "bbsimage" : {
            func : "custom",
            className:"g-editor-btninfo-ipc",
            title:"添加图片"
        },
        "bbsvideo" : {
            func : "custom",
            className:"g-editor-btninfo-bbsvideo",
            title:"添加影音"
        },
        "bbsattach" : {
            func : "custom",
            className:"g-editor-btninfo-bbsattach",
            title:"添加附件"
        },
        "bbshtml" : {
            func : "custom",
            className:"g-editor-btninfo-bbshtml",
            title:"添加HTML"
        },
        "bbsformat" : {
            func : "custom",
            className:"g-editor-btninfo-bbsformat",
            title:"自动排版"
        },
        "bbstcard" : {
            func : "custom",
            className:"g-editor-btninfo-bbstcard",
            title:"插入微博名片"
        },
        "bbs9box" : {
            func : "custom",
            className:"g-editor-btninfo-bbs9box",
            title:"插入减肥日志"
        },
        "image" : {
            func : "custom",
            className:"g-editor-btninfo-ipc",
            title:"添加图片"
        },
        "capture" : {
            func : "custom",
            className:"g-editor-btninfo-scs",
            title:"截图"
        },
        "portrait" : {
            func : "custom",
            className:"g-editor-btninfo-face",
            title:"添加表情"
        },
        "letter" : {
            func : "custom",
            className:"g-editor-btninfo-paper",
            title:"添加信纸"
        },
        "sign" : {
            func : "custom",
            className:"g-editor-btninfo-sign",
            title:"添加签名"
        },
        "source" : {
            func : "editMode",
            className:"g-editor-btninfo-code",
            title:"编辑HTML源码"
        },
        "basic" : {
            func : "editMode",
            className:"g-editor-btninfo-basic",
            title:"切换到简单功能"
        },
        "full":{
            func : "editMode",
            className:"g-editor-btninfo-full",
            title:"切换到全部功能"
        },
        "fullSource" : {
            func : "editMode",
            className:"g-editor-btninfo-code",
            title:"返回可视化编辑"
        }
    }

    //类方法
    this.log = fEditorViewLog; // 输出日志
    this.getNode = fEditorViewGetNode; // 根据id获取元素
    this.getChildren = fEditorViewGetChildren; // 获取指定标签类型的孩子节点集
    this.extend = fEditorViewExtend; // 扩展对象
    this.initHtml = fEditorViewInitHtml;// 初始化html页面
    this.initToolbar = fEditorViewInitToolbar; // 初始化编辑器视图工具栏
    this.init = fEditorViewInit; // 初始化编辑器视图
    this.changeToolbar = fEditorViewChangeToolbar; // 改变工具栏状态
    this.getEvent = fEditorViewGetEvent; // 获取事件对象
    this.show = fEditorViewShow; // 显示元素
    this.hide = fEditorViewHide; // 隐藏元素
    this.toogle = fEditorViewToggle; // 显示/隐藏元素
    this.addClass = fEditorViewAddClass; // 添加class
    this.removeClass = fEditorViewRemoveClass; // 删除class
    this.stopEvent = fEditorViewStopEvent; // 停止事件冒泡
    this.setDragable=fEditorViewSetDragable;//使对象可以拖动
    this.msgBox=fEditorViewMsgBox;//系统弹出框
    this.getStyle=fEditorViewGetStyle;//获取指定元素的样式
    this.getLeft = fEditorViewGetElementLeft; // 获取元素和编辑器左边框的距离
    this.getTop = fEditorViewGetElementTop; // 获取元素和编辑器上边框的距离

    //弹出层
    this.selectMenu=fEditorViewSelectMenu;//为下拉菜单选中光标所在文本的样式
    this.delayPopup = fEditorViewDelayPopup; // 延时弹出
    this.popup = fEditorViewPopup; // 弹出层
    this.hidePopup = fEditorViewHidePopup; // 隐藏弹出层
    this.popupJustifyMenu = fEditorViewPopupJustifyMenu;// 弹出对齐方式下拉列表
    this.popupListMenu = fEditorViewPopupListMenu;// 弹出列表方式下拉列表
    this.popupIndentMenu = fEditorViewPopupIndentMenu;// 弹出缩进/突出下拉列表
    this.popupFontsizeMenu = fEditorViewPopupFontsizeMenu;// 弹出字号下拉列表
    this.popupFontnameMenu = fEditorViewPopupFontnameMenu;// 弹出字体下拉列表
    this.popupForecolorMenu = fEditorViewPopupForecolorMenu;// 弹出前景色下拉列表
    this.popupBackcolorMenu = fEditorViewPopupBackcolorMenu;// 弹出背景色下拉列表
    this.popupLineheightMenu = fEditorViewPopupLineheightMenu;// 弹出行高下拉列表
    this.popupInsertLinkWin = fEditorViewPopupInsertLinkWin;// 弹出添加链接窗口
    this.popupInsertTableWin = fEditorViewPopupInsertTableWin;// 弹出添加表格窗口
    this.popupImgToolbar = fEditorViewPopupImgToolbar; // 弹出图片编辑栏

    this.initTableDiv=fEditorViewInitTableDiv;//初始化插入表格对话框
    this.validTableInput=fEditorViewValidTableInput;//校验添加表格的输入数据
    this.insertTable=fEditorViewInsertTable;//插入表格
    this.refreshPreviewTable=fEditorViewRefreshPreviewTable;//刷新表格对话框中的预览
    this.insertTableMenuClick=fEditorViewInsertTableMenuClick;//处理插入表格对话框的单击事件
    this.insertTableMenuChange=fEditorViewInsertTableMenuChange;//处理插入表格对话框的输入变化事件
    this.editImage = fEditorViewEditImage; // 编辑图片
    this.changeEditMode=fEditorViewChangeEditMode;//切换纯文本/html编辑模式
    this.doClick = fEditorViewDoClick; // 处理鼠标单击
    this.clickList = fEditorViewClickList; // 处理下拉列表单击
    this.doOnmouseover = fEditorViewDoOnmouseover; // 处理鼠标经过事件
    this.doOnmouseout = fEditorViewDoOnmouseout; // 处理鼠标移出事件
    this.startHistoryTimer=fEditorViewStartHistoryTimer;//开始历史记录计时器
    this.stopHistoryTimer=fEditorViewStopHistoryTimer;//停止历史记录计时器
    this.addListener=fEditorViewAddListener;//添加监听器
    this.removeListener=fEditorViewRemoveListener;//移除监听器
    this.notifyListener=fEditorViewNotifyListener;//通知/启动监听器

    //另外提供给compose组件的接口
    this.get=fEditorViewGet;//获取对象，用于二次开发
    this.set=fEditorViewSet;//设置对象，用于二次开发
    this.isTextMode=fEditorViewIsTextMode;//是否是纯文本模式
    this.toogleToolbar=fEditorViewToogleToolbar;//隐藏/显示工具栏
    this.getInitHtml=fEditorViewGetInitHtml;//获取初始化编辑框的html字符串
    this.focus=fEditorViewFocus;//聚焦
    this.insert=fEditorViewInsert;//插入图片或者html
    this.del=fEditorViewDelete;//删除元素
    this.getSelectedText=fEditorViewGetSelectedText;//获取光标选中文本
    this.execFormat=fEditorViewExecFormat;//执行格式命令
    this.deleteLink=fEditorViewDeleteLink;//删除链接
    this.getContent=fEditorViewGetContent;//获取编辑器内容
    this.setDefStyle=fEditorViewSetDefStyle;//设置编辑器默认样式
    this.getFinalContent=fEditorViewGetFinalContent;//获取带有默认配置样式（行高、字号、字体颜色等）的内容

    try {
        this.init(oSettings); // 初始化编辑器视图
        this.initSuccess=true;
    } catch (e) {
        this.log(e);
        this.initSuccess=false;
    }
}
/**
 * 打印日志
 *
 * @method log
 * @param {string}sLog日志信息
 * @return {void}
 * @for EditorView
 */
function fEditorViewLog(sLog) {
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
 * 根据id获取元素
 *
 * @method getNode(sSelector[,oObject])
 * @param {string}sSelector 元素ID或者选择字符串,"#"开头表示id，“.”开头表示类名，空格表示祖先与后辈，
 *                如“div.className input”表示类名是className的div下的所有input元素
 * @param {object}oObject 文档对象或者dom元素(可选)
 * @return {object} 匹配元素
 * @for EditorView
 */
function fEditorViewGetNode(sSelector,oObject) {
    //内部函数，过滤器，返回符合条件的元素数组
    function _fFilter(aEls,sKey,sValue){
        var nLen=aEls.length;
        var aNodes=[];
        for(var i=0;i<nLen;i++){
            // 检查类名是否匹配
            if(sKey="class"){
                var sClass=aEls[i].className;
                if(new RegExp(sValue+"$").test(sClass)||new RegExp(sValue+" ").test(sClass)){
                    aNodes.push(aEls[i]);
                }
            }else{
                // 检查属性是否匹配
                if(aEls[i].getAttribute(sKey)==oFilter["value"]){
                    aNodes.push(aEls[i]);
                }
            }
        }
        return aNodes.length>0?aNodes:null;
    }
    // 如果第二个参数不是dom节点，则说明不是层级选择器，或者是层级选择器的第一层
    if(!oObject||oObject.nodeType==9){
        // 获取选择器文档对象
        var oDoc=oObject||document;
        // 如果第一个参数是字符串，则做进一步分析
        if(typeof sSelector == "string"){
            var nIndex;
            // 如果是层级选择
            if((nIndex=sSelector.indexOf(" "))>-1){
                //第一层选择
                var sSel1=sSelector.substring(0,nIndex);
                // 获取祖先节点
                var oAncestor=arguments.callee(sSel1,oDoc);
                if(oAncestor){
                    //如果祖先节点存在，则继续选择子孙节点
                    var sSel2=sSelector.substring(nIndex+1);
                    //如果oAncestor是数组，则进行遍历选择
                    if(oAncestor.length){
                        var nLen=oAncestor.length;
                        var aNodes=[];
                        for(var i=0;i<nLen;i++){
                            var aResults=arguments.callee(sSel2,oAncestor[i]);
                            if(aResults.length){
                                var nLength=aResults.length;
                                for(var j=0;j<nLength;j++){
                                    aNodes.push(aResults[j]);
                                }
                            }else if(aResults.nodeType){
                                aNodes.push(aResults);
                            }
                        }
                        return aNodes.length>0?aNodes:null;
                    }else{
                        return arguments.callee(sSel2,oAncestor);
                    }
                }else{
                    return null;
                }
            }else if(sSelector.charAt(0)=="#"){
                //根据元素id选择节点
                return oDoc.getElementById(sSelector.substring(1));
            }else if(sSelector.charAt(0)=="."){
                //根据类名选择节点
                var aChildren=oDoc.getElementsByTagName("*");
                return _fFilter(aChildren,"class",sSelector.substring(1));
            }else if(/^[a-z]+$/i.test(sSelector)){
                //根据标签名选择节点
                return oDoc.getElementsByTagName(sSelector);
            }
        }else if(sSelector.nodeType){
            // 如果第一个参数是节点则直接返回
            return sSelector;
        }
    }else{
        // 如果第二个参数是dom节点，说明是层级选择器,选择范围是参数节点的子孙节点
        var sTag;
        var sClass;
        var nIndex=sSelector.indexOf(".");
        // 如果选择参数是以字母开头
        if(/^[a-z]/i.test(sSelector)){
            //如果有类名
            if(nIndex>-1){
                sTag=sSelector.substring(0,nIndex);
                sClass=sSelector.substring(nIndex+1);
            }else{
                sTag=sSelector;
            }
        }else if(nIndex==0){
            sTag="*";
            sClass=sSelector.substring(1);
        }
        var aChildren=oObject.getElementsByTagName(sTag);
        // 如果类名为空，则直接返回
        if(!sClass){
            return aChildren;
        }
        // 返回匹配的元素数组，如果没有匹配的元素，则返回null
        return _fFilter(aChildren,"class",sClass);
    }
}
/**
 * 获取指定标签类型的孩子节点集
 *
 * @method getChildren
 * @param {object}oEl 参数节点
 * @param {string}sTag 参数标签名
 * @return {array} 匹配元素集，如果没有匹配的元素，则返回null
 * @for EditorView
 */
function fEditorViewGetChildren(oEl,sTag) {
    var aChildren=oEl.childNodes;
    if(aChildren&&aChildren.length>0){
        var aNodes=[];
        var nLen=aChildren.length;
        var oReg=new RegExp(sTag,"i");
        for(var i=0;i<nLen;i++){
            if(oReg.test(aChildren[i].nodeName)){
                aNodes.push(aChildren[i]);
            }
        }
        return aNodes.length>0?aNodes:null;
    }else{
        return null;
    }
}
/**
 * 扩展对象
 *
 * @method extend
 * @param {object}oTarget扩展对象
 * @param {object}oSource扩展源
 * @return {void}
 * @for Editorview
 */
function fEditorViewExtend(oTarget, oSource) {
    for (var property in oSource) {
        oTarget[property] = oSource[property];
    }
}
/**
 * 初始化html页面
 *
 * @method initHtml
 * @return {void}
 * @for Editorview
 */
function fEditorViewInitHtml() {
    var oSettings = this.settings;
    var sHtml;
    if (oSettings.toolbar != null) {
        sHtml = '\
			<div class="g-editor-toolbar">\
			</div>\
			<div class="g-editor-edtr" style="height:100%">\
				<iframe tabindex="'
            + oSettings.tabindex
            + '" name="editorIframe"  hideFocus="true" frameborder="0" src=""></iframe>\
				<textarea class="codeTextarea" tabindex="'
            + (oSettings.tabindex + 1)
            + '" hideFocus="true"></textarea>\
                <textarea class="textTextarea" tabindex="'
            + (oSettings.tabindex + 2)
            + '"  hideFocus="true"></textarea>\
			</div>\
        ';
    }else{
        sHtml = '\
			<div class="g-editor-toolbar">\
				<div class="g-editor-tbar-basic">\
					<div class="g-editor-btn " func="format" format="bold">\
						<span><a href="javascript:void(0)" class="g-editor-btninfo g-editor-btninfo-fwt" title="加粗">加粗</a> </span>\
					</div>\
					<div class="g-editor-btn" func="format" format="italic">\
						<span><a href="javascript:void(0)" class="g-editor-btninfo g-editor-btninfo-fst" title="斜体">斜体</a></span>\
					</div>\
					<div class="g-editor-btn" func="format" format="underline">\
						<span><a href="javascript:void(0)" class="g-editor-btninfo g-editor-btninfo-udl" title="下划线">下划线</a></span>\
					</div>\
					<div class="g-editor-btn" func="popup" popup="fontsize">\
						<span><a href="javascript:void(0)" class="g-editor-btninfo g-editor-btninfo-fsz" title="选择字体大小">选择字体大小</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="popup" popup="forecolor">\
						<span><a href="javascript:void(0)"\
							class="g-editor-btninfo g-editor-btninfo-fcl" title="选择字体颜色">选择字体颜色</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="popup" popup="backcolor">\
						<span><a href="javascript:void(0)"\
							class="g-editor-btninfo g-editor-btninfo-bgc" title="选择字体背景">选择字体背景</a>\
						</span>\
					</div>\
					<div class="g-editor-spln g-editor-spln-short"></div>\
					<div class="g-editor-btn" func="popup" popup="justify">\
						<span><a href="javascript:void(0)"\
							class="g-editor-btninfo g-editor-btninfo-align" title="选择对齐方式">选择对齐方式</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="popup" popup="list">\
						<span><a href="javascript:void(0)"\
							class="g-editor-btninfo g-editor-btninfo-lst" title="设置列表">设置列表</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="popup" popup="indent">\
						<span><a href="javascript:void(0)"\
							class="g-editor-btninfo g-editor-btninfo-tid" title="设置缩进">设置缩进</a>\
						</span>\
					</div>\
					<div class="g-editor-spln g-editor-spln-short"></div>\
					<div class="g-editor-btn" func="custom" custom="image">\
						<span><a href="javascript:fGoto()"\
							class="g-editor-btninfo g-editor-btninfo-ipc" title="添加图片">添加图片</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="custom" custom="capture">\
						<span><a href="javascript:fGoto()"\
							class="g-editor-btninfo g-editor-btninfo-scs" title="截图">截图</a> </span>\
					</div>\
					<div class="g-editor-btn" func="custom" custom="portrait">\
						<span><a href="javascript:fGoto()"\
							class="g-editor-btninfo g-editor-btninfo-face" title="添加表情">添加表情</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="custom" custom="letter">\
						<span><a href="javascript:fGoto()"\
							class="g-editor-btninfo g-editor-btninfo-paper" title="添加信纸">添加信纸</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="format" format="insertTime">\
						<span><a href="javascript:fGoto()"  \
							class="g-editor-btninfo g-editor-btninfo-date" title="添加日期">日期</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="custom" custom="sign">\
						<span><a href="javascript:fGoto()"\
							class="g-editor-btninfo g-editor-btninfo-sign" title="添加签名">签名</a>\
						</span>\
					</div>\
                    <div class="g-editor-toolgrp  g-editor-tgrp6">\
						<div class="g-editor-btn g-editor-btn-arrow " func="editMode" editMode="full">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-full" title="切换到全部功能">切换到全部功能</a>\
							</span>\
						</div>\
                    </div>\
				</div>\
				<div class="g-editor-tbar-full">\
					<div class="g-editor-toolgrp g-editor-tgrp1">\
						<div class="g-editor-btn " func="format" format="undo">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-redo" title="撤销">撤销</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format" format="redo">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-do" title="重做">重做</a> </span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp g-editor-tgrp2">\
						<div class="g-editor-btn" func="format" format="cut">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-cut" title="剪切">剪切</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format" format="copy">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-copy" title="复制">复制</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format" format="paste">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-paste" title="粘贴">粘贴</a>\
							</span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp  g-editor-tgrp3">\
						<div class="g-editor-btn-selectgrp">\
							<div class="g-editor-btn g-editor-btn-select" title="选择字体" func="popup" popup="fontname">\
								<span><b class="g-editor-btninfo g-editor-btninfo-ffm">字体</b>\
								</span>\
							</div>\
							<div class="g-editor-btn g-editor-btn-select" title="选择字体大小" func="popup" popup="fontsize">\
								<span><b href="javascript:void(0)"\
									class="g-editor-btninfo g-editor-btninfo-fsz2">字号</b></span>\
							</div>\
						</div>\
						<div class="g-editor-btn" func="popup" popup="justify">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-align" title="选择对齐方式">选择对齐方式</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="popup" popup="list">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-lst" title="设置列表">设置列表</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="popup" popup="indent">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-tid" title="设置缩进">设置缩进</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="popup" popup="lineheight">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-lht" title="设置行高">设置行高</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format" format="bold">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-fwt" title="加粗">加粗</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format" format="italic">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-fst" title="斜体">斜体</a>\
							</span>\
						</div>\
						<div class="g-editor-btn " func="format" format="underline">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-udl" title="下划线">下划线</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="popup" popup="forecolor">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-fcl" title="选择字体颜色">选择字体颜色</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="popup" popup="backcolor">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-bgc" title="选择字体背景">选择字体背景</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format"\
							format="insertHorizontalRule">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-line" title="插入横线">插入横线</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="custom" custom="insertTable">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-table" title="添加表格">添加表格</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format" format="removeFormat">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-clear" title="消除格式">消除格式</a>\
							</span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp  g-editor-tgrp4">\
						<div class="g-editor-btn" func="custom" custom="link">\
							<span><a href="javascript:fGoto()"\
								class="g-editor-btninfo g-editor-btninfo-uri" title="插入/删除链接">插入/删除链接</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="custom" custom="image">\
							<span><a href="javascript:fGoto()"\
								class="g-editor-btninfo g-editor-btninfo-ipc" title="添加图片">添加图片</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="custom" custom="capture">\
							<span><a href="javascript:fGoto()"\
								class="g-editor-btninfo g-editor-btninfo-scs" title="截图">截图</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="custom" custom="portrait">\
							<span><a href="javascript:fGoto()"\
								class="g-editor-btninfo g-editor-btninfo-face" title="添加表情">添加表情</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="custom" custom="letter">\
							<span><a href="javascript:fGoto()"\
								class="g-editor-btninfo g-editor-btninfo-paper" title="添加信纸">信纸</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format" format="insertTime">\
							<span><a href="javascript:fGoto()"\
								class="g-editor-btninfo g-editor-btninfo-date"\
								title="添加日期">日期</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="custom" custom="sign">\
							<span><a href="javascript:fGoto()"\
								class="g-editor-btninfo g-editor-btninfo-sign" title="添加签名">签名</a>\
							</span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp  g-editor-tgrp5">\
						<div class="g-editor-btn g-editor-btn-code" func="editMode" editMode="source">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-code" title="编辑HTML源码">编辑HTML源码</a>\
							</span>\
						</div>\
					</div>\
                    <div class="g-editor-toolgrp  g-editor-tgrp6">\
						<div class="g-editor-btn g-editor-btn-arrow" func="editMode" editMode="basic">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-basic" title="切换到简单功能">简单功能</a>\
							</span>\
						</div>\
                    </div>\
				</div>\
				<div class="g-editor-tbar-code">\
					<div class="g-editor-toolgrp g-editor-tgrp1">\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-redo"\
								title="源码模式下不能使用该功能">撤销</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-do"\
								title="源码模式下不能使用该功能">重做</a></span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp g-editor-tgrp2">\
						<div class="g-editor-btn" func="format" format="cut">\
							<span><a class="g-editor-btninfo g-editor-btninfo-cut"\
								title="源码模式下不能使用该功能">剪切</a> </span>\
						</div>\
						<div class="g-editor-btn" func="format" format="copy">\
							<span><a class="g-editor-btninfo g-editor-btninfo-copy"\
								title="源码模式下不能使用该功能">复制</a> </span>\
						</div>\
						<div class="g-editor-btn" func="format" format="paste">\
							<span><a class="g-editor-btninfo g-editor-btninfo-paste"\
								title="源码模式下不能使用该功能">粘贴</a> </span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp  g-editor-tgrp3">\
						<div class="g-editor-btn-selectgrp">\
							<div class="g-editor-btn g-editor-btn-select"\
								title="源码模式下不能使用该功能">\
								<span><b class="g-editor-btninfo g-editor-btninfo-ffm">字体</b>\
								</span>\
							</div>\
							<div class="g-editor-btn g-editor-btn-select"\
								title="源码模式下不能使用该功能">\
								<span><b href="javascript:void(0)"\
									class="g-editor-btninfo g-editor-btninfo-fsz2">字号</b></span>\
							</div>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-align"\
								title="源码模式下不能使用该功能">对齐方式</a></span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-lst"\
								title="源码模式下不能使用该功能">列表修饰</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-tid"\
								title="源码模式下不能使用该功能">缩进</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-lht"\
								title="源码模式下不能使用该功能">行高</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-fwt"\
								title="源码模式下不能使用该功能">加粗</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-fst"\
								title="源码模式下不能使用该功能">倾斜</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-udl"\
								title="源码模式下不能使用该功能">下划线</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-fcl"\
								title="源码模式下不能使用该功能">颜色</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-bgc"\
								title="源码模式下不能使用该功能">背景</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-line"\
								title="源码模式下不能使用该功能">插入横线</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-table"\
								title="源码模式下不能使用该功能">表格</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-clear"\
								title="源码模式下不能使用该功能">消除样式</a> </span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp  g-editor-tgrp4">\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-uri"\
								title="源码模式下不能使用该功能">插入/删除链接</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-ipc"\
								title="源码模式下不能使用该功能">插入图片</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-scs"\
								title="源码模式下不能使用该功能">截图</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-face"\
								title="源码模式下不能使用该功能">表情</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-paper"\
								title="源码模式下不能使用该功能">信纸</a> </span>\
						</div>\
                        <div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-date"\
							title="源码模式下不能使用该功能">日期</a>\
							</span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-sign"\
								title="源码模式下不能使用该功能">签名</a> </span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp  g-editor-tgrp5">\
						<div class="g-editor-btn g-editor-btn-code g-editor-btn-on" func="editMode" editMode="full">\
							<span><a href="javascript:void(0)" hideFocus="true"\
								class="g-editor-btninfo g-editor-btninfo-code" title="返回可视化编辑">返回可视化编辑</a>\
							</span>\
						</div>\
					</div>\
					<div class="g-editor-toolgrp  g-editor-tgrp6">\
						<div class="g-editor-btn g-editor-btn-arrow">\
							<span><a class="g-editor-btninfo g-editor-btninfo-basic"\
								title="源码模式下不能使用该功能">全部功能</a></span>\
						</div>\
					</div>\
				</div>\
			</div>\
			<div class="g-editor-edtr" style="height:100%">\
				<iframe tabindex="'
            + oSettings.tabindex
            + '" name="editorIframe"  hideFocus="true" frameborder="0" src=""></iframe>\
				<textarea class="codeTextarea" tabindex="'
            + (oSettings.tabindex + 1)
            + '" hideFocus="true"></textarea>\
                <textarea class="textTextarea" tabindex="'
            + (oSettings.tabindex + 2)
            + '"  hideFocus="true"></textarea>\
			</div>\
         ';
    }
    this.editorDiv.innerHTML = sHtml;
}
/**
 * 初始化工具栏
 *
 * @method initToolbar
 * @param void
 * @return {void}
 * @see #hide,#doclick,#doOnmouseover,#doOnmouseout ; Editor.Observer#add
 * @for Editorview
 */
function fEditorViewInitToolbar() {
    var that = this;
    if (!that.settings.openToolbar) {
        // 默认隐藏工具栏按钮
        that.editorDiv.className = "g-editor g-editor-hide";
        that.editMode = "hide";
    } else {
        // 默认显示简单工具栏按钮
        that.editorDiv.className = "g-editor g-editor-basic";
        that.editMode = "basic"
    }
    var oToolbarSettings = that.settings.toolbar;
    //如果有关于工具栏的设置，则按设置初始化工具栏
    if (oToolbarSettings) {
        var oToolbarItems = that.toolbarItems;
        var oDivTmp = document.createElement("div");
        var oSpanTmp = document.createElement("span");
        var oLinkTmp = document.createElement("a");
        function _createItem(sName, sMode) {
            var oItem;
            if ((sMode == "full"||sMode == "source") && oToolbarItems[sName + "Full"]) {
                oItem = oToolbarItems[sName + "Full"];
            } else if (oToolbarItems[sName]) {
                oItem = oToolbarItems[sName];
            }
            if (oItem) {
                var oItemDiv = oDivTmp.cloneNode(true);
                var oSpan=oSpanTmp.cloneNode(true);
                var oLink=oLinkTmp.cloneNode(true);
                oLink.className="g-editor-btninfo "+oItem["className"];
                if(sMode=="source"&&sName!="full"){
                    oLink.title="源码模式下不能使用该功能";
                }else{
                    oItemDiv.setAttribute("func", oItem["func"]);
                    oItemDiv.setAttribute(oItem["func"], sName);
                    oLink.title=oItem["title"];
                }
                if((sMode=="full"||sMode=="source")&&(sName=="fontsize"||sName=="fontname")){
                    oItemDiv.className ="g-editor-btn g-editor-btn-select";
                    oLink.innerHTML=sName=="fontname"?"字体":"字号";
                }else{
                    oItemDiv.className ="g-editor-btn";
                }
                oSpan.appendChild(oLink);
                oItemDiv.appendChild(oSpan);
                return oItemDiv;
            } else {
                return null;
            }
        }
        //简单功能模式工具栏
        if (oToolbarSettings["basic"]) {
            var oBasicTBDiv = that.basicToolbarDiv=oDivTmp.cloneNode(true);
            oBasicTBDiv.className = "g-editor-tbar-basic";
            var oBasicTB = oToolbarSettings["basic"];
            for (var i=0;i<oBasicTB.length;i++) {
                if (oBasicTB[i] != "full") {
                    var oItemDiv = _createItem(oBasicTB[i],"basic");
                    if(oItemDiv)oBasicTBDiv.appendChild(oItemDiv);
                }
            }
            if(oToolbarSettings["full"]){
                var oWrapDiv = oDivTmp.cloneNode(true);
                oWrapDiv.className="g-editor-toolgrp  g-editor-tgrp6";
                var oItemDiv = _createItem("full","basic");
                oWrapDiv.appendChild(oItemDiv);
                oBasicTBDiv.appendChild(oWrapDiv);
            }
            that.toolbarDiv.appendChild(oBasicTBDiv);
        }
        //全部功能模式工具栏
        if (oToolbarSettings["full"]) {
            var oFullTBDiv = that.fullToolbarDiv=oDivTmp.cloneNode(true);
            oFullTBDiv.className = "g-editor-tbar-full";
            var oFullTB = oToolbarSettings["full"];
            var oFullWrapDv=oDivTmp.cloneNode(true);
            var sWidth=(that.system.ie?oToolbarSettings.fullTBWidth.ie:oToolbarSettings.fullTBWidth.other||(oFullTB.length/2+1)*30)+"px";//最外层加上括号否则有时无px值，2010-11-26 gdw
            oFullWrapDv.style.width=sWidth;
            oFullWrapDv.style.cssFloat="left";//FF
            oFullWrapDv.style.styleFloat="left";
            oFullTBDiv.appendChild(oFullWrapDv);
            //标记是否有源码编辑模式
            var bHasSource;
            for (var i=0;i<oFullTB.length;i++) {
                var sName=oFullTB[i];
                if (sName != "basic") {
                    var oWrapDiv = oDivTmp.cloneNode(true);
                    if (sName == "fontsize" || sName == "fontname") {
                        oWrapDiv.className = "g-editor-btn-selectgrp";
                        var oItemDiv = _createItem(sName,"full");
                        if(oItemDiv)oWrapDiv.appendChild(oItemDiv);
                        oFullWrapDv.appendChild(oWrapDiv);
                    } else {
                        var oItemDiv = _createItem(sName,"full");
                        if(oItemDiv){
                            if(sName == "source"){
                                bHasSource=true;
                                oWrapDiv.className="g-editor-toolgrp  g-editor-tgrp5";
                                oItemDiv.className="g-editor-btn g-editor-btn-code";
                                oWrapDiv.appendChild(oItemDiv);
                                oFullTBDiv.appendChild(oWrapDiv);
                            }else {
                                if(sName == "paste")oItemDiv.getElementsByTagName("a")[0].innerHTML="粘贴";
                                oFullWrapDv.appendChild(oItemDiv);
                            }
                        }
                    }
                }
            }
            if(oToolbarSettings["basic"]){
                var oWrapDiv = oDivTmp.cloneNode(true);
                oWrapDiv.className="g-editor-toolgrp  g-editor-tgrp6";
                var oItemDiv = _createItem("basic","full");
                oWrapDiv.appendChild(oItemDiv);
                oFullTBDiv.appendChild(oWrapDiv);
            }
            that.toolbarDiv.appendChild(oFullTBDiv);
            //源码模式工具栏
            if (bHasSource) {
                var oSourceTBDiv = that.codeToolbarDiv = oDivTmp.cloneNode(true);
                oSourceTBDiv.className = "g-editor-tbar-code";
                //由于源码模式工具栏和全部功能模式工具栏结构一致，这里直接复制
                oSourceTBDiv.innerHTML=oFullTBDiv.innerHTML;
                //特殊处理
                var aDvs=oSourceTBDiv.getElementsByTagName("div");
                for(var i=0;i<aDvs.length;i++){
                    var sFunc=aDvs[i].getAttribute("func");
                    if(sFunc){
                        var sName=aDvs[i].getAttribute(sFunc);
                        if(sName=="source"){
                            if(sName=="source"){
                                aDvs[i].setAttribute("editMode","full");
                                aDvs[i].className="g-editor-btn g-editor-btn-code g-editor-btn-on";
                            }
                        }else if(!this.system.ie&&(sName=="copy"||sName=="cut"||sName=="paste")){
                            aDvs[i].parentNode.removeChild(aDvs[i]);
                        }else{
                            aDvs[i].removeAttribute("func");
                            aDvs[i].removeAttribute(sFunc);
                        }
                        aDvs[i].getElementsByTagName("a")[0].title="源码模式下不能使用该功能";
                    }
                }
                that.toolbarDiv.appendChild(oSourceTBDiv);
            }
        }
    } else {
        // 否则按照默认配置初始化工具栏
        var aEls = that.getChildren(that.toolbarDiv, "div");
        that.basicToolbarDiv = aEls[0];
        that.fullToolbarDiv = aEls[1];
        that.codeToolbarDiv = aEls[2];
    }
    //删除初始化数据
    delete that.toolbarItems;
    var oDivs = {};
    that.toolbar={};
    if(that.basicToolbarDiv){
        that.toolbar["basic"]={};
        oDivs["basic"]=that.basicToolbarDiv.getElementsByTagName("div");
    }
    if(that.fullToolbarDiv){
        that.toolbar["full"]={};
        oDivs["full"]=that.fullToolbarDiv.getElementsByTagName("div");
    }
    if(that.codeToolbarDiv){
        that.toolbar["source"]={};
        oDivs["source"]=that.codeToolbarDiv.getElementsByTagName("div");
    }
    // 按钮的功能类别名，如：format（格式化）、custom（自定义）等
    var sFunc = "";
    // 按钮的功能名，如，bold（加粗）
    var sName = ""
    var oDiv = "";
    var sToolbarName;
    // 为所有编辑器按钮添加事件处理
    for (var key in oDivs) {
        var length = oDivs[key].length;
        for (var j = 0; j < length; j++) {
            oDiv = oDivs[key][j];
            // 为“简单功能”和“全部功能”工具栏按钮添加鼠标经过样式
            if (oDiv.className.indexOf("g-editor-btn") > -1 && key != "source") {
                (function(oDiv) {
                    // 添加onmouseover处理事件
                    that.observer.add({
                        "el" : oDiv,
                        "eventType" : "mouseover",
                        "fn" : that.doOnmouseover,
                        "object" : that,
                        "params" : [oDiv]
                    });
                    // 添加onmouseout处理事件
                    that.observer.add({
                        "el" : oDiv,
                        "eventType" : "mouseout",
                        "fn" : that.doOnmouseout,
                        "object" : that,
                        "params" : [oDiv]
                    });
                })(oDiv)
            }
            // 为工具栏按钮添加点击事件
            sFunc = oDiv.getAttribute("func");
            sName = oDiv.getAttribute(sFunc);
            if (sFunc) {
                // 如果是非IE浏览器，则隐藏剪切板操作按钮
                if ((sName == "cut" || sName == "copy" || sName == "paste") && !that.system.ie) {
                    var oParent = oDiv.parentNode;
                    if (oParent.className.indexOf("g-editor-toolgrp g-editor-tgrp2") > -1) {
                        //如果工具栏组没有隐藏，则隐藏
                        if (oParent.style.display != "none") {
                            that.hide(oDiv.parentNode);
                            // 寻找相邻的分割线div
                            var oNode = oDiv.parentNode.nextSibling;
                            while (!/div/i.test(oNode.nodeName)) {
                                oNode = oNode.nextSibling;
                            }
                            // 隐藏分割线
                            that.hide(oNode);
                        }
                    } else {
                        that.hide(oDiv);
                    }
                }
                // zyh设置撤销重做按钮样式
                if (sName == "undo") {
                    oDiv.getElementsByTagName("a")[0].className = "g-editor-btninfo g-editor-btninfo-redo";
                } else if (sName == "redo") {
                    oDiv.getElementsByTagName("a")[0].className = "g-editor-btninfo g-editor-btninfo-do";
                }
                // 缓存工具栏数据
                (function(oDiv) {
                    var oItem = that.toolbar[key][sName]={};
                    oItem.el = oDiv;
                    oItem.isActive = false;
                })(oDiv)
                var oParams = {
                    "command" : sFunc,
                    "name" : sName,
                    "dom" : oDiv
                };
                // 为编辑器按钮添加onclick事件处理
                (function(oDiv) {
                    that.observer.add({
                        "el" : oDiv,
                        "eventType" : "click",
                        "fn" : that.doClick,
                        "object" : that,
                        "params" : [oParams]
                    });
                })(oDiv)
            }
            // 设置标签a的hidefocus="true"，避免鼠标在其上拖拽或点击时出现一个虚线框
            var oLink = oDiv.getElementsByTagName("a");
            if (oLink && oLink[0]) {
                oLink[0].hideFocus = true;
            }
        }
    }

    // 添加监听器
    var oObserver=that.observer;
    // 当用户点击编辑框时，根据光标位置文字的状态更改工具栏
    oObserver.add({
        "el" : that.editor.doc,
        "eventType" : "click",
        "fn" : that.changeToolbar,
        "object":that
    });
    //当用户点击键盘时，根据光标位置文字的状态更改工具栏
    oObserver.add({
        "el" : that.editor.doc,
        "eventType" : "keyup",
        "fn" : that.changeToolbar,
        "object":that
    });
    // 当用户点击编辑框内的图片时，弹出图片编辑工具栏
    oObserver.add({
        "el" : that.editor.doc,
        "eventType" : "mouseup",
        "fn" : that.popupImgToolbar,
        "object":that
    });
}
/**
 * 初始化编辑器视图
 *
 * @method init
 * @param {object}oSettings
 * @return {void}
 * @see #hide,#doclick,#doOnmouseover,#doOnmouseout ; Editor.Observer#add
 * @for Editorview
 */
function fEditorViewInit(oSettings) {
    var that=this;
    if (typeof oSettings == "string") {
        // 使用默认设置初始化编辑器视图，只需传入编辑器容器元素或它的id，这里是传入id
        that.editorDiv = that.getNode(oSettings);
    } else if (typeof oSettings == "object") {
        // 使用默认设置初始化编辑器视图，只需传入编辑器容器元素或它的id，这里是传入元素
        if (oSettings.nodeName) {
            that.editorDiv = oSettings;
        } else {
            // 使用自定义配置初始化编辑器视图
            that.extend(that.settings, oSettings);
            that.editorDiv=that.getNode(oSettings.editorDiv);
            that.html=oSettings.html;
        }
    }
    that.menuContainer=oSettings.menuContainer||document.body;
    // 初始化基本框架
    that.initHtml();
    var aEls=that.getChildren(that.editorDiv,"div");
    that.toolbarDiv =aEls[0];
    that.editorAreaDiv = aEls[1];
    that.editorIframe = that.editorAreaDiv.getElementsByTagName("iframe")[0];
    aEls=that.editorAreaDiv.getElementsByTagName("textarea");
    that.editorSourceTextarea = aEls[0];
    that.editorTextTextarea = aEls[1];
    var oOwnSettings=that.settings;
    // 初始化编辑器
    var oEditor=that.editor = new Editor({
        editorIframe : that.editorIframe,
        editorSourceTextArea : that.editorSourceTextarea,
        editorTextTextArea : that.editorTextTextarea,
        html:oOwnSettings.html,
        fontsize:oOwnSettings.fontsize,
        forecolor:oOwnSettings.forecolor
    });
    that.system=oEditor.system;
    // 初始化格式处理器
    that.format = oEditor.format;
    // 初始化查询器
    that.query = oEditor.query;
    // 初始化监视器
    var oObserver=that.observer =oEditor.observer;
    //初始化记录器
    that.history = oEditor.history;
    //开始历史记录计时器
    that.startHistoryTimer();
    // 初始化工具栏
    that.initToolbar();
    // 处理IE失去焦点问题
    if (that.system.ie) {
        // 在 activeElement 从that.editorIframe变为父文档其它对象之前立即触发
        oObserver.add({
            "el" : that.editorIframe,
            "eventType" : "beforedeactivate",
            "fn" : function() {
                // 缓存当前选区
                this.range = this.editor.getRange();
            },
            "object":that
        });
        // 当that.editorIframe成为活动窗口时触发
        oObserver.add({
            "el" : that.editorIframe,
            "eventType" : "activate",
            "fn" : function() {
                if (this.range) {
                    // 恢复选区
                    try {
                        this.range.select();
                        this.range = null;
                    } catch (e) {}
                }
            },
            "object":that
        });
    }

    //当用户点击网页时，隐藏弹出层
    oObserver.add({
        "el" : document,
        "eventType" : "click",
        "fn" : that.hidePopup,
        "object" : that
    });
    //当用户点击编辑区域时，隐藏弹出层
    oObserver.add({
        "el" : oEditor.doc,
        "eventType" : "click",
        "fn" : that.hidePopup,
        "object" : that
    });
    // 当用户滚动编辑框时，隐藏弹出层
    oObserver.add({
        "el" : oEditor.win,
        "eventType" : "scroll",
        "fn" : function() {
            if (this.popupDiv) {
                this.hide(this.popupDiv);
            }
        },
        "object" : that
    });
    // 当that.editorIframe成为活动窗口时开启历史记录计时器
    oObserver.add({
        "el" : that.editorIframe,
        "eventType" : "activate",
        "fn" : that.startHistoryTimer,
        "object" : that
    });
    // 当用户第一次点击键盘时，记录历史
    var sId = oObserver.add({
        "el" : oEditor.doc,
        "eventType" : "keyup",
        "fn" : function() {
            this.history.save();
            // 移除监听器
            this.observer.remove({
                "el" : this.editor.doc,
                "eventType" : "keyup",
                "id" : sId
            });
        },
        "object" : that
    });
    //把自身传递到Editor实例中
    oEditor.setEditorView(that);
}
/**
 * 改变工具栏状态，用于更新光标所在区域的状态，并据此改变工具栏状态
 *
 * @method changeToolbar
 * @param {array}aCommands 要更新的工具栏命令名
 * @return {void}
 * @see #addClass #removeClass Editor.Query#queryAll
 * @for Editorview
 */
function fEditorViewChangeToolbar(aCommands) {
    // 获取编辑器视图对象
    aCommands=aCommands||["undo","redo","bold","italic","underline"];
    var that = this;
    var sEditMode=that.editMode;
    //如果html编辑区不可见，或者当前编辑模式不是基本/全部功能模式，或者当前是简单编辑模式，而且要更新的只有撤销重做按钮，则不需要更新工具栏
    if(that.editorIframe.style.display=="none"||(sEditMode!="basic"&&sEditMode!="full")
        ||(sEditMode=="basic"&&aCommands.length==2)){
        return;
    }
    // 查询光标处的文字状态
    var oJson = that.query.query(aCommands);
    var oCurToolbar=that.toolbar[sEditMode];
    // 遍历状态集
    for (var key in oJson) {
        var oItem=oCurToolbar[key];
        if (oJson[key] == false) {
            // 如果该状态不是激活的
            if (oItem&& oItem.el) {
                // 更改工具栏按钮的状态
                if(key=="redo"){
                    var oEl=oItem.el.getElementsByTagName("a")[0];
                    that.removeClass(oEl,"g-editor-btninfo-do");
                    that.addClass(oEl,"g-editor-btninfo-do-dis");
                }else if(key=="undo"){
                    var oEl=oItem.el.getElementsByTagName("a")[0];
                    that.removeClass(oEl,"g-editor-btninfo-redo");
                    that.addClass(oEl,"g-editor-btninfo-redo-dis");
                }
                that.removeClass(oItem.el,
                    "g-editor-btn-on");
                // 更新工具栏缓存中相应元素的状态
                oItem.isActive = false;

            }
        } else {
            if (oItem&& oItem.el) {
                // 更改工具栏按钮的状态
                if (key == "redo") {
                    var oEl = oItem.el.getElementsByTagName("a")[0];
                    that.removeClass(oEl, "g-editor-btninfo-do-dis");
                    that.addClass(oEl, "g-editor-btninfo-do");
                } else if (key == "undo") {
                    var oEl = oItem.el.getElementsByTagName("a")[0];
                    that.removeClass(oEl, "g-editor-btninfo-redo-dis");
                    that.addClass(oEl, "g-editor-btninfo-redo");
                } else {
                    that.addClass(oItem.el, "g-editor-btn-on");
                    // 更新工具栏缓存中相应元素的状态
                    oItem.isActive = true;
                }

            }
        }
    }
}
/**
 * 获取事件
 *
 * @method getEvent([oWindow])
 * @param {object}oWindow（可选），想要获取event对象对应的window对象
 * @return {object}event
 * @for Editorview
 */
function fEditorViewGetEvent(oWindow) {
    // IE\Chrome\Opera\Safari，支持window.event方法获得event对象
    /*todo fEditorViewGetEvent event detect*/
    var oEvent;
    oEvent=oWindow?oWindow.event:window.event;
    if(!oEvent&&this.system.firefox) {
        // Firefox\Chrome\Safari，支持arguments[0]方式获取event，这里只有Firefox执行
        //获取函数本身
        var func = arguments.callee;
        while (func != null) {
            // 获取函数的第一个参数
            var arg0 = func.arguments[0];
            // 如果该参数是事件类型的，则返回
            if (arg0&& (arg0.constructor.toString() == "[object MouseEvent]" || arg0.constructor.toString() == "[object Event]"||arg0.constructor.toString() == "[object KeyboardEvent]" )) {
               console.info("return arg");
                return arg0;
            }
            // 获取函数堆栈中的上层函数，即当前函数func的调用者
            func = func.caller;
        }
    }
    return oEvent;
}
/**
 * 显示元素
 *
 * @method show
 * @param {object}oEl
 * @return {void}
 * @for Editorview
 */
function fEditorViewShow(oEl) {
    if (oEl.style.display != "block") {
        oEl.style.display = "block";
    }
}
/**
 * 隐藏元素
 *
 * @method hide
 * @param {object}oEl
 * @return {void}
 * @for Editorview
 */
function fEditorViewHide(oEl) {
    if (oEl.style.display != "none") {
        oEl.style.display = "none";
    }
}
/**
 * 显示/隐藏元素
 *
 * @method toggle
 * @param {object}oEl
 * @for Editorview
 */
function fEditorViewToggle(oEl) {
    if (oEl.style.display == "none") {
        oEl.style.display = "block";
    } else {
        oEl.style.display = "none";
    }
}
/**
 * 为元素添加class
 *
 * @method addClass
 * @param {object}oEl 参数节点
 * @param {string}sClass 要添加的类名
 * @return {boolean} true表示成功添加
 * @for Editorview
 */
function fEditorViewAddClass(oEl, sClass) {
    if (oEl.className) {
        // 如果元素没有相应的类名，添加指定类名，否则返回false表示添加失败
        var aClass = oEl.className.split(" ");
        var bIsContained = false;
        if (aClass.length > 0) {
            for (var i = 0; i < aClass.length; i++) {
                if (aClass[i] == sClass) {
                    bIsContained = true;
                }
            }
        }
        if (!bIsContained) {
            oEl.className = oEl.className + " " + sClass;
        }
        return !bIsContained;
    }
}
/**
 * 删除给定的类
 *
 * @method removeClass
 * @param {object}oEl
 * @param {string}sClass
 * @return {boolean} true表示成功删除
 * @for Editorview
 */
function fEditorViewRemoveClass(oEl, sClass) {
    if (oEl.className) {
        // 如果元素有相应的类名，删除指定类名，否则返回false表示删除失败
        var aClass = oEl.className.split(" ");
        var bIsContained = false;
        if (aClass.length > 0) {
            for (var i = 0; i < aClass.length; i++) {
                if (aClass[i] == sClass) {
                    aClass[i] = "";
                    bIsContained = true;
                }
            }
        }
        if (bIsContained) {
            oEl.className = aClass.join(" ");
        }
        return bIsContained;
    }
}
/**
 * 获取元素当前的样式
 *
 * @method getStyle
 * @param {object}oEl
 * @param {string}sAttr(可选)指定样式名
 * @return {object}获取元素当前的样式
 * @for Editorview
 */
function fEditorViewGetStyle(oEl,sAttr){
    return sAttr?oEl.currentStyle?oEl.currentStyle[sAttr]:
        document.defaultView.getComputedStyle(oEl,false)[sAttr]:
        oEl.currentStyle?oEl.currentStyle:document.defaultView.getComputedStyle(oEl,false);
}
/**
 * 获取元素和编辑器左边框的距离
 *
 * @method getElementLeft
 * @param {object}oEl
 * @return {number}nLeft
 * @for Editorview
 */
function fEditorViewGetElementLeft(oEl) {
    //判断第一个参数节点是否包含第二个参数节点
    function _fContains(oAnces,oChild){
        while(oChild){
            if(oAnces==oChild)return true;
            oChild=oChild.parentNode;
        }
        return false;
    }
    var nLeft = oEl.offsetLeft;
    var oCurrentNode = oEl.offsetParent;
    var oMenuContainer=this.menuContainer;
    // 循环加上父节点的左边距
    while (oCurrentNode != null&&_fContains(oMenuContainer,oCurrentNode)) {
        if(oCurrentNode.className!="container"){
            nLeft += oCurrentNode.offsetLeft;
        }
        oCurrentNode = oCurrentNode.offsetParent;
    }
    return nLeft;
}
/**
 * 获取元素和编辑器上边框的距离
 *
 * @method getElementTop
 * @param {object}oEl
 * @return {number}nTop
 * @for Editorview
 */
function fEditorViewGetElementTop(oEl) {
    var nTop = oEl.offsetTop;
    var oCurrentNode = oEl.offsetParent;
    var oMenuContainer=this.menuContainer;
    // 循环加上父节点的顶端距离
    while (oCurrentNode != null) {
        nTop += oCurrentNode.offsetTop ;
        oCurrentNode = oCurrentNode.offsetParent;
    }
    return nTop;
}
/**
 * 停止事件
 *
 * @method stopEvent
 * @param {object}oEvent
 * @return {void}
 * @for Editorview
 */
function fEditorViewStopEvent(oEvent) {
    if(!oEvent){
        return;
    }
    if (oEvent.stopPropagation) {
        // 非ie下停止事件冒泡
        oEvent.stopPropagation();
    } else {
        // ie下停止事件冒泡
        oEvent.cancelBubble = true;
    }
}
/**
 * 使对象可以拖动
 * @method setDragable
 * @param {object}oClickedObj 触发拖动事件的对象,即鼠标按下的对象
 * @param {object}oMoveObj 被拖动的对象
 * @return {void}
 * @see  Editor.observer#add,remove
 * @for Editorview
 */
function fEditorViewSetDragable(oMousedownedObj, oMovedObj) {
    // 如果oMovedObj为空，则表示第一个参数就是被拖动的对象
    oMovedObj = oMovedObj || oMousedownedObj;
    var oDoc = top.document;
    // 内部函数，获取事件坐标
    function _getEvPosition(oEvent) {
        return {
            x : oEvent.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft,
            y : oEvent.clientY + document.body.scrollTop
                + document.documentElement.scrollTop
        };
    }
    // 返回false，使页面不允许选择
    var fSelectEvent = function() {
        return false
    };
    // 鼠标移动函数
    var fObjMoving = function(oEv) {
        // 获取event对象
        var oEvent = oEv || top.event;
        // 如果用户点击的不是鼠标左键，则不开始拖动
        if (oDoc.all && oEvent.button != 1) {
            oMousedownedObj.onmouseup();
            return;
        }
        // 获取鼠标坐标
        var oPos = _getEvPosition(oEvent);
        // 获取被拖动对象与鼠标的相对距离
        var x1 = oPos.x - oMovedObj.getAttribute("dragX");
        var y1 = oPos.y - oMovedObj.getAttribute("dragY");
        // 设置被拖动对象的位置
        oMovedObj.style.left = parseInt(oMovedObj.style.left, 10) + x1 + "px";
        oMovedObj.style.top = parseInt(oMovedObj.style.top, 10) + y1 + "px";
        // 更新被拖动对象的位置信息
        oMovedObj.setAttribute("dragX", oPos.x);
        oMovedObj.setAttribute("dragY", oPos.y);
    };
    var oObserver = this.observer;
    oMousedownedObj.onmousedown = function(oEv) {
        // 获取event对象
        var oEvent = oEv || top.event;
        // 获取鼠标坐标
        var oPos = _getEvPosition(oEvent);
        // 设置被拖动对象的位置信息
        oMovedObj.setAttribute("dragX", oPos.x);
        oMovedObj.setAttribute("dragY", oPos.y);
        // 添加oDoc onmousemove事件
        oObserver.add({
            "el" : oDoc,
            "eventType" : "mousemove",
            "fn" : fObjMoving
        });
        // 添加oDoc selectstart事件
        oObserver.add({
            "el" : oDoc,
            "eventType" : "selectstart",
            "fn" : fSelectEvent
        });
    };
    oMousedownedObj.onmouseup = function() {
        // 移除事件监听
        oObserver.remove({
            "el" : oDoc,
            "eventType" : "mousemove",
            "fn" : fObjMoving
        });
        oObserver.remove({
            "el" : oDoc,
            "eventType" : "selectstart",
            "fn" : fSelectEvent
        });
    };
}
/**
 * 系统弹窗
 * @method  msgBox
 * @param {object}oParam
 *                .title 弹窗标题
 *                .noIcon
 *                .content html内容
 *                .pos 弹窗位置(如：{x:5,y:5})
 *                .call 确定按钮回调函数,返回值中:.stopClose==true表示阻止窗口关闭，.errMsg表示要显示的错误信息
 *                .cancel 取消按钮回调函数
 * @param {object}返回button对象
 * @for EditorView
 */
function fEditorViewMsgBox(oParams){
    var that=this;
    var oMsgBoxDiv=that.getNode("#editorMsgBoxDv");
    if(oMsgBoxDiv){
        // 删除已有的提示框
        oMsgBoxDiv.parentNode.removeChild(oMsgBoxDiv);
    }
    var oTopDoc=top.document;
    //网页正文高度
    var nPageHeight=oTopDoc.body.scrollHeight;
    oMsgBoxDiv=document.createElement("div");
    oMsgBoxDiv.className="gSys-msg";
    oMsgBoxDiv.id="editorMsgBoxDv";
    var sHtml = '<div id="editorMsgBoxWinDv" class="gSys-msg-win">\
					<div id="editorMsgBoxWinHdDv" class="fn-bgx bg-main-2 hd">\
						<span class="fn-bg rc-l"></span>\
						<h4>'+(oParams.title||"系统提示")+'</h4>\
						<span class="fn-bg rc-r"></span>\
						<a id="editorMsgCloseLink" href="javascript:void(0)" class="fn-bg Aclose" hidefocus="true" title="关闭">关闭</a>\
					</div>\
					<div class="cont bdr-c-dark">\
						<div class="gSys-inner-comm gSys-inner-input">'
        +(oParams.noIcon?"":"<b class='ico ico-info'></b>")+oParams.content+
        '</div>\
                      </div>\
                      <div class="ft bdr-c-dark bg-cont">\
                          <div id="editorMsgBoxMsgDv" class="sup txt-err"></div>\
                          <div class="opt">\
                              <div id="editorMsgBoxOkDv" class="btn btn-dft" \
                                  onmouseover="javascript:this.className=\'btn btn-dft btn-dft-impt\'"\
                                  onmouseout="javascript:this.className=\'btn btn-dft\'">\
                                  <span>确 定</span>\
                              </div>' +(oParams.hasCancel?
        '<div id="editorMsgBoxCancelDv" class="btn btn-dft" \
                                  onmouseover="javascript:this.className=\'btn btn-dft btn-dft-impt\'"\
                                  onmouseout="javascript:this.className=\'btn btn-dft\'">\
                                  <span>取 消</span>\
                              </div>':"")+
        '</div>\
                      </div>\
                  </div>\
                  <div class="mask" style="height:'+nPageHeight+'px"></div>';
    oMsgBoxDiv.innerHTML=sHtml;
    document.body.appendChild(oMsgBoxDiv);
    that.show(oMsgBoxDiv);
    var oWin=that.getNode("#editorMsgBoxWinDv");
    // 根据参数设置位置
    if(oParams.pos){
        oWin.style.left = oParams.pos.x + "px";
        oWin.style.top = oParams.pos.y + "px";
    }else{
        // 设置居中定位坐标
        var nHeight = oWin.offsetHeight;
        var nWidth = oWin.offsetWidth;
        var nScrollTop;
        if (window.pageYOffset) {
            nScrollTop = window.pageYOffset;
        } else if (document.documentElement
            && document.documentElement.scrollTop) {
            nScrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
            nScrollTop = document.body.scrollTop;
        }
        //计算窗口居中显示的坐标
        var nLeft = ((oTopDoc.documentElement.offsetWidth || oTopDoc.body.offsetWidth) - nWidth)/2;
        var nTop = ((oTopDoc.documentElement.clientHeight || oTopDoc.body.clientHeight) - nHeight)/2 + nScrollTop;
        //纵坐标不小于10
        nTop = nTop < 10 ? 10 : nTop;
        oWin.style.left = nLeft + "px";
        oWin.style.top = nTop + "px";
    }
    var oWinHead=that.getNode("#editorMsgBoxWinHdDv")
    that.setDragable(oWinHead,oWin);
    var oOkDv=that.getNode("#editorMsgBoxOkDv");
    var oCancelDv=that.getNode("#editorMsgBoxCancelDv");
    var oCloseLnk=that.getNode("#editorMsgCloseLink");
    var oObserver=that.observer;
    //关闭按钮事件
    oCloseLnk.onclick=function(){
        oMsgBoxDiv.parentNode.removeChild(oMsgBoxDiv);
    }
    oOkDv.onclick=function(){
        var oResult;
        if(oParams.call)oResult=oParams.call();
        //显示错误信息
        if(oResult&&oResult.errMsg){
            document.getElementById("editorMsgBoxMsgDv").innserHTML=oResult.errMsg;
        }
        //不关闭弹窗
        if(!oResult||!oResult.stopClose){
            oCloseLnk.onclick();
        }
    }
    oCancelDv.onclick=function(){
        if(oParams.cancel)oParams.cancel();
        oCloseLnk.onclick();
    }
    return {
        ok : oOkDv,
        cancel : oCancelDv,
        close : oCloseLnk
    };
}
/**
 * 为下拉菜单选中光标所在文本的样式
 *
 * @method selectMenu
 * @param {object}oMenuDiv下拉菜单div
 * @param {string}sCommand当前命令
 * @return {void}
 * @for Editorview
 */
function fEditorViewSelectMenu(oMenuDiv, sCommand) {
    // 在光标所在文本的样式前加标记
    if ( sCommand == "fontname"
        || sCommand == "forecolor" || sCommand == "backcolor") {
        this.editor.focus();
        // 查询当前命令状态
        var sValue = this.query[sCommand]();
        //this.log(sValue);
        // 标记是否要添加图标
        var bAddIco = false;
        //下拉菜单需要添加的类名
        var sClass=sCommand == "forecolor" || sCommand == "backcolor"?"g-menu-hasicos":"g-menu-hasico";
        // 获取下拉菜单下所有的a标签
        var aChildren = oMenuDiv.getElementsByTagName("a");
        for (var i = 0; i < aChildren.length; i++) {
            if (aChildren[i].getAttribute("val") == sValue) {
                this.addClass(oMenuDiv, sClass);
                bAddIco = true;
                // 如果当前没有添加图标，则添加
                if (!/<b[^\/]+radio[^\/]+\/b>/i.test(aChildren[i].innerHTML)) {
                    aChildren[i].innerHTML = "<b class='ico ico-flag ico-slct ico-slct-radio'></b>"
                        + aChildren[i].innerHTML;
                }
            } else {
                // 如果其它不匹配的标签有图标，则要删除
                if (/<b[^\/]+radio[^\/]+\/b>/i.test(aChildren[i].innerHTML)) {
                    aChildren[i].innerHTML = aChildren[i].innerHTML.replace(
                        /<b[^\/]+radio[^\/]+\/b>/i, "");
                }
            }
        }
        // 如果没有匹配的菜单项，尝试移除"g-menu-hasico"
        if (!bAddIco) {
            this.removeClass(oMenuDiv, sClass);
        }
    }
}
/**
 * 延时弹出
 *
 * @method delayPopup(oEl[,nMilliSecond])
 * @param {object}oEl 要延时显示的元素
 * @param {number}nMilliSecond 延时的毫秒数，可选，默认为0
 * @return {void}
 * @for Editorview
 */
function fEditorViewDelayPopup(oEl,nMilliSecond){
    var nTime=nMilliSecond||0;
    var that=this;
    setTimeout(function(){
        that.show(oEl);
        that.popupDiv = oEl;
    },nTime);
}
/**
 * 弹出层
 *
 * @method popup(oTarget, sCommand, sInnerHTML[,sWidth])
 * @param {object}oTarget被点击的工具栏按钮
 * @param {object}oEvent 事件对象
 * @param {string}sCommand 弹出命令
 * @param {string}sInnerHTML 弹出层内容,
 * @param {string}sWidth 弹出层宽度(可选，默认是100px)
 * @return {object}oMenuDiv 返回弹出层
 * @see #clickList #selectMenu Editor.Observer#add
 * @for Editorview
 */
function fEditorViewPopup(oTarget, sCommand, sInnerHTML, sWidth) {
    var that=this;
    // 弹出层
    var oMenuDiv;
    if (sInnerHTML != "") {
        // 页面不存在改弹出层，需要新建
        oMenuDiv = document.createElement("div");
        oMenuDiv.id = sCommand + "MenuDiv";
        oMenuDiv.className = "g-menu";
        // 如果有指定宽度，设置弹出层的宽度为指定宽度，否则设置为默认宽度“100px”
        oMenuDiv.style.width = sWidth ? sWidth : "100px";
        oMenuDiv.style.display="none";
        // 为弹出层绑定鼠标单击事件
        that.observer.add({
            "el" : oMenuDiv,
            "eventType" : "click",
            "fn" : that.clickList,
            "object" : that,
            "params" : [oMenuDiv, sCommand]
        });
        // 设置弹出层内容为指定内容
        oMenuDiv.innerHTML = sInnerHTML;
        // 把弹出层插入到页面中
        that.menuContainer.appendChild(oMenuDiv);
        // 缓存弹出层
        that.popupMenus[sCommand] = oMenuDiv;
    } else {
        // 如果缓存中有指定的弹出层，则直接获取
        oMenuDiv = that.popupMenus[sCommand];
    }
    // 为下拉菜单选中光标所在文本的样式
    that.selectMenu(oMenuDiv, sCommand);
    //设置菜单位置
    oMenuDiv.style.left = that.getLeft(oTarget)+1+ "px";
    oMenuDiv.style.top = that.getTop(oTarget)+ 20+ "px";
    // 显示弹出层，避免被外层调用hidePopup隐藏掉
    that.delayPopup(oMenuDiv);
    // 恢复选区
    if (that.range && that.system.ie) {
        // this.range.collapse(false);
        that.editor.selectRange(that.range);
    }
    return oMenuDiv;
}
/**
 * 隐藏弹出层
 *
 * @method hidePopup
 * @param void
 * @return {void}
 * @for Editorview
 */
function fEditorViewHidePopup() {
    var that=this;
    var oPopupDiv = that.popupDiv;
    // 如果编辑器有弹出层，则隐藏掉
    if (oPopupDiv) {
        oPopupDiv.style.display = "none";
    }
}
/**
 * 弹出对齐方式下拉框
 *
 * @method popupJustifyMenu
 * @param {object}oTarget被点击的按钮（工具栏对齐方式按钮）
 * @return {object} 返回弹出层
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupJustifyMenu(oTarget) {
    var sInnerHTML = ""
    // 如果缓存里没有相应的弹出层，则获取该弹出层的html内容，用于新建
    if (!this.popupMenus["justify"]) {
        sInnerHTML = '\
			<div class="g-menu-inner g-menu-hasico">\
				<ul>\
					<li>\
						<a href="javascript:void(0);"><b\
							class="ico ico-editor ico-editor-alef"></b>左对齐</a>\
					</li>\
					<li>\
						<a href="javascript:void(0);"><b\
							class="ico ico-editor ico-editor-acen"></b>居中对齐</a>\
					</li>\
					<li>\
						<a href="javascript:void(0);"><b\
							class="ico ico-editor ico-editor-arit"></b>右对齐</a>\
					</li>\
				</ul>\
			</div>\
				';
    }
    // 弹出层
    return this.popup(oTarget, "justify", sInnerHTML);
}
/**
 * 弹出列表方式下拉框
 *
 * @method popupListMenu
 * @param {object}oTarget被点击的按钮（工具栏列表方式按钮）
 * @return {object} 返回弹出层
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupListMenu(oTarget) {
    var sInnerHTML = "";
    // 如果缓存里没有相应的弹出层，则获取该弹出层的html内容，用于新建
    if (!this.popupMenus["list"]) {
        sInnerHTML = '\
			<div class="g-menu-inner g-menu-hasico">\
				<ul>\
					<li>\
						<a href="javascript:void(0);"><b\
							class="ico ico-editor ico-editor-clist"></b>符号列表</a>\
					</li>\
					<li>\
						<a href="javascript:void(0);"><b\
							class="ico ico-editor ico-editor-nlist"></b>数字列表</a>\
					</li>\
				</ul>\
			</div>\
				';
    }
    // 弹出层
    return this.popup(oTarget, "list", sInnerHTML);
}
/**
 * 弹出缩进/突出下拉框
 *
 * @method popupIndentMenu
 * @param {object}oTarget被点击的按钮（工具栏缩进/突出按钮）
 * @return {object} 返回弹出层
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupIndentMenu(oTarget) {
    var sInnerHTML = "";
    // 如果缓存里没有相应的弹出层，则获取该弹出层的html内容，用于新建
    if (!this.popupMenus["indent"]) {
        sInnerHTML = '\
			<div class="g-menu-inner g-menu-hasico">\
				<ul>\
                    <li>\
						<a href="javascript:void(0);"><b\
							class="ico ico-editor ico-editor-addi"></b>增加缩进</a>\
					</li>\
					<li>\
						<a href="javascript:void(0);"><b\
							class="ico ico-editor ico-editor-cuti"></b>减少缩进</a>\
					</li>\
				</ul>\
			</div>\
				';
    }
    // 弹出层
    return this.popup(oTarget, "indent", sInnerHTML);
}
/**
 * 弹出字号下拉框
 *
 * @method popupFontsizeMenu
 * @param {object}oTarget被点击的按钮（工具栏字号按钮）
 * @return {object} 返回弹出层
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupFontsizeMenu(oTarget) {
    var sInnerHTML = "";
    // 如果缓存里没有相应的弹出层，则获取该弹出层的html内容，用于新建
    if (!this.popupMenus["fontsize"]) {
        sInnerHTML = '\
			<div class="g-menu-inner">\
				<ul class="fontsize">\
					<li>\
						<a val="14px" href="javascript:void(0);" class="size0"><span\
							class="ext txt-info">14px</span>默认大小</a>\
					</li>\
					<li class="ln-thin ln-c-light"></li>\
					<li>\
						<a val="10px" href="javascript:void(0);" class="size1"><span\
							class="ext txt-info">10px</span>极小</a>\
					</li>\
					<li>\
						<a val="13px" href="javascript:void(0);" class="size2"><span\
							class="ext txt-info">13px</span>特小</a>\
					</li>\
					<li>\
						<a val="16px" href="javascript:void(0);" class="size3"><span\
							class="ext txt-info">16px</span>小</a>\
					</li>\
					<li>\
						<a val="18px" href="javascript:void(0);" class="size4"><span\
							class="ext txt-info">18px</span>中</a>\
					</li>\
					<li>\
						<a val="24px" href="javascript:void(0);" class="size5"><span\
							class="ext txt-info">24px</span>大</a>\
					</li>\
					<li>\
						<a val="32px" href="javascript:void(0);" class="size6"><span\
							class="ext txt-info">32px</span>特大</a>\
					</li>\
					<li>\
						<a val="48px" href="javascript:void(0);" class="size7"><span\
							class="ext txt-info">48px</span>极大</a>\
					</li>'+
            (this.settings.toolbar?"":'<li class="ln-thin ln-c-light"></li>\
					<li>\
						<a val="setDefault" href="javascript:void(0);" class="size0"><span\
							class="ext txt-info"></span>设置默认大小</a>\
					</li>')+
            '</ul>\
               </div>\
                   ';
    }
    // 弹出层
    return this.popup(oTarget, "fontsize", sInnerHTML, "185px");
}
/**
 * 弹出字体下拉框
 *
 * @method popupFontnameMenu
 * @param {object}oTarget被点击的按钮（工具栏字体按钮）
 * @return {object} 返回弹出层
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupFontnameMenu(oTarget) {
    var sInnerHTML = ""
    // 如果缓存里没有相应的弹出层，则获取该弹出层的html内容，用于新建
    if (!this.popupMenus["fontname"]) {
        sInnerHTML = '\
			<div class="g-menu-inner">\
				<ul>\
					<li>\
						<a val="宋体" href="javascript:void(0);" style="font-family: \'宋体\'">宋体</a>\
					</li>\
					<li>\
						<a val="黑体" href="javascript:void(0);" style="font-family: \'黑体\'">黑体</a>\
					</li>\
					<li>\
						<a val="楷体_GB2312" href="javascript:void(0);" style="font-family:\'楷体_GB2312\'">楷体_GB2312</a>\
					</li>\
					<li>\
						<a val="隶书" href="javascript:void(0);" style="font-family: \'隶书\'">隶书</a>\
					</li>\
					<li>\
						<a val="幼圆" href="javascript:void(0);" style="font-family: \'幼圆\'">幼圆</a>\
					</li>\
					<li>\
						<a val="Arial" href="javascript:void(0);" style="font-family: Arial">Arial</a>\
					</li>\
					<li>\
						<a val="Arial Black" href="javascript:void(0);" style="font-family: \'Arial Black\'">Arial\
							Black</a>\
					</li>\
					<li>\
						<a val="Comic Sans MS" href="javascript:void(0);" style="font-family: \'Comic Sans MS\'">Comic\
							Sans MS</a>\
					</li>\
					<li>\
						<a val="Courier" href="javascript:void(0);" style="font-family: Courier">Courier</a>\
					</li>\
					<li>\
						<a val="System" href="javascript:void(0);" style="font-family: System">System</a>\
					</li>\
					<li>\
						<a val="Times New Roman" href="javascript:void(0);"\
							style="font-family: \'Times New Roman\'">Times New Roman</a>\
					</li>\
					<li>\
						<a val="Verdana" href="javascript:void(0);" style="font-family: Verdana">Verdana</a>\
					</li>\
				</ul>\
			</div>\
				';
    }
    // 弹出层
    return this.popup(oTarget, "fontname", sInnerHTML, "120px");
}
/**
 * 弹出字体颜色下拉框
 *
 * @method popupForecolorMenu
 * @param {object}oTarget被点击的按钮（工具栏字体颜色按钮）
 * @return {object} 返回弹出层
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupForecolorMenu(oTarget) {
    var sInnerHTML = "";
    // 如果缓存里没有相应的弹出层，则获取该弹出层的html内容，用于新建
    if (!this.popupMenus["forecolor"]) {
        sInnerHTML = '\
			<div class="g-menu-inner g-menu-hasico">\
				<ul class="color">\
					<li>\
						<a val="#000000" href="javascript:void(0);"><b class="ico" \
							style="background: #000000"></b>黑色<span class="txt-info">(默认)</span>\
						</a>\
					</li>\
					<li class="ln-thin ln-c-light"></li>\
					<li>\
						<a val="#880000" href="javascript:void(0);"><b class="ico"\
							style="background: #880000"></b>暗红色</a>\
					</li>\
					<li>\
						<a val="#800080" href="javascript:void(0);"><b class="ico"\
							style="background: #800080"></b>紫色</a>\
					</li>\
					<li>\
						<a val="#ff0000" href="javascript:void(0);"><b class="ico"\
							style="background: #ff0000"></b>红色</a>\
					</li>\
					<li>\
						<a val="#ff00ff" href="javascript:void(0);"><b class="ico"\
							style="background: #ff00ff"></b>鲜粉色</a>\
					</li>\
					<li>\
						<a val="#000080" href="javascript:void(0);"><b class="ico"\
							style="background: #000080"></b>深蓝色</a>\
					</li>\
					<li>\
						<a val="#0000ff" href="javascript:void(0);"><b class="ico"\
							style="background: #0000ff"></b>蓝色</a>\
					</li>\
					<li>\
						<a val="#00ffff" href="javascript:void(0);"><b class="ico"\
							style="background: #00ffff"></b>湖蓝色</a>\
					</li>\
					<li>\
						<a val="#008080" href="javascript:void(0);"><b class="ico"\
							style="background: #008080"></b>蓝绿色</a>\
					</li>\
					<li>\
						<a val="#008000" href="javascript:void(0);"><b class="ico"\
							style="background: #008000"></b>绿色</a>\
					</li>\
					<li>\
						<a val="#808000" href="javascript:void(0);"><b class="ico"\
							style="background: #808000"></b>橄榄色</a>\
					</li>\
					<li>\
						<a val="#00ff00" href="javascript:void(0);"><b class="ico"\
							style="background: #00ff00"></b>浅绿色</a>\
					</li>\
					<li>\
						<a val="#ffcc00" href="javascript:void(0);"><b class="ico"\
							style="background: #ffcc00"></b>橙黄色</a>\
					</li>\
					<li>\
						<a val="#808080" href="javascript:void(0);"><b class="ico"\
							style="background: #808080"></b>灰色</a>\
					</li>\
					<li>\
						<a val="#c0c0c0" href="javascript:void(0);"><b class="ico"\
							style="background: #c0c0c0"></b>银色</a>\
					</li>\
					<li>\
						<a val="#ffffff" href="javascript:void(0);"><b class="ico"\
							style="background: #ffffff; border: 1px solid #ccc"></b>白色</a>\
					</li>' +
            (this.settings.toolbar?"":'<li class="ln-thin ln-c-light"></li>\
					<li>\
						<a val="setDefault" href="javascript:void(0);" style="text-indent:6px">设置默认颜色</a>\
					</li>')+
            '</ul>\
               </div>\
                   ';
    }
    // 弹出层
    return this.popup(oTarget, "forecolor", sInnerHTML);
}
/**
 * 弹出背景颜色下拉框
 *
 * @method popupBackcolorMenu
 * @param {object}oTarget被点击的按钮（工具栏背景颜色按钮）
 * @return {object} 返回弹出层
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupBackcolorMenu(oTarget) {
    var sInnerHTML = "";
    // 如果缓存里没有相应的弹出层，则获取该弹出层的html内容，用于新建
    if (!this.popupMenus["backcolor"]) {
        sInnerHTML = '\
            <div class="g-menu-inner g-menu-hasico">\
				<ul class="color">\
					<li>\
						<a val="#ffffff" href="javascript:void(0);"><b class="ico"\
							style="background: #ffffff; border: 1px solid #ccc"></b>白色<span\
							class="txt-info">(默认)</span> </a>\
					</li>\
					<li class="ln-thin ln-c-light"></li>\
					<li>\
						<a val="#880000" href="javascript:void(0);"><b class="ico"\
							style="background: #880000"></b>暗红色</a>\
					</li>\
					<li>\
						<a val="#800080" href="javascript:void(0);"><b class="ico"\
							style="background: #800080"></b>紫色</a>\
					</li>\
					<li>\
						<a val="#ff0000" href="javascript:void(0);"><b class="ico"\
							style="background: #ff0000"></b>红色</a>\
					</li>\
					<li>\
						<a val="#ff00ff" href="javascript:void(0);"><b class="ico"\
							style="background: #ff00ff"></b>鲜粉色</a>\
					</li>\
					<li>\
						<a val="#000080" href="javascript:void(0);"><b class="ico"\
							style="background: #000080"></b>深蓝色</a>\
					</li>\
					<li>\
						<a val="#0000ff" href="javascript:void(0);"><b class="ico"\
							style="background: #0000ff"></b>蓝色</a>\
					</li>\
					<li>\
						<a val="#00ffff" href="javascript:void(0);"><b class="ico"\
							style="background: #00ffff"></b>湖蓝色</a>\
					</li>\
					<li>\
						<a val="#008080" href="javascript:void(0);"><b class="ico"\
							style="background: #008080"></b>蓝绿色</a>\
					</li>\
					<li>\
						<a val="#008000" href="javascript:void(0);"><b class="ico"\
							style="background: #008000"></b>绿色</a>\
					</li>\
					<li>\
						<a val="#808000" href="javascript:void(0);"><b class="ico"\
							style="background: #808000"></b>橄榄色</a>\
					</li>\
					<li>\
						<a val="#00ff00" href="javascript:void(0);"><b class="ico"\
							style="background: #00ff00"></b>浅绿色</a>\
					</li>\
					<li>\
						<a val="#ffcc00" href="javascript:void(0);"><b class="ico"\
							style="background: #ffcc00"></b>橙黄色</a>\
					</li>\
					<li>\
						<a val="#000000" href="javascript:void(0);"><b class="ico"\
							style="background: #000000"></b>黑色</a>\
					</li>\
					<li>\
						<a val="#808080" href="javascript:void(0);"><b class="ico"\
							style="background: #808080"></b>灰色</a>\
					</li>\
					<li>\
						<a val="#c0c0c0" href="javascript:void(0);"><b class="ico"\
							style="background: #c0c0c0"></b>银色</a>\
					</li>'+
            (this.settings.toolbar?"":'<li class="ln-thin ln-c-light"></li>\
					<li>\
						<a val="setDefault" href="javascript:void(0);" style="text-indent:6px">设置默认颜色</a>\
					</li>')+
            '</ul>\
               </div>\
                   ';
    }
    // 弹出层
    return this.popup(oTarget, "backcolor", sInnerHTML);
}
/**
 * 弹出行高下拉框
 *
 * @method popupLineheightMenu
 * @param {object}oTarget被点击的按钮（工具栏行高按钮）
 * @return {object} 返回弹出层
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupLineheightMenu(oTarget) {
    var sInnerHTML = "";
    // 如果缓存里没有相应的弹出层，则获取该弹出层的html内容，用于新建
    if (!this.popupMenus["lineheight"]) {
        sInnerHTML = '\
			<div class="g-menu-inner">\
				<ul>\
					<li>\
						<a val="50%" href="javascript:void(0);">50%</a>\
					</li>\
					<li>\
						<a val="80%" href="javascript:void(0);">80%</a>\
					</li>\
					<li>\
						<a val="100%" href="javascript:void(0);">100%</a>\
					</li>\
					<li>\
						<a val="120%" href="javascript:void(0);">120%</a>\
					</li>\
					<li>\
						<a val="150%" href="javascript:void(0);">150%</a>\
					</li>\
					<li>\
						<a val="180%" href="javascript:void(0);">180%</a>\
					</li>\
					<li>\
						<a val="200%" href="javascript:void(0);">200%</a>\
					</li>\
				</ul>\
			</div>\
				';
    }
    // 弹出层
    return this.popup(oTarget, "lineheight", sInnerHTML, "70px");
}
/**
 * 弹出添加链接窗口
 *
 * @method popupInsertLinkMenu
 * @param void
 * @return {void}
 * @see #msgBox,getNode,getSelectedText,execFormat,addClass,removeClass
 * @for Editorview
 */
function fEditorViewPopupInsertLinkWin() {
    var that = this;
    that.editor.focus();
    var sTitle = that.getSelectedText();
    var sHtml = '\
		<div class="gSys-inner-comm gSys-inner-input">\
			<b class="ico ico-info" title="提示："></b>\
			<div class="ct">\
            ';
    if (sTitle == "") {
        sHtml += '\
				<p><strong>\
					请输入链接标题\
				</strong></p>\
				<p class="input"><input id="editorLinkTitleInput" value="" type="text" class="ipt-t ipt-t-dft" /></p>\
                ';
    }
    sHtml += '\
				<p><strong>\
					请输入链接（如：http://www.163.com）\
				</strong></p>\
				<p class="input"><input id="editorLinkUrlInput" value="http://" type="text" class="ipt-t ipt-t-dft" /></p>\
			</div>\
		</div>\
		';
    that.msgBox({
        "title" : "超链接",
        "noIcon" : true,
        "content" : sHtml,
        "hasCancel" : true,
        "call" : function() {
            // 网络图片
            function _dislayError(sError) {
                var oErrorDiv = document.getElementById("editorMsgBoxMsgDv");
                oErrorDiv.innerHTML = sError;
            }
            //去掉前后空格
            var sUrl = oUrl.value.replace(/^ +/,"").replace(/ +$/,"");
            if (oTitle) {
                sTitle = oTitle.value.replace(/^ +/,"").replace(/ +$/,"");
                if (sTitle == "") {
                    _dislayError("链接标题不能为空");
                    return {stopClose:true};
                }
            }
            // 有效地址
            if (sUrl && sUrl != "http://") {
                that.execFormat("createLink", sTitle,
                    sUrl);
            } else {
                _dislayError("链接地址无效");
                return {stopClose:true};
            }
        }
    });
    var oUrl = that.getNode("#editorLinkUrlInput");
    //内部函数，聚焦时改变样式
    function _focus(){
        that.addClass(this,"ipt-t-dft-active");
    }
    //内部函数，失去焦点时改变样式
    function _blur(){
        that.removeClass(this,"ipt-t-dft-active");
    }
    oUrl.onfocus = _focus;
    oUrl.onblur =_blur;
    var oTitle;
    if (sTitle == "") {
        oTitle = that.getNode("#editorLinkTitleInput");
    }
    if (oTitle) {
        oTitle.onfocus =_focus;
        oTitle.onblur = _blur;
        oTitle.focus();
    } else {
        oUrl.focus();
    }
}
/**
 * 初始化添加表格对话框
 *
 * @method initTableDiv
 * @param {string}sInsertTableDivid插入本表格对话框里面的div的id
 * @return {void}
 * @see #getNOde
 * @for Editorview
 */
function fEditorViewInitTableDiv(sInsertTableDivid) {
    var that=this;
    var oObserver=that.observer;
    var oDiv = parent.document.getElementById(sInsertTableDivid);
    //缓存表格预览div
    that.tablePreviewDiv=that.getNode("div.editorTablePreview",oDiv)[0];
    // 缓存对话框数据
    var aInputs = oDiv.getElementsByTagName("input");
    var nLength = aInputs.length;
    var oTableWin=that.tableWin = {};
    for (var i = 0; i < nLength; i++) {
        var sName = aInputs[i].name;
        oTableWin[sName] = {
            "el" : aInputs[i],
            "value" : aInputs[i].value
        }
        // 添加事件处理，当input的值变化时触发
        oObserver.add({
            "el" : aInputs[i],
            "eventType" : "keyup",
            "fn" : that.insertTableMenuChange,
            "object":that,
            "params":[aInputs[i]]
        });
    }
    var oWidthUnitSel = oDiv.getElementsByTagName("select")[0];
    // 添加事件处理，当oWidthUnitSel的值变化时触发
    oObserver.add({
        "el" : oWidthUnitSel,
        "eventType" : "change",
        "fn" : that.insertTableMenuChange,
        "object":that,
        "params":[oWidthUnitSel]
    });
    var sName = oWidthUnitSel.name;
    oTableWin[sName] = {
        "el" : oWidthUnitSel,
        "value" : oWidthUnitSel.value
    };
}
/**
 * 校验添加表格的输入数据
 *
 * @method validTableInput
 * @param {object}oParam要校验的input元素或tableWin对象
 * @return {boolean}
 * @see #refreshPreviewTable #notifyListener Format#exec
 * @for Editorview
 */
function fEditorViewValidTableInput(oParam) {
    var that = this;
    var oErrorDiv;
    function _validInput(oInput) {
        var sName = oInput.name;
        var sValue = oInput.value;
        var bIsValid = true;
        var sError = "";
        if (/^\d+\.+\d*$/.test(sValue)) {
            sError = "请输入整数";
        }else if(!/^\d*$/.test(sValue)){
            sError = "请输入数字";
        } else {
            switch (sName) {
                case "row" : {
                    if(sValue==""){
                        sError = "行数不能为空";
                    }else if (parseInt(sValue) > 10000) {
                        sError = "行数不能超过10000";
                    } else if (parseInt(sValue) < 1) {
                        sError = "行数不能小于1";
                    }
                    break;
                }
                case "column" : {
                    if(sValue==""){
                        sError = "列数不能为空";
                    }else if (parseInt(sValue) > 10000) {
                        sError = "列数不能超过10000";
                    } else if (parseInt(sValue) < 1) {
                        sError = "列数不能小于1";
                    }
                    break;
                }
                case "width" : {
                    if(sValue==""){
                        sError = "表格宽度不能为空";
                    }else if (parseInt(sValue) > 10000) {
                        sError = "表格宽度不能超过10000";
                    } else if (parseInt(sValue) < 1) {
                        sError = "表格宽度不能小于1";
                    }
                    break;
                }
                case "border" : {
                    if(sValue==""){
                        sError = "边框粗细不能为空";
                    }else if (parseInt(sValue) > 1000) {
                        sError = "边框粗细不能超过1000";
                    } else if (parseInt(sValue) < 0) {
                        sError = "边框粗细不能小于0";
                    }
                    break;
                }
                case "cellPadding" : {
                    if(sValue==""){
                        sError = "单元格边距不能为空";
                    }else if (parseInt(sValue) > 1000) {
                        sError = "单元格边距不能超过1000";
                    } else if (parseInt(sValue) < 0) {
                        sError = "单元格边距不能小于0";
                    }
                    break;
                }
                case "borderSpacing" : {
                    if(sValue==""){
                        sError = "单元格间距不能为空";
                    }else if (parseInt(sValue) > 1000) {
                        sError = "单元格间距不能超过1000";
                    } else if (parseInt(sValue) < 0) {
                        sError = "单元格间距不能小于0";
                    }
                    break;
                }
            }
        }
        if (sError != "") {
            bIsValid = false;
        }
        //通知监听器，显示错误信息
        var oResult=that.notifyListener("onEndCheckInsertTableInput",{"error":sError});
        //如果没有执行监听器,则显示验证结果
        if(!oResult.success){
            var oErrorDiv=parent.document.getElementById("editorMsgBoxMsgDv");
            oErrorDiv.innerHTML = sError;
        }
        return bIsValid;
    }
    if (/input/i.test(oParam.nodeName)) {
        return _validInput(oParam);
    } else {
        for (var key in oParam) {
            var oInput = oParam[key]["el"];
            if (/input/i.test(oInput.nodeName)&&!_validInput(oInput)) {
                return false;
            }
        }
    }
    return true;
}
/**
 * 插入表格
 *
 * @method insertTable
 * @param void
 * @return {boolean}成功插入则返回true
 * @see #refreshPreviewTable Format#exec
 * @for Editorview
 */
function fEditorViewInsertTable() {
    var that=this;
    var oTableWin=that.tableWin;
    if(!that.validTableInput(oTableWin)){
        return false;
    }
    // 更新缓存数据
    for (var key in oTableWin) {
        oTableWin[key]["value"] = oTableWin[key]["el"].value;
    }
    var sTable = that.refreshPreviewTable();
    that.format.exec("insertHtml", sTable);
    return true;
}
/**
 * 弹出添加表格窗口
 *
 * @method popupInsertTableMenu
 * @param {object}oTarget被点击的按钮（工具栏添加表格按钮）
 * @return {void}
 * @see #msgBox,insertTable,initTableDiv
 * @for Editorview
 */
function fEditorViewPopupInsertTableWin(oTarget) {
    var that=this;
    var sHtml ='\
				<div class="gSys-inner-addtable" id="editorInsertTableDiv">\
					<table>\
						<tbody>\
						<tr>\
								<td width="85px" class="g-editor-addtable-clearheight"></td>\
								<td class="g-editor-addtable-clearheight" width="160px"></td>\
							</tr>\
						<tr><td colspan="2">行数&nbsp; <input name="row" type="text" class="ipt-t-dft" maxlength="6" value="2" style="width:69px" />&nbsp;&nbsp;&nbsp; 列数&nbsp; <input name="column" type="text" class="ipt-t-dft" maxlength="6" value="2" style="width:68px" /></td><td align="center" rowspan="5" style="overflow:hidden" class="g-editor-addtable-preview">\
						<span class="g-editor-addtable-title">预览</span>\
						<div class="editorTablePreview" style="height:170px;overflow:hidden">\
							<table style="width:80%;height:60px;border-width:1px;border-spacing:1px" cellPadding="1" cellSpacing="1">\
								<tr>\
								<td style="padding:1px">&nbsp;</td>\
								<td style="padding:1px">&nbsp;</td>\
								</tr>\
								<tr>\
								<td style="padding:1px">&nbsp;</td>\
								<td style="padding:1px">&nbsp;</td>\
								</tr>\
							</table>\
						</div>\
						</td></tr>\
							<tr>\
								<td>表格宽度</td>\
								<td><input name="width" type="text" class="ipt-t-dft" value="80" maxlength="6" style="width:60px" />&nbsp;&nbsp; <select name="widthUnit" style="width:60px" func="select"><option value="%">%</option><option  value="px">px</option></select></td>\
							</tr>\
							<tr><td>边框粗细</td><td><input name="border" type="text" class="ipt-t-dft" maxlength="6" value="1" style="width:60px" />&nbsp;&nbsp;像素</td></tr>\
							<tr><td>单元格边距</td><td><input name="cellPadding" type="text" class="ipt-t-dft" maxlength="6" value="1" style="width:60px" />&nbsp&nbsp;像素</td></tr>\
							<tr><td>单元格间距</td><td><input name="borderSpacing" type="text" class="ipt-t-dft" maxlength="6" value="1" style="width:60px" />&nbsp;&nbsp;像素</td></tr>\
						</tbody>\
					</table>\
				</div>\
				';
    that.msgBox({"title":"插入表格","noIcon":true,"content":sHtml,"hasCancel":true,"call":function(){
        return {stopClose:!that.insertTable()};
    }});
    that.initTableDiv("editorInsertTableDiv");
}
/**
 * 刷新表格对话框的表格预览
 *
 * @method refreshPreviewTable
 * @param void
 * @return {string}返回新建表格的html字符串
 * @see Editor#createTable
 * @for Editorview
 */
function fEditorViewRefreshPreviewTable() {
    var that=this;
    var oTableWin=that.tableWin;
    var sTable = that.editor.createTable({
        "row" : oTableWin["row"]["value"],
        "column" : oTableWin["column"]["value"],
        "width" : oTableWin["width"]["value"]
            + oTableWin["widthUnit"]["value"],
        "borderWidth" : oTableWin["border"]["value"],
        "cellspacing" : oTableWin["borderSpacing"]["value"],
        "padding" : oTableWin["cellPadding"]["value"]
    });
    that.tablePreviewDiv.innerHTML=sTable;
    return sTable;
}
/**
 * 处理插入表格对话框的单击事件
 *
 * @method insertTableMenuClick
 * @param void
 * @return {void}
 * @see #getEvent
 * @for Editorview
 */
function fEditorViewInsertTableMenuClick(){
    var that = this;
    var oEvent=that.getEvent();
    var oSrcEl= that.system.ie ? oEvent.srcElement : oEvent.target;
    var sFunc=oSrcEl.getAttribute("func");
    if(sFunc){
        var oTableWin=that.tableWin;
        switch (sFunc){
            //确认
            case "confirm":{
                //更新缓存数据
                for(var key in oTableWin){
                    oTableWin[key]["value"]=oTableWin[key]["el"].value;
                }
                var sTable=that.refreshPreviewTable();
                that.format.exec("insertHtml",sTable);
                break;
            }
            //取消
            case "cancel":{
            }
            //关闭
            case "close":{
                //输入框恢复默认值
                oTableWin["row"]["el"].value=2;
                oTableWin["col"]["el"].value=2;
                oTableWin["width"]["el"].value=80;
                oTableWin["widthUnit"]["el"].value="%";
                oTableWin["border"]["oEl"].value=1;
                oTableWin["cellPadding"]["el"].value=1;
                oTableWin["borderSpacing"]["el"].value=1;
                //缓存数据恢复默认值
                oTableWin["row"]["value"]=2;
                oTableWin["col"]["value"]=2;
                oTableWin["width"]["value"]=80;
                oTableWin["widthUnit"]["value"]="%";
                oTableWin["border"]["value"]=1;
                oTableWin["cellPadding"]["value"]=1;
                oTableWin["borderSpacing"]["value"]=1;
                //恢复默认表格预览
                that.refreshPreviewTable();
                break;
            }
        }
    }
}
/**
 * 处理插入表格对话框的输入变化事件
 *
 * @method insertTableMenuChange
 * @param {object}oEl输入框
 * @return {boolean}返回true表示成功更新预览
 * @see #refreshPreviewTable #validTableInput
 * @for Editorview
 */
function fEditorViewInsertTableMenuChange(oEl) {
    var that = this;
    if (/input/i.test(oEl.nodeName) && !that.validTableInput(oEl)) {
        that.tablePreviewDiv.innerHTML = "";
        return false;
    }
    var sName = oEl.name;
    var sValue = oEl.value;

    // 更新缓存
    that.tableWin[sName]["value"] = sValue;
    //进一步校验
    if(!this.validTableInput(that.tableWin)){
        return false;
    }
    // 刷新表格预览
    that.refreshPreviewTable();
    return true;
}
/**
 * 弹出图片编辑栏
 *
 * @method popupImgToolbar
 * @param void
 * @return {void}
 * @see #getEvent #getNode #hidePopup #show #getLeft #getTop Editor.Observer#add
 * @for Editorview
 */
function fEditorViewPopupImgToolbar() {
    // 获取编辑器视图对象
    var that = this;
    // 获取当前编辑框内的事件
    var oEvent = that.getEvent(that.editor.win);

    // 没有事件，则返回
    if (!oEvent) {
        return;
    }

    // 获取事件源节点
    var oNode = oEvent.srcElement ? oEvent.srcElement : oEvent.target;
    // 如果事件源是图片节点，则弹出图片编辑栏
    if (/img/i.test(oNode.nodeName)) {
        that.img = oNode;
        // 如果缓存里没有图片编辑工具栏，则新建一个
        if (!that.popupMenus["image"]) {
            var oNewDiv = document.createElement("div");
            oNewDiv.id = "imageMenuDiv";
            oNewDiv.className = "g-imgbar";
            oNewDiv.style.width="280px";
            oNewDiv.style.display="none";
            // 添加单击事件
            that.observer.add({
                "el" : oNewDiv,
                "eventType" : "click",
                "fn" :that.editImage,
                "object":that,
                "params":[oNewDiv]
            });
            // 插入编辑栏html
            oNewDiv.innerHTML = '\
			        <a href="javascript:void(0)" func="little">小</a>&nbsp;-&nbsp;\
			        <a href="javascript:void(0)" func="medium">中</a>&nbsp;-&nbsp;\
			        <a href="javascript:void(0)" func="big">大</a>&nbsp;-&nbsp;\
			        <a href="javascript:void(0)" func="original">原始大小</a>&nbsp;-&nbsp;\
			        <a href="javascript:void(0)" func="delete">删除</a>&nbsp;&nbsp;[\
			        <a href="javascript:void(0)" func="close">关闭</a>]\
		       ';
            // 将编辑栏插入到页面中
            that.editorDiv.appendChild(oNewDiv);
            // 缓存图片工具栏
            that.popupMenus["image"] = oNewDiv;
        }
        // 隐藏其它弹出层
        if (that.popupDiv && that.popupDiv != that.popupMenus["image"]) {
            that.hidePopup();
        }
        // 设置位置
        that.popupMenus["image"].style.left = that.getLeft(oNode) + "px";
        var nTop=that.getTop(oNode)+ oNode.clientHeight + 28+(that.editMode=="full"?27:0);
        //最大高度,不能超出编辑框
        var nMaxTop=that.editorDiv.clientHeight-22;
        if(nTop>nMaxTop){
            nTop=nMaxTop;
        }
        that.popupMenus["image"].style.top = nTop + "px";
        // 延时显示图片工具栏，避免外部事件调用hidePopup隐藏
        that.delayPopup(that.popupMenus["image"],0);
    }
}
/**
 * 编辑图片
 *
 * @method editImage
 * @param {object}oTarget图片编辑栏
 * @return {void}
 * @see #hide #getTop
 * @for Editorview
 */
function fEditorViewEditImage(oTarget) {
    var that=this;
    //取消图片周围的编辑框
    if(that.system.ie){
        try{
            // 取消当前选中区
            that.editor.getSelection().empty();
        }catch(e){}
    }
    var e = that.getEvent();
    // 获取事件源元素
    var oSrcEl = e.target || e.srcElement;
    // 如果用户点击的不是编辑按钮，则直接退出函数
    if (!/a/i.test(oSrcEl.nodeName)) {
        return false;
    }
    var sFunc = oSrcEl.getAttribute("func");
    var oImage = that.img;
    // 删除图片
    if (sFunc == "delete") {
        var oParent=oImage.parentNode;
        //如果图片外是一个链接标签（为图片添加链接产生），则连同链接标签一起删除
        if(/a/i.test(oParent.nodeName)&&oParent.childNodes.length==1){
            oParent.parentNode.removeChild(oParent);
        }else{
            oImage.parentNode.removeChild(oImage);
        }
        // 隐藏图片编辑工具栏
        that.hide(oTarget);
        // 保存编辑历史
        that.history.save();
        return true;
    } else if (sFunc == "close") { // 关闭编辑工具栏
        that.hide(oTarget);
        return true;
    }
    var aSize;
    switch (sFunc) {
        // 小尺寸
        case 'little' : {
            aSize = [100, 80];
            break;
        }
        // 中等尺寸
        case 'medium' : {
            aSize = [200, 160];
            break;
        }
        // 大尺寸
        case 'big' : {
            aSize = [460, 380];
            break;
        }
        // 原始尺寸
        case 'original' : {
            oImage.removeAttribute("style");
            break;
        }
    }
    // 原始大小
    if (!oImage.getAttribute("orgWidth")) {
        // 仅需设置一次
        oImage.setAttribute("orgWidth", oImage.clientWidth);
        oImage.setAttribute("orgHeight", oImage.clientHeight);
    }
    var nOrgWidth = parseInt(oImage.getAttribute("orgWidth"), 10);
    var nOrgHeight = parseInt(oImage.getAttribute("orgHeight"), 10);
    if (aSize) {
        // 设置大小
        var nNewWidth = 0;
        var nNewHeight = 0;
        if (nOrgWidth > nOrgHeight) {
            // 宽为准
            nNewWidth = aSize[0];
            nNewHeight = Math.round(nNewWidth * nOrgHeight / nOrgWidth);
        } else {
            // 高为准
            nNewHeight = aSize[1];
            nNewWidth = Math.round(nNewHeight * nOrgWidth / nOrgHeight);
        }
        // 新大小
        if (nNewWidth && nNewHeight) {
            oImage.style.height = nNewHeight + "px";
            oImage.style.width = nNewWidth + "px";
        }
    } else {
        // 原始大小
        oImage.style.height = nOrgHeight+"px";
        oImage.style.width = nOrgWidth+"px";
    }
    // 隐藏图片编辑工具栏
    that.hide(oTarget);
    // 保存编辑历史
    that.history.save();
}
/**
 * 更改编辑模式
 *
 * @method changeEditMode
 * @param {string}sMode编辑模式名称
 * @return {boolean} true 表示成功
 * @see #addClass #hide #show #changeToolbar Editor#setContent #getContent
 *      Editor.Format#sFormat
 * @for Editorview
 */
function fEditorViewChangeEditMode(sMode) {
    var that=this;
    function _getClass(sEditMode){
        switch(sEditMode){
            case "basic":{
                return "g-editor g-editor-basic";
            }
            case "full":{
                return "g-editor g-editor-full";
            }
            case "source":{
                return "g-editor g-editor-code";
            }
            case "text":{
                return "g-editor g-editor-text";
            }
            case "hide":{
                return "g-editor g-editor-hide";
            }
        }
    }
    //如果当前就是要切换的模式，则直接返回false
    if(that.editMode==sMode){
        return false;
    }
    var oEditorDiv=that.editorDiv;
    var oEditor=that.editor;
    if (sMode == "source") {
        //切换到源码模式
        oEditorDiv.className="g-editor g-editor-code";
        // 设置源码编辑框内容
        that.editorSourceTextarea.value = oEditor.getContent();
    } else if (sMode == "full") {
        //切换到全部功能模式
        oEditorDiv.className="g-editor g-editor-full";
        if(that.editMode=="source"){
            oEditor.setContent(that.editorSourceTextarea.value);
        }
        //更改弹出图片编辑栏的位置
        if(that.popupDiv&&that.popupDiv == that.popupMenus["image"]){
            var sTop=that.popupDiv.style.top;
            sTop=sTop.substring(0,sTop.indexOf("px"));
            that.popupDiv.style.top=parseInt(sTop)+27+"px";
        }
    } else if (sMode == "basic") {
        //切换到简单功能模式
        oEditorDiv.className="g-editor g-editor-basic";
        //更改弹出图片编辑栏的位置
        if(that.popupDiv&&that.popupDiv == that.popupMenus["image"]){
            var sTop=that.popupDiv.style.top;
            sTop=sTop.substring(0,sTop.indexOf("px"));
            that.popupDiv.style.top=parseInt(sTop)-27+"px";
        }
    } else if (sMode == "text") {
        // 切换到纯文本编辑模式
        oEditorDiv.className="g-editor g-editor-text";
        //记录编辑历史
        that.history.save();
        if (that.editMode != "source") {
            // 设置纯文本编辑框内容
            that.editorTextTextarea.value = oEditor.htmlToText(oEditor.getContent());
        } else {
            // 设置可视化编辑框内容
            that.editorTextTextarea.value = oEditor.htmlToText(that.editorSourceTextarea.value);
        }
        //临时保存编辑模式，恢复成html模式时需要用到
        that.editModeTmp=that.editMode;
    } else if (sMode == "html") {// 切换到html编辑模式
        // 隐藏纯文本编辑框
        if (that.editModeTmp != "source") {
            // 设置iframe编辑框内容
            oEditor.setContent(oEditor.textToHtml(that.editorTextTextarea.value));
        } else {
            // 设置源码编辑框内容
            that.editorSourceTextarea.value = oEditor.textToHtml(that.editorTextTextarea.value);
        }
        oEditorDiv.className =_getClass(that.editModeTmp);
        that.editMode=that.editModeTmp;
    }else if(sMode == "hide"){
        //保存编辑模式
        that.editModeTmpForToogle=that.editMode;
        that.addClass(oEditorDiv,"g-editor-hide");
    }else if(sMode == "show"){
        //如过之前没有设置editModeTmpForToogle，则设置editModeTmpForToogle=0
        if(that.editModeTmpForToogle==undefined){
            that.editModeTmpForToogle="basic";
        }
        oEditorDiv.className =_getClass(that.editModeTmpForToogle);
        that.editMode=that.editModeTmpForToogle;
    }
    //更新编辑模式
    if(sMode!="show"&&sMode!="html"){
        that.editMode=sMode;
    }
    if(that.editMode=="basic"||that.editMode=="full"){
        // 更新工具栏状态
        that.changeToolbar();
    }
    that.notifyListener("onEndChangeEditMode",{"mode":sMode});
    return true;
}
/**
 * 处理工具栏鼠标单击事件
 *
 * @method doClick
 * @param {object}oParams
 *                {string}.command命令类别
 *                {string}.name命令名称
 *                {object}.dom按钮节点
 * @return {boolean} true 表示成功
 * @see #removeClass #changeEditMode #changeToolbar #notifyListener
 * @see Editor.Format#exec
 * @see Editor.History#save
 * @for Editorview
 */
function fEditorViewDoClick(oParams) {
    // 处理格式化请求
    var that=this;
    //尝试执行监听器
    var oResult=that.notifyListener("onStartClickItem",oParams);
    //如果监视器要求停止，则立即返回false
    if(oResult["stop"]==true){
        return false;
    }
    //标志是否需要更新工具栏状态
    var bNeedChangeToolbar=true;
    if (oParams["command"] == "format") {
        var sFormat = oParams["name"];
        if (sFormat != "cut" &&sFormat != "copy" &&sFormat != "paste" && sFormat != "undo" && sFormat != "redo"
            && sFormat != "insertHorizontalRule"&&sFormat != "insertTime"
            && sFormat != "removeFormat") {
            // 设置相应按钮的激活状态，避免domouseout事件更改按钮
            that.toolbar[that.editMode][sFormat].isActive = true;
        }

        // 执行格式化命令并记录结果
        var bResult = that.format.exec(sFormat);
        // 执行命令失败
        if (bResult == false) {
            switch (sFormat) {
                case 'copy' :
                    alert("您的浏览器不支持本操作，请使用'crtl+c'代替。");
                    return false;
                case 'cut' :
                    alert("您的浏览器不支持本操作，请使用'crtl+x'代替。");
                    return false;
                case 'paste' :
                    alert("您的浏览器不支持本操作，请使用'crtl+v'代替。");
                    return false;
            }
        }
    }else if(oParams["command"] == "custom"){
        if(oParams["name"]=="insertTable"){
            that.popupInsertTableWin();
        }else if(oParams["name"]=="link"){
            //如果用户选中有链接，则执行删除链接操作，否则，执行添加链接操作
            if(!that.deleteLink()){
                that.popupInsertLinkWin();
                return;
            }
        } else if (oParams["name"] == "portrait") {
            var sHtml = '<iframe src="/bbs/editor/portrait/portrait.htm" frameborder="0" scrolling="no" ' +
                'style="width:'+(that.system.ie?"374px;height:220":"379px;height:222")+'px"></iframe>';
            var oMenuDiv = document.createElement("div");
            oMenuDiv.className = "g-menu";
            oMenuDiv.style.display = "none";
            // 设置弹出层内容为指定内容
            oMenuDiv.innerHTML = sHtml;
            // 把弹出层插入到页面中
            that.menuContainer.appendChild(oMenuDiv);
            // 设置菜单位置
            oMenuDiv.style.left = that.getLeft(oParams["dom"]) + 1 + "px";
            oMenuDiv.style.top = that.getTop(oParams["dom"]) + 20 + "px";
            // 显示弹出层，避免被外层调用hidePopup隐藏掉
            that.delayPopup(oMenuDiv,500);
            // 恢复选区
            if (that.range && that.system.ie) {
                that.editor.selectRange(that.range);
            }
        }
        //记录编辑历史
        that.history.save();
        return;
    } else if (oParams["command"] == "editMode") {// 切换编辑模式
        bNeedChangeToolbar=false;
        that.changeEditMode(oParams["name"]);
    } else if(oParams["command"]=="popup"){
        bNeedChangeToolbar=false;
        var sFunc="popup"+oParams["name"].substring(0,1).toUpperCase()+oParams["name"].substring(1)+"Menu";
        that[sFunc](oParams["dom"]);
    }
    // 实时更改工具栏状态
    if (bNeedChangeToolbar) {
        that.changeToolbar();
    }
    //尝试执行监听器
    that.notifyListener("onEndClickItem",oParams);
    return true;
}
/**
 * 处理下拉列表鼠标单击事件
 *
 * @method clickList
 * @param {object}oTarget,
 *            sCommand,
 * @return {boolean}true 表示成功
 * @see #hidePopup Editor.Format#exec
 * @for Editorview
 */
function fEditorViewClickList(oTarget, sCommand) {
    var that=this;
    var oFormat=that.format;
    // 隐藏弹出层
    that.hidePopup();
    // 获取事件
    debugger
    var e = that.getEvent();
     /* todo list event */
    console.info("that :",this);
    console.info("event :",e);
    // 获取事件源
    var oSrcEl = e.target || e.srcElement;
    // 执行编辑命令
    switch (sCommand) {
        case 'forecolor' :
        case 'backcolor' : {
            var sColor;
            // 如果用户点击的是<b>标签，则获取<b>的父节点的val属性
            if (oSrcEl.tagName == "b" || oSrcEl.tagName == "B") {
                sColor = oSrcEl.parentNode.getAttribute("val");
                // 如果用户点击的是<a>节点，则获取<b>节点的val属性
            } else {
                sColor = oSrcEl.getAttribute("val");
            }
            if(sColor!="setDefault"){
                // 执行编辑命令
                oFormat.exec(sCommand,sColor);
            }else{
                that.notifyListener("onStartClickItem",{"command":"custom","name":sCommand});
            }
            return true;
        }
        case 'fontname' : {
            oFormat.exec(sCommand,oSrcEl.style.fontFamily);
            return true;
        }
        case 'fontsize' : {
            var sSize;
            // 如果用户点击的是<b>标签，则获取<b>的父节点的val属性
            if (oSrcEl.tagName == "b" || oSrcEl.tagName == "B") {
                sSize = oSrcEl.parentNode.getAttribute("val");
                // 如果用户点击的是<a>节点，则获取<b>节点的val属性
            } else {
                sSize = oSrcEl.getAttribute("val");
            }
            if(sSize!="setDefault"){
                // 执行命令
                oFormat.exec(sCommand,sSize);
            }else{
                that.notifyListener("onStartClickItem",{"command":"custom","name":sCommand});
            }
            return true;
        }
        case 'justify' : {
            // 获取包含参数的元素
            if (oSrcEl.tagName != "b" && oSrcEl.tagName != "B") {
                oSrcEl = oSrcEl.getElementsByTagName("b")[0];
            }
            // 根据css类名区分编辑命令
            if (oSrcEl.className.indexOf("ico-editor-alef") >= 0) {
                oFormat.exec("justifyLeft");
            } else if (oSrcEl.className.indexOf("ico-editor-acen") >= 0) {
                oFormat.exec("justifyCenter");
            } else {
                oFormat.exec("justifyRight");
            }
            return true;
        }
        case 'list' : {
            // 获取包含参数的元素
            if (oSrcEl.tagName != "b" && oSrcEl.tagName != "B") {
                oSrcEl = oSrcEl.getElementsByTagName("b")[0];
            }
            // 根据css类名区分编辑命令
            if (oSrcEl.className.indexOf("ico-editor-clist") >= 0) {
                oFormat.exec("insertUnorderedList");
            } else {
                oFormat.exec("insertOrderedList");
            }
            return true;
        }
        case 'indent' : {
            // 获取包含参数的元素
            if (oSrcEl.tagName != "b" && oSrcEl.tagName != "B") {
                oSrcEl = oSrcEl.getElementsByTagName("b")[0];
            }
            // 根据css类名区分编辑命令
            if (oSrcEl.className.indexOf("ico-editor-cuti") >= 0) {
                oFormat.exec("outdent");
            } else {
                oFormat.exec("indent");
            }
            return true;
        }
        case 'lineheight' : {
            oFormat.exec(sCommand,oSrcEl.innerHTML);
            return true;
        }
        case 'insertTable' : {
            oFormat.exec(sCommand,3, 3, 100, 50);
            return true;
        }
    }
}
/**
 * 处理工具栏鼠标经过事件
 *
 * @method doOnmouseover
 * @param {object}oTarget
 * @return {void}
 * @see #addClass
 * @for Editorview
 */
function fEditorViewDoOnmouseover(oTarget) {
    // 添加“激活”的样式
    var aLinks=oTarget.getElementsByTagName("a");
    if(aLinks.length==0||aLinks[0].className.indexOf("-dis")<0){
        this.addClass(oTarget, "g-editor-btn-on");
    }
}
/**
 * 处理工具栏鼠标移出事件
 *
 * @method doOnmouseout
 * @param {object}oTarget
 * @return {void}
 * @see #removeClass
 * @for Editorview
 */
function fEditorViewDoOnmouseout(oTarget) {
    var sFormat = oTarget.getAttribute("format");
    // 如果是编辑工具栏按钮，要先判断用户是否单击激活了该按钮
    if (sFormat) {
        if (this.toolbar[this.editMode][sFormat].isActive != true) {
            // 如果该按钮不是激活状态
            this.removeClass(oTarget, "g-editor-btn-on");
        }
        // 如果是其它按钮，直接移除“激活”的样式
    } else {
        this.removeClass(oTarget, "g-editor-btn-on");
    }
}
/**
 * 开启历史记录计时器
 *
 * @method startHistoryTimer
 * @param void
 * @return {boolean}成功开启历史记录计时器则返回true
 * @param History#save
 * @for Editorview
 */
function fEditorViewStartHistoryTimer() {
    var that = this;
    var oHistory=that.history;
    if (oHistory&&!that.historyTimer) {
        oHistory.save();
        that.historyTimer = setTimeout(function() {
            if (that.editorDiv.offsetHeight > 0) {
                oHistory.save();
                that.changeToolbar(["undo","redo"]);
                var fTimer = arguments.callee;
                that.historyTimer = setTimeout(fTimer, 2000);
            }else{
                that.stopHistoryTimer();
            }
        }, 2000);
        return true;
    } else {
        return false;
    }
}
/**
 * 结束历史记录计时器
 *
 * @method stopHistoryTimer
 * @param void
 * @return {boolean}成功停止历史记录计时器则返回true
 * @for Editorview
 */
function fEditorViewStopHistoryTimer() {
    var that=this;
    if(that.historyTimer){
        clearTimeout(that.historyTimer);
        that.historyTimer=null;
        return true;
    }else{
        return false;
    }
}
/**
 * 添加监听器
 *
 * @method addListener
 * @param {string}sEvent监听器名
 * @param {function}fFunction监听器函数
 * @return {void}
 * @for Editorview
 */
function fEditorViewAddListener(sEvent,fFunction) {
    this.listener[sEvent]=fFunction;
}
/**
 * 移除监听器
 *
 * @method removeListener
 * @param {string}sEvent监听器名
 * @return {boolean}删除成功则返回true
 * @for Editorview
 */
function fEditorViewRemoveListener(sEvent) {
    if(this.listener[sEvent]){
        delete this.listener[sEvent];
        return true;
    }else{
        return false;
    }
}
/**
 * 通知/启动监听器
 *
 * @method notityListener
 * @param {string}sEvent监听器名
 * @param {object}oData传递参数
 * @return {object}
 *                 {boolean}.success表示是否成功执行了监听器
 *                 {boolean}.stop表示是否停止执行后续语句
 *                 {object}.params监听函数返回的结果
 * @for Editorview
 */
function fEditorViewNotifyListener(sEvent, oData) {
    if (typeof this.listener[sEvent] == "function") {
        var oResult = this.listener[sEvent](oData);
        return {
            "success" : true,
            "params" : oResult,
            "stop" : oResult
                ? oResult["stop"] ? oResult["stop"] : false
                : false
        };
    } else {
        return {
            "success" : false,
            "stop" : false
        };
    }
}
/**
 * 获取对象，用于二次开发
 *
 * @method get
 * @param {object}oData
 * @return {object}返回需要的对象
 * @for Editorview
 */
function fEditorViewGet(oData) {
    // 获取内部对象,用于二次开发
    if (typeof oData == "string") {
        if(oData=="win"){
            return this.editor.win;
        }else if(oData=="doc"){
            return this.editor.doc;
        }else if(oData=="body"){
            return this.editor.doc.body;
        }else if(oData=="div"){
            return this.editorDiv;
        }
        return null;
    }
    // 获取内部元素
    if (typeof oData["id"] == "string") {
        return this.editor.doc.getElementById(oData["id"]);
    }
    // 获取内部标签
    if (typeof oData["tag"] == "string") {
        return this.editor.doc.getElementsByTagName(oData["tag"]);
    }
    var sValue = "";
    // 是否内容为空
    if (oData["empty"]) {
        // 默认空
        var bEmpty = true;
        // 文本
        sValue = this.get({
            "text" : true
        });
        // 有内容
        if (sValue) {
            // 非空
            bEmpty = false;
        }
        return bEmpty;
    }
    if (this.editMode == "source") {
        // 源码编辑
        sValue = this.editorSourceTextarea.value;
    } else if (this.editMode=="text") {
        // 文本编辑
        sValue = this.editorTextTextarea.value;
        // 强制媒体
        if (oData["html"]) {
            sValue = sValue.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
        }
    } else {
        var oBody = this.editor.doc.body;
        // 强制文本
        if (oData["text"]) {
            // Text
            if (typeof oBody.textContent == "string") {
                sValue = oBody.textContent;
            } else if (typeof oBody.innerText == "string") {
                sValue = oBody.innerText;
            } else {
                sValue = "";
            }
        } else {
            // HTML
            sValue = oBody.innerHTML;
        }
    }
    return sValue;
}
/**
 * 设置对象，用于二次开发
 *
 * @method set
 * @param {object}oData
 * @return {boolean} 如果执行失败，返回false
 * @see #changeEditMode Editor#setContent
 * @for Editorview
 */
function fEditorViewSet(oData) {
    try {
        // 设置内部对象 二次开发
        if (typeof oData == "string") {
            if (oData == "win") {
                //this.editor.win = oData["value"];
            } else if (oData == "doc") {
                //this.editor.doc = oData["value"];
            } else if (oData == "body") {
                //this.editor.doc.body = oData["value"];
            } else if (oData == "div") {
                //this.editorDiv = oData["value"];
            }
        } else {

            var sValue = oData["html"] || oData["text"] || oData["source"]
                || "";
            if (this.editMode == "text") {
                // 纯文本 设置 多媒体内容
                if (oData["html"]) {
                    // 转多媒体
                    this.changeEditMode("html");
                }
            } else {
                // 多媒体 设置 纯文本内容
                if (oData["text"]) {
                    // 转纯文本
                    this.changeEditMode("text");
                }
            }
            if (this.editMode == "source") {
                // 源码 设置 多媒体内容
                if (oData["html"]) {
                    // 切多媒体
                    this.changeEditMode("source");
                }
            }
            // 内容填充
            if (this.editMode == "source") {
                // 源码编辑
                this.editorSourceTextarea.value = sValue;
            } else if (this.editMode == "text") {
                // 文本编辑
                this.editorTextTextarea.value = sValue;
            } else {
                // 设置HTML
                this.editor.setContent(sValue);
                // 取消范围
                this.range = null;
            }

            // 保存编辑历史
            this.history.save();
        }
    } catch (e) {
        this.log(e);
        return false;
    }
}
/**
 * 是否是纯文本模式
 *
 * @method isTextMode
 * @param void
 * @return {boolean}如果是纯文本模式，则返回true
 * @for Editorview
 */
function fEditorViewIsTextMode() {
    return this.editMode=="text"?true:false;
}
/**
 * 展开/隐藏工具栏
 *
 * @method toogleToolbar
 * @param void
 * @return {boolean}工具栏展开后返回true
 * @see #removeClass #addClass
 * @for Editorview
 */
function fEditorViewToogleToolbar() {
    if(this.editMode=="hide"){
        this.changeEditMode("show");
        return true;
    }else{
        this.changeEditMode("hide");
        return false;
    }
}
/**
 * 获取初始化编辑框的html字符串
 *
 * @method getInitHtml
 * @param {string}sBody编辑框内的默认内容
 * @return {string}返回初始化编辑框的html字符串
 * @see Editor#getInitHtml
 * @for EditorView
 */
function fEditorViewGetInitHtml(sBody) {
    return this.editor.getInitHtml({"body":sBody});
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
function fEditorViewFocus(oData) {
    this.editor.focus(oData);
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
 * @see Editor#insert
 * @for Editor
 */
function fEditorViewInsert(oData) {
    this.editor.insert(oData);
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
function fEditorViewDelete(oData) {
    this.editor.del(oData);
}
/**
 * 获取光标选中文本
 *
 * @method getSelectedText
 * @param void
 * @return {string} 返回光标所在位置的文字
 * @see Editor#getSelectedText
 * @for EditorView
 */
function fEditorViewGetSelectedText() {
    return this.editor.getSelectedText();
}
/**
 * 执行指定命令并记录编辑历史
 *
 * @method execFormat
 * @param {string}sCommand
 * @param {object}oParams命令参数，可以是string类型，也可以是json类型
 * @return {boolean} true表示成功执行命令
 * @see Editor.Format#exec
 * @for EditorView
 */
function fEditorViewExecFormat(sCommand,oParams) {
    return this.format.exec.apply(this.format,arguments);
}
/**
 * 删除链接
 *
 * @method deleteLink
 * @param void
 * @return {boolean} true表示成功执行命令
 * @for EditorView
 */
function fEditorViewDeleteLink() {
    return this.format.exec("unLink");
}
/**
 * 获取内容
 *
 * @method getContent
 * @param void
 * @return {string} 返回Html内容
 * @for EditorView
 */
function fEditorViewGetContent() {
    //如果当前是源码模式，则获取源码输入框的内容
    if(this.editMode=="source"){
        return this.editorSourceTextarea.value;
    }else if(this.editMode=="text"){
        //如果当前是纯文本模式，则获取纯文本输入框的内容
        return this.editorTextTextarea.value;
    }else{
        //获取Html编辑框的内容
        return this.editor.getContent();
    }
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
function fEditorViewSetDefStyle(oParams) {
    this.editor.setDefStyle(oParams);
}
/**
 * 获取带有默认配置样式（行高、字号、字体颜色等）的内容
 *
 * @method getFinalContent
 * @param void
 * @return {string} 返回Html内容
 * @for EditorView
 */
function fEditorViewGetFinalContent() {
    //如果是源码或纯文本编辑模式，先更新html编辑框的内容
    if(this.editMode=="source"){
        this.editor.setContent(editorSourceTextarea.value);
    }else if(this.editMode=="text"){
        this.editor.setContent(editorTextTextarea.value);
    }
    return this.editor.getFinalContent();
}