<?php
/*
Title: A - Controle das requisições em Ajax

Recebe as requisições feitas em JavaScript (AJAX) e retorna o resultado para a interface.

As principais variáveis são obtidas da seção, definida na inicialização do I3Geo. Se a variável $map_file não for enviada, o retorno é uma mensagem linkquebrado e o fim do programa.

Para utilizar esse programa fora do I3Geo, envie o parâmetro "map_file=''", dessa forma, evita-se a mensagem de link quebrado.

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

File: i3geo/classesphp/mapa_controle.php

19/6/2007

Include:
<pega_variaveis.php>, <carrega_ext.php>, <cpaint2.inc.php>, <classe_vermultilayer.php>, <classe_estatistica.php>, <funcoes_gerais.php>

*/
error_reporting(0);

//sleep(5);

//
//pega as variaveis passadas com get ou post
//
include_once("pega_variaveis.php");
//
//inicializa a sessão
//
if ($funcao != "criaMapa")
{
	session_name("i3GeoPHP");
	if (isset($g_sid))
	{session_id($g_sid);}
	session_start();
	foreach(array_keys($_SESSION) as $k)
	{
		eval("\$".$k."='".$_SESSION[$k]."';");
	}
	//
	//verifica se deve ativar o debug
	//
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
/*
//
//grava na sessão o PID do processo PHP
//
if ($funcao == "terminaProcesso")
{
	$pid = $_SESSION["ultimopid"];
	@exec("taskkill /f /PID $pid 2>&1");
	$cp->set_data($pid);
	$cp->return_data();	
}
$_SESSION["ultimopid"] = getmypid();
*/
if ($funcao == "criaMapa")
{
	session_destroy();
	include("../ms_configura.php");
	chdir($locaplic);
	$interface = "mashup";
	include("ms_criamapa.php");
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
require_once("classe_estatistica.php");
require_once("funcoes_gerais.php");
//
//copia o map_file atual com outro nome para restaurar caso ocorra algum problema
//
copiaSeguranca($map_file);
//
//substitui a string de conexão
//
substituiCon($map_file,$postgis_mapa);

set_time_limit(240);

//
//faz a busca da função que deve ser executada
//
switch ($funcao)
{
/*
Section: Inicialização

Inicia o mapa.
*/
/*
Property: inicia

Inicia o mapa, pegando os parâmetros necessários para a montagem inicial.

Include:
<mapa_inicia.php>
*/
	case "inicia":
		include("mapa_inicia.php");
		$cp->register('iniciaMapa');
		$cp->start();
		if ($cp->get_data() == "")
		{$cp->set_data("erro");}
	break;	
/*
Section: Análise de geometrias

Opções utilizadas no sistema de análise de geometrias.
*/
/*
Property: incmapageometrias

Incluí geometrias, armazenadas no formato I3Geo, como um tema no mapa atual.

O mapfile é alterado e salvo novamente com os novos layers.

Include:
<classe_analise.php>
*/
	case "incmapageometrias":
		include("classe_analise.php");
		$m = new Analise($map_file,"");
		$resultado = $m->incmapageometrias($dir_tmp,$imgdir,$lista);
		$cp->set_data($resultado);
	break;
/*
Property: funcoesGeometrias

Processa geometrias, armazenadas no formato I3Geo, gerando uma nova geometria.
União, intersecção, etc.

Include:
<classe_analise.php>
*/
	case "funcoesGeometrias":
		include("classe_analise.php");
		$m = new Analise($map_file,"");
		$resultado = $m->funcoesGeometrias($dir_tmp,$imgdir,$lista,$operacao);
		$cp->set_data($resultado);
	break;
/*
Property: calculaGeometrias

Processa geometrias, armazenadas no formato I3Geo, gerando cálculos.
Área, perímetro, etc.

Include:
<classe_analise.php>
*/
	case "calculaGeometrias":
		include("classe_analise.php");
		$m = new Analise($map_file,"");
		$resultado = $m->calculaGeometrias($dir_tmp,$imgdir,$lista,$operacao,$postgis_con,$srid_area);
		$cp->set_data($resultado);
	break;
/*
Property: listageometrias

Gera a lista de geometrias disponíveis para o mapa atual.

As geometrias são armazenadas no diretório temporário do usuário, utilizando um formato próprio do I3Geo.

Include:
<classe_analise.php>
*/
	case "listageometrias":
		include("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$resultado = $m->listaGeometrias($dir_tmp,$imgdir);
		$cp->set_data($resultado);
	break;
/*
Property: capturageometrias

Gera um arquivo de geometrias, no formato I3Geo, para um tema, considerando os elementos selecionados.

As geometrias são armazenadas no diretório temporário do usuário, utilizando um formato próprio do I3Geo.

Include:
<classe_analise.php>
*/	
	case "capturageometrias":
		include("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$resultado = $m->capturaGeometrias($dir_tmp,$imgdir,$nome);
		$cp->set_data($resultado);
	break;
/*
Property: removergeometrias

Remove geometrias do diretório temporário.

As geometrias são armazenadas no diretório temporário do usuário, utilizando um formato próprio do I3Geo.

Include:
<classe_analise.php>
*/	
	case "removergeometrias":
		include("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$resultado = $m->removerGeometrias($dir_tmp,$imgdir,$lista);
		$cp->set_data($resultado);
	break;
/*
Section: Open Layers

Funções específicas da interface OpenLayers utilizadas por aplicmap/openlayers.htm
*/
/*
Property: openlayers

Prepara o mapa atual para funcionar na interface openlayers.

Include:
<classe_mapa.php>
*/
	case "openlayers":
		$map = ms_newMapObj($map_file);
		$mapext = ($map->extent->minx).",".($map->extent->miny).",".($map->extent->maxx).",".($map->extent->maxy);
		$eb = $map->scalebar;
		$eb->set("status",MS_OFF);
		$map->setProjection("init=epsg:4326");
		$cr = $map->getlayerbyname("copyright");
		$cr->set("status",MS_OFF);
		if (connection_aborted()){exit();}
		$map->save($map_file);
		include("classe_mapa.php");
		$m = New Mapa($map_file);
		$par = $m->parametrosTemas();
		$resultado = array("mapfile"=>$map_file,"mapext"=>$mapext,"locmapserv"=>$locmapserv,"parametros"=>$par);
		$cp->set_data($resultado);
	break;
/*
Section: Mapa
*/
/*
Property: reiniciaMapa

Reinicia um mapa restaurando a cópia de segurança.
*/	
	case "reiniciaMapa":
		unlink($map_file);
		copy(str_replace(".map","reinc.map",$map_file),$map_file);
		$cp->set_data("ok");
	break;
/*
Property: ativalogo

Ativa ou desativa a marca de logo no mapa.

Include:
<classe_mapa.php>
*/
	case "ativalogo":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$cp->set_data($m->ativalogo());
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: ativalegenda

Ativa ou desativa a legenda inserida no mapa.

Include:
<classe_mapa.php>
*/
	case "ativalegenda":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$cp->set_data($m->ativalegenda());
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: mudatamanho

Muda o tamanho da imagem do mapa atual.

Include:
<classe_mapa.php>
*/
	case "mudatamanho":
		$map = ms_newMapObj($map_file);
		$map->setsize($largura,$altura);
		if (connection_aborted()){exit();}
		$salvo = $map->save($map_file);
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$m->mudaQS($largura,$altura);
		$cp->set_data("ok");
	break;
/*
Property: gradeCoord

Inclui um tema com a grade de coordenadas.

Include:
<classe_mapa.php>
*/
	case "gradeCoord":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$cp->set_data($m->gradeCoord($intervalo));
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: convertews

Converte o mapa atual em um wms.

Include:
<classe_mapa.php>
*/
	case "convertews":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$resultado = $m->converteWS($locmapserv,$h);
		$cp->set_data($resultado);
	break;
/*
Property: querymapcor

Altera a cor de seleção.

Include:
<classe_mapa.php>
*/
	case "querymapcor":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$cp->set_data($m->corQM($cor));
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: pegaquerymapcor

Pega a cor de seleção atual.

Include:
<classe_mapa.php>
*/
	case "pegaquerymapcor":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$cp->set_data($m->corQM(""));
	break;
/*
Property: corfundo

Altera a cor do fundo do mapa.

Include:
<classe_mapa.php>
*/
	case "corfundo":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$cp->set_data($m->corfundo($cor));
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: pegacorfundo

Pega a cor do fundo do mapa atual.

Include:
<classe_mapa.php>
*/
	case "pegacorfundo":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$cp->set_data($m->corfundo(""));
	break;	
/*
Property: corpo

Redesenha o mapa.

Include:
<classe_mapa.php>
*/
	case "corpo":
		redesenhaMapa();
	break;
/*
Property: corpoentorno

Desenha as imagens do entorno do mapa.

Include:
<classe_mapa.php>
*/
	case "corpoentorno":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$resultado = $m->redesenhaEntorno();
		$cp->set_data($resultado);
	break;
/*
Property: adicionaTemaGeoRSS

Adiciona um tema baseado em um RSS.

Include:
<classe_mapa.php>
*/
	case "adicionaTemaGeoRSS":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$retorno = $m->adicionaTemaGeoRSS($servico,$dir_tmp,$locaplic,$canal);
		$cp->set_data($retorno);
		if ($retorno != "erro")
		{$m->salva();redesenhaMapa();}
		else
		{
			$cp->set_data("erro.Nenhum dado espacializado foi encontrado.");
		}
	break;
/*
Property: adicionaTemaSHP

Adiciona um tema baseado em um arquivo shape file.

Include:
<classe_mapa.php>
*/
	case "adicionaTemaSHP":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$retorno = $m->adicionaTemaSHP($arq);
		$cp->set_data($retorno);
		if ($retorno != "erro")
		{$m->salva();redesenhaMapa();}
		else
		{
			$cp->set_data("erro.Nenhum dado espacializado foi encontrado.");
		}
	break;
/*
Property: adicionaTemaIMG

Adiciona um tema baseado em um arquivo de imagem.

Include:
<classe_mapa.php>
*/
	case "adicionaTemaIMG":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$retorno = $m->adicionaTemaIMG($arq);
		$cp->set_data($retorno);
		if ($retorno != "erro")
		{$m->salva();redesenhaMapa();}
		else
		{
			$cp->set_data("erro.Nenhum dado espacializado foi encontrado.");
		}
	break;
/*
Property: listatemas

Lista os temas existentes em um mapa.

Include:
<classe_mapa.php>
*/	
	case "listatemas":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$resultado = $m->listaTemas($opcao);
		$cp->set_data($resultado);
	break;
/*
Property: listatemaslocais

Lista os temas existentes no diretório temporário do mapa atual.

Include:
<classe_mapa.php>
*/		
	case "listatemaslocais":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$resultado = $m->listaTemasLocais();
		$cp->set_data($resultado);
	break;
/*
Property: listatemasTipo

Lista os temas existentes por tipo.

Include:
<classe_mapa.php>
*/	
	case "listatemasTipo":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$resultado = $m->listaTemasTipo($tipo);
		$cp->set_data($resultado);
	break;
/*
Property: listatemascomsel

Lista os temas que possuem seleção.

Include:
<classe_mapa.php>
*/	
	case "listatemascomsel":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$resultado = $m->listaTemasComSel();
		$cp->set_data($resultado);
	break;
/*
Property: ligatemas

Liga e desliga temas no mapa atual.

Include:
<classe_mapa.php>
*/		
	case "ligatemas":
  	include("classe_mapa.php");
		$m = new Mapa($map_file);
		$cp->set_data($m->ligaDesligaTemas($ligar,$desligar));
		$m->salva();
	break;
/*
Property: adtema

Adiciona um novo tema ao mapa.

Include:
<classe_mapa.php>
*/	
	case "adtema":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
		$m->adicionaTema($temas,$locaplic);
		$m->salva();
		$teste = testaMapa($map_file,$postgis_mapa);
		if ($teste == "ok")
		{$cp->set_data("ok");}
		else
		{
			$cp->set_data(array("erro"=>"A camada nao pode ser adicionada. ".$teste));	
		}
	break;
/*
Property: excluitema

Exclui um tema do mapa.

Include:
<classe_mapa.php>
*/
	case "excluitema":
	include("classe_mapa.php");
		$m = new Mapa($map_file);
		$cp->set_data($m->excluiTemas($temas));
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: adicionatemawms

Acrescenta um novo tema em um arquivo map file tendo como fonte um WMS.

Include:
<classe_mapa.php>
*/	
	case "adicionatemawms":
		include("classe_mapa.php");
		$m = new Mapa($map_file);
	 	$m->adicionatemawms($tema,$servico,$nome,$proj,$formato,$locaplic,$tipo,$versao,$nomecamada,$dir_tmp,$imgdir,$imgurl,$tiporep,$suportasld,$formatosinfo);
		$teste = testaMapa($map_file,$postgis_mapa);
		if ($teste == "ok")
		{$cp->set_data("ok");}
		else
		{
			$cp->set_data(array("erro"=>"A camada nao pode ser adicionada. ".$teste));	
		}
	break;
/*
Property: referencia

Gera a imagem do mapa de referência.
*/	
	case "referencia":
		$objMapa = ms_newMapObj($map_file);
		$nomeImagem = nomeRandomico();
		$cp->register('retornaReferencia');
		$cp->start();
	break;
/*
Property: referenciadinamica

Gera a imagem do mapa de referência de forma dinâmica, variando com a escala do mapa atual.
*/	
	case "referenciadinamica":
		//$objMapa = ms_newMapObj($map_file);
		$nomeImagem = nomeRandomico();
		$cp->register('retornaReferenciaDinamica');
		$cp->start();
	break;
/*
Section: Temas

Processa os layers do mapa.
*/

/*
Property: listaDrives

Pega a lista de drives registrados para o usuário atual.

A lista de drives é definida no ms_configura e permite que o usuário navegue pelos arquivos do servidor.

Include:
<ms_configura.php>
*/
	case "listaDrives":
		include("../ms_configura.php");
		//verifica se está cadastrado
		$ipcliente = pegaIPcliente();
		$retorno = array();
		foreach ($navegadoresLocais as $n)
		{
			if (gethostbyname($n["ip"]) == $ipcliente)
			{$retorno[] = $n["drives"];}	
		}		
		$cp->set_data($retorno);
	break;
/*
Property: alterarepresentacao

Altera o tipo de representação cartográfica do tema.

Include:
<classe_temas.php>
*/
	case "alterarepresentacao":
		include("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$cp->set_data($m->alteraRepresentacao());
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: geradestaque

Gera uma imagem que será utilizada para destacar um determinado tema.

Include:
<classe_temas.php>
*/
	case "geradestaque":
		include("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$cp->set_data($m->geraDestaque());
	break;
/*
Property: download

Gera os arquivos para download de um tema.

*/
	case "download":
		$cp->set_data(downloadTema($map_file,$tema,$locaplic,$dir_tmp));
	break;
/*
function: insereFeature

Insere elemento gráfico em um tema.

Include:
<classe_temas.php>
*/
	case "inserefeature":
		include("classe_temas.php");
		$m = new Temas($map_file,"");
		$cp->set_data($m->insereFeature($marca,$tipo,$xy,$texto,$position,$partials,$offsetx,$offsety,$minfeaturesize,$mindistance,$force,$shadowcolor,$shadowsizex,$shadowsizey,$outlinecolor,$cor,$sombray,$sombrax,$sombra,$fundo,$angulo,$tamanho,$fonte));
		$m->salva();
		redesenhaMapa();	
	break;
/*
Property: sobetema

Sobe um tema na ordem de desenho.

Include:
<classe_temas.php>
*/
	case "sobetema":
		include("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$cp->set_data($m->sobeTema());
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: descetema

Desce um tema na ordem de desenho.

Include:
<classe_temas.php>
*/
	case "descetema":
		include("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$cp->set_data($m->desceTema());
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: reordenatemas

Reordena os temas baseados na localização de um segundo tema no mapa.

Include:
<classe_temas.php>
*/
	case "reordenatemas":
		include("classe_temas.php");
		$m = new Temas($map_file);
		$cp->set_data($m->reordenatemas($lista));
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: zoomtema

Muda a extensão geográfica do mapa de acordo com a abrangência de um tema.

Include:
<classe_temas.php>
*/
	case "zoomtema":
		include("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$cp->set_data($m->zoomTema());
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: insereFiltro

Inclui um filtro no tema.

Include:
<classe_temas.php>
*/
	case "inserefiltro":
		include("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$cp->set_data($m->insereFiltro($filtro,$testa));
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: pegafiltro

Pega a string do filtro de um tema.

Include:
<classe_temas.php>
*/
	case "pegafiltro":
		include("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$cp->set_data($m->pegaFiltro());
	break;
/*
Property: aplicaProcessos

Aplica processos em um tema do tipo imagem

Include:
<classe_temas.php>
*/					
	case "aplicaProcessos":
		include("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$m->aplicaProcessos($lista);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: mudatransp

Altera a transparência de um tema

Include:
<classe_temas.php>
*/					
	case "mudatransp":
		include("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$m->mudaTransparencia($valor);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: mudanome

Altera o nome do tema

Include:
<classe_temas.php>
*/					
	case "mudanome":
		include("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$m->mudaNome($valor);
		$m->salva();
		redesenhaMapa();
	break;
/*
Section: Classes

Edita as características das classes de um tema.
*/
/*
Property: alteraclasse

Altera uma classe de um tema, aplicando uma nova classificação ou modificando parâmetros de uma ou mais classes.

Include:
<classe_alteraclasse.php>
*/	
	case "alteraclasse":
		include("classe_alteraclasse.php");
		$m = new Alteraclasse($map_file,$tema);
		if ($opcao == "adicionaclasse")
		{$cp->set_data($m->adicionaclasse());}
		if ($opcao == "valorunico")
		{$cp->set_data($m->valorunico($item,$ignorar));}
		if ($opcao == "intervalosiguais")
		{$cp->set_data($m->intervalosiguais($item,$nclasses,$ignorar));}
		if ($opcao == "quartis")
		{$cp->set_data($m->quartis($item,$ignorar));}
		if ($opcao == "alteraclasses")
		{
			//esta operação é chamada com POST via cpaint
			//por isso precisa ser executada com start
			$cp->register('alteraclassesPost');
			$cp->start();
			restauraCon($map_file,$postgis_mapa);
			$cp->return_data();
			exit;
		}
		if ($opcao == "simbolounico")
		{$cp->set_data($m->simbolounico());}
		$salvo = $m->salva();
	break;
/*
Property: inverteCoresClasses

Inverte a ordem das cores das classes de um tema.

Include:
<classe_alteraclasse.php>
*/	
	case "inverteCoresClasses":
		include("classe_alteraclasse.php");
		$m = new Alteraclasse($map_file,$tema);
		$cp->set_data($m->inverteCoresClasses());
		$m->salva();
	break;
/*
Property: calculaTamanhoClasses

Calcula o tamanho dos estilos das classes, alterando o tamanho do símbolo.

Include:
<classe_alteraclasse.php>
*/	
	case "calculaTamanhoClasses":
		include("classe_alteraclasse.php");
		$m = new Alteraclasse($map_file,$tema);
		$cp->set_data($m->calculaTamanhoClasses());
		$m->salva();
	break;
/*
Property: alteraCoresClasses

Altera as cores das classes de um tema conforme uma cor inicial e uma final.

Include:
<classe_alteraclasse.php>
*/	
	case "alteraCoresClasses":
		include("classe_alteraclasse.php");
		$m = new Alteraclasse($map_file,$tema);
		$cp->set_data($m->alteraCoresClasses($cori,$corf));
		$m->salva();
	break;
/*
Property: inverteStatusClasse

Altera o status de desenho de uma classe, tornando-a vi´sivel ou não.

Include:
<classe_alteraclasse.php>
*/
	case "inverteStatusClasse":
		include("classe_alteraclasse.php");
		$m = new Alteraclasse($map_file,$tema);
		$cp->set_data($m->statusClasse($classe));
		$m->salva();
	break;	
/*
Property: verPaleta

Gera cores tendo como base uma cor inicial e uma cor final.

Include:
<class.palette.php>
*/	
	case "verPaleta":
		include("class.palette.php");
		$cori = RGB2hex(explode(",",$cori));
		$corf = RGB2hex(explode(",",$corf));
		$myPalette=new palette(array($cori,$corf),($numclasses + 1));
		foreach ($myPalette->colorRGB as $cores)
		{
			$res[] = $cores[0].",".$cores[1].",".$cores[2];
		}
		$cp->set_data(implode("*",$res));
	break;
/*
Section: Análise geográfica

Executa operações de análise espacial.
*/
/*
Property: pontoEmPoligono

Cruza um tema pontual com temas poligonais ou raster.

Salva o mapa acrescentando um novo layer com o resultado.

Include:
<classe_analise.php>
*/
	case "pontoEmPoligono":
		include("classe_analise.php");
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->pontoEmPoligono($temaPt,$temasPo,$locaplic));
		$m->salva();
	break;
/*
Property: nptPol

Conta o número de pontos em polígono cruzando dois temas.

Salva o mapa acrescentando um novo layer com o resultado.

Include:
<classe_analise.php>
*/
	case "nptPol":
		include("classe_analise.php");
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->nptPol($temaPt,$temaPo,$locaplic));
		$m->salva();
	break;
/*
Property - criaBuffer

Gera entorno (buffer) nos elementos selecionados de um tema.

Salva o mapa acrescentando um novo layer com o buffer.

Include:
<classe_analise.php>
*/	
	case "criabuffer":
		include("classe_analise.php");
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->criaBuffer($distancia,$locaplic));
		$m->salva();
	break;
/*
Property - criaCentroide

Gera centroide dos elementos selecionados de um tema.

Salva o mapa acrescentando um novo layer com os pontos.

Include:
<classe_analise.php>
*/	
	case "criaCentroide":
		include("classe_analise.php");
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->criaCentroide($locaplic));
		$m->salva();
	break;
/*
Property: analiseDistriPt

Gera análise de distribuição de pontos.

Executa script R para gerar a imagem.

Include:
<classe_analise.php>,<class.palette.php>
*/	
	case "analiseDistriPt":
		include("classe_analise.php");
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->analiseDistriPt($locaplic,$dir_tmp,$R_path,$numclasses,$tipo,$cori,$corf,$tmpurl));
		$m->salva();
	break;
/*
Property: gradeDePontos

Gera uma grade de pontos com espaçamento regular definido em décimos de grau.

Salva o mapa acrescentando um novo layer com a grade de coordenadas.

Include:
<classe_analise.php>
*/	
	case "gradedepontos":
		include("classe_analise.php");
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->gradeDePontos($xdd,$ydd,$px,$py,$locaplic,$nptx,$npty));
		$m->salva();
	break;
/*
Property: gradeDePol

Gera uma grade de polígonos com espaçamento regular definido em décimos de grau.

Salva o mapa acrescentando um novo layer com a grade.

Include:
<classe_analise.php>
*/	
	case "gradedepol":
		include("classe_analise.php");
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->gradeDePol($xdd,$ydd,$px,$py,$locaplic,$nptx,$npty));
		$m->salva();
	break;
/*
Property: gradeDeHex

Gera uma grade de polígonos hexagonais definido em décimos de grau.

Salva o mapa acrescentando um novo layer com a grade.

Include:
<classe_analise.php>
*/	
	case "gradedehex":
		include("classe_analise.php");
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->gradeDeHex($xdd,$ydd,$px,$py,$locaplic,$nptx,$npty));
		$m->salva();
	break;
/*
Section: Edição

Cria arquivos shapefile ou altera suas características.
*/
/*
Property: sphPT2shp

Converte os elementos de um tema em um arquivo shp.

Acrescenta um novo tema ao mapa.

Include:
<classe_shp.php>
*/
	case "sphPT2shp":
		include("classe_shp.php");
		$m = new SHP($map_file,$tema);
		$cp->set_data($m->shpPT2shp($locaplic,$para));
		$m->salva();
	break;
/*
Property: listaPontosShape

Lista os pontos dos elementos de um arquivo shp.

Include:
<classe_shp.php>
*/
	case "listaPontosShape":
		include("classe_shp.php");
		$m = new SHP($map_file,$tema);
		$cp->set_data($m->listaPontosShape($xy));
	break;
/*
Property: criashpvazio

Cria um shapefile vazio e acrescenta como tema ao mapa.

Include:
<classe_shp.php>
*/
	case "criashpvazio":
		include("classe_shp.php");
		$m = new SHP($map_file);
		$cp->set_data($m->criaSHPvazio());
		$m->salva();
	break;
/*
Property: insereSHP

Insere um ponto em um shape file existente.

Include:
<classe_shp.php>
*/
	case "insereSHP":
		include("classe_shp.php");
		$m = new SHP($map_file,$tema);
		$m->insereSHP($xy);
		redesenhaMapa();
	break;
/*
Property: insereSHPgrafico

Cria um gráfico e insere no mapa em um local clicado no mapa.

Os valores para o gráfico são obtidos do tema indicado na classe. Para cada novo gráfico é criado um tema no mapa.

Include:
<classe_shp.php>
*/
	case "insereSHPgrafico":
		include("classe_shp.php");
		$m = new SHP($map_file,$tema);
		$cp->set_data($m->insereSHPgrafico($tipo,$x,$y,$itens,$imgurl,$width,$inclinacao,$shadow_height));
	break;
/*
Property: mostrawkt

Gera string wkt de um conjunto de pontos.

*/	
	case "mostrawkt":
		$res = xy2wkt($xy);
		$cp->set_data(array($res["ponto"],$res["linha"],$res["poligono"]));
	break;
/*
Section: Gráficos

Criação de representações gráficas de dados estatísticos.
*/
/*
Property: fusaografico

Faz a fusão da imagem de um gráfico com a imagem do mapa atual.

Include:
<graficos.php>
*/	
	case "fusaografico":
		include("graficos.php");
		restauraCon($map_file,$postgis_mapa);
		$cp->register('fusaoGrafico');
		$cp->start();
	break;
/*
Property: graficoestrela

Cria um gráfico do tipo estrela.

Include:
<graficos.php>
*/	
	case "graficoestrela":
		include("graficos.php");
		$cp->register('graficoEstrela');
		$cp->start();
	break;
/*
Property: graficoscatter

Cria um gráfico de distribuição de pontos.

Include:
<graficos.php>
*/	
	case "graficoscatter":
		include("graficos.php");
		$cp->register('graficoScatter');
		$cp->start();
	break;
/*
Property: graficoscatterbins

Cria um gráfico de distribuição de pontos com agrupamento em pixels (bins).

Include:
<graficos.php>
*/	
	case "graficoscatterbins":
		include("graficos.php");
		$cp->register('graficoScatterBins');
		$cp->start();
	break;
/*
Property: graficolinhas

Cria um gráfico de linhas.

Include:
<graficos.php>
*/
	case "graficolinhas":
		include("graficos.php");
		$cp->register('graficoLinhas');
		$cp->start();
	break;
/*
Property: graficohist

Cria um gráfico de histograma.

Include:
<graficos.php>
*/
	case "graficohist":
		include("graficos.php");
		$cp->register('graficoHist');
		$cp->start();
	break;
/*
Property: graficobarras

Cria um gráfico de barras.

Include:
<graficos.php>
*/
	case "graficobarras":
		include("graficos.php");
		$cp->register('graficoBarras');
		$cp->start();
	break;
/*
Property: graficopizza

Cria um gráfico de pizza.

Include:
<graficos.php>
*/
	case "graficopizza":
		include("graficos.php");
		$cp->register('graficoPizza');
		$cp->start();
	break;
/*
Section: Menu de temas

Obtém a lista de temas, grupos e sub-grupos.
*/
/*
Property: pegalistademenus

Pega a lista de menus para incluir na guia adiciona.

Parameters:
*/
	case "pegalistademenus":
		$menutemas = "";
		if (file_exists("../ms_configura.php"))
		{require_once("../ms_configura.php");}
		$cp->set_data($menutemas);
		$cp->return_data();
	break;
/*
Property: pegalistadegrupos

Pega a lista de grupos do menu.

Parameters:

map_file

perfil - perfil do usuário

locsistemas - endereço do xml com a lista de sistemas adicionais

idmenu - identificador da árvore de menus que deverá ser considerada (veja o ms_configura.php)
Include:
<classe_menutemas.php>
*/
	case "pegalistadegrupos":
		include("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locsistemas);
		$cp->set_data(array("grupos"=>$m->pegaListaDeGrupos($idmenu,$listasistemas)));
		//$cp->return_data();
	break;
/*
Property: pegalistadetemas

Pega a lista de temas do menu.

Include:
<classe_menutemas.php>
*/
	case "pegalistadetemas":
		include("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locsistemas);
		$cp->set_data(array("temas"=>$m->pegaListaDeTemas($grupo,$subgrupo,$idmenu)));
	break;
/*
Property: procurartemas

Procura um tema no menu.

Include:
<classe_menutemas.php>
*/
	case "procurartemas":
		include("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil);
		$cp->set_data($m->procurartemas($procurar));
	break;
/*
Property: pegaMapas

Pega a lista de links para outros mapas.

Utilizado no preenchimento da guia mapas

Include:
<classe_menutemas.php>
*/
	case "pegaMapas":
		include("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil);
		$cp->set_data($m->pegaListaDeMapas($locmapas));
	break;	
/*
Section: Webservices

Processa serviços OGC.
*/
/*
Property: georssCanais

Lista os canais de um georss.

*/
	case "georssCanais":
		$cp->set_data(georssCanais($servico,$map_file,$dir_tmp,$locaplic));
	break;
/*
Property: getcapabilities

Chama a função getcapabilities e retorna o resultado.

Include:
<wmswfs.php>
*/
	case "getcapabilities":
		include("wmswfs.php");
		$cp->register('getcapabilities');
		restauraCon($map_file,$postgis_mapa);
		$cp->start();
	break;
/*
Property: getcapabilities2

Chama a função getcapabilities e retorna o resultado formatado (WMS).

Include:
<wmswfs.php>
*/
	case "getcapabilities2":
		include("wmswfs.php");
		$cp->register('getcapabilities2');
		restauraCon($map_file,$postgis_mapa);
		$cp->start();
	break;
/*
Property: getcapabilities3

Chama a função getcapabilities e retorna o resultado formatado (WFS).

Include:
<wmswfs.php>
*/
	case "getcapabilities3":
		include("wmswfs.php");
		$cp->register('getcapabilities3');
		restauraCon($map_file,$postgis_mapa);
		$cp->start();
	break;
/*
Property: temaswms

Retorna a lista de camadas de um WMS formatado em HTML.

Include:
<wmswfs.php>
*/	
	case "temaswms":
		include("wmswfs.php");
		restauraCon($map_file,$postgis_mapa);
		$cp->register('temaswms');
		$cp->start();
	break;
/*
Section: Atributos

Processa os atributos da tabela associada ao tema.
*/
/*
Property: buscaRapida

Acessa dados de um serviço de geonames.

Include:
<classe_atributos.php>
*/
	case "buscaRapida":
		$cp->set_data(buscaRapida($servico,$palavra));
	break;
/*
Property: listaitens

Lista os itens de um tema.

Include:
<classe_atributos.php>
*/
	case "listaitens":
		include("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$cp->set_data($m->listaItens());
	break;
/*
Property: listavaloresitens

Procura valores em uma tabela que aderem a uma palavra de busca.

Include:
<classe_atributos.php>
*/	
	case "listavaloresitens":
	include("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$cp->set_data($m->buscaRegistros($palavra,$lista,$tipo,$onde));
	break;
/*
Property: identifica

Identifica elementos no mapa.

Include:
<classe_atributos.php>
*/
	case "identifica":
		if (!isset($tema)){$tema = "";}
		if (!isset($resolucao)){$resolucao = 5;}
		include("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$cp->set_data($m->identifica($opcao,$xy,$resolucao));
	break;
/*
Property: identificaunico

Identifica elementos no mapa retornando apenas o valor de um único item.

Include:
<classe_atributos.php>
*/
	case "identificaunico":
		if (!isset($resolucao)){$resolucao = 5;}
		include("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$xy = explode(",",$xy);
		$cp->set_data($m->identificaQBP($tema,$xy[0],$xy[1],$map_file,$resolucao,$item,$tiporetorno="unico"));
	break;
/*
Property: estatistica

Calcula estatísticas básicas de uma tabela de um tema.

Include:
<classe_atributos.php>
*/	
	case "estatistica":
		include("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$cp->set_data($m->estatDescritivas($item,$exclui));
	break;
/*
Property: listatexto

Pega todos os valores dos itens de uma tabela de um tema.

Include:
<classe_atributos.php>
*/	
	case "listatexto":
		include("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$cp->set_data($m->itensTexto($tipo));
	break;
/*
Property: listaregistros

Pega todos os valores dos itens de uma tabela de um tema.

Include:
<classe_atributos.php>
*/	
	case "listaregistros":
		include("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$cp->set_data($m->listaRegistros($itemtema,$tipo,$unico,$inicio,$fim,$tipolista));
	break;
/*
Property: extregistros

Pega a extensão geográfica de um registro na tabela de atributos de um tema.

Include:
<classe_atributos.php>
*/		
	case "extregistros":
		include("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$cp->set_data($m->extensaoRegistro($registro));
		$m->salva();
	break;
/*
Section: Navegação

Altera a extensão geográfica do mapa.
*/
/*
Property: desativacgi

Desativa o modo cgi.

*/
	case "desativacgi":
		$_SESSION["utilizacgi"] = "nao";
		$cp->set_data($_SESSION["utilizacgi"]);
	break;

/*
Property: mudaext

Muda a extensão geográfica do mapa.

Include:
<classe_navegacao.php>
*/
	case "mudaext":
		include("classe_navegacao.php");
		if (!isset($ext)){$ext="-76.512593 -39.392568 -29.585185 9.490149";}
		$m = new Navegacao($map_file);
		$m->mudaExtensao($ext);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: mudaescala

Muda a escala do mapa.

Include:
<classe_navegacao.php>
*/
	case "mudaescala":
		include("classe_navegacao.php");
		$m = new Navegacao($map_file);
		$m->mudaEscala($escala);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: pan

Desloca a visualização de um mapa (pan).

Include:
<classe_navegacao.php>
*/
	case "pan":
		include("classe_navegacao.php");
		$m = new Navegacao($map_file);
		$m->pan($x,$y,$escala,$tipo);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: aproxima

Aproxima a visualização de um mapa (zoom in)

Include:
<classe_navegacao.php>
*/
	case "aproxima":
		include("classe_navegacao.php");
		$m = new Navegacao($map_file);
		$m->aproxima($nivel);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: afasta

Afasta a visualização de um mapa (zoom out)

Include:
<classe_navegacao.php>
*/
	case "afasta":
		include("classe_navegacao.php");
		$m = new Navegacao($map_file);
		$m->afasta($nivel);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: crialente

Aplica uma resolução nova ao mapa atual e gera uma imagem para a lente.

Include:
<classe_navegacao.php>
*/
	case "crialente":
		include("classe_navegacao.php");
		$m = new Navegacao($map_file);
		$m->aplicaResolucao($resolucao);
		//$m->desabilitaRASTER();
		$cp->set_data(($m->mapa->width).",".($m->mapa->height).",".$m->gravaImagemCorpo());
	break;
/*
Property: localizaIP

Localiza as coordenadas geográficas do usuário atual.

Baseia-se na identificação do IP e no pacote geoip

Include:
<pacotes/geoip/geoipcity.php>
*/
	case "localizaIP":
		$ip = pegaIPcliente();
		$r = ip2geo($ip);
		if($r["latitude"] == null)
		{
			$ip = pegaIPcliente2();
			$r = ip2geo($ip);
		}
		$cp->set_data($r);
	break;

/*
Property: zoomponto

Desloca o centro do mapa para um ponto específico.

Include:
<classe_navegacao.php>
*/
	case "zoomponto":
		include("classe_navegacao.php");
		include("classe_temas.php");
		$m = new Navegacao($map_file);
		$m->zoomPonto($xy);
		$m->salva();
		$m = new Temas($map_file,"");
		$m->insereFeature("ponto","POINT",$xy,$texto,$position,$partials,$offsetx,$offsety,$minfeaturesize,$mindistance,$force,$shadowcolor,$shadowsizex,$shadowsizey,$outlinecolor,$cor,$sombray,$sombrax,$sombra,$fundo,$angulo,$tamanho,$fonte);
		$m->salva();	
		redesenhaMapa();
	break;
/*
Section: Legenda

Processa a legenda do mapa e de temas específicos.
*/
/*
Property: editasimbolo

Define as características de simbologia de uma classe, cria, adiciona e exclui estilos.

Include:
<classe_legenda.php>
*/
	case "editasimbolo":
		include("classe_legenda.php");
		$m = new Legenda($map_file,$locaplic,$tema);
		if ($opcao == "excluiestilo")
		{
			$cp->set_data($m->excluiEstilo($classe,$estilo));
			$m->salva();
		}
		if ($opcao == "adicionaestilo")
		{
			$cp->set_data($m->adicionaEstilo($classe,$estilo));
			$m->salva();
		}
		if ($opcao == "sobeestilo")
		{
			$cp->set_data($m->sobeEstilo ($classe,$estilo));
			$m->salva();
		}
		if ($opcao == "desceestilo")
		{
			$cp->set_data($m->desceEstilo ($classe,$estilo));
			$m->salva();
		}
		if ($opcao == "aplica")
		{
			$cp->set_data($m->aplicaParametro($classe,$estilo,$outlinecolor,$backgroundcolor,$color,$symbolname,$size));
			$m->salva();
		}
		if ($opcao == "listaSimbolos")
		{$cp->set_data($m->listaSimbolos($tipo,$dir_tmp,$imgdir));}
		if ($opcao == "pegaparametros")
		{$cp->set_data($m->pegaParametros($classe));}
	break;
/*
Property: editalegenda

Cria elementos para construir uma legenda no formato de tabela em HTML.

Include:
<classe_legenda.php>
*/
	case "editalegenda":
		include("classe_legenda.php");
		$m = new Legenda($map_file,$locaplic,$tema);
		$r = $m->tabelaLegenda();
		if (!$r){$r = "erro.Erro legenda nao disponivel";}
		$cp->set_data($r);
	break;
/*
Property: criaLegendaHTML

Gera a legenda processando o template HTML.

Include:
<classe_legenda.php>
*/
	case "criaLegendaHTML":
		include("classe_legenda.php");
		$m = new Legenda($map_file,$locaplic,$tema,$template);
		$r = $m->criaLegenda();
		if(!$r){$r = "erro. Legenda nao disponivel";}
		$cp->set_data($r);
	break;
/*
Property: contagemclasse

Acrescenta a contagem de elementos em cada classe.

Include:
<classe_legenda.php>
*/
	case "contagemclasse":
		include("classe_legenda.php");
		$m = new Legenda($map_file,$locaplic,$tema);
		$r = $m->tabelaLegenda("sim");
		if (!$r){$r = "erro.Erro legenda nao disponivel";}
		$cp->set_data($r);
	break;
/*
Property: criaLegendaImagem

Desenha a imagem da legenda.

Include:
<classe_legenda.php>
*/
	case "criaLegendaImagem":
		include("classe_legenda.php");
		$m = new Legenda($map_file);
		$cp->set_data($m->legendaGrafica());
	break;
/*
Property: pegaParametrosLegImg

Pega os parâmetros da legenda embebida no mapa.

Include:
<classe_legenda.php>
*/
	case "pegaParametrosLegImg":
		include("classe_legenda.php");
		$m = new Legenda($map_file);
		$cp->set_data($m->pegaParametrosLegImg());
	break;
/*
Property: aplicaParametrosLegImg

Aplica um parâmetro em um estilo de uma classe.

Include:
<classe_legenda.php>
*/
	case "aplicaParametrosLegImg":
		include("classe_legenda.php");
		$m = new Legenda($map_file);
		$cp->set_data($m->aplicaParametrosLegImg($imagecolor,$position,$status,$outlinecolor,$keyspacingy,$keyspacingx,$keysizey,$keysizex,$height,$width,$labelsize));
		$m->salva();
	break;
/*
Section: Escala gráfica

Processa a escala gráfica do mapa.
*/
/*
Property: escalagrafica

Gera a imagem da barra de escala.

Include:
<classe_escala.php>
*/
	case "escalagrafica":
		include("classe_escala.php");
		$m = new Escala($map_file);
		$cp->set_data($m->retornaBarraEscala());
	break;
/*
Property: testaescalagrafica

Testa os novos parâmetros de uma barra de escala.

Include:
<classe_escala.php>
*/
	case "testaescalagrafica":
		include("classe_escala.php");
		$m = new Escala($map_file);
		$cp->set_data($m->testaescalagrafica($w,$h,$estilo,$intervalos,$unidade,$cor,$bcor,$ocor));
	break;
/*
Property: escalaparametros

Pega os parâmetros da barra de escala atual.

Include:
<classe_escala.php>
*/
	case "escalaparametros":
		include("classe_escala.php");
		$m = new Escala($map_file);
		$cp->set_data($m->parametrosBarraEscala());
	break;
/*
Property: mudaescalagrafica

Aplica novos parâmetros na barra de escala atual.

Include:
<classe_escala.php>
*/
	case "mudaescalagrafica":
		include("classe_escala.php");
		$m = new Escala($map_file);
		$cp->set_data($m->mudaEscalaGrafica($w,$h,$estilo,$intervalos,$unidade,$cor,$bcor,$ocor));
	break;
/*
Section: Seleção

Seleciona elementos do mapa ou processa a seleção existente.
*/
/*
Property: selecaopt

Seleciona elementos utilizando um ponto.

Include:
<classe_selecao.php>
*/	
	case "selecaopt":
		include("classe_selecao.php");
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->selecaoPT($xy,$tipo,$tolerancia));
	break;
/*
Property: selecaoext

Seleciona elementos utilizando a extensão do mapa.

Include:
<classe_selecao.php>
*/	
	case "selecaoext":
		include("classe_selecao.php");
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->selecaoEXT($tipo));
	break;
/*
Property: selecaobox

Seleciona elementos utilizando um retângulo.

Include:
<classe_selecao.php>
*/	
	case "selecaobox":
		include("classe_selecao.php");
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->selecaoBOX($tipo,$ext));
	break;

/*
Property: selecaoatrib

Seleciona elementos com base nos atributos.

Include:
<classe_selecao.php>
*/
	case "selecaoatrib":
		include("classe_selecao.php");
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->selecaoAtributos($tipo,$item,$operador,$valor));
	break;
/*
Property: selecaotema

Sleciona elementos de um tema com base em outro tema.

Include:
<classe_selecao.php>
*/
	case "selecaotema":
		include("classe_selecao.php");
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->selecaoTema($temao,$tipo));
	break;
/*
Property: selecaoPoli

Seleção por poligono (chamado via POST).

Include:
<classe_alteraclasse.php>
*/	
	case "selecaoPoli":
		//esta operação é chamada com POST via cpaint
		//por isso precisa ser executada com start
		$cp->register('selecaoPoli');
		$cp->start();
		restauraCon($map_file,$postgis_mapa);
		$cp->return_data();
	break;
/*
Property: limpasel

Limpa a seleção existente em um tema.

Include:
<classe_selecao.php>
*/
	case "limpasel":
		include("classe_selecao.php");
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->selecaoLimpa());
	break;
/*
Property: incluisel

Incluí elementos em uma seleção.

Include:
<classe_selecao.php>
*/
	case "incluisel":
		include("classe_selecao.php");
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->incluiSel($ids));
	break;
/*
Property: criatemasel

Cria um novo tema com a seleção atual.

Include:
<classe_selecao.php>
*/
	case "criatemasel":
	include("classe_selecao.php");
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->selecao2tema($locaplic,$dir_tmp));
		$m->salva();
	break;
/*
Section: Toponímia

Processa a toponímia de um tema.
*/
/*
Property: criatoponimia

Cria um novo tema com a toponímia do tema atual.

Include:
<classe_toponimia.php>
*/	
	case "criatoponimia":
		include("classe_toponimia.php");
		$m = new Toponimia($map_file,$tema);
		$cp->set_data($m->criaToponimia($item,$position,$partials,$offsetx,$offsety,$minfeaturesize,$mindistance,$force,$shadowcolor,$shadowsizex,$shadowsizey,$outlinecolor,$cor,$sombray,$sombrax,$sombra,$fundo,$angulo,$tamanho,$fonte,$tipo));
		if ($tipo != "teste")
		{$m->salva();}
	break;
/*
Property: ativaEtiquetas

Ativa as etiquetas de um tema.

Include:
<classe_toponimia.php>
*/
	case "ativaEtiquetas":
		include("classe_toponimia.php");
		$m = new Toponimia($map_file,$tema);
		$cp->set_data($m->ativaEtiquetas($item));
		$m->salva();
	break;
/*
Property: removeEtiquetas

Desativa as etiquetas de um tema.

Include:
<classe_toponimia.php>
*/
	case "removeEtiquetas":
		include("classe_toponimia.php");
		$m = new Toponimia($map_file,$tema);
		$cp->set_data($m->removeEtiquetas());
		$m->salva();
	break;
/*
Property: listatruetype

Lista as fontes truetype disponíveis.

Include:
<classe_toponimia.php>
*/
	case "listatruetype":
		$cp->register('listaTrueType');
		restauraCon($map_file,$postgis_mapa);
		$cp->start();
	break;
/*
Section: Outros

Opções de uso geral.
*/
/*
Property: listaDiretorios

Lista os diretórios de um diretório.

*/
	case "listaDiretorios":
		$cp->set_data(listaDiretorios($diretorio));
	break;
/*
Property: listaArquivos

Lista os arquivos de um diretório.

*/
	case "listaArquivos":
		$cp->set_data(listaArquivos($diretorio));
	break;
}
if (!connection_aborted())
{
	restauraCon($map_file,$postgis_mapa);
	$cp->return_data();
}
else
{exit();}
/*
Function: alteraclassesPost

Altera as classes de um tema aplicando novos parâmetros como nome e expressão.

Include:
<classe_alteraclasse.php>
*/
function alteraclassesPost($ids,$nomes,$exps)
{
	global $map_file,$tema,$cp;
	$m = new Alteraclasse($map_file,$tema);
	$m->alteraclasses($ids,$nomes,$exps);
	$m->salva();
}
/*
Function: selecaoPoli

Seleciona um tema por polígono baseado em uma lista de pontos.

Include:
<classe_selecao.php>
*/
function selecaoPoli($xs,$ys,$tema,$tipo)
{
	global $map_file,$cp;
	include("classe_selecao.php");
	$m = new Selecao($map_file,$tema);
	$cp->set_data($m->selecaoPorPoligono($tipo,$xs,$ys));
	$m->salva();
}
/*
Function: redesenhaMapa

Redesenha o mapa e retorna os parâmetros do novo mapa.

Include:
<classe_mapa.php>
*/
function redesenhaMapa()
{
	global $map_file,$locsistemas,$locidentifica,$tipoimagem,$cp,$postgis_mapa,$utilizacgi,$locmapserv;
	if (connection_aborted()){exit();}
	include_once("classe_mapa.php");
	$m = New Mapa($map_file);
	$par = $m->parametrosTemas();
	$imagem = $m->redesenhaCorpo($locsistemas,$locidentifica,$tipoimagem,$utilizacgi,$locmapserv);
	if ($imagem == "erro")
	{
		unlink($map_file);
		copy(str_replace(".map","seguranca.map",$map_file),$map_file);
		$m = New Mapa($map_file);
		$par = $m->parametrosTemas();
		if (isset($utilizacgi) && strtolower($utilizacgi) == "sim")
		{$imagem = "var mapimagem='".$locmapserv."?map=".$map_file."&mode=map&".nomeRandomico()."'";}
		else
		{$imagem = $m->redesenhaCorpo($locsistemas,$locidentifica,$tipoimagem);}
	}
	restauraCon($map_file,$postgis_mapa);
	if (($par == "") || ($imagem == ""))
	{$cp->set_data("erro");}
	else
	{$cp->set_data($imagem.";".$par);}
}
?>