<?php
include_once(dirname(__FILE__)."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
	case "SHAPE2PONTOS":
		$mapa = ms_newMapObj($map_file);
		$layer = $mapa->getlayerbyname($tema);
		$shapes = retornaShapesMapext($layer,$mapa);
		
		//quando ponto 0
		if($layer->type == 0){
			$objLine = $shapes[0]->line;
			$pontoA = $objLine0(0);
			$objLine = $shapes[count($shapes) - 1]->line;
			$pontoB = $objLine(0);
		}
		//quando linha 1
		if($layer->type == 1){
			$objLine = $shapes[0]->line;
			$pontoA = $objLine->point(0);
			$pontoB = $objLine->point($objLine->numpoints - 1);
		}		
		//quando poligono 2
		if($layer->type == 2){
			$objLine = $shapes[0]->line(0);
			$pontoA = $objLine->point(0);
			$pontoB = $shapes[0]->getCentroid();
		}		
		$retorno = array(
			"ax"=>$pontoA->x,
			"ay"=>$pontoA->y,
			"bx"=>$pontoB->x,
			"by"=>$pontoB->y
		);
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