<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
switch (strtoupper($_GET["funcao"]))
{
	case "PARAMETROSPLUGIN":
		//no mashup o nome do tema e sempre o nome do mapfile
	    if (file_exists($_SESSION["locaplic"]."/temas/".$_GET["tema"].".map")){
	        $map1 = @ms_newMapObj($_SESSION["locaplic"]."/temas/".$_GET["tema"].".map");
	        $layer1 = $map1->getlayerbyname($_GET["tema"]);
		}
		else{
			//nesse caso, o mapfile vem da secao php
		    $map = ms_newMapObj($_SESSION["map_file"]);
			$layer = $map->getlayerbyname($_GET["tema"]);
			//os parametros do plugin sao obtidos do mapfile original
			if (file_exists($_SESSION["locaplic"]."/temas/".$layer->getmetadata("nomeoriginal").".map")){
			    $map1 = @ms_newMapObj($_SESSION["locaplic"]."/temas/".$layer->getmetadata("nomeoriginal").".map");
				$layer1 = $map1->getlayerbyname($layer->getmetadata("nomeoriginal"));
			}
		}
		if($map1){
			if($layer1 != ""){
				$c = $layer1->getmetadata("PLUGINI3GEO");
				if($c == ""){
					$retorno = "erro";
				}
				else{
					if (!mb_detect_encoding($c,"UTF-8",true)){
						$c = utf8_encode($c);
					}
					$retorno = json_decode($c,true);
				}
			}
			else{
				$retorno = "layer nao encontrado em temas";
			}
		}
		else{
			$retorno = "Erro ao criar o mapa";
		}
		break;
	case "APLICAR":
		$valores = $_GET["valores"];
		$valores = str_ireplace(array(" and ", " or ", "select","from","where","update","delete","insert","--","drop",";"),"",$valores);
		$valores = explode(",",$valores);
		$titulos = $_GET["titulos"];
		$titulos = explode(",",$titulos);
		$chaves = $_GET["chaves"];
		$chaves = str_ireplace(array(" and ", " or ", "select","from","where","update","delete","insert","--","drop",";"),"",$chaves);
		$chaves = explode(",",$chaves);
		if(count($chaves) <> count($valores)){
			echo "erro";
			exit;
		}
		//cria um array cuja key e a chave
		$dados = array();
		$n = count($chaves);
		for($i = 0; $i < $n; $i++){
			$dados[$chaves[$i]] = array("valor"=>$valores[$i],"titulo"=>$titulos[$i]);
		}

		$map = ms_newMapObj($_SESSION["map_file"]);
		//pega o layer
		$layer = $map->getlayerbyname($_GET["tema"]);
		if($_GET["nova"] == "true"){
		    $layer = ms_newLayerObj($map,$layer);
		    $layer->name = "novo".nomeRandomico();
		}
		$map1 = @ms_newMapObj($_SESSION["locaplic"]."/temas/".$layer->getmetadata("nomeoriginal").".map");
		if($map1){
			$layer1 = $map1->getlayerbyname($layer->getmetadata("nomeoriginal"));
			if($layer1 != ""){
				$data = $layer1->data;
				$c = $layer1->getmetadata("PLUGINI3GEO");
				if($c == ""){
					$retorno = "erro";
				}
				if($c != ""){
					//pega as chaves originais do mapfile
					$cs = json_decode(utf8_encode($c),true);
					$cs = $cs["parametros"];
					$chaves = array();
					foreach($cs as $c){
						$chaves[] = $c["chave"];
					}
					$chaves = implode(",",$chaves);
					$chaves = str_ireplace(array(" and ", " or ", "select","from","where","update","delete","insert","--","drop",";"),"",$chaves);
					$chaves = explode(",",$chaves);
					$filtro = $layer1->getFilterString();
					$titulofim = array();
					if(!empty($dados)){
						foreach($chaves as $k){
							if($k != ""){
								$v = $dados[$k]["valor"];
								$data = str_replace($k,$v,$data);
								if($filtro != ""){
									$filtro = str_replace($k,$v,$filtro);
								}
								$titulofim[] = $dados[$k]["titulo"]." ".$v;
							}
						}
						if($filtro != ""){
							$layer->setfilter($filtro);
						}
						$layer->set("data",$data);
					}
					if(isset($_GET["ativacamada"])){
					   $layer->set("status",MS_DEFAULT);
					}
					$layer->setmetadata("PLUGINI3GEO",'{"plugin":"parametrossql","ativo":"sim"}');
					$layer->setmetadata("TEMA",$layer1->getmetadata("TEMA")." - ".implode(". ",$titulofim));

					//$layer->set("name","plugin".nomeRandomico());
					$layer->setmetadata("nomeoriginal",$layer1->name);
					$layer->setmetadata("CACHE","nao");
					if (connection_aborted()){
						exit();
					}
					$salvo = $map->save($_SESSION["map_file"]);
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
		break;

	case "INCLUDEPROG":
		$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
		$protocolo = $protocolo[0];
		$protocolo1 = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'];
		$protocolo = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
		$urli3geo = str_replace("/ferramentas/parametrossql/exec.php","",$protocolo.$_SERVER["PHP_SELF"]);
		$handle = curl_init();
		//em alguns casos, com rancher, retorna a porta 8080
		$urli3geo = str_replace(":8080","",$urli3geo);
		curl_setopt( $handle, CURLOPT_URL, $urli3geo."/".$_GET["prog"]);
		curl_setopt( $handle, CURLOPT_HEADER, false );
		curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
		$retorno = curl_exec( $handle );
		curl_close( $handle );
		$retorno = json_decode($retorno,true);
		break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);
