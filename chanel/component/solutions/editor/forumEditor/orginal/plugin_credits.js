BbsPostPlugins.credits = {
	"addItem":function() {
		var id = "voteitem"+(new Date().getTime());
	
		var html = '<li class="activityps0" id="'+id+'"><h5>��</h5><input name="activity_options" type="text" value=""/>';
		html += ' <a href="javascript:BbsPostPlugins.credits.delItem(\''+id+'\');">�Ƴ�</a>';
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
	
		var id = this.getId();//ͶƱID
		
		var starttime = form.activity_starttime.value;
		var endtime   = form.activity_endtime.value;
		var mark	  = form.activity_mark.value;
		var maxCount  = form.activity_maxCount.value;
	
	
		var options = BbsUtil.getValues('frmpost', 'activity_options');
	
		if (options.length==0) {
			options[0] = form['activity_options'].value;
		}
	
	
		if (starttime == "" || starttime == "yyyy-mm-dd") {
			alert("����д��ʼʱ��.");
			form["activity_starttime"].focus();
			return false;
		}
	
		if (endtime == "" || endtime == "yyyy-mm-dd") {
			alert("����д����ʱ��.");
			form["activity_endtime"].focus();
			return false;
		}
		
		for (var i=0;i<options.length;i++) {
			if (options[i] == '') {
				alert('�һ�ѡ�����ݲ��ܿ���,��Ҫ��Щ����.');
				return false;
			 }
		}
	
	
		if (mark == "") {
			alert("�һ����ò���Ϊ��.");
			form["activity_mark"].focus();
			return false;
		}
		else if (!mark.isDecimal()) {
	        alert("�һ�����ֻ����д����.");
	        form["activity_mark"].focus();
	        return false;
	    }
	    
	    if (maxCount == "") {
			maxCount = 0;
		}
		else if (!maxCount.isDecimal()) {
	        alert("�һ�����ֻ����д����.");
	        form["activity_maxCount"].focus();
	        return false;
	    }
	
		DWREngine.setAsync(false);
		var flag = false;
		  DwrPlugin.saveCredits(global_boardid,global_threadid, id, starttime, endtime, mark, maxCount, options, function(content) {
				  if (content != '') {
					  //��Ӳ���
					  EditorExtend.insert({text:content});
				  }
				  else {
					  //��ʾ���²���
				  }
				  flag = true;
			});
		DWREngine.setAsync(true);
	
			return flag;
	},
	"stop":function() {
	}
}

