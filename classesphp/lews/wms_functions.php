<?php


function xml2html ( $str ) {
  # 
  # Convert XML characters to HTML entities 
  # for display purposes.
  #
  $str = ereg_replace("&","&amp;",$str);
  $str = ereg_replace("<","&lt;",$str);
  $str = ereg_replace(">","&gt;<BR>",$str);
  return $str;
}

function wms_descricao ( $dom,$xp ) {
  $xpath = new DOMXPath($dom);
  $query = $xp;
  $entries = $xpath->query($query);
	$n = "";
  foreach ($entries as $entry)
	{
		$n = $entry->nodeValue;
	}	
	return $n;
}

function wms_descricaov ( $dom,$xp,$attrib ) {
  $xpath = new DOMXPath($dom);
  $query = $xp;
  $entries = $xpath->query($query);
	$n = "";
  foreach ($entries as $entry)
	{
		$n = $entry->getAttribute($attrib);
	}	
	return $n;
}

function wms_descricaon ( $dom,$xp,$n ) {
  $ctx = xpath_new_context($dom);
  $xpnode = xpath_eval($ctx,$xp);
  $dtnode = $xpnode->nodeset[$n]->first_child();
  return $dtnode->content;
}

function wms_title ( $dom ) {
  #
  # Read the WMS service title and return it as text.
  #
  $xpath = new DOMXPath($dom);
  $query = '//WMT_MS_Capabilities/Service/Title';
  $entries = $xpath->query($query);
  foreach ($entries as $entry){$nomeserv = $entry->nodeValue;}	
	return $nomeserv;
}

function wms_onlineresource ( $dom ) {
  #
  # Read the WMS online resource URL and return it as text.
  #
  $xp = "/WMT_MS_Capabilities/Service/OnlineResource";
  $ctx = xpath_new_context($dom);
  $xpnode = xpath_eval($ctx,$xp);
  return $xpnode->nodeset[0]->get_attribute("href");
}

function wms_formats ( $dom )
{
	$xpath = new DOMXPath($dom);
  $query = '//WMT_MS_Capabilities/Capability/Request/GetMap/Format';
  $entries = $xpath->query($query);
	$arr = array();
  foreach ($entries as $entry)
	{
	  $arr[] = $entry->nodeValue;
	}	
  return $arr;
}

function wms_estilos ( $dom ) {
  #
  # Read the WMS image formats and return them as an array.
  #
  //$xp = "/Style";
  //$ctx = xpath_new_context($dom);
  //$xpnode = xpath_eval($ctx,$xp);
  //return $xpnode->nodeset;
  $return = $dom->getElementsByTagName("Style");

}

function wms_exceptions ( $dom ) {
  #
  # Read the WMS exception formats and return them as an array.
  #
  $xp = "/WMT_MS_Capabilities/Capability/Exception/Format";
  $ctx = xpath_new_context($dom);
  $xpnode = xpath_eval($ctx,$xp);
  $arr = array();
  for( $i = 0; $i < sizeof($xpnode->nodeset); ++$i ) {
    $dtnode = $xpnode->nodeset[0]->first_child();
    array_push($arr,$dtnode->content);
  }
  return $arr;
}

function wms_layers ( $dom ) {
  #
  # Read the WMS first level layers and return an 
  # array of nodes.
  #
	$xpath = new DOMXPath($dom);
  $query = '//WMT_MS_Capabilities/Capability/Layer';
  $entries = $xpath->query($query);
	return $entries;
}

function wms_xpnode2content( $xp_node ) {
  #
  # Read the content child node of an element tag
  # node.
  #
  $content = "";
  if( $xp_node->nodeset[0] ) {
    $node = $xp_node->nodeset[0]->first_child();
    $content = $node->content;
  }
  return $content;
}

function wms_srs( $dom ) 
{
	$xpath = new DOMXPath($dom);
  $query = '//WMT_MS_Capabilities/Capability/Layer/SRS';
  $entries = $xpath->query($query);
	$srs = "";
  foreach ($entries as $entry)
	{
	  $s = $entry->nodeValue;
		if ($s == "EPSG:4326")
		{$srs = "EPSG:4326";}
	}	
  if ($srs == "") {$srs = $s;}
  return strtoupper($srs);
}

function wms_bbox( $dom ) 
{
	$xpath = new DOMXPath($dom);
  $query = '//WMT_MS_Capabilities/Capability/Layer/LatLonBoundingBox';
  $entries = $xpath->query($query);
  foreach ($entries as $entry){$bbox = $entry->nodeValue;}	
	if ($bbox == '-1,-1,-1,-1')
	{return '-180,-90,180,90';}
	else
  {return wms_bbox2txt($bbox);}
}

function wms_bbox2txt( $node ) {
  #
  # Convert a BoundingBox node into a text string.
  #
  if( $node ) {
    $txt .= 1 * $node->get_attribute("minx");
    $txt .= ",";
    $txt .= 1 * $node->get_attribute("miny");
    $txt .= ",";
    $txt .= 1 * $node->get_attribute("maxx");
    $txt .= ",";
    $txt .= 1 * $node->get_attribute("maxy");
  } 
  else {
    $txt = "-180,-90,180,90";
  }
  return $txt;
}

function wms_layer2html( $node, $tipo , $layer ) {
  #
  # Convert a Layer node into an HTML representation.
  #
  $ctx = xpath_new_context($node);
  $xp_title  = xpath_eval($ctx,"/Title");
  $xp_name   = xpath_eval($ctx,"/Name");
	if (wms_xpnode2content($xp_name) == ""){$xp_name = xpath_eval($ctx,"/name");}
  $xp_srs    = xpath_eval($ctx,"/SRS");
  $xp_llbbox = xpath_eval($ctx,"/LatLonBoundingBox");
  $xp_bbox   = xpath_eval($ctx,"/BoundingBox");
  $txt_title = wms_xpnode2content($xp_title);
  $txt_name  = wms_xpnode2content($xp_name);
  $txt_srs   = strtoupper(wms_xpnode2content($xp_srs));
  $node_llbbox = $xp_llbbox->nodeset[0];
  $node_bbox   = $xp_bbox->nodeset[0];
  $queryable = 0;
  if ( $node->get_attribute("queryable") ) {
    $queryable = 1;
  }
  $opaque = 0;
  if ( $node->get_attribute("opaque") ) {
    $opaque = 1;
  }
	//legenda
	$xp_legenda   = xpath_eval($ctx,"/LegendURL/OnlineResource");
	$nodelegenda = $xp_legenda->nodeset[0];
	if($nodelegenda)
	{  $legenda = $nodelegenda->get_attribute("href");}
	
  $html  = "<INPUT TYPE='radio' NAME='checks' VALUE='$txt_name' onClick='toggle(event,\"$tipo\",\"$layer\",\"$legenda\",\"$txt_title\")'>";
  $html .= "&nbsp;&nbsp;";
  $html .= $txt_title . "\n";
  $html .= wms_hidden("bbox_$txt_name", wms_bbox2txt($node_bbox));
  $html .= wms_hidden("llbox_$txt_name", wms_bbox2txt($node_llbbox));
  $html .= wms_hidden("srs_$txt_name", $txt_srs);
  $html .= wms_hidden("query_$txt_name", $queryable );
  $html .= wms_hidden("opaque_$txt_name", $opaque );
  $html .= "<BR>";
  return $html;
}

function wms_layer3html( $node ) {
  #
  # Convert a Layer node into an HTML representation sem radio.
  #
  $ctx = xpath_new_context($node);
  $xp_title  = xpath_eval($ctx,"/Title");
	$xp_abs  = xpath_eval($ctx,"/Abstract");
  $txt_title = wms_xpnode2content($xp_title);
	$txt_abs = wms_xpnode2content($xp_abs);
  $html .= "<b>".$txt_title . "</b><i style='color:gray'>" . "-" . $txt_abs . "</i>\n";
  $html .= "<BR>";
  return $html;
}

function wms_layer4html( $layer ) {
	$estilos = wms_estilos($layer);
	if (count($estilos) > 0)
	{
    $ctxl = xpath_new_context($layer);
    $xp_namel   = xpath_eval($ctxl,"/Name");
		if (wms_xpnode2content($xp_namel) == ""){$xp_namel = xpath_eval($ctxl,"/name");}
		$txt_namel  = wms_xpnode2content($xp_namel);
	  $html .= wms_layer3html($layer);
	  foreach ($estilos as $estilo)
    {
		  $html .= wms_layer2html($estilo,"estilo",$txt_namel);
	  }
	}
	else
	{
	  $html .= wms_layer2html($layer,"tema","");
	}
	return $html;
}


function wms_fatal ( $err ) {
  print "<P>$err</P>";
  exit;
}

function wms_hidden ( $name, $value ) {
  return "<INPUT TYPE='hidden' NAME='$name' VALUE='$value'>\n";
}

function wms_pan ( $bbox, $size, $click ) {
  #
  # Calculate a new extent based on an image size and image
  # click coordinates. Move extent linearly so that the 
  # click becomes the new spatial center.
  #
  $sw = $bbox[2] - $bbox[0];
  $sh = $bbox[3] - $bbox[1];
  $iw = $size[0];
  $ih = $size[1];
  $x = $click[0];
  $y = $ih - $click[1] - 1;
  $mx = $iw / 2;
  $my = $ih / 2;

  $bbox[0] = $bbox[0] - $sw * ($mx - $x) / $iw;
  $bbox[1] = $bbox[1] - $sh * ($my - $y) / $ih;
  $bbox[2] = $bbox[2] - $sw * ($mx - $x) / $iw;
  $bbox[3] = $bbox[3] - $sh * ($my - $y) / $ih;
  
  return $bbox;
}

function wms_zoom ( $bbox, $factor ) {
  # 
  # Create a new resized extent based on a spatial extent and 
  # zoom factor.
  #
  $sw = $bbox[2] - $bbox[0];
  $sh = $bbox[3] - $bbox[1];
  $mx = ($bbox[2] + $bbox[0]) / 2;
  $my = ($bbox[3] + $bbox[1]) / 2;
  $bbox[0] = $mx - $factor * $sw / 2;
  $bbox[1] = $my - $factor * $sh / 2;
  $bbox[2] = $mx + $factor * $sw / 2;
  $bbox[3] = $my + $factor * $sh / 2;
  return $bbox;
}

function wms_scale ( $bbox, $size ) {
  # 
  # Resize a spatial extent to have the same aspect ratio
  # as an image size.
  #
  # Spatial width is always preserved and spatial height is 
  # altered to match the new aspect ratio. There are other
  # heuristics for this transformation which might be 
  # more aesthetically pleasing.
  #
  $sw = $bbox[2] - $bbox[0];
  $sh = $bbox[3] - $bbox[1];
  $iw = $size[0];
  $ih = $size[1];
  $sh = $sw * $ih / $iw;
  $bbox[1] = (($bbox[3] + $bbox[1]) / 2) - ($sh / 2);
  $bbox[3] = (($bbox[3] + $bbox[1]) / 2) + ($sh / 2);
  return $bbox;
}

?>
