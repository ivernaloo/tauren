
/**
 * ����ַ����Ƿ�ΪС��.
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
	
		var html = '<li class="activityps0" id="'+id+'"><h5>��</h5><input name="activity_options" type="text" value=""/>';
		html += ' <a href="javascript:BbsPostPlugins.activity.delItem(\''+id+'\');">�Ƴ�</a>';
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
				alert('���������ݲ��ܿ���,��Ҫ��Щ����.');
				return false;
			}
		}
		
		if (mark == "") {
			alert("�������Ѳ���Ϊ��.");
			form["activity_mark"].focus();
			return false;
		}
		else if (!mark.isDecimal()) {
	        alert("��������ֻ����д����.");
	        form["activity_mark"].focus();
	        return false;
	    }
	    
	    if (maxCount == "") {
			maxCount = 0;
		}
		else if (!maxCount.isDecimal()) {
	        alert("��������ֻ����д����.");
	        form["activity_maxCount"].focus();
	        return false;
	    }
	
	
		DWREngine.setAsync(false);
		var flag = false;
		  DwrPlugin.saveActivity(global_boardid,global_threadid, id, starttime, endtime, mark, maxCount, options, function(content) {
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

