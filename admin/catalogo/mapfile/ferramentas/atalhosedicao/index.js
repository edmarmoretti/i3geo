if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
i3GEOF.atalhosedicao =
{
		_parameters : {
			"mustache": "",
			"idContainer": "i3GEOatalhosedicaoContainer",
			"namespace": "atalhosedicao"
		},
		_formModal: true,
		start : function(){
			var p = this._parameters,
			i3f = this,
			t1 = i3GEO.configura.locaplic + "/admin/catalogo/mapfile/ferramentas/atalhosedicao/template_mst.html";
			if(p.mustache === ""){
				$.get(t1, function(template) {
					p.mustache = template;
					i3f.html();
				}).fail(function() {
					i3GEO.janela.tempoMsg($trad("erroTpl"));
				});
			} else {
				i3f.html();
			}
		},
		destroy: function(){
			i3GEOF.atalhosedicao._parameters.mustache = "";
			//i3GEOF.opcoeslegenda._parameters.dataForm = "";
			i3GEOF.atalhosedicao.start();
		},
		html:function() {
			var p = this._parameters,
			i3f = this,
			tema,
			hash = {};
			hash = {
					locaplic: i3GEO.configura.locaplic,
					namespace: p.namespace,
					idContainer: p.idContainer,
					...i3GEO.idioma.objetoIdioma(i3f.dicionario)
			};
			i3GEOF.atalhosedicao._formModal = i3GEO.janela.formModal(
					{
						idForm: "Editor",
						objJanela: i3GEOF.atalhosedicao._formModal,
						expandable: false,
						texto: Mustache.render(p.mustache, hash),
						resizable: {
							disabled: true,
							ghost: true,
							handles: "se,n"
						},
						css: {'cursor': 'pointer', 'width': '300px','position': 'fixed','top': 0, 'left': 100, 'right': 0, 'margin': 'auto', 'bottom': ''},
						onclose: false
					}
			);
			i3GEOF.atalhosedicao._formModal.find(".closeModal").css("visibility","hidden");
			if(i3GEOF.atalhosedicao.tema === ""){
				i3GEOF.atalhosedicao.tema = i3GEO.temaAtivo;
			}
			//
			//atualiza os campos que dependem de parametros de cada camada
			//
			tema = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.atalhosedicao.tema);
			if(tema.cache.toLowerCase() === "sim"){
				$i("i3GEOFatalhosedicaoCache").checked = true;
			}
			if(tema.classe.toLowerCase() === "nao"){
				$i("i3GEOFatalhosedicaoClasse").checked = false;
			}
			if(tema.identifica.toLowerCase() === "nao"){
				$i("i3GEOFatalhosedicaoIdentifica").checked = false;
			}
			$i("i3GEOFatalhosedicaoOpacidade").value = tema.transparency;
		},
		tema: "",
		salva: function(){
			i3GEOF.atalhosedicao.metadata($i("i3GEOFatalhosedicaoCache"),true);
			var tema = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.atalhosedicao.tema);
			var prog = i3GEO.configura.locaplic + "/admin/catalogo/mapfile/ferramentas/atalhosedicao/exec.php";
			var par = {
					funcao: "refazerlayer",
					g_sid: i3GEO.configura.sid,
					codigomap: i3GEOF.atalhosedicao.tema,
					cache: tema.cache,
					classe: tema.classe,
					identifica: tema.identifica
			};
			i3GEO.janela.abreAguarde();

			$.get(
					prog,
					par
			)
			.done(
					function(data, status){
						i3GEO.janela.fechaAguarde();
						i3GEO.janela.snackBar({content: $trad('feito')});
						i3GEO.mapa.refresh();
					}
			)
			.fail(
					function(data){
						i3GEO.janela.fechaAguarde();
						i3GEO.janela.snackBar({content: data.statusText, style:'red'});
					}
			);
		},
		temaComGrafico: function(){
			i3GEO.temaAtivo = i3GEOF.atalhosedicao.tema;
			i3GEO.tema.dialogo.graficotema(i3GEO.temaAtivo,{
				mesmoTema : true
			});
		},
		mudatransp : function(valor) {
			i3GEO.Interface.aplicaOpacidade(valor,i3GEOF.atalhosedicao.tema);
			
			if (valor !== "") {
				var prog = i3GEO.configura.locaplic + "/admin/catalogo/mapfile/ferramentas/atalhosedicao/exec.php";
				var par = {
						funcao: "mudatransp",
						g_sid: i3GEO.configura.sid,
						codigomap: i3GEOF.atalhosedicao.tema,
						valor: valor
				};
				i3GEO.janela.abreAguarde();

				$.get(
						prog,
						par
				)
				.done(
						function(data, status){
							i3GEO.janela.fechaAguarde();
							i3GEO.janela.snackBar({content: $trad('feito')});
						}
				)
				.fail(
						function(data){
							i3GEO.janela.fechaAguarde();
							i3GEO.janela.snackBar({content: data.statusText, style:'red'});
						}
				);
			}
		},
		parametrosSql: function() {
			i3GEO.temaAtivo = i3GEOF.atalhosedicao.tema;
			YAHOO.namespace("admin");
			YAHOO.namespace("admin.container");
			core_montaEditor("","450px","500px","","Plugin",true,false,false);
			var sUrl = i3GEO.configura.locaplic + "/admin/catalogo/mapfile/exec.php?funcao=pegaPlugin&codigoMap="+i3GEO.temaAtivo+"&codigoLayer="+i3GEO.temaAtivo+"&g_sid="+i3GEO.configura.sid;
			var montaEditorPlugin = function(retorno){
				i3GEO.pluginI3geo.parametrossql.formAdmin(
						retorno,
						"editor_bd",
						i3GEO.temaAtivo,
						'i3GEOF.atalhosedicao.salvarDadosEditorPlugin($i("editor_bd"),"parametrossql",i3GEOF.atalhosedicao.tema,i3GEOF.atalhosedicao.tema);',
						'i3GEOF.atalhosedicao.salvarDadosEditorPlugin($i("editor_bd"),"",i3GEOF.atalhosedicao.tema,i3GEOF.atalhosedicao.tema);'
				);
			};
			core_pegaDados("",sUrl,montaEditorPlugin);
		},
		layerKml: function() {
			i3GEO.temaAtivo = i3GEOF.atalhosedicao.tema;
			//i3GEO.pluginI3geo.parametrossql.buscaParForm(i3GEOF.atalhosedicao.tema);
			YAHOO.namespace("admin");
			YAHOO.namespace("admin.container");
			core_montaEditor("","450px","500px","","Plugin",true,false,false);
			var sUrl = i3GEO.configura.locaplic + "/admin/catalogo/mapfile/exec.php?funcao=pegaPlugin&codigoMap="+i3GEO.temaAtivo+"&codigoLayer="+i3GEO.temaAtivo+"&g_sid="+i3GEO.configura.sid;
			var montaEditorPlugin = function(retorno){
				i3GEO.pluginI3geo.layerkml.formAdmin(
						retorno,
						"editor_bd",
						i3GEO.temaAtivo,
						'i3GEOF.atalhosedicao.salvarDadosEditorPlugin($i("editor_bd"),"layerkml",i3GEOF.atalhosedicao.tema,i3GEOF.atalhosedicao.tema);',
						'i3GEOF.atalhosedicao.salvarDadosEditorPlugin($i("editor_bd"),"",i3GEOF.atalhosedicao.tema,i3GEOF.atalhosedicao.tema);'
				);
			};
			core_pegaDados("",sUrl,montaEditorPlugin);
		},
		layerGeojson: function() {
			i3GEO.temaAtivo = i3GEOF.atalhosedicao.tema;
			//i3GEO.pluginI3geo.parametrossql.buscaParForm(i3GEOF.atalhosedicao.tema);
			YAHOO.namespace("admin");
			YAHOO.namespace("admin.container");
			core_montaEditor("","450px","500px","","Plugin",true,false,false);
			var sUrl = i3GEO.configura.locaplic + "/admin/catalogo/mapfile/exec.php?funcao=pegaPlugin&codigoMap="+i3GEO.temaAtivo+"&codigoLayer="+i3GEO.temaAtivo+"&g_sid="+i3GEO.configura.sid;
			var montaEditorPlugin = function(retorno){
				i3GEO.pluginI3geo.layergeojson.formAdmin(
						retorno,
						"editor_bd",
						i3GEO.temaAtivo,
						'i3GEOF.atalhosedicao.salvarDadosEditorPlugin($i("editor_bd"),"layergeojson",i3GEOF.atalhosedicao.tema,i3GEOF.atalhosedicao.tema);',
						'i3GEOF.atalhosedicao.salvarDadosEditorPlugin($i("editor_bd"),"",i3GEOF.atalhosedicao.tema,i3GEOF.atalhosedicao.tema);'
				);
			};
			core_pegaDados("",sUrl,montaEditorPlugin);
		},
		markercluster: function() {
			i3GEO.temaAtivo = i3GEOF.atalhosedicao.tema;
			YAHOO.namespace("admin");
			YAHOO.namespace("admin.container");
			core_montaEditor("","450px","500px","","Plugin",false,false,false);
			var sUrl = i3GEO.configura.locaplic + "/admin/catalogo/mapfile/exec.php?funcao=pegaPlugin&codigoMap="+i3GEO.temaAtivo+"&codigoLayer="+i3GEO.temaAtivo+"&g_sid="+i3GEO.configura.sid;
			var montaEditorPlugin = function(retorno){
				i3GEO.pluginI3geo.markercluster.formAdmin(
						retorno,
						"editor_bd",
						i3GEO.temaAtivo,
						'i3GEOF.atalhosedicao.salvarDadosEditorPlugin($i("editor_bd"),"markercluster",i3GEOF.atalhosedicao.tema,i3GEOF.atalhosedicao.tema);',
						'i3GEOF.atalhosedicao.salvarDadosEditorPlugin($i("editor_bd"),"",i3GEOF.atalhosedicao.tema,i3GEOF.atalhosedicao.tema);'
				);
			};
			core_pegaDados("",sUrl,montaEditorPlugin);
		},
		heatmap: function() {
			i3GEO.temaAtivo = i3GEOF.atalhosedicao.tema;
			YAHOO.namespace("admin");
			YAHOO.namespace("admin.container");
			core_montaEditor("","450px","500px","","Plugin",true,false,false);
			var sUrl = i3GEO.configura.locaplic + "/admin/catalogo/mapfile/exec.php?funcao=pegaPlugin&codigoMap="+i3GEO.temaAtivo+"&codigoLayer="+i3GEO.temaAtivo+"&g_sid="+i3GEO.configura.sid;
			var montaEditorPlugin = function(retorno){
				i3GEO.pluginI3geo.heatmap.formAdmin(
						retorno,
						"editor_bd",
						i3GEO.temaAtivo,
						'i3GEOF.atalhosedicao.salvarDadosEditorPlugin($i("editor_bd"),"heatmap",i3GEOF.atalhosedicao.tema,i3GEOF.atalhosedicao.tema);',
						'i3GEOF.atalhosedicao.salvarDadosEditorPlugin($i("editor_bd"),"",i3GEOF.atalhosedicao.tema,i3GEOF.atalhosedicao.tema);'
				);
			};
			core_pegaDados("",sUrl,montaEditorPlugin);
		},
		/**
		 * Aplica ao objeto CAMADAS o parametro definido
		 * Esse parametro e usado na hora de salvar o mapa
		 * Para isso, a funcao salvarmapfile deve ser preparada para obter o parametro
		 * e enviar para a funcao php
		 * veja em i3GEOF.salvamapfile.salva
		 *
		 * conv indica se deve ser feita a conversao de checked para sim/nao
		 */
		metadata: function(obj,conv){
			var valor,tema;
			if(conv){
				if(obj.checked){
					valor = "sim";
				}
				else{
					valor = "nao";
				}
			}
			else{
				valor = obj.value;
			}
			tema = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.atalhosedicao.tema);
			tema[obj.name] = valor;
		},
		salvarDadosEditorPlugin: function(onde,plugin,codigoMap,codigoLayer){
			//TODO redesenhar a camada no caso dos plugins
			if (typeof (console) !== 'undefined')
				console.info("salvarDadosEditorPlugin");

			var campos = onde.getElementsByTagName("input"),
			n = campos.length,
			par = [],
			prog = i3GEO.configura.locaplic + "/admin/catalogo/mapfile/exec.php?funcao=gravaPlugin&g_sid="+i3GEO.configura.sid,
			i;
			if(plugin != ""){
				if(!i3GEO.pluginI3geo[plugin].parametrosFormAdmin){
					for(i=0; i<n; i++){
						par.push('"'+campos[i].name+'":"'+campos[i].value+'"');
					}
					if(plugin != ""){
						plugin = '{"plugin":"'+plugin+'","parametros":{' + par.join(",") + '}}';
					}
				}
				else{
					plugin = i3GEO.pluginI3geo[plugin].parametrosFormAdmin(onde);
				}
			}
			var sUrl = prog
			+ "&codigoMap=" + codigoMap
			+ "&codigoLayer=" + codigoLayer
			+ "&plugin=" + plugin;
			var callback = {
					success:function(o)	{
						try	{
							if(JSON.parse(o.responseText) == "erro") {
							}
							else {
								YAHOO.admin.container.panelEditor.destroy();
								YAHOO.admin.container.panelEditor = null;
								i3GEO.Interface.removeTodosOsLayers();
								i3GEO.arvoreDeCamadas.CAMADAS = [];
								i3GEO.mapa.refresh();
							}
						}
						catch(e){core_handleFailure(e,o.responseText);}
					},
					argument: { foo:"foo", bar:"bar" }
			};
			core_makeRequest(sUrl,callback,'POST');
		}
};
