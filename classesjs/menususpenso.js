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
Function: YAHOO.example.onWindowLoadMenu

Monta o menu baseado na variável oMenuData
*/
           YAHOO.example.onWindowLoadMenu = function(p_oEvent) {

				if ($i("menus"))
				{
				    //
				    //monta o html para receber o menu
				    //
				    if(oMenuData.ajudas)
				    {
				    	var ins = '<div class="bd" >';
						ins += '<ul class="first-of-type" style="text-align:center;">';
						ins += '<li class="yuimenubaritem">Ajuda?</li>';
						ins += '<li class="yuimenubaritem">An&aacute;lise</li>';
						if (!$i("listaPropriedades"))
						{ins += '<li class="yuimenubaritem">Propriedades</li>';}
						ins += '<li class="yuimenubaritem">Janelas</li>';
						ins += '<li class="yuimenubaritem">Arquivo</li>';
						ins += '</ul>';
						ins += '<a href=http://mapas.mma.gov.br target+blank ><p style=text-align:left; ><img id=banneri3geo src=\'http://mapas.mma.gov.br/i3geo/imagens/banneri3geo.png\' /></a>';
						ins += '</div>';
						$i("menus").innerHTML = ins;
					}
				}
				else
				{return;}
                function hideSubmenus() {
                    if(oMenuBar.activeItem) {
                        var oSubmenu = oMenuBar.activeItem.cfg.getProperty("submenu");
                        if(oSubmenu) {oSubmenu.hide();}
                    }
                }    
                // Cancels the call to "hideSubmenus"
                function cancelTimer() {
                    if(nTimeoutId) {window.clearTimeout(nTimeoutId);}
                }
                // "mouseout" event handler for each submenu of the menubar
                function onSubmenuMouseOut(p_sType, p_aArguments, p_oMenu) {
                    cancelTimer();
                    nTimeoutId = window.setTimeout(hideSubmenus, 750);
                }
                // "mouseover" handler for each item in the menubar
                function onMenuBarItemMouseOver(p_sType, p_aArguments, p_oMenuItem) {
                	var oActiveItem = this.parent.activeItem;
                    if(oActiveItem && oActiveItem != this) {
                        this.parent.clearActiveItem();
                    }
                    this.cfg.setProperty("selected", true);
                    this.focus();
                    var oSubmenu = this.cfg.getProperty("submenu");
                    if(oSubmenu) {
                        oSubmenu.show();
                    }
                }
                // "mouseout" handler for each item in the menubar
                function onMenuBarItemMouseOut(p_sType, p_aArguments, p_oMenuItem) {
                    this.cfg.setProperty("selected", false);
                    var oSubmenu = this.cfg.getProperty("submenu");
                    if(oSubmenu) {
                        var oDOMEvent = p_aArguments[0],
                            oRelatedTarget = YAHOO.util.Event.getRelatedTarget(oDOMEvent);
                        if(
                            !(
                                oRelatedTarget == oSubmenu.element || 
                                this._oDom.isAncestor(oSubmenu.element, oRelatedTarget)
                            )
                        ) {
                            oSubmenu.hide();
                        }
                    }
                }
                // "beforeshow" handler for each submenu of the menubar
                function onMenuBeforeShow(p_sType, p_sArgs) {
                    if(this.getItemGroups().length == 0) {
                        var aItemsData = this.itemsData,
                            nItems = aItemsData.length,
                            oItemData,
                            oItemConfig,
                            oSubmenu;
                        for(var i=0; i<nItems; i++) {
                            oItemData = aItemsData[i];
                            if(oItemData) {
                                oItemConfig = {};
                                if(oItemData.url) {
                                    oItemConfig.url = oItemData.url;
                                }
                                if(oItemData.submenuItems) {
                                    oSubmenu = new YAHOO.widget.Menu(oItemData.submenuId);
                                    oSubmenu.itemsData = oItemData.submenuItems;
                                    oSubmenu.beforeShowEvent.subscribe(onMenuBeforeShow, oSubmenu, true);
                                    oSubmenu.mouseOverEvent.subscribe(cancelTimer);
                                    oSubmenu.mouseOutEvent.subscribe(onSubmenuMouseOut, oSubmenu, true);
                                    oItemConfig.submenu = oSubmenu;
                                }
                                this.addItem(new YAHOO.widget.MenuItem(oItemData.text, oItemConfig));
                            }
                        }
                        this.render(this.parent.element);
                    }
                }
                var nTimeoutId;

                var oMenuBar = new YAHOO.widget.MenuBar("menus");
                for(nomeMenu in oMenuData)
                {eval("var " + nomeMenu + "= new YAHOO.widget.Menu('"+nomeMenu+"')");}
                for(nomeMenu in oMenuData)
                {eval(nomeMenu+".itemsData = oMenuData['"+nomeMenu+"']");}
                oMenuBar.mouseOverEvent.subscribe(cancelTimer);
                for(nomeMenu in oMenuData)
                {eval(nomeMenu+".beforeShowEvent.subscribe(onMenuBeforeShow, "+nomeMenu+", true)");}
                for(nomeMenu in oMenuData)
                {eval(nomeMenu+".mouseOverEvent.subscribe(cancelTimer)");}
                for(nomeMenu in oMenuData)
                {eval(nomeMenu+".mouseOutEvent.subscribe(onSubmenuMouseOut, "+nomeMenu+", true)");}
                var conta = 0;
                for(nomeMenu in oMenuData)
                {
                	eval("oMenuBar.getItem("+conta+").cfg.setProperty('submenu',"+nomeMenu+")");
                	conta = conta + 1;
                }
                YAHOO.util.Event.addListener(document, "click", hideSubmenus);
                var aMenuBarItems = oMenuBar.getItemGroups()[0],
                    oMenuItem,
                    i = aMenuBarItems.length - 1;
                do {
                    oMenuItem = aMenuBarItems[i];
                    oMenuItem.mouseOverEvent.subscribe(onMenuBarItemMouseOver, oMenuItem, true);
                    oMenuItem.mouseOutEvent.subscribe(onMenuBarItemMouseOut, oMenuItem, true);
                }
                while(i--);
                oMenuBar.render();
            };
//testa se esse script foi carregado
function testamenususpenso()
{}