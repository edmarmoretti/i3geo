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
i3GEOadmin.usuarios = {
		//variavel global indicando o elemento que recebera a lista de usuarios
		ondeListaUsuarios: "",
		//conteudo html do formulario de adicao de operacao
		formAdicionaUsuario: "",
		init: function(onde){
			i3GEOadmin.usuarios.ondeListaUsuarios = onde;
			i3GEOadmin.usuarios.pegaUsuarios();
		},
		/*
Function: pegaUsuarios

Obt&eacute;m a lista de usuarios
		 */
		pegaUsuarios: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.usuarios.ondeListaUsuarios);
			$.post(
					"exec.php?funcao=pegaUsuariosEpapeis"
			)
			.done(
					function(data, status){
						//valor do filtro atual
						var filtro = i3GEOadmin.usuarios.valorFiltro();
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						//template dos checkbox
						var templatePapeis = $("#templateInputPapeis").html();
						//template do form de cada operacao
						var templateUsuarios = $("#templateUsuarios").html();
						//lista todas as usuarios
						var html = Mustache.to_html(
								"{{#data}}" + templateUsuarios + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.usuarios.dicionario,
										{
											"data": json["usuarios"],
											"onExcluir": "i3GEOadmin.usuarios.excluirUsuarioDialogo",//funcao
											"onSalvar": "i3GEOadmin.usuarios.salvarUsuarioDialogo",//funcao
											"labelDataCadastro": i3GEOadmin.usuarios.dicionario.dataCadastro,
											"labelAtivo": i3GEOadmin.usuarios.dicionario.ativo,
											"labelNovaSenha": i3GEOadmin.usuarios.dicionario.novaSenha,
											"selAtivoSim": function(){
												var p = this.ativo;
												if(p == "0"){
													return "";
												} else {
													return "selected";
												}
											},
											"selAtivoNao": function(){
												var p = this.ativo;
												if(p == "0"){
													return "selected";
												} else {
													return "";
												}
											},
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
						i3GEOadmin.usuarios.ondeListaUsuarios.html(html);
						//filtro
						html = Mustache.to_html(
								"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
								{"data":json["usuarios"]}
						);
						$("#filtro").html("<option value='' >Todos</option>" + html);
						$("#filtro").combobox();
						if(filtro != ""){
							i3GEOadmin.usuarios.defineFiltro(filtro);
							i3GEOadmin.usuarios.filtra(i3GEOadmin.usuarios.pegaFiltro());
						}
						//monta um template para o modal de inclusao de novo usuario
						if(i3GEOadmin.usuarios.formAdicionaUsuario == ""){
							html = Mustache.to_html(
									$("#templateUsuarios").html(),
									$.extend(
											{},
											i3GEOadmin.usuarios.dicionario,
											{
												"id_usuario": "modal",
												"excluir": i3GEOadmin.usuarios.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.usuarios.adicionaUsuario",//funcao
												"labelDataCadastro": i3GEOadmin.usuarios.dicionario.dataCadastro,
												"labelAtivo": i3GEOadmin.usuarios.dicionario.ativo,
												"labelNovaSenha": i3GEOadmin.usuarios.dicionario.novaSenha,
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
							i3GEOadmin.usuarios.formAdicionaUsuario = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.usuarios.ondeListaUsuarios.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		adicionaUsuarioDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.usuarios.formAdicionaUsuario);
		},
//		os parametros sao obtidos do formulario aberto do modal
		adicionaUsuario: function(){
			var parametros = $("#form-modal form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=adicionarUsuario",
					parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.usuarios.ondeListaUsuarios);
						i3GEOadmin.usuarios.pegaUsuarios();
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		excluirUsuarioDialogo: function(id_usuario){
			var hash = {
					"mensagem": i3GEOadmin.usuarios.dicionario.confirma,
					"onBotao1": "i3GEOadmin.usuarios.excluirUsuario('"+id_usuario+"')",
					"botao1": i3GEOadmin.usuarios.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.usuarios.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluirUsuario: function(id_usuario){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluirUsuario",
					"id_usuario="+id_usuario
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
		salvarUsuarioDialogo: function(id_usuario){
			var hash = {
					"mensagem": i3GEOadmin.usuarios.dicionario.confirma,
					"onBotao1": "i3GEOadmin.usuarios.salvarUsuario('"+id_usuario+"')",
					"botao1": i3GEOadmin.usuarios.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.usuarios.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvarUsuario: function(id_usuario){
			var parametros = $("#form-" + id_usuario + " form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterarUsuario",
					"id_usuario="+ id_usuario+"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.usuarios.ondeListaUsuarios);
						i3GEOadmin.usuarios.pegaUsuarios();
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
			return i3GEOadmin.usuarios.pegaFiltro().value;
		},
		defineFiltro: function(valor){
			i3GEOadmin.usuarios.pegaFiltro().value = valor;
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