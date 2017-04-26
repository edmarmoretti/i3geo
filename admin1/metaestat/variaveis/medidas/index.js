/*
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
i3GEOadmin.medidas = {
		//variavel global indicando o elemento que recebera a lista de variaveis
		ondeLista: "",
		codigo_variavel: "",
		listaDePeriodos: "",
		listaDeRegioes: "",
		listaDeConexoes: "",
		listaDeUnidades: "",
		//conteudo html do formulario de adicao de operacao
		formAdiciona: "",
		//parametros obtidos do formulario de edicao antes de abrir o modal de confirmacao
		parametrosSalvar: "",
		init: function(onde){
			i3GEOadmin.medidas.ondeLista = onde;
			i3GEOadmin.medidas.lista();
		},
		/*
Function: lista

Obt&eacute;m a lista de variaveis
		 */
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.medidas.ondeLista);
			$.post(
					"exec.php?funcao=lista",
					"codigo_variavel=" + i3GEOadmin.medidas.codigo_variavel
			)
			.done(
					function(data, status){
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						i3GEOadmin.medidas.listaDePeriodos = json.periodos;
						i3GEOadmin.medidas.listaDeRegioes = json.regioes;
						i3GEOadmin.medidas.listaDeConexoes = json.conexoes;
						i3GEOadmin.medidas.listaDeUnidades = json.unidades
						//template do form de cada operacao
						var templateLista = $("#templateLista").html();
						//lista todas as variaveis
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.medidas.dicionario,
										{
											"data": json.dados,
											"onExcluir": "i3GEOadmin.medidas.excluirDialogo",//funcao
											"onEditar": "i3GEOadmin.medidas.editarDialogo"
										}
								)
						);
						i3GEOadmin.medidas.ondeLista.html(html);
						//monta um template para o modal de inclusao
						if(i3GEOadmin.medidas.formAdiciona == ""){
							html = Mustache.to_html(
									$("#templateFormLista").html(),
									$.extend(
											{},
											i3GEOadmin.medidas.dicionario,
											{
												"codigo_variavel": "modal",
												"escondido": "hidden",
												"excluir": i3GEOadmin.medidas.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.medidas.adiciona",
												"opcoesPeriodo": function(){
													var html = Mustache.to_html(
															"{{#data}}" + $("#templateOpcoesPeriodo").html() + "{{/data}}",
															{"data":i3GEOadmin.medidas.listaDePeriodos}
														);
													return html;
												},
												"opcoesRegiao": function(){
													var html = Mustache.to_html(
															"{{#data}}" + $("#templateOpcoesRegiao").html() + "{{/data}}",
															{"data":i3GEOadmin.medidas.listaDeRegioes}
														);
													return html;
												},
												"opcoesConexao": function(){
													var html = Mustache.to_html(
															"{{#data}}" + $("#templateOpcoesConexao").html() + "{{/data}}",
															{"data":i3GEOadmin.medidas.listaDeConexoes}
														);
													return html;
												},
												"opcoesUnidade": function(){
													var html = Mustache.to_html(
															"{{#data}}" + $("#templateOpcoesUnidade").html() + "{{/data}}",
															{"data":i3GEOadmin.medidas.listaDeUnidades}
														);
													return html;
												}
											}
									)
							);
							i3GEOadmin.medidas.formAdiciona = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.medidas.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		editarDialogo: function(id){
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=listaunico",
					"id_medida_variavel=" + id
			)
			.done(
					function(data, status){
						var json = jQuery.parseJSON(data);
						//lista todas as variaveis
						var html = Mustache.to_html(
								"{{#data}}" + $("#templateFormLista").html() + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.medidas.dicionario,
										{
											"data": json,
											"onExcluir": "i3GEOadmin.medidas.excluirDialogo",//funcao
											"onSalvar": "i3GEOadmin.medidas.salvarDialogo",
											"opcoesPeriodo": function(){
												var html = Mustache.to_html(
														"{{#data}}" + $("#templateOpcoesPeriodo").html() + "{{/data}}",
														{"data":i3GEOadmin.medidas.listaDePeriodos}
													);
												return html;
											},
											"opcoesRegiao": function(){
												var html = Mustache.to_html(
														"{{#data}}" + $("#templateOpcoesRegiao").html() + "{{/data}}",
														{"data":i3GEOadmin.medidas.listaDeRegioes}
													);
												return html;
											},
											"opcoesConexao": function(){
												var html = Mustache.to_html(
														"{{#data}}" + $("#templateOpcoesConexao").html() + "{{/data}}",
														{"data":i3GEOadmin.medidas.listaDeConexoes}
													);
												return html;
											},
											"opcoesUnidade": function(){
												var html = Mustache.to_html(
														"{{#data}}" + $("#templateOpcoesUnidade").html() + "{{/data}}",
														{"data":i3GEOadmin.medidas.listaDeUnidades}
													);
												return html;
											}
										}
								)
						);
						i3GEOadmin.core.abreModalGeral(html);
						i3GEOadmin.core.defineSelecionados("modalGeral",json);
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		adicionaDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.medidas.formAdiciona);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adiciona: function(){
			var parametros = $("#modalGeral form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionar",
					parametros + "&codigo_variavel=" + i3GEOadmin.medidas.codigo_variavel
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.medidas.ondeLista);
						i3GEOadmin.medidas.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		excluirDialogo: function(id){
			var hash = {
					"mensagem": i3GEOadmin.medidas.dicionario.confirma,
					"onBotao1": "i3GEOadmin.medidas.excluir('"+id+"')",
					"botao1": i3GEOadmin.medidas.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.medidas.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"id_medida_variavel="+id
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.medidas.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		salvarDialogo: function(id){
			i3GEOadmin.medidas.parametrosSalvar = $("#form-edicao-" + id).serialize();
			var hash = {
					"mensagem": i3GEOadmin.medidas.dicionario.confirma,
					"onBotao1": "i3GEOadmin.medidas.salvar('"+id+"')",
					"botao1": i3GEOadmin.medidas.dicionario.sim,
					"onBotao2": "i3GEOadmin.medidas.parametrosSalvar = '';i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.medidas.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvar: function(id){
			var parametros = i3GEOadmin.medidas.parametrosSalvar;
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"codigo_variavel=" + i3GEOadmin.medidas.codigo_variavel + "&id_medida_variavel="+ id +"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.medidas.parametrosSalvar = "";
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.medidas.ondeLista);
						i3GEOadmin.medidas.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.medidas.parametrosSalvar = "";
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		editarOpcoes: function(id_medida_variavel){
			window.location.href = "opcoes/index.php?codigo_variavel=" + i3GEOadmin.medidas.codigo_variavel + "&id_medida_variavel=" + id_medida_variavel;
		},
		listaCodigosConexao: function(destino){
			i3GEOadmin.bdExplorer.listaCodigosConexao(destino);
		},
		listaEsquemas: function(destino){
			i3GEOadmin.bdExplorer.listaEsquemas(destino);
		},
		listaTabelas: function(destino){
			var esquema = $(".modal-body form input[name='esquemadb']").val();
			var codigo_estat_conexao = $(".modal-body form select[name='codigo_estat_conexao']").val();
			if(esquema != "" && codigo_estat_conexao != ""){
				i3GEOadmin.bdExplorer.listaTabelas(codigo_estat_conexao,esquema,destino);
			}
		},
		listaColunas: function(destino){
			var codigo_estat_conexao = $(".modal-body form select[name='codigo_estat_conexao']").val();
			var esquema = $(".modal-body form input[name='esquemadb']").val();
			var tabela = $(".modal-body form input[name='tabela']").val();
			if(esquema != "" && codigo_estat_conexao != ""){
				i3GEOadmin.bdExplorer.listaColunas(codigo_estat_conexao,esquema,tabela,destino);
			}
		}
};