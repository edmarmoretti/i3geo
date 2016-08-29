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
Valor: APLICAPARAMETROSLEGIMG

Aplica um par&acirc;metro em um estilo de uma classe.

<Legenda->aplicaParametrosLegImg>
*/
	case "APLICAPARAMETROSLEGIMG":
		include_once(dirname(__FILE__)."/../../classesphp/classe_legenda.php");
		//
		//no caso da op&ccedil;&atilde;o de legenda incluida no mapa, o modo cgi n&atilde;o desenha a imagem corretamente
		//
		if($status == 3)
		{
			$_SESSION["utilizacgi"] = "nao";
			$utilizacgi = "nao";
		}
		$m = new Legenda($map_file);
		$retorno = $m->aplicaParametrosLegImg($_GET["fonte"],$_GET["imagecolor"],$_GET["position"],$_GET["status"],$_GET["outlinecolor"],$_GET["keyspacingy"],$_GET["keyspacingx"],$_GET["keysizey"],$_GET["keysizex"],$_GET["height"],$_GET["width"],$_GET["labelsize"]);
		$m->salva();
		$_SESSION["contadorsalva"]++;
	break;
/*
Valor: PEGAPARAMETROSLEGIMG

Pega os par&acirc;metros da legenda embebida no mapa.

<Legenda->pegaParametrosLegImg>
*/
	case "PEGAPARAMETROSLEGIMG":
		include_once(dirname(__FILE__)."/../../classesphp/classe_legenda.php");
		$m = new Legenda($map_file);
		$retorno = $m->pegaParametrosLegImg();
	break;
/*
Valor: TESTALEGENDA

Testa os par&acirc;metros de defini&ccedil;&atilde;o da legenda inserida no mapa.

<Legenda->aplicaParametrosLegImg>
*/
	case "TESTALEGENDA":
		include_once(dirname(__FILE__)."/../../classesphp/classe_legenda.php");
		$map_file = str_replace(".map","",$map_file).".map";
		copy($map_file,str_replace(".map","testeleg.map",$map_file));
		$m = new Legenda(str_replace(".map","testeleg.map",$map_file));
		$m->aplicaParametrosLegImg($_GET["fonte"],$_GET["imagecolor"],$_GET["position"],$_GET["status"],$_GET["outlinecolor"],$_GET["keyspacingy"],$_GET["keyspacingx"],$_GET["keysizey"],$_GET["keysizex"],$_GET["height"],$_GET["width"],$_GET["labelsize"]);
		$retorno = $m->legendaGrafica();
	break;

}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>