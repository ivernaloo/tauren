BbsPostPlugins.ask = {
	"save":function() {
		var form = document.forms['frmpost'];
		form["icon"].value = 90;
		//alert(form["icon"].value);
		return true;
	},
	"stop":function() {
	}
}

