<?php
/*
Title: carrega_ext.php

Verifica se as extensões do PHP necessárias ao I3Geo estão carregadas.
Tenta carregar as extensões que não estiverem habilitadas por default.

O ms_criamapa.php define a variável de seção $ler_extensoes indicando as que devem ser lidas.

Se a variável $ler_extensoes não estiver definida, o programa irá criar. Essa é a situação
quando o ms_criamapa.php é executado.

Caso seja necessário carregar alguma extensão adicional, basta incluir no array $extensoes

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

File: i3geo/classesphp/carrega_ext.php

19/6/2007
*/
/*
Variable: extensoes

Array com a lista de extensoes que devem ser carregadas pelo i3geo.

Outras extensoes exigidas pelo i3geo também são verificadas, como mapscript e gd.
*/
$extensoes = array("zlib","libxml","SimpleXML","dom","xml","simplexml","mbstring");
if (isset($ler_extensoes))
{
	$extensoes = explode(",",$ler_extensoes);
	$temp1 = array();
}
else
{
	$temp1 = get_loaded_extensions();
}
$ler_extensoes = array();
if (count($extensoes) > 0)
{
	foreach ($extensoes as $templ)
	{
		if (in_array( $templ, $temp1) != TRUE)
		{
			if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
			{
				@dl('php_'.$templ.'.dll');
				$ler_extensoes[] = $templ;
			}
			else
			{
				@dl('php_'.$templ.'.so');
				$ler_extensoes[] = $templ;
			}
		}
	}
	//verifica se carregou a gd se não, tenta carregar a gd2
	if (!function_exists('imagecreate'))
	{
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{
			@dl('php_gd.dll');
			$ler_extensoes[] = 'gd';
		}
		else
		{
			@dl('php_gd.so');
			$ler_extensoes[] = 'gd';
		}
	}
	if (!function_exists('imagecreate'))
	{
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{
			@dl('php_gd2.dll');
			$ler_extensoes[] = 'gd2';
		}
		else
		{
			@dl('php_gd2.so');
			$ler_extensoes[] = 'gd2';
		}
	}
	//verifica se carregou o mapscript
	if (!function_exists('ms_GetVersion'))
	{
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{
			if(!@dl('php_mapscript_48.dll'))
			{
				@dl('php_mapscript.dll');
				$ler_extensoes[] = 'mapscript';
			}
			else
			{$ler_extensoes[] = 'mapscript_48';}
		}
		else
		{
			dl('php_mapscript.so');
			$ler_extensoes[] = 'mapscript';
		}
	}
}
if((is_array($ler_extensoes)) && (count($ler_extensoes) > 0))
$ler_extensoes = implode(",",(array_unique($ler_extensoes)));
?>