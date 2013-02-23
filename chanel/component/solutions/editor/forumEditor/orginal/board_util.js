/**
 * 版面信息相关JS
 */
var BoardUtil = {
    "init":""

    /**
     * 加载版面列表
     */ 
    ,"objId":"selectBoardid"
    ,"dbname":""

    ,"loadBoardList":function(dbname, pid, selectDefault) {
        this.dbname = dbname;

        Dwr.loadBoardList(dbname, '', function(data) {
            DWRUtil.removeAllOptions(BoardUtil.objId);
            //DWRUtil.addOptions('selectBoardid', data);

            var ele = $(BoardUtil.objId);
            for (var boardid in data) {
                var info = data[boardid];

                var hasChild = info['hasChild'];
                var name = info['name'];

                var option = new Option(name, boardid);
                option.hasChild = hasChild;


                ele.options[ele.options.length] = option;
            }
            if (selectDefault) {
                BoardUtil.selectDefault();
            }
        });
    }

    ,"hasChild":function(selectedIndex) {
        var ele = $(BoardUtil.objId);
        var option = ele.options[selectedIndex];
        var hasChild = option.hasChild;
        return (hasChild == 'true');
    }

    ,"selectDefault":function() {
        var ele = $(BoardUtil.objId);
        var boardid = "";
        if (ele.options.length > 0) {
            boardid = ele.options[0].value;
            this.changeBoard(boardid, 0);
        }
        $('destBoardid').value = boardid;
    }

    ,"changeBoard":function(boardid, selectedIndex ) {
        $('destBoardid').value = boardid;

        var childId = BoardUtil.objId+"Child";
        var hasChild = BoardUtil.hasChild(selectedIndex);
        if (hasChild) {
            if (this.dbname == "") {
                this.dbname = $('destDbname').value;
            }
            Dwr.loadBoardList(this.dbname, boardid, function(data) {
                DWRUtil.removeAllOptions(childId);

                var ele = $(childId);
                var option = new Option("默认", boardid);
                option.hasChild = hasChild;
                ele.options[ele.options.length] = option;

                DWRUtil.addOptions(childId, data, "boardid", "name");
            });



            $(childId).style.display = '';
        }
        else {
            $(childId).style.display = 'none';
        }
    }
}