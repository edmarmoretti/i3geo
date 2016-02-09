<?php
/*
Este programa inicia o i3geo e roda uma fun&ccedil;&atilde;o para processar o mapfile criado antes de abrir o mapa
*/
//
//nome da fun&ccedil;&atilde;o que ser&aacute; executada antes de abrir o I3Geo
//
$executa = "teste";
//
//caminho relativo ao programa atual, onde est&aacute; instalado o I3Geo
//
$caminho = "../";
//
//include do ms_criamapa.php que inicia o I3Geo
//
include (dirname(__FILE__)."/../ms_criamapa.php");
//
//fun&ccedil;&atilde;o que ser&aacute; executada
//
function teste()
{
	global $tmpfname;
	//
	//inclua aqui a fun&ccedil;&atilde;o que ir&aacute; processar o mapfile atual
	//
	echo "<br>";
	echo "Mapfile atual= ".$tmpfname;
	//
	//para o I3Geo para mostrar o resultado
	//exclua essa linha em uma implementa&ccedil;&atilde;o real
	//
	exit;
}
?>
