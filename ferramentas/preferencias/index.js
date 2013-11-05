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
				titulo: $trad(9,i3GEOF.preferencias.dicionario),
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
			estilo = "margin-left:10px;cursor:default;width:250px",
			nk = 0,
			k =0,
			l=0,
			numl=0,
			ids = [],
			valores = [],
			nomes = [];
		for(i=0;i<n;i++){
			ins += "<p onclick='javascript:i3GEOF.preferencias.expande("+i+")' class=paragrafo style=cursor:pointer;color:navy ><b>"+lista[i].titulo+"</b><p>";
			ins += "<div style=display:none id='listaPref"+i+"'>";
			props = lista[i].props;
			nj = props.length;
			valores = [];
			nomes = [];
			ids = [];
			for(j=0;j<nj;j++){
				ins += "<p class=paragrafo >"+props[j].titulo+"</p>";
				if(props[j].tipo === "numero" || props[j].tipo === "texto"){
					ins += "<input type=text value='' id='"+props[j].elemento+"' style='"+estilo+"' /><br><br>";
				}
				if(props[j].tipo === "boolean" || props[j].tipo === "select"){
					if(props[j].tipo === "boolean"){
						valores = [1,0];
						nomes = ["true","false"];
					}
					else{
						valores = props[j].opcoes;
						nomes = props[j].opcoes;
					}
					nk = valores.length;
					ins += "<select id='"+props[j].elemento+"' style='"+estilo+"' >";
					ins += "<option value='' >---</option>";
					for(k=0;k<nk;k++){
						ins += "<option value='"+valores[k]+"' >"+nomes[k]+"</option>";
					}
					ins += "</select><br><br>";
				}
				if(props[j].tipo === "multiselect"){
					valores = i3GEO.util.listaTodasChaves(props[j].opcoes);
					var nvalores = [];
					var nelementos;
					numl = valores.length;
					for(l=0;l<numl;l++){
						temp = props[j].opcoes[valores[l]];
						if(temp === true || temp === false){
							ids.push(props[j].elemento+"."+valores[l]);
							nvalores.push(valores[l]);
						}
					}
					ins += i3GEO.util.checkCombo(
						props[j].elemento,
						nvalores,
						nvalores,
						estilo+";overflow:auto;height:50px;border:1px solid gray;background-color:white",
						"",
						ids
					);
					ins += "<br><br>";
				}
			}
			ins += "</div></div>";
		}
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
		titulo = $trad("x86")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=3' >&nbsp;&nbsp;&nbsp;</a>";
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
			minimiza
		);
		divid = janela[2].id;
		var rodape = '' +
			'<input id=i3GEOpreferenciasbotao1 size=20  type=button value="'+$trad(1,i3GEOF.preferencias.dicionario)+'" />&nbsp;&nbsp;&nbsp;' +
			'<input id=i3GEOpreferenciasbotao2 size=20 type=button value="'+$trad(2,i3GEOF.preferencias.dicionario)+'" />' ;
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
		i3GEO.util.insereCookie("preferenciasDoI3Geo","",365);
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
			raiz = $i("i3GEOPreferenciasRaiz");
		for(i=0;i<ntipos;i++){
			elem = raiz.getElementsByTagName(tipos[i]);
			nelem = elem.length;
			for(j=0;j<nelem;j++){
				if(elem[j].value != ""){
					if (elem[j].type === "checkbox"){
						pares.push(elem[j].id+"|"+elem[j].checked);
					}
					else{
						pares.push(elem[j].id+"|"+elem[j].value);
					}
				}
			}
		}
		i3GEO.janela.tempoMsg($trad(3,i3GEOF.preferencias.dicionario));
		i3GEO.util.insereCookie("preferenciasDoI3Geo",pares.join(":"),365);
	},
	carrega: function(){
		var cookies = i3GEO.util.pegaCookie("preferenciasDoI3Geo"),
			i,props,nprops,temp,elem;
		if(cookies){
			props = cookies.split(":");
			nprops = props.length;
			for(i=0;i<nprops;i++){
				temp = props[i].split("|");
				elem = $i(temp[0]);
				if(elem){
					if (elem.type === "checkbox"){
						if(temp[1] == "true"){
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
	}
};
