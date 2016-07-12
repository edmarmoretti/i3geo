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

i3GEOadmin.operacoes = {
		//variavel global indicando o elemento que recebera a lista de operacoes
		ondeListaOperacoes: "",
		//conteudo html do formulario de adicao de operacao
		formAdicionaOperacao: "",
		/*
Function: initMenu

Inicializa o editor
		 */
		init: function(onde){
			i3GEOadmin.operacoes.ondeListaOperacoes = onde;
			i3GEOadmin.operacoes.pegaOperacoes();
		},
		/*
Function: pegaOperacoes

Obt&eacute;m a lista de operacoes
		 */
		pegaOperacoes: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.operacoes.ondeListaOperacoes);
			$.post(
					"exec.php?funcao=pegaOperacoesEpapeis"
			)
			.done(
					function(data, status){
						//valor do filtro atual
						var filtro = i3GEOadmin.operacoes.valorFiltro();
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						//template dos checkbox
						var templatePapeis = $("#templateInputPapeis").html();
						//template do form de cada operacao
						var templateOperacoes = $("#templateOperacoes").html();
						//lista todas as operacoes
						var html = Mustache.to_html(
								"{{#data}}" + templateOperacoes + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.operacoes.dicionario,
										{
											"data":json["operacoes"],
											"onExcluir": "i3GEOadmin.operacoes.excluirOperacaoDialogo",//funcao
											"onSalvar": "i3GEOadmin.operacoes.salvarOperacaoDialogo",//funcao
											"labelCodigo": i3GEOadmin.operacoes.dicionario.codigo,
											"labelDescricao": i3GEOadmin.operacoes.dicionario.descricao,
											"inputPapeis": function(){
												//marca os checkbox
												var p = this.papeis;
												$(json["papeis"]).each(
														function(i,el){
															if(p && el.id_papel && (p[el.id_papel] || el.id_papel == 1)){
																json["papeis"][i]["checked"] = "checked";
															}
															else{
																json["papeis"][i]["checked"] = "";
															}
														}
												);
												return Mustache.to_html(
														"{{#data}}" + templatePapeis + "{{/data}}",
														{
															"data":json["papeis"]
														}
												);
											}
										}
								)
						);
						i3GEOadmin.operacoes.ondeListaOperacoes.html(html);
						//filtro
						html = Mustache.to_html(
								"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
								{"data":json["operacoes"]}
						);
						$("#filtro").html("<option value='' >Todos</option>" + html);
						$("#filtro").combobox();
						if(filtro != ""){
							i3GEOadmin.operacoes.defineFiltro(filtro);
							i3GEOadmin.operacoes.filtra(pegaFiltro());
						}
						//monta um template para o modal de inclusao de nova operacao
						if(i3GEOadmin.operacoes.formAdicionaOperacao == ""){
							html = Mustache.to_html(
									$("#templateOperacoes").html(),
									$.extend(
											{},
											i3GEOadmin.operacoes.dicionario,
											{
												"labelCodigo": i3GEOadmin.operacoes.dicionario.codigo,
												"labelDescricao": i3GEOadmin.operacoes.dicionario.descricao,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.operacoes.adicionaOperacao",//funcao
												"excluir": i3GEOadmin.operacoes.dicionario.cancela,
												"codigo": "",
												"id_operacao": "modal",
												"descricao": "",
												"inputPapeis": function(){
													return Mustache.to_html(
															"{{#data}}" + $("#templateInputPapeis").html() + "{{/data}}",
															{
																"data":json["papeis"]
															}
													);
												}
											}
									)
							);
							i3GEOadmin.operacoes.formAdicionaOperacao = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.operacoes.ondeListaOperacoes.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		adicionaOperacaoDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.operacoes.formAdicionaOperacao);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adicionaOperacao: function(){
			var parametros = $("#form-modal form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionarOperacao",
					parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.operacoes.ondeListaOperacoes);
						i3GEOadmin.operacoes.pegaOperacoes();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		excluirOperacaoDialogo: function(id_operacao){
			var hash = {
					"mensagem": i3GEOadmin.operacoes.dicionario.confirma,
					"onBotao1": "i3GEOadmin.operacoes.excluirOperacao('"+id_operacao+"')",
					"botao1": i3GEOadmin.operacoes.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.operacoes.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluirOperacao: function(id_operacao){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluirOperacao",
					"id_operacao="+id_operacao
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						var json = jQuery.parseJSON(data)*1;
						$("#form-" + json).remove();
						$("#link-" + json).remove();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		salvarOperacaoDialogo: function(id_operacao){
			var hash = {
					"mensagem": i3GEOadmin.operacoes.dicionario.confirma,
					"onBotao1": "i3GEOadmin.operacoes.salvarOperacao('"+id_operacao+"')",
					"botao1": i3GEOadmin.operacoes.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.operacoes.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvarOperacao: function(id_operacao){
			var parametros = $("#form-" + id_operacao + " form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterarOperacao",
					"id_operacao="+ id_operacao +"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.operacoes.ondeListaOperacoes);
						i3GEOadmin.operacoes.pegaOperacoes();
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
			return i3GEOadmin.operacoes.pegaFiltro().value;
		},
		defineFiltro: function(valor){
			i3GEOadmin.operacoes.pegaFiltro().value = valor;
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
