<?php
include_once(dirname(__FILE__)."/../../admin/php/login.php");

include(dirname(__FILE__)."/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);

$funcoesEdicao = array(
		"REMOVETME",
		"INCLUITME"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/editormapfile") == false){
		retornaJSON("Vc nao pode realizar essa operacao. Tente fazer login novamente.");exit;
	}
}
$tema = $_POST["tema"];
//error_reporting(0);
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
	case "REMOVETME":
		$mapa = ms_newMapObj($map_file);
		$l = $mapa->getlayerbyname($tema);
		if($l != ""){
			$l->setmetadata("tme","");
			$mapa->save($map_file);
		}
		$retorno = "ok";
	break;
	case "INCLUITME":
		$mapa = ms_newMapObj($map_file);
		$l = $mapa->getlayerbyname($tema);
		if($l != ""){
			$l->setmetadata("tme",base64_decode($_POST["tme"]));
			$mapa->save($map_file);
		}
		$retorno = "ok";
	break;
}
cpjson($retorno);

?>