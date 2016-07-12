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
i3GEOadmin.gruposusuarios = {
		//variavel global indicando o elemento que recebera a lista de usuarios
		ondeLista: "",
		//conteudo html do formulario de adicao de operacao
		formAdiciona: "",
		init: function(onde){
			i3GEOadmin.gruposusuarios.ondeLista = onde;
			i3GEOadmin.gruposusuarios.lista();
		},
		/*
Function: lista

Obt&eacute;m a lista de grupos
		 */
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.gruposusuarios.ondeLista);
			$.post(
					"exec.php?funcao=lista"
			)
			.done(
					function(data, status){
						//valor do filtro atual
						var filtro = i3GEOadmin.gruposusuarios.valorFiltro();
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						//template dos checkbox
						var templateUsuarios = $("#templateInputUsuarios").html();
						//template do form de cada operacao
						var templateLista = $("#templateLista").html();
						//lista todas as usuarios
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.gruposusuarios.dicionario,
										{
											"data": json["grupos"],
											"onExcluir": "i3GEOadmin.gruposusuarios.excluirDialogo",//funcao
											"onSalvar": "i3GEOadmin.gruposusuarios.salvarDialogo",//funcao
											"excluir": i3GEOadmin.gruposusuarios.dicionario.excluir,
											"inputUsuarios": function(){
												//marca os checkbox
												var p = this.usuarios;
												$(json["usuarios"]).each(
														function(i,el){
															if(p && el.id_usuario && p[el.id_usuario]){
																json["usuarios"][i]["checked"] = "checked";
															}
															else{
																json["usuarios"][i]["checked"] = "";
															}
														}
												);
												return Mustache.to_html(
														"{{#data}}" + templateUsuarios + "{{/data}}",
														{
															"data":json["usuarios"]
														}
												);
											}
										}
								)
						);
						i3GEOadmin.gruposusuarios.ondeLista.html(html);
						//filtro
						html = Mustache.to_html(
								"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
								{"data":json["grupos"]}
						);
						$("#filtro").html("<option value='' >Todos</option>" + html);
						$("#filtro").combobox();
						if(filtro != ""){
							i3GEOadmin.gruposusuarios.defineFiltro(filtro);
							i3GEOadmin.gruposusuarios.filtra(i3GEOadmin.gruposusuarios.pegaFiltro());
						}
						//monta um template para o modal de inclusao de novo usuario
						if(i3GEOadmin.gruposusuarios.formAdiciona == ""){
							html = Mustache.to_html(
									$("#templateLista").html(),
									$.extend(
											{},
											i3GEOadmin.gruposusuarios.dicionario,
											{
												"id_grupo": "modal",
												"excluir": i3GEOadmin.gruposusuarios.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.gruposusuarios.adiciona",//funcao
												"nome": "",
												"descricao": "",
												"inputUsuarios": function(){
													return Mustache.to_html(
															"{{#data}}" + templateUsuarios + "{{/data}}",
															{
																"data":json["usuarios"]
															}
													);
												}
											}
									)
							);
							i3GEOadmin.gruposusuarios.formAdiciona = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.gruposusuarios.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		adicionaDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.gruposusuarios.formAdiciona);
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
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.gruposusuarios.ondeLista);
						i3GEOadmin.gruposusuarios.lista();
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
					"mensagem": i3GEOadmin.gruposusuarios.dicionario.confirma,
					"onBotao1": "i3GEOadmin.gruposusuarios.excluir('"+id+"')",
					"botao1": i3GEOadmin.gruposusuarios.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.gruposusuarios.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"id_grupo="+id
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
					"mensagem": i3GEOadmin.gruposusuarios.dicionario.confirma,
					"onBotao1": "i3GEOadmin.gruposusuarios.salvar('"+id+"')",
					"botao1": i3GEOadmin.gruposusuarios.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.gruposusuarios.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvar: function(id){
			var parametros = $("#form-" + id + " form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"id_grupo="+ id +"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.gruposusuarios.ondeLista);
						i3GEOadmin.gruposusuarios.lista();
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
			return i3GEOadmin.gruposusuarios.pegaFiltro().value;
		},
		defineFiltro: function(valor){
			i3GEOadmin.gruposusuarios.pegaFiltro().value = valor;
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