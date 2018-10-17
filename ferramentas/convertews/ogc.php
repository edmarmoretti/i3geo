<?php
include(dirname(__FILE__)."/../../classesphp/sani_request.php");
include_once (dirname(__FILE__)."/../../classesphp/carrega_ext.php");
include(dirname(__FILE__)."/../../ms_configura.php");
$_GET = array_merge($_GET,$_POST);
error_reporting(0);
session_name("i3GeoPHP");
session_id($_GET["sid"]);
session_start();
$_GET["tema"] = $_SESSION["map_file"];

if(isset($_GET["BBOX"])){
	$_GET["BBOX"] = str_replace(" ",",",$_GET["BBOX"]);
}

if(isset($_GET["tema"])){
	$tema = $_GET["tema"];
}
if(isset($_GET["TileMatrix"])){
	$_GET["WIDTH"] = 256;
	$_GET["HEIGHT"] = 256;
	//calcula resolucoes
	$res = array();
	$temp = 0.703125;
	for($i = 0; $i < 40; $i++){
		$res[] = $temp;
		$temp = $temp / 2;
	}
	$_GET["tms"] = "/wmts/".$tema."/".$_GET["TileMatrix"]."/".$_GET["TileCol"]."/".$_GET["TileRow"];
	$_GET["tms"] = str_replace(".png","",$_GET["tms"]).".png";

	if($_GET["TileMatrix"]."/".$_GET["TileCol"]."/".$_GET["TileRow"] == "0/0/0" || $_GET["TileCol"] == -1 || $_GET["TileRow"]== -1){
		return;
	}
	$_GET["BBOX"] = $lon1.",".$lat1.",".$lon2.",".$lat2;
	$_GET["SERVICE"] = "WMS";
	$_GET["REQUEST"] = "getMap";

}
set_time_limit(0);
ini_set('memory_limit', '512M');
//
//caso nenhum parametros tenha sido enviado
//
if(count($_GET) == 0){
	$tipo="metadados";
	$_GET["REQUEST"] = "getCapabilities";
	$_GET["request"] = "getCapabilities";
	$_GET["SERVICE"] = "WMS";
}
//
//compatibiliza chamadas fora do padrao
//
if(isset($_GET["outputFormat"]) && $_GET["outputFormat"] != ""){
	$_GET["OUTPUTFORMAT"] = $_GET["outputFormat"];
}
if(isset($_GET["outputformat"]) && $_GET["outputformat"] != ""){
	$_GET["OUTPUTFORMAT"] = $_GET["outputformat"];
}
$cache = true;

include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");

if(isset($logExec) && $logExec["ogc"] == true){
	i3GeoLog("prog: ogc url: ".implode("&",array_merge($_GET,$_POST)),$_SESSION["dir_tmp"]);
}
//
//ajusta o default
//
if(!isset($_GET["ows_geomtype"]) || $_GET["ows_geomtype"] == ""){
	$ows_geomtype = "none";
}
else{
	$ows_geomtype = $_GET["ows_geomtype"];
}

//
//imprime na tela a ajuda
//
if(isset($_GET["ajuda"])){
	ogc_imprimeAjuda();
	exit;
}
//
//pega os enderecos para compor a url de chamada do gerador de web services
//
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$protocolo = $protocolo[0];
$protocolo1 = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'];
$protocolo = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
$urli3geo = str_replace("/ogc.php","",$protocolo.$_SERVER["PHP_SELF"]);

//ajusta o OUTPUTFORMAT
$OUTPUTFORMAT = $_GET["OUTPUTFORMAT"];
if(strpos(strtolower($OUTPUTFORMAT),"kml") !== false){
	$OUTPUTFORMAT = "kml";
}
if(strpos(strtolower($OUTPUTFORMAT),"kmz") !== false){
	$OUTPUTFORMAT = "kmz";
}
//
//para o caso da requisicao kmz
//kmz nao funciona diretamente com mapserver
//
if(strtolower($OUTPUTFORMAT) == "kmz"){
	$urln = "../../pacotes/kmlmapserver/kmlservice.php?request=kmz&map=".$tema."&typename=".$tema;
	header("Location:".$urln);
	exit;
}
if(strtolower($OUTPUTFORMAT) == "kml" && $ogrOutput == false){
	$urln = "../../pacotes/kmlmapserver/kmlservice.php?request=kmz&map=".$tema."&typename=".$tema;
	header("Location:".$urln);
	exit;
}
if(strtolower($OUTPUTFORMAT) == "shape-zip" && $ogrOutput == false){
	$retorno = downloadTema2("",$tema,$locaplic,$dir_tmp,$postgis_mapa);
	$zip = $retorno["shape-zip"];
	if(file_exists($zip)){
		ob_end_clean();
		header('Content-type: application/zip');
		header('Content-Disposition: attachment; filename='.basename($zip));
		readfile($zip);
	}
	exit;
}
//
//caso seja uma requisição WMS com format
//
$format = $_GET["format"];
if(strpos(strtolower($format),"kml") !== false){
	$urln = "../..pacotes/kmlmapserver/kmlservice.php?request=kml&map=".$tema."&typename=".$tema;
	header("Location:".$urln);
	exit;
}
if(strpos(strtolower($format),"kmz") !== false){
	$urln = "../../pacotes/kmlmapserver/kmlservice.php?request=kml&map=".$tema."&typename=".$tema;
	header("Location:".$urln);
	exit;
}
//
//usa o epsg correto ao inves do apelido inventado pelo Google
//
if($_GET["SRS"] == "EPSG:900913" || $_GET["srs"] == "EPSG:900913"){
	$_GET["SRS"] = "EPSG:3857";
	$_GET["srs"] = "EPSG:3857";
}
if(!isset($_GET["srs"]) && !isset($_GET["SRS"])){
	$_GET["srs"] = "EPSG:4326";
	$_GET["SRS"] = "EPSG:4326";
}

//
//trata geojson da mesma forma que json
//
if(strtolower($OUTPUTFORMAT) == "geojson"){
	$OUTPUTFORMAT = "json";
}
//
//para operar como o Geoserver, abre o openlayers
//
if(isset($format) && strtolower($format) == "application/openlayers"){
	$urln = dirname($_SERVER["PHP_SELF"])."/mashups/openlayers.php?layers=".$layers."&mapext=".$bbox."&botoes=pan,zoombox,zoomtot,identifica,legenda";
	//caso exista o openlayers3
	//if(file_exists(dirname(__FILE__)."/mashups/openlayers3.php")){
	//	$urln = dirname($_SERVER["PHP_SELF"])."/mashups/openlayers3.php?layers=".$layers."&mapext=".$bbox."&botoes=pan,zoombox,zoomtot,identifica,legenda";
	//}
	if(!headers_sent()){
		header("Location:".$urln);
	}
	else{
		echo "<meta http-equiv='refresh' content='0;url=$urln'>";
	}
}
//
//pega a versao do Mapserver
//
//error_reporting(0);
$versao = versao();
$versao = $versao["principal"];

$req = ms_newowsrequestobj();
$tipo = "";

$cache = false;

//
//inclui todos os parametros na requisicao e aproveita para verificar getcapabilities
//

$oMap = ms_newMapobj($tema);
$c = $oMap->numlayers;
$ls = array();
for ($i=0;$i < $c;++$i){
	$l = $oMap->getlayer($i);
	if($l->status == MS_DEFAULT){
		$ls[] = $l->name;
	}
}
$_GET["LAYERS"] = implode(",",$ls);

foreach ($_GET as $k=>$v){
	$req->setParameter(strtoupper($k), $v);
	if(strtolower($v) == "getcapabilities"){
		$tipo = "metadados";
		$cache = false;
	}
}
//
//cria uma lista de epsgs para o getcapabilities
//
$req->setParameter("srsName",$req->getValueByName("SRS"));
$listaepsg = $req->getValueByName("SRS")." EPSG:4618 EPSG:4291 EPSG:4326 EPSG:22521 EPSG:22522 EPSG:22523 EPSG:22524 EPSG:22525 EPSG:29101 EPSG:29119 EPSG:29120 EPSG:29121 EPSG:29122 EPSG:29177 EPSG:29178 EPSG:29179 EPSG:29180 EPSG:29181 EPSG:29182 EPSG:29183 EPSG:29184 EPSG:29185";
$VERSION = $_GET["VERSION"];
if(isset($_GET["version"]) && !isset($_GET["VERSION"])){
	$VERSION = $_GET["version"];
}
if(!isset($VERSION) || $VERSION == ""){
	$req->setParameter("VeRsIoN","1.1.1");
}

//
//nome do mapfile que ficara em cache
//

$agora = intval(time() / 1000);
//acrescenta ao nome a indicacao do tipo de TMS
if(isset($_GET["tms"])){
	$agora .= "tms";
}
if(isset($_GET["Z"]) && isset($_GET["X"])){
	$agora .= "google";
}
//
//se o outputformat for definido, evita o cahce de arquivo
//o mesmo se existir filtro para o layer
//
if(isset($_GET["OUTPUTFORMAT"]) || !empty($_GET["map_layer_".$tema."_filter"])){
	$_GET["DESLIGACACHE"] = "sim";
}
if(isset($_GET["DESLIGACACHE"]) && $_GET["DESLIGACACHE"] == "sim"){
	$agora = time();
	$cache = false;
}
//remove o bbox do calculo do nome do mapfile
$arrayget = $_GET;
$arrayget["bbox"] = "";
$arrayget["BBOX"] = "";
$arrayget["Z"] = "";
$arrayget["X"] = "";
$arrayget["Y"] = "";
$arrayget["tms"] = "";
$arrayget["TileMatrix"] = "";
$arrayget["TileCol"] = "";
$arrayget["TileRow"] = "";

$nomeMapfileTmp = $dir_tmp."/ogc_".md5(implode("",$arrayget))."_".$agora.".map";

//essa variavel e usada para definir se a imagem final gerada devera ser cortada ou nao
$cortePixels = 0;
if(empty($ogcwsmap)){
	$ogcwsmap = $_GET["ogcwsmap"];
}
$oMap = ms_newMapobj($_SESSION["map_file"]);
substituiConObj($oMap,$postgis_mapa);

	$proto = "http" . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "s" : "") . "://";
	$server = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
	$or = $urli3geo."/ogc.php";
	if((isset($tema)) && ($tema != "") && ($tipo=="metadados")){
		$or = $or."?tema=".$tema."&";
	}
	//
	//parametros no n&iacute;vel maior
	//
	$oMap->setmetadata("ows_onlineresource",$or);
	$oMap->setmetadata("wms_onlineresource",$or);
	$oMap->setmetadata("wms_title",$tituloInstituicao." - i3geo");
	$oMap->setmetadata("wfs_title",$tituloInstituicao." - i3geo");
	$oMap->setmetadata("wms_attribution_logourl_format","image/png");
	$oMap->setmetadata("wms_attribution_logourl_height","56");
	$oMap->setmetadata("wms_attribution_logourl_width","85");
	$oMap->setmetadata("wms_attribution_logourl_href",$urli3geo."/imagens/i3geo.png");
	$oMap->setmetadata("wms_attribution_onlineresource",$urli3geo);
	$oMap->setmetadata("wms_attribution_title",$tituloInstituicao);
	$oMap->setmetadata("ows_enable_request","*");
	//parametro mandatario
	if($oMap->getmetadata("wms_srs") == ""){
		$projecao = pegaProjecaoDefault("epsg");
		$oMap->setmetadata("wms_srs","EPSG:".$projecao);
	}
	$e = $oMap->extent;
	$extensaoMap = ($e->minx)." ".($e->miny)." ".($e->maxx)." ".($e->maxy);
	//gera o mapa
	if ($tema != ""){
		$listatema = explode(" ",str_replace(","," ",$tema));
		//para o caso do tema ser um arquivo mapfile existente em uma pasta qualquer
		//$temai3geo = true indica que o layer ser&aacute; buscado na pasta i3geo/temas
		$temai3geo = true;
		if(file_exists($_GET["tema"]) && !isset($_GET["id_medida_variavel"])){
			$nmap = ms_newMapobj($_GET["tema"]);
			$temai3geo = false;
			$nmap->setmetadata("ows_enable_request","*");
		}
		//inclui o layer com a grade de coordenadas
		if((isset($_GET["grade"])) && (strtolower($_GET["grade"]) == "sim") && file_exists($locaplic."/temas/gridg.map")){
			$listatema[] = "gridg";
		}
		foreach ($listatema as $tx){
			$extensao = ".map";
			if($temai3geo == true && file_exists($locaplic."/temas/".$tx.".php")){
				//$extensao = ".php";
			}
			if($temai3geo == true && file_exists($locaplic."/temas/".$tx.".gvp")){
				$extensao = ".gvp";
			}
			if($extensao == ".map"){
				//cria o mapfile com base no sistema de metadados estatisticos
				//verifica se o id_medida_variavel existe no mapfile e nao foi passado como um parametro
				if(!isset($_GET["id_medida_variavel"]) && $temai3geo == true){
					$nmap = ms_newMapobj($locaplic."/temas/".$tx.".map");
					$l = $nmap->getlayer(0);
					$teste = $l->getmetadata("METAESTAT_ID_MEDIDA_VARIAVEL");
					if($teste != "" && $l->data == ""){
						$_GET["id_medida_variavel"] = $teste;
					}
				}

				if($temai3geo == true){
					$nmap = ms_newMapobj($locaplic."/temas/".$tx.".map");
					$nmap->setmetadata("ows_enable_request","*");
				}
				if($temai3geo == false || empty($layers)){
					$ts = $nmap->getalllayernames();
					$nmap->setmetadata("ows_enable_request","*");
				}
				else{
					$ts = explode(",",str_replace(" ",",",$layers));
				}
				foreach ($ts as $t){
					$l = $nmap->getlayerbyname($t);
					if($l == ""){
						$l = $nmap->getlayer(0);
					}
					//verifica se ja existe layer com mesmo nome
					if($oMap->getlayerbyname($l->name) == ""){
						$permite = $l->getmetadata("permiteogc");
						if(strtolower($permite) != "nao"){
							//necess&aacute;rio pq o mapfile pode ter todos os layers como default
							if($temai3geo == false){
								$l->set("status",MS_OFF);
							}
							else{
								$l->set("status",MS_DEFAULT);
							}
							$l->setmetadata("ows_title",pegaNome($l));
							$l->setmetadata("ows_srs",$listaepsg);
							$l->set("group","");
							//timeout
							$tout = $l->getmetadata("wms_connectiontimeout");
							if($tout == ""){
								$l->setmetadata("wms_connectiontimeout",0);
							}
							//essa linha &eacute; necess&aacute;ria pq as vezes no mapfile n&atilde;o tem nenhum layer com o nome igual ao nome do mapfile
							if(count($ts)==1 && $temai3geo == true){
								$l->set("name",$tx);
							}
							$l->setmetadata("gml_include_items","all");
							$l->set("template","none.htm");
							$l->set("dump",MS_TRUE);
							$l->setmetadata("WMS_INCLUDE_ITEMS","all");
							$l->setmetadata("WFS_INCLUDE_ITEMS","all");

							if(file_exists($locaplic."/temas/miniaturas/".$t.".map.mini.png")){
								$mini = $proto.$server.dirname($_SERVER['PHP_SELF'])."/temas/miniaturas/".$t.".map.mini.png";
								$l->setmetadata("wms_attribution_logourl_format","image/png");
								$l->setmetadata("wms_attribution_logourl_height","50");
								$l->setmetadata("wms_attribution_logourl_width","50");
								$l->setmetadata("wms_attribution_logourl_href",$mini);
							}
							if($l->type == MS_LAYER_RASTER && $l->numclasses > 0){
								$c = $l->getclass(0);
								if($c->name == ""){
									$c->name = " ";
								}
							}
							//inclui extensao geografica
							$extensao = $l->getmetadata("EXTENSAO");
							if($extensao == ""){
								$extensao = $extensaoMap;
							}
							$l->setmetadata("wms_extent",$extensao);
							if (!empty($postgis_mapa)){
								if ($l->connectiontype == MS_POSTGIS){

									$lcon = $l->connection;
									if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa)))){
										//
										//o metadata CONEXAOORIGINAL guarda o valor original para posterior substitui&ccedil;&atilde;o
										//
										if(($lcon == " ") || ($lcon == "")){
											$l->set("connection",$postgis_mapa);
											$l->setmetadata("CONEXAOORIGINAL",$lcon);
										}
										else{
											$l->set("connection",$postgis_mapa[$lcon]);
											$l->setmetadata("CONEXAOORIGINAL",$lcon);
										}
									}
								}
							}

							autoClasses($l,$oMap);

							if($versao > 5){
								$pr = $l->getProcessing();
								if(!in_array("LABEL_NO_CLIP=True",$pr)){
									$l->setprocessing("LABEL_NO_CLIP=True");
								}
								if(!in_array("POLYLINE_NO_CLIP=True",$pr)){
									$l->setprocessing("POLYLINE_NO_CLIP=True");
								}
							}

							//
							//verifica se existem parametros de substituicao passados via url
							//
							$parametro = $_GET["map_layer_".$l->name."_filter"];
							//echo $parametro;exit;
							if(!empty($parametro)){
								$l->setfilter($parametro);
								$cache = false;
							}
							//muda o title se for vazio
							$nclass = $l->numclasses;
							for($i=0;$i<$nclass;$i++){
								$classe = $l->getclass($i);
								if($classe->title == ""){
									$classe->title = $classe->name;
								}
							}
							if($nclass == 1){
								$classe = $l->getclass(0);
								if($classe->name == ""){
									$classe->title = $l->getmetadata("tema");
									$classe->set("name",$l->getmetadata("tema"));
								}
							}
							$layerAdicionado = ms_newLayerObj($oMap, $l);
							corrigeLayerGrid($l,$layerAdicionado);
							corrigeLayerGrid ( $layerAdicionado,$oMap );
						}
						else{
							//a camada nao pode ser usada como servico WMS, entao e enviada uma mensagem
							$l->set("data","");
							$l->set("type",MS_POINT);
							$l->setmetadata("cache","nao");
							//apaga as classes
							$nclass = $l->numclasses;
							for($i=0;$i<$nclass;$i++){
								$classe = $l->getclass($i);
								$classe->set("status",MS_DELETE);
							}
							$l->updatefromstring('
									LAYER
									SIZEUNITS PIXELS
									TRANSFORM FALSE
									CLASS
									LABEL
									SIZE 10
									TYPE truetype
									FONT arial
									COLOR 255 0 0
									POSITION cc
									FORCE true
									END
									END
									FEATURE POINTS 100 100 END
									TEXT "OGC denied" END
									FEATURE POINTS 100 120 END
									TEXT "' . $l->name . '" END
									END
									');
							ms_newLayerObj($oMap, $l);
						}
					}
				}
			}

		}
	}
	else{
		$intervalo = "0,5000";
		$conta = 0;
		$int = explode(",",$intervalo);
		$codigosTema = array();
		if(empty($_GET["perfil"])){
			$perfil = "";
		}
		include("../../classesphp/classe_menutemas.php");
		$m = new Menutemas("",$perfil,$locaplic,$urli3geo);
		$menus = $m->pegaListaDeMenus();
		foreach ($menus as $menu){
			$grupos = $m->pegaListaDeGrupos($menu["idmenu"],$listasistemas="nao",$listasgrupos="sim");
			//temas na raiz do menu
			$lts = $menu["temas"];
			//var_dump($lts);exit;
			foreach($lts as $t){
				if(strtolower($t["ogc_tema"]) != "nao"){
					$codigosTema[$t["codigo_tema"]] = array("tema"=>$t["codigo_tema"],"fonte"=>$t["link_tema"]);
				}
			}
			foreach($grupos as $grupo){
				$lts = $grupo["temasgrupo"];
				//var_dump($lts);
				foreach($lts as $t){
					if(strtolower($t["ogc"]) != "nao"){
						$codigosTema[$t["tid"]] = array("tema"=>$t["tid"],"fonte"=>$t["link"]);
					}
				}
				if(strtolower($grupo["ogc"]) == "sim"){
					foreach($grupo["subgrupos"] as $sgrupo){
						if(strtolower($sgrupo["ogc"]) == "sim"){
							$lts = $m->pegaListaDeTemas($grupo["id_n1"],$sgrupo["id_n2"],$menu["idmenu"]);
							foreach($lts as $t){
								if(strtolower($t["ogc"]) == "sim"){
									$codigosTema[$t["tid"]] = array("tema"=>$t["tid"],"fonte"=>$t["link"]);
								}
							}
						}
					}
				}
			}
		}
		//echo "<pre>".var_dump($codigosTema);exit;
		foreach($codigosTema as $c){
			$codigoTema = $c["tema"];
			if(file_exists($locaplic."/temas/".$codigoTema.".map")){
				if (@ms_newMapobj($locaplic."/temas/".$codigoTema.".map")){
					$nmap = ms_newMapobj($locaplic."/temas/".$codigoTema.".map");
					$nmap->setmetadata("ows_enable_request","*");
					$ts = $nmap->getalllayernames();
					foreach ($ts as $t){
						if ($oMap->getlayerbyname($t) == ""){
							$l = $nmap->getlayerbyname($t);
							$extensao = $l->getmetadata("EXTENSAO");
							if($extensao == ""){
								$extensao = $extensaoMap;
							}
							$l->setmetadata("wms_extent",$extensao);
							$l->setmetadata("ows_title",pegaNome($l));
							$l->setmetadata("ows_srs",$listaepsg);
							$l->set("status",MS_OFF);
							$l->setmetadata("gml_include_items","all");
							$l->set("dump",MS_TRUE);
							$l->setmetadata("WMS_INCLUDE_ITEMS","all");
							$l->setmetadata("WFS_INCLUDE_ITEMS","all");
							if($l->getmetadata("ows_metadataurl_href") == ""){
								$l->setmetadata("ows_metadataurl_href",$c["fonte"]);
								$l->setmetadata("ows_metadataurl_type","TC211");
								$l->setmetadata("ows_metadataurl_format","text/html");
							}
							if(file_exists($locaplic."/temas/miniaturas/".$t.".map.mini.png")){
								$mini = $proto.$server.dirname($_SERVER['PHP_SELF'])."/temas/miniaturas/".$t.".map.mini.png";
								$l->setmetadata("wms_attribution_logourl_format","image/png");
								$l->setmetadata("wms_attribution_logourl_height","50");
								$l->setmetadata("wms_attribution_logourl_width","50");
								$l->setmetadata("wms_attribution_logourl_href",$mini);
							}
							//
							//numero de pixels que serao considerados para corte da imagem no caso de cache ativo e tema de pontos
							//
							if ($l->getmetadata("cortepixels") != ""){
								$cortePixels = $l->getmetadata("cortepixels");
							}
							cloneInlineSymbol($l,$nmap,$oMap);
							ms_newLayerObj($oMap, $l);
						}
					}
				}
				else{
					echo "Erro no arquivo ".$locaplic."/temas/".$codigoTema.".map <br>";
					$error = ms_GetErrorObj();
					while($error && $error->code != MS_NOERR){
						//printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
						//$error = $error->next();
					}
				}
			}
		}
	}
	//
	//a imagem do mapa recebera a legenda
	//
	if((isset($_GET["legenda"])) && (strtolower($_GET["legenda"]) == "sim")){
		processaLegenda();
	}
	//
	//a imagem do mapa recebera a barra de escala
	//
	if((isset($_GET["escala"])) && (strtolower($_GET["escala"]) == "sim")){
		processaEscala();
	}
	//
	//aplica os parametros sobre a grade de coordenadas
	//
	if((isset($_GET["grade"])) && (strtolower($_GET["grade"]) == "sim")){
		processaGrade();
	}
	$oMap->setSymbolSet($locaplic."/symbols/".basename($oMap->symbolsetfilename));
	$oMap->setFontSet($locaplic."/symbols/".basename($oMap->fontsetfilename));
	//verifica se existem layers com plugin definido e processa conforme o tipo de plugin
	processaPluginI3geo();
	//
	//caso seja download ou json ou csv
	//
	processaOutputformatMapfile();
if(ob_get_contents ()){
	ob_end_clean();
}
//
//verifica se a requisicao e do tipo TMS.
//
//
//calcula a extensao geografica com base no x,y,z em requisisoes TMS
//quando for do tipo tms $_GET["tms"] contem os parametros do tile
//essa rotina faz um exit ao final
//o cache tms so fucniona se houver apenas uma camada no mapa
//tms e usado basicamente por mashup ou openlayers
//
if(isset($_GET["tms"])){
	if(!isset($_GET["TileMatrix"])){
		$temp = explode("/",$_GET["tms"]);
		$z = $temp[2];
		$x = $temp[3];
		$y = str_replace(".png","",$temp[4]);
		$n = pow(2,$z+1);
		$lon1 = $x / $n * 360.0 - 180.0;
		$lon2 = ($x+1) / $n * 360.0 - 180.0;
		$n = pow(2,$z);
		$lat1 = $y / $n * 180.0 - 90.0;
		$lat2 = ($y+1) / $n * 180.0 - 90.0;
	}
	else{
		$top_left_minx = -180;
		$top_left_maxy = 90;

		$x_size = $res[$_GET["TileMatrix"] - 1] * 256;
		$y_size = $x_size;

		$lon1 = $top_left_minx + ($_GET["TileCol"] * $x_size);
		$lat1 = $top_left_maxy - ($_GET["TileRow"] * $y_size) - $y_size;
		$lon2 = $top_left_minx + ($_GET["TileCol"] * $x_size) + $x_size;
		$lat2 = $top_left_maxy - ($_GET["TileRow"] * $y_size);
	}

	//essa funcao termina o processo se a imagem existir
	if($cache == true){
		carregaCacheImagem($cachedir,$nomeMapfileTmp,$_GET["tms"]);
	}

	$layer0 = $oMap->getlayer(0);
	//
	//numero de pixels que serao considerados para corte da imagem no caso de cache ativo e tema de pontos
	//
	if ($layer0->getmetadata("cortepixels") != ""){
		$cortePixels = $layer0->getmetadata("cortepixels");
	}
	//se nao existir, salva a imagem
	//echo $lon1." ".$lat1." ".$lon2." ".$lat2;exit;
	$oMap->setsize(256,256);
	$oMap->setExtent($lon1,$lat1,$lon2,$lat2);

	$layer0->set("status",MS_DEFAULT);
	//
	//se o layer foi marcado para corte altera os parametros para ampliar o mapa
	//antes de gerar a imagem
	//
	if($cortePixels > 0){
		//$oMap->prepareImage();
		$escalaInicial = $oMap->scaledenom;
		$extensaoInicial = $oMap->extent;
		$wh = 256+($cortePixels*2);
		$oMap->setsize($wh,$wh);
		$ponto = new pointObj();
		$ponto->setxy(($wh/2),($wh/2));
		$oMap->zoomScale($escalaInicial, $ponto, $wh, $wh, $extensaoInicial);
	}

	$img = $oMap->draw();

	if($img->imagepath == ""){
		//tenta mais uma vez
		$img = $oMap->draw();
	}
	if($img->imagepath == ""){
		exit;
	}
	if($cache == true){
		salvaCacheImagem($cachedir,$nomeMapfileTmp,$_GET["tms"]);
	}
	renderNocacheTms();
}

//
//verifica se a chamada do servico e do tipo TILE no padrao do Google
//
if(isset($_GET["Z"]) && isset($_GET["X"])){
	$x = $_GET["X"];
	$y = $_GET["Y"];
	$z = $_GET["Z"];
	$proj4 = pegaProjecaoDefault("proj4");
	if(file_exists($tema)){
		$layer0 = $oMap->getlayer(0);
		$layer0->set("status",MS_DEFAULT);
		$layer0->setProjection($proj4);
	}
	else{
		//pode ter mais de um tema
		$lista = explode(" ",$tema);
		foreach($lista as $nomeLayer){
			$layer0 = $oMap->getlayerbyname($nomeLayer);
			$layer0->set("status",MS_DEFAULT);
			$layer0->setProjection($proj4);
		}
	}
	//
	//numero de pixels que serao considerados para corte da imagem no caso de cache ativo e tema de pontos
	//
	if ($layer0->getmetadata("cortepixels") != ""){
		$cortePixels = $layer0->getmetadata("cortepixels");
	}

	if($cache == true){
		carregaCacheImagem($cachedir,$nomeMapfileTmp,"/googlemaps/$layer0->name/$z/$x/$y");
	}
	$n = pow(2,$z);
	$lon1 = $x / $n * 360.0 - 180.0;
	$lat2 = rad2deg(atan(sinh(pi() * (1 - 2 * $y / $n))));
	$x++;
	$y++;
	$lon2 = $x / $n * 360.0 - 180.0;
	$lat1 = rad2deg(atan(sinh(pi() * (1 - 2 * $y / $n))));
	$x--;
	$y--;

	$projInObj = ms_newprojectionobj("proj=latlong,a=6378137,b=6378137");
	$projOutObj = ms_newprojectionobj("proj=merc,a=6378137,b=6378137,lat_ts=0.0,lon_0=0.0,x_0=0.0,y_0=0,k=1.0,units=m");

	$poPoint1 = ms_newpointobj();
	$poPoint1->setXY($lon1, $lat1);
	$poPoint1->project($projInObj, $projOutObj);
	$poPoint2 = ms_newpointobj();
	$poPoint2->setXY($lon2, $lat2);
	$poPoint2->project($projInObj, $projOutObj);
	$oMap->setsize(256,256);
	$oMap->setExtent($poPoint1->x,$poPoint1->y,$poPoint2->x,$poPoint2->y);

	$oMap->setProjection("proj=merc,a=6378137,b=6378137,lat_ts=0.0,lon_0=0.0,x_0=0.0,y_0=0,k=1.0,units=m");

	//
	//se o layer foi marcado para corte altera os parametros para ampliar o mapa
	//antes de gerar a imagem
	//
	if($cortePixels > 0){
		//$oMap->prepareImage();
		$escalaInicial = $oMap->scaledenom;
		$extensaoInicial = $oMap->extent;
		$wh = 256+($cortePixels*2);
		$oMap->setsize($wh,$wh);
		$ponto = new pointObj();
		$ponto->setxy(($wh/2),($wh/2));
		$oMap->zoomScale($escalaInicial, $ponto, $wh, $wh, $extensaoInicial);
	}
	$img = $oMap->draw();
	if($img->imagepath == ""){
		exit;
	}
	if($cache == true){
		salvaCacheImagem($cachedir,$nomeMapfileTmp,"/googlemaps/$layer0->name/$z/$x/$y");
	}
	renderNocacheTms();
}
if(strtolower($req->getValueByName("REQUEST")) == "getlegendgraphic"){
	$legenda = $oMap->legend;
	$legenda->set("status",MS_ON);
	$numlayers = $oMap->numlayers;
	for ($i=0;$i < $numlayers;$i++){
		$l = $oMap->getlayer($i);
		$l->set("status",MS_DEFAULT);
		if($req->getValueByName("LAYER") == ""){
			$req->setParameter("LAYER",$l->name);
		}

		//muda o title se for vazio
		/*
		$nclass = $l->numclasses;
		for($i=0;$i<$nclass;$i++){
			$classe = $l->getclass($i);
			if($classe->title == ""){
				$classe->title = $classe->name;
			}
		}
		if($nclass == 1){
			$classe = $l->getclass(0);
			if($classe->name == ""){
				$classe->title = $l->getmetadata("tema");
				$classe->set("name",$l->getmetadata("tema"));
			}
		}
		*/
		if($req->getValueByName("FORMAT") == ""){
			$req->setParameter("FORMAT","image/png");
		}
		$l->set("minscaledenom",0);
		$l->set("maxscaledenom",0);
		if($req->getValueByName("FORMAT") == "text/html"){
			//remove offset de simbolos pontuais
			$nclass = $l->numclasses;
			for($cc = 0; $cc < $nclass; $cc++){
				$classe  = $l->getclass($cc);
				if($classe->numstyles > 0){
					$estilo = $classe->getstyle(0);
					if($estilo->symbolname != "" && file_exists($estilo->symbolname)){
						$estilo->set("offsetx",0);
						$estilo->set("offsety",0);
					}
				}
			}
		}
	}
	if($req->getValueByName("FORMAT") == "text/html"){
		//define qual template utilizar
		if(empty($_GET["templateLegenda"])){
			$legenda->set("template",$locaplic."/aplicmap/legendaOgc.html");
		} else {
			$_GET["templateLegenda"] = str_replace(".htm","",$_GET["templateLegenda"]);
			$_GET["templateLegenda"] = str_replace(".","",$_GET["templateLegenda"]);
			if(file_exists($locaplic."/".$_GET["templateLegenda"].".htm")){
				$legenda->set("template",$locaplic."/".$_GET["templateLegenda"].".htm");
			} else {
				$legenda->set("template",$locaplic."/aplicmap/legendaOgc.html");
			}
		}
		$tmparray["my_tag"] = "value_of_my_tag";
		if($leg = @$oMap->processlegendtemplate($tmparray)){
			if (function_exists("mb_convert_encoding")){
				$leg = mb_convert_encoding($leg,"UTF-8","ISO-8859-1");
			}
			echo $leg;
			exit;
		}
	}
}

if(strtolower($req->getValueByName("REQUEST")) == "getfeature"){
	$l = $oMap->getlayer(0);
	if($req->getValueByName("TYPENAME") == "" || $req->getValueByName("TYPENAME") == "undefined"){
		$req->setParameter("TYPENAME",$l->name);
	}
	if($l->getProjection() == "" ){
		$l->setProjection(pegaProjecaoDefault("proj4"));
	}
	if(strtolower($req->getValueByName("SRS")) == "epsg:900913"){
		$req->setParameter("SRS","EPSG:3857");
	}
}
if(strtolower($req->getValueByName("REQUEST")) == "getfeatureinfo"){
	$l = $oMap->getlayer(0);
	$req->setParameter("LAYERS",$l->name);
	$req->setParameter("QUERY_LAYERS",$l->name);
	if(strtolower($req->getValueByName("SRS")) == "epsg:900913"){
		$req->setParameter("SRS","EPSG:3857");
		$_GET["SRS"] = "EPSG:3857";
	}
}
ms_ioinstallstdouttobuffer();
//
//verifica parametro outputformat e ajusta a requisicao
//
if(strtolower($req->getValueByName("REQUEST")) == "getmap" && $req->getValueByName("format") == ""){
	$req->setParameter("format","image/png");
}
if(strtolower($req->getValueByName("REQUEST")) == "getfeatureinfo" && $_GET["info_format"] == "text/xml"){
	$req->setParameter("info_format","application/vnd.ogc.gml");
}
//json conforme cesium
if(strtolower($req->getValueByName("REQUEST")) == "getfeatureinfo" && $_GET["info_format"] == "application/json"){
	getfeatureinfoJson();
	exit;
}
if(strtolower($request) == "getcapabilities"){
	//header('Content-Disposition: attachment; filename=getcapabilities.xml');
}
elseif(!isset($OUTPUTFORMAT)){
	//$contenttype = ms_iostripstdoutbuffercontenttype();
	header("Content-type: $contenttype");
}
//$ogrOutput vem de ms_configura.php

//precisa limpar o cabecalho
if(strtolower($OUTPUTFORMAT) == "geojson" || strtolower($OUTPUTFORMAT) == "json"){
	$arq = $dir_tmp."/".$tema.".json";
	if(isset($ogrOutput) && $ogrOutput == false){
		exportaGeojson();
		exit;
	}
	$oMap->owsdispatch($req);

	$contenttype = ms_iostripstdoutbuffercontenttype();
	ms_iostripstdoutbuffercontentheaders();
	//grava em disco
	$contents = ms_iogetstdoutbufferstring();
	file_put_contents($arq,$contents);
	//envia para download

	header("Content-type: application/json; subtype=geojson");

	ms_iogetStdoutBufferBytes();
	ms_ioresethandlers();

	exit;
}
if(strtolower($OUTPUTFORMAT) == "kml"){
	$oMap->owsdispatch($req);
	$contenttype = ms_iostripstdoutbuffercontenttype();
	ms_iostripstdoutbuffercontentheaders();
	//grava em disco
	$arq = $dir_tmp."/".$tema.".kml";
	$contents = ms_iogetstdoutbufferstring();
	file_put_contents($arq,$contents);
	//envia para download
	header('Content-Disposition: attachment; filename='.$tema.'.kml');
	ms_iogetStdoutBufferBytes();
	ms_ioresethandlers();
	exit;
}
//kmz nao funciona quando fornecido diretamente pelo mapserver
if(strtolower($OUTPUTFORMAT) == "kmz"){
	$oMap->owsdispatch($req);
	$contenttype = ms_iostripstdoutbuffercontenttype();
	ms_iostripstdoutbuffercontentheaders();
	//grava em disco
	$arq = $dir_tmp."/".$tema.".kmz";
	$contents = ms_iogetstdoutbufferstring();
	file_put_contents($arq,$contents);
	//envia para download
	header('Content-Disposition: attachment; filename='.$tema.'.kmz');
	ms_iogetStdoutBufferBytes();
	ms_ioresethandlers();
	exit;
}
if(strtolower($OUTPUTFORMAT) == "shape-zip"){
	$oMap->owsdispatch($req);
	$contenttype = ms_iostripstdoutbuffercontenttype();
	//grava em disco
	$arq = $dir_tmp."/".$tema."_shapefile.zip";
	$contents = ms_iogetstdoutbufferstring();
	file_put_contents($arq,$contents);
	//envia para download
	header('Content-Disposition: attachment; filename='.$tema.'_shapefile.zip');
	ms_iogetStdoutBufferBytes();
	ms_ioresethandlers();
	exit;
}
if(strtolower($OUTPUTFORMAT) == "csv"){
	$arq = $dir_tmp."/".$tema.$ows_geomtype.".csv";
	$fileName = $tema.$ows_geomtype.'.csv';
	if(isset($ogrOutput) && $ogrOutput == false){
		exportaCsv();
		exit;
	}
	//
	$oMap->owsdispatch($req);
	$contenttype = ms_iostripstdoutbuffercontenttype();
	ms_iostripstdoutbuffercontentheaders();
	//grava em disco
	$contents = ms_iogetstdoutbufferstring();
	file_put_contents($arq,$contents);
	//envia para download
	header('Content-Disposition: attachment; filename='.$fileName);
	header("Content-type: text/csv");
	ms_iogetStdoutBufferBytes();
	ms_ioresethandlers();
	exit;
}
//echo $req->getValue(1);exit;
ob_clean();
$oMap->owsdispatch($req);
$contenttype = ms_iostripstdoutbuffercontenttype();
$buffer = ms_iogetStdoutBufferBytes();

ms_ioresethandlers();
//
//fun&ccedil;&otilde;es
//
function ogc_imprimeAjuda(){
	echo "<pre><b>Construtor de web services do I3Geo.</b><br><br>";
	echo "Esse programa usa os arquivos mapfiles existentes em <br>";
	echo "i3geo/temas para gerar web services OGC.<br>";
	echo "Para escolher um tema, utilize:<br>";
	echo "ogc.php?lista=temas - para listar os temas dispon&iacute;veis<br>";
	echo "Para usar esse web service voce pode usar o parametro &tema=,<br>";
	echo "ou seja,http://[host]/i3geo/ogc.php?tema=[codigo do tema]<br>";
	echo "no lugar do codigo pode ser especificado um arquivo mapfile qualquer. ";
	echo "Nesse caso, deve ser digitado o caminho completo no servidor<br><br>";
	echo "Utilize o sistema de administracao do i3Geo para configurar quais os temas da pasta i3geo/temas podem ser utilizados.<br><br>";
	echo "Utilize o parametro restauramapa para indicar o ID de um mapa salvo no banco <br>";
	echo "de dados de administracao para utiliza-lo como um WMS";
}
function ogc_imprimeListaDeTemas(){
}
function ogc_imprimeListaDeTemasWfs(){
}
function carregaCacheImagem($cachedir,$map,$tms){
	global $dir_tmp;
	if($cachedir == ""){
		$nome = $dir_tmp."/cache".$tms;
	}
	else{
		$nome = $cachedir.$tms;
	}
	$nome = str_replace(".png","",$nome).".png";
	if(file_exists($nome)){
		ob_clean();
		//header('Content-Length: '.filesize($nome));
		header('Cache: '.$tms);
		header('Content-Type: image/png');
		//header('Cache-Control: max-age=3600, must-revalidate');
		//header('Expires: ' . gmdate('D, d M Y H:i:s', time()+24*60*60) . ' GMT');
		//header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($nome)).' GMT', true, 200);
		//$etag = md5_file($nome);
		//header('Etag: '.$etag);
		readfile($nome);
		exit;
	}
}
function salvaCacheImagem($cachedir,$map,$tms){
	global $img,$dir_tmp,$cortePixels;
	//por seguranca
	if($cachedir == ""){
		$nome = $dir_tmp."/cache".$tms;
	}
	else{
		$nome = $cachedir.$tms;
	}
	$nome = str_replace(".png","",$nome).".png";
	if(!file_exists(dirname($nome))){
		@mkdir(dirname($nome),0744,true);
		chmod(dirname($nome),0744);
	}
	$img->saveImage($nome);
	//tenta mais uma vez
	if(!file_exists($nome)){
		$img->saveImage($nome);
	}
	//
	//corta a imagem gerada para voltar ao tamanho normal
	//
	if($cortePixels > 0){
		$img = imagecreatefrompng($nome);
		$imgc = imagecreate(256,256);

		imagesavealpha($imgc, true);
		// Fill the image with transparent color
		$color = imagecolorallocatealpha($imgc,0x00,0x00,0x00,127);
		imagefill($imgc, 0, 0, $color);

		imagecopy($imgc, $img, 0 , 0 , $cortePixels , $cortePixels , 256, 256);
		imagepng($imgc,$nome);
	}
	chmod($nome,0744);
	//header('Content-Length: '.filesize($nome));
	ob_clean();
	header('Content-Type: image/png');
	//header('Cache-Control: max-age=3600, must-revalidate');
	//header('Expires: ' . gmdate('D, d M Y H:i:s', time()+24*60*60) . ' GMT');
	//header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($nome)).' GMT', true, 200);
	readfile($nome);
	exit;
}
function texto2iso($texto){
	if (function_exists("mb_convert_encoding")){
		if (mb_detect_encoding($texto,"UTF-8",true)){
			$texto = mb_convert_encoding($texto,"ISO-8859-1","UTF-8");
		}
	}
	return $texto;
}
function nomeRand($n=10)
{
	$nomes = "";
	$a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$max = 51;
	for($i=0; $i < $n; ++$i)
	{
		$nomes .= $a{mt_rand(0, $max)};
	}
	return $nomes;
}
function renderNocacheTms(){
	global $img,$i3georendermode,$dir_tmp,$cortePixels;
	if($i3georendermode == 1 && $cortePixels == 0){
		ob_clean();
		header('Content-Type: image/png');
		$img->saveImage();
		exit;
	}
	if($i3georendermode == 1 && $cortePixels > 0){
		$i3georendermode = 0;
	}
	$nomer = $dir_tmp."/temp".nomeRand().".png";
	$img->saveImage($nomer);
	//
	//corta a imagem gerada para voltar ao tamanho normal
	//
	if($cortePixels > 0){
		$img = imagecreatefrompng($nomer);
		$imgc = imagecreate(256,256);
		imagecopy( $imgc, $img, 0 , 0 , $cortePixels , $cortePixels , 256, 256 );
		imagepng($imgc,$nomer);
	}
	if($i3georendermode == 0 || !isset($i3georendermode)){
		ob_clean();
		//header('Content-Length: '.filesize($nomer));
		header('Content-Type: image/png');
		//header('Cache-Control: max-age=3600, must-revalidate');
		//header('Expires: ' . gmdate('D, d M Y H:i:s', time()+24*60*60) . ' GMT');
		//header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($nomer)).' GMT', true, 200);
		readfile($nomer);
		exit;
	}
	if($i3georendermode == 2){
		ob_clean();
		//header('Cache-Control: public, max-age=22222222');
		//header('Expires: ' . gmdate('D, d M Y H:i:s', time()+48*60*60) . ' GMT');
		header("X-Sendfile: $nomer");
		header("Content-type: image/png");
		exit;
	}
}
function getfeatureinfoJson(){
	global $req, $oMap;
	$req->setParameter("info_format","application/vnd.ogc.gml");
	$oMap->owsdispatch($req);
	ms_iostripstdoutbuffercontentheaders();
	ob_clean();
	$r = ms_iogetstdoutbufferstring();
	//$r = converteenc($r);
	$nome = $oMap->getlayer(0)->name;
	$xml = simplexml_load_string($r);

	$json = json_encode($xml);
	$r = json_decode($json,TRUE);
	$propriedades = $r[$nome."_layer"];
	$propriedades = $propriedades[$nome."_feature"];
	$propriedades = converteenc(json_encode($propriedades));
	$propriedades = json_decode($propriedades);
	$n = array();
	$n[] = array (
			"type" => "FeatureCollection",
			"features" => array(
					array(
							"type"=>"Feature",
							"id" => "",
							"geometry" => array(),
							"properties" => array(
									$propriedades
							),
							"geometry_name" => ""
					)
			)
	);
	header("Content-type: application/json");
	$json = json_encode($n[0]);
	//verifica a substituicao de alias
	$itens = $oMap->getlayer(0)->getmetadata("ITENS"); // itens
	$itensdesc = $oMap->getlayer(0)->getmetadata("ITENSDESC"); // descri&ccedil;&atilde;o dos itens
	$itens = explode(",",$itens);
	$itensdesc = explode(",",converteenc($itensdesc));
	$n = count($itens);
	for($i = 0; $i < $n; $i++){
		$json = str_ireplace($itens[$i],$itensdesc[$i],$json);
	}
	echo $json;
}
function processaOutputformatMapfile(){
	global $OUTPUTFORMAT, $oMap, $tema, $ows_geomtype;
	if(strtolower($OUTPUTFORMAT) == "kml"){
		$l = $oMap->getlayer(0);
		$n = $l->name;
		$oMap->selectOutputFormat("kml");
		$oMap->outputformat->setOption("STORAGE", "filesystem");
		$oMap->outputformat->setOption("FILENAME", $tema.".kml");
		$l->setmetadata("wfs_getfeature_formatlist","kml");
	}
	if(strtolower($OUTPUTFORMAT) == "shape-zip"){
		$l = $oMap->getlayer(0);
		$n = $l->name;
		$oMap->selectOutputFormat("shape-zip");
		$oMap->outputformat->setOption("STORAGE", "filesystem");
		$oMap->outputformat->setOption("FORM", "zip");
		$oMap->outputformat->setOption("FILENAME", $tema."_shapefile.zip");
		$l->setmetadata("wfs_getfeature_formatlist","shape-zip");
	}
	if(strtolower($OUTPUTFORMAT) == "csv"){
		$l = $oMap->getlayer(0);
		$n = $l->name."-csv";
		$oMap->selectOutputFormat("csv");
		$oMap->outputformat->setOption("STORAGE", "filesystem");
		$oMap->outputformat->setOption("FILENAME", $tema.$ows_geomtype.".csv");
		$oMap->outputformat->setOption("FORM", "simple");
		if(isset($ows_geomtype) && $ows_geomtype != ""){
			$oMap->outputformat->setOption("LCO:GEOMETRY", $ows_geomtype);
		}
		$l->setmetadata("wfs_getfeature_formatlist","csv");
	}
	if(strtolower($OUTPUTFORMAT) == "geojson" || strtolower($OUTPUTFORMAT) == "json"){
		$l = $oMap->getlayer(0);
		$oMap->selectOutputFormat("geojson");
		$l->setmetadata("wfs_getfeature_formatlist","geojson");
	}
}
function carregaCacheArquivo(){
	global $dir_tmp, $tema, $OUTPUTFORMAT, $ows_geomtype;
	if(strtolower($OUTPUTFORMAT) == "shape-zip"){
		$arq = $dir_tmp."/".$tema."_shapefile.zip";
		if(file_exists($arq)){
			header('Content-Disposition: attachment; filename='.$tema.'_shapefile.zip');
			readfile($arq);
			exit;
		}
	}
	if(strtolower($OUTPUTFORMAT) == "csv"){
		$arq = $dir_tmp."/".$tema.$ows_geomtype.".csv";
		if(file_exists($arq)){
			header('Content-Disposition: attachment; filename='.$tema.$ows_geomtype.'.csv');
			header("Content-type: text/csv");
			readfile($arq);
			exit;
		}
	}
	if(strtolower($OUTPUTFORMAT) == "kml"){
		$arq = $dir_tmp."/".$tema.".kml";
		if(file_exists($arq)){
			header('Content-Disposition: attachment; filename='.$tema.'.kml');
			header("Content-type: application/vnd.google-earth.kml+xml");
			readfile($arq);
			exit;
		}
	}
	if(strtolower($OUTPUTFORMAT) == "kmz"){
		$arq = $dir_tmp."/".$tema.".kmz";
		if(file_exists($arq)){
			header('Content-Disposition: attachment; filename='.$tema.'.kmz');
			header("Content-type: application/vnd.google-earth.kmz");
			readfile($arq);
			exit;
		}
	}
	if(strtolower($OUTPUTFORMAT) == "geojson" || strtolower($OUTPUTFORMAT) == "json"){
		$arq = $dir_tmp."/".$tema.".json";
		if(file_exists($arq)){
			header("Content-type: application/json; subtype=geojson");
			readfile($arq);
			exit;
		}
	}
}
function converteenc($texto){
	if (!mb_detect_encoding($texto,"UTF-8",true)){
		$texto = mb_convert_encoding($texto,"UTF-8","ISO-8859-1");
	}
	return $texto;
}
function processaPluginI3geo(){
	global $oMap, $locaplic;
	$numlayers = $oMap->numlayers;
	for ($i=0;$i < $numlayers;$i++){
		$l = $oMap->getlayer($i);
		$c = $l->getmetadata("PLUGINI3GEO");
		if($c != ""){
			$cs = json_decode($c,true);
			if($cs["plugin"] == "parametrossql"){
				$data = $l->data;
				$cs = $cs["parametros"];
				$chaves = array();
				foreach($cs as $c){
					$chaves[] = $c["chave"];
				}
				$chaves = implode(",",$chaves);
				$filtro = $l->getFilterString();
				$chaves = str_ireplace(array(" and ", " or ", "select","from","where","update","delete","insert","--"),"",$chaves);
				$chaves = explode(",",$chaves);
				$n = count($chaves);
				//a variavel $plugin vem da URL e contem os valores
				//que devem ser substituidos
				//se $plugin for vazio, usa o primeiro valor definido na configuracao do plugin
				//A ordem dos valores deve ser exatamente a ordem das chaves
				if(empty($plugin)){
					$plugin = array();
					foreach($cs as $c){
						if($c["chave"] != ""){
							//valores definidos no plugin como uma string
							if($c["valores"] != ""){
								$temp = explode(",",$c["valores"]);
								$plugin[] = $temp[0];
							}
							elseif ($c["prog"] != ""){
								$plugin[] = execProg($c["prog"]);
							}
						}
					}
					$plugin = implode(",",$plugin);
				}
				$l->setmetadata("TEMA",$l->getmetadata("TEMA")." - ".$plugin);
				$valores = str_ireplace(array(" and ", " or ", "select","from","where","update","delete","insert","--"),"",$plugin);
				$valores = explode(",",strip_tags($valores));
				for($i = 0; $i < $n; $i++){
					if($chaves[$i] != ""){
						$v = (int) $valores[$i];
						$data = str_replace($chaves[$i],$v,$data);
						if($filtro != ""){
							$filtro = str_replace($chaves[$i],$v,$filtro);
						}
					}
				}
				if($filtro != ""){
					$l->setfilter($filtro);
				}
				$l->set("data",$data);
			}
		}
	}
}
function processaEscala(){
	global $oMap, $locaplic, $req;
	$eb = $oMap->scalebar;
	$eb->set("status",MS_EMBED);
	if(!empty($_GET["escala_width"])){
		$eb->set("width",$_GET["escala_width"]);
	}
	if(!empty($_GET["escala_height"])){
		$eb->set("height",$_GET["escala_height"]);
	}
	//0 ou 1
	if(!empty($_GET["escala_style"])){
		$eb->set("style",$_GET["escala_style"]);
	}
	if(!empty($_GET["escala_intervals"])){
		$eb->set("intervals",$_GET["escala_intervals"]);
	}
	//MS_INCHES, MS_FEET, MS_MILES, MS_METERS, MS_KILOMETERS, MS_DD, MS_PIXELS, MS_NAUTICALMILES
	if(!empty($_GET["escala_units"])){
		$eb->set("units",$_GET["escala_units"]);
	}
	if(!empty($_GET["escala_color"])){
		$_GET["escala_color"] = str_replace(","," ",$_GET["escala_color"]);
		$ncor = explode(" ",$_GET["escala_color"]);
		$cor = $eb->color;
		$cor->setRGB($ncor[0],$ncor[1],$ncor[2]);
	}
	if(!empty($_GET["escala_backgroundcolor"])){
		$_GET["escala_backgroundcolor"] = str_replace(","," ",$_GET["escala_backgroundcolor"]);
		$ncor = explode(" ",$_GET["escala_backgroundcolor"]);
		$cor = $eb->backgroundcolor;
		$cor->setRGB($ncor[0],$ncor[1],$ncor[2]);
	}
	if(!empty($_GET["escala_outlinecolor"])){
		$_GET["escala_outlinecolor"] = str_replace(","," ",$_GET["escala_outlinecolor"]);
		$ncor = explode(" ",$_GET["escala_outlinecolor"]);
		$cor = $eb->outlinecolor;
		$cor->setRGB($ncor[0],$ncor[1],$ncor[2]);
	}
	//ul|uc|ur|ll|lc|lr
	if(!empty($_GET["escala_position"])){
		if($_GET["escala_position"] == "ul") $eb->set("position",MS_UL);
		if($_GET["escala_position"] == "uc") $eb->set("position",MS_UC);
		if($_GET["escala_position"] == "ur") $eb->set("position",MS_UR);
		if($_GET["escala_position"] == "ll") $eb->set("position",MS_LL);
		if($_GET["escala_position"] == "lc") $eb->set("position",MS_LC);
		if($_GET["escala_position"] == "lr") $eb->set("position",MS_LR);
	}
	//fonte e size so com truetype
	if (!empty($_GET["escala_font"])){
		$label = $eb->label;
		$label->updatefromstring("LABEL TYPE TRUETYPE END");
		$label->set("font",$_GET["escala_font"]);
	}
	if (!empty($_GET["escala_size"])){
		$label = $eb->label;
		$label->updatefromstring("LABEL TYPE TRUETYPE END");
		if(empty($_GET["escala_size"])){
			$label->set("font","arial");
		}
		$label->set("size",$_GET["escala_size"]);
	}
}
function processaLegenda(){
	global $oMap, $locaplic, $req;
	$leg = $oMap->legend;
	$leg->set("status",MS_EMBED);
	if(!empty($_GET["legenda_imagecolor"])){
		$_GET["legenda_imagecolor"] = str_replace(","," ",$_GET["legenda_imagecolor"]);
		$ncor = explode(" ",$_GET["legenda_imagecolor"]);
		$cor = $leg->imagecolor;
		$cor->setRGB($ncor[0],$ncor[1],$ncor[2]);
		$req->setParameter("TRANSPARENT",0);
	}
	if(!empty($_GET["legenda_keysizex"])){
		$leg->set("keysizex",$_GET["legenda_keysizex"]);
	}
	if(!empty($_GET["legenda_keysizey"])){
		$leg->set("keysizey",$_GET["legenda_keysizey"]);
	}
	if(!empty($_GET["legenda_keyspacingx"])){
		$leg->set("keyspacingx",$_GET["legenda_keyspacingx"]);
	}
	//ul|uc|ur|ll|lc|lr
	if(!empty($_GET["legenda_position"])){
		if($_GET["legenda_position"] == "ul") $leg->set("position",MS_UL);
		if($_GET["legenda_position"] == "uc") $leg->set("position",MS_UC);
		if($_GET["legenda_position"] == "ur") $leg->set("position",MS_UR);
		if($_GET["legenda_position"] == "ll") $leg->set("position",MS_LL);
		if($_GET["legenda_position"] == "lc") $leg->set("position",MS_LC);
		if($_GET["legenda_position"] == "lr") $leg->set("position",MS_LR);
	}
	if(!empty($_GET["legenda_keyspacingy"])){
		$leg->set("keyspacingy",$_GET["legenda_keyspacingy"]);
	}
	if(!empty($_GET["legenda_outlinecolor"])){
		$_GET["legenda_outlinecolor"] = str_replace(","," ",$_GET["legenda_outlinecolor"]);
		$ncor = explode(" ",$_GET["legenda_outlinecolor"]);
		$cor = $leg->outlinecolor;
		$cor->setRGB($ncor[0],$ncor[1],$ncor[2]);
	}
	//fonte e size so com truetype
	if (!empty($_GET["legenda_font"])){
		$label = $leg->label;
		$label->updatefromstring("LABEL TYPE TRUETYPE END");
		$label->set("font",$_GET["legenda_font"]);
	}
	if (!empty($_GET["legenda_size"])){
		$label = $leg->label;
		$label->updatefromstring("LABEL TYPE TRUETYPE END");
		if(empty($_GET["legenda_font"])){
			$label->set("font","arial");
		}
		$label->set("size",$_GET["legenda_size"]);
	}
}
function processaGrade(){
	global $oMap;
	//veja o mapfile gridg.map em i3geo/temas
	$layer = $oMap->getlayerbyname("gridg");
	if($layer != ""){
		if(!empty($_GET["grade_labelformat"])){
			$layer->grid->set("labelformat", $_GET["grade_labelformat"]);
		}
		if(!empty($_GET["grade_interval"])){
			$layer->grid->set("mininterval", $_GET["grade_interval"]);
			$layer->grid->set("maxinterval", $_GET["grade_interval"]);
		}
		$classe = $layer->getclass(0);
		$estilo = $classe->getstyle(0);
		$label = $classe->getLabel(0);
		if(!empty($_GET["grade_position"])){
			//("MS_AUTO"=>MS_AUTO,"MS_UL"=>MS_UL,"MS_LR"=>MS_LR,"MS_UR"=>MS_UR,"MS_LL"=>MS_LL,
			//"MS_CR"=>MS_CR,"MS_CL"=>MS_CL,"MS_UC"=>MS_UC,"MS_LC"=>MS_LC,"MS_CC"=>MS_CC);
			if($_GET["grade_position"] == "auto") $label->set("position",MS_AUTO);
			if($_GET["grade_position"] == "cc") $label->set("position",MS_CC);
			if($_GET["grade_position"] == "ul") $label->set("position",MS_UL);
			if($_GET["grade_position"] == "uc") $label->set("position",MS_UC);
			if($_GET["grade_position"] == "ur") $label->set("position",MS_UR);
			if($_GET["grade_position"] == "ll") $label->set("position",MS_LL);
			if($_GET["grade_position"] == "lc") $label->set("position",MS_LC);
			if($_GET["grade_position"] == "lr") $label->set("position",MS_LR);
		}
		//fonte e size so com truetype
		if (!empty($_GET["grade_font"])){
			$label->updatefromstring("LABEL TYPE TRUETYPE END");
			$label->set("font",$_GET["grade_font"]);
		}
		if (!empty($_GET["grade_size"])){
			$label->updatefromstring("LABEL TYPE TRUETYPE END");
			if(empty($_GET["grade_font"])){
				$label->set("font","arial");
			}
			$label->set("size",$_GET["grade_size"]);
		}
		if(!empty($_GET["grade_color"])){
			$_GET["grade_color"] = str_replace(","," ",$_GET["grade_color"]);
			$ncor = explode(" ",$_GET["grade_color"]);
			$cor = $estilo->color;
			$cor->setRGB($ncor[0],$ncor[1],$ncor[2]);
		}
	}
	else {
		echo "Layer gridg nao encontrado"; exit;
	}
}
//utilizada para obter os dados default quando se utiliza o plugin parametrossql
function execProg($prog){
	//$retorno variavel deve ser retornada pelo programa $prog
	//veja como exemplo i3geo/aplicmap/daods/listaano.php
	global $urli3geo;
	$handle = curl_init();
	curl_setopt( $handle, CURLOPT_URL, $urli3geo."/".$prog);
	curl_setopt( $handle, CURLOPT_HEADER, false );
	curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
	$str = curl_exec( $handle );
	curl_close( $handle );
	$retorno = json_decode($str,true);
	return $retorno[0]["v"];
}
?>
