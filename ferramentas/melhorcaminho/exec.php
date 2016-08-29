<?php
include_once(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
if($statusFerramentas["melhorcaminho"] != true){
	exit;
}
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
	case "SHAPE2PONTOS":
		$mapa = ms_newMapObj($map_file);
		$layer = $mapa->getlayerbyname($tema);
		$shapes = retornaShapesSelecionados($layer,$map_file,$mapa);

		if(count($shapes) == 0){
			$shapes = retornaShapesMapext($layer,$mapa);
		}
		//quando ponto 0
		if($layer->type == 0){
			$objLine = $shapes[0]->line(0);
			$pontoA = $objLine->point(0);
			$objLine = $shapes[count($shapes) - 1]->line(0);
			$pontoB = $objLine->point(0);
		}
		//quando linha 1
		if($layer->type == 1){
			$objLine = $shapes[0]->line(0);
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
		$layer = $mapa->getlayerbyname($_GET["raster"]);
		$cost_surface_path = $layer->data;
		$prefixo = nomeRandomico(3);
		//verifica se o mapa de custo existe
		if(file_exists($cost_surface_path)){
			$pathresult = $dir_tmp."/melhorcaminho_".nomeRandomico();
			//cria a pasta onde os resultados serao armazenados
			mkdir ($pathresult,0744);
			$pta = $_GET["pta"];
			$ptb = $_GET["ptb"];

			//parametros para o calculo de melhor caminho e linha reta
			$best = array(
				"p1"=>	array(
					"calculation_type" =>"best_path",
					"file_prefix" => $prefixo,
					"start_coord" => "[$pta]",
					"stop_coord" => "[$ptb]"
				)
			);
			$cart = array(
				"p2"=>	array(
						"calculation_type" =>"cartesian_straight_line_cost",
						"file_prefix" => $prefixo,
						"start_coord" => "[$pta]",
						"stop_coord" => "[$ptb]"
				)
			);
			//guarda os processos que serao executados
			$processos = array($best,$cart);
			//parametros para calculo do buffer
			if($buffer > 0){
				$buf = array(
					"p3"=>	array(
							"calculation_type" =>"best_path_within_buffer",
							"buffer_km" => $_GET["buffer"],
							"file_prefix" => $prefixo,
							"start_coord" => "[$pta]",
							"stop_coord" => "[$ptb]"
					)
				);
				$processos[] = $buf;
			}
			//parametros para calculo com reclassificacao
			$lut = $_GET["lut"];
			if($lut != ""){
				//pega os valores da lut
				$lista = explode("|",$lut);
				$novaLut = array();
				foreach($lista as $li){
					$v = explode(",",$li);
					$novaLut[] = "- {min: $v[0], max: $v[1], nv: $v[2]}";
				}
				if(count($novaLut) == 1){
					$novaLut = "\n".implode("",$novaLut);
				}
				else{
					$novaLut = implode("\n",$novaLut);
				}
				$lut = array(
					"p4"=>	array(
							"calculation_type" =>"best_path_lut",
							"lut" => $novaLut,
							"file_prefix" => $prefixo,
							"start_coord" => "[$pta]",
							"stop_coord" => "[$ptb]"
					)
				);
				$processos[] = $lut;
			}
			//parametros para o calculo quando o usuario escolhe um layer que contem um shapefile
			$temausuario = $_GET["temausuario"];
			if($temausuario != ""){
				//exporta o layer como um shapefile pois pode ser postgis
				$shparq = downloadTema2($map_file,$temausuario,$locaplic,$dir_tmp,$postgis_mapa);
				$shparq = explode(",",$shparq["arquivos"]);
				$shparq = $dir_tmp."/".basename($shparq[0]);
				$shp = array(
						"p5"=>	array(
								"calculation_type" =>"informed_path_cost",
								"informed_path" => $shparq,
								"file_prefix" => $prefixo,
								"start_coord" => "[$pta]",
								"stop_coord" => "[$ptb]"
						)
				);
				$processos[] = $shp;
			}
			//monta o array que sera utilizado para gerar o arquivo yaml que sera o input do programa python que faz o calculo
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
			$yaml = str_replace("- p"," p",$yaml);
			$yaml = str_replace("'","",$yaml);
			$yaml = str_replace('"',"",$yaml);
			$yaml = trim($yaml)."\n";
			$yaml = str_replace('|-',"",$yaml);
			$yaml = str_replace('|2-',"",$yaml);
			//salva o arquivo com os parametros
			$fp = fopen($y,"w");
			fwrite($fp,$yaml);
			fclose($fp);
			//executa os calculos
			exec(dirname(__FILE__)."/better_path.py $y");
			//adiciona ao mapa atual os shapefiles criados
			include_once("../../classesphp/classe_mapa.php");
			$m = new Mapa($map_file);
			if(file_exists($pathresult."/".$prefixo."_best_path.shp")){
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
			}
			if(file_exists($pathresult."/".$prefixo."_cartesian_straight_line_cost.shp")){
				//cartesian_straight_line_cost
				$retorno = $m->adicionaTemaSHP($pathresult."/".$prefixo."_cartesian_straight_line_cost.shp");
				$layer = $m->mapa->getlayerbyname($prefixo."_cartesian_straight_line_cost.shp");
				$layer->setmetadata("TEMA","Linha reta entre os pontos A e B $prefixo");
				$layer->setmetadata("DOWNLOAD","SIM");
				$layer->setmetadata("TEMALOCAL","SIM");
				$classe = $layer->getclass(0);
				$estilo = $classe->getstyle(0);
				$cor = $estilo->color;
				$cor->setRGB(255,0,255);
				$estilo->set("width",2);
			}
			if(file_exists($pathresult."/".$prefixo."_best_path_within_buffer.shp")){
				//best_path_within_buffer
				$retorno = $m->adicionaTemaSHP($pathresult."/".$prefixo."_best_path_within_buffer.shp");
				$layer = $m->mapa->getlayerbyname($prefixo."_best_path_within_buffer.shp");
				$layer->setmetadata("TEMA","Melhor caminho dentro do buffer $prefixo");
				$layer->setmetadata("DOWNLOAD","SIM");
				$layer->setmetadata("TEMALOCAL","SIM");
				$classe = $layer->getclass(0);
				$estilo = $classe->getstyle(0);
				$cor = $estilo->color;
				$cor->setRGB(255,255,0);
				//buffer
				$retorno = $m->adicionaTemaSHP($pathresult."/".$prefixo."_buffer_best_path_within_buffer.shp");
				$layer = $m->mapa->getlayerbyname($prefixo."_buffer_best_path_within_buffer.shp");
				$layer->setmetadata("TEMA","Buffer $prefixo");
				$layer->setmetadata("DOWNLOAD","SIM");
				$layer->setmetadata("TEMALOCAL","SIM");
				$classe = $layer->getclass(0);
				$estilo = $classe->getstyle(0);
				$cor = $estilo->color;
				$cor->setRGB(-1,-1,-1);
				$estilo->set("width",2);
			}
			if(file_exists($pathresult."/".$prefixo."_best_path_lut.shp")){
				//cartesian_straight_line_cost
				$retorno = $m->adicionaTemaSHP($pathresult."/".$prefixo."_best_path_lut.shp");
				$layer = $m->mapa->getlayerbyname($prefixo."_best_path_lut.shp");
				$layer->setmetadata("TEMA","Melhor caminho com reclassifica&ccedil;&atilde;o dos pixels $prefixo");
				$layer->setmetadata("DOWNLOAD","SIM");
				$layer->setmetadata("TEMALOCAL","SIM");
				$classe = $layer->getclass(0);
				$estilo = $classe->getstyle(0);
				$cor = $estilo->color;
				$cor->setRGB(0,255,255);
			}
			//salva o mapfile
			$m->salva();
		}
		else{
			$retorno = "<span style='color:red' >Erro. Arquivo raster n&atilde;o encontrado</span>";
		}
		$retorno = $pathresult;
	break;
	case "RELATORIO":
		$yaml = yaml_parse_file($_GET["caminho"]."/result.yaml");
		$resultados = $yaml["results"];
		$retorno = array();
		foreach($resultados as $r){
			$retorno[$r["item"]] = $r["cost"];
		}
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>