<?php
/****************************************************************/
//
// checa login
// valida _GET e _POST, juntando em _GET
// pega algumas variaveis de uso mais comum
// session_start
//
include ("checaLogin.php");
\admin\php\login\checaLogin ();
// funcoes de administracao
include ("funcoesAdmin.php");
//
// carrega outras funcoes e extensoes do PHP
//
include ($_SESSION ["locaplic"] . "/classesphp/carrega_ext.php");
include ($_SESSION ["locaplic"] . "/classesphp/classe_bdexplorer.php");
include ($_SESSION ["locaplic"] . "/classesphp/classe_metaestatinfo.php");
/**
 * ************************************************************
 */
if (\admin\php\funcoesAdmin\verificaOperacaoSessao ( "admin/metaestat/geral" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}
$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "LISTARESQUEMAS" :
		$bd = new \i3geo\classesphp\bdexplorer\Bdexplorer ( $_SESSION ["locaplic"] );
		$dados = $bd->listaDeEsquemas ();
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			\admin\php\funcoesAdmin\retornaJSON ( $dados );
		}
		break;
	case "LISTARESQUEMASUPLOAD" :
		$bd = new \i3geo\classesphp\bdexplorer\Bdexplorer ( $_SESSION ["locaplic"] );
		$dados = $bd->listaDeEsquemasUpload ();
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			\admin\php\funcoesAdmin\retornaJSON ( $dados );
		}
		break;
	case "LISTARTABELAS" :
		// pega os parametros de conexao
		if (empty ( $_POST ["codigo_estat_conexao"] )) {
			$parametros = $dbh;
		} else {
			$mt = new MetaestatInfo ();
			//$parametros = $mt->listaConexao ( ( int ) $_POST ["codigo_estat_conexao"], true, false );
			$parametros = $mt->listaConexaoMetaestat();
		}
		$bd = new \i3geo\classesphp\bdexplorer\Bdexplorer ( $_SESSION ["locaplic"], $parametros );
		$dados = $bd->listaDeTabelas ( $_POST ["esquema"] );
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			\admin\php\funcoesAdmin\retornaJSON ( $dados );
		}
		break;
	case "LISTARTABELASUPLOAD" :
		// pega os parametros de conexao da variavel com os parametros para upload de shapefile
		$c = $_SESSION ["i3geoUploadDataWL"]["postgis"]["conexao"];
		//var_dump ($c);exit;
		$dbh = new PDO('pgsql:dbname='.$c["dbname"].';user='.$c["user"].';password='.$c["password"].';host='.$c["host"].';port='.$c["port"]);
		$bd = new \i3geo\classesphp\bdexplorer\Bdexplorer ( $_SESSION ["locaplic"], $dbh );
		$dados = $bd->listaDeTabelasUpload ( $_POST ["esquema"] );
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			\admin\php\funcoesAdmin\retornaJSON ( $dados );
		}
		break;
	case "LISTARCOLUNAS" :
		// pega os parametros de conexao
		$mt = new MetaestatInfo ();
		//$parametros = $mt->listaConexao ( ( int ) $_POST ["codigo_estat_conexao"], true, false );
		$parametros = $mt->listaConexaoMetaestat();
		$bd = new \i3geo\classesphp\bdexplorer\Bdexplorer ( $_SESSION ["locaplic"], $parametros );
		$dados = $bd->listaDeColunas ( $_POST ["esquema"], $_POST ["tabela"] );
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			\admin\php\funcoesAdmin\retornaJSON ( $dados );
		}
		break;
	case "LISTARCODIGOSCONEXAO" :
		// pega os parametros de conexao
	    \admin\php\funcoesAdmin\retornaJSON ( array() );
	    /*
		$mt = new MetaestatInfo ();
		$dados = $mt->listaConexaoMetaestat();
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			$kv = array ();
			foreach ( $dados as $d ) {
				$kv [] = array (
						"chave" => $d ["bancodedados"],
						"valor" => $d ["codigo_estat_conexao"]
				);
			}
			\admin\php\funcoesAdmin\retornaJSON ( $kv );
		}
		*/
		break;
	default :
		if (! empty ( $funcao ))
			header ( "HTTP/1.1 500 erro funcao nao existe" );
		break;
}
?>