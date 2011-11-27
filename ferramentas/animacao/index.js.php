<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Animação

Liga e desliga temas em uma sequência temporizada

Veja:

<i3GEO.mapa.dialogo.animacao>

Arquivo:

i3geo/ferramentas/animacao/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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
Classe: i3GEOF.animacao
*/
i3GEOF.animacao = {
	/*
	Variavel: aguarde
	
	Estilo do objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
	*/
	aguarde: "",
	tempo: 1000,
	/*
	Function: inicia
	
	Inicia a ferramenta. É chamado por criaJanelaFlutuante
	
	Parametro:
	
	iddiv {String} - id do div que receberá o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		i3GEOF.animacao.aguarde.visibility = "visible";
		$i(iddiv).innerHTML = i3GEOF.animacao.html();
		i3GEO.util.mensagemAjuda("i3GEOanimacaomen1",$i("i3GEOanimacaomen1").innerHTML);
		i3GEOF.animacao.aguarde.visibility = "hidden";
	},
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta
	
	Retorno:
	
	String com o código html
	*/
	html:function(){
		var camadas = i3GEO.arvoreDeCamadas.CAMADAS,
			n = camadas.length,
			temp,
			ins = "";
			
		ins += "" +
			"<div style='text-align:center;position:relative;cursor:pointer'  >" +
			"	<img title='inicia' src='"+i3GEO.configura.locaplic+"/imagens/player_inicia.png' onclick='i3GEOF.animacao.dispara()' />&nbsp;" +
			"	<img title='rebobina' src='"+i3GEO.configura.locaplic+"/imagens/player_para.png' onclick='i3GEOF.animacao.termina()' />&nbsp;" +
			"	<img title='mais rapido' src='"+i3GEO.configura.locaplic+"/imagens/player_avanca.png' onclick='i3GEOF.animacao.maisrapido()' />&nbsp;" +
			"	<img title='mais lento' src='"+i3GEO.configura.locaplic+"/imagens/player_volta.png' onclick='i3GEOF.animacao.maislento()' />&nbsp;" +
			"</div>" +			
			"<table id='i3GEOFanimacaoLista' style='width:95%' class='lista8'>";
		while(n > 0){
			n -= 1;
			if(camadas[n].tema !== "")
			{ins += "<tr><td><input class=inputsb style='cursor:pointer' type=checkbox value='"+camadas[n].name+"' /></td><td><span style=background:white id='i3GEOanima"+camadas[n].name+"'>"+camadas[n].tema+"</span></td></tr>";}
		}
		ins += "</table><br>" +
			'	<div id=i3GEOanimacaomen1 style="display:block;left:0px;">' +
			'		<p class=paragrafo >Marque as camadas que serão incluídas na animação e depois clique no botão "inicia"</p>' +
			'	</div>';		
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var janela,divid,temp,titulo,cabecalho,minimiza;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.animacao");
		};
		//cria a janela flutuante
		titulo = "Anima&ccedil;&atilde;o <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=107' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"210px",
			"80px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.animacao",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.animacao_corpo").style.backgroundColor = "white";
		$i("i3GEOF.animacao_corpo").style.textAlign = "left";
		i3GEOF.animacao.aguarde = $i("i3GEOF.animacao_imagemCabecalho").style;
		i3GEOF.animacao.inicia(divid);
		temp = function(){
			i3GEOF.animacao.termina();
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);		
	},
	codigos: [],
	/*
	Function: anima
	
	Inicia a animação
	
	*/
	dispara: function(){
		if(i3GEOF.animacao.aguarde.visibility === "visible")
		{return;}
		var codigos = i3GEOF.animacao.obtemTemasAnima(),
			n = codigos.length,
			i,
			t,
			layer;
		i3GEOF.animacao.codigos = codigos;
		i3GEOF.animacao.contador = 0;
		i3GEOF.animacao.aguarde.visibility = "visible";
		i3GEOF.animacao.desligaTodos(codigos);
		i3GEOF.animacao.retornaCoresInicial();
		i3GEOF.animacao.anima(i3GEOF.animacao.codigos.length - 1);
	},
	maisrapido: function(){
		i3GEOF.animacao.tempo -= 100;
	},
	maislento: function(){
		i3GEOF.animacao.tempo += 100;
	},	
	anima: function(c){
		if(i3GEOF.animacao.codigos.length === 0)
		{return;}
		//console.warn(c);
		if(c < 0){
			i3GEOF.animacao.termina();
			i3GEOF.animacao.dispara();
		}
		else{
			$i("i3GEOanima"+i3GEOF.animacao.codigos[c]).style.backgroundColor = "yellow";
			i3GEOF.animacao.ligaDesliga(i3GEOF.animacao.codigos[c],'troca');
			setTimeout("i3GEOF.animacao.anima("+(c - 1)+");",i3GEOF.animacao.tempo);
		}
	},
	desligaTodos: function(codigos){
		var n = codigos.length;
		while(n > 0){
			n -= 1;
			i3GEOF.animacao.ligaDesliga(codigos[n],"desliga");
		}
	},
	ligaDesliga: function(codigoTema,tipo){
		var layer,estilo;
		switch(i3GEO.Interface.ATUAL){
			case "openlayers":
				layer = i3geoOL.getLayersByName(codigoTema)[0];
				if(tipo === "troca")
				{layer.setVisibility(!layer.getVisibility());}
				if(tipo === "liga")
				{layer.setVisibility(true);}
				if(tipo === "desliga")
				{layer.setVisibility(false);}
				break;
			case "googlemaps":
				layer = i3GEO.Interface.googlemaps.retornaDivLayer(codigoTema);
				if(!layer){return;}
				estilo = layer.style.visibility;
				if(tipo === "troca"){
					if(estilo === "visible" || estilo === "")
					{layer.style.visibility = "hidden";}
					else
					{layer.style.visibility = "visible";}
				}
				if(tipo === "liga")
				{layer.style.visibility = "visible";}
				if(tipo === "desliga")
				{layer.style.visibility = "hidden";}
				break;				
		};	
	},
	termina: function(){
		i3GEOF.animacao.codigos = [];
		i3GEOF.animacao.aguarde.visibility = "hidden";
		i3GEOF.animacao.retornaStatusInicial();
	},
	obtemTemasAnima: function(){
		var temp = [],
			cs = $i("i3GEOFanimacaoLista").getElementsByTagName("input"),
			n = cs.length;
		while(n > 0){
			n -= 1;
			if(cs[n].checked === true)
			{temp.push(cs[n].value);}
		}
		return temp;
	},
	retornaStatusInicial: function(){
		if($i("i3GEOFanimacaoLista")){
			i3GEOF.animacao.retornaCoresInicial();
			var temas = i3GEO.arvoreDeCamadas.filtraCamadas("status",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS),
				n = temas.length;
			while(n > 0){
				n -= 1;
				i3GEOF.animacao.ligaDesliga(temas[n].name,"liga");
			}
			temas = i3GEO.arvoreDeCamadas.filtraCamadas("status",2,"diferente",i3GEO.arvoreDeCamadas.CAMADAS);
			n = temas.length;
			while(n > 0){
				n -= 1;
				i3GEOF.animacao.ligaDesliga(temas[n].name,"desliga");
			}			
		}
	},
	retornaCoresInicial: function(){
		var temp = [],
			cs = $i("i3GEOFanimacaoLista").getElementsByTagName("input"),
			n = cs.length;
		while(n > 0){
			n -= 1;
			$i("i3GEOanima"+cs[n].value).style.backgroundColor = "white";
		}		
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>