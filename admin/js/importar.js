/*
Title: importar.js

Fun&ccedil;&otilde;es que controlam as op&ccedil;&otilde;es de importa&ccedil;&atilde;o de arquivos XML antigos para o banco de dados

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

Arquivo:

i3geo/admin/js/importar.js
*/

YAHOO.namespace("admin.container");
function fim ()
{
	core_carregando("desativa");
}
function importarXmlMenu()
{
	core_carregando("ativa");
	core_pegaDados($trad("importa",i3GEOadmin.core.dicionario),"../php/menutemas.php?funcao=importarXmlMenu&nomemenu="+$i("nome").value+"&xml="+$i("arquivo").value,"fim()");
}
function importarXmlMapas()
{
	core_carregando("ativa");
	core_pegaDados($trad("importa",i3GEOadmin.core.dicionario),"../php/mapas.php?funcao=importarXmlMapas&xml="+$i("arquivo").value,"fim()");
}
function importarXmlAtlas()
{
	core_carregando("ativa");
	core_pegaDados($trad("importa",i3GEOadmin.core.dicionario),"../php/atlas.php?funcao=importarXmlAtlas&xml="+$i("arquivo").value,"fim()");
}
function importarXmlWS()
{
	core_carregando("ativa");
	core_pegaDados($trad("importa",i3GEOadmin.core.dicionario),"../php/webservices.php?funcao=importarXmlWS&xml="+$i("arquivo").value+"&tipo="+$i("tipo").value,"fim()");
}
function importarXmlI()
{
	core_carregando("ativa");
	core_pegaDados($trad("importa",i3GEOadmin.core.dicionario),"../php/identifica.php?funcao=importarXmlI&xml="+$i("arquivo").value,"fim()");
}
function importarXmlSistemas()
{
	core_carregando("ativa");
	core_pegaDados($trad("importa",i3GEOadmin.core.dicionario),"../php/sistemas.php?funcao=importarXmlSistemas&xml="+$i("arquivo").value,"fim()");
}
