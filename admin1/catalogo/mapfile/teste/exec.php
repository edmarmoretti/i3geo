<?php
/*
 * Licenca:
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Edmar Moretti
 * Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
 * e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
 * GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
 * por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
 * de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
 * Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
 * Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a
 * Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
error_reporting ( 0 );
//
// pega as variaveis passadas com get ou post
//

include_once (dirname ( __FILE__ ) . "/../../../../admin/php/login.php");
if (verificaOperacaoSessao ( "admin/html/editormapfile" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}

include (dirname ( __FILE__ ) . "/../../../../admin/php/conexao.php");

$codigo = str_replace(" ","",$_POST["codigo"]);
if(empty($codigo)){
	header ( "HTTP/1.1 500 erro parametro invalido" );
	exit ();
}
$tema = $locaplic."/temas/".$codigo.".map";
if(!file_exists($tema)){
	header ( "HTTP/1.1 500 erro mapfile nao encontrado" );
	exit ();
}
$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "TESTAIMG" :
		//include($locaplic . "/classesphp/funcoes_gerais.php");
		$versao = versao();
		$versao = $versao["principal"];
		ms_ResetErrorList();
		$tempo = microtime(true);
		$retorno = verifica($tema);
		retornaJSON ( $retorno );
		break;
}
function verifica($tema){
	global $locaplic,$postgis_mapa,$versao,$base,$dir_tmp,$tempo;

	if($base == "" or !isset($base)){
		$base = "";
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
			$base = $locaplic."/aplicmap/geral1windowsv".$versao.".map";
		}
		else{
			if($base == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
				$base = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
			}
			if($base == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
				$base = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
			}
			if($base == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
				$base = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
			}
			if($base == ""){
				$base = $locaplic."/aplicmap/geral1v".$versao.".map";
			}
		}
	}
	else{
		if(!file_exists($base)){
			$base = $locaplic."/aplicmap/".$base;
		}
	}
	//echo $base;exit;
	$mapa = ms_newMapObj($base);
	error_reporting(0);
	ms_ResetErrorList();

	try {
		ms_newMapObj ( $tema );
	} catch ( Exception $e ) {
		return array("imgMapa"=>"","imgLegenda"=>"","tempo"=> (microtime(true) - $tempo),"erro"=>"Objeto map nao pode ser criado. Erro fatal.");
	}


	if(@ms_newMapObj($tema)){
		$nmapa = ms_newMapObj($tema);
	}
	else{
		$erro = "";
		$error = ms_GetErrorObj();
		while($error && $error->code != MS_NOERR){
			$erro .= "<br>Error in %s: %s<br>\n";
			$erro .= "<br>".$error->routine;
			$erro .= "<br>".$error->message;
			$error = $error->next();
		}
		return array("imgMapa"=>"","imgLegenda"=>"","tempo"=> (microtime(true) - $tempo),"erro"=>$erro);
	}
	restauraConObj($mapa,$postgis_mapa);
	restauraConObj($nmapa,$postgis_mapa);

	$numlayers = $nmapa->numlayers;
	$dados = "";
	$simbolos = array();
	for ($i=0;$i < $numlayers;$i++){
		$layern = $nmapa->getlayer($i);
		$layern->set("status",MS_DEFAULT);
		autoClasses($layern,$nmapa);
		error_reporting(0);
		if($layern->classitem != "" && $layern->connectiontype == 7 && $layern->numclasses > 0 && $layern->getmetadata("wms_sld_body") == ""){
			$tipotemp = $layern->type;
			$tiporep = $layern->getmetadata("tipooriginal");
			$layern->set("type",MS_LAYER_POLYGON);
			if ($tiporep == "linear"){
				$layern->set("type",MS_LAYER_LINE);
			}
			if ($tiporep == "pontual"){
				$layern->set("type",MS_LAYER_POINT);
			}
			$sld = $layern->generateSLD();
			if($sld != ""){
				$layern->setmetadata("wms_sld_body",str_replace('"',"'",$sld));
			}
			$layern->set("type",$tipotemp);
		}
		//pega simbolos locais e aplica no novo mapa
		cloneInlineSymbol($layern,$nmapa,$mapa);

		$layerAdicionado = ms_newLayerObj($mapa, $layern);

		corrigeLayerGrid($layern,$layerAdicionado);
		$pegarext = $layern->name;
	}
	zoomTema($pegarext,$mapa);
	$mapa->setsize(500,500);
	$sca = $mapa->scalebar;
	$sca->set("status",MS_OFF);
	$objImagem = @$mapa->draw();
	//corrige o titulo da legenda
	$numlayers = $mapa->numlayers;
	for ($j=0;$j < $numlayers;$j++){
		$l = $mapa->getlayer($j);
		if($l->type != 3 && $l->type != 4){
			$nclass = $l->numclasses;
			for($i=0;$i<$nclass;$i++){
				$classe = $l->getclass($i);
				if($classe->title === ""){
					$classe->title = $classe->name;
				}
			}
		}
	}
	$objImagemLegenda = @$mapa->drawLegend();
	if (!$objImagem){
		$error = "";
		$erro = "";
		$error = ms_GetErrorObj();
		while($error && $error->code != MS_NOERR){
			$erro .=  "<br>Error in %s: %s<br>";
			$erro .= "<br>" . $error->routine;
			$erro .= "<br>" . $error->message;
			$error = $error->next();
		}
		return array("imgMapa"=>"","imgLegenda"=>"","tempo"=> (microtime(true) - $tempo),"erro"=>$erro);
	}
	if($objImagem->imagepath == ""){
		return array("imgMapa"=>"","imgLegenda"=>"","tempo"=> (microtime(true) - $tempo),"erro"=>"Erro IMAGEPATH vazio");
	}
	$nomec = ($objImagem->imagepath).nomeRandomico()."teste.png";
	$objImagem->saveImage($nomec);

	$nomel = ($objImagemLegenda->imagepath).nomeRandomico()."testel.png";
	$objImagemLegenda->saveImage($nomel);

	$erro = "";
	$error = "";
	$error = ms_GetErrorObj();
	while($error && $error->code != MS_NOERR){
		$erro .= "<br>Error in %s: %s<br>";
		$erro .= "<br>" . $error->routine;
		$erro .= "<br>" . $error->message;
		$error = $error->next();
	}
	return array("imgMapa"=>($objImagem->imageurl).basename($nomec),"imgLegenda"=>($objImagemLegenda->imageurl).basename($nomel),"tempo"=> (microtime(true) - $tempo),"erro"=>$erro);
}
function zoomTema($nomelayer,&$mapa){
	$layer = $mapa->getlayerbyname($nomelayer);
	if($layer->data == "" && $layer->connection == "")
	{return;}
	$prjMapa = $mapa->getProjection();
	$prjTema = $layer->getProjection();
	$extatual = $mapa->extent;
	$ret = $layer->getmetadata("extensao");
	if($layer->type > 2 && $ret == "")
	{return;}
	$ct = $layer->connectiontype;
	if(($ret == "") && ($ct != 1))
	{return;}
	if ($ret == ""){
		$ret = $layer->getextent();
		//reprojeta o retangulo
		if (($prjTema != "") && ($prjMapa != $prjTema)){
			$projInObj = ms_newprojectionobj($prjTema);
			$projOutObj = ms_newprojectionobj($prjMapa);
			$ret->project($projInObj, $projOutObj);
		}
		$extatual->setextent($ret->minx,$ret->miny,$ret->maxx,$ret->maxy);
	}
	else{
		$ret = explode(" ",$ret);
		$extatual->setextent($ret[0],$ret[1],$ret[2],$ret[3]);
	}
}

?>
