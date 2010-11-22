/*
Title: importar.js

Funções que controlam as opções de importação de arquivos XML antigos para o banco de dados

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

i3geo/admin/js/importar.js
*/

YAHOO.namespace("example.container");
function fim ()
{
	core_carregando("desativa")
}
function importarXmlMenu()
{
	core_carregando("ativa")
	core_pegaDados("importando...","../php/menutemas.php?funcao=importarXmlMenu&nomemenu="+$i("nome").value+"&xml="+$i("arquivo").value,"fim()")
}
function importarXmlMapas()
{
	core_carregando("ativa")
	core_pegaDados("importando...","../php/mapas.php?funcao=importarXmlMapas&xml="+$i("arquivo").value,"fim()")
}
function importarXmlAtlas()
{
	core_carregando("ativa")
	core_pegaDados("importando...","../php/atlas.php?funcao=importarXmlAtlas&xml="+$i("arquivo").value,"fim()")
}
function importarXmlWS()
{
	core_carregando("ativa")
	core_pegaDados("importando...","../php/webservices.php?funcao=importarXmlWS&xml="+$i("arquivo").value+"&tipo="+$i("tipo").value,"fim()")
}
function importarXmlI()
{
	core_carregando("ativa")
	core_pegaDados("importando...","../php/identifica.php?funcao=importarXmlI&xml="+$i("arquivo").value,"fim()")
}
function importarXmlSistemas()
{
	core_carregando("ativa")
	core_pegaDados("importando...","../php/sistemas.php?funcao=importarXmlSistemas&xml="+$i("arquivo").value,"fim()")
}
