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
if(function_exists("dl")){
	if (!function_exists('ms_GetVersion'))
	{dl( 'php_mapscript.'.PHP_SHLIB_SUFFIX );}
}
if (!function_exists('ms_GetVersion'))
{echo "Nao foi possivel carregar php_mapscript";}

/**
* Main server class, wraps real kml or icon servers
*/

class KmlServer {

    /** server instance */
    var $service;

    /** request */
    var $request;

    /** debug flag  */
    var $_debug = false;

    /**
    * Initialize
    *
    */
    function KmlServer(){
        $this->get_request();
        if($this->service == 'icon'){
            include 'symbolserver.class.php';
            $this->service = new SymbolServer();
            $this->service->run();
        } else {
            include 'layerserver.class.php';
            error_reporting(0);
            $this->service = new LayerServer();
            $this->service->run();
        }
    }

    /**
    * Get all request parameters
    */
    function get_request(){
        $this->service = $this->load_parm('service');
        if(!$this->service){
            $this->service= $this->load_parm('request');
        }
        if(!$this->service){
            $this->service= "kml";
        }
    }

    /**
    * Get a request parameter
    * @param string $name
    * @return string the parameter value or empty string if null
    */
    function load_parm($name){
        if(!isset($_REQUEST[$name])) return '';
        $value = $_REQUEST[$name];
        if(get_magic_quotes_gpc() != 1) $value = addslashes($value);
        //$value = escapeshellcmd($value);
        return $value;
    }
}
?>
