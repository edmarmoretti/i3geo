/*
 Title: Editor de legenda

 Define a forma de representa&ccedil;&atilde;o de um tema, modificando o tipo de classifica&ccedil;&atilde;o e os s&iacute;mbolos utilizados em cada classe

 Veja:

 <i3GEO.tema.dialogo.editaLegenda>

 Arquivo:

 i3geo/ferramentas/legenda/index.js.php

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

if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
/*
 * Classe: i3GEOF.legenda
 */
//incuir opcao para inserir o nome de uma imagem da legenda
i3GEOF.legenda =
{
	/*
	 * Variavel: parDefault
	 *
	 * Parametros padr&atilde;o utilizados para formatar os labels
	 */
	parDefault : "&position=MS_UR&partials=1&offsetx=0&offsety=0&minfeaturesize=auto&mindistance=auto&force=0&shadowsizex=1&shadowsizey=1&cor=0 0 0&sombray=1&sombrax=1&angulo=0&tamanho=8&fonte=bitmap&fundo=off&sombra=off&outlinecolor=off&shadowcolor=off&wrap=",
	/*
	 * Variavel: aviso
	 *
	 * Indica que uma altera&ccedil;&atilde;o ainda n&atilde;o foi salva
	 *
	 * Type: {boolean}
	 */
	aviso : false,
	/*
	 * Variavel: tema
	 *
	 * Tema que ser&aacute; utilizado
	 *
	 * Type: {string}
	 */
	tema : i3GEO.temaAtivo,
	/*
	 * Variavel: dadosGrafico
	 *
	 * Dados utilizados no gr&aacute;fico no formato da ferramenta graficointerativo
	 */
	dadosGrafico : "",
	/*
	 * Variavel: aguarde
	 *
	 * Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	 */
	aguarde : "",
	/*
	 * Variavel: estilos
	 *
	 * Estilos existentes em um s&iacute;mbolo de uma classe
	 */
	estilos : "",
	/*
	 * Variavel: estilo
	 *
	 * Ultimo estilo selecionado
	 */
	estilo : 0,
	/*
	 * Variavel: classe
	 *
	 * Ultima classe selecionado
	 */
	classe : "",
	templateDir : "../ferramentas/legenda",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	MUSTACHELISTA : "",
	MUSTACHEESTILO : "",
	DICIONARIO: "",
	/**
	 * Funcao do usuario que e executada apos iniciar a ferramenta
	 */
	aposIniciar : function(){

	},
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
	    var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.legenda.dicionario);
	    dicionario["locaplic"] = i3GEO.configura.locaplic;
	    dicionario["asp"] = '"';
	    dicionario["aplicar"] = $trad("p14");
	    //para reaproveitamento
	    i3GEOF.legenda.DICIONARIO = dicionario;
	    return dicionario;
	},
	/*
	 * Function: inicia
	 *
	 * Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
	 *
	 * Parametro:
	 *
	 * iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	 */
	inicia : function(iddiv) {
	    if(i3GEOF.legenda.MUSTACHE == ""){
		var d = i3GEOF.legenda.templateDir;
		var t1 = d + "/template_mst.html",
		t2 = d + "/templateLista_mst.html",
		t3 = d + "/templateFormEstilo_mst.html";
		$.when( $.get(t1),$.get(t2),$.get(t3) ).done(function(r1,r2,r3) {
		    i3GEOF.legenda.MUSTACHE = r1[0];
		    i3GEOF.legenda.MUSTACHELISTA = r2[0];
		    i3GEOF.legenda.MUSTACHEESTILO = r3[0];
		    i3GEOF.legenda.inicia(iddiv);
		}).fail(function() {
		    i3GEO.janela.closeMsg($trad("erroTpl"));
		    return;
		});
		return;
	    }

	    try {
		$i(iddiv).innerHTML = i3GEOF.legenda.html();
		if (!$i("i3GEOFlegendaComboCabecaSel")) {
		    i3GEO.janela.comboCabecalhoTemasBs("i3GEOFlegendaComboCabeca", "i3GEOFlegendaComboCabecaSel", "legenda", "ligados",function(evt){
			var botao = evt.target;
			if (botao) {
			    if (botao.value != "") {
				i3GEO.mapa.ativaTema(botao.value);
				i3GEOF.legenda.tema = botao.value;
				$i(iddiv).innerHTML = "";
				i3GEOF.legenda.inicia(iddiv);
			    } else {
				//$i(iddiv).innerHTML = "";
			    }
			}
		    });
		}
		i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia1", "i3GEOlegendaguia");
		// eventos das guias
		$i("i3GEOlegendaguia8").onclick = function() {
		    i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia8", "i3GEOlegendaguia");
		    i3GEOF.legenda.parametrosAuto();
		};
		$i("i3GEOlegendaguia7").onclick = function() {
		    i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia7", "i3GEOlegendaguia");
		};
		$i("i3GEOlegendaguia6").onclick = function() {
		    i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia6", "i3GEOlegendaguia");
		};
		$i("i3GEOlegendaguia1").onclick = function() {
		    i3GEOF.legenda.mostralegenda();
		    i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia1", "i3GEOlegendaguia");
		};
		$i("i3GEOlegendaguia2").onclick = function() {
		    i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia2", "i3GEOlegendaguia");
		};
		$i("i3GEOlegendaguia3").onclick = function() {
		    i3GEO.janela.tempoMsg($trad('ajuda', i3GEOF.legenda.dicionario));
		};
		$i("i3GEOlegendaguia4").onclick = function() {
		    i3GEOF.legenda.mostraGrafico();
		};
		$i("i3GEOlegendaguia5").onclick = function() {
		    i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia5", "i3GEOlegendaguia");
		};

		i3GEOF.legenda.ativaFoco();
		i3GEOF.legenda.mostralegenda();
		i3GEOF.legenda.montaCombosItens();
		var objTema = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.legenda.tema);
		if (objTema.classe && objTema.classe.toLowerCase() == "nao") {
		    $i("i3GEOFlegendamostra").checked = false;
		}
		if(objTema.legendaimg){
		    $i("i3GEOlegendaImg").value = objTema.legendaimg;
		}
		if(objTema.offsite){
		    $i("i3GEOoffsite").value = objTema.offsite;
		}

		i3GEO.util.aplicaAquarela("i3GEOF.legenda_corpo");
		i3GEOF.legenda.aposIniciar.call();
	    } catch (erro) {
		i3GEOF.legenda.aposIniciar = function(){};
	    }
	    i3GEO.guias.ajustaGuiaFerramenta("i3GEOF.legenda", "i3GEOlegenda");
	},
	sldi: function() {
	    i3GEO.tema.dialogo.aplicarsld(i3GEOF.legenda.tema);
	},
	slde: function() {
	    window.open(i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?funcao=tema2sld&tema="
		    + i3GEOF.legenda.tema
		    + "&g_sid="
		    + i3GEO.configura.sid);
	},
	propriedadesLabels: function() {
	    i3GEO.util.scriptTag(
		    i3GEO.configura.locaplic + "/ferramentas/opcoes_label/dependencias.php",
		    "i3GEOF.proplabel.iniciaJanelaFlutuante(false)",
		    "i3GEOFproplabel",
		    false);
	},
	incluirLabels: function() {
	    var par, p, temp, cp;
	    try {
		par = i3GEOF.proplabel.pegaPar();
		i3GEOF.legenda.parDefault = par;
	    } catch (e) {
		par = i3GEOF.legenda.parDefault;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    temp = function() {
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.aposAlterarLegenda();
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    };
	    p =
		i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=adicionaLabelClasse&tema="
		+ i3GEOF.legenda.tema
		+ "&classe="
		+ i3GEOF.legenda.classe
		+ par;
	    p += "&item=" + $i("i3GEOlegendaSelItemLabel").value;
	    cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", temp);
	},
	excluiLabels: function() {
	    var p, temp, cp;
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    temp = function() {
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.aposAlterarLegenda();
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    };
	    p =
		i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=removeLabelClasse&tema="
		+ i3GEOF.legenda.tema
		+ "&classe="
		+ i3GEOF.legenda.classe;
	    cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", temp);
	},
	janelaCorRamp: function(){
	    var tabela = $i("i3GEOlegendalegenda");
	    var trs = tabela.getElementsByTagName("tr");
	    var ncores = trs.length - 1;
	    i3GEO.util.abreColourRamp("", "listaColourRamp", ncores, i3GEOF.legenda.tema);
	},
	/*
	 * Function: html
	 *
	 * Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta
	 *
	 * Retorno:
	 *
	 * String com o c&oacute;digo html
	 */
	html : function() {
	    var ins = Mustache.render(i3GEOF.legenda.MUSTACHE, i3GEOF.legenda.mustacheHash());
	    return ins;
	},
	/*
	 * Function: iniciaJanelaFlutuante
	 *
	 * Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante : function() {
	    var minimiza, cabecalho, janela, divid, temp, titulo;
	    if ($i("i3GEOF.legenda")) {
		i3GEOF.legenda.tema = i3GEO.temaAtivo;
		i3GEOF.legenda.inicia("i3GEOF.legenda_corpo");
		return;
	    }
	    cabecalho = function() {
		i3GEOF.legenda.ativaFoco();
	    };
	    minimiza = function() {
		i3GEO.janela.minimiza("i3GEOF.legenda");
	    };
	    // cria a janela flutuante
	    titulo = "<span class='i3GeoTituloJanelaBsNolink' >"+$trad("t33")+"</span></div>";

	    janela = i3GEO.janela.cria(
		    "590px",
		    "350px",
		    "",
		    "",
		    "",
		    titulo,
		    "i3GEOF.legenda",
		    false,
		    "hd",
		    cabecalho,
		    minimiza,
		    function() {i3GEO.guias.ajustaGuiaFerramenta("i3GEOF.legenda", "i3GEOlegenda");},
		    true,
		    "",
		    "",
		    "",
		    "",
		    "41"
	    );
	    divid = janela[2].id;
	    i3GEOF.legenda.aguarde = $i("i3GEOF.legenda_imagemCabecalho").style;
	    $i("i3GEOF.legenda_corpo").style.backgroundColor = "white";
	    i3GEOF.legenda.inicia(divid);
	},
	/*
	 * Function: ativaFoco
	 *
	 * Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	 */
	ativaFoco : function() {

	},
	/*
	 * Function: aposAlterarLegenda
	 *
	 * Fun&ccedil;&atilde;o executada ap&oacute;s ocorrer alguma altera&ccedil;&atilde;o efetiva da legenda do mapa
	 */
	aposAlterarLegenda : function() {
	    i3GEO.arvoreDeCamadas.CAMADAS = [];
	    i3GEO.atualiza();
	    i3GEO.Interface.atualizaTema("", i3GEOF.legenda.tema);
	},
	/*
	 * Function: mostralegenda
	 *
	 * Pega os dados da legenda do mapa atual e mostra na tela
	 *
	 * Veja:
	 *
	 * <EDITALEGENDA>
	 */
	mostralegenda : function() {
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var p, cp;
	    p =
		i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=editalegenda&opcao=edita&tema="
		+ i3GEOF.legenda.tema;
	    cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "tabelaLegenda", i3GEOF.legenda.montaLegenda);
	},
	/*
	 * Function: montaLegenda
	 *
	 * Formata a tabela de edi&ccedil;&atilde;o da legenda
	 *
	 * Parametro:
	 *
	 * retorno - objeto contendo os dados para formata&ccedil;&atilde;o da legenda
	 */
	montaLegenda : function(retorno) {
	    i3GEOF.legenda.aviso = false;
	    try {
		if (retorno.data != undefined) {
		    //hidden e utilizado para esconder ou mostrar determinados trechos do template
		    var mustache = [], b, ins, i, ajuda, id, re, exp, n, filtro,temp = {};
		    // se nao for do tipo raster
		    if (retorno.data[0].proc === "") {
			n = retorno.data.length;
			for (i = 0; i < n; i++) {
			    temp = {};
			    id = retorno.data[i].tema + "-" + retorno.data[i].idclasse;
			    re = new RegExp("'", "g");
			    exp = (retorno.data[i].expressao).replace(re, '"');
			    temp.cliqueExclui = $trad('cliqueExclui', i3GEOF.legenda.dicionario);
			    temp.cliqueAltera = $trad('cliqueAltera', i3GEOF.legenda.dicionario);
			    temp.imagem = retorno.data[i].imagem;
			    temp.id = id;
			    temp.idclasse = retorno.data[i].idclasse;
			    temp.novoNome = $trad('digitaNovoNome', i3GEOF.legenda.dicionario);
			    temp.nome = retorno.data[i].nomeclasse;
			    temp.editorExp = $trad("editorExp", i3GEOF.legenda.dicionario);
			    temp.exp = exp;
			    temp.txtMinscale = $trad('minScale', i3GEOF.legenda.dicionario);
			    temp.minScale = retorno.data[i].minScale;
			    temp.txtMaxScale = $trad('maxScale', i3GEOF.legenda.dicionario);
			    temp.maxScale = retorno.data[i].maxScale;
			    temp.sobe = $trad('sobe', i3GEOF.legenda.dicionario);
			    temp.desce = $trad('desce', i3GEOF.legenda.dicionario);
			    mustache.push(temp);
			}
			ins = Mustache.render(
				i3GEOF.legenda.MUSTACHELISTA,
				$.extend(
					{},
					{
					    "linhas" :  mustache,
					    "hidden2":"",
					    "hidden1": "hidden"
					},
					i3GEOF.legenda.DICIONARIO
				)
			);
			$i("i3GEOlegendaguia1objLegenda").innerHTML = ins;
		    } else {
			ajuda = i3GEOF.legenda.DICIONARIO['ajudaEscalaCores']
			+ "<p>"
			+ i3GEOF.legenda.DICIONARIO['msgEscalaCoresAuto']
			+ "<p>"
			+ i3GEOF.legenda.DICIONARIO['msgEscalaCoresIndividual']
			+ "<p>"
			+ i3GEOF.legenda.DICIONARIO['msgBandas']
			+ "<p>"
			+ i3GEOF.legenda.DICIONARIO['msgReamostragem'];

			mustache = [];
			for (i = 0; i < retorno.data[0].proc.length; i++) {
			    mustache.push({
				"value": retorno.data[0].proc[i]
			    });
			}

			ins = Mustache.render(
				i3GEOF.legenda.MUSTACHELISTA,
				$.extend(
					{},
					{
					    "hidden2":"hidden",
					    "hidden1": "",
					    "ajuda1": ajuda,
					    "processos": mustache
					},
					i3GEOF.legenda.DICIONARIO
				)
			);
			$i("i3GEOlegendaguia1objLegenda").innerHTML = ins;
		    }
		} else {
		    $i("i3GEOlegendaresultado").innerHTML = "<p style=color:red >Erro<br>";
		}
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    } catch (e) {
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	filtro : function(idRetorno) {
	    i3GEO.tema.dialogo.filtro(i3GEOF.legenda.tema, true, idRetorno);
	},
	/*
	 * Function: aviso
	 *
	 * Mostra um i3GEO.janela.tempoMsga ao usu&aacute;rio quando um campo da tabela que cont&eacute;m os dados da legenda &eacute;
	 * alterado
	 *
	 * O aviso &eacute; mostrado apenas uma vez
	 */
	aviso : function() {
	    if (i3GEOF.legenda.aviso == true) {
		i3GEO.janela.tempoMsg($trad('msgAplicaAlteracao', i3GEOF.legenda.dicionario));
		i3GEOF.legenda.aviso == false;
	    }
	},
	/*
	 * Function: aplicaColourRamp
	 *
	 * Aplica nas classes da legenda as cores escolhidas no seletor de cores
	 */
	aplicaColourRamp : function() {
	    if ($i("listaColourRamp").value != "") {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var cores = $i("listaColourRamp").value, ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten), temp = function() {
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostralegenda();
		    i3GEOF.legenda.aposAlterarLegenda();
		}, p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=alteraclasse&opcao=aplicacoresrgb&ext="
		    + ext
		    + "&tema="
		    + i3GEOF.legenda.tema, cp = new cpaint();
		cp.set_transfer_mode('POST');
		cp.set_response_type("JSON");
		cp.call(p, "foo", temp, "cores=" + cores);
	    }
	},
	/*
	 * Function: corj
	 *
	 * Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	 */
	corj : function(obj) {
	    i3GEO.util.abreCor("", obj);
	},
	/*
	 * Function: modificaCor
	 *
	 * Modifica a cor de uma classe
	 */
	modificaCor : function(id) {
	    var obj = $i("tempCorLegenda");
	    if (!obj) {
		var obj = document.createElement("input");
		obj.id = "tempCorLegenda";
		obj.style.display = "none";
		obj.type = "text";
		obj.value = "";
		document.body.appendChild(obj);
		obj.onchange = function() {
		    i3GEOF.legenda.aplicaNovaCor($i("tempCorLegenda").name);
		};
	    }
	    obj.name = id;
	    i3GEO.util.abreCor("", "tempCorLegenda");
	},
	aplicaNovaCor : function(id) {
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var retorna = function() {
		i3GEOF.legenda.aposAlterarLegenda();
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.mostralegenda();
	    };
	    i3GEO.php.aplicaCorClasseTema(retorna, i3GEOF.legenda.tema, id, $i("tempCorLegenda").value);
	},
	aplicarLegendaImg : function() {
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    //muda o valor do objeto tema para que a proxima vez que abrir a ferramenta o campo input seja preenchido corretamente
	    var objTema = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.legenda.tema);
	    objTema.legendaimg = $i("i3GEOlegendaImg").value;

	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var retorna = function() {
		i3GEOF.legenda.aposAlterarLegenda();
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.mostralegenda();
	    };
	    var p =
		i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=aplicaLegendaImg"
		+ "&tema="
		+ i3GEOF.legenda.tema
		+ "&imagem="
		+ objTema.legendaimg,
		cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", retorna);
	},
	aplicarOffsite : function() {
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    //muda o valor do objeto tema para que a proxima vez que abrir a ferramenta o campo input seja preenchido corretamente
	    var objTema = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.legenda.tema);
	    objTema.offsite = $i("i3GEOoffsite").value;

	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var retorna = function() {
		i3GEOF.legenda.aposAlterarLegenda();
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.mostralegenda();
	    };
	    var p =
		i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=aplicaOffsite"
		+ "&tema="
		+ i3GEOF.legenda.tema
		+ "&offsite="
		+ objTema.offsite,
		cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", retorna);
	},
	/*
	 * Function: mudaLegenda
	 *
	 * Altera a legenda conforme os valores existentes na tabela de propriedades (express&atilde;o e nome da classe)
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	mudaLegenda : function() {
	    i3GEOF.legenda.aviso = false;
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    try {
		var tabela = $i("i3GEOlegendalegenda"),
		trs = tabela.getElementsByTagName("tr"),
		minScales = [],
		maxScales = [],
		nomes = [],
		exps = [],
		ids = [],
		t, nn, n, p, cp, temp;
		for (t = 1; t < trs.length; t++) {
		    if (trs[t].childNodes) {
			nn = trs[t].childNodes;
			for (n = 0; n < nn.length; n++) {
			    if (nn && nn[n] && nn[n].childNodes && nn[n].getElementsByTagName) {
				var isn = nn[n].getElementsByTagName("input");
				if (isn && isn[0] != undefined) {
				    if (isn[0].name == "nome") {
					nomes.push(isn[0].value);
					temp = (isn[0].id).split("i3GEOlegendaid_");
					ids.push(temp[1]);
				    }
				    if (isn[0].name == "expressao") {
					exps.push(isn[0].value);
				    }
				    if (isn[0].name == "minScale") {
					minScales.push(parseInt(isn[0].value, 10));
				    }
				    if (isn[0].name == "maxScale") {
					maxScales.push(parseInt(isn[0].value, 10));
				    }
				}
			    }
			}
		    }
		}
		ids = ids.join(";");
		nomes = nomes.join(";");
		exps = exps.join(";");
		minScales = minScales.join(";");
		maxScales = maxScales.join(";");
		temp = function() {
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostralegenda();
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		var ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?"
		    + "base64=sim"
		    + "&g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=alteraclasse"
		    + "&opcao=alteraclasses"
		    + "&ext="
		    + ext;
		cp = new cpaint();
		cp.set_transfer_mode('POST');
		cp.set_response_type("JSON");
		cp.call(p, "alteraclassesPost", temp, "ids=" + ids
			+ "&nomes="
			+ i3GEO.util.base64encode(nomes)
			//+ nomes
			+ "&exps="
			+ i3GEO.util.base64encode(exps)
			//+ exps
			+ "&minScales="
			+ minScales
			+ "&maxScales="
			+ maxScales);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: alteraGeometria
	 *
	 * Altera o tipo de representa&ccedil;&atilde;o geom&eacute;trica dos elementos de um layer
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	alteraGeometriaTema : function() {
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var retorna = function() {
		i3GEOF.legenda.aposAlterarLegenda();
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.mostralegenda();
	    };
	    var p =
		i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=alteraclasse&opcao=alterageometria&tema="
		+ i3GEOF.legenda.tema
		+ "&tipo="
		+ $i("i3GEOlegentaTipoGeo").value, cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "", retorna);
	},
	/*
	 * Function: adicionaConta
	 *
	 * Adiciona ao nome de cada classe o n&uacute;mero de ocorr&ecirc;ncias em cada uma
	 *
	 * Veja:
	 *
	 * <CONTAGEMCLASSE>
	 */
	adicionaConta : function() {
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var p =
		i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=contagemclasse"
		+ "&tema="
		+ i3GEOF.legenda.tema, cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "contagemclasse", i3GEOF.legenda.montaLegenda);
	    i3GEO.janela.tempoMsg($trad('consideraElementosVisiveis', i3GEOF.legenda.dicionario));
	},
	/*
	 * Function: adicionaClasse
	 *
	 * Adiciona uma nova classe ao tema
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	adicionaClasse : function() {
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    var ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	    var p =
		i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=alteraclasse&opcao=adicionaclasse"
		+ "&tema="
		+ i3GEOF.legenda.tema
		+ "&ext="
		+ ext, cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "alteraclasse", i3GEOF.legenda.mostralegenda);
	},
	/*
	 * Function: adicionaOpacidade
	 *
	 * Adiciona opacidade vari&aacute;vel em cada classe
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	adicionaOpacidade : function() {
	    var retorna = function() {
		i3GEOF.legenda.aposAlterarLegenda();
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.mostralegenda();
	    };
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    var ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	    var p =
		i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=alteraclasse&opcao=adicionaopacidade"
		+ "&tema="
		+ i3GEOF.legenda.tema
		+ "&ext="
		+ ext, cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "alteraclasse", retorna);
	},
	/*
	 * Function: paleta
	 *
	 * Gera as cores para as classes considerando um RGB inicial e um final
	 *
	 * Veja:
	 *
	 * <ALTERACORESCLASSES>
	 */
	paleta : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var retornapaleta = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostralegenda();
		}, ci = $i("i3GEOlegendaacori").value, cf = $i("i3GEOlegendaacorf").value, cp = new cpaint(), p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=alteraCoresClasses&tema="
		    + i3GEOF.legenda.tema
		    + "&cori="
		    + ci
		    + "&corf="
		    + cf;
		cp.set_response_type("JSON");
		cp.call(p, "alteraCoresClasses", retornapaleta);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: inverteCores
	 *
	 * Inverte as cores utilizadas nos s&iacute;mbolos das classes
	 *
	 * Veja:
	 *
	 * <INVERTECORESCLASSES>
	 */
	inverteCores : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var retornapaleta = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostralegenda();
		}, cp = new cpaint(), p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=inverteCoresClasses&tema="
		    + i3GEOF.legenda.tema;
		cp.set_response_type("JSON");
		cp.call(p, "alteraCoresClasses", retornapaleta);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: calculaTamanho
	 *
	 * Muda o s&iacute;mbolo de cada classe aplicando tamanhos diferentes e lineares
	 *
	 * Veja:
	 *
	 * <CALCULATAMANHOCLASSES>
	 */
	calculaTamanho : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var retornapaleta = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostralegenda();
		}, cp = new cpaint(), p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=calculaTamanhoClasses&tema="
		    + i3GEOF.legenda.tema;
		cp.set_response_type("JSON");
		cp.call(p, "calculaTamanhoClasses", retornapaleta);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: ordenaClasses
	 *
	 * Ordena as classes pelo nome
	 *
	 */
	ordenaClasses : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var retornapaleta = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostralegenda();
		}, cp = new cpaint(), p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=ordenaClasses&tema="
		    + i3GEOF.legenda.tema;
		cp.set_response_type("JSON");
		cp.call(p, "foo", retornapaleta);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: excluilinhaf
	 *
	 * Exclui uma linha da tabela de edi&ccedil;&atilde;o de classes da legendda
	 */
	excluilinhaf : function(id) {
	    var p = $i(id);
	    do {
		p.removeChild(p.childNodes[0]);
	    } while (p.childNodes.length > 0);
	    p.parentNode.removeChild(p);
	    i3GEOF.legenda.mudaLegenda();
	},
	/*
	 * Function: sobelinhaf
	 *
	 * Sobe uma linha na tabela de edi&ccedil;&atilde;o de classes da legendda
	 */
	sobelinhaf : function(idclasse) {
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var p =
		i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=ALTERACLASSE&opcao=sobeclasse&tema="
		+ i3GEOF.legenda.tema
		+ "&idclasse="
		+ idclasse, cp = new cpaint(), temp = function() {
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.mostralegenda();
	    };
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", temp);
	},
	/*
	 * Function: descelinhaf
	 *
	 * Desce uma linha na tabela de edi&ccedil;&atilde;o de classes da legendda
	 */
	descelinhaf : function(idclasse) {
	    if (i3GEOF.legenda.aguarde.visibility === "visible") {
		return;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var p =
		i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=ALTERACLASSE&opcao=desceclasse&tema="
		+ i3GEOF.legenda.tema
		+ "&idclasse="
		+ idclasse, cp = new cpaint(), temp = function() {
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.mostralegenda();
	    };
	    ;
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", temp);
	},
	/*
	 * Function: editaSimbolo
	 *
	 * Abre o editor de s&iacute;mbolos
	 *
	 * Veja:
	 *
	 * <EDITASIMBOLO>
	 */
	editaSimbolo : function(id) {
	    try {
		$i("i3GEOlegendaguia1obj").style.display = "none";
		$i("i3GEOlegendaguia3obj").style.display = "block";
		id = id.split("-");
		i3GEOF.legenda.classe = id[1];
		i3GEOF.legenda.formEditorSimbolo();
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	formEditorSimbolo : function() {
	    var p =
		i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=editasimbolo&opcao=pegaparametros&tema="
		+ i3GEOF.legenda.tema
		+ "&classe="
		+ i3GEOF.legenda.classe, cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "pegaParametrosMapa", i3GEOF.legenda.montaEditor);
	},
	/*
	 * Function: simbU
	 *
	 * Altera a leganda do tema para o tipo s&iacute;mbolo &uacute;nico
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	simbU : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		var p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=alteraclasse&tema="
		    + i3GEOF.legenda.tema
		    + "&opcao=simbolounico&ext="
		    + ext, cp = new cpaint(), fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: valorU
	 *
	 * Altera a leganda do tema para o tipo valor &uacute;nico
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	valorU : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var item = $i("i3GEOlegendaitensValorUnico").getElementsByTagName("select")[0].value, itemNome =
		    $i("i3GEOlegendaClassesValorUnico").getElementsByTagName("select")[0].value, p =
			i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
			+ i3GEO.configura.sid
			+ "&funcao=alteraclasse&tema="
			+ i3GEOF.legenda.tema
			+ "&item="
			+ item
			+ "&itemNome="
			+ itemNome
			+ "&opcao=valorunico"
			+ "&ignorar="
			+ $i("i3GEOlegendaignorar").value, cp = new cpaint(), fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		if ($i("i3GEOFlegendaaplicaextent").checked === true) {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		} else {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.extentTotal);
		}

		if (item == "") {
		    i3GEO.janela.tempoMsg($trad('selecionaUmItem', i3GEOF.legenda.dicionario));
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: valorC
	 *
	 * Altera a leganda do tema com um n&uacute;mero espec&iacute;fico de classes
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	valorC : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var item = $i("i3GEOlegendaitensValorClass").getElementsByTagName("select")[0].value, nclasses =
		    $i("i3GEOlegendanclasses").value, ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten), p =
			i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
			+ i3GEO.configura.sid
			+ "&funcao=alteraclasse&nclasses="
			+ nclasses
			+ "&tema="
			+ i3GEOF.legenda.tema
			+ "&item="
			+ item
			+ "&opcao=intervalosiguais&ignorar="
			+ $i("i3GEOlegendaignorar").value
			+ "&ext="
			+ ext, cp = new cpaint(), fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		if (item == "") {
		    i3GEO.janela.tempoMsg("Selecione um item!");
		    return;
		}
		if ($i("i3GEOFlegendaaplicaextent").checked === true) {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		} else {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.extentTotal);
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: metade
	 *
	 * Duas classes concentrando a soma das metades
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	metade : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var item = $i("i3GEOlegendaitensMetade").getElementsByTagName("select")[0].value,
		itemid = $i("i3GEOlegendaitensMetadeId").getElementsByTagName("select")[0].value,
		p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=alteraclasse"
		+ "&tema="
		+ i3GEOF.legenda.tema
		+ "&item="
		+ item
		+ "&itemid="
		+ itemid
		+ "&opcao=metade&ignorar="
		+ $i("i3GEOlegendaignorar").value,
		cp = new cpaint(),
		fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		if (item == "") {
		    i3GEO.janela.tempoMsg("Selecione um item!");
		    return;
		}
		if (itemid == "") {
		    i3GEO.janela.tempoMsg("Selecione um item!");
		    return;
		}
		if ($i("i3GEOFlegendaaplicaextent").checked === true) {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		} else {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.extentTotal);
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: media
	 *
	 * Duas classes considerando a media
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	media : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var item = $i("i3GEOlegendaitensMedia").getElementsByTagName("select")[0].value,
		p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=alteraclasse"
		+ "&tema="
		+ i3GEOF.legenda.tema
		+ "&item="
		+ item
		+ "&opcao=media&ignorar="
		+ $i("i3GEOlegendaignorar").value,
		cp = new cpaint(),
		fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		if (item == "") {
		    i3GEO.janela.tempoMsg("Selecione um item!");
		    return;
		}
		if ($i("i3GEOFlegendaaplicaextent").checked === true) {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		} else {
		    p += "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.extentTotal);
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: valorQ
	 *
	 * Altera a leganda do tema claculando as classes pelo m&eacute;todo quartil
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	valorQ : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var item = $i("i3GEOlegendaitensValorQuartil").getElementsByTagName("select")[0].value, ext =
		    i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten), p =
			i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
			+ i3GEO.configura.sid
			+ "&funcao=alteraclasse&tema="
			+ i3GEOF.legenda.tema
			+ "&item="
			+ item
			+ "&opcao=quartis&ignorar="
			+ $i("i3GEOlegendaignorar").value
			+ "&ext="
			+ ext
			+ "&tipoLegenda="
			+ $i("estiloClassesQuartis").value, cp = new cpaint(), fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		if (item == "") {
		    i3GEO.janela.tempoMsg($trad('selecionaUmItem', i3GEOF.legenda.dicionario));
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: valorQu
	 *
	 * Altera a leganda do tema por meio do calculo de quantis
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	valorQu : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var item = $i("i3GEOlegendaitensValorClass").getElementsByTagName("select")[0].value, nclasses =
		    $i("i3GEOlegendanclasses").value, ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten), p =
			i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
			+ i3GEO.configura.sid
			+ "&funcao=alteraclasse&nclasses="
			+ nclasses
			+ "&tema="
			+ i3GEOF.legenda.tema
			+ "&item="
			+ item
			+ "&opcao=quantil&ignorar="
			+ $i("i3GEOlegendaignorar").value
			+ "&ext="
			+ ext, cp = new cpaint(), fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		if (item == "") {
		    i3GEO.janela.tempoMsg($trad('selecionaUmItem', i3GEOF.legenda.dicionario));
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: valorQN
	 *
	 * Altera a legenda do tema por meio do calculo de quebras naturais
	 *
	 * Veja:
	 *
	 * <ALTERACLASSE>
	 */
	valorQN : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var item = $i("i3GEOlegendaitensValorClass").getElementsByTagName("select")[0].value, nclasses =
		    $i("i3GEOlegendanclasses").value, ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten), p =
			i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
			+ i3GEO.configura.sid
			+ "&funcao=alteraclasse&nclasses="
			+ nclasses
			+ "&tema="
			+ i3GEOF.legenda.tema
			+ "&item="
			+ item
			+ "&opcao=quebrasnaturais&ignorar="
			+ $i("i3GEOlegendaignorar").value
			+ "&ext="
			+ ext, cp = new cpaint(), fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		if (item == "") {
		    i3GEO.janela.tempoMsg($trad('selecionaUmItem', i3GEOF.legenda.dicionario));
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraclasse", fim);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},

	/*
	 * Function: representacao
	 *
	 * Altera o tipo de representa&ccedil;&atilde;o do tema (linear ou poligonoal)
	 *
	 * Veja:
	 *
	 * <ALTERAREPRESENTACAO>
	 *
	 */
	representacao : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		var p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=alterarepresentacao&tema="
		    + i3GEOF.legenda.tema, cp = new cpaint(), fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		};
		i3GEOF.legenda.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p, "alteraRepresentacao", fim);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: montaEditor
	 *
	 * Monta o editor de s&iacute;mbolos quando o usu&aacute;rio clica em um s&iacute;mbolo na legenda
	 */
	montaEditor : function(retorno) {
	    try {
		i3GEO.util.comboItens(
			"i3GEOlegendaSelItemLabel",
			i3GEOF.legenda.tema,
			function(retorno) {
			    if ($i("i3GEOlegendaitensLabel")) {
				$i("i3GEOlegendaitensLabel").innerHTML = retorno.dados ;
			    }
			},
			"i3GEOlegendaitensLabel",
			"",
			"",
			"",
			"form-control"
		);
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		if (retorno.data != undefined) {
		    var b, l, i, sct, combo, n;
		    retorno = retorno.data;
		    i3GEOF.legenda.estilos = retorno.split("|");
		    combo =
			"<select id='i3GEOlegendaestilos' class='form-control' onchange=i3GEOF.legenda.estilo=this.value;i3GEOF.legenda.mostraEstilo(this.value)>";
		    n = i3GEOF.legenda.estilos.length;
		    for (i = 0; i < n; i++) {
			l = i3GEOF.legenda.estilos[i].split("#");
			sct = "<option value=" + l[1] + "  />" + l[1] + "</option>";
			combo += sct;
		    }
		    combo += "</select></div>";
		    $i("i3GEOlegendacomboestilos").innerHTML = combo;
		    $i("i3GEOlegendaestilos").value = i3GEOF.legenda.estilo;


		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostraEstilo(0);
		} else {
		    $i("i3GEOlegendacomboestilos").innerHTML = "<p style=color:red >Erro<br>";
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		}
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	desceEstilo: function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=editasimbolo&opcao=desceestilo&tema="
		    + i3GEOF.legenda.tema
		    + "&classe="
		    + i3GEOF.legenda.classe
		    + "&estilo="
		    + i3GEOF.legenda.estilo, cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p, "editasimbolo", i3GEOF.legenda.reMontaEditor);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	sobeEstilo: function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=editasimbolo&opcao=sobeestilo&tema="
		    + i3GEOF.legenda.tema
		    + "&classe="
		    + i3GEOF.legenda.classe
		    + "&estilo="
		    + i3GEOF.legenda.estilo, cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p, "editasimbolo", i3GEOF.legenda.reMontaEditor);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	adicionaEstilo: function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=editasimbolo&opcao=adicionaestilo&tema="
		    + i3GEOF.legenda.tema
		    + "&classe="
		    + i3GEOF.legenda.classe
		    + "&estilo="
		    + i3GEOF.legenda.estilo, cp = new cpaint();
		cp.set_response_type("JSON");
		i3GEOF.legenda.estilo = i3GEOF.legenda.estilo + 1;
		cp.call(p, "editasimbolo", i3GEOF.legenda.reMontaEditor);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	excluiEstilo: function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		i3GEOF.legenda.estilo = 0;
		var p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=editasimbolo&opcao=excluiestilo&tema="
		    + i3GEOF.legenda.tema
		    + "&classe="
		    + i3GEOF.legenda.classe
		    + "&estilo="
		    + i3GEOF.legenda.estilo, cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p, "editasimbolo", i3GEOF.legenda.reMontaEditor);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: mostraEstilo
	 *
	 * Mostra as propriedades de um estilo de um s&iacute;mbolo
	 */
	mostraEstilo : function() {
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    try {
		var linha, tipoLayer, d, p, cp, mustache = {};
		//i3GEOF.legenda.estilo = e; // esta e uma variavel global
		linha = i3GEOF.legenda.estilos[i3GEOF.legenda.estilo];
		linha = linha.split("#");
		tipoLayer = linha[0];
		mustache = {
			"voutlinecolor": linha[2],
			"vcolor": linha[4],
			"vbackgroundcolor": linha[3],
			"vsize": linha[6],
			"vwidth": linha[8],
			"vpattern": linha[9],
			"vopacity": linha[7],
			"vangle": linha[10],
			"vsymbolscale": linha[11],
			"vminsize": linha[12],
			"vmaxsize": linha[13],
			"voffsetx": linha[14],
			"voffsety": linha[15],
			"vsymbolname": linha[5],
		};

		ins = Mustache.render(
			i3GEOF.legenda.MUSTACHEESTILO,
			$.extend(
				{},
				mustache,
				i3GEOF.legenda.DICIONARIO
			)
		);
		$i("i3GEOlegendaParametrosEstilos").innerHTML = ins;


		//preenche as listas de itens
		i3GEO.util.comboItens(
			"",
			i3GEOF.legenda.tema, function(retorno) {
			    if ($i("i3GEOlegendaComboSize")) {
				$i("i3GEOlegendaComboSize").innerHTML = retorno.dados.replace("id=''"," onchange='$i(\"i3GEOlegendasizes\").value = this.value'");
			    }
			},
			"",
			"",
			"",
			"",
			"form-control"
		);

		i3GEO.util.aplicaAquarela("i3GEOlegendaParametrosEstilos");

		p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=editasimbolo&tipo="
		    + tipoLayer
		    + "&opcao=listaSimbolos&onclick=i3GEOF.legenda.aplicaSimbolo(this)";
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p, "editasimbolo", i3GEOF.legenda.listaSimbolos);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + i3GEOF.legenda.estilo);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: listaSimbolos
	 *
	 * Monta a lista de s&iacute;mbolos com imagem
	 */
	listaSimbolos : function(retorno) {
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    try {
		if (retorno.data != undefined) {
		    retorno = retorno.data;
		    $i("i3GEOlegendasimbolos").innerHTML =
			"<br>" + $trad('listaSimbolo', i3GEOF.legenda.dicionario) + ":<br><br>" + retorno;
		} else {
		    $i("i3GEOlegendasimbolos").innerHTML = "<p style=color:red >Erro<br>";
		}
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: aplicaSimbolo
	 *
	 * Muda o valor do campo com o c&oacute;digo do s&iacute;mbolo escolhido
	 */
	aplicaSimbolo : function(s) {
	    $i("i3GEOlegendasymbolname").value = s.title;
	},
	/*
	 * Function: aplicaEstilo
	 *
	 * Aplica ao estilo as propriedades definidas
	 *
	 * Veja:
	 *
	 * <EDITASIMBOLO>
	 */
	aplicaEstilo : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var i, p, cp, fim, outlinecolor = $i("i3GEOlegendaoutlinecolor").value, backgroundcolor =
		    $i("i3GEOlegendabackgroundcolor").value, color = $i("i3GEOlegendacolor").value, symbolname =
			$i("i3GEOlegendasymbolname").value, simbolos = $i("i3GEOlegendasimbolos").getElementsByTagName("img"), valido = "nao", n =
			    simbolos.length, size = $i("i3GEOlegendasizes").value, width = $i("i3GEOlegendawidth").value, pattern =
				$i("i3GEOlegendapattern").value, opacidade = $i("i3GEOlegendaopacidade").value, angle = $i("i3GEOlegendaangulo").value, symbolscale =
				    $i("i3GEOlegendasymbolscale").value, minsize = $i("i3GEOlegendaminsize").value, maxsize =
					$i("i3GEOlegendamaxsize").value, offsetx = $i("i3GEOlegendaoffsetx").value, offsety = $i("i3GEOlegendaoffsety").value;
		if (symbolscale != "") {
		    symbolscale = parseInt(symbolscale, 10);
		} else {
		    symbolscale = -1;
		}
		for (i = 0; i < n; i++) {
		    if (simbolos[i].title == symbolname || symbolname == i) {
			valido = "sim";
		    }
		}
		if (valido === "nao") {
		    // i3GEO.janela.tempoMsg("Nome do simbolo nao encontrado");
		    // i3GEOF.legenda.aguarde.visibility = "hidden";
		    // return;
		}
		p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=editasimbolo&opcao=aplica&tema="
		    + i3GEOF.legenda.tema
		    + "&classe="
		    + i3GEOF.legenda.classe
		    + "&estilo="
		    + i3GEOF.legenda.estilo
		    + "&outlinecolor="
		    + outlinecolor
		    + "&backgroundcolor="
		    + backgroundcolor
		    + "&color="
		    + color
		    + "&symbolname="
		    + symbolname
		    + "&width="
		    + width
		    + "&pattern="
		    + pattern
		    + "&size="
		    + size
		    + "&opacidade="
		    + opacidade
		    + "&angle="
		    + angle
		    + "&symbolscale="
		    + symbolscale
		    + "&minsize="
		    + minsize
		    + "&maxsize="
		    + maxsize
		    + "&offsetx="
		    + offsetx
		    + "&offsety="
		    + offsety;
		cp = new cpaint();
		fim = function() {
		    i3GEOF.legenda.aposAlterarLegenda();
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.reMontaEditor();
		};
		// cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p, "editasimbolo", fim);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: reMontaEditor
	 *
	 * Gera novamente o editor de s&iacute;mbolo ap&oacute;s ter sido feita alguma altera&ccedil;&atilde;o nos estilos
	 */
	reMontaEditor : function() {
	    var id = i3GEOF.legenda.tema + "-" + i3GEOF.legenda.classe;
	    i3GEOF.legenda.editaSimbolo(id);
	},
	/*
	 * Function: mostraGrafico
	 *
	 * Mostra um gr&aacute;fico com a contegem de elementos em caada classe
	 *
	 * Veja:
	 *
	 * <CONTAGEMCLASSE>
	 */
	mostraGrafico : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var monta =
		    function(retorno) {
		    if (retorno.data && retorno.data[0].proc == "") {
			var b, ins = [], i, re, t;
			ins.push("<h5>" + $trad('numeroOcorrenciasClasses', i3GEOF.legenda.dicionario) + "</h5>");
			ins.push("<table width=100% >");
			i3GEOF.legenda.dadosGrafico = [
			    "n;x"
			    ];
			if (retorno.data.length < 2) {
			    i3GEO.janela.tempoMsg($trad('msgNumeroClasses', i3GEOF.legenda.dicionario));
			    i3GEOF.legenda.aguarde.visibility = "hidden";
			    return;
			} else {
			    i3GEO.guias.mostraGuiaFerramenta("i3GEOlegendaguia4", "i3GEOlegendaguia");
			}
			for (i = 0; i < retorno.data.length; i++) {
			    id = retorno.data[i].tema + "-" + retorno.data[i].idclasse; // layer+indice da classe
			    re = new RegExp("'", "g");
			    exp = (retorno.data[i].expressao).replace(re, '"');
			    ins.push("<tr><td style='text-align:left;border-bottom:0 none white' ><label>" + retorno.data[i].nomeclasse
				    + "</label></td></tr>");
			    t = (retorno.data[i].nreg * 100) / retorno.data[i].totalreg;
			    ins.push("<tr><td style=text-align:left ><img height=15px width=" + t
				    + "% src='"
				    + retorno.data[i].imagem
				    + "' /></td></tr>");
			    i3GEOF.legenda.dadosGrafico.push(retorno.data[i].nomeclasse + ";" + retorno.data[i].nreg);
			}
			ins.push("</table><br>");
			$i("i3GEOlegendaguia4obj").innerHTML = ins.join("");
		    } else {
			$i("i3GEOlegendaguia4obj").innerHTML = "<p style=color:red >Erro<br>";
			return;
		    }
		    i3GEOF.legenda.aguarde.visibility = "hidden";

		}, p =
		    i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=contagemclasse&tema="
		    + i3GEOF.legenda.tema, cp = new cpaint();
		// cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p, "cocontagemclasse", monta);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	iniciaGraficoPizza : function() {
	    var dados = {
		    "attributes" : {
			"id" : ""
		    },
		    "data" : {
			"dados" : i3GEOF.legenda.dadosGrafico
		    }
	    };
	    i3GEOF.graficointerativo1.tipo = "pizza_1";
	    i3GEOF.graficointerativo1.iniciaJanelaFlutuante(dados);
	},
	/*
	 * Function: aplicaProcessos
	 *
	 * Aplica processos de ajuste em imagens de sat&eacute;lite
	 *
	 * Veja:
	 *
	 * <APLICAPROCESSOS>
	 */
	aplicaProcessos : function() {
	    try {
		if (i3GEOF.legenda.aguarde.visibility === "visible") {
		    return;
		}
		i3GEOF.legenda.aguarde.visibility = "visible";
		var lista = [], ipt, i, p, cp, temp;
		if ($i("i3GEOlegendaprocessos").innerHTML != "") {
		    ipt = $i("i3GEOlegendaprocessos").getElementsByTagName("input");
		    for (i = 0; i < ipt.length; i++) {
			if (ipt[i].value != "") {
			    lista.push(ipt[i].value);
			}
		    }
		}
		lista = lista.join("|");
		temp = function() {
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		    i3GEOF.legenda.mostralegenda();
		    i3GEOF.legenda.aposAlterarLegenda();
		};
		p =
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=aplicaProcessos&lista="
		    + lista
		    + "&tema="
		    + i3GEOF.legenda.tema;
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p, "aplicaProcessos", temp);
	    } catch (e) {
		i3GEO.janela.tempoMsg("Erro: " + e);
		i3GEOF.legenda.aguarde.visibility = "hidden";
	    }
	},
	/*
	 * Function: adicionaProcesso
	 *
	 * Adiciona um novo processo na lista de processos
	 */
	adicionaProcesso : function(s) {
	    $i("i3GEOlegendaprocessos").innerHTML += "<div class='form-group label-fixed condensed'><input value='" + s.value + "' class='form-control input-lg' type='text' /></div>";
	},
	aplicaTodasClasses : function(parametro, id) {
	    var valor = $i(id).value;
	    i3GEO.janela.confirma("Aplica " + parametro + " = " + valor + " ?", 300, $trad("x14"), "", function() {
		var temp = function() {
		    // i3GEOF.legenda.mostralegenda();
		    i3GEOF.legenda.aposAlterarLegenda();
		}, p, cp;
		p =
		    i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=aplicaTodasClasses"
		    + "&parametro="
		    + parametro
		    + "&valor="
		    + valor
		    + "&tema="
		    + i3GEOF.legenda.tema;
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p, "foo", temp);
	    });
	},
	aplicarCluster : function(){
	    var temp = function() {
		i3GEOF.legenda.aposAlterarLegenda();
		i3GEOF.legenda.montaCombosItens();
	    }, p, cp;
	    p =
		i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=aplicarCluster"
		+ "&maxdistance="
		+ $i("i3GEOlegendaClusterMaxdistance").value
		+ "&buffer="
		+ $i("i3GEOlegendaClusterBuffer").value
		+ "&filter="
		//+ i3GEO.util.base64encode($i("i3GEOlegendaClusterFilter").value)
		+ $i("i3GEOlegendaClusterFilter").value
		+ "&region="
		+ $i("i3GEOlegendaClusterRegion").value
		+ "&group="
		+ $i("i3GEOlegendaitensCluster").getElementsByTagName("select")[0].value
		+ "&tema="
		+ i3GEOF.legenda.tema;
	    cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", temp);
	},
	removerCluster : function(){
	    var temp = function() {
		i3GEOF.legenda.montaCombosItens();
		i3GEOF.legenda.aposAlterarLegenda();
	    }, p, cp;
	    p =
		i3GEO.configura.locaplic + "/ferramentas/legenda/exec.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=removerCluster"
		+ "&tema="
		+ i3GEOF.legenda.tema;
	    cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", temp);
	},
	montaCombosItens : function(){
	    i3GEO.util.comboItens(
		    "",
		    i3GEOF.legenda.tema,
		    function(retorno) {
			if ($i("i3GEOlegendaitensValorUnico")) {
			    $i("i3GEOlegendaitensValorUnico").innerHTML = retorno.dados ;
			}
			if ($i("i3GEOlegendaClassesValorUnico")) {
			    $i("i3GEOlegendaClassesValorUnico").innerHTML = retorno.dados;
			}
			if ($i("i3GEOlegendaitensMetade")) {
			    $i("i3GEOlegendaitensMetade").innerHTML = retorno.dados;
			}
			if ($i("i3GEOlegendaitensMetadeId")) {
			    $i("i3GEOlegendaitensMetadeId").innerHTML = retorno.dados;
			}
			if ($i("i3GEOlegendaitensMedia")) {
			    $i("i3GEOlegendaitensMedia").innerHTML = retorno.dados;
			}
			if ($i("i3GEOlegendaitensValorClass")) {
			    $i("i3GEOlegendaitensValorClass").innerHTML = retorno.dados;
			}
			if ($i("i3GEOlegendaitensCluster")) {
			    $i("i3GEOlegendaitensCluster").innerHTML = retorno.dados;
			}
			if ($i("i3GEOlegendaitensValorQuartil")) {
			    $i("i3GEOlegendaitensValorQuartil").innerHTML = retorno.dados;
			}
		    },
		    "",
		    "",
		    "",
		    "",
		    "form-control"
	    );
	},
	parametrosAuto : function() {
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var p = i3GEO.configura.locaplic+"/ferramentas/legenda/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=parametrosauto&tema=" + i3GEOF.legenda.tema,
	    cp = new cpaint(),
	    temp = function(retorno){
		try{
		    if(retorno.data !== ""){
			$i("i3GEOlegendaAutocolunas").innerHTML = retorno.data.colunas;
			$i("i3GEOlegendaAutoclassesitem").value = retorno.data.classesitem;
			$i("i3GEOlegendaAutoclassesnome").value = retorno.data.classesnome;
			$i("i3GEOlegendaAutoclassescor").value = retorno.data.classescor;
			$i("i3GEOlegendaAutoclassessimbolo").value = retorno.data.classessimbolo;
			$i("i3GEOlegendaAutoclassestamanho").value = retorno.data.classestamanho;
			$i("i3GEOlegendaAutopalletefile").value = retorno.data.palletefile;
			$i("i3GEOlegendaAutopalletestep").value = retorno.data.palletestep;
		    }
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		}catch(e){
		    i3GEO.janela.tempoMsg("Erro. "+e);
		    i3GEOF.legenda.aguarde.visibility = "hidden";
		}
	    };
	    cp.set_response_type("JSON");
	    cp.call(p,"foo",temp);
	},
	salvaParametrosAuto: function(){
	    if(i3GEOF.legenda.aguarde.visibility === "visible"){
		return;
	    }
	    i3GEOF.legenda.aguarde.visibility = "visible";
	    var temp,
	    p,
	    cp;
	    temp = function(){
		i3GEOF.legenda.aguarde.visibility = "hidden";
		i3GEOF.legenda.aposAlterarLegenda();
	    };
	    p = i3GEO.configura.locaplic+"/ferramentas/legenda/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=salvaparametrosauto&tema=" + i3GEOF.legenda.tema
	    + "&classesitem=" + $i("i3GEOlegendaAutoclassesitem").value
	    + "&classesnome=" + $i("i3GEOlegendaAutoclassesnome").value
	    + "&classescor=" + $i("i3GEOlegendaAutoclassescor").value
	    + "&classessimbolo=" + $i("i3GEOlegendaAutoclassessimbolo").value
	    + "&classestamanho=" + $i("i3GEOlegendaAutoclassestamanho").value
	    + "&palletefile=" + $i("i3GEOlegendaAutopalletefile").value
	    + "&palletestep=" + $i("i3GEOlegendaAutopalletestep").value;

	    cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p,"foo",temp);
	}
};
//aplica ao codigo i3GEOF definicoes feitas na interface do mapa
//isso permite a substituicao de funcoes e parametros
if(i3GEO.configura.ferramentas.hasOwnProperty("legenda")){
    jQuery.each( i3GEO.configura.ferramentas.legenda, function(index, value) {
	i3GEOF.legenda[index] = i3GEO.configura.ferramentas.legenda[index];
    });
}