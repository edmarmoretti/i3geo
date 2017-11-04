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
Valor: ATIVAETIQUETAS

Ativa as etiquetas de um tema.

<Toponimia->ativaEtiquetas>
*/
	case "ATIVAETIQUETAS":
		include_once(dirname(__FILE__)."/../../classesphp/classe_toponimia.php");
		copiaSeguranca($map_file);
		$m = new Toponimia($map_file,$tema);
		$m->layer->setmetadata("IDENTIFICA","");
		$m->layer->setmetadata("TIP",$_GET["tips"]);
		$m->layer->setmetadata("ITENS",$_GET["itens"]);
		$m->layer->setmetadata("ITENSDESC",$_GET["itensdesc"]);
		$m->layer->setmetadata("ITENSLINK",$_GET["itenslink"]);
		$m->layer->setmetadata("itembuscarapida",$_GET["itembuscarapida"]);
		$m->salva();
		$_SESSION["contadorsalva"]++;
		$retorno = "ok";
	break;
/*
Valor: REMOVEETIQUETAS

Desativa as etiquetas de um tema.

<Toponimia->removeEtiquetas>
*/
	case "REMOVEETIQUETAS":
		include_once(dirname(__FILE__)."/../../classesphp/classe_toponimia.php");
		copiaSeguranca($map_file);
		$m = new Toponimia($map_file,$tema);
		$retorno = $m->removeEtiquetas();
		$m->salva();
		$_SESSION["contadorsalva"]++;
	break;
/*
 Valor: PEGADADOSETIQUETAS

Obtém os dados sobre itens, itensdesc, etc

<Toponimia->pegaDadosEtiquetas>
*/
	case "PEGADADOSETIQUETAS":
		include_once(dirname(__FILE__)."/../../classesphp/classe_toponimia.php");
		$m = new Toponimia($map_file,$tema);
		$retorno = $m->pegaDadosEtiquetas();
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>