/*
Class: i3GEO.ajuda

Manipulação das janelas de ajuda e outras coisas relacionadas.

Permite definir a mensagem padrão da janela de mensagens. Abria a janela e definir seu conteúdo.

File: i3geo/classesjs/classe_ajuda.js

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
if(typeof(i3GEO) == 'undefined'){
	i3GEO = new Array();
}
i3GEO.ajuda = {
	/*
	Property: MENSAGEMPADRAO
	
	Mensagem que será incluída ao iniciar a janela de mensagens.
	
	Default ""
	
	Type:
	{String}
	*/
	MENSAGEMPADRAO: "",
	/*
	Property: ATIVAJANELA
	
	Define se a janela de mensagens pode ou não ser aberta.
	
	Default true
	
	Type:
	{Boolean}
	*/
	ATIVAJANELA: true,
	/*
	Property: DIVAJUDA
	
	Nome do elemento HTML do tipo DIV que irá conter os textos de ajuda.
	
	Se esse DIV for encontrado no mapa, os textos serão mostrados em seu interior.
	
	Default "i3geo_ajuda"
	
	Type:
	{String}
	*/
	DIVAJUDA: "i3geo_ajuda",
	
	mostraTip: function(){
	},
	/*
	Function: mostraJanela
	
	Mostra um texto dentro da janela de mensagens
	
	Parameters:
	
	texto {String} - tetxo a ser incluído
	*/
	mostraJanela: function(texto){
		if ($i(i3GEO.ajuda.DIVAJUDA)){
			if (texto == ""){$i(i3GEO.ajuda.DIVAJUDA).innerHTML="-";}
			else
			{$i(i3GEO.ajuda.DIVAJUDA).innerHTML= texto;}
		}
		else{
			if ($i("janelaMenTexto"))
			{$i("janelaMenTexto").innerHTML= texto;}
		}
	},
	/*
	Function: abreJanela
	
	Abre a janela flutuante para mostrar as mensagens de ajuda.
	
	*/
	abreJanela: function(){
		try	{
			if(i3GEO.ajuda.ATIVAJANELA == false){return;}
			if (!$i("janelaMenTexto")){
				var nx = "";
				var ny = "";
				if($i("img")){
					var pos = YAHOO.util.Dom.getXY($i("img"));
					var nx = pos[0] - 267;
					var ny = objmapa.h - 70;
				}
				var texto = '<div id="janelaMenTexto" style="text-align:left;font-size:10px;color:rgb(170,170,170)">'+i3GEO.ajuda.MENSAGEMPADRAO+'</div>';
				var janela = i3GEO.janela.cria("266","auto","",nx,ny,"&nbsp;","i3geo_janelaMensagens",false);
				janela[2].innerHTML = texto;
				YAHOO.util.Event.addListener(janela[0].close, "click", i3GEO.ajuda.fechaJanela);
				i3GEO.ajuda.ativaCookie();
			}
		}
		catch(e){}
	},
	/*
	Function: fechaJanela
	
	Fecha a janela de ajuda.
	*/
	fechaJanela: function(){
		i3GEO.ajuda.desativaCookie();
		document.body.removeChild($i("i3geo_janelaMensagens_c"));
	},
	/*
	Function: ativaCookie
	
	Ativa o cookie g_janelaMen e inclui o valor "sim".
	
	Ativando-se o cookie, a janela de mensagens será aberta automaticamente a próxima vez que o i3geo for iniciado
	*/
	ativaCookie: function(){
		i3GEO.util.insereCookie("g_janelaMen","sim");
	},
	/*
	Function: desativaCookie
	
	Desativa o cookie g_janelaMen.

	Desativando-se o cookie, a janela de mensagens não será aberta automaticamente a próxima vez que o i3geo for iniciado
	*/
	desativaCookie: function(){
		i3GEO.util.insereCookie("g_janelaMen","nao");
	},
	reposicionaJanela: function(){
	}
};
//
//para efeitos de compatibilidade
//
if(i3GEO.ajuda.MENSAGEMPADRAO == ""){
	try {
		if (g_mensagempadrao != "")	
		{i3GEO.ajuda.MENSAGEMPADRAO = g_mensagempadrao;}
		else
		i3GEO.ajuda.MENSAGEMPADRAO = $trad("p1");
	}
	catch(e){i3GEO.ajuda.MENSAGEMPADRAO = $trad("p1");}
}
