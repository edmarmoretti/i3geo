<?php
require_once("../../classesphp/pega_variaveis.php");
error_reporting(E_ALL);
session_name("i3GeoPHP");

if (isset($g_sid))
{session_id($g_sid);}
session_start();

foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}
$postgis_mapa = $_SESSION["postgis_mapa"];
if (!function_exists("ms_GetVersion"))
{
	$exts = get_loaded_extensions();
	if (array_search( "MapScript", $exts) != TRUE)
	{
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{
			if(!@dl('php_mapscript_48.dll'))
			dl('php_mapscript.dll');
		}
		else
		{dl('php_mapscript.so');}
	}
}
?>
<html>
<head>
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body bgcolor="white" style="background-color:white">
<p>
<?php
if (isset($_FILES['filedbf']['name']))
{
	//$ndir = dirname($filen);
	require_once ("../../ms_configura.php");
	$mapa = ms_newMapObj($map_file);
	echo "<p>Carregando o arquivo...</p>";
	$dirmap = dirname($map_file);
	//verifica nomes
	$statusNome = 1;
	//if( (ereg('[^a-zA-Z0-9áéíóúâôêãõ_\.\ \-]',$_FILES['filedbf']['name'])) || (!ereg('\.dbf$',$_FILES['filedbf']['name'])) )
	if( (ereg('[^a-zA-Z0-9áéíóúâôêãõ_\.\ \-]',$_FILES['filedbf']['name'])) )
	{$statusNome = 0;}
	if($statusNome != 1)
	{echo "Nome de arquivo inválido";exit;}
	//sobe arquivo
	$Arquivo = $_FILES['filedbf']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$_FILES['filedbf']['name']);
	if($status != 1)
	{echo "Ocorreu um erro no envio do arquivo";exit;}
	$nome = explode(".",$_FILES['filedbf']['name']);
	$nome = $nome[0];
	$nomeshp = $dirmap."/".$nome.".shp";
	if($status == 1)
	{
		if(!isset($tema)) //o arquivo deverá ser transformado em uma camada no mapa
		{
			$nomex = strtoupper($nomex);
			$nomey = strtoupper($nomey);
			//converte de csv para dbf
			if($tipoarquivo != "dbf"){
				if($tipoarquivo == "csvpv"){$separador = ";";}
				if($tipoarquivo == "csvv"){$separador = ",";}
				include_once("../../pacotes/classesphp/class.CSVHandler.php");
				include_once "../../pacotes/phpxbase/api_conversion.php";
				$csv = new CSVHandler($dirmap."/".$_FILES['filedbf']['name'],$separador,"record");
				$dados = $csv->ReadCSV();
				$conta = 0;
				foreach($csv->HeaderData as $i)
				{	
					$i = strtoupper($i);
					$i = trim($i);
					if(($i != $nomex) && ($i != $nomey))
					{
						$i = str_replace("_","",$i);
						$i = str_replace("-","",$i);
						$i= substr($i, 0, 7);
						$def[] = array($i.$conta,"C","255");
					}
					else
					$def[] = array($i,"C","255");
					$conta++;
				}
				$db = xbase_create($dirmap."/".$nome.".dbf", $def);
				//xbase_close($db);
				//$db=xbase_open($dirmap."/".$nome.".dbf",2);		
				foreach($dados as $d){
					$reg = array();
					foreach($d as $i)
					{$reg[] = $i;}
					xbase_add_record($db,$reg);	
				}
				xbase_close($db);
				$_FILES['filedbf']['name'] = $nome.".dbf";
			}
			echo "<p>Arquivo enviado. Criando shape file...</p>";
			require_once("../../pacotes/phpxbase/api_conversion.php");
			$dbf = xbase_open($dirmap."/".$_FILES['filedbf']['name']);
			$records = xbase_numrecords($dbf);
			$record = array();
			$novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_POINT);
			$novoshpf->free();
			$shapefileObj = ms_newShapefileObj($nomeshp,-2);
			for($x = 1; $x <= $records; $x++)
			{
    			$record = xbase_get_record_with_names($dbf, $x);
     			$poPoint = ms_newpointobj();
    			$poPoint->setXY($record[$nomex],$record[$nomey]);
    			$shapefileObj->addpoint($poPoint);
			}
			$shapefileObj->free();	
			$mapt = ms_newMapObj($temasaplic."/novotema.map");
			$novolayer = $mapt->getLayerByName("novotema");
			$novolayer->set("data",$nomeshp);
			$novolayer->set("name",basename($nomeshp));
			$novolayer->setmetadata("TEMA",basename($nomeshp));
			$novolayer->setmetadata("DOWNLOAD","SIM");
			$novolayer->setmetadata("TEMALOCAL","SIM");
			$novolayer->set("type",MS_LAYER_POINT);
			$novolayer->setfilter("");
			$classe = $novolayer->getclass(0);
			$estilo = $classe->getstyle(0);
			$estilo->set("symbolname","ponto");
			$estilo->set("size",6);
			// le os itens
			$novolayer->set("status",MS_DEFAULT);
			$abriu = $novolayer->open();
			$items = $novolayer->getItems();
			$fechou = $novolayer->close();
			if ($items != "")
			{
				$its = implode(",",$items);
				$novolayer->setmetadata("ITENS",$its);
				$novolayer->setmetadata("ITENSDESC",$its);
				$novolayer->set("template","none.htm");
			}
			if($epsg != "")
			{$novolayer->setProjection("init=epsg:".$epsg);}
			$adiciona = ms_newLayerObj($mapa, $novolayer);
			$salvo = $mapa->save($map_file);
			echo "Tema criado!!!";
			echo "<script>window.parent.remapaf()</script>";
		}
		else //join com um tema
		{
			//$layer = $mapa->getlayerbyname($tema);
			//essa funcao ainda não está implementada
			//
			$dbf = $dirmap."/".$_FILES['filedbf']['name'];
			$string = 'JOIN '."\n".' NAME "'.$_FILES['filedbf']['name'].'"'."\n";
			$string .= 'TABLE "'.$dbf.'"'."\n";
			$string .= 'FROM "'.$item.'"'."\n";
			$string .= 'TO "'.$colunadbf.'"'."\n";
			$string .= 'TYPE ONE-TO-ONE'."\n"." END"."\n";
			$string .= 'TEMPLATE "none.htm"'."\n";

			//$layer->updatefromstring($string);
			//$salvo = $mapa->save($map_file);
			include_once("../../classesphp/classe_mapa.php");
			$m = new Mapa($map_file,$locaplic);
			$m->insereJOIN($string,$tema);
			echo "Junção concluida!!!";			
		}
	}
	else
	{
		echo "<p>Erro ao enviar o arquivo.</p>";
		exit;
	}
}
?>
</body>
</html>