<?php
/*
Title: metarextensao

Acessa o Web Service http://ws.geonames.org/weatherJSON do Geonames que busca estações da rede Metar, retornando o resultado no formato HTML.

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Parametros:

ret {string} - extensão geográfica do retângulo que será utilizado na busca (xmin ymin xmax ymax)

Return:

{json} - lista com o resultado
*/
//set_time_limit(600);
require_once("../../pacotes/cpaint/cpaint2.inc.php");
require_once("../../classesphp/pega_variaveis.php");
require_once("../../classesphp/carrega_ext.php");
error_reporting(0);
$e = explode(" ",$ret);
$url = "http://ws.geonames.org/weatherJSON?lang=pt&north=".$e[3]."&south=".$e[1]."&east=".$e[2]."&west=".$e[0]."&maxRows=10";
$s = file($url);
header("Content-type: text/ascii; charset=UTF-8");
header('Expires: Fri, 14 Mar 1980 20:53:00 GMT');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: no-cache');
echo "[".$s[0]."]";

?>