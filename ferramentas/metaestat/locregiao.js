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
	codigoregiaopai: "", //guarda o valor da regiao pai que originou o ultimo combo
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
	inicia: function(divid){
		$i(divid).innerHTML = i3GEOF.locregiao.html();
		i3GEOF.locregiao.comboHierarquiaRegioes($i("i3geoLocregiaoTipoRegiao"));
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
		var minimiza,cabecalho,janela,divid,titulo;
		cabecalho = function(){
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.locregiao");
		};
		//cria a janela flutuante
		titulo = $trad("x59");
		janela = i3GEO.janela.cria(
			"210px",
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
		var ins = '<div id="i3geoLocregiaoContainer" style="margin-left:5px;">' +
		'<div class="paragrafo" id="i3geoLocregiaoTipoRegiao" >' +
		'</div>' +
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
		if(codigoregiaopai){
			i3GEOF.locregiao.codigoregiaopai = codigoregiaopai;
		}
		if(combo.value == ""){
			onde.innerHTML = "";
			return;
		}
		if(!codigo_tipo_regiao){
			codigo_tipo_regiao = combo.value;
		}
		if(valorregiaopai){
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
			i,n;
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
				ins += "</select><br><br><div class='paragrafo'></div>";
			}
			if(objonde){
				objonde.innerHTML = ins;
			}
			return ins;
		};
		i3GEO.php.listaHierarquiaRegioes(temp,codigo_tipo_regiao,codigoregiaopai,valorregiaopai);
	}
};