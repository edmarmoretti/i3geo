
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: An&aacute;lise de Geometrias

Permite capturar geometrias de uma ou mais camadas e executar opera&ccedil;&otilde;es de an&aacute;lise.
Ap&oacute;s o usu&aacute;rio selecionar elementos de um tema, a geometria pode ser capturada, ou seja, ela &eacute; armazenada no servidor para
poder receber opera&ccedil;&otilde;es de an&aacute;lise. As opera&ccedil;&otilde;es envolvem c&aacute;lculos, como &aacute;rea e per&iacute;metro, al&eacute;m de processos de cruzamento
entre geometrias. Ap&oacute;s realizar uma opera&ccedil;&atilde;o, o resultado &eacute; listado ou pode ser adicionado ao mapa como uma nova camada.

As geometrias armazenadas ficam dispon&iacute;veis temporariamente, assim como o mapfile do mapa atual.

Veja:

<i3GEO.analise.dialogo.analisaGeometrias>

Arquivo:

i3geo/ferramentas/analisageometrias/index.js.php

About: Licen&ccedil;a

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
Classe: i3GEOF.analisaGeometrias
*/
i3GEOF.analisaGeometrias = {
	/*
	Variavel: aguarde

	Objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.analisaGeometrias.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.analisaGeometrias.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/analisageometrias/dicionario.js",
				"i3GEOF.analisaGeometrias.iniciaJanelaFlutuante()",
				"i3GEOF.analisaGeometrias.dicionario_script"
			);
		}
		else{
			i3GEOF.analisaGeometrias.iniciaJanelaFlutuante();
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
			var temp,combot;
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
			new YAHOO.widget.Button(
				"i3GEOanalisageometriasbotaocalculo",
				{onclick:{fn: i3GEOF.analisaGeometrias.calculo}}
			);
			temp = $i("i3GEOanalisageometriasbotaocalculo-button").style;
			temp.minHeight = "1.5em";
			temp.padding = "0px 5px";

			new YAHOO.widget.Button(
				"i3GEOanalisageometriasbotaofuncoes",
				{onclick:{fn: i3GEOF.analisaGeometrias.funcoes}}
			);
			temp = $i("i3GEOanalisageometriasbotaofuncoes-button").style;
			temp.minHeight = "1.5em";
			temp.padding = "0px 5px";

			new YAHOO.widget.Button(
				"i3GEOanalisageometriasbotaofuncoes1",
				{onclick:{fn: i3GEOF.analisaGeometrias.funcoes1}}
			);
			temp = $i("i3GEOanalisageometriasbotaofuncoes1-button").style;
			temp.minHeight = "1.5em";
			temp.padding = "0px 5px";

			i3GEO.util.mensagemAjuda("i3GEOanalisageometriasmen1",$i("i3GEOanalisageometriasmen1").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOanalisageometriasmen2",$i("i3GEOanalisageometriasmen2").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOanalisageometriasmen3",$i("i3GEOanalisageometriasmen3").innerHTML);
			g_tipoacao="";
			g_operacao="";
			i3GEOF.analisaGeometrias.ativaFoco();
			combot = "<select style='font-size:11px' id='i3GEOanalisageometriastipoOperacao' onchange='i3GEOF.analisaGeometrias.operacao(this)' >";
			combot += "<option value='adiciona' >Adiciona</option>";
			combot += "<option value='retira' >Retira</option>";
			combot += "<option value='inverte' >Inverte</option>";
			combot += "<option value='limpa' >Limpa</option>";
			combot += "</select>";
			$i("i3GEOanalisageometriasoperacao").innerHTML = combot;
			i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
			i3GEO.barraDeBotoes.ativaIcone("selecao");
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
		ins += '<div id=i3GEOinseregraficoguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">';
		ins += '	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOanalisageometrias1" style="text-align:center;left:0px;" >Capturar</div></em></a></li>';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOanalisageometrias2" style="text-align:center;left:0px;" >Listar e escolher</div></em></a></li>';
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
		ins += '		<p class=paragrafo ><input id=i3GEOanalisageometriasbotao1 size=45 type=button value="Capturar as geometrias selecionadas"/><br><br>';
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
		ins += '			<p class=paragrafo ><input style="cursor:pointer;vertical-align:text-bottom" type=checkbox id=i3geoanalisageometriassemprecalcula /> Recalcula a &aacute;rea e o per&iacute;metro das novas geometrias';
		ins += '			<p class=paragrafo >Opera&ccedil;&otilde;es que obt&eacute;m descri&ccedil;&otilde;es sobre a geometria, retornando valores que s&atilde;o adicionados aos itens da geometria:';
		ins += '			<p class=paragrafo ><select id=i3GEOanalisageometriasselecaocalculo style="position:relative;top:-3px;"  >';
		ins += '				<option value="" selected >---</option>';
		ins += '				<option value=area >&Aacute;rea</option>';
		ins += '				<option value=perimetro >Per&iacute;metro</option>';
		ins += '			</select><input id=i3GEOanalisageometriasbotaocalculo type=button value="Aplicar"/></p>';
		ins += '			<p class=paragrafo >Opera&ccedil;&otilde;es que criam novas geometrias a partir de duas ou mais geometrias:';
		ins += '			<p class=paragrafo ><select id=i3GEOanalisageometriasselecaofuncoes style="position:relative;top:-3px;" >';
		ins += '				<option value="" selected >---</option>';
		ins += '				<option value=union >Uni&atilde;o</option>';
		ins += '				<option value=intersection >Intersec&ccedil;&atilde;o</option>';
		ins += '				<option value=difference >Diferen&ccedil;a</option>';
		ins += '				<option value=symdifference >Diferen&ccedil;a inversa</option>';
		ins += '				<option value=convexhull >Convexo</option>';
		ins += '			</select><input id=i3GEOanalisageometriasbotaofuncoes type=button value="Aplicar"/></p>';
		ins += '			<p class=paragrafo >Opera&ccedil;&otilde;es que atuam sobre uma &uacute;nica geometria:';
		ins += '			<p class=paragrafo ><select id=i3GEOanalisageometriasselecaofuncoes1 style="position:relative;top:-3px;" >';
		ins += '				<option value="" selected >---</option>';
		ins += '				<option value=convexhull >Convexo</option>';
		ins += '				<option value=boundary >Entorno</option>';
		ins += '			</select><input id=i3GEOanalisageometriasbotaofuncoes1 type=button value="Aplicar"/></p>';
		ins += '		<div id=i3GEOanalisageometriasmen2 style="text-align:left;left:0px" >';
		ins += '			<p class=paragrafo >As opera&ccedil;&otilde;es de an&aacute;lise s&atilde;o executadas sobre as geometrias selecionadas.';
		ins += '			<p class=paragrafo >Para maiores informa&ccedil;&otilde;es, veja: <a href="http://www.opengeospatial.org/standards/sfs" target=blank >OGC</a>, <a href="http://postgis.refractions.net/docs/ch06.html" target=blank >PostGis, </a>e <a href="http://www.vividsolutions.com/jts/tests/index.html" target=blank >JTS</a>';
		ins += '			<p class=paragrafo >Algumas fun&ccedil;&otilde;es para operarem corretamente sobre temas pontuais, precisam que antes seja feita a uni&atilde;o dos pontos em uma nova geometria.';
		ins += '		</div>';
		ins += '	</div>';
		ins += '</div>	';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
		cabecalho = function(){
			i3GEOF.analisaGeometrias.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.analisaGeometrias");
		};
		//cria a janela flutuante
		titulo = $trad("u6")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=23' >&nbsp;&nbsp;&nbsp;</a>";
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
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.analisaGeometrias.comboTemas()") < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.analisaGeometrias.comboTemas()");}
		temp = function(){
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.analisaGeometrias.selecionaElemento()");
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.analisaGeometrias.comboTemas()") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.analisaGeometrias.comboTemas()");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		i3GEOF.analisaGeometrias.inicia(divid);
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"pointer",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
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
		var i = $i("i3GEOF.analisaGeometrias_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
		i3GEO.barraDeBotoes.ativaIcone("selecao");
	},
	/*
	Function: selecionaElemento

	Seleciona um elemento do tema ativo quando o usu&aacute;rio clica no mapa

	&Eacute; executado no evento de clique no mapa, definido na inicializa&ccedil;&atilde;o da ferramenta.

	Veja:

	<i3GEO.php.selecaopt>
	*/
	selecionaElemento: function(){
		if(g_tipoacao === 'analisageometrias'){
			var retorna = function(retorno){
				if(i3GEO.Interface.ATUAL === "padrao")
				{i3GEO.atualiza(retorno);}
				i3GEO.Interface.atualizaTema(retorno,i3GEO.temaAtivo);
			};
			i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
			i3GEO.php.selecaopt(retorna,i3GEO.temaAtivo,objposicaocursor.ddx+" "+objposicaocursor.ddy,$i("i3GEOanalisageometriastipoOperacao").value,5);
		}
	},
	/*
	Function: comboTemas

	Cria o combo com os temas dispon&iacute;veis (temas ligados) para sele&ccedil;&atilde;o.

	Veja:

	<i3GEO.util.comboTemas>
	*/
	comboTemas: function(){
		i3GEO.util.comboTemas(
			"i3GEOanalisageometriastemasLigados",
			function(retorno){
		 		$i("i3GEOanalisageometriastemas").innerHTML = retorno.dados;
		 		if ($i("i3GEOanalisageometriastemasLigados")){
		 			$i("i3GEOanalisageometriastemasLigados").onchange = function(){
		 				i3GEO.mapa.ativaTema($i("i3GEOanalisageometriastemasLigados").value);
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

	Captura as geometrias selecionadas. As geometrias capturadas s&atilde;o armazenadas como objetos
	serializados no servidor, e podem ser utilizadas nas opera&ccedil;&otilde;es de an&aacute;lise. A captura &eacute; feita sob o tema ativo e os
	elementos selecionados.

	Veja:

	<CAPTURAGEOMETRIAS>
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
			i3GEO.janela.tempoMsg("Ocorreu um erro: "+e);
			i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
		}
	},
	/*
	Function: listaGeo

	Obt&eacute;m a lista de geometrias j&aacute; capturadas e monta a lista que &eacute; apresentada ao usu&aacute;rio.

	Veja:

	<LISTAGEOMETRIAS>
	*/
	listaGeo: function(){
		var montalistageometrias,
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listageometrias",
			cp = new cpaint();
		montalistageometrias = function(retorno){
			if(retorno.data != "") //n&atilde;o comparar com !==
			{
				var ins,cor,temp,j,k,i;
				ins = "<p class=paragrafo ><input id=i3GEOanalisageometriasbotao4 type=button size=20  value='Excluir marcados' />&nbsp;&nbsp;";
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

	Exclui do servidor as geometrias marcadas na lista de geometrias.

	Veja:

	<REMOVERGEOMETRIAS>
	*/
	excluirGeo: function(){

		if(i3GEOF.analisaGeometrias.aguarde.visibility === "visible")
		{return;}
		else
		{i3GEOF.analisaGeometrias.aguarde.visibility = "visible";}
		var lista,p,cp;
		lista = i3GEOF.analisaGeometrias.pegaGeometriasMarcadas();
		if(lista == ""){
			i3GEO.janela.tempoMsg("Nenhuma geometria foi marcada");
			i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
			return;
		}
		$i("i3GEOanalisageometriaslistadegeometrias").innerHTML = "<p class=paragrafo >Aguarde...";
		p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=removergeometrias&lista="+lista;
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"removergeometrias",i3GEOF.analisaGeometrias.listaGeo);
	},
	/*
	Function: incluirNoMapa

	Inclui no mapa as geometrias marcadas na lista de geometrias.

	Veja:

	<INCMAPAGEOMETRIAS>
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
		if(lista == ""){
			i3GEO.janela.tempoMsg("Nenhuma geometria foi marcada");
			i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
			return;
		}
		p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=incmapageometrias&lista="+lista;
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"incmapageometrias",temp);
	},
	/*
	Function: pegaGeometriasMarcadas

	Retorna uma lista com os ids das geometrias que est&atilde;o marcadas (checkbox)
	*/
	pegaGeometriasMarcadas:function(){
		var inputs = $i("i3GEOanalisageometriaslistadegeometrias").getElementsByTagName("input"),
			listai = [],i,
			n = inputs.length;
		for (i=0;i<n; i++){
			if (inputs[i].checked === true)
			{listai.push(inputs[i].id);}
		}
		return (listai.join(","));
	},
	/*
	Function: calculo

	Realiza c&aacute;lculos do tipo &aacute;rea e per&iacute;metro sobre as geometrias marcadas

	Veja:

	<CALCULAGEOMETRIAS>
	*/
	calculo: function(){
		var lista,
			temp,
			cp = new cpaint(),
			p,
			obj = $i("i3GEOanalisageometriasselecaocalculo");

		if (obj.value !== ""){
			if(i3GEOF.analisaGeometrias.aguarde.visibility === "visible")
			{return;}
			else
			{i3GEOF.analisaGeometrias.aguarde.visibility = "visible";}
			lista = i3GEOF.analisaGeometrias.pegaGeometriasMarcadas();
			if(lista == ""){
				i3GEO.janela.tempoMsg("Nenhuma geometria foi marcada");
				i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
				return;
			}
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=calculaGeometrias&operacao="+obj.value+"&lista="+lista;
			temp = function(){
				i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
				$i("i3GEOanalisageometrias2").onclick.call();
			};
			cp.set_response_type("JSON");
			cp.call(p,"analisaGeometrias",temp);
		}
	},
	/*
	Function: funcoes

	Realiza opera&ccedil;&otilde;es geom&eacute;tricas de cruzamento entre geometrias

	Veja:

	<FUNCOESGEOMETRIAS>
	*/
	funcoes: function(){
		var lista,
			temp,
			cp = new cpaint(),
			p,
			obj = $i("i3GEOanalisageometriasselecaofuncoes");

		if (obj.value !== ""){
			if(i3GEOF.analisaGeometrias.aguarde.visibility === "visible")
			{return;}
			else
			{i3GEOF.analisaGeometrias.aguarde.visibility = "visible";}

			lista = i3GEOF.analisaGeometrias.pegaGeometriasMarcadas();
			if(lista == ""){
				i3GEO.janela.tempoMsg("Nenhuma geometria foi marcada");
				i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
				return;
			}
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=funcoesGeometrias&operacao="+obj.value+"&lista="+lista+"&recalcareaper="+$i("i3geoanalisageometriassemprecalcula").checked;

			temp = function(){
				i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
				$i("i3GEOanalisageometrias2").onclick.call();
			};
			cp.set_response_type("JSON");
			cp.call(p,"funcoesGeometrias",temp);
		}
	},
	/*
	Function: funcoes1

	Realiza opera&ccedil;&otilde;es geom&eacute;tricas em uma &uacute;nica geometria

	Veja:

	<FUNCOESGEOMETRIAS>
	*/
	funcoes1: function(){
		var lista,
			temp,
			cp = new cpaint(),
			p,
			obj = $i("i3GEOanalisageometriasselecaofuncoes1");

		if (obj.value !== ""){
			if(i3GEOF.analisaGeometrias.aguarde.visibility === "visible")
			{return;}
			else
			{i3GEOF.analisaGeometrias.aguarde.visibility = "visible";}
			lista = i3GEOF.analisaGeometrias.pegaGeometriasMarcadas();
			if(lista == ""){
				i3GEO.janela.tempoMsg("Nenhuma geometria foi marcada");
				i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
				return;
			}
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=funcoesGeometrias&operacao="+obj.value+"&lista="+lista+"&recalcareaper="+$i("i3geoanalisageometriassemprecalcula").checked;

			temp = function(retorno){
				i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
				$i("i3GEOanalisageometrias2").onclick.call();
			};
			cp.set_response_type("JSON");
			cp.call(p,"funcoesGeometrias",temp);
		}
	}
};
