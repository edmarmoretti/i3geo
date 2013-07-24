
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Cor do fundo do mapa

Veja:

<i3GEO.mapa.dialogo.corFundo>

Arquivo:

i3geo/ferramentas/opcoes_fundo/index.js.php

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
Classe: i3GEOF.opcoesFundo
*/
i3GEOF.opcoesFundo = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.opcoesFundo.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.opcoesFundo.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/opcoes_fundo/dicionario.js",
				"i3GEOF.opcoesFundo.iniciaJanelaFlutuante()",
				"i3GEOF.opcoesFundo.dicionario_script"
			);
		}
		else{
			i3GEOF.opcoesFundo.iniciaJanelaFlutuante();
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
			i3GEOF.opcoesFundo.aguarde.visibility = "visible";
			$i(iddiv).innerHTML += i3GEOF.opcoesFundo.html();
			new YAHOO.widget.Button(
				"i3GEOopcoesFundobotao1",
				{onclick:{fn: i3GEOF.opcoesFundo.executa}}
			);
			var p = i3GEO.configura.locaplic+"/ferramentas/opcoes_fundo/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=pegacorfundo",
				cp = new cpaint(),
				retorno = function(retorno){
					i3GEOF.opcoesFundo.aguarde.visibility = "hidden";
					if(retorno.data.erro){i3GEO.janela.tempoMsg("Erro");return;}
					$i("i3GEOopcoesFundocor").value = retorno.data;
				};
			cp.set_response_type("JSON");
			cp.call(p,"corQM",retorno);
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
		if(i3GEO.Interface.ATUAL === "googlemaps" || i3GEO.Interface.ATUAL === "googleearth")
		{i3GEO.janela.tempoMsg($trad(1,i3GEOF.opcoesFundo.dicionario));}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = $inputText("","","i3GEOopcoesFundocor","",12,"") +
		'<img alt="aquarela.gif" style=cursor:pointer '+
		'src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.opcoesFundo.corj(\'i3GEOopcoesFundocor\')" /> ' +
		'<br><br><p class=paragrafo ><input size=20 id=i3GEOopcoesFundobotao1 type=button value="'+$trad(2,i3GEOF.opcoesFundo.dicionario)+'"  />';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opcoesFundo");
		};
		//cria a janela flutuante
		titulo = $trad("p9")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=6' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"210px",
			"80px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.opcoesFundo",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.opcoesFundo_corpo").style.backgroundColor = "white";
		$i("i3GEOF.opcoesFundo_corpo").style.textAlign = "left";
		i3GEOF.opcoesFundo.aguarde = $i("i3GEOF.opcoesFundo_imagemCabecalho").style;
		i3GEOF.opcoesFundo.inicia(divid);
	},
	/*
	Function: corj

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: executa

	Aplica a nova cor

	A cor do fundo na interface Openlayers &eacute; definida por meio de estilo, mas &eacute; necess&aacute;rio persistir a cor no mapfile existente no servidor.
	*/
	executa: function(){
		if(i3GEOF.opcoesFundo.aguarde.visibility === "visible")
		{return;}
		i3GEOF.opcoesFundo.aguarde.visibility = "visible";
		var temp = function(){
				i3GEOF.opcoesFundo.aguarde.visibility = "hidden";
				if(i3GEO.Interface.ATUAL === "openlayers"){
					//var layer = i3geoOL.getLayersByName("Nenhum")[0];
					//layer.mergeNewParams({"DESLIGACACHE":"sim"});
					//layer.mergeNewParams({r:Math.random()});
					if($i(i3geoOL.id+"_events"))
					{$i(i3geoOL.id+"_events").style.backgroundColor = "rgb("+$i("i3GEOopcoesFundocor").value+")";}
				}
				i3GEO.atualiza();
			},
			cor = $i("i3GEOopcoesFundocor").value,
			p = i3GEO.configura.locaplic+"/ferramentas/opcoes_fundo/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=corfundo&cor="+cor,
			cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"corQM",temp);
	}
};