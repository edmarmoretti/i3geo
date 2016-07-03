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
/*
Function: initMenu

Inicializa o editor
 */
function init(onde){
	//variavel global indicando o elemento que recebera a lista de operacoes
	ondeListaOperacoes = onde;
	//conteudo html do formulario de adicao de operacao
	formAdicionaOperacao = "";
	pegaOperacoes();
}
/*
Function: pegaOperacoes

Obt&eacute;m a lista de operacoes
 */
function pegaOperacoes(){
	iconeAguarde(ondeListaOperacoes);
	$.post(
			"exec.php?funcao=pegaOperacoesEpapeis"
	)
	.done(
			function(data, status){
				//objeto json com os dados viondos do banco
				var json = jQuery.parseJSON(data);
				//template dos checkbox
				var templatePapeis = $("#templateInputPapeis").html();
				//template do form de cada operacao
				var templateOperacoes = $("#templateOperacoes").html();
				//lista todas as operacoes
				var html = Mustache.to_html(
						"{{#data}}" + templateOperacoes + "{{/data}}",
						{
							"data":json["operacoes"],
							"excluir": $trad("excluir",i3GEOadmin.core.dicionario),
							"onExcluir": "excluirOperacaoDialogo",//funcao
							"salvar": $trad("salva",i3GEOadmin.core.dicionario),
							"onSalvar": "salvarOperacaoDialogo",//funcao
							"labelCodigo": $trad("codigo",i3GEOadmin.operacoes.dicionario),
							"labelDescricao": $trad("descricao",i3GEOadmin.operacoes.dicionario),
							"operacao": $trad("operacao",i3GEOadmin.operacoes.dicionario),
							"papeisv": $trad("papeisv",i3GEOadmin.operacoes.dicionario),
							"inputPapeis": function(){
								//marca os checkbox
								var p = this.papeis;
								$(json["papeis"]).each(
										function(i,el){
											if(p[el.id_papel] || el.id_papel == 1){
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
				ondeListaOperacoes.html(html);
				//indice
				html = Mustache.to_html(
						"{{#data}}" + $("#indiceTpl").html() + "{{/data}}",
						{"data":json["operacoes"]}
				);
				//indice lateral
				$("#indice").html(html);
				//monta um template para o modal de inclusao de nova operacao
				html = Mustache.to_html(
						$("#templateOperacoes").html(),
						{
							"labelCodigo": $trad("codigo",i3GEOadmin.operacoes.dicionario),
							"labelDescricao": $trad("descricao",i3GEOadmin.operacoes.dicionario),
							"operacao": $trad("operacao",i3GEOadmin.operacoes.dicionario),
							"papeisv": $trad("papeisv",i3GEOadmin.operacoes.dicionario),
							"excluir": $trad("cancelar",i3GEOadmin.core.dicionario),
							"onExcluir": "fechaModalGeral",//funcao
							"salvar": $trad("salva",i3GEOadmin.core.dicionario),
							"onSalvar": "adicionaOperacao",//funcao
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
				);
				formAdicionaOperacao = html;
				$.material.init();
			}
	)
	.fail(function(data){
		ondeListaOperacoes.html("");
		mostraErro(data.status + " " +data.statusText);
	});
}
function adicionaOperacaoDialogo(){
	abreModalGeral(formAdicionaOperacao);
}

//os parametros sao obtidos do formulario aberto do modal

function adicionaOperacao(){
	var parametros = $("#form-modal form").serialize();
	fechaModalGeral();
	modalAguarde(true);
	$.post(
			"exec.php?funcao=adicionarOperacao",
			parametros
	)
	.done(
			function(data, status){
				modalAguarde(false);
				iconeAguarde(ondeListaOperacoes);
				pegaOperacoes();
			}
	)
	.fail(
			function(data){
				modalAguarde(false);
				mostraErro(data.status + " " +data.statusText);
			}
	);
}
function excluirOperacaoDialogo(id_operacao){
	var hash = {
			"mensagem": $trad("confirma",i3GEOadmin.core.dicionario),
			"onBotao1": "excluirOperacao('"+id_operacao+"')",
			"botao1": $trad("sim",i3GEOadmin.core.dicionario),
			"onBotao2": "fechaModalConfirma();",
			"botao2": $trad("nao",i3GEOadmin.core.dicionario)
	};
	abreModalConfirma(hash);
}
function excluirOperacao(id_operacao){
	modalAguarde(true);
	$.post(
			"exec.php?funcao=excluirOperacao",
			"id_operacao="+id_operacao
	)
	.done(
			function(data, status){
				modalAguarde(false);
				var json = jQuery.parseJSON(data)*1;
				$("#form-" + json).remove();
				$("#link-" + json).remove();
			}
	)
	.fail(
			function(data){
				modalAguarde(false);
				mostraErro(data.status + " " +data.statusText);
			}
	);
}
function salvarOperacaoDialogo(id_operacao){
	var hash = {
			"mensagem": $trad("confirma",i3GEOadmin.core.dicionario),
			"onBotao1": "salvarOperacao('"+id_operacao+"')",
			"botao1": $trad("sim",i3GEOadmin.core.dicionario),
			"onBotao2": "fechaModalConfirma();",
			"botao2": $trad("nao",i3GEOadmin.core.dicionario)
	};
	abreModalConfirma(hash);
}
function salvarOperacao(id_operacao){
	var parametros = $("#form-" + id_operacao + " form").serialize();
	fechaModalGeral();
	modalAguarde(true);
	$.post(
			"exec.php?funcao=alterarOperacao",
			"id_operacao="+ id_operacao+"&"+parametros
	)
	.done(
			function(data, status){
				modalAguarde(false);
				iconeAguarde(ondeListaOperacoes);
				pegaOperacoes();
			}
	)
	.fail(
			function(data){
				modalAguarde(false);
				mostraErro(data.status + " " +data.statusText);
			}
	);
}
