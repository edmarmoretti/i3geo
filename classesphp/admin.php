<?php
/*
Title: Administração

Funções utilizadas pela aplicação de administração de mapfiles.
É utilizado apenas pela interface de administração.

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

File: i3geo/classesphp/admin.php

19/6/2007

Include:
<carrega_ext.php>, <pega_variaveis.php>, <ms_configura.php>
*/
include_once("pega_variaveis.php");
error_reporting(0);
session_name("i3GeoPHP");
if (isset($g_sid))
{session_id($g_sid);}
session_start();
foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}
//
//carrega o phpmapscript
//
include_once ("../../classesphp/carrega_ext.php");
//verifica se o cliente pode editar
include_once("../ms_configura.php");
include_once("../pacotes/cpaint/cpaint2.inc.php");
$editor = "nao";
foreach ($editores as $e)
{
	$e = gethostbyname($e);
	$ip = "UNKNOWN";
	if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
	else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
	else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
	else $ip = "UNKNOWN";
	if ($e == $ip){$editor="sim";}
}
if ($editor == "nao")
{
 	$cp = new cpaint();
 	$cp->set_data("erro. Voce nao e um editor cadastrado $ip");
 	$cp->return_data();
 	return;
}

$cp = new cpaint();
//faz a busca da função que deve ser executada
switch ($funcao)
{
	//retorna o mapfile atual como texto
	case "carregaMapFileAtual":
	$cp->register('carregaMapFileAtual');
	$cp->start();
	$cp->return_data();
	break;
	//salva o mapfile atual
	case "salvaMapFileAtual":
	$cp->register('salvaMapFileAtual');
	$cp->start();
	$cp->return_data();
	break;
	//lista os mapfiles do diretorio temas
	case "listaMapsTemas":
	$cp->register('listaMapsTemas');
	$cp->start();
	$cp->return_data();
	break;
	//le map file de um tema
	case "carregaMapFileTema":
	$cp->register('carregaMapFileTema');
	$cp->start();
	$cp->return_data();
	break;
	//salva o mapfile de um tema
	case "salvaMapFileTema":
	$cp->register('salvaMapFileTema');
	$cp->start();
	$cp->return_data();
	break;
	//cria um novo tema
	case "criaTema":
	$cp->register('criaTema');
	$cp->start();
	$cp->return_data();
	break;
	//retorna a lista de camadas atuais
	case "listaCamadasAtuais":
	$cp->register('listaCamadasAtuais');
	$cp->start();
	$cp->return_data();
	break;
	//retorna o texto de uma camada atual
	case "textoCamadaAtual":
	$cp->register('textoCamadaAtual');
	$cp->start();
	$cp->return_data();
	break;
	//inclui um tema no mapa
	case "incluirTema":
	$cp->register('incluirTema');
	$cp->start();
	$cp->return_data();
	break;
}
/*
Function: incluirTema

Inclui um tema no mapa atual.

O tema deve ser um dos existentes no diretório 'temas' do I3Geo.

A função listaMapsTemas retorna a lista de temas disponíveis.

Parameters:

cp - objeto CPAINT

locaplic - localização da instalação do I3Geo

tema - tema que será processado (mapfile). Deve existir no diretório i3geo/temas.

map_file - mapfile que será processado
*/
function incluirTema()
{
 	global $cp,$locaplic,$tema,$map_file;
	$mapa = ms_newMapObj($map_file);
	$mapt = ms_newMapObj($locaplic."/temas/".$tema);
	$temas = $mapt->getalllayernames();
	foreach ($temas as $t)
	{
		$layer = $mapt->getlayerbyname($t);
		$layer->set("status",MS_DEFAULT);
		$adiciona = ms_newLayerObj($mapa, $layer);
	}
	$salvo = $mapa->save($map_file);
 	$cp->set_data("ok");
}
/*
Function: textoCamadaAtual

Mostra o texto de uma camada existente no mapfile atual.

O layer é lido e transformado em uma string.

Parameters:

cp - objeto CPAINT

map_file - mapfile que será processado

tema - tema que será processado
*/
function textoCamadaAtual()
{
 	global $cp,$map_file,$tema;
	$mapa = ms_newMapObj($map_file);
	$nometemp = dirname($map_file)."/testexxx.map";
	if (file_exists($nometemp)){unlink($nometemp);}
	$ts = $mapa->getalllayernames();
	foreach ($ts as $t)
	{
		$layer = $mapa->getlayerbyname($t);
		if ($layer->getmetadata("nomeoriginal") != $tema)
		{$layer->set("status",MS_DELETE);}
	}
	$mapa->save($nometemp);
	$linhas = ms_TokenizeMap($map_file);
	$texto = "";
	$c = count($linhas);
	for ($i=0;$i < $c;++$i)
	{
		if ($linhas[$i] == "FONTSET")
		$texto .= "FONTSET ".$linhas[$i+1]."\n";
		if ($linhas[$i] == "SYMBOLSET")
		$texto .= "SYMBOLSET ".$linhas[$i+1]."\n";
	}
	$handle = fopen ($nometemp, "r");
	$linhas = array();
	while (!feof ($handle)) {
    	$buffer = fgets($handle);
    	if (trim($buffer) != "")
     	$linhas[] = trim($buffer);
	}
	fclose ($handle);
	$layer = "nao";
	$textolayer = array();
	$textos = array();
	$nome = "";
	$c = count($linhas);
	for ($i=0;$i < $c;++$i)
	{
		if ($linhas[$i] == "LAYER")
		{$layer = "sim";}
		if ($layer == "sim")
		{
			$textolayer[] = $linhas[$i];
		}
	}
	foreach ($textolayer as $t)
	{
		if (function_exists("mb_convert_encoding"))
		{$texto .= mb_convert_encoding($t,"UTF-8","ISO-8859-1")."\n";}
		else
		{$texto .= $t."\n";}
	}
 	$cp->set_data($texto);
}
/*
Function: listaCamadasAtuais

Lista as camadas atuais do mapa.

Retorna sempre o código original da camada, armazenado como o metadados NOMEORIGINAL.

Parameters:

cp - objeto CPAINT

map_file - mapfile que será processado

*/
function listaCamadasAtuais()
{
 	global $cp,$map_file;
	$mapa = ms_newMapObj($map_file);
	$temas = $mapa->getAllLayerNames();
	$lista = array();
	foreach ($temas as $tema)
	{
		$layer = $mapa->getlayerbyname($tema);
		$t = $layer->getmetadata("NOMEORIGINAL");
		if ($t == "")
		$t = $layer->getmetadata("nomeoriginal");
		if ($t != "")
		$lista[] = $t;
	}
 	$cp->set_data(implode(",",$lista));
}
/*
Function: carregaMapFileAtual

Retorna o arquivo mapfile atual como um texto.

Parameters:

cp - objeto CPAINT

map_file - mapfile que será processado

*/
function carregaMapFileAtual()
{
 	global $cp,$map_file;
 	$texto = file_get_contents($map_file);
	if (function_exists("mb_convert_encoding"))
	{$texto = mb_convert_encoding($texto,"UTF-8","ISO-8859-1");}
 	$cp->set_data($texto);
}
/*
Function: salvaMapFileAtual

Salva uma string como mapfile atual.

A string enviada para ser armazenada, deve ter alguns caracteres especiais substituídos.

Parameters:

cp - objeto CPAINT

map_file - mapfile que será processado

texto - texto que será gravado

flag - flag de abertura do arquivo

*/
function salvaMapFileAtual($texto,$flag)
{
 	global $cp,$map_file;
 	$texto = html_entity_decode($texto);
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{
		$texto = str_replace("###","\n\t",$texto);
		$texto = str_replace("\\\\","\\",$texto);
		$texto = str_replace("\\\"","\"",$texto);
		$texto = str_replace('\"\"','\" \"',$texto);
	}
	else
 	{
 		$texto = str_replace("###","\n",$texto);
 	}
 	unlink($map_file);
 	$f = fopen($map_file,$flag);
    $ok = fwrite($f,$texto);
    fclose($f);
    $nmf = str_replace(".map","seguranca.map",$map_file);
    if (file_exists($nmf))
    {unlink($nmf);}
    copy ($map_file,$nmf);
 	$cp->set_data($ok);
}
/*
Function: listaMapsTemas

Retorna a lista de mapfiles do diretorio i3geo/temas

Parameters:

cp - objeto CPAINT

locaplic - localização da instalação do I3Geo
*/
function listaMapsTemas()
{
 	global $cp,$locaplic;
	if (is_dir($locaplic."/temas"))
	{
   		if ($dh = opendir($locaplic."/temas")) 
		{
       		while (($file = readdir($dh)) !== false) 
			{$arquivos[] = $file;}
       	}
       	closedir($dh);
   	}
   	sort($arquivos);
 	$cp->set_data(str_replace(".,..,","",implode(",",$arquivos)));
}
/*
Function: carregaMapFileTema

Retorna o arquivo mapfile de um tema como um texto.

Parameters:

cp - objeto CPAINT

locaplic - localização da instalação do I3Geo

tema - nome do tema (mapfile)
*/
function carregaMapFileTema()
{
 	global $cp,$locaplic,$tema;
 	$texto = file_get_contents($locaplic."/temas/".$tema);
	if (function_exists("mb_convert_encoding"))
	{$texto = mb_convert_encoding($texto,"UTF-8","ISO-8859-1");}
 	$cp->set_data($texto);
}
/*
Function: salvaMapFileTema

Salva uma string como mapfile de um tema.

Parameters:

cp - objeto CPAINT

locaplic - localização da instalação do I3Geo

texto - texto que será salvo

flag - flag de abertura do arquivo

tema - nome do tema (mapfile)
*/
function salvaMapFileTema($texto,$flag,$tema)
{
 	global $cp,$locaplic;
 	$texto = html_entity_decode($texto);
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{
		$texto = str_replace("###","\n\t",$texto);
		$texto = str_replace("\\\\","\\",$texto);
		$texto = str_replace("\\\"","\"",$texto);
		$texto = str_replace('\"\"','\" \"',$texto);
	}
	else
 	{$texto = str_replace("###","\n",$texto);}
 	unlink($locaplic."/temas/".$tema);
 	$f = fopen($locaplic."/temas/".$tema, $flag);
	//if (function_exists(mb_convert_encoding))
	//{$texto = mb_convert_encoding($texto,"UTF-8","ISO-8859-1");}//,"UTF-8");}
    $ok = fwrite($f,$texto);
    fclose($f);
 	$cp->set_data("Tema gravado!");
}
/*
Function: criaTema

Cria um novo mapfile e adiciona no mapa atual.

Parameters:

cp - objeto CPAINT

map_file - mapfile atual

locaplic - localização da instalação do I3Geo

arquivo - nome do novo tema

tipodados - tipo de dado banco|

nomearquivo - nome do shape file se tipodados for diferente de banco

conexaobanco - string de conexão com o banco, se tipodados for igual a banco

sql - sql de busca dos dados

tiporepresentacao - tipo de tema MS_LAYER_POINT|MS_LAYER_LINE|MS_LAYER_POLYGON|MS_LAYER_RASTER

opacidade - transparência do tema

nometema nome do tema na legenda

escala escala da fonte

download - permite o download ou não sim|nao
*/
function criaTema($arquivo,$tipodados,$nomearquivo,$conexaobanco,$sql,$tiporepresentacao,$opacidade,$nometema,$escala,$download)
{
 	global $cp,$map_file,$locaplic;
 	$arq = $locaplic."/temas/".$arquivo.".map";
 	if ($arquivo == "testamapa")
 	{
 		if (file_exists($arq))
 		{unlink($arq);}
 	}
 	//cria o arquivo map
 	if (file_exists($arq))
 	{$cp->set_data("Erro. Arquivo $arq ja existe");return;}
 	else
 	{
 		if (file_exists($arq))
 		{unlink ($arq);}
		if ($tiporepresentacao == "MS_LAYER_POINT"){$tipocamada = "point";}
		if ($tiporepresentacao == "MS_LAYER_LINE"){$tipocamada = "line";}
		if ($tiporepresentacao == "MS_LAYER_POLYGON"){$tipocamada = "polygon";}
		if ($tiporepresentacao == "MS_LAYER_RASTER"){$tipocamada = "raster";}
 		$f = fopen($arq,w);
 		$texto = "SYMBOLSET ../symbols/simbolos.sym\n";
 		fwrite($f,$texto);
		$texto = "FONTSET   ".'"'."../symbols/fontes.txt".'"'."\n";
		fwrite($f,$texto);
		$texto = "LAYER\nNAME $arquivo \nTYPE $tipocamada \nSTATUS default \n";
		fwrite($f,$texto);
		if ($tipodados == "banco")
		{
			$texto = "CONNECTIONTYPE postgis\n
					CONNECTION '$conexaobanco'\n";
			fwrite($f,$texto);
			$texto = "DATA ".'"'.$sql.'"';
			fwrite($f,$texto);
		}
		else
		{
			$texto = "DATA $nomearquivo ";
			fwrite($f,$texto);
		}
		$texto = "\n TEMPLATE ".'"'."none.htm".'"'."\n"."METADATA\n";
		fwrite($f,$texto);
  		$texto = "TEMA ".'"'.$nometema.'"'."\n";
  		fwrite($f,$texto);
		$texto = 'CLASSE "SIM" ';
		fwrite($f,$texto);
		$texto = "\n".'nomeoriginal "'.$arquivo.'" ';
		fwrite($f,$texto);
		$texto = "\nESCALA ".'"'.$escala.'"';
		fwrite($f,$texto);
		$texto = "\nDOWNLOAD ".'"'.$download.'"';
		fwrite($f,$texto);
		$texto = "\nEND ";
		fwrite($f,$texto);
		$texto = "\nTRANSPARENCY $opacidade";
		fwrite($f,$texto);
		$texto = "\nCLASS\nNAME ' '\nCOLOR 255 0 0\nOUTLINECOLOR 0 255 255\nSIZE 8\nEND\nEND\nEND\n";
 		fwrite($f,$texto);
    	fclose($f);
    	chmod($arq,0777); 		
		$mapa = ms_newMapObj($map_file);
		$mapatmp = ms_newMapObj($arq);
		$temp = $mapatmp->getlayerbyname($arquivo);
	 	$adiciona = ms_newLayerObj($mapa, $temp);
	 	$salvo = $mapa->save($map_file);
	 	$cp->set_data("Ok. Camada criada. Utilize as opcoes de edicao de legenda para configurar o mapa.");
	}
}
?>