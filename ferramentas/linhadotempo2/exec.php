<?php
include_once(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: MUDATAMANHO

Muda o tamanho da imagem do mapa atual.

<Mapa->mudaQS>
*/
	case "PARAMETROS":
		$map = ms_newMapObj($map_file);
		$layer = $map->getlayerbyname($tema);
		$retorno = array();
		$retorno["ltempoformatodata"] = $layer->getmetadata("ltempoformatodata");
		$retorno["ltempoiteminicio"] = $layer->getmetadata("ltempoiteminicio");
		$retorno["ltempoitemfim"] = $layer->getmetadata("ltempoitemfim");
		$retorno["ltempoitemtitulo"] = $layer->getmetadata("ltempoitemtitulo");
		$retorno["ltempoitemdescricao"] = $layer->getmetadata("ltempoitemdescricao");
		$retorno["ltempoconvencode"] = $layer->getmetadata("ltempoconvencode");
		$retorno["ltempoitemtip"] = $layer->getmetadata("ltempoitemtip");
		$retorno["ltempoitemimagem"] = $layer->getmetadata("ltempoitemimagem");
		$retorno["ltempoitemicone"] = $layer->getmetadata("ltempoitemicone");
		$retorno["ltempoitemlink"] = $layer->getmetadata("ltempoitemlink");
		$sopen = $layer->open();
		if($sopen != MS_FAILURE){
			$items = $layer->getItems();
		}
		else{
			$items = array();
		}
		$retorno["colunas"] = implode(",",$items);
	break;
	case "SALVA":
		$map = ms_newMapObj($map_file);
		$layer = $map->getlayerbyname($tema);
		$layer->setmetadata("ltempoformatodata",$_GET["ltempoformatodata"]);
		$layer->setmetadata("ltempoiteminicio",$_GET["ltempoiteminicio"]);
		$layer->setmetadata("ltempoitemfim",$_GET["ltempoitemfim"]);
		$layer->setmetadata("ltempoitemtitulo",$_GET["ltempoitemtitulo"]);
		$layer->setmetadata("ltempoitemdescricao",$_GET["ltempoitemdescricao"]);
		$layer->setmetadata("ltempoconvencode",$_GET["ltempoconvencode"]);
		$layer->setmetadata("ltempoitemtip",$_GET["ltempoitemtip"]);
		$layer->setmetadata("ltempoitemimagem",$_GET["ltempoitemimagem"]);
		$layer->setmetadata("ltempoitemicone",$_GET["ltempoitemicone"]);
		$layer->setmetadata("ltempoitemlink",$_GET["ltempoitemlink"]);
		$map->save($map_file);
		$retorno = "ok";
		break;
}
cpjson($retorno);
?>