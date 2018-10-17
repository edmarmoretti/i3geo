<?php
require __DIR__ . '/../../pacotes/composer/vendor/autoload.php';
use Defuse\Crypto\Key;
use Defuse\Crypto\File;

$_GET["g_sid"] = $_POST["g_sid"];
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
//
//o usuario deve ter entrado pelo i3Geo
//
if(empty($_SESSION["fingerprint"])){
	echo "<p class='paragrafo' >Erro ao enviar o arquivo. (1)";
	return;
}
$locaplic = $_SESSION["locaplic"];
include(dirname(__FILE__)."/../../classesphp/carrega_ext.php");

if(isset($logExec) && $logExec["upload"] == true){
	i3GeoLog("prog: carregamapa filename:" . $_FILES['i3GEOcarregamapafilemap']['name'],$dir_tmp);
}
?>
<html>
<head>
<link rel="stylesheet" type="text/css" href="../../css/input.css" />
<link rel="stylesheet" type="text/css" href="../../css/geral.css" />
<title></title>
</head>
<body bgcolor="white" style="background-color:white">
<p>
<?php
if (isset($_FILES['i3GEOcarregamapafilemap']['name']) && strlen(basename($_FILES['i3GEOcarregamapafilemap']['name'])) < 200){
	echo "<p class='paragrafo' >Carregando o arquivo...</p>";
	$dirmap = $_SESSION["dir_tmp"];
	$Arquivo = $_FILES['i3GEOcarregamapafilemap']['name'];
	$Arquivo = str_replace(".map","",$Arquivo) . md5(uniqid(rand(), true)) . "_up.map";

	$Arquivo = strip_tags($Arquivo);
	$Arquivo = htmlspecialchars($Arquivo, ENT_QUOTES);

	verificaNome($Arquivo);

	if(isset($i3geoKeys) && $i3geoKeys["salvaMapfile"] != ""){
		$status =  move_uploaded_file($_FILES['i3GEOcarregamapafilemap']['tmp_name'],$dirmap."/".$Arquivo."temp.map");
		$keyAscii = $i3geoKeys["salvaMapfile"];
		$key = Key::loadFromAsciiSafeString($keyAscii);
		$inputFilename = $dirmap."/".$Arquivo."temp.map";
		$outputFilename = $dirmap."/".$Arquivo;
		File::decryptFile($inputFilename, $outputFilename, $key);
	}
	else {
		$checkphp = fileContemString($_FILES['i3GEOcarregamapafilemap']['tmp_name'],"<?");
		if($checkphp == true){
			exit;
		}
		$checkphp = fileContemString($_FILES['i3GEOcarregamapafilemap']['tmp_name'],".php");
		if($checkphp == true){
			exit;
		}
		$status =  move_uploaded_file($_FILES['i3GEOcarregamapafilemap']['tmp_name'],$dirmap."/".$Arquivo);
	}
	if($status != 1){
		echo "<p class='paragrafo' >Ocorreu um erro no envio do arquivo";
		paraAguarde();
		exit;
	}
	if($status == 1){
	    $map_file = $_SESSION["map_file"];
	    echo "<p class='paragrafo' >Arquivo enviado. Verificando o mapa...</p>";
		$map = ms_newMapObj($map_file);
		//
		//muda o arquivo de simbolo
		//
		$s = file_get_contents($dirmap."/".$Arquivo);
		$s = "MAP\n SYMBOLSET '".$map->symbolsetfilename."'\nFONTSET '".$map->fontsetfilename."'\n" . $s;

		$handle = fopen($dirmap."/".$Arquivo, "w");
		fwrite($handle,$s);
		fclose($handle);

		$mapt = ms_newMapObj($dirmap."/".$Arquivo);
		unlink($dirmap."/".$Arquivo);
		//
		//apaga os layers do mapa atual
		//
		$numlayers = $map->numlayers;
		for ($i=0;$i < $numlayers;$i++)	{
			$layer = $map->getlayer($i);
			$layer->set("status",MS_DELETE);
		}
		$map->save($map_file);
		//
		//copia os layers do mapfile temporario para o mapfile em uso
		//
		$numlayers = $mapt->numlayers;
		for ($i=0;$i < $numlayers;$i++){
			$layert = $mapt->getlayer($i);
			$layert->setmetadata("cache","nao");
			//
			//verifica se existe o tema em i3geo/temas
			//
			$arqoriginal = "";
			if(file_exists($locaplic."/temas/".$layert->name.".map")){
				$nomeoriginal = $layert->name;
				$arqoriginal = $locaplic."/temas/".$layert->name.".map";
			} elseif (file_exists($locaplic."/temas/".$layert->getmetadata("nomeoriginal").".map")){
				$nomeoriginal = $layert->getmetadata("nomeoriginal");
				$arqoriginal = $locaplic."/temas/".$layert->getmetadata("nomeoriginal").".map";
			}
			if($arqoriginal != ""){
				//
				//o tema existe
				//
				$mapo = ms_newMapObj($arqoriginal);
				$layero = $mapo->getlayerbyname($nomeoriginal);
				$layero->setmetadata("cache","nao");
				//
				//remove as classes do layer original
				//
				$nclasses = $layero->numclasses;
				if ($nclasses > 0){
					for ($j=0; $j < $nclasses; ++$j){
						$classe = $layero->getClass($j);
						$classe->set("status",MS_DELETE);
					}
				}
				//
				//copia as classes do layer do upload para o original
				//
				$nclasses = $layert->numclasses;
				if ($nclasses > 0){
					for ($j=0; $j < $nclasses; ++$j){
						$classe = $layert->getClass($j);
						//adiciona a classe no original
						ms_newClassObj($layero, $classe);
					}
				}
				//
				//ajusta parametros que o usuario pode ter modificado
				//
				if($layert->status == 2){
					$layero->set("status",MS_DEFAULT);
				}
				else{
					$layero->set("status",MS_OFF);
				}
				if(ms_GetVersionInt() >= 7){
				    $layero->updateFromString('LAYER COMPOSITE OPACITY '.$layert->opacity.'END END');
				} else {
				    $layero->set("opacity",$layert->opacity);
				}
				$layero->setmetadata("TEMA",$layert->getmetadata("TEMA"));
				//
				//adiciona o layer ao mapa atual
				//
				ms_newLayerObj($map,$layero);
			} elseif($layert->connectiontype == MS_INLINE || $layert->connectiontype == MS_WMS || $layert->connectiontype == MS_GRATICULE){
				ms_newLayerObj($map,$layert);
			}
		}
		$map->save($map_file);
		validaAcessoTemas($map_file);
		echo "<p class='paragrafo' >Ok. redesenhando.";
		echo "<script>window.parent.i3GEO.atualiza();</script>";
		$e = $mapt->extent;
		$ext = $e->minx . " " . $e->miny . " " . $e->maxx . " " . $e->maxy;
		echo "<script>window.parent.i3GEO.navega.zoomExt('','','','".$ext."');</script>";
		echo "<script>window.parent.i3GEO.janela.tempoMsg('Mapa carregado');</script>";
	}
	else{
		echo "<p class='paragrafo' >Erro ao enviar o arquivo. (2)";
	}
}
else{
	echo "<p class='paragrafo' >Erro ao enviar o arquivo. (3)";
}
paraAguarde();
function paraAguarde(){

}
function verificaNome($nome)
{
	$nome = strtolower($nome);
	$lista = explode(".",$nome);
	$extensao = $lista[count($lista) - 1];
	if($extensao != "map")
	{
		echo "Nome de arquivo inv&aacute;lido";
		paraAguarde();
		exit;
	}
}
?>
</body>
</html>