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
require_once (__DIR__.'/TME_i3geo_DataConnector.php');
// Include engine class
require_once (__DIR__.'/TME_Engine.php');
//
//este programa pode ser incluido em outros que nao tenham sid aberto
//nesse caso e necessario forcar o uso e evitar o bloqueio do programa
//para isso, o programa que faz o include deve ter a variavel $verificaSID = false definida antes de fazer o include
//
if(!isset($verificaSID)){
	$verificaSID = true;
}
if(!isset($download)){
	$download = false;
}
if(!isset($_GET["sid"]) && $verificaSID == true)
{echo "Erro. Acesso não permitido";exit;}
if(!isset($dir_tmp)){
	include(__DIR__."/../../ms_configura.php");
}
$colunas = str_replace(","," ",$_GET["colunasvalor"]);
$colunas = explode(" ",$colunas);
if(!isset($parametersTME)){

	//choropleth,prism,bar,symbol
	$ano = "";
	$tipo = "slider";
	if(count($colunas) == 1){
		$ano = $colunas[0];
		$tipo = "year";
	}
	$parametersTME = array( 'mapType'        => 'bar',
	   			  	     'indicator'      => 'valores',
					     'year'           => $ano,
					     'classification' => 'equal',
						 'mapTitle' => $_GET["titulo"],
						 'timeType' => $tipo, //para mais de um ano, escolha slider ou series
						 'dirtmp' => $dir_tmp
	                   );
}
$dataConnector = new DataConnector($_GET["sid"],$verificaSID);
$dataStore = $dataConnector->getDataStore($_GET["nomelayer"],$colunas,$_GET["colunanomeregiao"],$_GET["titulo"],$_GET["descricao"],"");
// Create thematic map object
$map = new ThematicMap($dataStore, $parametersTME);

$file = $map->getKML($dataConnector->url,$download);
if(!$download){
	if(!function_exists("cpjson"))
	{require(__DIR__."/../../classesphp/funcoes_gerais.php");}
	cpjson(array('url' => $file));
}
//echo "<p><a href='$file'>$file</a>";
?>