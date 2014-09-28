
/*
Function: editorTitulo

Abre o editor de t&iacute;tulo e descri&ccedil;&atilde;o

<PEGACONEXAO>
*/
function editorTitulo(codigoMap,codigoLayer)
{
	var sUrl = "../php/editormapfile.php?funcao=pegaTitulo&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorTitulo");
}
function montaEditorTitulo(dados)
{
	var temp = function(){
		salvarDadosEditor('titulo',dados.codigoMap,dados.codigoLayer);
	};
	core_montaEditor(temp,"450px","650px","","T&iacute;tulo",true,true,false);

	var param = {
		"linhas":[
			{ajuda:"Elemento 'NAME'. N&atilde;o confunda com o nome que aparece no mapa ou  na &aacute;rvore de temas. Normalmente o código recebe o mesmo nome do arquivo mapfile, sem a extens&atilde;o '.map'",
			titulo:"C&oacute;digo do layer",id:"name",value:dados.name,tipo:"text"},
			{ajuda:"Nome do grupo a qual a camada pertence. O nome do grupo pode ser refer&ecirc;ncia como um nome regular de uma camada, permitindo fazer coisas como ligar e desligar um grupo de camadas de uma vez.",
			titulo:"Group",id:"group",value:dados.group,tipo:"text"},
			{ajuda:"Nome que ser&aacute; utilizado na legenda do mapa e na guia 'Temas'",
			titulo:"T&iacute;tulo (METADATA: TEMA)",id:"tema",value:dados.tema,tipo:"text"},
			{ajuda:"Denominador da escala da fonte dos dados utilizado pelo tema. &Eacute; utilizado para apresentar a indica&ccedil;&atilde;o de compatibilidade entre a escala do tema e a escala do mapa que est&aacute; sendo visto.",
			titulo:"Escala (ESCALA)",id:"escala",value:dados.escala,tipo:"text"},
			{ajuda:"Extens&atilde;o geogr&aacute;fica m&aacute;xima do tema, no formato xmin ymin xmax ymax. &Eacute; utilizado na op&ccedil;&atilde;o de 'zoom para o tema'. Quando o tema &eacute; baseado em shapefile, esse metadata n&atilde;o &eacute; necess&aacute;rio, pois o mapserver consegue calcular a extens&atilde;o. J&aacute; em outros tipos de dados, como Postgis, o par&acirc;metro &eacute; necess&aacute;rio. Nesse caso, se n&atilde;o for indicado, o bot&atilde;o de zoom para o tema n&atilde;o ser&aacute; vis&iacute;vel para o usu&aacute;rio",
			titulo:"Extensao (EXTENSAO)",id:"extensao",value:dados.extensao,tipo:"text"},
			{ajuda:"&Iacute;cone que ser&aacute; mostrado na &aacute;rvore de camadas. A imagem deve existir na web e deve ser inclu&iacute;do o caminho completo ou relativo em rela&ccedil;&atilde;o ao local da interface HTML do mapa.",
			titulo:"&Iacute;cone (METADATA: ICONETEMA)",id:"iconetema",value:dados.iconetema,tipo:"text"},
			{ajuda:"Mensagem que ser&aacute; mostrada no rodap&eacute; do mapa quando o tema estiver vis&iacute;vel. &Eacute; &uacute;til para apresentar ao usu&aacute;rio observa&ccedil;&otilde;es especiais sobre o uso daquele tema.",
			titulo:"Mensagem (MENSAGEM)",id:"mensagem",value:dados.mensagem,tipo:"text"}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

}
