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


// Can be changed to another data connector class
require_once ('TME_MySQL_DataConnector.php');

// Check if a task is specified
if (isset($_REQUEST['task'])) {

    // Make connection object
    $dataConnector = new DataConnector();

    // Check which task
    switch ($_REQUEST['task']) {


        // Fetch all statistical indicators in database
        case 'indicators':
            // Returns JSON encoded array of indicators
            echo $dataConnector->getIndicators();
            break;


        // Fetch available years for one indicator
        case 'indYears':
            $indicatorID = (int)$_REQUEST['id']; // Avoid exploitation
            // Returns JSON encoded array of available years for one indicator
            echo $dataConnector->getIndicatorYears($indicatorID);
            break;


        case 'makeKMZ':
            // Include engine class
            require_once ('TME_Engine.php');

            $year = 0;      // 0 = All years
            $region = 0;    // 0 = All regions

            // Get indicator ID
            $indicatorID = (int)$_REQUEST['indicator'];

            // Check if one year or time series
            if ($_REQUEST['timeType'] == 'year') $year = $_REQUEST['year'];

            // Create data store
            $dataStore = $dataConnector->getDataStore($indicatorID, $year, $region);

            // Create thematic map object
            $map = new ThematicMap($dataStore, $_REQUEST);

            // Create KML
            $file = $map->getKML();

            // Return JSON with file url
            echo "{success: true, file: '$file'}";
    }
}


?>
