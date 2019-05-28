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
$_GET = array_merge($_GET,$_POST);

// Can be changed to another data connector class
require_once (dirname(__FILE__).'/TME_i3geo_DataConnector.php');
// Include engine class
require_once (dirname(__FILE__).'/TME_Engine.php');
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
{
	echo "Erro. Acesso n&atilde;o permitido";exit;
}
if(!isset($dir_tmp)){
	include(dirname(__FILE__)."/../../ms_configura.php");
}
$colunas = str_replace(","," ",$_GET["colunasvalor"]);
$colunas = explode(" ",$colunas);
$barSize = $_GET["barSize"]*1;
$maxHeight = $_GET["maxHeight"]*1;
if(!isset($parametersTME)){

	//choropleth,prism,bar,symbol
	$ano = "";
	$tipo = "slider";
	if(count($colunas) == 1){
		$ano = $colunas[0];
		$tipo = "year";
	}
	if(empty($barSize)){
		$barSize = 5000;
	}
	if(empty($maxHeight)){
		$maxHeight = 2000000;
	}
	$parametersTME = array( 'mapType' => 'bar',
			'indicator' => 'valores',
			'year' => $ano,
			'classification' => 'quantile',
			'mapTitle' => $_GET["titulo"],
			'timeType' => $tipo, //para mais de um ano, escolha slider ou series
			'dirtmp' => $dir_tmp,
			'barSize'=> $barSize,
			'maxHeight' => $maxHeight,
			'outlinecolor' => $_GET["outlinecolor"],
			'numvertices' => $_GET["numvertices"],
			'symbolType' => 'polygon'
	);
}

$nomeTemp = array_merge($_GET,$_POST);
$nomeTemp = md5(implode("",$nomeTemp));

$nomeFile = $dir_tmp."/tme".$nomeTemp.".kmz";

//sesion e aberto com isso
$dataConnector = new DataConnector($_GET["sid"],$verificaSID);

if(!file_exists($nomeFile)){
	$dataStore = $dataConnector->getDataStore($_GET["nomelayer"],$colunas,$_GET["colunanomeregiao"],$_GET["titulo"],$_GET["descricao"],"",$parametersTME["mapType"]);
}
else{
	$dataStore = "";
}
$url = $_SESSION["tmpurl"]."/tme".$nomeTemp.".kmz";
// Create thematic map object

$map = new ThematicMap($dataStore, $parametersTME, $nomeTemp);

$file = $map->getKML($dataConnector->url,$download,$nomeFile);

$nomeArquivo = $map->nomeArquivo;

$legenda = str_replace("kmz","png",$nomeArquivo);
$legenda = str_replace("tme","legend",$legenda);
//$legenda = str_replace(basename($nomeArquivo),$legenda,$file);

if (isset($inclusao) && $inclusao == true){
	$download = true;
}
if(!$download){
	if(!file_exists($nomeArquivo)){
	    $_SESSION["downloadTmeKml"] = "";
	    $_SESSION["downloadTmeKmz"] = "";
	    $_SESSION["downloadTmeLegenda"] = "";
	    session_write_close();
	    header("HTTP/1.1 500 erro ao gerar arquivo");
		exit;
	}
	$_SESSION["downloadTmeKmz"] = $nomeArquivo;
	$_SESSION["downloadTmeKml"] = str_replace(".kmz",".kml",$nomeArquivo);
	$_SESSION["downloadTmeLegenda"] = $legenda;
	return true;
}
?>