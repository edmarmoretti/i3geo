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
Class: i3GEOF.pontoEmPoligono

Gera o cruzamento entre um tema de pontos e um tema de polígonos ou raster.
*/
i3GEOF.pontoEmPoligono = {
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
			$i(iddiv).innerHTML += i3GEOF.pontoEmPoligono.html();
			i3GEOF.pontoEmPoligono.t0();
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
		ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOpontoEmPoligonoresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOpontoEmPoligonofim" >';
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
		titulo = "Ponto em pol&iacute;gono - raster <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=18' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.pontoEmPoligono");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.pontoEmPoligono",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.pontoEmPoligono.aguarde = $i("i3GEOF.pontoEmPoligono_imagemCabecalho").style;
		i3GEOF.pontoEmPoligono.inicia(divid);
	},
	t0: function()
	{
		var ins = "<p class='paragrafo'>Ponto em pol&iacute;gono &eacute; uma opera&ccedil;&atilde;o que resulta em um novo tema contendo o cruzamento entre um tema com pontos e outros com pol&iacute;gonos ou raster."
		ins += "<p class='paragrafo'>As informa&ccedil;&otilde;es do tema poligonal ser&atilde;o inseridas na tabela de atributos de um novo tema do tipo pontual."
		ins += "<p class='paragrafo'>Para gerar o cruzamento &eacute; necess&aacute;rio que no mapa exista pelo menos um tema poligonal e um com os pontos."
		i3GEO.util.proximoAnterior("","i3GEOF.pontoEmPoligono.t1()",ins,"i3GEOFgradeDePontost0","i3GEOpontoEmPoligonoresultado");
	},
	t1: function(){
		var ins = "<p class='paragrafo'>Escolha o tema que cont&eacute;m os pontos:";
		ins += "<div id='i3GEOpontoEmPoligonoSelTemasPt' style='text-align:left;font-size:11px'></div>";
		i3GEO.util.proximoAnterior("i3GEOF.pontoEmPoligono.t0()","i3GEOF.pontoEmPoligono.t2()",ins,"i3GEOF.pontoEmPoligono.t1","i3GEOpontoEmPoligonoresultado");
		i3GEOF.pontoEmPoligono.comboTemasSelPt();
	},
	t2: function(){
		var erro = function(){
			var ins = "<p class=alerta >Voc&ecirc; precisa escolher um tema com os pontos.";
			i3GEO.util.proximoAnterior("i3GEOF.pontoEmPoligono.t1()","",ins,"i3GEOF.pontoEmPoligono.t2","i3GEOpontoEmPoligonoresultado");
		};
		if($i("i3GEOpontoEmPoligonotemasComSelPt"))
		{
			if ($i("i3GEOpontoEmPoligonotemasComSelPt").value == "")
			{erro.call();}
			else
			{
 				var ins = "<p class='paragrafo'>Escolha os temas que ser&atilde;o utilizados para cruzar com os pontos:"
				ins += "<div id='i3GEOpontoEmPoligonoSelTemasPo' style='text-align:left;font-size:11px'></div>";
				i3GEO.util.proximoAnterior("i3GEOF.pontoEmPoligono.t1()","i3GEOF.pontoEmPoligono.t3()",ins,"i3GEOF.pontoEmPoligono.t2","i3GEOpontoEmPoligonoresultado");
				i3GEOF.pontoEmPoligono.comboTemasSelPo();
			}	
		}
		else
		{erro.call();}
	},
	t3: function(){
		var ins = "<p class='paragrafo'>O tema resultante ser&aacute; adicionado ao mapa atual.";
		ins += "<br><br><input id=i3GEOpontoEmPoligonobotao1 type='buttom' value='Cruzar' />";
		i3GEO.util.proximoAnterior("i3GEOF.pontoEmPoligono.t2()","",ins,"i3GEOF.pontoEmPoligono.t3","i3GEOpontoEmPoligonoresultado");
		new YAHOO.widget.Button(
			"i3GEOpontoEmPoligonobotao1",
			{onclick:{fn: i3GEOF.pontoEmPoligono.executa}}
		);		
	},
	/*
	Function: executa
	*/
	executa: function(){
		try{
			if(i3GEOF.pontoEmPoligono.aguarde.visibility === "visible")
			{return;}
			var t,tsl,p,cp,i,n,temapt,fim;
			temapt = $i("i3GEOpontoEmPoligonotemasComSelPt").value;
			t = $i("i3GEOpontoEmPoligonoSelTemasPo").getElementsByTagName("input");
			tsl = []; //temas poligonais
			n = t.length;
			for (i=0;i<n; i++){
				if (t[i].type == "checkbox"){
					if (t[i].checked == true)
					{tsl.push(t[i].name);}
				}
			}
			if (tsl == 0)
			{alert("Escolha um tema raster ou poligonal pelo menos");}
			else
			{
				i3GEOF.pontoEmPoligono.aguarde.visibility = "visible";
				fim = function(retorno){
					i3GEOF.pontoEmPoligono.aguarde.visibility = "hidden";
					if (retorno.data==undefined )
					{alert("Erro. A operação demorou muito.");}
					else{i3GEO.atualiza();}
				}
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=pontoEmPoligono&temaPt="+temapt+"&temasPo="+tsl.join(",");
				cp = new cpaint();
				cp.set_response_type("JSON");
				cp.call(p,"pontoEmPoligono",fim);
			}
		}
		catch(e){$i("i3GEOpontoEmPoligonofim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.pontoEmPoligono.aguarde.visibility = "hidden";}
	},
	/*
	Function: comboTemasSelPt
	
	Cria um combo com a lista de temas do tipo pontos
	*/
	comboTemasSelPt: function(){
		i3GEO.util.comboTemas(
			"i3GEOpontoEmPoligonotemasComSelPt",
			function(retorno){
		 		$i("i3GEOpontoEmPoligonoSelTemasPt").innerHTML = retorno.dados;
		 		$i("i3GEOpontoEmPoligonoSelTemasPt").style.display = "block";
		 		if ($i("i3GEOpontoEmPoligonotemasComSelPt")){
		 			$i("i3GEOpontoEmPoligonotemasComSelPt").onchange = function(){
		 				i3GEO.mapa.ativaTema($i("i3GEOpontoEmPoligonotemasComSelPt").value);
		 			};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOpontoEmPoligonotemasComSelPt").value = i3GEO.temaAtivo;
					$i("i3GEOpontoEmPoligonotemasComSelPt").onchange.call();
				}
			},
			"i3GEOpontoEmPoligonoSelTemasPt",
			"",
			false,
			"pontos"
		);	
	},
	/*
	Function: comboTemasSelPo
	
	Cria uma lista de temas do tipo poligonal ou raster
	*/
	comboTemasSelPo: function(){
		i3GEO.util.checkTemas(
			"i3GEOpontoEmPoligonotemasComSelPo",
			function(retorno){
		 		$i("i3GEOpontoEmPoligonoSelTemasPo").innerHTML = retorno.dados;
		 		$i("i3GEOpontoEmPoligonoSelTemasPo").style.display = "block";
			},
			"i3GEOpontoEmPoligonoSelTemasPo",
			"",
			"polraster",
			"i3GEOpontoEmPoligono",
			40
		);		
	}
};
<?php if(extension_loaded('zlib')){ob_end_flush();}?>