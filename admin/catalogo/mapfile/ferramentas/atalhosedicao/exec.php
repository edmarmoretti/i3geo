<?php
/****************************************************************/
// include (dirname ( __FILE__ ) . "/../../../../ms_configura.php");
//
// checa login
// valida _GET e _POST, juntando em _GET
// pega algumas variaveis de uso mais comum
// session_start
//
include ("../../../../php/checaLogin.php");
\admin\php\login\checaLogin();
// funcoes de administracao
include ($_SESSION["locaplic"] . "/admin/php/funcoesAdmin.php");
//
// carrega outras funcoes e extensoes do PHP
//
include ($_SESSION["locaplic"] . "/classesphp/carrega_ext.php");

//
// conexao com o banco de administracao
// cria as variaveis $dbh e $dbhw alem de conexaoadmin
//
// include ($_SESSION["locaplic"]."/admin/php/conexao.php");
/**
 * ************************************************************
 */
// if (\admin\php\funcoesAdmin\verificaOperacaoSessao ( "admin/html/editormapfile" ) === false) {
// header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
// exit ();
// }
if (! empty($funcao)) {
    $codigo = $_GET["codigomap"];
    
    $codigo = str_replace(" ", "", \admin\php\funcoesAdmin\removeAcentos($codigo));
    
    $codigo = str_replace(".", "", $codigo);
    $codigo = strip_tags($codigo);
    $codigo = htmlspecialchars($codigo, ENT_QUOTES);
    
    $funcao = strtoupper($funcao);
}
session_write_close();
session_name("i3GeoPHP");
session_id($_GET["g_sid"]);
session_start();

switch (strtoupper($funcao))
{
	case "METADATA":
		/*
	    $mapa = ms_newMapObj($map_file);
		$l = $mapa->getlayerbyname($tema);
		if($l != ""){
			$l->setmetadata($_GET["meta"],$_GET["valor"]);
			$mapa->save($map_file);
		}
		$retorno = "ok";
		*/
	break;
	case "MUDATRANSP":
	    include_once ($_SESSION["locaplic"]."/classesphp/classe_temas.php");
	    $m = new Temas($_SESSION["map_file"], $codigo);
	    $m->mudaTransparencia($_GET["valor"]);
	    $m->salva();
	    \admin\php\funcoesAdmin\retornaJSON("ok");
	    break;
	case "REFAZERLAYER":
	    include ("../../editor/funcoes.php");
	    $dados = \admin\catalogo\mapfile\editor\refazerLayer(
	       $codigo, 
	       $codigo, 
	       $_SESSION["locaplic"], 
	       $_SESSION["dir_tmp"], 
	       $_SESSION["cachedir"], 
	       $_SESSION["map_file"], 
	       $_GET["classe"], 
	       $_GET["cache"], 
	       $_GET["identifica"]
	    );
	    if ($dados === false) {
	        header("HTTP/1.1 500 erro ao definir as propriedades");
	    }
	    \admin\php\funcoesAdmin\retornaJSON(array(
	        "dados" => $dados
	    ));
	    break;
}
?>