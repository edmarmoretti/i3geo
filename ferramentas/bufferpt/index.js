
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Buffer em um ponto

Arquivo:

i3geo/ferramentas/bufferpt/index.js.php

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
Classe: i3GEOF.bufferpt

Cria um novo tema com um pol&iacute;gono de entorno para uma determinada coordenada enviada como par&acirc;metro

*/
i3GEOF.bufferpt = {
	/*
	Propriedade: x

	Coordenada x (longitude) do ponto
	*/
	x: 0,
	/*
	Propriedade: y

	Coordenada y (latitude) do ponto
	*/
	y: 0,
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.bufferpt.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.bufferpt.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/bufferpt/dicionario.js",
				"i3GEOF.bufferpt.iniciaJanelaFlutuante()",
				"i3GEOF.bufferpt.dicionario_script"
			);
		}
		else{
			i3GEOF.bufferpt.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.bufferpt.html();
			new YAHOO.widget.Button(
				"i3GEObufferptbotao2",
				{onclick:{fn: i3GEOF.bufferpt.atualizaBox}}
			);
			new YAHOO.widget.Button(
				"i3GEObufferptbotao1",
				{onclick:{fn: i3GEOF.bufferpt.executa}}
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
		var ins = '' +
		'<p class=paragrafo >Dist&acirc;ncia em metros ao redor do ponto</p>' +
		$inputText("","","i3GEOFbufferptDistancia","",10,0) +
		'<br><br><p class=paragrafo ><input id=i3GEObufferptbotao1 size=16  type=button value="Criar"/>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

	Os par&acirc;metros x e y s&atilde;o utilizados para a defini&ccedil;&atilde;o das propriedades i3GEOF.bufferpt.x e i3GEOF.bufferpt.y. Se n&atilde;o forem fornecidos,
	seus valores permanecer&atilde;o como 0. Essas propriedades podem tamb&eacute;m ser definidas pela fun&ccedil;&atilde;o que ativou a ferramenta.

	Parametros:

	x {dd} - coordenada x (longitude)

	y {dd} - coordenada y (latitude)
	*/
	iniciaJanelaFlutuante: function(x,y){
		var janela,divid,titulo,cabecalho,minimiza;
		if(x)
		{i3GEOF.bufferpt.x = x;}
		if(y)
		{i3GEOF.bufferpt.y = y;}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.bufferpt");
		};
		//cria a janela flutuante
		titulo = $trad("u10")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=24&idajuda=3' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"210px",
			"110px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.bufferpt",
			false,
			"hd",
			cabecalho,
			""
		);
		divid = janela[2].id;
		i3GEOF.bufferpt.aguarde = $i("i3GEOF.bufferpt_imagemCabecalho").style;
		i3GEOF.bufferpt.inicia(divid);
	},
	/*
	Function: executa

	Altera o tamanho do mapa

	Veja:

	<MUDATAMANHO>
	*/
	executa: function(){
		try{
			if(i3GEOF.bufferpt.aguarde.visibility === "visible")
			{return;}
			var distancia = $i("i3GEOFbufferptDistancia").value,
				p,
				fim,
				cp;
			if (distancia*1 !== 0)
			{
				i3GEOF.bufferpt.aguarde.visibility = "visible";
				fim = function(retorno){
					i3GEOF.bufferpt.aguarde.visibility = "hidden";
					if (retorno.data === undefined )
					{i3GEO.janela.tempoMsg("Erro. A opera&ccedil;&atilde;o demorou muito.");}
					else
					{i3GEO.atualiza();}
				};
				p = i3GEO.configura.locaplic+"/ferramentas/buffer/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=criabuffer&tema=&distancia="+distancia+"&unir=nao&wkt=POINT("+i3GEOF.bufferpt.x+" "+i3GEOF.bufferpt.y+")";
				cp = new cpaint();
				cp.set_response_type("JSON");
				cp.call(p,"criaBuffer",fim);
			}
			else
			{i3GEO.janela.tempoMsg("Distancia invalida");}
		}
		catch(e){$i("i3GEObufferfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.bufferpt.aguarde.visibility = "hidden";}
	}
};
