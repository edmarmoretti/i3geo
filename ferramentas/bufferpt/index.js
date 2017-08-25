/*
Title: Buffer em um ponto

Arquivo:

i3geo/ferramentas/bufferpt/index.js.php

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
Classe: i3GEOF.bufferpt

Cria um novo tema com um pol&iacute;gono de entorno para uma determinada coordenada enviada como par&acirc;metro

*/
i3GEOF.bufferpt = {
	/*
	Propriedade: x

	Coordenada x (longitude) do ponto
	*/
	x: 0,
	/*
	Propriedade: y

	Coordenada y (latitude) do ponto
	*/
	y: 0,
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.bufferpt.dicionario);
		dicionario["x"] = i3GEOF.bufferpt.x;
		dicionario["y"] = i3GEOF.bufferpt.y;
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.bufferpt.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/bufferpt/template_mst.html", function(template) {
				i3GEOF.bufferpt.MUSTACHE = template;
				i3GEOF.bufferpt.inicia(iddiv);
			});
			return;
		}
		$i(iddiv).innerHTML = i3GEOF.bufferpt.html();
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(idjanela) {
		var ins = Mustache.render(i3GEOF.bufferpt.MUSTACHE, i3GEOF.bufferpt.mustacheHash(idjanela));
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

	Os par&acirc;metros x e y s&atilde;o utilizados para a defini&ccedil;&atilde;o das propriedades i3GEOF.bufferpt.x e i3GEOF.bufferpt.y. Se n&atilde;o forem fornecidos,
	seus valores permanecer&atilde;o como 0. Essas propriedades podem tamb&eacute;m ser definidas pela fun&ccedil;&atilde;o que ativou a ferramenta.

	Parametros:

	x {dd} - coordenada x (longitude)

	y {dd} - coordenada y (latitude)
	*/
	iniciaJanelaFlutuante: function(x,y){
		var janela,divid,titulo,cabecalho,minimiza;
		if($i("i3GEOF.bufferpt")){
			return;
		}
		if(x){
			i3GEOF.bufferpt.x = x;
		}
		if(y){
			i3GEOF.bufferpt.y = y;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.bufferpt");
		};
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("u10") + "</span></div>";
		janela = i3GEO.janela.cria(
			"290px",
			"230px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.bufferpt",
			false,
			"hd",
			cabecalho,
			"",
			"",
			true,
			"",
			"",
			"",
			""
		);
		divid = janela[2].id;
		i3GEOF.bufferpt.aguarde = $i("i3GEOF.bufferpt_imagemCabecalho").style;
		i3GEOF.bufferpt.inicia(divid);
	},
	/*
	Function: executa

	Altera o tamanho do mapa

	Veja:

	<MUDATAMANHO>
	*/
	executa: function(){
		try{
			if(i3GEOF.bufferpt.aguarde.visibility === "visible")
			{return;}
			var distancia = $i("i3GEOFbufferptDistancia").value,
				p,
				fim,
				cp;
			if (distancia*1 !== 0)
			{
				i3GEOF.bufferpt.aguarde.visibility = "visible";
				fim = function(retorno){
					i3GEOF.bufferpt.aguarde.visibility = "hidden";
					if (retorno.data === undefined )
					{i3GEO.janela.tempoMsg($trad('erroTempo',i3GEOF.bufferpt.dicionario));}
					else
					{i3GEO.atualiza();}
				};
				p = i3GEO.configura.locaplic+"/ferramentas/buffer/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=criabuffer&tema=&distancia="+distancia+"&unir=nao&wkt=POINT("+i3GEOF.bufferpt.x+" "+i3GEOF.bufferpt.y+")";
				cp = new cpaint();
				cp.set_response_type("JSON");
				cp.call(p,"criaBuffer",fim);
			}
			else
			{i3GEO.janela.tempoMsg($trad('erroDistancia',i3GEOF.bufferpt.dicionario));}
		}
		catch(e){$i("i3GEObufferfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.bufferpt.aguarde.visibility = "hidden";}
	}
};
