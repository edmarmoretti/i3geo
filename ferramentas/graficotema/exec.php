<?php
include_once(dirname(__FILE__)."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: GRAFICOTEMA

Gera graficos automaticamente para os elementos de um tema

<Temas->graficotema>
*/
	case "GRAFICOTEMA":
		include_once(dirname(__FILE__)."/../../classesphp/classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema,$locaplic);
		$m->graficotema($lista,$tamanho,$tipo,$outlinecolor,$offset);
		$m->salva();
		$_SESSION["contadorsalva"]++;
		redesenhaMapa();
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