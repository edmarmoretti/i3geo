/*
Title: Download de um tema

Faz o download de um tema existente na &aacute;rvore de camadas.

Veja:

<i3GEO.tema.dialogo.download>

Arquivo:

i3geo/ferramentas/download/index.js.php

Licenca:

GPL2

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
Classe: i3GEOF.download
*/
i3GEOF.download = {
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(tema){
		i3GEOF.download.iniciaDicionario(tema);
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(tema){
		if(typeof(i3GEOF.download.dicionario) === 'undefined'){
			if(!tema){
				i3GEO.util.scriptTag(
					i3GEO.configura.locaplic+"/ferramentas/download/dicionario.js",
					"i3GEOF.download.iniciaJanelaFlutuante()",
					"i3GEOF.download.dicionario_script"
				);
			}
			else{
				i3GEO.util.scriptTag(
					i3GEO.configura.locaplic+"/ferramentas/download/dicionario.js",
					"i3GEOF.download.iniciaJanelaFlutuante('"+tema+"')",
					"i3GEOF.download.dicionario_script"
				);
			}
		}
		else{
			i3GEOF.download.iniciaJanelaFlutuante(tema);
		}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Veja:

	<DOWNLOAD2>

	Parametros:

	divid {String} - id do div que receber&aacute; o conteudo HTML da ferramenta

	tema {String} - c&oacute;digo do tema
	*/
	html:function(divid,tema){
		var cp,p,ins,mostraDownload,c;
		ins = '<div class="container-fluid" style="top:0px;position:absolute;"><h5>'+$trad('download',i3GEOF.download.dicionario)+'</h5>';
		ins += '<div id=i3GEOdownloadResultado ></div></div>';
		$i(divid).innerHTML += ins;
		c = i3GEO.arvoreDeCamadas.pegaTema(tema);
		//wms
		if(c.connectiontype === 7){
			i3GEOF.download.aguarde.visibility = "hidden";
			ins = c.wmsurl.replace("wms","wfs")+"&typeName="+c.wmsname+"&SERVICE=wfs&REQUEST=getFeature";
			$i("i3GEOdownloadResultado").innerHTML = "<a target='_blank' href='"+ins+"' >"+ins+"</a></div>";
		}
		else{
			mostraDownload = function(retorno){
				var ins = "",
					arqs,n,arq, temp;
				if (retorno.data != undefined){
					retorno = retorno.data;
					arqs = retorno.arquivos.split(",");
					n = arqs.length;
					if(retorno == "erro"){
						ins = "<h5 class='alert alert-warning'>"+$trad('erroTema',i3GEOF.download.dicionario)+"</h5>";
					}
					else{
                        ins += "<h5>" + $trad('arquivook',i3GEOF.download.dicionario) + "</h5>";
					    var url = i3GEO.configura.locaplic + "/ferramentas/download/forcedownload.php?g_sid=" + i3GEO.configura.sid;
                        var link = document.createElement("a");
                        $(link).click(function(e) {
                          e.preventDefault();
                          window.location.href = url;
                        });
                        $(link).click();
					}
					if(retorno.nreg){
						ins += "<h5>"+$trad('registros',i3GEOF.download.dicionario)+" ="+retorno.nreg + "</h5>";
					}
				}
				else{
					ins = "<h5 class='alert alert-warning'>"+$trad("x66")+"</h5>";
				}
				$i("i3GEOdownloadResultado").innerHTML = ins + "</div>";
				i3GEOF.download.aguarde.visibility = "hidden";
			};
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=download3&tema="+tema;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"downloadTema",mostraDownload);
		}
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

	Parametros:

	tema {String} - c&oacute;digo do tema
	*/
	iniciaJanelaFlutuante: function(tema){
		var janela,divid,titulo;
		if($i("i3GEOF.download")){
			return;
		}
		if(arguments.length == 0)
		{tema = i3GEO.temaAtivo;}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.download",200);
		};
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >Download</span></div>";
		janela = i3GEO.janela.cria(
			"300px",
			"200px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.download",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true,
			"",
			"",
			"",
			"",
			"82"
		);
		divid = janela[2].id;
		i3GEOF.download.aguarde = $i("i3GEOF.download_imagemCabecalho").style;
		i3GEOF.download.aguarde.visibility = "visible";
		i3GEOF.download.html(divid,tema);
	}
};