/*
 Title: Ferramenta que mostra opcoes adicionais de analise do m&oacute;dulo METAESTAT

 Arquivo:

 i3geo/ferramentas/metaestat/alterarep.js

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
 Classe: i3GEOF.alterarep
 */
i3GEOF.alterarep = {
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
	inicia: function(divid){
		$i(divid).innerHTML = i3GEOF.alterarep.html();
		new YAHOO.widget.Button(
			"i3geoalterarepCirculos",
			{onclick:{fn: function(){i3GEOF.alterarep.circulos("variatamanho");}}}
		);
		$i("i3geoalterarepCirculos-button").style.width = 230 + "px";
		new YAHOO.widget.Button(
			"i3geoalterarepCirculos1",
			{onclick:{fn: function(){i3GEOF.alterarep.circulos("variacor");}}}
		);
		$i("i3geoalterarepCirculos1-button").style.width = 230 + "px";
	},
	//utiliza o dicionario compartilhado
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
		titulo = "Representa&ccedil;&atilde;o &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
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
	html: function(){
		var ins = "" +
		'	<fieldset style="padding:5px;margin:2px;">'+
		'	<legend>C&iacute;rculos representando os valores</legend>'+
		'		<input id=i3geoalterarepCirculos type="button" value="Mant&ecirc;m as cores e varia o tamanho" /><br><br>'+
		'		<input id=i3geoalterarepCirculos1 type="button" value="Mant&ecirc;m as cores" />'+
		'	</fieldset><br>';
		return ins;
	},
	circulos: function(tipo){
		if($i("i3geoCartoAnaliseCamadasCombo").value == ""){
			i3GEO.janela.tempoMsg("Ative uma camada primeiro");
			return;
		}
		i3GEO.mapa.ativaTema($i("i3geoCartoAnaliseCamadasCombo").value);
		var p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?g_sid="+i3GEO.configura.sid +
			"&tema="+$i("i3geoCartoAnaliseCamadasCombo").value,
			temp = function(retorno){
			i3GEO.janela.fechaAguarde("alterarep1");
			var atualiza = function(){
					i3GEO.atualiza();
					i3GEOF.metaestat.CAMADAS.push(retorno.layer);
					i3GEO.mapa.ativaTema(retorno.layer);
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
		i3GEO.util.ajaxGet(p,temp);
	},
	corj: function(obj){
		i3GEO.util.abreCor("",obj);
	}
};