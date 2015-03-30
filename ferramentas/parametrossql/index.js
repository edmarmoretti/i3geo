/*
Title: Adiciona ao mapa uma camada e substitu&iacute; par&acirc;metros no item DATA do Mapfile

Veja:

<i3GEO.pluginI3geo>

Arquivo:

i3geo/ferramentas/parametrossql/index.js.php

About: Licen&ccedil;a

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
Class: i3GEOF.parametrossql
*/
//TODO incluir a substituicao de parametros tambem no FILTER
i3GEOF.parametrossql = {
	/*
	Variavel: aguarde

	Objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	Variavel: tema

	Codigo do layer adicionado ao mapa
	*/
	tema: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.parametrossql.dicionario);
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta

	camada - objeto contendo os dados do plugin
	*/
	inicia: function(iddiv,camada){
		$i(iddiv).innerHTML = i3GEOF.parametrossql.html();
		var b,
			f = i3GEOF.parametrossql.formulario(camada);
		i3GEOF.parametrossql.tema = camada.name;
		//i3GEOFparametrosSQLForm e definido no template mustache
		$i("i3GEOFparametrosSQLForm").innerHTML = f;
		i3GEOF.parametrossql.buscaSelect(camada);

		b = new YAHOO.widget.Button(
			"i3GEOFparametrosSqlAplicar",
			{onclick:{fn: function(){i3GEOF.parametrossql.aplicar(camada);}}}
		);
		b.addClass("rodar");

	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.parametrossql.MUSTACHE, i3GEOF.parametrossql.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(camada){
		//verifica se deve ser aberto o formulario
		if(camada.plugini3geo.ativo != undefined && camada.plugini3geo.ativo === "nao"){
			fim = function(){
				i3GEO.atualiza();
			};
			p = i3GEO.configura.locaplic+"/ferramentas/parametrossql/exec.php?g_sid="+i3GEO.configura.sid
				+ "&funcao=aplicar"
				+ "&tema=" + camada.name
				+ "&chaves=&valores=";
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"foo",fim);
		}
		else{
			if(camada.plugini3geo.parametros){
				var minimiza,cabecalho,janela,divid,temp,titulo;
				if($i("i3GEOF.parametrossql")){
					i3GEOF.parametrossql.inicia("i3GEOF.parametrossql_corpo",camada);
					return;
				}
				//funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
				cabecalho = function(){
				};
				minimiza = function(){
					i3GEO.janela.minimiza("i3GEOF.parametrossql");
				};
				//cria a janela flutuante
				titulo = "<a class=ajuda_usuario style='margin-left:40px;' target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=35' >&nbsp;&nbsp;&nbsp;</a>";
				janela = i3GEO.janela.cria(
					"290px",
					"330px",
					"",
					"",
					"",
					titulo,
					"i3GEOF.parametrossql",
					false,
					"hd",
					cabecalho,
					minimiza,
					"",
					true
				);
				divid = janela[2].id;
				i3GEOF.parametrossql.aguarde = $i("i3GEOF.parametrossql_imagemCabecalho").style;
				YAHOO.util.Event.addListener(janela[0].close, "click", i3GEOF.parametrossql.cancela);
				i3GEOF.parametrossql.inicia(divid,camada);
			}
		}
	},
	formulario: function(camada){
		//sobre os parametros ver em classe_plugini3geo
		var parametros = camada.plugini3geo.parametros,
			n = parametros.length,
			i,
			ins = "",
			p,
			j,
			nj,
			l;
		for(i=0; i<n; i++){
			p = parametros[i];
			if(p.tipo != "" && p.titulo){
				ins += "<p class='paragrafo'>"+p.titulo+":</p>";
				//prog pode ser um php que precisa ser obtido via ajax
				//nesse caso e inserido um div com um id para permitir o preenchimento posterior
				if(p.prog === ""){
					if(p.tipo === "input"){
						ins += "<div class='i3geoForm i3geoFormIconeEdita'>"
							+ "<input type='text' name='"+p.chave+"' value='"+p.valores+"' />"
							+ "</div><br>";
					}
					if(p.tipo === "select"){
						ins += "<div class='styled-select' >"
							+ "<select name='"+p.chave+"' ><option value=''>---</option>";
						l = p.valores.split(",");
						nj = l.length;
						for(j=0; j<nj; j++){
							ins += "<option value='"+ l[j] +"'>"+ l[j] +"</option>";
						}
						ins += "</select></div><br>";
					}
				}
				else{
					ins += "<div class='styled-select' id='i3GeoPlugin_"+p.chave+"' >Auarde...</div>";
				}
			}
		}
		return ins;
	},
	buscaSelect: function(camada){
		var parametros = camada.plugini3geo.parametros,
		n = parametros.length,
		i,
		ins = "",
		p,
		j,
		nj,
		l,
		temp;
		for(i=0; i<n; i++){
			p = parametros[i];
			if(p.prog != ""){
				onde = $i('i3GeoPlugin_'+p.chave);
				if (onde){
					i3GEOF.parametrossql.ajaxSelect(onde,p);
				}
			}
		}
	},
	ajaxSelect : function(onde,plugin){
		var p,cp,temp;
		temp = function(retorno){
			var i,n,ins;
			ins = "<select name='"+plugin.chave+"' ><option value=''>---</option>";
			n = retorno.data.length;
			for(i=0; i<n; i++){
				ins += "<option value='"+ retorno.data[i].v +"'>"+ retorno.data[i].n +"</option>";
			}
			ins += "</select>";
			onde.innerHTML = ins;
		};
		p = i3GEO.configura.locaplic+"/ferramentas/parametrossql/exec.php?g_sid="+i3GEO.configura.sid
		+ "&funcao=INCLUDEPROG&prog="+ plugin.prog;
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"foo",temp); 
	},
	aplicar: function(camada){
		var fim,cp,p,onde = $i("i3GEOFparametrosSQLForm"),
			campos,n,i,chaves = [], valores = [];
		campos = onde.getElementsByTagName("input");
		n = campos.length
		for (i = 0; i<n; i++) {
			chaves.push(campos[i].name);
			valores.push(campos[i].value);
		}
		campos = onde.getElementsByTagName("select");
		n = campos.length
		for (i = 0; i<n; i++) {
			chaves.push(campos[i].name);
			valores.push(campos[i].value);
		}
		fim = function(){
			i3GEO.janela.destroi("i3GEOF.parametrossql");
			i3GEO.atualiza();
		};
		p = i3GEO.configura.locaplic+"/ferramentas/parametrossql/exec.php?g_sid="+i3GEO.configura.sid
			+ "&funcao=aplicar"
			+ "&tema=" + camada.name
			+ "&chaves=" + chaves.join(",")
			+ "&valores=" + valores.join(",");
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"foo",fim);
	},
	cancela: function(){
		var fim,cp,p;
		fim = function(){
			i3GEO.atualiza();
		};
		p = i3GEO.configura.locaplic+"/ferramentas/parametrossql/exec.php?g_sid="+i3GEO.configura.sid
			+ "&funcao=remover"
			+ "&tema=" + i3GEOF.parametrossql.tema;
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"foo",fim);
	}
};
