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

function init(onde){
	//variavel global indicando o elemento que recebera a lista de usuarios
	ondeListaUsuarios = onde;
	//conteudo html do formulario de adicao de operacao
	formAdicionaUsuario = "";
	pegaUsuarios();
}
/*
Function: pegaUsuarios

Obt&eacute;m a lista de usuarios
 */
function pegaUsuarios(){
	iconeAguarde(ondeListaUsuarios);
	$.post(
			"exec.php?funcao=pegaUsuariosEpapeis"
	)
	.done(
			function(data, status){
				//valor do filtro atual
				var filtro = valorFiltro();
				//objeto json com os dados viondos do banco
				var json = jQuery.parseJSON(data);
				//template dos checkbox
				var templatePapeis = $("#templateInputPapeis").html();
				//template do form de cada operacao
				var templateUsuarios = $("#templateUsuarios").html();
				//lista todas as usuarios
				var html = Mustache.to_html(
						"{{#data}}" + templateUsuarios + "{{/data}}",
						{
							"data": json["usuarios"],
							"excluir": $trad("excluir",i3GEOadmin.core.dicionario),
							"onExcluir": "excluirUsuarioDialogo",//funcao
							"salvar": $trad("salva",i3GEOadmin.core.dicionario),
							"onSalvar": "salvarUsuarioDialogo",//funcao
							"enviaSenha": $trad("enviaSenha",i3GEOadmin.usuarios.dicionario),
							"onEnviarSenha": "EnviarSenha",//funcao
							"usuario": $trad("usuario",i3GEOadmin.usuarios.dicionario),
							"nome": $trad("nome",i3GEOadmin.usuarios.dicionario),
							"labelDataCadastro": $trad("dataCadastro",i3GEOadmin.usuarios.dicionario),
							"labelAtivo": $trad("ativo",i3GEOadmin.usuarios.dicionario),
							"labelNovaSenha": $trad("novaSenha",i3GEOadmin.usuarios.dicionario),
							"papeisv": $trad("papeisv",i3GEOadmin.usuarios.dicionario),
							"sim": $trad("sim",i3GEOadmin.usuarios.dicionario),
							"nao": $trad("nao",i3GEOadmin.usuarios.dicionario),
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
				);
				ondeListaUsuarios.html(html);
				//filtro
				html = Mustache.to_html(
						"{{#data}}" + $("#templateFiltro").html() + "{{/data}}",
						{"data":json["usuarios"]}
				);
				$("#filtro").html("<option value='' >---</option>" + html);
				if(filtro != ""){
					defineFiltro(filtro);
					filtra(pegaFiltro());
				}
				//monta um template para o modal de inclusao de novo usuario
				html = Mustache.to_html(
						$("#templateUsuarios").html(),
						{
							"id_usuario": "modal",
							"enviaSenha": $trad("enviaSenha",i3GEOadmin.usuarios.dicionario),
							"excluir": $trad("cancelar",i3GEOadmin.core.dicionario),
							"onExcluir": "fechaModalGeral",//funcao
							"salvar": $trad("salva",i3GEOadmin.core.dicionario),
							"onSalvar": "adicionaUsuario",//funcao
							"usuario": $trad("usuario",i3GEOadmin.usuarios.dicionario),
							"nome": $trad("nome",i3GEOadmin.usuarios.dicionario),
							"labelDataCadastro": $trad("dataCadastro",i3GEOadmin.usuarios.dicionario),
							"labelAtivo": $trad("ativo",i3GEOadmin.usuarios.dicionario),
							"labelNovaSenha": $trad("novaSenha",i3GEOadmin.usuarios.dicionario),
							"papeisv": $trad("papeisv",i3GEOadmin.usuarios.dicionario),
							"sim": $trad("sim",i3GEOadmin.usuarios.dicionario),
							"nao": $trad("nao",i3GEOadmin.usuarios.dicionario),
							"inputPapeis": function(){
								return Mustache.to_html(
										"{{#data}}" + $("#templateInputPapeis").html() + "{{/data}}",
										{
											"data":json["papeis"]
										}
								);
							}
						}
				);
				formAdicionaUsuario = html;
				$.material.init();
			}
	)
	.fail(function(data){
		ondeListaUsuarios.html("");
		mostraErro(data.status + " " +data.statusText);
	});
}
function adicionaUsuarioDialogo(){
	abreModalGeral(formAdicionaUsuario);
}

//os parametros sao obtidos do formulario aberto do modal

function adicionaUsuario(){
	var parametros = $("#form-modal form").serialize();
	fechaModalGeral();
	modalAguarde(true);
	$.post(
			"exec.php?funcao=adicionarUsuario",
			parametros
	)
	.done(
			function(data, status){
				modalAguarde(false);
				iconeAguarde(ondeListaUsuarios);
				pegaUsuarios();
			}
	)
	.fail(
			function(data){
				modalAguarde(false);
				mostraErro(data.status + " " +data.statusText);
			}
	);
}
function excluirUsuarioDialogo(id_usuario){
	var hash = {
			"mensagem": $trad("confirma",i3GEOadmin.core.dicionario),
			"onBotao1": "excluirUsuario('"+id_usuario+"')",
			"botao1": $trad("sim",i3GEOadmin.core.dicionario),
			"onBotao2": "fechaModalConfirma();",
			"botao2": $trad("nao",i3GEOadmin.core.dicionario)
	};
	abreModalConfirma(hash);
}
function excluirUsuario(id_usuario){
	modalAguarde(true);
	$.post(
			"exec.php?funcao=excluirUsuario",
			"id_usuario="+id_usuario
	)
	.done(
			function(data, status){
				modalAguarde(false);
				var json = jQuery.parseJSON(data)*1;
				$("#form-" + json).remove();
			}
	)
	.fail(
			function(data){
				modalAguarde(false);
				mostraErro(data.status + " " +data.statusText);
			}
	);
}
function salvarUsuarioDialogo(id_usuario){
	var hash = {
			"mensagem": $trad("confirma",i3GEOadmin.core.dicionario),
			"onBotao1": "salvarUsuario('"+id_usuario+"')",
			"botao1": $trad("sim",i3GEOadmin.core.dicionario),
			"onBotao2": "fechaModalConfirma();",
			"botao2": $trad("nao",i3GEOadmin.core.dicionario)
	};
	abreModalConfirma(hash);
}
function salvarUsuario(id_usuario){
	var parametros = $("#form-" + id_usuario + " form").serialize();
	fechaModalGeral();
	modalAguarde(true);
	$.post(
			"exec.php?funcao=alterarUsuario",
			"id_usuario="+ id_usuario+"&"+parametros
	)
	.done(
			function(data, status){
				modalAguarde(false);
				iconeAguarde(ondeListaUsuarios);
				pegaUsuarios();
			}
	)
	.fail(
			function(data){
				modalAguarde(false);
				mostraErro(data.status + " " +data.statusText);
			}
	);
}
function pegaFiltro(){
	return $i("filtro");
}
function valorFiltro(){
	return pegaFiltro().value;
}
function defineFiltro(valor){
	pegaFiltro().value = valor;
}
function filtra(obj){

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

