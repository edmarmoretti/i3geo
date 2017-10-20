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
i3GEOadmin.identifica = {
		//variavel global indicando o elemento que recebera a lista de Identifica
		ondeLista: "",
		//conteudo html do formulario de adicao de operacao
		formAdiciona: "",
		//parametros obtidos do formulario de edicao antes de abrir o modal de confirmacao
		parametrosSalvar: "",
		init: function(onde){
			i3GEOadmin.identifica.ondeLista = onde;
			i3GEOadmin.identifica.lista();
		},
		/*
Function: lista

Obt&eacute;m a lista de Identifica
		 */
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.identifica.ondeLista);
			$.post(
					"exec.php?funcao=lista"
			)
			.done(
					function(data, status){
						//valor do filtro atual
						var filtro = i3GEOadmin.core.valorFiltro();
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						//template do form de cada operacao
						var templateLista = $("#templateLista").html();
						templateLista = templateLista.replace("{{{templateFormLista}}}",$("#templateFormLista").html());
						//lista todas as Identifica
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.identifica.dicionario,
										{
											"data": json,
											"excluir": i3GEOadmin.identifica.dicionario.excluir,
											"onExcluir": "i3GEOadmin.identifica.excluirDialogo",//funcao
											"onEditar": "i3GEOadmin.identifica.editarDialogo"
										}
								)
						);
						i3GEOadmin.identifica.ondeLista.html(html);
						//filtro
						html = Mustache.to_html(
								"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
								{"data":json}
						);
						$("#filtro").html("<option value='' >Todos</option>" + html);
						$("#filtro").combobox();
						$(".ui-autocomplete-input").attr( "title", "Filtro" );

						if(filtro != ""){
							i3GEOadmin.core.defineFiltro(filtro);
							i3GEOadmin.core.filtra(i3GEOadmin.identifica.pegaFiltro());
						}
						//monta um template para o modal de inclusao de novo usuario
						if(i3GEOadmin.identifica.formAdiciona == ""){
							html = Mustache.to_html(
									$("#templateFormLista").html(),
									$.extend(
											{},
											i3GEOadmin.identifica.dicionario,
											{
												"id_i": "modal",
												"escondido": "hidden",
												"excluir": i3GEOadmin.identifica.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.identifica.adicionar",//funcao
												"opcoesPublicado": function(){
													return Mustache.to_html(
															$("#templateOpcoesPublicado").html(),
															i3GEOadmin.identifica.dicionario
													);
												},
												"opcoesTarget": function(){
													return Mustache.to_html(
															$("#templateOpcoesTarget").html(),
															i3GEOadmin.identifica.dicionario
													);
												}
											}
									)
							);
							i3GEOadmin.identifica.formAdiciona = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.identifica.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		editarDialogo: function(id){
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=listaunico",
					"id_i=" + id
			)
			.done(
					function(data, status){
						var json = jQuery.parseJSON(data);
						var html = Mustache.to_html(
								"{{#data}}" + $("#templateFormLista").html() + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.identifica.dicionario,
										{
											"data": json,
											"excluir": i3GEOadmin.identifica.dicionario.excluir,
											"onExcluir": "i3GEOadmin.identifica.excluirDialogo",//funcao
											"onSalvar": "i3GEOadmin.identifica.salvarDialogo",//funcao
											"opcoesPublicado": function(){
												var hash = {};
												hash[this.publicado_i + "-sel"] = "selected";
												//traducao
												hash["sim"] = i3GEOadmin.identifica.dicionario.sim;
												hash["nao"] = i3GEOadmin.identifica.dicionario.nao;
												return Mustache.to_html(
														$("#templateOpcoesPublicado").html(),
														hash
												);
											},
											"opcoesTarget": function(){
												var hash = {};
												hash[this.target_i + "-sel"] = "selected";
												//traducao
												hash["externo"] = i3GEOadmin.identifica.dicionario.externo;
												hash["mapa"] = i3GEOadmin.identifica.dicionario.mapa;
												return Mustache.to_html(
														$("#templateOpcoesTarget").html(),
														hash
												);
											}
										}
								)
						);
						i3GEOadmin.core.abreModalGeral(html);
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
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.identifica.formAdiciona);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adicionar: function(){
			var parametros = $("#modalGeral form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionar",
					parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.identifica.ondeLista);
						i3GEOadmin.identifica.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		excluirDialogo: function(id_i){
			var hash = {
					"mensagem": i3GEOadmin.identifica.dicionario.confirma,
					"onBotao1": "i3GEOadmin.identifica.excluir('"+id_i+"')",
					"botao1": i3GEOadmin.identifica.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.identifica.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"id_i="+id
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.identifica.lista();
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
			i3GEOadmin.identifica.parametrosSalvar = $("#form-edicao-" + id).serialize();
			var hash = {
					"mensagem": i3GEOadmin.identifica.dicionario.confirma,
					"onBotao1": "i3GEOadmin.identifica.salvar('"+id+"')",
					"botao1": i3GEOadmin.identifica.dicionario.sim,
					"onBotao2": "i3GEOadmin.identifica.parametrosSalvar = '';i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.identifica.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvar: function(id){
			var parametros = i3GEOadmin.identifica.parametrosSalvar;
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"id_i="+ id+"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.identifica.parametrosSalvar = "";
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.identifica.ondeLista);
						i3GEOadmin.identifica.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.identifica.parametrosSalvar = "";
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		}
};