/*
Title: Tamanho do mapa

Veja:

<i3GEO.mapa.dialogo.tamanho>

Arquivo:

i3geo/ferramentas/opcoes_tamanho/index.js.php

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
Classe: i3GEOF.opcoesTamanho

*/
i3GEOF.opcoesTamanho = {
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.opcoesTamanho.dicionario);
		dicionario["Tamanhol"] = i3GEO.parametros.w;
		dicionario["Tamanhoa"] = i3GEO.parametros.h;
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		var b,box;
		try{
			$i(iddiv).innerHTML += i3GEOF.opcoesTamanho.html();
			b = new YAHOO.widget.Button(
				"i3GEOopcoesTamanhobotao2",
				{onclick:{fn: i3GEOF.opcoesTamanho.atualizaBox}}
			);
			b.addClass("rodar150");
			b = new YAHOO.widget.Button(
				"i3GEOopcoesTamanhobotao1",
				{onclick:{fn: i3GEOF.opcoesTamanho.executa}}
			);
			b.addClass("rodar150");
			i3GEO.util.criaBox("boxg");
			var pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDMAPA));
			box = $i("boxg");
			box.style.left = pos[0] + "px";
			box.style.top = pos[1] + "px";
			box.style.width = i3GEO.parametros.w + "px";
			box.style.height = i3GEO.parametros.h + "px";
			box.style.display = "block";
			box.style.zIndex = 2;
			i3GEO.janela.tempoMsg($trad('msg',i3GEOF.opcoesTamanho.dicionario));
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
		var ins = Mustache.render(i3GEOF.opcoesTamanho.MUSTACHE, i3GEOF.opcoesTamanho.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,temp,titulo,cabecalho,minimiza;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opcoesTamanho");
		};
		//cria a janela flutuante
		titulo = $trad("p5")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=4' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"190px",
			"130px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.opcoesTamanho",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.opcoesTamanho_corpo").style.backgroundColor = "white";
		$i("i3GEOF.opcoesTamanho_corpo").style.textAlign = "left";
		i3GEOF.opcoesTamanho.aguarde = $i("i3GEOF.opcoesTamanho_imagemCabecalho").style;
		i3GEOF.opcoesTamanho.inicia(divid);
		temp = function(){
			i3GEO.util.escondeBox();
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);

	},
	/*
	Function: executa

	Altera o tamanho do mapa

	Veja:

	<MUDATAMANHO>
	*/
	executa: function(){
		if(i3GEOF.opcoesTamanho.aguarde.visibility === "visible")
		{return;}
		i3GEOF.opcoesTamanho.aguarde.visibility = "visible";
		var l = $i("i3GEOopcoesTamanhol").value,
			a = $i("i3GEOopcoesTamanhoa").value,
			temp,
			p,
			cp;
		if ((l > 5) && (a > 5)){
			i3GEO.parametros.w = l;
			i3GEO.parametros.h = a;

			temp = function(){
				i3GEOF.opcoesTamanho.aguarde.visibility = "hidden";
			};
			p = i3GEO.configura.locaplic+"/ferramentas/opcoes_tamanho/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=mudatamanho&altura="+a+"&largura="+l;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"mudatamanho",temp);
		}
	},
	/*
	Function: atualizaBox

	Atualiza o tamanho do box que mostra previamente o tamanho do mapa
	*/
	atualizaBox: function(){
		var box = $i("boxg");
			l = $i("i3GEOopcoesTamanhol").value,
			a = $i("i3GEOopcoesTamanhoa").value;
		box.style.width = l+"px";
		box.style.height = a+"px";
	}

};