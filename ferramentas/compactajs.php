<?php
/*
Title: A - Compacta js e css

Compacta os arquivos js e css utilizados pelas ferramentas do I3Geo.

Deve ser executado sempre que forem feitas alterações nos arquivos javascript e css utilizados pelas ferramentas.

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

File: i3geo/ferramentas/compactajs.php

19/7/2007

*/
//
//compacta os arquivos do i3geo
//gera um arquivo compactado para cada um
//
$s = inicia("funcoes.js");
$abre = fopen("funcoes_compacto.js", "wt");
$escreve = fwrite ($abre,$s);
$fecha = fclose ($abre);
//
//gera um único js
//
$jsfiles = array(
"funcoes_compacto.js",
"../pacotes/yui231/build/yahoo-dom-event/yahoo-dom-event.js",
"../pacotes/yui231/build/element/element-beta.js",
"../pacotes/yui231/build/button/button-beta.js",
"../pacotes/yui231/build/tabview/tabview.js",
"funcoes_compacto.js",
"../classesjs/cpaint/cpaint2.inc.compressed.js"
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
"../css/button.css",
"../css/ferramentas.css",
"../pacotes/yui231/build/container/assets/skins/sam/container.css",
"../pacotes/yui231/build/menu/assets/skins/sam/menu-skin.css"
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
$abre = fopen("../css/i3geo_ferramentas.css", "wt");
$escreve = fwrite ($abre,$buffer);
$fecha = fclose ($abre);
chmod("../css/i3geo_ferramentas.css",0777);

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