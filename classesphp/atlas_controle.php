<?php
/*
Title: atlas_controle.php

Controle das requisições em Ajax feitas pela interface Atlas do i3geo

A lista de atlas é definida no sistema de administração do i3Geo ou em um arquivo XML

Recebe as requisições feitas em JavaScript (AJAX) e retorna o resultado para a interface.

As principais variáveis são obtidas da seção, definida na inicialização do I3Geo. Se a variável $map_file não for enviada, o retorno é uma mensagem linkquebrado e o fim do programa.

O parâmetro "funcao" define qual a operação que será executada (veja exemplo abaixo). esse parâmetro é verificado em um bloco "switch ($funcao)".

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

i3geo/classesphp/atlas_controle.php

Parametros:

funcao {string} - opção que será executada.

g_sid {string} - id da seção PHP.

Retorno:

cp - o resultado da operação será retornado em um objeto CPAINT.

Variáveis de Seção:

dir_tmp - diretório, no servidor, temporário utilizado pelo I3Geo, exemplo: c:/ms4w/tmp/ms_tmp
locmapserv - localização, no servidor, do CGI, exemplo: /cgi-bin/mapserv.exe
locaplic - localização, no servidor, do I3Geo, exemplo: c:/ms4w/apache/htdocs/i3geo
R_path - localização, no servidor, do executável do pacote R, exemplo: c:/ms4w/apache/htdocs/i3geo/pacotes/r/win/bin/R.exe
imgurl - url das imagens geradas pelo mapa, exemplo: http://localhost/ms_tmp/imgTVHbdijFMk/
tmpurl - url do diretório temporário, exemplo: http://localhost/ms_tmp/
map_file - endereço, no servidor, do mapfile atual, exemplo: c:/ms4w/tmp/ms_tmp/TVHbdijFMk/TVHbdijFMk.map
mapext - extensão geográfica do mapa atual, exemplo: -76.5125927 -39.3925675209 -29.5851853 9.49014852081
perfil - nome do perfil para controlar os temas que serão visíveis na lista de temas.
mapdir - localização, no servidor, do diretório com o mapfile temporário do mapa atual.
imgdir - localização, no servidor, das imagens temporárias do mapa atual. 
debug - (pode ser definido como "sim" indica se o erro_reporting deve ser definido como E_ALL
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
	{eval("\$".$k."='".$_SESSION[$k]."';");}
	$postgis_mapa = $_SESSION["postgis_mapa"];
}
if (($funcao == "pegaListaDeAtlas") || ($funcao == "criaAtlas"))
{$map_file = "";}
//
//ativa o php mapscript e as extensões necessárias
//se as extensões já estiverem carregadas no PHP, vc pode comentar essa linha para que o processamento fique mais rápido
//
include_once("carrega_ext.php");
include_once("funcoes_gerais.php");
//
//verifica se o usuário está tentando utilizar um link que não funciona mais
//
if (!isset($map_file))
{
	cpjson(array("erro"=>"linkquebrado"));
	exit;
}
include_once("classe_vermultilayer.php");

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
if(!isset($locaplic))
{
	if(file_exists("../ms_configura.php"))
	{include_once("../ms_configura.php");}
	else
	{include_once("ms_configura.php");}
}
include($locaplic."/admin/php/xml.php");
$xml = simplexml_load_string(geraXmlAtlas($locaplic,$editores));
//
//faz a busca da função que deve ser executada
//
switch (strtoupper($funcao))
{
/*
Valor: PEGALISTADEATLAS

Pega a lista de Atlas definida no arquivo xml menutemas/atlas.xml.

<pegaListaDeAtlas()>
*/
	case "PEGALISTADEATLAS":
		include_once("classe_atlas.php");
		$atl = new Atlas($xml);
		$retorno = $atl->pegaListaDeAtlas($tituloInstituicao);
	break;
/*
Valor: CRIAATLAS

Abre um Atlas específico, criando o mapa e chamando a interface desejada.

Esse programa é chamado diretamente, por exemplo, i3geo/classesphp/atlas_controle.php?&atlasId=

<criaAtlas()>
*/
	case "CRIAATLAS":
		include_once("classe_atlas.php");
		$atl = new Atlas($xml);
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
Valor: PEGALISTADEPRANCHAS

Pega a lista de pranchas de um atlas específico.

<pegaListaDePranchas()>
*/
	case "PEGALISTADEPRANCHAS":
		include_once("classe_atlas.php");
		$atl = new Atlas($xml);
		$retorno = $atl->pegaListaDePranchas($atlasId);
	break;
/*
Valor: ABREPRANCHA

Ativa uma prancha do atlas.

<abrePrancha()>
*/
	case "ABREPRANCHA":
		include_once("classe_atlas.php");
		$atl = new Atlas($xml);
		$retorno = $atl->abrePrancha($atlasId,$pranchaId,$map_file,$locaplic);
	break;
}

if (!connection_aborted())
{
	if ($map_file != "")
	{
		restauraCon($map_file,$postgis_mapa);
	}
	cpjson($retorno);
}
else
{exit();}
function gravaid()
{
	global $atlasId_,$tmpfname;//a variavel tmpfname vem do ms_criamapa.php
	$_SESSION["atlasId"] = $atlasId_;
	$_SESSION["utilizacgi"] = "nao";
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