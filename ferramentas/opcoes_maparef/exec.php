<?php
include_once(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
	case "ALTERA":
	    copiaSeguranca($map_file);
		$map = ms_newMapObj($map_file);
		$r = $map->reference;
		//$r->updateFromString("REFERENCE SIZE " . $_POST["width"] . " " . $_POST["height"] . " END");
		$ocor = explode(",",$_POST["outlinecolor"]);
		$o = $r->outlinecolor;
		$o->setrgb($ocor[0],$ocor[1],$ocor[2]);
		$imagem = $locaplic."/imagens/".basename($_POST["image"]).".png";
		if(file_exists($imagem)){
		    $r->set("image",$imagem);
		}
		$salvo = $map->save($map_file);
		$retorno = "ok";
		$_SESSION["contadorsalva"]++;
	break;
	case "GETREF":
	    $map = ms_newMapObj($map_file);
	    $r = $map->reference;
	    $retorno = array(
	        "outlinecolor" => corRGB($r->outlinecolor)
	    );
	    break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);
?>