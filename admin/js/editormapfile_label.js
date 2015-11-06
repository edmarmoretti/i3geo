/*
Function: editorClasseLabel

Abre o editor dos labels de um layer

<PEGACLASSELABEL>
*/
//
//Dependencias: Este programa necessita do arquivo "../dicionario/editormapfile.js"
//
function editorClasseLabel(codigoMap,codigoLayer,indiceClasse)
{
	var sUrl = "../php/editormapfile.php?funcao=pegaClasseLabel&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
	core_pegaDados($trad("obtemDados",i3GEOadmin.core.dicionario),sUrl,"montaEditorClasseLabel");
}

function montaEditorClasseLabel(dados)
{
	var temp = function(){
		salvarDadosEditor('classeLabel',dados.codigoMap,dados.codigoLayer,dados.indiceClasse);
	};
	core_montaEditor(temp,"450px","500px","","Label&nbsp;"+dados.codigoMap,true,true,false);
	var param = {
		"linhas":[
		{ajuda:$trad("colorLabel",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("colorLabelTitulo",i3GEOadmin.editormapfile.dicionario),id:"color",value:dados.color,tipo:"cor"},
		{ajuda:$trad("sizeLabel",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("sizeLabelTitulo",i3GEOadmin.editormapfile.dicionario),id:"size",value:dados.size,tipo:"text"},
		{ajuda:$trad("positonLabel",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("positonLabelTitulo",i3GEOadmin.editormapfile.dicionario),id:"position",value:dados.position,tipo:"text"},
		{ajuda:$trad("bufferLabel",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("bufferLabelTitulo",i3GEOadmin.editormapfile.dicionario),id:"buffer",value:dados.buffer,tipo:"text"},
		{ajuda:$trad("font",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("fontTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.font,tipo:"text",div:"<div id=cFont ></div>"},
		{ajuda:$trad("labeltype",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("labeltypeTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.type,tipo:"text",div:"<div id=cType ></div>"},
		{ajuda:$trad("partials",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("partialsTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.partials,tipo:"text",div:"<div id=cPartials ></div>"},
		{ajuda:$trad("force",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("forceTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.force,tipo:"text",div:"<div id=cForce ></div>"},
		{ajuda:$trad("backgroundcolorLabel",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("backgroundcolorLabelTitulo",i3GEOadmin.editormapfile.dicionario),id:"backgroundcolor",value:dados.backgroundcolor,tipo:"cor"},
		{ajuda:$trad("backgroundshadowcolor",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("backgroundshadowcolorTitulo",i3GEOadmin.editormapfile.dicionario),id:"backgroundshadowcolor",value:dados.backgroundshadowcolor,tipo:"cor"},
		{ajuda:$trad("outlinecolorLabel",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("outlinecolorLabelTitulo",i3GEOadmin.editormapfile.dicionario),id:"outlinecolor",value:dados.outlinecolor,tipo:"cor"},
		{ajuda:$trad("shadowcolor",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("shadowcolorTitulo",i3GEOadmin.editormapfile.dicionario),id:"shadowcolor",value:dados.shadowcolor,tipo:"text"},
		{ajuda:$trad("shadowsizex",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("shadowsizexTitulo",i3GEOadmin.editormapfile.dicionario),id:"shadowsizex",value:dados.shadowsizex,tipo:"text"},
		{ajuda:$trad("shadowsizey",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("shadowsizeyTitulo",i3GEOadmin.editormapfile.dicionario),id:"shadowsizey",value:dados.shadowsizey,tipo:"text"},
		{ajuda:$trad("backgroundshadowsizex",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("backgroundshadowsizexTitulo",i3GEOadmin.editormapfile.dicionario),id:"backgroundshadowsizex",value:dados.backgroundshadowsizex,tipo:"text"},
		{ajuda:$trad("backgroundshadowsizey",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("backgroundshadowsizeyTitulo",i3GEOadmin.editormapfile.dicionario),id:"backgroundshadowsizey",value:dados.backgroundshadowsizey,tipo:"text"},
		{ajuda:$trad("minsizeLabel",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("minsizeLabelTitulo",i3GEOadmin.editormapfile.dicionario),id:"minsize",value:dados.minsize,tipo:"text"},
		{ajuda:$trad("maxsizeLabel",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("maxsizeLabelTitulo",i3GEOadmin.editormapfile.dicionario),id:"maxsize",value:dados.maxsize,tipo:"text"},
		{ajuda:$trad("offsetxLabel",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("offsetxLabelTitulo",i3GEOadmin.editormapfile.dicionario),id:"offsetx",value:dados.offsetx,tipo:"text"},
		{ajuda:$trad("offsetyLabel",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("offsetyLabelTitulo",i3GEOadmin.editormapfile.dicionario),id:"offsety",value:dados.offsety,tipo:"text"},
		{ajuda:$trad("angleLabel",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("angleLabelTitulo",i3GEOadmin.editormapfile.dicionario),id:"angle",value:dados.angle,tipo:"text"},
		{ajuda:$trad("autoangle",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("autoangleTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.angle,tipo:"text",div:"<div id=cAutoangle ></div>"},
		{ajuda:$trad("antialiasLabel",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("antialiasLabelTitulo",i3GEOadmin.editormapfile.dicionario),id:"antialias",value:dados.antialias,tipo:"text"},
		{ajuda:$trad("wrap",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("wrapTitulo",i3GEOadmin.editormapfile.dicionario),id:"wrap",value:dados.wrap,tipo:"text"},
		{ajuda:$trad("minfeaturesize",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("minfeaturesizeTitulo",i3GEOadmin.editormapfile.dicionario),id:"minfeaturesize",value:dados.minfeaturesize,tipo:"text"},
		{ajuda:$trad("mindistance",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("mindistanceTitulo",i3GEOadmin.editormapfile.dicionario),id:"mindistance",value:dados.mindistance,tipo:"text"},
		{ajuda:$trad("encoding",i3GEOadmin.editormapfile.dicionario),
		titulo:$trad("encodingTitulo",i3GEOadmin.editormapfile.dicionario),id:"encoding",value:dados.encoding,tipo:"text"}
		]
	};
	var ins = "";
	if(dados.colunas != "")
	{
		//ins += "<p>O layer possu&iacute; as seguintes colunas na tabela de atributos: ";
		//ins += dados.colunas+"</p>";
	}
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	temp = "<select id='font' >";
	temp += core_comboObjeto(dados.fontes,"","",dados.font);
	temp += "</select>";
	$i("cFont").innerHTML = temp;

	temp = "<select id='type' >";
	temp += core_comboObjeto(objfonttypes,"valor","texto",dados.type);
	temp += "</select>";
	$i("cType").innerHTML = temp;

	temp = "<select id='partials' >";
	temp += core_comboObjeto(objbool_tf,"valor","texto",dados.partials);
	temp += "</select>";
	$i("cPartials").innerHTML = temp;

	temp = "<select id='force' >";
	temp += core_comboObjeto(objbool_tf,"valor","texto",dados.force);
	temp += "</select>";
	$i("cForce").innerHTML = temp;

	temp = "<select id='autoangle' >";
	temp += core_comboObjeto(objbool_tf,"valor","texto",dados.autoangle);
	temp += "</select>";
	$i("cAutoangle").innerHTML = temp;
}
