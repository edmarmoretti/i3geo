<HTML>
<HEAD>
<LINK REL='stylesheet' TYPE='text/css' HREF='wms_style.css'>
<SCRIPT LANGUAGE='JavaScript'>

function doQuery() {
  //
  // If we are in query mode, we want a new window
  // to submit the form into.
  //
  var win_size = "width=280,height=450";
  var win_frame = "status=no,menubar=no,toolbar=no,resizeable=yes,scrollbars=yes";
  window.qwin = open("","queryframe",win_size + "," + win_frame);
  window.qwin.focus();
  return(true);
}

function doSubmit() {
  //
  // This function takes submissions from the layer list and
  // ensures they go to the right target if we happen to be 
  // in query mode at the time.
  //
  if ( document.mapform.mode.value == "qry" ) {
    document.mapform.action = "wms_mapframe.php";
    document.mapform.target = "mapframe";
  }
  document.mapform.submit();
}

function setMode(mode) {
  //
  // This takes mode changes from the titleframe and handles 
  // the interface state appropriately.
  //
  document.mapform.mode.value = mode;
  if ( mode == "qry" ) {
    //
    // Set the target and action appropriately for query mode.
    //
    document.mapform.onsubmit = doQuery;
    document.mapform.action = "wms_query.php";
    document.mapform.target = "queryframe";
  }
  else {
    //
    // Set the target and action appropriately for other modes.
    //
    document.mapform.action = "wms_mapframe.php";
    document.mapform.onsubmit = null;
    document.mapform.target = "mapframe";
    if( window.qwin != null ) {
      window.qwin.close();
    }
  }
  if ( mode == "all" ) {
    document.mapform.submit();
  }
}


</SCRIPT>
</HEAD>
<BODY TOPMARGIN=0 BOTTOMMARGIN=0 RIGHTMARGIN=0 LEFTMARGIN=0>
<FORM NAME='mapform' TARGET='mapframe' METHOD='post' ACTION='wms_mapframe.php'>

<?

include("wms_functions.php");

if ( $_POST["onlineresource"] ) {

  $size = array($_POST["width"],$_POST["height"]);
  $bbox = explode(",",$_POST["bbox"]);

  if( $_POST["mapimg_x"] && $_POST["mapimg_y"] ) {

    $click = array($_POST["mapimg_x"],$_POST["mapimg_y"]);

    if( $_POST["mode"] == "pan" ) {
      $bbox = wms_pan( $bbox, $size, $click );
    }
    elseif( $_POST["mode"] == "zin" ) {
      $bbox = wms_pan( $bbox, $size, $click );
      $bbox = wms_zoom( $bbox, 0.5 );
    }
    elseif( $_POST["mode"] == "zout" ) {
      $bbox = wms_pan( $bbox, $size, $click );
      $bbox = wms_zoom( $bbox, 2.0 );
    }
  }

  #
  # We are in zoom-to-extents mode, to override current
  # extent with saved original extent. Then switch to
  # the default mode (pan).
  #
  if( $_POST["mode"] == "all" ) {
    $bbox = explode(",",$_POST["bbox0"]);
    $_POST["mode"] = "pan";
  }
  #
  # Resize the spatial extents to match the image
  # aspect.
  #
  $bbox = wms_scale( $bbox, $size );
  $_POST["bbox"] = implode(",",$bbox);
  #
  # Store the initial extent for future use.
  #
  if( ! $_POST["bbox0"] ) {
    $_POST["bbox0"] = $_POST["bbox"];
  }
  #
  # Create the GETMAP URL.
  #
  $url = $_POST["onlineresource"] .
	 "VERSION=" . urlencode("1.1.0") . "&" . 
         "REQUEST=GetMap&" .
	 "BBOX=" . urlencode($_POST["bbox"]) . "&" . 
	 "LAYERS=" . urlencode($_POST["layers"]) . "&" . 
	 "SRS=" . urlencode($_POST["srs"]) . "&" . 
	 "WIDTH=" . urlencode($_POST["width"]) . "&" . 
	 "HEIGHT=" . urlencode($_POST["height"]) . "&" . 
	 "FORMAT=" . urlencode($_POST["format"]);
  #
  # Get the map image.
  #
  print "<INPUT BORDER=0 TYPE='image' NAME='mapimg' SRC='$url'>";

}

#
# Fill out the wraparound information. This saves the state of the 
# system for use in the next action.
#
$wms_vars = array("bbox","format","width","height","layers","mode","srs","onlineresource","bbox0","qlayers");
foreach ( $wms_vars as $var ) {
  print wms_hidden($var,$_POST[$var]);
}

?>

</FORM>
<SCRIPT LANGUAGE='JavaScript'>
//
// A silly hack to ensure that if we are in query mode the
// form target and action correspond to the query mode.
//
if ( document.mapform.mode.value == "qry" ) {
  document.mapform.target = "queryframe";
  document.mapform.action = "wms_query.php";
}
</SCRIPT>
</BODY>
</HTML>
