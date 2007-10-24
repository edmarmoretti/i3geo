<?php
/*
Este programa inicia o i3geo e roda uma função para processar o mapfile criado antes de abrir o mapa
*/
//
//nome da função que será executada antes de abrir o I3Geo
//
$executa = "teste";
//
//caminho relativo ao programa atual, onde está instalado o I3Geo
//
$caminho = "../";
//
//include do ms_criamapa.php que inicia o I3Geo
//
include ("../ms_criamapa.php");
//
//função que será executada
//
function teste()
{
	global $tmpfname;
	//
	//inclua aqui a função que irá processar o mapfile atual
	//
	echo "<br>";
	echo "Mapfile atual= ".$tmpfname;
	//
	//para o I3Geo para mostrar o resultado
	//exclua essa linha em uma implementação real
	//
	exit;
}
?>
