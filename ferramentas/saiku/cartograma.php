<?php
if(empty($_POST["g_sid"])){
	echo "erro";
	exit;
}
include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include(dirname(__FILE__)."/../../admin/php/classe_metaestat.php");
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
$srid = $meta["srid"];
$colunastabela = $m->colunasTabela($meta["codigo_estat_conexao"],$meta["esquemadb"],$meta["tabela"],"geometry","!=");


//constroi um sql que retorna os dados na forma de uma tabela inline
$nomesColunas = array();
$valores = array();
for($i=0;$i<$nmetadados;$i++){
	$nomesColunas[] = $metadados[$i]["colName"];
	//$valores[$metadados[$i]["colName"]] = array();
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
	select st_setsrid(".$colunageo.",".$srid.") as $colunageo, ".implode(",",$colunastabela).",dataset.*
	from ".$meta["esquemadb"].".".$meta["tabela"]." INNER JOIN 
	(values ".implode(",",$valores).') as dataset ("'.implode('","',$nomesColunas).'") ON geocodigo = '.$meta["identificador"];
$sqlmapa = $colunageo." from ($sqldados) as foo using unique gid using srid=$srid";
$mapa = ms_newMapObj($map_file);
$layer = ms_newLayerObj($mapa);

$l = array();
$l[] = "LAYER";
$l[] = '	NAME "'.nomeRandomico().'"';
$l[] = "	TYPE POLYGON";
$l[] = "	DATA '".$sqlmapa."'";
$l[] = '	CONNECTION "'.$conexao.'"';
$l[] = '	CONNECTIONTYPE POSTGIS';
$l[] = '	TEMPLATE "none.htm"';
$l[] = '	STATUS DEFAULT';
$l[] = '	METADATA';
$l[] = '		TEMA "'.$titulolayer.' '.$_POST["tipo"].'"';
$l[] = '		CLASSE "SIM"';
$l[] = '		SAIKU "SIM"';
$l[] = '		TIP "'.$meta["colunanomeregiao"].','.implode(',',$nomesColunas).'"';
$l[] = '	END';
$l[] = '    CLASS';
$l[] = '        NAME ""';
$l[] = '        STYLE';
$l[] = '        	OUTLINECOLOR 0 255 0';
$l[] = '        	COLOR 0 0 255';
$l[] = '        END';
$l[] = '    END';
$l[] = 'END';
$layer->updateFromString(implode(" ",$l));

$mapa->save($map_file);
?>
