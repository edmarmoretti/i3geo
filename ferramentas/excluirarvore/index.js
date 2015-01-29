/*
Title: Excluir camadas em lote

Veja:

<i3GEO.arvoreDeCamadas.dialogo.excluir>

Arquivo:

i3geo/ferramentas/excluirarvore/index.js.php

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
Classe: i3GEOF.excluirarvore

*/
i3GEOF.excluirarvore = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	Variavel: iddiv

	Guarda o id do div definido na fun&ccedil;&atilde;o "inicia".
	*/
	iddiv: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.excluirarvore.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.excluirarvore.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/excluirarvore/dicionario.js",
				"i3GEOF.excluirarvore.iniciaJanelaFlutuante()",
				"i3GEOF.excluirarvore.dicionario_script"
			);
		}
		else{
			i3GEOF.excluirarvore.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		var camadas = i3GEO.arvoreDeCamadas.CAMADASINICIAIS,
			n = camadas.length,
			temp;
		i3GEOF.excluirarvore.iddiv = iddiv;
		try{
			$i(iddiv).innerHTML = i3GEOF.excluirarvore.html();
			new YAHOO.widget.Button(
				"i3GEOexcluirbotao1",
				{onclick:{fn: i3GEOF.excluirarvore.lote}}
			);
		}
		catch(erro){
			i3GEO.eventos.removeEventos("ATUALIZAARVORECAMADAS",["i3GEOF.excluirarvore.inicia(i3GEOF.excluirarvore.iddiv)"]);
		}
		while(n > 0){
			n -= 1;
			temp = $i("excluirC_"+camadas[n].name);
			if(temp)
			{temp.checked = false;}
		}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var camadas = i3GEO.arvoreDeCamadas.CAMADAS,
			n = camadas.length,
			ins = "";

		ins = "<p class=paragrafo ><input id=i3GEOexcluirbotao1 type='buttom' value='"+$trad('removeMapa',i3GEOF.excluirarvore.dicionario)+"' /></p>" +
			"<table id='i3GEOFexcluirarvoreLista' style='width:95%' class='lista8'>";
		while(n > 0){
			n -= 1;
			if(camadas[n].tema !== "")
			{ins += "<tr><td><input id='excluirC_"+camadas[n].name+"' CHECKED class=inputsb style='cursor:pointer' type=checkbox value='"+camadas[n].name+"' /></td><td><span style=background:white id='i3GEOanima"+camadas[n].name+"'>"+camadas[n].tema+"</span></td></tr>";}
		}
		ins += "</table><br>";
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,temp,titulo,cabecalho,minimiza;
		if($i("i3GEOF.excluirarvore")){
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.excluirarvore");
		};
		//cria a janela flutuante
		titulo = $trad("t12")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=6&idajuda=110' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"300px",
			"350px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.excluirarvore",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		i3GEOF.excluirarvore.aguarde = $i("i3GEOF.excluirarvore_imagemCabecalho").style;
		divid = janela[2].id;
		$i("i3GEOF.excluirarvore_corpo").style.backgroundColor = "white";
		$i("i3GEOF.excluirarvore_corpo").style.textAlign = "left";
		temp = function(){
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.excluirarvore.inicia(i3GEOF.excluirarvore.iddiv)") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.excluirarvore.inicia(i3GEOF.excluirarvore.iddiv)");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		i3GEO.eventos.adicionaEventos("ATUALIZAARVORECAMADAS",["i3GEOF.excluirarvore.inicia(i3GEOF.excluirarvore.iddiv)"]);
		i3GEOF.excluirarvore.inicia(divid);
	},
	/*
	Function: lote

	Executa uma opera&ccedil;&atilde;o em lote sobre as camadas mostradas no mapa

	*/
	lote: function(objeto){
		var lista = [],
			temp,
			camadas = i3GEO.arvoreDeCamadas.CAMADAS,
			n = camadas.length;
		if(i3GEOF.excluirarvore.aguarde.visibility === "visible")
		{return;}
		i3GEOF.excluirarvore.aguarde.visibility = "visible";
		while(n > 0){
			n -= 1;
			temp = $i("excluirC_"+camadas[n].name);
			if(temp && temp.checked === true)
			{lista.push(temp.value);}
		}
		temp = function(){
			i3GEOF.excluirarvore.aguarde.visibility = "hidden";
			i3GEO.atualiza();
		};
		if(lista.length > 0)
		{i3GEO.php.excluitema(temp,lista);}
		else{
			i3GEO.janela.tempoMsg($trad('selecionaCamada',i3GEOF.excluirarvore.dicionario));
			i3GEOF.excluirarvore.aguarde.visibility = "hidden";
		}
	}
};
