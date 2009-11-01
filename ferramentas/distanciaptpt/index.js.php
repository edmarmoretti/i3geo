<?php if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
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
Class: i3GEOF.distanciaptpt

Calcula a distância entre os pontos de um tema e os pontos de outro tema.
*/
i3GEOF.distanciaptpt = {
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
			$i(iddiv).innerHTML += i3GEOF.distanciaptpt.html();
			i3GEOF.distanciaptpt.t0();
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
		ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOdistanciaptptresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOdistanciaptptfim" >';
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
		titulo = "Dist&acirc;ncia entre pontos <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=17' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			var temp = $i("i3GEOF.distanciaptpt_corpo");
			if(temp){
				if(temp.style.display === "block")
				{temp.style.display = "none";}
				else
				{temp.style.display = "block";}
			}
		};	
		janela = i3GEO.janela.cria(
			"400px",
			"220px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.distanciaptpt",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.distanciaptpt.aguarde = $i("i3GEOF.distanciaptpt_imagemCabecalho").style;
		i3GEOF.distanciaptpt.inicia(divid);
	},
	t0: function()
	{
		var ins = "<p class='paragrafo'>O cálculo de dist&acirc;ncias é feito de um ponto em rela&ccedil;&atilde;o aos mais pr&oacute;ximos existentes no mesmo tema ou em outro tema.";
		ins += "<p class='paragrafo'>O ponto origem, deve estar selecionado em um dos temas existentes no mapa.";
		ins += "<p class='paragrafo'>Os pontos de destino s&atilde;o selecionados em fun&ccedil;&atilde;o de uma dist&acirc;ncia fixa do ponto origem.";
		i3GEO.util.proximoAnterior("","i3GEOF.distanciaptpt.t1()",ins,"i3GEOFgradeDePontost0","i3GEOdistanciaptptresultado");
	},
	t1: function(){
		var ins = "<p class='paragrafo' >Tema que cont&eacute;m os pontos de origem (pelo menos um ponto deve estar selecionado):<br>";
		ins += "<div style='text-align:left;' id='i3GEOdistanciaptptSelTemasOrigem' ></div><br>";
		ins += "<p class='paragrafo' >Tema que cont&eacute;m o(s) ponto(s) de destino:<br>";
		ins += "<div style='text-align:left;' id='i3GEOdistanciaptptSelTemasDestino' ></div><br>";
		ins += "<p class='paragrafo' >Distância (metros) máxima que será considerada entre os pontos de origem e os pontos de destino:<br>";
		ins += $inputText("","","i3GEOFdistanciaptptdistancia","",10,"100000");
		i3GEO.util.proximoAnterior("i3GEOF.distanciaptpt.t0()","i3GEOF.distanciaptpt.t2()",ins,"i3GEOF.distanciaptpt.t1","i3GEOdistanciaptptresultado");
		i3GEOF.distanciaptpt.comboTemasOrigem();
		i3GEOF.distanciaptpt.comboTemasDestino();
	},
	t2: function(){
		var ins = "<p class='paragrafo' >Escolha os itens das tabelas de atributos dos temas de origem e de destino que ser&atilde;o acrescentados ao novo tema que ser&aacute; criado com o resultado do c&aacute;lculo.</p>";
		ins += "<p class='paragrafo' >Para o tema de origem:</p>";
		ins += "<div style='text-align:left;' id='i3GEOondeItensTemaOrigem' ></div>";
		ins += "<br><p class='paragrafo' >Para o tema de destino:</p>";
		ins += "<div style='text-align:left;' id='i3GEOondeItensTemaDestino' ></div>";
		i3GEO.util.proximoAnterior("i3GEOF.distanciaptpt.t1()","i3GEOF.distanciaptpt.t3()",ins,"i3GEOF.distanciaptpt.t2","i3GEOdistanciaptptresultado");
		i3GEOF.distanciaptpt.comboItensOrigem();
		i3GEOF.distanciaptpt.comboItensDestino();
	},
	t3: function(){
		var ins = "<p class='paragrafo'>O tema com o cálculo ser&aacute; adicionado ao mapa atual.";
		ins += "<br><br><input id=i3GEOdistanciaptptbotao1 type='buttom' value='Calcular' />";
		i3GEO.util.proximoAnterior("i3GEOF.distanciaptpt.t2()","",ins,"i3GEOF.distanciaptpt.t3","i3GEOdistanciaptptresultado");
		new YAHOO.widget.Button(
			"i3GEOdistanciaptptbotao1",
			{onclick:{fn: i3GEOF.distanciaptpt.calcula}}
		);		
	},
	/*
	Function: calcula
	
	Calcula a distância entre os temas
	*/
	calcula: function(){
		try{
			if(i3GEOF.distanciaptpt.aguarde.visibility === "visible")
			{return;}
			var distancia = $i("i3GEOFdistanciaptptdistancia").value,
				temaOrigem = $i("i3GEOdistanciaptpttemasComSel").value,
				temaDestino = $i("i3GEOdistanciaptpttemas").value,
				fim;
			if ((distancia*1 > 0) && (temaOrigem != "") && (temaDestino != "")){
				i3GEOF.distanciaptpt.aguarde.visibility = "visible";
				fim = function(retorno){
					if (retorno.data==undefined )
					{$i("i3GEOdistanciaptptfim").innerHTML = "<p class='paragrafo' >Erro. A operação demorou muito.";}
					else
					{i3GEO.atualiza();}
					i3GEOF.distanciaptpt.aguarde.visibility = "hidden";
				};
				var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=distanciaptpt&temaorigem="+temaOrigem+"&temadestino="+temaDestino+"&distancia="+distancia+"&itemorigem="+$i("i3GEOFdistanciaptptItemOrigem").value+"&itemdestino="+$i("i3GEOFdistanciaptptItemDestino").value;
				var cp = new cpaint();
				cp.set_response_type("JSON");
				cp.call(p,"distanciaptpt",fim);
			}
			else
			{$i("i3GEOdistanciaptptfim").innerHTML = "Algum par&acirc;metro n&atilde;o foi preenchido.";}
		}
		catch(e){$i("i3GEOdistanciaptptfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.distanciaptpt.aguarde.visibility = "hidden";}
	},
	/*
	Function: comboTemasOrigem
	
	Cria um combo com a lista de temas pontuais com elementos selecionados
	*/
	comboTemasOrigem: function(){
		i3GEO.util.comboTemas(
			"i3GEOdistanciaptpttemasComSel",
			function(retorno){
		 		$i("i3GEOdistanciaptptSelTemasOrigem").innerHTML = retorno.dados;
		 		$i("i3GEOdistanciaptptSelTemasOrigem").style.display = "block";
		 		if ($i("i3GEOdistanciaptpttemasComSel")){
		 			$i("i3GEOdistanciaptpttemasComSel").onchange = function(){
		 				i3GEO.mapa.ativaTema($i("i3GEOdistanciaptpttemasComSel").value);
		 			};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOdistanciaptpttemasComSel").value = i3GEO.temaAtivo;
					$i("i3GEOdistanciaptpttemasComSel").onchange.call();
				}
			},
			"i3GEOdistanciaptptSelTemasOrigem",
			"",
			false,
			"pontosSelecionados"
		);	
	},
	/*
	Function: comboTemasDestino
	
	Cria um combo com a lista de temas pontuais com elementos destino
	*/
	comboTemasDestino: function(){
		i3GEO.util.comboTemas(
			"i3GEOdistanciaptpttemas",
			function(retorno){
		 		$i("i3GEOdistanciaptptSelTemasDestino").innerHTML = retorno.dados;
		 		$i("i3GEOdistanciaptptSelTemasDestino").style.display = "block";
		 		if ($i("i3GEOdistanciaptpttemas")){
		 			$i("i3GEOdistanciaptpttemas").onchange = function(){
		 				i3GEO.mapa.ativaTema($i("i3GEOdistanciaptpttemas").value);
		 			};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOdistanciaptpttemas").value = i3GEO.temaAtivo;
					$i("i3GEOdistanciaptpttemas").onchange.call();
				}
			},
			"i3GEOdistanciaptptSelTemasDestino",
			"",
			false,
			"pontos"
		);	
	},
	/*
	Function: comboItensOrigem
	
	Cria um combo para escolha de um item do tema de origem
	*/
	comboItensOrigem: function(){
		i3GEO.util.comboItens(
			"i3GEOFdistanciaptptItemOrigem",
			$i("i3GEOdistanciaptpttemasComSel").value,
			function(retorno){
		 		$i("i3GEOondeItensTemaOrigem").innerHTML = retorno.dados;
		 		$i("i3GEOondeItensTemaOrigem").style.display = "block";
			},
			"i3GEOondeItensTemaOrigem"
		);
	},
	/*
	Function: comboItensDestino
	
	Cria um combo para escolha de um item do tema de destino
	*/
	comboItensDestino: function(){
		i3GEO.util.comboItens(
			"i3GEOFdistanciaptptItemDestino",
			$i("i3GEOdistanciaptpttemas").value,
			function(retorno){
		 		$i("i3GEOondeItensTemaDestino").innerHTML = retorno.dados;
		 		$i("i3GEOondeItensTemaDestino").style.display = "block";
			},
			"i3GEOondeItensTemaDestino"
		);
	}
};
<?php if(extension_loaded('zlib')){ob_end_flush();}?>