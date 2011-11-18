/*
Title: ogcws.js

Funções que controlam os parâmetros do ogcws.map utilizado no gerador de WMS/WFS

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

i3geo/admin/js/ogcws.js
*/
YAHOO.namespace("example.container");
/*
Function: initMenu

Inicializa o editor

<PEGAPARAMETROSCONFIGURA>
*/
function initMenu()
{
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	new YAHOO.widget.Button("botao2",{ onclick: { fn: function(){window.open('../../testainstal.php') }} });
	$parametros = {
	"simples": [
		{
			mensagem: "ows_abstract",
			cabeca: "Resumo",
			variavel: "ows_abstract"
		},
		{
			mensagem: "ows_keywordlist",
			cabeca: "Palavras chave",
			variavel: "ows_keywordlist"
		},
		{
			mensagem: "ows_fees",
			cabeca: "Taxas",
			variavel: "ows_fees"
		},
		{
			mensagem: "ows_accessconstraints",
			cabeca: "Restrições",
			variavel: "ows_accessconstraints"
		},
		{
			mensagem: "ows_contactperson",
			cabeca: "Pessoa de contato",
			variavel: "ows_contactperson"
		},
		{
			mensagem: "ows_contactorganization",
			cabeca: "Organização",
			variavel: "ows_contactorganization"
		},
		{
			mensagem: "ows_contactposition",
			cabeca: "Cargo",
			variavel: "ows_contactposition"
		},
		{
			mensagem: "ows_addresstype",
			cabeca: "Tipo de endereço",
			variavel: "ows_addresstype"
		},
		{
			mensagem: "ows_address",
			cabeca: "Endereço",
			variavel: "ows_address"
		},
		{
			mensagem: "ows_city",
			cabeca: "Cidade",
			variavel: "ows_city"
		},
		{
			mensagem: "ows_stateorprovince",
			cabeca: "Estado",
			variavel: "ows_stateorprovince"
		},
		{
			mensagem: "ows_postcode",
			cabeca: "CEP",
			variavel: "ows_postcode"
		},
		{
			mensagem: "ows_country",
			cabeca: "País",
			variavel: "ows_country"
		},
		{
			mensagem: "ows_contactelectronicmailaddress",
			cabeca: "E-mail",
			variavel: "ows_contactelectronicmailaddress"
		},
		{
			mensagem: "ows_name",
			cabeca: "Nome do serviço",
			variavel: "ows_name"
		}
	]};
	core_carregando("ativa");
	core_pegaDados("buscando parâmetros...","../php/ogcws.php?funcao=pegaParametrosConfigura","pegaParametros");
}
function pegaParametros(retorno)
{
	$i("mapfile").innerHTML = retorno.mapfile;
	var ins = ""
	for (i=0;i<$parametros.simples.length;i++)
	{
		ins += "<fieldset><legend><b>"+$parametros.simples[i].cabeca+"</b></legend>"
		ins += "<p class=mensagem >"+$parametros.simples[i].mensagem+"</p>"
		ins += "<table><tr><td><img style=cursor:pointer src=../imagens/02.png title='aplicar' onclick='salva(\""+$parametros.simples[i].variavel+"\")' /></td>"
		ins += "<td><input onchange=\"this.style.color='blue'\" type=text size=70 id='"+$parametros.simples[i].variavel+"' /></td></tr></table>"
		ins += "</fieldset><br>"	
	}
	$i("tabela").innerHTML += ins
	retorno.$postgis_mapa = "Esta variável só pode ser definida editando-se diretamente o arquivo ms_configura.php"
	for (i=0;i<$parametros.simples.length;i++)
	{
		if($i($parametros.simples[i].variavel))
		{$i($parametros.simples[i].variavel).value = retorno[$parametros.simples[i].variavel];}
	}
	core_carregando("desativa");
}
/*
Function: salva

Aplica as alterações feitas em uma variável

<SALVACONFIGURA>
*/
function salva(variavel)
{
	if(variavel == "$postgis_mapa")
	{alert("erro")}
	else
	{
		var original = $i(variavel).value;
		$i(variavel).value = "gravando...";
		core_pegaDados("gravando...","../php/ogcws.php?funcao=salvaConfigura&variavel="+variavel+"&valor="+original,"")
		$i(variavel).style.color = ""
		$i(variavel).value = original;
	}
}
YAHOO.util.Event.addListener(window, "load", initMenu);