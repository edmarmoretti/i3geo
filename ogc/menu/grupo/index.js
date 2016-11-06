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
ogc = {};
ogc.grupo = {
		//variavel global indicando o elemento que recebera a lista de menus
		ondeLista: "",
		id_menu: "",
		nome_menu: "",
		id_grupo: "",
		nome_grupo: "",
		init: function(onde){
			ogc.grupo.ondeLista = onde;
			ogc.grupo.lista();
		},
		/*
Function: lista

Obt&eacute;m a lista de menus
		 */
		lista: function(){
			$.post(
					"exec.php",
					"funcao=lista&id_grupo=" + ogc.grupo.id_grupo
			)
			.done(
					function(data, status){
						var json = jQuery.parseJSON(data);
						//
						//monta a lista de camadas
						//
						var htmlcamadas = Mustache.to_html(
								"{{#data}}" + $("#templateCamadas").html() + "{{/data}}",
								$.extend(
										{},
										ogc.grupo.dicionario,
										{
											"data": json["camadas"],
											"dominio": "ogc.grupo",
											"disabledlink": function(){
												if(this.link_tema == ""){
													return "hidden";
												}
												else {
													return "";
												}
											},
											"disableddown": function(){
												if(this.download_tema != "nao"){
													return "";
												}
												else {
													return "hidden";
												}
											},
											"disabledogc": function(){
												if(this.ogc_tema != "nao"){
													return "";
												}
												else {
													return "hidden";
												}
											}
										}
								)
						);
						//
						//monta a lista de pastas
						//
						//template do form de cada operacao
						var htmlpastas = Mustache.to_html(
								"{{#data}}" + $("#templateLista").html() + "{{/data}}",
								$.extend(
										{},
										ogc.grupo.dicionario,
										{
											"data": json["dados"],
											"onclick": "ogc.grupo.proximoNivel",
										}
								)
						);
						ogc.grupo.ondeLista.html(htmlcamadas + htmlpastas);
						$.material.init();
					}
			)
			.fail(function(data){
				ogc.grupo.ondeLista.html('<div class="alert alert-danger alert-dismissible" role="alert">' + data.status + " " +data.statusText + '</div>');
			});
		},
		mostraLinksServico: function(codigo_tema){
			$(".modal-body").html('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Aguarde</span>');
			var html;
			tradLinks["tema"] = codigo_tema;
			html = Mustache.to_html(
					$("#templateLinksOgc").html(),
					tradLinks
			);
			$(".modal-body").html(html);
		},
		mostraLinksDownload: function(codigo_tema){
			$(".modal-body").html('<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Aguarde</span>');
			tradLinks["tema"] = codigo_tema;
			$.post(
					"../../../classesphp/mapa_controle.php",
					"map_file=&funcao=download3&tema="+codigo_tema
			)
			.done(
					function(data, status){
						var retorno = jQuery.parseJSON(data).data;
						var html,arqs,i,n,ins = "";
						tradLinks["mapfile"] = window.location.protocol + "//" + window.location.host + "/" + retorno.mapfileurl;
						tradLinks["sldurl"] = tradLinks["urli3geo"] + "/ferramentas/legenda/exec.php?funcao=TEMA2SLD&tema=" + retorno.tema + "&map_file=" + retorno.mapfile;
						arqs = retorno.arquivos.split(",");
						n = arqs.length;
						for (i=0; i<n; i++){
							ins += "<p><a href='"+window.location.protocol+"//"+window.location.host+"/"+arqs[i]+"'>"+arqs[i]+"</a></p>";
						}
						tradLinks["shp"] = ins;
						html = Mustache.to_html(
								$("#templateLinksDownload").html(),
								tradLinks
						);
						tradLinks["shp"] = "";
						tradLinks["mapfile"] = "";
						tradLinks["sldurl"] = "";
						$(".modal-body").html(html);
					}
			)
			.fail(function(data){
				ogc.grupo.ondeLista.html('<div class="alert alert-danger alert-dismissible" role="alert">' + data.status + " " +data.statusText + '</div>');
			});
		},
		proximoNivel: function(id,nome){
			window.location.href = "subgrupo/index.php?id_subgrupo=" + id + "&nome_subgrupo=" + nome + "&id_menu=" + ogc.grupo.id_menu+ "&nome_menu=" + ogc.grupo.nome_menu + "&id_grupo=" + ogc.grupo.id_grupo+ "&nome_grupo=" + ogc.grupo.nome_grupo;
		}
};