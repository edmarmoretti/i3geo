<?php
/**
 * Mapserver wrapper to KML/KMZ data
 *
 * Returns KML or KMZ representation of common OGC requests
 *
 * <pre>
 * accepted parameters (case insensitive):
 * - request     = string - request type (OGC WFS like), can be kml (default), kmz, icon
 * - map         = string - path to mapfile
 * - typename    = string - (can be a csv list) - layer name(s)
 * - filter      = string - filter encoding
 * - bbox        = string - (csv) - bounding box csv
 * - encoding    = string - data and mapfile encoding, defaults to ISO-8859-1
 *
 *
 * </pre>
 *
 * @author  Alessandro Pasotti
 * @copyright 2007 ItOpen.it - All rights reserved
 * @package KMLMAPSERVER

 This file is part of KMLMAPSERVER.

 KMLMAPSERVER is free software; you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation; either version 3 of the License, or
 (at your option) any later version.

 KMLMAPSERVER is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with KMLMAPSERVER; if not, write to the Free Software
 Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

 */

/**
 * Fix a GE bug for filled polygons
 */
define('TREAT_POLY_AS_LINE', false);

/**
 * Enable cache
 */
define('ENABLE_CACHE', true);
if (function_exists("dl")) {
    if (! function_exists('ms_GetVersion')) {
        dl('php_mapscript.' . PHP_SHLIB_SUFFIX);
    }
    if (! extension_loaded('php_mbstring')) {
        dl('php_mbstring.' . PHP_SHLIB_SUFFIX);
    }
}
if (! function_exists('ms_GetVersion')) {
    echo "Nao foi possivel carregar php_mapscript";
}

/**
 * Main server class
 */
class LayerServer
{

    /**
     * map file path
     */
    var $map;

    /**
     * request
     */
    var $request;

    /**
     * map instance
     */
    var $map_object;

    /**
     * layer name(s) passed on the request
     */
    var $typename;

    /**
     * array of requested layer objects (hash with layer name as key)
     */
    var $layers;

    /**
     * filters
     */
    var $filter;

    /**
     * bounding box
     */
    var $bbox;

    /**
     * error messages
     */
    var $errors;

    /**
     * send zipped data
     */
    var $_zipped = false;

    /**
     * internal XML buffer
     */
    var $_xml;

    /**
     * input projection
     */
    var $in_proj;

    /**
     * output projection
     */
    var $out_proj;

    /**
     * debug flag
     */
    var $_debug = false;

    /**
     * end point
     */
    var $endpoint;

    /**
     * custom style counter
     */
    var $style_counter = 0;

    /**
     * Mapfile and data encoding encoding
     * XMl output must be UTF-8, attributes and METADATA based strings
     * must be converted to UTF-8, encoding defaults to ISO-8859-1, if
     * your encoding is different, you can set it through CGI style parameters
     */
    var $encoding;

    /**
     * send networklink
     * wether folder should contain networklinks instead of real geometries
     * it is automatically set when all layers are requested
     */
    var $_networklink = false;
    var $postgis_mapa;

    /**
     * Initialize
     */
    function LayerServer()
    {
        $this->errors = array();
        // Load request parameters
        $this->get_request();
        $this->style_counter = 0;
        // Load map
        if (! $this->has_error()) {
            $this->load_map();
        }
    }

    /**
     * Run the server and sends data
     *
     * @return string or void
     */
    function run()
    {
        // Check cache
        if (ENABLE_CACHE) {
            $cache_file = $this->get_cache_file_name();
            if (file_exists($cache_file)) {
                $this->send_header();
                readfile($cache_file);
                exit();
            }
        }
        // If not layer are requested, send all as networklinks
        if (! $this->typename) {
            $this->_networklink = true;
            $this->typename = $this->get_layer_list();
        }
        if ($this->_networklink == false) {
            // desliga todos os layers
            for ($i = 0; $i < $this->map_object->numlayers; $i ++) {
                $l = $this->map_object->getLayer($i);
                $l->set("status", MS_OFF);
            }
            // ajusta a legenda
            $nomesl = explode(',', $this->typename);
            foreach ($nomesl as $nomel) {
                $layer = $this->map_object->getlayerbyname($nomel);
                if ($layer) {
                    $layer->set("status", MS_DEFAULT);
                    if ($layer->numclasses > 0) {
                        $classe = $layer->getclass(0);
                        if (($classe->name == "") || ($classe->name == " ")) {
                            $classe->set("name", $layer->getmetadata("tema"));
                        }
                        // corrige o titulo da legenda
                        $nclass = $layer->numclasses;
                        for ($j = 0; $j < $nclass; $j ++) {
                            $classe = $layer->getclass($j);
                            if ($classe->title === "") {
                                $classe->title = $classe->name;
                            }
                        }
                    }
                }
            }
        }
        $imageObj = $this->map_object->drawlegend();
        $url = $imageObj->saveWebImage();
        $protocolo = explode("/", $_SERVER['SERVER_PROTOCOL']);
        $url = strtolower($protocolo[0] . "://" . $_SERVER['HTTP_HOST']) . $url;
        $legenda = "    <ScreenOverlay>" . PHP_EOL . "      <name>Legenda</name>" . PHP_EOL . "      <Icon>" . PHP_EOL . "        <href>" . $url . "</href>" . PHP_EOL . "      </Icon>" . PHP_EOL . "      <overlayXY x='0.01' y='0.14' xunits='fraction' yunits='fraction'/>" . PHP_EOL . "      <screenXY x='0.01' y='0.14' xunits='fraction' yunits='fraction'/>" . PHP_EOL . "      <size x='-1' y='-1' xunits='pixels' yunits='pixels'/>" . PHP_EOL . "    </ScreenOverlay>" . PHP_EOL;
        if ($this->_networklink == false) {
            $this->_xml = new SimpleXMLElement('<kml xmlns="http://earth.google.com/kml/2.0"><Document >' . $legenda . '</Document></kml>');
        } else {
            $this->_xml = new SimpleXMLElement('<kml xmlns="http://earth.google.com/kml/2.0"><Document ></Document></kml>');
        }
        // Prepare projection
        $this->in_proj = ms_newProjectionObj($this->map_object->getProjection());
        // Set projection to GOOGLE earth's projection
        $this->out_proj = ms_newProjectionObj("init=epsg:4326");
        // Set endpoint
        // die($_SERVER['REQUEST_URI']);

        $protocolo = explode("/", $_SERVER['SERVER_PROTOCOL']);
        $protocolo = strtolower($protocolo[0]);
        $this->endpoint = $protocolo . '://' . $_SERVER['SERVER_NAME'] . ($_SERVER['SERVER_PORT'] ? ':' . $_SERVER['SERVER_PORT'] : '') . $_SERVER['PHP_SELF'];
        // Process request
        if (! $this->has_error()) {
            $this->process_request();
        }
        if ($this->has_error()) {
            $this->add_errors();
        }
        return $this->send_stream($this->get_kml());
    }

    /**
     * Set debug flag
     *
     * @param boolean $value
     */
    function set_debug($value)
    {
        $this->_debug = $value;
    }

    /**
     * Get all request parameters
     */
    function get_request()
    {
        $this->map = $this->load_parm('map');
        $this->bbox = $this->load_parm('bbox');
        $this->filter = $this->load_parm('filter');
        $this->typename = $this->load_parm('typename');
        $this->encoding = $this->load_parm('encoding', 'ISO-8859-1');
        $this->request = $this->load_parm('request', 'kml');
        if ($this->request == 'kmz') {
            $this->_zipped = true;
        } else {
            $this->_zipped = false;
        }
        if($this->request == "kmlwms"){
            $this->_networklink = true;
        }
        if (! $this->map) {
            $this->set_error('No mapfile specified');
        }
    }

    /**
     * Apply filter
     *
     * @return array
     */
    function apply_filter(&$layer, &$filter)
    {
        if ($layer->connectiontype == MS_POSTGIS) {
            if ($filter->PropertyIsEqualTo) {
                $searchstring = '"' . $filter->PropertyIsEqualTo->PropertyName . ' = ' . '\'' . addslashes($filter->PropertyIsEqualTo->Literal) . '\'' . '"';
                $searchfield = $filter->PropertyIsEqualTo->PropertyName;
            } elseif ($filter->PropertyIsLike) {
                $searchfield = $filter->PropertyIsLike->PropertyName;
                $searchstring = '"' . $filter->PropertyIsLike->PropertyName . ' LIKE \'%' . addslashes($filter->PropertyIsLike->Literal) . '%\'' . '"';
            }
        } elseif ($layer->connectiontype == MS_SHAPEFILE || $layer->connectiontype == MS_OGR) {
            if ($filter->PropertyIsEqualTo) {
                $searchstring = $filter->PropertyIsEqualTo->Literal;
                $searchfield = $filter->PropertyIsEqualTo->PropertyName;
            } elseif ($filter->PropertyIsLike) {
                $searchstring = $filter->PropertyIsLike->Literal;
                $searchfield = $filter->PropertyIsLike->PropertyName;
            }
        }
        return array(
            $searchfield,
            $searchstring
        );
    }

    /**
     * Process request
     */
    function process_request()
    {
        // Get layer(s)
        $layers = explode(',', $this->typename);
        if ($this->_networklink) {
            foreach ($layers as $layer) {
                $this->add_networklink($layer);
            }
        } else {
            foreach ($layers as $layer) {
                $this->process_layer_request($layer);
            }
        }
    }

    /**
     * Add a networklink
     */
    function add_networklink(&$layer_name)
    {
        $nl = & $this->_xml->Document->addChild('NetworkLink');
        $layer = @$this->map_object->getLayerByName($layer_name);
        if (! $layer) {
            $layer = $this->map_object->getlayer(0);
        }
        $nl->addChild('name', $this->get_layer_description($layer));
        $nl->addChild('visibility', 0);
        $link = & $nl->addChild('Link');
        $link->addChild('href', $this->endpoint . '?map=' . $this->map . '&amp;typename=' . urlencode($layer_name) . '&amp;request=' . ($this->_zipped ? 'kmz' : 'kml'));
    }

    /**
     * Process a single layer
     *
     * @return boolean false on error
     */
    function process_layer_request(&$layer_name)
    {
        error_reporting(0);
        $v = "5.0.0";
        $vs = explode(" ", ms_GetVersion());
        $cvs = count($vs);
        for ($i = 0; $i < $cvs; ++ $i) {
            if (trim(strtolower($vs[$i])) == "version") {
                $v = $vs[$i + 1];
            }
        }
        $v = explode(".", $v);
        $versao = $v[0];

        $layer = @$this->map_object->getLayerByName($layer_name);
        if (! $layer) {
            $layer = $this->map_object->getlayer(0);
        }
        if (! $layer) {
            $this->set_error('Nenhum layer com esse nome foi encontrado no mapfile ' . $layer_name, $layer_name);
            return false;
        }
        // Add to layer list
        $this->layers[$layer_name] = &  $layer;
        // Get custom template if any
        $description_template = $layer->getMetadata('DESCRIPTION_TEMPLATE');
        // Set on
        $layer->set('status', MS_DEFAULT);
        // Set kml title from layer description (default to layer name)
        $layer_desc = $this->get_layer_description($layer);

        // Now switch raster layers
        // var_dump($layer->type == MS_LAYER_RASTER);
        if ($layer->type == MS_LAYER_RASTER) {
            // Check if wms_onlineresource metadata is set
            $wms_link = $this->map_object->getMetadata('wms_onlineresource');
            if (! $wms_link) {
                $wms_link = $this->map_object->getMetadata('ows_onlineresource');
            }
            if (! $wms_link) {
                $this->set_error('No WMS server available for ' . $layer_name, $layer_name);
                return false;
            }
            // Add parameters to OGC server call
            // Fix &
            $wms_link = preg_replace('/&/', '&amp;', $wms_link);
            $wms_link .= 'VERSION=1.1.1&amp;REQUEST=GetMap&amp;SRS=EPSG:4618&amp;STYLES=&amp;FORMAT=image/png&amp;TRANSPARENT=TRUE&amp;';
            // Link ok, create folder
            // $folder =& $this->_xml->Document->addChild('GroundOverlay');
            $folder = & $this->simplexml_addChild($this->_xml->Document, 'GroundOverlay');
            // simplexml_addChild($parent, $name, $value='')
            // $folder->addChild('description', $this->get_layer_description($layer));
            $this->simplexml_addChild($folder, 'name', $layer_desc);

            // $folder->addChild('name', $layer_desc);
            $this->add_wms_link($folder, $layer, $wms_link);
        } else {
            // Apply filter
            if ($this->filter) {
                // Try loading as XML
                try {
                    $filter = @new SimpleXMLElement($this->filter);
                    list ($searchfield, $searchstring) = $this->apply_filter($layer, $filter);
                    if (! ($searchfield && $searchstring)) {
                        $this->set_error('Error parsing filter', $layer_name);
                        return false;
                    }
                } catch (Exception $e) {
                    $this->set_error('Wrong XML filter', $layer_name);
                    $this->filter = null;
                    return false;
                }
            }
            //error_log(implode(",",$this->postgis_mapa));
            if ($layer->connectiontype == MS_POSTGIS) {
                $layer->set("connection", $this->postgis_mapa[$layer->connection]);
            }
            // Get results
            if (MS_SUCCESS == $layer->open()) {
                // Search which column to use to identify the feature
                $namecol = $layer->getMetadata("itens");
                if ($namecol == "") {
                    $cols = array_values($layer->getItems());
                    $namecol = $cols[0];
                } else {
                    $namecol = explode(",", $namecol);
                    $namecol = $namecol[0];
                }
                // Add classes
                $folder = & $this->_xml->Document->addChild('Folder');

                $class_list = $this->parse_classes($layer, $folder, $namecol, $title_field, $description_template);

                // die(print_r($class_list, true));
                $folder->addChild('description', $this->get_layer_description($layer));
                $folder->addChild('name', $layer_desc);

                // print("$searchfield && $searchstring");
                if (! isset($searchfield)) {
                    $searchfield = false;
                }
                if (! isset($searchstring)) {
                    $searchstring = false;
                }

                if ($searchfield && $searchstring) {
                    if (@$layer->queryByAttributes($searchfield, $searchstring, MS_MULTIPLE) == MS_SUCCESS) {
                        $layer->open();
                        // var_dump($layer->getItems()); die();
                        for ($j = 0; $j < $layer->getNumResults(); $j ++) {
                            // get next shape row
                            if ($versao >= 6) {
                                $shape = $layer->getShape($layer->getResult($j));
                            } else {
                                $result = $layer->getResult($j);
                                $shape = $layer->getFeature($result->shapeindex, $result->tileindex);
                            }
                            $this->process_shape($layer, $shape, $class_list, $folder, $namecol);
                            // end for loop
                        }
                    } else {
                        $this->set_error('Query returned no data', $layer_name);
                        return false;
                    }
                } else { // Get all shapes
                    $layer->set("template", "none.htm");
                    $layer->queryByrect($this->map_object->extent);
                    $layer->open();
                    $n = $layer->getNumResults();
                    for ($j = 0; $j < $n; $j ++) {
                        // get next shape row
                        if ($versao >= 6) {
                            $result = $layer->getResult($j);
                            $shape = $layer->getShape($result);
                        } else {
                            $result = $layer->getResult($j);
                            $shape = $layer->getFeature($result->shapeindex, $result->tileindex);
                        }
                        $shape->classindex = $result->classindex;
                        $this->process_shape($layer, $shape, $class_list, $folder, $namecol);
                    }
                    if ($n == 0) {
                        $this->set_error('QueryByRect returned no data', $layer_name);
                        return false;
                    }
                }
                $layer->close();
            } else {
                $this->set_error('Layer cannot be opened', $layer_name);
                return false;
            }
        }
        return true;
    }

    /**
     * Process the shape
     */
    function process_shape(&$layer, &$shape, &$class_list, &$folder, &$namecol)
    {
        $permite = $layer->getmetadata("permitekmz");
        if (strtolower($permite) == "nao") {
            return;
        }
        $itens = $layer->getmetadata("itens");
        $itensdesc = $layer->getmetadata("itensdesc");
        $shape->project($this->in_proj, $this->out_proj);
        // Assign style
        if ($layer->classitem) {
            // $style_id = $this->get_shape_class($layer->classitem, $shape->values, $class_list);
        }
        if (! isset($style_id)) {
            // Get first class
            $class_keys = array_keys($class_list);
            $indice = $shape->classindex;
            $classe = $layer->getclass($indice);
            $nome = $classe->name;
            $style_id = preg_replace('/[^A-z0-9]/', '_', $layer->name . $nome);
        }
        // Add the feature
        if (array_key_exists('folder', $class_list[$style_id])) {
            $feature_folder = & $class_list[$style_id]['folder'];
        } else {
            // die('missing folder for ' . $style_id);
            $feature_folder = & $folder;
        }
        if (! is_object($feature_folder)) {
            $folder_name = $feature_folder;
            $feature_folder = & $folder->addChild('Folder');
            $feature_folder->addChild('name', $folder_name);
        }
        // Add style class
        $style_url = & $this->add_style($layer, $feature_folder, $style_id, $class_list[$style_id], $namecol, $shape->values);

        $wkt = $shape->toWkt();
        $description_template = $layer->getMetadata('DESCRIPTION_TEMPLATE'); // false;
        if ($description_template == "") {
            $description_template = false;
        }
        $placemark = & $this->add_feature($feature_folder, $wkt, $shape->values[$namecol], $shape->values, $description_template, $class_list[$style_id], $itens, $itensdesc);

        $placemark->addChild('styleUrl', '#' . $style_url);
    }

    /**
     * Add the feature to the result set
     *
     * @return reference to placemark object
     */
    function &add_feature(&$folder, &$wkt, $featurename, $attributes, $description_template, $style_data, $itens, $itensdesc)
    {
        $pm = $folder->addChild('Placemark');
        $fname = mb_convert_encoding($featurename, "UTF-8", mb_detect_encoding($featurename, 'UTF-8, UTF-7, ASCII, ISO-8859-1'));
        $pm->addChild('name', $fname);
        $pm->addChild('description', $this->get_feature_description($fname, $attributes, $description_template, $itens, $itensdesc));
        // Now parse the wkt
        if (strpos($wkt, 'MULTILINESTRING') !== false) {
            $this->add_multilinestring($wkt, $pm, $featurename, $style_data['icon']);
        } elseif (strpos($wkt, 'LINESTRING') !== false) {
            $this->add_linestring($wkt, $pm, $featurename, $style_data['icon']);
        } elseif (strpos($wkt, 'POINT') !== false) {
            $this->add_point($wkt, $pm, $featurename);
        } elseif (strpos($wkt, 'MULTIPOLYGON') !== false) {
            if (TREAT_POLY_AS_LINE) {
                $ml = $pm->addChild('MultiGeometry');
                foreach (split('\), \(', $wkt) as $line) {
                    $this->add_multilinestring($line, $ml, $featurename);
                }
            } else {
                $this->add_multipolygon($wkt, $pm, $featurename);
            }
        } elseif (strpos($wkt, 'POLYGON') !== false) {
            if (TREAT_POLY_AS_LINE) {
                $this->add_multilinestring($wkt, $pm, $featurename);
            } else {
                $this->add_polygon($wkt, $pm, $featurename);
            }
        } else {
            // Error?
        }
        return $pm;
    }

    /**
     * Add a linestring
     */
    function add_linestring(&$wkt, &$element, $featurename, $add_points)
    {
        preg_match('/(\d+[^\(\)]*\d)/', $wkt, $data);
        $data = str_replace(', ', '#', $data[1]);
        $data = str_replace(' ', ',', $data);
        $data = str_replace('#', ' ', $data);
        if ($add_points) {
            preg_match('/^(\d+\.\d+,\d+\.\d+).*(\d+\.\d+,\d+\.\d+)$/', $data, $points);
            if (count($points) == 3) {
                $mg = $element->addChild('MultiGeometry');
                $ls = $mg->addChild('LineString');
                $pt1 = $mg->addChild('Point');
                $pt1->addChild('coordinates', $points[1]);
                $pt2 = $mg->addChild('Point');
                $pt2->addChild('coordinates', $points[2]);
            } else {
                die('errore');
                $ls = $element->addChild('LineString');
            }
            // print_r($points);die();
        } else {
            $ls = $element->addChild('LineString');
        }
        $ls->addChild('coordinates', $data);
    }

    /**
     * Add a multilinestring
     */
    function add_multilinestring(&$wkt, &$element, $featurename, $add_points)
    {
        $ml = $element->addChild('MultiGeometry');
        foreach (split('\), \(', $wkt) as $line) {
            $this->add_linestring($line, $ml, $featurename, $add_points);
        }
    }

    /**
     * Add a point
     */
    function add_point(&$wkt, &$element, $featurename)
    {
        $pt = $element->addChild('Point');
        /*
         * preg_match('/(\d\.?\d+\s\d+\.?\d+)/', $wkt, $data);
         * //var_dump($data);exit;
         * $data = str_replace(' ', ',', $data[1]);
         */
        $data = str_replace("(", "", $wkt);
        $data = str_replace(")", "", $data);
        $data = str_replace("POINT", "", $data);
        $data = str_replace(" ", ",", trim($data));
        // echo $data;exit;
        $pt->addChild('coordinates', $data);
    }

    /**
     * Add a polygon
     */
    function add_polygon(&$wkt, &$element, $featurename)
    {
        $ml = $element->addChild('Polygon');
        foreach (split('\), \(', $wkt) as $line) {
            preg_match('/(\d+[^\(\)]*\d)/', $line, $data);
            $data = str_replace(', ', '#', $data[1]);
            $data = str_replace(' ', ',', $data);
            // Add 1 meter height
            $data = str_replace('#', ',1 ', $data) . ',1';
            $ml->addChild('tessellate', 1);
            // $element->addChild('altitudeMode', 'relativeToGround');
            $element->addChild('altitudeMode', 'clampToGround');
            $ob = $ml->addChild('outerBoundaryIs');
            $ls = $ob->addChild('LinearRing');
            //a inclusao do - foi necessario pois o sinal nao e mantido no processo. Deve ter uma forma melhor de fazer isso
            $ls->addChild('coordinates', "-".$data);
        }
    }

    /**
     * Add a multipolygon
     * fixme: untested, should take holes into account
     */
    function add_multipolygon(&$wkt, &$element, $featurename)
    {
        $ml = $element->addChild('MultiGeometry');
        foreach (split('\), \(', $wkt) as $line) {
            //$line = str_replace("MULTIPOLYGON (","POLYGON ",$line).")";
            $line = str_replace(array("MULTIPOLYGON",")","("),"",$line);
            //$line = "POLYGON ((".$line."))";
            $this->add_polygon($line, $ml, $featurename);
        }
    }

    /**
     * Get the feature description
     */
    function get_feature_description($featurename, $attributes, $description_template, $itens, $itensdesc)
    {
        // Compute hyperlink
        // var_dump($attributes);exit;
        // if($description_template != ""){return $description_template;}
        $n = "";
        if ($description_template != "") {
            foreach ($attributes as $k => $val) {
                $description_template = str_replace("%" . $k . "%", $attributes[$k], $description_template);
            }
            $n = $description_template;
        } else {
            if ($itens == "") {
                foreach ($attributes as $k => $val) {
                    $n .= $k . " - " . $attributes[$k] . "\n";
                }
            } else {
                $itens = explode(",", $itens);
                $itensdesc = explode(",", $itensdesc);
                for ($i = 0; $i < count($itens); $i ++) {
                    $n .= $itensdesc[$i] . " - " . $attributes[$itens[$i]] . "\n";
                }
            }
        }
        $description = mb_convert_encoding($n, "UTF-8", mb_detect_encoding($n, "UTF-8,ISO-8859-1"));
        return $description;
    }

    /**
     * Parse classes
     *
     * @return array hash of 'style_id' => style_data)
     */
    function parse_classes(&$layer, &$folder, &$namecol, &$title_field, &$description_template)
    {
        $style_ar = array();
        $numclasses = $layer->numclasses;
        $versao = $this->versao();
        $vi = $versao["inteiro"];
        for ($i = 0; $i < $numclasses; $i ++) {
            $class = $layer->getClass($i);
            if ($vi >= 60200) {
                if ($class->numlabels > 0)
                    $label = $class->getLabel(0);
            } else {
                $label = $class->label;
            }
            if ($label) {
                $style['label_color'] = $label->color;
                $style['label_size'] = $label->size;
            }
            // Get styles
            for ($j = 0; $j < $class->numstyles; $j ++) {
                $_style = $class->getStyle($j);
                $style['color'] = $_style->color;
                $style['outlinecolor'] = $_style->outlinecolor;
                $style['width'] = $_style->size; // Lines
                $style['backgroundcolor'] = $_style->backgroundcolor;
                if ($layer->type == MS_LAYER_POINT)
                    $style['icon'] = $this->get_icon_url($layer, $class->name, $i);
                $style['icon_width'] = $_style->size; // Points
            }
            $style['expression'] = $class->getExpressionString();
            // Set description_template if any
            $style['description_template'] = $description_template;
            // Get icon for lines if any
            if ($icon = $layer->getMetadata('KML_ADD_POINT')) {
                $style['icon'] = $icon;
                $style['icon_width'] = 32;
            }
            // Create style element
            $style_id = preg_replace('/[^A-z0-9]/', '_', $layer->name . $class->name);
            $this->add_style($layer, $folder, $style_id, $style, $namecol, $title_field);
            // create folder if more than one class
            if ($numclasses > 1) {
                // $style['folder'] =& $class->name;
                // $folder->addChild('Folder');
                // $style['folder']->addChild('name', $class->name);
            }
            $style_ar[$style_id] = $style;
        }
        return $style_ar;
    }

    /**
     * Return a CSV list of all layer names in the mapfile
     * fixme: filter out ANNOTATIONS and other "strange" layers
     */
    function get_layer_list()
    {
        $layer_list = array();
        for ($i = 0; $i < $this->map_object->numlayers; $i ++) {
            $layer = & $this->map_object->getLayer($i);
            $kml_skip = $layer->getMetadata('KML_SKIP');
            if (strtolower($kml_skip) !== 'true') {
                $layer_list[] = $layer->name;
            }
        }
        return join(',', $layer_list);
    }

    /**
     * Return the class for the shape, default to last class if not match
     */
    function get_shape_class(&$classitem, &$values, &$class_list)
    {
        // var_dump($class_list); die();
        foreach ($class_list as $style_id => $style_data) {
            if ($style_data['expression'] && preg_match($style_data['expression'], $values[$classitem])) {
                // print "get_shape_class($classitem) ".$values[$classitem]." matches<br>";
                return $style_id;
            }
        }
        // print "get_shape_class($classitem) ".$values[$classitem]." no matches<br>";
        return $style_id;
    }

    /**
     * Add the style
     *
     * @return the style URL
     */
    function add_style(&$layer, &$folder, $style_id, &$style_data)
    {
        // Calculare style URL
        if ($style_data['description_template']) {
            $this->style_counter ++;
            $style_id .= '_' . $this->style_counter;
            $balloon_data = $this->get_feature_description($attributes[$namecol], $attributes, $style_data['description_template']);
        }

        // Check if the style already exists
        $expr = '//*[@id=\'' . $style_id . '\']';
        if ($folder->xpath($expr)) {
            return $style_id;
        }
        $new_style = & $folder->addChild('Style');
        $new_style['id'] = $style_id;
        // Switch layer type
        switch ($layer->type) {
            case MS_LAYER_POINT:
                $this->add_style_point($new_style, $style_data);
                break;
            case MS_LAYER_POLYGON:
                $this->add_style_polygon($new_style, $style_data);
                break;
            case MS_LAYER_LINE:
                $this->add_style_line($new_style, $style_data);
                // Add KML_ADD_POINT icon
                if ($style_data['icon']) {
                    $this->add_style_point($new_style, $style_data);
                }
                break;
        }
        return $style_id;
    }

    /**
     * Add style for lines
     */
    function add_style_line(&$new_style, &$style_data)
    {
        if ($style_data['outlinecolor']->red != - 1) {
            $st = & $new_style->addChild('LineStyle');
            $st->addChild('color', sprintf('FF%02X%02X%02X', $style_data['outlinecolor']->blue, $style_data['outlinecolor']->green, $style_data['outlinecolor']->red));
            if ($width) {
                $st->addChild('width', $width);
            }
        } elseif ($style_data['color']->red != - 1) {
            $st = & $new_style->addChild('LineStyle');
            $st->addChild('color', sprintf('FF%02X%02X%02X', $style_data['color']->blue, $style_data['color']->green, $style_data['color']->red));
            if ($width) {
                $st->addChild('width', $width);
            }
        }
    }

    /**
     * Add style for points
     */
    function add_style_point(&$new_style, &$style_data)
    {
        if ($style_data['icon']) {
            $st = & $new_style->addChild('IconStyle');
            if ($style_data['width'] && $style_data['icon_width'] != 32) {
                /**
                 */
                // $st->addChild('scale', $style_data['icon_width'] / 32);
                $st->addChild('scale', 1);
            } else {
                $st->addChild('scale', 1);
            }
            $icon = & $st->addChild('Icon');
            $icon->addChild('href', htmlentities($style_data['icon']));
        }
        $ls = & $new_style->addChild('LabelStyle');
        $ls->addChild('scale', $style_data['label_size'] / 32);
        // Add the balloon style if description_template is set
        /*
         * if($style_data['description_template']){
         * $this->add_balloon_style($new_style, $balloon_data);
         * }
         */
        // Label size and color
        /*
         * if($style_data['label_size'] || $style_data['label_color']){
         * $ls =& $new_style->addChild('LabelStyle');
         * if($style_data['label_size'] != -1 && $style_data['label_size'] != 32){
         * $ls->addChild('scale', $style_data['label_size'] / 32);
         * }
         * if($style_data['label_color']->red != -1){
         * $ls->addChild('color', sprintf('FF%02X%02X%02X', $style_data['label_color']->blue, $style_data['label_color']->green, $style_data['label_color']->red));
         * }
         * }
         */
    }

    /**
     * Add style for polygons
     */
    function add_style_polygon(&$new_style, &$style_data)
    {
        // Get also outline styles
        $this->add_style_line($new_style, $style_data);
        $st = & $new_style->addChild('PolyStyle');
        // die(print_r($backgroundcolor, true));
        if ($style_data['color']->red != - 1) {
            $st->addChild('color', sprintf('FF%02X%02X%02X', $style_data['color']->blue, $style_data['color']->green, $style_data['color']->red));
            $st->addChild('fill', 1);
        } else {
            $st->addChild('fill', 0);
        }
        $st->addChild('outline', 1);
    }

    /**
     * Add a WMS raster link
     */
    function add_wms_link(&$folder, &$layer, &$link)
    {
        // Build up the KML response document.
        // $icon =& $folder->addChild('Icon');
        $icon = & $this->simplexml_addChild($folder, 'Icon');
        // $icon->addChild('href', $link . 'layers=' . $layer->name);
        $this->simplexml_addChild($icon, 'href', $link . 'layers=' . $layer->name);
        // $icon->addChild('viewRefreshMode', 'onStop');
        $this->simplexml_addChild($icon, 'viewRefreshMode', 'onStop');
        // $llbox =& $folder->addChild('LatLonBox');
        $llbox = & $this->simplexml_addChild($folder, 'LatLonBox');
        $ext = $this->map_object->extent;
        $ext->project($this->in_proj, $this->out_proj);
        // $llbox->north = $ext->maxy;
        $this->simplexml_addChild($llbox, 'north', $ext->maxy);
        // $llbox->south = $ext->miny;
        $this->simplexml_addChild($llbox, 'south', $ext->miny);
        // $llbox->east = $ext->maxx;
        $this->simplexml_addChild($llbox, 'east', $ext->maxx);
        // $llbox->west = $ext->minx;
        $this->simplexml_addChild($llbox, 'west', $ext->minx);
        // Reset original projection
        $ext->project($this->out_proj, $this->in_proj);
    }

    /**
     * Get the url for a point icon
     */
    function get_icon_url($layer, $classname, $classindex)
    {
        $classe = $layer->getclass($classindex);
        $estilo = $classe->getstyle(0);
        $url = "";
        $imageObj = $classe->createLegendIcon(30, 30);
        if ($imageObj) {
            $url = $imageObj->saveWebImage();
            $protocolo = explode("/", $_SERVER['SERVER_PROTOCOL']);
            $url = strtolower($protocolo[0] . "://" . $_SERVER['HTTP_HOST']) . $url;
            $nome = $imageObj->imagepath . basename($url);

            $img = imagecreatefrompng($nome);
            $index = imagecolorexact($img, 255, 255, 255);
            imagecolortransparent($img, $index);
            imagepng($img, $nome);
        }
        return $url; // $this->endpoint . '?service=icon&map=' . $this->map . '&typename=' . urlencode($layer->name) . '&classname=' . urlencode($classname);
    }

    /**
     * Get the layer description
     */
    function get_layer_description(&$layer)
    {
        $description = $layer->getMetadata('DESCRIPTION');
        if (! $description) {
            $description = $layer->getMetadata('OWS_TITLE');
        }
        if (! $description) {
            $description = $layer->getMetadata('WFS_TITLE');
        }
        if (! $description) {
            $description = $layer->getMetadata('WMS_TITLE');
        }
        if (! $description) {
            $description = $layer->getMetadata('TEMA');
        }
        if (! $description) {
            $description = $layer->name;
        }
        $description = mb_convert_encoding($description, "UTF-8", mb_detect_encoding($description, "UTF-8,ISO-8859-1"));
        return $description;
    }

    /**
     * Add style for balloon
     *
     * @param
     *            string style XML id
     * @param
     *            string column name for title
     */
    function add_balloon_style(&$style, $balloon_data)
    {
        $balloon = & $style->addChild('BalloonStyle');
        $balloon->addChild('text', htmlentities($balloon_data));
    }

    /**
     * Get a request parameter
     *
     * @param string $name
     * @param string $default
     *            parameter optional
     * @return string the parameter value or empty string if null
     */
    function load_parm($name, $default = '')
    {
        if (! isset($_REQUEST[$name]))
            return $default;
        $value = $_REQUEST[$name];
        if (get_magic_quotes_gpc() != 1)
            $value = addslashes($value);
        // $value = escapeshellcmd($value);
        return $value;
    }

    /**
     * Set error message
     *
     * @param string $message
     * @param string $layer
     *            name
     */
    function set_error($message, $layer = 'Error')
    {
        $this->errors[$layer][] = $message;
    }

    /**
     * Load the map and create the map instance
     */
    function load_map()
    {
        if (! file_exists($this->map) && is_readable($this->map)) {
            $this->set_error('Cannot read mapfile ' . $this->map);
        } else {
            $protocolo = explode("/", $_SERVER['SERVER_PROTOCOL']);
            $servidor = strtolower($protocolo[0]) . "://" . $_SERVER['HTTP_HOST'];
            $temp = $this->map;
            if (file_exists(dirname(__FILE__) . "/../../../ms_configura.php")) {
                include (dirname(__FILE__) . "/../../../ms_configura.php");
            } else {
                include (dirname(__FILE__) . "/../../ms_configura.php");
            }
            $this->postgis_mapa = $postgis_mapa;
            if (! file_exists($this->map)) {
                $maptemp = ms_newMapObj($locaplic . "/temas/" . $this->map . ".map");
                // if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
                // {$this->map = $locaplic."/aplicmap/geral1windows.map";}
                // else
                // {$this->map = $locaplic."/aplicmap/geral1.map";}

                $versao = $this->versao();
                $versao = $versao["principal"];
                if (! isset($base) || $base == "") {
                    if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) {
                        $base = $locaplic . "/aplicmap/geral1windowsv" . $versao . ".map";
                    } else {
                        if ($base == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv' . $versao . '.map')) {
                            $base = "/var/www/i3geo/aplicmap/geral1debianv" . $versao . ".map";
                        }
                        if ($base == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav' . $versao . '.map')) {
                            $base = "/var/www/html/i3geo/aplicmap/geral1fedorav" . $versao . ".map";
                        }
                        if ($base == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav' . $versao . '.map')) {
                            $base = "/opt/www/html/i3geo/aplicmap/geral1v" . $versao . ".map";
                        }
                        if ($base == "") {
                            $base = $locaplic . "/aplicmap/geral1v" . $versao . ".map";
                        }
                    }
                }
                $this->map = $base;

                $this->map_object = ms_newMapObj($this->map);
                if (! $this->_zipped) {
                    $this->map_object->setmetadata('wms_onlineresource', $servidor . ":80/i3geo/ogc.php?tema=" . $temp . "&width=1500&height=1500&TRANSPARENT=true&FORMAT=image/png&");
                    $this->map_object->setmetadata("ows_enable_request", "*");
                }
                $n = $this->map_object->numlayers;
                for ($i = 0; $i < $n; $i ++) {
                    $l = $this->map_object->getlayer($i);
                    $l->set("status", MS_DELETE);
                    $l->set("name", "");
                }
                for ($i = 0; $i < ($maptemp->numlayers); $i ++) {
                    $l = $maptemp->getlayer($i);
                    $l->set("status", MS_DEFAULT);
                    if ($this->_networklink == true || $l->type == MS_LAYER_RASTER ) {
                        $l->set("type", MS_LAYER_RASTER);
                        $l->setmetadata('wms_onlineresource', "../../ogc.php?tema=" . $temp . "&width=1500&height=1500&TRANSPARENT=true&FORMAT=image/png&");
                        $l->setmetadata("ows_enable_request", "*");
                    }
                    ms_newLayerObj($this->map_object, $l);
                }
            } else {
                $this->map_object = ms_newMapObj($this->map);
                if (! $this->_zipped) {
                    $this->map_object->setmetadata('wms_onlineresource', "../../ogc.php?tema=" . $temp . "&width=1500&height=1500&TRANSPARENT=true&FORMAT=image/png&");
                    $this->map_object->setmetadata("ows_enable_request", "*");
                }
                $n = $this->map_object->numlayers;
                for ($i = 0; $i < $n; $i ++) {
                    $l = $this->map_object->getlayer($i);
                    $l->set("status", MS_DEFAULT);
                }
            }
            if (! $this->map_object) {
                $this->set_error('Cannot load mapfile ' . $this->map);
            }
        }
    }

    /**
     * Test if has errors
     *
     * @return boolean
     */
    function has_error()
    {
        return count($this->errors) > 0;
    }

    /**
     * Add error messages to folders TAGS
     */
    function add_errors()
    {
        foreach ($this->errors as $layer => $errors) {
            $folder = & $this->_xml->Document->addChild('Folder');
            $folder->addChild('name', $layer);
            $folder->addChild('description', '<p>' . join("</p>\n<p>", $errors) . "</p>");
        }
        return $errorxml;
    }

    /**
     * Fetch XML and format it
     */
    function get_kml()
    {
        $doc = new DOMDocument('1.0');
        $doc->formatOutput = true;
        $domnode = dom_import_simplexml($this->_xml);
        $domnode = $doc->importNode($domnode, true);
        $domnode = $doc->appendChild($domnode);
        return $doc->saveXML();
    }

    /**
     * Send header
     */
    function send_header()
    {
        header('Content-Disposition: attachment; filename='.$this->typename."_".$this->request .'.km' . ($this->_zipped ? 'z' : 'l'));
        header('Content-type: application/vnd.google-earth.km' . ($this->_zipped ? 'z' : 'l') . '+XML');
    }

    /**
     * Calculate cache file name
     */
    function get_cache_file_name()
    {
        // obtem o arquivo do metadata do layer se existir
        $layer = @$this->map_object->getlayerbyname($this->typename);
        if (! $layer) {
            $layer = $this->map_object->getlayer(0);
        }
        $k = $layer->getmetadata("arquivokmz");
        if ($k != "") {
            return $k;
        }
        if (file_exists(dirname(__FILE__) . "/../../../ms_configura.php")) {
            include (dirname(__FILE__) . "/../../../ms_configura.php");
        } else {
            include (dirname(__FILE__) . "/../../ms_configura.php");
        }
        return $dir_tmp . '/' . md5($_SERVER['QUERY_STRING']) . ($this->_zipped ? '.kmz' : '.kml');
    }

    /**
     * Send stream
     */
    function send_stream($data)
    {
        $this->send_header();
        // Compress data

        if ($this->_zipped) {
            include ("zip.class.php");
            $ziper = new zipfile();
            $ziper->addFile($data, 'doc.kml');
            $data = $ziper->file();
        }

        // Create cache if needed
        if (ENABLE_CACHE && count($this->layers) == 1) {
            // error_log( 'creating cache ' . $this->get_cache_file_name() );
            file_put_contents($this->get_cache_file_name(), $data);
        }
        print $data;
        exit();
    }

    // phpversion <= 5.1.2
    function simplexml_addChild($parent, $name, $value = '')
    {
        $new_child = new SimpleXMLElement("<$name>$value</$name>");
        $node1 = dom_import_simplexml($parent);
        $dom_sxe = dom_import_simplexml($new_child);
        $node2 = $node1->ownerDocument->importNode($dom_sxe, true);
        $node1->appendChild($node2);
        return simplexml_import_dom($node2);
    }

    function versao()
    {
        $v = "5.0.0";
        $vs = explode(" ", ms_GetVersion());
        $cvs = count($vs);
        for ($i = 0; $i < $cvs; ++ $i) {
            if (trim(strtolower($vs[$i])) == "version") {
                $v = $vs[$i + 1];
            }
        }
        $versao["completa"] = $v;
        $v = explode(".", $v);
        $versao["principal"] = $v[0];
        $versao["inteiro"] = ms_GetVersionInt();
        return $versao;
    }
}
?>
