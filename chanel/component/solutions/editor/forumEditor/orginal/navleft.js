var BbsLeft = {
	"init":""
	,"prevNodeid":null //��һ����ʾ��nodeid
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
			north : "|������|�����|�ӱ�ʡ|ɽ��ʡ|���ɹ�|����ʡ|����ʡ|������ʡ|ɽ��ʡ|����ʡ|����ʡ|",
			east : "|�Ϻ���|����ʡ|�㽭ʡ|����ʡ|����ʡ|",
		    sichuan : "|�Ĵ�ʡ|",
			shenzhen : "|������|",
			south : "|�㶫ʡ|",
		    hainan : "|����ʡ|",
		    foshan : "|��ɽ��|",
			others : "|������|"
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
				obj.innerHTML = '<img src="http://img1.cache.netease.com/bbs/img11/bbs0621/icon01.gif" width="9" height="9" alt="��" />';
				$(obj).removeClassName("unfold");
			}else{
				nextObj.style.display = "block";
				obj.innerHTML = '<img src="http://img1.cache.netease.com/bbs/img11/bbs0621/icon02.gif" width="9" height="9" alt="�ر�" />';
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
		obj.innerHTML = "<span>��ȡ��...</span>";
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
	 * ��ʾ����������
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
				alert("������ؼ���.");
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
			alert("������ؼ���.");
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
	   * �����ҵ��ղ�
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
	                alert("�������.");
	            }
	        }});
	  }
}
