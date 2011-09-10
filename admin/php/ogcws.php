<?php
/*
Title: ogcws.php

Funções utilizadas pelo editor do arquivo ogcws.map

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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

i3geo/admin/php/ogcws.php

Parametros:

O parâmetro principal é "funcao", que define qual operação será executada, por exemplo, ms_configura.php?funcao=PEGAPARAMETROSCONFIGURA

Cada operação possuí seus próprios parâmetros, que devem ser enviados também na requisição da operação.

*/
include_once("admin.php");
if(verificaEditores($editores) == "nao")
{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
//error_reporting(E_ALL);
$versao = versao();
$map_file = $locaplic."/aplicmap/ogcwsv".$versao["principal"].".map";

$mapa = ms_newMapObj($map_file);
$web = $mapa->web;
//faz a busca da função que deve ser executada
switch (strtoupper($funcao))
{
	/*
	Note:
	
	Valores que o parâmetro &funcao pode receber. Os parâmetros devem ser enviados na requisição em AJAX.
	*/
	/*
	Valor: PEGAPARAMETROSCONFIGURA
	
	Lista os valores atuais das variáveis registradas no ms_configura
	
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
		retornaJSON($par);
		exit;
	break;
	/*
	Valor: SALVACONFIGURA
	
	Salva um novo valor de uma variável no ms_configura.php

	Parameters:

	variavel - nome da variável

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