<?php
/*
Title: rsscomentariostemas

Monta um arquivo XML no padrão RSS contendo os comentários postados para os temas cadastrados.

<http://localhost/i3geo/admin/rsscomentariostemas.php>

Parametros:

id_tema {numeric} - (opcional) id do tema para mostrar apenas os comentários de um tema

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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

Arquivo:

i3geo/admin/rsscomentariostemas.php
*/

error_reporting(0);
if(!isset($locaplic)){
	include(__DIR__."/../ms_configura.php");
}
include_once($locaplic."/classesphp/pega_variaveis.php");
include_once($locaplic."/admin/php/xml.php");
$parametros = array_merge($_POST,$_GET);
if(empty($parametros["id_tema"]))
{$parametros["id_tema"] = "";}
echo header("Content-type: application/xml");
echo geraRSScomentariosTemas($locaplic,$parametros["id_tema"]);
?>
