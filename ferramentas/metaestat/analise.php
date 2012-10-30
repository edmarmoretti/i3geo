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
}
if (!connection_aborted()){
	cpjson($retorno);
}
else
{exit();}
function listaFiltroTempoRaiz($map_file,$nivel){
	$mapa = ms_newMapObj($map_file);
	$layers = analise_listaLayersMetaestat($mapa);
	$m = new Metaestat();
	//pega os parametros de tempo
	$filtros = array();
	foreach($layers as $l){
		$id_medida_variavel = $l->getmetadata("ID_MEDIDA_VARIAVEL");
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
		$id_medida_variavel = $l->getmetadata("ID_MEDIDA_VARIAVEL");
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