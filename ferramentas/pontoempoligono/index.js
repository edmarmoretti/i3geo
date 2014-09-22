
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Ponto em pol&iacute;gono

Gera o cruzamento entre um tema de pontos e um tema de pol&iacute;gonos ou raster.
Um novo tema do tipo poligonal &eacute; criado contendo os atributos do tema cruzado.

Veja:

<i3GEO.analise.dialogo.pontoempoligono>

Arquivo:

i3geo/ferramentas/pontoempoligono/index.js.php

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
Classe: i3GEOF.pontoEmPoligono

*/
i3GEOF.pontoEmPoligono = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.pontoEmPoligono.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.pontoEmPoligono.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/pontoempoligono/dicionario.js",
				"i3GEOF.pontoEmPoligono.iniciaJanelaFlutuante()",
				"i3GEOF.pontoEmPoligono.dicionario_script"
			);
		}
		else{
			i3GEOF.pontoEmPoligono.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.pontoEmPoligono.html();
			i3GEOF.pontoEmPoligono.t0();
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
		var ins = '';
		ins +=	'<div style="padding:5px;background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOpontoEmPoligonoresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOpontoEmPoligonofim" >';
		ins +=	'</div>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		titulo = $trad("u13")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=18' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.pontoEmPoligono");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"150px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.pontoEmPoligono",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			false,
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/accessories-calculator.png"
		);
		divid = janela[2].id;
		janela[0].setFooter("<div id=i3GEOF.pontoEmPoligono_rodape style=background-color:#F2F2F2; ></div>");
		i3GEOF.pontoEmPoligono.aguarde = $i("i3GEOF.pontoEmPoligono_imagemCabecalho").style;
		i3GEOF.pontoEmPoligono.inicia(divid);
		temp = function(){
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.pontoEmPoligono.t0()") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.pontoEmPoligono.t0()");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.pontoEmPoligono.t0()") < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.pontoEmPoligono.t0()");}
	},
	t0: function()
	{
		var ins = "<img class=i3GeoExemploImg src='"+i3GEO.configura.locaplic+"/ferramentas/pontoempoligono/exemplo.png' />" +
		"<p class='paragrafo'>"+$trad('ajuda',i3GEOF.pontoEmPoligono.dicionario) +
		"<p class='paragrafo'>"+$trad('ajuda2',i3GEOF.pontoEmPoligono.dicionario) +
		"<p class='paragrafo'>"+$trad('ajuda3',i3GEOF.pontoEmPoligono.dicionario);
		i3GEO.util.proximoAnterior("","i3GEOF.pontoEmPoligono.t1()",ins,"i3GEOFgradeDePontost0","i3GEOpontoEmPoligonoresultado",true,"i3GEOF.pontoEmPoligono_rodape");
	},
	t1: function(){
		var ins = "<p class='paragrafo'>"+$trad('selecionaTema',i3GEOF.pontoEmPoligono.dicionario);
		ins += "<div id='i3GEOpontoEmPoligonoSelTemasPt' style='text-align:left;font-size:11px'></div>";
		i3GEO.util.proximoAnterior("i3GEOF.pontoEmPoligono.t0()","i3GEOF.pontoEmPoligono.t2()",ins,"i3GEOF.pontoEmPoligono.t1","i3GEOpontoEmPoligonoresultado",true,"i3GEOF.pontoEmPoligono_rodape");
		i3GEOF.pontoEmPoligono.comboTemasSelPt();
	},
	t2: function(){
		var erro = function(){
			var ins = "<p class=i3GEO.janela.tempoMsga >"+$trad('msgSelecionaTema',i3GEOF.pontoEmPoligono.dicionario);
			i3GEO.util.proximoAnterior("i3GEOF.pontoEmPoligono.t1()","",ins,"i3GEOF.pontoEmPoligono.t2","i3GEOpontoEmPoligonoresultado",true,"i3GEOF.pontoEmPoligono_rodape");
		};
		if($i("i3GEOpontoEmPoligonotemasComSelPt"))
		{
			if ($i("i3GEOpontoEmPoligonotemasComSelPt").value == "")
			{erro.call();}
			else
			{
				var ins = "<p class='paragrafo'>"+$trad('SelecionaTemaCruzamento',i3GEOF.pontoEmPoligono.dicionario);
				ins += "<div id='i3GEOpontoEmPoligonoSelTemasPo' style='text-align:left;font-size:11px'></div>";
				i3GEO.util.proximoAnterior("i3GEOF.pontoEmPoligono.t1()","i3GEOF.pontoEmPoligono.t3()",ins,"i3GEOF.pontoEmPoligono.t2","i3GEOpontoEmPoligonoresultado",true,"i3GEOF.pontoEmPoligono_rodape");
				i3GEOF.pontoEmPoligono.comboTemasSelPo();
			}
		}
		else
		{erro.call();}
	},
	t3: function(){
		var ins = "<p class='paragrafo'>"+$trad('adicionaTema',i3GEOF.pontoEmPoligono.dicionario);
		ins += "<br><br><input id=i3GEOpontoEmPoligonobotao1 type='buttom' value='Cruzar' />";
		i3GEO.util.proximoAnterior("i3GEOF.pontoEmPoligono.t2()","",ins,"i3GEOF.pontoEmPoligono.t3","i3GEOpontoEmPoligonoresultado",true,"i3GEOF.pontoEmPoligono_rodape");
		new YAHOO.widget.Button(
			"i3GEOpontoEmPoligonobotao1",
			{onclick:{fn: i3GEOF.pontoEmPoligono.executa}}
		);
	},
	/*
	Function: executa

	Executa a opera&ccedil;&atilde;o de cruzamento

	Veja:

	<PONTOEMPOLIGONO>
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
			{i3GEO.janela.tempoMsg($trad('msgRasterPoligono',i3GEOF.pontoEmPoligono.dicionario));}
			else
			{
				i3GEOF.pontoEmPoligono.aguarde.visibility = "visible";
				fim = function(retorno){
					i3GEOF.pontoEmPoligono.aguarde.visibility = "hidden";
					if (retorno.data==undefined )
					{i3GEO.janela.tempoMsg("Erro.");}
					else{
						i3GEO.atualiza();
						i3GEO.janela.mensagemSimples(retorno.data,$trad('colunas',i3GEOF.pontoEmPoligono.dicionario));
					}
				};
				p = i3GEO.configura.locaplic+"/ferramentas/pontoempoligono/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=pontoEmPoligono&temaPt="+temapt+"&temasPo="+tsl.join(",")+"&ext="+i3GEO.parametros.mapexten;
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

	Veja:

	<i3GEO.util.comboTemas>
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

	Veja:

	<i3GEO.util.checkTemas>
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
			"260px"
		);
	}
};