<?php
include_once(__DIR__."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: NPTPOL

Conta o n&uacute;mero de pontos em pol&iacute;gono cruzando dois temas.

Salva o mapa acrescentando um novo layer com o resultado.

<Analise->nptPol>
*/
	case "NPTPOL":
		include_once(__DIR__."/../../classesphp/classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema,$locaplic,$ext);
		$retorno = $m->nptPol($temaPt,$temaPo,$locaplic);
		$m->salva();
		$_SESSION["contadorsalva"]++;
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