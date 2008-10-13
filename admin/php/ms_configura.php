<?php
/*
Title: Administração do ms_configura.php

Utilizado no sistema de administração do arquivo ms_configura.php

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

File: i3geo/admin/ms_configura.php

19/6/2007

*/
include_once("admin.php");
//faz a busca da função que deve ser executada
switch ($funcao)
{
	//pega os parâmetros do ms_configura
	case "pegaParametrosConfigura":
	$vs = array(
		"\$dir_tmp",
		"\$mensagemInicia",
		"\$tituloInstituicao",
		"\$locaplic",
		"\$temasdir",
		"\$temasaplic",
		"\$locmapserv",
		"\$locsistemas",
		"\$locidentifica",
		"\$locmapas",
		"\$R_path",
		"\$postgis_con",
		"\$srid_area",
		"\$postgis_mapa",
		"\$utilizacgi",
		"\$atlasxml",
		"\$expoeMapfile",
		"\$menutemas",
		"\$conexaoadmin"
	);
	$par = array();
	foreach ($vs as $v)
	{
		eval("\$s = $v;");
		if(is_array($s))
		{
			$par[$v] = $s;
		}
		else
		$par[$v] = $s;
	}
	retornaJSON($par);
	exit;
	break;
	//salva um novo valor para uma variável do ms_configura
	case "salvaConfigura":
	salvaConfigura($variavel,$valor);
	retornaJSON("ok");
	exit;
	break;
}
/*
Function: salvaConfigura

Salva um novo valor de uma variável no ms_configura.php

Parameters:

variavel - nome da variável

valor - novo valor
*/
function salvaConfigura($variavel,$valor)
{
	$handle = fopen ("../../ms_configura.php", "r");
	$linhas = array();
	while (!feof ($handle)) {
    	$buffer = fgets($handle);
    	$temp = explode("=",$buffer);
    	$temp = trim($temp[0]);
    	if ($temp == $variavel)
     	$linhas[] = $variavel." = '".$valor."';\n";
     	else
     	$linhas[] = $buffer;
	}
	fclose ($handle);
	unlink("../../ms_configura.php");
	$handle = fopen ("../../ms_configura.php", "w");
	foreach ($linhas as $linha)
	{
		fwrite($handle, $linha);
	}
	fclose($handle);
}
?>