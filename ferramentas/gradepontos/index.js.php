<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Grade de pontos

Cria e adiciona um novo tema ao mapa contendo uma grade de pontos com espaçamento regular.

Veja:

<i3GEO.analise.dialogo.gradePontos>

Arquivo:

i3geo/ferramentas/gradepontos/index.js.php

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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
Classe: i3GEOF.gradeDePontos

*/
i3GEOF.gradeDePontos = {
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
			i3GEO.util.mudaCursor(i3GEO.configura.cursores,"default",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
			$i(iddiv).innerHTML += i3GEOF.gradeDePontos.html();
			i3GEOF.gradeDePontos.t0();
		}
		catch(erro){alert(erro);}
	},
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta
	
	Retorno:
	
	String com o código html
	*/
	html:function(){
		var ins = '';
		ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOgradedepontosresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOgradedepontosfim" >';
		ins +=	'</div>';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		titulo = "Grade de pontos <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=15' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.gradeDePontos");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.gradeDePontos",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.gradeDePontos.aguarde = $i("i3GEOF.gradeDePontos_imagemCabecalho").style;
		i3GEOF.gradeDePontos.inicia(divid);
	},
	t0: function()
	{
		var ins = "<p class='paragrafo' >A grade &eacute; formada por pontos espa&ccedil;ados conforme os par&acirc;metros de x e y.";
		ins += "<p class='paragrafo'>A grade criada &eacute; adicionada como um novo tema no mapa, podendo ser utilizada em opera&ccedil;&otilde;es como o cruzamento entre pontos e pol&iacute;gonos.";
		ins += "<p class='paragrafo'>O ponto inicial da grade deve ser definido pelo usu&aacute;rio e o ponto final (inferior direito) &eacute; definido em fun&ccedil;&atilde;o da abran&ecirc;ncia do mapa ou da quantidade de pontos.";
		i3GEO.util.proximoAnterior("","i3GEOF.gradeDePontos.t1()",ins,"i3GEOFgradeDePontost0","i3GEOgradedepontosresultado");
	},
	t1: function(){
		var ins = "<p class='paragrafo'>Espa&ccedil;amento da grade";
		ins += "<p class='paragrafo'>em X: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosxg' title='grau' type=text size=3 value='1'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosxm' title='minuto' type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosxs' title='segundo' type=text size=5 value='00.00'/>";
		ins += "<p class='paragrafo'>em Y: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosyg' title='grau' type=text size=3 value='1'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosym' title='minuto' type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosys' title='segundo' type=text size=5 value='00.00'/>";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t0()","i3GEOF.gradeDePontos.t2()",ins,"i3GEOF.gradeDePontos.t1","i3GEOgradedepontosresultado");
	},
	t2: function(){
		var temp,
			ins = "<p class='paragrafo'>Coordenadas do ponto inicial superior esquerdo (utilize o sinal negativo no grau quando ao sul do equador e a oeste). <b>Voc&ecirc; pode clicar no mapa para pegar o ponto.</b>";
		ins += "<p class='paragrafo'>em X: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosixg' title='grau'  type=text size=3 value='-00'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosixm' title='minuto'  type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosixs' title='segundo'  type=text size=5 value='00.00'/>";
		ins += "<p class='paragrafo'>em Y: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosiyg' title='grau'  type=text size=3 value='-00'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosiym' title='minuto'  type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosiys' title='segundo'  type=text size=5 value='00.00'/>";
		g_tipoacao = "capturaponto";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t1()","i3GEOF.gradeDePontos.t3()",ins,"i3GEOF.gradeDePontos.t2","i3GEOgradedepontosresultado");	
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.gradeDePontos.capturaPonto()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.gradeDePontos.capturaPonto()");}
		temp = function(){
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.gradeDePontos.capturaPonto()");
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	t3: function(){
		var ins = "<p class='paragrafo'>Número de pontos. Total máximo de 10.000";
		ins += "<p class='paragrafo'>em X: ";
		ins += "<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosnptx' title='pontos em x'  type=text size=3 value='10'/>";
		ins += "<p class='paragrafo'>em Y: ";
		ins += "<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosnpty' title='pontos em y'  type=text size=3 value='10'/>";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t2()","i3GEOF.gradeDePontos.t4()",ins,"i3GEOF.gradeDePontos.t3","i3GEOgradedepontosresultado");
	},
	t4: function(){
		var ins = "<p class='paragrafo'>A grade ser&aacute; acrescentada como um novo tema no mapa";
		ins += "<p class='paragrafo'><input id=i3GEOgradedepontosbotao1 size=18 class=executar type='button' value='Criar grade' />";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t3()","",ins,"i3GEOF.gradeDePontos.t4","i3GEOgradedepontosresultado");
		new YAHOO.widget.Button(
			"i3GEOgradedepontosbotao1",
			{onclick:{fn: i3GEOF.gradeDePontos.criaGrade}}
		);		
	},
	/*
	Function: criaGrade
	
	Cria a grade e adiciona um novo tema ao mapa
	
	Veja:
	
	<GRADEDEPONTOS>
	*/
	criaGrade: function(){
		try{
			if(i3GEOF.gradeDePontos.aguarde.visibility === "visible")
			{return;}
			i3GEOF.gradeDePontos.aguarde.visibility = "visible";
			var dx,dy,ix,iy,nptx,npty,fim,p,cp;
			dx = i3GEO.calculo.dms2dd($i("i3GEOgradedepontosxg").value,$i("i3GEOgradedepontosxm").value,$i("i3GEOgradedepontosxs").value);
			dy = i3GEO.calculo.dms2dd($i("i3GEOgradedepontosyg").value,$i("i3GEOgradedepontosym").value,$i("i3GEOgradedepontosys").value);
			ix = i3GEO.calculo.dms2dd($i("i3GEOgradedepontosixg").value,$i("i3GEOgradedepontosixm").value,$i("i3GEOgradedepontosixs").value);
			iy = i3GEO.calculo.dms2dd($i("i3GEOgradedepontosiyg").value,$i("i3GEOgradedepontosiym").value,$i("i3GEOgradedepontosiys").value);	
			nptx = $i("i3GEOgradedepontosnptx").value;
			npty = $i("i3GEOgradedepontosnpty").value;
			if ((dx == 0) || (dy == 0))
			{alert("Distância entre os pontos não pode ser 0");return;}
			if ((nptx == 0) || (npty == 0))
			{alert("Número de pontos não pode ser 0");return;}
			if (nptx * npty > 10000)
			{alert("Número de pontos não pode ser maior que 10.000");return;}
			fim = function(retorno)
			{
				i3GEOF.gradeDePontos.aguarde.visibility = "hidden";
				if (retorno.data == undefined )
				{$i("i3GEOgradedepontosfim").innerHTML = "<p class='paragrafo'>Erro. A operação demorou muito(?).";}
				else
				{i3GEO.atualiza("");}
			}
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=gradedepontos&xdd="+dx+"&ydd="+dy+"&px="+ix+"&py="+iy+"&nptx="+nptx+"&npty="+npty;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"gradeDePontos",fim);
		}
		catch(e){$i("i3GEOgradedepontosfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.gradeDePontos.aguarde.visibility = "hidden";}
	},
	/*
	Function: capturaPonto
	
	Captura um ponto no mapa e preenche os campos de coordenadas de início da grade
	*/
	capturaPonto: function(){
		var temp = g_tipoacao;
		g_tipoacao = "capturaponto";
		i3GEO.eventos.cliqueCapturaPt(
			"i3GEOgradedepontosixg",
			"i3GEOgradedepontosixm",
			"i3GEOgradedepontosixs",
			"i3GEOgradedepontosiyg",
			"i3GEOgradedepontosiym",
			"i3GEOgradedepontosiys"
		);
		g_tipoacao = temp;
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>
