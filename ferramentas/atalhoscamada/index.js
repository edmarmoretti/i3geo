if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.atalhoscamada
 */
i3GEOF.atalhoscamada =
{
	/**
	 * Array com os ids das janelas ja criadas
	 */
	janelas : [],
	propJanelas : {},
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function(idjanela) {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.atalhoscamada.dicionario),
			tema = i3GEOF.atalhoscamada.propJanelas[idjanela].tema,
			ltema = i3GEO.arvoreDeCamadas.pegaTema(tema),
			funcoes,vetor=false;

		if ((ltema.type < 3) && (ltema.connectiontype !== 7)){
			vetor = true;
		}
		//
		// ajusta as propriedades e funcoes caso a camada seja um plugin
		//
		ltema = i3GEO.pluginI3geo.aplicaPropriedades(ltema);
		// inclui no objeto o parametro de verificacao
		// e necessario clonar para nao alterar o original
		funcoes = i3GEO.util.cloneObj(i3GEO.arvoreDeCamadas.FUNCOES);
		funcoes.plugini3geo = ltema.plugini3geo;
		funcoes = i3GEO.pluginI3geo.aplicaPropriedades(funcoes);

		//constroi o hash para substituir no template
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["procurar"] = $trad("t23");
		dicionario["topo"] = $trad("t25");
		dicionario["etiquetas"] = $trad("t27");
		dicionario["filtro"] = $trad("t29");
		dicionario["tabela"] = $trad("t31");
		dicionario["selecao"] = $trad("x51");
		dicionario["grafico"] = $trad("t37");
		dicionario["editaLegenda"] = $trad("t33");
		dicionario["destaca"] = $trad("t35");
		dicionario["sql"] = $trad("t41");
		dicionario["comentar"] = $trad("t45");
		dicionario["wms"] = "WMS-OGC";
		dicionario["tme"] = $trad("t49");
		dicionario["topo"] = $trad("x56");
		dicionario["idjanela"] = idjanela;
		dicionario["idjanelaA"] = '"'+idjanela+'"';
		dicionario["tema"] = tema;
		dicionario["nomeCamada"] = ltema.tema;
		dicionario["opaCamada"] = ltema.transparency;

		//decide se o botao deve aparecer ou nao
		dicionario["procurarHidden"] = (vetor == true) ? "":"hidden";
		dicionario["topoHidden"] = (vetor == true) ? "":"hidden";
		dicionario["topoHidden"] = (vetor == true) ? "":"hidden";
		dicionario["etiquetasHidden"] = (vetor == true) ? "":"hidden";
		dicionario["filtroHidden"] = (vetor == true) ? "":"hidden";
		dicionario["tabelaHidden"] = (vetor == true) ? "":"hidden";
		dicionario["selecaoHidden"] = (vetor == true) ? "":"hidden";
		dicionario["graficoHidden"] = (vetor == true) ? "":"hidden";
		dicionario["StoryMapHidden"] = (vetor == true) ? "":"hidden";
		dicionario["legendaHidden"] = (ltema.type < 4 || ltema.type === 8) ? "":"hidden";
		dicionario["noPolygonHidden"] = (ltema.type === 2) ? "":"hidden";
		dicionario["destacaHidden"] = (i3GEO.Interface.ATUAL == "openlayers") ? "":"hidden";
		dicionario["wmsHidden"] = (ltema.permiteogc.toLowerCase() !== "nao") ? "":"hidden";
		dicionario["metaestatHidden"] = (parseInt(ltema.id_medida_variavel,10) > 0) ? "":"hidden";

		return dicionario;
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
		if(i3GEOF.atalhoscamada.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/atalhoscamada/template_mst.html", function(template) {
				i3GEOF.atalhoscamada.MUSTACHE = template;
				i3GEOF.atalhoscamada.inicia(iddiv, idjanela);
			});
			return;
		}
		$i(iddiv).innerHTML = i3GEOF.atalhoscamada.html(idjanela);
		//i3GEO.janela.applyScrollBar(iddiv,".customScrollBar");
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
		var ins = Mustache.render(i3GEOF.atalhoscamada.MUSTACHE, i3GEOF.atalhoscamada.mustacheHash(idjanela));
		return ins;
	},
	/*
	 * Function: criaJanelaFlutuante
	 *
	 * Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante : function() {
		var minimiza, cabecalho, janela, divid, temp, titulo, ltema, id = "atc"
			+ parseInt(
				Math.random() * 1000000,
				10);

		i3GEOF.atalhoscamada.janelas.push(id);
		i3GEOF.atalhoscamada.propJanelas[id] = {};
		i3GEOF.atalhoscamada.propJanelas[id].tema = i3GEO.temaAtivo;

		ltema = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.atalhoscamada.propJanelas[id].tema);
		cabecalho = function() {
		};
		minimiza = function() {
			i3GEO.janela.minimiza(id,200);
		};
		// cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + ltema.tema + "</span></div>";

		janela =
			i3GEO.janela.cria(
				"280px",
				"300px",
				"",
				"",
				"",
				titulo,
				id,
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
		if (i3GEOF.atalhoscamada.janelas.length > 1) {
			temp = janela[0].cfg.config;
			janela[0].moveTo(
				temp.x.value
					+ (i3GEOF.atalhoscamada.janelas.length * 50),
				temp.y.value
					+ (i3GEOF.atalhoscamada.janelas.length * 15));
		}

		temp = function() {
			i3GEOF.atalhoscamada.janelas.remove(id);
			i3GEOF.atalhoscamada.propJanelas[id] = null;
		};
		YAHOO.util.Event.addListener(
			janela[0].close,
			"click",
			temp);

		i3GEOF.atalhoscamada.inicia(divid, id);
	},
	/**
	 * Aplica ao objeto CAMADAS o parametro definido
	 * Esse parametro e usado na hora de salvar o mapa
	 * Para isso, a funcao salvarmapfile deve ser preparada para obter o parametro
	 * e enviar para a funcao php
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
		tema = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.atalhoscamada.tema);
		tema[obj.name] = valor;
	},
	mudaOpacidade : function(f,idjanela){
		i3GEO.tema.mudatransp(i3GEOF.atalhoscamada.propJanelas[idjanela].tema,f[0].value);
	},
	temporizador : function(f,idjanela){
		i3GEO.tema.temporizador(i3GEOF.atalhoscamada.propJanelas[idjanela].tema,f[0].value);
	},
	mudaNome : function(f,idjanela){
		i3GEO.tema.mudanome(i3GEOF.atalhoscamada.propJanelas[idjanela].tema,f[0].value);
	},
	mudaCor : function(idjanela){
		var tema = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.atalhoscamada.propJanelas[idjanela].tema);
		var el = idjanela+i3GEOF.atalhoscamada.propJanelas[idjanela].tema;
		i3GEO.util.abreColourRamp(idjanela+"cr", el, tema.numclasses,i3GEOF.atalhoscamada.propJanelas[idjanela].tema, false);
	},
	aplicaColourRamp : function(idjanela) {
		var tema = i3GEOF.atalhoscamada.propJanelas[idjanela].tema;
		var lista = $i(idjanela+tema);
		if (lista.value != "") {
			var cores = lista.value, ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten), temp = function() {
				i3GEO.Interface.atualizaTema("", tema);
			}, p =
				i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
				+ i3GEO.configura.sid
				+ "&funcao=alteraclasse&opcao=aplicacoresrgb&ext="
				+ ext
				+ "&tema="
				+ tema, cp = new cpaint();
			cp.set_transfer_mode('POST');
			cp.set_response_type("JSON");
			cp.call(p, "foo", temp, "cores=" + cores);
		}
	},
	//juncao de tabelas advindas do sistema de metadados
	juncao: function(idjanela){
		i3GEO.analise.dialogo.juntamedidasvariavel(i3GEOF.atalhoscamada.propJanelas[idjanela].tema);
	}
};