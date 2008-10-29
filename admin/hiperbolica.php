<?php
error_reporting(E_ALL);
$xml = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>";
$xml .= "<capa>";
include("../ms_configura.php");
include("$locaplic/admin/php/admin.php");
$menus = pegaDados("SELECT * from i3geoadmin_menus order by nome_menu ",$locaplic);
$xml .= '<termo id="00" nome="i3Geo">';
$contador = 0;
$xml .= '<item id="'.$contador.'" tipo="TE1" nome="Menus" familia="1" />  '."\n";
foreach ($menus as $menu)
{
	$id = $menu["id_menu"];
	$nome = str_replace("&","&amp;",$menu["nome_menu"]);
	$xml .= '<item id="'.$contador.'" tipo="TE2" nome="'.$nome.'" familia="'.$id.'" />  '."\n";
	$grupos = pegaDados("select i3geoadmin_grupos.nome_grupo,id_n1,id_menu from i3geoadmin_n1 LEFT JOIN i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo where id_menu='$id' order by ordem",$locaplic);
	for($i=0;$i < count($grupos);++$i)
	{
		$contador++;
		$nome = str_replace("&","&amp;",$grupos[$i]["nome_grupo"]);
		$idgrupo = $grupos[$i]["id_n1"];
		$xml .= '<item id="'.$contador.'" tipo="TE3" nome="'.$nome.'" familia="'.$id.'" />  '."\n";
		$subgrupos = pegaDados("select i3geoadmin_subgrupos.nome_subgrupo,i3geoadmin_n2.id_n2 from i3geoadmin_n2 LEFT JOIN i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo where i3geoadmin_n2.id_n1='$idgrupo' order by ordem",$locaplic);
		for($j=0;$j < count($subgrupos);++$j)
		{
			$contador++;
			$nome = str_replace("&","&amp;",$subgrupos[$j]["nome_subgrupo"]);
			$xml .= '<item id="'.$contador.'" tipo="TE4" nome="'.$nome.'" familia="'.$id.'" />  '."\n";
			$id_n2 = $subgrupos[$j]["id_n2"];
			$temas = pegaDados("select i3geoadmin_temas.tags_tema,i3geoadmin_temas.nome_tema,i3geoadmin_n3.id_n3 from i3geoadmin_n3 LEFT JOIN i3geoadmin_temas ON i3geoadmin_n3.id_tema = i3geoadmin_temas.id_tema where i3geoadmin_n3.id_n2='$id_n2' order by ordem",$locaplic);
			for($k=0;$k < count($temas);++$k)
			{
				$contador++;
				$nome = str_replace("&","&amp;",$temas[$k]["nome_tema"]);
				$xml .= '<item id="'.$contador.'" tipo="TE5" nome="'.$nome.'" familia="'.$id.'" />  '."\n";
				$tags = explode(" ",$temas[$k]["tags_tema"]);
				foreach($tags as $tag)
				{
					$contador++;
					$tag = str_replace("&","&amp;",$tag);
					if($tag != "")
					$xml .= '<item id="'.$contador.'" tipo="TE6" nome="'.$tag.'" familia="'.$id.'" />  '."\n";
				}
			}
		}
	}
}
$contador++;
$id = $contador;
$xml .= '<item id="'.$contador.'" tipo="TE1" nome="GRUPOS" familia="2" />  '."\n";
$grupos = pegaDados("select i3geoadmin_grupos.nome_grupo,id_n1,id_menu from i3geoadmin_n1 LEFT JOIN i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo order by ordem",$locaplic);
for($i=0;$i < count($grupos);++$i)
{
	$contador++;
	$nome = str_replace("&","&amp;",$grupos[$i]["nome_grupo"]);
	$idgrupo = $grupos[$i]["id_n1"];
	$xml .= '<item id="'.$contador.'" tipo="TE2" nome="'.$nome.'" familia="'.$id.'" />  '."\n";
	$temastag = pegaDados("select d.tags_tema as tags,d.id_tema as tema from i3geoadmin_n2 as b,i3geoadmin_n1 as a,i3geoadmin_n3 as c,i3geoadmin_temas as d where a.id_grupo = '$idgrupo' and a.id_n1 = b.id_n1 and c.id_n2 = b.id_n2 and c.id_tema = d.id_tema group by tema",$locaplic);
	$arrayTag = array();
	foreach($temastag as $tematag)
	{
		$arrayTag = array_merge($arrayTag,explode(" ",$tematag["tags"]));
	}
	$arrayTag = array_unique($arrayTag);
	//var_dump($arrayTag);
	foreach($arrayTag as $tag)
	{
		$tag = str_replace("&","&amp;",$tag);
		$contador++;
		if($tag != "")
		$xml .= '<item id="'.$contador.'" tipo="TE3" nome="'.$tag.'" familia="'.$id.'" />  '."\n";	
	}		
}	
$id = $contador;
$xml .= '<item id="'.$contador.'" tipo="TE1" nome="Web Services" familia="3" />  '."\n";
$tipos = pegaDados("select tipo_ws from i3geoadmin_ws group by tipo_ws",$locaplic);
foreach ($tipos as $tipo)
{
	$contador++;
	$xml .= '<item id="'.$contador.'" tipo="TE2" nome="'.$tipo["tipo_ws"].'" familia="'.$id.'" />  '."\n";
	$ws = pegaDados("select nome_ws from i3geoadmin_ws where tipo_ws = '".$tipo["tipo_ws"]."'",$locaplic);
	foreach($ws as $w)
	{
		$contador++;
		$nome = str_replace("&","&amp;",$w["nome_ws"]);
		if($nome != "")
		$xml .= '<item id="'.$contador.'" tipo="TE3" nome="'.$nome.'" familia="'.$tipo["tipo_ws"].'" />  '."\n";		
	}
}


$xml .= "</termo>";
$xml .= "</capa>";
//header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . 'GMT');
//header('Cache-Control: no-cache, must-revalidate');
//header('Pragma: no-cache');
header("Content-type: text/xml; charset=ISO-8859-1");
echo $xml;
?> 
