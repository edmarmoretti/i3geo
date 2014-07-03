/*
Function: editorGeral

Abre o editor de dados gerais de um layer

<PEGAGERAL>
*/
function editorGeral(codigoMap,codigoLayer)
{
	core_montaEditor("","450px","500px","","Geral");
	var sUrl = "../php/editormapfile.php?funcao=pegaGeral&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorGeral");
}