<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
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

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	i3GEOF = [];
}
/*
Classe: i3GEOF.opcoesFundo
*/
i3GEOF.opcoesFundo = {
	/*
	Variavel: aguarde
	
	Estilo do objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
	*/
	aguarde: "",
	/*
	Function: inicia
	
	Inicia a ferramenta. É chamado por criaJanelaFlutuante
	
	Parametro:
	
	iddiv {String} - id do div que receberá o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			i3GEOF.opcoesFundo.aguarde.visibility = "visible";
			$i(iddiv).innerHTML += i3GEOF.opcoesFundo.html();
			new YAHOO.widget.Button(
				"i3GEOopcoesFundobotao1",
				{onclick:{fn: i3GEOF.opcoesFundo.executa}}
			);
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=pegacorfundo",
				cp = new cpaint(),
				retorno = function(retorno){
					i3GEOF.opcoesFundo.aguarde.visibility = "hidden";
					if(retorno.data.erro){alert("Ocorreu um erro");return;}
					$i("i3GEOopcoesFundocor").value = retorno.data;
				};
			cp.set_response_type("JSON");
			cp.call(p,"corQM",retorno);
		}
		catch(erro){alert(erro);}
		if(i3GEO.Interface.ATUAL === "googlemaps" || i3GEO.Interface.ATUAL === "googleearth")
		{alert("Essa operacao afeta apenas a ferramenta de impressao do mapa");}
	},
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta
	
	Retorno:
	
	String com o código html
	*/
	html:function(){
		var ins = $inputText("","","i3GEOopcoesFundocor","",12,"") +
		'<img alt="aquarela.gif" style=cursor:pointer '+
		'src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.opcoesFundo.corj(\'i3GEOopcoesFundocor\')" /> ' +
		'<br><br><p class=paragrafo ><input size=20 id=i3GEOopcoesFundobotao1 type=button value="Aplica"  />';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var janela,divid,temp,titulo,cabecalho,minimiza;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opcoesFundo");
		};
		//cria a janela flutuante
		titulo = "Cor do fundo <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=6' >&nbsp;&nbsp;&nbsp;</a>";
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
	
	Abre a janela para o usuário selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: executa
	
	Aplica a nova cor
	*/
	executa: function(){
		if(i3GEOF.opcoesFundo.aguarde.visibility === "visible")
		{return;}
		i3GEOF.opcoesFundo.aguarde.visibility = "visible";
		var temp = function(){
				i3GEOF.opcoesFundo.aguarde.visibility = "hidden";
				if(i3GEO.Interface.ATUAL === "openlayers"){
					var layer = i3geoOL.getLayersByName("Nenhum")[0];
					layer.mergeNewParams({"DESLIGACACHE":"sim"});
					layer.mergeNewParams({r:Math.random()});
				}
				i3GEO.atualiza();
			},
			cor = $i("i3GEOopcoesFundocor").value,
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=corfundo&cor="+cor,
			cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"corQM",temp);
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>