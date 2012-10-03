<?php
/*
Title: carrega_ext.php

Verifica se as extens&otilde;es do PHP necess&aacute;rias ao i3Geo est&atilde;o carregadas, inclusive o php_mapscript.
Tenta carregar as extens&otilde;es que n&atilde;o estiverem habilitadas diretamente na configura&ccedil;&atilde;o do PHP.

O ms_criamapa.php define a vari&aacute;vel de se&ccedil;&atilde;o $ler_extensoes indicando as extens&otilde;es que devem ser lidas
antes de ser utilizado o PHPMapscript.

Caso seja necess&aacute;rio carregar alguma extens&atilde;o adicional, basta incluir no array $extensoes

Se todas as extens&otilde;es forem carregadas diretamente pelo PHP, esse programa pode ser totalmente comentado 
melhorando a performance do i3geo.

Nas vers&otilde;es mais novas do PHP, o carregamento din&acirc;mico de extens&otilde;es
n&atilde;o &eacute; mais permitido, tornando esse programa in&uacute;til.

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/carrega_ext.php
*/
if(function_exists("dl")){
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
		$s = PHP_SHLIB_SUFFIX;
		foreach ($extensoes as $templ)
		{
			if (in_array( $templ, $temp1) != TRUE)
			{
				@dl( 'php_'.$templ.".".$s );
				$ler_extensoes[] = $templ;
			}
		}
		//verifica se carregou a gd se n&atilde;o, tenta carregar a gd2
		if (!function_exists('imagecreate'))
		{
			@dl( 'php_gd.'.$s );
			$ler_extensoes[] = 'gd';
		}
		if (!function_exists('imagecreate'))
		{
			@dl( 'php_gd2.'.$s );
			$ler_extensoes[] = 'gd2';
		}
		//verifica se carregou o mapscript
		if (!function_exists('ms_GetVersion'))
		{
			@dl( 'php_mapscript.'.$s );
			$ler_extensoes[] = 'php_mapscript';	
		}
	}
	if((is_array($ler_extensoes)) && (count($ler_extensoes) > 0))
	$ler_extensoes = implode(",",(array_unique($ler_extensoes)));
}
else
{$ler_extensoes = "";}
?>