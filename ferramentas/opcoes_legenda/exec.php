<?php
include_once(dirname(__FILE__)."/../inicia.php");
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
		$retorno = $m->aplicaParametrosLegImg($fonte,$imagecolor,$position,$status,$outlinecolor,$keyspacingy,$keyspacingx,$keysizey,$keysizex,$height,$width,$labelsize);
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
		copy($map_file,str_replace(".map","testeleg.map",$map_file));
		$m = new Legenda(str_replace(".map","testeleg.map",$map_file));
		$m->aplicaParametrosLegImg($fonte,$imagecolor,$position,$status,$outlinecolor,$keyspacingy,$keyspacingx,$keysizey,$keysizex,$height,$width,$labelsize);
		$retorno = $m->legendaGrafica();
	break;

}
if (!connection_aborted()){
	if(isset($map_file) && isset($postgis_mapa) && $map_file != "")
	restauraCon($map_file,$postgis_mapa);
	cpjson($retorno);
}
else
{exit();}
?>