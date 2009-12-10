<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
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
Class: i3GEOF.wiki

Busca na Wikipédia artigos relacionados à extensão geográfica do mapa atual.
*/
i3GEOF.wiki = {
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
			$i(iddiv).innerHTML += i3GEOF.wiki.html();
			i3GEOF.wiki.ativaFoco();
			if(i3GEO.Interface.ATUAL === "padrao"){
				i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.wiki.lista()");
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
   				wikiDragend = GEvent.addListener(i3GeoMap, "dragend", function() {i3GEOF.wiki.lista();});
   				wikiZoomend = GEvent.addListener(i3GeoMap, "zoomend", function() {i3GEOF.wiki.lista();});						
			}
			if(i3GEO.Interface.ATUAL === "openlayers"){
   				i3geoOL.events.register("moveend",i3geoOL,function(e){i3GEOF.wiki.lista();});
			}			
			i3GEOF.wiki.lista();
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
		var ins = '';
		ins += '<div id=i3GEOwikiLista style=display:block;background-color:white;text-align:left; ></div>';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//funcao que sera executada ao ser clicado no cabeçalho da janela
		cabecalho = function(){
			i3GEOF.wiki.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.wiki");
		};
		//cria a janela flutuante
		titulo = "Wikip&eacute;dia <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=8&idajuda=73' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"250px",
			"190px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.wiki",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.wiki.aguarde = $i("i3GEOF.wiki_imagemCabecalho").style;
		i3GEOF.wiki.inicia(divid);
		temp = function(){
			if(i3GEO.Interface.ATUAL === "padrao"){
				i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.wiki.lista()");
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				GEvent.removeListener(wikiDragend);
				GEvent.removeListener(wikiZoomend);
			}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);		
	},
	/*
	Function: ativaFoco
	
	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		g_operacao = "navega";
		var i = $i("i3GEOF.wiki_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 10000 + i3GEO.janela.ULTIMOZINDEX;
	},
	/*
	Function: lista
	
	Lista os artigos
	*/
	lista: function(){
		if(i3GEOF.wiki.aguarde.visibility === "visible")
		{return;}
		i3GEOF.wiki.aguarde.visibility = "visible";
		var mostrar,p,cp;
		mostrar = function(retorno){
			i3GEOF.wiki.aguarde.visibility = "hidden";
			if (retorno.data === 'undefined' ){
				$i("i3GEOwikiLista").innerHTML = "Erro. A operação demorou muito.";
				return;
			}
			$i("i3GEOwikiLista").innerHTML = retorno.data+"Navegue no mapa para atualizar a lista de resultados";
		};
		cp = new cpaint();
		cp.set_response_type("JSON");
		if(i3GEO.parametros.mapexten)
		{ext = i3GEO.parametros.mapexten;}
		else
		{ext = "-49.1774741355 -16.379556709 -47.2737662565 -14.9806872512";} //apenas para exemplo
		p = i3GEO.configura.locaplic+"/ferramentas/wiki/funcoes.php?funcao=listaartigos&ret="+ext;
		cp.call(p,"listaartigos",mostrar);
		
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>
/*
parametrosURL()
if(window.parent.i3GEO.parametros.mapscale > 500001){
	var ins = "<p>A busca &eacute; feita apenas para a regi&atilde;o de abrang&ecirc;ncia do mapa atual, cuja escala deve estar em pelo menos 1:500.000."
	ins += "<p>A restrição de escala é necessária para melhorar a performance da busca."
	ins += "<p>O mapa atual está fora do limite de escala (1:500.000)."
	ins += "<p><input id=ajustaEscala size=20  type=button value='Ajustar' />"
	$i("resultadowiki").innerHTML = ins;
}
else{
	if(window.parent.wikiAtivo == false){
		var ins = "<p>A busca no Mediawiki traz apenas os 20 primeiros resultados"
		ins += '<p>Mais detalhes sobre a busca, veja <a href="http://www.geonames.org" >Geonames</a>'
		ins += "<p><input id=continuar size=20  type=button value='Continuar' />"
		$i("resultadowiki").innerHTML = ins;
	}
	else{buscawiki();}
}
if($i("ajustaEscala")){
	new YAHOO.widget.Button("ajustaEscala",{onclick:{fn: function(){
		window.parent.i3GEO.parametros.mapscale=500000;
		window.parent.i3GEO.navega.aplicaEscala(window.parent.i3GEO.configura.locaplic,window.parent.i3GEO.configura.sid,500000)
	}}});
}
if($i("continuar")){
	new YAHOO.widget.Button("continuar",{onclick:{fn: function(){
		buscawiki()
	}}});
}

function listaartigos(retorno)
{
}
*/