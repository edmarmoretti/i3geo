g_sid=window.location.href.split("?")[1];atuaLeg="nao";g_operacao="";g_nomepin="";g_arvoreClick="";g_arvoreClicks="";g_movedoca=0;g_movedocac=0;g_movedocar=0;g_tipoacao="zoomli";g_realca="nao";g_destaca="";g_lenteaberta="nao";g_hlpt="";g_panM="nao";quadrosfilme=new Array();g_quadrooriginal="";wd=0;navm=false;navn=false;g_r="nao";g_embedLegenda="nao";oMenuData="";g_3dmap="";g_opcoesTemas="sim";g_mostraRosa="sim";g_visual="default";g_janelaMen="sim";g_downloadbase="sim";g_conectargeorss="sim";g_uploadlocal="sim";g_conectarwms="sim";g_docaguias="nao";g_barraFerramentas1="sim";g_barraFerramentas2="sim";g_fatordezoom=0;g_diminuixM=20;g_diminuixN=25;g_diminuiyM=106;g_diminuiyN=103;g_mapaRefDisplay="block";g_funcaoTip="verificaTipDefault()";g_tempotip=4500;g_tipotip="completo";g_tipoimagem="nenhum";g_sistemas="";destacaTamanho=75;g_mensagempadrao="O I3Geo é software livre! Para download clique <a href='http://mapas.mma.gov.br/download' target=blanck >aqui</a>";g_entorno="nao";g_guiaativa="guia1";var app=navigator.appName.substring(0,1);if(app=='N')navn=true;else navm=true;if(navm){ g_postpx=""; g_tipotop="pixelTop"; g_tipoleft="pixelLeft";}
else{ g_postpx="px"; g_tipotop="top"; g_tipoleft="left";}window.onresize=function(){window.status="Após alterar o tamanho da janela, clique no botão de refresh do navegador";}
function Mapa(e,m){ objaguarde=new aguarde(); objposicaocursor=new posicaocursor(); objposicaomouse=new posicaomouse(); imgBranco=new Image(); imgBranco.src=g_locaplic+"/imagens/branco.gif"; var icache=new Array("foldermapa.gif","extent.gif","tic.png","maisvermelho.png","maisverde.png","maisamarelo.png","temas.png","x.gif","sobe.gif","desce.gif","quadro.png","quadro1.png","excluir.png"); for(i=0;icache.lenght;i++){ var temp=new Image(); temp.src=g_locaplic+"/imagens/"+icache[i];}
 var temp=new Image(); temp.src=g_locaplic+"/classesjs/jsobjects/jsUI-Treeview/plus.gif"; temp.src=g_locaplic+"/classesjs/jsobjects/jsUI-Treeview/minus.gif"; var diminuix=(navm)? g_diminuixM : g_diminuixN; var diminuiy=(navm)? g_diminuiyM : g_diminuiyN; if(e==undefined){ var menos=0; if($i("contemFerramentas")){menos=menos+parseInt($i("contemFerramentas").style.width);}
 if($i("encolheFerramentas")){menos=menos+parseInt($i("encolheFerramentas").style.width);}
 if($i("ferramentas")){menos=menos+parseInt($i("ferramentas").style.width);}
 var novow=screen.availWidth-diminuix; var novoh=screen.availHeight-diminuiy; if(novow >=1024){ novow=1000;}
 if(novoh >=700){ novoh=700;}
 if(document.body.style.width < 400){ var novow=screen.availWidth-diminuix; var novoh=screen.availHeight-diminuiy; window.resizeTo(screen.availWidth,screen.availHeight); window.moveTo(0,0);}
 document.body.style.width=novow; document.body.style.height=novoh; this.w=parseInt(document.body.style.width)-menos-diminuix; this.h=parseInt(document.body.style.height)-diminuiy; if(document.getElementById("corpoMapa")){ if(document.getElementById("corpoMapa").style.width){ this.w=parseInt(document.getElementById("corpoMapa").style.width); this.h=parseInt(document.getElementById("corpoMapa").style.height);}}}
 else{ this.w=document.body.offsetWidth-parseInt($i("contemFerramentas").style.width)-diminuix; this.h=document.body.offsetHeight-diminuiy;}
 if($i("openlayers")){ $i("openlayers").style.width=this.w; $i("openlayers").style.height=this.h;}
 this.listavisual=""; this.visualatual="default"; this.funcoesClickMapa=new Array(); this.objtips=new Array(); this.tempo=""; this.temaAtivo=""; this.pinmarca="marca"; this.pintamanho="5"; this.scale=50000; this.temas=""; this.legenda=""; this.finaliza=""; this.guiaTemas="guia1"; this.guiaMenu="guia2"; this.guiaLegenda="guia4"; this.guiaListaMapas="guia5"; this.inicializa=function(){ if(!window.testafuncoes){alert("funcoes.js com problemas");}
 if(!window.testamenususpenso){alert("menususpenso.js com problemas");}
 if(!window.testaferramentas){alert("ferramentas.js com problemas");}
 if(!window.testaajax){alert("redesenho.js com problemas");}
 objaguarde.abre("montaMapa","Aguarde...iniciando o mapa"); var cp=new cpaint(); cp.set_response_type("JSON"); var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=inicia&embedLegenda="+g_embedLegenda+"&w="+this.w+"&h="+this.h+"&g_sid="+g_sid; cp.call(p,"iniciaMapa",this.montaMapa);}
 this.montaMapa=function(retorno){ if(retorno.data.search("erro.")>-1){ alert(retorno.data);}
 if(retorno.data=="linkquebrado"){ objaguarde.fecha("montaMapa"); document.body.style.backgroundColor="white"; document.body.innerHTML="<br>Para abrir o mapa utilize o link:<br><a href="+g_locaplic+"/ms_criamapa.php >"+g_locaplic+"/ms_criamapa.php</a>"; return("linkquebrado");}
 else{ if((retorno.data !="erro")&&(retorno.data !=undefined)){ eval(retorno.data); if(oMenuData==""){ oMenuData={ "ajudas": [{text: "Sobre o I3Geo", url: "javascript:g_hlpt='sobrei3geo';ajudaf('abre')"},{text: "Sistema", url: "javascript:abreDoc()"},{text: "WikiBook", url: "http://pt.wikibooks.org/wiki/I3geo"},{text: "Tutoriais", url: "http://mapas.mma.gov.br/wikibooki3geo"},{text: "Blog", url: "http://sistemas.mma.gov.br/blogs/index.php?blog=6"}, ], "analise": [{text: "Geometrias", url: "javascript:analisaGeometrias()"},{text: "Grade de poligonos", url: "javascript:gradePol()"},{text: "Grade de pontos", url: "javascript:gradePontos()"},{text: "Grade de hexágonos", url: "javascript:gradeHex()"},{text: "Entorno(buffer)", url: "javascript:buffer()"},{text: "Centróide", url: "javascript:centroide()"},{text: "N pontos em poligono", url: "javascript:nptPol()"},{text: "Ponto em poligono/raster", url: "javascript:pontoempoligono()"},{text: "Distribuição de pontos", url: "javascript:pontosdistri()"}
 ] }; if(!$i("listaPropriedades")){ oMenuData.propriedades=[{text: "Tipo de imagem", url: "javascript:tipoimagem()"},{text: "Legenda", url: "javascript:opcoesLegenda()"},{text: "Escala", url: "javascript:opcoesEscala()"},{text: "Tamanho", url: "javascript:tamanho()"},{text: "Ativa/desativa entorno", url: "javascript:ativaEntorno()"},{text: "Ativa/desativa logo", url: "javascript:ativaLogo()"},{text: "Cor da selecao", url: "javascript:queryMap()"},{text: "Cor do fundo", url: "javascript:corFundo()"},{text: "Grade de coordenadas", url: "javascript:gradeCoord()"}
 ];}
 oMenuData.janelas=[{text: "Barras de ferramentas", url: "javascript:initJanelaZoom('1');initJanelaZoom('2')"},{text: "Janela de mensagens", url: "javascript:initJanelaMen()"}
 ]; oMenuData.arquivo=[{text: "Salvar mapa", url: "javascript:salvaMapa()"},{text: "Carregar mapa", url: "javascript:carregaMapa()"},{text: "Pegar imagens", url: "javascript:pegaimagens()"},{text: "Converter em WMS", url: "javascript:convertews()"},{text: "Gerador de links", url: "../geradordelinks.htm"}
 ];}
 if($i("menus")){YAHOO.example.onWindowLoadMenu();}
 if(!$i("aplicari")){ var novoel=document.createElement("input"); novoel.id='aplicari'; novoel.type='button'; novoel.value='Aplicar'; novoel.style.cursor="pointer"; novoel.style.fontSize="10px"; novoel.style.zIndex=15000; novoel.style.position="absolute"; novoel.style.display="none"; novoel.onclick=function(){ remapaf(); this.style.display="none" }
 novoel.onmouseover=function(){this.style.display="block";}
 novoel.onmouseout=function(){this.style.display="none";}
 document.body.appendChild(novoel);}
 gerafilmef(10); if(g_barraFerramentas1=="sim"){initJanelaZoom(1);}
 if(g_barraFerramentas2=="sim"){initJanelaZoom(2);}
 objmapa.atualizaListaTemas(temas); objmapa.atualizaReferencia(mapexten); objmapa.scale=parseInt(mapscale); objmapa.temas=temas; objmapa.cellsize=g_celula; objmapa.extent=mapexten; objmapa.extentTotal=mapexten; objmapa.criaCorpoMapa(); ajaxCorpoMapa(retorno); objmapa.criaEscalaGrafica(); objmapa.atualizaEscalaGrafica(); objmapa.ativaLocallizarXY("localizarxy"); objmapa.ativaBuscaRapida("buscaRapida"); objmapa.ativaListaPropriedades("listaPropriedades"); objmapa.ativaRealce("realca"); objmapa.ativaGoogle("google"); objmapa.ativaScielo("scielo"); objmapa.ativaConfluence("confluence"); objmapa.ativaZoomtot("zoomtot"); objmapa.ativaZoomli("zoomli"); objmapa.ativaPan("pan"); objmapa.ativaZoomiauto("zoomiauto"); objmapa.ativaZoomoauto("zoomoauto"); objmapa.ativaIdentifica("identifica"); objmapa.ativaLente("lentei"); objmapa.ativaExten("exten"); objmapa.ativaReferencia("referencia"); objmapa.ativaEscalanum("escala"); objmapa.ativaWiki("wiki"); objmapa.ativaReinicia("reinicia"); objmapa.ativaMede("mede"); objmapa.ativaInserexy("inserexy"); objmapa.ativaInsereGrafico("inseregrafico"); objmapa.ativaSelecao("selecao"); objmapa.ativaTextofid("textofid"); objmapa.ativa3D("v3d"); objmapa.ativaImpressao("imprimir"); objmapa.ativaVisual("visual"); ativaGuias(); if(($i("encolheFerramentas"))&&($i("contemFerramentas"))){ $i("encolheFerramentas").onclick=function(){docaguias();}}
 calcposf(); g_leftinicial=imagemxi; if($i("corpoMapa")){ $i("img").style.width=objmapa.w+"px"; $i("img").style.height=objmapa.h+"px"; $i("corpoMapa").style.width=objmapa.w+"px"; $i("corpoMapa").style.height=objmapa.h+"px"; $i("corpoMapa").style.clip='rect('+0+" "+(objmapa.w)+" "+(objmapa.h)+" "+0+')';}
 var temp=0; if($i("contemFerramentas")){temp=temp+parseInt($i("contemFerramentas").style.width);}
 if($i("encolheFerramentas")){temp=temp+parseInt($i("encolheFerramentas").style.width);}
 if($i("ferramentas")){temp=temp+parseInt($i("ferramentas").style.width);}
 $i("mst").style.width=objmapa.w+temp+"px"; $i("contemImg").style.height=objmapa.h+"px"; $i("contemImg").style.width=objmapa.w+"px"; calcposf(); if($i("maisBotoes1")){YAHOO.janelaBotoes1.xp.panel.moveTo(imagemxi+40,imagemyi+10);}
 if($i("maisBotoes2")){YAHOO.janelaBotoes2.xp.panel.moveTo(imagemxi,imagemyi+10);}
 mudaiconf("pan"); if(g_entorno=="sim"){ geraURLentorno(); var letras=["L","O","N","S"]; for(l=0;l<letras.length;l++){ if($i("img"+letras[l])){ $i("img"+letras[l]).style.width=objmapa.w; $i("img"+letras[l]).style.height=objmapa.h; $i("img"+letras[l]).style.display="block";}}
 ajustaEntorno();}}
 else{alert("Erro. Impossivel criar o mapa "+retorno.data);return;}
 var temp=g_guiaativa.split("guia"); mostraguiaf(temp[1]); if($i(objmapa.guiaListaMapas)){ if(g_locmapas==""){$i(objmapa.guiaListaMapas).style.display="none"}}
 if(pCookie("g_janelaMen")){g_janelaMen=pCookie("g_janelaMen");}
 if(g_janelaMen=="sim"){initJanelaMen();}
 if(pCookie("g_mapaRefDisplay")){g_mapaRefDisplay=pCookie("g_mapaRefDisplay");}
 if(g_mapaRefDisplay=="block"){initJanelaRef();}
 if($i("img")){g_quadrooriginal=$i("img").src;}
 objaguarde.fecha("montaMapa"); if(g_docaguias=="sim"){docaguias();}
 if(document.getElementById("botao3d")){ if(g_3dmap==""){document.getElementById("botao3d").style.display="none";}}}
 rebobinaf();}
 this.ativaVisual=function(visual){ if($i(visual)){ if(objmapa.listavisual !=""){ var l=objmapa.listavisual.split(","); var visuais=""; for(li=0;li<l.length;li++){ visuais+="<img title='muda visual-"+l[li]+"' style=cursor:pointer onclick='mudaVisual(\""+l[li]+"\")' src='"+g_locaplic+"/imagens/visual/"+l[li]+".png'/>&nbsp;";}
 $i(visual).innerHTML=visuais;}}}
 this.ativaLocallizarXY=function(id){ if($i(id)){ $i(id).innerHTML="localiza X:<input class=digitar id='xg' title='grau' type=text size=5 value='-00'/>&nbsp;<input class=digitar id='xm' title='minuto' type=text size=3 value='00'/>&nbsp;<input class=digitar id='xs' title='segundo' type=text size=5 value='00.00'/>&nbsp;&nbsp;Y:<input class=digitar id='yg' title='grau' type=text size=3 value='-00'/>&nbsp;<input class=digitar id='ym' title='minuto' type=text size=3 value='00'/>&nbsp;<input class=digitar id='ys' title='segundo' type=text size=5 value='00.00'/><img title='zoom' onclick='zoomPonto()' src="+$im("tic.png")+" id=procurarxy/>"; $i(id).onmouseover=function(){mostradicasf(this,'Digite as coordenadas de um ponto(X=longitude e Y=latitude)para localizá-lo no mapa. O centro do mapa será deslocado para o ponto digitado.','');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaBuscaRapida=function(id){ if($i(id)){ var ins="<input onclick='javascript:this.value=\"\"' id=valorBuscaRapida title='digite o texto para busca' type=text size=30 class=digitar value='busca rápida...'/>"; ins+="<img src='"+g_locaplic+"/imagens/tic.png' onclick='buscaRapida()'/>"; $i(id).innerHTML=ins;}}
 this.ativaListaPropriedades=function(id){ if($i(id)){ var lista={ "propriedades": [{text: "Tipo de imagem", url: "javascript:tipoimagem()"},{text: "Legenda", url: "javascript:opcoesLegenda()"},{text: "Escala", url: "javascript:opcoesEscala()"},{text: "Tamanho", url: "javascript:tamanho()"},{text: "Ativa/desativa entorno", url: "javascript:ativaEntorno()"},{text: "Ativa/desativa logo", url: "javascript:ativaLogo()"},{text: "Cor da selecao", url: "javascript:queryMap()"},{text: "Cor do fundo", url: "javascript:corFundo()"},{text: "Grade de coordenadas", url: "javascript:gradeCoord()"},{text: "Template", url: "javascript:template()"}
 ]}; listaPr=new Object(); listaPr=treeviewNew("listaPr", "default", id, null); listaPr.createItem("propriedadesRaiz", "<b>Propriedades do mapa</b>", g_locaplic+"/imagens/visual/"+g_visual+"/foldermapa1.gif", true, false, true, null); var im=""; if(navn){var im="<img src='"+g_locaplic+"/imagens/branco.gif' width=0 height=13/>";}
 for(l=0;l<lista.propriedades.length;l++){ tnome="<span onclick='"+lista.propriedades[l].url+"'>"+im+"<img src='"+g_locaplic+"/imagens/visual/"+g_visual+"/tic.png'/>&nbsp;"+lista.propriedades[l].text+" </span>"; listaPr.createItem("propriedadesMapa"+l, tnome, imgBranco, false, true, false, "propriedadesRaiz");}
 listaPr.createItem("","", imgBranco, false, true, false, "propriedadesRaiz");}}
 this.ativaRealce=function(id){ if($i(id)){ $i(id).onclick=function realcaAtiva(){ if(!$i("areaRealce")){ var novoel=document.createElement("div"); novoel.id='areaRealce'; novoel.style.display="none"; document.body.appendChild(novoel); if(navm){ $i("areaRealce").style.filter="alpha(opacity=20)";}}
 if(g_realca=="sim"){ g_realca="nao"; $i("areaRealce").style.display="none"; $i(id).style.borderWidth=0; $i(id).style.borderColor='red';}
 else{ g_realca="sim"; $i("areaRealce").style.display="block"; $i(id).style.borderWidth=1; $i(id).style.borderColor='red';}}
 $i(id).onmouseover=function(){mostradicasf(this,'Ativa/desativa &aacute;rea de destaque no mapa','');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaGoogle=function(id){ if($i(id)){ $i(id).onclick=function google(){ if(!$i("boxg")){ var novoel=document.createElement("div"); novoel.id="boxg"; novoel.style.zIndex=1; novoel.innerHTML='<font face="Arial" size=0></font>'; novoel.onmouseover=function(){$i("boxg").style.display="none";}
 document.body.appendChild(novoel);}
 g_operacao="navega"; wdocaf("340px","340px",g_locaplic+"/ferramentas/googlemaps/index.htm","","","Google maps");}
 $i(id).onmouseover=function(){mostradicasf(this,'Abre o Google Maps, mostrando uma imagem de satélite da região vista no mapa principal.','google');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaScielo=function(id){ if($i(id)){ $i(id).onclick=function scielo(){ g_operacao="navega"; wdocaf("450px","190px",g_locaplic+"/ferramentas/scielo/index.htm","","","Scielo");}
 $i(id).onmouseover=function(){mostradicasf(this,'Pesquisa documentos na base de dados Scielo(dados preliminares)','scielo');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaConfluence=function(id){ if($i(id)){ $i(id).onclick=function confluence(){ g_operacao="navega"; wdocaf("250px","190px",g_locaplic+"/ferramentas/confluence/index.htm","","","confluence"); if(!$i("boxg")){ var novoel=document.createElement("div"); novoel.id="boxg"; novoel.style.zIndex=5000; novoel.innerHTML='<font face="Arial" size=0></font>'; document.body.appendChild(novoel);}}
 $i(id).onmouseover=function(){mostradicasf(this,'Projeto Confluence. Pontos de intersecção de coordenadas observadas em campo.','confluence');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaZoomtot=function(id){ if($i(id)){ $i(id).onclick=function(){zoomtot();}
 $i(id).onmouseover=function(){mostradicasf(this,'Altera a escala do mapa ajustando-a para mostrar a mesma abrangência geográfica da inicialização.','geral');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaZoomli=function(id){ if($i(id)){ $i(id).onclick=function(){mudaiconf("zoomli");g_operacao="navega";}
 $i(id).onmouseover=function(){mostradicasf(this,'Amplia o mapa-coloca o ponto clicado no centro da tela ou amplia a regi&atilde;o indicada por um ret&acirc;ngulo.Após ativada, clique e arraste o mouse sobre o mapa na área de zoom desejada.','zoomli');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaPan=function(id){ if($i(id)){ $i(id).onclick=function(){mudaiconf("pan");g_tipoacao="pan";g_operacao="navega";}
 $i(id).onmouseover=function(){mostradicasf(this,'Desloca a região visível no mapa. Após ativada, clique e arraste o mouse sobre o mapa para deslocar a região visível.','pan');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaZoomiauto=function(id){ if($i(id)){ $i(id).onclick=function(){zoomiauto();}; $i(id).onmouseover=function(){mostradicasf(this,'Amplia o mapa tendo como refer&ecirc;cia o centro atual.','zoomiauto');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaZoomoauto=function(id){ if($i(id)){ $i(id).onclick=function(){zoomoauto();}; $i(id).onmouseover=function(){mostradicasf(this,'Reduz o mapa tendo como refer&ecirccia o centro atual.','zoomoauto');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaIdentifica=function(id){ if($i(id)){ $i(id).onclick=function(){ mudaiconf("identifica"); g_operacao="identifica";}
 $i(id).onmouseover=function(){mostradicasf(this,'Mostra informa&ccedil;&otilde;es sobre um ponto no mapa. Após ativada, pare o mouse por alguns instantes no ponto desejado ou clique sobre o mesmo.','identifica');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaLente=function(id){ if($i(id)){ $i(id).onclick=function lentei(){ if(!$i("lente")){ var novoel=document.createElement("div"); novoel.id='lente'; novoel.style.clip='rect(0px,0px,0px,0px)'; var novoimg=document.createElement("img"); novoimg.src=""; novoimg.id='lenteimg'; novoel.appendChild(novoimg); document.body.appendChild(novoel); var novoel=document.createElement("div"); novoel.id='boxlente'; document.body.appendChild(novoel);}
 with($i(id).style){borderWidth='1'+g_postpx;borderColor="red";}
 if(g_lenteaberta=="sim"){ $i("lente").style.display="none"; $i("boxlente").style.display="none"; $i(id).style.borderWidth=0; g_lenteaberta="nao";}
 else{ g_lenteaberta="sim"; objaguarde.abre("ajaxabrelente","Aguarde..."); var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=crialente&resolucao=1.5&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"lente",ajaxabrelente);}}
 $i(id).onmouseover=function(){mostradicasf(this,'Abre lente de amplia&ccedil;&atilde;o','lente');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaExten=function(id){ if($i(id)){ $i(id).onclick=function(){mensagemf(objmapa.extent);}
 $i(id).onmouseover=function(){mostradicasf(this,'Mostra a extens&atilde;o geogr&aacute;fica atual em coordenadas geográficas.','extensao');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaReferencia=function(id){ if($i(id)){ $i(id).onclick=function(){initJanelaRef();}
 $i(id).onmouseover=function(){mostradicasf(this,'Abre/fecha o mapa de refer&ecirc;ncia','');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaEscalanum=function(id){ if($i(id)){ $i(id).innerHTML="1:<input class='digitar' type='text' onchange='javascript:aplicaescala()' id=escalanum size=19 value=''/><img src=\""+g_localimg+"/tic.png\" onclick='javascript:aplicaescala()'/>"; $i("escalanum").onmouseover=function(){mostradicasf(this,'Digite o novo valor de escala e clique no botão aplicar para alterar a escala do mapa.','escala');}
 $i("escalanum").onmouseout=function(){mostradicasf(this,'');}
 if($i("escalanum")){$i("escalanum").value=this.scale;}}}
 this.ativaWiki=function(id){ if($i(id)){ $i(id).onclick=function wiki(){ g_operacao="navega"; wdocaf("450px","190px",g_locaplic+"/ferramentas/wiki/index.htm","","","Wiki");}
 $i(id).onmouseover=function(){mostradicasf(this,'Busca dados na Wikipedia na abrang&ecirc;ncia atual do mapa. Faça um zoom no mapa antes de abrir essa opção. Regiões muito extensas podem tornar a busca muito demorada.','');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaReinicia=function(id){ if($i(id)){ $i(id).onclick=function(){ objaguarde.abre("ajaxredesenha","Aguarde..."); var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=reiniciaMapa&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"reiniciaMapa",ajaxredesenha);}
 $i(id).onmouseover=function(){mostradicasf(this,'Redesenha o mapa com as configurações iniciais.','redesenha');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaMede=function(id){ if($i(id)){ $i(id).onclick=function mede(){ if(!$i("mostradistancia")){ var novoel=document.createElement("div"); novoel.id="mostradistancia"; novoel.style.display="none"; novoel.style.position="absolute"; document.body.appendChild(novoel);}
 if(g_tipoacao !="mede"){ mudaiconf("mede"); pontosdistobj=new pontosdist(); $i("mostradistancia").style.display="block";}
 else{ mudaiconf("pan"); limpacontainerf(); $i("mostradistancia").style.display="none";}}
 $i(id).onmouseover=function(){mostradicasf(this,'Mede a dist&acirc;ncia entre dois ou mais pontos clicados no mapa(menor dist&acirc;ncia). O cálculo de distância é aproximado e sua precisão depende da escala do mapa.','mede');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaInserexy=function(id){ if($i(id)){ $i(id).onclick=function inserexy(){ if(g_tipoacao !="inserexy"){ var temp=Math.random()+"a"; temp=temp.split("."); g_nomepin="pin"+temp[1]; mudaiconf("inserexy"); pontosdistobj=new pontosdist(); wdocaf("400px","300px",g_locaplic+'/ferramentas/inserexy2/index.htm',"","","Insere");}
 else{mudaiconf("pan");}}
 $i(id).onmouseover=function(){mostradicasf(this,'Insere pontos no mapa em coordenadas geogr&aacute;ficas. Os pontos incluídos podem ser transformados em linhas ou polígonos. Os pontos são armazenados em um tema temporário, podendo-se fazer o download do arquivo shapefile.','inserexy');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaInsereGrafico=function(id){ if($i(id)){ $i(id).onclick=function inseregrafico(){ if(g_tipoacao !="inseregrafico"){ var temp=Math.random()+"gr"; temp=temp.split("."); g_nomepin="pin"+temp[1]; mudaiconf("inseregrafico"); wdocaf("400px","300px",g_locaplic+'/ferramentas/inseregrafico/index.htm',"","","Insere");}
 else{mudaiconf("pan");}}
 $i(id).onmouseover=function(){mostradicasf(this,'Insere um gr&aacute;fico no ponto clicado conforme os atributos existentes no tema escolhido. O tema deve possuir itens com valores numéricos na tabela de atributos.','inseregrafico');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaSelecao=function(id){ if($i(id)){ $i(id).onclick=function selecao(){ if(g_tipoacao !="selecao"){ g_tipoacao="selecao"; mudaiconf("selecao"); pontosdistobj=new pontosdist(); objmapa.temaAtivo=""; wdocaf("360px","320px",g_locaplic+'/ferramentas/selecao/index.htm',"","","Sele&ccedil;&atilde;o");}
 else{mudaiconf("pan");}}
 $i(id).onmouseover=function(){mostradicasf(this,'Abre as ferramentas para sele&ccedil;&atilde;o de elementos de um tema. Os elementos selecionados podem ser utilizados em outras operações, como buffer e seleção por tema.','selecao');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaTextofid=function(id){ if($i("textofid")){ $i("textofid").onclick=function textofid(){ if(g_tipoacao !="textofid"){ var temp=Math.random()+"b"; temp=temp.split("."); g_nomepin="pin"+temp[1]; mudaiconf("textofid"); pontosdistobj=new pontosdist(); g_tipoacao="textofid"; wdocaf("350px","200px",g_locaplic+"/ferramentas/inseretxt/index.htm","","","Texto");}
 else{mudaiconf("pan");}}
 $i("textofid").onmouseover=function(){mostradicasf(this,'Insere um texto no mapa clicando no ponto desejado no mapa. Utilize essa opção para adicionar informações ao mapa.','inseretxt');}
 $i("textofid").onmouseout=function(){mostradicasf(this,'');}}}
 this.ativa3D=function(id){ if($i(id)){ $i(id).onclick=function v3d(){wdocaf("400px","200px",g_locaplic+"/ferramentas/3d/index.htm","","","3d");}
 $i(id).onmouseover=function(){mostradicasf(this,'Gera arquivo para 3d','3d');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.ativaImpressao=function(id){ if($i(id)){ $i(id).onclick=function imprimir(){wdocaf("320px","180px",g_locaplic+"/ferramentas/imprimir/index.htm","","","Imprimir");}
 $i(id).onmouseover=function(){mostradicasf(this,'Imprime o mapa','imprimir');}
 $i(id).onmouseout=function(){mostradicasf(this,'');}}}
 this.criaEscalaGrafica=function(){ if(($i("escalaGrafica"))&&(!$i("imagemEscalaGrafica"))){$i("escalaGrafica").innerHTML="<img src=\""+g_localimg+"/icon_menuarrow.gif\" title='op&ccedil;&otilde;es' onclick='opcoesEscala()' style='cursor:pointer'/><img id=imagemEscalaGrafica src=''/>";}}
 this.atualizaEscalaGrafica=function(){ if($i("escalaGrafica")){ var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=escalagrafica&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"retornaBarraEscala",ajaxEscalaGrafica);}}
 this.atualizaReferencia=function(mapexten){ if($i("mapaReferencia")&& objmapa.extent !=mapexten){ var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=referencia&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"retornaReferencia",ajaxReferencia);}
 else{ if($i("imagemReferencia")) gravaQuadro("referencia",$i("imagemReferencia").src);}}
 this.atualizaLegendaHTML=function(){ if(($i("moveLegi"))||($i("legenda")&& $i(objmapa.guiaLegenda+"obj")&& $i(objmapa.guiaLegenda+"obj").style.display=="block")){ var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaHTML&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"criaLegenda",ajaxLegendaHTML);}}
 this.atualizaLegendaImagem=function(){ if($i("legenda")){ var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaImagem&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"legendaGrafica",ajaxLegendaImagem);}}
 this.atualizaListaTemas=function(temas){ if(($i("listaTemas"))&&(objmapa.temas !=temas)){ $i("listaTemas").innerHTML=""; var lista=temas.split(";"); mytreeview1=new Object(); mytreeview1=treeviewNew("mytreeview1", "default", "listaTemas", null); mytreeview1.createItem("g1", "<b>Camadas</b>", g_locaplic+"/imagens/foldermapa.gif", true, true, true, null); mytreeview1.itemExpand=expandeTema; var cor="rgb(250,250,250)"; for(l=0;l<lista.length;l++){ var ltema=lista[l].split("*"); var ck=""; if(ltema[1]==2){ck='CHECKED';}
 if(ltema[8]==undefined){ltema[8]="nao";}
 tnome="<input class=inputsb style='cursor:pointer' onmouseover=\"javascript:mostradicasf(this,'Clique para ligar ou desligar esse tema, mostrando-o ou não no mapa. Após alterar o estado do tema, aguarde alguns instantes para o mapa ser redesenhado, ou clique no botão aplicar que será mostrado.','ligadesliga')\" onmouseout=\"javascript:mostradicasf(this,'')\" type='checkbox' name=\"layer\" value='"+ltema[0]+"' "+ck+" onclick='mudaboxnf(\"ligadesliga\")'/>"; if(ltema[5]=="sim"){tnome+="&nbsp;<img src="+$im("estasel.png")+" title='limpa sele&ccedil;&atilde;o' onclick='limpaseltemaf(this)' onmouseover=\"javascript:mostradicasf(this,'Limpa sele&ccedil;&atilde;o existente nesse tema','limpasel')\" onmouseout=\"javascript:mostradicasf(this,'')\" \>";}
 if((ltema[10]=="sim")||(ltema[10]=="SIM")){tnome+="&nbsp;<img src="+$im("down1.gif")+" title='download' onclick='download(\""+ltema[0]+"\")' onmouseover=\"javascript:mostradicasf(this,'Clique para fazer o download desse tema no formato shapefile','download')\" onmouseout=\"javascript:mostradicasf(this,'')\" \>";}
 if((ltema[7]=="sim")||(ltema[7]=="SIM")){tnome+="&nbsp;<img src="+$im("down1.gif")+" title='download' onclick='download(\""+ltema[0]+"\")' onmouseover=\"javascript:mostradicasf(this,'Clique para fazer o download desse tema no formato shapefile','download')\" onmouseout=\"javascript:mostradicasf(this,'')\" \>";}
 if(navm){tnome+="<span style='background-color:"+cor+"' id=nometema"+ltema[0]+">&nbsp;"+ltema[2]+"</span>";}
 else{tnome+="<span style='background-color:"+cor+"' id=nometema"+ltema[0]+">&nbsp;"+"<img src='"+g_locaplic+"/imagens/branco.gif' width=0 height=15/>"+ltema[2]+"</span>";}
 mytreeview1.createItem(ltema[0], tnome, null, true, true, true, "g1"); tnome="<img width=0px src="+$im("branco.gif")+"/>"; mytreeview1.createItem("", tnome, imgBranco, false, true, false, ltema[0]); if(cor=="rgb(250,250,250)"){var cor="rgb(255,255,255)";}
 else{var cor="rgb(250,250,250)";}}}}
 this.atualizaFarol=function(mapscale){ if(objmapa.scale !=mapscale){ var lista=(objmapa.temas).split(";"); var farol="maisamarelo.png"; for(l=0;l<lista.length;l++){ var ltema=lista[l].split("*"); if(ltema[6]*1 < mapscale*1){var farol="maisverde.png";}
 if(ltema[6]*1 > mapscale*1){var farol="maisvermelho.png";}
 if(ltema[6]*1==0){var farol="maisamarelo.png";}
 if($i("farol"+ltema[0])){ $i("farol"+ltema[0]).src=g_locaplic+"/imagens/"+farol;}}}}
 this.criaCorpoMapa=function(){ if($i("corpoMapa")){ var ins="<table>"; ins+="<tr><td class=verdeclaro ></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgN'/></td><td class=verdeclaro ></td></tr>"; ins+="<tr><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgL'/></td><td class=verdeclaro ><input style='position:relative;top:0px;left:0px'' type=image src='' id='img'/></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgO'/></td></tr>"; ins+="<tr><td class=verdeclaro ></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgS'/></td><td class=verdeclaro ></td></tr>"; ins+="</table>"; $i("corpoMapa").innerHTML=ins;}
 var novoel=document.createElement("div"); novoel.style.zIndex=1000; novoel.id="obj"; var novoimg=document.createElement("img"); novoimg.src=g_locaplic+"/imagens/pan.gif"; novoimg.name="imgh"; novoimg.id='imgh'; novoimg.style.width="15px"; novoimg.style.height="15px"; novoel.appendChild(novoimg); novoel.onmouseover=function(){this.style.display="none";}
 novoel.onmouseout=function(){this.style.display="block";}
 document.body.appendChild(novoel); var docMapa=""; if(document.getElementById("openlayers_OpenLayers_Container")){ var docMapa=$i("openlayers_OpenLayers_Container");}
 if(document.getElementById("img")){ var docMapa=$i("img"); var novoel=document.createElement("div"); novoel.style.width="0px"; novoel.style.height="0px"; novoel.id="box1"; document.body.appendChild(novoel); if(navm){ $i("box1").style.filter="alpha(opacity=25)";}
 $i("box1").onmousemove=function(){ var wb=parseInt($i("box1").style.width); var hb=parseInt($i("box1").style.height); if(navn){ with(this.style){width=wb-10+"px";}
 with(this.style){height=hb-10+"px";}}
 if(navm){ $i("box1").style.width=wb-2; $i("box1").style.height=hb-2;}}; $i("box1").onmouseup=function(){zoomboxf("termina")}; this.parado="nao";}
 if(docMapa !=""){ ativaClicks(docMapa);}
 this.atualizaCorpoMapa=function(){ objaguarde.abre("ajaxCorpoMapa","Aguarde..."); var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=corpo&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"redesenhaCorpo",ajaxCorpoMapa);}
 if(objmapa.finaliza){eval(objmapa.finaliza);}
 if($i(objmapa.guiaTemas+"obj")){ $i(objmapa.guiaTemas+"obj").style.overflow="auto"; $i(objmapa.guiaTemas+"obj").style.height=objmapa.h-13;}
 if($i(objmapa.guiaMenu+"obj")){ $i(objmapa.guiaMenu+"obj").style.overflow="auto"; $i(objmapa.guiaMenu+"obj").style.height=objmapa.h-13; $i(objmapa.guiaMenu+"obj").style.width="100%";}
 if($i(objmapa.guiaLegenda+"obj")){ $i(objmapa.guiaLegenda+"obj").style.overflow="auto"; $i(objmapa.guiaLegenda+"obj").style.height=objmapa.h-13; $i(objmapa.guiaLegenda+"obj").style.width="100%";}}
 this.verificaClickMapa=function(){ if(this.funcoesClickMapa.length > 0){ for(f=0;f<this.funcoesClickMapa.length;f++){ eval(this.funcoesClickMapa[f]);}}}}

