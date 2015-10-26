/*
Function: editorGeral

Abre o editor de dados gerais de um layer

<PEGAGERAL>
*/
//
//Dependencias: Este programa necessita do arquivo "../dicionario/editormapfile.js"
//
function editorGeral(codigoMap,codigoLayer)
{
	core_montaEditor("","450px","500px","","Geral");
	var sUrl = "../php/editormapfile.php?funcao=pegaGeral&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados($trad("obtemDados",i3GEOadmin.core.dicionario),sUrl,"montaEditorGeral");
}
