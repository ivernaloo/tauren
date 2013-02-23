
// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (DwrClub == null) var DwrClub = {};
DwrClub._path = '/bbs/dwr';
DwrClub.getHeader = function(p0, callback) {
  dwr.engine._execute(DwrClub._path, 'DwrClub', 'getHeader', p0, false, callback);
}
