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
	tema : i3GEO.temaAtivo,
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	MUSTACHELISTA : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.etiqueta.dicionario);
		dicionario["aplica"] = $trad("p14");
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.etiqueta.MUSTACHE == ""){
			var t1 = i3GEO.configura.locaplic + "/ferramentas/etiqueta/template_mst.html",
			t2 = i3GEO.configura.locaplic + "/ferramentas/etiqueta/templateLista_mst.html";

			$.when( $.get(t1),$.get(t2) ).done(function(r1,r2) {
				i3GEOF.etiqueta.MUSTACHE = r1[0];
				i3GEOF.etiqueta.MUSTACHELISTA = r2[0];
				i3GEOF.etiqueta.inicia(iddiv);
			}).fail(function() {
				i3GEO.janela.closeMsg($trad("erroTpl"));
				return;
			});
			return;
		}

		if (!$i("i3GEOFetiquetaComboCabecaSel")) {
			i3GEO.janela.comboCabecalhoTemasBs("i3GEOFetiquetaComboCabeca","i3GEOFetiquetaComboCabecaSel","etiqueta","ligadosComTabela",function(evt){
				var botao = evt.target;
				if (botao) {
					if (botao.value != "") {
						i3GEO.mapa.ativaTema(botao.value);
						i3GEOF.etiqueta.tema = botao.value;
						$i(iddiv).innerHTML = "";
						i3GEOF.etiqueta.inicia(iddiv);
					} else {
						$i(iddiv).innerHTML = "";
					}
				}
			});
		}
		if(i3GEOF.etiqueta.tema === ""){
			$i(iddiv).innerHTML = "";
			return;
		}
		try{
			$i(iddiv).innerHTML += i3GEOF.etiqueta.html();

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
	html:function() {
		var ins = Mustache.render(i3GEOF.etiqueta.MUSTACHE, i3GEOF.etiqueta.mustacheHash());
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
		titulo = "<div  id='i3GEOFetiquetaComboCabeca' class='comboTemasCabecalhoBs form-group' style='width:200px; left:15px;'>   ------</div></div><a class='i3GeoTituloJanelaBs' target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=37' >"+$trad("d7at")+"</a>";
		janela = i3GEO.janela.cria(
			"510px",
			"300px",
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
			"",
			"",
			"",
			""
		);
		divid = janela[2].id;
		i3GEOF.etiqueta.aguarde = $i("i3GEOF.etiqueta_imagemCabecalho").style;
		$i("i3GEOF.etiqueta_corpo").style.backgroundColor = "white";
		i3GEOF.etiqueta.inicia(divid);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		if(i3GEO.temaAtivo != ""){
			i3GEO.php.listaItensTema(i3GEOF.etiqueta.montaListaItens,i3GEOF.etiqueta.tema);
		}
	},
	pegaDadosEtiquetas: function(funcao){
		var cp = new cpaint(),
			p;
		p = i3GEO.configura.locaplic+"/ferramentas/etiqueta/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=pegaDadosEtiquetas&tema="+i3GEOF.etiqueta.tema;
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
			var mustache = [], ins,i,n,itensatuais,item, ck = '',lista, temp;
			lista = dadosItens.data;
			try{
				itensatuais = i3GEO.arvoreDeCamadas.pegaTema(i3GEO.temaAtivo);
				itensatuais = itensatuais.etiquetas.split(",");
				n = retorno.data.valores.length;
				for (i=0;i<n; i++){
					temp = {};
					item = retorno.data.valores[i].item;
					temp.item = item;
					if(i3GEO.util.in_array(item,lista.itens) || i3GEO.util.in_array(item,itensatuais) || lista.itembuscarapida[item]){
						temp.ckIdentifica = "checked";
					}
					else{
						temp.ckIdentifica = "";
					}
					if(i3GEO.util.in_array(item,itensatuais)){
						temp.ckEtiquetaTip = "checked";
					}
					else{
						temp.ckEtiquetaTip = "";
					}
					//buscarapida
					if(lista.itembuscarapida === item){
						temp.ckBuscaRapida = "checked";
					}
					else{
						temp.ckBuscaRapida = "";
					}
					if(lista.itensdesc[item]){
						temp.ckitensdesc = lista.itensdesc[item];
					}
					else{
						temp.ckitensdesc = item;
					}
					//links
					if(lista.itenslink[item]){
						temp.ckitem = lista.itenslink[item];
					}
					else{
						temp.ckitem = "";
					}
					mustache.push(temp);
				}
				ins = Mustache.render(
						i3GEOF.etiqueta.MUSTACHELISTA,
						$.extend(
								{},
								{
									"linhas" :  mustache,
								},
								i3GEOF.etiqueta.DICIONARIO
						)
				);
				$i("i3GEOetiquetalistai").innerHTML = ins;

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
			itembuscarapida = "",
			inputs = $i("i3GEOetiquetalistai").getElementsByTagName("input"),
			i,
			it,
			n = inputs.length;
		for (i=0;i<n; i++){
			it = inputs[i];
			if (it.checked === true && it.name === "etiquetaTip"){
				tips.push(it.value);
			}
			if (it.checked === true && it.name === "identifica"){
				itens.push(it.value);
			}
			if (it.name === "itensdesc"){
				itensdesc.push(it.value);
			}
			if (it.name === "itenslink"){
				itenslink.push(it.value);
			}
			if (it.name === "itembuscarapida"){
				itembuscarapida = it.value;
			}
		}
		return([tips,itens,itensdesc,itenslink,itembuscarapida]);
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
				+ i3GEOF.etiqueta.tema
				+ "&tips="+lista[0].toString(",")
				+ "&itens="+lista[1].toString(",")
				//+ "&itensdesc="+i3GEO.util.base64encode(lista[2].toString(","))
				//+ "&itenslink="+i3GEO.util.base64encode(lista[3].toString(","))
				+ "&itensdesc="+lista[2].toString(",")
				+ "&itenslink="+lista[3].toString(",")
				+ "&itembuscarapida="+lista[4];
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
			p = i3GEO.configura.locaplic+"/ferramentas/etiqueta/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=removeEtiquetas&tema="+i3GEOF.etiqueta.tema;
			cp.set_response_type("JSON");
			cp.call(p,"etiqueta",temp);
		}catch(e){i3GEO.janela.tempoMsg("Erro: "+e);i3GEOF.etiqueta.aguarde.visibility = "hidden";}
	}
};