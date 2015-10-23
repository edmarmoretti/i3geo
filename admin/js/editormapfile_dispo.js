//
//Dependencias: Este programa necessita do arquivo "../dicionario/editormapfile.js"
//
/*
Function: editorDispo

Abre o editor que define a disponibilidade dos dados

<PEGADISPO>
*/
function editorDispo(codigoMap,codigoLayer)
{
	var sUrl = "../php/editormapfile.php?funcao=pegaDispo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados($trad("obtemDados",i3GEOadmin.core.dicionario),sUrl,"montaEditorDispo");
}
function montaEditorDispo(dados)
{
	var temp = function(){
		salvarDadosEditor('dispo',dados.codigoMap,dados.codigoLayer,false);
	};
	core_montaEditor(temp,"450px","650px","",$trad("disponibilidade",i3GEOadmin.editormapfile.dicionario),true,true,false);
	var param = {
		"linhas":[
			{ajuda:$trad("permiteDownload",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("permiteDownloadTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.download,tipo:"text",div:"<div id=cDownload ></div>"},
			{ajuda:$trad("endereco",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("enderecoTitulo",i3GEOadmin.editormapfile.dicionario),id:"arquivodownload",value:dados.arquivodownload,tipo:"text"},
			{ajuda:$trad("arquivoKmz",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("arquivoKmzTitulo",i3GEOadmin.editormapfile.dicionario),id:"arquivokmz",value:dados.arquivokmz,tipo:"text"}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	
	ins += "<p>"+ $trad("permiteOgc2",i3GEOadmin.editormapfile.dicionario) +"<br>";
	ins += "<select  id='ogc_tema' >";
	ins += core_combosimnao(dados.ogc_tema);
	ins += "</select></p>";
	ins += "<p>"+ $trad("permiteDownload2",i3GEOadmin.editormapfile.dicionario) +"<br>";
	ins += "<select  id='download_tema' >";
	ins += core_combosimnao(dados.download_tema);
	ins += "</select></p>";
	ins += "<p>"+ $trad("permiteKml",i3GEOadmin.editormapfile.dicionario) +"<br>";
	ins += "<select  id='kml_tema' >";
	ins += core_combosimnao(dados.kml_tema);
	ins += "</select></p>";
	ins += "<p>"+ $trad("permiteKmz",i3GEOadmin.editormapfile.dicionario) +"<br>";
	ins += "<select  id='kmz_tema' >";
	ins += core_combosimnao(dados.kmz_tema);
	ins += "</select></p>";
	
	
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;
	if($i("cDownload")){
		temp = "<select id='download' >";
		temp += core_combosimnao(dados.download);
		temp += "</select>";
		$i("cDownload").innerHTML = temp;
	}
}
