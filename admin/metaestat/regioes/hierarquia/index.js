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
i3GEOadmin.hierarquia = {
		//variavel global indicando o elemento que recebera a lista de hierarquia
		ondeLista: "",
		//conteudo html do formulario de adicao de operacao
		formAdiciona: "",
		//parametros obtidos do formulario de edicao antes de abrir o modal de confirmacao
		parametrosSalvar: "",
		codigo_tipo_regiao: "",
		listaDeRegioes: "",
		listaDeColunas: "",
		init: function(onde){
			i3GEOadmin.hierarquia.ondeLista = onde;
			i3GEOadmin.hierarquia.lista();
		},
		/*
Function: lista

Obt&eacute;m a lista de hierarquia
		 */
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.hierarquia.ondeLista);
			$.post(
					"exec.php?funcao=lista",
					"codigo_tipo_regiao=" + i3GEOadmin.hierarquia.codigo_tipo_regiao
			)
			.done(
					function(data, status){
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						i3GEOadmin.hierarquia.listaDeRegioes = json.regioes;
						i3GEOadmin.hierarquia.listaDeColunas = json.colunas;
						//template do form de cada operacao
						var templateLista = $("#templateLista").html();
						//lista todas as hierarquia
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.hierarquia.dicionario,
										{
											"data": json.dados,
											"onExcluir": "i3GEOadmin.hierarquia.excluirDialogo",//funcao
											"onEditar": "i3GEOadmin.hierarquia.editarDialogo"
										}
								)
						);
						i3GEOadmin.hierarquia.ondeLista.html(html);
						//monta um template para o modal de inclusao
						if(i3GEOadmin.hierarquia.formAdiciona == ""){
							html = Mustache.to_html(
									$("#templateFormLista").html(),
									$.extend(
											{},
											i3GEOadmin.hierarquia.dicionario,
											{
												"id_agregaregiao": "modal",
												"escondido": "hidden",
												"excluir": i3GEOadmin.hierarquia.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.hierarquia.adiciona",
												"opcoesRegiao": function(){
													var l = i3GEOadmin.hierarquia.listaDeRegioes;
													var html = Mustache.to_html(
															"{{#data}}" + $("#templateOpcoesRegioes").html() + "{{/data}}",
															{"data":l}
														);
													return html;
												},
												"opcoesColuna": function(){
													var l = i3GEOadmin.hierarquia.listaDeColunas;
													var html = Mustache.to_html(
															"{{#data}}" + $("#templateOpcoesColunas").html() + "{{/data}}",
															{"data":l}
														);
													return html;
												}
											}
									)
							);
							i3GEOadmin.hierarquia.formAdiciona = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.hierarquia.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		editarDialogo: function(id){
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=listaunico",
					"id_agregaregiao=" + id
			)
			.done(
					function(data, status){
						var json = jQuery.parseJSON(data);
						//lista todas as hierarquia
						var html = Mustache.to_html(
								"{{#data}}" + $("#templateFormLista").html() + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.hierarquia.dicionario,
										{
											"data": json,
											"onExcluir": "i3GEOadmin.hierarquia.excluirDialogo",//funcao
											"onSalvar": "i3GEOadmin.hierarquia.salvarDialogo",
											"opcoesRegiao": function(){
												var html = Mustache.to_html(
														"{{#data}}" + $("#templateOpcoesRegioes").html() + "{{/data}}",
														{"data":i3GEOadmin.hierarquia.listaDeRegioes}
													);
												return html;
											},
											"opcoesColuna": function(){
												var html = Mustache.to_html(
														"{{#data}}" + $("#templateOpcoesColunas").html() + "{{/data}}",
														{"data":i3GEOadmin.hierarquia.listaDeColunas}
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
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.hierarquia.formAdiciona);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adiciona: function(){
			var parametros = $("#modalGeral form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionar",
					parametros + "&codigo_tipo_regiao=" + i3GEOadmin.hierarquia.codigo_tipo_regiao
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.hierarquia.ondeLista);
						i3GEOadmin.hierarquia.lista();
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
					"mensagem": i3GEOadmin.hierarquia.dicionario.confirma,
					"onBotao1": "i3GEOadmin.hierarquia.excluir('"+id+"')",
					"botao1": i3GEOadmin.hierarquia.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.hierarquia.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"id_agregaregiao="+id
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.hierarquia.lista();
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
			i3GEOadmin.hierarquia.parametrosSalvar = $("#form-edicao-" + id).serialize();
			var hash = {
					"mensagem": i3GEOadmin.hierarquia.dicionario.confirma,
					"onBotao1": "i3GEOadmin.hierarquia.salvar('"+id+"')",
					"botao1": i3GEOadmin.hierarquia.dicionario.sim,
					"onBotao2": "i3GEOadmin.hierarquia.parametrosSalvar = '';i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.hierarquia.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvar: function(id){
			var parametros = i3GEOadmin.hierarquia.parametrosSalvar;
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					parametros + "&id_agregaregiao="+ id + "&codigo_tipo_regiao=" + i3GEOadmin.hierarquia.codigo_tipo_regiao
			)
			.done(
					function(data, status){
						i3GEOadmin.hierarquia.parametrosSalvar = "";
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.hierarquia.ondeLista);
						i3GEOadmin.hierarquia.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.hierarquia.parametrosSalvar = "";
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		}
};