<?php
require_once("../../classesphp/pega_variaveis.php");
require_once("../../classesphp/funcoes_gerais.php");
include_once ("../../classesphp/carrega_ext.php");
error_reporting(E_ALL);
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
<body bgcolor="white" style="background-color:white">
<p>

<?php
if (isset($_FILES['i3GEOcarregamapafilemap']['name']))
{
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	$dirmap = $dir_tmp;
	$Arquivo = $_FILES['i3GEOcarregamapafilemap']['name'];
	verificaNome($Arquivo);
	/*
	$statusNome = 1;
	if( (ereg('[^a-zA-Z0-9\.]',$Arquivo)) || (!ereg('\.map$',$Arquivo)) )
	{$statusNome = 0;}
	if($statusNome != 1)
	{echo "<p class='paragrafo' >Arquivo inválido.!";paraAguarde();exit;}	
	*/
	$nome = basename($Arquivo);
	$arqtemp = $dirmap."/".$Arquivo;
	$status =  move_uploaded_file($_FILES['i3GEOcarregamapafilemap']['tmp_name'],$dirmap."/".$Arquivo);
	if($status != 1)
	{echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo";paraAguarde();exit;}
	if($status == 1)
	{
		echo "<p class='paragrafo' >Arquivo enviado. Verificando o mapa...</p>";
		substituiCon($map_file,$postgis_mapa);
		substituiCon($dirmap."/".$Arquivo,$postgis_mapa);
		$mapt = ms_newMapObj($dirmap."/".$Arquivo);
		$map = ms_newMapObj($map_file);
		//apaga os layers do mapa atual
		$numlayers = $map->numlayers;
		for ($i=0;$i < $numlayers;$i++)
		{
			$layer = $map->getlayer($i);
			$layer->set("status",MS_DELETE);
		}
		$map->save($map_file);
		$img = $map->draw();
		$numlayers = $mapt->numlayers;
		for ($i=0;$i < $numlayers;$i++)
		{
			$layer = $mapt->getlayer($i);
			ms_newLayerObj($map, $layer);
			$layertemp = $map->getlayerbyname($layer->name);
			$st = $layertemp->status;
			$layertemp->set("status",MS_DEFAULT);
			$testa = $layertemp->draw($img);
			$layertemp->set("status",$st);
			if ($testa == 1)
			{
				echo "<p class='paragrafo' >Problemas em ".($layer->name).". Removido.</p><br>";
				$layertemp->set("status",MS_DELETE);
			}
		}
		$map->save($map_file);
		$e = $mapt->extent;
		$extatual = $e->minx." ".$e->miny." ".$e->maxx." ".$e->maxy;
		echo "<p class='paragrafo' >Ok. redesenhando.";
		echo "<script>window.parent.i3GEO.atualiza();</script>";
		echo "<script>window.parent.i3GEO.navega.zoomExt(window.parent.i3GEO.configura.locaplic,window.parent.i3GEO.configura.sid,'nenhum','".$extatual."');</script>";
		
	}
	else
	{echo "<p class='paragrafo' >Erro ao enviar o arquivo.";}
}
else
{echo "<p class='paragrafo' >Erro ao enviar o arquivo.";}
paraAguarde();
function paraAguarde(){
	echo "<script>window.parent.i3GEOF.carregaMapa.aguarde.visibility='hidden';</script>";
}
function verificaNome($nome)
{
	$nome = strtolower($nome);
	$lista = explode(".",$nome);
	$extensao = $lista[count($lista) - 1];
	if($extensao != "map")
	{
		echo "Nome de arquivo inválido";
		paraAguarde();
		exit;
	}
}
?>
</body>
</html>