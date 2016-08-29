<?php
/*
 * Gera uma miniatura de um mapfile salvo no banco de dados
 * Verifica se a imagem existe, caso contrario cria uma no diretorio temporario
 *
 * @param restauramapa - id do mapa a ser restaurado
 * @param w
 * @param h
 */
include_once (dirname(__FILE__)."/../../ms_configura.php");
include(dirname(__FILE__)."/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
include_once (dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");

if (filter_var($_GET["restauramapa"], FILTER_VALIDATE_INT) === false){
	exit;
}

$base = restauraMapaAdmin($_GET["restauramapa"],$dir_tmp);

$nomeImagem = dirname($base)."/".str_replace(".map","","restauramapa".$_GET["restauramapa"])."_miniatura.png";
//por seguranca
$nomeImagem = str_replace(".png","",$nomeImagem);
$nomeImagem = str_replace(".","",$nomeImagem).".png";

if(!file_exists($nomeImagem)){
	$mapa = ms_newMapObj($base);
	if (isset($postgis_mapa)){
		if ($postgis_mapa != ""){
			$numlayers = $mapa->numlayers;
			for ($i=0;$i < $numlayers;$i++){
				$layern = $mapa->getlayer($i);
				if (!empty($postgis_mapa)){
					if ($layern->connectiontype == MS_POSTGIS){
						$lcon = $layern->connection;
						if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa)))){
							if(($lcon == " ") || ($lcon == "")) //para efeitos de compatibilidade
							{$layern->set("connection",$postgis_mapa);
							}
							else{
								$layern->set("connection",$postgis_mapa[$lcon]);
							}
						}
					}
				}
			}
		}
	}
	$mapa->setsize($_GET["w"],$_GET["h"]);
	$sca = $mapa->scalebar;
	$sca->set("status",MS_OFF);
	$objImagemM = @$mapa->draw();
	$objImagemM->saveImage($nomeImagem);
}
ob_clean();
header('Content-Length: '.filesize($nomeImagem));
header('Content-Type: image/png');
header('Cache-Control: public, max-age=22222222');
header('Expires: ' . gmdate('D, d M Y H:i:s', time()+48*60*60) . ' GMT');
//fpassthru(fopen($nomeImagem, 'rb'));
readfile($nomeImagem);
?>