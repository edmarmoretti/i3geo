<?php
/*
Title: Cat&aacute;logo de temas em KML

Gera um arquivo KML contendo os temas existentes no cat&aacute;logo. Esse KML pode ser utilizado no Google Earth para que os temas possam ser vistos nesse aplicativo seguindo a mesma estrutura de organiza&ccedil;&atilde;o

Exemplo

kml.php?idioma=en

Licen&ccedil;a:

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c�pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo: i3geo/kml.php

Par&acirc;metros:

perfil - perfis separados por espa&ccedil;os. Ao usar um perfil, ser&atilde;o mostrados apenas os temas dispon&iacute;veis para o perfil indicado.

tipoxml - (opcional) quando definido como "kml" ser&aacute; inserido o cabe&ccedil;alho de tipo kml no xml, possibilitando abrir o xml diretamente na aplica&ccedil;&atilde;o Google Earth

idioma - pt|en|es
*/
//error_reporting(0);
include_once ("classesphp/carrega_ext.php");
include_once ("classesphp/classe_menutemas.php");
include ("classesphp/conexao.php");
include ("classesphp/funcoes_gerais.php");
$encoding = "ISO-8859-1";
if($convUTF == true){
	$encoding = "UTF-8";
}
if(!isset($idioma)){
	$idioma = "pt";
}

$xml = '<?xml version="1.0" encoding="'.$encoding.'"?>';
$xml .= "<kml xmlns='http://earth.google.com/kml/2.2'>\n";

//
//pega os endere&ccedil;os para compor a url de chamada do gerador de web services
//ogc.php
//
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$protocolo = strtolower($protocolo[0]);
$protocolo1 = strtolower($protocolo . '://'.$_SERVER['SERVER_NAME']);
$protocolo = $protocolo . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
$urli3geo = str_replace("/kml.php","",$protocolo.$_SERVER["PHP_SELF"]);
//error_reporting(0);
if(!isset($perfil)){
	$perfil = "";
}
//
//monta o xml
//
$xml .= "<Document><name>Menu i3geo</name><open>0</open><description></description><visibility>0</visibility>\n";
if($idioma == "pt"){
	$coluna = "nome_menu";
}
else{
	$coluna = $idioma;
}
$menus = pegaDadosAdmin("SELECT publicado_menu,perfil_menu,aberto,desc_menu,id_menu,$coluna as nome_menu from ".$esquemaadmin."i3geoadmin_menus where lower(publicado_menu) != 'nao' or publicado_menu is null order by nome_menu ",$dbh);

//echo "<pre>menu - ".var_dump($menus);exit;
foreach($menus as $menu){
	$xml .= kml_cabecalho($menu["nome_menu"],$menu["desc_menu"]);
	$id_menu = $menu["id_menu"];
	//raiz
	if($idioma == "pt")	{
		$coluna = "nome_tema";
	}
	else{
		$coluna = $idioma;
	}

	$sql = "select id_raiz,i3geoadmin_raiz.id_tema,$coluna as nome_tema,tipoa_tema,codigo_tema,kmz_tema FROM ".$esquemaadmin."i3geoadmin_raiz LEFT JOIN ".$esquemaadmin."i3geoadmin_temas ON i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema where (lower(i3geoadmin_temas.tipoa_tema) != 'wms' or i3geoadmin_temas.tipoa_tema is null) and (lower(i3geoadmin_temas.kml_tema) != 'nao' or i3geoadmin_temas.kml_tema isnull) and i3geoadmin_temas.tipoa_tema != 'WMS' and i3geoadmin_temas.kml_tema != 'nao' and i3geoadmin_raiz.id_menu='$id_menu' and i3geoadmin_raiz.nivel = 0 and i3geoadmin_raiz.id_nivel = 0 order by ordem";
	$temas = pegaDadosAdmin($sql,$dbh);
	if(count($temas) > 0){
		foreach ($temas as $tema){
			$xml .= kml_tema_bd($tema);
		}
	}

	if($idioma == "pt"){
		$coluna = "nome_grupo";
	}
	else{
		$coluna = $idioma;
	}

	$grupos = pegaDadosAdmin("SELECT $coluna as nome_grupo,n1.id_n1,n1.id_grupo,gr.desc_grupo from ".$esquemaadmin."i3geoadmin_n1 as n1,".$esquemaadmin."i3geoadmin_grupos as gr where (lower(n1.publicado) != 'nao' or n1.publicado is null) and n1.id_menu = '$id_menu' and n1.id_grupo = gr.id_grupo order by gr.nome_grupo",$dbh);
	foreach($grupos as $grupo){
		$xml .= kml_cabecalho($grupo["nome_grupo"],$grupo["desc_grupo"]);
		$id_grupo = $grupo["id_grupo"];
		//raiz
		if($idioma == "pt"){
			$coluna = "nome_tema";
		}
		else{
			$coluna = $idioma;
		}
		$sql = "select id_raiz,i3geoadmin_raiz.id_tema,$coluna as nome_tema,tipoa_tema,kml_tema,kmz_tema,codigo_tema FROM ".$esquemaadmin."i3geoadmin_raiz LEFT JOIN ".$esquemaadmin."i3geoadmin_temas ON i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema where lower(i3geoadmin_temas.tipoa_tema) != 'wms' and lower(i3geoadmin_temas.kml_tema) != 'nao' and i3geoadmin_temas.tipoa_tema != 'WMS' and i3geoadmin_temas.kml_tema != 'nao' and i3geoadmin_raiz.id_menu='$id_menu' and i3geoadmin_raiz.nivel = 1 and i3geoadmin_raiz.id_nivel = ".$grupo["id_n1"]." order by ordem";
		$temas = pegaDadosAdmin($sql,$dbh);
		if(count($temas) > 0){
			foreach ($temas as $tema){
				$xml .= kml_tema_bd($tema);
			}
		}
		if($idioma == "pt"){
			$coluna = "nome_subgrupo";
		}
		else{
			$coluna = $idioma;
		}
		$sql = "select s.$coluna as nome_subgrupo,n2.id_n2 from ".$esquemaadmin."i3geoadmin_n2 as n2,".$esquemaadmin."i3geoadmin_n1 as n1, ".$esquemaadmin."i3geoadmin_subgrupos as s ";
		$sql .= "where n1.id_menu = '$id_menu' and n1.id_grupo = '$id_grupo' and n2.id_subgrupo = s.id_subgrupo ";
		$sql .= "and n2.id_n1 = n1.id_n1 ";
		$sql .= "and (n1.n1_perfil = '' or n1.n1_perfil is null) and (n2.n2_perfil = '' or n2.n2_perfil isnull) ";
		$sql .= "and (lower(n2.publicado) != 'nao' or n2.publicado is null) ";
		$sql .= "order by s.nome_subgrupo";
		$subgrupos = pegaDadosAdmin($sql,$dbh);
		//var_dump($subgrupos);
		if($idioma == "pt"){
			$coluna = "nome_tema";
		}
		else{
			$coluna = $idioma;
		}
		foreach ($subgrupos as $subgrupo){
			$id_n2 = $subgrupo["id_n2"];
			$sql = "select t.codigo_tema,t.$coluna as nome_tema,t.link_tema, t.desc_tema, t.kmz_tema from ".$esquemaadmin."i3geoadmin_n3 as n3,".$esquemaadmin."i3geoadmin_temas as t where ";
			$sql .= "n3.id_n2='$id_n2' ";
			$sql .= "and n3.id_tema = t.id_tema ";
			$sql .= "and (n3_perfil = '' or n3_perfil is null) ";
			$sql .= "and (lower(t.kml_tema) != 'nao' or t.kml_tema is null)";
			$sql .= "and (lower(t.tipoa_tema) != 'wms' or t.tipoa_tema is null)";
			$sql .= "and (lower(n3.publicado) != 'nao' or n3.publicado is null) ";
			$temas = pegaDadosAdmin($sql,$dbh);
			$xml .= kml_folder($subgrupo["nome_subgrupo"]);
			if(count($temas) > 0){
				foreach ($temas as $tema){
					$xml .= kml_tema_bd($tema);
				}
			}
			$xml .= "</Folder>\n";
		}
		$xml .= "</Folder>\n";
	}
	$xml .= "</Folder>\n";
}

$xml .= "</Document></kml>\n";
//exit;
if(isset($_GET["tipoxml"]) && $_GET["tipoxml"] == "kml"){
	echo header('Content-type: application/vnd.google-earth.kml+xml');
	echo header('Content-Disposition: attachment; filename="i3geo.kml"');
}
else{
	echo header("Content-type: application/xml");
}
echo $xml;
function kml_tema_bd($tema){
	global $urli3geo;
	$xml = "";
	$teste = array_keys($tema);
	if(in_array("link_tema",$teste)){
		$fonte = $tema["link_tema"];
	}
	else{
		$fonte = "";
	}
	$nome = $tema["nome_tema"];
	$id = $tema["codigo_tema"];
	if(in_array("desc_tema",$teste)){
		$desc = $tema["desc_tema"];
	}
	else{
		$desc = "";
	}
	$fonte = "<a href='$fonte' >Fonte </a>";
	$legenda = "<a href='$urli3geo/ogc.php?tema=$id&layer=$id&request=getlegendgraphic&service=wms&format=image/jpeg' >Legenda </a>";
	$urlLegenda = $urli3geo."/ogc.php?tema=$id&layer=$id&request=getlegendgraphic&service=wms&format=image/jpeg";
	$href = "$urli3geo/ogc.php?tema=$id&amp;width=800&amp;height=800&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;SRS=EPSG:4326&amp;STYLES=&amp;BGCOLOR=0xFFFFFF&amp;FORMAT=image/png&amp;TRANSPARENT=TRUE&amp;layers=$id";

	$xml .= kml_servico($nome,$fonte,$legenda,$desc,$href,$urlLegenda);

	if(strtolower($tema["kmz_tema"]) == "sim"){
		$href = "$urli3geo/pacotes/kmlmapserver/kmlservice.php?request=kmz&amp;map=$id&amp;typename=$id";
		$xml .= kml_networklink($nome." (vetorial)",$fonte,$legenda,$desc,$href);
	}
	return $xml;
}
function kml_cabecalho($nome,$desc){
	$xml = "<Folder>\n";
	$xml .= " <name>".str_replace("&","&amp;",kml_converteTexto($nome))."</name>\n";
	$xml .= " <description>".str_replace("&","&amp;",kml_converteTexto($desc))."</description>\n";
	$xml .= " <open>0</open><visibility>0</visibility>\n";
	return $xml;
}
function kml_folder($nome,$open=0,$vis=0){
	$xml = " <Folder>\n";
	$xml .= "  <name>".str_replace("&","&amp;",kml_converteTexto($nome))."</name>\n";
	$xml .= "  <description></description>\n";
	$xml .= "  <open>$open</open><visibility>$vis</visibility>\n";
	return $xml;
}
function kml_tema($tema){
	global $urli3geo;
	$xml = "";
	$nome = kml_converteTexto($tema->TNOME);
	$desc = kml_converteTexto($tema->TDESC);
	$id = kml_converteTexto($tema->TID);
	$fonte = kml_converteTexto($tema->TLINK);
	$tipoa = "";
	if($tema->TIPOA)
	$tipoa = kml_converteTexto($tema->TIPOA);
	$ogc = sim;
	if($tema->TID){
		$kml = kml_converteTexto($tema->KML);
	}
	if(strtolower($kml) != "nao" && strtolower($tipoa) != "wms"){
		if($fonte != "")
		$fonte = "<a href='$fonte' >Fonte </a>";
		else
		$fonte = "";

		$legenda = "<a href='$urli3geo/ogc.php?tema=$id&layer=$id&request=getlegendgraphic&service=wms&format=image/png' >Legenda </a>";
		$href = "$urli3geo/ogc.php?tema=$id&amp;width=800&amp;height=800&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;SRS=EPSG:4326&amp;STYLES=&amp;BGCOLOR=0xFFFFFF&amp;FORMAT=image/png&amp;TRANSPARENT=TRUE&amp;layers=$id";
		$xml .= kml_servico($nome,$fonte,$legenda,$desc,$href);
	}
	return $xml;
}
function kml_servico($nome,$fonte,$legenda,$desc,$href,$urlLegenda){
	$xml = kml_folder($nome);
	$xml .= "<ScreenOverlay>\n";
	$xml .= "<name>Legenda</name>\n";
	$xml .= "<visibility>0</visibility>\n";
	$xml .= "<Icon>\n";
	$xml .= "<href><![CDATA[".$urlLegenda."]]></href>\n";
	$xml .= "</Icon>\n";
	$xml .= "<overlayXY x='0.01' y='0.14' xunits='fraction' yunits='fraction'/>\n";
	$xml .= "<screenXY x='0.01' y='0.14' xunits='fraction' yunits='fraction'/>\n";
	$xml .= "<size x='-1' y='-1' xunits='pixels' yunits='pixels'/>\n";
	$xml .= "</ScreenOverlay>\n";
	$xml .= "   <GroundOverlay>\n";
	$xml .= "    <name>".str_replace("&","&amp;",kml_converteTexto($nome))."</name>\n";
	$xml .= "    <description><![CDATA[".$fonte.$legenda.$desc."]]></description>\n";
	$xml .= "    <visibility>0</visibility>\n";
	$xml .= "    <Icon>\n";
	$xml .= "    <viewRefreshMode>onStop</viewRefreshMode>\n";
	$xml .= "    <href>$href</href>\n";
	$xml .= "    </Icon>\n";
	$xml .= "    <LatLonBox><north>9.49014618085</north><south>-39.3925604735</south><east>-29.5851853</east><west>-76.5125927</west></LatLonBox>\n";
	$xml .= "   </GroundOverlay>\n";
	$xml .= "</Folder>";
	return $xml;
}
function kml_networklink($nome,$fonte,$legenda,$desc,$href){
	$xml = "   <NetworkLink>\n";
	$xml .= "    <name>".str_replace("&","&amp;",kml_converteTexto($nome))."</name>\n";
	$xml .= "    <description><![CDATA[".$fonte.$legenda.$desc."]]></description>\n";
	$xml .= "    <visibility>0</visibility>\n";
	$xml .= "    <Link>\n";
	$xml .= "       <viewRefreshMode>never</viewRefreshMode>\n";
	$xml .= "       <href>$href</href>\n";
	$xml .= "    </Link>\n";
	$xml .= "   </NetworkLink>\n";
	return $xml;
}
function kml_converteTexto($i){
	global $encoding;
	$encodingatual = mb_detect_encoding($i, 'UTF-8, UTF-7, ASCII, ISO-8859-1');
	return mb_convert_encoding($i,$encoding,$encodingatual);
}
?>