<?php
/*
Title: xmlservicoswms

Monta um arquivo XML, no padr&atilde;o RSS, contendo a lista de links para servi&ccedil;os WMS.


<geraXmlWMS>

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
error_reporting(0);
if(!isset($locaplic)){
    include(dirname(__FILE__)."/../ms_configura.php");
}
include_once($locaplic."/classesphp/xml.php");
if(empty ($_GET["output"])){
    $_GET["output"] = "xml";
}
if($_GET["output"] == "xml" || $_GET["output"] == "json"){
    echo header("Content-type: application/".$_GET["output"]);
    echo geraXmlWMS($locaplic,$_GET["output"]);
}
?>