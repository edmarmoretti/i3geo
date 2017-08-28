/*
Title: Perfil

Cria um gr&aacute;fico de perfil do "relevo"

Veja:

<i3GEO.analise.dialogo.perfil>

Arquivo:

i3geo/ferramentas/perfil/index.js.php

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
Class: i3GEOF.perfil
*/
i3GEOF.perfil = {
	/*
	Variavel: pontos

	Objeto com a lista de pontos iniciais enviadas como parametro na inicializa&ccedil;&atilde;o da ferramenta
	*/
	pontos: "",
	/*
	Variavel: dadosGrafico

	Dados no formato aceito pela ferramenta i3GEOF.graficointerativo
	*/
	dadosGrafico: [],
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
	mustacheHash : function(pontos) {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.perfil.dicionario);
		dicionario["asp"] = '"';
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.perfil.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/perfil/template_mst.html", function(template) {
				i3GEOF.perfil.MUSTACHE = template;
				i3GEOF.perfil.inicia(iddiv);
			});
			return;
		}
			$i(iddiv).innerHTML = i3GEOF.perfil.html();
			i3GEOF.perfil.comboTemas();
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html: function() {
		var ins = Mustache.render(i3GEOF.perfil.MUSTACHE, i3GEOF.perfil.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

	Parametro:

	pontos {objeto} - cont&eacute;m as coordenadas dos pontos que ser&atilde;o usados nos c&aacute;lculos, como no exemplo

	pontos = {xpt: [],ypt:[]}; //xpt s&atilde;o os valores de x (array) e ypt os valores de y (array)
	*/
	iniciaJanelaFlutuante: function(pontos){
		var minimiza,cabecalho,janela,divid,titulo;
		if ($i("i3GEOF.perfil")) {
			return;
		}
		if(pontos){
			i3GEOF.perfil.pontos = pontos;
		}
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("x54") + "</span></div>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.perfil",200);
		};
		janela = i3GEO.janela.cria(
			"400px",
			"290px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.perfil",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true,
			"",
			"",
			"",
			"",
			"96"
		);
		divid = janela[2].id;
		i3GEOF.perfil.aguarde = $i("i3GEOF.perfil_imagemCabecalho").style;
		i3GEOF.perfil.inicia(divid);
	},
	ativaFonteGoogle: function(obj){
		if(obj.checked == true){
			$i("i3GEOFperfilTemasSel").value = "";
			$i("i3GEOFperfilDivComboItens").innerHTML = "";
		}
	},
	/*
	Function: criaPerfil

	Executa a opera&ccedil;&atilde;o de gera&ccedil;&atilde;o do perfil

	Veja:

	<DADOSPERFILRELEVO>
	*/
	criaPerfil: function(){
			if(i3GEOF.perfil.aguarde.visibility === "visible"){
				return;
			}
			var fim = function(retorno){
				i3GEOF.perfil.aguarde.visibility = "hidden";
				if (retorno.data === undefined ){
					//$i("i3GEOperfilfim").innerHTML = "Erro.";
					return;
				}
				else{
					if(retorno.data.status != "OK"){
						$i("i3GEOperfilfim").innerHTML = $trad('erroServico',i3GEOF.perfil.dicionario);
						return;
					}
					i3GEOF.perfil.converteDados(retorno.data.results);
					if(!$i("i3GEOF.graficointerativo1_script")){
						var js = i3GEO.configura.locaplic+"/ferramentas/graficointerativo1/dependencias.php";
						i3GEO.util.scriptTag(js,"i3GEOF.perfil.iniciaGrafico()","i3GEOF.graficointerativo1_script");
					}
					else{
						i3GEOF.perfil.iniciaGrafico();
					}
					//&eacute; obrigado mostrar o mapa do google quando o perfil usa o google
					if($i("i3GEOFperfilFonteGoogle").checked === true && i3GEO.Interface.ATUAL !== "googlemaps"){
						i3GEO.navega.dialogo.google(i3GEOF.perfil.listaPontos(true).split(","));
					}
				}
			};
			if($i("i3GEOFperfilFonteGoogle").checked === true){
				i3GEOF.perfil.aguarde.visibility = "visible";
				var pontos = i3GEOF.perfil.listaPontos(false);
				i3GEO.php.dadosPerfilRelevo(fim,"google",pontos,$i("i3GEOFperfilAmostragem").value,"");
			}
			else{
				var pontos = i3GEOF.perfil.listaPontos(false);
				if($i("i3GEOFperfilTemasSel").value === "")
				{i3GEO.janela.tempoMsg($trad('selecionaTema',i3GEOF.perfil.dicionario));return;}
				if($i("i3GEOFperfilComboItens").value === "")
				{i3GEO.janela.tempoMsg($trad('selecionaItem',i3GEOF.perfil.dicionario));return;}
				i3GEOF.perfil.aguarde.visibility = "visible";
				i3GEO.php.dadosPerfilRelevo(fim,$i("i3GEOFperfilTemasSel").value,pontos,$i("i3GEOFperfilAmostragem").value,$i("i3GEOFperfilComboItens").value);
			}
	},
	/*
	Function: iniciaGrafico

	Inicializa o gr&aacute;fico de perfil definindo os parametros da ferramenta i3GEOF.graficointerativo
	*/
	iniciaGrafico: function(){
		i3GEOF.graficointerativo1.iniciaJanelaFlutuante({"dados":i3GEOF.perfil.dadosGrafico,"tipo":"bar_1","titulo":"Perfil"});
	},
	/*
	Function: listaPontos

	Converte o objeto i3GEOF.perfil.pontos em uma string com a lista de pontos

	Parametro:

	normal {booblean} - quando true, retorna x e y, quando falso, retorna y e x

	Retorno:
	{string}
	*/
	listaPontos: function(normal){
		var n = i3GEOF.perfil.pontos.xpt.length,
			i = 0,
			lista = [],
			xs = i3GEOF.perfil.pontos.xpt,
			ys = i3GEOF.perfil.pontos.ypt;
		if(normal === true){
			xs = i3GEOF.perfil.pontos.ypt;
			ys = i3GEOF.perfil.pontos.xpt;
		}
		for(i=0;i<n;i++){
			lista.push(ys[i]+" "+xs[i]);
		}
		return lista.join(",");
	},
	/*
	Function: converteDados

	Converte os dados com a altimetria para o formato aceito pela ferramenta de gr&aacute;ficos

	Parametro:

	google {objeto} - objeto no padr&atilde;o da API do google veja http://code.google.com/intl/pt-BR/apis/maps/documentation/elevation

	Retorno:

	*/
	converteDados: function(google){
		var n = google.length,
			i = 0,
			dados = ["n;x"];
		for (i=0;i<n;i++){
			dados.push(i + ";" + google[i].elevation);
		}
		i3GEOF.perfil.dadosGrafico = dados;
	},
	/*
	Function: comboTemas

	Cria um combo com a lista de temas

	Veja:

	<i3GEO.util.comboTemas>
	*/
	comboTemas: function(){
		i3GEO.util.comboTemas(
			"i3GEOFperfilTemasSel",
			function(retorno){
		 		$i("i3GEOFperfilTemas").innerHTML = retorno.dados;
		 		$i("i3GEOFperfilTemas").style.display = "block";
		 		if ($i("i3GEOFperfilTemasSel")){
		 			$i("i3GEOFperfilTemasSel").onchange = function(){
		 				i3GEO.mapa.ativaTema($i("i3GEOFperfilTemasSel").value);
						$i("i3GEOFperfilFonteGoogle").checked = false;
						//combodeitens
						if(i3GEO.temaAtivo !== ""){
							i3GEO.util.comboItens(
								"i3GEOFperfilComboItens",
								i3GEO.temaAtivo,
								function(retorno){
									$i("i3GEOFperfilDivComboItens").innerHTML = retorno.dados;
								},
								"",
								"",
								"",
								"",
								"form-control"
							);
						}
						else
						{$i("i3GEOFperfilDivComboItens").innerHTML = "";}
		 			};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOFperfilTemasSel").value = i3GEO.temaAtivo;
					$i("i3GEOFperfilTemasSel").onchange.call();
				}
			},
			"i3GEOFperfilTemas",
			"",
			false,
			"ligados",
			"",
			false,
			true,
			"form-control"
		);
	}
};
