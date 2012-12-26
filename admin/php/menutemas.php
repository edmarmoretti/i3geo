<?php
/*
 Title: menutemas.php

Fun&ccedil;&otilde;es utilizadas nas opera&ccedil;&otilde;es de manuten&ccedil;&atilde;o de menus, grupo, subgrupos e temas

&Eacute; utilizado nas fun&ccedil;&otilde;es em AJAX da interface de edi&ccedil;&atilde;o da &aacute;rvore de menus para edi&ccedil;&atilde;o de cada um de seus componentes

Essas fun&ccedil;&otilde;es complementam <arvore.php>

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
Voc&ecirc; deve ter recebido uma  da Licen&ccedil;a P&uacute;blica Geral do
	GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/php/menutemas.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada, por exemplo, menutemas.php?funcao=pegaMenus

Cada opera&ccedil;&atilde;o possu&iacute; seus proprios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.

*/
include_once(__DIR__."/admin.php");
include_once(__DIR__."/login.php");
$funcoesEdicao = array(
		"ALTERAMENUS",
		"ALTERAGRUPOS",
		"ALTERASUBGRUPOS",
		"ATUALIZAMINIATURA",
		"ALTERATEMAS",
		"ALTERATAGS",
		"ALTERAPERFIS",
		"EXCLUIRREGISTRO"

);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/arvore") == false){
		retornaJSON("Vc nao pode realizar essa operacao.");exit;
	}
}


if(!isset($funcao))
{
	$funcao = "";
}
if(!isset($idioma))
{
	$idioma = "pt";
}
if($idioma == "")
{
	$idioma = "pt";
}
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
switch (strtoupper($funcao))
{
	/*
	 Note:

	Valores que o par&acirc;metro &funcao pode receber. Os par&acirc;metros devem ser enviados na requisi&ccedil;&atilde;o em AJAX.
	*/

		/*
		 Valor: PEGAMENUS

		Lista de menus contendo todas as colunas

		Retorno:

		{JSON}
		*/
	case "PEGAMENUS":
		if(isset($id_menu) && $id_menu != "")
		{
			$dados = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_menus where id_menu = $id_menu order by nome_menu");
		}
		else{
			$dados = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_menus order by nome_menu");
		}
		retornaJSON($dados);
		exit;
		break;
		/*
		 Valor: PEGAMENUS2

		Lista de menus contendo apenas colunas selecionadas

		Retorno:

		{JSON}
		*/
	case "PEGAMENUS2":
		if($idioma == "pt")
		{
			$coluna = "nome_menu";
		}
		else
		{$coluna = $idioma;
		}
		if(isset($id_menu) && $id_menu != "")
		{
			$dados = pegaDados("SELECT publicado_menu,perfil_menu,aberto,desc_menu,id_menu,$coluna as nome_menu from ".$esquemaadmin."i3geoadmin_menus where id_menu = $id_menu order by nome_menu");
		}
		else
		{$dados = pegaDados("SELECT publicado_menu,perfil_menu,aberto,desc_menu,id_menu,$coluna as nome_menu from ".$esquemaadmin."i3geoadmin_menus order by nome_menu");
		}
		retornaJSON($dados);
		exit;
		break;
		/*
		 Valor: PEGATAGS

		Lista de tags

		Retorno:

		{JSON}
		*/
	case "PEGATAGS":
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_tags order by nome";
		retornaJSON(pegaDados($sql));
		exit;
		break;
		/*
		 Valor: PEGATAGSPORMAPFILE

		Lista de tags por mapfile

		Retorno:

		{JSON}
		*/
	case "PEGATAGSPORMAPFILE":
		if($idioma == "pt")
		{
			$coluna = "nome_tema";
		}
		else
		{$coluna = $idioma;
		}

		$q = pegaDados("select link_tema,tags_tema,codigo_tema,$coluna as nome_tema from ".$esquemaadmin."i3geoadmin_temas");
		$temas = array();
		$temaExiste = array();
		foreach($q as $row)
		{
			$ts = html_entity_decode($row['tags_tema']);
			$i = $row['codigo_tema'];
			$nome = $row['nome_tema'];
			$link = $row['link_tema'];
			$tags = explode(" ",$ts);
			foreach($tags as $t)
			{
				if (removeAcentos($t) == $tag)
				{
					if(!isset($temaExiste[$i]))
					{
						$temas[] = array("codigoMap"=>$i,"nome"=>$nome,"link"=>$link);
						$temaExiste[$i] = 0;
					}
				}
			}
		}
		retornaJSON($temas);
		exit;
		break;
		/*
		 Valor: PEGAPERFIS

		Lista de perfis

		Retorno:

		{JSON}
		*/
	case "PEGAPERFIS":
		$dados = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_perfis order by perfil");
		if(count($dados) == 0){
			$dados = array("id_perfil"=>"","perfil"=>"");
		}
		retornaJSON($dados);
		exit;
		break;
		/*
		 Valor: ALTERAMENUS

		Altera os dados de um menu

		Parametros:

		nome_menu

		desc_menu

		id_menu

		aberto

		perfil_menu

		publicado_menu

		en_menu

		es_menu

		it_menu

		Retorno:

		{JSON}
		*/
	case "ALTERAMENUS":
		alteraMenus();
		if(isset($id_menu) && $id_menu != "")
		{
			retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_menus where id_menu = $id_menu order by nome_menu"));
		}
		else
		{retornaJSON("ok");
		}
		exit;
		break;
		/*
		 Valor: PEGAGRUPOS

		Lista de grupos com todas as colunas

		Retorno:

		{JSON}
		*/
	case "PEGAGRUPOS":
		if(isset($id_grupo) && $id_grupo != "")
		{
			$dados = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_grupos WHERE id_grupo = $id_grupo order by nome_grupo");
		}
		else{
			$dados = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_grupos order by nome_grupo");
		}
		retornaJSON($dados);
		exit;
		break;
		/*
		 Valor: PEGAGRUPOS2

		Lista de grupos contendo as colunas principais

		Retorno:

		{JSON}
		*/
	case "PEGAGRUPOS2":
		$nome = "nome_grupo";
		if($idioma != "pt"){
			$nome = $idioma;
		}
		$dados = pegaDados("SELECT desc_grupo,id_grupo,$nome as 'nome_grupo' from ".$esquemaadmin."i3geoadmin_grupos order by $nome");
		retornaJSON($dados);
		exit;
		break;
		/*
		 Valor: ALTERAGRUPOS

		Altera os dados de um grupo

		Parametros:

		nome

		desc

		id

		en

		es

		it

		Retorno:

		{JSON}
		*/
	case "ALTERAGRUPOS":
		alteraGrupos();
		if(isset($id_grupo) && $id_grupo != "")	{
			retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_grupos WHERE id_grupo = $id_grupo"));
		}
		else{
			retornaJSON("ok");
		}
		exit;
		break;
		/*
		 Valor: PEGASUBGRUPOS

		Lista de subgrupos com todas as colunas

		Retorno:

		{JSON}
		*/
	case "PEGASUBGRUPOS":
		if(isset($id_subgrupo) && $id_subgrupo != ""){
			$dados = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_subgrupos WHERE id_subgrupo = $id_subgrupo order by nome_subgrupo");
		}
		else{
			$dados = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_subgrupos order by nome_subgrupo");
		}
		retornaJSON($dados);
		exit;
		break;
		/*
		 Valor: PEGASUBGRUPOS2

		Lista de grupos contendo as colunas principais

		Retorno:

		{JSON}
		*/
	case "PEGASUBGRUPOS2":
		$nome = "nome_subgrupo";
		if($idioma != "pt"){
			$nome = $idioma;
		}
		$dados = pegaDados("SELECT desc_subgrupo,id_subgrupo,$nome as 'nome_subgrupo' from ".$esquemaadmin."i3geoadmin_subgrupos order by nome_subgrupo");
		retornaJSON($dados);
		exit;
		break;
		/*
		 Valor: ALTERASUBGRUPOS

		Altera os dados de um subgrupo

		Parametros:

		nome

		desc

		id

		en

		es

		it

		Retorno:

		{JSON}
		*/
	case "ALTERASUBGRUPOS":
		alteraSubGrupos();
		if(isset($id_subgrupo) && $id_subgrupo != "")	{
			retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_subgrupos WHERE id_subgrupo = $id_subgrupo"));
		}
		else{
			retornaJSON("ok");
		}
		exit;
		break;
		/*
		 Valor: PEGATEMAS

		Lista de temas com todas as colunas

		Retorno:

		{JSON}
		*/
	case "PEGATEMAS":
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_temas where id_tema = '$id_tema'";
		retornaJSON(pegaDados($sql));
		exit;
		break;
		/*
		 Valor: PEGATEMAPORMAPFILE

		Lista os dados de um tema procurando registros com base no nome do mapfile

		Parametro:

		codigo_tema - nome do mapfile sem ".map"

		Retorno:

		{JSON}
		*/
	case "PEGATEMAPORMAPFILE":
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_temas where codigo_tema = '$codigo_tema'";
		$dados = pegaDados($sql);
		if(is_array($dados) && count($dados) == 0)
		{
			registraTema();
			$dados = pegaDados($sql);
		}
		$imagem = "";
		if(file_exists($locaplic."/temas/miniaturas/".$codigo_tema.".map.grande.png"))
		{
			$imagem = $codigo_tema.".map.grande.png";
		}
		$dados[0]["imagem"] = $imagem;
		if(is_array($dados) && count($dados) > 1)
		{
			$dados = "erro. Mais de um mapfile com mesmo c�digo registrado no banco";
		}
		retornaJSON($dados);
		exit;
		break;
		/*
		 Valor: PEGATEMAS2

		Lista de temas com as colunas principais

		Retorno:

		{JSON}
		*/
	case "PEGATEMAS2":
		retornaJSON(pegaTemas2());
		exit;
		break;
		/*
		 Valor: ATUALIZAMINIATURA

		Atualiza as imagens das miniaturas de um tema

		Retorno:

		{JSON}
		*/
	case "ATUALIZAMINIATURA":
		retornaJSON(atualizaMiniatura($tema));
		exit;
		break;
		/*
		 Valor: ALTERATEMAS

		Altera os dados de um tema

		Parametros:

		nome

		desc

		id

		codigo

		tipoa

		download

		ogc

		kml

		link

		tags

		kmz

		locaplic

		Retorno:

		{JSON}
		*/
	case "ALTERATEMAS":
		//$r ser&aacute; igual ao novo id criado, no caso de inser&ccedil;&atilde;o de um novo tema
		$r = alteraTemas();
		if($id == ""){
			retornaJSON($r);
		}
		else{
			retornaJSON(pegaDados("select * from ".$esquemaadmin."i3geoadmin_temas where id_tema = $id"));
		}
		exit;
		break;
		/*
		 Valor: ALTERATAGS

		Altera os dados de um tag

		Parametros:

		nome

		id

		Retorno:

		{JSON}
		*/
	case "ALTERATAGS":
		$novo = alteraTags();
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_tags WHERE id_tag = '".$novo."'";
		retornaJSON(pegaDados($sql));
		exit;
		break;
		/*
		 Valor: ALTERAPERFIS

		Altera os dados de um perfil

		Parametros:

		perfil

		id

		Retorno:

		{JSON}
		*/
	case "ALTERAPERFIS":
		$novo = alteraPerfis();
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_perfis WHERE id_perfil = '".$novo."'";
		retornaJSON(pegaDados($sql));
		exit;
		break;

	case "EXCLUIRREGISTRO":
		if($tabela == "grupos")
		{
			$tabela = "i3geoadmin_grupos";
			$coluna = "id_grupo";
			$filhos = verificaFilhos();
			if($filhos)
			{
				retornaJSON("erro");
				exit;
			}
		}
		if($tabela == "tags")
		{
			$tabela = "i3geoadmin_tags";
			$coluna = "id_tag";
			//excluiTagTemas($id);
		}
		if($tabela == "perfis")
		{
			$tabela = "i3geoadmin_perfis";
			$coluna = "id_perfil";
			excluiPerfil($id);
		}
		if($tabela == "subgrupos")
		{
			$tabela = "i3geoadmin_subgrupos";
			$coluna = "id_subgrupo";
			$filhos = verificaFilhos();
			if($filhos)
			{
				retornaJSON("erro");
				exit;
			}
		}
		if($tabela == "temas")
		{
			$tabela = "i3geoadmin_temas";
			$coluna = "id_tema";
			$filhos = verificaFilhos();
			if($filhos)
			{
				retornaJSON("erro");
				exit;
			}
		}
		if($tabela == "menus")
		{
			$tabela = "i3geoadmin_menus";
			$coluna = "id_menu";
			$filhos = verificaFilhos();
			if($filhos)
			{
				retornaJSON("erro");
				exit;
			}
		}
		retornaJSON(exclui());
		exit;
		break;

	case "LISTAMAPSTEMAS":
		retornaJSON(listaMapsTemas());
		exit;
		break;
		/*
		 Valor: VERIFICAORFAOS

		Verifica se existem temas sem o correspondente mapfile

		Retorno:

		{JSON}
		*/
	case "VERIFICAORFAOS":
		retornaJSON(verificaOrfaos());
		exit;
		break;
}
function excluiPerfil($id)
{
	global $esquemaadmin;
	require_once("conexao.php");
	$perfil = "";
	foreach($dbh->query("select * from ".$esquemaadmin."i3geoadmin_perfis where perfil = '$id'") as $row)
	{
		$perfil = $row["perfil"];
	}
	if($perfil == "")
	{
		return;
	}
	$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_mapas");
	foreach($q as $row)
	{
		$t = $row['perfil_mapa'];
		$i = $row['id_mapa'];
		$ts = str_replace($perfil,"",$t);
		if($t != $ts)
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_mapas SET perfil_mapa = '$ts' WHERE id_mapa = $i");
	}
	$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_menus");
	foreach($q as $row)
	{
		$t = $row['perfil_menu'];
		$i = $row['id_menu'];
		$ts = str_replace($perfil,"",$t);
		if($t != $ts)
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_menus SET perfil_menu = '$ts' WHERE id_menu = $i");
	}
	$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_n1");
	foreach($q as $row)
	{
		$t = $row['perfil_n1'];
		$i = $row['id_n1'];
		$ts = str_replace($perfil,"",$t);
		if($t != $ts)
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_n1 SET perfil_n1 = '$ts' WHERE id_n1 = $i");
	}
	$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_n2");
	foreach($q as $row)
	{
		$t = $row['perfil_n2'];
		$i = $row['id_n2'];
		$ts = str_replace($perfil,"",$t);
		if($t != $ts)
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_n2 SET perfil_n2 = '$ts' WHERE id_n2 = $i");
	}
	$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_n3");
	foreach($q as $row)
	{
		$t = $row['perfil_n3'];
		$i = $row['id_n3'];
		$ts = str_replace($perfil,"",$t);
		if($t != $ts)
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_n3 SET perfil_n3 = '$ts' WHERE id_n3 = $i");
	}
	$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_raiz");
	foreach($q as $row)
	{
		$t = $row['perfil'];
		$i = $row['id_raiz'];
		$ts = str_replace($perfil,"",$t);
		if($t != $ts)
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_raiz SET perfil = '$ts' WHERE id_raiz = $i");
	}
	$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_sistemasf");
	foreach($q as $row)
	{
		$t = $row['perfil_funcao'];
		$i = $row['id_funcao'];
		$ts = str_replace($perfil,"",$t);
		if($t != $ts)
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_sistemasf SET perfil_funcao = '$ts' WHERE id_funcao = $i");
	}
}
function excluiTagTemas($id)
{
	global $esquemaadmin;
	require_once("conexao.php");
	$q1 = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_tags where id_tag = $id");
	foreach($q1 as $row)
	{
		$nometag = $row["nome"];
	}
	if($nometag == ""){
		return;
	}
	$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_temas");
	foreach($q as $row)
	{
		$t = $row['tags_tema'];
		$i = $row['id_tema'];
		$ts = str_replace($nometag,"",$t);
		if($t != $ts)
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_temas SET tags_tema = '$ts' WHERE id_tema = $i");
	}
}
/*
 Pega a lista de temas

Parameters:

filtro - texto para filtrar os dados
*/
function pegaTemas()
{
	global $filtro,$esquemaadmin;
	try
	{
		$resultado = array();
		require_once("conexao.php");
		foreach($dbh->query("SELECT * from ".$esquemaadmin."i3geoadmin_temas order by nome_tema") as $row)
		{
			$continua = true;
			if(isset($filtro) && $filtro != "")
			{
				$continua = false;
				if ($row['codigo_tema'] == $filtro)
				{
					$continua = true;
				}
				$testanome = mb_convert_encoding($filtro,"UTF-8","ISO-8859-1");
				if (!stristr($row['nome_tema'],$testanome) === FALSE)
				{
					$continua = true;
				}
				if (!stristr($row['tags_tema'],$testanome) === FALSE)
				{
					$continua = true;
				}
			}
			if($row['codigo_tema'] == ""){
				$continua = true;
			}
			if ($continua)
				$resultado[] = array(
						"nome_tema"=>$row['nome_tema'],
						"codigo_tema"=>$row['codigo_tema'],
						"id_tema"=>$row['id_tema'],
						"desc_tema"=>$row['desc_tema'],
						"link_tema"=>$row['link_tema'],
						"tipoa_tema"=>$row['tipoa_tema'],
						"download_tema"=>$row['download_tema'],
						"ogc_tema"=>$row['ogc_tema'],
						"kml_tema"=>$row['kml_tema'],
						"kmz_tema"=>$row['kmz_tema'],
						"tags_tema"=>$row['tags_tema']
				);
		}
		$dbh = null;
		$dbh = null;
		return $resultado;
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
function pegaTemas2()
{
	global $filtro,$esquemaadmin;
	try
	{
		$resultado = array();
		require_once("conexao.php");
		foreach($dbh->query("SELECT codigo_tema,nome_tema,id_tema from ".$esquemaadmin."i3geoadmin_temas order by nome_tema") as $row)
		{
			$continua = true;
			if(isset($filtro) && $filtro != "")
			{
				$continua = false;
				if ($row['codigo_tema'] == $filtro)
				{
					$continua = true;
				}
				$testanome = mb_convert_encoding($filtro,"UTF-8","ISO-8859-1");
				if (!stristr($row['nome_tema'],$testanome) === FALSE)
				{
					$continua = true;
				}
			}
			if($row['codigo_tema'] == ""){
				$continua = true;
			}
			if ($continua)
				$resultado[] = array(
						"nome_tema"=>$row['nome_tema'],
						"codigo_tema"=>$row['codigo_tema'],
						"id_tema"=>$row['id_tema']
				);
		}
		$dbh = null;
		$dbh = null;
		return $resultado;
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
/*
 Altera o registro de um menu. Se id for vazio acrescenta o registro
*/
function alteraMenus()
{
	global $esquemaadmin,$nome_menu,$desc_menu,$id_menu,$aberto,$perfil_menu,$publicado_menu,$en,$es,$it;
	try
	{
		$retorna = "";
		include("conexao.php");
		if($convUTF)
		{
			$nome_menu = utf8_encode($nome_menu);
			$desc_menu = utf8_encode($desc_menu);
			$en = utf8_encode($en);
			$es = utf8_encode($es);
			$it = utf8_encode($it);
		}
		if($id_menu != "")
		{
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_menus SET en = '$en', es = '$es', it = '$it', publicado_menu = '$publicado_menu',aberto = '$aberto', nome_menu = '$nome_menu', desc_menu = '$desc_menu', perfil_menu = '$perfil_mennu' WHERE id_menu = $id_menu");
		}
		else
		{
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_menus (it,es,en,publicado_menu, nome_menu, desc_menu, aberto, perfil_menu) VALUES ('','','','','', '','SIM','')");
		}
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
function alteraPerfis()
{
	global $perfil,$id,$esquemaadmin;
	try
	{
		$dbh = "";
		include("conexao.php");
		if($convUTF) $perfil = utf8_encode($perfil);
		$retorna = "";
		if($id != "")
		{
			$original = "";
			foreach($dbh->query("select * from ".$esquemaadmin."i3geoadmin_perfis where id_perfil = $id") as $row)
			{
				$original = $row["perfil"];
			}
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_perfis SET perfil = '$perfil' WHERE id_perfil = $id");
			if($original != "")
			{
				$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_mapas");
				foreach($q as $row)
				{
					$t = $row['perfil_mapa'];
					$i = $row['id_mapa'];
					$ts = str_replace($original,$perfil,$t);
					if($t != $ts)
						$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_mapas SET perfil_mapa = '$ts' WHERE id_mapa = $i");
				}
				$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_menus");
				foreach($q as $row)
				{
					$t = $row['perfil_menu'];
					$i = $row['id_menu'];
					$ts = str_replace($original,$perfil,$t);
					if($t != $ts)
						$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_menus SET perfil_menu = '$ts' WHERE id_menu = $i");
				}
				$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_n1");
				foreach($q as $row)
				{
					$t = $row['n1_perfil'];
					$i = $row['id_n1'];
					$ts = str_replace($original,$perfil,$t);
					if($t != $ts)
						$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_n1 SET n1_perfil = '$ts' WHERE id_n1 = $i");
				}
				$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_n2");
				foreach($q as $row)
				{
					$t = $row['n2_perfil'];
					$i = $row['id_n2'];
					$ts = str_replace($original,$perfil,$t);
					if($t != $ts)
						$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_n2 SET n2_perfil = '$ts' WHERE id_n2 = $i");
				}
				$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_n3");
				foreach($q as $row)
				{
					$t = $row['n3_perfil'];
					$i = $row['id_n3'];
					$ts = str_replace($original,$perfil,$t);
					if($t != $ts)
						$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_n3 SET n3_perfil = '$ts' WHERE id_n3 = $i");
				}
				$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_raiz");
				foreach($q as $row)
				{
					$t = $row['perfil'];
					$i = $row['id_raiz'];
					$ts = str_replace($original,$perfil,$t);
					if($t != $ts)
						$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_raiz SET perfil = '$ts' WHERE id_raiz = $i");
				}
				$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_sistemas");
				foreach($q as $row)
				{
					$t = $row['perfil_sistema'];
					$i = $row['id_sistema'];
					$ts = str_replace($original,$perfil,$t);
					if($t != $ts)
						$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_sistemas SET perfil_sistema = '$ts' WHERE id_sistema = $i");
				}
				$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_sistemasf");
				foreach($q as $row)
				{
					$t = $row['perfil_funcao'];
					$i = $row['id_funcao'];
					$ts = str_replace($original,$perfil,$t);
					if($t != $ts)
						$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_sistemasf SET perfil_funcao = '$ts' WHERE id_funcao = $i");
				}
			}
			$retorna = $id;
		}
		else
		{
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_perfis (perfil) VALUES ('$perfil')");
			$id = $dbh->query("SELECT * FROM ".$esquemaadmin."i3geoadmin_perfis");
			$id = $id->fetchAll();
			$id = intval($id[count($id)-1]['id_perfil']);
			$retorna = $id;
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
function alteraTags()
{
	global $nome,$id,$esquemaadmin;
	try
	{
		$dbh = "";
		include("conexao.php");
		if($convUTF) $nome = utf8_encode($nome);
		$retorna = "";
		if($id != "")
		{
			if(!verificaDuplicados("select * from ".$esquemaadmin."i3geoadmin_tags where nome = '$nome'",$dbh))
			{
				$original = "";
				$q = $dbh->query("select * from ".$esquemaadmin."i3geoadmin_tags where id_tag = $id");
				foreach($q as $row)
				{
					$original = $row["nome"];
				}
				$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_tags SET nome = '$nome' WHERE id_tag = $id");
			}
			$retorna = $id;
		}
		else
		{
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_tags (nome) VALUES ('$nome')");
			$id = $dbh->query("SELECT * FROM ".$esquemaadmin."i3geoadmin_tags");
			$id = $id->fetchAll();
			$id = intval($id[count($id)-1]['id_tag']);
			$retorna = $id;
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
/*
 Altera o registro de um grupo. Se id for vazio acrescenta o registro
*/
function alteraGrupos()
{
	global $nome_grupo,$desc_grupo,$id_grupo,$en,$es,$it,$esquemaadmin;
	try
	{
		require_once("conexao.php");
		if($convUTF)
		{
			$nome_grupo = utf8_encode($nome_grupo);
			$desc_grupo = utf8_encode($desc_grupo);
			$en = utf8_encode($en);
			$es = utf8_encode($es);
			$it = utf8_encode($it);
		}
		if($id_grupo != "")
		{
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_grupos SET en = '$en', es = '$es', it = '$it', nome_grupo = '$nome_grupo', desc_grupo = '$desc_grupo' WHERE id_grupo = $id_grupo");
		}
		else
		{
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_grupos (nome_grupo, desc_grupo, en, es, it) VALUES ('', '','','','')");
		}
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
/*
 Altera o registro de um sub-grupo. Se id for vazio acrescenta o registro
*/
function alteraSubGrupos()
{
	global $nome_subgrupo,$desc_subgrupo,$id_subgrupo,$en,$es,$it,$esquemaadmin;
	try{
		require_once("conexao.php");
		if($convUTF){
			$nome_subgrupo = utf8_encode($nome_subgrupo);
			$desc_subgrupo = utf8_encode($desc_subgrupo);
			$en = utf8_encode($en);
			$es = utf8_encode($es);
			$it = utf8_encode($it);
		}
		$retorna = "";
		if($id_subgrupo != ""){
			$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_subgrupos SET en = '$en', es = '$es', it = '$it', nome_subgrupo = '$nome_subgrupo', desc_subgrupo = '$desc_subgrupo' WHERE id_subgrupo = $id_subgrupo");
		}
		else{
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_subgrupos (nome_subgrupo, desc_subgrupo, en, es, it) VALUES ('', '','','','')");
		}
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
/*
 Registra um mapfile na tabela de temas
*/
function registraTema()
{
	global $codigo_tema,$esquemaadmin;
	try
	{
		$retorna = "ok";
		include("conexao.php");
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_temas where codigo_tema = '$codigo_tema'";
		$dados = pegaDados($sql);
		if(count($dados) == 0)
		{
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_temas (tipoa_tema,nome_tema,codigo_tema,kml_tema,kmz_tema,ogc_tema,download_tema,tags_tema,link_tema,desc_tema) VALUES ('','$codigo_tema','$codigo_tema','SIM','NAO','SIM','SIM','','','')");
		}
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
/*
 Altera o registro de um tema. Se id for vazio acrescenta o registro
*/
function alteraTemas()
{
	global $esquemaadmin,$nome,$desc,$id,$codigo,$tipoa,$download,$ogc,$kml,$link,$tags,$kmz,$locaplic,$es,$it,$en;
	//error_reporting(E_ALL);
	try
	{
		$retorna = "ok";
		include("conexao.php");
		$nomeo = $nome;
		if($convUTF)
		{
			$nome = utf8_encode($nome);
			$desc = utf8_encode($desc);
			$tags = utf8_encode($tags);
			$en = utf8_encode($en);
			$es = utf8_encode($es);
			$it = utf8_encode($it);
		}
		if($id != "")
		{
			if(!isset($kmz))
				$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_temas SET es='$es', it='$it', en='$en', tags_tema='$tags', link_tema='$link', nome_tema ='$nome',desc_tema='$desc',codigo_tema='$codigo',tipoa_tema='$tipoa',download_tema='$download',ogc_tema='$ogc',kml_tema='$kml' WHERE id_tema = $id");
			else
				$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_temas SET es='$es', it='$it', en='$en',tags_tema='$tags', link_tema='$link', nome_tema ='$nome',desc_tema='$desc',codigo_tema='$codigo',tipoa_tema='$tipoa',download_tema='$download',ogc_tema='$ogc',kml_tema='$kml',kmz_tema='$kmz' WHERE id_tema = $id");
			$retorna = $id;
			if(!isset($kmz)){
				$kmz = "nao";
			}
			$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_temas where id_tema = $id";
			$q = $dbh->query($sql,PDO::FETCH_ASSOC);
			$resultado = $q->fetchAll();
			$mapfile = $resultado[0]["codigo_tema"];
			if(file_exists($locaplic."/temas/".$mapfile.".map")){
				$mapfile = $locaplic."/temas/".$mapfile.".map";
				if($mapa = @ms_newMapObj($mapfile))
				{
					$mapa = ms_newMapObj($mapfile);
					$numlayers = $mapa->numlayers;
					for ($i=0;$i < $numlayers;$i++)
					{
						$layer = $mapa->getlayer($i);
						$layer->setmetadata("permitedownload",strtolower($download));
						$layer->setmetadata("permiteogc",strtolower($ogc));
						$layer->setmetadata("permitekml",strtolower($kml));
						$layer->setmetadata("permitekmz",strtolower($kmz));
						//zera os metadados do sistema METAESTAT
						if($tipoa != "META"){
							$layer->setmetadata("METAESTAT_CODIGO_TIPO_REGIAO","");
							$layer->setmetadata("METAESTAT_ID_MEDIDA_VARIAVEL","");
							$layer->setmetadata("metaestat","");
						}
						if(count($nomes) == 1)
						{
							$layer->setmetadata("tema",$nomeo);
						}
					}
					$mapa->save($mapfile);
					removeCabecalho($mapfile);
				}
			}
		}
		else
		{
			$idtemp = (rand (9000,10000)) * -1;
			$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_temas (nome_tema) VALUES ('$idtemp')");// (link_tema,kml_tema,ogc_tema,download_tema,nome_tema,desc_tema,codigo_tema,tipoa_tema,tags_tema) VALUES ('','', '','','','','','','')");
			$id = $dbh->query("SELECT * ".$esquemaadmin."FROM i3geoadmin_temas WHERE nome_tema = '$idtemp'");
			$id = $id->fetchAll();
			$id = intval($id[0]['id_tema']);
			if(!isset($kmz))
				$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_temas SET tags_tema='', link_tema='', nome_tema ='',desc_tema='',codigo_tema='',tipoa_tema='',download_tema='',ogc_tema='',kml_tema='' WHERE id_tema = $id");
			else
				$dbhw->query("UPDATE ".$esquemaadmin."i3geoadmin_temas SET tags_tema='', link_tema='', nome_tema ='',desc_tema='',codigo_tema='',tipoa_tema='',download_tema='',ogc_tema='',kml_tema='',kmz_tema='' WHERE id_tema = $id");
			$retorna = $id;
		}
		//verifica se &eacute; necess&aacute;rio adicionar algum tag novo
		$tags = explode(" ",$tags);

		foreach($tags as $tag)
		{
			if(!(verificaDuplicados("select * from ".$esquemaadmin."i3geoadmin_tags where nome = '$tag'",$dbh)))
			{
				$dbhw->query("INSERT INTO ".$esquemaadmin."i3geoadmin_tags (nome) VALUES ('$tag')");
			}
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
/*
 Retorna a lista de mapfiles do diretorio i3geo/temas

*/
function listaMapsTemas()
{
	global $cp,$locaplic,$letra,$filtro,$esquemaadmin;
	$arquivos = array();
	if (is_dir($locaplic."/temas"))
	{
		if ($dh = opendir($locaplic."/temas"))
		{
			$extensao = "";
			while (($file = readdir($dh)) !== false)
			{
				if(!stristr($file, '.map') === FALSE){
					$extensao = "map";
				}
				if(!stristr($file, '.php') === FALSE){
					$extensao = "php";
				}
				if(!stristr($file, '.gvp') === FALSE){
					$extensao = "gvp";
				}
				if($extensao != "")
				{
					$file = str_replace(".".$extensao,"",$file);
					if(isset($letra) && $letra != "")
					{
						if(strtolower(substr(basename($file),0,1)) == strtolower($letra))
						{
							$arquivos[] = array("nome"=>$file,"extensao"=>$extensao);
						}
					}
					else
					{$arquivos[] = array("nome"=>$file,"extensao"=>$extensao);
					}
				}
				$extensao = "";
			}
		}
		closedir($dh);
	}
	sort($arquivos);
	//
	//pega o nome de cada tema filtrando a listagem se for o caso
	//
	$sql = "select * from ".$esquemaadmin."i3geoadmin_temas ";
	if(isset($filtro) && $filtro != ""){
		$filtro = explode(",",$filtro);
		$filtro = $filtro[0]." ".$filtro[1]." '".$filtro[2]."' or ".$filtro[0]." ".$filtro[1]." '".strtoupper($filtro[2])."'";
		$sql .= "where $filtro";
	}
	$dbh = "";
	include($locaplic."/admin/php/conexao.php");
	$q = $dbh->query($sql,PDO::FETCH_ASSOC);
	$regs = $q->fetchAll();
	//pega os grupos de usuarios que podem acessar o tema
	$grpids = array();
	$sql = "select nome,descricao,a.id_grupo,id_tema from ".$esquemaadmin."i3geousr_grupotema as a,".$esquemaadmin."i3geousr_grupos as b where a.id_grupo = b.id_grupo";
	$q = $dbh->query($sql,PDO::FETCH_ASSOC);
	if($q){
		$gs = $q->fetchAll();
		//agrupa o array
		foreach($gps as $g){
			array_push($grpids[$g["id_tema"]],array("id_grupo"=>$g["id_grupo"],"nome"=>$g["nome"],"descricao"=>$g["descricao"]));
		}
	}
	$nomes = array();
	$ids = array();
	foreach($regs as $reg){
		$nomes[$reg["codigo_tema"]] = $reg["nome_tema"];
		$ids[$reg["codigo_tema"]] = $reg["id_tema"];
		//$outros[$reg["codigo_tema"]] = array("kmz"=>$reg["kmz_tema"],"kml"=>$reg["kml_tema"],"ogc"=>$reg["ogc_tema"],"download"=>$reg["download_tema"],"link"=>$reg["link_tema"]);
	}
	$lista = array();
	foreach($arquivos as $arq){
		$extensao = $arq["extensao"];
		$arq = $arq["nome"];
		$nT = explode(".",$arq);
		$n = $nomes[$nT[0]];
		if(!$n){
			$n = "";
		}
		$id = $ids[$nT[0]];
		if(!$id){
			$id = "";
		}
		//pega os grupos de usuarios
		$grupousr = $grpids[$id];
		if(!$grupousr){
			$grupousr = "";
		}
		$imagem = "";
		if(file_exists($locaplic."/temas/miniaturas/".$arq.".map.mini.png")){
			$imagem = $arq.".map.mini.png";
		}
		if(isset($filtro) && $filtro != "" && $n != ""){
			$lista[] = array("grupousr"=>$grupousr,"id_tema"=>$id,"nome"=>$n,"codigo"=>$arq,"imagem"=>$imagem,"extensao"=>$extensao);
		}
		if(!isset($filtro) || $filtro == ""){
			$lista[] = array("grupousr"=>$grupousr,"id_tema"=>$id,"nome"=>$n,"codigo"=>$arq,"imagem"=>$imagem,"extensao"=>$extensao);
		}
	}
	return $lista;
}
/*
 Retorna a lista de temas sem mapfiles

*/
function verificaOrfaos()
{
	global $cp,$locaplic,$esquemaadmin;
	$arquivos = array();
	//
	//pega o nome de cada tema
	//
	$sql = "select nome_tema,codigo_tema,id_tema from ".$esquemaadmin."i3geoadmin_temas ";
	$dbh = "";
	include($locaplic."/admin/php/conexao.php");
	$q = $dbh->query($sql,PDO::FETCH_ASSOC);
	$regs = $q->fetchAll();
	$nomes = array();
	foreach($regs as $reg){
		if(!file_exists($locaplic."/temas/".$reg["codigo_tema"].".map") && !file_exists($locaplic."/temas/".$reg["codigo_tema"].".php")){
			$nomes[] = array("nome_tema"=>$reg["nome_tema"],"codigo_tema"=>$reg["codigo_tema"],"id_tema"=>$reg["id_tema"]);
		}
	}
	sort($nomes);
	return $nomes;
}
function removeCabecalho($arq,$symbolset=true)
{
	$handle = fopen($arq, "r");
	if ($handle)
	{
		$cabeca = array();
		if($symbolset)
		{
			$cabeca[] = "MAP\n";
		}
		$grava = false;
		while (!feof($handle))
		{
			$linha = fgets($handle);
			if($symbolset)
			{
				if(strpos(strtoupper($linha),"SYMBOLSET") !== false)
				{
					$cabeca[] = $linha;
				}
				if(strpos(strtoupper($linha),"FONTSET") !== false)
				{
					$cabeca[] = $linha;
				}
			}
			if(strtoupper(trim($linha)) == "LAYER")
			{
				$grava = true;
			}
			if($grava)
			{
				$final[] = rtrim($linha, "\r\n") . PHP_EOL;
			}
		}
		fclose($handle);
	}
	$final = array_merge($cabeca,$final);
	$handle = fopen($arq, "w+");
	foreach ($final as $f)
	{
		//
		//remove resultados em branco
		//e grava a linha
		//
		$teste = strtoupper($f);
		$teste = trim($teste);
		$teste = str_replace(" ","",$teste);
		$teste = str_replace("'","",$teste);
		$teste = str_replace('"',"",$teste);
		$teste = preg_replace('/[\n\r\t ]*/', '', $teste);
		$testar = array("KEYIMAGE","TILEINDEX","TILEITEM","SYMBOL","LABELITEM","FILTERITEM","GROUP","ENCODING","TIP","CLASSE","ITENSDESC","CLASSESNOME","ITENSLINK","ESCALA","CLASSESSIMBOLO","MENSAGEM","EXTENSAO","CLASSESITEM","ESCONDIDO","CLASSESCOR","DOWNLOAD","CLASSESTAMANHO","ITENS","TEMA","APLICAEXTENSAO","IDENTIFICA");
		$passou = true;
		foreach ($testar as $t)
		{
			if($teste == $t){
				$passou = false;
			}
		}
		if($passou)
			fwrite($handle,$f);
	}
	fclose($handle);
	chmod($arq, 0666);
}
function atualizaMiniatura(){
	global $tema,$locaplic;
	$tipo = "foo";
	include_once("../../classesphp/funcoes_gerais.php");
	require("../../geraminiatura.php");
	verificaMiniatura($tema,"todos",true);
	return "ok";
}
?>