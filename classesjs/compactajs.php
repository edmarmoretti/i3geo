<?php
/*
Title: A - Compacta js e css

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
//compacta os arquivos do i3geo
//gera um arquivo compactado para cada um
//
$s = inicia("redesenho.js");
$abre = fopen("redesenho_compacto.js", "wt");
$escreve = fwrite ($abre,$s);
$fecha = fclose ($abre);

$s = inicia("iniciamma.js");
$abre = fopen("iniciamma_compacto.js", "wt");
$escreve = fwrite ($abre,$s);
$fecha = fclose ($abre);

$s = inicia("ferramentas.js");
$abre = fopen("ferramentas_compacto.js", "wt");
$escreve = fwrite ($abre,$s);
$fecha = fclose ($abre);

$s = inicia("funcoes.js");
$abre = fopen("funcoes_compacto.js", "wt");
$escreve = fwrite ($abre,$s);
$fecha = fclose ($abre);

$s = inicia("menususpenso.js");
$abre = fopen("menususpenso_compacto.js", "wt");
$escreve = fwrite ($abre,$s);
$fecha = fclose ($abre);

//
//gera um único js
//
$jsfiles = array(
"../pacotes/yui/build/yahoo/yahoo-min.js",
"../pacotes/yui/build/event/event-min.js",
"../pacotes/yui/build/dom/dom-min.js",
"../pacotes/yui/build/container/container_core-min.js",
"../pacotes/yui/build/menu/menu-min.js",
"../pacotes/yui/build/dragdrop/dragdrop-min.js",
"../pacotes/yui/build/animation/animation-min.js",
"../pacotes/yui/build/container/container-min.js",
"../pacotes/yui/build/logger/logger-min.js",
"../pacotes/yui/build/slider/slider-min.js",
"../pacotes/yui/build/container/ResizePanel.js",
"cpaint/cpaint2.inc.compressed.js",
"jsobjects/jsUI-Global/common.js",
"jsobjects/jsUI-Global/uiCommon.js",
"jsobjects/jsUI-Treeview/component.js",
"funcoes_compacto.js",
"ferramentas_compacto.js",
"redesenho_compacto.js",
"iniciamma_compacto.js",
"menususpenso_compacto.js"
);
$buffer = "\$i = function(id){return document.getElementById(id);}\n";

//junta todos os js em um unico
foreach ($jsfiles as $f)
{
	$abre = fopen($f, "r");
	while (!feof($abre))
	{$buffer .= fgets($abre);}
	fclose($abre);
	$buffer .= "\n";
}
$abre = fopen("i3geo_tudo_compacto.js", "wt");
$escreve = fwrite ($abre,$buffer);
$fecha = fclose ($abre);
chmod("i3geo_tudo_compacto.js",0777);
//
//gera um único css
//
$cssfiles = array(
"../css/geral.css",
"../css/botoes.css",
"../css/documentation.css",
"../css/fonts-min.css",
"../css/container-min.css",
"../css/reset-min.css",
"../css/grids-min.css",
"../css/menu-min.css",
"jsobjects/jsUI-Treeview/default.css"
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
$abre = fopen("../css/i3geo.css", "wt");
$escreve = fwrite ($abre,$buffer);
$fecha = fclose ($abre);
chmod("../css/i3geo.css",0777);

function inicia($arquivo)
{
	$abre = fopen($arquivo, "r");//../classesjs/ferramentas.js
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
?>