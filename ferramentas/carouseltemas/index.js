/*
Title: Carrosel de temas

Apresenta uma lista de temas que podem ser adicionados ao mapa em um layout do tipo 'carrousel'.
S&atilde;o mostradas as imagens miniatura dos temas, que devem estar armazenadas em i3geo/temas/miniaturas.
As miniaturas podem ser geradas com geraminiaturas.php.

Veja:

<i3GEO.arvoreDeTemas.dialogo.carouselTemas>

Arquivo:

i3geo/ferramentas/carrouseltemas/index.js.php

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
Class: i3GEOF.carouseltemas
*/
i3GEOF.carouseltemas = {
	/*
	Propriedade: numVisible

	N&uacute;mero de imagens vis&iacute;veis
	*/
	numVisible: 3,
	/*
	Propriedade: incluiAmpliacao

	Inclui ou n&atilde;o a imagem ampliada ao passar o mouse sobre a miniatura
	*/
	incluiAmpliacao: true,
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.carouseltemas.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.carouseltemas.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/carouseltemas/dicionario.js",
				"i3GEOF.carouseltemas.iniciaJanelaFlutuante()",
				"i3GEOF.carouseltemas.dicionario_script"
			);
		}
		else{
			i3GEOF.carouseltemas.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML = i3GEOF.carouseltemas.html();
			var listaimg = function(retorno){
				var ins = "<ol>",
					ngrupos,
					nsub,
					ntemas,
					i,
					j,
					k,
					grupo,
					sub,
					tema,
					min,
					max;
				if(retorno.data == undefined)
				{return;}
				ngrupos = retorno.data.length;
				for(i=0;i<ngrupos;i++){
					grupo = retorno.data[i];
					ntemasg = grupo.temas.length;
					for(k=0;k<ntemasg;k++){
						tema = grupo.temas[k];
						if(tema.miniatura.toLowerCase() === "sim"){
							min = i3GEO.configura.locaplic+"/temas/miniaturas/"+tema.tid+".map.mini.png";
							max = i3GEO.configura.locaplic+"/temas/miniaturas/"+tema.tid+".map.grande.png";
							ins += "<li><img onmouseover='i3GEOF.carouseltemas.amplia(\""+max+"\")' onclick='i3GEOF.carouseltemas.insereTema(\""+tema.tid+"\")' title='"+tema.nome+"' src='"+min+"' ></li>";
						}
					}
					nsub = grupo.subgrupos.length;
					for(j=0;j<nsub;j++){
						sub = grupo.subgrupos[j];
						ntemas = sub.temas.length;
						for(k=0;k<ntemas;k++){
							tema = sub.temas[k];
							if(tema.miniatura.toLowerCase() === "sim"){
								min = i3GEO.configura.locaplic+"/temas/miniaturas/"+tema.tid+".map.mini.png";
								max = i3GEO.configura.locaplic+"/temas/miniaturas/"+tema.tid+".map.grande.png";
								ins += "<li><img onmouseover='i3GEOF.carouseltemas.amplia(\""+max+"\")' onclick='i3GEOF.carouseltemas.insereTema(\""+tema.tid+"\")' title='"+tema.nome+"' src='"+min+"' ></li>";
							}
						}
					}
				}
				$i("i3GEOcarouseltemasImagens").innerHTML = ins+"</ol>";
				var carousel = new YAHOO.widget.Carousel("i3GEOcarouseltemasImagens");
				carousel.STRINGS.PAGER_PREFIX_TEXT = "";
				carousel.set("numVisible",i3GEOF.carouseltemas.numVisible);
				carousel.render();
				carousel.show();
			};
			i3GEO.php.procurartemas2(listaimg,"");
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
		var ins = "<div id=i3GEOcarouseltemasImagens ></div><p class=paragrafo style='width:180px' >"+$trad('adicionaTema',i3GEOF.carouseltemas.dicionario);
		if(i3GEOF.carouseltemas.incluiAmpliacao === true)
		{ins += "<div style='text-align:left;' id=i3GEOcarouseltemasImagemmaior ></div>";}
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.carouseltemas");
		};
		//cria a janela flutuante
		titulo = $trad('miniaturas',i3GEOF.carouseltemas.dicionario)+"<a class=ajuda_usuario href='javascript:void(0)' onclick='i3GEO.ajuda.ferramenta(85)' ><b> </b></a>";
		janela = i3GEO.janela.cria(
			"210px",
			"380px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.carouseltemas",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.carouseltemas_corpo").style.backgroundColor = "white";
		$i("i3GEOF.carouseltemas_corpo").style.textAlign = "left";
		i3GEOF.carouseltemas.aguarde = $i("i3GEOF.carouseltemas_imagemCabecalho").style;
		i3GEOF.carouseltemas.inicia(divid);
	},
	/*
	Function: insereTema

	Insere no mapa o tema escolhido

	Veja:

	<adtema>
	*/
	insereTema: function(codigotema){
		i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
		temp = function(retorno){
			i3GEO.janela.fechaAguarde("i3GEO.atualiza");
			if(retorno.data.erro){
				i3GEO.janela.tempoMsg(retorno.data.erro);
				return;
			}
			i3GEO.atualiza();
		};
		i3GEO.php.adtema(temp,codigotema);
	},
	/*
	Function: amplia

	Mostra a imagem ampliada
	*/
	amplia: function(imagem){
		if($i("i3GEOcarouseltemasImagemmaior"))
		{$i("i3GEOcarouseltemasImagemmaior").innerHTML = "<img width='180px' src='"+imagem+"' />";}
	}
};
