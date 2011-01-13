<?php
/*
Title: Compactador de javascript

Compacta os arquivos js e css utilizados pelo I3Geo.

Deve ser executado sempre que forem feitas alterações nos arquivos javascript existentes em classesjs ou nos arquivos de estilo existentes em css.

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesjs/compactajs.php

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
packer("depreciados.js","compactados/depreciados_compacto.js","None");
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
//packer("../ferramentas/funcoes.js","../ferramentas/funcoes_compacto.js","Normal");
packer("../pacotes/yui270/build/container/container.js","../pacotes/yui270/build/container/container_compacto.js","Normal");
packer("../pacotes/yui270/build/container/container_core.js","../pacotes/yui270/build/container/container_core_compacto.js","Normal");
packer("../pacotes/yui270/build/utilities/utilities.js","../pacotes/yui270/build/utilities/utilities_compacto.js","Normal");
packer("../pacotes/yui270/build/treeview/treeview.js","../pacotes/yui270/build/treeview/treeview_compacto.js","Normal");
packer("../pacotes/yui270/build/carousel/carousel-min.js","../pacotes/yui270/build/carousel/carousel_compacto.js","Normal");
packer("../pacotes/yui270/build/resize/resize-min.js","../pacotes/yui270/build/resize/resize_compacto.js","Normal");
packer("../pacotes/cpaint/cpaint2.inc.js","../pacotes/cpaint/cpaint2_compacto.inc.js","Normal");
packer("../pacotes/balloon-tooltips/htdocs/js/balloon.config.js","../pacotes/balloon-tooltips/htdocs/js/balloon_compacto.config.js","Normal");
packer("../pacotes/balloon-tooltips/htdocs/js/balloon.js","../pacotes/balloon-tooltips/htdocs/js/balloon_compacto.js","Normal");

//
//gera um único js para a inicialização do I3Geo
//
$jsfiles = array(
"../pacotes/cpaint/cpaint2_compacto.inc.js",
"../pacotes/yui270/build/yahoo/yahoo-min.js",
"../pacotes/yui270/build/yahoo-dom-event/yahoo-dom-event.js",
"../pacotes/yui270/build/dom/dom-min.js",
"../pacotes/yui270/build/utilities/utilities_compacto.js",
"../pacotes/yui270/build/container/container_core_compacto.js",
"../pacotes/yui270/build/menu/menu-min.js",
"../pacotes/yui270/build/logger/logger-min.js",
"../pacotes/yui270/build/dragdrop/dragdrop-min.js",
"../pacotes/yui270/build/slider/slider-min.js",
"../pacotes/yui270/build/animation/animation-min.js",
"../pacotes/yui270/build/container/container_compacto.js",
"../pacotes/yui270/build/element/element-min.js",
"../pacotes/yui270/build/tabview/tabview-min.js",
"../pacotes/yui270/build/treeview/treeview_compacto.js",
"../pacotes/yui270/build/button/button-min.js",
"../pacotes/yui270/build/carousel/carousel_compacto.js",
"../pacotes/yui270/build/json/json-min.js",
"../pacotes/yui270/build/resize/resize_compacto.js",
"../pacotes/balloon-tooltips/htdocs/js/balloon_compacto.config.js",
"../pacotes/balloon-tooltips/htdocs/js/balloon_compacto.js",
"compactados/classe_i3geo_compacto.js",
"compactados/classe_util_compacto.js",
"compactados/dicionario_compacto.js",
"compactados/classe_idioma_compacto.js",
"compactados/classe_php_compacto.js",
"compactados/classe_configura_compacto.js",
"compactados/depreciados_compacto.js",
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
//"classe_eventos.js",
"compactados/classe_arvoredetemas_compacto.js",
"compactados/classe_barradebotoes_compacto.js",
"../pacotes/richdraw/richdraw_tudo_compacto.js",
"compactados/classe_gadgets_compacto.js"
);

$buffer .= "\$i = function(id){return document.getElementById(id);};\n";
salvatudojs($jsfiles,$buffer,"i3geo_tudo_compacto45.js","js");
//
//gera um único css
//

$cssfiles = array(
"../css/geral.css",
"../css/botoes2.css",
"../css/documentation.css",
"../pacotes/yui270/build/logger/assets/skins/sam/logger.css",
"../pacotes/yui270/build/fonts/fonts-min.css",
"../pacotes/yui270/build/reset-fonts-grids/reset-fonts-grids.css",
"../pacotes/yui270/build/grids/grids-min.css",
"../pacotes/yui270/build/menu/assets/skins/sam/menu.css",
"../pacotes/yui270/build/autocomplete/assets/skins/sam/autocomplete.css",
"../pacotes/yui270/build/container/assets/skins/sam/container.css",
"../pacotes/yui270/build/tabview/assets/skins/sam/tabview.css",
"../pacotes/yui270/build/treeview/assets/skins/sam/treeview.css",
"../pacotes/yui270/build/carousel/assets/skins/sam/carousel.css",
"../pacotes/yui270/build/slider/assets/skins/sam/slider.css",
"../pacotes/yui270/build/resize/assets/skins/sam/resize.css",
"../css/corrigeyui_geral.css"
); 

$buffer = "";
salvatudojs($cssfiles,$buffer,"../css/i3geo45.css","css");

//
//compacta o ferramentas/funcoes.js
//
/*
$s = inicia("../ferramentas/funcoes.js");
$abre = fopen("../ferramentas/funcoes_compacto.js", "wt");
$escreve = fwrite ($abre,$s);
$fecha = fclose ($abre);
$jsfiles = array(
"../ferramentas/funcoes_compacto.js",
"../pacotes/cpaint/cpaint2.inc.js",
"../pacotes/yui270/build/yahoo/yahoo-min.js",
"../pacotes/yui270/build/yahoo-dom-event/yahoo-dom-event.js",
"../pacotes/yui270/build/dom/dom-min.js",
"../pacotes/yui270/build/container/container_core-min.js",
"../pacotes/yui270/build/menu/menu-min.js",
"../pacotes/yui270/build/logger/logger-min.js",
"../pacotes/yui270/build/dragdrop/dragdrop-min.js",
"../pacotes/yui270/build/slider/slider-min.js",
"../pacotes/yui270/build/animation/animation-min.js",
"../pacotes/yui270/build/container/container-min.js",
"../pacotes/yui270/build/element/element-min.js",
"../pacotes/yui270/build/tabview/tabview-min.js",
"../pacotes/yui270/build/utilities/utilities.js",
"../pacotes/yui270/build/treeview/treeview.js",
"../pacotes/yui270/build/button/button-min.js",
"compactados/classe_php_compacto.js",
"compactados/classe_util_compacto.js"
);
$buffer = "\$i = function(id){return document.getElementById(id);}\n";
salvatudojs($jsfiles,$buffer,"../ferramentas/i3geo_tudo_compacto.js","js");
*/
//css das ferramentas
$cssfiles = array(
"../css/button.css",
"../css/ferramentas.css",
"../pacotes/yui270/build/container/assets/skins/sam/container.css",
"../pacotes/yui270/build/menu/assets/skins/sam/menu-skin.css",
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
$abre = fopen("../css/i3geo_ferramentas45.css", "wt");
$escreve = fwrite ($abre,$buffer);
$fecha = fclose ($abre);
chmod("../css/i3geo_ferramentas45.css",0777);


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
	foreach ($jsfiles as $f)
	{
		echo $f;
		$abre = fopen($f, "r");
		while (!feof($abre))
		{
			$linha = fgets($abre);
			$buffer .= $linha;
			//if(stristr($linha, '(console)') === FALSE)
			//{$buffer .= $linha;}
			//else
			//echo "<br>".$linha;
		}
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
	$buffer = "<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header(\"Content-type: text/javascript\"); ?>";
	else
	$buffer = "<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header(\"Content-type: text/css\"); ?>";
	while (!feof($abre))
	{$buffer .= fgets($abre);}
	fclose($abre);
	$buffer .= "\n";
	$buffer .= "<?php if(extension_loaded('zlib')){ob_end_flush();}?>";
	$abre = fopen($final.".php", "wt");
	//$buffer = str_replace("if(typeof(console)","//if(typeof(console)",$buffer);
	$escreve = fwrite ($abre,$buffer);
	$fecha = fclose ($abre);
	chmod($final.".php",0777);	
}
?>