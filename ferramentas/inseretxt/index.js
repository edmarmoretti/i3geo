/*
Title: Insere textos

Inclui um texto no mapa no ponto clicado pelo usu&aacute;rio

Veja:

<i3GEO.mapa.dialogo.cliqueTexto>

Arquivo:

i3geo/ferramentas/inseretxt/index.js.php

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
Classe: i3GEOF.inseretxt
*/
i3GEOF.inseretxt = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	Variavel: contaPontos

	Conta quantos pontos o usu&aacute;rio clicou na adi&ccedil;&atilde;o de um conector
	*/
	contaPontos: 0,
	/*
	Variavel: pontoi

	Primeiro ponto do conector clicado no mapa em DD
	*/
	pontoi: "0,0",
	/*
	Variavel: parDefault

	Par�metros padr&atilde;o utilizados para formatar o texto
	*/
	parDefault: "&inserefeature&&position=MS_UR&partials=1&offsetx=0&offsety=0&minfeaturesize=auto&mindistance=auto&force=0&shadowsizex=1&shadowsizey=1&cor=0 0 0&sombray=1&sombrax=1&angulo=0&tamanho=8&fonte=bitmap&fundo=off&sombra=off&outlinecolor=off&shadowcolor=off&wrap=",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.inseretxt.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.inseretxt.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOinseretxtguia1","i3GEOinseretxtguia");
			//eventos das guias
			$i("i3GEOinseretxtguia1").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinseretxtguia1","i3GEOinseretxtguia");
			};
			$i("i3GEOinseretxtguia2").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinseretxtguia2","i3GEOinseretxtguia");
				i3GEO.util.comboTemas(
					"i3GEOinseretxtComboTemas",
					function(retorno){
				 		$i("i3GEOinseretxtDivComboTemas").innerHTML = retorno.dados;
				 		$i("i3GEOinseretxtDivComboTemas").style.display = "block";
				 		if ($i("i3GEOinseretxtComboTemas")){
				 			$i("i3GEOinseretxtComboTemas").onchange = function(){
				 				$i("i3GEOinseretxtDivComboItens").innerHTML = "<p class=paragrafo style=color:red >"+$trad('msgAguarde',i3GEOF.inseretxt.dicionario)+"...</p>";
								i3GEO.mapa.ativaTema($i("i3GEOinseretxtComboTemas").value);
				 				//combodeitens
								i3GEO.util.comboItens(
									"i3GEOinseretxtComboItens",
									i3GEO.temaAtivo,
									function(retorno){
							 			$i("i3GEOinseretxtDivComboItens").innerHTML = "<p class=paragrafo >"+retorno.dados+"</p>";
									}
								);
				 			};
						}
						if(i3GEO.temaAtivo !== ""){
							$i("i3GEOinseretxtComboTemas").value = i3GEO.temaAtivo;
							$i("i3GEOinseretxtComboTemas").onchange.call();
						}
					},
					"i3GEOinseretxtDivComboTemas",
					"",
					false,
					"ligados",
					"display:block"
				);
			};
			$i("i3GEOinseretxtguia3").onclick = function(){
				//i3GEO.guias.mostraGuiaFerramenta("i3GEOinseretxtguia3","i3GEOinseretxtguia");
				i3GEO.util.scriptTag(
					i3GEO.configura.locaplic+"/ferramentas/opcoes_label/index.js",
					"i3GEOF.proplabel.criaJanelaFlutuante(true)",
					"i3GEOFproplabel",
					false
				);
			};
			i3GEO.util.mensagemAjuda("i3GEOinseretxtmen1",$i("i3GEOinseretxtmen1").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOinseretxtmen2",$i("i3GEOinseretxtmen2").innerHTML);
			//i3GEO.util.comboFontes("i3GEOinseretxtListaFonte","i3GEOinseretxtDivListaFonte");
			i3GEOF.inseretxt.ativaFoco();
		}
		catch(erro){
			i3GEO.janela.tempoMsg(erro);
		}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.inseretxt.MUSTACHE, i3GEOF.inseretxt.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.inseretxt.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.inseretxt");
		};
		titulo = $trad("d25t")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=83' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"360px",
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.inseretxt",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.inseretxt.aguarde = $i("i3GEOF.inseretxt_imagemCabecalho").style;
		$i("i3GEOF.inseretxt_corpo").style.backgroundColor = "white";
		i3GEOF.inseretxt.inicia(divid);
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.inseretxt.cria()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.inseretxt.cria()");}
		i3GEO.eventos.cliquePerm.desativa();
		temp = function(){
			i3GEO.eventos.cliquePerm.ativa();
			i3GEO.barraDeBotoes.ativaPadrao();
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.inseretxt.cria()");
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEO.eventos.cliquePerm.desativa();
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"crosshair",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
		i3GEO.barraDeBotoes.ativaIcone("textofid");
		g_tipoacao='';
		g_operacao='';
		if($i("img")){
			$i("img").style.cursor="pointer";
		}
	},
	/*
	Function: corj

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: pegaPar

	Pega os parametros para montar a chamada ajax que cria ou testa a topon&iacute;mia
	*/
	pegaPar: function(){
		try{
			var par = i3GEOF.proplabel.pegaPar();
			i3GEOF.inseretxt.parDefault = par;
		}
		catch(e){
			par = i3GEOF.inseretxt.parDefault;
		}
		return par;
	},
	/*
	Function: cria

	Cria um tema e insere o texto

	Veja:

	<i3GEO.php.identificaunico>
	*/
	cria: function(){
		try{
			if(i3GEOF.inseretxt.aguarde.visibility === "visible")
			{return;}
			if($i("i3GEOinseretxtguia3obj").style.display === "block"){
				i3GEO.janela.tempoMsg($trad('ativaGuia',i3GEOF.inseretxt.dicionario));
				return;
			}
			i3GEOF.inseretxt.aguarde.visibility = "visible";
			var temp,tema,item;
			//
			//de onde vem o texto
			//
			if($i("i3GEOinseretxtguia1obj").style.display === "block"){
				i3GEOF.inseretxt.iniciaInsere();
			}
			else{
				temp = function(retorno){
					if(retorno.data[0] == " "){
						i3GEO.janela.tempoMsg($trad('msgNadaEncontrado',i3GEOF.inseretxt.dicionario));
						i3GEOF.inseretxt.aguarde.visibility = "hidden";
						return;
					}
					$i("i3GEOinseretxttexto").value = retorno.data;
					i3GEOF.inseretxt.iniciaInsere();
				};
				tema = $i("i3GEOinseretxtComboTemas").value;
				item = $i("i3GEOinseretxtComboItens").value;
				if(i3GEOF.inseretxt.contaPontos == 0)
				{i3GEO.php.identificaunico(temp,objposicaocursor.ddx+","+objposicaocursor.ddy,tema,item);}
				else{
					i3GEOF.inseretxt.iniciaInsere();
				}

			}
		}catch(e){i3GEO.janela.tempoMsg("Erro: "+e);i3GEOF.inseretxt.aguarde.visibility = "hidden";}
	},
	iniciaInsere: function(){
		var texto = $i("i3GEOinseretxttexto").value;
		if(texto === ""){
			i3GEOF.inseretxt.aguarde.visibility = "hidden";
			return;
		}
		else{
			if($i("i3GEOinseretxttextoconector").checked){
				if(i3GEOF.inseretxt.contaPontos == 0){
					i3GEOF.inseretxt.contaPontos = 1;
					i3GEOF.inseretxt.pontoi = objposicaocursor.ddx+" "+objposicaocursor.ddy;
					i3GEOF.inseretxt.aguarde.visibility = "hidden";
					i3GEO.janela.tempoMsg($trad('clicaFimConcetor',i3GEOF.inseretxt.dicionario));
					return;
				}
				if(i3GEOF.inseretxt.contaPontos == 1){
					i3GEOF.inseretxt.insere(texto);
					i3GEOF.inseretxt.insereConector(i3GEOF.inseretxt.pontoi+" "+objposicaocursor.ddx+" "+objposicaocursor.ddy,texto);
					i3GEOF.inseretxt.contaPontos = 0;
					return;
				}
			}
			else
			{i3GEOF.inseretxt.insere(texto);}
		}
	},
	/*
	Function: insere

	Insere um texto no mapa

	Veja:

	<INSEREFEATURE>

	Parametro:

	texto {String}
	*/
	insere: function(texto){
		var monta,par,p,nometema,temp,cp;
		monta = function(){
		 	i3GEOF.inseretxt.aguarde.visibility = "hidden";
		 	i3GEO.atualiza();
		};
		temp = Math.random() + "b";
		temp = temp.split(".");
		nometema = "pin"+temp[1];
		par = i3GEOF.inseretxt.pegaPar();
		p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+
				"&funcao=inserefeature&"+par+"&pin="+nometema+"&tipo=ANNOTATION&texto="+texto+"&xy="+objposicaocursor.ddx+" "+objposicaocursor.ddy;
		if(par === false){
			i3GEOF.inseretxt.aguarde.visibility = "hidden";
			return;
		}
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"inserefeature",monta);
	},
	/*
	Function: insereConector

	Insere um conector de textos

	Veja:

	<INSEREFEATURE>

	Parametro:

	xy {string} - lista de pontos
	*/
	insereConector: function(xy,texto){
		var monta,par,p,nometema,temp;
		monta = function(){
		 	i3GEOF.inseretxt.aguarde.visibility = "hidden";
		 	i3GEO.atualiza();
		};
		temp = Math.random() + "b";
		temp = temp.split(".");
		nometema = "pin"+temp[1];
		par = i3GEOF.inseretxt.pegaPar();
		if($i("i3GEOproplabeltamanho_c")){
			par += "&tamanho="+$i("i3GEOproplabeltamanho_c").value;
			par += "&cor="+$i("i3GEOproplabelfrente_c").value;
		}
		else{
			par += "&tamanho=1";
			par += "&cor=0 0 0";
		}
		p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+
				"&funcao=inserefeature&"+par+"&pin="+nometema+"&tipo=LINE&texto="+texto+" (conector)&xy="+xy;
		if(par === false){
			i3GEOF.inseretxt.aguarde.visibility = "hidden";
			return;
		}
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"inserefeature",monta);
	}
};