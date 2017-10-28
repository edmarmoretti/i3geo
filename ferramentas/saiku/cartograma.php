<?php
if(empty($_POST["g_sid"])){
	echo "erro";
	exit;
}
include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include(dirname(__FILE__)."/../../classesphp/classe_metaestatinfo.php");
include_once(dirname(__FILE__)."/../../classesphp/classe_estatistica.php");
if(!isset($dir_tmp)){
	include(dirname(__FILE__)."/../../ms_configura.php");
}
if(isset($statusFerramentas) && $statusFerramentas["saiku"] != true){
	echo "A ferramenta SAIKU n&atilde;o est&aacute; ativada em ms_configura.php";
    exit;
}
include(dirname(__FILE__)."/../blacklist.php");
if(in_array("saiku",$i3geoBlFerramentas)){
    echo "Ferramenta bloqueada em ms_configura.php";
}
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);

//error_reporting(E_ALL);

//pega o filtro da sessao PHP aberta pelo i3Geo
session_name("i3GeoPHP");
session_id($_POST["g_sid"]);
session_start();
//obtem os layers que sao do sistema metaestat, sao regioes e que possuem selecao
$map_file = $_SESSION["map_file"];
//remove as camadas do SAIKU
$opcoes = (array) json_decode($_POST["opcoes"],true);
if($_POST["dados"] == ""){
	$mapa = ms_newMapObj($map_file);
	$nlayers = $mapa->numlayers;
	for($i=0;$i<$nlayers;$i++){
		$ll = $mapa->getlayer($i);
		if($ll->getmetadata("SAIKU") != ""){
			$ll->set("status",MS_DELETE);
		}
	}
	$mapa->save($map_file);
}
else{
	$dados = (array) json_decode($_POST["dados"],true);
	$metadados = (array) json_decode($_POST["metadados"],true);
	$nmetadados = count($metadados);
	//pega o id da regiao (busca pelo posfixo geocod)
	$codigo_tipo_regiao = $metadados[0]["colName"];
	$codigo_tipo_regiao = explode("#",$codigo_tipo_regiao);
	$codigo_tipo_regiao = $codigo_tipo_regiao[1];
	/*
	echo "<pre>";
	var_dump($metadados);
	echo $codigo_tipo_regiao;exit;
	*/
	if(empty($codigo_tipo_regiao)){
		echo "Nao foi possivel determinar o codigo da regiao ou localidade no sistema Metaestat";
		exit;
	}
	$m = new MetaestatInfo();

	$meta = $m->listaTipoRegiao($codigo_tipo_regiao);
	$titulolayer = $meta["nome_tipo_regiao"];
	if(empty($titulolayer)){
		echo "Nao foi possivel encontrar a regiao ou localidade no sistema Metaestat";
		exit;
	}
	$titulolayer = mb_convert_encoding($titulolayer,"ISO-8859-1",mb_detect_encoding($titulolayer));
	//$conexao = $m->listaConexao($meta["codigo_estat_conexao"],true);
	$conexao = $m->listaConexaoMetaestat();
	$conexao = "user=".$conexao["usuario"]." password=".$conexao["senha"]." dbname=".$conexao["bancodedados"]." host=".$conexao["host"]." port=".$conexao["porta"]."";
	$colunageo = $meta["colunageo"];
	$sqlColunaGeo = $meta["colunageo"];
	$srid = $meta["srid"];
	$colunastabela = $m->colunasTabela($meta["codigo_estat_conexao"],$meta["esquemadb"],$meta["tabela"],"geometry","!=");
	$tipoLayer = "POLYGON";
	//define a coluna geo correta
	if($opcoes["tipo"] == "calor" || $opcoes["tipo"] == "mapaPizzas" || $opcoes["tipo"] == "mapaBarras" || $opcoes["tipo"] == "raiosProporcionais" || $opcoes["tipo"] == "circulosProporcionais"){
		if($meta["colunacentroide"] != ""){
			$colunageo = $meta["colunacentroide"];
			$sqlColunaGeo = $meta["colunacentroide"];
		}
		$sqlColunaGeo = "st_centroid(".$colunageo.")";
		$tipoLayer = "POINT";
		if($opcoes["tipo"] == "mapaBarras" || $opcoes["tipo"] == "mapaPizzas"){
			$tipoLayer = "CHART";
		}
	}
	//var_dump($metadados);exit;
	//constroi um sql que retorna os dados na forma de uma tabela inline
	$nomesColunas = array();
	$metadataItens = array();
	$valores = array();
	for($i=0;$i<$nmetadados;$i++){
		if($metadados[$i]["colName"] != ""){
			$nomesColunas[] = "coluna".$i;//$metadados[$i]["colName"];
			$metadataItens[] = $metadados[$i]["colName"];
		}
	}
	$nomesColunas[0] = "geocodigo";
	$metadataItens[0] = "geocodigo";
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
	//
	//o nome da coluna com os dados e acentuado em alguns casos
	//por isso, camadas baseadas em plugins precisam mudar isso
	if($opcoes["tipo"] == "calor" && count($nomesColunas) > 1){
		$nomesColunas[count($nomesColunas) - 1] = "colunaCalor";
	}
	$sqldados = "
		select st_setsrid(".$sqlColunaGeo.",".$srid.") as $colunageo, ".implode(",",$colunastabela).",dataset.*
		from ".$meta["esquemadb"].".".$meta["tabela"]." INNER JOIN
		(values ".implode(",",$valores).') as dataset ("'.implode('","',$nomesColunas).'") ON geocodigo = '.$meta["identificador"];
	$sqlmapa = $colunageo." from ($sqldados) as foo using unique ".$meta["identificador"]." using srid=$srid";

	//para o tema com o outline caso o saiku tenha sido aberto de fora do i3Geo
	$sqldados1 = "
	select st_setsrid(".$meta["colunageo"].",".$srid.") as ".$meta["colunageo"].", ".implode(",",$colunastabela).",dataset.*
	from ".$meta["esquemadb"].".".$meta["tabela"]." INNER JOIN
	(values ".implode(",",$valores).') as dataset ("'.implode('","',$nomesColunas).'") ON geocodigo = '.$meta["identificador"];

	$sqlmapa1 = $meta["colunageo"]." from ($sqldados1) as foo using unique ".$meta["identificador"]." using srid=$srid";

	$mapa = ms_newMapObj($map_file);
	$nlayers = $mapa->numlayers;
	for($i=0;$i<$nlayers;$i++){
		$ll = $mapa->getlayer($i);
		$ll->set("status",MS_DELETE);
		/*
		if($ll->getmetadata("SAIKU") == $opcoes["tipo"]){
			$ll->set("status",MS_DELETE);
		}
		else{
			if($ll->getmetadata("SAIKU") != ""){
				$ll->set("status",MS_OFF);
			}
		}
		*/
		if($ll->getmetadata("tema") == "Limites"){
			$ll->set("status",MS_DELETE);
		}
		if(strtoupper($ll->getmetadata("classe")) == "NAO" || $ll->getmetadata("classe") == ""){
			$ll->set("status",MS_DELETE);
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
	if($opcoes["tipo"] == "mapaBarras" || $opcoes["tipo"] == "mapaPizzas"){
		$l[] = '		TEMA "'.$titulolayer.' - '.$opcoes["tipo"].'"';
	}
	else{
		$l[] = '		TEMA "'.$titulolayer.' - '.$metadataItens[1].' - '.$opcoes["tipo"].'"';
	}
	$l[] = '		CLASSE "SIM"';
	$l[] = '		SAIKU "'.$opcoes["tipo"].'"';
	$l[] = '		TIP "'.$meta["colunanomeregiao"].','.implode(',',$nomesColunas).'"';
	$l[] = '		ITENSDESC "'.$meta["colunanomeregiao"].','.implode(',',$metadataItens).'"';
	$l[] = '		ITENS "'.$meta["colunanomeregiao"].','.implode(',',$nomesColunas).'"';
	$l[] = '		METAESTAT_CODIGO_TIPO_REGIAO "'.$codigo_tipo_regiao.'"';
	$l[] = '		TILES "NAO"';
	$l[] = '	END	';

	$l = implode(PHP_EOL,$l);

	if($opcoes["tipo"] == "raiosProporcionais"){
		$l .= implode(PHP_EOL,raiosProporcionais(1,$nomesColunas[1]));
	}
	if($opcoes["tipo"] == "circulosProporcionais"){
		$l .= '	OPACITY 50';
		$l .= implode(PHP_EOL,circulosProporcionais(1,$nomesColunas[1]));
	}
	if($opcoes["tipo"] == "coresChapadas"){
		$l .= '	OPACITY 50';
		$l .= implode(PHP_EOL,coresChapadas(1,$nomesColunas[1]));
	}
	if($opcoes["tipo"] == "mapaBarras"){
		$l .= PHP_EOL.' PROCESSING "CHART_SIZE='.$opcoes["size"].' '.$opcoes["size"].'"';
		$l .= PHP_EOL.' PROCESSING "CHART_TYPE=bar"';
		$l .= implode(PHP_EOL,mapaBarras($nomesColunas,$metadataItens));
	}
	if($opcoes["tipo"] == "mapaPizzas"){
		$l .= PHP_EOL.' PROCESSING "CHART_SIZE='.$opcoes["size"].' '.$opcoes["size"].'"';
		$l .= PHP_EOL.' PROCESSING "CHART_TYPE=pie"';
		$l .= implode(PHP_EOL,mapaBarras($nomesColunas,$metadataItens));
	}
	$l .= PHP_EOL.'END';

	//echo $l;exit;
	$layer->updateFromString($l);

	//inclui o layer com o contorno se for o caso
	if($opcoes["tipo"] != "calor" && empty($_GET["origem"]) && ($tipoLayer == "CHART" || $tipoLayer == "POINT")){
		$layer = ms_newLayerObj($mapa);
		$nomeLayer = nomeRandomico();
		$l = array();
		$l[] = "LAYER";
		$l[] = '	NAME "'.$nomeLayer.'"';
		$l[] = "	TYPE POLYGON";
		$l[] = "	DATA '".$sqlmapa1."'";
		$l[] = '	CONNECTION "'.$conexao.'"';
		$l[] = '	CONNECTIONTYPE POSTGIS';
		$l[] = '	TEMPLATE "none.htm"';
		$l[] = '	STATUS DEFAULT';
		$l[] = '	METADATA';
		$l[] = '		TEMA "Limites"';
		$l[] = '		CLASSE "SIM"';
		$l[] = '		SAIKU "'.$opcoes["tipo"].'"';
		$l[] = '		METAESTAT_CODIGO_TIPO_REGIAO "'.$codigo_tipo_regiao.'"';
		$l[] = '		TILES "NAO"';
		$l[] = '	END	';
		$l[] = '	CLASS	';
		$l[] = '	OUTLINECOLOR 255 255 255	';
		$l[] = '	END	';
		$l[] = 'END	';
		$l = implode(PHP_EOL,$l);
		$layer->updateFromString($l);
	}

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
	if($opcoes["tipo"] == "calor"){
		$parametros = '{"plugin":"heatmap","parametros":{"tipoGradiente":"default","opacity":".8","valorPonto":'.$opcoes["valorPonto"].',"coluna":"'.$nomesColunas[1].'","radius":"'.$opcoes["raio"].'"}}';
		$layer->setmetadata("PLUGINI3GEO",$parametros);
		$layer->setmetadata("SAIKU",$opcoes["tipo"]);
		$mapa->save($map_file);
	}
}

header("Location:".$opcoes["locaplic"]."/mashups/openlayers.php?temas=".$map_file."&DESLIGACACHE=sim&botoes=legenda,analise,catalogo,camadas,identifica&controles=navigation,layerswitcher,scaleline,mouseposition,keyboarddefaults&fundo=eng&tiles=false&mapext=".$opcoes["mapext"]);

function mapaBarras($colunas,$metadataItens){
	global $opcoes;
	//$opcoes["coreshex"] = array_reverse($opcoes["coreshex"]);
	//$valores = retornaDadosColuna($coluna);
	//$cortes = quartis($valores,$nomeColuna);
	//var_dump($opcoes["coreshex"]);exit;
	$nclasses = count($colunas);
	$classes = array();
	for($i=1;$i<$nclasses;$i++){
		$classes[] = PHP_EOL.'CLASS';
		$classes[] = '	NAME "'.$metadataItens[$i].'"';
		$classes[] = '	STYLE';
		$cor = $opcoes["outlinecolor"];
		$classes[] = '		OUTLINECOLOR '.$cor["red"].' '.$cor["green"].' '.$cor["blue"];
		$classes[] = '		SIZE ['.$colunas[$i].']';
		$classes[] = '		COLOR '.$opcoes["cores"][$i-1];
		$classes[] = '	END';
		$classes[] = 'END	';
	}
	return $classes;
}

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
function cHexToDec ($hexStr, $returnAsString = true, $seperator = ' ') {
		$hexStr = preg_replace("/[^0-9A-Fa-f]/", '', $hexStr); // Gets a proper hex string
		$rgbArray = array();
		if (strlen($hexStr) == 6) { //If a proper hex code, convert using bitwise operation. No overhead... faster
				$colorVal = hexdec($hexStr);
				$rgbArray['red'] = 0xFF & ($colorVal >> 0x10);
				$rgbArray['green'] = 0xFF & ($colorVal >> 0x8);
				$rgbArray['blue'] = 0xFF & $colorVal;
		} elseif (strlen($hexStr) == 3) { //if shorthand notation, need some string manipulations
				$rgbArray['red'] = hexdec(str_repeat(substr($hexStr, 0, 1), 2));
				$rgbArray['green'] = hexdec(str_repeat(substr($hexStr, 1, 1), 2));
				$rgbArray['blue'] = hexdec(str_repeat(substr($hexStr, 2, 1), 2));
		} else {
				return false; //Invalid hex color code
		}
		return $returnAsString ? implode($seperator, $rgbArray) : $rgbArray; // returns the rgb string or the associative array
}
?>
