;(function(){
  'use strict';

  alert('フォルダを選んでね！');

  var directory = Folder.selectDialog('フォルダを選べ！'),
      toRemoveLayers = [],
      jpegOpt  = new JPEGSaveOptions(),
      callbackCount = 0,
      forSendDirName = 'for-send',
      saveDir;

  if( !directory ){
    return;
  }

  jpegOpt.embedColorProfile = true;
  jpegOpt.quality           = 12;
  jpegOpt.formatOptions     = FormatOptions.PROGRESSIVE;
  jpegOpt.scans             = 3;
  jpegOpt.matte             = MatteType.NONE;

  saveDir = directory.fsName + '/' + forSendDirName;

  seekPSD( directory );

  


  function seekPSD(folder){
    var files = folder.getFiles(),
        fileName = '';

    for (var i = 0, len = files.length; i < len; i++) {
      if( files[i] instanceof Folder ){
        seekPSD(files[i]);
      } else {
        fileName = files[i].fsName;
        if( /(\.psd)$/.test(fileName) ){
          reduceSize(files[i]);
        }
      }
    }
  }

  function reduceSize(psdFile){
    open( File(psdFile.fsName) );

    var fileName = psdFile.fsName.replace(directory.fsName, '');

    fileName = directory.fsName + '/' + forSendDirName + '/' + fileName + '/' + psdFile.name;

    filterLayers(activeDocument);
    callback(fileName);
  }

  function filterLayers(layerset){

    toRemoveLayers = [];

    filterLayerSets( layerset.layerSets );
    filterArtLayers( layerset.artLayers );

  }

  function filterLayerSets(layerSets){

    if( !layerSets ){
      return;
    }

    for(var i = 0, len = layerSets.length; i < len; i ++){
      if( !layerSets[i].visible ){
        if( !layerSets[i].allLocked ){
          toRemoveLayers.push(layerSets[i]);
        }
      } else {
        filterLayers( layerSets[i] );
      }
    }
  }

  function filterArtLayers(artLayers){

    if( !artLayers ){
      return;
    }

    for(var i = 0, len = artLayers.length; i < len; i ++){

      if( !artLayers[i].visible ){
        if( !artLayers[i].allLocked ){
          toRemoveLayers.push(artLayers[i]);
        }
      } else if( artLayers[i].kind === LayerKind.SMARTOBJECT ){
        artLayers[i].rasterize(RasterizeType.ENTIRELAYER);
      }

    }
  }


  function callback(fileName){

    for(var i = 0, rLen = toRemoveLayers.length; i < rLen; i ++){
      try {
        toRemoveLayers[i].remove();
      } catch(event){

      }
    }

    activeDocument.saveAs( new File(fileName.replace(/(\.psd)$/, '.jpg'), jpegOpt, true, Extension.LOWERCASE) );
    activeDocument.saveAs( new File(fileName) );
    activeDocument.close(SaveOptions.SAVECHANGES);
  }
})();