g_movedoca = 0;
wd = 0;
novoel = document.createElement("div");
novoel.id = "wdoca";
novoel.style.zIndex = "5000";
novoel.style.left = "0px";
novoel.innerHTML = '<table><tr><td width=100% title="click para mover" class="tdclara" style="background-color:gray;cursor:move;" onmouseup="javascript:g_movedoca=0" onmousedown="javascript:if (g_movedoca==1){g_movedoca=0} else{wd = x;g_movedoca=1};movewdocaf()"><span  style="background-color:gray" ></span><span style="color:white" id=textowdoca ></span></tr><tr><td valign="top" ><iframe name=wdocai id=wdocai  valign="top" ></iframe></td></tr></table><div id=wdocadiv ></div>';
document.body.appendChild(novoel);

//var g_sid=window.opener.parent.g_sid;

var mapaEl = document.getElementById("mapa");
mapaEl.textContent = "";
var mapaImg = document.createElement("img");
mapaImg.src = window.opener.parent.document.getElementById("img").src;
mapaEl.appendChild(mapaImg);
document.getElementById("legenda").innerHTML = window.opener.g_legendaHTML;
document.getElementById("escalanumerica").innerHTML = "1: " + window.opener.parent.i3GEO.parametros.mapscale;


function processevent1(exy1) {
	x = exy1.clientX;
	y = exy1.clientY;
	if (document.getElementById("wdoca")) { if (g_movedoca == 1) { movewdocaf(); } }
}
function movewdocaf() {
	var owdoca = document.getElementById("wdoca");
	if (x == wd) { wd = wd - parseInt(owdoca.style.left); }
	owdoca.style.top = y - 10 + "px";
	owdoca.style.left = x - wd + "px";
}
function wdocaf(wlargura, waltura, wsrc, nx, ny, texto) {
	var wdocaStyle = document.getElementById("wdoca").style;
	wdocaStyle.display = "block";
	wdocaStyle.width = wlargura;
	wdocaStyle.height = waltura;
	if (nx != "") {
		if (ny < 15) { ny = 15; }
		wdocaStyle.top = ny;
		wdocaStyle.left = nx;
	}
	if (wsrc != "") {
		var wdocaiStyle = document.getElementById("wdocai").style;
		wdocaiStyle.width = wlargura;
		wdocaiStyle.height = waltura;
		wdocaiStyle.display = "block";
		document.getElementById("wdocai").src = wsrc;
		document.getElementById("wdocadiv").style.display = "none";
	}
	else {
		document.getElementById("wdocai").style.display = "none";
		var wdocadivStyle = document.getElementById("wdocadiv").style;
		wdocadivStyle.display = "block";
		wdocadivStyle.width = wlargura;
		wdocadivStyle.height = waltura;
	}
	if (texto != "") { document.getElementById("textowdoca").innerHTML = '&nbsp;' + texto; }
}
wdocaf("400px", "350px", "propriedades.htm", "", "", "&nbsp;");
