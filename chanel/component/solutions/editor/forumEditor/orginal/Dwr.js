
// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (Dwr == null) var Dwr = {};
Dwr._path = '/bbs/dwr';
Dwr.main = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'main', p0, callback);
}
Dwr.test = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'test', p0, false, callback);
}
Dwr.getNickname = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getNickname', p0, callback);
}
Dwr.updateNickname = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'updateNickname', p0, p1, false, callback);
}
Dwr.getUsername = function(callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getUsername', false, false, callback);
}
Dwr.addUserSign = function(callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'addUserSign', false, callback);
}
Dwr.addMyFavorite = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'addMyFavorite', p0, false, callback);
}
Dwr.getRandomPoints = function(callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getRandomPoints', callback);
}
Dwr.topThread = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'topThread', p0, p1, false, callback);
}
Dwr.allTopThread = function(p0, p1, p2, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'allTopThread', p0, p1, p2, false, callback);
}
Dwr.eliteThread = function(p0, p1, p2, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'eliteThread', p0, p1, p2, false, callback);
}
Dwr.pushThread = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'pushThread', p0, p1, p2, p3, false, callback);
}
Dwr.copyThread = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'copyThread', p0, p1, p2, p3, false, callback);
}
Dwr.lockThread = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'lockThread', p0, p1, false, callback);
}
Dwr.downThread = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'downThread', p0, p1, false, callback);
}
Dwr.delPost = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'delPost', p0, p1, false, callback);
}
Dwr.addBlackList = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'addBlackList', p0, p1, p2, p3, false, callback);
}
Dwr.blackUser = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'blackUser', p0, p1, p2, p3, false, callback);
}
Dwr.delBlackUser = function(p0, p1, p2, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'delBlackUser', p0, p1, p2, false, callback);
}
Dwr.addArticleLimit = function(p0, p1, p2, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'addArticleLimit', p0, p1, p2, false, callback);
}
Dwr.deleteArticleLimit = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'deleteArticleLimit', p0, p1, false, callback);
}
Dwr.checkcode = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'checkcode', p0, false, callback);
}
Dwr.getBoardName = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getBoardName', p0, false, callback);
}
Dwr.nodes = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'nodes', p0, p1, callback);
}
Dwr.clickStat = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'clickStat', p0, false, callback);
}
Dwr.rubbishThread = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'rubbishThread', p0, p1, false, callback);
}
Dwr.setAdminCommentTypes = function(p0, p1, p2, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'setAdminCommentTypes', p0, p1, p2, false, callback);
}
Dwr.delBbsBlackList = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'delBbsBlackList', p0, p1, false, callback);
}
Dwr.addBread = function(p0, p1, p2, p3, p4, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'addBread', p0, p1, p2, p3, p4, false, callback);
}
Dwr.addIpLimit = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'addIpLimit', p0, p1, p2, p3, false, callback);
}
Dwr.canUploadImages = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'canUploadImages', p0, false, callback);
}
Dwr.isRepliedThread = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'isRepliedThread', p0, p1, false, callback);
}
Dwr.reportPost = function(p0, p1, p2, p3, p4, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'reportPost', p0, p1, p2, p3, p4, false, callback);
}
Dwr.delMessage = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'delMessage', p0, false, callback);
}
Dwr.delMessages = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'delMessages', p0, false, callback);
}
Dwr.delSentMessage = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'delSentMessage', p0, false, callback);
}
Dwr.delSentMessages = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'delSentMessages', p0, false, callback);
}
Dwr.delBlackList = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'delBlackList', p0, false, callback);
}
Dwr.sendMessage = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'sendMessage', p0, p1, false, callback);
}
Dwr.addMyBlackList = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'addMyBlackList', p0, p1, false, callback);
}
Dwr.getQuoteReply = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getQuoteReply', p0, p1, callback);
}
Dwr.sayGood = function(p0, p1, p2, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'sayGood', p0, p1, p2, false, callback);
}
Dwr.sayBad = function(p0, p1, p2, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'sayBad', p0, p1, p2, false, callback);
}
Dwr.editReply = function(p0, p1, p2, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'editReply', p0, p1, p2, false, callback);
}
Dwr.updateVote = function(p0, p1, p2, p3, p4, p5, p6, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'updateVote', p0, p1, p2, p3, p4, p5, p6, false, callback);
}
Dwr.activityApplyCheck = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'activityApplyCheck', p0, false, callback);
}
Dwr.activityApply = function(p0, p1, p2, p3, p4, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'activityApply', p0, p1, p2, p3, p4, false, callback);
}
Dwr.creditsApplyCheck = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'creditsApplyCheck', p0, false, callback);
}
Dwr.creditsApply = function(p0, p1, p2, p3, p4, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'creditsApply', p0, p1, p2, p3, p4, false, callback);
}
Dwr.getChannelMark = function(callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getChannelMark', false, callback);
}
Dwr.debateVote = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'debateVote', p0, p1, p2, p3, false, callback);
}
Dwr.debateApply = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'debateApply', p0, p1, p2, p3, false, callback);
}
Dwr.vote = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'vote', p0, p1, p2, p3, false, callback);
}
Dwr.getBoardNames = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getBoardNames', p0, false, callback);
}
Dwr.loadBoardList = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'loadBoardList', p0, p1, false, callback);
}
Dwr.loadBoardListByKeyword = function(p0, p1, p2, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'loadBoardListByKeyword', p0, p1, p2, false, callback);
}
Dwr.getChildBoards = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getChildBoards', p0, false, callback);
}
Dwr.getChildBoardsByDbname = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getChildBoardsByDbname', p0, p1, false, callback);
}
Dwr.updateUserinfo = function(p0, p1, p2, p3, p4, p5, p6, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'updateUserinfo', p0, p1, p2, p3, p4, p5, p6, false, callback);
}
Dwr.isWantVerify = function(p0, p1, p2, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'isWantVerify', p0, p1, p2, false, callback);
}
Dwr.isWantVerifyBackup = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'isWantVerifyBackup', p0, p1, false, callback);
}
Dwr.getAutoHeader = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getAutoHeader', p0, false, callback);
}
Dwr.delIpLimit = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'delIpLimit', p0, p1, false, callback);
}
Dwr.getReplyBody = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getReplyBody', p0, p1, callback);
}
Dwr.deleteMyFavorite = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'deleteMyFavorite', p0, false, callback);
}
Dwr.addMyFavorite_Yiba = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'addMyFavorite_Yiba', p0, false, callback);
}
Dwr.deleteMyFavorite_Yiba = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'deleteMyFavorite_Yiba', p0, false, callback);
}
Dwr.getOnlineStatus = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getOnlineStatus', p0, false, callback);
}
Dwr.copyToBlog = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'copyToBlog', p0, p1, false, callback);
}
Dwr.setAskGoodAnswer = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'setAskGoodAnswer', p0, p1, false, callback);
}
Dwr.setAskPushAnswer = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'setAskPushAnswer', p0, p1, false, callback);
}
Dwr.getBoardUrlByBoardid = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getBoardUrlByBoardid', p0, p1, false, callback);
}
Dwr.getCityByProvince = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getCityByProvince', p0, callback);
}
Dwr.addGuide = function(p0, p1, p2, p3, p4, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'addGuide', p0, p1, p2, p3, p4, false, callback);
}
Dwr.deleteGuide = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'deleteGuide', p0, p1, false, callback);
}
Dwr.isLimitThread = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'isLimitThread', p0, p1, false, callback);
}
Dwr.hasForfendKeyword = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'hasForfendKeyword', p0, p1, p2, p3, false, callback);
}
Dwr.hasSubtleKeyword = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'hasSubtleKeyword', p0, p1, p2, p3, false, callback);
}
Dwr.addApplyMaster = function(p0, p1, p2, p3, p4, p5, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'addApplyMaster', p0, p1, p2, p3, p4, p5, false, callback);
}
Dwr.copyUrl = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'copyUrl', p0, p1, false, callback);
}
Dwr.searchBoards = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'searchBoards', p0, false, callback);
}
Dwr.exchangeMark = function(callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'exchangeMark', false, callback);
}
Dwr.downloadPDF = function(p0, p1, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'downloadPDF', p0, p1, false, callback);
}
Dwr.printLog = function(p0, p1, p2, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'printLog', p0, p1, p2, false, callback);
}
Dwr.isJoinActivity = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'isJoinActivity', p0, false, callback);
}
Dwr.joinActivity = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'joinActivity', p0, p1, p2, p3, false, callback);
}
Dwr.joinLottery = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'joinLottery', p0, p1, p2, p3, false, callback);
}
Dwr.getGuessInfo = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'getGuessInfo', p0, false, callback);
}
Dwr.joinGuess = function(p0, p1, p2, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'joinGuess', p0, p1, p2, false, callback);
}
Dwr.insertWeiboCard = function(p0, p1, p2, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'insertWeiboCard', p0, p1, p2, false, callback);
}
Dwr.insertBoxDaily = function(p0, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'insertBoxDaily', p0, false, callback);
}
Dwr.ajaxReplyPhoto = function(p0, p1, p2, p3, p4, p5, p6, p7, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'ajaxReplyPhoto', p0, p1, p2, p3, p4, p5, p6, p7, false, callback);
}
Dwr.ajaxReplyAlbum = function(p0, p1, p2, p3, p4, callback) {
  dwr.engine._execute(Dwr._path, 'Dwr', 'ajaxReplyAlbum', p0, p1, p2, p3, p4, false, callback);
}
