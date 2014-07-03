/*
Function: editorDispo

Abre o editor que define a disponibilidade dos dados

<PEGADISPO>
*/
function editorDispo(codigoMap,codigoLayer)
{
	core_montaEditor("","450px","650px","","Disponibilidade");
	var sUrl = "../php/editormapfile.php?funcao=pegaDispo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorDispo");
}
function montaEditorDispo(dados)
{
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
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;
	if($i("cDownload")){
		temp = "<select id='download' >";
		temp += core_combosimnao(dados.download);
		temp += "</select>";
		$i("cDownload").innerHTML = temp;
	}
	var temp = function()
	{salvarDadosEditor('dispo',dados.codigoMap,dados.codigoLayer,false);};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});
}
