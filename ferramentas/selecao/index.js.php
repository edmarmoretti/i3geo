<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Seleção

Operações de seleção de elementos no mapa.

Veja:

<i3GEO.mapa.dialogo.selecao>

Arquivo:

i3geo/ferramentas/selecao/index.js.php

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
Classe: i3GEOF.selecao
*/
i3GEOF.selecao = {
	/*
	Variavel: aguarde
	
	Estilo do objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
	*/
	aguarde: "",
	/*
	Function: inicia
	
	Inicia a ferramenta. É chamado por criaJanelaFlutuante
	
	Parametro:
	
	iddiv {String} - id do div que receberá o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		var i,n,ics;
		try{
			$i(iddiv).innerHTML += i3GEOF.selecao.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia1","i3GEOselecaoguia");
			//eventos das guias
			$i("i3GEOselecaoguia1").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia1","i3GEOselecaoguia");
			};
			$i("i3GEOselecaoguia2").onclick = function(){
				if($i("i3GEOselecaotemasLigados").value === "")
				{alert("Selecione um tema primeiro");return;}
				i3GEO.mapa.ativaTema($i("i3GEOselecaotemasLigados").value);
				i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia2","i3GEOselecaoguia");
				try
				{$i("i3GEOselecaoparametros").innerHTML = "";}
				catch(e){}
				i3GEOF.selecao.adicionaLinhaFiltro();
			};
			$i("i3GEOselecaoguia3").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia3","i3GEOselecaoguia");
				i3GEO.util.comboTemas(
					"i3GEOselecaoTemaoverlay",
					function(retorno){
				 		$i("i3GEOselecaooverlay").innerHTML = retorno.dados;
					},
					"i3GEOselecaooverlay",
					"",
					false,
					"naolinearSelecionados"
				);
			};
			i3GEOF.selecao.criaCombosTemas();

			i3GEO.util.mensagemAjuda("i3GEOselecaomen1",$i("i3GEOselecaomen1").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOselecaomen2",$i("i3GEOselecaomen2").innerHTML);
			new YAHOO.widget.Button(
				"i3GEOselecaobotao1",
				{onclick:{fn: i3GEOF.selecao.atributo}}
			);
			new YAHOO.widget.Button(
				"i3GEOselecaobotao2",
				{onclick:{fn: i3GEOF.selecao.aplicaselecaoTema}}
			);
			i3GEOF.selecao.ativaFoco();
			ics = $i("i3GEOselecaoguia1obj").getElementsByTagName("button");
			n = ics.length;
			for(i=0;i<n;i++){
				ics[i].style.backgroundColor = "white";
				ics[i].className = "iconeGuiaMovel";
				ics[i].onmouseout = function(){this.className = "iconeGuiaMovel iconeGuiaMovelMouseOut";};
				ics[i].onmouseover = function(){this.className = "iconeGuiaMovel iconeGuiaMovelMouseOver";};
			}			
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
		var ins = '' +
		'<div id=i3GEOselecaoguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">' +
		'	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">' +
		'		<li><a href="#ancora"><em><div id="i3GEOselecaoguia1" style="text-align:center;left:0px;" >Mapa</div></em></a></li>' +
		'		<li><a href="#ancora"><em><div id="i3GEOselecaoguia2" style="text-align:center;left:0px;" >Atributos</div></em></a></li>' +
		'		<li><a href="#ancora"><em><div id="i3GEOselecaoguia3" style="text-align:center;left:0px;" >Cruzamento</div></em></a></li>' +
		'	</ul>' +
		'</div><br>' +
		'<div class=guiaobj id="i3GEOselecaoguia1obj" style="left:1px;display:none;top:-5px">' +
		'	<p class=paragrafo ><button title="Clique no mapa para selecionar" value="i3GEOselecaopt" onclick="i3GEOF.selecao.tiposel(this)"><img id=i3GEOselecaopt src="'+i3GEO.configura.locaplic+'/imagens/gisicons/select-one.png" /></button>';
		if(i3GEO.Interface.ATUAL != "googlemaps" && i3GEO.Interface.ATUAL != "googleearth")
		{ins += '	<button title="Desenhe um poligono no mapa para selecionar" onclick="i3GEOF.selecao.tiposel(this)" value="i3GEOselecaopoli"><img id=i3GEOselecaopoli src="'+i3GEO.configura.locaplic+'/imagens/gisicons/select-polygon.png" /></button>'}
		ins += '	<button title="Seleciona o que estiver visivel no mapa" onclick="i3GEOF.selecao.tiposel(this)" value="i3GEOselecaoext" ><img id=i3GEOselecaoext src="'+i3GEO.configura.locaplic+'/imagens/gisicons/map.png" /></button>';
		if(i3GEO.Interface.ATUAL != "googlemaps" && i3GEO.Interface.ATUAL != "googleearth")
		{ins += '	<button title="Desenhe um retangulo no mapa para selecionar" onclick="i3GEOF.selecao.tiposel(this)" value="i3GEOselecaobox" ><img id=i3GEOselecaobox src="'+i3GEO.configura.locaplic+'/imagens/gisicons/select-rectangle.png" /></button>';}
		ins += '	<button title="Inverte a selecao" onclick="i3GEOF.selecao.operacao(\'inverte\')"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/selection-invert.png" /></button>' +
		'	<button title="Limpa a selecao" onclick="i3GEOF.selecao.operacao(\'limpa\')"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/selected-delete.png" /></button>' +
		'	<button title="Salva a selecao como um novo tema" onclick="i3GEOF.selecao.criatema()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/save1.png" /></button>' +
		'	<button title="Grafico" onclick="i3GEOF.selecao.grafico()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/layer-vector-chart-add.png" /></button>' +
		'	<button title="Perfil"  onclick="i3GEOF.selecao.graficoPerfil()"><img src="'+i3GEO.configura.locaplic+'/imagens/gisicons/grafico-perfil.png" /></button>' +
		'	<div style=margin-left:8px;text-align:left;  >' +
		'		<p class=paragrafo >' +
		'		<select title="Tipo de operacao" style=position:relative;top:6px; id=i3GEOselecaotipoOperacao >' +
		'		<option value="adiciona" >Adicionar à seleção</option>' +
		'		<option value="novo" >Nova seleção</option>' +		
		'		<option value="retira" >Retirar da seleção</option>' +
		'		</select>' +
		'		<span id=i3GEOselecaoNsel style="position:relative;top:5px;" >0</span></p>' +
		'		<p class=paragrafo >Temas:<div id=i3GEOselecaoComboTemas style=text-align:left; ></div>' +
		'		<p class=paragrafo >Dist&acirc;ncia utilizada ao selecionar por ponto (em metros):' +
		$inputText("","","i3GEOselecaotoleranciapt","",3,"0") +
		'		</p><div id=i3GEOselecaomen1 style=left:0px;width:100%; >' +
		'		<p class=paragrafo >Escolha o(s) tema(s) alvo(s) e o tipo de opera&ccedil;&atilde;o. ' +
		'		Depois, clique no mapa sobre o elemento desejado.</p>' +
		'		</div> '+
		'	</div>' +
		'</div>' +
		'<div class=guiaobj id="i3GEOselecaoguia2obj" style="left:1px;display:none;">' +
		'	<p class=paragrafo ><input id=i3GEOselecaobotao1 size=18  type="button" value="Selecionar" /></p>'+
		'	<table summary="" id="i3GEOselecaoparametros" style="width:330px" >'+
		'		<tbody><tr><td></td><td></td>'+
		'			<td style=background-color:yellow >Item</td>'+
		'			<td style=background-color:yellow >Operador</td>'+
		'			<td style=background-color:yellow >Valor</td>'+
		'			<td style=background-color:yellow ></td>'+
		'			<td style=background-color:yellow >Conector</td>'+
		'		</tr>'+
		'		<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr></tbody>'+
		'	</table>'+
		'	<div id=i3GEOselecaoresultado style="position:relative;top:5px;left:0px">'+
		'	</div>'+
		'	<div id=i3GEOselecaovalores style="position:relative;top:5px;left:0px">'+
		'	</div>'+
		'	<div id=i3GEOselecaomen2 style=top:15px;left:0px; ><p class=paragrafo >Na op&ccedil;&atilde;o IN separe os valores com v&iacute;rgula.</div>'+
		'</div> '+
		'<div class=guiaobj id="i3GEOselecaoguia3obj" style="left:1px;display:none;">' +
		'	<p class=paragrafo >Tema que ser&aacute; utilizado para selecionar o tema definido na guia Mapa (esse tema deve ser do tipo pontual ou poligonal e deve possuir elementos j&aacute; selecionados):</p>'+
		'	<div id="i3GEOselecaooverlay" style="text-align:left;left:0px">' +
		'	</div>' +
		'	<br><p class=paragrafo ><input id=i3GEOselecaobotao2 size=10 type=button value="Aplicar">' +
		'</div>';
		return ins;		
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.selecao.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.selecao");
		};
		titulo = "Seleção <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=48a' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"470px",
			"200px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.selecao",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.selecao.aguarde = $i("i3GEOF.selecao_imagemCabecalho").style;
		$i("i3GEOF.selecao_corpo").style.backgroundColor = "white";
		i3GEOF.selecao.inicia(divid);

		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.selecao.criaCombosTemas()") < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.selecao.criaCombosTemas()");}		
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.selecao.clique()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.selecao.clique()");}
		
		temp = function(){
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.selecao.criaCombosTemas()") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.selecao.criaCombosTemas()");}
			i3GEO.barraDeBotoes.ativaPadrao();
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.selecao.clique()");
			try{
				i3GEO.desenho.richdraw.fecha();
			}
			catch(e){}
			if($i("pontosins")){document.body.removeChild($i("pontosins"));}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"crosshair",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
	},
	/*
	Function: ativaFoco
	
	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"crosshair",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
		i3GEO.barraDeBotoes.ativaIcone("selecao");
		i3GEOF.selecao.pegaTemasSel();
		g_tipoacao='selecao';
		g_operacao='';
		i3GEOF.selecao.mudaicone();
		var i = $i("i3GEOF.selecao_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
		if(i3GEO.Interface.ATUAL == "googlemaps")
		{i3GEO.Interface.googlemaps.recalcPar();}
		if(i3GEO.Interface.ATUAL == "googleearth")
		{i3GEO.Interface.googleearth.recalcPar();}		
	},
	/*
	Function: criaCombosTemas
	
	Cria os combos de seleção de temas
	*/
	criaCombosTemas: function(){
		i3GEO.util.comboTemas(
			"i3GEOselecaotemasLigados",
			function(retorno){
				var nsel,temp;
				temp = $i("i3GEOselecaoComboTemas");
				if(!temp){return;}
				temp.innerHTML = retorno.dados;
				$i("i3GEOselecaotemasLigados").value = i3GEO.temaAtivo;
				//verifica qts elementos selecionados
				if(i3GEO.temaAtivo != ""){
					nsel = i3GEO.arvoreDeCamadas.pegaTema(i3GEO.temaAtivo);
					$i("i3GEOselecaoNsel").innerHTML = "Selecionados: "+(nsel.nsel);
				}
				$i("i3GEOselecaotemasLigados").onchange = function(){i3GEOF.selecao.pegaTemasSel();};
			},
			"i3GEOselecaoComboTemas",
			"",
			true,
			"ligados"
		);	
	},
	/*
	Function: mudaicone
	
	Altera as bordas dos ícones
	*/
	mudaicone: function(){
		$i("i3GEOselecaopt").parentNode.style.backgroundColor = "#F5F5F5";
		$i("i3GEOselecaoext").parentNode.style.backgroundColor = "#F5F5F5";
		if($i("i3GEOselecaobox"))
		{$i("i3GEOselecaobox").parentNode.style.backgroundColor = "#F5F5F5";}
		if($i("i3GEOselecaopoli"))
		{$i("i3GEOselecaopoli").parentNode.style.backgroundColor = "#F5F5F5";}
		try{i3GEO.desenho.richdraw.fecha();}
		catch(e){}
	},
	/*
	Function: pegaTemasSel
	
	Pega a lista de temas escolhidos pelo usuário
	*/
	pegaTemasSel: function(){
		var selObj = $i("i3GEOselecaotemasLigados"),
			selectedArray = [],
			i,
			nsel;
		for (i=0; i<selObj.options.length; i++) {
			if (selObj.options[i].selected) {
				selectedArray.push(selObj.options[i].value);
			}
		}
		i3GEO.mapa.ativaTema(selectedArray[0]);
		if(i3GEO.temaAtivo != ""){
			nsel = i3GEO.arvoreDeCamadas.pegaTema(i3GEO.temaAtivo);
			$i("i3GEOselecaoNsel").innerHTML = "Selecionados: "+(nsel.nsel);
		}		
		return selectedArray.toString();
	},
	/*
	Function: operacao
	
	Executa uma operação sobre o conjunto de elementos selecionados
	
	Veja:
	
	<i3GEO.php.selecaopt>
	
	Parametro:
	
	tipo {String} - tipo de operação inverte|limpa
	*/
	operacao: function(tipo){
		if(i3GEOF.selecao.aguarde.visibility === "visible")
		{return;}
	 	try{
			if($i("i3GEOselecaotemasLigados").value === "")
			{alert("Escolha um tema");return;}
			i3GEOF.selecao.aguarde.visibility = "visible";
			i3GEO.mapa.ativaTema($i("i3GEOselecaotemasLigados").value);
			var tema = i3GEO.temaAtivo,
				fim = function(retorno){
					var nsel;
					i3GEOF.selecao.aguarde.visibility = "hidden";
					i3GEO.Interface.atualizaTema(retorno,tema);
					//verifica qts elementos selecionados
					nsel = i3GEO.arvoreDeCamadas.pegaTema(tema,retorno.data.temas);
					$i("i3GEOselecaoNsel").innerHTML = "Selecionados: "+(nsel.nsel);
				};
			i3GEO.php.selecaopt(fim,tema,"",tipo,0);
		}
		catch(e){alert("Erro: "+e);i3GEOF.selecao.aguarde.visibility = "hidden";}
	},
	/*
	Function: tiposel
	
	Executa um tipo de seleção interativa
	
	Parameter:
	
	obj {objeto dom) - objeto que foi clicado para disparar a operação. O valor identifica o tipo de operação
	*/
	tiposel: function(obj){
		if(i3GEOF.selecao.aguarde.visibility === "visible")
		{return;}
		try{
			if($i("i3GEOselecaotemasLigados").value === "")
			{alert("Escolha um tema");return;}
			//window.parent.i3GEO.eventos.MOUSEDOWN.remove("i3GEO.selecao.box.inicia()")
			//$i("parapoli").style.display = "none";
			var fim = function(retorno){
					var nsel;
					i3GEOF.selecao.aguarde.visibility = "hidden";
					i3GEO.Interface.atualizaTema(retorno,tema);
					nsel = i3GEO.arvoreDeCamadas.pegaTema(tema,retorno.data.temas);
					$i("i3GEOselecaoNsel").innerHTML = "Selecionados: "+(nsel.nsel);					
				},
				tema = i3GEOF.selecao.pegaTemasSel();
			if (obj.value == "i3GEOselecaoext"){
				i3GEOF.selecao.aguarde.visibility = "visible";
				i3GEO.php.selecaobox(fim,tema,$i("i3GEOselecaotipoOperacao").value,i3GEO.parametros.mapexten);
			}
			if (obj.value == "i3GEOselecaobox"){
				i3GEOF.selecao.mudaicone();
				obj.style.backgroundColor = "#cedff2";
				g_tipoacao = "selecaobox";
				i3GEOF.selecao.box.criaBox();
				if(i3GEO.eventos.MOUSEDOWN.toString().search("i3GEOF.selecao.box.inicia()") < 0)
				{i3GEO.eventos.MOUSEDOWN.push("i3GEOF.selecao.box.inicia()");}
			}
			if (obj.value == "i3GEOselecaopt"){
				i3GEOF.selecao.mudaicone();
				obj.style.backgroundColor = "#cedff2";
				g_tipoacao = "selecao";
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.selecao.clique()") < 0)
				{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.selecao.clique()");}	
			}
			if (obj.value == "i3GEOselecaopoli"){
				i3GEOF.selecao.mudaicone();
				obj.style.backgroundColor = "#cedff2";
				g_tipoacao = "selecaopoli";
				i3GEOF.selecao.poligono.inicia()
			}
		}
		catch(e){alert("Erro: "+e);i3GEOF.selecao.aguarde.visibility = "hidden";}
	},
	/*
	Classe: i3GEOF.selecao.box
	
	Controla o desenho do box para a seleção e executa a operação de seleção
	*/
	box:{
		/*
		Function: inicia
		
		Marca o início do desenho do box, capturando a posição do mouse
		*/
		inicia: function(){
			if($i("i3GEOselecaotemasLigados").value === "")
			{alert("Escolha um tema");return;}
			if(g_tipoacao !== 'selecaobox')
			{return;}
			i3GEO.Interface.openlayers.OLpan.deactivate();
			i3geoOL.removeControl(i3GEO.Interface.openlayers.OLpan);
			i3GEOF.selecao.box.criaBox();
			adicionaxyBox = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			var i = $i("i3geoboxSel").style;
			i.width="10px";
			i.height="10px";
			i.visibility="visible";
			i.display="block";
			i.left = objposicaocursor.imgx + adicionaxyBox[0] - 5 + "px";
			i.top = objposicaocursor.imgy + adicionaxyBox[1] - 5 + "px";
			boxxini = objposicaocursor.imgx + adicionaxyBox[0];
			boxyini = objposicaocursor.imgy + adicionaxyBox[1];
			if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEOF.selecao.box.desloca()") < 0)
			{i3GEO.eventos.MOUSEMOVE.push("i3GEOF.selecao.box.desloca()");}
			if(i3GEO.eventos.MOUSEUP.toString().search("i3GEOF.selecao.box.termina()") < 0)
			{i3GEO.eventos.MOUSEUP.push("i3GEOF.selecao.box.termina()");}
		},
		/*
		Function: criaBox
		
		Cria o DIV que será utilizado para desenhar o box no mapa
		*/
		criaBox: function(){
			try{i3GEO.desenho.richdraw.fecha();}
			catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
			i3GEO.desenho.criaContainerRichdraw();
			i3GEO.desenho.richdraw.lineColor = "red";
			i3GEO.desenho.richdraw.lineWidth = "2px";
			var novoel,temp;
			if(!$i("i3geoboxSel")){
				novoel = document.createElement("div");
				novoel.style.width = "10px";
				novoel.style.height = "10px";
				novoel.id = "i3geoboxSel";
				novoel.style.display = "block";
				novoel.style.fontSize = "0px";
				YAHOO.util.Dom.setStyle(novoel,"opacity",0.25);
				novoel.style.backgroundColor = "#cedff2";
				novoel.style.position="absolute";
				novoel.style.border = "2px solid #ff0000";		
				novoel.onmousemove = function(){
					var b,wb,hb;
					b = $i("i3geoboxSel").style;
					wb = parseInt(b.width,10);
					hb = parseInt(b.height,10);
					if(wb > 2)
					{b.width = wb - 2 + "px";}
					if(hb > 2)
					{b.height = hb - 2 + "px";}
				};
				novoel.onmouseup = function()
				{i3GEOF.selecao.box.termina();};
				document.body.appendChild(novoel);
			}
			if($i("img")){
				$i("img").title = "";
				temp = "zoom";
				if(i3GEO.Interface.ATIVAMENUCONTEXTO)
				{temp = "zoom_contexto";}
			}
		},
		/*
		Function: desloca
		
		Desloca o box conforme o mouse é movimentado
		*/
		desloca: function(){
			if(g_tipoacao !== 'selecaobox')
			{return;}
			var bxs,ppx,py;
			bxs = $i("i3geoboxSel").style;
			if(bxs.display !== "block")
			{return;}
			ppx = objposicaocursor.imgx + adicionaxyBox[0];
			py = objposicaocursor.imgy + adicionaxyBox[1];
			
			if ((ppx > boxxini) && ((ppx - boxxini - 2) > 0))
			{bxs.width = ppx - boxxini - 2 + "px";}
			if ((py > boxyini) && ((py - boxyini - 2) > 0))
			{bxs.height = py - boxyini - 2 + "px";}
			if (ppx < boxxini)
			{bxs.left = ppx;bxs.width = boxxini - ppx + 2 + "px";}
			if (py < boxyini)
			{bxs.top = py;bxs.height = boxyini - py + 2 + "px";}
		},
		/*
		Function: termina
		
		Para o desenho do box, captura seu tamanho e faz o zoom no mapa
		*/
		termina: function(){
			var valor,v,x1,y1,x2,y2,limpa,doc,tipo;
			try{
				valor = i3GEO.calculo.rect2ext("i3geoboxSel",i3GEO.parametros.mapexten,i3GEO.parametros.pixelsize);
				v = valor[0];
				x1 = valor[1];
				y1 = valor[2];
				x2 = valor[3];
				y2 = valor[4];
				limpa = function(){
					var bxs = $i("i3geoboxSel").style;
					bxs.display="none";
					bxs.visibility="hidden";
					bxs.width = "0px";
					bxs.height = "0px";
				};
				if((x1 === x2) || (y1 === y2))
				{limpa.call();return;}
				// se o retangulo for negativo pula essa parte para nï¿½ gerar erro
				i3GEO.parametros.mapexten=v;
				limpa.call();
				i3GEO.eventos.MOUSEMOVE.remove("i3GEOF.selecao.box.desloca()");
				i3GEO.eventos.MOUSEUP.remove("i3GEOF.selecao.box.termina()");
				tipo = "adiciona";
				//pega o tipo de operacao da janela de selecao
				tipo = $i("i3GEOselecaotipoOperacao").value;
				i3GEOF.selecao.porbox(i3GEO.temaAtivo,tipo,v);
			}
			catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
				limpa.call();
				return;
			}
		}
	},
	/*
	Function: porbox
	
	Seleciona elementos de um tema com base em um retângulo
	
	Parametros:
	
	tema {String} - código do tema
	
	tipo {String} - tipo de operação adiciona|retira
	
	box {String} - xmin ymin xmax ymax
	*/
	porbox: function(tema,tipo,box){
		if(typeof(console) !== 'undefined')
		{console.info("i3GEO.navega.selecao.porbox()");}
		var retorna = function(retorno){
			var nsel;
			i3GEO.janela.fechaAguarde("i3GEO.atualiza");
			i3GEO.Interface.atualizaTema(retorno,tema);
			nsel = i3GEO.arvoreDeCamadas.pegaTema(tema,retorno.data.temas);
			$i("i3GEOselecaoNsel").innerHTML = "Selecionados: "+(nsel.nsel);
		};
		i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
		i3GEO.php.selecaobox(retorna,tema,tipo,box);
	},
	/*
	Function: clique
	
	Seleciona elementos clicando no mapa
	*/
	clique: function(){
		if($i("i3GEOselecaotemasLigados").value === "")
		{alert("Escolha um tema");return;}
		if(typeof(console) !== 'undefined')
		{console.info("i3GEO.selecao.clique()");}
		if (g_tipoacao === "selecao"){
			var doc,tipo,tolerancia;
			tipo = $i("i3GEOselecaotipoOperacao").value;
			tolerancia = $i("i3GEOselecaotoleranciapt").value;
			i3GEOF.selecao.porxy(i3GEO.temaAtivo,tipo,tolerancia);		
		}
	},
	/*
	Function: porxy
	
	Executa a seleção de elementos de um tema com base em um par de coordenadas xy
	
	Parametros:
	
	tema {String} - código do tema
	
	tipo {String} - tipo de operação adiciona|retira
	
	tolerancia {Integer} - tolerância de busca
	*/
	porxy: function(tema,tipo,tolerancia){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.selecao.porxy()");}
		var retorna = function(retorno){
			var nsel;
			i3GEO.janela.fechaAguarde("i3GEO.atualiza");
			i3GEO.Interface.atualizaTema(retorno,tema);
			nsel = i3GEO.arvoreDeCamadas.pegaTema(tema,retorno.data.temas);
			$i("i3GEOselecaoNsel").innerHTML = "Selecionados: "+(nsel.nsel);
		};
		i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
		i3GEO.php.selecaopt(retorna,tema,objposicaocursor.ddx+" "+objposicaocursor.ddy,tipo,tolerancia);
	},
	/*
	Classe: i3GEOF.selecao.poligono
	
	Realiza a seleção desenhando um polígono no mapa
	*/
	poligono:{
		/*
		Function: inicia
		
		Inicia o desenho do polígono
		*/
		inicia: function(){
			try
			{i3GEO.desenho.richdraw.fecha();}
			catch(e)
			{if(typeof(console) !== 'undefined'){console.error(e);}}
			pontosdistobj = [];
			i3GEO.util.insereMarca.limpa();
			g_tipoacao = "selecaopoli";
			alert("Clique no mapa para desenhar o polígono.");
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.selecao.clique()");
			if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEOF.selecao.poligono.move()") < 0)
			{i3GEO.eventos.MOUSEMOVE.push("i3GEOF.selecao.poligono.move()");}
			if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.selecao.poligono.clique()") < 0)
			{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.selecao.poligono.clique()");}
			i3GEO.desenho.criaContainerRichdraw();
			i3GEO.desenho.richdraw.lineColor = "red";
			i3GEO.desenho.richdraw.lineWidth = "2px";
		},
		/*
		Function: move
		
		Modifica o polígono conforme o usuário cria vértices
		*/
		move: function(){
			if (g_tipoacao === "selecaopoli"){
				var n = pontosdistobj.xpt.length;
				if (n > 0){
					if(navm)
					{i3GEO.desenho.aplica("resizePoligono",pontosdistobj.linhas[n-1],n);}
					else{
						i3GEO.desenho.aplica("resizePoligono",pontosdistobj.linhastemp,1);
						i3GEO.desenho.aplica("resizeLinha",pontosdistobj.linhas[n-1],n);
					}
				}
			}
		},
		/*
		Function: clique
		
		Inclui um novo vértice no polígono
		*/
		clique: function(){
			if (g_tipoacao !== "selecaopoli"){return;}
			var n,m;
			n = pontosdistobj.xpt.length;
			pontosdistobj.xpt[n] = objposicaocursor.ddx;
			pontosdistobj.ypt[n] = objposicaocursor.ddy;
			pontosdistobj.xtela[n] = objposicaocursor.telax;
			pontosdistobj.ytela[n] = objposicaocursor.telay;
			pontosdistobj.ximg[n] = objposicaocursor.imgx;
			pontosdistobj.yimg[n] = objposicaocursor.imgy;
			pontosdistobj.dist[n] = 0;
			//inclui a linha para ligar com o ponto inicial		
			if (n === 0){
				try	{
					if (navn)
					{pontosdistobj.linhastemp = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1,pontosdistobj.ximg[0]-1,pontosdistobj.yimg[0]-1);}
				}
				catch(e){
					if(typeof(console) !== 'undefined'){console.error(e);}
				}
			}
			else{
				if(navm)
				{pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, (pontosdistobj.ximg[n-1])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n-1],(pontosdistobj.ximg[n])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n]);}				
			}
			try{
				if (navn)
				{pontosdistobj.linhas[n] = i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode, i3GEO.desenho.richdraw.fillColor, i3GEO.desenho.richdraw.lineColor, i3GEO.desenho.richdraw.lineWidth, pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1,pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1);}
			}
			catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
			if(i3GEO.Interface.ATUAL === "openlayers" || i3GEO.Interface.ATUAL === "googlemaps")
			{i3GEO.util.insereMarca.cria(objposicaocursor.imgx,objposicaocursor.imgy,i3GEOF.selecao.poligono.termina,"divGeometriasTemp");}
			if(i3GEO.Interface.ATUAL === "googleearth")
			{i3GEO.util.insereMarca.cria(objposicaocursor.ddx,objposicaocursor.ddy,i3GEOF.selecao.poligono.termina,"divGeometriasTemp","");}
		},
		/*
		Function: termina
		
		Termina o desenho do polígono e executa a operação de seleção
		*/
		termina: function(){
			var pontos,n,xs,ys,retorna,p,cp,tema=i3GEO.temaAtivo;
			pontos = pontosdistobj;
			i3GEO.desenho.richdraw.fecha();
			n = pontos.xpt.length;
			xs = pontos.xpt.toString(",");
			ys = pontos.ypt.toString(",");
			retorna = function(retorno){
				var nsel;
				i3GEO.janela.fechaAguarde("i3GEO.atualiza");
				i3GEO.Interface.atualizaTema(retorno,tema);
				nsel = i3GEO.arvoreDeCamadas.pegaTema(tema,retorno.data.temas);
				$i("i3GEOselecaoNsel").innerHTML = "Selecionados: "+(nsel.nsel);
			};
			i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=selecaoPoli";
			cp = new cpaint();
			//cp.set_debug(2)
			cp.set_transfer_mode('POST');
			cp.set_response_type("JSON");
			cp.call(p,"selecaoPoli",retorna,"xs="+xs,"ys="+ys,"tema="+tema,"tipo="+$i("i3GEOselecaotipoOperacao").value);
		}
	},
	/*
	Function: criatema
	
	Cria um novo tema com a seleção atual
	*/
	criatema: function(){
		if(i3GEOF.selecao.aguarde.visibility === "visible")
		{return;}
		try{
			if($i("i3GEOselecaotemasLigados").value === "")
			{alert("Escolha um tema");return;}
			i3GEOF.selecao.aguarde.visibility = "visible";
			var fim = function(){
					i3GEOF.selecao.aguarde.visibility = "hidden";
					i3GEO.atualiza();
				};
			i3GEO.php.criatemaSel(fim,$i("i3GEOselecaotemasLigados").value);
		}
		catch(e){alert("Erro: "+e);i3GEOF.selecao.aguarde.visibility = "hidden";}
	},
	/*
	Function: adicionaLinhaFiltro
	
	Adiciona uma nova linha de filtro
	*/
	adicionaLinhaFiltro: function(){
		var add,xis,interrogacao,operador,conector,valor,ntb,ntr,ntad,ntd,ntd1,ntd2,ntd3,ntd4,ntd5,tabela;
		try{
			add = document.createElement("img");
			add.src = i3GEO.configura.locaplic+'/imagens/plus.gif';
			add.style.cursor="pointer";
			add.onclick = function()
			{i3GEOF.selecao.adicionaLinhaFiltro();};
			
			xis = document.createElement("img");
			xis.src = i3GEO.configura.locaplic+'/imagens/x.gif';
			xis.style.cursor="pointer";
			xis.onclick = function(){
				var p = this.parentNode.parentNode.parentNode,
					i;
				for (i = 0; i < p.childNodes.length;i++)
				{p.removeChild(p.childNodes[i]);}
			};
			
			interrogacao = document.createElement("img");
			interrogacao.src = i3GEO.configura.locaplic+'/imagens/interrogacao.gif';
			interrogacao.title='mostra valores';
			interrogacao.style.cursor="pointer";
			interrogacao.onclick = function(){
				var obj = (this.parentNode.parentNode.getElementsByTagName("input"))[0],
					itemTema = (this.parentNode.parentNode.getElementsByTagName("select"))[0].value;
				i3GEO.util.comboValoresItem(
					"i3GEOselecaocbitens",
					i3GEO.temaAtivo,
					itemTema,
					function(retorno){
						$i("i3GEOselecaovalores").innerHTML = "<br><p class=paragrafo >Escolha o valor:"+retorno.dados+"</p>";
						if ($i("i3GEOselecaocbitens")){
							$i("i3GEOselecaocbitens").onchange = function()
							{obj.value = this.value;};
						}		
					},
					"i3GEOselecaovalores"
				);
			};
			
			operador = "<select>";
			operador += "<option value='='>igual</option>";
			operador += "<option value='!='>dif</option>";
			operador += "<option value='<'>menor</option>";
			operador += "<option value='>'>maior</option>";
			operador += "<option value='<='><=</option>";
			operador += "<option value='>='>>=</option>";
			operador += "<option value='in'>in</option>";
			operador += "<option value='~='>regExp</option></select>";
			
			conector = "<select>";
			conector += "<option value='and'>e</option>";
			conector += "<option value='or'>ou</option>";
			conector += "<option value='not'>n&atilde;o</option></select>";
			
			valor = document.createElement("input");
			valor.type = "text";
			valor.value = "";
			valor.size = "15";
			
			ntr = document.createElement("tr");
			ntad = document.createElement("td");
			ntad.appendChild(add);
			ntr.appendChild(ntad);
			
			ntd = document.createElement("td");
			ntd.appendChild(xis);
			ntr.appendChild(ntd);
			
			ntd1 = document.createElement("td");
			i3GEO.util.comboItens(
				"none",
				i3GEO.temaAtivo,
				function(retorno){
					ntd1.innerHTML = retorno.dados;
				}
			);
			ntr.appendChild(ntd1);
			
			ntd2 = document.createElement("td");
			ntd2.innerHTML = operador;
			ntr.appendChild(ntd2);
			
			ntd3 = document.createElement("td");
			ntd3.appendChild(valor);
			ntr.appendChild(ntd3);

			ntd4 = document.createElement("td");
			ntd4.appendChild(interrogacao);
			ntr.appendChild(ntd4);
			
			ntd5 = document.createElement("td");
			ntd5.innerHTML = conector;
			ntr.appendChild(ntd5);
			
			//ntb = document.createElement("tbody");
			//ntb.appendChild(ntr);
			if(navm)
			{tabela = $i("i3GEOselecaoparametros").getElementsByTagName("tbody")[0];}
			else
			{tabela = $i("i3GEOselecaoparametros");}
			tabela.appendChild(ntr);
		}
		catch(e){alert("Erro: "+e);}
	},
	/*
	Function: atributo
	
	Seleciona por atributo
	*/
	atributo: function(){
		if(i3GEOF.selecao.aguarde.visibility === "visible")
		{return;}
		if($i("i3GEOselecaotemasLigados").value === "")
		{alert("Escolha um tema");return;}
		try{
			i3GEOF.selecao.aguarde.visibility = "visible";
			var filtro = "",
				re,g,ipt,i,ii,nos,s,itemsel,valor,operador,conector,temp;
			if(navm){ii = 2;}
			else
			{ii = 0;}
			g = $i("i3GEOselecaoparametros");
			ipt = g.getElementsByTagName("tr");
			if (ipt.length > 0){
				for (i=ii;i<ipt.length; i++){
					nos = ipt[i].childNodes;
					s = nos[2].getElementsByTagName("select");
					itemsel = s[0].value;
					s = nos[3].getElementsByTagName("select");
					operador = s[0].value;
					s = nos[4].getElementsByTagName("input");
					valor = s[0].value;
					s = nos[6].getElementsByTagName("select")
					conector = s[0].value;
					if (valor*1)
					{filtro = filtro + "(["+itemsel+"] "+operador+" "+valor+")";}
					else
					{filtro = filtro + "(|["+itemsel+"]| "+operador+" |"+valor+"|)";}
					if ((i + 1) != ipt.length) //tem conector
					{filtro = filtro + conector;}
					else
					{filtro = "("+filtro+")";}
				}
			}
			if (filtro === ""){
				i3GEOF.selecao.aguarde.visibility = "hidden";
				return;
			}
			g_operacao = "selecao"
		 	temp = function(retorno){
		 		var nsel;
		 		i3GEOF.selecao.aguarde.visibility = "hidden";
				i3GEO.Interface.atualizaTema(retorno,i3GEO.temaAtivo);
				nsel = i3GEO.arvoreDeCamadas.pegaTema(tema,retorno.data.temas);
				$i("i3GEOselecaoNsel").innerHTML = "Selecionados: "+(nsel.nsel);
		 	};		
			i3GEO.php.selecaoatrib2(temp,i3GEO.temaAtivo,filtro,$i("i3GEOselecaotipoOperacao").value);
		}
		catch(e){
			alert("Erro: "+e);
			i3GEOF.selecao.aguarde.visibility = "hidden";
		}
	},
	/*
	Function: aplicaselecaoTema
	
	Realiza a seleção cruzando um tema com outro
	*/
	aplicaselecaoTema: function(){
		if(i3GEOF.selecao.aguarde.visibility === "visible")
		{return;}
		if($i("i3GEOselecaotemasLigados").value === ""){
			alert("Escolha um tema");
			i3GEOF.selecao.aguarde.visibility = "hidden";
			return;
		}
		try{
			i3GEOF.selecao.aguarde.visibility = "visible";
	 		var temp = function(retorno){
		 		var nsel;
		 		i3GEOF.selecao.aguarde.visibility = "hidden";
				i3GEO.Interface.atualizaTema(retorno,i3GEO.temaAtivo);
				nsel = i3GEO.arvoreDeCamadas.pegaTema(tema,retorno.data.temas);
				$i("i3GEOselecaoNsel").innerHTML = "Selecionados: "+(nsel.nsel);
		 	};
			g_operacao = "selecao";
			i3GEO.php.selecaotema(temp,$i("i3GEOselecaoTemaoverlay").value,i3GEO.temaAtivo,$i("i3GEOselecaotipoOperacao").value);
		}
		catch(e){
			alert("Erro: "+e);
			i3GEOF.selecao.aguarde.visibility = "hidden";
		}
	},
	/*
	Function: grafico
	
	Abre uma janela flutuante para criar gráficos
	*/
	grafico: function(){
		i3GEO.analise.dialogo.graficoInterativo();
	},
	/*
	Function: graficoPerfil
	
	Abre uma janela flutuante para criar gráficos de perfil
	*/
	graficoPerfil: function(){
		var cp,p,temp;
		if(i3GEOF.selecao.aguarde.visibility === "visible")
		{return;}
		if($i("i3GEOselecaotemasLigados").value === "")
		{alert("Escolha um tema");return;}
		try{
			i3GEOF.selecao.aguarde.visibility = "visible";
	 		var temp = function(retorno){
		 		i3GEOF.selecao.aguarde.visibility = "hidden";
				if (retorno.data != undefined){
					var x = [],
						y = [],
						i,
						n = retorno.data.length,
						js = i3GEO.configura.locaplic+"/ferramentas/perfil/index.js.php";
					for (i=0;i<n; i++){
						x.push(retorno.data[i].x);
						y.push(retorno.data[i].y);
					}
					if(x.length == 0)
					{alert("Nenhum ponto encontrado");return;}
					pontosdistobj = {
						xpt: x,
						ypt: y
					};
					i3GEO.util.scriptTag(js,"i3GEOF.perfil.criaJanelaFlutuante(pontosdistobj)","i3GEOF.perfil_script");
				}		
		 	};
			cp = new cpaint();
			cp.set_response_type("JSON");
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaPontosShapeSel&tema="+i3GEO.temaAtivo;
			cp.call(p,"listaPontosShape",temp);
		}
		catch(e){
			alert("Erro: "+e);
			i3GEOF.selecao.aguarde.visibility = "hidden";
		}
	}

};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>