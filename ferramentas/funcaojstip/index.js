if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.funcaojstip
 */
i3GEOF.funcaojstip = {
		/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
		 */
		aguarde: "",
		/*
		 * Variavel: tema
		 *
		 * Tema que ser&aacute; utilizado
		 *
		 * Type: {string}
		 */
		tema : i3GEO.temaAtivo,
		/**
		 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
		 */
		MUSTACHE : "",
		MUSTACHELINHA: "",
		FUNCOESJS : "",
		/**
		 * Susbtitutos para o template
		 */
		mustacheHash : function() {
			var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.funcaojstip.dicionario);
			return dicionario;
		},
		/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
		 */
		inicia: function(iddiv){
			if(i3GEOF.funcaojstip.MUSTACHE == ""){
				var t1 = i3GEO.configura.locaplic + "/ferramentas/funcaojstip/template_mst.html",
				t3 = i3GEO.configura.locaplic+"/ferramentas/funcaojstip/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=pegaFuncoesJs&tema="+i3GEOF.funcaojstip.tema;
				$.when( $.get(t1),$.get(t3) ).done(function(r1,r3) {
					i3GEOF.funcaojstip.MUSTACHE = r1[0];
					i3GEOF.funcaojstip.FUNCOESJS = i3GEO.util.base64decode(jQuery.parseJSON(r3[0])["data"]);
					i3GEOF.funcaojstip.inicia(iddiv);
				}).fail(function() {
					i3GEO.janela.closeMsg($trad("erroTpl"));
					return;
				});
				return;
			}
			try{
				$i(iddiv).innerHTML = i3GEOF.funcaojstip.html();
				$i("i3GEOfuncaojstipfuncoes").value = i3GEOF.funcaojstip.FUNCOESJS;
			}
			catch(erro){i3GEO.janela.tempoMsg(erro);}
		},
		/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
		 */
		html:function(){
			var ins = Mustache.render(i3GEOF.funcaojstip.MUSTACHE, i3GEOF.funcaojstip.mustacheHash());
			return ins;
		},
		/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

		 */
		iniciaJanelaFlutuante: function(){
			var janela,divid,temp,titulo = "";
			if($i("i3GEOF.funcaojstip")){
				i3GEOF.funcaojstip.inicia("i3GEOF.funcaojstip_corpo");
				return;
			}
			titulo = "<span class='i3GeoTituloJanelaBsNolink' >"+$trad("funcaojstip")+"</span></div>";
			janela = i3GEO.janela.cria(
					"600px",
					"260px",
					"",
					"",
					"",
					titulo,
					"i3GEOF.funcaojstip",
					false,
					"hd",
					"",
					"",
					"",
					true,
					"",
					"",
					"",
					"",
					"132"
			);
			divid = janela[2].id;
			janela[0].bringToTop();
			i3GEOF.funcaojstip.aguarde = $i("i3GEOF.funcaojstip_imagemCabecalho").style;
			$i("i3GEOF.funcaojstip_corpo").style.backgroundColor = "white";
			i3GEOF.funcaojstip.inicia(divid);
		},
		/*
	Function: limpa

	Limpa o filtro de um tema

	Veja:

	<INSERE>
		 */
		limpa: function(){
			try{
				if(i3GEOF.funcaojstip.aguarde.visibility === "visible")
				{return;}
				i3GEOF.funcaojstip.aguarde.visibility = "visible";
				var p = i3GEO.configura.locaplic+"/ferramentas/funcaojstip/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=limpafuncoesjs&tema="+i3GEOF.funcaojstip.tema,
				cp = new cpaint(),
				temp = function(retorno){
					i3GEOF.funcaojstip.aguarde.visibility = "hidden";
					i3GEOF.funcaojstip.FUNCOESJS = i3GEO.util.base64decode(retorno.data);
					$i("i3GEOfuncaojstipfuncoes").value = i3GEOF.funcaojstip.FUNCOESJS;
				};
				cp.set_response_type("JSON");
				cp.call(p,"inserefuncaojstip",temp);
			}
			catch(e){i3GEO.janela.tempoMsg("Erro: "+e);}
		},
		/*
	Function: aplica

	Aplica um filtro ao tema

	Veja:

	<INSEREFILTRO>

	Parametro:

	testa {String} - sim|nao indica a realiza&ccedil;&atilde;o de teste ou aplica&ccedil;&atilde;o final do filtro
		 */
		aplica: function(idRetorno){
			try{
				if(i3GEOF.funcaojstip.aguarde.visibility === "visible")
				{return;}
				i3GEOF.funcaojstip.aguarde.visibility = "visible";
				var p = i3GEO.configura.locaplic+"/ferramentas/funcaojstip/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=inserefuncoesjs&tema="+i3GEOF.funcaojstip.tema+"&texto="+($i("i3GEOfuncaojstipfuncoes").value),
				cp = new cpaint(),
				temp = function(retorno){
					i3GEOF.funcaojstip.aguarde.visibility = "hidden";
					i3GEOF.funcaojstip.FUNCOESJS = i3GEO.util.base64decode(retorno.data);
					$i("i3GEOfuncaojstipfuncoes").value = i3GEOF.funcaojstip.FUNCOESJS;
				};
				cp.set_response_type("JSON");
				cp.call(p,"inserefuncaojstip",temp);
			}
			catch(e){i3GEO.janela.tempoMsg("Erro: "+e);}
		}
};