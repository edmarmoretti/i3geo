<?php
/*
Title: compactajs.js

Compacta os arquivos js e css utilizados pelo I3Geo.

Deve ser executado sempre que forem feitas alterações nos arquivos javascript existentes em classesjs ou nos arquivos de estilo existentes em css.

About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

File: i3geo/classesjs/compactajs.php

19/7/2007

*/
//
//compacta os arquivos do richdraw
//
packer("../pacotes/richdraw/richdraw.js","../pacotes/richdraw/richdraw_compacto.js","Normal");
packer("../pacotes/richdraw/svgrenderer.js","../pacotes/richdraw/svgrenderer_compacto.js","Normal");
packer("../pacotes/richdraw/vmlrenderer.js","../pacotes/richdraw/vmlrenderer_compacto.js","Normal");
$s = inicia("../pacotes/richdraw/prototype.js");
$abre = fopen("../pacotes/richdraw/prototype_compacto.js", "wt");
$escreve = fwrite ($abre,$s);
$fecha = fclose ($abre);
$jsfiles = array(
"../pacotes/richdraw/richdraw_compacto.js",
"../pacotes/richdraw/svgrenderer_compacto.js",
"../pacotes/richdraw/vmlrenderer_compacto.js"
);
$buffer = "";
salvatudojs($jsfiles,$buffer,"../pacotes/richdraw/richdraw_tudo_compacto.js","js");
//
//compacta os arquivos do i3geo
//gera um arquivo compactado para cada um
//
packer("configura.js","compactados/configura_compacto.js","Normal");
packer("redesenho.js","compactados/redesenho_compacto.js","Normal");
packer("iniciamma.js","compactados/iniciamma_compacto.js","Normal");
packer("ferramentas.js","compactados/ferramentas_compacto.js","Normal");
packer("funcoes.js","compactados/funcoes_compacto.js","Normal");
packer("menususpenso.js","compactados/menususpenso_compacto.js","Normal");
packer("../pacotes/jsobjects/jsUI-Treeview/component_i3geo.js","../pacotes/jsobjects/jsUI-Treeview/component_compacto.js","Normal");
packer("../pacotes/jsobjects/jsUI-Global/uiCommon.js","../pacotes/jsobjects/jsUI-Global/uiCommon_compacto.js","Normal");
packer("../pacotes/jsobjects/jsUI-Global/common.js","../pacotes/jsobjects/jsUI-Global/common_compacto.js","Normal");
packer("../pacotes/yui231/build/yahoo/yahoo-min.js","../pacotes/yui231/build/yahoo/yahoo-min_packer.js","Normal");
packer("../pacotes/yui231/build/yahoo-dom-event/yahoo-dom-event.js","../pacotes/yui231/build/yahoo-dom-event/yahoo-dom-event_packer.js","None");
packer("../pacotes/yui231/build/utilities/utilities.js","../pacotes/yui231/build/utilities/utilities_packer.js");
//
//gera um único js para a inicialização do I3Geo
//
$jsfiles = array(
"../pacotes/yui231/build/yahoo/yahoo-min_packer.js",
"../pacotes/yui231/build/yahoo-dom-event/yahoo-dom-event_packer.js",
"../pacotes/yui231/build/dom/dom-min.js",
"../pacotes/yui231/build/container/container_core-min.js",
"../pacotes/yui252/build/menu/menu-min.js",
"../pacotes/yui231/build/logger/logger-min.js",
"../pacotes/yui231/build/dragdrop/dragdrop-min.js",
"../pacotes/yui231/build/slider/slider-min.js",
"../pacotes/yui231/build/animation/animation-min.js",
"../pacotes/yui231/build/container/container-min.js",
"../pacotes/yui231/build/element/element-beta-min.js",
"../pacotes/yui252/build/tabview/tabview-min.js",
"../pacotes/yui231/build/utilities/utilities_packer.js",
"../pacotes/yui231/build/autocomplete/autocomplete-min.js",
"../pacotes/cpaint/cpaint2.inc.compressed.js",
"../pacotes/jsobjects/jsUI-Global/common_compacto.js",
"../pacotes/jsobjects/jsUI-Global/uiCommon_compacto.js",
"../pacotes/jsobjects/jsUI-Treeview/component_compacto.js",
"../pacotes/richdraw/richdraw_tudo_compacto.js",
"compactados/funcoes_compacto.js",
"compactados/configura_compacto.js",
"compactados/ferramentas_compacto.js",
"compactados/redesenho_compacto.js",
"compactados/iniciamma_compacto.js",
"compactados/menususpenso_compacto.js"
);
$buffer .= "\$i = function(id){return document.getElementById(id);};\n";
salvatudojs($jsfiles,$buffer,"i3geo_tudo_compacto.js","js");
//
//gera um único css
//
$cssfiles = array(
"../css/geral.css",
"../css/botoes.css",
"../css/documentation.css",
"../pacotes/yui252/build/fonts/fonts-min.css",
"../pacotes/yui252/build/reset-fonts-grids/reset-fonts-grids.css",
"../pacotes/yui252/build/grids/grids-min.css",
"../pacotes/yui252/build/menu/assets/skins/sam/menu.css",
"../pacotes/yui231/build/autocomplete/assets/skins/sam/autocomplete.css",
"../pacotes/yui231/build/container/assets/skins/sam/container.css",
"../pacotes/yui252/build/tabview/assets/skins/sam/tabview.css",
"../pacotes/jsobjects/jsUI-Treeview/default.css",
"../css/corrigeyui_geral.css",
);
$buffer = "";
salvatudojs($cssfiles,$buffer,"../css/i3geo.css","css");

//
//compacta o ferramentas/funcoes.js
//
$s = inicia("../ferramentas/funcoes.js");
$abre = fopen("../ferramentas/funcoes_compacto.js", "wt");
$escreve = fwrite ($abre,$s);
$fecha = fclose ($abre);
$jsfiles = array(
"../ferramentas/funcoes_compacto.js",
"../pacotes/yui231/build/yahoo-dom-event/yahoo-dom-event.js",
"../pacotes/yui231/build/element/element-beta.js",
"../pacotes/yui231/build/button/button-beta.js",
"../pacotes/yui231/build/tabview/tabview.js",
"../pacotes/yui231/build/animation/animation-min.js",
"../pacotes/yui231/build/autocomplete/autocomplete-min.js",
"../pacotes/cpaint/cpaint2.inc.compressed.js"
);
$buffer = "\$i = function(id){return document.getElementById(id);}\n";
salvatudojs($jsfiles,$buffer,"../ferramentas/i3geo_tudo_compacto.js","js");

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
	//packer
	//$src = 'temp.js';
	//$out = 'i3geo_tudo_compacto.js';
	require_once '../pacotes/packer/class.JavaScriptPacker.php';
	$script = file_get_contents($src);
	$t1 = microtime(true);
	$packer = new JavaScriptPacker($script, $tipo, true, false);
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
	foreach ($jsfiles as $f)
	{
		echo $f;
		$abre = fopen($f, "r");
		while (!feof($abre))
		{$buffer .= fgets($abre);}
		fclose($abre);
		$buffer .= "\n";
	}
	$abre = fopen($final, "wt");
	$escreve = fwrite ($abre,$buffer);
	$fecha = fclose ($abre);
	chmod($final,0777);
	//gzip
	$abre = fopen($final, "r");
	if ($tipo == "js")
	$buffer = "<?php if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header(\"Content-type: text/javascript\"); ?>";
	else
	$buffer = "<?php if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header(\"Content-type: text/css\"); ?>";

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