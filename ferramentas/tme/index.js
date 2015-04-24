/*
Title: TME

Cria um arquivo KML com a representa&ccedil;&atilde;o em mapa tem&aacute;tico baseado no pacote TME

<i3GEO.tema.dialogo.tme>

Arquivo:

i3geo/ferramentas/tme/index.js.php

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
Classe: i3GEOF.tme
*/
i3GEOF.tme = {
	//opcional - nome do item da tabela de atributos que contem os nomes dos elementos
	//utilizado para definir o valor do combo i3GEOTMEregioes
	ITEMNOMEREGIOES: "",
	//opcional - nome do item da tabela de atributos que contem os dados dos elementos
	//utilizado para definir item que iniciara marcado na lista de itens que indica a coluna que contem os dados
	ITEMDADOS: "",
	/*
	Variavel: tema

	Tema que ser&aacute; utilizado

	Type:
	{string}
	*/
	tema: i3GEO.temaAtivo,
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.tme.iniciaDicionario();
	},
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.tme.dicionario);
		return dicionario;
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.tme.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/tme/dicionario.js",
				"i3GEOF.tme.iniciaJanelaFlutuante()",
				"i3GEOF.tme.dicionario_script"
			);
		}
		else{
			i3GEOF.tme.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		i3GEO.janela.comboCabecalhoTemas("i3GEOFtmeComboCabeca","i3GEOFtmeComboCabecaSel","tme","ligadosComTabela");
		if(i3GEO.temaAtivo === ""){
			$i(iddiv).innerHTML = "";//'<img src="../imagens/opcoes.gif" ><p style="position: relative; top: -35px; width: 180px; font-size: 15px; text-align: left; left: 35px;">Escolha um tema da lista</p>';
			return;
		}
		try{
			$i(iddiv).innerHTML += i3GEOF.tme.html();
			YAHOO.i3GEO.janela.manager.find("i3GEOF.tme").setFooter(
				'<input class="paragrafo" id="i3GEOtmebotao1" type="button" value="'+$trad('geraKml',i3GEOF.tme.dicionario)+'" style="cursor:pointer;color:blue"/>'
			);
			var b = new YAHOO.widget.Button(
				"i3GEOtmebotao1",
				{onclick:{fn: i3GEOF.tme.ativa}}
			);
			b.addClass("rodar");
			$i("i3GEOtmebotao1-button").style.width = "350px";
			i3GEO.util.comboItens(
				"i3GEOTMEregioes",
				i3GEOF.tme.tema,
				function(retorno){
					if($i("i3GEOTMEregioeslista"))
					{$i("i3GEOTMEregioeslista").innerHTML = retorno.dados;}
					if(i3GEOF.tme.ITEMNOMEREGIOES != ""){
						$i("i3GEOTMEregioes").value = i3GEOF.tme.ITEMNOMEREGIOES;
					}
				},
				"i3GEOTMEregioeslista"
			);
			i3GEO.util.mensagemAjuda("i3GEOtmemen1",$i("i3GEOtmemen1").innerHTML);
			i3GEOF.tme.ativaFoco();
			if(i3GEO.arvoreDeCamadas){
				$i("i3GEOTMEtitulo").value = i3GEO.arvoreDeCamadas.pegaTema(i3GEO.temaAtivo).tema;
			}
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html: function() {
		var ins = Mustache.render(i3GEOF.tme.MUSTACHE, i3GEOF.tme.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		if($i("i3GEOF.tme")){
			i3GEOF.tme.inicia("i3GEOF.tme_corpo");
			return;
		}
		cabecalho = function(){
			i3GEOF.tme.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.tme");
		};
		//cria a janela flutuante
		titulo = "<span class='i3GEOiconeFerramenta i3GEOiconeTme'></span>"
			+ "<div  id='i3GEOFtmeComboCabeca' class='comboTemasCabecalho'>   ------</div>"
			+ "<div class='i3GeoTituloJanela'>tme </span><a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=108' >&nbsp;&nbsp;&nbsp;</a></div>";
		janela = i3GEO.janela.cria(
			"380px",
			"320px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.tme",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true
		);
		divid = janela[2].id;
		i3GEOF.tme.aguarde = $i("i3GEOF.tme_imagemCabecalho").style;
		$i("i3GEOF.tme_corpo").style.backgroundColor = "white";
		i3GEOF.tme.inicia(divid);
		temp = function(){
			i3GEO.eventos.removeEventos("ATUALIZAARVORECAMADAS",['i3GEO.janela.comboCabecalhoTemas("i3GEOFtmeComboCabeca","i3GEOFtmeComboCabecaSel","tme","ligadosComTabela")']);
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEO.php.listaItensTema(i3GEOF.tme.montaListaItens,i3GEOF.tme.tema);
		var i = $i("i3GEOF.tme_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
	},
	/*
	Function: montaListaItens

	Monta a lista de itens que poder&atilde;o ser escolhidos para compor o mapa.

	A lista &eacute; inserida no elemento html com id "i3GEOtmelistai"
	*/
	montaListaItens: function(retorno){
		var ins,i,n,item;
		try{
			ins = [];
			ins.push("<table class=lista >");
			n = retorno.data.valores.length;
			for (i=0;i<n; i++){
				item = retorno.data.valores[i].item;
				ins.push("<tr><td><input size=2 style='cursor:pointer' type=checkbox id=i3GEOtme"+item+" /></td>");
				ins.push("<td>&nbsp;"+item+"</td>");
			}
			$i("i3GEOtmelistai").innerHTML = ins.join("");
			ins.push("</table>");
			if(i3GEOF.tme.ITEMDADOS != "" && $i("i3GEOtme"+i3GEOF.tme.ITEMDADOS)){
				$i("i3GEOtme"+i3GEOF.tme.ITEMDADOS).checked = true;
			}
		}
		catch(e)
		{$i("i3GEOtmelistai").innerHTML = "<p style=color:red >Erro<br>"+e;}
	},
	/*
	Function: pegaItensMarcados

	Recupera os itens que foram marcados e monta uma lista para enviar como parametro para a fun&ccedil;&atilde;o de gera&ccedil;&atilde;o dos gr&aacute;ficos
	*/
	pegaItensMarcados: function(){
		var listadeitens = [],
			inputs = $i("i3GEOtmelistai").getElementsByTagName("input"),
			i,
			it,
			n;
		n = inputs.length;
		for (i=0;i<n; i++){
			if (inputs[i].checked === true){
				it = inputs[i].id;
				listadeitens.push(it.replace("i3GEOtme",""));
			}
		}
		return(listadeitens);
	},
	/*
	Function: ativa

	Cria o arquivo KML com os itens marcados

	Veja:

	<ATIVAtme>
	*/
	ativa: function(){
		try{
			if(i3GEOF.tme.aguarde.visibility === "visible")
			{return;}
			var lista = i3GEOF.tme.pegaItensMarcados(),
				cp = new cpaint(),
				temp,
				p,
				colunanomeregiao = $i("i3GEOTMEregioes").value;
			if(lista.length === 0)
			{i3GEO.janela.tempoMsg("selecione um item");return;}
			if(colunanomeregiao === 0)
			{i3GEO.janela.tempoMsg($trad('selecionaItemRegiao',i3GEOF.tme.dicionario));return;}
			i3GEOF.tme.aguarde.visibility = "visible";
			temp = function(retorno){
				i3GEOF.tme.aguarde.visibility = "hidden";
				var ins = "<p class=paragrafo >" + $trad('arquivoDownload',i3GEOF.tme.dicionario) +"<br><a href='"+retorno.data.url+"' target=new >"+retorno.data.url+"</a><br>";
				ins += "<br>" + $trad('abreNoI3geo',i3GEOF.tme.dicionario) +"<br><a href='"+i3GEO.configura.locaplic+"/ms_criamapa.php?interface=googleearth.phtml&kmlurl="+retorno.data.url+"' target='new' >interface Google Earth</a><br>";
				$i("i3GEOTMEresultado").innerHTML = ins;
				$i("i3GEOTMEresultado").scrollIntoView(true);

			};
			p = i3GEO.configura.locaplic+"/pacotes/tme/TME_i3geo.php?maxHeight="+$i("i3GEOTMEmaxHeight").value+"&barSize="+$i("i3GEOTMEbarSize").value+"&sid="+i3GEO.configura.sid+"&nomelayer="+i3GEO.temaAtivo+"&colunasvalor="+lista.toString(",")+"&colunanomeregiao="+colunanomeregiao+"&titulo="+$i("i3GEOTMEtitulo").value+"&descricao="+$i("i3GEOTMEdesc").value;
			cp.set_response_type("JSON");
			cp.call(p,"tme",temp);
		}catch(e){i3GEO.janela.tempoMsg("Erro: "+e);i3GEOF.tme.aguarde.visibility = "hidden";}
	}
};