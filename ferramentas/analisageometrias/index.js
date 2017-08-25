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
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.analisaGeometrias.dicionario);
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.analisaGeometrias.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/analisageometrias/template_mst.html", function(template) {
				i3GEOF.analisaGeometrias.MUSTACHE = template;
				i3GEOF.analisaGeometrias.inicia(iddiv);
			});
			return;
		}
		//try{
		i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
			var b, combot;
			$i(iddiv).innerHTML = i3GEOF.analisaGeometrias.html();

			i3GEO.guias.mostraGuiaFerramenta("i3GEOanalisageometrias1","i3GEOanalisageometrias");
			//eventos das guias
			$i("i3GEOanalisageometrias1").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOanalisageometrias1","i3GEOanalisageometrias");
			};
			$i("i3GEOanalisageometrias2").onclick = function(){
				if($i("i3GEOanalisageometrias2obj").style.display === "block")
				{return;}
				i3GEOF.analisaGeometrias.aguarde.visibility = "visible";
				i3GEO.guias.mostraGuiaFerramenta("i3GEOanalisageometrias2","i3GEOanalisageometrias");
				i3GEOF.analisaGeometrias.listaGeo();
			};
			$i("i3GEOanalisageometrias3").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOanalisageometrias3","i3GEOanalisageometrias");};
			b = new YAHOO.widget.Button(
				"i3GEOanalisageometriasbotao1",
				{onclick:{fn: i3GEOF.analisaGeometrias.capturageo}}
			);
			b.addClass("rodar");
			b = new YAHOO.widget.Button(
				"i3GEOanalisageometriasbotaocalculo",
				{onclick:{fn: i3GEOF.analisaGeometrias.calculo}}
			);
			b.addClass("rodar150");

			b = new YAHOO.widget.Button(
				"i3GEOanalisageometriasbotaofuncoes",
				{onclick:{fn: i3GEOF.analisaGeometrias.funcoes}}
			);
			b.addClass("rodar150");

			b = new YAHOO.widget.Button(
				"i3GEOanalisageometriasbotaofuncoes1",
				{onclick:{fn: i3GEOF.analisaGeometrias.funcoes1}}
			);
			b.addClass("rodar150");

			i3GEO.util.mensagemAjuda("i3GEOanalisageometriasmen1",$i("i3GEOanalisageometriasmen1").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOanalisageometriasmen2",$i("i3GEOanalisageometriasmen2").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOanalisageometriasmen3",$i("i3GEOanalisageometriasmen3").innerHTML);
			i3GEOF.analisaGeometrias.ativaFoco();
			combot = "<div class=styled-select><select id='i3GEOanalisageometriastipoOperacao' onchange='i3GEOF.analisaGeometrias.operacao(this)' >";
			combot += "<option value='adiciona' >"+$trad('adiciona',i3GEOF.analisaGeometrias.dicionario)+"</option>";
			combot += "<option value='retira' >"+$trad('retira',i3GEOF.analisaGeometrias.dicionario)+"</option>";
			combot += "<option value='inverte' >"+$trad('inverte',i3GEOF.analisaGeometrias.dicionario)+"</option>";
			combot += "<option value='limpa' >"+$trad('limpa',i3GEOF.analisaGeometrias.dicionario)+"</option>";
			combot += "</select></div>";
			$i("i3GEOanalisageometriasoperacao").innerHTML = combot;
		//}
		//catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.analisaGeometrias.MUSTACHE, i3GEOF.analisaGeometrias.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		if($i("i3GEOF.analisaGeometrias")){
			return;
		}
		//funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
		cabecalho = function(){
			i3GEOF.analisaGeometrias.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.analisaGeometrias");
		};
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("u6") + "</span></div>";
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
			minimiza,
			"",
			true
		);
		divid = janela[2].id;
		i3GEOF.analisaGeometrias.aguarde = $i("i3GEOF.analisaGeometrias_imagemCabecalho").style;
		i3GEOF.analisaGeometrias.aguarde.visibility = "visible";
		i3GEO.eventos.adicionaEventos("MOUSECLIQUE",["i3GEOF.analisaGeometrias.selecionaElemento()"]);
		i3GEO.eventos.adicionaEventos("ATUALIZAARVORECAMADAS",["i3GEOF.analisaGeometrias.comboTemas()"]);
		i3GEO.eventos.cliquePerm.desativa();
		temp = function(){
			i3GEO.eventos.cliquePerm.ativa();
			i3GEO.eventos.removeEventos("MOUSECLIQUE",["i3GEOF.analisaGeometrias.selecionaElemento()"]);
			i3GEO.eventos.removeEventos("ATUALIZAARVORECAMADAS",["i3GEOF.analisaGeometrias.comboTemas()"]);
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		i3GEOF.analisaGeometrias.inicia(divid);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEOF.analisaGeometrias.comboTemas();
		var temp = $i(i3GEO.Interface.IDMAPA);
		if(temp){
			temp.title = "";
			temp.style.cursor="pointer";
		}
	},
	/*
	Function: selecionaElemento

	Seleciona um elemento do tema ativo quando o usu&aacute;rio clica no mapa

	&Eacute; executado no evento de clique no mapa, definido na inicializa&ccedil;&atilde;o da ferramenta.

	Veja:

	<i3GEO.php.selecaopt>
	*/
	selecionaElemento: function(){
		var retorna = function(retorno){
			i3GEO.janela.fechaAguarde("i3GEO.atualiza");
			i3GEO.Interface.atualizaTema(retorno,i3GEO.temaAtivo);
		};
		i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
		i3GEO.php.selecaopt(retorna,i3GEO.temaAtivo,objposicaocursor.ddx+" "+objposicaocursor.ddy,$i("i3GEOanalisageometriastipoOperacao").value,5);
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
		 		$i("i3GEOanalisageometriastemas").innerHTML = "<div class=styled-select>"+retorno.dados+"</div>";
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
			"ligados",
			" "
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
		var funcaoOK = function(){
			if(i3GEOF.analisaGeometrias.aguarde.visibility === "visible")
			{return;}
			else
			{i3GEOF.analisaGeometrias.aguarde.visibility = "visible";}
			var p,
				nome = $i("i3GEOjanelaprompt").value,
				cp = new cpaint(),
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
		};
		i3GEO.janela.prompt($trad('nomeGeom',i3GEOF.analisaGeometrias.dicionario)+":",funcaoOK,"GEO "+parseInt((Math.random() * 100),10));
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
				var b,ins,cor,temp,j,k,i;
				ins = "<p class=paragrafo ><input id=i3GEOanalisageometriasbotao4 type=button size=20  value='"+$trad('exclui',i3GEOF.analisaGeometrias.dicionario)+"' /></p>";
				ins += "<p class=paragrafo ><input id=i3GEOanalisageometriasbotao5 type=button size=20  value='"+$trad('verMapa',i3GEOF.analisaGeometrias.dicionario)+"' /></p>";
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
				b = new YAHOO.widget.Button(
					"i3GEOanalisageometriasbotao4",
					{onclick:{fn: i3GEOF.analisaGeometrias.excluirGeo}}
				);
				b.addClass("rodar");
				b = new YAHOO.widget.Button(
					"i3GEOanalisageometriasbotao5",
					{onclick:{fn: i3GEOF.analisaGeometrias.incluirNoMapa}}
				);
				b.addClass("rodar");
				i3GEOF.analisaGeometrias.aguarde.visibility = "hidden";
			}
			else{

				$i("i3GEOanalisageometriaslistadegeometrias").innerHTML = "<p class=paragrafo >"+$trad('naoGeom',i3GEOF.analisaGeometrias.dicionario);
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
		$i("i3GEOanalisageometriaslistadegeometrias").innerHTML = "<p class=paragrafo >"+$trad('aguarde',i3GEOF.analisaGeometrias.dicionario);
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
			i3GEO.janela.tempoMsg($trad('naoGeom2',i3GEOF.analisaGeometrias.dicionario));
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
				i3GEO.janela.tempoMsg($trad('naoGeom2',i3GEOF.analisaGeometrias.dicionario));
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
				i3GEO.janela.tempoMsg($trad(35,i3GEOF.analisaGeometrias.dicionario));
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
				i3GEO.janela.tempoMsg($trad(35,i3GEOF.analisaGeometrias.dicionario));
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