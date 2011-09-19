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
//adaptado para o i3Geo por Edmar Moretti

// This file shows how maps can be created with the DataConnector
// and ThematicMap classes.


// Can be changed to another data connector class
require_once ('TME_i3geo_DataConnector.php');

// Include engine class
require_once ('TME_Engine.php');
if(!isset($_GET["sid"]))
{echo "Erro. Acesso não permitido";exit;}
$dataConnector = new DataConnector($_GET["sid"]);
$colunas = str_replace(","," ",$_GET["colunasvalor"]);
$colunas = explode(" ",$colunas);
$dataStore = $dataConnector->getDataStore($_GET["nomelayer"],$colunas,$_GET["colunanomeregiao"],$_GET["titulo"],$_GET["descricao"],"");
//choropleth,prism,bar,symbol
$ano = "";
$tipo = "slider";
if(count($colunas) == 1){
	$ano = $colunas[0];
	$tipo = "year";
}
if(!isset($dir_tmp)){
	include("../../ms_configura.php");
}
$parameters = array( 'mapType'        => 'bar',
   			  	     'indicator'      => 'valores',
				     'year'           => $ano,
				     'classification' => 'equal',
					 'mapTitle' => $_GET["titulo"],
					 'timeType' => $tipo, //para mais de um ano, escolha slider ou series
					 'dirtmp' => $dir_tmp
                   );

// Create thematic map object
$map = new ThematicMap($dataStore, $parameters);
$file = $map->getKML($dataConnector->url);
if(!function_exists("cpjson"))
{require("../../classesphp/funcoes_gerais.php");}

cpjson(array('url' => $file));
//echo "<p><a href='$file'>$file</a>";

?>