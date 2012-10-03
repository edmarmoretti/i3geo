<?php
/*
 Title: mapfiles.php

Fun&ccedil;&otilde;es utilizadas pelo editor dos mapfiles de inicializa&ccedil;&atilde;o

&Eacute; utilizado nas fun&ccedil;&otilde;es em AJAX da interface de edi&ccedil;&atilde;o que permite alterar os mapfiles geral1.map ou geral1windows.map

O mapfile que deve ser editado &eacute; obtido por meio do programa <admin.php>

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

i3geo/admin/php/mapfiles.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada, por exemplo, mapfiles.php?funcao=PEGAPARAMETROSCONFIGURA

Cada opera&ccedil;&atilde;o possu&iacute; seus próprios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.

*/
require_once("admin.php");
/**
 * TODO incluir verificacao de login
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

	Pega os par&acirc;metros principais de configura&ccedil;&atilde;o do mapfile

	Retorno:

	{JSON}
	*/
	case "PEGAPARAMETROSCONFIGURA":
		$vs = array(
		"FONTSET ",
		"SYMBOLSET ",
		"SHAPEPATH ",
		"EXTENT ",
		"IMAGE ",
		"IMAGEPATH ",
		"IMAGEURL "
		);
		$par = array();
		foreach ($vs as $v)
		{
			$handle = fopen ($mapfile, "r");
			while (!feof ($handle)) {
				$buffer = fgets($handle);
				if(!(stristr($buffer, $v) === FALSE))
				{
					$temp = explode(trim($v),$buffer);
					if(trim($temp[0]) != "#")
					{
						$temp = trim($temp[1]);
						$par[trim($v)] = $temp;
						fclose ($handle);
						break;
					}
				}
			}
		}
		$par["mapfile"] = $mapfile;
		retornaJSON($par);
		exit;
		break;
		/*
		 Valor: SALVACONFIGURA

		Salva o valor de um par&acirc;metro no mapfile em edi&ccedil;&atilde;o

		Parametros:

		variavel

		valor

		Retorno:

		{JSON}
		*/
	case "SALVACONFIGURA":
		salvaConfigura($variavel,$valor,$mapfile,$locaplic);
		retornaJSON("ok");
		exit;
		break;
}
/*
 Salva um novo valor de uma vari&aacute;vel no ms_configura.php
*/
function salvaConfigura($variavel,$valor,$mapfile,$locaplic)
{
	$handle = fopen ($mapfile, "r");
	$linhas = array();
	$valor = str_replace("\\\"",'"',$valor);
	while (!feof ($handle)) {

		$buffer = fgets($handle);
		if(!(stristr($buffer, $variavel) === FALSE))
		{
			$temp = explode(trim($variavel),$buffer);
			if(trim($temp[0]) != "#")
			{
				$temp = trim($temp[1]);
				$par[trim($variavel)] = $temp;
				$linhas[] = $variavel." ".$valor."\n";
				$variavel = "______________";
			}
			else{$linhas[] = $buffer;
			}
		}
		else
			$linhas[] = $buffer;
	}
	fclose ($handle);
	unlink($mapfile);
	$handle = fopen ($mapfile, "w");
	foreach ($linhas as $linha)
	{
		fwrite($handle, $linha);
	}
	fclose($handle);
}

?>