
// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (DwrAlarm == null) var DwrAlarm = {};
DwrAlarm._path = '/bbs/dwr';
DwrAlarm.main = function(p0, callback) {
  dwr.engine._execute(DwrAlarm._path, 'DwrAlarm', 'main', p0, callback);
}
DwrAlarm.oldJsVersion = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(DwrAlarm._path, 'DwrAlarm', 'oldJsVersion', p0, p1, p2, p3, false, callback);
}
DwrAlarm.checkLastReply = function(p0, p1, p2, p3, p4, p5, p6, callback) {
  dwr.engine._execute(DwrAlarm._path, 'DwrAlarm', 'checkLastReply', p0, p1, p2, p3, p4, p5, p6, false, callback);
}
