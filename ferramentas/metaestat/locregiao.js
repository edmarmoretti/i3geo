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

		if(i3GEOF.locregiao.ATIVAFILTRO === true){
			$i("i3geoLocregiaoBotoesFiltro").style.display = "block";
		}
	},
	/**FATORZOOM
	 * Carrega o dicionario com a traducao
	 * Executa i3GEOF.locregiao.iniciaJanelaFlutuante();
	 */
	iniciaDicionario: function(largura, altura, topo, esquerda){
		if(!i3GEOF.metaestat || typeof(i3GEOF.metaestat.dicionario) === 'undefined'){
			var temp = function(){
				i3GEOF.locregiao.iniciaJanelaFlutuante(null,largura, altura, topo, esquerda);
			};
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/metaestat/dicionario.js",
				temp,
				"i3GEOF.metaestat.dicionario_script"
			);
		}
		else{
			i3GEOF.locregiao.iniciaJanelaFlutuante(largura, altura, topo, esquerda);
		}
	},
	/**
	 * Abre a janela flutuante com o conteudo da ferramenta
	 * Executa i3GEOF.locregiao.inicia
	 */
	iniciaJanelaFlutuante: function(largura, altura, topo, esquerda){
		if($i("i3GEOF.locregiao_corpo")){
			return;
		}
		if (!largura) {
			largura = 300;
		}
		if (!altura) {
			altura = "";
		}
		else{
			altura += "px";
		}
		var minimiza,cabecalho,janela,divid,titulo;
		cabecalho = function(){
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.locregiao");
		};
		//cria a janela flutuante
		if(i3GEOF.locregiao.ATIVAFILTRO === true){
			titulo = "Filtro";
		}
		else{
			titulo = $trad("x59");
		}
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >"+titulo+"</span></div>";
		janela = i3GEO.janela.cria(
			largura + "px",
			altura,
			"",
			"",
			"",
			titulo,
			"i3GEOF.locregiao",
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
			"111"
		);
		divid = janela[2].id;
		$i("i3GEOF.locregiao_corpo").style.backgroundColor = "white";
		if (topo
			&& esquerda) {
			janela = YAHOO.i3GEO.janela.manager.find("i3GEOF.locregiao");
			janela.moveTo(
				esquerda,
				topo);
		}
		i3GEOF.locregiao.inicia(divid);
	},
	/**
	 * HTML com o conteudo da ferramenta
	 *
	 * @return HTML
	 */
	html: function(){
		var ins = "" +
		'<div  class="container-fluid">' +
		'	<div id="i3geoLocregiaoBotoesFiltro" style="display:none" >' +
		'		<button onclick="i3GEOF.locregiao.removeFiltro()" class="btn btn-primary btn-sm btn-raised">Remove o filtro</button>' +
		'	</div>' +
		'	<div id="i3geoLocregiaoContainer">' +
		'		<div class="checkbox text-left"><label>' +
		'			<input checked id="i3geoLocregiaoNavegaAutoCk" type="checkbox" >' +
		'			<span class="checkbox-material noprint"><span class="check"></span></span> Navega&ccedil;&atilde;o autom&aacute;tica'+
		'		</label></div>' +
		'		<div class="paragrafo" id="i3geoLocregiaoTipoRegiao" >' +
		'		</div>' +
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
		var onde = combo.parentNode.parentNode.parentNode.getElementsByTagName("div")[2];
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
			//<span class="material-icons">filter_list</span>
			if(i3GEOF.locregiao.ATIVAFILTRO === true){
				icone = '<span style="cursor:pointer;" onclick="i3GEOF.locregiao.aplicaFiltro(this.parentNode.firstChild.firstChild.value,'+dados.regiaopai+')" class="material-icons" title="Aplica filtro">filter_list</span>';
			}
			else{
				icone = '<span style="cursor:pointer;" onclick="i3GEOF.locregiao.zoom(this.parentNode.firstChild.firstChild.value)" class="material-icons" title="Zoom para...">gps_fixed</span>';
			}
			if(dados.valores == ""){
				n = dados.regioes.length;
				onc = 'i3GEOF.locregiao.comboHierarquiaRegioesOnChange(this,this.value)';
				ins += "<div  class='form-group label-fixed condensed'>";
				ins += "<div class='input-group'><select style='width: 230px;' class='form-control' onchange=\'"+onc+"\'><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option value='"+dados.regioes[i].codigo_tipo_regiao+"'>"+dados.regioes[i].nome_tipo_regiao+"</option>";
				}
				ins += "</select></div></div>";
				ins += "<div class='form-inline'></div>";

			}
			else{
				n = dados.valores.length;
				if(dados.regioes.length > 0){
					onc = 'i3GEOF.locregiao.comboHierarquiaRegioesOnChange(this,'+dados.regiaopai+','+dados.regioes[0].codigo_tipo_regiao+',this.value)';
				}
				else{
					onc = 'i3GEOF.locregiao.zoom(this.value)';
				}
				ins += "<div class='form-group label-fixed condensed'>";
				ins += "<div class='input-group'><select style='width: 230px;' class='form-control' onchange=\'"+onc+"\'><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option value='"+dados.valores[i].identificador_regiao+";"+dados.valores[i].ext+"'>"+dados.valores[i].nome_regiao+"</option>";
				}
				ins += "</select></div>" + icone + "</div>";
				ins += "<div class='form-inline'></div>";
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
		i3GEO.janela.tempoMsg("O filtro &eacute; aplicado a todas as camadas oriundas do sistema de metadados estat&iacute;sticos.");
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