g_movedoca = 0;
wd = 0;
novoel = document.createElement("div");
novoel.id = "wdoca";
novoel.style.zIndex = "5000";
novoel.style.left="0px";
novoel.innerHTML = '<table><tr><td width=100% title="click para mover" class="tdclara" style="background-color:gray;cursor:move;" onmouseup="javascript:g_movedoca=0" onmousedown="javascript:if (g_movedoca==1){g_movedoca=0} else{wd = x;g_movedoca=1};movewdocaf()"><span  style="background-color:gray" ></span><span style="color:white" id=textowdoca ></span></tr><tr><td valign="top" ><iframe name=wdocai id=wdocai  valign="top" ></iframe></td></tr></table><div id=wdocadiv ></div>';
document.body.appendChild(novoel);

//var g_sid=window.opener.parent.g_sid;

document.getElementById("mapa").innerHTML = "<img src="+window.opener.parent.document.getElementById("img").src+" />";
document.getElementById("legenda").innerHTML = window.opener.g_legendaHTML;
document.getElementById("escalanumerica").innerHTML = "1: "+window.opener.parent.i3GEO.parametros.mapscale;


function processevent1(exy1)
{
	//detecao do navegador
	navm = false; // IE
	navn = false; // netscape
	var app = navigator.appName.substring(0,1);
	if (app=='N') navn=true; else navm=true;
	if (navn)
	{
		x = exy1.clientX;
		y = exy1.clientY;
	}
	if (navm)
	{
		x = window.event.clientX;
		y = window.event.clientY;
	}
	if (document.getElementById("wdoca")){if (g_movedoca == 1){movewdocaf();}}
}
function movewdocaf()
{
	var owdoca = document.getElementById("wdoca");
	if (navn)
	{
		if (x == wd)
		{wd = wd - parseInt(owdoca.style.left);}
		with(owdoca.style){top = y - 10 + "px";left = x - wd + "px";}
	}
	if (navm)
	{
		if (x == wd)
		{wd = wd - owdoca.style.pixelLeft;}
		with(owdoca.style){pixelLeft = x - wd;pixelTop = y - 10;}
	}
}
function wdocaf(wlargura,waltura,wsrc,nx,ny,texto)
{
	with (document.getElementById("wdoca").style){display = "block";width = wlargura;height = waltura;}
	if (nx != "")
	{
		if (ny < 15){ny = 15;}
		with (document.getElementById("wdoca").style){top = ny;left = nx;}
	}
	if (wsrc != "")
	{
		with (document.getElementById("wdocai").style){width = wlargura;height = waltura;display="block";}
		document.getElementById("wdocai").src = wsrc;
		document.getElementById("wdocadiv").style.display="none";
	}
	else
	{
		document.getElementById("wdocai").style.display="none";
		with (document.getElementById("wdocadiv").style){display="block";width = wlargura;height = waltura;}
	}
	if (texto != "")
	{document.getElementById("textowdoca").innerHTML = '&nbsp;'+texto;}
}
wdocaf("400px","350px","propriedades.htm","","","&nbsp;");