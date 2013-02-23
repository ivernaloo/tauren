var CookieStatus = {
	"floatLayerColse":"001"  //001记录浮层弹出框状态，0为不弹出，1为弹出，默认不弹出
	,"floatLayerSmall":"002"  //002记录浮层弹出框状态，0为最小化，1为未最小化，默认不最小化
	,"leftNav":"003"  //003记录左侧导航状态，0为关闭，1为展开，默认展开
	,"weiboTip":"004"  //004记录微博提示窗口，0为关闭，1为显示，默认显示
	,"messageRandom":"005" //005防止userinfo.jsp缓存的随机数，实现消息条数及时更新
	,"cookieName":"BBS_STATUS"
	,"weiboCardTip":"006"  //006记录编辑器中，微博名片上的提示窗口，0为关闭，1为显示，默认显示
	,"msgTip":"007"  //007记录消息提示是否显示，0为不显示，1为显示，默认显示
			
	,"getCookieValue":function (offset) {
        var endstr = document.cookie.indexOf (";", offset);
        if (endstr == -1) {
          endstr = document.cookie.length;
        }
        return unescape(document.cookie.substring(offset, endstr));
    }
    /**
     * 获取Cookie
     */
    ,"getCookie":function (name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
          var j = i + alen;
          if (document.cookie.substring(i, j) == arg) {
            return this.getCookieValue (j);
          }
          i = document.cookie.indexOf(" ", i) + 1;
          if (i == 0) {
            break;
          }
        }
        return null;
    }
    ,"getExpires":function(time) {
        var expdate = new Date();
        expdate.setTime(expdate.getTime() + time);
        return expdate;
    }
    /**
     * 删除Cookie
     */
    ,"deleteCookie":function (cname) {
        this.setCookie(cname,"", 0);
    }
    /**
     * 设置Cookie
     */
    ,"setCookie":function (name, value, expires) {
        var value = name + "=" + escape(value) + "; domain=163.com; path=/";
        if (expires>0) {
          value += " expires=" + this.getExpires(expires).toGMTString() ;
        }
        
        document.cookie = value;
    }
		
	,"statusCookies":function(){
		return this.getCookie(this.cookieName);
	}

    //返回记录状态的数组
	,"getStatusCookieArray":function(){
		var cookies = this.statusCookies();
		var statusCookies = new Array(); 
		if(cookies !=null && cookies != ""){
			if(cookies.indexOf(",") != -1){
				statusCookies = cookies.split(",");
				return statusCookies;
			}else{
				statusCookies.push(cookies);
				return statusCookies;
			}
		}else{
			return null;
		}
	}
	
	//返回状态值
	,"getStatusCookieValue":function(stauts){
		var statusCookieArray = this.getStatusCookieArray();
		if(statusCookieArray == null){
			return "";
		}
		for(var i = 0; i < statusCookieArray.length; i++){
			if(statusCookieArray[i].indexOf(stauts) != -1){
				return statusCookieArray[i].split("|")[1];
			}
		}
		
		return "";
	}
	
	//改变某status值
	,"setCookieStatus":function(status,value,expires){
		var cookies = this.statusCookies();
		if(cookies != null && cookies != ""){
			var cookie = cookies.split(",");
			for(var i = 0; i < cookie.length; i++){
				var nameValue=cookie[i].split("|");
				if(nameValue[0] == status){
					var pattern = eval("/"+nameValue[0]+"\\|"+nameValue[1]+"/g");
					cookies = cookies.replace(pattern,status + "|" + value);
					break;
				}
			}
			if(i>=cookie.length)
				cookies += "," + status + "|" + value;
		}else{
			cookies = status + "|" + value;
		}
		//var expdate = new Date();
        //expdate.setTime(expdate.getTime() + expires);
		this.setCookie(this.cookieName,cookies,-1);
	}
			
	//判断是否弹出浮层
	,"isCloseFloatLayer":function(){
		var status = this.getStatusCookieValue(this.floatLayerColse);
		if(status == "1" || status == ""){
			return false;
		}
		if(status == "0"){
			return true;
		}
		return false;
	}

	//判断是否最小化浮层
	,"isSmallFloatLayer":function(){
		var status = this.getStatusCookieValue(this.floatLayerSmall);
		if(status == "1" || status == ""){
			return false;
		}
		if(status == "0"){
			return true;
		}
		return false;
	}

	//设置弹出浮层cookie
	,"setFloatLayerClose":function(){
		this.setCookieStatus(this.floatLayerColse,"0",-1);
	}

	//设置最小化浮层cookie
	,"setFloatLayerSmall":function(){
		this.setCookieStatus(this.floatLayerSmall,"0",-1);
	}

	//设置最小化浮层cookie
	,"setFloatLayerBig":function(){
		this.setCookieStatus(this.floatLayerSmall,"1",-1);
	}
		
	//设置左侧导航cookie
	,"setLeftStatus":function(){
		this.setCookieStatus(this.leftNav,"0",-1);
	}
	//设置微博提示窗cookie
	,"closeWeiboTip":function(){
		this.setCookieStatus(this.weiboTip,"0",-1);
	}
	,"isCloseWeiboTip":function(){
		var cookie = this.getStatusCookieValue(this.weiboTip);
		if(cookie == "0"){
			return true;
		}else{
			return false;
		}
	}
	,"changeMessageRandom":function(){
		var value=this.getStatusCookieValue(this.messageRandom);
		if(value == ""){
			value = 0;
			this.setCookieStatus(this.messageRandom,value,-1);
			return value;
		}
		else{
			value=Number(value)+1;
			this.setCookieStatus(this.messageRandom,value,-1);
			return value;
		}
	}
	,"getMessageRandom":function(){
		var value=this.getStatusCookieValue(this.messageRandom);
		if(value == ""){
			value = 0;
			this.setCookieStatus(this.messageRandom,value,-1);
			return value;
		}
		else{
			return value;
		}
	}
	// 设置微博名片的cookie
	,"closeWeiboCardTip":function(){
		this.setCookieStatus(this.weiboCardTip, "0", -1);
	}
	// 读取微博名片的cookie
	,"isWeiboCardTipClosed":function(){
		var cookie = this.getStatusCookieValue(this.weiboCardTip);
		if(cookie == "0"){
			return true;
		}else{
			return false;
		}
	}
	//关闭消息提示
	,"closeMsgTip":function(){
		this.setCookieStatus(this.msgTip, "0", -1);
	}
	//显示消息提示
	,"showMsgTip":function(){
		this.setCookieStatus(this.msgTip, "1", -1);
	}
	//消息是否显示
	,"isShowMsgTip":function(){
		var cookie = this.getStatusCookieValue(this.msgTip);
		if(cookie == "0"){
			return false;
		}else{
			return true;
		}
	}
}