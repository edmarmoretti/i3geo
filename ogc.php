<?php
/*
 Title: Gerador de servi&ccedil;os OGC

Gera web services nos padr&otilde;es OGC para os temas existentes na pasta i3geo/temas

A lista de proje&ccedil;&otilde;es mostradas na fun&ccedil;&atilde;o getcapabilities &eacute; definida na vari&aacute;vel $listaepsg. Edite essa vari&aacute;vel diretamente no programa
se forem necess&aacute;rias outras proje&ccedil;&otilde;es al&eacute;m das existentes

Licen&ccedil;a:

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
	GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo: i3geo/ogc.php

Par&acirc;metros:

lista - (opcional) se for igual a "temas", mostra uma lista de links em HTML dos temas dispon&iacute;veis,
se for igual a "temaswfs", mostra a lista de links WFS

ajuda - (opcional) mostra uma ajuda ao usu&aacute;rio

tema - (opcional) nome do tema que ser&aacute; mostrado no servi&ccedil;o. Se for definido, o web service conter&aacute; apenas esse tema. O tema &eacute; o nome do mapfile existente em i3geo/temas, mas pode ser especificado um mapfile existente em outra pasta. Nesse caso, deve-se especificar o caminho completo para o arquivo. Se n&atilde;o for definido, ser&atilde;o considerados todos os temas

legenda - (opcional) mostra a legenda no corpo do mapa sim|nao

perfil - (opcional) perfil utilizado para restringir os temas que ser&atilde;o mostrados

format - (opcional) pode ser utilizado a op&ccedil;&atilde;o &format=application/openlayers para
abrir o mashup do OpenLayers com as camadas definida em temas.
Na gera&ccedil;&atilde;o da legenda pode ser utilizado text/html para gerar no formato html.

OUTPUTFORMAT - em getfeature, aceita tamb&eacute;m shape-zip para download de shapefile e csv para download de csv compactado

ows_geomtype - permite definir o tipo de geometria conforme utilizado pelo parametro GEOMETRY do OGR (veja http://gdal.org/drv_csv.html)
afeta o OUTPUTFORMAT csv. Por default utiliza &ows_geomtype=none para obter um csv sem a coluna geometry. Para obter a geometria utilize &ows_geomtypeAS_WKT

id_medida_variavel - id da medida de variavel - utilizado apenas quando a fonte para definicao do layer for o sistema de metadados estatisticos
nao deve ser utilizado junto com tema

restauramapa - ID de um mapa salvo no sistema de administracao. O mapa e restaurado e tratado como WMS

DESLIGACACHE (opcional) {sim|nao} - forca a nao usar o cache de imagens qd definido como "sim", do contr&aacute;rio, o uso ou n&atilde;o do cache ser&aacute; definido automaticamente

filtros - filtros podem ser adicionados incluindo o parametro da seguinte forma: &map_layer_<nomedotema>_filter=

Exemplo de filtro

http://localhost/i3geo/ogc.php?map_layer__lbiomashp_filter=(('[CD_LEGENDA]'='CAATINGA'))&tema=_lbiomashp&SRS=EPSG:4618&WIDTH=500&HEIGHT=500&BBOX=-76.5125927,-39.3925675209,-29.5851853,9.49014852081&FORMAT=image/png&service=wms&version=1.1.0&request=getmap&layers=_lbiomashp

no caso de camadas Postgis basta usar map_layer__lbiomashp_filter=cd_legenda='CAATINGA'

Exemplos:

ogc.php?temas=biomashp&format=application/openlayers&bbox=-54,-14,-50,-10

ogc.php?lista=temas

ogc.php?tema=bioma

ogc.php?tema=/var/www/i3geo/aplicmap/geral1debianv6.map&layers=mundo

*/
set_time_limit(0);
ini_set('memory_limit', '512M');
$_GET = array_merge($_GET,$_POST);
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
//require_once(dirname(__FILE__)."/classesphp/carrega_ext.php");
include(dirname(__FILE__)."/ms_configura.php");
include(dirname(__FILE__)."/classesphp/pega_variaveis.php");
include(dirname(__FILE__)."/classesphp/funcoes_gerais.php");
//
//ajusta o default
//
if(!isset($ows_geomtype) || $ows_geomtype == ""){
	$ows_geomtype = "none";
}
//
//imprime na tela a ajuda
//
if(isset($ajuda)){
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
//
//imprime na tela a lista de temas disponiveis
//
if(isset($lista) && $lista != ""){
	include_once(dirname(__FILE__)."/classesphp/classe_menutemas.php");
	if($lista == "temas"){
		ogc_imprimeListaDeTemas();
	}
	if($lista == "temaswfs"){
		ogc_imprimeListaDeTemasWfs();
	}
	exit;
}
//
//define um nome para o mapfile caso a origem seja o sistema de metadados estatisticos
//
if(isset($id_medida_variavel) && $id_medida_variavel != ""){
	$tema = "ogcmetaestat".$id_medida_variavel;
}
//
//compatibiliza variaveis
//
if(!isset($tema) && isset($layers)){
	$tema = $layers;
}
if(!isset($tema) && isset($LAYERS)){
	$tema = $LAYERS;
}
if(!isset($tema) && isset($temas)){
	$tema = $temas;
}
if(isset($typeName)){
	$typename = $typeName;
}
if(!isset($tema) && isset($typename)){
	$tema = $typename;
}
//
//garante que layers possam ser especificados de diferentes maneiras
//mas evita definir o layer como o nome do mapfile
//
if(!file_exists($tema)){
	$_GET["layers"] = $tema;
	$_GET["LAYERS"] = $tema;
}

$layers = $tema;
//
//verifica o OUTPUTFORMAT e o cache de arquivo
//
if(!empty($OUTPUTFORMAT)){
	carregaCacheArquivo();
}
//
//para o caso da requisicao kml
//
if(strtolower($OUTPUTFORMAT) == "kml" || strtolower($OUTPUTFORMAT) == "kmz"){
	$urln = "pacotes/kmlmapserver/kmlservice.php?request=kmz&map=".$tema."&typename=".$tema;
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
//recupera um mapa salvo no banco de administracao
//
if(!empty($restauramapa)){
	restauraMapaSalvo();
}
//
//para operar como o Geoserver, abre o openlayers
//
if(isset($format) && strtolower($format) == "application/openlayers"){
	$urln = dirname($_SERVER["PHP_SELF"])."/mashups/openlayers.php?layers=".$layers."&mapext=".$bbox."&botoes=pan,zoombox,zoomtot,identifica";
	//echo $urln;exit;
	if(!headers_sent()){
		header("Location:".$urln);
	}
	else{
		echo "<meta http-equiv='refresh' content='0;url=$urln'>";
	}
	//exit....
}
//
//pega a versao do Mapserver
//
error_reporting(0);
$versao = versao();
$versao = $versao["principal"];

$req = ms_newowsrequestobj();
$tipo = "";

if(isset($_GET["sld"]) || isset($_GET["filter"])){
	$cache = false;
}
//
//inclui todos os parametros na requisicao e aproveita para verificar getcapabilities
//
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

if(isset($version) && !isset($VERSION)){
	$VERSION = $version;
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
$nomeMapfileTmp = $dir_tmp."/ogc_".md5(implode("",$arrayget))."_".$agora.".map";

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
		$oMap->setmetadata("wms_srs","EPSG:4326");
	}
	$e = $oMap->extent;
	$extensaoMap = ($e->minx)." ".($e->miny)." ".($e->maxx)." ".($e->maxy);

	//gera o mapa
	if ($tema != ""){
		$listatema = explode(" ",$tema);
		//para o caso do tema ser um arquivo mapfile existente em uma pasta qualquer
		//$temai3geo = true indica que o layer ser&aacute; buscado na pasta i3geo/temas
		$temai3geo = true;
		//FIXME nao aceita gvp quando o caminho e completo
		if(file_exists($_GET["tema"]) && !isset($id_medida_variavel)){
			$nmap = ms_newMapobj($_GET["tema"]);
			$temai3geo = false;
			$nmap->setmetadata("ows_enable_request","*");
		}
		foreach ($listatema as $tx){
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
				$lys = array();
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
					$lys[] = $l->name;
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
				$req->setParameter("LAYERS", implode(",",$lys));
				$req->setParameter("STYLES", "");
			}
		}
	}
	else{
		$intervalo = "0,5000";
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
						printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
						$error = $error->next();
					}
				}
			}
		}
	}
	//
	//a imagem do mapa recebera a legenda
	//
	if((isset($legenda)) && (strtolower($legenda) == "sim")){
		$leg = $oMap->legend;
		$leg->set("status",MS_EMBED);
	}
	$oMap->setSymbolSet($locaplic."/symbols/".basename($oMap->symbolsetfilename));
	$oMap->setFontSet($locaplic."/symbols/".basename($oMap->fontsetfilename));
	//verifica se existem layers com plugin definido e processa conforme o tipo de plugin
	processaPluginI3geo();
	//
	//caso seja download ou json ou csv
	//
	processaOutputformatMapfile();

	$oMap->save($nomeMapfileTmp);
	validaAcessoTemas($nomeMapfileTmp,true);
	$oMap = ms_newMapobj($nomeMapfileTmp);
}

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

	if(file_exists($tema)){
		$layer0 = $oMap->getlayer(0);
		$layer0->set("status",MS_DEFAULT);
		$layer0->setProjection("proj=latlong,a=6378137,b=6378137");
	}
	else{
		//pode ter mais de um tema
		$lista = explode(" ",$tema);
		foreach($lista as $nomeLayer){
			$layer0 = $oMap->getlayerbyname($nomeLayer);
			$layer0->set("status",MS_DEFAULT);
			$layer0->setProjection("proj=latlong,a=6378137,b=6378137");
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
	$legenda->set("status",MS_ON);
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
$oMap->owsdispatch($req);
$contenttype = ms_iostripstdoutbuffercontenttype();
$buffer = ms_iogetStdoutBufferBytes();

ms_ioresethandlers();
//
//fun&ccedil;&otilde;es
//
function ogc_pegaListaDeMenus(){
	global $perfil,$locaplic,$urli3geo;
	if(!isset($perfil)){
		$perfil = "";
	}
	$m = new Menutemas("",$perfil,$locsistemas,$locaplic,"",$urli3geo);
	foreach($m->pegaListaDeMenus() as $menu)
	{
		$menus[] = $urli3geo."/admin/xmlmenutemas.php?id_menu=".$menu["idmenu"];
	}
	return $menus;
}
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
	global $urli3geo,$perfil,$locaplic;
	$m = new Menutemas("",$perfil,$locaplic,$urli3geo);
	$menus = $m->pegaListaDeMenus();
	echo '<html><head><title>WMS</title><META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1"><meta name="description" content="OGC"><meta name="keywords" content="WMS OGC mapa sig gis webmapping geo geoprocessamento interativo meio ambiente MMA cartografia geografia"> <meta name="robots" content="index,follow">';
	echo "<body><b>Lista de temas por grupos e subgrupos e endere&ccedil;os de acesso aos dados por meio de Web Services WMS (os c&oacute;digos dos temas est&atilde;o em vermelho)</b><br><br>";
	$imprimir = "";
	foreach ($menus as $menu){
		$grupos = $m->pegaListaDeGrupos($menu["idmenu"],$listasistemas="nao",$listasgrupos="sim");
		foreach($grupos as $grupo){
			if(!empty($grupo["ogc"]) && strtolower($grupo["ogc"]) == "sim"){
				$imprimegrupo = "<i>".texto2iso($grupo["nome"])."</i>";
				foreach($grupo["subgrupos"] as $sgrupo){
					if(strtolower($sgrupo["ogc"]) == "sim"){
						$imprimesubgrupo = $sgrupo["nome"];
						$lts = $m->pegaListaDeTemas($grupo["id_n1"],$sgrupo["id_n2"],$menu["idmenu"]);
						foreach($lts as $t){
							if(strtolower($t["ogc"]) == "sim"){
								$imprimir .= texto2iso($imprimegrupo)."->".texto2iso($imprimesubgrupo)."<br>";
								$imprimir .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
								$imprimir .= "<span style=color:red >".$t["tid"]."</span>";
								$imprimir .= "&nbsp;-&nbsp;".texto2iso($t["nome"])."&nbsp";
								$imprimir .= "&nbsp;<a href='".$urli3geo."/ogc.php?tema=".$t["tid"]."&service=wms&request=getcapabilities' >Getcapabilities</a>";
								$imprimir .= "&nbsp;<a href='".$urli3geo."/ogc.php?tema=".$t["tid"]."&SRS=EPSG:4618&WIDTH=500&HEIGHT=500&BBOX=-76.5125927,-39.3925675209,-29.5851853,9.49014852081&FORMAT=image/png&service=wms&version=1.1.0&request=getmap&layers=".$t["tid"]."' >GetMap </a>";
								if($t["link"] != " ")
									$imprimir .= "&nbsp;&nbsp;<a href='".$t["link"]."' >fonte</a>";
								$imprimir .= "<br>";
							}
						}
					}
				}
			}
		}
	}
	echo $imprimir."</body></html>";
}
function ogc_imprimeListaDeTemasWfs(){
	global $urli3geo,$perfil,$locaplic;
	$m = new Menutemas("",$perfil,$locaplic,$urli3geo);
	$menus = $m->pegaListaDeMenus();
	echo '<html><head><title>WFS</title><META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1"><meta name="description" content="OGC"><meta name="keywords" content="WMS OGC mapa sig gis webmapping geo geoprocessamento interativo meio ambiente MMA cartografia geografia"> <meta name="robots" content="index,follow">';
	echo "<body><b>Lista de temas por grupos e subgrupos e endere&ccedil;os de acesso aos dados por meio de Web Services WFS (os c&oacute;digos dos temas est&atilde;o em vermelho)</b><br><br>";
	$imprimir = "";
	foreach ($menus as $menu){
		$grupos = $m->pegaListaDeGrupos($menu["idmenu"],$listasistemas="nao",$listasgrupos="sim");
		foreach($grupos as $grupo){
			if(strtolower($grupo["ogc"]) == "sim"){
				$imprimegrupo = "<i>".$grupo["nome"]."</i>";
				foreach($grupo["subgrupos"] as $sgrupo){
					if(strtolower($sgrupo["ogc"]) == "sim"){
						$imprimesubgrupo = $sgrupo["nome"];
						$lts = $m->pegaListaDeTemas($grupo["id_n1"],$sgrupo["id_n2"],$menu["idmenu"]);
						foreach($lts as $t){
							if(strtolower($t["ogc"]) == "sim" && strtolower($t["down"]) !== "nao"){
								$imprimir .= $imprimegrupo."->".$imprimesubgrupo."<br>";
								$imprimir .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
								$imprimir .= "<span style=color:red >".$t["tid"]."</span>";
								$imprimir .= "&nbsp;-&nbsp;".$t["nome"]."&nbsp";
								$imprimir .= "&nbsp;<a href='".$urli3geo."/ogc.php?tema=".$t["tid"]."&service=wfs&request=getcapabilities' >Getcapabilities</a>";
								$imprimir .= "&nbsp;<a href='".$urli3geo."/ogc.php?tema=".$t["tid"]."&SRS=EPSG:4618&service=wfs&version=1.1.0&request=getfeature&typename=".$t["tid"]."' >Getfeature </a>";
								if($t["link"] != " ")
									$imprimir .= "&nbsp;&nbsp;<a href='".$t["link"]."' >fonte</a>";
								$imprimir .= "<br>";
							}
						}
					}
				}
			}
		}
	}
	echo $imprimir."</body></html>";
}
function carregaCacheImagem($cachedir,$map,$tms){
	global $dir_tmp;
	if($cachedir == ""){
		$nome = $dir_tmp."/cache".$tms;
	}
	else{
		$nome = $cachedir.$tms;
	}
	if(file_exists($nome)){
		header('Content-Length: '.filesize($nome));
		header('Content-Type: image/png');
		header('Cache-Control: max-age=3600, must-revalidate');
		header('Expires: ' . gmdate('D, d M Y H:i:s', time()+24*60*60) . ' GMT');
		header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($nome)).' GMT', true, 200);
		$etag = md5_file($nome);
		header('Etag: '.$etag);
		readfile($nome);
		exit;
	}
}
function salvaCacheImagem($cachedir,$map,$tms){
	global $img,$dir_tmp,$cortePixels;
	if($cachedir == ""){
		$nome = $dir_tmp."/cache".$tms;
	}
	else{
		$nome = $cachedir.$tms;
	}
	@mkdir(dirname($nome),0777,true);
	chmod(dirname($nome),0777);
	$img->saveImage($nome);
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
	chmod($nome,0777);
	header('Content-Length: '.filesize($nome));
	header('Content-Type: image/png');
	header('Cache-Control: max-age=3600, must-revalidate');
	header('Expires: ' . gmdate('D, d M Y H:i:s', time()+24*60*60) . ' GMT');
	header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($nome)).' GMT', true, 200);
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
		header('Content-Length: '.filesize($nomer));
		header('Content-Type: image/png');
		header('Cache-Control: max-age=3600, must-revalidate');
		header('Expires: ' . gmdate('D, d M Y H:i:s', time()+24*60*60) . ' GMT');
		header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($nomer)).' GMT', true, 200);
		readfile($nomer);
	}
	if($i3georendermode == 2){
		ob_clean();
		header('Cache-Control: public, max-age=22222222');
		header('Expires: ' . gmdate('D, d M Y H:i:s', time()+48*60*60) . ' GMT');
		header("X-Sendfile: $nomer");
		header("Content-type: image/png");
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
	if(strtolower($OUTPUTFORMAT) == "geojson" || strtolower($OUTPUTFORMAT) == "json"){
		$arq = $dir_tmp."/".$tema.".json";
		if(file_exists($arq)){
			header("Content-type: application/json; subtype=geojson");
			readfile($arq);
			exit;
		}
	}
}
function restauraMapaSalvo(){
	global $restauramapa, $dir_tmp, $tema;
	$xbase = restauraMapaAdmin($restauramapa,$dir_tmp);
	$m = ms_newMapObj($xbase);
	$w = $m->web;
	$w->set("imagepath",dirname($w->imagepath)."/");
	$w->set("imageurl",dirname($w->imageurl)."/");
	//apaga algumas camadas
	$l = $m->getlayerbyname("rosadosventos");
	if($l != ""){
		$l->set("status",MS_DELETE);
	}
	$l = $m->getlayerbyname("copyright");
	if($l != ""){
		$l->set("status",MS_DELETE);
	}
	$m->setmetadata("ows_enable_request","*");
	$m->save($xbase);
	//$fundo = $xbase;
	$tema = $xbase;
	$_GET["tema"] = $xbase;
	$_GET["layers"] = "";
	$l = $m->getlayer(0);
	$_GET["LAYERS"] = $l->name;
}
function exportaCsv(){
	global $oMap, $arq, $fileName, $versao, $ows_geomtype;
	$layer = $oMap->getlayer(0);
	$items = pegaItens($layer,$oMap);
	$layer->querybyrect($oMap->extent);
	$layer->open();
	$res_count = $layer->getNumresults();
	$linhas = array();
	if($ows_geomtype == "none"){
		$linhas[] = implode(",",$items);
	}
	else{
		$linhas[] = implode(",",$items).",wkt";
	}
	for ($i = 0; $i < $res_count; $i++){
		if($versao == 6){
			$shape = $layer->getShape($layer->getResult($i));
		}
		else{
			$shape = $layer->getFeature($layer->getResult($i)->shapeindex);
		}
		$reg = array();
		foreach ($items as $item){
			$v = trim($shape->values[$item]);
			if(is_string($v)){
				$v = '"'.converteenc($v).'"';
			}
			$reg[] = $v;
		}
		if($ows_geomtype != "none"){
			$reg[] = '"'.$shape->towkt().'"';
		}
		$linhas[] = implode(",",$reg);

	}
	$contents = implode("\n",$linhas);
	file_put_contents($arq,$contents);
	//envia para download
	ob_clean();
	header('Content-Disposition: attachment; filename='.$fileName);
	header("Content-type: text/csv");
	echo $contents;
	exit;
}
function exportaGeojson(){
	global $oMap, $arq, $fileName, $versao, $ows_geomtype;
	include("pacotes/gisconverter/gisconverter.php");
	$decoder = new gisconverter\WKT();
	$layer = $oMap->getlayer(0);
	$items = pegaItens($layer,$oMap);
	$layer->querybyrect($oMap->extent);
	$layer->open();
	$res_count = $layer->getNumresults();
	$linhas = array();

	$features = array();
	for ($i = 0; $i < $res_count; $i++){
		if($versao == 6){
			$shape = $layer->getShape($layer->getResult($i));
		}
		else{
			$shape = $layer->getFeature($layer->getResult($i)->shapeindex);
		}
		$propriedades = array();
		foreach ($items as $item){
			$v = trim($shape->values[$item]);
			if(is_string($v)){
				$v = '"'.converteenc($v).'"';
			}
			$propriedades[] = array($item=>$v);
		}
		$wkt = $shape->towkt();

		$features[] = array(
			"type"=>"Feature",
			"properties"=>$propriedades,
			"geometry"=>json_decode($decoder->geomFromText($wkt)->toGeoJSON())
		);
	}
	$n[] = array (
			"type" => "FeatureCollection",
			"features" => $features
	);
	$contents = json_encode($n[0]);
	$contents = str_replace('\"','',$contents);
	file_put_contents($arq,$contents);
	ob_clean();
	header("Content-type: application/json; subtype=geojson");
	echo $contents;
	exit;
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
								$plugin[] = execProg($locaplic."/".$c["prog"]);
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
						$v = $valores[$i];
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
//utilizada para obter os dados default quando se utiliza o plugin parametrossql
function execProg($prog){
	include($prog);
	//$retorno variavel deve ser retornada pelo programa $prog
	//veja como exemplo i3geo/aplicmap/daods/listaano.php
	return $retorno[0]["v"];
}
?>
