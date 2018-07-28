if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
/*
 * Classe: i3GEOF.atalhosedicao
 */
//TODO incluir minscale e maxscale
//TODO incluir opcao para modificar o nome do layer
//TODO bloquear fechamento da janela
//TODO incluir opcao para incluir o link para a fonte
//TODO criar nova opcao que permita editar um texto livre para a fonte e guarda-la no proprio mapfile
i3GEOF.atalhosedicao =
{
	tema: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
	    var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.atalhosedicao.dicionario);
	    dicionario["locaplic"] = i3GEO.configura.locaplic;
	    return dicionario;
	},
	/*
	 * Function: iniciaDicionario (Depreciado na versao 6.0)
	 *
	 */
	iniciaDicionario : function() {
	    i3GEOF.atalhosedicao.iniciaJanelaFlutuante();
	},
	salva: function(){
	    i3GEOF.atalhosedicao.metadata($i("i3GEOFatalhosedicaoCache"),true);
	    i3GEO.tema.dialogo.salvaMapfile(i3GEOF.atalhosedicao.tema);
	},
	temaComGrafico: function(){
	    i3GEO.temaAtivo = i3GEOF.atalhosedicao.tema;
	    i3GEO.tema.dialogo.graficotema(i3GEO.temaAtivo,{
		mesmoTema : true
	    });
	},
	parametrosSql: function() {
	    i3GEO.temaAtivo = i3GEOF.atalhosedicao.tema;
	    //i3GEO.pluginI3geo.parametrossql.buscaParForm(i3GEOF.atalhosedicao.tema);
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
	/*
	 * Function: inicia
	 *
	 * Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
	 *
	 * Parametro:
	 *
	 * iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	 */
	inicia : function(iddiv, idjanela) {
	    var tema;
	    i3GEO.janela.comboCabecalhoTemas(
		    "i3GEOFatalhosedicaoComboCabeca",
		    "i3GEOFatalhosedicaoComboCabecaSel",
		    "atalhosedicao",
	    "ligadosComTabela");
	    if(i3GEOF.atalhosedicao.tema === ""){
		i3GEOF.atalhosedicao.tema = i3GEO.temaAtivo;
	    }
	    $i(iddiv).innerHTML = i3GEOF.atalhosedicao.html(idjanela);
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
	/*
	 * Function: html
	 *
	 * Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta
	 *
	 * Retorno:
	 *
	 * String com o c&oacute;digo html
	 */
	html : function(idjanela) {
	    var ins = Mustache.render(i3GEOF.atalhosedicao.MUSTACHE, i3GEOF.atalhosedicao.mustacheHash());
	    return ins;
	},
	/*
	 * Function: criaJanelaFlutuante
	 *
	 * Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante : function() {
	    var minimiza, cabecalho, janela, divid, titulo;

	    if($i("i3GEOF.atalhosedicao")){
		return;
	    }
	    cabecalho = function() {
	    };
	    minimiza = function() {
		i3GEO.janela.minimiza("i3GEOF.atalhosedicao",200);
	    };
	    // cria a janela flutuante
	    titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + i3GEO.temaAtivo + "</span></div>";
	    janela =
		i3GEO.janela.cria(
			"300px",
			"350px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.atalhosedicao",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true,
			"",
			"",
			"",
			""
		);
	    divid = janela[2].id;
	    janela[0].moveTo(180,60);
	    $i("i3GEOF.atalhosedicao_corpo").style.backgroundColor = "white";
	    i3GEOF.atalhosedicao.inicia(divid, "i3GEOF.atalhosedicao");
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
				i3GEO.Interface.openlayers.removeTodosOsLayers();
				i3GEO.arvoreDeCamadas.CAMADAS = [];
				i3GEO.atualiza();
			    }
			}
			catch(e){core_handleFailure(e,o.responseText);}
		    },
		    argument: { foo:"foo", bar:"bar" }
	    };
	    core_makeRequest(sUrl,callback,'POST');
	}
};
