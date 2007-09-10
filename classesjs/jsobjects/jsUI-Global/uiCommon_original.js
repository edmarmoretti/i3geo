window.onclick = jsUIGblRecordClick;
if (window.captureEvents) window.captureEvents(Event.CLICK);

document.onkeydown = jsUIGblHandleKeys;
if (window.captureEvents) window.captureEvents(Event.KEYPRESS);

function jsUIGblAddSkin(component, skinName, rootDir)
{
	if (skinName == null || skinName == "")
		skinName = "default";
	
	var newStyle = document.createElement("link");
	newStyle.rel = "stylesheet";
	newStyle.type = "text/css";
	
	if (component == null || component == "")
		newStyle.href = rootDir + "/" + skinName + ".css";
	else
		newStyle.href = rootDir + "/" + component + "/" + skinName + ".css";
	document.body.appendChild(newStyle);
	return true;
}

//window.attachEvent("onkeypress", "jsUIGblHandleKeys");
function jsUIGblHandleKeys(e)
{
	var keyCode;
	if (browser == "IE")
	{
		obj = window.event.srcElement;
		e = window.event;
		keyCode = e.keyCode;
	}
	if (browser == "MOZ")
	{
		obj = e.target;
		if (e.target.tagName.toUpperCase() == "HTML")
		    obj = jsUIGblLastClickedElement;
		keyCode = e.which;
	}
	
	//check for a grid
	var gridAt = "";
	try
	{
	    if (obj.tagName.toUpperCase() == "DIV")
	    {
		    if (obj.parentNode.tagName == "TD")
		    {
                if (obj.parentNode.className == "GridCell" || obj.parentNode.className == "GridCellOver")
		            gridAt = obj.parentNode;
		    }
	    }
	    if (obj.tagName.toUpperCase() == "TD")
	    {
		    if (obj.className == "GridCell" || obj.className == "GridTitleCell")
		        gridAt = obj.parentNode;
	    }
	}
	catch(e)
	{
	
	}
	
	//we're in a grid
	if (gridAt != "")   
	{
	    var currGrid = GridPvtFindRootObject(gridAt);
	    if (keyCode==46)  //delete
	    {
	        currGrid.removeRow(currGrid.currentRow, e);
		}
		else if (keyCode == 38) //up  
	        currGrid.moveRow(currGrid.currentRow, "up");
		else if (keyCode == 40) //down
	        currGrid.moveRow(currGrid.currentRow, "down");		
		else    //all other keys
		    currGrid.editRow(currGrid.currentRow, e);
	}
	
	//not in a grid
	else
	{
	    if (keyCode==13)  //return
	    {
		    if (obj.tagName.toUpperCase() != "TEXTAREA" && browser == "IE")
			    e.keyCode=9;
	    }
	    if (keyCode==8)   //backspace
	    {
		    if (obj.tagName.toUpperCase() != "TEXTAREA" && obj.tagName.toUpperCase() != "INPUT")
		    {
		        if (browser == "IE")
		            e.returnValue = false;
	            if (browser == "MOZ")
	            {
		            e.stopPropagation();
		            e.preventDefault();
	            }
		    }
	    }
	}	

	if (keyCode==116) //F5
	{
		if (browser == "IE")
		{
		    e.keyCode = 0;
		    e.returnValue = false;
		}
	    if (browser == "MOZ")
	    {
		    e.stopPropagation();
		    e.preventDefault();
	    }
	    try
	    {
	        var updateObj = new Object();
			updateObj.sender = "AppCentral";
			updateObj.itemID = "resetPage";
			appcentral.update(updateObj);
	    }
	    catch(e)
	    {
	        //do nothing
	    }
	    return false;
	}
	    
	if (e.altKey) 
	{
		if (keyCode>=65 && keyCode<=90) 
		{ 
			var s = String.fromCharCode(keyCode);
			eval('(window.k'+s+')?eval(\'k\'+s+\'.click();\'):eval();'); 
		} 
	}
}

var jsUIGblLastClickedElement;
function jsUIGblRecordClick(e)
{
    //if (browser == "MOZ")
    if (browser == "IE")
	{
		obj = window.event.srcElement;
		e = window.event;
	}
	if (browser == "MOZ")
	{
		obj = e.target;
	}
    jsUIGblLastClickedElement = obj.target;
}   