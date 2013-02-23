if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (PhotoBean == null) var PhotoBean = {};
PhotoBean._path = 'http://photo.163.com/photo/dwr';
PhotoBean.getImageExif = function(p0, callback) {
  DWREngine.setMethod(DWREngine.ScriptTag);
  dwr.engine._execute(PhotoBean._path, 'PhotoBean', 'getImageExif', p0, callback);
  DWREngine.setMethod(DWREngine.XMLHttpRequest);
}
