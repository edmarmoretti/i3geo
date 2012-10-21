<?php
/*
Programa incluido no inicio dos arquivos PHP de cada ferramenta.
Carrega as funcoes de uso geral e a obtencao dos parametros que sao enviados
via POST ou GET

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
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
include_once(__DIR__."/../classesphp/pega_variaveis.php");
session_name("i3GeoPHP");
session_id($g_sid);
session_start();
foreach(array_keys($_SESSION) as $k){
	if(!is_array($_SESSION[$k]))
	eval("\$".$k."='".$_SESSION[$k]."';");
}
$postgis_mapa = $_SESSION["postgis_mapa"];
include_once(__DIR__."/../classesphp/funcoes_gerais.php");
if(isset($fingerprint))	{
	$f = explode(",",$fingerprint);
	if($f[0] != md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id())){
		cpjson(". Tentativa de acesso nao permitida. Inicie um novo mapa.");
		return;
	}
}
include_once(__DIR__."/../ms_configura.php");
//
//substitui a string de conex&atilde;o
//
if(!substituiCon($map_file,$postgis_mapa)){
	cpjson("erro",$cp);
	return;
}
?>