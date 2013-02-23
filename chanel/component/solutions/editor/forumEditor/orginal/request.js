var Request = {
  "init":""

  ,"getParameter":function(name) {
      var url = document.location.href;
      var start = url.indexOf("?")+1;
      if (start==0) {
        return "";
      }
      var value = "";
      var queryString = url.substring(start);
      var paraNames = queryString.split("&");
      for (var i=0; i<paraNames.length; i++) {
        if (name == this.getParameterName(paraNames[i])) {
          value = this.getParameterValue(paraNames[i])
        }
      }
      return value;
  }
  ,"getParameterName":function(str) {
      var start = str.indexOf("=");
      if (start==-1) {
        return str;
      }
      return str.substring(0,start);
  }

  ,"getParameterValue":function(str) {
      var start = str.indexOf("=");
      if (start==-1) {
        return "";
      }
      return str.substring(start+1);
  }
}