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
	case "MELHORCAMINHO":
		//converte os parametros em um arquivo YAML
		$mapa = ms_newMapObj($map_file);
		$layer = $mapa->getlayerbyname($raster);
		$cost_surface_path = $layer->data;
		$prefixo = nomeRandomico(3);
		if(file_exists($cost_surface_path)){
			$pathresult = $dir_tmp."/melhorcaminho_".nomeRandomico();
			//$pta = explode(",",$pta);
			//$ptb = explode(",",$ptb);
			mkdir ($pathresult,0777);

			$best = array(
				" p1"=>	array(
					"calculation_type" =>"best_path",
					"file_prefix" => $prefixo,
					"start_coord" => "[$pta]",
					"stop_coord" => "[$ptb]"
				)
			);
			$cart = array(
				" p2"=>	array(
						"calculation_type" =>"cartesian_straight_line_cost",
						"file_prefix" => $prefixo,
						"start_coord" => "[$pta]",
						"stop_coord" => "[$ptb]"
				)
			);
			
			$processos = array($best,$cart);
			
			$a = array(
				"cost_surface_path" => $cost_surface_path,
				"pathresult" => $pathresult,
				"processes"=> $processos
			);
			$y = $pathresult."/input.yaml";
			$yaml = yaml_emit($a);
			//adapta o formato YAML para que o Python entenda
			$yaml = str_replace("---","",$yaml);
			$yaml = str_replace("...","",$yaml);
			$yaml = str_replace("- ","",$yaml);
			$yaml = str_replace("'","",$yaml);
			$yaml = trim($yaml)."\n";
			//salva o arquivo com os parametros
			$fp = fopen($y,"w");
			fwrite($fp,$yaml);
			fclose($fp);
			exec(dirname(__FILE__)."/better_path.py $y");
			//adiciona o shapefile
			if(file_exists($pathresult."/".$prefixo."_best_path.shp")){
				include_once("../../classesphp/classe_mapa.php");
				$m = new Mapa($map_file);
				//adiciona ao mapa best_path
				$retorno = $m->adicionaTemaSHP($pathresult."/".$prefixo."_best_path.shp");
				$layer = $m->mapa->getlayerbyname($prefixo."_best_path.shp");
				$layer->setmetadata("TEMA","Melhor caminho $prefixo");
				$layer->setmetadata("DOWNLOAD","SIM");
				$layer->setmetadata("TEMALOCAL","SIM");
				$classe = $layer->getclass(0);
				$estilo = $classe->getstyle(0);
				$cor = $estilo->color;
				$cor->setRGB(255,0,0);
				//cartesian_straight_line_cost
				$retorno = $m->adicionaTemaSHP($pathresult."/".$prefixo."_cartesian_straight_line_cost.shp");
				$layer = $m->mapa->getlayerbyname($prefixo."_cartesian_straight_line_cost.shp");
				$layer->setmetadata("TEMA","Caminho mais curto $prefixo");
				$layer->setmetadata("DOWNLOAD","SIM");
				$layer->setmetadata("TEMALOCAL","SIM");
				$classe = $layer->getclass(0);
				$estilo = $classe->getstyle(0);
				$cor = $estilo->color;
				$cor->setRGB(255,0,255);
				$estilo->set("width",2);
				$m->salva();
			}
		}
		else{
			$retorno = "<span style='color:red' >Erro. Arquivo raster n&atilde;o encontrado</span>";
		}
		$retorno = "";
	break;
}
if (!connection_aborted()){
	if(isset($map_file) && isset($postgis_mapa) && $map_file != "")
	restauraCon($map_file,$postgis_mapa);
	cpjson($retorno);
}
else{
	exit();
}
?>