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
i3GEOadmin.parametros = {
		//variavel global indicando o elemento que recebera a lista de variaveis
		ondeLista: "",
		codigo_variavel: "",
		id_medida_variavel: "",
		//conteudo html do formulario de adicao de operacao
		formAdiciona: "",
		listaDeColunas: "",
		listaDeParametros: "",
		//parametros obtidos do formulario de edicao antes de abrir o modal de confirmacao
		parametrosSalvar: "",
		init: function(onde){
			i3GEOadmin.parametros.ondeLista = onde;
			i3GEOadmin.parametros.lista();
		},
		/*
Function: lista

Obt&eacute;m a lista de variaveis
		 */
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.parametros.ondeLista);
			$.post(
					"exec.php?funcao=lista",
					"id_medida_variavel=" + i3GEOadmin.parametros.id_medida_variavel
			)
			.done(
					function(data, status){
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						i3GEOadmin.parametros.listaDeColunas = json.colunas;
						i3GEOadmin.parametros.listaDeParametros = json.dados;
						//template do form de cada operacao
						var templateLista = $("#templateLista").html();
						//lista todas as variaveis
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.parametros.dicionario,
										{
											"data": json.dados,
											"onExcluir": "i3GEOadmin.parametros.excluirDialogo",//funcao
											"onEditar": "i3GEOadmin.parametros.editarDialogo"
										}
								)
						);
						i3GEOadmin.parametros.ondeLista.html(html);
						//monta um template para o modal de inclusao
						if(i3GEOadmin.parametros.formAdiciona == ""){
							html = Mustache.to_html(
									$("#templateFormLista").html(),
									$.extend(
											{},
											i3GEOadmin.parametros.dicionario,
											{
												"id_parametro_medida": "modal",
												"escondido": "hidden",
												"excluir": i3GEOadmin.parametros.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.parametros.adiciona",
												"opcoesColuna": function(){
													var html = Mustache.to_html(
															"{{#data}}" + $("#templateOpcoesColunas").html() + "{{/data}}",
															{"data":i3GEOadmin.parametros.listaDeColunas}
														);
													return html;
												},
												"opcoesParametroPai": function(){
													var html = Mustache.to_html(
															"{{#data}}" + $("#templateOpcoesParametrosPai").html() + "{{/data}}",
															{"data":i3GEOadmin.parametros.listaDeParametros}
														);
													return html;
												}
											}
									)
							);
							i3GEOadmin.parametros.formAdiciona = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.parametros.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		editarDialogo: function(id){
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=listaunico",
					"id_parametro_medida=" + id
			)
			.done(
					function(data, status){
						var json = jQuery.parseJSON(data);
						//lista todas as variaveis
						var html = Mustache.to_html(
								"{{#data}}" + $("#templateFormLista").html() + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.parametros.dicionario,
										{
											"data": json,
											"onExcluir": "i3GEOadmin.parametros.excluirDialogo",//funcao
											"onSalvar": "i3GEOadmin.parametros.salvarDialogo",
											"opcoesColuna": function(){
												var html = Mustache.to_html(
														"{{#data}}" + $("#templateOpcoesColunas").html() + "{{/data}}",
														{"data":i3GEOadmin.parametros.listaDeColunas}
													);
												return html;
											},
											"opcoesParametroPai": function(){
												var html = Mustache.to_html(
														"{{#data}}" + $("#templateOpcoesParametrosPai").html() + "{{/data}}",
														{"data":i3GEOadmin.parametros.listaDeParametros}
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
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.parametros.formAdiciona);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adiciona: function(){
			var parametros = $("#modalGeral form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionar",
					parametros + "&id_medida_variavel=" + i3GEOadmin.parametros.id_medida_variavel
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.parametros.ondeLista);
						i3GEOadmin.parametros.lista();
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
					"mensagem": i3GEOadmin.parametros.dicionario.confirma,
					"onBotao1": "i3GEOadmin.parametros.excluir('"+id+"')",
					"botao1": i3GEOadmin.parametros.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.parametros.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"id_parametro_medida="+id
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.parametros.lista();
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
			i3GEOadmin.parametros.parametrosSalvar = $("#form-edicao-" + id).serialize();
			var hash = {
					"mensagem": i3GEOadmin.parametros.dicionario.confirma,
					"onBotao1": "i3GEOadmin.parametros.salvar('"+id+"')",
					"botao1": i3GEOadmin.parametros.dicionario.sim,
					"onBotao2": "i3GEOadmin.parametros.parametrosSalvar = '';i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.parametros.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvar: function(id){
			var parametros = i3GEOadmin.parametros.parametrosSalvar;
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"id_medida_variavel=" + i3GEOadmin.parametros.id_medida_variavel + "&id_parametro_medida="+ id +"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.parametros.parametrosSalvar = "";
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.parametros.ondeLista);
						i3GEOadmin.parametros.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.parametros.parametrosSalvar = "";
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		}
};