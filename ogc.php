<?php
/*
Title: ogc.php

Gera web services nos padrões OGC

A lista de projeções mostradas na função getcapabilities é definida na variável $listaepsg. Edite essa variável
se forem necessárias outras projeções além das existentes

Licenca:

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

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

Arquivo: i3geo/ogc.php

Parametros:

lista - se for igual a "temas", mostra uma lista dos temas disponíveis

ajuda - se for definida na URL, mostra uma ajuda ao usuário

tema - nome do tema do serviço. Se for definido, o web service conterá apenas o tema.

intervalo - valor inicial e final com o número de temas que serão mostrados no serviço

legenda - mostra a legenda no corpo do mapa sim|nao

perfil - perfil utilizado para escolher os menus

format - (opcional) pode ser utilizado a opção &format=application/openlayers para abrir o mashup do OpenLayers com as camadas definida em temas, exemplo
		http://localhost/i3geo/ogc.php?temas=biomashp&format=application/openlayers&bbox=-54,-14,-50,-10

Exemplos:

ogc.php?lista=temas

ogc.php?tema=bioma

ogc.php?intervalo=0,50
*/
//
//validações e includes
//
$cache = true;
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
require_once("classesphp/carrega_ext.php");
include("ms_configura.php");
include("classesphp/pega_variaveis.php");
//include("classesphp/classe_menutemas.php");
if(!isset($temas) && isset($tema))
{$temas = $tema;}
//
//para operar como o Geoserver
//
if(isset($format) && strtolower($format) == "application/openlayers"){
	if(!isset($layers))
	{$layers = $temas;}
	$urln = "mashups/openlayers.php?temas=".$layers."&layers=".$layers."&mapext=".$bbox."&botoes=pan,zoombox,zoomtot,identifica";
	if(!headers_sent())
	{header("Location:".$urln);}
	else
	{echo "<meta http-equiv='refresh' content='0;url=$urln'>";}	
}
//
//pega os endereços para compor a url de chamada do gerador de web services
//ogc.php
//
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$protocolo = $protocolo[0];
$protocolo1 = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'];
$protocolo = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
$urli3geo = str_replace("/ogc.php","",$protocolo.$_SERVER["PHP_SELF"]);
//
//imprime na tela a ajuda
//
if(isset($ajuda))
{
	ogc_imprimeAjuda();
	exit;
}
//
//imprime na tela a lista de temas disponíveis
//
if(isset($lista) && $lista == "temas")
{
	include_once("classesphp/classe_menutemas.php");
	ogc_imprimeListaDeTemas();
	exit;
}
//
//cria o web service
//
include("classesphp/funcoes_gerais.php");
error_reporting(0);
$versao = versao();
$versao = $versao["principal"];
$req = ms_newowsrequestobj();
$tipo = "";
$_GET = array_merge($_GET,$_POST);

if(isset($_GET["sld"]) || isset($_GET["filter"]))
{$cache = false;}
foreach ($_GET as $k=>$v)
{
	$req->setParameter($k, $v);
	if(strtolower($v) == "getcapabilities"){
		$tipo = "metadados";
		$cache = false;
	}
	if(strtolower($k) == "layers")
	{$tema = $v;}
	if(strtolower($k) == "layer")
	{$tema = $v;}
}
if(empty($srs)){$srs = "";}
$listaepsg = $srs." EPSG:4618 EPSG:4291 EPSG:4326 EPSG:22521 EPSG:22522 EPSG:22523 EPSG:22524 EPSG:22525 EPSG:29101 EPSG:29119 EPSG:29120 EPSG:29121 EPSG:29122 EPSG:29177 EPSG:29178 EPSG:29179 EPSG:29180 EPSG:29181 EPSG:29182 EPSG:29183 EPSG:29184 EPSG:29185";
if(count($_GET) == 0){
	$tipo="intervalo";
	$req->setParameter("REQUEST", "getCapabilities");
	$req->setParameter("SERVICE", "WMS");
	$cache = false;
}
if(isset($tema) && $tipo != "metadados")
{$tipo = "";}
if(!isset($version))
{$req->setParameter("VeRsIoN","1.1.0");}
$oMap = ms_newMapobj($locaplic."/aplicmap/ogcwsv".$versao.".map");
//
//altera os caminhos das imagens
//
if((isset($legenda)) && (strtolower($legenda) == "sim"))
{
	$leg = $oMap->legend;
	$leg->set("status",MS_EMBED);
	$cache = false;
}
$proto = "http" . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "s" : "") . "://";
$server = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
$or = $proto.$server.$_SERVER['PHP_SELF'];
if((isset($tema)) && ($tema != "") && ($tipo=="metadados"))
{$or = $or."?tema=".$tema."&";}
//
//parametros no nível maior
//
$oMap->setmetadata("ows_onlineresource",$or);
$oMap->setmetadata("wms_onlineresource",$or);
$oMap->setmetadata("wms_title",$tituloInstituicao." - i3geo");
$oMap->setmetadata("wfs_title",$tituloInstituicao." - i3geo");
$oMap->setmetadata("wms_attribution_logourl_format","image/png");
$oMap->setmetadata("wms_attribution_logourl_height","56");
$oMap->setmetadata("wms_attribution_logourl_width","85");
$oMap->setmetadata("wms_attribution_logourl_href",$proto.$server.dirname($_SERVER['PHP_SELF'])."/imagens/i3geo.png");
$oMap->setmetadata("wms_attribution_onlineresource",$proto.$server.dirname($_SERVER['PHP_SELF']));
$oMap->setmetadata("wms_attribution_title",$tituloInstituicao);
$oMap->setmetadata("ows_enable_request","*");

$e = $oMap->extent;
$extensaoMap = ($e->minx)." ".($e->miny)." ".($e->maxx)." ".($e->maxy);

if (!isset($intervalo))
{$intervalo = "0,5000";}
else
{$tipo = "intervalo";}
if(!isset($tema)){
	if(!isset($intervalo))
	{$intervalo = "0,5000";}
	$tipo = "intervalo";
}
if ($tipo == "" || $tipo == "metadados")
{
	$tema = explode(" ",$tema);
	//para o caso do tema ser um arquivo mapfile existente em uma pasta
	$temai3geo = true;
	if(file_exists($_GET["tema"])){
		$nmap = ms_newMapobj($_GET["tema"]);
		$temai3geo = false;
		$nmap->setmetadata("ows_enable_request","*");
	}
	foreach ($tema as $tx)
	{
		$extensao = ".map";
		if(file_exists($locaplic."/temas/".$tx.".php") && $temai3geo == true){
			$extensao = ".php";
		}
		if($extensao == ".map"){			
			if($temai3geo == true){
				$nmap = ms_newMapobj($locaplic."/temas/".$tx.".map");
				$nmap->setmetadata("ows_enable_request","*");
			}
			$ts = $nmap->getalllayernames();
			foreach ($ts as $t)
			{
				$l = $nmap->getlayerbyname($t);
				if($cache == true && strtolower($l->getmetadata("cache")) == "sim" && $tipo == "" && count($tema) == 1){
					carregaCacheImagem($_GET["BBOX"],$tx,$_GET["WIDTH"],$_GET["HEIGHT"],$cachedir);
				}
				$l->setmetadata("ows_title",pegaNome($l));
				$l->setmetadata("ows_srs",$listaepsg);
				//essa linha é necessária pq as vezes no mapfile não tem nenhum layer com o nome igual ao nome do mapfile
				if(count($ts)==1)
				{$l->set("name",$tx);}
				$l->setmetadata("gml_include_items","all");
				$l->set("dump",MS_TRUE);
				$l->setmetadata("WMS_INCLUDE_ITEMS","all");
				$l->setmetadata("WFS_INCLUDE_ITEMS","all");
				if(file_exists($locaplic."/temas/miniaturas/".$t.".map.mini.png"))
				{
					$mini = $proto.$server.dirname($_SERVER['PHP_SELF'])."/temas/miniaturas/".$t.".map.mini.png";
					$l->setmetadata("wms_attribution_logourl_format","image/png");
					$l->setmetadata("wms_attribution_logourl_height","50");
					$l->setmetadata("wms_attribution_logourl_width","50");
					$l->setmetadata("wms_attribution_logourl_href",$mini);
				}
				if($l->type == MS_LAYER_RASTER && $l->numclasses > 0)
				{
					$c = $l->getclass(0);
					if($c->name == "")
					{$c->name = " ";}
				}
				//inclui extensao geografica
				$extensao = $l->getmetadata("EXTENSAO");
				if($extensao == "")
				{$extensao = $extensaoMap;}
				$l->setmetadata("wms_extent",$extensao);
				if (isset($postgis_mapa))
				{			
					if ($postgis_mapa != "")
					{				
						if ($l->connectiontype == MS_POSTGIS)
						{
							$lcon = $l->connection;
							if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa))))
							{
								//
								//o metadata CONEXAOORIGINAL guarda o valor original para posterior substituição
								//				
								if(($lcon == " ") || ($lcon == ""))
								{
									$l->set("connection",$postgis_mapa);
									$l->setmetadata("CONEXAOORIGINAL",$lcon);
								}
								else
								{
									$l->set("connection",$postgis_mapa[$lcon]);
									$l->setmetadata("CONEXAOORIGINAL",$lcon);
								}					
							}
						}
					}
				}
				autoClasses($l,$oMap);
				$permite = $l->getmetadata("permiteogc");
				if($permite != "nao")
				ms_newLayerObj($oMap, $l);
			}
		}
		else{
			include_once($locaplic."/temas/".$tx.".php");
			eval($tx."(\$oMap);");
		}
	}
}
else
{
	$conta = 0;
	$int = explode(",",$intervalo);
	$codigosTema = array();
	if(empty($perfil)){$perfil = "";}
	include("classesphp/classe_menutemas.php");
	$m = new Menutemas("",$perfil,$locaplic,$urli3geo);
	$menus = $m->pegaListaDeMenus();
	foreach ($menus as $menu)
	{	
		$grupos = $m->pegaListaDeGrupos($menu["idmenu"],$listasistemas="nao",$listasgrupos="sim");
		foreach($grupos as $grupo)
		{
			if(strtolower($grupo["ogc"]) == "sim")
			{
				foreach($grupo["subgrupos"] as $sgrupo)
				{
					if(strtolower($sgrupo["ogc"]) == "sim")
					{
						$temas = $m->pegaListaDeTemas($grupo["id_n1"],$sgrupo["id_n2"],$menu["idmenu"]);
						foreach($temas as $tema)
						{
							if(strtolower($tema["ogc"]) == "sim")
							{
								$codigosTema[] = array("tema"=>$tema["tid"],"fonte"=>$tema["link"]);
							}
						}
					}
				}
			}
		}
	}
	//echo "<pre>";
	//var_dump($$codigosTema);
	//exit;
	foreach($codigosTema as $c)
	{
		$codigoTema = $c["tema"];
		if(file_exists($locaplic."/temas/".$codigoTema.".map"))
		{
			if (@ms_newMapobj($locaplic."/temas/".$codigoTema.".map"))
			{
				$nmap = ms_newMapobj($locaplic."/temas/".$codigoTema.".map");
				$nmap->setmetadata("ows_enable_request","*");
				$ts = $nmap->getalllayernames();
				if (count($ts) == 1)
				{ 
					foreach ($ts as $t)
					{
						if ($oMap->getlayerbyname($t) == "")
						{
							$conta++;
							if (($conta >= $int[0]) && ($conta <= $int[1]))
							{
								$l = $nmap->getlayerbyname($t);
								$extensao = $l->getmetadata("EXTENSAO");
								if($extensao == "")
								{$extensao = $extensaoMap;}
								$l->setmetadata("wms_extent",$extensao);

								$l->setmetadata("ows_title",pegaNome($l));
								$l->setmetadata("ows_srs",$listaepsg);
								$l->set("status",MS_OFF);
								$l->setmetadata("gml_include_items","all");
								$l->set("dump",MS_TRUE);
								$l->setmetadata("WMS_INCLUDE_ITEMS","all");
								$l->setmetadata("WFS_INCLUDE_ITEMS","all");
								
								$l->setmetadata("ows_metadataurl_href",$c["fonte"]);
								$l->setmetadata("ows_metadataurl_type","TC211");
								$l->setmetadata("ows_metadataurl_format","text/html");
								if(file_exists($locaplic."/temas/miniaturas/".$t.".map.mini.png"))
								{
									$mini = $proto.$server.dirname($_SERVER['PHP_SELF'])."/temas/miniaturas/".$t.".map.mini.png";
									$l->setmetadata("wms_attribution_logourl_format","image/png");
									$l->setmetadata("wms_attribution_logourl_height","50");
									$l->setmetadata("wms_attribution_logourl_width","50");
									$l->setmetadata("wms_attribution_logourl_href",$mini);
								}								
								ms_newLayerObj($oMap, $l);
							}
						}
					}
				}
			}
		}
	}
}
if($cache == true){
	
}
ms_ioinstallstdouttobuffer();
$oMap->owsdispatch($req);
$contenttype = ms_iostripstdoutbuffercontenttype();
if(strtolower($request) == "getcapabilities")
{header('Content-Disposition: attachment; filename=getcapabilities.xml"');}
//header("Content-type: application/xml");
header("Content-type: $contenttype");

$buffer = ms_iogetStdoutBufferBytes();
ms_ioresethandlers();
//
//funções
//
function ogc_pegaListaDeMenus()
{
	global $perfil,$locaplic,$urli3geo;
	if(!isset($perfil)){$perfil = "";}
	$m = new Menutemas("",$perfil,$locsistemas,$locaplic,"",$urli3geo);
	foreach($m->pegaListaDeMenus() as $menu)
	{$menus[] = $urli3geo."/admin/xmlmenutemas.php?id_menu=".$menu["idmenu"];}
	return $menus;
}
function ogc_imprimeAjuda()
{
	echo "<pre><b>Construtor de web services do I3Geo.</b><br><br>";
	echo "Esse utilitário usa os arquivos mapfiles existentes em <br>";
	echo "i3geo/temas para gerar web services no padrão OGC.<br>";
	echo "Para escolher um tema, utilize:<br>";
	echo "ogc.php?lista=temas - para listar os temas disponíveis<br>";
	echo "Para usar esse web service, além dos parâmetros normais, vc deverá incluir o parâmetro &tema=,<br>";
	echo "ou seja,http://[host]/i3geo/ogc.php?tema=[código do tema]<br><br>";
	echo "Utilize o sistema de administração do i3Geo para configurar quais os temas podem ser utilizados.";
	echo "Utilize o parametro &intervalo=0,20 para definir o número de temas desejado na função getcapabilities.";
}
function ogc_imprimeListaDeTemas()
{
	global $urli3geo,$perfil,$locaplic;
	$m = new Menutemas("",$perfil,$locaplic,$urli3geo);
	$menus = $m->pegaListaDeMenus();
	echo '<html><head><title>WMS</title><META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1"><meta name="description" content="OGC"><meta name="keywords" content="WMS OGC mapa sig gis webmapping geo geoprocessamento interativo meio ambiente MMA cartografia geografia"> <meta name="robots" content="index,follow">';
	echo "<body><b>Lista de temas por grupos e subgrupos e endereços de acesso aos dados por meio de Web Services WMS (os códigos dos temas estão em vermelho)</b><br><br>";
	$imprimir = "";
	foreach ($menus as $menu)
	{
		$grupos = $m->pegaListaDeGrupos($menu["idmenu"],$listasistemas="nao",$listasgrupos="sim");
		foreach($grupos as $grupo)
		{
			if(strtolower($grupo["ogc"]) == "sim")
			{
				$imprimegrupo = "<i>".$grupo["nome"]."</i>";
				foreach($grupo["subgrupos"] as $sgrupo)
				{
					if(strtolower($sgrupo["ogc"]) == "sim")
					{
						$imprimesubgrupo = $sgrupo["nome"];
						$temas = $m->pegaListaDeTemas($grupo["id_n1"],$sgrupo["id_n2"],$menu["idmenu"]);
						foreach($temas as $tema)
						{
							if(strtolower($tema["ogc"]) == "sim")
							{
								$imprimir .= $imprimegrupo."->".$imprimesubgrupo."<br>";
								$imprimir .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
								$imprimir .= "<span style=color:red >".$tema["tid"]."</span>";
								$imprimir .= "&nbsp;-&nbsp;".$tema["nome"]."&nbsp";
								$imprimir .= "&nbsp;<a href='".$urli3geo."/ogc.php?tema=".$tema["tid"]."&service=wms&request=getcapabilities' >Getcapabilities</a>";
								$imprimir .= "&nbsp;<a href='".$urli3geo."/ogc.php?tema=".$tema["tid"]."&SRS=EPSG:4618&WIDTH=500&HEIGHT=500&BBOX=-76.5125927,-39.3925675209,-29.5851853,9.49014852081&FORMAT=image/png&service=wms&version=1.1.0&request=getmap&layers=".$tema["tid"]."' >GetMap </a>";
								if($tema["link"] != " ")
								$imprimir .= "&nbsp;&nbsp;<a href='".$tema["link"]."' >fonte</a>";
								$imprimir .= "<br>";
							}
						}
					}
				}
			}
		}
	}
	echo $imprimir."</body></html>";
}
function carregaCacheImagem($bbox,$layer,$w,$h,$cachedir=""){
	global $dir_tmp;
	$nome = $w.$h.$bbox.".png";
	if($cachedir == "")
	{$nome = $dir_tmp."/cache/".$layer."/".$nome;}
	else
	{$nome = $cachedir."/".$layer."/".$nome;}
	if(file_exists($nome))
	{
		ob_start();
		// assuming you have image data in $imagedata
		$img = file_get_contents($nome);
		$length = strlen($img);
		$ft = filemtime($nome);
		if (isset($_SERVER["HTTP_IF_MODIFIED_SINCE"]) && (strtotime($_SERVER["HTTP_IF_MODIFIED_SINCE"]) == $ft)) {
			// Client's cache IS current, so we just respond '304 Not Modified'.
			header('Last-Modified: '.gmdate('D, d M Y H:i:s', $ft).' GMT', true, 304);
		} else {
			// Image not cached or cache outdated, we respond '200 OK' and output the image.
			header('Last-Modified: '.gmdate('D, d M Y H:i:s', $ft).' GMT', true, 200);
		}
		header('Accept-Ranges: bytes');
		header('Content-Length: '.$length);
		header('Content-Type: image/png');
		print($img);
		ob_end_flush();
		exit;
	}	
	/*
	if(file_exists($nome))
	{
		if (!function_exists('imagepng'))
		{
			$s = PHP_SHLIB_SUFFIX;
			@dl( 'php_gd2.'.$s );
			if (!function_exists('imagepng'))
			@dl( 'php_gd.'.$s );
		}
		@$img = imagecreatefrompng($nome);
		if(!$img)
		{
			$img  = imagecreatetruecolor($w, $h);
			imagealphablending($img, false);
			imagesavealpha($img, true);

			$bgc = imagecolorallocatealpha($img, 255, 255, 255,127);
			$tc  = imagecolorallocate($img, 255, 0, 0);

			imagefilledrectangle($img, 0, 0, $w, $h, $bgc);
			imagestring($img, 3, 5, 5, 'Erro ao ler ' . $nome, $tc);
		}
		else
		{
			imagealphablending($img, false);
			imagesavealpha($img, true);
		}
		ob_clean();
		error_reporting(0);
		echo header("Content-type: image/png \n\n");
		imagepng($img);
		imagedestroy($img);
		exit;
	}
	*/
}

?>



