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
	//CODIGOREGIAOPAI: "", //guarda o valor da regiao pai que originou o ultimo combo
	ULTIMO_CODIGO_TIPO_REGIAO: "", //ultimo tipo de regiao escolhido
	ULTIMO_CODIGO_REGIAO: "",//ultima regiao escolhida
	PENULTIMO_CODIGO_TIPO_REGIAO: "",
	PENULTIMO_CODIGO_REGIAO: "",
	ATIVAFILTRO: false, //ativa ou nao os botoes que permitem filtrar a regiao. Usado quando a ferramenta e aberta com opcao de filtragem.
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
	//abre a ferramenta com a opcao de filtro ativada
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
	inicia: function(divid){
		$i(divid).innerHTML = i3GEOF.locregiao.html();
		i3GEOF.locregiao.comboHierarquiaRegioes($i("i3geoLocregiaoTipoRegiao"));
		//ativa os botoes de filtro
		new YAHOO.widget.Button(
			"i3geoLocregiaoFiltroRemove",
			{onclick:{fn: function(){i3GEOF.locregiao.removeFiltro();}}}
		);
		if(i3GEOF.locregiao.ATIVAFILTRO === true){
			$i("i3geoLocregiaoBotoesFiltro").style.display = "block";
		}
	},
	//utiliza o dicionario compartilhado
	iniciaDicionario: function(){
		if(typeof(i3GEOF.metaestat.dicionario) === 'undefined'){
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
			titulo = "Filtro ";
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
	zoom: function(valorregiaopai){
		var temp = valorregiaopai.split(";");
		if(temp.length > 1 && temp[1] != ""){
			i3GEO.navega.zoomExt("","","",temp[1]);
		}
		return temp[0];
	},
	comboHierarquiaRegioesOnChange: function(combo,codigoregiaopai,codigo_tipo_regiao,valorregiaopai){
		var onde = combo.parentNode.getElementsByTagName("div")[0];
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
	comboHierarquiaRegioes: function(objonde,codigoregiaopai,codigo_tipo_regiao,valorregiaopai){
		if(objonde){
			i3GEOF.locregiao.aguarde(objonde);
		}
		var temp = function(dados){
			var onc= "",
			ins = '',
			i,n,icone;
			if(i3GEOF.locregiao.ATIVAFILTRO === true){
				icone = "<img title='Aplica filtro' src='"+i3GEO.configura.locaplic+"/imagens/oxygen/16x16/view-filter.png' style='position:relative;cursor:pointer;top:3px;left:5px' onclick='i3GEOF.locregiao.aplicaFiltro(this.parentNode.firstChild.value,"+dados.regiaopai+")' />";
			}
			else{
				icone = "<img title='Zoom para...' src='"+i3GEO.configura.locaplic+"/imagens/ic_zoom.png' style='position:relative;cursor:pointer;top:3px;left:5px' onclick='i3GEOF.locregiao.zoom(this.parentNode.firstChild.value)' />";
			}
			if(dados.valores == ""){
				n = dados.regioes.length;
				onc = 'i3GEOF.locregiao.comboHierarquiaRegioesOnChange(this,this.value)';
				ins += "<select style='width:90%' onchange=\'"+onc+"\'><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option value='"+dados.regioes[i].codigo_tipo_regiao+"'>"+dados.regioes[i].nome_tipo_regiao+"</option>";
				}
				ins += "</select><br><br><div class='paragrafo'></div>";
			}
			else{
				n = dados.valores.length;
				if(dados.regioes.length > 0){
					onc = 'i3GEOF.locregiao.comboHierarquiaRegioesOnChange(this,'+dados.regiaopai+','+dados.regioes[0].codigo_tipo_regiao+',this.value)';
				}
				else{
					onc = 'i3GEOF.locregiao.zoom(this.value)';
				}
				ins += "<select style='width:90%' onchange=\'"+onc+"\'><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option value='"+dados.valores[i].identificador_regiao+";"+dados.valores[i].ext+"'>"+dados.valores[i].nome_regiao+"</option>";
				}
				ins += "</select>"+icone+"<br><br><div class='paragrafo'></div>";
			}
			if(objonde){
				objonde.innerHTML = ins;
			}
			return ins;
		};
		i3GEO.php.listaHierarquiaRegioes(temp,codigo_tipo_regiao,codigoregiaopai,valorregiaopai);
	},
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