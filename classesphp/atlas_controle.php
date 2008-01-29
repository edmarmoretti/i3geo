<?php
/*
Title: A - Controle das requisições em Ajax feitas pela interface Atlas do i3geo

Recebe as requisições feitas em JavaScript (AJAX) e retorna o resultado para a interface.

As principais variáveis são obtidas da seção, definida na inicialização do I3Geo. Se a variável $map_file não for enviada, o retorno é uma mensagem linkquebrado e o fim do programa.

O parâmetro "funcao" define qual a operação que será executada (veja exemplo abaixo). esse parâmetro é verificado em um bloco "switch ($funcao)".

Sequência de operações:

pega as variáveis get ou post->pega as variáveis da seção->verifica se o debug deve ser ativado->carrega as extensões doPHP->cria o objeto cpaint->carrega as funções de uso mais comuns->faz uma cópia de segurança do map_file->roda a função desejada->retorna os valores obtidos

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

About: Variáveis de Seção

dir_tmp - diretório, no servidor, temporário utilizado pelo I3Geo, exemplo: c:/ms4w/tmp/ms_tmp
temasdir - diretório, no servidor, onde ficam os arquivos map_file de cada tema, exemplo: c:/ms4w/apache/htdocs/i3geo/temas
temasaplic - diretório, no servidor, onde ficam os arquivos de inicialização, exemplo: c:\ms4w\apache\htdocs\i3geo\aplicmap
locmapserv - localização, no servidor, do CGI, exemplo: /cgi-bin/mapserv.exe
locaplic - localização, no servidor, do I3Geo, exemplo: c:/ms4w/apache/htdocs/i3geo
locsistemas - localização do xml com a llista de temas, exemplo: /menutemas/sistemas.xml
locidentifica - localilzação do xml que define os sistemas adicionais incluídos na opção de identificação, exemplo: /menutemas/identifica.xml
R_path - localização, no servidor, do executável do pacote R, exemplo: c:/ms4w/apache/htdocs/i3geo/pacotes/r/win/bin/R.exe
imgurl - url das imagens geradas pelo mapa, exemplo: http://localhost/ms_tmp/imgTVHbdijFMk/
tmpurl - url do diretório temporário, exemplo: http://localhost/ms_tmp/
map_file - endereço, no servidor, do mapfile atual, exemplo: c:/ms4w/tmp/ms_tmp/TVHbdijFMk/TVHbdijFMk.map
mapext - extensão geográfica do mapa atual, exemplo: -76.5125927 -39.3925675209 -29.5851853 9.49014852081
perfil - nome do perfil para controlar os temas que serão visíveis na lista de temas.
mapdir - localização, no servidor, do diretório com o mapfile temporário do mapa atual.
imgdir - localização, no servidor, das imagens temporárias do mapa atual. 
debug - (pode ser definido como "sim" indica se o erro_reporting deve ser definido como E_ALL

File: i3geo/classesphp/atlas_controle.php

19/6/2007

Include:
<pega_variaveis.php>, <carrega_ext.php>, <cpaint2.inc.php>, <classe_vermultilayer.php>, <classe_estatistica.php>, <funcoes_gerais.php>

*/
error_reporting(0);

//sleep(5);

//
//pega as variaveis passadas com get ou post
//
$tempo = microtime(1);
include_once("pega_variaveis.php");
//
// se $atlasId estiver definido, define $map_file para o programa continuar
//
if (isset ($atlasId) || isset ($atlasId_))
{
	$map_file = "";	
}
//
// define $map_file para o programa poder continuar
// esse caso acontece na lista de atlas inicial
//
if (!isset($atlasxml))
{
	include_once("../ms_configura.php");
	$map_file = "";
}
if (isset ($g_sid))
{
	session_name("i3GeoPHP");
	session_id($g_sid);
	session_start();
	foreach(array_keys($_SESSION) as $k)
	{
		eval("\$".$k."='".$_SESSION[$k]."';");
	}
}
if (isset($debug) && $debug == "sim")
{error_reporting(E_ALL);}
//
//ativa o php mapscript e as extensões necessárias
//se as extensões já estiverem carregadas no PHP, vc pode comentar essa linha para que o processamento fique mais rápido
//
include_once ("carrega_ext.php");
require_once("../classesjs/cpaint/cpaint2.inc.php");
//
//cria objeto cpaint para uso com ajax
//
$cp = new cpaint();
if ($funcao == "criaMapa")
{
	session_destroy();
	include("../ms_configura.php");
	chdir($locaplic);
	$interface = "mashup";
	include("../ms_criamapa.php");
	$cp->set_data(session_id());
	$cp->return_data();
}
if (!isset($map_file))
{
	//nesse caso é necessário criar o diretório temporário e iniciar o mapa
	$cp->set_data("linkquebrado");
	$cp->return_data();
	exit;
}
require_once("classe_vermultilayer.php");
require_once("funcoes_gerais.php");
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
//
//faz a busca da função que deve ser executada
//
switch ($funcao)
{
/*
Property: pegaListaDeAtlas

Pega a lista de Atlas definida no arquivo xml menutemas/atlas.xml.

Include:
<mapa_inicia.php>
*/
	case "pegaListaDeAtlas":
		include("classe_atlas.php");
		$atl = new Atlas($atlasxml);
		$resultado = $atl->pegaListaDeAtlas($tituloInstituicao);
		$cp->set_data($resultado);
	break;
/*
Property: criaAtlas

Abre um Atlas específico, criando o mapa e chamando a interface desejada.

Esse programa é chamado diretamente, por exemplo, i3geo/classesphp/atlas_controle.php?atlasxml=&atlasId=

*/
	case "criaAtlas":
		include("classe_atlas.php");
		$atl = new Atlas($atlasxml);
		$interface = $atl->criaAtlas($atlasId_);
		if ($interface == "")
		{
			echo "Erro. Nenhuma interface definida para esse Atlas";
			exit;
		}
		$caminho = "../";
		$executa = "gravaId";
		include("../ms_criamapa.php");
	break;
/*
Property: pegaListaDePranchas

Pega a lista de pranchas de um atlas específico.

*/
	case "pegaListaDePranchas":
		include("classe_atlas.php");
		$atl = new Atlas($atlasxml);
		$resultado = $atl->pegaListaDePranchas($atlasId);
		$cp->set_data($resultado);
	break;
/*
Property: abrePrancha

Ativa uma prancha do atlas.

*/
	case "abrePrancha":
		include("classe_atlas.php");
		$atl = new Atlas($atlasxml);
		$resultado = $atl->abrePrancha($atlasId,$pranchaId,$map_file,$locaplic);
		$cp->set_data($resultado);
	break;

}

if (!connection_aborted())
{
	restauraCon($map_file,$postgis_mapa);
	$cp->return_data();
}
else
{exit();}
function gravaid()
{
	global $atlasId_;
	$_SESSION["atlasId"] = $atlasId_;	
}
?>