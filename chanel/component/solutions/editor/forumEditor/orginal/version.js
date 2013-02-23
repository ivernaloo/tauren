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