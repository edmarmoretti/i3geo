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
i3GEOadmin.mapas = {
		//variavel global indicando o elemento que recebera a lista de menus
		ondeLista: "",
		//conteudo html do formulario de adicao de operacao
		formAdiciona: "",
		init: function(onde){
			i3GEOadmin.mapas.ondeLista = onde;
			i3GEOadmin.mapas.lista();
		},
		/*
Function: lista

Obt&eacute;m a lista
		 */
		lista: function(){
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.mapas.ondeLista);
			$.post(
					"exec.php?funcao=lista"
			)
			.done(
					function(data, status){
						//valor do filtro atual
						var filtro = i3GEOadmin.mapas.valorFiltro();
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						//template do form de cada operacao
						var templateLista = $("#templateLista").html();
						//combo com perfis
						var opcoesTema = '<option value="">---</option>' + Mustache.to_html(
								"{{#data}}" + $("#templateTemas").html() + "{{/data}}",
								{"data":json["temas"]}
						);
						//combo com temas
						var opcoesPerfil = '<option value="">---</option>' + Mustache.to_html(
								"{{#data}}" + $("#templateOpcoesPerfil").html() + "{{/data}}",
								{"data":json["perfis"]}
						);
						//lista todas as menus
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.mapas.dicionario,
										{
											"data": json["dados"],
											"onExcluir": "i3GEOadmin.mapas.excluirDialogo",//funcao
											"onSalvar": "i3GEOadmin.mapas.salvarDialogo",//funcao
											"opcoesPublicado": function(){
												var hash = {};
												hash[this.publicado_mapa + "-sel"] = "selected";
												hash["sim"] = i3GEOadmin.mapas.dicionario.sim;
												hash["nao"] = i3GEOadmin.mapas.dicionario.nao;
												if(this.publicado_mapa == ""){
													this.publicado_mapa = "sim";
												}
												return Mustache.to_html(
														$("#templateOpcoesPublicado").html(),
														hash
												);
											},
											"opcoesPerfil": opcoesPerfil,
											"opcoesTema": opcoesTema
										}
								)
						);
						i3GEOadmin.mapas.ondeLista.html(html);
						//filtro
						html = Mustache.to_html(
								"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
								{"data":json["dados"]}
						);
						$("#filtro").html("<option value='' >Todos</option>" + html);
						$("#filtro").combobox();
						if(filtro != ""){
							i3GEOadmin.mapas.defineFiltro(filtro);
							i3GEOadmin.mapas.filtra(i3GEOadmin.mapas.pegaFiltro());
						}
						//monta um template para o modal de inclusao de novo usuario
						if(i3GEOadmin.mapas.formAdiciona == ""){
							html = Mustache.to_html(
									$("#templateLista").html(),
									$.extend(
											{},
											i3GEOadmin.mapas.dicionario,
											{
												"id_mapa": "modal",
												"excluir": i3GEOadmin.mapas.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.mapas.adiciona",//funcao
												"opcoesPublicado": function(){
													var hash = {};
													hash["sim"] = i3GEOadmin.mapas.dicionario.sim;
													hash["nao"] = i3GEOadmin.mapas.dicionario.nao;
													return Mustache.to_html(
															$("#templateOpcoesPublicado").html(),
															hash
													);
												},
												"opcoesPerfil": opcoesPerfil,
												"opcoesTema": opcoesTema
											}
									)
							);
							i3GEOadmin.mapas.formAdiciona = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.mapas.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		adicionaDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.mapas.formAdiciona);
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
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.mapas.ondeLista);
						i3GEOadmin.mapas.lista();
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
					"mensagem": i3GEOadmin.mapas.dicionario.confirma,
					"onBotao1": "i3GEOadmin.mapas.excluir('"+id+"')",
					"botao1": i3GEOadmin.mapas.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.mapas.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"id_mapa="+id
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
					"mensagem": i3GEOadmin.mapas.dicionario.confirma,
					"onBotao1": "i3GEOadmin.mapas.salvar('"+id+"')",
					"botao1": i3GEOadmin.mapas.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.mapas.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salvar: function(id){
			var parametros = $("#form-" + id + " form").serialize();
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"id_mapa="+ id+"&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.mapas.ondeLista);
						i3GEOadmin.mapas.lista();
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
			return i3GEOadmin.mapas.pegaFiltro().value;
		},
		defineFiltro: function(valor){
			i3GEOadmin.mapas.pegaFiltro().value = valor;
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
		},
		addInput: function(id,valor){
			var i = $("#"+id);
			$(i.val(i.val() + ' ' + valor));
		}
};