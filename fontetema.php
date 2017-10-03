<?php
/*

Busca o registro da fonte de um tema e abre o link.

Arquivo: i3geo/fontetema.php


Licen&ccedil;a:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.


Parametros:

tema - nome do tema do serviço. Se for definido, o web service conterá apenas o tema.

Exemplos:

fontetema.php?tema=bioma

*/
include(dirname(__FILE__)."/ms_configura.php");
include(dirname(__FILE__)."/classesphp/classe_arvore.php");

include_once (dirname(__FILE__)."/classesphp/sani_request.php");
$_GET = array_merge($_GET,$_POST);

$m = new Arvore($locaplic);
$retorno = $m->pegaTemaPorCodigo($_GET["tema"]);
$retorno = $retorno[0]["link_tema"];
if(!headers_sent())
{header("Location:".$retorno);}
else
{echo "<meta http-equiv='refresh' content='0;url=$retorno'>";}
?>