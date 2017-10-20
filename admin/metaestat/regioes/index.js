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
i3GEOadmin.regioes = {
		//variavel global indicando o elemento que recebera a lista de regioes
		ondeLista: "",
		//conteudo html do formulario de adicao de operacao
		formAdiciona: "",
		//parametros obtidos do formulario de edicao antes de abrir o modal de confirmacao
		parametrosSalvar: "",
		init: function(onde){
			i3GEOadmin.regioes.ondeLista = onde;
			i3GEOadmin.regioes.lista();
		},
		/*
Function: lista

Obt&eacute;m a lista de regioes
		 */
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.regioes.ondeLista);
			$.post(
					"exec.php?funcao=lista"
			)
			.done(
					function(data, status){
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						//template do form de cada operacao
						var templateLista = $("#templateLista").html();
						//lista todas as regioes
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.regioes.dicionario,
										{
											"data": json,
											"onExcluir": "i3GEOadmin.regioes.excluirDialogo",//funcao
											"onEditar": "i3GEOadmin.regioes.editarDialogo"
										}
								)
						);
						i3GEOadmin.regioes.ondeLista.html(html);
						//monta um template para o modal de inclusao
						if(i3GEOadmin.regioes.formAdiciona == ""){
							html = Mustache.to_html(
									$("#templateFormLista").html(),
									$.extend(
											{},
											i3GEOadmin.regioes.dicionario,
											{
												"codigo_tipo_regiao": "modal",
												"escondido": "hidden",
												"excluir": i3GEOadmin.regioes.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.regioes.adiciona",
												"opcoesMedia": function(){
													var hash = {};
													hash["sim"] = i3GEOadmin.regioes.dicionario.sim;
													hash["nao"] = i3GEOadmin.regioes.dicionario.nao;
													return Mustache.to_html(
															$("#templateOpcoesSimNao").html(),
															hash
													);
												},
												"opcoesSoma": function(){
													var hash = {};
													hash["sim"] = i3GEOadmin.regioes.dicionario.sim;
													hash["nao"] = i3GEOadmin.regioes.dicionario.nao;
													return Mustache.to_html(
															$("#templateOpcoesSimNao").html(),
															hash
													);
												}
											}
									)
							);
							i3GEOadmin.regioes.formAdiciona = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.regioes.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		editarDialogo: function(id){
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=listaunico",
					"codigo_tipo_regiao=" + id
			)
			.done(
					function(data, status){
						var json = jQuery.parseJSON(data);
						//lista todas as regioes
						var html = Mustache.to_html(
								"{{#data}}" + $("#templateFormLista").html() + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.regioes.dicionario,
										{
											"data": json,
											"onExcluir": "i3GEOadmin.regioes.excluirDialogo",//funcao
											"onSalvar": "i3GEOadmin.regioes.salvarDialogo",
											"opcoesMedia": function(){
												var hash = {};
												hash[this.permitemedia + "-sel"] = "selected";
												hash["sim"] = i3GEOadmin.regioes.dicionario.sim;
												hash["nao"] = i3GEOadmin.regioes.dicionario.nao;
												return Mustache.to_html(
														$("#templateOpcoesSimNao").html(),
														hash
												);
											},
											"opcoesSoma": function(){
												var hash = {};
												hash[this.permitesoma + "-sel"] = "selected";
												hash["sim"] = i3GEOadmin.regioes.dicionario.sim;
												hash["nao"] = i3GEOadmin.regioes.dicionario.nao;
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
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.regioes.formAdiciona);
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
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.regioes.ondeLista);
						i3GEOadmin.regioes.lista();
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
					"mensagem": i3GEOadmin.regioes.dicionario.confirma,
					"onBotao1": "i3GEOadmin.regioes.excluir('"+id+"')",
					"botao1": i3GEOadmin.regioes.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.regioes.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"codigo_tipo_regiao="+id
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.regioes.lista();
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
			i3GEOadmin.regioes.parametrosSalvar = $("#form-edicao-" + id).serialize();
			var hash = {
					"mensagem": i3GEOadmin.regioes.dicionario.confirma,
					"onBotao1": "i3GEOadmin.regioes.salvar('"+id+"')",
					"botao1": i3GEOadmin.regioes.dicionario.sim,
					"onBotao2": "i3GEOadmin.regioes.parametrosSalvar = '';i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.regioes.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvar: function(id){
			var parametros = i3GEOadmin.regioes.parametrosSalvar;
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"codigo_tipo_regiao="+ id+"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.regioes.parametrosSalvar = "";
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.regioes.ondeLista);
						i3GEOadmin.regioes.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.regioes.parametrosSalvar = "";
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		editarHierarquia: function(codigo_tipo_regiao){
			//muda a url para que o usuario possa voltar pelo botao do navegador
			//var u = window.location.origin + window.location.pathname + "?id_filtro=" + codigo_tipo_regiao;
			//window.history.replaceState(null,null,u);
			//abre a pagina de edicao
			window.location.href = "hierarquia/index.php?codigo_tipo_regiao=" + codigo_tipo_regiao;
		},
		listaCodigosConexao: function(destino){
			i3GEOadmin.bdExplorer.listaCodigosConexao(destino);
		},
		listaEsquemas: function(destino){
			i3GEOadmin.bdExplorer.listaEsquemas(destino);
		},
		listaTabelas: function(destino){
			var esquema = $(".modal-body form input[name='esquemadb']").val();
			var codigo_estat_conexao = $(".modal-body form input[name='codigo_estat_conexao']").val();
			if(esquema != "" && codigo_estat_conexao != ""){
				i3GEOadmin.bdExplorer.listaTabelas(codigo_estat_conexao,esquema,destino);
			}
		},
		listaColunas: function(destino){
			var codigo_estat_conexao = $(".modal-body form input[name='codigo_estat_conexao']").val();
			var esquema = $(".modal-body form input[name='esquemadb']").val();
			var tabela = $(".modal-body form input[name='tabela']").val();
			if(esquema != "" && codigo_estat_conexao != ""){
				i3GEOadmin.bdExplorer.listaColunas(codigo_estat_conexao,esquema,tabela,destino);
			}
		}
};