<?php
/*
Title: Inicializa o I3Geo via URL ms_criamapa.php

Cria os diretórios temporários para o i3Geo e o mapfile que será utilizado no mapa. Esse é o programa principal de inicialização, podendo ser chamado diretamente pelo navegador web.

Com o uso de parâmetros específicos é possível alterar o mapa padrão criado no processo de inicialização, como por exemplo, adicionando-se novas camadas ou modificando-se a abrangência espacial do mapa.

A inicialização padrão utiliza uma interface HTML com todas as funcionalidades existentes, porém, é possível escolher outro HTML para a apresentação do mapa, permitindo a criação de mapas com uma interface customizada.

Os parâmetros podem ser utilizados na chamada do i3geo via navegador, p.e.,

http://localhost/i3geo/ms_criamapa.php?temasa=estadosl

A ordem dos parâmetros não é importante, mas o primeiro deve ser precedido de "?". Os demais parâmetros devem ser acrescentados sempre precedidos de "&", p.e.,

http://localhost/i3geo/ms_criamapa.php?temasa=estadosl bioma&layers=estadosl bioma

Caso a inicialização do i3geo ocorra por um outro programa PHP, o ms_criamapa.php deve ser executado via include. Nesse caso, os parâmetros devem ser especificados como variáveis, p.e.,

$temasa=bioma;

include("ms_criamapa.php");


File: i3geo/ms_criamapa.php

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

base - arquivo mapfile que servirá de base para a criação do mapa.Por default, são utilizados os arquivos aplicmap/geral1.map (para linux) ou aplicmap/geral1windows.map (para windows).

temasa - lista, separada por espaços, com os nomes dos arquivos map que serão adicionados ao mapa. Se o arquivo map não estiver no diretório i3geo/temas, o nome deve incluir o caminho completo no servidor. O arquivo map pode conter mais de um layer pois todos os existentes serão adicionados ao mapa. Por default, todos os layers encontrados nos mapfiles são adicionados ao mapa com o status de desenho em OFF.

layers - lista, separada por espaços, com os nomes dos layers que serão ligados. A lista deve conter os nomes dos layers e não os nomes dos mapfiles acrescentados ao mapa. Por exemplo, ao adicionar com "temasa" um mapfile chamado "transporte" que contenha os layers "estradas" e "ferrovias" os dois layers serão adicionados ao mapa. Para que esses dois layers fiquem visíveis no mapa deve-se utilizar &layers=estradas ferrovias.

mapext - extensao geografica que será utilizada. Por padrão, a extensão geográfica é definida para abranger o Brasil todo. Para alterar o padrão deve-se utilizar o parâmetro mapext para especificar a nova abrangência. Essa abrangência deve ser definida em coordenadas no formato décimos de grau e na projeção geográfica. Exemplo: &mapext=-54 -30 -50 -12. Observe que a ordem dos valores são xmin ymin xmax ymax

executa - programa ou função em php que será executado via include. O include é feito no final do processo de inicialização quando a variável $tmpfname já está definida. Essa variável guarda o nome do arquivo mapfile que será utilizado pelo i3geo.

interface - nome da interface que será utilizada para abrir o mapa. As interfaces são arquivos HTML que podem estar no diretório aplicmap. Por default, utiliza-se o geral.htm. Vc pode copiar esse html e alterá-lo para customizar o mapa. Para chamar o html customizado, utilize ms_criamapa.php?interface=meumapa.htm

perfil - perfil utilizado para restringir os menus de temas. O menu com os temas mostrados no i3geo são definidos no arquivo menutemas/menutemas.xml. Nesse arquivo,pode-se utilizar um elemento <PERFIL></PERFIL> indicando que o tema apenas será mostrado em perfis específicos. Por exempo: ms_criamapa.php?perfil=usuário1

caminho - caminho para os programas que serão incluídos com "include". Ao chamar o programa ms_criamapa.php por meio de "include" é necessário especificar essa variável para indicar o caminho correto do i3geo.

pontos - lista de coordenadas x e y que serão adicionadas como pontos no mapa.

nometemapontos - nome do tema de pontos

linhas - lista de coordenadas x e y que serão adicionadas como linhas no mapa. As coordenadas de linhas diferentes devem ser separadas por ",", por exemplo: -54 -12 -50 -12,-50 -1 -50 -2 -50 -3

nometemalinhas - nome do tema de linhas

poligonos - lista de coordenadas x e y que serão adicionadas como polígonos no mapa. As coordenadas dos vértices de polígonos diferentes devem ser separadas por ",".

nometemapoligonos - nome do tema de polígonos

wkt - insere elementos no mapa com coordenadas definidas em wkt

nometemawkt - nome do tema em wkt

debug - ativa o retorno de mensagens de erro do PHP sim|nao
*/
/*
Section: Fluxo do código
*/
$tempo = microtime(1);
/*
Note: Verifica a variável $caminho

Essa variável deve ser definida em programas que utilizam o ms_criamapa.php via include.
Indica onde está o diretório i3geo para que os includes seguintes possam ser localizados.
$caminho é sempre colocada antes do nome dos arquivos que serão incçuídos, p.e., 
require_once ($caminho."classesphp/carrega_ext.php");
*/
if (!isset($caminho)){$caminho = "";}
if (!file_exists($caminho."classesphp/carrega_ext.php"))
{echo "<b> Nao foi possivel localizar o diretório classephp. Provavelmente vc precisara definir a variavel $camino";exit;}
if (isset($_GET["caminho"]))
{$caminho = $_GET["caminho"];}
/*
Note: Carrega as extensões PHP

Carrega as extensões utilizadas no programa de inicialização. 
A carga das extensões geralmente é necessária nas instalações windows (ms4w) ou quando as mesmas não são carregadas pela própria inicialização do PHP.
*/
include_once ($caminho."classesphp/carrega_ext.php");
/*
Note: Include dos arquivos PHP.

Inclui os programas php com funções utilizadas pelo ms_criamapa.php
*/
include_once ($caminho."classesphp/pega_variaveis.php");
include_once ($caminho."classesphp/funcoes_gerais.php");
include_once ($caminho."ms_configura.php");
if (!isset($debug))
{error_reporting(0);$debug="nao";}
else
{error_reporting(E_ALL);$debug="sim";}
/*
Note: Prepara as variáveis que serão incluidas na seção

As variáveis vêm do arquivo ms_configura.php e são armazenadas em uma seção com nome específico para o i3geo.
*/
if (!isset($mapext)){$mapext="";}
$dir_tmp_ = $dir_tmp;
$temasdir_ = $temasdir;
$temasaplic_ = $temasaplic;
$locmapserv_ = $locmapserv;
$locaplic_ = $locaplic;
$locsistemas_ = $locsistemas;
$locidentifica_ = $locidentifica;
$R_path_ = $R_path;
$mapext_ = $mapext;
$locmapas_ = $locmapas;
$postgis_con_ = $postgis_con;
$srid_area_ = $srid_area;
$debug_ = $debug;
$ler_extensoes_ = $ler_extensoes;
$postgis_mapa_ = $postgis_mapa;
$tituloInstituicao_ = $tituloInstituicao;
$atlasxml_ = $atlasxml;
$expoeMapfile_ = $expoeMapfile;
$googleApiKey_ = $googleApiKey;
//
//se houver string de conexão para substituição
//o modo cgi não irá funcionar
//
if($postgis_mapa != "")
{$utilizacgi = "nao";}
if(!isset($perfil)){$perfil="";}
$perfil_ = $perfil;
$utilizacgi_ = $utilizacgi;
if ((isset($navegadoresLocais)) && ($navegadoresLocais != ""))
$navegadoresLocais_ = "sim";
else
$navegadoresLocais_ = "nao";
/*
Note: Inicia a seção

O i3geo inicia uma seção específica no servidor, denominada i3GeoPHP.
Se já houver uma seção aberta, em função de outro browser estar ativo, cria uma nova. Faz a cópia das variáveis definidas para itens da seção.
*/
session_name("i3GeoPHP");
session_start();
if (!isset($g_sid)){$g_sid="";}
if(isset($_SESSION["map_file"]) || $g_sid!="")
{session_regenerate_id();}

/*
Note: Aguarde

Monta a apresentação do aguarde.

Aqui é necessário verificar se $executa está definido
isso pq algumas aplicações podem ser prejudicadas caso o aguarde seja mostrado
*/
if (!isset($executa))
{mostraAguarde();}

$_SESSION["dir_tmp"] = $dir_tmp_;
$_SESSION["temasdir"] = $temasdir_;
$_SESSION["temasaplic"] = $temasaplic_;
$_SESSION["locmapserv"] = $locmapserv_;
$_SESSION["locaplic"] = $locaplic_;
$_SESSION["locsistemas"] = $locsistemas_;
$_SESSION["locidentifica"] = $locidentifica_;
$_SESSION["R_path"] = $R_path_;
$_SESSION["mapext"] = $mapext_;
$_SESSION["locmapas"] = $locmapas_;
$_SESSION["postgis_con"] = $postgis_con_;
$_SESSION["srid_area"] = $srid_area_;
$_SESSION["debug"] = $debug_;
$_SESSION["ler_extensoes"] = $ler_extensoes_;
$_SESSION["postgis_mapa"] = $postgis_mapa_;
$_SESSION["perfil"] = $perfil_;
$_SESSION["navegadoresLocais"] = $navegadoresLocais_;
$_SESSION["utilizacgi"] = $utilizacgi_;
$_SESSION["tituloInstituicao"] = $tituloInstituicao_;
$_SESSION["atlasxml"] = $atlasxml;
$_SESSION["expoeMapfile"] = $expoeMapfile;
$_SESSION["googleApiKey"] = $googleApiKey_;
//rotina de segurança, ver http://shiflett.org/articles/the-truth-about-sessions
$fingerprint = 'I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'];
$_SESSION['fingerprint'] = md5($fingerprint . session_id());
//
//pega todas as variáveis da sessão, mesmo as que foram definidas anteriormente
//
foreach(array_keys($_SESSION) as $k)
{eval("\$".$k."='".$_SESSION[$k]."';");}
$postgis_mapa = $postgis_mapa_;
/*
Note: Define os arquivos .map 

Seleciona os arquivos mapfile que serão carregados como base conforme o tipo de sistema operacional.

A variável $base pode ser definida como um parâmetro na inicialização, caso contrário, é utilizado o padrão.

Os arquivos .map padrão são armazenados em i3geo/aplicmap.
O arquivo é lido conforma a característica do sistema operacional.

*/
if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
{
	if (!isset($base) || $base == ""){$base = "geral1windows";}
	$estadosl = "estadoslwindows";
}
else
{
	if (!isset($base) || $base == ""){$base = "geral1";}
	$estadosl = "estadosl";
}
if (file_exists($base))
{$mapdefault = ms_newMapObj($base);}
else
{$mapdefault = ms_newMapObj($temasaplic."/".$base.".map");}
/*
Note: Parâmetros adicionais.

Processa os parâmetros para a inicialização verificando se foram passados pela URL ou não.
*/
if (!isset($mapext))
{$mapext = $mapdefault->extent->minx." ".$mapdefault->extent->miny." ".$mapdefault->extent->maxx." ".$mapdefault->extent->maxy;}
if (!isset ($map_reference_image)) //arquivo com a imagem de refer&ecirc;ncia
{$map_reference_image = $mapdefault->reference->image;}
if (!isset ($map_reference_extent)) //extens&atilde;o geogr&aacute;fica da imagem do mapa de refer&ecirc;ncia
{$map_reference_extent = $mapdefault->reference->extent->minx." ".$mapdefault->reference->extent->miny." ".$mapdefault->reference->extent->maxx." ".$mapdefault->reference->extent->maxy;}
if (!isset($interface))
{$interface = "geral.htm";}
/*
Note: Diretórios temporários

Cria os diretórios temporários que serão utilizados pelo i3geo para armazenar as imagens e outros dados. 
*/
$diretorios = criaDirMapa($dir_tmp);
if(!$diretorios)
{echo "<p style=color:red ><b>N&atilde;o foi po&iacute;vel criar os diret&oacute;rios tempor&aacute;rios em $dir_tmp.</b></p>";exit;}
$_SESSION["mapdir"] = $diretorios[1];
$_SESSION["imgdir"] = $diretorios[2];
criaIndex();
/*
Note: Cria os objetos map que serão processados

O arquivo definido em $base é lido como um objeto map. Esse objeto será processado para incluir novos layers e alterar outros parâmetros definidos pelo usuário.
*/
ms_ResetErrorList();
if (file_exists($base))
{
	$map = ms_newMapObj($base);
	$mapn = ms_newMapObj($base);	
}
else
{
	$map = ms_newMapObj($temasaplic."/".$base.".map");
	$mapn = ms_newMapObj($temasaplic."/".$base.".map");
}
$error = ms_GetErrorObj();
while($error && $error->code != MS_NOERR)
{
	printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
	$error = $error->next();
}
ms_ResetErrorList();
/*
Note: Incluí temas

Verifica a lista de temas da inicializacao, adicionando-os se necessário
*/
incluiTemasIniciais();
$error = ms_GetErrorObj();
while($error && $error->code != MS_NOERR)
{
	printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
	$error = $error->next();
}
ms_ResetErrorList();
/*
Note: Liga os temas definidos em $layers
*/
ligaTemas();
$error = ms_GetErrorObj();
while($error && $error->code != MS_NOERR)
{
	printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
	$error = $error->next();
}
ms_ResetErrorList();
/*
Note: Aplica ao mapa os parâmetros passados pela URL
*/
if (isset($map_reference_image))
{$mapn->reference->set("image",$map_reference_image);}
$extr = $mapn->reference->extent;
if (isset($map_reference_extent))
{
	$temp = explode(" ",$map_reference_extent);
	foreach ($temp as $t)
	{
		if ($t != "")
		{$newext[] = $t;}
	}
	if (count($newext) == 4)
	{$extr->setextent($newext[0], $newext[1], $newext[2], $newext[3]);}
}
$ext = $mapn->extent;
$newext = array();
if ((isset($mapext)) && ($mapext != ""))
{
	$temp = explode(" ",$mapext);
	foreach ($temp as $t)
	{
		if ($t != "")
		{$newext[] = $t;}
	}
	if (count($newext) == 4)
	{$ext->setextent($newext[0], $newext[1], $newext[2], $newext[3]);}
}
$error = ms_GetErrorObj();
while($error && $error->code != MS_NOERR)
{
	printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
	$error = $error->next();
}
ms_ResetErrorList();
/*
Note: Configura os endereços corretos no mapfile.

Altera as propriedades imagepath e imageurl corrigindo os caminhos padrão conforme o diretório criado para armazenar o mapa de trabalho.
*/
$protocolo = strtolower(explode("/",$_SERVER['SERVER_PROTOCOL']));
$w = $mapn->web;
$atual = $w->imagepath;
$w->set("imagepath",$atual.$diretorios[2]."/");
$atual = $w->imageurl;
$w->set("imageurl",$atual.$diretorios[2]."/");
$salvo = $mapn->save($diretorios[0]);
$_SESSION["imgurl"] = $protocolo[0]."://".$_SERVER['HTTP_HOST'].$atual.$diretorios[2]."/";
$_SESSION["tmpurl"] = $protocolo[0]."://".$_SERVER['HTTP_HOST'].$atual;
/*
Note: Faz o include de um programa se tiver sido passado pela URL (parâmetro &executa)

Nessa altura do processo, a variável $tmpfname guarda o nome do mapfile que será utilizado pelo i3geo.

Esse mapfile pode ser modificado pelo programa que será incluido.
*/
$tmpfname = $diretorios[0];
$_SESSION["map_file"] = $diretorios[0];
$_SESSION["mapext"] = $mapext;
if (isset($executa))
{
	if (file_exists($executa))
	{include_once ($executa);}
	if (function_exists($executa))
	{eval($executa."();");}
}
$error = ms_GetErrorObj();
while($error && $error->code != MS_NOERR)
{
	printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
	$error = $error->next();
}
ms_ResetErrorList();
/*
Note: Inclui uma camada de pontos utilizando os parâmetros passados pela URL
*/
if (isset($wkt))
{insereWKTUrl();}
$error = ms_GetErrorObj();
while($error && $error->code != MS_NOERR)
{
	printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
	$error = $error->next();
}
ms_ResetErrorList();
if (isset($pontos))
{inserePontosUrl();}
$error = ms_GetErrorObj();
while($error && $error->code != MS_NOERR)
{
	printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
	$error = $error->next();
}
ms_ResetErrorList();
/*
Note: Inclui uma camada de linhas utilizando os parâmetros passados pela URL
*/
if (isset($linhas))
{insereLinhasUrl();}
$error = ms_GetErrorObj();
while($error && $error->code != MS_NOERR)
{
	printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
	$error = $error->next();
}
ms_ResetErrorList();
/*
Note: Inclui uma camada de polígonos utilizando os parâmetros passados pela URL
*/
if (isset($poligonos))
{inserePoligonosUrl();}
$error = ms_GetErrorObj();
while($error && $error->code != MS_NOERR)
{
	printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
	$error = $error->next();
}
ms_ResetErrorList();
//
//se vc quiser parar o script aqui, para verificar erros, descomente a linha abaixo
//
//exit
/*
Note: Adapta os dados de cada layer.

Faz alterações em cada layer caso sejam necessárias.
*/
$mapa = ms_newMapObj($tmpfname);
$path = $mapa->shapepath;
for($i=0;$i<($mapa->numlayers);++$i)
{
	$layer = $mapa->getLayer($i);
	$ok = true;
	if ($layer->connection == "")
	{
		$ok = false;
		$d = $layer->data;
		if((file_exists($d)) || (file_exists($d.".shp")))
		{$ok = true;}
		else
		{
			if((file_exists($path."/".$d)) || (file_exists($path."/".$d.".shp")))
			{$ok = true;}
		}
	}
	if ($ok == false)
	{$layer->set("status",MS_OFF);}
}
$mapa->save($tmpfname);
/*
Note: Obtem o IP do usuário e registra no banco de dados.

Essa função pode ser comentada sem prejuízos ao funcionamento do I3Geo.
Só opera corretamente se a rotina de registro tiver sido configurada corretamente.
*/
require_once($caminho."ms_registraip.php");
/*
Note: Gera a url para abrir o mapa

interface = arquivo html que será aberto
*/
if ($interface != "mashup")
{
	if (count(explode(".php",$interface)) > 1)
	{
		if (file_exists($caminho."aplicmap/".$interface))
		{include_once($caminho."aplicmap/".$interface);}
		else 
		{include_once($interface);}
		exit;
	}
	else
	{
		echo "<br><br><span style='color:gray;font-size: 10px;font-family: Verdana, Arial, Helvetica, sans-serif;' >Tempo de processamento no servidor em segundos: ".((microtime(1) - $tempo))."<span>";

		if (file_exists($caminho."aplicmap/".$interface))
		{$urln = $caminho."aplicmap/".$interface."?".session_id();}
		else 
		{$urln = $interface."?".session_id();}
		//header("Location:".$urln);
		echo "<meta http-equiv='refresh' content='0;url=$urln'>";
	}
}
//////////////////////////////////////////////////////////////////////////////
//funções
/////////////////////////////////////////////////////////////////////////////
/*
Function: ligaTemas

Liga os temas definidos na variável $layers

*/
function ligaTemas()
{
	global $layers,$mapn;
	if (isset($layers))
	{
		$layers = str_replace(','," ",$layers);
		$lista = explode(" ", $layers);
		foreach ($lista as $l)
		{
			if ($l == "")
			{continue;}
			if(@$mapn->getLayerByName($l))
			{$layern = $mapn->getLayerByName($l);$layern->set("status",MS_DEFAULT);}
			$grupos = $mapn->getLayersIndexByGroup($l);
			if(count($grupos) > 0)
			{
				for ($i = 0;$i < count($grupos);++$i)
				{
					$layern = $mapn->getLayer($grupos[$i]);
					if(strtolower($layern->group) == strtolower($l))
					{
						$layern->set("status",MS_DEFAULT);
					}
				}
			}
		}
	}
}
/*
Function: incluiTemasIniciais

Inclui os temas definidos na variável $temasa

*/
function incluiTemasIniciais()
{
	global $temasa,$estadosl,$temasaplic,$temasdir,$mapn;
	if (!isset($temasa)){$temasa = $estadosl;}
	$temasa = str_replace(','," ",$temasa);
	$alayers = explode(" ",$temasa);
	$existeraster = false;
	foreach ($alayers as $arqt)
	{
		$arqtemp = "";
		$arqt = trim($arqt);
		if ($arqt == "")
		{continue;}
		if (file_exists($arqt))
		{$arqtemp = $arqt;}
		if ((strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) && (file_exists($temasaplic."\\".$arqt.".map")))
		{$arqtemp = $temasaplic."\\".$arqt.".map";}
		elseif (file_exists($temasaplic."/".$arqt.".map"))
		{$arqtemp = $temasaplic."/".$arqt.".map";}
		if ((strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) && (file_exists($temasdir."\\".$arqt.".map")))
		{$arqtemp = $temasdir."\\".$arqt.".map";}
		elseif (file_exists($temasdir."/".$arqt.".map"))
		{$arqtemp = $temasdir."/".$arqt.".map";}
		if ($arqtemp == "")
		{echo "<br>Imposs&iacute;vel acessar tema $arqtemp";}
		else
		{
			if (!@ms_newMapObj($arqtemp))
			{echo "<br>Problemas com a camada $arqtemp<br>";}
			else
			{
				$maptemp = @ms_newMapObj($arqtemp);
				for($i=0;$i<($maptemp->numlayers);++$i)
				{
					$layern = $maptemp->getLayer($i);
					if($layern->type == MS_LAYER_RASTER)
					{$existeraster = true;}
					if ($layern->name == "estadosl")
					{$layern->set("data",$temasaplic."/dados/estados.shp");}
					$layern->setmetadata("NOMEORIGINAL",$layern->name);
					autoClasses(&$layern,$mapn);
					ms_newLayerObj(&$mapn, $layern);
				}
			}	
		}
	}
	//
	//muda para RGB para melhorar o desenho da imagem raster
	//
	if($existeraster)
	{
		$of = &$mapn->outputformat;
		$of->set("imagemode",MS_IMAGEMODE_RGB);
	}
}
/*
Function: criaIndex

Cria os arquivos vazios index.htm e index.html nos diretórios temporários

*/
function criaIndex()
{
	global $dir_tmp,$diretorios;
	if (!file_exists($dir_tmp."/index.htm"))
	{
		$f = fopen($dir_tmp."/index.htm",x);
		fclose($f);
		$f = fopen($dir_tmp."/index.html",x);
		fclose($f);
		$f = fopen($dir_tmp."/".$diretorios[1]."/index.html",x);
		fclose($f);
		$f = fopen($dir_tmp."/".$diretorios[1]."/index.htm",x);
		fclose($f);
		$f = fopen($dir_tmp."/".$diretorios[2]."/index.html",x);
		fclose($f);
		$f = fopen($dir_tmp."/".$diretorios[2]."/index.htm",x);
		fclose($f);
	}
	if (!file_exists($dir_tmp."/index.htm"))
	{
		echo "Erro. Não foi possível gravar no diretório temporário";
		exit;
	}
}
/*
Function: MostraAguarde

Mostra a mensagem de aguarde

Globals:

$interface

$caminho

$mensagemInicia

$tituloInstituicao
*/
function mostraAguarde()
{
	global $interface,$caminho,$mensagemInicia,$tituloInstituicao;
	if (!isset($interface))
	{
		echo "<html><head>";
		echo "<title>".$tituloInstituicao."</title>";
		echo '<div id="aguarde"><center>';
		echo '<p class=paguarde style="font-family: Verdana, Arial, Helvetica, sans-serif;color:black;text-align:center;font-size:12pt"><b>'.$mensagemInicia.'</b><br> Aguarde...preparando o mapa</p>';
		echo '<table><tr>';
		echo "<td colspan=3 ><center><img src='".$caminho."imagens/i3geo1.jpg'></td></tr>";
		echo "<tr><td><center><img src='".$caminho."imagens/pspb.png'></td>";
		echo "<td><center><img src='".$caminho."imagens/mapserv.png'></td>";
		echo "<td><center><a href='http://mapas.mma.gov.br/download' target=blank ><img src='".$caminho."imagens/somerights20_pt.gif' ></a></td>";
		echo "</tr></table>";
		echo '<BODY bgcolor="white" style="background-color:white">';
	}
}
/*
Function: insereWKTUrl

Insere elementos no mapa a partir de uma string definida em wkt

Globals:

$wkt - string no formato wkt

$nometemawkt - nome do tema que será criado
*/
function insereWKTUrl()
{
	global $wkt,$nometemawkt,$dir_tmp,$imgdir,$tmpfname,$locaplic;
	include_once "pacotes/phpxbase/api_conversion.php";
	if (!isset($nometemapontos))
	{$nometemapontos="WKT";}
	if ($nometemapontos == "")
	{$nometemapontos="WKT";}
	//
	//cria o shape file
	//
	$shape = ms_shapeObjFromWkt($wkt);
	$tipol = $shape->type;
	if($tipol == 0){$tipol = 3;}
	$nomeshp = $dir_tmp."/".$imgdir."/wkts";
	// cria o dbf
	$def = array();
	$items = array("COORD");
	foreach ($items as $ni)
	{$def[] = array($ni,"C","254");}
	xbase_create($nomeshp.".dbf", $def);
	$dbname = $nomeshp.".dbf";
	$db=xbase_open($dbname,2);
	if ($tipol == 1)
	{$novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_ARC);}
	if ($tipol == 3)
	{$novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_MULTIPOINT);}
	if ($tipol == 2)
	{$novoshpf = ms_newShapefileObj($nomeshp, MS_SHP_POLYGON);}	
	$reg[] = "";
	$novoshpf->addShape($shape);
	xbase_add_record($db,$reg);
	$novoshpf->free();
	xbase_close($db);
	//adiciona o layer
	$mapa = ms_newMapObj($tmpfname);
	$layer = ms_newLayerObj($mapa);
	$layer->set("name","wktins");
	$layer->set("data",$nomeshp);
	$layer->setmetadata("tema",$nometemawkt);
	$layer->setmetadata("classe","sim");
	$layer->set("type",$shape->type);
	$layer->set("status",MS_DEFAULT);
	$classe = ms_newClassObj($layer);
	$estilo = ms_newStyleObj($classe);
	if($shape->type == 0)
	{
		$estilo->set("symbolname","ponto");
		$estilo->set("size",6);
	}
	if($shape->type == 1)
	{
		$estilo->set("symbolname","linha");
		$estilo->set("size",3);
	}
	if($shape->type == 2)
	{$layer->set("transparency","50");}
	$cor = $estilo->color;
	$cor->setRGB(255,0,0);
	$salvo = $mapa->save($tmpfname);
}
/*
Function: inserePontosUrl

Insere um tema do tipo ponto

Globals:

$pontos - lista de coordenadas x,y

$nometemapontos - nome do tema que será criado

*/
function inserePontosUrl()
{
	global $pontos,$nometemapontos,$dir_tmp,$imgdir,$tmpfname,$locaplic;
	include_once "pacotes/phpxbase/api_conversion.php";
	if (!isset($nometemapontos))
	{$nometemapontos="Pontos";}
	if ($nometemapontos == "")
	{$nometemapontos="Pontos";}
	//
	//cria o shape file
	//
	$tipol = MS_SHP_POINT;
	$nomeshp = $dir_tmp."/".$imgdir."/pontosins";
	// cria o dbf
	$def = array();
	$items = array("COORD");
	foreach ($items as $ni)
	{$def[] = array($ni,"C","254");}
	xbase_create($nomeshp.".dbf", $def);
	$dbname = $nomeshp.".dbf";
	$db=xbase_open($dbname,2);
	$novoshpf = ms_newShapefileObj($nomeshp, $tipol);
	$pontos = explode(" ",trim($pontos));
	if(count($pontos) == 0)
	$pontos = explode(",",trim($pontos));
	foreach ($pontos as $p)
	{if (is_numeric($p)){$pontosn[] = $p;}}
	$pontos = $pontosn;
	for ($ci = 0;$ci < count($pontos);$ci=$ci+2)
	{
		$reg = array();
		$reg[] = $pontos[$ci]." ".$pontos[$ci+1];
		$shape = ms_newShapeObj($tipol);
		$linha = ms_newLineObj();
		$linha->addXY($pontos[$ci],$pontos[$ci+1]);
		$shape->add($linha);
		$novoshpf->addShape($shape);
		xbase_add_record($db,$reg);
	}
	$novoshpf->free();
	xbase_close($db);
	//adiciona o layer
	$mapa = ms_newMapObj($tmpfname);
	$layer = ms_newLayerObj($mapa);
	$layer->set("name","pontoins");
	$layer->set("data",$nomeshp);
	$layer->setmetadata("tema",$nometemapontos);
	$layer->setmetadata("classe","sim");
	$layer->setmetadata("ATLAS","nao");
	$layer->set("type",MS_LAYER_POINT);
	$layer->set("status",MS_DEFAULT);
	$classe = ms_newClassObj($layer);
	$estilo = ms_newStyleObj($classe);
	$estilo->set("symbolname","ponto");
	$estilo->set("size",6);
	$cor = $estilo->color;
	$cor->setRGB(255,0,0);
	$salvo = $mapa->save($tmpfname);
}
/*
Function: insereLinhasUrl

Insere um tema do tipo linear

As linhas devem ter os pontos separados por espaços e cada linha separada por vírgula

Globals:

$linhas - lista de coordenadas

$nometemalinhas - nome do tema que será criado
*/
function insereLinhasUrl()
{
	global $linhas,$nometemalinhas,$dir_tmp,$imgdir,$tmpfname,$locaplic;
	include_once "pacotes/phpxbase/api_conversion.php";
	if (!isset($nometemalinhas))
	{$nometemalinhas="Linhas";}
	if ($nometemalinhas == "")
	{$nometemalinhas="Linhas";}
	//
	//cria o shape file
	//
	$tipol = MS_SHP_ARC;
	$nomeshp = $dir_tmp."/".$imgdir."/linhains";
	// cria o dbf
	$def = array();
	$items = array("COORD");
	foreach ($items as $ni)
	{$def[] = array($ni,"C","254");}
	xbase_create($nomeshp.".dbf", $def);
	$dbname = $nomeshp.".dbf";
	$db=xbase_open($dbname,2);
	$novoshpf = ms_newShapefileObj($nomeshp, $tipol);
	$linhas = explode(",",trim($linhas));
	$pontosLinhas = array(); //guarda os pontos de cada linha em arrays
	foreach ($linhas as $l)
	{
		$tempPTs = explode(" ",trim($l));
		$temp = array();
		foreach ($tempPTs as $p)
		if (is_numeric($p)){$temp[] = $p;}
		$pontosLinhas[] = $temp;
	}
	foreach ($pontosLinhas as $ptsl)
	{
		$linhas = $ptsl;
		$shape = ms_newShapeObj($tipol);
		$linha = ms_newLineObj();
		$reg = array();
		$reg[] = "";
		for ($ci = 0;$ci < count($linhas);$ci=$ci+2)
		{
			$linha->addXY($linhas[$ci],$linhas[$ci+1]);
			$shape->add($linha);
		}
		$novoshpf->addShape($shape);
		xbase_add_record($db,$reg);
	}
	$novoshpf->free();
	xbase_close($db);
	//adiciona o layer
	$mapa = ms_newMapObj($tmpfname);
	$layer = ms_newLayerObj($mapa);
	$layer->set("name","linhains");
	$layer->set("data",$nomeshp);
	$layer->setmetadata("tema",$nometemalinhas);
	$layer->setmetadata("classe","sim");
	$layer->setmetadata("ATLAS","nao");
	$layer->set("type",MS_LAYER_LINE);
	$layer->set("status",MS_DEFAULT);
	$classe = ms_newClassObj($layer);
	$estilo = ms_newStyleObj($classe);
	$estilo->set("symbolname","linha");
	$estilo->set("size",3);
	$cor = $estilo->color;
	$cor->setRGB(255,0,0);
	$salvo = $mapa->save($tmpfname);
}
/*
Function: inserePoligonosUrl

Insere um tema poligonal.

Os polígonos devem ter os pontos separados por espaços e cada polígono separado por vírgula

Globals:

$poligonos - lista de coordenadas

$nometemapoligonos - nome do tema que será criado

*/
function inserePoligonosUrl()
{
	global $poligonos,$nometemapoligonos,$dir_tmp,$imgdir,$tmpfname,$locaplic;
	include_once "pacotes/phpxbase/api_conversion.php";
	if (!isset($nometemapoligonos))
	{$nometemapoligonos="Poligonos";}
	if ($nometemapoligonos == "")
	{$nometemapoligonos="Poligonos";}
	//
	//cria o shape file
	//
	$tipol = MS_SHP_POLYGON;
	$nomeshp = $dir_tmp."/".$imgdir."/poligonosins";
	// cria o dbf
	$def = array();
	$items = array("COORD");
	foreach ($items as $ni)
	{$def[] = array($ni,"C","254");}
	xbase_create($nomeshp.".dbf", $def);
	$dbname = $nomeshp.".dbf";
	$db=xbase_open($dbname,2);
	$novoshpf = ms_newShapefileObj($nomeshp, $tipol);
	$linhas = explode(",",trim($poligonos));
	$pontosLinhas = array(); //guarda os pontos de cada linha em arrays
	foreach ($linhas as $l)
	{
		$tempPTs = explode(" ",trim($l));
		$temp = array();
		foreach ($tempPTs as $p)
		if (is_numeric($p)){$temp[] = $p;}
		$pontosLinhas[] = $temp;
	}
	foreach ($pontosLinhas as $ptsl)
	{
		$linhas = $ptsl;
		$shape = ms_newShapeObj($tipol);
		$linha = ms_newLineObj();
		$reg = array();
		$reg[] = "";
		for ($ci = 0;$ci < count($linhas);$ci=$ci+2)
		{
			$linha->addXY($linhas[$ci],$linhas[$ci+1]);
			
		}
		$shape->add($linha);
		$novoshpf->addShape($shape);
		xbase_add_record($db,$reg);
	}
	$novoshpf->free();
	xbase_close($db);
	//adiciona o layer
	$mapa = ms_newMapObj($tmpfname);
	$layer = ms_newLayerObj($mapa);
	$layer->set("name","linhains");
	$layer->set("data",$nomeshp);
	$layer->setmetadata("tema",$nometemapoligonos);
	$layer->setmetadata("classe","sim");
	$layer->setmetadata("ATLAS","nao");
	$layer->set("type",MS_LAYER_POLYGON);
	$layer->set("transparency","50");
	$layer->set("status",MS_DEFAULT);
	$classe = ms_newClassObj($layer);
	$estilo = ms_newStyleObj($classe);
	//$estilo->set("symbolname","linha");
	//$estilo->set("size",3);
	$cor = $estilo->color;
	$cor->setRGB(255,0,0);
	$salvo = $mapa->save($tmpfname);
}
?>