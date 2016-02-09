<?php
require_once(dirname(__FILE__)."/../../pacotes/cpaint/cpaint2.inc.php");
require_once(dirname(__FILE__)."/../../classesphp/pega_variaveis.php");
require_once(dirname(__FILE__)."/../../classesphp/carrega_ext.php");
if (isset($g_sid))
{session_id($g_sid);}
session_start();
foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}
include(dirname(__FILE__)."/../../pacotes/phpxbase/api_conversion.php");
$cp = new cpaint();
$cp->register('pesquisa');
$cp->start();
$cp->return_data();
function pesquisa()
{
	global $cp,$map_file,$dir_tmp,$imgdir,$uf,$categoria,$ano,$situacao,$mes,$cnpj;
	$parametros = "&uf=$uf&categoria=$categoria&ano=$ano&situacao=$situacao&mes=$mes&cnpj=$cnpj";
		$xml = simplexml_load_file("http://www.mma.gov.br/estruturas/sfb_pflorestal/xml/callWS_plano_manejoA.php?".$parametros);
		var_dump($xml);
	//echo "http://www.mma.gov.br/estruturas/sfb_pflorestal/xml/callWS_plano_manejoA.php?".$parametros;
	if ($xml != FALSE)
	{
		$pontos = array();
		$valores = array();
		foreach($xml->registro as $registro)
		{
			if (count(explode(" ",$registro->coordenadas)) > 0)
			{
				$valores[] = array(
				mb_convert_encoding($registro->municipio,"HTML-ENTITIES","auto"),
				mb_convert_encoding($registro->categoria,"HTML-ENTITIES","auto"),
				mb_convert_encoding($registro->situacao,"HTML-ENTITIES","auto"),
				mb_convert_encoding($registro->coordenadas,"HTML-ENTITIES","auto"),
				mb_convert_encoding($registro->numero_pmfs,"HTML-ENTITIES","auto"),
				mb_convert_encoding($registro->lista_pmfs,"HTML-ENTITIES","auto"),
				mb_convert_encoding($registro->area,"HTML-ENTITIES","auto")
				);
			}
		}
		if (count($valores) == 0)
		{$cp->set_data("erro");}
		else
		{
			$itens = array("municip","categoria","situacao","coords","n_pmfs","pmfs","area");
			$nometemapontos = "$uf $mes-$ano $categoria $situacao";
			adicionatema($map_file,$dir_tmp,$imgdir,$nometemapontos,$itens,$valores);
			$cp->set_data("ok");
		}
	}
	else
	{$cp->set_data("erro");}
}
function adicionatema($map_file,$dir_tmp,$imgdir,$nometemapontos,$itens,$valores)
{
	//$valores &eacute; um array com os valores
	$nomes = "";
	$a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$max = strlen($a)-1;
	for($i=0; $i < 10; $i++)
	{$nomes .= $a{mt_rand(0, $max)};}
	//
	//cria o shape file
	//
	$tipol = MS_SHP_POINT;
	$nomeshp = $dir_tmp."/".$imgdir."/".$nomes;
	// cria o dbf
	$def = array();
	foreach ($itens as $ni)
	{$def[] = array($ni,"C","254");}
	if(!function_exists(dbase_create))
	{xbase_create($nomeshp.".dbf", $def);}
	else
	{dbase_create($nomeshp.".dbf", $def);}

	$dbname = $nomeshp.".dbf";
	$db=xbase_open($dbname,2);
	$novoshpf = ms_newShapefileObj($nomeshp, $tipol);
	foreach ($valores as $v)
	{
		$pontos = explode(" ",trim($v[3]));
		$linha = ms_newLineObj();
		for ($ci = 0;$ci < count($pontos);$ci=$ci+2)
		{$linha->addXY($pontos[$ci],$pontos[$ci+1]);}
		$reg = array($v[0],$v[1],$v[2],$v[3],$v[4],$v[5],$v[6]);
		$shape = ms_newShapeObj($tipol);
		$shape->add($linha);
		$novoshpf->addShape($shape);
		xbase_add_record($db,$reg);
	}
	$novoshpf->free();
	xbase_close($db);
	//adiciona o layer
	$mapa = ms_newMapObj($map_file);
	$layer = ms_newLayerObj($mapa);
	$layer->set("name",$nomes);
	$layer->set("data",$nomeshp);
	$layer->setmetadata("tema",$nometemapontos);
	$layer->setmetadata("classe","sim");
	$layer->set("type",MS_LAYER_POINT);
	$layer->set("status",MS_DEFAULT);
	$classe = ms_newClassObj($layer);
	$estilo = ms_newStyleObj($classe);
	$estilo->set("symbolname","ponto");
	$estilo->set("size",6);
	$cor = $estilo->color;
	$cor->setRGB(255,0,0);
	$salvo = $mapa->save($map_file);
}
?>