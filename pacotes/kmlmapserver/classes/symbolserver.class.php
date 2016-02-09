<?php
/**
* Mapserver wrapper to symbol icons
*
* Returns an image for the symbol
*
* <pre>
* accepted parameters (case insensitive):
* - map         = string - path to mapfile
* - typename    = string - layer name
* - classname   = string - class name
* </pre>
*
* @author  Alessandro Pasotti
* @copyright 2007 ItOpen.it - All rights reserved
* @package KMLSERVER

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

class SymbolServer {

    /** map file path */
    var $map;

    /** map instance */
    var $map_object;

    /** layer name */
    var $typename;

    /** class */
    var $classname;

    /** class index */
    var $classindex;

    /** icon_layer */
    var $icon_layer;

    /** icon point object */
    var $iconpoint;


    function SymbolServer(){
        $this->errors = array();
        // Load request parameters
        $this->get_request();
        // Load map
        if(!$this->has_error()) {
             $this->load_map();
        }
    }

    /**
    * Run the server and sends data
    * @return string or void
    */
    function run(){
        // Process request
        if(!$this->has_error()) {
             $this->process_request();
        }
        if($this->has_error()){
            $this->send_errors();
        } else {
            $this->send_icon();
        }
     }


    /**
    * Process request
    */
    function process_request(){
        $layer = @$this->map_object->getLayerByName($this->typename);
        if(!$layer){
            $this->set_error('Layer not found ' . $layer_name, $layer_name);
            return false;
        }
        // Get class
        $class = null;
        for($i = 0; $i < $layer->numclasses; $i++){
            $_class = @$layer->getClass($i);
            if($this->classname == $_class->name){
                $class =& $_class;
                $this->classindex = $i;
                break;
            }
        }
        if(!$class){
            $this->set_error('Class name not found ' . $layer_name, $this->classname);
            return false;
        }
        // Get symbol size
        for($i = 0; $i < $class->numstyles; $i++){
            $_style = @$class->getStyle($i);
            if($_style->symbolname){
                // 64 pixel is standard Google Earth pushpin
                //$_style->set('size', 64);
                $symbolsize = $_style->size;
                break;
            }
        }
        // Provide a default here
        if(!$symbolsize) {
            $symbolsize = 10;
        }
        $ext = $this->map_object->extent;
        $centerx = ($ext->maxx - $ext->minx)/2;
        $centery = ($ext->maxy - $ext->miny)/2;

        // Create a new layer
        $this->icon_layer = ms_newLayerObj($this->map_object, $layer);
        $this->map_object->setSize($symbolsize, $symbolsize);
        $this->map_object->setExtent($centerx - $symbolsize, $centery - $symbolsize, $centerx + $symbolsize, $centery + $symbolsize);
        $this->icon_layer->set( 'status', MS_ON );
        $this->iconpoint = ms_newPointObj();
        $this->iconpoint->setXY($centerx, $centery);
    }

    /**
    * Test if has errors
    * @return boolean
    */
    function has_error(){
        return count($this->errors) > 0;
    }

    /**
    * Get all request parameters
    */
    function get_request(){
        $this->map      = $this->load_parm('map');
        $this->typename = $this->load_parm('typename');
        $this->classname= $this->load_parm('classname');
        if(!$this->map){
            $this->set_error('No mapfile specified');
        }
        if(!$this->typename){
            $this->set_error('No typename (layer) specified');
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

    /**
    * Set error message
    * @param string $message
    * @param string $layer name
    */
    function set_error($message, $layer = 'Error'){
        $this->errors[$layer][] = $message;
    }

    /**
    * Load the map and create the map instance
    */
    function load_map(){
        if(!file_exists($this->map) && is_readable($this->map)){
            $this->set_error('Cannot read mapfile '. $this->map);
        } else {
            $this->map_object = ms_newMapObj($this->map);
            if(!$this->map_object){
                $this->set_error('Cannot load mapfile '. $this->map);
            }
        }
    }

    function send_errors(){
        print_r($this->errors);
    }

    function send_icon(){
        header('Content-type:image/png');
        // Set transparency (needs imageformat RBGA in the mapfile too)
		$o = $this->map_object->outputformat;
		$o->set("transparent",MS_ON);		
        //$this->map_object->set('transparent', 'on');
        $img = $this->map_object->draw();
        $this->iconpoint->draw($this->map_object, $this->icon_layer, $img, $this->classindex, '');
        $img->saveImage('');
    }

}
?>