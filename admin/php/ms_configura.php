<?php
/*
Title: ms_configura.php

Fun&ccedil;&otilde;es utilizadas pelo editor do arquivo ms_configura

ms_configura.php cont&eacute;m uma s&eacute;rie de vari&aacute;veis de configura&ccedil;&atilde;o do i3Geo.

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

i3geo/admin/php/ms_configura.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada, por exemplo, ms_configura.php?funcao=PEGAPARAMETROSCONFIGURA

Cada opera&ccedil;&atilde;o possu&iacute; seus próprios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.

*/
include_once("admin.php");
/**
 * TODO depreciar
 */
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
switch (strtoupper($funcao))
{
	/*
	Note:

	Valores que o par&acirc;metro &funcao pode receber. Os par&acirc;metros devem ser enviados na requisi&ccedil;&atilde;o em AJAX.
	*/
	/*
	Valor: PEGAPARAMETROSCONFIGURA

	Lista os valores atuais das vari&aacute;veis registradas no ms_configura

	Retorno:

	{JSON}
	*/
	case "PEGAPARAMETROSCONFIGURA":
		$vs = array(
			"\$dir_tmp",
			"\$mensagemInicia",
			"\$tituloInstituicao",
			"\$locaplic",
			"\$locmapserv",
			"\$R_path",
			"\$postgis_mapa",
			"\$utilizacgi",
			"\$expoeMapfile",
			"\$conexaoadmin",
			"\$googleApiKey",
			"\$interfacePadrao"
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
			$par[$v] = utf8_encode($s);
		}
		retornaJSON($par);
		exit;
	break;
	/*
	Valor: SALVACONFIGURA

	Salva um novo valor de uma vari&aacute;vel no ms_configura.php

	Parameters:

	variavel - nome da vari&aacute;vel

	valor - novo valor

	Retorno:

	{JSON}
	*/
	case "SALVACONFIGURA":
		salvaConfigura($variavel,$valor);
		retornaJSON("ok");
	exit;
	break;
}
/*
Salva um novo valor de uma vari&aacute;vel no ms_configura.php
*/
function salvaConfigura($variavel,$valor)
{
	//$valor = resolveAcentos($valor,"html");
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