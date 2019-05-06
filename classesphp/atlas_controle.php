<?php
/*
Title: atlas_controle.php

Controle das requisi&ccedil;&otilde;es em Ajax feitas pela interface Atlas do i3geo

A lista de atlas &eacute; definida no sistema de administra&ccedil;&atilde;o do i3Geo ou em um arquivo XML

Recebe as requisi&ccedil;&otilde;es feitas em JavaScript (AJAX) e retorna o resultado para a interface.

As principais vari&aacute;veis s&atilde;o obtidas da se&ccedil;&atilde;o, definida na inicializa&ccedil;&atilde;o do I3Geo. Se a vari&aacute;vel $map_file n&atilde;o for enviada, o retorno &eacute; uma mensagem linkquebrado e o fim do programa.

O par&acirc;metro "funcao" define qual a opera&ccedil;&atilde;o que ser&aacute; executada (veja exemplo abaixo). esse par&acirc;metro &eacute; verificado em um bloco "switch ($funcao)".

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
Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/atlas_controle.php

Parametros:

funcao {string} - op&ccedil;&atilde;o que ser&aacute; executada.

g_sid {string} - id da se&ccedil;&atilde;o PHP.

Retorno:

cp - o resultado da opera&ccedil;&atilde;o ser&aacute; retornado em um objeto CPAINT.

Vari&aacute;veis de Se&ccedil;&atilde;o:

dir_tmp - diretorio, no servidor, tempor&aacute;rio utilizado pelo I3Geo, exemplo: c:/ms4w/tmp/ms_tmp
locmapserv - localiza&ccedil;&atilde;o, no servidor, do CGI, exemplo: /cgi-bin/mapserv.exe
locaplic - localiza&ccedil;&atilde;o, no servidor, do I3Geo, exemplo: c:/ms4w/apache/htdocs/i3geo
R_path - localiza&ccedil;&atilde;o, no servidor, do execut&aacute;vel do pacote R, exemplo: c:/ms4w/apache/htdocs/i3geo/pacotes/r/win/bin/R.exe
imgurl - url das imagens geradas pelo mapa, exemplo: http://localhost/ms_tmp/imgTVHbdijFMk/
tmpurl - url do diretorio tempor&aacute;rio, exemplo: http://localhost/ms_tmp/
map_file - endere&ccedil;o, no servidor, do mapfile atual, exemplo: c:/ms4w/tmp/ms_tmp/TVHbdijFMk/TVHbdijFMk.map
mapext - extens&atilde;o geogr&aacute;fica do mapa atual, exemplo: -76.5125927 -39.3925675209 -29.5851853 9.49014852081
perfil - nome do perfil para controlar os temas que ser&atilde;o vis&iacute;veis na lista de temas.
mapdir - localiza&ccedil;&atilde;o, no servidor, do diretorio com o mapfile tempor&aacute;rio do mapa atual.
imgdir - localiza&ccedil;&atilde;o, no servidor, das imagens tempor&aacute;rias do mapa atual.
debug - (pode ser definido como "sim" indica se o erro_reporting deve ser definido como E_ALL
*/
//error_reporting(0);
$tempo = microtime(1);
//
// quando as fun&ccedil;&otilde;es abaixo forem utilizadas, &eacute; necess&aacute;rio definir $map_file para que o programa continue.
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
	//guarda na section se o id tiver sido enviado epla URL
	if(isset($atlasId)){
		$_SESSION["atlasId"] = $atlasId;
	}
	$map_file = $_SESSION["map_file"];
	include(dirname(__FILE__)."/../ms_configura.php");

	$postgis_mapa = $_SESSION["postgis_mapa"];
}
if (($funcao == "pegaListaDeAtlas") || ($funcao == "criaAtlas")){
	$map_file = "";
}
//
//ativa o php mapscript e as extens&otilde;es necess&aacute;rias
//se as extens&otilde;es j&aacute; estiverem carregadas no PHP, vc pode comentar essa linha para que o processamento fique mais r&aacute;pido
//
include_once("carrega_ext.php");
include_once("funcoes_gerais.php");
//
//verifica se o usu&aacute;rio est&aacute; tentando utilizar um link que n&atilde;o funciona mais
//
if (!isset($map_file)){
	cpjson(array("erro"=>"linkquebrado"));
	exit;
}
include_once("classe_vermultilayer.php");

if ($map_file != ""){
	//
	//copia o map_file atual com outro nome para restaurar caso ocorra algum problema
	//
	copiaSeguranca($map_file);
	//
	//substitui a string de conex&atilde;o
	//
	substituiConObj($map_file,$postgis_mapa);
}


include($locaplic."/classesphp/xml.php");

$xml = geraXmlAtlas($locaplic,$editores);

$xml = simplexml_load_string($xml);

//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
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

Abre um Atlas espec&iacute;fico, criando o mapa e chamando a interface desejada.

Esse programa &eacute; chamado diretamente, por exemplo, i3geo/classesphp/atlas_controle.php?&atlasId=

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
			$interface = "../interface/atlasdefault.htm";
			//echo "Erro. Nenhuma interface definida para esse Atlas";
			//exit;
		}
		if (!isset($caminho))
		{$caminho = "../";}
		//
		// a fun&ccedil;&atilde;o gravaId ser&aacute; executada no final do processo de gera&ccedil;&atilde;o do mapa (ver ms_criamapa.php)
		//
		$executa = "gravaId";
		$temasa = "";
		include_once(dirname(__FILE__)."/../ms_criamapa.php");
		exit;
	break;
/*
Valor: PEGALISTADEPRANCHAS

Pega a lista de pranchas de um atlas espec&iacute;fico.

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
	$tmpfname = str_replace(".map","",$tmpfname).".map";
	$m->save($tmpfname);
	include(dirname(__FILE__)."/../ms_configura.php");
	restauraCon($tmpfname,$postgis_mapa);
}
?>