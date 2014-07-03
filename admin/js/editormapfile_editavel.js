/*
Function: editorEditavel

Abre o editor que define se o tema e editavel ou nao

<PEGAEDITAVEL>
*/
function editorEditavel(codigoMap,codigoLayer)
{
	core_montaEditor("","450px","450px","","Edi&ccedil;&atilde;o");
	var sUrl = "../php/editormapfile.php?funcao=pegaEditavel&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorEditavel");
}
function montaEditorEditavel(dados)
{
	var limg = i3GEO.configura.locaplic+"/imagens/ic_zoom.png",
		param = {
		"linhas":[
			{ajuda:"Indica se o tema poder&aacute; ser utilizado nos editores vetoriais e de atributos",
			titulo:"O tema pode ser editado? (METADATA: EDITAVEL)",id:"",value:dados.editavel,tipo:"text",div:"<div id=cEditavel ></div>"},
			{ajuda:"Esquema do banco de dados onde est&aacute; a tabela que poder&aacute; ser editada",
			titulo:"Esquema no banco de dados",id:"",value:"",tipo:"text",div:"<div id=cEsquematabelaeditavel ></div>" },
			{ajuda:"Tabela do banco que poder&aacute; ser editada",
			titulo:"Tabela no banco de dados",id:"",value:"",tipo:"text",div:"<div id=cTabelatabelaeditavel ></div>" },
			{ajuda:"Coluna que identifica de forma &uacute;nica cada registro da tabela",
			titulo:"Coluna com IDs &uacute;nicos",id:"",value:"",tipo:"text",div:"<div id=cColunatabelaeditavel ></div>" },
			{ajuda:"Coluna que contem as geometrias da tabela",
			titulo:"Coluna com geometria edit&aacute;vel",id:"",value:"",tipo:"text",div:"<div id=cColunageometriatabelaeditavel ></div>" }
		]
		},
	ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	ins += "<p>Obs.: Apenas temas baseados em Postgis podem ser editados</p>";
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
	var temp = function()
	{salvarDadosEditor('editavel',dados.codigoMap,dados.codigoLayer,false);};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});
}
