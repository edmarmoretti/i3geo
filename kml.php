<?php
/*
Title: kml.php

Gerador de menu em kml para uso no Google Earth

Lê o(s) menu(s) de temas e acrescenta os links necessários ao acesso aos dados no Google Earth. Veja mais detalhes em ajuda/googleearth.htm

Utilize o parâmetro "idioma" para definir a linguagem utilizada (por default é pt)

Exemplo

kml.php?idioma=en

Licenca:

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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

Arquivo: i3geo/kml.php

Parametro:

perfil - perfis separados por espaços. Ao usar um perfil, serão mostrados apenas os temas disponíveis para o perfil indicado.

tipoxml - (opcional) se for "kml" insere o cabeçalho de tipo kml no xml, permitindo abrir o xml diretamente na aplicação Google Earth
*/
error_reporting(0);
include_once ("classesphp/carrega_ext.php");
include_once ("classesphp/classe_menutemas.php");
include_once ("ms_configura.php");
include_once ("admin/php/conexao.php");
$encoding = "ISO-8859-1";
if($convUTF == true)
{$encoding = "UTF-8";}
if(!isset($idioma))
{$idioma = "pt";}
if(isset($_GET["tipoxml"]) && $_GET["tipoxml"] == "kml"){
	echo header('Content-type: application/vnd.google-earth.kml+xml');
	echo header('Content-Disposition: attachment; filename="i3geo.kml"');
}
else
{echo header("Content-type: application/xml");}
echo '<?xml version="1.0" encoding="'.$encoding.'"?>';
echo "<kml xmlns='http://earth.google.com/kml/2.2'>\n";

//
//pega os endereços para compor a url de chamada do gerador de web services
//ogc.php
//
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$protocolo = strtolower($protocolo[0]);
$protocolo1 = strtolower($protocolo . '://'.$_SERVER['SERVER_NAME']);
$protocolo = $protocolo . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
$urli3geo = str_replace("/kml.php","",$protocolo.$_SERVER["PHP_SELF"]);
//error_reporting(E_ALL);
if(!isset($perfil)){$perfil = "";}
//
//monta o xml
//
echo "<Document><name>Menu i3geo</name><open>0</open><description></description><visibility>0</visibility>\n";
//
//no caso do arquivo com o menu vir de um arquivo XML
//
if ($menutemas != "" || is_array($menutemas))
{
	//
	//para manter a compatibilidade entre as versões do i3geo
	//é necessário verificar se a variável $menutemas é um array ou não
	//
	if(is_array($menutemas))
	{
		foreach($menutemas as $m)
		{$menus[] = $m["arquivo"];}
	}
	else
	$menu[] = $menutemas;
	foreach ($menus as $menu)
	{
		$xml = simplexml_load_file($menu);
		//raiz
		foreach($xml->TEMA as $tema)
		{kml_tema($tema);}
		foreach($xml->GRUPO as $grupo)
		{
			$nome = kml_converteTexto($grupo->GTIPO);
			$desc = kml_converteTexto($grupo->DTIPO);
			kml_cabecalho($nome,$desc);
			foreach($grupo->TEMA as $tema)
			{kml_tema($tema);}
			foreach($grupo->SGRUPO as $sgrupo)
			{
				$nome = kml_converteTexto($sgrupo->SDTIPO);
				kml_folder($nome);
				foreach($sgrupo->TEMA as $tema)
				{kml_tema($tema);}		
				echo "</Folder>\n";	
			}
			echo "</Folder>\n";
		}
	}
}
//
//no caso do menu vir do sistema de administração
//
//error_reporting(E_ALL);
if(!isset($menutemas) || $menutemas == "")
{
	include("admin/php/admin.php");
	if($idioma == "pt")
	{$coluna = "nome_menu";}
	else
	{$coluna = $idioma;}
	$menus = pegaDados("SELECT publicado_menu,perfil_menu,aberto,desc_menu,id_menu,$coluna as nome_menu from i3geoadmin_menus where lower(publicado_menu) != 'nao' or publicado_menu isnull order by nome_menu ");
	foreach($menus as $menu)
	{
		kml_cabecalho($menu["nome_menu"],$menu["desc_menu"]);
		$id_menu = $menu["id_menu"];
		//raiz
		if($idioma == "pt")
		{$coluna = "nome_tema";}
		else
		{$coluna = $idioma;}
		$sql = "select id_raiz,i3geoadmin_raiz.id_tema,$coluna as nome_tema,tipoa_tema,codigo_tema,kmz_tema FROM i3geoadmin_raiz LEFT JOIN i3geoadmin_temas ON i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema where (lower(i3geoadmin_temas.tipoa_tema) != 'wms' or i3geoadmin_temas.tipoa_tema isnull) and (lower(i3geoadmin_temas.kml_tema) != 'nao' or i3geoadmin_temas.kml_tema isnull) and i3geoadmin_temas.tipoa_tema != 'WMS' and i3geoadmin_temas.kml_tema != 'nao' and i3geoadmin_raiz.id_menu='$id_menu' and i3geoadmin_raiz.nivel = 0 and i3geoadmin_raiz.id_nivel = 0 order by ordem";
		$temas = pegaDados($sql);
		if(count($temas) > 0)
		{
			foreach ($temas as $tema)
			{kml_tema_bd($tema);}
		}
		if($idioma == "pt")
		{$coluna = "nome_grupo";}
		else
		{$coluna = $idioma;}
		$grupos = pegaDados("SELECT $coluna as nome_grupo,n1.id_n1,n1.id_grupo,gr.desc_grupo from i3geoadmin_n1 as n1,i3geoadmin_grupos as gr where (lower(n1.publicado) != 'nao' or n1.publicado isnull) and n1.id_menu = '$id_menu' and n1.id_grupo = gr.id_grupo order by gr.nome_grupo");
		foreach($grupos as $grupo)
		{
			kml_cabecalho($grupo["nome_grupo"],$grupo["desc_grupo"]);
			$id_grupo = $grupo["id_grupo"];
			//raiz
			if($idioma == "pt")
			{$coluna = "nome_tema";}
			else
			{$coluna = $idioma;}
			$sql = "select id_raiz,i3geoadmin_raiz.id_tema,$coluna as nome_tema,tipoa_tema,kml_tema,kmz_tema,codigo_tema FROM i3geoadmin_raiz LEFT JOIN i3geoadmin_temas ON i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema where lower(i3geoadmin_temas.tipoa_tema) != 'wms' and lower(i3geoadmin_temas.kml_tema) != 'nao' and i3geoadmin_temas.tipoa_tema != 'WMS' and i3geoadmin_temas.kml_tema != 'nao' and i3geoadmin_raiz.id_menu='$id_menu' and i3geoadmin_raiz.nivel = 1 and i3geoadmin_raiz.id_nivel = ".$grupo["id_n1"]." order by ordem";
			$temas = pegaDados($sql);
			if(count($temas) > 0)
			{
				foreach ($temas as $tema)
				{kml_tema_bd($tema);}
			}
			if($idioma == "pt")
			{$coluna = "nome_subgrupo";}
			else
			{$coluna = $idioma;}
			$sql = "select s.$coluna as nome_subgrupo,n2.id_n2 from i3geoadmin_n2 as n2,i3geoadmin_n1 as n1, i3geoadmin_subgrupos as s ";
			$sql .= "where n1.id_grupo = '$id_grupo' and n2.id_subgrupo = s.id_subgrupo ";
			$sql .= "and n2.id_n1 = n1.id_n1 ";
			$sql .= "and (n1.n1_perfil = '' or n1.n1_perfil isnull) and (n2.n2_perfil = '' or n2.n2_perfil isnull) ";
			$sql .= "and (lower(n2.publicado) != 'nao' or n2.publicado isnull) ";
			$sql .= "order by s.nome_subgrupo";
			$subgrupos = pegaDados($sql);
			if($idioma == "pt")
			{$coluna = "nome_tema";}
			else
			{$coluna = $idioma;}
			foreach ($subgrupos as $subgrupo)
			{
				$id_n2 = $subgrupo["id_n2"];
				$sql = "select t.codigo_tema,t.$coluna as nome_tema,t.link_tema, t.desc_tema, t.kmz_tema from i3geoadmin_n3 as n3,i3geoadmin_temas as t where ";
				$sql .= "n3.id_n2='$id_n2' ";
				$sql .= "and n3.id_tema = t.id_tema ";
				$sql .= "and (n3_perfil = '' or n3_perfil isnull) ";
				$sql .= "and (lower(t.kml_tema) != 'nao' or t.kml_tema isnull)";
				$sql .= "and (lower(t.tipoa_tema) != 'wms' or t.tipoa_tema isnull)";
				$sql .= "and (lower(n3.publicado) != 'nao' or n3.publicado isnull) ";
				$temas = pegadados($sql);
				kml_folder($subgrupo["nome_subgrupo"]);
				if(count($temas) > 0)
				{
					foreach ($temas as $tema)
					{kml_tema_bd($tema);}	
				}
				echo "</Folder>\n";
			}
			echo "</Folder>\n";
		}
		echo "</Folder>\n";
	}
}
echo "</Document></kml>\n";
function kml_tema_bd($tema)
{
	global $urli3geo;
	$teste = array_keys($tema);
	if(in_array("link_tema",$teste))
	$fonte = $tema["link_tema"];
	else
	$fonte = "";
	
	$nome = $tema["nome_tema"];
	$id = $tema["codigo_tema"];
	
	if(in_array("desc_tema",$teste))
	$desc = $tema["desc_tema"];
	else
	$desc = "";
	
	$fonte = "<a href='$fonte' >Fonte </a>";
	$legenda = "<a href='$urli3geo/ogc.php?tema=$id&layer=$id&request=getlegendgraphic&service=wms&format=image/jpeg' >Legenda </a>";

	$href = "$urli3geo/ogc.php?tema=$id&amp;width=800&amp;height=800&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;SRS=EPSG:4326&amp;STYLES=&amp;BGCOLOR=0xFFFFFF&amp;FORMAT=image/png&amp;TRANSPARENT=TRUE&amp;layers=$id";
	kml_servico($nome,$fonte,$legenda,$desc,$href);
	
	if(strtolower($tema["kmz_tema"]) == "sim")
	{
		$href = "$urli3geo/pacotes/kmlmapserver/kmlservice.php?request=kmz&amp;map=$id&amp;typename=$id";
		kml_networklink($nome." (vetorial)",$fonte,$legenda,$desc,$href);
	}
}
function kml_cabecalho($nome,$desc)
{
	echo "<Folder>\n";
	echo " <name>".str_replace("&","&amp;",kml_converteTexto($nome))."</name>\n";
	echo " <description>".str_replace("&","&amp;",kml_converteTexto($desc))."</description>\n";
	echo " <open>0</open><visibility>0</visibility>\n";	
}
function kml_folder($nome)
{
	echo " <Folder>\n";
	echo "  <name>".str_replace("&","&amp;",kml_converteTexto($nome))."</name>\n";
	echo "  <description></description>\n";
	echo "  <open>0</open><visibility>0</visibility>\n";
}
function kml_tema($tema)
{
	global $urli3geo;
	$nome = kml_converteTexto($tema->TNOME);
	$desc = kml_converteTexto($tema->TDESC);
	$id = kml_converteTexto($tema->TID);
	$fonte = kml_converteTexto($tema->TLINK);
	$tipoa = "";
	if($tema->TIPOA)
	$tipoa = kml_converteTexto($tema->TIPOA);
	$ogc = sim;
	if($tema->TID)
	{$kml = kml_converteTexto($tema->KML);}
	if(strtolower($kml) != "nao" && strtolower($tipoa) != "wms")
	{
		if($fonte != "")
		$fonte = "<a href='$fonte' >Fonte </a>";
		else
		$fonte = "";
		
		$legenda = "<a href='$urli3geo/ogc.php?tema=$id&layer=$id&request=getlegendgraphic&service=wms&format=image/png' >Legenda </a>";
		$href = "$urli3geo/ogc.php?tema=$id&amp;width=800&amp;height=800&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;SRS=EPSG:4326&amp;STYLES=&amp;BGCOLOR=0xFFFFFF&amp;FORMAT=image/png&amp;TRANSPARENT=TRUE&amp;layers=$id";
		kml_servico($nome,$fonte,$legenda,$desc,$href);
	}
}
function kml_servico($nome,$fonte,$legenda,$desc,$href)
{
	echo "   <GroundOverlay>\n";
	echo "    <name>".str_replace("&","&amp;",kml_converteTexto($nome))."</name>\n";
	echo "    <description><![CDATA[".$fonte.$legenda.$desc."]]></description>\n";
	echo "    <visibility>0</visibility>\n";      
	echo "    <Icon>\n";
	echo "    <viewRefreshMode>onStop</viewRefreshMode>\n";
	echo "    <href>$href</href>\n";
	echo "    </Icon>\n";
	echo "    <LatLonBox><north>9.49014618085</north><south>-39.3925604735</south><east>-29.5851853</east><west>-76.5125927</west></LatLonBox>\n";
	echo "   </GroundOverlay>\n";
}
function kml_networklink($nome,$fonte,$legenda,$desc,$href)
{
	echo "   <NetworkLink>\n";
	echo "    <name>".str_replace("&","&amp;",kml_converteTexto($nome))."</name>\n";
	echo "    <description><![CDATA[".$fonte.$legenda.$desc."]]></description>\n";
	echo "    <visibility>0</visibility>\n";      
	echo "    <Link>\n";
	echo "       <viewRefreshMode>never</viewRefreshMode>\n";
	echo "       <href>$href</href>\n";
	echo "    </Link>\n";
	echo "   </NetworkLink>\n";
}
function kml_converteTexto($i)
{
	global $encoding;
	$encodingatual = mb_detect_encoding($i, 'UTF-8, UTF-7, ASCII, ISO-8859-1');
	return mb_convert_encoding($i,$encoding,$encodingatual);	
}
?>