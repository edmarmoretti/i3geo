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
		i3GEOF.mascara.aguarde.visibility = "visible";
		$i(iddiv).innerHTML = i3GEOF.mascara.html();
		i3GEOF.mascara.selMascara();
		i3GEOF.mascara.listaDeCamadas();
		var b = new YAHOO.widget.Button(
			"i3GEOmascarabotao1",
			{onclick:{fn: i3GEOF.mascara.aplicar}}
		);
		b.addClass("rodar");
		i3GEOF.mascara.aguarde.visibility = "hidden";
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
			ins = "<table style='width:95%' class='lista8'>";
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
				ins += "<tr><td><input class=inputsb style='cursor:pointer' " + c + " type=checkbox value='"+camadas[n].name+"' /></td><td><span style=background:white id='i3GEOanima"+camadas[n].name+"'>"+camadas[n].tema+"</span></td></tr>";
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
			i3GEO.janela.minimiza("i3GEOF.mascara");
		};
		//cria a janela flutuante
		titulo = "<span class='i3GEOiconeFerramenta i3GEOiconeMascara'></span><div class='i3GeoTituloJanela'>" + $trad("mascara")+"<a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=129' >&nbsp;&nbsp;&nbsp;</a></div>";
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
			true
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
			true
		);
	},
	listaTemas: function(){
		var temp = [],
			cs = $i("i3GEOFmascaraLista").getElementsByTagName("input"),
			n = cs.length;
		while(n > 0){
			n -= 1;
			if(cs[n].checked === true){
				temp.push(cs[n].value);
			}
		}
		return temp;
	},
	aplicar : function(){
		var tema = $i("i3GEOFmascaraSelTema").value,
			mascarar = i3GEOF.mascara.listaTemas(), p, fim, cp;
		if(tema === "" || i3GEOF.mascara.aguarde.visibility === "visible"){
			return;
		}
		i3GEOF.mascara.aguarde.visibility = "visible";
		p = i3GEO.configura.locaplic+"/ferramentas/mascara/exec.php?g_sid="+i3GEO.configura.sid
			+ "&funcao=aplicar"
			+ "&tema=" + tema
			+ "&mascarar=" + mascarar.join(",");
		cp = new cpaint()
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
