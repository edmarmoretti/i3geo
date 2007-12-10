<?php
/*
Title: Compacta js e css para a interface zerocal

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

File: compactajs.php

19/7/2007

*/
//
//compacta os arquivos do richdraw
//
//
//compacta os arquivos do i3geo
//gera um arquivo compactado para cada um
//
packer("configura.js","configura_compacto.js","High ASCII");
packer("redesenho.js","redesenho_compacto.js","High ASCII");
packer("iniciamma.js","iniciamma_compacto.js","High ASCII");
packer("ferramentas.js","ferramentas_compacto.js","High ASCII");
packer("funcoes.js","funcoes_compacto.js","High ASCII");
//
//gera um único js para a inicialização do I3Geo
//
$jsfiles = array(
"funcoes_compacto.js",
"configura_compacto.js",
"ferramentas_compacto.js",
"redesenho_compacto.js",
"iniciamma_compacto.js",
"../cpaint/cpaint2.inc.compressed.js",
"../jsobjects/jsUI-Global/common.js",
"../jsobjects/jsUI-Global/uiCommon.js",
"../jsobjects/jsUI-Treeview/component.js",
"../../pacotes/yui231/build/yahoo/yahoo-min_packer.js",
"../../pacotes/yui231/build/yahoo-dom-event/yahoo-dom-event_packer.js",
"../../pacotes/yui231/build/dom/dom-min.js",
"../../pacotes/yui231/build/container/container_core-min.js",
"../../pacotes/yui231/build/logger/logger-min.js",
"../../pacotes/yui231/build/dragdrop/dragdrop-min.js",
"../../pacotes/yui231/build/container/container-min.js",
"../../pacotes/yui231/build/tabview/tabview.js",
"../../pacotes/yui231/build/utilities/utilities_packer.js"
);
$buffer = "\$i = function(id){return document.getElementById(id);};\n";
salvatudojs($jsfiles,$buffer,"i3geo_tudo_compacto.js","js");

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
	require_once '../packer/class.JavaScriptPacker.php';
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
		echo $f."<br>";
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