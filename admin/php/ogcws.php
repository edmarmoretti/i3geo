<?php
/*
Title: ogcws.php

Fun&ccedil;&otilde;es utilizadas pelo editor do arquivo ogcws.map

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

i3geo/admin/php/ogcws.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada, por exemplo, ms_configura.php?funcao=PEGAPARAMETROSCONFIGURA

Cada opera&ccedil;&atilde;o possu&iacute; seus próprios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.

*/
include_once(__DIR__."/login.php");
if(verificaOperacaoSessao("admin/html/ogcws") == false){
	retornaJSON("Vc nao pode realizar essa operacao.");exit;
}
//error_reporting(E_ALL);
$versao = versao();
$map_file = $locaplic."/aplicmap/ogcwsv".$versao["principal"].".map";

$mapa = ms_newMapObj($map_file);
$web = $mapa->web;
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
			"ows_abstract",
			"ows_keywordlist",
			"ows_fees",
			"ows_accessconstraints",
			"ows_contactperson",
			"ows_contactorganization",
			"ows_contactposition",
			"ows_addresstype",
			"ows_address",
			"ows_city",
			"ows_stateorprovince",
			"ows_postcode",
			"ows_country",
			"ows_contactelectronicmailaddress",
			"ows_name"
		);
		$par = array();
		foreach ($vs as $v)
		{
			$par[$v] = utf8_encode($web->metadata->get($v));
		}
		$par["mapfile"] = $map_file;
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
		$web->metadata->set($variavel,$valor);
		$mapa->save($map_file);
		retornaJSON("ok");
	exit;
	break;
}

?>