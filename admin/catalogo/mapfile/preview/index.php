<?php
include ("../../../php/checaLogin.php");
\admin\php\login\checaLogin();
$locaplic = $_SESSION["locaplic"];
//funcoes de administracao
include ($_SESSION["locaplic"]."/admin/php/funcoesAdmin.php");
//
//carrega outras funcoes e extensoes do PHP
//
include ($_SESSION["locaplic"]."/classesphp/carrega_ext.php");

if(\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/php/editortexto") == false){
	echo "Vc nao pode realizar essa operacao.";exit;
}


//calcula resolucoes
$res = array();
$temp = 0.703125;
for($i = 0; $i < 40; $i++){
	$res[] = $temp;
	$temp = $temp / 2;
}
$top_left_minx = -180;
$top_left_maxy = 90;

$x_size = $res[$_GET["TileMatrix"] - 1] * 256;
$y_size = $x_size;

$lon1 = $top_left_minx + ($_GET["TileCol"] * $x_size);
$lat1 = $top_left_maxy - ($_GET["TileRow"] * $y_size) - $y_size;
$lon2 = $top_left_minx + ($_GET["TileCol"] * $x_size) + $x_size;
$lat2 = $top_left_maxy - ($_GET["TileRow"] * $y_size);

$_GET["WIDTH"] = 256;
$_GET["HEIGHT"] = 256;

$_GET["tms"] = "/wmts/".$tema."/".$_GET["TileMatrix"]."/".$_GET["TileCol"]."/".$_GET["TileRow"];
$_GET["tms"] = str_replace(".png","",$_GET["tms"]).".png";

if($_GET["TileMatrix"]."/".$_GET["TileCol"]."/".$_GET["TileRow"] == "0/0/0" || $_GET["TileCol"] == -1 || $_GET["TileRow"]== -1){
	return;
}
$_GET["BBOX"] = $lon1.",".$lat1.",".$lon2.",".$lat2;
$_GET["SERVICE"] = "WMS";
$_GET["REQUEST"] = "getMap";

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
//error_reporting (E_ALL);
$versao = \admin\php\funcoesAdmin\versao();
$versao = $versao["principal"];


if($_GET["SRS"] == "EPSG:900913"){
	$_GET["SRS"] = "EPSG:3857";
}
if(isset($_GET["BBOX"])){
	$_GET["BBOX"] = str_replace(" ",",",$_GET["BBOX"]);
}
$req = ms_newowsrequestobj();

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
$tema = $locaplic . "/temas/" . $_GET["tema"] . ".map";

if(!file_exists($tema)){
	echo "Erro";
	exit;
}
$req->setParameter("srsName",$req->getValueByName("SRS"));
$listaepsg = $req->getValueByName("SRS")." EPSG:4618 EPSG:4291 EPSG:4326 EPSG:22521 EPSG:22522 EPSG:22523 EPSG:22524 EPSG:22525 EPSG:29101 EPSG:29119 EPSG:29120 EPSG:29121 EPSG:29122 EPSG:29177 EPSG:29178 EPSG:29179 EPSG:29180 EPSG:29181 EPSG:29182 EPSG:29183 EPSG:29184 EPSG:29185";

$req->setParameter("VeRsIoN",$_GET["Version"]);
//
//compatibiliza chamadas fora do padrao
//
if(isset($_GET["outputFormat"]) && $_GET["outputFormat"] != ""){
	$_GET["OUTPUTFORMAT"] = $_GET["outputFormat"];
}
//essa variavel e usada para definir se a imagem final gerada devera ser cortada ou nao
$cortePixels = 0;

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
$oMap->setmetadata("ows_onlineresource",$or);
$oMap->setmetadata("wms_onlineresource",$or);
$oMap->setmetadata("wms_attribution_onlineresource",$proto.$server.dirname($_SERVER['PHP_SELF']));
$oMap->setmetadata("ows_enable_request","*");

//parametro mandatario
if($oMap->getmetadata("wms_srs") == ""){
	$oMap->setmetadata("wms_srs","EPSG:4326");
}

$e = $oMap->extent;
$extensaoMap = ($e->minx)." ".($e->miny)." ".($e->maxx)." ".($e->maxy);
//gera o mapa

$nmap = ms_newMapobj($tema);

$nmap->setmetadata("ows_enable_request","*");
$l = $nmap->getlayer(0);

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
$l->set("status",MS_DEFAULT);

ms_newLayerObj($oMap, $l);

$oMap->setSymbolSet($locaplic."/symbols/".basename($oMap->symbolsetfilename));
$oMap->setFontSet($locaplic."/symbols/".basename($oMap->fontsetfilename));

if(ob_get_contents ()){
	ob_end_clean();
}
cloneInlineSymbol($l,$nmap,$oMap);

$l = $oMap->getlayer(0);
$l->set("status",MS_DEFAULT);

$req->setParameter("LAYERS",$l->name);

if(strtolower($req->getValueByName("REQUEST")) == "getfeatureinfo"){
	$req->setParameter("LAYERS",$l->name);
	$req->setParameter("QUERY_LAYERS",$l->name);
	if(strtolower($req->getValueByName("SRS")) == "epsg:900913"){
		$req->setParameter("SRS","EPSG:3857");
		$_GET["SRS"] = "EPSG:3857";
	}
}

ms_ioinstallstdouttobuffer();
$req->setParameter("format","image/png");
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
function autoClasses(&$nlayer, $mapa, $locaplic = null) {
	$postgis_mapa = $_SESSION ["postgis_mapa"];
	;
	$substituicon = "nao";
	if ($nlayer->connectiontype == MS_POSTGIS) {
		if ($nlayer->connection == " ") {
			$nlayer->set ( "connection", $postgis_mapa );
			$substituicon = "sim";
		}
	}
	//
	// gera classes automaticamente (temas vetoriais)
	if ($nlayer->getmetadata ( "classesitem" ) != "") {
		$itemnome = $nlayer->getmetadata ( "classesnome" );
		$itemid = $nlayer->getmetadata ( "classesitem" );
		$itemcor = $nlayer->getmetadata ( "classescor" );
		$itemsimbolo = $nlayer->getmetadata ( "classesimbolo" );
		$itemtamanho = $nlayer->getmetadata ( "classestamanho" );
		$classeoriginal = $nlayer->getclass ( 0 );
		//
		// pega a extensao geografica que devera ser utilizada
		//
		$prjMapa = $mapa->getProjection ();
		$prjTema = $nlayer->getProjection ();
		$ret = $nlayer->getmetadata ( "extensao" );
		if ($ret == "") {
			$ret = $nlayer->getextent ();
			// reprojeta o retangulo
			if (($prjTema != "") && ($prjMapa != $prjTema)) {
				$projInObj = ms_newprojectionobj ( $prjTema );
				$projOutObj = ms_newprojectionobj ( $prjMapa );
				$ret->project ( $projInObj, $projOutObj );
			}
		} else {
			$temp = explode ( " ", $ret );
			$ret = ms_newRectObj ();
			$ret->setextent ( $temp [0], $temp [1], $temp [2], $temp [3] );
		}
		//
		$sopen = $nlayer->open ();
		if ($sopen == MS_FAILURE) {
			return "erro";
		}

		$status = $nlayer->whichShapes ( $ret );
		$parametrosClasses = array ();
		if ($status == 0) {
			while ( $shape = $nlayer->nextShape () ) {
				$id = trim ( $shape->values [$itemid] );
				if (! $parametrosClasses [$id]) {
					$nome = "";
					if ($itemnome != "")
						$nome = trim ( $shape->values [$itemnome] );
						$cor = "";
						if ($itemcor != "")
							$cor = explode ( ",", trim ( $shape->values [$itemcor] ) );
							if (count ( $cor ) != 3)
								$cor = explode ( " ", trim ( $shape->values [$itemcor] ) );
								$tamanho = "";
								if ($itemtamanho != "")
									$tamanho = trim ( $shape->values [$itemtamanho] );
									$simbolo = "";
									if ($itemsimbolo != "")
										$simbolo = trim ( $shape->values [$itemsimbolo] );
										$parametrosClasses [$id] = array (
												"nome" => $nome,
												"cor" => $cor,
												"tamanho" => $tamanho,
												"simbolo" => $simbolo
										);
				}
			}
			$fechou = $nlayer->close ();
			// echo "<pre>";var_dump($parametrosClasses);
			if (count ( $parametrosClasses ) > 0) {
				$ids = array_keys ( $parametrosClasses );
				for($i = 0; $i < count ( $parametrosClasses ); ++ $i) {
					$p = $parametrosClasses [$ids [$i]];
					// echo "<pre>";var_dump($p);
					$nclasse = ms_newClassObj ( $nlayer, $classeoriginal );
					if ($p ["nome"] != "")
						$nclasse->set ( "name", $p ["nome"] );
						$estilo = $nclasse->getstyle ( 0 );
						if ($p ["cor"] != "") {
							$cor = $p ["cor"];
							$ncor = $estilo->color;
							if ($ncor == "")
								$ncor = $estilo->outlinecolor;
								$ncor->setrgb ( $cor [0], $cor [1], $cor [2] );
						}
						if ($p ["tamanho"] != "")
							$estilo->set ( "size", $p ["tamanho"] );
							if ($p ["simbolo"] != "")
								$estilo->set ( "symbolname", $p ["simbolo"] );
								$strE = "('[" . $itemid . "]'eq'" . $ids [$i] . "')";
								$nclasse->setexpression ( $strE );
				}
				$classeoriginal->set ( "status", MS_DELETE );
			}
		}
		if ($substituicon == "sim") {
			$nlayer->set ( "connection", " " );
		}
	}
	$pf = $nlayer->getmetadata ( "palletefile" );
	if ($pf != "") {
		if (! file_exists ( $pf )) {
			return;
		}
		$ps = $nlayer->getmetadata ( "palletesteps" );
		if ($ps == "")
			$ps = 8;
			//
			// pega os valores do arquivo
			//
			$rules = array ();
			$abre = fopen ( $pf, "r" );
			$paletteRules = array ();
			while ( ! feof ( $abre ) ) {
				$line = trim ( fgets ( $abre ) );
				$pos = strpos ( $line, "#" );
				if ($pos === false || $pos > 0) {
					$paletteEntry = explode ( " ", $line );
					$rules [] = array (
							"v0" => $paletteEntry [0],
							"v1" => $paletteEntry [1],
							"r0" => $paletteEntry [2],
							"g0" => $paletteEntry [3],
							"b0" => $paletteEntry [4],
							"r1" => $paletteEntry [5],
							"g1" => $paletteEntry [6],
							"b1" => $paletteEntry [7]
					);
				}
			}
			fclose ( $abre );
			foreach ( $rules as $rule ) {
				$delta = ceil ( ($rule ["v1"] - $rule ["v0"]) / $ps );
				$legenda = true;
				for($value = $rule ["v0"]; $value < $rule ["v1"]; $value += $delta) {
					$class = ms_newClassObj ( $nlayer );
					$style = ms_newStyleObj ( $class );
					if ($legenda) {
						$class->set ( name, round ( $value, 0 ) );
						$legenda = true;
					}
					$expression = "([pixel] > " . round ( $value, 0 ) . " AND [pixel] <= " . round ( $value + $delta, 0 ) . ")";
					$class->setExpression ( $expression );
					$rgb = getRGBpallete ( $rule, $value );
					$style->color->setRGB ( $rgb [0], $rgb [1], $rgb [2] );
				}
			}
	}
	return;
}
function getRGBpallete($rule, $value) {
	$escala = ($value - $rule ["v0"]) / ($rule ["v1"] - $rule ["v0"]);
	$r = $rule ["r0"] + round ( ($rule ["r1"] - $rule ["r0"]) * $escala, 0 );
	$g = $rule ["g0"] + round ( ($rule ["g1"] - $rule ["g0"]) * $escala, 0 );
	$b = $rule ["b0"] + round ( ($rule ["b1"] - $rule ["b0"]) * $escala, 0 );
	return array (
			$r,
			$g,
			$b
	);
}
function cloneInlineSymbol($layern, $nmapa, $mapa) {
	$numclasses = $layern->numclasses;
	for($ci = 0; $ci < $numclasses; $ci ++) {
		$classe = $layern->getclass ( $ci );
		$numestilos = $classe->numstyles;
		for($ei = 0; $ei < $numestilos; $ei ++) {
			$estilo = $classe->getstyle ( $ei );
			if ($estilo->symbolname != "") {
				$nomesimbolo = $estilo->symbolname;
				$simbolo = $nmapa->getSymbolObjectById ( $nmapa->getSymbolByName ( $nomesimbolo ) );
				if ($simbolo->inmapfile == MS_TRUE || file_exists ( $nomesimbolo )) {
					$simbolon = new symbolObj ( $mapa, $nomesimbolo );
					$simbolon->set ( "inmapfile", MS_TRUE );

					$simbolon->setImagePath ( $simbolo->imagepath );
					$simbolon->setPoints ( $simbolo->getPointsArray () );
					// $simbolon->setPattern($simbolo->getPatternArray());
					$simbolon->set ( "type", $simbolo->type );
					// $simbolon->set("antialias",$simbolo->antialias);
					$simbolon->set ( "character", $simbolo->character );
					$simbolon->set ( "filled", $simbolo->filled );

					// $simbolon->set("font",$simbolo->font);
					// $simbolon->set("position",$simbolo->position);
					$simbolon->set ( "sizex", $simbolo->sizex );
					$simbolon->set ( "sizey", $simbolo->sizey );
					$simbolon->set ( "transparent", $simbolo->transparent );
					$simbolon->set ( "transparentcolor", $simbolo->transparentcolor );
					// $simbolon->set("anchorpoint",$simbolo->anchorpoint);
				}
			}
		}
	}
}
?>
