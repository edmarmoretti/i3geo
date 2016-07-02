<?php
/*
Title: mapas.php

Fun&ccedil;&otilde;es utilizadas pelo editor do cadastro de mapas (links).

&Eacute; utilizado nas fun&ccedil;&otilde;es em AJAX da interface de edi&ccedil;&atilde;o dos links para mapas

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
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
	GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/php/mapas.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada, por exemplo, mapas.php?funcao=pegamapas.

Cada opera&ccedil;&atilde;o possu&iacute; seus pr&oacute;prios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.

*/

include_once(dirname(__FILE__)."/login.php");
$funcoesEdicao = array(
		"ALTERARMAPA",
		"EXCLUIRMAPA",
		"SALVAMAPFILE"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/html/mapas") == false){
		retornaJSON("Vc nao pode realizar essa operacao. Tente fazer login novamente.");exit;
	}
}
error_reporting(0);
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
switch (strtoupper($funcao))
{
	/*
	Note:

	Valores que o par&acirc;metro &funcao pode receber. Os par&acirc;metros devem ser enviados na requisi&ccedil;&atilde;o em AJAX.
	*/
	/*
	Valor: PEGAMAPAS

	Lista os links existentes

	Retorno:

	{JSON}
	*/
	case "PEGAMAPAS":
		$semmapfile = pegaDados("SELECT id_mapa,nome_mapa,ordem_mapa,'nao' as contemmapfile from ".$esquemaadmin."i3geoadmin_mapas where mapfile = '' or mapfile is null order by ordem_mapa");
		$commapfile = pegaDados("SELECT id_mapa,nome_mapa,ordem_mapa,'sim' as contemmapfile from ".$esquemaadmin."i3geoadmin_mapas where mapfile != '' and mapfile is not null order by ordem_mapa");
		retornaJSON(array_merge($semmapfile,$commapfile));
		exit;
	break;
		/*
		Valor: PEGADADOSMAPA

		Lista os dados de um link

		Parametro:

		id_mapa {string}

		Retorno:

		{JSON}
		*/
	case "PEGADADOSMAPA":
		$dadosMapa = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_mapas where id_mapa =".$id_mapa);
		retornaJSON($dadosMapa);
		exit;
		break;
		/*
		Valor: ALTERARMAPA

		Altera os dados de um link

		Parametro:

		publicado_mapa

		ordem_mapa

		id_mapa

		desc_mapa

		ext_mapa

		imagem_mapa

		outros_mapa

		nome_mapa

		linkdireto_mapa

		temas_mapa

		ligados_mapa

		perfil_mapa

		Retorno:

		{JSON}
		*/
	case "ALTERARMAPA":
		$novo = alterarMapa();
		$sql = "SELECT * from ".$esquemaadmin."i3geoadmin_mapas WHERE id_mapa = '".$novo."'";
		retornaJSON(pegaDados($sql));
		exit;
		break;
		/*
		Valor: EXCLUIRMAPA

		Exclui um link

		Parametro:

		id {string}

		Retorno:

		{JSON}
		*/
	case "EXCLUIRMAPA":
		retornaJSON(excluirMapa());
		exit;
	break;
	/*
	Valor: SALVAMAPFILE

	Salva um mapfile no banco

	Parametro:

	url {string} - url de acesso a interface do mapa que iniciou o processo de salvar o mapa

	titulo {string} - titulo do mapa

	mapfile {string} - mapfile na pasta tempor&aacute;ria

	Retorno:

	{JSON}
	*/
	case "SALVAMAPFILE":
		retornaJSON(salvaMapfile());
		exit;
	break;
}
function salvaMapfile(){
	global $esquemaadmin,$nome_mapa,$arqmapfile,$url,$id_mapa,$preferenciasbase64,$geometriasbase64,$graficosbase64,$tabelasbase64,$ext;
	//as preferencias sao criadas via javascript e guardadas junto com o mapa
	try{
		//
		//as configuracoes especiais do mapa, definidas nas preferencias ou em ferramentas abertas quando o mapa e salvo,
		//sao convertidas em base64 do lado do cliente
		//esses dados sao entao armazenados como tags METADATA no mapfile
		//quando o mapa e restaurado, esses valores sao recuperados
		//a string que vai no metadata segue o padrao JSON
		//o parser para reconstruir os valores e feito em javascript, no cliente
		//
		$customizacoesinit = array();
		if(isset($preferenciasbase64) || isset($geometriasbase64) || isset($graficosbase64) || isset($tabelasbase64)){
			$customizacoesinit[] = '"preferenciasbase64":"'.$preferenciasbase64.'"';
			$customizacoesinit[] = '"geometriasbase64":"'.$geometriasbase64.'"';
			$customizacoesinit[] = '"graficosbase64":"'.$graficosbase64.'"';
			$customizacoesinit[] = '"tabelasbase64":"'.$tabelasbase64.'"';
			$m = ms_newMapObj($arqmapfile);
			$m->setmetadata("CUSTOMIZACOESINIT",'{'.implode(",",$customizacoesinit).'}');
			$m->save($arqmapfile);
		}
		if($ext && $ext != ""){
			$e = explode(" ",$ext);
			$m = ms_newMapObj($arqmapfile);
			$extatual = $m->extent;
			$extatual->setextent((min($e[0],$e[2])),(min($e[1],$e[3])),(max($e[0],$e[2])),(max($e[1],$e[3])));
			$m->save($arqmapfile);
		}
		$handle = fopen ($arqmapfile, 'r');
		$conteudo = fread ($handle, filesize ($arqmapfile));
		fclose ($handle);
		$conteudo = base64_encode($conteudo);
		if($conteudo == false){
			return array("id"=>"","status"=>"erro");
		}
		require_once("conexao.php");
		if($convUTF){
			$nome_mapa = utf8_encode($nome_mapa);
		}
		$retorna = "";
		if(empty($id_mapa)){
			$dataCol = array(
				"publicado_mapa" => '',
				"ordem_mapa" => 0,
				"perfil_mapa" => '',
				"desc_mapa" => '',
				"ext_mapa" => '',
				"imagem_mapa" => '',
				"linkdireto_mapa" => '',
				"outros_mapa" => '',
				"temas_mapa" => '',
				"ligados_mapa" => '',
				"nome_mapa" => ''
			);
			$id = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_mapas",$dataCol,"nome_mapa","id_mapa");
		}
		else{
			$id = $id_mapa;
		}
		$dataCol = array(
			"mapfile" => $conteudo,
			"publicado_mapa" => "sim",
			"nome_mapa" => $nome_mapa,
			"outros_mapa" => "&restauramapa=$id&interface=$url"
		);
		i3GeoAdminUpdate($dbhw,"i3geoadmin_mapas",$dataCol, "WHERE id_mapa =".$id);
		$dbhw = null;
		$dbh = null;
		return array("id"=>$id,"status"=>"ok");
	}
	catch (PDOException $e){
		return array("id"=>"","status"=>"Error!: " . " ");
	}
}
/*
Altera o registro de um mapa
*/
function alterarMapa(){
	global $esquemaadmin,$publicado_mapa,$ordem_mapa,$id_mapa,$desc_mapa,$ext_mapa,$imagem_mapa,$outros_mapa,$nome_mapa,$linkdireto_mapa,$temas_mapa,$ligados_mapa,$perfil_mapa;
	//substitui a string do parametro outros
	$outros_mapa = str_replace("*","&",$outros_mapa);
	try{
		require_once("conexao.php");
		if($convUTF){
			$nome_mapa = utf8_encode($nome_mapa);
			$desc_mapa = utf8_encode($desc_mapa);
		}
		$retorna = "";
		if($id_mapa != ""){
			$dataCol = array(
				"publicado_mapa" => $publicado_mapa,
				"ordem_mapa" => $ordem_mapa,
				"desc_mapa" => $desc_mapa,
				"ext_mapa" => $ext_mapa,
				"imagem_mapa" => $imagem_mapa,
				"outros_mapa" => $outros_mapa,
				"nome_mapa" => $nome_mapa,
				"linkdireto_mapa" => $linkdireto_mapa,
				"temas_mapa" => $temas_mapa,
				"ligados_mapa" => $ligados_mapa,
				"perfil_mapa" => $perfil_mapa
			);
			i3GeoAdminUpdate($dbhw,"i3geoadmin_mapas",$dataCol, "WHERE id_mapa =".$id_mapa);
			$retorna = $id_mapa;
		}
		else{
			$dataCol = array(
				"publicado_mapa" => '',
				"ordem_mapa" => 0,
				"perfil_mapa" => '',
				"desc_mapa" => '',
				"ext_mapa" => '',
				"imagem_mapa" => '',
				"linkdireto_mapa" => '',
				"outros_mapa" => '',
				"temas_mapa" => '',
				"ligados_mapa" => '',
				"nome_mapa" => '',
				"mapfile" => ''
			);
			$id = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_mapas",$dataCol,"nome_mapa","id_mapa");
			$retorna = $id;
		}
		$dbhw = null;
		$dbh = null;
		return $retorna;
	}
	catch (PDOException $e){
		return "Error!: ";
	}
}
function excluirMapa(){
	global $id,$esquemaadmin;
	try{
		exclui($esquemaadmin."i3geoadmin_mapas","id_mapa",$id);
		return "ok";
	}
	catch (PDOException $e){
		return "Error!: ";
	}
}
?>