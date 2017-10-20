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
include ($_SESSION["locaplic"]."/admin/php/funcoesAdmin.php");
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
include ($_SESSION["locaplic"]."/admin/php/conexao.php");
/***************************************************************/
if (\admin\php\funcoesAdmin\verificaOperacaoSessao ( "admin/html/arvore" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}

$id_n1 = $_POST["id_n1"];
$id_menu = $_POST["id_menu"];
$id_tema = $_POST["id_tema"];
$id_raiz = $_POST["id_raiz"];

\admin\php\funcoesAdmin\testaSafeNumerico(array($id_n1,$id_menu,$id_tema,$id_raiz));

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ORDENA" :
		$ordem = explode(" ",$_POST["novaordem"]);
		$dados = \admin\catalogo\menus\grupos\subgrupos\raiz\ordenar($id_n1, $ordem, $dbhw);
		$dbhw = null;
		$dbh = null;
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao ordenar" );
		}
		\admin\php\funcoesAdmin\retornaJSON ( $dados );
		break;
	case "LISTAUNICO" :
		$dados = \admin\catalogo\menus\grupos\subgrupos\raiz\listar ($dbh,$id_raiz);
		$dbhw = null;
		$dbh = null;
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			\admin\php\funcoesAdmin\retornaJSON ( array("dados"=>$dados) );
		}
		break;
	case "ADICIONAR" :
		if (empty ( $id_tema ) || empty ( $id_menu ) || empty ( $id_n1 )) {
			header ( "HTTP/1.1 500 erro nos parametros" );
		} else {
			$novo = \admin\catalogo\menus\grupos\subgrupos\raiz\adicionar ( $id_menu, $id_n1, $id_tema, $_POST["ordem"], $_POST["perfil"], $dbhw );
			$dbhw = null;
			$dbh = null;
			if ($novo === false) {
				header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			}
		}
		break;
	case "ALTERAR" :
		if (empty ( $id_tema ) || empty ( $id_menu ) || empty ( $id_raiz )) {
			header ( "HTTP/1.1 500 erro nos parametros" );
		} else {
			$novo = \admin\catalogo\menus\grupos\subgrupos\raiz\alterar ( $id_raiz, $id_tema, $_POST["ordem"], $_POST["perfil"], $dbhw );
			$dbhw = null;
			$dbh = null;
			if ($novo === false) {
				header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			}
		}
		break;
	case "EXCLUIR" :
		$retorna = \admin\catalogo\menus\grupos\subgrupos\raiz\excluir ( $id_raiz, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	default:
		header ( "HTTP/1.1 500 erro funcao nao existe" );
	break;
}
?>
