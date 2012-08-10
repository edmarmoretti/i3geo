
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Formato de imagem

Define qual o formato de imagem ser&aacute; utilizado escolhendo o OUTPUTFORMAT existente no mapfile atual

Veja:

<i3GEO.mapa.dialogo.outputformat>

Arquivo:

i3geo/ferramentas/outputformat/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.outputformat
*/
i3GEOF.outputformat = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que não tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.outputformat.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.outputformat.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/outputformat/dicionario.js",
				"i3GEOF.outputformat.iniciaJanelaFlutuante()",
				"i3GEOF.outputformat.dicionario_script"
			);
		}
		else{
			i3GEOF.outputformat.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.outputformat.html();
		}
		catch(erro){alert(erro);}

	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;ão das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '<p class=paragrafo >Escolha o tipo de imagem para a gera&ccedil;ão do mapa. Para mais detalhes veja <a href="http://mapserver.org/mapfile/outputformat.html" target=_blank >outputformat</a></p>' +
			'<table class=lista4 width="250px">' +
			'	<tr>' +
			'		<td><input onclick="i3GEOF.outputformat.aplicar(\'AGG_Q\')" style="cursor:pointer;border:0px solid white;" type=radio name=i3GEOoutputformattipo value=nenhum ></td>' +
			'		<td>png</td>' +
			'		<td>Formato PNG com 256 cores gerado com a tecnologia AGG. Utilizado como default na versão 4.3 e posteriores do i3Geo</td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input onclick="i3GEOF.outputformat.aplicar(\'jpeg\')" style="cursor:pointer;border:0px solid white;" type=radio name=i3GEOoutputformattipo value=nenhum ></td>' +
			'		<td>jpeg</td>' +
			'		<td>Formato JPEG com 256 cores gerado com o driver GD</td>' +
			'	</tr>' +

			'</table>';
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
			i3GEO.janela.minimiza("i3GEOF.outputformat");
		};
		//cria a janela flutuante
		titulo = $trad("p15")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=89' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"300px",
			"260px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.outputformat",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.outputformat_corpo").style.backgroundColor = "white";
		$i("i3GEOF.outputformat_corpo").style.textAlign = "left";
		i3GEOF.outputformat.aguarde = $i("i3GEOF.outputformat_imagemCabecalho").style;
		i3GEOF.outputformat.inicia(divid);
	},
	/*
	Function: aplicar

	Aplica tipo de imagem

	Veja:

	<mudaOutputFormat>
	*/
	aplicar: function(tipo){
		if(i3GEOF.outputformat.aguarde.visibility === "visible")
		{return;}
		i3GEOF.outputformat.aguarde.visibility = "visible";
		try{
			var cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=mudaOutputFormat&tipo="+tipo,
				temp = function(retorno){
					i3GEOF.outputformat.aguarde.visibility = "hidden";
					if(retorno.data != "erro"){
						i3GEO.Interface.atualizaMapa();
					}
					else
					{alert("Nao foi possivel alterar o tipo");}
				};
			cp.set_response_type("JSON");
			cp.call(p,"void",temp);
		}
		catch(e){alert("Nao foi possivel alterar o tipo");i3GEOF.outputformat.aguarde.visibility = "hidden";}
	}
};
