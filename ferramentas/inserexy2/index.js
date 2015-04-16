/*
Title: Insere ponto

Inclui pontos no mapa no local clicado pelo usu&aacute;rio

Veja:

<i3GEO.mapa.dialogo.cliquePonto>

Arquivo:

i3geo/ferramentas/inserexy2/index.js.php

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
Classe: i3GEOF.inserexy

*/
i3GEOF.inserexy = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.inserexy.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			var b;
			$i(iddiv).innerHTML += i3GEOF.inserexy.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia0","i3GEOinserexyguia");
			//eventos das guias
			$i("i3GEOinserexyguia0").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia0","i3GEOinserexyguia");
				$i("i3GEOinserexyprojecao").style.display = "none";
			};
			$i("i3GEOinserexyguia1").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia1","i3GEOinserexyguia");
				$i("i3GEOinserexyprojecao").style.display = "none";
			};
			$i("i3GEOinserexyguia2").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia2","i3GEOinserexyguia");
				$i("i3GEOinserexyprojecao").style.display = "none";
			};
			$i("i3GEOinserexyguia3").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia3","i3GEOinserexyguia");
				$i("i3GEOinserexyprojecao").style.display = "block";
			};
			$i("i3GEOinserexyguia4").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia4","i3GEOinserexyguia");};
			$i("i3GEOinserexyguia5").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia5","i3GEOinserexyguia");
				$i("i3GEOinserexyprojecao").style.display = "none";
			};
			$i("i3GEOinserexyguia6").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia6","i3GEOinserexyguia");
				$i("i3GEOinserexyprojecao").style.display = "none";
			};
			i3GEO.util.mensagemAjuda("i3GEOinserexymen1",$i("i3GEOinserexymen1").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOinserexymendd",$i("i3GEOinserexymendd").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOinserexymen2",$i("i3GEOinserexymen2").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOinserexymen3",$i("i3GEOinserexymen3").innerHTML);

			b = new YAHOO.widget.Button(
				"i3GEOinserexybotaodd",
				{onclick:{fn: i3GEOF.inserexy.inserirdd}}
			);
			b.addClass("rodar");
			b = new YAHOO.widget.Button(
				"i3GEOinserexybotaocriatema",
				{onclick:{fn: i3GEOF.inserexy.criatemaeditavel}}
			);
			b.addClass("rodar");
			b = new YAHOO.widget.Button(
				"i3GEOinserexybotaoperfil",
				{onclick:{fn: i3GEOF.inserexy.graficoPerfil}}
			);
			b.addClass("abrir");

			b = new YAHOO.widget.Button(
				"i3GEOinserexybotao2",
				{onclick:{fn: i3GEOF.inserexy.inserir}}
			);
			b.addClass("rodar");
			b = new YAHOO.widget.Button(
				"i3GEOinserexybotao6",
				{onclick:{fn: i3GEOF.inserexy.colar}}
			);
			b.addClass("rodar");
			b = new YAHOO.widget.Button(
				"i3GEOinserexybotao3",
				{onclick:{fn: i3GEOF.inserexy.wkt}}
			);
			b.addClass("rodar");
			b = new YAHOO.widget.Button(
				"i3GEOinserexybotao4",
				{onclick:{fn: i3GEOF.inserexy.criaPol}}
			);
			b.addClass("rodar");
			b = new YAHOO.widget.Button(
				"i3GEOinserexybotao5",
				{onclick:{fn: i3GEOF.inserexy.criaLin}}
			);
			b.addClass("rodar");
			i3GEOF.inserexy.ativaFoco();
			i3GEOF.inserexy.montaComboLocal();
			i3GEO.util.radioEpsg(
				function(retorno){
					$i("i3GEOinserexylistaepsg").innerHTML = retorno.dados;
				},
				"i3GEOinserexylistaepsg",
				"i3GEOinserexy"
			);
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.inserexy.MUSTACHE, i3GEOF.inserexy.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		if ($i("i3GEOF.inserexy")) {
			return;
		}
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.inserexy.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.inserexy");
		};
		titulo = "<span class='i3GEOiconeFerramenta i3GEOiconeInserexy'></span>" + $trad("d22t")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=83' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"500px",
			"310px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.inserexy",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			false
		);
		divid = janela[2].id;
		i3GEOF.inserexy.aguarde = $i("i3GEOF.inserexy_imagemCabecalho").style;
		$i("i3GEOF.inserexy_corpo").style.backgroundColor = "white";
		i3GEOF.inserexy.inicia(divid);

		i3GEO.eventos.adicionaEventos("MOUSECLIQUE",["i3GEOF.inserexy.adicionaClique()"]);
		i3GEO.eventos.cliquePerm.desativa();
		temp = function(){
			i3GEO.eventos.cliquePerm.ativa();
			i3GEO.barraDeBotoes.ativaPadrao();
			i3GEO.eventos.removeEventos("MOUSECLIQUE",["i3GEOF.inserexy.adicionaClique()"]);
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"crosshair",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEO.eventos.cliquePerm.desativa();
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"crosshair",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
		i3GEO.barraDeBotoes.ativaIcone("inserexy");
		var i = $i("i3GEOF.inserexy_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
	},
	/*
	Function: montaComboLocal

	Monta o combo com a lista de temas que podem ser editados (temas armazenados no diret&oacute;rio tempor&aacute;rio do i3Geo)

	Veja:

	<i3GEO.util.comboTemas>
	*/
	montaComboLocal: function(){
		i3GEO.util.comboTemas(
			"i3GEOinserexytemasLocais",
			function(retorno){
				$i("i3GEOinserexyshapefile").innerHTML = retorno.dados;
				if ($i("i3GEOinserexytemasLocais")){
					$i("i3GEOinserexytemasLocais").onchange = function(){
						i3GEO.mapa.ativaTema($i("i3GEOinserexytemasLocais").value);
						i3GEOF.inserexy.listaItens();
						i3GEOF.inserexy.listaPontos();
					};
				}
				if(i3GEO.temaAtivo !== ""){
					var temp = $i("i3GEOinserexytemasLocais");
					if(temp){
						temp.value = i3GEO.temaAtivo;
						temp.onchange.call();
					}
				}
			},
			"i3GEOinserexyshapefile",
			"",
			false,
			"locais",
			"display:block"
		);
	},
	/*
	Function: criatemaeditavel

	Cria um novo tema local para receber os pontos

	Veja:

	<CRIASHPVAZIO>
	*/
	criatemaeditavel: function(){
		if(i3GEOF.inserexy.aguarde.visibility === "visible")
		{return;}
		var funcaoOK = function(){
			try{
				var tituloTema,cp,p;
				tituloTema = $i("i3GEOjanelaprompt").value;
				if(tituloTema === "")
				{tituloTema = "Pontos inseridos "+Math.random();}
				i3GEOF.inserexy.aguarde.visibility = "visible";
				temp = function(retorno){
					i3GEOF.inserexy.aguarde.visibility = "hidden";
					i3GEO.temaAtivo = retorno.data;
					i3GEO.atualiza();
					i3GEOF.inserexy.montaComboLocal();
				};
				cp = new cpaint();
				cp.set_response_type("JSON");
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=criashpvazio&tituloTema="+tituloTema;
				cp.call(p,"criaSHPvazio",temp);
			}
			catch(e){
				i3GEO.janela.tempoMsg("Erro: "+e);
				i3GEOF.inserexy.aguarde.visibility = "hidden";
			}
		};
		i3GEO.janela.prompt($trad('tituloNovoTema',i3GEOF.inserexy.dicionario),funcaoOK,$trad('pontosInseridos',i3GEOF.inserexy.dicionario)+parseInt((Math.random() * 100),10));
	},
	/*
	Function: listaPontos

	Lista os pontos existentes no tema escolhido

	Veja:

	<LISTAPONTOSSHAPE>
	*/
	listaPontos: function(){
		var cp,p,temp;
		temp = function(retorno){
			if (retorno.data != undefined){
				var ins = [],i;
				for (i=0;i<retorno.data.length; i++)
				{ins.push("<div style='font-size:12px'>"+retorno.data[i].x+" "+retorno.data[i].y+"</div><br>");}
				$i("i3GEOinserexyguia6obj").innerHTML = ins.join("");
			}
			else
			{$i("i3GEOinserexyguia6obj").innerHTML = "<p style=color:red >Erro<br>";}
		};
		cp = new cpaint();
		cp.set_response_type("JSON");
		p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaPontosShape&tema="+$i("i3GEOinserexytemasLocais").value;
		cp.call(p,"listaPontosShape",temp);
	},
	/*
	Function: listaItens

	Lista os itens do tema escolhido para receber os pontos

	Veja:

	<i3GEO.util.comboItens>
	*/
	listaItens: function(){
		i3GEO.util.comboItens(
			"i3GEOinserexyItem",
			$i("i3GEOinserexytemasLocais").value,
			function(retorno){
				$i("i3GEOinserexyshapefileitem").innerHTML = "<p class=paragrafo>"+retorno.dados+"</p>";
				$i("i3GEOinserexyopcitens").style.display = "block";
			},
			"i3GEOinserexyshapefileitem",
			"display:block "
		);
	},
	/*
	Function: adicionaClique

	Adiciona um ponto no mapa no local onde o usu&aacute;rio clicar com o mouse

	As coordenadas s&atilde;o obtidas do objeto objposicaocursor
	*/
	adicionaClique: function(){
		i3GEOF.inserexy.adiciona(objposicaocursor.ddx+" "+objposicaocursor.ddy,"cliqueMapa");
	},
	/*
	Function: inserirdd

	Insere um ponto com base na dire&ccedil;&atilde;o e distancia
	*/
	inserirdd: function(){
		try{
			var regv,xgv,xmv,xsv,direcao,divs,x,y,xy;
			regv = new RegExp(",", "g");
			xgv = $i("i3GEOinserexyxgdd").value;
			xmv = $i("i3GEOinserexyxmdd").value;
			xsv = $i("i3GEOinserexyxsdd").value;
			xsv = xsv.replace(regv,".");
			direcao = i3GEO.calculo.dms2dd(xgv,xmv,xsv);
			//pega o &uacute;ltimo ponto
			divs = $i("i3GEOinserexyguia6obj").getElementsByTagName("div");
			divs = divs[divs.length - 1];
			divs = divs.innerHTML.split(" ");
			x = divs[0];
			y = divs[1];
			xy = i3GEO.calculo.destinoDD(x,y,$i("i3GEOinserexydistdd").value,direcao);
			i3GEOF.inserexy.adiciona(xy[0]+" "+xy[1]);
		}catch(e){i3GEO.janela.tempoMsg("Erro: "+e);}
	},
	/*
	Function: inserir

	Insere pontos digitando-se as coordenadas
	*/
	inserir: function(){
		try{
			var reg = new RegExp("w|W|l|L|o|O|'|G|r", "g"),
				regv = new RegExp(",", "g"),
				v,xgv = 0,xmv = 0,xsv = 0,vv,ygv = 0,ymv = 0,ysv = 0,x,y;
			if($i("i3GEOinserexytipodigcampo").checked){
				if (!$i("i3GEOinserexylongitude").value == ""){
					v = $i("i3GEOinserexylongitude").value + " 0" + " 0";
					v = v.replace(reg,"");
					v = v.replace(regv,".");
					v = v.split(" ");
					xgv = v[0];
					xmv = v[1];
					xsv = v[2];
					xsv = xsv.replace(",",".");
				}
				if (!$i("i3GEOinserexylatitude").value == ""){
					vv = $i("i3GEOinserexylatitude").value  + " 0" + " 0";
					vv = vv.replace(reg,"");
					vv = vv.replace(regv,".");
					vv = vv.split(" ");
					ygv = vv[0];
					ymv = vv[1];
					ysv = vv[2];
					ysv = ysv.replace(regv,".");
				}
			}
			if($i("i3GEOinserexytipodigmascara").checked){
				xgv = $i("i3GEOinserexyxg").value;
				xmv = $i("i3GEOinserexyxm").value;
				xsv = $i("i3GEOinserexyxs").value;
				xsv = xsv.replace(regv,".");
				ygv = $i("i3GEOinserexyyg").value;
				ymv = $i("i3GEOinserexyym").value;
				ysv = $i("i3GEOinserexyys").value;
				ysv = ysv.replace(regv,".");
			}
			x = i3GEO.calculo.dms2dd(xgv,xmv,xsv);
			y = i3GEO.calculo.dms2dd(ygv,ymv,ysv);
			i3GEOF.inserexy.adiciona(x+" "+y);
		}
		catch(e){i3GEO.janela.tempoMsg("Erro: "+e);}
	},
	/*
	Functin: colar

	Captura as coordenadas coladas pelo usu&aacute;rio e insere os pontos
	*/
	colar: function(){
		var regv = new RegExp(",", "g"),
			valores = $i("i3GEOinserexycolar").value;
		valores = valores.replace(regv,".");
		i3GEOF.inserexy.adiciona(valores);
	},
	/*
	Function: escolhedig

	Define o tipo de entrada de coordenadas (dms ou dd)
	*/
	escolhedig: function(q){
		if(q === 0){
			q = "i3GEOinserexydigmascara";
		}
		else{
			q = "i3GEOinserexydigcampo";
		}
		$i("i3GEOinserexydigmascara").style.display="none";
		$i("i3GEOinserexydigcampo").style.display="none";
		$i(q).style.display="block";
	},
	/*
	Function: pegaProjecao

	Obt&eacute;m o c&oacute;digo da proje&ccedil;&atilde;o escolhida
	*/
	pegaProjecao: function(){
		var inputs = $i("i3GEOinserexylistaepsg").getElementsByTagName("input"),
			i,
			projecao = "";
		for (i=0;i<inputs.length; i++){
			if (inputs[i].checked == true)
			{projecao = inputs[i].value;}
		}
		return(projecao);
	},
	/*
	Function: adiciona

	Adiciona um ponto no mapa

	Parametros:

	xy {string} - coordenadas x e y separadas por espa&ccedil;o

	fonte {string} - (opcional) como a coordenada foi obtida. Se for "cliqueMapa" o parametro proje&ccedil;&atilde;o ser&aacute; enviado como vazio para o servidor

	Veja:

	<i3GEO.php.insereSHP>
	*/
	adiciona: function(xy,fonte){
		if(i3GEOF.inserexy.aguarde.visibility === "visible")
		{return;}
		var tema,
			item = "",
			valoritem = "",
			temp,
			n,
			i,
			xyn,
			projecao = i3GEOF.inserexy.pegaProjecao();
		if(!$i("i3GEOinserexytemasLocais")){
			tema = "";
		}else{
			tema = $i("i3GEOinserexytemasLocais").value;
		}
		xyn = xy.split(" ");
		n = xyn.length;
		temp = "";
		for(i=0;i<n;i = i + 2){
			temp += "<div style='font-size:12px' >" + xyn[i]+" "+xyn[i+1] + "</div><br>";
		}
		$i("i3GEOinserexyguia6obj").innerHTML += temp;
		if($i("i3GEOinserexyItem") && $i("i3GEOinserexyvalorItem")){
			item = $i("i3GEOinserexyItem").value;
			valoritem = $i("i3GEOinserexyvalorItem").value;
		}
		if (tema === ""){
			i3GEO.janela.tempoMsg($trad('msgNenhumTemaDefinido',i3GEOF.inserexy.dicionario));
		}
		else{
			temp = function(retorno){
				if(i3GEO.Interface.ATUAL === "padrao")
				{i3GEO.atualiza();}
				i3GEO.Interface.atualizaTema(retorno,tema);
				i3GEOF.inserexy.aguarde.visibility = "hidden";
			};
			if(fonte !== undefined){
				projecao = "";
			}
			i3GEOF.inserexy.aguarde.visibility = "visible";
			i3GEO.php.insereSHP(temp,tema,item,valoritem,xy,projecao);
		}
	},
	/*
	Function: criaLin

	Converte os pontos de um tema em linhas

	Veja:

	<SPHPT2SHP>
	*/
	criaLin: function(){
		if(i3GEOF.inserexy.aguarde.visibility === "visible")
		{return;}
		i3GEOF.inserexy.aguarde.visibility = "visible";
		var cp = new cpaint(),
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=sphPT2shp&para=linha&tema="+$i("i3GEOinserexytemasLocais").value+"&ext="+i3GEO.parametros.mapexten,
			temp = function(){
				i3GEOF.inserexy.aguarde.visibility = "hidden";
				i3GEO.atualiza();
			};
		cp.set_response_type("JSON");
		cp.call(p,"sphPT2shp",temp);
	},
	/*
	Function: criaPol

	Converte os pontos de um tema em poligonos

	Veja:

	<SPHPT2SHP>
	*/
	criaPol: function(){
		if(i3GEOF.inserexy.aguarde.visibility === "visible")
		{return;}
		i3GEOF.inserexy.aguarde.visibility = "visible";
		var cp = new cpaint(),
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=sphPT2shp&para=poligono&tema="+$i("i3GEOinserexytemasLocais").value+"&ext="+i3GEO.parametros.mapexten,
			temp = function(){
				i3GEOF.inserexy.aguarde.visibility = "hidden";
				i3GEO.atualiza();
			};
		cp.set_response_type("JSON");
		cp.call(p,"sphPT2shp",temp);
	},
	/*
	Function: wkt

	Converte os pontos em WKT

	Veja:

	<MOSTRAWKT>
	*/
	wkt: function(){
		if(i3GEOF.inserexy.aguarde.visibility === "visible")
		{return;}
		i3GEOF.inserexy.aguarde.visibility = "visible";
		try{
			var divs = $i("i3GEOinserexyguia6obj").getElementsByTagName("div"),
				n = divs.length,
				xy = [],
				cp = new cpaint(),
				i,
				mostra = function(retorno){
					i3GEOF.inserexy.aguarde.visibility = "hidden";
					if (retorno.data !== undefined){
						var ins = "<textarea style=width:470px;height:80px >"+retorno.data[0]+"</textarea><br>";
						ins += "<textarea style=width:470px;height:80px >"+retorno.data[1]+"</textarea><br>";
						ins += "<textarea style=width:470px;height:80px >"+retorno.data[2]+"</textarea><br>";
						$i("i3GEOinserexywktres").innerHTML = "<p class=paragrafo >"+ins+"</p>";
					}
					else
					{$i("i3GEOinserexywktres").innerHTML = "<p style=color:red >Erro<br>";}
				};
			for (i=0;i<n;i++)
			{xy.push(divs[i].innerHTML);}
			xy = xy.join(" ");
			cp.set_response_type("JSON");
			cp.call(i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=mostrawkt&xy="+xy,"xy2wkt",mostra);
		}
		catch(e){i3GEO.janela.tempoMsg("Erro: "+e);i3GEOF.inserexy.aguarde.visibility = "hidden";}
	},
	/*
	Function: graficoPerfil

	Cria um gr&aacute;fico de perfil com base nos dados inseridos
	*/
	graficoPerfil: function(){
		try{
			var divs = $i("i3GEOinserexyguia6obj").getElementsByTagName("div"),
				js = i3GEO.configura.locaplic+"/ferramentas/perfil/index.js.php",
				n = divs.length,
				x = [],
				y = [],
				xy,
				i;
			for (i=0;i<n;i++){
				xy = divs[i].innerHTML.split(" ");
				x.push(xy[0]);
				y.push(xy[1]);
			}
			if(x.length == 0)
			{i3GEO.janela.tempoMsg($trad('msgNenhumPontoEncontrado',i3GEOF.inserexy.dicionario));return;}
			pontosdistobj = {
				xpt: x,
				ypt: y
			};
			i3GEO.util.scriptTag(js,"i3GEOF.perfil.criaJanelaFlutuante(pontosdistobj)","i3GEOF.perfil_script");

		}
		catch(e){i3GEO.janela.tempoMsg("Erro: "+e);}
	}
};
