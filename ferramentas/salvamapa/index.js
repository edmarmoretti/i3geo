
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
				onde.innerHTML = "<a href='#' onclick='i3GEOF.salvaMapa.salvaMapaBanco()' >"+$trad(1,i3GEOF.salvaMapa.dicionario)+"</a><br>" +
					"<a href='#' onclick='i3GEO.mapa.dialogo.listaDeMapasBanco()'>"+$trad(2,i3GEOF.salvaMapa.dicionario)+"</a><br>" +
					"<a href='"+i3GEO.configura.locaplic+"/admin/html/mapas.html' target='_blank' >"+$trad(3,i3GEOF.salvaMapa.dicionario)+"</a>";
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
				onde.innerHTML = "<a href='"+local+"' target='_blank' >"+$trad(4,i3GEOF.salvaMapa.dicionario)+"</a><br>" +
					"<a href='"+teste+"' target='_blank' >"+$trad(5,i3GEOF.salvaMapa.dicionario)+"</a>";
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
						i3GEO.janela.tempoMsg($trad(6,i3GEOF.salvaMapa.dicionario));
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
				i3GEO.php.salvaMapaBanco(temp,titulo,id_mapa,true,true);
			};
			texto = $trad(7,i3GEOF.salvaMapa.dicionario)+"<br><div id=i3GEOFsalvamapaMapa  ></div><br><br>"+$trad(15,i3GEOF.salvaMapa.dicionario);
			i3GEO.janela.prompt(texto + "<br><br>"+$trad(8,i3GEOF.salvaMapa.dicionario),funcaoOK);
			i3GEOF.salvaMapa.comboMapas("i3GEOFsalvamapaMapa");
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
		ins += '<p class="paragrafo" >'+$trad(9,i3GEOF.salvaMapa.dicionario)+'</p>' +
			'<p class="paragrafo" >'+$trad(10,i3GEOF.salvaMapa.dicionario)+'</p>' +
			'<div style=background-color:white;padding:5px;margin:5px >' +
			'	<p class="paragrafo" ><b>1- </b>'+$trad(11,i3GEOF.salvaMapa.dicionario) +
				$trad(12,i3GEOF.salvaMapa.dicionario) +
			'	<p class="paragrafo" >' + $trad(13,i3GEOF.salvaMapa.dicionario) +
			'	<div id="i3GEOFsalvaMapaLocal"></div>' +
			'</div>' +
			'<div style=background-color:white;padding:5px;margin:5px >' +
			'	<p class="paragrafo" ><b>2- </b>' + $trad(14,i3GEOF.salvaMapa.dicionario) +
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
	},
	comboMapas: function(onde){
		var	p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaMapas",
			combo = function(retorno){
				var n = retorno.length,
					i,
					ins = "" +
					"<select id='i3GEOFsalvamapaMapa' >" +
					"	<option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += 	"<option value='"+retorno[i].id_mapa+"'>"+retorno[i].id_mapa+" - "+retorno[i].titulo+"</option>";
				}
				ins += "</select>";
				$i(onde).innerHTML = ins;
			};
		i3GEO.util.ajaxGet(p,combo);		
	}
};
