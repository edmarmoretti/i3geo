<?php
include(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: CRIATEMASEL

Cria um novo tema com a sele&ccedil;&atilde;o atual.

<Selecao->selecao2tema>
*/
	case "CRIATEMASEL":
		include_once(dirname(__FILE__)."/../../classesphp/classe_selecao.php");
		copiaSeguranca($map_file);
		$m = new Selecao($map_file,$tema);
		$retorno = $m->selecao2tema($locaplic,$dir_tmp);
		$m->salva();
		$_SESSION["contadorsalva"]++;
	break;
/*
Valor: LIMPASEL

Limpa a sele&ccedil;&atilde;o existente em um tema.

<Selecao->selecaoLimpa>
*/
	case "LIMPASEL":
		include_once(dirname(__FILE__)."/../../classesphp/classe_selecao.php");
		$m = new Selecao($map_file,$tema);
		$retorno = $m->selecaoLimpa();
		//
		//&eacute; necess&aacute;rio obter os par&acirc;metros do mapa para remontar a &aacute;rvore de camadas
		//
		$_SESSION["contadorsalva"]++;
		redesenhaMapa();
	break;
/*
Valor: SELECAOTEMA

Sleciona elementos de um tema com base em outro tema.

<Selecao->selecaoTema>
*/
	case "SELECAOTEMA":
		include_once(dirname(__FILE__)."/../../classesphp/classe_selecao.php");
		//copiaSeguranca($map_file);
		$temas = explode(",",$tema);
		foreach($temas as $tema){
			$m = new Selecao($map_file,$tema);
			$ok[] = $m->selecaoTema($temao,$_GET["tipo"],$_GET["buffer"]);
		}
		$_SESSION["contadorsalva"]++;
		redesenhaMapa();
	break;

/*
Valor: SELECAOATRIB2

Seleciona elementos com base nos atributos utilizando sintaxe complexa.

<Selecao->selecaoAtributos2>
*/
	case "SELECAOATRIB2":
		include_once(dirname(__FILE__)."/../../classesphp/classe_selecao.php");
		copiaSeguranca($map_file);
		$m = new Selecao($map_file,$tema,$ext);
		$retorno = $m->selecaoAtributos2($_GET["filtro"],$_GET["tipo"]);
		$_SESSION["contadorsalva"]++;
		redesenhaMapa();
	break;
/*
Valor: SELECAOEXT

Seleciona elementos utilizando a extens&atilde;o do mapa.

<Selecao->selecaoEXT>
*/
	case "SELECAOEXT":
		include_once(dirname(__FILE__)."/../../classesphp/classe_selecao.php");
		copiaSeguranca($map_file);
		$temas = explode(",",$tema);
		foreach($temas as $tema)
		{
			$m = new Selecao($map_file,$tema,$ext);
			$ok[] = $m->selecaoEXT($_GET["tipo"]);
		}
		//$retorno = implode(",",$ok);
		$_SESSION["contadorsalva"]++;
		redesenhaMapa();
	break;

/*
Valor: SELECAOBOX

Seleciona elementos utilizando um ret&acirc;ngulo.

<Selecao->selecaoBOX>
*/
	case "SELECAOBOX":
		include_once(dirname(__FILE__)."/../../classesphp/classe_selecao.php");
		copiaSeguranca($map_file);
		$temas = explode(",",$tema);
		foreach($temas as $tema)
		{
			$m = new Selecao($map_file,$tema,$ext);
			$ok[] = $m->selecaoBOX($_GET["tipo"],$_GET["box"]);
		}
		$_SESSION["contadorsalva"]++;
		redesenhaMapa();
	break;
	/*
	 Valor: SELECAOWKT

	Seleciona elementos utilizando um wkt

	<Selecao->selecaoBOX>
	*/
	case "SELECAOWKT":
		include_once(dirname(__FILE__)."/../../classesphp/classe_selecao.php");
		copiaSeguranca($map_file);
		$temas = explode(",",$tema);
		foreach($temas as $tema){
			$m = new Selecao($map_file,$tema,$ext);
			$ok[] = $m->selecaoPorPoligono($_GET["tipo"],"","",$_GET["wkt"],$_GET["buffer"]);
		}
		$_SESSION["contadorsalva"]++;
		redesenhaMapa();
	break;
/*
Valor: SELECAOPT

Seleciona elementos utilizando um ponto.

<Selecao->selecaoPT>
*/
	case "SELECAOPT":
		//error_reporting(0);
		include_once(dirname(__FILE__)."/../../classesphp/classe_selecao.php");
		copiaSeguranca($map_file);
		if(!isset($_GET["xy"])){$_GET["xy"] = "";}
		$temas = explode(",",$tema);
		foreach($temas as $tema)
		{
			$m = new Selecao($map_file,$tema,$ext);
			$ok[] = $m->selecaoPT($_GET["xy"],$_GET["tipo"],$_GET["tolerancia"]);
		}
		$_SESSION["contadorsalva"]++;
		redesenhaMapa();
	break;
/*
Valor: SELECAOPOLI

Sele&ccedil;&atilde;o por poligono (chamado via POST).

<Selecao->selecaoPoli>
*/
	case "SELECAOPOLI":
		//esta opera&ccedil;&atilde;o &eacute; chamada com POST via cpaint
		//por isso precisa ser executada com start
		copiaSeguranca($map_file);
		$retorno = selecaoPoli($_GET["xs"],$_GET["ys"],$tema,$_GET["tipo"],$_GET["buffer"]);
		$_SESSION["contadorsalva"]++;
		redesenhaMapa();
		//restauraCon($map_file,$postgis_mapa);
	break;
/*
Valor: LISTAPONTOSSHAPESEL

Lista os pontos dos elementos selecionados de um layer

<SHP->listaPontosShapeSel>
*/
	case "LISTAPONTOSSHAPESEL":
		include_once(dirname(__FILE__)."/../../classesphp/classe_shp.php");
		$m = new SHP($map_file,$tema);
		$retorno = $m->listaPontosShapeSel();
	break;

}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
/*
Function: selecaoPoli

Seleciona um tema por pol&iacute;gono baseado em uma lista de pontos.

Include:
<classe_selecao.php>
*/
function selecaoPoli($xs,$ys,$tema,$tipo,$buffer=0)
{
	global $map_file;
	include_once(dirname(__FILE__)."/../../classesphp/classe_selecao.php");
	$temas = explode(",",$tema);
	foreach($temas as $tema)
	{
		$m = new Selecao($map_file,$tema);
		$ok[] = $m->selecaoPorPoligono($tipo,$xs,$ys,"",$buffer);
		$m->salva();
		$_SESSION["contadorsalva"]++;
	}
	return implode(",",$ok);
}
?>