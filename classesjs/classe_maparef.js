/*
Title: Mapa de refer&ecirc;ncia

i3GEO.maparef

Cria e processa o mapa de refer&ecirc;ncia

Exemplo:

i3Geo.maparef.inicia()


Arquivo:

i3geo/classesjs/classe_maparef.js

Licen&ccedil;a:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEO) === 'undefined'){
	var i3GEO = {};
}
i3GEO.maparef = {
	/*
	Propriedade: fatorZoomDinamico

	Define o fator de zoom inicial do mapa de refer&ecirc;ncia quando o modo dinamico for ativado

	Tipo:
	{numeric}

	Default:
	{-3}
	*/
	fatorZoomDinamico: -3,
	/*
	Propriedade: SELETORTIPO

	Inclui ou n&atilde;o o seletor de tipo de mapa de refer&ecirc;ncia

	Tipo:
	{Boolean}

	Default:
	{true}
	*/
	SELETORTIPO:true,
	/*
	Propriedade: VALORSELETORTIPO

	Valor inicial do seletor de tipo. Permite definir qual o tipo de mapa de referencia

	Tipo:
	{mapa|dinamico}

	Default:
	{"dinamico"}
	*/
	VALORSELETORTIPO:"mapa",
	/*
	Propriedade: PERMITEFECHAR

	Mostra o bot&atilde;o para fechar a janela ou n&atilde;o.

	Tipo:
	{boolean}

	Default:
	{true}
	*/
	PERMITEFECHAR: true,
	/*
	Propriedade: PERMITEDESLOCAR

	Permite deslocar janela ou n&atilde;o.

	Tipo:
	{boolean}
	*/
	PERMITEDESLOCAR: true,
	/*
	Propriedade: TRANSICAOSUAVE

	Altera a transpar&ecirc;ncia quando o mouse sobrep&otilde;e ao mapa de refer&ecirc;ncia e quando sai

	Essa op&ccedil;&atilde;o como true n&atilde;o funciona bem no IE

	Tipo:
	{boolean}

	Default:
	{true}
	*/
	TRANSICAOSUAVE: false,
	/*
	Propriedade: OPACIDADE

	Valor da transpar&ecirc;ncia m&iacute;nima utilizada quando TRANSICAOSUAVE for igual a true.

	Varia de 0 a 100

	Tipo:
	{numeric}

	Default:
	{85}
	*/
	OPACIDADE: 65,
	/*
	Propriedade: TOP

	Posi&ccedil;&atilde;o da janela em rela&ccedil;&atilde;o ao topo do mapa

	Tipo:
	{Numeric}

	Default:
	{4}
	*/
	TOP: 4,
	/*
	Propriedade: RIGHT

	Posi&ccedil;&atilde;o da janela em rela&ccedil;&atilde;o ao lado direito do mapa

	{Numeric}

	Defaul:
	{0}
	*/
	RIGHT:20,
	W: function(){
		var w = parseInt(i3GEO.parametros.w,10)/5;
		if(w < 150){
			w = 150;
		}
		return parseInt(w,10);
	},
	H:function(){
		var h = parseInt(i3GEO.parametros.h,10)/5;
		if(i3GEO.maparef.W() <= 150){
			return 150;
		}
		else{
			return parseInt(h,10);
		}
	},
	/*
	Function: inicia

	Inicializa o mapa de refer&ecirc;ncia
	*/
	inicia: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.maparef.inicia()");}
		var r,pos,novoel,ins,temp,moveX,moveY,escondeRef,janela;
		if($i("i3geo_winRef")){
			janela = YAHOO.i3GEO.janela.manager.find("i3geo_winRef");
			janela.show();
			janela.bringToTop();
			return;
		}
		if(navm)
		{i3GEO.maparef.TRANSICAOSUAVE = false;}
		if (!$i("i3geo_winRef")){
			novoel = document.createElement("div");
			novoel.id = "i3geo_winRef";
			novoel.style.display="none";
			novoel.style.borderColor="gray";
			ins = "";
			if(this.PERMITEDESLOCAR){
				ins += '<div class="hd" style="border:0px solid black;text-align:left;z-index:20;padding-left: 0px;padding-bottom: 3px;padding-top: 1px;">';
				ins += '<span id=maparefmaismenosZoom style=display:none > ';
				temp = "javascript:if(i3GEO.maparef.fatorZoomDinamico == -1){i3GEO.maparef.fatorZoomDinamico = 1};i3GEO.maparef.fatorZoomDinamico = i3GEO.maparef.fatorZoomDinamico + 1 ;$i(\"refDinamico\").checked = true;i3GEO.maparef.atualiza();";
				ins += "<img class=mais onclick='"+temp+"' src="+i3GEO.util.$im("branco.gif")+" />";
				temp = "javascript:if(i3GEO.maparef.fatorZoomDinamico == 1){i3GEO.maparef.fatorZoomDinamico = -1};i3GEO.maparef.fatorZoomDinamico = i3GEO.maparef.fatorZoomDinamico - 1 ;$i(\"refDinamico\").checked = true;i3GEO.maparef.atualiza();";
				ins += "<img class=menos onclick='"+temp+"' src="+i3GEO.util.$im("branco.gif")+" /></span>&nbsp;";
				if(this.SELETORTIPO){
					ins += "<select style='font-size:9px;' id='refDinamico' onchange='javascript:i3GEO.parametros.celularef=\"\";i3GEO.maparef.atualiza()'>";
					ins += "<option value='mapa'  >mapa aual</option>";
					ins += "<option value='dinamico' >Brasil</option>";
					ins += "</select>";
				}
				ins += "</div>";
			}
			ins += '<div class="bd" style="border:0px solid black;text-align:left;padding:3px;height: '+i3GEO.maparef.H()+'px;" id="mapaReferencia" onmouseover="this.onmousemove=function(exy){i3GEO.eventos.posicaoMouseMapa(exy)}"  >';
			ins += '<img style="cursor:pointer;display:none" onload="javascript:this.style.display = \'block\'" id="imagemReferencia" src="" onclick="javascript:i3GEO.maparef.click()">';
			ins += '</div>';
			novoel.innerHTML = ins;
			if(i3GEO.maparef.TRANSICAOSUAVE){
				YAHOO.util.Dom.setStyle(novoel,"opacity",i3GEO.maparef.OPACIDADE / 100);
				novoel.onmouseover = function(){
					YAHOO.util.Dom.setStyle(novoel,"opacity",1);
				};
				novoel.onmouseout = function(){
					YAHOO.util.Dom.setStyle(novoel,"opacity",i3GEO.maparef.OPACIDADE / 100);
				};
			}
			document.body.appendChild(novoel);
			if($i("refDinamico")){
				$i("refDinamico").value = i3GEO.maparef.VALORSELETORTIPO;
			}
		}
		if($i("i3geo_winRef").style.display !== "block"){
			$i("i3geo_winRef").style.display = "block";
			this.PERMITEDESLOCAR ? temp = "shadow" : temp = "none";
			janela = new YAHOO.widget.Panel("i3geo_winRef", { height:i3GEO.maparef.H()+27+"px", width:i3GEO.maparef.W()+6+"px", fixedcenter: false, constraintoviewport: false, underlay:temp, close:i3GEO.maparef.PERMITEFECHAR, visible:true, draggable:i3GEO.maparef.PERMITEDESLOCAR, modal:false,iframe:false } );
			YAHOO.i3GEO.janela.manager.register(janela);
			if(i3GEO.maparef.TRANSICAOSUAVE ){
				janela.cfg.setProperty("effect",[
						{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.5}
				]);
			}
			janela.render();
			janela.show();
			try
			{janela.header.style.height="20px";}
			catch(e){};
			r = $i("i3geo_winRef_c");
			if(r){
				//r.style.clip = "rect(0px, 160px, 185px, 0px)";
				r.style.position = "absolute";
			}
			pos = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			$i("mapaReferencia").style.height = i3GEO.maparef.H()+"px";
			$i("i3geo_winRef").style.border = "0px solid gray";
			moveX = pos[0] + i3GEO.parametros.w - i3GEO.maparef.W() + 3 - i3GEO.maparef.RIGHT;
			moveY = pos[1] + i3GEO.maparef.TOP;
			if(i3GEO.Interface.ATUAL === "googlemaps")
			{moveY += 30;}
			janela.moveTo(moveX,moveY);
			escondeRef = function(){
				YAHOO.util.Event.removeListener(janela.close, "click");
				$i("imagemReferencia").src = "";
				janela.destroy();
				i3GEO.util.insereCookie("i3GEO.configura.mapaRefDisplay","none");
			};
			YAHOO.util.Event.addListener(janela.close, "click", escondeRef);
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
		{$i("i3geo_winRef_h").style.width = i3GEO.maparef.W()+6+"px";}
	},
	/*
	Function: atualiza

	Atualiza o mapa de refer&ecirc;ncia.

	Se o modo cgi estiver ativado, o mapa de refer&ecirc;ncia &eacute; desenhado utilizando-se como src da imagem o programa cgi do Mapserver.

	No modo dinamico, a imagem &eacute; gerada de forma diferenciada. Nesse caso, o modo cgi &eacute; desabilitado.

	O atualizaReferencia &eacute; sempre chamado ap&oacute;s o mapa ser redesenhado.

	Se houve altera&ccedil;&atilde;o na extens&atilde;o, &eacute; preciso refazer o mapa de refer&ecirc;ncia se n&atilde;o, a imagem atual &eacute; armazenada no quado de anima&ccedil;&atilde;o
	*/
	atualiza: function(forca){
		if(arguments.length === 0)
		{forca = false;}
		if(typeof(console) !== 'undefined'){console.info("i3GEO.maparef.atualiza()");}
		var tiporef,temp,re;
		temp = $i("refDinamico") ? tiporef = $i("refDinamico").value : tiporef = "fixo";
		if ($i("mapaReferencia")){
			temp = $i("maparefmaismenosZoom");
			if(tiporef === "dinamico"){
				i3GEO.php.referenciadinamica(i3GEO.maparef.processaImagem,i3GEO.maparef.fatorZoomDinamico,tiporef,i3GEO.maparef.W(),i3GEO.maparef.H());
				if(temp){temp.style.display="inline";}
			}
			//depreciado
			if(tiporef === "fixo"){
				//
				//no modo cgi ativado, a obten&ccedil;&atilde;o da imagem &eacute; feita de forma diferente do modo normal do mapa
				//
				if(i3GEO.parametros.utilizacgi.toLowerCase() !== "sim"){
					//
					//se o valor do tamanho da celula j&aacute; existir, n&atilde;o &eacute; necess&aacute;rio redesenhar a imagem
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
				}
			}
			if(tiporef === "mapa"){
				i3GEO.php.referenciadinamica(i3GEO.maparef.processaImagem,i3GEO.maparef.fatorZoomDinamico,tiporef,i3GEO.maparef.W(),i3GEO.maparef.H());
				if(temp){temp.style.display="inline";}
			}
		}
		else{
			i3GEO.eventos.NAVEGAMAPA.remove("i3GEO.maparef.atualiza()");
		}
	},
	/*
	Substitu&iacute; a imagem do mapa de refer&ecirc;ncia pela &uacute;ltima gerada.

	Esta fun&ccedil;&atilde;o processa os dados de uma chamada AJAX para atualizar o mapa de refer&ecirc;ncia

	Parametro:

	retorno - string no formato "var refimagem='nome da imagem'".
	*/
	processaImagem: function(retorno){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.maparef.processaImagem()");}
		var m,box,temp,
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
	Atualiza o tamanho e a posi&ccedil;&atilde;o do box que indica a extens&atilde;o geogr&aacute;fica do mapa atual

	O box &eacute; um div com id = "boxref".

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
		box.style.top = parseInt(box.style.top,10)+4 + "px";
		box.style.left = parseInt(box.style.left,10)+4 + "px";
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
			if (navm){novoel.style.filter='alpha(opacity=40)';}
			else{novoel.style.opacity= 0.4;}
			$i("mapaReferencia").appendChild(novoel);
			//
			//aplica os eventos de movimenta&ccedil;&atilde;o sobre o box azul
			//
			boxrefdd = new YAHOO.util.DD("boxref");
			//
			//atualiza o mapa principal quando o box &eacute; modificado manualmente
			//
			novoel.onmouseup = function(){
				var rect,telaminx,telamaxx,telaminy,m,x,ext;
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
	Ocorre quando o usu&aacute;rio clica sobre o mapa de refer&ecirc;ncia, deslocando o mapa principal
	*/
	click: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.maparef.click()");}
		if(i3GEO.Interface.ATUAL==="openlayers"){
			i3GEO.Interface.openlayers.pan2ponto(objposicaocursor.ddx,objposicaocursor.ddy);
			return;
		}
		try{
			i3GEO.php.pan(i3GEO.atualiza,i3GEO.parametros.mapscale,"ref",objposicaocursor.refx,objposicaocursor.refy);
		}
		catch(e){
			i3GEO.janela.fechaAguarde("i3GEO.atualiza");
			if(typeof(console) !== 'undefined'){console.error("i3GEO.mapaRef.click "+e);}
		}
	}
};
