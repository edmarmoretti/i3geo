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
i3GEOadmin.menus = {
		//variavel global indicando o elemento que recebera a lista de menus
		ondeLista: "",
		//conteudo html do formulario de adicao de operacao
		formAdiciona: "",
		init: function(onde){
			i3GEOadmin.menus.ondeLista = onde;
			i3GEOadmin.menus.lista();
		},
		/*
Function: lista

Obt&eacute;m a lista de menus
		 */
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.menus.ondeLista);
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
						//combo com perfis
						var opcoesPerfil = '<option value="">---</option>' + Mustache.to_html(
								"{{#data}}" + $("#templateOpcoesPerfil").html() + "{{/data}}",
								{"data":json["perfis"]}
						);
						//lista todas as menus
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.menus.dicionario,
										{
											"data": json["dados"],
											"onExcluir": "i3GEOadmin.menus.excluirDialogo",//funcao
											"onSalvar": "i3GEOadmin.menus.salvarDialogo",//funcao
											"opcoesAberto": function(){
												var hash = {};
												hash[this.aberto + "-sel"] = "selected";
												hash["sim"] = i3GEOadmin.menus.dicionario.sim;
												hash["nao"] = i3GEOadmin.menus.dicionario.nao;
												return Mustache.to_html(
														$("#templateOpcoesAberto").html(),
														hash
												);
											},
											"opcoesPublicado": function(){
												var hash = {};
												hash[this.publicado_menu + "-sel"] = "selected";
												hash["sim"] = i3GEOadmin.menus.dicionario.sim;
												hash["nao"] = i3GEOadmin.menus.dicionario.nao;
												return Mustache.to_html(
														$("#templateOpcoesPublicado").html(),
														hash
												);
											},
											"opcoesPerfil": opcoesPerfil
										}
								)
						);
						i3GEOadmin.menus.ondeLista.html(html);
						//filtro
						html = Mustache.to_html(
								"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
								{"data":json["dados"]}
						);
						$("#filtro").html("<option value='' >Todos</option>" + html);
						$("#filtro").combobox();
						if(filtro != ""){
							i3GEOadmin.core.defineFiltro(filtro);
							i3GEOadmin.core.filtra(i3GEOadmin.menus.pegaFiltro());
						}
						//monta um template para o modal de inclusao de novo usuario
						if(i3GEOadmin.menus.formAdiciona == ""){
							html = Mustache.to_html(
									$("#templateLista").html(),
									$.extend(
											{},
											i3GEOadmin.menus.dicionario,
											{
												"id_menu": "modal",
												"excluir": i3GEOadmin.menus.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.menus.adiciona",//funcao
												"opcoesAberto": function(){
													var hash = {};
													hash["sim"] = i3GEOadmin.menus.dicionario.sim;
													hash["nao"] = i3GEOadmin.menus.dicionario.nao;
													return Mustache.to_html(
															$("#templateOpcoesAberto").html(),
															hash
													);
												},
												"opcoesPublicado": function(){
													var hash = {};
													hash["sim"] = i3GEOadmin.menus.dicionario.sim;
													hash["nao"] = i3GEOadmin.menus.dicionario.nao;
													return Mustache.to_html(
															$("#templateOpcoesPublicado").html(),
															hash
													);
												},
												"opcoesPerfil": opcoesPerfil
											}
									)
							);
							i3GEOadmin.menus.formAdiciona = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.menus.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		adicionaDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.menus.formAdiciona);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adiciona: function(){
			var parametros = $("#form-modal form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionar",
					parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.menus.ondeLista);
						i3GEOadmin.menus.lista();
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
					"mensagem": i3GEOadmin.menus.dicionario.confirma,
					"onBotao1": "i3GEOadmin.menus.excluir('"+id+"')",
					"botao1": i3GEOadmin.menus.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.menus.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"id_menu="+id
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						var json = jQuery.parseJSON(data)*1;
						$("#form-" + json).remove();
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
			var hash = {
					"mensagem": i3GEOadmin.menus.dicionario.confirma,
					"onBotao1": "i3GEOadmin.menus.salvar('"+id+"')",
					"botao1": i3GEOadmin.menus.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.menus.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvar: function(id){
			var parametros = $("#form-" + id + " form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"id_menu="+ id+"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.menus.ondeLista);
						i3GEOadmin.menus.lista();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		addPerfil: function(id,valor){
			var i = $("#"+id);
			$(i.val(i.val() + ' ' + valor));
		}
};