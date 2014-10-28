
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Adiciona um tema ao mapa com base em um arquivo GeoJson existente na Web

O usu&aacute;rio pode escolher o arquivo de uma lista. A lista &eacute; obtida do sistema de administra&ccedil;&atilde;o do i3Geo

Veja:

<i3GEO.arvoreDeTemas.dialogo.conectarGeoJson>

Arquivo:

i3geo/ferramentas/conectargeojson/index.js.php

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
Classe: i3GEOF.conectargeojson
*/
i3GEOF.conectargeojson = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.conectargeojson.iniciaDicionario();
	},
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.conectargeojson.dicionario);
		dicionario["conectaGeoJson"] = $inputText('','','i3GEOconectargeojsonurl','',45,'');
		dicionario["aguarde"] = $trad("o1");
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["aplica"] = $trad("p14");
		return dicionario;
	},
	/*
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.conectargeojson.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/conectargeojson/dicionario.js",
				"i3GEOF.conectargeojson.iniciaJanelaFlutuante()",
				"i3GEOF.conectargeojson.dicionario_script"
			);
		}
		else{
			i3GEOF.conectargeojson.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(navm)
		{i3GEO.janela.tempoMsg($trad('msgNavegador',i3GEOF.conectargeojson.dicionario));}
		try{
			$i(iddiv).innerHTML = i3GEOF.conectargeojson.html();
			var b,monta = function(retorno){
				var raiz,nraiz,i,combo;
				raiz = retorno.data.canais;
				nraiz = raiz.length;
				combo = "<select onchange='javascript:$i(\"i3GEOconectargeojsonurl\").value = this.value;'>";
				combo += "<option value=''>---</option>";
				for (i=0;i<nraiz; i++){
					combo += "<option value='"+raiz[i].link+"'>"+raiz[i].title+"</option>";
				}
				combo += "</select>";
				$i("i3GEOconectargeojsonCombo").innerHTML = "<div class=styled-select>"+combo+"</div>";
			};
			i3GEO.php.listaRSSwsARRAY(monta,"GEOJSON");
			b = new YAHOO.widget.Button(
				"i3GEOconectargeojsonbotao1",
				{onclick:{fn: i3GEOF.conectargeojson.adiciona}}
			);
			b.addClass("rodar");
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.conectargeojson.MUSTACHE, i3GEOF.conectargeojson.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,titulo;
		//cria a janela flutuante
		cabecalho = function(){
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.conectargeojson");
		};
		titulo = "GeoJson <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=4&idajuda=106' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"360px",
			"150px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.conectargeojson",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true,
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/application-x-smb-workgroup.png"
		);
		divid = janela[2].id;
		i3GEOF.conectargeojson.aguarde = $i("i3GEOF.conectargeojson_imagemCabecalho").style;
		$i("i3GEOF.conectargeojson_corpo").style.backgroundColor = "white";
		i3GEOF.conectargeojson.inicia(divid);
	},
	/*
	Function: adiciona

	Adiciona a URL ao mapa
	*/
	adiciona: function(){
		if(i3GEOF.conectargeojson.aguarde.visibility === "visible")
		{return;}
		var reg,p,cp,funcao,
			url = $i("i3GEOconectargeojsonurl").value;
		if(url !== ""){
			reg = new RegExp("\\?", "g");
			url = url.replace(reg,'|');
			reg = new RegExp("&", "g");
			url = url.replace(reg,'#');
			i3GEOF.conectargeojson.aguarde.visibility = "visible";
			p = i3GEO.configura.locaplic+"/ferramentas/conectargeojson/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionaTemaGeoJson";
			cp = new cpaint();
			funcao = function(retorno){
				i3GEOF.conectargeojson.aguarde.visibility = "hidden";
				i3GEO.atualiza();
			};
			cp.set_transfer_mode('POST');
			cp.set_response_type("JSON");
			cp.call(p,"foo",funcao,"servico="+url);
			i3GEOF.conectargeojson.aguarde.visibility = "hidden";
		}
	}
};
