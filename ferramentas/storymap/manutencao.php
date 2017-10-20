<?php
include_once(dirname(__FILE__)."/../../admin/php/login.php");
include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),"",false);
$funcoesEdicao = array(
		"REMOVE",
		"INCLUI"
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
	case "REMOVE":
		$mapa = ms_newMapObj($map_file);
		$l = $mapa->getlayerbyname($tema);
		if($l != ""){
			$l->setmetadata("storymap","");
			$mapa->save($map_file);
		}
		$retorno = "ok";
	break;
	case "INCLUI":
		restauraCon($map_file,$postgis_mapa);
		$mapa = ms_newMapObj($map_file);
		$l = $mapa->getlayerbyname($tema);
		if($l != ""){
			$l->setmetadata("storymap",str_replace("\\","'",$_POST["storymap"]));
			$mapa->save($map_file);
		}
		$retorno = "ok";
	break;
}
cpjson($retorno);

?>