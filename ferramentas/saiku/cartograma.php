<?php
if(empty($_POST["g_sid"])){
	echo "erro";
	exit;
}
include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include(dirname(__FILE__)."/../../admin/php/classe_metaestat.php");
include_once(dirname(__FILE__)."/../../classesphp/classe_estatistica.php");
if(!isset($dir_tmp)){
	include(dirname(__FILE__)."/../../ms_configura.php");
}

//pega o filtro da sessao PHP aberta pelo i3Geo
session_name("i3GeoPHP");
session_id($_POST["g_sid"]);
session_start();
//obtem os layers que sao do sistema metaestat, sao regioes e que possuem selecao
$map_file = $_SESSION["map_file"];
$dados = (array) json_decode($_POST["dados"],true);
$opcoes = (array) json_decode($_POST["opcoes"],true);

$metadados = (array) json_decode($_POST["metadados"],true);
$nmetadados = count($metadados);
//pega o id da regiao (busca pelo posfixo geocod)
$codigo_tipo_regiao = $metadados[0]["identificador"];
$codigo_tipo_regiao = explode("].[",$codigo_tipo_regiao);
$codigo_tipo_regiao = str_replace(array("codigo_tipo_regiao_","[","_geocod"),"",$codigo_tipo_regiao[0]);

if(empty($codigo_tipo_regiao)){
	echo "Nao foi possivel determinar o codigo da regiao ou localidade no sistema Metaestat";
	exit;
}
$m = new Metaestat();

$meta = $m->listaTipoRegiao($codigo_tipo_regiao);
$titulolayer = $meta["nome_tipo_regiao"];
if(empty($titulolayer)){
	echo "Nao foi possivel encontrar a regiao ou localidade no sistema Metaestat";
	exit;
}
$titulolayer = mb_convert_encoding($titulolayer,"ISO-8859-1",mb_detect_encoding($titulolayer));
$conexao = $m->listaConexao($meta["codigo_estat_conexao"],true);
$conexao = "user=".$conexao["usuario"]." password=".$conexao["senha"]." dbname=".$conexao["bancodedados"]." host=".$conexao["host"]." port=".$conexao["porta"]."";
$colunageo = $meta["colunageo"];
$sqlColunaGeo = $meta["colunageo"];
$srid = $meta["srid"];
$colunastabela = $m->colunasTabela($meta["codigo_estat_conexao"],$meta["esquemadb"],$meta["tabela"],"geometry","!=");
$tipoLayer = "POLYGON";
//define a coluna geo correta
if($opcoes["tipo"] == "raiosProporcionais" || $opcoes["tipo"] == "circulosProporcionais"){
	if($meta["colunacentroide"] != ""){
		$colunageo = $meta["colunacentroide"];
		$sqlColunaGeo = $meta["colunacentroide"];
	}
	else{
		$sqlColunaGeo = "st_centroid(".$meta["colunageo"].")";
	}
	$tipoLayer = "POINT";
}
//var_dump($metadados);exit;
//constroi um sql que retorna os dados na forma de uma tabela inline
$nomesColunas = array();
$valores = array();
for($i=0;$i<$nmetadados;$i++){
	if($metadados[$i]["colName"] != ""){
		$nomesColunas[] = $metadados[$i]["colName"];
	}
}
$nomesColunas[0] = "geocodigo";
$codigosRegioes = array();
//select * from (values (1000,2),(5,6)) as teste ("a","b") where

foreach($dados as $dado){
	//$codigosRegioes[] = $dado[0];
	$linha = array();
	for($i=0;$i<$nmetadados;$i++){
		$linha[] = $dado[$i];
	}
	$valores[] = "(".implode(",",$linha).")";
}
$sqldados = "
	select st_setsrid(".$sqlColunaGeo.",".$srid.") as $colunageo, ".implode(",",$colunastabela).",dataset.*
	from ".$meta["esquemadb"].".".$meta["tabela"]." INNER JOIN
	(values ".implode(",",$valores).') as dataset ("'.implode('","',$nomesColunas).'") ON geocodigo = '.$meta["identificador"];
$sqlmapa = $colunageo." from ($sqldados) as foo using unique gid using srid=$srid";
$mapa = ms_newMapObj($map_file);
$nlayers = $mapa->numlayers;
for($i=0;$i<$nlayers;$i++){
	$ll = $mapa->getlayer($i);
	if($ll->getmetadata("SAIKU") == $opcoes["tipo"]){
		$ll->set("status",MS_DELETE);
	}
	else{
		if($ll->getmetadata("SAIKU") != ""){
			$ll->set("status",MS_OFF);
		}
	}
}

$layer = ms_newLayerObj($mapa);
$nomeLayer = nomeRandomico();
$l = array();
$l[] = "LAYER";
$l[] = '	NAME "'.$nomeLayer.'"';
$l[] = "	TYPE $tipoLayer";
$l[] = "	DATA '".$sqlmapa."'";
$l[] = '	CONNECTION "'.$conexao.'"';
$l[] = '	CONNECTIONTYPE POSTGIS';
$l[] = '	TEMPLATE "none.htm"';
$l[] = '	STATUS DEFAULT';
$l[] = '	METADATA';
$l[] = '		TEMA "'.$titulolayer.' - '.$nomesColunas[1].' - '.$opcoes["tipo"].'"';
$l[] = '		CLASSE "SIM"';
$l[] = '		SAIKU "'.$opcoes["tipo"].'"';
$l[] = '		TIP "'.$meta["colunanomeregiao"].','.implode(',',$nomesColunas).'"';
$l[] = '		METAESTAT_CODIGO_TIPO_REGIAO "'.$codigo_tipo_regiao.'"';
$l[] = '	END	';
$l = implode("",$l);
if($opcoes["tipo"] == "raiosProporcionais"){
	$l .= implode(" ",raiosProporcionais(1,$nomesColunas[1]));
}
if($opcoes["tipo"] == "circulosProporcionais"){
	$l .= '	OPACITY 50';
	$l .= implode(" ",circulosProporcionais(1,$nomesColunas[1]));
}
if($opcoes["tipo"] == "coresChapadas"){
	$l .= '	OPACITY 50';
	$l .= implode(" ",coresChapadas(1,$nomesColunas[1]));
}
$l .= 'END';
//echo $l;exit;
$layer->updateFromString($l);

$mapa->save($map_file);

if($opcoes["tipo"] == "coresChapadas"){
	include(dirname(__FILE__)."/../../classesphp/classe_alteraclasse.php");
	$m = new Alteraclasse($map_file,$nomeLayer);
	$cor = $opcoes["cores"][0];
	$cori = $cor["red"].','.$cor["green"].','.$cor["blue"];
	$cor = $opcoes["cores"][1];
	$corf = $cor["red"].','.$cor["green"].','.$cor["blue"];
	$retorno = $m->alteraCoresClasses($cori,$corf);
	$m->salva();
}

header("Location:".$opcoes["locaplic"]."/mashups/openlayers.php?temas=".$map_file."&DESLIGACACHE=sim&botoes=legenda,pan,zoombox,zoomtot,zoomin,zoomout,distancia,area,identifica&controles=navigation,layerswitcher,scaleline,mouseposition,overviewmap,keyboarddefaults&tiles=false&mapext=".$opcoes["mapext"]);

function coresChapadas($coluna,$nomeColuna){
	global $opcoes;
	$valores = retornaDadosColuna($coluna);
	$cortes = quartis($valores,$nomeColuna);
	//var_dump($cortes);exit;
	$nclasses = count($cortes["nomes"]);
	$classes = array();
	$size = 10;
	for($i=0;$i<$nclasses;$i++){
		$nome = $cortes["nomes"][$i];
		$exp = $cortes["exp"][$i];
		$classes[] = PHP_EOL.'CLASS';
		$classes[] = '	NAME "'.$nome.'"';
		$classes[] = '	EXPRESSION '.$exp;
		$classes[] = '	STYLE';
		$cor = $opcoes["cores"][0];
		$classes[] = '		COLOR '.$cor["red"].' '.$cor["green"].' '.$cor["blue"];
		$classes[] = '		SIZE '.($opcoes["size"] * $i);
		$classes[] = '		OUTLINECOLOR 255 255 255';
		$classes[] = '	END';
		$classes[] = 'END	';
	}
	return $classes;
}
function raiosProporcionais($coluna,$nomeColuna){
	global $opcoes;
	$valores = retornaDadosColuna($coluna);
	$cortes = quartis($valores,$nomeColuna);
	//var_dump($cortes);exit;
	$nclasses = count($cortes["nomes"]);
	$classes = array();
	$size = 10;
	for($i=0;$i<$nclasses;$i++){
		$nome = $cortes["nomes"][$i];
		$exp = $cortes["exp"][$i];
		$classes[] = PHP_EOL.'CLASS';
		$classes[] = '	NAME "'.$nome.'"';
		$classes[] = '	EXPRESSION '.$exp;
		$classes[] = '	STYLE';
		$cor = $opcoes["cores"][0];
		$classes[] = '		OUTLINECOLOR '.$cor["red"].' '.$cor["green"].' '.$cor["blue"];
		$classes[] = '		WIDTH 2';
		$classes[] = '		SYMBOL "ponto"';
		$classes[] = '		SIZE '.($opcoes["size"] * $i);
		$classes[] = '		COLOR -1 -1 -1';
		$classes[] = '	END';
		$classes[] = 'END	';
	}
	return $classes;
}
function circulosProporcionais($coluna,$nomeColuna){
	global $opcoes;
	$valores = retornaDadosColuna($coluna);
	$cortes = quartis($valores,$nomeColuna);
	//var_dump($cortes);exit;
	$nclasses = count($cortes["nomes"]);
	$classes = array();
	$size = 10;
	for($i=0;$i<$nclasses;$i++){
		$nome = $cortes["nomes"][$i];
		$exp = $cortes["exp"][$i];
		$classes[] = PHP_EOL.'CLASS';
		$classes[] = '	NAME "'.$nome.'"';
		$classes[] = '	EXPRESSION '.$exp;
		$classes[] = '	STYLE';
		$cor = $opcoes["cores"][0];
		$classes[] = '		COLOR '.$cor["red"].' '.$cor["green"].' '.$cor["blue"];
		$classes[] = '		WIDTH 1';
		$classes[] = '		SYMBOL "ponto"';
		$classes[] = '		SIZE '.($opcoes["size"] * $i);
		$classes[] = '		OUTLINECOLOR 255 255 255';
		$classes[] = '	END';
		$classes[] = 'END	';
	}
	return $classes;
}

function quartis($valores,$nomeColuna){
	$estat = new estatistica();
	$estat->calcula($valores);
	$calc = $estat->resultado;
	$nomes = array();
	$expressao = array();
	$expressao[] = "([".$nomeColuna."]<=".($calc["quartil1"]).")";
	$expressao[] = "(([".$nomeColuna."]>".($calc["quartil1"]).")and([".$nomeColuna."]<=".($calc["quartil2"])."))";
	if($calc["quartil3"] != 0){
		$expressao[] = "(([".$nomeColuna."]>".($calc["quartil2"]).")and([".$nomeColuna."]<=".($calc["quartil3"])."))";
		$expressao[] = "([".$nomeColuna."]>".($calc["quartil3"]).")";
	}
	$nomes[] = "Q1 valor <= ".($calc["quartil1"]);
	$nomes[] = "Q2 valor > ".($calc["quartil1"])." e valor <= ".($calc["quartil2"]);
	if($calc["quartil3"] != 0){
		$nomes[] = "Q3 valor > ".($calc["quartil2"])." e valor <= ".($calc["quartil3"]);
		$nomes[] = "Q4 valor > ".($calc["quartil3"]);
	}
	return array("nomes"=>$nomes,"exp"=>$expressao);
}
function retornaDadosColuna($coluna){
	global $dados;
	$valores = array();
	foreach($dados as $dado){
		$valores[] = $dado[$coluna];
	}
	return $valores;
}
?>
