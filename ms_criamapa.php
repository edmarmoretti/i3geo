<?php
/*
Title: Inicializa o i3Geo via URL ms_criamapa.php

Esse é o programa principal de inicialização, podendo ser chamado diretamente pelo navegador web.

Cria os diretórios temporários em ms_tmp, incluindo o mapfile (http://mapserver.org/mapfile/index.html#mapfile) que será a base para o funcionamento do mapa. 

Com o uso de parâmetros é possível alterar o processo padrão de criação do mapa, como por exemplo, podem ser adicionadas novas camadas ou modificada a abrangência espacial do mapa.

A inicialização padrão abrirá uma interface HTML com todas as funcionalidades disponíveis, porém é possível escolher qualquer outro HTML para a apresentação do mapa.

No diretório i3geo/interface estão os arquivos HTML que formatam a apresentação do mapa. Além desses arquivos, podem ser criados outros, conforme a necessidade do usuário.

Os parâmetros podem ser utilizados na chamada do i3geo via navegador, p.e.,

http://localhost/i3geo/ms_criamapa.php?temasa=estadosl

A ordem dos parâmetros não é importante, mas o primeiro deve ser precedido de "?". Os demais parâmetros devem ser acrescentados sempre precedidos de "&", p.e.,

http://localhost/i3geo/ms_criamapa.php?temasa=estadosl bioma&layers=estadosl bioma

Caso a inicialização do i3geo ocorra por um outro programa PHP, o ms_criamapa.php deve ser executado via include. Nesse caso, os parâmetros devem ser especificados como variáveis, p.e.,

$temasa=bioma;

include("ms_criamapa.php");

Observações:

Os cookies passados ao servidor são eliminados com a linha

$_COOKIE = array();

Se a sua aplicação precisa de cookies, comente essa linha do programa.

A interface HTML padrão de abertura do mapa é definido em uma variável no arquivo ms_configura.php, podendo ser alterada se necessário.

Link:

http://localhost/i3geo/ms_criamapa.php

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

Arquivo: i3geo/ms_criamapa.php

Parametros:

base - arquivo mapfile que servirá de base para a criação do mapa.Por default, são utilizados os arquivos aplicmap/geral1.map (para linux) ou aplicmap/geral1windows.map (para windows).

temasa - lista, separada por espaços, com os nomes dos arquivos map que serão adicionados ao mapa. Se o arquivo map não estiver no diretório i3geo/temas, o nome deve incluir o caminho completo no servidor. O arquivo map pode conter mais de um layer pois todos os existentes serão adicionados ao mapa. Por default, todos os layers encontrados nos mapfiles são adicionados ao mapa com o status de desenho em OFF.

layers - lista, separada por espaços, com os nomes dos layers que serão ligados. A lista deve conter os nomes dos layers e não os nomes dos mapfiles acrescentados ao mapa. Por exemplo, ao adicionar com "temasa" um mapfile chamado "transporte" que contenha os layers "estradas" e "ferrovias" os dois layers serão adicionados ao mapa. Para que esses dois layers fiquem visíveis no mapa deve-se utilizar &layers=estradas ferrovias.

desligar - lista com os nomes dos temas que serão forçados a inicializar desligados, ou seja, com STATUS OFF

mapext - extensao geografica que será utilizada. Por padrão, a extensão geográfica é definida para abranger o Brasil todo. Para alterar o padrão deve-se utilizar o parâmetro mapext para especificar a nova abrangência. Essa abrangência deve ser definida em coordenadas no formato décimos de grau e na projeção geográfica. Exemplo: &mapext=-54 -30 -50 -12. Observe que a ordem dos valores são xmin ymin xmax ymax

executa - programa ou função em php que será executado via include. O include é feito no final do processo de inicialização quando a variável $tmpfname já está definida. Essa variável guarda o nome do arquivo mapfile que será utilizado pelo i3geo.

interface - nome da interface que será utilizada para abrir o mapa. As interfaces são arquivos HTML que podem estar no diretório aplicmap. Por default, utiliza-se o geral.htm. Vc pode copiar esse html e alterá-lo para customizar o mapa. Para chamar o html customizado, utilize ms_criamapa.php?interface=meumapa.htm

perfil - perfil utilizado para restringir os menus de temas. ms_criamapa.php?perfil=usuário1

caminho - caminho para os programas que serão incluídos com "include". Ao chamar o programa ms_criamapa.php por meio de "include" é necessário especificar essa variável para indicar o caminho correto do i3geo.

pontos - lista de coordenadas x e y que serão adicionadas como pontos no mapa.

nometemapontos - nome do tema de pontos

linhas - lista de coordenadas x e y que serão adicionadas como linhas no mapa. As coordenadas de linhas diferentes devem ser separadas por ",", por exemplo: -54 -12 -50 -12,-50 -1 -50 -2 -50 -3

nometemalinhas - nome do tema de linhas

poligonos - lista de coordenadas x e y que serão adicionadas como polígonos no mapa. As coordenadas dos vértices de polígonos diferentes devem ser separadas por ",".

nometemapoligonos - nome do tema de polígonos

simbolo - nome do símbolo que será utilizado para desenhar os elementos inseridos (veja arquivo de símbolos em i3geo/symbols)

corsimbolo - cor do símbolo definido em RGB separados por espaço ou vírgula

tamanhosimbolo - tamanho do símbolo em pixels

wkt - insere elementos no mapa com coordenadas definidas em wkt

nometemawkt - nome do tema em wkt

idioma - idioma da interface (veja os idiomas disponíveis em classe_idioma.js)

kmlurl - url de um arquivo KML que será incluido no mapa. Válido apenas na interface google maps

url_wms - endereço de um WMS (será incluido como uma camada no mapa)

layer_wms - nome do layer

style_wms - estilo do layer

nome_wms - nome da camada (titulo)

srs_wms - código da projeção

image_wms - tipo de imagem disponível

versao_wms - Versão do WMS (necessário quando da inclusão de uma camada WMS diretamente pela URL)

gvsiggvp - endereço no servidor do arquivo de projeto gvSig (gvp) que será utilizado para construir o mapa (experimental)

gvsigview - nome da view do projeto gvSig
*/

/*
Verifica a variável $caminho

Essa variável deve ser definida em programas que utilizam o ms_criamapa.php via include.
Indica onde está o diretório i3geo para que os includes seguintes possam ser localizados.
$caminho é sempre colocada antes do nome dos arquivos que serão incluídos, p.e., 
require_once ($caminho."classesphp/carrega_ext.php");
*/
//$_COOKIE = array();
if (!isset($caminho)){$caminho = "";}
if (!file_exists($caminho."classesphp/carrega_ext.php"))
{echo "<b> Nao foi possivel localizar o diretório classephp. Provavelmente vc precisara definir a variavel $camino";exit;}
if (isset($_GET["caminho"]))
{$caminho = $_GET["caminho"];}
/*
 Carrega as extensões PHP

Carrega as extensões utilizadas no programa de inicialização. 
A carga das extensões geralmente é necessária nas instalações windows (ms4w) ou quando as mesmas não são carregadas pela própria inicialização do PHP.
*/
include_once ($caminho."classesphp/carrega_ext.php");
/*
Include dos arquivos PHP.

Inclui os programas php com funções utilizadas pelo ms_criamapa.php
*/
include_once ($caminho."classesphp/pega_variaveis.php");
include_once ($caminho."classesphp/funcoes_gerais.php");
if(!isset($dir_tmp))
{include_once ($caminho."ms_configura.php");}

if (!isset($debug))
{error_reporting(0);$debug="nao";}
else
{error_reporting(E_ALL);$debug="sim";}

/*
Define o cookie para o idioma da interface
*/
if(isset($idioma) && $idioma != "")
setcookie("i3geolingua", $idioma);
/*
Cria os diretórios temporários que serão utilizados pelo i3geo para armazenar as imagens e outros dados. 
*/
$diretorios = criaDirMapa($dir_tmp);
if(!$diretorios)
{echo "<p style=color:red ><b>N&atilde;o foi poss&iacute;vel criar os diret&oacute;rios tempor&aacute;rios em $dir_tmp.</b></p>";exit;}
criaIndex();
$tmpfname = $diretorios[0];
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
/*
 Prepara as variáveis que serão incluidas na seção

As variáveis vêm do arquivo ms_configura.php e são armazenadas em uma seção com nome específico para o i3geo.
*/
if (!isset($mapext)){$mapext="";}
$dir_tmp_ = $dir_tmp;
$locmapserv_ = $locmapserv;
$locaplic_ = $locaplic;
//$locsistemas_ = $locsistemas;
//$locidentifica_ = $locidentifica;
$R_path_ = $R_path;
$mapext_ = $mapext;
$locmapas_ = $locmapas;
$debug_ = $debug;
$ler_extensoes_ = $ler_extensoes;
$postgis_mapa_ = $postgis_mapa;
$tituloInstituicao_ = $tituloInstituicao;
//$atlasxml_ = $atlasxml;
$expoeMapfile_ = $expoeMapfile;
$googleApiKey_ = $googleApiKey;
$mensagemInicia_ = $mensagemInicia;
$interfacePadrao_ = $interfacePadrao;
if(isset($interface)){$interface_ = $interface;}
else{$interface_ = $interfacePadrao;}
if(isset($kmlurl)){$kmlurl_ = $kmlurl;}
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
 Inicia a seção

O i3geo inicia uma seção específica no servidor, denominada i3GeoPHP.
Se já houver uma seção aberta, em função de outro browser estar ativo, cria uma nova. Faz a cópia das variáveis definidas para itens da seção.
*/
session_name("i3GeoPHP");
session_start();
if (!isset($g_sid)){$g_sid="";}
if(isset($_SESSION["map_file"]) || $g_sid!="")
{session_regenerate_id();}
/*
 Aguarde

Monta a apresentação do aguarde.

Aqui é necessário verificar se $executa está definido
isso pq algumas aplicações podem ser prejudicadas caso o aguarde seja mostrado
*/
$_SESSION["dir_tmp"] = $dir_tmp_;
$_SESSION["locmapserv"] = $locmapserv_;
$_SESSION["locaplic"] = $locaplic_;
//$_SESSION["locsistemas"] = $locsistemas_;
//$_SESSION["locidentifica"] = $locidentifica_;
$_SESSION["R_path"] = $R_path_;
$_SESSION["mapext"] = $mapext_;
$_SESSION["locmapas"] = $locmapas_;
$_SESSION["debug"] = $debug_;
$_SESSION["ler_extensoes"] = $ler_extensoes_;
$_SESSION["postgis_mapa"] = $postgis_mapa_;
$_SESSION["perfil"] = $perfil_;
$_SESSION["navegadoresLocais"] = $navegadoresLocais_;
$_SESSION["utilizacgi"] = $utilizacgi_;
$_SESSION["tituloInstituicao"] = $tituloInstituicao_;
//$_SESSION["atlasxml"] = $atlasxml;
$_SESSION["expoeMapfile"] = $expoeMapfile;
$_SESSION["googleApiKey"] = $googleApiKey_;
$_SESSION["mensagemInicia"] = $mensagemInicia_;
$_SESSION["interfacePadrao"] = $interfacePadrao_;
if(isset($interface_))
$_SESSION["interface"] = $interface_;
if(isset($kmlurl_))
$_SESSION["kmlurl"] = $kmlurl_;
//rotina de segurança, ver http://shiflett.org/articles/the-truth-about-sessions
$fingerprint = 'I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'];
$_SESSION['fingerprint'] = md5($fingerprint . session_id());
$_SESSION["mapdir"] = $diretorios[1];
$_SESSION["imgdir"] = $diretorios[2];
$_SESSION["contadorsalva"] = 0;//essa variavel e utilizada pela ferramenta telaremota. Toda vez que o mapa e salvo, acrescenta 1 (veja classesphp/mapa_controle.php)
//
//pega todas as variáveis da sessão, mesmo as que foram definidas anteriormente
//
foreach(array_keys($_SESSION) as $k)
{eval("\$".$k."='".$_SESSION[$k]."';");}
$postgis_mapa = $postgis_mapa_;
/*
 Define os arquivos .map 

Seleciona os arquivos mapfile que serão carregados como base conforme o tipo de sistema operacional.

A variável $base pode ser definida como um parâmetro na inicialização, caso contrário, é utilizado o padrão.

Os arquivos .map padrão são armazenados em i3geo/aplicmap.
O arquivo é lido conforma a característica do sistema operacional.

*/
if(!isset($base) || $base == "")
{
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{
		$base = "geral1windows";
		$estadosl = "estadoslwindows";
	}
	else
	{
		$base = "geral1";
		$estadosl = "estadosl";
	}
}
if(!isset($estadosl))
{$estadosl = "estadosl";}
/*
 Cria os objetos map que serão processados

O arquivo definido em $base é lido como um objeto map. Esse objeto será processado para incluir novos layers e alterar outros parâmetros definidos pelo usuário.
*/
if (file_exists($base))
{
	$map = ms_newMapObj($base);
	$mapn = ms_newMapObj($base);	
}
else
{
	$map = ms_newMapObj($locaplic."/aplicmap/".$base.".map");
	$mapn = ms_newMapObj($locaplic."/aplicmap/".$base.".map");
}
/*
Utiliza um projeto gvSig para compor o mapa
*/
if(isset($gvsiggvp) && $gvsiggvp != ""){
	if(isset($gvsigview) && $gvsigview != ""){
		incluiMapaGvsig($gvsiggvp,$gvsigview);
	}
	else
	{echo "Nenhuma vista foi definida &gvsigview";}
}
/*
 Parâmetros adicionais.

Processa os parâmetros para a inicialização verificando se foram passados pela URL ou não.
*/
if (!isset($mapext))
{$mapext = $map->extent->minx." ".$map->extent->miny." ".$map->extent->maxx." ".$map->extent->maxy;}
if (!isset ($map_reference_image)) //arquivo com a imagem de refer&ecirc;ncia
{$map_reference_image = $map->reference->image;}
if (!isset ($map_reference_extent)) //extens&atilde;o geogr&aacute;fica da imagem do mapa de refer&ecirc;ncia
{$map_reference_extent = $map->reference->extent->minx." ".$map->reference->extent->miny." ".$map->reference->extent->maxx." ".$map->reference->extent->maxy;}
if(!isset($interface))
{
	if(!isset($interfacePadrao))
	{$interfacePadrao = "geral.htm";}
	$interface = $interfacePadrao;
}

if(isset($layers) && !isset($temasa))
{$temasa = $layers;}

incluiTemasIniciais();

if(isset($layers))
{ligaTemas();}
if(isset($desligar))
{desligaTemasIniciais();}

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
/*
Configura os endereços corretos no mapfile.

Altera as propriedades imagepath e imageurl corrigindo os caminhos padrão conforme o diretório criado para armazenar o mapa de trabalho.
*/
$w = $mapn->web;
$atual = $w->imagepath;
$w->set("imagepath",$atual.$diretorios[2]."/");
$atual = $w->imageurl;
$w->set("imageurl",$atual.$diretorios[2]."/");
$salvo = $mapn->save($tmpfname);

$_SESSION["imgurl"] = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'].$atual.$diretorios[2]."/";
$_SESSION["tmpurl"] = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'].$atual;
$_SESSION["map_file"] = $tmpfname;
$_SESSION["mapext"] = $mapext;

if (isset($executa))
{
	if (file_exists($executa))
	{include_once ($executa);}
	if (function_exists($executa))
	{eval($executa."();");}
}

if(isset($wkt))
{insereWKTUrl();}

if(isset($pontos))
{inserePontosUrl();}

if(isset($linhas))
{insereLinhasUrl();}

if(isset($poligonos))
{inserePoligonosUrl();}
if(isset($url_wms))
{incluiTemaWms();}

adaptaLayers();

if (file_exists($locaplic."/pacotes/geoip") && file_exists($locaplic."/pacotes/geoip/GeoLiteCity.dat"))
{require_once($caminho."ms_registraip.php");}

if ($interface != "mashup")
{abreInterface();}

/*
Adapta os dados de cada layer.

Faz alterações em cada layer caso sejam necessárias.
*/
function adaptaLayers(){
	global $tmpfname;
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
	erroCriacao();
}
/*
Redireciona para o HTML definido em $interface, abrindo o mapa
*/
function abreInterface(){
	global $interface,$caminho,$tempo;
	$nomeInterface = explode(".",basename($interface));
	$_SESSION["interface"] = $nomeInterface[0];
	if (count(explode(".php",$interface)) > 1)
	{
		if(file_exists($caminho."interface/".$interface))
		{include_once($caminho."interface/".$interface);}
		else 
		{include_once($interface);}
		exit;
	}
	else
	{
		if(file_exists($caminho."interface/".$interface))
		{$urln = $caminho."interface/".$interface."?".session_id();}
		else 
		{$urln = $interface."?".session_id();}
		if(!headers_sent())
		{header("Location:".$urln);}
		else
		{echo "<meta http-equiv='refresh' content='0;url=$urln'>";}
	}	
}
/*
Desliga os temas definidos na variável $desligar
*/
function desligaTemasIniciais()
{
	global $desligar,$mapn;
	$layers = str_replace(','," ",$desligar);
	$lista = explode(" ", $layers);
	foreach ($lista as $l)
	{
		if ($l == "")
		{continue;}
		if(@$mapn->getLayerByName($l))
		{$layern = $mapn->getLayerByName($l);$layern->set("status",MS_OFF);}
		$grupos = $mapn->getLayersIndexByGroup($l);
		if(count($grupos) > 0)
		{
			for ($i = 0;$i < count($grupos);++$i)
			{
				$layern = $mapn->getLayer($grupos[$i]);
				if(strtolower($layern->group) == strtolower($l))
				{
					$layern->set("status",MS_OFF);
				}
			}
		}
	}
	erroCriacao();
}
/*
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
	erroCriacao();
}
/*
Inclui os temas definidos na variável $temasa
*/
function incluiTemasIniciais()
{
	global $temasa,$estadosl,$mapn,$locaplic;
	if (strtoupper(substr(PHP_OS, 0, 3)) == 'WIN')
	{$temasdir = $locaplic."\\temas";}
	else
	{$temasdir = $locaplic."/temas";}
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
		if ((strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) && (file_exists($locaplic."\\aplicmap\\".$arqt.".map")))
		{$arqtemp = $locaplic."\\aplicmap\\".$arqt.".map";}
		elseif (file_exists($locaplic."/aplicmap/".$arqt.".map"))
		{$arqtemp = $locaplic."/aplicmap/".$arqt.".map";}
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
					{$layern->set("data",$locaplic."/aplicmap/dados/estados.shp");}
					$layern->setmetadata("NOMEORIGINAL",$layern->name);
					autoClasses(&$layern,$mapn);
					//
					//necessário para não alterar a extensão do mapa por esse parâmetro
					//
					$layern->setmetadata("aplicaextensao","");
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
	erroCriacao();
}
/*
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
Mostra a mensagem de aguarde
*/
function mostraAguarde()
{
	global $interface,$caminho,$mensagemInicia,$tituloInstituicao;
	if (!isset($interface))
	{
		echo "<html><head>";
		echo '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1"></head>';
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
Insere elementos no mapa a partir de uma string definida em wkt
*/
function insereWKTUrl()
{
	global $tamanhosimbolo,$simbolo,$corsimbolo,$wkt,$nometemawkt,$dir_tmp,$imgdir,$tmpfname,$locaplic;
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
	if(!function_exists(dbase_create))
	{xbase_create($nomeshp.".dbf", $def);}
	else
	{dbase_create($nomeshp.".dbf", $def);}
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
	$layer->set("data",$nomeshp.".shp");
	$layer->setmetadata("DOWNLOAD","sim");
	$layer->setmetadata("temalocal","sim");
	$layer->setmetadata("tema",$nometemawkt);
	$layer->setmetadata("classe","sim");
	$layer->set("type",$shape->type);
	$layer->set("status",MS_DEFAULT);
	$classe = ms_newClassObj($layer);
	$classe->set("name"," ");
	$estilo = ms_newStyleObj($classe);
	if($shape->type == 0)
	{
		if(!isset($simbolo))
		$estilo->set("symbolname","ponto");
		if(!isset($tamanhosimbolo))
		$estilo->set("size",6);
	}
	if($shape->type == 1)
	{
		if(!isset($simbolo))
		$estilo->set("symbolname","linha");
		if(!isset($tamanhosimbolo))
		$estilo->set("size",3);
	}
	if($shape->type == 2)
	{$layer->set("opacity","50");}
	
	$cor = $estilo->color;
	if(!isset($corsimbolo))
	{$corsimbolo ="255,0,0";}
	$corsimbolo = str_replace(" ",",",$corsimbolo);
	$corsimbolo = explode(",",$corsimbolo);
	$cor->setRGB($corsimbolo[0],$corsimbolo[1],$corsimbolo[2]);
	
	$salvo = $mapa->save($tmpfname);
	erroCriacao();
}
/*
Insere um tema do tipo ponto

*/
function inserePontosUrl()
{
	global $pontos,$tamanhosimbolo,$simbolo,$corsimbolo,$nometemapontos,$dir_tmp,$imgdir,$tmpfname,$locaplic;
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
	if(!function_exists(dbase_create))
	{xbase_create($nomeshp.".dbf", $def);}
	else
	{dbase_create($nomeshp.".dbf", $def);}
	$dbname = $nomeshp.".dbf";
	$db=xbase_open($dbname,2);
	$novoshpf = ms_newShapefileObj($nomeshp, $tipol);
	$pontos = explode(" ",trim($pontos));
	if(count($pontos) == 1)
	{$pontos = explode(",",trim($pontos[0]));}
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
	$layer->set("data",$nomeshp.".shp");
	$layer->setmetadata("DOWNLOAD","sim");
	$layer->setmetadata("tema",$nometemapontos);
	$layer->setmetadata("classe","sim");
	$layer->setmetadata("temalocal","sim");
	$layer->setmetadata("ATLAS","nao");
	$layer->set("type",MS_LAYER_POINT);
	$layer->set("status",MS_DEFAULT);
	$classe = ms_newClassObj($layer);
	$classe->set("name"," ");
	$estilo = ms_newStyleObj($classe);
	
	if(!isset($simbolo))
	{$simbolo = "ponto";}
	$estilo->set("symbolname",$simbolo);
	if(!isset($tamanhosimbolo))
	{$tamanhosimbolo = 6;}	
	$estilo->set("size",$tamanhosimbolo);
	$cor = $estilo->color;
	if(!isset($corsimbolo))
	{$corsimbolo ="255,0,0";}
	$corsimbolo = str_replace(" ",",",$corsimbolo);
	$corsimbolo = explode(",",$corsimbolo);
	$cor->setRGB($corsimbolo[0],$corsimbolo[1],$corsimbolo[2]);
	
	$salvo = $mapa->save($tmpfname);
	erroCriacao();
}
/*
Insere um tema do tipo linear

As linhas devem ter os pontos separados por espaços e cada linha separada por vírgula

*/
function insereLinhasUrl()
{
	global $tamanhosimbolo,$simbolo,$corsimbolo,$linhas,$nometemalinhas,$dir_tmp,$imgdir,$tmpfname,$locaplic;
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
	if(!function_exists(dbase_create))
	{xbase_create($nomeshp.".dbf", $def);}
	else
	{dbase_create($nomeshp.".dbf", $def);}	
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
	$layer->set("data",$nomeshp.".shp");
	$layer->setmetadata("DOWNLOAD","sim");
	$layer->setmetadata("temalocal","sim");
	$layer->setmetadata("tema",$nometemalinhas);
	$layer->setmetadata("classe","sim");
	$layer->setmetadata("ATLAS","nao");
	$layer->set("type",MS_LAYER_LINE);
	$layer->set("status",MS_DEFAULT);
	$classe = ms_newClassObj($layer);
	$classe->set("name"," ");
	$estilo = ms_newStyleObj($classe);

	if(!isset($simbolo))
	{$simbolo = "linha";}
	$estilo->set("symbolname",$simbolo);
	if(!isset($tamanhosimbolo))
	{$tamanhosimbolo = 6;}	
	$estilo->set("size",$tamanhosimbolo);
	$cor = $estilo->color;
	if(!isset($corsimbolo))
	{$corsimbolo ="255,0,0";}
	$corsimbolo = str_replace(" ",",",$corsimbolo);
	$corsimbolo = explode(",",$corsimbolo);
	$cor->setRGB($corsimbolo[0],$corsimbolo[1],$corsimbolo[2]);
	
	$salvo = $mapa->save($tmpfname);
	erroCriacao();
}
/*
Insere um tema poligonal.

Os polígonos devem ter os pontos separados por espaços e cada polígono separado por vírgula
*/
function inserePoligonosUrl()
{
	global $tamanhosimbolo,$simbolo,$corsimbolo,$poligonos,$nometemapoligonos,$dir_tmp,$imgdir,$tmpfname,$locaplic;
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
	if(!function_exists(dbase_create))
	{xbase_create($nomeshp.".dbf", $def);}
	else
	{dbase_create($nomeshp.".dbf", $def);}
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
	$layer->set("data",$nomeshp.".shp");
	$layer->setmetadata("DOWNLOAD","sim");
	$layer->setmetadata("temalocal","sim");
	$layer->setmetadata("tema",$nometemapoligonos);
	$layer->setmetadata("classe","sim");
	$layer->setmetadata("ATLAS","nao");
	$layer->set("type",MS_LAYER_POLYGON);
	$layer->set("opacity","50");
	$layer->set("status",MS_DEFAULT);
	$classe = ms_newClassObj($layer);
	$classe->set("name"," ");
	$estilo = ms_newStyleObj($classe);

	$cor = $estilo->color;
	if(!isset($corsimbolo))
	{$corsimbolo ="255,0,0";}
	$corsimbolo = str_replace(" ",",",$corsimbolo);
	$corsimbolo = explode(",",$corsimbolo);
	$cor->setRGB($corsimbolo[0],$corsimbolo[1],$corsimbolo[2]);

	$salvo = $mapa->save($tmpfname);
	erroCriacao();
}
/*
Inclui no mapa um tema do tipo WMS
*/
function incluiTemaWms()
{
	global $nome_wms,$url_wms,$layer_wms,$style_wms,$srs_wms,$image_wms,$versao_wms,$tmpfname,$locaplic;
	include_once ($locaplic."/classesphp/classe_mapa.php");
	if(!$nome_wms)
	{$nome = $layer_wms." ".$style_wms;}
	else
	$nome = $nome_wms;
	$m = new Mapa($tmpfname);
 	$m->adicionatemawms($layer_wms,$url_wms,$style_wms,$srs_wms,$image_wms,$locaplic,"",$versao_wms,$nome,"","","","","nao","text/plain","");
	$salvo = $m->salva($tmpfname);
	//echo $tmpfname;exit;
	erroCriacao();
}
/*
Projeto gvsig
*/
function incluiMapaGvsig($gvsiggvp,$gvsigview){
	global $mapn,$locaplic;
	include_once($locaplic."/pacotes/gvsig/gvsig2mapfile/class.gvsig2mapfile.php");
	$gm = new gvsig2mapfile($gvsiggvp);
	$dataView = $gm->getViewData($gvsigview);
	//var_dump($dataView);
	$lnames = $mapn->getalllayernames();
	foreach($lnames as $name){
		$layer = $mapn->getlayerbyname($name);
		$layer->set("status",MS_DELETE);
	}
	$next = $dataView["extent"];
	$ext = $mapn->extent;
	$ext->setextent($next[0],$next[1],$next[2],$next[3]);
	$mapn = $gm->addLayers($mapn,$gvsigview,$dataView["layerNames"]);
}
/*
Captura e mostra os erros de processamento do mapserver
*/
function erroCriacao(){
	$error = ms_GetErrorObj();
	while($error && $error->code != MS_NOERR)
	{
		printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
		$error = $error->next();
	}
	ms_ResetErrorList();
}

?>