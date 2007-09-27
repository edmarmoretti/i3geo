<html>
<head>
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body bgcolor="white" style="background-color:white">
<p>
<?php
/*
About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/

require_once("../../classesphp/pega_variaveis.php");
require_once("../../classesphp/funcoes_gerais.php");
error_reporting(0);
session_name("i3GeoPHP");
if (isset($g_sid))
{session_id($g_sid);}
session_start();
foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}
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
if (isset($_FILES['filemap']['name']))
{
	echo "<p>Carregando o arquivo...</p>";
	$dirmap = $dir_tmp;
	$Arquivo = $_FILES['filemap']['name'];
	$statusNome = 1;
	if( (ereg('[^a-zA-Z0-9\.]',$nome)) || (!ereg('\.map$',$_FILES['filemap']['name'])) )
	{$statusNome = 0;}
	if($statusNome != 1)
	{echo "Arquivo inválido.!";exit;}	
	$nome = basename($Arquivo);
	$arqtemp = $dirmap."/".$Arquivo;
	$status =  move_uploaded_file($_FILES['filemap']['tmp_name'],$dirmap."/".$Arquivo);
	if($status != 1)
	{echo "Ocorreu um erro no envio do arquivo";exit;}
	if($status == 1)
	{
		echo "<p>Arquivo enviado. Verificando o mapa...</p>";
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
				echo "<p style='color:red'>Problemas em ".($layer->name).". Removido.</p><br>";
				$layertemp->set("status",MS_DELETE);
			}
		}
		$map->save($map_file);
		echo "Ok. redesenhando.";
		echo "<script>window.parent.remapaf()</script>";
	}
	else
	{
		echo "Erro ao enviar o arquivo.";
		exit;
	}
}
else
{
	echo "Erro ao enviar o arquivo.";
}
?>
</body>
</html>