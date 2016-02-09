/*
Title: Op&ccedil;&otilde;es de labels

Abre uma janela flutuante que permite definir as propriedades de elementos do tipo texto (LABELS)

Arquivo:

i3geo/ferramentas/opcoes_label/index.js.php

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
Classe: i3GEOF.proplabel
*/
i3GEOF.proplabel = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(conector){
		i3GEOF.proplabel.iniciaDicionario(conector);
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(conector){
		if(typeof(i3GEOF.proplabel.dicionario) === 'undefined'){
			var temp = function(){
				i3GEOF.proplabel.iniciaJanelaFlutuante(conector);
			};
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/opcoes_label/dicionario.js",
				temp,
				"i3GEOF.proplabel.dicionario_script"
			);
		}
		else{
			i3GEOF.proplabel.iniciaJanelaFlutuante(conector);
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv,conector){
		$i(iddiv).innerHTML += i3GEOF.proplabel.html(conector);
		i3GEO.util.aplicaAquarela("i3GEOF.proplabel_corpo");
		i3GEO.util.comboFontes("i3GEOproplabelListaFonte","i3GEOproplabelDivListaFonte");
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Parametros:

	conector - {boolean} insere ou n&atilde;o as op&ccedil;&otilde;es de conector de textos

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(conector){
		var ins = '<div style="padding-left:5px;">' +
		'<p class="paragrafo">' + $trad('fonte',i3GEOF.proplabel.dicionario) + ":</p>" +
		'<div class="styled-select" id="i3GEOproplabelDivListaFonte">' +
		$trad('msgAguarde',i3GEOF.proplabel.dicionario) +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('tamanho',i3GEOF.proplabel.dicionario)+':</p>' +
		'<div class="i3geoForm i3geoFormIconeNumero" >' +
		'<input type="number" value="8" id="i3GEOproplabeltamanho_i" />' +
		'</div>';

		if(conector === true){
			ins += '<br><p class="paragrafo">'+$trad('larguraConector',i3GEOF.proplabel.dicionario)+':</p>' +
			'<div class="i3geoForm i3geoFormIconeNumero" >' +
			'<input type="number" value="2" id="i3GEOproplabeltamanho_c" />' +
			'</div>' +
			'<br><p class="paragrafo">'+$trad('corConector',i3GEOF.proplabel.dicionario)+':</p>' +
			'<div class="i3geoForm100 i3geoFormIconeAquarela" >' +
			'<input type="text" value="0 0 0" id="i3GEOproplabelfrente_c" />' +
			'</div>';
		}
		ins += '<br><p class="paragrafo">'+$trad('angulo',i3GEOF.proplabel.dicionario)+':</p>' +
		'<div class="i3geoForm i3geoFormIconeNumero" >' +
		'<input type="number" value="0" id="i3GEOproplabelangulo_i" />' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('deslocamento',i3GEOF.proplabel.dicionario)+' X:</p>' +
		'<div class="i3geoForm i3geoFormIconeNumero" >' +
		'<input type="number" value="0" id="i3GEOproplabeloffsetx_i" />' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('deslocamento',i3GEOF.proplabel.dicionario)+' Y:</p>' +
		'<div class="i3geoForm i3geoFormIconeNumero" >' +
		'<input type="number" value="0" id="i3GEOproplabeloffsety_i" />' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('corTexto',i3GEOF.proplabel.dicionario)+':</p>' +
		'<div class="i3geoForm100 i3geoFormIconeAquarela">' +
		'<input type="text" value="0 0 0" id="i3GEOproplabelfrente_i" />' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('corMascara',i3GEOF.proplabel.dicionario)+':</p>' +
		'<div class="i3geoForm100 i3geoFormIconeAquarela" >' +
		'<input type="text" value="" id="i3GEOproplabelmascara_i" />' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('posicionamento',i3GEOF.proplabel.dicionario)+':</p>' +
		'<div class="styled-select" >' +
		'	<select id=i3GEOproplabelposition_i >' +
		'		<option value="MS_AUTO" >'+$trad('automatico',i3GEOF.proplabel.dicionario)+'</option>' +
		'		<option value="MS_UL" >'+$trad('superiorEsquerdo',i3GEOF.proplabel.dicionario)+'</option>' +
		'		<option value="MS_UC" >'+$trad('superiorCentro',i3GEOF.proplabel.dicionario)+'</option>' +
		'		<option value="MS_UR" selected >'+$trad('superiorDireito',i3GEOF.proplabel.dicionario)+'</option>' +
		'		<option value="MS_CL" >'+$trad('centroEsquerdo',i3GEOF.proplabel.dicionario)+'</option>' +
		'		<option value="MS_CC" >'+$trad('centro',i3GEOF.proplabel.dicionario)+'</option>' +
		'		<option value="MS_CR" >'+$trad('centroDireito',i3GEOF.proplabel.dicionario)+'</option>' +
		'		<option value="MS_LL" >'+$trad('inferiorEsquerdo',i3GEOF.proplabel.dicionario)+'</option>' +
		'		<option value="MS_LC" >'+$trad('inferiorCentro',i3GEOF.proplabel.dicionario)+' inferior centro</option>' +
		'		<option value="MS_LR" >'+$trad('inferiorDireito',i3GEOF.proplabel.dicionario)+' inferior direito</option>' +
		'	</select>' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('corFundo',i3GEOF.proplabel.dicionario)+':</p>' +
		'<div class="i3geoForm100 i3geoFormIconeAquarela" >' +
		'<input type="text" value="" id="i3GEOproplabelfundoc_i" />' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('corSombraFundo',i3GEOF.proplabel.dicionario)+':</p>' +
		'<div class="i3geoForm100 i3geoFormIconeAquarela" >' +
		'<input type="text" value="" id="i3GEOproplabelsombra_i" />' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('deslocamentoSombraFundo',i3GEOF.proplabel.dicionario)+' X:</p>' +
		'<div class="i3geoForm i3geoFormIconeNumero" >' +
		'<input type="number" value="1" id="i3GEOproplabelsombrax_i" />' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('deslocamentoSombraFundo',i3GEOF.proplabel.dicionario)+' Y:</p>' +
		'<div class="i3geoForm i3geoFormIconeNumero" >' +
		'<input type="number" value="1" id="i3GEOproplabelsombray_i" />' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('corTextoFundo',i3GEOF.proplabel.dicionario)+':</p>' +
		'<div class="i3geoForm100 i3geoFormIconeAquarela" >' +
		'<input type="text" value="" id="i3GEOproplabelfrentes_i" />' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('deslocamentoTextoFundo',i3GEOF.proplabel.dicionario)+' X:</p>' +
		'<div class="i3geoForm i3geoFormIconeNumero" >' +
		'<input type="number" value="1" id="i3GEOproplabelfrentex_i" />' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('deslocamentoTextoFundo',i3GEOF.proplabel.dicionario)+' Y:</p>' +
		'<div class="i3geoForm i3geoFormIconeNumero" >' +
		'<input type="number" value="1" id="i3GEOproplabelfrentey_i" />' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('forcaColisaoTexto',i3GEOF.proplabel.dicionario)+':</p>' +
		'<div class="styled-select" >' +
		'	<select id=i3GEOproplabelforce_i >' +
		'		<option value="0" >'+$trad("x15")+'</option>' +
		'		<option value="1" >'+$trad("x14")+'</option>' +
		'	</select>' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('distanciaMinimaTextos',i3GEOF.proplabel.dicionario)+':</p>' +
		'<div class="i3geoForm i3geoFormIconeEdita" >' +
		'<input type="text" value="auto" id="i3GEOproplabelmindistance_i" />' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('tamanhoMinimoElemento',i3GEOF.proplabel.dicionario)+':</p>' +
		'<div class="i3geoForm i3geoFormIconeEdita" >' +
		'<input type="text" value="auto" id="i3GEOproplabelminfeaturesize_i" />' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('textoUltrapassaMapa',i3GEOF.proplabel.dicionario)+':</p>' +
		'<div class="styled-select" >' +
		'	<select id=i3GEOproplabelpartials_i >' +
		'		<option value="1" >'+$trad("x14")+'</option>' +
		'		<option value="0" >'+$trad("x15")+'</option>' +
		'	</select>' +
		'</div>' +

		'<br><p class="paragrafo">'+$trad('caracterQuebraTexto',i3GEOF.proplabel.dicionario)+':</p>' +
		'<div class="i3geoForm i3geoFormIconeEdita" >' +
		'<input type="text" value="" id="i3GEOproplabelwrap_i" />' +
		'</div></div><br><br>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(conector){
		var minimiza,cabecalho,janela,divid,titulo;
		if ($i("i3GEOF.proplabel")) {
			return;
		}
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.proplabel.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.proplabel");
		};
		titulo = "<div class='i3GeoTituloJanela'>" + $trad('propriedadesTexto',i3GEOF.proplabel.dicionario) + "</div>";
		janela = i3GEO.janela.cria(
			"360px",
			"230px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.proplabel",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.proplabel.aguarde = $i("i3GEOF.proplabel_imagemCabecalho").style;
		$i("i3GEOF.proplabel_corpo").style.backgroundColor = "white";
		i3GEOF.proplabel.inicia(divid,conector);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
	},
	/*
	Function: corj

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: pegaPar

	Pega os parametros para montar a chamada ajax que cria ou testa a topon&iacute;mia
	*/
	pegaPar: function(){
		if($i("i3GEOproplabelfundoc_i").value === "")
		{$i("i3GEOproplabelfundoc_i").value = "off";}
		if($i("i3GEOproplabelsombra_i").value === "")
		{$i("i3GEOproplabelsombra_i").value = "off";}
		if($i("i3GEOproplabelmascara_i").value === "")
		{$i("i3GEOproplabelmascara_i").value = "off";}
		if($i("i3GEOproplabelfrentes_i").value === "")
		{$i("i3GEOproplabelfrentes_i").value = "off";}
		var par = "&position="+$i("i3GEOproplabelposition_i").value +
			"&partials="+$i("i3GEOproplabelpartials_i").value+
			"&offsetx="+$i("i3GEOproplabeloffsetx_i").value+
			"&offsety="+$i("i3GEOproplabeloffsety_i").value+
			"&minfeaturesize="+$i("i3GEOproplabelminfeaturesize_i").value+
			"&mindistance="+$i("i3GEOproplabelmindistance_i").value+
			"&force="+$i("i3GEOproplabelforce_i").value+
			"&shadowsizex="+$i("i3GEOproplabelfrentex_i").value+
			"&shadowsizey="+$i("i3GEOproplabelfrentey_i").value+
			"&cor="+$i("i3GEOproplabelfrente_i").value+
			"&sombray="+$i("i3GEOproplabelsombray_i").value+
			"&sombrax="+$i("i3GEOproplabelsombrax_i").value+
			"&angulo="+$i("i3GEOproplabelangulo_i").value+
			"&tamanho="+$i("i3GEOproplabeltamanho_i").value+
			"&fonte="+$i("i3GEOproplabelListaFonte").value+
			"&fundo="+$i("i3GEOproplabelfundoc_i").value+
			"&sombra="+$i("i3GEOproplabelsombra_i").value+
			"&outlinecolor="+$i("i3GEOproplabelmascara_i").value+
			"&shadowcolor="+$i("i3GEOproplabelfrentes_i").value+
			"&wrap="+$i("i3GEOproplabelwrap_i").value;
		return par;
	}
};