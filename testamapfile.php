<?php
/*
Title: Testa um mapfile

Permite testar um mapfile específico existente no diretório "temas" ou gerar uma imagem miniatura.

As miniaturas são utilizadas na árvore de temas mostrada na opção "adiciona", existente na interface padrão.
Quando o usuário passa o mouse sobre a palavra "miniatura" é executado o programa de geração de miniaturas. Caso o
a miniatura tiver sido gerada previamente, a preferência é por esse arquivo em cahce. Isso permite uma performance melhor,
uma vez que a geração on-line pode ser muito demorada. Para gerar as miniaturas o administrador deve executar o
programa geraminiatura.php.

Licenca:

GPL2

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

Arquivo:

i3geo/testamapfile.php

Exemplos:

testamapfile.php?map=bioma

testamapfile.php?map=bioma&tipo=mini

Parametros:

map {string} - Nome do mapfile que será testado ou usado na geração da miniatura. O arquivo é procurado no caminho indicado e no diretório i3geo/temas. Se map=todos, todos os mapas são testados em grupos de 10 em 10 e a miniatura não é gerada.

tipo {string} - (opcional) mini|grande Define o tamanho da imagem que será gerada. Se não for definido, será feito o teste do mapfile. Controla o tamanho da miniatura que deverá ser mostrada.
*/
set_time_limit(300);
ini_set('max_execution_time', 300);
include("ms_configura.php");
include("classesphp/funcoes_gerais.php");
require_once("classesphp/pega_variaveis.php");
include_once ("classesphp/carrega_ext.php");

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
$versao = versao();
$versao = $versao["principal"];
ms_ResetErrorList();
if(!isset($tipo))
{$tipo = "";}
$arqs = listaArquivos("temas");
sort($arqs["arquivos"]);

if ($tipo == "")
{
	echo '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
	echo '<html><head><META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">';
	echo '<link rel="stylesheet" type="text/css" href="admin/html/admin.css">';
	echo '<style>body {COLOR: #2F4632;text-align: justify;font-size: 12px;font-family: Verdana, Arial, Helvetica, sans-serif;}</style>';

	echo '</head><script>function roda(){window.location.href = "?map="+document.getElementById("nomemap").value;}</script>';
	echo '<body class="fundoPonto"><center><div class="bordaSuperior"  >&nbsp;</div><div class="mascaraPrincipal" id="divGeral">';
	echo '<form action="testamapfile.php" method="post" id=f >';
	echo 'Nome do arquivo map existente no diretório i3geo/temas. Exemplo para uso manual da URL: testamapfile.php?map=biomashp (utilize "testamapfile.php?map=todos" na URL para testar todos de uma só vez)<br><br>';
	echo '<br>Mostra apenas a legenda? <input type=radio name=solegenda value=sim />sim <input type=radio name=solegenda value=nao CHECKED /> não<br>';
	$combo = "<br><select onchange='roda()' id=nomemap ><option value=''>Escolha o arquivo para testar</option>";
	foreach ($arqs["arquivos"] as $arq){
		$temp = explode(".",$arq);
		if($temp[1] == "map"){
			$combo .= "<option value='".$temp[0]."'>".$temp[0]."</option>";
		}
	}
	echo $combo."</select></form><br>";
}
if (isset($map) && $map != "")
{
	if(!isset($solegenda)){$solegenda = "nao";}
	if ($map == "todos")
	{
		$tipo = "todos";	
		$conta = 0;
		echo "<br>Número de mapas = ".(count($arqs["arquivos"]))." Faltam= ".(count($arqs["arquivos"])-$iniciar-10)."<br>";
		if (!isset($iniciar)){$iniciar = 0;}
		foreach ($arqs["arquivos"] as $arq)
		{
			if (($conta >= $iniciar) && ($conta < $iniciar+10))
			{
				$temp = explode(".",$arq);
				if($temp[1] == "map")
				verifica($arq,$solegenda);
				else
				{echo "<br>Arquivo <i>$map</i> não é válido. <br>";}
			}
			$conta++;
		}
		echo "<hr><br><br><a href='testamapfile.php?map=todos&iniciar=".($iniciar+10)."' >Próximos mapas</a>";
	}
	else
	{verifica($map,$solegenda);}	
}
echo '</div>';
echo '<script>if(screen.availWidth > 700){document.getElementById("divGeral").style.width = "700px";}</script>';
echo '</body></html>';
function verifica($map,$solegenda)
{
	global $tipo,$locaplic,$postgis_mapa,$versao,$base;
	$mapUrl = $map;
	if ($tipo == "mini" && file_exists('temas/miniaturas/'.$map.".mini.png"))
	{
		Header("Content-type: image/png");
		ImagePng(ImageCreateFromPNG('temas/miniaturas/'.$map.".mini.png"));
		exit;		
	}
	if ($tipo == "grande" && file_exists('temas/miniaturas/'.$map.".grande.png"))
	{
		Header("Content-type: image/png");
		ImagePng(ImageCreateFromPNG('temas/miniaturas/'.$map.".grande.png"));
		exit;		
	}
	ms_ResetErrorList();
	$tema = "";
	if(file_exists($map))
	{$tema = $map;}
	else
	{	
		$map = str_replace("\\","/",$map);
		$map = basename($map);
		if (file_exists('temas/'.$map))
		{$tema = 'temas/'.$map;}
		if (file_exists('temas/'.$map.'.map'))
		{$tema = 'temas/'.$map.".map";}
		if (file_exists('temas/'.$map.'.php'))
		{$tema = 'temas/'.$map.".php";}
	}
	if(($tipo == "") || ($tipo == "todos"))
	{echo "<hr><br><br><span style='color:red' ><b>Testando: $tema </span><pre></b>";}
	if(!file_exists($tema))
	{$tema = $locaplic."/".$tema;}
	if(!file_exists($tema))
	{echo "Arquivo ".$map." não encontrado.";exit;}
	if ($tema != "")
	{
		if($base == "" or !isset($base)){
			$base = "";
			if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
			{$base = $locaplic."/aplicmap/geral1windowsv".$versao.".map";}
			else
			{
				if($base == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
					$base = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
				}
				if($f == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
					$base = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
				}
				if($f == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
					$base = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
				}
				if($f == "")
				{$base = $locaplic."/aplicmap/geral1v".$versao.".map";}
			}
		}
		else{
			if(!file_exists($base))
			{$base = $locaplic."/aplicmap/".$base;}
		}
		$mapa = ms_newMapObj($base);
		error_reporting(0);
		$temasn = $mapa->getAllLayerNames();
		foreach ($temasn as $teman)
		{
			$layern = $mapa->getLayerByName($teman);
			if (!empty($postgis_mapa))
			{
				if ($layern->connectiontype == MS_POSTGIS)
				{
					$lcon = $layern->connection;
					if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa))))
					{
						if(($lcon == " ") || ($lcon == "")) //para efeitos de compatibilidade
						{$layern->set("connection",$postgis_mapa);}
						else
						{$layern->set("connection",$postgis_mapa[$lcon]);}					
					}
				}
			}
		}
		if(!stristr($tema, '.php') === FALSE){
			echo "<br>Arquivo <i>$tema</i> é um programa PHP. O teste pode não funcionar.<br>";
			include_once($locaplic."/".$tema);
			//
			//$pegarext deve guardar o nome da camada para ser usado mais abaixo
			//
			$pegarext = str_replace(".php","",$tema);
			$pegarext = str_replace("temas/","",$pegarext);
			eval($pegarext."(\$mapa);");
		}
		else{
			if(file_exists($mapUrl))
			{$nmapa = ms_newMapObj($mapUrl);}
			else{
				if(@ms_newMapObj($locaplic."/".$tema))
				{
					$nmapa = ms_newMapObj($locaplic."/".$tema);
				}
				else
				{
					echo "erro no arquivo $map <br>";
					echo "Obs.: em alguns testes o mapfile pode falhar se o endereço dos arquivos de símbolos estiverem <br>definidos de forma relativa ao invés de absoluta. Nesses casos, ao abrir o i3Geo, <br>o mapfile poderá funcionar. <br>";
					$error = ms_GetErrorObj();
					while($error && $error->code != MS_NOERR)
					{
						printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
						$error = $error->next();
					}
					return;
				}
			}
			$temasn = $nmapa->getAllLayerNames();
			$dados = "";
			foreach ($temasn as $teman)
			{
				$layern = $nmapa->getLayerByName($teman);
				$layern->set("status",MS_DEFAULT);
				if (!empty($postgis_mapa))
				{
					if ($layern->connectiontype == MS_POSTGIS)
					{
						$lcon = $layern->connection;
						error_reporting(0);						
						if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa))))
						{
							if(($lcon == " ") || ($lcon == "")) //para efeitos de compatibilidade
							{$layern->set("connection",$postgis_mapa);}
							else
							{$layern->set("connection",$postgis_mapa[$lcon]);}					
						}
					}
				}
				autoClasses($layern,$nmapa);
				error_reporting(E_ALL);
				if($layern->classitem != "" && $layern->connectiontype == 7 && $layern->numclasses > 0 && $layern->getmetadata("wms_sld_body") == ""){
					$tipotemp = $layern->type;
					$tiporep = $layern->getmetadata("tipooriginal");
					$layern->set("type",MS_LAYER_POLYGON);
					if ($tiporep == "linear")
					{$layern->set("type",MS_LAYER_LINE);}
					if ($tiporep == "pontual")
					{$layern->set("type",MS_LAYER_POINT);}
					$sld = $layern->generateSLD();
					if($sld != "")
					$layern->setmetadata("wms_sld_body",str_replace('"',"'",$sld));
					$layern->set("type",$tipotemp);
				}
				ms_newLayerObj($mapa, $layern);
				if ($layern->data == "")
				$dados = $layern->connection;
				else
				$dados = $layern->data;
				$pegarext = $teman;	
			}
		}
		zoomTema($pegarext,$mapa);
		if ($tipo == "mini")
		{
		 	 $mapa->setsize(50,50);
			 $sca = $mapa->scalebar;
			 $sca->set("status",MS_OFF);
		}
		if ($tipo == "grande")
		{
		 	 $mapa->setsize(300,300);
			 $sca = $mapa->scalebar;
			 $sca->set("status",MS_OFF);
		}
		if($tipo == "todos")
		{
		 	 $mapa->setsize(150,150);
			 $sca = $mapa->scalebar;
			 $sca->set("status",MS_OFF);
		}
		$objImagem = @$mapa->draw();
		$objImagemLegenda = @$mapa->drawLegend();
		if (!$objImagem)
		{
			echo "Problemas ao gerar o mapa<br>";
			$error = "";
			$error = ms_GetErrorObj();
			while($error && $error->code != MS_NOERR)
			{
				echo "<br>Error in %s: %s<br>", $error->routine, $error->message;
				$error = $error->next();
			}
			return;
		}
		if($objImagem->imagepath == "")
		{echo "Erro IMAGEPATH vazio";}
		$nomec = ($objImagem->imagepath).nomeRandomico()."teste.png";
		$objImagem->saveImage($nomec);
		$nomer = ($objImagem->imageurl).basename($nomec);
		
		$nomel = ($objImagemLegenda->imagepath).nomeRandomico()."testel.png";
		$objImagemLegenda->saveImage($nomel);
		$nomerl = ($objImagemLegenda->imageurl).basename($nomel);
		if(($tipo == "") || ($tipo == "todos"))
		{
			if($solegenda == "nao")
			{echo "<img src=".$nomer." /><br>";}
			echo "<img src=".$nomerl." />";
			if($tipo == "todos")
			{
			 echo "<br>".$dados."<br>";
			}
			if($map != "todos")
			{
				echo "<br>Erros:<br>";
				$error = "";
				$error = ms_GetErrorObj();
				while($error && $error->code != MS_NOERR)
				{
					echo "<br>Error in %s: %s<br>", $error->routine, $error->message;
					$error = $error->next();
				}
			}
				
		}
		else
		{
			Header("Content-type: image/png");
			ImagePng(ImageCreateFromPNG($nomec));
		}
		//$objImagem->free();
	}
}
function zoomTema($nomelayer,&$mapa)
{
	$layer = $mapa->getlayerbyname($nomelayer);
	if($layer->data == "" && $layer->connection == "")
	{return;}	
	$prjMapa = $mapa->getProjection();
	$prjTema = $layer->getProjection();
	$extatual = $mapa->extent;
	$ret = $layer->getmetadata("extensao");
	if($layer->type > 2 && $ret == "")
	{return;}
	$ct = $layer->connectiontype;
	if(($ret == "") && ($ct != 1))
	{return;}
	if ($ret == "")
	{
		$ret = $layer->getextent();
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
