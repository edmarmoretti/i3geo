//
//Dependencias: Este programa necessita do arquivo "../dicionario/editormapfile.js"
//
/*
Function: editorEditavel

Abre o editor que define se o tema e editavel ou nao

<PEGAEDITAVEL>
*/
function editorEditavel(codigoMap,codigoLayer)
{
	var sUrl = "../php/editormapfile.php?funcao=pegaEditavel&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados($trad("obtemDados",i3GEOadmin.core.dicionario),sUrl,"montaEditorEditavel");
}
function montaEditorEditavel(dados)
{
	var temp = function(){
		salvarDadosEditor('editavel',dados.codigoMap,dados.codigoLayer,false);
	};
	core_montaEditor(temp,"450px","450px","",$trad("edicao",i3GEOadmin.editormapfile.dicionario) + "&nbsp;"+dados.codigoMap,false,true,false);

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
		temp = "<div class='styled-select150'><select id='editavel' >";
		temp += core_combosimnao(dados.editavel);
		temp += "</select></div>";
		$i("cEditavel").innerHTML = temp;
	}
	if($i("cEsquematabelaeditavel")){
		temp = '<div class="i3geoForm i3geoFormSemIcone"><input id="esquematabelaeditavel" value="'+dados.esquematabelaeditavel+'" style="width:90%;" />' +
			"<img id='esquematabelaeditavelBusca' src='"+limg+"' class='lupaBuscar'/></div>";
		$i("cEsquematabelaeditavel").innerHTML = temp;
	}
	$i("esquematabelaeditavelBusca").onclick = function(){
		i3GEO.util.navegadorPostgis($i("esquematabelaeditavel"),"","esquema");
	};
	if($i("cTabelatabelaeditavel")){
		temp = '<div class="i3geoForm i3geoFormSemIcone"><input id="tabelaeditavel" value="'+dados.tabelaeditavel+'" style="width:90%;" />' +
			"<img id='tabelatabelaeditavelBusca' src='"+limg+"' class='lupaBuscar'/></div>";
		$i("cTabelatabelaeditavel").innerHTML = temp;
	}
	$i("tabelatabelaeditavelBusca").onclick = function(){
		i3GEO.util.navegadorPostgis($i("tabelaeditavel"),"","tabela");
	};
	if($i("cColunatabelaeditavel")){
		temp = '<div class="i3geoForm i3geoFormSemIcone"><input id="colunaidunico" value="'+dados.colunaidunico+'" style="width:90%;" />' +
			"<img id='colunatabelaeditavelBusca' src='"+limg+"' class='lupaBuscar'/></div>";
		$i("cColunatabelaeditavel").innerHTML = temp;
	}
	$i("colunatabelaeditavelBusca").onclick = function(){
		i3GEO.util.navegadorPostgis($i("colunaidunico"),"","coluna");
	};
	if($i("cColunageometriatabelaeditavel")){
		temp = '<div class="i3geoForm i3geoFormSemIcone"><input id="colunageometria" value="'+dados.colunageometria+'" style="width:90%;" />' +
			"<img id='colunageometriatabelaeditavelBusca' src='"+limg+"' class='lupaBuscar'/></div>";
		$i("cColunageometriatabelaeditavel").innerHTML = temp;
	}
	$i("colunageometriatabelaeditavelBusca").onclick = function(){
		i3GEO.util.navegadorPostgis($i("colunageometria"),"","coluna");
	};
}
