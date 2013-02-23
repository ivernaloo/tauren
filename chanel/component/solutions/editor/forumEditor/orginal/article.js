BbsUtil.checkReplyPost = function(){
	BbsUtil.clickStat("replyout");
	if (!BbsCookie.isLogined() && !BoardConfig.isAllowGuestPostThread()) { //未登录
        Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
        return false;
    }
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
	var form = document.forms["frmpost"];
	form.content.value = content;
    if (1==1) {
        //判断用户是否需要输入验证码？
        var checkcode = form.checkcode;
        if (typeof(checkcode) == "object") {
        	BbsUtil.clickStat("checkreply");
            if (checkcode.value == "") {
                //alert("验证码还没有输入.");
            	BbsPost.checkcodePopup('_checkcode_tips', '验证码还没有输入。');
                checkcode.focus();
                return false;
            }
            if (checkcode.value.length != 4) {
                //alert("验证码的位数不对哦.");
            	BbsPost.checkcodePopup('_checkcode_tips', '验证码的位数不对。');
                checkcode.focus();
                return false;
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
            	BbsPost.checkcodePopup('_checkcode_tips', '验证码错误。');
            	return true;
            }
        }
        else {
        	var verifyMessage = "";
        	var photoMsg = '';
        	if (BbsCookie.isLogined()) {
        		
        		// 如果是楼主回帖
        		var imgUrls = '';
        		//var loginedPassport = BbsCookie.getPassport();
        		
        		//alert(global_author_username +'#' +loginedPassport);
        		// 非楼主回复的帖子，有图片，也存储关系。
        		//if (global_author_username == loginedPassport) {
    			// 图集的图片关系
        		var hiddenField = document.getElementById('photoSetImgUrls');
        		if (hiddenField) {
        			imgUrls = hiddenField.value;
        		}
        		//}
        		
        		var result = BbsUtil.isWantVerify(false,imgUrls);
        		//alert(result);
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
        	
        	var returnResult = true;
            
            if (photoMsg != '') {
			  //alert(photoMsg);
            	BbsPost.checkcodePopup('_checkcode_tips', photoMsg);
			  remove163Imgs();
			  returnResult = false;
            }
            
        	if (verifyMessage != "") {
        		// ,您发表回复需要输入验证码。
        		var html = BbsUtil.checkcodeHtml;
        		html = format(html,{message:verifyMessage,image:BbsUtil.getCodeJsp()});
        		
        		/**
        			'<div style="clear:both;">验证码:　　　'
        			+'<input type="text" size="6" name="checkcode" value="" class="input007" maxlength="4" /> '
        			+'(<font color="blue">'+verifyMessage+'</font>)<br/>'
        			+'<a href="javascript:BbsUtil.reloadCode();" target="_self"> '
        			+'<img id="imgcheckcode" src="'+BbsUtil.getCodeJsp()+'" alt="看不清，换一张"/></a>'
        			+'<a href="javascript:BbsUtil.reloadCode();" target="_self" style="line-height:50px;">看不清，换一张</a></div>';
				**/
		
        		new Insertion.Before('frmpost_upload', html);
				BbsUtil.clickStat("checknum");
        		form.checkcode.focus();
        		returnResult = false;
        	}
        	
        	if (!returnResult) {
        		return returnResult;
        	}
        	
        }
        //判断是否含有关键字前，需要把提交按钮隐藏，否则会有可能多次重复提交
        document.getElementById("btnSubmit").style.visibility = "hidden";
        BbsPost.checkcodeHide('_checkcode_tips');
    
	    Dwr.hasForfendKeyword(global_boardid,global_threadid,"",form.content.value,function(data){
	        if(data== true){
	            BbsAdmin.showDialog('严禁词', '/bbs/dialog/hasforfend.jsp?boardid='+global_boardid+'&threadid='+global_threadid);
	            document.getElementById('dialog_close_btn').style.display="none";
	        }else{
	          Dwr.hasSubtleKeyword(global_boardid,global_threadid,"",form.content.value,function(data){
	              if(data==true){
	                  BbsAdmin.showDialog('敏感词', '/bbs/dialog/hassubtle.jsp?boardid='+global_boardid+'&threadid='+global_threadid);
	              }
	              else{
	                                      document.getElementById("btnSubmit").style.visibility ="hidden";
	                                      form.submit();
	              }
	          });
	        }
	    });
    }
};

/**
 * 回复页，验证码的html
 * @param message
 * @param image
 */
/*BbsUtil.checkcodeHtml = '\
	<div style="clear: both; margin-left: 40px; padding: 10px 0;">\
	<div>验证码：\
	<input size="6" name="checkcode" class="input007" maxlength="4" type="text"> \
	（<font color="blue">{message}</font>）\
	</div>\
	<div style="margin-top:10px;">\
	<a href="javascript:BbsUtil.reloadCode();" target="_self"><img id="imgcheckcode" src="{image}" alt="看不清，换一张"></a>\
	<a href="javascript:BbsUtil.reloadCode();" target="_self" style="display: inline-block; margin-top: 20px;">看不清，换一张</a>\
	</div>\
</div>';*/
BbsUtil.checkcodeHtml = '\
	<div style="clear: both; margin-left: 40px; padding: 10px 0;text-align:left">\
	<div>验证码：\
	<input type="text" maxlength="4" class="input007" name="checkcode" size="6">\
	（<font color="blue">{message}</font>）\
	</div>\
	<div style="margin-top:10px;">\
	<a target="_self" href="javascript:BbsUtil.reloadCode();"><img alt="看不清，换一张" src="/bbs/code/code9.jsp" id="imgcheckcode"></a>\
	<a style="display: inline-block; margin-top: 20px;" target="_self" href="javascript:BbsUtil.reloadCode();">看不清，换一张</a>\
	</div>\
</div>'

function changeArticleAdminMenuDiv(articleid,display){
	if(filename!="article"){
		return;
	}
	var obj = $("res_"+articleid);
	var articleToolsObj = $(obj).next().getElementsByClassName("articleTools")[0];
	var articleInfoObj = $(obj).next().getElementsByClassName("articleInfo")[0];
	if(articleToolsObj == null || articleInfoObj==null){
		return;
	}
	if(display=="block"){
		articleToolsObj.style.position = "static";
		articleInfoObj.style.position = "static";
	}else{
		articleToolsObj.style.position = "";
		articleInfoObj.style.position = "";
	}

}

Bbs.showMenu = function(id, autoHide, articleid) {
	var obj = $(id);
	var menu = obj.getElementsByClassName("dropmenu");
	if (menu == null) {
		alert("菜单不存在.");
		return;
	}
	else {
		menu = menu[0];
	}

	if (menu.style.display == "block") {
		menu.style.display = "none";
		changeArticleAdminMenuDiv(articleid,"none");
		return;
	}
	
	menu.style.display = "block";
	menu.style.zIndex=300;
	changeArticleAdminMenuDiv(articleid,"block");

	if (typeof(autoHide) == "undefined") {
		var autoHide = true;
	}
	if (!autoHide) {
		return;
	}
	obj.onMouseDown=function() {
		menu.style.display = "block";
		changeArticleAdminMenuDiv(articleid,"block");
	}
	obj.onMouseUp=function() {
		menu.style.display = "block";
		changeArticleAdminMenuDiv(articleid,"block");
	}
	obj.onmouseover=function() {
		menu.style.display = "block";
		changeArticleAdminMenuDiv(articleid,"block");
	}
	obj.onmouseout=function() {
		menu.style.display = "none";
		changeArticleAdminMenuDiv(articleid,"none");
	}
}
var myCredits = -1;
var BbsArticle = {
	"init":function() {
	}
	/**
	 * 显示管理菜单
	 */
	,"showAdminMenu":function(articleid) {
		Bbs.showMenu("adminMenu_"+articleid, true, articleid);
	}
	/**
	 * 显示用户信息
	 */
	,"showUserinfoMenu":function(articleid, username) {
		BbsUtil.clickStat("neckname");
		var obj = $("userDetail_"+articleid);	
		var nextNickNameObj = $(obj.parentNode.parentNode.parentNode).next().getElementsByClassName("name")[0];

		if(nextNickNameObj!=null){
			obj.parentNode.style.zIndex = 120;
			nextNickNameObj.style.zIndex = 109;
		}
		$("userinfoMenu_"+articleid).style.zIndex = 9999;
		
		if (obj.innerHTML=="") {
			var url = "/bbs2009/userinfo.jsp?username="+username;

			var html = '<div class="atrMoreHead"><span class="title">个人资料</span><span class="close"><a title="关闭" href="javascript:void(0)" onclick="BbsArticle.hideUserinfoMenu(this)">关闭</a></span></div>';
			html += '<div>数据读取中...</div>';

			obj.innerHTML = html;
			new Ajax.Request(url, {
			  method: 'get',
			  requestHeaders:["If-Modified-Since","0"],
			  onComplete: function(data) {
				  var content = (data.responseText);
				  obj.innerHTML = content;
			  }
			});
		}
		var autoHide = false;
		Bbs.showMenu("userinfoMenu_"+articleid, autoHide, articleid);
	}
	,"hideUserinfoMenu":function(obj) {
		var menu = obj.parentNode.parentNode.parentNode;
		menu.style.display = "none";
		var userinfoMenu = menu.parentNode.parentNode;
		userinfoMenu.style.zIndex = 1;
	}
	
	,"copyToClipBoard":function(clipname,title){
		var url = window.document.location.href;
		var clipBoardContent = url;
		if (title != null || title != ""){
			clipBoardContent += '\r\n' + title;;
		}
		BbsUtil.copy_clip(clipBoardContent);
		$(clipname).innerHTML="<a>复制成功</a>";

		Dwr.copyUrl(title, url, function(data) {});
	}
	
	,"reply":function(){
		BbsUtil.clickStat("tpreply");
		//window.location.hash="#reply";
		NTES("#div_reply").scrollIntoView(true);
        //document.getElementById("content").focus();
	}
	
	,"goTop":function(){
		window.location.hash="#top";
	}
	
	/**
     * 引用回复
     */
    ,"quoteReply":function(articleid) {
    	BbsUtil.clickStat("opreply");
        if ($("div_reply").style.display == "none") {
            alert("当前帖子不允许发表评论.");
            new Ajax.Request("/bbs/checkreply.jsp",{method:"get"});
            return;
        }
        if (!Bbs.checkLoginedPostReply(function(){BbsArticle.quoteReply(articleid);})) {
			// 该版面需要登录才能回复
        	// Bbs.showLoginDialog(true);
        	return;
        }

        var content = '[quote]' + articleid + '[/quote]\n';
		
		EditorExtend.setContent({text:content});
		//document.documentElement.scrollTop = 600000;
		NTES("#div_reply").scrollIntoView(true);
    }

	,"exchangeMark":function(){
		 if (!BbsCookie.isLogined()) { //未登录
            Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
        }
		Dwr.exchangeMark(function(data){
			alert(data);
		});
	}
	
	,"downloadPDF":function(boardid,articleid){
		Dwr.downloadPDF(boardid,articleid,function(data){;});
	}
	
	,"print":function(boardid,articleid,full){
		Dwr.printLog(boardid,articleid,full,function(data){;});
	}
	
	/**
     * 只显示楼主
     */
    ,"onlyShowFloorMaster":function(boardid,threadid,userid){
    	BbsUtil.clickStat("showlz");
    	document.location = '/bbs2009/article.jsp?boardid='+boardid+'&articleid='+threadid+'&userid='+userid;
    }
    /**
     * 显示所有楼层
     */
    ,"showAllFloor":function(boardid,threadid){
    	document.location = '/bbs2009/article.jsp?boardid='+boardid+'&articleid='+threadid;
    }
    /**
     * 初始化回复可见的div，并且，使用dwr访问服务器，如果该用户已经回复，则显示原始图片
     */
	,"initHiddenMainPost":function(boardid,threadid,callback){
		
		/**
		 * 
		 * 取消回复可见。
		 * 
		 * @create_date 2012-1-10
		 * @last_modified
		 * @author Ben Liu
		 * 
		 */
		
		return false;
		
		/**
         * 特定的帖子在回复之后才可见图片，修改图片不可见的样式。开始。
         * @create_date 2011-5-3
         * @last_modified 2011-5-11
         * @author Ben Liu
         */
		// 初始化样式
		var hiddenDivs = NTES("div.replyToView");
    	
    	hiddenDivs.each(function(i){
    		var item = this;
			item.onmouseover = function () {this.className = this.className + ' replyToView-hover';};
			item.onmouseout = function () {this.className = this.className.replace(/\s*replyToView\-hover/,'');};
			var links = item.getElementsByTagName('a');
			for(var j = 0; j < links.length; j++){
				links[j].onclick = function () {
					BbsArticle.reply()
				};
			}
    	});
    	/**
         * 特定的帖子在回复之后才可见图片，修改图片不可见的样式。结束。
         * @create_date 2011-5-3
         * @last_modified 2011-5-11
         * @author Ben Liu
         */
		
		if (!BbsCookie.isLogined()) {
			// 返回之前一定记得回调
			if (typeof (callback) == "function") {
				callback();
			}
        	return;
        }
		Dwr.isRepliedThread(boardid,threadid,function(data){
		   if(data){
			  if($(threadid + "_mainpost")==null) return;
			  $(threadid + "_mainpost").style.display = "";
			  //$(threadid + "_hidden_tips").style.display = "none";
			  /**
	             * 特定的帖子在回复之后才可见图片，如果用户回复了，转换成原始图片。开始。
		         * @create_date 2011-5-3
		         * @last_modified 2011-5-11
	             * @author Ben Liu
	             */
			  
				var realImgList = [];
				var fakeImgList = [];
				hiddenDivs.each(function(i){	// 不能在遍历的同时插入和删除节点，先储存到数组中
					var item = this;
					var url = item.getAttribute('url');
					
					var img =document.createElement('img');
					img.src = url;
					
					realImgList.push(img);
					fakeImgList.push(item);
				});
			  
				for(var i = 0; i < realImgList.length; i++){
					var item = fakeImgList[i];
					var img = realImgList[i];
					
					/**
				     * 回复之后才可见图片功能中，解决图片中宽度和高度问题。开始。
				     * @create_date 2011-5-4
				     * @last_modified 2011-5-4
				     * @author Ben Liu
				     */
					
					var url = img.src;
					
					var widthPos = url.indexOf('#');
					var heightPos = url.indexOf('*');
					var width = -1;
					var height = -1;			
					if (widthPos >= 0) {	// 包含宽度属性
						var widthStr = '-1';
						if (heightPos >= 0) {	// 包含高度属性
							widthStr = url.substring(widthPos + 1,heightPos);
						} else {
							widthStr = url.substring(widthPos + 1);
						}
						width = parseInt(widthStr);	// 得到图片宽度
					}
					if (heightPos > 0) {	// 包含高度属性
						var heightStr = '-1';
						heightStr = url.substring(heightPos + 1);
						height = parseInt(heightStr);	// 得到图片高度
					}
					
					if (width > 0) {	// 如果图片有宽度，设置图片宽度
						img.width = width;
						img.src = url.substring(0, widthPos);	// 去掉图片src上的高度和宽度信息
					}
					if (height > 0) {	// 如果图片有高度，设置图片高度
						img.height = height;	
						if (width < 0) {	// 当没有去掉图片src上的高度和宽度信息的时候，去掉
							img.src = url.substring(0, heightPos);	
						}
					}
					/**
				     * 回复之后才可见图片功能中，解决图片中宽度和高度问题。结束。
				     * @create_date 2011-5-4
				     * @last_modified 2011-5-4
				     * @author Ben Liu
				     */
					item.parentNode.insertBefore(img, item.nextSibling);  
					item.parentNode.removeChild(item);
				}
			  
				/**
	             * 特定的帖子在回复之后才可见图片，如果用户回复了，转换成原始图片。结束。
		         * @create_date 2011-5-3
		         * @last_modified 2011-5-11
	             * @author Ben Liu
	             */
		   }
		   
		   // 回调
		   if (typeof (callback) == "function") {
				callback();
		   }
		});
	}
	/**
	 * 查看我的频道积分
	 */
	,"showMyCredits":function(obj) {
		if (obj == null || typeof(obj) == "undefined") {
			return ;
		}
		BbsUtil.clickStat("showCredits");
		if (!BbsCookie.isLogined()) {	// 没有登录，显示登陆框
			Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
			return;
		}
		obj.onclick = null;
		Dwr.getChannelMark(function(data){
			if (data == null || typeof(data) == "undefined") {
				data = 0;
			}
			obj.innerHTML = '我的基金：'+data;
			obj.style.cursor = "text";
			myCredits = data;
		});
	}
	/**
	 * 兑换奖品超链接点击
	 */
	,"creditsApplyLink":function() {
		BbsUtil.clickStat("creditlink");
	}
}


var ReplyLoginDialog = {
	    /**
	     * 登录窗口初始化操作
	     */
	    "init":function() {
			Userinfo.initLogin(document.getElementById("re_username"),document.getElementById("re_password"),document.getElementById("re_url"),1);
	    }
	    ,"getForm":function() {
	        return document.forms["frmReplyLoginDialog"];
	    }
	    /**
	     * 登录窗口提交验证
	     */
	    ,"dopost":function() {
	    	BbsUtil.clickStat("footlogin");
	    	if (NTES("#re_savelogin").checked == true) {
    			BbsUtil.clickStat("footautologin");
    		}
	        var form = this.getForm();
	        username = form.username.value,
	        password = form.password.value,
	        savelogin = NTES("#re_savelogin").checked ? 1 : 0;
	        if (username == "" || username == "如 name@example.com") {
	            alert("请输入您的用户名.");
	            form.username.focus();
	            return false;
	        }
	        if (form.password.value == "") {
	            alert("请输入密码.");
	            form.password.focus();
	            return false;
	        }
	        /*
	        var savelogin;
	        if(form.savelogin.checked){
	        	savelogin = "1";
	        	form.savelogin.value = "1";
	        }else{
	        	savelogin = "0";
	        	form.savelogin.value = "1";
	        }
	        */
	        Userinfo.removeUserinfo();//清空用户信息
	        form.url.value = location.href;
	        //var url = form.url.value;
	        //Bbs.loginPassport(form.username.value, form.password.value, savelogin, BbsUtil.showLoginInfo);
	        return true;
	        
	        //this.login(username, password, savelogin);
			//return false;
	    }
	    
	    ,"login1":"http://reg.163.com/services/httpLoginExchgKey"
		,"login2":"http://reg.163.com/httpLoginVerifySHA1.jsp"
		/**
		 * 工具函数
		 */
		 ,"format":function(param){
			if (typeof param == "undefined") {
				return ""
			}
			if (typeof param != "object") {
				throw new Error("data sended to the server must be 'object'");
			}
			var s = [];
			for (var j in param) {
				s.push(encodeURIComponent(j) + "=" + encodeURIComponent(param[j]));
			}
			return s.join("&").replace(/%20/g, "+");
		 }
		 ,"crossDomainRequest":function(options){
			var t = this;
			NTES.ajax.importJs(options.url + "?" + t.format(options.param), function() {
				options.callBack();
			}, "UTF-8");
		 }
		/**
		 * 异步登录逻辑
		 */
		,"login":function(userNameVal, password ,savelogin) {
			var t = this,
				logintimestamp = new Date().getTime(),
				rnd = base64(utf16to8(userNameVal + "\n" + logintimestamp)),
				tmpObj = {
				url:t.login1,
				param: {
					rnd: rnd,
					jsonp: "setLoginStatus"
				},
				callBack: function() {
					if (typeof loginStatus == "undefined") {
						return;
					};
					var status = loginStatus.split("\n"), code = status[0];
					if (code == "200") {
						var uid = status[1];
						var seObj = {
							url:t.login2,
							param: {
								rcode: SHA1(base64(utf16to8(uid)) + base64(utf16to8(MD5(password))) + rnd),
								product: "bbs",
								jsonp: "setLoginStatus",
								savelogin:savelogin
							},
							callBack: function() {
								if (typeof loginStatus == "undefined") {
									return;
								};
								switch (loginStatus) {
									case "200":
										//alert("登录成功");
										Userinfo.loadUserinfo();
										NTES("#articleReplyLogin").style.display = "none";
										break;
									case "420":
										alert("用户名错误");
										break;
									case "460":
										alert("密码错误");
										break;
									default:
										alert("登录失败");
										break;
								};
							}
						};
						t.crossDomainRequest(seObj);
					} else {
						alert(code);
					};
					//loginStatus && delete loginStatus
					if(loginStatus) {
						try {
							delete loginStatus
						} catch(e) {}
					}
				}
			};
			t.crossDomainRequest(tmpObj);
			return false;
		}
	}

function getNextSibling(startBrother) {
	endBrother = startBrother.nextSibling;
	while (endBrother.nodeType != 1) {
		endBrother = endBrother.nextSibling;
	}
	return endBrother;
};
var homeCreditsValue;
var _home_points_links='<a href="http://bbs.home.163.com/bbs/jzjj/258404326.html" target="_blank"><span class="home-bbs-score-box-detail">详细规则</span></a><span class="blank6"></span><a href="http://bbs.home.163.com/list/jzjj.html" target="_blank" onclick="BbsArticle.creditsApplyLink();"><span class="home-bbs-score-box-detail2">兑换奖品</span></a>';
var _home_points_tip='在家居论坛发表帖子可获得装修基金，兑换实物奖！发帖越多，基金越高，精华和推荐更有额外奖金噢！';
var _home_points_view='<span class="myscore" onclick="BbsArticle.showMyCredits(this);">查看我的基金</span>';
var showHtml = '<div>'+_home_points_tip+_home_points_links+_home_points_view+'</div>';
function bbsScoreMousever(obj) {
	homeCreditsValue && clearTimeout(homeCreditsValue);
	var Popup = getNextSibling(obj);
	if (Popup.style.visibility != "visible") {
		BbsUtil.clickStat("creditunfold");
	}
	Popup.style.visibility = "visible";
	if (myCredits != -1) {
		_home_points_my='<span class="myscore" style="cursor: text;">我的基金：'+myCredits+'</span>';
		showHtml='<div>'+_home_points_tip+_home_points_links+_home_points_my+'</div>';
	}
    Popup.innerHTML = showHtml;
};

function bbsScoreMouseout(obj) {
	var Popup = getNextSibling(obj);
	homeCreditsValue = setTimeout(function() {Popup.style.visibility = "hidden"},100);
};

function bbsScoreBoxMousever(obj) {
	homeCreditsValue && clearTimeout(homeCreditsValue);
	obj.style.visibility = "visible";
};

function bbsScoreBoxMouseout(obj) {
	homeCreditsValue && clearTimeout(homeCreditsValue);
	obj.style.visibility = "hidden";
};
/**
 * 编辑器内容自动保存
 */
var localStorageAdapter = {
	storeName: 'NTESBBS',
	isLocalStorage: window.localStorage? true: false,
	dataDOM: this.isLocalStorage? null: (function() {
		try{
			var dataDOM = document.createElement('input'),
			expires = new Date();
			dataDOM.type = 'hidden';
			dataDOM.style.display = 'none';
			//dataDOM.addBehavior('#default#userData');
			dataDOM.addBehavior&&dataDOM.addBehavior('#default#userData');
			document.body.insertBefore(dataDOM, document.body.firstChild);
			expires.setDate(expires.getDate() + 30);
			dataDOM.expires = expires.toUTCString();
			return dataDOM;
		} catch(ex) {
			return null;
		}
	})(),
	
	set: function(key, value) {
		var dataDOM = this.dataDOM;
		if(this.isLocalStorage) {
			window.localStorage.setItem(key, value);
		} else {
			if(dataDOM) {
				dataDOM.load(this.storeName);
				dataDOM.setAttribute(key, value);
				dataDOM.save(this.storeName);
			}
		}
	},
	
	get: function(key) {
		var dataDOM = this.dataDOM;
		if(this.isLocalStorage) {
			return window.localStorage.getItem(key);
		} else {
			if(dataDOM) {
				dataDOM.load(this.storeName);
				return dataDOM.getAttribute(key);
			}
		}
	},
	
	remove: function(key) {
		var dataDOM = this.dataDOM;
		if(this.isLocalStorage) {
			window.localStorage.removeItem(key);
		} else {
			if(dataDOM) {
				dataDOM.load(this.storeName);
				dataDOM.removeAttribute(key);
				dataDOM.save(this.storeName);
			}
		}
	}
}
var autoSaveTime;
function saveContent() {
	autoSaveTime && clearTimeout(autoSaveTime);
	var autoSaveLabel = document.getElementById("autoSaveLabel");
	autoSaveLabel.innerHTML = "正在保存....";
	BbsUtil.clickStat("saveContent");
	var content = oEditor.editor.getContent().replace(/^<br>\s*$|^\s*$|^<DIV><\/DIV>$|^<P>&nbsp;<\/P>$/, '');
	if(content) {
		localStorageAdapter.set('bbs_content_autosave', content);
	}
	autoSaveTime = setTimeout(function() {
		autoSaveLabel.innerHTML = "每30秒自动保存一次内容";},1000);
}
					
function restoreContent() {
	BbsUtil.clickStat("restoreContent");
	var content = localStorageAdapter.get('bbs_content_autosave');
	if(content) {
		oEditor.editor.setContent(content);
	}
}

function clearContent() {
	BbsUtil.clickStat("clearContent");
	oEditor.editor.setContent('');
}
/*
 * var jq = jQuery.noConflict(); jq(document).ready(function(){
 * 
 * var dropswitch = jq("a.dropswitch"); var dropmenu =
 * jq(".dropmenu:not('.atrMore')"); dropmenu.hide(); dropswitch.each(function(i) {
 * jq(this).hover( function () { dropmenu.eq(i).fadeIn("fast"); }, function () {
 * dropmenu.eq(i).hide(); } ); }); dropmenu.hover( function () {
 * jq(this).show(); }, function () { jq(this).hide(); } );
 * 
 * var username = jq("div.authorInfo > div.name > a");
 * username.attr("href","javascript:void(0);") var atrMore = jq("div.atrMore");
 * atrMore.hide(); username.each(function(i) { jq(this).click( function () {
 * atrMore.hide().eq(i).fadeIn("fast");
 * 
 * var temp = atrMore.eq(i).parent().parent().parent().height()+11;
 * if(atrMore.eq(i).height() > temp )
 * username.eq(i+1).parent().css("position","static"); }); });
 * atrMore.each(function(i) { jq(this).find("div.atrMoreHead > span.close >
 * a").attr("href","javascript:void(0);").click( function () {
 * atrMore.eq(i).fadeOut("fast");
 * username.eq(i+1).parent().css("position","relative"); }); });
 * 
 * 
 * jq(".articleTop").append('<span class="clear"></span>');
 * jq(".articleReview").append('<span class="clear"></span>'); });
 */