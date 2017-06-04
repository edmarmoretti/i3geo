<?php
/**
Esse programa e uma adaptacao do codigo i3geo/ogc.php
E utilizado no mashup (i3geo/mashup) nas camadas que sao configuradas cm o plugin parametrossql
Ao adicionar uma camada ao mapa, o i3Geo identifica se a camada usa o plugin e nesse caso, ao inves de usar
o gerador de webservice i3geo/ogc.php ustiliza esse aqui.
A diferenca e que esse servico processa o parametro "plugin", aplicando os filtros definidos
no plugin parametrossql
 */
$cache = true;
include(dirname(__FILE__)."/../../classesphp/sani_request.php");
include_once (dirname(__FILE__)."/../../classesphp/carrega_ext.php");
include(dirname(__FILE__)."/../../ms_configura.php");
include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
$_GET = array_merge($_GET,$_POST);
$plugin = $_GET["plugin"];
$projDefault = pegaProjecaoDefault();

$tema = basename($_GET["tema"]);
if($tema == ""){
	exit;
}
if(isset($_GET["sld"]) || isset($_GET["filter"])){
	$cache = false;
}
if(isset($_GET["DESLIGACACHE"]) && $_GET["DESLIGACACHE"] == "sim"){
	$cache = false;
}
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
//error_reporting(0);
$versao = versao();
$versao = $versao["principal"];
if($_GET["SRS"] == "EPSG:900913"){
	$_GET["SRS"] = "EPSG:3857";
}
$req = ms_newowsrequestobj();

if(!isset($_GET["srs"]) && !isset($_GET["SRS"])){
	$_GET["srs"] = "EPSG:".$projDefault["epsg"];
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
if(isset($version) && !isset($VERSION)){
	$VERSION = $version;
}
if(!isset($VERSION)){
	$req->setParameter("VeRsIoN","1.0.0");
}
//
//compatibiliza chamadas fora do padrao
//
if(isset($_GET["outputFormat"]) && $_GET["outputFormat"] != ""){
	$_GET["OUTPUTFORMAT"] = $_GET["outputFormat"];
}
$agora = intval(time() / 1000);
if(isset($_GET["Z"]) && isset($_GET["X"])){
	$agora .= "google";
}
$nomeMapfileTmp = $dir_tmp."/ogcpsql_".md5($tema.$plugin.($req->getValueByName("SRS")))."_".$agora.".map";
$nomeMapfileTmp = str_replace(",","",$nomeMapfileTmp);
$nomeMapfileTmp = str_replace(" ","",$nomeMapfileTmp);
//essa variavel e usada para definir se a imagem final gerada devera ser cortada ou nao
$cortePixels = 0;
if(file_exists($nomeMapfileTmp)){
	$oMap = ms_newMapobj($nomeMapfileTmp);
	substituiConObj($oMap,$postgis_mapa);
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
	$or = $or."?tema=".$tema."&";
	//
	//parametros no n&iacute;vel maior
	//
	$oMap->setmetadata("ows_onlineresource",$or);
	$oMap->setmetadata("wms_onlineresource",$or);
	$oMap->setmetadata("wms_attribution_onlineresource",$proto.$server.dirname($_SERVER['PHP_SELF']));
	$oMap->setmetadata("ows_enable_request","*");
	//parametro mandatario
	if($oMap->getmetadata("wms_srs") == ""){
		$oMap->setmetadata("wms_srs","EPSG:".$projDefault["epsg"]);
	}

	$e = $oMap->extent;
	$extensaoMap = ($e->minx)." ".($e->miny)." ".($e->maxx)." ".($e->maxy);
	//gera o mapa
	$nmap = ms_newMapobj($locaplic."/temas/".$tema.".map");
	$nmap->setmetadata("ows_enable_request","*");
	$l = $nmap->getlayerbyname($tema);
	//$l->setmetadata("ows_title",pegaNome($l));
	$l->setmetadata("ows_srs",$listaepsg);
	$l->set("group","");
	$l->setmetadata("gml_include_items","all");
	$l->set("template","none.htm");
	$l->set("dump",MS_TRUE);
	$l->setmetadata("WMS_INCLUDE_ITEMS","all");
	$l->setmetadata("WFS_INCLUDE_ITEMS","all");
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
	//aplica os parametros especificos do plugin
	$data = $l->data;
	$c = $l->getmetadata("PLUGINI3GEO");
	if($c != ""){
		$cs = json_decode($c,true);
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
		//acrecenta-se um md5 apos o nome caso seja necessario gerar cache
		if($cache == true){
			$original = $l->getmetadata("nomeoriginal");
			if($original == ""){
				$l->setmetadata("nomeoriginal",$l->name);
				$original = $l->name;
			}
			$l->set("name",$original.md5($plugin));
		}
	}
	ms_newLayerObj($oMap, $l);

	$oMap->setSymbolSet($locaplic."/symbols/".basename($oMap->symbolsetfilename));
	$oMap->setFontSet($locaplic."/symbols/".basename($oMap->fontsetfilename));
	$nomeMapfileTmp = str_replace(".map","",$nomeMapfileTmp).".map";
	$oMap->save($nomeMapfileTmp);

	$oMap = ms_newMapobj($nomeMapfileTmp);
}
if(ob_get_contents ()){
	ob_end_clean();
}
restauraCon($nomeMapfileTmp,$postgis_mapa);
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
		carregaCacheImagem($cachedir,$nomeMapfileTmp,$_GET["tms"],$_GET["plugin"],$_GET["tema"]);
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
		salvaCacheImagem($cachedir,$nomeMapfileTmp,$_GET["tms"],$_GET["plugin"],$_GET["tema"]);
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

	$projInObj = ms_newprojectionobj($projDefault["proj4"]);
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
	$layer0->setProjection($projDefault["proj4"]);
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
		//o nome do layer pode ter sido alterado no mapfile caso o cache esteja ativo
		//nesse caso, pega o primeiro layer
		if($l == ""){
			$l = $oMap->getlayer(0);
		}
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
		$l->setProjection($projDefault["proj4"]);
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
//o LAYER pode ter um nome randomico em funcao de ser um plugin
$l = $oMap->getlayer(0);
if($req->getValueByName("LAYERS") != $l->name){
	$req->setParameter("LAYERS",$l->name);
}
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
		//fpassthru(fopen($nomer, 'rb'));
		$nomer = str_replace(".png","",$nome).".png";
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
function carregaCacheImagem($cachedir,$map,$tms, $plugin, $tema){
	global $dir_tmp;
	if(!empty($plugin)){
		$tms = str_replace($tema,$tema.md5($plugin),$tms);
	}
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
		//fpassthru(fopen($nome, 'rb'));
		$nome = str_replace(".png","",$nome).".png";
		readfile($nome);
		exit;
	}
}
function salvaCacheImagem($cachedir,$map,$tms, $plugin, $tema){
	global $img,$dir_tmp,$cortePixels;
	if(!empty($plugin)){
		$tms = str_replace($tema,$tema.md5($plugin),$tms);
	}
	if($cachedir == ""){
		$nome = $dir_tmp."/cache".$tms;
	}
	else{
		$nome = $cachedir.$tms;
	}
	@mkdir(dirname($nome),0744,true);
	chmod(dirname($nome),0744);
	$nome = str_replace(".png","",$nome).".png";
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
	chmod($nome,0744);
	header('Content-Length: '.filesize($nome));
	header('Content-Type: image/png');
	header('Cache-Control: max-age=3600, must-revalidate');
	header('Expires: ' . gmdate('D, d M Y H:i:s', time()+24*60*60) . ' GMT');
	header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($nome)).' GMT', true, 200);
	//fpassthru(fopen($nome, 'rb'));
	readfile($nome);
	exit;
}
function execProg($prog){
	//$retorno variavel deve ser retornada pelo programa $prog
	//veja como exemplo i3geo/aplicmap/daods/listaano.php
	global $urli3geo;
	$u = str_replace("/ferramentas/parametrossql","",$urli3geo);
	$handle = curl_init();
	curl_setopt( $handle, CURLOPT_URL, $u."/".$prog);
	curl_setopt( $handle, CURLOPT_HEADER, false );
	curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
	$str = curl_exec( $handle );
	curl_close( $handle );
	$retorno = json_decode($str,true);
	return $retorno[0]["v"];
}
?>
