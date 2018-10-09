<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
switch (strtoupper($_GET["funcao"]))
{
	case "ANALISEDISTRIPT":
		include(dirname(__FILE__)."/../../classesphp/classe_analise.php");
		if(!isset($_GET["tema2"])){
			$_GET["tema2"] = "";
		}
		if(!isset($_GET["limitepontos"])){
			$_GET["limitepontos"] = "";
		}
		$m = new Analise($_SESSION["map_file"],$_GET["tema"],$_SESSION["locaplic"],$_GET["ext"]);
		if(empty($_GET["item"])){
			$_GET["item"] = "";
		}
		$retorno = $m->analiseDistriPt($_SESSION["locaplic"],$_SESSION["dir_tmp"],$_SESSION["R_path"],$_GET["numclasses"],$_GET["tipo"],$_GET["cori"],$_GET["corf"],$_SESSION["tmpurl"],$_GET["sigma"],$_GET["limitepontos"],$_GET["tema2"],$_GET["extendelimite"]);
		$m->salva();
	break;
	case "VERPALETA":
	    include(dirname(__FILE__)."/../../classesphp/class.palette.php");
	    $retorno = array();
	    $cori = $_GET["cori"];
	    $corf = $_GET["corf"];
	    $numclasses = $_GET["numclasses"];
	    $cori = RGB2hex(explode(",",$cori));
	    $corf = RGB2hex(explode(",",$corf));
	    $myPalette=new palette(array($cori,$corf),($numclasses + 1));
	    foreach ($myPalette->colorRGB as $cores)
	    {
	        $retorno[] = $cores[0].",".$cores[1].",".$cores[2];
	    }
	break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);
?>