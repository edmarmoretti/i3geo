/*
Title: Menu suspenso

Monta o menu suspenso.

File: menususpenso.js


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

			ins += '<li class="yuimenubaritemlabel"><a class="yuimenubaritemlabel" ><img style="width:12px;height:12px;"src="'+g_locaplic+'/imagens/visual/default/chat_icon_01.png"/>'+$trad("s1")+'</a></li>';
			ins += '<li class="yuimenubaritemlabel"><a><img style="width:12px;height:12px;"src="'+g_locaplic+'/imagens/visual/default/grey_wheel_cedric_bosdon_01.png"/>'+$trad("s2")+'</a></li>';
			if(!$i("listaPropriedades"))
			{
				ins += '<li class="yuimenubaritemlabel"><a>'+$trad("s5")+'</a></li>';
			}
 			ins += '<li class="yuimenubaritemlabel"><a><img style="width:12px;height:12px;"src="'+g_locaplic+'/imagens/visual/default/gthumb.png"/>'+$trad("s3")+'</a></li>';
 			ins += '<li class="yuimenubaritemlabel"><a><img style="width:12px;height:12px;"src="'+g_locaplic+'/imagens/visual/default/bb_dsk_.png"/>'+$trad("s4")+'</a></li>';
			ins += '<img onclick="trocalingua(\'pt\')" style="width:20px;height:10px;"src="'+g_locaplic+'/imagens/brazil.png"/>&nbsp;<img onclick="trocalingua(\'en\')" style="width:20px;height:10px;"src="'+g_locaplic+'/imagens/united_kingdom.png"/>';
 			ins += '</ul>'; ins+='</div>'; $i("menus").innerHTML=ins;
 		}
		function onMenuBarBeforeRender(p_sType, p_sArgs)
		{
			var conta=0;
			for(nomeMenu in oMenuData)
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
