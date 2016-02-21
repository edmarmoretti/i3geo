<?php
/*
 Title: atlas.php

Fun&ccedil;&otilde;es utilizadas pelo editor de Atlas.

&Eacute; utilizado nas fun&ccedil;&otilde;es em AJAX da interface de edi&ccedil;&atilde;o dos Atlas

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

i3geo/admin/php/atlas.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada, por exemplo, atlas.php?funcao=pegaAtlas

Cada opera&ccedil;&atilde;o possu&iacute; seus proprios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.

*/
include_once(dirname(__FILE__)."/login.php");
$funcoesEdicao = array(
		"ALTERARATLAS",
		"ALTERARPRANCHA",
		"ALTERARTEMA",
		"EXCLUIRATLAS",
		"EXCLUIRPRANCHA",
		"EXCLUIRTEMA"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/atlas") == false){
		retornaJSON("Vc nao pode realizar essa operacao.");exit;
	}
}
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
switch (strtoupper($funcao))
{
	/*
	 Note:

	Valores que o par&acirc;metro &funcao pode receber. Os par&acirc;metros devem ser enviados na requisi&ccedil;&atilde;o em AJAX.
	*/
	/*
	 Valor: PEGAATLAS

	Lista todos os Atlas

	Retorno:

	{JSON}
	*/
	case "PEGAATLAS":
		retornaJSON(pegaDados("SELECT id_atlas,titulo_atlas from ".$esquemaadmin."i3geoadmin_atlas order by ordem_atlas"));
		exit;
		break;
		/*
		 Valor: PEGAPRANCHAS

		Lista de pranchas de um Atlas

		Parametros:

		id_atlas

		Retorno:

		{JSON}
		*/
	case "PEGAPRANCHAS":
		retornaJSON(pegaDados("SELECT id_prancha,titulo_prancha from ".$esquemaadmin."i3geoadmin_atlasp where id_atlas='$id_atlas' order by ordem_prancha"));
		exit;
		break;
		/*
		 Valor: PEGATEMAS

		Lista os temas de uma prancha

		Parametros:

		id_prancha

		Retorno:

		{JSON}
		*/
	case "PEGATEMAS":
		retornaJSON(pegaDados("SELECT i3geoadmin_atlast.*,i3geoadmin_temas.nome_tema from ".$esquemaadmin."i3geoadmin_atlast LEFT JOIN ".$esquemaadmin."i3geoadmin_temas ON ( i3geoadmin_atlast.codigo_tema =  i3geoadmin_temas.codigo_tema ) where id_prancha = '$id_prancha' order by ordem_tema"));
		exit;
		break;
		/*
		 Valor: PEGADADOSATLAS

		Lista os dados de um atlas

		Parametros:

		id_atlas

		Retorno:

		{JSON}
		*/
	case "PEGADADOSATLAS":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_atlas where id_atlas =".$id_atlas));
		exit;
		break;
		/*
		 Valor: PEGADADOSPRANCHA

		Lista os dados de uma prancha

		Parametros:

		id_prancha

		Retorno:

		{JSON}
		*/
	case "PEGADADOSPRANCHA":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_atlasp where id_prancha =".$id_prancha));
		exit;
		break;
		/*
		 Valor: PEGADADOSTEMA

		Lista os dados de um tema

		Parametros:

		id_tema

		Retorno:

		{JSON}
		*/
	case "PEGADADOSTEMA":
		retornaJSON(pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_atlast where id_tema = '$id_tema'"));
		exit;
		break;
		/*
		 Valor: ALTERARATLAS

		Altera os dados de um atlas

		Parametros:

		publicado_atlas

		id_atlas

		basemapfile_atlas

		desc_atlas

		h_atlas

		w_atlas

		icone_atlas

		link_atlas

		pranchadefault_atlas

		template_atlas

		tipoguias_atlas

		titulo_atlas

		ordem_atlas

		Retorno:

		{JSON}
		*/
	case "ALTERARATLAS":
		$novo = alterarAtlas();
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_atlas WHERE id_atlas = '".$novo."'";
		retornaJSON(pegaDados($sql));
		exit;
		break;
		/*
		 Valor: ALTERARPRANCHA

		Altera os dados de uma prancha

		Parametros:

		mapext_prancha

		id_atlas

		id_prancha

		desc_prancha

		h_prancha

		w_prancha

		icone_prancha

		link_prancha

		titulo_prancha

		ordem_prancha

		Retorno:

		{JSON}
		*/
	case "ALTERARPRANCHA":
		$novo = alterarPrancha();
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_atlasp WHERE id_prancha = '".$novo."'";
		retornaJSON(pegaDados($sql));
		exit;
		break;
		/*
		 Valor: ALTERARTEMA

		Altera os dados de um tema

		Parametros:

		id_tema

		id_prancha

		codigo_tema

		ligado_tema

		ordem_tema

		Retorno:

		{JSON}
		*/
	case "ALTERARTEMA":
		$novo = alterarTema();
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_atlast WHERE id_tema = '".$novo."'";
		retornaJSON(pegaDados($sql));
		break;
		/*
		 Valor: EXCLUIRATLAS

		Exclui um Atlas

		Parametros:

		id

		Retorno:

		{JSON}
		*/
	case "EXCLUIRATLAS":
		$tabela = "i3geoadmin_atlas";
		$f = verificaFilhos();
		if(!$f)
			retornaJSON(excluirAtlas());
		else
			retornaJSON("erro");
		exit;
		break;
		/*
		 Valor: EXCLUIRPRANCHA

		Exclui uma prancha

		Parametros:

		id

		Retorno:

		{JSON}
		*/
	case "EXCLUIRPRANCHA":
		$tabela = "i3geoadmin_atlasp";
		$f = verificaFilhos();
		if(!$f)
			retornaJSON(excluirPrancha());
		else
			retornaJSON("erro");
		exit;
		break;
		/*
		 Valor: EXCLUIRTEMA

		Exclui um tema de uma prancha

		Parametros:

		id

		Retorno:

		{JSON}
		*/
	case "EXCLUIRTEMA":
		retornaJSON(excluirTema());
		exit;
		break;
		/*
		 Valor: MOVIMENTANO

		Muda a ordem de um n�

		Parametros:

		tipo - tipo de n� tema|prancha|atlas

		movimento - sobe|desce

		id- id do n�

		Retorno:

		{JSON}
		*/
	case "MOVIMENTANO":
		movimentaNo();
		retornaJSON("ok");
		exit;
		break;
}
function movimentaNo()
{
	global $tipo,$movimento,$id,$esquemaadmin;
	if($tipo == "tema")
	{
		//pega a ordem atual
		$reg = pegaDados("SELECT ordem_tema,id_prancha from ".$esquemaadmin."i3geoadmin_atlast where id_tema = '$id'");
		$ordematual = $reg[0]["ordem_tema"];
		$prancha = $reg[0]["id_prancha"];
		$where = " id_prancha = '$prancha' and";
		$posfixo = "tema";
		$tabela = "atlast";
	}
	if($tipo == "prancha")
	{
		//pega a ordem atual
		$reg = pegaDados("SELECT ordem_prancha,id_atlas from ".$esquemaadmin."i3geoadmin_atlasp where id_prancha = '$id'");
		$ordematual = $reg[0]["ordem_prancha"];
		$atlas = $reg[0]["id_atlas"];
		$where = "id_atlas = '$atlas' and ";
		$posfixo = "prancha";
		$tabela = "atlasp";
	}
	if($tipo == "atlas")
	{
		//pega a ordem atual
		$ordematual = pegaDados("SELECT ordem_atlas from ".$esquemaadmin."i3geoadmin_atlas where id_atlas = '$id'");
		$ordematual = $ordematual[0]["ordem_atlas"];
		$where = "";
		$posfixo = "atlas";
		$tabela = "atlas";
	}
	include("conexao.php");
	if($movimento == "sobe")
	{
		$menos = $ordematual - 1;
		$dataCol = array(
			"ordem_".$posfixo=>$ordematual
		);
		i3GeoAdminUpdate($dbhw,"i3geoadmin_".$tabela,$dataCol,"WHERE $where ordem_$posfixo = '$menos'");
		$dataCol = array(
				"ordem_".$posfixo=>$menos
		);
		i3GeoAdminUpdate($dbhw,"i3geoadmin_".$tabela,$dataCol,"WHERE $where id_$posfixo = '$id'");
	}
	if($movimento == "desce")
	{
		$mais = $ordematual + 1;
		$dataCol = array(
				"ordem_".$posfixo=>$ordematual
		);
		i3GeoAdminUpdate($dbhw,"i3geoadmin_".$tabela,$dataCol,"WHERE $where ordem_$posfixo = '$mais'");
		$dataCol = array(
				"ordem_".$posfixo=>$mais
		);
		i3GeoAdminUpdate($dbhw,"i3geoadmin_".$tabela,$dataCol,"WHERE $where id_$posfixo = '$id'");
	}
	$dbhw = null;
	$dbh = null;
	return "ok";
}
function dadosAtlas()
{
	global $id_atlas,$esquemaadmin;
	if($id_atlas == "")
		$sis = pegaDados('SELECT * from '.$esquemaadmin.'i3geoadmin_atlas order by titulo_atlas');
	else
		$sis = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_atlas where id_atlas = '$id_atlas' ");
	for($i=0;$i<count($sis);++$i)
	{
		$pranchas = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_atlasp where id_atlas =".($sis[$i]["id_atlas"]));
		for($j=0;$j<count($pranchas);++$j)
		{
			$temas = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_atlast where id_prancha =".($pranchas[$j]["id_prancha"]));
			if(count($temas) > 0)
				$pranchas[$j]["temas"] = $temas;
			else
				$pranchas[$j]["temas"] = "";
		}
		if(count($pranchas) > 0)
			$sis[$i]["pranchas"] = $pranchas;
		else
			$sis[$i]["pranchas"] = "";
	}
	return $sis;
}
function alterarAtlas()
{
	global $esquemaadmin,$publicado_atlas,$id_atlas,$basemapfile_atlas,$desc_atlas,$h_atlas,$w_atlas,$icone_atlas,$link_atlas,$pranchadefault_atlas,$template_atlas,$tipoguias_atlas,$titulo_atlas,$ordem_atlas;
	try{
		include("conexao.php");
		if($id_atlas != ""){
			if($convUTF){
				$desc_atlas = utf8_encode($desc_atlas);
				$titulo_atlas = utf8_encode($titulo_atlas);
			}
			$dataCol = array(
					"publicado_atlas"=>$publicado_atlas,
					"ordem_atlas"=>$ordem_atlas == "" ? 0 : $ordem_atlas,
					"basemapfile_atlas"=>$basemapfile_atlas,
					"desc_atlas"=>$desc_atlas,
					"h_atlas"=>$h_atlas == "" ? 0 : $h_atlas,
					"w_atlas"=>$w_atlas == "" ? 0 : $w_atlas,
					"icone_atlas"=>$icone_atlas,
					"link_atlas"=>$link_atlas,
					"pranchadefault_atlas"=>$pranchadefault_atlas,
					"template_atlas"=>$template_atlas,
					"tipoguias_atlas"=>$tipoguias_atlas,
					"titulo_atlas"=>$titulo_atlas
			);
			i3GeoAdminUpdate($dbhw,"i3geoadmin_atlas",$dataCol,"WHERE id_atlas = $id_atlas");
			$retorna = $id_atlas;
		}
		else{
			$o = $dbh->query("SELECT MAX(ordem_atlas) as o FROM ".$esquemaadmin."i3geoadmin_atlas");
			$o = $o->fetchAll();
			$o = $o[0]['o'] + 1;
			$dataCol = array(
				"publicado_atlas"=>'',
				"basemapfile_atlas"=>'',
				"desc_atlas"=>'',
				"h_atlas"=>null,
				"w_atlas"=>null,
				"icone_atlas"=>'',
				"link_atlas"=>'',
				"pranchadefault_atlas"=>'',
				"template_atlas"=>'',
				"tipoguias_atlas"=>'',
				"ordem_atlas"=>$o,
				"titulo_atlas"=>''
			);
			$retorna = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_atlas",$dataCol,"titulo_atlas","id_atlas");
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e){
		return "Error!: " . $e->getMessage();
	}
}
function alterarPrancha()
{
	global $esquemaadmin,$mapext_prancha,$id_atlas,$id_prancha,$desc_prancha,$h_prancha,$w_prancha,$icone_prancha,$link_prancha,$titulo_prancha,$ordem_prancha;
	try{
		include("conexao.php");
		if($id_prancha != ""){
			if($convUTF){
				$desc_prancha = utf8_encode($desc_prancha);
				$titulo_prancha = utf8_encode($titulo_prancha);
			}
			$dataCol = array(
					"ordem_prancha"=>$ordem_prancha,
					"mapext_prancha"=>$mapext_prancha,
					"desc_prancha"=>$desc_prancha,
					"h_prancha"=>$h_prancha == "" ? 0 : $h_prancha,
					"w_prancha"=>$w_prancha == "" ? 0 : $w_prancha,
					"icone_prancha"=>$icone_prancha,
					"link_prancha"=>$link_prancha,
					"titulo_prancha"=>$titulo_prancha
			);
			i3GeoAdminUpdate($dbhw,"i3geoadmin_atlasp",$dataCol,"WHERE id_prancha = $id_prancha");
			$retorna = $id_prancha;
		}
		else{
			$o = $dbh->query("SELECT MAX(ordem_prancha) as o FROM ".$esquemaadmin."i3geoadmin_atlasp WHERE id_atlas = '$id_atlas'");
			$o = $o->fetchAll();
			$o = $o[0]['o'] + 1;

			$dataCol = array(
				"ordem_prancha"=>$o,
				"mapext_prancha"=>'',
				"desc_prancha"=>'',
				"h_prancha"=>$h_prancha == "" ? 0 : $h_prancha,
				"w_prancha"=>$w_prancha == "" ? 0 : $w_prancha,
				"icone_prancha"=>'',
				"link_prancha"=>'',
				"titulo_prancha"=>'',
				"id_atlas"=>$id_atlas
			);
			$retorna = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_atlasp",$dataCol,"titulo_prancha","id_prancha");
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e){
		return "Error!: " . $e->getMessage();
	}
}
function alterarTema(){
	global $esquemaadmin,$id_tema,$id_prancha,$codigo_tema,$ligado_tema,$ordem_tema;
	try{
		include("conexao.php");
		if($id_tema != ""){
			$dataCol = array(
				"ordem_tema"=>$ordem_tema,
				"codigo_tema"=>$codigo_tema,
				"ligado_tema"=>$ligado_tema
			);
			i3GeoAdminUpdate($dbhw,"i3geoadmin_atlast",$dataCol,"WHERE id_tema = $id_tema");
			$retorna = $id_tema;
		}
		else{
			$o = $dbh->query("SELECT MAX(ordem_tema) as o FROM ".$esquemaadmin."i3geoadmin_atlast where id_prancha = '$id_prancha'");
			$o = $o->fetchAll();
			$o = $o[0]['o'] + 1;
			$dataCol = array(
				"ordem_tema"=>$o,
				"codigo_tema"=>$codigo_tema,
				"ligado_tema"=>$ligado_tema,
				"id_prancha"=>$id_prancha
			);
			$retorna = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_atlast",$dataCol,"codigo_tema","id_tema");
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e){
		return "Error!: " . $e->getMessage();
	}
}
function excluirPrancha()
{
	global $esquemaadmin,$id;
	try
	{
		include("conexao.php");
		$sql = "DELETE from ".$esquemaadmin."i3geoadmin_atlasp WHERE id_prancha = $id";
		$dbhw->query($sql);
		i3GeoAdminInsertLog($dbhw,$sql);
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
function excluirTema()
{
	global $esquemaadmin,$id;
	try
	{
		include("conexao.php");
		$sql = "DELETE from ".$esquemaadmin."i3geoadmin_atlast WHERE id_tema = $id";
		$dbhw->query($sql);
		i3GeoAdminInsertLog($dbhw,$sql);
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
function excluirAtlas()
{
	global $esquemaadmin,$id;
	try
	{
		include("conexao.php");
		$sql = "DELETE from ".$esquemaadmin."i3geoadmin_atlas WHERE id_atlas = $id";
		$dbhw->query($sql);
		i3GeoAdminInsertLog($dbhw,$sql);
		$dbhw = null;
		$dbh = null;
		return "ok";
	}
	catch (PDOException $e)
	{
		return "Error!: " . $e->getMessage();
	}
}
?>