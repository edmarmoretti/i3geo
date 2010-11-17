<?php
require_once("../../classesphp/pega_variaveis.php");
require_once("../../classesphp/funcoes_gerais.php");
include_once ("../../classesphp/carrega_ext.php");
session_name("i3GeoPHP");
if (isset($g_sid))
{session_id($g_sid);}
session_start();
foreach(array_keys($_SESSION) as $k)
{eval("\$".$k."='".$_SESSION[$k]."';");}
$postgis_mapa = $_SESSION["postgis_mapa"];
?>
<html>
<head>
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body name="ancora" bgcolor="white" style="background-color:white;text-align:left;">
<p>
<?php
if (isset($_FILES['i3GEOuploaddbffile']['name']))
{
	//$ndir = dirname($filen);
	require_once ("../../ms_configura.php");
	$mapa = ms_newMapObj($map_file);
	echo "<p>Carregando o arquivo...</p>";
	$dirmap = dirname($map_file);
	//verifica nomes
	verificaNome($_FILES['i3GEOuploaddbffile']['name']);
	//sobe arquivo
	$Arquivo = $_FILES['i3GEOuploaddbffile']['tmp_name'];
	$status =  move_uploaded_file($Arquivo,$dirmap."/".$_FILES['i3GEOuploaddbffile']['name']);
	if($status != 1)
	{echo "Ocorreu um erro no envio do arquivo";paraAguarde();exit;}
	$nome = explode(".",$_FILES['i3GEOuploaddbffile']['name']);
	$nome = $nome[0];
	$nomeshp = $dirmap."/".$nome.".shp";
	if($status == 1)
	{
		if(!isset($tema)) //o arquivo deverá ser transformado em uma camada no mapa
		{
			$nomex = strtoupper($i3GEOuploaddbfnomex);
			$nomey = strtoupper($i3GEOuploaddbfnomey);
			//converte de csv para dbf
			if($i3GEOuploaddbftipoarquivo != "dbf"){
				if($i3GEOuploaddbftipoarquivo == "csvpv"){$separador = ";";}
				if($i3GEOuploaddbftipoarquivo == "csvv"){$separador = ",";}
				include_once("../../pacotes/classesphp/class.CSVHandler.php");
				include_once "../../pacotes/phpxbase/api_conversion.php";
				$csv = new CSVHandler($dirmap."/".$_FILES['i3GEOuploaddbffile']['name'],$separador,"record");
				$dados = $csv->ReadCSV();
				$conta = 0;
				$xy = array();
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
					{$def[] = array($i,"C","255");}
					$conta++;
				}
				if(!function_exists("dbase_create"))
				{xbase_create($dirmap."/".$nome.".dbf", $def);}
				else
				{dbase_create($dirmap."/".$nome.".dbf", $def);}				
				$db=xbase_open($dirmap."/".$nome.".dbf",2);		
				foreach($dados as $d){
					$reg = array();
					foreach($d as $i)
					{$reg[] = $i;}
					xbase_add_record($db,$reg);	
				}
				xbase_close($db);
			}
			echo "<p>Arquivo enviado. Criando shape file...</p>";

			$novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_POINT);
			$novoshpf->free();
			$shapefileObj = ms_newShapefileObj($nomeshp,-2);
			if($i3GEOuploaddbftipoarquivo != "dbf")
			{
				foreach($dados as $d)
				{
					$poPoint = ms_newpointobj();
					$poPoint->setXY($d[$i3GEOuploaddbfnomex],$d[$i3GEOuploaddbfnomey]);
					$shapefileObj->addpoint($poPoint);
				}
			}
			else
			{
				require_once("../../pacotes/phpxbase/api_conversion.php");
				$dbf = xbase_open($dirmap."/".$_FILES['i3GEOuploaddbffile']['name']);
				$records = xbase_numrecords($dbf);
				$record = array();
				for($x = 1; $x <= $records; $x++)
				{
					$record = xbase_get_record_with_names($dbf, $x);
					$poPoint = ms_newpointobj();
					$poPoint->setXY($record[$nomex],$record[$nomey]);
					$shapefileObj->addpoint($poPoint);
				}
			}
			$shapefileObj->free();	
			$novolayer = ms_newLayerObj($mapa);
			$novolayer->set("data",$nomeshp);
			$novolayer->set("name",basename($nomeshp));
			$novolayer->setmetadata("TEMA",basename($nomeshp));
			$novolayer->setmetadata("DOWNLOAD","SIM");
			$novolayer->setmetadata("TEMALOCAL","SIM");
			$novolayer->setmetadata("CLASSE","SIM");
			$novolayer->setmetadata("TEXTO","NAO");			
			$novolayer->set("type",MS_LAYER_POINT);
			$novolayer->setfilter("");
			$classe = ms_newClassObj($novolayer);
			$estilo = ms_newStyleObj($classe);
			$estilo->color->setrgb(200,50,0);
			$estilo->outlinecolor->setrgb(0,0,0);
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
			if(isset($uploadEPSG) && $uploaddbfEPSG != "")
			{$novolayer->setProjection("init=epsg:".$uploaddbfEPSG);}
			$adiciona = ms_newLayerObj($mapa, $novolayer);
			$salvo = $mapa->save($map_file);
			echo "Tema criado!!!";
			echo "<script>window.parent.i3GEO.atualiza()</script>";
		}
	}
	else
	{
		echo "<p>Erro ao enviar o arquivo.</p>";
	}
}
paraAguarde();
function paraAguarde(){
	echo "<script>window.parent.i3GEOF.uploaddbf.aguarde.visibility='hidden';</script>";
}
function verificaNome($nome)
{
	$nome = strtolower($nome);
	$lista = explode(".",$nome);
	$extensao = $lista[count($lista) - 1];
	if(($extensao != "dbf") && ($extensao != "csv"))
	{
		echo "Nome de arquivo inválido";
		paraAguarde();
		exit;
	}
}
?>
</body>
</html>