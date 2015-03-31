<?php
$cache = true;
require_once(dirname(__FILE__)."/../../classesphp/carrega_ext.php");
include(dirname(__FILE__)."/../../ms_configura.php");
include(dirname(__FILE__)."/../../classesphp/pega_variaveis.php");
include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
$temas = $tema;
//
//pega os endere&ccedil;os para compor a url de chamada do gerador de web services
//ogc.php
//
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$protocolo = $protocolo[0];
$protocolo1 = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'];
$protocolo = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
$urli3geo = str_replace("/ogc.php","",$protocolo.$_SERVER["PHP_SELF"]);
//
//cria o web service
//
error_reporting(0);
$versao = versao();
$versao = $versao["principal"];
if($_GET["SRS"] == "EPSG:900913"){
	$_GET["SRS"] = "EPSG:3857";
}
$req = ms_newowsrequestobj();
$tipo = "";
$_GET = array_merge($_GET,$_POST);
if(isset($_GET["sld"]) || isset($_GET["filter"])){
	$cache = false;
}
if(!isset($_GET["srs"]) && !isset($_GET["SRS"])){
	$_GET["srs"] = "EPSG:4326";
}
foreach ($_GET as $k=>$v){
	$req->setParameter(strtoupper($k), $v);
	if(strtolower($k) == "layers" && empty($_GET["tema"])){
		$tema = $v;
	}
	if(strtolower($k) == "layer" && empty($_GET["tema"])){
		$tema = $v;
	}
}
$req->setParameter("srsName",$req->getValueByName("SRS"));
$listaepsg = $req->getValueByName("SRS")." EPSG:4618 EPSG:4291 EPSG:4326 EPSG:22521 EPSG:22522 EPSG:22523 EPSG:22524 EPSG:22525 EPSG:29101 EPSG:29119 EPSG:29120 EPSG:29121 EPSG:29122 EPSG:29177 EPSG:29178 EPSG:29179 EPSG:29180 EPSG:29181 EPSG:29182 EPSG:29183 EPSG:29184 EPSG:29185";
$tipo = "";
if(isset($version) && !isset($VERSION)){
	$VERSION = $version;
}
if(!isset($VERSION)){
	$req->setParameter("VeRsIoN","1.0.0");
}
//compatibiliza chamadas fora do padrao
//
if(isset($_GET["outputFormat"]) && $_GET["outputFormat"] != ""){
	$_GET["OUTPUTFORMAT"] = $_GET["outputFormat"];
}
$_GET["DESLIGACACHE"] = "sim";
$agora = time();
$cache = false;
$nomeMapfileTmp = $dir_tmp."/ogc_".md5($tema)."_".$agora.".map";
$nomeMapfileTmp = str_replace(",","",$nomeMapfileTmp);
$nomeMapfileTmp = str_replace(" ","",$nomeMapfileTmp);
//essa variavel e usada para definir se a imagem final gerada devera ser cortada ou nao
$cortePixels = 0;
if(file_exists($nomeMapfileTmp) && $tipo == ""){
	$oMap = ms_newMapobj($nomeMapfileTmp);
}
else{
	if(empty($ogcwsmap)){
		$oMap = ms_newMapobj($locaplic."/aplicmap/ogcwsv".$versao.".map");
	}
	else{
		$oMap = ms_newMapobj($ogcwsmap);
	}
	$proto = "http" . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "s" : "") . "://";
	$server = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
	$or = $proto.$server.$_SERVER['PHP_SELF'];
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
	$oMap->setmetadata("wms_attribution_logourl_href",$proto.$server.dirname($_SERVER['PHP_SELF'])."/imagens/i3geo.png");
	$oMap->setmetadata("wms_attribution_onlineresource",$proto.$server.dirname($_SERVER['PHP_SELF']));
	$oMap->setmetadata("wms_attribution_title",$tituloInstituicao);
	$oMap->setmetadata("ows_enable_request","*");
	//parametro mandatario
	if($oMap->getmetadata("wms_srs") == ""){
		$oMap->setmetadata("wms_srs","EPSG:4326");
	}
	$e = $oMap->extent;
	$extensaoMap = ($e->minx)." ".($e->miny)." ".($e->maxx)." ".($e->maxy);
	//gera o mapa
	if ($tipo == "" || $tipo == "metadados"){
		$tema = explode(" ",$tema);
		//para o caso do tema ser um arquivo mapfile existente em uma pasta qualquer
		//$temai3geo = true indica que o layer ser&aacute; buscado na pasta i3geo/temas
		$temai3geo = true;
		if(file_exists($_GET["tema"]) && !isset($id_medida_variavel)){
			$nmap = ms_newMapobj($_GET["tema"]);
			$temai3geo = false;
			$nmap->setmetadata("ows_enable_request","*");
		}
		foreach ($tema as $tx){
			$extensao = ".map";
			if($temai3geo == true && file_exists($locaplic."/temas/".$tx.".php")){
				$extensao = ".php";
			}
			if($temai3geo == true && file_exists($locaplic."/temas/".$tx.".gvp")){
				$extensao = ".gvp";
			}
			if($extensao == ".map"){
				//cria o mapfile com base no sistema de metadados estatisticos
				//verifica se o id_medida_variavel existe no mapfile e nao foi passado como um parametro
				if(!isset($id_medida_variavel) && $temai3geo == true){
					$nmap = ms_newMapobj($locaplic."/temas/".$tx.".map");
					$l = $nmap->getlayer(0);
					$teste = $l->getmetadata("METAESTAT_ID_MEDIDA_VARIAVEL");
					if($teste != "" && $l->data == ""){
						$id_medida_variavel = $teste;
					}
				}
				if(isset($id_medida_variavel)){
					$temai3geo = false;
					include("admin/php/classe_metaestat.php");
					$m = new Metaestat();
					$m->nomecache = "ogcmetaestat".$id_medida_variavel;
					$mapfileMetaestat = $m->mapfileMedidaVariavel($id_medida_variavel,"",1,"","","","","","",true);
					$nmap = ms_newMapobj($mapfileMetaestat["mapfile"]);
					$nmap->setmetadata("ows_enable_request","*");
					$req->setParameter("LAYERS", "ogcmetaestat".$id_medida_variavel);
				}
				if($temai3geo == true){
					$nmap = ms_newMapobj($locaplic."/temas/".$tx.".map");
					$nmap->setmetadata("ows_enable_request","*");
				}
				if($temai3geo == false || empty($layers))
				{
					$ts = $nmap->getalllayernames();
					$nmap->setmetadata("ows_enable_request","*");
				}
				else{
					$ts = explode(",",str_replace(" ",",",$layers));
				}
				foreach ($ts as $t){
					$l = $nmap->getlayerbyname($t);
					$permite = $l->getmetadata("permiteogc");
					if(strtolower($permite) != "nao"){
						//necess&aacute;rio pq o mapfile pode ter todos os layers como default
						if($temai3geo == false){
							$l->set("status",MS_OFF);
						}
						/*
						if($cache == true && strtolower($l->getmetadata('cache')) == 'sim' && $tipo == '' && count($tema) == 1){
							carregaCacheImagem($_GET['BBOX'],$tx,$_GET['WIDTH'],$_GET['HEIGHT'],$cachedir);
						}
						*/
						$l->setmetadata("ows_title",pegaNome($l));
						$l->setmetadata("ows_srs",$listaepsg);
						$l->set("group","");
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

						ms_newLayerObj($oMap, $l);
						//$req->setParameter("LAYERS", "mundo");
					}
				}
			}
			if($extensao == ".php"){
				include_once($locaplic."/temas/".$tx.".php");
				eval($tx."(\$oMap);");
			}
			if($extensao == ".gvp"){
				include_once($locaplic."/pacotes/gvsig/gvsig2mapfile/class.gvsig2mapfile.php");
				$gm = new gvsig2mapfile($locaplic."/temas/".$tx.".gvp");
				$gvsigview = $gm->getViewsNames();
				foreach($gvsigview as $gv){
					$dataView = $gm->getViewData($gv);
					$oMap = $gm->addLayers($oMap,$gv,$dataView["layerNames"]);
				}
				$numlayers = $oMap->numlayers;
				$layers = array();
				//$layers[] = "default";
				for ($i=0;$i < $numlayers;$i++){
					$l = $oMap->getlayer($i);
					$l->setmetadata("gml_include_items","all");
					$l->set("dump",MS_TRUE);
					$l->setmetadata("WMS_INCLUDE_ITEMS","all");
					$l->setmetadata("WFS_INCLUDE_ITEMS","all");
					$l->setmetadata("ows_srs",$listaepsg);
					$l->setmetadata("ows_title",$l->getmetadata("TEMA"));
					$l->set("status",MS_OFF);
					$layers[] = $l->name;
					if(file_exists($locaplic."/temas/miniaturas/".$tx.".map.mini.png")){
						$mini = $proto.$server.dirname($_SERVER['PHP_SELF'])."/temas/miniaturas/".$tx.".map.mini.png";
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
					//
					//numero de pixels que serao considerados para corte da imagem no caso de cache ativo e tema de pontos
					//
					if ($l->getmetadata("cortepixels") != ""){
						$cortePixels = $l->getmetadata("cortepixels");
					}
				}
				$req->setParameter("LAYERS", implode(",",$layers));
				$req->setParameter("STYLES", "");
				//r_dump($req);exit;
			}
		}
	}
	else{
		$conta = 0;
		$int = explode(",",$intervalo);
		$codigosTema = array();
		if(empty($perfil)){
			$perfil = "";
		}
		include("classesphp/classe_menutemas.php");
		$m = new Menutemas("",$perfil,$locaplic,$urli3geo);
		$menus = $m->pegaListaDeMenus();
		foreach ($menus as $menu){
			$grupos = $m->pegaListaDeGrupos($menu["idmenu"],$listasistemas="nao",$listasgrupos="sim");
			foreach($grupos as $grupo){
				if(strtolower($grupo["ogc"]) == "sim"){
					foreach($grupo["subgrupos"] as $sgrupo){
						if(strtolower($sgrupo["ogc"]) == "sim"){
							$temas = $m->pegaListaDeTemas($grupo["id_n1"],$sgrupo["id_n2"],$menu["idmenu"]);
							foreach($temas as $tema){
								if(strtolower($tema["ogc"]) == "sim"){
									$codigosTema[] = array("tema"=>$tema["tid"],"fonte"=>$tema["link"]);
								}
							}
						}
					}
				}
			}
		}
		//echo "<pre>";
		//var_dump($codigosTema);
		//exit;

		foreach($codigosTema as $c){
			$codigoTema = $c["tema"];
			if(file_exists($locaplic."/temas/".$codigoTema.".map")){
				if (@ms_newMapobj($locaplic."/temas/".$codigoTema.".map")){
					$nmap = ms_newMapobj($locaplic."/temas/".$codigoTema.".map");
					$nmap->setmetadata("ows_enable_request","*");
					$ts = $nmap->getalllayernames();
					if (count($ts) == 1){
						foreach ($ts as $t){
							if ($oMap->getlayerbyname($t) == ""){
								$conta++;
								if (($conta >= $int[0]) && ($conta <= $int[1])){
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
					}
				}
				else{
					echo "Erro no arquivo ".$locaplic."/temas/".$codigoTema.".map <br>";
					$error = ms_GetErrorObj();
					while($error && $error->code != MS_NOERR){
						printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
						$error = $error->next();
					}
				}
			}
		}
	}
	$oMap->setSymbolSet($locaplic."/symbols/".basename($oMap->symbolsetfilename));
	$oMap->setFontSet($locaplic."/symbols/".basename($oMap->fontsetfilename));
	$oMap->save($nomeMapfileTmp);
	$oMap = ms_newMapobj($nomeMapfileTmp);
}
if(ob_get_contents ()){
	ob_end_clean();
}

//
//verifica se a chamada do servico e do tipo TILE no padrao do Google
//
if(isset($_GET["Z"]) && isset($_GET["X"])){
	$x = $_GET["X"];
	$y = $_GET["Y"];
	$z = $_GET["Z"];
	$layer0 = $oMap->getlayer(0);
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

	$oMap->getlayer(0)->set("status",MS_DEFAULT);
	$oMap->setProjection("proj=merc,a=6378137,b=6378137,lat_ts=0.0,lon_0=0.0,x_0=0.0,y_0=0,k=1.0,units=m");
	$layer0->setProjection("proj=latlong,a=6378137,b=6378137");
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
	$l = $oMap->getlayer(0);
	if($req->getValueByName("LAYER") == ""){
		$req->setParameter("LAYER",$l->name);
	}
	//muda o title se for vazio
	$nclass = $l->numclasses;
	for($i=0;$i<$nclass;$i++){
		$classe = $l->getclass($i);
		if($classe->title === ""){
			$classe->title = $classe->name;
		}
	}
	if($req->getValueByName("FORMAT") == ""){
		$req->setParameter("FORMAT","image/png");
	}
	$legenda = $oMap->legend;
	$legenda->set("status",MS_DEFAULT);
	$l->set("minscaledenom",0);
	$l->set("maxscaledenom",0);
	if($req->getValueByName("FORMAT") == "text/html"){
		//$req->setParameter("FORMAT","image/png");
		$l = $oMap->getlayerbyname($req->getValueByName("LAYER"));
		$l->set("status",MS_DEFAULT);
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
		$legenda->set("template",$locaplic."/aplicmap/legendaOgc.html");
		$tmparray["my_tag"] = "value_of_my_tag";
		if($leg = @$oMap->processlegendtemplate($tmparray)){
			if (function_exists("mb_convert_encoding")){
				$leg = mb_convert_encoding($leg,"UTF-8","ISO-8859-1");
			}
			echo $leg;exit;
		}
	}

}

if(strtolower($req->getValueByName("REQUEST")) == "getfeature"){
	$l = $oMap->getlayer(0);
	if($req->getValueByName("TYPENAME") == "" || $req->getValueByName("TYPENAME") == "undefined"){
		$req->setParameter("TYPENAME",$l->name);
	}
	if($l->getProjection() == "" ){
		$l->setProjection("proj=latlong,a=6378137,b=6378137");
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
//
//altera os caminhos das imagens
//
if((isset($legenda)) && (strtolower($legenda) == "sim")){
	$leg = $oMap->legend;
	$leg->set("status",MS_EMBED);
}

ms_ioinstallstdouttobuffer();
//verifica parametro outputformat
if(strtolower($req->getValueByName("REQUEST")) == "getmap" && $req->getValueByName("format") == ""){
	$req->setParameter("format","image/png");
}
$oMap->owsdispatch($req);
$contenttype = ms_iostripstdoutbuffercontenttype();

if(!isset($OUTPUTFORMAT)){
	header("Content-type: $contenttype");
}

$buffer = ms_iogetStdoutBufferBytes();
ms_ioresethandlers();

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
	{$nomes .= $a{mt_rand(0, $max)};}
	return $nomes;
}

?>
