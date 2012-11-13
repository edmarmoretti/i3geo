<?php
include_once(__DIR__."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: ANALISEDISTRIPT

Gera an&aacute;lise de distribui&ccedil;&atilde;o de pontos.

Executa script R para gerar a imagem.

<Analise->analiseDistriPt>
*/
	case "ANALISEDISTRIPT":
		include_once(__DIR__."/../../classesphp/classe_analise.php");
		copiaSeguranca($map_file);
		if(!isset($tema2))
		{$tema2 = "";}
		if(!isset($limitepontos))
		{$limitepontos = "";}
		$m = new Analise($map_file,$tema,$locaplic,$ext);
		if(empty($item)){
			$item = "";
		}
		$retorno = $m->analiseDistriPt($locaplic,$dir_tmp,$R_path,$numclasses,$tipo,$cori,$corf,$tmpurl,$sigma,$limitepontos,$tema2,$extendelimite);
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