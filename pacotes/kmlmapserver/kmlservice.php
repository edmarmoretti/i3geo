<?php
/**
* KML server
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

http://10.1.1.34:80/i3geo/pacotes/kmlmapserver/kmlservice.php?map=bioma&typename=bioma&request=kml
*/
error_reporting(0);
set_time_limit(0);
//error_log($_SERVER['QUERY_STRING']);
//para o caso do mapa ser o que esta em uso
if(!empty($_GET["sid"])){
	session_name("i3GeoPHP");
	session_id($_GET["sid"]);
	session_start();
	$_GET["map"] = $_SESSION["map_file"];
	$_REQUEST["map"] = $_SESSION["map_file"];
}
include 'classes/kmlserver.class.php';
$server = new KmlServer();
?>
