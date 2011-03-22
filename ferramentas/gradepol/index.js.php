<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Grade de polígonos

Cria e adiciona um novo tema ao mapa contendo uma grade de polígonos com espaçamento regular.

Veja:

<i3GEO.analise.dialogo.gradePol>

Arquivo:

i3geo/ferramentas/gradepol/index.js.php

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
Classe: i3GEOF.gradeDePoligonos

*/
i3GEOF.gradeDePoligonos = {
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
			$i(iddiv).innerHTML += i3GEOF.gradeDePoligonos.html();
			i3GEOF.gradeDePoligonos.t0();
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
		ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOgradedepoligonosresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOgradedepoligonosfim" >';
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
		titulo = "Grade de pol&iacute;gonos <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=14' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.gradeDePoligonos");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.gradeDePoligonos",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.gradeDePoligonos.aguarde = $i("i3GEOF.gradeDePoligonos_imagemCabecalho").style;
		i3GEOF.gradeDePoligonos.inicia(divid);
	},
	t0: function()
	{
		var ins = "<p class='paragrafo' >A grade &eacute; formada por pol&iacute;gonos espa&ccedil;ados conforme os par&acirc;metros de dx e dy.";
		ins += "<p class='paragrafo'>A grade criada &eacute; adicionada como um novo tema no mapa, podendo ser utilizada em opera&ccedil;&otilde;es como o cruzamento entre pontos e pol&iacute;gonos.";
		ins += "<p class='paragrafo'>O ponto inicial da grade deve ser definido pelo usu&aacute;rio e o ponto final (inferior direito) &eacute; definido em fun&ccedil;&atilde;o da abrang&ecirc;ncia do mapa ou quantidade de c&eacute;lulas.";
		i3GEO.util.proximoAnterior("","i3GEOF.gradeDePoligonos.t1()",ins,"i3GEOFgradeDePoligonost0","i3GEOgradedepoligonosresultado");
	},
	t1: function(){
		var ins = "<p class='paragrafo'>Dist&acirc;ncia entre c&eacute;lulas";
		ins += "<p class='paragrafo'>em X: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosxg' title='grau' type=text size=3 value='1'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosxm' title='minuto' type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosxs' title='segundo' type=text size=5 value='00.00'/>";
		ins += "<p class='paragrafo'>em Y: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosyg' title='grau' type=text size=3 value='1'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosym' title='minuto' type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosys' title='segundo' type=text size=5 value='00.00'/>";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePoligonos.t0()","i3GEOF.gradeDePoligonos.t2()",ins,"i3GEOF.gradeDePoligonos.t1","i3GEOgradedepoligonosresultado");
	},
	t2: function(){
		var temp,
			ins = "<p class='paragrafo'>Coordenadas do ponto inicial superior esquerdo (utilize o sinal negativo no grau quando ao sul do equador e a oeste). <b>Voc&ecirc; pode clicar no mapa para pegar o ponto.</b>";
		ins += "<p class='paragrafo'>em X: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosixg' title='grau'  type=text size=3 value='-00'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosixm' title='minuto'  type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosixs' title='segundo'  type=text size=5 value='00.00'/>";
		ins += "<p class='paragrafo'>em Y: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosiyg' title='grau'  type=text size=3 value='-00'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosiym' title='minuto'  type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosiys' title='segundo'  type=text size=5 value='00.00'/>";
		g_tipoacao = "capturaponto";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePoligonos.t1()","i3GEOF.gradeDePoligonos.t3()",ins,"i3GEOF.gradeDePoligonos.t2","i3GEOgradedepoligonosresultado");	

		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.gradeDePoligonos.capturaPonto()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.gradeDePoligonos.capturaPonto()");}		
		temp = function(){
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.gradeDePoligonos.capturaPonto()");
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	t3: function(){
		var ins = "<p class='paragrafo'>Número de c&eacute;lulas. Total máximo de 10.000";
		ins += "<p class='paragrafo'>em X: ";
		ins += "<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosnptx' title='pontos em x'  type=text size=3 value='10'/>";
		ins += "<p class='paragrafo'>em Y: ";
		ins += "<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosnpty' title='pontos em y'  type=text size=3 value='10'/>";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePoligonos.t2()","i3GEOF.gradeDePoligonos.t4()",ins,"i3GEOF.gradeDePoligonos.t3","i3GEOgradedepoligonosresultado");
	},
	t4: function(){
		var ins = "<p class='paragrafo'>A grade ser&aacute; acrescentada como um novo tema no mapa";
		ins += "<p class='paragrafo'><input id=i3GEOgradedepoligonosbotao1 size=18 class=executar type='button' value='Criar grade' />";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePoligonos.t3()","",ins,"i3GEOF.gradeDePoligonos.t4","i3GEOgradedepoligonosresultado");
		new YAHOO.widget.Button(
			"i3GEOgradedepoligonosbotao1",
			{onclick:{fn: i3GEOF.gradeDePoligonos.criaGrade}}
		);		
	},
	/*
	Function: criaGrade
	
	Cria a grade e adiciona um novo tema ao mapa
	
	Veja:
	
	<GRADEDEPOL>
	*/
	criaGrade: function(){
		try{
			if(i3GEOF.gradeDePoligonos.aguarde.visibility === "visible")
			{return;}
			i3GEOF.gradeDePoligonos.aguarde.visibility = "visible";
			var dx,dy,ix,iy,nptx,npty,fim,p,cp;
			dx = i3GEO.calculo.dms2dd($i("i3GEOgradedepoligonosxg").value,$i("i3GEOgradedepoligonosxm").value,$i("i3GEOgradedepoligonosxs").value);
			dy = i3GEO.calculo.dms2dd($i("i3GEOgradedepoligonosyg").value,$i("i3GEOgradedepoligonosym").value,$i("i3GEOgradedepoligonosys").value);
			ix = i3GEO.calculo.dms2dd($i("i3GEOgradedepoligonosixg").value,$i("i3GEOgradedepoligonosixm").value,$i("i3GEOgradedepoligonosixs").value);
			iy = i3GEO.calculo.dms2dd($i("i3GEOgradedepoligonosiyg").value,$i("i3GEOgradedepoligonosiym").value,$i("i3GEOgradedepoligonosiys").value);	
			nptx = $i("i3GEOgradedepoligonosnptx").value;
			npty = $i("i3GEOgradedepoligonosnpty").value;
			if ((dx == 0) || (dy == 0))
			{alert("Distância entre as celulas não pode ser 0");return;}
			if ((nptx == 0) || (npty == 0))
			{alert("Número de pontos não pode ser 0");return;}
			if (nptx * npty > 10000)
			{alert("Número de celulas não pode ser maior que 10.000");return;}
			fim = function(retorno)
			{
				i3GEOF.gradeDePoligonos.aguarde.visibility = "hidden";
				if (retorno.data == undefined )
				{$i("i3GEOgradedepoligonosfim").innerHTML = "<p class='paragrafo'>Erro. A operação demorou muito(?).";}
				else
				{i3GEO.atualiza("");}
			}
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=gradedepol&xdd="+dx+"&ydd="+dy+"&px="+ix+"&py="+iy+"&nptx="+nptx+"&npty="+npty;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"gradeDePoligonos",fim);
		}
		catch(e){$i("i3GEOgradedepoligonosfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEOF.gradeDeHex.aguarde.visibility = "hidden";}
	},
	/*
	Function: capturaPonto
	
	Captura um ponto no mapa e preenche os campos de coordenadas de início da grade
	*/
	capturaPonto: function(){
		var temp = g_tipoacao;
		g_tipoacao = "capturaponto";
		i3GEO.eventos.cliqueCapturaPt(
			"i3GEOgradedepoligonosixg",
			"i3GEOgradedepoligonosixm",
			"i3GEOgradedepoligonosixs",
			"i3GEOgradedepoligonosiyg",
			"i3GEOgradedepoligonosiym",
			"i3GEOgradedepoligonosiys"
		);
		g_tipoacao = temp;
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>
