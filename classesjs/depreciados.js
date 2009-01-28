//
//acerta algumas variáveis para efeitos de compatibilidade
//
function i3GEOmantemCompatibilidade(){
	try{
		if(objmapa.finaliza != "")
		i3GEO.finaliza = objmapa.finaliza
	}catch(e){};


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
	catch(e){};
	try {
		i3GEO.maparef.fatorZoomDinamico = g_zoomRefDinamico;
	}
	catch(e){};
	try {
		i3GEO.configura.mashuppar = g_mashuppar;
	}
	catch(e){};
	try{
		//if($i("arvoreAdicionaTema") || $i("outrasOpcoesAdiciona")){
			if(!$i("arvoreAdicionaTema"))
			{i3GEO.arvoreDeTemas.IDHTML = objmapa.guiaMenu+"obj";}
			else
			{i3GEO.arvoreDeTemas.IDHTML = "arvoreAdicionaTema";}				
		//}
	}
	catch(e){};
	try {
		if (g_uploaddbf == "nao")
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.uploaddbf = false;}
	}
	catch(e){};
	try {
		if (g_uploadlocal == "nao")
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.uploadlocal = false;}
	}
	catch(e){};
	try {
		if (g_downloadbase == "nao")
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.downloadbase = false;}
	}
	catch(e){};
	try {
		if (g_conectarwms == "nao")
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.conectarwms = false;}
	}
	catch(e){};
	try {
		if (g_conectargeorss == "nao")
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.conectargeorss = false;}
	}
	catch(e){};
	try {
		if (g_nuvemTags == "nao")	
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.nuvemTags = false;}
	}
	catch(e){};
	try {
		if (g_kml == "nao")	
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.kml = false;}
	}
	catch(e){};
	try {
		if (g_qrcode == "nao")	
		{i3GEO.arvoreDeTemas.OPCOESADICIONAIS.qrcode = false;}
	}
	catch(e){};
	try{
		if(g_tipoacao != "")
		{i3GEO.barraDeBotoes.BOTAOPADRAO = g_tipoacao;}
	}
	catch(e){}			
	try {
		if (g_listaPropriedades)
		{i3GEO.configura.listaDePropriedadesDoMapa = g_listaPropriedades;}
	}
	catch(e){};
	try {
		if (g_tempo_aplicar)
		{i3GEO.configura.tempoAplicar = g_tempo_aplicar;}
	}
	catch(e){};
	try {
		if (g_janelaMen == "nao")
		{i3GEO.configura.iniciaJanelaMensagens = false;}
	}
	catch(e){};
	try {
		if (g_locaplic)
		{i3GEO.configura.locaplic = g_locaplic;}
	}
	catch(e){};
	try {
		if (g_tempotip)
		{i3GEO.configura.tempoMouseParado = g_tempotip;}
	}
	catch(e){};
	try {
		if (g_mostraRosa)
		{i3GEO.configura.mostraRosaDosVentos = g_mostraRosa;}
	}
	catch(e){};
	try {
		if (g_visual)
		{i3GEO.configura.visual = g_visual;}
	}
	catch(e){};
	try {
		if (g_mapaRefDisplay)
		{i3GEO.configura.mapaRefDisplay = g_mapaRefDisplay;}
	}
	catch(e){};
	try {
		if (g_docaguias)
		{i3GEO.configura.liberaGUias = g_docaguias;}
	}
	catch(e){};
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
	catch(e){}
	try{
		i3GEO.navega.autoRedesenho.INTERVALO = g_autoRedesenho;
	}
	catch(e){}
	try{
		i3GEO.eventos.NAVEGAMAPA = g_funcoesNavegaMapaDefault;
	}
	catch(e){}
	try{
		i3GEO.eventos.MOUSEMOVE = g_funcoesMousemoveMapaDefault;
	}
	catch(e){}
	try{
		i3GEO.eventos.MOUSECLIQUE = g_funcoesClickMapaDefault;
	}
	catch(e){}
	try{
		i3GEO.configura.entorno = g_entorno;
	}
	catch(e){}
	try{
		i3GEO.navega.lente.POSICAOX = g_posicaoLenteX = 0;
	}
	catch(e){}
	try{
		i3GEO.navega.lente.POSICAOY = g_posicaoLenteY;
	}
	catch(e){}
	try{
		i3GEO.navega.destacaTema.TAMANHO = destacaTamanho;
	}
	catch(e){}
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
	catch(e){}
}

//
//
//
if(typeof(i3GEO) == 'undefined'){
	i3GEO = new Array();
}
cpObj = new cpaint();
cpObj.set_async("true");
cpObj.set_response_type("JSON");

/*
Class: Mapa (depreciado)
*/
function Mapa(e,m)
{
	i3GEO.cria();
	this.inicializa= function()
	{i3GEO.inicia();};	
}
//
//funcoes depreciadas
//
objaguarde = {
	abre: function(){
		i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
	},
	fecha: function(){
		i3GEO.janela.fechaAguarde("i3GEO.atualiza");
	}
}
/*
Function: iCookie (depreciado)

Utilize i3GEO.util

Cria um cookie.
*/
function iCookie(nome,valor)
{i3GEO.util.insereCookie(nome,valor);}
/*
Function: pCookie (depreciado)

Utilize i3GEO.util.pegaCookie
*/
function pCookie(nome)
{i3GEO.util.pegaCookie(nome);}
/*
Function: trocalingua (depreciado)

Utilize i3GEO.idioma.trocaIdioma
*/
function trocalingua(l)
{i3GEO.idioma.trocaIdioma(l);alert("trocalingua foi depreciado utilize i3GEO.idioma");}
/*
Function: initJanelaMen (depreciado)
*/
function initJanelaMen()
{i3GEO.ajuda.abreJanela();alert("initJanelaMen foi depreciado utilize i3GEO.ajuda");}
/* 
Function: pegalistademenus (depreciado)
*/
function pegalistademenus(retorno)
{alert("Funcao pegalistademenus foi depreciado. Utilize i3GEO.arvoreDeTemas");}
/*
Function: wdocaf (depreciado)
*/
function wdocaf(wlargura,waltura,wsrc,nx,ny,texto)
{var janela = i3GEO.janela.cria(wlargura,waltura,wsrc,nx,ny,texto);}
/*
Function: redimwdocaf (depreciado)
*/
function redimwdocaf(w,h)
{i3GEO.janela.alteraTamanho(w,h);alert("redimwdocaf foi depreciado utilize i3GEO.janela");}
/*
Function: wdocaf2 (depreciado)
*/
function wdocaf2(wlargura,waltura,wsrc,nx,ny,texto)
{
	var id = YAHOO.util.Dom.generateId();
	i3GEO.janela.cria(wlargura,waltura,wsrc,nx,ny,texto,id,true);
}
/*
Function: wdocafechaf (depreciado)
*/
function wdocafechaf(odoca)
{alert("wdocafechaf foi depreciado");}
/*
Function: mostradicasf (depreciado)
*/
function mostradicasf(objeto,dica,hlpt)
{i3GEO.ajuda.mostraJanela(dica);alert("mostradicasf foi depreciado utilize i3GEO.ajuda");}	
/*
Function: mudaboxnf (depreciado)
*/
function mudaboxnf(tipo,obj,nomeFuncao)
{alert("mudaboxnf foi depreciado");}
/*
Function: inverteStatusClasse (depreciado)
*/
/*
Function: procurartemas (depreciado)

Localiza um tema no menu de temas.
*/
function procurartemas(texto)
{alert("procurartemas foi depreciado");}
/*
Function: expandeTema (depreciado)

*/
function expandeTema(itemID)
{
	//verifica se clicou para expandir a legenda
	var tema = itemID.split("legenda");
	if (tema.length == 2)
	{
		g_arvoreClick = itemID;
		tema = tema[1];
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaHTML&template=legenda2.htm&tema="+tema+"&g_sid="+g_sid;
		cpObj.call(p,"criaLegenda",expandeLegendaVer);
	}
	alert("expandeTema foi depreciado");
}
/*
Function: expandeGrupo (depreciado)
*/
/*
Function: processaGrupos (depreciado)
*/
/*
Function: pegavalSistemas (depreciado)

Adiciona uma árvore no menu de adição de temas, contendo os sistemas que podem ser executados.
*/
function pegavalSistemas(sis)
{alert("Funcao pegavalSistemas foi depreciada - veja i3GEO.arvoreDeTemas");}
/*
Function: processevent1 (depreciado)

Captura a posição do mouse tendo como referência o navegador.

Atualiza o objeto objposicaomouse e movimenta as janelas docáveis.

Recalcula a posição correta da imagem do mapa.

Parameters:

exy1 - objeto evento.
*/
function processevent1(exy1)
{}
/*
Function: ativaDragDrop (depreciado)

Ativa a funcionalidade de arrastar e soltar para alteração da ordem de desenho dos temas e para excluir um tema do mapa.
*/
/*
Function: removeAcentos (depreciado)
*/
function removeAcentos(palavra)
{
	return(i3GEO.util.removeAcentos(palavra));
	alert("removeAcentos foi depreciado utilize i3GEO.util");
}
/*
Function: ativaMensagemBanner (depreciado
*/
function ativaMensagemBanner()
{alert("ativaMensagemBanner fooi depreciado utilize i3GEO.ajuda");}
/*
Function: mensagemBanner (depreciado)
*/
function mensagemBanner()
{}
/*
Function: mensagemf (depreciado)

Abre uma mensagem na tela em um DIV.

A mensagem é incluída em um elemento HTML com id ="mensagem"

Parameters:

m - mensagem que será mostrada.
*/
function mensagemf(m)
{
	alert("mensagemf foi depreciado");
	try
	{
		//insere o div para mensagens
		if (!$i("mensagem"))
		{
			var novoel = document.createElement("div");
			novoel.id = 'mensagem';
			novoel.innerHTML = '<table width="50" style="border: 1px solid #000000;"> <tr> <td onclick="mensagemf()" style="text-align:left;cursor:pointer" class="tdclara"> <img src="'+g_locaplic+'/imagens/excluir.png" /> </td> <td style="text-align:left" class="tdclara"> <input style="text-align:left" class="textocb" type="text" id="mensagemt" size="70" value="" /> </td></tr> </table>';
			if($i("i3geo"))
			{$i("i3geo").appendChild(novoel);}
			else
			{document.body.appendChild(novoel);}
		}
		if (m == null)
		{$i("mensagem").style.visibility = "hidden";}
		else
		{
			$i("mensagemt").value = m;
			$i("mensagem").style.visibility = "visible";
		}
		var pos = pegaPosicaoObjeto($i("img"));
		pos[1] = pos[1] + parseInt($i("img").style.height) - 22;
		eval ('document.getElementById("mensagem").style.' + g_tipoleft + ' = pos[0] + g_postpx');
		eval ('document.getElementById("mensagem").style.' + g_tipotop + ' = pos[1] + g_postpx');
	}
	catch(e){alert("Impossivel criar mensagem."+e);}
}
/*
Function: aguarde (depreciado)
*/
function aguarde()
{
	alert("aguarde foi depreciado utilize i3GEO.janela");
	this.abre = function(aguardeId,texto)
	{
		i3GEO.janela.abreAguarde(aguardeId,texto);		
	};
	this.fecha = function(aguardeId)
	{
		i3GEO.janela.fechaAguarde(aguardeId);
	};
}
/*
Function: zoomiauto (depreciado)
*/
function zoomiauto()
{alert("zoomiauto foi depreciado utilize i3GEO.navega");i3GEO.navega.zoomin(g_locaplic,g_sid);}
/*
Function: zoomoauto (depreciado)
*/
function zoomoauto()
{alert("zoomoauto foi depreciado utilize i3GEO.navega");i3GEO.navega.zoomout(g_locaplic,g_sid);}
/*
Function: convdmsddf (depreciado)
*/
function convdmsddf(cd,cm,cs)
{alert("convdmsddf foi depreciado utilize i3GEO.calculo");return (i3GEO.calculo.dsm2dd(cd,cm,cs));}
/*
Function: zoomPonto (depreciado)
*/
function zoomPonto()
{alert("utilize i3GEO.navega.zoomponto");}
/*
Function: zoomIP (depreciado)
*/
function zoomIP()
{alert("zoomIP foi depreciado. Utilize i3GEO.navega.zoomIP");}
/*
Function: zoomtot
*/
function zoomtot()
{alert("zoomtot foi depreciado. Utilize i3GEO.navega.zoomExt");}
/*
Function: atualizaFarol (depreciado)
*/
/*
Function: panFixo (depreciado)
*/
function panFixo(direcao,w,h,escala)
{alert("panFixo foi depreciado. Utilize i3GEO.navega.panFixo");}
/*
Function: protocolo (depreciado)

Utilize i3GEO.util
*/
function protocolo()
{alert("protocolo foi depreciado utilize i3GEO.util");return(i3GEO.util.protocolo());}
//Mantido aqui apenas para fins de compatibilidade
function borra()
{}
/*
Function: pegaPosicaoObjeto (depreciado)
*/
function pegaPosicaoObjeto(obj)
{alert("pegaPosicaoObjeto foi depreciado utilize i3GEO.util");return(i3GEO.util.pegaPosicaoObjeto(obj));}
/*
Function: i3geo_pegaElementoPai (depreciado)
*/
function i3geo_pegaElementoPai(e)
{alert("i3geo_pegaElementoPai foi depreciado utilize i3GEO.util");return(i3GEO.util.pegaElementoPai(e));}
/*
Function: convddtela (depreciado)
*/
function convddtela(vx,vy,docmapa)
{alert("convddtela foi depreciado utilize i3GEO.calculo");return(i3GEO.calculo.dd2tela(vx,vy,docmapa,i3GEO.parametros.extent,i3GEO.parametros.pixelsize));}
/*
Function: convdmsf (depreciado)
*/
function convdmsf(x,y)
{alert("convdmsf foi depreciado utilize i3GEO.calculo");return(i3GEO.calculo.dd2dms(x,y));}
/*
Function: calcddf (depreciado)
*/
function calcddf(xfign,yfign,g_celula,imgext)
{alert("calcddf foi depreciado utilize i3GEO.calculo");return(i3GEO.calculo.tela2dd(xfign,yfign,g_celula,imgext));}
/*
Function: movecursor (depreciado)

Move o ícone que segue o mouse quando da movimentação sobre o mapa
*/
function movecursor()
{
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
Variable: g_janelaMen (depreciado)
*/
/*
Variable: g_downloadbase (depreciado)

Define se na árvore de adição de temas, será mostrada a opção de download dos dados.
*/
/*
Variable: g_conectargeorss (depreciado)

Define se na árvore de adição de temas, será mostrada a opção de conexão com GeoRSS.
*/
/*
Variable: g_nuvemTags (depreciado)

Define se na árvore de adição de temas, será mostrada a opção de busca de temas por tags.
*/
/*
Variable: g_uploadlocal (depreciado)

Define se na árvore de adição de temas, será mostrada a opção de upload.
*/
/*
Variable: g_uploaddbf (depreciado)

Define se na árvore de adição de temas, será mostrada a opção de upload de arquivo dbf.
*/
/*
Variable: g_conectarwms (depreciado)

Define se na árvore de adição de temas, será mostrada a opção de conexão com WMS.
*/
/*
Variable: g_funcoesMouseParado (depreciado)
*/
/*
Variable: g_tempotip (depreciado)
*/
/*
Variable: g_mostraRosa (depreciado)
*/

/*
Function: pegaCoordenadaUTM (depreciado)
*/
function pegaCoordenadaUTM()
{alert("pegaCoordenadaUTM foi depreciado utilize i3GEO.gadgets");i3GEO.gadgets.mostraCoordenadasUTM(g_locaplic,"mostraUTM");}
/*
Function: ativaLocalizarxy (depreciado)
*/	
function ativaLocalizarxy(iddiv)
{alert("ativaLocalizarxy foi depreciado utilize i3GEO.gadgets");i3GEO.gadgets.mostraCoordenadasGEO(iddiv);}
/*
Function: ativaEscalaNumerica (depreciado)
*/	
function ativaEscalaNumerica(iddiv)
{alert("ativaEscalaNumerica foi depreciado utilize i3GEO.gadgets");i3GEO.gadgets.mostraEscalaNumerica(iddiv);}
/*
Function: ativaBuscaRapida (depreciado)
*/	
function ativaBuscaRapida(iddiv)
{alert("ativaBuscaRapida foi depreciado utilize i3GEO.gadgets");i3GEO.gadgets.mostraBuscaRapida(iddiv);}
/*
Function: buscaRapida (depreciado)
*/
function buscaRapida()
{i3geo_buscarapida()}
/*
Function: criaboxg (depreciado)
*/
function criaboxg()
{
	i3GEO.util.criaBox();
	i3GEO.util.criaPin();
	alert("criaboxg foi depreciado utilize i3GEO.util");
}
/*
Function: initJanelaZoom (depreciado)
*/
function initJanelaZoom(qual)
{alert("initJanelaZoom foi depreciado. Utilize i3GEO.barraDeBotoes");}
/*
Function: sobeferramentas(depreciado)
*/
function sobeferramentas()
{}
/*
Function: desceferramentas (depreciado)
*/
function desceferramentas()
{}
/*
Function: mostraRosaDosVentos (depreciado)
*/
function mostraRosaDosVentos()
{alert("mostraRosaDosVentos foi depreciado utilize i3GEO.navega");i3GEO.navega.mostraRosaDosVentos();}
/*
Function: mudaVisual (depreciado)
*/
function mudaVisual(visual)
{alert("visual foi depreciado utilize i3GEO.visual");i3GEO.gadgets.visual.troca(visual);}
/*
Function: visual (depreciado)
*/
function visual(iddiv)
{alert("visual foi depreciado utilize i3GEO.visual");i3GEO.gadgets.visual.inicia(iddiv);}
/*
Function: arvoreclick (depreciado)

Marca o checkbox de adição de temas

Parameters:

itemID - ID que identifica qual tema foi clicado. O ID é definido no arquivo .map e no arquivo menutemas/menutemas.xml
*/
function arvoreclick(itemID)
{
	if (itemID.search("tema") == 0)
	{
		if ($i(itemID).checked == true)
		{$i(itemID).checked = false;}
		else
		{$i(itemID).checked = true;}
	}
}
/*
Function: pegaTema (depreciado)

Pega o tema de um no na guia de temas.

Utilizado nas opções que operam sobre um tema específico.

Parameters:

celula - objeto que foi clicado

Returns:

Id do tema.
*/
function pegaTema(celula)
{
	var nos = celula.parentNode.childNodes;
	var tempi = nos.length;
	for (var no=0;no<tempi; no++){if (nos[no].type == "checkbox"){return nos[no].value;}}
}
/*
Function: gerafilmef (depreciado)
*/
function gerafilmef(qs)
{}
/*
Function: gravaQuadro (depreciado)
*/
function gravaQuadro(variavel,valor)
{i3GEO.gadgets.quadros.grava(variavel,valor);}
/*
Function: avancaQuadro (depreciado)
*/
function avancaQuadro()
{i3GEO.gadgets.quadros.avanca();}
/*
Function: zoomAnterior (depreciado)
*/
function zoomAnterior(){
}
/*
Function: zoomProximo (depreciado)

*/
function zoomProximo(){
}
/*
Function: opcoesQuadros (depreciado)
*/
function opcoesQuadros()
{}
/*
Function: filmef
*/
function filmef(o)
{}
/*
Function: rebobinaf (depreciado)
*/
function rebobinaf()
{}
/*
Function: filmezf (depreciado)
*/
function filmezf(o)
{}
/*
Function: quadrofilme (depreciado)
*/
function quadrofilme()
{}
/*
Function: filmeanimaf (depreciado)
*/
function filmeanimaf()
{}
/*
Function: filmeanimarodaf (depreciado)
*/
function filmeanimarodaf(janima)
{}
/*
Function: pegaimagens (depreciado)
*/
function pegaimagens()
{}
/*
Function calculaArea (depreciado)
*/
function calculaArea(pontos,pixel)
{return (i3GEO.calculo.area(pontos,pixel));}
/*
Function: calculadistancia (depreciado)
*/
function calculadistancia(lga,lta,lgb,ltb) //0ms
{return (i3GEO.calculo.distancia(lga,lta,lgb,ltb));}
/*
Function: initJanelaRef (depreciado)
*/
function initJanelaRef()
{i3GEO.maparef.inicia();}
/*
Variable: g_mapaRefDisplay (depreciado)
*/
/*
Function: atualizaReferencia (depreciado)
*/
/*
Function: ajaxReferencia (depreciado)
*/
function ajaxReferencia(retorno)
{i3GEO.maparef.processaImagem(retorno)}
/*
Function: clicouRef (depreciado)

Altera a abrangência do mapa quando o mapa de referência é clicado
*/
function clicouRef()
{}
/*
Function: movimentoRef (depreciado)

Pega a coordenada do cursor sobre o mapa de referência
*/
function movimentoRef(obj)
{}
/*
Function: mostraTip (depreciado)

Mostra a descrição de um elemento do mapa como uma etiqueta na posição do mouse.

Para que um tema tenha uma etiqueta, é necessário configurar o metadata TIP no map file.

Parameters:

retorno - retorno da função ajax com os dados para montar a etiqueta.
*/
function mostraTip(retorno)
{
	//insere div para tips
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
Function: trataErro (depreciado)
*/
function trataErro()
{i3GEO.janela.fechaAguarde();}
/*
Function: mostraguiaf (depreciado)
*/
function mostraguiaf(guia)
{
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
Function: ativaGuias (depreciado)
*/
function ativaGuias()
{
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
		catch(e){};
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
		//
		//altera o tamanho das guias
		//
		var temp = new Array("guiaTemas","guiaMenu","guiaLegenda");
		var i = temp.length-1;
		if (i >= 0)
		{
			do
			{
				eval("var s = objmapa."+temp[i]+"obj"); 
				if ($i(s))
				{
					var d = $i(s).style;
					d.style.overflow="auto";
					d.style.height = i3GEO.parametros.h-13;
					d.style.width = "100%";
				}
			}
			while(i--)
		}
*/
/*
Function: docaguias (depreciado)
*/
function docaguias()
{i3GEO.guias.libera();}
/*
Function: autoRedesenho (depreciado)
*/
function autoRedesenho(opcao)
{}
/*
Function movePan (depreciado)
*/
function movePan()
{alert("movePan foi depreciado")}
/*
Function selecao (depreciado)
*/
function selecao()
{}
/*
Function: cliqueSelecao (depreciado)
*/
function cliqueSelecao()
{}
/*
Function: zoomboxf (depreciado)
*/
function zoomboxf(tipo)
{}
/*
Function: i3geo_comboGruposMenu (depreciado)
*/
function i3geo_comboGruposMenu(funcaoOnchange,idDestino,idCombo,largura,altura)
{}
/*
Function: i3geo_comboSubGruposMenu (depreciado)
*/
function i3geo_comboSubGruposMenu(funcaoOnchange,idDestino,idCombo,idGrupo,largura,altura)
{}
/*
Function: i3geo_comboTemasMenu (depreciado)
*/
function i3geo_comboTemasMenu(funcaoOnchange,idDestino,idCombo,idGrupo,idSubGrupo,largura,altura)
{}
/*
Function: remapaf (depreciado)
*/
function remapaf()
{i3GEO.atualiza("");}
/*
Function: limpacontainerf (depreciado)
*/
function limpacontainerf()
{}
/*
Function: inseremarcaf (depreciado)
*/
function inseremarcaf(xi,yi,funcaoOnclick,container)
{i3GEO.utl.insereMarca.cria(xi,yi,funcaoOnclick,container)}
/*
Function moveSelecaoPoli (depreciado)
*/
function moveSelecaoPoli()
{}
/*
Function: cliqueSelecaoPoli (depreciado)
*/
function cliqueSelecaoPoli()
{}
/*
Function: capturaposicao (depreciado)
*/
function capturaposicao(e)
{alert("capturaposicao foi depreciado utilize i3GEO.eventos");}
/*
Function: ativaEntorno (depreciado)
*/
function ativaEntorno()
{}
/*
Function: geraURLentorno (depreciado)
*/
function geraURLentorno()
{}
/*
Function: ajustaEntorno
*/
function ajustaEntorno()
{}
/*
Function: lenteDeAumento (depreciado)
*/
function lenteDeAumento()
{alert("lenteDeAumento foi depreciado utilize i3GEO.navega.lente.ativaDesativa()")}
/*
Function: ajaxabrelente (depreciado)
*/
function ajaxabrelente(retorno)
{}
/*
Function: movelentef (depreciado)
*/
function movelentef()
{}
/*
Function: destacaTema (depreciado)
*/
function destacaTema(tema)
{alert("destacaTema foi depreciado utilize i3GEO.navega");}

/*
Function: ajaxdestaca (depreciado)
*/
function ajaxdestaca()
{alert("ajaxdestaca foi depreciado, utilize i3GEO.navega")}
/*
Function: ativaClicks (depreciado)
*/
function ativaClicks(docMapa)
{}
/*
Function: incluir (depreciado)
*/
function incluir(path)
{i3GEO.util.adicionaSHP(path);}
/*
Function: pontosdist(depreciado)
*/
function pontosdist()
{
	this.xpt = new Array();
	this.ypt = new Array();
	this.dist = new Array();
	this.xtela = new Array();
	this.ytela = new Array();
	this.ximg = new Array();
	this.yimg = new Array();
	this.linhas = new Array();
}
/*
Function: mudaiconf (depreciado)
*/
function mudaiconf(i)
{i3GEO.barraDeBotoes.ativaIcone(i);}
/*
Function: calcposf (depreciado)
*/
function calcposf()
{i3GEO.mapa.ajustaPosicao();}
/*
Function: recuperamapa (depreciado)
*/
function recuperamapa()
{}
/*
Function: criaContainerRichdraw
*/
function criaContainerRichdraw()
{alert("criaContainerRichdraw foi depreciado utilize i3GEO.desenho");}
/*
Function: desenhoRichdraw (depreciado)
*/
function desenhoRichdraw(tipo,objeto,n)
{}
/*
Function: ajaxhttp (depreciado)

Cria o objeto http utilizado nas funções Ajax.

Returns:

Objeto httprequest.

See Also:

<ajaxexecAS>
*/
function ajaxhttp()
{
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
Function: ajaxexecAS (depreciado)

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
{
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
Function: ajaxexec (depreciado)

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
{
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
Function: ajaxLegendaHTML (depreciado)
*/
function ajaxLegendaHTML(retorno)
{}
/*
Function: ajaxLegendaImagem (depreciado)
*/
function ajaxLegendaImagem(retorno)
{}
/*
Function: mede (depreciado)
*/
function mede()
{}
/*
Function: cliqueMede (depreciado)
*/
function cliqueMede()
{}
/*
Function moveMede (depreciado)
*/
function moveMede()
{}
/*
Function: area (depreciado)
*/
function area()
{}
/*
Function: cliqueArea (depreciado)
*/
function cliqueArea()
{}
/*
Function moveArea (depreciado)
*/
function moveArea()
{}
/*
Function: textofid (depreciado)
*/
function textofid()
{}
/*
Function: inserexy (depreciado)
*/
function inserexy()
{}
/*
Function: cliqueInseretoponimo (depreciado)
*/
function cliqueInseretoponimo()
{}
/*
Function: cliqueInserexy (depreciado)
*/
function cliqueInserexy()
{}
/*
Function: inseregrafico (depreciado)
*/
function inseregrafico()
{}
/*
Function: cliqueInseregrafico (depreciado)
*/
function cliqueInseregrafico()
{}
/*
Function: ativaHistoricoZoom (depreciado)
*/	
function ativaHistoricoZoom(iddiv)
{}
function ajaxhttp(){
	return i3GEO.util.ajaxhttp();
}
/*
Function: ajaxCorpoMapa (depreciado)
*/
function ajaxCorpoMapa(retorno)
{i3GEO.mapa.corpo.veirifca(retorno);}
/*
Function: ajaxredesenha (depreciado)
*/
function ajaxredesenha(retorno)
{i3GEO.atualiza(retorno);}
/*
Function: ajaxIniciaParametros (depreciado)
*/
function ajaxIniciaParametros(retorno)
{i3GEO.atualiza(retorno);}