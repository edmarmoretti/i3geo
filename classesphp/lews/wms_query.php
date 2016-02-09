<?

if ( $_POST["onlineresource"] ) {

  if( $_POST["mapimg_x"] && $_POST["mapimg_y"] ) {

   $url = $_POST["onlineresource"] .
 	  "VERSION=" . urlencode("1.1.0") . "&" . 
          "Request=GetFeatureInfo&" .
          "BBOX=" . urlencode($_POST["bbox"]) . "&" . 
          "SRS=" . urlencode($_POST["srs"]) . "&" . 
	  "X=" . $_POST["mapimg_x"] . "&" . 
	  "Y=" . $_POST["mapimg_y"] . "&" . 
          "LAYERS=" . urlencode($_POST["layers"]) . "&" . 
          "QUERY_LAYERS=" . urlencode($_POST["qlayers"]) . "&" .
          "WIDTH=" . urlencode($_POST["width"]) . "&" . 
          "HEIGHT=" . urlencode($_POST["height"]) . "&" . 
          "FORMAT=" . urlencode($_POST["format"]);

  header("Location: $url");

  }

}

?>
