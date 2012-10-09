
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Mostra extens&atilde;o

Mostra a extens&atilde;o geogr&aacute;fica atual do mapa permitindo tamb&eacute;m alter&aacute;-la digitando-se os valores de lat e long

Veja:

<i3GEO.mapa.dialogo.mostraExten>

Arquivo:

i3geo/ferramentas/mostraexten/index.js.php

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
Classe: i3GEOF.mostraExten
*/
i3GEOF.mostraExten = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.mostraExten.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.mostraExten.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/mostraexten/dicionario.js",
				"i3GEOF.mostraExten.iniciaJanelaFlutuante()",
				"i3GEOF.mostraExten.dicionario_script"
			);
		}
		else{
			i3GEOF.mostraExten.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.mostraExten.html();
			new YAHOO.widget.Button(
				"i3GEOmostraExtenbotao1",
				{onclick:{fn: i3GEOF.mostraExten.executa}}
			);
			i3GEOF.mostraExten.ativaFoco();
		}
		catch(erro){alert(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '<p class="paragrafo" >Extens&atilde;o geogr&aacute;fica atual, em d&eacute;cimos de grau. As coordenadas correspondem a menor longitude, menor latitude, maior longitude e maior latitude:</p>' +
		'<textarea id=i3GEOmostraExtenatual rows=3 cols=50 onclick="javascript:this.select();"></textarea>' +
		'<p class="paragrafo" >	Digite as coordenadas referentes a nova extens&atilde;o geogr&aacute;fica desejada para o mapa. Utilize coordenadas (graus) negativos para indicar a longitude como oeste e latitude como sul:</p>' +
		'	<table class=lista3 >' +
		'		<tr><td>Menor longitude (oeste):</td>' +
		'		<td>' +
		$inputText("","","i3GEOmostraExtenxg","",3,"-00") +
		$inputText("","","i3GEOmostraExtenxm","",3,"00") +
		$inputText("","","i3GEOmostraExtenxs","",3,"0.0") +
		'		</td></tr>' +
		'		<tr><td>Menor latitude (sul):</td>' +
		'		<td>' +
		$inputText("","","i3GEOmostraExtenyg","",3,"-00") +
		$inputText("","","i3GEOmostraExtenym","",3,"00") +
		$inputText("","","i3GEOmostraExtenys","",3,"0.0") +
		'		</td></tr>' +
		'		<tr><td>Maior longitude (leste):</td>' +
		'		<td>' +
		$inputText("","","i3GEOmostraExtenxxg","",3,"-00") +
		$inputText("","","i3GEOmostraExtenxxm","",3,"00") +
		$inputText("","","i3GEOmostraExtenxxs","",3,"0.0") +
		'		</td></tr>' +
		'		<tr><td>Maior latitude (norte):</td>' +
		'		<td>' +
		$inputText("","","i3GEOmostraExtenyyg","",3,"-00") +
		$inputText("","","i3GEOmostraExtenyym","",3,"00") +
		$inputText("","","i3GEOmostraExtenyys","",3,"0.0") +
		'		</td></tr></table>' +
		'<br><p class="paragrafo" ><input id=i3GEOmostraExtenbotao1 type="button" size=14 value="Aplicar a nova extens&atilde;o"  /></p>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,temp,titulo,cabecalho,minimiza;
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.mostraExten.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.mostraExten");
		};
		titulo = $trad("d8t")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=7&idajuda=55' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"370px",
			"320px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.mostraExten",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.mostraExten_corpo").style.backgroundColor = "white";
		$i("i3GEOF.mostraExten_corpo").style.textAlign = "left";
		i3GEOF.mostraExten.aguarde = $i("i3GEOF.mostraExten_imagemCabecalho").style;
		i3GEOF.mostraExten.inicia(divid);
		if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEOF.mostraExten.ativaFoco()") < 0)
		{i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.mostraExten.ativaFoco()");}
		temp = function(){
			i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.mostraExten.ativaFoco()");
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: ativaFoco

	Fun&ccedil;&atilde;o que &eacute; disparada quando o usu&aacute;rio clica no cabe&ccedil;alho da ferramenta
	*/
	ativaFoco: function(){
		$i("i3GEOmostraExtenatual").innerHTML = i3GEO.parametros.mapexten;
		var i = $i("i3GEOF.mostraExten_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
	},
	/*
	Function: executa

	Altera a extens&atilde;o atual

	Veja:

	<i3GEO.navega.zoomExt>
	*/
	executa: function(){
		try{
			var x = i3GEO.calculo.dms2dd($i("i3GEOmostraExtenxg").value,$i("i3GEOmostraExtenxm").value,$i("i3GEOmostraExtenxs").value);
			var xx = i3GEO.calculo.dms2dd($i("i3GEOmostraExtenxxg").value,$i("i3GEOmostraExtenxxm").value,$i("i3GEOmostraExtenxxs").value);
			var y = i3GEO.calculo.dms2dd($i("i3GEOmostraExtenyg").value,$i("i3GEOmostraExtenym").value,$i("i3GEOmostraExtenys").value);
			var yy = i3GEO.calculo.dms2dd($i("i3GEOmostraExtenyyg").value,$i("i3GEOmostraExtenyym").value,$i("i3GEOmostraExtenyys").value);
			if ((x == xx) || (y == yy))
			{alert("Digite coordenadas v&aacute;lidas");return;}
			if ((x > xx) || (y > yy))
			{alert("Digite coordenadas v&aacute;lidas");return;}
			i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,window.parent.i3GEO.parametros.tipoimagem,(x+" "+y+" "+xx+" "+yy));
		}
		catch(e){alert(e+" Erro. Digite coordenadas v&aacute;lidas");}
	}
};
