<?php
/*
 * Licenca:
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Edmar Moretti
 * Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
 * e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
 * GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
 * por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
 * de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
 * Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
 * Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a
 * Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
error_reporting ( 0 );
//
// pega as variaveis passadas com get ou post
//

include_once (dirname ( __FILE__ ) . "/../../../../admin/php/login.php");
if (verificaOperacaoSessao ( "admin/html/arvore" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}

include (dirname ( __FILE__ ) . "/../../../../admin/php/conexao.php");

$codigo = str_replace(" ","",$_POST["codigo"]);
$id_grupo = $_POST["id_grupo"];
$id_tema = $_POST["id_tema"];

testaSafeNumerico([$id_grupo,$id_tema]);

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$sql = "select * from ".$esquemaadmin."i3geousr_grupotema where id_tema = $id_tema and id_grupo = $id_grupo";
		$q = pegaDados($sql, $dbh, false);
		if($q){
			if(count($q) != 0){
				header ( "HTTP/1.1 500 erro valor ja cadastrado" );
				exit ();
			}
		}
		if(empty($id_grupo) || empty($id_tema)){
			header ( "HTTP/1.1 500 erro parametro invalido" );
			exit ();
		}
		if(!file_exists($locaplic."/temas/".$codigo.".map")){
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro mapfile nao existe" );
			exit ();
		}
		$novo = adicionar( $id_grupo, $id_tema, $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( array("ok") );
		break;
	case "LISTA" :
		if(empty($codigo) || empty($id_tema)){
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro codigo invalido" );
			exit ();
		}
		if(file_exists($locaplic."/temas/".$codigo.".map")){
			$sql = "
				select ".$esquemaadmin."i3geoadmin_temas.codigo_tema, ".$esquemaadmin."i3geousr_grupos.id_grupo,
				".$esquemaadmin."i3geousr_grupos.nome, ".$esquemaadmin."i3geousr_grupos.descricao,
				".$esquemaadmin."i3geousr_grupotema.id_tema
				from
				".$esquemaadmin."i3geoadmin_temas
				join ".$esquemaadmin."i3geousr_grupotema
				on ".$esquemaadmin."i3geousr_grupotema.id_grupo = ".$esquemaadmin."i3geousr_grupos.id_grupo
				join ".$esquemaadmin."i3geousr_grupos
				on ".$esquemaadmin."i3geoadmin_temas.id_tema = ".$esquemaadmin."i3geousr_grupotema.id_tema
				where codigo_tema = '".$codigo."' order by lower(nome)
			";
			$dados = pegaDados ( $sql, $dbh, false );
		}
		else {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro mapfile nao existe" );
			exit ();
		}
		if ($dados === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$grupos = pegaDados("select * from ".$esquemaadmin."i3geousr_grupos order by lower(nome)", $dbh, false);
		$dbhw = null;
		$dbh = null;
		retornaJSON ( array("dados" => $dados, "grupos" => $grupos) );
		break;
	case "EXCLUIR" :
		$retorna = excluir ( $id_tema, $id_grupo, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( "ok" );
		break;
}
// $papeis deve ser um array
function adicionar($id_grupo, $id_tema, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
			"id_tema" => $id_tema,
			"id_grupo" => $id_grupo
		);
		$retorna = i3GeoAdminInsert($dbhw,"i3geousr_grupotema",$dataCol);
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function excluir($id_tema, $id_grupo, $dbhw) {
	global $esquemaadmin;
	try {
		$sql = "DELETE from ".$esquemaadmin."i3geousr_grupotema where id_tema = ? and id_grupo = ? ";
		$prep = $dbhw->prepare($sql);
		$prep->execute(array($id_tema,$id_grupo));
		i3GeoAdminInsertLog($dbhw,$sql,array($id_tema,$id_grupo));
		return true;
	} catch ( PDOException $e ) {
		return false;
	}
}
?>
