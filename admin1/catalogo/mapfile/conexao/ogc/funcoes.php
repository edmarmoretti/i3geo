<?php

namespace admin\catalogo\mapfile\conexao\ogc;

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
	$metas = array("_srs","_name","_server_version","_format","_auth_username","_auth_password","_auth_type","_connectiontimeout","_latlonboundingbox","_proxy_auth_type","_proxy_host","_proxy_port","_proxy_type","_proxy_username","_proxy_password","_sld_body","_sld_url","_style","_bgcolor","_transparent","_time","_tile");
	foreach ($metas as $m){
		$pre = "";
		if($layer->getmetadata("wms".$m) != ""){
			$pre = "wms";
		}
		if($layer->getmetadata("wfs".$m) != ""){
			$pre = "wfs";
		}
		if($layer->getmetadata("ows".$m) != ""){
			$pre = "ows";
		}
		$dados["ows".$m] = $layer->getmetadata($pre.$m);
	}
	return $dados;
}
function alterar($locaplic,$codigo,$connection,$connectiontype,$ows_srs,$ows_name,$ows_server_version,$ows_format,$ows_auth_username,$ows_auth_password,$ows_auth_type,$ows_connectiontimeout,$ows_latlonboundingbox,$ows_proxy_auth_type,$ows_proxy_host,$ows_proxy_port,$ows_proxy_type,$ows_proxy_username,$ows_proxy_password,$ows_sld_body,$ows_sld_url,$ows_style,$ows_bgcolor,$ows_transparent,$ows_time,$ows_tile,$dbhw) {
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
	$layer->setmetadata("METAESTAT_CODIGO_TIPO_REGIAO","");
	$layer->setmetadata("METAESTAT_ID_MEDIDA_VARIAVEL","");
	$layer->setmetadata("metaestat","");
	$layer->set("connection",$connection);
	$layer->setconnectiontype($connectiontype);
	$layer->set("type",$type);
	$metas = array("_srs","_name","_server_version","_format","_auth_username","_auth_password","_auth_type","_connectiontimeout","_latlonboundingbox","_proxy_auth_type","_proxy_host","_proxy_port","_proxy_type","_proxy_username","_proxy_password","_sld_body","_sld_url","_style","_bgcolor","_transparent","_time","_tile");
	foreach ($metas as $m){
		$layer->setmetadata("wms".$m,${"ows".$m});
		$layer->setmetadata("wfs".$m,${"ows".$m});
		$layer->setmetadata("ows".$m,${"ows".$m});
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