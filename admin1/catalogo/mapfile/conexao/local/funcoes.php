<?php

namespace admin\catalogo\mapfile\conexao\local;

function listar($locaplic, $codigo) {
	// pega o nome registrado no mapfile
	if (! file_exists ( $locaplic . "/temas/" . $codigo . ".map" )) {
		header ( "HTTP/1.1 500 erro mapfile nao existe" );
		exit ();
	}
	$mapa = ms_newMapObj ( $locaplic . "/temas/" . $codigo . ".map" );
	$layer = $mapa->getlayerbyname ( $codigo );
	if ($layer == "") {
		header ( "HTTP/1.1 500 erro nao existe LAYER com o nome $codigo" );
		exit ();
	}
	$dados = array ();
	$dados ["connection"] = $layer->connection;
	$dados ["connectiontype"] = $layer->connectiontype;
	$dados ["data"] = $layer->data;
	$dados ["tileindex"] = $layer->tileindex;
	$dados ["tileitem"] = $layer->tileitem;
	if ($dados ["tileindex"] == "") {
		$dados ["tileitem"] = "";
	}
	if (is_array ( $postgis_mapa )) {
		$dados ["postgis_mapa"] = array_keys ( $postgis_mapa );
	} else {
		$dados ["postgis_mapa"] = $postgis_mapa;
	}
	$dados ["type"] = $layer->type;
	$dados ["projection"] = $layer->getProjection ();
	if ($dados ["projection"] == "null") {
		$dados ["projection"] = "";
	}
	$dados ["projection"] = str_replace ( "+i", "i", $dados ["projection"] );
	$dados ["convcaracter"] = $layer->getmetadata ( "convcaracter" );
	if(empty($dados ["convcaracter"])){
		$dados ["convcaracter"] = "NAO";
	}
	$dados ["convcaracter"] = strtoupper($dados ["convcaracter"]);
	// informacoes sobre a integracao com o sistema de metadados estatisticos
	$dados ["metaestat"] = $layer->getmetadata ( "metaestat" );
	if ($dados ["metaestat"] == "") {
		$dados ["metaestat"] = "NAO";
	}
	$dados ["metaestat"] = strtoupper($dados ["metaestat"]);
	$dados ["metaestat_id_medida_variavel"] = $layer->getmetadata ( "metaestat_id_medida_variavel" );
	return $dados;
}
function alterar($locaplic,$codigo,$connection,$connectiontype,$data,$tileindex,$tileitem,$type,$projection,$convcaracter,$metaestat,$metaestat_id_medida_variavel,$dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$arq = $locaplic . "/temas/" . $codigo . ".map";
	if ($codigo == "" || ! file_exists ( $arq )) {
		header ( "HTTP/1.1 400 arquivo nao existe" );
		exit ();
	}
	$mapa = ms_newMapObj ( $arq );
	$layer = @$mapa->getlayerbyname ( $codigo );
	if ($layer == "") {
		return false;
	}
	if(strtoupper($metaestat) == "SIM"){
		if(empty($metaestat_id_medida_variavel)){
			header ( "HTTP/1.1 400 id da medida esta vazio" );
			exit ();
		}
		$connectiontype = 6;
		$filteritem = "";
		$filter = "";
		$data = "";
		$connection = "";
		$dataCol = array(
				"tipoa_tema" => "META"
		);
		\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_temas",$dataCol,"WHERE codigo_tema = '$codigo'");
		$layer->setmetadata("metaestat","SIM");
		$layer->setmetadata("METAESTAT_ID_MEDIDA_VARIAVEL",$metaestat_id_medida_variavel);
	}
	else{
		$layer->setmetadata("METAESTAT_CODIGO_TIPO_REGIAO","");
		$layer->setmetadata("METAESTAT_ID_MEDIDA_VARIAVEL","");
		$layer->setmetadata("metaestat","");
		$dataCol = array(
				"tipoa_tema" => ""
		);
		\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_temas",$dataCol,"WHERE codigo_tema = '$codigo'");
	}
	//verifica a simbologia
	//evita que o LAYER falhe ao ser testado por nao ter o simbolo definido
	if($type == 0){
		$c = $layer->getClass(0);
		$e = $c->getStyle(0);
		if($e->symbolname == ""){
			$e->set("symbolname","ponto");
		}
	}
	if($type == 1){
		$c = $layer->getClass(0);
		$e = $c->getStyle(0);
		if($e->symbolname == "" || $e->symbolname == "ponto"){
			$e->set("symbolname","linha");
		}
	}
	if($type == 2){
		$c = $layer->getClass(0);
		$e = $c->getStyle(0);
		if($e->symbolname == "linha" || $e->symbolname == "ponto"){
			$e->set("symbolname"," ");
		}
	}
	$layer->setmetadata("convcaracter",$convcaracter);
	$layer->set("connection",$connection);
	$layer->setconnectiontype($connectiontype);
	$layer->set("data",$data);
	$layer->set("tileitem",$tileitem);
	$layer->set("tileindex",$tileindex);
	$layer->set("type",$type);
	$layer->setfilter($filter);
	$layer->set("filteritem",$filteritem);
	if($layer->getprojection() == MS_TRUE){
		$layer->setprojection($projection);
		if($layer->getprojection() == MS_FALSE && $projection != ""){
			$layer->setprojection($projection);
		}
	}

	try {
		$mapa->save ( $arq );
		\admin\php\funcoesAdmin\removeCabecalhoMapfile ( $arq );
		return true;
	} catch ( Exception $e ) {
		return false;
	}
}
?>