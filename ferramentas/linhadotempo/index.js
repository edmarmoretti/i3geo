
if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}

i3GEOF.linhadotempo = {
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
	    var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.linhadotempo.dicionario);
	    return dicionario;
	},
	tema : "",
	iddiv: "",
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	 */
	inicia: function(iddiv){
	    if(i3GEOF.linhadotempo.MUSTACHE == ""){
		$.get(i3GEO.configura.locaplic + "/ferramentas/linhadotempo/template_mst.html", function(template) {
		    i3GEOF.linhadotempo.MUSTACHE = template;
		    i3GEOF.linhadotempo.inicia(iddiv);
		});
		return;
	    }
	    var b,box;
	    if(iddiv){
		i3GEOF.linhadotempo.iddiv = iddiv;
	    }
	    try{
		$i(iddiv).innerHTML = i3GEOF.linhadotempo.html();
		b = new YAHOO.widget.Button(
			"i3GEOlinhadotempobotao1",
			{onclick:{fn: i3GEOF.linhadotempo.salva}}
		);
		b.addClass("rodar150");

		i3GEO.janela.tempoMsg($trad('msg',i3GEOF.linhadotempo.dicionario));
		i3GEOF.linhadotempo.parametrosAtuais();
	    }
	    catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	 */
	html:function() {
	    var ins = Mustache.render(i3GEOF.linhadotempo.MUSTACHE, i3GEOF.linhadotempo.mustacheHash());
	    return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante: function(){
	    var janela,divid,temp,titulo,cabecalho,minimiza;
	    i3GEOF.linhadotempo.tema = i3GEO.temaAtivo;
	    if ($i("i3GEOF.linhadotempo")) {
		return;
	    }
	    cabecalho = function(){};
	    minimiza = function(){
		i3GEO.janela.minimiza("i3GEOF.linhadotempo");
	    };
	    //cria a janela flutuante
	    titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("opt",i3GEOF.linhadotempo.dicionario)+"</span></div>";
	    janela = i3GEO.janela.cria(
		    "400px",
		    "500px",
		    "",
		    "",
		    "",
		    titulo,
		    "i3GEOF.linhadotempo",
		    false,
		    "hd",
		    cabecalho,
		    minimiza,
		    "",
		    true,
		    "",
		    "",
		    "",
		    "",
		    "88"
	    );
	    divid = janela[2].id;
	    $i("i3GEOF.linhadotempo_corpo").style.backgroundColor = "white";
	    $i("i3GEOF.linhadotempo_corpo").style.textAlign = "left";
	    i3GEOF.linhadotempo.aguarde = $i("i3GEOF.linhadotempo_imagemCabecalho").style;
	    i3GEOF.linhadotempo.inicia(divid);
	    YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},

	salva: function(){
	    if(i3GEOF.linhadotempo.aguarde.visibility === "visible"){
		return;
	    }
	    i3GEOF.linhadotempo.aguarde.visibility = "visible";
	    var temp,
	    p,
	    cp;
	    temp = function(){
		i3GEOF.linhadotempo.aguarde.visibility = "hidden";
		//refresh iframe
		$i("i3GEOF.linhaDoTempoi").src = $i("i3GEOF.linhaDoTempoi").src.split("?")[0] + "?_=" + new Date().getTime();
	    };
	    p = i3GEO.configura.locaplic+"/ferramentas/linhadotempo/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=salva&tema=" + i3GEOF.linhadotempo.tema
	    + "&ltempoformatodata=" + $i("i3GEOlinhadotempoltempoformatodata").value
	    + "&ltempoiteminicio=" + $i("i3GEOlinhadotempoltempoiteminicio").value
	    + "&ltempoitemfim=" + $i("i3GEOlinhadotempoltempoitemfim").value
	    + "&ltempoitemtitulo=" + $i("i3GEOlinhadotempoltempoitemtitulo").value
	    + "&ltempoitemdescricao=" + $i("i3GEOlinhadotempoltempoitemdescricao").value
	    + "&ltempoconvencode=" + $i("i3GEOlinhadotempoltempoconvencode").value
	    + "&ltempoitemtip=" + $i("i3GEOlinhadotempoltempoitemtip").value
	    + "&ltempoitemimagem=" + $i("i3GEOlinhadotempoltempoitemimagem").value
	    + "&ltempoitemicone=" + $i("i3GEOlinhadotempoltempoitemicone").value
	    + "&ltempoitemlink=" + $i("i3GEOlinhadotempoltempoitemlink").value;
	    cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p,"foo",temp);
	},
	parametrosAtuais: function(){
	    i3GEOF.linhadotempo.aguarde.visibility = "visible";
	    var p = i3GEO.configura.locaplic+"/ferramentas/linhadotempo/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=parametros&tema=" + i3GEOF.linhadotempo.tema,
	    cp = new cpaint(),
	    temp = function(retorno){
		try{
		    if(retorno.data !== ""){
			$i("i3GEOlinhadotempocolunas").innerHTML = retorno.data.colunas;
			$i("i3GEOlinhadotempoltempoformatodata").value = retorno.data.ltempoformatodata;
			$i("i3GEOlinhadotempoltempoiteminicio").value = retorno.data.ltempoiteminicio;
			$i("i3GEOlinhadotempoltempoitemfim").value = retorno.data.ltempoitemfim;
			$i("i3GEOlinhadotempoltempoitemtitulo").value = retorno.data.ltempoitemtitulo;
			$i("i3GEOlinhadotempoltempoitemdescricao").value = retorno.data.ltempoitemdescricao;
			$i("i3GEOlinhadotempoltempoconvencode").value = retorno.data.ltempoconvencode;
			$i("i3GEOlinhadotempoltempoitemtip").value = retorno.data.ltempoitemtip;
			$i("i3GEOlinhadotempoltempoitemimagem").value = retorno.data.ltempoitemimagem;
			$i("i3GEOlinhadotempoltempoitemicone").value = retorno.data.ltempoitemicone;
			$i("i3GEOlinhadotempoltempoitemlink").value = retorno.data.ltempoitemlink;
		    }
		    i3GEOF.linhadotempo.aguarde.visibility = "hidden";
		}catch(e){
		    i3GEO.janela.tempoMsg("Erro. "+e);
		    i3GEOF.linhadotempo.aguarde.visibility = "hidden";
		}
	    };
	    cp.set_response_type("JSON");
	    cp.call(p,"foo",temp);
	}
};