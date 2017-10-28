<?php
/*
Title: analise.php

Fun&ccedil;&otilde;es utilizadas pelos programas javascript especificos de analise e manipulacao de dados para o sistema de metadados estatisticos
e que nao exigem login

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2012 Edmar Moretti
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/ferramentas/metaestat/analise.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada.

Cada opera&ccedil;&atilde;o possu&iacute; seus pr�prios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.
*/
include(dirname(__FILE__)."/../../classesphp/sani_request.php");
$_pg = array_merge($_GET,$_POST);
$funcao = $_pg["funcao"];
$g_sid = $_pg["g_sid"];

if (empty($g_sid)){
	exit;
}
include(dirname(__FILE__)."/../../classesphp/classe_metaestatinfo.php");

session_name("i3GeoPHP");
session_id($g_sid);
session_start();
/**
 * transforma o array da sessao em variaveis
 */
$map_file = $_SESSION["map_file"];
$postgis_mapa = $_SESSION["postgis_mapa"];
include (dirname(__FILE__)."/../../ms_configura.php");
/**
 * verifica se esse programa esta sendo executado dentro de um mapa do i3geo
 */
if(isset($fingerprint)){
	$f = explode(",",$fingerprint);
	if($f[0] != md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id())){
		cpjson(". Tentativa de acesso nao permitida. Inicie um novo mapa.");
		return;
	}
}
$retorno = "";
/**
 * A variavel $funcao define a rotina que sera executada
 * Cada rotina recebe parametros especificos
 * A documentacao de cada rotina encontra-se no programa PHP que e executado
 * $map_file e obtido da variavel session e corresponde ao mapa que esta sendo usado
 *
 * Quando um layer original do sistema METAESTAT e alterado, isso e indicado pelo metadata METAESTAT_DERIVADO
 * que passa a ser marcado com "sim"
 */
switch (strtoupper($funcao)){
	case "PEGAMETADADOSMAPFILE":
		$retorno = analise_pegaMetadadosMafile($_pg["idtema"]);
	break;
	case "APLICAFILTROREGIAO":
		$retorno = analise_aplicafiltroregiao($map_file,$_pg["codigo_tipo_regiao"],$_pg["codigo_regiao"]);
	break;
	case "LISTACAMADASMETAESTAT":
		$retorno = analise_listaCamadasMetaestat($map_file);
	break;
	case "LISTACAMADASFILTROTEMPO":
		$retorno = analise_listaCamadasFiltroTempo($map_file);
	break;
	case "APLICAFILTROTEMPO":
		$retorno = analise_aplicaFiltroTempo($map_file,$_pg["tema"],$_pg["pari"],$_pg["vali"],$_pg["parf"],$_pg["valf"]);
	break;
	case "REMOVEFILTROTEMPO":
		$retorno = analise_removeFiltroTempo($map_file,$_pg["tema"]);
	break;
	case "LISTAFILTROTEMPO":
		$retorno = listaFiltroTempoRaiz($map_file,$_pg["nivel"]);
	break;
	case "PEGADADOSTME":
		$retorno = pegaDadosTME($map_file,$_pg["tema"]);
	break;
	case "ALTERACONTORNO":
		$retorno = alteraContorno($map_file,$_pg["tema"]);
	break;
	case "CLASSES2CIRCULOS":
		$retorno = classes2circulos($map_file,$_pg["tema"],"variatamanho");
	break;
	case "CLASSES2CIRCULOS1":
		$retorno = classes2circulos($map_file,$_pg["tema"],"variacor");
	break;
	case "CLASSES2CIRCULOS2":
		$retorno = classes2circulos($map_file,$_pg["tema"],"continuo");
	break;
	case "CLASSES2PONTOS":
		$retorno = classes2preenchimento($map_file,$_pg["tema"],"ponto");
	break;
	case "CLASSES2HACH":
		$retorno = classes2preenchimento($map_file,$_pg["tema"],"hachurea");
	break;
	case "CLASSES2OPACIDADE":
		$retorno = classes2preenchimento($map_file,$_pg["tema"],"opacidade");
	break;
	case "CALOR":
		$retorno = mapaDeCalor($map_file,$_pg["tema"]);
	break;
	case "LISTALAYERSAGRUPADOS":
		$retorno = listaLayersAgrupados($map_file);
	break;
	case "JUNTAMEDIDASVARIAVEIS":
		$retorno = juntaMedidasVariaveis($map_file,$_pg["layerNames"],$_pg["nome"],$_pg["colunascalc"],$_pg["formulas"]);
	break;
	case "ADICIONALIMITEREGIAO":
		if(empty($_pg["outlinecolor"])){
			$_pg["outlinecolor"] = "255,0,0";
		}
		if(empty($_pg["width"])){
			$_pg["width"] = 1;
		}
		if(empty($_pg["nomes"])){
			$_pg["nomes"] = "nao";
		}
		$retorno = adicionaLimiteRegiao($map_file,$_pg["codigo_tipo_regiao"],$_pg["outlinecolor"],$_pg["width"],$_pg["nomes"]);
	break;
}
retornaJSON($retorno);
function retornaJSON($obj){
	global $locaplic;
	//if(function_exists("json_encode"))
	//{echojson(json_encode($obj));}
	//else
	//{
	include_once($locaplic."/pacotes/cpaint/JSON/json2.php");
	//error_reporting(0);
	ob_end_clean();
	$j = new Services_JSON();
	$texto = $j->encode($obj);
	if (!mb_detect_encoding($texto,"UTF-8",true)){
		$texto = utf8_encode($texto);
	}
	echo $texto;
}
/**
 * Obtem o id da medida da variavel armazenado em um mapfile da pasta i3geo/temas
 * @param unknown $idtema
 */
function analise_pegaMetadadosMafile($idtema){
	global $locaplic;
	$id_medida_variavel = "";
	if(file_exists($locaplic."/temas/".$idtema.".map")){
		$map = ms_newMapObj($locaplic."/temas/".$idtema.".map");

		$layer = $map->getlayer(0);
		$id_medida_variavel = $layer->getmetadata("METAESTAT_ID_MEDIDA_VARIAVEL");
	}
	return array("id_medida_variavel"=>$id_medida_variavel);
}
/**
 * Adiciona ao mapa atual um novo layer para a representacao de uma regiao
 * Se o layer ja existir, sera removido e criado outro
 *
 * @param arquivo mapfile do mapa atual
 * @param codigo da regiao no cadastro
 * @param cor do contorno
 * @param largura do contorno
 * @param sim|nao inclui ou nao um layer com a toponimia
 */
function adicionaLimiteRegiao($map_file,$codigo_tipo_regiao,$outlinecolor,$width,$nomes){
	global $locaplic,$dir_tmp;
	$m = new MetaestatInfo();

	$res = $m->mapfileTipoRegiao($codigo_tipo_regiao,$outlinecolor,$width,$nomes,true);

	$mapaNovo = ms_newMapObj($res["mapfile"]);
	$layerNovo = $mapaNovo->getlayerbyname($res["layer"]);
	$layerNovo->set("status",MS_DEFAULT);
	$dataNovo = $layerNovo->data;
	$mapa = ms_newMapObj($map_file);
	$c = $mapa->numlayers;
	for($i=0;$i < $c;++$i){
		$l = $mapa->getlayer($i);
		if($l->data == $dataNovo){
			$l->set("status",MS_DELETE);
		}
	}
	ms_newLayerObj($mapa, $layerNovo);
	if($nomes == "sim"){
		$layerNovo = $mapaNovo->getlayerbyname($res["layer"]."_anno");
		$layerNovo->set("status",MS_DEFAULT);
		ms_newLayerObj($mapa, $layerNovo);
	}
	$mapa->save($map_file);
	return "ok";
}
/**
 * Gera uma imagem com a representacao das ocorrencias na forma de mapa de calor
 * A imagem e gerada usando o software R
 * A coluna que sera usada para calcular o mapa de calor e obtida do cadastro de variaveis. Por isso, o layer deve
 * ser original do METAESTAT
 * @param arquivo mapfile do mapa atual
 * @param nome do layer fonte dos dados
 */
function mapaDeCalor($map_file,$tema){
	global $locaplic,$dir_tmp,$R_path,$ext;
	$nome = basename($map_file).$tema."calor";
	$mapa = ms_newMapObj($map_file);
	$teste = $mapa->getlayerbyname($nome);
	if($teste != ""){
		return "";
	}
	$layer = $mapa->getlayerbyname($tema);
	//verifica se o layer e original ou se foi alterado
	//se foi alterado, nao e possivel obter a coluna para calcular o mapa de calor
	if($layer->getmetadata("METAESTAT_DERIVADO") == "sim"){
		return "";
	}
	$layer->set("status",MS_OFF);
	$mapa->save($map_file);
	$meta = new MetaestatInfo();
	$medidavariavel = $meta->listaMedidaVariavel("",$layer->getmetadata("METAESTAT_ID_MEDIDA_VARIAVEL"));
	include_once(dirname(__FILE__)."/../../classesphp/classe_analise.php");
	$m = new Analise($map_file,$tema,$locaplic,$ext);
	$retorno = $m->analiseDistriPt($locaplic,$dir_tmp,$R_path,50,"densidade","243,217,173","255,0,0","",0,true,"",2,$medidavariavel["colunavalor"]);
	$m->salva();
	return $retorno;
}
/**
 * Altera as caracteristicas de representacao de um layer
 *
 * @param mapfile do mapa atual
 * @param nome do layer que sera processado
 * @param tipo de processamento pponto|hachurea|opacidade
 */
function classes2preenchimento($map_file,$tema,$tipo){
	$nome = basename($map_file).$tema.$tipo;
	$mapa = ms_newMapObj($map_file);
	$teste = $mapa->getlayerbyname($nome);
	if($teste != ""){
		return "";
	}
	$l = $mapa->getlayerbyname($tema);
	if($l->getmetadata("METAESTAT_DERIVADO") == "sim"){
		return "";
	}
	$layer = ms_newLayerObj($mapa,$l);
	$l->set("status",MS_OFF);
	$layer->set("status",MS_DEFAULT);

	if(ms_GetVersionInt() >= 7){
	    $layer->updateFromString('LAYER COMPOSITE OPACITY 50 END END');
	} else {
	    $layer->set("opacity",50);
	}
	$layer->set("name",$nome);
	if($layer->type != MS_LAYER_POLYGON){
		return "";
	}
	$numclasses = $layer->numclasses;
	if($tipo == "ponto" || $tipo == "hachurea"){
		//as classes serao preenchidas com pontos
		if($tipo == "ponto"){
			$layer->setmetadata("tema",$layer->getmetadata("tema")." - pontos");
			$s = "ponto";
			$si = 10;
			$w = 4;
		}
		//as classes serao preenchidas com hachureas
		if($tipo == "hachurea"){
			$layer->setmetadata("tema",$layer->getmetadata("tema")." - hachurea");
			$s = "p3";
			$si = 5;
			$w = 1;
		}
		if ($numclasses > 0){
			for ($i=0; $i < $numclasses; ++$i)	{
				$classe = $layer->getClass($i);
				$estilo = $classe->getstyle(0);
				$estilo->set("symbolname",$s);
				$estilo->set("size",$si);
				$estilo->set("width",$w);
			}
		}
	}
	//cada classe recebera um valor de opacidade
	if($tipo == "opacidade"){
		$layer->setmetadata("tema",$layer->getmetadata("tema")." - opac");
		if ($numclasses > 0){
			$delta = 90 / $numclasses;
			$o = $delta;
			for ($i=0; $i < $numclasses; ++$i)	{
				$classe = $layer->getClass($i);
				$estilo = $classe->getstyle(0);
				$estilo->set("opacity",$o);
				$o = $o + $delta;
			}
		}
	}
	//marca o novo layer como derivado do original
	$layer->setmetadata("METAESTAT_DERIVADO","sim");
	$mapa->save($map_file);
	return $nome;
}
/**
 * Altera a representacao de um layer mostrando circulos cujo tamanho corresponde a um valor
 * @param nome do arquivo mapfile em uso
 * @param nome do layer que sera processado
 * @param variatamanho|variacor|continuo tipo de processo
 */
function classes2circulos($map_file,$tema,$tipo){
	$nome = basename($map_file).$tema.$tipo;
	$mapa = ms_newMapObj($map_file);
	$teste = $mapa->getlayerbyname($nome);
	if($teste != ""){
		return "";
	}
	$l = $mapa->getlayerbyname($tema);
	if($l->getmetadata("METAESTAT_DERIVADO") == "sim"){
		return "";
	}
	$layer = ms_newLayerObj($mapa,$l);
	$l->set("status",MS_OFF);
	$layer->set("status",MS_DEFAULT);
	if(ms_GetVersionInt() >= 7){
	    $layer->updateFromString('LAYER COMPOSITE OPACITY 50 END END');
	} else {
	    $layer->set("opacity",50);
	}

	$layer->set("name",$nome);
	$meta = new MetaestatInfo();
	if($layer->type != MS_LAYER_POINT){
		$layer->set("type",0);
		$regiao = $meta->listaTipoRegiao($layer->getmetadata("METAESTAT_CODIGO_TIPO_REGIAO"));
		//repare que existe uma virgula apos o nome da coluna com a geometria, isso e necessario para substituir a string correta
		if($regiao["colunacentroide"] != ""){
			$stringgeo = "g.".$regiao["colunageo"].",";
			$data = str_replace($stringgeo,"g.".$regiao["colunacentroide"].",",$layer->data);
		}
		else{
			$stringgeo = 'st_setsrid(g.".'.$regiao["colunageo"].'.",".'.$regiao["srid"].'.")';
			$data = str_replace($stringgeo,"st_centroid($stringgeo)",$layer->data);
		}
		$layer->set("data",$data);
	}
	$numclasses = $layer->numclasses;
	if($tipo == "variatamanho" || $tipo == "variacor"){
		if($tipo == "variatamanho"){
			$layer->setmetadata("tema",$layer->getmetadata("tema")." - circ");
		}
		if($tipo == "variacor"){
			$layer->setmetadata("tema",$layer->getmetadata("tema")." - ponto");
		}
		if ($numclasses > 0){
			for ($i=0; $i < $numclasses; ++$i)	{
				$classe = $layer->getClass($i);
				$estilo = $classe->getstyle(0);
				$estilo->set("symbolname","ponto");
				if($tipo == "variatamanho"){
					$estilo->set("size",$i * 6);
				}
				if($tipo == "variacor"){
					$estilo->set("size",12);
				}
			}
		}
	}
	if($tipo == "continuo"){
		$nometemp = str_replace(basename($map_file),nomeRandomico(5).basename($map_file),$map_file);
		$mapa->save($nometemp);
		//$mapatemp = ms_newMapObj($nometemp);
		$medidavariavel = $meta->listaMedidaVariavel("",$layer->getmetadata("METAESTAT_ID_MEDIDA_VARIAVEL"));
		include_once(dirname(__FILE__)."/../../classesphp/classe_alteraclasse.php");
		$m = new Alteraclasse($nometemp,$layer->name,"","");
		$valores = $m->pegaValores($m->mapa,$m->layer,$medidavariavel["colunavalor"],true,0);
		$min = min($valores);
		$max = max($valores);
		$layer->setmetadata("tema",$layer->getmetadata("tema")." - cont");
		$layer->set("type",MS_LAYER_CHART);
		if(ms_GetVersionInt() >= 7){
		    $layer->updateFromString('LAYER COMPOSITE OPACITY 60 END END');
		} else {
		    $layer->set("opacity",60);
		}
		$layer->setprocessing("CHART_TYPE=pie");
		$layer->setprocessing("CHART_SIZE_RANGE=".$medidavariavel["colunavalor"]." 10 150 ".$min." ".$max);
		if ($numclasses > 0){
			for ($i=0; $i < $numclasses; ++$i)	{
				$classe = $layer->getClass($i);
				$classe->set("status",MS_DELETE);
			}
		}
		$classe = ms_newClassObj($layer);
		$novoestilo = ms_newStyleObj($classe);
		//$novoestilo->set("symbolname","ponto");
		$novoestilo->set("size","6");
		$ncor = $novoestilo->color;
		$ncor->setrgb(247,145,29);
		$ncor = $novoestilo->outlinecolor;
		$ncor->setrgb(255,255,255);
		//$novoestilo->setbinding(MS_STYLE_BINDING_SIZE, $medidavariavel["colunavalor"]);
		//
		$classe = ms_newClassObj($layer);
		$novoestilo = ms_newStyleObj($classe);
		//$novoestilo->set("symbolname","ponto");
		$novoestilo->set("size","6");
		$ncor = $novoestilo->color;
		$ncor->setrgb(247,145,29);
		$ncor = $novoestilo->outlinecolor;
		$ncor->setrgb(255,255,255);;
	}
	$layer->setmetadata("METAESTAT_DERIVADO","sim");
	$mapa->save($map_file);
	return $nome;
}
/**
 * Altera o estilo do outline ativando-o com cor branca
 * Se a cor ja estiver definida, o contorno e desativado
 * @param arquivo mapfile do mapa atual
 * @param nome do tema que sera processado
 */
function alteraContorno($map_file,$tema){
	$mapa = ms_newMapObj($map_file);
	$layer = $mapa->getlayerbyname($tema);
	$numclasses = $layer->numclasses;
	if ($numclasses > 0){
		for ($i=0; $i < $numclasses; ++$i)	{
			$classe = $layer->getClass($i);
			$estilo = $classe->getstyle(0);
			$outl = $estilo->outlinecolor;
			if($outl->red == -1){
				$outl->setrgb(255,255,255);
			}
			else{
				$outl->setrgb(-1,-1,-1);
			}
		}
		$mapa->save($map_file);
	}
	return "ok";
}
/**
 * Obtem dados descritivos sobre a medida da variavel usada para compor o layer
 * @param nome do mapfile atual
 * @param nome do tema que sera processado
 * @return array com coluna que contem os nomes das regioe, coluna que contem os dados
 */
function pegaDadosTME($map_file,$tema){
	$retorno = array("itemNomeRegioes"=>"","itemDados"=>"");
	$mapa = ms_newMapObj($map_file);
	$layer = $mapa->getlayerbyname($tema);
	$id_medida_variavel = $layer->getmetadata("METAESTAT_ID_MEDIDA_VARIAVEL");
	$m = new MetaestatInfo();

	if($id_medida_variavel != ""){
		$variavel = $m->listaMedidaVariavel("",$id_medida_variavel);
		$codigo_tipo_regiao = $variavel["codigo_tipo_regiao"];
		$regioes = $m->listaTipoRegiao($codigo_tipo_regiao);
		$retorno = array("itemNomeRegioes"=>$regioes["colunanomeregiao"],"itemDados"=>$variavel["colunavalor"]);
	}
	return $retorno;
}
/**
 * Lista filtros aplicados ao mapa atual
 * @param nome do mapfile atual
 * @param opcional. Codigo da regiao cujos filhos serao considerados na busca
 * @return array
 */
function listaFiltroTempoRaiz($map_file,$nivel){
	$mapa = ms_newMapObj($map_file);
	$layers = analise_listaLayersMetaestat($mapa);
	$m = new MetaestatInfo();
	//pega os parametros de tempo
	$filtros = array();
	foreach($layers as $l){
		$id_medida_variavel = $l->getmetadata("METAESTAT_ID_MEDIDA_VARIAVEL");
		if($id_medida_variavel != ""){
			//pega os parametros que sao do tipo tempo (1, 2, e 3)
			$parametros = $m->listaParametro($id_medida_variavel);
			foreach($parametros as $parametro){
				$id_parametro_medida_pai = "";
				if($parametro["id_pai"] == $nivel && $parametro["tipo"] > 0 && $parametro["tipo"] < 4){
					$filtros[] = $parametro;
				}
			}
		}
	}
	return $filtros;
}
/**
 * Lista os layers do mapa atual que contem filtros de tempo
 * @param nome do mapfile atual
 * @return Array
 */
function analise_listaCamadasFiltroTempo($map_file){
	$mapa = ms_newMapObj($map_file);
	$layers = analise_listaLayersMetaestat($mapa);
	$m = new MetaestatInfo();
	//pega os parametros de tempo
	$camadas = array();
	foreach($layers as $l){
		$id_medida_variavel = $l->getmetadata("METAESTAT_ID_MEDIDA_VARIAVEL");
		if($id_medida_variavel != ""){
			//pega os parametros que sao do tipo tempo (1, 2, e 3)
			$parametros = $m->listaParametro($id_medida_variavel);
			foreach($parametros as $parametro){
				$id_parametro_medida_pai = "";
				if($parametro["id_pai"] == 0 && $parametro["tipo"] > 0 && $parametro["tipo"] < 4){
					$camadas[] = array(
						"layer"=>$l->name,
						"nome"=>(mb_convert_encoding(($l->getmetadata("tema")),"UTF-8","ISO-8859-1"))
					);
					break;
				}
			}
		}
	}
	return $camadas;
}
/**
 * Aplica um filtro de tempo em uma camada
 * @param arquivo mapfile do mapa atual
 * @param nome do layer que sera processado
 * @param lista com os ids dos parametros de tempo inicial
 * @param lista com os valores dos parametros de pari
 * @param lista com os ids dos parametros de tempo final
 * @param lista com os valores dos parametros de parf
 * @return string
 */

//TODO esse filtro nao pode ser aplicado pois ja pode ter sido escolhido um filtro de tempo quando a camada foi criada
function analise_aplicaFiltroTempo($map_file,$tema,$pari,$vali,$parf,$valf){
	$mapa = ms_newMapObj($map_file);
	$layer = $mapa->getlayerbyname($tema);
	$id_medida_variavel = $layer->getmetadata("METAESTAT_ID_MEDIDA_VARIAVEL");
	$data = $layer->data;
	$m = new MetaestatInfo();
	//pega os parametros de tempo inicial
	$par = explode(",",$pari);
	$val = explode(",",$vali);
	$filtro = array();
	$n = count($par);
	for($i=0;$i<$n;$i++){
		$parametro = $m->listaParametro($id_medida_variavel,$par[$i]);
		$filtro[] = "d.".$parametro["coluna"]." >= ".$val[$i]." ";
	}
	//pega os parametros de tempo final
	$par = explode(",",$parf);
	$val = explode(",",$valf);
	$n = count($par);
	for($i=0;$i<$n;$i++){
		$parametro = $m->listaParametro($id_medida_variavel,$par[$i]);
		$filtro[] = "d.".$parametro["coluna"]." <= ".$val[$i]." ";
	}
	$filtro = implode(" AND ",$filtro);
	//substitui as strings de filtro no mapfile
	$s = explode("/*FAT*/",$data);
	$data = $s[0]."/*FAT*/ AND ".$filtro." /*FAT*/".$s[2];
	$layer->set("data",$data);
	$mapa->save($map_file);
	return "ok";
}
/**
 * Remove o filtro de tempo
 * @param arquivo mapfile do mapa atual
 * @param nome do layer que sera processado
 * @return string
 */
function analise_removeFiltroTempo($map_file,$tema){
	$mapa = ms_newMapObj($map_file);
	$layer = $mapa->getlayerbyname($tema);
	$data = $layer->data;
	//substitui as strings de filtro no mapfile
	$s = explode("/*FAT*/",$data);
	$data = $s[0]."/*FAT*//*FAT*/".$s[2];
	$layer->set("data",$data);
	$mapa->save($map_file);
	return "ok";
}
/**
 * Lista os nomes das camadas do mapa atual que sao originarias do sistema de metadados
 * @param arquivo mapfile do mapa atual
 * @return Array com o nome dos layers
 */
function analise_listaCamadasMetaestat($map_file){
	$mapa = ms_newMapObj($map_file);
	$layers = analise_listaLayersMetaestat($mapa);
	$camadas = array();
	foreach($layers as $l){
		$camadas[] = $l->name;
	}
	return $camadas;
}
/**
 * Lista os objetos layers do mapa atual que sao originarias do sistema de metadados
 * @param arquivo mapfile do mapa atual
 * @excluiderivados exclui da lista os layers marcados como derivados de outros layers do sistema metaestat
 * @return Array com os layers
 */
function analise_listaLayersMetaestat($mapa,$excluiderivados = false){
	$c = $mapa->numlayers;
	$layers = array();
	for ($i=0;$i < $c;++$i){
		$l = $mapa->getlayer($i);
		if($l->getmetadata("METAESTAT") == "SIM"){
			if($excluiderivados == false){
				$layers[] = $l;
			}
			elseif ($l->getmetadata("METAESTAT_DERIVADO") != "sim"){
				$layers[] = $l;
			}
		}
	}
	return $layers;
}
function analise_listaLayersRegiao($layers,$codigo_tipo_regiao){
	$final = array();
	foreach($layers as $l){
		if($l->getmetadata("METAESTAT_CODIGO_TIPO_REGIAO") == $codigo_tipo_regiao){
			$final[] = $l;
		}
	}
	return $final;
}
/**
 * Aplica um filtro para mostrar apenas uma regiao escolhida pelo usuario
 * Altera todos os layers com o mesmo codigo_tipo_regiao
 * Se codigo_tipo_regiao for vazio, remove os filtros de todos os layers
 * @param arquivo mapfile do mapa atual
 * @param codigo da regiao
 * @param valor da regiao (id)
 * @return string
 */
function analise_aplicafiltroregiao($map_file,$codigo_tipo_regiao,$codigo_regiao){
	//echo $codigo_tipo_regiao;exit;
	$m = new MetaestatInfo();
	$mapa = ms_newMapObj($map_file);
	$layersm = analise_listaLayersMetaestat($mapa);
	if(count($layersm) > 0){
		//remove o filtro
		if(empty($codigo_tipo_regiao)){
			foreach($layersm as $l){
				$data = $l->data;
				//substitui os marcadores definidos na construcao do layer. Veja a classe metaestat
				$s = explode("/*FR*/",$data);
				if(count($s) > 1){
					$data = $s[0]."/*FR*//*FR*/".$s[2];
				}
				$l->set("data",$data);
			}
		}
		else{
			//pega as regioes que sao filhos de $codigo_tipo_regiao
			$regioesfilho = $m->listaHierarquiaRegioes($codigo_tipo_regiao);
			//if(count($regioesfilho) > 0){
				$regiao = $m->listaTipoRegiao($codigo_tipo_regiao);
				$filtro = $regiao["identificador"]."::text = '$codigo_regiao'";
				$layers = analise_listaLayersRegiao($layersm,$codigo_tipo_regiao);
				foreach($layers as $l){
					$data = $l->data;
					//substitui os marcadores definidos na construcao do layer. Veja a classe metaestat
					$s = explode("/*FR*/",$data);
					if(count($s) > 1){
						$data = $s[0]."/*FR*/ AND ".$filtro." /*FR*/".$s[2];
					}
					$l->set("data",$data);
				}
			//}
			//else{
				foreach($regioesfilho as $r){
					$regiao = $m->listaTipoRegiao($r["codigo_tipo_regiao"]);
					$filtro = $r["colunaligacao_regiaopai"]."::text = '$codigo_regiao'";
					$layers = analise_listaLayersRegiao($layersm,$r["codigo_tipo_regiao"]);
					foreach($layers as $l){
						$data = $l->data;
						//substitui os marcadores definidos na construcao do layer. Veja a classe metaestat
						$s = explode("/*FR*/",$data);
						if(count($s) > 1){
							$data = $s[0]."/*FR*/ AND ".$filtro." /*FR*/".$s[2];
						}
						$l->set("data",$data);
					}
				}
			//}
		}
	}
	$mapa->save($map_file);
	return "ok";
}
/**
 * Cria um novo layer no mapa atual fazendo a juncao dos SQLs para obter em uma mesma tabela todas as colunas das medidas de variavies
 *
 * @param string com a lista de nomes de layers separados por virgula
 * @return Nome do layer criado
 *
 */
function juntaMedidasVariaveis($map_file,$layerNames,$nome,$colunascalc,$formulas){
	//o sql que faz acesso aos dados e marcado com /*SE*//*SE*/
	$mapa = ms_newMapObj($map_file);
	$layernames = explode(",",$layerNames);
	$sqlLayers = array();
	$conta = 0;
	$m = new MetaestatInfo();
	$colunasValor = array();
	$colunasIdentificador = array();
	$sqls = array();
	$nomesLayers = array();
	foreach($layernames as $layername){
		$l = $mapa->getlayerbyname($layername);
		$l->set("status",MS_OFF);
		$s = explode("/*SE*/",$l->data);
		//pega o sql e da define um alias
		$sqls[] = $s[1]." as tabela".$conta;
		//
		$id_medida_variavel = $l->getmetadata("METAESTAT_ID_MEDIDA_VARIAVEL");
		$nomesLayers[] = $l->getmetadata("tema");
		$medidavariavel = $m->listaMedidaVariavel("",$id_medida_variavel);
		//pega o nome da coluna que contem os valores e a coluna de ligacao
		$colunasValor[] = $medidavariavel["colunavalor"];
		$colunasIdentificador[] = $medidavariavel["colunaidgeo"];
		//pega valores do primeiro layer para a tabela0
		if($conta == 0){
			$codigo_tipo_regiao = $l->getmetadata("METAESTAT_CODIGO_TIPO_REGIAO");
		}
		$conta++;
	}
	//coluna com a geometria
	$regiao = $m->listaTipoRegiao($codigo_tipo_regiao);
	$gid = $regiao["identificador"];
	$n = count($sqls);

	$cwhere = array();
	//$colunasWhere = array();
	for($i=1;$i<$n;$i++){
		$cwhere[] = "tabela0.".$gid."::text = "."tabela".$i.".".$gid."::text";
		//$colunasWhere[] =
	}
	$colunasDados = array();
	$itens = array($gid,"regiao");
	$itensdesc = array("id","Regiao");
	$tabelaColuna = array();
	for($i=0;$i<$n;$i++){
		$colunasDados[] = "tabela".$i.".".$colunasValor[$i]." as valortema".$i;
		$tabelaColuna["valortema".$i] = "tabela".$i.".".$colunasValor[$i];
		$itens[] = "valortema".$i;
		$itensdesc[] = $nomesLayers[$i];
	}
	//pega as colunas e as formulas adicionais
	$complemento = "";
	if($colunascalc != "" && $formulas != ""){
		$colunascalc = explode(",",$colunascalc);
		$formulas = explode(",",$formulas);
		$nformulas = count($formulas);
		$complemento = array();
		for($i=0;$i<$nformulas;$i++){
			$complemento[] = "(".$formulas[$i].") as ".$colunascalc[$i];
		}
		$complemento = implode(",",$complemento);
		//substitui pelo nome correto das colunas
		foreach(array_keys($tabelaColuna) as $k){
			$complemento = str_replace($k,$tabelaColuna[$k],$complemento);
		}
		if($complemento != ""){
			$complemento .= ",";
			$itens = array_merge($itens,$colunascalc);
			$itensdesc = array_merge($itensdesc,$colunascalc);
			$complemento = str_ireplace("select","",$complemento);
			$complemento = str_ireplace("update","",$complemento);
			$complemento = str_ireplace("delete","",$complemento);
		}
	}
	//echo $complemento;exit;
	$sqlfinal = "SELECT $complemento tabela0.".$gid.",tabela0.".$regiao["colunanomeregiao"]." as regiao,tabela0.".$regiao["colunageo"]." as the_geom,".implode(",",$colunasDados)." from ".implode(",",$sqls)." WHERE ";
	$sqlfinal .= implode($cwhere," AND ");
	$sqlfinal = str_replace("/*FA*/","",$sqlfinal);
	$sqlfinal = str_replace("/*FAT*/","",$sqlfinal);
	$data = "the_geom from ($sqlfinal) as foo using unique $gid using srid=".$regiao["srid"];
	$nlayer = ms_newLayerObj($mapa,$mapa->getlayerbyname($layernames[0]));
	$nlayer->set("data",$data);
	$nlayer->set("name",$nlayer->name."_");
	$nlayer->setmetadata("tema",$nome);
	$nlayer->setmetadata("METAESTAT_DERIVADO","sim");
	$nlayer->setmetadata("METAESTAT_ID_MEDIDA_VARIAVEL","");
	$nlayer->setmetadata("TIP","");
	$nlayer->setmetadata("arquivotemaoriginal","");
	$nlayer->setmetadata("nomeoriginal","");
	$nlayer->setmetadata("ITENS",implode(",",$itens));
	$nlayer->setmetadata("ITENSDESC",implode(",",$itensdesc));
	$nclass = $nlayer->numclasses;
	for($i=1;$i<$nclass;$i++){
		$nlayer->getclass($i)->set("status",MS_DELETE);
	}
	$c = $nlayer->getclass(0);
	$s = $c->getstyle(0);
	$sc = $s->outlinecolor;
	$sc->setrgb(130,130,130);
	$c->set("name"," ");
	$c->setexpression("");
	$nlayer->set("status",MS_DEFAULT);
	$mapa->save($map_file);
	return $nlayer->name;
}
/**
 * Lista os nomes dos layers originados do sistema METAESTAT.
 * Os layers sao agrupados por tipo de regiao e tipo de representacao
 * @param unknown $map_file
 * @return string
 */
function listaLayersAgrupados($map_file){
	//MS_LAYER_POINT, MS_LAYER_LINE, MS_LAYER_POLYGON
	$tipos[0] = "ponto";
	$tipos[1] = "linha";
	$tipos[2] = "poligono";
	$mapa = ms_newMapObj($map_file);
	$layers = analise_listaLayersMetaestat($mapa,true);
	$m = new MetaestatInfo();
	$camadas = array();
	foreach($layers as $l){
		$codigo_tipo_regiao = $l->getmetadata("METAESTAT_CODIGO_TIPO_REGIAO");
		$tema = (mb_convert_encoding(($l->getmetadata("tema")),"UTF-8","ISO-8859-1"));
		$regiao = $m->listaTipoRegiao($codigo_tipo_regiao);
		$camadas[] = array(
				"layer"=>$l->name,
				"tema"=>$tema,
				"codigo_tipo_regiao"=>$codigo_tipo_regiao,
				"tipolayer"=>$tipos[$l->type]
		);
	}
	return $camadas;
}
?>
