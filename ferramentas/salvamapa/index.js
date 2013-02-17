
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Salva mapa

Faz o download do mapfile atualmente em uso. Posteriormente, o mapfile pode ser enviado de volta ao servidor para restaurar o mapa

Veja:

<i3GEO.mapa.dialogo.salvaMapa>

Arquivo: i3geo/ferramentas/salvamapa/index.js.php

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
Classe: i3GEOF.salvaMapa
*/
i3GEOF.salvaMapa = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.salvaMapa.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.salvaMapa.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/salvamapa/dicionario.js",
				"i3GEOF.salvaMapa.iniciaJanelaFlutuante()",
				"i3GEOF.salvaMapa.dicionario_script"
			);
		}
		else{
			i3GEOF.salvaMapa.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		$i(iddiv).innerHTML = i3GEOF.salvaMapa.html();
		var temp = function(dados){
				i3GEOF.salvaMapa.htmlMapaLocal("i3GEOFsalvaMapaLocal");
				i3GEOF.salvaMapa.htmlMapaBanco("i3GEOFsalvaMapaBanco");
			},
			atualiza = true,
			geo = false;
		if(i3GEO.Interface.ATUAL === "googlemaps" || i3GEO.Interface.ATUAL === "googleearth"){
			atualiza = false;
			geo = true;
		}
		i3GEO.php.mudaext(temp,"nenhum",i3GEO.parametros.mapexten,i3GEO.configura.locaplic,i3GEO.configura.sid,atualiza,geo);
	},
	htmlMapaBanco: function(onde){
		onde = $i(onde);
		if(onde){
			try{
				var map_file = i3GEO.parametros.mapfile,
					local = map_file.split("ms_tmp");
				teste = i3GEO.configura.locaplic+"/testamapfile.php?map="+map_file;
				local = i3GEO.util.protocolo()+"://"+window.location.host+"/ms_tmp"+local[1];
				onde.innerHTML = "<a href='#' onclick='i3GEOF.salvaMapa.salvaMapaBanco()' >Clique aqui para salvar o mapa</a><br>" +
					"<a href='#' onclick='i3GEO.mapa.dialogo.listaDeMapasBanco()'>Clique aqui para ver a lista de mapas</a><br>" +
					"<a href='"+i3GEO.configura.locaplic+"/admin/html/mapas.html' target='_blank' >Clique aqui para editar a lista de mapas</a>";
			}
			catch(erro){i3GEO.janela.tempoMsg(erro);}
		}
	},
	htmlMapaLocal: function(onde){
		onde = $i(onde);
		if(onde){
			try{
				var teste,
					map_file = i3GEO.parametros.mapfile,
					local = map_file.split("ms_tmp");
				teste = i3GEO.configura.locaplic+"/testamapfile.php?map="+map_file;
				local = i3GEO.util.protocolo()+"://"+window.location.host+"/ms_tmp"+local[1];
				onde.innerHTML = "<a href='"+local+"' target='_blank' >Clique aqui para baixar o arquivo</a><br>" +
					"<a href='"+teste+"' target='_blank' >Clique aqui para testar</a>";
			}
			catch(erro){i3GEO.janela.tempoMsg(erro);}
		}
	},
	salvaMapaBanco: function(){
		//TODO melhorar essa interface
		var texto,funcaoOK,login = i3GEO.login.verificaCookieLogin();
		if(login === false){
			i3GEO.login.dialogo.abreLogin();
		}
		else{
			funcaoOK = function(){
				var temp,
					id_mapa = $i("salvamapaId").value,
					titulo = $i("i3GEOjanelaprompt").value;
				if(titulo === ""){
					return;
				}
				temp = function(retorno){
					if(retorno.id && retorno.id != ""){
						i3GEO.janela.tempoMsg("Mapa salvo");
					}
					else{
						if(retorno.status){
							i3GEO.janela.tempoMsg(retorno.status);
						}
						else{
							i3GEO.janela.tempoMsg(retorno);
						}
					}
				};
				i3GEO.php.salvaMapaBanco(temp,titulo,id_mapa);
			};
			texto = "ID do mapa que ser&aacute; atualizado (opcional).<br>Se for um mapa novo, deixe em branco<br><input id=salvamapaId  type=text /><br>";
			i3GEO.janela.prompt(texto + "<br>T&iacute;tulo do mapa",funcaoOK);
		}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '';
		ins += '<p class="paragrafo" >Salvando o mapa atual, voc&ecirc; poder&aacute; carreg&aacute;-lo novamente.</p>' +
			'<p class="paragrafo" >Existem duas maneiras de fazer isso, conforme explicado a seguir.</p>' +
			'<div style=background-color:white;padding:5px;margin:5px >' +
			'	<p class="paragrafo" ><b>1- </b>Armazene o arquivo de configura&ccedil;&atilde;o do mapa em seu computador, ' +
			'	fazendo o download. Isso permitir&aacute; que voc&ecirc; faça o upload desse mesmo arquivo, restaurando o mapa. '+
			'	<p class="paragrafo" >Clique no link abaixo com o bot&atilde;o direito do mouse e salve o arquivo em seu computador.' +
			'	Para carregar o mapa salvo utilize a op&ccedil;&atilde;o de carregar mapa.' +
			'	<div id="i3GEOFsalvaMapaLocal"></div>' +
			'</div>' +
			'<div style=background-color:white;padding:5px;margin:5px >' +
			'	<p class="paragrafo" ><b>2- </b>Fa&ccedil;a login e cadastre o mapa atual no banco de dados existente no servidor web.' +
			'	Com isso o mapa ser&aacute; salvo de forma permanente e outros usu&aacute;rios poderão utiliz&aacute;-lo. Consulte o admnistrador do site que você está utilizando para saber mais sobre a pol&iacute;tica de uso do mapa que for salvo' +
			'	<div id="i3GEOFsalvaMapaBanco"></div>' +
			'</div><br>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo;
		titulo = $trad("u17")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=2&idajuda=10' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"300px",
			"180px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.salvaMapa",
			false,
			"hd"
		);
		divid = janela[2].id;
		i3GEOF.salvaMapa.aguarde = $i("i3GEOF.salvaMapa_imagemCabecalho").style;
		i3GEOF.salvaMapa.inicia(divid);
	}
};
