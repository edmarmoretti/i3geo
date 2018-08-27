if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.legenda =
{
	parDefault : "&position=MS_UR&partials=1&offsetx=0&offsety=0&minfeaturesize=auto&mindistance=auto&force=0&shadowsizex=1&shadowsizey=1&cor=0 0 0&sombray=1&sombrax=1&angulo=0&tamanho=8&fonte=bitmap&fundo=off&sombra=off&outlinecolor=off&shadowcolor=off&wrap=",
	aguarde : "",
	templateDir : "../ferramentas/legenda",
	aposIniciar : function(){

	},
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "mustachelista": "",
	    "mustacheestilo": "",
	    "idContainer": "i3GEOlegendaContainer",
	    "namespace": "legenda",
	    "objdicionario": {},
	    "aviso": false,
	    "dadosGrafico": "",
	    "estilos": "",
	    "estilo": 0,
	    "classe": ""
	},
	start : function(tema){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html",
	    t2 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/templateLista_mst.html",
	    t3 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/templateFormEstilo_mst.html";
	    p.tema = tema;
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.when( $.get(t1),$.get(t2),$.get(t3)).done(function(r1,r2,r3) {
		    p.mustache = r1[0];
		    p.mustachelista = r2[0];
		    p.mustacheestilo = r3[0];
		    i3f.html();
		    i3GEO.janela.fechaAguarde();
		}).fail(function() {
		    i3GEO.janela.snackBar({content: $trad("erroTpl"),style: "red"});
		    return;
		});
	    } else {
		i3f.html();
	    }
	},
	destroy: function(){
	    //nao use this aqui
	    //i3GEOF.legenda._parameters.mustache = "";

	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {},
	    objTema = i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[p.tema],
	    values = {
		    mostra: "checked",
		    img: objTema.legendaimg ? objTema.legendaimg : "",
			    offsite: objTema.offsite ? objTema.offsite : "-1,-1,-1"
	    };
	    p.objdicionario = i3GEO.idioma.objetoIdioma(i3GEOF.legenda.dicionario);
	    if (objTema.classe && objTema.classe.toLowerCase() == "nao") {
		values.mostra = "";
	    }
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    aplicar: $trad("p14"),
		    opcoes: $trad("opcoes"),
		    values: values,
		    ...p.objdicionario
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash),
			onclose: i3f.destroy,
			resizable: {
			    disabled: false,
			    ghost: true,
			    handles: "se,n"
			},
			css: {'cursor': 'pointer', 'width': '100%', 'height': '50%','position': 'fixed','top': '', 'left': 0, 'right': 0, 'margin': 'auto', 'bottom': 0}
		    });
	    i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia1", "i3GEOlegendaguia");
	    // eventos das guias
	    $i("i3GEOlegendaguia1").onclick = function() {
		i3GEOF.legenda.mostralegenda();
		i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia1", "i3GEOlegendaguia");
	    };
	    $i("i3GEOlegendaguia7").onclick = function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia7", "i3GEOlegendaguia");
	    };
	    $i("i3GEOlegendaguia8").onclick = function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia8", "i3GEOlegendaguia");
		i3GEOF.legenda.parametrosAuto();
	    };

	    $i("i3GEOlegendaguia6").onclick = function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia6", "i3GEOlegendaguia");
	    };

	    $i("i3GEOlegendaguia2").onclick = function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia2", "i3GEOlegendaguia");
	    };
	    $i("i3GEOlegendaguia3").onclick = function() {
		i3GEO.janela.snackBar({content: $trad("ajuda",i3GEOF.legenda.dicionario),style: "red"});
	    };
	    $i("i3GEOlegendaguia4").onclick = function() {
		i3GEOF.legenda.mostraGrafico();
	    };
	    $i("i3GEOlegendaguia5").onclick = function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia5", "i3GEOlegendaguia");
	    };
	    i3GEOF.legenda.mostralegenda();
	    i3GEOF.legenda.montaCombosItens();

	    i3GEO.janela.snackBar({content: $trad("clicaSimbolo",i3GEOF.legenda.dicionario)});
	    i3GEO.util.aplicaAquarela(p.idContainer);
	    i3GEOF.legenda.aposIniciar.call();
	},
	sldi: function() {
	    i3GEO.tema.dialogo.aplicarsld(i3GEOF.legenda._parameters.tema);
	},
	slde: function() {
	    window.open(i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?funcao=tema2sld&tema="
		    + i3GEOF.legenda._parameters.tema
		    + "&g_sid="
		    + i3GEO.configura.sid);
	},
	propriedadesLabels: function() {
	    i3GEO.util.scriptTag(
		    i3GEO.configura.locaplic + "/ferramentas/opcoes_label/dependencias.php",
		    "i3GEOF.proplabel.iniciaJanelaFlutuante(false)",
		    "i3GEOFproplabel",
		    false);
	},
	incluirLabels: function() {
	    var par, p, temp, cp;
	    try {
		par = i3GEOF.proplabel.pegaPar();
		i3GEOF.legenda.parDefault = par;
	    } catch (e) {
		par = i3GEOF.legenda.parDefault;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    temp = function() {
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.aposAlterarLegenda();
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    };
	    p =
		i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=adicionaLabelClasse&tema="
		+ i3GEOF.legenda._parameters.tema
		+ "&classe="
		+ i3GEOF.legenda.classe
		+ par;
	    p += "&item=" + $i("i3GEOlegendaSelItemLabel").value;
	    cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", temp);
	},
	excluiLabels: function() {
	    var p, temp, cp;
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    temp = function() {
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.aposAlterarLegenda();
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    };
	    p =
		i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=removeLabelClasse&tema="
		+ i3GEOF.legenda._parameters.tema
		+ "&classe="
		+ i3GEOF.legenda.classe;
	    cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", temp);
	},
	janelaCorRamp: function(){
	    i3GEO.util.abreColourRamp("", "listaColourRamp", i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[i3GEOF.legenda._parameters.tema].numclasses, i3GEOF.legenda._parameters.tema);
	},
	/*
	 * Function: aposAlterarLegenda
	 *
	 * Fun&ccedil;&atilde;o executada ap&oacute;s ocorrer alguma altera&ccedil;&atilde;o efetiva da legenda do mapa
	 */
	aposAlterarLegenda : function() {
	    i3GEO.arvoreDeCamadas.CAMADAS = [];
	    i3GEO.atualiza();
	    i3GEO.Interface.atualizaTema("", i3GEOF.legenda._parameters.tema);
	},
	mostralegenda : function() {
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    g_sid: i3GEO.configura.sid,
		    funcao: "editalegenda",
		    opcao: "edita",
		    tema: p.tema
	    };
	    i3GEO.janela.abreAguarde();
	    i3GEO.janela._formModal.block();
	    $.post(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			i3GEOF.legenda.montaLegenda(data);
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	},
	montaLegenda : function(data) {
	    var p = this._parameters,
	    i3f = this;
	    i3f._parameters.aviso = false;
	    $i("i3GEOlegendaguia1objLegenda").innerHTML = "";
	    if (data != undefined) {
		//hidden e utilizado para esconder ou mostrar determinados trechos do template
		var mustache = [], b, ins, i, ajuda, re, n, filtro;
		// se nao for do tipo raster
		if (data[0].proc === "") {
		    n = data.length;
		    re = new RegExp("'", "g");
		    for (i = 0; i < n; i++) {
			mustache.push({
			    cliqueExclui: $trad('cliqueExclui', i3f.dicionario),
			    cliqueAltera: $trad('cliqueAltera', i3f.dicionario),
			    imagem: data[i].imagem,
			    id: data[i].tema + "-" + data[i].idclasse,
			    idclasse: data[i].idclasse,
			    novoNome: $trad('digitaNovoNome', i3f.dicionario),
			    nome: data[i].nomeclasse,
			    editorExp: $trad("editorExp", i3f.dicionario),
			    exp: (data[i].expressao).replace(re, '"'),
			    txtMinscale: $trad('minScale', i3f.dicionario),
			    minScale: data[i].minScale,
			    txtMaxScale: $trad('maxScale', i3f.dicionario),
			    maxScale: data[i].maxScale,
			    sobe: $trad('sobe', i3f.dicionario),
			    desce: $trad('desce', i3f.dicionario)
			});
		    }
		    ins = Mustache.render(
			    p.mustachelista,
			    $.extend(
				    {},
				    {
					"linhas" :  mustache,
					"hidden2":"",
					"hidden1": "hidden"
				    },
				    p.objdicionario
			    )
		    );
		    $i("i3GEOlegendaguia1objLegenda").innerHTML = ins;
		} else {
		    ajuda = p.objdicionario['ajudaEscalaCores']
		    + "<p>"
		    + p.objdicionario['msgEscalaCoresAuto']
		    + "<p>"
		    + p.objdicionario['msgEscalaCoresIndividual']
		    + "<p>"
		    + p.objdicionario['msgBandas']
		    + "<p>"
		    + p.objdicionario['msgReamostragem'];

		    mustache = [];
		    for (i = 0; i < data[0].proc.length; i++) {
			mustache.push({
			    "value": data[0].proc[i]
			});
		    }

		    ins = Mustache.render(
			    p.mustachelista,
			    $.extend(
				    {},
				    {
					"hidden2":"hidden",
					"hidden1": "",
					"ajuda1": ajuda,
					"processos": mustache
				    },
				    p.objdicionario
			    )
		    );
		    $i("i3GEOlegendaguia1objLegenda").innerHTML = ins;
		}
	    } else {
		i3GEO.janela.snackBar({content: "erro", style:'red'});
	    }
	},
	/*
	 * Function: adicionaConta
	 *
	 * Adiciona ao nome de cada classe o n&uacute;mero de ocorr&ecirc;ncias em cada uma
	 *
	 */
	adicionaConta : function(btn) {
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    funcao: "contagemclasse",
		    g_sid: i3GEO.configura.sid,
		    tema: p.tema
	    };
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.post(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false).find("span").addClass("hidden");
			i3GEO.janela.snackBar({content: $trad('feito')});
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false).find("span").addClass("hidden");
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	},
	/*
	 * Function: adicionaOpacidade
	 *
	 * Adiciona opacidade vari&aacute;vel em cada classe
	 */
	adicionaOpacidade : function(btn) {
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    funcao: "adicionaOpacidade",
		    g_sid: i3GEO.configura.sid,
		    tema: p.tema,
		    ext: i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten)
	    };
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.post(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false).find("span").addClass("hidden");
			i3GEO.janela.snackBar({content: $trad('feito')});
			i3GEOF.legenda.aposAlterarLegenda();
			i3GEOF.legenda.mostralegenda();
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false).find("span").addClass("hidden");
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	},
	aplicaLegendaImg : function(btn) {
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    funcao: "aplicaLegendaImg",
		    g_sid: i3GEO.configura.sid,
		    tema: p.tema,
		    imagem: $i("i3GEOlegendaImg").value
	    };
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true);
	    i3GEO.janela._formModal.block();
	    $.post(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false);
			i3GEO.janela.snackBar({content: $trad('feito')});
			i3GEOF.legenda.aposAlterarLegenda();
			i3GEOF.legenda.mostralegenda();
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false);
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	},
	aplicarOffsite : function(btn) {
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    funcao: "aplicaOffsite",
		    g_sid: i3GEO.configura.sid,
		    tema: p.tema,
		    offsite: $i("i3GEOoffsite").value
	    };
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true);
	    i3GEO.janela._formModal.block();
	    $.post(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false);
			i3GEO.janela.snackBar({content: $trad('feito')});
			i3GEOF.legenda.aposAlterarLegenda();
			i3GEOF.legenda.mostralegenda();
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false);
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	},
	paleta : function(btn) {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var retornapaleta = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostralegenda();
		}, ci = $i("i3GEOlegendaacori").value, cf = $i("i3GEOlegendaacorf").value, cp = new cpaint(), p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=alteraCoresClasses&tema="
		    + i3GEOF.legenda._parameters.tema
		    + "&cori="
		    + ci
		    + "&corf="
		    + cf;
		cp.set_response_type("JSON");
		cp.call(p, "alteraCoresClasses", retornapaleta);
	    } catch (e) {
		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},






	filtro : function(idRetorno) {
	    i3GEO.tema.dialogo.filtro(i3GEOF.legenda._parameters.tema, true, idRetorno);
	},
	/*
	 * Function: aviso
	 *
	 * Mostra um i3GEO.janela.tempoMsga ao usu&aacute;rio quando um campo da tabela que cont&eacute;m os dados da legenda &eacute;
	 * alterado
	 *
	 * O aviso &eacute; mostrado apenas uma vez
	 */
	aviso : function() {
	    if (i3GEOF.legenda._parameters.aviso == true) {
		i3GEO.janela.snackBar({content: $trad("msgAplicaAlteracao",i3GEOF.legenda.dicionario),style: "red"});
		i3GEOF.legenda._parameters.aviso == false;
	    }
	},
	/*
	 * Function: aplicaColourRamp
	 *
	 * Aplica nas classes da legenda as cores escolhidas no seletor de cores
	 */
	aplicaColourRamp : function() {
	    if ($i("listaColourRamp").value != "") {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var cores = $i("listaColourRamp").value, ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten), temp = function() {
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostralegenda();
		    i3GEOF.legenda.aposAlterarLegenda();
		}, p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=alteraclasse&opcao=aplicacoresrgb&ext="
		    + ext
		    + "&tema="
		    + i3GEOF.legenda._parameters.tema, cp = new cpaint();
		cp.set_transfer_mode('POST');
		cp.set_response_type("JSON");
		cp.call(p, "foo", temp, "cores=" + cores);
	    }
	},
	/*
	 * Function: corj
	 *
	 * Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	 */
	corj : function(obj) {
	    i3GEO.util.abreCor("", obj);
	},
	/*
	 * Function: modificaCor
	 *
	 * Modifica a cor de uma classe
	 */
	modificaCor : function(id) {
	    var obj = $i("tempCorLegenda");
	    if (!obj) {
		var obj = document.createElement("input");
		obj.id = "tempCorLegenda";
		obj.style.display = "none";
		obj.type = "text";
		obj.value = "";
		document.body.appendChild(obj);
		obj.onchange = function() {
		    i3GEOF.legenda.aplicaNovaCor($i("tempCorLegenda").name);
		};
	    }
	    obj.name = id;
	    i3GEO.util.abreCor("", "tempCorLegenda");
	},
	aplicaNovaCor : function(id) {
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var retorna = function() {
		i3GEOF.legenda.aposAlterarLegenda();
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.mostralegenda();
	    };
	    i3GEO.php.aplicaCorClasseTema(retorna, i3GEOF.legenda._parameters.tema, id, $i("tempCorLegenda").value);
	},

	/*
	 * Function: mudaLegenda
	 *
	 * Altera a legenda conforme os valores existentes na tabela de propriedades (express&atilde;o e nome da classe)
	 */
	mudaLegenda : function(btn) {
	    i3GEOF.legenda._parameters.aviso = false;
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    try {
		var tabela = $i("i3GEOlegendalegenda"),
		trs = tabela.getElementsByTagName("tr"),
		minScales = [],
		maxScales = [],
		nomes = [],
		exps = [],
		ids = [],
		t, nn, n, p, cp, temp;
		for (t = 1; t < trs.length; t++) {
		    if (trs[t].childNodes) {
			nn = trs[t].childNodes;
			for (n = 0; n < nn.length; n++) {
			    if (nn && nn[n] && nn[n].childNodes && nn[n].getElementsByTagName) {
				var isn = nn[n].getElementsByTagName("input");
				if (isn && isn[0] != undefined) {
				    if (isn[0].name == "nome") {
					nomes.push(isn[0].value);
					temp = (isn[0].id).split("i3GEOlegendaid_");
					ids.push(temp[1]);
				    }
				    if (isn[0].name == "expressao") {
					exps.push(isn[0].value);
				    }
				    if (isn[0].name == "minScale") {
					minScales.push(parseInt(isn[0].value, 10));
				    }
				    if (isn[0].name == "maxScale") {
					maxScales.push(parseInt(isn[0].value, 10));
				    }
				}
			    }
			}
		    }
		}
		ids = ids.join(";");
		nomes = nomes.join(";");
		exps = exps.join(";");
		minScales = minScales.join(";");
		maxScales = maxScales.join(";");
		temp = function() {
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostralegenda();
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		var ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?"
		    + "base64=sim"
		    + "&g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=alteraclasse"
		    + "&opcao=alteraclasses"
		    + "&ext="
		    + ext;
		cp = new cpaint();
		cp.set_transfer_mode('POST');
		cp.set_response_type("JSON");
		cp.call(p, "alteraclassesPost", temp, "ids=" + ids
			+ "&nomes="
			+ i3GEO.util.base64encode(nomes)
			//+ nomes
			+ "&exps="
			+ i3GEO.util.base64encode(exps)
			//+ exps
			+ "&minScales="
			+ minScales
			+ "&maxScales="
			+ maxScales);
	    } catch (e) {
		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: alteraGeometria
	 *
	 * Altera o tipo de representa&ccedil;&atilde;o geom&eacute;trica dos elementos de um layer
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	alteraGeometriaTema : function() {
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var retorna = function() {
		i3GEOF.legenda.aposAlterarLegenda();
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.mostralegenda();
	    };
	    var p =
		i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=alteraclasse&opcao=alterageometria&tema="
		+ i3GEOF.legenda._parameters.tema
		+ "&tipo="
		+ $i("i3GEOlegentaTipoGeo").value, cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "", retorna);
	},
	/*
	 * Function: adicionaClasse
	 *
	 * Adiciona uma nova classe ao tema
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	adicionaClasse : function() {
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    var ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	    var p =
		i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=alteraclasse&opcao=adicionaclasse"
		+ "&tema="
		+ i3GEOF.legenda._parameters.tema
		+ "&ext="
		+ ext, cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "alteraclasse", i3GEOF.legenda.mostralegenda);
	},


	/*
	 * Function: inverteCores
	 *
	 * Inverte as cores utilizadas nos s&iacute;mbolos das classes
	 *
	 * Veja:
	 *
	 * <INVERTECORESCLASSES>
	 */
	inverteCores : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var retornapaleta = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostralegenda();
		}, cp = new cpaint(), p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=inverteCoresClasses&tema="
		    + i3GEOF.legenda._parameters.tema;
		cp.set_response_type("JSON");
		cp.call(p, "alteraCoresClasses", retornapaleta);
	    } catch (e) {
		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: calculaTamanho
	 *
	 * Muda o s&iacute;mbolo de cada classe aplicando tamanhos diferentes e lineares
	 *
	 * Veja:
	 *
	 * <CALCULATAMANHOCLASSES>
	 */
	calculaTamanho : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var retornapaleta = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostralegenda();
		}, cp = new cpaint(), p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=calculaTamanhoClasses&tema="
		    + i3GEOF.legenda._parameters.tema;
		cp.set_response_type("JSON");
		cp.call(p, "calculaTamanhoClasses", retornapaleta);
	    } catch (e) {
		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: ordenaClasses
	 *
	 * Ordena as classes pelo nome
	 *
	 */
	ordenaClasses : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var retornapaleta = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostralegenda();
		}, cp = new cpaint(), p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=ordenaClasses&tema="
		    + i3GEOF.legenda._parameters.tema;
		cp.set_response_type("JSON");
		cp.call(p, "foo", retornapaleta);
	    } catch (e) {
		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: excluilinhaf
	 *
	 * Exclui uma linha da tabela de edi&ccedil;&atilde;o de classes da legendda
	 */
	excluilinhaf : function(id) {
	    var p = $i(id);
	    do {
		p.removeChild(p.childNodes[0]);
	    } while (p.childNodes.length > 0);
	    p.parentNode.removeChild(p);
	    i3GEOF.legenda.mudaLegenda();
	},
	/*
	 * Function: sobelinhaf
	 *
	 * Sobe uma linha na tabela de edi&ccedil;&atilde;o de classes da legendda
	 */
	sobelinhaf : function(idclasse) {
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var p =
		i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=ALTERACLASSE&opcao=sobeclasse&tema="
		+ i3GEOF.legenda._parameters.tema
		+ "&idclasse="
		+ idclasse, cp = new cpaint(), temp = function() {
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.mostralegenda();
	    };
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", temp);
	},
	/*
	 * Function: descelinhaf
	 *
	 * Desce uma linha na tabela de edi&ccedil;&atilde;o de classes da legendda
	 */
	descelinhaf : function(idclasse) {
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var p =
		i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=ALTERACLASSE&opcao=desceclasse&tema="
		+ i3GEOF.legenda._parameters.tema
		+ "&idclasse="
		+ idclasse, cp = new cpaint(), temp = function() {
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.mostralegenda();
	    };
	    ;
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", temp);
	},
	/*
	 * Function: editaSimbolo
	 *
	 * Abre o editor de s&iacute;mbolos
	 *
	 * Veja:
	 *
	 * <EDITASIMBOLO>
	 */
	editaSimbolo : function(id) {
	    try {
		$i("i3GEOlegendaguia1obj").style.display = "none";
		$i("i3GEOlegendaguia3obj").style.display = "block";
		id = id.split("-");
		i3GEOF.legenda.classe = id[1];
		i3GEOF.legenda.formEditorSimbolo();
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    } catch (e) {
		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	formEditorSimbolo : function() {
	    var p =
		i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=editasimbolo&opcao=pegaparametros&tema="
		+ i3GEOF.legenda._parameters.tema
		+ "&classe="
		+ i3GEOF.legenda.classe, cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "pegaParametrosMapa", i3GEOF.legenda.montaEditor);
	},
	/*
	 * Function: simbU
	 *
	 * Altera a leganda do tema para o tipo s&iacute;mbolo &uacute;nico
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	simbU : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		var p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=alteraclasse&tema="
		    + i3GEOF.legenda._parameters.tema
		    + "&opcao=simbolounico&ext="
		    + ext, cp = new cpaint(), fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {
		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: valorU
	 *
	 * Altera a leganda do tema para o tipo valor &uacute;nico
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	valorU : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var item = $i("i3GEOlegendaitensValorUnico").getElementsByTagName("select")[0].value, itemNome =
		    $i("i3GEOlegendaClassesValorUnico").getElementsByTagName("select")[0].value, p =
			i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
			+ i3GEO.configura.sid
			+ "&funcao=alteraclasse&tema="
			+ i3GEOF.legenda._parameters.tema
			+ "&item="
			+ item
			+ "&itemNome="
			+ itemNome
			+ "&opcao=valorunico"
			+ "&ignorar="
			+ $i("i3GEOlegendaignorar").value, cp = new cpaint(), fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		if ($i("i3GEOFlegendaaplicaextent").checked === true) {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		} else {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.extentTotal);
		}

		if (item == "") {
		    i3GEO.janela.snackBar({content: $trad("selecionaUmItem",i3GEOF.legenda.dicionario),style: "red"});
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {
		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: valorC
	 *
	 * Altera a leganda do tema com um n&uacute;mero espec&iacute;fico de classes
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	valorC : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var item = $i("i3GEOlegendaitensValorClass").getElementsByTagName("select")[0].value, nclasses =
		    $i("i3GEOlegendanclasses").value, ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten), p =
			i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
			+ i3GEO.configura.sid
			+ "&funcao=alteraclasse&nclasses="
			+ nclasses
			+ "&tema="
			+ i3GEOF.legenda._parameters.tema
			+ "&item="
			+ item
			+ "&opcao=intervalosiguais&ignorar="
			+ $i("i3GEOlegendaignorar").value
			+ "&ext="
			+ ext, cp = new cpaint(), fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		if (item == "") {
		    i3GEO.janela.snackBar({content: $trad("selecionaUmItem",i3GEOF.legenda.dicionario),style: "red"});
		    return;
		}
		if ($i("i3GEOFlegendaaplicaextent").checked === true) {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		} else {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.extentTotal);
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {
		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: metade
	 *
	 * Duas classes concentrando a soma das metades
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	metade : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var item = $i("i3GEOlegendaitensMetade").getElementsByTagName("select")[0].value,
		itemid = $i("i3GEOlegendaitensMetadeId").getElementsByTagName("select")[0].value,
		p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=alteraclasse"
		+ "&tema="
		+ i3GEOF.legenda._parameters.tema
		+ "&item="
		+ item
		+ "&itemid="
		+ itemid
		+ "&opcao=metade&ignorar="
		+ $i("i3GEOlegendaignorar").value,
		cp = new cpaint(),
		fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		if (item == "") {
		    i3GEO.janela.snackBar({content: $trad("selecionaUmItem",i3GEOF.legenda.dicionario),style: "red"});
		    return;
		}
		if (itemid == "") {
		    i3GEO.janela.snackBar({content: $trad("selecionaUmItem",i3GEOF.legenda.dicionario),style: "red"});
		    return;
		}
		if ($i("i3GEOFlegendaaplicaextent").checked === true) {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		} else {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.extentTotal);
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: media
	 *
	 * Duas classes considerando a media
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	media : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var item = $i("i3GEOlegendaitensMedia").getElementsByTagName("select")[0].value,
		p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=alteraclasse"
		+ "&tema="
		+ i3GEOF.legenda._parameters.tema
		+ "&item="
		+ item
		+ "&opcao=media&ignorar="
		+ $i("i3GEOlegendaignorar").value,
		cp = new cpaint(),
		fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		if (item == "") {
		    i3GEO.janela.snackBar({content: $trad("selecionaUmItem",i3GEOF.legenda.dicionario),style: "red"});
		    return;
		}
		if ($i("i3GEOFlegendaaplicaextent").checked === true) {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		} else {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.extentTotal);
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: valorQ
	 *
	 * Altera a leganda do tema claculando as classes pelo m&eacute;todo quartil
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	valorQ : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var item = $i("i3GEOlegendaitensValorQuartil").getElementsByTagName("select")[0].value, ext =
		    i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten), p =
			i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
			+ i3GEO.configura.sid
			+ "&funcao=alteraclasse&tema="
			+ i3GEOF.legenda._parameters.tema
			+ "&item="
			+ item
			+ "&opcao=quartis&ignorar="
			+ $i("i3GEOlegendaignorar").value
			+ "&ext="
			+ ext
			+ "&tipoLegenda="
			+ $i("estiloClassesQuartis").value, cp = new cpaint(), fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		if (item == "") {
		    i3GEO.janela.snackBar({content: $trad("selecionaUmItem",i3GEOF.legenda.dicionario),style: "red"});
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: valorQu
	 *
	 * Altera a leganda do tema por meio do calculo de quantis
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	valorQu : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var item = $i("i3GEOlegendaitensValorClass").getElementsByTagName("select")[0].value, nclasses =
		    $i("i3GEOlegendanclasses").value, ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten), p =
			i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
			+ i3GEO.configura.sid
			+ "&funcao=alteraclasse&nclasses="
			+ nclasses
			+ "&tema="
			+ i3GEOF.legenda._parameters.tema
			+ "&item="
			+ item
			+ "&opcao=quantil&ignorar="
			+ $i("i3GEOlegendaignorar").value
			+ "&ext="
			+ ext, cp = new cpaint(), fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		if (item == "") {
		    i3GEO.janela.snackBar({content: $trad("selecionaUmItem",i3GEOF.legenda.dicionario),style: "red"});
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: valorQN
	 *
	 * Altera a legenda do tema por meio do calculo de quebras naturais
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	valorQN : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var item = $i("i3GEOlegendaitensValorClass").getElementsByTagName("select")[0].value, nclasses =
		    $i("i3GEOlegendanclasses").value, ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten), p =
			i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
			+ i3GEO.configura.sid
			+ "&funcao=alteraclasse&nclasses="
			+ nclasses
			+ "&tema="
			+ i3GEOF.legenda._parameters.tema
			+ "&item="
			+ item
			+ "&opcao=quebrasnaturais&ignorar="
			+ $i("i3GEOlegendaignorar").value
			+ "&ext="
			+ ext, cp = new cpaint(), fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		if (item == "") {
		    i3GEO.janela.snackBar({content: $trad("selecionaUmItem",i3GEOF.legenda.dicionario),style: "red"});
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},

	/*
	 * Function: representacao
	 *
	 * Altera o tipo de representa&ccedil;&atilde;o do tema (linear ou poligonoal)
	 *
	 * Veja:
	 *
	 * <ALTERAREPRESENTACAO>
	 *
	 */
	representacao : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=alterarepresentacao&tema="
		    + i3GEOF.legenda._parameters.tema, cp = new cpaint(), fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraRepresentacao", fim);
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: montaEditor
	 *
	 * Monta o editor de s&iacute;mbolos quando o usu&aacute;rio clica em um s&iacute;mbolo na legenda
	 */
	montaEditor : function(retorno) {
	    try {
		i3GEO.util.comboItens(
			"i3GEOlegendaSelItemLabel",
			i3GEOF.legenda._parameters.tema,
			function(retorno) {
			    if ($i("i3GEOlegendaitensLabel")) {
				$i("i3GEOlegendaitensLabel").innerHTML = retorno.dados ;
			    }
			},
			"i3GEOlegendaitensLabel",
			"",
			"",
			"",
			"form-control"
		);
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		if (retorno.data != undefined) {
		    var b, l, i, sct, combo, n;
		    retorno = retorno.data;
		    i3GEOF.legenda._parameters.estilos = retorno.split("|");
		    combo =
			"<select id='i3GEOlegendaestilos' class='form-control' onchange=i3GEOF.legenda._parameters.estilo=this.value;i3GEOF.legenda.mostraEstilo(this.value)>";
		    n = i3GEOF.legenda._parameters.estilos.length;
		    for (i = 0; i < n; i++) {
			l = i3GEOF.legenda._parameters.estilos[i].split("#");
			sct = "<option value=" + l[1] + "  />" + l[1] + "</option>";
			combo += sct;
		    }
		    combo += "</select></div>";
		    $i("i3GEOlegendacomboestilos").innerHTML = combo;
		    $i("i3GEOlegendaestilos").value = i3GEOF.legenda._parameters.estilo;


		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostraEstilo(0);
		} else {
		    $i("i3GEOlegendacomboestilos").innerHTML = "<p style=color:red >Erro<br>";
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		}
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	desceEstilo: function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=editasimbolo&opcao=desceestilo&tema="
		    + i3GEOF.legenda._parameters.tema
		    + "&classe="
		    + i3GEOF.legenda.classe
		    + "&estilo="
		    + i3GEOF.legenda._parameters.estilo, cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p, "editasimbolo", i3GEOF.legenda.reMontaEditor);
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	sobeEstilo: function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=editasimbolo&opcao=sobeestilo&tema="
		    + i3GEOF.legenda._parameters.tema
		    + "&classe="
		    + i3GEOF.legenda.classe
		    + "&estilo="
		    + i3GEOF.legenda._parameters.estilo, cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p, "editasimbolo", i3GEOF.legenda.reMontaEditor);
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	adicionaEstilo: function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=editasimbolo&opcao=adicionaestilo&tema="
		    + i3GEOF.legenda._parameters.tema
		    + "&classe="
		    + i3GEOF.legenda.classe
		    + "&estilo="
		    + i3GEOF.legenda._parameters.estilo, cp = new cpaint();
		cp.set_response_type("JSON");
		i3GEOF.legenda._parameters.estilo = i3GEOF.legenda._parameters.estilo + 1;
		cp.call(p, "editasimbolo", i3GEOF.legenda.reMontaEditor);
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	excluiEstilo: function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		i3GEOF.legenda._parameters.estilo = 0;
		var p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=editasimbolo&opcao=excluiestilo&tema="
		    + i3GEOF.legenda._parameters.tema
		    + "&classe="
		    + i3GEOF.legenda.classe
		    + "&estilo="
		    + i3GEOF.legenda._parameters.estilo, cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p, "editasimbolo", i3GEOF.legenda.reMontaEditor);
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: mostraEstilo
	 *
	 * Mostra as propriedades de um estilo de um s&iacute;mbolo
	 */
	mostraEstilo : function() {
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    try {
		var linha, tipoLayer, d, p, cp, mustache = {};
		//i3GEOF.legenda._parameters.estilo = e; // esta e uma variavel global
		linha = i3GEOF.legenda._parameters.estilos[i3GEOF.legenda._parameters.estilo];
		linha = linha.split("#");
		tipoLayer = linha[0];
		mustache = {
			"voutlinecolor": linha[2],
			"vcolor": linha[4],
			"vbackgroundcolor": linha[3],
			"vsize": linha[6],
			"vwidth": linha[8],
			"vpattern": linha[9],
			"vopacity": linha[7],
			"vangle": linha[10],
			"vsymbolscale": linha[11],
			"vminsize": linha[12],
			"vmaxsize": linha[13],
			"voffsetx": linha[14],
			"voffsety": linha[15],
			"vsymbolname": linha[5],
		};

		ins = Mustache.render(
			i3GEOF.legenda._parameters.mustacheestilo,
			$.extend(
				{},
				mustache,
				i3GEOF.legenda._parameters.objdicionario
			)
		);
		$i("i3GEOlegendaParametrosEstilos").innerHTML = ins;


		//preenche as listas de itens
		i3GEO.util.comboItens(
			"",
			i3GEOF.legenda._parameters.tema, function(retorno) {
			    if ($i("i3GEOlegendaComboSize")) {
				$i("i3GEOlegendaComboSize").innerHTML = retorno.dados.replace("id=''"," onchange='$i(\"i3GEOlegendasizes\").value = this.value'");
			    }
			},
			"",
			"",
			"",
			"",
			"form-control"
		);

		i3GEO.util.aplicaAquarela("i3GEOlegendaParametrosEstilos");

		p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=editasimbolo&tipo="
		    + tipoLayer
		    + "&opcao=listaSimbolos&onclick=i3GEOF.legenda.aplicaSimbolo(this)";
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p, "editasimbolo", i3GEOF.legenda.listaSimbolos);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    } catch (e) {
		i3GEO.janela.snackBar({content: "Erro: " + i3GEOF.legenda._parameters.estilo, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: listaSimbolos
	 *
	 * Monta a lista de s&iacute;mbolos com imagem
	 */
	listaSimbolos : function(retorno) {
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    try {
		if (retorno.data != undefined) {
		    retorno = retorno.data;
		    $i("i3GEOlegendasimbolos").innerHTML = retorno;
		} else {
		    $i("i3GEOlegendasimbolos").innerHTML = "<p style=color:red >Erro<br>";
		}
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: aplicaSimbolo
	 *
	 * Muda o valor do campo com o c&oacute;digo do s&iacute;mbolo escolhido
	 */
	aplicaSimbolo : function(s) {
	    $i("i3GEOlegendasymbolname").value = s.title;
	},
	/*
	 * Function: aplicaEstilo
	 *
	 * Aplica ao estilo as propriedades definidas
	 *
	 * Veja:
	 *
	 * <EDITASIMBOLO>
	 */
	aplicaEstilo : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var i, p, cp, fim, outlinecolor = $i("i3GEOlegendaoutlinecolor").value, backgroundcolor =
		    $i("i3GEOlegendabackgroundcolor").value, color = $i("i3GEOlegendacolor").value, symbolname =
			$i("i3GEOlegendasymbolname").value, simbolos = $i("i3GEOlegendasimbolos").getElementsByTagName("img"), valido = "nao", n =
			    simbolos.length, size = $i("i3GEOlegendasizes").value, width = $i("i3GEOlegendawidth").value, pattern =
				$i("i3GEOlegendapattern").value, opacidade = $i("i3GEOlegendaopacidade").value, angle = $i("i3GEOlegendaangulo").value, symbolscale =
				    $i("i3GEOlegendasymbolscale").value, minsize = $i("i3GEOlegendaminsize").value, maxsize =
					$i("i3GEOlegendamaxsize").value, offsetx = $i("i3GEOlegendaoffsetx").value, offsety = $i("i3GEOlegendaoffsety").value;
		if (symbolscale != "") {
		    symbolscale = parseInt(symbolscale, 10);
		} else {
		    symbolscale = -1;
		}
		for (i = 0; i < n; i++) {
		    if (simbolos[i].title == symbolname || symbolname == i) {
			valido = "sim";
		    }
		}
		if (valido === "nao") {
		    // i3GEO.janela.tempoMsg("Nome do simbolo nao encontrado");
		    // i3GEOF.legenda.aguarde.visibility = "hidden";
		    // return;
		}
		p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=editasimbolo&opcao=aplica&tema="
		    + i3GEOF.legenda._parameters.tema
		    + "&classe="
		    + i3GEOF.legenda.classe
		    + "&estilo="
		    + i3GEOF.legenda._parameters.estilo
		    + "&outlinecolor="
		    + outlinecolor
		    + "&backgroundcolor="
		    + backgroundcolor
		    + "&color="
		    + color
		    + "&symbolname="
		    + symbolname
		    + "&width="
		    + width
		    + "&pattern="
		    + pattern
		    + "&size="
		    + size
		    + "&opacidade="
		    + opacidade
		    + "&angle="
		    + angle
		    + "&symbolscale="
		    + symbolscale
		    + "&minsize="
		    + minsize
		    + "&maxsize="
		    + maxsize
		    + "&offsetx="
		    + offsetx
		    + "&offsety="
		    + offsety;
		cp = new cpaint();
		fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.reMontaEditor();
		};
		// cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p, "editasimbolo", fim);
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: reMontaEditor
	 *
	 * Gera novamente o editor de s&iacute;mbolo ap&oacute;s ter sido feita alguma altera&ccedil;&atilde;o nos estilos
	 */
	reMontaEditor : function() {
	    var id = i3GEOF.legenda._parameters.tema + "-" + i3GEOF.legenda.classe;
	    i3GEOF.legenda.editaSimbolo(id);
	},
	/*
	 * Function: mostraGrafico
	 *
	 * Mostra um gr&aacute;fico com a contegem de elementos em caada classe
	 *
	 * Veja:
	 *
	 * <CONTAGEMCLASSE>
	 */
	mostraGrafico : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var monta =
		    function(retorno) {
		    if (retorno.data && retorno.data[0].proc == "") {
			var b, ins = [], i, re, t;
			ins.push("<h4>" + $trad('numeroOcorrenciasClasses', i3GEOF.legenda.dicionario) + "</h4>");
			ins.push("<table width=100% >");
			i3GEOF.legenda._parameters.dadosGrafico = [
			    "n;x"
			    ];
			if (retorno.data.length < 2) {
			    i3GEO.janela.snackBar({content: $trad("msgNumeroClasses",i3GEOF.legenda.dicionario),style: "red"});
			    i3GEOF.legenda.aguarde.visibility = "hidden";
			    return;
			} else {
			    i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia4", "i3GEOlegendaguia");
			}
			for (i = 0; i < retorno.data.length; i++) {
			    id = retorno.data[i].tema + "-" + retorno.data[i].idclasse; // layer+indice da classe
			    re = new RegExp("'", "g");
			    exp = (retorno.data[i].expressao).replace(re, '"');
			    ins.push("<tr><td style='text-align:left;border-bottom:0 none white' >" + retorno.data[i].nomeclasse
				    + "</td></tr>");
			    t = (retorno.data[i].nreg * 100) / retorno.data[i].totalreg;
			    ins.push("<tr><td style=text-align:left ><img height=15px width=" + t
				    + "% src='"
				    + retorno.data[i].imagem
				    + "' /></td></tr>");
			    i3GEOF.legenda._parameters.dadosGrafico.push(retorno.data[i].nomeclasse + ";" + retorno.data[i].nreg);
			}
			ins.push("</table><br>");
			$i("i3GEOlegendaguia4obj").innerHTML = ins.join("");
		    } else {
			$i("i3GEOlegendaguia4obj").innerHTML = "<p style=color:red >Erro<br>";
			return;
		    }
		    i3GEOF.legenda.aguarde.visibility = "hidden";

		}, p =
		    i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=contagemclasse&tema="
		    + i3GEOF.legenda._parameters.tema, cp = new cpaint();
		// cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p, "cocontagemclasse", monta);
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	iniciaGraficoPizza : function() {
	    var dados = {
		    "attributes" : {
			"id" : ""
		    },
		    "data" : {
			"dados" : i3GEOF.legenda._parameters.dadosGrafico
		    }
	    };
	    i3GEOF.graficointerativo1.tipo = "pizza_1";
	    i3GEOF.graficointerativo1.iniciaJanelaFlutuante(dados);
	},
	/*
	 * Function: aplicaProcessos
	 *
	 * Aplica processos de ajuste em imagens de sat&eacute;lite
	 *
	 * Veja:
	 *
	 * <APLICAPROCESSOS>
	 */
	aplicaProcessos : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var lista = [], ipt, i, p, cp, temp;
		if ($i("i3GEOlegendaprocessos").innerHTML != "") {
		    ipt = $i("i3GEOlegendaprocessos").getElementsByTagName("input");
		    for (i = 0; i < ipt.length; i++) {
			if (ipt[i].value != "") {
			    lista.push(ipt[i].value);
			}
		    }
		}
		lista = lista.join("|");
		temp = function() {
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostralegenda();
		    i3GEOF.legenda.aposAlterarLegenda();
		};
		p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=aplicaProcessos&lista="
		    + lista
		    + "&tema="
		    + i3GEOF.legenda._parameters.tema;
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p, "aplicaProcessos", temp);
	    } catch (e) {

		i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: adicionaProcesso
	 *
	 * Adiciona um novo processo na lista de processos
	 */
	adicionaProcesso : function(s) {
	    $i("i3GEOlegendaprocessos").innerHTML += "<div class='form-group label-fixed condensed'><input value='" + s.value + "' class='form-control input-lg' type='text' /></div>";
	},
	aplicaTodasClasses : function(parametro, id) {
	    var valor = $i(id).value;
	    i3GEO.janela.confirma("Aplica " + parametro + " = " + valor + " ?", 300, $trad("x14"), "", function() {
		var temp = function() {
		    // i3GEOF.legenda.mostralegenda();
		    i3GEOF.legenda.aposAlterarLegenda();
		}, p, cp;
		p =
		    i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=aplicaTodasClasses"
		    + "&parametro="
		    + parametro
		    + "&valor="
		    + valor
		    + "&tema="
		    + i3GEOF.legenda._parameters.tema;
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p, "foo", temp);
	    });
	},
	aplicarCluster : function(){
	    var temp = function() {
		i3GEOF.legenda.aposAlterarLegenda();
		i3GEOF.legenda.montaCombosItens();
	    }, p, cp;
	    p =
		i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=aplicarCluster"
		+ "&maxdistance="
		+ $i("i3GEOlegendaClusterMaxdistance").value
		+ "&buffer="
		+ $i("i3GEOlegendaClusterBuffer").value
		+ "&filter="
		//+ i3GEO.util.base64encode($i("i3GEOlegendaClusterFilter").value)
		+ $i("i3GEOlegendaClusterFilter").value
		+ "&region="
		+ $i("i3GEOlegendaClusterRegion").value
		+ "&group="
		+ $i("i3GEOlegendaitensCluster").getElementsByTagName("select")[0].value
		+ "&tema="
		+ i3GEOF.legenda._parameters.tema;
	    cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", temp);
	},
	removerCluster : function(){
	    var temp = function() {
		i3GEOF.legenda.montaCombosItens();
		i3GEOF.legenda.aposAlterarLegenda();
	    }, p, cp;
	    p =
		i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=removerCluster"
		+ "&tema="
		+ i3GEOF.legenda._parameters.tema;
	    cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", temp);
	},
	montaCombosItens : function(){
	    i3GEO.util.comboItens(
		    "",
		    i3GEOF.legenda._parameters.tema,
		    function(retorno) {
			if ($i("i3GEOlegendaitensValorUnico")) {
			    $i("i3GEOlegendaitensValorUnico").innerHTML = retorno.dados ;
			}
			if ($i("i3GEOlegendaClassesValorUnico")) {
			    $i("i3GEOlegendaClassesValorUnico").innerHTML = retorno.dados;
			}
			if ($i("i3GEOlegendaitensMetade")) {
			    $i("i3GEOlegendaitensMetade").innerHTML = retorno.dados;
			}
			if ($i("i3GEOlegendaitensMetadeId")) {
			    $i("i3GEOlegendaitensMetadeId").innerHTML = retorno.dados;
			}
			if ($i("i3GEOlegendaitensMedia")) {
			    $i("i3GEOlegendaitensMedia").innerHTML = retorno.dados;
			}
			if ($i("i3GEOlegendaitensValorClass")) {
			    $i("i3GEOlegendaitensValorClass").innerHTML = retorno.dados;
			}
			if ($i("i3GEOlegendaitensCluster")) {
			    $i("i3GEOlegendaitensCluster").innerHTML = retorno.dados;
			}
			if ($i("i3GEOlegendaitensValorQuartil")) {
			    $i("i3GEOlegendaitensValorQuartil").innerHTML = retorno.dados;
			}
		    },
		    "",
		    "",
		    "",
		    "",
		    "form-control"
	    );
	},
	parametrosAuto : function() {
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var p = i3GEO.configura.locaplic+"/ferramentas/legenda/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=parametrosauto&tema=" + i3GEOF.legenda._parameters.tema,
	    cp = new cpaint(),
	    temp = function(retorno){
		try{
		    if(retorno.data !== ""){
			$i("i3GEOlegendaAutocolunas").innerHTML = retorno.data.colunas.replace(/,/gi,', ');
			$i("i3GEOlegendaAutoclassesitem").value = retorno.data.classesitem;
			$i("i3GEOlegendaAutoclassesnome").value = retorno.data.classesnome;
			$i("i3GEOlegendaAutoclassescor").value = retorno.data.classescor;
			$i("i3GEOlegendaAutoclassessimbolo").value = retorno.data.classessimbolo;
			$i("i3GEOlegendaAutoclassestamanho").value = retorno.data.classestamanho;
			$i("i3GEOlegendaAutopalletefile").value = retorno.data.palletefile;
			$i("i3GEOlegendaAutopalletestep").value = retorno.data.palletestep;
		    }
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		}catch(e){

		    i3GEO.janela.snackBar({content: "Erro: " + e, style: "red"});
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		}
	    };
	    cp.set_response_type("JSON");
	    cp.call(p,"foo",temp);
	},
	salvaParametrosAuto: function(){
	    if(i3GEOF.legenda.aguarde.visibility === "visible"){
		return;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var temp,
	    p,
	    cp;
	    temp = function(){
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.aposAlterarLegenda();
	    };
	    p = i3GEO.configura.locaplic+"/ferramentas/legenda/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=salvaparametrosauto&tema=" + i3GEOF.legenda._parameters.tema
	    + "&classesitem=" + $i("i3GEOlegendaAutoclassesitem").value
	    + "&classesnome=" + $i("i3GEOlegendaAutoclassesnome").value
	    + "&classescor=" + $i("i3GEOlegendaAutoclassescor").value
	    + "&classessimbolo=" + $i("i3GEOlegendaAutoclassessimbolo").value
	    + "&classestamanho=" + $i("i3GEOlegendaAutoclassestamanho").value
	    + "&palletefile=" + $i("i3GEOlegendaAutopalletefile").value
	    + "&palletestep=" + $i("i3GEOlegendaAutopalletestep").value;

	    cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p,"foo",temp);
	}
};
//aplica ao codigo i3GEOF definicoes feitas na interface do mapa
//isso permite a substituicao de funcoes e parametros
if(i3GEO.configura.ferramentas.hasOwnProperty("legenda")){
    jQuery.each( i3GEO.configura.ferramentas.legenda, function(index, value) {
	i3GEOF.legenda[index] = i3GEO.configura.ferramentas.legenda[index];
    });
}