;(function(){
  'use strict';

  var fileName = '',
      currentPath = activeDocument.path,
      rootLayers,
      toRemoveLayers = [],
      jpegOpt  = new JPEGSaveOptions();

  jpegOpt.embedColorProfile = true;
  jpegOpt.quality           = 12;
  jpegOpt.formatOptions     = FormatOptions.PROGRESSIVE;
  jpegOpt.scans             = 3;
  jpegOpt.matte             = MatteType.NONE;

  if( /(-for_send\.psd)$/i.test(activeDocument.name) ){
    fileName = activeDocument.name;
  } else {
    fileName = activeDocument.name.replace(/(\.psd)$/, '-for_send.psd');
  }

  activeDocument.duplicate( fileName );

  rootLayers = activeDocument.layers;

  filterLayer(rootLayers);

  for(var i = 0, rLen = toRemoveLayers.length; i < rLen; i ++){
    toRemoveLayers[i].remove();
  }

  activeDocument.saveAs( new File(currentPath + '/' + fileName.replace(/(\.psd)$/, '.jpg')), jpegOpt, true, Extension.LOWERCASE );
  activeDocument.saveAs( new File(currentPath + '/' + fileName) );
  activeDocument.close(SaveOptions.SAVECHANGES);

  function filterLayer(_layers){

    for(var i = 0, len = _layers.length; i < len; i ++){

      if( !_layers[i].visible ){
        toRemoveLayers.push(_layers[i]);
      }

      if( _layers[i].kind === LayerKind.SMARTOBJECT ){
        _layers[i].rasterize(RasterizeType.ENTIRELAYER);
      }

      if( _layers[i].typename === 'LayerSet' && _layers[i].visible ){
        filterLayer( _layers[i].layers );
        // alert( _layers[i].name );
      }
    }
  }
})();