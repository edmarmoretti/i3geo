/*
Function: editorDispo

Abre o editor que define a disponibilidade dos dados

<PEGADISPO>
*/
function editorDispo(codigoMap,codigoLayer)
{
	var sUrl = "../php/editormapfile.php?funcao=pegaDispo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorDispo");
}
function montaEditorDispo(dados)
{
	var temp = function(){
		salvarDadosEditor('dispo',dados.codigoMap,dados.codigoLayer,false);
	};
	core_montaEditor(temp,"450px","650px","","Disponibilidade",true,true,false);
	var param = {
		"linhas":[
			{ajuda:"Indica se o usu&aacute;rio pode fazer download do tema. Se sim, o &iacute;cone de download ser&aacute; mostrado na &aacute;rvore de camadas dispon&iacute;veis no mapa.",
			titulo:"Permite download (METADATA: DOWNLOAD)",id:"",value:dados.download,tipo:"text",div:"<div id=cDownload ></div>"},
			{ajuda:"Endere&ccedil;o de um arquivo pr&eacute;-existente para download dos dados (caminho completo no servidor). Se definido, o sistema ir&aacute; usar esse arquivo ao inv&eacute;s de gerar os dados, quando o usu&aacute;rio clicar nas op&ccedil;&otilde;es de download. Se n&atilde;o for definido, o arquivo de download &eacute; gerado diretamente do original, convertendo do banco ou copiando o arquivo definido em DATA.",
			titulo:"Arquivo download (ARQUIVODOWNLOAD)",id:"arquivodownload",value:dados.arquivodownload,tipo:"text"},
			{ajuda:"Endere&ccedil;o de um arquivo KMZ ou KML pr&eacute;-existente para download dos dados (caminho completo no servidor). Se definido, o sistema ir&aacute; usar esse arquivo ao inv&eacute;s de gerar os dados, quando o usu&aacute;rio clicar nas op&ccedil;&otilde;es de visualiza&ccedil;&atilde;o de KML ou KMZ. Se n&atilde;o for definido, o arquivo &eacute; gerado diretamente do original.",
			titulo:"Arquivo KML ou KMZ (ARQUIVOKMZ)",id:"arquivokmz",value:dados.arquivokmz,tipo:"text"}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	
	ins += "<p>Permite acesso via WMS/WFS? (n&atilde;o ocasiona restri&ccedil;&atilde;o em temas do tipo gvSIG)<br>";
	ins += "<select  id='ogc_tema' >";
	ins += core_combosimnao(dados.ogc_tema);
	ins += "</select></p>";
	ins += "<p>Permite o download na aplica&ccedil;&atilde;o datadownload.htm? (n&atilde;o afeta temas do tipo gvSIG) (n&atilde;o afeta a permiss&atilde;o de download definida no item 'disponibilidade' existente em cada layer)<br>";
	ins += "<select  id='download_tema' >";
	ins += core_combosimnao(dados.download_tema);
	ins += "</select></p>";
	ins += "<p>Permite acesso via kml? (n&atilde;o restringe em temas do tipo gvSIG)<br>";
	ins += "<select  id='kml_tema' >";
	ins += core_combosimnao(dados.kml_tema);
	ins += "</select></p>";
	ins += "<p>Permite acesso via kmz (kml com dados vetoriais)? (n&atilde;o restringe em temas do tipo gvSIG)<br>";
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
