if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.tabela
 */
i3GEOF.tabela = {
		/**
		 * Array com os ids das janelas ja criadas
		 */
		janelas: [],
		propJanelas: {},
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
		inicia: function(iddiv,idjanela){
			var onButtonClick = function (p_sType, p_aArgs, botao) {
				var oMenuItem = p_aArgs[1];
				if (oMenuItem) {
					if(oMenuItem.value != ""){
						i3GEO.mapa.ativaTema(oMenuItem.value);
						botao.set("label", "<span class='cabecalhoTemas' >" + oMenuItem.cfg.getProperty("text") + "</span>&nbsp;&nbsp;");
						i3GEOF.tabela.propJanelas[idjanela].tema = oMenuItem.value;
						$i(idjanela+"_corpo").innerHTML = "";
						i3GEOF.tabela.inicia(iddiv,idjanela);
					}
				}
			};
			i3GEO.janela.comboCabecalhoTemas(idjanela+"i3GEOFtabelaComboCabeca",idjanela+"i3GEOFtabelaComboCabecaSel","tabela","ligadosComTabela",onButtonClick);
			if(i3GEOF.tabela.propJanelas[idjanela].tema === ""){
				$i(iddiv).innerHTML = "";//'<p style="position: relative; top: 0px; font-size: 15px; text-align: left;">'+$trad("x33")+'</p>';
				return;
			}
			try{
				$i(iddiv).innerHTML = i3GEOF.tabela.html(idjanela);
				i3GEO.guias.mostraGuiaFerramenta(idjanela+"i3GEOtabelaguia1",idjanela+"i3GEOtabelaguia");
				//eventos das guias
				$i(idjanela+"i3GEOtabelaguia6").onclick = function(){
					i3GEO.guias.mostraGuiaFerramenta(idjanela+"i3GEOtabelaguia6",idjanela+"i3GEOtabelaguia");
				};
				$i(idjanela+"i3GEOtabelaguia1").onclick = function(){
					i3GEO.guias.mostraGuiaFerramenta(idjanela+"i3GEOtabelaguia1",idjanela+"i3GEOtabelaguia");
				};
				$i(idjanela+"i3GEOtabelaguia3").onclick = function(){
					i3GEO.guias.mostraGuiaFerramenta(idjanela+"i3GEOtabelaguia3",idjanela+"i3GEOtabelaguia");
					if(!$i(idjanela+"i3GEOtabelaComboItensGuia3")){
						i3GEOF.tabela.comboItensEstat(idjanela);
					}
				};
				//relatorio
				$i(idjanela+"i3GEOtabelaguia5").onclick = function(){
					i3GEO.guias.mostraGuiaFerramenta(idjanela+"i3GEOtabelaguia5",idjanela+"i3GEOtabelaguia");
					i3GEO.util.checkItensEditaveis(
							i3GEOF.tabela.propJanelas[idjanela].tema,
							function(retorno){
								if (retorno.tipo === "dados"){
									$i(idjanela+"i3GEOtabelaitensrelatorio").innerHTML = retorno.dados;
								}
							},
							idjanela+"i3GEOtabelaitensrelatorio",
							"320px",
							"",
							"sim"
					);
					i3GEO.util.comboItens(
							idjanela+"i3GEOtabelaagrupaItem",
							i3GEOF.tabela.propJanelas[idjanela].tema,
							function(retorno){
								if(retorno.tipo === "erro"){
									$i(idjanela+"i3GEOtabelaagrupamento").innerHTML = "<br><br><span style='color:red'>"+$trad(2,i3GEOF.tabela.dicionario)+"</span><br><br>";
								}
								else{
									$i(idjanela+"i3GEOtabelaagrupamento").innerHTML = retorno.dados;
								}
							},
							idjanela+"i3GEOtabelaagrupamento",
							""
					);
				};
				new YAHOO.widget.Button(
						idjanela+"i3GEOtabelabotao2",
						{onclick:{fn: function(){
							i3GEOF.tabela.ativaSelecao(idjanela);
						}}}
				);
				new YAHOO.widget.Button(
						idjanela+"i3GEOtabelabotao3",
						{onclick:{fn: function(){
							i3GEOF.tabela.limpaSelecao(idjanela);
						}}}
				);
				new YAHOO.widget.Button(
						idjanela+"i3GEOtabelabotao6",
						{onclick:{fn: function(){
							i3GEOF.tabela.criaNovoTema(idjanela);
						}}}
				);
				new YAHOO.widget.Button(
						idjanela+"i3GEOtabelabotaoLista",
						{onclick:{fn: function(){
							i3GEOF.tabela.pegaRegistros(idjanela);
						}}}
				);
				new YAHOO.widget.Button(
						idjanela+"i3GEOtabelaGraficoI",
						{onclick:{fn: function(){
							i3GEO.mapa.ativaTema(i3GEOF.tabela.propJanelas[idjanela].tema);
							i3GEO.analise.dialogo.graficoInterativo1();
						}
						}}
				);
				$i(idjanela+"i3GEOtabelabotaoLista-button").style.minHeight = "1em";
				$i(idjanela+"i3GEOtabelabotaoLista-button").style.padding = "0px 15px";
				$i(idjanela+"i3GEOtabelabotaoLista-button").style.lineHeight = "1.3";
				$i(idjanela+"i3GEOtabelabotaoLista").style.position = "relative";
				$i(idjanela+"i3GEOtabelabotaoLista").style.top = "2px";

				new YAHOO.widget.Button(
						idjanela+"i3GEOtabelabotao4",
						{onclick:{fn: function(){
							i3GEOF.tabela.estatistica(idjanela);
						}}}
				);

				new YAHOO.widget.Button(
						idjanela+"i3GEOtabelabotao7",
						{onclick:{fn: function(){
							i3GEOF.tabela.relatorioTabela(idjanela);
						}}}
				);
				new YAHOO.widget.Button(
						idjanela+"i3GEOtabelabotao5",
						{onclick:{fn: function(){
							i3GEOF.tabela.relatorioTexto(idjanela);
						}}}
				);
				i3GEO.util.mensagemAjuda(idjanela+"i3GEOtabelamen1",$i(idjanela+"i3GEOtabelamen1").innerHTML);

				if (i3GEO.parametros.r.toLowerCase() !== "sim"){
					$i(idjanela+"i3GEOtabelaguia4obj").innerHTML = $trad("x22");
				}
				i3GEOF.tabela.pegaRegistros(idjanela);
			}
			catch(erro){i3GEO.janela.tempoMsg(erro);}
		},
		/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
		 */
		html:function(idjanela){
			var ins = '';//<p class="paragrafo" >
			ins += '<div id='+idjanela+'guiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">';
			ins += '<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">';
			ins += '	<li><a  ><em><div id="'+idjanela+'i3GEOtabelaguia6" style="text-align:center;left:0px;" ><img class="ticPropriedades2" style="height:14px" title="'+$trad("p13")+'" src="'+i3GEO.configura.locaplic+'/imagens/visual/default/branco.gif"></div></em></a></li>';
			ins += '	<li><a  ><em><div id="'+idjanela+'i3GEOtabelaguia1" style="text-align:center;left:0px;" >'+$trad(3,i3GEOF.tabela.dicionario)+'</div></em></a></li>';
			ins += '	<li><a  ><em><div id="'+idjanela+'i3GEOtabelaguia3" style="text-align:center;left:0px;" >'+$trad(4,i3GEOF.tabela.dicionario)+'</div></em></a></li>';
			ins += '	<li><a  ><em><div id="'+idjanela+'i3GEOtabelaguia5" style="text-align:center;left:0px;" >'+$trad(5,i3GEOF.tabela.dicionario)+'</div></em></a></li>';
			ins += '</ul>';
			ins += '</div><br>';
			ins += '	<div id='+idjanela+'i3GEOtabelaresultadotab style="background-color:#F2F2F2;position:relative;top:5px;left:0px"></div>';
			//propriedades
			ins += '	<div id='+idjanela+'i3GEOtabelaguia6obj style="width:99%">';
			ins += '		<table summary="" class=lista2 >';
			ins += '		<tr>';
			ins += '			<td><input style="cursor:pointer;border:0px solid white;" onclick="i3GEOF.tabela.pegaRegistros(\''+idjanela+'\')" type=checkbox id='+idjanela+'i3GEOtabelatipolista /></td>';
			ins += '			<td>'+$trad(8,i3GEOF.tabela.dicionario)+'</td>';
			ins += '		</tr>';
			ins += '		<tr>';
			ins += '			<td><input style="cursor:pointer;border:0px solid white;" onclick="i3GEOF.tabela.pegaRegistros(\''+idjanela+'\')" type=checkbox id='+idjanela+'i3GEOtabelalegenda /></td>';
			ins += '			<td>'+$trad(9,i3GEOF.tabela.dicionario)+'</td>';
			ins += '		</tr>';
			ins += '		</table>';
			ins += '		</div>';
			
			ins += '	<div id='+idjanela+'i3GEOtabelaguia1obj style="width:99%">';
			ins += '		<div id='+idjanela+'i3GEOtabelacombot style="position:relative;top:5px;left:0px;display:none;">';
			ins += '		</div>';
			ins += '		<input title="'+$trad(10,i3GEOF.tabela.dicionario)+'" id='+idjanela+'i3GEOtabelabotao2 size=25 type=button value="'+$trad(11,i3GEOF.tabela.dicionario)+'" />';
			ins += '		<input title="'+$trad(12,i3GEOF.tabela.dicionario)+'" id='+idjanela+'i3GEOtabelabotao3 size=25  type=button value="'+$trad(13,i3GEOF.tabela.dicionario)+'"/>';
			ins += '		<input title="'+$trad(14,i3GEOF.tabela.dicionario)+'" id='+idjanela+'i3GEOtabelabotao6 size=30  type=button value="'+$trad(15,i3GEOF.tabela.dicionario)+'"/>';
			ins += '		<input type=button value="'+$trad("t37b")+'" id='+idjanela+'i3GEOtabelaGraficoI />';
			ins += '		<div id='+idjanela+'i3GEOtabelacontador style="background-color:rgb(240,240,240);width:100%;position:relative;top:15px;left:0px;text-align:left;height:25px;">';
			ins += '			'+$trad(16,i3GEOF.tabela.dicionario)+' <img style=cursor:pointer onclick="i3GEOF.tabela.menos(\''+idjanela+'\')" src="'+i3GEO.configura.locaplic+'/imagens/minus.gif" />';
			ins += $inputText("","",idjanela+"i3GEOtabelainicio","",5,"1");
			ins += '			'+$trad(17,i3GEOF.tabela.dicionario)+"&nbsp;";
			ins += '			<img style=cursor:pointer onclick="i3GEOF.tabela.mais(\''+idjanela+'\')" src="'+i3GEO.configura.locaplic+'/imagens/plus.gif" />';
			ins += $inputText("","",idjanela+"i3GEOtabelafim","",5,"20");
			ins += '			<img title="'+$trad(40,i3GEOF.tabela.dicionario)+'"style="cursor:pointer;position:relative;" onclick="i3GEOF.tabela.todos(\''+idjanela+'\')" src="'+i3GEO.configura.locaplic+'/imagens/dot.gif" />';
			ins += '			<input title="'+$trad(18,i3GEOF.tabela.dicionario)+'" id='+idjanela+'i3GEOtabelabotaoLista size=25  style="position:relative;" type=button value="'+$trad(19,i3GEOF.tabela.dicionario)+'"/>';
			//ins += '			<a href="#" onclick="i3GEOF.tabela.novaJanela()" >'+$trad(36,i3GEOF.tabela.dicionario)+'</a>';
			ins += '		</div>';
			ins += '		<div id='+idjanela+'i3GEOtabelaregistros style="position:relative;top:20px;left:0px;text-align:left;">';
			ins += '		</div>';
			ins += '	</div>';
			
			ins += '	<div id='+idjanela+'i3GEOtabelaguia3obj style="display:none;width:99%;left:0px" >';
			ins += '		<p class="paragrafo" ><label>'+$trad(20,i3GEOF.tabela.dicionario)+':</label> <span id='+idjanela+'i3GEOtabelaitensGuia3 ></span>';
			ins += '		<p class="paragrafo" ><label>'+$trad(21,i3GEOF.tabela.dicionario)+':</label>';
			ins += $inputText("","",idjanela+"i3GEOtabelafiltro1","",5,"");
			ins += '		<p class="paragrafo" ><input id='+idjanela+'i3GEOtabelabotao4 size=30  type=button value="'+$trad(22,i3GEOF.tabela.dicionario)+'"/>';
			ins += '		<div id="'+idjanela+'i3GEOtabelaoperacoes" style="font-size:12px;text-align:left;position:relative;top:15px;left:0px;"  >';
			ins += '		</div><br>';
			ins += '		<div id='+idjanela+'i3GEOtabelamen1 style="position:relative;top:25px;left:0px;width:100%" >';
			ins += '			<p class="paragrafo" >'+$trad(23,i3GEOF.tabela.dicionario);
			ins += '		</div>';
			ins += '	</div>';
			//relatorios
			ins += '	<div id='+idjanela+'i3GEOtabelaguia5obj style="width:99%;display:none">';
			ins += '		<p class="paragrafo" >'+$trad(24,i3GEOF.tabela.dicionario)+':';
			ins += '		<p class="paragrafo" ><div id='+idjanela+'i3GEOtabelaitensrelatorio class=digitar style="text-align:left;overflow:auto;height:100px">';
			ins += '		</div><br>';
			ins += '		<p class="paragrafo" >'+$trad(25,i3GEOF.tabela.dicionario)+':';
			ins += '		<p class="paragrafo" ><div id='+idjanela+'i3GEOtabelaagrupamento style="text-align:left;">';
			ins += '		</div>';
			ins += '		<p class="paragrafo" ><br><input style="cursor:pointer" type=checkbox id='+idjanela+'i3GEOtabelacalculaarea />'+$trad(26,i3GEOF.tabela.dicionario);
			ins += '		<p class="paragrafo" ><input style="cursor:pointer" type=checkbox id='+idjanela+'i3GEOtabelacalculaestat />'+$trad(27,i3GEOF.tabela.dicionario);
			ins += '		<p class="paragrafo" >'+$trad(28,i3GEOF.tabela.dicionario)+': ';
			ins += $inputText("","",idjanela+"i3GEOtabelaexcestat","",10,"");
			ins += '		<p class="paragrafo" ><input id='+idjanela+'i3GEOtabelabotao7 size=30  type=button value="'+$trad(5,i3GEOF.tabela.dicionario)+'"/>';
			ins += '		<input id='+idjanela+'i3GEOtabelabotao5 size=25  type=button value="'+$trad(29,i3GEOF.tabela.dicionario)+'"/>';
			ins += '		<form method=post style="display:none" id='+idjanela+'i3GEOtabelarelatorio action="'+i3GEO.configura.locaplic+'/ferramentas/tabela/relatorio.php" target="_blank" >';
			ins += '			<input type=hidden id='+idjanela+'i3GEOtabelaarearelh name=arearel value=nao />';
			ins += '			<input type=hidden id='+idjanela+'i3GEOtabelastatrelh name=statrel value=nao />';
			ins += '			<input type=hidden id='+idjanela+'i3GEOtabelatemarelh name=temarel value="" />';
			ins += '			<input type=hidden id='+idjanela+'i3GEOtabelag_sidh name=g_sid value="" />';
			ins += '			<input type=hidden id='+idjanela+'i3GEOtabelaitemagruparelh name=itemagruparel value="" />';
			ins += '			<input type=hidden id='+idjanela+'i3GEOtabelaitensrelh name=itensrel value="" />';
			ins += '			<input type=hidden id='+idjanela+'i3GEOtabelanomesrelh name=nomesrel value="" />';
			ins += '			<input type=hidden id='+idjanela+'i3GEOtabelaordemrel name=ordemrel value="" />';
			ins += '			<input type=hidden id='+idjanela+'i3GEOtabelaexcluirvalorh name=excluirvalor value="" />';
			ins += '			<input type=hidden id='+idjanela+'i3GEOtabelatiporelh name=tiporel value="" />';
			ins += '		</form>';
			ins += '	</div>';
			return ins;
		},
		/*
	Function: criaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
		 */
		iniciaJanelaFlutuante: function(){
			var minimiza,cabecalho,janela,divid,temp,titulo,
			id = "tabela"+parseInt(Math.random()*1000000,10);
			//i3GEO.janela.tempoMsg($trad(38,i3GEOF.tabela.dicionario));
			i3GEOF.tabela.janelas.push(id);
			i3GEOF.tabela.propJanelas[id] = {};
			i3GEOF.tabela.propJanelas[id].registros = [];
			i3GEOF.tabela.propJanelas[id].tema = i3GEO.temaAtivo;
			i3GEOF.tabela.propJanelas[id].atualiza = false;

			cabecalho = function(){
				i3GEOF.tabela.ativaFoco(id);
			};
			minimiza = function(){
				i3GEO.janela.minimiza(id);
			};
			duplica = function(){
				i3GEOF.tabela.iniciaJanelaFlutuante();
			};
			//cria a janela flutuante
			titulo = "<div  id='"+id+"i3GEOFtabelaComboCabeca' class='comboTemasCabecalho'></div>&nbsp;&nbsp;&nbsp;"+$trad(1,i3GEOF.tabela.dicionario)+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=39' >&nbsp;&nbsp;&nbsp;</a>";
			janela = i3GEO.janela.cria(
					"500px",
					"400px",
					"",
					"",
					"",
					titulo,
					id,
					false,
					"hd",
					cabecalho,
					minimiza,
					"",
					true,
					i3GEO.configura.locaplic+"/imagens/oxygen/16x16/view-form-table.png",
					duplica
			);
			divid = janela[2].id;
			if(i3GEOF.tabela.janelas.length > 1){
				temp = janela[0].cfg.config;
				janela[0].moveTo(temp.x.value + (i3GEOF.tabela.janelas.length * 50),temp.y.value + (i3GEOF.tabela.janelas.length * 15));
			}
			$i(id+"_corpo").style.backgroundColor = "white";
			i3GEOF.tabela.propJanelas[id].aguarde = $i(id+"_imagemCabecalho").style;
			i3GEOF.tabela.propJanelas[id].atualiza = true;
			//indica se a janela sera atualizada na navegacao
			temp = 'i3GEOF.tabela.propJanelas["'+id+'"].atualiza = this.checked';
			janela[0].setFooter("<div style=background-color:#F2F2F2; ><input class='inputsb' style='cursor:pointer;position:relative;top:2px;' onclick='"+temp+"' type=checkbox />&nbsp;"+$trad(41,i3GEOF.tabela.dicionario)+"</div>");


			i3GEOF.tabela.inicia(divid,id);
			//inicia os eventos
			if(i3GEO.Interface.ATUAL === "openlayers"){
				if(i3GEO.eventos.NAVEGAMAPA.toString().search('i3GEOF.tabela.atualizaListaDeRegistros()') < 0){
					i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.tabela.atualizaListaDeRegistros()");
				}
			}
			if(i3GEO.Interface.ATUAL === "googlemaps" && !tabelaDragend){
				tabelaDragend = google.maps.event.addListener(i3GeoMap, "dragend", function() {i3GEOF.tabela.atualizaListaDeRegistros();});
				tabelaZoomend = google.maps.event.addListener(i3GeoMap, "zoomend", function() {i3GEOF.tebela.atualizaListaDeRegistros();});
			}
			if(i3GEO.Interface.ATUAL === "googleearth" && !tabelaDragend){
				tabelaDragend = google.earth.addEventListener(i3GeoMap.getView(), "viewchangeend", function() {i3GEOF.tabela.atualizaListaDeRegistros();});
			}
			
			temp = function(){
				i3GEOF.tabela.janelas.remove(id);
				i3GEOF.tabela.propJanelas[id] = null;
				if(i3GEOF.tabela.janelas.length === 0){
					if(i3GEO.Interface.ATUAL === "openlayers"){
						i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.tabela.atualizaListaDeRegistros()");
					}
					if(i3GEO.Interface.ATUAL === "googlemaps"){
						google.maps.event.removeListener(tabelaDragend);
						google.maps.event.removeListener(tabelaZoomend);
					}
					if(i3GEO.Interface.ATUAL === "googleearth"){
						google.earth.removeEventListener(tabelaDragend);
					}
				}
			};
			YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		},
		atualizaCombosCabecalhos: function(){
			var i,id,
				n = i3GEOF.tabela.janelas.length;
			for(i=0;i<n;i++){
				id = i3GEOF.tabela.janelas[i];
				i3GEO.janela.comboCabecalhoTemas(id+"i3GEOFtabelaComboCabeca",id+"i3GEOFtabelaComboCabecaSel","tabela","ligadosComTabela");
			}
		},
		/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
		 */
		ativaFoco: function(id){
			if(i3GEOF.tabela.propJanelas[id].tema !== "" && i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.tabela.propJanelas[id].tema) === ""){
				i3GEO.janela.tempoMsg($trad(30,i3GEOF.tabela.dicionario));
			}
			var i = $i(id+"_c").style;
			i3GEO.janela.ULTIMOZINDEX++;
			i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
		},
		/*
	Function: novaJanela

	Abre a tabela em uma nova janela que pode conviver com outras tabelas
		 */
		novaJanela: function(){
			//TODO
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
			titulo = "&nbsp;&nbsp;&nbsp;"+i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.tabela.propJanelas[idjanela].tema).tema;
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
				i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
				if (retorno.data !== undefined){
					var ins,
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
		atualizaListaDeRegistros:function(){
			var i,
				janelas = i3GEOF.tabela.janelas,
				propJanelas = i3GEOF.tabela.propJanelas,
				n = janelas.length;
			for(i=0;i<n;i++){
				if(propJanelas[janelas[i]].atualiza === true){
					i3GEOF.tabela.pegaRegistros(janelas[i]);
				}
			}
		},
		/*
	Function: pegaRegistros

	Pega os registros da tabela de atributos do tema

	Veja:

	<LISTAREGISTROS>
		 */
		pegaRegistros: function(idjanela,tipolista,dadosDaClasse,inicio,fim,funcao){
			if(i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible")
			{return;}
			if(!idjanela){
				idjanela = "";
			}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
			$i(idjanela+"i3GEOtabelaregistros").innerHTML = "";
			var p,ext,
			tiporeg = "brasil",
			cp = new cpaint();
			//verifica se esta no modo de atualizacao automatica
			if(i3GEOF.tabela.propJanelas[idjanela].atualiza === true){
				tiporeg = "mapa";
			}
			if(!tipolista){
				if ($i(idjanela+"i3GEOtabelatipolista").checked){
					tipolista = "selecionados";
				}
				else{
					tipolista = "tudo";
				}
			}
			if(!dadosDaClasse){
				if ($i(idjanela+"i3GEOtabelalegenda").checked){
					dadosDaClasse = "sim";
				}
				else{
					dadosDaClasse = "nao";
				}
			}
			if(!inicio){
				inicio = $i(idjanela+"i3GEOtabelainicio").value - 1;
			}
			else{
				inicio = "";
			}
			if(!fim){
				fim = $i(idjanela+"i3GEOtabelafim").value - 1;
			}
			else{
				fim = "";
			}
			if(!funcao){
				funcao = function(retorno){
					i3GEOF.tabela.propJanelas[idjanela].registros = [];
					i3GEOF.tabela.montaTabela(retorno,idjanela);
				};
			}
			ext = i3GEO.parametros.mapexten;
			ext = i3GEO.util.extOSM2Geo(ext);
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+
				"&funcao=listaregistros"+
				"&inicio="+inicio+
				"&fim="+fim+
				"&tema="+i3GEOF.tabela.propJanelas[idjanela].tema+
				"&tipo="+tiporeg+
				"&tipolista="+tipolista+
				"&ext="+ext+
				"&dadosDaClasse="+dadosDaClasse;
			cp.set_response_type("JSON");
			cp.call(p,"listaRegistros",funcao);
		},
		/*
	Function: montaTabela

	Monta a visualiza&ccedil;&atilde;o da tabela de atributos
		 */
		montaTabela: function(retorno,idjanela){
			//TODO
			if (retorno.data !== undefined){
				var ins,
				i,
				vals,
				cor,
				j,
				n,
				stat,
				imagem,
				registros = i3GEOF.tabela.propJanelas[idjanela].registros,
				i3GEOtabelalegenda = $i(idjanela+"i3GEOtabelalegenda").checked;
				//cabecalho da tabela
				ins = "<table id="+idjanela+"i3GEOtabelatabelai class=lista8 >";
				ins += "<tr><td style='background-color:yellow'></td><td style='background-color:yellow'></td><td style='background-color:yellow'></td><td style='background-color:yellow'></td>";
				n = retorno.data[0].itens.length;
				for (i=0;i<n;i++){
					ins += "<td accessKey='"+(i * 1 + 4)+"' style='background-color:yellow' ><img style=cursor:pointer onclick='i3GEOF.tabela.excluiColuna(this,"+(i * 1 + 4)+")' src='"+i3GEO.configura.locaplic+"/imagens/x.gif' title='"+$trad("t12")+"' />&nbsp;<img style=cursor:pointer onclick='i3GEOF.tabela.ordenaColuna(this,"+(i * 1 + 4)+")' src='"+i3GEO.configura.locaplic+"/imagens/ordena1.gif' title='"+$trad(31,i3GEOF.tabela.dicionario)+"' /><br><span title='"+retorno.data[0].itens[i]+"'> <b>"+retorno.data[0].alias[i]+"</b></span></td>";
				}
				ins += "</tr>";
				cor = "linha";
				n = retorno.data[1].registros.length;
				if($i(idjanela+"i3GEOtabelafim").value === ""){
					$i(idjanela+"i3GEOtabelafim").value = n - 1;
				}
				for (i=0;i<n;i++){
					ins += "<tr><td><img style=cursor:pointer onclick='i3GEOF.tabela.excluiLinha(this)' src='"+i3GEO.configura.locaplic+"/imagens/x.gif' title='"+$trad("t12")+"' /></td>";
					ins += "<td>";
					if(retorno.data[1].registros[i].ext && retorno.data[1].registros[i].ext != ""){
						ins += "<img style=cursor:pointer onclick='i3GEOF.tabela.zoomExt(\""+retorno.data[1].registros[i].ext+"\",\""+idjanela+"\")' src='"+i3GEO.configura.locaplic+"/imagens/o.gif' title='zoom' ids="+retorno.data[1].registros[i].indice+" />";
					}
					ins += "</td>";
					stat = "";
					if(retorno.data[1].registros[i].status === "CHECKED"){
						stat = "CHECKED";
					}
					if(registros[retorno.data[1].registros[i].indice]){
						if(registros[retorno.data[1].registros[i].indice] === true){
							stat = "CHECKED";
						}
						else{
							stat = "";
						}
					}
					ins += "<td><input title='marca' onclick='i3GEOF.tabela.registraLinha(this,\""+idjanela+"\")' style='cursor:pointer;border:0px solid white;' type='checkbox' "+stat+"  name="+retorno.data[1].registros[i].indice+" /></td>";
					if(i3GEOtabelalegenda == true){
						imagem = retorno.data.legenda[retorno.data[1].registros[i].classe["indice"]];
						ins += "<td><img title='"+retorno.data[1].registros[i].classe["nome"]+"' src='"+imagem+"' /></td>";
					}
					else
					{ins += "<td></td>";}
					if(stat === "CHECKED"){
						registros[retorno.data[1].registros[i].indice] = true;
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
				$i(idjanela+"i3GEOtabelaregistros").innerHTML = ins;
			}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
		},
		/*
	Function: mais

	Avan&ccedil;a o contador de registros para a listagem
		 */
		mais:function(idjanela){
			if(i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible")
			{return;}
			var i = $i(idjanela+"i3GEOtabelainicio").value * 1,
			f = $i(idjanela+"i3GEOtabelafim").value * 1,
			d = f - i;
			$i(idjanela+"i3GEOtabelainicio").value = f + 1;
			$i(idjanela+"i3GEOtabelafim").value = f + d + 1;
			i3GEOF.tabela.pegaRegistros(idjanela);
		},
		/*
	Function: todos

	Avan&ccedil;a o contador de registros para o fim da listagem
		 */
		todos:function(idjanela){
			if(i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible")
			{return;}
			$i(idjanela+"i3GEOtabelainicio").value = 1;
			$i(idjanela+"i3GEOtabelafim").value = "";
			i3GEOF.tabela.pegaRegistros(idjanela,false,false,false,1,true);
		},
		/*
	Function: menos

	Retrocede o contador de registros para a listagem
		 */
		menos: function(idjanela){
			if(i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible")
			{return;}
			var i = $i(idjanela+"i3GEOtabelainicio").value * 1,
			f = $i(idjanela+"i3GEOtabelafim").value * 1,
			d = f - i;
			$i(idjanela+"i3GEOtabelainicio").value = i - d - 1;
			$i(idjanela+"i3GEOtabelafim").value = i - 1;
			if ($i(idjanela+"i3GEOtabelainicio").value < 1){
				$i(idjanela+"i3GEOtabelainicio").value = 1;
				$i(idjanela+"i3GEOtabelafim").value = 1 + d;
			}
			i3GEOF.tabela.pegaRegistros(idjanela);
		},
		/*
	Function: excluiColuna

	Exclui uma coluna da visualiza&ccedil;&atilde;o da tabela
		 */
		excluiColuna: function(coluna,cid){
			//TODO
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
			try{
				var tabela = $i(idjanela+"i3GEOtabelatabelai"),
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
				i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
			}catch(e){
				i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
		},
		/*
	Function: ordenaColuna

	Ordena uma coluna da tabela
		 */
		ordenaColuna: function(coluna,cid){
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
		zoomExt: function(ext,idjanela){
			if(i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible")
			{return;}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
			var funcao = function(){
				i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
				i3GEOF.tabela.pegaRegistros(idjanela);
				i3GEO.atualiza();
			};
			i3GEO.php.mudaext(funcao,"nenhum",ext);
		},
		registraLinha: function(linha,idjanela){
			i3GEOF.tabela.propJanelas[idjanela].registros[linha.name] = linha.checked;
		},
		/*
	Function: listaMarcados

	Retorna um array com os &iacute;ndices dos registros que est&atilde;o marcados.
		 */
		listaMarcados: function(idjanela){
			var lista = [],
			registros = i3GEOF.tabela.propJanelas[idjanela].registros,
			i,
			n = registros.length;
			for (i=0;i<n;i++){
				if (registros[i] === true){
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
		ativaSelecao: function(idjanela){
			if(i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible")
			{return;}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
			var lista = i3GEOF.tabela.listaMarcados(idjanela),
			p,
			cp,
			temp = function(retorno){
				if(retorno){
					i3GEO.Interface.atualizaTema(retorno,i3GEOF.tabela.propJanelas[idjanela].tema);
					i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
				}
			};
			p = i3GEO.configura.locaplic+"/ferramentas/tabela/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=incluisel&tema="+i3GEOF.tabela.propJanelas[idjanela].tema+"&ids="+lista.toString();
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"incluiSel",temp);
		},
		/*
	Function: limpaSelecao

	Limpa a sele&ccedil;&atilde;o do tema da tabela
		 */
		limpaSelecao: function(idjanela){
			if(i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible")
			{return;}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
			i3GEO.tema.limpasel(i3GEOF.tabela.propJanelas[idjanela].tema);
			i3GEOF.tabela.propJanelas[idjanela].registros = [];
			var lista = $i(idjanela+"i3GEOtabelatabelai").getElementsByTagName("input"),
			n = lista.length,
			i;
			for(i=0;i<n;i++){
				lista[i].checked = false;
			}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
		},
		/*
	Function: criaNovoTema

	Cria um novo tema contendo a sele&ccedil;&atilde;o existente
		 */
		criaNovoTema: function(idjanela){
			if(i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible")
			{return;}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
			var temp = function(retorno){
				i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
				i3GEO.atualiza(retorno);
			};
			i3GEO.php.criatemaSel(temp,i3GEOF.tabela.propJanelas[idjanela].tema);
		},
		/*
	Function: comboItens

	Cria um combo para selecionar um item do tema escolhido
		 */
		comboItensEstat: function(idjanela){
			var tema = i3GEOF.tabela.propJanelas[idjanela].tema;
			i3GEO.util.comboItens(
					idjanela+"i3GEOtabelaComboItensGuia3",
					tema,
					function(retorno){
						if(retorno.tipo === "erro"){
							$i(idjanela+"i3GEOtabelaitensGuia3").innerHTML = "<br><br><span style='color:red'>"+$trad(32,i3GEOF.tabela.dicionario)+"</span><br><br>";
						}
						else{
							$i(idjanela+"i3GEOtabelaitensGuia3").innerHTML = retorno.dados;
						}
					},
					idjanela+"i3GEOtabelaitensGuia3",
					""
			);
		},
		estatistica: function(idjanela){
			if($i(idjanela+"i3GEOtabelaComboItensGuia3").value === ""){
				i3GEO.janela.tempoMsg("Escolha um item!");
				return;
				}
			if(i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility === "visible")
			{return;}
			i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "visible";
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
					$i(idjanela+"i3GEOtabelaoperacoes").innerHTML = ins + "<br>";
					i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
				},
				exclui = "",
				cp = new cpaint(),
				p;
				if ($i(idjanela+"i3GEOtabelafiltro1").value !== "")
				{exclui = $i("i3GEOtabelafiltro1").value;}
				p = i3GEO.configura.locaplic+
					"/ferramentas/tabela/exec.php?g_sid="+i3GEO.configura.sid+
					"&funcao=estatistica&item="+$i(idjanela+"i3GEOtabelaComboItensGuia3").value+
					"&tema="+i3GEOF.tabela.propJanelas[idjanela].tema+
					"&exclui="+exclui+
					"&ext="+i3GEO.parametros.mapexten;
				cp.set_response_type("JSON");
				cp.call(p,"estatDescritivas",monta);
			}catch(e){
				i3GEOF.tabela.propJanelas[idjanela].aguarde.visibility = "hidden";
				$i("operacoes").innerHTML = "Ocorreu um erro: "+e;
			}
		},
		tabelaTexto:function(){
		},
		/*
	Function: relatorioTabela

	Monta o relat&oacute;rio padr&atilde;o em uma nova janela
		 */
		relatorioTabela: function(idjanela){
			try{
				$i(idjanela+"i3GEOtabelatiporelh").value = "";
				$i(idjanela+"i3GEOtabelaarearelh").value = $i(idjanela+"i3GEOtabelacalculaarea").checked;
				$i(idjanela+"i3GEOtabelastatrelh").value = $i(idjanela+"i3GEOtabelacalculaestat").checked;
				$i(idjanela+"i3GEOtabelaexcluirvalorh").value = $i(idjanela+"i3GEOtabelaexcestat").value;
				$i(idjanela+"i3GEOtabelatemarelh").value=i3GEOF.tabela.propJanelas[idjanela].tema;
				$i(idjanela+"i3GEOtabelag_sidh").value=i3GEO.configura.sid;
				$i(idjanela+"i3GEOtabelaitemagruparelh").value=$i(idjanela+"i3GEOtabelaagrupaItem").value;
				var inputs = $i(idjanela+"i3GEOtabelaitensrelatorio").getElementsByTagName("input"),
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
				$i(idjanela+"i3GEOtabelaordemrel").value=listaordem;
				$i(idjanela+"i3GEOtabelanomesrelh").value=listanomes;
				$i(idjanela+"i3GEOtabelaitensrelh").value=listai;
				temp = $i(idjanela+"i3GEOtabelarelatorio").action;
				$i(idjanela+"i3GEOtabelarelatorio").action += "?ext="+i3GEO.parametros.mapexten;
				$i(idjanela+"i3GEOtabelarelatorio").submit();
				$i(idjanela+"i3GEOtabelarelatorio").action = temp;
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
