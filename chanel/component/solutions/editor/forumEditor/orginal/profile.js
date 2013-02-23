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