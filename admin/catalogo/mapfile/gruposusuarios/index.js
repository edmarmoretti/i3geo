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
i3GEOadmin.mapfile = {};
i3GEOadmin.gruposusuarios = {
	//variavel global indicando o elemento que recebera a lista de gruposusuarios
	ondeLista: "",
	//conteudo html do formulario de adicao de operacao
	formAdiciona: "",
	codigo: "",
	//parametros obtidos do formulario de edicao antes de abrir o modal de confirmacao
	parametrosSalvar: "",
	init: function(onde,codigo,id_tema){
	    i3GEOadmin.gruposusuarios.ondeLista = onde;
	    i3GEOadmin.gruposusuarios.codigo = codigo;
	    i3GEOadmin.gruposusuarios.lista(codigo,id_tema);
	},
	/*
Function: lista

Obt&eacute;m a lista de gruposusuarios
	 */
	lista: function(codigo,id_tema){
	    i3GEOadmin.core.iconeAguarde(i3GEOadmin.gruposusuarios.ondeLista);
	    $.post(
		    "exec.php?funcao=lista",
		    "codigo=" + codigo + "&id_tema=" + id_tema
	    )
	    .done(
		    function(data, status){
			//objeto json com os dados viondos do banco
			var json = jQuery.parseJSON(data);
			//lista todas as gruposusuarios
			var html = Mustache.to_html(
				"{{#data}}" + $("#templateLista").html() + "{{/data}}",
				$.extend(
					{},
					i3GEOadmin.gruposusuarios.dicionario,
					{
					    "data": json["dados"],
					    "onExcluir": "i3GEOadmin.gruposusuarios.excluirDialogo",//funcao
					    "onEditar": "i3GEOadmin.gruposusuarios.editarDialogo"//funcao
					}
				)
			);
			i3GEOadmin.gruposusuarios.ondeLista.html(html);
			//monta um template para o modal de inclusao de novo usuario
			if(i3GEOadmin.gruposusuarios.formAdiciona == ""){
			    var lista = Mustache.to_html(
				    "{{#data}}" + $("#templateGrupos").html() + "{{/data}}",
				    $.extend(
					    {},
					    i3GEOadmin.gruposusuarios.dicionario,
					    {
						"data": json["grupos"],
					    }
				    )
			    );
			    html = Mustache.to_html(
				    $("#templateFormLista").html(),
				    $.extend(
					    {},
					    i3GEOadmin.gruposusuarios.dicionario,
					    {
						"grupos": lista,
						"id_tema": id_tema,
						"codigo": codigo,
						"excluir": i3GEOadmin.gruposusuarios.dicionario.cancelar,
						"onExcluir": "i3GEOadmin.core.fechaModalGeral",//funcao
						"onSalvar": "i3GEOadmin.gruposusuarios.adiciona"//funcao
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
//	os parametros sao obtidos do formulario aberto do modal
	adiciona: function(codigo,id_tema){
	    var parametros = $("#modalGeral .form-horizontal").serialize();
	    i3GEOadmin.core.fechaModalGeral();
	    i3GEOadmin.core.modalAguarde(true);
	    $.post(
		    "exec.php?funcao=adicionar",
		    parametros + "&codigo=" + codigo + "&id_tema=" + id_tema
	    )
	    .done(
		    function(data, status){
			i3GEOadmin.core.modalAguarde(false);
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.gruposusuarios.ondeLista);
			i3GEOadmin.gruposusuarios.lista(i3GEOadmin.gruposusuarios.codigo,id_tema);
		    }
	    )
	    .fail(
		    function(data){
			i3GEOadmin.core.modalAguarde(false);
			i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
		    }
	    );
	},
	excluirDialogo: function(id_grupo,id_tema){
	    var hash = {
		    "mensagem": i3GEOadmin.gruposusuarios.dicionario.confirma,
		    "onBotao1": "i3GEOadmin.gruposusuarios.excluir('"+id_grupo+"','"+id_tema+"')",
		    "botao1": i3GEOadmin.gruposusuarios.dicionario.sim,
		    "onBotao2": "i3GEOadmin.core.fechaModalConfirma();",
		    "botao2": i3GEOadmin.gruposusuarios.dicionario.nao
	    };
	    i3GEOadmin.core.abreModalConfirma(hash);
	},
	excluir: function(id_grupo,id_tema){
	    i3GEOadmin.core.modalAguarde(true);
	    $.post(
		    "exec.php?funcao=excluir",
		    "id_grupo=" + id_grupo + "&id_tema=" + id_tema
	    )
	    .done(
		    function(data, status){
			i3GEOadmin.core.modalAguarde(false);
			i3GEOadmin.core.iconeAguarde(i3GEOadmin.gruposusuarios.ondeLista);
			i3GEOadmin.gruposusuarios.lista(i3GEOadmin.gruposusuarios.codigo,id_tema);
		    }
	    )
	    .fail(
		    function(data){
			i3GEOadmin.core.modalAguarde(false);
			i3GEOadmin.core.mostraErro(data.status + " " +data.statusText);
		    }
	    );
	}
};