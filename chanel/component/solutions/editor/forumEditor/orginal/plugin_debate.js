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
	
		var id = this.getId();//ͶƱID
		
		var good = form.debate_good.value;
		var bad  = form.debate_bad.value;
	
	
		if (good=="") {
			alert("�����۵㲻��Ϊ��.");
			form.debate_good.focus();
			return false;
		}
	
		if (bad=="") {
			alert("�����۵㲻��Ϊ��.");
			form.debate_bad.focus();
			return false;
		}
	
		DWREngine.setAsync(false);
		var flag = false;
		  DwrPlugin.saveDebate(global_boardid, global_threadid,id, good, bad, function(content) {
				  if (content != '') {
					  //��Ӳ���
					  //Editor.insertContent(content);
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

