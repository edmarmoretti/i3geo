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



// Set database access information as constants
// Should be stored outside of the Web directory
DEFINE ('DB_USER', 'myuser');
DEFINE ('DB_PASSWORD', 'mypass');
DEFINE ('DB_HOST', 'localhost');
DEFINE ('DB_NAME', 'tme');


class DataConnector
{
    public $featureTable = 'country_simpl';
    public $indicatorTable = 'indicator';
    public $valuesTable = 'indicator_values';

    private $dbc;

    // Constructor
    function __construct()
    {
        // Make the connection
        $this->dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die ("Could not connect to MySQL: " . mysqli_connect_error());
    }


    // Fetch all indicators
    function getIndicators(){
        $sql = 'SELECT id, name, description, source FROM indicator ORDER BY name';
        $result = $this->dbc->query($sql);

        // Loop thorough all indicators
        while($row = $result->fetch_row())
        {
            // Add values to array
            $indicators[] = array('id'          => $row[0],
                                  'name'        => $row[1],
                                  'description' => $row[2],
                                  'source'      => $row[3]);
        }

        // Make JSON encoded array
        $json = json_encode(array('indicators' => $indicators));
        return $json;
    }

    // Fetch all avaialbe years for one indicator
    function getIndicatorYears($indicatorID){
        $sql = "SELECT DISTINCT year FROM indicator_values WHERE variable=$indicatorID ORDER BY year";
        $result = $this->dbc->query($sql);

        // Loop thorough all years
        while($row = $result->fetch_row())
        {
            // Add values to array
            $years[] = array('year' => $row[0]);
        }

        // Make JSON encoded array
        $json = json_encode(array('years' => $years));
        return $json;
    }

    // Make data store
    function getDataStore($indicatorID, $year, $region){

        $sqlregion = '';
        if ($region) $sqlregion = "region = $region AND";

        $sqlyear = '';
        if ($year) $sqlyear = "AND year = $year";

    	// Add features - exclude Antarctica
    	$sql = "SELECT un AS featureID, name, lon, lat, AsText(geom) AS wkt
                FROM $this->featureTable
                WHERE $sqlregion un != 10
                ORDER BY featureID";

    	$features = $this->dbc->query($sql);
    	while($row = $features->fetch_array(MYSQLI_ASSOC))
    	{
    		// First field should be feature id
    		$featureID = array_shift($row);
    		// Add feature to dataStore
    		$dataStore['features'][$featureID] = $row;
    	}


    		$indicatorYears = array();

            // Select indicator metadata
    		$sql = "SELECT name, description, source, decimals,
                        (SELECT ROUND(MAX(value),decimals) FROM indicator_values, $this->featureTable WHERE variable=$indicatorID AND indicator_values.area=un $sqlyear) AS max,
                        (SELECT ROUND(MIN(value),decimals) FROM indicator_values, $this->featureTable WHERE variable=$indicatorID AND indicator_values.area=un $sqlyear) AS min
                    FROM $this->indicatorTable
                    WHERE id=$indicatorID";

    		$result = $this->dbc->query($sql);
    		$indicator = $result->fetch_assoc();
    		$precision = $indicator['decimals'];

    		// Add indicator to dataStore
    		$dataStore['indicators'][$indicatorID] = $indicator;

    		// Select indicator values (only values that have features)
    		$sql = "SELECT indvalues.area AS featureID, indvalues.year, indvalues.value
                    FROM $this->valuesTable AS indvalues, $this->featureTable
                    WHERE indvalues.variable=$indicatorID
                    AND indvalues.area=un
                    $sqlyear
                    ORDER BY indvalues.value"; // Needed for qunatiles calculation

            $result = $this->dbc->query($sql);

    		// Add indicator values to dataStore
    		while($row = $result->fetch_row())
    		{
                $dataStore['indicators'][$indicatorID]['values'][$row[1]][$row[0]] = number_format($row[2], $precision, '.', '');

                // Find all years with values (could also be a separate sql for better performance)
                $indicatorYears[$row[1]] = $row[1];
    		}
            sort($indicatorYears);
    		$dataStore['indicators'][$indicatorID]['years'] = $indicatorYears;


    	return $dataStore;
    }
}


?>