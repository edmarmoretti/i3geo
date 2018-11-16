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
//adaptado para o i3Geo por Edmar Moretti



// Set database access information as constants
// Should be stored outside of the Web directory
//DEFINE ('DB_USER', 'myuser');
//DEFINE ('DB_PASSWORD', 'mypass');
//DEFINE ('DB_HOST', 'localhost');
//DEFINE ('DB_NAME', 'tme');


class DataConnector
{
    public $featureTable = 'country_simpl';
    public $indicatorTable = 'indicator';
    public $valuesTable = 'indicator_values';
	public $map_file;
	public $postgis_mapa;
	public $url;
    private $dbc;

    // Constructor
    function __construct($sid,$verificaSID = true)
    {
		if (!function_exists('ms_GetVersion'))
		{
			if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
			{
				if(!@dl('php_mapscript_48.dll'))
				dl('php_mapscript.dll');
			}
			else
			{dl('php_mapscript.so');}
		}
		//include("../../classesphp/carrega_ext.php");
		//verifica��o de seguran�a
		if($verificaSID == true){
			$_SESSION = array();
			session_name("i3GeoPHP");
			session_id($sid);
			session_start([
			    'read_and_close' => true
			]);
			if(@$_SESSION["fingerprint"])
			{
				$f = explode(",",$_SESSION["fingerprint"]);
				if (md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id()) != $f[0] && !in_array($_GET["telaR"],$f) )
				{exit;}
			}
			else
			{exit;}
		}
		if(!isset($_SESSION["map_file"]))
		{exit;}
		$this->map_file = $_SESSION["map_file"];
		$this->postgis_mapa = $_SESSION["postgis_mapa"];
		$this->url = $_SESSION["tmpurl"];
		$this->ext = $_SESSION["mapext"];
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
    function getDataStore($nomelayer,$colunasvalor,$colunanomeregiao,$titulo,$descricao,$ext="",$mapType=""){ //$indicatorID, $year, $region){
    	if(!function_exists("versao")){
    		include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
    	}

		$versao = versao();
		$versao = $versao["principal"];
		$mapa = ms_newMapObj($this->map_file);

		if($ext == "")
		{$mapa = extPadrao($mapa);}
		else{
			$e = str_replace(","," ",$ext);
			$e = explode(" ",$ext);
			$extatual = $mapa->extent;
			$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
		}
		$layer = $mapa->getlayerbyname($nomelayer);
		$layer->set("template","none.html");
		$existesel = "nao";
		if (($this->postgis_mapa != "") && ($this->postgis_mapa != " "))
		{
			if ($layer->connectiontype == MS_POSTGIS)
			{
				$lcon = $layer->connection;
				if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($this->postgis_mapa))))
				{
					if(($lcon == " ") || ($lcon == ""))
					{$layer->set("connection",$this->postgis_mapa);}
					else
					{$layer->set("connection",$this->postgis_mapa[$lcon]);}
				}
			}
		}

		$itens = pegaItens($layer,$mapa);
		carregaquery2($this->map_file,$layer,$mapa);
		if ($layer->getNumresults() > 0){$existesel = "sim";}
		if ($existesel == "nao")
		{$layer->querybyrect($mapa->extent);}
		$layer->open();
		$res_count = $layer->getNumresults();
		$dataStore = array();
		$dataStore['indicators']['valores'] = array(
			"name"=>$titulo,
			"description"=>$descricao,
			"source"=>"",
			"decimals"=>2,
			"max"=>0,
			"min"=>0
		);
		for ($i = 0; $i < $res_count; $i++)
		{
			$valitem = array();
			if($versao >= 6)
			{$shape = $layer->getShape($layer->getResult($i));}
			else{$shape = $layer->getFeature($layer->getResult($i)->shapeindex);}
			$pt = $shape->getCentroid();
			$texto = $shape->values[$colunanomeregiao];
			/*
			if(!mb_detect_encoding($texto,"ISO-8859-1",true)){
				$texto = mb_convert_encoding($texto,"ISO-8859-1","UTF-8");
			}
			*/
			if($mapType == "bar"){
				$wkt = "";
			}
			else{
				$wkt = $shape->toWkt();
			}
			$dataStore['features'][$i] = array(
				"featureID"=>$i,
				"name"=>$texto,
				"lon"=>round($pt->x,6),
				"lat"=>round($pt->y,6),
				"wkt"=>$wkt
			);
			//[0] � o ano
			foreach($colunasvalor as $colunavalor){
				$valor = $shape->values[$colunavalor];

				settype($valor,"float");
				//echo $valor;
				if(is_numeric($valor)){
					$valor = number_format($valor, 2, '.', '');
					$dataStore['indicators']['valores']['values'][$colunavalor][$i] = $valor;
					$indicatorYears[$colunavalor] = $colunavalor;
					$todosV[] = $valor;
				}
			}
		}
		$fechou = $layer->close();
		$dataStore['indicators']['valores']['years'] = $indicatorYears;
		$dataStore['indicators']['valores']['max'] = max($todosV);
		$dataStore['indicators']['valores']['min'] = min($todosV);
		//echo "<pre>";
		//var_dump($dataStore);
		return $dataStore;
        /*
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
		*/
    }
}


?>
