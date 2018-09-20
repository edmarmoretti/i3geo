<?php
include_once(dirname(__FILE__)."/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$_SESSION["i3geoBlFerramentas"],false);
$retorno = "";
switch (strtoupper($_GET["funcao"]))
{
	case "ALTERA":
	    $map = ms_newMapObj($_SESSION["map_file"]);
		$r = $map->reference;
		$ocor = explode(",",$_GET["outlinecolor"]);
		$o = $r->outlinecolor;
		$o->setrgb($ocor[0],$ocor[1],$ocor[2]);
		$imagem = $_SESSION["locaplic"]."/imagens/".basename($_GET["image"]).".png";
		if(file_exists($imagem)){
		    $r->set("image",$imagem);
		}
		$salvo = $map->save($_SESSION["map_file"]);
		ob_clean();
		header("Content-type: application/json");
		echo json_encode(array(
		    "errorMsg" => ""
		));
		exit;
	break;
	case "GETREF":
	    $map = ms_newMapObj($_SESSION["map_file"]);
	    $r = $map->reference;
	    $retorno = array(
	        "outlinecolor" => corRGB($r->outlinecolor),
	        "image" => explode(".",basename($r->image))[0]
	    );
	    ob_clean();
	    header("Content-type: application/json");
	    echo json_encode($retorno);
	    exit;
	    break;
	case "GETREFIMG":
	    $map = ms_newMapObj($_SESSION["map_file"]);
	    $ext = explode(" ", $_GET["ext"]);
	    $extatual = $map->extent;
	    $extatual->setextent($ext[0], $ext[1], $ext[2], $ext[3]);
	    $ref = $map->reference;
	    $o = $ref->outlinecolor;
	    if ($o->red == - 1) {
	        $o->setrgb(255, 0, 0);
	    }
	    $map->preparequery();
	    $objImagem = $map->drawreferencemap();
	    $nomer = ($objImagem->imagepath) . "ref" . nomeRandomico(5) . ".png";
	    $objImagem->saveImage($nomer);
	    ob_clean();
	    header('Content-type: image/png');
	    readfile($nomer);
	    exit;
	    break;
}