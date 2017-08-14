/*
Title: Adiciona um tema ao mapa com base em um arquivo KML existente na Web

O usu&aacute;rio pode escolher o arquivo de uma lista. A lista &eacute; obtida do sistema de administra&ccedil;&atilde;o do i3Geo

Veja:

<i3GEO.arvoreDeTemas.dialogo.carregaKml>

Arquivo:

i3geo/ferramentas/carregakml/index.js.php

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
*/
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}

/*
Classe: i3GEOF.carregakml
*/
i3GEOF.carregakml = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.carregakml.dicionario);
		dicionario["botao"] = $trad("p14");
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.carregakml.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/carregakml/template_mst.html", function(template) {
				i3GEOF.carregakml.MUSTACHE = template;
				i3GEOF.carregakml.inicia(iddiv);
			});
			return;
		}
		$i(iddiv).innerHTML = i3GEOF.carregakml.html();
		var b, monta = function(retorno){
			var raiz,nraiz,i,combo;
			raiz = retorno.data.canais;
			nraiz = raiz.length;
			combo = "<select class='form-control' onchange='javascript:$i(\"i3GEOcarregakmlurl\").value = this.value;'>";
			combo += "<option value=''>---</option>";
			for (i=0;i<nraiz; i++){
				combo += "<option value='"+raiz[i].link+"'>"+raiz[i].title+"</option>";
			}
			combo += "</select>";
			$i("i3GEOcarregakmlCombo").innerHTML = combo;
		};
		i3GEO.php.listaRSSwsARRAY(monta,"KML");
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.carregakml.MUSTACHE, i3GEOF.carregakml.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,titulo;
		if($i("i3GEOF.carregakml")){
			return;
		}
		//cria a janela flutuante
		cabecalho = function(){
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.carregakml",200);
		};
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >KML</span></div>";
		janela = i3GEO.janela.cria(
			"320px",
			"180px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.carregakml",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true,
			"",
			"",
			"",
			"",
			"105"
		);
		divid = janela[2].id;
		i3GEOF.carregakml.aguarde = $i("i3GEOF.carregakml_imagemCabecalho").style;
		$i("i3GEOF.carregakml_corpo").style.backgroundColor = "white";
		i3GEOF.carregakml.inicia(divid);
	},
	/*
	Function: adiciona

	Adiciona o KML ao mapa
	*/
	adiciona: function(){
		var url, temp, cp, p;
		if(i3GEOF.carregakml.aguarde.visibility === "visible"){
			return;
		}
		url = $i("i3GEOcarregakmlurl").value;
		if(url !== ""){
			temp = function(retorno){
				i3GEO.atualiza();
			};
			cp = new cpaint();
			cp.set_response_type("JSON");
			p = i3GEO.configura.locaplic+"/ferramentas/carregakml/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=crialayer&url="+url;
			cp.call(p,"foo",temp);
			i3GEOF.carregakml.aguarde.visibility = "hidden";
		}
	}
};