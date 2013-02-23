var BbsBoardAdmin = {
	"init":""
	,"load":function() {
      if(this.getMode() == "admin"){
          this.showCheckBox();
          return;
      }
	}

	,"getList":function() {
			var allList = $("articleRows").getElementsByTagName("input");
			if ( allList == null || typeof(allList)=="undefined" || allList.length ==0) {
				  return null;
			}
			else {
          var elements = [];
          for (var i=0; i<allList.length; i++) {
              if (allList[i].type == "checkbox" && allList[i].className=="admin") {
                  elements.push(Element.extend(allList[i]));
              }
          }
          if (elements.length ==0) {
              return null;
          }
				  return elements;
			}
	}
	/*
	*判断是否为版主,显示上方的操作按钮
	*/
	,"checkMaster":function(){
		if(!BbsCookie.isLogined()){
            Bbs.showLoginDialog(function(){
                BbsBoardAdmin.checkMaster()
            });
            return;
        }
		//正常模式什么也不做
		if(this.getMode() == "user"){
        this.showCheckBox();
			  return ;
		}
		//先本机判断
		else if(this.getMode() == "admin"){
        this.hideCheckBox();
        return;
    }
    else {
        if (this.isMaster()) {
            this.showCheckBox();                        
        }
        else {
            alert("您“"+BbsCookie.getPassport()+"”不是版面“"+global_boardid+"”的版主，不能使用管理模式.");
            return;
        }
		}
		//登录没有set cookie的情况，服务器判断
		
	}
  /**
   * 是否版主判断.
   */
  ,"isMaster":function() {
      var flag = false;
      DWREngine.setAsync(false);
      DwrBoardAdmin.isBoardAdmin(global_boardid, function(data){
          flag = data;
			});
      DWREngine.setAsync(true);
      return flag;
  }
	/*
	*设置模式 value=true/false
	*/
	,"setMode":function(flag){
      var value = "y";
      if (!flag ){
          value = "n";
      }
		  BbsCookie.setCookie("admin_mode",value,0);
	}
	/*
	*获取模式
	*/
	,"getMode":function(){
		  var mode = BbsCookie.getCookie("admin_mode");
      if (mode == "y") {
          return "admin";
      }
      else if (mode == "n") {
          return "normal";
      }
      else {
          return "";
      }
	}
  /**
   * 删除cookie
   */
  ,"delCookie":function() {
      BbsCookie.setCookie("admin_mode", "" ,0);
  }

	/*
	*设置换页时是否显示选择框  value=y/n
	*/
  /*
	,"setShow":function(value){
		BbsCookie.setCookie("show_mode",value,0);
	}
  */
	/*
	*获取是否显示选择框
	*/
  /*
	,"getShow":function(){
		return BbsCookie.getCookie("show_mode");
	}
  */
	/*
	*显示选择框
	*/
	,"showCheckBox":function(){
			var allList = this.getList();
			if (allList != null) {
				for(var i=0;i < allList.length;i++){
					allList[i].style.display = "";
				}
			}
			var boardAdmin = $("boardadmin");
			boardAdmin.style.display="";
			boardAdmin.innerHTML="正常模式";
			boardAdmin.href="javascript:BbsBoardAdmin.hideCheckBox()";
			this.showAdminButton();
			
	}
	/*
	*隐藏选择框
	*/
	,"hideCheckBox":function(){
			var allList = this.getList();
			if(allList != null){
				for(var i=0;i < allList.length ;i++){
					allList[i].style.display = "none";
				}
			}
			var boardAdmin = $("boardadmin");
			boardAdmin.style.display="";
			boardAdmin.innerHTML="批量删除";
			boardAdmin.href="javascript:BbsBoardAdmin.showCheckBox()";
			this.hideAdminButton();
	}
	/*
	*显示操作按钮
	*/
	,"showAdminButton":function(){
      var adminButton = document.getElementById("adminButton");
      var adminButton_top = document.getElementById("adminButton_top");

      var html = '<div style="text-align:left">';
      html +=	  '<input  type="button" onclick="javascript:BbsBoardAdmin.delArticles();" value="删除"/>';
      html +=   '<input type="button" onclick="javascript:BbsBoardAdmin.selectAll();" value="全选" />';
      html +=   '<input type="button" onclick="javascript:BbsBoardAdmin.reverse();" value="反向选择" />';
      html +=   '</div>';
      adminButton.innerHTML         = html;
      adminButton_top.innerHTML     = html;
      adminButton.style.display     = "";
      adminButton_top.style.display = "";

      this.setMode(true);
	}
	/*
	*隐藏操作按钮
	*/
	,"hideAdminButton":function(){
      var adminButton = document.getElementById("adminButton");
      var adminButton_top = document.getElementById("adminButton_top");
      adminButton.style.display     = "none";
      adminButton_top.style.display = "none";
      this.setMode(false);
	}

	/*
	*全部选择
	*/
	,"selectAll":function(){
			var articleList = this.getList();
			for(var i =0;i < articleList.length ;i++){
				articleList[i].checked=true;
			}
	}
	/*
	*反向选择
	*/
	,"reverse":function(){
			var articleList = this.getList();
			for(var i =0;i < articleList.length ;i++){
				articleList[i].checked = !articleList[i].checked;
			}
	}

	/*
	*删除所选
	*/
	,"delArticles":function(){
			//确认
			if(!window.confirm("是否确认删除")){
				return false;
			}
			//得到要删除的列表
			var delList =  new Array();						//要删除的文章
			var allList = this.getList();
			
			if(allList == null  ){
					alert("当前列表没有帖子");
					return;
			}
			var j = 0;
			for(var i = 0; i < allList.length;i++){
				if(allList[i].className=="admin" && allList[i].checked){
					delList[j] = allList[i].value;
					j++;
				}
			}

			if  (delList == null || delList.length==0) {
					alert("您没有选中要删除的帖子.");
					return;
			}

			//删除文章
			DwrBoardAdmin.delArticle(delList,function(data){
			//回调函数，隐藏删除的文章
					var allList = BbsBoardAdmin.getList();			//拿到所有文章的列表
					var articleids = data.split(", ");

					for(var i = 0; i < articleids.length; i++){
						if(articleids[i] != null && articleids[i].length > 0){
							BbsBoardAdmin.displayArticle(allList, articleids[i]);
						}
					}


          allList = BbsBoardAdmin.getList();
          if (allList == null) {
              window.location.reload();
          }
				});
		}
		/*
		*隐藏删除项
		*/
		,"displayArticle":function(list,articleid){
        for(var i=0;i<list.length;i++){
            if	(list[i].value.indexOf("/"+articleid) > 0){
                var row = list[i].parentNode.parentNode;
                try {
                    row.style.display = "none";
                    row.outerHTML = "";
                }
                catch(e) {
                    row.innerHTML = "";
                }
            }	
        }
		}



}