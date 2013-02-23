var BbsList = {
    "init":function(){
        //if(!BbsCookie.isLogined()){
        //    BbsBoardAdmin.setMode(false);
        //}
        //BbsUtil.showLoginInfo();
        Userinfo.loadUserinfo();
    }

    ,"toggle":function(objId){
        obj=document.getElementById(objId);
        obj.style.display=(obj.style.display=="")?"none":"";
    }

    ,"changeIframe":function(){
        BbsList.toggle("leftBar");
        var imgObj=document.getElementById("changeImg");
        var main=document.getElementById("mainArea");
        imgObj.src=(imgObj.src.indexOf("left")!=-1)?imgObj.src.replace('left','right'):imgObj.src.replace('right','left');
        main.style.marginLeft=(main.style.marginLeft=='0px')?"145px":"0px";

    }

    ,"onTabChange":function(hrefpre,divpre,idx,maxidx)
    {
        var i=1;
        while(i<=maxidx)
        {
            if (i!=idx)
            {
                href_obj = document.getElementById(hrefpre + i);
                if (href_obj != null){
                    href_obj.className = "";
                }
                div_obj = document.getElementById(divpre + i);
                if (div_obj != null){
                    div_obj.style.display = "none";
                }
            }
            i = i + 1;
        }
        href_obj = document.getElementById(hrefpre+idx);
        if ( href_obj != null ){
            href_obj.className = "active";
        }
        div_obj = document.getElementById(divpre + idx);
        if (div_obj != null){
            div_obj.style.display = "block";
        }
    }
}