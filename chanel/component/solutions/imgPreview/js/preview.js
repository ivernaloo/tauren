/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-11-8
 * Time: 下午4:48
 * To change this template use File | Settings | File Templates.
 */
(function(){
    var _con = $("ul.photoList"),
        _lists = $("img.js-preview-img",_con);

    /* execute the logic */
    _con.delegate("li","hover",this,previewImg);

    /* handle the image slide */
    function previewImg(elem){

        /* get the manipulate target */
        var _target = elem.target,
            _con = $(_target).parents("li");
        if(!_target.nodeName == "IMG") { return; }
            /* con and target */
            console.info("_target : ",_target);
            console.info("_con : ",_con);

        /* get relative position */

        /* reset the image position */
    }



})()
