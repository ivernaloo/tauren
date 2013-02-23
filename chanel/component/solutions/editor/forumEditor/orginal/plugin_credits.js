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

