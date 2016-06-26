/*
Function: editorTitulo

Abre o editor de t&iacute;tulo e descri&ccedil;&atilde;o

<PEGACONEXAO>
*/
//
//Dependencias: Este programa necessita do arquivo "../dicionario/editormapfile.js"
//
function editorTitulo(codigoMap,codigoLayer)
{
	var sUrl = "../php/editormapfile.php?funcao=pegaTitulo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados($trad("obtemDados",i3GEOadmin.core.dicionario),sUrl,"montaEditorTitulo");
}
function montaEditorTitulo(dados)
{
	var temp = function(){
		salvarDadosEditor('titulo',dados.codigoMap,dados.codigoLayer);
	};
	core_montaEditor(temp,"450px","650px","","T&iacute;tulo&nbsp;"+dados.codigoMap,true,true,false);

	var param = {
		"linhas":[
			{ajuda:$trad("name",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("nameTitulo",i3GEOadmin.editormapfile.dicionario),id:"name",value:dados.name,tipo:"text"},
			{ajuda:$trad("group",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("groupTitulo",i3GEOadmin.editormapfile.dicionario),id:"group",value:dados.group,tipo:"text"},
			{ajuda:$trad("tema",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("temaTitulo",i3GEOadmin.editormapfile.dicionario),id:"tema",value:dados.tema,tipo:"text"},
			{ajuda:$trad("escala",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("escalaTitulo",i3GEOadmin.editormapfile.dicionario),id:"escala",value:dados.escala,tipo:"text"},
			{ajuda:$trad("exten",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("extenTitulo",i3GEOadmin.editormapfile.dicionario),id:"extensao",value:dados.extensao,tipo:"text"},
			{ajuda:$trad("iconetema",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("iconetemaTitulo",i3GEOadmin.editormapfile.dicionario),id:"iconetema",value:dados.iconetema,tipo:"text"},
			{ajuda:$trad("mensagem",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("mensagemTitulo",i3GEOadmin.editormapfile.dicionario),id:"mensagem",value:dados.mensagem,tipo:"text"}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

}
