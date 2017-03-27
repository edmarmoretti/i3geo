<?php
/****************************************************************/
include (dirname ( __FILE__ ) . "/../../../../../ms_configura.php");
//
//checa login
//valida _GET e _POST, juntando em _GET
//pega algumas variaveis de uso mais comum
//session_start
//
include ("../../../../php/checaLogin.php");
\admin\php\login\checaLogin();
//funcoes de administracao
include ($_SESSION["locaplic"]."/admin1/php/funcoesAdmin.php");
//
//carrega outras funcoes e extensoes do PHP
//
include ($_SESSION["locaplic"]."/classesphp/carrega_ext.php");
//
//carrega as funcoes locais
//depende de funcoesAdmin.php
//
include ("funcoes.php");
//
//conexao com o banco de administracao
//cria as variaveis $dbh e $dbhw alem de conexaoadmin
//
include ($_SESSION["locaplic"]."/admin1/php/conexao.php");
/***************************************************************/
if (\admin\php\funcoesAdmin\verificaOperacaoSessao ( "admin/html/editormapfile" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}

$codigo = $_POST ["codigo"];
$codigo = str_replace ( " ", "", \admin\php\funcoesAdmin\removeAcentos ( $codigo ) );
$codigo = str_replace ( ".", "", $codigo );
$codigo = strip_tags ( $codigo );
$codigo = htmlspecialchars ( $codigo, ENT_QUOTES );

$id_tema = ( int ) $_POST ["id_tema"];

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ALTERAR" :
		$dados = \admin\catalogo\mapfile\conexao\ogc\alterar ($_SESSION["locaplic"],$codigo,$_POST["connection"],$_POST["connectiontype"],$_POST["ows_srs"],$_POST["ows_name"],$_POST["ows_server_version"],$_POST["ows_format"],$_POST["ows_auth_username"],$_POST["ows_auth_password"],$_POST["ows_auth_type"],$_POST["ows_connectiontimeout"],$_POST["ows_latlonboundingbox"],$_POST["ows_proxy_auth_type"],$_POST["ows_proxy_host"],$_POST["ows_proxy_port"],$_POST["ows_proxy_type"],$_POST["ows_proxy_username"],$_POST["ows_proxy_password"],$_POST["ows_sld_body"],$_POST["ows_sld_url"],$_POST["ows_style"],$_POST["ows_bgcolor"],$_POST["ows_transparent"],$_POST["ows_time"],$_POST["ows_tile"],$dbhw);
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao definir as propriedades" );
		}
		break;
	case "LISTA" :
		$dados = \admin\catalogo\mapfile\conexao\ogc\listar ($_SESSION["locaplic"],$codigo);
		\admin\php\funcoesAdmin\retornaJSON ( array (
			"dados" => $dados
		) );
		break;
	default:
		header ( "HTTP/1.1 500 erro funcao nao existe" );
		break;
}
/*
 linha do tempo

 $dados["ltempoformatodata"] = $layer->getmetadata("ltempoformatodata");
 $dados["ltempoiteminicio"] = $layer->getmetadata("ltempoiteminicio");
 $dados["ltempoitemfim"] = $layer->getmetadata("ltempoitemfim");
 $dados["ltempoitemtitulo"] = $layer->getmetadata("ltempoitemtitulo");
 $dados["ltempoitemdescricao"] = $layer->getmetadata("ltempoitemdescricao");
 $dados["ltempoconvencode"] = $layer->getmetadata("ltempoconvencode");
 $dados["ltempoitemtip"] = $layer->getmetadata("ltempoitemtip");
 $dados["ltempoitemimagem"] = $layer->getmetadata("ltempoitemimagem");
 $dados["ltempoitemicone"] = $layer->getmetadata("ltempoitemicone");
 $dados["ltempoitemlink"] = $layer->getmetadata("ltempoitemlink");

 outros

 $dados["classesitem"] = $layer->getmetadata("classesitem");
 $dados["classesnome"] = $layer->getmetadata("classesnome");
 $dados["classescor"] = $layer->getmetadata("classescor");
 $dados["classessimbolo"] = $layer->getmetadata("classessimbolo");
 $dados["classestamanho"] = $layer->getmetadata("classestamanho");
 $dados["palletefile"] = $layer->getmetadata("palletefile");
 $dados["palletestep"] = $layer->getmetadata("palletestep");
 $dados["description_template"] = $layer->getmetadata("description_template");
 $dados["editorsql"] = $layer->getmetadata("editorsql");
 */
?>
