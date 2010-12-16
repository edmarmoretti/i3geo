<?php
//
// SOFTWARE NAME: Thematic Mapping Engine
// SOFTWARE RELEASE: 1.6
// COPYRIGHT NOTICE: Copyright (C) 2008 Bjorn Sandvik,
//                   bjorn@thematicmapping.org
// SOFTWARE LICENSE: GNU General Public License version 3 (GPLv3)
// NOTICE: >
//  This program is free software; you can redistribute it and/or
//  modify it under the terms of version 3 of the GNU General
//  Public License as published by the Free Software Foundation.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU General Public License for more details.
//  http://www.gnu.org/licenses/
//
//


// This file shows how maps can be created with the DataConnector
// and ThematicMap classes.


// Can be changed to another data connector class
require_once ('TME_MySQL_DataConnector.php');

// Include engine class
require_once ('TME_Engine.php');

$dataConnector = new DataConnector();
$dataStore = $dataConnector->getDataStore(1230, 2005, 0); // indicator / year / region

$parameters = array( 'mapType'        => 'prism',
   			  	     'indicator'      => 1230,
				     'year'           => 2005,
				     'classification' => 'equal',
                   );

// Create thematic map object
$map = new ThematicMap($dataStore, $parameters);
$file = $map->getKML();

echo "<p><a href='$file'>$file</a>";

?>