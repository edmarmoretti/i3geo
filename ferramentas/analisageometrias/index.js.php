<?php if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Ferramenta análise de geometrias

File: i3geo/ferramentas/analisageometrias/index.js.php

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
Class: i3GEOF.analisaGeometrias

Inclui gráficos em cada elemento de um tema tendo como fonte a tabela de atributos.

Abre uma janela com várias opções e lista de itens para os gráficos.

O tema que será utilizado é o que estiver armazenado na variável global i3GEO.temaAtivo
*/
i3GEOF.analisaGeometrias = {
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
			$i(iddiv).innerHTML += i3GEOF.analisaGeometrias.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOanalisageometrias1","i3GEOanalisageometrias");
			//eventos das guias
			$i("i3GEOanalisageometrias1").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOanalisageometrias1","i3GEOanalisageometrias");};
			$i("i3GEOanalisageometrias2").onclick = function(){
				if($i("i3GEOanalisageometrias2obj").style.display === "block")
				{return;}
				i3GEOF.analisaGeometrias.aguarde.visibility = "visible";
				i3GEO.guias.mostraGuiaFerramenta("i3GEOanalisageometrias2","i3GEOanalisageometrias");
				i3GEOF.analisaGeometrias.listaGeo();
			};
			$i("i3GEOanalisageometrias3").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOanalisageometrias3","i3GEOanalisageometrias");};
			new YAHOO.widget.Button(
				"i3GEOanalisageometriasbotao1",
				{onclick:{fn: i3GEOF.analisaGeometrias.capturageo}}
			);
			i3GEO.util.mensagemAjuda("i3GEOanalisageometriasmen1",$i("i3GEOanalisageometriasmen1").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOanalisageometriasmen2",$i("i3GEOanalisageometriasmen2").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOanalisageometriasmen3",$i("i3GEOanalisageometriasmen3").innerHTML);
			g_tipoacao="";
			g_operacao="";
			i3GEOF.analisaGeometrias.ativaFoco();
			var combot = "<select style='font-size:11px' id='i3GEOanalisageometriastipoOperacao' onchange='i3GEOF.analisaGeometrias.operacao(this)' >";
			combot += "<option value='adiciona' >Adiciona</option>";
			combot += "<option value='retira' >Retira</option>";
			combot += "<option value='inverte' >Inverte</option>";
			combot += "<option value='limpa' >Limpa</option>";
			combot += "</select>";
			$i("i3GEOanalisageometriasoperacao").innerHTML = combot;
			i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
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
		ins += '		<li><a href="#ancora"><em><div id="i3GEOanalisageometrias1" style="text-align:center;left:0px;" >Capturar</div></em></a></li>';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOanalisageometrias2" style="text-align:center;left:0px;" >Listar</div></em></a></li>';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOanalisageometrias3" style="text-align:center;left:0px;" >Analisar</div></em></a></li>';
		ins += '	</ul>';
		ins += '</div>';
		ins += '<div class="geralFerramentas" style="left:0px;top:0px;width:98%;height:86%;">';
		ins += '	<div class=guiaobj id="i3GEOanalisageometrias1obj" style="left:1px;90%;display:none;">';
		ins += '		<p class=paragrafo >Escolha o tema que receber&aacute; a sele&ccedil;&atilde;o:';
		ins += '		<div id="i3GEOanalisageometriastemas" style="width:90%;text-align:left;left:0px">';
		ins += '		</div><br>';
		ins += '		<p class=paragrafo >Tipo de sele&ccedil;&atilde;o:';
		ins += '		<div id="i3GEOanalisageometriasoperacao" style="width:90%;text-align:left;left:0px">';
		ins += '		</div><br>';
		ins += '		<input id=i3GEOanalisageometriasbotao1 size=45 type=button value="Capturar as geometrias selecionadas"/><br><br>';
		ins += '		<div id=i3GEOanalisageometriasmen1 style="top:5px;left:0px"><p class=paragrafo >Ap&oacute;s escolher o tema, clique no mapa para selecionar os elementos desejados, caso vc j&aacute; n&atilde;o tenha feito isso ou caso deseje alterar a sele&ccedil;&atilde;o. Conclu&iacute;da a sele&ccedil;&atilde;o, clique no bot&atilde;o de captura para obter as geometrias. <br>As geometrias capturadas podem ser vistas na segunda guia.';
		ins += '		</div>';
		ins += '	</div>';
		ins += '	<div class=guiaobj id="i3GEOanalisageometrias2obj" style="left:1px;display:none;">';
		ins += '		<div id=i3GEOanalisageometriaslistadegeometrias style="width:95%;text-align:left;left:0px;">';
		ins += '		</div><br><br>';
		ins += '		<div style="text-align:left;left:0px" id=i3GEOanalisageometriasmen3 >';
		ins += '		<p class=paragrafo >Marque as geometrias para aplicar os processos desejados.';
		ins += '		</div>';
		ins += '	</div>';
		ins += '	<div class=guiaobj id="i3GEOanalisageometrias3obj" style="left:1px;display:none;">';
		ins += '			<p class=paragrafo >Operações que obtém descrições sobre a geometria, retornando valores que são adicionados aos itens da geometria:';
		ins += '			<br><select onchange="i3GEOF.analisaGeometrias.calculo(this)"  >';
		ins += '				<option value="" selected >---</option>';
		ins += '				<option value=area >&aacute;rea</option>';
		ins += '				<option value=perimetro >per&iacute;metro</option>';
		ins += '			</select><br>';
		ins += '			<p class=paragrafo >Operações que criam novas geometrias a partir de duas ou mais geometrias:';
		ins += '			<br><select onchange="i3GEOF.analisaGeometrias.funcoes(this)" >';
		ins += '				<option value="" selected >---</option>';
		ins += '				<option value=union_geos >Uni&atilde;o</option>';
		ins += '				<option value=intersection >Intersec&ccedil;&atilde;o</option>';
		ins += '				<option value=difference >Diferen&ccedil;a</option>';
		ins += '				<option value=symdifference >Diferen&ccedil;a inversa</option>';
		ins += '				<option value=convexhull >Convexo</option>';
		ins += '			</select>';
		ins += '			<p class=paragrafo >Operações que atuam sobre uma única geometria:';
		ins += '			<br><select onchange="i3GEOF.analisaGeometrias.funcoes1(this)" >';
		ins += '				<option value="" selected >---</option>';
		ins += '				<option value=convexhull >convexo</option>';
		ins += '				<option value=boundary >entorno</option>';
		ins += '			</select>';
		ins += '		<div id=i3GEOanalisageometriasmen2 style="text-align:left;left:0px" >';
		ins += '			<p class=paragrafo >As opera&ccedil;&otilde;es de an&aacute;lise s&atilde;o executadas sobre as geometrias selecionadas.';
		ins += '			<p class=paragrafo >Para maiores informações, veja: <a href="http://www.opengeospatial.org/standards/sfs" target=blank >OGC</a>, <a href="http://postgis.refractions.net/docs/ch06.html" target=blank >PostGis, </a>e <a href="http://www.vividsolutions.com/jts/tests/index.html" target=blank >JTS</a>';
		ins += '			<p class=paragrafo >Algumas fun&ccedil;&otilde;es para operarem corretamente sobre temas pontuais, precisam que antes seja feita a uni&atilde;o dos pontos em uma nova geometria.';
		ins += '		</div>';
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
			i3GEOF.analisaGeometrias.ativaFoco();
		};
		minimiza = function(){
			var temp = $i("i3GEOF.analisaGeometrias_corpo");
			if(temp){
				if(temp.style.display === "block")
				{temp.style.display = "none";}
				else
				{temp.style.display = "block";}
			}
		};
		//cria a janela flutuante
		titulo = "An&aacute;lise de geometrias <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=23' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"500px",
			"300px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.analisaGeometrias",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.analisaGeometrias.aguarde = $i("i3GEOF.analisaGeometrias_imagemCabecalho").style;
		i3GEOF.analisaGeometrias.aguarde.visibility = "visible";
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.analisaGeometrias.selecionaElemento()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.analisaGeometrias.selecionaElemento()");}
		temp = function(){
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.analisaGeometrias.selecionaElemento()");
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);		
		i3GEOF.analisaGeometrias.inicia(divid);
	},
	/*
	Function: ativaFoco
	
	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		if(g_operacao !== 'analisageometrias'){
			i3GEO.barraDeBotoes.ativaIcone("selecao");
			g_tipoacao='analisageometrias';
			g_operacao='analisageometrias';
			i3GEOF.analisaGeometrias.comboTemas();
			var temp = $i(i3GEO.Interface.IDMAPA);
			if(temp){
				temp.title = "";
				temp.style.cursor="pointer";
			}
		}
	},
	/*
	Function: selecionaElemento
	
	Seleciona um elemento do tema ativo quando o usuário clica no mapa
	
	É executado no evento de clique no mapa
	*/
	selecionaElemento: function(){
		if(g_tipoacao === 'analisageometrias')
		{i3GEO.selecao.porxy(i3GEO.temaAtivo,$i("i3GEOanalisageometriastipoOperacao").value,5);}
	},
	/*
	Function: comboTemas
	
	Cria o combo com os temas disponíveis (temas ligados) para adição dos gráficos.
	*/
	comboTemas: function(){
		i3GEO.util.comboTemas(
			"i3GEOanalisageometriastemasLigados",
			function(retorno){
		 		$i("i3GEOanalisageometriastemas").innerHTML = retorno.dados;
		 		if ($i("i3GEOanalisageometriastemasLigados")){
		 			$i("i3GEOanalisageometriastemasLigados").onchange = function(){
		 				i3GEO.temaAtivo = $i("i3GEOanalisageometriastemasLigados").value;
		 			};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOanalisageometriastemasLigados").value = i3GEO.temaAtivo;
					$i("i3GEOanalisageometriastemasLigados").onchange.call();
				}
			},
			"i3GEOanalisageometriastemas",
			"",
			false,
			"ligados"
		);
	},
	/*
	Function: capturaGeo
	
	Captura as geometrias selecionadas. As geometrias capturadas são armazenadas como objetos
	serializados no servidor, e podem ser utilizadas nas operações de análise
	*/
	capturageo:function(){
		if(i3GEOF.analisaGeometrias.aguarde.visibility === "visible")
		{return;}
		else
		{i3GEOF.analisaGeometrias.aguarde.visibility = "visible";}
		var p,
			cp = new cpaint(),
			nome=window.prompt("Nome que sera dado a geometria:"),
			temp = function(retorno){
				if($i("i3GEOanalisageometrias2obj").style.display === "block"){
					i3GEOF.analisaGeometrias.aguarde.visibility = "visible";
					i3GEOF.analisaGeometrias.listaGeo();
				}
				else{
					i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
				}
			};
		try{
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=capturageometrias&tema="+$i("i3GEOanalisageometriastemasLigados").value+"&nome="+nome;
			cp.set_response_type("JSON");
			cp.call(p,"capturageo",temp);
		}catch(e){
			alert("Ocorreu um erro: "+e);
			i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
		}
	},
	/*
	Function: listaGeo
	
	Obtém a lista de geometrias armazenadas
	*/
	listaGeo: function(){
		var montalistageometrias,
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listageometrias",
			cp = new cpaint();
		montalistageometrias = function(retorno){
			if(retorno.data !== "")
			{
				var ins,cor,temp,j,k,i;
				ins = "<input id=i3GEOanalisageometriasbotao4 type=button size=20  value='Excluir marcados' />&nbsp;&nbsp;";
				ins += "<input id=i3GEOanalisageometriasbotao5 type=i3GEOanalisageometriasbutton size=20  value='Ver no mapa' /><br><br>";
				cor = "rgb(245,245,245)";
				for (i=0;i<retorno.data.length; i++)
				{
					ins += "<table width=90% class=lista4 ><tr style=background-color:"+cor+" >";
					ins += "<td width=5 ><input type=checkbox id="+retorno.data[i].arquivo+" style=cursor:pointer /></td>";
					ins += "<td width=55 >"+retorno.data[i].layer+" "+retorno.data[i].arquivo+"</td>";
					ins += "<td><table>";
					temp = retorno.data[i].dados;
					for (j=0;j<temp.length; j++)
					{
						ins += "<tr><td>"+temp[j].id+"</td><td style=text-align:left >";
						if (temp[j].imagem !== "")
						{ins += "<img src='"+temp[j].imagem+"' />";}
						for (k=0;k<temp[j].valores.length; k++)
						{ins += temp[j].valores[k].item+" = "+temp[j].valores[k].valor+"<br>";}
						ins += "</td></tr>";
					}
					ins += "</table></td>";
					ins += "</tr></table>";
					if (cor === "rgb(245,245,245)")
					{cor = "rgb(255,255,255)";}
					else {cor = "rgb(245,245,245)";}
				}
				$i("i3GEOanalisageometriaslistadegeometrias").innerHTML = ins;
				new YAHOO.widget.Button(
					"i3GEOanalisageometriasbotao4",
					{onclick:{fn: i3GEOF.analisaGeometrias.excluirGeo}}
				);
				new YAHOO.widget.Button(
					"i3GEOanalisageometriasbotao5",
					{onclick:{fn: i3GEOF.analisaGeometrias.incluirNoMapa}}
				);
				i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";			
			}
			else{
				$i("i3GEOanalisageometriaslistadegeometrias").innerHTML = "<p class=paragrafo >Nenhuma geometria dispon&iacute;vel.";
				i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
			}
		};
		cp.set_response_type("JSON");
		cp.call(p,"listageometrias",montalistageometrias);	
	},
	/*
	Function: excluirGeo
	
	Exclui do servidor as geometrias marcadas na lista de geometrias
	*/
	excluirGeo: function(){
		if(i3GEOF.analisaGeometrias.aguarde.visibility === "visible")
		{return;}
		else
		{i3GEOF.analisaGeometrias.aguarde.visibility = "visible";}
		var lista,p,cp;
		lista = i3GEOF.analisaGeometrias.pegaGeometriasMarcadas();
		$i("i3GEOanalisageometriaslistadegeometrias").innerHTML = "<p class=paragrafo >Aguarde...";
		p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=removergeometrias&lista="+lista;
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"removergeometrias",i3GEOF.analisaGeometrias.listaGeo);
	},
	/*
	Function: incluirNoMapa
	
	Inclui no mapa as geometrias marcadas na lista de geometrias
	*/
	incluirNoMapa:function(){
		if(i3GEOF.analisaGeometrias.aguarde.visibility === "visible")
		{return;}
		else
		{i3GEOF.analisaGeometrias.aguarde.visibility = "visible";}
		var lista,p,cp,
			temp = function(){
				i3GEO.atualiza();
				i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
			};
		lista = i3GEOF.analisaGeometrias.pegaGeometriasMarcadas();
		p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=incmapageometrias&lista="+lista;
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"incmapageometrias",temp);
	},
	/*
	Function: pegaGeometriasMarcadas
	
	Retorna uma lista com os ids das geometrias que estão marcadas (checkbox)
	*/
	pegaGeometriasMarcadas:function(){
		var inputs = $i("i3GEOanalisageometriaslistadegeometrias").getElementsByTagName("input"),
			listai = [],
			n = inputs.length;
		for (i=0;i<n; i++){
			if (inputs[i].checked === true)
			{listai.push(inputs[i].id);}
		}
		return (listai.join(","));	
	},
	/*
	Function: calculo
	
	Realiza cálculos do tipo área e perímetro sobre as geometrias marcadas
	*/
	calculo: function(obj){
		if (obj.value !== ""){
			if(i3GEOF.analisaGeometrias.aguarde.visibility === "visible")
			{return;}
			else
			{i3GEOF.analisaGeometrias.aguarde.visibility = "visible";}
			var lista = i3GEOF.analisaGeometrias.pegaGeometriasMarcadas(),
				temp,
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=calculaGeometrias&operacao="+obj.value+"&lista="+lista;
			
			temp = function(){
				i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
			};
			cp.set_response_type("JSON");
			cp.call(p,"analisaGeometrias",temp);
		}
	},
	/*
	Function: funcoes
	
	Realiza operações geométricas de cruzamento entre geometrias
	*/
	funcoes: function(obj){
		if (obj.value !== ""){
			if(i3GEOF.analisaGeometrias.aguarde.visibility === "visible")
			{return;}
			else
			{i3GEOF.analisaGeometrias.aguarde.visibility = "visible";}
			var lista = i3GEOF.analisaGeometrias.pegaGeometriasMarcadas(),
				temp,
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=funcoesGeometrias&operacao="+obj.value+"&lista="+lista;
			
			temp = function(){
				i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
			};
			cp.set_response_type("JSON");
			cp.call(p,"funcoesGeometrias",temp);
		}	
	},
	/*
	Function: funcoes1
	
	Realiza operações geométricas em uma única geometria
	*/
	funcoes1: function(obj){
		if (obj.value !== ""){
			if(i3GEOF.analisaGeometrias.aguarde.visibility === "visible")
			{return;}
			else
			{i3GEOF.analisaGeometrias.aguarde.visibility = "visible";}
			var lista = i3GEOF.analisaGeometrias.pegaGeometriasMarcadas(),
				temp,
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=funcoesGeometrias&operacao="+obj.value+"&lista="+lista;

			temp = function(){
				i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
			};
			cp.set_response_type("JSON");
			cp.call(p,"funcoesGeometrias",temp);
		}
	}
};
<?php if(extension_loaded('zlib')){ob_end_flush();}?>