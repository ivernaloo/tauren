var CookieStatus = {
	"floatLayerColse":"001"  //001��¼���㵯����״̬��0Ϊ��������1Ϊ������Ĭ�ϲ�����
	,"floatLayerSmall":"002"  //002��¼���㵯����״̬��0Ϊ��С����1Ϊδ��С����Ĭ�ϲ���С��
	,"leftNav":"003"  //003��¼��ർ��״̬��0Ϊ�رգ�1Ϊչ����Ĭ��չ��
	,"weiboTip":"004"  //004��¼΢����ʾ���ڣ�0Ϊ�رգ�1Ϊ��ʾ��Ĭ����ʾ
	,"messageRandom":"005" //005��ֹuserinfo.jsp������������ʵ����Ϣ������ʱ����
	,"cookieName":"BBS_STATUS"
	,"weiboCardTip":"006"  //006��¼�༭���У�΢����Ƭ�ϵ���ʾ���ڣ�0Ϊ�رգ�1Ϊ��ʾ��Ĭ����ʾ
	,"msgTip":"007"  //007��¼��Ϣ��ʾ�Ƿ���ʾ��0Ϊ����ʾ��1Ϊ��ʾ��Ĭ����ʾ
			
	,"getCookieValue":function (offset) {
        var endstr = document.cookie.indexOf (";", offset);
        if (endstr == -1) {
          endstr = document.cookie.length;
        }
        return unescape(document.cookie.substring(offset, endstr));
    }
    /**
     * ��ȡCookie
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
     * ɾ��Cookie
     */
    ,"deleteCookie":function (cname) {
        this.setCookie(cname,"", 0);
    }
    /**
     * ����Cookie
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

    //���ؼ�¼״̬������
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
	
	//����״ֵ̬
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
	
	//�ı�ĳstatusֵ
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
			
	//�ж��Ƿ񵯳�����
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

	//�ж��Ƿ���С������
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

	//���õ�������cookie
	,"setFloatLayerClose":function(){
		this.setCookieStatus(this.floatLayerColse,"0",-1);
	}

	//������С������cookie
	,"setFloatLayerSmall":function(){
		this.setCookieStatus(this.floatLayerSmall,"0",-1);
	}

	//������С������cookie
	,"setFloatLayerBig":function(){
		this.setCookieStatus(this.floatLayerSmall,"1",-1);
	}
		
	//������ർ��cookie
	,"setLeftStatus":function(){
		this.setCookieStatus(this.leftNav,"0",-1);
	}
	//����΢����ʾ��cookie
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
	// ����΢����Ƭ��cookie
	,"closeWeiboCardTip":function(){
		this.setCookieStatus(this.weiboCardTip, "0", -1);
	}
	// ��ȡ΢����Ƭ��cookie
	,"isWeiboCardTipClosed":function(){
		var cookie = this.getStatusCookieValue(this.weiboCardTip);
		if(cookie == "0"){
			return true;
		}else{
			return false;
		}
	}
	//�ر���Ϣ��ʾ
	,"closeMsgTip":function(){
		this.setCookieStatus(this.msgTip, "0", -1);
	}
	//��ʾ��Ϣ��ʾ
	,"showMsgTip":function(){
		this.setCookieStatus(this.msgTip, "1", -1);
	}
	//��Ϣ�Ƿ���ʾ
	,"isShowMsgTip":function(){
		var cookie = this.getStatusCookieValue(this.msgTip);
		if(cookie == "0"){
			return false;
		}else{
			return true;
		}
	}
}