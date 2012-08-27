/*
Title: Cartogramas estat&iacute;sticos

Arquivo:

i3geo/classesjs/classe_cartograma.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

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
if(typeof(i3GEO) === 'undefined'){
	var i3GEO = {};
}
/*
Classe: i3GEO.cartograma

Gerencia os componentes do m&oacute;dulo de gera&ccedil;&atilde;o de cartogramas estat&iacute;sticos
*/
i3GEO.cartograma = {
	INTERFACE: "flutuante",
	TOP: 50,
	LEFT: 100,
	LARGURA: 250,
	ALTURA: 100,
	inicia: function(iddiv){
		if(!iddiv){
			iddiv = "i3geoCartoParametros_corpo";
		}
		if(i3GEO.cartograma.INTERFACE == "flutuante"){
			i3GEO.cartograma.abreJanelaParametros();
		}
		$i(iddiv).innerHTML = i3GEO.cartograma.html();
		i3GEO.cartograma.comboVariaveis();
	},
	aguarde: function(obj){
		obj.innerHTML = "<img id='"+obj.id+"_imagem' style='z-index:2' src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' />";
	},
	comboVariaveis: function(){
		var onde = $i("i3geoCartoVariaveis"),
			temp = function(dados){
				var n = dados.length,
					ins = "",
					i;
				ins = "<select style='width:"+(i3GEO.cartograma.LARGURA - 10)+"px' onchange=''><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option title='"+dados[i].descricao+"' value='"+dados[i].codigo_variavel+"'>"+dados[i].nome+"</option>";
				}
				ins += "</select>";
				if(onde){
					onde.innerHTML = ins;
				}
				return ins;
			};
		i3GEO.cartograma.aguarde(onde);
		i3GEO.php.listaVariavel(temp);
	},
	html: function(){
		var ins = '<div id="i3geoCartoVariaveisContainer" >' +
			'<p class="paragrafo" >'+$trad("x58")+'</p>' +
			'<div class="paragrafo" id="i3geoCartoVariaveis" >' +
			'</div>' +
			'</div>';
		return ins;
	},
	abreJanelaParametros: function(){
		var cabecalho,minimiza,imagemxy,janela;
		if (!$i("i3geoCartoParametros")){
			cabecalho = function(){
			};
			minimiza = function(){
				i3GEO.janela.minimiza("i3geoCartoParametros");
			};
			janela = i3GEO.janela.cria(
				i3GEO.cartograma.LARGURA+"px",
				i3GEO.cartograma.ALTURA+"px",
				"",
				"",
				"",
				$trad("x57"),
				"i3geoCartoParametros",
				false,
				"hd",
				cabecalho,
				minimiza
			);
			janela = janela[0];
			YAHOO.i3GEO.janela.manager.register(janela);
			janela.render();
			YAHOO.util.Event.addListener(janela.close, "click", i3GEO.cartograma.fechaJanelaParametros);
		}
		else{
			janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoParametros");
		}
		janela.show();
		imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
		janela.moveTo(imagemxy[0]+i3GEO.cartograma.LEFT,imagemxy[1]+i3GEO.cartograma.TOP);
	}
};