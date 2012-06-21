
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Insere gráfico interativo

Inclui gráficos em elementos indicados pelo usuário tendo como fonte a tabela de atributos de um tema.
Abre uma janela com várias opções e lista de itens para os gráficos.
O tema que será utilizado é o que estiver armazenado na variável global i3GEO.temaAtivo

Veja:

<i3GEO.mapa.dialogo.cliqueGrafico>

Arquivo: i3geo/ferramentas/inseregrafico/index.js.php

About: Licença

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
Classe: i3GEOF.insereGrafico

*/
i3GEOF.insereGrafico = {
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
			$i(iddiv).innerHTML += i3GEOF.insereGrafico.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOinseregraficoguia1","i3GEOinseregraficoguia");
			//eventos das guias
			$i("i3GEOinseregraficoguia1").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOinseregraficoguia1","i3GEOinseregraficoguia");};
			$i("i3GEOinseregraficoguia2").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOinseregraficoguia2","i3GEOinseregraficoguia");};
			new YAHOO.widget.Button(
				"i3GEOinseregraficobotao1",
				{onclick:{fn: i3GEOF.insereGrafico.legenda}}
			);
			i3GEO.util.mensagemAjuda("i3GEOinseregraficomen1",$i("i3GEOinseregraficomen1").innerHTML);		
			//i3GEO.php.listaItensTema(i3GEOF.graficoTema.montaListaItens,i3GEO.temaAtivo);
			i3GEOF.insereGrafico.ativaFoco();
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
		ins += '<div id=i3GEOinseregraficoguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">';
		ins += '	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOinseregraficoguia1" style="text-align:center;left:0px;" >Fonte dos dados</div></em></a></li>';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOinseregraficoguia2" style="text-align:center;left:0px;" >Propriedades</div></em></a></li>';
		ins += '	</ul>';
		ins += '</div><br>';
		ins += '	<div class=guiaobj id="i3GEOinseregraficoguia1obj" style="left:1px;display:none;">';
		ins += '		<p class="paragrafo">Escolha o tema com os dados:';
		ins += '		<div id=i3GEOinseregraficotemasi style="display:block;position:relative;top:10px;left:0px;text-align:left;">Aguarde...';
		ins += '		</div>';	
		ins += '		<div id=i3GEOinseregraficolistai class=digitar style="left:0px;top:20px;330px;height:80px;overflow:auto;display:block;">Escolha o tema para ver a lista de itens</div>';
		ins += '		<br><br><br>';
		ins += '		<p class="paragrafo"><input id=i3GEOinseregraficobotao1 size=35  type=button value="mostrar legenda no mapa" />';
		ins += '		<div id=i3GEOinseregraficomen1 style=top:10px;left:1px ><p class="paragrafo">Marque os itens para compor as partes do gr&aacute;fico: Edite os valores de cor (R,G,B) conforme o desejado. Ap&oacute;s escolher os itens, clique no elemento do mapa para inserir o gr&aacute;fico.</div>';
		ins += '	</div>';
		ins += '	<div class=guiaobj id="i3GEOinseregraficoguia2obj" style="left:1px;display:none;">';
		ins += '		<table summary="" class=lista width="70%">';
		ins += '		<tr>  ';
		ins += '			<td>Tamanho do círculo:</td>';
		ins += '			<td>';
		ins += $inputText("","","i3GEOinseregraficow","",5,"50")+'</td>';
		ins += '		</tr><tr><td></td><td>&nbsp;</td></tr>';
		ins += '		<tr>';
		ins += '			<td>Inclina&ccedil;&atilde;o do círculo:</td>';
		ins += '			<td>';
		ins += $inputText("","","i3GEOinseregraficoinclinacao","",4,"1.5")+'</td>';
		ins += '		</tr><tr><td></td><td>&nbsp;</td></tr>';
		ins += '		<tr>';
		ins += '			<td>Tamanho da sombra:</td>';
		ins += '			<td>';
		ins += $inputText("","","i3GEOinseregraficosombra","",4,"5")+'</td>';
		ins += '		</tr><tr><td></td><td>&nbsp;</td></tr>';
		ins += '		</table>';			
		ins += '	</div>';
		ins += '</div>	';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//funcao que sera executada ao ser clicado no cabeçalho da janela
		cabecalho = function(){
			i3GEOF.insereGrafico.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.insereGrafico");
		};
		//cria a janela flutuante
		titulo = "Insere grafico <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=8&idajuda=80' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"400px",
			"320px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.insereGrafico",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.insereGrafico_corpo").style.backgroundColor = "white";
		i3GEOF.insereGrafico.aguarde = $i("i3GEOF.insereGrafico_imagemCabecalho").style;
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.insereGrafico.insere()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.insereGrafico.insere()");}
		temp = function(){
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.insereGrafico.insere()");
			//if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.insereGrafico.comboTemas()") > 0)
			//{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.insereGrafico.comboTemas()");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		//if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.insereGrafico.comboTemas()") < 0)
		//{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.insereGrafico.comboTemas()");}		
		i3GEOF.insereGrafico.inicia(divid);
	},
	/*
	Function: ativaFoco
	
	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		if(g_tipoacao !== 'inseregrafico'){
			i3GEO.barraDeBotoes.ativaIcone("inseregrafico");
			g_tipoacao='inseregrafico';
			g_operacao='inseregrafico';
			temp = Math.random() + "a";
			temp = temp.split(".");
			g_nomepin = "pin"+temp[1];
			i3GEOF.insereGrafico.comboTemas();
			$i("i3GEOinseregraficolistai").innerHTML = "";
			var i = $i("i3GEOF.insereGrafico_c").style;
			i3GEO.janela.ULTIMOZINDEX++;
			i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
		}			
	},
	/*
	Function: insere
	
	Insere um grafico no mapa na posição clicada

	O ponto é obtidos do objeto objposicaocursor e os demais parâmetros da janela interna aberta no iframe "wdocai"
	
	Veja:
	
	<i3GEO.php.insereSHPgrafico>
	*/
	insere: function(){
		if (g_tipoacao === "inseregrafico"){
			var tema = $i("i3GEOinseregraficotemasLigados").value,
				width = $i("i3GEOinseregraficow").value,
				inclinacao = $i("i3GEOinseregraficoinclinacao").value,
				shadow_height = $i("i3GEOinseregraficosombra").value,
				itens,
				temp;
			if (tema === ""){alert("Nenhum tema definido para pegar os dados");}
			else{
				itens = i3GEOF.insereGrafico.pegaItensMarcados();
				if (itens === "")
				{alert("Nenhum item foi escolhido");}
				else{
					temp = function(){
						i3GEOF.insereGrafico.aguarde.visibility = "hidden";
						i3GEO.atualiza();
					};
					i3GEOF.insereGrafico.aguarde.visibility = "visible";
					//i3GEO.contadorAtualiza++;
					i3GEO.php.insereSHPgrafico(temp,tema,objposicaocursor.ddx,objposicaocursor.ddy,itens,shadow_height,width,inclinacao);
				}
			}
		}
	},
	/*
	Function: comboTemas
	
	Cria o combo com os temas disponíveis (temas ligados) para adição dos gráficos.
	
	Veja:
	
	<i3GEO.util.comboTemas>
	*/
	comboTemas: function(){
		i3GEO.util.comboTemas(
			"i3GEOinseregraficotemasLigados",
			function(retorno){
		 		$i("i3GEOinseregraficotemasi").innerHTML = retorno.dados;
		 		if ($i("i3GEOinseregraficotemasLigados")){
		 			$i("i3GEOinseregraficotemasLigados").onchange = function(){
		 				$i("i3GEOinseregraficolistai").innerHTML = "<p style=color:red >Aguarde...<br>";
		 				i3GEO.php.listaItensTema(i3GEOF.insereGrafico.listaItens,$i("i3GEOinseregraficotemasLigados").value);
		 				i3GEO.mapa.ativaTema($i("i3GEOinseregraficotemasLigados").value);
		 			};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOinseregraficotemasLigados").value = i3GEO.temaAtivo;
					$i("i3GEOinseregraficotemasLigados").onchange.call();
				}
			},
			"i3GEOinseregraficotemasi",
			"",
			false,
			"ligados"
		);
	},
	/*
	Function: listaItens
	
	Monta a listagem de itens de um tema com a opção de seleção de cor
	
	Parametro:
	
	retorno {JSON}
	*/
	listaItens: function(retorno){
		try{
			var i,
				n,
				ins = [];
			n = retorno.data.valores.length;
			ins.push("<table class=lista >");
			for (i=0;i<n; i++){
				ins.push("<tr><td><input size=2 style='cursor:pointer' name="+retorno.data.valores[i].item+" type=checkbox id=i3GEOinseregrafico"+retorno.data.valores[i].item+" /></td>");
				ins.push("<td>&nbsp;"+retorno.data.valores[i].item+"</td>");
				ins.push("<td>&nbsp;<input onclick='javascript:this.select();' id=i3GEOinseregrafico"+retorno.data.valores[i].item+"cor type=text size=13 value="+i3GEO.util.randomRGB()+" /></td>");
				ins.push("<td>&nbsp;<img style=cursor:pointer src='"+i3GEO.configura.locaplic+"/imagens/aquarela.gif' onclick=\"i3GEOF.insereGrafico.corj('i3GEOinseregrafico"+retorno.data.valores[i].item+"cor')\" /></td></tr>");
			}
			ins.push("</table>");
			$i("i3GEOinseregraficolistai").innerHTML = ins.join("");
		}
		catch(e)
		{$i("i3GEOinseregraficolistai").innerHTML = "<p style=color:red >Ocorreu um erro "+e+"<br>";}
	},
	/*
	Function: corj
	
	Abre a janela para o usuário selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: pegaItensMarcados
	
	Recupera os itens que foram marcados e monta uma lista para enviar como parâmetro para a função de geração dos gráficos
	*/
	pegaItensMarcados: function(){
		var listadeitens = [],
			inputs = $i("i3GEOinseregraficolistai").getElementsByTagName("input"),
			i,
			it,
			c,
			n;
		n = inputs.length;
		for (i=0;i<n; i++)
		{
			if (inputs[i].checked === true)
			{
				it = inputs[i].id;
				c = $i(it+"cor").value;
				listadeitens.push(it.replace("i3GEOinseregrafico","")+","+c);
			}
		}
		return(listadeitens.join("*"));
	},
	/*
	Function: legenda
	
	Mostra a legenda no mapa do último gráfico inserido
	*/
	legenda: function(){
		var par = i3GEOF.insereGrafico.pegaItensMarcados(),
			temp,
			i,
			t,
			w;
		try
		{
			temp = par.split("*");
			par = "<table>";
			i = temp.length-1;
			if(i >= 0)
			{
				do
				{
					t = temp[i];
					t = t.split(",");
					par += "<tr style='text-align:left'><td style='background-color:rgb("+t[1]+","+t[2]+","+t[3]+")'>&nbsp;&nbsp;</td><td style='text-align:left'>"+t[0]+"</td></tr>";
				}
				while(i--);
			}
			par += "</table>";
			w = i3GEO.janela.cria(200,200,"","center","center","Legenda","FlegendaGr");
			w = w[2].id;
			$i(w).innerHTML = par;
		}
		catch(e){alert("Ocorreu um erro. legendaGrafico"+e);}
	}
};
