<?php
/*
Title: atlas_controle.php

Controle das requisições em Ajax feitas pela interface Atlas do i3geo

Recebe as requisições feitas em JavaScript (AJAX) e retorna o resultado para a interface.

As principais variáveis são obtidas da seção, definida na inicialização do I3Geo. Se a variável $map_file não for enviada, o retorno é uma mensagem linkquebrado e o fim do programa.

O parâmetro "funcao" define qual a operação que será executada (veja exemplo abaixo). esse parâmetro é verificado em um bloco "switch ($funcao)".

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

About: Parâmetros

funcao - opção que será executada.

Retorno:

cp - o resultado da operação será retornado em um objeto CPAINT.

Exemplo de chamada CPAINT (Ajax) do lado do cliente (javascript):

var p = "classesphp/mapa_controle.php?funcao=crialente&resolucao=1.5&g_sid="+g_sid

var cp = new cpaint()

cp.set_response_type("JSON")

cp.call(p,"lente",ajaxabrelente)

File: i3geo/classesphp/atlas_controle.php

19/6/2007

*/
error_reporting(0);
$tempo = microtime(1);
//
// quando as funções abaixo forem utilizadas, é necessário definir $map_file para que o programa continue.
//
//
//pega as variaveis passadas com get ou post
//
include_once("pega_variaveis.php");
if(isset($g_sid))
{
	session_name("i3GeoPHP");
	session_id($g_sid);
	session_start();
	foreach(array_keys($_SESSION) as $k)
	{
		eval("\$".$k."='".$_SESSION[$k]."';");
	}
	$postgis_mapa = $_SESSION["postgis_mapa"];
}
if (($funcao == "pegaListaDeAtlas") || ($funcao == "criaAtlas"))
{$map_file = "";}

if (!isset($atlasxml) || $atlasxml == "")// || !isset($editores))
{
	include_once("../ms_configura.php");
}
//
//ativa o php mapscript e as extensões necessárias
//se as extensões já estiverem carregadas no PHP, vc pode comentar essa linha para que o processamento fique mais rápido
//
include_once("carrega_ext.php");
include_once("../pacotes/cpaint/cpaint2.inc.php");

//
//cria objeto cpaint para uso com ajax
//
$cp = new cpaint();
$cp->set_data("");
//
//verifica se o usuário está tentando utilizar um link que não funciona mais
//
if (!isset($map_file))
{
	//nesse caso é necessário criar o diretório temporário e iniciar o mapa
	$cp->set_data("linkquebrado");
	$cp->return_data();
	exit;
}
include_once("classe_vermultilayer.php");
include_once("funcoes_gerais.php");
if ($map_file != "")
{
	//
	//copia o map_file atual com outro nome para restaurar caso ocorra algum problema
	//
	copiaSeguranca($map_file);
	//
	//substitui a string de conexão
	//
	substituiCon($map_file,$postgis_mapa);
}
if($atlasxml == "")
{
	include($locaplic."/admin/php/xml.php");
	$xml = simplexml_load_string(geraXmlAtlas($locaplic,$editores));
}
else
$xml = simplexml_load_file($atlasxml);
//
//faz a busca da função que deve ser executada
//
switch ($funcao)
{
/*
Property: pegaListaDeAtlas

Pega a lista de Atlas definida no arquivo xml menutemas/atlas.xml.
*/
	case "pegaListaDeAtlas":
		include_once("classe_atlas.php");
		$atl = new Atlas($xml,$atlasxml);
		$resultado = $atl->pegaListaDeAtlas($tituloInstituicao);
		$cp->set_data($resultado);
	break;
/*
Property: criaAtlas

Abre um Atlas específico, criando o mapa e chamando a interface desejada.

Esse programa é chamado diretamente, por exemplo, i3geo/classesphp/atlas_controle.php?atlasxml=&atlasId=

*/
	case "criaAtlas":
		include_once("classe_atlas.php");
		$atlasxmltemp = $atlasxml;
		$atl = new Atlas($xml,$atlasxml);
		$res = $atl->criaAtlas($atlasId_);
		$interface = $res["interface"];
		$base = $res["base"];
		if ($interface == "")
		{
			echo "Erro. Nenhuma interface definida para esse Atlas";
			exit;
		}
		if (!isset($caminho))
		{$caminho = "../";}
		//
		// a função gravaId será executada no final do processo de geração do mapa (ver ms_criamapa.php)
		//
		$executa = "gravaId";
		$temasa = "";
		include_once("../ms_criamapa.php");
		exit;
	break;
/*
Property: pegaListaDePranchas

Pega a lista de pranchas de um atlas específico.

*/
	case "pegaListaDePranchas":
		include_once("classe_atlas.php");
		$atl = new Atlas($xml,$atlasxml);
		$resultado = $atl->pegaListaDePranchas($atlasId);
		$cp->set_data($resultado);
	break;
/*
Property: abrePrancha

Ativa uma prancha do atlas.

*/
	case "abrePrancha":
		include_once("classe_atlas.php");
		$atl = new Atlas($xml,$atlasxml);
		$resultado = $atl->abrePrancha($atlasId,$pranchaId,$map_file,$locaplic);
		$cp->set_data($resultado);
	break;

}

if (!connection_aborted())
{
	if ($map_file != "")
	{
		restauraCon($map_file,$postgis_mapa);
	}
	$cp->return_data();
}
else
{exit();}
function gravaid()
{
	global $atlasId_,$tmpfname,$atlasxmltemp;//a variavel tmpfname vem do ms_criamapa.php
	$_SESSION["atlasId"] = $atlasId_;
	$_SESSION["utilizacgi"] = "nao";
	$_SESSION["atlasxml"] = $atlasxmltemp;
	$m = ms_newMapObj($tmpfname);
	$c = $m->numlayers;
	for ($i=0;$i < $c;++$i)
	{
		$l = $m->getlayer($i);
		$l->setmetadata("ATLAS","nao");
		$l->setmetadata("TIP","");
	}
	$m->save($tmpfname);		
}
?>