/*
Title: Filtra tema

Adiciona ou modifica o filtro de um tema. O filtro restringe quais elementos s&atilde;o renderizados e baseiam-se em regras
aplicadas sobre a tabela de atributos

Veja:

<i3GEO.tema.dialogo.filtro>

Arquivo:

i3geo/ferramentas/filtro/index.js.php

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
Classe: i3GEOF.filtro
*/
i3GEOF.filtro = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	 * Variavel: tema
	 *
	 * Tema que ser&aacute; utilizado
	 *
	 * Type: {string}
	 */
	tema : i3GEO.temaAtivo,
	/*
	Variavel: comboTemas

	Armazena o combo com os itens do tema
	*/
	comboTemas: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.filtro.dicionario);
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv,modoCalculadora,idRetorno){
		if(modoCalculadora === undefined){
			modoCalculadora = false;
		}
		if(modoCalculadora === false){
			i3GEO.janela.comboCabecalhoTemas("i3GEOFfiltroComboCabeca","i3GEOFfiltroComboCabecaSel","filtro","ligadosComTabela");
			if(i3GEOF.filtro.tema === ""){
				$i(iddiv).innerHTML = "";
				return;
			}
		}
		try{
			$i(iddiv).innerHTML += i3GEOF.filtro.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia1","i3GEOfiltroguia");
			if(modoCalculadora === false){
				//eventos das guias
				$i("i3GEOfiltroguia1").onclick = function(){
					i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia1","i3GEOfiltroguia");
				};
				$i("i3GEOfiltroguia2").onclick = function(){
					i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia2","i3GEOfiltroguia");
					i3GEOF.filtro.pegaFiltro();
				};
				$i("i3GEOfiltroguia3").onclick = function(){
					i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia3","i3GEOfiltroguia");
					i3GEOF.filtro.aplicaFiltro("sim");
				};
				b = new YAHOO.widget.Button(
					"i3GEOfiltrobotao2",
					{onclick:{fn: i3GEOF.filtro.limpaFiltro}}
				);
				b.addClass("rodar150");

				i3GEO.util.mensagemAjuda("i3GEOfiltromen1",$i("i3GEOfiltromen1").innerHTML);
			}
			else{
				//esconde a opcao de escolher guia
				$i("i3GEOfiltroguiasYUI").style.display = "none";
				$i("i3GEOfiltromen1").style.display = "none";
				$i("i3GEOfiltrobotao2").style.display = "none";
			}
			var b = new YAHOO.widget.Button(
				"i3GEOfiltrobotao1",
				{onclick:{fn: function(){i3GEOF.filtro.aplicaFiltro("nao",modoCalculadora,idRetorno);}}}
			);
			b.addClass("rodar150");
			//
			//pega a lista de itens e chama a fun&ccedil;&atilde;o de montagem das op&ccedil;&otilde;es de cria&ccedil;&atilde;o do filtro
			//
			i3GEO.util.comboItens(
				"none",
				i3GEOF.filtro.tema,
				function(retorno){
					i3GEOF.filtro.comboTemas = retorno.dados;
					i3GEOF.filtro.adicionaLinhaFiltro();
				}
			);
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
		var ins = Mustache.render(i3GEOF.filtro.MUSTACHE, i3GEOF.filtro.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

	A opcao modoCalculadora (boolean) aplica o filtro em um elemento ID e nao aplica ao tema
	Nesse modo e necessario indicar o id do elemento que recebera o filtro
	*/
	iniciaJanelaFlutuante: function(modoCalculadora,idRetorno){
		var janela,divid,temp,titulo = "";
		if(modoCalculadora === undefined){
			modoCalculadora = false;
		}
		if($i("i3GEOF.filtro")){
			i3GEOF.filtro.inicia("i3GEOF.filtro_corpo");
			return;
		}
		//cria a janela flutuante
		if(modoCalculadora === false){
			titulo = "<span class='i3GEOiconeFerramenta i3GEOiconeFiltro'></span><div  id='i3GEOFfiltroComboCabeca' class='comboTemasCabecalho'>   ------</div><div class='i3GeoTituloJanela'>"+$trad("t29")+"<a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=38' ><b> </b></a></div>";
		}
		janela = i3GEO.janela.cria(
			"580px",
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.filtro",
			false,
			"hd",
			"",
			"",
			"",
			true
		);
		divid = janela[2].id;
		i3GEOF.filtro.aguarde = $i("i3GEOF.filtro_imagemCabecalho").style;
		$i("i3GEOF.filtro_corpo").style.backgroundColor = "white";
		i3GEOF.filtro.inicia(divid,modoCalculadora,idRetorno);
		if(modoCalculadora === false){
			temp = function(){
				i3GEO.eventos.removeEventos("ATUALIZAARVORECAMADAS",['i3GEO.janela.comboCabecalhoTemas("i3GEOFfiltroComboCabeca","i3GEOFfiltroComboCabecaSel","filtro","ligadosComTabela")']);
			};
			YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		}
	},
	/*
	Function: adicionaLinhaFiltro

	Adiciona uma nova linha de filtro
	*/
	adicionaLinhaFiltro: function(){
		var add,xis,interrogacao,operador,conector,valor,ntb,ntr,ntad,ntd,ntd1,ntd2,ntd3,ntd4,ntd5,tabela;
		try{
			add = document.createElement("img");
			add.src = i3GEO.configura.locaplic+'/imagens/oxygen/16x16/list-add.png';
			add.style.cursor="pointer";
			add.onclick = function()
			{i3GEOF.filtro.adicionaLinhaFiltro();};

			xis = document.createElement("img");
			xis.src = i3GEO.configura.locaplic+'/imagens/oxygen/16x16/edit-delete.png';
			xis.style.cursor="pointer";
			xis.onclick = function(){
				var p = this.parentNode.parentNode.parentNode,
					i;
				for (i = 0; i < p.childNodes.length;i++)
				{p.removeChild(p.childNodes[i]);}
			};

			interrogacao = document.createElement("img");
			interrogacao.src = i3GEO.configura.locaplic+'/imagens/oxygen/16x16/format-line-spacing-normal.png';
			interrogacao.title= $trad('mostraValor',i3GEOF.filtro.dicionario);
			interrogacao.style.cursor="pointer";
			interrogacao.style.marginLeft="5px";
			interrogacao.onclick = function(){
				var obj,
				itemTema;
				obj = (this.parentNode.parentNode.getElementsByTagName("input"))[0];
				itemTema = (this.parentNode.parentNode.getElementsByTagName("select"))[0].value;
				i3GEO.util.comboValoresItem(
					"i3GEOfiltrocbitens",
					i3GEOF.filtro.tema,
					itemTema,
					function(retorno){
						$i("i3GEOfiltrovalores").innerHTML = "<br><p class=paragrafo >" +
							$trad('selecionaValor',i3GEOF.filtro.dicionario) +
							":<div class='styled-select'>" +
							retorno.dados+"</div>";
						if ($i("i3GEOfiltrocbitens")){
							$i("i3GEOfiltrocbitens").onchange = function()
							{obj.value = this.value;};
						}
					},
					"i3GEOfiltrovalores",
					"display:block"
				);
			};
			operador = "&nbsp;<div class='styled-select150' style='margin-left:5px;position:relative;top:-7px;'><select>";
			operador += "<option value='='>"+$trad('igual',i3GEOF.filtro.dicionario)+"</option>";
			operador += "<option value='!='>dif</option>";
			operador += "<option value='<'>"+$trad('menor',i3GEOF.filtro.dicionario)+"</option>";
			operador += "<option value='>'>"+$trad('maior',i3GEOF.filtro.dicionario)+"</option>";
			operador += "<option value='<='><=</option>";
			operador += "<option value='>='>>=</option>";
			operador += "<option value='in'>in</option>";
			operador += "<option value='ilike'>like (Postgis)</option>";
			operador += "<option value='not ilike'>not like (Postgis)</option>";
			operador += "<option value='~='>regExp</option></select></div>";

			conector = "&nbsp;<div class='styled-select' style='width:30px;margin-left:5px;position:relative;top:-7px;' ><select>";
			conector += "<option value='and'>"+$trad('e',i3GEOF.filtro.dicionario)+"</option>";
			conector += "<option value='or'>"+$trad('ou',i3GEOF.filtro.dicionario)+"</option>";
			conector += "<option value='not'>"+$trad('nao',i3GEOF.filtro.dicionario)+"</option></select></div>";

			valor = document.createElement("div");
			valor.className = 'i3geoForm150 i3geoFormIconeEdita';
			valor.style.marginLeft="5px";
			valor.innerHTML = "<input type=text value='' />";

			ntb = document.createElement("tbody");
			ntr = document.createElement("tr");
			ntad = document.createElement("td");
			ntad.appendChild(add);
			ntr.appendChild(ntad);

			ntd = document.createElement("td");
			ntd.appendChild(xis);
			ntr.appendChild(ntd);

			ntd1 = document.createElement("td");
			ntd1.innerHTML = "<div class='styled-select150' style='margin-left:5px;'>"+i3GEOF.filtro.comboTemas+"</div>";
			ntr.appendChild(ntd1);

			ntd2 = document.createElement("td");
			ntd2.innerHTML = operador;
			ntr.appendChild(ntd2);

			ntd3 = document.createElement("td");
			ntd3.appendChild(valor);
			ntr.appendChild(ntd3);

			ntd4 = document.createElement("td");
			ntd4.appendChild(interrogacao);
			ntr.appendChild(ntd4);

			ntd5 = document.createElement("td");
			ntd5.innerHTML = conector;
			ntr.appendChild(ntd5);
			ntb.appendChild(ntr);
			tabela = $i("i3GEOfiltroparametros");
			tabela.appendChild(ntb);
		}
		catch(e){i3GEO.janela.tempoMsg("Erro: "+e);}
	},
	/*
	Function: pegaFiltro

	Pega o filtro atual de um tema

	Veja:

	<PEGAFILTRO>
	*/
	pegaFiltro: function(){
		var p = i3GEO.configura.locaplic+"/ferramentas/filtro/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=pegafiltro&tema="+i3GEOF.filtro.tema,
			cp = new cpaint(),
			temp = function(retorno){
				if(retorno.data !== undefined)
				{$i("i3GEOfiltrofiltro").value = retorno.data;}
			};
		cp.set_response_type("JSON");
		cp.call(p,"pegaFiltro",temp);
	},
	/*
	Function: limpaFiltro

	Limpa o filtro de um tema

	Veja:

	<INSEREFILTRO>
	*/
	limpaFiltro: function(){
		try{
			if(i3GEOF.filtro.aguarde.visibility === "visible")
			{return;}
			i3GEOF.filtro.aguarde.visibility = "visible";
			var p = i3GEO.configura.locaplic+"/ferramentas/filtro/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=inserefiltro&tema="+i3GEOF.filtro.tema+"&filtro=",
				cp = new cpaint(),
				temp = function(retorno){
					i3GEOF.filtro.aguarde.visibility = "hidden";
					if(i3GEO.Interface.ATUAL === "padrao")
					{i3GEO.atualiza(retorno);}
					i3GEO.Interface.atualizaTema(retorno,i3GEOF.filtro.tema);
				};
			cp.set_response_type("JSON");
			cp.call(p,"insereFiltro",temp);
		}
		catch(e){i3GEO.janela.tempoMsg("Erro: "+e);}
	},
	/*
	Function: aplicaFiltro

	Aplica um filtro ao tema

	Veja:

	<INSEREFILTRO>

	Parametro:

	testa {String} - sim|nao indica a realiza&ccedil;&atilde;o de teste ou aplica&ccedil;&atilde;o final do filtro
	*/
	aplicaFiltro: function(testa,modoCalculadora,idRetorno){
		if(arguments.length === 0)
		{testa = "nao";}
		if(i3GEOF.filtro.aguarde.visibility === "visible")
		{return;}
		try{
			i3GEOF.filtro.aguarde.visibility = "visible";
			var filtro = "",
				re,p,cp,temp;
			if( ($i("i3GEOfiltrofiltro").value !== "") &&($i("i3GEOfiltroguia2obj").style.display === "block")){
				filtro = $i("i3GEOfiltrofiltro").value;
				re = new RegExp("'","g");
				filtro = filtro.replace(re,"|");
				filtro = filtro.replace(re,"");
				filtro = filtro.replace(re,"");
			}
			else{
				filtro = i3GEOF.filtro.formataMapserver();
				re = new RegExp("'","g");
				filtro = filtro.replace(re,"|");
			}
			if(modoCalculadora === true){
				i3GEOF.filtro.aguarde.visibility = "hidden";
				$i(idRetorno).value = i3GEOF.filtro.formataMapserver();
			}
			else{
				p = i3GEO.configura.locaplic+"/ferramentas/filtro/exec.php?base64=sim&g_sid="+i3GEO.configura.sid+"&funcao=inserefiltro";
				cp = new cpaint();
				cp.set_response_type("JSON");
				cp.set_transfer_mode('POST');
				if (testa.toLowerCase() === "sim"){
					temp = function(retorno){
						$i("i3GEOfiltroguia3obj").innerHTML = "<img src="+retorno.data+" />";
						i3GEOF.filtro.aguarde.visibility = "hidden";
					};
				}
				else{
					temp = function(retorno){
						if(i3GEO.Interface.ATUAL === "padrao")
						{i3GEO.atualiza(retorno);}
						i3GEO.Interface.atualizaTema(retorno,i3GEOF.filtro.tema);
						i3GEOF.filtro.aguarde.visibility = "hidden";
					};
				}
				cp.call(p,"insereFiltro",temp,"tema="+i3GEOF.filtro.tema,"filtro="+i3GEO.util.base64encode(filtro),"testa="+testa);
			}
		}
		catch(e){
			i3GEO.janela.tempoMsg("Erro: "+e);
			i3GEOF.filtro.aguarde.visibility = "hidden";
		}
	},
	formataMapserver : function(){
		var filtro = "",g,ipt,i,nos,s,itemsel,operador,valor;
		g = $i("i3GEOfiltroparametros");
		ipt = g.getElementsByTagName("tr");
		if (ipt.length > 1){
			for (i=1;i<ipt.length; i++){
				nos = ipt[i].childNodes;
				s = nos[2].getElementsByTagName("select");
				itemsel = s[0].value;
				s = nos[3].getElementsByTagName("select");
				operador = s[0].value;
				s = nos[4].getElementsByTagName("input");
				valor = s[0].value;
				s = nos[6].getElementsByTagName("select");
				conector = s[0].value;
				if (valor*1){
					filtro = filtro + "(["+itemsel+"] "+operador+" "+valor+")";
				}
				else{
					filtro = filtro + "('["+itemsel+"]' "+operador+" '"+valor+"')";
				}
				if ((i + 1) != ipt.length){
					filtro = filtro + conector;
				}
				else{
					filtro = "("+filtro+")";
				}
			}
		}
		return filtro;
	}
};