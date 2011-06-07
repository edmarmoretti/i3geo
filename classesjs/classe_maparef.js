/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Mapa de referência

Arquivo:

i3geo/classesjs/classe_maparef.js

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
if(typeof(i3GEO) === 'undefined'){
	i3GEO = [];
}
/*
Classe: i3GEO.maparef

Cria e processa o mapa de referência

Exemplo:

i3Geo.maparef.inicia()
*/
i3GEO.maparef = {
	/*
	Propriedade: fatorZoomDinamico

	Define o fator de zoom inicial do mapa de referência quando o modo dinâmico for ativado

	Tipo:
	{numeric}

	Default:
	{-3}
	*/
	fatorZoomDinamico: -3,
	/*
	Propriedade: SELETORTIPO

	Inclui ou não o seletor de tipo de mapa de referência

	Tipo:
	{Boolean}

	Default:
	{true}
	*/
	SELETORTIPO:true,
	/*
	Propriedade: PERMITEFECHAR

	Mostra o botão para fechar a janela ou não.

	Tipo:
	{boolean}

	Default:
	{true}
	*/
	PERMITEFECHAR: true,
	/*
	Propriedade: PERMITEDESLOCAR

	Permite deslocar janela ou não.

	Tipo:
	{boolean}
	*/
	PERMITEDESLOCAR: true,
	/*
	Propriedade: TRANSICAOSUAVE

	Altera a transparência quando o mouse sobrepõe ao mapa de referência e quando sai

	Essa opção como true não funciona bem no IE

	Tipo:
	{boolean}

	Default:
	{true}
	*/
	TRANSICAOSUAVE: true,
	/*
	Propriedade: OPACIDADE

	Valor da transparência mínima utilizada quando TRANSICAOSUAVE for igual a true.

	Varia de 0 a 100

	Tipo:
	{numeric}

	Default:
	{85}
	*/
	OPACIDADE: 85,
	/*
	Propriedade: TOP

	Posição da janela em relação ao topo do mapa

	Tipo:
	{Numeric}

	Default:
	{4}
	*/
	TOP: 4,
	/*
	Propriedade: RIGHT

	Posição da janela em relação ao lado direito do mapa

	{Numeric}

	Defau:
	{0}
	*/
	RIGHT:0,
	/*
	Function: inicia

	Inicializa o mapa de referência
	*/
	inicia: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.maparef.inicia()");}
		var r,pos,novoel,ins,temp,moveX,moveY,escondeRef;
		if(navm)
		{i3GEO.maparef.TRANSICAOSUAVE = false;}
		if (!$i("i3geo_winRef")){
			novoel = document.createElement("div");
			novoel.id = "i3geo_winRef";
			novoel.style.display="none";
			novoel.style.borderColor="gray";
			ins = "";
			if(this.PERMITEDESLOCAR){
				ins += '<div class="hd" style="text-align:left;z-index:20;padding-left: 0px;padding-bottom: 3px;padding-top: 1px;">';
				ins += '<span id=maparefmaismenosZoom style=display:none > ';
				temp = "javascript:if(i3GEO.maparef.fatorZoomDinamico == -1){i3GEO.maparef.fatorZoomDinamico = 1};i3GEO.maparef.fatorZoomDinamico = i3GEO.maparef.fatorZoomDinamico + 1 ;$i(\"refDinamico\").checked = true;i3GEO.maparef.atualiza();";
				ins += "<img class=mais onclick='"+temp+"' src="+i3GEO.util.$im("branco.gif")+" />";
				temp = "javascript:if(i3GEO.maparef.fatorZoomDinamico == 1){i3GEO.maparef.fatorZoomDinamico = -1};i3GEO.maparef.fatorZoomDinamico = i3GEO.maparef.fatorZoomDinamico - 1 ;$i(\"refDinamico\").checked = true;i3GEO.maparef.atualiza();";
				ins += "<img class=menos onclick='"+temp+"' src="+i3GEO.util.$im("branco.gif")+" /></span>&nbsp;";
				if(this.SELETORTIPO){
					ins += "<select style='font-size:9px;' id='refDinamico' onchange='javascript:i3GEO.parametros.celularef=\"\";i3GEO.maparef.atualiza()'>";
					ins += "<option value='fixo' select >fixo</option>";
					ins += "<option value='mapa' >mapa</option>";
					ins += "<option value='dinamico' >dinâmico</option>";
					ins += "</select>";
				}
				ins += "</div>";
			}
			ins += '<div class="bd" style="text-align:left;padding:3px;height: 150px;" id="mapaReferencia" onmouseover="this.onmousemove=function(exy){i3GEO.eventos.posicaoMouseMapa(exy)}"  >';
			ins += '<img style="cursor:pointer;display:none" onload="javascript:this.style.display = \'block\'" id="imagemReferencia" src="" onclick="javascript:i3GEO.maparef.click()">';
			ins += '</div>';
			novoel.innerHTML = ins;
			document.body.appendChild(novoel);
			if(i3GEO.maparef.TRANSICAOSUAVE){
				YAHOO.util.Dom.setStyle(novoel,"opacity",i3GEO.maparef.OPACIDADE / 100);
				novoel.onmouseover = function(){
					YAHOO.util.Dom.setStyle(novoel,"opacity",1);
				};
				novoel.onmouseout = function(){
					YAHOO.util.Dom.setStyle(novoel,"opacity",i3GEO.maparef.OPACIDADE / 100);
				};
			}
		}
		if($i("i3geo_winRef").style.display !== "block"){
			$i("i3geo_winRef").style.display = "block";
			YAHOO.namespace("janelaRef.xp");
			this.PERMITEDESLOCAR ? temp = "shadow" : temp = "none";
			YAHOO.janelaRef.xp.panel = new YAHOO.widget.Panel("i3geo_winRef", { height:"177px", width:"156px", fixedcenter: false, constraintoviewport: true, underlay:temp, close:i3GEO.maparef.PERMITEFECHAR, visible:true, draggable:i3GEO.maparef.PERMITEDESLOCAR, modal:false,iframe:false } );
			YAHOO.janelaRef.xp.panel.render();
			r = $i("i3geo_winRef_c");
			if(r){
				r.style.clip = "rect(0px, 160px, 182px, 0px)";
				r.style.position = "absolute";
			}
			pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			$i("mapaReferencia").style.height = "150px";
			$i("i3geo_winRef").style.border = "1px solid gray";
			moveX = pos[0] + i3GEO.parametros.w + 153 - i3GEO.maparef.RIGHT - 300;
			moveY = pos[1] + i3GEO.maparef.TOP;
			if(i3GEO.Interface.ATUAL === "googlemaps")
			{moveY += 30;}
			YAHOO.janelaRef.xp.panel.moveTo(moveX,moveY);
			escondeRef = function(){
				YAHOO.util.Event.removeListener(YAHOO.janelaRef.xp.panel.close, "click");
				$i("imagemReferencia").src = "";
				YAHOO.janelaRef.xp.panel.destroy();
				i3GEO.util.insereCookie("i3GEO.configura.mapaRefDisplay","none");
			};
			YAHOO.util.Event.addListener(YAHOO.janelaRef.xp.panel.close, "click", escondeRef);
			i3GEO.util.insereCookie("i3GEO.configura.mapaRefDisplay","block");
			if($i("localizarxygeoProjxg")){
				var temp = function(){
					i3GEO.coordenadas.atualizaGeo(objposicaocursor.dmsx,objposicaocursor.dmsy,"localizarxygeoProj");
				};
				YAHOO.util.Event.addListener($i("imagemReferencia"),"mousemove", temp);
			}
		}
		if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.maparef.atualiza()") < 0)
		{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.maparef.atualiza()");}
		this.atualiza(true);
		$i("i3geo_winRef_h").className = "hd2";
		if(navm)
		{$i("i3geo_winRef_h").style.width = "156px";}
	},
	/*
	Function: atualiza

	Atualiza o mapa de referência.

	Se o modo cgi estiver ativado, o mapa de referência é desenhado utilizando-se como src da imagem o programa cgi do Mapserver.

	No modo dinâmico, a imagem é gerada de forma diferenciada. Nesse caso, o modo cgi é desabilitado.

	O atualizaReferencia é sempre chamado após o mapa ser redesenhado.

	Se houve alteração na extensão, é preciso refazer o mapa de referência se não, a imagem atual é armazenada no quado de animação
	*/
	atualiza: function(forca){
		if(arguments.length === 0)
		{forca = false;}
		if(typeof(console) !== 'undefined'){console.info("i3GEO.maparef.atualiza()");}
		var dinamico,tiporef,temp,re;
		dinamico = false;
		temp = $i("refDinamico") ? tiporef = $i("refDinamico").value : tiporef = "fixo";
		if ($i("mapaReferencia")){
			temp = $i("maparefmaismenosZoom");
			if(tiporef === "dinamico"){
				i3GEO.php.referenciadinamica(i3GEO.maparef.processaImagem,i3GEO.maparef.fatorZoomDinamico,tiporef);
				if(temp){temp.style.display="inline";}
			}
			if(tiporef === "fixo"){
				//
				//no modo cgi ativado, a obtenção da imagem é feita de forma diferente do modo normal do mapa
				//
				if($i("imagemReferencia").src === "" || i3GEO.parametros.utilizacgi.toLowerCase() !== "sim"){
					//
					//se o valor do tamanho da celula já existir, não é necessário redesenhar a imagem
					//
					if(i3GEO.parametros.celularef === "" || $i("imagemReferencia").src === "" || forca === true)
					{i3GEO.php.referencia(i3GEO.maparef.processaImagem);}
					else
					{i3GEO.maparef.atualizaBox();}
					if(temp){temp.style.display="none";}
				}
				else{
					re = new RegExp("&mode=map", "g");
					$i("imagemReferencia").src = $i(i3GEO.Interface.IDMAPA).src.replace(re,'&mode=reference');
					i3GEO.gadgets.quadros.grava("referencia",$i("imagemReferencia").src);
				}
			}
			if(tiporef === "mapa"){
				i3GEO.php.referenciadinamica(i3GEO.maparef.processaImagem,i3GEO.maparef.fatorZoomDinamico,tiporef);
				if(temp){temp.style.display="inline";}
			}
		}
		else{
			if($i("imagemReferencia"))
			{i3GEO.gadgets.quadros.grava("referencia",$i("imagemReferencia").src);}
			i3GEO.eventos.NAVEGAMAPA.remove("i3GEO.maparef.atualiza()");
		}
	},
	/*
	Function: processaImagem

	Substituí a imagem do mapa de referência pela última gerada.

	Esta função processa os dados de uma chamada AJAX para atualizar o mapa de referência

	Parametro:

	retorno - string no formato "var refimagem='nome da imagem'".
	*/
	processaImagem: function(retorno){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.maparef.processaImagem()");}
		var w,m,novoel,boxrefdd,box,temp,
		tiporef = "fixo";
		//i3GEO.janela.fechaAguarde("ajaxreferencia1");
		if ((retorno.data !== "erro") && (retorno.data !== undefined)){
			eval(retorno.data);
			i3GEO.parametros.celularef = g_celularef;
			i3GEO.parametros.extentref = extentref;
			temp = $i("imagemReferencia");
			if (temp){
				m = new Image();
				m.src = refimagem;
				temp.src=m.src;
			}
			i3GEO.gadgets.quadros.grava("referencia",refimagem);
			temp = $i("refDinamico");
			if (temp)
			{tiporef = temp.value;}
			if(tiporef !== "fixo"){
				box = $i("boxref");
				if (box)
				{box.style.display = "none";}
				return;
			}
			i3GEO.maparef.atualizaBox();
		}
	},
	/*
	Function: atualizaBox

	Atualiza o tamanho e a posição do box que indica a extensão geográfica do mapa atual

	O box é um div com id = "boxref".

	*/
	atualizaBox: function(){
		var box = i3GEO.maparef.criaBox(),
			w;
		//
		//aplica ao box um novo tamanho
		//
		i3GEO.calculo.ext2rect("boxref",i3GEO.parametros.extentref,i3GEO.parametros.mapexten,i3GEO.parametros.celularef,$i("mapaReferencia"));
		w = parseInt(box.style.width,10);
		if(w > 120)
		{box.style.display = "none";return;}
		box.style.display = "block";
		box.style.top = parseInt(box.style.top,10)+4;
		box.style.left = parseInt(box.style.left,10)+4;
		if(w < 3){
			box.style.width = "3px";
			box.style.height = "3px";
		}
	},
	criaBox: function(){
		var box = $i("boxref");
		if (!box){
			novoel = document.createElement("div");
			novoel.id = "boxref";
			novoel.style.zIndex=10;
			novoel.style.position = 'absolute';
			novoel.style.cursor = "move";
			novoel.style.backgroundColor = "RGB(120,220,220)";
			novoel.style.borderWidth = "3px";
			//YAHOO.util.Dom.setStyle(novoel,"opacity",40);
			if (navm){novoel.style.filter='alpha(opacity=40)';}
			else{novoel.style.opacity= 0.4;}
			$i("mapaReferencia").appendChild(novoel);
			//
			//aplica os eventos de movimentação sobre o box azul
			//
			boxrefdd = new YAHOO.util.DD("boxref");
			//
			//atualiza o mapa principal quando o box é modificado manualmente
			//
			novoel.onmouseup = function(){
				var rect,telaminx,telaminxy,telamaxx,telaminy,m,x,ext;
				rect = $i("boxref");
				telaminx = parseInt(rect.style.left,10);
				telamaxy = parseInt(rect.style.top,10);
				telamaxx = telaminx + parseInt(rect.style.width,10);
				telaminy = telamaxy + parseInt(rect.style.height,10);
				m = i3GEO.calculo.tela2dd(telaminx,telaminy,i3GEO.parametros.celularef,i3GEO.parametros.extentref,"imagemReferencia");
				x = i3GEO.calculo.tela2dd(telamaxx,telamaxy,i3GEO.parametros.celularef,i3GEO.parametros.extentref,"imagemReferencia");
				ext = m[0]+" "+m[1]+" "+x[0]+" "+x[1];
				i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"",ext);
			};
			return novoel;
		}
		else
		{return box;}
	},
	/*
	Function: click

	Ocorre quando o usuário clica sobre o mapa de referência, deslocando o mapa principal
	*/
	click: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.maparef.click()");}
		if(i3GEO.Interface.ATUAL==="openlayers"){
			i3GEO.Interface.openlayers.pan2ponto(objposicaocursor.ddx,objposicaocursor.ddy);
			return;
		}
		try{
			i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
			//i3GEO.contadorAtualiza++;
			i3GEO.php.pan(i3GEO.atualiza,i3GEO.parametros.mapscale,"ref",objposicaocursor.refx,objposicaocursor.refy);
		}
		catch(e){
			i3GEO.janela.fechaAguarde("i3GEO.atualiza");
			if(typeof(console) !== 'undefined'){console.error(e);}
		}
	}
};