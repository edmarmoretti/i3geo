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

include_once (dirname ( __FILE__ ) . "/../../../admin/php/login.php");
$funcoesEdicao = array (
		"LISTA"
);
if (in_array ( strtoupper ( $funcao ), $funcoesEdicao )) {
	if (verificaOperacaoSessao ( "admin/html/editormapfile" ) === false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");

//$id_mapa = $_POST["id_mapa"];
//testaSafeNumerico([$id_mapa]);

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "LISTA" :
		$retorna = lista($dbh);
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ($retorna);
		exit();
		break;
}
cpjson ( $retorno );

function lista($dbh,$filtro=""){
	global $locaplic,$esquemaadmin;
	$arquivos = array();
	if (is_dir($locaplic."/temas")){
		if ($dh = opendir($locaplic."/temas")){
			$extensao = "";
			while (($file = readdir($dh)) !== false){
				if(!stristr($file, '.map') === FALSE){
					$file = str_replace(".map","",$file);
					$arquivos[] = array("nome"=>$file);
				}
			}
		}
		closedir($dh);
	}
	sort($arquivos);

	//
	//pega o nome de cada tema filtrando a listagem se for o caso
	//
	$regs = pegaDados("select * from ".$esquemaadmin."i3geoadmin_temas ", $dbh, false);
	//pega os grupos de usuarios que podem acessar o tema
	$grpids = array();
	$sql = "select nome,descricao,a.id_grupo,id_tema from ".$esquemaadmin."i3geousr_grupotema as a,".$esquemaadmin."i3geousr_grupos as b where a.id_grupo = b.id_grupo";
	$gs = pegaDados($sql, $dbh, false);
	//agrupa o array
	foreach($gps as $g){
		array_push($grpids[$g["id_tema"]],array("id_grupo"=>$g["id_grupo"],"nome"=>$g["nome"],"descricao"=>$g["descricao"]));
	}

	$nomes = array();
	$ids = array();
	foreach($regs as $reg){
		$nomes[$reg["codigo_tema"]] = $reg["nome_tema"];
		$ids[$reg["codigo_tema"]] = $reg["id_tema"];
	}
	$lista = array();

	foreach($arquivos as $arq){
		$arq = $arq["nome"];
		$nT = explode(".",$arq);
		$n = $nomes[$nT[0]];
		if(!$n){
			$n = "";
		}
		$id = $ids[$nT[0]];
		if(!$id){
			$id = "";
		}
		//pega os grupos de usuarios
		$grupousr = $grpids[$id];
		if(!$grupousr){
			$grupousr = "";
		}
		$imagem = "";
		if(file_exists($locaplic."/temas/miniaturas/".$arq.".map.mini.png")){
			$imagem = $arq.".map.mini.png";
		}

		if($_POST["checaNomes"] == "true"){
			if(file_exists($locaplic."/temas/".$arq.".map")){
				$handle = fopen($locaplic."/temas/".$arq.".map", "r");
				while (!feof($handle)){
					$linha = fgets($handle);
					if(stripos($linha,"'TEMA'") !== false || stripos($linha,'"TEMA"') !== false){
						$ntema = str_replace(array("'TEMA'",'"TEMA"',"'tema'",'"tema"'),"",$linha);
						$ntema = trim(str_replace(array("'",'"'),"",$ntema));
						if($n != $ntema && $n != utf8_encode($ntema) && $n != ""){
							$n .= "<span style=color:red;margin-left:5px >".utf8_encode($ntema)."</span>";
						}
						break;
					}
				}
				fclose($handle);
			}
		}
		if($_POST["checaNames"] == "true"){
			if(file_exists($locaplic."/temas/".$arq.".map")){
				$handle = fopen($locaplic."/temas/".$arq.".map", "r");
				//deve buscar dentro de LAYER pois pode haver simbolos antes
				$elayer = false;
				while (!feof($handle)){
					$linha = trim(fgets($handle));
					if(stripos($linha,"LAYER") === 0){
						$elayer = true;
					}
					if($elayer == true && stripos($linha,"NAME") === 0){
						$ntema = ltrim($linha,"NAMEname");
						$ntema = trim(str_replace(array("'",'"'),"",$ntema));
						if($arq != $ntema){
							$n .= "<img style='margin-left:3px;' src='../imagens/face-sad.png' title='Nome do LAYER diferente do nome do arquivo' />";
						}
						break;
					}
				}
				fclose($handle);
			}
		}
		if(isset($filtro) && $filtro != "" && $n != ""){
			$lista[] = array("grupousr"=>$grupousr,"id_tema"=>$id,"nome"=>$n,"codigo"=>$arq,"imagem"=>$imagem,"extensao"=>$extensao);
		}
		if(!isset($filtro) || $filtro == ""){
			$lista[] = array("grupousr"=>$grupousr,"id_tema"=>$id,"nome"=>$n,"codigo"=>$arq,"imagem"=>$imagem,"extensao"=>$extensao);
		}

	}
	return $lista;
}
?>
