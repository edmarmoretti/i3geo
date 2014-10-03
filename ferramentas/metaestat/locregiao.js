/*
Title: Ferramenta que permite localizar uma regi&atilde;o baseada no cadastro do m&oacute;dulo METAESTAT

Arquivo:

i3geo/ferramentas/metaestat/locregiao.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Esse programa utiliza parcialmente os codigos da aplicacao calculadora de carbono desenvolvido pelo
IPAM - Instituto de Pesquisa Ambiental da Amazonia

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
Classe: i3GEOF.locregiao

Permite que o usu&aacute;rio escolha uma regi&atilde;o para alterar o zoom ou aplicar um filtro
 */
i3GEOF.locregiao = {
	/**
	 * Guarda o ultimo codigo de tipo de regiao escolhido
	 */
	ULTIMO_CODIGO_TIPO_REGIAO: "",
	/**
	 * Guarda o ultimo codigo de regiao escolhido
	 */
	ULTIMO_CODIGO_REGIAO: "",
	/**
	 * Guarda o penultimo codigo de tipo de regiao escolhido
	 */
	PENULTIMO_CODIGO_TIPO_REGIAO: "",
	/**
	 * Guarda o penultimo codigo de regiao escolhido
	 */
	PENULTIMO_CODIGO_REGIAO: "",
	/**
	 * Ativa ou nao os botoes que permitem filtrar a regiao. Usado quando a ferramenta e aberta com opcao de filtragem.
	 */
	ATIVAFILTRO: false,
	/**
	 * Valor que sera adicionado as coordeandas que definem o zoom
	 */
	FATORZOOM: 0.05,
	/**
	 * Ativa/desativa o indicador de aguarde
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
		i3GEOF.locregiao.iniciaDicionario();
	},
	/**
	 * Abre a ferramenta com a opcao de filtro ativada
	 * Com o filtro ativado, apenas a regiao escolhida e mostrada no mapa
	 * Executa i3GEOF.locregiao.comboHierarquiaRegioes
	 */
	abreComFiltro: function(){
		i3GEOF.locregiao.ATIVAFILTRO = true;
		var divbotoes = $i("i3geoLocregiaoBotoesFiltro");
		if(!divbotoes){
			i3GEOF.locregiao.criaJanelaFlutuante();
		}
		else{
			divbotoes.style.display = "block";
			$i("i3geoLocregiaoTipoRegiao").innerHTML = "";
			i3GEOF.locregiao.ULTIMO_CODIGO_REGIAO = "";
			i3GEOF.locregiao.ULTIMO_CODIGO_TIPO_REGIAO = "";
			i3GEOF.locregiao.comboHierarquiaRegioes($i("i3geoLocregiaoTipoRegiao"));
		}
	},
	/**
	 * Inicia a ferramenta ativando as opcoes
	 * Executa i3GEOF.locregiao.comboHierarquiaRegioes
	 */
	inicia: function(divid){
		$i(divid).innerHTML = i3GEOF.locregiao.html();
		i3GEOF.locregiao.comboHierarquiaRegioes($i("i3geoLocregiaoTipoRegiao"));
		//ativa os botoes de filtro
		var b = new YAHOO.widget.Button(
			"i3geoLocregiaoFiltroRemove",
			{onclick:{fn: function(){i3GEOF.locregiao.removeFiltro();}}}
		);
		b.addClass("rodar150");
		if(i3GEOF.locregiao.ATIVAFILTRO === true){
			$i("i3geoLocregiaoBotoesFiltro").style.display = "block";
		}
	},
	/**FATORZOOM
	 * Carrega o dicionario com a traducao
	 * Executa i3GEOF.locregiao.iniciaJanelaFlutuante();
	 */
	iniciaDicionario: function(){
		if(!i3GEOF.metaestat || typeof(i3GEOF.metaestat.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/metaestat/dicionario.js",
				"i3GEOF.locregiao.iniciaJanelaFlutuante()",
				"i3GEOF.metaestat.dicionario_script"
			);
		}
		else{
			i3GEOF.locregiao.iniciaJanelaFlutuante();
		}
	},
	/**
	 * Abre a janela flutuante com o conteudo da ferramenta
	 * Executa i3GEOF.locregiao.inicia
	 */
	iniciaJanelaFlutuante: function(){
		if($i("i3GEOF.locregiao_corpo")){
			return;
		}
		var minimiza,cabecalho,janela,divid,titulo;
		cabecalho = function(){
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.locregiao");
		};
		//cria a janela flutuante
		if(i3GEOF.locregiao.ATIVAFILTRO === true){
			titulo = "Filtro geogr&aacute;fico";
		}
		else{
			titulo = $trad("x59");
		}
		titulo += " <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=6&idajuda=111' >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"215px",
			"",
			"",
			"",
			"",
			titulo,
			"i3GEOF.locregiao",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.locregiao_corpo").style.backgroundColor = "white";
		i3GEOF.locregiao.inicia(divid);
	},
	/**
	 * HTML com o conteudo da ferramenta
	 *
	 * @return HTML
	 */
	html: function(){
		var ins = "" +
		'<div id="i3geoLocregiaoBotoesFiltro" style="display:none" >' +
		'	<input id=i3geoLocregiaoFiltroRemove type="button" value="Remove o filtro" />' +
		'<br><br></div>' +
		'<div id="i3geoLocregiaoContainer" style="margin-left:5px;">' +
		'	<input type=checkbox id=i3geoLocregiaoNavegaAutoCk checked style="cursor:pointer;position:relative;top:3px;"/> Navega&ccedil;&atilde;o autom&aacute;tica<br><br>' +
		'	<div class="paragrafo" id="i3geoLocregiaoTipoRegiao" >' +
		'	</div>' +
		'</div>';
		return ins;
	},
	/**
	 * Altera a extensao geografica do mapa para enquadrar uma regiao
	 * @param string contendo a extensao geografica. Essa string e composta, sendo necessario converter em array e obter o segundo valor
	 */
	zoom: function(valorregiaopai){
		var temp = valorregiaopai.split(";"),
			retorno = temp[0];
		if(temp.length > 1 && temp[1] != ""){
			temp = temp[1].split(" ");
			temp[0] = temp[0]*1 - i3GEOF.locregiao.FATORZOOM;
			temp[1] = temp[1]*1 - i3GEOF.locregiao.FATORZOOM;
			temp[2] = temp[2]*1 + i3GEOF.locregiao.FATORZOOM;
			temp[3] = temp[3]*1 + i3GEOF.locregiao.FATORZOOM;
			i3GEO.navega.zoomExt("","","",temp.join(" "));
		}
		return retorno;
	},
	/**
	 * Executado quando o usuario escolhe uma regiao
	 * Atualiza as variaveis que guardam as selecoes anteriores
	 * Aplica o zoom se for necessario
	 * Executa i3GEOF.locregiao.comboHierarquiaRegioes que ira montar a lista de regioes ou tipos de regioes de nivel inferior
	 * @param objeto DOM do combo de selecao de regioes
	 * @param codigo do tipo de regiao que e pai da atualmente selecionada
	 * @param codigo do tipo de regiao selecionada
	 * @param codigo da regiao pai da regiao selecionada
	 */
	comboHierarquiaRegioesOnChange: function(combo,codigoregiaopai,codigo_tipo_regiao,valorregiaopai){
		var onde = combo.parentNode.parentNode.getElementsByTagName("div")[1];
		i3GEOF.locregiao.PENULTIMO_CODIGO_REGIAO = i3GEOF.locregiao.ULTIMO_CODIGO_REGIAO;
		i3GEOF.locregiao.PENULTIMO_CODIGO_TIPO_REGIAO = i3GEOF.locregiao.ULTIMO_CODIGO_TIPO_REGIAO;
		if(valorregiaopai){
			i3GEOF.locregiao.ULTIMO_CODIGO_REGIAO = valorregiaopai.split(";")[0];
		}
		else{
			i3GEOF.locregiao.ULTIMO_CODIGO_REGIAO = "";
		}
		if(codigoregiaopai){
			i3GEOF.locregiao.ULTIMO_CODIGO_TIPO_REGIAO = codigoregiaopai;
		}
		else{
			i3GEOF.locregiao.ULTIMO_CODIGO_TIPO_REGIAO = "";
		}
		if(combo.value == ""){
			onde.innerHTML = "";
			return;
		}
		if(!codigo_tipo_regiao){
			codigo_tipo_regiao = combo.value;
		}
		if(valorregiaopai && $i("i3geoLocregiaoNavegaAutoCk").checked === true){
			valorregiaopai = i3GEOF.locregiao.zoom(valorregiaopai);
		}
		i3GEOF.locregiao.comboHierarquiaRegioes(onde,codigoregiaopai,codigo_tipo_regiao,valorregiaopai);
	},
	/**
	 * Monta o combo de regioes para escolha do usuario
	 * A funcao onchange podera reexecutar essa funcao para montar o combo de hierarquia inferior
	 * @param objeto DOM onde o combo sera inserido
	 * @param codigo do tipo da regiao pai da atual
	 * @param codigo do tipo de regiao atual
	 * @param codigo da regiao pai
	 */
	comboHierarquiaRegioes: function(objonde,codigoregiaopai,codigo_tipo_regiao,valorregiaopai){
		if(objonde){
			i3GEOF.locregiao.aguarde(objonde);
		}
		var temp = function(dados){
			var onc= "",
			ins = '',
			i,n,icone;
			if(i3GEOF.locregiao.ATIVAFILTRO === true){
				icone = "<img title='Aplica filtro' src='"+i3GEO.configura.locaplic+"/imagens/oxygen/16x16/view-filter.png' style='position:relative;cursor:pointer;top:3px;left:5px' onclick='i3GEOF.locregiao.aplicaFiltro(this.parentNode.firstChild.firstChild.value,"+dados.regiaopai+")' />";
			}
			else{
				icone = "<img title='Zoom para...' src='"+i3GEO.configura.locaplic+"/imagens/ic_zoom.png' style='position:relative;cursor:pointer;top:3px;left:5px' onclick='i3GEOF.locregiao.zoom(this.parentNode.firstChild.firstChild.value)' />";
			}
			if(dados.valores == ""){
				n = dados.regioes.length;
				onc = 'i3GEOF.locregiao.comboHierarquiaRegioesOnChange(this,this.value)';
				ins += "<div class=styled-select style='width:180px;float:left;'><select onchange=\'"+onc+"\'><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option value='"+dados.regioes[i].codigo_tipo_regiao+"'>"+dados.regioes[i].nome_tipo_regiao+"</option>";
				}
				ins += "</select></div><br><br><div class='paragrafo'></div>";
			}
			else{
				n = dados.valores.length;
				if(dados.regioes.length > 0){
					onc = 'i3GEOF.locregiao.comboHierarquiaRegioesOnChange(this,'+dados.regiaopai+','+dados.regioes[0].codigo_tipo_regiao+',this.value)';
				}
				else{
					onc = 'i3GEOF.locregiao.zoom(this.value)';
				}
				ins += "<div class=styled-select style='width:180px;float:left;'><select onchange=\'"+onc+"\'><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option value='"+dados.valores[i].identificador_regiao+";"+dados.valores[i].ext+"'>"+dados.valores[i].nome_regiao+"</option>";
				}
				ins += "</select></div>"+icone+"<br><br><div class='paragrafo'></div>";
			}
			if(objonde){
				objonde.innerHTML = ins;
			}
			return ins;
		};
		i3GEO.php.listaHierarquiaRegioes(temp,codigo_tipo_regiao,codigoregiaopai,valorregiaopai);
	},
	/**
	 * Aplica um filtro nas camadas do mapa oriundas do banco de metadados
	 * O mapa ira mostrar apenas o que passar pelo filtro
	 * Executa i3GEO.php.aplicaFiltroRegiao
	 * @param codigo da regiao
	 * @param codigo do tipo de regiao
	 */
	aplicaFiltro: function(codigo_regiao,codigo_tipo_regiao){
		if(codigo_regiao === "" || codigo_tipo_regiao === ""){
			return;
		}
		codigo_regiao = codigo_regiao.split(";")[0];
		var temp = function(){
			i3GEO.janela.AGUARDEMODAL = false;
			i3GEO.janela.fechaAguarde("aguardeFiltroRegiao");
			i3GEO.Interface.atualizaMapa();
		};
		i3GEO.janela.AGUARDEMODAL = true;
		i3GEO.janela.abreAguarde("aguardeFiltroRegiao","Filtrando...");
		i3GEO.php.aplicaFiltroRegiao(temp,codigo_tipo_regiao,codigo_regiao);
		i3GEO.janela.tempoMsg("O filtro &eacute; aplicado a todas as camadas oriundas do sistema de metadados estat&iacute;cos.");
	},
	/**
	 * Remove os filtros aplicados com aplicaFiltro
	 * Executa i3GEO.php.aplicaFiltroRegiao
	 */
	removeFiltro: function(){
		var tipo = "",
		temp = function(){
			i3GEO.janela.AGUARDEMODAL = false;
			i3GEO.janela.fechaAguarde("aguardeFiltroRegiao");
			i3GEO.Interface.atualizaMapa();
		};
		i3GEO.janela.AGUARDEMODAL = true;
		i3GEO.janela.abreAguarde("aguardeFiltroRegiao","Filtrando...");
		i3GEO.php.aplicaFiltroRegiao(temp,"","","","",tipo);
	}
};