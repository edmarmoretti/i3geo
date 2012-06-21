
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Número de pontos em polígonos

Calcula quantos pontos existem em cada polígono cruzando dois temas.

Veja:

<i3GEO.analise.nptPol>

Arquivo:

i3geo/ferramentas/nptpol/index.js.php

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
Classe: i3GEOF.nptpol
*/
i3GEOF.nptpol = {
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
			$i(iddiv).innerHTML += i3GEOF.nptpol.html();
			i3GEOF.nptpol.t0();
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
		ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOnptpolresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOnptpolfim" >';
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
		titulo = "Pontos em polígonos <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=19' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.nptpol");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.nptpol",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.nptpol.aguarde = $i("i3GEOF.nptpol_imagemCabecalho").style;
		i3GEOF.nptpol.inicia(divid);
		temp = function(){
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.nptpol.t0()") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.nptpol.t0()");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.nptpol.t0()") < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.nptpol.t0()");}
	},
	t0: function()
	{
		var ins = "<p class='paragrafo'>Ponto em pol&iacute;gono &eacute; uma opera&ccedil;&atilde;o que resulta em um novo tema contendo o cruzamento entre um tema com pontos e outro com pol&iacute;gonos considerando-se a extensão geográfica do mapa atual.</p>";
		ins += "<p class='paragrafo'>O resultado será um novo tema do tipo poligonal, sendo que a tabela de atributos conterá o total de pontos que se sobrepõem ao polígono.</p>";
		ins += "<p class='paragrafo'>Para gerar o cruzamento &eacute; necess&aacute;rio que no mapa exista pelo menos um tema poligonal e um com os pontos.</p>";
		i3GEO.util.proximoAnterior("","i3GEOF.nptpol.t1()",ins,"i3GEOFgradeDePontost0","i3GEOnptpolresultado");
	},
	t1: function(){
		var ins = "<p class='paragrafo' >Tema contendo os pontos:<br>";
		ins += "<div style='text-align:left;' id='i3GEOnptpolDivPontos' ></div><br>";
		ins += "<p class='paragrafo' >Tema contendo os polígonos:<br>";
		ins += "<div style='text-align:left;' id='i3GEOnptpolDivPoligonos' ></div>";
		i3GEO.util.proximoAnterior("i3GEOF.nptpol.t0()","i3GEOF.nptpol.t2()",ins,"i3GEOF.nptpol.t1","i3GEOnptpolresultado");
		i3GEOF.nptpol.comboTemasPontos();
		i3GEOF.nptpol.comboTemasPoligonos();
	},
	t2: function(){
		var ins = "<p class='paragrafo'>O tema com o cruzamento ser&aacute; adicionado ao mapa atual.";
		ins += "<br><br><input id=i3GEOnptpolbotao1 type='buttom' value='Calcular' />";
		i3GEO.util.proximoAnterior("i3GEOF.nptpol.t1()","",ins,"i3GEOF.nptpol.t2","i3GEOnptpolresultado");
		new YAHOO.widget.Button(
			"i3GEOnptpolbotao1",
			{onclick:{fn: i3GEOF.nptpol.calcula}}
		);		
	},
	/*
	Function: calcula
	
	Faz o cruzamento entre os temas
	
	Veja:
	
	<NPTPOL>
	*/
	calcula: function(){
		try{
			if(i3GEOF.nptpol.aguarde.visibility === "visible")
			{return;}
			i3GEOF.nptpol.aguarde.visibility = "visible";
			var p,
			cp,
			fim = function(retorno){
				if (retorno.data==undefined )
				{$i("i3GEOnptpolfim").innerHTML = "<p class='paragrafo' >Erro. A operação demorou muito.";}
				else
				{i3GEO.atualiza();}
				i3GEOF.nptpol.aguarde.visibility = "hidden";
			},
			ext;
			if(i3GEO.Interface.ATUAL === "googlemaps")
			{ext = i3GEO.Interface.googlemaps.bbox();}
			else
			{ext = i3GEO.parametros.mapexten;}
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=nptPol&temaPt="+$i("i3GEOnptpolPontos").value+"&temaPo="+$i("i3GEOnptpolPoligonos").value+"&ext="+ext;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"nptpol",fim);
		}
		catch(e){$i("i3GEOnptpolfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.nptpol.aguarde.visibility = "hidden";}
	},
	/*
	Function: comboTemasPontos
	
	Cria um combo com a lista de temas pontuais
	
	Veja:
	
	<i3GEO.util.comboTemas>
	*/
	comboTemasPontos: function(){
		i3GEO.util.comboTemas(
			"i3GEOnptpolPontos",
			function(retorno){
		 		$i("i3GEOnptpolDivPontos").innerHTML = retorno.dados;
		 		$i("i3GEOnptpolDivPontos").style.display = "block";
		 		if ($i("i3GEOnptpolPontos")){
		 			$i("i3GEOnptpolPontos").onchange = function(){
		 				i3GEO.mapa.ativaTema($i("i3GEOnptpolPontos").value);
		 			};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOnptpolPontos").value = i3GEO.temaAtivo;
				}
			},
			"i3GEOnptpolDivPontos",
			"",
			false,
			"pontos"
		);	
	},
	/*
	Function: comboTemasPoligonos
	
	Cria um combo com a lista de temas poligonais
	
	Veja:
	
	<i3GEO.util.comboTemas>
	*/
	comboTemasPoligonos: function(){
		i3GEO.util.comboTemas(
			"i3GEOnptpolPoligonos",
			function(retorno){
		 		$i("i3GEOnptpolDivPoligonos").innerHTML = retorno.dados;
		 		$i("i3GEOnptpolDivPoligonos").style.display = "block";
		 		if ($i("i3GEOnptpolPoligonos")){
		 			$i("i3GEOnptpolPoligonos").onchange = function(){
		 				i3GEO.mapa.ativaTema($i("i3GEOnptpolPoligonos").value);
		 			};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOnptpolPoligonos").value = i3GEO.temaAtivo;
				}
			},
			"i3GEOnptpolDivPoligonos",
			"",
			false,
			"poligonos"
		);	
	}
};
