/**
 * JS�ļ��汾���
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
     *  �Զ������µ�JS�ļ�������ҪҪ�û��ֶ�ˢ��
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
     * ����������ظ�ʱ��
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