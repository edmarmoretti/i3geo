<?php
include_once(__DIR__."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Section: Gr&aacute;ficos

Cria&ccedil;&atilde;o de representa&ccedil;&otilde;es gr&aacute;ficas de dados estat&iacute;sticos.

<graficos.php>
*/
/*
Valor: GRAFICOSELECAO

Pega os dados necess&aacute;rios para a gera&ccedil;&atilde;o dos gr&aacute;ficos da ferramenta sele&ccedil;&atilde;o

<iniciaDadosGrafico>
*/
	case "GRAFICOSELECAO":
		include_once(__DIR__."/../../classesphp/graficos.php");
		if(!isset($exclui))
		{$exclui = "";}
		if(!isset($tipo))
		{$tipo = "nenhum";}
		if(!isset($ordenax))
		{$ordenax = "nao";}
		$retorno = iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,$tipo,false,$ext,true,$ordenax);
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