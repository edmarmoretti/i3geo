<?php
/*
Title: metarextensao

Acessa o Web Service http://ws.geonames.org/weatherJSON do Geonames que busca esta&ccedil;&otilde;es da rede Metar, retornando o resultado no formato HTML.

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
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Parametros:

ret {string} - extens&atilde;o geogr&aacute;fica do retângulo que ser&aacute; utilizado na busca (xmin ymin xmax ymax)

Return:

{json} - lista com o resultado
*/
//set_time_limit(600);
require_once(dirname(__FILE__)."/../../pacotes/cpaint/cpaint2.inc.php");
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
$_GET = array_merge($_GET,$_POST);
require_once(dirname(__FILE__)."/../../classesphp/carrega_ext.php");
//error_reporting(0);
$e = explode(" ",$_GET["ret"]);
$url = "http://ws.geonames.org/weatherJSON?username=i3geo&lang=pt&north=".$e[3]."&south=".$e[1]."&east=".$e[2]."&west=".$e[0]."&maxRows=10";
$s = file($url);
header("Content-type: text/ascii; charset=UTF-8");
header('Expires: Fri, 14 Mar 1980 20:53:00 GMT');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: no-cache');
echo "[".$s[0]."]";

?>