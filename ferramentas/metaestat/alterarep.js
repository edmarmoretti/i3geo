/*
Title: Ferramenta que mostra opcoes para alteracao da representacao cartografica de uma camada oriunda do METAESTAT

Utilizado em i3geo/ferramentas/metaestat/index.js

Arquivo:

i3geo/ferramentas/metaestat/alterarep.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com


Este programa e software livre; voce pode redistribui-lo
e/ou modifica-lo sob os termos da Licenca Publica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa e distribuido na expectativa de que seja util,
porem, SEM NENHUMA GARANTIA; nem mesmo a garantia implicita
de COMERCIABILIDADE OU ADEQUACAO A UMA FINALIDADE ESPECIFICA.
Consulte a Licenca Publica Geral do GNU para mais detalhes.
Voce deve ter recebido uma copia da Licenca Publica Geral do
GNU junto com este programa; se nao, escreva para a
Free Software Foundation, Inc., no endereco
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.alterarep
 */
i3GEOF.alterarep = {
	/**
	 * Ativa/desativa a imagem de aguarde
	 */
	aguarde: function(obj){
		if(!obj){
			return "<img style='display:block;z-index:2' src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' />";
		}
		var i = $i(obj.id+"_imagem");
		if(!i){
			obj.innerHTML = "<img id='"+obj.id+"_imagem' style='display:block;z-index:2' src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' />";
		}
		else{
			if(i.style.display == "block"){
				i.style.display = "none";
			}
			else{
				i.style.display = "block";
			}
		}
	},
	//para efeitos de compatibilidade
	criaJanelaFlutuante: function(){
		i3GEOF.alterarep.iniciaDicionario();
	},
	/**
	 * Inicia a ferramenta
	 * Monta o conteudo HTML e ativa os botoes de opcoes
	 * Executa i3GEOF.alterarep.html();
	 * @param id do DIV que recebera o conteudo HTML da ferramenta
	 */
	inicia: function(divid){
		$i(divid).innerHTML = i3GEOF.alterarep.html();
		new YAHOO.widget.Button(
			"i3geoalterarepCirculos",
			{onclick:{fn: function(){i3GEOF.alterarep.aplica("variatamanho");}}}
		);
		$i("i3geoalterarepCirculos-button").style.width = 230 + "px";
		new YAHOO.widget.Button(
			"i3geoalterarepCirculos1",
			{onclick:{fn: function(){i3GEOF.alterarep.aplica("variacor");}}}
		);
		$i("i3geoalterarepCirculos1-button").style.width = 230 + "px";
		new YAHOO.widget.Button(
			"i3geoalterarepCirculos2",
			{onclick:{fn: function(){i3GEOF.alterarep.aplica("continuo");}}}
		);
		$i("i3geoalterarepCirculos2-button").style.width = 230 + "px";
		new YAHOO.widget.Button(
			"i3geoalterarepArea",
			{onclick:{fn: function(){i3GEOF.alterarep.aplica("pontos");}}}
		);
		$i("i3geoalterarepArea-button").style.width = 230 + "px";
		new YAHOO.widget.Button(
			"i3geoalterarepArea1",
			{onclick:{fn: function(){i3GEOF.alterarep.aplica("hachureas");}}}
		);
		$i("i3geoalterarepArea1-button").style.width = 230 + "px";
		new YAHOO.widget.Button(
			"i3geoalterarepArea2",
			{onclick:{fn: function(){i3GEOF.alterarep.aplica("opacidade");}}}
		);
		$i("i3geoalterarepArea2-button").style.width = 230 + "px";
	},
	/**
	 * Carrega o dicionario com a traducao das opcoes
	 * Ao final executa i3GEOF.alterarep.iniciaJanelaFlutuante()
	 */
	iniciaDicionario: function(){
		if(typeof(i3GEOF.metaestat.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/metaestat/dicionario.js",
				"i3GEOF.alterarep.iniciaJanelaFlutuante()",
				"i3GEOF.metaestat.dicionario_script"
			);
		}
		else{
			i3GEOF.alterarep.iniciaJanelaFlutuante();
		}
	},
	/**
	 * Abre a janela flutuante que recebera o HTML com as opcoes
	 * Executa ao final i3GEOF.alterarep.inicia();
	 */
	iniciaJanelaFlutuante: function(){
		if($i("i3GEOF.alterarep_corpo")){
			return;
		}
		var minimiza,cabecalho,janela,divid,titulo;
		cabecalho = function(){
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.alterarep");
		};
		//cria a janela flutuante
		titulo = "<div class='i3GeoTituloJanela'>Representa&ccedil;&atilde;o</div>";
		janela = i3GEO.janela.cria(
			"250px",
			"",
			"",
			"",
			"",
			titulo,
			"i3GEOF.alterarep",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.alterarep_corpo").style.backgroundColor = "white";
		i3GEOF.alterarep.inicia(divid);
		i3GEO.janela.tempoMsg("Utilize a guia lateral para ligar/desligar camadas que j&aacute; estejam no mapa");
	},
	/**
	 * HTML com os componentes da ferramenta
	 */
	html: function(){
		var ins = "" +
		'	<fieldset style="padding:5px;margin:2px;">'+
		'	<legend>C&iacute;rculos representando os valores</legend>'+
		'		<input id=i3geoalterarepCirculos type="button" value="Mant&ecirc;m as classes e varia o tamanho" /><br><br>'+
		'		<input id=i3geoalterarepCirculos1 type="button" value="Tamanho &uacute;nico" /><br><br>'+
		'		<input id=i3geoalterarepCirculos2 type="button" value="Tamanho cont&iacute;nuo" />'+
		'	</fieldset><br>'+
		'	<fieldset style="padding:5px;margin:2px;">'+
		'	<legend>Preenchimento de &aacute;rea</legend>'+
		'		<input id=i3geoalterarepArea type="button" value="Com pontos" /><br><br>'+
		'		<input id=i3geoalterarepArea1 type="button" value="Com hachureas" /><br><br>'+
		'		<input id=i3geoalterarepArea2 type="button" value="Com varia&ccedil;&atilde;o de opacidade" /><br><br>'+
		'	</fieldset><br>';
		return ins;
	},
	/**
	 * Aplica a operacao de transformacao da representacao da camada conforme a escolha do usuario
	 * Executa ferramentas/metaestat/analise.php passando como parametro o valor de &funcao, que indica a operacao que devera ser realizada
	 */
	aplica: function(tipo){
		if($i("i3geoCartoAnaliseCamadasCombo").value == ""){
			i3GEO.janela.tempoMsg("Ative uma camada primeiro");
			return;
		}
		i3GEO.mapa.ativaTema($i("i3geoCartoAnaliseCamadasCombo").value);
		var p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?g_sid="+i3GEO.configura.sid +
			"&tema="+$i("i3geoCartoAnaliseCamadasCombo").value,
			temp = function(retorno){
				i3GEO.janela.fechaAguarde("alterarep1");
				if(retorno.data == ""){
					i3GEO.janela.tempoMsg("A camada escolhida n&atilde;o permite essa opera&ccedil;&atilde;o");
					return;
				}
				var atualiza = function(){
					i3GEO.atualiza();
					i3GEOF.metaestat.CAMADAS.push(retorno.data);
					//i3GEO.mapa.ativaTema(retorno.data);
					i3GEOF.metaestat.analise.comboCamadas();
				};
				i3GEO.php.adtema(atualiza,retorno.mapfile);
			};
		i3GEO.janela.abreAguarde("alterarep1","Aguarde...");
		if(tipo == "variatamanho"){
			p += "&funcao=classes2circulos";
		}
		if(tipo == "variacor"){
			p += "&funcao=classes2circulos1";
		}
		if(tipo == "continuo"){
			p += "&funcao=classes2circulos2";
		}
		if(tipo == "pontos"){
			p += "&funcao=classes2pontos";
		}
		if(tipo == "hachureas"){
			p += "&funcao=classes2hach";
		}
		if(tipo == "opacidade"){
			p += "&funcao=classes2opacidade";
		}
		i3GEO.util.ajaxGet(p,temp);
	},
	corj: function(obj){
		i3GEO.util.abreCor("",obj);
	}
};