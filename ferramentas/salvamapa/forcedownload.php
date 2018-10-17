<?php
require __DIR__ . '/../../pacotes/composer/vendor/autoload.php';
use Defuse\Crypto\Crypto;
use Defuse\Crypto\Key;
use Defuse\Crypto\File;

include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
//
//o usuario deve ter entrado pelo i3Geo
//
if(empty($_SESSION["fingerprint"])){
	return;
}
$map_file = $_SESSION["map_file"];
//
//verifica se deve ser utilizado o metodo de criptografia
//
include(dirname(__FILE__)."/../../ms_configura.php");

$mapa = ms_newMapObj($map_file);
$e = explode(" ",str_replace(","," ",$_GET["ext"]));
$extatual = $mapa->extent;
$extatual->setextent($e[0],$e[1],$e[2],$e[3]);
$mapa->save($map_file);

if(isset($i3geoKeys)){
	if(	$i3geoKeys["salvaMapfile"] != "" ){
		$keyAscii = $i3geoKeys["salvaMapfile"];
		$key = Key::loadFromAsciiSafeString($keyAscii);
		/*
		 $secret_data = "teste";
		 $ciphertext = Crypto::encrypt($secret_data, $key);
		 $data = Crypto::decrypt($ciphertext, $key);
		 echo $ciphertext;
		 echo $data;
		 */
		$inputFilename = $map_file;
		$outputFilename = dirname(dirname($map_file))."/mapfile_".nomeRandomico(6).".map";
		File::encryptFile($inputFilename, $outputFilename, $key);
		//File::decryptFile($outputFilename, $outputFilename.".map", $key);
		header("Content-Type:text/plain");
		header('Content-Disposition: attachment; filename="'.basename($outputFilename).'"');
		readfile($outputFilename);
		return;
	}
}
//
//faz uma copia temporaria do mapfile
//
$arquivo = dirname(dirname($map_file))."/mapfile_".nomeRandomico(6).".map";
$mapa = ms_newMapObj($map_file);
$mapa->save($arquivo);
$mapa = ms_newMapObj($arquivo);
//
//modifica os layers
//
$c = $mapa->numlayers;
$remover = array(); //guarda os nomes dos metadados pq removeMetaData nao funciona
for ($i=0;$i < $c;++$i){
	$l = $mapa->getlayer($i);
	//
	//tratamento para layers que contem dados via base de dados
	//
	$ct = $l->connectiontype;
	if($ct != MS_INLINE && $ct != MS_WMS && $ct != MS_GRATICULE){
		$l->set("connection","");
		$l->set("data","");
		//
		//remove os metadata
		//
		$hashTable = $l->metadata;
		$key = null;
		while ($key = $hashTable->nextkey($key)){
			if(!in_array(strtolower($key),array("tema","nomeoriginal"))){
				//echo "Key: ".$key." value: ".$hashTable->get($key)."<br/>";
				$l->setmetadata($key,"");
				if($ct != MS_WMS){
					$remover[] = strtoupper($key);
				}
			}
		}
	}
}
$remover = array_unique($remover);
$mapa->save($arquivo);
$mapa = null;
removeCabecalho($arquivo,$remover);
header("Content-Type:text/plain");
header('Content-Disposition: attachment; filename="'.basename($arquivo).'"');
readfile($arquivo);

function removeCabecalho($arq,$remover){
	global $locaplic;
	//locaplic pode ser um endereco baseado no link simbolico. Por isso utiliza-se apenas o nome da pasta principal
	$pasta = basename($locaplic);
	$handle = fopen($arq, "r");
	if ($handle){
		$cabeca = array();
		$cabeca[] = "MAP\n";
		$cabeca[] = "EXTENT " . str_replace(","," ",$_GET["ext"]) . " \n";
		$grava = false;
		while (!feof($handle)){
			$linha = fgets($handle);
			if(strpos(strtoupper($linha),"SYMBOLSET") !== false){
				//$cabeca[] = '"..'.explode($pasta,$linha)[1];
			}
			if(strpos(strtoupper($linha),"FONTSET") !== false){
				//$cabeca[] = '"..'.explode($pasta,$linha)[1];
			}
			if(strtoupper(trim($linha)) == "LAYER"){
				$grava = true;
			}
			if($grava){
				$final[] = rtrim($linha, "\r\n") . PHP_EOL;
			}
		}
		fclose($handle);
	}
	$final = array_merge($cabeca,$final);
	$handle = fopen($arq, "w+");
	$testar = array("KEYIMAGE","TILEINDEX","TILEITEM","SYMBOL","LABELITEM","FILTERITEM","GROUP","ENCODING","TIP","CLASSE","ITENSDESC","CLASSESNOME","ITENSLINK","ESCALA","CLASSESSIMBOLO","MENSAGEM","EXTENSAO","CLASSESITEM","ESCONDIDO","CLASSESCOR","DOWNLOAD","CLASSESTAMANHO","ITENS","TEMA","APLICAEXTENSAO","IDENTIFICA");
	$testar = array_merge($testar,$remover);
	foreach ($final as $f){
		//
		//remove resultados em branco
		//e grava a linha
		//
		$teste = strtoupper($f);
		$teste = trim($teste);
		$teste = str_replace(" ","",$teste);
		$teste = str_replace("'","",$teste);
		$teste = str_replace('"',"",$teste);
		$teste = preg_replace('/[\n\r\t ]*/', '', $teste);
		$passou = true;
		foreach ($testar as $t)	{
			if($teste == $t){
				$passou = false;
			}
		}
		if($passou){
			fwrite($handle,$f);
		}
	}
	fclose($handle);
}
?>