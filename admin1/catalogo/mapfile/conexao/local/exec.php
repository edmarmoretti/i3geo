<?php
/****************************************************************/
include (dirname ( __FILE__ ) . "/../../../../../ms_configura.php");
//
//checa login
//valida _GET e _POST, juntando em _GET
//pega algumas variaveis de uso mais comum
//session_start
//
include ($locaplic."/admin1/php/checaLogin.php");
//funcoes de administracao
include ($locaplic."/admin1/php/funcoesAdmin.php");
//
//carrega outras funcoes e extensoes do PHP
//
include ($locaplic."/classesphp/carrega_ext.php");
//
//carrega as funcoes locais
//depende de funcoesAdmin.php
//
include ("funcoes.php");
//
//conexao com o banco de administracao
//cria as variaveis $dbh e $dbhw alem de conexaoadmin
//
include ($locaplic."/admin1/php/conexao.php");
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
		$dados = \admin\catalogo\mapfile\conexao\local\alterar ($locaplic,$codigo,$_POST["connection"],$_POST["connectiontype"],$_POST["data"],$_POST["tileindex"],$_POST["tileitem"],$_POST["type"],$_POST["projection"],$_POST["convcaracter"],$_POST["metaestat"],$_POST["metaestat_id_medida_variavel"],$dbhw);
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao definir as propriedades" );
		}
		break;
	case "LISTA" :
		$dados = \admin\catalogo\mapfile\conexao\local\listar ($locaplic,$codigo);
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

 conexao com wms

 $dados["wms_srs"] = $layer->getmetadata("wms_srs");
 $dados["wms_name"] = $layer->getmetadata("wms_name");
 $dados["wms_server_version"] = $layer->getmetadata("wms_server_version");
 $dados["wms_format"] = $layer->getmetadata("wms_format");
 $dados["wms_auth_username"] = $layer->getmetadata("wms_auth_username");
 $dados["wms_auth_password"] = $layer->getmetadata("wms_auth_password");
 $dados["wms_auth_type"] = $layer->getmetadata("wms_auth_type");
 $dados["wms_connectiontimeout"] = $layer->getmetadata("wms_connectiontimeout");
 $dados["wms_latlonboundingbox"] = $layer->getmetadata("wms_latlonboundingbox");
 $dados["wms_proxy_auth_type"] = $layer->getmetadata("wms_proxy_auth_type");

 $dados["wms_proxy_host"] = $layer->getmetadata("wms_proxy_host");
 $dados["wms_proxy_port"] = $layer->getmetadata("wms_proxy_port");
 $dados["wms_proxy_type"] = $layer->getmetadata("wms_proxy_type");
 $dados["wms_proxy_username"] = $layer->getmetadata("wms_proxy_username");
 $dados["wms_proxy_password"] = $layer->getmetadata("wms_proxy_password");
 $dados["wms_sld_body"] = $layer->getmetadata("wms_sld_body");
 $dados["wms_sld_url"] = $layer->getmetadata("wms_sld_url");
 $dados["wms_style"] = $layer->getmetadata("wms_style");
 $dados["wms_bgcolor"] = $layer->getmetadata("wms_bgcolor");
 $dados["wms_transparent"] = $layer->getmetadata("wms_transparent");
 $dados["wms_time"] = $layer->getmetadata("wms_time");
 $dados["wms_tile"] = $layer->getmetadata("wms_tile");

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
