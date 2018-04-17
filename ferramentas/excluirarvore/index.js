/*
Title: Excluir camadas em lote

Veja:

<i3GEO.arvoreDeCamadas.dialogo.excluir>

Arquivo:

i3geo/ferramentas/excluirarvore/index.js.php

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
if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
/*
Classe: i3GEOF.excluirarvore

 */
i3GEOF.excluirarvore = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	 */
	aguarde: "",
	MUSTACHE : "",
	/*
	Variavel: iddiv

	Guarda o id do div definido na fun&ccedil;&atilde;o "inicia".
	 */
	iddiv: "",
	mustacheHash : function() {
	    var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.excluirarvore.dicionario);
	    return dicionario;
	},

	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	 */
	inicia: function(iddiv){
	    if(i3GEOF.excluirarvore.MUSTACHE == ""){
		$.get(i3GEO.configura.locaplic + "/ferramentas/excluirarvore/template_mst.html", function(template) {
		    i3GEOF.excluirarvore.MUSTACHE = template;
		    i3GEOF.excluirarvore.inicia(iddiv);
		});
		return;
	    }

	    i3GEOF.excluirarvore.iddiv = iddiv;

	    $i(iddiv).innerHTML = i3GEOF.excluirarvore.html();

	    i3GEOF.excluirarvore.lista();
	},
	lista: function(){
	    var camadas = i3GEO.arvoreDeCamadas.CAMADAS,
	    n = camadas.length, ins = "";
	    while(n > 0){
		n -= 1;
		if(camadas[n].tema !== ""){
		    ins += '<div class="checkbox text-left"><label>'
			+ '<input name="' + camadas[n].name + '" type="checkbox">'
			+ '<span class="checkbox-material noprint"><span class="check"></span></span> '
			+ camadas[n].tema
			+ '</label></div>';
		}
	    }
	    $i("i3GEOFexcluirarvoreLista").innerHTML = ins;
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	 */
	html:function(){
	    var ins = Mustache.render(i3GEOF.excluirarvore.MUSTACHE, i3GEOF.excluirarvore.mustacheHash());
	    return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante: function(){
	    var janela,divid,temp,titulo,cabecalho,minimiza;
	    if($i("i3GEOF.excluirarvore")){
		return;
	    }
	    cabecalho = function(){};
	    minimiza = function(){
		i3GEO.janela.minimiza("i3GEOF.excluirarvore",200);
	    };
	    //cria a janela flutuante
	    titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("t12") + "</span></div>";
	    janela = i3GEO.janela.cria(
		    "300px",
		    "350px",
		    "",
		    "",
		    "",
		    titulo,
		    "i3GEOF.excluirarvore",
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
		    "110"
	    );
	    i3GEOF.excluirarvore.aguarde = $i("i3GEOF.excluirarvore_imagemCabecalho").style;
	    divid = janela[2].id;
	    temp = function(){
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.excluirarvore.lista()") >= 0){
		    i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.excluirarvore.lista()");
		}
	    };
	    YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	    i3GEO.eventos.adicionaEventos("ATUALIZAARVORECAMADAS",["i3GEOF.excluirarvore.lista()"]);
	    i3GEOF.excluirarvore.inicia(divid);
	},
	/*
	Function: lote

	Executa uma opera&ccedil;&atilde;o em lote sobre as camadas mostradas no mapa

	 */
	lote: function(objeto){
	    var excluir = [],
	    temp,
	    camadas = $i("i3GEOFexcluirarvoreLista").getElementsByTagName("input"),
	    n = camadas.length;
	    if(i3GEOF.excluirarvore.aguarde.visibility === "visible"){
		return;
	    }
	    i3GEOF.excluirarvore.aguarde.visibility = "visible";
	    while(n > 0){
		n -= 1;
		if(camadas[n].checked === true){
		    excluir.push(camadas[n].name);
		}
	    }
	    //obtem os possiveis nomes de grupos
	    $.each(excluir, function( index, name ) {
		var camada = i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[name];
		$.each(i3GEO.arvoreDeCamadas.CAMADAS, function( index, v ) {
		    if((camada.group != "" && camada.group == v.group) || camada.name == v.group){
			excluir.push(v.name);
		    }
		});
	    });

	    temp = function(){
		i3GEOF.excluirarvore.aguarde.visibility = "hidden";
		i3GEO.atualiza();

	    };
	    if(excluir.length > 0){
		i3GEO.php.excluitema(temp,excluir);
	    }
	    else{
		i3GEO.janela.tempoMsg($trad('selecionaCamada',i3GEOF.excluirarvore.dicionario));
		i3GEOF.excluirarvore.aguarde.visibility = "hidden";
	    }
	}
};
