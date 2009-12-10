<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
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
Class: i3GEOF.graficointerativo

Representação gráfica de dados
*/
i3GEOF.graficointerativo = {
	/*
	Variavel: aguarde
	
	Estilo do objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
	*/
	aguarde: "",
	/*
	Propriedade: tipo
	
	Tipo de gráfico escolhido pelo usuário.
	*/
	tipo: "",
	/*
	Function: inicia
	
	Inicia a ferramenta. É chamado por criaJanelaFlutuante
	
	Parametros:
	
	iddiv {String} - id do div que receberá o conteudo HTML da ferramenta
	
	dados {JSON} - dados para o gráfico (opcional)
	*/
	inicia: function(iddiv,dados){
		try{
			$i(iddiv).innerHTML += i3GEOF.graficointerativo.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativoguia1","i3GEOgraficointerativoguia");
			//eventos das guias
			$i("i3GEOgraficointerativoguia1").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativoguia1","i3GEOgraficointerativoguia");
			};
			$i("i3GEOgraficointerativoguia2").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativoguia2","i3GEOgraficointerativoguia");
				i3GEOF.graficointerativo.configuraDados();
			};
			$i("i3GEOgraficointerativoguia3").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativoguia3","i3GEOgraficointerativoguia");
			};
			$i("i3GEOgraficointerativoguia4").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativoguia4","i3GEOgraficointerativoguia");
				var so = new SWFObject(i3GEO.configura.locaplic+"/pacotes/openflashchart/open-flash-chart.swf", "i3GEOgraficointerativoGrafico1", "95%", "88%", "9", "#ffffff");
				so.addVariable("get-data", "i3GEOF.graficointerativo.tabela2dados");
				so.addVariable("loading","Criando grafico...");
				so.write("i3GEOgraficointerativoGrafico");
			};
			i3GEOF.graficointerativo.ativaFoco();
			i3GEO.util.comboTemas(
				"i3GEOgraficointerativoComboTemasId",
				function(retorno){
			 		$i("i3GEOgraficointerativoComboTemas").innerHTML = retorno.dados;
			 		$i("i3GEOgraficointerativoComboTemas").style.display = "block";
			 		if ($i("i3GEOgraficointerativoComboTemasId")){
			 			$i("i3GEOgraficointerativoComboTemasId").onchange = function(){
			 				i3GEO.mapa.ativaTema($i("i3GEOgraficointerativoComboTemasId").value);
			 				i3GEOF.graficointerativo.comboItensSel();
			 			};
					}
					if(i3GEO.temaAtivo !== ""){
						$i("i3GEOgraficointerativoComboTemasId").value = i3GEO.temaAtivo;
						$i("i3GEOgraficointerativoComboTemasId").onchange.call();
					}
				},
				"i3GEOgraficointerativoComboTemas",
				"",
				false,
				"ligados"
			);	
			new YAHOO.widget.Button(
				"i3GEOgraficointerativobotao1",
				{onclick:{fn: i3GEOF.graficointerativo.obterDados}}
			);
			if(arguments.length === 2){
				//i3GEOF.graficointerativo.tipo = "pizza2d";
				//var retorno = {"attributes":{"id":""},"data":{"dados":["n;x","'4';3839572","'8';81710320","'7';24631314","'2';10967753","'1';24496400","'3';18752482","'5';13574480","'6';216507515"]}};		
				i3GEOF.graficointerativo.montaTabelaDados(dados);
				$i("i3GEOgraficointerativoguia4").onclick.call();
			}
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
		var ins = '' +
		'<div id=i3GEOgraficointerativoguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">' +
		'	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">' +
		'		<li><a href="#ancora"><em><div id="i3GEOgraficointerativoguia1" style="text-align:center;left:0px;" >Tipo</div></em></a></li>' +
		'		<li><a href="#ancora"><em><div id="i3GEOgraficointerativoguia2" style="text-align:center;left:0px;" >Dados</div></em></a></li>' +
		'		<li><a href="#ancora"><em><div id="i3GEOgraficointerativoguia3" style="text-align:center;left:0px;" >Propriedades</div></em></a></li>' +
		'		<li><a href="#ancora"><em><div id="i3GEOgraficointerativoguia4" style="text-align:center;left:0px;" >Gráfico</div></em></a></li>' +
		'	</ul>' +
		'</div><br>' +
		'<div class=guiaobj id="i3GEOgraficointerativoguia1obj" style="left:1px;display:none;">' +
		'	<p class=paragrafo >Escolha o tipo de gráfico: </p>' +
		'	<table class=lista6 >' +
		'		<tr><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="pizza2d" name="tipoGrafico" style=cursor:pointer > </td><td>pizza 2d</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="area" name="tipoGrafico" style=cursor:pointer > </td><td>área 2d</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="scatter" name="tipoGrafico" style=cursor:pointer > </td><td>distribuição de pontos</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="line" name="tipoGrafico" style=cursor:pointer > </td><td>linha</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="radar" name="tipoGrafico" style=cursor:pointer > </td><td>radar</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +

		'		<tr><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_filled" name="tipoGrafico" style=cursor:pointer > </td><td>barras simples</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_glass" name="tipoGrafico" style=cursor:pointer > </td><td>barras 2 cores</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_3d" name="tipoGrafico" style=cursor:pointer > </td><td>barras 3d</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_sketch" name="tipoGrafico" style=cursor:pointer > </td><td>barras rascunho</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_cylinder" name="tipoGrafico" style=cursor:pointer > </td><td>barras cilindro</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_cylinder_outline" name="tipoGrafico" style=cursor:pointer > </td><td>barras cilindro com contorno</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_round_glass" name="tipoGrafico" style=cursor:pointer > </td><td>barras cúpula</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_round" name="tipoGrafico" style=cursor:pointer > </td><td>barras pílula</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="hbar" name="tipoGrafico" style=cursor:pointer > </td><td>barras horizontais</td></tr>' +

		'	</table>' +
		'</div> ' +
		'<div class=guiaobj id="i3GEOgraficointerativoguia2obj" style="left:1px;display:none;top:-5px">' +
		'	<p class=paragrafo >Escolha os dados que comporão o gráfico: </p>' +
		'	<div class=paragrafo id=i3GEOgraficointerativoAjudaPizza >Se vc escolher para X e Y o mesmo item, será considerada a frequência das ocorrências para compor cada parte da pizza. Caso contrário, será feita a soma dos valores existentes em Y para cada ocorrência existente em X.</div>' +
		'	<p class=paragrafo >Tema:</p>' +
		'	<div class=paragrafo id=i3GEOgraficointerativoComboTemas ></div>' +
		'	<div class=paragrafo id=i3GEOgraficointerativoComboXlinha >' +
		'		<p class=paragrafo >Item com as classes ou eixo X:</p>' +
		'		<div class=paragrafo id=i3GEOgraficointerativoComboX ></div>' +
		'	</div>'+
		'	<div id=i3GEOgraficointerativoComboYlinha >'+
		'		<p class=paragrafo >Item com os valores ou eixo Y: </p>'+
		'		<div class=paragrafo id=i3GEOgraficointerativoComboY ></div>' +
		'	</div>' +
		'	<p class=paragrafo >Excluir o seguinte valor: ' +
		$inputText("","","i3GEOgraficointerativoexcluir","",3,"") +
		'	<p class=paragrafo ><input type=checkbox style=cursor:pointer id=i3GEOgraficointerativoCoresA /> gera cores aleatórias</p>' +
		'	<p class=paragrafo ><input id=i3GEOgraficointerativobotao1 type="buttom" value="Obter dados" /></p>'+
		'	<div id=i3GEOgraficointerativoDados ></div>'+
		'</div>' +
		'<div class=guiaobj id="i3GEOgraficointerativoguia3obj" style="left:1px;display:none;top:-5px">' +
		'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativoAcumula /> Utiliza valores acumulados</p>' +
		'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativoRelativa /> Utiliza valores relativos (%)</p>' +
		'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativoDadosPuros /> Não processa os valores ao obter os dados (mantém os dados como estão na tabela de atributos) - essa opção é útil nos gráficos de distribuição de pontos</p>' +
		'	<p class=paragrafo ><input style=cursor:pointer type=checkbox onclick="i3GEOF.graficointerativo.ativaNavegacao(this)" /> Atualiza o gráfico ao navegar pelo mapa</p>' +
		'</div>'+
		'<div class=guiaobj id="i3GEOgraficointerativoguia4obj" style="left:1px;display:none;top:-5px">' +
		'	<div id="i3GEOgraficointerativoGrafico"></div>' +
		'</div>';
		return ins;		
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	
	Parametro
	
	dados {JSON} - dados para o gráfico
	*/	
	criaJanelaFlutuante: function(dados){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.graficointerativo.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.graficointerativo");
		};
		titulo = "Gráficos interativos <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=48a' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"380px",
			"240px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.graficointerativo",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.graficointerativo.aguarde = $i("i3GEOF.graficointerativo_imagemCabecalho").style;
		$i("i3GEOF.graficointerativo_corpo").style.backgroundColor = "white";
		if(arguments.length === 0)
		{i3GEOF.graficointerativo.inicia(divid);}
		else
		{i3GEOF.graficointerativo.inicia(divid,dados);}
	},
	/*
	Function: ativaFoco
	
	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEO.barraDeBotoes.ativaIcone("graficointerativo");
		var i = $i("i3GEOF.graficointerativo_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 10000 + i3GEO.janela.ULTIMOZINDEX;
	},
	/*
	Function: ativaTipo
	
	Define a variável com o tipo de gráfico e mostra a guia 2
	*/
	ativaTipo: function(obj){
		i3GEOF.graficointerativo.tipo = obj.value;
		if($i("i3GEOgraficointerativoGrafico").innerHTML === "")
		{$i("i3GEOgraficointerativoguia2").onclick.call();}
		else
		{$i("i3GEOgraficointerativoguia4").onclick.call();}
	},
	/*
	Function: configuraDados
	
	Configura o formulário para obtenção dos dados para cada tipo de gráfico
	*/
	configuraDados: function(){
		var radios = $i("i3GEOgraficointerativoguia1obj").getElementsByTagName("input"),
			nradios = radios.length,
			i,
			ativa = function(comboxlinha,comboylinha,ajudapizza){
				$i("i3GEOgraficointerativoComboXlinha").style.display = comboxlinha;
				$i("i3GEOgraficointerativoComboYlinha").style.display = comboylinha;
				$i("i3GEOgraficointerativoAjudaPizza").style.display = ajudapizza;
			};
		if (i3GEOF.graficointerativo.tipo === ""){
			alert("Escolha um tipo de grafico");
			i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativoguia1","i3GEOgraficointerativoguia");
			return;
		}
		if(i3GEOF.graficointerativo.tipo === "pizza2d"){
			ativa.call("block","block","block");
		}
	},
	/*
	Function: comboItensSel
	
	Cria um combo para selecionar os itens do tema escolhido
	*/
	comboItensSel: function(){
		var tema = $i("i3GEOgraficointerativoComboTemasId").value;
		i3GEO.util.comboItens(
			"i3GEOgraficointerativoComboXid",
			tema,
			function(retorno){
		 		var combo = retorno.dados;
		 		if(retorno.tipo === "erro"){
		 			$i("i3GEOgraficointerativoComboX").innerHTML = "<br><br><span style='color:red'>erro ao ler os itens do tema de origem</span><br><br>";
		 			$i("i3GEOgraficointerativoComboY").innerHTML = "<br><br><span style='color:red'>erro ao ler os itens do tema de origem</span><br><br>";
		 		}
		 		else{
		 			$i("i3GEOgraficointerativoComboY").innerHTML = retorno.dados;
		 			$i("i3GEOgraficointerativoComboXid").id = "i3GEOgraficointerativoComboYid";
		 			$i("i3GEOgraficointerativoComboX").innerHTML = retorno.dados;
		 		}
			},
			"i3GEOgraficointerativoComboX",
			""
		);
	},
	/*
	Function: obterDados
	
	Obtém os dados que serão utilizados no gráfico
	*/
	obterDados: function(){
		if(i3GEOF.graficointerativo.aguarde.visibility === "visible")
		{return;}
		var tema = $i("i3GEOgraficointerativoComboTemasId").value,
			x = $i("i3GEOgraficointerativoComboXid").value,
			y = $i("i3GEOgraficointerativoComboYid").value,
			excluir = $i("i3GEOgraficointerativoexcluir").value,
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=graficoSelecao&tema="+tema+"&itemclasses="+x+"&itemvalores="+y+"&exclui="+excluir,
			cp = new cpaint(),
			tipo = "soma",
			monta;
		
		if($i("i3GEOgraficointerativoDadosPuros").checked)
		{tipo = "nenhum";}
		else{	
			if(x === y)
			{tipo = "conta";}
		}
		if(tema === "")
		{alert("Escolha um tema");return;}
		if(x === "")
		{alert("Escolha um item para X");return;}
		if(y === "")
		{alert("Escolha um item para Y");return;}
		monta = function(retorno){
			i3GEOF.graficointerativo.aguarde.visibility = "hidden";
			i3GEOF.graficointerativo.montaTabelaDados(retorno);
			$i("i3GEOgraficointerativoguia4").onclick.call();
		};
		i3GEOF.graficointerativo.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p+"&tipo="+tipo,"graficoSelecao",monta);
	},
	/*
	Function: montaTabelaDados
	
	Monta a tabela com os dados que serão utilizados no gráfico
	
	Parametro:
	
	retorno {JSON} - dados no formato JSON
	*/
	montaTabelaDados: function(retorno){
		var dados = retorno.data.dados,
			n = dados.length,
			v,
			ins = [],
			i,
			id,
			cor = "#d01f3c";
		ins.push("<p class=paragrafo >Tabela de dados para o gráfico. Os valores podem ser editados</p><table class=lista4 id=i3GEOgraficointerativotabeladados ><tr><td></td>");
		ins.push("<td style=background-color:yellow >&nbsp;<img style=cursor:pointer onclick='i3GEOF.graficointerativo.ordenaColuna(this,1)' src='"+i3GEO.configura.locaplic+"/imagens/ordena1.gif' title='ordena' /> nome</td>");
		ins.push("<td style=background-color:yellow >&nbsp;<img style=cursor:pointer onclick='i3GEOF.graficointerativo.ordenaColuna(this,2)' src='"+i3GEO.configura.locaplic+"/imagens/ordena1.gif' title='ordena' /> valor</td>");
		ins.push("<td style=background-color:yellow >cor</td><td></td></tr>");
		for (i=1;i<n; i++){
			v = dados[i].split(";");
			v[0] = v[0].replace("'","");
			v[0] = v[0].replace("'","");
			//ins += v[0]+" "+v[1];
			id = "i3GEOgraficointerativoDados"+i; //layer+indice da classe
			ins.push("<tr><td>");
			ins.push("<img style='cursor:pointer' title='clique para excluir' onclick='i3GEOF.graficointerativo.excluilinha(this)' src='"+i3GEO.configura.locaplic+"/imagens/x.gif' title='excluir' /></td>");
			ins.push("</td><td>");
			ins.push($inputText("","",id+"_nome","digite o novo nome",20,v[0],"nome"));
			ins.push("</td><td>");
			ins.push($inputText("","",id+"_valor","digite o novo valor",12,v[1],"valor"));
			ins.push("</td><td>");
			if($i("i3GEOgraficointerativoCoresA").checked){
				cor = i3GEO.util.rgb2hex(i3GEO.util.randomRGB());
			}
			//verifica se no objeto com os dados existe um terceiro valor com as cores
			if(v[2]){
				cor = v[2];
			}
			ins.push($inputText("","",id+"_cor","",12,cor,"cor"));
			ins.push("</td><td>");
			ins.push("<img alt='aquarela.gif' style=cursor:pointer src='"+i3GEO.configura.locaplic+"/imagens/aquarela.gif' onclick='i3GEOF.graficointerativo.corj(\""+id+"_cor\")' />");				
			ins.push("</td></tr>");
		}
		ins.push("</table><br>");
		$i("i3GEOgraficointerativoDados").innerHTML = ins.join("");
	},
	/*
	Function: tabela2dados
	
	Obtém os dados da tabela para compor o gráfico
	*/
	tabela2dados: function(){
		var temp = 0,
			ultimo = 0,
			inputs = $i("i3GEOgraficointerativoDados").getElementsByTagName("input"),
			ninputs = inputs.length,
			n,
			i,
			parametros,
			valores = [],
			valoresS = [],
			acumulado = [],
			nomes = [],
			cores = [],
			indice = $i("i3GEOgraficointerativoComboTemasId").options.selectedIndex,
			titulo = $i("i3GEOgraficointerativoComboTemasId").options[indice].text,
			par = [],
			soma = 0,
			menor = inputs[1].value * 1,
			maior = 0,
			menorNome = inputs[0].value * 1,
			maiorNome = 0,
			alpha = 0.8,
			stroke = 2,
			gradient = true,
			tituloSize = "15px",
			tituloCor = "#000000",
			tituloAlinhamento = "center",
			corunica = "#E2D66A",
			outlinecolor = "#577261",
			corGrid = "#D7E4A3",
			divisoesY = 10,
			rotacaoX = 270,
			legendaX = "",
			legendaY = "",
			fill = "#C4B86A",
			pointSize = 2;
		if($i("i3GEOgraficointerativoComboXid"))
		{legendaX = $i("i3GEOgraficointerativoComboXid").value;}
		if($i("i3GEOgraficointerativoComboYid"))
		{legendaY = $i("i3GEOgraficointerativoComboYid").value;}
		for(i=0;i<ninputs;i = i + 3){
			nomes.push(inputs[i].value+" ");
			cores.push(inputs[i+2].value);
			temp = inputs[i+1].value * 1;
			valores.push(temp);
			valoresS.push(temp+" ");
			acumulado.push(ultimo + temp);
			ultimo = ultimo + temp;
			soma += temp;
			if(temp > maior)
			{maior = temp;}
			if(temp < menor)
			{menor = temp;}
			temp = inputs[i].value * 1;
			if(temp > maiorNome)
			{maiorNome = temp;}
			if(temp < menorNome)
			{menorNome = temp;}	
			par.push({"value":inputs[i+1].value * 1,"label":inputs[i].value+" "});
		}
		if($i("i3GEOgraficointerativoAcumula").checked){
			valores = acumulado;
			maior = soma;
		}
		if($i("i3GEOgraficointerativoRelativa").checked){
			n = valores.length;
			for(i=0;i<n;i++){
				valores[i] = (valores[i] * 100) / soma;
			}
			maior = 100;
			menor = 0;
		}
		if(i3GEOF.graficointerativo.tipo === "pizza2d"){
			parametros = {
				"elements":[{
					"type":      "pie",
					"start-angle": 180,
					"colours":   cores,
					"alpha":     alpha,
					"stroke":    stroke,
					"animate":   1,
					"values" :   par,
					"tip": "#val# de #total#<br>#percent# de 100%",
					"gradient-fill": gradient
				}],
				"title":{
					"text": titulo,
					"style": "{font-size: "+tituloSize+"; color:"+tituloCor+"; text-align: "+tituloAlinhamento+";}"
	  			},
				"num_decimals": 2,
				"is_fixed_num_decimals_forced": true,
				"is_decimal_separator_comma": true,
				"is_thousand_separator_disabled": true,
				"x_axis": null
			};
		}
		if(i3GEOF.graficointerativo.tipo === "line" || i3GEOF.graficointerativo.tipo === "scatter" || i3GEOF.graficointerativo.tipo === "hbar" || i3GEOF.graficointerativo.tipo === "area" || i3GEOF.graficointerativo.tipo === "bar_round" || i3GEOF.graficointerativo.tipo === "bar_round_glass" || i3GEOF.graficointerativo.tipo === "bar_filled" || i3GEOF.graficointerativo.tipo === "bar_glass" || i3GEOF.graficointerativo.tipo === "bar_3d" || i3GEOF.graficointerativo.tipo === "bar_sketch" || i3GEOF.graficointerativo.tipo === "bar_cylinder" || i3GEOF.graficointerativo.tipo === "bar_cylinder_outline"){
			parametros = {
				"elements":[{
					"type":      i3GEOF.graficointerativo.tipo,
					"start-angle": 180,
					"colour":   corunica,
					"outlinecolor": outlinecolor,
					"alpha":     alpha,
					"stroke":    stroke,
					"animate":   1,
					"values" :   valores,
					"tip": "#val#",
					"gradient-fill": gradient,
					"fill": fill,
					"fill-alpha": alpha,
					"dot-style": { "type": "anchor", "colour": "#9C0E57", "dot-size": pointSize }
				}],
				"x_axis": {
					"colour": "#A2ACBA",
					"grid-colour": corGrid,
					"offset": true,
					"steps": 1,
					"labels": {
						"steps": 1,
						"rotate": rotacaoX,
						"colour": "#000000",
						"labels": nomes
					}
				},
				"y_axis": {
					"min": menor,
					"max": maior,
					"steps": parseInt((parseInt(maior - menor,10) / divisoesY),10),
				},
				"x_legend": {
					"text": legendaX,
					"style": "{font-size: 12px; color: #778877}"
				},
				"y_legend": {
					"text": legendaY,
					"style": "{font-size: 12px; color: #778877}"
				},
				"title":{
					"text": titulo,
					"style": "{font-size: "+tituloSize+"; color:"+tituloCor+"; text-align: "+tituloAlinhamento+";}"
	  			}  			
			};
			if(i3GEOF.graficointerativo.tipo === "hbar"){
				n = valores.length;
				temp = [];
				for(i=0;i<n;i++){
					temp.push({"left":0,right:valores[i]});
				}
				parametros.elements[0].values = temp;
				
				parametros.x_axis = {
					"min": 0,
					"max": maior,
					"steps": parseInt((maior / divisoesY),10)
				}
				parametros.y_axis = {
    				"offset": 1,
    				"labels": nomes
				};
				parametros.x_legend.text = legendaY;
				parametros.y_legend.text = legendaX;	
			}
			if(i3GEOF.graficointerativo.tipo === "scatter"){
				n = valores.length;
				temp = [];
				for(i=0;i<n;i++){
					temp.push({"x":nomes[i],"y":valores[i]});
				}
				parametros.elements[0].values = temp;
				parametros.x_axis = {
					"min": menor,
					"max": maior,
					"steps": parseInt(((maior - menor) / divisoesY),10)
				}
				parametros.x_axis = {
					"min": menorNome,
					"max": maiorNome,
					"steps": parseInt(((maiorNome - menorNome) / divisoesY),10)
				}
				parametros.elements[0].tip = "#x#  -  #y#";
			}
		}
		if(i3GEOF.graficointerativo.tipo === "radar"){
			parametros = {
				"elements": [{
					"type": "area",
					"width": 1,
					"dot-style": { "type": "anchor", "colour": "#9C0E57", "dot-size": pointSize },
					"colour": "#45909F",
					"fill": "#45909F",
					"fill-alpha": 0.4,
					"loop": true,
					"values": valores
				}],
				"radar_axis": {
					"max": maior,
					"steps": parseInt(((maior - menor) / divisoesY),10),
					"colour": "#EFD1EF",
					"grid-colour": "#EFD1EF",
					"spoke-labels": {
						"labels": nomes,
						"colour": "#9F819F"
					}
				},

				"title":{
					"text": titulo,
					"style": "{font-size: "+tituloSize+"; color:"+tituloCor+"; text-align: "+tituloAlinhamento+";}"
  				},
  				"bg_colour": "#DFFFEC"
			};
		}
		
		return JSON1.stringify(parametros);
	},
	/*
	Function: excluilinha
	
	Exclui uma linha da tabela de dados
	*/
	excluilinha: function(celula){
		var p = celula.parentNode.parentNode;
		do{
			p.removeChild(p.childNodes[0]);
		} while (p.childNodes.length > 0);
		p.parentNode.removeChild(p);
	},
	/*
	Function: corj
	
	Abre a janela para o usuário selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj,"hex");},
	/*
	Function: ordenaColuna
	
	Ordena uma coluna da tabela
	*/
	ordenaColuna: function(coluna,cid){
		try{
			var tabela = $i("i3GEOgraficointerativoDados").getElementsByTagName("table")[0],
				trs = tabela.getElementsByTagName("tr"),
				ntrs = trs.length,
				cabecalhotr = trs[0],
				psort = [],
				t,
				psortfim,
				npsortfim,
				ins,
				p,
				e,
				temp,
				chaves = [],
				numero = false;
			function sortNumber(a,b)
			{return a - b;}
			for (t=1;t<ntrs;t++)
			{
				temp = trs[t].childNodes[cid];
				if (temp){
					psort.push(temp.childNodes[0].value);
					chaves[temp.childNodes[0].value] = t;
					if(temp.childNodes[0].value *1)
					{numero = true;}
				}
			}
			//recosntroi a tabela
			if(numero)
			{psortfim = psort.sort(sortNumber);}
			else
			{psortfim = psort.sort();}
			ins = "<tr>" + trs[0].innerHTML + "</tr>";;
			npsortfim = psortfim.length;
			for (p=0;p<npsortfim;p++)
			{
				e = chaves[psortfim[p]];
				//e = psortfim[p].split("+")[1] * 1;
				if (trs[e] !== undefined)
				{ins += "<tr>" + trs[e].innerHTML + "</tr>";}
			}
			tabela.innerHTML = ins;
		}
		catch(e){}
	},
	/*
	Function: ativaNavegacao
	
	Ativa ou desativa a atualização automática ao navegar no mapa
	*/
	ativaNavegacao: function(obj){
		if(obj.checked){
			if(i3GEO.Interface.ATUAL === "padrao"){
				i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.graficointerativo.obterDados()");
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
   				graficointerativoDragend = GEvent.addListener(i3GeoMap, "dragend", function() {i3GEOF.graficointerativo.obterDados();});
   				graficointerativoZoomend = GEvent.addListener(i3GeoMap, "zoomend", function() {i3GEOF.graficointerativo.obterDados();});						
			}
			if(i3GEO.Interface.ATUAL === "openlayers"){
   				i3geoOL.events.register("moveend",i3geoOL,function(e){i3GEOF.graficointerativo.obterDados();});
			}			
		}
		else{
			if(i3GEO.Interface.ATUAL === "padrao"){
				i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.graficointerativo.obterDados()");
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				GEvent.removeListener(graficointerativoDragend);
				GEvent.removeListener(graficointerativoZoomend);
			}
		}
	}
	
};
//pacotes/openflahchart/json2.js
if (!this.JSON1) {
    JSON1 = function () {

        function f(n) {    // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }
        Date.prototype.toJSON = function () {
            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };
        var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g,
            gap,
            indent,
            meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            },
            rep;
        function quote(string) {
            return escapeable.test(string) ?
                '"' + string.replace(escapeable, function (a) {
                    var c = meta[a];
                    if (typeof c === 'string') {
                        return c;
                    }
                    c = a.charCodeAt();
                    return '\\u00' + Math.floor(c / 16).toString(16) +
                                               (c % 16).toString(16);
                }) + '"' :
                '"' + string + '"';
        }
        function str(key, holder) {
            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];
            if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':
                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];
                if (typeof value.length === 'number' &&
                        !(value.propertyIsEnumerable('length'))) {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap + partial.join(',\n' + gap) +
                                  '\n' + mind + ']' :
                              '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value, rep);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        v = str(k, value, rep);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) +
                              '\n' + mind + '}' :
                          '{' + partial.join(',') + '}';
                gap = mind;
                return v;
            }
        }
        return {
            stringify: function (value, replacer, space) {
                var i;
                gap = '';
                indent = '';
                if (space) {
                    if (typeof space === 'number') {
                        for (i = 0; i < space; i += 1) {
                            indent += ' ';
                        }
                    } else if (typeof space === 'string') {
                        indent = space;
                    }
                }
                if (!replacer) {
                    rep = function (key, value) {
                        if (!Object.hasOwnProperty.call(this, key)) {
                            return undefined;
                        }
                        return value;
                    };
                } else if (typeof replacer === 'function' ||
                        (typeof replacer === 'object' &&
                         typeof replacer.length === 'number')) {
                    rep = replacer;
                } else {
                    throw new Error('JSON.stringify');
                }
                return str('', {'': value});
            },
            parse: function (text, reviver) {
                var j;

                function walk(holder, key) {
                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }
                if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                    j = eval('(' + text + ')');
                    return typeof reviver === 'function' ?
                        walk({'': j}, '') : j;
                }
                throw new SyntaxError('JSON.parse');
            },
            quote: quote
        };
    }();
}
/**
 * SWFObject v1.4: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
 *
 * SWFObject is (c) 2006 Geoff Stearns and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * **SWFObject is the SWF embed script formarly known as FlashObject. The name was changed for
 *   legal reasons.
 */
if(typeof deconcept=="undefined"){var deconcept=new Object();}
if(typeof deconcept.util=="undefined"){deconcept.util=new Object();}
if(typeof deconcept.SWFObjectUtil=="undefined"){deconcept.SWFObjectUtil=new Object();}
deconcept.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a,_b){
if(!document.createElement||!document.getElementById){return;}
this.DETECT_KEY=_b?_b:"detectflash";
this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);
this.params=new Object();
this.variables=new Object();
this.attributes=new Array();
if(_1){this.setAttribute("swf",_1);}
if(id){this.setAttribute("id",id);}
if(w){this.setAttribute("width",w);}
if(h){this.setAttribute("height",h);}
if(_5){this.setAttribute("version",new deconcept.PlayerVersion(_5.toString().split(".")));}
this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion(this.getAttribute("version"),_7);
if(c){this.addParam("bgcolor",c);}
var q=_8?_8:"high";
this.addParam("quality",q);
this.setAttribute("useExpressInstall",_7);
this.setAttribute("doExpressInstall",false);
var _d=(_9)?_9:window.location;
this.setAttribute("xiRedirectUrl",_d);
this.setAttribute("redirectUrl","");
if(_a){this.setAttribute("redirectUrl",_a);}};
deconcept.SWFObject.prototype={setAttribute:function(_e,_f){
this.attributes[_e]=_f;
},getAttribute:function(_10){
return this.attributes[_10];
},addParam:function(_11,_12){
this.params[_11]=_12;
},getParams:function(){
return this.params;
},addVariable:function(_13,_14){
this.variables[_13]=_14;
},getVariable:function(_15){
return this.variables[_15];
},getVariables:function(){
return this.variables;
},getVariablePairs:function(){
var _16=new Array();
var key;
var _18=this.getVariables();
for(key in _18){
_16.push(key+"="+_18[key]);}
return _16;
},getSWFHTML:function(){
var _19="";
if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){
if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","PlugIn");}
_19="<embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\"";
_19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";
var _1a=this.getParams();
for(var key in _1a){_19+=[key]+"=\""+_1a[key]+"\" ";}
var _1c=this.getVariablePairs().join("&");
if(_1c.length>0){_19+="flashvars=\""+_1c+"\"";}
_19+="/>";
}else{
if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","ActiveX");}
_19="<object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\">";
_19+="<param name=\"movie\" value=\""+this.getAttribute("swf")+"\" />";
var _1d=this.getParams();
for(var key in _1d){_19+="<param name=\""+key+"\" value=\""+_1d[key]+"\" />";}
var _1f=this.getVariablePairs().join("&");
if(_1f.length>0){_19+="<param name=\"flashvars\" value=\""+_1f+"\" />";}
_19+="</object>";}
return _19;
},write:function(_20){
if(this.getAttribute("useExpressInstall")){
var _21=new deconcept.PlayerVersion([6,0,65]);
if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){
this.setAttribute("doExpressInstall",true);
this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));
document.title=document.title.slice(0,47)+" - Flash Player Installation";
this.addVariable("MMdoctitle",document.title);}}
if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){
var n=(typeof _20=="string")?document.getElementById(_20):_20;
n.innerHTML=this.getSWFHTML();
return true;
}else{
if(this.getAttribute("redirectUrl")!=""){document.location.replace(this.getAttribute("redirectUrl"));}}
return false;}};
deconcept.SWFObjectUtil.getPlayerVersion=function(_23,_24){
var _25=new deconcept.PlayerVersion([0,0,0]);
if(navigator.plugins&&navigator.mimeTypes.length){
var x=navigator.plugins["Shockwave Flash"];
if(x&&x.description){_25=new deconcept.PlayerVersion(x.description.replace(/([a-z]|[A-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}
}else{try{
var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
for(var i=3;axo!=null;i++){
axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+i);
_25=new deconcept.PlayerVersion([i,0,0]);}}
catch(e){}
if(_23&&_25.major>_23.major){return _25;}
if(!_23||((_23.minor!=0||_23.rev!=0)&&_25.major==_23.major)||_25.major!=6||_24){
try{_25=new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));}
catch(e){}}}
return _25;};
deconcept.PlayerVersion=function(_29){
this.major=parseInt(_29[0])!=null?parseInt(_29[0]):0;
this.minor=parseInt(_29[1])||0;
this.rev=parseInt(_29[2])||0;};
deconcept.PlayerVersion.prototype.versionIsValid=function(fv){
if(this.major<fv.major){return false;}
if(this.major>fv.major){return true;}
if(this.minor<fv.minor){return false;}
if(this.minor>fv.minor){return true;}
if(this.rev<fv.rev){return false;}return true;};
deconcept.util={getRequestParameter:function(_2b){
var q=document.location.search||document.location.hash;
if(q){
var _2d=q.indexOf(_2b+"=");
var _2e=(q.indexOf("&",_2d)>-1)?q.indexOf("&",_2d):q.length;
if(q.length>1&&_2d>-1){
return q.substring(q.indexOf("=",_2d)+1,_2e);
}}return "";}};
if(Array.prototype.push==null){
Array.prototype.push=function(_2f){
this[this.length]=_2f;
return this.length;};}
var getQueryParamValue=deconcept.util.getRequestParameter;
var FlashObject=deconcept.SWFObject; // for backwards compatibility
var SWFObject=deconcept.SWFObject;


<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>