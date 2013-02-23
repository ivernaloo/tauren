/**
 * ���������
 */
var ChangeSelect = {
    "init":""
    /**
     * ��������������.
     *
     * @param select ���������
     * @param url    ��ַ
     * @param defvalue Ĭ��ѡ�����ֵ
     * @param firstOption �������һ���ѡ
     */
    ,"load":function(select, url, defvalue, firstOption) {
      //ʹ��GET��ʽ���л������⣬����Ҫʹ��POST
      new Ajax.Request(url, {method: 'GET', onComplete:function(data){
          var xml = data.responseXML;
          if (xml == null) {
              return;
          }
          var nodes = xml.getElementsByTagName("row");

          DWRUtil.removeAllOptions(select);

          var hasFirst = firstOption!=null && typeof(firstOption) != "undefined";
          if (hasFirst) {
              try {
                  select.add(firstOption);	
              }
              catch (e) {
                  select.appendChild(firstOption);	
              }
          }

          var selectedIndex = 0;
	        //document.title = document.title + selectedIndex;
          for (i=0;i<nodes.length; i++) {
              var node = nodes[i];
              
              var id   = MyXml.getValue(node, "id");
              var name  = MyXml.getValue(node, "name");
              try {
                  select.add(new Option(name, id));
              }
              catch (e) {
                  select.appendChild(new Option(name, id));
              }
              if (defvalue == id) {
                  if (hasFirst) {
                      selectedIndex = i+1;
                  }
                  else {
                      selectedIndex = i;
                  } 
              }
          }
          select.selectedIndex = selectedIndex;
      }});
    }
}

