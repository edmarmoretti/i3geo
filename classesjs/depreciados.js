/*
Title: Depreciados

Funções ou variáveis depreciadas. Mantidas aqui para efeitos de compatibilidade

Arquivo: i3geo/classesjs/depreciados.js

*/
function i3GEOmantemCompatibilidade(){
	try{
		i3GEO.configura.oMenuData = oMenuData;
	}
	catch(e){alert("funcao depreciada");}
	try{
		i3GEO.configura.tipoimagem = g_tipoimagem;
	}
	catch(e){alert("funcao depreciada");}
	try{
		i3GEO.configura.tipotip = g_tipotip;
	}
	catch(e){alert("funcao depreciada");}
	try{
		i3GEO.configura.funcaoTip = g_funcaoTip;
	}
	catch(e){alert("funcao depreciada");}

	try{
		i3GEO.configura.map3d = g_3dmap;
	}
	catch(e){alert("funcao depreciada");}
	try{
		i3GEO.configura.embedLegenda = g_embedLegenda;
	}
	catch(e){alert("funcao depreciada");}
	try{
		i3GEO.configura.templateLegenda = g_templateLegenda;
	}
	catch(e){alert("funcao depreciada");}
	try{
		if(objmapa.finaliza != "")
		i3GEO.finaliza = objmapa.finaliza;
	}catch(e){alert("funcao depreciada");};
	g_arvoreClick = "";
	g_arvoreClicks = "";

	if ($i("longlat")){
		atualizalonglat = function(){
			$i("longlat").innerHTML = objposicaocursor.dmsx + "   " +  objposicaocursor.dmsy;
		};
		YAHOO.util.Event.addListener($i("img"),"mousemove", atualizalonglat);
	}
	try {
		if (g_opcoesTemas == "nao")
		{i3GEO.arvoreDeCamadas.OPCOESTEMAS = false;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		i3GEO.maparef.fatorZoomDinamico = g_zoomRefDinamico;
	}
	catch(e){alert("funcao depreciada");};
	try {
		i3GEO.configura.mashuppar = g_mashuppar;
	}
	catch(e){alert("funcao depreciada");};
	try{
		//if($i("arvoreAdicionaTema") || $i("outrasOpcoesAdiciona")){
			if(!$i("arvoreAdicionaTema"))
			{i3GEO.arvoreDeTemas.IDHTML = objmapa.guiaMenu+"obj";}
			else
			{i3GEO.arvoreDeTemas.IDHTML = "arvoreAdicionaTema";}
		//}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_uploaddbf == "nao")
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.uploaddbf = false;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_uploadlocal == "nao")
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.uploadlocal = false;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_downloadbase == "nao")
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.downloadbase = false;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_conectarwms == "nao")
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.conectarwms = false;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_conectargeorss == "nao")
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.conectargeorss = false;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_nuvemTags == "nao")
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.nuvemTags = false;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_kml == "nao")
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.kml = false;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_qrcode == "nao")
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.qrcode = false;}
	}
	catch(e){alert("funcao depreciada");};
	try{
		if(g_tipoacao != "")
		{i3GEO.barraDeBotoes.BOTAOPADRAO = g_tipoacao;}
	}
	catch(e){alert("funcao depreciada");}
	try {
		if (g_listaPropriedades)
		{i3GEO.configura.listaDePropriedadesDoMapa = g_listaPropriedades;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_tempo_aplicar)
		{i3GEO.configura.tempoAplicar = g_tempo_aplicar;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_janelaMen == "nao")
		{i3GEO.configura.iniciaJanelaMensagens = false;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_locaplic)
		{i3GEO.configura.locaplic = g_locaplic;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_tempotip)
		{i3GEO.configura.tempoMouseParado = g_tempotip;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_mostraRosa)
		{i3GEO.configura.mostraRosaDosVentos = g_mostraRosa;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_visual)
		{i3GEO.configura.visual = g_visual;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_mapaRefDisplay)
		{i3GEO.configura.mapaRefDisplay = g_mapaRefDisplay;}
	}
	catch(e){alert("funcao depreciada");};
	try {
		if (g_docaguias)
		{i3GEO.configura.liberaGuias = g_docaguias;}
	}
	catch(e){alert("funcao depreciada");};
	if (window.location.href.split("?")[1]){
		g_sid = window.location.href.split("?")[1];
		if (g_sid.split("#")[0])
		{g_sid = g_sid.split("#")[0];}
	}
	else
	{g_sid = "";}
	i3GEO.configura.sid = g_sid;
	try{
		i3GEO.guias.ATUAL = g_guiaativa;
	}
	catch(e){alert("funcao depreciada");}
	try{
		i3GEO.navega.autoRedesenho.INTERVALO = g_autoRedesenho;
	}
	catch(e){alert("funcao depreciada");}
	try{
		i3GEO.eventos.NAVEGAMAPA = g_funcoesNavegaMapaDefault;
	}
	catch(e){alert("funcao depreciada");}
	try{
		i3GEO.eventos.MOUSEMOVE = g_funcoesMousemoveMapaDefault;
	}
	catch(e){alert("funcao depreciada");}
	try{
		i3GEO.eventos.MOUSECLIQUE = g_funcoesClickMapaDefault;
	}
	catch(e){alert("funcao depreciada");}
	try{
		i3GEO.configura.entorno = g_entorno;
	}
	catch(e){alert("funcao depreciada");}
	try{
		i3GEO.navega.lente.POSICAOX = g_posicaoLenteX = 0;
	}
	catch(e){alert("funcao depreciada");}
	try{
		i3GEO.navega.lente.POSICAOY = g_posicaoLenteY;
	}
	catch(e){alert("funcao depreciada");}
	try{
		i3GEO.navega.destacaTema.TAMANHO = destacaTamanho;
	}
	catch(e){alert("funcao depreciada");}
	if (!$i("tip")){
		var novoel = document.createElement("div");
		novoel.id = "tip";
		novoel.style.position="absolute";
		novoel.style.zIndex=5000;
		if (navm)
		{novoel.style.filter = "alpha(opacity=90)";}
		document.body.appendChild(novoel);
	}
	/*
	Function: atualizaListaTemas (depreciado)

	Atualiza a lista de temas disponíveis no mapa (guia com a lista de temas)
	*/
	try{
		objmapa.atualizaListaTemas = function(temas)
		{alert("atualizaListaTemas foi depreciado. Utilize i3GEO.arvoreDeCamadas")};
	}
	catch(e){alert("funcao depreciada");}
}

//
//
//
if(typeof(i3GEO) == 'undefined'){
	i3GEO = [];
}
cpObj = new cpaint();
cpObj.set_async("true");
cpObj.set_response_type("JSON");

/*
 Mapa (depreciado)
*/
function Mapa(e,m)
{
	alert("Funcao Mapa foi depreciada. Utilize i3GEO.cria()");
	i3GEO.cria();
	this.inicializa= function()
	{i3GEO.finaliza = this.finaliza;i3GEO.inicia();};
}
//
//funcoes depreciadas
//
objaguarde = {
	abre: function(){
		alert("objaguarde foi depreciada. Utilize i3GEO.janela");
		i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
	},
	fecha: function(){
		alert("objaguarde foi depreciada. Utilize i3GEO.janela");
		i3GEO.janela.fechaAguarde("i3GEO.atualiza");
	}
};
/*
 iCookie (depreciado)

Utilize i3GEO.util

Cria um cookie.
*/
function iCookie(nome,valor)
{
	alert("iCookie foi depreciado. Utilize i3GEO.util.insereCookie");
	i3GEO.util.insereCookie(nome,valor);
}
/*
 pCookie (depreciado)

Utilize i3GEO.util.pegaCookie
*/
function pCookie(nome)
{
	alert("pCookie foi depreciado. Utilize i3GEO.util.pegaCookie");
	i3GEO.util.pegaCookie(nome);
}
/*
 wdocaf (depreciado)
*/
function wdocaf(wlargura,waltura,wsrc,nx,ny,texto)
{alert("funcao depreciada");var janela = i3GEO.janela.cria(wlargura,waltura,wsrc,nx,ny,texto);}
/*
 wdocaf2 (depreciado)
*/
function wdocaf2(wlargura,waltura,wsrc,nx,ny,texto)
{
	alert("funcao depreciada");
	var id = YAHOO.util.Dom.generateId();
	i3GEO.janela.cria(wlargura,waltura,wsrc,nx,ny,texto,id,true);
}
function processevent1(exy1)
{alert("funcao depreciada");}
/*
 mensagemBanner (depreciado)
*/
function mensagemBanner()
{alert("funcao depreciada");}
function borra()
{alert("funcao depreciada");}
/*
 movecursor (depreciado)

Move o ícone que segue o mouse quando da movimentação sobre o mapa
*/
function movecursor()
{
	alert("funcao depreciada");
	//
	//se a interface openlayers ou flamingo estiver sendo usada, o ícone não é mostrado
	//'obj' é o elemento que guarda o ícone que segue o mouse
	//
	if ($i("obj"))
	{
		if ($i("openlayers") || $i("flamingo"))
		{$i("obj").style.display = "none";}
		else
		{
			var obje = $i("obj").style;
			if ($i("img"))
			{
				eval ("obje." + g_tipotop + "= objposicaocursor.telay + 9 + g_postpx");
				eval ("obje." + g_tipoleft + "= objposicaocursor.telax + 9 + g_postpx");
			}
			else
			{
				eval ("obje." + g_tipotop + "= objposicaocursor.telay - 15 + g_postpx");
				eval ("obje." + g_tipoleft + "= objposicaocursor.telax + 15 + g_postpx");
			}
		}
	}
	if($i("box1"))
	{
		var bx = $i("box1");
		if (bx.style.visibility != "visible")
		{
			//move o box para a posição correta
			bx.style.left = objposicaocursor.telax + g_postpx;
			bx.style.top = objposicaocursor.telay + g_postpx;
		}
	}
}
/*
 buscaRapida (depreciado)
*/
function buscaRapida()
{alert("funcao depreciada");i3geo_buscarapida()}
/*
 initJanelaZoom (depreciado)
*/
function initJanelaZoom(qual){
	alert("funcao depreciada");
	i3GEO.barraDeBotoes.reativa(qual-1);
}
/*
 sobeferramentas(depreciado)
*/
function sobeferramentas()
{alert("funcao depreciada");}
/*
 desceferramentas (depreciado)
*/
function desceferramentas()
{alert("funcao depreciada");}
/*
 arvoreclick (depreciado)

Marca o checkbox de adição de temas

Parameters:

itemID - ID que identifica qual tema foi clicado. O ID é definido no arquivo .map e no arquivo menutemas/menutemas.xml
*/
function arvoreclick(itemID)
{
	alert("funcao depreciada");
	if (itemID.search("tema") == 0)
	{
		if ($i(itemID).checked == true)
		{$i(itemID).checked = false;}
		else
		{$i(itemID).checked = true;}
	}
}
/*
 pegaTema (depreciado)

Pega o tema de um no na guia de temas.

Utilizado nas opções que operam sobre um tema específico.

Parameters:

celula - objeto que foi clicado

Returns:

Id do tema.
*/
function pegaTema(celula)
{
alert("funcao depreciada");
	var nos = celula.parentNode.childNodes;
	var tempi = nos.length;
	for (var no=0;no<tempi; no++){if (nos[no].type == "checkbox"){return nos[no].value;}}
}
/*
 gerafilmef (depreciado)
*/
function gerafilmef(qs)
{alert("funcao depreciada");}
/*
 gravaQuadro (depreciado)
*/
function gravaQuadro(variavel,valor)
{alert("funcao depreciada");i3GEO.gadgets.quadros.grava(variavel,valor);}
/*
 avancaQuadro (depreciado)
*/
function avancaQuadro()
{alert("funcao depreciada");i3GEO.gadgets.quadros.avanca();}
/*
 zoomAnterior (depreciado)
*/
function zoomAnterior(){alert("funcao depreciada");
}
/*
 zoomProximo (depreciado)

*/
function zoomProximo(){alert("funcao depreciada");
}
/*
 opcoesQuadros (depreciado)
*/
function opcoesQuadros()
{alert("funcao depreciada");}
/*
 filmef
*/
function filmef(o)
{alert("funcao depreciada");}
/*
 rebobinaf (depreciado)
*/
function rebobinaf()
{alert("funcao depreciada");}
/*
 filmezf (depreciado)
*/
function filmezf(o)
{alert("funcao depreciada");}
/*
 quadrofilme (depreciado)
*/
function quadrofilme()
{alert("funcao depreciada");}
/*
 filmeanimaf (depreciado)
*/
function filmeanimaf()
{alert("funcao depreciada");}
/*
 filmeanimarodaf (depreciado)
*/
function filmeanimarodaf(janima)
{alert("funcao depreciada");}
/*
 pegaimagens (depreciado)
*/
function pegaimagens()
{alert("funcao depreciada");}
/*
Function calculaArea (depreciado)
*/
function calculaArea(pontos,pixel)
{alert("funcao depreciada");return (i3GEO.calculo.area(pontos,pixel));}
/*
 calculadistancia (depreciado)
*/
function calculadistancia(lga,lta,lgb,ltb) //0ms
{alert("funcao depreciada");return (i3GEO.calculo.distancia(lga,lta,lgb,ltb));}
/*
 initJanelaRef (depreciado)
*/
function initJanelaRef()
{alert("funcao depreciada");i3GEO.maparef.inicia();}
/*
Variable: g_mapaRefDisplay (depreciado)
*/
/*
 atualizaReferencia (depreciado)
*/
/*
 ajaxReferencia (depreciado)
*/
function ajaxReferencia(retorno)
{alert("funcao depreciada");i3GEO.maparef.processaImagem(retorno)}
/*
 clicouRef (depreciado)

Altera a abrangência do mapa quando o mapa de referência é clicado
*/
function clicouRef()
{alert("funcao depreciada");}
/*
 movimentoRef (depreciado)

Pega a coordenada do cursor sobre o mapa de referência
*/
function movimentoRef(obj)
{alert("funcao depreciada");}
/*
 mostraTip (depreciado)

Mostra a descrição de um elemento do mapa como uma etiqueta na posição do mouse.

Para que um tema tenha uma etiqueta, é necessário configurar o metadata TIP no map file.

Parameters:

retorno - retorno da função ajax com os dados para montar a etiqueta.
*/
function mostraTip(retorno)
{
	//insere div para tips
alert("funcao depreciada");
	if (!$i("tip")){
		var novoel = document.createElement("div");
		novoel.id = "tip";
		novoel.style.position="absolute";
		novoel.style.zIndex=5000;
		if (navm)
		{novoel.style.filter = "alpha(opacity=90)";}
		document.body.appendChild(novoel);
	}
	var i = $i("i3geo_rosa");
	if(i)
	i.style.display="none";
	var mostra = false;
	var retorno = retorno.data;
	if ((retorno != "erro") && (retorno != undefined))
	{
		if ($i("img"))
		{$i("img").title = "";}
		if (retorno != "")
		{
			var res = "<div id='cabecatip' style='text-align:left;background-color:rgb(240,240,240)'><span style='color:navy;cursor:pointer;text-align:left' onclick='javascript:objmapaparado=\"cancela\"'>parar&nbsp;&nbsp;</span>";
			res += "<span style='color:navy;cursor:pointer;text-align:left' onclick='javascript:i3GEO.janela.TIPS.push($i(\"tip\"));$i(\"tip\").id=\"\";$i(\"cabecatip\").innerHTML =\"\";$i(\"cabecatip\").id =\"\"' >fixar</span></div>";
			var temas = retorno.split("!");
			var tema = temas.length-1;
			if(tema >= 0)
			{
				do
				{
					var titulo = temas[tema].split("@");
					if (g_tipotip == "completo")
					{
						res += "<span style='text-align:left;font-size:9pt'><b>"+titulo[0]+"</b></span><br>";
					}
					var ocorrencias = titulo[1].split("*");
					var ocorrencia = ocorrencias.length-1;
					if(ocorrencia >= 0)
					{
						do
						{
							if (ocorrencias[ocorrencia] != "")
							{
								var pares = ocorrencias[ocorrencia].split("##");
								var paresi = pares.length;
								for (var par=0;par<paresi; par++)
								{
									var valores = pares[par].split("#");
									if (g_tipotip == "completo")
									{
										res = res + "<span class='tiptexto' style='text-align:left;font-size:9pt'>" + valores[0] + " <i>" + valores[1] + "</i></span><br>";
										var mostra = true;
									}
									else
									{
										res = res + "<span class='tiptexto' style='text-align:left;font-size:9pt'><i>" + valores[1] + "</i></span><br>";
										var mostra = true;
									}
								}
							}
						}
						while(ocorrencia--)
					}
				}
				while(tema--)
			}
			if(!mostra){$i("tip").style.display="none";return;}
			if ($i("janelaMen"))
			{$i("janelaMenTexto").innerHTML = res;}
			else
			{
				var i = $i("tip");
				i.innerHTML = "<table style='text-align:left'><tr><td style='text-align:left'>"+res+"</td></tr></table>";
				ist = i.style;
				ist.top = objposicaocursor.telay - 10;
				ist.left = objposicaocursor.telax - 20;
				ist.display="block";
			}
		}
	}
}
/*
 trataErro (depreciado)
*/
function trataErro()
{alert("funcao depreciada");i3GEO.janela.fechaAguarde();}
/*
 mostraguiaf (depreciado)
*/
function mostraguiaf(guia)
{alert("funcao depreciada");
	i3GEO.guias.mostra(guia);
	/*
	if ($i("guia"+guia))
	{
		var fs=[1,2,3,4,5,6,7,8,9,10,11,12];
		for (var j=0;j<10; j++)
		{
			if ($i("guia"+fs[j]))
			{
				jj = fs[j];
				if ($i("guia"+jj+"obj"))
				{$i("guia"+jj+"obj").style.display="none";}
				$i("guia"+fs[j]).parentNode.parentNode.style.background="transparent";
			}
		}
		if ($i("guia"+guia+"obj"))
		{
			$i("guia"+guia+"obj").style.display="block";
		}
		else
		{alert("O objeto guia"+guia+"obj nao existe.");}
		$i("guia"+guia).parentNode.parentNode.style.background="white";
	}
	*/
}
/*
 ativaGuias (depreciado)
*/
function ativaGuias()
{alert("funcao depreciada");
	//YAHOO.log("ativaGuias", "i3geo");
	//ajusta as guias da versão antiga do YUI para a nova
	//
	//pega o elemento onde as guias serão colocadas
	//
	for(var g=0;g<12;g++)
	{
		if ($i("guia"+g))
		var gpai = $i("guia"+g).parentNode;
	}
	//
	//monta as guias
	//
	if(gpai)
	{
		gpai.id = "guiasYUI";
		gpai.className = "yui-navset";
		var ins = '<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">';
		//
		//define os títulos das guias padrão
		//
		try{
			if($i(objmapa.guiaTemas))
			{$i(objmapa.guiaTemas).innerHTML = $trad("g1");}
			if($i(objmapa.guiaMenu))
			{$i(objmapa.guiaMenu).innerHTML = $trad("g2");}
			if($i(objmapa.guiaLegenda))
			{$i(objmapa.guiaLegenda).innerHTML = $trad("g3");}
			if($i(objmapa.guiaListaMapas))
			{$i(objmapa.guiaListaMapas).innerHTML = $trad("g4");}
		}
		catch(e){alert("funcao depreciada");};
		//
		//
		for(var g=0;g<12;g++)
		{
			if ($i("guia"+g))
			{
				//
				//pega os títulos das guias, inclusive as que não são padrão
				//
				var tituloguia = $i("guia"+g).innerHTML;
				//
				//remove os espaços em branco 
				//necessário para manter compatibilidade com versões antigas do i3geo
				//
				var re = new RegExp("&nbsp;", "g");
				var tituloguia = tituloguia.replace(re,'');
				//
				//monta o título das guias
				//
				ins += '<li><a href="#"><em><div id="guia'+g+'" >'+tituloguia+'</div></em></a></li>';
			}
		}
		ins += "</ul>";
		//
		//insere as guias em gpai
		//
		gpai.innerHTML = ins;
		for(var g=0;g<12;g++)
		{
			if ($i("guia"+g))
			{
				eval('$i("guia'+g+'").onclick = function(){g_guiaativa = "guia'+g+'";mostraguiaf('+g+');}');
				$i("guia"+g).onmouseover = function()
				{
					var bcg = this.parentNode.parentNode.style;
					var cor = bcg.background.split(" ")[0];
					if(cor != "white")
					bcg.background = "#bfdaff";
				};
				$i("guia"+g).onmouseout = function()
				{
					var bcg = this.parentNode.parentNode.style;
					var cor = bcg.background.split(" ")[0];
					if(cor != "white")
					bcg.background = "transparent";
				};
				if($i("guia"+g+"obj"))
				{
					$i("guia"+g+"obj").style.overflow="auto";
					$i("guia"+g+"obj").style.height = i3GEO.parametros.h;
				}
			}
		}
	}
	//
	//define a função que será executada quando o usuário clica em uma guia padrão
	//
	if ($i(objmapa.guiaTemas))
	{
		$i(objmapa.guiaTemas).onclick = function()
		{
			g_guiaativa = objmapa.guiaTemas;mostraguiaf(1);
		};
	}
	if ($i(objmapa.guiaMenu))
	{
		$i(objmapa.guiaMenu).onclick = function()
		{
			g_guiaativa = objmapa.guiaMenu;
			mostraguiaf(2);
			//pega a lista de árvores que devem ser montadas
			//é executado apenas se não existir o id=arvoreAdicionaTema
			//caso contrário, a árvore é montada na inicialização do i3geo
			if(!$i("arvoreAdicionaTema"))
			{var ondeArvore = objmapa.guiaMenu+"obj";}
			else
			{var ondeArvore = "arvoreAdicionaTema";}
			//
			//para efeitos de compatibilidade
			//
			if(document.getElementById("outrasOpcoesAdiciona"))
			{
				i3GEO.arvoreDeTemas.OPCOESADICIONAIS.idonde = "outrasOpcoesAdiciona";
				i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluiArvore = false;
			}
			//
			//cria a árvore
			//
			i3GEO.arvoreDeTemas.cria(i3GEO.configura.sid,i3GEO.configura.locaplic,ondeArvore);
		};
	}
	if($i(objmapa.guiaLegenda))
	{
		$i(objmapa.guiaLegenda).onclick = function()
		{g_guiaativa = objmapa.guiaLegenda;mostraguiaf(4);objmapa.atualizaLegendaHTML();};
	}
	if ($i(objmapa.guiaListaMapas))
	{
		$i(objmapa.guiaListaMapas).onclick = function()
		{
			g_guiaativa = objmapa.guiaListaMapas;
			mostraguiaf(5);
			if ($i("banners"))
			{
				$i("banners").innerHTML == $trad("o1");
				var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaMapas&g_sid="+i3GEO.configura.sid;
				cpObj.call(p,"pegaMapas",pegaMapas);
			}
			else
			{alert("id banners nao encontrado");}
		};
	}
	//YAHOO.log("Fim ativaGuias", "i3geo");
}
/*
 docaguias (depreciado)
*/
function docaguias()
{alert("funcao depreciada");i3GEO.guias.libera();}
/*
 autoRedesenho (depreciado)
*/
function autoRedesenho(opcao)
{alert("funcao depreciada");}
/*
Function selecao (depreciado)
*/
function selecao()
{alert("funcao depreciada");}
/*
 cliqueSelecao (depreciado)
*/
function cliqueSelecao()
{alert("funcao depreciada");}
/*
 zoomboxf (depreciado)
*/
function zoomboxf(tipo)
{alert("funcao depreciada");}
/*
 i3geo_comboGruposMenu (depreciado)
*/
function i3geo_comboGruposMenu(funcaoOnchange,idDestino,idCombo,largura,altura)
{alert("funcao depreciada");}
/*
 i3geo_comboSubGruposMenu (depreciado)
*/
function i3geo_comboSubGruposMenu(funcaoOnchange,idDestino,idCombo,idGrupo,largura,altura)
{alert("funcao depreciada");}
/*
 i3geo_comboTemasMenu (depreciado)
*/
function i3geo_comboTemasMenu(funcaoOnchange,idDestino,idCombo,idGrupo,idSubGrupo,largura,altura)
{alert("funcao depreciada");}
/*
 remapaf (depreciado)
*/
function remapaf()
{i3GEO.atualiza("");alert("funcao depreciada");}
/*
 limpacontainerf (depreciado)
*/
function limpacontainerf()
{alert("funcao depreciada");}
/*
 inseremarcaf (depreciado)
*/
function inseremarcaf(xi,yi,funcaoOnclick,container)
{alert("funcao depreciada");i3GEO.utl.insereMarca.cria(xi,yi,funcaoOnclick,container)}
/*
Function moveSelecaoPoli (depreciado)
*/
function moveSelecaoPoli()
{alert("funcao depreciada");}
/*
 cliqueSelecaoPoli (depreciado)
*/
function cliqueSelecaoPoli()
{alert("funcao depreciada");}
/*
 ativaEntorno (depreciado)
*/
function ativaEntorno()
{alert("funcao depreciada");}
/*
 geraURLentorno (depreciado)
*/
function geraURLentorno()
{alert("funcao depreciada");}
/*
 ajustaEntorno
*/
function ajustaEntorno()
{alert("funcao depreciada");}
/*
 ajaxabrelente (depreciado)
*/
function ajaxabrelente(retorno)
{alert("funcao depreciada");}
/*
 movelentef (depreciado)
*/
function movelentef()
{alert("funcao depreciada");}
/*
 ativaClicks (depreciado)
*/
function ativaClicks(docMapa)
{alert("funcao depreciada");}
/*
 incluir (depreciado)
*/
function incluir(path)
{i3GEO.util.adicionaSHP(path);alert("funcao depreciada");}
/*
 pontosdist(depreciado)
*/
function pontosdist()
{
	this.xpt = [];
	this.ypt = [];
	this.dist = [];
	this.xtela = [];
	this.ytela = [];
	this.ximg = [];
	this.yimg = [];
	this.linhas = [];
	alert("funcao depreciada");
}
/*
 mudaiconf (depreciado)
*/
function mudaiconf(i)
{i3GEO.barraDeBotoes.ativaIcone(i);alert("funcao depreciada");}
/*
 calcposf (depreciado)
*/
function calcposf()
{i3GEO.mapa.ajustaPosicao();alert("funcao depreciada");}
/*
 recuperamapa (depreciado)
*/
function recuperamapa()
{alert("funcao depreciada");}
/*
 desenhoRichdraw (depreciado)
*/
function desenhoRichdraw(tipo,objeto,n)
{alert("funcao depreciada");}
/*
 ajaxhttp (depreciado)

Cria o objeto http utilizado nas funções Ajax.

Returns:

Objeto httprequest.

See Also:

<ajaxexecAS>
*/
function ajaxhttp()
{alert("funcao depreciada");
	try
	{var objhttp1 = new XMLHttpRequest();}
	catch(ee)
	{
		try{var objhttp1 = new ActiveXObject("Msxml2.XMLHTTP");}
		catch(e)
		{
			try{var objhttp1 = new ActiveXObject("Microsoft.XMLHTTP");}
			catch(E)
			{var objhttp1 = false;}
		}
	}
	return(objhttp1);
}
/*
 ajaxexecAS (depreciado)

Executa uma chamada ajax no modo assíncrono.

Parameters:

programa - programa que será executado.
funcao - função que tratará o resultado.

Returns:

O resultado em uma variável. Se o retorno contiver a palavra "Erro", é gerado um alert.

See Also:

<ajaxhttp>
*/
function ajaxexecAS(programa,funcao)
{alert("funcao depreciada");
	var ohttp = ajaxhttp();
	ohttp.open("POST",programa,true);
	var retorno = "";
	ohttp.onreadystatechange=function()
	{
		if (ohttp.readyState==4)
		{
			retorno = ohttp.responseText;
			var reg = /Warning/gi;
			if (retorno.search(reg) != -1)
			{
				alert("OOps! Ocorreu um erro\n"+retorno);
				return;
			}
			var reg = /erro/gi;
			if (retorno.search(reg) != -1)
			{
				alert("OOps! Ocorreu um erro\n"+retorno);
				return;
			}
			if (funcao != "volta")
			{eval(funcao+'("'+retorno+'")');}
		}
	};
	ohttp.send(null);
}
/*
 ajaxexec (depreciado)

Executa uma chamada ajax no modo síncrono.

Parameters:

programa - programa que será executado.
funcao - função que tratará o resultado.

Returns:

O resultado em uma variável. Se o retorno contiver a palavra "Erro", é gerado um alert.

See Also:

<ajaxhttp>
*/
function ajaxexec(programa,funcao)
{alert("funcao depreciada");
	var objhttp = ajaxhttp();
	objhttp.open('GET', programa, false);
	objhttp.send(null);
	if(objhttp.status == 200)
	{
		if (funcao != "volta")
		{eval(funcao+'("'+objhttp.responseText+'")');}
		else
		{return objhttp.responseText;}
	}
}
/*
 ajaxLegendaHTML (depreciado)
*/
function ajaxLegendaHTML(retorno)
{alert("funcao depreciada");}
/*
 ajaxLegendaImagem (depreciado)
*/
function ajaxLegendaImagem(retorno)
{alert("funcao depreciada");}
/*
 mede (depreciado)
*/
function mede()
{alert("funcao depreciada");}
/*
 cliqueMede (depreciado)
*/
function cliqueMede()
{alert("funcao depreciada");}
/*
Function moveMede (depreciado)
*/
function moveMede()
{alert("funcao depreciada");}
/*
 area (depreciado)
*/
function area()
{alert("funcao depreciada");}
/*
 cliqueArea (depreciado)
*/
function cliqueArea()
{alert("funcao depreciada");}
/*
Function moveArea (depreciado)
*/
function moveArea()
{alert("funcao depreciada");}
/*
 textofid (depreciado)
*/
function textofid()
{alert("funcao depreciada");}
/*
 inserexy (depreciado)
*/
function inserexy()
{alert("funcao depreciada");}
/*
 cliqueInseretoponimo (depreciado)
*/
function cliqueInseretoponimo()
{alert("funcao depreciada");}
/*
 cliqueInserexy (depreciado)
*/
function cliqueInserexy()
{alert("funcao depreciada");}
/*
 inseregrafico (depreciado)
*/
function inseregrafico()
{alert("funcao depreciada");}
/*
 cliqueInseregrafico (depreciado)
*/
function cliqueInseregrafico()
{alert("funcao depreciada");}
/*
 ativaHistoricoZoom (depreciado)
*/
function ativaHistoricoZoom(iddiv)
{alert("funcao depreciada");}
function ajaxhttp(){
	alert("funcao depreciada");
	return i3GEO.util.ajaxhttp();
}
/*
 ajaxCorpoMapa (depreciado)
*/
function ajaxCorpoMapa(retorno)
{i3GEO.mapa.corpo.veirifca(retorno);alert("funcao depreciada");}
/*
 ajaxredesenha (depreciado)
*/
function ajaxredesenha(retorno)
{i3GEO.atualiza(retorno);alert("funcao depreciada");}
/*
 ajaxIniciaParametros (depreciado)
*/
function ajaxIniciaParametros(retorno)
{i3GEO.atualiza(retorno);alert("funcao depreciada");}
/*
montaMenuSuspenso (depreciado)
*/
function montaMenuSuspenso(iddiv){
	i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.idhtml = iddiv;
	i3GEO.gadgets.mostraMenuSuspenso();
	alert("funcao depreciada");
}

//YAHOO.log("carregou depreciados", "Classes i3geo");