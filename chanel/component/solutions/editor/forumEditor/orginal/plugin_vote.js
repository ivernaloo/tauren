BbsPostPlugins.vote = {
	"addItem":function() {
		var id = "voteitem"+(new Date().getTime());
		var html = '<li class="voteitem0" id="'+id+'"><input name="vote_options" type="text" value=""/>';
		html += ' <a href="javascript:BbsPostPlugins.vote.delItem(\''+id+'\');">移除</a>';
		new Insertion.Before('addItemButton', html);
	},
	"delItem":function(id) {
		$(id).remove();
	},
	"getId":function() {
		var id = 0;
	    var content = EditorExtend.getContent();
	    var regex = /\[plugin:vote\]([0-9]+)\[\/plugin:vote\]/gi;
	    var m = new RegExp(regex).exec(content);
	
	    if (m != null) {
	        id = parseInt(m[1]);
	    }
	    return id;
	},
	"save":function() {
		var form = document.forms['frmpost'];
	
		var id = this.getId();//投票ID
		var types = BbsUtil.getRadioValue('frmpost', 'vote_types');
		if(types==null||types == "undefined"){
			return true;
		}
		
		if(form.vote_endtime==null||form.vote_endtime == "undefined"){
			return true;
		}
		var endtime = form.vote_endtime.value;
		var options = BbsUtil.getValues('frmpost', 'vote_options');
	
	
		if (1==1) {
			//验证选项是否按照顺序填写
			var lastid = -1;
			for (var i=options.length-1;i>=0;i--) {
			  if (options[i] != '') {
				  lastid = i;
				  break;
			  }
			}
	
			if (lastid == -1) {
				alert('选项列表不能空着,需要填些东西.');
				return false;
			}
	
			for (var i=0;i<=lastid;i++) {
				if (options[i]=='') {
					alert('您没有按照顺序填写.');
					return false;
				}
			}
		}
	
		DWREngine.setAsync(false);
		var flag = false;
		  Dwr.updateVote(global_boardid,global_threadid, id, types, endtime, false, options, function(content) {
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

