<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Mostra extensão

Mostra a extensão geográfica atual do mapa permitindo também alterá-la digitando-se os valores de lat e long

Veja:

<i3GEO.mapa.dialogo.mostraExten>

Arquivo:

i3geo/ferramentas/mostraexten/index.js.php

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	i3GEOF = [];
}
/*
Classe: i3GEOF.mostraExten
*/
i3GEOF.mostraExten = {
	/*
	Variavel: aguarde
	
	Estilo do objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
	*/
	aguarde: "",
	/*
	Function: inicia
	
	Inicia a ferramenta. É chamado por criaJanelaFlutuante
	
	Parametro:
	
	iddiv {String} - id do div que receberá o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.mostraExten.html();
			new YAHOO.widget.Button(
				"i3GEOmostraExtenbotao1",
				{onclick:{fn: i3GEOF.mostraExten.executa}}
			);
			i3GEOF.mostraExten.ativaFoco();
		}
		catch(erro){alert(erro);}
	},
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta
	
	Retorno:
	
	String com o código html
	*/
	html:function(){
		var ins = '<p class="paragrafo" >Extens&atilde;o geográfica atual, em d&eacute;cimos de grau. As coordenadas correspondem a menor longitude, menor latitude, maior longitude e maior latitude:</p>' +
		'<textarea id=i3GEOmostraExtenatual rows=3 cols=50 onclick="javascript:this.select();"></textarea>' +
		'<p class="paragrafo" >	Digite as coordenadas referentes a nova extensão geográfica desejada para o mapa. Utilize coordenadas (graus) negativos para indicar a longitude como oeste e latitude como sul:</p>' +
		'	<table class=lista3 >' +
		'		<tr><td>Menor longitude (oeste):</td>' +
		'		<td>' +
		$inputText("","","i3GEOmostraExtenxg","",3,"-00") +
		$inputText("","","i3GEOmostraExtenxm","",3,"00") +
		$inputText("","","i3GEOmostraExtenxs","",3,"0.0") +
		'		</td></tr>' +
		'		<tr><td>Menor latitude (sul):</td>' +
		'		<td>' +
		$inputText("","","i3GEOmostraExtenyg","",3,"-00") +
		$inputText("","","i3GEOmostraExtenym","",3,"00") +
		$inputText("","","i3GEOmostraExtenys","",3,"0.0") +		
		'		</td></tr>' +
		'		<tr><td>Maior longitude (leste):</td>' +
		'		<td>' +
		$inputText("","","i3GEOmostraExtenxxg","",3,"-00") +
		$inputText("","","i3GEOmostraExtenxxm","",3,"00") +
		$inputText("","","i3GEOmostraExtenxxs","",3,"0.0") +
		'		</td></tr>' +
		'		<tr><td>Maior latitude (norte):</td>' +
		'		<td>' +
		$inputText("","","i3GEOmostraExtenyyg","",3,"-00") +
		$inputText("","","i3GEOmostraExtenyym","",3,"00") +
		$inputText("","","i3GEOmostraExtenyys","",3,"0.0") +
		'		</td></tr></table>' +
		'<br><p class="paragrafo" ><input id=i3GEOmostraExtenbotao1 type="button" size=14 value="Aplicar a nova extensão"  /></p>';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var janela,divid,temp,titulo,cabecalho,minimiza;
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.mostraExten.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.mostraExten");
		};
		titulo = "Extensão geográfica <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=7&idajuda=55' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"370px",
			"320px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.mostraExten",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.mostraExten_corpo").style.backgroundColor = "white";
		$i("i3GEOF.mostraExten_corpo").style.textAlign = "left";
		i3GEOF.mostraExten.aguarde = $i("i3GEOF.mostraExten_imagemCabecalho").style;
		i3GEOF.mostraExten.inicia(divid);
		if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEOF.mostraExten.ativaFoco()") < 0)
		{i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.mostraExten.ativaFoco()");}
		temp = function(){
			i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.mostraExten.ativaFoco()");
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);				
	},
	/*
	Function: ativaFoco
	
	Função que é disparada quando o usuário clica no cabeçalho da ferramenta
	*/
	ativaFoco: function(){
		$i("i3GEOmostraExtenatual").innerHTML = i3GEO.parametros.mapexten;
		var i = $i("i3GEOF.mostraExten_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 10000 + i3GEO.janela.ULTIMOZINDEX;
	},
	/*
	Function: executa
	
	Altera a extensão atual
	
	Veja:
	
	<i3GEO.navega.zoomExt>
	*/
	executa: function(){
		try{
			var x = i3GEO.calculo.dms2dd($i("i3GEOmostraExtenxg").value,$i("i3GEOmostraExtenxm").value,$i("i3GEOmostraExtenxs").value);
			var xx = i3GEO.calculo.dms2dd($i("i3GEOmostraExtenxxg").value,$i("i3GEOmostraExtenxxm").value,$i("i3GEOmostraExtenxxs").value);
			var y = i3GEO.calculo.dms2dd($i("i3GEOmostraExtenyg").value,$i("i3GEOmostraExtenym").value,$i("i3GEOmostraExtenys").value);
			var yy = i3GEO.calculo.dms2dd($i("i3GEOmostraExtenyyg").value,$i("i3GEOmostraExtenyym").value,$i("i3GEOmostraExtenyys").value);
			if ((x == xx) || (y == yy))
			{alert("Digite coordenadas válidas");return;}
			if ((x > xx) || (y > yy))
			{alert("Digite coordenadas válidas");return;}
			i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,window.parent.i3GEO.parametros.tipoimagem,(x+" "+y+" "+xx+" "+yy))
		}
		catch(e){alert(e+" Erro. Digite coordenadas válidas");}
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>