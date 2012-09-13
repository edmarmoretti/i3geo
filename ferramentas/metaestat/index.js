/*
Title: Cartogramas estat&iacute;sticos

Arquivo:

i3geo/ferramentas/metaestat/index.js

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
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.metaestat

Gerencia os componentes do m&oacute;dulo de gera&ccedil;&atilde;o de cartogramas estat&iacute;sticos
*/
i3GEOF.metaestat = {
	/**
	 * Tipo de interface utilizada para construcao dos parametros
	 */
	INTERFACE: "flutuante",
	TOP: 50,
	LEFT: 100,
	LARGURA: 260,
	ALTURA: 300,
	//lista das camadas que foram adicionadas ao mapa
	CAMADAS: [],
	inicia: function(iddiv){
		i3GEOF.metaestat.comum.iniciaDicionario();
	},
	analise: {
		inicia: function(iddiv){
			if(!iddiv || !$i(iddiv)){
				iddiv = "i3geoCartoAnalise_corpo";
			}
			if(i3GEOF.metaestat.INTERFACE == "flutuante"){
				i3GEOF.metaestat.analise.abreJanela();
			}
			$i(iddiv).innerHTML = i3GEOF.metaestat.analise.html();
		},
		abreJanela: function(){
			var cabecalho,minimiza,imagemxy,janela;
			if (!$i("i3geoCartoAnalise")){
				cabecalho = function(){
				};
				minimiza = function(){
					i3GEO.janela.minimiza("i3geoCartoAnalise");
				};
				janela = i3GEO.janela.cria(
					i3GEOF.metaestat.LARGURA+"px",
					i3GEOF.metaestat.ALTURA+"px",
					"",
					"",
					"",
					$trad(11,i3GEOF.metaestat.dicionario),
					"i3geoCartoAnalise",
					false,
					"hd",
					cabecalho,
					minimiza
				);
				janela = janela[0];
				YAHOO.i3GEO.janela.manager.register(janela);
				janela.render();
			}
			else{
				janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoAnalise");
			}
			janela.show();
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			janela.moveTo(imagemxy[0]+(i3GEOF.metaestat.LEFT*2)+i3GEOF.metaestat.LARGURA+10,i3GEOF.metaestat.TOP);
		},
		html: function(){
			var ins = '<div id="i3geoCartoAnaliseContainer" style="margin-left:5px;">' +
				'</div>';
			return ins;
		}
	},
	classes:{
		inicia: function(iddiv){
			if(!$i("i3geoCartoComboMedidasVariavel")){
				alert("erro: i3geoCartoComboMedidasVariavel???");
				return;
			}
			if(!iddiv || !$i(iddiv)){
				iddiv = "i3geoCartoClasses_corpo";
			}
			if(i3GEOF.metaestat.INTERFACE == "flutuante"){
				i3GEOF.metaestat.classes.abreJanela();
			}
			$i(iddiv).innerHTML = i3GEOF.metaestat.classes.html();
			i3GEOF.metaestat.classes.comboTipoRep();
			i3GEOF.metaestat.classes.comboTipoClassificacao();
		},
		abreJanela: function(){
			var cabecalho,minimiza,imagemxy,janela;
			if (!$i("i3geoCartoClasses")){
				cabecalho = function(){
				};
				minimiza = function(){
					i3GEO.janela.minimiza("i3geoCartoClasses");
				};
				janela = i3GEO.janela.cria(
					i3GEOF.metaestat.LARGURA+"px",
					i3GEOF.metaestat.ALTURA+"px",
					"",
					"",
					"",
					$trad(6,i3GEOF.metaestat.dicionario),
					"i3geoCartoClasses",
					false,
					"hd",
					cabecalho,
					minimiza
				);
				janela = janela[0];
				YAHOO.i3GEO.janela.manager.register(janela);
				janela.render();
			}
			else{
				janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoClasses");
			}
			janela.show();
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			janela.moveTo(imagemxy[0]+i3GEOF.metaestat.LEFT+i3GEOF.metaestat.LARGURA+10,i3GEOF.metaestat.TOP);
		},
		html: function(){
			var ins = '<div id="i3geoCartoClassesContainer" style="margin-left:5px;">' +
				'<div class="paragrafo" id="i3geoCartoTipoRep" >' +
				'</div>' +
				'<div class="paragrafo" id="i3geoCartoTipoClassificacao" >' +
				'</div>' +
				'</div>';
			return ins;
		},
		botaoAdicionarCamada: function(){
			new YAHOO.widget.Button(
				"i3GEOcartoBotaoAdicionarCamada",
				{onclick:{fn: i3GEOF.metaestat.comum.adicionaCamada}}
			);
			$i("i3GEOcartoBotaoAdicionarCamada-button").style.width = i3GEOF.metaestat.LARGURA - 25 + "px";
		},
		comboTipoRep: function(){
			var onde = $i("i3geoCartoTipoRep"),
				ins,i,
				dados = [
				{"codigo":"polygon","nome":"pol&iacute;gonos"},
				{"codigo":"point","nome":"pontos"}
				],
				n = dados.length;
			ins = '<p style="text-align:left;"><input type="button" id="i3GEOcartoBotaoAdicionarCamada" onclick="i3GEOF.metaestat.principal.maisInfo()" value="'+$trad(7,i3GEOF.metaestat.dicionario)+'"class="paragrafo" style="cursor:pointer;color:blue" /></p>' +
				'<br><p class="paragrafo" >'+$trad(8,i3GEOF.metaestat.dicionario)+'</p>' +
				"<select id='i3geoCartoComboTipoRep' style='box-shadow:0 1px 5px gray;width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange=''>";
			for(i=0;i<n;i++){
				ins += "<option value='"+dados[i].codigo+"'>"+dados[i].nome+"</option>";
			}
			ins += "</select>";
			if(onde){
				onde.innerHTML = ins;
				i3GEOF.metaestat.classes.botaoAdicionarCamada();
			}
			return ins;
		},
		comboTipoClassificacao: function(){
			var onde = $i("i3geoCartoTipoClassificacao"),
				combo = $i("i3geoCartoComboMedidasVariavel"),
				temp = function(dados){
					var n = dados.length,
						ins = '<p class="paragrafo" >'+$trad(9,i3GEOF.metaestat.dicionario)+'</p>',
						i;
					ins += "<select id='i3geoCartoComboTipoClassificacao' style='width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange='i3GEOF.metaestat.classes.comboTipoClassificacaoOnchange(this)'><option value=''>---</option>";
					for(i=0;i<n;i++){
						ins += "<option title='"+dados[i].observacao+"' value='"+dados[i].id_classificacao+"'>"+dados[i].nome+"</option>";
					}
					ins += "</select>";
					//{"id_classificacao":"1","nome":"Pela media","id_medida_variavel":"1","observacao":""}
					if(onde){
						onde.innerHTML = ins;
					}
					return ins;
				};
			i3GEOF.metaestat.comum.aguarde(onde);
			i3GEO.php.listaClassificacaoMedida(combo.value,temp);
		},
		comboTipoClassificacaoOnchange: function(){

		}
	},
	comum:{
		iniciaDicionario: function(){
			if(typeof(i3GEOF.metaestat.dicionario) === 'undefined'){
				i3GEO.util.scriptTag(
					i3GEO.configura.locaplic+"/ferramentas/metaestat/dicionario.js",
					"i3GEOF.metaestat.principal.inicia()",
					"i3GEOF.metaestat.dicionario_script"
				);
			}
			else{
				i3GEOF.metaestat.principal.inicia();
			}
		},
		desligaCamadas: function(){
			if(i3GEOF.metaestat.CAMADAS.length > 0){
				i3GEO.arvoreDeCamadas.ligaDesligaTemas(i3GEOF.metaestat.CAMADAS.join(","),false);
			}
		},
		adicionaCamada: function(){
			//function mapfileMedidaVariavel($id_medida_variavel,$filtro="",$todasascolunas = 0,$tipolayer="polygon",$titulolayer="",$id_classificacao="",$agruparpor=""){
			var v = i3GEOF.metaestat.comum.verificaParametros(),
				temp = function(retorno){
					if(i3GEO.arvoreDeCamadas.pegaTema(retorno.layer) == ""){
						i3GEOF.metaestat.comum.desligaCamadas();
						i3GEO.php.adtema(i3GEO.atualiza,retorno.mapfile);
						i3GEOF.metaestat.CAMADAS.push(retorno.layer);
					}
				};
			if(v != true){
				alert("erro: "+v);
			}
			i3GEO.php.mapfileMedidaVariavel(
				temp,
				$i("i3geoCartoComboMedidasVariavel").value,
				i3GEOF.metaestat.comum.defineFiltro(),
				0,
				$i("i3geoCartoComboTipoRep").value,
				i3GEOF.metaestat.comum.defineTitulo(),
				$i("i3geoCartoComboTipoClassificacao").value,
				i3GEOF.metaestat.comum.defineAgruparPor()
			);
		},
		defineTitulo: function(){
			//se nao tiver parametros, filtro e vazio
			if(i3GEOF.metaestat.parametros.dados.length == 0){
				return "";
			}
			//se tiver parametro e todos estiverem vazios, aborta
			var i,n,c,titulo,
				t=[],
				dados = i3GEOF.metaestat.parametros.dados;
			titulo = $i("i3geoCartoComboVariavel").options[$i("i3geoCartoComboVariavel").selectedIndex].label +" - "+
				$i("i3geoCartoComboMedidasVariavel").options[$i("i3geoCartoComboMedidasVariavel").selectedIndex].label +" - "+
				$i("i3geoCartoComboTipoRep").options[$i("i3geoCartoComboTipoRep").selectedIndex].label +" - "+
				$i("i3geoCartoComboTipoClassificacao").options[$i("i3geoCartoComboTipoClassificacao").selectedIndex].label;
			n = dados.length;
			for(i=0;i<n;i++){
				c = $i("comboparametro_"+dados[i].id_parametro_medida+"_"+dados[i].id_pai);
				if(c && c.value != ""){
					t.push(dados[i].nome+" = "+c.value);
				}
			}
			if(t.length > 0){
				return titulo+" - "+t.join(", ");
			}
			else{
				return titulo;
			}
		},
		defineFiltro: function(){
			//se nao tiver parametros, filtro e vazio
			if(i3GEOF.metaestat.parametros.dados.length == 0){
				return "";
			}
			//se tiver parametro e todos estiverem vazios, aborta
			var i,n,c,
				t=[],
				dados = i3GEOF.metaestat.parametros.dados;
			n = dados.length;
			for(i=0;i<n;i++){
				c = $i("comboparametro_"+dados[i].id_parametro_medida+"_"+dados[i].id_pai);
				if(c && c.value != ""){
					t.push(dados[i].coluna+"="+c.value);
				}
			}
			if(t.length > 0){
				return t.join(" and ");
			}
			else{
				return "";
			}
		},
		defineAgruparPor: function(){
			//se nao tiver parametros, filtro e vazio
			if(i3GEOF.metaestat.parametros.dados.length == 0){
				return "";
			}
			//se tiver parametro e todos estiverem vazios, aborta
			var i,n,c,
				t=[],
				dados = i3GEOF.metaestat.parametros.dados;
			n = dados.length;
			for(i=0;i<n;i++){
				c = $i("comboparametro_"+dados[i].id_parametro_medida+"_"+dados[i].id_pai);
				if(c && c.value != ""){
					t.push(dados[i].coluna);
				}
			}
			if(t.length > 0){
				return t.join(",");
			}
			else{
				return "";
			}
		},
		verificaParametros: function(){
			var ok = true,
				combos = ["i3geoCartoComboVariavel","i3geoCartoComboMedidasVariavel","i3geoCartoComboTipoRep","i3geoCartoComboTipoClassificacao"],
				n = combos.length,
				i,temp;
			for(i=0;i<n;i++){
				temp = $i(combos[i]);
				if(!temp){
					return combos[i];
				}
				if(temp.value == ""){
					return combos[i];
				}
			}
			return ok;
		},
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
		}
	},
	editor: {
		inicia: function(){
			if(typeof(i3GEOF.metaestat.dicionario1) === 'undefined'){
				i3GEO.util.scriptTag(
					i3GEO.configura.locaplic+"/ferramentas/metaestat/dicionario1.js",
					"i3GEOF.metaestat.editor.ativa()",
					"i3GEOF.metaestat.dicionario1_script"
				);
			}
			else{
				i3GEOF.metaestat.editor.ativa();
			}
		},
		ativa: function(iddiv){
			if(!iddiv){
				iddiv = "i3geoCartoEditor_corpo";
			}
			if(i3GEOF.metaestat.INTERFACE == "flutuante"){
				i3GEOF.metaestat.editor.abreJanela();
			}
			$i(iddiv).innerHTML = i3GEOF.metaestat.editor.html();
			i3GEOF.metaestat.editor.t0();
		},
		abreJanela: function(){
			var cabecalho,minimiza,imagemxy,janela;
			if (!$i("i3geoCartoEditor")){
				cabecalho = function(){};
				minimiza = function(){
					i3GEO.janela.minimiza("i3geoCartoEditor");
				};
				janela = i3GEO.janela.cria(
					"450px",
					"300px",
					"",
					"",
					"",
					$trad(1,i3GEOF.metaestat.dicionario1),
					"i3geoCartoEditor",
					false,
					"hd",
					cabecalho,
					minimiza
				);
				janela = janela[0];
				YAHOO.i3GEO.janela.manager.register(janela);
				janela.render();
			}
			else{
				janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoEditor");
			}
			janela.show();
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			janela.moveTo(imagemxy[0]+i3GEOF.metaestat.LEFT+i3GEOF.metaestat.LARGURA+20,i3GEOF.metaestat.TOP+20);
		},
		html: function(){
			var ins = '';
			ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;margin-left:5px;" id="i3GEOFmetaestatEditor" >';
			ins +=	'</div>';
			return ins;
		},
		criaVariavel: function(){
			if(window.confirm($trad("x58"))){
				var funcao = function(variavel){
					var temp = function(dados){
						$i("i3geoCartoComboVariavelEditor").parentNode.innerHTML = i3GEOF.metaestat.principal.comboVariaveis(dados,"i3geoCartoComboVariavelEditor","");
						$i("i3geoCartoComboVariavelEditor").value = variavel.codigo_variavel;
					};
					i3GEO.php.listaVariavel(temp);
				},
				nome = $i("i3GEOFmetaestatEditorNovaVariavel").value,
				p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=alteraVariavel&nome="+nome;
				if(nome == ""){
					return;
				}
				i3GEOF.metaestat.comum.aguarde($i("i3geoCartoComboVariavelEditor"));
				i3GEO.util.ajaxGet(p,funcao);
			}
		},
		criaMedidaVariavel: function(){

		},
		t0: function(){
			var ins = "<p class='paragrafo' >" + $trad(2,i3GEOF.metaestat.dicionario1) +
				"<br><br><input id=i3GEOFmetaestatEditorBotao1 type='button' value='"+$trad(3,i3GEOF.metaestat.dicionario1)+"' />" +
				"&nbsp<input id=i3GEOFmetaestatEditorBotao2 type='button' value='"+$trad(4,i3GEOF.metaestat.dicionario1)+"' />";
			i3GEO.util.proximoAnterior("","i3GEOF.metaestat.editor.t1()",ins,"i3GEOF.metaestat.editor.t0","i3GEOFmetaestatEditor");
			new YAHOO.widget.Button(
				"i3GEOFmetaestatEditorBotao1",
				{onclick:{fn: function(){window.open(i3GEO.configura.locaplic+"/admin/html/estat_variavel.html");}}}
			);
			//TODO editor grafico
			new YAHOO.widget.Button(
				"i3GEOFmetaestatEditorBotao2",
				{onclick:{fn: function(){alert("Oi");}}}
			);
		},
		t1: function(){
			var temp = function(dados){
				var ins = "<p class='paragrafo' >" + $trad(1,i3GEOF.metaestat.dicionario) + "<br><br>" +
					"<span>" + i3GEOF.metaestat.principal.comboVariaveis(dados,"i3geoCartoComboVariavelEditor","") + "</span>" +
					"<p class='paragrafo' >" + $trad(5,i3GEOF.metaestat.dicionario1) + "<br><br>" +
					"<input type=text class='digitar' style='width:240px;' id='i3GEOFmetaestatEditorNovaVariavel' />" +
					"<p class='paragrafo'><input id=i3GEOFmetaestatEditorBotao3 type='button' value='"+$trad("p14")+"' />";
				i3GEO.util.proximoAnterior("i3GEOF.metaestat.editor.t0()","i3GEOF.metaestat.editor.t2()",ins,"i3GEOF.metaestat.editor.t1","i3GEOFmetaestatEditor",true);
				new YAHOO.widget.Button(
					"i3GEOFmetaestatEditorBotao3",
					{onclick:{fn: i3GEOF.metaestat.editor.criaVariavel}}
				);
			};
			i3GEO.php.listaVariavel(temp);
		},
		t2: function(){
			var temp = function(dados){
				var ins = "<p class='paragrafo' >" + $trad(2,i3GEOF.metaestat.dicionario) + "<br><br>" +
					"<span>" + i3GEOF.metaestat.principal.comboMedidasVariavel(dados,"i3geoCartoComboMedidaVariavelEditor","") + "</span>" +
					"<p class='paragrafo' >" + $trad(5,i3GEOF.metaestat.dicionario1) + "<br><br>" +
					"<input type=text class='digitar' style='width:240px;' id='i3GEOFmetaestatEditorNovaMedidaVariavel' />" +
					"<p class='paragrafo'><input id=i3GEOFmetaestatEditorBotao4 type='button' value='"+$trad("p14")+"' />";
				i3GEO.util.proximoAnterior("i3GEOF.metaestat.editor.t2()","i3GEOF.metaestat.editor.t2()",ins,"i3GEOF.metaestat.editor.t3","i3GEOFmetaestatEditor",true);
				new YAHOO.widget.Button(
					"i3GEOFmetaestatEditorBotao4",
					{onclick:{fn: i3GEOF.metaestat.editor.criaMedidaVariavel}}
				);
			},
			codigo_variavel = $i("i3geoCartoComboVariavelEditor").value;
			if(codigo_variavel == ""){
				alert($trad(4,i3GEOF.metaestat.dicionario));
				i3GEOF.metaestat.editor.t1();
				return;
			}
			i3GEO.php.listaMedidaVariavel(codigo_variavel,temp);
		}
	},
	parametros: {
		//guarda a lista de parametros
		dados: [],
		//obtem a lista com os parametros da medida
		//cria os combos para os parametros que sao pai de todos
		lista: function(id_medida_variavel){
			i3GEOF.metaestat.comum.aguarde($i("i3geoCartoParametrosMedidasVariavel"));
			var temp = function(dados){
					i3GEOF.metaestat.parametros.dados = dados;
					i3GEOF.metaestat.parametros.combos("0");
					i3GEOF.metaestat.comum.aguarde($i("i3geoCartoParametrosMedidasVariavel"));
				};
			i3GEO.php.listaParametrosMedidaVariavel(id_medida_variavel,temp);
		},
		//cria um combo para escolher os valores de um parametro
		combos: function(nivel){
			var dados = i3GEOF.metaestat.parametros.dados,
				n = dados.length,
				onde = $i("i3geoCartoParametrosMedidasVariavel"),
				idpar,idcombo,i,novoel,teste;
			//cria o combo para o parametro cujo id_pai for do nivel escolhido
			for(i=0;i<n;i++){
				if(dados[i].id_pai == nivel){
					idpar = "parametro_"+dados[i].id_parametro_medida;
					idcombo = "parametro_"+dados[i].id_parametro_medida+"_"+nivel;
					teste = i3GEOF.metaestat.parametros.retornaIdPai(dados[i].id_parametro_medida);
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
						i3GEOF.metaestat.comum.aguarde(onde);
						novoel = document.createElement("div");
						novoel.id = idcombo;
						novoel.className = "paragrafo";
						onde.appendChild(novoel);
						i3GEOF.metaestat.parametros.valoresCombo(dados[i].id_parametro_medida,dados[i].nome,nivel,onde,idcombo);
					}
				}
			}
		},
		valoresCombo: function(id_parametro_medida,titulo,nivel,onde,idcombo){
			var temp = function(dados){
				var n = dados.length,
					ins = "",
					oc = "'i3GEOF.metaestat.parametros.antesCombo();i3GEOF.metaestat.parametros.combos(\""+id_parametro_medida+"\")'",
					filho = i3GEOF.metaestat.parametros.retornaIdFilho(id_parametro_medida),
					i,novoel;
				if(filho == false){
					oc = "";
				}
				ins = "<p class=paragrafo >"+titulo+"</p>";
				ins += "<select id='combo"+idcombo+"' style='background:beige;width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange="+oc+" ><option value=''>---</option>";
				for(i=0;i<n;i++){
					ins += "<option value='"+dados[i]+"'>"+dados[i]+"</option>";
				}
				ins += "</select>";
				novoel = document.createElement("div");
				novoel.className = "paragrafo";
				novoel.innerHTML = ins;
				i3GEOF.metaestat.comum.aguarde(onde);
				onde.appendChild(novoel);
			};
			i3GEO.php.listaValoresParametroMedidaVariavel(id_parametro_medida,temp);
		},
		antesCombo: function(){
			if(!$i("i3geoCartoClasses_corpo")){
				i3GEOF.metaestat.classes.inicia();
			}
		},
		//retorna o id do parametro que e filho de um outro parametro
		retornaIdFilho:function(pai){
			var dados = i3GEOF.metaestat.parametros.dados,
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
			var dados = i3GEOF.metaestat.parametros.dados,
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
	principal: {
		inicia: function(iddiv){
			if(!iddiv || !$i(iddiv)){
				iddiv = "i3geoCartoParametros_corpo";
			}
			if(i3GEOF.metaestat.INTERFACE == "flutuante"){
				i3GEOF.metaestat.principal.abreJanela();
			}
			$i(iddiv).innerHTML = i3GEOF.metaestat.principal.html();
			i3GEOF.metaestat.principal.opcoesVariaveis();
		},
		abreJanela: function(){
			var cabecalho,minimiza,imagemxy,janela;
			if (!$i("i3geoCartoParametros")){
				cabecalho = function(){
				};
				minimiza = function(){
					i3GEO.janela.minimiza("i3geoCartoParametros");
				};
				janela = i3GEO.janela.cria(
					i3GEOF.metaestat.LARGURA+"px",
					i3GEOF.metaestat.ALTURA+"px",
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
			}
			else{
				janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoParametros");
			}
			janela.show();
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			janela.moveTo(imagemxy[0]+i3GEOF.metaestat.LEFT,i3GEOF.metaestat.TOP);
		},
		html: function(){
			var ins = '<div id="i3geoCartoVariaveisContainer" style="margin-left:5px;">' +
				'<div class="paragrafo" id="i3geoCartoVariaveis" >' +
				'</div>' +
				'<div class="paragrafo" id="i3geoCartoMedidasVariavel" >' +
				'</div>' +
				'<div class="paragrafo" id="i3geoCartoParametrosMedidasVariavel" >' +
				'</div>' +
				'</div>';
			return ins;
		},
		maisInfo: function(){
			var temp = "",
				v = $i("i3geoCartoComboVariavel");
			if(!v || v.value === ""){
				alert($trad(4,i3GEOF.metaestat.dicionario));
			}
			else{
				var cabecalho,minimiza,janela;
				if (!$i("i3geoCartoMaisInfo")){
					cabecalho = function(){
					};
					minimiza = function(){
						i3GEO.janela.minimiza("i3geoCartoMaisInfo");
					};
					janela = i3GEO.janela.cria(
						"400px",
						"300px",
						"",
						"",
						"",
						$trad(5,i3GEOF.metaestat.dicionario),
						"i3geoCartoMaisInfo",
						false,
						"hd",
						cabecalho,
						minimiza
					);
					janela = janela[0];
					YAHOO.i3GEO.janela.manager.register(janela);
					janela.render();
					//YAHOO.util.Event.addListener(janela.close, "click", i3GEOF.metaestat.fechaJanelaParametros);
				}
				else{
					janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoMaisInfo");
				}
				janela.setBody(i3GEOF.metaestat.comum.aguarde());
				temp = function(retorno){
					janela.setBody(retorno);
					janela.show();
					//imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
					//janela.moveTo(imagemxy[0]+i3GEOF.metaestat.LEFT,imagemxy[1]+i3GEOF.metaestat.TOP);
				};
				i3GEO.php.relatorioVariavel(v.value,temp);
			}
		},
		comboVariaveis: function(dados,idcombo,stronchange){
			var ins,i,n = dados.length;
			ins = "<select id='"+idcombo+"' style='box-shadow:0 1px 5px gray;width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange='"+stronchange+"(this)'><option value=''>---</option>";
			for(i=0;i<n;i++){
				ins += "<option title='"+dados[i].descricao+"' value='"+dados[i].codigo_variavel+"'>"+dados[i].nome+"</option>";
			}
			ins += "</select>";
			return ins;
		},
		botaoInfo: function(){
			new YAHOO.widget.Button(
				"i3GEOcartoBotaoInfo",
				{onclick:{fn: i3GEOF.metaestat.principal.maisInfo}}
			);
			$i("i3GEOcartoBotaoInfo-button").style.width = (i3GEOF.metaestat.LARGURA / 2) - 15 + "px";
		},
		botaoJanelaEditor: function(){
			new YAHOO.widget.Button(
				"i3GEOcartoBotaoEditor",
				{onclick:{fn: i3GEOF.metaestat.editor.inicia}}
			);
			$i("i3GEOcartoBotaoEditor-button").style.width = (i3GEOF.metaestat.LARGURA / 2) - 15 + "px";
		},
		botaoJanelaClasses: function(){
			new YAHOO.widget.Button(
				"i3GEOcartoBotaoClasses",
				{onclick:{fn: i3GEOF.metaestat.classes.inicia}}
			);
			$i("i3GEOcartoBotaoClasses-button").style.width = (i3GEOF.metaestat.LARGURA / 2) - 15 + "px";
		},
		botaoJanelaAnalise: function(){
			new YAHOO.widget.Button(
				"i3GEOcartoBotaoAnalise",
				{onclick:{fn: i3GEOF.metaestat.analise.inicia}}
			);
			$i("i3GEOcartoBotaoAnalise-button").style.width = (i3GEOF.metaestat.LARGURA / 2) - 15 + "px";
		},
		opcoesVariaveis: function(){
			var onde = $i("i3geoCartoVariaveis"),
				temp = function(dados){
					var ins = '';
					//botao para obter mais info
					ins = '<p style="text-align:left;"><input type="button" id="i3GEOcartoBotaoInfo" value="'+$trad(3,i3GEOF.metaestat.dicionario)+'"class="paragrafo" style="width:200px;cursor:pointer;color:blue" />' +
						'<input type="button" id="i3GEOcartoBotaoEditor" value="'+$trad(12,i3GEOF.metaestat.dicionario)+'"class="paragrafo" style="width:200px;cursor:pointer;color:blue" /></p>' +
						'<br><p style="text-align:left;"><input type="button" id="i3GEOcartoBotaoClasses" value="'+$trad(10,i3GEOF.metaestat.dicionario)+'"class="paragrafo" style="width:200px;cursor:pointer;color:blue" />' +
						'<input type="button" id="i3GEOcartoBotaoAnalise" value="'+$trad(11,i3GEOF.metaestat.dicionario)+'"class="paragrafo" style="width:200px;cursor:pointer;color:blue" /></p>' +
						'<br><p class="paragrafo" >'+$trad(1,i3GEOF.metaestat.dicionario)+'</p>';
					ins += i3GEOF.metaestat.principal.comboVariaveis(dados,"i3geoCartoComboVariavel","i3GEOF.metaestat.principal.comboVariaveisOnchange");
					if(onde){
						onde.innerHTML = ins;
						i3GEOF.metaestat.principal.botaoInfo();
						i3GEOF.metaestat.principal.botaoJanelaEditor();
						i3GEOF.metaestat.principal.botaoJanelaClasses();
						i3GEOF.metaestat.principal.botaoJanelaAnalise();
					}
					return ins;
				};
			i3GEOF.metaestat.comum.aguarde(onde);
			i3GEO.php.listaVariavel(temp);
		},
		comboVariaveisOnchange: function(combo){
			if(combo.value != ""){
				i3GEOF.metaestat.principal.opcoesMedidasVariavel(combo.value);
			}
			else{
				$i("i3geoCartoMedidasVariavel").innerHTML = "";
				$i("i3geoCartoParametrosMedidasVariavel").innerHTML = "";
			}
		},
		comboMedidasVariavel: function(dados,idcombo,stronchange){
			var n = dados.length,
				ins = '',
				i;
			ins += "<select id='"+idcombo+"' style='width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange='"+stronchange+"(this)'><option value=''>---</option>";
			for(i=0;i<n;i++){
				ins += "<option value='"+dados[i].id_medida_variavel+"'>"+dados[i].nomemedida+"</option>";
			}
			ins += "</select>";
			return ins;
		},
		opcoesMedidasVariavel: function(codigo_variavel){
			var onde = $i("i3geoCartoMedidasVariavel"),
				temp = function(dados){
					var ins = '<p class="paragrafo" >'+$trad(2,i3GEOF.metaestat.dicionario)+'</p>';
					ins += i3GEOF.metaestat.principal.comboMedidasVariavel(dados,"i3geoCartoComboMedidasVariavel","i3GEOF.metaestat.principal.comboMedidaVariavelOnchange");
					if(onde){
						onde.innerHTML = ins;
					}
					return ins;
				};
			i3GEOF.metaestat.comum.aguarde(onde);
			i3GEO.php.listaMedidaVariavel(codigo_variavel,temp);
		},
		comboMedidaVariavelOnchange: function(combo){
			i3GEOF.metaestat.classes.inicia();
			if(combo.value != ""){
				i3GEOF.metaestat.parametros.lista(combo.value);
			}
			else{
				$i("i3geoCartoParametrosMedidasVariavel").innerHTML = "";
			}
		}
	}
};