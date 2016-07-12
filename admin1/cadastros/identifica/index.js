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
		ondeListaIdentifica: "",
		//conteudo html do formulario de adicao de operacao
		formAdicionaIdentifica: "",
		init: function(onde){
			i3GEOadmin.identifica.ondeListaIdentifica = onde;
			i3GEOadmin.identifica.pegaIdentifica();
		},
		/*
Function: pegaIdentifica

Obt&eacute;m a lista de Identifica
		 */
		pegaIdentifica: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.identifica.ondeListaIdentifica);
			$.post(
					"exec.php?funcao=pegaId"
			)
			.done(
					function(data, status){
						//valor do filtro atual
						var filtro = i3GEOadmin.identifica.valorFiltro();
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						//template do form de cada operacao
						var templateIdentifica = $("#templateIdentifica").html();
						//lista todas as Identifica
						var html = Mustache.to_html(
								"{{#data}}" + templateIdentifica + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.identifica.dicionario,
										{
											"data": json,
											"excluir": i3GEOadmin.identifica.dicionario.excluir,
											"onExcluir": "i3GEOadmin.identifica.excluirIdentificaDialogo",//funcao
											"onSalvar": "i3GEOadmin.identifica.salvarIdentificaDialogo",//funcao
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
						i3GEOadmin.identifica.ondeListaIdentifica.html(html);
						//filtro
						html = Mustache.to_html(
								"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
								{"data":json}
						);
						$("#filtro").html("<option value='' >Todos</option>" + html);
						$("#filtro").combobox();
						if(filtro != ""){
							i3GEOadmin.identifica.defineFiltro(filtro);
							i3GEOadmin.identifica.filtra(i3GEOadmin.identifica.pegaFiltro());
						}
						//monta um template para o modal de inclusao de novo usuario
						if(i3GEOadmin.identifica.formAdicionaIdentifica == ""){
							html = Mustache.to_html(
									$("#templateIdentifica").html(),
									$.extend(
											{},
											i3GEOadmin.identifica.dicionario,
											{
												"id_i": "modal",
												"excluir": i3GEOadmin.identifica.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.identifica.adicionaIdentifica",//funcao
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
							i3GEOadmin.identifica.formAdicionaIdentifica = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.identifica.ondeListaIdentifica.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		adicionaIdentificaDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.identifica.formAdicionaIdentifica);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adicionaIdentifica: function(){
			var parametros = $("#form-modal form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionarId",
					parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.identifica.ondeListaIdentifica);
						i3GEOadmin.identifica.pegaIdentifica();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		excluirIdentificaDialogo: function(id_i){
			var hash = {
					"mensagem": i3GEOadmin.identifica.dicionario.confirma,
					"onBotao1": "i3GEOadmin.identifica.excluirIdentifica('"+id_i+"')",
					"botao1": i3GEOadmin.identifica.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.identifica.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluirIdentifica: function(id_i){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluirId",
					"id_i="+id_i
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
		salvarIdentificaDialogo: function(id_i){
			var hash = {
					"mensagem": i3GEOadmin.identifica.dicionario.confirma,
					"onBotao1": "i3GEOadmin.identifica.salvarIdentifica('"+id_i+"')",
					"botao1": i3GEOadmin.identifica.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.identifica.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvarIdentifica: function(id_i){
			var parametros = $("#form-" + id_i + " form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterarId",
					"id_i="+ id_i+"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.identifica.ondeListaIdentifica);
						i3GEOadmin.identifica.pegaIdentifica();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		pegaFiltro: function(){
			return $i("filtro");
		},
		valorFiltro: function(){
			return i3GEOadmin.identifica.pegaFiltro().value;
		},
		defineFiltro: function(valor){
			i3GEOadmin.identifica.pegaFiltro().value = valor;
		},
		filtra: function(obj){
			$("#corpo .panel").each(
					function(i,el){
						if(obj.value == ""){
							$(el).show();
						}
						else {
							$(el).hide();
						}
					}
			);
			if(obj.value != ""){
				$("#"+obj.value).show();
			}
		}
};