<?php
/*
Title: carrega_ext.php

Verifica se as extensões do PHP necessárias ao i3Geo estão carregadas, inclusive o php_mapscript.
Tenta carregar as extensões que não estiverem habilitadas diretamente na configuração do PHP.

O ms_criamapa.php define a variável de seção $ler_extensoes indicando as extensões que devem ser lidas
antes de ser utilizado o PHPMapscript.

Caso seja necessário carregar alguma extensão adicional, basta incluir no array $extensoes

Se todas as extensões forem carregadas diretamente pelo PHP, esse programa pode ser totalmente comentado 
melhorando a performance do i3geo.

Nas versões mais novas do PHP, o carregamento dinâmico de extensões
não é mais permitido, tornando esse programa inútil.

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
		//verifica se carregou a gd se não, tenta carregar a gd2
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