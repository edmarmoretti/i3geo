<?php
/*
Title: xmlidentifica

Monta um arquivo XML no padrão RSS contendo a lista de opções que serão acrescentadas à ferramenta de identificação de elementos no mapa.

<http://localhost/i3geo/admin/xmlidentifica.php>

<geraXmlIdentifica>

Parametro:

perfil {string} - lista de perfis que serão considerados ao obter a lista

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

i3geo/admin/xmlidentifica.php
*/

error_reporting(0);
if(!isset($locaplic) || !isset($editores))
{
	$locaplic = "";
	if(file_exists("../../../ms_configura.php"))
	{include("../../../ms_configura.php");}
	else
	{
		if(file_exists("../../ms_configura.php"))
		{include("../../ms_configura.php");}
		else
		{
			if(file_exists("../ms_configura.php"))
			{include("../ms_configura.php");}
			else
			include("ms_configura.php");
		}	
	}
}
include_once($locaplic."/classesphp/pega_variaveis.php");
include_once($locaplic."/admin/php/xml.php");
if(!isset($perfil)){$perfil = "";}
echo header("Content-type: application/xml");
echo geraXmlIdentifica($perfil,$locaplic,$editores);
?>
