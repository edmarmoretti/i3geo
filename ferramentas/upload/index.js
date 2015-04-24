
/*
Title: Upload de arquivo shapefile

Envia para o servidor um arquivo shapefile local e insere como uma camada no mapa.

Veja:

<i3GEO.arvoreDeTemas.dialogo.upload>

Arquivo: i3geo/ferramentas/upload/index.js.php

About: Licen&ccedil;a

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.upload
*/
i3GEOF.upload = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.upload.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.upload.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/upload/dicionario.js",
				"i3GEOF.upload.iniciaJanelaFlutuante()",
				"i3GEOF.upload.dicionario_script"
			);
		}
		else{
			i3GEOF.upload.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.upload.html();
			var b = new YAHOO.widget.Button(
				"i3GEOuploadbotao1",
				{onclick:{fn: i3GEOF.upload.submete}}
			);
			b.addClass("rodar");
			i3GEO.util.radioEpsg(
				function(retorno)
				{$i("i3GEOuploadListaepsg").innerHTML = retorno.dados;},
				"i3GEOuploadListaepsg",
				"upload"
			);
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '<form id=i3GEOuploadf target="i3GEOuploadiframe" action="'+i3GEO.configura.locaplic+'/ferramentas/upload/upload.php" method="post" ENCTYPE="multipart/form-data">' +
		'<fieldset class=subbloco >' +
		'<p class="paragrafo" >shp: <br><input type="file" size=22 name="i3GEOuploadshp" style="top:0px;left:0px;cursor:pointer;"></p>' +
		'<p class="paragrafo" >shx: <br><input type="file" size=22 name="i3GEOuploadshx" style="top:0px;left:0px;cursor:pointer;"></p>' +
		'<p class="paragrafo" >dbf: <br><input type="file" size=22 name="i3GEOuploaddbf" style="top:0px;left:0px;cursor:pointer;"></p>' +
		'</fieldset>';
		if(i3GEO.parametros.editor === "sim"){
			ins += '<fieldset class=subbloco >' +
			'<p class="paragrafo" >'+$trad('pastaArmazenamento',i3GEOF.upload.dicionario)+':</p>' +
			'<div class="i3geoForm i3geoFormIconeEdita" ><input type="text" name="dirDestino" id="dirDestino" /></div>' +
			"&nbsp;<img onclick='i3GEO.util.navegadorDir(\"dirDestino\",false,false,false,true);' src='"+i3GEO.configura.locaplic+"/imagens/ic_zoom.png' style='cursor:pointer;position :relative;top:2px'/></p>" +
			'<p class="paragrafo" ><input type=checkbox name=i3GEOuploadCriaMapfile id=i3GEOuploadCriaMapfile />&nbsp;'+$trad('criaMapfile',i3GEOF.upload.dicionario) +
			'</fieldset>';
		}
		ins += '<fieldset class=subbloco >' +
		'<p class="paragrafo" >'+$trad('tipoGeom',i3GEOF.upload.dicionario)+': </p>' +
		'	<div class=styled-select >' +
		'	<select id=tipo name=tipo >' +
		'	<option value="">'+$trad('naoConhecido',i3GEOF.upload.dicionario)+'</option>' +
		'	<option value="1">'+$trad('pontual',i3GEOF.upload.dicionario)+'</option>' +
		'	<option value="5">'+$trad('poligonal',i3GEOF.upload.dicionario)+'</option>' +
		'	<option value="3">'+$trad('linear',i3GEOF.upload.dicionario)+'</option>' +
		'	</select>' +
		'</div>' +
		'<br><p class=paragrafo >'+$trad('projecao',i3GEOF.upload.dicionario)+':</p>' +
		'<div id=i3GEOuploadListaepsg width="98%" style="text-align:left;border:1px solid gray;left:0px;overflow:auto;height:60px"></div>' +
		'</fieldset>' +
		'<fieldset class=subbloco >' +
		'<p class="paragrafo" ><input id=i3GEOuploadbotao1 type="button" value="'+$trad('envia',i3GEOF.upload.dicionario)+'" size=12 name="submit">' +
		'<input type=hidden name=g_sid value="'+i3GEO.configura.sid+'" >' +
		'<input type="hidden" name="MAX_FILE_SIZE" value="1000000">' +
		'</form>' +

		"<p class='paragrafo' style=color:red >"+$trad('ajudaCaracter',i3GEOF.upload.dicionario)+"</p>" +
		'<iframe name=i3GEOuploadiframe style="text-align:left;border:1px solid gray;" width="98%" height="60px"></iframe>' +
		'</fieldset>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		if ($i("i3GEOF.upload")) {
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.upload");
		};
		titulo = "<span class='i3GEOiconeFerramenta i3GEOiconeUpload'></span>"
			+ "<div class='i3GeoTituloJanela'>" + $trad("a2")+"<a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=4&idajuda=27' >&nbsp;&nbsp;&nbsp;</a></div>";
		janela = i3GEO.janela.cria(
			"400px",
			"470px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.upload",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true
		);
		divid = janela[2].id;
		$i("i3GEOF.upload_corpo").style.backgroundColor = "white";
		i3GEOF.upload.aguarde = $i("i3GEOF.upload_imagemCabecalho").style;
		i3GEOF.upload.inicia(divid);
	},
	/*
	Function: submete

	Submete o arquivo ao servidor
	*/
	submete: function(){
		if(i3GEOF.upload.aguarde.visibility==="visible")
		{return;}
		i3GEOF.upload.aguarde.visibility="visible";
		$i("i3GEOuploadf").submit();
	},
	selNavegador: function(onde){
		i3GEO.util.navegadorDir(onde,false,false,false);
	}
};

