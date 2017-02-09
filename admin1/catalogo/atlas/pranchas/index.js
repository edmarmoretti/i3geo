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
i3GEOadmin.prancha = {
		id_atlas: "",
		//variavel global indicando o elemento que recebera a lista de menus
		ondeLista: "",
		//conteudo html do formulario de adicao de operacao
		formAdiciona: "",
		//parametros obtidos do formulario de edicao antes de abrir o modal de confirmacao
		parametrosSalvar: "",
		init: function(onde){
			i3GEOadmin.prancha.ondeLista = onde;
			i3GEOadmin.prancha.lista();
		},
		/*
Function: lista

Obt&eacute;m a lista
		 */
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.prancha.ondeLista);
			$.post(
					"exec.php?funcao=lista",
					"id_atlas=" + i3GEOadmin.prancha.id_atlas
			)
			.done(
					function(data, status){
						//valor do filtro atual
						var filtro = i3GEOadmin.core.valorFiltro();
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						//template do form de cada operacao
						var templateLista = $("#templateLista").html();
						//lista todas as menus
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.prancha.dicionario,
										{
											"data": json["dados"],
											"onExcluir": "i3GEOadmin.prancha.excluirDialogo",//funcao
											"onEditar": "i3GEOadmin.prancha.editarDialogo"//funcao
										}
								)
						);
						i3GEOadmin.prancha.ondeLista.html(html);
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
							i3GEOadmin.core.filtra(i3GEOadmin.prancha.pegaFiltro());
						}
						//monta um template para o modal de inclusao de novo usuario
						if(i3GEOadmin.prancha.formAdiciona == ""){
							html = Mustache.to_html(
									$("#templateFormLista").html(),
									$.extend(
											{},
											i3GEOadmin.prancha.dicionario,
											{
												"id_prancha": "modal",
												"escondido": "hidden",
												"pranchas": "",
												"excluir": i3GEOadmin.prancha.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.prancha.adiciona",//funcao
												"editarTema": ""
											}
									)
							);
							i3GEOadmin.prancha.formAdiciona = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.prancha.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		editarDialogo: function(id){
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=listaunico",
					"id_prancha=" + id
			)
			.done(
					function(data, status){
						var json = jQuery.parseJSON(data);
						var templateLista = $("#templateFormLista").html();
						//lista todas as menus
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.prancha.dicionario,
										{
											"data": json["dados"],
											"onExcluir": "i3GEOadmin.prancha.excluirDialogo",//funcao
											"onSalvar": "i3GEOadmin.prancha.salvarDialogo"//funcao
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
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.prancha.formAdiciona);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adiciona: function(){
			var parametros = $("#modalGeral form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionar",
					parametros + "&id_atlas=" + i3GEOadmin.prancha.id_atlas
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.prancha.ondeLista);
						i3GEOadmin.prancha.lista();
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
					"mensagem": i3GEOadmin.prancha.dicionario.confirma,
					"onBotao1": "i3GEOadmin.prancha.excluir('"+id+"')",
					"botao1": i3GEOadmin.prancha.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.prancha.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"id_prancha=" + id + "&id_atlas=" + i3GEOadmin.prancha.id_atlas
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.prancha.lista();
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
			i3GEOadmin.prancha.parametrosSalvar = $("#form-edicao-" + id).serialize();
			var hash = {
					"mensagem": i3GEOadmin.prancha.dicionario.confirma,
					"onBotao1": "i3GEOadmin.prancha.salvar('"+id+"')",
					"botao1": i3GEOadmin.prancha.dicionario.sim,
					"onBotao2": "i3GEOadmin.prancha.parametrosSalvar = '';i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.prancha.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvar: function(id){
			var parametros = i3GEOadmin.prancha.parametrosSalvar;
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"id_prancha="+ id + "&"+parametros + "&id_atlas=" + i3GEOadmin.prancha.id_atlas
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.prancha.parametrosSalvar = '';
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.prancha.ondeLista);
						i3GEOadmin.prancha.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.prancha.parametrosSalvar = '';
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		editarTemas: function(id_atlas, id_prancha,titulo_prancha){
			//muda a url para que o usuario possa voltar pelo botao do navegador
			var u = window.location.origin + window.location.pathname + "?id_atlas=" + id_atlas + "&id_filtro=" + id_prancha;
			window.history.replaceState(null,null,u);
			//abre a pagina de edicao
			window.location.href = "temas/index.php?id_prancha=" + id_prancha + "&titulo_prancha=" + titulo_prancha + "&id_atlas=" + id_atlas;
		},
		addInput: function(id,valor){
			var i = $("#"+id);
			$(i.val(i.val() + ' ' + valor));
		}
};