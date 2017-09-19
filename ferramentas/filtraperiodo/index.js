alert("Essa opcao nao esta implementada");

/*
Title: Ferramenta que permite filtrar camadas baseada no cadastro
do m&oacute;dulo METAESTAT

 */
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.filtraperiodo

Permite que o usu&aacute;rio escolha um tipo de regi&atilde;o para incluir no mapa
 */
i3GEOF.filtraperiodo = {
	aguarde: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.filtraperiodo.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		return dicionario;
	},
	html:function() {
		var ins = Mustache.render(i3GEOF.filtraperiodo.MUSTACHE, i3GEOF.filtraperiodo.mustacheHash());
		return ins;
	},
	inicia: function(divid){
		if(i3GEOF.filtraperiodo.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/filtraperiodo/template_mst.html", function(template) {
				i3GEOF.filtraperiodo.MUSTACHE = template;
				i3GEOF.filtraperiodo.inicia(divid);
			});
			return;
		}
		i3GEO.janela.tempoMsg($trad("msgIni",i3GEOF.filtraperiodo.dicionario));
		$i(divid).innerHTML = i3GEOF.filtraperiodo.html();
		i3GEOF.filtraperiodo.comboCamadas();
	},
	iniciaJanelaFlutuante: function(){
		if($i("i3GEOF.filtraperiodo_corpo")){
			return;
		}
		var minimiza,cabecalho,titulo,janela;
		cabecalho = function(){
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.filtraperiodo",200);
		};
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >"+$trad("filtro",i3GEOF.filtraperiodo.dicionario)+"</span></div>";
		janela = i3GEO.janela.cria(
				"350",
				"400",
				"",
				"",
				"",
				titulo,
				"i3GEOF.filtraperiodo",
				false,
				"hd",
				cabecalho,
				minimiza,
				"",
				false,
				"",
				"",
				"",
				""
		);
		divid = janela[2].id;
		i3GEOF.filtraperiodo.aguarde = $i("i3GEOF.filtraperiodo_imagemCabecalho").style;
		i3GEOF.filtraperiodo.inicia(divid);
	},
	comboCamadas: function(retorno){
		var temp = function(retorno){
			var i,
			n = retorno.length,
			ins = '<select class="form-control" id="i3GEOFfiltraperiodocomboCamada" onchange="javascript:i3GEOF.filtraperiodo.comboParametrosReinicia();i3GEOF.filtraperiodo.comboParametros()" id="i3GEOF.filtraperiodo.temas" ><option value="">---</option>';
			for(i=0;i<n;i++){
				ins += '<option value="'+retorno[i].layer+'" >'+retorno[i].nome+'</option>';
			}
			ins += "</select><br><br>";
			$i("i3GEOFfiltraperiodocamadas").innerHTML = ins;
		};
		i3GEO.util.ajaxGet(
			i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?funcao=listaCamadasFiltroTempo&g_sid="+i3GEO.configura.sid,
			temp
		);
	},
	comboParametrosReinicia: function(){
		$i("i3GEOFfiltraperiodoPf_0").innerHTML = "";
	},
	comboParametros: function(){
		if($i("i3GEOFfiltraperiodocomboCamada").value == ""){
			return;
		}
		i3GEOF.filtraperiodo.parametro(0);
	},
	parametro: function(nivel){

		var layer = $i("i3GEOFfiltraperiodocomboCamada").value,
		temp = function(retorno){
			var n = retorno.length,
			i,
			ins = "";
			if(retorno[0] && retorno[0].id_pai){
				for(i=0;i<n;i++){
					ins += "<option value='"+retorno[i].id_parametro_medida+"'>"+retorno[i].nome+"</option>";
				}

				$i("i3GEOFfiltraperiodoPi_"+nivel).innerHTML = "<h5>"+$trad("nomepar",i3GEOF.filtraperiodo.dicionario)+"</h5>" +
				"<select class='form-control' name='' onchange='i3GEOF.filtraperiodo.valoresParametro(this.value,"+nivel+",\"Pi_"+nivel+"\")' >" +
				"<option value='' >---</option>"+ins+"</select></p><div class=paragrafo id='Pi_"+nivel+"'></div>";

				$i("i3GEOFfiltraperiodoPf_"+nivel).innerHTML = "<h5>"+$trad("nomepar",i3GEOF.filtraperiodo.dicionario)+"</h5>" +
				"<select class='form-control' name='' onchange='i3GEOF.filtraperiodo.valoresParametro(this.value,"+nivel+",\"Pf_"+nivel+"\")' >" +
				"<option value='' >---</option>"+ins+"</select></p><div class=paragrafo id='Pf_"+nivel+"'></div>";
			}
		};
		i3GEO.util.ajaxGet(
				i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?funcao=listaFiltroTempo&g_sid="+i3GEO.configura.sid+"&layer="+layer+"&nivel="+nivel,
				temp
		);
	},
	valoresParametro: function(id_parametro_medida,nivel,onde){
		if(id_parametro_medida === ""){
			$i(onde).innerHTML = "";
			return;
		}
		var temp = function(retorno){
			var ins="",i=0,n = retorno.length;
			ins += "<h5>"+$trad("valor",i3GEOF.filtraperiodo.dicionario)+"</h5>" +
			"<select class='form-control' name='"+id_parametro_medida+"' onchange='i3GEOF.filtraperiodo.parametro("+(nivel*1 + 1)+")' ><option value=''>---</option>";
			for(i=0;i<n;i++){
				ins += "<option value='"+retorno[i]+"'>"+retorno[i]+"</option>";
			}
			$i(onde).innerHTML =  ins+"</select>";
			i3GEOF.metaestat.comum.aguarde("hidden");
		};
		i3GEO.php.listaValoresParametroMedidaVariavel(id_parametro_medida,temp);
	},
	adicionaFiltro: function(){
		if(i3GEOF.filtraperiodo.aguarde.visibility === "visible"){
			return;
		}
		i3GEOF.filtraperiodo.aguarde.visibility = "visible";
		var p,pini,pfim,
		temp = function(retorno){
			i3GEOF.filtraperiodo.aguarde.visibility = "hidden";
			i3GEO.Interface.atualizaMapa();
		};
		//pega o filtro
		pini = i3GEOF.filtraperiodo.pegaParametros("i3GEOFfiltraperiodoPi_0");
		pfim = i3GEOF.filtraperiodo.pegaParametros("i3GEOFfiltraperiodoPf_0");
		//
		p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?funcao=aplicaFiltroTempo" +
		"&pari="+pini[0] +
		"&vali="+pini[1] +
		"&parf="+pfim[0] +
		"&valf="+pfim[1] +
		"&tema="+$i("i3GEOFfiltraperiodocomboCamada").value +
		"&g_sid="+i3GEO.configura.sid;
		if(pini[0].length == 0 || pini[1].length == 0){
			return;
		}
		i3GEO.util.ajaxGet(p,temp);
	},
	removeFiltro: function(){
		if(i3GEOF.filtraperiodo.aguarde.visibility === "visible"){
			return;
		}
		i3GEOF.filtraperiodo.aguarde.visibility = "visible";
		var p,
		temp = function(retorno){
			i3GEOF.filtraperiodo.aguarde.visibility = "hidden";
			i3GEO.Interface.atualizaMapa();
		};
		p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?funcao=removeFiltroTempo" +
		"&tema="+$i("i3GEOFfiltraperiodocomboCamada").value +
		"&g_sid="+i3GEO.configura.sid;
		i3GEO.util.ajaxGet(p,temp);
	},
	pegaParametros:function(id){
		var c = $i(id).getElementsByTagName("select"),
		n = c.length,
		par = [],
		val = [],
		i;
		if(!c){
			return [par,val];
		}
		for(i=0;i<n;i++){
			if(c[i].name != "" && c[i].value != ""){
				par.push(c[i].name);
				val.push(c[i].value);
			}
		}
		return [par,val];
	}
};