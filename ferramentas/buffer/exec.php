<?php
include_once(__DIR__."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: CRIABUFFER

Gera entorno (buffer) nos elementos selecionados de um tema.

Salva o mapa acrescentando um novo layer com o buffer.

<Analise->criaBuffer>
*/
	case "CRIABUFFER":
		include_once(__DIR__."/../../classesphp/classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema,$locaplic,$ext);
		$retorno = $m->criaBuffer($distancia,$locaplic,$unir,$wkt);
		$m->salva();
		$_SESSION["contadorsalva"]++;
		//limpa selecao
		$qyfile = str_replace(".map",".qy",$map_file);
		if (file_exists($qyfile))
		{unlink ($qyfile);}
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