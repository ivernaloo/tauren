/*******************************************************************************
 * NetEase New Mail System 2010 Version. * * File Name: editor.js * Written by:
 * yhzheng * * Version 1.0 (MSIE 6.0 above,Firefox2.0,Netscape.) * Created Date:
 * 2010-08-30 * Copyright��1997-2010 NetEase.com Inc. All rights reserved. *
 ******************************************************************************/
/**
 * ���ļ�Ϊ�������伫�ٷ��3.5���HTML�༭��ģ����Ϊ�� ����ע��ʹ��YUI
 * Doc{http://developer.yahoo.com/yui/yuidoc/}��׼��
 * 
 * @module Editor
 * @version 1.0
 * @author yhzheng
 * @support IE6.0+/Firefox/Chrome/Safari/Opera 
 */

/**
 * Editorģ������
 * 
 * @class Editor
 * @constructor
 * @return {void}
 */

function Editor(oSettings) {

	this.editorIframe; // �༭����iframe
	this.win; // �༭��iframe��contentWindow
	this.doc; // �༭��iframe��document
	this.body; // �༭��iframe��body
	this.html;// iframe�༭��ĳ�ʼ������
	this.format;// ��ʽ������ʵ��
	this.query;// ��ѯ��ʵ��
	this.observer;// ������ʵ��
	this.history;// ��ʷ��¼��ʵ��
	this.editorView;// EditorView����
	
	this.debug=false;//�Ƿ��ǵ���״̬����Ҫ���ڿ���log
	this.isSimple=false;

	this.system = {}; // �洢������汾��this.system.ie/firefox/chrome/opera/safari,���
	// �������IE�ģ�this.system.ie��ֵ��������İ汾�ţ�!this.system.ie��ʾ
	// ��IE�����

	this.settings = { // ��ʼ���༭��ʱ������
		editorIframe : null,
		editorView : null,
		html : null
	};

	// �෽��
	this.setEditorView=fEditorSetEditorView;//����EditorView����
	this.getEditorView=fEditorGetEditorView;//��ȡEditorView����
	this.getNode = fEditorGetNode; // ����ID��ȡԪ��
	this.getIframeNode = fEditorGetIframeNode; // ����ID��ȡԪ��
	this.getInitHtml=fEditorGetInitHtml;//��ȡ��ʼ���༭���html�ַ���
	this.init = fEditorInit; // ��ʼ���༭��
	this.log = fEditorLog; // �����־
	this.extend = fEditorExtend; // ��չ����
	this.focus=fEditorFocus;//�۽�
	this.getUserAgent = fEditorGetUserAgent; // ��ȡuserAgent
	this.getBrowserVersion = fEditorGetBrowserVersion; // ��ȡ������汾��Ϣ
	this.edit = fEditorEdit; // ִ�������Ĭ�ϱ༭����
	this.getSelection = fEditorGetSelection; // ��ȡselection����
	this.getSelectedText = fEditorGetSelectedText; // ��ȡѡ�е��ı�
	this.getSelectedHtml = fEditorGetSelectedHtml; // ��ȡѡ�е�HTML
	this.getSelectedContent=fEditorGetSelectedContent;//��ȡѡ�е�����
	this.getSelectedNodes = fEditorGetSelectedNodes; // ��ȡ������ڽڵ�
	this.getTime=fEditorGetTime;//��ȡ��ǰʱ��
	this.getRange = fEditorGetRange;// ��ȡ��ǰ��range����
	this.selectRange = fEditorSelectRange;// ѡȡָ����range
	this.getStyle=fEditorGetStyle;//��ȡԪ����ʽ
	this.num2Rgb = fEditorNum2Rgb; // ����ֵת����RGB��ɫ
	this.num2HexForIe = fEditorNum2HexForIe; // ����ֵת����ʮ��������ɫ
	this.rgb2Hex = fEditorRgb2Hex; // ����ֵת����RGB��ɫ
	this.insertHtml = fEditorInsertHtml; // �ڹ�괦����HTML
	this.createTable = fEditorCreateTable; // ����һ�����
	this.getContent = fEditorGetContent; // ��ȡ�༭�������
	this.getFinalContent=fEditorGetFinalContent;//��ȡ����Ĭ��������ʽ���иߡ��ֺš�������ɫ�ȣ�������
	this.setContent = fEditorSetContent; // ���ñ༭�������
	this.htmlToText = fEditorHtmlToText;// htmlת��Ϊ���ı�
	this.textToHtml = fEditorTextToHtml;// ���ı�ת��Ϊhtml
	this.addEvent = fEditorAddEvent; // ����¼�
	this.removeEvent = fEditorRemoveEvent; // ɾ���¼�
	this.keydown = fEditorKeydown;// �������������
	this.findCommonAncestor = fEditorFindCommonAncestor;// ����ָ�������ڵ�����Ƚڵ�
	
	//�ṩ��compose�Ľӿ�
	this.insert=fEditorInsert;//����Ԫ��
	this.del=fEditorDelete;//ɾ��Ԫ��

	// ����
	this.Format = fEditorFormat; // ��ʽ���࣬���ڸ�ʽ������
	this.Query = fEditorQuery; // ��ѯ���࣬���ڲ�ѯ�༭��״̬
	this.Observer = fEditorObserver; // �������࣬������Ӽ�����
	this.History = fEditorHistory;// ��¼���࣬���ڳ���������
	this.Selection = fEditorSelection;// �Զ���ѡ����
	this.Range = fEditorRange;// �Զ��巶Χ��

	// ��������Ĺ��ߺ���
	this.createFormat = fEditorCreateFormat; // ������ʽ��ʵ��
	this.createQuery = fEditorCreateQuery; // ������ѯ��ʵ��
	this.createObserver = fEditorCreateObserver; // ����������ʵ��
	this.createHistory = fEditorCreateHistory;// ������¼��ʵ��
	this.createSelection = fEditorCreateSelecion;// �����Զ���ѡ��ʵ��
	this.createRange = fEditorCreateRange;// �����Զ��巶Χʵ��

	// ��ʼ��
	this.init(oSettings);
}
/**
 * ����EditorView����
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
 * ��ȡEditorView����
 * 
 * @method getEditorView
 * @param void
 * @return {object}����EditorView����
 * @for Editor
 */
function fEditorGetEditorView() {
	return this.editorView;
}
/**
 * ����id��ȡԪ��
 * 
 * @method getNode
 * @param {string}sId
 *            Ԫ��ID
 * @return {object} ƥ��Ԫ��
 * @for Editor
 */
function fEditorGetNode(sId) {
	return typeof sId == "string" ? document.getElementById(sId) : sId;
}
/**
 * ����id��ȡ�༭��iframe�ڵ�Ԫ��
 * 
 * @method getIframeNode
 * @param {string}sIdԪ��ID
 * @return {object} ƥ��Ԫ��
 * @for Editor
 */
function fEditorGetIframeNode(sId) {
	return typeof sId == "string" ? this.doc
			.getElementById(sId) : sId;
}
/**
 * ��ȡ��ʼ���༭���html�ַ���
 * 
 * @method getInitHtml
 * @param {object}oParams
 *                .html�༭���ڵ�Ĭ������
 *                .fontsizeĬ�����ִ�С
 *                .forecolorĬ��������ɫ
 * @return {string}���س�ʼ���༭���html�ַ���
 * @for Editor
 */
function fEditorGetInitHtml(oParams) {
	// ��ʼ��ʱ��ӿ�div��Ϊ�˽��ieĬ�ϵĻ������⣺Ĭ������µĻ�����<p>���������ݷ���div�Ĭ�ϻ�����div
	return '\
		<head><link href="http://img1.cache.netease.com/bbs/css/bbsglobal_v1.0.0.css" rel="stylesheet" type="text/css" /><style>\
				body{color:'+(oParams["forecolor"]||"#000000")+';font-size:'+(oParams["fontsize"]||"14px")
				+';line-height:1.7;padding:8px 10px;margin:0;\
				background-color:#ffffff;background-image:url("/bbs/img/edit/end_n_bg9.gif");background-repeat:no-repeat;background-position:center center;text-align:left;height:90%;background-attachment:fixed}\
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
				.postreset{font-weight:normal;font-family:����,serif;font-size:14px;background:#fff;color:#000;font-style:normal;text-decoration:none;}\
		</style></head><body>'+(this.system.ie?"<div>"+oParams.html+"</div>":oParams.html)+'</body>\
        ';
}
/**
 * ��ʼ���༭������
 * 
 * @method init
 * @param {object}oSettings��ʼ����
 * @return {void}
 * @see #getBrowserVersion #extend #initEditor
 * @for Editor
 */
function fEditorInit(oSettings) {
	var that=this;
	var oOwnSettings=that.settings;
	// ��ȡ������汾��Ϣ
	that.getBrowserVersion();
	// ���ò���
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
	// �򿪱༭ģʽ
	if (that.system.ie) {
		if (that.system.ie == "5.0") {
			oDoc.designMode = 'on';
		} else {
			// �޸�ie�³�ʼ��ʱҳ�涨λ���༭��BUG�����༭�������ӷ�Χ�ں�������Ϊ�ɱ༭
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
	// ��ʼ����ʽ������ʵ��
	that.format = that.createFormat();
	// ��ʼ����ѯ��ʵ��
	that.query = that.createQuery();
	// ��ʼ��������ʵ��
	that.observer = that.createObserver();
    // ��ʼ����ʷ��¼��ʵ��
	that.history = that.createHistory();
	// ��Ӽ��̼����¼������ã����Զ����ctrl-z��ctrl-y�滻Ĭ�ϵ�����
	that.observer.add({
				"el" : oDoc,
				"eventType" : "keydown",
				"fn" : that.keydown,
				"object" : that
			});
}
/**
 * ��ӡ��־
 * 
 * @method log
 * @param {string}sLog��־��Ϣ
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
 * ��չ����
 * 
 * @method extend(oTarget,oSource0[,oSource1,...,bOverwrite,oPropertiesList])
 * @param {object}oTarget��չ����
 * @param {object}oSource��չԴ��������һ�����߶��
 * @param {boolean}bOverwrite��дģʽ��true��ʾ��дģʽ�����Ḳ��ԭ�е���false��ʾһ��ģʽ�����Ḳ��ԭ�е���
 * @param {object}oPropertiesList��д���б�
 * @return {void}
 * @for Editor
 */
function fEditorExtend(oTarget) {
	var nArgsLength = arguments.length, bOverwrite, oPropertiesList;
    //��ȡ��дģʽ
	if (typeof(bOverwrite = arguments[nArgsLength - 1]) == 'boolean')
		nArgsLength--;
	else if (typeof(bOverwrite = arguments[nArgsLength - 2]) == 'boolean') {
		//��ȡ��д���б�
		oPropertiesList = arguments[nArgsLength - 1];
		nArgsLength -= 2;
	}
	//����Դ���󣬸�����
	for (var i = 1; i < nArgsLength; i++) {
		var oSource = arguments[i];
		for (var sProperty in oSource) {
			//����дģʽ�£����Ḳ��ԭ�е���
			if (bOverwrite === true || oTarget[sProperty] == undefined) {
				//�����������oPropertiesList���������ָ������
				if (!oPropertiesList || (sProperty in oPropertiesList))
					oTarget[sProperty] = oSource[sProperty];

			}
		}
	}
	return oTarget;
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
function fEditorFocus(oData) {
	if(!oData){
		this.win.focus();
	}else{
		// Ĭ�ϴ���
		var sName = oData["name"] || "win";
		// �۽�
		if(sName=="win"){
			this.win.focus();
		}else if(sName=="doc"){
			this.doc.focus();
		}else if(sName=="body"){
			this.doc.body.focus();
		}
		
		// ָ��Ԫ��
		var oElement = oData["element"];
		// ָ��ID
		if(oData["id"]){
			// ָ��Ԫ��
			oElement = this.getNode(oData["id"]);
		}
		if(oElement){
			// ��ȷλ��
			var nPos = oData["pos"];
			if(isNaN(nPos)){
				nPos = 0;
			}
			var oRange;
			if(window.getSelection){
				// ��ǰ����ѡ����
				var oSelection = this.win.getSelection();
				if(!oSelection){
					return false;
				}
				// ȡ��ѡ��
				if(oSelection.rangeCount > 0){
					oSelection.removeAllRanges();
				}
				// ����Χ
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
 * ��ȡ�����UserAgent��Ϣ
 * 
 * @method getUserAgent
 * @param void
 * @return {string} �����UserAgent��Ϣ
 * @for Editor
 */
function fEditorGetUserAgent() {
	return navigator.userAgent.toLowerCase();
}
/**
 * ��ȡ������汾
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
	// ʹ��������ʽ��userAgent����ȡ������汾��Ϣ
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
 * �༭��ִ��������Դ�����
 * 
 * @method edit(sType[,sParam])
 * @param {string}sType������,
 * @param {string}sParam�����������ѡ��
 * @return {boolean}true��ʾ�ɹ�ִ��
 * @see #log
 * @for Editor
 */
function fEditorEdit(sType, sParam) {
	//�۽��༭����
	this.win.focus();
	// ִ�������ԭ������
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
 * ���ڽ���ֵת��ΪRGB��ɫ
 * 
 * @method num2Rgb
 * @param {number}nColor
 * @return {string} ����rgb��ɫ
 * @for Editor
 */
function fEditorNum2Rgb(nColor) {
	// rgb��ɫ��3��ʮ����������ɣ���ߵ���ֵ���ұ���ֵ��256��
	var n1 = nColor % 256;
	var n2 = (nColor - n1) / 256 % 256;
	var n3 = (nColor - n1 - n2 * 256) / 65536;
	return "rgb(" + n3 + "," + n2 + "," + n1 + ")";
}
/**
 * IE�����ڽ���ѯ��ֵת��Ϊ����Ϊ�ߵ�ʮ��������ɫ
 * 
 * @method num2HexForIe
 * @param {number}nColor
 * @return {string} ����ʮ��������ɫ
 * @for Editor
 */
function fEditorNum2HexForIe(nColor) {
	//��ɫ�Ǻ�ɫʱ��nColor��ֵ��false
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
 * ���ڽ�RGB��ɫת��Ϊʮ��λɫ
 * 
 * @method rgb2Hex
 * @param {number}sRgb
 * @return {string} ����ʮ��λ��ʾ����ɫ
 * @for Editor
 */
function fEditorRgb2Hex(sRgb) {
	if (!/^rgb/i.test(sRgb)) {
		// �������rgb��ɫ�����账��ֱ�ӷ���
		return sRgb;
	}
	// ��ȡ����
	var aNum = sRgb.match(/[0-9]+/g);
	var nNum0 = parseInt(aNum[0]);
	var nNum1 = parseInt(aNum[1]);
	var nNum2 = parseInt(aNum[2]);
	// ת��Ϊʮ��������ɫ��������λ�ģ�������λ
	return "#" + (nNum0 > 15 ? nNum0.toString(16) : '0' + nNum0.toString(16))
			+ (nNum1 > 15 ? nNum1.toString(16) : '0' + nNum1.toString(16))
			+ (nNum2 > 15 ? nNum2.toString(16) : '0' + nNum2.toString(16));
}
/**
 * ��ȡselection����
 * 
 * @method getSelection
 * @param void
 * @return {object} ����selection����
 * @for Editor
 */
function fEditorGetSelection() {
	return this.system.ie ? this.doc.selection : this.win.getSelection();
}
/**
 * ��ȡ���ѡ���ı�
 * 
 * @method getSelectedText
 * @param void
 * @return {string} ���ع������λ�õ����֣����ѡ�е���ͼƬ�ȱ�ǩ������undefined
 * @for Editor
 */
function fEditorGetSelectedText() {
	if (this.system.ie) {
		return this.doc.selection.createRange().text;
	} else {
		var sText = this.win.getSelection().toString();
		if (sText == "") {
			// �ڷ�ie�£����sText==""���п�����ѡ����ͼƬ�ȱ�ǩ����Ҫ��һ����֤
			var sHtml = this.getSelectedHtml();
			if (/<[^>]*>/.test(sHtml)) {
				// ���ѡ�е���ͼƬ�ȱ�ǩ������undefined
				return undefined;
			}
		}
		return sText;
	}
}
/**
 * ��ȡ���ѡ��html
 * 
 * @method getSelectedText
 * @param void
 * @return {string} ���ع������λ�õ�Html
 * @see #getSelection
 * @for Editor
 */
function fEditorGetSelectedHtml() {
	var sel = this.getSelection();
	if (this.system.ie) {
		this.doc.body.focus();	// �޸�ie�²��ܲ������ӵ����⡣
		return sel.createRange().htmlText;
	} else {
		// ��ie������£�û�а취ֱ�ӻ��ѡ�е�html����������һ����ʱ��ǩ��innerHTML���Ի�ȡ
		var oSpan = document.createElement("span");
		var oFragment = sel.getRangeAt(0).cloneContents();
		oSpan.appendChild(oFragment);
		return oSpan.innerHTML;
	}
}
/**
 * ��ȡ���ѡ�е�����
 * 
 * @method getSelectedContent
 * @param void
 * @return {object} ����û�ѡ�������ı����򷵻�ѡ�е��ı������û��ѡ���ı����򷵻�ѡ�е�html������ͼƬ�������htmlҲû�У��򷵻�null
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
 * ��ȡ������ڽڵ�
 * 
 * @method getSelectedNodes
 * @param void
 * @return {object}���ع�����ڽڵ�
 * @see #createRange 
 * @see Range#getSelectedNodes
 * @for Editor
 */
function fEditorGetSelectedNodes() {
	return this.createRange().getSelectedNodes();
}
/**
 * ��ȡ��ǰʱ��,��ʽΪyyyy-MM-dd��yyyy-MM-dd hh:mm:ss
 * 
 * @method getTime([bHasTime])
 * @param {boolean}bHasTime �Ƿ���ʱ��(��ѡ)
 * @return {boolean} true ��ʾִ�гɹ�
 * @for Editor
 */
function fEditorGetTime(bHasTime) {
	var oDate=new Date();
	var nYear = oDate.getFullYear();
	var nMonth = oDate.getMonth() + 1;
	var nDate = oDate.getDate();
	// ��ʽ��ʱ��
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
 * ��ȡ��ǰrange����
 * 
 * @method getRange
 * @param void
 * @return {object} ���ص�ǰrange����
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
 * ѡȡ������range����
 * 
 * @method selectRange
 * @param {object}oRangeָ����range����
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
 * �ڹ�������HTML
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
		// ��ie������£�����ԭ���ı༭����
		this.edit("inserthtml", sHtml);
	}
}
/**
 * ��ȡԪ�ص�ǰ����ʽ
 * 
 * @method getStyle
 * @param {object}oEl
 * @param {string}sAttr(��ѡ)ָ����ʽ��
 * @return {object}��ȡԪ�ص�ǰ����ʽ
 * @for Editor
 */
function fEditorGetStyle(oEl, sAttr) {
	return sAttr ? oEl.currentStyle ? oEl.currentStyle[sAttr] : this.win
			.getComputedStyle(oEl, false)[sAttr] : oEl.currentStyle
			? oEl.currentStyle: this.win.getComputedStyle(oEl, false);
}
/**
 * �������
 * 
 * @method createTable
 * @param {object}oParams
 *            .row{string/number}������� 
 *            .column{string/number}�������
 *            .width{string/number}����� 
 *            .borderWidth{string/number}�߿���
 *            .borderSpacing{string/number}��Ԫ��߾� 
 *            .padding{string/number}��Ԫ����
 *            .other{object}�����������磺cellpedding��style��
 * @return {string} �����½�����HTML
 * @for Editor
 */
function fEditorCreateTable(oParams) {
	var aHtml = [];
	//ռλ�������chrome��������ձ����ʾ����������
	var sPlaceholder;
	if(this.system.ie){
		sPlaceholder="<div>&nbsp;</div>";
	}else{
		sPlaceholder="<br>";
	}
	var sStyle;
	aHtml.push("<table  border='1'");
	// ��Ԫ��߾�
	if (oParams["cellspacing"]) {
		aHtml.push(" cellspacing=");
		aHtml.push(oParams["cellspacing"]);
	}
	// ��Ӹ��Ӳ���
	var oOtherParams = oParams["other"];
	if (oOtherParams) {
		for (var key in oOtherParams) {
			if (key == "style") {
				// �Ѹ��ӵ�style��ȡ�������ں�߸�width����ʾһͬ���
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
		// ��Ӹ�����ʽ
		aHtml.push(sStyle);
		aHtml.push(";");
	}
	// �����
	if (oParams["width"]) {
		aHtml.push("width:");
		aHtml.push(oParams["width"]);
	}
	// �߿���
	if (oParams["borderWidth"]) {
		aHtml.push(";border-width:");
		aHtml.push(oParams["borderWidth"]);
	}
	// ��Ԫ��߾�,����Firefox
	if (oParams["cellspacing"]) {
		aHtml.push(";border-spacing:");
		aHtml.push(oParams["cellspacing"]);
	}
	aHtml.push(";'>");
	for (var i = 0; i < oParams["row"]; i++) {
		aHtml.push("<tr>");
		for (var j = 0; j < oParams["column"]; j++) {
			// Ϊʹ����ڸ������������ʾ��ȷ�Ĵ�С����Ҫ���һ���ո���Ϊռλ��
			aHtml.push("<td");
			if (oParams["padding"]) {
				aHtml.push(" style='padding:");
				aHtml.push(oParams["padding"]);
				aHtml.push("'>");
				//����ռλ��
				if(sPlaceholder){
				    aHtml.push(sPlaceholder);
				}
				aHtml.push("</td>");
			}
		}
		aHtml.push("</tr>");
	}
	//��ӿո񣬽����ie������У���������ڱ�������������ڱ���ڵ�����
	aHtml.push("</table>");
	return aHtml.join("");
}
/**
 * ��ȡ�༭������
 * 
 * @method getContent
 * @param void
 * @return {string} ���ر༭������
 * @for Editor
 */
function fEditorGetContent() {
	return this.doc.body.innerHTML;
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
 * ��ȡ����Ĭ��������ʽ���иߡ��ֺš�������ɫ�ȣ�������
 * 
 * @method getFinalContent
 * @param void
 * @return {string} ����Html����
 * @for EditorView
 */
function fEditorGetFinalContent() {
	var oSetting=this.setting;
	return "<div style='line-height:1.7;color:"+(oSetting["forecolor"]||"#000000")+";font-size:"+(
	oSetting["fontsize"]||"14px")+";font-family:"+(oSetting["fontname"]||"arial,verdana,sans-serif")
	+this.getContent()+"</div>";
}
/**
 * ���ñ༭������
 * 
 * @method setContent
 * @param {string}sContentҪ���������
 * @return {void}
 * @for Editor
 */
function fEditorSetContent(sContent) {
	// ���ñ༭��iframe��bodyΪָ������
	this.doc.body.innerHTML = sContent;
}
/**
 * ��ȡ���ı�����
 * 
 * @method htmlToText
 * @param {string}sHtml����html�ַ���
 * @return {string} ���ش��ı�����
 * @for Editor
 */
function fEditorHtmlToText(sHtml) {
	sHtml = sHtml.replace(/\n/ig, "");
	sHtml = sHtml.replace(/\\s+/ig, "");
	// �滻�鼶��ǩΪ���з�
	sHtml = sHtml.replace(/<\/(address|blockquote|center|dir|div|dl|fieldset|form|hr|h[1-6]|isindex|iframe|menu|ol|p|pre|table|ul)>/gi,"\n");
	// �滻���з�
	sHtml = sHtml.replace(/<br>/gi, "\n");
	// �����б�
	sHtml = sHtml.replace(/<li>/gi, " . ");
	// ��������html��ǩ
	sHtml = sHtml.replace(/<[^>]+>/g, "");
	// ����ת���ַ�
	sHtml = sHtml.replace(/&nbsp;/gi, " ");
	sHtml = sHtml.replace(/&lt;/gi, "<");
	sHtml = sHtml.replace(/&gt;/gi, ">");
	sHtml = sHtml.replace(/&quot;/gi, "\"");
	sHtml = sHtml.replace(/&amp;/gi, "&");
	return sHtml;
}
/**
 * �����ı�ת��Ϊhtml
 * 
 * @method textToHtml
 * @param {string}sText���봿�ı�
 * @return {string} ����html�ַ���
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
 * ����¼�
 * 
 * @method addEvent
 * @param {object}oParams
 *            {object}.elҪ����¼���Ԫ��;
 *            {string}.eventType�¼�����;
 *            {function}.fn�¼�������;
 * @return {void}
 * @for Editor
 */
function fEditorAddEvent(oParams) {
	oParams["el"].addEventListener ? oParams["el"].addEventListener(
			oParams["eventType"], oParams["fn"], false) : oParams["el"].attachEvent(
			'on' + oParams["eventType"], oParams["fn"]);
}
/**
 * ɾ���¼�
 * 
 * @method removeEvent
 * @param {object}oParams
 *            {object}.elҪɾ���¼���Ԫ��;
 *            {string}.eventType�¼�����;
 *            {function}.fn�¼�������;
 * @return {void}
 * @for Editor
 */
function fEditorRemoveEvent(oParams) {
	if (oParams["el"].detachEvent) {
		// ieɾ���¼�
		oParams["el"].detachEvent('on' + oParams["eventType"], oParams["fn"]);
	} else {
		// ��ie�����ɾ���¼�
		oParams["el"].removeEventListener(oParams["eventType"], oParams["fn"], false);
	}
}
/**
 * ����������İ����¼������Զ����ctrl-z��ctrl-y�滻Ĭ�ϵ�����
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
		// ��ȡ�¼�����
		var oEvent = oEditorView.getEvent(that.win);
		
		// û���¼����򷵻�
		if (!oEvent) {
			return;
		}
		
		var bStopEvent = false;
		// ����û�������crtl��
		if (oEvent.ctrlKey) {
			if (oEvent.keyCode == 90) {
				// �û�����ctrl-z,���г�������
				var oHistory=that.history;
				if (oHistory) {
					oHistory.undo();
				}
				bStopEvent = true;
			} else if (oEvent.keyCode == 89) {
				// �û�����ctrl-y,������������
				var oHistory=that.history;
				if (oHistory) {
					oHistory.redo();
				}
				bStopEvent = true;
			}
		} else if (oEvent.keyCode == 8) {
			// �û��������˸������ie�»᷵����һҳ
			var sText=oEditorView.editor.getSelectedText();
			//���sText==undefined���������ѡ����ͼƬ��Ԫ��
			if(sText==undefined){
				var oSel=oEditorView.editor.getSelection();
				if(/control/i.test(oSel.type)){
					//ɾ��ѡ������
					oSel.clear();
				}
				//���ⷵ����һҳ
				bStopEvent = true;
			}
		}else if (oEvent.keyCode == 13) {
			// �û������˻س��������뻻��
			// that.insertHtml("<br>");
			// bStopEvent=true;
		}
		// ���������Ĭ���¼�����ֹ�����Ĭ����Ϊ
		if (bStopEvent) {
			oEvent.returnValue = false;
			oEditorView.changeToolbar();
		}
	}
}
/**
 * ����ָ�������ڵ�����Ƚڵ�
 * 
 * @param {object}oNodeA�ڵ�A
 * @param {object}oNodeB�ڵ�B
 * @return {object}����ָ�������ڵ�����Ƚڵ�
 * @for Editor
 */
function fEditorFindCommonAncestor(oNodeA, oNodeB) {
	var oParentA = oNodeA;
	// ����oNodeA�ĸ��ڵ�
	while (oParentA) {
		var oParentB = oNodeB;
		// ����oNodeB�ĸ��ڵ�
		while (oParentB) {
			// ����ҵ��������ڵ㣬��ֱ�ӷ���
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
 * ����Ԫ��
 * 
 * @method insert
 * @param {object}oData
 *                .htmlҪ�����html
 *                .textҪ����Ĵ��ı�
 *                .imageҪ�����ͼƬhtml
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
	//ie��ȡ��ѡ��
	if (this.system.ie) {
		var oSel = this.doc.selection;
		//���ѡ���ǿ������ͣ���֮ǰ�������ͼƬ
		if (oSel.type == 'Control') {
			//ͼƬ��Χ����ֱ༭������ȥ��
			oSel.empty();
			var oRange = oSel.createRange();
			//������Ƶ������ͼƬ��
			oRange.move("textedit");
			oRange.select();
		}
	}
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
function fEditorDelete(oData) {
	var oElement = oData["element"];
	var sTag = oData["tag"];
	var oReg = oData["reg"];
	if (oElement) {
		// Ԫ��ɾ��
		oElement.parentNode.removeChild(oElement);
	} else if (sTag && oReg) {
		var aImage = this.doc.getElementsByTagName(oData["tag"]);
		// ͼƬ����ƥ��ɾ��
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
 * editorģ������Format
 * 
 * @class Format
 * @constructor
 * @param {object}oEditor ����ʵ��
 * @return {void}
 * @for Editor
 */
function fEditorFormat(oEditor) {

	//˽�б���
	var _editor = oEditor;// �༭��ʵ��
	
	//���б���
	this.span=_editor.doc.createElement("span");//�Զ����ʽ�����У�����cloneNode������ȡ�µ�span��ǩ�����Ч��

	// ���ñ༭��ʵ��
	this.getEditor = function() {
		return _editor;
	}
	
	//��ȡ�µ�span��ǩ
	this.getSpan=function(){
		return this.span.cloneNode(true);
	}

	// ���ߺ���
	this.dtd=fEditorFormatDtd;//��ȡdtd��ʽ����
	this.delTag = fEditorFormatDelTag;// ɾ��ָ���ڵ�ı�ǩ
	this.isNonFormat=fEditorFormatIsNonFormat;//���ָ���ڵ��Ƿ��ǿսڵ㣨����Ҫ��Ӹ�ʽ����ʽ��
	this.isInline=fEditorFormatIsInline;//���ָ����ǩ����Ԫ���Ƿ�������Ԫ��/�м�Ԫ��
	this.isBlock=fEditorFormatIsBlock;//���ָ����ǩ����Ԫ���Ƿ��ǿ鼶Ԫ��
	this.canRemoveIfEmpty=fEditorFormatCanRemoveIfEmpty;//���ָ����ǩ��û���ӽڵ�ʱ�Ƿ����ɾ��
	this.canAddStyle = fEditorFormatCanAddStyle;// ���ָ��Ԫ���Ƿ���������ʽ
	this.isDtdAlow = fEditorFormatIsDtdAlow;// ����ƶ�����Ԫ���Ƿ����dtd��׼
	this.getAttrs = fEditorFormatGetAttrs;// ��ȡָ��Ԫ�ص���������
	this.getStyle=fEditorFormatGetStyle;//��ȡָ��Ԫ�ص���ʽ
	this.addStyle = fEditorFormatAddStyle;// �����ʽ
	this.removeStyle = fEditorFormatRemoveStyle;// ɾ����ʽ
	this.addStyleForRange=fEditorFormatAddStyleForRange;//Ϊ����ѡ�������ʽ
	this.removeStyleForRange=fEditorFormatRemoveStyleForRange;//Ϊ����ѡ��ɾ����ʽ
	this.edit = fEditorFormatEdit;// �Զ���༭����
	this.turnToHtml = fEditorFormatTurnToHtml;// ���ڵ�ת��Ϊhtml�ַ���

	// ����
	this.undo = fEditorFormatUndo;// ����
	this.redo = fEditorFormatRedo;// ����
	this.copy = fEditorFormatCopy;// ����
	this.cut = fEditorFormatCut;// ����
	this.paste = fEditorFormatPaste;// ճ��
	this.deleteOut = fEditorFormatDeleteOut;// ɾ��
	this.insertHtml=fEditorFormatInsertHtml;//����html�ַ���
	this.bold = fEditorFormatBold;// �Ӵ�
	this.underline = fEditorFormatUnderline;// �»���
	this.indent = fEditorFormatIndent;// ����
	this.outdent = fEditorFormatOutdent;// ͻ��
	this.italic = fEditorFormatItalic;// б��
	this.strikethrough = fEditorFormatStrikethrough;// �л���
	this.superscript = fEditorFormatSuperscript;// �ϱ�
	this.subscript = fEditorFormatSubscript;// �±�
	this.insertOrderedList = fEditorFormatInsertOrderedList;// �����б�/�����б�
	this.insertUnorderedList = fEditorFormatInsertUnorderedList;// �����б�/�����б�
	this.justifyLeft = fEditorFormatJustifyLeft;// �����
	this.justifyCenter = fEditorFormatJustifyCenter;// ���ж���
	this.justifyRight = fEditorFormatJustifyRight;// �Ҷ���
	this.fontname = fEditorFormatFontname;// ����
	this.createLink = fEditorFormatCreateLink;// �½�����
	this.unLink=fEditorFormatUnLink;//ɾ������
	this.fontsize = fEditorFormatFontsize;// �ֺ�
	this.lineheight = fEditorFormatLineheight;// �и�
	this.backcolor = fEditorFormatBackcolor;// ����ɫ
	this.forecolor = fEditorFormatForecolor;// ������ɫ
	this.insertHorizontalRule = fEditorFormatInsertHorizontalRule;// ����ˮƽ�ָ���
	this.insertTable = fEditorFormatInsertTable;// ������
	this.removeFormat = fEditorFormatRemoveFormat;// �����ʽ
	this.insertImage = fEditorFormatInsertImage;// ����ͼƬ
	this.insertTime=fEditorFormatInsertTime;//���뵱ǰʱ��
	this.exec=fEditorFormatExec;//ִ��ָ�������¼�༭��ʷ
	
    //��ʼ��dtd��ʽ����
	this.dtd = this.dtd();
}
/**
 * ����һ��Format����
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
 * ��ȡdtd��ʽ����
 * @method dtd
 * @return {object}����dtd��ʽ����
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

		//body���Ԫ��
		$nonBodyContent: X(V,U,S),

		//�鼶Ԫ��
		$block : block,

		//�鼶����Ԫ��
		$blockLimit : { body:1,div:1,td:1,th:1,caption:1,form:1 },

		//����Ԫ��/�м�Ԫ��
		$inline : L,

		$body : X({script:1,style:1}, block),

		$cdata : {script:1,style:1},

		//û���ӽڵ��Ԫ��
		$empty : {area:1,base:1,br:1,col:1,hr:1,img:1,input:1,link:1,meta:1,param:1},
		
		//�б���Ԫ��
		$listItem : {dd:1,dt:1,li:1},

		//�б�Ԫ��
	    $list: { ul:1,ol:1,dl:1},

	    //���԰����ı��������ܱ༭��Ԫ��
		$nonEditable : {applet:1,button:1,embed:1,iframe:1,map:1,object:1,option:1,script:1,textarea:1,param:1},

		//���û���ӽڵ㣬����Ժ��Ե�Ԫ��
		$removeEmpty : {abbr:1,acronym:1,address:1,b:1,bdo:1,big:1,cite:1,code:1,del:1,dfn:1,em:1,font:1,i:1,ins:1,label:1,kbd:1,q:1,s:1,samp:1,small:1,span:1,strike:1,strong:1,sub:1,sup:1,tt:1,u:1,'var':1},

		//��tabindex����Ĭ��Ϊ0��Ԫ��
		$tabIndex : {a:1,area:1,button:1,input:1,object:1,select:1,textarea:1},

		//table�ڵ�Ԫ��
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
 * ɾ��ָ���ڵ�ı�ǩ���磺<p>123</p> -> 123
 * 
 * @method delTag
 * @param {object}oNode����ڵ�
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
		// �ڵ�ǰ�ڵ�ǰ�����亢�ӽڵ�
		for (var j = 0; j < nLen; j++) {
			oParentNode.insertBefore(aChildren[0], oNode);
		}
		// �Ƴ���ǰ�ڵ�
		oParentNode.removeChild(oNode);
	}
}
/**
 * ���ָ���ڵ��Ƿ��ǿսڵ㣨����Ҫ��Ӹ�ʽ����ʽ��
 * 
 * @method isNonFormat
 * @param {string}sNodeNameԪ����
 * @return {boolean} true��ʾָ��Ԫ�����ı�ǩ�ǿսڵ㣨����Ҫ��Ӹ�ʽ����ʽ��
 * @for Format
 */
function fEditorFormatIsNonFormat(sNodeName) {
	sNodeName = sNodeName.toLowerCase();
	return this.dtd.$empty[sNodeName]==1?true:false;
}
/**
 * ���ָ���ڵ�������Ԫ��/�м�Ԫ��
 * 
 * @method isInline
 * @param {string}sNodeNameԪ����
 * @return {boolean} true��ʾָ��Ԫ�����ı�ǩ������Ԫ��/�м�Ԫ��
 * @for Format
 */
function fEditorFormatIsInline(sNodeName) {
	sNodeName = sNodeName.toLowerCase();
	return this.dtd.$inline[sNodeName]==1?true:false;
}
/**
 * ���ָ���ڵ��ǿ鼶Ԫ��
 * 
 * @method isBlock
 * @param {string}sNodeNameԪ����
 * @return {boolean} true��ʾָ��Ԫ�����ı�ǩ�ǿ鼶Ԫ��
 * @for Format
 */
function fEditorFormatIsBlock(sNodeName) {
	sNodeName = sNodeName.toLowerCase();
	return this.dtd.$block[sNodeName]==1?true:false;
}
/**
 * ������Ԫ����û���ӽڵ�ʱ�Ƿ����ɾ��
 * 
 * @method canRemoveIfEmpty
 * @param {string}sNodeNameԪ����
 * @return {boolean} true��ʾָ��Ԫ�����ı�ǩ��û���ӽڵ�ʱ����ɾ��
 * @for Format
 */
function fEditorFormatCanRemoveIfEmpty(sNodeName) {
	sNodeName = sNodeName.toLowerCase();
	return this.dtd.$removeEmpty[sNodeName]==1?true:false;
}
/**
 * ���ָ���ڵ��Ƿ���������ʽ
 * 
 * @method canAddStyle
 * @param {string}sNodeNameԪ����
 * @return {boolean} true��ʾָ��Ԫ�����ı�ǩ���������ʽ
 * @for Format
 */
function fEditorFormatCanAddStyle(sNodeName) {
	sNodeName = sNodeName.toLowerCase();
	return sNodeName == "span" || sNodeName == "div" || sNodeName == "table"
			|| sNodeName == "form";
}
/**
 * ���ָ�������ڵ�ĸ��ӹ�ϵ�Ƿ����dtd��׼
 * 
 * @method isDtdAlow
 * @param {object}oParent ���ڵ�
 * @param {object}oChild �ӽڵ�
 * @return {boolean} true��ʾָ�������ڵ����dtd��׼
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
 * ��ȡָ���ڵ��ȫ������
 * 
 * @method getAttrs
 * @param {object}oNode�����ڵ�
 * @return {array}����ָ���ڵ��ȫ������,json��ʽ
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
 * ��ȡԪ�ص�ǰ����ʽ,����lineHeight���ذٷ�ֵ
 * 
 * @method getStyle
 * @param {object}oEl
 * @param {string}sAttr(��ѡ)ָ����ʽ��
 * @return {object}��ȡԪ�ص�ǰ����ʽ
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
			// �������ѯ���ͳһת��Ϊpx
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
 * �����ʽ��ͬʱ����ѡ��������ɾ�������ǩ���ϲ����Ժϲ��ı�ǩ��
 * 
 * @method addStyle
 * @param {object}oNode �����ڵ�
 * @param {string}sStyle ��ʽ��
 * @param {string}sValue ��ʽֵ
 * @param {array}aNodes ������ڵ�����
 * @return {object}oNode �����޸ĺ�Ľڵ�
 * @see #isDtdAlow #canAddStyle
 * @for Format
 */
function fEditorFormatAddStyle(oNode, sStyle, sValue,aNodes) {
	//�����ǰ����Ϊ�ջ��߲����ڵ��ǲ���Ҫ�����ʽ�Ľڵ㣬��ֱ�ӷ���
	if(!oNode||this.isNonFormat(oNode.nodeName)){
		return null;
	}else if (oNode.hasChildNodes()) {
		var aChildren = oNode.childNodes;
		var nLength = aChildren.length;
		var aAttrs = this.getAttrs(oNode);
		if(!/span/i.test(oNode.nodeName)){
			if(aAttrs.length==0){
				var oPre = oNode.previousSibling;
				//���ǰһ���ڵ���԰�����ǰ�ڵ㣬��ֱ�ӽ���ǰ�ڵ���뵽ǰһ���ڵ���
				if(oPre&&/span/i.test(oPre.nodeName)&&this.isDtdAlow(oPre,oNode)&&this.getStyle(oPre,sStyle)==sValue){
					oPre.appendChild(oNode);
				}
			}
		}else {
			// �����ǰ�ڵ���span��������ֻ��һ��sStyle��style���ԣ��磺<span style="sStyle:value">****</span>,
			// ���Ҹ��ڵ��sStyle����sValue,��ɾ���˽ڵ�
			if (aAttrs.length == 1 && aAttrs[0].nodeName == "style"
					&& aAttrs[0].nodeValue.split(";").length == 1
					&& aAttrs[0].nodeValue.indexOf(sValue) > 0) {
				//������ڵ��Ӧ����ʽ���ڵ�ǰҪ��ӵ���ʽ����ѵ�ǰ�ڵ�ı�ǩɾ��
				if (this.getStyle(oNode.parentNode, sStyle) == sValue) {
					var oParent = oNode.parentNode;
					// �Ѻ��ӽڵ��ƶ�����ǰ�ڵ�ǰ
					for (var i = 0; i < aChildren.length; i++) {
						oParent.insertBefore(aChildren[0], oNode);
						if(aChildren[0].nodeType!=3)aNodes.push(aChildren[0]);
					}
					// ɾ����ǰ�ڵ�
					oParent.removeChild(oNode);
					return;
				} else {
					var oPre = oNode.previousSibling;
					// ���ǰһ���ֵܽڵ���԰�����ǰ�ڵ���ӽڵ�
					if (oPre && /span/i.test(oPre.nodeName)
							&& this.getStyle(oPre, sStyle) == sValue) {
						// �Ѻ��ӽڵ��ƶ���ǰ���span��
						for (var i = 0; i < aChildren.length; i++) {
							oPe.append(aChildren[0]);
							if(aChildren[0].nodeType!=3)aNodes.push(aChildren[0]);
						}
						// ɾ����ǰ�ڵ�
						oParent.removeChild(oNode);
						return;
					}
				}
			}
		}
		
		// �����ǰ�ڵ��Ӧ��ʽ��ֵ��ָ��ֵ֮���ֵ,����ָ��ֵ����ԭֵ
		if (this.getStyle(oNode,sStyle)!= sValue) {
			oNode.style[sStyle] = sValue;
		}

		// ���ӽڵ���봦��������
		for (var i = 0; i < nLength; i++) {
			aNodes.push(aChildren[i]);
		}
	} else if (oNode.nodeType == 3) {
		// �����ı��ڵ�
		var oParent=oNode.parentNode;
		//������ڵ��Ӧ��style��ָ��ֵ�Ĳ�ͬ
		if (this.getStyle(oParent,sStyle) != sValue) {
			var oPre=oNode.previousSibling;
			//���ǰһ���ڵ���԰�����ǰ�ı�����ֱ�ӽ���ǰ�ı����뵽ǰһ���ڵ���
			if(oPre&&/span/i.test(oPre.nodeName)&&this.getStyle(oPre,sStyle) == sValue){
				oPre.appendChild(oNode);
			}else if(oParent.childNodes.length==1&&!/body/i.test(oParent.nodeName)){
				//������ڵ�ֻ��һ���ӽڵ㣬��ֱ���ڸ��ڵ�����Ӷ�Ӧstyle
				oParent.style[sStyle]=sValue;
			}else{
				//�����½�һ������ָ����ʽ��span�����ѵ�ǰ�ڵ�ŵ�span��
				var oSpan = this.getSpan();
			    oSpan.style[sStyle] = sValue;
			    oParent.insertBefore(oSpan, oNode);
			    oSpan.appendChild(oNode);
			}
		}
	} else if (this.canRemoveIfEmpty(oNode.nodeName)) {
		// ɾ������ڵ�
		oNode.parentNode.removeChild(oNode);
	}
	return oNode;
}
/**
 * ɾ����ʽ
 * 
 * @method removeStyle
 * @param {object}oNode����ڵ� oFormat ��ǰFormatʵ��{string}sStyle ��ʽ��, sValue��ʽֵ
 * @return {object}oNode �����޸ĺ�Ľڵ�
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
				// ���õ�ǰ�ڵ�
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
 * �����ʽ
 * 
 * @method addStyleForRange
 * @param {object}oRange����ѡ��
 * @param {string}sStyle��ʽ��
 * @param {string}sValue��ʽֵ
 * @return {object}oNode �����޸ĺ�Ľڵ�
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
 * ɾ����ʽ
 * 
 * @method removeStyleForRange
 * @param {object}oNode
 *            ����ڵ� oFormat ��ǰFormatʵ��{string}sStyle ��ʽ��, sValue��ʽֵ
 * @return {object}oNode �����޸ĺ�Ľڵ�
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
				// ���õ�ǰ�ڵ�
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
 * ִ���Զ���༭����
 * 
 * @method edit
 * @param {string}sType������,sParam�������
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor,#addStyleForRange
 * @see Editor#createSelection
 * @see Selection#getRange,#addRange
 * @for Format
 */
function fEditorFormatEdit(sType, sParam) {
	var oEditor=this.getEditor();
	try {
		// ��ȡ�Զ���Selection����
		var oSel = oEditor.createSelection();
		// ��ȡ�Զ���Range����
		var oRange = oSel.getRange();
		// Ϊѡ�������ʽ
		this.addStyleForRange(oRange, sType, sParam);
		// ����Ϊ����
		oSel.addRange(oRange);
		return true;
	} catch (e) {
		oEditor.log(e);
		return false;
	}
}
/**
 * �Ѵ���Ľڵ�ת��Ϊhtml�ַ���
 * 
 * @method turnToHtml
 * @param {object}oNode��Ҫת���Ľڵ�
 * @return {string} ����ת�����html
 * @see #getEditor
 * @for Format
 */
function fEditorFormatTurnToHtml(oNode) {
	// ����һ����ʱ��ǩ
	var oDiv = this.getEditor().doc.createElement("div");
	// �Ѵ���ڵ�ĸ�����ӵ���ʱ��ǩ
	oDiv.appendChild(oNode.cloneNode(true));
	return oDiv.innerHTML;
}
/**
 * ����
 * 
 * @method undo
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor History#undo
 * @for Format
 */
function fEditorFormatUndo() {
	return this.getEditor().history.undo();
}
/**
 * ����
 * 
 * @method redo
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor History#redo
 * @for Format
 */
function fEditorFormatRedo() {
	return this.getEditor().history.redo();
}
/**
 * ���ƣ�ֻ��IE�¿��ã�
 * 
 * @method copy
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�,false ��ʾ���ɹ�
 * @for Format
 */
function fEditorFormatCopy() {
	var oEditor=this.getEditor();
	if (oEditor.system.ie) {
		oEditor.edit("copy");
		return true;
	} else {
		// ��ie��������ڰ�ȫԭ�򣬲�֧�ִβ���
		return false;
	}
}
/**
 * ���У�ֻ��IE�¿��ã�
 * 
 * @method cut
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�,false ��ʾ���ɹ�
 * @for Format
 */
function fEditorFormatCut() {
	var oEditor=this.getEditor();
	if (oEditor.system.ie) {
		oEditor.edit("cut");
		return true;
	} else {
		// ��ie��������ڰ�ȫԭ�򣬲�֧�ִβ���
		return false;
	}
}
/**
 * ճ����ֻ��IE�¿��ã�
 * 
 * @method paste
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�,false ��ʾ���ɹ�
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
		// ��ie��������ڰ�ȫԭ�򣬲�֧�ִ˲���
		return false;
	}
}
/**
 * ɾ����ֻ��IE�¿��ã�
 * 
 * @method deleteOut
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�,false ��ʾ���ɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatDeleteOut() {
	var oEditor=this.getEditor();
	if (oEditor.system.ie) {
		oEditor.edit("delete");
		return true;
	} else {
		// ��ie��������ڰ�ȫԭ�򣬲�֧�ִβ���
		return false;
	}
}
/**
 * ����html�ַ���
 * 
 * @method insertHtml
 * @param {string}sHtmlҪ�����html�ַ���
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatInsertHtml(sHtml) {
	this.getEditor().insertHtml(sHtml);
	return true;
}
/**
 * ����/ȡ���Ӵ�
 * 
 * @method bold
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatBold() {
	this.getEditor().edit("bold");
	return true;
}
/**
 * ����/ȡ���»���
 * 
 * @method underline
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatUnderline() {
	this.getEditor().edit("underline");
	return true;
}
/**
 * ��������
 * 
 * @method indent
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatIndent() {
	this.getEditor().edit("indent");
	return true;
}
/**
 * ȡ������
 * 
 * @method outdent
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatOutdent() {
	this.getEditor().edit("outdent");
	// ie�����û�������ˣ�Ҫ���������p��ǩ
	/*
	 * if (this.getEditor().system.ie) { // ��ѯ�Ƿ������� var bIsIndent =
	 * this.getEditor().query.indent(); // ���û������ if (!bIsIndent) { // ��ȡ������ڽڵ�
	 * var oNode = this.getEditor().getFocusNode(); // Ѱ�ҵ�һ��p�ڵ� while (oNode &&
	 * !/p/i.test(oNode.nodeName)) { oNode = oNode.parentNode; } // ɾ��p�ڵ� if
	 * (/p/i.test(oNode.nodeName)) { this.delTag(oNode); } } }
	 */
	return true;
}
/**
 * ����/ȡ��б��
 * 
 * @method italic
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatItalic() {
	this.getEditor().edit("italic");
	return true;
}
/**
 * ����/ȡ���л���
 * 
 * @method strikethrough
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatStrikethrough() {
	this.getEditor().edit("strikethrough");
	return true;
}
/**
 * ����/ȡ���ϱ�
 * 
 * @method superscript
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatSuperscript() {
	this.getEditor().edit("superscript");
	return true;
}
/**
 * ����/ȡ���±�
 * 
 * @method subscript
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatSubscript() {
	this.getEditor().edit("subscript");
	return true;
}
/**
 * ����/ȡ�������б�(�����б�)
 * 
 * @method insertOrderedList
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatInsertOrderedList() {
	this.getEditor().edit("InsertOrderedList");
	return true;
}
/**
 * ����/ȡ�������б������б�
 * 
 * @method insertUnorderedList
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatInsertUnorderedList() {
	this.getEditor().edit("InsertUnorderedList");
	return true;
}
/**
 * ���������
 * 
 * @method justifyLeft
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatJustifyLeft() {
	this.getEditor().edit("JustifyLeft");
	return true;
}
/**
 * ���þ��ж���
 * 
 * @method justifyCenter
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatJustifyCenter() {
	this.getEditor().edit("JustifyCenter");
	return true;
}
/**
 * �����Ҷ���
 * 
 * @method justifyRight
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatJustifyRight() {
	this.getEditor().edit("JustifyRight");
	return true;
}
/**
 * ��������
 * 
 * @method createLink
 * @param {string}sTitle���ӱ���,
 *            sUrl���ӵ�ַ
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#getSelectedText Editor#insertHtml
 * @for Format
 */
function fEditorFormatCreateLink(sTitle, sUrl) {
	var oEditor=this.getEditor();
	oEditor.win.focus();
	if (sTitle!=undefined) {
		// ����б���
		//����������в��뱾���urlʱ����������Զ�תΪ��Զ�λurl�������ڲ�����a��ǩ��������href����
		oEditor.insertHtml("<a target='_blank' id='editorAddLink010'>" + sTitle + "</a>");
		var oLink=oEditor.doc.getElementById("editorAddLink010");
		oLink.href=sUrl;
		oLink.removeAttribute("id");
	} else {
		var oLnk=oEditor.doc.createElement("a");
		oLnk.href=sUrl;
		oLnk.target="_blank";
		// �������δ���壬�������ΪͼƬ�ȿؼ��������
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
 * ɾ������
 * 
 * @method unLink
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
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
 * ��������
 * 
 * @method fontname
 * @param {string}sFontName��������
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #edit #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatFontname(sFontName) {
	var oEditor=this.getEditor();
	if (true) {//zyh opera�������⣬��ʱ����ԭ������
		// ��opera�£�ʹ��ϵͳԭ������
		oEditor.edit("fontname", sFontName);
	} else if(oEditor.system.opera){
		this.edit("fontFamily", sFontName);
	}
	return true;
}
/**
 * �������ִ�С
 * 
 * @method fontsize
 * @param {string}sSize ���ִ�С�����ر�ʾ
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #edit
 * @for Format
 */
function fEditorFormatFontsize(sSize) {
	return this.edit("fontSize", sSize);
}
/**
 * ���������о�
 * 
 * @method lineheight
 * @param {string}sHeight �о��С���ٷ�����ʾ
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #edit
 * @for Format
 */
function fEditorFormatLineheight(sHeight) {
	return this.edit("lineHeight", sHeight);
}
/**
 * ���ñ�����ɫ
 * 
 * @method backcolor
 * @param {string}sColor������ɫ
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatBackcolor(sColor) {
	var oEditor=this.getEditor();
	if (oEditor.system.ie) {
		oEditor.edit("backcolor", sColor);
	} else if (this.getEditor().system.firefox) {
		// firefox����Ҫ����('usecss',false,false)������hilitecolor��ʧЧ
		oEditor.edit('usecss', false);
		// firefox��ֱ��ʹ��rgb��ɫ���ÿ��ܻ���������������Զ��庯��ת��Ϊʮ��λ��ɫ��������
		oEditor.edit("hilitecolor", this.getEditor().rgb2Hex(sColor));
		// ִ����"hilitecolor"�����Ҫ�ָ�"usecss"����,����������˳��ִ��
		oEditor.edit("usecss", true);
	} else {
		oEditor.edit("hilitecolor", sColor);
	}
	return true;
}
/**
 * ����ǰ��ɫ��������ɫ��
 * 
 * @method forecolor
 * @param {string}sColor������ɫ,��������λ��������д�����磺#FF0000,����д��#F00
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatForecolor(sColor) {
	var oEditor=this.getEditor();
	if (!oEditor.system.firefox) {
		oEditor.edit("forecolor", sColor);
	} else {
		// firefox��ֱ��ʹ��rgb��ɫ���ÿ��ܻ���������������Զ��庯��ת��Ϊʮ��λ��ɫ��������
		oEditor.edit("forecolor", this.getEditor().rgb2Hex(sColor));
	}
	return true;
}
/**
 * ����ˮƽ��
 * 
 * @method insertHorizontalRule
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatInsertHorizontalRule() {
	this.getEditor().edit("InsertHorizontalRule");
	return true;
}
/**
 * ɾ����ʽ
 * 
 * @method removeFormat
 * @param void
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#edit
 * @for Format
 */
function fEditorFormatRemoveFormat() {
	//this.getEditor().edit("removeFormat");
	var oEditor = this.getEditor(),
	    html;
	html = oEditor.getSelectedHtml();
	//���û��ѡ�����֣����ȫ��ִ��
	if ( html == "" ) {
		html = oEditor.getContent();
		oEditor.setContent("");
	}
	
	// ȥ��ǩ����������
    //html = html.replace(/<(?:\s)*(\w+)(?:\s+[^>]*)?>/gi, "<$1>");
	// ȥ�¼�
	html = html.replace(/\s+on(?:load|change|submit|select|blur|focus|click|keydown|keypress|keyup|mouseover|mouseout|mouseup|error)=(['"]?)[^\1]*?\1\s*/gi, ' ');
	// ȥ��ʽ
	html = html.replace(/\s+(?:style|class)=(['"]?)[^\1]*?\1\s*/gi, ' ');
	// ȥһЩ����
	html = html.replace(/\s+(?:id|name|lang|xml:lang|dir|accesskey|tabindex|error)=(['"]?).*?\1\s*/gi, ' ');
	// ȥ�����ʽ
	html = html.replace(/<(table|thead|tfoot|tbody|tr|td|th|caption)((?:\s+[^<>]*)?)>/gi, function($1, $2, $3) {
		return '<' + $2 + ($3.match(/\s(rowspan|colspan|border|cellspacing|cellpadding|width|height|align|valign)="\d+"/ig) || '') + '>';
	});
	
	// ������h��ǩ��p�滻Ϊdiv
	html = html.replace(/<(\/)?(?:h1|h2|h3|h4|h5|h6|p)(?:\s+[^<>]*)?>/gi, '<$1div>');
	// ȥ���������ڱ�ǩ
	html = html.replace(/<\/?(?:span|strong|b|i|em|o|font|big|small|sub|sup|bdo|u|s)(?:\s+[^<>]*)?>/gi, '');
	// ���������
	html = html.replace(/<a(?:\s+[^<>]*)?>(?:\s*|(?:&nbsp;)*)<\/a>/gi, '');
	// �������href������
	html = html.replace(/<a(?:\s*|(?:&nbsp;)*)>((?:.|\s)*?)<\/a>/gi, '$1');
	// ȥ��������ʽ�������ű�
	html = html.replace(/<(style|script)(?:\s+[^<>]*)?>[^<]*<\/(style|script)>/gi, '');
	// ��ע��
	html = html.replace(/<!--(.|\s)*?-->/gi, '');
	
	
	// ɾ��ul,ol,dl
	html = html.replace(/<(\/)?(?:ul|ol|dl)(?:\s+[^<>]*)?>/gi, '');
	// ��li,dt,dd�滻Ϊdiv
	html = html.replace(/<(\/)?(?:li|dt|dd)(?:\s+[^<>]*)?>/gi, '<$1div>');
	
	// ����Ĭ����ʽ
	if ( html.match(/<(.*)>.*<\/\1>|<(.*) \/>/) == null ) {
		html = '<span class="postreset">' + html + '</span>';
	} else {
		html = '<div class="postreset">' + html + '</div>';
	}
	
	this.insertHtml(html);
	
	return true;
}
/**
 * ����ͼƬ
 * 
 * @method insertHtml
 * @param {string}sUrlͼƬ��url,sWidthͼƬ���,sHeightͼƬ�߶�
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#insertHtml
 * @for Format
 */
function fEditorFormatInsertImage(sUrl, sWidth, sHeight) {
	this.getEditor().insertHtml("<img src='" + sUrl + "' width='" + sWidth
			+ "' height='" + sHeight + "'/>");
	return true;
}
/**
 * ���뵱ǰʱ��,��ʽΪyyyy-MM-dd��yyyy-MM-dd hh:mm:ss
 * 
 * @method insertTime([bHasTime])
 * @param {boolean}bHasTime �Ƿ���ʱ��(��ѡ)
 * @return {boolean} true ��ʾִ�гɹ�
 * @see #getEditor Editor#insertHtml #getTime
 * @for Format
 */
function fEditorFormatInsertTime(bHasTime) {
	var oEditor=this.getEditor();
	oEditor.insertHtml(oEditor.getTime(bHasTime));
	return true;
}
/**
 * ִ��ָ�������¼�༭��ʷ
 * 
 * @method exec
 * @param {string}sCommand
 * @param {object}oParams���������������string���ͣ�Ҳ������json����
 * @return {boolean} true��ʾ�ɹ�ִ������
 * @see #getEditor Editor.History#save
 * @for Format
 */
function fEditorFormatExec(sCommand,oParams) {
	//�����һ����������������
	var oEditor=this.getEditor();
	var oEditorView=oEditor.getEditorView();
	//����ִ�м�����
	var oResult=oEditorView.notifyListener("onStartFormat",{"command":sCommand});
	//���������Ҫ��ֹͣ������������false
	if(oResult["stop"]){
		return false;
	}
	var nLength=arguments.length;
	var bSuccess;
	if(nLength==1){
		bSuccess=this[sCommand]();
	}else{
		//���ڴ洢��2�������Ĳ���
		var aArgs=new Array();
		for(var i=1;i<nLength;i++){
			aArgs.push(arguments[i]);
		}
		//��������ʱ�����µĲ���aArgs
		bSuccess=this[sCommand].apply(this,aArgs);
	}
	// ����ǳ���������������������༭��ʷ
	if (sCommand != "undo" && sCommand != "redo") {
		oEditor.history.save();
	}
	//����ִ�м�����
	oEditorView.notifyListener("onEndFormat",{"command":sCommand});
	return bSuccess;
}
/**
 * ������
 * 
 * @method insertTable
 * @param {object}oParams
 *            .row{string/number}������� 
 *            .column{string/number}�������
 *            .width{string/number}����� 
 *            .borderWidth{string/number}�߿���
 *            .borderSpacing{string/number}��Ԫ��߾� 
 *            .padding{string/number}��Ԫ����
 *            .other{object}�����������磺cellpedding��style��
 * @return {boolean} true��ʾ�ɹ�����
 * @see #getEditor Editor#insertHtml Editor#createTable
 * @for Format
 */
function fEditorFormatInsertTable(oParams) {
	var oEditor=this.getEditor();
	oEditor.insertHtml(oEditor.createTable(oParams));
	return true;
}
/**
 * Query�࣬���ڲ�ѯ�༭��״̬
 * 
 * @method Query
 * @param {object}oEditor����༭���࣬����ʹ��
 * @return {void}
 * @see #getEditor Editor#edit
 * @for Editor
 */
function fEditorQuery(oEditor) {
	var _editor = oEditor;// �༭��ʵ��
	// ���ñ༭��ʵ��
	this.getEditor = function() {
		return _editor;
	}

	this.queryCommandState = fEditorQueryCommandState; // ʹ��ϵͳ�����ѯ���������״̬(true/false)
	this.queryCommandValue = fEditorQueryCommandValue; // ʹ��ϵͳ�����ѯ���������״̬(value)
	this.queryState = fEditorQueryQueryState; // �Զ����ѯ���������״̬(value)
	
	this.undo=fEditorQueryUndo;//��ѯ�Ƿ����ִ�г�������
	this.redo=fEditorQueryRedo;//��ѯ�Ƿ����ִ����������
	this.bold = fEditorQueryBold; // ��ѯ������������Ƿ�Ӵ�
	this.underline = fEditorQueryUnderline; // ��ѯ������������Ƿ����»���
	this.indent = fEditorQueryIndent; // ��ѯ������������Ƿ�������
	this.outdent = fEditorQueryOutdent; // ��ѯ������������Ƿ�ͻ��
	this.italic = fEditorQueryItalic; // ��ѯ������������Ƿ�б��
	this.strikethrough = fEditorQueryStrikethrough; // ��ѯ������������Ƿ����л���
	this.superscript = fEditorQuerySuperscript; // ��ѯ������������Ƿ��ϱ�
	this.subscript = fEditorQuerySubscript; // ��ѯ������������Ƿ��±�
	this.insertOrderedList = fEditorQueryInsertOrderedList; // ��ѯ������������Ƿ������б�/�����б�
	this.insertUnorderedList = fEditorQueryInsertUnorderedList; // ��ѯ������������Ƿ������б�/�����б�
	this.justify = fEditorQueryJustify; // ��ѯ������������Ƿ������
	this.justifyLeft = fEditorQueryJustifyLeft; // ��ѯ������������Ƿ������
	this.justifyCenter = fEditorQueryJustifyCenter; // ��ѯ������������Ƿ���ж���
	this.justifyRight = fEditorQueryJustifyRight; // ��ѯ������������Ƿ��Ҷ���
	this.fontsize = fEditorQueryFontsize; // ��ѯ�������������ֺ�
	this.fontname = fEditorQueryFontname; // ��ѯ����������������
	this.lineheight = fEditorQueryLineheight; // ��ѯ�������������и�
	this.backcolor = fEditorQueryBackcolor; // ��ѯ�����������ı���ɫ
	this.forecolor = fEditorQueryForecolor; // ��ѯ������������ǰ��ɫ/������ɫ
	this.query=fEditorQueryQuery;//���ڲ�ѯ�༭������������״̬
	this.queryAll = fEditorQueryAll; // ��ѯ����������������״̬

}
/**
 * ���ڴ�����ѯ��ʵ��
 * 
 * @method createQuery
 * @param void
 * @return {object} ����һ����ѯ��ʵ��
 * @see #fEditorQuery
 * @for Editor
 */
function fEditorCreateQuery() {
	// �½���ѯ��ʵ���Ǵ���༭��ʵ��
	return new fEditorQuery(this);
}
/**
 * ʹ��ϵͳ�����ѯ�༭��״̬
 * 
 * @method queryCommandState
 * @param {string}sCommand ������
 * @return {Boolean} ��������״̬��true��ʾ�༭�������ڸ�����״̬
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
 * ʹ��ϵͳ�����ѯ�༭��״̬
 * 
 * @method queryCommandValue
 * @param {string}sCommand ������
 * @return {string} ��������״̬������"forecolor"�����ǰ��ɫ/������ɫ��ֵ
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
 * �Զ����ѯ�༭��������״̬
 * 
 * @method queryState
 * @param {string}sCommand ��ѯ������
 * @param {string}sParam ���Ӳ��������ڲ�ѯ�и�ʱָ��������ͣ�"per"��ʾ���ذٷֱȣ�"px"(Ĭ��)��ʾ��������ֵ
 * @return {string} ���ز�ѯ�༭��������״̬,���״̬Ϊ�գ���ͳһ����false
 * @see #getSelectedNodes
 * @for Query
 */
function fEditorQueryQueryState(sCommand,sParam) {
	var oEditor = this.getEditor();
	var oCurrentNode;
	try {
		// ��ȡ������ڽڵ�
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
	
	// �������ѯ���ͳһת��Ϊpx
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
	//����������Ҫת��Ϊ��Ӧ��ʽ��
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
	//��¼��ѯ״̬
	var sValue;
	while(aNodes.length>0) {
		var oNode = aNodes.pop();
		//�����ǰ���ı��ڵ㣬�����ѯ
		if (oNode.nodeType == 3) {
			// ������ı��ڵ㣬���滻Ϊ�丸�ڵ�
			oNode = oNode.parentNode;
			var sTmp = oEditor.getStyle(oNode, sCommand);
			if(sParam=="per"&&sCommand=="lineHeight"){
				if(sTmp&&sTmp.indexOf("px")>0){
					var sSize=oEditor.getStyle(oNode,"fontSize")||_changeToPx(oNode.getAttribute("size"));
					sTmp=Math.round(parseFloat(sTmp.replace(/px/,""))*10/parseFloat(sSize.replace(/px/,"")))*10+"%";
					if(sTmp=="110%")sTmp="120%";
				}
			}else if (sCommand == "fontsize" && !sTmp) {
				// ���һ���ڵ�ͬʱ��fontsize��ʽ��size���ԣ���fontsizeΪ׼
				sTmp = _changeToPx(oNode.getAttribute("size"));
			}
			if (sTmp) {
				if (!sValue) {
					sValue = sTmp;
				} else if (sTmp != sValue) {
					// ������ڵ��״ֵ̬��һ�£��򷵻�false
					return false;
				}
			}
		}else if(oNode.hasChildNodes()){
			//�����ǰ�ڵ��к��ӽڵ㣬��ѳ�<br>��<img>����ӽڵ�����ѯ������
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
 * ���ڲ�ѯ�༭���Ƿ��ڼӴ�״̬
 * 
 * @method bold
 * @param void
 * @return {boolean} true��ʾ�������λ�õ������ǼӴֵ�
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryPaste() {
	return this.queryCommandState('paste');
}
/**
 * ���ڲ�ѯ�Ƿ����ִ�г�������
 * 
 * @method undo
 * @param void
 * @return {boolean} true��ʾ����ִ�г�������
 * @see History#queryUndo
 * @for Query
 */
function fEditorQueryUndo() {
	return this.getEditor().history.queryUndo();
}
/**
 * ���ڲ�ѯ�Ƿ����ִ����������
 * 
 * @method redo
 * @param void
 * @return {boolean} true��ʾ����ִ����������
 * @see History#queryRedo
 * @for Query
 */
function fEditorQueryRedo() {
	return this.getEditor().history.queryRedo();
}
/**
 * ���ڲ�ѯ�༭���Ƿ��ڼӴ�״̬
 * 
 * @method bold
 * @param void
 * @return {boolean} true��ʾ�������λ�õ������ǼӴֵ�
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryBold() {
	return this.queryCommandState('bold');
}
/**
 * ���ڲ�ѯ�༭���Ƿ����»���
 * 
 * @method underline
 * @param void
 * @return {boolean} true��ʾ�������λ�õ��������»���
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryUnderline() {
	return this.queryCommandState('underline');
}
/**
 * ���ڲ�ѯ�༭���Ƿ�������
 * 
 * @method indent
 * @param void
 * @return {boolean} true��ʾ�������λ�õ�����������
 * @see #queryState
 * @for Query
 */
function fEditorQueryIndent() {
	return this.queryState('indent');
}
/**
 * ���ڲ�ѯ�༭���Ƿ�ͻ��/������
 * 
 * @method outdent
 * @param void
 * @return {boolean} true��ʾ�������λ�õ�����ͻ��/������
 * @see #isIndent
 * @for Query
 */
function fEditorQueryOutdent() {
	// �����Ƿ�������������
	return this.indent() ? false : true;
}
/**
 * ���ڲ�ѯ�༭���Ƿ�б��
 * 
 * @method italic
 * @param void
 * @return {boolean} true��ʾ�������λ�õ�������б��
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryItalic() {
	return this.queryCommandState('italic');
}
/**
 * ���ڲ�ѯ�༭���Ƿ����л���
 * 
 * @method strikethrough
 * @param void
 * @return {boolean} true��ʾ�������λ�õ��������л���
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryStrikethrough() {
	return this.queryCommandState('strikethrough');
}
/**
 * ���ڲ�ѯ�༭���Ƿ��ϱ�
 * 
 * @method superscript
 * @param void
 * @return {boolean} true��ʾ�������λ�õ��������ϱ�
 * @see #queryCommandState
 * @for Query
 */
function fEditorQuerySuperscript() {
	return this.queryCommandState('superscript');
}
/**
 * ���ڲ�ѯ�༭���Ƿ��±�
 * 
 * @method subscript
 * @param void
 * @return {boolean} true��ʾ�������λ�õ��������±�
 * @see #queryCommandState
 * @for Query
 */
function fEditorQuerySubscript() {
	return this.queryCommandState('subscript');
}
/**
 * ���ڲ�ѯ�༭���Ƿ������б�/�����б�
 * 
 * @method insertOrderedList
 * @param void
 * @return {boolean} true��ʾ�������λ�õ������������б�/�����б�
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryInsertOrderedList() {
	return this.queryCommandState('insertOrderedList');
}
/**
 * ���ڲ�ѯ�༭���Ƿ������б�/�����б�
 * 
 * @method insertUnorderedList
 * @param void
 * @return {boolean} true��ʾ�������λ�õ������������б�
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryInsertUnorderedList() {
	return this.queryCommandState('insertUnorderedList');
}
/**
 * ���ڲ�ѯ�༭���Ƿ������
 * 
 * @method justifyLeft
 * @param void
 * @return {boolean} true��ʾ�������λ�õ������������
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryJustify() {
	return this.queryCommandState('justify');
}
/**
 * ���ڲ�ѯ�༭���Ƿ������
 * 
 * @method justifyLeft
 * @param void
 * @return {boolean} true��ʾ�������λ�õ������������
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryJustifyLeft() {
	return this.queryCommandState('justifyLeft');
}
/**
 * ���ڲ�ѯ�༭���Ƿ���ж���
 * 
 * @method justifyCenter
 * @param void
 * @return {boolean} true��ʾ�������λ�õ������Ǿ��ж���
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryJustifyCenter() {
	return this.queryCommandState('justifyCenter');
}
/**
 * ���ڲ�ѯ�༭���Ƿ��Ҷ���
 * 
 * @method justifyRight
 * @param void
 * @return {boolean} true��ʾ�������λ�õ��������Ҷ���
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryJustifyRight() {
	return this.queryCommandState('justifyRight');
}
/**
 * ���ڲ�ѯ�༭�����ֵ��ֺ�
 * 
 * @method fontsize
 * @param void
 * @return {string} �������λ�õ����ֵ��ֺ�
 * @see #queryState
 * @for Query
 */
function fEditorQueryFontsize() {
	return this.queryState('fontsize');
}
/**
 * ���ڲ�ѯ�༭�����ֵ�����
 * 
 * @method fontname
 * @param void
 * @return {string} �������λ�õ����ֵ�����
 * @see #queryCommandState
 * @for Query
 */
function fEditorQueryFontname() {
	//Firefox�»�������
	return (""+this.queryCommandValue('fontname')).replace(/'|\"/g,"");
}
/**
 * ���ڲ�ѯ�༭�����ֵ��и�
 * 
 * @method lineheight
 * @param void
 * @return {string} �������λ�õ����ֵ��и�
 * @see #queryState
 * @for Query
 */
function fEditorQueryLineheight() {
	return this.getEditor().system.ie?false:this.queryState("lineheight","per");
}
/**
 * ���ڲ�ѯ�༭����ı���ɫ
 * 
 * @method backcolor
 * @param void
 * @return {string} ���ع������λ�õ����ֵı���ɫ
 * @see #getEditor #queryCommandValue Editor#num2Rgb,#rgb2Hex,#edit
 * @for Query
 */
function fEditorQueryBackcolor() {
	var oEditor = this.getEditor();
	if (oEditor.system.ie) {
		// ��ѯ�Ľ����ʮ���Ƶ���ֵ����Ҫת��
		return oEditor.num2HexForIe(this.queryCommandValue('backcolor'));
	} else if (oEditor.system.firefox) {
		// firefox����Ҫ����('usecss',false,false)������hilitecolor��ʧЧ
		oEditor.edit('usecss', false);
		var sValue = "";
		// zyh ���Firefox�����ñ���ɫ�󲻸���ѡ������ѯ���������,ֻѡ��һ���ַ��������δ���
		var oSel;
		var oRange;
		try {
			oSel = oEditor.getSelection();
			oRange = oSel.getRangeAt(0);
			if (oRange.toString().length > 1) {
				//������ƶ���ѡ��ĩβ
				oSel.collapseToEnd();
				//��ѡ����ǰ��չһ���ַ�
				oSel.extend(oSel.anchorNode, oSel.anchorOffset - 2);
				var sValue = this.queryCommandValue('hilitecolor');
				oSel.removeAllRanges();
				oSel.addRange(oRange);
			}else if(oRange.toString().length > 0){
				//������ƶ���ѡ��ĩβ
				oSel.collapseToEnd();
				//��ѡ����ǰ��չһ���ַ�
				oSel.extend(oSel.anchorNode, oSel.anchorOffset - 1);
				var sValue = this.queryCommandValue('hilitecolor');
				oSel.removeAllRanges();
				oSel.addRange(oRange);
			} else {
				sValue = this.queryCommandValue('hilitecolor');
			}
		} catch (e) {
			//��ѡ��ֻ��һ���ַ�ʱ�س����쳣
			oEditor.log(e);
			//�ָ�ѡ��
			if(oSel&&oRange){
				oSel.removeAllRanges();
				oSel.addRange(oRange);
			}
			//����Ϊ�����б���û�е���ɫ
			sValue = "#fff1ff";
		}
		if (sValue == "transparent") {
			//͸��ת��Ϊʮ�����ư�ɫ
			sValue = "#ffffff";
		} else {
			// firefox�µõ�����rgb��ɫ�������������Զ��庯��ת��Ϊʮ��λ��ɫ��������
			sValue = oEditor.rgb2Hex(sValue);
		}
		// ִ����"hilitecolor"�����Ҫ�ָ�"usecss"����,����������˳��ִ��
		oEditor.edit("usecss", true);
		return sValue;
	} else if (oEditor.system.opera) {
		return oEditor.rgb2Hex(this.queryCommandValue('hilitecolor'));
	} else {
		return oEditor.rgb2Hex(this.queryCommandValue('backcolor'));
	}
}
/**
 * ���ڲ�ѯ�༭����ǰ��ɫ/������ɫ
 * 
 * @method forcolor
 * @param void
 * @return {string} ���ع������λ�õ����ֵ�ǰ��ɫ/������ɫ
 * @see #getEditor #queryCommandValue
 * @for Query
 */
function fEditorQueryForecolor() {
	// ie�£���ѯ�Ľ����ʮ���Ƶ���ֵ����Ҫת��
	var oEditor=this.getEditor();
	var sValue=this.queryCommandValue('forecolor');
	if(oEditor.system.ie){
		//��ѯ�Ľ����ʮ���Ƶ���ֵ����Ҫת��
		sValue=oEditor.num2HexForIe(sValue);
	}else if(oEditor.system.chrome||oEditor.system.opera||oEditor.system.safari){
		sValue=oEditor.rgb2Hex(sValue);
	}
	return sValue;
}
/**
 * ���ڲ�ѯ�༭������������״̬
 * 
 * @method query
 * @param {array}��������
 * @return {object} ���ع������λ�����ֵ�״̬��json��ʽ
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
 * ���ڲ�ѯ�༭���������״̬
 * 
 * @method queryAll
 * @param void
 * @return {object} ���ع������λ�����ֵ�����״̬��json��ʽ
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
 * ����������
 * 
 * @method Observer
 * @param {object}oEditor����Editorʵ��
 * @return {void}
 * @see #fEditorObserverAdd #fEditorObserverRemove
 * @for Editor
 */
function fEditorObserver(oEditor) {

	var _editor = oEditor;// �༭��ʵ��
	var _handlerId=0;
	var _cache={};//���ڻ����¼�

	// ���ñ༭��ʵ��
	this.getEditor = function() {
		return _editor;
	}
	//��ȡ�µ��¼�����id
	this.getNewHandlerId=function(){
		return ""+_handlerId++;
	}
	//����id��ȡ�¼�����
	this.getHandler=function(sId){
		return _cache[sId];
	}
	//�����¼�
	this.cacheHandler=function(sId,fHandler){
		_cache[sId]=fHandler;
	}
    //ɾ�������¼�
	this.delCacheHandler=function(sId){
		delete _cache[sId];
	}
	this.add = fEditorObserverAdd;// ��Ӽ�����
	this.remove = fEditorObserverRemove;// ɾ��������
}
/**
 * ���ڴ���������ʵ��
 * 
 * @method createObserver
 * @param void
 * @return {object} ���ؼ�����ʵ��
 * @see #fEditorObserver
 * @for Editor
 */
function fEditorCreateObserver() {
	// �½�������ʵ��ʱ����༭��ʵ��
	return new fEditorObserver(this);
}
/**
 * ��Ӽ�����
 * 
 * @method add
 * @param {object}oParams
 *            {object}.elҪ��Ӽ�������Ԫ��;
 *            {string}.eventType�����¼�����;
 *            {function}.fn��������;
 *            {object}.object���������󶨵Ķ���
 *            {array}.params���������Ĳ���
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
 * ɾ��������
 * 
 * @method remove
 * @param {object}oParams
 *            {object}.elҪ��Ӽ�������Ԫ��;
 *            {string}.eventType�����¼�����;
 *            {function}.fn��������
 *            {id}����󶨵��¼�������id
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
 * ��¼�༭��ʷ���ṩ��������������
 * 
 * @method History
 * @param {object}oEditor �༭��ʵ��
 * @return {void}
 * @for Editor
 */
function fEditorHistory(oEditor) {
	var _editor = oEditor;// �༭��ʵ��

	// ���ñ༭��ʵ��
	this.getEditor = function() {
		return _editor;
	}
	
	this.isAble=true;//��ʷ��¼���Ƿ�����

	this.history = [];// ��ʷ��¼���飬���ڼ�¼ÿһ�β�����ʷ
	this.pos = -1;// ��ǰ��¼λ��

	this.getBookmark = fEditorHistoryGetBookmark;// ��ȡ��ǰ��ǩ
	this.setBookmark = fEditorHistorySetBookmark;// ������ǩ
	this.save = fEditorHistorySave;// �����¼
	this.undo = fEditorHistoryUndo;// ����
	this.redo = fEditorHistoryRedo;// ����
	this.start=fEditorHistoryStart;//��ʼ��ʷ��¼��
	this.stop=fEditorHistoryStop;//ֹͣ��ʷ��¼��
	this.queryUndo=fEditorHistoryQueryUndo;//��ѯ�Ƿ����ִ�г�������
	this.queryRedo=fEditorHistoryQueryRedo;//��ѯ�Ƿ����ִ����������
}
/**
 * ���ڴ�����¼��ʵ��
 * 
 * @method createHistory
 * @param void
 * @return {object} ���ؼ�¼��ʵ��
 * @see #fEditorHistory
 * @for Editor
 */
function fEditorCreateHistory() {
	// �½�������ʵ��ʱ����༭��ʵ��
	return new fEditorHistory(this);
}
/**
 * ���ڻ�ȡ��ǰ��ǩ
 * 
 * @method getBookmark
 * @param void
 * @return {object}���ص�ǰ��ǩ
 * @see #getEditor Editor#getSelection
 * @for History
 */
function fEditorHistoryGetBookmark() {
	var oEditor = this.getEditor();
	if (oEditor.system.ie) {
		// ��ȡselection����
		var oSel = oEditor.getSelection();
		if (/text/i.test(oSel.type)) {
			// ���ѡ�����ı�����ȡѡ����ǩ
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
 * ����������ǩ
 * 
 * @method setBookmark
 * @param {object}������ǩ
 * @return {void}
 * @see #getEditor
 * @for History
 */
function fEditorHistorySetBookmark(oBookmark) {
	if (oBookmark) {
		var oEditor = this.getEditor();
		if (oEditor.system.ie) {
			// �½�һ��textRange����
			var oRange = oEditor.doc.body.createTextRange();
			if (oBookmark != "[object]") {
				// ��ѡ���ƶ�����ǩ
				if (oRange.moveToBookmark(oBookmark)) {
					// oRange.collapse(false);
					// ѡ�е�ǰѡ����������
					oRange.select();
					//��ѡ���������ɼ���Χ��
					//oRange.scrollIntoView();
				}
			}
		}else{
			oEditor.createSelection().getRange().moveToBookmark(oBookmark);
		}
	}
}
/**
 * ���ڱ����¼
 * 
 * @method save
 * @param void
 * @return {boolean}�Ƿ񱣴�ɹ�
 * @see #getEditor Editor#getContent,#getRange
 * @for History
 */
function fEditorHistorySave() {
	var that=this;
	var aHistory=that.history;
	if (that.pos == -1) {
		// �����ʷ��¼Ϊ�գ���ֱ����ӵ�һ����¼
		aHistory.push([that.getEditor().getContent(), that.getBookmark()]);
		// ���õ�ǰ��¼λ��
		that.pos = 0;
		return true;
	} else {
		var sContent = that.getEditor().getContent();
		// �����ǰ�༭���������������ʷ��¼��ͬ���򽫵�ǰ״̬��ӽ���ʷ��¼
		if (aHistory[that.pos][0] != sContent) {
			// �����ǰλ�ú����ʷ��¼
			for (var i = 1; i < aHistory.length - that.pos; i++) {
				aHistory.pop();
			}
			// ����ǰ״̬��ӽ���ʷ��¼
			aHistory.push([sContent, that.getBookmark()]);
			// ���µ�ǰ��¼λ��
			that.pos++;
			return true;
		}
	}
	return false;
}
/**
 * ����
 * 
 * @method undo
 * @param void
 * @return {boolean}�Ƿ�ɹ�����
 * @see #getEditor Editor#setContent
 * @for History
 */
function fEditorHistoryUndo() {
	// �����ʷ��¼���ǿյģ��Ϳ��Խ��г�������
	if (this.pos != 0) {
		// ��ȡ��һ������ʷ��¼
		var oOp = this.history[this.pos - 1];
		// ���ñ༭�������Ϊ��һ��������
		this.getEditor().setContent(oOp[0]);
		// ����ѡ��
		this.setBookmark(oOp[1]);
		// ���µ�ǰ��¼λ��
		this.pos--;
		return true;
	} else {
		return false;
	}
}
/**
 * ����
 * 
 * @method redo
 * @param void
 * @return {boolean}�Ƿ������ɹ�
 * @see #getEditor Editor#setContent
 * @for History
 */
function fEditorHistoryRedo() {
	// �����ǰ��¼λ�ò������һ����ʷ��¼���Ϳ��Խ�����������
	if (this.pos != this.history.length - 1) {
		// ��ȡ��һ������ʷ��¼
		var oOp = this.history[this.pos + 1];
		// ���ñ༭�������Ϊ��һ��������
		this.getEditor().setContent(oOp[0]);
		// ����ѡ��
		this.setBookmark(oOp[1]);
		// ���µ�ǰ��¼λ��
		this.pos++;
		return true;
	} else {
		return false;
	}
}
/**
 * ��ʼ��ʷ��¼��
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
 * ֹͣ��ʷ��¼��
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
 * ��ѯ�Ƿ����ִ�г�������
 * 
 * @method queryUndo
 * @param void
 * @return {boolean}true��ʾ����ִ�г�������
 * @for History
 */
function fEditorHistoryQueryUndo() {
	// �����ʷ��¼���ǿյģ��Ϳ��Խ��г�������
	if (this.pos != 0) {
		return true;
	}else{
		return false;
	}
}
/**
 * ��ѯ�Ƿ����ִ����������
 * 
 * @method queryRedo
 * @param void
 * @return {boolean}true��ʾ����ִ����������
 * @for History
 */
function fEditorHistoryQueryRedo() {
	// �����ǰ��¼λ�ò������һ����ʷ��¼���Ϳ��Խ�����������
	if (this.pos != this.history.length - 1) {
		return true;
	} else {
		return false;
	}
}
/**
 * �Զ���ѡ���࣬��ie�ͷ�ie�������selection������з�װ
 * 
 * @method Selection
 * @param {object}oEditor�༭��ʵ��
 * @return {void}
 * @for Editor
 */
function fEditorSelection(oEditor) {
	var _editor = oEditor;// �༭��ʵ��

	// ���ñ༭��ʵ��
	this.getEditor = function() {
		return _editor;
	}

	this.selection = oEditor.getSelection();//ϵͳ��selection����
	this.range;//ϵͳ��range����

	this.getRange = fEditorSelectionGetRange;//��ȡ�Զ���range����
	this.addRange = fEditorSelectionAddRange;//���Զ���range�������ѡ��
	this.getRangeAt;

}
/**
 * ���ڴ����Զ���ѡ��ʵ��
 * 
 * @method createSelection
 * @param void
 * @return {object} �����Զ���ѡ��ʵ��
 * @see #fEditorSelection
 * @for Editor
 */
function fEditorCreateSelecion() {
	// �½�������ʵ��ʱ����༭��ʵ��
	return new fEditorSelection(this);
}
/**
 * ��ȡ��ǰѡ�з�Χ
 * 
 * @method getRange
 * @param void
 * @return {object} ���ص�ǰѡ�з�Χ
 * @see #getEditor
 * @for Selection
 */
function fEditorSelectionGetRange() {
	return this.getEditor().createRange();
}
/**
 * ����ѡ��,���ڱ��༭���ݲ�֧�ֶ�ѡ�����������ԣ����ѡ������������������ѡ��
 * 
 * @method addRange
 * @param {object}oRangeָ����range����
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
 * �Զ��巶Χ�࣬��ie�ͷ�ie�������range������з�װ
 * 
 * @method Range
 * @param {object}oEditor �༭��ʵ��
 * @return {void}
 * @for Editor
 */
function fEditorRange(oEditor) {
	var _editor = oEditor;// �༭��ʵ��

	// ���ñ༭��ʵ��
	this.getEditor = function() {
		return _editor;
	}

	this.doc;//�༭��iframe��document����
	this.range;//��ǰ��Χ��Ӧ��ԭ��range����
	this.bookmark;//��ǩ

	// ��ʼ��״̬
	this.startContainer;// ������Χ�Ŀ�ʼ��� Document �ڵ�
	this.startOffset;// startContainer �еĿ�ʼ��λ��
	this.endContainer;// ������Χ�Ľ������ Document �ڵ�
	this.endOffset;// endContainer �еĽ�����λ��
	this.collapsed;// �����Χ�Ŀ�ʼ��ͽ��������ĵ���ͬһλ�ã���Ϊ true������Χ�ǿյģ����۵���
	this.commonAncestorContainer;// ��Χ�Ŀ�ʼ��ͽ�����Ĺ������ڵ㣨�����ǵ����Ƚڵ㣩��Ƕ������� Document
									// �ڵ�

	// ����
	this.START_TO_START = 0;
	this.START_TO_END = 1;
	this.END_TO_END = 2;
	this.END_TO_START = 3;

	// ˽�з���
	this.getPath = _fEditorRangeGetPath;
	this.getNodeByPath = _fEditorRangeGetNodeByPath;

	// ���з���
	// // ��׼����
	this.init = fEditorRangeInit;//��ʼ��Range����
	this.setStart = fEditorRangeSetStart;//�Ѹ÷�Χ�Ŀ�ʼ������Ϊָ���Ľڵ��е�ָ��ƫ����
	this.setEnd = fEditorRangeSetEnd;//�Ѹ÷�Χ�Ľ���������Ϊָ���Ľڵ��ƫ����
	this.setStartBefore = fEditorRangeSetStartBefore;//�Ѹ÷�Χ�Ŀ�ʼ������Ϊ����ָ���ڵ�֮ǰ
	this.setStartAfter = fEditorRangeSetStartAfter;//�Ѹ÷�Χ�Ŀ�ʼ������Ϊ����ָ���ڵ�֮��
	this.setEndBefore = fEditorRangeSetEndBefore;//�Ѹ÷�Χ�Ľ���������Ϊ����ָ���ڵ�֮ǰ
	this.setEndAfter = fEditorRangeSetEndAfter;//�Ѹ÷�Χ�Ľ���������Ϊ����ָ���ڵ�֮��
	this.collapse = fEditorRangeCollapse;//�۵��÷�Χ��ʹ���ı߽���غ�
	this.selectNode = fEditorRangeSelectNode;//���ø÷�Χ�ı߽�㣬ʹ������ָ���Ľڵ��������������ڵ�
	this.selectNodeContents = fEditorRangeSelectNodeContents;//���ø÷�Χ�ı߽�㣬ʹ������ָ���ڵ������ڵ㣬��������ָ���Ľڵ㱾��
	this.compareBoundaryPoints = fEditorRangeCompareBoundaryPoints;//�Ƚ�ָ����Χ�ı߽��͵�ǰ��Χ�ı߽��
	this.deleteContents = fEditorRangeDeleteContents;//ɾ����ǰ Range �����ʾ���ĵ�����
	this.extractContents = fEditorRangeExtractContents;//ɾ����ǰ��Χ��ʾ���ĵ����򣬲����� DocumentFragment �������ʽ�����Ǹ���������ݡ�
	this.cloneContents = fEditorRangeCloneContents;//�����µ� DocumentFragment �����������÷�Χ��ʾ���ĵ�����ĸ�����
	this.insertNode = fEditorRangeInsertNode;//��ָ���Ľڵ�����ĵ���Χ�Ŀ�ʼ�������㡣
	this.surroundContents = fEditorRangeSurroundContents;//��ָ���Ľڵ�����ĵ���Χ�Ŀ�ʼ�㣬Ȼ���ض���Χ�е����нڵ�ĸ��ڵ㣬ʹ���ǳ�Ϊ�²���Ľڵ������ڵ㡣
	this.cloneRange = fEditorRangeCloneRange;//���Ʒ�Χ

	// //��չ����
	this.getBookmark = fEditorRangeGetBookmark;//��ȡ������ʹ moveToBookmark ������ͬ��Χ����ǩ��
	this.moveToBookmark = fEditorRangeMoveToBookmark;//�ƶ�����ǩ��
	this.getSelectedNodes = fEditorRangeGetSelectedNodes;//��ȡѡ�еĽڵ㼯
	this.getFocusNodes=fEditorRangeGetFocusNodes;//��ȡ������ڵĽڵ㼯
	this.normalize=fEditorRangeNormalize;//����Χ

	// ��ʼ��,����ѡ��ʱ��������oEditor,�����г�ʼ��
	if (_editor) {
		this.init();
	}
}
/**
 * ���ڴ����Զ��巶Χʵ��
 * 
 * @method createRange
 * @param void
 * @return {object} �����Զ��巶Χʵ��
 * @see #fEditorRange
 * @for Editor
 */
function fEditorCreateRange() {
	// �½���Χʵ��ʱ����༭��ʵ��
	return new fEditorRange(this);
}
/**
 * ��ȡ�����ڵ��·��
 * 
 * @method getPath
 * @param {object}oNode�����ڵ�
 * @return {array}���ز����ڵ��·��
 * @for Range
 */
function _fEditorRangeGetPath(oNode) {
	var aPath = [];
	var oParent = oNode.parentNode;
	// �������ڵ㣬ֱ��body��ǩ
	while (!/body/i.test(oNode.nodeName)) {
		var aChildren = oParent.childNodes;
		for (var i = 0; i < aChildren.length; i++) {
			if (aChildren[i] == oNode) {
				// �ѵ�ǰ�ڵ���������·��
				aPath.push(i);
			}
		}
		oNode = oParent;
		oParent = oNode.parentNode;
	}
	return aPath;
}
/**
 * ���ݲ���·�����ҽڵ�
 * 
 * @method getNodeByPath
 * @param {array}aPath����·��
 * @return {object}���ز��ҵ��Ľڵ㣬���·�����󣬷���null��
 * @for Range
 */
function _fEditorRangeGetNodeByPath(aPath) {
	//����·������
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
 * ��ʼ��Range����
 * 
 * @method init
 * @param {object}oEditor �༭��ʵ��
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
/*function fEditorRangeInit2(oEditor) {
	this.doc = oEditor.doc;
	this.range = oEditor.getRange();
	if (oEditor.system.ie) {// ie
		var oRange = this.range;
		// ��¼��ǩ
		var oBookmark = oRange.getBookmark();
		oRange.collapse(true);
		var oStartParent = oRange.parentElement();
		oRange.moveToBookmark(oBookmark);
		oRange.collapse(false);
		var oEndParent = oRange.parentElement();
		oRange.moveToBookmark(oBookmark);
		var oRangeCpy = oRange.duplicate();

		var aChildren = oStartParent.childNodes;
		// �ϲ��������ı��ڵ�
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
		// firefox�ȱ�׼�����������Ĭ������ʵ��
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
	//�������ݣ��ϲ����ڵ��ı��ڵ�
	that.doc.body.normalize();
	var oRange = oEditor.getRange();
	//���range����Ϊ��(�����Ǳ༭�����ص���)����ֱ�ӷ���
	if(!oRange){
		oEditor.log("rangeΪ��!");
		return null;
	}
	// ie
	if (oEditor.system.ie) {
		var oBookmark=oRange.getBookmark();
		//�۵�ѡ����ʼ��
		oRange.collapse(true);
		// ��ѡ����ʼ�����һ����ʱ��ǩ�����ڲ���ѡ���߽�ڵ�
		oRange.pasteHTML("<a id='eidtorRangeStartTmpA'></a>");
		// ���»�ȡѡ��
		oRange=oEditor.getRange();
		//�۵�ѡ����������
		oRange.collapse(false);
		// ��ѡ�����������һ����ʱ��ǩ�����ڲ���ѡ���߽�ڵ�
		oRange.pasteHTML("<a id='eidtorRangeEndTmpA'></a>");
		// ��ȡѡ����ʼ�����ʱ��ǩ
		var oStartA = that.doc.getElementById("eidtorRangeStartTmpA");
		// ��ȡѡ�����������ʱ��ǩ
		var oEndA = that.doc.getElementById("eidtorRangeEndTmpA");
		//����û�ѡ���ķ�Χ�����ĵ���β��pasteHTML�����޷��ٽ�β������html������Ҫ�����һ����ǩ���ĵ���β
		if(!oEndA){
			oEndA=that.doc.createElement("a");
			that.doc.body.appendChild(oEndA);
		}
		var oParentNode = oStartA.parentNode;
		// ��ȡ������Χ�Ŀ�ʼ��� Document �ڵ�
		var oPre = oStartA.previousSibling;
		var oNext = oStartA.nextSibling;
		//�����ʱ��ǩ���ڣ�˵��û��ѡȡ�κ�����
		if (oNext == oEndA) {
			oNext=oNext.nextSibling;
			//���ǰһ���ڵ���һ���ڵ����ı��ڵ㣬������ΪstartContainer��endContainer
			if(oPre&&oPre.nodeType==3){
				//�������Ҳ���ı��ڵ㣬Ҫ���кϲ�,��ֹnormalize������ʧ�ڵ�
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
				////���ǰһ���ڵ�ͺ�һ���ڵ㶼�����ı��ڵ㣬�򽫸��ڵ���ΪstartContainer��endContainer
				var oParent=oStartA.parentNode;
				var aChildren=oParent.childNodes;
				var i=0;
				//��ȡ�ڵ�����
				for(i=0;i<aChildren.length;i++){
					if(aChildren[i]==oStartA)break;
				}
				that.startContainer=that.endContainer=oParent;
				that.startOffset=that.endOffset=i;
			}
			that.collapsed = true;
			// �Ƴ���ʱ�ڵ�
			oStartA.parentNode.removeChild(oStartA);
			oEndA.parentNode.removeChild(oEndA);
		}else{
			// ���ǰ�����ı��ڵ㣬��Ҫ���кϲ�������normalize������ڵ㶪ʧ
			if (oPre && oPre.nodeType == 3 && oNext && oNext.nodeType == 3) {
				that.startOffset = oPre.nodeValue.length;
				// �ϲ��ı��ڵ�
				oPre.nodeValue = oPre.nodeValue + oNext.nodeValue;
				oNext.parentNode.removeChild(oNext);
				that.startContainer = oPre;
				// ����ѡ����Χ
				//oRange.moveToBookmark(oBookmark);
				// oRange.moveStart("character",that.startOffset-oPre.nodeValue.length);
			} else if (oNext && oNext.nodeType == 3) {
				// ���к�һ���ڵ����ı��ڵ�
				that.startOffset = 0;
				that.startContainer = oNext;
			} else {
				// ��һ���ڵ㲻���ı��ڵ㣬���ں�һ���ڵ�����ڵ���Ѱ���ı��ڵ�
				while (oNext && oNext.nodeType != 3) {
					oNext = oNext.firstChild;
				}
				// ���oNext��һ���ڵ�
				if (oNext) {
					that.startOffset = 0;
					that.startContainer = oNext;
				} else {
					that.startOffset = 0;
					that.startContainer = oStartA.parentNode;
				}
			}
			// �Ƴ���ʱ�ڵ�
			oStartA.parentNode.removeChild(oStartA);
			that.startContainer = that.startContainer || that.doc.body;

			// ��ȡ������Χ�Ľ������ Document �ڵ�
			oPre = oEndA.previousSibling;
			oNext = oEndA.nextSibling;
			// ���ǰ�����ı��ڵ㣬��Ҫ�ϲ�
			if (oPre && oPre.nodeType == 3 && oNext && oNext.nodeType == 3) {
				// ie�£��Ƴ���ʱa��ǩ����Ȼ�������������ı��ڵ㣬����ƫ����Ҫ����ǰһ���ı��ڵ�ĳ���
				that.endOffset = oPre.nodeValue.length;
				// �ϲ��ı��ڵ�
				oPre.nodeValue = oPre.nodeValue + oNext.nodeValue;
				oNext.parentNode.removeChild(oNext);
				that.endContainer = oPre;
			} else if (oPre && oPre.nodeType == 3) {
				// ǰһ���ڵ����ı��ڵ�
				that.endOffset = oPre.nodeValue.length;
				that.endContainer = oPre;
			} else {
				if (oPre) {
					// ǰһ���ڵ㲻���ı��ڵ㣬����ǰһ���ڵ�����ڵ���Ѱ���ı��ڵ�
					while (oPre && oPre.hasChildNodes()) {
						oPre = oPre.lastChild;
					}
					//����ҵ��ı��ڵ㣬���Դ�Ϊ������
					if(oPre.nodeType==3){
						that.endOffset = oPre.nodeValue.length;
						that.endContainer = oPre;
					}else{
						that.endOffset = 0;
						that.endContainer = oPre;
					}
				} else {
					var oNode = oEndA.parentNode;
					// ������ǰѰ���ı��ڵ�
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
						//���ǰ��û�нڵ�
						that.endOffset = 0;
						that.endContainer = oEndA.parentNode;
					}
				}
			}
			//�Ƴ���ʱ�ڵ�
			oEndA.parentNode.removeChild(oEndA);
			that.endContainer = that.endContainer || that.doc.body;
			that.collapsed = false;
			that.commonAncestorContainer = oEditor.findCommonAncestor(
				that.startContainer, that.endContainer);
		}
		//����ѡ��
		oRange.moveToBookmark(oBookmark);
		//oRange=oEditor.getRange();
		// ѡ��/��Ϊ����
		oRange.select();
		that.range=oRange;
	} else {
		// firefox�ȱ�׼�����������Ĭ������ʵ��
		that.range=oRange;
		var oStartContainer=that.range.startContainer;
		var nStartOffset=that.range.startOffset;
		var oEndContainer=that.range.endContainer;
		var nEndOffset=that.range.endOffset;
		//�����ҵ�Ҷ�ӽڵ���Ϊ��Χ����ʼ�������ڵ�
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
	//���淶Χ����ǩ
	that.bookmark=that.getBookmark();
}
/**
 * �Ѹ÷�Χ�Ŀ�ʼ������Ϊָ���Ľڵ��е�ָ��ƫ����
 * 
 * @method setStart
 * @param {object}oNode ָ���Ľڵ�
 * @param {number}nOffset ƫ����
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeSetStart(oNode, nOffset) {
}
/**
 * �Ѹ÷�Χ�Ľ���������Ϊָ���Ľڵ��ƫ����
 * 
 * @method setEnd
 * @param {object}oNode ָ���Ľڵ�
 * @param {number}nOffset ƫ����
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeSetEnd(oNode, nOffset) {
}
/**
 * �Ѹ÷�Χ�Ŀ�ʼ������Ϊ����ָ���ڵ�֮ǰ
 * 
 * @method setStartBefore
 * @param {object}oNode ָ���Ľڵ�
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeSetStartBefore(oNode) {
}
/**
 * �Ѹ÷�Χ�Ŀ�ʼ������Ϊ����ָ���ڵ�֮��
 * 
 * @method setStartAfter
 * @param {object}oNode ָ���Ľڵ�
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeSetStartAfter(oNode) {
}
/**
 * �Ѹ÷�Χ�Ľ���������Ϊ����ָ���ڵ�֮ǰ
 * 
 * @method setEndBefore
 * @param {object}oNode ָ���Ľڵ�
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeSetEndBefore(oNode) {
}
/**
 * �Ѹ÷�Χ�Ľ���������Ϊ����ָ���ڵ�֮��
 * 
 * @method setEndAfter
 * @param {object}oNode ָ���Ľڵ�
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeSetEndAfter(oNode) {
}
/**
 * �۵��÷�Χ��ʹ���ı߽���غ�
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
 * ���ø÷�Χ�ı߽�㣬ʹ������ָ���Ľڵ��������������ڵ�
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
 * ���ø÷�Χ�ı߽�㣬ʹ������ָ���ڵ������ڵ㣬��������ָ���Ľڵ㱾��
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
 * �Ƚ�ָ����Χ�ı߽��͵�ǰ��Χ�ı߽�㣬�������ǵ�˳�򷵻� -1��0 �� 1���Ƚ��ĸ��߽�������ĵ�һ������ָ���� ����ֵ������ǰ�涨��ĳ���֮һ
 * 
 * @method compareBoundaryPoints
 * @param {number}nHow �������ִ�бȽϲ��������Ƚ���Щ�߽�㣩�����ĺϷ�ֵ�� Range �ӿڶ���ĳ�����
 * @param {object}oSourceRange Ҫ�뵱ǰ��Χ���бȽϵķ�Χ
 * @return {number} �����ǰ��Χ��ָ���߽��λ�� sourceRange ָ���ı߽��֮ǰ���򷵻� -1�� ���ָ���������߽����ͬ���򷵻�
 *         0�������ǰ��Χ�ı߽��λ�� sourceRange ָ���ı߽��֮���򷵻� 1��
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeCompareBoundaryPoints(nHow, oSourceRange) {
}
/**
 * ɾ����ǰ Range �����ʾ���ĵ�����
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
 * ɾ����ǰ��Χ��ʾ���ĵ����򣬲����� DocumentFragment �������ʽ�����Ǹ���������ݡ�
 * 
 * @method deleteContents
 * @param void
 * @return {object} �� DocumentFragment �������ʽ���ص�ǰ�ĵ����������
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
 * �����µ� DocumentFragment �����������÷�Χ��ʾ���ĵ�����ĸ�����
 * 
 * @method cloneContents
 * @param void
 * @return {object} �����µ� DocumentFragment �����������÷�Χ��ʾ���ĵ�����ĸ�����
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
 * ����һ���µ� Range ���󣬱�ʾ�뵱ǰ�� Range ������ͬ���ĵ�����
 * 
 * @method cloneRange
 * @param void
 * @return {object} �����뵱ǰ�� Range ������ͬ���ĵ�����
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeCloneRange() {
	// �����µ��Զ���Range����
	var oRange = new fEditorRange();
	// ���������
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
 * ��ָ���Ľڵ�����ĵ���Χ�Ŀ�ʼ�������㣬Ĭ��Ϊ��㡣
 * 
 * @method insertNode
 * @param {object}oNode
 *            ָ���ڵ�
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeInsertNode(oNode, bIsEnd) {
	// ���뵽ѡ��������
	if (bIsEnd) {
		var oEndContainer = this.endContainer, nEndOffset = this.endOffset, oTextNode, oCurrent;
		// ����ı��ڵ����CDATA�ڵ㣬������Ҫ�з�
		if ((oEndContainer.nodeType === 3 || oEndContainer.nodeType === 4)
				&& oEndContainer.nodeValue) {
			if (!nEndOffset || nEndOffset == 0) {
				// ѡ��������ı��ڵ�ǰ
				oEndContainer.parentNode.insertBefore(oNode, oEndContainer);
			} else if (nEndOffset >= oEndContainer.nodeValue.length) {
				// ѡ��������ı��ڵ��
				oEndContainer.parentNode.insertAfter(oNode, oEndContainer);
			} else {
				// ѡ��������ı��ڵ��м䣬����Ҫ�з��ı��ڵ�
				oTextNode = oEndContainer.splitText(nEndOffset);
				oEndContainer.parentNode.insertBefore(oNode, oTextNode);
			}
		} else {
			// �������͵Ľڵ㣬����Ҫ�з�
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
		// ���뵽ѡ����ʼ��
		var oStartContainer = this.startContainer, nStartOffset = this.startOffset, oTextNode, oCurrent;
		// ����ı��ڵ����CDATA�ڵ㣬������Ҫ�з�
		if ((oStartContainer.nodeType === 3 || oStartContainer.nodeType === 4)
				&& oStartContainer.nodeValue) {
			if (!nStartOffset || nStartOffset == 0) {
				// ѡ��������ı��ڵ�ǰ
				oStartContainer.parentNode.insertBefore(oNode, oStartContainer);
			} else if (nStartOffset >= oStartContainer.nodeValue.length) {
				// ѡ��������ı��ڵ��
				oEndContainer.parentNode.insertAfter(oNode, oStartContainer);
			} else {
				// ѡ��������ı��ڵ��м䣬����Ҫ�з��ı��ڵ�
				oTextNode = oStartContainer.splitText(nStartOffset);
				oStartContainer.parentNode.insertBefore(oNode, oTextNode);
			}
		} else {
			// �������͵Ľڵ㣬����Ҫ�з�
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
	// ���³�ʼ��
	this.init();
}
/**
 * ��ָ���Ľڵ�����ĵ���Χ�Ŀ�ʼ�㣬Ȼ���ض���Χ�е����нڵ�ĸ��ڵ㣬ʹ���ǳ�Ϊ�²���Ľڵ������ڵ㡣
 * 
 * @method surroundContents
 * @param {object}oNode�����ڵ�
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
 * ��ȡ������ʹ moveToBookmark ������ͬ��Χ����ǩ��
 * 
 * @method getBookmark
 * @param void
 * @return {object}
 * @see #getEditor
 * @for Range
 */
function fEditorRangeGetBookmark() {
	var oEditor = this.getEditor();
	//�����ĵ�
	oEditor.doc.body.normalize();
	try {
		if (oEditor.system.ie) {
			return this.range.getBookmark();
		} else {
			// ��ie�������
			return {
				// ������Χ���Ľڵ㣬��·����ʾ
				"startContainer" : this.getPath(this.startContainer),
				// startContainer �е����λ��
				"startOffset" : this.startOffset,
				// ������Χ�յ�Ľڵ㣬��·����ʾ
				"endContainer" : this.getPath(this.endContainer),
				// endContainer �еĽ�����λ��
				"endOffset" : this.endOffset
			}
		}
	} catch (e) {
		oEditor.log(e);
		return null;
	}
}
/**
 * �ƶ�����ǩ��
 * 
 * @method moveToBookmark
 * @param {object}oBookmark ��ǩ
 * @return {void}
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeMoveToBookmark(oBookmark) {
	var oEditor = this.getEditor();
	if (oEditor.system.ie) {
		// ie�£�ֱ������ԭ�������ƶ�����ǩ
		this.range.moveToBookmark(oBookmark);
	} else {
		// ����·�������ǩ��ʼ�ͽ����ڵ�
		var oStartContainer = this.getNodeByPath(oBookmark.startContainer);
		var oEndContainer = this.getNodeByPath(oBookmark.endContainer);
		try {
			// ����ѡ�����
			this.range.setStart(oStartContainer, oBookmark.startOffset);
			// ����ѡ���յ�
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
 * ��ȡѡ�еĽڵ㼯������ѡ����ʼ�ڵ�ͽ����ڵ㣬��������������ı��ڵ㣨���ڵ���ֻ�в���������ѡ���У������зָýڵ㣬�����µ��ı��ڵ㣬
 * ��ӵ���������У���ˣ�ʹ�ñ������󣬿����в���ѡȡ���ᶪʧ������
 * 
 * @method getSelectedNodes
 * @param void
 * @return {array} ����ѡ�еĽڵ㼯
 * @see #fEditorRange
 * @for Range
 */
function fEditorRangeGetSelectedNodes() {
	var that=this;
	var oStartContainer = that.startContainer, oEndContainer = that.endContainer, nStartOffset = that.startOffset, nEndOffset = that.endOffset,
	// �½�һ�����飬���ڱ���ѡ���ڵ�Ԫ��
	aNodes = new Array();
	// �������ݣ��ϲ����ڵ��ı��ڵ�
	that.doc.body.normalize();
	// ���ѡ����ʼ�ڵ�ͽ����ڵ���ͬһ���ڵ�
	if (oStartContainer == oEndContainer) {
		//���û��ѡ���κ��ı����߽ڵ㣬�򷵻ؿ�����
		if(nStartOffset==nEndOffset){
			return aNodes;
		}
		// ������ı��ڵ����CDATA�ڵ㣬������Ҫ�з�
		if ((oStartContainer.nodeType === 3 || oStartContainer.nodeType === 4)
				&& oStartContainer.nodeValue) {
			if (nStartOffset > 0) {
				//�зֽڵ�
				oStartContainer = oStartContainer.splitText(nStartOffset);
				// ���½����������
				nEndOffset = nEndOffset - nStartOffset;
			}
			if (nEndOffset < oStartContainer.nodeValue.length) {
				oStartContainer.splitText(nEndOffset);
			}
			aNodes.push(oStartContainer);
			// ������Ӧ������ֵ
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
		//���ѡ����ʼ�ڵ㲻�ǹ������Ƚڵ�
		if (oStartContainer != that.commonAncestorContainer) {
			// ��ѡ����ʼ�ڵ㿪ʼ��������ĵ����������ʵĽڵ���ӽ����������
			var oCurrentLeftNode = oStartContainer;
			// ������������ı��ڵ㣬��ֱ����ӵ����������
			if (nStartOffset == 0) {
				aNodes.push(oCurrentLeftNode);
			} else if(oCurrentLeftNode.nodeType==3){
				// ���ֻ��ѡ���˲����ı������ȶԿ�ʼ�ı��ڵ�����з�
				oCurrentLeftNode = oCurrentLeftNode.splitText(nStartOffset);
				// �������÷�Χ��ʼ�ڵ�
				that.startContainer = oCurrentLeftNode;
				that.startOffset = 0;
				// ���зֳ������ı��ڵ���ӵ����������
				aNodes.push(oCurrentLeftNode);
			}else{
				aNodes.push(oCurrentLeftNode.childNodes[nStartOffset]);
			}
			var oCurrentParent = oCurrentLeftNode.parentNode;
			// �����ǰ�ڵ�ĸ��ڵ㲻��ѡ�������Ƚڵ㣬����ѭ��
			while (oCurrentParent
					&& oCurrentParent != that.commonAncestorContainer) {
				var oNext = oCurrentLeftNode.nextSibling;
				// �������ֵܽڵ�
				while (oNext) {
					if (oNext.nodeType != 8) {
						// �ѳ�ȥע����Ľڵ���ӵ����������
						aNodes.push(oNext);
					}
					oNext = oNext.nextSibling;
				}
				oCurrentLeftNode = oCurrentParent;
				oCurrentParent = oCurrentLeftNode.parentNode;
			}
		}
		//���ѡ�������ڵ㲻�ǹ������Ƚڵ�
		if (oEndContainer != that.commonAncestorContainer) {
			// ��ѡ�������ڵ㿪ʼ���ϱ����ĵ����������ʵĽڵ���ӽ����������
			var oCurrentRightNode = oEndContainer;
			// ���ֻ��ѡ���˲����ı������ȶԽ����ı��ڵ�����з�
			if (oCurrentRightNode.nodeType == 3
					&& nEndOffset < oCurrentRightNode.nodeValue.length) {
				oCurrentRightNode.splitText(nEndOffset);
				// �������÷�Χ�����ڵ�
				that.endContainer = oCurrentRightNode;
				that.endOffset = oCurrentRightNode.nodeValue.length;
			}
			// �������ڵ���ӵ����������
			aNodes.push(oCurrentRightNode);
			oCurrentParent = oCurrentRightNode.parentNode;
			// �����ǰ�ڵ�ĸ��ڵ㲻��ѡ�������Ƚڵ㣬����ѭ��
			while (oCurrentParent
					&& oCurrentParent != that.commonAncestorContainer) {
				var oPre = oCurrentRightNode.previousSibling;
				// �������ֵܽڵ�
				while (oPre) {
					if (oPre.nodeType != 8) {
						// �ѳ�ȥע����Ľڵ���ӵ����������
						aNodes.push(oPre);
					}
					oPre = oPre.previousSibling;
				}
				oCurrentRightNode = oCurrentParent;
				oCurrentParent = oCurrentRightNode.parentNode;
			}
		}

		// �����Ƚڵ��º��ʵ��ӽڵ���ӽ����������
		var oNext = oCurrentLeftNode.nextSibling;
		while (oNext&&oNext != oCurrentRightNode) {
			if (oNext.nodeType != 8) {
				// �ѳ�ȥע����Ľڵ���ӵ����������
				aNodes.push(oNext);
			}
			oNext = oNext.nextSibling;
		}
	}
	// ���ؽ��
	return aNodes;
}
/**
 * ��ȡ������ڵĽڵ㼯������û�û��ѡ���κ��Ļ�ؼ����򷵻ع�����ڵ���С�ڵ㣬���򷵻�ѡ�нڵ㼯
 * 
 * @method getFocusNodes
 * @param void
 * @return {array} ����ѡ�еĽڵ㼯
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
 * ����Χ,�ϲ���Χǰ����ı��ڵ�
 * 
 * @method normalize
 * @param void
 * @return {void}
 * @for Range
 */
function fEditorRangeNormalize(){
	var that=this;
	var oStartContainer = that.startContainer, oEndContainer = that.endContainer, nStartOffset = that.startOffset, nEndOffset = that.endOffset;
	//���startContainer���ı��ڵ㣬��Ҫ����Ƿ�ɽ��кϲ�
	if (oStartContainer.nodeType == 3) {
		var oPre = oStartContainer.previousSibling;
		// ���startContainer��ǰһ���ֵܽڵ����ı�����Ҫ���кϲ�
		if (oPre && oPre.nodeType == 3) {
			var sValue=oPre.nodeValue;
			that.startOffset=sValue.length;
			oStartContainer.nodeValue=sValue+oStartContainer.nodeValue;
			oPre.parentNode.removeChild(oPre);
		}
	}
	//���endContainer���ı��ڵ㣬��Ҫ����Ƿ�ɽ��кϲ�
	if (oEndContainer.nodeType == 3) {
		var oNext=oEndContainer.nextSibling;
		// ���endContainer��ǰһ���ֵܽڵ����ı�����Ҫ���кϲ�
		if (oNext && oNext.nodeType == 3) {
			var sValue=oNext.nodeValue;
			that.endOffset=oEndContainer.length;
			oEndContainer.nodeValue=oEndContainer.nodeValue+sValue;
			oNext.parentNode.removeChild(oNext);
		}
	}
}