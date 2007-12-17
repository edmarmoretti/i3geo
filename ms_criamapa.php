<?php
/*
Title: Inicializa o I3Geo via URL ms_criamapa.php

Cria os diretórios temporários para o I3Geo e o mapfile inicial.

Abre o I3Geo com a interface padrão ou uma específica.

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

temasa - lista separada por espaços com os nomes dos arquivos map que serão adicionados

layers - lista separada por espaços com os nomes dos layers que serão ligados

mapext - extensao geografica que será utilizada

executa - programa ou função em php adicional que será executado via include. O mapfile nessa altura está na variável tmpfname

interface - nome da interface que será utilizada para abrir o mapa As interfaces são arquivos HTML que podem estar no diretório aplicmap

perfil - perfil utilizado para restringir os menus de temas

caminho - caminho para os programas que serão incluídos com "include"

pontos - lista de coordenadas x e y que serão adicionadas como pontos no mapa.

nometemapontos - nome do tema de pontos

debug - ativa o retorno de mensagens de erro do PHP sim|nao

About: Exemplo

http://localhost/i3geo/ms_criamapa.php?temasa=estadosl
*/
/*
Section: Fluxo do código
*/
/*
Note: Verifica se o debug deve ser ativado, checando a variável debug
*/
if (!isset($debug))
{error_reporting(0);$debug="nao";}
else
{error_reporting(E_ALL);$debug="sim";}
/*
Note: Verifica se a variável $caminho está definida

Essa variável deve ser definida em programas que utilizam o ms_criamapa.php via include
indica onde está o diretório i3geo para que os includes seguintes possam ser localizados
*/
if (!isset($caminho)){$caminho = "";}
if (!file_exists($caminho."classesphp/carrega_ext.php"))
{echo "<b> Nao foi possivel localizar o diretório classephp. Provavelmente vc precisara definir a variavel $camino";exit;}
if (isset($_GET["caminho"]))
{$caminho = $_GET["caminho"];}

/*
Note: Carrega as extensões, geralmente necessário nas instalações windows
*/
require_once ($caminho."classesphp/carrega_ext.php");
/*
Note: Carrega as funções adicionais

Inclui os programas php com funções necessárias
*/
require_once ($caminho."classesphp/pega_variaveis.php");
require_once ($caminho."classesphp/funcoes_gerais.php");
require_once ($caminho."ms_configura.php");
/*
Note: Define a variável $mapext que especifica a extensão geográfica do mapa
*/
if (!isset($mapext)){$mapext="";}
/*
Note: Prepara as variáveis que serão incluidas na seção

As variáveis vêm do arquivo ms_configura
*/
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
Note: Monta a apresentação do aguarde

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
//
//pega todas as variáveis da sessão, mesmo as que foram definidas anteriormente
//
foreach(array_keys($_SESSION) as $k)
{eval("\$".$k."='".$_SESSION[$k]."';");}
/*
Note: Define os arquivos .map conforme o tipo de sistema operacional.

Os arquivos .map de inicialização são fixos e são armazenados em i3geo/aplicmap.
O arquivo é lido conforma a característica do sistema operacional.
*/
if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
{
	if (!isset($base)){$base = "geral1windows";}
	$estadosl = "estadoslwindows";
}
else
{
	if (!isset($base)){$base = "geral1";}
	$estadosl = "estadosl";
}
if (file_exists($base))
{$mapdefault = ms_newMapObj($base);}
else
{$mapdefault = ms_newMapObj($temasaplic."/".$base.".map");}
/*
Note: Define os parâmetros para a inicialização se os mesmos não forem passados pela URL.
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
Note: Cria os diretórios temporários que serão utilizados pelo i3geo para armazenar as imagens e outros dados 
*/
$diretorios = criaDirMapa($dir_tmp);
$_SESSION["mapdir"] = $diretorios[1];
$_SESSION["imgdir"] = $diretorios[2];
/*
Note: Cria arquivos para impedir a leitura dos diretórios temporários diretamente no browser
*/
criaIndex();
/*
Note: Cria os objetos map que serão processados
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
Note: Verifica a lista de temas da inicializacao, adicionando-os se necessário
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
Note: Configura os endereços corretos no mapfile para acessar os diretórios temporários.

Altera as propriedades imagepath e imageurl
*/
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
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
	{include ($executa);}
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
//exit;
/*
Note: Adapta os dados de cada layer.

Faz alterações em cada layer caso sejam necessárias.
*/
$mapa = ms_newMapObj($tmpfname);
$path = $mapa->shapepath;
for($i=0;$i<($mapa->numlayers);$i++)
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
			$arqt = trim($l);
			if ($l == "")
			{continue;}
			if(@$mapn->getLayerByName($l))
			{$layern = $mapn->getLayerByName($l);$layern->set("status",MS_DEFAULT);}
			$grupos = $mapn->getLayersIndexByGroup($l);
			if(count($grupos > 0))
			{
				for ($i = 0;$i < count($grupos);$i++)
				{
					$layern = $mapn->getLayer($i);
					if($layern->group == $l)
					{$layern->set("status",MS_DEFAULT);}
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
				for($i=0;$i<($maptemp->numlayers);$i++)
				{
					$layern = $maptemp->getLayer($i);
					if($layern->type == MS_LAYER_RASTER)
					{$existeraster = true;}
					$layern->setmetadata("NOMEORIGINAL",$layern->name);
					if ($layern->name == "estadosl")
					{$layern->set("data",$temasaplic."/dados/estados.shp");}
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

*/
function mostraAguarde()
{
	global $interface,$caminho,$mensagemInicia;
	if (!isset($interface))
	{
		echo "<html><head>";
		echo '<div id="aguarde">';
		echo '<p class=paguarde style="font-family: Verdana, Arial, Helvetica, sans-serif;color:black;text-align:center;font-size:12pt"><b>'.$mensagemInicia.'</b><br> Aguarde...criando o mapa</p>';
		echo "<center><img src='".$caminho."imagens/i3geo1.jpg'><br><br>";
		echo "<center><img src='".$caminho."imagens/mapserv.png'><br><br>";
		echo "<center><a href='http://mapas.mma.gov.br/download' target=blank ><img src='".$caminho."imagens/somerights20_pt.gif' ></a>";
		echo '<BODY bgcolor="white" style="background-color:white">';
	}
}
/*
Function: inserePontosUrl

Insere um novo tema com os pontos definidos na variável $pontos

*/
function inserePontosUrl()
{
	global $pontos,$nometemapontos,$dir_tmp,$imgdir,$tmpfname,$locaplic;
	require_once "pacotes/phpxbase/api_conversion.php";
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

Insere um novo tema com as linhas definidas na variável $linhas

As linhas devem ter os pontos separados por espaços e cada linha separada por vírgula

*/
function insereLinhasUrl()
{
	global $linhas,$nometemalinhas,$dir_tmp,$imgdir,$tmpfname,$locaplic;
	require_once "pacotes/phpxbase/api_conversion.php";
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

Insere um novo tema com os poligonos definidas na variável $poligonos

Os polígonos devem ter os pontos separados por espaços e cada polígono separado por vírgula

*/
function inserePoligonosUrl()
{
	global $poligonos,$nometemapoligonos,$dir_tmp,$imgdir,$tmpfname,$locaplic;
	require_once "pacotes/phpxbase/api_conversion.php";
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