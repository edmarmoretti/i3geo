<HTML>
<HEAD>
<TITLE>WMS</TITLE>
<LINK REL="stylesheet" TYPE="text/css" HREF="wms_style.css">
<SCRIPT LANGUAGE='JavaScript'>

function doSetup() {
  //
  // Initialize the mapframe variables for future wraparound, copying
  // data out of layerframe, which read the information from the 
  // XML capabilities file.
  //
  var flds = new Array( "bbox", "format", "mode", "width", "height", "srs", "onlineresource" );
  for ( i = 0; i < flds.length; i++ ) {
    mapframe.document.mapform.elements[flds[i]].value = 
    layerframe.document.layerform.elements[flds[i]].value;
  }
  //
  // Read the mapframe size and set the state variables.
  //
  doSize();
  //
  // Have the layerframe initiate the first update. This gets all
  // the layer states to match the form values.
  //
  layerframe.toggle();
}

function doSize() {
  //
  // Read the mapframe size using javascript and set the
  // width and height variables in the mapframe.
  //
  var width  = 500;
  var height = 500;
  //
  // IE has different ways of reading frame size.
  //
  if(  navigator.appName.indexOf('Microsoft') != -1 ) { // IE
    if ( window.createPopup ) { // IE >= 5.5
      width  = top.mapframe.frameElement.clientWidth;
      height = top.mapframe.frameElement.clientHeight;
    } else { // IE < 5.5
      width  = top.mapframe.document.body.clientWidth;
      height = top.mapframe.document.body.clientHeight;
    }
  }
  //
  // Other browsers are fairly consistent.
  //
  else { // Not IE
    width  = top.mapframe.innerWidth;
    height = top.mapframe.innerHeight;
  }
  //
  // Set the size state values in the mapframe.
  //
  mapframe.document.mapform.width.value = width;
  mapframe.document.mapform.height.value = height;
}

function doResize() {
  //
  // On a resize event, read the new size, then 
  // redraw the map.
  //
  doSize();
  mapframe.document.mapform.submit();
}

</SCRIPT>
<SCRIPT LANGUAGE='JavaScript'>

//
// Netscape 4 event handling requires us to capture
// the resize event at the top.
//
if ( navigator.appName.indexOf('Netscape') != -1 ) {
  self.captureEvents( Event.RESIZE );
}

// 
// Set some event handlers.
//
self.onload = doSetup;
self.onresize = doResize;

</SCRIPT>
</HEAD>

<FRAMESET
   border=1
   rows=55,*
   framespacing=0
   >

   <FRAME
      name=titleframe
      frameBorder=Yes
      scrolling=No
      src="wms_titleframe.php"
      >

   <FRAMESET
      border=1
      cols=250,*
      frameSpacing=0
      >

   <FRAME
      name=layerframe
      frameBorder=Yes
      scrolling=Yes
      src="wms_layerframe.php?onlineresource=<? echo urlencode($_GET['onlineresource']) ?>"
      >
   <FRAME
      name=mapframe
      frameBorder=Yes
      marginHeight=0
      marginWidth=0
      scrolling=No
      src="wms_mapframe.php"
      >

   </FRAMESET>

</FRAMESET>

</HTML>
