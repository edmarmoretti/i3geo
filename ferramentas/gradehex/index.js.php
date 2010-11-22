<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Grade de hexágonos

Cria e adiciona um novo tema ao mapa contendo uma grade de hexágonos com espaçamento regular.

Veja:

<i3GEO.analise.dialogo.gradeHex>

Arquivo:

i3geo/ferramentas/gradehex/index.js.php

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
Classe: i3GEOF.gradeDeHex

*/
i3GEOF.gradeDeHex = {
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
			$i(iddiv).innerHTML += i3GEOF.gradeDeHex.html();
			i3GEOF.gradeDeHex.t0();
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
		ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOgradedehexresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOgradedehexfim" >';
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
		titulo = "Grade de hex&aacute;gonos <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=16' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.gradeDeHex");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.gradeDeHex",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.gradeDeHex.aguarde = $i("i3GEOF.gradeDeHex_imagemCabecalho").style;
		i3GEOF.gradeDeHex.inicia(divid);
	},
	t0: function()
	{
		var ins = "<p class='paragrafo' >A grade &eacute; formada por hexágonos espa&ccedil;ados conforme os par&acirc;metros de x e y.";
		ins += "<p class='paragrafo'>A grade criada &eacute; adicionada como um novo tema no mapa, podendo ser utilizada em opera&ccedil;&otilde;es como o cruzamento entre pontos e pol&iacute;gonos.";
		ins += "<p class='paragrafo'>O ponto inicial da grade deve ser definido pelo usu&aacute;rio e o ponto final (inferior direito) &eacute; definido em fun&ccedil;&atilde;o da abran&ecirc;ncia do mapa ou da quantidade de pontos.";
		i3GEO.util.proximoAnterior("","i3GEOF.gradeDeHex.t1()",ins,"i3GEOFgradeDeHext0","i3GEOgradedehexresultado");
	},
	t1: function(){
		var ins = "<p class='paragrafo'>Espa&ccedil;amento da grade";
		ins += "<p class='paragrafo'>em X: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexxg' title='grau' type=text size=3 value='1'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexxm' title='minuto' type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexxs' title='segundo' type=text size=5 value='00.00'/>";
		ins += "<p class='paragrafo'>em Y: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexyg' title='grau' type=text size=3 value='1'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexym' title='minuto' type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexys' title='segundo' type=text size=5 value='00.00'/>";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDeHex.t0()","i3GEOF.gradeDeHex.t2()",ins,"i3GEOF.gradeDeHex.t1","i3GEOgradedehexresultado");
	},
	t2: function(){
		var temp,
			ins = "<p class='paragrafo'>Coordenadas do ponto inicial superior esquerdo (utilize o sinal negativo no grau quando ao sul do equador e a oeste). <b>Voc&ecirc; pode clicar no mapa para pegar o ponto.</b>";
		ins += "<p class='paragrafo'>em X: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexixg' title='grau'  type=text size=3 value='-00'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexixm' title='minuto'  type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexixs' title='segundo'  type=text size=5 value='00.00'/>";
		ins += "<p class='paragrafo'>em Y: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexiyg' title='grau'  type=text size=3 value='-00'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexiym' title='minuto'  type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexiys' title='segundo'  type=text size=5 value='00.00'/>";
		g_tipoacao = "capturaponto";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDeHex.t1()","i3GEOF.gradeDeHex.t3()",ins,"i3GEOF.gradeDeHex.t2","i3GEOgradedehexresultado");	
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.gradeDeHex.capturaPonto()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.gradeDeHex.capturaPonto()");}
		temp = function(){
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.gradeDeHex.capturaPonto()");
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	t3: function(){
		var ins = "<p class='paragrafo'>Número de hex&aacute;gonos. Total máximo de 10.000";
		ins += "<p class='paragrafo'>em X: ";
		ins += "<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexnptx' title='pontos em x'  type=text size=3 value='10'/>";
		ins += "<p class='paragrafo'>em Y: ";
		ins += "<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexnpty' title='pontos em y'  type=text size=3 value='10'/>";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDeHex.t2()","i3GEOF.gradeDeHex.t4()",ins,"i3GEOF.gradeDeHex.t3","i3GEOgradedehexresultado");
	},
	t4: function(){
		var ins = "<p class='paragrafo'>A grade ser&aacute; acrescentada como um novo tema no mapa";
		ins += "<p class='paragrafo'><input id=i3GEOgradedehexbotao1 size=18 class=executar type='button' value='Criar grade' />";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDeHex.t3()","",ins,"i3GEOF.gradeDeHex.t4","i3GEOgradedehexresultado");
		new YAHOO.widget.Button(
			"i3GEOgradedehexbotao1",
			{onclick:{fn: i3GEOF.gradeDeHex.criaGrade}}
		);		
	},
	/*
	Function: criaGrade
	
	Cria a grade e adiciona um novo tema ao mapa
	
	Veja:
	
	<GRADEDEHEX>
	*/
	criaGrade: function(){
		try{
			if(i3GEOF.gradeDeHex.aguarde.visibility === "visible")
			{return;}
			i3GEOF.gradeDeHex.aguarde.visibility = "visible";
			var dx,dy,ix,iy,nptx,npty,fim,p,cp;
			dx = i3GEO.calculo.dms2dd($i("i3GEOgradedehexxg").value,$i("i3GEOgradedehexxm").value,$i("i3GEOgradedehexxs").value);
			dy = i3GEO.calculo.dms2dd($i("i3GEOgradedehexyg").value,$i("i3GEOgradedehexym").value,$i("i3GEOgradedehexys").value);
			ix = i3GEO.calculo.dms2dd($i("i3GEOgradedehexixg").value,$i("i3GEOgradedehexixm").value,$i("i3GEOgradedehexixs").value);
			iy = i3GEO.calculo.dms2dd($i("i3GEOgradedehexiyg").value,$i("i3GEOgradedehexiym").value,$i("i3GEOgradedehexiys").value);	
			nptx = $i("i3GEOgradedehexnptx").value;
			npty = $i("i3GEOgradedehexnpty").value;
			if ((dx == 0) || (dy == 0))
			{alert("Distância entre os pontos não pode ser 0");return;}
			if ((nptx == 0) || (npty == 0))
			{alert("Número de pontos não pode ser 0");return;}
			if (nptx * npty > 10000)
			{alert("Número de pontos não pode ser maior que 10.000");return;}
			fim = function(retorno)
			{
				i3GEOF.gradeDeHex.aguarde.visibility = "hidden";
				if (retorno.data == undefined )
				{$i("i3GEOgradedehexfim").innerHTML = "<p class='paragrafo'>Erro. A operação demorou muito(?).";}
				else
				{i3GEO.atualiza();}
			}
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=gradedehex&xdd="+dx+"&ydd="+dy+"&px="+ix+"&py="+iy+"&nptx="+nptx+"&npty="+npty;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"gradeDeHex",fim);
		}
		catch(e){$i("i3GEOgradedehexfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEOF.gradeDeHex.aguarde.visibility = "hidden";}
	},
	/*
	Function: capturaPonto
	
	Captura um ponto no mapa e preenche os campos de coordenadas de início da grade
	*/
	capturaPonto: function(){
		var temp = g_tipoacao;
		g_tipoacao = "capturaponto";
		i3GEO.eventos.cliqueCapturaPt(
			"i3GEOgradedehexixg",
			"i3GEOgradedehexixm",
			"i3GEOgradedehexixs",
			"i3GEOgradedehexiyg",
			"i3GEOgradedehexiym",
			"i3GEOgradedehexiys"
		);
		g_tipoacao = temp;
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>