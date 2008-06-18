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
		$i(iddiv).className="yuimenubar yuimenubarnav";

		if(oMenuData.ajudas)
		{
			var ins='<div class="bd" style="z-index:2000;" >';
			ins += '<ul class="first-of-type">';
			ins += '<li class="yuimenubaritemlabel"><a id="menuajuda" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+$trad("s1")+'</a></li>';
			ins += '<li class="yuimenubaritemlabel"><a id="menuanalise" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+$trad("s2")+'</a></li>';
 			ins += '<li class="yuimenubaritemlabel"><a id="menujanelas" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+$trad("s3")+'</a></li>';
 			ins += '<li class="yuimenubaritemlabel"><a id="menuarquivos" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+$trad("s4")+'</a></li>';
 			if(objmapa.w >= 500)
			ins += '<img src="'+$im("branco.gif")+'" onclick="trocalingua(\'pt\')" id="brasil" />&nbsp;<img src="'+$im("branco.gif")+'" onclick="trocalingua(\'en\')" id="uk" />&nbsp;<img src="'+$im("branco.gif")+'" onclick="trocalingua(\'es\')" id="espanhol" />';
 			ins += '</ul>'; 
 			ins+='</div>';
 			$i("menus").innerHTML=ins;
 		}
		function onMenuBarBeforeRender(p_sType, p_sArgs)
		{
			var conta=0;
			for(var nomeMenu in oMenuData)
			{
				var v="this.getItem("+conta+").cfg.setProperty('submenu',{id:'"+nomeMenu+"',itemdata: oMenuData['"+nomeMenu+"']})";
				eval(v);
				var conta=conta+1;
			}
		}
	}
	else{return;}
 	var oMenuBar=new YAHOO.widget.MenuBar(iddiv,{autosubmenudisplay: true, showdelay: 250, hidedelay: 750, lazyload: true});
 	oMenuBar.beforeRenderEvent.subscribe(onMenuBarBeforeRender);
 	oMenuBar.render();
}
function testamenususpenso(){}
