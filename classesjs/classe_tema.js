/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Temas

File: i3geo/classesjs/classe_tema.js

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
if(typeof(i3GEO) === 'undefined'){
	i3GEO = [];
}
/*
Classe: i3GEO.tema

Funções de diálogo e processamento de propriedades de um tema existente no mapa

Em i3GEO.tema.dialogo estão as funções de abertura dos diálogos para alteração das propriedades do tema,
*/
i3GEO.tema = {
	/*
	Function: exclui

	Exclui um tema do mapa

	Parametros:

	tema - código do tema
	*/
	exclui: function(tema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.exclui()");}
		g_operacao = "excluitema";
		//remove o tema do DOM e seus filhos
		var p = document.getElementById("idx"+tema).parentNode.parentNode.parentNode;
		do
		{p.removeChild(p.childNodes[0]);}
		while
		(p.childNodes.length > 0);
		p.parentNode.removeChild(p);
		i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
		i3GEO.contadorAtualiza++;
		i3GEO.php.excluitema(i3GEO.atualiza,tema);
		i3GEO.mapa.ativaTema("");
		if(i3GEO.Interface.ATUAL === "openlayers"){
			var layer = i3geoOL.getLayersByName(tema)[0];
			i3geoOL.removeLayer(layer);
		}
	},
	/*
	Function: fonte

	Abre os metadados registrados para o tema

	Parametros:

	tema - código do tema
	*/
	fonte: function(tema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.fonte()");}
		i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
		var temp = function(retorno){
			i3GEO.janela.fechaAguarde();
			if(retorno.data !== "erro")
			{window.open(retorno.data);}
			else
			{alert("Não existe fonte registrada para esse tema");}
		};
		i3GEO.php.fontetema(temp,tema);
	},
	/*
	Function: sobe

	Sobe um tema na ordem de desenho

	Parametros:

	tema - código do tema
	*/
	sobe: function(tema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.sobe()");}
		var temp = function(retorno){
			//
			//atualiza apenas remonta a árvore
			//no caso de interfaces como openlayers
			//é necessário mover o DIV tbm
			//
			i3GEO.atualiza(retorno);
			if(i3GEO.Interface.ATUAL === "openlayers")
			{i3GEO.Interface.openlayers.ordenaLayers();}
		};
		i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
		i3GEO.contadorAtualiza++;
		i3GEO.php.sobetema(temp,tema);
	},
	/*
	Function: desce

	Desce um tema na ordem de desenho

	Parametros:

	tema - código do tema
	*/
	desce: function(tema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.desce()");}
		var temp = function(retorno){
			//
			//atualiza apenas remonta a árvore
			//no caso de interfaces como openlayers
			//é necessário mover o DIV tbm
			//
			i3GEO.atualiza(retorno);
			if(i3GEO.Interface.ATUAL === "openlayers")
			{i3GEO.Interface.openlayers.ordenaLayers();}
		};
		i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
		i3GEO.contadorAtualiza++;
		i3GEO.php.descetema(temp,tema);
	},
	/*
	Function: zoom

	Zoom para o tema

	Parametros:

	tema - código do tema
	*/
	zoom: function(tema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.zoom()");}
		i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
		i3GEO.contadorAtualiza++;
		i3GEO.php.zoomtema(i3GEO.atualiza,tema);
	},
	/*
	Function: zoomsel

	Zoom para os elementos selecionados de um tema

	Parametros:

	tema - código do tema
	*/
	zoomsel: function(tema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.zoomsel()");}
		i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
		i3GEO.contadorAtualiza++;
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
		g_operacao = "limpasel";
		i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
		i3GEO.contadorAtualiza++;
		var temp = function(retorno){
			i3GEO.atualiza(retorno);
			i3GEO.Interface.atualizaTema(retorno,tema);
		};
		i3GEO.php.limpasel(temp,tema);
	},
	/*
	Function: mudatransp

	Muda a transparencia de um tema

	Parametros:

	idtema - código do tema
	*/
	mudatransp: function(idtema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.mudatransp()");}
		g_operacao = "transparencia";
		var valor,
			temp = function(retorno){
				i3GEO.atualiza(retorno);
				i3GEO.Interface.atualizaTema(retorno,idtema);
			};
		//o campo input com o valor possui o prefixo 'tr' seguido pelo código do tema
		if ($i("tr"+idtema))
		{valor = $i("tr"+idtema).value;}
		else
		{alert("Ocorreu um erro");}
		if (valor !== ""){
			i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
			i3GEO.contadorAtualiza++;
			i3GEO.php.mudatransp(temp,idtema,valor);
		}
		else
		{alert("Valor não definido.");}
	},
	/*
	Function: mudanome
	
	Muda o nome de um tema

	Parametros:

	idtema - código do tema
	*/
	mudanome: function(idtema){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.mudanome()");}
		g_operacao = "mudanome";
		var valor;
		if($i("nn"+idtema))
		{valor = $i("nn"+idtema).value;}
		else
		{alert("Ocorreu um erro");}
		if (valor !== ""){
			i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
			i3GEO.contadorAtualiza++;
			i3GEO.php.mudanome(i3GEO.atualiza,idtema,valor);
		}
		else
		{alert("Nome não definido");}
	},
	/*
	Function: mostralegendajanela
	
	Mostra a legenda de um tema em uma janela flutuante específica
	
	Na configuração padrão, essa função é disparada quando o usuário estaciona o ouse sobre o nome de um tema na árvore de camadas
	
	O uso normal seria nas opções onmouseover e onmouseout
	
	Exemplo:
	
	onmouseover = i3GEO.tema.mostralegendajanela(idtema,nome,"ativatimer")
	
	onmouseout = i3GEO.tema.mostralegendajanela(idtema,nome,"desaativatimer")
	
	onclick = i3GEO.tema.mostralegendajanela(idtema,nome,"abrejanela")
	
	Parametros:
	
	idtema {String} - código do tema
	
	nome {String} - nome completo do tema que será mostrado no cabeçalho da janela
	
	tipoOperacao {String} {ativatimer|desativatimer|abrejanela} - tipo de operação que será executada
	*/
	mostralegendajanela: function(idtema,nome,tipoOperacao){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.tema.mostralegendajanela()");}
		//alert(idtema+" "+status)
		var retorna,janela;
		if(tipoOperacao === "ativatimer"){
			mostralegendajanelaTimer = setTimeout("i3GEO.tema.mostralegendajanela('"+idtema+"','"+nome+"','abrejanela')",4000);
		}
		if(tipoOperacao === "abrejanela"){
			try{clearTimeout(mostralegendajanelaTimer);}
			catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
			retorna = function(retorno){
				$i("janelaLegenda"+idtema+"_corpo").innerHTML = retorno.data.legenda;
			};
			if(!$i("janelaLegenda"+idtema)){
				janela = i3GEO.janela.cria("250px","","","","",nome,"janelaLegenda"+idtema,false);
				janela[2].style.textAlign="left";
				janela[2].style.background="white";
				janela[2].innerHTML = $trad("o1");	
			}
			i3GEO.php.criaLegendaHTML(retorna,idtema,"legenda3.htm");
		}
		if(tipoOperacao === "desativatimer"){
			clearTimeout(mostralegendajanelaTimer);
		}
	},
	/*
	Classe: i3GEO.tema.dialogo
	
	Abre as telas de diálogo das opções de manipulação de um tema
	
	Return:
	
	i3GEO.janela.cria
	*/
	dialogo:{
		/*
		Function: cortina

		Abre a janela de diálogo da ferramenta cortina
		
		Parametros:

		tema - código do tema escolhido
		
		*/
		cortina: function(tema){
			if(typeof(i3GEOF.cortina) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.cortina()","cortina","cortina");}
		},
		/*
		Function: abreKml

		Abre a janela de diálogo da ferramenta convertekml

		Parametros:

		tema - código do tema escolhido
		
		tipo - tipo de kml - kml|kmz , o tipo kmz permite acessar os dados via kml (por meio de um WMS) e via kml vetorial.
		*/
		abreKml: function(tema,tipo){
			if(arguments.lenght === 1)
			{tipo = "kml";}
			if(typeof(i3GEOF.converteKml) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.abreKml()","convertekml","converteKml");}
		},
		/*
		Function: graficotema

		Abre a janela de diálogo da ferramenta graficotema

		Parametros:

		idtema - código do tema
		*/
		graficotema: function(idtema){
			if(typeof(i3GEOF.graficoTema) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.graficotema()","graficotema","graficoTema");}
		},
		/*
		Function: toponimia

		Abre a janela de diálogo da ferramenta toponimia

		Parametros:

		idtema - código do tema
		*/
		toponimia: function(idtema){
			if(typeof(i3GEOF.toponimia) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.toponimia()","toponimia","toponimia");}
		},
		/*
		Function: filtro

		Abre a janela de diálogo da ferramenta filtro

		Parametros:

		idtema - código do tema
		*/
		filtro: function(idtema){
			if(typeof(i3GEOF.filtro) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.filtro()","filtro","filtro");}
		},
		/*
		Function: procuraratrib

		Abre a janela de diálogo da ferramenta busca

		Parametros:

		idtema - id que identifica o tema conforme definido no map file
		*/
		procuraratrib: function(idtema){
			if(typeof(i3GEOF.busca) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.procuraratrib()","busca","busca");}
		},
		/*
		Function: tabela

		Abre a janela de diálogo da ferramenta tabela

		Parametros:

		idtema - id que identifica o tema conforme definido no map file
		*/
		tabela: function(idtema){
			if(typeof(i3GEOF.tabela) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.tabela()","tabela","tabela");}
		},
		/*
		Function: etiquetas

		Abre a janela de diálogo da ferramenta etiqueta

		Parametros:

		idtema - id que identifica o tema conforme definido no map file
		*/
		etiquetas: function(idtema){
			if(typeof(i3GEOF.etiqueta) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.etiquetas()","etiquetas","etiquetas");}
		},
		/*
		Function: editaLegenda

		Abre a janela de diálogo da ferramenta legenda

		Parametros:

		idtema - id que identifica o tema conforme definido no map file
		*/
		editaLegenda: function(idtema){
			if(typeof(i3GEOF.legenda) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.editaLegenda()","legenda","legenda");}
		},
		/*
		Function: download

		Abre a janela de diálogo da ferramenta download

		Parametros:

		idtema - id que identifica o tema no map file.
		*/
		download: function(idtema){
			if(typeof(i3GEOF.download) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.download()","download","download");}
		},
		/*
		Function: sld
		
		Converte a legenda do tema para o formato SLD (utilizado em requisições de Web Services OGC)
		
		O SLD é mostrado em uma janela sobre o mapa
		
		Parametros:

		idtema - id ue identifica o tema no map file.
		*/
		sld: function(idtema)
		{i3GEO.janela.cria("500px","350px",i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=tema2sld&tema="+idtema+"&g_sid="+i3GEO.configura.sid,"","","SLD <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=5&idajuda=41' >&nbsp;&nbsp;&nbsp;</a>");},
		/*
		Function: editorsql

		Abre a janela de diálogo da ferramenta editorsql

		Parametros:

		idtema - id que identifica o tema no map file.
		*/
		editorsql: function(idtema){
			if(typeof(i3GEOF.editorsql) === 'undefined')
			{i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.editorsql()","editorsql","editorsql");}
		}
	}
};
//YAHOO.log("carregou classe tema", "Classes i3geo");