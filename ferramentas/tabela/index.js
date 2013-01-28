
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Tabela de atributos

Mostra a tabela de atributos de um tema com op&ccedil;&otilde;es de sele&ccedil;&atilde;o, estat&iacute;stica, gr&aacute;ficos e relat&oacute;rios.
O tema utilizado &eacute; o que estiver definido em i3GEO.temaAtivo

Veja:

<i3GEO.tema.dialogo.tabela>

Arquivo:

i3geo/ferramentas/tabela/index.js.php

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
Classe: i3GEOF.tabela
*/
i3GEOF.tabela = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	Variavel: tipoDeGrafico

	Guarda o tipo de grafico escolhido pelo usu&aacute;rio
	*/
	tipoDeGrafico: "",
	/*
	Variavel: tema

	Tema que ser&aacute; utilizado

	Type:
	{string}
	*/
	tema: i3GEO.temaAtivo,
	/*
	Variavel: registros

	Guarda os &iacute;ndices dos registros escolhidos na tabela

	Type:
	{array}
	*/
	registros: [],
	/*
	Variavel: parametros

	Parametros utilizados para o gr&aacute;fico.

	&Eacute; definido em fun&ccedil;&atilde;o do tipo de gr&aacute;fico escolhido

	Type:
	{string}
	*/
	parametros: "",
	/*
	Variable: nomeArquivoGr

	Nome do arquivo gerado com os dados para o gr&aacute;fico
	*/
	nomeArquivoGr: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.tabela.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.tabela.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/tabela/dicionario.js",
				"i3GEOF.tabela.iniciaJanelaFlutuante()",
				"i3GEOF.tabela.dicionario_script"
			);
		}
		else{
			i3GEOF.tabela.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		i3GEO.janela.comboCabecalhoTemas("i3GEOFtabelaComboCabeca","i3GEOFtabelaComboCabecaSel","tabela","ligadosComTabela");
		if(i3GEO.temaAtivo === ""){
			$i(iddiv).innerHTML = '<p style="position: relative; top: 0px; font-size: 15px; text-align: left;">'+$trad("x33")+'</p>';
			return;
		}
		try{
			$i(iddiv).innerHTML = i3GEOF.tabela.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOtabelaguia1","i3GEOtabelaguia");
			//eventos das guias
			$i("i3GEOtabelaguia6").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOtabelaguia6","i3GEOtabelaguia");};
			$i("i3GEOtabelaguia1").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOtabelaguia1","i3GEOtabelaguia");};
			$i("i3GEOtabelaguia3").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOtabelaguia3","i3GEOtabelaguia");
				if(!$i("i3GEOtabelaComboItensGuia3"))
				{i3GEOF.tabela.comboItensEstat();}
			};
			$i("i3GEOtabelaguia4").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOtabelaguia4","i3GEOtabelaguia");
				i3GEOF.tabela.t0();
			};
			//relatorio
			$i("i3GEOtabelaguia5").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOtabelaguia5","i3GEOtabelaguia");
				i3GEO.util.checkItensEditaveis(
					i3GEOF.tabela.tema,
					function(retorno){
						if (retorno.tipo === "dados")
						{$i("i3GEOtabelaitensrelatorio").innerHTML = retorno.dados;}
					},
					"i3GEOtabelaitensrelatorio",
					"320px",
					"",
					"sim"
				);
				i3GEO.util.comboItens(
					"i3GEOtabelaagrupaItem",
					i3GEOF.tabela.tema,
					function(retorno){
		 				if(retorno.tipo === "erro"){
		 					$i("i3GEOtabelaagrupamento").innerHTML = "<br><br><span style='color:red'>"+$trad(2,i3GEOF.tabela.dicionario)+"</span><br><br>";
		 				}
		 				else{
		 					$i("i3GEOtabelaagrupamento").innerHTML = retorno.dados;
		 				}
					},
					"i3GEOtabelaagrupamento",
					""
				);
			};
			new YAHOO.widget.Button(
				"i3GEOtabelabotao2",
				{onclick:{fn: i3GEOF.tabela.ativaSelecao}}
			);
			new YAHOO.widget.Button(
				"i3GEOtabelabotao3",
				{onclick:{fn: i3GEOF.tabela.limpaSelecao}}
			);
			new YAHOO.widget.Button(
				"i3GEOtabelabotao6",
				{onclick:{fn: i3GEOF.tabela.criaNovoTema}}
			);
			new YAHOO.widget.Button(
				"i3GEOtabelabotaoLista",
				{onclick:{fn: i3GEOF.tabela.pegaRegistros}}
			);
			$i("i3GEOtabelabotaoLista-button").style.minHeight = "1em";
			$i("i3GEOtabelabotaoLista-button").style.padding = "0px 15px";
			$i("i3GEOtabelabotaoLista-button").style.lineHeight = "1.2";
			new YAHOO.widget.Button(
				"i3GEOtabelabotao4",
				{onclick:{fn: i3GEOF.tabela.estatistica}}
			);

			new YAHOO.widget.Button(
				"i3GEOtabelabotao7",
				{onclick:{fn: i3GEOF.tabela.relatorioTabela}}
			);
			new YAHOO.widget.Button(
				"i3GEOtabelabotao5",
				{onclick:{fn: i3GEOF.tabela.relatorioTexto}}
			);

			//new YAHOO.widget.Button("i3GEOtabelabotao7");

			i3GEO.util.mensagemAjuda("i3GEOtabelamen1",$i("i3GEOtabelamen1").innerHTML);

			if (i3GEO.parametros.r.toLowerCase() !== "sim")
			{$i("i3GEOtabelaguia4obj").innerHTML = $trad("x22");}
			i3GEOF.tabela.pegaRegistros();
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
		var ins = '';//<p class="paragrafo" >
		ins += '<div id=guiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">';
		ins += '<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">';
		ins += '	<li><a href="#ancora"><em><div id="i3GEOtabelaguia6" style="text-align:center;left:0px;" ><img class="ticPropriedades2" style="height:14px" title="'+$trad("p13")+'" src="'+i3GEO.configura.locaplic+'/imagens/visual/default/branco.gif"></div></em></a></li>';
		ins += '	<li><a href="#ancora"><em><div id="i3GEOtabelaguia1" style="text-align:center;left:0px;" >'+$trad(3,i3GEOF.tabela.dicionario)+'</div></em></a></li>';
		ins += '	<li><a href="#ancora"><em><div id="i3GEOtabelaguia3" style="text-align:center;left:0px;" >'+$trad(4,i3GEOF.tabela.dicionario)+'</div></em></a></li>';
		ins += '	<li><a href="#ancora"><em><div id="i3GEOtabelaguia4" style="text-align:center;left:0px;" >'+$trad("t37")+'</div></em></a></li>';
		ins += '	<li><a href="#ancora"><em><div id="i3GEOtabelaguia5" style="text-align:center;left:0px;" >'+$trad(5,i3GEOF.tabela.dicionario)+'</div></em></a></li>';
		ins += '</ul>';
		ins += '</div><br>';
		ins += '	<div id=i3GEOtabelaresultadotab style="background-color:#F2F2F2;position:relative;top:5px;left:0px"></div>';
		ins += '	<div id=i3GEOtabelaguia6obj style="width:99%">';
		ins += '		<table summary="" class=lista2 >';
		ins += '		<tr>';
		ins += '			<td><input style="cursor:pointer;border:0px solid white;" onclick="i3GEOF.tabela.pegaRegistros()" type=checkbox id=i3GEOtabelatiporeg CHECKED /></td>';
		ins += '			<td>'+$trad(6,i3GEOF.tabela.dicionario)+'</td>';
		ins += '		</tr>';
		ins += '		<tr>';
		ins += '			<td><input style="cursor:pointer;border:0px solid white;" type=checkbox onclick="i3GEOF.tabela.ativaAutoAtualiza(this)"  /></td>';
		ins += '			<td>'+$trad(7,i3GEOF.tabela.dicionario)+'</td>';
		ins += '		</tr>';
		ins += '		<tr>';
		ins += '			<td><input style="cursor:pointer;border:0px solid white;" onclick="i3GEOF.tabela.pegaRegistros()" type=checkbox id=i3GEOtabelatipolista /></td>';
		ins += '			<td>'+$trad(8,i3GEOF.tabela.dicionario)+'</td>';
		ins += '		</tr>';
		ins += '		<tr>';
		ins += '			<td><input style="cursor:pointer;border:0px solid white;" onclick="i3GEOF.tabela.pegaRegistros()" type=checkbox id=i3GEOtabelalegenda /></td>';
		ins += '			<td>'+$trad(9,i3GEOF.tabela.dicionario)+'</td>';
		ins += '		</tr>';
		ins += '		</table>';
		ins += '		</div>';
		ins += '	<div id=i3GEOtabelaguia1obj style="width:99%">';
		ins += '		<div id=i3GEOtabelacombot style="position:relative;top:5px;left:0px;display:none;">';
		ins += '		</div>';
		ins += '		<input title="'+$trad(10,i3GEOF.tabela.dicionario)+'" id=i3GEOtabelabotao2 size=25 type=button value="'+$trad(11,i3GEOF.tabela.dicionario)+'" />';
		ins += '		<input title="'+$trad(12,i3GEOF.tabela.dicionario)+'" id=i3GEOtabelabotao3 size=25  type=button value="'+$trad(13,i3GEOF.tabela.dicionario)+'"/>';
		ins += '		<input title="'+$trad(14,i3GEOF.tabela.dicionario)+'" id=i3GEOtabelabotao6 size=30  type=button value="'+$trad(15,i3GEOF.tabela.dicionario)+'"/>';
		ins += '		<div id=i3GEOtabelacontador style="background-color:rgb(240,240,240);width:100%;position:relative;top:15px;left:0px;text-align:left">';
		ins += '			'+$trad(16,i3GEOF.tabela.dicionario)+' <img style=cursor:pointer onclick="i3GEOF.tabela.menos()" src="'+i3GEO.configura.locaplic+'/imagens/minus.gif" />';
		ins += $inputText("","","i3GEOtabelainicio","",5,"1");
		ins += '			'+$trad(17,i3GEOF.tabela.dicionario)+"&nbsp;";
		ins += $inputText("","","i3GEOtabelafim","",5,"20");
		ins += '			<img style=cursor:pointer onclick="i3GEOF.tabela.mais()" src="'+i3GEO.configura.locaplic+'/imagens/plus.gif" />';
		ins += '			<input title="'+$trad(18,i3GEOF.tabela.dicionario)+'" id=i3GEOtabelabotaoLista size=25  type=button value="'+$trad(19,i3GEOF.tabela.dicionario)+'"/>';
		ins += '			<a href="#" onclick="i3GEOF.tabela.novaJanela()" >'+$trad(36,i3GEOF.tabela.dicionario)+'</a>';
		ins += '		</div>';
		ins += '		<div id=i3GEOtabelaregistros style="position:relative;top:20px;left:0px;text-align:left;">';
		ins += '		</div>';
		ins += '	</div>';
		ins += '	<div id=i3GEOtabelaguia3obj style="display:none;width:99%;left:0px" >';
		ins += '		<p class="paragrafo" >'+$trad(20,i3GEOF.tabela.dicionario)+': <span id=i3GEOtabelaitensGuia3 ></span>';
		ins += '		<p class="paragrafo" >'+$trad(21,i3GEOF.tabela.dicionario)+':';
		ins += $inputText("","","i3GEOtabelafiltro1","",5,"");
		ins += '		<p class="paragrafo" ><input id=i3GEOtabelabotao4 size=30  type=button value="'+$trad(22,i3GEOF.tabela.dicionario)+'"/>';
		ins += '		<div id="i3GEOtabelaoperacoes" class=digitar style="text-align:left;position:relative;top:15px;left:0px;"  >';
		ins += '		</div><br>';
		ins += '		<div id=i3GEOtabelamen1 style="position:relative;top:25px;left:0px;width:100%" >';
		ins += '			<p class="paragrafo" >'+$trad(23,i3GEOF.tabela.dicionario);
		ins += '		</div>';
		ins += '	</div>';
		ins += '	<div id=i3GEOtabelaguia4obj style="display:none;width:99%;left:0px">';
		ins += '		<div style="top:5px;left:0px;display:block;background-color:white;" id="i3GEOtabelaresultado" >';
		ins += '		</div>';
		ins += '	</div>';

		ins += '	<div id=i3GEOtabelaguia5obj style="width:99%;display:none">';
		ins += '		<p class="paragrafo" >'+$trad(24,i3GEOF.tabela.dicionario)+':';
		ins += '		<p class="paragrafo" ><div id=i3GEOtabelaitensrelatorio class=digitar style="text-align:left;overflow:auto;height:100px">';
		ins += '		</div><br>';
		ins += '		<p class="paragrafo" >'+$trad(25,i3GEOF.tabela.dicionario)+':';
		ins += '		<p class="paragrafo" ><div id=i3GEOtabelaagrupamento style="text-align:left;">';
		ins += '		</div>';
		ins += '		<p class="paragrafo" ><br><input style="cursor:pointer" type=checkbox id=i3GEOtabelacalculaarea />'+$trad(26,i3GEOF.tabela.dicionario);
		ins += '		<p class="paragrafo" ><input style="cursor:pointer" type=checkbox id=i3GEOtabelacalculaestat />'+$trad(27,i3GEOF.tabela.dicionario);
		ins += '		<p class="paragrafo" >'+$trad(28,i3GEOF.tabela.dicionario)+': ';
		ins += $inputText("","","i3GEOtabelaexcestat","",10,"");
		ins += '		<p class="paragrafo" ><input id=i3GEOtabelabotao7 size=30  type=button value="'+$trad(5,i3GEOF.tabela.dicionario)+'"/>';
		ins += '		<input id=i3GEOtabelabotao5 size=25  type=button value="'+$trad(29,i3GEOF.tabela.dicionario)+'"/>';
		ins += '		<form method=post style="display:none" id=i3GEOtabelarelatorio action="'+i3GEO.configura.locaplic+'/ferramentas/tabela/relatorio.php" target="_blank" >';
		ins += '			<input type=hidden id=i3GEOtabelaarearelh name=arearel value=nao />';
		ins += '			<input type=hidden id=i3GEOtabelastatrelh name=statrel value=nao />';
		ins += '			<input type=hidden id=i3GEOtabelatemarelh name=temarel value="" />';
		ins += '			<input type=hidden id=i3GEOtabelag_sidh name=g_sid value="" />';
		ins += '			<input type=hidden id=i3GEOtabelaitemagruparelh name=itemagruparel value="" />';
		ins += '			<input type=hidden id=i3GEOtabelaitensrelh name=itensrel value="" />';
		ins += '			<input type=hidden id=i3GEOtabelanomesrelh name=nomesrel value="" />';
		ins += '			<input type=hidden id=i3GEOtabelaordemrel name=ordemrel value="" />';
		ins += '			<input type=hidden id=i3GEOtabelaexcluirvalorh name=excluirvalor value="" />';
		ins += '			<input type=hidden id=i3GEOtabelatiporelh name=tiporel value="" />';
		ins += '		</form>';
		ins += '	</div>';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		if($i("i3GEOF.tabela")){
			i3GEOF.tabela.tema = i3GEO.temaAtivo;
			i3GEOF.tabela.inicia("i3GEOF.tabela_corpo");
			return;
		}
		cabecalho = function(){
			i3GEOF.tabela.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.tabela");
		};
		//cria a janela flutuante
		titulo = "<div  id='i3GEOFtabelaComboCabeca' class='comboTemasCabecalho'>   ------</div>&nbsp;&nbsp;&nbsp;"+$trad(1,i3GEOF.tabela.dicionario)+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=39' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"500px",
			"400px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.tabela",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.tabela_corpo").style.backgroundColor = "white";
		i3GEOF.tabela.aguarde = $i("i3GEOF.tabela_imagemCabecalho").style;
		i3GEOF.tabela.inicia(divid);
		temp = function(){
			if(i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth"){
				i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.tabela.pegaRegistros()");
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				google.maps.event.removeListener(tabelaDragend);
				google.maps.event.removeListener(tabelaZoomend);
			}
			if(i3GEO.Interface.ATUAL === "googleearth"){
				google.earth.removeEventListener(tabelaDragend);
			}
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search('i3GEO.janela.comboCabecalhoTemas("i3GEOFtabelaComboCabeca","i3GEOFtabelaComboCabecaSel","tabela","ligadosComTabela")') > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove('i3GEO.janela.comboCabecalhoTemas("i3GEOFtabelaComboCabeca","i3GEOFtabelaComboCabecaSel","tabela","ligadosComTabela")');}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		if(i3GEOF.tabela.tema !== "" && i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.tabela.tema) === "")
		{i3GEO.janela.tempoMsg($trad(30,i3GEOF.tabela.dicionario));}
		var i = $i("i3GEOF.tabela_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
	},
	/*
	Function: novaJanela

	Abre a tabela em uma nova janela que pode conviver com outras tabelas
	*/
	novaJanela: function(){
		if(typeof(i3GEO.vincularTabelas) === 'undefined'){
			i3GEO.vincularTabelas = {};
			i3GEO.vincularTabelas.janelas = [];
			i3GEO.vincularTabelas.colunas = {};
			i3GEO.vincularTabelas.colunasVazias = 3;
			i3GEO.vincularTabelas.atualiza = function(idtabela,objinput){
				var v = objinput.parentNode.parentNode.cloneNode(true),
					onde = $i("selecao_"+idtabela),
					ntab = i3GEO.vincularTabelas.janelas.length,
					valorcel="",i,temp,n,tabtempid,c,tabcomp,linhas,j,valor;
				n = onde.childNodes.length;
				for(i=0;i<n;i++){
					onde.removeChild(onde.firstChild);
				}
				//verifica se a coluna foi escolhida
				if(i3GEO.vincularTabelas.colunas[idtabela] == undefined || i3GEO.vincularTabelas.colunas[idtabela] === ""){
					i3GEO.janela.tempoMsg($trad(39,i3GEOF.tabela.dicionario));
				}
				else{
					//onde.appendChild(v);
					$i(idtabela+"_corpo").scrollTop = 0;
					//pega o valor da celula escolhida
					temp = v.getElementsByTagName("td");
					c =  i3GEO.vincularTabelas.colunas[idtabela];
					valorcel = temp[i3GEO.vincularTabelas.colunasVazias + c].innerHTML;
					valorcel = valorcel.trim();
					valorcel = valorcel.toLowerCase();
					//loop pelas tabelas
					for(i=0;i<ntab;i++){
						//verifica se a tabela existe
						tabtempid = i3GEO.vincularTabelas.janelas[i];
						if($i(tabtempid+"_corpo") && tabtempid != idtabela){
							onde = $i("selecao_"+tabtempid);
							//verifica se tem coluna escolhida
							c =  i3GEO.vincularTabelas.colunas[tabtempid];
							if(c !== undefined && c !== ""){
								//tabela com os dados da janela
								tabcomp = $i(tabtempid+"_corpo").getElementsByTagName("table")[1];
								//remove o conteudo do lugar onde o resultado sera mostrado
								temp = $i(tabtempid+"_corpo").getElementsByTagName("table")[0];
								n = temp.childNodes.length;
								for(i=0;i<n;i++){
									temp.removeChild(onde.firstChild);
								}
								//linhas da tabela
								linhas = tabcomp.getElementsByTagName("tr");
								//insere o cabecalho
								v = linhas[0].cloneNode(true);
								onde.appendChild(v);
								n = linhas.length;
								//loop nas linhas
								for(j=0;j<n;j++){
									valor = linhas[j].getElementsByTagName("td")[i3GEO.vincularTabelas.colunasVazias + c].innerHTML;
									valor = valor.trim();
									valor = valor.toLowerCase();
									if(valorcel == valor){
										v = linhas[j].cloneNode(true);
										onde.appendChild(v);
									}
								}
							}
						}

					}
				}
			};
			i3GEO.janela.tempoMsg($trad(37,i3GEOF.tabela.dicionario));
		}
		var janela = "",
			divid,
			cabecalho = function(){},
			id = YAHOO.util.Dom.generateId(),
			minimiza = function(){
				i3GEO.janela.minimiza(id);
			},
			titulo = "&nbsp;&nbsp;&nbsp;"+i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.tabela.tema).tema;
		janela = i3GEO.janela.cria(
			"420px",
			"200px",
			"",
			"",
			"",
			titulo,
			id,
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEO.vincularTabelas.janelas.push(id);
		i3GEO.vincularTabelas.colunas[id] = "";
		temp = function(retorno){
			i3GEOF.tabela.aguarde.visibility = "hidden";
			if (retorno.data !== undefined){
				var ins = [],
					i,
					vals,
					cor,
					j,
					n,
					imagem,
					i3GEOtabelalegenda = true;
				//cabecalho da tabela
				ins = "<table class=lista4 style='width:100%' id='selecao_"+id+"'></table><br>";
				ins += "<table class=lista8 style='width:100%'>";
				ins += "<tr><td></td><td></td><td></td>";
				n = retorno.data[0].itens.length;
				for (i=0;i<n;i++){
					ins += "<td style='background-color:yellow' ><input onclick='javascript:i3GEO.vincularTabelas.colunas[\""+id+"\"] = "+i+";' type=radio id=name='coluna_"+id+"_"+i+"' name='coluna_"+id+"' style='cursor:pointer;' /><br><b>"+retorno.data[0].alias[i]+"</b></td>";
				}
				ins += "</tr>";
				cor = "linha";
				n = retorno.data[1].registros.length;
				for (i=0;i<n;i++){
					ins += "<tr>";
					ins += "<td><input type=radio onclick='javascript:i3GEO.vincularTabelas.atualiza(\""+id+"\",this)' name='linha_"+id+"' style='cursor:pointer;' /></td>";
					ins += "<td>";
					if(retorno.data[1].registros[i].ext && retorno.data[1].registros[i].ext != ""){
						ins += "<img style=cursor:pointer onclick='i3GEO.navega.zoomExt(\"\",\"\",\"\",\""+retorno.data[1].registros[i].ext+"\")' src='"+i3GEO.configura.locaplic+"/imagens/o.gif' title='zoom' ids="+retorno.data[1].registros[i].indice+" />";
					}
					ins += "</td>";
					if(i3GEOtabelalegenda == true){
						imagem = retorno.data.legenda[retorno.data[1].registros[i].classe["indice"]];
						ins += "<td><img title='"+retorno.data[1].registros[i].classe["nome"]+"' src='"+imagem+"' /></td>";
					}
					else{
						ins += "<td></td>";
					}
				 	vals = retorno.data[1].registros[i].valores;
					for (j=0;j<vals.length;j++){
						ins += "<td class='"+cor+"'>"+vals[j].valor+"</td>";
					}
					if (cor === "linha"){
						cor = "linha1";
					}
					else{
						cor = "linha";
					}
				}
				$i(divid).innerHTML = ins;
			}
		};
		i3GEOF.tabela.pegaRegistros("brasil","tudo","sim",true,true,temp);
	},
	/*
	Function: ativaAutoAtualiza

	Ativa ou desativa a atualiza&ccedil;&atilde;o autom&aacute;tica da tabela quando o usu&aacute;rio navega no mapa
	*/
	ativaAutoAtualiza:function(obj){
		if(obj.checked == true){
			if(i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth"){
				i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.tabela.pegaRegistros()");
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
   				tabelaDragend = google.maps.event.addListener(i3GeoMap, "dragend", function() {i3GEOF.tabela.pegaRegistros();});
   				tabelaZoomend = google.maps.event.addListener(i3GeoMap, "zoomend", function() {i3GEOF.tebela.pegaRegistros();});
			}
			if(i3GEO.Interface.ATUAL === "googleearth"){
   				tabelaDragend = google.earth.addEventListener(i3GeoMap.getView(), "viewchangeend", function() {i3GEOF.tabela.pegaRegistros();});
			}
		}
		else{
			if(i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth"){
				i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.tabela.pegaRegistros()");
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				google.maps.event.removeListener(tabelaDragend);
				google.maps.event.removeListener(tabelaZoomend);
			}
			if(i3GEO.Interface.ATUAL === "googleearth"){
				google.earth.removeEventListener(tabelaDragend);
			}
		}
	},
	/*
	Function: pegaRegistros

	Pega os registros da tabela de atributos do tema

	Veja:

	<LISTAREGISTROS>
	*/
	pegaRegistros: function(tiporeg,tipolista,dadosDaClasse,inicio,fim,funcao){
		if(i3GEOF.tabela.aguarde.visibility === "visible")
		{return;}
		i3GEOF.tabela.aguarde.visibility = "visible";
		var p,
			cp = new cpaint();
		if(!tiporeg){
			if($i("i3GEOtabelatiporeg").checked){
				tiporeg = "mapa";
				i3GEO.janela.tempoMsg($trad(38,i3GEOF.tabela.dicionario));
			}
			else{
				tiporeg = "brasil";
			}
		}
		if(!tipolista){
			if ($i("i3GEOtabelatipolista").checked){
				tipolista = "selecionados";
			}
			else{
				tipolista = "tudo";
			}
		}
		if(!dadosDaClasse){
			if ($i("i3GEOtabelalegenda").checked){
				dadosDaClasse = "sim";
			}
			else{
				dadosDaClasse = "nao";
			}
		}
		if(!inicio){
			inicio = $i("i3GEOtabelainicio").value - 1;
		}
		else{
			inicio = "";
		}
		if(!fim){
			fim = $i("i3GEOtabelafim").value - 1;
		}
		else{
			fim = "";
		}
		if(!funcao){
			funcao = i3GEOF.tabela.montaTabela;
		}
		p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaregistros&inicio="+inicio+"&fim="+fim+"&tema="+i3GEOF.tabela.tema+"&tipo="+tiporeg+"&tipolista="+tipolista+"&ext="+i3GEO.parametros.mapexten+"&dadosDaClasse="+dadosDaClasse;
		cp.set_response_type("JSON");
		cp.call(p,"listaRegistros",funcao);
	},
	/*
	Function: montaTabela

	Monta a visualiza&ccedil;&atilde;o da tabela de atributos
	*/
	montaTabela: function(retorno){
		if (retorno.data !== undefined)
		{
			var ins = [],
				i,
				vals,
				cor,
				j,
				n,
				stat,
				imagem,
				i3GEOtabelalegenda = $i("i3GEOtabelalegenda").checked;
			//cabecalho da tabela
			ins = "<table id=i3GEOtabelatabelai class=lista8 >";
			ins += "<tr><td style='background-color:yellow'></td><td style='background-color:yellow'></td><td style='background-color:yellow'></td><td style='background-color:yellow'></td>";
			n = retorno.data[0].itens.length;
			for (i=0;i<n;i++)
			{ins += "<td accessKey='"+(i * 1 + 4)+"' style='background-color:yellow' ><img style=cursor:pointer onclick='i3GEOF.tabela.excluiColuna(this,"+(i * 1 + 4)+")' src='"+i3GEO.configura.locaplic+"/imagens/x.gif' title='"+$trad("t12")+"' />&nbsp;<img style=cursor:pointer onclick='i3GEOF.tabela.ordenaColuna(this,"+(i * 1 + 4)+")' src='"+i3GEO.configura.locaplic+"/imagens/ordena1.gif' title='"+$trad(31,i3GEOF.tabela.dicionario)+"' /><br><span title='"+retorno.data[0].itens[i]+"'> <b>"+retorno.data[0].alias[i]+"</b></span></td>";}
			ins += "</tr>";
			cor = "linha";
			n = retorno.data[1].registros.length;
			for (i=0;i<n;i++){
				ins += "<tr><td><img style=cursor:pointer onclick='i3GEOF.tabela.excluiLinha(this)' src='"+i3GEO.configura.locaplic+"/imagens/x.gif' title='"+$trad("t12")+"' /></td>";
				ins += "<td>";
				if(retorno.data[1].registros[i].ext && retorno.data[1].registros[i].ext != ""){
					ins += "<img style=cursor:pointer onclick='i3GEOF.tabela.zoomExt(\""+retorno.data[1].registros[i].ext+"\")' src='"+i3GEO.configura.locaplic+"/imagens/o.gif' title='zoom' ids="+retorno.data[1].registros[i].indice+" />";
				}
				ins += "</td>";
				stat = "";
				if(retorno.data[1].registros[i].status === "CHECKED")
				{stat = "CHECKED";}
				if(i3GEOF.tabela.registros[retorno.data[1].registros[i].indice]){
					if(i3GEOF.tabela.registros[retorno.data[1].registros[i].indice] === true)
					{stat = "CHECKED";}
					else
					{stat = "";}
				}
				ins += "<td><input title='marca' onclick='i3GEOF.tabela.registraLinha(this)' style='cursor:pointer;border:0px solid white;' type='checkbox' "+stat+"  name="+retorno.data[1].registros[i].indice+" /></td>";
				if(i3GEOtabelalegenda == true){
					imagem = retorno.data.legenda[retorno.data[1].registros[i].classe["indice"]];
					ins += "<td><img title='"+retorno.data[1].registros[i].classe["nome"]+"' src='"+imagem+"' /></td>";
				}
				else
				{ins += "<td></td>";}
			 	if(stat === "CHECKED")
			 	{i3GEOF.tabela.registros[retorno.data[1].registros[i].indice] = true;}
			 	vals = retorno.data[1].registros[i].valores;
				for (j=0;j<vals.length;j++)
				{ins += "<td class='"+cor+"'>"+vals[j].valor+"</td>";}
				if (cor === "linha"){cor = "linha1";}
				else{cor = "linha";}
			}
			$i("i3GEOtabelaregistros").innerHTML = ins;
		}
		i3GEOF.tabela.aguarde.visibility = "hidden";
	},
	/*
	Function: mais

	Avan&ccedil;a o contador de registros para a listagem
	*/
	mais:function(){
		if(i3GEOF.tabela.aguarde.visibility === "visible")
		{return;}
		var i = $i("i3GEOtabelainicio").value * 1,
			f = $i("i3GEOtabelafim").value * 1,
			d = f - i;
		$i("i3GEOtabelainicio").value = f + 1;
		$i("i3GEOtabelafim").value = f + d + 1;
		i3GEOF.tabela.pegaRegistros();
	},
	/*
	Function: menos

	Retrocede o contador de registros para a listagem
	*/
	menos: function(){
		if(i3GEOF.tabela.aguarde.visibility === "visible")
		{return;}
		var i = $i("i3GEOtabelainicio").value * 1,
			f = $i("i3GEOtabelafim").value * 1,
			d = f - i;
		$i("i3GEOtabelainicio").value = i - d - 1;
		$i("i3GEOtabelafim").value = i - 1;
		if ($i("i3GEOtabelainicio").value < 1){
			$i("i3GEOtabelainicio").value = 1;
			$i("i3GEOtabelafim").value = 1 + d;
		}
		i3GEOF.tabela.pegaRegistros();
	},
	/*
	Function: excluiColuna

	Exclui uma coluna da visualiza&ccedil;&atilde;o da tabela
	*/
	excluiColuna: function(coluna,cid){
		i3GEOF.tabela.aguarde.visibility = "visible";
		try{
			var tabela = $i("i3GEOtabelatabelai"),
				trs,
				tds,
				i,
				t,
				nt,
				ni;
			//pega o indice correto
			tds = coluna.parentNode.parentNode.getElementsByTagName("td");
			nt = tds.length;
			for (t=0;t<nt;t++){
				if(tds[t].accessKey == cid){
					cid = t;
					break;
				}
			}
			trs = tabela.getElementsByTagName("tr");
			nt = trs.length;
			for (t=0;t<nt;t++){
				i = trs[t];
				if(i.getElementsByTagName("td")[cid]){
					ni = i.getElementsByTagName("td")[cid];
					i.removeChild(ni);
				}
			}
			i3GEOF.tabela.aguarde.visibility = "hidden";
		}catch(e){
			i3GEOF.tabela.aguarde.visibility = "hidden";
			if(typeof(console) !== 'undefined'){console.error(e);}
		}
	},
	/*
	Function: ordenaColuna

	Ordena uma coluna da tabela
	*/
	ordenaColuna: function(coluna,cid){
		i3GEOF.tabela.aguarde.visibility = "visible";
		try{
			var tabela = $i("i3GEOtabelatabelai"),
				trs = tabela.getElementsByTagName("tr"),
				ntrs = trs.length,
				tds,
				nt,
				conta = 0,
				psort = [],
				t,
				psortfim,
				npsortfim,
				ins,
				p,
				e;
			//pega o indice correto
			tds = coluna.parentNode.parentNode.getElementsByTagName("td");
			nt = tds.length;
			for (t=0;t<nt;t++){
				if(tds[t].accessKey == cid){
					cid = t;
					break;
				}
			}
			for (t=0;t<ntrs;t++)
			{
				if (t < ntrs)
				{
					if (trs[t].childNodes[cid].innerHTML)
					{
						if (trs[t].childNodes[cid].innerHTML !== "undefined"){
							psort[conta] =  trs[t].childNodes[cid].innerHTML+"+"+conta;
							conta = conta + 1;
						}
					}
				}
			}
			//recosntroi a tabela
			psortfim = psort.sort();
			ins = "<table id=i3GEOtabelatabelai class=lista8 >";
			npsortfim = psortfim.length;
			for (p=0;p<npsortfim;p++)
			{
				e = psortfim[p].split("+")[1] * 1;
				if (trs[e] !== undefined)
				{ins += "<tr>" + trs[e].innerHTML + "</tr>";}
			}
			$i("i3GEOtabelaregistros").innerHTML = ins+"</table>";
			i3GEOF.tabela.aguarde.visibility = "hidden";
		}
		catch(e){i3GEOF.tabela.aguarde.visibility = "hidden";if(typeof(console) !== 'undefined'){console.error(e);}}
	},
	excluiLinha: function(celula){
		var p = celula.parentNode.parentNode;
		do{
			p.removeChild(p.childNodes[0]);
		} while (p.childNodes.length > 0);
		p.parentNode.removeChild(p);
	},
	zoomExt: function(ext){
		if(i3GEOF.tabela.aguarde.visibility === "visible")
		{return;}
		i3GEOF.tabela.aguarde.visibility = "visible";
		var funcao = function(){
			i3GEOF.tabela.aguarde.visibility = "hidden";
			i3GEOF.tabela.pegaRegistros();
			i3GEO.atualiza();
		};
		i3GEO.php.mudaext(funcao,"nenhum",ext);
	},
	//depreciado
	zoomLinha: function(celula){
		if(i3GEOF.tabela.aguarde.visibility === "visible")
		{return;}
		i3GEOF.tabela.aguarde.visibility = "visible";
		var p,reg,tempExt;
		p = celula.parentNode.parentNode;
		reg = p.getElementsByTagName("input")[0].name;
		tempExt = function(retorno){
			i3GEOF.tabela.aguarde.visibility = "hidden";
			var funcao = function(){
				i3GEOF.tabela.pegaRegistros();
				i3GEO.atualiza();
			};
			i3GEO.php.mudaext(funcao,"nenhum",retorno.data);
		};
		i3GEO.php.extRegistros(tempExt,i3GEOF.tabela.tema,reg);
	},
	registraLinha: function(linha){
		i3GEOF.tabela.registros[linha.name] = linha.checked;
	},
	/*
	Function: listaMarcados

	Retorna um array com os &iacute;ndices dos registros que est&atilde;o marcados.
	*/
	listaMarcados: function(){
		var lista = [],
			i,
			n = i3GEOF.tabela.registros.length;
		for (i=0;i<n;i++){
			if (i3GEOF.tabela.registros[i] === true){
				lista.push(i);
			}
		}
		return lista;
	},
	/*
	Function: ativaSelecao

	Seleciona no mapa os elementos que estiverem marcados na guia 2

	Veja:

	<INCLUISEL>
	*/
	ativaSelecao: function(){
		if(i3GEOF.tabela.aguarde.visibility === "visible")
		{return;}
		i3GEOF.tabela.aguarde.visibility = "visible";
		var lista = i3GEOF.tabela.listaMarcados(),
			p,
			cp,
			temp = function(retorno){
				if(retorno){
					i3GEO.Interface.atualizaTema(retorno,i3GEOF.tabela.tema);
					i3GEOF.tabela.aguarde.visibility = "hidden";
				}
			};
		p = i3GEO.configura.locaplic+"/ferramentas/tabela/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=incluisel&tema="+i3GEOF.tabela.tema+"&ids="+lista.toString();
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"incluiSel",temp);
	},
	/*
	Function: limpaSelecao

	Limpa a sele&ccedil;&atilde;o do tema da tabela
	*/
	limpaSelecao: function(){
		if(i3GEOF.tabela.aguarde.visibility === "visible")
		{return;}
		i3GEOF.tabela.aguarde.visibility = "visible";
		i3GEO.tema.limpasel(i3GEOF.tabela.tema);
		i3GEOF.tabela.registros = [];
		var lista = $i("i3GEOtabelatabelai").getElementsByTagName("input"),
			n = lista.length,
			i;
		for(i=0;i<n;i++){
			lista[i].checked = false;
		}
		i3GEOF.tabela.aguarde.visibility = "hidden";
	},
	/*
	Function: criaNovoTema

	Cria um novo tema contendo a sele&ccedil;&atilde;o existente
	*/
	criaNovoTema: function(){
		if(i3GEOF.tabela.aguarde.visibility === "visible")
		{return;}
		i3GEOF.tabela.aguarde.visibility = "visible";
		var temp = function(retorno){
			i3GEOF.tabela.aguarde.visibility = "hidden";
			i3GEO.atualiza(retorno);
		};
		i3GEO.php.criatemaSel(temp,i3GEOF.tabela.tema);
	},
	/*
	Function: comboItens

	Cria um combo para selecionar um item do tema escolhido
	*/
	comboItensEstat: function(){
		var tema = i3GEOF.tabela.tema;
		i3GEO.util.comboItens(
			"i3GEOtabelaComboItensGuia3",
			tema,
			function(retorno){
		 		if(retorno.tipo === "erro"){
		 			$i("i3GEOtabelaitensGuia3").innerHTML = "<br><br><span style='color:red'>"+$trad(32,i3GEOF.tabela.dicionario)+"</span><br><br>";
		 		}
		 		else{
		 			$i("i3GEOtabelaitensGuia3").innerHTML = retorno.dados;
		 		}
			},
			"i3GEOtabelaitensGuia3",
			""
		);
	},
	estatistica: function(){
		if($i("i3GEOtabelaComboItensGuia3").value === "")
		{i3GEO.janela.tempoMsg("Escolha um item!");return;}
		if(i3GEOF.tabela.aguarde.visibility === "visible")
		{return;}
		i3GEOF.tabela.aguarde.visibility = "visible";
		try{
			var monta = function (retorno){
					var ins = "",
						nome,
						valor,
						i,
						n;
					if(retorno.data.indices !== undefined){
						if (retorno.data.indices){
							n = retorno.data.indices.length;
							for (i=0;i<n;i++){
								nome = eval("retorno.data.variaveis."+retorno.data.indices[i]);
								valor = eval("retorno.data.valores."+retorno.data.indices[i]);
								ins += "<p style='text-align:left'> <span style='color:gray'>"+nome+": </span>"+valor+"</p>";
							}
						}
					}
					else{
						ins = retorno.data;
					}
					$i("i3GEOtabelaoperacoes").innerHTML = ins + "<br>";
					i3GEOF.tabela.aguarde.visibility = "hidden";
				},
				exclui = "",
				cp = new cpaint(),
				p;
			if ($i("i3GEOtabelafiltro1").value !== "")
			{exclui = $i("i3GEOtabelafiltro1").value;}
			p = i3GEO.configura.locaplic+"/ferramentas/tabela/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=estatistica&item="+$i("i3GEOtabelaComboItensGuia3").value+"&tema="+i3GEOF.tabela.tema+"&exclui="+exclui+"&ext="+i3GEO.parametros.mapexten;
			cp.set_response_type("JSON");
			cp.call(p,"estatDescritivas",monta);
		}catch(e){
			i3GEOF.tabela.aguarde.visibility = "hidden";
			$i("operacoes").innerHTML = "Ocorreu um erro: "+e;
		}
	},
	tabelaTexto:function(){
	},
	t0: function(){
		$i("i3GEOtabelaresultado").innerHTML = "";
		var ins = "";
		ins += "<p class='paragrafo' >"+$trad(33,i3GEOF.tabela.dicionario)+".";
		ins += "<p class='paragrafo' ><a href='http://www.r-project.org/' target=blank >"+$trad(34,i3GEOF.tabela.dicionario);
		ins += "<p class='paragrafo' ><input type=button value='"+$trad("t37b")+"' id=i3GEOtabelaGraficoI /></p>";
		ins += "<br><br><p class='paragrafo' >"+$trad(35,i3GEOF.tabela.dicionario)+".";

		i3GEO.util.proximoAnterior("","i3GEOF.tabela.t1()",ins,"i3GEOFtabelat0","i3GEOtabelaresultado");
		new YAHOO.widget.Button(
			"i3GEOtabelaGraficoI",
			{onclick:{fn: function(){
					i3GEO.mapa.ativaTema(i3GEOF.tabela.tema);
					i3GEO.analise.dialogo.graficoInterativo();
				}
			}}
		);

	},
	t1: function(){
		var ins = "<p class='paragrafo' >Escolha o tipo de gr&aacute;fico:</p>";
		ins += "<table><tr>";
		ins += "<td><img title='Pizza' onclick='javascript:i3GEOF.tabela.tipoDeGrafico=\"pie\";i3GEOF.tabela.validaT1()' style='cursor:pointer' src='"+i3GEO.configura.locaplic+"/imagens/grtorta.png' /></td>";
		ins += "<td><img title='Barras' onclick='javascript:i3GEOF.tabela.tipoDeGrafico=\"barplot\";i3GEOF.tabela.validaT1()' style='cursor:pointer' src='"+i3GEO.configura.locaplic+"/imagens/grbarras.png' /></td>";
		ins += "<td><img title='histograma' onclick='javascript:i3GEOF.tabela.tipoDeGrafico=\"hist\";i3GEOF.tabela.validaT1()' style='cursor:pointer' src='"+i3GEO.configura.locaplic+"/imagens/grhist.png' /></td>";
		ins += "<tr><td>&nbsp;</td><td></td><td></td></tr>";
		ins += "<tr><td><img title='linhas' onclick='javascript:i3GEOF.tabela.tipoDeGrafico=\"linhas\";i3GEOF.tabela.validaT1()' style='cursor:pointer' src='"+i3GEO.configura.locaplic+"/imagens/grlinhas.png' /></td>";
		ins += "<td><img onclick='javascript:i3GEOF.tabela.tipoDeGrafico=\"scatter\";i3GEOF.tabela.validaT1()' style='cursor:pointer' src='"+i3GEO.configura.locaplic+"/imagens/grdisp.png' /></td>";
		ins += "<td><img onclick='javascript:i3GEOF.tabela.tipoDeGrafico=\"scatterbins\";i3GEOF.tabela.validaT1()' style='cursor:pointer' src='"+i3GEO.configura.locaplic+"/imagens/grscatterbins.png' /></td>";
		ins += "</table></tr>";
		i3GEO.util.proximoAnterior("i3GEOF.tabela.t0()","i3GEOF.tabela.validaT1()",ins,"i3GEOF.tabela.t1()","i3GEOtabelaresultado");
	},
	validaT1: function(){
	 	if (i3GEOF.tabela.tipoDeGrafico === ""){
		  	i3GEO.janela.tempoMsg("Selecione um tipo de Grafico");
		  	i3GEOF.tabela.t1();
	 	}
	 	else{
			if(i3GEOF.tabela.aguarde.visibility === "visible")
			{return;}
			i3GEOF.tabela.aguarde.visibility = "visible";
			i3GEO.util.comboItens(
				"i3GEOFtabelagi1",
				i3GEOF.tabela.tema,
				function(retorno){
		 			i3GEOF.tabela.t2(retorno.dados,retorno.dados.replace("i3GEOFtabelagi1","i3GEOFtabelagi2"));
				}
			);
		}
	},
	t2:function(combo1,combo2){
		i3GEOF.tabela.aguarde.visibility = "hidden";
		var ins = "<p class='paragrafo' >Item com os valores ou eixo y:";
		ins += "<p class='paragrafo' >"+combo1;
		if ((i3GEOF.tabela.tipoDeGrafico !== "hist"))
		{
			ins += "<p class='paragrafo' >Item com as categorias ou eixo x:<br>";
			ins += "<p class='paragrafo' >"+combo2;
		}
		if ((i3GEOF.tabela.tipoDeGrafico !== "hist") && (i3GEOF.tabela.tipoDeGrafico !== "scatter") && (i3GEOF.tabela.tipoDeGrafico !== "scatterbins"))
		{
			ins += "<p class='paragrafo' >Os valores ser&atilde;o agrupados pelas categorias por:";
			ins += "<p class='paragrafo' ><select id=i3GEOtabelaagrupar >";
			ins += "<option value=soma SELECTED >soma</option>";
			ins += "<option value=conta >contagem</option>";
			ins += "<option value=media >m&eacute;dia</option></select>";
		}
		ins += "<p class='paragrafo' >Excluir valores:";
		ins += "<p class='paragrafo' ><input onclick='javascript:this.select();' class=digitar type=text value='' size=4 id=i3GEOtabelagexcluir />";
		i3GEO.util.proximoAnterior("i3GEOF.tabela.t1()","i3GEOF.tabela.t3()",ins,"i3GEOF.tabela.t2()","i3GEOtabelaresultado");
	},
	t3: function(){
		if(i3GEOF.tabela.aguarde.visibility === "visible")
		{return;}
		i3GEOF.tabela.aguarde.visibility = "visible";
		var temp,
			i,
			n;
		if (i3GEOF.tabela.tipoDeGrafico === "pie")
		{i3GEOF.tabela.parametros = "radius,Tgrid,border,Bgrafico,margem,margemexterna,margeminterna,Ttitulo,main,fontmain,cexmain,colmain,Tsubtitulo,sub,fontsub,cexsub,Trotulos,cex,font,Toutros,lty,bg,gw,gh,res,percentual";}
		if (i3GEOF.tabela.tipoDeGrafico === "barplot")
		{i3GEOF.tabela.parametros = "Tgrid,grid,border,Bgrafico,margem,margemexterna,margeminterna,Ttitulo,main,fontmain,cexmain,colmain,Tsubtitulo,sub,fontsub,cexsub,Teixo,ylab,xlab,cexlab,collab,fontlab,Trotulos,font,las,cexaxis,Toutros,space,bg,gw,gh,res,percentual,setasdv";}
		if (i3GEOF.tabela.tipoDeGrafico === "hist")
		{i3GEOF.tabela.parametros = "Tgrid,grid,border,Bgrafico,margem,margemexterna,margeminterna,Ttitulo,main,fontmain,cexmain,colmain,Tsubtitulo,sub,fontsub,cexsub,Teixo,ylab,xlab,cexlab,collab,fontlab,las,Trotulos,cexaxis,font,Toutros,corbarras,breaks,lwd,bg,gw,gh,res,densidade";}
		if (i3GEOF.tabela.tipoDeGrafico === "linhas")
		{i3GEOF.tabela.parametros = "Tgrid,grid,border,Bgrafico,margem,margemexterna,margeminterna,Ttitulo,main,fontmain,cexmain,colmain,Tsubtitulo,sub,fontsub,cexsub,Teixo,ylab,xlab,cexlab,collab,fontlab,las,Trotulos,cexaxis,colaxis,Toutros,pch,spline,tpt,ppontos,lty,tck,lwd,bg,gw,gh,res";}
		if (i3GEOF.tabela.tipoDeGrafico === "scatter")
		{i3GEOF.tabela.parametros = "grid,border,Bgrafico,margem,margemexterna,margeminterna,Ttitulo,main,fontmain,cexmain,colmain,Tsubtitulo,sub,fontsub,cexsub,Teixo,ylab,xlab,cexlab,collab,fontlab,las,Trotulos,cexaxis,colaxis,Toutros,pch,tpt,ppontos,lty,tck,lwd,bg,gw,gh,res,corlinha";}
		if (i3GEOF.tabela.tipoDeGrafico === "scatterbins")
		{i3GEOF.tabela.parametros = "grid,border,Bgrafico,margem,margemexterna,margeminterna,Ttitulo,main,fontmain,cexmain,colmain,Tsubtitulo,sub,fontsub,cexsub,Teixo,ylab,xlab,cexlab,collab,fontlab,las,Trotulos,cexaxis,colaxis,Toutros,pch,tpt,ppontos,lty,tck,lwd,bg,gw,gh,res,corlinha,nbins,plota3d";}

		ins = "<p class='paragrafo' > <input id=i3GEOtabelabotao7 type=button value='Gera em uma nova janela' size=15 />";
		ins += "<input id=i3GEOtabelabotao10 type=button value='Nessa janela' size=15 />";
		ins += "<input id=i3GEOtabelabotao8 type=button value='Fus&atilde;o' size=30  /><br>";
		ins += "<div id=i3GEOtabelaimgG ></div>";
		ins += "<br><br><table class=lista5 >";
		ins += "<tr><td><b>Tamanho da figura</b></td><td></td></tr>";
		ins += "<tr><td>Largura em pixels</td>";
		ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value=400 size=20 id='i3GEOtabelagw' /></td></tr>";
		ins += "<tr><td>Altura em pixels</td>";
		ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value=400 size=20 id='i3GEOtabelagh' /></td></tr>";
		ins += "<tr><td>Resolu&ccedil;&atilde;o em dpi</td>";
		ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value=72 size=20 id='i3GEOtabelares' /></td></tr>";

		temp = i3GEOF.tabela.parametros.split(",");
		n = temp.length;
		for(i=0;i < n;i++)
		{ins += i3GEOF.tabela.retornaPar(temp[i]);}
		ins += "</table>";
		i3GEOF.tabela.aguarde.visibility = "hidden";
		i3GEO.util.proximoAnterior("i3GEOF.tabela.t1()","",ins,"i3GEOF.tabela.t3()","i3GEOtabelaresultado");
		new YAHOO.widget.Button(
			"i3GEOtabelabotao7",
			{onclick:{fn: function(){i3GEOF.tabela.geraGrafico(i3GEOF.tabela.mostraGrafico);}}}
		);
		new YAHOO.widget.Button(
			"i3GEOtabelabotao8",
			{onclick:{fn: i3GEOF.tabela.fusaoGrafico}}
		);
		new YAHOO.widget.Button(
			"i3GEOtabelabotao10",
			{onclick:{fn: function(){i3GEOF.tabela.geraGrafico(i3GEOF.tabela.mostraImagem);}}}
		);
	},
	/*
	Function: retornaPar

	Monta os parâmetros adicionais de cada tipo de gr&aacute;fico
	*/
	retornaPar: function(id){
		try{
			var ins = "",
				t = "";
			if (id === "Tgrid")
			{ins += "<tr><td><b>Grade e bordas</b></td><td></td></tr>";}
			if (id === "Ttitulo")
			{ins += "<tr><td><b>T&iacute;tulo</b></td><td></td></tr>";}
			if (id === "Tsubtitulo")
			{ins += "<tr><td><b>Sub-T&iacute;tulo</b></td><td></td></tr>";}
			if (id === "Teixo")
			{ins += "<tr><td><b>Texto dos eixos</b></td><td></td></tr>";}
			if (id === "Trotulos")
			{ins += "<tr><td><b>Texto dos r&oacute;tulos dos eixos</b></td><td></td></tr>";}
			if (id === "Toutros")
			{ins += "<tr><td><b>Outros</b></td><td></td></tr>";}
			if (id === "Bgrafico")
			{ins += "<tr><td><b>Margem do gr&aacute;fico</b></td><td></td></tr>";}
			if (id === "corlinha"){
				ins += "<tr><td>Cor da linha</td>";
				ins += "<td>"+i3GEOF.tabela.combocor("i3GEOtabelacorlinha","1")+"</td></tr>";
			}
			if (id === "corbarras"){
				ins += "<tr><td>Cor das barras</td>";
				ins += "<td>"+i3GEOF.tabela.combocor("i3GEOtabelacorbarras","0")+"</td></tr>";
			}
			if (id === "plota3d"){
				ins += "<tr><td>Plota em 3d?</td>";
				ins += "<td>"+i3GEO.util.comboSimNao("i3GEOtabelaplota3d","nao")+"</td></tr>";
			}
			if (id === "setasdv"){
				ins += "<tr><td>Plota as marcas do desvio padr&atilde;o?</td>";
				ins += "<td>"+i3GEO.util.comboSimNao("i3GEOtabelasetasdv","nao")+"</td></tr>";
			}
			tsl = [];		if (id === "margem"){
				ins += "<tr><td>Plota a margem?</td>";
				ins += "<td>"+i3GEO.util.comboSimNao("i3GEOtabelamargem","sim")+"</td></tr>";
			}
			if (id === "margemexterna"){
				ins += "<tr><td>Margem externa</td>";
				ins += "<td>"+i3GEOF.tabela.combocor("i3GEOtabelamargemexterna","0")+"</td></tr>";
			}
			if (id === "margeminterna"){
				ins += "<tr><td>Margem interna</td>";
				ins += "<td>"+i3GEOF.tabela.combocor("i3GEOtabelamargeminterna","0")+"</td></tr>";
			}
			if (id === "nbins"){
				ins += "<tr><td>N&uacute;mero de divis&otilde;es dos eixos</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value='40' size=20 id=i3GEOtabelanbins /></td></tr>";
			}
			if (id === "breaks"){
				ins += "<tr><td>Total de quebras</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value='20' size=20 id=i3GEOtabelabreaks /></td></tr>";
			}
			if (id === "space"){
				ins += "<tr><td>Espa&ccedil;amento entre as barras</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value=0 size=20 id=i3GEOtabelaspace /></td></tr>";
			}
			if (id === "grid"){
				ins += "<tr><td>Plota a grade?</td>";
				ins += "<td>"+i3GEO.util.comboSimNao("i3GEOtabelagrid","sim")+"</td></tr>";
			}
			if (id === "radius"){
				ins += "<tr><td>Redu&ccedil;&atilde;o da figura (-1 a 1)</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value='0.9' size=20 id=i3GEOtabelaradius /></td></tr>";
			}
			if (id === "percentual"){
				ins += "<tr><td>Plota o percentual nos r&oacute;tulos?</td>";
				ins += "<td>"+i3GEO.util.comboSimNao("i3GEOtabelapercentual","sim")+"</td></tr>";
			}
			if (id === "densidade"){
				ins += "<tr><td>Utiliza densidade</td>";
				ins += "<td>"+i3GEO.util.comboSimNao("i3GEOtabeladensidade","nao")+"</td></tr>";
			}
			if (id === "ann"){
				ins += "<tr><td>Plota os textos?</td>";
				ins += "<td>"+i3GEO.util.comboSimNao("i3GEOtabelaann","sim")+"</td></tr>";
			}
			if (id === "adj"){
				ins += "<tr><td>Posicionamento dos textos</td>";
				ins += "<td><select name=adj id=i3GEOtabelaadj >";
				ins += "<option value=0.5 SELECTED>centro</option>";
				ins += "<option value=0 >esquerda</option>";
				ins += "<option value=1 >direita</option>";
				ins += "</select></td></tr>";
			}
			if (id === "font"){
				ins += '<tr><td>Estilo da fonte dos textos marginais</td>';
				ins += '<td style="text-align:right">';
				ins +=  '<select name="font" id=i3GEOtabelafont >';
				ins +=   '<option value="2" selected >normal</option>';
				ins +=   '<option value="3">negrito</option>';
				ins +=   '<option value="4">it&aacute;lico</option>';
				ins +=   '<option value="5">negrito-it&aacute;lico</option>';
				ins +=  "</select>";
				ins +=  '</td></tr>';
			}
			if (id === "cex"){
				ins += "<tr><td>Fator de escala</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value='.6' size=20 id=i3GEOtabelacex /></td></tr>";
			}
			if (id === "main"){
				t = "";
				if ($i("i3GEOtabelagi1"))
				{t = $i("i3GEOtabelagi1").value;}
				if ($i("i3GEOtabelagi2"))
				{t += " " + $i("i3GEOtabelagi2").value;}
				ins += "<tr><td>T&iacute;tulo</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value='"+t+"' size=20 id=i3GEOtabelamain /></td></tr>";
			}
			if (id === "fontmain"){
				ins += '<tr><td>Estilo</td>';
				ins += '<td style="text-align:right">';
				ins +=  '<select name="fontmain" id=i3GEOtabelafontmain >';
				ins +=   '<option value="2" selected >normal</option>';
				ins +=   '<option value="3">negrito</option>';
				ins +=   '<option value="4">it&aacute;lico</option>';
				ins +=   '<option value="5">negrito-it&aacute;lico</option>';
				ins +=  "</select>";
				ins +=  '</td></tr>';
			}
			if (id === "cexmain"){
				ins += "<tr><td>Fator de escala</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value=1 size=20 id=i3GEOtabelacexmain /></td></tr>";
			}
			if (id === "colmain"){
				ins += "<tr><td>Cor</td>";
				ins += "<td>"+i3GEOF.tabela.combocor("i3GEOtabelacolmain","1")+"</td></tr>";
			}
			tsl = [];
			if (id === "sub"){
				ins += "<tr><td>Sub-T&iacute;tulo</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value='' size=20 id=i3GEOtabelasub /></td></tr>";
			}
			if (id === "fontsub"){
				ins += '<tr><td>Estilo</td>';
				ins += '<td style="text-align:right">';
				ins +=  '<select id=i3GEOtabelafontsub >';
				ins +=   '<option value="2" selected >normal</option>';
				ins +=   '<option value="3">negrito</option>';
				ins +=   '<option value="4">it&aacute;lico</option>';
				ins +=   '<option value="5">negrito-it&aacute;lico</option>';
				ins +=  "</select>";
				ins +=  '</td></tr>';
			}
			if (id === "cexsub"){
				ins += "<tr><td>Fator de escala</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value=1 size=20 id=i3GEOtabelacexsub /></td></tr>";
			}
			if (id === "colsub"){
				ins += "<tr><td>Cor</td>";
				ins += "<td>"+i3GEOF.tabela.combocor("i3GEOtabelacolsub","1")+"</td></tr>";
			}
			if (id === "ylab"){
				if ($i("i3GEOFtabelagi1"))
				{t = $i("i3GEOFtabelagi1").value;}
				if (i3GEOF.tabela.tipoDeGrafico === "hist")
				{t = "quantidade";}
				ins += "<tr><td>Nome do eixo y</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value='"+t+"' size=20 id=i3GEOtabelaylab /></td></tr>";
			}
			if (id === "xlab"){
				if ($i("i3GEOFtabelagi2"))
				{t = $i("i3GEOFtabelagi2").value;}
				if (i3GEOF.tabela.tipoDeGrafico === "hist")
				{t = "ocorrencias";}
				ins += "<tr><td>Nome do eixo x</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value='"+t+"' size=20 id=i3GEOtabelaxlab /></td></tr>";
			}
			if (id === "cexaxis"){
				ins += "<tr><td>Fator de escala</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value=.5 size=20 id=i3GEOtabelacexaxis /></td></tr>";
			}
			if (id === "cexlab"){
				ins += "<tr><td>Fator de escala</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value=1 size=20 id=i3GEOtabelacexlab /></td></tr>";
			}
			if (id === "colaxis"){
				ins += "<tr><td>Cor</td>";
				ins += "<td>"+i3GEOF.tabela.combocor("i3GEOtabelacolaxis","1")+"</td></tr>";
			}
			if (id === "collab"){
				ins += "<tr><td>Cor</td>";
				ins += "<td>"+i3GEOF.tabela.combocor("i3GEOtabelacollab","1")+"</td></tr>";
			}
			if (id === "fontaxis"){
				ins += '<tr><td>Estilo</td>';
				ins += '<td style="text-align:right">';
				ins +=  '<select id=i3GEOtabelafontaxis >';
				ins +=   '<option value="2" selected >normal</option>';
				ins +=   '<option value="3">negrito</option>';
				ins +=   '<option value="4">it&aacute;lico</option>';
				ins +=   '<option value="5">negrito-it&aacute;lico</option>';
				ins +=  "</select>";
				ins +=  '</td></tr>';
			}
			if (id === "fontlab"){
				ins += '<tr><td>Estilo</td>';
				ins += '<td style="text-align:right">';
				ins +=  '<select id=i3GEOtabelafontlab >';
				ins +=   '<option value="2" selected >normal</option>';
				ins +=   '<option value="3">negrito</option>';
				ins +=   '<option value="4">it&aacute;lico</option>';
				ins +=   '<option value="5">negrito-it&aacute;lico</option>';
				ins +=  "</select>";
				ins +=  '</td></tr>';
			}
			if (id === "las"){
				ins += "<tr><td>&Acirc;ngulo</td>";
				ins += "<td style='text-align:right'><select id=i3GEOtabelalas >";
				ins += "<option value=0 SELECTED>paralelos</option>";
				ins += "<option value=1 >horizontal</option>";
				ins += "<option value=2 >perpendicular</option>";
				ins += "<option value=3 >vertical</option>";
				ins += "</select></td></tr>";
			}
			if (id === "lty"){
				ins += '<tr><td>Estilo das linhas</td>';
				ins += '<td style="text-align:right">';
				ins += '<select id="i3GEOtabelalty" >\n';
				ins +=  '<option value="0"  >nenhum</option>';
				ins +=  '<option value="1" selected >s&oacute;lido</option>';
				ins +=  '<option value="2">tracejado</option>';
				ins +=  '<option value="3">pontilhado</option>';
				ins +=  '<option value="4">tra&ccedil;o-ponto</option>';
				ins +=  '<option value="5">tra&ccedil;o longo</option>';
				ins +=  '<option value="6">tra&ccedil;o duplo</option>';
				ins += "</select>";
				ins += '</td></tr>';
			}
			if (id === "border")	{
				ins += "<tr><td>Cor da borda dos elementos ou linhas</td>";
				ins += "<td>"+i3GEOF.tabela.combocor("i3GEOtabelaborder","1")+"</td></tr>";
			}
			if (id === "lwd"){
				ins += "<tr><td>Largura da linha</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value=1 size=20 id=i3GEOtabelalwd /></tr>";
			}
			if (id === "tck"){
				ins += "<tr><td>Tamanho dos tics</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value=1 size=20 id=i3GEOtabelatck /></td></tr>";
			}
			if (id === "horiz"){
				ins += "<tr><td>Horizontal?</td>";
				ins += "<td>"+i3GEO.util.comboSimNao("i3GEOtabelahoriz","sim")+"</td></tr>";
			}
			if (id === "spline"){
				ins += "<tr><td>Suaviza as linhas?</td>";
				ins += "<td>"+i3GEO.util.comboSimNao("i3GEOtabelaspline","nao")+"</td></tr>";
			}
			if (id === "ppontos"){
				ins += "<tr><td>Plota os pontos?</td>";
				ins += "<td>"+i3GEO.util.comboSimNao("i3GEOtabelappontos","sim")+"</td></tr>";
			}
			if (id === "full"){
				ins += "<tr><td>C&iacute;rculo inteiro?</td>";
				ins += "<td>"+i3GEO.util.comboSimNao("i3GEOtabelafull","sim")+"</td></tr>";
			}
			if (id === "pch"){
				ins += "<tr><td>S&iacute;mbolo dos pontos</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value='o' size=20 id=i3GEOtabelapch /></td></tr>";
			}
			if (id === "tpt"){
				ins += "<tr><td>Tamanho dos pontos</td>";
				ins += "<td><input onclick='javascript:this.select();' class=digitar type=text value=0.5 size=20 id=i3GEOtabelatpt /></td></tr>";
			}
			return ins;
		}
		catch(e){i3GEO.janela.tempoMsg("Erro ao capturar parametro. "+e);}
	},
	/*
	Function: combocor

	Gera uma lista de cores no padr&atilde;o do R
	*/
	combocor: function(id,def,s){
		var combo = "<select name="+id+" id="+id+" >";
		if (def === 0){s = 'selected';}
		combo += '<option value="0" '+s+' >branco</option>';
		s = "";
		combo +='<option value="2">vermelho</option>';
		combo += '<option value="7">amarelo</option>';
		if (def === 1){s = 'selected';}
		combo += '<option value="1" '+s+' >preto</option>';
		combo += '<option value="rgb(1,1,0.8)">bege</option>';
		combo += '<option value="3">verde</option>';
		combo += '<option value="8">cinza</option>';
		combo += '<option value="4">azul</option>';
		combo += '<option value="5">ciano</option>';
		combo += '<option value="6">magenta</option>';
		combo += "</select>";
		return(combo);
	},
	/*
	Function: geraGrafico

	Gera a imagem do gr&aacute;fico
	*/
	geraGrafico: function(funcao){
		if(i3GEOF.tabela.aguarde.visibility === "visible")
		{return;}
		i3GEOF.tabela.aguarde.visibility = "visible";

		var par,p,
			cp = new cpaint();
		par = i3GEOF.tabela.montapar(i3GEOF.tabela.parametros);

		if (i3GEOF.tabela.tipoDeGrafico==="pie"){
			p = i3GEO.configura.locaplic+"/ferramentas/tabela/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=graficopizza"+par;
			cp.set_response_type("JSON");
			cp.call(p,"graficoPizza",funcao);
		}
		if (i3GEOF.tabela.tipoDeGrafico==="barplot"){
			p = i3GEO.configura.locaplic+"/ferramentas/tabela/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=graficobarras"+par;
			cp.set_response_type("JSON");
			cp.call(p,"graficoBarras",funcao);
		}
		if (i3GEOF.tabela.tipoDeGrafico==="hist"){
			p = i3GEO.configura.locaplic+"/ferramentas/tabela/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=graficohist"+par;
			cp.set_response_type("JSON");
			cp.call(p,"graficoHist",funcao);
		}
		if (i3GEOF.tabela.tipoDeGrafico==="linhas"){
			p = i3GEO.configura.locaplic+"/ferramentas/tabela/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=graficolinhas"+par;
			cp.set_response_type("JSON");
			cp.call(p,"graficoLinhas",funcao);
		}
		if (i3GEOF.tabela.tipoDeGrafico==="scatter"){
			p = i3GEO.configura.locaplic+"/ferramentas/tabela/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=graficoscatter"+par;
			cp.set_response_type("JSON");
			cp.call(p,"graficoScatter",funcao);
		}
		if (i3GEOF.tabela.tipoDeGrafico==="scatterbins"){
			p = i3GEO.configura.locaplic+"/ferramentas/tabela/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=graficoscatterbins"+par;
			cp.set_response_type("JSON");
			cp.call(p,"graficoScatterBins",funcao);
		}
	},
	/*
	Function: mostraGrafico

	Mostra o gr&aacute;fico gerado em uma nova janela do navegador
	*/
	mostraGrafico: function(retorno){
		i3GEOF.tabela.aguarde.visibility = "hidden";
		if (retorno.data !== "erro")
		{
			var r = retorno.data,
				l = r.split(","),
				w = window.open("");
			w.document.write("<img src='"+l[0]+"' />");
			w.document.write("<br><br><br><a href="+l[1]+"> Arquivo com os valores</a>");
			w.document.close();
			i3GEOF.tabela.imagemG = l[0];
			i3GEOF.tabela.nomeArquivoGr = l[2];
		}
		else
		{i3GEO.janela.tempoMsg("Ocorreu algum erro. Verifique os tipos de dados.");}
	},
	/*
	Function: mostraImagem

	Mostra o gr&aacute;fico na janela flutuante do i3Geo

	*/
	mostraImagem: function(retorno){
		i3GEOF.tabela.aguarde.visibility = "hidden";
		if (retorno.data !== "erro"){
			var r = retorno.data,
				l = r.split(","),
				i = $i("i3GEOtabelaimgG");
			i.innerHTML = "<img src='"+l[0]+"' />";
			i.style.display="block";
			i3GEOF.tabela.imagemG = l[0];
			i3GEOF.tabela.nomeArquivoGr = l[2];
		}
		else
		{i3GEO.janela.tempoMsg("Ocorreu algum erro. Verifique os tipos de dados.");}
	},
	/*
	Function: fusaoGrafico

	Faz a fus&atilde;o do mapa com o gr&aacute;fico gerado
	*/
	fusaoGrafico: function(){
		if(i3GEOF.tabela.aguarde.visibility === "visible")
		{return;}
		i3GEOF.tabela.aguarde.visibility = "visible";
		if (i3GEOF.tabela.imagemG === ""){
			i3GEO.janela.tempoMsg("O gr&aacute;fico ainda n&atilde;o foi gerado.");
			i3GEOF.tabela.aguarde.visibility = "hidden";
		}
		else{
			var cp = new cpaint(),
				i = i3GEO.gadgets.quadros.quadrosfilme[i3GEO.gadgets.quadros.quadroatual].imagem,
				p = i3GEO.configura.locaplic+"/ferramentasqtabela/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=fusaografico&imagem="+i+"&grafico="+i3GEOF.tabela.imagemG,
				temp = function(retorno){
					var img = retorno.data,
						i = $i("img");
					i.src = "";
					i.src = img;
					window.open(img);
					i3GEOF.tabela.aguarde.visibility = "hidden";
				};
			cp.set_response_type("JSON");
			cp.call(p,"fusaoGrafico",temp);
		}
	},
	/*
	Function: montaPar

	Monta os parâmetros para um determinado tipo de gr&aacute;fico, que ser&atilde;o utilizados na chamada ajax de cria&ccedil;&atilde;o do gr&aacute;fico
	*/
	montapar: function(parametros){
		try{
			var par = "&",
				i,
				v,
				tipo = i3GEOF.tabela.tipoDeGrafico,
				n;
			parametros = parametros.split(",");
			n = parametros.length;
			for(i=0;i < n;i++){
				if ($i("i3GEOtabela"+parametros[i])){
					v = $i("i3GEOtabela"+parametros[i]).value;
					par += "&"+parametros[i]+"="+v;
				}
			}
			if (i3GEOF.tabela.tipoDeGrafico === "estrela")
			{tipo = "estrela";}
			if (i3GEOF.tabela.tipoDeGrafico === "hist")
			{tipo = "hist";}
			if ((i3GEOF.tabela.tipoDeGrafico === "scatter") || (i3GEOF.tabela.tipoDeGrafico === "scatterbins"))
			{tipo = "scatter";}
			if ($i("i3GEOtabelaagrupar"))
			{tipo = $i("i3GEOtabelaagrupar").value;}

			if ((i3GEOF.tabela.tipoDeGrafico === "pie") || (i3GEOF.tabela.tipoDeGrafico === "barplot") || (i3GEOF.tabela.tipoDeGrafico === "scatter") || (i3GEOF.tabela.tipoDeGrafico === "scatterbins"))
			{par += "&itemvalores="+$i("i3GEOFtabelagi1").value+"&itemclasses="+$i("i3GEOFtabelagi2").value+"&tema="+i3GEOF.tabela.tema+"&exclui="+$i("i3GEOtabelagexcluir").value+"&tipo="+tipo;}
			if (i3GEOF.tabela.tipoDeGrafico === "hist")
			{par += "&itemvalores="+$i("i3GEOFtabelagi1").value+"&itemclasses="+$i("i3GEOFtabelagi1").value+"&tema="+i3GEOF.tabela.tema+"&exclui="+$i("i3GEOtabelagexcluir").value+"&tipo=nenhum";}
			if (i3GEOF.tabela.tipoDeGrafico === "linhas")
			{par += "&itemvalores="+$i("i3GEOFtabelagi1").value+"&itemclasses="+$i("i3GEOFtabelagi2").value+"&tema="+i3GEOF.tabela.tema+"&exclui="+$i("i3GEOtabelagexcluir").value+"&tipo="+tipo;}
			if (i3GEOF.tabela.tipoDeGrafico === "estrela")
			{par += "&itemvalores="+$i("i3GEOFtabelagi1").value+"&tema="+i3GEOF.tabela.tema+"&exclui="+$i("i3GEOtabelagexcluir").value+"&tipo="+tipo+"&itemclasses="+itensEstrela;}
			par += "&nome="+i3GEOF.tabela.nomeArquivoGr;
			return(par);
		}catch(e){i3GEO.janela.tempoMsg("Erro: "+e);i3GEOF.tabela.aguarde.visibility = "hidden";}
	},
	/*
	Function: relatorioTabela

	Monta o relat&oacute;rio padr&atilde;o em uma nova janela
	*/
	relatorioTabela: function(){
		try{
			$i("i3GEOtabelatiporelh").value = "";
			$i("i3GEOtabelaarearelh").value = $i("i3GEOtabelacalculaarea").checked;
			$i("i3GEOtabelastatrelh").value = $i("i3GEOtabelacalculaestat").checked;
			$i("i3GEOtabelaexcluirvalorh").value = $i("i3GEOtabelaexcestat").value;
			$i("i3GEOtabelatemarelh").value=i3GEOF.tabela.tema;
			$i("i3GEOtabelag_sidh").value=i3GEO.configura.sid;
			$i("i3GEOtabelaitemagruparelh").value=$i("i3GEOtabelaagrupaItem").value;
			var inputs = $i("i3GEOtabelaitensrelatorio").getElementsByTagName("input"),
				listai = [],
				listaordem = [],
				listanomes = [],
				nome,ordem,
				i,temp,
				n = inputs.length;
			for (i=0;i<n; i++){
				if (inputs[i].type === "checkbox" && inputs[i].checked == true){
					listai.push(inputs[i].id+";"+inputs[i].name);
					nome = $i(inputs[i].id+inputs[i].name).value;
					listanomes.push(nome);
					ordem = $i("ordem_"+inputs[i].id+inputs[i].name).value;
					if(ordem === ""){
						ordem = 0;
					}
					listaordem.push(ordem);
				}
			}
			$i("i3GEOtabelaordemrel").value=listaordem;
			$i("i3GEOtabelanomesrelh").value=listanomes;
			$i("i3GEOtabelaitensrelh").value=listai;
			temp = $i("i3GEOtabelarelatorio").action;
			$i("i3GEOtabelarelatorio").action += "?ext="+i3GEO.parametros.mapexten;
			$i("i3GEOtabelarelatorio").submit();
			$i("i3GEOtabelarelatorio").action = temp;
		}catch(e){i3GEO.janela.tempoMsg(e);}
	},
	/*
	Function: relatorioTexto

	Gera o relat&oacute;rio no formato CSV
	*/
	relatorioTexto: function(){
		try{
			$i("i3GEOtabelaarearelh").value = $i("i3GEOtabelacalculaarea").checked;
			$i("i3GEOtabelastatrelh").value = $i("i3GEOtabelacalculaestat").checked;
			$i("i3GEOtabelaexcluirvalorh").value = $i("i3GEOtabelaexcestat").value;
			$i("i3GEOtabelatemarelh").value=i3GEOF.tabela.tema;
			$i("i3GEOtabelag_sidh").value=i3GEO.configura.sid;
			$i("i3GEOtabelaitemagruparelh").value=$i("i3GEOtabelaagrupaItem").value;
			$i("i3GEOtabelatiporelh").value = "csv";
			var inputs = $i("i3GEOtabelaitensrelatorio").getElementsByTagName("input"),
				listai = [],
				listanomes = [],
				nome,
				i,temp,
				n = inputs.length;
			for (i=0;i<n; i++)
			{
				if (inputs[i].checked === true)
				{
					listai.push(inputs[i].id+";"+inputs[i].name);
					nome = $i(inputs[i].id+inputs[i].name).value;
					listanomes.push(nome);
				}
			}
			$i("i3GEOtabelanomesrelh").value=listanomes;
			$i("i3GEOtabelaitensrelh").value=listai;
			temp = $i("i3GEOtabelarelatorio").action;
			$i("i3GEOtabelarelatorio").action += "?ext="+i3GEO.parametros.mapexten;
			$i("i3GEOtabelarelatorio").submit();
			$i("i3GEOtabelarelatorio").action = temp;
		}catch(e){i3GEO.janela.tempoMsg(e);}
	}
};
