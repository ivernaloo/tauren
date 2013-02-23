(function(window, undefined) {
    var globalName = "NTES";
    jRaiser = window[globalName];
    jRaiser.util.extend(jRaiser.ui.Slide.prototype, {
        lazy : function() {
            var t = this;
            var _lazy = function( e ,index ){
                var t = this ,
                    url = t._contents[ index ].getAttribute("data-url") || null ,
                    con = t._contents[ index ] ,
                    isRequest = con.getAttribute("data-request");

                e.preventDefault();

                if( !url || !index || isRequest) return
                jRaiser.ajax.send(
                    url,
                    "post",
                    {},
                    {
                        onSuccess : function(xhr){
                            con.innerHTML = xhr.responseText;
                            con.setAttribute( "data-request" , "true")
                        },
                        onerror : function(){
                            throw "ajax loading error"
                        }
                    }
                )
            }.bind(t);

            for(var i = 0 ; i < t.total ; i++){
                if( !t._contents[i].getAttribute("data-url") ) continue
                jRaiser.event.addEvent(t._ctrls[i], t._eventName, _lazy, i);
            }

        }
    })
})(window);