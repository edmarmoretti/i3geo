 YAHOO.example.onWindowLoadMenu=function(p_oEvent){ if($i("menus")){ if(oMenuData.ajudas){ var ins='<div class="bd" >'; ins+='<ul class="first-of-type" style="text-align:center;">'; ins+='<li class="yuimenubaritem">Ajuda?</li>'; ins+='<li class="yuimenubaritem">An&aacute;lise</li>'; if(!$i("listaPropriedades")){ins+='<li class="yuimenubaritem">Propriedades</li>';}
 ins+='<li class="yuimenubaritem">Janelas</li>'; ins+='<li class="yuimenubaritem">Arquivo</li>'; ins+='</ul>'; ins+='<a href=http://mapas.mma.gov.br target+blank ><p style=text-align:left;><img id=banneri3geo src=\'http://mapas.mma.gov.br/i3geo/imagens/banneri3geo.png\'/></a>'; ins+='</div>'; $i("menus").innerHTML=ins;}}
 else{return;}
 function hideSubmenus(){ if(oMenuBar.activeItem){ var oSubmenu=oMenuBar.activeItem.cfg.getProperty("submenu"); if(oSubmenu){oSubmenu.hide();}}}
 function cancelTimer(){ if(nTimeoutId){window.clearTimeout(nTimeoutId);}}
 function onSubmenuMouseOut(p_sType, p_aArguments, p_oMenu){ cancelTimer(); nTimeoutId=window.setTimeout(hideSubmenus, 750);}
 function onMenuBarItemMouseOver(p_sType, p_aArguments, p_oMenuItem){ var oActiveItem=this.parent.activeItem; if(oActiveItem && oActiveItem !=this){ this.parent.clearActiveItem();}
 this.cfg.setProperty("selected", true); this.focus(); var oSubmenu=this.cfg.getProperty("submenu"); if(oSubmenu){ oSubmenu.show();}}
 function onMenuBarItemMouseOut(p_sType, p_aArguments, p_oMenuItem){ this.cfg.setProperty("selected", false); var oSubmenu=this.cfg.getProperty("submenu"); if(oSubmenu){ var oDOMEvent=p_aArguments[0], oRelatedTarget=YAHOO.util.Event.getRelatedTarget(oDOMEvent); if(
 !(
 oRelatedTarget==oSubmenu.element || this._oDom.isAncestor(oSubmenu.element, oRelatedTarget))){ oSubmenu.hide();}}}
 function onMenuBeforeShow(p_sType, p_sArgs){ if(this.getItemGroups().length==0){ var aItemsData=this.itemsData, nItems=aItemsData.length, oItemData, oItemConfig, oSubmenu; for(var i=0;i<nItems;i++){ oItemData=aItemsData[i]; if(oItemData){ oItemConfig={}; if(oItemData.url){ oItemConfig.url=oItemData.url;}
 if(oItemData.submenuItems){ oSubmenu=new YAHOO.widget.Menu(oItemData.submenuId); oSubmenu.itemsData=oItemData.submenuItems; oSubmenu.beforeShowEvent.subscribe(onMenuBeforeShow, oSubmenu, true); oSubmenu.mouseOverEvent.subscribe(cancelTimer); oSubmenu.mouseOutEvent.subscribe(onSubmenuMouseOut, oSubmenu, true); oItemConfig.submenu=oSubmenu;}
 this.addItem(new YAHOO.widget.MenuItem(oItemData.text, oItemConfig));}}
 this.render(this.parent.element);}}
 var nTimeoutId; var oMenuBar=new YAHOO.widget.MenuBar("menus"); for(nomeMenu in oMenuData){eval("var "+nomeMenu+"=new YAHOO.widget.Menu('"+nomeMenu+"')");}
 for(nomeMenu in oMenuData){eval(nomeMenu+".itemsData=oMenuData['"+nomeMenu+"']");}
 oMenuBar.mouseOverEvent.subscribe(cancelTimer); for(nomeMenu in oMenuData){eval(nomeMenu+".beforeShowEvent.subscribe(onMenuBeforeShow, "+nomeMenu+", true)");}
 for(nomeMenu in oMenuData){eval(nomeMenu+".mouseOverEvent.subscribe(cancelTimer)");}
 for(nomeMenu in oMenuData){eval(nomeMenu+".mouseOutEvent.subscribe(onSubmenuMouseOut, "+nomeMenu+", true)");}
 var conta=0; for(nomeMenu in oMenuData){ eval("oMenuBar.getItem("+conta+").cfg.setProperty('submenu',"+nomeMenu+")"); conta=conta+1;}
 YAHOO.util.Event.addListener(document, "click", hideSubmenus); var aMenuBarItems=oMenuBar.getItemGroups()[0], oMenuItem, i=aMenuBarItems.length-1; do{ oMenuItem=aMenuBarItems[i]; oMenuItem.mouseOverEvent.subscribe(onMenuBarItemMouseOver, oMenuItem, true); oMenuItem.mouseOutEvent.subscribe(onMenuBarItemMouseOut, oMenuItem, true);}
 while(i--); oMenuBar.render();};function testamenususpenso(){}
