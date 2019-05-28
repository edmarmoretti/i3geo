/*
Title: Ferramenta que permite mostrar os limites de um tipo de regi&atilde;o baseada no cadastro
do m&oacute;dulo METAESTAT

Nao esta em uso

A regiao e mostrada como uma nova camada no mapa

Arquivo:

i3geo/ferramentas/metaestat/mostraregiao.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Esse programa utiliza parcialmente os codigos da aplicacao calculadora de carbono desenvolvido pelo
IPAM - Instituto de Pesquisa Ambiental da Amazonia

Este programa e software livre; voce pode redistribui-lo
e/ou modifica-lo sob os termos da Licenca Publica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa e distribuido na expectativa de que seja util,
porem, SEM NENHUMA GARANTIA; nem mesmo a garantia implicita
de COMERCIABILIDADE OU ADEQUACAO A UMA FINALIDADE ESPECIFICA.
Consulte a Licenca Publica Geral do GNU para mais detalhes.
Voce deve ter recebido uma copia da Licenca Publica Geral do
GNU junto com este programa; se nao, escreva para a
Free Software Foundation, Inc., no endereco
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.mostraregiao

Permite que o usu&aacute;rio escolha um tipo de regi&atilde;o para incluir no mapa
 */
i3GEOF.mostraregiao = {
	aguarde: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.mostraregiao.dicionario);
		return dicionario;
	},
	/**
	 * Inicia a ferramenta ativando as opcoes
	 * Executa i3GEOF.mostraregiao.comboRegioes
	 */
	inicia: function(divid){
		if(i3GEOF.mostraregiao.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/mostraregiao/template_mst.html", function(template) {
				i3GEOF.mostraregiao.MUSTACHE = template;
				i3GEOF.mostraregiao.inicia(divid);
			});
			return;
		}
		$i(divid).innerHTML = i3GEOF.mostraregiao.html();
		i3GEO.util.aplicaAquarela("i3GEOF.mostraregiao_corpo");
		i3GEOF.mostraregiao.comboRegioes($i("i3geomostraregiaoTipoRegiao"));
	},
	/**
	 * Abre a janela flutuante com o conteudo da ferramenta
	 * Executa i3GEOF.mostraregiao.inicia
	 */
	iniciaJanelaFlutuante: function(){
		if($i("i3GEOF.mostraregiao_corpo")){
			return;
		}
		var minimiza,cabecalho,janela,divid,titulo;
		cabecalho = function(){
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.mostraregiao",200);
		};
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >"+$trad("limites",i3GEOF.mostraregiao.dicionario)+"</span></div>";
		janela = i3GEO.janela.cria(
			"300px",
			"",
			"",
			"",
			"",
			titulo,
			"i3GEOF.mostraregiao",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true,
			"",
			"",
			"",
			""
		);
		divid = janela[2].id;
		i3GEOF.mostraregiao.aguarde = $i("i3GEOF.mostraregiao_imagemCabecalho").style;
		i3GEOF.mostraregiao.inicia(divid);
	},
	/**
	 * HTML com o conteudo da ferramenta
	 *
	 * @return HTML
	 */
	html: function(){
		var ins = Mustache.render(i3GEOF.mostraregiao.MUSTACHE, i3GEOF.mostraregiao.mustacheHash());
		return ins;
	},
	/**
	 * Monta o combo com as regioes cadastradas
	 * Executa i3GEO.php.listaTipoRegiao
	 */
	comboRegioes: function(objonde){
		var temp = function(regioes){
			var ins = '',
			i,n;
			n = regioes.length;
			ins += "<select class='form-control' id='i3geomostraregiaoComboTipoRegiao' ><option value=''>---</option>";
			for(i=0;i<n;i++){
				ins += "<option value='"+regioes[i].codigo_tipo_regiao+"'>"+regioes[i].nome_tipo_regiao+"</option>";
			}
			ins += "</select>";
			if(objonde){
				objonde.innerHTML = ins;
			}
			return ins;
		};
		i3GEO.catalogoRegioes.getRegions(temp);
	},
	/**
	 * Obtem os parametros necessarios e adiciona ao mapa uma nova camada com a regiao
	 * Executa ferramentas/metaestat/analise.php?funcao=adicionaLimiteRegiao
	 */
	aplica: function(){
		if(i3GEOF.mostraregiao.aguarde.visibility === "visible")
		{return;}


		var combo = $i("i3geomostraregiaoComboTipoRegiao"),
			nomes = $i("i3geomostraregiaoNomes");
		if (combo.value === ""){
			return;
		}
		i3GEOF.mostraregiao.aguarde.visibility = "visible";
		var temp = function(retorno){
			i3GEOF.mostraregiao.aguarde.visibility = "hidden";
			i3GEO.mapa.refresh();

		};
		if(nomes.checked == true){
			nomes = "sim";
		}
		else{
			nomes = "nao";
		}
		p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?funcao=adicionaLimiteRegiao"+
			"&codigo_tipo_regiao="+combo.value+
			"&g_sid="+i3GEO.configura.sid+
			"&outlinecolor="+$i("i3geomostraregiaoOutlinecolor").value+
			"&width="+$i("i3geomostraregiaoWidth").value+
			"&nomes="+nomes;
		i3GEO.util.ajaxGet(p,temp);
	}
};