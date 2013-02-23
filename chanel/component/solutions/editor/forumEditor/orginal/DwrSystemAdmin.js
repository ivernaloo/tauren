
// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (DwrSystemAdmin == null) var DwrSystemAdmin = {};
DwrSystemAdmin._path = '/bbs/dwr';
DwrSystemAdmin.isGarbage = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'isGarbage', p0, p1, false, callback);
}
DwrSystemAdmin.postSide = function(p0, p1, p2, p3, p4, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'postSide', p0, p1, p2, p3, p4, false, callback);
}
DwrSystemAdmin.isEditor = function(callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'isEditor', false, callback);
}
DwrSystemAdmin.delBlackList = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delBlackList', p0, p1, false, callback);
}
DwrSystemAdmin.delIpLimit = function(p0, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delIpLimit', p0, false, callback);
}
DwrSystemAdmin.auditArticle = function(p0, p1, p2, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'auditArticle', p0, p1, p2, false, callback);
}
DwrSystemAdmin.allAuditArticle = function(p0, p1, p2, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'allAuditArticle', p0, p1, p2, false, callback);
}
DwrSystemAdmin.batchAuditArticle = function(p0, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'batchAuditArticle', p0, false, callback);
}
DwrSystemAdmin.isSuperEditor = function(callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'isSuperEditor', false, callback);
}
DwrSystemAdmin.boardClose = function(p0, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'boardClose', p0, false, callback);
}
DwrSystemAdmin.boardAudit = function(p0, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'boardAudit', p0, false, callback);
}
DwrSystemAdmin.boardReplyAudit = function(p0, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'boardReplyAudit', p0, false, callback);
}
DwrSystemAdmin.moveNav = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'moveNav', p0, p1, false, callback);
}
DwrSystemAdmin.updateDirectory = function(p0, p1, p2, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'updateDirectory', p0, p1, p2, false, callback);
}
DwrSystemAdmin.delDirectory = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delDirectory', p0, p1, false, callback);
}
DwrSystemAdmin.addMaster = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'addMaster', p0, p1, false, callback);
}
DwrSystemAdmin.delMaster = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delMaster', p0, p1, false, callback);
}
DwrSystemAdmin.updateMaster = function(p0, p1, p2, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'updateMaster', p0, p1, p2, false, callback);
}
DwrSystemAdmin.moveMaster = function(p0, p1, p2, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'moveMaster', p0, p1, p2, false, callback);
}
DwrSystemAdmin.moveSide = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'moveSide', p0, p1, false, callback);
}
DwrSystemAdmin.moveBoard = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'moveBoard', p0, p1, false, callback);
}
DwrSystemAdmin.updateMasterHtml = function(p0, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'updateMasterHtml', p0, false, callback);
}
DwrSystemAdmin.delSignBlack = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delSignBlack', p0, p1, false, callback);
}
DwrSystemAdmin.changeGuestIp = function(p0, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'changeGuestIp', p0, false, callback);
}
DwrSystemAdmin.postKeyword = function(p0, p1, p2, p3, p4, p5, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'postKeyword', p0, p1, p2, p3, p4, p5, false, callback);
}
DwrSystemAdmin.delKeyword = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delKeyword', p0, p1, false, callback);
}
DwrSystemAdmin.delPrivilegeUser = function(p0, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delPrivilegeUser', p0, false, callback);
}
DwrSystemAdmin.postWebmasterPurview = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'postWebmasterPurview', p0, p1, false, callback);
}
DwrSystemAdmin.delWebmaster = function(p0, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'delWebmaster', p0, false, callback);
}
DwrSystemAdmin.pageGenerator = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'pageGenerator', p0, p1, p2, p3, false, callback);
}
DwrSystemAdmin.makeSide = function(callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'makeSide', false, callback);
}
DwrSystemAdmin.checkForfendArticle = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'checkForfendArticle', p0, p1, false, callback);
}
DwrSystemAdmin.isLegalBoard = function(p0, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'isLegalBoard', p0, callback);
}
DwrSystemAdmin.sendSysMessage = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'sendSysMessage', p0, p1, false, callback);
}
DwrSystemAdmin.sendChannelMessage = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'sendChannelMessage', p0, p1, false, callback);
}
DwrSystemAdmin.isGarbageByContent = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'isGarbageByContent', p0, p1, false, callback);
}
DwrSystemAdmin.isMessageGarbage = function(p0, p1, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'isMessageGarbage', p0, p1, false, callback);
}
DwrSystemAdmin.deleteGarbage = function(p0, callback) {
  dwr.engine._execute(DwrSystemAdmin._path, 'DwrSystemAdmin', 'deleteGarbage', p0, false, callback);
}
