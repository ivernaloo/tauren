
var BbsLeft = {

	"init":function() {
      var channel = Bbs.getChannel();

      var channelid = channel;
      
      var callback = null;
      //if(channel == "bj"){
          //������̳
         // channelid = "local";
         // callback = function() {
             // BbsLeft.showDiv("local1217");
          //}
      //}
      if(channel == "news"){
          //���ŵط���̳
          if (global_boardid.indexOf("local")==0) {
              channelid = "local";
          }
          
      }
	  if(channel == "2010"){
          //���ŵط���̳
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
          
		  if (pageChannel != "dream") {//�λ�������̳���ƶ�		  
			  if($(channelid).style.display == "none"&& $("out_"+channelid).previous().readAttribute("tindex") != 2){
				  this.move(channelid);
			  }
		  }
            
          var channel = $(channelid);//Ƶ������DIV
			    var _channel = $("ch_"+channelid);//Ƶ����ʾh3
          
			    if(channel == null && typeof(channel) == "undefined"){//�˵������
				      return;
			    }
			    if(channel.style.display == "block"){//�˵�����
				      channel.style.display = "none";
				      _channel.className = "";
			    }
          else if(channel.style.display == "none" && channel.innerHTML !=""){//����Ѽ��س���,�˵�ֱ����ʾ
              channel.style.display = "block";
				      _channel.className = "active";
			    }
			    else{//δ���س���,���ز˵����ʾ
             var url = "/htmlfile/left/" + channelid +"_child.htm";
             channel.style.display = "block";
             channel.innerHTML = "<h4>���ݼ�����...</h4>";
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
            var channel = $("out_"+channelid);//�˵�outerHTML
            var tindex = channel.readAttribute("tindex");//��ǰ�˵���ı�־λ
            var channelHTML = '<div class="tselector" tindex="'+tindex+'" id="out_'+channelid+'">'+channel.innerHTML+'</div>';
            //$(content).value = channelHTML;
            var target_channel = $("out_myset");
            if(tindex <= 2) return;
            if(tindex > 2){//�˵�����λ
                var next_channel = target_channel.next();//Ŀ��λ����һ��Ԫ��
                for(var i = 0; i < next_channel.childNodes.length; i++){//����Ԫ��
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
                if(next_channel_tindex != 3){//Ŀ��λ���Ƿ�����λ��
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
            //alert(nodeid+"������.");
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
   * ��ʾ�������ҵ��ղ�
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
   * �����ҵ��ղ�
   */
  ,"loadMyFavorite":function() {
        var url = "/bbs/my_favorite.inc.jsp";
        new Ajax.Request(url,{onComplete:function(data){
            var content = (data.responseText);
            if (data.status==200) {
                $("myCollection").innerHTML = content;
            }
            else {
                alert("�������.");
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

