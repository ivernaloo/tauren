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
	*�ж��Ƿ�Ϊ����,��ʾ�Ϸ��Ĳ�����ť
	*/
	,"checkMaster":function(){
		if(!BbsCookie.isLogined()){
            Bbs.showLoginDialog(function(){
                BbsBoardAdmin.checkMaster()
            });
            return;
        }
		//����ģʽʲôҲ����
		if(this.getMode() == "user"){
        this.showCheckBox();
			  return ;
		}
		//�ȱ����ж�
		else if(this.getMode() == "admin"){
        this.hideCheckBox();
        return;
    }
    else {
        if (this.isMaster()) {
            this.showCheckBox();                        
        }
        else {
            alert("����"+BbsCookie.getPassport()+"�����ǰ��桰"+global_boardid+"���İ���������ʹ�ù���ģʽ.");
            return;
        }
		}
		//��¼û��set cookie��������������ж�
		
	}
  /**
   * �Ƿ�����ж�.
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
	*����ģʽ value=true/false
	*/
	,"setMode":function(flag){
      var value = "y";
      if (!flag ){
          value = "n";
      }
		  BbsCookie.setCookie("admin_mode",value,0);
	}
	/*
	*��ȡģʽ
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
   * ɾ��cookie
   */
  ,"delCookie":function() {
      BbsCookie.setCookie("admin_mode", "" ,0);
  }

	/*
	*���û�ҳʱ�Ƿ���ʾѡ���  value=y/n
	*/
  /*
	,"setShow":function(value){
		BbsCookie.setCookie("show_mode",value,0);
	}
  */
	/*
	*��ȡ�Ƿ���ʾѡ���
	*/
  /*
	,"getShow":function(){
		return BbsCookie.getCookie("show_mode");
	}
  */
	/*
	*��ʾѡ���
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
			boardAdmin.innerHTML="����ģʽ";
			boardAdmin.href="javascript:BbsBoardAdmin.hideCheckBox()";
			this.showAdminButton();
			
	}
	/*
	*����ѡ���
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
			boardAdmin.innerHTML="����ɾ��";
			boardAdmin.href="javascript:BbsBoardAdmin.showCheckBox()";
			this.hideAdminButton();
	}
	/*
	*��ʾ������ť
	*/
	,"showAdminButton":function(){
      var adminButton = document.getElementById("adminButton");
      var adminButton_top = document.getElementById("adminButton_top");

      var html = '<div style="text-align:left">';
      html +=	  '<input  type="button" onclick="javascript:BbsBoardAdmin.delArticles();" value="ɾ��"/>';
      html +=   '<input type="button" onclick="javascript:BbsBoardAdmin.selectAll();" value="ȫѡ" />';
      html +=   '<input type="button" onclick="javascript:BbsBoardAdmin.reverse();" value="����ѡ��" />';
      html +=   '</div>';
      adminButton.innerHTML         = html;
      adminButton_top.innerHTML     = html;
      adminButton.style.display     = "";
      adminButton_top.style.display = "";

      this.setMode(true);
	}
	/*
	*���ز�����ť
	*/
	,"hideAdminButton":function(){
      var adminButton = document.getElementById("adminButton");
      var adminButton_top = document.getElementById("adminButton_top");
      adminButton.style.display     = "none";
      adminButton_top.style.display = "none";
      this.setMode(false);
	}

	/*
	*ȫ��ѡ��
	*/
	,"selectAll":function(){
			var articleList = this.getList();
			for(var i =0;i < articleList.length ;i++){
				articleList[i].checked=true;
			}
	}
	/*
	*����ѡ��
	*/
	,"reverse":function(){
			var articleList = this.getList();
			for(var i =0;i < articleList.length ;i++){
				articleList[i].checked = !articleList[i].checked;
			}
	}

	/*
	*ɾ����ѡ
	*/
	,"delArticles":function(){
			//ȷ��
			if(!window.confirm("�Ƿ�ȷ��ɾ��")){
				return false;
			}
			//�õ�Ҫɾ�����б�
			var delList =  new Array();						//Ҫɾ��������
			var allList = this.getList();
			
			if(allList == null  ){
					alert("��ǰ�б�û������");
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
					alert("��û��ѡ��Ҫɾ��������.");
					return;
			}

			//ɾ������
			DwrBoardAdmin.delArticle(delList,function(data){
			//�ص�����������ɾ��������
					var allList = BbsBoardAdmin.getList();			//�õ��������µ��б�
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
		*����ɾ����
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