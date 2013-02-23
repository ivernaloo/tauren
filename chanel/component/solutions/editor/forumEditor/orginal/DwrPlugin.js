
// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (DwrPlugin == null) var DwrPlugin = {};
DwrPlugin._path = '/bbs/dwr';
DwrPlugin.main = function(p0, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'main', p0, callback);
}
DwrPlugin.saveHtml = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveHtml', p0, p1, p2, p3, false, callback);
}
DwrPlugin.saveTravel = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveTravel', p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, false, callback);
}
DwrPlugin.saveXiangQin = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveXiangQin', p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, false, callback);
}
DwrPlugin.saveSaiLife = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveSaiLife', p0, p1, p2, p3, p4, p5, p6, p7, p8, false, callback);
}
DwrPlugin.saveDaren = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveDaren', p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, false, callback);
}
DwrPlugin.saveItmm = function(p0, p1, p2, p3, p4, p5, p6, p7, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveItmm', p0, p1, p2, p3, p4, p5, p6, p7, false, callback);
}
DwrPlugin.saveItmm2009 = function(p0, p1, p2, p3, p4, p5, p6, p7, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveItmm2009', p0, p1, p2, p3, p4, p5, p6, p7, false, callback);
}
DwrPlugin.saveStreet = function(p0, p1, p2, p3, p4, p5, p6, p7, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveStreet', p0, p1, p2, p3, p4, p5, p6, p7, false, callback);
}
DwrPlugin.saveBaby = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveBaby', p0, p1, p2, p3, p4, p5, p6, p7, p8, false, callback);
}
DwrPlugin.saveBaby2 = function(p0, p1, p2, p3, p4, p5, p6, p7, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveBaby2', p0, p1, p2, p3, p4, p5, p6, p7, false, callback);
}
DwrPlugin.saveWage = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveWage', p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, false, callback);
}
DwrPlugin.saveTicket = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveTicket', p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, false, callback);
}
DwrPlugin.saveChunyun = function(p0, p1, p2, p3, p4, p5, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveChunyun', p0, p1, p2, p3, p4, p5, false, callback);
}
DwrPlugin.saveHire = function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveHire', p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, false, callback);
}
DwrPlugin.saveDebate = function(p0, p1, p2, p3, p4, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveDebate', p0, p1, p2, p3, p4, false, callback);
}
DwrPlugin.saveActivity = function(p0, p1, p2, p3, p4, p5, p6, p7, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveActivity', p0, p1, p2, p3, p4, p5, p6, p7, false, callback);
}
DwrPlugin.saveCredits = function(p0, p1, p2, p3, p4, p5, p6, p7, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveCredits', p0, p1, p2, p3, p4, p5, p6, p7, false, callback);
}
DwrPlugin.saveCaiPu = function(p0, p1, p2, callback) {
  dwr.engine._execute(DwrPlugin._path, 'DwrPlugin', 'saveCaiPu', p0, p1, p2, false, callback);
}
