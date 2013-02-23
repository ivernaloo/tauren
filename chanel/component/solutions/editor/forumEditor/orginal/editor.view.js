/*******************************************************************************
 * NetEase New Mail System 2010 Version. * * File Name: editor.view.js * Written
 * by: yhzheng * * Version 1.0 (MSIE 6.0 above,Firefox2.0,Netscape.) * Created
 * Date: 2010-08-30 * Copyright��1997-2010 NetEase.com Inc. All rights reserved. *
 ******************************************************************************/
/**
 * ���ļ�Ϊ�������伫�ٷ��3.5���HTML�༭��ģ����ֲ� ����ע��ʹ��YUI
 * Doc{http://developer.yahoo.com/yui/yuidoc/}��׼��
 * 
 * @module EditorView
 * @requires Editor
 * @version 1.0
 * @author yhzheng
 * @support IE6.0+/Firefox/Chrome/Safari/Opera 
 */

/**
 * EditorViewģ������
 * 
 * @class EditorView
 * @constructor
 * @return {void}
 */

function EditorView(oSettings) {
	
	//�����
	this.editorDiv; // HTML�༭�����ڵ�div
	this.toolbarDiv; // ����������div
	this.basicToolbarDiv; // �򵥹��ܹ�����div
	this.fullToolbarDiv; // ȫ�����ܹ�����div
	this.codeToolbarDiv; // Դ��༭ģʽdiv
	this.editorAreaDiv; // �༭��div
	this.editorIframe; // �༭��iframe
	this.editorSourceTextarea; // Դ��༭textarea
	this.editorTextTextarea; // ���ı��༭textarea
	this.editMode// "basic" ��ʾ�򵥹��ܱ༭ģʽ��"full"��ʾȫ�����ܱ༭ģʽ,"source"��ʾԴ��༭ģʽ��"text"��ʾ���ı��༭ģʽ,"hide"��ʾ���ع�����ģʽ
	this.editModeTmp;//��ʱ����༭ģʽ���ָ���htmlģʽʱ��Ҫ�õ�
	this.editModeTmpForToogle;//��������/չ��������ʱ����༭ģʽ
	this.popupDiv; // ����div
	this.editor; // Editorʵ��
	this.format; // Formatʵ��
	this.query; // Queryʵ��
	this.observer; // Observerʵ��
	this.history;// Historyʵ��
	this.range; // ������IE�±༭��ʧȥ����ʱ����ѡ�����򣬲��ڱ༭���ý����ǻָ�ѡ������
	this.img; // ���ڱ༭��ͼƬ
	this.tableWin;//���ڻ��������Ի�������
	this.listener={};//�������б�
	this.editorDivClass;//�۵�������ʱ������class
	this.historyTimer;//��ʷ��¼��ʱ��
	this.toolbar;//����������
	this.tablePreviewDiv;//������Ԥ��div
	this.debug=false;//�Ƿ��ǵ���״̬����Ҫ���ڿ���log
	this.system; // �洢������汾��this.system.ie/firefox/chrome/opera/safari,���
	// �������IE�ģ�this.system.ie��ֵ��������İ汾�ţ�!this.system.ie��ʾ��IE�����
    this.menuContainer;//�˵�����
	this.popupMenus = {}; // �����˵�
	this.settings = { // ��ʼ���༭����ͼ������
		editorDiv : null,//HTML�༭�����ڵ�div����id
		openToolbar:true,//�Ƿ�չ��������
		tabindex:0,//�༭����ʼtabindex��ֵ
		html:null,//��ʼ��body�ڵ�html����
		fontsize:null,//�༭����Ĭ���ֺ�
		fontname:null,//�༭����Ĭ���ֺ�
		forecolor:null,//�༭����Ĭ��������ɫ
		customView:null,//�Զ���༭�����
		menuContainer:null//�˵�����
	};

	//��������ť��ʼ����Ϣ����ʼ����ɾ��
	this.toolbarItems = {
			"undo" : {
				func : "format",
				className:"g-editor-btninfo-redo",
				title:"����"
			},
			"redo" : {
				func : "format",
				className:"g-editor-btninfo-do",
				title:"����"
			},
			"cut" : {
				func : "format",
				className:"g-editor-btninfo-cut",
				title:"����"
			},
			"copy" : {
				func : "format",
				className:"g-editor-btninfo-copy",
				title:"����"
			},
			"paste" : {
				func : "format",
				className:"g-editor-btninfo-paste",
				title:"ճ��"
			},
			"fontname" : {
				func : "popup",
				className:"g-editor-btninfo-ffm2",
				title:"����"
			},
			"fontnameFull" : {
				func : "popup",
				className:"g-editor-btninfo-ffm",
				title:"����"
			},
			"fontsize" : {
				func : "popup",
				className:"g-editor-btninfo-fsz",
				title:"ѡ�������С"
			},
			"fontsizeFull" : {
				func : "popup",
				className:"g-editor-btninfo-fsz2",
				title:"ѡ�������С"
			},
			"justify" : {
				func : "popup",
				className:"g-editor-btninfo-align",
				title:"ѡ����뷽ʽ"
			},
			"list" : {
				func : "popup",
				className:"g-editor-btninfo-lst",
				title:"�����б�"
			},
			"indent" : {
				func : "popup",
				className:"g-editor-btninfo-tid",
				title:"��������"
			},
			"lineheight" : {
				func : "popup",
				className:"g-editor-btninfo-lht",
				title:"�����и�"
			},
			"bold" : {
				func : "format",
				className:"g-editor-btninfo-fwt",
				title:"�Ӵ�"
			},
			"italic" : {
				func : "format",
				className:"g-editor-btninfo-fst",
				title:"б��"
			},
			"underline" : {
				func : "format",
				className:"g-editor-btninfo-udl",
				title:"�»���"
			},
			"forecolor" : {
				func : "popup",
				className:"g-editor-btninfo-fcl",
				title:"ѡ��������ɫ"
			},
			"backcolor" : {
				func : "popup",
				className:" g-editor-btninfo-bgc",
				title:"ѡ�����屳��"
			},
			"insertHorizontalRule" : {
				func : "format",
				className:"g-editor-btninfo-line",
				title:"�������"
			},
			"insertTime" : {
				func : "format",
				className:"g-editor-btninfo-date",
				title:"�������"
			},
			"insertTable" : {
				func : "custom",
				className:"g-editor-btninfo-table",
				title:"��ӱ��"
			},
			"removeFormat" : {
				func : "format",
				className:"g-editor-btninfo-clear",
				title:"������ʽ"
			},
			"link" : {
				func : "custom",
				className:"g-editor-btninfo-uri",
				title:"����/ɾ������"
			},
			"bbsimage" : {
				func : "custom",
				className:"g-editor-btninfo-ipc",
				title:"���ͼƬ"
			},
			"bbsvideo" : {
				func : "custom",
				className:"g-editor-btninfo-bbsvideo",
				title:"���Ӱ��"
			},
			"bbsattach" : {
				func : "custom",
				className:"g-editor-btninfo-bbsattach",
				title:"��Ӹ���"
			},
			"bbshtml" : {
				func : "custom",
				className:"g-editor-btninfo-bbshtml",
				title:"���HTML"
			},
			"bbsformat" : {
				func : "custom",
				className:"g-editor-btninfo-bbsformat",
				title:"�Զ��Ű�"
			},
			"bbstcard" : {
				func : "custom",
				className:"g-editor-btninfo-bbstcard",
				title:"����΢����Ƭ"
			},
			"bbs9box" : {
				func : "custom",
				className:"g-editor-btninfo-bbs9box",
				title:"���������־"
			},
			"image" : {
				func : "custom",
				className:"g-editor-btninfo-ipc",
				title:"���ͼƬ"
			},
			"capture" : {
				func : "custom",
				className:"g-editor-btninfo-scs",
				title:"��ͼ"
			},
			"portrait" : {
				func : "custom",
				className:"g-editor-btninfo-face",
				title:"��ӱ���"
			},
			"letter" : {
				func : "custom",
				className:"g-editor-btninfo-paper",
				title:"�����ֽ"
			},
			"sign" : {
				func : "custom",
				className:"g-editor-btninfo-sign",
				title:"���ǩ��"
			},
			"source" : {
				func : "editMode",
				className:"g-editor-btninfo-code",
				title:"�༭HTMLԴ��"
			},
			"basic" : {
				func : "editMode",
				className:"g-editor-btninfo-basic",
				title:"�л����򵥹���"
			},
			"full":{
				func : "editMode",
				className:"g-editor-btninfo-full",
				title:"�л���ȫ������"
			},
			"fullSource" : {
				func : "editMode",
				className:"g-editor-btninfo-code",
				title:"���ؿ��ӻ��༭"
			}
	}
	
	//�෽��
	this.log = fEditorViewLog; // �����־
	this.getNode = fEditorViewGetNode; // ����id��ȡԪ��
	this.getChildren = fEditorViewGetChildren; // ��ȡָ����ǩ���͵ĺ��ӽڵ㼯
	this.extend = fEditorViewExtend; // ��չ����
	this.initHtml = fEditorViewInitHtml;// ��ʼ��htmlҳ��
	this.initToolbar = fEditorViewInitToolbar; // ��ʼ���༭����ͼ������
	this.init = fEditorViewInit; // ��ʼ���༭����ͼ
	this.changeToolbar = fEditorViewChangeToolbar; // �ı乤����״̬
	this.getEvent = fEditorViewGetEvent; // ��ȡ�¼�����
	this.show = fEditorViewShow; // ��ʾԪ��
	this.hide = fEditorViewHide; // ����Ԫ��
	this.toogle = fEditorViewToggle; // ��ʾ/����Ԫ��
	this.addClass = fEditorViewAddClass; // ���class
	this.removeClass = fEditorViewRemoveClass; // ɾ��class
	this.stopEvent = fEditorViewStopEvent; // ֹͣ�¼�ð��
	this.setDragable=fEditorViewSetDragable;//ʹ��������϶�
	this.msgBox=fEditorViewMsgBox;//ϵͳ������
	this.getStyle=fEditorViewGetStyle;//��ȡָ��Ԫ�ص���ʽ
	this.getLeft = fEditorViewGetElementLeft; // ��ȡԪ�غͱ༭����߿�ľ���
	this.getTop = fEditorViewGetElementTop; // ��ȡԪ�غͱ༭���ϱ߿�ľ���
	
	//������
	this.selectMenu=fEditorViewSelectMenu;//Ϊ�����˵�ѡ�й�������ı�����ʽ
	this.delayPopup = fEditorViewDelayPopup; // ��ʱ����
	this.popup = fEditorViewPopup; // ������
	this.hidePopup = fEditorViewHidePopup; // ���ص�����
	this.popupJustifyMenu = fEditorViewPopupJustifyMenu;// �������뷽ʽ�����б�
	this.popupListMenu = fEditorViewPopupListMenu;// �����б�ʽ�����б�
	this.popupIndentMenu = fEditorViewPopupIndentMenu;// ��������/ͻ�������б�
	this.popupFontsizeMenu = fEditorViewPopupFontsizeMenu;// �����ֺ������б�
	this.popupFontnameMenu = fEditorViewPopupFontnameMenu;// �������������б�
	this.popupForecolorMenu = fEditorViewPopupForecolorMenu;// ����ǰ��ɫ�����б�
	this.popupBackcolorMenu = fEditorViewPopupBackcolorMenu;// ��������ɫ�����б�
	this.popupLineheightMenu = fEditorViewPopupLineheightMenu;// �����и������б�
	this.popupInsertLinkWin = fEditorViewPopupInsertLinkWin;// ����������Ӵ���
	this.popupInsertTableWin = fEditorViewPopupInsertTableWin;// ������ӱ�񴰿�
	this.popupImgToolbar = fEditorViewPopupImgToolbar; // ����ͼƬ�༭��
	
	this.initTableDiv=fEditorViewInitTableDiv;//��ʼ��������Ի���
	this.validTableInput=fEditorViewValidTableInput;//У����ӱ�����������
	this.insertTable=fEditorViewInsertTable;//������
	this.refreshPreviewTable=fEditorViewRefreshPreviewTable;//ˢ�±��Ի����е�Ԥ��
	this.insertTableMenuClick=fEditorViewInsertTableMenuClick;//���������Ի���ĵ����¼�
	this.insertTableMenuChange=fEditorViewInsertTableMenuChange;//���������Ի��������仯�¼�
	this.editImage = fEditorViewEditImage; // �༭ͼƬ
	this.changeEditMode=fEditorViewChangeEditMode;//�л����ı�/html�༭ģʽ
	this.doClick = fEditorViewDoClick; // ������굥��
	this.clickList = fEditorViewClickList; // ���������б���
	this.doOnmouseover = fEditorViewDoOnmouseover; // ������꾭���¼�
	this.doOnmouseout = fEditorViewDoOnmouseout; // ��������Ƴ��¼�
	this.startHistoryTimer=fEditorViewStartHistoryTimer;//��ʼ��ʷ��¼��ʱ��
	this.stopHistoryTimer=fEditorViewStopHistoryTimer;//ֹͣ��ʷ��¼��ʱ��
	this.addListener=fEditorViewAddListener;//��Ӽ�����
	this.removeListener=fEditorViewRemoveListener;//�Ƴ�������
	this.notifyListener=fEditorViewNotifyListener;//֪ͨ/����������
	
	//�����ṩ��compose����Ľӿ�
	this.get=fEditorViewGet;//��ȡ�������ڶ��ο���
	this.set=fEditorViewSet;//���ö������ڶ��ο���
	this.isTextMode=fEditorViewIsTextMode;//�Ƿ��Ǵ��ı�ģʽ
	this.toogleToolbar=fEditorViewToogleToolbar;//����/��ʾ������
	this.getInitHtml=fEditorViewGetInitHtml;//��ȡ��ʼ���༭���html�ַ���
	this.focus=fEditorViewFocus;//�۽�
	this.insert=fEditorViewInsert;//����ͼƬ����html
	this.del=fEditorViewDelete;//ɾ��Ԫ��
	this.getSelectedText=fEditorViewGetSelectedText;//��ȡ���ѡ���ı�
	this.execFormat=fEditorViewExecFormat;//ִ�и�ʽ����
	this.deleteLink=fEditorViewDeleteLink;//ɾ������
	this.getContent=fEditorViewGetContent;//��ȡ�༭������
	this.setDefStyle=fEditorViewSetDefStyle;//���ñ༭��Ĭ����ʽ
	this.getFinalContent=fEditorViewGetFinalContent;//��ȡ����Ĭ��������ʽ���иߡ��ֺš�������ɫ�ȣ�������
	
	try {
		this.init(oSettings); // ��ʼ���༭����ͼ
		this.initSuccess=true;
	} catch (e) {
		this.log(e);
		this.initSuccess=false;
	}
}
/**
 * ��ӡ��־
 * 
 * @method log
 * @param {string}sLog��־��Ϣ
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
 * ����id��ȡԪ��
 * 
 * @method getNode(sSelector[,oObject])
 * @param {string}sSelector Ԫ��ID����ѡ���ַ���,"#"��ͷ��ʾid����.����ͷ��ʾ�������ո��ʾ������󱲣�
 *                �硰div.className input����ʾ������className��div�µ�����inputԪ��
 * @param {object}oObject �ĵ��������domԪ��(��ѡ)
 * @return {object} ƥ��Ԫ��
 * @for EditorView
 */
function fEditorViewGetNode(sSelector,oObject) {
	//�ڲ������������������ط���������Ԫ������
	function _fFilter(aEls,sKey,sValue){
		var nLen=aEls.length;
		var aNodes=[];
		for(var i=0;i<nLen;i++){
			// ��������Ƿ�ƥ��
			if(sKey="class"){
				var sClass=aEls[i].className;
				if(new RegExp(sValue+"$").test(sClass)||new RegExp(sValue+" ").test(sClass)){
					aNodes.push(aEls[i]);
				}
			}else{
				// ��������Ƿ�ƥ��
				if(aEls[i].getAttribute(sKey)==oFilter["value"]){
					 aNodes.push(aEls[i]);
				}
			}
		}
		return aNodes.length>0?aNodes:null;
	}
	// ����ڶ�����������dom�ڵ㣬��˵�����ǲ㼶ѡ�����������ǲ㼶ѡ�����ĵ�һ��
	if(!oObject||oObject.nodeType==9){
		// ��ȡѡ�����ĵ�����
		var oDoc=oObject||document;
		// �����һ���������ַ�����������һ������
		if(typeof sSelector == "string"){
			var nIndex;
			// ����ǲ㼶ѡ��
			if((nIndex=sSelector.indexOf(" "))>-1){
				//��һ��ѡ��
				var sSel1=sSelector.substring(0,nIndex);
				// ��ȡ���Ƚڵ�
				var oAncestor=arguments.callee(sSel1,oDoc);
				if(oAncestor){
					//������Ƚڵ���ڣ������ѡ������ڵ�
				    var sSel2=sSelector.substring(nIndex+1);
				    //���oAncestor�����飬����б���ѡ��
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
	    		//����Ԫ��idѡ��ڵ�
	    		return oDoc.getElementById(sSelector.substring(1));
	    	}else if(sSelector.charAt(0)=="."){
	    		//��������ѡ��ڵ�
	    		var aChildren=oDoc.getElementsByTagName("*");
				return _fFilter(aChildren,"class",sSelector.substring(1));
	    	}else if(/^[a-z]+$/i.test(sSelector)){
	    		//���ݱ�ǩ��ѡ��ڵ�
	    	    return oDoc.getElementsByTagName(sSelector);
	    	}
		}else if(sSelector.nodeType){
			// �����һ�������ǽڵ���ֱ�ӷ���
			return sSelector;
		}
	}else{
		// ����ڶ���������dom�ڵ㣬˵���ǲ㼶ѡ����,ѡ��Χ�ǲ����ڵ������ڵ�
		var sTag;
		var sClass;
		var nIndex=sSelector.indexOf(".");
		// ���ѡ�����������ĸ��ͷ
		if(/^[a-z]/i.test(sSelector)){
			//���������
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
		// �������Ϊ�գ���ֱ�ӷ���
		if(!sClass){
			return aChildren;
		}
		// ����ƥ���Ԫ�����飬���û��ƥ���Ԫ�أ��򷵻�null
		return _fFilter(aChildren,"class",sClass);
	}
}
/**
 * ��ȡָ����ǩ���͵ĺ��ӽڵ㼯
 * 
 * @method getChildren
 * @param {object}oEl �����ڵ�
 * @param {string}sTag ������ǩ��
 * @return {array} ƥ��Ԫ�ؼ������û��ƥ���Ԫ�أ��򷵻�null
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
 * ��չ����
 * 
 * @method extend
 * @param {object}oTarget��չ����
 * @param {object}oSource��չԴ
 * @return {void}
 * @for Editorview
 */
function fEditorViewExtend(oTarget, oSource) {
	for (var property in oSource) {
		oTarget[property] = oSource[property];
	}
}
/**
 * ��ʼ��htmlҳ��
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
						<span><a href="javascript:void(0)" class="g-editor-btninfo g-editor-btninfo-fwt" title="�Ӵ�">�Ӵ�</a> </span>\
					</div>\
					<div class="g-editor-btn" func="format" format="italic">\
						<span><a href="javascript:void(0)" class="g-editor-btninfo g-editor-btninfo-fst" title="б��">б��</a></span>\
					</div>\
					<div class="g-editor-btn" func="format" format="underline">\
						<span><a href="javascript:void(0)" class="g-editor-btninfo g-editor-btninfo-udl" title="�»���">�»���</a></span>\
					</div>\
					<div class="g-editor-btn" func="popup" popup="fontsize">\
						<span><a href="javascript:void(0)" class="g-editor-btninfo g-editor-btninfo-fsz" title="ѡ�������С">ѡ�������С</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="popup" popup="forecolor">\
						<span><a href="javascript:void(0)"\
							class="g-editor-btninfo g-editor-btninfo-fcl" title="ѡ��������ɫ">ѡ��������ɫ</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="popup" popup="backcolor">\
						<span><a href="javascript:void(0)"\
							class="g-editor-btninfo g-editor-btninfo-bgc" title="ѡ�����屳��">ѡ�����屳��</a>\
						</span>\
					</div>\
					<div class="g-editor-spln g-editor-spln-short"></div>\
					<div class="g-editor-btn" func="popup" popup="justify">\
						<span><a href="javascript:void(0)"\
							class="g-editor-btninfo g-editor-btninfo-align" title="ѡ����뷽ʽ">ѡ����뷽ʽ</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="popup" popup="list">\
						<span><a href="javascript:void(0)"\
							class="g-editor-btninfo g-editor-btninfo-lst" title="�����б�">�����б�</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="popup" popup="indent">\
						<span><a href="javascript:void(0)"\
							class="g-editor-btninfo g-editor-btninfo-tid" title="��������">��������</a>\
						</span>\
					</div>\
					<div class="g-editor-spln g-editor-spln-short"></div>\
					<div class="g-editor-btn" func="custom" custom="image">\
						<span><a href="javascript:fGoto()"\
							class="g-editor-btninfo g-editor-btninfo-ipc" title="���ͼƬ">���ͼƬ</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="custom" custom="capture">\
						<span><a href="javascript:fGoto()"\
							class="g-editor-btninfo g-editor-btninfo-scs" title="��ͼ">��ͼ</a> </span>\
					</div>\
					<div class="g-editor-btn" func="custom" custom="portrait">\
						<span><a href="javascript:fGoto()"\
							class="g-editor-btninfo g-editor-btninfo-face" title="��ӱ���">��ӱ���</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="custom" custom="letter">\
						<span><a href="javascript:fGoto()"\
							class="g-editor-btninfo g-editor-btninfo-paper" title="�����ֽ">�����ֽ</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="format" format="insertTime">\
						<span><a href="javascript:fGoto()"  \
							class="g-editor-btninfo g-editor-btninfo-date" title="�������">����</a>\
						</span>\
					</div>\
					<div class="g-editor-btn" func="custom" custom="sign">\
						<span><a href="javascript:fGoto()"\
							class="g-editor-btninfo g-editor-btninfo-sign" title="���ǩ��">ǩ��</a>\
						</span>\
					</div>\
                    <div class="g-editor-toolgrp  g-editor-tgrp6">\
						<div class="g-editor-btn g-editor-btn-arrow " func="editMode" editMode="full">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-full" title="�л���ȫ������">�л���ȫ������</a>\
							</span>\
						</div>\
                    </div>\
				</div>\
				<div class="g-editor-tbar-full">\
					<div class="g-editor-toolgrp g-editor-tgrp1">\
						<div class="g-editor-btn " func="format" format="undo">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-redo" title="����">����</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format" format="redo">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-do" title="����">����</a> </span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp g-editor-tgrp2">\
						<div class="g-editor-btn" func="format" format="cut">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-cut" title="����">����</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format" format="copy">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-copy" title="����">����</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format" format="paste">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-paste" title="ճ��">ճ��</a>\
							</span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp  g-editor-tgrp3">\
						<div class="g-editor-btn-selectgrp">\
							<div class="g-editor-btn g-editor-btn-select" title="ѡ������" func="popup" popup="fontname">\
								<span><b class="g-editor-btninfo g-editor-btninfo-ffm">����</b>\
								</span>\
							</div>\
							<div class="g-editor-btn g-editor-btn-select" title="ѡ�������С" func="popup" popup="fontsize">\
								<span><b href="javascript:void(0)"\
									class="g-editor-btninfo g-editor-btninfo-fsz2">�ֺ�</b></span>\
							</div>\
						</div>\
						<div class="g-editor-btn" func="popup" popup="justify">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-align" title="ѡ����뷽ʽ">ѡ����뷽ʽ</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="popup" popup="list">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-lst" title="�����б�">�����б�</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="popup" popup="indent">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-tid" title="��������">��������</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="popup" popup="lineheight">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-lht" title="�����и�">�����и�</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format" format="bold">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-fwt" title="�Ӵ�">�Ӵ�</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format" format="italic">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-fst" title="б��">б��</a>\
							</span>\
						</div>\
						<div class="g-editor-btn " func="format" format="underline">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-udl" title="�»���">�»���</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="popup" popup="forecolor">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-fcl" title="ѡ��������ɫ">ѡ��������ɫ</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="popup" popup="backcolor">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-bgc" title="ѡ�����屳��">ѡ�����屳��</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format"\
							format="insertHorizontalRule">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-line" title="�������">�������</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="custom" custom="insertTable">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-table" title="��ӱ��">��ӱ��</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format" format="removeFormat">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-clear" title="������ʽ">������ʽ</a>\
							</span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp  g-editor-tgrp4">\
						<div class="g-editor-btn" func="custom" custom="link">\
							<span><a href="javascript:fGoto()"\
								class="g-editor-btninfo g-editor-btninfo-uri" title="����/ɾ������">����/ɾ������</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="custom" custom="image">\
							<span><a href="javascript:fGoto()"\
								class="g-editor-btninfo g-editor-btninfo-ipc" title="���ͼƬ">���ͼƬ</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="custom" custom="capture">\
							<span><a href="javascript:fGoto()"\
								class="g-editor-btninfo g-editor-btninfo-scs" title="��ͼ">��ͼ</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="custom" custom="portrait">\
							<span><a href="javascript:fGoto()"\
								class="g-editor-btninfo g-editor-btninfo-face" title="��ӱ���">��ӱ���</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="custom" custom="letter">\
							<span><a href="javascript:fGoto()"\
								class="g-editor-btninfo g-editor-btninfo-paper" title="�����ֽ">��ֽ</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="format" format="insertTime">\
							<span><a href="javascript:fGoto()"\
								class="g-editor-btninfo g-editor-btninfo-date"\
								title="�������">����</a>\
							</span>\
						</div>\
						<div class="g-editor-btn" func="custom" custom="sign">\
							<span><a href="javascript:fGoto()"\
								class="g-editor-btninfo g-editor-btninfo-sign" title="���ǩ��">ǩ��</a>\
							</span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp  g-editor-tgrp5">\
						<div class="g-editor-btn g-editor-btn-code" func="editMode" editMode="source">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-code" title="�༭HTMLԴ��">�༭HTMLԴ��</a>\
							</span>\
						</div>\
					</div>\
                    <div class="g-editor-toolgrp  g-editor-tgrp6">\
						<div class="g-editor-btn g-editor-btn-arrow" func="editMode" editMode="basic">\
							<span><a href="javascript:void(0)"\
								class="g-editor-btninfo g-editor-btninfo-basic" title="�л����򵥹���">�򵥹���</a>\
							</span>\
						</div>\
                    </div>\
				</div>\
				<div class="g-editor-tbar-code">\
					<div class="g-editor-toolgrp g-editor-tgrp1">\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-redo"\
								title="Դ��ģʽ�²���ʹ�øù���">����</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-do"\
								title="Դ��ģʽ�²���ʹ�øù���">����</a></span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp g-editor-tgrp2">\
						<div class="g-editor-btn" func="format" format="cut">\
							<span><a class="g-editor-btninfo g-editor-btninfo-cut"\
								title="Դ��ģʽ�²���ʹ�øù���">����</a> </span>\
						</div>\
						<div class="g-editor-btn" func="format" format="copy">\
							<span><a class="g-editor-btninfo g-editor-btninfo-copy"\
								title="Դ��ģʽ�²���ʹ�øù���">����</a> </span>\
						</div>\
						<div class="g-editor-btn" func="format" format="paste">\
							<span><a class="g-editor-btninfo g-editor-btninfo-paste"\
								title="Դ��ģʽ�²���ʹ�øù���">ճ��</a> </span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp  g-editor-tgrp3">\
						<div class="g-editor-btn-selectgrp">\
							<div class="g-editor-btn g-editor-btn-select"\
								title="Դ��ģʽ�²���ʹ�øù���">\
								<span><b class="g-editor-btninfo g-editor-btninfo-ffm">����</b>\
								</span>\
							</div>\
							<div class="g-editor-btn g-editor-btn-select"\
								title="Դ��ģʽ�²���ʹ�øù���">\
								<span><b href="javascript:void(0)"\
									class="g-editor-btninfo g-editor-btninfo-fsz2">�ֺ�</b></span>\
							</div>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-align"\
								title="Դ��ģʽ�²���ʹ�øù���">���뷽ʽ</a></span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-lst"\
								title="Դ��ģʽ�²���ʹ�øù���">�б�����</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-tid"\
								title="Դ��ģʽ�²���ʹ�øù���">����</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-lht"\
								title="Դ��ģʽ�²���ʹ�øù���">�и�</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-fwt"\
								title="Դ��ģʽ�²���ʹ�øù���">�Ӵ�</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-fst"\
								title="Դ��ģʽ�²���ʹ�øù���">��б</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-udl"\
								title="Դ��ģʽ�²���ʹ�øù���">�»���</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-fcl"\
								title="Դ��ģʽ�²���ʹ�øù���">��ɫ</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-bgc"\
								title="Դ��ģʽ�²���ʹ�øù���">����</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-line"\
								title="Դ��ģʽ�²���ʹ�øù���">�������</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-table"\
								title="Դ��ģʽ�²���ʹ�øù���">���</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-clear"\
								title="Դ��ģʽ�²���ʹ�øù���">������ʽ</a> </span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp  g-editor-tgrp4">\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-uri"\
								title="Դ��ģʽ�²���ʹ�øù���">����/ɾ������</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-ipc"\
								title="Դ��ģʽ�²���ʹ�øù���">����ͼƬ</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-scs"\
								title="Դ��ģʽ�²���ʹ�øù���">��ͼ</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-face"\
								title="Դ��ģʽ�²���ʹ�øù���">����</a> </span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-paper"\
								title="Դ��ģʽ�²���ʹ�øù���">��ֽ</a> </span>\
						</div>\
                        <div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-date"\
							title="Դ��ģʽ�²���ʹ�øù���">����</a>\
							</span>\
						</div>\
						<div class="g-editor-btn">\
							<span><a class="g-editor-btninfo g-editor-btninfo-sign"\
								title="Դ��ģʽ�²���ʹ�øù���">ǩ��</a> </span>\
						</div>\
					</div>\
					<div class="g-editor-spln g-editor-spln-long"></div>\
					<div class="g-editor-toolgrp  g-editor-tgrp5">\
						<div class="g-editor-btn g-editor-btn-code g-editor-btn-on" func="editMode" editMode="full">\
							<span><a href="javascript:void(0)" hideFocus="true"\
								class="g-editor-btninfo g-editor-btninfo-code" title="���ؿ��ӻ��༭">���ؿ��ӻ��༭</a>\
							</span>\
						</div>\
					</div>\
					<div class="g-editor-toolgrp  g-editor-tgrp6">\
						<div class="g-editor-btn g-editor-btn-arrow">\
							<span><a class="g-editor-btninfo g-editor-btninfo-basic"\
								title="Դ��ģʽ�²���ʹ�øù���">ȫ������</a></span>\
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
 * ��ʼ��������
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
		// Ĭ�����ع�������ť
		that.editorDiv.className = "g-editor g-editor-hide";
		that.editMode = "hide";
	} else {
		// Ĭ����ʾ�򵥹�������ť
		that.editorDiv.className = "g-editor g-editor-basic";
		that.editMode = "basic"
	}
	var oToolbarSettings = that.settings.toolbar;
	//����й��ڹ����������ã������ó�ʼ��������
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
					oLink.title="Դ��ģʽ�²���ʹ�øù���";
				}else{
					oItemDiv.setAttribute("func", oItem["func"]);
					oItemDiv.setAttribute(oItem["func"], sName);
					oLink.title=oItem["title"];
				}
				if((sMode=="full"||sMode=="source")&&(sName=="fontsize"||sName=="fontname")){
					oItemDiv.className ="g-editor-btn g-editor-btn-select";
					oLink.innerHTML=sName=="fontname"?"����":"�ֺ�";
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
		//�򵥹���ģʽ������
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
		//ȫ������ģʽ������
		if (oToolbarSettings["full"]) {
			var oFullTBDiv = that.fullToolbarDiv=oDivTmp.cloneNode(true);
			oFullTBDiv.className = "g-editor-tbar-full";
			var oFullTB = oToolbarSettings["full"];
			var oFullWrapDv=oDivTmp.cloneNode(true);
			var sWidth=(that.system.ie?oToolbarSettings.fullTBWidth.ie:oToolbarSettings.fullTBWidth.other||(oFullTB.length/2+1)*30)+"px";//�����������ŷ�����ʱ��pxֵ��2010-11-26 gdw
			oFullWrapDv.style.width=sWidth;
			oFullWrapDv.style.cssFloat="left";//FF
			oFullWrapDv.style.styleFloat="left";
			oFullTBDiv.appendChild(oFullWrapDv);
			//����Ƿ���Դ��༭ģʽ
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
								if(sName == "paste")oItemDiv.getElementsByTagName("a")[0].innerHTML="ճ��";
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
			//Դ��ģʽ������
			if (bHasSource) {
				var oSourceTBDiv = that.codeToolbarDiv = oDivTmp.cloneNode(true);
				oSourceTBDiv.className = "g-editor-tbar-code";
				//����Դ��ģʽ��������ȫ������ģʽ�������ṹһ�£�����ֱ�Ӹ���
				oSourceTBDiv.innerHTML=oFullTBDiv.innerHTML;
				//���⴦��
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
						aDvs[i].getElementsByTagName("a")[0].title="Դ��ģʽ�²���ʹ�øù���";
					}
				}
				that.toolbarDiv.appendChild(oSourceTBDiv);
			}
		}
	} else {
		// ������Ĭ�����ó�ʼ��������
		var aEls = that.getChildren(that.toolbarDiv, "div");
		that.basicToolbarDiv = aEls[0];
		that.fullToolbarDiv = aEls[1];
		that.codeToolbarDiv = aEls[2];
	}
	//ɾ����ʼ������
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
	// ��ť�Ĺ�����������磺format����ʽ������custom���Զ��壩��
	var sFunc = "";
	// ��ť�Ĺ��������磬bold���Ӵ֣�
	var sName = ""
	var oDiv = "";
	var sToolbarName;
	// Ϊ���б༭����ť����¼�����
	for (var key in oDivs) {
		var length = oDivs[key].length;
		for (var j = 0; j < length; j++) {
			oDiv = oDivs[key][j];
			// Ϊ���򵥹��ܡ��͡�ȫ�����ܡ���������ť�����꾭����ʽ
			if (oDiv.className.indexOf("g-editor-btn") > -1 && key != "source") {
				(function(oDiv) {
					// ���onmouseover�����¼�
					that.observer.add({
								"el" : oDiv,
								"eventType" : "mouseover",
								"fn" : that.doOnmouseover,
								"object" : that,
								"params" : [oDiv]
							});
					// ���onmouseout�����¼�
					that.observer.add({
								"el" : oDiv,
								"eventType" : "mouseout",
								"fn" : that.doOnmouseout,
								"object" : that,
								"params" : [oDiv]
							});
				})(oDiv)
			}
			// Ϊ��������ť��ӵ���¼�
			sFunc = oDiv.getAttribute("func");
			sName = oDiv.getAttribute(sFunc);
			if (sFunc) {
				// ����Ƿ�IE������������ؼ��а������ť
				if ((sName == "cut" || sName == "copy" || sName == "paste") && !that.system.ie) {
					var oParent = oDiv.parentNode;
					if (oParent.className.indexOf("g-editor-toolgrp g-editor-tgrp2") > -1) {
						//�����������û�����أ�������
						if (oParent.style.display != "none") {
							that.hide(oDiv.parentNode);
							// Ѱ�����ڵķָ���div
							var oNode = oDiv.parentNode.nextSibling;
							while (!/div/i.test(oNode.nodeName)) {
								oNode = oNode.nextSibling;
							}
							// ���طָ���
							that.hide(oNode);
						}
					} else {
						that.hide(oDiv);
					}
				}
				// zyh���ó���������ť��ʽ
				if (sName == "undo") {
					oDiv.getElementsByTagName("a")[0].className = "g-editor-btninfo g-editor-btninfo-redo";
				} else if (sName == "redo") {
					oDiv.getElementsByTagName("a")[0].className = "g-editor-btninfo g-editor-btninfo-do";
				}
				// ���湤��������
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
				// Ϊ�༭����ť���onclick�¼�����
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
			// ���ñ�ǩa��hidefocus="true"�����������������ק����ʱ����һ�����߿�
			var oLink = oDiv.getElementsByTagName("a");
			if (oLink && oLink[0]) {
				oLink[0].hideFocus = true;
			}
		}
	}

	// ��Ӽ�����
	var oObserver=that.observer;
	// ���û�����༭��ʱ�����ݹ��λ�����ֵ�״̬���Ĺ�����
	oObserver.add({
		        "el" : that.editor.doc,
				"eventType" : "click",
				"fn" : that.changeToolbar,
				"object":that
			});
	//���û��������ʱ�����ݹ��λ�����ֵ�״̬���Ĺ�����
	oObserver.add({
				"el" : that.editor.doc,
				"eventType" : "keyup",
				"fn" : that.changeToolbar,
				"object":that
			});
	// ���û�����༭���ڵ�ͼƬʱ������ͼƬ�༭������
	oObserver.add({
		        "el" : that.editor.doc,
				"eventType" : "mouseup",
				"fn" : that.popupImgToolbar,
				"object":that
			});
}
/**
 * ��ʼ���༭����ͼ
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
		// ʹ��Ĭ�����ó�ʼ���༭����ͼ��ֻ�贫��༭������Ԫ�ػ�����id�������Ǵ���id
		that.editorDiv = that.getNode(oSettings);
	} else if (typeof oSettings == "object") {
		// ʹ��Ĭ�����ó�ʼ���༭����ͼ��ֻ�贫��༭������Ԫ�ػ�����id�������Ǵ���Ԫ��
		if (oSettings.nodeName) {
			that.editorDiv = oSettings;
		} else {
			// ʹ���Զ������ó�ʼ���༭����ͼ
			that.extend(that.settings, oSettings);
			that.editorDiv=that.getNode(oSettings.editorDiv);
			that.html=oSettings.html;
		}
	}
	that.menuContainer=oSettings.menuContainer||document.body;
	// ��ʼ���������
	that.initHtml();
	var aEls=that.getChildren(that.editorDiv,"div");
	that.toolbarDiv =aEls[0];
	that.editorAreaDiv = aEls[1];
	that.editorIframe = that.editorAreaDiv.getElementsByTagName("iframe")[0];
	aEls=that.editorAreaDiv.getElementsByTagName("textarea");
	that.editorSourceTextarea = aEls[0];
	that.editorTextTextarea = aEls[1];
	var oOwnSettings=that.settings;
	// ��ʼ���༭��
	var oEditor=that.editor = new Editor({
				editorIframe : that.editorIframe,
				editorSourceTextArea : that.editorSourceTextarea,
				editorTextTextArea : that.editorTextTextarea,
				html:oOwnSettings.html,
				fontsize:oOwnSettings.fontsize,
				forecolor:oOwnSettings.forecolor
			});
	that.system=oEditor.system;
	// ��ʼ����ʽ������
	that.format = oEditor.format;
	// ��ʼ����ѯ��
	that.query = oEditor.query;
	// ��ʼ��������
	var oObserver=that.observer =oEditor.observer;
	//��ʼ����¼��
	that.history = oEditor.history;
	//��ʼ��ʷ��¼��ʱ��
	that.startHistoryTimer();
	// ��ʼ��������
	that.initToolbar();
	// ����IEʧȥ��������
	if (that.system.ie) {
		// �� activeElement ��that.editorIframe��Ϊ���ĵ���������֮ǰ��������
		oObserver.add({
					"el" : that.editorIframe,
					"eventType" : "beforedeactivate",
					"fn" : function() {
						// ���浱ǰѡ��
						this.range = this.editor.getRange();
					},
					"object":that
				});
		// ��that.editorIframe��Ϊ�����ʱ����
		oObserver.add({
					"el" : that.editorIframe,
					"eventType" : "activate",
					"fn" : function() {
						if (this.range) {
							// �ָ�ѡ��
							try {
								this.range.select();
								this.range = null;
							} catch (e) {}
						}
					},
					"object":that
				});
	}
	
	//���û������ҳʱ�����ص�����
	oObserver.add({
					"el" : document,
					"eventType" : "click",
					"fn" : that.hidePopup,
					"object" : that
				});
	//���û�����༭����ʱ�����ص�����
	oObserver.add({
					"el" : oEditor.doc,
					"eventType" : "click",
					"fn" : that.hidePopup,
					"object" : that
				});
	// ���û������༭��ʱ�����ص�����
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
	// ��that.editorIframe��Ϊ�����ʱ������ʷ��¼��ʱ��
	oObserver.add({
				"el" : that.editorIframe,
				"eventType" : "activate",
				"fn" : that.startHistoryTimer,
				"object" : that
			});
	// ���û���һ�ε������ʱ����¼��ʷ
	var sId = oObserver.add({
				"el" : oEditor.doc,
				"eventType" : "keyup",
				"fn" : function() {
					this.history.save();
					// �Ƴ�������
					this.observer.remove({
								"el" : this.editor.doc,
								"eventType" : "keyup",
								"id" : sId
							});
				},
				"object" : that
			});
	//�������ݵ�Editorʵ����
	oEditor.setEditorView(that);
}
/**
 * �ı乤����״̬�����ڸ��¹�����������״̬�����ݴ˸ı乤����״̬
 * 
 * @method changeToolbar
 * @param {array}aCommands Ҫ���µĹ�����������
 * @return {void}
 * @see #addClass #removeClass Editor.Query#queryAll
 * @for Editorview
 */
function fEditorViewChangeToolbar(aCommands) {
	// ��ȡ�༭����ͼ����
	aCommands=aCommands||["undo","redo","bold","italic","underline"];
	var that = this;
	var sEditMode=that.editMode;
	//���html�༭�����ɼ������ߵ�ǰ�༭ģʽ���ǻ���/ȫ������ģʽ�����ߵ�ǰ�Ǽ򵥱༭ģʽ������Ҫ���µ�ֻ�г���������ť������Ҫ���¹�����
	if(that.editorIframe.style.display=="none"||(sEditMode!="basic"&&sEditMode!="full")
	||(sEditMode=="basic"&&aCommands.length==2)){
		return;
	}
	// ��ѯ��괦������״̬
	var oJson = that.query.query(aCommands);
	var oCurToolbar=that.toolbar[sEditMode];
	// ����״̬��
	for (var key in oJson) {
		var oItem=oCurToolbar[key];
		if (oJson[key] == false) {
			// �����״̬���Ǽ����
			if (oItem&& oItem.el) {
				// ���Ĺ�������ť��״̬
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
				    // ���¹�������������ӦԪ�ص�״̬
				oItem.isActive = false;
				
			}
		} else {
			if (oItem&& oItem.el) {
				// ���Ĺ�������ť��״̬
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
					// ���¹�������������ӦԪ�ص�״̬
					oItem.isActive = true;
				}

			}
		}
	}
}
/**
 * ��ȡ�¼�
 * 
 * @method getEvent([oWindow])
 * @param {object}oWindow����ѡ������Ҫ��ȡevent�����Ӧ��window����
 * @return {object}event
 * @for Editorview
 */
function fEditorViewGetEvent(oWindow) {
	// IE\Chrome\Opera\Safari��֧��window.event�������event����
	var oEvent;
	oEvent=oWindow?oWindow.event:window.event;
	if(!oEvent&&this.system.firefox) {
		// Firefox\Chrome\Safari��֧��arguments[0]��ʽ��ȡevent������ֻ��Firefoxִ��
		//��ȡ��������
		var func = arguments.callee;
		while (func != null) {
			// ��ȡ�����ĵ�һ������
			var arg0 = func.arguments[0];
			// ����ò������¼����͵ģ��򷵻�
			if (arg0&& (arg0.constructor == MouseEvent || arg0.constructor == Event||arg0.constructor == KeyboardEvent)) {
				return arg0;
			}
			// ��ȡ������ջ�е��ϲ㺯��������ǰ����func�ĵ�����
			func = func.caller;
		}
	}
	return oEvent;
}
/**
 * ��ʾԪ��
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
 * ����Ԫ��
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
 * ��ʾ/����Ԫ��
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
 * ΪԪ�����class
 * 
 * @method addClass
 * @param {object}oEl �����ڵ�
 * @param {string}sClass Ҫ��ӵ�����
 * @return {boolean} true��ʾ�ɹ����
 * @for Editorview
 */
function fEditorViewAddClass(oEl, sClass) {
	if (oEl.className) {
		// ���Ԫ��û����Ӧ�����������ָ�����������򷵻�false��ʾ���ʧ��
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
 * ɾ����������
 * 
 * @method removeClass
 * @param {object}oEl
 * @param {string}sClass
 * @return {boolean} true��ʾ�ɹ�ɾ��
 * @for Editorview
 */
function fEditorViewRemoveClass(oEl, sClass) {
	if (oEl.className) {
		// ���Ԫ������Ӧ��������ɾ��ָ�����������򷵻�false��ʾɾ��ʧ��
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
 * ��ȡԪ�ص�ǰ����ʽ
 * 
 * @method getStyle
 * @param {object}oEl
 * @param {string}sAttr(��ѡ)ָ����ʽ��
 * @return {object}��ȡԪ�ص�ǰ����ʽ
 * @for Editorview
 */
function fEditorViewGetStyle(oEl,sAttr){
	return sAttr?oEl.currentStyle?oEl.currentStyle[sAttr]:
	       document.defaultView.getComputedStyle(oEl,false)[sAttr]:
	       oEl.currentStyle?oEl.currentStyle:document.defaultView.getComputedStyle(oEl,false);
}
/**
 * ��ȡԪ�غͱ༭����߿�ľ���
 * 
 * @method getElementLeft
 * @param {object}oEl
 * @return {number}nLeft
 * @for Editorview
 */
function fEditorViewGetElementLeft(oEl) {
	//�жϵ�һ�������ڵ��Ƿ�����ڶ��������ڵ�
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
	// ѭ�����ϸ��ڵ����߾�
	while (oCurrentNode != null&&_fContains(oMenuContainer,oCurrentNode)) {
		if(oCurrentNode.className!="container"){
			nLeft += oCurrentNode.offsetLeft;
		}
		oCurrentNode = oCurrentNode.offsetParent;
	}
	return nLeft;
}
/**
 * ��ȡԪ�غͱ༭���ϱ߿�ľ���
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
    // ѭ�����ϸ��ڵ�Ķ��˾���
    while (oCurrentNode != null) {
        nTop += oCurrentNode.offsetTop ;
        oCurrentNode = oCurrentNode.offsetParent;
    }
    return nTop;
}
/**
 * ֹͣ�¼�
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
		// ��ie��ֹͣ�¼�ð��
		oEvent.stopPropagation();
	} else {
		// ie��ֹͣ�¼�ð��
		oEvent.cancelBubble = true;
	}
}
/**
 * ʹ��������϶�
 * @method setDragable
 * @param {object}oClickedObj �����϶��¼��Ķ���,����갴�µĶ���
 * @param {object}oMoveObj ���϶��Ķ���
 * @return {void}
 * @see  Editor.observer#add,remove
 * @for Editorview
 */
function fEditorViewSetDragable(oMousedownedObj, oMovedObj) {
	// ���oMovedObjΪ�գ����ʾ��һ���������Ǳ��϶��Ķ���
	oMovedObj = oMovedObj || oMousedownedObj;
	var oDoc = top.document;
	// �ڲ���������ȡ�¼�����
	function _getEvPosition(oEvent) {
		return {
			x : oEvent.clientX + document.body.scrollLeft
					+ document.documentElement.scrollLeft,
			y : oEvent.clientY + document.body.scrollTop
					+ document.documentElement.scrollTop
		};
	}
	// ����false��ʹҳ�治����ѡ��
	var fSelectEvent = function() {
		return false
	};
	// ����ƶ�����
	var fObjMoving = function(oEv) {
		// ��ȡevent����
		var oEvent = oEv || top.event;
		// ����û�����Ĳ������������򲻿�ʼ�϶�
		if (oDoc.all && oEvent.button != 1) {
			oMousedownedObj.onmouseup();
			return;
		}
		// ��ȡ�������
		var oPos = _getEvPosition(oEvent);
		// ��ȡ���϶�������������Ծ���
		var x1 = oPos.x - oMovedObj.getAttribute("dragX");
		var y1 = oPos.y - oMovedObj.getAttribute("dragY");
		// ���ñ��϶������λ��
		oMovedObj.style.left = parseInt(oMovedObj.style.left, 10) + x1 + "px";
		oMovedObj.style.top = parseInt(oMovedObj.style.top, 10) + y1 + "px";
		// ���±��϶������λ����Ϣ
		oMovedObj.setAttribute("dragX", oPos.x);
		oMovedObj.setAttribute("dragY", oPos.y);
	};
	var oObserver = this.observer;
	oMousedownedObj.onmousedown = function(oEv) {
		// ��ȡevent����
		var oEvent = oEv || top.event;
		// ��ȡ�������
		var oPos = _getEvPosition(oEvent);
		// ���ñ��϶������λ����Ϣ
		oMovedObj.setAttribute("dragX", oPos.x);
		oMovedObj.setAttribute("dragY", oPos.y);
		// ���oDoc onmousemove�¼�
		oObserver.add({
					"el" : oDoc,
					"eventType" : "mousemove",
					"fn" : fObjMoving
				});
		// ���oDoc selectstart�¼�
		oObserver.add({
					"el" : oDoc,
					"eventType" : "selectstart",
					"fn" : fSelectEvent
				});
	};
	oMousedownedObj.onmouseup = function() {
		// �Ƴ��¼�����
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
 * ϵͳ����
 * @method  msgBox
 * @param {object}oParam
 *                .title ��������
 *                .noIcon 
 *                .content html����
 *                .pos ����λ��(�磺{x:5,y:5})
 *                .call ȷ����ť�ص�����,����ֵ��:.stopClose==true��ʾ��ֹ���ڹرգ�.errMsg��ʾҪ��ʾ�Ĵ�����Ϣ
 *                .cancel ȡ����ť�ص�����
 * @param {object}����button����
 * @for EditorView
 */
function fEditorViewMsgBox(oParams){
	var that=this;
	var oMsgBoxDiv=that.getNode("#editorMsgBoxDv");
	if(oMsgBoxDiv){ 
		// ɾ�����е���ʾ��
		oMsgBoxDiv.parentNode.removeChild(oMsgBoxDiv);
	}
	var oTopDoc=top.document;
	//��ҳ���ĸ߶�
	var nPageHeight=oTopDoc.body.scrollHeight;
	oMsgBoxDiv=document.createElement("div");
	oMsgBoxDiv.className="gSys-msg";
	oMsgBoxDiv.id="editorMsgBoxDv";
	var sHtml = '<div id="editorMsgBoxWinDv" class="gSys-msg-win">\
					<div id="editorMsgBoxWinHdDv" class="fn-bgx bg-main-2 hd">\
						<span class="fn-bg rc-l"></span>\
						<h4>'+(oParams.title||"ϵͳ��ʾ")+'</h4>\
						<span class="fn-bg rc-r"></span>\
						<a id="editorMsgCloseLink" href="javascript:void(0)" class="fn-bg Aclose" hidefocus="true" title="�ر�">�ر�</a>\
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
								<span>ȷ ��</span>\
							</div>' +(oParams.hasCancel?
							'<div id="editorMsgBoxCancelDv" class="btn btn-dft" \
								onmouseover="javascript:this.className=\'btn btn-dft btn-dft-impt\'"\
								onmouseout="javascript:this.className=\'btn btn-dft\'">\
								<span>ȡ ��</span>\
							</div>':"")+
						'</div>\
					</div>\
				</div>\
				<div class="mask" style="height:'+nPageHeight+'px"></div>';
	oMsgBoxDiv.innerHTML=sHtml;
	document.body.appendChild(oMsgBoxDiv);
	that.show(oMsgBoxDiv);
	var oWin=that.getNode("#editorMsgBoxWinDv");
	// ���ݲ�������λ��
	if(oParams.pos){
		oWin.style.left = oParams.pos.x + "px";
		oWin.style.top = oParams.pos.y + "px";        
	}else{
		// ���þ��ж�λ����
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
		//���㴰�ھ�����ʾ������
		var nLeft = ((oTopDoc.documentElement.offsetWidth || oTopDoc.body.offsetWidth) - nWidth)/2;
		var nTop = ((oTopDoc.documentElement.clientHeight || oTopDoc.body.clientHeight) - nHeight)/2 + nScrollTop;
		//�����겻С��10
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
	//�رհ�ť�¼�
	oCloseLnk.onclick=function(){
	    oMsgBoxDiv.parentNode.removeChild(oMsgBoxDiv);
	}
	oOkDv.onclick=function(){
		var oResult;
		if(oParams.call)oResult=oParams.call();
		//��ʾ������Ϣ
		if(oResult&&oResult.errMsg){
			document.getElementById("editorMsgBoxMsgDv").innserHTML=oResult.errMsg;
		}
		//���رյ���
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
 * Ϊ�����˵�ѡ�й�������ı�����ʽ
 * 
 * @method selectMenu
 * @param {object}oMenuDiv�����˵�div
 * @param {string}sCommand��ǰ����
 * @return {void}
 * @for Editorview
 */
function fEditorViewSelectMenu(oMenuDiv, sCommand) {
	// �ڹ�������ı�����ʽǰ�ӱ��
	if ( sCommand == "fontname"
			|| sCommand == "forecolor" || sCommand == "backcolor") {
		this.editor.focus();
		// ��ѯ��ǰ����״̬
		var sValue = this.query[sCommand]();
		//this.log(sValue);
		// ����Ƿ�Ҫ���ͼ��
		var bAddIco = false;
		//�����˵���Ҫ��ӵ�����
		var sClass=sCommand == "forecolor" || sCommand == "backcolor"?"g-menu-hasicos":"g-menu-hasico";
		// ��ȡ�����˵������е�a��ǩ
		var aChildren = oMenuDiv.getElementsByTagName("a");
		for (var i = 0; i < aChildren.length; i++) {
			if (aChildren[i].getAttribute("val") == sValue) {
				this.addClass(oMenuDiv, sClass);
				bAddIco = true;
				// �����ǰû�����ͼ�꣬�����
				if (!/<b[^\/]+radio[^\/]+\/b>/i.test(aChildren[i].innerHTML)) {
					aChildren[i].innerHTML = "<b class='ico ico-flag ico-slct ico-slct-radio'></b>"
							+ aChildren[i].innerHTML;
				}
			} else {
				// ���������ƥ��ı�ǩ��ͼ�꣬��Ҫɾ��
				if (/<b[^\/]+radio[^\/]+\/b>/i.test(aChildren[i].innerHTML)) {
					aChildren[i].innerHTML = aChildren[i].innerHTML.replace(
							/<b[^\/]+radio[^\/]+\/b>/i, "");
				}
			}
		}
		// ���û��ƥ��Ĳ˵�������Ƴ�"g-menu-hasico"
		if (!bAddIco) {
			this.removeClass(oMenuDiv, sClass);
		}
	}
}
/**
 * ��ʱ����
 * 
 * @method delayPopup(oEl[,nMilliSecond])
 * @param {object}oEl Ҫ��ʱ��ʾ��Ԫ��
 * @param {number}nMilliSecond ��ʱ�ĺ���������ѡ��Ĭ��Ϊ0
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
 * ������
 * 
 * @method popup(oTarget, sCommand, sInnerHTML[,sWidth])
 * @param {object}oTarget������Ĺ�������ť
 * @param {object}oEvent �¼�����  
 * @param {string}sCommand �������� 
 * @param {string}sInnerHTML ����������,
 * @param {string}sWidth ��������(��ѡ��Ĭ����100px)
 * @return {object}oMenuDiv ���ص�����
 * @see #clickList #selectMenu Editor.Observer#add
 * @for Editorview
 */
function fEditorViewPopup(oTarget, sCommand, sInnerHTML, sWidth) {
	var that=this;
	// ������
	var oMenuDiv;
	if (sInnerHTML != "") {
		// ҳ�治���ڸĵ����㣬��Ҫ�½�
		oMenuDiv = document.createElement("div");
		oMenuDiv.id = sCommand + "MenuDiv";
		oMenuDiv.className = "g-menu";
		// �����ָ����ȣ����õ�����Ŀ��Ϊָ����ȣ���������ΪĬ�Ͽ�ȡ�100px��
		oMenuDiv.style.width = sWidth ? sWidth : "100px";
		oMenuDiv.style.display="none";
		// Ϊ���������굥���¼�
		that.observer.add({
					"el" : oMenuDiv,
					"eventType" : "click",
					"fn" : that.clickList,
					"object" : that,
					"params" : [oMenuDiv, sCommand]
				});
		// ���õ���������Ϊָ������
		oMenuDiv.innerHTML = sInnerHTML;
		// �ѵ�������뵽ҳ����
		that.menuContainer.appendChild(oMenuDiv);
		// ���浯����
		that.popupMenus[sCommand] = oMenuDiv;
	} else {
		// �����������ָ���ĵ����㣬��ֱ�ӻ�ȡ
		oMenuDiv = that.popupMenus[sCommand];
	}
	// Ϊ�����˵�ѡ�й�������ı�����ʽ
	that.selectMenu(oMenuDiv, sCommand);
	//���ò˵�λ��
	oMenuDiv.style.left = that.getLeft(oTarget)+1+ "px";
	oMenuDiv.style.top = that.getTop(oTarget)+ 20+ "px";
	// ��ʾ�����㣬���ⱻ������hidePopup���ص�
	that.delayPopup(oMenuDiv);
	// �ָ�ѡ��
	if (that.range && that.system.ie) {
		// this.range.collapse(false);
		that.editor.selectRange(that.range);
	}
	return oMenuDiv;
}
/**
 * ���ص�����
 * 
 * @method hidePopup
 * @param void
 * @return {void}
 * @for Editorview
 */
function fEditorViewHidePopup() {
	var that=this;
	var oPopupDiv = that.popupDiv;
	// ����༭���е����㣬�����ص�
	if (oPopupDiv) {
		oPopupDiv.style.display = "none";
	}
}
/**
 * �������뷽ʽ������
 * 
 * @method popupJustifyMenu
 * @param {object}oTarget������İ�ť�����������뷽ʽ��ť��
 * @return {object} ���ص�����
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupJustifyMenu(oTarget) {
	var sInnerHTML = ""
	// ���������û����Ӧ�ĵ����㣬���ȡ�õ������html���ݣ������½�
	if (!this.popupMenus["justify"]) {
		sInnerHTML = '\
			<div class="g-menu-inner g-menu-hasico">\
				<ul>\
					<li>\
						<a href="javascript:void(0);"><b\
							class="ico ico-editor ico-editor-alef"></b>�����</a>\
					</li>\
					<li>\
						<a href="javascript:void(0);"><b\
							class="ico ico-editor ico-editor-acen"></b>���ж���</a>\
					</li>\
					<li>\
						<a href="javascript:void(0);"><b\
							class="ico ico-editor ico-editor-arit"></b>�Ҷ���</a>\
					</li>\
				</ul>\
			</div>\
				';
	}
	// ������
	return this.popup(oTarget, "justify", sInnerHTML);
}
/**
 * �����б�ʽ������
 * 
 * @method popupListMenu
 * @param {object}oTarget������İ�ť���������б�ʽ��ť��
 * @return {object} ���ص�����
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupListMenu(oTarget) {
	var sInnerHTML = "";
	// ���������û����Ӧ�ĵ����㣬���ȡ�õ������html���ݣ������½�
	if (!this.popupMenus["list"]) {
		sInnerHTML = '\
			<div class="g-menu-inner g-menu-hasico">\
				<ul>\
					<li>\
						<a href="javascript:void(0);"><b\
							class="ico ico-editor ico-editor-clist"></b>�����б�</a>\
					</li>\
					<li>\
						<a href="javascript:void(0);"><b\
							class="ico ico-editor ico-editor-nlist"></b>�����б�</a>\
					</li>\
				</ul>\
			</div>\
				';
	}
	// ������
	return this.popup(oTarget, "list", sInnerHTML);
}
/**
 * ��������/ͻ��������
 * 
 * @method popupIndentMenu
 * @param {object}oTarget������İ�ť������������/ͻ����ť��
 * @return {object} ���ص�����
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupIndentMenu(oTarget) {
	var sInnerHTML = "";
	// ���������û����Ӧ�ĵ����㣬���ȡ�õ������html���ݣ������½�
	if (!this.popupMenus["indent"]) {
		sInnerHTML = '\
			<div class="g-menu-inner g-menu-hasico">\
				<ul>\
                    <li>\
						<a href="javascript:void(0);"><b\
							class="ico ico-editor ico-editor-addi"></b>��������</a>\
					</li>\
					<li>\
						<a href="javascript:void(0);"><b\
							class="ico ico-editor ico-editor-cuti"></b>��������</a>\
					</li>\
				</ul>\
			</div>\
				';
	}
	// ������
	return this.popup(oTarget, "indent", sInnerHTML);
}
/**
 * �����ֺ�������
 * 
 * @method popupFontsizeMenu
 * @param {object}oTarget������İ�ť���������ֺŰ�ť��
 * @return {object} ���ص�����
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupFontsizeMenu(oTarget) {
	var sInnerHTML = "";
	// ���������û����Ӧ�ĵ����㣬���ȡ�õ������html���ݣ������½�
	if (!this.popupMenus["fontsize"]) {
		sInnerHTML = '\
			<div class="g-menu-inner">\
				<ul class="fontsize">\
					<li>\
						<a val="14px" href="javascript:void(0);" class="size0"><span\
							class="ext txt-info">14px</span>Ĭ�ϴ�С</a>\
					</li>\
					<li class="ln-thin ln-c-light"></li>\
					<li>\
						<a val="10px" href="javascript:void(0);" class="size1"><span\
							class="ext txt-info">10px</span>��С</a>\
					</li>\
					<li>\
						<a val="13px" href="javascript:void(0);" class="size2"><span\
							class="ext txt-info">13px</span>��С</a>\
					</li>\
					<li>\
						<a val="16px" href="javascript:void(0);" class="size3"><span\
							class="ext txt-info">16px</span>С</a>\
					</li>\
					<li>\
						<a val="18px" href="javascript:void(0);" class="size4"><span\
							class="ext txt-info">18px</span>��</a>\
					</li>\
					<li>\
						<a val="24px" href="javascript:void(0);" class="size5"><span\
							class="ext txt-info">24px</span>��</a>\
					</li>\
					<li>\
						<a val="32px" href="javascript:void(0);" class="size6"><span\
							class="ext txt-info">32px</span>�ش�</a>\
					</li>\
					<li>\
						<a val="48px" href="javascript:void(0);" class="size7"><span\
							class="ext txt-info">48px</span>����</a>\
					</li>'+
					(this.settings.toolbar?"":'<li class="ln-thin ln-c-light"></li>\
					<li>\
						<a val="setDefault" href="javascript:void(0);" class="size0"><span\
							class="ext txt-info"></span>����Ĭ�ϴ�С</a>\
					</li>')+
				'</ul>\
			</div>\
				';
	}
	// ������
	return this.popup(oTarget, "fontsize", sInnerHTML, "185px");
}
/**
 * ��������������
 * 
 * @method popupFontnameMenu
 * @param {object}oTarget������İ�ť�����������尴ť��
 * @return {object} ���ص�����
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupFontnameMenu(oTarget) {
	var sInnerHTML = ""
	// ���������û����Ӧ�ĵ����㣬���ȡ�õ������html���ݣ������½�
	if (!this.popupMenus["fontname"]) {
		sInnerHTML = '\
			<div class="g-menu-inner">\
				<ul>\
					<li>\
						<a val="����" href="javascript:void(0);" style="font-family: \'����\'">����</a>\
					</li>\
					<li>\
						<a val="����" href="javascript:void(0);" style="font-family: \'����\'">����</a>\
					</li>\
					<li>\
						<a val="����_GB2312" href="javascript:void(0);" style="font-family:\'����_GB2312\'">����_GB2312</a>\
					</li>\
					<li>\
						<a val="����" href="javascript:void(0);" style="font-family: \'����\'">����</a>\
					</li>\
					<li>\
						<a val="��Բ" href="javascript:void(0);" style="font-family: \'��Բ\'">��Բ</a>\
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
	// ������
	return this.popup(oTarget, "fontname", sInnerHTML, "120px");
}
/**
 * ����������ɫ������
 * 
 * @method popupForecolorMenu
 * @param {object}oTarget������İ�ť��������������ɫ��ť��
 * @return {object} ���ص�����
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupForecolorMenu(oTarget) {
	var sInnerHTML = "";
	// ���������û����Ӧ�ĵ����㣬���ȡ�õ������html���ݣ������½�
	if (!this.popupMenus["forecolor"]) {
		sInnerHTML = '\
			<div class="g-menu-inner g-menu-hasico">\
				<ul class="color">\
					<li>\
						<a val="#000000" href="javascript:void(0);"><b class="ico" \
							style="background: #000000"></b>��ɫ<span class="txt-info">(Ĭ��)</span>\
						</a>\
					</li>\
					<li class="ln-thin ln-c-light"></li>\
					<li>\
						<a val="#880000" href="javascript:void(0);"><b class="ico"\
							style="background: #880000"></b>����ɫ</a>\
					</li>\
					<li>\
						<a val="#800080" href="javascript:void(0);"><b class="ico"\
							style="background: #800080"></b>��ɫ</a>\
					</li>\
					<li>\
						<a val="#ff0000" href="javascript:void(0);"><b class="ico"\
							style="background: #ff0000"></b>��ɫ</a>\
					</li>\
					<li>\
						<a val="#ff00ff" href="javascript:void(0);"><b class="ico"\
							style="background: #ff00ff"></b>�ʷ�ɫ</a>\
					</li>\
					<li>\
						<a val="#000080" href="javascript:void(0);"><b class="ico"\
							style="background: #000080"></b>����ɫ</a>\
					</li>\
					<li>\
						<a val="#0000ff" href="javascript:void(0);"><b class="ico"\
							style="background: #0000ff"></b>��ɫ</a>\
					</li>\
					<li>\
						<a val="#00ffff" href="javascript:void(0);"><b class="ico"\
							style="background: #00ffff"></b>����ɫ</a>\
					</li>\
					<li>\
						<a val="#008080" href="javascript:void(0);"><b class="ico"\
							style="background: #008080"></b>����ɫ</a>\
					</li>\
					<li>\
						<a val="#008000" href="javascript:void(0);"><b class="ico"\
							style="background: #008000"></b>��ɫ</a>\
					</li>\
					<li>\
						<a val="#808000" href="javascript:void(0);"><b class="ico"\
							style="background: #808000"></b>���ɫ</a>\
					</li>\
					<li>\
						<a val="#00ff00" href="javascript:void(0);"><b class="ico"\
							style="background: #00ff00"></b>ǳ��ɫ</a>\
					</li>\
					<li>\
						<a val="#ffcc00" href="javascript:void(0);"><b class="ico"\
							style="background: #ffcc00"></b>�Ȼ�ɫ</a>\
					</li>\
					<li>\
						<a val="#808080" href="javascript:void(0);"><b class="ico"\
							style="background: #808080"></b>��ɫ</a>\
					</li>\
					<li>\
						<a val="#c0c0c0" href="javascript:void(0);"><b class="ico"\
							style="background: #c0c0c0"></b>��ɫ</a>\
					</li>\
					<li>\
						<a val="#ffffff" href="javascript:void(0);"><b class="ico"\
							style="background: #ffffff; border: 1px solid #ccc"></b>��ɫ</a>\
					</li>' +
                    (this.settings.toolbar?"":'<li class="ln-thin ln-c-light"></li>\
					<li>\
						<a val="setDefault" href="javascript:void(0);" style="text-indent:6px">����Ĭ����ɫ</a>\
					</li>')+
				'</ul>\
			</div>\
				';
	}
	// ������
	return this.popup(oTarget, "forecolor", sInnerHTML);
}
/**
 * ����������ɫ������
 * 
 * @method popupBackcolorMenu
 * @param {object}oTarget������İ�ť��������������ɫ��ť��
 * @return {object} ���ص�����
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupBackcolorMenu(oTarget) {
	var sInnerHTML = "";
	// ���������û����Ӧ�ĵ����㣬���ȡ�õ������html���ݣ������½�
	if (!this.popupMenus["backcolor"]) {
		sInnerHTML = '\
            <div class="g-menu-inner g-menu-hasico">\
				<ul class="color">\
					<li>\
						<a val="#ffffff" href="javascript:void(0);"><b class="ico"\
							style="background: #ffffff; border: 1px solid #ccc"></b>��ɫ<span\
							class="txt-info">(Ĭ��)</span> </a>\
					</li>\
					<li class="ln-thin ln-c-light"></li>\
					<li>\
						<a val="#880000" href="javascript:void(0);"><b class="ico"\
							style="background: #880000"></b>����ɫ</a>\
					</li>\
					<li>\
						<a val="#800080" href="javascript:void(0);"><b class="ico"\
							style="background: #800080"></b>��ɫ</a>\
					</li>\
					<li>\
						<a val="#ff0000" href="javascript:void(0);"><b class="ico"\
							style="background: #ff0000"></b>��ɫ</a>\
					</li>\
					<li>\
						<a val="#ff00ff" href="javascript:void(0);"><b class="ico"\
							style="background: #ff00ff"></b>�ʷ�ɫ</a>\
					</li>\
					<li>\
						<a val="#000080" href="javascript:void(0);"><b class="ico"\
							style="background: #000080"></b>����ɫ</a>\
					</li>\
					<li>\
						<a val="#0000ff" href="javascript:void(0);"><b class="ico"\
							style="background: #0000ff"></b>��ɫ</a>\
					</li>\
					<li>\
						<a val="#00ffff" href="javascript:void(0);"><b class="ico"\
							style="background: #00ffff"></b>����ɫ</a>\
					</li>\
					<li>\
						<a val="#008080" href="javascript:void(0);"><b class="ico"\
							style="background: #008080"></b>����ɫ</a>\
					</li>\
					<li>\
						<a val="#008000" href="javascript:void(0);"><b class="ico"\
							style="background: #008000"></b>��ɫ</a>\
					</li>\
					<li>\
						<a val="#808000" href="javascript:void(0);"><b class="ico"\
							style="background: #808000"></b>���ɫ</a>\
					</li>\
					<li>\
						<a val="#00ff00" href="javascript:void(0);"><b class="ico"\
							style="background: #00ff00"></b>ǳ��ɫ</a>\
					</li>\
					<li>\
						<a val="#ffcc00" href="javascript:void(0);"><b class="ico"\
							style="background: #ffcc00"></b>�Ȼ�ɫ</a>\
					</li>\
					<li>\
						<a val="#000000" href="javascript:void(0);"><b class="ico"\
							style="background: #000000"></b>��ɫ</a>\
					</li>\
					<li>\
						<a val="#808080" href="javascript:void(0);"><b class="ico"\
							style="background: #808080"></b>��ɫ</a>\
					</li>\
					<li>\
						<a val="#c0c0c0" href="javascript:void(0);"><b class="ico"\
							style="background: #c0c0c0"></b>��ɫ</a>\
					</li>'+
					(this.settings.toolbar?"":'<li class="ln-thin ln-c-light"></li>\
					<li>\
						<a val="setDefault" href="javascript:void(0);" style="text-indent:6px">����Ĭ����ɫ</a>\
					</li>')+
				'</ul>\
			</div>\
				';
	}
	// ������
	return this.popup(oTarget, "backcolor", sInnerHTML);
}
/**
 * �����и�������
 * 
 * @method popupLineheightMenu
 * @param {object}oTarget������İ�ť���������и߰�ť��
 * @return {object} ���ص�����
 * @see #popup
 * @for Editorview
 */
function fEditorViewPopupLineheightMenu(oTarget) {
	var sInnerHTML = "";
	// ���������û����Ӧ�ĵ����㣬���ȡ�õ������html���ݣ������½�
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
	// ������
	return this.popup(oTarget, "lineheight", sInnerHTML, "70px");
}
/**
 * ����������Ӵ���
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
			<b class="ico ico-info" title="��ʾ��"></b>\
			<div class="ct">\
            ';
    if (sTitle == "") {
        sHtml += '\
				<p><strong>\
					���������ӱ���\
				</strong></p>\
				<p class="input"><input id="editorLinkTitleInput" value="" type="text" class="ipt-t ipt-t-dft" /></p>\
                ';
    }
    sHtml += '\
				<p><strong>\
					���������ӣ��磺http://www.163.com��\
				</strong></p>\
				<p class="input"><input id="editorLinkUrlInput" value="http://" type="text" class="ipt-t ipt-t-dft" /></p>\
			</div>\
		</div>\
		';
    that.msgBox({
        "title" : "������",
        "noIcon" : true,
        "content" : sHtml,
        "hasCancel" : true,
        "call" : function() {
            // ����ͼƬ
            function _dislayError(sError) {
                var oErrorDiv = document.getElementById("editorMsgBoxMsgDv");
                oErrorDiv.innerHTML = sError;
            }
            //ȥ��ǰ��ո�
            var sUrl = oUrl.value.replace(/^ +/,"").replace(/ +$/,"");
            //���˱���
            var reHtmlChars = /[<>"&]/g , htmlMapping = {
                "<" : "&lt;",
                ">" : "&gt;",
                "\"" : "&quot;",
                "&" : "&amp;",
                " " : "&nbsp;"
            };

            if (oTitle) {
                sTitle = oTitle.value.replace(/^ +/,"").replace(/ +$/,"").replace(reHtmlChars, function ($0) {
                    return htmlMapping [$0];
                });
                if (sTitle == "") {
                    _dislayError("���ӱ��ⲻ��Ϊ��");
                    return {stopClose:true};
                }
            }
            // ��Ч��ַ
            if (sUrl && sUrl != "http://") {
                that.execFormat("createLink", sTitle,
                    sUrl);
            } else {
                _dislayError("���ӵ�ַ��Ч");
                return {stopClose:true};
            }
        }
    });
    var oUrl = that.getNode("#editorLinkUrlInput");
    //�ڲ��������۽�ʱ�ı���ʽ
    function _focus(){
        that.addClass(this,"ipt-t-dft-active");
    }
    //�ڲ�������ʧȥ����ʱ�ı���ʽ
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
 * ��ʼ����ӱ��Ի���
 * 
 * @method initTableDiv
 * @param {string}sInsertTableDivid���뱾���Ի��������div��id
 * @return {void}
 * @see #getNOde
 * @for Editorview
 */
function fEditorViewInitTableDiv(sInsertTableDivid) {
	var that=this;
	var oObserver=that.observer;
	var oDiv = parent.document.getElementById(sInsertTableDivid);
	//������Ԥ��div
	that.tablePreviewDiv=that.getNode("div.editorTablePreview",oDiv)[0];
	// ����Ի�������
	var aInputs = oDiv.getElementsByTagName("input");
	var nLength = aInputs.length;
	var oTableWin=that.tableWin = {};
	for (var i = 0; i < nLength; i++) {
		var sName = aInputs[i].name;
		oTableWin[sName] = {
			"el" : aInputs[i],
			"value" : aInputs[i].value
		}
		// ����¼�������input��ֵ�仯ʱ����
		oObserver.add({
					"el" : aInputs[i],
					"eventType" : "keyup",
					"fn" : that.insertTableMenuChange,
					"object":that,
					"params":[aInputs[i]]
				});
	}
	var oWidthUnitSel = oDiv.getElementsByTagName("select")[0];
	// ����¼�������oWidthUnitSel��ֵ�仯ʱ����
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
 * У����ӱ�����������
 * 
 * @method validTableInput
 * @param {object}oParamҪУ���inputԪ�ػ�tableWin����
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
			sError = "����������";
		}else if(!/^\d*$/.test(sValue)){
			sError = "����������";
		} else {
			switch (sName) {
				case "row" : {
					if(sValue==""){
						sError = "��������Ϊ��";
					}else if (parseInt(sValue) > 10000) {
						sError = "�������ܳ���10000";
					} else if (parseInt(sValue) < 1) {
						sError = "��������С��1";
					}
					break;
				}
				case "column" : {
					if(sValue==""){
						sError = "��������Ϊ��";
					}else if (parseInt(sValue) > 10000) {
						sError = "�������ܳ���10000";
					} else if (parseInt(sValue) < 1) {
						sError = "��������С��1";
					}
					break;
				}
				case "width" : {
					if(sValue==""){
						sError = "����Ȳ���Ϊ��";
					}else if (parseInt(sValue) > 10000) {
						sError = "����Ȳ��ܳ���10000";
					} else if (parseInt(sValue) < 1) {
						sError = "����Ȳ���С��1";
					}
					break;
				}
				case "border" : {
					if(sValue==""){
						sError = "�߿��ϸ����Ϊ��";
					}else if (parseInt(sValue) > 1000) {
						sError = "�߿��ϸ���ܳ���1000";
					} else if (parseInt(sValue) < 0) {
						sError = "�߿��ϸ����С��0";
					}
					break;
				}
				case "cellPadding" : {
					if(sValue==""){
						sError = "��Ԫ��߾಻��Ϊ��";
					}else if (parseInt(sValue) > 1000) {
						sError = "��Ԫ��߾಻�ܳ���1000";
					} else if (parseInt(sValue) < 0) {
						sError = "��Ԫ��߾಻��С��0";
					}
					break;
				}
				case "borderSpacing" : {
					if(sValue==""){
						sError = "��Ԫ���಻��Ϊ��";
					}else if (parseInt(sValue) > 1000) {
						sError = "��Ԫ���಻�ܳ���1000";
					} else if (parseInt(sValue) < 0) {
						sError = "��Ԫ���಻��С��0";
					}
					break;
				}
			}
		}
		if (sError != "") {
			bIsValid = false;
		}
		//֪ͨ����������ʾ������Ϣ
		var oResult=that.notifyListener("onEndCheckInsertTableInput",{"error":sError});
		//���û��ִ�м�����,����ʾ��֤���
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
 * ������
 * 
 * @method insertTable
 * @param void
 * @return {boolean}�ɹ������򷵻�true
 * @see #refreshPreviewTable Format#exec
 * @for Editorview
 */
function fEditorViewInsertTable() {
	var that=this;
	var oTableWin=that.tableWin;
	if(!that.validTableInput(oTableWin)){
		return false;
	}
	// ���»�������
	for (var key in oTableWin) {
		oTableWin[key]["value"] = oTableWin[key]["el"].value;
	}
	var sTable = that.refreshPreviewTable();
	that.format.exec("insertHtml", sTable);
	return true;
}
/**
 * ������ӱ�񴰿�
 * 
 * @method popupInsertTableMenu
 * @param {object}oTarget������İ�ť����������ӱ��ť��
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
						<tr><td colspan="2">����&nbsp; <input name="row" type="text" class="ipt-t-dft" maxlength="6" value="2" style="width:69px" />&nbsp;&nbsp;&nbsp; ����&nbsp; <input name="column" type="text" class="ipt-t-dft" maxlength="6" value="2" style="width:68px" /></td><td align="center" rowspan="5" style="overflow:hidden" class="g-editor-addtable-preview">\
						<span class="g-editor-addtable-title">Ԥ��</span>\
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
								<td>�����</td>\
								<td><input name="width" type="text" class="ipt-t-dft" value="80" maxlength="6" style="width:60px" />&nbsp;&nbsp; <select name="widthUnit" style="width:60px" func="select"><option value="%">%</option><option  value="px">px</option></select></td>\
							</tr>\
							<tr><td>�߿��ϸ</td><td><input name="border" type="text" class="ipt-t-dft" maxlength="6" value="1" style="width:60px" />&nbsp;&nbsp;����</td></tr>\
							<tr><td>��Ԫ��߾�</td><td><input name="cellPadding" type="text" class="ipt-t-dft" maxlength="6" value="1" style="width:60px" />&nbsp&nbsp;����</td></tr>\
							<tr><td>��Ԫ����</td><td><input name="borderSpacing" type="text" class="ipt-t-dft" maxlength="6" value="1" style="width:60px" />&nbsp;&nbsp;����</td></tr>\
						</tbody>\
					</table>\
				</div>\
				';
		that.msgBox({"title":"������","noIcon":true,"content":sHtml,"hasCancel":true,"call":function(){
			return {stopClose:!that.insertTable()};
		}});
		that.initTableDiv("editorInsertTableDiv");
}
/**
 * ˢ�±��Ի���ı��Ԥ��
 * 
 * @method refreshPreviewTable
 * @param void
 * @return {string}�����½�����html�ַ���
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
 * ���������Ի���ĵ����¼�
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
			//ȷ��
			case "confirm":{
				//���»�������
				for(var key in oTableWin){
					oTableWin[key]["value"]=oTableWin[key]["el"].value;
				}
				var sTable=that.refreshPreviewTable();
				that.format.exec("insertHtml",sTable);
				break;
			}
			//ȡ��
			case "cancel":{
			}
			//�ر�
			case "close":{
				//�����ָ�Ĭ��ֵ
				oTableWin["row"]["el"].value=2;
				oTableWin["col"]["el"].value=2;
				oTableWin["width"]["el"].value=80;
				oTableWin["widthUnit"]["el"].value="%";
				oTableWin["border"]["oEl"].value=1;
				oTableWin["cellPadding"]["el"].value=1;
				oTableWin["borderSpacing"]["el"].value=1;
				//�������ݻָ�Ĭ��ֵ
				oTableWin["row"]["value"]=2;
				oTableWin["col"]["value"]=2;
				oTableWin["width"]["value"]=80;
				oTableWin["widthUnit"]["value"]="%";
				oTableWin["border"]["value"]=1;
				oTableWin["cellPadding"]["value"]=1;
				oTableWin["borderSpacing"]["value"]=1;
				//�ָ�Ĭ�ϱ��Ԥ��
				that.refreshPreviewTable();
				break;
			}
		}
	}
}
/**
 * ���������Ի��������仯�¼�
 * 
 * @method insertTableMenuChange
 * @param {object}oEl�����
 * @return {boolean}����true��ʾ�ɹ�����Ԥ��
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

	// ���»���
	that.tableWin[sName]["value"] = sValue;
	//��һ��У��
	if(!this.validTableInput(that.tableWin)){
		return false;
	}
	// ˢ�±��Ԥ��
	that.refreshPreviewTable();
	return true;
}
/**
 * ����ͼƬ�༭��
 * 
 * @method popupImgToolbar
 * @param void
 * @return {void}
 * @see #getEvent #getNode #hidePopup #show #getLeft #getTop Editor.Observer#add
 * @for Editorview
 */
function fEditorViewPopupImgToolbar() {
	// ��ȡ�༭����ͼ����
	var that = this;
	// ��ȡ��ǰ�༭���ڵ��¼�
	var oEvent = that.getEvent(that.editor.win);
	
	// û���¼����򷵻�
	if (!oEvent) {
		return;
	}
	
	// ��ȡ�¼�Դ�ڵ�
	var oNode = oEvent.srcElement ? oEvent.srcElement : oEvent.target;
	// ����¼�Դ��ͼƬ�ڵ㣬�򵯳�ͼƬ�༭��
	if (/img/i.test(oNode.nodeName)) {
		that.img = oNode;
		// ���������û��ͼƬ�༭�����������½�һ��
		if (!that.popupMenus["image"]) {
			var oNewDiv = document.createElement("div");
			oNewDiv.id = "imageMenuDiv";
			oNewDiv.className = "g-imgbar";
			oNewDiv.style.width="280px";
			oNewDiv.style.display="none";
			// ��ӵ����¼�
			that.observer.add({
						"el" : oNewDiv,
						"eventType" : "click",
						"fn" :that.editImage,
						"object":that,
						"params":[oNewDiv]
					});
			// ����༭��html
			oNewDiv.innerHTML = '\
			        <a href="javascript:void(0)" func="little">С</a>&nbsp;-&nbsp;\
			        <a href="javascript:void(0)" func="medium">��</a>&nbsp;-&nbsp;\
			        <a href="javascript:void(0)" func="big">��</a>&nbsp;-&nbsp;\
			        <a href="javascript:void(0)" func="original">ԭʼ��С</a>&nbsp;-&nbsp;\
			        <a href="javascript:void(0)" func="delete">ɾ��</a>&nbsp;&nbsp;[\
			        <a href="javascript:void(0)" func="close">�ر�</a>]\
		       ';
			// ���༭�����뵽ҳ����
			that.editorDiv.appendChild(oNewDiv);
			// ����ͼƬ������
			that.popupMenus["image"] = oNewDiv;
		}
		// ��������������
		if (that.popupDiv && that.popupDiv != that.popupMenus["image"]) {
			that.hidePopup();
		}
		// ����λ��
		that.popupMenus["image"].style.left = that.getLeft(oNode) + "px";
		var nTop=that.getTop(oNode)+ oNode.clientHeight + 28+(that.editMode=="full"?27:0);
		//���߶�,���ܳ����༭��
		var nMaxTop=that.editorDiv.clientHeight-22;
		if(nTop>nMaxTop){
			nTop=nMaxTop;
		}
		that.popupMenus["image"].style.top = nTop + "px";
		// ��ʱ��ʾͼƬ�������������ⲿ�¼�����hidePopup����
		that.delayPopup(that.popupMenus["image"],0);
	}
}
/**
 * �༭ͼƬ
 * 
 * @method editImage
 * @param {object}oTargetͼƬ�༭��
 * @return {void}
 * @see #hide #getTop
 * @for Editorview
 */
function fEditorViewEditImage(oTarget) {
	var that=this;
	//ȡ��ͼƬ��Χ�ı༭��
	if(that.system.ie){
		try{
			// ȡ����ǰѡ����
			that.editor.getSelection().empty();
		}catch(e){}
	}
	var e = that.getEvent();
	// ��ȡ�¼�ԴԪ��
	var oSrcEl = e.target || e.srcElement;
	// ����û�����Ĳ��Ǳ༭��ť����ֱ���˳�����
	if (!/a/i.test(oSrcEl.nodeName)) {
		return false;
	}
	var sFunc = oSrcEl.getAttribute("func");
	var oImage = that.img;
	// ɾ��ͼƬ
	if (sFunc == "delete") {
		var oParent=oImage.parentNode;
		//���ͼƬ����һ�����ӱ�ǩ��ΪͼƬ������Ӳ�����������ͬ���ӱ�ǩһ��ɾ��
		if(/a/i.test(oParent.nodeName)&&oParent.childNodes.length==1){
			oParent.parentNode.removeChild(oParent);
		}else{
			oImage.parentNode.removeChild(oImage);
		}
		// ����ͼƬ�༭������
		that.hide(oTarget);
		// ����༭��ʷ
	    that.history.save();
		return true;
	} else if (sFunc == "close") { // �رձ༭������
		that.hide(oTarget);
		return true;
	}
	var aSize;
	switch (sFunc) {
		// С�ߴ�
		case 'little' : {
			aSize = [100, 80];
			break;
		}
			// �еȳߴ�
		case 'medium' : {
			aSize = [200, 160];
			break;
		}
			// ��ߴ�
		case 'big' : {
			aSize = [460, 380];
			break;
		}
			// ԭʼ�ߴ�
		case 'original' : {
			oImage.removeAttribute("style");
			break;
		}
	}
	// ԭʼ��С
	if (!oImage.getAttribute("orgWidth")) {
		// ��������һ��
		oImage.setAttribute("orgWidth", oImage.clientWidth);
		oImage.setAttribute("orgHeight", oImage.clientHeight);
	}
	var nOrgWidth = parseInt(oImage.getAttribute("orgWidth"), 10);
	var nOrgHeight = parseInt(oImage.getAttribute("orgHeight"), 10);
	if (aSize) {
		// ���ô�С
		var nNewWidth = 0;
		var nNewHeight = 0;
		if (nOrgWidth > nOrgHeight) {
			// ��Ϊ׼
			nNewWidth = aSize[0];
			nNewHeight = Math.round(nNewWidth * nOrgHeight / nOrgWidth);
		} else {
			// ��Ϊ׼
			nNewHeight = aSize[1];
			nNewWidth = Math.round(nNewHeight * nOrgWidth / nOrgHeight);
		}
		// �´�С
		if (nNewWidth && nNewHeight) {
			oImage.style.height = nNewHeight + "px";
			oImage.style.width = nNewWidth + "px";
		}
	} else {
		// ԭʼ��С
		oImage.style.height = nOrgHeight+"px";
		oImage.style.width = nOrgWidth+"px";
	}
	// ����ͼƬ�༭������
	that.hide(oTarget);
	// ����༭��ʷ
	that.history.save();
}
/**
 * ���ı༭ģʽ
 * 
 * @method changeEditMode
 * @param {string}sMode�༭ģʽ����
 * @return {boolean} true ��ʾ�ɹ�
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
	//�����ǰ����Ҫ�л���ģʽ����ֱ�ӷ���false
	if(that.editMode==sMode){
			return false;
	}
	var oEditorDiv=that.editorDiv;
	var oEditor=that.editor;
	if (sMode == "source") {
		//�л���Դ��ģʽ
		oEditorDiv.className="g-editor g-editor-code";
		// ����Դ��༭������
		that.editorSourceTextarea.value = oEditor.getContent();
	} else if (sMode == "full") {
		//�л���ȫ������ģʽ
		oEditorDiv.className="g-editor g-editor-full";
		if(that.editMode=="source"){
			oEditor.setContent(that.editorSourceTextarea.value);
		}
		//���ĵ���ͼƬ�༭����λ��
		if(that.popupDiv&&that.popupDiv == that.popupMenus["image"]){
			var sTop=that.popupDiv.style.top;
			sTop=sTop.substring(0,sTop.indexOf("px"));
		    that.popupDiv.style.top=parseInt(sTop)+27+"px";
		}
	} else if (sMode == "basic") {
		//�л����򵥹���ģʽ
		oEditorDiv.className="g-editor g-editor-basic";
		//���ĵ���ͼƬ�༭����λ��
		if(that.popupDiv&&that.popupDiv == that.popupMenus["image"]){
			var sTop=that.popupDiv.style.top;
			sTop=sTop.substring(0,sTop.indexOf("px"));
		    that.popupDiv.style.top=parseInt(sTop)-27+"px";
		}
	} else if (sMode == "text") {
		// �л������ı��༭ģʽ
		oEditorDiv.className="g-editor g-editor-text";
		//��¼�༭��ʷ
		that.history.save();
		if (that.editMode != "source") {
			// ���ô��ı��༭������
			that.editorTextTextarea.value = oEditor.htmlToText(oEditor.getContent());
		} else {
			// ���ÿ��ӻ��༭������
			that.editorTextTextarea.value = oEditor.htmlToText(that.editorSourceTextarea.value);
		}
		//��ʱ����༭ģʽ���ָ���htmlģʽʱ��Ҫ�õ�
		that.editModeTmp=that.editMode;
	} else if (sMode == "html") {// �л���html�༭ģʽ
		// ���ش��ı��༭��
		if (that.editModeTmp != "source") {
			// ����iframe�༭������
			oEditor.setContent(oEditor.textToHtml(that.editorTextTextarea.value));
		} else {
			// ����Դ��༭������
			that.editorSourceTextarea.value = oEditor.textToHtml(that.editorTextTextarea.value);
		}
		oEditorDiv.className =_getClass(that.editModeTmp);
		that.editMode=that.editModeTmp;
	}else if(sMode == "hide"){
		//����༭ģʽ
		that.editModeTmpForToogle=that.editMode;
		that.addClass(oEditorDiv,"g-editor-hide");
	}else if(sMode == "show"){
		//���֮ǰû������editModeTmpForToogle��������editModeTmpForToogle=0
		if(that.editModeTmpForToogle==undefined){
			that.editModeTmpForToogle="basic";
		}
		oEditorDiv.className =_getClass(that.editModeTmpForToogle);
		that.editMode=that.editModeTmpForToogle;
	}
	//���±༭ģʽ
	if(sMode!="show"&&sMode!="html"){
		that.editMode=sMode;
	}
	if(that.editMode=="basic"||that.editMode=="full"){
		// ���¹�����״̬
		that.changeToolbar();
	}
	that.notifyListener("onEndChangeEditMode",{"mode":sMode});
	return true;
}
/**
 * ����������굥���¼�
 * 
 * @method doClick
 * @param {object}oParams
 *                {string}.command�������
 *                {string}.name��������
 *                {object}.dom��ť�ڵ�
 * @return {boolean} true ��ʾ�ɹ�
 * @see #removeClass #changeEditMode #changeToolbar #notifyListener
 * @see Editor.Format#exec
 * @see Editor.History#save
 * @for Editorview
 */
function fEditorViewDoClick(oParams) {
	// �����ʽ������
	var that=this;
	//����ִ�м�����
	var oResult=that.notifyListener("onStartClickItem",oParams);
	//���������Ҫ��ֹͣ������������false
	if(oResult["stop"]==true){
		return false;
	}
	//��־�Ƿ���Ҫ���¹�����״̬
	var bNeedChangeToolbar=true;
	if (oParams["command"] == "format") {
		var sFormat = oParams["name"];
		if (sFormat != "cut" &&sFormat != "copy" &&sFormat != "paste" && sFormat != "undo" && sFormat != "redo"
				&& sFormat != "insertHorizontalRule"&&sFormat != "insertTime"
				&& sFormat != "removeFormat") {
			// ������Ӧ��ť�ļ���״̬������domouseout�¼����İ�ť
			that.toolbar[that.editMode][sFormat].isActive = true;
		}

		// ִ�и�ʽ�������¼���
		var bResult = that.format.exec(sFormat);
		// ִ������ʧ��
		if (bResult == false) {
			switch (sFormat) {
				case 'copy' :
					alert("�����������֧�ֱ���������ʹ��'crtl+c'���档");
					return false;
				case 'cut' :
					alert("�����������֧�ֱ���������ʹ��'crtl+x'���档");
					return false;
				case 'paste' :
					alert("�����������֧�ֱ���������ʹ��'crtl+v'���档");
					return false;
			}
		}
	}else if(oParams["command"] == "custom"){
		if(oParams["name"]=="insertTable"){
			that.popupInsertTableWin();
		}else if(oParams["name"]=="link"){
			//����û�ѡ�������ӣ���ִ��ɾ�����Ӳ���������ִ��������Ӳ���
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
			// ���õ���������Ϊָ������
			oMenuDiv.innerHTML = sHtml;
			// �ѵ�������뵽ҳ����
			that.menuContainer.appendChild(oMenuDiv);
			// ���ò˵�λ��
			oMenuDiv.style.left = that.getLeft(oParams["dom"]) + 1 + "px";
			oMenuDiv.style.top = that.getTop(oParams["dom"]) + 20 + "px";
			// ��ʾ�����㣬���ⱻ������hidePopup���ص�
			that.delayPopup(oMenuDiv,500);
			// �ָ�ѡ��
			if (that.range && that.system.ie) {
				that.editor.selectRange(that.range);
			}
		}
		//��¼�༭��ʷ
		that.history.save();
		return;
	} else if (oParams["command"] == "editMode") {// �л��༭ģʽ
		bNeedChangeToolbar=false;
		that.changeEditMode(oParams["name"]);
	} else if(oParams["command"]=="popup"){
		bNeedChangeToolbar=false;
		var sFunc="popup"+oParams["name"].substring(0,1).toUpperCase()+oParams["name"].substring(1)+"Menu";
		that[sFunc](oParams["dom"]);
	}
	// ʵʱ���Ĺ�����״̬
	if (bNeedChangeToolbar) {
		that.changeToolbar();
	}
	//����ִ�м�����
	that.notifyListener("onEndClickItem",oParams);
	return true;
}
/**
 * ���������б���굥���¼�
 * 
 * @method clickList
 * @param {object}oTarget,
 *            sCommand,
 * @return {boolean}true ��ʾ�ɹ�
 * @see #hidePopup Editor.Format#exec
 * @for Editorview
 */
function fEditorViewClickList(oTarget, sCommand) {
	var that=this;
	var oFormat=that.format;
	// ���ص�����
	that.hidePopup();
	// ��ȡ�¼�
	var e = that.getEvent();
	// ��ȡ�¼�Դ
	var oSrcEl = e.target || e.srcElement;
	// ִ�б༭����
	switch (sCommand) {
		case 'forecolor' :
		case 'backcolor' : {
			var sColor;
			// ����û��������<b>��ǩ�����ȡ<b>�ĸ��ڵ��val����
			if (oSrcEl.tagName == "b" || oSrcEl.tagName == "B") {
				sColor = oSrcEl.parentNode.getAttribute("val");
				// ����û��������<a>�ڵ㣬���ȡ<b>�ڵ��val����
			} else {
				sColor = oSrcEl.getAttribute("val");
			}
			if(sColor!="setDefault"){
				// ִ�б༭����
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
			// ����û��������<b>��ǩ�����ȡ<b>�ĸ��ڵ��val����
			if (oSrcEl.tagName == "b" || oSrcEl.tagName == "B") {
				sSize = oSrcEl.parentNode.getAttribute("val");
				// ����û��������<a>�ڵ㣬���ȡ<b>�ڵ��val����
			} else {
				sSize = oSrcEl.getAttribute("val");
			}
			if(sSize!="setDefault"){
				// ִ������
				oFormat.exec(sCommand,sSize);
			}else{
				that.notifyListener("onStartClickItem",{"command":"custom","name":sCommand});
			}
			return true;
		}
		case 'justify' : {
			// ��ȡ����������Ԫ��
			if (oSrcEl.tagName != "b" && oSrcEl.tagName != "B") {
				oSrcEl = oSrcEl.getElementsByTagName("b")[0];
			}
			// ����css�������ֱ༭����
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
			// ��ȡ����������Ԫ��
			if (oSrcEl.tagName != "b" && oSrcEl.tagName != "B") {
				oSrcEl = oSrcEl.getElementsByTagName("b")[0];
			}
			// ����css�������ֱ༭����
			if (oSrcEl.className.indexOf("ico-editor-clist") >= 0) {
				oFormat.exec("insertUnorderedList");
			} else {
				oFormat.exec("insertOrderedList");
			}
			return true;
		}
		case 'indent' : {
			// ��ȡ����������Ԫ��
			if (oSrcEl.tagName != "b" && oSrcEl.tagName != "B") {
				oSrcEl = oSrcEl.getElementsByTagName("b")[0];
			}
			// ����css�������ֱ༭����
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
 * ����������꾭���¼�
 * 
 * @method doOnmouseover
 * @param {object}oTarget
 * @return {void}
 * @see #addClass
 * @for Editorview
 */
function fEditorViewDoOnmouseover(oTarget) {
	// ��ӡ��������ʽ
	var aLinks=oTarget.getElementsByTagName("a");
	if(aLinks.length==0||aLinks[0].className.indexOf("-dis")<0){
		this.addClass(oTarget, "g-editor-btn-on");
	}
}
/**
 * ������������Ƴ��¼�
 * 
 * @method doOnmouseout
 * @param {object}oTarget
 * @return {void}
 * @see #removeClass
 * @for Editorview
 */
function fEditorViewDoOnmouseout(oTarget) {
	var sFormat = oTarget.getAttribute("format");
	// ����Ǳ༭��������ť��Ҫ���ж��û��Ƿ񵥻������˸ð�ť
	if (sFormat) {
		if (this.toolbar[this.editMode][sFormat].isActive != true) {
			// ����ð�ť���Ǽ���״̬
			this.removeClass(oTarget, "g-editor-btn-on");
		}
		// �����������ť��ֱ���Ƴ����������ʽ
	} else {
		this.removeClass(oTarget, "g-editor-btn-on");
	}
}
/**
 * ������ʷ��¼��ʱ��
 * 
 * @method startHistoryTimer
 * @param void
 * @return {boolean}�ɹ�������ʷ��¼��ʱ���򷵻�true
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
 * ������ʷ��¼��ʱ��
 * 
 * @method stopHistoryTimer
 * @param void
 * @return {boolean}�ɹ�ֹͣ��ʷ��¼��ʱ���򷵻�true
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
 * ��Ӽ�����
 * 
 * @method addListener
 * @param {string}sEvent��������
 * @param {function}fFunction����������
 * @return {void}
 * @for Editorview
 */
function fEditorViewAddListener(sEvent,fFunction) {
	this.listener[sEvent]=fFunction;
}
/**
 * �Ƴ�������
 * 
 * @method removeListener
 * @param {string}sEvent��������
 * @return {boolean}ɾ���ɹ��򷵻�true
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
 * ֪ͨ/����������
 * 
 * @method notityListener
 * @param {string}sEvent��������
 * @param {object}oData���ݲ���
 * @return {object}
 *                 {boolean}.success��ʾ�Ƿ�ɹ�ִ���˼�����
 *                 {boolean}.stop��ʾ�Ƿ�ִֹͣ�к������
 *                 {object}.params�����������صĽ��
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
 * ��ȡ�������ڶ��ο���
 * 
 * @method get
 * @param {object}oData
 * @return {object}������Ҫ�Ķ���
 * @for Editorview
 */
function fEditorViewGet(oData) {
	// ��ȡ�ڲ�����,���ڶ��ο���
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
	// ��ȡ�ڲ�Ԫ��
	if (typeof oData["id"] == "string") {
		return this.editor.doc.getElementById(oData["id"]);
	}
	// ��ȡ�ڲ���ǩ
	if (typeof oData["tag"] == "string") {
		return this.editor.doc.getElementsByTagName(oData["tag"]);
	}
	var sValue = "";
	// �Ƿ�����Ϊ��
	if (oData["empty"]) {
		// Ĭ�Ͽ�
		var bEmpty = true;
		// �ı�
		sValue = this.get({
					"text" : true
				});
		// ������
		if (sValue) {
			// �ǿ�
			bEmpty = false;
		}
		return bEmpty;
	}
	if (this.editMode == "source") {
		// Դ��༭
		sValue = this.editorSourceTextarea.value;
	} else if (this.editMode=="text") {
		// �ı��༭
		sValue = this.editorTextTextarea.value;
		// ǿ��ý��
		if (oData["html"]) {
			sValue = sValue.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
		}
	} else {
		var oBody = this.editor.doc.body;
		// ǿ���ı�
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
 * ���ö������ڶ��ο���
 * 
 * @method set
 * @param {object}oData
 * @return {boolean} ���ִ��ʧ�ܣ�����false
 * @see #changeEditMode Editor#setContent
 * @for Editorview
 */
function fEditorViewSet(oData) {
	try {
		// �����ڲ����� ���ο���
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
				// ���ı� ���� ��ý������
				if (oData["html"]) {
					// ת��ý��
					this.changeEditMode("html");
				}
			} else {
				// ��ý�� ���� ���ı�����
				if (oData["text"]) {
					// ת���ı�
					this.changeEditMode("text");
				}
			}
			if (this.editMode == "source") {
				// Դ�� ���� ��ý������
				if (oData["html"]) {
					// �ж�ý��
					this.changeEditMode("source");
				}
			}
			// �������
			if (this.editMode == "source") {
				// Դ��༭
				this.editorSourceTextarea.value = sValue;
			} else if (this.editMode == "text") {
				// �ı��༭
				this.editorTextTextarea.value = sValue;
			} else {
				// ����HTML
				this.editor.setContent(sValue);
				// ȡ����Χ
				this.range = null;
			}

			// ����༭��ʷ
			this.history.save();
		}
	} catch (e) {
		this.log(e);
		return false;
	}
}
/**
 * �Ƿ��Ǵ��ı�ģʽ
 * 
 * @method isTextMode
 * @param void
 * @return {boolean}����Ǵ��ı�ģʽ���򷵻�true
 * @for Editorview
 */
function fEditorViewIsTextMode() {
	return this.editMode=="text"?true:false;
}
/**
 * չ��/���ع�����
 * 
 * @method toogleToolbar 
 * @param void
 * @return {boolean}������չ���󷵻�true
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
 * ��ȡ��ʼ���༭���html�ַ���
 * 
 * @method getInitHtml
 * @param {string}sBody�༭���ڵ�Ĭ������
 * @return {string}���س�ʼ���༭���html�ַ���
 * @see Editor#getInitHtml
 * @for EditorView
 */
function fEditorViewGetInitHtml(sBody) {
	return this.editor.getInitHtml({"body":sBody});
}
/**
 * �۽�
 * 
 * @method focus([oData])
 * @param {object}oData(��ѡ)
 *                .name�۽��Ķ�������win/doc/body����Ĭ��Ϊwin
 *                .elementҪ�۽���Ԫ��
 *                .idҪ�۽�Ԫ�ص�id
 *                .pos�۽��ľ�ȷλ��
 * @return {void}
 * @for Editor
 */
function fEditorViewFocus(oData) {
	this.editor.focus(oData);
}
/**
 * ����Ԫ��
 * 
 * @method insert
 * @param {object}oData
 *                .htmlҪ�����html
 *                .textҪ����Ĵ��ı�
 *                .imageҪ�����ͼƬhtml
 * @return {void}
 * @see Editor#insert
 * @for Editor
 */
function fEditorViewInsert(oData) {
	this.editor.insert(oData);
}
/**
 * ɾ��Ԫ��
 * 
 * @method del
 * @param {object}oData
 *                .elementҪɾ����Ԫ��
 *                .tagҪɾ����Ԫ�صı�ǩ��
 *                .regҪɾ����ͼƬurl��������ʽ
 * @return {void}
 * @for Editor
 */
function fEditorViewDelete(oData) {
	this.editor.del(oData);
}
/**
 * ��ȡ���ѡ���ı�
 * 
 * @method getSelectedText
 * @param void
 * @return {string} ���ع������λ�õ�����
 * @see Editor#getSelectedText
 * @for EditorView
 */
function fEditorViewGetSelectedText() {
	return this.editor.getSelectedText();
}
/**
 * ִ��ָ�������¼�༭��ʷ
 * 
 * @method execFormat
 * @param {string}sCommand
 * @param {object}oParams���������������string���ͣ�Ҳ������json����
 * @return {boolean} true��ʾ�ɹ�ִ������
 * @see Editor.Format#exec
 * @for EditorView
 */
function fEditorViewExecFormat(sCommand,oParams) {
	return this.format.exec.apply(this.format,arguments);
}
/**
 * ɾ������
 * 
 * @method deleteLink
 * @param void
 * @return {boolean} true��ʾ�ɹ�ִ������
 * @for EditorView
 */
function fEditorViewDeleteLink() {
	return this.format.exec("unLink");
}
/**
 * ��ȡ����
 * 
 * @method getContent
 * @param void
 * @return {string} ����Html����
 * @for EditorView
 */
function fEditorViewGetContent() {
	//�����ǰ��Դ��ģʽ�����ȡԴ������������
	if(this.editMode=="source"){
		return this.editorSourceTextarea.value;
	}else if(this.editMode=="text"){
		//�����ǰ�Ǵ��ı�ģʽ�����ȡ���ı�����������
		return this.editorTextTextarea.value;
	}else{
		//��ȡHtml�༭�������
		return this.editor.getContent();
	}
}
/**
 * ���ñ༭��Ĭ����ʽ���иߡ��ֺš�������ɫ�ȣ�
 * 
 * @method setDefStyle
 * @param {object}oParams
 *                .fontsize �ֺ�
 *                .fontname ����
 *                .forecolor ������ɫ
 * @return {void}
 * @for EditorView
 */
function fEditorViewSetDefStyle(oParams) {
	this.editor.setDefStyle(oParams);
}
/**
 * ��ȡ����Ĭ��������ʽ���иߡ��ֺš�������ɫ�ȣ�������
 * 
 * @method getFinalContent
 * @param void
 * @return {string} ����Html����
 * @for EditorView
 */
function fEditorViewGetFinalContent() {
	//�����Դ����ı��༭ģʽ���ȸ���html�༭�������
	if(this.editMode=="source"){
		this.editor.setContent(editorSourceTextarea.value);
	}else if(this.editMode=="text"){
		this.editor.setContent(editorTextTextarea.value);
	}
	return this.editor.getFinalContent();
}