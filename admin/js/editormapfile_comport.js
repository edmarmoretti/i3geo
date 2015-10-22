//
//Utilizado por editormapfile.js
//

/*
Function: editorComport

Abre o editor das op&ccedil;&otilde;es que controlam o comportamento do layer no mapa

<PEGACOMPORT>
*/
function editorComport(codigoMap,codigoLayer)
{
	var sUrl = "../php/editormapfile.php?funcao=pegaComport&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorComport");
}
function montaEditorComport(dados)
{
	var temp = function(){
		salvarDadosEditor('comport',dados.codigoMap,dados.codigoLayer,false);
	};
	core_montaEditor(temp,"450px","650px","","Comportamento",true,true,false);
	var param = {
		"linhas":[
			{ajuda:$trad("status",i3GEOadmin.editormapfile.dicionario),
			titulo:"Status",id:"",value:dados.status,tipo:"text",div:"<div id=cStatus ></div>"},
			{ajuda:$trad("identifica",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("identificaTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.identifica,tipo:"text",div:"<div id=cIdentifica ></div>"},
			{ajuda:$trad("opacidade",i3GEOadmin.editormapfile.dicionario),
			titulo:"Opacity",id:"opacity",value:dados.opacity,tipo:"text"},
			{ajuda:$trad("aplicaExtensao",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("aplicaExtensaoTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.aplicaextensao,tipo:"text",div:"<div id=cAplicaextensao ></div>"},
			{ajuda:$trad("comentario",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("comentarioTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.permitecomentario,tipo:"text",div:"<div id=cPermitecomentario ></div>"},
			{ajuda:$trad("temporizador",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("temporizadorTitulo",i3GEOadmin.editormapfile.dicionario),id:"temporizador",value:dados.temporizador,tipo:"text"},
			{ajuda:$trad("classe",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("classeTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.classe,tipo:"text",div:"<div id=cClasse ></div>"},
			{ajuda:$trad("legendaImg",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("legendaImgTitulo",i3GEOadmin.editormapfile.dicionario),id:"legendaimg",value:dados.legendaimg,tipo:"text"},
			{ajuda:$trad("escondido",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("escondidoTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.escondido,tipo:"text",div:"<div id=cEscondido ></div>"},
			{ajuda:$trad("transition",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("transitionTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.transitioneffect,tipo:"text",div:"<div id=cTransitioneffect ></div>"},
			{ajuda:$trad("offsite",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("offsiteTitulo",i3GEOadmin.editormapfile.dicionario),id:"offsite",value:dados.offsite,tipo:"text"},
			{ajuda:$trad("maxscale",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("maxscaleTitulo",i3GEOadmin.editormapfile.dicionario),id:"maxscale",value:dados.maxscale,tipo:"text"},
			{ajuda:$trad("minscale",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("minscaleTitulo",i3GEOadmin.editormapfile.dicionario),id:"minscale",value:dados.minscale,tipo:"text"},
			{ajuda:$trad("labelitem",i3GEOadmin.editormapfile.dicionario),
			titulo:"Labelitem",id:"labelitem",value:dados.labelitem,tipo:"text"},
			{ajuda:$trad("labelMaxscale",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("labelMaxscaleTitulo",i3GEOadmin.editormapfile.dicionario),id:"labelmaxscale",value:dados.labelmaxscale,tipo:"text"},
			{ajuda:$trad("labelMinscale",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("labelMinscaleTitulo",i3GEOadmin.editormapfile.dicionario),id:"labelminscale",value:dados.labelminscale,tipo:"text"},
			{ajuda:$trad("symbolscale",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("symbolscaleTitulo",i3GEOadmin.editormapfile.dicionario),id:"symbolscale",value:dados.symbolscale,tipo:"text"},
			{ajuda:$trad("tolerance",i3GEOadmin.editormapfile.dicionario),
			titulo:"Tolerance",id:"tolerance",value:dados.tolerance,tipo:"text"},
			{ajuda:" ",
			titulo:"Tolerance units",id:"",value:dados.toleranceunits,tipo:"text",div:"<div id=cToleranceunits ></div>"},
			{ajuda:$trad("sizeunits",i3GEOadmin.editormapfile.dicionario),
			titulo:"Sizeunits",id:"",value:dados.sizeunits,tipo:"text",div:"<div id=cSizeunits ></div>"}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	if($i("cAplicaextensao")){
		temp = "<select id='aplicaextensao' >";
		temp += core_combosimnao(dados.aplicaextensao);
		temp += "</select>";
		$i("cAplicaextensao").innerHTML = temp;
	}
	if($i("cPermitecomentario")){
		temp = "<select id='permitecomentario' >";
		temp += core_combosimnao(dados.permitecomentario);
		temp += "</select>";
		$i("cPermitecomentario").innerHTML = temp;
	}
	if($i("cClasse")){
		temp = "<p><select id='classe' >";
		temp += core_combosimnao(dados.classe);
		temp += "</select>";
		$i("cClasse").innerHTML = temp;
	}
	if($i("cEscondido")){
		temp = "<select id='escondido' >";
		temp += core_combosimnao(dados.escondido);
		temp += "</select>";
		$i("cEscondido").innerHTML = temp;
	}
	if($i("cIdentifica")){
		temp = "<select id='identifica' >";
		temp += core_combosimnao(dados.identifica);
		temp += "</select>";
		$i("cIdentifica").innerHTML = temp;
	}
	if($i("cTransitioneffect")){
		temp = "<select id='transitioneffect' >";
		temp += core_combosimnao(dados.transitioneffect);
		temp += "</select>";
		$i("cTransitioneffect").innerHTML = temp;
	}
	temp = "<select id='status' >";
	temp += core_comboObjeto(objstatus,"valor","texto",dados.status);
	temp += "</select>";
	$i("cStatus").innerHTML = temp;

	temp = "<select id='sizeunits' >";
	temp += core_comboObjeto(objmapunits,"valor","texto",dados.sizeunits);
	temp += "</select>";
	$i("cSizeunits").innerHTML = temp;
	temp = "<select id='toleranceunits' >";
	temp += core_comboObjeto(objmapunits,"valor","texto",dados.toleranceunits);
	temp += "</select>";
	$i("cToleranceunits").innerHTML = temp;
}

