
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Perfil

Cria um gráfico de perfil do "relevo"

Veja:

<i3GEO.analise.dialogo.perfil>

Arquivo:

i3geo/ferramentas/perfil/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

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
Class: i3GEOF.perfil
*/
i3GEOF.perfil = {
	/*
	Variavel: pontos
	
	Objeto com a lista de pontos iniciais enviadas como parâmetro na inicialização da ferramenta
	*/
	pontos: "",
	/*
	Variavel: dadosGrafico
	
	Dados no formato aceito pela ferramenta i3GEOF.graficointerativo
	*/
	dadosGrafico: [],
	/*
	Variavel: aguarde
	
	Objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
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
			$i(iddiv).innerHTML += i3GEOF.perfil.html();
			i3GEOF.perfil.comboTemas();
			new YAHOO.widget.Button(
				"i3GEOperfilbotao1",
				{onclick:{fn: i3GEOF.perfil.criaPerfil}}
			);		
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
		var ins = "<p class='paragrafo' >Escolha qual será a fonte dos dados de Z:";
		ins += "<p class='paragrafo' ><input onclick='if(this.checked == true){$i(\"i3GEOFperfilTemasSel\").value = \"\";$i(\"i3GEOFperfilDivComboItens\").innerHTML = \"\";}' style=cursor:pointer checked type=radio name=i3GEOFperfilFonte id=i3GEOFperfilFonteGoogle /> Google ou";
		ins += "<p class='paragrafo' >um tema do mapa: <div style=text-align:left; id=i3GEOFperfilTemas ></div>";
		ins += "<div style=text-align:left; id=i3GEOFperfilDivComboItens ></div><br>";
		
		ins += "<p class='paragrafo' ><input type=text id=i3GEOFperfilAmostragem value=20 size=3 /> Número de pontos que serão obtidos ao longo da linha";
		ins += "<br><br><input id=i3GEOperfilbotao1 type='buttom' value='Criar gráfico' />";
		ins += "<br><br><div style=text-align:left id=i3GEOperfilfim ></div>";
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	
	Parametro:
	
	pontos {objeto} - contém as coordenadas dos pontos que serão usados nos cálculos, como no exemplo
	
	pontos = {xpt: [],ypt:[]}; //xpt são os valores de x (array) e ypt os valores de y (array)
	*/	
	criaJanelaFlutuante: function(pontos){
		var minimiza,cabecalho,janela,divid,temp,titulo,cabecalho,minimiza;
		i3GEOF.perfil.pontos = pontos;
		//cria a janela flutuante
		titulo = "Perfil <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=96' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.perfil");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.perfil",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.perfil.aguarde = $i("i3GEOF.perfil_imagemCabecalho").style;
		i3GEOF.perfil.inicia(divid);
	},
	/*
	Function: criaPerfil
	
	Executa a operação de geração do perfil
	
	Veja:
	
	<DADOSPERFILRELEVO>
	*/
	criaPerfil: function(){
		try{
			if(i3GEOF.perfil.aguarde.visibility === "visible")
			{return;}
			var temp,
				p,
				cp;
			fim = function(retorno){
				i3GEOF.perfil.aguarde.visibility = "hidden";
				if (retorno.data === undefined )
				{$i("i3GEOperfilfim").innerHTML = "Erro.";return;}
				else{
					if(retorno.data.status != "OK")
					{$i("i3GEOperfilfim").innerHTML = "Erro ao acessar o serviço de fornecimento dos dados";return;}
					i3GEOF.perfil.converteDados(retorno.data.results);
					if(!$i("i3GEOF.graficointerativo_script")){
						var js = i3GEO.configura.locaplic+"/ferramentas/graficointerativo/index.js.php";
						i3GEO.util.scriptTag(js,"i3GEOF.perfil.iniciaGrafico()","i3GEOF.graficointerativo_script");
					}
					//é obrigado mostrar o mapa do google quando o perfil usa o google
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
				{alert("Selecione um tema");return;}
				if($i("i3GEOFperfilComboItens").value === "")
				{alert("Selecione um item");return;}
				i3GEOF.perfil.aguarde.visibility = "visible";
				i3GEO.php.dadosPerfilRelevo(fim,$i("i3GEOFperfilTemasSel").value,pontos,$i("i3GEOFperfilAmostragem").value,$i("i3GEOFperfilComboItens").value);
			}
			
		}
		catch(e){$i("i3GEOperfilfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.perfil.aguarde.visibility = "hidden";}
	},
	/*
	Function: iniciaGrafico
	
	Inicializa o gráfico de perfil definindo os parâmetros da ferramenta i3GEOF.graficointerativo
	*/
	iniciaGrafico: function(){
		i3GEOF.graficointerativo.tipo = "line";
		i3GEOF.graficointerativo.titulo = "Perfil";
		i3GEOF.graficointerativo.criaJanelaFlutuante(i3GEOF.perfil.dadosGrafico);
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
			lista.push(ys[i]+" "+xs[i])
		}
		return lista.toString(",");
	},
	/*
	Function: converteDados
	
	Converte os dados com a altimetria para o formato aceito pela ferramenta de gráficos
	
	Parametro:
	
	google {objeto} - objeto no padrão da API do google veja http://code.google.com/intl/pt-BR/apis/maps/documentation/elevation
	
	Retorno:
	
	*/
	converteDados: function(google){
		var n = google.length,
			i = 0,
			dados = ["n;x"];
		for (i=0; i<n;i++){
			dados.push(i+";"+google[i].elevation);
		}
		i3GEOF.perfil.dadosGrafico = dados;
		return dados;
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
									$i("i3GEOFperfilDivComboItens").innerHTML = "<p class=paragrafo >Item com os valores: <br>"+retorno.dados+"</p>";
								}
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
			"ligados"
		);	
	}	
};
