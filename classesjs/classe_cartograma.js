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
	LARGURA: 260,
	ALTURA: 300,
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
					ins = '<p class="paragrafo" >'+$trad("x58")+'</p>',
					i;
				ins += "<select style='width:"+(i3GEO.cartograma.LARGURA - 20)+"px' onchange='i3GEO.cartograma.comboVariaveisOnchange(this)'><option value=''>---</option>";
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
	comboVariaveisOnchange: function(combo){
		if(combo.value != ""){
			i3GEO.cartograma.comboMedidasVariavel(combo.value);
		}
		else{
			$i("i3geoCartoMedidasVariavel").innerHTML = "";
			$i("i3geoCartoParametrosMedidasVariavel").innerHTML = "";
		}
	},
	comboMedidasVariavel: function(codigo_variavel){
		var onde = $i("i3geoCartoMedidasVariavel"),
			temp = function(dados){
				var n = dados.length,
					ins = '<p class="paragrafo" >'+$trad("x59")+'</p>',
					i;
				ins += "<select style='width:"+(i3GEO.cartograma.LARGURA - 20)+"px' onchange='i3GEO.cartograma.comboMedidaVariavelOnchange(this)'><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option value='"+dados[i].id_medida_variavel+"'>"+dados[i].nomemedida+"</option>";
				}
				ins += "</select>";
				if(onde){
					onde.innerHTML = ins;
				}
				return ins;
			};
		i3GEO.cartograma.aguarde(onde);
		i3GEO.php.listaMedidaVariavel(codigo_variavel,temp);
	},
	comboMedidaVariavelOnchange: function(combo){
		if(combo.value != ""){
			i3GEO.cartograma.parametros.lista(combo.value);
		}
		else{
			$i("i3geoCartoParametrosMedidasVariavel").innerHTML = "";
		}
	},
	parametros: {
		//guarda a lista de parametros
		dados: [],
		//obtem a lista com os parametros da medida
		//cria os combos para os parametros que sao pai de todos
		lista: function(id_medida_variavel){
			var temp = function(dados){
					i3GEO.cartograma.parametros.dados = dados;
					i3GEO.cartograma.parametros.combos("0");
				};
			i3GEO.php.listaParametrosMedidaVariavel(id_medida_variavel,temp);
		},
		//cria um combo para escolher os valores de um parametro
		combos: function(nivel){
			var dados = i3GEO.cartograma.parametros.dados,
				n = dados.length,
				onde = $i("i3geoCartoParametrosMedidasVariavel"),
				idpar,idcombo,i,novoel,teste;
			//cria o combo para o parametro cujo id_pai for do nivel escolhido
			for(i=0;i<n;i++){
				if(dados[i].id_pai == nivel){
					idpar = "parametro_"+dados[i].id_parametro_medida;
					idcombo = "parametro_"+dados[i].id_parametro_medida+"_"+nivel;
					teste = i3GEO.cartograma.parametros.retornaIdPai(dados[i].id_parametro_medida);
					if(teste != false){
						idpar = "parametro_"+teste;
					}
					if(!$i(idpar)){
						novoel = document.createElement("div");
						novoel.id = idpar;
						novoel.className = "paragrafo";
						onde.appendChild(novoel);
						onde = novoel;
					}
					onde = $i(idpar);
					if(!$i(idcombo)){
						novoel = document.createElement("div");
						novoel.id = idcombo;
						novoel.className = "paragrafo";
						onde.appendChild(novoel);
						i3GEO.cartograma.parametros.valoresCombo(dados[i].id_parametro_medida,dados[i].nome,nivel,onde);
					}
				}
			}
		},
		valoresCombo: function(id_parametro_medida,titulo,nivel,onde){
			var temp = function(dados){
				var n = dados.length,
					ins = "",
					oc = "'i3GEO.cartograma.parametros.combos(\""+id_parametro_medida+"\")'",
					filho = i3GEO.cartograma.parametros.retornaIdFilho(id_parametro_medida),
					i,novoel;
				if(filho == false){
					oc = "";
				}
				ins = "<p class=paragrafo >"+titulo+"</p>";
				ins += "<select style='background:beige;width:"+(i3GEO.cartograma.LARGURA - 20)+"px' onchange="+oc+" ><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option value='"+dados[i]+"'>"+dados[i]+"</option>";
				}
				ins += "</select>";
				novoel = document.createElement("div");
				novoel.className = "paragrafo";
				novoel.innerHTML = ins;
				onde.appendChild(novoel);
			};
			i3GEO.php.listaValoresParametroMedidaVariavel(id_parametro_medida,temp);
		},
		//retorna o id do parametro que e filho de um outro parametro
		retornaIdFilho:function(pai){
			var dados = i3GEO.cartograma.parametros.dados,
				n = dados.length,
				i;
			for(i=0;i<n;i++){
				if(dados[i].id_pai == pai){
					return dados[i].id_parametro_medida;
				}
			}
			return false;
		},
		//retorna o id do parametro que e pai de um outro parametro
		retornaIdPai:function(filho){
			var dados = i3GEO.cartograma.parametros.dados,
				n = dados.length,
				i;
			for(i=0;i<n;i++){
				if(dados[i].id_parametro_medida == filho){
					return dados[i].id_pai;
				}
			}
			return false;
		}
	},
	html: function(){
		var ins = '<div id="i3geoCartoVariaveisContainer" >' +
			'<div class="paragrafo" id="i3geoCartoVariaveis" >' +
			'</div>' +
			'<div class="paragrafo" id="i3geoCartoMedidasVariavel" >' +
			'</div>' +
			'<div class="paragrafo" id="i3geoCartoParametrosMedidasVariavel" >' +
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