<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<style>
div {left: 0px;}
body 
{COLOR: #2F4632;text-align: justify;font-size: 12px;font-family: Verdana, Arial, Helvetica, sans-serif;}
</style>
<link rel="stylesheet" type="text/css" href="admin/html/admin.css">

<title></title>
</head>
<body class=" yui-skin-sam fundoPonto" style="overflow:auto" >
<center>
<div class="bordaSuperior"  >&nbsp;</div>
<div class="mascaraPrincipal" id="divGeral">
<script>
if(screen.availWidth > 700)
{document.getElementById("divGeral").style.width = "700px";}
</script>
<?php
/*
Title: geraminiatura.php

Gera as miniaturas dos mapas baseado nos mapfiles existentes em i3geo/temas. As miniaturas são utilizadas no i3geo na guia temas para mostrar um preview de cada tema.

Por padrão, as imagens são armazenadas no diretório temporário do i3geo e devem ser movidas para o diretório i3geo/temas/miniaturas 
para poderem ser utilizadas. O programa verifica se a miniatura já existe no diretório temas/miniaturas e gera apenas as que faltarem.

É utilizado também como um include pelo sistema de administração, permitindo armazenar as miniaturas no local correto.

Licenca:

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Colaboração: Luis Henrique Weirich de Matos

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo: i3geo/geraminiatura.php

Exemplo:

geraminiatura.php?tipo=mini

Parametro:

tipo - tipo de retorno mini|grande|todos
*/
//clearstatcache();
error_reporting(E_ALL);
//set_time_limit(300);
//ini_set('max_execution_time', 300);
//
//carrega o phpmapscript
//
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
//para o caso de ser feito um include desse programa
if(!isset($locaplic))
{$locaplic = "";}
include($locaplic."/ms_configura.php");
if(!function_exists("versao"))
{include($locaplic."/classesphp/funcoes_gerais.php");}
require_once($locaplic."/classesphp/pega_variaveis.php");
include_once ($locaplic."/classesphp/carrega_ext.php");
$versao = versao();
$versao = $versao["principal"];
//
//no caso do programa ser utilizado via URL
//
if(!isset($tipo))
{$tipo = "";}
if($tipo == "mini" || $tipo == "todos" || $tipo == "grande" || $tipo == "")
{
	ms_ResetErrorList();
	if (!isset($tipo) || $tipo == "")
	{
		echo "Utilize geraminiatura.php?tipo=mini ou grande ou todos. As imagens são armazenadas no diretório temporário.";
		echo "<br>Após geradas as imagens, copie os arquivos para o diretório i3geo/temas/miniaturas.";
		echo "<br>As miniaturas são geradas apenas para os arquivos que ainda não existem no diretório temas/miniaturas.";
		echo "<br><a href='geraminiatura.php?tipo=todos' >Gerar todas as miniaturas</a>";
		echo "<br><a href='geraminiatura.php?tipo=mini' >Gerar apenas as pequenas</a>";
		echo "<br><a href='geraminiatura.php?tipo=grande' >Gerar apenas as grandes</a>";
		echo "</div></body></html>";
		exit;
	}
	error_reporting(E_ALL);
	$arqs = listaArquivos("temas");
	ob_start();
	foreach ($arqs["arquivos"] as $arq)
	{
		$temp = explode(".",$arq);
		if($temp[(count($temp) - 1)] == "map")
		{
			//if(file_exists($locaplic.'/temas/miniaturas/'.$arq.'.mini.png') == false)
			//echo $locaplic.'/temas/miniaturas/'.$arq.'.mini.png<br>';
			if($tipo == "mini" || $tipo == "todos")
			{if(!file_exists($locaplic.'/temas/miniaturas/'.$arq.'.mini.png')){echo "<br>".$arq."<br>";verificaMiniatura($arq,"mini");}}
			if($tipo == "grande"  || $tipo == "todos")
			{if(!file_exists($locaplic.'/temas/miniaturas/'.$arq.'.grande.png')){echo "<br>".$arq."<br>";verificaMiniatura($arq,"grande");}}
		}
		ob_end_flush();
		ob_flush();
		flush();
		ob_start(); 
	}
}
//
//se tipo for igual a "admin", as imagens são gravadas em i3geo/temas/miniaturas
//
function verificaMiniatura($map,$tipo,$admin=false)
{
	global $locaplic,$versao,$base;
	if($versao == ""){
		$versao = versao();
		$versao = $versao["principal"];	
	}
	//echo $map."<br>";return;
	ms_ResetErrorList();
	$tema = "";
	$map = str_replace("\\","/",$map);
	$map = basename($map);
	if (file_exists($locaplic.'/temas/'.$map))
	{$tema = $locaplic.'/temas/'.$map;}
	if (file_exists($locaplic.'/temas/'.$map.'.map'))
	{$tema = $locaplic.'/temas/'.$map.".map";}
	if ($tema != "")
	{
		if(isset($base) && $base != ""){
			if(file_exists($base))
			{$f = $base;}
			else
			{$f = $locaplic."/aplicmap/".$base.".map";}
			if(!file_exists($base)){
				echo "<span style=color:red >ARQUIVO $base NÂO FOI ENCONTRADO. CORRIJA ISSO EM ms_configura.php";
				exit;
			}
		}
		else
		{
			$f = "";
			if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
			{$f = $locaplic."/aplicmap/geral1windowsv".$versao.".map";}
			else
			{
				if($f == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
					$f = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
				}
				if($f == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
					$f = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
				}
				if($f == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
					$f = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
				}
				if($f == "")
				{$f = $locaplic."/aplicmap/geral1v".$versao.".map";}
			}
		}
		$mapa = ms_newMapObj($f);
		if(@ms_newMapObj($tema))
		{$nmapa = ms_newMapObj($tema);}
		else
		{
			echo "erro no arquivo $tema <br>";
			return;
		}
		$temasn = $nmapa->getAllLayerNames();
		$dados = "";
		foreach ($temasn as $teman)
		{
			$layern = $nmapa->getLayerByName($teman);
			$layern->set("status",MS_DEFAULT);
			ms_newLayerObj($mapa, $layern);
			autoClasses($layern,$mapa,$locaplic);
			if ($layern->data == "")
			{$dados = $layern->connection;}
			else
			{$dados = $layern->data;}
			$pegarext = $teman;	
		}
		if (isset($postgis_mapa))
		{
			if ($postgis_mapa != "")
			{
				$numlayers = $mapa->numlayers;
				for ($i=0;$i < $numlayers;++$i)
				{
					$layer = $mapa->getlayer($i);
					if ($layer->connectiontype == MS_POSTGIS)
					{
						if ($layer->connection == " ")
						{
							$layer->set("connection",$postgis_mapa);
						}
					}
				}
			}
		}	
		zoomTemaMiniatura($pegarext,$mapa);
		if ($tipo == "mini"  || $tipo == "todos")
		{	
			$mapa->setsize(50,50);
			$sca = $mapa->scalebar;
			$sca->set("status",MS_OFF);
			$objImagemM = @$mapa->draw();
			//if ($objImagemM == "" || $objImagemM == MS_FAILURE)
			//{echo "Problemas ao gerar o mapa<br>";return;}
			$weboM = $mapa->web;
			$urlM = $weboM->imageurl."/".$map;
		}
		if ($tipo == "grande"  || $tipo == "todos")
		{
		 	$mapa->setsize(300,300);
			$sca = $mapa->scalebar;
			$sca->set("status",MS_OFF);
			$objImagemG = @$mapa->draw();
			//if ($objImagemG == "" || $objImagemG == MS_FAILURE)
			//{echo "Problemas ao gerar o mapa<br>";return;}
			$weboG = $mapa->web;
			$urlG = $weboG->imageurl."/".$map;
		}
		if($tipo=="mini" || $tipo == "todos")
		{
			if($objImagemM->imagepath == "")
			{echo "Erro IMAGEPATH vazio";return;}			
			$nomecM = ($objImagemM->imagepath).$map.".mini.png";
			$objImagemM->saveImage($nomecM);
		}
		if($tipo=="grande" || $tipo == "todos")
		{
			if($objImagemG->imagepath == "")
			{echo "Erro IMAGEPATH vazio";return;}			
			$nomecG = ($objImagemG->imagepath).$map.".grande.png";
			$objImagemG->saveImage($nomecG);
		}

		if($admin == false)
		{
			if($tipo=="mini" || $tipo == "todos")
			{echo "<br><img src='".$urlM.".mini.png' /><br>";}
			if($tipo=="grande" || $tipo == "todos")
			{echo "<br><img src='".$urlG.".grande.png' /><br>";}
		}
		//
		//copia a imagem
		//
		if($admin == true)
		{
			$dir = $locaplic."/temas/miniaturas";
			$mini = $dir."/".$map.".map.mini.png";
			$grande = $dir."/".$map.".map.grande.png";
			if(file_exists($mini))
			{unlink($mini);}
			if(file_exists($grande))
			{unlink($grande);}
			copy(($objImagemG->imagepath).$map.".grande.png",$grande);
			copy(($objImagemM->imagepath).$map.".mini.png",$mini);
		}
	}
}
function zoomTemaMiniatura($nomelayer,&$mapa)
{
	$layer = $mapa->getlayerbyname($nomelayer);
	if($layer->data == "" && $layer->connection == "")
	{return;}
	if($layer->type > 2)
	{return;}
	$prjMapa = $mapa->getProjection();
	$prjTema = $layer->getProjection();
	$extatual = $mapa->extent;
	$ret = $layer->getmetadata("extensao");
	$ct = $layer->connectiontype;
	if(($ret == "") && ($ct != 1))
	{return;}
	if ($ret == "")
	{
		$ret = $layer->getextent();
		if(!$ret){return;}
		//reprojeta o retangulo
		if (($prjTema != "") && ($prjMapa != $prjTema))
		{
			$projInObj = ms_newprojectionobj($prjTema);
			$projOutObj = ms_newprojectionobj($prjMapa);
			$ret->project($projInObj, $projOutObj);
		}
		$extatual->setextent($ret->minx,$ret->miny,$ret->maxx,$ret->maxy);
	}
	else
	{
		$ret = explode(" ",$ret);
		$extatual->setextent($ret[0],$ret[1],$ret[2],$ret[3]);
	}
}
?>
</div></body></html>