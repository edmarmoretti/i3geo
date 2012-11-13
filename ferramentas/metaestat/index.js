/*
 Title: Cartogramas estat&iacute;sticos

 Arquivo:

 i3geo/ferramentas/metaestat/index.js

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
 Classe: i3GEOF.metaestat

 Gerencia os componentes do m&oacute;dulo de gera&ccedil;&atilde;o de cartogramas estat&iacute;sticos
 */
//TODO traduzir
i3GEOF.metaestat = {
	/**
	 * Tipo de interface utilizada para construcao dos parametros
	 */
	INTERFACE: "flutuante",
	CONEXAODEFAULT: 0,
	TOP: 50,
	LEFT: 100,
	LARGURA: 270,
	ALTURA: 300,
	//lista das camadas que foram adicionadas ao mapa
	CAMADAS: [],
	//dados das medidas obtidos para a ultima variavel escolhida
	DADOSMEDIDASVARIAVEL: [],
	//para efeitos de compatibilidade com i3GEO.mapa.dialogo
	criaJanelaFlutuante: function(){
		i3GEOF.metaestat.inicia();
	},
	inicia: function(){
		i3GEOF.metaestat.comum.iniciaDicionario();
	},
	analise: {
		inicia: function(iddiv){
			var ics,n,i;
			if(!iddiv || !$i(iddiv)){
				iddiv = "i3geoCartoAnalise_corpo";
			}
			if(i3GEOF.metaestat.INTERFACE == "flutuante"){
				i3GEOF.metaestat.analise.abreJanela();
			}
			$i(iddiv).innerHTML = i3GEOF.metaestat.analise.html();
			ics = $i(iddiv).getElementsByTagName("button");
			n = ics.length;
			for(i=0;i<n;i++){
				ics[i].style.backgroundColor = "white";
				ics[i].className = "iconeGuiaMovel";
				ics[i].onmouseout = function(){this.className = "iconeGuiaMovel iconeGuiaMovelMouseOut";};
				ics[i].onmouseover = function(){this.className = "iconeGuiaMovel iconeGuiaMovelMouseOver";};
				ics[i].style.backgroundImage = "none";
				ics[i].style.height = "32px";
				ics[i].style.width = "32px";
				ics[i].style.border = "1px solid gray";
				ics[i].style.margin = "0px";
				ics[i].style.position = "relative";
			}
			i3GEOF.metaestat.analise.comboCamadas();
		},
		abreJanela: function(){
			var cabecalho,minimiza,imagemxy,janela;
			if (!$i("i3geoCartoAnalise")){
				cabecalho = function(){
				};
				minimiza = function(){
					i3GEO.janela.minimiza("i3geoCartoAnalise");
				};
				janela = i3GEO.janela.cria(
						"270px",
						"170px",
						"",
						"",
						"",
						$trad(11,i3GEOF.metaestat.dicionario),
						"i3geoCartoAnalise",
						false,
						"hd",
						cabecalho,
						minimiza
				);
				janela = janela[0];
				YAHOO.i3GEO.janela.manager.register(janela);
				janela.render();
			}
			else{
				janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoAnalise");
			}
			janela.show();
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			janela.moveTo(imagemxy[0]+(i3GEOF.metaestat.LEFT*2)+i3GEOF.metaestat.LARGURA+10,i3GEOF.metaestat.TOP);
		},
		html: function(){
			var ins = '<div id="i3geoCartoAnaliseContainer" style="margin-left:5px;line-height:25px">' +
			'	<button title="Localizar regi&atilde;o" onclick="i3GEO.mapa.dialogo.locregiao()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/open-street-maps.png" /></button>' +
			'	<button title="Mostra no mapa as regi&otilde;es" onclick="i3GEOF.metaestat.analise.mostraRegiao()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/open-street-maps-show.png" /></button>' +
			'	<button title="Filtrar regi&atilde;o" onclick="i3GEO.mapa.dialogo.filtraregiao()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/open-street-maps-filtro.png" /></button>' +
			'	<button title="Filtrar per&iacute;odo" onclick="i3GEOF.metaestat.analise.filtraPeriodo.inicia()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/open-street-maps-filtrotime.png" /></button>' +
			'	<button title="Tabela com os dados" onclick="i3GEO.tema.dialogo.tabela()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/table.png" /></button>' +
			'	<button title="Gr&aacute;fico interativo" onclick="i3GEO.analise.dialogo.graficoInterativo()"><img src="'+i3GEO.configura.locaplic+'/imagens/oxygen/22x22/view_statistics.png" /></button>' +
			'	<button title="Opacidade" onclick="i3GEO.mapa.dialogo.opacidade()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/layer-opacity.png" /></button>' +
			'	<button title="Anima&ccedil;&atilde;o" onclick="i3GEOF.metaestat.analise.ativaAnimacao()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/player-forward.png" /></button>' +
			'	<button title="Alterar classifica&ccedil;&atilde;o" onclick="i3GEOF.metaestat.analise.alteraClasses()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/calculator.png" /></button>' +
			'	<button title="Alterar cores" onclick="i3GEOF.metaestat.analise.alteraCores()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/24-to-8-bits.png" /></button>' +
			'	<button title="'+$trad("t42")+'" onclick="i3GEO.tema.dialogo.cortina()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/mapset.png" /></button>' +
			'	<button title="'+$trad("t49")+'" onclick="i3GEOF.metaestat.analise.ativaTme()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/3d-light.png" /></button>' +
			'	<button title="Estat&iacute;sticas gerais" onclick="i3GEOF.metaestat.analise.estatistica()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/stats.png" /></button>' +
			'	<button title="Ativa/Desativa contorno" onclick="i3GEOF.metaestat.analise.contorno()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/boundary-remove-add.png" /></button>' +
			'	<button title="Altera representa&ccedil;&atilde;o" onclick="i3GEOF.metaestat.analise.alteraRep()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/shape.png" /></button>' +
			'	<button title="Mapa de calor" onclick="i3GEOF.metaestat.analise.calor()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/dem.png" /></button>' +
			'</div>' +
			'<div id="i3geoCartoAnaliseCamadas" style="margin-left:5px;line-height:25px"></div>' +
			'<input type=hidden  value="" id="listaColourRampAnaliseMetaestat" onchange="i3GEOF.metaestat.analise.aplicaColourRamp()" />'; //utilizado pelo seletor de colourramp
			return ins;
		},
		comboCamadas: function(){
			if(!$i("i3geoCartoAnaliseCamadas")){
				return;
			}
			var temp = function(retorno){
				var temas = retorno.data,
					n = temas.length,
					i,t,ins;
				ins = "<p class=paragrafo style='position:relative;top:5px;'>Ativar a camada:</p><select id='i3geoCartoAnaliseCamadasCombo' onchange='i3GEOF.metaestat.comum.ativaCamada(this.value)' style='width:250px;' ><option value=''>---</option>";
				for(i=0;i<n;i++){
					t = i3GEO.arvoreDeCamadas.pegaTema(temas[i]);
					if(t != ""){
						ins += "<option value='"+temas[i]+"'>"+t.tema+"</option>";
					}
				}
				$i("i3geoCartoAnaliseCamadas").innerHTML = ins+"</select>";
				if(i3GEO.temaAtivo != ""){
					$i("i3geoCartoAnaliseCamadasCombo").value = i3GEO.temaAtivo;
				}
				//if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search('i3GEOF.metaestat.analise.comboCamadas()') < 0)
				//{i3GEO.eventos.ATUALIZAARVORECAMADAS.push('i3GEOF.metaestat.analise.comboCamadas()');}
			};
			i3GEO.php.listaCamadasMetaestat(temp);
		},
		alteraRep: function(){
			if(typeof(i3GEOF.alterarep) === 'undefined'){
				i3GEO.util.scriptTag(
						i3GEO.configura.locaplic+"/ferramentas/metaestat/alterarep.js",
						"i3GEOF.alterarep.iniciaJanelaFlutuante()",
						"i3GEOF.alterarep_script"
				);
			}
			else{
				i3GEOF.alterarep.iniciaJanelaFlutuante();
			}
		},
		calor: function(){
			if($i("i3geoCartoAnaliseCamadasCombo").value == ""){
				i3GEO.janela.tempoMsg("Ative uma camada primeiro");
				return;
			}
			if(!window.confirm("Gera o mapa de calor? Isso pode demorar...")){
				return;
			}
			i3GEO.janela.tempoMsg("Ser&aacute; considerada apenas a regi&atilde;o mostrada no mapa");
			i3GEO.mapa.ativaTema($i("i3geoCartoAnaliseCamadasCombo").value);
			var p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?g_sid="+i3GEO.configura.sid +
				"&funcao=calor&tema="+$i("i3geoCartoAnaliseCamadasCombo").value+"&ext="+i3GEO.parametros.mapexten,
				temp = function(retorno){
					i3GEO.janela.fechaAguarde("aguardecalor");
					i3GEO.atualiza();
				};
			i3GEO.janela.abreAguarde("aguardecalor","Aguarde...");
			i3GEO.util.ajaxGet(p,temp);
		},
		mostraRegiao: function(){
			if(typeof(i3GEOF.mostraregiao) === 'undefined'){
				i3GEO.util.scriptTag(
						i3GEO.configura.locaplic+"/ferramentas/metaestat/mostraregiao.js",
						"i3GEOF.mostraregiao.iniciaJanelaFlutuante()",
						"i3GEOF.mostraregiao_script"
				);
			}
			else{
				i3GEOF.mostraregiao.iniciaJanelaFlutuante();
			}
		},
		contorno: function(){
			if($i("i3geoCartoAnaliseCamadasCombo").value == ""){
				i3GEO.janela.tempoMsg("Ative uma camada primeiro");
				return;
			}
			i3GEO.mapa.ativaTema($i("i3geoCartoAnaliseCamadasCombo").value);
			var p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?g_sid="+i3GEO.configura.sid +
				"&funcao=alteraContorno&tema="+$i("i3geoCartoAnaliseCamadasCombo").value,
				temp = function(retorno){
					i3GEO.janela.fechaAguarde("aguardecontorno");
					i3GEO.atualiza();
					i3GEO.Interface.atualizaTema("",i3GEO.temaAtivo);
					i3GEO.arvoreDeCamadas.atualizaLegenda(i3GEO.temaAtivo);
				};
			i3GEO.janela.abreAguarde("aguardecontorno","Aguarde...");
			i3GEO.util.ajaxGet(p,temp);
		},
		ativaTme: function(){
			if($i("i3geoCartoAnaliseCamadasCombo").value == ""){
				i3GEO.janela.tempoMsg("Ative uma camada primeiro");
				return;
			}
			i3GEO.mapa.ativaTema($i("i3geoCartoAnaliseCamadasCombo").value);
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.tme()","tme","tme","index.js","i3GEOF.metaestat.analise.abreTme()");
		},
		abreTme: function(){
			//i3GEOF.tme.ITEMNOMEREGIOES
			var p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?g_sid="+i3GEO.configura.sid +
				"&funcao=pegaDadosTME&tema="+i3GEO.temaAtivo,
				temp = function(retorno){
					i3GEO.janela.fechaAguarde("aguardeBuscaDados");
					i3GEOF.tme.ITEMNOMEREGIOES = retorno.data.itemNomeRegioes;
					i3GEOF.tme.ITEMDADOS = retorno.data.itemDados;
					i3GEOF.tme.iniciaJanelaFlutuante();
				};
			i3GEO.janela.abreAguarde("aguardeBuscaDados","Aguarde...");
			i3GEO.util.ajaxGet(p,temp);
		},
		estatistica: function(){
			if($i("i3geoCartoAnaliseCamadasCombo").value == ""){
				i3GEO.janela.tempoMsg("Ative uma camada primeiro");
				return;
			}
			i3GEO.mapa.ativaTema($i("i3geoCartoAnaliseCamadasCombo").value);
			//primeiro pega o nome da coluna que contem os dados
			//depois busca as estatisticas
			var p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?g_sid="+i3GEO.configura.sid +
				"&funcao=pegaDadosTME&tema="+i3GEO.temaAtivo,
				temp = function(retorno){
					if(retorno && retorno.data && retorno.data.itemDados != ""){
						var item = retorno.data.itemDados,
							p = i3GEO.configura.locaplic+"/ferramentas/tabela/exec.php?g_sid=" +
							i3GEO.configura.sid+"&funcao=estatistica&item="+item+
							"&tema="+i3GEO.temaAtivo+"&exclui=&ext="+i3GEO.parametros.extentTotal,
							monta = function(retorno){
								i3GEO.janela.fechaAguarde("aguardeBuscaDados");
								var ins = "",
									nometema,
									nome,
									valor,
									i,
									n;
								nometema = i3GEO.arvoreDeCamadas.pegaTema(i3GEO.temaAtivo);
								if(nometema && nometema.tema){
									ins = "<p style='text-align:left'> <span style='color:gray'><b>Camada: </b></span>"+nometema.tema+"</p>" +
										"<p style='text-align:left'> <span style='color:gray'><b>Coluna: </b></span>"+item+"</p>";
								}
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
								i3GEO.janela.mensagemSimples(ins,"Estat&iacute;sticas");
							};
						i3GEO.util.ajaxGet(p,monta);
					}
					else{
						i3GEO.janela.fechaAguarde("aguardeBuscaDados");
						i3GEO.janela.tempoMsg("Ocorreu algum erro");
					}
				};
			i3GEO.janela.abreAguarde("aguardeBuscaDados","Aguarde...");
			i3GEO.util.ajaxGet(p,temp);
		},
		ativaAnimacao: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.animacao()","animacao","animacao","index.js","i3GEOF.metaestat.analise.listaCamadasAnimacao()");
		},
		listaCamadasAnimacao: function(){
			var temp = function(retorno){
				var temas = retorno.data,
					n = temas.length,
					camadas = [],
					i,t;
				i3GEOF.animacao.iniciaJanelaFlutuante();
				for(i=0;i<n;i++){
					t = i3GEO.arvoreDeCamadas.pegaTema(temas[i]);
					if(t != ""){
						camadas.push(t);
					}
				}
				i3GEOF.animacao.listaDeCamadas(camadas);
			};
			i3GEO.php.listaCamadasMetaestat(temp);
		},
		ativaEditorLegenda: function(){
			if($i("i3geoCartoAnaliseCamadasCombo").value == ""){
				i3GEO.janela.tempoMsg("Ative uma camada primeiro");
				return;
			}
			i3GEO.mapa.ativaTema($i("i3geoCartoAnaliseCamadasCombo").value);
			i3GEOF.legenda.iniciaJanelaFlutuante();
			i3GEO.guias.mostraGuiaFerramenta('i3GEOlegendaguia2','i3GEOlegendaguia');
			//desmarca a opcao que considera apenas os elementos visiveis
			if($i("i3GEOFlegendaaplicaextent")){
				$i("i3GEOFlegendaaplicaextent").checked = false;
			}
			if($i("i3GEOFlegendaClassesOpcionais")){
				$i("i3GEOFlegendaClassesOpcionais").style.display = "none";
			}
			var temp = $i("i3GEOF.legenda_corpo");
			temp.getElementsByTagName("div")[0].style.display = "none";
		},
		alteraClasses: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.editaLegenda()","legenda","legenda","index.js","i3GEOF.metaestat.analise.ativaEditorLegenda()");
		},
		alteraCores: function(){
			//listaColourRampAnaliseMetaestat e o id do elemento input que recebera a lista de cores
			i3GEO.util.abreColourRamp("","listaColourRampAnaliseMetaestat",10);
		},
		//disparado no evento onchange do input que guarda o numero de cores
		aplicaColourRamp: function(){
			var i = $i("listaColourRampAnaliseMetaestat");
			if(i.value != ""){
				var p,temp,cores = i.value;
				temp = function(){
					i3GEO.janela.fechaAguarde("aguardeAplicaCores");
					i3GEO.atualiza();
					i3GEO.Interface.atualizaTema("",i3GEO.temaAtivo);
					i3GEO.arvoreDeCamadas.atualizaLegenda(i3GEO.temaAtivo);
				};
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid +
					"&funcao=alteraclasse&opcao=aplicacoresrgb&ext=" +
					i3GEO.parametros.mapexten +
					"&tema="+i3GEO.temaAtivo +
					"&cores=" + cores;
				i3GEO.janela.AGUARDEMODAL = true;
				i3GEO.janela.abreAguarde("aguardeAplicaCores","Aplicando...");
				i3GEO.janela.AGUARDEMODAL = false;
				i3GEO.util.ajaxGet(p,temp);
			}
		},
		filtraPeriodo: {
			//CAMADAS: "",
			inicia: function(){
				i3GEO.janela.tempoMsg("Ao agregar dados por per&iacute;odo a forma de c&aacute;lculo (soma ou m&eacute;dia) &eacute; mantida conforme o orginal da camada j&aacute; existente");
				if($i("i3GEOF.filtraperiodo_corpo")){
					return;
				}
				var minimiza,cabecalho,titulo,ins;
				cabecalho = function(){
				};
				minimiza = function(){
					i3GEO.janela.minimiza("i3GEOF.filtraperiodo");
				};
				//cria a janela flutuante
				titulo = "Filtro&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>";
				i3GEO.janela.cria(
					"260px",
					"340px",
					"",
					"",
					"",
					titulo,
					"i3GEOF.filtraperiodo",
					false,
					"hd",
					cabecalho,
					minimiza
				);
				$i("i3GEOF.filtraperiodo_corpo").style.backgroundColor = "white";
				ins = "" +
				'<p class=paragrafo ><b>Camada que receber&aacute; o filtro:</b></p>' +
				'<div id="i3GEOF.filtraperiodo.camadas" ></div>' +
				'<p class=paragrafo ><b>In&iacute;cio do per&iacute;odo:</b></p>' +
				'<div id="i3GEOF.filtraperiodo.Pi_0" ></div>' +
				'<p class=paragrafo ><b>Fim do per&iacute;odo:</b></p>' +
				'<div id="i3GEOF.filtraperiodo.Pf_0" ></div>' +
				'<br><br><input id=i3geofiltraperiodoAplica type="button" value="Aplicar" />' +
				'<input id=i3geofiltraperiodoRemove type="button" value="Remover" />';
				$i("i3GEOF.filtraperiodo_corpo").innerHTML = ins;
				new YAHOO.widget.Button(
					"i3geofiltraperiodoAplica",
					{onclick:{fn: i3GEOF.metaestat.analise.filtraPeriodo.adicionaFiltro}}
				);
				new YAHOO.widget.Button(
					"i3geofiltraperiodoRemove",
					{onclick:{fn: function(){}}}
				);
				i3GEOF.metaestat.analise.filtraPeriodo.comboCamadas();
			},
			comboCamadas: function(retorno){
				var temp = function(retorno){
					//i3GEOF.metaestat.analise.filtraPeriodo.CAMADAS = retorno.data;
					var i,
						n = retorno.data.length,
						ins = '<select id="i3GEOF.filtraperiodo.comboCamada" onchange="javascript:i3GEOF.metaestat.analise.filtraPeriodo.comboParametrosReinicia();i3GEOF.metaestat.analise.filtraPeriodo.comboParametros()" style="width:220px;" id="i3GEOF.filtraperiodo.temas" ><option value="">---</option>';
					for(i=0;i<n;i++){
						ins += '<option value="'+retorno.data[i].layer+'" >'+retorno.data[i].nome+'</option>';
					}
					ins += "</select><br><br>";
					$i("i3GEOF.filtraperiodo.camadas").innerHTML = ins;
				};
				i3GEO.util.ajaxGet(
					i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?funcao=listaCamadasFiltroTempo&g_sid="+i3GEO.configura.sid,
					temp
				);
			},
			comboParametrosReinicia: function(operacao){
				$i("i3GEOF.filtraperiodo.Pi_0").innerHTML = "";
				$i("i3GEOF.filtraperiodo.Pf_0").innerHTML = "";
			},
			comboParametros: function(){
				if($i("i3GEOF.filtraperiodo.comboCamada").value == ""){
					return;
				}
				if($i("i3GEOF.filtraperiodo.Pi_0").innerHTML == ""){
					i3GEOF.metaestat.analise.filtraPeriodo.parametro(0);
					return;
				}
			},
			parametro: function(nivel){
				var layer = $i("i3GEOF.filtraperiodo.comboCamada").value,
					temp = function(retorno){
						var n = retorno.data.length,
							i,
							ins = "";
						if(retorno.data[0] && retorno.data[0].id_pai){
							for(i=0;i<n;i++){
								ins += "<option value='"+retorno.data[i].id_parametro_medida+"'>"+retorno.data[i].nome+"</option>";
							}
							$i("i3GEOF.filtraperiodo.Pi_"+nivel).innerHTML = "<p class=paragrafo>Nome do par&acirc;metro:<br>" +
								"<select name='' onchange='i3GEOF.metaestat.analise.filtraPeriodo.valoresParametro(this.value,"+nivel+",\"Pi_"+nivel+"\")' style='wisth:150px;'>" +
								"<option value='' >---</option>"+ins+"</select></p><div class=paragrafo id='Pi_"+nivel+"'></div>";
							$i("i3GEOF.filtraperiodo.Pf_"+nivel).innerHTML = "<p class=paragrafo>Nome do par&acirc;metro:<br>" +
								"<select name='' onchange='i3GEOF.metaestat.analise.filtraPeriodo.valoresParametro(this.value,"+nivel+",\"Pf_"+nivel+"\")' style='wisth:150px;'>" +
								"<option value='' >---</option>"+ins+"</select></p><div class=paragrafo id='Pf_"+nivel+"'></div>";
						}
					};
				i3GEO.util.ajaxGet(
					i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?funcao=listaFiltroTempo&g_sid="+i3GEO.configura.sid+"&layer="+layer+"&nivel="+nivel,
					temp
				);
			},
			valoresParametro: function(id_parametro_medida,nivel,onde){
				if(id_parametro_medida === ""){
					$i(onde).innerHTML = "";
					return;
				}
				var temp = function(retorno){
					var ins="",i=0,n = retorno.length;
					ins += "<p class=paragrafo>Valor:<br>" +
							"<select name='"+id_parametro_medida+"' onchange='i3GEOF.metaestat.analise.filtraPeriodo.parametro("+(nivel*1 + 1)+")' style='wisth:150px;background-color:yellow;'><option value=''>---</option>";
					for(i=0;i<n;i++){
						ins += "<option value='"+retorno[i]+"'>"+retorno[i]+"</option>";
					}
					$i(onde).innerHTML =  ins+"</select>";
				};
				i3GEO.php.listaValoresParametroMedidaVariavel(id_parametro_medida,temp);
			},
			adicionaFiltro: function(){
				i3GEO.janela.tempoMsg("O filtro de tempo n&atilde;o modifica as camadas que foram criadas considerando-se uma data espec&iacute;fica");
				var p,pini,pfim,
				temp = function(retorno){
					i3GEO.janela.fechaAguarde("aguardeAplicaFiltro");
					i3GEO.Interface.atualizaMapa();
				};
				i3GEO.janela.AGUARDEMODAL = true;
				i3GEO.janela.abreAguarde("aguardeAplicaFiltro","Aplicando...");
				i3GEO.janela.AGUARDEMODAL = false;
				//pega o filtro
				pini = i3GEOF.metaestat.analise.filtraPeriodo.pegaParametros("i3GEOF.filtraperiodo.Pi_0");
				pfim = i3GEOF.metaestat.analise.filtraPeriodo.pegaParametros("i3GEOF.filtraperiodo.Pf_0");
				//
				p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?funcao=aplicaFiltroTempo" +
					"&pari="+pini[0] +
					"&vali="+pini[1] +
					"&parf="+pfim[0] +
					"&valf="+pfim[1] +
					"&tema="+$i("i3GEOF.filtraperiodo.comboCamada").value +
					"&g_sid="+i3GEO.configura.sid;
				if(pini[0].length == 0 || pini[1].length == 0){
					i3GEO.janela.fechaAguarde("aguardeAplicaFiltro");
					return;
				}
				i3GEO.util.ajaxGet(p,temp);
			},
			removeFiltro: function(){
				var p,
				temp = function(retorno){
					i3GEO.janela.fechaAguarde("aguardeAplicaFiltro");
					i3GEO.Interface.atualizaMapa();
				};
				i3GEO.janela.AGUARDEMODAL = true;
				i3GEO.janela.abreAguarde("aguardeAplicaFiltro","Aplicando...");
				i3GEO.janela.AGUARDEMODAL = false;
				p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?funcao=removeFiltroTempo" +
					"&tema="+$i("i3GEOF.filtraperiodo.comboCamada").value +
					"&g_sid="+i3GEO.configura.sid;
				i3GEO.util.ajaxGet(p,temp);
			},
			pegaParametros:function(id){
				var c = $i(id).getElementsByTagName("select"),
					n = c.length,
					par = [],
					val = [],
					i;
				if(!c){
					return [par,val];
				}
				for(i=0;i<n;i++){
					if(c[i].name != "" && c[i].value != ""){
						par.push(c[i].name);
						val.push(c[i].value);
					}
				}
				return [par,val];
			}
		}
	},
	classes:{
		inicia: function(iddiv){
			if(!$i("i3geoCartoComboMedidasVariavel")){
				i3GEO.janela.tempoMsg("erro: i3geoCartoComboMedidasVariavel???");
				return;
			}
			if(!iddiv || !$i(iddiv)){
				iddiv = "i3geoCartoClasses_corpo";
			}
			if(i3GEOF.metaestat.INTERFACE == "flutuante"){
				i3GEOF.metaestat.classes.abreJanela();
			}
			$i(iddiv).innerHTML = i3GEOF.metaestat.classes.html();
			i3GEOF.metaestat.classes.comboTipoRep();
			i3GEOF.metaestat.classes.comboTipoClassificacao();
			i3GEOF.metaestat.classes.comboRegiao();
		},
		abreJanela: function(){
			var cabecalho,minimiza,imagemxy,janela;
			if (!$i("i3geoCartoClasses")){
				cabecalho = function(){
				};
				minimiza = function(){
					i3GEO.janela.minimiza("i3geoCartoClasses");
				};
				janela = i3GEO.janela.cria(
						i3GEOF.metaestat.LARGURA+"px",
						i3GEOF.metaestat.ALTURA+"px",
						"",
						"",
						"",
						$trad(6,i3GEOF.metaestat.dicionario),
						"i3geoCartoClasses",
						false,
						"hd",
						cabecalho,
						minimiza
				);
				janela = janela[0];
				YAHOO.i3GEO.janela.manager.register(janela);
				janela.render();
			}
			else{
				janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoClasses");
			}
			janela.show();
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			janela.moveTo(imagemxy[0]+i3GEOF.metaestat.LEFT+i3GEOF.metaestat.LARGURA+10,i3GEOF.metaestat.TOP);
		},
		destroiJanela: function(){
			var janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoClasses");
			if(janela){
				janela.destroy();
			}
		},
		html: function(){
			var ins = '<div id="i3geoCartoClassesContainer" style="margin-left:5px;">' +
			'<div class="paragrafo" id="i3geoCartoTipoRep" >' +
			'</div>' +
			'<div class="paragrafo" id="i3geoCartoTipoClassificacao" >' +
			'</div>' +
			'<div class="paragrafo" id="i3geoCartoRegioesMedidasVariavel" >' +
			'</div>' +
			'</div>';
			return ins;
		},
		botaoAdicionarCamada: function(){
			new YAHOO.widget.Button(
					"i3GEOcartoBotaoAdicionarCamada",
					{onclick:{fn: i3GEOF.metaestat.comum.adicionaCamada}}
			);
			$i("i3GEOcartoBotaoAdicionarCamada-button").style.width = i3GEOF.metaestat.LARGURA - 25 + "px";
		},
		comboTipoRep: function(){
			var onde = $i("i3geoCartoTipoRep"),
			ins,i,
			dados = [
			         {"codigo":"polygon","nome":"pol&iacute;gonos"},
			         {"codigo":"point","nome":"pontos"}
			         ],
			         n = dados.length;
			ins = '<p style="text-align:left;"><input type="button" id="i3GEOcartoBotaoAdicionarCamada" onclick="i3GEOF.metaestat.principal.maisInfo()" value="'+$trad(7,i3GEOF.metaestat.dicionario)+'"class="paragrafo" style="cursor:pointer;color:blue" /></p>' +
			'<br><p class="paragrafo" >'+$trad(8,i3GEOF.metaestat.dicionario)+'</p>' +
			"<select id='i3geoCartoComboTipoRep' style='box-shadow:0 1px 5px gray;width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange=''>";
			for(i=0;i<n;i++){
				ins += "<option value='"+dados[i].codigo+"'>"+dados[i].nome+"</option>";
			}
			ins += "</select>";
			if(onde){
				onde.innerHTML = ins;
				i3GEOF.metaestat.classes.botaoAdicionarCamada();
			}
			return ins;
		},
		comboTipoClassificacao: function(){
			var onde = $i("i3geoCartoTipoClassificacao"),
			combo = $i("i3geoCartoComboMedidasVariavel"),
			temp = function(dados){
				var n = dados.length,
				ins = '<p class="paragrafo" >'+$trad(9,i3GEOF.metaestat.dicionario)+'</p>',
				i;
				ins += "<select id='i3geoCartoComboTipoClassificacao' style='width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange='i3GEOF.metaestat.classes.comboTipoClassificacaoOnchange(this)'><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option title='"+dados[i].observacao+"' value='"+dados[i].id_classificacao+"'>"+dados[i].nome+"</option>";
				}
				ins += "</select>";
				//{"id_classificacao":"1","nome":"Pela media","id_medida_variavel":"1","observacao":""}
				if(onde){
					onde.innerHTML = ins;
				}
				return ins;
			};
			if(combo.value != ""){
				i3GEOF.metaestat.comum.aguarde(onde);
				i3GEO.php.listaClassificacaoMedida(combo.value,temp);
			}
			else{
				onde.innerHTML = "";
			}
		},
		comboTipoClassificacaoOnchange: function(){

		},
		comboRegiao: function(id_medida_variavel){
			i3GEOF.metaestat.comum.aguarde($i("i3geoCartoRegioesMedidasVariavel"));
			var onde = $i("i3geoCartoRegioesMedidasVariavel"),
			combo = $i("i3geoCartoComboMedidasVariavel"),
			temp = function(dados){
				var n = dados.length,
				ins = '<p class="paragrafo" >'+$trad(13,i3GEOF.metaestat.dicionario)+'</p>',
				i;
				ins += "<select id='i3geoCartoComboRegioesMedidasVariavel' style='width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' ><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option title='"+dados[i].observacao+"' value='"+dados[i].codigo_tipo_regiao+"'>"+dados[i].nome_tipo_regiao+"</option>";
				}
				ins += "</select>";
				if(onde){
					onde.innerHTML = ins;
				}
				return ins;
			};
			if(combo.value != ""){
				i3GEOF.metaestat.comum.aguarde(onde);
				i3GEO.php.listaRegioesMedidaVariavel(combo.value,temp);
			}
		}
	},
	comum:{
		iniciaDicionario: function(){
			if(typeof(i3GEOF.metaestat.dicionario) === 'undefined'){
				i3GEO.util.scriptTag(
						i3GEO.configura.locaplic+"/ferramentas/metaestat/dicionario.js",
						"i3GEOF.metaestat.principal.inicia()",
						"i3GEOF.metaestat.dicionario_script"
				);
			}
			else{
				i3GEOF.metaestat.principal.inicia();
			}
		},
		desligaCamadas: function(){
			if(i3GEOF.metaestat.CAMADAS.length > 0){
				i3GEO.arvoreDeCamadas.ligaDesligaTemas(i3GEOF.metaestat.CAMADAS.join(","),false);
			}
		},
		adicionaCamada: function(){
			//function mapfileMedidaVariavel($id_medida_variavel,$filtro="",$todasascolunas = 0,$tipolayer="polygon",$titulolayer="",$id_classificacao="",$agruparpor=""){
			var v = i3GEOF.metaestat.comum.verificaParametros(),
			temp = function(retorno){
				if(i3GEO.arvoreDeCamadas.pegaTema(retorno.layer) == ""){
					i3GEOF.metaestat.comum.desligaCamadas();
					var atualiza = function(){
						i3GEO.atualiza();
						i3GEOF.metaestat.CAMADAS.push(retorno.layer);
						i3GEO.mapa.ativaTema(retorno.layer);
						i3GEOF.metaestat.analise.comboCamadas();
					};
					i3GEO.php.adtema(atualiza,retorno.mapfile);

				}
			};
			if(v != true){
				i3GEO.janela.tempoMsg("erro: "+v);
			}
			i3GEO.php.mapfileMedidaVariavel(
					temp,
					$i("i3geoCartoComboMedidasVariavel").value,
					i3GEOF.metaestat.comum.defineFiltro(),
					0,
					$i("i3geoCartoComboTipoRep").value,
					i3GEOF.metaestat.comum.defineTitulo(),
					$i("i3geoCartoComboTipoClassificacao").value,
					i3GEOF.metaestat.comum.defineAgruparPor(),
					$i("i3geoCartoComboRegioesMedidasVariavel").value
			);
		},
		ativaCamada: function(camada){
			if(i3GEOF.metaestat.CAMADAS.length > 0){
				i3GEO.arvoreDeCamadas.ligaDesligaTemas(i3GEOF.metaestat.CAMADAS.join(","),false);
				i3GEO.arvoreDeCamadas.ligaDesligaTemas(camada,true);
				i3GEO.mapa.ativaTema(camada);
			}
		},
		defineTitulo: function(){
			//se nao tiver parametros, filtro e vazio
			if(i3GEOF.metaestat.parametros.dados.length == 0){
				return "";
			}
			//se tiver parametro e todos estiverem vazios, aborta
			var i,n,c,titulo,
			t=[],
			dados = i3GEOF.metaestat.parametros.dados;
			titulo = $i("i3geoCartoComboVariavel").options[$i("i3geoCartoComboVariavel").selectedIndex].label +" - "+
			$i("i3geoCartoComboMedidasVariavel").options[$i("i3geoCartoComboMedidasVariavel").selectedIndex].label +" - "+
			$i("i3geoCartoComboTipoRep").options[$i("i3geoCartoComboTipoRep").selectedIndex].label +" - "+
			$i("i3geoCartoComboTipoClassificacao").options[$i("i3geoCartoComboTipoClassificacao").selectedIndex].label + " - " +
			$i("i3geoCartoComboRegioesMedidasVariavel").options[$i("i3geoCartoComboRegioesMedidasVariavel").selectedIndex].label;
			n = dados.length;
			for(i=0;i<n;i++){
				c = $i("comboparametro_"+dados[i].id_parametro_medida+"_"+dados[i].id_pai);
				if(c && c.value != ""){
					t.push(dados[i].nome+" = "+c.value);
				}
			}
			if(t.length > 0){
				return titulo+" - "+t.join(", ");
			}
			else{
				return titulo;
			}
		},
		defineFiltro: function(){
			//se nao tiver parametros, filtro e vazio
			if(i3GEOF.metaestat.parametros.dados.length == 0){
				return "";
			}
			//se tiver parametro e todos estiverem vazios, aborta
			var i,n,c,
			t=[],
			dados = i3GEOF.metaestat.parametros.dados;
			n = dados.length;
			for(i=0;i<n;i++){
				c = $i("comboparametro_"+dados[i].id_parametro_medida+"_"+dados[i].id_pai);
				if(c && c.value != ""){
					t.push(dados[i].coluna+"="+c.value);
				}
			}
			if(t.length > 0){
				return t.join(" and ");
			}
			else{
				return "";
			}
		},
		defineAgruparPor: function(){
			//se nao tiver parametros, filtro e vazio
			if(i3GEOF.metaestat.parametros.dados.length == 0){
				return "";
			}
			//se tiver parametro e todos estiverem vazios, aborta
			var i,n,c,
			t=[],
			dados = i3GEOF.metaestat.parametros.dados;
			n = dados.length;
			for(i=0;i<n;i++){
				c = $i("comboparametro_"+dados[i].id_parametro_medida+"_"+dados[i].id_pai);
				if(c && c.value != ""){
					t.push(dados[i].coluna);
				}
			}
			if(t.length > 0){
				return t.join(",");
			}
			else{
				return "";
			}
		},
		verificaParametros: function(){
			var ok = true,
			combos = ["i3geoCartoComboVariavel","i3geoCartoComboMedidasVariavel","i3geoCartoComboTipoRep","i3geoCartoComboTipoClassificacao"],
			n = combos.length,
			i,temp;
			for(i=0;i<n;i++){
				temp = $i(combos[i]);
				if(!temp){
					return combos[i];
				}
				if(temp.value == ""){
					return combos[i];
				}
			}
			return ok;
		},
		aguarde: function(obj){
			if(!obj){
				return "<img style='display:block;z-index:2' src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' />";
			}
			var i = $i(obj.id+"_imagem");
			if(!i){
				obj.innerHTML = "<img id='"+obj.id+"_imagem' style='display:block;z-index:2' src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' />";
			}
			else{
				if(i.style.display == "block"){
					i.style.display = "none";
				}
				else{
					i.style.display = "block";
				}
			}
		}
	},
	editor: {
		inicia: function(){
			YAHOO.namespace("admin.container");
			if(typeof(i3GEOF.metaestat.dicionario1) === 'undefined'){
				i3GEO.util.scriptTag(
					i3GEO.configura.locaplic+"/ferramentas/metaestat/dicionario1.js",
					"i3GEOF.metaestat.editor.dependenciasjs0()",
					"i3GEOF.metaestat.dicionario1_script"
				);
			}
			else{
				i3GEOF.metaestat.editor.dependenciasjs0();
			}
		},
		//carrega os javascripts do sistema de administracao e que tbm sao usados aqui
		dependenciasjs0: function(){
			i3GEO.util.scriptTag(
					i3GEO.configura.locaplic+"/admin/js/core.js",
					"i3GEOF.metaestat.editor.dependenciasjs1()",
					"i3GEOF.metaestat.dependenciasjs0_script"
			);
		},
		dependenciasjs1: function(){
			i3GEO.util.scriptTag(
					i3GEO.configura.locaplic+"/admin/js/estat_variavel.js",
					"i3GEOF.metaestat.editor.ativa()",
					"i3GEOF.metaestat.dependenciasjs1_script"
			);
		},
		ativa: function(iddiv){
			var loginok = function(){
				i3GEOadmin.variaveis.inicia();
				if(!iddiv){
					iddiv = "i3geoCartoEditor_corpo";
				}
				if(i3GEOF.metaestat.INTERFACE == "flutuante"){
					i3GEOF.metaestat.editor.abreJanela();
				}
				$i(iddiv).innerHTML = i3GEOF.metaestat.editor.html();
				i3GEOF.metaestat.editor.t0();
			},
			loginNok = function(){
				i3GEO.janela.tempoMsg("Voc&ecirc; precisa fazer login para usar essa op&ccedil;&atilde;o");
			};
			//verifica login
			i3GEO.login.verificaOperacao("admin/metaestat/geral",i3GEO.configura.locaplic, loginok, "sessao",loginNok);
		},
		abreJanela: function(){
			var cabecalho,minimiza,imagemxy,janela;
			if (!$i("i3geoCartoEditor")){
				cabecalho = function(){};
				minimiza = function(){
					i3GEO.janela.minimiza("i3geoCartoEditor");
				};
				janela = i3GEO.janela.cria(
						"400px",
						"280px",
						"",
						"",
						"",
						$trad(1,i3GEOF.metaestat.dicionario1),
						"i3geoCartoEditor",
						false,
						"hd",
						cabecalho,
						minimiza
				);
				janela = janela[0];
				YAHOO.i3GEO.janela.manager.register(janela);
				janela.render();
			}
			else{
				janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoEditor");
			}
			janela.show();
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			janela.moveTo(imagemxy[0]+i3GEOF.metaestat.LEFT+i3GEOF.metaestat.LARGURA+20,i3GEOF.metaestat.TOP+20);
		},
		html: function(){
			var ins = '';
			ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;margin-left:5px;" id="i3GEOFmetaestatEditor" >';
			ins +=	'</div>';
			return ins;
		},
		criaVariavel: function(){
			i3GEOadmin.variaveis.aposGravar = function(){
				core_carregando("desativa");
				//refaz o conteudo para mostrar a nova adicao
				i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t1");
				// Enome e o id do input onde o usuario escolheu o nome da nova variavel
				i3GEOF.metaestat.editor.t1(true,$i("Enome").value);
				i3GEOF.metaestat.principal.inicia();
			};
			i3GEOadmin.variaveis.editar("variavel","");
		},
		editaVariavel: function(){
			i3GEOadmin.variaveis.aposGravar = function(){
				core_carregando("desativa");
				//refaz o conteudo para mostrar a nova adicao
				i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t1");
				// Enome e o id do input onde o usuario escolheu o nome da nova variavel
				i3GEOF.metaestat.editor.t1(true,$i("Enome").value);
				i3GEOF.metaestat.principal.inicia();
			};
			var codigo_variavel = $i("i3geoCartoComboVariavelEditor").value;
			if(codigo_variavel !== ""){
				i3GEOadmin.variaveis.editar("variavel",codigo_variavel);
			}
		},
		criaMedidaVariavel: function(){
			i3GEOadmin.variaveis.aposGravar = function(){
				core_carregando("desativa");
				//refaz o conteudo para mostrar a nova adicao
				i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t2");
				// Enome e o id do input onde o usuario escolheu o nome da nova variavel
				i3GEOF.metaestat.editor.t2(true,$i("Enomemedida").value);
				i3GEOF.metaestat.principal.inicia();
			};
			i3GEOadmin.variaveis.editar("medidaVariavel","");
			//passa o codigo da variavel
			$i("Ecodigo_variavel").value = $i("i3geoCartoComboVariavelEditor").value;
			//define os valores que sao padrao
			//a conexao e com o default
			$i("Ecodigo_estat_conexao").value = i3GEOF.metaestat.CONEXAODEFAULT;
			//o esquema e o public
			$i("Eesquemadb").value = "i3geo_metaestat";
			//a tabela onde ficarao os dados
			$i("Etabela").value = "indicadores_bairro";
			//coluna com os valores
			$i("Ecolunavalor").value = "valor_num";
			//id que liga com o geo
			$i("Ecolunaidgeo").value = "codigoregiao";
			//id unico
			$i("Ecolunaidunico").value = "gid";
			//unidade de medida
			$i("Ecodigo_unidade_medida").value = 1;
			//periodo
			$i("Ecodigo_tipo_periodo").value = 0;
			//impede a alteracao do filtro
			$i("Efiltro").disabled = "disabled";
		},
		editaMedidaVariavel: function(){
			i3GEOadmin.variaveis.aposGravar = function(){
				core_carregando("desativa");
				//refaz o conteudo para mostrar a nova adicao
				i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t2");
				// Enome e o id do input onde o usuario escolheu o nome da nova variavel
				i3GEOF.metaestat.editor.t2(true,$i("Enomemedida").value);
				i3GEOF.metaestat.principal.inicia();
			};
			var id_medida_variavel = $i("i3geoCartoComboMedidaVariavelEditor").value;
			if(id_medida_variavel !== ""){
				i3GEOadmin.variaveis.editar("medidaVariavel",id_medida_variavel);
			}
		},
		criaClassificacao: function(){
			i3GEOadmin.variaveis.aposGravar = function(){
				core_carregando("desativa");
				//refaz o conteudo para mostrar a nova adicao
				i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t3");
				// Enome e o id do input onde o usuario escolheu o nome da nova variavel
				i3GEOF.metaestat.editor.t3(true,$i("Enome").value);
			};
			i3GEOadmin.variaveis.editar("classificacaoMedida","");
			$i("Eid_medida_variavel").value = $i("i3geoCartoComboMedidaVariavelEditor").value;
		},
		editaClassificacao: function(){
			i3GEOadmin.variaveis.aposGravar = function(){
				core_carregando("desativa");
				//refaz o conteudo para mostrar a nova adicao
				i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t3");
				// Enome e o id do input onde o usuario escolheu o nome da nova variavel
				i3GEOF.metaestat.editor.t4(true,$i("Enome").value);
			};
			var id_classificacao = $i("i3geoCartoComboClassificacoesEditor").value;
			if(id_classificacao !== ""){
				i3GEOadmin.variaveis.editar("classificacaoMedida",id_classificacao);
			}
		},
		removeEl:function(id){
			var no = $i(id);
			if(no){
				no.parentNode.removeChild(no);
			}
		},
		selComboPorTexto: function(idcombo,texto){
			var c = $i(idcombo),n,i;
			if(c){
				n = c.options.length;
				for(i=0;i<n;i++){
					if(c.options[i].label === texto){
						c.options[i].selected = true;
						return;
					}
				}
			}
		},
		/**
		 * Obtem um parametro da medida variavel escolhida. Os parametros sao obtidos da chamada em ajax que pega a lista de medidas de uma variavel
		 */
		dadoMedidaSelecionada: function(parametro){
			var c = $i("i3geoCartoComboMedidaVariavelEditor"),n,i;
			if(c){
				n = c.options.length;
				for(i=0;i<n;i++){
					if(c.options[i].selected === true){
						if(i3GEOF.metaestat.DADOSMEDIDASVARIAVEL[i-1]){
							return i3GEOF.metaestat.DADOSMEDIDASVARIAVEL[i-1][parametro];
						}
						else{
							return "";
						}
					}
				}
			}
			else{
				return "";
			}
		},
		comboVariaveisOnchange: function(){
			i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t2");
		},
		comboMedidaVariavelOnchange: function(combo){
			i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t3");
		},
		quartis: function(){
			var id_medida_variavel = $i("i3geoCartoComboMedidaVariavelEditor").value,
			id_classificacao = $i("i3geoCartoComboClassificacoesEditor").value,
			cores = $i("listaColourRampEditor").value,
			p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=calculaClassificacao&tipo=quartil&cores="+cores+"&id_classificacao="+id_classificacao+"&id_medida_variavel="+id_medida_variavel+"&g_sid="+i3GEO.configura.sid,
			temp = function(retorno){
				core_carregando("desativa");
			};
			if(cores == ""){
				alert("Escolha as cores primeiro");
				return;
			}
			core_carregando("ativa");
			i3GEO.util.ajaxGet(p,temp);
		},
		intervalosIguais: function(){
			var id_medida_variavel = $i("i3geoCartoComboMedidaVariavelEditor").value,
			id_classificacao = $i("i3geoCartoComboClassificacoesEditor").value,
			cores = $i("listaColourRampEditor").value,
			p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=calculaClassificacao&tipo=intiguais5&cores="+cores+"&id_classificacao="+id_classificacao+"&id_medida_variavel="+id_medida_variavel+"&g_sid="+i3GEO.configura.sid,
			temp = function(retorno){
				core_carregando("desativa");
			};
			if(cores == ""){
				alert("Escolha as cores primeiro");
				return;
			}
			core_carregando("ativa");
			i3GEO.util.ajaxGet(p,temp);
		},
		/**
		 * Abertura do ajudante
		 *
		 **/
		t0: function(){
			var ins = "<p class='paragrafo' >" + $trad(2,i3GEOF.metaestat.dicionario1) +
			"<br><br><p><input id=i3GEOFmetaestatEditorBotaot01 type='button' value='"+$trad(3,i3GEOF.metaestat.dicionario1)+"' />" +
			"&nbsp<input id=i3GEOFmetaestatEditorBotaot02 type='button' value='"+$trad(4,i3GEOF.metaestat.dicionario1)+"' />" +
			"&nbsp<input id=i3GEOFmetaestatEditorBotaot03 type='button' value='Upload' />";
			i3GEO.util.proximoAnterior("","i3GEOF.metaestat.editor.t1()",ins,"i3GEOF.metaestat.editor.t0","i3GEOFmetaestatEditor");
			new YAHOO.widget.Button(
					"i3GEOFmetaestatEditorBotaot01",
					{onclick:{fn: function(){window.open(i3GEO.configura.locaplic+"/admin/html/estat_variavel.html");}}}
			);
			new YAHOO.widget.Button(
					"i3GEOFmetaestatEditorBotaot02",
					{onclick:{fn: function(){
						/*
						var v = $i("i3geoCartoComboVariavel"),
							m = $i("i3geoCartoComboMedidasVariavel");
						if(!v || v.value === ""){
							i3GEO.janela.tempoMsg($trad(4,i3GEOF.metaestat.dicionario));
							return;
						}
						if(!m || m.value === ""){
							i3GEO.janela.tempoMsg($trad(14,i3GEOF.metaestat.dicionario));
							return;
						}
						 */
						i3GEO.janela.tempoMsg($trad(15,i3GEOF.metaestat.dicionario1));
						window.open(i3GEO.configura.locaplic+"/ferramentas/metaestat/editorlimites.php");
					}}}
			);
			new YAHOO.widget.Button(
					"i3GEOFmetaestatEditorBotaot03",
					{onclick:{fn: function(){
						var cabecalho,minimiza,janela;
						if (!$i("i3geoCartoUpload")){
							cabecalho = function(){
							};
							minimiza = function(){
								i3GEO.janela.minimiza("i3geoCartoUpload");
							};
							janela = i3GEO.janela.cria(
									"500px",
									"400px",
									i3GEO.configura.locaplic+"/ferramentas/metaestat/upload.html",
									"",
									"",
									"Upload",
									"i3geoCartoUpload",
									false,
									"hd",
									cabecalho,
									minimiza
							);
							janela = janela[0];
							YAHOO.i3GEO.janela.manager.register(janela);
							janela.render();
						}
						else{
							janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoUpload");
						}
						janela.show();
					}}}
			);
		},
		/**
		 * Edicao da variavel
		 */
		t1: function(remove,textoSelecionado){
			if(remove == true){
				//remove o conteudo anteriormente construido
				i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t1");
			}
			var temp = function(dados){
				var ins = "<p class='paragrafo' >" + $trad(1,i3GEOF.metaestat.dicionario) + "<br><br>" +
				"<span>" + i3GEOF.metaestat.principal.comboVariaveis(dados,"i3geoCartoComboVariavelEditor","i3GEOF.metaestat.editor.comboVariaveisOnchange(this)") + "</span>" +
				"<br><br><p><input id=i3GEOFmetaestatEditorBotao3 type='button' value='"+$trad(8,i3GEOF.metaestat.dicionario1)+"' />" +
				"&nbsp;<input id=i3GEOFmetaestatEditorBotao3a type='button' value='"+$trad(5,i3GEOF.metaestat.dicionario1)+"' /><br>";
				i3GEO.util.proximoAnterior("i3GEOF.metaestat.editor.t0()","i3GEOF.metaestat.editor.t2()",ins,"i3GEOF.metaestat.editor.t1","i3GEOFmetaestatEditor",true);
				new YAHOO.widget.Button(
						"i3GEOFmetaestatEditorBotao3",
						{onclick:{fn: i3GEOF.metaestat.editor.editaVariavel}}
				);
				$i("i3GEOFmetaestatEditorBotao3-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
				new YAHOO.widget.Button(
						"i3GEOFmetaestatEditorBotao3a",
						{onclick:{fn: i3GEOF.metaestat.editor.criaVariavel}}
				);
				$i("i3GEOFmetaestatEditorBotao3a-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
				if(textoSelecionado){
					i3GEOF.metaestat.editor.selComboPorTexto("i3geoCartoComboVariavelEditor",textoSelecionado);
				}
			};
			i3GEO.php.listaVariavel(temp);
		},
		/**
		 * Edicao da medida da variavel
		 *
		 */
		t2: function(remove,textoSelecionado){
			if(remove == true){
				//remove o conteudo anteriormente construido
				i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t2");
			}
			if($i("i3geoCartoComboVariavelEditor").value === ""){
				i3GEO.janela.tempoMsg($trad(4,i3GEOF.metaestat.dicionario));
				i3GEOF.metaestat.editor.t1(false);
			}
			else{
				var temp = function(dados){
					//guarda os dados
					var ins = "<p class='paragrafo' >" + $trad(2,i3GEOF.metaestat.dicionario) + "<br><br>" +
					"<span>" + i3GEOF.metaestat.principal.comboMedidasVariavel(dados,"i3geoCartoComboMedidaVariavelEditor","i3GEOF.metaestat.editor.comboMedidaVariavelOnchange(this)") + "</span>" +
					"<br><br><p><input id=i3GEOFmetaestatEditorBotao4 type='button' value='"+$trad(8,i3GEOF.metaestat.dicionario1)+"' />" +
					"&nbsp;<input id=i3GEOFmetaestatEditorBotao4a type='button' value='"+$trad(5,i3GEOF.metaestat.dicionario1)+"' /><br>";
					i3GEO.util.proximoAnterior("i3GEOF.metaestat.editor.t1()","i3GEOF.metaestat.editor.t3()",ins,"i3GEOF.metaestat.editor.t2","i3GEOFmetaestatEditor",true);
					new YAHOO.widget.Button(
							"i3GEOFmetaestatEditorBotao4",
							{onclick:{fn: i3GEOF.metaestat.editor.editaMedidaVariavel}}
					);
					$i("i3GEOFmetaestatEditorBotao4-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
					new YAHOO.widget.Button(
							"i3GEOFmetaestatEditorBotao4a",
							{onclick:{fn: i3GEOF.metaestat.editor.criaMedidaVariavel}}
					);
					$i("i3GEOFmetaestatEditorBotao4a-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
					if(textoSelecionado){
						i3GEOF.metaestat.editor.selComboPorTexto("i3geoCartoComboMedidaVariavelEditor",textoSelecionado);
					}
				},
				codigo_variavel = $i("i3geoCartoComboVariavelEditor").value;
				if(codigo_variavel == ""){
					i3GEO.janela.tempoMsg($trad(4,i3GEOF.metaestat.dicionario));
					i3GEOF.metaestat.editor.t1(false);
					return;
				}
				i3GEO.php.listaMedidaVariavel(codigo_variavel,temp);
			}
		},
		/**
		 * Edicao da classificacao
		 */
		t3: function(remove,textoSelecionado){
			if(remove == true){
				//remove o conteudo anteriormente construido
				i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t3");
			}
			if($i("i3geoCartoComboMedidaVariavelEditor").value === ""){
				i3GEO.janela.tempoMsg($trad(2,i3GEOF.metaestat.dicionario));
				i3GEOF.metaestat.editor.t2(false);
			}
			else{
				var temp = function(dados){
					var ins = "<p class='paragrafo' >" + $trad(7,i3GEOF.metaestat.dicionario1) + "<br><br>" +
					"<span>" + i3GEOF.metaestat.principal.comboClassificacoesMedidaVariavel(dados,"i3geoCartoComboClassificacoesEditor","") + "</span>" +
					"<br><br>"+$trad(14,i3GEOF.metaestat.dicionario1)+": " + i3GEOF.metaestat.editor.dadoMedidaSelecionada("unidade_medida") +
					"<br><br><p><input id=i3GEOFmetaestatEditorBotao5 type='button' value='"+$trad(8,i3GEOF.metaestat.dicionario1)+"' />" +
					"&nbsp;<input id=i3GEOFmetaestatEditorBotao5a type='button' value='"+$trad(5,i3GEOF.metaestat.dicionario1)+"' /><br>";
					i3GEO.util.proximoAnterior("i3GEOF.metaestat.editor.t2()","i3GEOF.metaestat.editor.t4()",ins,"i3GEOF.metaestat.editor.t3","i3GEOFmetaestatEditor",true);

					new YAHOO.widget.Button(
							"i3GEOFmetaestatEditorBotao5",
							{onclick:{fn: i3GEOF.metaestat.editor.editaClassificacao}}
					);
					$i("i3GEOFmetaestatEditorBotao5-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
					new YAHOO.widget.Button(
							"i3GEOFmetaestatEditorBotao5a",
							{onclick:{fn: i3GEOF.metaestat.editor.criaClassificacao}}
					);
					$i("i3GEOFmetaestatEditorBotao5a-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";

				};
				i3GEO.php.listaClassificacaoMedida($i("i3geoCartoComboMedidaVariavelEditor").value,temp);
			}
		},
		/**
		 * Edicao das classes
		 */
		t4: function(){
			//remove o conteudo anteriormente construido
			i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t4");
			if($i("i3geoCartoComboMedidaVariavelEditor").value === ""){
				i3GEO.janela.tempoMsg($trad(9,i3GEOF.metaestat.dicionario));
				i3GEOF.metaestat.editor.t3(false);
			}
			else{
				var temp = function(dados){
					var soma = i3GEOF.metaestat.editor.dadoMedidaSelecionada("permitesoma"),
					media = i3GEOF.metaestat.editor.dadoMedidaSelecionada("permitemedia"),
					ins = "<p class='paragrafo' >" + $trad(10,i3GEOF.metaestat.dicionario1) +
					"<br><br><p>" +
					"&nbsp;<input id=i3GEOFmetaestatEditorBotao8 type='button' value='"+$trad(13,i3GEOF.metaestat.dicionario1)+"' />" +
					"<br><br>";
					if(soma == 1 || media == 1){
						ins += "&nbsp;<input id=i3GEOFmetaestatEditorBotao6 type='button' value='"+$trad(11,i3GEOF.metaestat.dicionario1)+"' />" +
						"&nbsp;<input id=i3GEOFmetaestatEditorBotao7 type='button' value='"+$trad(12,i3GEOF.metaestat.dicionario1)+"' />";
					}
					ins += '<input type=hidden  value="" id="listaColourRampEditor"  />'; //utilizado pelo seletor de colourramp;
					i3GEO.util.proximoAnterior("i3GEOF.metaestat.editor.t3()","i3GEOF.metaestat.editor.t5()",ins,"i3GEOF.metaestat.editor.t4","i3GEOFmetaestatEditor",true);
					new YAHOO.widget.Button(
							"i3GEOFmetaestatEditorBotao8",
							{onclick:{fn: function(){
								i3GEO.util.abreColourRamp("","listaColourRampEditor",5);
							}}}
					);
					$i("i3GEOFmetaestatEditorBotao8-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
					if($i("i3GEOFmetaestatEditorBotao6")){
						new YAHOO.widget.Button(
								"i3GEOFmetaestatEditorBotao6",
								{onclick:{fn: i3GEOF.metaestat.editor.quartis}}
						);
						$i("i3GEOFmetaestatEditorBotao6-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
						new YAHOO.widget.Button(
								"i3GEOFmetaestatEditorBotao7",
								{onclick:{fn: i3GEOF.metaestat.editor.intervalosIguais}}
						);
						$i("i3GEOFmetaestatEditorBotao7-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
					}
				};
				i3GEO.php.listaClasseClassificacao($i("i3geoCartoComboClassificacoesEditor").value,temp);
			}
		}
	},
	parametros: {
		//guarda a lista de parametros
		dados: [],
		//obtem a lista com os parametros da medida
		//cria os combos para os parametros que sao pai de todos
		lista: function(id_medida_variavel){
			i3GEOF.metaestat.comum.aguarde($i("i3geoCartoParametrosMedidasVariavel"));
			var temp = function(dados){
				i3GEOF.metaestat.parametros.dados = dados;
				i3GEOF.metaestat.parametros.combos("0");
				i3GEOF.metaestat.comum.aguarde($i("i3geoCartoParametrosMedidasVariavel"));
			};
			i3GEO.php.listaParametrosMedidaVariavel(id_medida_variavel,temp);
		},
		//cria um combo para escolher os valores de um parametro
		combos: function(nivel){
			var dados = i3GEOF.metaestat.parametros.dados,
			n = dados.length,
			onde = $i("i3geoCartoParametrosMedidasVariavel"),
			idpar,idcombo,i,novoel,teste;
			//cria o combo para o parametro cujo id_pai for do nivel escolhido
			for(i=0;i<n;i++){
				if(dados[i].id_pai == nivel){
					idpar = "parametro_"+dados[i].id_parametro_medida;
					idcombo = "parametro_"+dados[i].id_parametro_medida+"_"+nivel;
					teste = i3GEOF.metaestat.parametros.retornaIdPai(dados[i].id_parametro_medida);
					if(teste != false){
						idpar = "parametro_"+teste;
					}
					if(!$i(idpar)){
						novoel = document.createElement("div");
						novoel.id = idpar;
						novoel.className = "paragrafo";
						onde.appendChild(novoel);
						onde = novoel;
					}
					onde = $i(idpar);
					if(!$i(idcombo)){
						i3GEOF.metaestat.comum.aguarde(onde);
						novoel = document.createElement("div");
						novoel.id = idcombo;
						novoel.className = "paragrafo";
						onde.appendChild(novoel);
						i3GEOF.metaestat.parametros.valoresCombo(dados[i].id_parametro_medida,dados[i].nome,nivel,onde,idcombo);
					}
				}
			}
		},
		valoresCombo: function(id_parametro_medida,titulo,nivel,onde,idcombo){
			var temp = function(dados){
				var n = dados.length,
				ins = "",
				oc = "'i3GEOF.metaestat.parametros.antesCombo();i3GEOF.metaestat.parametros.combos(\""+id_parametro_medida+"\")'",
				filho = i3GEOF.metaestat.parametros.retornaIdFilho(id_parametro_medida),
				i,novoel;
				if(filho == false){
					oc = "";
				}
				ins = "<p class=paragrafo >"+titulo+"</p>";
				ins += "<select id='combo"+idcombo+"' style='background:beige;width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange="+oc+" ><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option value='"+dados[i]+"'>"+dados[i]+"</option>";
				}
				ins += "</select>";
				novoel = document.createElement("div");
				novoel.className = "paragrafo";
				novoel.innerHTML = ins;
				i3GEOF.metaestat.comum.aguarde(onde);
				onde.appendChild(novoel);
			};
			i3GEO.php.listaValoresParametroMedidaVariavel(id_parametro_medida,temp);
		},
		antesCombo: function(){
			if(!$i("i3geoCartoClasses_corpo")){
				i3GEOF.metaestat.classes.inicia();
			}
		},
		//retorna o id do parametro que e filho de um outro parametro
		retornaIdFilho:function(pai){
			var dados = i3GEOF.metaestat.parametros.dados,
			n = dados.length,
			i;
			for(i=0;i<n;i++){
				if(dados[i].id_pai == pai){
					return dados[i].id_parametro_medida;
				}
			}
			return false;
		},
		//retorna o id do parametro que e pai de um outro parametro
		retornaIdPai:function(filho){
			var dados = i3GEOF.metaestat.parametros.dados,
			n = dados.length,
			i;
			for(i=0;i<n;i++){
				if(dados[i].id_parametro_medida == filho){
					return dados[i].id_pai;
				}
			}
			return false;
		}
	},
	principal: {
		inicia: function(iddiv){
			if(!iddiv || !$i(iddiv)){
				iddiv = "i3geoCartoParametros_corpo";
			}
			if(i3GEOF.metaestat.INTERFACE == "flutuante"){
				i3GEOF.metaestat.principal.abreJanela();
			}
			$i(iddiv).innerHTML = i3GEOF.metaestat.principal.html();
			i3GEOF.metaestat.principal.opcoesVariaveis();
		},
		abreJanela: function(){
			var cabecalho,minimiza,imagemxy,janela;
			if (!$i("i3geoCartoParametros")){
				cabecalho = function(){
				};
				minimiza = function(){
					i3GEO.janela.minimiza("i3geoCartoParametros");
				};
				janela = i3GEO.janela.cria(
						i3GEOF.metaestat.LARGURA+"px",
						i3GEOF.metaestat.ALTURA+"px",
						"",
						"",
						"",
						$trad("x57"),
						"i3geoCartoParametros",
						false,
						"hd",
						cabecalho,
						minimiza
				);
				janela = janela[0];
				YAHOO.i3GEO.janela.manager.register(janela);
				janela.render();
			}
			else{
				janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoParametros");
			}
			janela.show();
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			janela.moveTo(imagemxy[0]+i3GEOF.metaestat.LEFT,i3GEOF.metaestat.TOP);
		},
		html: function(){
			var ins = '<div id="i3geoCartoVariaveisContainer" style="margin-left:5px;">' +
			'<div class="paragrafo" id="i3geoCartoVariaveis" >' +
			'</div>' +
			'<div class="paragrafo" id="i3geoCartoMedidasVariavel" >' +
			'</div>' +
			'<div class="paragrafo" id="i3geoCartoParametrosMedidasVariavel" >' +
			'</div>' +
			'</div>';
			return ins;
		},
		maisInfo: function(){
			var temp = "",
			v = $i("i3geoCartoComboVariavel");
			if(!v || v.value === ""){
				i3GEO.janela.tempoMsg($trad(4,i3GEOF.metaestat.dicionario));
			}
			else{
				var cabecalho,minimiza,janela;
				if (!$i("i3geoCartoMaisInfo")){
					cabecalho = function(){
					};
					minimiza = function(){
						i3GEO.janela.minimiza("i3geoCartoMaisInfo");
					};
					janela = i3GEO.janela.cria(
							"400px",
							"300px",
							"",
							"",
							"",
							$trad(5,i3GEOF.metaestat.dicionario),
							"i3geoCartoMaisInfo",
							false,
							"hd",
							cabecalho,
							minimiza
					);
					janela = janela[0];
					YAHOO.i3GEO.janela.manager.register(janela);
					janela.render();
					//YAHOO.util.Event.addListener(janela.close, "click", i3GEOF.metaestat.fechaJanelaParametros);
				}
				else{
					janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoMaisInfo");
				}
				janela.setBody(i3GEOF.metaestat.comum.aguarde());
				temp = function(retorno){
					janela.setBody(retorno);
					janela.show();
					//imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
					//janela.moveTo(imagemxy[0]+i3GEOF.metaestat.LEFT,imagemxy[1]+i3GEOF.metaestat.TOP);
				};
				i3GEO.php.relatorioVariavel(v.value,temp);
			}
		},
		comboVariaveis: function(dados,idcombo,stronchange){
			var ins,i,n = dados.length;
			ins = "<select id='"+idcombo+"' style='box-shadow:0 1px 5px gray;width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange='"+stronchange+"'><option value=''>---</option>";
			for(i=0;i<n;i++){
				ins += "<option title='"+dados[i].descricao+"' value='"+dados[i].codigo_variavel+"'>"+dados[i].nome+"</option>";
			}
			ins += "</select>";
			return ins;
		},
		botaoInfo: function(){
			new YAHOO.widget.Button(
					"i3GEOcartoBotaoInfo",
					{onclick:{fn: i3GEOF.metaestat.principal.maisInfo}}
			);
			$i("i3GEOcartoBotaoInfo-button").style.width = (i3GEOF.metaestat.LARGURA / 2) - 15 + "px";
		},
		botaoJanelaEditor: function(){
			new YAHOO.widget.Button(
					"i3GEOcartoBotaoEditor",
					{onclick:{fn: i3GEOF.metaestat.editor.inicia}}
			);
			$i("i3GEOcartoBotaoEditor-button").style.width = (i3GEOF.metaestat.LARGURA / 2) - 15 + "px";
		},
		botaoJanelaClasses: function(){
			new YAHOO.widget.Button(
					"i3GEOcartoBotaoClasses",
					{onclick:{fn: i3GEOF.metaestat.classes.inicia}}
			);
			$i("i3GEOcartoBotaoClasses-button").style.width = (i3GEOF.metaestat.LARGURA / 2) - 15 + "px";
		},
		botaoJanelaAnalise: function(){
			new YAHOO.widget.Button(
					"i3GEOcartoBotaoAnalise",
					{onclick:{fn: i3GEOF.metaestat.analise.inicia}}
			);
			$i("i3GEOcartoBotaoAnalise-button").style.width = (i3GEOF.metaestat.LARGURA / 2) - 15 + "px";
		},
		opcoesVariaveis: function(){
			var onde = $i("i3geoCartoVariaveis"),
			temp = function(dados){
				var ins = '';
				//botao para obter mais info
				ins = '<p style="text-align:left;"><input type="button" id="i3GEOcartoBotaoInfo" value="'+$trad(3,i3GEOF.metaestat.dicionario)+'"class="paragrafo" style="width:200px;cursor:pointer;color:blue" />' +
				'<input type="button" id="i3GEOcartoBotaoEditor" value="'+$trad(12,i3GEOF.metaestat.dicionario)+'"class="paragrafo" style="width:200px;cursor:pointer;color:blue" /></p>' +
				'<br><p style="text-align:left;"><input type="button" id="i3GEOcartoBotaoClasses" value="'+$trad(10,i3GEOF.metaestat.dicionario)+'"class="paragrafo" style="width:200px;cursor:pointer;color:blue" />' +
				'<input type="button" id="i3GEOcartoBotaoAnalise" value="'+$trad(11,i3GEOF.metaestat.dicionario)+'"class="paragrafo" style="width:200px;cursor:pointer;color:blue" /></p>' +
				'<br><p class="paragrafo" >'+$trad(1,i3GEOF.metaestat.dicionario)+'</p>';
				ins += i3GEOF.metaestat.principal.comboVariaveis(dados,"i3geoCartoComboVariavel","i3GEOF.metaestat.principal.comboVariaveisOnchange(this)");
				if(onde){
					onde.innerHTML = ins;
					i3GEOF.metaestat.principal.botaoInfo();
					i3GEOF.metaestat.principal.botaoJanelaEditor();
					i3GEOF.metaestat.principal.botaoJanelaClasses();
					i3GEOF.metaestat.principal.botaoJanelaAnalise();
				}
				return ins;
			};
			i3GEOF.metaestat.comum.aguarde(onde);
			i3GEO.php.listaVariavel(temp);
		},
		comboVariaveisOnchange: function(combo){
			if(combo.value != ""){
				i3GEOF.metaestat.principal.opcoesMedidasVariavel(combo.value);
			}
			else{
				$i("i3geoCartoMedidasVariavel").innerHTML = "";
			}
			$i("i3geoCartoParametrosMedidasVariavel").innerHTML = "";
			i3GEOF.metaestat.classes.destroiJanela();
		},
		comboMedidasVariavel: function(dados,idcombo,stronchange,filtroesquema){
			i3GEOF.metaestat.DADOSMEDIDASVARIAVEL = dados;
			var n = dados.length,
			ins = '',
			i;
			ins += "<select id='"+idcombo+"' style='width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange='"+stronchange+"'><option value=''>---</option>";
			for(i=0;i<n;i++){
				if(!filtroesquema || (filtroesquema && dados[i].esquemadb != filtroesquema)){
					ins += "<option value='"+dados[i].id_medida_variavel+"'>"+dados[i].nomemedida+"</option>";
				}
			}
			ins += "</select>";
			return ins;
		},
		opcoesMedidasVariavel: function(codigo_variavel){
			var onde = $i("i3geoCartoMedidasVariavel"),
			temp = function(dados){
				var ins = '<p class="paragrafo" >'+$trad(2,i3GEOF.metaestat.dicionario)+'</p>';
				ins += i3GEOF.metaestat.principal.comboMedidasVariavel(dados,"i3geoCartoComboMedidasVariavel","i3GEOF.metaestat.principal.comboMedidaVariavelOnchange(this)");
				if(onde){
					onde.innerHTML = ins;
				}
				return ins;
			};
			i3GEOF.metaestat.comum.aguarde(onde);
			i3GEO.php.listaMedidaVariavel(codigo_variavel,temp);
		},
		comboMedidaVariavelOnchange: function(combo){
			if(combo.value != ""){
				i3GEOF.metaestat.classes.inicia();
				i3GEOF.metaestat.parametros.lista(combo.value);
			}
			else{
				$i("i3geoCartoParametrosMedidasVariavel").innerHTML = "";
				i3GEOF.metaestat.classes.destroiJanela();
			}
		},
		comboClassificacoesMedidaVariavel: function(dados,idcombo){
			var ins,i,n = dados.length;
			ins = "<select id='"+idcombo+"' style='box-shadow:0 1px 5px gray;width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange='i3GEOF.metaestat.principal.comboClassificacoesMedidaVariavelOnchange(this)'><option value=''>---</option>";
			for(i=0;i<n;i++){
				ins += "<option title='"+dados[i].observacao+"' value='"+dados[i].id_classificacao+"'>"+dados[i].nome+"</option>";
			}
			ins += "</select>";
			return ins;
		},
		comboClassificacoesMedidaVariavelOnchange: function(combo){

		}
	}
};