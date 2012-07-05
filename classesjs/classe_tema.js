/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Temas

File: i3geo/classesjs/classe_tema.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇ&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEO) === 'undefined'){
	var i3GEO = {};
}
/*
Classe: i3GEO.tema

Funcoes de dialogo e processamento de propriedades de um tema existente no mapa

Em i3GEO.tema.dialogo estao as funcoes de abertura dos dialogos para alteracao das propriedades do tema,
*/
i3GEO.tema = {
	/*
	Variable: TEMPORIZADORESID

	Objeto que contem os identificadores dos temporizadores (setInterval) estabelecidos para cada camada

	Type:
	{objeto} - {idtema:{idtemporizador:,tempo:}}
	*/
	TEMPORIZADORESID: {},
	/*
	Function: exclui

	Exclui um tema do mapa

	Parametros:

	tema - codigo do tema
	*/
	exclui: function(tema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.exclui()");}
		g_operacao = "excluitema";
		//remove o tema do DOM e seus filhos
		try{
			var p = document.getElementById("idx"+tema).parentNode.parentNode.parentNode;
			do
			{p.removeChild(p.childNodes[0]);}
			while
			(p.childNodes.length > 0);
			p.parentNode.removeChild(p);
		}
		catch(e){}
		i3GEO.php.excluitema(i3GEO.atualiza,[tema]);
		i3GEO.mapa.ativaTema("");
		i3GEO.temaAtivo = "";
	},
	/*
	Function: fonte

	Abre os metadados registrados para o tema

	Parametros:

	tema - codigo do tema
	*/
	fonte: function(tema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.fonte()");}
		i3GEO.mapa.ativaTema(tema);
		window.open(i3GEO.configura.locaplic+"/admin/abrefontemapfile.php?tema="+tema);
	},
	/*
	Function: sobe

	Sobe um tema na ordem de desenho

	Parametros:

	tema - codigo do tema
	*/
	sobe: function(tema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.sobe()");}
		i3GEO.mapa.ativaTema(tema);
		i3GEO.php.sobetema(
			function(retorno){
				//
				//atualiza apenas remonta a arvore
				//no caso de interfaces como openlayers
				//e necessario mover o DIV tbm
				//
				i3GEO.atualiza(retorno);
				if(i3GEO.Interface.ATUAL === "openlayers")
				{i3GEO.Interface.openlayers.ordenaLayers();}
			},
			tema
		);
	},
	/*
	Function: desce

	Desce um tema na ordem de desenho

	Parametros:

	tema - codigo do tema
	*/
	desce: function(tema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.desce()");}
		i3GEO.mapa.ativaTema(tema);
		i3GEO.php.descetema(
			function(retorno){
				//
				//atualiza apenas remonta a arvore
				//no caso de interfaces como openlayers
				//e necessario mover o DIV tbm
				//
				i3GEO.atualiza(retorno);
				if(i3GEO.Interface.ATUAL === "openlayers")
				{i3GEO.Interface.openlayers.ordenaLayers();}
			},
			tema
		);
	},
	/*
	Function: zoom

	Zoom para o tema

	Parametros:

	tema - codigo do tema
	*/
	zoom: function(tema){
		i3GEO.mapa.ativaTema(tema);
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.zoom()");}
		i3GEO.php.zoomtema(i3GEO.atualiza,tema);
	},
	/*
	Function: zoomsel

	Zoom para os elementos selecionados de um tema

	Parametros:

	tema - codigo do tema
	*/
	zoomsel: function(tema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.zoomsel()");}
		i3GEO.mapa.ativaTema(tema);
		i3GEO.php.zoomsel(i3GEO.atualiza,tema);
	},
	/*
	Function: limpasel

	Limpa a selecao do tema

	Parametros:

	tema - ID (name) do tema clicado
	*/
	limpasel: function(tema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.limpasel()");}
		i3GEO.mapa.ativaTema(tema);
		g_operacao = "limpasel";
		i3GEO.php.limpasel(
			function(retorno){
				i3GEO.atualiza(retorno);
				i3GEO.Interface.atualizaTema(retorno,tema);
			},
			tema
		);
	},
	/*
	Function: mudatransp

	Muda a transparencia de um tema

	Parametros:

	idtema - codigo do tema
	*/
	mudatransp: function(idtema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.mudatransp()");}
		i3GEO.mapa.ativaTema(idtema);
		g_operacao = "transparencia";
		var valor = "";
		//o campo input com o valor possui o prefixo 'tr' seguido pelo codigo do tema
		if ($i("tr"+idtema))
		{valor = $i("tr"+idtema).value;}
		if (valor !== ""){
			i3GEO.php.mudatransp(
				function(retorno){
					i3GEO.atualiza(retorno);
					i3GEO.Interface.atualizaTema(retorno,idtema);
				},
				idtema,
				valor
			);
		}
		else
		{alert($trad("x16"));}
	},
	/*
	Function: invertestatuslegenda

	Inverte o status atual do metadata CLASSE, permitindo esconder ou mostrar a legenda do tema

	Parametros:

	idtema - codigo do tema
	*/
	invertestatuslegenda: function(idtema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.invertestatuslegenda()");}
		alert($trad("x17"));
		i3GEO.mapa.ativaTema(idtema);
		g_operacao = "transparencia";
		i3GEO.php.invertestatuslegenda(
			function(retorno){
				i3GEO.atualiza(retorno);
				i3GEO.arvoreDeCamadas.atualiza();
			},
			idtema
		);
	},
	/*
	Function: alteracorclasse

	Altera a cor de uma classe de um tema

	Parametros:

	idtema - codigo do tema

	idclasse - id da classe

	rgb - nova cor (r,g,b)
	*/
	alteracorclasse: function(idtema,idclasse,rgb){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.alteracorclasse()");}
		i3GEO.mapa.ativaTema(idtema);
		i3GEO.php.aplicaCorClasseTema(
			temp = function(){
				i3GEO.atualiza();
				i3GEO.Interface.atualizaTema("",idtema);
				i3GEO.arvoreDeCamadas.atualizaLegenda(idtema);
			},
			idtema,
			idclasse,
			rgb
		);
	},
	/*
	Function: mudanome

	Muda o nome de um tema

	Parametros:

	idtema - codigo do tema
	*/
	mudanome: function(idtema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.mudanome()");}
		i3GEO.mapa.ativaTema(idtema);
		g_operacao = "mudanome";
		var valor = "";
		if($i("nn"+idtema))
		{valor = $i("nn"+idtema).value;}
		if (valor !== ""){
			i3GEO.php.mudanome(i3GEO.atualiza,idtema,valor);
		}
		else
		{alert($trad("x18"));}
	},
	/*
	Function: mostralegendajanela

	Mostra a legenda de um tema em uma janela flutuante especifica

	Na configuracao padrao, essa funcao e disparada quando o usuario estaciona o ouse sobre o nome de um tema na arvore de camadas

	O uso normal seria nas opcoes onmouseover e onmouseout

	Exemplo:

	onmouseover = i3GEO.tema.mostralegendajanela(idtema,nome,"ativatimer")

	onmouseout = i3GEO.tema.mostralegendajanela(idtema,nome,"desaativatimer")

	onclick = i3GEO.tema.mostralegendajanela(idtema,nome,"abrejanela")

	Parametros:

	idtema {String} - codigo do tema

	nome {String} - nome completo do tema que sera mostrado no cabecalho da janela

	tipoOperacao {String} {ativatimer|desativatimer|abrejanela} - tipo de operacao que sera executada
	*/
	mostralegendajanela: function(idtema,nome,tipoOperacao){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.mostralegendajanela()");}
		if(tipoOperacao === "ativatimer"){
			mostralegendajanelaTimer = setTimeout("i3GEO.tema.mostralegendajanela('"+idtema+"','"+nome+"','abrejanela')",4000);
		}
		if(tipoOperacao === "abrejanela"){
			try{clearTimeout(mostralegendajanelaTimer);}
			catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
			if(!$i("janelaLegenda"+idtema)){
				var janela = i3GEO.janela.cria("250px","","","","",nome,"janelaLegenda"+idtema,false);
				janela[2].style.textAlign="left";
				janela[2].style.background="white";
				janela[2].innerHTML = $trad("o1");
			}
			i3GEO.php.criaLegendaHTML(
				function(retorno){
					$i("janelaLegenda"+idtema+"_corpo").innerHTML = retorno.data.legenda;
				},
				idtema,
				"legenda3.htm"
			);
		}
		if(tipoOperacao === "desativatimer"){
			clearTimeout(mostralegendajanelaTimer);
		}
	},
	/*
	Function: temporizador

	Aplica um temporizador para que a camada seja redesenhada em determinado intervalo de tempo.

	O campo com o valor de tempo (em segundos) e composto por "temporizador"+idtema

	Parametros:

	idtema - id que identifica o tema no map file.
	*/
	temporizador: function(idtema,tempo){
		if(!tempo)
		{tempo = $i("temporizador"+idtema).value;}
		if(tempo != "" && parseInt(tempo,10) > 0){
			eval('i3GEO.tema.TEMPORIZADORESID.'+idtema+' = {tempo: '+tempo+',idtemporizador: setInterval(function('+idtema+'){if(!$i("arrastar_'+idtema+'")){delete(i3GEO.tema.TEMPORIZADORESID.'+idtema+');return;}i3GEO.Interface.atualizaTema("",idtema);},parseInt('+tempo+',10)*1000)};');
		}
		else{
			try{
				window.clearInterval(i3GEO.tema.TEMPORIZADORESID[idtema].idtemporizador);
				delete(i3GEO.tema.TEMPORIZADORESID[idtema]);
			}
			catch(e){}
		}
	},
	/*
	Classe: i3GEO.tema.dialogo

	Abre as telas de dialogo das opcoes de manipulacao de um tema

	Return:

	i3GEO.janela.cria
	*/
	dialogo:{
		/*
		Function: tme

		Abre a ferramenta TME

		Parametros:

		tema - codigo do tema escolhido
		*/
		tme: function(tema){
			i3GEO.mapa.ativaTema(tema);
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.tme()","tme","tme");
		},
		/*
		Function: mostraWms

		Mostra a url que da acesso ao WMS de um tema

		Parametros:

		tema - codigo do tema escolhido
		*/
		mostraWms: function(tema){
			i3GEO.janela.mensagemSimples(i3GEO.configura.locaplic+"/ogc.php?tema="+tema,"WMS url");
		},
		/*
		Function: comentario

		Abre a janela de dialogo para o usuario ver e inserir comentarios em um tema

		Parametros:

		tema - codigo do tema escolhido
		*/
		comentario: function(tema){
			i3GEO.janela.cria("530px","330px",i3GEO.configura.locaplic+"/ferramentas/comentarios/index.php?tema="+tema+"&g_sid="+i3GEO.configura.sid+"&locaplic="+i3GEO.configura.locaplic,"","","<img src='"+i3GEO.configura.locaplic+"/imagens/player_volta.png' style=cursor:pointer onclick='javascript:history.go(-1)'><span style=position:relative;top:-2px; > "+$trad("x19")+" "+tema+" </span><a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=7&idajuda=68' >&nbsp;&nbsp;&nbsp;</a>","comentario"+Math.random());
		},
		/*
		Function: cortina

		Abre a janela de dialogo da ferramenta cortina

		Parametros:

		tema - codigo do tema escolhido

		*/
		cortina: function(tema){
			i3GEO.mapa.ativaTema(tema);
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.cortina()","cortina","cortina");
		},
		/*
		Function: abreKml

		Abre a janela de dialogo da ferramenta convertekml

		Parametros:

		tema - codigo do tema escolhido

		tipo - tipo de kml - kml|kmz , o tipo kmz permite acessar os dados via kml (por meio de um WMS) e via kml vetorial.
		*/
		abreKml: function(tema,tipo){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.dialogo.abreKml()");}
			if(arguments.lenght === 1)
			{tipo = "kml";}
			if(typeof(i3GEOF.converteKml) === 'undefined'){
				i3GEO.util.scriptTag(i3GEO.configura.locaplic+"/ferramentas/convertekml/index.js","i3GEOF.converteKml.criaJanelaFlutuante('"+tema+"','"+tipo+"')","i3GEOF.converteKml_script");
			}
			else
			{i3GEOF.converteKml.criaJanelaFlutuante(tema,tipo);}
		},
		/*
		Function: salvaMapfile

		Abre a janela de dialogo da ferramenta salvamapfile

		Parametros:

		idtema - codigo do tema
		*/
		salvaMapfile: function(idtema){
			i3GEO.mapa.ativaTema(idtema);
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.salvamapfile()","salvamapfile","salvamapfile");
		},
		/*
		Function: graficotema

		Abre a janela de dialogo da ferramenta graficotema

		Parametros:

		idtema - codigo do tema
		*/
		graficotema: function(idtema){
			i3GEO.mapa.ativaTema(idtema);
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.graficotema()","graficotema","graficoTema");
		},
		/*
		Function: toponimia

		Abre a janela de dialogo da ferramenta toponimia

		Parametros:

		idtema - codigo do tema
		*/
		toponimia: function(idtema){
			i3GEO.mapa.ativaTema(idtema);
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.toponimia()","toponimia","toponimia");
		},
		/*
		Function: filtro

		Abre a janela de dialogo da ferramenta filtro

		Parametros:

		idtema - codigo do tema
		*/
		filtro: function(idtema){
			i3GEO.mapa.ativaTema(idtema);
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.filtro()","filtro","filtro");
		},
		/*
		Function: procuraratrib

		Abre a janela de dialogo da ferramenta busca

		Parametros:

		idtema - id que identifica o tema conforme definido no map file
		*/
		procuraratrib: function(idtema){
			i3GEO.mapa.ativaTema(idtema);
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.procuraratrib()","busca","busca");
		},
		/*
		Function: tabela

		Abre a janela de dialogo da ferramenta tabela

		Parametros:

		idtema - id que identifica o tema conforme definido no map file
		*/
		tabela: function(idtema){
			i3GEO.mapa.ativaTema(idtema);
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.tabela()","tabela","tabela");
		},
		/*
		Function: etiquetas

		Abre a janela de dialogo da ferramenta etiqueta

		Parametros:

		idtema - id que identifica o tema conforme definido no map file
		*/
		etiquetas: function(idtema){
			i3GEO.mapa.ativaTema(idtema);
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.etiquetas()","etiqueta","etiqueta");
		},
		/*
		Function: editaLegenda

		Abre a janela de dialogo da ferramenta legenda

		Parametros:

		idtema - id que identifica o tema conforme definido no map file
		*/
		editaLegenda: function(idtema){
			i3GEO.mapa.ativaTema(idtema);
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.editaLegenda()","legenda","legenda");
		},
		/*
		Function: download

		Abre a janela de dialogo da ferramenta download

		Parametros:

		idtema - id que identifica o tema no map file.
		*/
		download: function(idtema){
			i3GEO.mapa.ativaTema(idtema);
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.download()","download","download");
		},
		/*
		Function: sld

		Converte a legenda do tema para o formato SLD (utilizado em requisicoes de Web Services OGC)

		O SLD e mostrado em uma janela sobre o mapa

		Parametros:

		idtema - id que identifica o tema no map file.
		*/
		sld: function(idtema){
			i3GEO.mapa.ativaTema(idtema);
			i3GEO.janela.cria("500px","350px",i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=tema2sld&tema="+idtema+"&g_sid="+i3GEO.configura.sid,"","","SLD <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=5&idajuda=41' >&nbsp;&nbsp;&nbsp;</a>");
		},
		/*
		Function: aplicarsld

		Fax o upload de um arquivo SLD (xml) e aplica ao tema

		Parametros:

		idtema - id que identifica o tema no map file.
		*/
		aplicarsld: function(idtema){
			i3GEO.mapa.ativaTema(idtema);
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.aplicarsld()","aplicarsld","aplicarsld");
		},
		/*
		Function: editorsql

		Abre a janela de dialogo da ferramenta editorsql

		Parametros:

		idtema - id que identifica o tema no map file.
		*/
		editorsql: function(idtema){
			i3GEO.mapa.ativaTema(idtema);
			i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.editorsql()","editorsql","editorsql");
		}
	}
};
//YAHOO.log("carregou classe tema", "Classes i3geo");