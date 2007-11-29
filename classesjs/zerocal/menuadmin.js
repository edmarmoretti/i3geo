//yui

           YAHOO.example.onWindowLoad = function(p_oEvent) {
    
                // Hides submenus of the root Menubar instance
                
                function hideSubmenus() {

                    if(oMenuBar.activeItem) {
                    
                        var oSubmenu = oMenuBar.activeItem.cfg.getProperty("submenu");

                        if(oSubmenu) {
                        
                            oSubmenu.hide();
                        
                        }
                    
                    }

                }    


                // Cancels the call to "hideSubmenus"

                function cancelTimer() {

                    if(nTimeoutId) {
    
                        window.clearTimeout(nTimeoutId);
    
                    }
                
                }
    
    
                // "mouseout" event handler for each submenu of the menubar
                
                function onSubmenuMouseOut(p_sType, p_aArguments, p_oMenu) {
    
                    cancelTimer();
    
                    nTimeoutId = window.setTimeout(hideSubmenus, 750);
                
                }
    
    
                // "mouseover" handler for each item in the menubar
    
                function onMenuBarItemMouseOver(p_sType, p_aArguments, p_oMenuItem) {
                
                	var oActiveItem = this.parent.activeItem;
                
                
                    // Hide any other submenus that might be visible
                
                    if(oActiveItem && oActiveItem != this) {
                
                        this.parent.clearActiveItem();
                
                    }
                
                
                    // Select and focus the current MenuItem instance
                
                    this.cfg.setProperty("selected", true);
                    this.focus();
                
                
                    // Show the submenu for this instance
                
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

                    // Check if the menu has any items. If not, add them
                    
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
    
                                // Add the new YAHOO.widget.MenuItem instance to the Menu
    
                                this.addItem(new YAHOO.widget.MenuItem(oItemData.text, oItemConfig));

                            }

                        }


                        // Render the submenu into its parent MenuItem instance's element

                        this.render(this.parent.element);
                        
                    }
                
                }


                var nTimeoutId;


                /*
                     Use a JSON-formatted data structure to define the data for 
                     the submenus of the menubar
                */

                var oMenuData = {
                    "admin": [ 
                    
                        { text: "MapFile", url: "javascript:adminMapFile()" }
                        
                    
                    ]

                };


                // Initialize the root menubar

                var oMenuBar = new YAHOO.widget.MenuBar("menus");


                // Initialize the submenus of the items in the root menubar

                var oadmin = new YAHOO.widget.Menu("admin");


                /*
                     Add a property ("itemsData") to each submenu that 
                     is reference to the data for its items.
                     This data will be used in the "beforeshow" handler to add
                     the items to each submenu before it is displayed.
                */

                oadmin.itemsData = oMenuData["admin"];


                // Assign event handlers

                // Add a "mouseover" handler to the menubar

                oMenuBar.mouseOverEvent.subscribe(cancelTimer);


                // Add a "beforeshow" event handler to each submenu
                oadmin.beforeShowEvent.subscribe(onMenuBeforeShow, oadmin, true);


                // Add a "mouseover" event handler to each submenu

                oadmin.mouseOverEvent.subscribe(cancelTimer);


                // Add a "mouseout" event handler to each submenu

                oadmin.mouseOutEvent.subscribe(onSubmenuMouseOut, oadmin, true);


                // Add the submenus to the items in the menubar 

                oMenuBar.getItem(0).cfg.setProperty("submenu", oadmin);


                // Add a "click" handler to the document

                YAHOO.util.Event.addListener(document, "click", hideSubmenus);


                /*
                    Add a "mouseover" and "mouseout" event handler each item 
                    in the menubar 
                */               

                var aMenuBarItems = oMenuBar.getItemGroups()[0],
                    oMenuItem,
                    i = aMenuBarItems.length - 1;

                do {

                    oMenuItem = aMenuBarItems[i];

                    oMenuItem.mouseOverEvent.subscribe(onMenuBarItemMouseOver, oMenuItem, true);
                    oMenuItem.mouseOutEvent.subscribe(onMenuBarItemMouseOut, oMenuItem, true);
                
                }
                while(i--);


                // Render the menubar

                oMenuBar.render();
                
            }

YAHOO.util.Event.addListener(window, "load", YAHOO.example.onWindowLoad);
//testa se esse script foi carregado
function testamenususpenso()
{}