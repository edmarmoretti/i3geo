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
if (\admin\php\funcoesAdmin\verificaOperacaoSessao ( "admin/html/atlas" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}

$id_atlas = $_POST["id_atlas"];
$id_prancha = $_POST["id_prancha"];
$id_tema = $_POST["id_tema"];

\admin\php\funcoesAdmin\testaSafeNumerico([$id,$id_atlas,$id_prancha]);

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = \admin\catalogo\atlas\pranchas\temas\adicionar( $id_prancha, $_POST["ordem_tema"], $_POST["ligado_tema"], $_POST["codigo_tema"], $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "ALTERAR" :
		$novo = \admin\catalogo\atlas\pranchas\temas\alterar ( $id_tema, $_POST["ordem_tema"], $_POST["ligado_tema"], $_POST["codigo_tema"], $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "LISTAUNICO" :
		$dados =  \admin\catalogo\atlas\pranchas\temas\listar($dbh, $id_prancha, $id_tema);
		$dbhw = null;
		$dbh = null;
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados tabela de temas de uma prancha" );
		} else {
			include("../../../../../admin/php/classe_arvore.php");
			$arvore = new Arvore($locaplic);
			$temas = $arvore->pegaTodosTemas(true);
			\admin\php\funcoesAdmin\retornaJSON ( array("dados"=>$dados, "temas"=>$temas) );
		}
		break;
	case "LISTA" :

		$dados =  \admin\catalogo\atlas\pranchas\temas\listar($dbh, $id_prancha, $id_tema);
		$dbhw = null;
		$dbh = null;
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados tabela de temas de uma prancha" );
		} else {
			//pega a lista de temas
			include("../../../../../admin/php/classe_arvore.php");
			$arvore = new Arvore($locaplic);
			$temas = $arvore->pegaTodosTemas(true);
			\admin\php\funcoesAdmin\retornaJSON ( array("dados"=>$dados, "temas"=>$temas) );
		}
		break;
	case "EXCLUIR" :
		$retorna = \admin\catalogo\atlas\pranchas\temas\excluir ( $id_tema, $dbhw );
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