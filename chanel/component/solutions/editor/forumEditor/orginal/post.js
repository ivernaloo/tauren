/**
 * ��ʽ���ı����滻�ַ���ƴ�ӷ�����
 * ����ʹ��format�������滻�ַ����е�{**}���š�
 * @returns
 */
function format() {
	var str = arguments[0]; 
	var index=0;
	for(var i=1; i<arguments.length; i++) {
		var obj = arguments[i];
		if (typeof(obj)=="object") {
			for(var key in obj) { str = str.replace(new RegExp("\\{"+key+"\\}","gm"), obj[key]); }
		} else {
			str = str.replace(new RegExp("\\{"+(index)+"\\}","gm"), obj); index++;
		}
	};
	return str;
};

Bbs.testSelection = function() {
	alert(Editor.getWorkRange().text);

	var obj = Editor.getForm().content;
	obj.focus();
	//document.selection.empty();

	Bbs.workRange.text = "A";
}

Bbs.search = function(obj, type) {
	BbsUtil.clickStat("listsearch");
	var parent = obj;
	for (var i=0; i< 6; i++) {
		parent= parent.parentNode;
		if (parent.tagName == "FORM") {
			break;
		}
	}
	
	if (parent.tagName != "FORM") {
		alert("��ȡform����.");
		return;
	}
	var form = parent;
	var q = form['q'].value;
	if(q==""||q=="������ؼ���"){
		form["q"].focus();
		alert("������ؼ���");
		return;
	}
	var keyword = form['q'].value;
	form['q'].value = escape(keyword);
	form["searchType"].value = type;
	form.submit();
	form['q'].value = keyword;
}

var BbsPost = {
	"init":function(type) {
		var paid = $("paid").value;
		if(paid==1 || paid==2 || paid==3 || paid==4){
			var obj = $("colorpaid"+paid);
			if(obj != undefined){
				this.changeTitleColor(obj);
			}
		}
		
		if (type == "" || typeof(type) == "undefined"){
			type = BbsPostType.getType();
		}
		try {
			eval("BbsPostType."+type+"()");
		}
		catch (e) {
			alert("eval BbsPostType."+type+"():"+ e.message);
		}
	},
	/**
	 * ��ʾ������ʼ�¼
	 */
	"showHistoryBoardInfo":function() {
		var boardList = BbsProfile.VisitHistory.getHistoryInfo();
		if (boardList == null) {
			new Insertion.Bottom('visitHistory', "��");
			return;
		}


		var html = "";
		for (boardid in boardList) {
			var boardName = boardList[boardid];
			if(boardName == "undefined"){ continue;}
			var boardUrl = "http://bbs.163.com/bbs/list.jsp?boardid="+boardid;//boardList[boardid].url;
			html += '<a href="'+boardUrl+'">'+boardName+'</a> ';
		}
		new Insertion.Bottom('visitHistory', html);
	},
	"closeHint":function() {
		$("frmpostHint").style.display = "none";
	},
	/**
	 * ��ʾͼƬ�ϴ���
	 */
	"showUploadImageSwfBox":function() {
		//Bbs.loadDwr();  //Ԥ�ȼ���Dwr
        if (!BbsCookie.isLogined()) { //δ��¼
            Bbs.showLoginDialog(true);  //��ʾ��¼�򣬵�¼�ɹ����Զ��ص�
            return;
        }
        else {
        	BbsAdmin.showDialog('�ϴ�/��ͼ', '/bbs/swfupload.jsp?boardid='+global_boardid);
            Dialog.setWidth(682);
        }
	},
	/**
	 * ����ͼƬ�ϴ���
	 */
	"hideUploadImageBox":function() {
		Dialog.close();	
	},
	//�л�������ͼƬ�ϴ�
	"nativeImage":function(){
		$("nativeimgbtn").className = "on";
		$("netimgbtn").className = "";
		$("netimgid").style.display="none";
		//$("nativeimgid").style.position="static";
		//$("nativeimgid").style.left="0";
	},
	
	//�л�������ͼƬ�ϴ�
	"netImage":function(){
		$("nativeimgbtn").className = "";
		$("netimgbtn").className = "on";
		$("netimgid").style.display="block";
		//$("nativeimgid").style.position="absolute";
		//$("nativeimgid").style.left="-9999px";
	},

	/**
	 * ��ѡ�е��ļ��ϴ���ͼƬ������
	 */
	"uploadImage":function() {
		this.insertImageByUrl();
	},
	/**
	 * ��֤����ʾ���ڵ�id
	 */
	"checkcodeTipId":"_checkcode_tips",
	/**
	 * ��ʾ��֤����ʾ����
	 */
	"checkcodePopup":function (id, val) {
		var checkcodeObj = document.getElementById(id);
		if (checkcodeObj) {
    		checkcodeObj.innerHTML = val;
    		checkcodeObj.style.display = 'block';
    	}
	},
	/**
	 * ������֤����ʾ����
	 */
	"checkcodeHide":function (id){
		var checkcodeObj = document.getElementById(id);
		if (checkcodeObj) {
    		checkcodeObj.style.display = 'none';
    	}
	},
	"checkVerify":function(imgUrls) {
		var form = document.forms["frmpost"];
		if (1==1) {
            //�ж��û��Ƿ���Ҫ������֤�룿
            var checkcode = form.checkcode;
            if (typeof(checkcode) == "object") {
            	BbsUtil.clickStat("checkreply");
                if (checkcode.value == "") {
                    //alert("��֤�뻹û������.");
                	this.checkcodePopup(this.checkcodeTipId, '��֤�뻹û�����롣');
                    checkcode.focus();
                    return true;
                }
                if (checkcode.value.length != 4) {
                    //alert("��֤���λ������Ŷ.");
                	this.checkcodePopup(this.checkcodeTipId, '��֤���λ�����ԡ�');
                    checkcode.focus();
                    return true;
                }
                // ����û���������֤�룬��ǰУ����֤�롣
                var codeRight = false;
                DWREngine.setAsync(false);
                Dwr.checkcode(checkcode.value, function(data){
                	codeRight = data;
                });
                DWREngine.setAsync(true);
                if (!codeRight) {
                	//alert('��֤�����');
                	this.checkcodePopup(this.checkcodeTipId, '��֤�����');
                	return true;
                }
            }
            else {
              var verifyMessage = "";
              var photoMsg = '';
              if (BbsCookie.isLogined()) {
                  var result = BbsUtil.isWantVerify(true, imgUrls);
                  if (result) {
                	  var msgs = result.split(',');
                	  if (msgs && msgs.length == 2) {
                		  verifyMessage = msgs[0];
                		  photoMsg = msgs[1];
                	  }
                  }
              } else {
                  verifyMessage = "����������������Ҫ������֤�롣";
              }
              
              var returnResult = false;
              
              if (photoMsg != '') {
            	  this.checkcodePopup(this.checkcodeTipId, photoMsg);
            	  //alert(photoMsg);
            	  remove163Imgs();
            	  returnResult = true;
              }
              
              if (verifyMessage != "") {

            	  // ,������������Ҫ������֤�롣
                  var html = BbsPost.checkcodeHtml;
                  html = format(html,{message:verifyMessage,image:BbsUtil.getCodeJsp()});
                  /**
                	  '<div><h5>��֤��:</h5>��'
                	  +'<input type="text" size="6" name="checkcode" value="" class="input007" maxlength="4"/> '
                	  +'(<font color="blue">'+verifyMessage+'</font>)<br/>��'
                	  +'<a href="javascript:BbsUtil.reloadCode();" target="_self"> '
                	  +'<img id="imgcheckcode" src="'+BbsUtil.getCodeJsp()+'" alt="�����壬��һ��"/></a> '
                	  +'<a href="javascript:BbsUtil.reloadCode();" target="_self" style="line-height:50px;">�����壬��һ��</a> </div> ';	
					**/

                  new Insertion.Before('frmpost_upload', html);
				  BbsUtil.clickStat("checknum");
                  form.checkcode.focus();
                  returnResult = true;
              }
              
              if (returnResult) {
          		return returnResult;
          	  }
              
            }
        }

		return false;
	},
	/**
	 * �����ύ
	 */
	"dopost":function() {
		BbsUtil.clickStat("postout");
		var content = EditorExtend.getContent();
		content_len = content.length;
		if(content.trim() == '' || content.trim() == "<br>" || content.trim() == "<DIV></DIV>"){
			Dialog.alert("���ݲ���Ϊ��Ŷ.");
	        return;
		}
		// ��ע��
		content = content.replace(/<!--(.|\s)*?-->/gi, "");
		var content_char = content.replace(/[^\x00-\xff]/gi, "aa");
		// ��������
		if(content_char.length >= 65000){
			var frmReplyPrompt = document.getElementById("frmReplyPrompt");
			frmReplyPrompt.innerHTML = "&nbsp;�����������ݹ��࣬�����������������ʽ";
        	var frmReplyPromptTimer = setTimeout(function() {
				var contentTmp = EditorExtend.getContent();
				if (contentTmp.length != content_len) {
					frmReplyPrompt.innerHTML = "";
				}else{
					var fTimer = arguments.callee;
					frmReplyPromptTimer = setTimeout(fTimer, 1000);
				}
			}, 1000);
        	return;
		}
		var form = document.forms['frmpost'];
		form.content.value = content;
		var flag = EditorExtend.dopost();
		if (!flag) {
			return;
		}
		document.getElementById("btnSubmit").style.visibility ="hidden";
		this.checkcodeHide(this.checkcodeTipId);
		content = EditorExtend.getContent();
		form.content.value = content;
		form.submit();
	},
	/**
	 * ����ͼƬ��ַ
	 */
	"insertImageByUrl":function() {
		var url = $("imgUrl").value;
		if (!(url=="http://" || url=="")){
			EditorExtend.insert({image:url});
			EditorExtend.insert({html:"<br _moz_dirty=\"\"><br _moz_dirty=\"\">"});
			$("imgUrl").value = "http://";
		}
	},
	
	/**
	 * flash����ͼƬ
	 */
	"insertImgFromFlash":function(urls) {
		var arr = urls;
		if(arr.length < 1){
			return;
		}
		for(var i = 0; i<arr.length; i++){
			EditorExtend.insert({image:urls[i]});
			EditorExtend.insert({html:"<br _moz_dirty=\"\"><br _moz_dirty=\"\">"});
		}
		Dialog.close();
	},
	
	/**
	 * flash����ͼƬ
	 */
	"getImgConfig":function() {
		var arr = [4000,4000,3];//��ʾ������Ϊ4000��������Ϊ4000����С����Ϊ3m
		return arr;
	},
	
	"changeTitleColor":function(obj){
	    $("paid").value = obj.getAttribute("paid");
	    $("title").style.color = "#" + obj.getAttribute("ibgcolor");
	},
	"stop":""
};

/**
 * ������ҳ����֤���html
 * @param message
 * @param image
 */
BbsPost.checkcodeHtml = '\
	<div style="margin-left:90px;padding-bottom: 10px;">\
	<div>\
	<h5>��֤��:</h5>\
	<input size="6" name="checkcode" class="input007" maxlength="4" type="text"> \
	��<font color="blue">{message}</font>��\
	</div>\
	<div>\
	<a href="javascript:BbsUtil.reloadCode();" target="_self"><img id="imgcheckcode" src="{image}" alt="�����壬��һ��"></a>\
	<a href="javascript:BbsUtil.reloadCode();" target="_self" style="display: inline-block; margin-top: 20px;">�����壬��һ��</a> \
	</div>\
</div>';

var BbsPostType = {

	"typeSubmit":function() {
		var type = $("postExtend").getAttribute("type");
		if (type == "" || type==null){
			alert("��ȡ��������ʧ��.");
			return false;
		}
		
		try {
			//���������������������ִ��
			var flag = eval("BbsPostPlugins."+type+".save();");
			if (!flag) {
				return false;
			}
		}
		catch(e) {
			alert(e.message);
			return false;
		}
		return true;
	},
	/**
	 *��ͨ
	 */
	"normal":function() {
		this.active("normal");
		this.setContentName("�������ݣ�");
		this.setContentDesc("�����������ÿ3����һ���Զ������ڼ����壬��ͨ��Ctrl+V������ճ����");
	},
	/**
	 *�ʴ�
	 */
	"ask":function() {
		this.active("ask");
		this.setContentName("�ʴ�˵����");
		this.setContentDesc("ע�����<br />1.�����ԶԻ���������������<br />2.��Ѵ𰸣����1����ֻ������������������<br />3.�Ƽ��𰸣����2�������������߻���̳����Ա��������");
	},
	/**
	 *����
	 */
	"debate":function() {
		this.active("debate");
		this.setContentName("����˵����");
		this.setContentDesc("�����������ÿ3����һ���Զ������ڼ����壬��ͨ��Ctrl+V������ճ����");
		this.loadHtml("debate");
	},
	/**
	 *ͶƱ
	 */
	"vote":function() {
		this.active("vote");
		this.setContentName("ͶƱ˵����");
		this.setContentDesc("�����������ÿ3����һ���Զ������ڼ����壬��ͨ��Ctrl+V������ճ����");
		this.loadHtml("vote");
	},
	/**
	 *�
	 */
	"activity":function() {
		this.active("activity");
		this.setContentName("�˵����");
		this.setContentDesc("�����������ÿ3����һ���Զ������ڼ����壬��ͨ��Ctrl+V������ճ����");
		this.loadHtml("activity");
	},
	/**
	 *���ֶһ�
	 */
	"credits":function() {
		this.active("credits");
		this.setContentName("�һ�˵����");
		this.setContentDesc("�����������ÿ3����һ���Զ������ڼ����壬��ͨ��Ctrl+V������ճ����");
		this.loadHtml("credits");
	},
    "getId":function(type) {
		try {
			var id = eval("BbsPostPlugins."+type+".getId();");
			return id;
		}
		catch (e) {
			alert(e.message);
		}
    },
	/**
	 * ������չ����
	 */
	"hideExtend":function(type) {
		$("postExtend").style.display = "none";
		$("postExtend").className = type+"post";
		$("postExtend").setAttribute("type", type);
		//alert($("postExtend").getAttribute("type"));
	},
	/**
	 * ������չ����HTML
	 */
	"loadHtml":function(type) {
		var id = this.getId(type);
		new Ajax.Request("/bbs2009/type/"+type+"_post.jsp?boardid="+global_boardid+"&id="+id, {method: 'POST', onComplete:function(obj){
            $("postExtend").innerHTML=(obj.responseText);
			$("postExtend").style.display = "block";
			$("postExtend").className = type+"post";
        }});
	},
	/**
	 * ��ȡ����(ͶƱ���)
	 */
	"getType":function() {
		var content = EditorExtend.getContent();
		if (content==null) {
			return "normal";
		}
		if (content.indexOf("[plugin:vote]")!=-1) {
			return "vote";
		}
		if (content.indexOf("[plugin:debate]")!=-1) {
			return "debate";
		}
		if (content.indexOf("[plugin:activity]")!=-1) {
			return "activity";
		}
		if (content.indexOf("[plugin:credits]")!=-1) {
			return "credits";
		}
		var form = document.forms['frmpost'];
		if (form["icon"].value == 90) {
			return "ask";
		}
		return "normal";
	},
	"setContentName":function(name) {
		$("content_name").innerHTML = name;
	},

	"setContentDesc":function(desc) {
		$("content_desc").innerHTML = desc;
	},
	"active":function(type) {
		$("posttype_normal").className = "";
		if ($("posttype_ask") != null) {
			$("posttype_ask").className = "";
		}
		if ($("posttype_debate") != null) {
			$("posttype_debate").className = "";
		}
		if ($("posttype_debate") != null) {
			$("posttype_debate").className = "";
		}
		if ($("posttype_activity") != null) {
			$("posttype_activity").className = "";
		}
		if ($("posttype_credits") != null) {
			$("posttype_credits").className = "";
		}
		if ($("posttype_"+type) == null) {
			alert("��ȡ��������tab����["+type+"].");
		}
		else {
			$("posttype_"+type).className = "active";
		}
		this.hideExtend(type);
	},
	"stop":function() {
	}
}

var BbsPostPlugins = {};









/**
 * �ϴ�һ��ͼƬ���ʱ��ͼ����Flash�ص���JS
 * @param imgUrlsString
 */
function getResData(imgUrlsString){
	// console.log("121212");
	//log(imgUrlsString);
	var imgList = [];
	//log(imgUrlsString);
	// ��ͼƬ�������ӡ�
	if(imgUrlsString){
		var imgGroups = extractImgGroups(imgUrlsString);
		if (imgGroups) {
			for(var i=0; i<imgGroups.length; i++){
				//alert(imgGroups[i]);
				var img = extractImg(imgGroups[i]);
				if (img) {
					//log(img);
					EditorExtend.insert({image:img.postUrl});
					//var imgHtml = format('<img src="{src}" imgsrc="{srcUrl}" />', {src:img.postUrl,srcUrl:img.srcUrl});
					//EditorExtend.insert({html:imgHtml});
					EditorExtend.insert({html:'<br _moz_dirty=""><br _moz_dirty="">'});
					imgList.push(imgObjectToString(img));
				}
			}
		}
	}
	// ������д��������
	var sep = '$$';
	var obj = document.getElementById('photoSetImgUrls');
	if(imgList.length > 0 && obj){
		var srcContent = obj.value;
		var xStr = imgList.join(sep);
		if (srcContent) {
			xStr = srcContent + sep + xStr;
		}
		obj.value  = xStr;
	}
};

function imgObjectToString (img) {
	var sep = '!!';
	var str = [];
	if (img) {
		str.push(img.photoId);
		str.push(img.postUrl);
		str.push(img.photoUrl);
		str.push(img.srcUrl);
		str.push(img.thumbUrl);
		return str.join(sep);
	}
	return '';
}

/**
 * �����ϴ����ʱ��ͼ����Flash�ص���JS
 * @param str
 */
function closeWin(){
	//alert("close Window");
	Dialog.close();
};

function extractImgGroups(srcStr) {
	if(srcStr){
		return srcStr.split('@@');
	}
	return [];
};

function extractImg(imgGroup) {
	var photoIdPrefix = 'photoGarbageIds::';
	
	var srcImgPrefix = 'ourl::';
	var photoImgPrefix = 'userDef1Url::';
	var postImgPrefix = 'userDef2Url::';
	var thumbImgPrefix = 'userDef3Url::';
	
	if (imgGroup) {
		var imgList = imgGroup.split('#');
		var img = {};
		for(var j=0; j<imgList.length; j++){
			var imgStr = imgList[j];
			if (imgStr.indexOf(photoIdPrefix) >= 0) {
				img.photoId = imgStr.substring(photoIdPrefix.length, imgStr.length);
			} else if (imgStr.indexOf(srcImgPrefix) >= 0) {
				img.srcUrl = imgStr.substring(srcImgPrefix.length, imgStr.length);
			} else if (imgStr.indexOf(photoImgPrefix) >= 0) {
				img.photoUrl = imgStr.substring(photoImgPrefix.length, imgStr.length);
			} else if (imgStr.indexOf(postImgPrefix) >= 0) {
				img.postUrl = imgStr.substring(postImgPrefix.length, imgStr.length);
			} else if (imgStr.indexOf(thumbImgPrefix) >= 0) {
				img.thumbUrl = imgStr.substring(thumbImgPrefix.length, imgStr.length);
			}
		}
		return img;
	}
	return null;
};

/**
 * ɾ���༭���е�ͼ����Ƭ���ӡ�
 * ͬʱ���������photoSetImgUrls��������ͼƬ��ϵ�������ݡ�
 */
function remove163Imgs () {
	var hiddenField = document.getElementById('photoSetImgUrls');
	//log(hiddenField);
	if (hiddenField) {
		hiddenField.value = '';
	}
	//log(hiddenField.value);
	
	var photo163Regex = /<\s*img[^>]*\s+src="?http:\/\/imgbbs\.ph\.126\.net\/[^>]+>/gmi;
	var html = EditorExtend.getContent();
	if (!html) {
		return;
	}
	//log('1:'+html);
	html = html.replace(photo163Regex, '');
	//log('2:'+html);
	
	/**
	var imgSrcList = html.match(photo163Regex);
	for (var i=0; i<imgSrcList.length; i++) {
		log(result[i]);
	}
	**/
	
	//EditorExtend.setContent(html);
	oEditor.set({html:html});
}
