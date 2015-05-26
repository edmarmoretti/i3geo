if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.opcoesFundo
*/
i3GEOF.opcoesFundo = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.opcoesFundo.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["asp"] = '"';
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			i3GEOF.opcoesFundo.aguarde.visibility = "visible";
			$i(iddiv).innerHTML += i3GEOF.opcoesFundo.html();
			var b = new YAHOO.widget.Button(
				"i3GEOopcoesFundobotao1",
				{onclick:{fn: i3GEOF.opcoesFundo.executa}}
			);
			b.addClass("rodar150");
			i3GEO.util.aplicaAquarela("i3GEOF.opcoesFundo_corpo");
			var p = i3GEO.configura.locaplic+"/ferramentas/opcoes_fundo/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=pegacorfundo",
				cp = new cpaint(),
				retorno = function(retorno){
					i3GEOF.opcoesFundo.aguarde.visibility = "hidden";
					if(retorno.data.erro){i3GEO.janela.tempoMsg("Erro");return;}
					$i("i3GEOopcoesFundocor").value = retorno.data;
				};
			cp.set_response_type("JSON");
			cp.call(p,"corQM",retorno);
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
		if(i3GEO.Interface.ATUAL === "googlemaps" || i3GEO.Interface.ATUAL === "googleearth")
		{i3GEO.janela.tempoMsg($trad('ajuda',i3GEOF.opcoesFundo.dicionario));}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.opcoesFundo.MUSTACHE, i3GEOF.opcoesFundo.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		if ($i("i3GEOF.opcoesFundo")) {
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opcoesFundo");
		};
		//cria a janela flutuante
		titulo = "<div class='i3GeoTituloJanela'>" + $trad("p9")+"<a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=6' ><b> </b></a></div>";
		janela = i3GEO.janela.cria(
			"210px",
			"80px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.opcoesFundo",
			false,
			"hd",
			cabecalho,
			""
		);
		divid = janela[2].id;
		$i("i3GEOF.opcoesFundo_corpo").style.backgroundColor = "white";
		$i("i3GEOF.opcoesFundo_corpo").style.textAlign = "left";
		i3GEOF.opcoesFundo.aguarde = $i("i3GEOF.opcoesFundo_imagemCabecalho").style;
		i3GEOF.opcoesFundo.inicia(divid);
	},
	/*
	Function: corj

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: executa

	Aplica a nova cor

	A cor do fundo na interface Openlayers &eacute; definida por meio de estilo, mas &eacute; necess&aacute;rio persistir a cor no mapfile existente no servidor.
	*/
	executa: function(){
		if(i3GEOF.opcoesFundo.aguarde.visibility === "visible")
		{return;}
		i3GEOF.opcoesFundo.aguarde.visibility = "visible";
		var temp = function(){
				i3GEOF.opcoesFundo.aguarde.visibility = "hidden";
				if(i3GEO.Interface.ATUAL === "openlayers"){
					//var layer = i3geoOL.getLayersByName("Nenhum")[0];
					//layer.mergeNewParams({"DESLIGACACHE":"sim"});
					//layer.mergeNewParams({r:Math.random()});
					if($i(i3geoOL.id+"_events")){
						$i(i3geoOL.id+"_events").style.backgroundColor = "rgb("+$i("i3GEOopcoesFundocor").value+")";
					}
					if ($i(i3geoOL.id + "_OpenLayers_ViewPort")) {
						$i(i3geoOL.id + "_OpenLayers_ViewPort").style.backgroundColor = "rgb("+$i("i3GEOopcoesFundocor").value+")";
					}
					//para OL3
					if($i("openlayers")){
						$i("openlayers").style.backgroundColor = "rgb(" + $i("i3GEOopcoesFundocor").value + ")";
					}
				}
				i3GEO.atualiza();
			},
			cor = $i("i3GEOopcoesFundocor").value,
			p = i3GEO.configura.locaplic+"/ferramentas/opcoes_fundo/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=corfundo&cor="+cor,
			cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"corQM",temp);
	}
};