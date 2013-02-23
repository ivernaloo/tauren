
var all_js_version = "1.30";
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


window.isIE = function() {
    if (document.frames) {
        return true;
    }
    else {
        return false;
    }
}

document.getFrame = function(id) {
    var frame;
    if (document.frames) {
        frame = document.frames[id];
    }
    else {
        frame = document.getElementById(id).contentWindow;
    }


    return frame;
}



/**
 * 网易论坛常用方法
 * @Author 阿海
 *
 */
var Bbs = {
    "init": ""
    /**
     * 分页跳转
     */
    ,"gotopage":function(url, pageid) {
        var e;
        if (typeof(event)=="undefined") {
            var func = (Bbs.gotopage.caller);
            e = func.arguments[0];
        }
        else {
            e = event;
        }

        var ieKey=e.keyCode;
        if (ieKey!=13){
            return;
        }

        if (pageid=="") {
            Dialog.alert("请输入页码.");
            return false;
        }
        window.location.href = url + "&pageid="+pageid;
    }
    ,"noCallback":function() {

    }
    /**
     * 列表页面底部搜索
     */
    ,"doSearch":function() {
        var keyword = document.getElementById("so_keyword").value;
        var nickname = document.getElementById("so_nickname").value;
        var range = document.getElementById("so_range").value;
        var title = document.getElementById("so_title").checked;
        if (nickname=="输入昵称") {
            nickname = "";
        }
        if (keyword=="输入关键字") {
            keyword = "";
        }
        var query = "";
        if (title) {
            query = "title:";
        }
        if(keyword!=""){
            query=query+keyword+" ";
        }
        if(range!=""){
            query = query+range+" " ;
        }
        if (nickname != "") {
            query = query + "nickname:"+nickname;
        }
        document.forms["so"].q.value = query;

        return true;
    }

    ,"checkLogined":function() {
        return this.checkLoginedPostThread();
    }
    /**
     * 发贴前需要判断用户是否登录
     */
    ,"checkLoginedPostThread":function() {
        // TODO 在此需要做版面是否支持匿名发主贴判断
        if (BoardConfig.isAllowGuestPostThread()) {
            //支持匿名发贴
            return true;
        }

        if(!BbsCookie.isLogined()) {
            this.showLoginDialog();
            return false;
        }
        else {
            return true;
        }
    }
    ,"checkLogin":function() {
        return this.checkLoginedPostReply();
    }
    /**
     * 回复前需要判断用户是否登录
     */
    ,"checkLoginedPostReply":function(callback) {
        // TODO 在此需要做版面是否支持匿名发回贴判断
        if (BoardConfig.isAllowGuestPostReply()) {
            //支持匿名发回帖
            return true;
        }

        if(!BbsCookie.isLogined()) {
            if(typeof(callback) == "function") {
                this.showLoginDialog(callback);
            } else {
                this.showLoginDialog();
            }
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * 下载附件前需要判断用户是否登录
     */
    ,"checkLoginedDownloadAttachment":function() {
        if(!BbsCookie.isLogined()) {
            this.showLoginDialog();
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * 打开链接时判断用户是否登录
     * 无参数时登录完成无动作
     */
    ,"checkLoginedLink":function(url) {
        if(!BbsCookie.isLogined()) {
            this.showLoginDialog(function(){
                if(typeof(url) == 'string') {
                    window.location.href = url
                };
            });
            return false;
        }
        else {
            if(typeof(url) == 'string') {
                window.location.href = url;
                return false
            }

            return true;
        }
    }
    ,"loginCallback":null
    /**
     *  显示登录窗口
     *
     *  callback 回调函数: function:自定义函数  true:重新执行调用“父函数”(调用本函数的函数)
     */
    ,"showLoginDialog":function(callback) {
        if (typeof(callback) == "boolean" && callback){
            // true:

            var func = Bbs.showLoginDialog.caller;
            var args = func.arguments;
            var size = args.length;

            for (var i=0; i<args.length; i++) {
                if (typeof(args[i]) == "undefined") {
                    size;
                }
            }

            //alert(args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+",");
            if (size == 0) {
                this.loginCallback = function() {func();}
            }
            else if (size == 1) {
                this.loginCallback = function() {func(args[0]);}
            }
            else if (size == 2) {
                this.loginCallback = function() {func(args[0], args[1]);}
            }
            else if (size == 3) {
                this.loginCallback = function() {func(args[0], args[1], args[2]);}
            }
            else if (size == 4) {
                this.loginCallback = function() {func(args[0], args[1], args[2], args[3]);}
            }
            else {
                alert("目前还不支持"+size+"个参数的方法");
                this.loginCallback = null;
            }
        }
        else {
            //function:
            this.loginCallback = callback;
        }
        Dialog.show('登录网易通行证', '/bbs/loginDialog.inc.html', true, true, Bbs.logininit);
    }
    /**
     * 注册通行证
     */
    ,"register":function(type){
        BbsUtil.clickStat(type);
        window.open('http://reg.163.com/reg/reg.jsp?product=bbs&loginurl=http://bbs.163.com&url='+document.location.href);
    }

    ,"toPersonal":function(){
        BbsUtil.clickStat("user");
    }

    ,"managerCenter":function(){
        BbsUtil.clickStat("center");
    }

    ,"toWeibo":function(){
        BbsUtil.clickStat("weibo");
    }

    ,"toMessageCenter":function(){
        BbsUtil.clickStat("message");
    }

    ,"logininit":function(){
        LoginDialog.init();
    }

    /**
     * 发表文章
     */
    ,"postArticle":function(boardid) {
        BbsUtil.clickStat("uppost");
        if (!BbsCookie.isLogined() && !BoardConfig.isAllowGuestPostThread()) { //未登录
            this.showLoginDialog(true);  //显示登录框，登录成功后自动回调
        }
        else {
            window.location.href = "/bbs/post.jsp?boardid="+boardid;
        }
    }
    /**
     * 发表问答
     */
    ,"postAsk":function(boardid) {
        if (!BbsCookie.isLogined()) { //未登录
            this.showLoginDialog(true);  //显示登录框，登录成功后自动回调
        }
        else {
            window.location.href = "/bbs/post.jsp?boardid="+boardid+"&icon=90";
        }
    }

    /**
     * 编辑文章
     * @param boardid 版面ID
     * @param ismainpost 是否主贴
     * @param articleid 帖子ID
     */
    ,"editArticle":function(boardid, ismainpost, articleid) {
        if (!ismainpost){
            return this.editReply(boardid, articleid);
        }
        if (!BbsCookie.isLogined()) { //未登录
            this.showLoginDialog(true);  //显示登录框，登录成功后自动回调
        }
        else {
            Dwr.isLimitThread(boardid,articleid,function(data){
                if(data == true){
                    Dialog.alert("此贴已被限制编辑,请联系管理员取消限制.");
                }
                else{
                    window.location.href = "/bbs/post.jsp?boardid="+boardid+"&articleid="+articleid;
                }
            })
        }
    }
    /**
     * 编辑回复
     * @param boardid 版面ID
     * @param articleid 帖子ID
     */
    ,"editReply":function(boardid, articleid) {
        if (!BbsCookie.isLogined()) { //未登录
            this.showLoginDialog(true);  //显示登录框，登录成功后自动回调
        }
        else {
            //BbsAdmin.showDialog('编辑回复', '/bbs/dialog/reply_post.jsp?boardid='+boardid+"&articleid="+articleid);
            //Dialog.setWidth(600);

            window.location.href = "/bbs/reply_edit.jsp?boardid="+boardid+"&articleid="+articleid;
        }
    }

    /**
     * 注销
     */
    ,"logout":function() {
        BbsUtil.clickStat("logout");
        var url = "/bbs/user/logout.jsp?url="+encodeURIComponent(document.location.href);
        //Userinfo.reloadUserinfo();//清空用户信息
        BbsBoardAdmin.delCookie();
        CookieStatus.showMsgTip();
        document.location.href = url;
    }
    ,"checkDwr":function() {
        //TODO 未实现
        if (typeof(Dwr) == "undefined") {

        }
    }
    /**
     * 加载论坛所需的Dwr脚本
     */
    ,"loadDwr":function() {
        if (1==1) {
            return;
        }
        if (typeof(Dwr) == "undefined") {
            this.loadJs('http://bbs.163.com/bbs/dwrinterfaceDwr.js');
            this.loadJs('http://bbs.163.com/bbs/dwrengine.js');
            this.loadJs('http://bbs.163.com/bbs/dwrutil.js');
        }
    }
    ,"loadJs":function(filename) {
        var script = document.createElement("script");
        script.src = filename;

        //为什么要使用insertAdjacentElement？,因为appendChild在JS文件已经存在浏览器缓存时就会出现IE崩溃的情况(Bbs.editArticle方法就会出现,postArticle则正常)
        if (document.frames) {
            document.body.insertAdjacentElement("BeforeBegin",script);
        }
        else {
            document.body.appendChild(script);  //
        }
    }
    /**
     * 加载CSS
     */
    ,"loadCss":function(filename) {
        var head = document.getElementsByTagName('HEAD').item(0);
        var style = document.createElement('link');
        style.href = filename;
        style.rel = 'stylesheet';
        style.type = 'text/css';
        head.appendChild(style);
    }
    /**
     * 显示纸条信息
     */
    ,"showMessage":function(pageid) {
        if (typeof(pageid)=="undefined") {
            pageid = 1;
        }
        BbsAdmin.showDialog('我的纸条', '/bbs/dialog/msg_list.jsp?pageid='+pageid);
        Dialog.setWidth(600);

        if (pageid==1) {
            //清除用户信息缓存，并重新加载
            Userinfo.reloadUserinfo();
        }
    }
    /**
     * 显示已发送纸条信息
     */
    ,"showSentMessage":function(pageid) {
        if (typeof(pageid)=="undefined") {
            pageid = 1;
        }
        BbsAdmin.showDialog('已发送纸条', '/bbs/dialog/msg_sent_list.jsp?pageid='+pageid);
        Dialog.setWidth(600);
    }
    /**
     * 显示我的黑名单列表
     */
    ,"showMyBlackList":function(pageid) {
        if (typeof(pageid)=="undefined") {
            pageid = 1;
        }
        BbsAdmin.showDialog('黑名单', '/bbs/dialog/my_blacklist.jsp?pageid='+pageid);
        Dialog.setWidth(600);
    }
    /**
     * 添加黑名单
     */
    ,"addMyBlackList":function(userid) {
        if (typeof(userid)=="undefined") {
            userid = "";
        }
        BbsAdmin.showDialog('添加黑名单', '/bbs/dialog/my_blacklist_add.jsp?userid='+userid);
        Dialog.setWidth(600);
    }
    /**
     * 显示纸条信息
     */
    ,"sendMessage":function(userid) {
        BbsUtil.clickStat("sendmes");
        if (typeof(userid)=="undefined") {
            userid = "";
        }
        BbsAdmin.showDialog('发送纸条', '/bbs/dialog/msg_write.jsp?userid='+userid, 600);
        //Dialog.setWidth(600);
    }
    /**
     *发送系统纸条
     */
    ,"sendSysMessage":function(userid){
        if (typeof(userid)=="undefined") {
            userid = "";
        }
        BbsAdmin.showDialog('发送系统纸条', '/bbs/dialog/msg_sys_write.jsp?userid='+userid);
        Dialog.setWidth(600);
    }
    /**
     * 删除纸条
     */
    ,"delMessage":function(pageid, msgid) {
        Dwr.delMessage(msgid, function(data) {
            //删除功能，重新加载纸条页面
            Bbs.showMessage(pageid);
        });
    }
    /**
     * 删除已发送纸条
     */
    ,"delSentMessage":function(pageid, msgid) {
        Dwr.delSentMessage(msgid, function(data) {
            //删除功能，重新加载纸条页面
            Bbs.showSentMessage(pageid);
        });
    }
    /**
     * 删除黑名单
     */
    ,"delBlackList":function(pageid, msgid) {
        Dwr.delBlackList(msgid, function(data) {
            Bbs.showMyBlackList(pageid)
        });
    }
    /**
     * 获取当前频道
     */
    ,"getChannel":function() {
        var host = window.location.host;
        var channel = host.replace(/(.*?)([a-z0-9]+)\.163\.com/gi,"$2");

        if ("bbs" == channel) {
            // bbs.163.com
            channel =  "ntes";
        }
        else if ("money" == channel) {
            channel = "stock";
        }
        else if ("tech" == channel) {
            if ("club.tech.163.com" == host) {
                channel = "mobile";
            }
            else if ("digibbs.tech.163.com" == host) {
                channel = "digi";
            }

        }else if("cbachina" == channel){
            channel = "sports";
        }
        return channel;
    }
    /**
     * 登录通行证
     *
     * @username
     * @password
     * @url
     *
     */
    ,"loginPassport":function(username, password, savelogin, myCallback) {
        if (username == "") {
            return "还没有输入通行证帐号.";
        }
        if (password == "") {
            return "还没有输入密码.";
        }

        Dwr.loginPassport(username, calcMD5(password), savelogin, function(data) {
            if (data.indexOf("success") == -1) {
                alert(data);
                return;
            }
            //登录成功，关闭登录框
            Dialog.close();

            var callback;
            if (myCallback == null || typeof(myCallback) == "undefined"){
                callback = Bbs.loginCallback;
            }
            else {
                callback = myCallback;
            }
            if (callback != null && (typeof(callback) == "function" || typeof(callback) == "object")) {
                callback();
                Userinfo.loadUserinfo();//更新登录状态
            }
        });
    }

    /**
     * 获得某个回帖的内容
     * @param {Object} boardid
     * @param {Object} articleid
     */
    ,"getReplyBody":function(boardid, articleid) {
        var content = "";
        DWREngine.setAsync(false);
        Dwr.getReplyBody(boardid, articleid, function(data) {
            //content = (dwr.util.toDescriptiveString(data, 1));
            content = data;
        });
        DWREngine.setAsync(true);
        return content;
    }
    /**
     * 显示发贴类型菜单
     */
    ,"showPostMenu":function(index) {
        var obj = $("post_menu_"+index);
        if (obj == null) {
            alert("菜单不存在.");
            return;
        }
        obj.style.display = (obj.style.display=="block")?"none":"block";
    }
    /**
     * 显示或隐藏我的收藏
     */
    ,"showMyFavorite":function(divname) {
        if(!BbsCookie.isLogined()) {
            this.showLoginDialog(BbsUtil.reloadPage);
            return;
        }
        else{
            var divobj = $(divname);
            divobj.style.display = "block";
            this.loadMyFavorite(divname);
        }
    }

    /**
     * 加载我的收藏
     */
    ,"loadMyFavorite":function(divname) {
        var url = "/bbs/my_favorite.inc.jsp";
        new Ajax.Request(url,{onComplete:function(data){
            var content = (data.responseText);
            if (data.status==200) {
                $(divname).innerHTML = content;
            }
            else {
                alert("请求出错.");
            }
        }});
    }

    /**
     *设置某一用户的在线状态
     **/
    ,"showOnlineStatus":function(onlinestatus){
        var obj = document.getElementById("onlinestatus");

        if (obj != null){
            if (onlinestatus == "1"){
                obj.innerHTML = "在线";
            }
            else{
                obj.innerHTML = "离线";
            }
        }

    }

    /**
     *获取某一用户的在线状态
     **/
    ,"getOnlineStatus":function(username){
        var url = "/bbs/dialog/userinfo.jsp?reload=true&username=" + username ;
        new Ajax.Request(url, {method: 'get',requestHeaders:["If-Modified-Since","0"], onComplete:function(data){
            eval(obj.responseText);	}
        });

    }

    /**
     *会员版面检查
     */
    ,"checkMember":function(boardid,threadid,filename){
        if(!BoardConfig.isMemberView()){
            return;
        }
        var uri = document.location.href;
        if(filename=="list" && uri.indexOf(".jsp")==-1){
            //var listRe = /^http:\/\/[^\/]+\.163\.com\/list\/(.*?),?(\d+)?\.html$/i;
            var listRe = /^http:\/\/[^\/]+\.163\.com\/list\/([a-zA-Z0-9_]+),?(\d+)?\.html$/i;
            // bug fix:如果版面id以数字结尾，那么pageid会取这个数字。原因：正则表达式问题。 2012-2-8 Ben Liu
            var result = uri.match(listRe);
            var pageid;
            if(result != null){
                pageid = result[2];
            }
            var pagestr = "";
            if(pageid != undefined){
                pagestr = "&pageid="+pageid;
            }
            document.location.href="/bbs/list.jsp?boardid=" + boardid + pagestr;
        }else if(filename=="article" && uri.indexOf(".jsp")==-1){
            var articleRe = /^http:\/\/[^\/]+\.163\.com\/bbs\/(.*?)\/(\d+),?(\d+)?\.html$/i;
            var result = uri.match(articleRe);
            var pageid;
            if(result != null){
                pageid = result[3];
            }
            var pagestr = "";
            if(pageid != undefined){
                pagestr = "&pageid="+pageid;
            }
            document.location.href="/bbs/article.jsp?boardid=" + boardid + "&articleid=" + threadid + pagestr;
        }
    }

    /**
     *申请版主
     */
    ,"applymaster":function(boardid){
        if(!BbsCookie.isLogined()){
            alert("请先登录.");
            return;
        }

        BbsAdmin.showDialog('版主申请', '/bbs/applydata.jsp?boardid='+boardid);
        Dialog.setWidth(650);
    }

    /**
     *申请版主(现只用于股吧)
     */
    ,"addApplyMaster":function(boardid){
        if(!BbsCookie.isLogined()){
            alert("请先登录.");
            return;
        }
        var username = BbsCookie.getPassport();
        var form = document.forms["frmapplymaster"];

        var reason = form.reason.value;
        var name = form.name.value;
        var im = form.im.value;
        var mobile = form.mobile.value;
        var email = form.email.value;

        if(reason == ""){
            alert("请填写申请原因.");
            form.reason.focus();
            return;
        }
        if(name == ""){
            alert("请填你的名字.");
            form.name.focus();
            return;
        }
        if(im == ""){
            alert("请填QQ/MSN/POPO.");
            form.im.focus();
            return;
        }
        if(mobile == ""){
            alert("请填写联系电话.");
            form.mobile.focus();
            return;
        }
        if(email == ""){
            alert("请填写Email.");
            form.email.focus();
            return;
        }
        Dwr.addApplyMaster(boardid,name, reason, im,mobile, email,function(data){
            alert(data);
            location.href = "/bbs/applysuccess.jsp?boardid="+boardid;
        });
    }
    ,"nextQuestion":function(queOrder){
        if($("quessum").value != queOrder){
            $("liques"+queOrder).style.display = "none";
            queOrder++;
            //alert(queOrder);
            //alert($("questype"+queOrder).value);
            var questype = $("questype"+queOrder).value;
            if(questype == "choice"){
                $("liques"+queOrder).style.display = "";
            }else{
                $("divanswer").style.display = "";
            }
        }else{
            $("liques"+queOrder).style.display = "none";
            $("divanswer").style.display = "";
        }
    }
    ,"doPostLottery":function(){
        if (!BbsCookie.isLogined()) { //未登录
            Bbs.showLoginDialog(true); //显示登录框，登录成功后自动回调
            return;
        }
        var lotid = $("lotid").value;
        //var poststr = "";
        var answers = [];
        for(i=1; i<=$("quessum").value; i++){
            var answer="";
            if($("questype"+i).value=="choice"){
                $$('input[type="radio"][name="ques'+i+'"]').select(function(i){return i.checked}).each(function(i){answer=i.value});
            }else{
                answer = $("ques"+i).value;
            }
            var must = $("must"+i).value;

            if(must == "yes" && answer == ""){
                alert("请输入完整信息");
                return;
            }else{
                if(answer == ""){
                    answer = " ";
                }
                //poststr += answer + "~";
                answers.push(answer);
            }
        }

        //alert(answers.join(','));

        Dwr.joinLottery(lotid, answers, global_boardid, global_threadid ,function(data) {
            alert(data);
            document.location.replace(document.location.href);
        });
    }
    ,"overWeiboTip":function(){
        this.openWeiboTip();
    }
    ,"outWeiboTip":function(){
        this.initWeiboTip();
    }
    ,"closeWeiboTip":function(){
        CookieStatus.closeWeiboTip();
        this.closeTip();
    }
    ,"initWeiboTip":function(){
        //判断用户是否关闭了提示窗
        if(!CookieStatus.isCloseWeiboTip() && $("weiboTipDiv").style.display != "" ){
            this.openWeiboTip();
        }else{
            this.closeTip();
        }
    }
    ,"openWeiboTip":function(){
        //登录时
        if(BbsCookie.isLogined()){
            $("weiboTip1").style.display = "none";
            $("weiboTip2").style.display = "";
            $("weiboTipDiv").style.display = "";
        }else{
            $("weiboTip1").style.display = "";
            $("weiboTip2").style.display = "none";
            $("weiboTipDiv").style.display = "";
        }
    }
    ,"closeTip":function(){
        $("weiboTipDiv").style.display = "none";
        $("weiboTip1").style.display = "none";
        $("weiboTip2").style.display = "none";
    }
    ,"reportPost":function(dbname, boardid, articleid, pageid){
        var form = document.forms['frmcharge'];
        var content = form.content.value;
        if (content.trim() == '') {
            alert('请填写详细投诉内容！以便我们更有效的处理您的投诉！');
            form.content.focus();
        } else if (content.length > 300) {
            alert('举报字数不得超过300字。');
            form.content.focus();
        } else {
            Dwr.reportPost(dbname, boardid, articleid, pageid, content
                , function(data) {
                    alert(data);
                    Dialog.close();
                });
        }
    }
    /**
     * 显示EXIF信息
     */
    ,"buildExifdata":function(srcurl, exifcontent, callback){

        // 拍摄信息的点击数。
        BbsUtil.clickStat("exif");

        PhotoBean.getImageExif(srcurl,function(exifdata){
            if(exifdata != null) {
                var key;
                for(key in exifdata){
                    if(exifdata[key] == null){
                        exifdata[key] = "无数据";
                    }
                }
                exifcontent.innerHTML = "<h3>品牌：" + exifdata.make + "</h3><h3>型号：" + exifdata.model + "</h3><h3>焦距：" + exifdata.focalLength + "</h3><h3>光圈：" + exifdata.apertureValue + "</h3><h3>快门速度：" + exifdata.exposureTime + "</h3><h3>ISO：" + exifdata.isoSpeedRatings + "</h3><h3>曝光补偿：" + exifdata.exposureBiasValue + "</h3><h3>拍摄时间：" + exifdata.dateTime + "</h3><h3>镜头：" + exifdata.lens + "</h3>";
            } else {
                exifcontent.innerHTML = "此图片没有拍摄信息，可能并非相片格式，或在相片处理过程中删除了相应信息。"
            }
            callback && callback();
        });
    }
};

/**
 * 异步登录加密算法
 */
(function() {
    var hex_chr = "0123456789abcdef";
    function rhex(num) {
        str = "";
        for (j = 0; j <= 3; j++)
            str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
                hex_chr.charAt((num >> (j * 8)) & 0x0F);
        return str;
    }
    /*
     * Convert a string to a sequence of 16-word blocks, stored as an array.
     * Append padding bits and the length, as described in the MD5 standard.
     */
    function str2blks_MD5(str) {
        nblk = ((str.length + 8) >> 6) + 1;
        blks = new Array(nblk * 16);
        for (i = 0; i < nblk * 16; i++) blks[i] = 0;
        for (i = 0; i < str.length; i++)
            blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
        blks[i >> 2] |= 0x80 << ((i % 4) * 8);
        blks[nblk * 16 - 2] = str.length * 8;
        return blks;
    }
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
     * to work around bugs in some JS interpreters.
     */
    function add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    /*
     * Bitwise rotate a 32-bit number to the left
     */
    function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    /*
     * These functions implement the basic operation for each round of the
     * algorithm.
     */
    function cmn(q, a, b, x, s, t) {
        return add(rol(add(add(a, q), add(x, t)), s), b);
    }
    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    /*
     * Take a string and return the hex representation of its MD5.
     */
    function calcMD5(str) {
        x = str2blks_MD5(str);
        a = 1732584193;
        b = -271733879;
        c = -1732584194;
        d = 271733878;
        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;
            a = ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = ff(c, d, a, b, x[i + 10], 17, -42063);
            b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = hh(a, b, c, d, x[i + 5], 4, -378558);
            d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = add(a, olda);
            b = add(b, oldb);
            c = add(c, oldc);
            d = add(d, oldd);
        }
        return rhex(a) + rhex(b) + rhex(c) + rhex(d);
    };

    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function base64(str) {
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 255;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 3) << 4) | ((c2 & 240) >> 4));
                out += base64EncodeChars.charAt((c2 & 15) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 3) << 4) | ((c2 & 240) >> 4));
            out += base64EncodeChars.charAt(((c2 & 15) << 2) | ((c3 & 192) >> 6));
            out += base64EncodeChars.charAt(c3 & 63);
        }
        return out;
    }
    function utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 1) && (c <= 127)) {
                out += str.charAt(i);
            } else {
                if (c > 2047) {
                    out += String.fromCharCode(224 | ((c >> 12) & 15));
                    out += String.fromCharCode(128 | ((c >> 6) & 63));
                    out += String.fromCharCode(128 | ((c >> 0) & 63));
                } else {
                    out += String.fromCharCode(192 | ((c >> 6) & 31));
                    out += String.fromCharCode(128 | ((c >> 0) & 63));
                }
            }
        }
        return out;
    }
    // MD5 SHA1 共用 
    function add(x, y) {
        return ((x & 2147483647) + (y & 2147483647)) ^ (x & 2147483648) ^ (y & 2147483648);
    }

    // SHA1 
    function SHA1hex(num) {
        var sHEXChars = "0123456789abcdef";
        var str = "";
        for (var j = 7; j >= 0; j--) {
            str += sHEXChars.charAt((num >> (j * 4)) & 15);
        }
        return str;
    }
    function AlignSHA1(sIn) {
        var nblk = ((sIn.length + 8) >> 6) + 1, blks = new Array(nblk * 16);
        for (var i = 0; i < nblk * 16; i++) {
            blks[i] = 0;
        }
        for (i = 0; i < sIn.length; i++) {
            blks[i >> 2] |= sIn.charCodeAt(i) << (24 - (i & 3) * 8);
        }
        blks[i >> 2] |= 128 << (24 - (i & 3) * 8);
        blks[nblk * 16 - 1] = sIn.length * 8;
        return blks;
    }
    function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    function ft(t, b, c, d) {
        if (t < 20) {
            return (b & c) | ((~b) & d);
        }
        if (t < 40) {
            return b ^ c ^ d;
        }
        if (t < 60) {
            return (b & c) | (b & d) | (c & d);
        }
        return b ^ c ^ d;
    }
    function kt(t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
    }
    function SHA1(sIn) {
        var x = AlignSHA1(sIn);
        var w = new Array(80);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        var e = -1009589776;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            var olde = e;
            for (var j = 0; j < 80; j++) {
                if (j < 16) {
                    w[j] = x[i + j];
                } else {


                    w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                }
                t = add(add(rol(a, 5), ft(j, b, c, d)), add(add(e, w[j]), kt(j)));
                e = d;
                d = c;
                c = rol(b, 30);
                b = a;
                a = t;
            }
            a = add(a, olda);
            b = add(b, oldb);
            c = add(c, oldc);
            d = add(d, oldd);
            e = add(e, olde);
        }
        SHA1Value = SHA1hex(a) + SHA1hex(b) + SHA1hex(c) + SHA1hex(d) + SHA1hex(e);
        return SHA1Value;
    }
    window.MD5 = calcMD5;
    window.SHA1 = SHA1;
    window.base64 = base64;
    window.utf16to8 = utf16to8;
})();

/**
 * 登录jsonp回调函数
 */
function setLoginStatus(data){
    window.loginStatus = data;
}

/**
 * 竞猜的前台js
 *
 * @create_date 2011-6-21
 * @last_modified 2011-6-21
 * @author Ben Liu
 */
// 提示信息
var _gs_success = '成功参与竞猜。';
var _gs_failed = '投注失败，请稍后重新投注。';
var _gs_choose_result = '请选择一个结果进行投注。';
var _gs_pnt_invalid = '请输入合法的积分数。';
var BbsGuess = {
    "findSelectedGuessRadio": function(wrap) { // 查找选中的竞猜结果
        var optionId = 0;
        var odds = 0;
        NTES('._guess_ops', wrap).each(function(i) {
            if (this.checked) {
                optionId = this.value;
                odds = this.title;
            }
        });

        return {
            optionId : optionId,
            odds : odds
        };
    },
    "calcGuessEarnedPoints" : function(wrap) { // 计算，猜中后赢得的积分数
        var x = this.findSelectedGuessRadio(wrap);
        var optionId = x.optionId;
        var odds = x.odds;

        var displayed = false;
        if (optionId > 0 && odds > 0) {
            var pointsStr = NTES('.input01', wrap)[0].value;
            var points = parseInt(pointsStr);
            if (points && points > 0) {
                var earnedPoints = Math.round(points * odds);
                NTES('span._guess_earned_points', wrap)[0].innerHTML = earnedPoints;
                NTES('div._guess_tip', wrap)[0].style.display = '';
                //NTES('._guess_submit', wrap)[0].disabled = false;
                displayed = true;
            }
        }
        if (!displayed) {
            NTES('div._guess_tip', wrap)[0].style.display = 'none';
            //NTES('._guess_submit', wrap)[0].disabled = true;
        }

    },
    "getGuessOptionHTML" : function(resultId, guessStatus, userBet, betOpId, opx) { // 获取竞猜选项的html
        var radioAttr = 'disabled';
        if (guessStatus == 2 && userBet < 0) {
            radioAttr = '';
        }

        var radioChecked = '';
        if (betOpId == opx.id) {
            radioChecked = 'checked';
        }

        // 竞猜的最终结果，会覆盖用户的选择结果
        /**
         * 先注释掉，应该使用两种效果。
         if (guessStatus != 1 && guessStatus != 2 && resultId > 0) {	// 不是未开始或者进行中，且已经宣布结果
         if (resultId == opx.id) {
         radioChecked = 'checked';
         } else {
         radioChecked = '';
         }
         }
         **
         */

        var html = [];
        html.push('<div class="voteItem" onclick="javascript:BbsGuess.selectRadio(this, '
            + opx.guessId + ');">');
        html.push('  <div class="voteInput">');
        html.push('	<input type="radio" name="_guess_' + opx.guessId + '" value="'
            + opx.id + '" title="' + opx.oddsStr + '" class="_guess_ops" '+radioChecked+' '
            + radioAttr + ' />');
        html.push('  </div>');
        html.push('  <div class="voteData">');
        html.push('	 <div class="voteLabel">');
        html.push('		 <h5>' + opx.title + '<span class="cDGray">(赔率' + opx.oddsStr
            + ')</span></h5>');
        html.push('		 <span class="right cDGray"><span class="_guess_op_cnt" id="_guess_op_cnt'+opx.id+'">' + opx.userCount + '</span>人</span>');
        html.push('	 </div>');
        html.push('	 <div class="voteBar"><img src="/bbs2009/img/voteitem_bg.gif" class="_guess_op_p" width="'
            + opx.percentage + '" title="' + opx.percentage + '" height="13" /></div>');
        html.push('  </div>');
        html.push('</div>');
        return html.join('');
    },
    "initJoinGuess" : function(wrap, guessId) { // 初始化参与竞猜的组件
        var guessPointInputObj = NTES('._guess_points_input', wrap)[0];
        // 如果切换结果radio，重新计算猜中后赢得的积分数。
        var _this = this;
        NTES('._guess_ops', wrap).each(function() {
            this.onclick = function() {
                if (this.checked) {
                    _this.calcGuessEarnedPoints(wrap);
                }
            }
        });

        // 初始化 投注积分输入的input
        if (guessPointInputObj) {
            var initVal = guessPointInputObj.value;
            guessPointInputObj.onblur = function() {
                if (this.value == '') {
                    this.value = initVal;
                }
            };
            guessPointInputObj.onfocus = function() {
                if (this.value == initVal) {
                    this.value = '';
                }
            };
            guessPointInputObj.onkeyup = function() {
                if (this.value.length > 0) {
                    this.className = 'input01 input02';
                } else {
                    this.className = 'input01';
                }
                // 计算，如果按照指定赔率，猜中之后能得到的积分数
                _this.calcGuessEarnedPoints(wrap);
            }
        }
    },
    "doAddGuess" : function(guessId) { // 用户参与竞猜

        if (!BbsCookie.isLogined()) { // 没有登录，显示登陆框
            // 释放锁
            Bbs.showLoginDialog(); // 显示登录框，登录成功后自动回调
            return false;
        }

        // 获取参数
        var wrap = NTES('div#_guess_no_' + guessId)[0];
        var x = this.findSelectedGuessRadio(wrap);
        var optionId = x.optionId;
        // 校验
        if (!optionId || optionId <= 0) {
            alert(_gs_choose_result);
            return false;
        }

        if (NTES('div._guess_tip', wrap)[0].style.display == 'none') {
            alert(_gs_pnt_invalid);
            return false;
        }

        var pointsStr = NTES('.input01', wrap)[0].value;
        Dwr.joinGuess(guessId, optionId, pointsStr, function(data) {
            if (data) {
                alert(_gs_success);
                //window.location.reload();
                // 刷新页面太慢，改成不刷新
                // disable radio
                NTES('._guess_ops', wrap).each(function() {
                    this.disabled = true;
                });
                // 投注总积分，增加
                var pntCntObj = NTES('span._guess_points_total', wrap)[0];
                var srcPntsStr = pntCntObj.innerHTML; // 竞猜投注的积分
                var srcPnts = parseInt(srcPntsStr);
                var addedPnts = parseInt(pointsStr);
                pntCntObj.innerHTML = srcPnts + addedPnts;
                // 投注人数增加 
                var opCntObj = document.getElementById('_guess_op_cnt'+optionId);
                if (opCntObj) {
                    var srcCnt = parseInt(opCntObj.innerHTML);
                    opCntObj.innerHTML = srcCnt + 1;
                }
                // 重新计算投注比例
                var totalUserCnt = 0;
                var userCntList = [];
                NTES('span._guess_op_cnt', wrap).each(function() {
                    var ucStr = this.innerHTML;
                    var uc = parseInt(ucStr);
                    totalUserCnt += uc;
                    userCntList.push(uc);
                });
                var idx = 0;
                NTES('._guess_op_p', wrap).each(function() {
                    var widthStr = '0%';
                    if (totalUserCnt > 0) {
                        var thisUserCnt = userCntList[idx];
                        var p = Math.round((thisUserCnt/totalUserCnt)*100);
                        widthStr = p+'%';
                        //alert(idx+'->'+parseFloat(thisUserCnt)+'/'+totalUserCnt+'->'+widthStr);
                    }
                    //alert(widthStr);
                    this.style.width = widthStr;
                    this.title = widthStr;
                    idx++;
                });
                // 隐藏投注面板
                NTES('div._guess_can_join', wrap)[0].style.display = 'none';
                // 显示已投注面板。
                NTES('span._guess_betted', wrap)[0].innerHTML = addedPnts;
                NTES('div._guess_joined', wrap)[0].style.display = '';
            } else {
                alert(_gs_failed);
            }
        });
    },
    "drawGuessOptions" : function(guessList) { // 绘制竞猜的选项
        for ( var i = 0; i < guessList.length; i++) {
            var gs = guessList[i];

            var guessId = gs.guessId;
            var type = gs.type;
            var title = gs.title;
            var status = gs.status;
            var timeTitle = '截止投注时间：';
            var time = gs.et.replace(',', '<br />');
            if (status == 1) {
                timeTitle = '开始投注时间：';
                time = gs.st.replace(',', '<br />');
            }
            var points = gs.pts;
            if (!points) {
                points = 0;
            }

            var statusLabel = '已结束';
            var statusClass = 'cDRed';
            // 状态值，参考com.netease.bbs.db.facade.GuessManager#
            if (status == 1) {
                statusLabel = '未开始';
                statusClass = 'cDGray';
            } else if (status == 2) {
                statusLabel = '进行中';
                statusClass = 'cBlue';
            }
            // 竞猜数据
            var wrap = NTES('div#_guess_no_' + guessId)[0];
            NTES('span._guess_type', wrap)[0].innerHTML = type; // 竞猜类型
            NTES('span._guess_points_total', wrap)[0].innerHTML = points; // 竞猜投注的积分
            NTES('div._guess_title', wrap)[0].innerHTML = title; // 竞猜标题
            var statusObj = NTES('span._guess_status', wrap)[0]; // 竞猜状态
            statusObj.className = statusClass;
            statusObj.innerHTML = statusLabel;
            NTES('span._guess_time_title', wrap)[0].innerHTML = timeTitle; // 竞猜时间
            NTES('span._guess_time', wrap)[0].innerHTML = time;

            var bet = gs.bet;

            var _this = this;
            // 竞猜的选项
            var ops = gs.ops;
            var opsHtml = [];
            var guessResultText = '';
            for (var x=0; x<ops.length; x++) {
                var opx = ops[x];
                opsHtml.push(_this.getGuessOptionHTML(gs.resultId, status, bet, gs.betOpId, opx));
                if (status == 4 && gs.resultId == opx.id) {	// 如果竞猜已经结束，将竞猜的结果显示出来。
                    guessResultText = opx.title;
                }
            }
            //log('status:'+status+',type:'+type);
            var displayTarget = NTES('div#_guess_result_tips', wrap);
            var showPanel = NTES('div#_guess_result_show', wrap);
            if (showPanel && showPanel[0] && displayTarget && displayTarget[0] && guessResultText != '') {
                displayTarget[0].innerHTML = guessResultText; // 竞猜的正确结果展示
                showPanel[0].style.display = '';
            }
            NTES('span._guess_options', wrap)[0].innerHTML = opsHtml.join('');

            // 是否初始化参与竞猜的组件
            if (status == 2 && bet < 0) { // 竞猜进行中，且用户没有参与竞猜，此时初始化参与竞猜的组件
                _this.initJoinGuess(wrap, guessId);
                NTES('div._guess_can_join', wrap)[0].style.display = '';
            }

            // 用户参与竞猜的数据
            if (status != 1 && bet > 0) {
                NTES('span._guess_betted', wrap)[0].innerHTML = bet;
                NTES('div._guess_joined', wrap)[0].style.display = '';
            }

            // 显示竞猜内容
            wrap.style.display = '';
        }
    },
    "selectRadio" : function(obj, guessId) { // 点击radio的父div，自动选中该radio
        var radio = NTES('._guess_ops', obj)[0];
        if (radio && !radio.disabled) {
            radio.checked = true;
            var wrap = NTES('div#' + guessId)[0];
            this.calcGuessEarnedPoints(wrap);
        }
    }
};

/**
 * Thread.sleep(ms)
 * （尽量不要在sleep前执行代码，除非确认没有问题）
 * 该方法在指定的时间内回调当前的函数，所以在调用sleep之前的代码会被多次执行
 * 调用sleep的函数参数格式不能超过3个
 * sleep不能嵌套使用
 */
var Thread = {
    "init":""
    ,"sleeping":false
    ,"ok":function () {
        document.title = "sleep:ok";
        this.sleeping = true;
        var length = (this.arguments.length);
        if (length == 0) {
            Thread.func();
        }
        else if (length == 1) {
            Thread.func(this.arguments[0]);
        }
        else if (length == 2) {
            Thread.func(this.arguments[0], this.arguments[1]);
        }
        else if (length == 3) {
            Thread.func(this.arguments[0], this.arguments[1], this.arguments[2]);
        }
        else {
            alert("使用sleep不能超过3个参数");
        }

        Thread.func = null;

    }
    ,"func":null
    ,"arguments":null
    ,"sleep":function(ms) {
        document.title = "sleep:"+ms;
        if (this.sleeping) {
            this.sleeping = false;
            return false;
        }
        else {
            this.sleeping = true;
        }

        this.func = this.sleep.caller;
        this.arguments = this.func.arguments;

        setTimeout("Thread.ok()", ms);
        return true;
    }
}

var BbsUtil = {
    "init":""
    ,"addEvent":function(elem, eventName, handler){
        if (window.attachEvent) {
            elem.attachEvent("on" + eventName, handler);
        }
        else {
            elem.addEventListener(eventName, handler, false);
        }
    }
    ,"checkUploadImg":function(filepath){
        if (filepath == null || filepath == ""){
            alert("请先选择文件");
            return false;
        }
        else if (!this.isImg(filepath)){
            alert("上传的图片的格式只能是gif、jpg/jpeg或者png");
            return false;
        }
        return true;
    }
    ,"isImg":function(imgsrc){
        var rex = /\.(gif|jpg|png|jpeg)$/i
        if (rex.test(imgsrc)){
            return true;
        }
        else
        {
            return false;
        }
    }
    ,"checkDomain":function(pageDomain) {
        if (document.domain.indexOf(".163.com") == -1) {
            return;
        }
        try {

            if (document.domain != pageDomain) {
                var url = document.location.href;
                var realUrl = url.replace(document.domain, pageDomain);
                var img = new Image();
                img.src = "http://fund8.money.163.com/bbs/class_not_found.jsp?message=错误域名:"+document.referrer;
                document.location.href = realUrl;
            }
        }
        catch(e) {
        }
    }
    /**
     * 显示登录按钮还是显示退出
     */
    ,"showLoginButton":function() {
        var html = "";
        if (BbsCookie.isLogined()) {
            html += ('<span style="line-height:24px">');
            html += (' <a href="javascript:BbsBoardAdmin.checkMaster()" target="_self" id="boardadmin">管理模式</a>');
            html += ' <a href="/bbs/list.jsp?boardid='+global_boardid+'&plugin=y&username='+BbsCookie.getPassport()+'" title="我在当前版面发表的帖子">我的帖子</a> ';
            var messageCount = Userinfo.getMessageCount();
            if (messageCount>0) {
                var m_top   = 18;
                var m_left  = -30;
                if (!window.isIE()) {
                    m_top = 0;
                    m_left = 90;
                }
                html += ('<div style="position:absolute"><div style="height:20px;width:120px;position:relative;left:'+m_left+'px;top:'+m_top+'px;background-color:#FFFFE1;border:1px solid #858585;color:#333333;font-size:13px;padding:1px;text-align:center;"><a href="javascript:Bbs.showMessage()" target="_self">您有<strong>'+messageCount+'</strong>条新纸条</a></div></div>');
            }
            html += (' <a href="javascript:Bbs.showMessage()" target="_self">查看纸条</a>');
            //('+messageCount+')


            html += (' <a href="javascript:Bbs.logout()" target="_self">退出</a></span>');
        }
        else {
            html += ('<a href="javascript:Bbs.showLoginDialog(BbsUtil.reload)" target="_self"><img src="/bbs/img07/btbg02.gif" width="87" height="22" alt="登录论坛" /></a>');
        }
        var obj = document.getElementById("myLoginButton");

        if (obj) {
            obj.innerHTML = html;

            //管理模式按钮
            try{
                BbsBoardAdmin.load();
            }
            catch (e){}
        }

    }
    /**
     * 看贴页面显示登录信息
     */
    ,"showLoginInfo":function() {
        var obj = document.getElementById("myLoginInfo");
        if (obj == null) {
            //列表页面
            return this.showLoginButton();//
        }
        var html = "";
        if (BbsCookie.isLogined()) {
            if (typeof(noNicknameInfo) == "undefined") {
                var username = BbsCookie.getPassport();
                html += ('<a class="cRed" href="http://bbs.163.com/'+username+'" target="_blank">'+Userinfo.getNickname()+'</a> 欢迎来到网易！');
            }
            var messageCount = Userinfo.getMessageCount();
            if (messageCount>0) {
                var m_top   = 18;
                var m_left  = -30;
                if (!window.isIE()) {
                    m_top = 0;
                    m_left = 90;
                }
                html += ('<div style="position:absolute"><div style="height:14px;width:120px;position:relative;left:'+m_left+'px;top:'+m_top+'px;background-color:#FFFFE1;border:1px solid #858585;color:#333333;font-size:13px;padding:3px;text-align:center;"><a href="javascript:Bbs.showMessage()" target="_self" style="text-decoration:none;color:#000">您有<strong>'+messageCount+'</strong>条新纸条</a></div></div>');
            }

            html += ('<span id="mymsg">您有<a href="javascript:Bbs.showMessage()" target="_self" class="cRed">'+messageCount+'</a>个未读纸条 </span>');
            html += ('<a href="javascript:Bbs.logout()" target="_self" class="c1">安全退出</a>');
        }
        else {
            html += ('<a class="cRed">游客</a> 欢迎来到网易！请先<a href="javascript:Bbs.showLoginDialog(Bbs.noCallback)" target="_self" class="c1">登录</a>');
        }

        obj.innerHTML = html;
    }
    /**
     * 按钮点击统计
     */
    ,"clickStat":function(type) {
        Dwr.clickStat(type);
    }

    /**
     * 复制文本到剪贴板
     */
    ,"copyText":function(text) {
        try {
            clipboardData.setData('Text', text);
        }
        catch(e) {
            alert("“复制到剪贴板功能”还不兼容您使用的浏览器.");
        }
    }
    ,"format":function(obj) {
        var body = "\n"+obj.value;
        body = body.replace(/ |　/ig,"");
        body = body.replace(/\r\n/ig,"\n");
        body = body.replace(/\n\n/ig,"\n");
        body = body.replace(/\n\n/ig,"\n");
        body = body.replace(/\n\n/ig,"\n");
        body = body.replace(/\n\n/ig,"\n");
        body = body.replace(/\n/ig,"\n\n　　");
        body = body.replace("\n\n","");
        obj.value=body;
    }
    ,"getCodeJsp":function() {
        var time = new Date().getTime();
        var index = time % 10;
        return "/bbs/code/code"+index+".jsp";
    }
    /**
     * 重新加载验证码.
     */
    ,"reloadCode":function() {
        document.getElementById("imgcheckcode").src = BbsUtil.getCodeJsp()+"?"+(new Date().getTime());
    }
    ,"loadCheckcode":function(id) {
        var form = document.forms["frmpost"];
        var checkcode = form.checkcode;
        if (typeof(checkcode) == "object") {
            if (checkcode.value == "") {
                this.reloadCheckcode();
            }
        }
    }
    ,"reloadCheckcode":function(id) {
        if (typeof(id) == "undefined") {
            id = "imgcheckcode";
        }
        document.getElementById(id).src = BbsUtil.getCodeJsp()+"?"+(new Date().getTime());
    }
    ,"checkReplyPost":function() {
        var form = document.forms["frmpost"];
        if (typeof(isyiba) != "undefined" && isyiba == "yiba" && typeof(filename) != "undefined" && filename == "list"){
            if (form.title.value == "") {
                Dialog.alert("帖子标题不能为空哦.");
                form.title.focus();
                return false;
            }
        }
        if (form.content.value == "") {
            Dialog.alert("内容不能为空哦.");
            form.content.focus();
            return false;
        }
        if (1==1) {
            //判断用户是否需要输入验证码？
            var checkcode = form.checkcode;
            if (typeof(checkcode) == "object") {
                if (checkcode.value == "") {
                    Dialog.alert("验证码还没有输入.");
                    checkcode.focus();
                    return false;
                }
                if (checkcode.value.length != 4) {
                    Dialog.alert("验证码的位数不对哦.");
                    checkcode.focus();
                    return false;
                }
            }
            else {
                var verifyMessage = "";
                if (BbsCookie.isLogined()) {
                    verifyMessage = this.isWantVerify();
                }
                else {
                    verifyMessage = "您是匿名发帖，需要输入验证码.";
                }
                if (verifyMessage != "") {

                    var html ="";


                    if (typeof(isyiba) != "undefined" && isyiba == "yiba"){
                        html = '<span class="item">验 证 码：</span> <input style="width:70px" type="text" name="checkcode" id="textfield" onkeydown="if(event.keyCode==13){if(BbsUtil.checkReplyPost() != false && Editor.insertImgorMedia() != false){document.frmpost.submit();}}"/><a href="javascript:BbsUtil.reloadCode();"><span class="cGray">&nbsp;点击更换验证码&nbsp;</span></a><span class="cDRed">' + verifyMessage + '</span><br/>　　　　　　　　 <a href="javascript:BbsUtil.reloadCode();"><img id="imgcheckcode" src="'+BbsUtil.getCodeJsp()+'" alt="看不清，换一张" /></a><br/>　　　　　　　　 　　<a href="javascript:BbsUtil.reloadCode();">看不清，换一张</a>';
                    }
                    else{
                        html = '<div>验证码:　　　<input type="text" size="6" name="checkcode" value="" class="input007" maxlength="4"/>,您发表回复需要输入验证码。(<font color="#ff0000">'+verifyMessage+'</font>)<br/>　　　　　　<a href="javascript:BbsUtil.reloadCode();" target="_self"><img id="imgcheckcode" src="'+BbsUtil.getCodeJsp()+'" alt="看不清，换一张"/></a><br/>　　　　　　　　<a href="javascript:BbsUtil.reloadCode();" target="_self">看不清，换一张</a></div>';
                    }

                    new Insertion.Before('frmpost_upload', html);

                    form.checkcode.focus();
                    return false;
                }
            }
        }


        //判断是否含有关键字前，需要把提交按钮隐藏，否则会有可能多次重复提交
        document.getElementById("btnSubmit").style.visibility = "hidden";

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
                        if (typeof(isyiba) == "undefined"){
                            //论坛直接返回false，吧需要根据返回来判断是否submit;
                            form.submit();
                            return false;
                        }
                        else{
                            return true;
                        }
                    }
                });
            }
        });

        if (typeof(isyiba) == "undefined"){
            return false;
        }
        else{
            return true;
        }
    }

    /**
     * Ajax翻页
     * url:请求的URL
     * divid:需要更新的divid
     * loadingdiv:显示进度的divid
     **/
    ,"ajaxpaging":function(url,divid,loadingdivid){
        new Ajax.Request(url,{method:'get',requestHeaders:["If-Modified-Since","0"],onComplete:function(data){
            $(divid).innerHTML = data.responseText;
        }
        });
    }

    /**
     *易吧回复帖子中设置是否匿名回复
     */
    ,"setAnymousePost":function() {

        var form = document.forms["frmpost"];
        if (typeof(checkcode) == "object"){
            return;
        }
        this.unsetAnymousePost();
        var verifyMessage = "您是匿名发帖，需要输入验证码.";
        var html = '<span class="item">验 证 码：</span> <input type="text" name="checkcode" id="textfield" /><span class="cGray">请输入验证码。</span><span class="cDRed">' + verifyMessage + '</span><br/><a href="javascript:BbsUtil.reloadCode();"><img id="imgcheckcode" src="'+BbsUtil.getCodeJsp()+'" alt="看不清，换一张" /></a>';
        //new Insertion.Before('frmpost_upload', html);
        document.getElementById('frmpost_upload').innerHTML = html;
        form.checkcode.focus();
    }

    /**
     *易吧回复帖子中设置是否匿名回复
     */
    ,"unsetAnymousePost":function() {
        document.getElementById('frmpost_upload').html = '';
        document.getElementById('frmpost_upload').style.display = "none";
    }

    ,"showAnonymouseDiv":function() {
        if (BbsCookie.isLogined()){
            document.getElementById('setAnonymous').style.display = 'block';
            //document.getElementById('textAnonymous').style.display = 'block';

        }
        else{
            document.getElementById('setAnonymous').style.display = 'none';
            //document.getElementById('textAnonymous').style.display = 'none';	
        }
    }

    ,"showorhideDiv":function(divname) {
        theDiv = document.getElementById(divname);
        if (theDiv == null || theDiv == "undefined")
        {
            return;
        }
        if (theDiv.style.display == "none"){
            theDiv.style.display = "block";
        }
        else{
            theDiv.style.display = "none";
        }
    }

    ,"isWantVerify":function(isThreadPost, imgUrls) {
        var form = document.forms["frmpost"];
        //暂时取消奥运吧匿名要验证码的限制
        /*var checkobj = form.setInput;
         if (typeof(checkobj) == "object"){
         if (checkobj.checked){
         return "您是匿名发帖，需要输入验证码.";	
         }	
         }*/
        //alert(imgUrls);
        DWREngine.setAsync(false);
        var verifyMessage = "";
        Dwr.isWantVerify(global_boardid, isThreadPost, imgUrls, function(data){
            //var content = (dwr.util.toDescriptiveString(data, 1));
            //verifyMessage = content;     
            verifyMessage = data;
        });
        DWREngine.setAsync(true);
        return verifyMessage;
    }
    /**
     * 检查表单的一组选项是否已经有一个被选中
     *
     * @param options 选项对象
     */
    ,"isChecked":function(options) {
        if (typeof(options.length) == "undefined") {
            return options.checked;
        }
        for (var i=0; i<options.length; i++) {
            if (options[i].checked) {
                return true;
            }
        }
        return false;
    }
    /**
     * 获取单选框的值,没有选中返回null
     *
     * @param frmname 表单名称
     * @param name  字段名称
     */
    ,"getRadioValue":function(frmname, name) {
        var form = document.forms[frmname];
        var eles = form[name];
        var value = null;
        if (typeof(eles) != "undefined") {

            for (var i=0; i<eles.length;i++) {
                if (eles[i].checked){
                    value = eles[i].value;
                }
            }
        }
        return value;
    }
    /**
     * 获取下拉框的值,默认返回null
     *
     * @param frmname 表单名称
     * @param name  字段名称
     */
    ,"getSelectValue":function(frmname, name) {
        var form = document.forms[frmname];
        var ele = form[name];
        var value = null;
        if (typeof(ele) != "undefined") {

            value = ele.value;
        }
        return value;
    }
    /**
     * 获取单选框的值,没有选中返回0
     *
     * @param frmname 表单名称
     * @param name  字段名称
     */
    ,"getCheckboxValue":function(frmname, name) {
        var form = document.forms[frmname];
        var ele = form[name];
        var value = 0;
        if (typeof(ele) != "undefined") {
            if (ele.checked){
                value = 1	;
            }
        }
        return value;
    }
    /**
     * 获取多个文本框的值.
     *
     * @param frmname 表单名称
     * @param name  字段名称
     * @return array
     */
    ,"getValues":function(frmname, name) {
        var form = document.forms[frmname];
        var eles = form[name];
        var values = new Array();
        var index = -1;
        for (var i=0; i<eles.length;i++) {

            if (eles[i].type=="checkbox" || eles[i].type=="radio") {
                if (eles[i].checked) {
                    index++;
                    values[index] = eles[i].value;
                }
            }
            else {
                index++;
                values[index] = eles[i].value;
            }
        }
        return values;
    }
    /**
     * 将当前页加入收藏夹.
     */
    ,"addFavorite":function() {
        window.external.addFavorite(document.location.href, document.title);
    }
    /**
     *初始化文本框默认值事件
     */
    ,"inputFocus":function(obj) {
        //var obj = document.getElementById(id);
        if (obj.title == "") {
            obj.title = obj.value;
            obj.onfocus = function() {
                if (this.value==this.title) {
                    this.value = "";
                }
            }
            obj.onblur = function() {
                if (this.value=="") {
                    this.value = this.title;
                }
            }
        }
        obj.value = "";
    }
    /**
     * 获取版面名称
     */
    ,"getBoardName":function(boardid) {
        DWREngine.setAsync(false);
        var boardName = null;

        Dwr.getBoardName(boardid, function(data){
            /*
             if (data != null && typeof data == 'object') {
             alert(dwr.util.toDescriptiveString(data, 2));
             }
             else {
             var content = (dwr.util.toDescriptiveString(data, 1));
             boardName = content;
             }
             */
            boardName = data;
        });
        DWREngine.setAsync(true);
        return boardName;
    }
    ,"getBytes":function(str) {
        if (str == null) {
            return 0;
        }
        var bytes = 0;
        for(i=0;i<str.length;i++){
            var c = str.charCodeAt(i);
            if((c>=0 && c<=255)||(c>=0xff61 && c<=0xff9f)){
                bytes += 1;
            }else{
                bytes += 2;
            }
        }
        return bytes;
    }
    /**
     * 刷新当前页面
     */
    ,"reload":function () {
        window.location.reload();
    }
    /**
     * 重新访问当前页面，而不刷新页面里调用的其他文件
     */
    ,"reloadPage":function() {
        location.href = location.href;
    }
    ,"noreload":function(res_id) {
        var obj = document.getElementById(res_id);
        obj.style.display = "none";
    }
    /**
     * 图片缩放
     */
    ,"imageZoom":function(articleid) {
        var obj = $("content_"+articleid);
        var imgs = obj.getElementsByTagName("IMG");
        for (var i=0;i<imgs.length;i++) {
            if (imgs[i].width > 600) {
                imgs[i].width = 600;
            }

        }
    }


    /**
     * 图片缩放
     */
    ,"imgZoom":function(obj, hasLink) {
        if (obj.width > 600) {
            obj.width = 600;
        }

        if (!hasLink) {
            return;
        }
        var pNode = obj.parentNode;
        if(pNode.tagName.toLowerCase() != "a" ){
            var aTagObj = document.createElement("a");
            aTagObj.href = obj.src;
            aTagObj.target = "_blank";
            pNode.insertBefore(aTagObj,obj);
            aTagObj.appendChild(obj);

            //var oldObj = obj.cloneNode(false);
            //obj.applyElment(aTagObj,"outside");
            //obj.replaceNode(aTagObj);
            //alert(aTagObj.href);
        }
    }
    /**
     *去掉字符串的前后空格
     */
    ,"trim":function(str) {
        return    str.replace(/(^\s*)|(\s*$)/g,    "");
    }

    ,"showDiv":function(eventId,divobj,showdivname){
        if (eventId == "undefined")
        {
            return;
        }
        if (divobj ==  null || divobj == "undefined")
        {
            return;
        }
        if ($(showdivname) == null || $(showdivname) == "undefined")
        {
            return ;
        }
        clearTimeout(eventId);
        divobj.onmouseout=function(){
            eventId=setTimeout("BbsUtil.hideDiv('" + showdivname + "')",100);
        }
        $(showdivname).style.display="block";
        $(showdivname).onmouseover=function(){
            clearTimeout(eventId);
            $(showdivname).style.display="block";
        }
        $(showdivname).onmouseout=function(){
            BbsUtil.hideDiv(showdivname);
        }
    }
    ,"hideDiv":function(hidedivname){
        if ($(hidedivname) == null || $(hidedivname) == "undefined")
        {
            return;
        }
        $(hidedivname).style.display = "none";
    }
    ,"subStringByByte":function(srcText,maxByte){
        var tempText = "";
        var count = 0;
        for (i=0;i<srcText.length;i++)
        {
            if (srcText.charCodeAt(i)>255){
                count += 2;
            }
            else{
                count++;
            }
            if(count > maxByte){
                return tempText;
            }
            tempText += srcText.charAt(i);
        }
        return srcText;

    }
    ,"checkTextNum":function(srcObj,maxByte,showObj){
        if (srcObj != null && showObj != null )
        {
            var bytes = this.getBytes(srcObj.value);
            var num = ((maxByte-bytes)/2);
            if (num < 0) {
                srcObj.value = this.subStringByByte(srcObj.value,maxByte);
                num = 0;
            }
            showObj.innerHTML = num;
        }
    }
    ,"copyTitle":function(title){
        var txt= window.document.location.href;
        txt += '\r\n' + title;
        try {
            clipboardData.setData('Text', txt);
            alert("您已成功复制本贴标题和链接地址，欢迎您推荐给您的朋友！");
        }
        catch(e) {
            alert("“复制到剪贴板功能”还不兼容您使用的浏览器.");
        }
    }

    ,"copyToClipBoard":function(clipname,title){
        var url = window.document.location.href;
        var clipBoardContent = url;
        if (title != null || title != ""){
            clipBoardContent += '\r\n' + title;;
        }
        this.copy_clip(clipBoardContent);
        $(clipname).innerHTML="复制成功请推荐给您的好友";

        Dwr.copyUrl(title, url, function(data) {});
    }
    ,"copy_clip":function(text2copy){
        if (window.clipboardData)
        {
            window.clipboardData.setData("Text",text2copy);
        }
        else
        {
            var flashcopier = 'flashcopier';
            if(!document.getElementById(flashcopier))
            {
                var divholder = document.createElement('div');
                divholder.id = flashcopier;
                document.body.appendChild(divholder);
            }
            document.getElementById(flashcopier).innerHTML = '';
            var divinfo = '<embed src="http://swf.news.163.com/2008/clipBoard.swf?data='+text2copy+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
            document.getElementById(flashcopier).innerHTML = divinfo;
        }
        return true;
    }
    ,"getAbsPosition":function(elem){
        var pos = {};
        if (elem.getBoundingClientRect) {
            var rect = elem.getBoundingClientRect();
            pos.y = rect.top + (document.body.scrollTop || document.documentElement.scrollTop);
            pos.x = rect.left + (document.body.scrollLeft || document.documentElement.scrollLeft);
        } else {
            pos.y = elem.offsetTop;
            pos.x = elem.offsetLeft;
        }

        return pos;
    }
}

var Userinfo = {
    "init":""
    ,"userinfo":null

    ,"getUrl":function() {
        //添加username为了解决多个用户登录缓存文件会共享的问题
        var r=CookieStatus.getMessageRandom();
        var url = "/bbs/dialog/userinfo.jsp?username="+BbsCookie.getPassport()+"&r="+r;
        return url;
    }

    ,"getReloadUrl":function() {
        //添加r随机参数的解决页面缓存时消息条数不能及时更新问题
        var r=CookieStatus.changeMessageRandom();
        var url = "/bbs/dialog/userinfo.jsp?username="+BbsCookie.getPassport()+"&r="+r;
        return url;
    }
    /**
     * 加载用户信息
     */
    ,"loadUserinfo":function() {
        if (this.userinfo == null) {
            var username = BbsCookie.getPassport();
            if (BbsCookie.isLogined() && username!="" && username!=null) {
                Bbs.loadJs(this.getUrl());
            }
            else {
                BbsUtil.showLoginInfo();
            }

        }
    }
    /**
     * 重新加载用户信息（会自动清除客户端缓存）
     */
    ,"reloadUserinfo":function() {
        this.userinfo = null;
        var url = this.getReloadUrl();

        new Ajax.Request(url, {method: 'get', onComplete:function(obj){
            var script = document.createElement("script");
            script.text = obj.responseText;

            //为什么要使用insertAdjacentElement？,因为appendChild在JS文件已经存在浏览器缓存时就会出现IE崩溃的情况(Bbs.editArticle方法就会出现,postArticle则正常)
            if (document.frames) {
                document.body.insertAdjacentElement("BeforeBegin",script);
            }
            else {
                document.body.appendChild(script);  //
            }
            Userinfo.loadUserinfo();
        }});
    }

    /**
     * 删除用户信息
     */
    ,"removeUserinfo":function() {
        this.userinfo = null;
        var url = this.getUrl();

        new Ajax.Request(url, {method: 'get',requestHeaders:["If-Modified-Since","0"], onComplete:function(obj){

        }});
    }

    ,"getUserinfo":function() {
        if (this.userinfo == null) {
            return {};
        }
        else {
            return this.userinfo;
        }
    }
    ,"setUserinfo":function(userinfo1) {
        this.userinfo = userinfo1;
    }
    ,"updateNickname":function(userid,nickname) {
        Dwr.updateNickname(userid,nickname);
    }

    /**
     * 获取昵称
     */
    ,"getNickname":function() {
        var nickname = this.getUserinfo().nickname;
        if (nickname == null || nickname=="") {
            nickname = BbsCookie.getPassport();
        }
        return nickname;
    }
    ,"getMessageCount":function() {
        var messageCount =  this.getUserinfo().messageCount;
        if (messageCount == null || messageCount == "") {
            return "0";
        }
        else {
            return messageCount;
        }
    }
    ,"initLogin":function(user, pass, url, reply){
        var usercookie = BbsCookie.getPassport(); //从Cookie中获取通行证帐号
        if (usercookie == "") {
            user.value="如 name@example.com";
        }else {
            user.value = usercookie;
            if(reply == 1){//如果是回复的窗口焦点不聚焦在密码框

            }else{
                pass.focus();
            }
        }
        user.style.color='#bbbbbb';
        url.value  = document.location.href;
        Passport.bind(user,pass);
        BbsUtil.addEvent(user,"focus",function(e){
            if(user.value == '如 name@example.com'){
                user.value='';
            }
            user.style.color='#000000';
        });
        BbsUtil.addEvent(user,"blur",function(e){
            if(user.value==''){
                user.value='如 name@example.com';
            }
            user.style.color='#bbbbbb';
        });
    }
}

var BbsCookie = {
    "init":""
    ,"getValue":function(name) {
    }
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
    ,"setCookie":function (name, value, expires, path) {
        var value = name + "=" + escape(value) + "; domain=163.com";
        if (path) {
            value += '; path='+path;
        }
        if (expires>0) {
            value += "; expires=" + this.getExpires(expires).toGMTString() ;
        }

        document.cookie = value;
    }
    /**
     * 获取通行证帐号
     */
    ,"getPassport":function() {
        var passport = this.getCookie("NETEASE_SSN");
        if (passport == null || passport == "") {
            passport = this.getPassport2();
        }else {
            var index = passport.indexOf("@163.com");
            if (index == -1){
                passport = passport;
            }
            else {
                passport = passport.substring(0, index);
            }
        }
        return passport;

    }
    /**
     * 获取通行证帐号
     */
    ,"getPassport2":function() {
        var passport = this.getCookie("P_INFO");
        if (passport == null || passport == "") {
            return "";
        }
        if (1==1) {
            var index = passport.indexOf("|");
            if (index > -1){
                passport = passport.substring(0, index);
            }
        }
        var index = passport.indexOf("@163.com");
        if (index == -1){
            return passport;
        }
        else {
            return passport.substring(0, index);
        }
    }
    /**
     * 判断是否已经登录.
     */
    ,"isLogined":function() {
        var NTES_SESS   = BbsCookie.getCookie("NTES_SESS");
        var isLoinged = (NTES_SESS != null && NTES_SESS != "");
        if (!isLoinged) {
            return this.isLogined2();
        }
        var username = BbsCookie.getPassport();
        isLoinged = (username != null && username != "");
        return isLoinged;
    }
    /**
     * 判断是否已经登录.
     */
    ,"isLogined2":function() {
        var S_INFO   = BbsCookie.getCookie("S_INFO");
        var hasCookie = (S_INFO != null && S_INFO != "");
        if (!hasCookie) {
            //验证持久登陆
            var P_INFO = this.getCookie("P_INFO");
            if(P_INFO != null && P_INFO != ""){
                var strlist = P_INFO.split("|");
                if(strlist.length>=3){
                    var logintype = strlist[2];
                    if(logintype == 1){//持久登陆
                        return true;
                    }
                }
            }
            return false;
        }

        var loginTime = -1;
        if (1==1) {
            var index = S_INFO.indexOf("|");
            if (index > -1){
                loginTime = S_INFO.substring(0, index);
            }
        }
        var username = BbsCookie.getPassport();
        var isLoinged = (username != null && username != "");
        return isLoinged;
    }
}




var BbsAdmin = {
    "init":""
    ,"showDialog":function(title, url, width) {
        Bbs.loadDwr();  //预先记载Dwr
        if (!BbsCookie.isLogined()) { //未登录
            Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
        }
        else {
            Dialog.show(title, url, false, false);
            if(typeof(width) == "number" && width){
                Dialog.setWidth(width);
            }
        }
    }
    /**
     * 查看IP
     * @param boardid 版面ID
     * @param articleid 帖子ID
     */
    ,"showIP":function(boardid, articleid,userid) {
        if(userid=="-0000"){
            this.showDialog('查看IP', '/bbs/dialog/showip.jsp?boardid='+boardid+'&articleid='+articleid);
        }else{
            this.showDialog('查看用户', '/bbs/dialog/addBlackUser.jsp?boardid='+boardid+'&articleid='+articleid+'&userid='+userid);
        }

    }
    /**
     * 帖子置顶
     * @param boardid 版面ID
     * @param threadid 主贴ID
     */
    ,"topThread":function(boardid, threadid) {
        this.showDialog('置顶帖子', '/bbs/dialog/topthread.jsp?boardid='+boardid+'&threadid='+threadid);
    }
    /**
     * 推荐帖子
     * @param boardid 版面ID
     * @param threadid 主贴ID
     */
    ,"pushThread":function(boardid, threadid) {
        this.showDialog('推荐帖子', '/bbs/dialog/pushthread.jsp?boardid='+boardid+'&threadid='+threadid);
    }
    /**
     * 相关帖子推荐
     * @param boardid 版面ID
     * @param threadid 主贴ID
     */
    ,"aboutThread":function(boardid, threadid) {
        if(Bbs.checkLoginedLink("/bbs/about.jsp?boardid=" +boardid+"&threadid="+ threadid)){
            document.location.href = "/bbs/about.jsp?boardid=" +boardid+"&threadid="+ threadid;
        }
    }
    /**
     * 帖子加精华
     * @param boardid 版面ID
     * @param threadid 主贴ID
     */
    ,"eliteThread":function(boardid, threadid) {
        this.showDialog('帖子加精华', '/bbs/dialog/elitethread.jsp?boardid='+boardid+'&threadid='+threadid);
    }
    /**
     * 查看活动报名列表
     * @param boardid 版面ID
     * @param threadid 主贴ID
     */
    ,"activityApplyList":function() {
        if (typeof(activityApplyListShow) == "function") {
            activityApplyListShow();
        }
    }

    /**
     * 显示纸条信息
     */
    ,"activityApplyListById":function(boardid, articleid, id, pageid) {
        if (typeof(pageid)=="undefined") {
            pageid = 1;
        }
        BbsAdmin.showDialog('查看活动报名列表', '/bbs2009/dialog/activityApplyList.jsp?boardid='+boardid+'&articleid='+articleid+'&id='+id+'&pageid='+pageid);
    }

    /**
     * 插入导读
     * @param boardid 版面ID
     * @param threadid 主贴ID
     */
    ,"insertGuide":function(boardid, threadid) {
        this.showDialog('插入导读', '/bbs/dialog/insertguide.jsp?boardid='+boardid+'&threadid='+threadid);
        Dialog.setWidth(550);
    }

    /**
     * 插入导读
     * @param boardid 版面ID
     * @param threadid 主贴ID
     */
    ,"limitThread":function(boardid, threadid) {
        this.showDialog('限制编辑帖子', '/bbs/dialog/limitthread.jsp?boardid='+boardid+'&threadid='+threadid);
    }
    /**
     * 帖子加锁
     * @param boardid 版面ID
     * @param threadid 主贴ID
     */
    ,"lockThread":function(boardid, threadid) {
        this.showDialog('帖子加锁', '/bbs/dialog/lockthread.jsp?boardid='+boardid+'&threadid='+threadid);
    }
    /**
     * 垃圾帖子
     * @param boardid 版面ID
     * @param threadid 主贴ID
     */
    ,"rubbishThread":function(boardid, threadid) {
        this.showDialog('垃圾帖子', '/bbs/dialog/rubbishthread.jsp?boardid='+boardid+'&threadid='+threadid);
    }
    /**
     * 发表评论
     */
    ,"reply":function(boardid, threadid, floor, nickname) {
        if (!Bbs.checkLoginedPostReply()) {
            //该版面需要登录才能回复
            //Bbs.showLoginDialog(true);
            return;
        }
        if ($("div_reply").style.display == "none") {
            alert("当前帖子不允许发表评论.");

            new Ajax.Request("/bbs/checkreply.jsp",{method:"get"});
            return;
        }
        var content = "【回复";
        if (floor>0) {
            content += floor+"楼";
        }
        content += " "+ nickname +" 】:\n";
        $("frmpost_toolbar").style.display = "block";
        $("frmpost_upload").style.display = "block";

        var upload = document.getFrame("frmupload");
        if (typeof(upload) == "object") {
            upload.setUploadBoardid(global_boardid);
        }



        document.forms["frmpost"].content.focus();
        document.forms["frmpost"].content.value = content;
        document.documentElement.scrollTop=600000;
    }
    /**
     * 引用回复
     */
    ,"quoteReply":function(boardid, articleid) {
        if ($("div_reply").style.display == "none") {
            alert("当前帖子不允许发表评论.");
            new Ajax.Request("/bbs/checkreply.jsp",{method:"get"});
            return;
        }
        if (!Bbs.checkLoginedPostReply()) {
            //该版面需要登录才能回复
            //Bbs.showLoginDialog(true);
            return;
        }
        var url = "/bbs/dialog/quotereply.jsp?boardid="+boardid+"&articleid="+articleid;

        new Ajax.Request(url,{onComplete:function(data){
            var content = (data.responseText);
            content = content.replace(/\n\s*\r/g,'');
            if (data.status==200) {
                $("frmpost_toolbar").style.display = "block";
                $("frmpost_upload").style.display = "block";
                var upload = document.getFrame("frmupload");

                if (typeof(upload) == "object") {
                    upload.setUploadBoardid(global_boardid);
                }

                document.forms["frmpost"].content.focus();
                document.forms["frmpost"].content.value = content;
                document.documentElement.scrollTop=600000;
            }
            else {
                alert("请求出错.");
            }
        }});
    }
    /**
     * 送鲜花
     * @param boardid 版面ID
     * @param articleid 帖子ID
     */
    ,"sayGood":function(boardid, articleid) {
        Dwr.sayGood(boardid, articleid, function(data) {
            var msg = data;//(dwr.util.toDescriptiveString(data, 1));
            //操作成功
            if (msg.indexOf("错误:") == -1) {
                var obj = document.getElementById("text"+articleid+"_goodnum");
                obj.innerHTML = parseInt(obj.innerHTML)+1;
            }
        });
    }
    /**
     * 扔鸡蛋
     * @param boardid 版面ID
     * @param articleid 帖子ID
     */
    ,"sayBad":function(boardid, articleid) {
        Dwr.sayBad(boardid, articleid, function(data) {
            var msg = data;//(dwr.util.toDescriptiveString(data, 1));
            if (msg.indexOf("错误:") == -1) {
                //操作成功
                var obj = document.getElementById("text"+articleid+"_badnum");
                obj.innerHTML = parseInt(obj.innerHTML)+1;
            }
        });
    }

    /**
     * 删除帖子
     * @param boardid 版面ID
     * @param articleid 帖子ID
     */
    ,"delPost":function(boardid, articleid) {
        this.showDialog('删除帖子', '/bbs/dialog/delpost.jsp?boardid='+boardid+'&articleid='+articleid);
    }

    /**
     * 加黑
     * @param boardid 版面ID
     * @param articleid 帖子ID
     */
    ,"addBlackList":function(boardid, username) {
        this.showDialog('加黑名单', '/bbs/dialog/addblacklist.jsp?boardid='+boardid+'&username='+username);
    }

    /**
     * 加黑
     * @param boardid 版面ID
     * @param username 用户名
     */
    ,"delBlackList":function(boardid, username) {
        if(confirm('是否确认删除黑名单用户“'+username+'”？')){
            Dwr.delBbsBlackList(boardid,username,function(data){
                alert(data);
                document.location.replace(document.location.href);
            });
        }
    }

    /**
     * 帖子下沉
     * @param boardid 版面ID
     * @param articleid 帖子ID
     */
    ,"downThread":function(boardid, threadid) {
        if (!BbsCookie.isLogined()) {
            Bbs.showLoginDialog(true);
            return;
        }
        if(confirm('是否确认将帖子下沉？')){
            Dwr.downThread(boardid,threadid,function(data){
                alert(data);
            });
        }
    }

    /**
     * 添加包子
     * @param boardid 版面ID
     * @param articleid 帖子ID
     */
    ,"addBread":function(boardid,articleid,username) {
        this.showDialog('添加包子', '/bbs/dialog/addBread.jsp?boardid='+boardid+'&articleid='+articleid+'&username='+username);
    }

    /**
     * 投诉帖子
     * @param boardid 版面ID
     * @param articleid 帖子ID
     */
    ,"chargePost":function(boardid, threadid, articleid, floor) {
        this.showDialog('投诉帖子', '/bbs/dialog/chargepost.jsp?boardid='+boardid+'&threadid='+threadid+'&articleid='+articleid + "&floor=" +floor);
    }

    /**
     * 投诉帖子
     * @param boardid 版面ID
     * @param articleid 帖子ID
     */
    ,"chargePost_new":function(boardid, threadid, articleid, floor) {
        BbsUtil.clickStat("report");
        this.showDialog('投诉帖子', '/bbs/dialog/chargepost.jsp?boardid='+boardid+'&threadid=' + threadid + '&articleid='+articleid + "&floor=" +floor);
    }

    /**
     * 复制主贴
     * @param boardid 版面ID
     * @param threadid 主贴ID
     */
    ,"copyThread":function(boardid, threadid) {
        this.showDialog('复制主贴', '/bbs/dialog/copythread.jsp?boardid='+boardid+'&threadid='+threadid, 550);
        //Dialog.setWidth(550);
    }
    /**
     * 设置优点帖
     * @param boardid 版面ID
     * @param articleid 帖子ID
     */
    ,"setAdminCommentTypes":function(boardid, articleid, types) {
        this.showDialog('设置优点帖', '/bbs/dialog/setAdminCommentTypes.jsp?boardid='+boardid+'&articleid='+articleid+"&types="+types);
    }
    /**
     * 设为最佳答案
     * @param boardid 版面ID
     * @param articleid 帖子ID
     */
    ,"setAskGoodAnswer":function(boardid, articleid) {
        if (!BbsCookie.isLogined()) {
            Bbs.showLoginDialog(true);
            return;
        }

        if (!confirm("设置后不能再修改，是否确认设为最佳答案?")) {
            return;
        }

        Dwr.setAskGoodAnswer(boardid, articleid, function(data) {
            alert(data);
            document.location.replace(document.location.href+"?a1");
        });
    }
    /**
     * 设为推荐答案
     * @param boardid 版面ID
     * @param articleid 帖子ID
     */
    ,"setAskPushAnswer":function(boardid, articleid) {
        if (!BbsCookie.isLogined()) {
            Bbs.showLoginDialog(true);
            return;
        }

        if (!confirm("设置后不能再修改，是否确认设为推荐答案?")) {
            return;
        }

        Dwr.setAskPushAnswer(boardid, articleid, function(data) {
            alert(data);
            document.location.replace(document.location.href);
        });
    }
}

var BbsAdminButton = {
    "init":""
    ,"articleid":0
    /**
     * 显示管理按钮
     */
    ,"show":function(articleid) {
        this.articleid = articleid;
        //document.title ="articleid:"+articleid;
        var obj = $("admin_"+articleid);
        obj.style.display = "block";
        obj.onmouseout  = BbsAdminButton.closeOut;
        obj.onmouseover = BbsAdminButton.closeOver;
    }
    ,"curShow":null
    ,"closeOut":function() {
        this.curShow = setTimeout("BbsAdminButton.close()", 100);
    }
    ,"closeOver":function() {
        clearTimeout(this.curShow);
    }

    /**
     * 关闭管理按钮
     */
    ,"close":function() {
        var obj = $("admin_"+this.articleid);
        obj.style.display = "none";
    }
}


var Nav = {
    "init":function() {
        //if(window.screen.width < 1024){        
        if(document.body.offsetWidth < 800){
            Nav.close();
        }
        else if (BbsCookie.getCookie("shownav") == "false") {
            Nav.close();
        }
    }
    /**
     * 收起左侧导航
     */
    ,"close":function() {
        var obj = document.getElementById("switchPoint");
        obj.alt = "展开左侧导航栏";
        obj.src = "/bbs/images/nav_middle_show.gif";
        document.getElementById("frmTitle").style.display="none";
        BbsCookie.setCookie("shownav", "false", 0);
    }
    /**
     * 展开导航
     */
    ,"open":function() {
        var obj = document.getElementById("switchPoint");
        obj.alt = "收起左侧导航栏";
        obj.src = "/bbs/images/nav_middle_hide.gif";

        document.getElementById("frmTitle").style.display="";
        BbsCookie.setCookie("shownav", "true", 0);
    }
    /**
     * 判断导航是否打开
     */
    ,"isOpen":function() {
        var obj = document.getElementById("switchPoint");
        return (obj.alt == "收起左侧导航栏");
    }
    ,"switchSysBar":function(){
        if (this.isOpen()){
            this.close();
        }
        else{
            this.open();
        }
    }
    /**
     * 显示左侧导航
     */
    ,"show":function() {
        //BbsCookie.getCookie("nav_show");
        BbsCookie.setCookie("nav_show", "y", -1);

    }

    /**
     * 隐藏左侧导航
     */
    ,"hide":function() {
        //BbsCookie.getCookie("nav_show");
        BbsCookie.setCookie("nav_show", "n", -1);
    }
    /**
     * 用户是否隐藏了导航
     */
    ,"isHidden":function() {
        return (("n" == BbsCookie.getCookie("nav_show")));
    }
}

/**
 * 插件程序
 *
 * @author 阿海
 */
var BbsPlugin = {
    "init":""


}


var BbsTab = {
    "init":""
    ,"showLeftTab":function(leftTabId, rightTabId) {
        $(leftTabId).style.display = "block";
        $(leftTabId+"_title").addClassName("c1");
        $(leftTabId+"_title").addClassName("on");

        $(rightTabId).style.display = "none";
        $(rightTabId+"_title").removeClassName("c2");
        $(rightTabId+"_title").removeClassName("on");

    }
    ,"showRightTab":function(leftTabId, rightTabId) {
        $(leftTabId).style.display = "none";
        $(leftTabId+"_title").removeClassName("c1");
        $(leftTabId+"_title").removeClassName("on");

        $(rightTabId).style.display = "block";
        $(rightTabId+"_title").addClassName("c2");
        $(rightTabId+"_title").addClassName("on");
    }
}


var MyXml = {
    "init":""
    ,"getValue":function(node, name) {
        return node.getElementsByTagName(name)[0].firstChild.data;
    }
}


var BbsBoard = {
    "init":""
    /**
     * 添加搜藏版面
     */
    ,"addMyFavorite":function(boardid) {
        if (!BbsCookie.isLogined()) { //未登录
            Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
            return;
        }

        Dwr.addMyFavorite(boardid, function(data) {

            var obj = $("myCollection");
            if (obj != null) {
                BbsLeft.loadMyFavorite();
                obj.style.display = "block";
            }

            alert(data);
        });
    }

    ,"addMyFavorite_Yiba":function(boardid) {
        if (!BbsCookie.isLogined()) { //未登录
            Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
            return;
        }

        Dwr.addMyFavorite_Yiba(boardid, function(data) {

            var obj = $("myCollection");
            if (obj != null) {
                BbsLeft.loadMyFavorite();
                obj.style.display = "block";
            }

            alert(data);
        });
    }

    /**
     * 删除搜藏版面
     */
    ,"deleteMyFavorite":function(boardid) {
        if (!BbsCookie.isLogined()) { //未登录
            Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
            return;
        }

        if (!confirm("是否确认删除该版面？")) {
            return;
        }

        Dwr.deleteMyFavorite(boardid, function(data) {
            var obj = $("myCollection_"+boardid); //隐藏

            if (obj != null) {
                obj.style.display = "none";
            }
        });
    }

    /**
     * 删除搜藏版面
     */
    ,"deleteMyFavorite_Yiba":function(boardid) {
        if (!BbsCookie.isLogined()) { //未登录
            Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
            return;
        }


        if (!confirm("是否确认删除该版面？")) {
            return;
        }

        Dwr.deleteMyFavorite_Yiba(boardid, function(data) {
            var obj = $("myCollection_"+boardid); //隐藏

            if (obj != null) {
                obj.style.display = "none";
            }
        });
    }
}



var BbsXml = {
    "init":""
    ,"load":function(url, params, responseFunction ) {
        var options = {method: "get", parameters: params, onComplete: responseFunction};
        new Ajax.Request(url, options);
    }
    ,"getNodeValue":function(node, name) {
        return node.getElementsByTagName(name)[0].firstChild.data;
    }
}

var YibaLogin = {
    /**
     * 登录窗口初始化操作
     */
    "init":function() {
    }
    ,"getForm":function(frameName) {
        return document.forms[frameName];
    }
    /**
     * 登录窗口提交验证
     */
    ,"dopost":function(frameName) {
        var form = this.getForm(frameName);
        if (form.username.value == "") {
            alert("请输入您的用户名.");
            form.username.focus();
            return false;
        }
        if (form.password.value == "") {
            alert("请输入密码.");
            form.password.focus();
            return false;
        }
        Userinfo.removeUserinfo();//清空用户信息


        var url = form.url.value;

        Bbs.loginPassport(form.username.value, form.password.value, Bbs.loginCallback);
        return false;
    }
    /**
     *登录条验证
     */
    ,"dopost_return":function(frameName) {
        var form = this.getForm(frameName);
        if (form.username.value == "") {
            alert("请输入您的用户名");
            form.username.focus();
            return false;
        }
        if (form.password.value == "") {
            alert("请输入您的密码");
            form.password.focus();
            return false;
        }
        Userinfo.removeUserinfo();


        var url = form.url.value;

        Bbs.loginPassport(form.username.value, form.password.value, Bbs.loginCallback);
        return true;
    }
}

/**
 * 检查字符串是否为整数.
 */
String.prototype.isDigit = function() {
    var regex=/^([0-9])+$/;
    if (regex.exec(this)){
        return true;
    }
    return false;
}


function insertContent(content) {
    Editor.insertContent(content);
}


function quitOlympics(boardid, articleid, username) {
    if (!BbsCookie.isLogined()) { //未登录
        Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
    }
    else {
        if (username != BbsCookie.getPassport()) {
            alert("该帖子不是您发表的，您无权操作.");
            return;
        }


        if (confirm("是否确认退出奥运加油团？")) {
            Dwr.quitOlympics(boardid, articleid, username, function(data) {
                $("olympics_"+articleid).style.display = "none";
                alert(data);
            });
        }
    }
}

function joinGoldmedal(boardid, articleid, from_username) {
    if (!BbsCookie.isLogined()) { //未登录
        Bbs.showLoginDialog(true); //显示登录框，登录成功后自动回调
        return;
    }

    Dwr.joinGoldmedal(boardid, articleid,from_username, function(data) {
        if(data != null && data != ""){
            BbsAdmin.showDialog("传递爱","/bbs/dialog/goldmedal.jsp?data="+data);
            Dialog.setWidth(450);
            //alert(data);
        }
    });
}

function joinInGoldmedal(boardid, articleid) {
    if (!BbsCookie.isLogined()) { //未登录
        Bbs.showLoginDialog(true); //显示登录框，登录成功后自动回调
        return;
    }

    Dwr.joinGoldmedal(boardid, articleid,"", function(data) {
        if(data != null && data != ""){
            BbsAdmin.showDialog("传递爱","/bbs/dialog/goldmedal.jsp?data="+data);
            Dialog.setWidth(450);
            //alert(data);
        }
    });
}

function joinChinaxinSpeciel(boardid, articleid,from_username) {

    if (!BbsCookie.isLogined()) { //未登录
        Bbs.showLoginDialog(true); //显示登录框，登录成功后自动回调
        return;
    }
    document.getElementById("spreed_btn").style.display="none";
    Dwr.joinChinaxin(boardid, articleid,from_username, function(data) {
        if(data != null && data != ""){
            BbsAdmin.showDialog("中国心","/bbs/dialog/chinaxin.jsp?data="+escape(data));
            Dialog.setWidth(502);
            document.getElementById("spreed_btn").style.display="block";
            document.getElementById("draghead").style.display="none";
        }
    });
}

function joinChinaxin(boardid, articleid,from_username) {
    if (!BbsCookie.isLogined()) { //未登录
        Bbs.showLoginDialog(true); //显示登录框，登录成功后自动回调
        return;
    }
    Dwr.joinChinaxin(boardid, articleid,from_username, function(data) {
        if(data != null && data != ""){
            BbsAdmin.showDialog("中国心","/bbs/dialog/chinaxin.jsp?data="+escape(data));
            Dialog.setWidth(502);
            document.getElementById("draghead").style.display="none";
        }
    });
}

function joinBiaoAXin(boardid, articleid) {
    if (!BbsCookie.isLogined()) { //未登录
        Bbs.showLoginDialog(true); //显示登录框，登录成功后自动回调
        return;
    }
    Dwr.joinBiaoAXin(boardid, articleid,function(data) {
        BbsAdmin.showDialog("飚爱心","/bbs/dialog/biaoaxin.jsp?data="+escape(data));
        Dialog.setWidth(502);
        document.getElementById("biaoaxin_btn").style.display="none";
    });
}


function joinWorldCup(boardid, articleid,team, from_username) {
    if (!BbsCookie.isLogined()) { //未登录
        Bbs.showLoginDialog(true); //显示登录框，登录成功后自动回调
        return;
    }
    Dwr.isWorldCupUser(function(data) {
        if(data){
            alert("您已经选择过您所支持的球队，谢谢参与！");
        }else{
            BbsAdmin.showDialog("欢迎加入网易论坛《世界杯球迷大比拼》活动","/bbs/dialog/worldcup.jsp?boardid="+boardid+"&articleid="+articleid+"&team="+team+"&from_username="+from_username);
            Dialog.setWidth(450);
        }
    });
}

function viewActivity(domain,boardid,articleid,invite_username){
    window.location.href = "http://"+domain.replace("_",".")+".163.com/bbs/"+boardid+"/"+articleid+".html?invite_username="+escape(invite_username);
}

function joinActivity(activityid,team,mainArticle) {
    if (!BbsCookie.isLogined()) { //未登录
        Bbs.showLoginDialog(true); //显示登录框，登录成功后自动回调
        return;
    }
    Dwr.isJoinActivity(activityid,function(data) {
        if(data){
            alert("您已经参加过活动，谢谢参与！");
        }else{
            var invite_username="";
            var url=location.search;
            if(url.indexOf("?")!=-1){
                var str = url.substr(1)
                var strs = str.split("&");
                for(var i=0;i<strs.length;i++){
                    if(strs[i].split("=")[0] == "invite_username")
                        invite_username = unescape(strs[i].split("=")[1]);
                }
            }
            BbsAdmin.showDialog("欢迎加入网易论坛活动","/bbs/dialog/activity.jsp?activityid="+activityid+"&team="+team+"&invite_username="+invite_username+"&mainArticle="+mainArticle);
            Dialog.setWidth(450);
        }
    });
}


function quitLibang(boardid, articleid, username) {
    if (!BbsCookie.isLogined()) { //未登录
        Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
    }
    else {
        if (username != BbsCookie.getPassport()) {
            alert("该帖子不是您发表的，您无权操作.");
            return;
        }

        if (confirm("是否确认退出立邦为爱上色活动？")) {
            Dwr.quitLibang(boardid, articleid, username, function(data) {
                $("libang_"+articleid).style.display = "none";
                alert(data);
            });
        }
    }
}


var Upload = {
    "insertContent":function(url) {
        if(Editor.getForm().content.value=="本论坛面向公众开放，请广大会员注意文明发帖，展现玫琳凯人‘美丽多面体’的职业形象。"){
            Editor.getForm().content.value = "";
        }
        Editor.insertContent('\n[img]'+url+'[/img]\n', true);
    },
    "insertAttachment":function(id) {
        var content = EditorExtend.getContent();
        if(content=="本论坛面向公众开放，请广大会员注意文明发帖，展现玫琳凯人‘美丽多面体’的职业形象。"){
            content = "";
        }
        var insertcontent = '\n[plugin:attachment]'+id+'[/plugin:attachment]\n';
        EditorExtend.insert({text:insertcontent});
        //Editor.insertContent('\n[plugin:attachment]'+id+'[/plugin:attachment]\n', true);
        Dialog.close();
    }
}

var EditorExtend = {
    "addListener":function(obj){
        obj.addListener("onStartClickItem", function(oData) {
            var sCommand = oData["command"];
            var sName = oData["name"];
            if(sCommand == "custom" && sName == "bbsimage"){
                BbsPost.showUploadImageSwfBox();
                //返回{"stop":true}，停止执行编辑器默认行为
                return {"stop":true};
            }else if(sCommand == "custom" && sName == "bbsvideo"){
                EditorExtend.insertMedia();
                return {"stop":true};
            }else if(sCommand == "custom" && sName == "bbsattach"){
                EditorExtend.insertAttachment();
                return {"stop":true};
            }
            else if(sCommand == "custom" && sName == "bbshtml"){
                EditorExtend.insertHtml();
                return {"stop":true};
            }
            else if(sCommand == "custom" && sName == "bbsformat"){
                EditorExtend.formatHtml();
                return {"stop":true};
            }
            else if(sCommand == "custom" && sName == "bbstcard"){
                EditorExtend.insertWeiboCard();
                return {"stop":true};
            }
            else if(sCommand == "custom" && sName == "bbs9box"){
                EditorExtend.insert9box();
                return {"stop":true};
            }
        });
    }
    ,"addPostListener":function(obj){
        obj.observer.add({
            "el" : obj.editor.doc,
            "eventType" : "keydown",
            "fn" : function() {
                var oEvent = obj.getEvent(obj.editor.win);
                if(oEvent.ctrlKey && oEvent.keyCode==13) {
                    BbsPost.dopost();
                }
            }
        });
    }
    ,"addReplyListener":function(obj){
        obj.observer.add({
            "el" : obj.editor.doc,
            "eventType" : "keydown",
            "fn" : function() {
                var oEvent = obj.getEvent(obj.editor.win);

                // 没有事件，则返回
                if (!oEvent) {
                    return;
                }

                if(oEvent.ctrlKey && oEvent.keyCode==13) {
                    BbsUtil.checkReplyPost();
                }
            }
        });
    }
    ,"insertMedia":function(){
        if (!BbsCookie.isLogined()) { //未登录
            Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
            return;
        }
        BbsAdmin.showDialog('插入影音', '/bbs/dialog/insert_media.jsp?boardid='+global_boardid);
        Dialog.setWidth(460);
    }
    ,"insertAttachment":function(){
        if (!BbsCookie.isLogined()) { //未登录
            Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
            return;
        }
        var id = 0;  //附件ID
        if (1==1) {
            //根据内容解析投票ID，只匹配第一个投票
            var content = EditorExtend.getContent();
            var regex = /\[plugin:attachment\]([0-9]+)\[\/plugin:attachment\]/gi;
            var m = new RegExp(regex).exec(content);

            if (m != null) {
                id = parseInt(m[1]);
            }
        }
        if (id <=0 ) {
            BbsAdmin.showDialog('插入附件', '/bbs/plugin/attachment_post.jsp?boardid='+global_boardid);
        }
        else {
            BbsAdmin.showDialog('修改附件('+id+')', '/bbs/plugin/attachment_post.jsp?boardid='+global_boardid+"&id="+id);
        }
        Dialog.setWidth(460);
    }
    ,"insertHtml":function(){

        if (!BbsCookie.isLogined()) { //未登录
            Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
            return;
        }
        var id = 0;  //HTMLID
        if (1==1) {
            //根据内容解析投票ID，只匹配第一个投票
            var content = EditorExtend.getContent();
            var regex = /\[plugin:html\]([0-9]+)\[\/plugin:html\]/gi;
            var m = new RegExp(regex).exec(content);

            if (m != null) {
                id = parseInt(m[1]);
            }
        }
        if (id <=0 ) {
            BbsAdmin.showDialog('插入HTML', '/bbs/plugin/html_post.jsp?boardid='+global_boardid);
        }
        else {
            BbsAdmin.showDialog('修改HTML', '/bbs/plugin/html_post.jsp?boardid='+global_boardid+"&id="+id);
        }
        Dialog.setWidth(600);
    }
    ,"dopost":function(){
        // 图集的图片关系
        var hiddenField = document.getElementById('photoSetImgUrls');
        var imgUrls = '';
        if (hiddenField) {
            imgUrls = hiddenField.value;
        }

        if (1==1) {
            var flag = BbsPost.checkVerify(imgUrls);
            if (flag) {
                //需要输入验证码
                return false;
            }
        }
        if (1==1) {
            try {
                //插件程序，在正常参数检查前执行
                var flag = plugin_submit_before();
                if (flag==false) {
                    return false;
                }
            }
            catch(e) {
            }

        }

        if (this.validate()==false) {
            return false;
        }
        else {
            try {
                //插件程序，在正常参数检查后执行
                var flag = plugin_submit();
                if (flag==false) {
                    return false;
                }
            }
            catch(e) {
            }

            //插件程序，在正常参数检查后执行
            try {
                var flag = BbsPostType.typeSubmit();
                if (flag==false) {
                    return false;
                }
            }
            catch(e) {
                alert(e.message);
            }
            var form = document.forms["frmpost"];
            var content = EditorExtend.getContent();
            if (form.isautocopy.checked) {
                //自动复制内容到剪贴板
                BbsUtil.copyText(content);
            }
            if (EditorExtend.hasForfendKeyword(content)) {
                BbsAdmin.showDialog('严禁词', '/bbs/dialog/hasforfend.jsp?boardid='+global_boardid+'&threadid='+global_threadid);
                document.getElementById('dialog_close_btn').style.display="none";
                return false;
            }
            if (EditorExtend.hasSubtleKeyword(content)) {
                BbsAdmin.showDialog('敏感词', '/bbs/dialog/hassubtle.jsp?boardid='+global_boardid+'&threadid='+global_threadid);
                return false;
            }
            return true;
        }
    }
    ,"validate":function () {
        var form = document.forms["frmpost"];
        if (1==1){
            var cids = (form.cid);


            if (typeof(cids)=="object") {
                if (!BbsUtil.isChecked(cids)) {
                    Dialog.alert("您还未选择帖子的类别,请在帖子标题下方选择.");
                    return false;
                }
            }
        }

        if (form.title.value=="") {
            Dialog.alert("随便在标题框输入点什么吧.");
            form.title.focus();
            return false;
        }

        if (form.content.value=="") {
            Dialog.alert("发贴不能不填内容的哦,^_^");
            form.content.focus();
            return false;
        }
        if (1==1) {
            var checkcode = form.checkcode;
            if (typeof(checkcode) == "object") {
                if (checkcode.value == "") {
                    Dialog.alert("验证码还没有输入.");
                    checkcode.focus();
                    return false;
                }
                if (checkcode.value.length != 4) {
                    Dialog.alert("验证码的位数不对哦.");
                    checkcode.focus();
                    return false;
                }
            }
        }
    }
    ,"hasForfendKeyword":function(content){
        DWREngine.setAsync(false);
        Dwr.hasForfendKeyword(global_boardid,global_threadid,"", content,function(data){
            hasKeyword = data;
        });
        DWREngine.setAsync(true);
        return hasKeyword;
    }
    ,"hasSubtleKeyword":function(content){
        DWREngine.setAsync(false);
        Dwr.hasSubtleKeyword(global_boardid,global_threadid,"", content,function(data){
            hasKeyword = data;
        });
        DWREngine.setAsync(true);
        return hasKeyword;
    }
    ,"getMediaType":function(str){
        var strs = str.split(".");
        if (strs == null || strs.length <=0){
            return "";
        }
        return strs[strs.length-1].toLowerCase();
    }
    /**
     * 判断是否为编辑状态
     */
    ,"isEditing":function() {
        var articleid = parseInt(this.getForm()["articleid"].value);
        return (articleid>0);
    }
    /**
     * 获取发贴的form对象
     */
    ,"getForm":function() {
        return document.forms["frmpost"];
    }
    ,"getContent":function(){
        return oEditor.getContent();
    }
    /**
     * 插入元素
     *
     * @param {object}oData
     *                .html要插入的html
     *                .text要插入的纯文本
     *                .image要插入的图片html
     * 例:EditorExtend.insert({text:value})
     */
    ,"insert":function(oData){
        //清空选区避免chrome崩溃
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        oEditor.insert(oData);
    }
    ,"insertBefore":function(sHtml){
        oEditor.set({html:sHtml+oEditor.get({html:true})});
    }
    ,"setContent":function(oData){
        oEditor.set({html:""});
        oEditor.insert(oData);
    }
    ,"formatHtml":function(){
        var content = EditorExtend.getContent();
        // 将所有h标签和p替换为div
        content = content.replace(/<(\/)?(?:h1|h2|h3|h4|h5|h6|p)(?:\s+[^<>]*)?>/gi, "<$1div>");
        // 删除空行内标签、word中带出的<o:p></o:p>标签
        content = content.replace(/<(a|span|strong|b|i|em|o|font|big|small|sub|sup|bdo|u|s|o\:p)(?:\s+[^<>]*)?>(?:\s*|(?:&nbsp;)*|(<br ?\/?>)*|<\/?(a|span|strong|b|i|em|o|font|big|small|sub|sup|bdo|u|s|o\:p)(?:\s+[^<>]*)?>)*<\/\1>/gi, " ");

        content = content.replace(/^(\s| |&nbsp;|　)+/ig, "");
        content = content.replace(/<div>/ig, "<div><br>");
        //避免嵌套的div造成重复空行
        content = content.replace(/<br>(?:\s|(?:&nbsp;))*?<div>/ig, "<div>");
        //删除刚才给空div加上的空行
        content = content.replace(/<div(?:\s+[^<>]*)?><br>(?:\s|(?:&nbsp;))*?<\/div>/ig, "<div>&nbsp;</div>");
        content = content.replace(/<br ?\/?>(\s| |&nbsp;|　)+/ig, "<br>");
        content = content.replace(/(<br ?\/?>)+/ig, "<br><br>");
        content = content.replace(/<p>(\s| |&nbsp;|　)+/ig, "<p>");
        content = content.replace(/(<p><\/p>)+/ig, "");
        content = content.replace(/<div>(<br ?\/?>|\s| |&nbsp;|　)+<div>/ig, "<div><div>");
        content = content.replace(/<div>(<br ?\/?>)+/ig, "<div><br>");
        content = content.replace(/<br ?\/?>/ig, "<br>&nbsp;&nbsp;&nbsp;&nbsp;");
        content = content.replace(/<p>/ig, "<p>&nbsp;&nbsp;&nbsp;&nbsp;");
        if (content.indexOf("<div>") != 0){
            content = "&nbsp;&nbsp;&nbsp;&nbsp;" + content;
        }
        content = content.replace(/^&nbsp;&nbsp;&nbsp;&nbsp;<div><br>&nbsp;&nbsp;&nbsp;&nbsp;/i, "<div>&nbsp;&nbsp;&nbsp;&nbsp;");
        content = content.replace(/^&nbsp;&nbsp;&nbsp;&nbsp;<p>&nbsp;&nbsp;&nbsp;&nbsp;/i, "<p>&nbsp;&nbsp;&nbsp;&nbsp;");
        EditorExtend.setContent({html:content});
    }
    ,"insertWeiboCard":function(){
        /**
         * 插入微博名片
         *
         * @create_date 2011-7-18
         * @last_modified
         * @author Ben Liu
         */
        if (!BbsCookie.isLogined()) { //未登录
            Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
            return;
        }
        BbsAdmin.showDialog('插入微博名片', '/bbs/plugin/insert_card.jsp?boardid='+global_boardid);
        Dialog.setWidth(450);
    }
    ,"insert9box":function(){
        //插入九宫格
        if (!BbsCookie.isLogined()) { //未登录
            Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
            return;
        }
        Dialog.show('插入九宫格减肥日志', '/bbs/insert_9box.html', true, true, EditorExtend.init9box);
        Dialog.setWidth(450);
    }
    ,"init9box":function(){
        NineBox.init();
    }
    ,"save9box":function(){
        var ninebox1 = $("ninebox1").value;
        var ninebox2 = $("ninebox2").value;
        var ninebox3 = $("ninebox3").value;
        var ninebox4 = $("ninebox4").value;
        var ninebox5 = $("ninebox5").value;
        var ninebox6 = $("ninebox6").value;
        var ninebox7 = $("ninebox7").value;
        var ninebox8 = $("ninebox8").value;
        //xss过滤
        var reHtmlChars = /[<>"&]/g , htmlMapping = {
            "<" : "&lt;",
            ">" : "&gt;",
            "\"" : "&quot;",
            "&" : "&amp;",
            " " : "&nbsp;"
        };

        if(ninebox1 == ""){
            alert("请输入减肥日志");
            $("ninebox1").focus();
            return;
        }
        if(ninebox2 == ""){
            alert("请输入减肥日志");
            $("ninebox2").focus();
            return;
        }
        if(ninebox3 == ""){
            alert("请输入减肥日志");
            $("ninebox3").focus();
            return;
        }
        if(ninebox4 == ""){
            alert("请输入减肥日志");
            $("ninebox4").focus();
            return;
        }
        if(ninebox5 == ""){
            alert("请输入减肥日志");
            $("ninebox5").focus();
            return;
        }
        if(ninebox6 == ""){
            alert("请输入减肥日志");
            $("ninebox6").focus();
            return;
        }
        if(ninebox7 == ""){
            alert("请输入减肥日志");
            $("ninebox7").focus();
            return;
        }
        if(ninebox8 == ""){
            alert("请输入减肥日志");
            $("ninebox8").focus();
            return;
        }
        var list = new Array(),i = 0 ;

        list[0] = ninebox1;
        list[1] = ninebox2;
        list[2] = ninebox3;
        list[3] = ninebox4;
        list[4] = ninebox5;
        list[5] = ninebox6;
        list[6] = ninebox7;
        list[7] = ninebox8;

        // xss forbidden
        // zhou.peng 2012.9.25
        for(i;i<8;i++){
            list[i] = list[i].replace(reHtmlChars, function ($0) {
                return htmlMapping [$0];
                    });

        }
        DWREngine.setAsync(false);
        Dwr.insertBoxDaily(list, function(data) {
            if(data != ""){
                var imgs = new Array();
                imgs[0] = data;
                BbsPost.insertImgFromFlash(imgs);
                var copyWeiboObj = $("copytoweibo");
                if (copyWeiboObj) {
                    copyWeiboObj.checked = false;
                }
            }
        });
        DWREngine.setAsync(true);
    }
}




/**
 * 图集的js
 * 2012-5-10 wengyc
 */

BbsUtil.checkcodePhotoHTML = '\
                <div class="left">\
                  <a href="javascript:BbsUtil.reloadCheckcode(\'replyPhotoCodeImg\');" class="nphbbs_clayout_code" target="_self"><img id="replyPhotoCodeImg" src="/bbs/code/code0.jsp" alt="看不清，换一张" /></a>\
                  <input class="nphbbs_clayout_codeinput" name="checkcode" type="text" value="" />\
                  <div class="nphbbs_clayout_codechange">不区分大小写，<a class="cBlue" href="javascript:BbsUtil.reloadCheckcode(\'replyPhotoCodeImg\');" target="_self">换一张</a></div>\
                </div>\
                <div class="right">\
                  <div class="nphbbs_clayout_codetip" id="replyPhotoCodeTips">{message}</div>\
                </div>';

BbsUtil.checkcodeReplyHtml = '\
	<div style="clear: both; margin-left: 40px; padding: 10px 0;">\
	<div>验证码：\
	<input size="6" name="checkcode" class="input007" maxlength="4" type="text"> \
	</div>\
	<div style="margin-top:10px;">\
	<a href="javascript:BbsUtil.reloadCode();" target="_self"><img id="imgcheckcode" src="{image}" alt="看不清，换一张"></a>\
	<a href="javascript:BbsUtil.reloadCode();" target="_self" style="display: inline-block; margin-top: 20px;">看不清，换一张</a>\
	</div>\
</div>';

BbsUtil.checkcodeTipEmpty = function(elem){
    elem.style.display = 'none';
    var checkcode = NTES(elem).NTES('input[name=checkcode]')
    if(checkcode.length != 0){
        checkcode[0].value = '';
    }
}

BbsUtil.checkReplyPhotoCode = function(param){
    /*
     * param参数各项（不可为空）：
     * form: 要求输入验证码的input为form.checkcode
     * codeArea: 验证码相关代码插入区域
     * codeTipID: 验证码错误提示区域ID
     * codeHTML: 验证码相关代码
     * codeImgID: 验证码图片ID
     * 
     * 返回：
     * true继续执行，false中断
     */

    //判断用户是否需要输入验证码？
    var form = param.form,
        checkcode = form.checkcode,
        codeArea = param.codeArea,
        codeTipID = param.codeTipID,
        codeHTML = param.codeHTML,
        codeImgID = param.codeImgID,
        verifyMessage = '',
        photoMsg = '',
        imgUrls = '';

    if (codeArea.style.display != 'none') {
        //codeArea.style.display = 'block';
        if (checkcode.value == "") {
            BbsPost.checkcodePopup(codeTipID, '验证码还没有输入。');
            checkcode.focus();
            return false;
        }
        if (checkcode.value.length != 4) {
            BbsPost.checkcodePopup(codeTipID, '验证码的位数不对。');
            checkcode.focus();
            return false;
        }
    }
    else {
        if (BbsCookie.isLogined()) {
            // 如果是楼主回帖
            //var loginedPassport = BbsCookie.getPassport();

            // 非楼主回复的帖子，有图片，也存储关系。
            //if (global_author_username == loginedPassport) {
            // 图集的图片关系
            var hiddenField = document.getElementById('photoSetImgUrls');
            if (hiddenField) {
                imgUrls = hiddenField.value;
            }
            //}

            var result = BbsUtil.isWantVerify(false,imgUrls);
            if (result) {
                var msgs = result.split(',');
                if (msgs && msgs.length == 2) {
                    verifyMessage = msgs[0];	//验证码信息
                    photoMsg = msgs[1];	//图片上传信息
                }
            }
        } else {
            verifyMessage = "您是匿名发帖，需要输入验证码。";
        }

        if (photoMsg != '') {
            //图片上传信息只有回复图集的时候有，回帖的codeTip和帖子错误信息是显示在一个地方的，一起处理了，有别的变动的话再改
            BbsPost.checkcodePopup(codeTipID, photoMsg);
            remove163Imgs();
            return false;
        }

        if (verifyMessage != '') {	//需要输入验证码的情况
            if( codeArea.innerHTML == '' ){
                var html = codeHTML,
                    html = format(html,{message:verifyMessage,image:BbsUtil.getCodeJsp()});

                codeArea.innerHTML = html;
            }
            BbsUtil.reloadCheckcode(codeImgID);	//就算是首次加载，避免刷出缓存，也reload下
            BbsPost.checkcodePopup(codeTipID, verifyMessage);
            codeArea.style.display = "block";
            BbsUtil.clickStat("checknum");
            form.checkcode.focus();
            return false;
        }
    }
    return true;
}

BbsUtil.checkReplyPostAjax = function(){
    BbsUtil.clickStat("album_ok");

    if (!BbsCookie.isLogined() && !BoardConfig.isAllowGuestPostThread()) { //未登录
        Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
        return false;
    }

    //内容前端验证
    var content = EditorExtend.getContent(),
        content_len = content.length;
    if(content.trim() == '' || content.trim() == "<br>" || content.trim() == "<DIV></DIV>"){
        Dialog.alert("内容不能为空");
        return;
    }
    // 清注释
    content = content.replace(/<!--(.|\s)*?-->/gi, "");
    var content_char = content.replace(/[^\x00-\xff]/gi, "aa");
    // 计算字数
    if(content_char.length >= 65000){
        var frmReplyPrompt = document.getElementById("frmReplyPrompt");
        if(frmReplyPrompt){
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
        }
        return;
    }

    var form = document.forms["frmpost"], isCopyToWeibo = false, checkcodeValue = '',
        codeArea = document.getElementById('frmpost_upload');
    form.content.value = content;
    if (document.getElementById("copytoweibo").checked) {
        isCopyToWeibo = true;
    }


    //判断用户是否需要输入验证码？
    if( !BbsUtil.checkReplyPhotoCode({
        form : form,
        codeArea : codeArea,
        codeTipID : '_checkcode_tips',
        codeHTML : BbsUtil.checkcodeReplyHtml,
        codeImgID : 'imgcheckcode'
    }) ){
        return false;
    }

    if(form.checkcode){
        checkcodeValue = form.checkcode.value;
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
                    Dwr.ajaxReplyAlbum(global_threadid, global_boardid, content, checkcodeValue, isCopyToWeibo, function(responseText){
                        //其他错误信息，验证码错误信息
                        if(responseText[0] == '' && responseText[1] == ''){


                            var frmpostSuccess = document.getElementById('frmpostSuccess');
                            if(frmpostSuccess) {
                                //清空编辑器，提示发帖成功，3秒后消失
                                EditorExtend.setContent("");
                                //发表成功链接地址
                                if(responseText[2] != ''){
                                    NTES(frmpostSuccess).NTES('a')[0].href = responseText[2];
                                }
                                frmpostSuccess.style.display = "block";
                                setTimeout(function(){ frmpostSuccess.style.display = "none"; }, 3000);
                                if(form.checkcode) {
                                    form.checkcode.value = '';
                                    BbsPost.checkcodeHide('_checkcode_tips');
                                    BbsUtil.reloadCode();
                                    form.checkcode.value = '';
                                }
                            }

                            BbsUtil.checkcodeTipEmpty(codeArea);

                        } else {
                            // 其他错误信息，验证码错误信息
                            BbsPost.checkcodePopup('_checkcode_tips', responseText[0] + ' ' + responseText[1]);
                            if( responseText[0] != '' ) {
                                BbsUtil.checkcodeTipEmpty(codeArea);
                            } else if ( responseText[1] != '' ) {
                                BbsUtil.reloadCode();
                                form.checkcode.value = '';
                            }
                        }
                        document.getElementById("btnSubmit").style.visibility = "visible";
                    });
                }
            });
        }
    });
    return false;
};

BbsUtil.checkReplyPhoto = function(thumb, threadAuthorPassport){
    // 单张照片，确定的点击数。
    BbsUtil.clickStat("photo_ok");

    if (!BbsCookie.isLogined() && !BoardConfig.isAllowGuestPostThread()) { //未登录
        Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
        return false;
    }

    //内容前端验证
    var content = document.getElementById('replyPhotoContent').value,
        content_len = content.length,
        replyPhotoPrompt = document.getElementById("replyPhotoPrompt"),
        replyPhotoForm = document.getElementById('replyPhotoForm'),
        replyCodeArea = document.getElementById('replyPhotoCodeArea'),
        checkcodeValue = '';


    if(content.trim() == ''){
        if(replyPhotoPrompt){
            replyPhotoPrompt.innerHTML = "内容不能为空";
            replyPhotoPrompt.style.display = "block";
        } else {
            Dialog.alert("内容不能为空");
        }
        return;
    }
    var content_char = content.replace(/[^\x00-\xff]/gi, "aa");
    if(content_char.length >= 65000){
        if(replyPhotoPrompt){
            replyPhotoPrompt.style.display = "block";
            replyPhotoPrompt.innerHTML = "字数过多，请缩减字数";
        }
        return;
    }

    if ( !BbsUtil.checkReplyPhotoCode({
        form : replyPhotoForm,
        codeArea : replyCodeArea,
        codeTipID : 'replyPhotoCodeTips',
        codeHTML : BbsUtil.checkcodePhotoHTML,
        codeImgID : 'replyPhotoCodeImg'
    }) ) {
        //如果检查验证码返回false，这边也返回
        return false;
    }

    if( replyPhotoForm.checkcode ){
        checkcodeValue = replyPhotoForm.checkcode.value;
    }

    //判断是否含有关键字前，需要把提交按钮隐藏，否则会有可能多次重复提交，并且置空验证码区域
    document.getElementById('replyPhotoSubmit').style.visibility = 'hidden';
    replyPhotoPrompt.style.display = 'none';

    Dwr.hasForfendKeyword(global_boardid,global_threadid,'',content,function(data){
        if(data== true){
            BbsAdmin.showDialog('严禁词', '/bbs/dialog/hasforfend.jsp?boardid='+global_boardid+'&threadid='+global_threadid);
            document.getElementById('dialog_close_btn').style.display='none';
        }else{
            Dwr.hasSubtleKeyword(global_boardid,global_threadid,'',content,function(data){
                if(data==true){
                    BbsAdmin.showDialog('敏感词', '/bbs/dialog/hassubtle.jsp?boardid='+global_boardid+'&threadid='+global_threadid);
                }
                else{
                    Dwr.ajaxReplyPhoto(global_threadid, global_boardid, content, checkcodeValue, thumb, threadAuthorPassport, function(responseText){
                        //其他错误信息，验证码错误信息
                        if(responseText[0] == '' && responseText[1] == ''){
                            var replyPhotoSuccess = document.getElementById('replyPhotoSuccess');
                            if(replyPhotoSuccess) {
                                //清空编辑器，提示发帖成功，3秒后消失
                                document.getElementById('replyPhotoContent').value = '';
                                //发表成功链接地址
                                if(responseText[2] != ''){
                                    NTES(replyPhotoSuccess).NTES('a')[0].href = responseText[2];
                                }
                                replyPhotoSuccess.style.display = 'block';
                                window.replyPhotoSuccessTimer = setTimeout(function(){
                                    replyPhotoSuccess.style.display = 'none';
                                    var photoLayoutComment = document.getElementById('photoLayoutComment'),
                                        photoLayout = document.getElementById('photoLayout');
                                    if(photoLayoutComment.style.display != 'none') {
                                        photoLayoutComment.style.display = 'none';
                                        photoLayout.style.display = 'none';
                                    }
                                }, 3000);
                            }

                            BbsUtil.checkcodeTipEmpty(replyCodeArea);
                            document.getElementById('replyPhotoCancel').innerHTML = '关闭';


                        } else if(responseText[0] != '') {
                            replyPhotoPrompt.innerHTML = responseText[0];
                            replyPhotoPrompt.style.display = 'block';

                            BbsUtil.checkcodeTipEmpty(replyCodeArea);
                            document.getElementById('replyPhotoSubmit').style.visibility = 'visible';

                        } else {
                            BbsPost.checkcodePopup('replyPhotoCodeTips', responseText[1]);
                            BbsUtil.reloadCheckcode('replyPhotoCodeImg');
                            replyPhotoForm.checkcode.value = '';
                            document.getElementById('replyPhotoSubmit').style.visibility = 'visible';
                        }
                    });
                }
            });
        }
    });
    return false;
};

/**
 *
 *  改版，新弹窗的JS，替换之前的JS功能
 *
 * @create_date 2012-8-17
 * @last_modified
 * @author Ben Liu
 *
 */

var BbsPatch = {
    "showDialog":function () {
        jQuery(window).trigger('login');
    }
    ,"popup": function(title, url, width) {
        if (!BbsCookie.isLogined()) { //未登录
            this.showDialog();
        } else {
            Dialog.show(title, url, false, false);
            if(typeof(width) == "number" && width){
                Dialog.setWidth(width);
            }
        }
    }
    ,"edit": function (boardid, articleid) {
        if (!BbsCookie.isLogined()) { //未登录
            this.showDialog();  //显示登录框，登录成功后自动回调
        } else {
            Dwr.isLimitThread(boardid,articleid,function(data){
                if(data == true){
                    Dialog.alert("此贴已被限制编辑,请联系管理员取消限制.");
                } else{
                    window.location.href = "/bbs/post.jsp?boardid="+boardid+"&articleid="+articleid;
                }
            })
        }
    }
    ,"msg": function (userid) {
        BbsUtil.clickStat("sendmes");
        if (typeof(userid)=="undefined") {
            userid = "";
        }
        this.popup('发送纸条', '/bbs/dialog/msg_write.jsp?userid='+userid, 600);
    }
    ,"report": function (boardid, threadid, articleid, floor) {
        BbsUtil.clickStat("report");
        this.popup('投诉帖子', '/bbs/dialog/chargepost.jsp?boardid='+boardid+'&threadid=' + threadid + '&articleid='+articleid + "&floor=" +floor);
    }
    ,"gift": function (username, dbname, boardid, threadid,page) {
        if (!BbsCookie.isLogined()) {
            this.showDialog();
            return;
        }
        if(page == undefined || page == null){
            page = 1;
        }
        this.popup("赠送礼物", "/user/gift/toSendGift.do?receiver="+username+"&dbname="+dbname+"&boardid="+boardid+"&threadid="+threadid+"&page="+page);
        Dialog.setWidth(500);
    }
    /**
     * 设为最佳答案
     * @param boardid 版面ID
     * @param articleid 帖子ID
     */
    ,"goodAnswer":function(boardid, articleid) {
        if (!BbsCookie.isLogined()) {
            this.showDialog();
            return;
        }

        if (!confirm("设置后不能再修改，是否确认设为最佳答案?")) {
            return;
        }

        Dwr.setAskGoodAnswer(boardid, articleid, function(data) {
            alert(data);
            document.location.replace(document.location.href+"?a1");
        });
    }
    ,"replyPost" :function(){
        BbsUtil.clickStat("replyout");
        if (!BbsCookie.isLogined() && !BoardConfig.isAllowGuestPostThread()) { //未登录
            this.showDialog();
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
                    BbsPost.checkcodePopup('_checkcode_tips', '验证码还没有输入。');
                    checkcode.focus();
                    return false;
                }
                if (checkcode.value.length != 4) {
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
                    // 图集的图片关系
                    var hiddenField = document.getElementById('photoSetImgUrls');
                    if (hiddenField) {
                        imgUrls = hiddenField.value;
                    }
                    var result = BbsUtil.isWantVerify(false,imgUrls);
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
                    BbsPost.checkcodePopup('_checkcode_tips', photoMsg);
                    remove163Imgs();
                    returnResult = false;
                }

                if (verifyMessage != "") {
                    // ,您发表回复需要输入验证码。
                    var html = BbsUtil.checkcodeHtml;
                    html = format(html,{message:verifyMessage,image:BbsUtil.getCodeJsp()});
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
    }
    // 转发到微博
    ,"forwardToWeibo": function(obj, link){
        var that = obj;
        var src = 'source=' + encodeURIComponent('网易论坛');
        var info = 'info=' + encodeURIComponent(that.getAttribute('title')) + ' ' + encodeURIComponent(link);
        var url = 'link=http://news.163.com/&' + src + '&' + info;
        window.open('http://t.163.com/article/user/checkLogin.do?'+url+'&'+new Date().getTime(),'newwindow','height=330,width=550,top='+(window.screen.height-280)/2+',left='+(window.screen.width-550)/2+', toolbar=no, menubar=no, scrollbars=no,resizable=yes,location=no, status=no');
    }
    // 转发本帖
    ,"forwardCurrentPost": function(obj, clipname){
        var url = window.document.location.href;
        var clipBoardContent = url;
        var that = obj;
        title = that.getAttribute('title')
        if (title != null || title != ""){
            clipBoardContent += '\r\n' + title;;
        }
        BbsUtil.copy_clip(clipBoardContent);
        $(clipname).innerHTML='<a href="javascript:;">复制成功</a>';

        Dwr.copyUrl(title, url, function(data) {});
    }
};

/**
 * JS文件版本检查
 */
var Version = {
    "init":""
    ,"check":function() {
        try {
            if (typeof(js_version) == "string"){
                if (js_version != all_js_version) {
                    this.autoReload();
                }
            }
        }
        catch (e){}
    }
    /**
     *  自动下载新的JS文件，不需要要用户手动刷新
     */
    ,"autoReload":function() {
        var frame = document.createElement("FRAME");
        frame.src = "http://bbs.163.com/bbs/other/reload_js.jsp";

        if (document.frames) {
            document.body.insertAdjacentElement("BeforeBegin",frame);
        }
        else {
            document.body.appendChild(frame);  //
        }
    }
    /**
     * 检查帖子最后回复时间
     * @param threadid
     * @param lastReply
     */
    ,"checkLastReply":function(threadid, pageid, start, size, lastReply, lastFloor) {
        if (1==1) {
            return;
        }
        var host = document.location.host;
        if (!(host=="test.bbs.163.com"
            || host=="bbs.lady.163.com"
            || host=="bbs2.lady.163.com"
            || host=="bbs.news.163.com"
            || host=="club.auto.163.com")){
            return;
        }

        var url = "http://new.fund8.money.163.com/bbs/check_lastreply.jsp?boardid="+global_boardid;
        url += "&threadid="+threadid;
        url += "&pageid="+pageid;
        url += "&start="+start;
        url += "&size="+size;
        url += "&lastreply="+lastReply;
        url += "&lastFloor="+lastFloor;


        var img = new Image();
        img.src = url;


        DwrAlarm.checkLastReply(global_boardid, threadid, lastReply, function(data){
        });
    }
}

var BbsBoardAdmin = {
    "init":""
    ,"load":function() {
        if(this.getMode() == "admin"){
            this.showCheckBox();
            return;
        }
    }

    ,"getList":function() {
        var allList = $("articleRows").getElementsByTagName("input");
        if ( allList == null || typeof(allList)=="undefined" || allList.length ==0) {
            return null;
        }
        else {
            var elements = [];
            for (var i=0; i<allList.length; i++) {
                if (allList[i].type == "checkbox" && allList[i].className=="admin") {
                    elements.push(Element.extend(allList[i]));
                }
            }
            if (elements.length ==0) {
                return null;
            }
            return elements;
        }
    }
    /*
     *判断是否为版主,显示上方的操作按钮
     */
    ,"checkMaster":function(){
        if(!BbsCookie.isLogined()){
            Bbs.showLoginDialog(function(){
                BbsBoardAdmin.checkMaster()
            });
            return;
        }
        //正常模式什么也不做
        if(this.getMode() == "user"){
            this.showCheckBox();
            return ;
        }
        //先本机判断
        else if(this.getMode() == "admin"){
            this.hideCheckBox();
            return;
        }
        else {
            if (this.isMaster()) {
                this.showCheckBox();
            }
            else {
                alert("您“"+BbsCookie.getPassport()+"”不是版面“"+global_boardid+"”的版主，不能使用管理模式.");
                return;
            }
        }
        //登录没有set cookie的情况，服务器判断

    }
    /**
     * 是否版主判断.
     */
    ,"isMaster":function() {
        var flag = false;
        DWREngine.setAsync(false);
        DwrBoardAdmin.isBoardAdmin(global_boardid, function(data){
            flag = data;
        });
        DWREngine.setAsync(true);
        return flag;
    }
    /*
     *设置模式 value=true/false
     */
    ,"setMode":function(flag){
        var value = "y";
        if (!flag ){
            value = "n";
        }
        BbsCookie.setCookie("admin_mode",value,0);
    }
    /*
     *获取模式
     */
    ,"getMode":function(){
        var mode = BbsCookie.getCookie("admin_mode");
        if (mode == "y") {
            return "admin";
        }
        else if (mode == "n") {
            return "normal";
        }
        else {
            return "";
        }
    }
    /**
     * 删除cookie
     */
    ,"delCookie":function() {
        BbsCookie.setCookie("admin_mode", "" ,0);
    }

    /*
     *设置换页时是否显示选择框  value=y/n
     */
    /*
     ,"setShow":function(value){
     BbsCookie.setCookie("show_mode",value,0);
     }
     */
    /*
     *获取是否显示选择框
     */
    /*
     ,"getShow":function(){
     return BbsCookie.getCookie("show_mode");
     }
     */
    /*
     *显示选择框
     */
    ,"showCheckBox":function(){
        var allList = this.getList();
        if (allList != null) {
            for(var i=0;i < allList.length;i++){
                allList[i].style.display = "";
            }
        }
        var boardAdmin = $("boardadmin");
        boardAdmin.style.display="";
        boardAdmin.innerHTML="正常模式";
        boardAdmin.href="javascript:BbsBoardAdmin.hideCheckBox()";
        this.showAdminButton();

    }
    /*
     *隐藏选择框
     */
    ,"hideCheckBox":function(){
        var allList = this.getList();
        if(allList != null){
            for(var i=0;i < allList.length ;i++){
                allList[i].style.display = "none";
            }
        }
        var boardAdmin = $("boardadmin");
        boardAdmin.style.display="";
        boardAdmin.innerHTML="批量删除";
        boardAdmin.href="javascript:BbsBoardAdmin.showCheckBox()";
        this.hideAdminButton();
    }
    /*
     *显示操作按钮
     */
    ,"showAdminButton":function(){
        var adminButton = document.getElementById("adminButton");
        var adminButton_top = document.getElementById("adminButton_top");

        var html = '<div style="text-align:left">';
        html +=	  '<input  type="button" onclick="javascript:BbsBoardAdmin.delArticles();" value="删除"/>';
        html +=   '<input type="button" onclick="javascript:BbsBoardAdmin.selectAll();" value="全选" />';
        html +=   '<input type="button" onclick="javascript:BbsBoardAdmin.reverse();" value="反向选择" />';
        html +=   '</div>';
        adminButton.innerHTML         = html;
        adminButton_top.innerHTML     = html;
        adminButton.style.display     = "";
        adminButton_top.style.display = "";

        this.setMode(true);
    }
    /*
     *隐藏操作按钮
     */
    ,"hideAdminButton":function(){
        var adminButton = document.getElementById("adminButton");
        var adminButton_top = document.getElementById("adminButton_top");
        adminButton.style.display     = "none";
        adminButton_top.style.display = "none";
        this.setMode(false);
    }

    /*
     *全部选择
     */
    ,"selectAll":function(){
        var articleList = this.getList();
        for(var i =0;i < articleList.length ;i++){
            articleList[i].checked=true;
        }
    }
    /*
     *反向选择
     */
    ,"reverse":function(){
        var articleList = this.getList();
        for(var i =0;i < articleList.length ;i++){
            articleList[i].checked = !articleList[i].checked;
        }
    }

    /*
     *删除所选
     */
    ,"delArticles":function(){
        //确认
        if(!window.confirm("是否确认删除")){
            return false;
        }
        //得到要删除的列表
        var delList =  new Array();						//要删除的文章
        var allList = this.getList();

        if(allList == null  ){
            alert("当前列表没有帖子");
            return;
        }
        var j = 0;
        for(var i = 0; i < allList.length;i++){
            if(allList[i].className=="admin" && allList[i].checked){
                delList[j] = allList[i].value;
                j++;
            }
        }

        if  (delList == null || delList.length==0) {
            alert("您没有选中要删除的帖子.");
            return;
        }

        //删除文章
        DwrBoardAdmin.delArticle(delList,function(data){
            //回调函数，隐藏删除的文章
            var allList = BbsBoardAdmin.getList();			//拿到所有文章的列表
            var articleids = data.split(", ");

            for(var i = 0; i < articleids.length; i++){
                if(articleids[i] != null && articleids[i].length > 0){
                    BbsBoardAdmin.displayArticle(allList, articleids[i]);
                }
            }


            allList = BbsBoardAdmin.getList();
            if (allList == null) {
                window.location.reload();
            }
        });
    }
    /*
     *隐藏删除项
     */
    ,"displayArticle":function(list,articleid){
        for(var i=0;i<list.length;i++){
            if	(list[i].value.indexOf("/"+articleid) > 0){
                var row = list[i].parentNode.parentNode;
                try {
                    row.style.display = "none";
                    row.outerHTML = "";
                }
                catch(e) {
                    row.innerHTML = "";
                }
            }
        }
    }



}

/**
 * 下拉框操作
 */
var ChangeSelect = {
    "init":""
    /**
     * 加载下拉框内容.
     *
     * @param select 下拉框对象
     * @param url    网址
     * @param defvalue 默认选中项的值
     * @param firstOption 下拉框第一项，可选
     */
    ,"load":function(select, url, defvalue, firstOption) {
        //使用GET方式会有缓存问题，所以要使用POST
        new Ajax.Request(url, {method: 'GET', onComplete:function(data){
            var xml = data.responseXML;
            if (xml == null) {
                return;
            }
            var nodes = xml.getElementsByTagName("row");

            DWRUtil.removeAllOptions(select);

            var hasFirst = firstOption!=null && typeof(firstOption) != "undefined";
            if (hasFirst) {
                try {
                    select.add(firstOption);
                }
                catch (e) {
                    select.appendChild(firstOption);
                }
            }

            var selectedIndex = 0;
            //document.title = document.title + selectedIndex;
            for (i=0;i<nodes.length; i++) {
                var node = nodes[i];

                var id   = MyXml.getValue(node, "id");
                var name  = MyXml.getValue(node, "name");
                try {
                    select.add(new Option(name, id));
                }
                catch (e) {
                    select.appendChild(new Option(name, id));
                }
                if (defvalue == id) {
                    if (hasFirst) {
                        selectedIndex = i+1;
                    }
                    else {
                        selectedIndex = i;
                    }
                }
            }
            select.selectedIndex = selectedIndex;
        }});
    }
}


/**
 * Author: 阿海
 */

var Drag = {
    "obj" : null,
    "init" : function(a, aRoot) {
        a.onmousedown = Drag.start;
        a.root = aRoot;
        if (isNaN(parseInt(a.root.style.left)))
            a.root.style.left = "0px";
        if (isNaN(parseInt(a.root.style.top)))
            a.root.style.top = "0px";
        a.root.onDragStart = new Function();
        a.root.onDragEnd = new Function();
        a.root.onDrag = new Function();
    },
    "start" : function(a) {
        var b = Drag.obj = this;
        a = Drag.fixE(a);
        var c = parseInt(b.root.style.top);
        var d = parseInt(b.root.style.left);
        b.root.onDragStart(d, c, a.clientX, a.clientY);
        b.lastMouseX = a.clientX;
        b.lastMouseY = a.clientY;
        document.onmousemove = Drag.drag;
        document.onmouseup = Drag.end;
        return false;
    },
    "drag" : function(a) {
        a = Drag.fixE(a);
        var b = Drag.obj;
        var c = a.clientY;
        var d = a.clientX;
        var e = parseInt(b.root.style.top);
        var f = parseInt(b.root.style.left);
        var h, g;
        h = f + d - b.lastMouseX;
        g = e + c - b.lastMouseY;
        b.root.style.left = h + "px";
        b.root.style.top = g + "px";
        b.lastMouseX = d;
        b.lastMouseY = c;
        b.root.onDrag(h, g, a.clientX, a.clientY);
        return false;
    },
    "end" : function() {
        document.onmousemove = null;
        document.onmouseup = null;
        Drag.obj.root.onDragEnd(parseInt(Drag.obj.root.style.left),
            parseInt(Drag.obj.root.style.top));
        Drag.obj = null;
    },
    "fixE" : function(a) {
        if (typeof a == "undefined")
            a = window.event;
        if (typeof a.layerX == "undefined")
            a.layerX = a.offsetX;
        if (typeof a.layerY == "undefined")
            a.layerY = a.offsetY;
        return a;
    }
};

Object.printAll = function(obj) {
    var msg = "";
    var i = 0;
    for (dd in obj) {
        msg += dd + "  ";
        if ((i + 1) % 5 == 0) {
            msg += "\n";
        }
        i++;
    }
    alert(msg);
}

var Dialog = {
    "init" : "",
    "dialogBox" : null,
    "defWidth" : 400,
    "width" : 0,
    "height" : 400,

    "basePath" : "",

    "setBasePath" : function(url) {
        this.basePath = url;
    },

    "parseUrl" : function(url) {
        if (this.basePath == "") {
            return url;
        }
        if (url.substring(0, 7) == "http://") {
            return url;
        }

        var basePath;
        if (this.basePath.substring(this.basePath.length-1)=="/") {
            basePath = this.basePath.substring(0, this.basePath.length-1);
        }
        else {
            basePath = this.basePath;
        }
        var firstChar = url.substring(0);
        if ("/" == firstChar) {
            url = basePath + url;
        } else {
            url = basePath + "/" + url;
        }
        return url;
    },

    /**
     * 显示窗口
     *
     * @param title
     *            窗口标题
     * @param url
     *            窗口内容页面的URL
     * @param loadCss
     *            是否加载CSS
     * @param loadJs
     *            是否加载JS
     */
    "show" : function(title, url, loadCss, loadJs) {
        if (this.dialogBox==null) {
            // 窗口不存在，自动创建
            this.create();
        }

        this.setWidth(this.defWidth); // 默认宽度

        this.dialogBox.style.display = "block"; // 显示窗口

        this.setTitle(title); // 设置标题

        this.loading = setTimeout("Dialog.setLoading()", 200); // 200毫秒内数据没有加载就会显示“数据加载中...”

        Drag.init(document.getElementById("draghead"), this.dialogBox);

        this.dialogBox.onDragEnd = function(x, y) {
            Dialog.dialogBox.ox = x - Dialog.getRange().left;
            Dialog.dialogBox.oy = y - Dialog.getRange().top;
        }
        this.center(); // 当浏览器不是在第一屏的位置显示窗口会看不见，所以要让它自动在当前屏幕的中间显示

        url = this.parseUrl(url);
        this.loadContent(url, loadCss, loadJs); // 加载窗口内容
    },
    "alert":function(content) {
        //this.showContent("系统提示", content);
        alert(content);
    },
    "showContent" : function(title, content) {
        if (this.dialogBox == null) {
            // 窗口不存在，自动创建
            this.create();
        }

        this.setWidth(this.defWidth); // 默认宽度

        this.dialogBox.style.display = "block"; // 显示窗口

        this.setTitle(title); // 设置标题



        Drag.init(document.getElementById("draghead"), this.dialogBox);

        this.dialogBox.onDragEnd = function(x, y) {
            Dialog.dialogBox.ox = x - Dialog.getRange().left;
            Dialog.dialogBox.oy = y - Dialog.getRange().top;
        }
        this.center(); // 当浏览器不是在第一屏的位置显示窗口会看不见，所以要让它自动在当前屏幕的中间显示
        var html = '<div class="dialogBox_Content">';
        html += '<h5 style="font-size:16px; font-weight:normal; clear:both; line-height:24px;">';
        html += content + '</h5>';

        $("dialogBox_content").innerHTML = html;
    },
    "setWidth" : function(width) {
        if (width != this.width) {
            this.width = width;
            this.dialogBox.style.width = width + "px";
            this.center();
        }

    },

    "setHeight" : function(height) {
        if (height != this.height) {
            this.height = height;
        }
    },

    "loading" : null,

    "setLoading" : function() {
        this.setContent("数据加载中...");
    },

    "clearLoading" : function() {
        if (this.loading != null) {
            clearTimeout(this.loading);
            this.loading = null;
        }
    },

    /**
     * 加载窗口内容
     */
    "loadContent" : function(url, loadCss, loadJs) {
        var time = "?" + (new Date().getTime());

        /**
         * 使用GET方式会有缓存问题，所以要使用POST
         */
        new Ajax.Request(url, {
            method : 'get',
            requestHeaders : [ "If-Modified-Since", "0" ],
            onComplete : function(obj) {

                Dialog.clearLoading()

                /**
                 * this.setContent("数据加载中...");//须将内容清空，否则有时会发生IE崩溃的情况(目前发现修改文章时会发生)
                 */
                $("dialogBox_content").innerHTML = (obj.responseText);
                if (loadCss) {
                    Dialog.loadCss(url + ".css");
                }

                if (loadJs) {
                    Dialog.loadJs(url + ".js");
                }
            }
        });
    },

    /**
     * 设置窗口内容（提示信息）.
     */
    "setContent" : function(content) {
        document.getElementById("dialogBox_content").innerHTML = "<div class='dialogBox_Content'>"
            + content + "</div>";
    },

    /**
     * 关闭窗口
     */
    "close" : function() {

        if (this.dialogBox != null) {
            this.dialogBox.style.display = "none";
        }
    },

    /**
     * 设置窗口的标题
     *
     * @html 窗口的标题，支持HTML
     */
    "setTitle" : function(html) {
        document.getElementById("dialogBox_title").innerHTML = html;
    },

    /**
     * 创建窗口
     */
    "create" : function() {
        this.loadCss("http://img1.cache.netease.com/bbs/css/dialog.css");
        var dialogBox = document.createElement("DIV");
        dialogBox.id = "dialogBox";
        dialogBox.className = "dialogBoxBg";
        var html = '<div class="dialogBox" style="cursor:pointer"><div id="draghead" class="title"><h2 id="dialogBox_title"></h2><span><a id="dialog_close_btn" href="javascript:Dialog.close()" target="_self"><img src="http://bbs.163.com/bbs/dialog/login01_div.gif" style="cursor:pointer" height="18" width="49" border="0" /></a></span></div><div class="content" id="dialogBox_content"></div></div>';
        dialogBox.innerHTML = html;

        document.body.appendChild(dialogBox);

        this.dialogBox = document.getElementById("dialogBox");

        this.center(); // 设置窗口位置

        this.addScrollEvent(Dialog.onBodyScroll);
    },

    /**
     * 加载CSS
     */

    "loadCss" : function(filename) {
        var head = document.getElementsByTagName('HEAD').item(0);
        var style = document.createElement('link');
        style.href = filename;
        style.rel = 'stylesheet';
        style.type = 'text/css';
        head.appendChild(style);
    },

    /**
     * 加载JS
     *
     * @param filename
     *            脚本URL
     */
    "loadJs" : function(filename) {
        /**
         * 应该将filename MD5编码后作为ID使用
         */
        var script = document.getElementById("js1");
        if (script == null) {
            script = document.createElement("script");
        } else if( document.getElementById("loginDialog") ){
            script.parentNode.removeChild(script);
            script = document.createElement("script");
        }

        script.id = "js1";
        script.src = filename;

        /**
         * 为什么要使用insertAdjacentElement？
         * 因为appendChild在JS文件已经存在浏览器缓存时就会出现IE崩溃的情况(Bbs.editArticle方法就会出现,postArticle则正常)
         */
        if (document.frames) {
            document.body.insertAdjacentElement("BeforeBegin", script);
        } else {
            document.body.appendChild(script);
        }
    },

    "onBodyScroll" : function() {
        var range = Dialog.getRange();
        var top = (range.top + Dialog.dialogBox.oy);
        var left = (range.left + Dialog.dialogBox.ox);
        if (top < 5) {
            top = 5;
        }
        if (left < 5) {
            left = 5;
        }

        Dialog.dialogBox.style.top = top + "px";
        Dialog.dialogBox.style.left = left + "px";

        if (typeof (Passport) != "undefined" && Passport != null) {
            var ds = document.getElementById("passportusernamelist");
            if (ds != null && typeof (ds) == "object") {
                Passport.resizeFunc();
            }

        }
    },

    /**
     * 设置窗口居中显示
     */
    "center" : function() {
        var range = Dialog.getRange();

        var position = this.getPosition();

        var left = (range.width - position.width) / 2;
        var top = (range.height - position.height) / 2;

        this.dialogBox.ox = left;
        this.dialogBox.oy = top;

        if (range.left > left) {
            left = range.left + left;
        }
        if (range.top > top) {
            top = range.top + top;
        }

        this.dialogBox.style.left = left + "px";
        this.dialogBox.style.top = top + "px";
    },

    /**
     * 设置窗口居中显示
     */
    "center_bak" : function() {
        var range = Dialog.getRange();

        var left = (range.width - this.width) / 2;
        var top = (range.height - this.height) / 2;

        this.dialogBox.ox = left;
        this.dialogBox.oy = top;

        if (range.left > left) {
            left = range.left + left;
        }
        if (range.top > top) {
            top = range.top + top;
        }

        this.dialogBox.style.left = left + "px";
        this.dialogBox.style.top = top + "px";
    },

    /**
     * 移动窗口位置
     *
     * @left
     * @top
     */
    "move" : function(left, top) {
        this.dialogBox.ox = left;
        this.dialogBox.oy = top;

        this.dialogBox.style.left = left + "px";
        this.dialogBox.style.top = top + "px";
    },

    /**
     * 判断窗口是否创建过
     */
    "isCreated" : function() {
        return (this.dialogBox == null);
    },

    "getPosition" : function() {
        if (this.dialogBox == null) {
            return {
                top : 0,
                left : 0,
                height : this.height,
                width : this.width
            };
        }
        var top = this.dialogBox.offsetTop;
        var left = this.dialogBox.offsetLeft;
        var width = this.dialogBox.offsetWidth;
        var height = this.dialogBox.offsetHeight;

        if (height < this.height) {
            height = this.height;
        }

        return {
            top : top,
            left : left,
            height : height,
            width : width
        };
    },
    "getRange" : function() {
        var top = document.documentElement.scrollTop;
        var left = document.documentElement.scrollLeft;
        var height = document.documentElement.clientHeight;
        var width = document.documentElement.clientWidth;

        if (top == 0) {
            top = document.body.scrollTop;
        }
        if (left == 0) {
            left = document.body.scrollLeft;
        }
        if (height == 0) {
            height = document.body.clientHeight;
        }
        if (width == 0) {
            width = document.body.clientWidth;
        }
        return {
            top : top,
            left : left,
            height : height,
            width : width
        };
    },
    "addScrollEvent" : function(func) {
        var oldonscroll = window.onscroll;
        if (typeof window.onscroll != "function") {
            window.onscroll = func;
        } else {
            window.onscroll = function() {
                oldonscroll();
                func();
            }
        }
    },
    "addResizeEvent" : function(func) {
        var oldonresize = window.onresize;
        if (typeof window.onresize != "function") {
            window.onresize = func;
        } else {
            window.onresize = function() {
                oldonresize();
                func();
            }
        }
    }
}

var Request = {
    "init":""

    ,"getParameter":function(name) {
        var url = document.location.href;
        var start = url.indexOf("?")+1;
        if (start==0) {
            return "";
        }
        var value = "";
        var queryString = url.substring(start);
        var paraNames = queryString.split("&");
        for (var i=0; i<paraNames.length; i++) {
            if (name == this.getParameterName(paraNames[i])) {
                value = this.getParameterValue(paraNames[i])
            }
        }
        return value;
    }
    ,"getParameterName":function(str) {
        var start = str.indexOf("=");
        if (start==-1) {
            return str;
        }
        return str.substring(0,start);
    }

    ,"getParameterValue":function(str) {
        var start = str.indexOf("=");
        if (start==-1) {
            return "";
        }
        return str.substring(start+1);
    }
}

/**
 * 版面信息相关JS
 */
var BoardUtil = {
    "init":""

    /**
     * 加载版面列表
     */
    ,"objId":"selectBoardid"
    ,"dbname":""

    ,"loadBoardList":function(dbname, pid, selectDefault) {
        this.dbname = dbname;

        Dwr.loadBoardList(dbname, '', function(data) {
            DWRUtil.removeAllOptions(BoardUtil.objId);
            //DWRUtil.addOptions('selectBoardid', data);

            var ele = $(BoardUtil.objId);
            for (var boardid in data) {
                var info = data[boardid];

                var hasChild = info['hasChild'];
                var name = info['name'];

                var option = new Option(name, boardid);
                option.hasChild = hasChild;


                ele.options[ele.options.length] = option;
            }
            if (selectDefault) {
                BoardUtil.selectDefault();
            }
        });
    }

    ,"hasChild":function(selectedIndex) {
        var ele = $(BoardUtil.objId);
        var option = ele.options[selectedIndex];
        var hasChild = option.hasChild;
        return (hasChild == 'true');
    }

    ,"selectDefault":function() {
        var ele = $(BoardUtil.objId);
        var boardid = "";
        if (ele.options.length > 0) {
            boardid = ele.options[0].value;
            this.changeBoard(boardid, 0);
        }
        $('destBoardid').value = boardid;
    }

    ,"changeBoard":function(boardid, selectedIndex ) {
        $('destBoardid').value = boardid;

        var childId = BoardUtil.objId+"Child";
        var hasChild = BoardUtil.hasChild(selectedIndex);
        if (hasChild) {
            if (this.dbname == "") {
                this.dbname = $('destDbname').value;
            }
            Dwr.loadBoardList(this.dbname, boardid, function(data) {
                DWRUtil.removeAllOptions(childId);

                var ele = $(childId);
                var option = new Option("默认", boardid);
                option.hasChild = hasChild;
                ele.options[ele.options.length] = option;

                DWRUtil.addOptions(childId, data, "boardid", "name");
            });



            $(childId).style.display = '';
        }
        else {
            $(childId).style.display = 'none';
        }
    }
}


var BbsSearch = {
    "init":""
    ,"showMenu":function() {
        var menu = $("searchMenu");
        if (menu.style.display == "none") {
            menu.style.display = "block";
        }
        else {
            menu.style.display = "none";
        }
    }
    ,"getForm":function() {
        return document.forms["search"];
    }
    /**
     * 版内搜索
     */
    ,"inner":function() {
        var form = this.getForm();
        form.target = "_blank";
        //form.action = "/bbs/list.jsp";


    }
    /**
     * 全论坛搜索
     */
    ,"global":function() {
        var form = this.getForm();
        form.target = "_blank";
        $("searchRan").value = "bbs";
        $("boardid").value = "";
        //form.action = "/bbs/search/search.jsp";
    }




}



/**
 *重载BbsUtil.showAdminButton,显示操作按钮
 */
BbsBoardAdmin.showAdminButton = function(){
    var adminButton_top = document.getElementById("adminButton_top");
    var adminButton = document.getElementById("adminButton");

    var html = '<input type="button" onclick="javascript:BbsBoardAdmin.delArticles();" value="删除" />';
    html += '<input type="button" onclick="javascript:BbsBoardAdmin.selectAll();" value="全选" />';
    html += '<input type="button" onclick="javascript:BbsBoardAdmin.reverse();" value="反向选择" />';

    adminButton_top.innerHTML     = html;
    adminButton_top.style.display = "";
    adminButton.innerHTML     = html;
    adminButton.style.display = "";

    this.setMode(true);
}

/**
 *重载BbsUtil.hideAdminButton,隐藏操作按钮
 */
BbsBoardAdmin.hideAdminButton = function(){
    var adminButton_top = document.getElementById("adminButton_top");
    var adminButton = document.getElementById("adminButton");

    adminButton_top.style.display = "none";
    adminButton.style.display = "none";

    this.setMode(false);
}

/**
 *重载BbsUtil.showLoginInfo方法,显示登录按钮或登录信息
 */
BbsUtil.showLoginInfo = function(){
    var obj = document.getElementById("myLoginButton");

    //if(obj==null||obj=="undefine"){
    //    return this.showLoginInfo();
    //}
    var mylinkObj = document.getElementById("myLink");

    if(mylinkObj==null||mylinkObj=="undefine"){
        return this.showLoginButton();
    }
    var html = ""
    var mylinkHTML = "";
    if(BbsCookie.isLogined()){
        //Userinfo.loadUserinfo();
        var username = BbsCookie.getPassport();

        var mode = BbsCookie.getCookie("admin_mode");//当前模式,管理模式或者正常模式.
        if (typeof(noNicknameInfo) == "undefined") {
            html += ('<a class="cRed" href="http://bbs.163.com/user/'+username+'" target="_blank" >'+Userinfo.getNickname()+'</a>');
        }

        var messageCount = Userinfo.getMessageCount();
        if(messageCount < 0){
            messageCount = 0;
        }

        html += ' | <a href="http://bbs.163.com/user/profile.do?pageType=msg" target="_blank">短消息</a>(<a href="http://bbs.163.com/sns/msg_sns.jsp" target="_blank" style="color:red">'+messageCount+'</a>) | <a href="http://help.3g.163.com/bbs/" target="_blank">手机版</a> ';
        //html += ' | <a href="javascript:Bbs.showMessage()" target="_self">短消息</a>(<a href="javascript:Bbs.showMessage()" target="_self" style="color:red">'+messageCount+'</a>)';
        html += ' | <span onclick="BbsList.toggle(\'myLink\')"><a class="dArrow">我的信息</a></span>';

        //html += ' | <a href="javascript:editMyInformation(\'' + username + '\');" class="dArrow">修改资料</a>';

        if(filename=="list"){
            html += ' | <a onclick="BbsList.toggle(\'myLink2\')"  style="cursor:pointer"  class="dArrow">管理模式</a>';
        }
        else{
            html += '<span id="boardadmin_span"> | <a href="http://bbs.news.163.com/list/tyro.html" id="boardadmin">论坛帮助</a></span>';
        }
        html += ' | <a href="javascript:Bbs.logout()" target="_self">退出</a>';




        mylinkHTML += '<h5><a href="http://bbs.163.com/user/'+username+'" onclick="BbsList.toggle(\'myLink\')" target="_blank">我的信息</a></h5>';
        mylinkHTML += '<h5><a href="http://bbs.163.com/bbs/sns/my_post_list1.jsp?username='+username+'&boardid='+global_boardid+'" onclick="BbsList.toggle(\'myLink\')" target="_blank">本版发帖</a></h5>';
        mylinkHTML += '<h5><a href="http://bbs.163.com/bbs/sns/my_reply_list1.jsp?username='+username+'&boardid='+global_boardid+'" onclick="BbsList.toggle(\'myLink\')" target="_blank">本版回复</a></h5>';

        mylinkObj.innerHTML = mylinkHTML;
    }
    else{
        html += '[<a href="javascript:Bbs.showLoginDialog(BbsUtil.reloadPage)" target="_self" class="aLogin">登录</a>] <a href="http://bbs.news.163.com/list/tyro.html" target="_blank">帮助</a> <a href="http://help.3g.163.com/bbs/" target="_blank">手机版</a>';
    }

    if (obj) {
        obj.innerHTML = html;

        if (filename == "list"){
            //管理模式按钮
            try{
                BbsBoardAdmin.load();
            } catch (e){}
        }
    }

}

//editMyInformation=function(username){
//Dialog.loadCss("/bbs/sns/img/pinfo.css");
//BbsAdmin.showDialog("修改个人信息","/sns/dialog/userinfo.jsp?username=" + username);	
//}




var BbsList = {
    "init":function(){
        //if(!BbsCookie.isLogined()){
        //    BbsBoardAdmin.setMode(false);
        //}
        //BbsUtil.showLoginInfo();
        Userinfo.loadUserinfo();
    }

    ,"toggle":function(objId){
        obj=document.getElementById(objId);
        obj.style.display=(obj.style.display=="")?"none":"";
    }

    ,"changeIframe":function(){
        BbsList.toggle("leftBar");
        var imgObj=document.getElementById("changeImg");
        var main=document.getElementById("mainArea");
        imgObj.src=(imgObj.src.indexOf("left")!=-1)?imgObj.src.replace('left','right'):imgObj.src.replace('right','left');
        main.style.marginLeft=(main.style.marginLeft=='0px')?"145px":"0px";

    }

    ,"onTabChange":function(hrefpre,divpre,idx,maxidx)
    {
        var i=1;
        while(i<=maxidx)
        {
            if (i!=idx)
            {
                href_obj = document.getElementById(hrefpre + i);
                if (href_obj != null){
                    href_obj.className = "";
                }
                div_obj = document.getElementById(divpre + i);
                if (div_obj != null){
                    div_obj.style.display = "none";
                }
            }
            i = i + 1;
        }
        href_obj = document.getElementById(hrefpre+idx);
        if ( href_obj != null ){
            href_obj.className = "active";
        }
        div_obj = document.getElementById(divpre + idx);
        if (div_obj != null){
            div_obj.style.display = "block";
        }
    }
}



/**
 * 简洁版面
 */
var BbsSimple = {
    "init":function() {
        var url = document.location.href;
        if (url.indexOf(".html")==-1) {
            return;
        }



        if (url.indexOf("/simple/")>0) {
            try {
                BbsList.changeIframe();//隐藏左侧导航栏
            }
            catch (e){}

            this.hideHeader();
            this.hideFooter();
            this.hideFloatLayer();
            return;
        }
        else if (url.indexOf("/noheader/") > 0) {
            this.hideHeader();
            return;
        }
        else if (url.indexOf("/nofooter/") > 0) {
            this.hideFooter();
            return;
        }
        else if (url.indexOf("/nofloatlayer/") > 0) {
            this.hideFloatLayer();
            return;
        }

    }

    ,"hideHeader":function() {
        var obj = $("boardHeader");
        if (obj != null) {
            obj.style.display = "none";
        }
    }
    ,"hideFooter":function() {
        var obj = $("footer");
        if (obj != null) {
            obj.style.display = "none";
        }
    }

    ,"hideFloatLayer":function() {
        var obj = $("floatLayer");
        if (obj != null) {
            obj.style.display = "none";
        }
    }
}


var BbsLeft = {

    "init":function() {
        var channel = Bbs.getChannel();

        var channelid = channel;

        var callback = null;
        //if(channel == "bj"){
        //北京论坛
        // channelid = "local";
        // callback = function() {
        // BbsLeft.showDiv("local1217");
        //}
        //}
        if(channel == "news"){
            //新闻地方论坛
            if (global_boardid.indexOf("local")==0) {
                channelid = "local";
            }

        }
        if(channel == "2010"){
            //新闻地方论坛
            channelid = "sports";
        }

        if(channel == "service"){
            this.show_channel("service", callback);
        }else{
            this.show_channel("service", callback);
            this.show_channel(channelid, callback);
        }
    }

    ,"show_channel":function (channelid, callback){
        if ("myCollection" == channelid) {
            return this.showMyFavorite();
        }

        if ($(channelid) == null) {
            return;
        }

        if (pageChannel != "dream") {//梦幻人生论坛不移动		  
            if($(channelid).style.display == "none"&& $("out_"+channelid).previous().readAttribute("tindex") != 2){
                this.move(channelid);
            }
        }

        var channel = $(channelid);//频道内容DIV
        var _channel = $("ch_"+channelid);//频道显示h3

        if(channel == null && typeof(channel) == "undefined"){//菜单项不存在
            return;
        }
        if(channel.style.display == "block"){//菜单收缩
            channel.style.display = "none";
            _channel.className = "";
        }
        else if(channel.style.display == "none" && channel.innerHTML !=""){//如果已加载出来,菜单直接显示
            channel.style.display = "block";
            _channel.className = "active";
        }
        else{//未加载出来,加载菜单项并显示
            var url = "/htmlfile/left/" + channelid +"_child.htm";
            channel.style.display = "block";
            channel.innerHTML = "<h4>数据加载中...</h4>";
            new Ajax.Request(url, {
                method: 'get',
                requestHeaders:["If-Modified-Since","0"],
                onComplete: function(data) {
                    var content = (data.responseText);
                    channel.innerHTML = content;
                    _channel.className = "active";

                    if (callback != null && (typeof(callback) == "function" || typeof(callback) == "object")) {
                        callback();
                    }

                }
            });
        }
    }

    ,"move":function(channelid){
        var channel = $("out_"+channelid);//菜单outerHTML
        var tindex = channel.readAttribute("tindex");//当前菜单项的标志位
        var channelHTML = '<div class="tselector" tindex="'+tindex+'" id="out_'+channelid+'">'+channel.innerHTML+'</div>';
        //$(content).value = channelHTML;
        var target_channel = $("out_myset");
        if(tindex <= 2) return;
        if(tindex > 2){//菜单调移位
            var next_channel = target_channel.next();//目标位置下一个元素
            for(var i = 0; i < next_channel.childNodes.length; i++){//收缩元素
                if(next_channel.childNodes[i].nodeType == 1){
                    if(next_channel.childNodes[i].nodeName == "H3"){
                        next_channel.childNodes[i].className = "";
                    }
                    if(next_channel.childNodes[i].nodeName == "DIV"){
                        next_channel.childNodes[i].style.display = "none";
                    }
                }
            }

            var next_channel_tindex = next_channel.readAttribute("tindex");
            if(next_channel_tindex != 3){//目标位置是否已移位过
                var next_channel_outerHTML = '<div class="tselector" tindex="'+next_channel_tindex+'" id="'+next_channel.readAttribute("id")+'">'+next_channel.innerHTML+'</div>';
                //alert(next_channel_outerHTML);
                //$(content).value += next_channel_outerHTML;
                next_channel.remove();
                ;
                var trees = $("leftMenu").getElementsByClassName('tselector');
                for(var i = 0; i < trees.length; i++){
                    var index = trees[i].readAttribute("tindex");
                    if(index == next_channel_tindex-1){
                        new Insertion.After(trees[index], next_channel_outerHTML);
                        break;
                    }
                }
            }
            channel.remove();
            new Insertion.After(target_channel, channelHTML);
            document.documentElement.scrollTop = 0;
        }
    }

    ,"showDiv":function (nodeid){
        var node = $(nodeid);
        if (node == null) {
            //alert(nodeid+"不存在.");
            //return;
        }
        var display = node.style.display;
        var img = $("img_"+nodeid);
        if(display=="none"){
            node.style.display="block";
            if(img != null && typeof(img) != "undefined"){
                img.src="/bbs/img/b.gif";
            }
        }
        if(display=="block"){
            node.style.display="none";
            if(img != null && typeof(img) != "undefined"){
                img.src="/bbs/img/a.gif";
            }
        }
    }
    /**
     * 显示或隐藏我的收藏
     */
    ,"showMyFavorite":function() {
        if(!BbsCookie.isLogined()) {
            Bbs.showLoginDialog(true);
            return;
        }
        var channel = $("myCollection");
        var channelChild = $("ch_myCollection");
        if (channel.style.display == "none") {
            channel.style.display = "block";
            channelChild.className = "active";
            BbsLeft.loadMyFavorite();
        }
        else {
            channel.style.display = "none";
            channelChild.className = "";
        }
    }
    /**
     * 加载我的收藏
     */
    ,"loadMyFavorite":function() {
        var url = "/bbs/my_favorite.inc.jsp";
        new Ajax.Request(url,{onComplete:function(data){
            var content = (data.responseText);
            if (data.status==200) {
                $("myCollection").innerHTML = content;
            }
            else {
                alert("请求出错.");
            }
        }});
    }


}

var channel_db_map = [["bbs.news.163.com","news"],["bbs2.news.163.com","news"]
    ,["bbs3.news.163.com","news"],["bbs4.news.163.com","news"]
    ,["bbs5.news.163.com","news"],["bbs6.news.163.com","news"]
    ,["bbs7.news.163.com","news"],["bbs8.news.163.com","news"]
    ,["bbs9.news.163.com","news"],["bbs.lady.163.com","lady"]
    ,["bbs2.lady.163.com","lady"],["bbs.talk.163.com","talk"]
    ,["guba.money.163.com","stock"],["fund8.money.163.com","stock"]
    ,["bbs.stock.163.com","stock"] ,["bbs.culture.163.com","culture"]
    ,["club.auto.163.com","auto"],["bbs.travel.163.com","travel"]
    ,["club.tech.163.com","mobile"],["bbs.tech.163.com","tech"]
    ,["digibbs.tech.163.com","digi"],["bbs.biz.163.com","biz"]
    ,["bbs.2008.163.com","2008"],["bbs.sports.163.com","sports"]
    ,["bbs2.sports.163.com","sports"],["bbs.edu.163.com","education"]
    ,["bbs.ent.163.com","ent"],["bbs.bj.163.com","local"]
];

//var cur_channel = $(pageChannel);


// if(cur_channel != null && typeof(cur_channel) != "undefined"){

//  BbsLeft.show_channel(pageChannel);
// }

//	var cur_host = window.location.host;
//  var timer_1 ;
//	for(var i = 0;i<channel_db_map.length;i++){
//if(cur_host == channel_db_map[i][0]){
//			BbsLeft.show_channel(channel_db_map[i][1]);
//if(channel_db_map[i][1]=="local"){
//timer_1 = setTimeout('BbsLeft.showDiv("local1217")',1000);
//}
//break;
//}
//}


var BbsProfile = {
    "init" : "",

    "addBoard" : function(boardid) {

    }
}

BbsProfile.VisitHistory = {
    "init" : "",
    /**
     * cookie名称
     */
    "cookieName" : "board_history",

    "setCookie" : function(name, value) {
        /* cookie过期时间 */
        var expires = 60 * 60 * 1000 * 7;
        /* 版面访问记录在个人页使用 */
        var domain = "163.com";
        var value = name + "=" + escape(value);
        if (expires > 0) {
            value += ";expires=" + BbsCookie.getExpires(expires).toGMTString();
        }
        value += ";path=/;domain=" + domain;
        document.cookie = value;
    },
    "splitString":function(content) {
        if (content == null || content == "") {
            return null;
        }
        var lastChar = content.charAt(content.length-1);
        if (lastChar == ",") {
            content = content.substring(0, content.length-1);
        }
        var list = content.split(",");
        return list;
    },
    /**
     * 添加访问记录
     */
    "addHistory" : function(boardid) {
        if (boardid == null || boardid == "") {
            return;
        }

        /* 最大记录的版面数量 */
        var maxHistorySize = 4;

        var content = BbsCookie.getCookie(this.cookieName);

        var list = new Array();
        var name = this.getBoardName(boardid)

        if (content == null) {
            content = "";
        }
        else {
            content = content.replace(boardid + ":" + name + ",", "");
            list = this.splitString(content);
            content = "";
        }
        if (list != null) {
            for (var i=0; i<list.length && i<(maxHistorySize-1); i++) {
                content += list[i] + ",";
            }
        }
        content = boardid + ":" + name + "," + content;
        this.setCookie(this.cookieName, content);
    },
    /**
     * 获取访问记录
     */
    "getHistoryBoardid" : function() {
        var content = BbsCookie.getCookie(this.cookieName);
        if (content != null && content != "") {
            var list = this.splitString(content);
            return list;
        } else {
            return null;
        }
    },
    /**
     * 获取访问记录详细信息
     *
     */
    "getHistoryInfo" : function() {
        var boardids = this.getHistoryBoardid();
        if (boardids == null) {
            return null;
        }

        var boardList = {};

        for (var i=0; i<boardids.length; i++) {
            var arr = boardids[i].split(":");
            var boardid = arr[0];
            var name = arr[1];
            boardList[boardid] = name;
        }
        return boardList;
    }
    ,"getBoardName":function(boardid) {
        if (typeof(HOT_VISIT_BOARDNAME) != "undefined") {
            var name = HOT_VISIT_BOARDNAME[boardid];
            if (typeof(name) != "undefined") {
                return name;
            }
        }
        var boardName;
        DWREngine.setAsync(false);
        Dwr.getBoardName(boardid, function(data) {
            boardName = data;
        });
        DWREngine.setAsync(true);
        return boardName;
    }

}

if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (PhotoBean == null) var PhotoBean = {};
PhotoBean._path = 'http://photo.163.com/photo/dwr';
PhotoBean.getImageExif = function(p0, callback) {
    DWREngine.setMethod(DWREngine.ScriptTag);
    dwr.engine._execute(PhotoBean._path, 'PhotoBean', 'getImageExif', p0, callback);
    DWREngine.setMethod(DWREngine.XMLHttpRequest);
}


// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (DwrSystemAdmin == null) var DwrSystemAdmin = {};
DwrSystemAdmin._path = '/bbs/dwr';
DwrSystemAdmin.delBlackList = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delBlackList', p0, p1, false, callback);
}
DwrSystemAdmin.delIpLimit = function(p0, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delIpLimit', p0, false, callback);
}
DwrSystemAdmin.isEditor = function(callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'isEditor', false, callback);
}
DwrSystemAdmin.auditArticle = function(p0, p1, p2, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'auditArticle', p0, p1, p2, false, callback);
}
DwrSystemAdmin.allAuditArticle = function(p0, p1, p2, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'allAuditArticle', p0, p1, p2, false, callback);
}
DwrSystemAdmin.batchAuditArticle = function(p0, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'batchAuditArticle', p0, false, callback);
}
DwrSystemAdmin.isSuperEditor = function(callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'isSuperEditor', false, callback);
}
DwrSystemAdmin.boardClose = function(p0, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'boardClose', p0, false, callback);
}
DwrSystemAdmin.boardAudit = function(p0, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'boardAudit', p0, false, callback);
}
DwrSystemAdmin.boardReplyAudit = function(p0, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'boardReplyAudit', p0, false, callback);
}
DwrSystemAdmin.moveNav = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'moveNav', p0, p1, false, callback);
}
DwrSystemAdmin.updateDirectory = function(p0, p1, p2, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'updateDirectory', p0, p1, p2, false, callback);
}
DwrSystemAdmin.delDirectory = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delDirectory', p0, p1, false, callback);
}
DwrSystemAdmin.addMaster = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'addMaster', p0, p1, false, callback);
}
DwrSystemAdmin.delMaster = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delMaster', p0, p1, false, callback);
}
DwrSystemAdmin.updateMaster = function(p0, p1, p2, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'updateMaster', p0, p1, p2, false, callback);
}
DwrSystemAdmin.moveMaster = function(p0, p1, p2, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'moveMaster', p0, p1, p2, false, callback);
}
DwrSystemAdmin.moveSide = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'moveSide', p0, p1, false, callback);
}
DwrSystemAdmin.moveBoard = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'moveBoard', p0, p1, false, callback);
}
DwrSystemAdmin.updateMasterHtml = function(p0, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'updateMasterHtml', p0, false, callback);
}
DwrSystemAdmin.delSignBlack = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delSignBlack', p0, p1, false, callback);
}
DwrSystemAdmin.changeGuestIp = function(p0, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'changeGuestIp', p0, false, callback);
}
DwrSystemAdmin.postKeyword = function(p0, p1, p2, p3, p4, p5, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'postKeyword', p0, p1, p2, p3, p4, p5, false, callback);
}
DwrSystemAdmin.delKeyword = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delKeyword', p0, p1, false, callback);
}
DwrSystemAdmin.delPrivilegeUser = function(p0, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delPrivilegeUser', p0, false, callback);
}
DwrSystemAdmin.postWebmasterPurview = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'postWebmasterPurview', p0, p1, false, callback);
}
DwrSystemAdmin.delWebmaster = function(p0, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delWebmaster', p0, false, callback);
}
DwrSystemAdmin.pageGenerator = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'pageGenerator', p0, p1, p2, p3, false, callback);
}
DwrSystemAdmin.postSide = function(p0, p1, p2, p3, p4, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'postSide', p0, p1, p2, p3, p4, false, callback);
}
DwrSystemAdmin.makeSide = function(callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'makeSide', false, callback);
}
DwrSystemAdmin.checkForfendArticle = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'checkForfendArticle', p0, p1, false, callback);
}
DwrSystemAdmin.isLegalBoard = function(p0, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'isLegalBoard', p0, callback);
}
DwrSystemAdmin.sendSysMessage = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'sendSysMessage', p0, p1, false, callback);
}
DwrSystemAdmin.sendChannelMessage = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'sendChannelMessage', p0, p1, false, callback);
}
DwrSystemAdmin.isGarbageByContent = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'isGarbageByContent', p0, p1, false, callback);
}
DwrSystemAdmin.isGarbage = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'isGarbage', p0, p1, false, callback);
}
DwrSystemAdmin.isMessageGarbage = function(p0, p1, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'isMessageGarbage', p0, p1, false, callback);
}
DwrSystemAdmin.deleteGarbage = function(p0, callback) {
    dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'deleteGarbage', p0, false, callback);
}


// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (DwrBoardAdmin == null) var DwrBoardAdmin = {};
DwrBoardAdmin._path = '/bbs/dwr';
DwrBoardAdmin.main = function(p0, callback) {
    dwr.engine._execute(DwrBoardAdmin._path, 'DwrBoardAdmin', 'main', p0, callback);
}
DwrBoardAdmin.searchBoards = function(p0, p1, callback) {
    dwr.engine._execute(DwrBoardAdmin._path, 'DwrBoardAdmin', 'searchBoards', p0, p1, false, callback);
}
DwrBoardAdmin.isBoardAdmin = function(p0, callback) {
    dwr.engine._execute(DwrBoardAdmin._path, 'DwrBoardAdmin', 'isBoardAdmin', p0, false, callback);
}
DwrBoardAdmin.delArticle = function(p0, callback) {
    dwr.engine._execute(DwrBoardAdmin._path, 'DwrBoardAdmin', 'delArticle', p0, false, callback);
}
DwrBoardAdmin.auditArticle = function(p0, p1, p2, callback) {
    dwr.engine._execute(DwrBoardAdmin._path, 'DwrBoardAdmin', 'auditArticle', p0, p1, p2, false, callback);
}
DwrBoardAdmin.allAuditArticle = function(p0, p1, p2, callback) {
    dwr.engine._execute(DwrBoardAdmin._path, 'DwrBoardAdmin', 'allAuditArticle', p0, p1, p2, false, callback);
}
DwrBoardAdmin.batchAuditArticle = function(p0, callback) {
    dwr.engine._execute(DwrBoardAdmin._path, 'DwrBoardAdmin', 'batchAuditArticle', p0, false, callback);
}


// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (DwrAlarm == null) var DwrAlarm = {};
DwrAlarm._path = '/bbs/dwr';
DwrAlarm.main = function(p0, callback) {
    dwr.engine._execute(DwrAlarm._path, 'DwrAlarm', 'main', p0, callback);
}
DwrAlarm.oldJsVersion = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(DwrAlarm._path, 'DwrAlarm', 'oldJsVersion', p0, p1, p2, p3, false, callback);
}
DwrAlarm.checkLastReply = function(p0, p1, p2, p3, p4, p5, p6, callback) {
    dwr.engine._execute(DwrAlarm._path, 'DwrAlarm', 'checkLastReply', p0, p1, p2, p3, p4, p5, p6, false, callback);
}


// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (DwrPlugin == null) var DwrPlugin = {};
DwrPlugin._path = '/bbs/dwr';
DwrPlugin.main = function(p0, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'main', p0, callback);
}
DwrPlugin.saveHtml = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveHtml', p0, p1, p2, p3, false, callback);
}
DwrPlugin.saveTravel = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveTravel', p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, false, callback);
}
DwrPlugin.saveXiangQin = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveXiangQin', p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, false, callback);
}
DwrPlugin.saveSaiLife = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveSaiLife', p0, p1, p2, p3, p4, p5, p6, p7, p8, false, callback);
}
DwrPlugin.saveDaren = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveDaren', p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, false, callback);
}
DwrPlugin.saveItmm = function(p0, p1, p2, p3, p4, p5, p6, p7, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveItmm', p0, p1, p2, p3, p4, p5, p6, p7, false, callback);
}
DwrPlugin.saveItmm2009 = function(p0, p1, p2, p3, p4, p5, p6, p7, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveItmm2009', p0, p1, p2, p3, p4, p5, p6, p7, false, callback);
}
DwrPlugin.saveStreet = function(p0, p1, p2, p3, p4, p5, p6, p7, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveStreet', p0, p1, p2, p3, p4, p5, p6, p7, false, callback);
}
DwrPlugin.saveBaby = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveBaby', p0, p1, p2, p3, p4, p5, p6, p7, p8, false, callback);
}
DwrPlugin.saveBaby2 = function(p0, p1, p2, p3, p4, p5, p6, p7, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveBaby2', p0, p1, p2, p3, p4, p5, p6, p7, false, callback);
}
DwrPlugin.saveWage = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveWage', p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, false, callback);
}
DwrPlugin.saveTicket = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveTicket', p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, false, callback);
}
DwrPlugin.saveChunyun = function(p0, p1, p2, p3, p4, p5, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveChunyun', p0, p1, p2, p3, p4, p5, false, callback);
}
DwrPlugin.saveHire = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveHire', p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, false, callback);
}
DwrPlugin.saveDebate = function(p0, p1, p2, p3, p4, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveDebate', p0, p1, p2, p3, p4, false, callback);
}
DwrPlugin.saveActivity = function(p0, p1, p2, p3, p4, p5, p6, p7, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveActivity', p0, p1, p2, p3, p4, p5, p6, p7, false, callback);
}
DwrPlugin.saveCredits = function(p0, p1, p2, p3, p4, p5, p6, p7, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveCredits', p0, p1, p2, p3, p4, p5, p6, p7, false, callback);
}
DwrPlugin.saveCaiPu = function(p0, p1, p2, callback) {
    dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveCaiPu', p0, p1, p2, false, callback);
}


// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (DwrClub == null) var DwrClub = {};
DwrClub._path = '/bbs/dwr';
DwrClub.getHeader = function(p0, callback) {
    dwr.engine._execute(DwrClub._path, 'DwrClub', 'getHeader', p0, false, callback);
}


// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (Dwr == null) var Dwr = {};
Dwr._path = '/bbs/dwr';
Dwr.main = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'main', p0, callback);
}
Dwr.test = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'test', p0, false, callback);
}
Dwr.nodes = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'nodes', p0, p1, callback);
}
Dwr.topThread = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'topThread', p0, p1, false, callback);
}
Dwr.eliteThread = function(p0, p1, p2, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'eliteThread', p0, p1, p2, false, callback);
}
Dwr.pushThread = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'pushThread', p0, p1, p2, p3, false, callback);
}
Dwr.downThread = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'downThread', p0, p1, false, callback);
}
Dwr.copyThread = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'copyThread', p0, p1, p2, p3, false, callback);
}
Dwr.lockThread = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'lockThread', p0, p1, false, callback);
}
Dwr.rubbishThread = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'rubbishThread', p0, p1, false, callback);
}
Dwr.delPost = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'delPost', p0, p1, false, callback);
}
Dwr.setAdminCommentTypes = function(p0, p1, p2, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'setAdminCommentTypes', p0, p1, p2, false, callback);
}
Dwr.addBlackList = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'addBlackList', p0, p1, p2, p3, false, callback);
}
Dwr.delBbsBlackList = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'delBbsBlackList', p0, p1, false, callback);
}
Dwr.addBread = function(p0, p1, p2, p3, p4, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'addBread', p0, p1, p2, p3, p4, false, callback);
}
Dwr.blackUser = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'blackUser', p0, p1, p2, p3, false, callback);
}
Dwr.delBlackUser = function(p0, p1, p2, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'delBlackUser', p0, p1, p2, false, callback);
}
Dwr.addIpLimit = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'addIpLimit', p0, p1, p2, p3, false, callback);
}
Dwr.allTopThread = function(p0, p1, p2, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'allTopThread', p0, p1, p2, false, callback);
}
Dwr.canUploadImages = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'canUploadImages', p0, false, callback);
}
Dwr.isRepliedThread = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'isRepliedThread', p0, p1, false, callback);
}
Dwr.reportPost = function(p0, p1, p2, p3, p4, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'reportPost', p0, p1, p2, p3, p4, false, callback);
}
Dwr.getUsername = function(callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getUsername', false, false, callback);
}
Dwr.delMessage = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'delMessage', p0, false, callback);
}
Dwr.delMessages = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'delMessages', p0, false, callback);
}
Dwr.delSentMessage = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'delSentMessage', p0, false, callback);
}
Dwr.delSentMessages = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'delSentMessages', p0, false, callback);
}
Dwr.delBlackList = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'delBlackList', p0, false, callback);
}
Dwr.sendMessage = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'sendMessage', p0, p1, false, callback);
}
Dwr.addMyBlackList = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'addMyBlackList', p0, p1, false, callback);
}
Dwr.getQuoteReply = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getQuoteReply', p0, p1, callback);
}
Dwr.sayGood = function(p0, p1, p2, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'sayGood', p0, p1, p2, false, callback);
}
Dwr.sayBad = function(p0, p1, p2, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'sayBad', p0, p1, p2, false, callback);
}
Dwr.editReply = function(p0, p1, p2, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'editReply', p0, p1, p2, false, callback);
}
Dwr.updateVote = function(p0, p1, p2, p3, p4, p5, p6, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'updateVote', p0, p1, p2, p3, p4, p5, p6, false, callback);
}
Dwr.activityApplyCheck = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'activityApplyCheck', p0, false, callback);
}
Dwr.activityApply = function(p0, p1, p2, p3, p4, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'activityApply', p0, p1, p2, p3, p4, false, callback);
}
Dwr.creditsApplyCheck = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'creditsApplyCheck', p0, false, callback);
}
Dwr.creditsApply = function(p0, p1, p2, p3, p4, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'creditsApply', p0, p1, p2, p3, p4, false, callback);
}
Dwr.getChannelMark = function(callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getChannelMark', false, callback);
}
Dwr.debateVote = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'debateVote', p0, p1, p2, p3, false, callback);
}
Dwr.debateApply = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'debateApply', p0, p1, p2, p3, false, callback);
}
Dwr.vote = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'vote', p0, p1, p2, p3, false, callback);
}
Dwr.getBoardName = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getBoardName', p0, false, callback);
}
Dwr.getBoardNames = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getBoardNames', p0, false, callback);
}
Dwr.loadBoardList = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'loadBoardList', p0, p1, false, callback);
}
Dwr.loadBoardListByKeyword = function(p0, p1, p2, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'loadBoardListByKeyword', p0, p1, p2, false, callback);
}
Dwr.getChildBoards = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getChildBoards', p0, false, callback);
}
Dwr.getChildBoardsByDbname = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getChildBoardsByDbname', p0, p1, false, callback);
}
Dwr.getNickname = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getNickname', p0, callback);
}
Dwr.updateNickname = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'updateNickname', p0, p1, false, callback);
}
Dwr.updateUserinfo = function(p0, p1, p2, p3, p4, p5, p6, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'updateUserinfo', p0, p1, p2, p3, p4, p5, p6, false, callback);
}
Dwr.isWantVerify = function(p0, p1, p2, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'isWantVerify', p0, p1, p2, false, callback);
}
Dwr.isWantVerifyBackup = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'isWantVerifyBackup', p0, p1, false, callback);
}
Dwr.getAutoHeader = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getAutoHeader', p0, false, callback);
}
Dwr.delIpLimit = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'delIpLimit', p0, p1, false, callback);
}
Dwr.getReplyBody = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getReplyBody', p0, p1, callback);
}
Dwr.addMyFavorite = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'addMyFavorite', p0, false, callback);
}
Dwr.deleteMyFavorite = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'deleteMyFavorite', p0, false, callback);
}
Dwr.addMyFavorite_Yiba = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'addMyFavorite_Yiba', p0, false, callback);
}
Dwr.deleteMyFavorite_Yiba = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'deleteMyFavorite_Yiba', p0, false, callback);
}
Dwr.getOnlineStatus = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getOnlineStatus', p0, false, callback);
}
Dwr.copyToBlog = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'copyToBlog', p0, p1, false, callback);
}
Dwr.setAskGoodAnswer = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'setAskGoodAnswer', p0, p1, false, callback);
}
Dwr.setAskPushAnswer = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'setAskPushAnswer', p0, p1, false, callback);
}
Dwr.getBoardUrlByBoardid = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getBoardUrlByBoardid', p0, p1, false, callback);
}
Dwr.getCityByProvince = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getCityByProvince', p0, callback);
}
Dwr.addGuide = function(p0, p1, p2, p3, p4, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'addGuide', p0, p1, p2, p3, p4, false, callback);
}
Dwr.deleteGuide = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'deleteGuide', p0, p1, false, callback);
}
Dwr.addArticleLimit = function(p0, p1, p2, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'addArticleLimit', p0, p1, p2, false, callback);
}
Dwr.deleteArticleLimit = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'deleteArticleLimit', p0, p1, false, callback);
}
Dwr.isLimitThread = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'isLimitThread', p0, p1, false, callback);
}
Dwr.hasForfendKeyword = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'hasForfendKeyword', p0, p1, p2, p3, false, callback);
}
Dwr.hasSubtleKeyword = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'hasSubtleKeyword', p0, p1, p2, p3, false, callback);
}
Dwr.addApplyMaster = function(p0, p1, p2, p3, p4, p5, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'addApplyMaster', p0, p1, p2, p3, p4, p5, false, callback);
}
Dwr.copyUrl = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'copyUrl', p0, p1, false, callback);
}
Dwr.searchBoards = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'searchBoards', p0, false, callback);
}
Dwr.exchangeMark = function(callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'exchangeMark', false, callback);
}
Dwr.downloadPDF = function(p0, p1, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'downloadPDF', p0, p1, false, callback);
}
Dwr.printLog = function(p0, p1, p2, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'printLog', p0, p1, p2, false, callback);
}
Dwr.isJoinActivity = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'isJoinActivity', p0, false, callback);
}
Dwr.joinActivity = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'joinActivity', p0, p1, p2, p3, false, callback);
}
Dwr.joinLottery = function(p0, p1, p2, p3, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'joinLottery', p0, p1, p2, p3, false, callback);
}
Dwr.addUserSign = function(callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'addUserSign', false, callback);
}
Dwr.getGuessInfo = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getGuessInfo', p0, false, callback);
}
Dwr.joinGuess = function(p0, p1, p2, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'joinGuess', p0, p1, p2, false, callback);
}
Dwr.insertWeiboCard = function(p0, p1, p2, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'insertWeiboCard', p0, p1, p2, false, callback);
}
Dwr.getRandomPoints = function(callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'getRandomPoints', callback);
}
Dwr.clickStat = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'clickStat', p0, false, callback);
}
Dwr.insertBoxDaily = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'insertBoxDaily', p0, false, callback);
}
Dwr.checkcode = function(p0, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'checkcode', p0, false, callback);
}
Dwr.ajaxReplyPhoto = function(p0, p1, p2, p3, p4, p5, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'ajaxReplyPhoto', p0, p1, p2, p3, p4, p5, false, callback);
}
Dwr.ajaxReplyAlbum = function(p0, p1, p2, p3, p4, callback) {
    dwr.engine._execute(Dwr._path, 'Dwr', 'ajaxReplyAlbum', p0, p1, p2, p3, p4, false, callback);
}

/*
 * Copyright 2005 Joe Walker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Declare an object to which we can add real functions.
 */
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

/**
 * Set an alternative error handler from the default alert box.
 * @see getahead.org/dwr/browser/engine/errors
 */
dwr.engine.setErrorHandler = function(handler) {
    dwr.engine._errorHandler = handler;
};

/**
 * Set an alternative warning handler from the default alert box.
 * @see getahead.org/dwr/browser/engine/errors
 */
dwr.engine.setWarningHandler = function(handler) {
    dwr.engine._warningHandler = handler;
};

/**
 * Setter for the text/html handler - what happens if a DWR request gets an HTML
 * reply rather than the expected Javascript. Often due to login timeout
 */
dwr.engine.setTextHtmlHandler = function(handler) {
    dwr.engine._textHtmlHandler = handler;
};

/**
 * Set a default timeout value for all calls. 0 (the default) turns timeouts off.
 * @see getahead.org/dwr/browser/engine/errors
 */
dwr.engine.setTimeout = function(timeout) {
    dwr.engine._timeout = timeout;
};

/**
 * The Pre-Hook is called before any DWR remoting is done.
 * @see getahead.org/dwr/browser/engine/hooks
 */
dwr.engine.setPreHook = function(handler) {
    dwr.engine._preHook = handler;
};

/**
 * The Post-Hook is called after any DWR remoting is done.
 * @see getahead.org/dwr/browser/engine/hooks
 */
dwr.engine.setPostHook = function(handler) {
    dwr.engine._postHook = handler;
};

/**
 * Custom headers for all DWR calls
 * @see getahead.org/dwr/????
 */
dwr.engine.setHeaders = function(headers) {
    dwr.engine._headers = headers;
};

/**
 * Custom parameters for all DWR calls
 * @see getahead.org/dwr/????
 */
dwr.engine.setParameters = function(parameters) {
    dwr.engine._parameters = parameters;
};

/** XHR remoting type constant. See dwr.engine.set[Rpc|Poll]Type() */
dwr.engine.XMLHttpRequest = 1;

/** XHR remoting type constant. See dwr.engine.set[Rpc|Poll]Type() */
dwr.engine.IFrame = 2;

/** XHR remoting type constant. See dwr.engine.setRpcType() */
dwr.engine.ScriptTag = 3;

/**
 * Set the preferred remoting type.
 * @param newType One of dwr.engine.XMLHttpRequest or dwr.engine.IFrame or dwr.engine.ScriptTag
 * @see getahead.org/dwr/browser/engine/options
 */
dwr.engine.setRpcType = function(newType) {
    if (newType != dwr.engine.XMLHttpRequest && newType != dwr.engine.IFrame && newType != dwr.engine.ScriptTag) {
        dwr.engine._handleError(null, { name:"dwr.engine.invalidRpcType", message:"RpcType must be one of dwr.engine.XMLHttpRequest or dwr.engine.IFrame or dwr.engine.ScriptTag" });
        return;
    }
    dwr.engine._rpcType = newType;
};

/**
 * Which HTTP method do we use to send results? Must be one of "GET" or "POST".
 * @see getahead.org/dwr/browser/engine/options
 */
dwr.engine.setHttpMethod = function(httpMethod) {
    if (httpMethod != "GET" && httpMethod != "POST") {
        dwr.engine._handleError(null, { name:"dwr.engine.invalidHttpMethod", message:"Remoting method must be one of GET or POST" });
        return;
    }
    dwr.engine._httpMethod = httpMethod;
};

/**
 * Ensure that remote calls happen in the order in which they were sent? (Default: false)
 * @see getahead.org/dwr/browser/engine/ordering
 */
dwr.engine.setOrdered = function(ordered) {
    dwr.engine._ordered = ordered;
};

/**
 * Do we ask the XHR object to be asynchronous? (Default: true)
 * @see getahead.org/dwr/browser/engine/options
 */
dwr.engine.setAsync = function(async) {
    dwr.engine._async = async;
};

/**
 * Does DWR poll the server for updates? (Default: false)
 * @see getahead.org/dwr/browser/engine/options
 */
dwr.engine.setActiveReverseAjax = function(activeReverseAjax) {
    if (activeReverseAjax) {
        // Bail if we are already started
        if (dwr.engine._activeReverseAjax) return;
        dwr.engine._activeReverseAjax = true;
        dwr.engine._poll();
    }
    else {
        // Can we cancel an existing request?
        if (dwr.engine._activeReverseAjax && dwr.engine._pollReq) dwr.engine._pollReq.abort();
        dwr.engine._activeReverseAjax = false;
    }
    // TODO: in iframe mode, if we start, stop, start then the second start may
    // well kick off a second iframe while the first is still about to return
    // we should cope with this but we don't
};

/**
 * The default message handler.
 * @see getahead.org/dwr/browser/engine/errors
 */
dwr.engine.defaultErrorHandler = function(message, ex) {
    dwr.engine._debug("Error: " + ex.name + ", " + ex.message, true);
    if (message == null || message == "") alert("A server error has occured.");
    // Ignore NS_ERROR_NOT_AVAILABLE if Mozilla is being narky
    else if (message.indexOf("0x80040111") != -1) dwr.engine._debug(message);
    else alert(message);
};

/**
 * The default warning handler.
 * @see getahead.org/dwr/browser/engine/errors
 */
dwr.engine.defaultWarningHandler = function(message, ex) {
    dwr.engine._debug(message);
};

/**
 * For reduced latency you can group several remote calls together using a batch.
 * @see getahead.org/dwr/browser/engine/batch
 */
dwr.engine.beginBatch = function() {
    if (dwr.engine._batch) {
        dwr.engine._handleError(null, { name:"dwr.engine.batchBegun", message:"Batch already begun" });
        return;
    }
    dwr.engine._batch = dwr.engine._createBatch();
};

/**
 * Finished grouping a set of remote calls together. Go and execute them all.
 * @see getahead.org/dwr/browser/engine/batch
 */
dwr.engine.endBatch = function(options) {
    var batch = dwr.engine._batch;
    if (batch == null) {
        dwr.engine._handleError(null, { name:"dwr.engine.batchNotBegun", message:"No batch in progress" });
        return;
    }
    dwr.engine._batch = null;
    if (batch.map.callCount == 0) return;

    // The hooks need to be merged carefully to preserve ordering
    if (options) dwr.engine._mergeBatch(batch, options);

    // In ordered mode, we don't send unless the list of sent items is empty
    if (dwr.engine._ordered && dwr.engine._batchesLength != 0) {
        dwr.engine._batchQueue[dwr.engine._batchQueue.length] = batch;
    }
    else {
        dwr.engine._sendData(batch);
    }
};

/** @deprecated */
dwr.engine.setPollMethod = function(type) { dwr.engine.setPollType(type); };
dwr.engine.setMethod = function(type) { dwr.engine.setRpcType(type); };
dwr.engine.setVerb = function(verb) { dwr.engine.setHttpMethod(verb); };
dwr.engine.setPollType = function() { dwr.engine._debug("Manually setting the Poll Type is not supported"); };

//==============================================================================
// Only private stuff below here
//==============================================================================

/** The original page id sent from the server */
dwr.engine._origScriptSessionId = "2E7630FC8ABA19714D7C9CF9590D119E";

/** The session cookie name */
dwr.engine._sessionCookieName = "JSESSIONID"; // JSESSIONID

/** Is GET enabled for the benefit of Safari? */
dwr.engine._allowGetForSafariButMakeForgeryEasier = "false";

/** The script prefix to strip in the case of scriptTagProtection. */
dwr.engine._scriptTagProtection = "throw 'allowScriptTagRemoting is false.';";

/** The default path to the DWR servlet */
dwr.engine._defaultPath = "/bbs/dwr";

/** Do we use XHR for reverse ajax because we are not streaming? */
dwr.engine._pollWithXhr = "false";

/** The read page id that we calculate */
dwr.engine._scriptSessionId = null;

/** The function that we use to fetch/calculate a session id */
dwr.engine._getScriptSessionId = function() {
    if (dwr.engine._scriptSessionId == null) {
        dwr.engine._scriptSessionId = dwr.engine._origScriptSessionId + Math.floor(Math.random() * 1000);
    }
    return dwr.engine._scriptSessionId;
};

/** A function to call if something fails. */
dwr.engine._errorHandler = dwr.engine.defaultErrorHandler;

/** For debugging when something unexplained happens. */
dwr.engine._warningHandler = dwr.engine.defaultWarningHandler;

/** A function to be called before requests are marshalled. Can be null. */
dwr.engine._preHook = null;

/** A function to be called after replies are received. Can be null. */
dwr.engine._postHook = null;

/** An map of the batches that we have sent and are awaiting a reply on. */
dwr.engine._batches = {};

/** A count of the number of outstanding batches. Should be == to _batches.length unless prototype has messed things up */
dwr.engine._batchesLength = 0;

/** In ordered mode, the array of batches waiting to be sent */
dwr.engine._batchQueue = [];

/** What is the default rpc type */
dwr.engine._rpcType = dwr.engine.XMLHttpRequest;

/** What is the default remoting method (ie GET or POST) */
dwr.engine._httpMethod = "POST";

/** Do we attempt to ensure that calls happen in the order in which they were sent? */
dwr.engine._ordered = false;

/** Do we make the calls async? */
dwr.engine._async = true;

/** The current batch (if we are in batch mode) */
dwr.engine._batch = null;

/** The global timeout */
dwr.engine._timeout = 0;

/** ActiveX objects to use when we want to convert an xml string into a DOM object. */
dwr.engine._DOMDocument = ["Msxml2.DOMDocument.6.0", "Msxml2.DOMDocument.5.0", "Msxml2.DOMDocument.4.0", "Msxml2.DOMDocument.3.0", "MSXML2.DOMDocument", "MSXML.DOMDocument", "Microsoft.XMLDOM"];

/** The ActiveX objects to use when we want to do an XMLHttpRequest call. */
dwr.engine._XMLHTTP = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];

/** Are we doing comet or polling? */
dwr.engine._activeReverseAjax = false;

/** The iframe that we are using to poll */
dwr.engine._outstandingIFrames = [];

/** The xhr object that we are using to poll */
dwr.engine._pollReq = null;

/** How many milliseconds between internal comet polls */
dwr.engine._pollCometInterval = 200;

/** How many times have we re-tried to poll? */
dwr.engine._pollRetries = 0;
dwr.engine._maxPollRetries = 0;

/** Do we do a document.reload if we get a text/html reply? */
dwr.engine._textHtmlHandler = null;

/** If you wish to send custom headers with every request */
dwr.engine._headers = null;

/** If you wish to send extra custom request parameters with each request */
dwr.engine._parameters = null;

/** Undocumented interceptors - do not use */
dwr.engine._postSeperator = "\n";
dwr.engine._defaultInterceptor = function(data) { return data; };
dwr.engine._urlRewriteHandler = dwr.engine._defaultInterceptor;
dwr.engine._contentRewriteHandler = dwr.engine._defaultInterceptor;
dwr.engine._replyRewriteHandler = dwr.engine._defaultInterceptor;

/** Batch ids allow us to know which batch the server is answering */
dwr.engine._nextBatchId = 0;

/** A list of the properties that need merging from calls to a batch */
dwr.engine._propnames = [ "rpcType", "httpMethod", "async", "timeout", "errorHandler", "warningHandler", "textHtmlHandler" ];

/** Do we stream, or can be hacked to do so? */
dwr.engine._partialResponseNo = 0;
dwr.engine._partialResponseYes = 1;
dwr.engine._partialResponseFlush = 2;

/** Is this page in the process of unloading? */
dwr.engine._unloading = false;

/**
 * @private Send a request. Called by the Javascript interface stub
 * @param path part of URL after the host and before the exec bit without leading or trailing /s
 * @param scriptName The class to execute
 * @param methodName The method on said class to execute
 * @param func The callback function to which any returned data should be passed
 *       if this is null, any returned data will be ignored
 * @param vararg_params The parameters to pass to the above class
 */
dwr.engine._execute = function(path, scriptName, methodName, vararg_params) {
    var singleShot = false;
    if (dwr.engine._batch == null) {
        dwr.engine.beginBatch();
        singleShot = true;
    }
    var batch = dwr.engine._batch;
    // To make them easy to manipulate we copy the arguments into an args array
    var args = [];
    for (var i = 0; i < arguments.length - 3; i++) {
        args[i] = arguments[i + 3];
    }
    // All the paths MUST be to the same servlet
    if (batch.path == null) {
        batch.path = path;
    }
    else {
        if (batch.path != path) {
            dwr.engine._handleError(batch, { name:"dwr.engine.multipleServlets", message:"Can't batch requests to multiple DWR Servlets." });
            return;
        }
    }
    // From the other params, work out which is the function (or object with
    // call meta-data) and which is the call parameters
    var callData;
    var lastArg = args[args.length - 1];
    if (typeof lastArg == "function" || lastArg == null) callData = { callback:args.pop() };
    else callData = args.pop();

    // Merge from the callData into the batch
    dwr.engine._mergeBatch(batch, callData);
    batch.handlers[batch.map.callCount] = {
        exceptionHandler:callData.exceptionHandler,
        callback:callData.callback
    };

    // Copy to the map the things that need serializing
    var prefix = "c" + batch.map.callCount + "-";
    batch.map[prefix + "scriptName"] = scriptName;
    batch.map[prefix + "methodName"] = methodName;
    batch.map[prefix + "id"] = batch.map.callCount;
    for (i = 0; i < args.length; i++) {
        dwr.engine._serializeAll(batch, [], args[i], prefix + "param" + i);
    }

    // Now we have finished remembering the call, we incr the call count
    batch.map.callCount++;
    if (singleShot) dwr.engine.endBatch();
};

/** @private Poll the server to see if there is any data waiting */
dwr.engine._poll = function() {
    if (!dwr.engine._activeReverseAjax) return;

    var batch = dwr.engine._createBatch();
    batch.map.id = 0; // TODO: Do we need this??
    batch.map.callCount = 1;
    batch.isPoll = true;
    if (dwr.engine._pollWithXhr == "true") {
        batch.rpcType = dwr.engine.XMLHttpRequest;
        batch.map.partialResponse = dwr.engine._partialResponseNo;
    }
    else {
        if (navigator.userAgent.indexOf("Gecko/") != -1) {
            batch.rpcType = dwr.engine.XMLHttpRequest;
            batch.map.partialResponse = dwr.engine._partialResponseYes;
        }
        else {
            batch.rpcType = dwr.engine.XMLHttpRequest;
            batch.map.partialResponse = dwr.engine._partialResponseNo;
        }
    }
    batch.httpMethod = "POST";
    batch.async = true;
    batch.timeout = 0;
    batch.path = dwr.engine._defaultPath;
    batch.preHooks = [];
    batch.postHooks = [];
    batch.errorHandler = dwr.engine._pollErrorHandler;
    batch.warningHandler = dwr.engine._pollErrorHandler;
    batch.handlers[0] = {
        callback:function(pause) {
            dwr.engine._pollRetries = 0;
            setTimeout(dwr.engine._poll, pause);
        }
    };

    // Send the data
    dwr.engine._sendData(batch);
    if (batch.rpcType == dwr.engine.XMLHttpRequest && batch.map.partialResponse == dwr.engine._partialResponseYes) {
        dwr.engine._checkCometPoll();
    }
};

/** Try to recover from polling errors */
dwr.engine._pollErrorHandler = function(msg, ex) {
    // if anything goes wrong then just silently try again (up to 3x) after 10s
    dwr.engine._pollRetries++;
    dwr.engine._debug("Reverse Ajax poll failed (pollRetries=" + dwr.engine._pollRetries + "): " + ex.name + " : " + ex.message);
    if (dwr.engine._pollRetries < dwr.engine._maxPollRetries) {
        setTimeout(dwr.engine._poll, 10000);
    }
    else {
        dwr.engine._activeReverseAjax = false;
        dwr.engine._debug("Giving up.");
    }
};

/** @private Generate a new standard batch */
dwr.engine._createBatch = function() {
    var batch = {
        map:{
            callCount:0,
            page:window.location.pathname + window.location.search,
            httpSessionId:dwr.engine._getJSessionId(),
            scriptSessionId:dwr.engine._getScriptSessionId()
        },
        charsProcessed:0, paramCount:0,
        parameters:{}, headers:{},
        isPoll:false, handlers:{}, preHooks:[], postHooks:[],
        rpcType:dwr.engine._rpcType,
        httpMethod:dwr.engine._httpMethod,
        async:dwr.engine._async,
        timeout:dwr.engine._timeout,
        errorHandler:dwr.engine._errorHandler,
        warningHandler:dwr.engine._warningHandler,
        textHtmlHandler:dwr.engine._textHtmlHandler
    };
    if (dwr.engine._preHook) batch.preHooks.push(dwr.engine._preHook);
    if (dwr.engine._postHook) batch.postHooks.push(dwr.engine._postHook);
    var propname, data;
    if (dwr.engine._headers) {
        for (propname in dwr.engine._headers) {
            data = dwr.engine._headers[propname];
            if (typeof data != "function") batch.headers[propname] = data;
        }
    }
    if (dwr.engine._parameters) {
        for (propname in dwr.engine._parameters) {
            data = dwr.engine._parameters[propname];
            if (typeof data != "function") batch.parameters[propname] = data;
        }
    }
    return batch;
};

/** @private Take further options and merge them into */
dwr.engine._mergeBatch = function(batch, overrides) {
    var propname, data;
    for (var i = 0; i < dwr.engine._propnames.length; i++) {
        propname = dwr.engine._propnames[i];
        if (overrides[propname] != null) batch[propname] = overrides[propname];
    }
    if (overrides.preHook != null) batch.preHooks.unshift(overrides.preHook);
    if (overrides.postHook != null) batch.postHooks.push(overrides.postHook);
    if (overrides.headers) {
        for (propname in overrides.headers) {
            data = overrides.headers[propname];
            if (typeof data != "function") batch.headers[propname] = data;
        }
    }
    if (overrides.parameters) {
        for (propname in overrides.parameters) {
            data = overrides.parameters[propname];
            if (typeof data != "function") batch.map["p-" + propname] = "" + data;
        }
    }
};

/** @private What is our session id? */
dwr.engine._getJSessionId =  function() {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
        if (cookie.indexOf(dwr.engine._sessionCookieName + "=") == 0) {
            return cookie.substring(dwr.engine._sessionCookieName.length + 1, cookie.length);
        }
    }
    return "";
};

/** @private Check for reverse Ajax activity */
dwr.engine._checkCometPoll = function() {
    for (var i = 0; i < dwr.engine._outstandingIFrames.length; i++) {
        var text = "";
        var iframe = dwr.engine._outstandingIFrames[i];
        try {
            text = dwr.engine._getTextFromCometIFrame(iframe);
        }
        catch (ex) {
            dwr.engine._handleWarning(iframe.batch, ex);
        }
        if (text != "") dwr.engine._processCometResponse(text, iframe.batch);
    }
    if (dwr.engine._pollReq) {
        var req = dwr.engine._pollReq;
        var text = req.responseText;
        if (text != null) dwr.engine._processCometResponse(text, req.batch);
    }

    // If the poll resources are still there, come back again
    if (dwr.engine._outstandingIFrames.length > 0 || dwr.engine._pollReq) {
        setTimeout(dwr.engine._checkCometPoll, dwr.engine._pollCometInterval);
    }
};

/** @private Extract the whole (executed an all) text from the current iframe */
dwr.engine._getTextFromCometIFrame = function(frameEle) {
    var body = frameEle.contentWindow.document.body;
    if (body == null) return "";
    var text = body.innerHTML;
    // We need to prevent IE from stripping line feeds
    if (text.indexOf("<PRE>") == 0 || text.indexOf("<pre>") == 0) {
        text = text.substring(5, text.length - 7);
    }
    return text;
};

/** @private Some more text might have come in, test and execute the new stuff */
dwr.engine._processCometResponse = function(response, batch) {
    if (batch.charsProcessed == response.length) return;
    if (response.length == 0) {
        batch.charsProcessed = 0;
        return;
    }

    var firstStartTag = response.indexOf("//#DWR-START#", batch.charsProcessed);
    if (firstStartTag == -1) {
        // dwr.engine._debug("No start tag (search from " + batch.charsProcessed + "). skipping '" + response.substring(batch.charsProcessed) + "'");
        batch.charsProcessed = response.length;
        return;
    }
    // if (firstStartTag > 0) {
    //   dwr.engine._debug("Start tag not at start (search from " + batch.charsProcessed + "). skipping '" + response.substring(batch.charsProcessed, firstStartTag) + "'");
    // }

    var lastEndTag = response.lastIndexOf("//#DWR-END#");
    if (lastEndTag == -1) {
        // dwr.engine._debug("No end tag. unchanged charsProcessed=" + batch.charsProcessed);
        return;
    }

    // Skip the end tag too for next time, remembering CR and LF
    if (response.charCodeAt(lastEndTag + 11) == 13 && response.charCodeAt(lastEndTag + 12) == 10) {
        batch.charsProcessed = lastEndTag + 13;
    }
    else {
        batch.charsProcessed = lastEndTag + 11;
    }

    var exec = response.substring(firstStartTag + 13, lastEndTag);

    dwr.engine._receivedBatch = batch;
    dwr.engine._eval(exec);
    dwr.engine._receivedBatch = null;
};

/** @private Actually send the block of data in the batch object. */
dwr.engine._sendData = function(batch) {
    batch.map.batchId = dwr.engine._nextBatchId;
    dwr.engine._nextBatchId++;
    dwr.engine._batches[batch.map.batchId] = batch;
    dwr.engine._batchesLength++;
    batch.completed = false;

    for (var i = 0; i < batch.preHooks.length; i++) {
        batch.preHooks[i]();
    }
    batch.preHooks = null;
    // Set a timeout
    if (batch.timeout && batch.timeout != 0) {
        batch.timeoutId = setTimeout(function() { dwr.engine._abortRequest(batch); }, batch.timeout);
    }
    // Get setup for XMLHttpRequest if possible
    if (batch.rpcType == dwr.engine.XMLHttpRequest) {
        if (window.XMLHttpRequest) {
            batch.req = new XMLHttpRequest();
        }
        // IE5 for the mac claims to support window.ActiveXObject, but throws an error when it's used
        else if (window.ActiveXObject && !(navigator.userAgent.indexOf("Mac") >= 0 && navigator.userAgent.indexOf("MSIE") >= 0)) {
            batch.req = dwr.engine._newActiveXObject(dwr.engine._XMLHTTP);
        }
    }

    var prop, request;
    if (batch.req) {
        // Proceed using XMLHttpRequest
        if (batch.async) {
            batch.req.onreadystatechange = function() {
                if (typeof dwr != 'undefined') dwr.engine._stateChange(batch);
            };
        }
        // If we're polling, record this for monitoring
        if (batch.isPoll) {
            dwr.engine._pollReq = batch.req;
            // In IE XHR is an ActiveX control so you can't augment it like this
            if (!(document.all && !window.opera)) batch.req.batch = batch;
        }
        // Workaround for Safari 1.x POST bug
        var indexSafari = navigator.userAgent.indexOf("Safari/");
        if (indexSafari >= 0) {
            var version = navigator.userAgent.substring(indexSafari + 7);
            if (parseInt(version, 10) < 400) {
                if (dwr.engine._allowGetForSafariButMakeForgeryEasier == "true") batch.httpMethod = "GET";
                else dwr.engine._handleWarning(batch, { name:"dwr.engine.oldSafari", message:"Safari GET support disabled. See getahead.org/dwr/server/servlet and allowGetForSafariButMakeForgeryEasier." });
            }
        }
        batch.mode = batch.isPoll ? dwr.engine._ModePlainPoll : dwr.engine._ModePlainCall;
        request = dwr.engine._constructRequest(batch);
        try {
            batch.req.open(batch.httpMethod, request.url, batch.async);
            try {
                for (prop in batch.headers) {
                    var value = batch.headers[prop];
                    if (typeof value == "string") batch.req.setRequestHeader(prop, value);
                }
                if (!batch.headers["Content-Type"]) batch.req.setRequestHeader("Content-Type", "text/plain");
            }
            catch (ex) {
                dwr.engine._handleWarning(batch, ex);
            }
            batch.req.send(request.body);
            if (!batch.async) dwr.engine._stateChange(batch);
        }
        catch (ex) {
            dwr.engine._handleError(batch, ex);
        }
    }
    else if (batch.rpcType != dwr.engine.ScriptTag) {
        var idname = batch.isPoll ? "dwr-if-poll-" + batch.map.batchId : "dwr-if-" + batch.map.batchId;
        // Removed htmlfile implementation. Don't expect it to return before v3
        batch.div = document.createElement("div");
        // Add the div to the document first, otherwise IE 6 will ignore onload handler.
        document.body.appendChild(batch.div);
        batch.div.innerHTML = "<iframe src='javascript:void(0)' frameborder='0' style='width:0px;height:0px;border:0;' id='" + idname + "' name='" + idname + "' onload='dwr.engine._iframeLoadingComplete (" + batch.map.batchId + ");'></iframe>";
        batch.document = document;
        batch.iframe = batch.document.getElementById(idname);
        batch.iframe.batch = batch;
        batch.mode = batch.isPoll ? dwr.engine._ModeHtmlPoll : dwr.engine._ModeHtmlCall;
        if (batch.isPoll) dwr.engine._outstandingIFrames.push(batch.iframe);
        request = dwr.engine._constructRequest(batch);
        if (batch.httpMethod == "GET") {
            batch.iframe.setAttribute("src", request.url);
        }
        else {
            batch.form = batch.document.createElement("form");
            batch.form.setAttribute("id", "dwr-form");
            batch.form.setAttribute("action", request.url);
            batch.form.setAttribute("style", "display:none;");
            batch.form.setAttribute("target", idname);
            batch.form.target = idname;
            batch.form.setAttribute("method", batch.httpMethod);
            for (prop in batch.map) {
                var value = batch.map[prop];
                if (typeof value != "function") {
                    var formInput = batch.document.createElement("input");
                    formInput.setAttribute("type", "hidden");
                    formInput.setAttribute("name", prop);
                    formInput.setAttribute("value", value);
                    batch.form.appendChild(formInput);
                }
            }
            batch.document.body.appendChild(batch.form);
            batch.form.submit();
        }
    }
    else {
        batch.httpMethod = "GET"; // There's no such thing as ScriptTag using POST
        batch.mode = batch.isPoll ? dwr.engine._ModePlainPoll : dwr.engine._ModePlainCall;
        request = dwr.engine._constructRequest(batch);
        batch.script = document.createElement("script");
        batch.script.id = "dwr-st-" + batch.map["c0-id"];
        batch.script.src = request.url;
        document.body.appendChild(batch.script);
    }
};

dwr.engine._ModePlainCall = "/call/plaincall/";
dwr.engine._ModeHtmlCall = "/call/htmlcall/";
dwr.engine._ModePlainPoll = "/call/plainpoll/";
dwr.engine._ModeHtmlPoll = "/call/htmlpoll/";

/** @private Work out what the URL should look like */
dwr.engine._constructRequest = function(batch) {
    // A quick string to help people that use web log analysers
    var request = { url:batch.path + batch.mode, body:null };
    if (batch.isPoll == true) {
        request.url += "ReverseAjax.dwr";
    }
    else if (batch.map.callCount == 1) {
        request.url += batch.map["c0-scriptName"] + "." + batch.map["c0-methodName"] + ".dwr";
    }
    else {
        request.url += "Multiple." + batch.map.callCount + ".dwr";
    }
    // Play nice with url re-writing
    var sessionMatch = location.href.match(/jsessionid=([^?]+)/);
    if (sessionMatch != null) {
        request.url += ";jsessionid=" + sessionMatch[1];
    }

    var prop;
    if (batch.httpMethod == "GET") {
        // Some browsers (Opera/Safari2) seem to fail to convert the callCount value
        // to a string in the loop below so we do it manually here.
        batch.map.callCount = "" + batch.map.callCount;
        request.url += "?";
        for (prop in batch.map) {
            if (typeof batch.map[prop] != "function") {
                request.url += encodeURIComponent(prop) + "=" + encodeURIComponent(batch.map[prop]) + "&";
            }
        }
        request.url = request.url.substring(0, request.url.length - 1);
    }
    else {
        // PERFORMANCE: for iframe mode this is thrown away.
        request.body = "";
        if (document.all && !window.opera) {
            // Use array joining on IE (fastest)
            var buf = [];
            for (prop in batch.map) {
                if (typeof batch.map[prop] != "function") {
                    buf.push(prop + "=" + batch.map[prop] + dwr.engine._postSeperator);
                }
            }
            request.body = buf.join("");
        }
        else {
            // Use string concat on other browsers (fastest)
            for (prop in batch.map) {
                if (typeof batch.map[prop] != "function") {
                    request.body += prop + "=" + batch.map[prop] + dwr.engine._postSeperator;
                }
            }
        }
        request.body = dwr.engine._contentRewriteHandler(request.body);
    }
    request.url = dwr.engine._urlRewriteHandler(request.url);
    return request;
};

/** @private Called by XMLHttpRequest to indicate that something has happened */
dwr.engine._stateChange = function(batch) {
    var toEval;

    if (batch.completed) {
        dwr.engine._debug("Error: _stateChange() with batch.completed");
        return;
    }

    var req = batch.req;
    try {
        if (req.readyState != 4) return;
    }
    catch (ex) {
        dwr.engine._handleWarning(batch, ex);
        // It's broken - clear up and forget this call
        dwr.engine._clearUp(batch);
        return;
    }

    if (dwr.engine._unloading) {
        dwr.engine._debug("Ignoring reply from server as page is unloading.");
        return;
    }

    try {
        var reply = req.responseText;
        reply = dwr.engine._replyRewriteHandler(reply);
        var status = req.status; // causes Mozilla to except on page moves

        if (reply == null || reply == "") {
            dwr.engine._handleWarning(batch, { name:"dwr.engine.missingData", message:"No data received from server" });
        }
        else if (status != 200) {
            dwr.engine._handleError(batch, { name:"dwr.engine.http." + status, message:req.statusText });
        }
        else {
            var contentType = req.getResponseHeader("Content-Type");
            if (!contentType.match(/^text\/plain/) && !contentType.match(/^text\/javascript/)) {
                if (contentType.match(/^text\/html/) && typeof batch.textHtmlHandler == "function") {
                    batch.textHtmlHandler({ status:status, responseText:reply, contentType:contentType });
                }
                else {
                    dwr.engine._handleWarning(batch, { name:"dwr.engine.invalidMimeType", message:"Invalid content type: '" + contentType + "'" });
                }
            }
            else {
                // Comet replies might have already partially executed
                if (batch.isPoll && batch.map.partialResponse == dwr.engine._partialResponseYes) {
                    dwr.engine._processCometResponse(reply, batch);
                }
                else {
                    if (reply.search("//#DWR") == -1) {
                        dwr.engine._handleWarning(batch, { name:"dwr.engine.invalidReply", message:"Invalid reply from server" });
                    }
                    else {
                        toEval = reply;
                    }
                }
            }
        }
    }
    catch (ex) {
        dwr.engine._handleWarning(batch, ex);
    }

    dwr.engine._callPostHooks(batch);

    // Outside of the try/catch so errors propogate normally:
    dwr.engine._receivedBatch = batch;
    if (toEval != null) toEval = toEval.replace(dwr.engine._scriptTagProtection, "");
    dwr.engine._eval(toEval);
    dwr.engine._receivedBatch = null;
    dwr.engine._validateBatch(batch);
    if (!batch.completed) dwr.engine._clearUp(batch);
};

/**
 * @private This function is invoked when a batch reply is received.
 * It checks that there is a response for every call in the batch. Otherwise,
 * an error will be signaled (a call without a response indicates that the
 * server failed to send complete batch response).
 */
dwr.engine._validateBatch = function(batch) {
    // If some call left unreplied, report an error.
    if (!batch.completed) {
        for (var i = 0; i < batch.map.callCount; i++) {
            if (batch.handlers[i] != null) {
                dwr.engine._handleWarning(batch, { name:"dwr.engine.incompleteReply", message:"Incomplete reply from server" });
                break;
            }
        }
    }
}

/** @private Called from iframe onload, check batch using batch-id */
dwr.engine._iframeLoadingComplete = function(batchId) {
    // dwr.engine._checkCometPoll();
    var batch = dwr.engine._batches[batchId];
    if (batch) dwr.engine._validateBatch(batch);
}

/** @private Called by the server: Execute a callback */
dwr.engine._remoteHandleCallback = function(batchId, callId, reply) {
    var batch = dwr.engine._batches[batchId];
    if (batch == null) {
        dwr.engine._debug("Warning: batch == null in remoteHandleCallback for batchId=" + batchId, true);
        return;
    }
    // Error handlers inside here indicate an error that is nothing to do
    // with DWR so we handle them differently.
    try {
        var handlers = batch.handlers[callId];
        batch.handlers[callId] = null;
        if (!handlers) {
            dwr.engine._debug("Warning: Missing handlers. callId=" + callId, true);
        }
        else if (typeof handlers.callback == "function") handlers.callback(reply);
    }
    catch (ex) {
        dwr.engine._handleError(batch, ex);
    }
};

/** @private Called by the server: Handle an exception for a call */
dwr.engine._remoteHandleException = function(batchId, callId, ex) {
    var batch = dwr.engine._batches[batchId];
    if (batch == null) { dwr.engine._debug("Warning: null batch in remoteHandleException", true); return; }
    var handlers = batch.handlers[callId];
    batch.handlers[callId] = null;
    if (handlers == null) { dwr.engine._debug("Warning: null handlers in remoteHandleException", true); return; }
    if (ex.message == undefined) ex.message = "";
    if (typeof handlers.exceptionHandler == "function") handlers.exceptionHandler(ex.message, ex);
    else if (typeof batch.errorHandler == "function") batch.errorHandler(ex.message, ex);
};

/** @private Called by the server: The whole batch is broken */
dwr.engine._remoteHandleBatchException = function(ex, batchId) {
    var searchBatch = (dwr.engine._receivedBatch == null && batchId != null);
    if (searchBatch) {
        dwr.engine._receivedBatch = dwr.engine._batches[batchId];
    }
    if (ex.message == undefined) ex.message = "";
    dwr.engine._handleError(dwr.engine._receivedBatch, ex);
    if (searchBatch) {
        dwr.engine._receivedBatch = null;
        dwr.engine._clearUp(dwr.engine._batches[batchId]);
    }
};

/** @private Called by the server: Reverse ajax should not be used */
dwr.engine._remotePollCometDisabled = function(ex, batchId) {
    dwr.engine.setActiveReverseAjax(false);
    var searchBatch = (dwr.engine._receivedBatch == null && batchId != null);
    if (searchBatch) {
        dwr.engine._receivedBatch = dwr.engine._batches[batchId];
    }
    if (ex.message == undefined) ex.message = "";
    dwr.engine._handleError(dwr.engine._receivedBatch, ex);
    if (searchBatch) {
        dwr.engine._receivedBatch = null;
        dwr.engine._clearUp(dwr.engine._batches[batchId]);
    }
};

/** @private Called by the server: An IFrame reply is about to start */
dwr.engine._remoteBeginIFrameResponse = function(iframe, batchId) {
    if (iframe != null) dwr.engine._receivedBatch = iframe.batch;
    dwr.engine._callPostHooks(dwr.engine._receivedBatch);
};

/** @private Called by the server: An IFrame reply is just completing */
dwr.engine._remoteEndIFrameResponse = function(batchId) {
    dwr.engine._clearUp(dwr.engine._receivedBatch);
    dwr.engine._receivedBatch = null;
};

/** @private This is a hack to make the context be this window */
dwr.engine._eval = function(script) {
    if (script == null) return null;
    if (script == "") { dwr.engine._debug("Warning: blank script", true); return null; }
    // dwr.engine._debug("Exec: [" + script + "]", true);
    return eval(script);
};

/** @private Called as a result of a request timeout */
dwr.engine._abortRequest = function(batch) {
    if (batch && !batch.completed) {
        dwr.engine._clearUp(batch);
        if (batch.req) batch.req.abort();
        dwr.engine._handleError(batch, { name:"dwr.engine.timeout", message:"Timeout" });
    }
};

/** @private call all the post hooks for a batch */
dwr.engine._callPostHooks = function(batch) {
    if (batch.postHooks) {
        for (var i = 0; i < batch.postHooks.length; i++) {
            batch.postHooks[i]();
        }
        batch.postHooks = null;
    }
};

/** @private A call has finished by whatever means and we need to shut it all down. */
dwr.engine._clearUp = function(batch) {
    if (!batch) { dwr.engine._debug("Warning: null batch in dwr.engine._clearUp()", true); return; }
    if (batch.completed) { dwr.engine._debug("Warning: Double complete", true); return; }

    // IFrame tidyup
    if (batch.div) batch.div.parentNode.removeChild(batch.div);
    if (batch.iframe) {
        // If this is a poll frame then stop comet polling
        for (var i = 0; i < dwr.engine._outstandingIFrames.length; i++) {
            if (dwr.engine._outstandingIFrames[i] == batch.iframe) {
                dwr.engine._outstandingIFrames.splice(i, 1);
            }
        }
        batch.iframe.parentNode.removeChild(batch.iframe);
    }
    if (batch.form) batch.form.parentNode.removeChild(batch.form);

    // XHR tidyup: avoid IE handles increase
    if (batch.req) {
        // If this is a poll frame then stop comet polling
        if (batch.req == dwr.engine._pollReq) dwr.engine._pollReq = null;
        delete batch.req;
    }

    // Timeout tidyup
    if (batch.timeoutId) {
        clearTimeout(batch.timeoutId);
        delete batch.timeoutId;
    }

    if (batch.map && (batch.map.batchId || batch.map.batchId == 0)) {
        delete dwr.engine._batches[batch.map.batchId];
        dwr.engine._batchesLength--;
    }

    batch.completed = true;

    // If there is anything on the queue waiting to go out, then send it.
    // We don't need to check for ordered mode, here because when ordered mode
    // gets turned off, we still process *waiting* batches in an ordered way.
    if (dwr.engine._batchQueue.length != 0) {
        var sendbatch = dwr.engine._batchQueue.shift();
        dwr.engine._sendData(sendbatch);
    }
};

/** @private Abort any XHRs in progress at page unload (solves zombie socket problems in IE). */
dwr.engine._unloader = function() {
    dwr.engine._unloading = true;

    // Empty queue of waiting ordered requests
    dwr.engine._batchQueue.length = 0;

    // Abort any ongoing XHRs and clear their batches
    for (var batchId in dwr.engine._batches) {
        var batch = dwr.engine._batches[batchId];
        // Only process objects that look like batches (avoid prototype additions!)
        if (batch && batch.map) {
            if (batch.req) {
                batch.req.abort();
            }
            dwr.engine._clearUp(batch);
        }
    }
};
// Now register the unload handler
if (window.addEventListener) window.addEventListener('unload', dwr.engine._unloader, false);
else if (window.attachEvent) window.attachEvent('onunload', dwr.engine._unloader);

/** @private Generic error handling routing to save having null checks everywhere */
dwr.engine._handleError = function(batch, ex) {
    if (typeof ex == "string") ex = { name:"unknown", message:ex };
    if (ex.message == null) ex.message = "";
    if (ex.name == null) ex.name = "unknown";
    if (batch && typeof batch.errorHandler == "function") batch.errorHandler(ex.message, ex);
    else if (dwr.engine._errorHandler) dwr.engine._errorHandler(ex.message, ex);
    if (batch) dwr.engine._clearUp(batch);
};

/** @private Generic error handling routing to save having null checks everywhere */
dwr.engine._handleWarning = function(batch, ex) {
    if (typeof ex == "string") ex = { name:"unknown", message:ex };
    if (ex.message == null) ex.message = "";
    if (ex.name == null) ex.name = "unknown";
    if (batch && typeof batch.warningHandler == "function") batch.warningHandler(ex.message, ex);
    else if (dwr.engine._warningHandler) dwr.engine._warningHandler(ex.message, ex);
    if (batch) dwr.engine._clearUp(batch);
};

/**
 * @private Marshall a data item
 * @param batch A map of variables to how they have been marshalled
 * @param referto An array of already marshalled variables to prevent recurrsion
 * @param data The data to be marshalled
 * @param name The name of the data being marshalled
 */
dwr.engine._serializeAll = function(batch, referto, data, name) {
    if (data == null) {
        batch.map[name] = "null:null";
        return;
    }

    switch (typeof data) {
        case "boolean":
            batch.map[name] = "boolean:" + data;
            break;
        case "number":
            batch.map[name] = "number:" + data;
            break;
        case "string":
            batch.map[name] = "string:" + encodeURIComponent(data);
            break;
        case "object":
            if (data instanceof String) batch.map[name] = "String:" + encodeURIComponent(data);
            else if (data instanceof Boolean) batch.map[name] = "Boolean:" + data;
            else if (data instanceof Number) batch.map[name] = "Number:" + data;
            else if (data instanceof Date) batch.map[name] = "Date:" + data.getTime();
            else if (data && data.join) batch.map[name] = dwr.engine._serializeArray(batch, referto, data, name);
            else batch.map[name] = dwr.engine._serializeObject(batch, referto, data, name);
            break;
        case "function":
            // We just ignore functions.
            break;
        default:
            dwr.engine._handleWarning(null, { name:"dwr.engine.unexpectedType", message:"Unexpected type: " + typeof data + ", attempting default converter." });
            batch.map[name] = "default:" + data;
            break;
    }
};

/** @private Have we already converted this object? */
dwr.engine._lookup = function(referto, data, name) {
    var lookup;
    // Can't use a map: getahead.org/ajax/javascript-gotchas
    for (var i = 0; i < referto.length; i++) {
        if (referto[i].data == data) {
            lookup = referto[i];
            break;
        }
    }
    if (lookup) return "reference:" + lookup.name;
    referto.push({ data:data, name:name });
    return null;
};

/** @private Marshall an object */
dwr.engine._serializeObject = function(batch, referto, data, name) {
    var ref = dwr.engine._lookup(referto, data, name);
    if (ref) return ref;

    // This check for an HTML is not complete, but is there a better way?
    // Maybe we should add: data.hasChildNodes typeof "function" == true
    if (data.nodeName && data.nodeType) {
        return dwr.engine._serializeXml(batch, referto, data, name);
    }

    // treat objects as an associative arrays
    var reply = "Object_" + dwr.engine._getObjectClassName(data) + ":{";
    var element;
    for (element in data) {
        if (typeof data[element] != "function") {
            batch.paramCount++;
            var childName = "c" + dwr.engine._batch.map.callCount + "-e" + batch.paramCount;
            dwr.engine._serializeAll(batch, referto, data[element], childName);

            reply += encodeURIComponent(element) + ":reference:" + childName + ", ";
        }
    }

    if (reply.substring(reply.length - 2) == ", ") {
        reply = reply.substring(0, reply.length - 2);
    }
    reply += "}";

    return reply;
};

/** @private Returns the classname of supplied argument obj */
dwr.engine._errorClasses = { "Error":Error, "EvalError":EvalError, "RangeError":RangeError, "ReferenceError":ReferenceError, "SyntaxError":SyntaxError, "TypeError":TypeError, "URIError":URIError };
dwr.engine._getObjectClassName = function(obj) {
    // Try to find the classname by stringifying the object's constructor
    // and extract <class> from "function <class>".
    if (obj && obj.constructor && obj.constructor.toString)
    {
        var str = obj.constructor.toString();
        var regexpmatch = str.match(/function\s+(\w+)/);
        if (regexpmatch && regexpmatch.length == 2) {
            return regexpmatch[1];
        }
    }

    // Now manually test against the core Error classes, as these in some 
    // browsers successfully match to the wrong class in the 
    // Object.toString() test we will do later
    if (obj && obj.constructor) {
        for (var errorname in dwr.engine._errorClasses) {
            if (obj.constructor == dwr.engine._errorClasses[errorname]) return errorname;
        }
    }

    // Try to find the classname by calling Object.toString() on the object
    // and extracting <class> from "[object <class>]"
    if (obj) {
        var str = Object.prototype.toString.call(obj);
        var regexpmatch = str.match(/\[object\s+(\w+)/);
        if (regexpmatch && regexpmatch.length==2) {
            return regexpmatch[1];
        }
    }

    // Supplied argument was probably not an object, but what is better?
    return "Object";
};

/** @private Marshall an object */
dwr.engine._serializeXml = function(batch, referto, data, name) {
    var ref = dwr.engine._lookup(referto, data, name);
    if (ref) return ref;

    var output;
    if (window.XMLSerializer) output = new XMLSerializer().serializeToString(data);
    else if (data.toXml) output = data.toXml;
    else output = data.innerHTML;

    return "XML:" + encodeURIComponent(output);
};

/** @private Marshall an array */
dwr.engine._serializeArray = function(batch, referto, data, name) {
    var ref = dwr.engine._lookup(referto, data, name);
    if (ref) return ref;

    if (document.all && !window.opera) {
        // Use array joining on IE (fastest)
        var buf = ["Array:["];
        for (var i = 0; i < data.length; i++) {
            if (i != 0) buf.push(",");
            batch.paramCount++;
            var childName = "c" + dwr.engine._batch.map.callCount + "-e" + batch.paramCount;
            dwr.engine._serializeAll(batch, referto, data[i], childName);
            buf.push("reference:");
            buf.push(childName);
        }
        buf.push("]");
        reply = buf.join("");
    }
    else {
        // Use string concat on other browsers (fastest)
        var reply = "Array:[";
        for (var i = 0; i < data.length; i++) {
            if (i != 0) reply += ",";
            batch.paramCount++;
            var childName = "c" + dwr.engine._batch.map.callCount + "-e" + batch.paramCount;
            dwr.engine._serializeAll(batch, referto, data[i], childName);
            reply += "reference:";
            reply += childName;
        }
        reply += "]";
    }

    return reply;
};

/** @private Convert an XML string into a DOM object. */
dwr.engine._unserializeDocument = function(xml) {
    var dom;
    if (window.DOMParser) {
        var parser = new DOMParser();
        dom = parser.parseFromString(xml, "text/xml");
        if (!dom.documentElement || dom.documentElement.tagName == "parsererror") {
            var message = dom.documentElement.firstChild.data;
            message += "\n" + dom.documentElement.firstChild.nextSibling.firstChild.data;
            throw message;
        }
        return dom;
    }
    else if (window.ActiveXObject) {
        dom = dwr.engine._newActiveXObject(dwr.engine._DOMDocument);
        dom.loadXML(xml); // What happens on parse fail with IE?
        return dom;
    }
    else {
        var div = document.createElement("div");
        div.innerHTML = xml;
        return div;
    }
};

/** @param axarray An array of strings to attempt to create ActiveX objects from */
dwr.engine._newActiveXObject = function(axarray) {
    var returnValue;
    for (var i = 0; i < axarray.length; i++) {
        try {
            returnValue = new ActiveXObject(axarray[i]);
            break;
        }
        catch (ex) { /* ignore */ }
    }
    return returnValue;
};

/** @private Used internally when some message needs to get to the programmer */
dwr.engine._debug = function(message, stacktrace) {
    var written = false;
    try {
        if (window.console) {
            if (stacktrace && window.console.trace) window.console.trace();
            window.console.log(message);
            written = true;
        }
        else if (window.opera && window.opera.postError) {
            window.opera.postError(message);
            written = true;
        }
    }
    catch (ex) { /* ignore */ }

    if (!written) {
        var debug = document.getElementById("dwr-debug");
        if (debug) {
            var contents = message + "<br/>" + debug.innerHTML;
            if (contents.length > 2048) contents = contents.substring(0, 2048);
            debug.innerHTML = contents;
        }
    }
};


/*
 * Copyright 2005 Joe Walker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Declare an object to which we can add real functions.
 */
if (dwr == null) var dwr = {};
if (dwr.util == null) dwr.util = {};
if (DWRUtil == null) var DWRUtil = dwr.util;

/** @private The flag we use to decide if we should escape html */
dwr.util._escapeHtml = true;

/**
 * Set the global escapeHtml flag
 */
dwr.util.setEscapeHtml = function(escapeHtml) {
    dwr.util._escapeHtml = escapeHtml;
};

/** @private Work out from an options list and global settings if we should be esccaping */
dwr.util._shouldEscapeHtml = function(options) {
    if (options && options.escapeHtml != null) {
        return options.escapeHtml;
    }
    return dwr.util._escapeHtml;
};

/**
 * Return a string with &, < and > replaced with their entities
 * @see TODO
 */
dwr.util.escapeHtml = function(original) {
    return original.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
};

/**
 * Replace common XML entities with characters (see dwr.util.escapeHtml())
 * @see TODO
 */
dwr.util.unescapeHtml = function(original) {
    return original.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
};

/**
 * Replace characters dangerous for XSS reasons with visually similar characters
 * @see TODO
 */
dwr.util.replaceXmlCharacters = function(original) {
    original = original.replace("&", "+");
    original = original.replace("<", "\u2039");
    original = original.replace(">", "\u203A");
    original = original.replace("\'", "\u2018");
    original = original.replace("\"", "\u201C");
    return original;
};

/**
 * Return true iff the input string contains any XSS dangerous characters
 * @see TODO
 */
dwr.util.containsXssRiskyCharacters = function(original) {
    return (original.indexOf('&') != -1
        || original.indexOf('<') != -1
        || original.indexOf('>') != -1
        || original.indexOf('\'') != -1
        || original.indexOf('\"') != -1);
};

/**
 * Enables you to react to return being pressed in an input
 * @see http://getahead.org/dwr/browser/util/selectrange
 */
dwr.util.onReturn = function(event, action) {
    if (!event) event = window.event;
    if (event && event.keyCode && event.keyCode == 13) action();
};

/**
 * Select a specific range in a text box. Useful for 'google suggest' type functions.
 * @see http://getahead.org/dwr/browser/util/selectrange
 */
dwr.util.selectRange = function(ele, start, end) {
    ele = dwr.util._getElementById(ele, "selectRange()");
    if (ele == null) return;
    if (ele.setSelectionRange) {
        ele.setSelectionRange(start, end);
    }
    else if (ele.createTextRange) {
        var range = ele.createTextRange();
        range.moveStart("character", start);
        range.moveEnd("character", end - ele.value.length);
        range.select();
    }
    ele.focus();
};

/**
 * Find the element in the current HTML document with the given id or ids
 * @see http://getahead.org/dwr/browser/util/$
 */
if (document.getElementById) {
    dwr.util.byId = function() {
        var elements = new Array();
        for (var i = 0; i < arguments.length; i++) {
            var element = arguments[i];
            if (typeof element == 'string') {
                element = document.getElementById(element);
            }
            if (arguments.length == 1) {
                return element;
            }
            elements.push(element);
        }
        return elements;
    };
}
else if (document.all) {
    dwr.util.byId = function() {
        var elements = new Array();
        for (var i = 0; i < arguments.length; i++) {
            var element = arguments[i];
            if (typeof element == 'string') {
                element = document.all[element];
            }
            if (arguments.length == 1) {
                return element;
            }
            elements.push(element);
        }
        return elements;
    };
}

/**
 * Alias $ to dwr.util.byId
 * @see http://getahead.org/dwr/browser/util/$
 */
var $;
if (!$) {
    $ = dwr.util.byId;
}

/**
 * This function pretty-prints simple data or whole object graphs, f ex as an aid in debugging.
 * @see http://getahead.org/dwr/browser/util/todescriptivestring
 */
dwr.util.toDescriptiveString = function(data, showLevels, options) {
    if (showLevels === undefined) showLevels = 1;
    var opt = {};
    if (dwr.util._isObject(options)) opt = options;
    var defaultoptions = {
        escapeHtml:false,
        baseIndent: "",
        childIndent: "\u00A0\u00A0",
        lineTerminator: "\n",
        oneLineMaxItems: 5,
        shortStringMaxLength: 13,
        propertyNameMaxLength: 30
    };
    for (var p in defaultoptions) {
        if (!(p in opt)) {
            opt[p] = defaultoptions[p];
        }
    }

    var skipDomProperties = {
        document:true, ownerDocument:true,
        all:true,
        parentElement:true, parentNode:true, offsetParent:true,
        children:true, firstChild:true, lastChild:true,
        previousSibling:true, nextSibling:true,
        innerHTML:true, outerHTML:true,
        innerText:true, outerText:true, textContent:true,
        attributes:true,
        style:true, currentStyle:true, runtimeStyle:true,
        parentTextEdit:true
    };

    function recursive(data, showLevels, indentDepth, options) {
        var reply = "";
        try {
            // string
            if (typeof data == "string") {
                var str = data;
                if (showLevels == 0 && str.length > options.shortStringMaxLength)
                    str = str.substring(0, options.shortStringMaxLength-3) + "...";
                if (options.escapeHtml) {
                    // Do the escape separately for every line as escapeHtml() on some 
                    // browsers (IE) will strip line breaks and we want to preserve them
                    var lines = str.split("\n");
                    for (var i = 0; i < lines.length; i++) lines[i] = dwr.util.escapeHtml(lines[i]);
                    str = lines.join("\n");
                }
                if (showLevels == 0) { // Short format
                    str = str.replace(/\n|\r|\t/g, function(ch) {
                        switch (ch) {
                            case "\n": return "\\n";
                            case "\r": return "";
                            case "\t": return "\\t";
                        }
                    });
                }
                else { // Long format
                    str = str.replace(/\n|\r|\t/g, function(ch) {
                        switch (ch) {
                            case "\n": return options.lineTerminator + indent(indentDepth+1, options);
                            case "\r": return "";
                            case "\t": return "\\t";
                        }
                    });
                }
                reply = '"' + str + '"';
            }

            // function
            else if (typeof data == "function") {
                reply = "function";
            }

            // Array
            else if (dwr.util._isArray(data)) {
                if (showLevels == 0) { // Short format (don't show items)
                    if (data.length > 0)
                        reply = "[...]";
                    else
                        reply = "[]";
                }
                else { // Long format (show items)
                    var strarr = [];
                    strarr.push("[");
                    var count = 0;
                    for (var i = 0; i < data.length; i++) {
                        if (! (i in data)) continue;
                        var itemvalue = data[i];
                        if (count > 0) strarr.push(", ");
                        if (showLevels == 1) { // One-line format
                            if (count == options.oneLineMaxItems) {
                                strarr.push("...");
                                break;
                            }
                        }
                        else { // Multi-line format
                            strarr.push(options.lineTerminator + indent(indentDepth+1, options));
                        }
                        if (i != count) {
                            strarr.push(i);
                            strarr.push(":");
                        }
                        strarr.push(recursive(itemvalue, showLevels-1, indentDepth+1, options));
                        count++;
                    }
                    if (showLevels > 1) strarr.push(options.lineTerminator + indent(indentDepth, options));
                    strarr.push("]");
                    reply = strarr.join("");
                }
            }

            // Objects except Date
            else if (dwr.util._isObject(data) && !dwr.util._isDate(data)) {
                if (showLevels == 0) { // Short format (don't show properties)
                    reply = dwr.util._detailedTypeOf(data);
                }
                else { // Long format (show properties)
                    var strarr = [];
                    if (dwr.util._detailedTypeOf(data) != "Object") {
                        strarr.push(dwr.util._detailedTypeOf(data));
                        if (typeof data.valueOf() != "object") {
                            strarr.push(":");
                            strarr.push(recursive(data.valueOf(), 1, indentDepth, options));
                        }
                        strarr.push(" ");
                    }
                    strarr.push("{");
                    var isDomObject = dwr.util._isHTMLElement(data);
                    var count = 0;
                    for (var prop in data) {
                        var propvalue = data[prop];
                        if (isDomObject) {
                            if (!propvalue) continue;
                            if (typeof propvalue == "function") continue;
                            if (skipDomProperties[prop]) continue;
                            if (prop.toUpperCase() == prop) continue;
                        }
                        if (count > 0) strarr.push(", ");
                        if (showLevels == 1) { // One-line format
                            if (count == options.oneLineMaxItems) {
                                strarr.push("...");
                                break;
                            }
                        }
                        else { // Multi-line format
                            strarr.push(options.lineTerminator + indent(indentDepth+1, options));
                        }
                        strarr.push(prop.length > options.propertyNameMaxLength ? prop.substring(0, options.propertyNameMaxLength-3) + "..." : prop);
                        strarr.push(":");
                        strarr.push(recursive(propvalue, showLevels-1, indentDepth+1, options));
                        count++;
                    }
                    if (showLevels > 1 && count > 0) strarr.push(options.lineTerminator + indent(indentDepth, options));
                    strarr.push("}");
                    reply = strarr.join("");
                }
            }

            // undefined, null, number, boolean, Date
            else {
                reply = "" + data;
            }

            return reply;
        }
        catch(err) {
            return (err.message ? err.message : ""+err);
        }
    }

    function indent(count, options) {
        var strarr = [];
        strarr.push(options.baseIndent);
        for (var i=0; i<count; i++) {
            strarr.push(options.childIndent);
        }
        return strarr.join("");
    };

    return recursive(data, showLevels, 0, opt);
};

/**
 * Setup a GMail style loading message.
 * @see http://getahead.org/dwr/browser/util/useloadingmessage
 */
dwr.util.useLoadingMessage = function(message) {
    var loadingMessage;
    if (message) loadingMessage = message;
    else loadingMessage = "Loading";
    dwr.engine.setPreHook(function() {
        var disabledZone = dwr.util.byId('disabledZone');
        if (!disabledZone) {
            disabledZone = document.createElement('div');
            disabledZone.setAttribute('id', 'disabledZone');
            disabledZone.style.position = "absolute";
            disabledZone.style.zIndex = "1000";
            disabledZone.style.left = "0px";
            disabledZone.style.top = "0px";
            disabledZone.style.width = "100%";
            disabledZone.style.height = "100%";
            document.body.appendChild(disabledZone);
            var messageZone = document.createElement('div');
            messageZone.setAttribute('id', 'messageZone');
            messageZone.style.position = "absolute";
            messageZone.style.top = "0px";
            messageZone.style.right = "0px";
            messageZone.style.background = "red";
            messageZone.style.color = "white";
            messageZone.style.fontFamily = "Arial,Helvetica,sans-serif";
            messageZone.style.padding = "4px";
            disabledZone.appendChild(messageZone);
            var text = document.createTextNode(loadingMessage);
            messageZone.appendChild(text);
            dwr.util._disabledZoneUseCount = 1;
        }
        else {
            dwr.util.byId('messageZone').innerHTML = loadingMessage;
            disabledZone.style.visibility = 'visible';
            dwr.util._disabledZoneUseCount++;
        }
    });
    dwr.engine.setPostHook(function() {
        dwr.util._disabledZoneUseCount--;
        if (dwr.util._disabledZoneUseCount == 0) {
            dwr.util.byId('disabledZone').style.visibility = 'hidden';
        }
    });
};

/**
 * Set a global highlight handler
 */
dwr.util.setHighlightHandler = function(handler) {
    dwr.util._highlightHandler = handler;
};

/**
 * An example highlight handler
 */
dwr.util.yellowFadeHighlightHandler = function(ele) {
    dwr.util._yellowFadeProcess(ele, 0);
};
dwr.util._yellowFadeSteps = [ "d0", "b0", "a0", "90", "98", "a0", "a8", "b0", "b8", "c0", "c8", "d0", "d8", "e0", "e8", "f0", "f8" ];
dwr.util._yellowFadeProcess = function(ele, colorIndex) {
    ele = dwr.util.byId(ele);
    if (colorIndex < dwr.util._yellowFadeSteps.length) {
        ele.style.backgroundColor = "#ffff" + dwr.util._yellowFadeSteps[colorIndex];
        setTimeout("dwr.util._yellowFadeProcess('" + ele.id + "'," + (colorIndex + 1) + ")", 200);
    }
    else {
        ele.style.backgroundColor = "transparent";
    }
};

/**
 * An example highlight handler
 */
dwr.util.borderFadeHighlightHandler = function(ele) {
    ele.style.borderWidth = "2px";
    ele.style.borderStyle = "solid";
    dwr.util._borderFadeProcess(ele, 0);
};
dwr.util._borderFadeSteps = [ "d0", "b0", "a0", "90", "98", "a0", "a8", "b0", "b8", "c0", "c8", "d0", "d8", "e0", "e8", "f0", "f8" ];
dwr.util._borderFadeProcess = function(ele, colorIndex) {
    ele = dwr.util.byId(ele);
    if (colorIndex < dwr.util._borderFadeSteps.length) {
        ele.style.borderColor = "#ff" + dwr.util._borderFadeSteps[colorIndex] + dwr.util._borderFadeSteps[colorIndex];
        setTimeout("dwr.util._borderFadeProcess('" + ele.id + "'," + (colorIndex + 1) + ")", 200);
    }
    else {
        ele.style.backgroundColor = "transparent";
    }
};

/**
 * A focus highlight handler
 */
dwr.util.focusHighlightHandler = function(ele) {
    try {
        ele.focus();
    }
    catch (ex) { /* ignore */ }
};

/** @private the current global highlight style */
dwr.util._highlightHandler = null;

/**
 * Highlight that an element has changed
 */
dwr.util.highlight = function(ele, options) {
    if (options && options.highlightHandler) {
        options.highlightHandler(dwr.util.byId(ele));
    }
    else if (dwr.util._highlightHandler != null) {
        dwr.util._highlightHandler(dwr.util.byId(ele));
    }
};

/**
 * Set the value an HTML element to the specified value.
 * @see http://getahead.org/dwr/browser/util/setvalue
 */
dwr.util.setValue = function(ele, val, options) {
    if (val == null) val = "";
    if (options == null) options = {};

    var orig = ele;
    if (typeof ele == "string") {
        ele = dwr.util.byId(ele);
        // We can work with names and need to sometimes for radio buttons, and IE has
        // an annoying bug where getElementById() returns an element based on name if
        // it doesn't find it by id. Here we don't want to do that, so:
        if (ele && ele.id != orig) ele = null;
    }
    var nodes = null;
    if (ele == null) {
        // Now it is time to look by name
        nodes = document.getElementsByName(orig);
        if (nodes.length >= 1) ele = nodes.item(0);
    }

    if (ele == null) {
        dwr.util._debug("setValue() can't find an element with id/name: " + orig + ".");
        return;
    }

    // All paths now lead to some update so we highlight a change
    dwr.util.highlight(ele, options);

    if (dwr.util._isHTMLElement(ele, "select")) {
        if (ele.type == "select-multiple" && dwr.util._isArray(val)) dwr.util._selectListItems(ele, val);
        else dwr.util._selectListItem(ele, val);
        return;
    }

    if (dwr.util._isHTMLElement(ele, "input")) {
        if (ele.type == "radio" || ele.type == "checkbox") {
            if (nodes && nodes.length >= 1) {
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes.item(i);
                    if (node.type != ele.type) continue;
                    if (dwr.util._isArray(val)) {
                        node.checked = false;
                        for (var j = 0; j < val.length; j++)
                            if (val[j] == node.value) node.checked = true;
                    }
                    else {
                        node.checked = (node.value == val);
                    }
                }
            }
            else {
                ele.checked = (val == true);
            }
        }
        else ele.value = val;

        return;
    }

    if (dwr.util._isHTMLElement(ele, "textarea")) {
        ele.value = val;
        return;
    }

    // If the value to be set is a DOM object then we try importing the node
    // rather than serializing it out
    if (val.nodeType) {
        if (val.nodeType == 9 /*Node.DOCUMENT_NODE*/) val = val.documentElement;
        val = dwr.util._importNode(ele.ownerDocument, val, true);
        ele.appendChild(val);
        return;
    }

    // Fall back to innerHTML and friends
    if (dwr.util._shouldEscapeHtml(options) && typeof(val) == "string") {
        if (ele.textContent) ele.textContent = val;
        else if (ele.innerText) ele.innerText = val;
        else ele.innerHTML = dwr.util.escapeHtml(val);
    }
    else {
        ele.innerHTML = val;
    }
};

/**
 * @private Find multiple items in a select list and select them. Used by setValue()
 * @param ele The select list item
 * @param val The array of values to select
 */
dwr.util._selectListItems = function(ele, val) {
    // We deal with select list elements by selecting the matching option
    // Begin by searching through the values
    var found  = false;
    var i;
    var j;
    for (i = 0; i < ele.options.length; i++) {
        ele.options[i].selected = false;
        for (j = 0; j < val.length; j++) {
            if (ele.options[i].value == val[j]) {
                ele.options[i].selected = true;
            }
        }
    }
    // If that fails then try searching through the visible text
    if (found) return;

    for (i = 0; i < ele.options.length; i++) {
        for (j = 0; j < val.length; j++) {
            if (ele.options[i].text == val[j]) {
                ele.options[i].selected = true;
            }
        }
    }
};

/**
 * @private Find an item in a select list and select it. Used by setValue()
 * @param ele The select list item
 * @param val The value to select
 */
dwr.util._selectListItem = function(ele, val) {
    // We deal with select list elements by selecting the matching option
    // Begin by searching through the values
    var found = false;
    var i;
    for (i = 0; i < ele.options.length; i++) {
        if (ele.options[i].value == val) {
            ele.options[i].selected = true;
            found = true;
        }
        else {
            ele.options[i].selected = false;
        }
    }

    // If that fails then try searching through the visible text
    if (found) return;

    for (i = 0; i < ele.options.length; i++) {
        ele.options[i].selected = (ele.options[i].text == val);
    }
};

/**
 * Read the current value for a given HTML element.
 * @see http://getahead.org/dwr/browser/util/getvalue
 */
dwr.util.getValue = function(ele, options) {
    if (options == null) options = {};
    var orig = ele;
    if (typeof ele == "string") {
        ele = dwr.util.byId(ele);
        // We can work with names and need to sometimes for radio buttons, and IE has
        // an annoying bug where getElementById() returns an element based on name if
        // it doesn't find it by id. Here we don't want to do that, so:
        if (ele && ele.id != orig) ele = null;
    }
    var nodes = null;
    if (ele == null) {
        // Now it is time to look by name
        nodes = document.getElementsByName(orig);
        if (nodes.length >= 1) ele = nodes.item(0);
    }
    if (ele == null) {
        dwr.util._debug("getValue() can't find an element with id/name: " + orig + ".");
        return "";
    }

    if (dwr.util._isHTMLElement(ele, "select")) {
        // Using "type" property instead of "multiple" as "type" is an official 
        // client-side property since JS 1.1
        if (ele.type == "select-multiple") {
            var reply = new Array();
            for (var i = 0; i < ele.options.length; i++) {
                var item = ele.options[i];
                if (item.selected) {
                    var valueAttr = item.getAttributeNode("value");
                    if (valueAttr && valueAttr.specified) {
                        reply.push(item.value);
                    }
                    else {
                        reply.push(item.text);
                    }
                }
            }
            return reply;
        }
        else {
            var sel = ele.selectedIndex;
            if (sel != -1) {
                var item = ele.options[sel];
                var valueAttr = item.getAttributeNode("value");
                if (valueAttr && valueAttr.specified) {
                    return item.value;
                }
                return item.text;
            }
            else {
                return "";
            }
        }
    }

    if (dwr.util._isHTMLElement(ele, "input")) {
        if (ele.type == "radio") {
            if (nodes && nodes.length >= 1) {
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes.item(i);
                    if (node.type == ele.type) {
                        if (node.checked) return node.value;
                    }
                }
            }
            return ele.checked;
        }
        if (ele.type == "checkbox") {
            if (nodes && nodes.length >= 1) {
                var reply = [];
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes.item(i);
                    if (node.type == ele.type) {
                        if (node.checked) reply.push(node.value);
                    }
                }
                return reply;
            }
            return ele.checked;
        }
        return ele.value;
    }

    if (dwr.util._isHTMLElement(ele, "textarea")) {
        return ele.value;
    }

    if (dwr.util._shouldEscapeHtml(options)) {
        if (ele.textContent) return ele.textContent;
        else if (ele.innerText) return ele.innerText;
    }
    return ele.innerHTML;
};

/**
 * getText() is like getValue() except that it reads the text (and not the value) from select elements
 * @see http://getahead.org/dwr/browser/util/gettext
 */
dwr.util.getText = function(ele) {
    ele = dwr.util._getElementById(ele, "getText()");
    if (ele == null) return null;
    if (!dwr.util._isHTMLElement(ele, "select")) {
        dwr.util._debug("getText() can only be used with select elements. Attempt to use: " + dwr.util._detailedTypeOf(ele) + " from  id: " + orig + ".");
        return "";
    }

    // This is a bit of a scam because it assumes single select
    // but I'm not sure how we should treat multi-select.
    var sel = ele.selectedIndex;
    if (sel != -1) {
        return ele.options[sel].text;
    }
    else {
        return "";
    }
};

/**
 * Given a map, or a recursive structure consisting of arrays and maps, call
 * setValue() for all leaf entries and use intermediate levels to form nested
 * element ids.
 * @see http://getahead.org/dwr/browser/util/setvalues
 */
dwr.util.setValues = function(data, options) {
    var prefix = "";
    if (options && options.prefix) prefix = options.prefix;
    if (options && options.idPrefix) prefix = options.idPrefix;
    dwr.util._setValuesRecursive(data, prefix);
};

/**
 * @private Recursive helper for setValues()
 */
dwr.util._setValuesRecursive = function(data, idpath) {
    // Array containing objects -> add "[n]" to prefix and make recursive call
    // for each item object
    if (dwr.util._isArray(data) && data.length > 0 && dwr.util._isObject(data[0])) {
        for (var i = 0; i < data.length; i++) {
            dwr.util._setValuesRecursive(data[i], idpath+"["+i+"]");
        }
    }
    // Object (not array) -> handle nested object properties
    else if (dwr.util._isObject(data) && !dwr.util._isArray(data)) {
        for (var prop in data) {
            var subidpath = idpath ? idpath+"."+prop : prop;
            // Object (not array), or array containing objects -> call ourselves recursively
            if (dwr.util._isObject(data[prop]) && !dwr.util._isArray(data[prop])
                || dwr.util._isArray(data[prop]) && data[prop].length > 0 && dwr.util._isObject(data[prop][0])) {
                dwr.util._setValuesRecursive(data[prop], subidpath);
            }
            // Functions -> skip
            else if (typeof data[prop] == "function") {
                // NOP
            }
            // Only simple values left (or array of simple values, or empty array)
            // -> call setValue()
            else {
                // Are there any elements with that id or name
                if (dwr.util.byId(subidpath) != null || document.getElementsByName(subidpath).length >= 1) {
                    dwr.util.setValue(subidpath, data[prop]);
                }
            }
        }
    }
};

/**
 * Given a map, or a recursive structure consisting of arrays and maps, call
 * getValue() for all leaf entries and use intermediate levels to form nested
 * element ids.
 * Given a string or element that refers to a form, create an object from the
 * elements of the form.
 * @see http://getahead.org/dwr/browser/util/getvalues
 */
dwr.util.getValues = function(data, options) {
    if (typeof data == "string" || dwr.util._isHTMLElement(data)) {
        return dwr.util.getFormValues(data);
    }
    else {
        var prefix = "";
        if (options != null && options.prefix) prefix = options.prefix;
        if (options != null && options.idPrefix) prefix = options.idPrefix;
        dwr.util._getValuesRecursive(data, prefix);
        return data;
    }
};

/**
 * Given a string or element that refers to a form, create an object from the
 * elements of the form.
 * @see http://getahead.org/dwr/browser/util/getvalues
 */
dwr.util.getFormValues = function(eleOrNameOrId) {
    var ele = null;
    if (typeof eleOrNameOrId == "string") {
        ele = document.forms[eleOrNameOrId];
        if (ele == null) ele = dwr.util.byId(eleOrNameOrId);
    }
    else if (dwr.util._isHTMLElement(eleOrNameOrId)) {
        ele = eleOrNameOrId;
    }
    if (ele != null) {
        if (ele.elements == null) {
            alert("getFormValues() requires an object or reference to a form element.");
            return null;
        }
        var reply = {};
        var name;
        var value;
        for (var i = 0; i < ele.elements.length; i++) {
            if (ele[i].type in {button:0,submit:0,reset:0,image:0,file:0}) continue;
            if (ele[i].name) {
                name = ele[i].name;
                value = dwr.util.getValue(name);
            }
            else {
                if (ele[i].id) name = ele[i].id;
                else name = "element" + i;
                value = dwr.util.getValue(ele[i]);
            }
            reply[name] = value;
        }
        return reply;
    }
};

/**
 * @private Recursive helper for getValues().
 */
dwr.util._getValuesRecursive = function(data, idpath) {
    // Array containing objects -> add "[n]" to idpath and make recursive call
    // for each item object
    if (dwr.util._isArray(data) && data.length > 0 && dwr.util._isObject(data[0])) {
        for (var i = 0; i < data.length; i++) {
            dwr.util._getValuesRecursive(data[i], idpath+"["+i+"]");
        }
    }
    // Object (not array) -> handle nested object properties
    else if (dwr.util._isObject(data) && !dwr.util._isArray(data)) {
        for (var prop in data) {
            var subidpath = idpath ? idpath+"."+prop : prop;
            // Object, or array containing objects -> call ourselves recursively
            if (dwr.util._isObject(data[prop]) && !dwr.util._isArray(data[prop])
                || dwr.util._isArray(data[prop]) && data[prop].length > 0 && dwr.util._isObject(data[prop][0])) {
                dwr.util._getValuesRecursive(data[prop], subidpath);
            }
            // Functions -> skip
            else if (typeof data[prop] == "function") {
                // NOP
            }
            // Only simple values left (or array of simple values, or empty array)
            // -> call getValue()
            else {
                // Are there any elements with that id or name
                if (dwr.util.byId(subidpath) != null || document.getElementsByName(subidpath).length >= 1) {
                    data[prop] = dwr.util.getValue(subidpath);
                }
            }
        }
    }
};

/**
 * Add options to a list from an array or map.
 * @see http://getahead.org/dwr/browser/lists
 */
dwr.util.addOptions = function(ele, data/*, options*/) {
    ele = dwr.util._getElementById(ele, "addOptions()");
    if (ele == null) return;
    var useOptions = dwr.util._isHTMLElement(ele, "select");
    var useLi = dwr.util._isHTMLElement(ele, ["ul", "ol"]);
    if (!useOptions && !useLi) {
        dwr.util._debug("addOptions() can only be used with select/ul/ol elements. Attempt to use: " + dwr.util._detailedTypeOf(ele));
        return;
    }
    if (data == null) return;

    var argcount = arguments.length;
    var options = {};
    var lastarg = arguments[argcount - 1];
    if (argcount > 2 && dwr.util._isObject(lastarg)) {
        options = lastarg;
        argcount--;
    }
    var arg3 = null; if (argcount >= 3) arg3 = arguments[2];
    var arg4 = null; if (argcount >= 4) arg4 = arguments[3];
    if (!options.optionCreator && useOptions) options.optionCreator = dwr.util._defaultOptionCreator;
    if (!options.optionCreator && useLi) options.optionCreator = dwr.util._defaultListItemCreator;

    var text, value, li;
    if (dwr.util._isArray(data)) {
        // Loop through the data that we do have
        for (var i = 0; i < data.length; i++) {
            options.data = data[i];
            options.text = null;
            options.value = null;
            if (useOptions) {
                if (arg3 != null) {
                    if (arg4 != null) {
                        options.text = dwr.util._getValueFrom(data[i], arg4);
                        options.value = dwr.util._getValueFrom(data[i], arg3);
                    }
                    else options.text = options.value = dwr.util._getValueFrom(data[i], arg3);
                }
                else options.text = options.value = dwr.util._getValueFrom(data[i]);

                if (options.text != null || options.value) {
                    var opt = options.optionCreator(options);
                    opt.text = options.text;
                    opt.value = options.value;
                    ele.options[ele.options.length] = opt;
                }
            }
            else {
                options.value = dwr.util._getValueFrom(data[i], arg3);
                if (options.value != null) {
                    li = options.optionCreator(options);
                    if (dwr.util._shouldEscapeHtml(options)) {
                        options.value = dwr.util.escapeHtml(options.value);
                    }
                    li.innerHTML = options.value;
                    ele.appendChild(li);
                }
            }
        }
    }
    else if (arg4 != null) {
        if (!useOptions) {
            alert("dwr.util.addOptions can only create select lists from objects.");
            return;
        }
        for (var prop in data) {
            options.data = data[prop];
            options.value = dwr.util._getValueFrom(data[prop], arg3);
            options.text = dwr.util._getValueFrom(data[prop], arg4);

            if (options.text != null || options.value) {
                var opt = options.optionCreator(options);
                opt.text = options.text;
                opt.value = options.value;
                ele.options[ele.options.length] = opt;
            }
        }
    }
    else {
        if (!useOptions) {
            dwr.util._debug("dwr.util.addOptions can only create select lists from objects.");
            return;
        }
        for (var prop in data) {
            if (typeof data[prop] == "function") continue;
            options.data = data[prop];
            if (!arg3) {
                options.value = prop;
                options.text = data[prop];
            }
            else {
                options.value = data[prop];
                options.text = prop;
            }
            if (options.text != null || options.value) {
                var opt = options.optionCreator(options);
                opt.text = options.text;
                opt.value = options.value;
                ele.options[ele.options.length] = opt;
            }
        }
    }

    // All error routes through this function result in a return, so highlight now
    dwr.util.highlight(ele, options);
};

/**
 * @private Get the data from an array function for dwr.util.addOptions
 */
dwr.util._getValueFrom = function(data, method) {
    if (method == null) return data;
    else if (typeof method == 'function') return method(data);
    else return data[method];
};

/**
 * @private Default option creation function
 */
dwr.util._defaultOptionCreator = function(options) {
    return new Option();
};

/**
 * @private Default list item creation function
 */
dwr.util._defaultListItemCreator = function(options) {
    return document.createElement("li");
};

/**
 * Remove all the options from a select list (specified by id)
 * @see http://getahead.org/dwr/browser/lists
 */
dwr.util.removeAllOptions = function(ele) {
    ele = dwr.util._getElementById(ele, "removeAllOptions()");
    if (ele == null) return;
    var useOptions = dwr.util._isHTMLElement(ele, "select");
    var useLi = dwr.util._isHTMLElement(ele, ["ul", "ol"]);
    if (!useOptions && !useLi) {
        dwr.util._debug("removeAllOptions() can only be used with select, ol and ul elements. Attempt to use: " + dwr.util._detailedTypeOf(ele));
        return;
    }
    if (useOptions) {
        ele.options.length = 0;
    }
    else {
        while (ele.childNodes.length > 0) {
            ele.removeChild(ele.firstChild);
        }
    }
};

/**
 * Create rows inside a the table, tbody, thead or tfoot element (given by id).
 * @see http://getahead.org/dwr/browser/tables
 */
dwr.util.addRows = function(ele, data, cellFuncs, options) {
    ele = dwr.util._getElementById(ele, "addRows()");
    if (ele == null) return;
    if (!dwr.util._isHTMLElement(ele, ["table", "tbody", "thead", "tfoot"])) {
        dwr.util._debug("addRows() can only be used with table, tbody, thead and tfoot elements. Attempt to use: " + dwr.util._detailedTypeOf(ele));
        return;
    }
    if (!options) options = {};
    if (!options.rowCreator) options.rowCreator = dwr.util._defaultRowCreator;
    if (!options.cellCreator) options.cellCreator = dwr.util._defaultCellCreator;
    var tr, rowNum;
    if (dwr.util._isArray(data)) {
        for (rowNum = 0; rowNum < data.length; rowNum++) {
            options.rowData = data[rowNum];
            options.rowIndex = rowNum;
            options.rowNum = rowNum;
            options.data = null;
            options.cellNum = -1;
            tr = dwr.util._addRowInner(cellFuncs, options);
            if (tr != null) ele.appendChild(tr);
        }
    }
    else if (typeof data == "object") {
        rowNum = 0;
        for (var rowIndex in data) {
            options.rowData = data[rowIndex];
            options.rowIndex = rowIndex;
            options.rowNum = rowNum;
            options.data = null;
            options.cellNum = -1;
            tr = dwr.util._addRowInner(cellFuncs, options);
            if (tr != null) ele.appendChild(tr);
            rowNum++;
        }
    }

    dwr.util.highlight(ele, options);
};

/**
 * @private Internal function to draw a single row of a table.
 */
dwr.util._addRowInner = function(cellFuncs, options) {
    var tr = options.rowCreator(options);
    if (tr == null) return null;
    for (var cellNum = 0; cellNum < cellFuncs.length; cellNum++) {
        var func = cellFuncs[cellNum];
        if (typeof func == 'function') options.data = func(options.rowData, options);
        else options.data = func || "";
        options.cellNum = cellNum;
        var td = options.cellCreator(options);
        if (td != null) {
            if (options.data != null) {
                if (dwr.util._isHTMLElement(options.data)) td.appendChild(options.data);
                else {
                    if (dwr.util._shouldEscapeHtml(options) && typeof(options.data) == "string") {
                        td.innerHTML = dwr.util.escapeHtml(options.data);
                    }
                    else {
                        td.innerHTML = options.data;
                    }
                }
            }
            tr.appendChild(td);
        }
    }
    return tr;
};

/**
 * @private Default row creation function
 */
dwr.util._defaultRowCreator = function(options) {
    return document.createElement("tr");
};

/**
 * @private Default cell creation function
 */
dwr.util._defaultCellCreator = function(options) {
    return document.createElement("td");
};

/**
 * Remove all the children of a given node.
 * @see http://getahead.org/dwr/browser/tables
 */
dwr.util.removeAllRows = function(ele, options) {
    ele = dwr.util._getElementById(ele, "removeAllRows()");
    if (ele == null) return;
    if (!options) options = {};
    if (!options.filter) options.filter = function() { return true; };
    if (!dwr.util._isHTMLElement(ele, ["table", "tbody", "thead", "tfoot"])) {
        dwr.util._debug("removeAllRows() can only be used with table, tbody, thead and tfoot elements. Attempt to use: " + dwr.util._detailedTypeOf(ele));
        return;
    }
    var child = ele.firstChild;
    var next;
    while (child != null) {
        next = child.nextSibling;
        if (options.filter(child)) {
            ele.removeChild(child);
        }
        child = next;
    }
};

/**
 * dwr.util.byId(ele).className = "X", that we can call from Java easily.
 */
dwr.util.setClassName = function(ele, className) {
    ele = dwr.util._getElementById(ele, "setClassName()");
    if (ele == null) return;
    ele.className = className;
};

/**
 * dwr.util.byId(ele).className += "X", that we can call from Java easily.
 */
dwr.util.addClassName = function(ele, className) {
    ele = dwr.util._getElementById(ele, "addClassName()");
    if (ele == null) return;
    ele.className += " " + className;
};

/**
 * dwr.util.byId(ele).className -= "X", that we can call from Java easily
 * From code originally by Gavin Kistner
 */
dwr.util.removeClassName = function(ele, className) {
    ele = dwr.util._getElementById(ele, "removeClassName()");
    if (ele == null) return;
    var regex = new RegExp("(^|\\s)" + className + "(\\s|$)", 'g');
    ele.className = ele.className.replace(regex, '');
};

/**
 * dwr.util.byId(ele).className |= "X", that we can call from Java easily.
 */
dwr.util.toggleClassName = function(ele, className) {
    ele = dwr.util._getElementById(ele, "toggleClassName()");
    if (ele == null) return;
    var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");
    if (regex.test(ele.className)) {
        ele.className = ele.className.replace(regex, '');
    }
    else {
        ele.className += " " + className;
    }
};

/**
 * Clone a node and insert it into the document just above the 'template' node
 * @see http://getahead.org/dwr/???
 */
dwr.util.cloneNode = function(ele, options) {
    ele = dwr.util._getElementById(ele, "cloneNode()");
    if (ele == null) return null;
    if (options == null) options = {};
    var clone = ele.cloneNode(true);
    if (options.idPrefix || options.idSuffix) {
        dwr.util._updateIds(clone, options);
    }
    else {
        dwr.util._removeIds(clone);
    }
    ele.parentNode.insertBefore(clone, ele);
    return clone;
};

/**
 * @private Update all of the ids in an element tree
 */
dwr.util._updateIds = function(ele, options) {
    if (options == null) options = {};
    if (ele.id) {
        ele.setAttribute("id", (options.idPrefix || "") + ele.id + (options.idSuffix || ""));
    }
    var children = ele.childNodes;
    for (var i = 0; i < children.length; i++) {
        var child = children.item(i);
        if (child.nodeType == 1 /*Node.ELEMENT_NODE*/) {
            dwr.util._updateIds(child, options);
        }
    }
};

/**
 * @private Remove all the Ids from an element
 */
dwr.util._removeIds = function(ele) {
    if (ele.id) ele.removeAttribute("id");
    var children = ele.childNodes;
    for (var i = 0; i < children.length; i++) {
        var child = children.item(i);
        if (child.nodeType == 1 /*Node.ELEMENT_NODE*/) {
            dwr.util._removeIds(child);
        }
    }
};

/**
 * Clone a template node and its embedded template child nodes according to
 * cardinalities (of arrays) in supplied data.
 */
dwr.util.cloneNodeForValues = function(templateEle, data, options) {
    templateEle = dwr.util._getElementById(templateEle, "cloneNodeForValues()");
    if (templateEle == null) return null;
    if (options == null) options = {};
    var idpath;
    if (options.idPrefix != null)
        idpath = options.idPrefix;
    else
        idpath = templateEle.id || "";
    return dwr.util._cloneNodeForValuesRecursive(templateEle, data, idpath, options);
};

/**
 * @private Recursive helper for cloneNodeForValues().
 */
dwr.util._cloneNodeForValuesRecursive = function(templateEle, data, idpath, options) {
    // Incoming array -> make an id for each item and call clone of the template 
    // for each of them
    if (dwr.util._isArray(data)) {
        var clones = [];
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var clone = dwr.util._cloneNodeForValuesRecursive(templateEle, item, idpath + "[" + i + "]", options);
            clones.push(clone);
        }
        return clones;
    }
    else
    // Incoming object (not array) -> clone the template, add id prefixes, add 
    // clone to DOM, and then recurse into any array properties if they contain 
    // objects and there is a suitable template
    if (dwr.util._isObject(data) && !dwr.util._isArray(data)) {
        var clone = templateEle.cloneNode(true);
        if (options.updateCloneStyle && clone.style) {
            for (var propname in options.updateCloneStyle) {
                clone.style[propname] = options.updateCloneStyle[propname];
            }
        }
        dwr.util._replaceIds(clone, templateEle.id, idpath);
        templateEle.parentNode.insertBefore(clone, templateEle);
        dwr.util._cloneSubArrays(data, idpath, options);
        return clone;
    }

    // It is an error to end up here so we return nothing
    return null;
};

/**
 * @private Substitute a leading idpath fragment with another idpath for all
 * element ids tree, and remove ids that don't match the idpath.
 */
dwr.util._replaceIds = function(ele, oldidpath, newidpath) {
    if (ele.id) {
        var newId = null;
        if (ele.id == oldidpath) {
            newId = newidpath;
        }
        else if (ele.id.length > oldidpath.length) {
            if (ele.id.substr(0, oldidpath.length) == oldidpath) {
                var trailingChar = ele.id.charAt(oldidpath.length);
                if (trailingChar == "." || trailingChar == "[") {
                    newId = newidpath + ele.id.substr(oldidpath.length);
                }
            }
        }
        if (newId) {
            ele.setAttribute("id", newId);
        }
        else {
            ele.removeAttribute("id");
        }
    }
    var children = ele.childNodes;
    for (var i = 0; i < children.length; i++) {
        var child = children.item(i);
        if (child.nodeType == 1 /*Node.ELEMENT_NODE*/) {
            dwr.util._replaceIds(child, oldidpath, newidpath);
        }
    }
};

/**
 * @private Finds arrays in supplied data and uses any corresponding template
 * node to make a clone for each item in the array.
 */
dwr.util._cloneSubArrays = function(data, idpath, options) {
    for (prop in data) {
        var value = data[prop];
        // Look for potential recursive cloning in all array properties
        if (dwr.util._isArray(value)) {
            // Only arrays with objects are interesting for cloning
            if (value.length > 0 && dwr.util._isObject(value[0])) {
                var subTemplateId = idpath + "." + prop;
                var subTemplateEle = dwr.util.byId(subTemplateId);
                if (subTemplateEle != null) {
                    dwr.util._cloneNodeForValuesRecursive(subTemplateEle, value, subTemplateId, options);
                }
            }
        }
        // Continue looking for arrays in object properties
        else if (dwr.util._isObject(value)) {
            dwr.util._cloneSubArrays(value, idpath + "." + prop, options);
        }
    }
};

/**
 * @private Helper to turn a string into an element with an error message
 */
dwr.util._getElementById = function(ele, source) {
    var orig = ele;
    ele = dwr.util.byId(ele);
    if (ele == null) {
        dwr.util._debug(source + " can't find an element with id: " + orig + ".");
    }
    return ele;
};

/**
 * @private Is the given node an HTML element (optionally of a given type)?
 * @param ele The element to test
 * @param nodeName eg "input", "textarea" - check for node name (optional)
 *         if nodeName is an array then check all for a match.
 */
dwr.util._isHTMLElement = function(ele, nodeName) {
    if (ele == null || typeof ele != "object" || ele.nodeName == null) {
        return false;
    }
    if (nodeName != null) {
        var test = ele.nodeName.toLowerCase();
        if (typeof nodeName == "string") {
            return test == nodeName.toLowerCase();
        }
        if (dwr.util._isArray(nodeName)) {
            var match = false;
            for (var i = 0; i < nodeName.length && !match; i++) {
                if (test == nodeName[i].toLowerCase()) {
                    match =  true;
                }
            }
            return match;
        }
        dwr.util._debug("dwr.util._isHTMLElement was passed test node name that is neither a string or array of strings");
        return false;
    }
    return true;
};

/**
 * @private Like typeOf except that more information for an object is returned other than "object"
 */
dwr.util._detailedTypeOf = function(x) {
    var reply = typeof x;
    if (reply == "object") {
        reply = Object.prototype.toString.apply(x); // Returns "[object class]"
        reply = reply.substring(8, reply.length-1);  // Just get the class bit
    }
    return reply;
};

/**
 * @private Object detector. Excluding null from objects.
 */
dwr.util._isObject = function(data) {
    return (data && typeof data == "object");
};

/**
 * @private Array detector. Note: instanceof doesn't work with multiple frames.
 */
dwr.util._isArray = function(data) {
    return (data && data.join);
};

/**
 * @private Date detector. Note: instanceof doesn't work with multiple frames.
 */
dwr.util._isDate = function(data) {
    return (data && data.toUTCString) ? true : false;
};

/**
 * @private Used by setValue. Gets around the missing functionallity in IE.
 */
dwr.util._importNode = function(doc, importedNode, deep) {
    var newNode;

    if (importedNode.nodeType == 1 /*Node.ELEMENT_NODE*/) {
        newNode = doc.createElement(importedNode.nodeName);

        for (var i = 0; i < importedNode.attributes.length; i++) {
            var attr = importedNode.attributes[i];
            if (attr.nodeValue != null && attr.nodeValue != '') {
                newNode.setAttribute(attr.name, attr.nodeValue);
            }
        }

        if (typeof importedNode.style != "undefined") {
            newNode.style.cssText = importedNode.style.cssText;
        }
    }
    else if (importedNode.nodeType == 3 /*Node.TEXT_NODE*/) {
        newNode = doc.createTextNode(importedNode.nodeValue);
    }

    if (deep && importedNode.hasChildNodes()) {
        for (i = 0; i < importedNode.childNodes.length; i++) {
            newNode.appendChild(dwr.util._importNode(doc, importedNode.childNodes[i], true));
        }
    }

    return newNode;
};

/** @private Used internally when some message needs to get to the programmer */
dwr.util._debug = function(message, stacktrace) {
    var written = false;
    try {
        if (window.console) {
            if (stacktrace && window.console.trace) window.console.trace();
            window.console.log(message);
            written = true;
        }
        else if (window.opera && window.opera.postError) {
            window.opera.postError(message);
            written = true;
        }
    }
    catch (ex) { /* ignore */ }

    if (!written) {
        var debug = document.getElementById("dwr-debug");
        if (debug) {
            var contents = message + "<br/>" + debug.innerHTML;
            if (contents.length > 2048) contents = contents.substring(0, 2048);
            debug.innerHTML = contents;
        }
    }
};


/**
 * “No Class By Name”监控
 */


/**
 * The default message handler.
 * @see getahead.org/dwr/browser/engine/errors
 */
dwr.engine.defaultErrorHandler = function(message, ex) {

    if (ex.message.indexOf("No class by name") > -1
        || 1==1
        ) {
        var img = new Image();
        img.src = "http://fund8.money.163.com/bbs/class_not_found.jsp?message="+ex.message;
    }

    if (ex.message == "Service Unavailable") {
        return;
    }

    dwr.engine._debug("Error: " + ex.name + ", " + ex.message, true);

    if (message == null || message == "") {
        alert("A server error has occured. More information may be available in the console.");
    }
    // Ignore NS_ERROR_NOT_AVAILABLE if Mozilla is being narky
    else if (message.indexOf("0x80040111") != -1) {
        dwr.engine._debug(message);
    }
    else {
        alert(message);
    }
};

/** A function to call if something fails. */
dwr.engine._errorHandler = dwr.engine.defaultErrorHandler;


var HOT_VISIT_BOARDNAME = {"1314":"&#73;&#84;&#20225;&#19994;&#34218;&#36164;&#24453;&#36935;","2008image":"&#38236;&#22836;&#37324;&#30340;&#50;&#48;&#49;&#49;","2010asia":"&#30021;&#35848;&#20122;&#36816;","60anni":"&#24314;&#22269;&#54;&#48;&#21608;&#24180;","70niandai":"&#55;&#48;&#24180;&#20195;","80niandai":"&#56;&#48;&#24180;&#20195;","90niandai":"&#29983;&#20110;&#57;&#48;&#21518;","agu":"&#65;&#32929;&#35770;&#22363;","aiqing":"&#29233;&#24773;&#23567;&#36713;","appeal":"&#26053;&#28216;&#51;&#49;&#53;","auto_01dx":"&#20975;&#36842;&#25289;&#20811;&#67;&#84;&#83;","auto_01kc":"&#38632;&#29141;","auto_01ll":"&#67;&#82;&#45;&#86;","auto_01ln":"&#19996;&#39118;&#26631;&#33268;","auto_01lo":"&#51;&#48;&#55;","auto_01mb":"&#21326;&#27888;&#27773;&#36710;","auto_01n1":"&#26032;&#19968;&#20195;&#26222;&#21147;&#39532;","auto_01oc":"&#31119;&#20811;&#26031;","auto_01oe":"&#22025;&#24180;&#21326;","auto_01ou":"&#19968;&#27773;&#22885;&#36842;","auto_01qs":"&#22825;&#31809;","auto_01qt":"&#36713;&#36920;","auto_01qw":"&#29233;&#20029;&#33293;","auto_01r1":"&#67;&#50;","auto_01rb":"&#26032;&#23453;&#26469;","auto_01rd":"&#20234;&#20848;&#29305;","auto_01rr":"&#39134;&#24230;","auto_01rt":"&#38597;&#38401;","auto_01s2":"&#21035;&#20811;&#20975;&#36234;","auto_01s5":"&#38634;&#20315;&#20848;&#26223;&#31243;","auto_01ss":"&#19968;&#27773;&#22868;&#33150;","auto_01st":"&#22868;&#33150;","auto_03s1":"&#26862;&#38597;","auto_03so":"&#36808;&#33150;","auto_05fx":"&#82;&#67;&#82;&#31454;&#36895;","auto_0abg":"&#70;&#48;","auto_0ayk":"&#22868;&#33150;&#66;&#53;&#48;","auto_0b10":"&#19990;&#22025;","auto_0bx5":"&#38634;&#20315;&#20848;&#31185;&#40065;&#20857;","auto_0cdo":"&#27721;&#20848;&#36798;","auto_0ckk":"&#19996;&#39118;&#39118;&#31070;","auto_0d04":"&#19977;&#33777;&#32764;&#31070;","auto_0d2o":"&#20845;&#20195;&#39640;&#23572;&#22827;","auto_0dbo":"&#67;&#53;","auto_0dhc":"&#77;&#71;&#32;&#54;","auto_0dhj":"&#19992;&#27604;&#29305;","auto_aaab":"&#32508;&#21512;&#29256;&#21306;","auto_aaac":"&#36710;&#36855;&#38386;&#32842;","auto_aaaf":"&#25913;&#35013;&#22825;&#22320;","auto_aaag":"&#33258;&#39550;&#29305;&#21306;","auto_bbtx":"&#21271;&#20140;&#36710;&#21451;","auto_bbty":"&#19978;&#28023;&#36710;&#21451;","auto_bbtz":"&#24191;&#24030;&#36710;&#21451;","auto_haiwai":"&#28023;&#22806;&#36710;&#21451;","auto_sichuan":"&#22235;&#24029;&#36710;&#21451;&#20250;","auto_tianjin":"&#22825;&#27941;&#36710;&#21451;&#20250;","auto_yueye":"&#36234;&#37326;&#29983;&#27963;","babymarket":"&#22920;&#22920;&#26194;&#29983;&#27963;","bagua":"&#36229;&#32423;&#29190;&#26009;","baidian":"&#30333;&#33394;&#23478;&#30005;","basketball":"&#28779;&#28909;&#31726;&#29699;&#35770;&#22363;","bbm":"&#32593;&#21451;&#24110;&#24110;&#24537;","bbqiming":"&#23453;&#23453;&#36215;&#21517;","bbsgift":"&#34394;&#25311;&#31036;&#29289;","beautify":"&#33457;&#24819;&#23481;&#25945;&#23460;","bj4hy":"&#22235;&#21512;&#38498;","bjfb":"&#20048;&#21621;&#20048;&#21621;","bjtv":"&#24433;&#20687;&#21271;&#20140;","btzq":"&#32437;&#27178;&#20307;&#32946;","bucks":"&#26131;&#24314;&#32852;","bulletin":"&#35770;&#22363;&#20844;&#21578;","bwjl":"&#36130;&#32463;&#35770;&#22363;&#31449;&#21153;","carhelp":"&#36710;&#21451;&#24110;&#24110;&#24537;","cba":"&#67;&#66;&#65;&#35770;&#22363;&#24635;&#29256;","ceyy":"&#40657;&#28748;&#27700;","chaguan":"&#20013;&#22269;&#36275;&#29699;&#33590;&#39302;","chanhoufit":"&#23453;&#23453;&#22270;&#31168;","chaogu":"&#27169;&#25311;&#28818;&#32929;","chongqing":"&#37325;&#24198;&#36710;&#21451;&#20250;","chongwu":"&#23456;&#29289;&#23453;&#36125;","chuyou":"&#30456;&#32422;&#21516;&#28216;","cissi":"&#25252;&#32932;&#39038;&#38382;","citywalker":"&#22478;&#24066;&#28459;&#27493;","cjdg":"&#36130;&#32463;&#22823;&#35266;","concept":"&#26053;&#28216;&#28459;&#35848;","country":"&#24076;&#26395;&#20892;&#26449;","cplt":"&#32593;&#26131;&#49;&#54;&#51;&#37038;&#31665;&#20135;&#21697;&#35770;&#22363;","culture":"&#99;&#117;&#108;&#116;&#117;&#114;&#101;","dainty":"&#21416;&#21416;&#21160;&#20154;","danshen":"&#21333;&#36523;&#30340;&#28010;&#28459;","danshenmm":"&#21333;&#36523;&#22899;","dapeiriji":"&#25645;&#37197;&#26085;&#35760;","dc":"&#28040;&#36153;&#31867;&#68;&#67;","dgxsj":"&#19996;&#33694;&#26032;&#19990;&#32426;","digi_people":"&#32593;&#26131;&#25968;&#30721;&#36798;&#20154;","digi_teahouse":"&#25968;&#30721;&#33590;&#31038;","digifuns":"&#36798;&#20154;&#27963;&#21160;&#21306;","digitimes":"&#25668;&#24433;&#20316;&#21697;&#20998;&#20139;","discussion":"&#27004;&#24066;&#28909;&#28857;","doings":"&#26377;&#22870;&#27963;&#21160;","editionowners":"&#22899;&#20154;&#29256;&#20027;&#20132;&#27969;","ent_2x01":"&#21512;&#23478;&#27426;","fanbaoli":"&#21453;&#23478;&#24237;&#26292;&#21147;","fanzhou":"&#32929;&#28023;&#33539;&#33311;","fashion":"&#26102;&#23578;&#39118;&#21521;&#26631;","fit":"&#20943;&#32933;&#27801;&#40857;","foxconn":"&#23500;&#22763;&#24247;","ganya":"&#24191;&#19996;&#30007;&#31726;","gaoxaio":"&#25630;&#31505;&#24086;&#22270;","ghcf":"&#32929;&#32;&#27665;&#32;&#24110;","ghd":"&#29233;&#29983;&#27963;&#32;&#29233;&#39764;&#20861;","ghzf":"&#36186;&#38065;&#19968;&#26063;","gjbg":"&#21476;&#20170;&#20843;&#21350;","gsq":"&#32929;&#22363;&#29305;&#21306;","guanli":"&#20307;&#32946;&#35770;&#22363;&#31649;&#29702;","guanshui":"&#24320;&#24515;&#28748;&#27700;","guanwater":"&#28748;&#27700;&#20048;&#22253;","gufeng":"&#21476;&#39118;&#38597;&#38901;","guihua":"&#39740;&#35805;&#36830;&#31687;","guilin":"&#23665;&#27700;&#26690;&#26519;","guoji":"&#22269;&#38469;&#20851;&#31995;","gzxy":"&#31908;&#33394;&#25769;&#20154;","happy":"&#24320;&#24515;&#19968;&#21051;","hire":"&#25105;&#35201;&#31199;&#21806;","history":"&#31177;&#28891;&#24377;&#21490;","hkmovie":"&#39321;&#28207;&#21046;&#36896;","homegossip":"&#26126;&#26143;&#35946;&#23429;","homeguide":"&#32622;&#19994;&#25351;&#21335;","hometown":"&#25105;&#30340;&#25925;&#20065;","housegossip":"&#19994;&#20027;&#21561;&#27700;","housestory":"&#20080;&#25151;&#25925;&#20107;","huayu":"&#23381;&#26399;&#22270;&#31168;","hyrj":"&#24576;&#19978;&#23453;&#23453;","itbeauty2009":"&#50;&#48;&#48;&#57;&#73;&#84;&#77;&#77;&#27963;&#21160;","jiadian":"&#23478;&#29992;&#30005;&#22120;","jiangnan":"&#28216;&#36941;&#27743;&#21335;","jiangxi":"&#27743;&#35199;&#36710;&#21451;&#20250;","jiangzhang":"&#23478;&#38271;&#20465;&#20048;&#37096;","jiaoyu":"&#25945;&#32946;&#22823;&#23478;&#35848;","jiepai":"&#27969;&#34892;&#20048;&#22363;","jijin":"&#22823;&#35805;&#22522;&#37329;","jueqi":"&#20154;&#25991;&#24605;&#24819;","junshi":"&#20891;&#20107;&#24086;&#22270;","jyycht":"&#37329;&#19994;&#21035;&#22661;&#20506;&#32736;&#35946;&#24237;","kgu":"&#25216;&#26415;&#20132;&#27969;","kongbu":"&#24656;&#24598;&#35282;","ladyguanshui":"&#28748;&#27700;&#26377;&#20320;","ladymaster":"&#22899;&#20154;&#35770;&#22363;&#31449;&#21153;","leiqu":"&#23089;&#20048;&#36148;&#22270;","liaotian":"&#28748;&#27700;&#37096;&#33853;","licai":"&#25105;&#32;&#29702;&#32;&#36130;","literature":"&#22899;&#23376;&#20844;&#31038;","localcq":"&#37325;&#24198;","localgd":"&#24191;&#19996;","localguch":"&#22478;&#24066;&#24191;&#22330;","localguizhou":"&#36149;&#24030;","localhenan":"&#27827;&#21335;","localhlj":"&#40657;&#40857;&#27743;","localhubei":"&#28246;&#21271;","localhunan":"&#28246;&#21335;","localhw":"&#28023;&#22806;&#26143;&#20113;","localjs":"&#27743;&#33487;","localjx":"&#27743;&#35199;","localnmg":"&#20869;&#33945;&#21476;","localnx":"&#23425;&#22799;","localsc":"&#22235;&#24029;","localsd":"&#23665;&#19996;","localsh":"&#19978;&#28023;","localshanxi":"&#38485;&#35199;","lovegz":"&#23429;&#30007;&#23429;&#22899;","loveman":"&#30495;&#29233;&#30007;&#20154;","lovestory":"&#24773;&#27969;&#24863;&#38376;&#35786;","ltgch":"&#20081;&#24377;&#24191;&#22330;","mfsm":"&#26408;&#24220;&#33590;&#22346;","mil":"&#32593;&#19978;&#35848;&#20853;","mil1":"&#20891;&#21490;&#26434;&#35848;","mil3":"&#27494;&#22120;&#35013;&#22791;","mmbb":"&#23453;&#23453;&#25104;&#38271;","mmkq":"&#32654;&#30473;&#30475;&#29699;","mobile_0s3b":"&#69;&#55;&#49;","mobile_0s3h":"&#54;&#50;&#50;&#48;&#99;","mobile_0s3i":"&#78;&#55;&#56;","mobile_0s3q":"&#53;&#56;&#48;&#48;","mobile_0s4k":"&#69;&#54;&#51;","mobile_0s4w":"&#78;&#57;&#55;","mobile_3g":"&#51;&#71;&#19987;&#21306;","mobile_4jey":"&#53;&#53;&#51;&#48;&#88;&#77;","mobile_activ":"&#27963;&#21160;&#19987;&#21306;","mobile_blas":"&#25163;&#26426;&#25293;&#29031;","mobile_blat":"&#28909;&#28857;&#35805;&#39064;","mobile_blbb":"&#20132;&#26131;&#19987;&#21306;","mobile_btsc":"&#26032;&#25163;&#19978;&#36335;","mobile_museum":"&#25163;&#26426;&#21338;&#29289;&#39302;","mobile_nokia_n":"&#19979;&#36733;&#19987;&#21306;","movie":"&#25105;&#29233;&#30005;&#24433;","mu":"&#32418;&#39764;&#26364;&#32852;","myhome":"&#25105;&#29233;&#25105;&#23478;","nature":"&#30007;&#22899;&#26377;&#21035;","nbdiy":"&#21488;&#24335;&#26426;&#68;&#73;&#89;","neteasestar":"&#25945;&#22530;","newht":"&#27599;&#21608;&#35805;&#39064;","nikon":"&#25968;&#30721;&#21333;&#21453;","notebook":"&#31508;&#35760;&#26412;","overseas":"&#36208;&#20986;&#22269;&#38376;","partner":"&#32467;&#20276;&#21516;&#34892;","pcgame":"&#30005;&#33041;&#28216;&#25103;","peipeiguide":"&#34003;&#34003;&#34915;&#27249;&#39038;&#38382;","photo":"&#26032;&#38395;&#36148;&#22270;","photoshow":"&#20307;&#32946;&#24086;&#22270;","pingming":"&#35797;&#29992;&#38;&#27963;&#21160;","poxi":"&#23110;&#23219;&#20851;&#31995;","pp":"&#26131;&#25293;&#22825;&#19979;","qgtk":"&#24773;&#24863;&#26646;&#24687;&#22320;","qitu":"&#22855;&#22270;&#20048;&#35805;","qiumi":"&#33590;&#39302;&#29699;&#36855;&#21306;","quanri":"&#20840;&#26085;&#23089;&#20048;","rights":"&#32500;&#26435;&#26333;&#20809;","sanwen":"&#25955;&#25991;&#38543;&#31508;","school":"&#26657;&#22253;&#29983;&#27963;","service_bbs":"&#35770;&#22363;&#26381;&#21153;","sh000001":"&#22823;&#30424;&#32929;&#21543;","sh601333":"&#24191;&#28145;&#38081;&#36335;","shalong":"&#22269;&#38469;&#36275;&#29699;&#27801;&#40857;","shenzhen":"&#28145;&#22323;&#36710;&#21451;&#20250;","shishi":"&#26102;&#20107;&#35770;&#22363;","shui":"&#28748;&#27700;&#19987;&#21306;","society":"&#31038;&#20250;&#19975;&#35937;","star002":"&#37329;&#29275;&#24231;","star003":"&#21452;&#23376;&#24231;","star004":"&#29422;&#23376;&#24231;","star005":"&#24040;&#34809;&#24231;","star006":"&#22788;&#22899;&#24231;","star008":"&#22825;&#34638;&#24231;","star009":"&#23556;&#25163;&#24231;","star011":"&#27700;&#29942;&#24231;","star012":"&#21452;&#40060;&#24231;","startup":"&#21019;&#19994;&#25237;&#36164;","station":"&#33729;&#33729;&#26657;&#22253;","street":"&#34903;&#25293;&#32654;&#22899;","study":"&#28023;&#22806;&#29983;&#27963;","suggestion":"&#26032;&#29256;&#21453;&#39304;","tech02":"&#20256;&#38395;&#29190;&#26009;","tech06":"&#25506;&#32034;&#35770;&#22363;","topic":"&#20027;&#39064;&#21407;&#21019;","tttq":"&#36148;&#22270;&#22320;&#24102;","tuyou":"&#22270;&#28216;&#22825;&#19979;","tv":"&#22823;&#35805;&#30005;&#35270;&#36855;","tvb":"&#116;&#118;&#98;&#26126;&#26143;&#32852;&#30431;","tyro":"&#26032;&#25163;&#19978;&#36335;","waike":"&#23453;&#23453;&#26085;&#35760;","wedding":"&#25105;&#20204;&#32467;&#23130;&#21543;","weicheng":"&#22260;&#22478;&#20869;&#22806;","whitecollar":"&#37117;&#24066;&#30333;&#39046;","wish":"&#35768;&#24895;&#27744;","worklife":"&#32844;&#22330;&#20154;&#29983;","wsyz":"&#32593;&#32476;&#26032;&#40092;&#20107;","wulitou":"&#26080;&#21400;&#22836;&#101;&#116;&#99;","xiangqin":"&#21333;&#36523;&#30007;","xiaohua":"&#26657;&#33457;&#26657;&#33609;","xiaosuo":"&#23567;&#35828;&#27836;&#27901;","xibei":"&#35199;&#21271;&#39118;&#24773;","xietingfeng":"&#38155;&#34892;&#22825;&#19979;","xingsuo":"&#22411;&#30007;&#32034;&#22899;","xingzuo":"&#26143;&#24231;&#22855;&#32536;","xqgs":"&#24515;&#24773;&#25925;&#20107;","xuetong":"&#23398;&#21306;&#25151;","xwzw":"&#26032;&#38395;&#35770;&#22363;&#31449;&#21153;","xybb":"&#24819;&#35201;&#23453;&#23453;","ycwx":"&#23567;&#35828;&#21019;&#20316;&#22823;&#36187;","yidi":"&#24322;&#22320;&#24773;&#32536;","yizhan":"&#20840;&#29699;&#26194;&#29983;&#27963;","youji":"&#21407;&#21019;&#28216;&#35760;","yunzhou10":"&#23381;&#49;&#48;&#21608;","yunzhou12":"&#23381;&#49;&#50;&#21608;","yunzhou13":"&#23381;&#49;&#51;&#21608;","yunzhou14":"&#23381;&#49;&#52;&#21608;","yunzhou15":"&#23381;&#49;&#53;&#21608;","yunzhou16":"&#23381;&#49;&#54;&#21608;","yunzhou18":"&#23381;&#49;&#56;&#21608;","yunzhou19":"&#23381;&#49;&#57;&#21608;","yunzhou1_8":"&#23381;&#49;&#45;&#56;&#21608;","yunzhou20":"&#23381;&#50;&#48;&#21608;","yunzhou22":"&#23381;&#50;&#50;&#21608;","yunzhou24":"&#23381;&#50;&#52;&#21608;","yunzhou25":"&#23381;&#50;&#53;&#21608;","yunzhou26":"&#23381;&#50;&#54;&#21608;","yunzhou27":"&#23381;&#50;&#55;&#21608;","yunzhou28":"&#23381;&#50;&#56;&#21608;","yunzhou30":"&#23381;&#51;&#48;&#21608;","yunzhou31":"&#23381;&#51;&#49;&#21608;","yunzhou32":"&#23381;&#51;&#50;&#21608;","yunzhou33":"&#23381;&#51;&#51;&#21608;","yunzhou34":"&#23381;&#51;&#52;&#21608;","yunzhou36":"&#23381;&#51;&#54;&#21608;","yunzhou37":"&#23381;&#51;&#55;&#21608;","yunzhou38":"&#23381;&#51;&#56;&#21608;","yunzhou39":"&#23381;&#51;&#57;&#21608;","yunzhou40":"&#23381;&#52;&#48;&#21608;","yunzhou9":"&#23381;&#57;&#21608;","zhaowei":"&#34183;&#22937;&#34183;&#20431;","zhongmei":"&#20013;&#32654;&#20851;&#31995;","zhongri":"&#20013;&#26085;&#20851;&#31995;","zplt":"&#25235;&#25293;&#35770;&#22363;"}

String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

var Util = {
    getXY : function(Obj) {
        var sumTop = 0, sumLeft = 0;
        while (Obj && Obj.tagName && Obj.tagName != "BODY" && Obj.tagName != "HTML") {
            var num = Obj.offsetLeft;

            sumLeft += num;
            sumTop += Obj.offsetTop;
            Obj = Obj.offsetParent;
        }

        return {
            x : sumLeft,
            y : sumTop
        };
    }
};

var Passport = {
    usernameInputElement : false,
    passwordInputElement : "",
    usernameInputElementX : false,
    usernameInputElementY : false,
    usernameInputHeight : false,
    usernameListElement : false,
    currentSelectIndex : -1,
    domainSelectElmentString : "<table id = \"passportusernamelist\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" class=\"loginSupportList\"><tr><td class=\"title\" style=\"title\" >\u8BF7\u9009\u62E9\u6216\u7EE7\u7EED\u8F93\u5165...</td></tr><tr><td></td></tr></table><div style=\"display: none;\"></div><div id=\"passport_111\"></div>",
    domainSelectElement : false,
    domainArray : [ "163.com", "126.com", "vip.126.com", "yeah.net", "188.com",
        "vip.163.com", "gmail.com", "qq.com", "sina.com", "hotmail.com" ],
    helpDivString : "<div style=\"width:100%;\" id=\"passport_helper_div\"></div>",
    // 自动调整用户名提示div的位置，解决窗口变化时位置偏移的问题。
    resizeFunc : function() {
        var ds = document.getElementById("passportusernamelist");

        var username_x = Util.getXY(Passport.usernameInputElement).x;
        var username_y = Util.getXY(Passport.usernameInputElement).y;

        ds.style.left = username_x + "px";
        ds.style.top = (username_y + Passport.usernameInputElement.offsetHeight)
            + "px";
        ds.style.display = "none";

    },

    bind : function(obj, obj2) {
        this.usernameInputElement = obj;
        this.passwordInputElement = obj2;
        var xy = Util.getXY(this.usernameInputElement);
        this.usernameInputElementX = xy.x;
        this.usernameInputElementY = xy.y;
        this.handle();
    },
    handle : function() {

        var domainSelectElment = document.createElement("DIV");
        var helpDiv = document.createElement("DIV");
        domainSelectElment.innerHTML = this.domainSelectElmentString;
        helpDiv.innerHTML = this.helpDivString;

        document.body.appendChild(domainSelectElment);
        document.body.appendChild(helpDiv);

        this.domainSelectElement = document.getElementById("passportusernamelist");

        this.usernameListElement = this.domainSelectElement.rows[1].firstChild;
        this.currentSelectIndex = 0;
        this.usernameInputElement.onblur = function() {
            Passport.doSelect();
        };
        try {
            this.usernameInputElement.addEventListener("keypress",
                this.keypressProc, false);
            this.usernameInputElement.addEventListener("keyup", this.keyupProc,
                false);
        } catch (e) {
            try {
                this.usernameInputElement.attachEvent("onkeydown",
                    this.checkKeyDown);
                this.usernameInputElement.attachEvent("onkeypress",
                    this.keypressProc);
                this.usernameInputElement
                    .attachEvent("onkeyup", this.keyupProc);
            } catch (e) {
            }
        }

        // ----------------解决用户名自动提示div在窗口大小发生变化时的位置偏移的bug.-----------
        Passport.resizeFunc();
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            window.attachEvent("onresize", Passport.resizeFunc);

        } else {

            window.onresize = Passport.resizeFunc;

        }
        // ----------------解决用户名自动提示div在窗口大小发生变化时的位置偏移的bug.-----------

    },
    preventEvent : function(event) {
        event.cancelBubble = true;
        event.returnValue = false;
        if (event.preventDefault) {
            event.preventDefault();
        }
        if (event.stopPropagation) {
            event.stopPropagation();
        }
    },
    checkKeyDown : function(event) {
        this.currentSelectIndex = 0;
        var keyCode = event.keyCode;
        if (keyCode == 38 || keyCode == 40) {
            Passport.clearFocus();
            if (keyCode == 38) {
                Passport.upSelectIndex();
            } else {
                Passport.downSelectIndex();
            }
            Passport.setFocus();
        }
    },
    keyupProc : function(event) {
        this.currentSelectIndex = 0;
        var keyCode = event.keyCode;
        Passport.changeUsernameSelect();
        if (keyCode == 13) {
            Passport.doSelect();
        }
        var isSafari;
        if ((isSafari = navigator.userAgent.indexOf("Safari")) > 0) {
            if (keyCode == 38 || keyCode == 40) {
                Passport.preventEvent(event);
                Passport.clearFocus();
                if (keyCode == 38) {
                    Passport.upSelectIndex();
                } else {
                    Passport.downSelectIndex();
                }
                Passport.setFocus();
            }
        }
    },
    keypressProc : function(event) {
        this.currentSelectIndex = 0;
        var keyCode = event.keyCode;
        if (keyCode == 13) {

            Passport.preventEvent(event);
        } else {
            if (keyCode == 38 || keyCode == 40) {
                Passport.preventEvent(event);
                Passport.clearFocus();
                if (keyCode == 38) {
                    Passport.upSelectIndex();
                } else {
                    Passport.downSelectIndex();
                }
                Passport.setFocus();
            } else {
                if (keyCode == 108 || keyCode == 110 || keyCode == 111
                    || keyCode == 115) {
                    setTimeout("Passport.changeUsernameSelect()", 20);
                }
            }
        }
    },
    clearFocus : function(index) {
        var index = this.currentSelectIndex;
        try {
            var x = this.findTdElement(index);
            x.style.backgroundColor = "white";
        } catch (e) {
        }
    },
    findTdElement : function(index) {
        try {
            var x = this.usernameListElement.firstChild.rows;
            for ( var i = 0; i < x.length; ++i) {
                if (x[i].firstChild.idx == index) {
                    return x[i].firstChild;
                }
            }
        } catch (e) {
        }
        return false;
    },
    upSelectIndex : function() {
        var index = this.currentSelectIndex;
        if (this.usernameListElement.firstChild == null) {
            return;
        }
        var x = this.usernameListElement.firstChild.rows;
        var i;
        for (i = 0; i < x.length; ++i) {
            if (x[i].firstChild.idx == index) {
                break;
            }
        }
        if (i == 0) {
            this.currentSelectIndex = (x.length - 1);
        } else {
            this.currentSelectIndex = x[i - 1].firstChild.idx;
        }
    },
    downSelectIndex : function() {
        var index = this.currentSelectIndex;
        if (this.usernameListElement.firstChild == null) {
            return;
        }
        var x = this.usernameListElement.firstChild.rows;
        var i = 0;
        for (; i < x.length; ++i) {
            if (x[i].firstChild.idx == index) {
                break;
            }
        }
        if (i >= x.length - 1) {
            this.currentSelectIndex = x[0].firstChild.idx;
        } else {
            this.currentSelectIndex = x[i + 1].firstChild.idx;
        }
    },
    setFocus : function() {
        var index = this.currentSelectIndex;
        try {
            var x = this.findTdElement(index);
            x.style.backgroundColor = "#8EB7ED";
        } catch (e) {
        }
    },
    changeUsernameSelect : function() {
        var userInput = this.usernameInputElement.value;
        if (userInput.trim() == "") {
            this.domainSelectElement.style.display = "none";
        } else {
            var username = "", hostname = "";
            var pos;
            if ((pos = userInput.indexOf("@")) < 0) {
                username = userInput;
                hostname = "";
            } else {
                username = userInput.substr(0, pos);
                hostname = userInput.substr(pos + 1, userInput.length);
            }
            var usernames = [];
            if (hostname == "") {
                for ( var i = 0; i < this.domainArray.length; ++i) {
                    usernames.push(username + "@" + this.domainArray[i]);
                }
            } else {
                for ( var i = 0; i < this.domainArray.length; ++i) {
                    if (this.domainArray[i].indexOf(hostname) == 0) {
                        usernames.push(username + "@" + this.domainArray[i]);
                    }
                }
            }
            if (usernames.length > 0) {
                // this.currentSelectIndex = 0 ;

                /*
                 * this.domainSelectElement.style.left = this.usernameInputElementX + "px";
                 * var isSafari; if((isSafari=navigator.userAgent.indexOf("Safari"))>0){
                 * this.domainSelectElement.style.top = (this.usernameInputElementY +
                 * this.usernameInputElement.offsetHeight + 20) + "px";
                 * 
                 * }else this.domainSelectElement.style.top = (this.usernameInputElementY +
                 * this.usernameInputElement.offsetHeight) + "px";
                 */
                Passport.resizeFunc();

                this.domainSelectElement.style.display = "block";
                var myTable = document.createElement("TABLE");
                myTable.width = "100%";
                myTable.cellSpacing = 0;
                myTable.cellPadding = 3;
                var tbody = document.createElement("TBODY");
                myTable.appendChild(tbody);
                for ( var i = 0; i < usernames.length; ++i) {
                    var tr = document.createElement("TR");
                    var td = document.createElement("TD");
                    td.nowrap = "true";
                    td.align = "left";
                    td.innerHTML = usernames[i];
                    td.idx = i;
                    td.onmouseover = function() {
                        Passport.clearFocus();
                        Passport.currentSelectIndex = this.idx;
                        Passport.setFocus();
                        this.style.cursor = "hand";
                    };
                    td.onmouseout = function() {
                    };
                    td.onclick = function() {
                        Passport.doSelect();
                    };
                    tr.appendChild(td);
                    tbody.appendChild(tr);
                }
                this.usernameListElement.innerHTML = "";
                this.usernameListElement.appendChild(myTable);
                this.setFocus();
            } else {
                this.domainSelectElement.style.display = "none";
                this.currentSelectIndex = -1;
            }
        }
    },
    doSelect : function() {
        this.domainSelectElement.style.display = "none";
        if (this.usernameInputElement.value.trim() == "") {
            return;
        }
        var currentUsernameTd = this.findTdElement(this.currentSelectIndex);
        if (currentUsernameTd) {
            this.usernameInputElement.value = currentUsernameTd.innerHTML;
        }
        if (this.passwordInputElement != "") {
            this.passwordInputElement.focus();
        }
    }
};

/**
 * Author: 阿海
 */

var Drag = {
    "obj" : null,
    "init" : function(a, aRoot) {
        a.onmousedown = Drag.start;
        a.root = aRoot;
        if (isNaN(parseInt(a.root.style.left)))
            a.root.style.left = "0px";
        if (isNaN(parseInt(a.root.style.top)))
            a.root.style.top = "0px";
        a.root.onDragStart = new Function();
        a.root.onDragEnd = new Function();
        a.root.onDrag = new Function();
    },
    "start" : function(a) {
        var b = Drag.obj = this;
        a = Drag.fixE(a);
        var c = parseInt(b.root.style.top);
        var d = parseInt(b.root.style.left);
        b.root.onDragStart(d, c, a.clientX, a.clientY);
        b.lastMouseX = a.clientX;
        b.lastMouseY = a.clientY;
        document.onmousemove = Drag.drag;
        document.onmouseup = Drag.end;
        return false;
    },
    "drag" : function(a) {
        a = Drag.fixE(a);
        var b = Drag.obj;
        var c = a.clientY;
        var d = a.clientX;
        var e = parseInt(b.root.style.top);
        var f = parseInt(b.root.style.left);
        var h, g;
        h = f + d - b.lastMouseX;
        g = e + c - b.lastMouseY;
        b.root.style.left = h + "px";
        b.root.style.top = g + "px";
        b.lastMouseX = d;
        b.lastMouseY = c;
        b.root.onDrag(h, g, a.clientX, a.clientY);
        return false;
    },
    "end" : function() {
        document.onmousemove = null;
        document.onmouseup = null;
        Drag.obj.root.onDragEnd(parseInt(Drag.obj.root.style.left),
            parseInt(Drag.obj.root.style.top));
        Drag.obj = null;
    },
    "fixE" : function(a) {
        if (typeof a == "undefined")
            a = window.event;
        if (typeof a.layerX == "undefined")
            a.layerX = a.offsetX;
        if (typeof a.layerY == "undefined")
            a.layerY = a.offsetY;
        return a;
    }
};

Object.printAll = function(obj) {
    var msg = "";
    var i = 0;
    for (dd in obj) {
        msg += dd + "  ";
        if ((i + 1) % 5 == 0) {
            msg += "\n";
        }
        i++;
    }
    alert(msg);
}

var Dialog = {
    "init" : "",
    "dialogBox" : null,
    "defWidth" : 400,
    "width" : 0,
    "height" : 400,

    "basePath" : "",

    "setBasePath" : function(url) {
        this.basePath = url;
    },

    "parseUrl" : function(url) {
        if (this.basePath == "") {
            return url;
        }
        if (url.substring(0, 7) == "http://") {
            return url;
        }

        var basePath;
        if (this.basePath.substring(this.basePath.length-1)=="/") {
            basePath = this.basePath.substring(0, this.basePath.length-1);
        }
        else {
            basePath = this.basePath;
        }
        var firstChar = url.substring(0);
        if ("/" == firstChar) {
            url = basePath + url;
        } else {
            url = basePath + "/" + url;
        }
        return url;
    },

    /**
     * 显示窗口
     *
     * @param title
     *            窗口标题
     * @param url
     *            窗口内容页面的URL
     * @param loadCss
     *            是否加载CSS
     * @param loadJs
     *            是否加载JS
     */
    "show" : function(title, url, loadCss, loadJs, initfunc) {
        if (this.dialogBox == null) {
            // 窗口不存在，自动创建
            this.create();
        }

        this.setWidth(this.defWidth); // 默认宽度

        this.dialogBox.style.display = "block"; // 显示窗口

        this.setTitle(title); // 设置标题

        this.loading = setTimeout("Dialog.setLoading()", 0); // 前端要求修改，解决闪现的问题。 200毫秒内数据没有加载就会显示“数据加载中...”

        Drag.init(document.getElementById("draghead"), this.dialogBox);

        this.dialogBox.onDragEnd = function(x, y) {
            Dialog.dialogBox.ox = x - Dialog.getRange().left;
            Dialog.dialogBox.oy = y - Dialog.getRange().top;
        }
        this.center(); // 当浏览器不是在第一屏的位置显示窗口会看不见，所以要让它自动在当前屏幕的中间显示

        url = this.parseUrl(url);
        this.loadContent(url, loadCss, loadJs, initfunc); // 加载窗口内容
    },
    "showContent" : function(title, content) {
        if (this.dialogBox == null) {
            // 窗口不存在，自动创建
            this.create();
        }

        this.setWidth(this.defWidth); // 默认宽度

        this.dialogBox.style.display = "block"; // 显示窗口

        this.setTitle(title); // 设置标题



        Drag.init(document.getElementById("draghead"), this.dialogBox);

        this.dialogBox.onDragEnd = function(x, y) {
            Dialog.dialogBox.ox = x - Dialog.getRange().left;
            Dialog.dialogBox.oy = y - Dialog.getRange().top;
        }
        this.center(); // 当浏览器不是在第一屏的位置显示窗口会看不见，所以要让它自动在当前屏幕的中间显示
        var html = '<div class="dialogBox_Content">';
        html += '<h5 style="font-size:16px; font-weight:normal; clear:both; line-height:24px;">';
        html += content + '</h5>';

        $("dialogBox_content").innerHTML = html;
    },
    "setWidth" : function(width) {
        if (width != this.width) {
            this.width = width;
            this.dialogBox.style.width = width + "px";
            this.center();
        }

    },

    "setHeight" : function(height) {
        if (height != this.height) {
            this.height = height;
        }
    },

    "loading" : null,

    "setLoading" : function() {
        this.setContent("数据加载中...");
    },

    "clearLoading" : function() {
        if (this.loading != null) {
            clearTimeout(this.loading);
            this.loading = null;
        }
    },

    /**
     * 加载窗口内容
     */
    "loadContent" : function(url, loadCss, loadJs, initfunc) {
        var time = "?" + (new Date().getTime());

        /**
         * 使用GET方式会有缓存问题，所以要使用POST
         */
        new Ajax.Request(url, {
            method : 'get',
            requestHeaders : [ "If-Modified-Since", "0" ],
            onComplete : function(obj) {
                Dialog.clearLoading()

                /**
                 * this.setContent("数据加载中...");//须将内容清空，否则有时会发生IE崩溃的情况(目前发现修改文章时会发生)
                 */
                $("dialogBox_content").innerHTML = (obj.responseText);
                if (loadCss) {
                    Dialog.loadCss(url + ".css");
                }

                if (loadJs) {
                    Dialog.loadJs(url + ".js", initfunc);
                }
            }
        });
    },
    "alert":function(content) {
        this.showContent("系统提示", content);
    },
    /**
     * 设置窗口内容（提示信息）.
     */
    "setContent" : function(content) {
        document.getElementById("dialogBox_content").innerHTML = "<div class='dialogBox_Content'>"
            + content + "</div>";
    },

    /**
     * 关闭窗口
     */
    "close" : function() {

        if (this.dialogBox != null) {
            this.dialogBox.style.display = "none";
            this.setLoading();
        }
    },

    /**
     * 设置窗口的标题
     *
     * @html 窗口的标题，支持HTML
     */
    "setTitle" : function(html) {
        document.getElementById("dialogBox_title").innerHTML = html;
    },

    /**
     * 创建窗口
     */
    "create" : function() {
        this.loadCss("http://img1.cache.netease.com/bbs/css/dialog.css");
        var dialogBox = document.createElement("DIV");
        dialogBox.id = "dialogBox";
        dialogBox.className = "dialogBoxBg";
        var html = '<div class="dialogBox" style="cursor:pointer"><div id="draghead" class="title"><h2 id="dialogBox_title"></h2>';
        html += '<span class="close"><a id="dialog_close_btn" href="javascript:Dialog.close()" target="_self">关闭</a></span></div>';
        html += '<div class="content" id="dialogBox_content"></div></div>';

        dialogBox.innerHTML = html;

        document.body.appendChild(dialogBox);

        this.dialogBox = document.getElementById("dialogBox");

        this.center(); // 设置窗口位置

        this.addScrollEvent(Dialog.onBodyScroll);
    },

    /**
     * 加载CSS
     */

    "loadCss" : function(filename) {
        var head = document.getElementsByTagName('HEAD').item(0);
        var style = document.createElement('link');
        style.href = filename;
        style.rel = 'stylesheet';
        style.type = 'text/css';
        head.appendChild(style);
    },

    /**
     * 加载JS
     *
     * @param filename
     *            脚本URL
     */
    "loadJs" : function(filename, initfunc) {
        /**
         * 应该将filename MD5编码后作为ID使用
         */
        var script = document.getElementById("js1");
        if (script == null) {
            script = document.createElement("script");
            script.id = "js1";
            script.src = filename;
            /**
             * 为什么要使用insertAdjacentElement？
             * 因为appendChild在JS文件已经存在浏览器缓存时就会出现IE崩溃的情况(Bbs.editArticle方法就会出现,postArticle则正常)
             */
            if (document.frames) {
                document.body.insertAdjacentElement("BeforeBegin", script);
            } else {
                document.body.appendChild(script);
            }
        }else{
            if(initfunc != undefined){
                initfunc();
            }
        }
    },

    "onBodyScroll" : function() {
        var range = Dialog.getRange();
        var top = (range.top + Dialog.dialogBox.oy);
        var left = (range.left + Dialog.dialogBox.ox);
        if (top < 5) {
            top = 5;
        }
        if (left < 5) {
            left = 5;
        }

        Dialog.dialogBox.style.top = top + "px";
        Dialog.dialogBox.style.left = left + "px";

        if (typeof (Passport) != "undefined" && Passport != null) {
            var ds = document.getElementById("passportusernamelist");
            if (ds != null && typeof (ds) == "object") {
                Passport.resizeFunc();
            }

        }
    },

    /**
     * 设置窗口居中显示
     */
    "center" : function() {
        var range = Dialog.getRange();

        var position = this.getPosition();

        var left = (range.width - position.width) / 2;
        var top = (range.height - position.height) / 2;

        this.dialogBox.ox = left;
        this.dialogBox.oy = top;

        if (range.left > left) {
            left = range.left + left;
        }
        if (range.top > top) {
            top = range.top + top;
        }

        this.dialogBox.style.left = left + "px";
        this.dialogBox.style.top = top + "px";
    },

    /**
     * 设置窗口居中显示
     */
    "center_bak" : function() {
        var range = Dialog.getRange();

        var left = (range.width - this.width) / 2;
        var top = (range.height - this.height) / 2;

        this.dialogBox.ox = left;
        this.dialogBox.oy = top;

        if (range.left > left) {
            left = range.left + left;
        }
        if (range.top > top) {
            top = range.top + top;
        }

        this.dialogBox.style.left = left + "px";
        this.dialogBox.style.top = top + "px";
    },

    /**
     * 移动窗口位置
     *
     * @left
     * @top
     */
    "move" : function(left, top) {
        this.dialogBox.ox = left;
        this.dialogBox.oy = top;

        this.dialogBox.style.left = left + "px";
        this.dialogBox.style.top = top + "px";
    },

    /**
     * 判断窗口是否创建过
     */
    "isCreated" : function() {
        return (this.dialogBox == null);
    },

    "getPosition" : function() {
        if (this.dialogBox == null) {
            return {
                top : 0,
                left : 0,
                height : this.height,
                width : this.width
            };
        }
        var top = this.dialogBox.offsetTop;
        var left = this.dialogBox.offsetLeft;
        var width = this.dialogBox.offsetWidth;
        var height = this.dialogBox.offsetHeight;

        if (height < this.height) {
            height = this.height;
        }

        return {
            top : top,
            left : left,
            height : height,
            width : width
        };
    },
    "getRange" : function() {
        var top = document.documentElement.scrollTop;
        var left = document.documentElement.scrollLeft;
        var height = document.documentElement.clientHeight;
        var width = document.documentElement.clientWidth;

        if (top == 0) {
            top = document.body.scrollTop;
        }
        if (left == 0) {
            left = document.body.scrollLeft;
        }
        if (height == 0) {
            height = document.body.clientHeight;
        }
        if (width == 0) {
            width = document.body.clientWidth;
        }
        return {
            top : top,
            left : left,
            height : height,
            width : width
        };
    },
    "addScrollEvent" : function(func) {
        var oldonscroll = window.onscroll;
        if (typeof window.onscroll != "function") {
            window.onscroll = func;
        } else {
            window.onscroll = function() {
                oldonscroll();
                func();
            }
        }
    },
    "addResizeEvent" : function(func) {
        var oldonresize = window.onresize;
        if (typeof window.onresize != "function") {
            window.onresize = func;
        } else {
            window.onresize = function() {
                oldonresize();
                func();
            }
        }
    }
}

/**
 *重载BbsUtil.showAdminButton,显示操作按钮
 */
BbsBoardAdmin.showAdminButton = function(){
    var adminButton_top = document.getElementById("adminButton_top");
    var adminButton = document.getElementById("adminButton");

    var html = '<input type="button" onclick="javascript:BbsBoardAdmin.delArticles();" value="删除" /> ';
    html += '<input type="button" onclick="javascript:BbsBoardAdmin.selectAll();" value="全选" /> ';
    html += '<input type="button" onclick="javascript:BbsBoardAdmin.reverse();" value="反向选择" />';

    adminButton_top.innerHTML     = html;
    adminButton_top.style.display = "";
    adminButton.innerHTML     = html;
    adminButton.style.display = "";

    this.setMode(true);
}

/**
 *重载BbsUtil.hideAdminButton,隐藏操作按钮
 */
BbsBoardAdmin.hideAdminButton = function(){
    var adminButton_top = document.getElementById("adminButton_top");
    var adminButton = document.getElementById("adminButton");

    adminButton_top.style.display = "none";
    adminButton.style.display = "none";

    this.setMode(false);
}

/**
 *重载BbsUtil.showLoginInfo方法,显示登录按钮或登录信息
 */
BbsUtil.showLoginInfo = function(){
    var obj = document.getElementById("myLoginButton");

    var objLeft = document.getElementById("myLoginLeftButton");
    var objArticleReply = document.getElementById("articleReplyLogin");

    var html = "";//公用头部登录按键
    var left_login_html = "";//列表页左侧登录
    var article_reply_login = "";//文章页回复框登录
    if(BbsCookie.isLogined()){
        var username = BbsCookie.getPassport();

        var mode = BbsCookie.getCookie("admin_mode");//当前模式,管理模式或者正常模式.
        if (typeof(noNicknameInfo) == "undefined") {
            html += ('<a href="http://bbs.163.com/user/'+username+'" target="_blank" onclick="Bbs.toPersonal()">'+Userinfo.getNickname()+'</a>');
        }

        var messageCount = Userinfo.getMessageCount();
        if(messageCount < 0){
            messageCount = 0;
        }

        html += BbsUtil.getUserSignHtml();	// 签到的html

        html += ' | <a href="http://bbs.163.com/user/personalCenter.do" target="_blank" onclick="Bbs.managerCenter()">我的管理中心</a>';
        html += ' | <a target="_blank" href="http://t.163.com/?f=bbsnav" onclick="Bbs.toWeibo()">我的网易微博</a>(<a target="_blank" href="http://t.163.com/?f=bbsnav" onclick="Bbs.toWeibo()"><span class="cRed" id="weiboCount"></span></a>)';
        html += ' | <a href="http://bbs.163.com/user/profile.do?pageType=msg" target="_blank" onclick="Bbs.toMessageCenter()">消息中心</a><span class="topnav-msg">(<a href="http://bbs.163.com/user/profile.do?pageType=msg" target="_blank"><span class="cRed">'+messageCount+'</span></a>)';
        if(messageCount > 0 && CookieStatus.isShowMsgTip()){
            html += '<div class="bbsTinytips"><span class="bbsTinytips-arrow-down"></span><span class="bbsTinytips-arrow-close" onclick="javascript:BbsUtil.closeBbsTinytips();">关闭</span><p class="bbsTinytips-body">您有<strong class="cDRed">'+messageCount+'</strong>条新消息，<a class="cDRed" href="http://bbs.163.com/user/profile.do?pageType=msg" target="_blank">点击查看</a></p></div>';
        }
        html += '</span> ';
        html += ' | <a href="javascript:Bbs.logout();"  target="_self">退出</a>';
        html += '<span id="boardadmin_span"> | <a href="http://bbs.news.163.com/list/tyro.html">帮助</a></span>';
        html += ' <img src="http://bbs.163.com/bbs/img/phoneIcon.jpg"/><a href="http://help.3g.163.com/bbs/" target="_blank"><font color="red">手机版</font></a>';

        left_login_html += '<a href="http://bbs.163.com/user/upgrade.do" target="_blank">升级中心</a>';
        left_login_html += ' <a href="http://service.bbs.163.com/bbs/bulletin/160737911.html" target="_blank">积分兑换</a>';
        left_login_html += ' <a href="http://help.3g.163.com/bbs/" target="_blank">手机版</a>';

        if(objArticleReply!=null&& typeof(objArticleReply) != "undefined"){
            objArticleReply.style.display="none";
        }
    }
    else{

        html += '[<a href="javascript:Bbs.showLoginDialog(BbsUtil.reloadPage)" target="_self" class="fB cDRed">登录</a>] ';
        html += BbsUtil.getUserSignHtml();	// 签到的html
        html += '<a href="http://bbs.news.163.com/list/tyro.html" target="_blank">帮助</a>';

        left_login_html += '您尚未登录，<a class="fB cDRed" href="javascript:Bbs.showLoginDialog(BbsUtil.reloadPage)" target="_self">登录</a>';

        if(objArticleReply!=null&& typeof(objArticleReply) != "undefined"){
            objArticleReply.style.display="block";
        }
    }

    if (obj) {
        obj.innerHTML = html;
    }

    document.domain = location.hostname.replace(/^.*\.([\w]+\.[\w]+)$/, "$1");
    if (BbsCookie.isLogined()) {
        var email = username;
        if (email.indexOf("@") == -1) {
            email = email + "@163.com";
        }
        var url = "http://t.163.com/service/newMessage/" + email + "/1/0/0/0/1";
        var proxy = document.getElementById("iframeProxy").contentWindow;
        try {
            var xhr = proxy.gx();
            xhr.open("GET", url, false);
            xhr.send(null);
            if (xhr.status != 200) {
                NTES("#weiboCount").attr("innerHTML", 0);
            } else {
                try {
                    var result = xhr.responseText;
                    if (result) {
                        eval(result);
                        if (resultStatus && resultStatus.htlCount) {
                            NTES("#weiboCount").attr("innerHTML", resultStatus.htlCount);
                        }
                    }
                } catch (err) {
                    NTES("#weiboCount").attr("innerHTML", 0);
                }
            }
        } catch (err) {
            //NTES("#weiboCount").attr("innerHTML", 0);
        }
    }
    if(objLeft!=null&& typeof(objLeft) != "undefined"){
        objLeft.innerHTML = left_login_html;
    }

    if (filename == "list"){
        //管理模式按钮
        try {
            BbsBoardAdmin.load();
        }
        catch (e){}
    }

    ////////
};

/**
 *关闭消息提示便笺
 */

BbsUtil.closeBbsTinytips = function () {
    var obj = $$("div.bbsTinytips");
    if (obj != null) {
        obj[0].hide();
        CookieStatus.closeMsgTip();
    }
};

/**
 * 获取签到的html
 * @create_date 2011-5-16
 * @last_modified 2011-5-16
 * @author Ben Liu
 */

BbsUtil.getUserSignHtml = function () {
    var html = [];
    html.push(' <span class="signByday topnav-signByday">');

    var signClass = 'signByday-cell';
    if (BbsCookie.isLogined()) {
        var username = BbsCookie.getPassport();
        var isUserSigned = BbsCookie.getCookie(username + BbsUtil.userSignCookieKey);
        if (isUserSigned && isUserSigned == 'y') {
            signClass += ' signByday-signed';
        }
    }

    html.push(' <a id="signBydaySpan" class="'+signClass+'" href="javascript:;" onclick="javascript:BbsUtil.addUserSign();"> 签到</a>');

    // 如果用户点击了关闭提示，记住24小时
    var hideCss = '';
    //if (BbsCookie.isLogined()) {	// 仅当用户登录了之后，才记住是否关闭提示的状态
    var isUserClosedTip = BbsCookie.getCookie(BbsUtil.userOperationCookieKey);
    //log('get cookie:'+BbsUtil.userOperationCookieKey+'-'+isUserClosedTip);
    if (isUserClosedTip && isUserClosedTip == 'y') {
        hideCss = ' style="display:none;" ';
    }
    //}

    // 取消签到提示的标签
    // 2011-6-27 by Ben Liu
    //html.push('	<div id="bbsRedTinytips0" class="bbsRedTinytips"'+hideCss+'>');
    //html.push('    	<span class="bbsRedTinytips-arrow-down"></span>');
    //html.push('		<span class="bbsRedTinytips-arrow-close" onclick="javascript:BbsUtil.closeUserSignTips();" title="关闭"></span>');
    //html.push('   	<p class="bbsRedTinytips-body">每日签到送积分，快来试试手气！</p>');
    //html.push('  </div>');

    html.push('</span>');

    return html.join('');
};
/**
 * 用户签到
 * @create_date 2011-5-16
 * @last_modified 2011-5-17
 * @author Ben Liu
 */
BbsUtil.userSignCookieKey = '_u_s_';
BbsUtil.userOperationCookieKey = '_u_p_';
// 加锁，防止用户重复点击。
BbsUtil.userSignLocked = false;
BbsUtil.addUserSign = function () {
    BbsUtil.clickStat("signin");
    //var startTime = new Date().getTime();

    // 如果签到请求已经在执行，返回
    if (BbsUtil.userSignLocked) {
        return false;
    }
    // 标记执行签到请求。
    BbsUtil.userSignLocked = true;
    var username = BbsCookie.getPassport();

    if (!BbsCookie.isLogined()) {	// 没有登录，显示登陆框
        // 释放锁
        BbsUtil.userSignLocked = false;
        Bbs.showLoginDialog(true);  //显示登录框，登录成功后自动回调
        return false;
    } else {
        var val = BbsCookie.getCookie(username + BbsUtil.userSignCookieKey);
        //log('get cookie:'+username + BbsUtil.userSignCookieKey+'-'+val);
        if (val && val == 'y') {	// 签到失败，已经签到过了。
            // 释放锁
            BbsUtil.userSignLocked = false;
            return false;
        }
        var signFailedMsg = '签到失败，请稍后重试。';
        var signSuccessMsgPrefix = '今日已成功签到（获得';
        var signSuccessMsgSuffix = '积分），请明日再来领取积分。';
        var signedMsg = '您今天已签到过了，请明天再来吧！';

        // 签到url
        var url = 'http://service.bbs.163.com/bbs/article/user_sign.jsp';
        // 签到的回调函数
        var onSigned = function () {
            // 测试性能
            //var endTime = new Date().getTime();
            //if (window.console) {
            //	window.console.log('Sign spent '+(endTime - startTime) + 'ms, expire in ' + (userSignStatus.expire/(3600*1000)) + 'h.');
            //}

            if (_user_sign_code == 0 || _user_sign_code == -1 || _user_sign_code == -2) {
                var code = _user_sign_code;
                var expire = _user_sign_expire;
                // alert('code:'+code+',expire:'+expire);
                if (code == 0 || code == -1) {	// 签到成功（或者已经签到过了），写入cookie。
                    // 使用username+"_user_signed"作为cookie的key
                    //log('set cookie:'+username + BbsUtil.userSignCookieKey+'-y, expire:'+expire);
                    BbsCookie.setCookie(username + BbsUtil.userSignCookieKey, 'y', expire, '/');
                    // 更新样式
                    BbsUtil.updateUserSignedCss();
                    if (code == 0) {
                        var point = 10;
                        if (_user_sign_point) {
                            point = _user_sign_point;
                        }
                        alert(signSuccessMsgPrefix+point+signSuccessMsgSuffix);
                    } else {
                        alert(signedMsg);
                    }
                } else if(code == -2) {	// 用户没有登录
                    BbsUtil.userSignLocked = false;
                    Bbs.showLoginDialog();  //显示登录框
                } else {	// 签到失败，显示提示信息。
                    alert(signFailedMsg);
                }
            } else {	// 签到失败，显示提示信息。
                alert(signFailedMsg);
            }
            // 释放锁
            BbsUtil.userSignLocked = false;

        };
        // jsonp的方式引入跨域的数据
        _ntes._importJs(url, onSigned);

    }

};
/**
 * 更新签到按钮的样式
 * @create_date 2011-5-17
 * @last_modified 2011-5-17
 * @author Ben Liu
 */
BbsUtil.updateUserSignedCss = function () {
    var item = document.getElementById('signBydaySpan');
    if (item) {
        item.className = item.className + ' signByday-signed';
    }
    //var items = $$('.signByday span.signByday-cell');
    //if (items[0] && items[0].className) {
    //	items[0].className = items[0].className + ' signByday-signed';
    //}
    // NTES(".signByday span.signByday-cell").addCss('signByday-signed');
};

/**
 * 关闭签到提示tip
 * @create_date 2011-5-17
 * @last_modified 2011-5-17
 * @author Ben Liu
 */
BbsUtil.closeUserSignTips = function () {
    var item = document.getElementById('bbsRedTinytips0');
    if (item) {
        item.style.display = 'none';
    }
    //NTES(".bbsRedTinytips").addCss('display:none;');
    //需要记住用户操作。记住24小时，希望用户点了一次之后。
    var expire = 24*3600*1000;
    //log('set cookie:'+BbsUtil.userOperationCookieKey+'-y, expire:'+expire);
    BbsCookie.setCookie(BbsUtil.userOperationCookieKey, 'y', expire, '/');
};

var BbsList = {
    "init":function(update){
        Userinfo.loadUserinfo();

        if (!update) {	// 是否是修改帖子
            //log('init image share.');
            BbsList.initWeibo();
            BbsList.initImageShare();
            BbsList.initGuessIfPossible();
            if(global_channel=="digi" || global_channel=="travel" || global_pageDbname=="test_bbs"){
                BbsList.initImageExif();
            }
        }
    }
    ,"initWeibo":function(){
        /**
         * 与微博互通，帖子查看页，初始化“他的微博”链接。开始。
         * 更新：只有当点击的时候，才请求微博api
         * @create_date 2011-5-10
         * @last_modified 2011-6-1
         * @author Ben Liu
         */
        var weiboLinks = NTES(".tie-author-column a.info-weibo");
        var weiboUrlPrefix = 'http://t.163.com/';
        weiboLinks.each(function(i){
            var trigger = this;
            var userEmail = trigger.name;
            if (userEmail && userEmail.length > 0) {
                if(!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(userEmail)){
                    userEmail += "@163.com";
                }
                NTES.event.addEvent(trigger, "click", function(e) {
                    // 没有加载screenName才会去加载，确保每一个链接仅请求一次微博服务
                    if (trigger.href && trigger.href.indexOf(weiboUrlPrefix) < 0) {
                        document.domain = location.hostname.replace(/^.*\.([\w]+\.[\w]+)$/,'$1');
                        //alert(document.domain);
                        var proxy = document.getElementById("iframeProxy").contentWindow;
                        try {
                            var xhr = proxy.gx();
                            xhr.open("GET", "http://t.163.com/service/newMessage/" + userEmail + "/1/0/0/0/1", false);
                            xhr.send(null);
                            if (xhr.status != 200) {
                                trigger.href = weiboUrlPrefix + "?f=bbsleft";
                            } else {
                                try {
                                    var result = xhr.responseText;
                                    var fixed = false;
                                    if (result) {
                                        eval(result);
                                        if (resultStatus && resultStatus.screenName) {
                                            trigger.href = weiboUrlPrefix + resultStatus.screenName + "?f=bbsleft";
                                            fixed = true
                                        }
                                    }
                                    if (!fixed) {
                                        trigger.href = weiboUrlPrefix + "?f=bbsleft";
                                    }
                                } catch (err) {
                                    trigger.href = weiboUrlPrefix + "?f=bbsleft";
                                }
                            }
                        } catch (err) {
                            trigger.href = weiboUrlPrefix + "?f=bbsleft";
                        }
                    }

                    window.open(trigger.href);
                    return false;
                });
            }
        });
    }
    /**
     * 修复“转发至微博”的图片加链接就会出问题的bug。
     * @create_date 2011-7-26
     * @last_modified
     * @author Ben Liu
     */
    ,"initImageShare":function(){

        var title = "", // 主贴标题
            soure = "网易论坛",
            location = window.location.href.replace(/(#|\?).*$/g,''), // 当前页面地址
            picsElem = NTES(".tie-content img");

        title = NTES('h2.tie-con-hd-title');
        title = _ntes.DOM.getInnerText(title[0]);

        var warp = document.createElement('span'), docbody = document.body, roundbtn, gourl, tid;
        warp.className = "warpPicBox";
        warp.innerHTML = '<span class="roundbtn roundbtn-white push-163tblog"><a href="#"><span class="icons-tinyblog warpPicBox-inline-block"></span><span class="warpPicBox-inline-block">转发至微博</span></a></span>';
        roundbtn = NTES.one('.roundbtn', warp);
        docbody.insertBefore(warp, docbody.firstChild);

        picsElem.each(function(i){
            if(!(/^http\:\/\/[cm]img.163.com\/.*\.(gif|png|jpg)$/.test(this.src)) && !(/\/bbs2009\/img\//.test(this.src))){
                var t = this, showed = false;

                var author_username = global_author_username;
                if (author_username.indexOf('@') < 0 ) {
                    author_username += '@163.com';
                }

                function show(){
                    //if (showed) return;
                    showed = true;
                    tid && clearTimeout(tid);
                    var pos = BbsUtil.getAbsPosition(t);
                    warp.style.left = pos.x + "px";
                    warp.style.top = pos.y + t.offsetHeight - warp.offsetHeight + "px";
                    //gourl = "http://t.163.com/article/user/checkLogin.do?method=click&keyfrom=share1.bbs.note&togImg=true&check1stImg=true&link=http://bbs.163.com/&source="+encodeURIComponent(soure)+"&info="+encodeURIComponent("分享"+ soure +"图文《" + title + "》 " + location)+"&title="+encodeURIComponent(title)+"&images="+encodeURIComponent(t.src);

                    gourl = "http://t.163.com/article/user/checkLogin.do?"+
                        "method=" + encodeURIComponent("click") +
                        "&keyfrom=" + encodeURIComponent("share1.bbs.tie") +
                        "&source=" + encodeURIComponent(soure) +
                        "&info=" + encodeURIComponent(title + " " + location) +
                        "&link=" + encodeURIComponent("http://bbs.163.com/") +
                        "&images=" + encodeURIComponent(t.src) +
                        "&togImg=" + encodeURIComponent("true") +
                        "&check1stImg=" + encodeURIComponent("true") +
                        "&email=" + encodeURIComponent(author_username) +
                        "&author=" + encodeURIComponent(global_author_nickname) +
                        "&type=" +encodeURIComponent("bbs") +
                        "&title=" + encodeURIComponent(title);
                };
                function hide(){
                    tid = setTimeout(function(){
                        showed = false;
                        warp.style.left = "-999px";
                    },200);
                }
                NTES(t).addEvent("mouseover", show);
                NTES(t).addEvent("mouseout", hide);
            }
        });

        NTES(warp).addEvent("mouseover", function(){
            tid && clearTimeout(tid);
        });
        NTES('.push-163tblog', warp).addEvent("click", function(){
            gourl && window.open(
                gourl,
                'newwindow',
                'height=330, width=650, toolbar=no, menubar=no, scrollbars=no,resizable=yes,location=no, status=no'
            );
            return false;
        });
    }
    ,"initGuessIfPossible": function(){
        /**
         * 初始化竞猜，如果该帖子含有竞猜内容
         * @create_date 2011-6-17
         * @last_modified 2011-6-17
         * @author Ben Liu
         */

        // 初始化竞猜数据
        // 查找竞猜id
        var guessIds = [];
        NTES("div._guess_field").each(function(i){
            var srcId = this.id;
            guessIds.push(srcId.substring('_guess_no_'.length));
        });

        if (guessIds.length <= 0) {
            return false;
        }
        // 发送dwr请求
        Dwr.getGuessInfo(guessIds.join(','), function (json) {
            if (json) {
                json = eval('('+json+')');
                if (json && json.length && json.length > 0) {
                    BbsGuess.drawGuessOptions(json);
                }
            }
        });

    }
    ,"toggle":function(objId){
        obj=document.getElementById(objId);
        obj.style.display=(obj.style.display=="")?"none":"";
    }

    ,"changeIframe":function(){
        BbsList.toggle("leftBar");
        var imgObj=document.getElementById("changeImg");
        var main=document.getElementById("mainArea");
        imgObj.src=(imgObj.src.indexOf("left")!=-1)?imgObj.src.replace('left','right'):imgObj.src.replace('right','left');
        main.style.marginLeft=(main.style.marginLeft=='0px')?"145px":"0px";

    }

    ,"onTabChange":function(hrefpre,divpre,idx,maxidx)
    {
        var i=1;
        while(i<=maxidx)
        {
            if (i!=idx)
            {
                href_obj = document.getElementById(hrefpre + i);
                if (href_obj != null){
                    href_obj.className = "";
                }
                div_obj = document.getElementById(divpre + i);
                if (div_obj != null){
                    div_obj.style.display = "none";
                }
            }
            i = i + 1;
        }
        href_obj = document.getElementById(hrefpre+idx);
        if ( href_obj != null ){
            href_obj.className = "active";
        }
        div_obj = document.getElementById(divpre + idx);
        if (div_obj != null){
            div_obj.style.display = "block";
        }
    }
    ,"initImageExif": function(){
        /**
         * 对帖子中图片插入EXIF信息查看 最小图片400x400
         */

        var obj1 = NTES('#exifPostImgUrlList');
        var obj2 = NTES('#exifSrcImgUrlList');

        if (!obj1 || !obj2) {
            return;
        }

        var picsElem = NTES('.tie-content img'),
            exifpop = document.createElement('div'),
            docbody = document.body,
            postImgs = obj1.value.split('$$'),
            srcImgs = obj2.value.split('$$'),
            index = 0;
        exifpop.className = 'articleExifPop';
        exifpop.innerHTML = '<div class="articleExifPop_bg"></div><div class="articleExifPop_cnt"><a href="#close" target="_self" class="articleExifPop_close js_articleExifPopClose">关闭</a><div id="photoExifContent"><h3>加载中...</h3></div></div>';
        exifpop.style.left = '-9999px';
        docbody.insertBefore(exifpop, docbody.firstChild);

        NTES('.js_articleExifPopClose').addEvent('click', function(){
            exifpop.style.left = '-9999px';
        })

        picsElem.each(function(i){
            var pic = NTES(this),
                exifbox = document.createElement('span'),
                btn = document.createElement('a'),
                a = document.createElement('span'),
                srcurl = '';
            for( i = 0; i < postImgs.length; i++ ){
                if( postImgs[i] == pic.src ){
                    srcurl = srcImgs[i];
                }
            }
            if( pic.complete && srcurl != '' ){
                BbsList.exifImgOnload(pic, exifbox, btn, exifpop, srcurl);
            } else if ( srcurl != '' ) {
                pic.addEvent( 'load', function(){
                    BbsList.exifImgOnload(this, exifbox, btn, exifpop, srcurl);
                });
            }
        });

    }
    ,"exifImgOnload": function(pic, exifbox, btn, exifpop, srcurl){
        /**
         * 需要显示EXIF信息的图片处理
         */
        var width = pic.width,
            height = pic.height;
        if(parseInt(width) >= 400 && parseInt(height) >= 400){
            exifbox.className = 'articleExifBox';
            pic.parentNode.insertBefore(exifbox, pic);
            exifbox.appendChild(pic);
            btn.className = 'articleExifIcon';
            btn.href = '#exif';
            btn.innerHTML = '拍摄信息';
            btn.setAttribute('srcurl', srcurl);
            exifbox.appendChild(btn);
            NTES(btn).addEvent('click', function(e){

                e.preventDefault();
                var pos = BbsUtil.getAbsPosition(pic),
                    left = pos.x + pic.offsetWidth - exifpop.offsetWidth - 1 + 'px',
                    top = pos.y + pic.offsetHeight - exifpop.offsetHeight - 1 + "px";
                if(parseInt(exifpop.style.left) == parseInt(left) && parseInt(exifpop.style.top) == parseInt(top)) {
                    exifpop.style.left = '-9999px';
                } else {
                    Bbs.buildExifdata(srcurl, NTES('#photoExifContent'), function(){
                        exifpop.style.left = pos.x + pic.offsetWidth - exifpop.offsetWidth - 1 + 'px';
                        exifpop.style.top = pos.y + pic.offsetHeight - exifpop.offsetHeight - 1 + "px";
                    });

                }
            });
        }
    }
}



/**
 * 简洁版面
 */
var BbsSimple = {
    "init":function() {
        var url = document.location.href;
        if (url.indexOf(".html")==-1) {
            return;
        }



        if (url.indexOf("/simple/")>0) {
            try {
                BbsList.changeIframe();//隐藏左侧导航栏
            }
            catch (e){}

            this.hideHeader();
            this.hideFooter();
            this.hideFloatLayer();
            return;
        }
        else if (url.indexOf("/noheader/") > 0) {
            this.hideHeader();
            return;
        }
        else if (url.indexOf("/nofooter/") > 0) {
            this.hideFooter();
            return;
        }
        else if (url.indexOf("/nofloatlayer/") > 0) {
            this.hideFloatLayer();
            return;
        }

    }

    ,"hideHeader":function() {
        var obj = $("boardHeader");
        if (obj != null) {
            obj.style.display = "none";
        }
    }
    ,"hideFooter":function() {
        var obj = $("footer");
        if (obj != null) {
            obj.style.display = "none";
        }
    }

    ,"hideFloatLayer":function() {
        var obj = $("floatLayer");
        if (obj != null) {
            obj.style.display = "none";
        }
    }
}




Bbs.gotopage = function(pageid) {
    var e;
    if (typeof(event)=="undefined") {
        var func = (Bbs.gotopage.caller);
        e = func.arguments[0];
    }
    else {
        e = event;
    }

    var ieKey=e.keyCode;
    if (ieKey!=13){
        return;
    }

    this.gotoPage(pageid);
}


Bbs.gotoPage = function(pageid) {
    if (pageid=="") {
        alert("请输入页码.");
        return false;
    }

    var url = "/bbs/"+filename+".jsp?boardid="+global_boardid;
    if (filename == "article") {
        url += "&articleid="+global_threadid;
    }
    window.location.href = url + "&pageid="+pageid;
}

Bbs.gotoSubmit = function(obj) {
    var parent = obj.parentNode;
    var childs = parent.childNodes;
    var input = null;
    for (var i=0; i<childs.length; i++) {
        if (childs[i].tagName == "INPUT") {
            input = childs[i];
            break;
        }
    }
    if (input == null) {
        alert("获取输入框出错.");
        return false;
    }
    var pageid = input.value;
    this.gotoPage(pageid);
}

/**
 * 插入微博名片
 * @create_date 2011-7-18
 * @last_modified
 * @author Ben Liu
 */

var WeiboCard = {
    // 当前选中的微博名片的主题
    "_weibo_card_selected_theme":1
    // 提示内容
    ,"_weibo_card_template":'\
		<em class="synTinyblog-tips-close">关闭</em>\
		<em class="synTinyblog-tips-arrow"></em>\
	    <p>发贴可以插入微博名片了&nbsp;&nbsp;</p>'
    // 正在执行插入，加锁，防止用户重复点击“插入”按钮
    ,"isInserting":false
    // 选择名片的皮肤
    ,"selectTheme":function(obj, screen_name, num){
        if(num) {
            var iframe = NTES('#_weibo_card_iframe');
            if (iframe) {
                iframe.src = 'http://t.163.com/page/card.html?'+screen_name+'|0|0|'+num;
            }
            if (obj) {
                NTES('.dialogBox-weibo-skin-current').each(function () {
                    this.className = 'dialogBox-weibo-skin';
                });
                obj.className = obj.className + ' dialogBox-weibo-skin-current';
            }
            this._weibo_card_selected_theme = num;
        }
    }
    // 点击插入
    ,"doInsert":function(user_email, screen_name){
        if (this.isInserting) {
            return false;
        }

        this.isInserting = true;

        var errorMsg = '插入微博名片出错，请稍后重试。';
        if (!user_email || !screen_name || user_email == '' || screen_name == '') {
            alert(errorMsg);
            this.isInserting = false;
            return false;
        }

        Dwr.insertWeiboCard(user_email, screen_name, this._weibo_card_selected_theme, function(json) {
            if (json) {
                json = eval('('+json+')');
                result = json.result;
                if (result) {
                    var cardPlugin = '[plugin:tcard]'+json.card_id+'[/plugin:tcard]';
                    EditorExtend.insert({text:cardPlugin});
                    Dialog.close();
                    return true;
                } else {
                    alert(json.msg);
                    return false;
                }
            }

            alert(errorMsg);
            return false;
        });

        this.isInserting = false;
        return true;
    }
    // 添加微博名片插入的提示
    ,"appendWeiboCardTip":function(){
        var editor = NTES('div#divComposeEditor')[0];
        if (editor) {
            var link = NTES('a.g-editor-btninfo-bbstcard', editor);
            if (link) {
                // 绑定点击微博名片按钮的事件
                link.addEvent("click", function () {
                    EditorExtend.insertWeiboCard();
                });

                link = link[0];

                // 如果没有关闭tip，显示
                // 如果用户未登录，也显示
                if (!CookieStatus.isWeiboCardTipClosed() || !BbsCookie.isLogined()) {
                    var icon = link.parentNode.parentNode;
                    if (icon) {
                        icon.className = icon.className + ' g-editor-bbsweibo';
                        var div = document.createElement('div');
                        div.className = "synTinyblog-tips";
                        div.innerHTML = this._weibo_card_template;
                        icon.appendChild(div);
                    }

                    var closer = NTES('.synTinyblog-tips-close', icon);
                    if (closer) {
                        // 绑定关闭提示事件
                        closer.addEvent("click", function () {
                            var tipPanel = NTES('.synTinyblog-tips', icon)[0];
                            tipPanel.parentNode.removeChild(tipPanel);
                            CookieStatus.closeWeiboCardTip();
                            // 关闭icon选择的样式
                            var selectedTag = 'g-editor-btn-on';
                            if (icon.className.indexOf (selectedTag) >= 0) {
                                icon.className = icon.className.replace(selectedTag, '');
                            }
                        });
                    }
                }
            }
        }
    }
};

/**
 * DOM操作接口。开始。
 * @create_date 2011-5-10
 * @last_modified 2011-5-10
 * @author Ben Liu
 */
//简化DOM操作 =================
if (typeof (_ntes) == "undefined")
    _ntes = {};
if (typeof (_ntes.DOM) == "undefined")
    _ntes.DOM = {};

if (typeof (_ntes._importJs) == "undefined")
    _ntes._importJs = function (url, onComplete, charset, doc) {

        // 动态加载外部Javascript文件
        /// @param {String} 文件地址
        /// @param {Function} 加载完成后执行的回调函数
        /// @param {String} 编码
        /// @param {Object} 文档对象，默认为当前文档

        doc = doc || document;

        var script = doc.createElement("script");
        script.language = "javascript"; script.type = "text/javascript";
        charset && (script.charset = charset);

        // 读取完后的操作
        script.onload = script.onreadystatechange = function() {
            if (!script.readyState || "loaded" == script.readyState || "complete" == script.readyState) {
                onComplete && onComplete();
                script.onload = script.onreadystatechange = null;
                // 测试注释
                script.parentNode.removeChild(script);
            }
        };

        var head = document.getElementsByTagName("head")[0]|| document.documentElement;
        script.src = url;
        head.insertBefore(script, head.firstChild);
        //head.appendChild(script);
        //jRaiser.one("head", doc).appendChild(script);
    };

/**
 * get text of object
 */
_ntes.DOM.getInnerText = function(node) {
    var text = "";

    if (node && node.childNodes) {	// 如果节点存在，且有子节点
        var list = node.childNodes;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item && item.childNodes) {	// 如果有子节点，继续找
                text += _ntes.DOM.getInnerText(item);
            }
            if (item.nodeValue) {
                text += item.nodeValue;
            }
        }
    }

    return text;
};

/**
 * DOM操作接口。结束。
 * @create_date 2011-5-10
 * @last_modified 2011-5-10
 * @author Ben Liu
 */

var BbsLeft = {
    "init":""
    ,"prevNodeid":null //上一个显示的nodeid
    ,"isNorth":false
    ,"defaultShow":function(nodeid,index){
        if (nodeid=="2010" || nodeid=="cbachina"){
            this.show("sports",index);
            return;
        }
        if(nodeid == "bjhouse" || nodeid == "szhouse"){
            nodeid = "house";
        }
        var objItem = $("left_item_"+nodeid);
        if(objItem==null){
            this.show("service",index);
        }else{
            this.show(nodeid,index);
        }
    }

    ,"showNav":function(nodeid,index){
        var obj = $("left_"+nodeid);
        var objItem = $("left_item_"+nodeid);

        if (this.prevNodeid == null) {
            var siblings = obj.siblings();
            for (var i=0; i<siblings.length; i++) {
                siblings[i].style.display = "none";
            }

            var itemSiblings = objItem.siblings();
            for (var i=0; i<itemSiblings.length; i++) {
                itemSiblings[i].removeClassName("active");
            }
        }
        else {
            $("left_"+this.prevNodeid).style.display = "none";
            $("left_item_"+this.prevNodeid).removeClassName("active");
        }

        this.prevNodeid = nodeid;

        if (obj.innerHTML=="") {
            objItem.addClassName("active");
            this.loadHtml(nodeid,index);
        }
        else {
            objItem.addClassName("active");
            obj.style.display = "block";
        }
    }

    ,"show":function(nodeid, index){
        if(nodeid != "house"){
            BbsLeft.showNav(nodeid, index);
            return;
        }
        var houseIPQuery=new Object();
        (function() {
            var china = {
                north : "|北京市|天津市|河北省|山西省|内蒙古|辽宁省|吉林省|黑龙江省|山东省|河南省|陕西省|",
                east : "|上海市|江苏省|浙江省|安徽省|江西省|",
                sichuan : "|四川省|",
                shenzhen : "|深圳市|",
                south : "|广东省|",
                hainan : "|海南省|",
                foshan : "|佛山市|",
                others : "|广州市|"
            };
            var locQuery = {
                url : "http://ip.ws.126.net/ipquery",
                cookieName : "locOfCh",
                exec : function(onComplete) {
                    var result = NTES.cookie.get(this.cookieName);
                    if (result != "" && china.hasOwnProperty(result)) {
                        onComplete(result);
                    } else {
                        NTES.ajax.importJs(this.url, function() {
                            if (typeof lo != "undefined" && typeof lc != "undefined") {
                                var tempO = "|" + lo + "|", tempC = "|" + lc + "|";
                                if (china.north.indexOf(tempO) != -1) {
                                    result = "north";
                                } else if (china.east.indexOf(tempO) != -1) {
                                    result = "east";
                                } else if (china.shenzhen.indexOf(tempC) != -1) {
                                    result = "shenzhen";
                                } else if (china.sichuan.indexOf(tempO) != -1) {
                                    result = "sichuan";
                                }else if (china.south.indexOf(tempO) != -1) {
                                    result = "south";
                                } else {
                                    result = "others";
                                }
                            }
                            if (result) {
                                NTES.cookie.set(locQuery.cookieName, result, '1M',".163.com");
                                onComplete(result);
                            }
                        });
                    }
                }
            };
            houseIPQuery = locQuery;
        })();
        houseIPQuery.exec(function(loc) {
            var itemhouse = NTES("#left_item_house"),tabhouse = NTES("#left_house"),itemhome = NTES("#left_item_home"),tabhome = NTES("#left_home");
            if(loc == "north"){
                BbsLeft.isNorth = true;
            }else{
                BbsLeft.isNorth = false;
            }
            BbsLeft.showNav(nodeid, index);
        });
    }

    ,"showChild":function(nodeid){
        var obj = $(nodeid);
        var nextObj = $(obj).next().next();
        if(nextObj != null){
            if(nextObj.style.display==""||nextObj.style.display=="block"){
                nextObj.style.display = "none";
                obj.innerHTML = '<img src="http://img1.cache.netease.com/bbs/img11/bbs0621/icon01.gif" width="9" height="9" alt="打开" />';
                $(obj).removeClassName("unfold");
            }else{
                nextObj.style.display = "block";
                obj.innerHTML = '<img src="http://img1.cache.netease.com/bbs/img11/bbs0621/icon02.gif" width="9" height="9" alt="关闭" />';
                $(obj).addClassName("unfold");
            }
        }
    }

    ,"loadHtml":function(nodeid,index) {
        var childhtmlid = nodeid;
        if(nodeid=="house" && this.isNorth){
            childhtmlid = "bjhouse";
        }
        var url = "/htmlfile/left_2009/"+childhtmlid+"_child.htm";
        if(index != undefined && index == true){
            url = "/htmlfile/left_2009/"+childhtmlid+"_index_child.htm";
        }
        var obj = $("left_"+nodeid);
        obj.style.display = "block";
        obj.innerHTML = "<span>读取中...</span>";
        new Ajax.Request(url, {
            method: 'get',
            requestHeaders:["If-Modified-Since","0"],
            onComplete: function(data) {
                var content = (data.responseText);
                obj.innerHTML = content;
            }
        });

    }
    /**
     * 显示版面搜索框
     */
    ,"isInitBoardSearch":false
    ,"initBoardSearch":function() {
        if (this.isInitBoardSearch) {
            return;
        }
        AutoComplete.autoSearch = function(keyword) {
            Dwr.searchBoards(keyword, AutoComplete.autoSearchResponse);
        }
        var createButton = false;
        //AutoComplete.setWidth(145);
        AutoComplete.setAutoWidth(true);
        AutoComplete.autoExecute = function() {
            var boardid = $("boardKeyword").value;
            if (boardid == "") {
                alert("请输入关键字.");
                return;
            }  else if(boardid.match(/^[a-zA-Z0-9\_]*$/g) != null) {
                window.location.href = "/bbs/list.jsp?boardid="+boardid;
            } else {
                AutoComplete.autoSearch(boardid);
            }
        }
        AutoComplete.initEvent("boardKeyword", createButton);
    }
    ,"boardSearchSubmit":function() {
        var keyword = $("boardKeyword").value;
        if (keyword == "") {
            alert("请输入关键字.");
            return;
        }
        window.location.href = "/bbs/list.jsp?boardid="+keyword;
        //Dwr.searchBoards(keyword, function(map) {
        //	var size = 0;
        //	var boardid ;
        //	for (boardid in map) {
        //		size++;
        //	}
        //
        //	if (size>1) {
        //		AutoComplete.autoSearch(keyword);
        //	}
        //	else if (size == 1) {
        //		window.location.href = "/bbs/list.jsp?boardid="+boardid;
        //	}
        //});	
    }

    /**
     * 加载我的收藏
     */
    ,"loadMyFavorite":function(obj) {
        if(!BbsCookie.isLogined()) {
            Bbs.showLoginDialog(true);
            return;
        }
        var url = "/bbs2009/my_favorite.inc.jsp";
        new Ajax.Request(url,{onComplete:function(data){
            var content = (data.responseText);
            if (data.status==200) {
                $(obj).nextSibling.nextSibling.innerHTML = content;
            }
            else {
                alert("请求出错.");
            }
        }});
    }
}

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
    "stop":"",
    "testReplyFromPhotoSet": function () {
        var content = '图集回复：我擦，不错啊。' + new Date();

        /**
         Dwr.ajaxReplyPhoto(244924619, 'test1', content, '', 'http://img1.bbs.163.com/new/20120326/test1/ic/icy_ben/8eca245835b942bd1de0d723ae90f690.jpg','icy_ben', function(responseText){
         // 其他错误信息，验证码错误信息
         alert(responseText[0] + '#' + responseText[1]);
         });
         **/
        Dwr.ajaxReplyAlbum(244924619, 'test1', content, '', function(responseText){
            // 其他错误信息，验证码错误信息
            alert(responseText[0] + '#' + responseText[1]);
        });
    }
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

var GiftService = {
    "init":""
    ,"sendKiss":function(username, dbname, boardid, threadid) {
//        if (!BbsCookie.isLogined()) {
//            Bbs.showLoginDialog(GiftService.sendKiss(username, dbname, boardid, threadid));
//        } else {
        BbsAdmin.showDialog("赠送香吻", "/user/gift/sendKiss.do?receiver="+username+"&dbname="+dbname+"&boardid="+boardid+"&threadid="+threadid);
        Dialog.setWidth(400);
//        }
    }
    ,"sendBrick":function(username, dbname, boardid, threadid) {
//        if (!BbsCookie.isLogined()) {
//            Bbs.showLoginDialog(GiftService.sendBrick(username, dbname, boardid, threadid));
//        } else {
        BbsAdmin.showDialog("赠送板砖", "/user/gift/sendBrick.do?receiver="+username+"&dbname="+dbname+"&boardid="+boardid+"&threadid="+threadid);
        Dialog.setWidth(400);
//        }
    }

    ,"send":function(giftId, maxNum, dbname, boardid, threadid) {
        var num = parseInt($('giftLog.num').value);
        if (isNaN(num) || num < 1) {
            alert('赠送数量应为大于0的整数');
            return;
        }
        if (num > parseInt(maxNum)) {
            alert('您的最大赠送数量为' + maxNum);
            return;
        }
        var username = $('giftLog.username').value;
        $('subButton').disabled = true;

        dwrGiftService.send(giftId, num, username, dbname, boardid, threadid, function(data) {
            if ("success" == data) {
                alert("赠送成功");
                var original;
                if (giftId == 1) {
                    original = parseInt($('countkiss').innerHTML);
                    $('countkiss').innerHTML = original + num;
                    Dwr.sayGood(boardid, threadid,num,function(data){});
                } else {
                    original = parseInt($('countbrick').innerHTML);
                    $('countbrick').innerHTML = original + num;
                    Dwr.sayBad(boardid, threadid,num,function(data){});
                }
                Dialog.close();
            } else {
                alert(data);
                $('subButton').disabled = false;
            }
        });
    }
    ,"countKissBrick":function(boardid,threadid) {
        if ($('countkiss').innerHTML == undefined || $('countkiss').innerHTML == "") {
            return;
        }
        dwrGiftService.countKissBrick(boardid,threadid,function(data) {
            for (var id in data) {
                $('count'+id).innerHTML = data[id];
            }
        });
    }
    ,"toSendGift":function(username, dbname, boardid, threadid,page) {
        if (!BbsCookie.isLogined()) {
            Bbs.showLoginDialog(true);
            return;
        }
        if(page == undefined || page == null){
            page = 1;
        }
        BbsAdmin.showDialog("赠送礼物", "/user/gift/toSendGift.do?receiver="+username+"&dbname="+dbname+"&boardid="+boardid+"&threadid="+threadid+"&page="+page);
        Dialog.setWidth(500);
    }

    ,"sendGift":function(username, dbname, boardid, threadid) {
        var objs = document.getElementsByName("sendGiftid");
        var giftId = null;
        for(i=0; i<objs.length; i=i+1){
            if(objs[i].checked){
                giftId = objs[i].id.substr(10);
            }
        }
        if(giftId==null){
            alert("请选择礼物");
            return;
        }
        var num = $("giftNum"+giftId).value;
        num = parseInt(num);
        if(isNaN(num)){
            alert("请填写正确的礼物数量。");
            return;
        }
        if(num < 1){
            alert("礼物数量不能小于1。");
            return;
        }
        var remark = $("remark").value;
        if(remark == ""){
            alert("赠言不能为空。");
            return;
        }
        $("sendBtn").disabled = true;
        dwrGiftService.sendGift(giftId, num, username, dbname, boardid, threadid, remark, function(data) {
            alert(data);
            document.location.replace(document.location.href);
        });
    }
};

var msg = {
    "init":""
    ,"checkInputNum":function(inputObj, num, divName) {
        var inputnum = inputObj.value.length;
        if (inputnum >= num) {
            inputObj.value = inputObj.value.substring(0, num);
            inputObj.focus();
        }
    }
};
/**
 * 调试使用
 * @create_date 2011-5-4
 * @last_modified 2011-5-4
 * @author Ben Liu
 */
var log = function (msg) {
    if (window.console) {
        window.console.log(msg);
    }
};


// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (dwrGiftService == null) var dwrGiftService = {};
dwrGiftService._path = '/user/dwr';
dwrGiftService.send = function(p0, p1, p2, p3, p4, p5, callback) {
    dwr.engine._execute(dwrGiftService._path, 'dwrGiftService', 'send', p0, p1, p2, p3, p4, p5, false, callback);
}
dwrGiftService.setDwrUtil = function(p0, callback) {
    dwr.engine._execute(dwrGiftService._path, 'dwrGiftService', 'setDwrUtil', p0, callback);
}
dwrGiftService.setUsermarkService = function(p0, callback) {
    dwr.engine._execute(dwrGiftService._path, 'dwrGiftService', 'setUsermarkService', p0, callback);
}
dwrGiftService.setGiftLogService = function(p0, callback) {
    dwr.engine._execute(dwrGiftService._path, 'dwrGiftService', 'setGiftLogService', p0, callback);
}
dwrGiftService.setGiftService = function(p0, callback) {
    dwr.engine._execute(dwrGiftService._path, 'dwrGiftService', 'setGiftService', p0, callback);
}
dwrGiftService.setGiftUserService = function(p0, callback) {
    dwr.engine._execute(dwrGiftService._path, 'dwrGiftService', 'setGiftUserService', p0, callback);
}
dwrGiftService.setBuyGiftType = function(p0, callback) {
    dwr.engine._execute(dwrGiftService._path, 'dwrGiftService', 'setBuyGiftType', p0, callback);
}
dwrGiftService.sendGift = function(p0, p1, p2, p3, p4, p5, p6, callback) {
    dwr.engine._execute(dwrGiftService._path, 'dwrGiftService', 'sendGift', p0, p1, p2, p3, p4, p5, p6, false, callback);
}
dwrGiftService.countKissBrick = function(p0, p1, callback) {
    dwr.engine._execute(dwrGiftService._path, 'dwrGiftService', 'countKissBrick', p0, p1, callback);
}
dwrGiftService.setGiftThreadService = function(p0, callback) {
    dwr.engine._execute(dwrGiftService._path, 'dwrGiftService', 'setGiftThreadService', p0, callback);
}
dwrGiftService.setKissGiftId = function(p0, callback) {
    dwr.engine._execute(dwrGiftService._path, 'dwrGiftService', 'setKissGiftId', p0, callback);
}
dwrGiftService.setGiftArticleService = function(p0, callback) {
    dwr.engine._execute(dwrGiftService._path, 'dwrGiftService', 'setGiftArticleService', p0, callback);
}




var AutoComplete = {
    "init":""
    ,"id":""
    ,"defer":200  //延迟n毫秒再向服务器提交查询
    ,"timeout":null
    ,"keyword":null
    ,"width":null
    ,"autoWidth":false
    ,"top":false
    ,"setTop":function(top) {
        this.top = top;
    }
    ,"setWidth":function(width) {
        this.width = width;
    }
    ,"setAutoWidth":function(autoWidth) {
        this.autoWidth = autoWidth;
    }
    ,"autoExecute":function() {
        //回车执行，默认什么也不做
    }
    ,"initEvent":function(txtid, createButton) {
        if (typeof(createButton) == "undefined" || createButton==null) {
            createButton = true;
        }
        this.txtid = txtid;
        this.tableid = txtid+"_autocomplete";
        this.iframeid = txtid + "_iframe";
        var obj = $(txtid);

        if (createButton) {
            this.createSelectBoxButton();
        }

        obj.style.height = "16px";
        obj.style.paddingTop = "1px";
        obj.style.paddingRight = "0px";
        obj.style.paddingBottom = "1px";

        obj.onkeyup = function(aEvent) {
            var myEvent = window.event ? window.event : aEvent;
            var keyCode = myEvent.keyCode;
            if (AutoComplete.timeout != null) {
                window.clearTimeout(AutoComplete.timeout);
                AutoComplete.timeout = null;
            }

            switch (keyCode) {
                case 13://回车
                    AutoComplete.submit(null);
                    break;
                case 16://shift
                    break;

                case 17://Ctrl
                    break;
                case 38:
                    AutoComplete.selectPrev();
                    //向上
                    break;
                case 40:
                    AutoComplete.selectNext();
                    //向下
                    break;
                default:
                    var value = (this.value);
                    if (value == "" || value.length>6) {
                        AutoComplete.hide();
                        return;
                    }
                    AutoComplete.keyword = value;
                    AutoComplete.timeout = window.setTimeout('AutoComplete.deferAutoSearch()', AutoComplete.defer);
                    break;
            }
        }
        obj.onblur = function() {
            //firefox延迟200毫秒隐藏才能执行LI的onclick方法
            //window.setTimeout('AutoComplete.hide()', 200);
        }
    }
    ,"submit":function(srcElement) {
        if(srcElement != null){
            this.select(srcElement);
        }
        AutoComplete.hide();
        AutoComplete.autoExecute();
    }
    ,"btnClick":function(obj) {
        var auto = $(this.tableid);
        if (auto != null && auto.style.display=="block") {
            AutoComplete.hide();
            return;
        }
        AutoComplete.autoSearch("showall");
        $(this.txtid).focus();
    }
    ,"btnMouseOver":function(obj) {
        obj.src = "/bbs/img07/selectBox_true.gif";
    }
    ,"btnMouseOut":function(obj) {
        obj.src = "/bbs/img07/selectBox_false.gif";
    }
    /**
     * 创建下拉框按钮
     */
    ,"createSelectBoxButton":function() {
        var html = '<img src="/bbs/img07/selectBox_false.gif" onclick="AutoComplete.btnClick(this)" align="absmiddle" onmouseover="AutoComplete.btnMouseOver(this)" onmouseout="AutoComplete.btnMouseOut(this)" id="'+this.txtid+'_selectBox">';
        //如果之前已经加载过，就不创建下拉框
        var selectboxButtonObj;
        selectboxButtonObj = $(this.txtid + '_selectBox');
        if (selectboxButtonObj == null || selectboxButtonObj == "undefined"){
            new Insertion.After(this.txtid, html);
        }

    }
    ,"deferAutoSearch":function() {
        //document.title = "timeout:"+this.timeout;
        this.autoSearch(this.keyword);
        this.timeout = null;
    }
    ,"initPosition":function() {
        var textBox = $(this.txtid);

        var width  = textBox.getWidth();
        var height = textBox.getHeight();

        var position = Position.page(textBox);
        var left = textBox.offsetLeft;
        var top  = textBox.offsetTop;
        if (top == 0 && textBox.getBoundingClientRect) {
            top  = textBox.getBoundingClientRect().top + document.documentElement.scrollTop
        }

        var div = $(this.tableid),
            iframe = $(this.iframeid);

        if (!this.autoWidth) {
            if (this.width == null){
                div.style.width = width + "px";
            }
            else {
                div.style.width = this.width + "px";
            }
        }

        div.style.left = left+"px";
        div.style.top  = (top+height)+"px";
        if(this.top){
            div.style.zIndex = 10000;
        }


        if(iframe != null){
            if (!this.autoWidth) {
                if (this.width == null){
                    iframe.style.width = width + "px";
                }
                else {
                    iframe.style.width = this.width + "px";
                }
            }
            iframe.style.left = left+"px";
            iframe.style.top  = (top+height)+"px";
        }
    }

    /**
     * 初始化下拉框的位置
     */
    ,"show":function(html) {
        var tableid = AutoComplete.tableid,
            iframeid = AutoComplete.iframeid,
            div = $(tableid),
            iframe;
        if (div == null) {
            var userAgent = (navigator.userAgent);
            if (userAgent.indexOf("MSIE 6") > 0) {
                //修正IE6层遮挡问题
                iframe = document.createElement('iframe');
                iframe.style.position = "absolute";
                iframe.style.width = "0px";
                iframe.style.height = "0px";
                iframe.style.zIndex = "1";
                iframe.style.overflow = "hidden";
                iframe.id = iframeid;
                document.body.appendChild(iframe);
            }
            div = document.createElement("DIV");
            div.id = tableid;
            div.className = "autocomplete";
            div.innerHTML = '<ul id="'+tableid+'_table" style="cursor:default;"></ul>';
            document.body.appendChild(div);
            AutoComplete.initPosition();
        }
        $(tableid+"_table").innerHTML = html;
        $(tableid).style.display="block";
        //每次更新iframe的大小
        iframe = $(this.iframeid);
        if(iframe != null){
            iframe.style.width = div.offsetWidth;
            iframe.style.height = div.offsetHeight;
            iframe.style.display="block";
        }
    }
    ,"hide":function() {
        var auto = $(this.tableid),
            iframe = $(this.iframeid);
        if (auto != null) {
            auto.style.display="none";
        }
        if (iframe != null) {
            iframe.style.display="none";
        }

    }
    ,"autoSearchResponse":function(map) {
        var html = "";
        for (key in map) {
            var value = map[key];
            html += "<li keyword='"+key+"' content='"+value+"' onmouseover='AutoComplete.selectRowByMouse(this)' onclick=\"AutoComplete.submit(this);\"><nobr>&nbsp;"+key+", "+value+"</nobr></li>";
        }
        if (html == "") {
            AutoComplete.hide();
            return;
        }
        else {
            AutoComplete.show(html);
            return;
        }
    }
    ,"autoSearch":function(keyword) {
        alert("您还没有实现AutoComplete.autoSearch(keyword)方法.");
    }
    ,"select":function(srcElement) {
        var obj = $(this.txtid);
        obj.value = Element.readAttribute(srcElement, "keyword");
        obj.setAttribute("content",Element.readAttribute(srcElement, "content"));
        Form.Element.select(obj);
    }

    /**
     * 鼠标选择
     */
    ,"selectRowByMouse":function(srcElement) {
        //this.select(srcElement);

        //$(this.txtid).value = Element.readAttribute(srcElement, "keyword");

        var nodes = $(this.tableid+"_table").childNodes;

        if (nodes.length <= 0) {
            return;
        }



        var selectedIndex = -1;
        for (var i=0;i<nodes.length;i++) {
            nodes[i].className = "";
        }


        //nodes[selectedIndex]
        srcElement.className = "selectedColor";
    }
    ,"selectPrev":function() {
        AutoComplete.selectRow(-1);
    }
    ,"selectNext":function() {
        AutoComplete.selectRow(1);
    }
    ,"selectRow":function(num) {
        var nodes = $(this.tableid+"_table").childNodes;

        if (nodes.length <= 0) {
            return;
        }



        var selectedIndex = -1;
        for (var i=0;i<nodes.length;i++) {
            if (nodes[i].className == "selectedColor") {
                selectedIndex = i;
            }
        }

        var newIndex = (selectedIndex + num)%nodes.length;

        if (newIndex<0) {
            newIndex = nodes.length+newIndex;
        }
        if (selectedIndex<0) {
            selectedIndex = 0;
        }

        //document.title = "selectedIndex:"+selectedIndex+","+newIndex;


        nodes[selectedIndex].className = "";
        nodes[newIndex].className = "selectedColor";
        AutoComplete.select(nodes[newIndex]);

    }


}



var ChangeColor = {
    "init":function() {
        $(AutoComplete.tableid+"_table").onmouseover=function(aEvent){
            var myEventTarget = window.event ? window.event.srcElement : aEvent.target;
            var oli=ChangeColor.getParentByTagName(myEventTarget,"li");
            oli.className = "selectedColor";
            AutoComplete.select(oli);
        }
        $(AutoComplete.tableid+"_table").onmouseout=function(aEvent){
            var myEventTarget = window.event ? window.event.srcElement : aEvent.target;
            var oli=ChangeColor.getParentByTagName(myEventTarget,"li");
            oli.className = "";
        }


    }
    ,"getParentByTagName":function(o,itag){
        if(o.tagName.toLowerCase=="li") return o;
        while(o.tagName.toLowerCase()!=itag.toLowerCase())
        {
            o=o.parentNode;
        }
        return o
    }

}




BbsPostPlugins.normal = {
    "save":function() {
        return true;
    },
    "stop":function() {
    }
}


BbsPostPlugins.ask = {
    "save":function() {
        var form = document.forms['frmpost'];
        form["icon"].value = 90;
        //alert(form["icon"].value);
        return true;
    },
    "stop":function() {
    }
}


BbsPostPlugins.vote = {
    "addItem":function() {
        var id = "voteitem"+(new Date().getTime());
        var html = '<li class="voteitem0" id="'+id+'"><input name="vote_options" type="text" value=""/>';
        html += ' <a href="javascript:BbsPostPlugins.vote.delItem(\''+id+'\');">移除</a>';
        new Insertion.Before('addItemButton', html);
    },
    "delItem":function(id) {
        $(id).remove();
    },
    "getId":function() {
        var id = 0;
        var content = EditorExtend.getContent();
        var regex = /\[plugin:vote\]([0-9]+)\[\/plugin:vote\]/gi;
        var m = new RegExp(regex).exec(content);

        if (m != null) {
            id = parseInt(m[1]);
        }
        return id;
    },
    "save":function() {
        var form = document.forms['frmpost'];

        var id = this.getId();//投票ID
        var types = BbsUtil.getRadioValue('frmpost', 'vote_types');
        if(types==null||types == "undefined"){
            return true;
        }

        if(form.vote_endtime==null||form.vote_endtime == "undefined"){
            return true;
        }
        var endtime = form.vote_endtime.value;
        var options = BbsUtil.getValues('frmpost', 'vote_options');


        if (1==1) {
            //验证选项是否按照顺序填写
            var lastid = -1;
            for (var i=options.length-1;i>=0;i--) {
                if (options[i] != '') {
                    lastid = i;
                    break;
                }
            }

            if (lastid == -1) {
                alert('选项列表不能空着,需要填些东西.');
                return false;
            }

            for (var i=0;i<=lastid;i++) {
                if (options[i]=='') {
                    alert('您没有按照顺序填写.');
                    return false;
                }
            }
        }

        DWREngine.setAsync(false);
        var flag = false;
        Dwr.updateVote(global_boardid,global_threadid, id, types, endtime, false, options, function(content) {
            if (content != '') {
                //添加操作
                EditorExtend.insert({text:content});
            }
            else {
                //表示更新操作
            }
            flag = true;
        });
        DWREngine.setAsync(true);

        return flag;
    },
    "stop":function() {
    }
}


BbsPostPlugins.debate = {
    "getId":function() {
        var id = 0;
        var content = EditorExtend.getContent();
        var regex = /\[plugin:debate\]([0-9]+)\[\/plugin:debate\]/gi;
        var m = new RegExp(regex).exec(content);

        if (m != null) {
            id = parseInt(m[1]);
        }
        return id;
    },
    "save":function() {
        var form = document.forms['frmpost'];

        var id = this.getId();//投票ID

        var good = form.debate_good.value;
        var bad  = form.debate_bad.value;


        if (good=="") {
            alert("正方观点不能为空.");
            form.debate_good.focus();
            return false;
        }

        if (bad=="") {
            alert("反方观点不能为空.");
            form.debate_bad.focus();
            return false;
        }

        DWREngine.setAsync(false);
        var flag = false;
        DwrPlugin.saveDebate(global_boardid, global_threadid,id, good, bad, function(content) {
            if (content != '') {
                //添加操作
                //Editor.insertContent(content);
                EditorExtend.insert({text:content});
            }
            else {
                //表示更新操作
            }
            flag = true;
        });
        DWREngine.setAsync(true);

        return flag;
    },
    "stop":function() {
    }
}



/**
 * 检查字符串是否为小数.
 */
String.prototype.isDecimal = function() {
    var regex=/^([0-9]+(\.[0-9]+)?)$/;
    if (regex.exec(this)){
        return true;
    }
    return false;
}


BbsPostPlugins.activity = {
    "addItem":function() {
        var id = "voteitem"+(new Date().getTime());

        var html = '<li class="activityps0" id="'+id+'"><h5>　</h5><input name="activity_options" type="text" value=""/>';
        html += ' <a href="javascript:BbsPostPlugins.activity.delItem(\''+id+'\');">移除</a>';
        new Insertion.Before('addItemButton', html);
    },
    "delItem":function(id) {
        $(id).remove();
    },
    "getId":function() {
        var id = 0;
        var content = EditorExtend.getContent();
        var regex = /\[plugin:activity\]([0-9]+)\[\/plugin:activity\]/gi;
        var m = new RegExp(regex).exec(content);

        if (m != null) {
            id = parseInt(m[1]);
        }
        return id;
    },
    "save":function() {
        var form = document.forms['frmpost'];

        var id = this.getId();//投票ID

        var starttime = form.activity_starttime.value;
        var endtime   = form.activity_endtime.value;
        var mark	  = form.activity_mark.value;
        var maxCount  = form.activity_maxCount.value;


        var options = BbsUtil.getValues('frmpost', 'activity_options');

        if (options.length==0) {
            options[0] = form['activity_options'].value;
        }


        if (starttime == "" || starttime == "yyyy-mm-dd") {
            alert("请填写开始时间.");
            form["activity_starttime"].focus();
            return false;
        }

        if (endtime == "" || endtime == "yyyy-mm-dd") {
            alert("请填写结束时间.");
            form["activity_endtime"].focus();
            return false;
        }

        for (var i=0;i<options.length;i++) {
            if (options[i] == '') {
                alert('报名项内容不能空着,需要填些东西.');
                return false;
            }
        }

        if (mark == "") {
            alert("报名花费不能为空.");
            form["activity_mark"].focus();
            return false;
        }
        else if (!mark.isDecimal()) {
            alert("报名花费只能填写数字.");
            form["activity_mark"].focus();
            return false;
        }

        if (maxCount == "") {
            maxCount = 0;
        }
        else if (!maxCount.isDecimal()) {
            alert("人数上限只能填写数字.");
            form["activity_maxCount"].focus();
            return false;
        }


        DWREngine.setAsync(false);
        var flag = false;
        DwrPlugin.saveActivity(global_boardid,global_threadid, id, starttime, endtime, mark, maxCount, options, function(content) {
            if (content != '') {
                //添加操作
                EditorExtend.insert({text:content});
            }
            else {
                //表示更新操作
            }
            flag = true;
        });
        DWREngine.setAsync(true);

        return flag;
    },
    "stop":function() {
    }
}


BbsPostPlugins.credits = {
    "addItem":function() {
        var id = "voteitem"+(new Date().getTime());

        var html = '<li class="activityps0" id="'+id+'"><h5>　</h5><input name="activity_options" type="text" value=""/>';
        html += ' <a href="javascript:BbsPostPlugins.credits.delItem(\''+id+'\');">移除</a>';
        new Insertion.Before('addItemButton', html);
    },
    "delItem":function(id) {
        $(id).remove();
    },
    "getId":function() {
        var id = 0;
        var content = EditorExtend.getContent();
        var regex = /\[plugin:credits\]([0-9]+)\[\/plugin:credits\]/gi;
        var m = new RegExp(regex).exec(content);

        if (m != null) {
            id = parseInt(m[1]);
        }
        return id;
    },
    "save":function() {
        var form = document.forms['frmpost'];

        var id = this.getId();//投票ID

        var starttime = form.activity_starttime.value;
        var endtime   = form.activity_endtime.value;
        var mark	  = form.activity_mark.value;
        var maxCount  = form.activity_maxCount.value;


        var options = BbsUtil.getValues('frmpost', 'activity_options');

        if (options.length==0) {
            options[0] = form['activity_options'].value;
        }


        if (starttime == "" || starttime == "yyyy-mm-dd") {
            alert("请填写开始时间.");
            form["activity_starttime"].focus();
            return false;
        }

        if (endtime == "" || endtime == "yyyy-mm-dd") {
            alert("请填写结束时间.");
            form["activity_endtime"].focus();
            return false;
        }

        for (var i=0;i<options.length;i++) {
            if (options[i] == '') {
                alert('兑换选项内容不能空着,需要填些东西.');
                return false;
            }
        }


        if (mark == "") {
            alert("兑换费用不能为空.");
            form["activity_mark"].focus();
            return false;
        }
        else if (!mark.isDecimal()) {
            alert("兑换费用只能填写数字.");
            form["activity_mark"].focus();
            return false;
        }

        if (maxCount == "") {
            maxCount = 0;
        }
        else if (!maxCount.isDecimal()) {
            alert("兑换数量只能填写数字.");
            form["activity_maxCount"].focus();
            return false;
        }

        DWREngine.setAsync(false);
        var flag = false;
        DwrPlugin.saveCredits(global_boardid,global_threadid, id, starttime, endtime, mark, maxCount, options, function(content) {
            if (content != '') {
                //添加操作
                EditorExtend.insert({text:content});
            }
            else {
                //表示更新操作
            }
            flag = true;
        });
        DWREngine.setAsync(true);

        return flag;
    },
    "stop":function() {
    }
}


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
            if (arg0&& (arg0.constructor == MouseEvent || arg0.constructor == Event||arg0.constructor == KeyboardEvent)) {
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
            //过滤标题
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
    var e = that.getEvent();
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

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */

/*
 * Convert a 32-bit number to a hex string with ls-byte first
 */
var hex_chr = "0123456789abcdef";
function rhex(num)
{
    str = "";
    for(j = 0; j <= 3; j++)
        str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
            hex_chr.charAt((num >> (j * 8)) & 0x0F);
    return str;
}

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str)
{
    nblk = ((str.length + 8) >> 6) + 1;
    blks = new Array(nblk * 16);
    for(i = 0; i < nblk * 16; i++) blks[i] = 0;
    for(i = 0; i < str.length; i++)
        blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
    blks[i >> 2] |= 0x80 << ((i % 4) * 8);
    blks[nblk * 16 - 2] = str.length * 8;
    return blks;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
 * to work around bugs in some JS interpreters.
 */
function add(x, y)
{
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt)
{
    return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t)
{
    return add(rol(add(add(a, q), add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t)
{
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t)
{
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t)
{
    return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t)
{
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Take a string and return the hex representation of its MD5.
 */
function calcMD5(str)
{
    x = str2blks_MD5(str);
    a =  1732584193;
    b = -271733879;
    c = -1732584194;
    d =  271733878;

    for(i = 0; i < x.length; i += 16)
    {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;

        a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
        d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
        c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
        b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
        a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
        d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
        c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
        b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
        a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
        d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
        c = ff(c, d, a, b, x[i+10], 17, -42063);
        b = ff(b, c, d, a, x[i+11], 22, -1990404162);
        a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
        d = ff(d, a, b, c, x[i+13], 12, -40341101);
        c = ff(c, d, a, b, x[i+14], 17, -1502002290);
        b = ff(b, c, d, a, x[i+15], 22,  1236535329);

        a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
        d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
        c = gg(c, d, a, b, x[i+11], 14,  643717713);
        b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
        a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
        d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
        c = gg(c, d, a, b, x[i+15], 14, -660478335);
        b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
        a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
        d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
        c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
        b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
        a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
        d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
        c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
        b = gg(b, c, d, a, x[i+12], 20, -1926607734);

        a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
        d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
        c = hh(c, d, a, b, x[i+11], 16,  1839030562);
        b = hh(b, c, d, a, x[i+14], 23, -35309556);
        a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
        d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
        c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
        b = hh(b, c, d, a, x[i+10], 23, -1094730640);
        a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
        d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
        c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
        b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
        a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
        d = hh(d, a, b, c, x[i+12], 11, -421815835);
        c = hh(c, d, a, b, x[i+15], 16,  530742520);
        b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

        a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
        d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
        c = ii(c, d, a, b, x[i+14], 15, -1416354905);
        b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
        a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
        d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
        c = ii(c, d, a, b, x[i+10], 15, -1051523);
        b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
        a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
        d = ii(d, a, b, c, x[i+15], 10, -30611744);
        c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
        b = ii(b, c, d, a, x[i+13], 21,  1309151649);
        a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
        d = ii(d, a, b, c, x[i+11], 10, -1120210379);
        c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
        b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

        a = add(a, olda);
        b = add(b, oldb);
        c = add(c, oldc);
        d = add(d, oldd);
    }
    return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}
 



