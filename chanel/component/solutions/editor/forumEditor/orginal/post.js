/**
 * 格式化文本，替换字符串拼接方案。
 * 可以使用format函数，替换字符串中的{**}符号。
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
		alert("获取form出错.");
		return;
	}
	var form = parent;
	var q = form['q'].value;
	if(q==""||q=="请输入关键词"){
		form["q"].focus();
		alert("请输入关键字");
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
	 * 显示版面访问记录
	 */
	"showHistoryBoardInfo":function() {
		var boardList = BbsProfile.VisitHistory.getHistoryInfo();
		if (boardList == null) {
			new Insertion.Bottom('visitHistory', "无");
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
	 * 显示图片上传框
	 */
	"showUploadImageSwfBox":function() {
		//Bbs.loadDwr();  //预先记载Dwr
        if (!BbsCookie.isLogined()) { //未登录
            Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
            return;
        }
        else {
        	BbsAdmin.showDialog('上传/插图', '/bbs/swfupload.jsp?boardid='+global_boardid);
            Dialog.setWidth(682);
        }
	},
	/**
	 * 隐藏图片上传框
	 */
	"hideUploadImageBox":function() {
		Dialog.close();	
	},
	//切换到本地图片上传
	"nativeImage":function(){
		$("nativeimgbtn").className = "on";
		$("netimgbtn").className = "";
		$("netimgid").style.display="none";
		//$("nativeimgid").style.position="static";
		//$("nativeimgid").style.left="0";
	},
	
	//切换到网络图片上传
	"netImage":function(){
		$("nativeimgbtn").className = "";
		$("netimgbtn").className = "on";
		$("netimgid").style.display="block";
		//$("nativeimgid").style.position="absolute";
		//$("nativeimgid").style.left="-9999px";
	},

	/**
	 * 将选中的文件上传到图片服务器
	 */
	"uploadImage":function() {
		this.insertImageByUrl();
	},
	/**
	 * 验证码提示窗口的id
	 */
	"checkcodeTipId":"_checkcode_tips",
	/**
	 * 显示验证码提示窗口
	 */
	"checkcodePopup":function (id, val) {
		var checkcodeObj = document.getElementById(id);
		if (checkcodeObj) {
    		checkcodeObj.innerHTML = val;
    		checkcodeObj.style.display = 'block';
    	}
	},
	/**
	 * 隐藏验证码提示窗口
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
            //判断用户是否需要输入验证码？
            var checkcode = form.checkcode;
            if (typeof(checkcode) == "object") {
            	BbsUtil.clickStat("checkreply");
                if (checkcode.value == "") {
                    //alert("验证码还没有输入.");
                	this.checkcodePopup(this.checkcodeTipId, '验证码还没有输入。');
                    checkcode.focus();
                    return true;
                }
                if (checkcode.value.length != 4) {
                    //alert("验证码的位数不对哦.");
                	this.checkcodePopup(this.checkcodeTipId, '验证码的位数不对。');
                    checkcode.focus();
                    return true;
                }
                // 如果用户输入了验证码，提前校验验证码。
                var codeRight = false;
                DWREngine.setAsync(false);
                Dwr.checkcode(checkcode.value, function(data){
                	codeRight = data;
                });
                DWREngine.setAsync(true);
                if (!codeRight) {
                	//alert('验证码错误。');
                	this.checkcodePopup(this.checkcodeTipId, '验证码错误。');
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
                  verifyMessage = "您是匿名发帖，需要输入验证码。";
              }
              
              var returnResult = false;
              
              if (photoMsg != '') {
            	  this.checkcodePopup(this.checkcodeTipId, photoMsg);
            	  //alert(photoMsg);
            	  remove163Imgs();
            	  returnResult = true;
              }
              
              if (verifyMessage != "") {

            	  // ,您发表帖子需要输入验证码。
                  var html = BbsPost.checkcodeHtml;
                  html = format(html,{message:verifyMessage,image:BbsUtil.getCodeJsp()});
                  /**
                	  '<div><h5>验证码:</h5>　'
                	  +'<input type="text" size="6" name="checkcode" value="" class="input007" maxlength="4"/> '
                	  +'(<font color="blue">'+verifyMessage+'</font>)<br/>　'
                	  +'<a href="javascript:BbsUtil.reloadCode();" target="_self"> '
                	  +'<img id="imgcheckcode" src="'+BbsUtil.getCodeJsp()+'" alt="看不清，换一张"/></a> '
                	  +'<a href="javascript:BbsUtil.reloadCode();" target="_self" style="line-height:50px;">看不清，换一张</a> </div> ';	
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
	 * 发帖提交
	 */
	"dopost":function() {
		BbsUtil.clickStat("postout");
		var content = EditorExtend.getContent();
		content_len = content.length;
		if(content.trim() == '' || content.trim() == "<br>" || content.trim() == "<DIV></DIV>"){
			Dialog.alert("内容不能为空哦.");
	        return;
		}
		// 清注释
		content = content.replace(/<!--(.|\s)*?-->/gi, "");
		var content_char = content.replace(/[^\x00-\xff]/gi, "aa");
		// 计算字数
		if(content_char.length >= 65000){
			var frmReplyPrompt = document.getElementById("frmReplyPrompt");
			frmReplyPrompt.innerHTML = "&nbsp;您发布的内容过多，请缩减字数或清除格式";
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
	 * 插入图片网址
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
	 * flash插入图片
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
	 * flash插入图片
	 */
	"getImgConfig":function() {
		var arr = [4000,4000,3];//表示宽限制为4000，高限制为4000，大小限制为3m
		return arr;
	},
	
	"changeTitleColor":function(obj){
	    $("paid").value = obj.getAttribute("paid");
	    $("title").style.color = "#" + obj.getAttribute("ibgcolor");
	},
	"stop":""
};

/**
 * 发主贴页，验证码的html
 * @param message
 * @param image
 */
BbsPost.checkcodeHtml = '\
	<div style="margin-left:90px;padding-bottom: 10px;">\
	<div>\
	<h5>验证码:</h5>\
	<input size="6" name="checkcode" class="input007" maxlength="4" type="text"> \
	（<font color="blue">{message}</font>）\
	</div>\
	<div>\
	<a href="javascript:BbsUtil.reloadCode();" target="_self"><img id="imgcheckcode" src="{image}" alt="看不清，换一张"></a>\
	<a href="javascript:BbsUtil.reloadCode();" target="_self" style="display: inline-block; margin-top: 20px;">看不清，换一张</a> \
	</div>\
</div>';

var BbsPostType = {

	"typeSubmit":function() {
		var type = $("postExtend").getAttribute("type");
		if (type == "" || type==null){
			alert("获取帖子类型失败.");
			return false;
		}
		
		try {
			//插件程序，在正常参数检查后执行
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
	 *普通
	 */
	"normal":function() {
		this.active("normal");
		this.setContentName("帖子内容：");
		this.setContentDesc("您输入的内容每3分钟一次自动保存于剪贴板，可通过Ctrl+V键进行粘贴。");
	},
	/**
	 *问答
	 */
	"ask":function() {
		this.active("ask");
		this.setContentName("问答说明：");
		this.setContentDesc("注意事项：<br />1.您可以对回帖内容做答案设置<br />2.最佳答案：最多1个，只能由提问者自行设置<br />3.推荐答案：最多2个，可由提问者或论坛管理员进行设置");
	},
	/**
	 *辩论
	 */
	"debate":function() {
		this.active("debate");
		this.setContentName("辩论说明：");
		this.setContentDesc("您输入的内容每3分钟一次自动保存于剪贴板，可通过Ctrl+V键进行粘贴。");
		this.loadHtml("debate");
	},
	/**
	 *投票
	 */
	"vote":function() {
		this.active("vote");
		this.setContentName("投票说明：");
		this.setContentDesc("您输入的内容每3分钟一次自动保存于剪贴板，可通过Ctrl+V键进行粘贴。");
		this.loadHtml("vote");
	},
	/**
	 *活动
	 */
	"activity":function() {
		this.active("activity");
		this.setContentName("活动说明：");
		this.setContentDesc("您输入的内容每3分钟一次自动保存于剪贴板，可通过Ctrl+V键进行粘贴。");
		this.loadHtml("activity");
	},
	/**
	 *积分兑换
	 */
	"credits":function() {
		this.active("credits");
		this.setContentName("兑换说明：");
		this.setContentDesc("您输入的内容每3分钟一次自动保存于剪贴板，可通过Ctrl+V键进行粘贴。");
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
	 * 隐藏扩展内容
	 */
	"hideExtend":function(type) {
		$("postExtend").style.display = "none";
		$("postExtend").className = type+"post";
		$("postExtend").setAttribute("type", type);
		//alert($("postExtend").getAttribute("type"));
	},
	/**
	 * 加载扩展内容HTML
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
	 * 获取类型(投票、活动)
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
			alert("获取帖子类型tab出错["+type+"].");
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
 * 上传一批图片完成时。图集的Flash回调的JS
 * @param imgUrlsString
 */
function getResData(imgUrlsString){
	// console.log("121212");
	//log(imgUrlsString);
	var imgList = [];
	//log(imgUrlsString);
	// 将图片插入帖子。
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
	// 将内容写入隐藏域
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
 * 所有上传完毕时。图集的Flash回调的JS
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
 * 删除编辑器中的图集照片链接。
 * 同时清除隐藏域photoSetImgUrls（保存了图片关系）的内容。
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
