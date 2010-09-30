<?php
include("../../ms_configura.php");
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$url = $protocolo[0]."://".$_SERVER['HTTP_HOST']."/".basename($locaplic)."/admin/hiperbolica.php";
$i3geo = $protocolo[0]."://".$_SERVER['HTTP_HOST']."/".basename($locaplic);
?>
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<title>Arvore Hiperbolica</title>
</head>
<STYLE TYPE="text/css">
table {
    width:100%;
    text-align: left;
}

body,ul,td {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
}
th {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 13px;
}

a:link {font-family: Arial, Helvetica, sans-serif;	font-size: 12px; font-style: normal; color: #005151;text-decoration: none;}
div#divArvore {
	position:absolute;
	left:0px;
	top:0px;
	width:1024px;
	height: 450px;
	overflow:auto;
}
</STYLE>
<script type="text/javascript" src="../../admin/js/core.js"></script>
<STYLE>
.yui-skin-sam .yui-panel-container.shadow .underlay {
background-color:#000000;
bottom:0;
left:0;
opacity:0.12;
position:absolute;
right:25px;
top:0;
}
.yui-skin-sam .yui-panel .bd{
border: 1px solid black;
}
</STYLE>
<body leftmargin="0" topmargin="0" class=" yui-skin-sam">
		<applet style=z-index:0;" code="tree.HTApplet.class" archive="tree4.jar" width="100%" height="100%" MAYSCRIPT="true">
		    <param name="htfile"  value="">
		    <param name="xmlfile" value="<?php echo $url;?>">
		    <param name="xmltipo" value="verbete">
		    <param name="htbackcoloredit" value="0xFF00FF">
		    <param name="htbackcolor" value="0xFFFFFF">
		    <param name="htlinkcolor" value="0x000000">
		    <param name="htsearchcolor" value="0xFF0000">
		    <param name="hthintcolor"  value="0xFFFFD9">
		    <param name="colornode" value="0xFFFACD">
		    <param name="colortextnode" value="0x000000">
		    <param name="colorrelationnode" value="0xE6E6FA">
		    <param name="colortextrelationnode" value="0x00FF00">
		    <param name="htbordertype" value="rounded">
		    <param name="htfont" value="arial" >
		    <param name="htfontsize" value="11">
		    <param name="htopenwindow" value="self"> 
   		    <param name="funcaoJS" value="SelecionaTema"> 
		</applet> 
<script>
YAHOO.namespace("example.container");
function SelecionaTema(id) {
   var myString = new String(id);
   var myarray = myString.split(',');
   
	if(myarray[0] == "tema")
	{
		core_montaEditor("","320px","500px")
		var imagemsrc = "<?php echo $i3geo;?>/testamapfile.php?map="+myarray[1]+".map&tipo=grande"
		var ins = "<img src='"+imagemsrc+"' /><br>"
		ins += '<input type=button id=fechar value="Fechar" style="left:-5px;" />'
		ins += '<input type=button id=i3geo value="i3Geo" style="left:-5px;" />'
		ins += '<input type=button id=mais value="Mais..." style="left:-5px;" />'
		//$i("editor_bd").style.height="550px";
		$i("editor_bd").innerHTML = ins
		var fechar = function()
		{
			YAHOO.example.container.panelEditor.destroy();
			YAHOO.example.container.panelEditor = null;			
		}
		var i3geo = function()
		{
			window.open("<?php echo $i3geo;?>/ms_criamapa.php?temasa="+myarray[1]+"&layers="+myarray[1])
		}
		var mais = function()
		{
			window.open("<?php echo $i3geo;?>/admin/abrefontemapfile.php?tema="+myarray[1])
		}
		var adiciona = new YAHOO.widget.Button("fechar",{ onclick: { fn: fechar } });
		var adiciona = new YAHOO.widget.Button("i3geo",{ onclick: { fn: i3geo } });
		var adiciona = new YAHOO.widget.Button("mais",{ onclick: { fn: mais } });
		$i("janela_editor_c").style.paddingRight = "1px"
		if(!document.all)
		$i("janela_editor_c").style.overflow = "auto"
		var temp = function(e)
		{e.style.display="none";}
		YAHOO.util.Dom.getElementsByClassName("container-close","span","janela_editor_c",temp)
	}
	if(myarray[0] == "tag")
	{
		var sUrl = "<?php echo $i3geo;?>/admin/php/menutemas.php?funcao=pegaTagsPorMapfile&tag="+removeAcentos(myarray[1])
		core_pegaDados("",sUrl,"listaTemasPorTag")
	}
	if(myarray[0] == "GEORSS" || myarray[0] == "DOWNLOAD" || myarray[0] == "WS")
	{window.open(myarray[1])}
	if(myarray[0] == "WMS")
	{window.open(myarray[1]+"&service=wms&request=getcapabilities")}

}
function listaTemasPorTag(dados)
{
	var ins = "Os seguintes temas contém o TAG clicado:<br><br>";
	ins += '<input type=button id=fechar value="Fechar" style="left:-5px;" /><br>'

	for (i=0;i < dados.length; i++)
	{
		ins += "<p>"+dados[i].nome
		var url = "<?php echo $i3geo;?>/ms_criamapa.php?temasa="+dados[i].codigoMap+"&layers="+dados[i].codigoMap
		ins += "<a href='"+url+"' target=_blank > mapa </a>"
		if(dados[i].link != "")
		ins += "<a href='"+dados[i].link+"' target=_blank > fonte </a>"
		ins += "</p>"
	}
	core_montaEditor("","350px","500px")
	$i("janela_editor_c").style.paddingRight = "1px"
	if(!document.all)
	$i("janela_editor_c").style.overflow = "auto"
	$i("editor_bd").innerHTML = ins
	var fechar = function()
	{
		YAHOO.example.container.panelEditor.destroy();
		YAHOO.example.container.panelEditor = null;			
	}
	var adiciona = new YAHOO.widget.Button("fechar",{ onclick: { fn: fechar } });
	var temp = function(e)
	{e.style.display="none";}
	YAHOO.util.Dom.getElementsByClassName("container-close","span","janela_editor_c",temp)
}
function removeAcentos(palavra)
{
	var re = /ã|á|à|â/gi;
	palavra = palavra.replace(re,"a");
	var re = /é/gi;
	palavra = palavra.replace(re,"e");
	var re = /í/gi;
	palavra = palavra.replace(re,"i");
	var re = /ó|õ/gi;
	palavra = palavra.replace(re,"o");
	var re = /ç/gi;
	palavra = palavra.replace(re,"c");
	var re = /ú/gi;
	palavra = palavra.replace(re,"u");
	return(palavra);
}

</script>
</body>
</html>
