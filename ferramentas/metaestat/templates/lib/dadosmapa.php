<?php
/*
 * Pega os dados sobre o mapa cadastrado no METAESTAT
 * Utilizado como include nos templates
 *
Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2012 Edmar Moretti
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
	GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

*/
function dadosmapa($loc=""){
	global $id;
	if($loc == ""){
		$loc = dirname(__FILE__)."/../../../..";
	}
	include ($loc."/classesphp/conexao.php");
	include($loc."/classesphp/classe_metaestatinfo.php");
	if(empty($id)){
		echo "id nao definido";
		exit;
	}
	$m = new MetaestatInfo();
	$dadosmapa = $m->listaMapas($id);
	if(count($dadosmapa) == 0){
		echo "Erro. Nenhum um mapa encontrado";
		exit;
	}
	if($dadosmapa["publicado"] == "NAO"){
		include($loc."/admin/php/login.php");
		if(verificaOperacaoSessao("admin/metaestat/geral") == false){
			echo "O mapa nao esta marcado como publicado e vc nao fez login ou nao tem permissao";
			exit;
		}
	}
	return $dadosmapa;
}
?>