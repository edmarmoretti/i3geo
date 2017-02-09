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
i3GEOadmin.tema = {
		id_prancha: "",
		//variavel global indicando o elemento que recebera a lista de menus
		ondeLista: "",
		//conteudo html do formulario de adicao de operacao
		formAdiciona: "",
		//parametros obtidos do formulario de edicao antes de abrir o modal de confirmacao
		parametrosSalvar: "",
		init: function(onde){
			i3GEOadmin.tema.ondeLista = onde;
			i3GEOadmin.tema.lista();
		},
		/*
Function: lista

Obt&eacute;m a lista
		 */
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.tema.ondeLista);
			$.post(
					"exec.php?funcao=lista",
					"id_prancha=" + i3GEOadmin.tema.id_prancha
			)
			.done(
					function(data, status){
						//valor do filtro atual
						var filtro = i3GEOadmin.core.valorFiltro();
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						//template do form de cada operacao
						var templateLista = $("#templateLista").html();
						var opcoesTema = '<option value="">---</option>' + Mustache.to_html(
								"{{#data}}" + $("#templateTemas").html() + "{{/data}}",
								{"data":json["temas"]}
						);
						//lista
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.prancha.dicionario,
										{
											"data": json["dados"],
											"onExcluir": "i3GEOadmin.tema.excluirDialogo",//funcao
											"onEditar": "i3GEOadmin.tema.editarDialogo",//funcao
											"esconde": "hidden"
										}
								)
						);
						i3GEOadmin.tema.ondeLista.html(html);
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
						//monta um template para o modal de inclusao de novo tema
						if(i3GEOadmin.tema.formAdiciona == ""){
							html = Mustache.to_html(
									$("#templateFormLista").html(),
									$.extend(
											{},
											i3GEOadmin.prancha.dicionario,
											{
												"id_tema": "modal",
												"escondido": "hidden",
												"excluir": i3GEOadmin.prancha.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.tema.adiciona",//funcao
												"opcoesLigado": function(){
													var hash = {};
													hash["sim"] = i3GEOadmin.prancha.dicionario.sim;
													hash["nao"] = i3GEOadmin.prancha.dicionario.nao;
													return Mustache.to_html(
															$("#templateOpcoesLigado").html(),
															hash
													);
												},
												"opcoesTema": opcoesTema,
												"esconde": ""
											}
									)
							);
							i3GEOadmin.tema.formAdiciona = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.tema.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		editarDialogo: function(id,codigo_tema){
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=listaunico",
					"id_tema=" + id
			)
			.done(
					function(data, status){
						var json = jQuery.parseJSON(data);
						var templateLista = $("#templateFormLista").html();
						var opcoesTema = '<option value="">---</option>' + Mustache.to_html(
								"{{#data}}" + $("#templateTemas").html() + "{{/data}}",
								{"data":json["temas"]}
						);
						//lista
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.prancha.dicionario,
										{
											"data": json["dados"],
											"onExcluir": "i3GEOadmin.tema.excluirDialogo",//funcao
											"onSalvar": "i3GEOadmin.tema.salvarDialogo",//funcao
											"opcoesLigado": function(){
												var hash = {};
												hash["sim"] = i3GEOadmin.prancha.dicionario.sim;
												hash["nao"] = i3GEOadmin.prancha.dicionario.nao;
												hash[this.ligado_tema + "-sel"] = "selected";
												return Mustache.to_html(
														$("#templateOpcoesLigado").html(),
														hash
												);
											},
											"opcoesTema": opcoesTema,
											"esconde": "hidden"
										}
								)
						);
						i3GEOadmin.core.abreModalGeral(html);
						$("#form-edicao-" + id + " [name='codigo_tema']").val(codigo_tema);
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
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.tema.formAdiciona);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adiciona: function(){
			var parametros = $("#modalGeral form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionar",
					parametros + "&id_prancha=" + i3GEOadmin.tema.id_prancha
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.tema.ondeLista);
						i3GEOadmin.tema.lista();
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
					"onBotao1": "i3GEOadmin.tema.excluir('"+id+"')",
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
					"id_tema=" + id + "&id_prancha=" + i3GEOadmin.tema.id_prancha
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.tema.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		salvarDialogo: function(id,codigo){
			i3GEOadmin.tema.parametrosSalvar = $("#form-edicao-" + id).serialize();
			var hash = {
					"mensagem": i3GEOadmin.prancha.dicionario.confirma,
					"onBotao1": "i3GEOadmin.tema.salvar('"+id+"','"+codigo+"')",
					"botao1": i3GEOadmin.prancha.dicionario.sim,
					"onBotao2": "i3GEOadmin.tema.parametrosSalvar = '';i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.prancha.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvar: function(id,codigo){
			var parametros = i3GEOadmin.prancha.parametrosSalvar;
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"id_tema="+ id + "&"+parametros + "&id_prancha=" + i3GEOadmin.tema.id_prancha + "&codigo_tema=" + codigo
			)
			.done(
					function(data, status){
						i3GEOadmin.tema.parametrosSalvar = '';
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.tema.ondeLista);
						i3GEOadmin.tema.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.tema.parametrosSalvar = '';
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		addInput: function(id,valor){
			var i = $("#"+id);
			$(i.val(i.val() + ' ' + valor));
		}
};