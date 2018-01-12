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
i3GEOadmin.mapfile = {
		//variavel global indicando o elemento que recebera a lista de menus
		ondeLista: "",
		favoritosArray: [],
		formAdiciona: "",
		parametrosSalvar: "",
		init: function(onde,palavra){
			i3GEOadmin.mapfile.ondeLista = onde;
			i3GEOadmin.mapfile.lista(palavra);
			i3GEOadmin.mapfile.retornaFavoritosArray();
		},
		/*
Function: lista

Obt&eacute;m a lista
		 */
		lista: function(palavra,validar){
			if(!validar){
				validar = "";
			}
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.mapfile.ondeLista);
			$.post(
					"exec.php?funcao=lista",
					"&palavra=" + palavra + "&validar=" + validar
			)
			.done(
					function(data, status){

						//valor do filtro atual
						var filtro = i3GEOadmin.core.valorFiltro();
						//objeto json com os dados viondos do banco
						var json = jQuery.parseJSON(data);
						var templateLista = $("#templateLista").html();
						templateLista = templateLista.replace("{{{templateFormLista}}}",$("#templateFormLista").html());
						var html = Mustache.to_html(
								"{{#data}}" + templateLista + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.mapfile.dicionario,
										{
											"data": json
										}
								)
						);
						i3GEOadmin.mapfile.ondeLista.html(html);
						i3GEOadmin.mapfile.montaFavoritos();
						$("#totalMapfiles").html(json.length);
						//filtro
						html = Mustache.to_html(
								"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
								{"data":json}
						);
						$("#filtro").html("<option value='' >Todos</option>" + html);
						$("#filtro").combobox();
						$(".ui-autocomplete-input").attr( "title", "Filtro" );

						if(filtro != ""){
							i3GEOadmin.core.defineFiltro(filtro);
							i3GEOadmin.core.filtra(i3GEOadmin.mapfile.pegaFiltro());
						}

						//monta um template para o modal de inclusao
						if(i3GEOadmin.mapfile.formAdiciona == ""){
							html = Mustache.to_html(
									$("#templateManterTema").html(),
									$.extend(
											{},
											i3GEOadmin.mapfile.dicionario,
											{
												"codigo": "",
												"escondido": "hidden",
												"excluir": i3GEOadmin.mapfile.dicionario.cancelar,
												"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
												"onSalvar": "i3GEOadmin.mapfile.adiciona",
												"metaestatnao": "selected",
												"acessopublico": "checked",
												"criaMapfileTxt": i3GEOadmin.mapfile.dicionario.criaMapfile,
												"criaMapfileDescTxt": i3GEOadmin.mapfile.dicionario.criaMapfileDesc
											}
									)
							);
							i3GEOadmin.mapfile.formAdiciona = html;
						}
						$.material.init();
					}
			)
			.fail(function(data){
				i3GEOadmin.mapfile.ondeLista.html("");
				i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
			});
		},
		editarDialogo: function(id){
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			//deve-se usar o codigo e nao o id_tema
			$.post(
					"exec.php?funcao=listaunico",
					"codigo=" + id
			)
			.done(
					function(data, status){
						var json = jQuery.parseJSON(data);
						var html = Mustache.to_html(
								"{{#data}}" + $("#templateManterTema").html() + "{{/data}}",
								$.extend(
										{},
										i3GEOadmin.mapfile.dicionario,
										{
											"data": json["dados"],
											"onExcluir": "i3GEOadmin.mapfile.excluirDialogo",//funcao
											"onSalvar": "i3GEOadmin.mapfile.salvarAlteracaoDialogo",
											"criaMapfileTxt": i3GEOadmin.mapfile.dicionario.editaMapfile,
											"criaMapfileDescTxt": i3GEOadmin.mapfile.dicionario.editaMapfileDesc
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
		salvarAlteracaoDialogo: function(codigo,id){
			i3GEOadmin.mapfile.parametrosSalvar = $("#form-edicao-" + codigo).serialize();
			var hash = {
					"mensagem": i3GEOadmin.mapfile.dicionario.confirma,
					"onBotao1": "i3GEOadmin.mapfile.salva('"+id+"')",
					"botao1": i3GEOadmin.mapfile.dicionario.sim,
					"onBotao2": "i3GEOadmin.mapfile.parametrosSalvar = '';i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.mapfile.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		salva: function(id){
			var parametros = i3GEOadmin.mapfile.parametrosSalvar;
			i3GEOadmin.core.fechaModalGeral();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=alterar",
					"id_tema=" + id + "&"+parametros
			)
			.done(
					function(data, status){
						i3GEOadmin.mapfile.parametrosSalvar = '';
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.mapfile.ondeLista);
						i3GEOadmin.mapfile.lista("","");
					}
			)
			.fail(
					function(data){
						i3GEOadmin.mapfile.parametrosSalvar = '';
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		adicionaDialogo: function(){
			i3GEOadmin.core.abreModalGeral(i3GEOadmin.mapfile.formAdiciona);
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
						var json = jQuery.parseJSON(data);
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.iconeAguarde(i3GEOadmin.mapfile.ondeLista);
						i3GEOadmin.mapfile.favoritosArray.push(json.codigo);
						i3GEOadmin.mapfile.lista("","");
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
					"mensagem": i3GEOadmin.mapfile.dicionario.confirma,
					"onBotao1": "i3GEOadmin.mapfile.excluir('"+id+"')",
					"botao1": i3GEOadmin.mapfile.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.mapfile.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		excluir: function(id){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=excluir",
					"codigo="+id
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.mapfile.lista("","");
						i3GEOadmin.mapfile.registraFavoritos(id);
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
			i3GEOadmin.mapfile.parametrosSalvar = $("#form-edicao-" + id).serialize();
			//console.info(i3GEOadmin.mapfile.parametrosSalvar);
			var hash = {
					"mensagem": i3GEOadmin.mapfile.dicionario.confirma,
					"onBotao1": "i3GEOadmin.mapfile.salvar('"+id+"')",
					"botao1": i3GEOadmin.mapfile.dicionario.sim,
					"onBotao2": "i3GEOadmin.mapfile.parametrosSalvar = '';i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.mapfile.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		retornaFavoritosArray: function(){
			var temp = i3GEO.util.pegaCookie("I3GEOfavoritosEditorMapfile");
			if(temp){
				i3GEOadmin.mapfile.favoritosArray = temp.split(",");
			}
			else{
				i3GEOadmin.mapfile.favoritosArray = [];
			}
			return i3GEOadmin.mapfile.favoritosArray;
		},
		registraFavoritos: function(codigoTema){
			i3GEOadmin.mapfile.favoritosArray.remove("NaN");
			if(i3GEO.util.in_array(codigoTema,i3GEOadmin.mapfile.favoritosArray)){
				i3GEOadmin.mapfile.favoritosArray.remove(codigoTema);
			} else {
				i3GEOadmin.mapfile.favoritosArray.push(codigoTema);
			}
			i3GEO.util.insereCookie("I3GEOfavoritosEditorMapfile", i3GEOadmin.mapfile.favoritosArray.toString(","));
			i3GEOadmin.mapfile.montaFavoritos();
		},
		montaFavoritos: function(){
			//o try aqui e necessario para evitar seletor com erro. Eventualmente.
			try {
				var mapfile, i, conteudo = [], n, codigo, h;
				n = i3GEOadmin.mapfile.favoritosArray.length;
				for (i=0; i<n; i++){
					codigo = i3GEOadmin.mapfile.favoritosArray[i];
					h = $("#form-" + codigo).html();
					if(h != undefined){
						conteudo.push(h+"&nbsp;");
					}
				}
				$("#body-favoritos").html(conteudo.join("\n"));
			} catch (e) {
				i3GEOadmin.mapfile.favoritosArray = [];
			}

		},
		limpaCacheDialogo: function(codigo){
			var hash = {
					"mensagem": i3GEOadmin.mapfile.dicionario.excluiCache,
					"onBotao1": "i3GEOadmin.mapfile.limpaCache('"+codigo+"')",
					"botao1": i3GEOadmin.mapfile.dicionario.sim,
					"onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
					"botao2": i3GEOadmin.mapfile.dicionario.nao
			};
			i3GEOadmin.core.abreModalConfirma(hash);
		},
		limpaCache: function(codigo){
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=limpaCache",
					"codigo="+codigo
			)
			.done(
					function(data, status){
						i3GEOadmin.core.modalAguarde(false);
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		clonaDialogo: function(codigo){
			var html = Mustache.to_html(
					"{{#data}}" + $("#templateClonarTema").html() + "{{/data}}",
					$.extend(
							{},
							i3GEOadmin.mapfile.dicionario,
							{
								"data": "modal",
								"codigoAtual": codigo
							}
					)
			);
			i3GEOadmin.core.abreModalGeral(html);
		},
		clona: function(){
			var parametros = $("#form-modal-adiciona").serialize();
			i3GEOadmin.core.modalAguarde(true);
			$.post(
					"exec.php?funcao=clonarmapfile",
					parametros
			)
			.done(
					function(data, status){
						var json = jQuery.parseJSON(data);
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.mapfile.favoritosArray.push(json.codigo);
						i3GEOadmin.mapfile.init($("#corpo"),"");
					}
			)
			.fail(
					function(data){
						i3GEOadmin.core.modalAguarde(false);
						i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
					}
			);
		},
		aplicaFiltroPalavra: function(){
			var palavra = $("#filtroPrefixo").val();
			i3GEOadmin.mapfile.lista(palavra);
		},
		testa: function(codigo){
			i3GEOadmin.core.modalAguarde(true);
			i3GEOadmin.teste.testaImg("../../..",codigo,"","",$("#modalGeral .modal-body"))
		}
};