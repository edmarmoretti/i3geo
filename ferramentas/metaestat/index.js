/*
 T i*tle: Cartogramas estat&iacute;sticos

 Arquivo:

 i3geo/ferramentas/metaestat/index.js

 Licenca:

 GPL2

 i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

 Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
 Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

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
 C l*asse: i3GEOF.metaestat

 Gerencia os componentes do m&oacute;dulo de gera&ccedil;&atilde;o de cartogramas estat&iacute;sticos
 */
i3GEOF.metaestat = {
	/**
	 * Tipo de interface utilizada para construcao dos parametros
	 */
	INTERFACE: "flutuante",
	TOP: 50,
	LEFT: 100,
	LARGURA: 270,
	ALTURA: 300,
	//lista das camadas que foram adicionadas ao mapa
	CAMADAS: [],
	//para efeitos de compatibilidade com i3GEO.mapa.dialogo
	criaJanelaFlutuante: function(){
		i3GEOF.metaestat.inicia();
	},
	inicia: function(){
		i3GEOF.metaestat.comum.iniciaDicionario();
	},
	analise: {
		inicia: function(iddiv){
			if(!iddiv || !$i(iddiv)){
				iddiv = "i3geoCartoAnalise_corpo";
			}
			if(i3GEOF.metaestat.INTERFACE == "flutuante"){
				i3GEOF.metaestat.analise.abreJanela();
			}
			$i(iddiv).innerHTML = i3GEOF.metaestat.analise.html();
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
					i3GEOF.metaestat.LARGURA+"px",
					i3GEOF.metaestat.ALTURA+"px",
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
			var ins = '<div id="i3geoCartoAnaliseContainer" style="margin-left:5px;">' +
			'</div>';
			return ins;
		}
	},
	classes:{
		inicia: function(iddiv){
			if(!$i("i3geoCartoComboMedidasVariavel")){
				alert("erro: i3geoCartoComboMedidasVariavel???");
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
								i3GEO.php.adtema(i3GEO.atualiza,retorno.mapfile);
								i3GEOF.metaestat.CAMADAS.push(retorno.layer);
							}
						};
						if(v != true){
							alert("erro: "+v);
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
					//TODO incluir botao para remover registros
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
							//TODO inserir fontes e links
						};
						i3GEOadmin.variaveis.editar("medidaVariavel","");
						//passa o codigo da variavel
						$i("Ecodigo_variavel").value = $i("i3geoCartoComboVariavelEditor").value;
						//define os valores que sao padrao
						//a conexao e com o default
						$i("Ecodigo_estat_conexao").value = 0;
						//o esquema e o public
						$i("Eesquemadb").value = "public";
						//a tabela onde ficarao os dados
						$i("Etabela").value = "indicadores_bairro";
						//coluna com os valores
						$i("Ecolunavalor").value = "valor_num";
						//id que liga com o geo
						$i("Ecolunaidgeo").value = "codigoregiao";
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
							i3GEOF.metaestat.editor.t3(true,$i("Enome").value);
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
					comboVariaveisOnchange: function(){
						i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t2");
					},
					comboMedidaVariavelOnchange: function(combo){
						i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t3");
					},
					quartis: function(){
						//TODO
					},
					intervalosIguais: function(){

					},
					t0: function(){
						var ins = "<p class='paragrafo' >" + $trad(2,i3GEOF.metaestat.dicionario1) +
						"<br><br><p><input id=i3GEOFmetaestatEditorBotao1 type='button' value='"+$trad(3,i3GEOF.metaestat.dicionario1)+"' />" +
						"&nbsp<input id=i3GEOFmetaestatEditorBotao2 type='button' value='"+$trad(4,i3GEOF.metaestat.dicionario1)+"' />";
						i3GEO.util.proximoAnterior("","i3GEOF.metaestat.editor.t1()",ins,"i3GEOF.metaestat.editor.t0","i3GEOFmetaestatEditor");
						new YAHOO.widget.Button(
							"i3GEOFmetaestatEditorBotao1",
							{onclick:{fn: function(){window.open(i3GEO.configura.locaplic+"/admin/html/estat_variavel.html");}}}
						);
						//TODO editor grafico
						new YAHOO.widget.Button(
							"i3GEOFmetaestatEditorBotao2",
							{onclick:{fn: function(){alert("Oi");}}}
						);
					},
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
					t2: function(remove,textoSelecionado){
						if(remove == true){
							//remove o conteudo anteriormente construido
							i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t2");
						}
						if($i("i3geoCartoComboVariavelEditor").value === ""){
							alert($trad(4,i3GEOF.metaestat.dicionario));
							i3GEOF.metaestat.editor.t1(false);
						}
						else{
							var temp = function(dados){
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
								alert($trad(4,i3GEOF.metaestat.dicionario));
								i3GEOF.metaestat.editor.t1(false);
								return;
							}
							i3GEO.php.listaMedidaVariavel(codigo_variavel,temp);
						}
					},
					t3: function(remove,textoSelecionado){
						//TODO incluir opcao de upload de dados
						if(remove == true){
							//remove o conteudo anteriormente construido
							i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t3");
						}
						if($i("i3geoCartoComboMedidaVariavelEditor").value === ""){
							alert($trad(2,i3GEOF.metaestat.dicionario));
							i3GEOF.metaestat.editor.t2(false);
						}
						else{
							var temp = function(dados){
								var ins = "<p class='paragrafo' >" + $trad(7,i3GEOF.metaestat.dicionario1) + "<br><br>" +
								"<span>" + i3GEOF.metaestat.principal.comboClassificacoesMedidaVariavel(dados,"i3geoCartoComboClassificacoesEditor","") + "</span>" +
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
					t4: function(remove,textoSelecionado){
						//TODO incluir as opcoes de escolha de cores e criacao de classes por quartil e intervalos iguais
						if(remove == true){
							//remove o conteudo anteriormente construido
							i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t4");
						}
						if($i("i3geoCartoComboMedidaVariavelEditor").value === ""){
							alert($trad(9,i3GEOF.metaestat.dicionario));
							i3GEOF.metaestat.editor.t3(false);
						}
						else{
							var temp = function(dados){
								var ins = "<p class='paragrafo' >" + $trad(10,i3GEOF.metaestat.dicionario1) + "<br><br>" +
								"<span></span>" +
								"<br><br><p><input id=i3GEOFmetaestatEditorBotao6 type='button' value='"+$trad(11,i3GEOF.metaestat.dicionario1)+"' />" +
								"&nbsp;<input id=i3GEOFmetaestatEditorBotao7 type='button' value='"+$trad(12,i3GEOF.metaestat.dicionario1)+"' />";
								i3GEO.util.proximoAnterior("i3GEOF.metaestat.editor.t3()","i3GEOF.metaestat.editor.t5()",ins,"i3GEOF.metaestat.editor.t4","i3GEOFmetaestatEditor",true);
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
							alert($trad(4,i3GEOF.metaestat.dicionario));
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
					comboMedidasVariavel: function(dados,idcombo,stronchange){
						var n = dados.length,
						ins = '',
						i;
						ins += "<select id='"+idcombo+"' style='width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange='"+stronchange+"'><option value=''>---</option>";
						for(i=0;i<n;i++){
							ins += "<option value='"+dados[i].id_medida_variavel+"'>"+dados[i].nomemedida+"</option>";
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
						ins = "<select id='"+idcombo+"' style='box-shadow:0 1px 5px gray;width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange='i3GEOF.metaestat.principal.comboClassificacoesMedidaVariavelOnchange()'><option value=''>---</option>";
						for(i=0;i<n;i++){
							ins += "<option title='"+dados[i].observacao+"' value='"+dados[i].id_classificacao+"'>"+dados[i].nome+"</option>";
						}
						ins += "</select>";
						return ins;
					},
					comboClassificacoesMedidaVariavelOnchange: function(){

					}
				}
			};