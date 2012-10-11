
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Cor da sele&ccedil;&atilde;o

Altera a cor que destaca os elementos selecionados.

Veja:

<i3GEO.mapa.dialogo.queryMap>

Arquivo:

i3geo/ferramentas/opcoes_querymap/index.js.php

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
Classe: i3GEOF.opcoesQuery
*/
i3GEOF.opcoesQuery = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.opcoesQuery.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.opcoesQuery.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/opcoes_query/dicionario.js",
				"i3GEOF.opcoesQuery.iniciaJanelaFlutuante()",
				"i3GEOF.opcoesQuery.dicionario_script"
			);
		}
		else{
			i3GEOF.opcoesQuery.iniciaJanelaFlutuante();
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
			i3GEOF.opcoesQuery.aguarde.visibility = "visible";
			$i(iddiv).innerHTML += i3GEOF.opcoesQuery.html();
			new YAHOO.widget.Button(
				"i3GEOopcoesQuerybotao1",
				{onclick:{fn: i3GEOF.opcoesQuery.executa}}
			);
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=pegaquerymapcor",
				cp = new cpaint(),
				retorno = function(retorno){
					i3GEOF.opcoesQuery.aguarde.visibility = "hidden";
					if(retorno.data.erro){i3GEO.janela.tempoMsg("Ocorreu um erro");return;}
					$i("i3GEOopcoesQuerycor").value = retorno.data;
				};
			cp.set_response_type("JSON");
			cp.call(p,"corQM",retorno);
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = $inputText("","","i3GEOopcoesQuerycor","",12,"") +
		'<img alt="aquarela.gif" style=cursor:pointer '+
		'src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.opcoesQuery.corj(\'i3GEOopcoesQuerycor\')" /> ' +
		'<br><br><p class=paragrafo ><input size=20 id=i3GEOopcoesQuerybotao1 type=button value="Aplica"  />';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opcoesQuery");
		};
		//cria a janela flutuante
		titulo = $trad("p8")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=5' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"220px",
			"80px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.opcoesQuery",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.opcoesQuery_corpo").style.backgroundColor = "white";
		$i("i3GEOF.opcoesQuery_corpo").style.textAlign = "left";
		i3GEOF.opcoesQuery.aguarde = $i("i3GEOF.opcoesQuery_imagemCabecalho").style;
		i3GEOF.opcoesQuery.inicia(divid);
	},
	/*
	Function: corj

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: executa

	Aplica os parâmetros definidos

	Veja:

	<QUERYMAPCOR>
	*/
	executa: function(){
		if(i3GEOF.opcoesQuery.aguarde.visibility === "visible")
		{return;}
		i3GEOF.opcoesQuery.aguarde.visibility = "visible";
		var temp = function(){
				i3GEOF.opcoesQuery.aguarde.visibility = "hidden";
				i3GEO.atualiza();
			},
			cor = $i("i3GEOopcoesQuerycor").value,
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=querymapcor&cor="+cor,
			cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"corQM",temp);
	}
};
