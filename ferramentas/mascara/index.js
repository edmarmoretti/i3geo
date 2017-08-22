/*
Title: Mascara

Ativa para layers selecionados a opção MASL do Mapserver

Veja:

<i3GEO.mapa.dialogo.mascara>

Arquivo:

i3geo/ferramentas/mascara/index.js.php

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
Classe: i3GEOF.mascara
*/
i3GEOF.mascara = {
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.mascara.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.mascara.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/mascara/template_mst.html", function(template) {
				i3GEOF.mascara.MUSTACHE = template;
				i3GEOF.mascara.inicia(iddiv);
			});
			return;
		}
		$i(iddiv).innerHTML = i3GEOF.mascara.html();
		i3GEOF.mascara.selMascara();
		i3GEOF.mascara.listaDeCamadas();
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.mascara.MUSTACHE, i3GEOF.mascara.mustacheHash());
		return ins;
	},
	listaDeCamadas: function(marcar){
		var camadas = i3GEO.arvoreDeCamadas.CAMADAS,
			n = camadas.length, c,
			ins = "";
		if(!marcar){
			marcar = [];
		}
		while(n > 0){
			n -= 1;
			if(camadas[n].tema !== ""){
				c = "";
				if(marcar.indexOf(camadas[n].tema) >= 0){
					c = "checked";
				}
				ins += '<div class="checkbox text-left"><label>'
					+ '<input name="' + camadas[n].name + '" type="checkbox" ' + c + ' >'
					+ '<span class="checkbox-material noprint"><span class="check"></span></span>&nbsp;'
					+ camadas[n].tema
					+ '</label></div>';
			}
		}
		ins += "</table>";
		$i("i3GEOFmascaraLista").innerHTML = ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,temp,titulo,cabecalho,minimiza;
		if($i("i3GEOF.mascara")){
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.mascara",200);
		};
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("mascara") + "</span></div>";
		janela = i3GEO.janela.cria(
			"310px",
			"220px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.mascara",
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
			"129"
		);
		divid = janela[2].id;
		$i("i3GEOF.mascara_corpo").style.backgroundColor = "white";
		$i("i3GEOF.mascara_corpo").style.textAlign = "left";
		i3GEOF.mascara.aguarde = $i("i3GEOF.mascara_imagemCabecalho").style;
		i3GEOF.mascara.inicia(divid);
		temp = function(){
			i3GEOF.mascara.termina();
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	selMascara: function(){
		i3GEO.util.comboTemas(
			"i3GEOFmascaraSelTema",
			function(retorno){
				$i("i3GEOmascaraTema").innerHTML = retorno.dados;
				$i("i3GEOFmascaraSelTema").onchange = function(){
					i3GEOF.mascara.mascaraAtual($i("i3GEOFmascaraSelTema").value);
				};
			},
			"i3GEOmascaraTema",
			"",
			false,
			"",
			" ",
			false,
			true,
			"form-control comboTema"
		);
	},
	listaTemas: function(){
		var temp = [],
			cs = $i("i3GEOFmascaraLista").getElementsByTagName("input"),
			n = cs.length;
		while(n > 0){
			n -= 1;
			if(cs[n].checked === true){
				temp.push(cs[n].name);
			}
		}
		return temp;
	},
	aplicar : function(){
		var tema = $i("i3GEOFmascaraSelTema").value,
			mascarar = i3GEOF.mascara.listaTemas(), p, fim, cp;
		if(i3GEOF.mascara.aguarde.visibility === "visible"){
			return;
		}
		if(tema === ""){
			i3GEO.janela.tempoMsg($trad("tema",i3GEOF.mascara.dicionario));
			return;
		}
		i3GEOF.mascara.aguarde.visibility = "visible";
		p = i3GEO.configura.locaplic+"/ferramentas/mascara/exec.php?g_sid="+i3GEO.configura.sid
			+ "&funcao=aplicar"
			+ "&tema=" + tema
			+ "&mascarar=" + mascarar.join(",");
		cp = new cpaint();
		fim = function(retorno){
			i3GEO.Interface.atualizaMapa();
			i3GEOF.mascara.aguarde.visibility = "hidden";
		};
		cp.set_response_type("JSON");
		cp.call(p,"foo",fim);
	},
	mascaraAtual: function(tema){
		if(tema === ""){
			return;
		}
		//pega as camadas com mascara
		var p = i3GEO.configura.locaplic+"/ferramentas/mascara/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=listaTemas&tema="+tema,
			cp = new cpaint(),
			fim;
		fim = function(retorno){
			//refaz a lista de camadas
			i3GEOF.mascara.listaDeCamadas(retorno.data);
		};
		cp.set_response_type("JSON");
		cp.call(p,"foo",fim);
	}
};
