/*
Title: Preferencias

Gerencia as preferencias do usuario

Veja:

<i3GEO.mapa.dialogo.preferencias>

Arquivo:

i3geo/ferramentas/preferencias/index.js

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
Classe: i3GEOF.preferencias

*/
i3GEOF.preferencias = {
	lista: function(){
		var lista = [
			{
				titulo: $trad(80,i3GEOF.preferencias.dicionario),//ferramentas ativas
				props: [
					{
						titulo: $trad(86,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.configura.iniciaFerramentas.quais.locregiao.ativa"
					},{
						titulo: $trad(87,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.configura.iniciaFerramentas.quais.metaestat.ativa"
					},{
						titulo: $trad(81,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.configura.iniciaFerramentas.quais.legenda.ativa"
					},{
						titulo: "<span style=left:10px;position:relative; >"+$trad(82,i3GEOF.preferencias.dicionario)+"</span>",
						tipo: "numero",
						elemento: "i3GEO.configura.iniciaFerramentas.quais.legenda.largura"
					},{
						titulo: "<span style=left:10px;position:relative; >"+$trad(83,i3GEOF.preferencias.dicionario)+"</span>",
						tipo: "numero",
						elemento: "i3GEO.configura.iniciaFerramentas.quais.legenda.altura"
					},{
						titulo: "<span style=left:10px;position:relative; >"+$trad(84,i3GEOF.preferencias.dicionario)+"</span>",
						tipo: "numero",
						elemento: "i3GEO.configura.iniciaFerramentas.quais.legenda.topo"
					},{
						titulo: "<span style=left:10px;position:relative; >"+$trad(85,i3GEOF.preferencias.dicionario)+"</span>",
						tipo: "numero",
						elemento: "i3GEO.configura.iniciaFerramentas.quais.legenda.esquerda"
					}
				]
			},{
				titulo: $trad(9,i3GEOF.preferencias.dicionario),//barra de botoes
				props: [
					{
						titulo: $trad(4,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.barraDeBotoes.MAXBOTOES"
					},{
						titulo: $trad(5,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.barraDeBotoes.ATIVA"
					},{
						titulo: $trad(6,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.barraDeBotoes.OFFSET"
					},{
						titulo: $trad(7,i3GEOF.preferencias.dicionario),
						tipo: "select",
						elemento: "i3GEO.barraDeBotoes.POSICAO",
						opcoes: ["bottom","top"]
					},{
						titulo: $trad(8,i3GEOF.preferencias.dicionario),
						tipo: "multiselect",
						elemento: "i3GEO.barraDeBotoes.INCLUIBOTAO",
						opcoes: i3GEO.barraDeBotoes.INCLUIBOTAO
					}
				]
			},{
				titulo: $trad(10,i3GEOF.preferencias.dicionario),
				props: [
					{
						titulo: $trad(11,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeCamadas.BARRAPROGRESSO"
					},{
						titulo: $trad(12,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeCamadas.VERIFICAABRANGENCIATEMAS"
					},{
						titulo: $trad(13,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeCamadas.EXPANDESOLEGENDA"
					},{
						titulo: $trad(14,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeCamadas.PERMITEEXPANDIRTEMAS"
					},{
						titulo: $trad(15,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeCamadas.EXPANDIDA"
					},{
						titulo: $trad(16,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeCamadas.LEGENDAEXPANDIDA"
					},{
						titulo: $trad(17,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeCamadas.OPCOESICONES"
					},{
						titulo: $trad(18,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeCamadas.OPCOESTEMAS"
					},{
						titulo: $trad(19,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeCamadas.OPCOESLEGENDA"
					},{
						titulo: $trad(20,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeCamadas.AGUARDALEGENDA"
					},{
						titulo: $trad(21,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeCamadas.ICONETEMA"
					},{
						titulo: $trad(22,i3GEOF.preferencias.dicionario),
						tipo: "multiselect",
						elemento: "i3GEO.arvoreDeCamadas.FUNCOES",
						opcoes: i3GEO.arvoreDeCamadas.FUNCOES
					}
				]
			},{
				titulo: $trad(23,i3GEOF.preferencias.dicionario),
				props: [
					{
						titulo: $trad(24,i3GEOF.preferencias.dicionario),
						tipo: "multiselect",
						elemento: "i3GEO.arvoreDeTemas.OPCOESADICIONAIS",
						opcoes: i3GEO.arvoreDeTemas.OPCOESADICIONAIS
					},{
						titulo: $trad(25,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeTemas.INCLUISISTEMAS"
					},{
						titulo: $trad(26,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeTemas.INCLUIWMS"
					},{
						titulo: $trad(27,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeTemas.INCLUIINDIBR"
					},{
						titulo: $trad(28,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeTemas.INCLUIWMSMETAESTAT"
					},{
						titulo: $trad(29,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeTemas.INCLUIESTRELAS"
					},{
						titulo: $trad(41,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.arvoreDeTemas.INCLUIREGIOES"
					}
				]
			},{
				titulo: $trad(30,i3GEOF.preferencias.dicionario),//mapa
				props: [
					{//elemento input do tipo hidden com id igual ao valor de elemento
						titulo: "",
						tipo: "oculto",
						elemento: "i3GEO.mapa.TEMASINICIAISLIGADOS"
					},{
						titulo: "",
						tipo: "oculto",
						elemento: "i3GEO.mapa.TEMASINICIAIS"
					},{//combo que recebera funcao em onchange
						titulo: $trad(88,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "",
						funcao: "i3GEOF.preferencias.listaTemasOriginais(this)" //essa funcao atualiza o input oculto i3GEO.mapa.TEMASINICIAISLIGADOS
					},{
						titulo: $trad(63,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.idioma.MOSTRASELETOR"
					},{
						titulo: $trad(31,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.configura.guardaExtensao"
					},{
						titulo: $trad(32,i3GEOF.preferencias.dicionario),
						tipo: "select",
						elemento: "i3GEO.configura.tipotip",
						opcoes: ["completo","simples","balao"]
					},{
						titulo: $trad(33,i3GEOF.preferencias.dicionario),
						tipo: "texto",
						elemento: "i3GEO.configura.alturatip"
					},{
						titulo: $trad(34,i3GEOF.preferencias.dicionario),
						tipo: "texto",
						elemento: "i3GEO.configura.larguratip"
					},{
						titulo: $trad(35,i3GEOF.preferencias.dicionario),
						tipo: "select",
						elemento: "i3GEO.configura.mapaRefDisplay",
						opcoes: ["block","none"]
					},{
						titulo: $trad(36,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.configura.diminuixN"
					},{
						titulo: $trad(37,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.configura.diminuiyN"
					},{
						titulo: $trad(38,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.configura.diminuixM"
					},{
						titulo: $trad(39,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.configura.diminuiyM"
					},{
						titulo: $trad(40,i3GEOF.preferencias.dicionario),
						tipo: "select",
						elemento: "i3GEO.coordenadas.padrao",
						opcoes: ["geoProj","dd","policonicaSad69","utmSad69Proj","utmSirgas2000Proj"]
					}

				]
			},{
				titulo: $trad(43,i3GEOF.preferencias.dicionario), //busca rapida
				props: [
					{
						titulo: $trad(44,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.servicosexternos"
					},{
						titulo: $trad(45,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.temasmapa"
					},{
						titulo: $trad(46,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.google"
					}
				]
			},{
				titulo: $trad(47,i3GEOF.preferencias.dicionario), //menu superior
				props: [
					{
						titulo: $trad(48,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.permiteLogin"
					},{
						titulo: $trad(49,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.marcadores"
					},{
						titulo: $trad(50,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.deslocaEsquerda"
					}
				]
			},{
				titulo: $trad(51,i3GEOF.preferencias.dicionario), //guias
				props: [
					{
						titulo: $trad(52,i3GEOF.preferencias.dicionario),
						tipo: "select",
						elemento: "i3GEO.guias.ATUAL",
						opcoes: ["temas","adiciona","legenda","mapas"]
					},{
						titulo: $trad(53,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.guias.guiaMovel.ABERTA"
					},{
						titulo: $trad(54,i3GEOF.preferencias.dicionario),
						tipo: "texto",
						elemento: "i3GEO.guias.CONFIGURA.temas.icone"
					},{
						titulo: $trad(55,i3GEOF.preferencias.dicionario),
						tipo: "texto",
						elemento: "i3GEO.guias.CONFIGURA.adiciona.icone"
					},{
						titulo: $trad(56,i3GEOF.preferencias.dicionario),
						tipo: "texto",
						elemento: "i3GEO.guias.CONFIGURA.legenda.icone"
					},{
						titulo: $trad(57,i3GEOF.preferencias.dicionario),
						tipo: "texto",
						elemento: "i3GEO.guias.CONFIGURA.mapas.icone"
					},{
						titulo: $trad(58,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.guias.guiaMovel.config.larguraPuxador"
					},{
						titulo: $trad(59,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.guias.guiaMovel.config.alturaPuxador"
					},{
						titulo: $trad(61,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.guias.guiaMovel.config.larguraGuiaMovel"
					},{
						titulo: $trad(62,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.guias.guiaMovel.config.topGuiaMovel"
					}
				]
			},{
				titulo: $trad(64,i3GEOF.preferencias.dicionario), //menu superior
				props: [
					{
						titulo: $trad(65,i3GEOF.preferencias.dicionario),
						tipo: "texto",
						elemento: "i3GEO.janela.ESTILOBD"
					},{
						titulo: $trad(66,i3GEOF.preferencias.dicionario),
						tipo: "select",
						elemento: "i3GEO.janela.ESTILOAGUARDE",
						opcoes: ["normal","reduzida","minima"]
					},{
						titulo: $trad(67,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.janela.AGUARDEMODAL"
					},{
						titulo: $trad(68,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.janela.TRANSICAOSUAVE"
					},{
						titulo: $trad(69,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.janela.OPACIDADE"
					},{
						titulo: $trad(70,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.janela.OPACIDADEAGUARDE"
					}
				]
			},{
				titulo: $trad(71,i3GEOF.preferencias.dicionario),
				props: [
					{
						titulo: $trad(72,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.maparef.fatorZoomDinamico"
					},{
						titulo: $trad(73,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.maparef.SELETORTIPO"
					},{
						titulo: $trad(74,i3GEOF.preferencias.dicionario),
						tipo: "select",
						elemento: "i3GEO.maparef.VALORSELETORTIPO",
						opcoes: ["dinamico","fixo","mapa"]
					},{
						titulo: $trad(75,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.maparef.PERMITEFECHAR"
					},{
						titulo: $trad(76,i3GEOF.preferencias.dicionario),
						tipo: "boolean",
						elemento: "i3GEO.maparef.PERMITEDESLOCAR"
					},{
						titulo: $trad(77,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.maparef.OPACIDADE"
					},{
						titulo: $trad(78,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.maparef.TOP"
					},{
						titulo: $trad(79,i3GEOF.preferencias.dicionario),
						tipo: "numero",
						elemento: "i3GEO.maparef.RIGHT"
					}
				]
			}
		];
		return lista;
	},
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.preferencias.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.preferencias.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/preferencias/dicionario.js",
				"i3GEOF.preferencias.iniciaJanelaFlutuante()",
				"i3GEOF.preferencias.dicionario_script"
			);
		}
		else{
			i3GEOF.preferencias.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.preferencias.html();
			new YAHOO.widget.Button(
				"i3GEOpreferenciasbotao1",
				{onclick:{fn: i3GEOF.preferencias.limpa}}
			);
			new YAHOO.widget.Button(
				"i3GEOpreferenciasbotao2",
				{onclick:{fn: i3GEOF.preferencias.salva}}
			);
			new YAHOO.widget.Button(
				"i3GEOpreferenciasbotao3",
				{onclick:{fn: i3GEOF.preferencias.codigo}}
			);
			i3GEOF.preferencias.carrega();
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
		var temp,
			lista = i3GEOF.preferencias.lista(),
			n = lista.length,
			i = 0,
			ins = "<div id=i3GEOPreferenciasRaiz >",
			nj = 0,
			j = 0,
			props,
			estilo = "margin-left:10px;cursor:default;",
			nk = 0,
			k =0,
			l=0,
			numl=0,
			ids = [],
			valores,
			nomes;
		for(i=0;i<n;i++){
			ins += "<p onclick='javascript:i3GEOF.preferencias.expande("+i+")' class=paragrafo style=cursor:pointer;color:navy ><b>"+lista[i].titulo+"</b><p>";
			ins += "<div style=display:none id='listaPref"+i+"'>";
			props = lista[i].props;
			nj = props.length;
			valores = [];
			nomes = [];
			ids = [];
			for(j=0;j<nj;j++){
				//cria um input do tipo hidden que pode ser executado por uma funcao
				if(props[j].tipo === "oculto"){
					ins += "<input type=hidden value='' id='"+props[j].elemento+"' />";
				}
				else{
					ins += "<p class=paragrafo title='"+props[j].elemento+"'>"+props[j].titulo+"</p>";

					if(props[j].tipo === "numero" || props[j].tipo === "texto"){
						ins += "<div class='styled-select' style='"+estilo+"' ><input type=text value='' id='"+props[j].elemento+"'  /></div><br>";
					}
					if(props[j].tipo === "boolean" || props[j].tipo === "select"){
						if(props[j].tipo === "boolean"){
							valores = [true,false];
							nomes = ["true","false"];
						}
						else{
							valores = props[j].opcoes;
							nomes = props[j].opcoes;
						}
						nk = valores.length;
						temp = "";
						if(props[j].funcao){
							temp = "onchange="+props[j].funcao;
						}
						ins += "<div class='styled-select' style='"+estilo+"'><select id='"+props[j].elemento+"'  "+temp+">";
						ins += "<option value='' >---</option>";
						for(k=0;k<nk;k++){
							ins += "<option value="+valores[k]+" >"+nomes[k]+"</option>";
						}
						ins += "</select></div><br>";
					}
					if(props[j].tipo === "multiselect"){
						valores = i3GEO.util.listaTodasChaves(props[j].opcoes);
						var nvalores = [],
							idschecked = [];
						numl = valores.length;
						for(l=0;l<numl;l++){
							temp = props[j].opcoes[valores[l]];
							if(temp === true || temp === false){
								ids.push(props[j].elemento+"."+valores[l]);
								nvalores.push(valores[l]);
								if(temp === true){
									idschecked.push(valores[l]);
								}
							}
						}
						ins += i3GEO.util.checkCombo(
							props[j].elemento,
							nvalores,
							nvalores,
							estilo+";overflow:auto;height:50px;border:1px solid gray;background-color:white",
							"",
							ids,
							idschecked
						);
						ins += "<br><br>";
					}
				}
			}
			ins += "</div></div>";
		}
		ins += "<textarea id=i3GEOpreferenciasCodigo style='height: 148px;width: 370px;'></textarea>";
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.preferencias");
		};
		//cria a janela flutuante
		titulo = $trad("x86")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=115' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"400px",
			"300px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.preferencias",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true,
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/application-javascript.png"
		);
		divid = janela[2].id;
		var rodape = '' +
			'<input id=i3GEOpreferenciasbotao1 size=20  type=button value="'+$trad(1,i3GEOF.preferencias.dicionario)+'" />&nbsp;&nbsp;&nbsp;' +
			'<input id=i3GEOpreferenciasbotao2 size=20 type=button value="'+$trad(2,i3GEOF.preferencias.dicionario)+'" />&nbsp;&nbsp;&nbsp;' +
			'<input id=i3GEOpreferenciasbotao3 size=20 type=button value="'+$trad(42,i3GEOF.preferencias.dicionario)+'" />' ;

		janela[0].setFooter("<div style=background-color:#F2F2F2; >"+rodape+"</div>");

		$i("i3GEOF.preferencias_corpo").style.backgroundColor = "white";
		$i("i3GEOF.preferencias_corpo").style.textAlign = "left";
		i3GEOF.preferencias.aguarde = $i("i3GEOF.preferencias_imagemCabecalho").style;
		i3GEOF.preferencias.inicia(divid);
	},
	expande: function(id){
		var s = $i("listaPref"+id).style;
		if(s.display === "block"){
			s.display = "none";
		}
		else{
			s.display = "block";
		}
	},
	limpa: function(){
		i3GEO.util.limpaDadosLocal("preferenciasDoI3Geo");
		$i("i3GEOF.preferencias_corpo").innerHTML = i3GEOF.preferencias.html();
		i3GEO.janela.tempoMsg($trad(3,i3GEOF.preferencias.dicionario));
	},
	salva: function(){
		var i = 0,
			j = 0,
			tipos = ["select","input"],
			ntipos = tipos.length,
			elem = [],
			nelem,
			pares = [],
			raiz = $i("i3GEOF.preferencias_corpo"),
			pint;
		for(i=0;i<ntipos;i++){
			elem = raiz.getElementsByTagName(tipos[i]);
			nelem = elem.length;
			for(j=0;j<nelem;j++){
				if(elem[j].value != "" && elem[j].id != ""){
					if (elem[j].type === "checkbox"){
						pares.push(elem[j].id+"|"+elem[j].checked);
					}
					else{
						pint = parseInt(elem[j].value,10);
						if(YAHOO.lang.isNumber(pint) && pint+"px" != elem[j].value){
							pares.push(elem[j].id+"|"+pint);
						}
						else{
							pares.push(elem[j].id+"|"+elem[j].value);
						}
					}
				}
			}
		}
		//parametros especiais que nao sao variaveis de controle
		//
		//camada de fundo na interface openlayers
		if($i("listaLayersBase")){
			elem = $i("listaLayersBase").getElementsByTagName("input");
			nelem = elem.length;
			for(i=0;i<nelem;i++){
				if (elem[i].type == "radio" && elem[i].checked === true){
					pares.push("i3GEO.Interface.openlayers.LAYERFUNDO"+"|"+elem[i].value);
				}
			}
		}
		i3GEO.janela.tempoMsg($trad(3,i3GEOF.preferencias.dicionario));
		//i3GEO.util.insereCookie("preferenciasDoI3Geo",pares.join(":"),365);
		i3GEO.util.limpaDadosLocal("preferenciasDoI3Geo");
		i3GEO.util.gravaDadosLocal("preferenciasDoI3Geo",pares.join("::"));
	},
	carregaCookies: function(){
		var cookies = i3GEO.util.pegaDadosLocal("preferenciasDoI3Geo"),
			i,props,nprops,temp,elem;
		if(cookies){
			props = cookies.split("::");
			nprops = props.length;
			for(i=0;i<nprops;i++){
				temp = props[i].split("|");
				elem = $i(temp[0]);
				if(elem){
					if (elem.type === "checkbox"){
						if(temp[1] === "true" || temp[1] === true){
							elem.checked = true;
						}
						else{
							elem.checked = false;
						}
					}
					else{
						elem.value = temp[1];
					}
				}
			}
		}
	},
	carrega: function(){
		var i = 0,
			j = 0,
			tipos = ["select","input"],
			ntipos = tipos.length,
			elem = [],
			nelem,
			pares = [],
			raiz = $i("i3GEOF.preferencias_corpo");
		for(i=0;i<ntipos;i++){
			elem = raiz.getElementsByTagName(tipos[i]);
			nelem = elem.length;
			for(j=0;j<nelem;j++){
				if(elem[j].id){
					if (elem[j].type === "checkbox"){
						eval("elem[j].checked = "+elem[j].id+";");
					}
					else{
						eval("elem[j].value = "+elem[j].id+";");
					}
				}
			}
		}
		$i("i3GEOpreferenciasCodigo").value = pares.join(";\n");
	},
	codigo: function(){
		var i = 0,
			j = 0,
			tipos = ["select","input"],
			ntipos = tipos.length,
			elem = [],
			nelem,
			pares = [],
			pint,
			raiz = $i("i3GEOF.preferencias_corpo");
		for(i=0;i<ntipos;i++){
			elem = raiz.getElementsByTagName(tipos[i]);
			nelem = elem.length;
			for(j=0;j<nelem;j++){
				if(elem[j].value != ""){
					if (elem[j].type === "checkbox"){
						pares.push(elem[j].id+" = "+elem[j].checked);
					}
					else{
						pint = parseInt(elem[j].value,10);
						if(pint+"px" == elem[j].value || (!YAHOO.lang.isNumber(pint) && YAHOO.lang.isString(elem[j].value) && elem[j].value != 'true' && elem[j].value != 'false')){
							pares.push(elem[j].id+" = '"+elem[j].value+"'");
						}
						else{
							if(YAHOO.lang.isNumber(pint)){
								pares.push(elem[j].id+" = "+pint);
							}
							else{
								pares.push(elem[j].id+" = "+elem[j].value);
							}
						}
					}
				}
			}
		}
		$i("i3GEOpreferenciasCodigo").value = pares.join(";\n");
	},
	//lista os temas existentes no mapa e que podem ser utilizados na inicializacao
	//define o valor das variaveis i3GEO.mapa.TEMASINICIAIS e TEMASINICIAISLIGADOS
	listaTemasOriginais: function(obj){
		var layers = $i("i3GEO.mapa.TEMASINICIAIS"),
			l = 0,
			t,
			temp,
			temas = [],
			ligados = [],
			lista = i3GEO.arvoreDeCamadas.filtraCamadas("nomeoriginal","","diferente",i3GEO.arvoreDeCamadas.CAMADAS);
		if(obj.value == "false"){
			layers.value = "";
			$i("i3GEO.mapa.TEMASINICIAISLIGADOS").value = "";
		}
		else{
			for(l in lista){
				temp = lista[l].name;
				if(temp != undefined && temp != ""){
					temas.push(temp);
					//verifica se esta ligado
					t = i3GEO.arvoreDeCamadas.capturaCheckBox(temp);
					if(t && t.checked == true){
						ligados.push(temp);
					}
				}
			}
			if(layers){
				layers.value = temas.join(",");
				$i("i3GEO.mapa.TEMASINICIAISLIGADOS").value = ligados.join(",");
			}
		}
	}
};
