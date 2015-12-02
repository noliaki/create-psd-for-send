;(function(){
  'use strict';

  var fileName = '',
      currentPath = activeDocument.path,
      toRemoveLayers = [],
      today = new Date(),
      suffix = '_' + (today.getMonth() + 1) + today.getDate();

  fileName = activeDocument.name.replace(/(\.psd)$/, suffix + '.psd');

  activeDocument.duplicate( fileName );
  filterLayer(activeDocument.layers);

  for(var i = 0, rLen = toRemoveLayers.length; i < rLen; i ++){
    try {
      toRemoveLayers[i].remove();
    } catch(event){

    }
  }

  activeDocument.saveAs( new File(currentPath + '/' + fileName) );
  activeDocument.close(SaveOptions.SAVECHANGES);

  function filterLayer(_layers){

    for(var i = 0, len = _layers.length; i < len; i ++){

      if( !_layers[i].visible ){
        if( !_layers[i].allLocked ){
          toRemoveLayers.push(_layers[i]);
        }
      } else {
        if( _layers[i].kind === LayerKind.SMARTOBJECT ){
          _layers[i].rasterize(RasterizeType.ENTIRELAYER);
        } else if( _layers[i].typename === 'LayerSet' ){
          filterLayer( _layers[i].layers );
        }
      }
    }
  }
})();