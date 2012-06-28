
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Buffer em um ponto

Arquivo:

i3geo/ferramentas/bufferpt/index.js.php

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
	i3GEOF = [];
}
/*
Classe: i3GEOF.bufferpt

Cria um novo tema com um pol&iacute;gono de entorno para uma determinada coordenada enviada como parâmetro

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
		catch(erro){alert(erro);}
	},
	/*
	Function: html
	
	Gera o c&oacute;digo html para apresenta&ccedil;ão das op&ccedil;&otilde;es da ferramenta
	
	Retorno:
	
	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '' +
		'<p class=paragrafo >Distância em metros ao redor do ponto</p>' +
		$inputText("","","i3GEOFbufferptDistancia","",10,0) +
		'<br><br><p class=paragrafo ><input id=i3GEObufferptbotao1 size=16  type=button value="Criar"/>';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	
	Os parâmetros x e y são utilizados para a defini&ccedil;ão das propriedades i3GEOF.bufferpt.x e i3GEOF.bufferpt.y. Se não forem fornecidos,
	seus valores permanecerão como 0. Essas propriedades podem tamb&eacute;m ser definidas pela fun&ccedil;ão que ativou a ferramenta.
	
	Parametros:
	
	x {dd} - coordenada x (longitude)
	
	y {dd} - coordenada y (latitude)
	*/	
	criaJanelaFlutuante: function(x,y){
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
		titulo = "Entorno de um ponto <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=24&idajuda=3' >&nbsp;&nbsp;&nbsp;</a>";
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
					{alert("Erro. A opera&ccedil;ão demorou muito.");}
					else
					{i3GEO.atualiza();}
				};
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=criabuffer&tema=&distancia="+distancia+"&unir=nao&wkt=POINT("+i3GEOF.bufferpt.x+" "+i3GEOF.bufferpt.y+")";
				cp = new cpaint();
				cp.set_response_type("JSON");
				cp.call(p,"criaBuffer",fim);
			}
			else
			{alert("Distancia invalida");}
		}
		catch(e){$i("i3GEObufferfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.bufferpt.aguarde.visibility = "hidden";}
		
		
		
	}	
};
