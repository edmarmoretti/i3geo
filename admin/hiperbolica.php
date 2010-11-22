<?php
/*
Title: hiperbolica

Cria um arquivo no formato XML para o aplicativo árvore hiperbólica.

A árvore hiperbólica é montada por um applet que carrega um XML contendo a estrutura de nós.

Esse programa lê o banco de administração e monta o XML contendo os menus, grupos, subgrupos e temas.

A hierarquia dos nós é codificada com os elementos armazenados em "tipo".

O elemento "familia" armazena dados que podem ser utilizados e funções javascript da árvore. Por exemplo, quando o nó
for um tema, o código do tema é guardado nesse elemento.

Para ver o XML utilize <http://localhost/i3geo/admin/hiperbolica.php>

Para ver a árvore, utilize <http://localhost/i3geo/pacotes/arvorehiper/index.php>

Licenca:

GPL2

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

Arquivo:

i3geo/admin/hiperbolica.php
*/

error_reporting(0);
include("../ms_configura.php");
include("$locaplic/admin/php/admin.php");
include("$locaplic/admin/php/conexao.php");
$encoding = "UTF-8";
if($convUTF)
$xml = "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">";
else
{
	$xml = "<"."\x3F"."xml version='1.0' encoding='ISO-8859-1' "."\x3F".">";
	$encoding = "ISO-8859-1";
}
$xml .= "<capa>";
//
//obtém a lista de menus
//
$menus = pegaDados("SELECT * from i3geoadmin_menus order by nome_menu ",$locaplic);
$xml .= '<termo cor="#FFFFFF" id="00" nome="Dados geo">';
$contador = 0;
$xml .= '<item cor="#FFFFCC" id="'.$contador.'" tipo="TE1" nome="Menus" familia="1" />  '."\n";
//
//varre cada menu
//
foreach ($menus as $menu)
{
	if(strtolower($menu["publicado_menu"]) == "nao")
	{continue;}
	$id = $menu["id_menu"];
	$nome = html_entity_decode($menu["nome_menu"]);
	$nome = h_converteTexto($nome);
	//menu
	$xml .= '<item cor="#FFFF99" id="'.$contador.'" tipo="TE2" nome="'.$nome.'" familia="'.$id.'" />  '."\n";
	//
	//obtém a lista de grupos
	//
	$grupos = pegaDados("select i3geoadmin_grupos.nome_grupo,id_n1,id_menu from i3geoadmin_n1 LEFT JOIN i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo where id_menu='$id' order by ordem",$locaplic);
	for($i=0;$i < count($grupos);++$i)
	{
		$contador++;
		$nome = html_entity_decode($grupos[$i]["nome_grupo"]);
		$nome = h_converteTexto($nome);
		$idgrupo = $grupos[$i]["id_n1"];
		//grupo
		$xml .= '<item cor="#FFCC99" id="'.$contador.'" tipo="TE3" nome="'.$nome.'" familia="'.$id.'" />  '."\n";
		$contador++;
		//
		//obtem os temas na raiz do grupo
		//
		$temasRaizGrupo = pegaDados("select i3geoadmin_temas.tags_tema as tags_tema,i3geoadmin_temas.codigo_tema as codigo_tema,i3geoadmin_raiz.id_tema,nome_tema as nome_tema,perfil FROM i3geoadmin_raiz LEFT JOIN i3geoadmin_temas ON i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema where i3geoadmin_raiz.nivel = 1 and i3geoadmin_raiz.id_nivel = ".$grupos[$i]["id_n1"]." order by ordem");
		//var_dump($temasRaizGrupo);exit;
		$t = obtemTemas($temasRaizGrupo,$contador,$id);
		$xml .= $t[0];
		$contador += $t[1];		
		//
		//obtem os subgrupos
		//
		$subgrupos = pegaDados("select i3geoadmin_subgrupos.nome_subgrupo,i3geoadmin_n2.id_n2 from i3geoadmin_n2 LEFT JOIN i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo where i3geoadmin_n2.id_n1='$idgrupo' order by ordem",$locaplic);
		if(count($subgrupos) > 0)
		$xml .= '<item cor="#FF9966" id="'.$contador.'" tipo="TE4" nome="SUBGRUPOS" familia="'.$id.'" />  '."\n";		
		for($j=0;$j < count($subgrupos);++$j)
		{
			$contador++;
			$nome = html_entity_decode($subgrupos[$j]["nome_subgrupo"]);
			$nome = h_converteTexto($nome);
			//subgrupo
			$xml .= '<item cor="#FF9900" id="'.$contador.'" tipo="TE5" nome="'.$nome.'" familia="'.$id.'" />  '."\n";
			$contador++;
			$xml .= '<item cor="#FF6633" id="'.$contador.'" tipo="TE6" nome="TEMAS" familia="'.$id.'" />  '."\n";
			$id_n2 = $subgrupos[$j]["id_n2"];
			$temas = pegaDados("select i3geoadmin_temas.tags_tema,i3geoadmin_temas.nome_tema,i3geoadmin_temas.codigo_tema,i3geoadmin_n3.id_n3 from i3geoadmin_n3 LEFT JOIN i3geoadmin_temas ON i3geoadmin_n3.id_tema = i3geoadmin_temas.id_tema where i3geoadmin_n3.id_n2='$id_n2' order by ordem",$locaplic);
			$t = obtemTemas($temas,$contador,$id);
			$xml .= $t[0];
			$contador += $t[1];
		}
	}
}
$contador++;
$id = $contador;
$xml .= '<item cor="#FFFFCC" id="'.$contador.'" tipo="TE1" nome="GRUPOS" familia="2" />  '."\n";
$grupos = pegaDados("select i3geoadmin_grupos.nome_grupo,id_n1,id_menu from i3geoadmin_n1 LEFT JOIN i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo order by ordem",$locaplic);
for($i=0;$i < count($grupos);++$i)
{
	$contador++;
	$nome = html_entity_decode($grupos[$i]["nome_grupo"]);
	$nome = h_converteTexto($nome);
	$idgrupo = $grupos[$i]["id_n1"];
	$xml .= '<item cor="#FFFF99" id="'.$contador.'" tipo="TE2" nome="'.$nome.'" familia="'.$id.'" />  '."\n";
	$temastag = pegaDados("select d.tags_tema as tags,d.id_tema as tema from i3geoadmin_n2 as b,i3geoadmin_n1 as a,i3geoadmin_n3 as c,i3geoadmin_temas as d where a.id_grupo = '$idgrupo' and a.id_n1 = b.id_n1 and c.id_n2 = b.id_n2 and c.id_tema = d.id_tema group by tema,d.tags_tema",$locaplic);
	$arrayTag = array();
	foreach($temastag as $tematag)
	{
		$arrayTag = array_merge($arrayTag,explode(" ",$tematag["tags"]));
	}
	$arrayTag = array_unique($arrayTag);
	//var_dump($arrayTag);
	if(count($arrayTag > 0))
	{
		$contador++;
		$xml .= '<item cor="#FFCC99" id="'.$contador.'" tipo="TE3" nome="TAGs" familia="'.$id.'" />  '."\n";	
		foreach($arrayTag as $tag)
		{
			$tag = html_entity_decode($tag);
			$tag = h_converteTexto($tag);
			$contador++;
			if($tag != "")
			$xml .= '<item cor="#33CCFF" id="'.$contador.'" tipo="TE4" nome="'.$tag.'" familia="tag,'.$tag.'" />  '."\n";	
		}
	}		
}	
$id = $contador;
$xml .= '<item cor="#FFFFCC" id="'.$contador.'" tipo="TE1" nome="Web Services" familia="3" />  '."\n";
$tipos = pegaDados("select tipo_ws from i3geoadmin_ws group by tipo_ws",$locaplic);
foreach ($tipos as $tipo)
{
	$contador++;
	$xml .= '<item cor="#FFFF99" id="'.$contador.'" tipo="TE2" nome="'.$tipo["tipo_ws"].'" familia="'.$id.'" />  '."\n";
	$ws = pegaDados("select link_ws,nome_ws from i3geoadmin_ws where tipo_ws = '".$tipo["tipo_ws"]."'",$locaplic);
	foreach($ws as $w)
	{
		$contador++;
		$nome = html_entity_decode($w["nome_ws"]);
		$nome = h_converteTexto($nome);
		$link = str_replace("&","&amp;",$w["link_ws"]);
		if($nome != "")
		$xml .= '<item cor="#33CCFF" id="'.$contador.'" tipo="TE3" nome="'.$nome.'" familia="'.$tipo["tipo_ws"].",".$link.'" />  '."\n";		
	}
}
$xml .= "</termo>";
$xml .= "</capa>";
//header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . 'GMT');
//header('Cache-Control: no-cache, must-revalidate');
//header('Pragma: no-cache');
header("Content-type: application/xml");

echo $xml;
/*
Converte o encoding conforme definido em $i
*/
function h_converteTexto($i)
{
	global $encoding;
	$s = mb_detect_encoding($i, 'UTF-8, UTF-7, ASCII, ISO-8859-1');
	return mb_convert_encoding($i,$encoding,$s);	
}
function obtemTemas($temas,$contador,$id)
{
	$xml = "";
	for($k=0;$k < count($temas);++$k)
	{
		$contador++;
		$nome = html_entity_decode($temas[$k]["nome_tema"]);
		$nome = h_converteTexto($nome);
		$nid = "tema,".$temas[$k]["codigo_tema"];
		if($nome != "")
		{
			//tema
			$xml .= '<item cor="#33CCFF" id="'.$contador.'" tipo="TE7" nome="'.$nome.'" familia="'.$nid.'" />  '."\n";
			$contador++;
			$tags = explode(" ",$temas[$k]["tags_tema"]);
			if(count($tags) > 0 && $temas[$k]["tags_tema"] != "")
			{
				//tags
				$xml .= '<item cor="#99cccc" id="'.$contador.'" tipo="TE8" nome="TAGs" familia="'.$id.'" />  '."\n";
				foreach($tags as $tag)
				{
					$contador++;
					$tag = html_entity_decode($tag);
					$tag = h_converteTexto($tag);
					if($tag != "")
					$xml .= '<item cor="#ffffff" id="'.$contador.'" tipo="TE9" nome="'.$tag.'" familia="tag,'.$tag.'" />  '."\n";
				}
			}
		}
	}
	$retorno[] = $xml;
	$retorno[] = $contador;
	return $retorno;
}
?> 
