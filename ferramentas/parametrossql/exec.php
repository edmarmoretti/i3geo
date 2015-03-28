<?php
include_once(dirname(__FILE__)."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: APLICAR

Aplica a substituicao de chaves pelos valores enviados
*/
	case "APLICAR":
		$map = ms_newMapObj($map_file);
		//pega o layer
		$nomeLayer = "";
		$c = $map->numlayers;
		//obtem o layer existente no mapfile
		//esse layer pode conter o nome no metadata nomeoriginal ou em NAME
		for ($i=0;$i < $c;++$i){
			$layer = $map->getlayer($i);
			if($layer->name == $tema){
				$nomeLayer = $tema;
				break;
			}
			elseif($tema == $layer->getmetadata("nomeoriginal")){
				$nomeLayer = $layer->name;
			}
		}
		if($nomeLayer == ""){
			$retorno = "layer nao encontrado";
		}
		else{
			$layer = $map->getlayerbyname($nomeLayer);
			//os parametros do plugin sao obtidos do mapfile original
			//isso evita que o mapfile temporario contenha as informacoes
			//sobre as variaveis de substituicao
			if(file_exists($locaplic."/temas/".$nomeLayer.".map")){
				$map1 = @ms_newMapObj($locaplic."/temas/".$nomeLayer.".map");
			}
			elseif (file_exists($locaplic."/temas/".$layer->getmetadata("nomeoriginal").".map")){
				$map1 = @ms_newMapObj($locaplic."/temas/".$layer->getmetadata("nomeoriginal").".map");
			}
			if($map1){
				$layer1 = $map1->getlayerbyname($nomeLayer);
				if($layer1 != ""){
					$data = $layer1->data;
					$c = $layer1->getmetadata("PLUGINI3GEO");
					if($c == ""){
						$retorno = "erro";
					}
					if($c != ""){
						$cs = json_decode($c,true);
						$cs = $cs["parametros"];
						$chaves = array();
						foreach($cs as $c){
							$chaves[] = $c["chave"];
						}
						$chaves = implode(",",$chaves);
						$filtro = $layer1->getFilterString();
						if(!empty($valores)){
							$chaves = str_ireplace(array("and", "or", "select","from","where","update","delete","insert","--"),"",$chaves);
							$chaves = explode(",",$chaves);
							$valores = str_ireplace(array("and", "or", "select","from","where","update","delete","insert","--"),"",$valores);
							$valores = explode(",",strip_tags($valores));
							$n = count($chaves);
							for($i = 0; $i < $n; $i++){
								if($chaves[$i] != ""){
									$v = $valores[$i];
									$data = str_replace($chaves[$i],$v,$data);
									if($filtro != ""){
										$filtro = str_replace($chaves[$i],$v,$filtro);
									}
								}
							}
							if($filtro != ""){
								$layer->setfilter($filtro);
							}
							$layer->set("data",$data);
						}
						$layer->set("status",MS_DEFAULT);
						$layer->setmetadata("PLUGINI3GEO",'{"plugin":"parametrossql","ativo":"sim","parametros":[{"titulo":"","tipo":"input","valores":[],"chave":"","prog":""}');
						$layer->setmetadata("TEMA",$layer->getmetadata("TEMA")." - ".implode(",",$valores));
						$layer->set("name","plugin".nomeRandomico());
						if (connection_aborted()){
							exit();
						}
						$salvo = $map->save($map_file);
						$retorno = "ok";
					}
				}
				else{
					$retorno = "layer $nomeLayer nao encontrado";
				}
			}
			else{
				$retorno = "mapfile nao encontrado em temas";
			}
		}
	break;
	case "REMOVER":
		$map = ms_newMapObj($map_file);
		$layer = $map->getlayerbyname($tema);
		if($layer != ""){
			$layer->set("status",MS_DELETE);
			$salvo = $map->save($map_file);
		}
		$retorno = "ok";
	break;
	case "INCLUDEPROG":
		if(file_exists($locaplic."/".$prog)){
			include($locaplic."/".$prog);
		}
	break;
}
if (!connection_aborted()){
	cpjson($retorno);
}
else
{exit();}
?>