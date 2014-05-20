<?php
/*
Compacta os arquivos js e css utilizados pelo I3Geo.

Deve ser executado sempre que forem feitas altera&ccedil;&otilde;es nos arquivos javascript existentes em classesjs ou nos arquivos de estilo existentes em css.

Licen&ccedil;a:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUACAO A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesjs/compactajs.php

*/
//
//
$locaplic = dirname(__FILE__)."/..";
include_once(dirname(__FILE__)."/../admin/php/admin.php");
include_once(dirname(__FILE__)."/../admin/php/conexao.php");

if(empty($_POST["senha"]) || empty($_POST["usuario"])){
	formularioLoginMaster("compactajs.php");
	exit;
}
else{
	$continua = verificaMaster($_POST["usuario"],$_POST["senha"],$i3geomaster);
	if($continua == false){
		echo "Usu&aacute;rio n&atilde;o registrado em i3geo/ms_configura.php na vari&aacute;vel i3geomaster";
		exit;
	}
}
$f = @fopen("../classesjs/teste.txt",w);
@fclose($f);
if (!file_exists("../classesjs/teste.txt")){
	echo "<span style='color:red'>N&atilde;o foi possivel escrever em classesjs";exit;
}
$f = @fopen("../css/teste.txt",w);
@fclose($f);
if (!file_exists("../css/teste.txt")){
	echo "<br><span style='color:red'>N&atilde;o foi possivel escrever em css";exit;
}
$f = @fopen("../pacotes/teste.txt",w);
@fclose($f);
if (!file_exists("../pacotes/teste.txt")){
	echo "<br><span style='color:red'>N&atilde;o foi possivel escrever em pacotes";exit;
}
$f = @fopen("../mashups/teste.txt",w);
@fclose($f);
if (!file_exists("../mashups/teste.txt")){
	echo "<br><span style='color:red'>N&atilde;o foi possivel escrever em mashups";exit;
}
echo "<pre>";
//
//compacta os arquivos do i3geo
//gera um arquivo compactado para cada um
//
packer("../pacotes/mobileesp/mdetect.js","../pacotes/mobileesp/mdetect_compacto.js","None");
packer("classe_marcador.js","compactados/classe_marcador_compacto.js","Normal");
packer("classe_login.js","compactados/classe_login_compacto.js","Normal");
packer("classe_arvoredecamadas.js","compactados/classe_arvoredecamadas_compacto.js","Normal");
packer("classe_arvoredetemas.js","compactados/classe_arvoredetemas_compacto.js","Normal");
packer("classe_util.js","compactados/classe_util_compacto.js","Normal");
packer("classe_calculo.js","compactados/classe_calculo_compacto.js","Normal");
packer("classe_maparef.js","compactados/classe_maparef_compacto.js","Normal");
packer("classe_janela.js","compactados/classe_janela_compacto.js","Normal");
packer("dicionario.js","compactados/dicionario_compacto.js","Normal");
packer("classe_idioma.js","compactados/classe_idioma_compacto.js","Normal");
packer("classe_ajuda.js","compactados/classe_ajuda_compacto.js","Normal");
packer("classe_configura.js","compactados/classe_configura_compacto.js","Normal");
packer("classe_navega.js","compactados/classe_navega_compacto.js","Normal");
packer("classe_coordenadas.js","compactados/classe_coordenadas_compacto.js","Normal");
packer("classe_gadgets.js","compactados/classe_gadgets_compacto.js","Normal");
packer("classe_eventos.js","compactados/classe_eventos_compacto.js","Normal");
packer("classe_barradebotoes.js","compactados/classe_barradebotoes_compacto.js","Normal");
packer("classe_guias.js","compactados/classe_guias_compacto.js","Normal");
packer("classe_selecao.js","compactados/classe_selecao_compacto.js","Normal");
packer("classe_mapa.js","compactados/classe_mapa_compacto.js","Normal");
packer("classe_desenho.js","compactados/classe_desenho_compacto.js","Normal");
packer("classe_tema.js","compactados/classe_tema_compacto.js","Normal");
packer("classe_analise.js","compactados/classe_analise_compacto.js","Normal");
packer("classe_php.js","compactados/classe_php_compacto.js","Normal");
packer("classe_interface.js","compactados/classe_interface_compacto.js","Normal");
packer("classe_i3geo.js","compactados/classe_i3geo_compacto.js","Normal");
packer("dicionario_ajuda.js","compactados/dicionario_ajuda_compacto.js","Normal");
packer("classe_social.js","compactados/classe_social_compacto.js","Normal");
packer("classe_editorol.js","compactados/classe_editorol_compacto.js","Normal");
packer("classe_editorgm.js","compactados/classe_editorgm_compacto.js","Normal");
//packer("../ferramentas/funcoes.js","../ferramentas/funcoes_compacto.js","Normal");
packer("../pacotes/yui290/build/container/container.js","../pacotes/yui290/build/container/container_compacto.js","Normal");
packer("../pacotes/yui290/build/container/container_core.js","../pacotes/yui290/build/container/container_core_compacto.js","Normal");
packer("../pacotes/yui290/build/utilities/utilities.js","../pacotes/yui290/build/utilities/utilities_compacto.js","Normal");
packer("../pacotes/yui290/build/treeview/treeview.js","../pacotes/yui290/build/treeview/treeview_compacto.js","Normal");
packer("../pacotes/yui290/build/carousel/carousel-min.js","../pacotes/yui290/build/carousel/carousel_compacto.js","Normal");
packer("../pacotes/yui290/build/resize/resize-min.js","../pacotes/yui290/build/resize/resize_compacto.js","Normal");
packer("../pacotes/yui290/build/progressbar/progressbar-min.js","../pacotes/yui290/build/progressbar/progressbar_compacto.js","Normal");
packer("../pacotes/cpaint/cpaint2.inc.js","../pacotes/cpaint/cpaint2_compacto.inc.js","Normal");
packer("../pacotes/balloon-tooltips/htdocs/js/balloon.config.js","../pacotes/balloon-tooltips/htdocs/js/balloon_compacto.config.js","Normal");
packer("../pacotes/balloon-tooltips/htdocs/js/balloon.js","../pacotes/balloon-tooltips/htdocs/js/balloon_compacto.js","Normal");
packer("../pacotes/base64.js","compactados/base64_compacto.js","Normal");
//packer("../pacotes/eudock/js/euDock.2.0.js","../pacotes/eudock/js/euDock.2.0_compacto.js","Normal");
//packer("../pacotes/eudock/js/euDock.Image.js","../pacotes/eudock/js/euDock.Image_compacto.js","Normal");

//
//gera um unico js para a inicializacao do I3Geo
//
$jsfiles = array(
"../pacotes/mobileesp/mdetect_compacto.js",
"../pacotes/proj4js/lib/proj4js-compressed.js",
"../pacotes/cpaint/cpaint2_compacto.inc.js",
"../pacotes/yui290/build/yahoo/yahoo-min.js",
"../pacotes/yui290/build/yahoo-dom-event/yahoo-dom-event.js",
"../pacotes/yui290/build/dom/dom-min.js",
"../pacotes/yui290/build/utilities/utilities_compacto.js",
"../pacotes/yui290/build/container/container_core_compacto.js",
"../pacotes/yui290/build/menu/menu-min.js",
"../pacotes/yui290/build/logger/logger-min.js",
"../pacotes/yui290/build/dragdrop/dragdrop-min.js",
"../pacotes/yui290/build/slider/slider-min.js",
"../pacotes/yui290/build/animation/animation-min270.js",
"../pacotes/yui290/build/container/container_compacto.js",
"../pacotes/yui290/build/element/element-min.js",
"../pacotes/yui290/build/tabview/tabview-min.js",
"../pacotes/yui290/build/treeview/treeview_compacto.js",
"../pacotes/yui290/build/button/button-min.js",
"../pacotes/yui290/build/carousel/carousel_compacto.js",
"../pacotes/yui290/build/json/json-min.js",
"../pacotes/yui290/build/storage/storage-min.js",
"../pacotes/yui290/build/resize/resize_compacto.js",
"../pacotes/yui290/build/progressbar/progressbar_compacto.js",
"../pacotes/balloon-tooltips/htdocs/js/balloon_compacto.config.js",
"../pacotes/balloon-tooltips/htdocs/js/balloon_compacto.js",
"../pacotes/wicket/wicket.js",
"compactados/classe_i3geo_compacto.js",
"compactados/classe_util_compacto.js",
"compactados/dicionario_compacto.js",
"compactados/classe_idioma_compacto.js",
"compactados/classe_php_compacto.js",
"compactados/classe_configura_compacto.js",
"compactados/classe_calculo_compacto.js",
"compactados/classe_desenho_compacto.js",
"compactados/classe_interface_compacto.js",
"compactados/classe_mapa_compacto.js",
"compactados/classe_tema_compacto.js",
"compactados/classe_analise_compacto.js",
"compactados/classe_maparef_compacto.js",
"compactados/classe_ajuda_compacto.js",
"compactados/classe_janela_compacto.js",
"compactados/classe_guias_compacto.js",
"compactados/classe_arvoredecamadas_compacto.js",
"compactados/classe_navega_compacto.js",
"compactados/classe_eventos_compacto.js",
"compactados/classe_arvoredetemas_compacto.js",
"compactados/classe_barradebotoes_compacto.js",
"compactados/classe_coordenadas_compacto.js",
"compactados/classe_gadgets_compacto.js",
"compactados/classe_social_compacto.js",
"compactados/classe_login_compacto.js",
"compactados/classe_marcador_compacto.js",
"../pacotes/eudock/js/euDock.2.0.js",
"../pacotes/eudock/js/euDock.Image.js"
);

$buffer .= "\$i = function(id){return document.getElementById(id);};\n";
salvatudojs($jsfiles,$buffer,"i3geo_tudo_compacto6.js","js");
//
//gera um unico css
//

$cssfiles = array(
"../css/geral.css",
"../css/botoes2.css",
"../css/documentation.css",
"../pacotes/yui290/build/logger/assets/skins/sam/logger.css",
"../pacotes/yui290/build/fonts/fonts-min.css",
"../pacotes/yui290/build/reset-fonts-grids/reset-fonts-grids.css",
"../pacotes/yui290/build/grids/grids-min.css",
"../pacotes/yui290/build/menu/assets/skins/sam/menu.css",
"../pacotes/yui290/build/autocomplete/assets/skins/sam/autocomplete.css",
"../pacotes/yui290/build/container/assets/skins/sam/container.css",
"../pacotes/yui290/build/tabview/assets/skins/sam/tabview.css",
"../pacotes/yui290/build/treeview/assets/skins/sam/treeview.css",
"../pacotes/yui290/build/carousel/assets/skins/sam/carousel.css",
"../pacotes/yui290/build/slider/assets/skins/sam/slider.css",
"../pacotes/yui290/build/resize/assets/skins/sam/resize.css",
"../pacotes/yui290/build/progressbar/assets/skins/sam/progressbar.css",
"../css/corrigeyui_geral.css",
"../mashups/theme/default/style.css",
"../css/janelaflutuante.css",
"../mashups/openlayers.css"
);

$buffer = "";
salvatudojs($cssfiles,$buffer,"../css/i3geo6.css","css");
//css das ferramentas
$cssfiles = array(
"../css/button.css",
"../css/ferramentas.css",
"../pacotes/yui290/build/container/assets/skins/sam/container.css",
"../pacotes/yui290/build/menu/assets/skins/sam/menu-skin.css",
"../css/tabview.css",
);
$buffer = "";
foreach ($cssfiles as $f)
{
	$abre = fopen($f, "r");
	while (!feof($abre))
	{$buffer .= fgets($abre);}
	fclose($abre);
	$buffer .= "\n";
}
$abre = fopen("../css/i3geo_ferramentas6.css", "wt");
$escreve = fwrite ($abre,$buffer);
$fecha = fclose ($abre);
chmod("../css/i3geo_ferramentas6.css",0777);
//
//compacta os codigos para o Mashup do OpenLayers
//
$jsfiles = array(
"../pacotes/yui290/build/yahoo-dom-event/yahoo-dom-event.js",
"../pacotes/yui290/build/dragdrop/dragdrop-min.js",
"../pacotes/yui290/build/container/container-min.js",
"../classesjs/compactados/classe_calculo_compacto.js",
"../classesjs/compactados/classe_util_compacto.js",
"../pacotes/openlayers/OpenLayers2131.js",
"../classesjs/compactados/classe_desenho_compacto.js",
"../classesjs/compactados/classe_editorol_compacto.js"
);
$buffer = "";
salvatudojs($jsfiles,$buffer,"../mashups/openlayers_compacto.js","js");
$jsfiles = array(
"../pacotes/yui290/build/fonts/fonts-min.css",
"../pacotes/yui290/build/container/assets/skins/sam/container.css",
"../mashups/theme/default/style.css",
"../mashups/openlayers.css",
);
$buffer = "";
salvatudojs($jsfiles,$buffer,"../mashups/openlayers_compacto.css","css");

function inicia($arquivo)
{
	$abre = fopen($arquivo, "r");
	while (!feof($abre))
	{
		$buffer = fgets($abre);
		$maparray[] = $buffer."kkkk";
	}
	fclose($abre);
	$c = compress(implode("",$maparray));
	$c = str_replace("kkkk","\n",$c);
	$c = str_replace("kkk","",$c);
	$c = str_replace(";\n",";",$c);
	$c = str_replace("{\n","{",$c);
	$c = str_replace("\n}","}",$c);
	$c = str_replace(")\n",")",$c);
	$c = str_replace(" \n","",$c);
	$c = str_replace("\n}","}\n",$c);
	return $c;
}
function compress($code)
{ // Remove multiline comment
$mlcomment = '/\/\*(?!-)[\x00-\xff]*?\*\//';
$code = preg_replace($mlcomment,"",$code);

// Remove single line comment
$slcomment = '/[^:]\/\/.*/';
$code = preg_replace($slcomment,"",$code);

// Remove extra spaces
$extra_space = '/\s+/';
$code = preg_replace($extra_space," ",$code);

// Remove spaces that can be removed
$removable_space = '/\s?([\{\};\=\(\)\\\/\+\*-])\s?/';
$code = preg_replace('/\s?([\{\};\=\(\)\/\+\*-])\s?/',"\\1",$code);
return $code;
}
function packer($src,$out,$tipo="None")
{
	if(file_exists($out))
	{unlink($out);}
	require_once dirname(__FILE__).'/../pacotes/packer/class.JavaScriptPacker.php';
	$script = file_get_contents($src);
	$script = str_replace("if(typeof(console)","//if(typeof(console)",$script);
	$t1 = microtime(true);
	$packer = new JavaScriptPacker($script, 0, true, false);
	$packed = $packer->pack();
	$t2 = microtime(true);
	$time = sprintf('%.4f', ($t2 - $t1) );
	echo 'script ', $src, ' packed in ' , $out, ', in ', $time, ' s.', "\n";
	file_put_contents($out, $packed);
	chmod($out,0777);
}
function salvatudojs($jsfiles,$buffer,$final,$tipo)
{
	//junta todos os js em um unico
	if(file_exists($final))
	{unlink($final);}
	if(file_exists($final.".php"))
	{unlink($final.".php");}

	foreach ($jsfiles as $f)
	{
		echo $f;
/*
		$abre = fopen($f, "r");
		while (!feof($abre))
		{
			$linha = fgets($abre,FILE_IGNORE_NEW_LINES);
			if($linha != "\r\n")
			$buffer .= $linha;
		}
		fclose($abre);
*/
		$linhas = file($f);
		foreach($linhas as $linha){
			$linha = trim(preg_replace('#[\r\n]#', '', $linha));
			if($linha != "")
			{$buffer .= $linha."\n";}
		}
	}

	$abre = fopen($final, "wt");
	$escreve = fwrite ($abre,$buffer);
	$fecha = fclose ($abre);


	chmod($final,0777);
	//gzip
	$abre = fopen($final, "r");
	if ($tipo == "js")
	$buffer = "<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header(\"Content-type: text/javascript\"); ?>";
	else
	$buffer = "<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header(\"Content-type: text/css\"); ?>";
	while (!feof($abre))
	{$buffer .= fgets($abre);}
	fclose($abre);
	$buffer .= "\n";
	$buffer .= "<?php if(extension_loaded('zlib')){ob_end_flush();}?>";
	$abre = fopen($final.".php", "wt");
	$escreve = fwrite ($abre,$buffer);
	$fecha = fclose ($abre);
	chmod($final.".php",0777);
}
?>
