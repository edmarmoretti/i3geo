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
i3GEOadmin.atlas = {
		//variavel global indicando o elemento que recebera a lista de menus
		ondeLista: "",
		//conteudo html do formulario de adicao de operacao
		formAdiciona: "",
		//parametros obtidos do formulario de edicao antes de abrir o modal de confirmacao
		parametrosSalvar: "",
		init: function(onde){
			i3GEOadmin.atlas.ondeLista = onde;
			i3GEOadmin.atlas.lista();
		},
		/*
Function: lista

Obt&eacute;m a lista
		 */
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.atlas.ondeLista);
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
						//lista todas as menus
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.atlas.dicionario,
										{
											"data": json["dados"],
											"onExcluir": "i3GEOadmin.atlas.excluirDialogo",//funcao
											"onEditar": "i3GEOadmin.atlas.editarDialogo"
										}
								)
						);
						i3GEOadmin.atlas.ondeLista.html(html);
						//filtro
						html = Mustache.to_html(
								"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
								{"data":json["dados"]}
						);
						$("#filtro").html("<option value='' >Todos</option>" + html);
						$("#filtro").combobox();
						$(".ui-autocomplete-input").attr( "title", "Filtro" );

						if(filtro != ""){
							i3GEOadmin.core.defineFiltro(filtro);
							i3GEOadmin.core.filtra(i3GEOadmin.core.pegaFiltro());
						}
						//monta um template para o modal de inclusao de novo usuario
						if(i3GEOadmin.atlas.formAdiciona == ""){
							html = Mustache.to_html(
									$("#templateFormLista").html(),
									$.extend(
											{},
											i3GEOadmin.atlas.dicionario,
											{
												"id_atlas": "modal",
												"escondido": "hidden",
												"pranchas": "",
												"excluir": i3GEOadmin.atlas.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.atlas.adiciona",//funcao
												"opcoesPublicado": function(){
													var hash = {};
													hash["sim"] = i3GEOadmin.atlas.dicionario.sim;
													hash["nao"] = i3GEOadmin.atlas.dicionario.nao;
													return Mustache.to_html(
															$("#templateOpcoesPublicado").html(),
															hash
													);
												},
												"opcoesTipoGuia": $("#templateOpcoesTipoGuia").html()
											}
									)
							);
							i3GEOadmin.atlas.formAdiciona = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.atlas.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		editarDialogo: function(id){
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=listaunico",
					"id_atlas=" + id
			)
			.done(
					function(data, status){
						var json = jQuery.parseJSON(data);
						var templateLista = $("#templateFormLista").html();
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.atlas.dicionario,
										{
											"data": json["dados"],
											"onExcluir": "i3GEOadmin.atlas.excluirDialogo",//funcao
											"onSalvar": "i3GEOadmin.atlas.salvarDialogo",//funcao
											"opcoesPublicado": function(){
												var hash = {};
												hash["sim"] = i3GEOadmin.atlas.dicionario.sim;
												hash["nao"] = i3GEOadmin.atlas.dicionario.nao;
												if(this.publicado_atlas == ""){
													this.publicado_atlas = "SIM";
												}
												hash[this.publicado_atlas + "-sel"] = "selected";
												return Mustache.to_html(
														$("#templateOpcoesPublicado").html(),
														hash
												);
											},
											"opcoesTipoGuia": function(){
												var hash = {};
												hash[this.tipoguias_atlas + "-sel"] = "selected";
												return Mustache.to_html(
														$("#templateOpcoesTipoGuia").html(),
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
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.atlas.formAdiciona);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adiciona: function(){
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
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.atlas.ondeLista);
						i3GEOadmin.atlas.lista();
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
					"mensagem": i3GEOadmin.atlas.dicionario.confirma,
					"onBotao1": "i3GEOadmin.atlas.excluir('"+id+"')",
					"botao1": i3GEOadmin.atlas.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.atlas.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"id_atlas="+id
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.atlas.lista();
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
			i3GEOadmin.atlas.parametrosSalvar = $("#form-edicao-" + id).serialize();
			var hash = {
					"mensagem": i3GEOadmin.atlas.dicionario.confirma,
					"onBotao1": "i3GEOadmin.atlas.salvar('"+id+"')",
					"botao1": i3GEOadmin.atlas.dicionario.sim,
					"onBotao2": "i3GEOadmin.atlas.parametrosSalvar = '';i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.atlas.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvar: function(id){
			var parametros = i3GEOadmin.atlas.parametrosSalvar;
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"id_atlas="+ id+"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.atlas.parametrosSalvar = '';
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.atlas.ondeLista);
						i3GEOadmin.atlas.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.atlas.parametrosSalvar = '';
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		editarPranchas: function(id_atlas,titulo_atlas){
			//muda a url para que o usuario possa voltar pelo botao do navegador
			var u = window.location.origin + window.location.pathname + "?id_filtro=" + id_atlas;
			window.history.replaceState(null,null,u);
			//abre a pagina de edicao
			window.location.href = "pranchas/index.php?id_atlas=" + id_atlas + "&titulo_atlas=" + titulo_atlas;
		},
		addInput: function(id,valor){
			var i = $("#"+id);
			$(i.val(i.val() + ' ' + valor));
		}
};