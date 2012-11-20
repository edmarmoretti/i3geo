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
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/ferramentas/metaestat/analise.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada.

Cada opera&ccedil;&atilde;o possu&iacute; seus próprios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.
*/
error_reporting(0);
include(__DIR__."/../../admin/php/admin.php");
include(__DIR__."/../../admin/php/classe_metaestat.php");
session_name("i3GeoPHP");
session_id($g_sid);
session_start();
foreach(array_keys($_SESSION) as $k)
{
	if(!is_array($_SESSION[$k]))
		eval("\$".$k."='".$_SESSION[$k]."';");
}
if(isset($fingerprint)){
	$f = explode(",",$fingerprint);
	if($f[0] != md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id())){
		cpjson(". Tentativa de acesso nao permitida. Inicie um novo mapa.");
		return;
	}
}
$retorno = "";
switch (strtoupper($funcao)){
	case "APLICAFILTROREGIAO":
		$retorno = analise_aplicafiltroregiao($map_file,$codigo_tipo_regiao,$codigo_regiao,$codigo_tipo_regiao_pai,$codigo_regiao_pai,$tipo);
	break;
	case "LISTACAMADASMETAESTAT":
		$retorno = analise_listaCamadasMetaestat($map_file);
	break;
	case "LISTACAMADASFILTROTEMPO":
		$retorno = analise_listaCamadasFiltroTempo($map_file);
	break;
	case "APLICAFILTROTEMPO":
		$retorno = analise_aplicaFiltroTempo($map_file,$tema,$pari,$vali,$parf,$valf);
	break;
	case "REMOVEFILTROTEMPO":
		$retorno = analise_removeFiltroTempo($map_file,$tema);
	break;
	case "LISTAFILTROTEMPO":
		$retorno = listaFiltroTempoRaiz($map_file,$nivel);
	break;
	case "PEGADADOSTME":
		$retorno = pegaDadosTME($map_file,$tema);
	break;
	case "ALTERACONTORNO":
		$retorno = alteraContorno($map_file,$tema);
	break;
	case "CLASSES2CIRCULOS":
		$retorno = classes2circulos($map_file,$tema,"variatamanho");
	break;
	case "CLASSES2CIRCULOS1":
		$retorno = classes2circulos($map_file,$tema,"variacor");
	break;
	case "CLASSES2CIRCULOS2":
		$retorno = classes2circulos($map_file,$tema,"continuo");
	break;
	case "CLASSES2PONTOS":
		$retorno = classes2preenchimento($map_file,$tema,"ponto");
	break;
	case "CLASSES2HACH":
		$retorno = classes2preenchimento($map_file,$tema,"hachurea");
	break;
	case "CLASSES2OPACIDADE":
		$retorno = classes2preenchimento($map_file,$tema,"opacidade");
	break;
	case "CALOR":
		$retorno = mapaDeCalor($map_file,$tema);
	break;
}
if (!connection_aborted()){
	cpjson($retorno);
}
else
{exit();}
function mapaDeCalor($map_file,$tema){
	global $locaplic,$dir_tmp,$R_path,$ext;
	$nome = basename($map_file).$tema."calor";
	$mapa = ms_newMapObj($map_file);
	$teste = $mapa->getlayerbyname($nome);
	if($teste != ""){
		return "";
	}
	$layer = $mapa->getlayerbyname($tema);
	if($layer->getmetadata("METAESTAT_DERIVADO") == "sim"){
		return "";
	}
	$layer->set("status",MS_OFF);
	$mapa->save($map_file);
	$meta = new Metaestat();
	$medidavariavel = $meta->listaMedidaVariavel("",$layer->getmetadata("METAESTAT_ID_MEDIDA_VARIAVEL"));
	include_once("../../classesphp/classe_analise.php");
	$m = new Analise($map_file,$tema,$locaplic,$ext);
	$retorno = $m->analiseDistriPt($locaplic,$dir_tmp,$R_path,50,"densidade","243,217,173","255,0,0","",0,true,"",2,$medidavariavel["colunavalor"]);
	$m->salva();
	return $retorno;
}
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
	$layer->set("opacity",50);
	$layer->set("name",$nome);
	if($layer->type != MS_LAYER_POLYGON){
		return "";
	}
	$numclasses = $layer->numclasses;
	if($tipo == "ponto" || $tipo == "hachurea"){
		if($tipo == "ponto"){
			$layer->setmetadata("tema",$layer->getmetadata("tema")." - pontos");
			$s = "ponto";
			$si = 10;
			$w = 4;
		}
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
	$layer->setmetadata("METAESTAT_DERIVADO","sim");
	$mapa->save($map_file);
	return $nome;
}
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
	$layer->set("opacity",50);

	$layer->set("name",$nome);
	$meta = new Metaestat();
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
		include_once("../../classesphp/classe_alteraclasse.php");
		$m = new Alteraclasse($nometemp,$layer->name,"","");
		$valores = $m->pegaValores($m->mapa,$m->layer,$medidavariavel["colunavalor"],true,0);
		$min = min($valores);
		$max = max($valores);
		$layer->setmetadata("tema",$layer->getmetadata("tema")." - cont");
		$layer->set("type",MS_LAYER_CHART);
		$layer->set("opacity",60);
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
function pegaDadosTME($map_file,$tema){
	$retorno = array("itemNomeRegioes"=>"","itemDados"=>"");
	$mapa = ms_newMapObj($map_file);
	$layer = $mapa->getlayerbyname($tema);
	$id_medida_variavel = $layer->getmetadata("ID_MEDIDA_VARIAVEL");
	$m = new Metaestat();

	if($id_medida_variavel != ""){
		$variavel = $m->listaMedidaVariavel("",$id_medida_variavel);
		$codigo_tipo_regiao = $variavel["codigo_tipo_regiao"];
		$regioes = $m->listaTipoRegiao($codigo_tipo_regiao);
		$retorno = array("itemNomeRegioes"=>$regioes["colunanomeregiao"],"itemDados"=>$variavel["colunavalor"]);
	}
	return $retorno;
}
function listaFiltroTempoRaiz($map_file,$nivel){
	$mapa = ms_newMapObj($map_file);
	$layers = analise_listaLayersMetaestat($mapa);
	$m = new Metaestat();
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

//lista as camadas que possuem filtro temporais
function analise_listaCamadasFiltroTempo($map_file){
	$mapa = ms_newMapObj($map_file);
	$layers = analise_listaLayersMetaestat($mapa);
	$m = new Metaestat();
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
function analise_aplicaFiltroTempo($map_file,$tema,$pari,$vali,$parf,$valf){
	$mapa = ms_newMapObj($map_file);
	$layer = $mapa->getlayerbyname($tema);
	$id_medida_variavel = $layer->getmetadata("ID_MEDIDA_VARIAVEL");
	$data = $layer->data;
	$m = new Metaestat();
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
function analise_listaCamadasMetaestat($map_file){
	$mapa = ms_newMapObj($map_file);
	$layers = analise_listaLayersMetaestat($mapa);
	$camadas = array();
	foreach($layers as $l){
		$camadas[] = $l->name;
	}
	return $camadas;
}
//se $tipo for igual a "" remove os filtros
function analise_aplicafiltroregiao($map_file,$codigo_tipo_regiao,$codigo_regiao,$codigo_tipo_regiao_pai,$codigo_regiao_pai,$tipo=""){
	$mapa = ms_newMapObj($map_file);
	$layers = analise_listaLayersMetaestat($mapa);
	if($codigo_tipo_regiao != ""){
		$layers = analise_listaLayersRegiao($layers,$codigo_tipo_regiao);
	}
	if(count($layers) > 0){
		$m = new Metaestat();
		$regiao = $m->listaTipoRegiao($codigo_tipo_regiao);
		//aplica o filtro considerando os codigos que definem a propria regiao
		$filtro = "";
		if($tipo == "regiaoatual"){
			$filtro = $regiao["esquemadb"].".".$regiao["tabela"].".".$regiao["identificador"]."::text = '$codigo_regiao'";
		}
		if($tipo == "regiaopai"){
			//$filtro = $regiao["esquemadb"].".".$regiao["tabela"].".".$regiao["identificador"]."::text = '$codigo_regiao'";
			$pai = $m->listaAgregaRegiaoFilho($codigo_tipo_regiao,$codigo_tipo_regiao_pai);
			//var_dump($pai);exit;
			$filtro = "g.".$pai["colunaligacao_regiaopai"]."::text = '$codigo_regiao_pai'";
		}
		foreach($layers as $l){
			$data = $l->data;
			//substitui os marcadores definidos na construcao do layer. Veja a classe metaestat
			$s = explode("/*FA*/",$data);
			if(count($s) > 1){
				if($tipo == ""){
					$data = $s[0]."/*FA*//*FA*/".$s[2];
				}
				else{
					$data = $s[0]."/*FA*/ AND ".$filtro." /*FA*/".$s[2];
				}
			}
			$l->set("data",$data);
		}
	}
	$mapa->save($map_file);
	return "ok";
}
function analise_listaLayersMetaestat($mapa){
	$c = $mapa->numlayers;
	$layers = array();
	for ($i=0;$i < $c;++$i){
		$l = $mapa->getlayer($i);
		if($l->getmetadata("METAESTAT") == "SIM"){
			$layers[] = $l;
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
?>