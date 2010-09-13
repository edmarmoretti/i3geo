<?php
/*
Title: abrefontemapfile

Abre no navegador a página com os metadados sobre um tema.

O link para os metadados é obtido do banco de administração.

Para usar esse programa digite <http://localhost/i3geo/admin/abrefontemapfile.php?tema=codigo>

Parametro:

tema {string} - codigo do tema (nome do mapfile existente em i3geo/temas)

Licenca:

GPL2


i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/abrefontemapfile.php
*/
error_reporting(0);
if(!isset($locaplic))
{
	$locaplic = "";
	if(file_exists("../../../ms_configura.php"))
	{include_once("../../../ms_configura.php");}
	else
	{
		if(file_exists("../../ms_configura.php"))
		{include_once("../../ms_configura.php");}
		else
		{
			if(file_exists("../ms_configura.php"))
			{include_once("../ms_configura.php");}
			else
			include_once("ms_configura.php");
		}	
	}
}
include_once($locaplic."/classesphp/pega_variaveis.php");
include_once($locaplic."/admin/php/admin.php");
if(!isset($tema))
{echo "Nenhum tema definido.";exit;}
$editor = verificaEditores($editores);
$dbh = "";
include($locaplic."/admin/php/conexao.php");
$r = pegaDados("select * from i3geoadmin_temas where codigo_tema = '$tema'");
$link = $r[0]["link_tema"];
if($link == "")
{echo "Link não encontrado";}
else
{echo "<meta http-equiv='refresh' content='0;url=$link'>";}
?>