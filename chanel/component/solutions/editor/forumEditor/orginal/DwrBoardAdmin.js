
// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (DwrBoardAdmin == null) var DwrBoardAdmin = {};
DwrBoardAdmin._path = '/bbs/dwr';
DwrBoardAdmin.main = function(p0, callback) {
  dwr.engine._execute(DwrBoardAdmin._path, 'DwrBoardAdmin', 'main', p0, callback);
}
DwrBoardAdmin.delArticle = function(p0, callback) {
  dwr.engine._execute(DwrBoardAdmin._path, 'DwrBoardAdmin', 'delArticle', p0, false, callback);
}
DwrBoardAdmin.searchBoards = function(p0, p1, callback) {
  dwr.engine._execute(DwrBoardAdmin._path, 'DwrBoardAdmin', 'searchBoards', p0, p1, false, callback);
}
DwrBoardAdmin.isBoardAdmin = function(p0, callback) {
  dwr.engine._execute(DwrBoardAdmin._path, 'DwrBoardAdmin', 'isBoardAdmin', p0, false, callback);
}
DwrBoardAdmin.auditArticle = function(p0, p1, p2, callback) {
  dwr.engine._execute(DwrBoardAdmin._path, 'DwrBoardAdmin', 'auditArticle', p0, p1, p2, false, callback);
}
DwrBoardAdmin.allAuditArticle = function(p0, p1, p2, callback) {
  dwr.engine._execute(DwrBoardAdmin._path, 'DwrBoardAdmin', 'allAuditArticle', p0, p1, p2, false, callback);
}
DwrBoardAdmin.batchAuditArticle = function(p0, callback) {
  dwr.engine._execute(DwrBoardAdmin._path, 'DwrBoardAdmin', 'batchAuditArticle', p0, false, callback);
}
