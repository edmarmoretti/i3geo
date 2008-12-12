/**
Title: menususpenso.js

Monta o menu suspenso com as opções adicionais do i3geo.

O menu suspenso é criado utilizando-se a biblioteca YUI.

O conteúdo do menu é definido na variável oMenuData, veja configura.js

File: i3geo/classesjs/menususpenso.js


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
/*
Function: montaMenuSuspenso

Monta o menu baseado na variável oMenuData

Parameters:

iddiv - id do DIV que receberá o menu
*/
function montaMenuSuspenso(iddiv)
{ 
	if($i(iddiv))
	{
		$i(iddiv).className="yuimenubar";
		if(oMenuData.ajudas)
		{
			var ins = "";
			ins += '<div class="bd" style="align:right;border: 0px solid white;z-index:6000;line-height:1.4" >';
			ins += '<ul class="first-of-type" style="border:0px solid white;top:10px;">';
 			var sobe = "";
 			if(navn){var sobe = "line-height:0px;";}
 			if(objmapa.w >= 500)
 			{
				ins += '<li class="yuimenubaritem first-of-type" style="'+sobe+'float:left;border: 0px solid white;" >';
				ins += '&nbsp;<img  style="border: 1px solid white;padding:0 0px;top:-7px;" src="'+$im("branco.gif")+'" onclick="i3GEO.idioma.trocaIdioma(\'pt\')" id="brasil" alt="Portugues"/>';
				ins += '</li><li class="yuimenubaritem" style="'+sobe+'float:left;border: 1px solid white;" >&nbsp;<img  style="padding:0 0px;top:-7px;border: 0px solid white;padding-right:0px;" src="'+$im("branco.gif")+'" onclick="i3GEO.idioma.trocaIdioma(\'en\')" alt"Ingles" id="uk" />';
				ins += '</li><li class="yuimenubaritem" style="'+sobe+'float:left;border: 1px solid white;" >&nbsp;<img  style="padding:0 0px;top:-7px;border: 0px solid white;padding-right:0px;" src="'+$im("branco.gif")+'" onclick="i3GEO.idioma.trocaIdioma(\'es\')" id="espanhol" alt="Espanhol" />';
				ins += '</li><li class="yuimenubaritem" style="'+sobe+'float:left;border: 1px solid white;" >&nbsp;<img  style="padding:0 0px;top:-7px;border: 0px solid white;padding-right:0px;" src="'+$im("branco.gif")+'" onclick="i3GEO.idioma.trocaIdioma(\'it\')" id="italiano" alt="Italiano" />';
				ins += '</li>';
			}
			ins += '<li class="yuimenubaritem" style="padding-bottom:5px" ><a style="border: 0px solid white;" href="#" class="yuimenubaritemlabel" id="menuajuda" >&nbsp;&nbsp;'+$trad("s1")+'</a></li>';
			ins += '<li class="yuimenubaritem" style="padding-bottom:5px"><a style="border: 0px solid white;" href="#" class="yuimenubaritemlabel" id="menuanalise" >&nbsp;&nbsp;'+$trad("s2")+'</a></li>';
 			ins += '<li class="yuimenubaritem" style="padding-bottom:5px"><a style="border: 0px solid white;" href="#" class="yuimenubaritemlabel" id="menujanelas" >&nbsp;&nbsp;'+$trad("s3")+'</a></li>';
 			ins += '<li class="yuimenubaritem" style="padding-bottom:5px"><a style="border: 0px solid white;" href="#" class="yuimenubaritemlabel" id="menuarquivos" >&nbsp;&nbsp;'+$trad("s4")+'</a></li>';
 			ins += '</ul>'; 
 			ins += '</div>';
 			$i("menus").innerHTML=ins;
 		}
		function onMenuBarBeforeRender(p_sType, p_sArgs)
		{
			if(objmapa.w >= 500)
			{var conta = 4;}
			else
			{var conta = 0;}
			for(var nomeMenu in oMenuData)
			{
				var v="this.getItem("+conta+").cfg.setProperty('submenu',{id:'"+nomeMenu+"',itemdata: oMenuData['"+nomeMenu+"']})";
				eval(v);
				var conta=conta+1;
			}
		}
 		var oMenuBar=new YAHOO.widget.MenuBar(iddiv,{autosubmenudisplay: true, showdelay: 150, hidedelay: 250, lazyload: false});
 		oMenuBar.beforeRenderEvent.subscribe(onMenuBarBeforeRender);
 		oMenuBar.render();
		//
		//corrige problemas de estilo
		//
		var temp = $i("menus").style;
		temp.backgroundPosition = "0px -5px";
		temp.border = "0px solid white";
		var temp = $i(iddiv).style;
		temp.backgroundPosition = "0px -5px";
		temp.border = "0px solid white";
		if($i("contemMenu"))
		{
			$i("contemMenu").className="yui-navset";
		}
	}
}
function testamenususpenso(){}
