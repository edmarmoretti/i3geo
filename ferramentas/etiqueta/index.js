
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Etiqueta

Ativa um determinado campo na tabela de atributos para ser utilizado na ferramenta de identifica&ccedil;&atilde;o do tipo "bal&atilde;o".

<i3GEO.tema.dialogo.etiquetas>

Arquivo:

i3geo/ferramentas/etiqueta/index.js.php

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
Classe: i3GEOF.etiqueta
*/
i3GEOF.etiqueta = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.etiqueta.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.etiqueta.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/etiqueta/dicionario.js",
				"i3GEOF.etiqueta.iniciaJanelaFlutuante()",
				"i3GEOF.etiqueta.dicionario_script"
			);
		}
		else{
			i3GEOF.etiqueta.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		i3GEO.janela.comboCabecalhoTemas("i3GEOFetiquetaComboCabeca","i3GEOFetiquetaComboCabecaSel","etiqueta","ligadosComTabela");
		if(i3GEO.temaAtivo === ""){
			$i(iddiv).innerHTML = "";//'<img src="../imagens/opcoes.gif" ><p style="position: relative; top: -35px; width: 180px; font-size: 15px; text-align: left; left: 35px;">'+$trad('selecionaTema',i3GEOF.etiqueta.dicionario)+'</p>';
			return;
		}
		try{
			$i(iddiv).innerHTML += i3GEOF.etiqueta.html();
			var b = new YAHOO.widget.Button(
				"i3GEOetiquetabotao1",
				{onclick:{fn: i3GEOF.etiqueta.ativa}}
			);
			b.addClass("rodar150");
			b = new YAHOO.widget.Button(
				"i3GEOetiquetabotao2",
				{onclick:{fn: i3GEOF.etiqueta.desativa}}
			);
			b.addClass("rodar150");
			i3GEOF.etiqueta.ativaFoco();
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
		var ins = '';
		ins += '<p class="paragrafo" >'+$trad('selecionaItem',i3GEOF.etiqueta.dicionario)+':<br>';
		ins += '<div id=i3GEOetiquetalistai class=digitar style="text-align:left;left:0px;top:0px;width;95%;height:150px;overflow:auto;display:block;"></div>';
		ins += '<br>';
		ins += '<p class="paragrafo" >';
		ins += '<input id=i3GEOetiquetabotao1 size=35  type=button value="'+$trad("p14")+'" />';
		ins += '<input id=i3GEOetiquetabotao2 size=35  type=button value="'+$trad('desativaEtiquetas',i3GEOF.etiqueta.dicionario)+'" />';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		if($i("i3GEOF.etiqueta")){
			i3GEOF.etiqueta.inicia("i3GEOF.etiqueta_corpo");
			return;
		}
		cabecalho = function(){
			i3GEOF.etiqueta.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.etiqueta");
		};
		//cria a janela flutuante
		titulo = "<div  id='i3GEOFetiquetaComboCabeca' class='comboTemasCabecalho'>   ------</div><span style=margin-left:60px>"+$trad("d7at")+"</span><a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=37' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"500px",
			"230px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.etiqueta",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true,
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/feed-subscribe.png"
		);
		divid = janela[2].id;
		i3GEOF.etiqueta.aguarde = $i("i3GEOF.etiqueta_imagemCabecalho").style;
		$i("i3GEOF.etiqueta_corpo").style.backgroundColor = "white";
		i3GEOF.etiqueta.inicia(divid);
		temp = function(){
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search('i3GEO.janela.comboCabecalhoTemas("i3GEOFetiquetaComboCabeca","i3GEOFetiquetaComboCabecaSel","etiqueta","ligadosComTabela")') > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove('i3GEO.janela.comboCabecalhoTemas("i3GEOFetiquetaComboCabeca","i3GEOFetiquetaComboCabecaSel","etiqueta","ligadosComTabela")');}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		if(i3GEO.temaAtivo != ""){
			i3GEO.php.listaItensTema(i3GEOF.etiqueta.montaListaItens,i3GEO.temaAtivo);
		}
	},
	pegaDadosEtiquetas: function(funcao){
		var cp = new cpaint(),
			p;
		p = i3GEO.configura.locaplic+"/ferramentas/etiqueta/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=pegaDadosEtiquetas&tema="+i3GEO.temaAtivo;
		cp.set_response_type("JSON");
		cp.call(p,"etiqueta",funcao);
	},
	/*
	Function: montaListaItens

	Monta a lista de itens que poder&atilde;o ser escolhidos para compor o mapa.

	A lista &eacute; inserida no elemento html com id "i3GEOetiquetalistai"

	@TODO verificar quando um item ja esta na lista e marca-lo no checkbox
	*/
	montaListaItens: function(retorno){
		var funcao = function(dadosItens){
			var ins,i,n,itensatuais,item,ck = '',lista;
			lista = dadosItens.data;
			try{
				itensatuais = i3GEO.arvoreDeCamadas.pegaTema(i3GEO.temaAtivo);
				itensatuais = itensatuais.etiquetas.split(",");
				ins = [];
				ins.push("<table class='lista8' >");
				ins.push("<tr><td>Coluna</td><td>Tip</td><td>Identifica</td><td>Alias</td><td>Link</td>");
				n = retorno.data.valores.length;
				for (i=0;i<n; i++){
					//etiquetas tip
					item = retorno.data.valores[i].item;
					if(i3GEO.util.in_array(item,itensatuais)){
						ck = "checked";
					}
					else{
						ck = "";
					}
					ins.push("<tr>");
					ins.push("<td>&nbsp;"+item+"</td>");
					ins.push("<td><input disabled style='cursor:pointer' "+ck+" type='checkbox' value='"+item+"' name='etiquetaTip' /></td>");
					//itens
					if(i3GEO.util.in_array(item,lista.itens)){
						ck = "checked";
					}
					else{
						ck = "";
					}
					ins.push("<td><input onclick='i3GEOF.etiqueta.ativaLinha(this)' style='cursor:pointer' id='etiqueta_"+item+"' "+ck+" type='checkbox' value='"+item+"' name='identifica' /></td>");
					//alias dos itens
					if(lista.itensdesc[item]){
						ck = lista.itensdesc[item];
					}
					else{
						ck = "";
					}
					ins.push("<td><div class='styled-select150' ><input disabled style='cursor:pointer' type='text' value='"+ck+"' name='itensdesc' /></div></td>");
					//links
					if(lista.itenslink[item]){
						ck = lista.itenslink[item];
					}
					else{
						ck = "";
					}
					ins.push("<td><div class='styled-select150' ><input disabled style='cursor:pointer' type='text' value='"+ck+"' name='itenslink' /></div></td>");

					ins.push("</tr>");
				}
				ins.push("</table>");
				$i("i3GEOetiquetalistai").innerHTML = ins.join("");
				//enable
				lista = $i("i3GEOetiquetalistai").getElementsByTagName("input");
				n = lista.length;
				for (i=0;i<n; i++){
					if(lista[i].name === "identifica"){
						i3GEOF.etiqueta.ativaLinha(lista[i]);
					}
				}
			}
			catch(e)
			{$i("i3GEOetiquetalistai").innerHTML = "<p style=color:red >Erro<br>"+e;}
		};
		i3GEOF.etiqueta.pegaDadosEtiquetas(funcao);
	},
	ativaLinha: function(obj){
		var linha = obj.parentNode.parentNode,
			objs = linha.getElementsByTagName("input"),
			n = objs.length,
			i;
		for(i=0;i<n;i++){
			if(objs[i].name != "identifica"){
				objs[i].disabled = !obj.checked;
			}
		}
	},
	/*
	Function: pegaItensMarcados

	Recupera os itens que foram marcados e monta uma lista para enviar como par&acirc;metro para a fun&ccedil;&atilde;o de gera&ccedil;&atilde;o dos gr&aacute;ficos
	*/
	pegaItensMarcados: function(){
		var tips = [],
			itens = [],
			itensdesc = [],
			itenslink = [],
			inputs = $i("i3GEOetiquetalistai").getElementsByTagName("input"),
			i,
			it,
			n = inputs.length;
		for (i=0;i<n; i++){
			it = inputs[i];
			if (it.disabled === false && it.checked === true && it.name === "etiquetaTip"){
				tips.push(it.value);
			}
			if (it.disabled === false && it.checked === true && it.name === "identifica"){
				itens.push(it.value);
			}
			if (it.disabled === false && it.name === "itensdesc"){
				itensdesc.push(it.value);
			}
			if (it.disabled === false && it.name === "itenslink"){
				itenslink.push(it.value);
			}
		}
		return([tips,itens,itensdesc,itenslink]);
	},
	/*
	Function: ativa

	Ativa a etiqueta com os itens marcados

	Veja:

	<ATIVAETIQUETAS>
	*/
	ativa: function(){
		try{
			if(i3GEOF.etiqueta.aguarde.visibility === "visible")
			{return;}
			var lista = i3GEOF.etiqueta.pegaItensMarcados(),
				cp = new cpaint(),
				temp,
				p;

			i3GEOF.etiqueta.aguarde.visibility = "visible";
			temp = function(retorno){
				i3GEOF.etiqueta.aguarde.visibility = "hidden";
				i3GEO.atualiza(retorno);
				i3GEO.php.listaItensTema(i3GEOF.etiqueta.montaListaItens,i3GEO.temaAtivo);
			};
			p = i3GEO.configura.locaplic+"/ferramentas/etiqueta/exec.php?g_sid="
				+ i3GEO.configura.sid
				+ "&funcao=ativaEtiquetas&tema="
				+ i3GEO.temaAtivo
				+ "&tips="+lista[0].toString(",")
				+ "&itens="+lista[1].toString(",")
				+ "&itensdesc="+i3GEO.util.base64encode(lista[2].toString(","))
				+ "&itenslink="+i3GEO.util.base64encode(lista[3].toString(","));
			cp.set_response_type("JSON");
			cp.set_transfer_mode('POST');
			cp.call(p,"etiqueta",temp);
		}catch(e){i3GEO.janela.tempoMsg("Erro: "+e);i3GEOF.etiqueta.aguarde.visibility = "hidden";}
	},
	/*
	Function: desativa

	Desativa as etiqueta do tema ativo

	Veja:

	<REMOVEETIQUETAS>
	*/
	desativa: function(){
		try{
			if(i3GEOF.etiqueta.aguarde.visibility === "visible")
			{return;}
			var cp = new cpaint(),
				temp,
				p;
			i3GEOF.etiqueta.aguarde.visibility = "visible";
			temp = function(retorno){
				i3GEOF.etiqueta.aguarde.visibility = "hidden";
				i3GEO.atualiza(retorno);
			};
			p = i3GEO.configura.locaplic+"/ferramentas/etiqueta/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=removeEtiquetas&tema="+i3GEO.temaAtivo;
			cp.set_response_type("JSON");
			cp.call(p,"etiqueta",temp);
		}catch(e){i3GEO.janela.tempoMsg("Erro: "+e);i3GEOF.etiqueta.aguarde.visibility = "hidden";}
	}
};