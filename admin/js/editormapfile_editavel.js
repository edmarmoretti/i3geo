/*
Function: editorEditavel

Abre o editor que define se o tema e editavel ou nao

<PEGAEDITAVEL>
*/
function editorEditavel(codigoMap,codigoLayer)
{
	var sUrl = "../php/editormapfile.php?funcao=pegaEditavel&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorEditavel");
}
function montaEditorEditavel(dados)
{
	var temp = function(){
		salvarDadosEditor('editavel',dados.codigoMap,dados.codigoLayer,false);
	};
	core_montaEditor(temp,"450px","450px","",$trad("edicao",i3GEOadmin.editormapfile.dicionario),false,true,false);

	var limg = i3GEO.configura.locaplic+"/imagens/ic_zoom.png",
		param = {
		"linhas":[
			{ajuda:$trad("editavel",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("editavelTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.editavel,tipo:"text",div:"<div id=cEditavel ></div>"},
			{ajuda:$trad("esquemaBd",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("esquemaBdTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:"",tipo:"text",div:"<div id=cEsquematabelaeditavel ></div>" },
			{ajuda:$trad("tabelaBd",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("tabelaBdTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:"",tipo:"text",div:"<div id=cTabelatabelaeditavel ></div>" },
			{ajuda:$trad("colunaBd",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("colunaBdTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:"",tipo:"text",div:"<div id=cColunatabelaeditavel ></div>" },
			{ajuda:$trad("bdGeom",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("bdGeomTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:"",tipo:"text",div:"<div id=cColunageometriatabelaeditavel ></div>" }
		]
		},
	ins = "";
	ins += "<p>"+ $trad("obsPostgis",i3GEOadmin.editormapfile.dicionario) +"</p>";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;
	if($i("cEditavel")){
		temp = "<select id='editavel' >";
		temp += core_combosimnao(dados.editavel);
		temp += "</select>";
		$i("cEditavel").innerHTML = temp;
	}
	if($i("cEsquematabelaeditavel")){
		temp = '<input id="esquematabelaeditavel" style="width:90%;" value="'+dados.esquematabelaeditavel+'" />' +
			"<img id='esquematabelaeditavelBusca' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cEsquematabelaeditavel").innerHTML = temp;
	}
	$i("esquematabelaeditavelBusca").onclick = function(){
		i3GEO.util.navegadorPostgis($i("esquematabelaeditavel"),"","esquema");
	};
	if($i("cTabelatabelaeditavel")){
		temp = '<input id="tabelaeditavel" style="width:90%;" value="'+dados.tabelaeditavel+'" />' +
			"<img id='tabelatabelaeditavelBusca' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cTabelatabelaeditavel").innerHTML = temp;
	}
	$i("tabelatabelaeditavelBusca").onclick = function(){
		i3GEO.util.navegadorPostgis($i("tabelaeditavel"),"","tabela");
	};
	if($i("cColunatabelaeditavel")){
		temp = '<input id="colunaidunico" style="width:90%;" value="'+dados.colunaidunico+'" />' +
			"<img id='colunatabelaeditavelBusca' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cColunatabelaeditavel").innerHTML = temp;
	}
	$i("colunatabelaeditavelBusca").onclick = function(){
		i3GEO.util.navegadorPostgis($i("colunaidunico"),"","coluna");
	};
	if($i("cColunageometriatabelaeditavel")){
		temp = '<input id="colunageometria" style="width:90%;" value="'+dados.colunageometria+'" />' +
			"<img id='colunageometriatabelaeditavelBusca' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cColunageometriatabelaeditavel").innerHTML = temp;
	}
	$i("colunageometriatabelaeditavelBusca").onclick = function(){
		i3GEO.util.navegadorPostgis($i("colunageometria"),"","coluna");
	};
}
