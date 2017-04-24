<?php
/****************************************************************/
////include (dirname ( __FILE__ ) . "/../../../ms_configura.php");
//
//checa login
//valida _GET e _POST, juntando em _GET
//pega algumas variaveis de uso mais comum
//session_start
//
include ("checaLogin.php");
\admin\php\login\checaLogin();
//funcoes de administracao
include ($_SESSION["locaplic"]."/admin1/php/funcoesAdmin.php");
//
//carrega outras funcoes e extensoes do PHP
//
include ($_SESSION["locaplic"]."/classesphp/carrega_ext.php");
include ($_SESSION["locaplic"]."/classesphp/classe_bdexplorer.php");
/***************************************************************/
$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "LISTARESQUEMAS" :
		$bd = new \i3geo\classesphp\bdexplorer\Bdexplorer($_SESSION["locaplic"]);
		$dados = $bd->listaDeEsquemas();
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			\admin\php\funcoesAdmin\retornaJSON ( $dados );
		}
		break;
	default:
		if(!empty ($funcao)) header ( "HTTP/1.1 500 erro funcao nao existe" );
		break;
}
?>