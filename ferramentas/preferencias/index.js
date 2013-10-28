/*
Title: Preferencias

Gerencia as preferencias do usuario

Veja:

<i3GEO.mapa.dialogo.preferencias>

Arquivo:

i3geo/ferramentas/preferencias/index.js

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
Classe: i3GEOF.preferencias

*/
i3GEOF.preferencias = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.preferencias.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.preferencias.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/preferencias/dicionario.js",
				"i3GEOF.preferencias.iniciaJanelaFlutuante()",
				"i3GEOF.preferencias.dicionario_script"
			);
		}
		else{
			i3GEOF.preferencias.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.preferencias.html();
			new YAHOO.widget.Button(
				"i3GEOpreferenciasbotao1",
				{onclick:{fn: i3GEOF.preferencias.limpa}}
			);
			new YAHOO.widget.Button(
				"i3GEOpreferenciasbotao2",
				{onclick:{fn: i3GEOF.preferencias.salva}}
			);
			i3GEOF.preferencias.carrega();
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
		if(i3GEO.Interface.ATUAL !== "padrao")
		{i3GEO.janela.tempoMsg($trad(1,i3GEOF.preferencias.dicionario));}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		return "";
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.preferencias");
		};
		//cria a janela flutuante
		titulo = $trad("x86")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=3' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"400px",
			"500px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.preferencias",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		var rodape = '' +
			'<input id=i3GEOpreferenciasbotao1 size=20  type=button value="'+$trad(1,i3GEOF.preferencias.dicionario)+'" />' +
			'<input id=i3GEOpreferenciasbotao2 size=20 type=button value="'+$trad(2,i3GEOF.preferencias.dicionario)+'" />' ;
		janela[0].setFooter("<div style=background-color:#F2F2F2; >"+rodape+"</div>");

		$i("i3GEOF.preferencias_corpo").style.backgroundColor = "white";
		$i("i3GEOF.preferencias_corpo").style.textAlign = "left";
		i3GEOF.preferencias.aguarde = $i("i3GEOF.preferencias_imagemCabecalho").style;
		i3GEOF.preferencias.inicia(divid);
	},
	limpa: function(){
		
	},
	salva: function(){
		
	}
	carrega: function(){
		
	}
};
