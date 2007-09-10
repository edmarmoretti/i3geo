<HTML>
<HEAD>
<LINK REL='stylesheet' TYPE='text/css' HREF='wms_style.css'>

<SCRIPT LANGUAGE='JavaScript'>

function toggle(event) {
  var lyrs = new Array();
  var qlyrs = new Array();
  for( i = 0; i < document.layerform.elements.length; i++ ) {
    if( document.layerform.elements[i].name == "checks" ) {
      if( document.layerform.elements[i].checked ) {
        lyrs.push(document.layerform.elements[i].value);
        if( eval("document.layerform.query_" + document.layerform.elements[i].value + ".value") ) {
	  qlyrs.push(document.layerform.elements[i].value);
	}
      }
    }
  }
  top.mapframe.document.mapform.layers.value = lyrs.join(",");
  top.mapframe.document.mapform.qlayers.value = qlyrs.join(",");
  top.mapframe.doSubmit();
}

</SCRIPT>

</HEAD>
<BODY>

<?


# -------------------------------------------------------------
# Import the WMS support functions for PHP.  These are mostly responsible for
# handling the XML capabilities request, and creating appropriate JavaScript
# objects from that data.8
#
# PHP functions are also used to generate the query result page.
#
include("wms_functions.php");

# -------------------------------------------------------------
# Test that there is a wms service defined before proceding.
#
if ( ! $onlineresource ) {
  # No WMS service provided.
  wms_fatal("No 'onlineresource' defined.");
  }

$wms_service_request = $onlineresource . "REQUEST=GetCapabilities&SERVICE=WMS";


# -------------------------------------------------------------
# Test that the capabilites file has successfully downloaded.
#
if( !($wms_capabilities = file($wms_service_request)) ) {
  # Cannot download the capabilities file.
  wms_fatal("Unable to retrieve capabilities file '$wms_service_request'.");
}

$wms_capabilities = implode("",$wms_capabilities);

# -------------------------------------------------------------
# Test that the capabilites file has successfully parsed.
#
if( !($dom = xmldoc($wms_capabilities)) ) {
  # Cannot parse the capabilities file.
  wms_fatal("Unable to parse capabilities file from '$onlineresource'.<P>" . xml2html($wms_capabilities));
}

# -------------------------------------------------------------
# Create the JavaScript map object and layer objects.
# Set the layer objects to have a valid reference to the map object.
#
#print xml2html($wms_capabilities); exit;
print "<H1>" . wms_title($dom) . "</H1>";
print "<FORM NAME='layerform'>";
foreach (wms_layers($dom) as $layer) {
  print wms_layer2html($layer);
}
$bbox = wms_bbox($dom);
print wms_hidden("bbox",$bbox);
print wms_hidden("format","image/png");
print wms_hidden("mode","PAN");
print wms_hidden("width","500");
print wms_hidden("height","500");
print wms_hidden("onlineresource",$onlineresource);
print wms_hidden("srs",wms_srs($dom));
print "</FORM>";
$bbox = explode(",",$bbox);
print "<TABLE BORDER=0 WIDTH=100% CELLPADDING=3>";
print "<TR VALIGN=TOP><TH CLASS=SMALL ALIGN=RIGHT>BBOX:</TH><TD CLASS=SMALL>LL $bbox[0],$bbox[1]<BR> UR $bbox[2],$bbox[3]</TD></TR>";
print "<TR VALIGN=TOP><TH CLASS=SMALL ALIGN=RIGHT>SRS:</TH><TD CLASS=SMALL>".wms_srs($dom)."</TD></TR>";
print "</TABLE>";

?>

</BODY>
</HTML>
