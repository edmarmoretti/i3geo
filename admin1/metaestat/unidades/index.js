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
i3GEOadmin.unidades = {
		//variavel global indicando o elemento que recebera a lista de unidades
		ondeLista: "",
		//conteudo html do formulario de adicao de operacao
		formAdiciona: "",
		//parametros obtidos do formulario de edicao antes de abrir o modal de confirmacao
		parametrosSalvar: "",
		init: function(onde){
			i3GEOadmin.unidades.ondeLista = onde;
			i3GEOadmin.unidades.lista();
		},
		/*
Function: lista

Obt&eacute;m a lista de unidades
		 */
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.unidades.ondeLista);
			$.post(
					"exec.php?funcao=lista"
			)
			.done(
					function(data, status){
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						//template do form de cada operacao
						var templateLista = $("#templateLista").html();
						//lista todas as unidades
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.unidades.dicionario,
										{
											"data": json,
											"onExcluir": "i3GEOadmin.unidades.excluirDialogo",//funcao
											"onEditar": "i3GEOadmin.unidades.editarDialogo"
										}
								)
						);
						i3GEOadmin.unidades.ondeLista.html(html);
						//monta um template para o modal de inclusao
						if(i3GEOadmin.unidades.formAdiciona == ""){
							html = Mustache.to_html(
									$("#templateFormLista").html(),
									$.extend(
											{},
											i3GEOadmin.unidades.dicionario,
											{
												"codigo_unidade_medida": "modal",
												"escondido": "hidden",
												"excluir": i3GEOadmin.unidades.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.unidades.adiciona",
												"opcoesMedia": function(){
													var hash = {};
													hash["sim"] = i3GEOadmin.unidades.dicionario.sim;
													hash["nao"] = i3GEOadmin.unidades.dicionario.nao;
													return Mustache.to_html(
															$("#templateOpcoesSimNao").html(),
															hash
													);
												},
												"opcoesSoma": function(){
													var hash = {};
													hash["sim"] = i3GEOadmin.unidades.dicionario.sim;
													hash["nao"] = i3GEOadmin.unidades.dicionario.nao;
													return Mustache.to_html(
															$("#templateOpcoesSimNao").html(),
															hash
													);
												}
											}
									)
							);
							i3GEOadmin.unidades.formAdiciona = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.unidades.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		editarDialogo: function(id){
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=listaunico",
					"codigo_unidade_medida=" + id
			)
			.done(
					function(data, status){
						var json = jQuery.parseJSON(data);
						//lista todas as unidades
						var html = Mustache.to_html(
								"{{#data}}" + $("#templateFormLista").html() + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.unidades.dicionario,
										{
											"data": json,
											"onExcluir": "i3GEOadmin.unidades.excluirDialogo",//funcao
											"onSalvar": "i3GEOadmin.unidades.salvarDialogo",
											"opcoesMedia": function(){
												var hash = {};
												hash[this.permitemedia + "-sel"] = "selected";
												hash["sim"] = i3GEOadmin.unidades.dicionario.sim;
												hash["nao"] = i3GEOadmin.unidades.dicionario.nao;
												return Mustache.to_html(
														$("#templateOpcoesSimNao").html(),
														hash
												);
											},
											"opcoesSoma": function(){
												var hash = {};
												hash[this.permitesoma + "-sel"] = "selected";
												hash["sim"] = i3GEOadmin.unidades.dicionario.sim;
												hash["nao"] = i3GEOadmin.unidades.dicionario.nao;
												return Mustache.to_html(
														$("#templateOpcoesSimNao").html(),
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
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.unidades.formAdiciona);
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
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.unidades.ondeLista);
						i3GEOadmin.unidades.lista();
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
					"mensagem": i3GEOadmin.unidades.dicionario.confirma,
					"onBotao1": "i3GEOadmin.unidades.excluir('"+id+"')",
					"botao1": i3GEOadmin.unidades.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.unidades.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"codigo_unidade_medida="+id
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.unidades.lista();
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
			i3GEOadmin.unidades.parametrosSalvar = $("#form-edicao-" + id).serialize();
			var hash = {
					"mensagem": i3GEOadmin.unidades.dicionario.confirma,
					"onBotao1": "i3GEOadmin.unidades.salvar('"+id+"')",
					"botao1": i3GEOadmin.unidades.dicionario.sim,
					"onBotao2": "i3GEOadmin.unidades.parametrosSalvar = '';i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.unidades.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvar: function(id){
			var parametros = i3GEOadmin.unidades.parametrosSalvar;
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"codigo_unidade_medida="+ id+"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.unidades.parametrosSalvar = "";
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.unidades.ondeLista);
						i3GEOadmin.unidades.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.unidades.parametrosSalvar = "";
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		}
};