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

                var oEvent = obj.getEvent();

                console.info("hot key obj :",obj);
                console.info("hot key event :",obj.getEvent());
                if (!oEvent) {
                    return;
                }
                /* todo the hot key for fast publish*/
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
