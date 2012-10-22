<?php
/*
Title: analise.php

Fun&ccedil;&otilde;es utilizadas pelos programas javascript especificos de analise e manipulacao de dados para o sistema de metadados estatisticos
e que nao exigem login

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2012 Edmar Moretti
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.gov.br

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

Arquivo:

i3geo/ferramentas/metaestat/analise.php

Parametros:

O par&acirc;metro principal &eacute; "funcao", que define qual opera&ccedil;&atilde;o ser&aacute; executada.

Cada opera&ccedil;&atilde;o possu&iacute; seus próprios par&acirc;metros, que devem ser enviados tamb&eacute;m na requisi&ccedil;&atilde;o da opera&ccedil;&atilde;o.
*/
include_once(__DIR__."/../../admin/php/admin.php");
include(__DIR__."/../../admin/php/classe_metaestat.php");
session_name("i3GeoPHP");
session_id($g_sid);
session_start();
foreach(array_keys($_SESSION) as $k)
{
	if(!is_array($_SESSION[$k]))
		eval("\$".$k."='".$_SESSION[$k]."';");
}
if(isset($fingerprint)){
	$f = explode(",",$fingerprint);
	if($f[0] != md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id())){
		cpjson(". Tentativa de acesso nao permitida. Inicie um novo mapa.");
		return;
	}
}
$retorno = "";
switch (strtoupper($funcao)){
	case "APLICAFILTROREGIAO":
	break;
}
if (!connection_aborted()){
	cpjson($retorno);
}
else
{exit();}

?>