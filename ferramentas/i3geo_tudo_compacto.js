$i = function(id){return document.getElementById(id);}
 g_sid=window.parent.g_sid;$i=function(id){return document.getElementById(id);}
cabecalhojanela="";var h=parseInt(window.parent.document.getElementById("wdocai").style.height);navm=false;navn=false;var app=navigator.appName.substring(0,1);if(app=='N')navn=true;else navm=true;if(!$i("mascaraaguarde")){ if(navm){var s="filter:'alpha(opacity=20)'";}
 if(navn){var s="opacity:.2'";}
 document.body.innerHTML+="<div id=mascaraaguarde style=display:none;position:absolute;top:0px;left:0px;width:100%;height:"+h+"px;background-color:gray;border-size:0px;z-index:6000;"+s+" >&nbsp;</div>";}
reduzAltura=30;for(i=0;i<7;i++){ if(document.getElementById("guia"+i)){reduzAltura=50;}}
if(navn){ if(document.getElementById("fundo")){ document.getElementById("fundo").style.width="100%"; document.getElementById("fundo").style.height="100%";}
 if(document.getElementById("geral")){ document.getElementById("geral").style.height="90%"; document.getElementById("geral").style.width="97%";}}
else{ if(document.getElementById("fundo")){ document.getElementById("fundo").style.width="104%"; document.getElementById("fundo").style.height="99%";}
 if(document.getElementById("geral")){ document.getElementById("geral").style.height="90%"; document.getElementById("geral").style.width="100%";}}
document.body.style.backgroundColor="#F0F0F0";function aguarde(tipo){ if(tipo=="block"){ if(window.parent.document.getElementById("wdoca_h")){ cabecalhojanela=window.parent.document.getElementById("wdoca_h").innerHTML; window.parent.document.getElementById("wdoca_h").innerHTML="<img src=\'"+window.parent.g_locaplic+"/imagens/aguarde.gif\'/><span style=color:red >&nbsp;Aguarde...</span>"; $i("mascaraaguarde").style.display="block";}}
 if(tipo=="none"){ if(window.parent.document.getElementById("wdoca_h")){window.parent.document.getElementById("wdoca_h").innerHTML=cabecalhojanela;}
 if($i("mascaraaguarde")){$i("mascaraaguarde").style.display="none";}}
 if(document.getElementById("aguarde")){document.getElementById("aguarde").style.display="none";}}function cor(obj){window.parent.abreCor("wdocai",obj);} function mostraOpcao(anterior,proxima,texto,idatual){ if(!document.getElementById(idatual)){ var ndiv=document.createElement("div"); ndiv.id=idatual; texto+="<br><br><table style='width:100%;background-color:#F2F2F2;' ><tr style='width:100%'>"; if(anterior !=""){texto+="<td style='border:0px solid white;text-align:left;cursor:pointer;background-color:#F2F2F2;'><img onclick="+anterior+" src=../../imagens/anterior.gif ></td>";}
 if(proxima !=""){texto+="<td style='border:0px solid white;text-align:right;cursor:pointer;background-color:#F2F2F2;'><img onclick="+proxima+" src=../../imagens/proxima.gif ></td>";}
 ndiv.innerHTML=texto+"</tr></table>"; document.getElementById("resultado").appendChild(ndiv);}
 var ids=new Array("t0","t1","t2","t3","t4","t5","t6","t7"); for(i=0;i<ids.length;i++){ if(document.getElementById(ids[i])){document.getElementById(ids[i]).style.display="none";}}
 document.getElementById(idatual).style.display="block";}function simnao(id){ var combo="<select name="+id+" id="+id+" >"; combo+="<option value=TRUE selected>sim</option>"; combo+="<option value=FALSE >não</option>"; combo+="</select>"; return(combo);}function naosim(id){ var combo="<select name="+id+" id="+id+" >"; combo+="<option value=TRUE >sim</option>"; combo+="<option value=FALSE selected >não</option>"; combo+="</select>"; return(combo);}function combocor(id,def,s){ var combo="<select name="+id+" id="+id+" >"; if(def==0){s='selected';}
 combo+='<option value="0" '+s+' >branco</option>'; s=""; combo+='<option value="2">vermelho</option>'; combo+='<option value="7">amarelo</option>'; if(def==1){s='selected'}; combo+='<option value="1" '+s+' >preto</option>'; combo+='<option value="rgb(1,1,0.8)">bege</option>'; combo+='<option value="3">verde</option>'; combo+='<option value="8">cinza</option>'; combo+='<option value="4">azul</option>'; combo+='<option value="5">ciano</option>'; combo+='<option value="6">magenta</option>'; combo+="</select>"; return(combo);}  function comboitens(id,tema,funcao,onde){ if(arguments.length==4) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando itens...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<select id="+id+" >"); ins.push("<option value='' >---</option>"); for(i=0;i<retorno.data.valores.length;i++){ if(retorno.data.valores[i].tema==tema){ins.push("<option value='"+retorno.data.valores[i].item+"' >"+retorno.data.valores[i].item+"</option>");}}
 ins.push("</select>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{ var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);}  function checkitensf(tema,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando itens...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<table class=lista >"); for(i=0;i<retorno.data.valores.length;i++){ ins.push("<tr><td><input size=2 style='cursor:pointer' name='"+retorno.data.valores[i].tema+"' type=checkbox id='"+retorno.data.valores[i].item+"'/></td>"); ins.push("<td>"+retorno.data.valores[i].item+"-"+retorno.data.valores[i].nome+"</td></tr>");}
 ins.push("</table>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{ var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);}function radioitensf(tema,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando itens...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<table class=lista >"); for(i=0;i<retorno.data.valores.length;i++){ ins.push("<tr><td><input size=2 style='cursor:pointer' name='itensradio' type=radio id='"+retorno.data.valores[i].item+";"+retorno.data.valores[i].tema+"'/></td>"); ins.push("<td>"+retorno.data.valores[i].item+"-"+retorno.data.valores[i].nome+"</td></tr>");}
 ins.push("</table>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);}function valoresItem(tema,itemTema,funcao,onde){ if(arguments.length==4) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando valores...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); for(i=0;i<retorno.data[1].registros.length;i++){ var pares=retorno.data[1].registros[i].valores; for(j=0;j<pares.length;j++){ins.push(pares[j].valor+"<br>");}}
 ins.push("<br>"); ins.sort; var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaregistros&unico=sim&tema="+tema+"&itemtema="+itemTema,"listaRegistros",monta);}function valoresItemCombo(id,tema,itemTema,funcao,onde){ if(arguments.length==5) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando valores...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<select id="+id+" >"); ins.push("<option value='' >---</option>"); for(i=0;i<retorno.data[1].registros.length;i++){ var pares=retorno.data[1].registros[i].valores; for(j=0;j<pares.length;j++){ins.push("<option value='"+pares[j].valor+"' >"+pares[j].valor+"</option>");}}
 ins.push("</select>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaregistros&unico=sim&tema="+tema+"&itemtema="+itemTema,"listaRegistros",monta);}
     function comboCamadas(id,tema,funcao,onde){ if(arguments.length==4) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.temas.length > 1){ var combot="<select id="+id+" >"; combot=combot+"<option value='' >---</option>"; for(i=0;i<retorno.data.temas.length;i++){ combot=combot+"<option value="+retorno.data.temas[i]+" >"+retorno.data.nomes[i]+"</option>";}
 combot=combot+"</select>"; var temp={dados:combot,tipo:"dados"};}
 else{var temp={dados:"",tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);}   function comboTemasSel(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; eval("funcao('<div style=color:red;font-size:10px;>Aguarde...</div>')"); var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:comboTemas,tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema possui sele&ccedil;&atilde;o. Utilize a op&ccedil;&atilde;o de sele&ccedil;&atilde;o ou a tabela de um tema para escolher algum elemento de algum tema.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemascomsel","listaTemasComSel",monta);}   function comboTemasLigados(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:comboTemas,tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema está ligado.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemas&opcao=ligados","listaTemas",monta);}   function comboTemasLocais(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas locais...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:comboTemas,tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema local dispon&iacute;vel.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemaslocais","listaTemasLocais",monta);}function comboTemasPt(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:"comboTemas",tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema de pontos dispon&iacute;vel.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=ponto","listaTemasTipo",monta);}function comboTemasPol(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:comboTemas,tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema de pol&iacute;gonos dispon&iacute;vel.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=poligono","listaTemasTipo",monta);}function comboTemasRaster(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:comboTemas,tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema raster dispon&iacute;vel.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=raster","listaTemasTipo",monta);}  function checkTemasPolRaster(funcao,onde){ if(arguments.length==2) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<table class=lista >"); for(i=0;i<retorno.data.length;i++){ ins.push("<tr><td><input size=2 style='cursor:pointer' value="+retorno.data[i].tema+" type=checkbox id="+retorno.data[i].tema+"/></td>"); ins.push("<td>"+retorno.data[i].nome+"</td></tr>");}
 ins.push("</table>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=poligono,raster","listaTemasTipo",monta);}
   function comboTrueType(funcao,onde){ if(arguments.length==2) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando fontes...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var lista=retorno.data.split(","); var ins="<select id=fonte >"; ins=ins+"<option value='bitmap' >bitmap</option>"; for(i=0;i<lista.length;i++){ins=ins+"<option value="+lista[i]+" >"+lista[i]+"</option>";}
 ins=ins+"</select>"; var temp={dados:ins,tipo:"dados"};}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatruetype","listaTrueType",monta);}
 function removeAcentos(palavra){ var re=/ã|á|à|â/gi; palavra=palavra.replace(re,"a"); var re=/é/gi; palavra=palavra.replace(re,"e"); var re=/í/gi; palavra=palavra.replace(re,"i"); var re=/ó|õ/gi; palavra=palavra.replace(re,"o"); var re=/ç/gi; palavra=palavra.replace(re,"c"); var re=/ú/gi; palavra=palavra.replace(re,"u"); return(palavra);}function htmlAcentos(palavra){ var re=/ã/gi; palavra=palavra.replace(re,"*atilde|"); var re=/á/gi; palavra=palavra.replace(re,"*aacute|"); var re=/â/gi; palavra=palavra.replace(re,"*acirc|"); var re=/õ/gi; palavra=palavra.replace(re,"*otilde|"); var re=/ó/gi; palavra=palavra.replace(re,"*oacute|"); var re=/ô/gi; palavra=palavra.replace(re,"*ocirc|"); var re=/é/gi; palavra=palavra.replace(re,"*eacute|"); var re=/ê/gi; palavra=palavra.replace(re,"*ecirc|"); var re=/í/gi; palavra=palavra.replace(re,"*iacute|"); var re=/ú/gi; palavra=palavra.replace(re,"*uacute|"); var re=/ç/gi; palavra=palavra.replace(re,"*ccedil|"); var re=/Ã/gi; palavra=palavra.replace(re,"*Atilde|"); var re=/Á/gi; palavra=palavra.replace(re,"*Aacute|"); var re=/Â/gi; palavra=palavra.replace(re,"*Acirc|"); var re=/Õ/gi; palavra=palavra.replace(re,"*otilde|"); var re=/Ó/gi; palavra=palavra.replace(re,"*Oacute|"); var re=/Ô/gi; palavra=palavra.replace(re,"*Ocirc|"); var re=/É/gi; palavra=palavra.replace(re,"*Eacute|"); var re=/Ê/gi; palavra=palavra.replace(re,"*Ecirc|"); var re=/Í/gi; palavra=palavra.replace(re,"*Iacute|"); var re=/Ú/gi; palavra=palavra.replace(re,"*Uacute|"); var re=/Ç/gi; palavra=palavra.replace(re,"*Ccedil|"); return(palavra);}function randomRGB(){ var v=Math.random(); var r=parseInt(255*v); var v=Math.random(); var g=parseInt(255*v); var v=Math.random(); var b=parseInt(255*v); return(r+","+g+","+b);}function parametrosURL(){ g_locaplic=window.parent.g_locaplic; g_r=window.parent.g_r; var temp=(window.location.href).split("tema="); if(temp[1]){tema=(temp[1].split("&"))[0];}}function zoomf(ext){ window.parent.borra("sim"); var p=g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=mudaext&ext="+ext; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"mudaExtensao",window.parent.remapaf);}function pinf(ext){ valores=ext.split(" "); vx=(valores[0]*1)+((((valores[0]*-1)-(valores[2]*-1))/2)*1); vy=(valores[1]*1)+((((valores[1]*-1)-(valores[3]*-1))/2)*1); window.parent.borra("sim"); var p=g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=zoomponto&pin=pin&xy="+vx+" "+vy; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"zoomPonto",window.parent.ajaxredesenha);}
function convdmsddf(g,m,s){ cd=$i(g).value; cm=$i(m).value; cs=$i(s).value; var sinal='positivo'; if(cd < 0){ cd=cd*-1; sinal='negativo';}
 spm=cs/3600; mpg=cm/60; var dd=(cd*1)+(mpg*1)+(spm*1); if(sinal=='negativo'){dd=dd*-1;}
 return dd;}
function mensagemAjuda(onde,texto){ var ins="<table style='width:100%;padding:2;vertical-align:top;background-color:#ffffff;' ><tr><th style='background-color: #cedff2;font-family:Verdana, Arial, Helvetica, sans-serif;font-size: 8pt;border: 1px solid #B1CDEB;text-align: left;padding-left: 7px;padding-right: 11px;'>"; ins+='<div style="float:right"><img src="../../imagens/question.gif"/></div>'; ins+='<div style="left;">'; if(texto==""){var texto=$i(onde).innerHTML;}
 ins+=texto; ins+='</div></th></tr></table>'; if(onde !=""){$i(onde).innerHTML=ins;}
 else{return(ins);}}
function mensagemOpcao(onde,texto){ var ins="<table style='width:100%;padding:2;vertical-align:top;background-color:#ffffff;' ><tr><th style='background-color: #cedff2;font-family:Verdana, Arial, Helvetica, sans-serif;font-size: 8pt;border: 1px solid #B1CDEB;text-align: left;padding-left: 7px;padding-right: 11px;'>"; ins+='<div style="float:right"><img src="../../imagens/opcoes.gif"/></div>'; ins+='<div style="left;">'; if(texto==""){var texto=$i(onde).innerHTML;}
 ins+=texto; ins+='</div></th></tr></table>'; if(onde !=""){$i(onde).innerHTML=ins;}
 else{return(ins);}}
function ativaGuias(){ for(g=0;g<12;g++){ if($i("guia"+g)) var gpai=$i("guia"+g).parentNode;}
 gpai.id="guiasYUI"; gpai.className="yui-navset"; var ins='<ul class="yui-nav" style="border-width:0pt 0pt 2px;border-color:rgb(240,240,240)">'; for(g=0;g<12;g++){ if($i("guia"+g)) ins+='<li><a href="#"><em><div id=guia'+g+' style=text-align:center;font-size:10px;left:0px;>'+$i("guia"+g).innerHTML+'</div></em></a></li>';}
 ins+="</ul>"; gpai.innerHTML=ins;}
function mostraGuia(guia){ for(g=0;g<12;g++){ if($i("guia"+g+"obj")) $i("guia"+g+"obj").style.display="none";}
 $i(guia+"obj").style.display="block";}

/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.3.1
*/
if(typeof YAHOO=="undefined"){var YAHOO={};}YAHOO.namespace=function(){var A=arguments,E=null,C,B,D;for(C=0;C<A.length;C=C+1){D=A[C].split(".");E=YAHOO;for(B=(D[0]=="YAHOO")?1:0;B<D.length;B=B+1){E[D[B]]=E[D[B]]||{};E=E[D[B]];}}return E;};YAHOO.log=function(D,A,C){var B=YAHOO.widget.Logger;if(B&&B.log){return B.log(D,A,C);}else{return false;}};YAHOO.register=function(A,E,D){var I=YAHOO.env.modules;if(!I[A]){I[A]={versions:[],builds:[]};}var B=I[A],H=D.version,G=D.build,F=YAHOO.env.listeners;B.name=A;B.version=H;B.build=G;B.versions.push(H);B.builds.push(G);B.mainClass=E;for(var C=0;C<F.length;C=C+1){F[C](B);}if(E){E.VERSION=H;E.BUILD=G;}else{YAHOO.log("mainClass is undefined for module "+A,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[]};YAHOO.env.getVersion=function(A){return YAHOO.env.modules[A]||null;};YAHOO.env.ua=function(){var C={ie:0,opera:0,gecko:0,webkit:0};var B=navigator.userAgent,A;if((/KHTML/).test(B)){C.webkit=1;}A=B.match(/AppleWebKit\/([^\s]*)/);if(A&&A[1]){C.webkit=parseFloat(A[1]);}if(!C.webkit){A=B.match(/Opera[\s\/]([^\s]*)/);if(A&&A[1]){C.opera=parseFloat(A[1]);}else{A=B.match(/MSIE\s([^;]*)/);if(A&&A[1]){C.ie=parseFloat(A[1]);}else{A=B.match(/Gecko\/([^\s]*)/);if(A){C.gecko=1;A=B.match(/rv:([^\s\)]*)/);if(A&&A[1]){C.gecko=parseFloat(A[1]);}}}}}return C;}();(function(){YAHOO.namespace("util","widget","example");if("undefined"!==typeof YAHOO_config){var B=YAHOO_config.listener,A=YAHOO.env.listeners,D=true,C;if(B){for(C=0;C<A.length;C=C+1){if(A[C]==B){D=false;break;}}if(D){A.push(B);}}}})();YAHOO.lang={isArray:function(B){if(B){var A=YAHOO.lang;return A.isNumber(B.length)&&A.isFunction(B.splice)&&!A.hasOwnProperty(B.length);}return false;},isBoolean:function(A){return typeof A==="boolean";},isFunction:function(A){return typeof A==="function";},isNull:function(A){return A===null;},isNumber:function(A){return typeof A==="number"&&isFinite(A);},isObject:function(A){return(A&&(typeof A==="object"||YAHOO.lang.isFunction(A)))||false;},isString:function(A){return typeof A==="string";},isUndefined:function(A){return typeof A==="undefined";},hasOwnProperty:function(A,B){if(Object.prototype.hasOwnProperty){return A.hasOwnProperty(B);}return !YAHOO.lang.isUndefined(A[B])&&A.constructor.prototype[B]!==A[B];},_IEEnumFix:function(C,B){if(YAHOO.env.ua.ie){var E=["toString","valueOf"],A;for(A=0;A<E.length;A=A+1){var F=E[A],D=B[F];if(YAHOO.lang.isFunction(D)&&D!=Object.prototype[F]){C[F]=D;}}}},extend:function(D,E,C){if(!E||!D){throw new Error("YAHOO.lang.extend failed, please check that all dependencies are included.");}var B=function(){};B.prototype=E.prototype;D.prototype=new B();D.prototype.constructor=D;D.superclass=E.prototype;if(E.prototype.constructor==Object.prototype.constructor){E.prototype.constructor=E;}if(C){for(var A in C){D.prototype[A]=C[A];}YAHOO.lang._IEEnumFix(D.prototype,C);}},augmentObject:function(E,D){if(!D||!E){throw new Error("Absorb failed, verify dependencies.");}var A=arguments,C,F,B=A[2];if(B&&B!==true){for(C=2;C<A.length;C=C+1){E[A[C]]=D[A[C]];}}else{for(F in D){if(B||!E[F]){E[F]=D[F];}}YAHOO.lang._IEEnumFix(E,D);}},augmentProto:function(D,C){if(!C||!D){throw new Error("Augment failed, verify dependencies.");}var A=[D.prototype,C.prototype];for(var B=2;B<arguments.length;B=B+1){A.push(arguments[B]);}YAHOO.lang.augmentObject.apply(this,A);},dump:function(A,G){var C=YAHOO.lang,D,F,I=[],J="{...}",B="f(){...}",H=", ",E=" => ";if(!C.isObject(A)){return A+"";}else{if(A instanceof Date||("nodeType" in A&&"tagName" in A)){return A;}else{if(C.isFunction(A)){return B;}}}G=(C.isNumber(G))?G:3;if(C.isArray(A)){I.push("[");for(D=0,F=A.length;D<F;D=D+1){if(C.isObject(A[D])){I.push((G>0)?C.dump(A[D],G-1):J);}else{I.push(A[D]);}I.push(H);}if(I.length>1){I.pop();}I.push("]");}else{I.push("{");for(D in A){if(C.hasOwnProperty(A,D)){I.push(D+E);if(C.isObject(A[D])){I.push((G>0)?C.dump(A[D],G-1):J);}else{I.push(A[D]);}I.push(H);}}if(I.length>1){I.pop();}I.push("}");}return I.join("");},substitute:function(Q,B,J){var G,F,E,M,N,P,D=YAHOO.lang,L=[],C,H="dump",K=" ",A="{",O="}";for(;;){G=Q.lastIndexOf(A);if(G<0){break;}F=Q.indexOf(O,G);if(G+1>=F){break;}C=Q.substring(G+1,F);M=C;P=null;E=M.indexOf(K);if(E>-1){P=M.substring(E+1);M=M.substring(0,E);}N=B[M];if(J){N=J(M,N,P);}if(D.isObject(N)){if(D.isArray(N)){N=D.dump(N,parseInt(P,10));}else{P=P||"";var I=P.indexOf(H);if(I>-1){P=P.substring(4);}if(N.toString===Object.prototype.toString||I>-1){N=D.dump(N,parseInt(P,10));}else{N=N.toString();}}}else{if(!D.isString(N)&&!D.isNumber(N)){N="~-"+L.length+"-~";L[L.length]=C;}}Q=Q.substring(0,G)+N+Q.substring(F+1);}for(G=L.length-1;G>=0;G=G-1){Q=Q.replace(new RegExp("~-"+G+"-~"),"{"+L[G]+"}","g");}return Q;},trim:function(A){try{return A.replace(/^\s+|\s+$/g,"");}catch(B){return A;}},merge:function(){var C={},A=arguments,B;for(B=0;B<A.length;B=B+1){YAHOO.lang.augmentObject(C,A[B],true);}return C;},isValue:function(B){var A=YAHOO.lang;return(A.isObject(B)||A.isString(B)||A.isNumber(B)||A.isBoolean(B));}};YAHOO.util.Lang=YAHOO.lang;YAHOO.lang.augment=YAHOO.lang.augmentProto;YAHOO.augment=YAHOO.lang.augmentProto;YAHOO.extend=YAHOO.lang.extend;YAHOO.register("yahoo",YAHOO,{version:"2.3.1",build:"541"});(function(){var B=YAHOO.util,K,I,H=0,J={},F={};var C=YAHOO.env.ua.opera,L=YAHOO.env.ua.webkit,A=YAHOO.env.ua.gecko,G=YAHOO.env.ua.ie;var E={HYPHEN:/(-[a-z])/i,ROOT_TAG:/^body|html$/i};var M=function(O){if(!E.HYPHEN.test(O)){return O;}if(J[O]){return J[O];}var P=O;while(E.HYPHEN.exec(P)){P=P.replace(RegExp.$1,RegExp.$1.substr(1).toUpperCase());}J[O]=P;return P;};var N=function(P){var O=F[P];if(!O){O=new RegExp("(?:^|\\s+)"+P+"(?:\\s+|$)");F[P]=O;}return O;};if(document.defaultView&&document.defaultView.getComputedStyle){K=function(O,R){var Q=null;if(R=="float"){R="cssFloat";}var P=document.defaultView.getComputedStyle(O,"");if(P){Q=P[M(R)];}return O.style[R]||Q;};}else{if(document.documentElement.currentStyle&&G){K=function(O,Q){switch(M(Q)){case"opacity":var S=100;try{S=O.filters["DXImageTransform.Microsoft.Alpha"].opacity;}catch(R){try{S=O.filters("alpha").opacity;}catch(R){}}return S/100;case"float":Q="styleFloat";default:var P=O.currentStyle?O.currentStyle[Q]:null;return(O.style[Q]||P);}};}else{K=function(O,P){return O.style[P];};}}if(G){I=function(O,P,Q){switch(P){case"opacity":if(YAHOO.lang.isString(O.style.filter)){O.style.filter="alpha(opacity="+Q*100+")";if(!O.currentStyle||!O.currentStyle.hasLayout){O.style.zoom=1;}}break;case"float":P="styleFloat";default:O.style[P]=Q;}};}else{I=function(O,P,Q){if(P=="float"){P="cssFloat";}O.style[P]=Q;};}var D=function(O,P){return O&&O.nodeType==1&&(!P||P(O));};YAHOO.util.Dom={get:function(Q){if(Q&&(Q.tagName||Q.item)){return Q;}if(YAHOO.lang.isString(Q)||!Q){return document.getElementById(Q);}if(Q.length!==undefined){var R=[];for(var P=0,O=Q.length;P<O;++P){R[R.length]=B.Dom.get(Q[P]);}return R;}return Q;},getStyle:function(O,Q){Q=M(Q);var P=function(R){return K(R,Q);};return B.Dom.batch(O,P,B.Dom,true);},setStyle:function(O,Q,R){Q=M(Q);var P=function(S){I(S,Q,R);};B.Dom.batch(O,P,B.Dom,true);},getXY:function(O){var P=function(R){if((R.parentNode===null||R.offsetParent===null||this.getStyle(R,"display")=="none")&&R!=document.body){return false;}var Q=null;var V=[];var S;var T=R.ownerDocument;if(R.getBoundingClientRect){S=R.getBoundingClientRect();return[S.left+B.Dom.getDocumentScrollLeft(R.ownerDocument),S.top+B.Dom.getDocumentScrollTop(R.ownerDocument)];}else{V=[R.offsetLeft,R.offsetTop];Q=R.offsetParent;var U=this.getStyle(R,"position")=="absolute";if(Q!=R){while(Q){V[0]+=Q.offsetLeft;V[1]+=Q.offsetTop;if(L&&!U&&this.getStyle(Q,"position")=="absolute"){U=true;}Q=Q.offsetParent;}}if(L&&U){V[0]-=R.ownerDocument.body.offsetLeft;V[1]-=R.ownerDocument.body.offsetTop;}}Q=R.parentNode;while(Q.tagName&&!E.ROOT_TAG.test(Q.tagName)){if(B.Dom.getStyle(Q,"display").search(/^inline|table-row.*$/i)){V[0]-=Q.scrollLeft;V[1]-=Q.scrollTop;}Q=Q.parentNode;}return V;};return B.Dom.batch(O,P,B.Dom,true);},getX:function(O){var P=function(Q){return B.Dom.getXY(Q)[0];};return B.Dom.batch(O,P,B.Dom,true);},getY:function(O){var P=function(Q){return B.Dom.getXY(Q)[1];};return B.Dom.batch(O,P,B.Dom,true);},setXY:function(O,R,Q){var P=function(U){var T=this.getStyle(U,"position");if(T=="static"){this.setStyle(U,"position","relative");T="relative";}var W=this.getXY(U);if(W===false){return false;}var V=[parseInt(this.getStyle(U,"left"),10),parseInt(this.getStyle(U,"top"),10)];if(isNaN(V[0])){V[0]=(T=="relative")?0:U.offsetLeft;}if(isNaN(V[1])){V[1]=(T=="relative")?0:U.offsetTop;}if(R[0]!==null){U.style.left=R[0]-W[0]+V[0]+"px";}if(R[1]!==null){U.style.top=R[1]-W[1]+V[1]+"px";}if(!Q){var S=this.getXY(U);if((R[0]!==null&&S[0]!=R[0])||(R[1]!==null&&S[1]!=R[1])){this.setXY(U,R,true);}}};B.Dom.batch(O,P,B.Dom,true);},setX:function(P,O){B.Dom.setXY(P,[O,null]);},setY:function(O,P){B.Dom.setXY(O,[null,P]);},getRegion:function(O){var P=function(Q){if((Q.parentNode===null||Q.offsetParent===null||this.getStyle(Q,"display")=="none")&&Q!=document.body){return false;}var R=B.Region.getRegion(Q);return R;};return B.Dom.batch(O,P,B.Dom,true);},getClientWidth:function(){return B.Dom.getViewportWidth();},getClientHeight:function(){return B.Dom.getViewportHeight();},getElementsByClassName:function(S,W,T,U){W=W||"*";T=(T)?B.Dom.get(T):null||document;if(!T){return[];}var P=[],O=T.getElementsByTagName(W),V=N(S);for(var Q=0,R=O.length;Q<R;++Q){if(V.test(O[Q].className)){P[P.length]=O[Q];if(U){U.call(O[Q],O[Q]);}}}return P;},hasClass:function(Q,P){var O=N(P);var R=function(S){return O.test(S.className);};return B.Dom.batch(Q,R,B.Dom,true);},addClass:function(P,O){var Q=function(R){if(this.hasClass(R,O)){return false;}R.className=YAHOO.lang.trim([R.className,O].join(" "));return true;};return B.Dom.batch(P,Q,B.Dom,true);},removeClass:function(Q,P){var O=N(P);var R=function(S){if(!this.hasClass(S,P)){return false;}var T=S.className;S.className=T.replace(O," ");if(this.hasClass(S,P)){this.removeClass(S,P);}S.className=YAHOO.lang.trim(S.className);return true;};return B.Dom.batch(Q,R,B.Dom,true);},replaceClass:function(R,P,O){if(!O||P===O){return false;}var Q=N(P);var S=function(T){if(!this.hasClass(T,P)){this.addClass(T,O);return true;}T.className=T.className.replace(Q," "+O+" ");if(this.hasClass(T,P)){this.replaceClass(T,P,O);}T.className=YAHOO.lang.trim(T.className);return true;};return B.Dom.batch(R,S,B.Dom,true);},generateId:function(O,Q){Q=Q||"yui-gen";var P=function(R){if(R&&R.id){return R.id;}var S=Q+H++;if(R){R.id=S;}return S;};return B.Dom.batch(O,P,B.Dom,true)||P.apply(B.Dom,arguments);},isAncestor:function(P,Q){P=B.Dom.get(P);if(!P||!Q){return false;}var O=function(R){if(P.contains&&R.nodeType&&!L){return P.contains(R);}else{if(P.compareDocumentPosition&&R.nodeType){return !!(P.compareDocumentPosition(R)&16);}else{if(R.nodeType){return !!this.getAncestorBy(R,function(S){return S==P;});}}}return false;};return B.Dom.batch(Q,O,B.Dom,true);},inDocument:function(O){var P=function(Q){if(L){while(Q=Q.parentNode){if(Q==document.documentElement){return true;}}return false;}return this.isAncestor(document.documentElement,Q);};return B.Dom.batch(O,P,B.Dom,true);},getElementsBy:function(V,P,Q,S){P=P||"*";
Q=(Q)?B.Dom.get(Q):null||document;if(!Q){return[];}var R=[],U=Q.getElementsByTagName(P);for(var T=0,O=U.length;T<O;++T){if(V(U[T])){R[R.length]=U[T];if(S){S(U[T]);}}}return R;},batch:function(S,V,U,Q){S=(S&&(S.tagName||S.item))?S:B.Dom.get(S);if(!S||!V){return false;}var R=(Q)?U:window;if(S.tagName||S.length===undefined){return V.call(R,S,U);}var T=[];for(var P=0,O=S.length;P<O;++P){T[T.length]=V.call(R,S[P],U);}return T;},getDocumentHeight:function(){var P=(document.compatMode!="CSS1Compat")?document.body.scrollHeight:document.documentElement.scrollHeight;var O=Math.max(P,B.Dom.getViewportHeight());return O;},getDocumentWidth:function(){var P=(document.compatMode!="CSS1Compat")?document.body.scrollWidth:document.documentElement.scrollWidth;var O=Math.max(P,B.Dom.getViewportWidth());return O;},getViewportHeight:function(){var O=self.innerHeight;var P=document.compatMode;if((P||G)&&!C){O=(P=="CSS1Compat")?document.documentElement.clientHeight:document.body.clientHeight;}return O;},getViewportWidth:function(){var O=self.innerWidth;var P=document.compatMode;if(P||G){O=(P=="CSS1Compat")?document.documentElement.clientWidth:document.body.clientWidth;}return O;},getAncestorBy:function(O,P){while(O=O.parentNode){if(D(O,P)){return O;}}return null;},getAncestorByClassName:function(P,O){P=B.Dom.get(P);if(!P){return null;}var Q=function(R){return B.Dom.hasClass(R,O);};return B.Dom.getAncestorBy(P,Q);},getAncestorByTagName:function(P,O){P=B.Dom.get(P);if(!P){return null;}var Q=function(R){return R.tagName&&R.tagName.toUpperCase()==O.toUpperCase();};return B.Dom.getAncestorBy(P,Q);},getPreviousSiblingBy:function(O,P){while(O){O=O.previousSibling;if(D(O,P)){return O;}}return null;},getPreviousSibling:function(O){O=B.Dom.get(O);if(!O){return null;}return B.Dom.getPreviousSiblingBy(O);},getNextSiblingBy:function(O,P){while(O){O=O.nextSibling;if(D(O,P)){return O;}}return null;},getNextSibling:function(O){O=B.Dom.get(O);if(!O){return null;}return B.Dom.getNextSiblingBy(O);},getFirstChildBy:function(O,Q){var P=(D(O.firstChild,Q))?O.firstChild:null;return P||B.Dom.getNextSiblingBy(O.firstChild,Q);},getFirstChild:function(O,P){O=B.Dom.get(O);if(!O){return null;}return B.Dom.getFirstChildBy(O);},getLastChildBy:function(O,Q){if(!O){return null;}var P=(D(O.lastChild,Q))?O.lastChild:null;return P||B.Dom.getPreviousSiblingBy(O.lastChild,Q);},getLastChild:function(O){O=B.Dom.get(O);return B.Dom.getLastChildBy(O);},getChildrenBy:function(P,R){var Q=B.Dom.getFirstChildBy(P,R);var O=Q?[Q]:[];B.Dom.getNextSiblingBy(Q,function(S){if(!R||R(S)){O[O.length]=S;}return false;});return O;},getChildren:function(O){O=B.Dom.get(O);if(!O){}return B.Dom.getChildrenBy(O);},getDocumentScrollLeft:function(O){O=O||document;return Math.max(O.documentElement.scrollLeft,O.body.scrollLeft);},getDocumentScrollTop:function(O){O=O||document;return Math.max(O.documentElement.scrollTop,O.body.scrollTop);},insertBefore:function(P,O){P=B.Dom.get(P);O=B.Dom.get(O);if(!P||!O||!O.parentNode){return null;}return O.parentNode.insertBefore(P,O);},insertAfter:function(P,O){P=B.Dom.get(P);O=B.Dom.get(O);if(!P||!O||!O.parentNode){return null;}if(O.nextSibling){return O.parentNode.insertBefore(P,O.nextSibling);}else{return O.parentNode.appendChild(P);}}};})();YAHOO.util.Region=function(C,D,A,B){this.top=C;this[1]=C;this.right=D;this.bottom=A;this.left=B;this[0]=B;};YAHOO.util.Region.prototype.contains=function(A){return(A.left>=this.left&&A.right<=this.right&&A.top>=this.top&&A.bottom<=this.bottom);};YAHOO.util.Region.prototype.getArea=function(){return((this.bottom-this.top)*(this.right-this.left));};YAHOO.util.Region.prototype.intersect=function(E){var C=Math.max(this.top,E.top);var D=Math.min(this.right,E.right);var A=Math.min(this.bottom,E.bottom);var B=Math.max(this.left,E.left);if(A>=C&&D>=B){return new YAHOO.util.Region(C,D,A,B);}else{return null;}};YAHOO.util.Region.prototype.union=function(E){var C=Math.min(this.top,E.top);var D=Math.max(this.right,E.right);var A=Math.max(this.bottom,E.bottom);var B=Math.min(this.left,E.left);return new YAHOO.util.Region(C,D,A,B);};YAHOO.util.Region.prototype.toString=function(){return("Region {top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+"}");};YAHOO.util.Region.getRegion=function(D){var F=YAHOO.util.Dom.getXY(D);var C=F[1];var E=F[0]+D.offsetWidth;var A=F[1]+D.offsetHeight;var B=F[0];return new YAHOO.util.Region(C,E,A,B);};YAHOO.util.Point=function(A,B){if(YAHOO.lang.isArray(A)){B=A[1];A=A[0];}this.x=this.right=this.left=this[0]=A;this.y=this.top=this.bottom=this[1]=B;};YAHOO.util.Point.prototype=new YAHOO.util.Region();YAHOO.register("dom",YAHOO.util.Dom,{version:"2.3.1",build:"541"});YAHOO.util.CustomEvent=function(D,B,C,A){this.type=D;this.scope=B||window;this.silent=C;this.signature=A||YAHOO.util.CustomEvent.LIST;this.subscribers=[];if(!this.silent){}var E="_YUICEOnSubscribe";if(D!==E){this.subscribeEvent=new YAHOO.util.CustomEvent(E,this,true);}this.lastError=null;};YAHOO.util.CustomEvent.LIST=0;YAHOO.util.CustomEvent.FLAT=1;YAHOO.util.CustomEvent.prototype={subscribe:function(B,C,A){if(!B){throw new Error("Invalid callback for subscriber to '"+this.type+"'");}if(this.subscribeEvent){this.subscribeEvent.fire(B,C,A);}this.subscribers.push(new YAHOO.util.Subscriber(B,C,A));},unsubscribe:function(D,F){if(!D){return this.unsubscribeAll();}var E=false;for(var B=0,A=this.subscribers.length;B<A;++B){var C=this.subscribers[B];if(C&&C.contains(D,F)){this._delete(B);E=true;}}return E;},fire:function(){var E=this.subscribers.length;if(!E&&this.silent){return true;}var H=[],G=true,D,I=false;for(D=0;D<arguments.length;++D){H.push(arguments[D]);}var A=H.length;if(!this.silent){}for(D=0;D<E;++D){var L=this.subscribers[D];if(!L){I=true;}else{if(!this.silent){}var K=L.getScope(this.scope);if(this.signature==YAHOO.util.CustomEvent.FLAT){var B=null;if(H.length>0){B=H[0];}try{G=L.fn.call(K,B,L.obj);}catch(F){this.lastError=F;}}else{try{G=L.fn.call(K,this.type,H,L.obj);}catch(F){this.lastError=F;}}if(false===G){if(!this.silent){}return false;}}}if(I){var J=[],C=this.subscribers;for(D=0,E=C.length;D<E;D=D+1){J.push(C[D]);}this.subscribers=J;}return true;},unsubscribeAll:function(){for(var B=0,A=this.subscribers.length;B<A;++B){this._delete(A-1-B);}this.subscribers=[];return B;},_delete:function(A){var B=this.subscribers[A];if(B){delete B.fn;delete B.obj;}this.subscribers[A]=null;},toString:function(){return"CustomEvent: '"+this.type+"', scope: "+this.scope;}};YAHOO.util.Subscriber=function(B,C,A){this.fn=B;this.obj=YAHOO.lang.isUndefined(C)?null:C;this.override=A;};YAHOO.util.Subscriber.prototype.getScope=function(A){if(this.override){if(this.override===true){return this.obj;}else{return this.override;}}return A;};YAHOO.util.Subscriber.prototype.contains=function(A,B){if(B){return(this.fn==A&&this.obj==B);}else{return(this.fn==A);}};YAHOO.util.Subscriber.prototype.toString=function(){return"Subscriber { obj: "+this.obj+", override: "+(this.override||"no")+" }";};if(!YAHOO.util.Event){YAHOO.util.Event=function(){var H=false;var J=false;var I=[];var K=[];var G=[];var E=[];var C=0;var F=[];var B=[];var A=0;var D={63232:38,63233:40,63234:37,63235:39};return{POLL_RETRYS:4000,POLL_INTERVAL:10,EL:0,TYPE:1,FN:2,WFN:3,UNLOAD_OBJ:3,ADJ_SCOPE:4,OBJ:5,OVERRIDE:6,lastError:null,isSafari:YAHOO.env.ua.webkit,webkit:YAHOO.env.ua.webkit,isIE:YAHOO.env.ua.ie,_interval:null,startInterval:function(){if(!this._interval){var L=this;var M=function(){L._tryPreloadAttach();};this._interval=setInterval(M,this.POLL_INTERVAL);}},onAvailable:function(N,L,O,M){F.push({id:N,fn:L,obj:O,override:M,checkReady:false});C=this.POLL_RETRYS;this.startInterval();},onDOMReady:function(L,N,M){if(J){setTimeout(function(){var O=window;if(M){if(M===true){O=N;}else{O=M;}}L.call(O,"DOMReady",[],N);},0);}else{this.DOMReadyEvent.subscribe(L,N,M);}},onContentReady:function(N,L,O,M){F.push({id:N,fn:L,obj:O,override:M,checkReady:true});C=this.POLL_RETRYS;this.startInterval();},addListener:function(N,L,W,R,M){if(!W||!W.call){return false;}if(this._isValidCollection(N)){var X=true;for(var S=0,U=N.length;S<U;++S){X=this.on(N[S],L,W,R,M)&&X;}return X;}else{if(YAHOO.lang.isString(N)){var Q=this.getEl(N);if(Q){N=Q;}else{this.onAvailable(N,function(){YAHOO.util.Event.on(N,L,W,R,M);});return true;}}}if(!N){return false;}if("unload"==L&&R!==this){K[K.length]=[N,L,W,R,M];return true;}var Z=N;if(M){if(M===true){Z=R;}else{Z=M;}}var O=function(a){return W.call(Z,YAHOO.util.Event.getEvent(a,N),R);};var Y=[N,L,W,O,Z,R,M];var T=I.length;I[T]=Y;if(this.useLegacyEvent(N,L)){var P=this.getLegacyIndex(N,L);if(P==-1||N!=G[P][0]){P=G.length;B[N.id+L]=P;G[P]=[N,L,N["on"+L]];E[P]=[];N["on"+L]=function(a){YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(a),P);};}E[P].push(Y);}else{try{this._simpleAdd(N,L,O,false);}catch(V){this.lastError=V;this.removeListener(N,L,W);return false;}}return true;},fireLegacyEvent:function(P,N){var R=true,L,T,S,U,Q;T=E[N];for(var M=0,O=T.length;M<O;++M){S=T[M];if(S&&S[this.WFN]){U=S[this.ADJ_SCOPE];Q=S[this.WFN].call(U,P);R=(R&&Q);}}L=G[N];if(L&&L[2]){L[2](P);}return R;},getLegacyIndex:function(M,N){var L=this.generateId(M)+N;if(typeof B[L]=="undefined"){return -1;}else{return B[L];}},useLegacyEvent:function(M,N){if(this.webkit&&("click"==N||"dblclick"==N)){var L=parseInt(this.webkit,10);if(!isNaN(L)&&L<418){return true;}}return false;},removeListener:function(M,L,U){var P,S,W;if(typeof M=="string"){M=this.getEl(M);}else{if(this._isValidCollection(M)){var V=true;for(P=0,S=M.length;P<S;++P){V=(this.removeListener(M[P],L,U)&&V);}return V;}}if(!U||!U.call){return this.purgeElement(M,false,L);}if("unload"==L){for(P=0,S=K.length;P<S;P++){W=K[P];if(W&&W[0]==M&&W[1]==L&&W[2]==U){K[P]=null;return true;}}return false;}var Q=null;var R=arguments[3];if("undefined"===typeof R){R=this._getCacheIndex(M,L,U);}if(R>=0){Q=I[R];}if(!M||!Q){return false;}if(this.useLegacyEvent(M,L)){var O=this.getLegacyIndex(M,L);var N=E[O];if(N){for(P=0,S=N.length;P<S;++P){W=N[P];if(W&&W[this.EL]==M&&W[this.TYPE]==L&&W[this.FN]==U){N[P]=null;break;}}}}else{try{this._simpleRemove(M,L,Q[this.WFN],false);}catch(T){this.lastError=T;return false;}}delete I[R][this.WFN];delete I[R][this.FN];I[R]=null;return true;},getTarget:function(N,M){var L=N.target||N.srcElement;return this.resolveTextNode(L);},resolveTextNode:function(L){if(L&&3==L.nodeType){return L.parentNode;}else{return L;}},getPageX:function(M){var L=M.pageX;if(!L&&0!==L){L=M.clientX||0;if(this.isIE){L+=this._getScrollLeft();}}return L;},getPageY:function(L){var M=L.pageY;if(!M&&0!==M){M=L.clientY||0;if(this.isIE){M+=this._getScrollTop();}}return M;},getXY:function(L){return[this.getPageX(L),this.getPageY(L)];
},getRelatedTarget:function(M){var L=M.relatedTarget;if(!L){if(M.type=="mouseout"){L=M.toElement;}else{if(M.type=="mouseover"){L=M.fromElement;}}}return this.resolveTextNode(L);},getTime:function(N){if(!N.time){var M=new Date().getTime();try{N.time=M;}catch(L){this.lastError=L;return M;}}return N.time;},stopEvent:function(L){this.stopPropagation(L);this.preventDefault(L);},stopPropagation:function(L){if(L.stopPropagation){L.stopPropagation();}else{L.cancelBubble=true;}},preventDefault:function(L){if(L.preventDefault){L.preventDefault();}else{L.returnValue=false;}},getEvent:function(Q,O){var P=Q||window.event;if(!P){var R=this.getEvent.caller;while(R){P=R.arguments[0];if(P&&Event==P.constructor){break;}R=R.caller;}}if(P&&this.isIE){try{var N=P.srcElement;if(N){var M=N.type;}}catch(L){P.target=O;}}return P;},getCharCode:function(M){var L=M.keyCode||M.charCode||0;if(YAHOO.env.ua.webkit&&(L in D)){L=D[L];}return L;},_getCacheIndex:function(P,Q,O){for(var N=0,M=I.length;N<M;++N){var L=I[N];if(L&&L[this.FN]==O&&L[this.EL]==P&&L[this.TYPE]==Q){return N;}}return -1;},generateId:function(L){var M=L.id;if(!M){M="yuievtautoid-"+A;++A;L.id=M;}return M;},_isValidCollection:function(M){try{return(typeof M!=="string"&&M.length&&!M.tagName&&!M.alert&&typeof M[0]!=="undefined");}catch(L){return false;}},elCache:{},getEl:function(L){return(typeof L==="string")?document.getElementById(L):L;},clearCache:function(){},DOMReadyEvent:new YAHOO.util.CustomEvent("DOMReady",this),_load:function(M){if(!H){H=true;var L=YAHOO.util.Event;L._ready();L._tryPreloadAttach();}},_ready:function(M){if(!J){J=true;var L=YAHOO.util.Event;L.DOMReadyEvent.fire();L._simpleRemove(document,"DOMContentLoaded",L._ready);}},_tryPreloadAttach:function(){if(this.locked){return false;}if(this.isIE){if(!J){this.startInterval();return false;}}this.locked=true;var Q=!H;if(!Q){Q=(C>0);}var P=[];var R=function(T,U){var S=T;if(U.override){if(U.override===true){S=U.obj;}else{S=U.override;}}U.fn.call(S,U.obj);};var M,L,O,N;for(M=0,L=F.length;M<L;++M){O=F[M];if(O&&!O.checkReady){N=this.getEl(O.id);if(N){R(N,O);F[M]=null;}else{P.push(O);}}}for(M=0,L=F.length;M<L;++M){O=F[M];if(O&&O.checkReady){N=this.getEl(O.id);if(N){if(H||N.nextSibling){R(N,O);F[M]=null;}}else{P.push(O);}}}C=(P.length===0)?0:C-1;if(Q){this.startInterval();}else{clearInterval(this._interval);this._interval=null;}this.locked=false;return true;},purgeElement:function(O,P,R){var Q=this.getListeners(O,R),N,L;if(Q){for(N=0,L=Q.length;N<L;++N){var M=Q[N];this.removeListener(O,M.type,M.fn,M.index);}}if(P&&O&&O.childNodes){for(N=0,L=O.childNodes.length;N<L;++N){this.purgeElement(O.childNodes[N],P,R);}}},getListeners:function(N,L){var Q=[],M;if(!L){M=[I,K];}else{if(L=="unload"){M=[K];}else{M=[I];}}for(var P=0;P<M.length;P=P+1){var T=M[P];if(T&&T.length>0){for(var R=0,S=T.length;R<S;++R){var O=T[R];if(O&&O[this.EL]===N&&(!L||L===O[this.TYPE])){Q.push({type:O[this.TYPE],fn:O[this.FN],obj:O[this.OBJ],adjust:O[this.OVERRIDE],scope:O[this.ADJ_SCOPE],index:R});}}}}return(Q.length)?Q:null;},_unload:function(S){var R=YAHOO.util.Event,P,O,M,L,N;for(P=0,L=K.length;P<L;++P){M=K[P];if(M){var Q=window;if(M[R.ADJ_SCOPE]){if(M[R.ADJ_SCOPE]===true){Q=M[R.UNLOAD_OBJ];}else{Q=M[R.ADJ_SCOPE];}}M[R.FN].call(Q,R.getEvent(S,M[R.EL]),M[R.UNLOAD_OBJ]);K[P]=null;M=null;Q=null;}}K=null;if(I&&I.length>0){O=I.length;while(O){N=O-1;M=I[N];if(M){R.removeListener(M[R.EL],M[R.TYPE],M[R.FN],N);}O=O-1;}M=null;R.clearCache();}for(P=0,L=G.length;P<L;++P){G[P][0]=null;G[P]=null;}G=null;R._simpleRemove(window,"unload",R._unload);},_getScrollLeft:function(){return this._getScroll()[1];},_getScrollTop:function(){return this._getScroll()[0];},_getScroll:function(){var L=document.documentElement,M=document.body;if(L&&(L.scrollTop||L.scrollLeft)){return[L.scrollTop,L.scrollLeft];}else{if(M){return[M.scrollTop,M.scrollLeft];}else{return[0,0];}}},regCE:function(){},_simpleAdd:function(){if(window.addEventListener){return function(N,O,M,L){N.addEventListener(O,M,(L));};}else{if(window.attachEvent){return function(N,O,M,L){N.attachEvent("on"+O,M);};}else{return function(){};}}}(),_simpleRemove:function(){if(window.removeEventListener){return function(N,O,M,L){N.removeEventListener(O,M,(L));};}else{if(window.detachEvent){return function(M,N,L){M.detachEvent("on"+N,L);};}else{return function(){};}}}()};}();(function(){var D=YAHOO.util.Event;D.on=D.addListener;if(D.isIE){YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach,YAHOO.util.Event,true);var B,E=document,A=E.body;if(("undefined"!==typeof YAHOO_config)&&YAHOO_config.injecting){B=document.createElement("script");var C=E.getElementsByTagName("head")[0]||A;C.insertBefore(B,C.firstChild);}else{E.write("<script id=\"_yui_eu_dr\" defer=\"true\" src=\"//:\"></script>");B=document.getElementById("_yui_eu_dr");}if(B){B.onreadystatechange=function(){if("complete"===this.readyState){this.parentNode.removeChild(this);YAHOO.util.Event._ready();}};}else{}B=null;}else{if(D.webkit){D._drwatch=setInterval(function(){var F=document.readyState;if("loaded"==F||"complete"==F){clearInterval(D._drwatch);D._drwatch=null;D._ready();}},D.POLL_INTERVAL);}else{D._simpleAdd(document,"DOMContentLoaded",D._ready);}}D._simpleAdd(window,"load",D._load);D._simpleAdd(window,"unload",D._unload);D._tryPreloadAttach();})();}YAHOO.util.EventProvider=function(){};YAHOO.util.EventProvider.prototype={__yui_events:null,__yui_subscribers:null,subscribe:function(A,C,F,E){this.__yui_events=this.__yui_events||{};var D=this.__yui_events[A];if(D){D.subscribe(C,F,E);}else{this.__yui_subscribers=this.__yui_subscribers||{};var B=this.__yui_subscribers;if(!B[A]){B[A]=[];}B[A].push({fn:C,obj:F,override:E});}},unsubscribe:function(C,E,G){this.__yui_events=this.__yui_events||{};var A=this.__yui_events;if(C){var F=A[C];if(F){return F.unsubscribe(E,G);}}else{var B=true;for(var D in A){if(YAHOO.lang.hasOwnProperty(A,D)){B=B&&A[D].unsubscribe(E,G);}}return B;}return false;},unsubscribeAll:function(A){return this.unsubscribe(A);},createEvent:function(G,D){this.__yui_events=this.__yui_events||{};
var A=D||{};var I=this.__yui_events;if(I[G]){}else{var H=A.scope||this;var E=(A.silent);var B=new YAHOO.util.CustomEvent(G,H,E,YAHOO.util.CustomEvent.FLAT);I[G]=B;if(A.onSubscribeCallback){B.subscribeEvent.subscribe(A.onSubscribeCallback);}this.__yui_subscribers=this.__yui_subscribers||{};var F=this.__yui_subscribers[G];if(F){for(var C=0;C<F.length;++C){B.subscribe(F[C].fn,F[C].obj,F[C].override);}}}return I[G];},fireEvent:function(E,D,A,C){this.__yui_events=this.__yui_events||{};var G=this.__yui_events[E];if(!G){return null;}var B=[];for(var F=1;F<arguments.length;++F){B.push(arguments[F]);}return G.fire.apply(G,B);},hasEvent:function(A){if(this.__yui_events){if(this.__yui_events[A]){return true;}}return false;}};YAHOO.util.KeyListener=function(A,F,B,C){if(!A){}else{if(!F){}else{if(!B){}}}if(!C){C=YAHOO.util.KeyListener.KEYDOWN;}var D=new YAHOO.util.CustomEvent("keyPressed");this.enabledEvent=new YAHOO.util.CustomEvent("enabled");this.disabledEvent=new YAHOO.util.CustomEvent("disabled");if(typeof A=="string"){A=document.getElementById(A);}if(typeof B=="function"){D.subscribe(B);}else{D.subscribe(B.fn,B.scope,B.correctScope);}function E(K,J){if(!F.shift){F.shift=false;}if(!F.alt){F.alt=false;}if(!F.ctrl){F.ctrl=false;}if(K.shiftKey==F.shift&&K.altKey==F.alt&&K.ctrlKey==F.ctrl){var H;var G;if(F.keys instanceof Array){for(var I=0;I<F.keys.length;I++){H=F.keys[I];if(H==K.charCode){D.fire(K.charCode,K);break;}else{if(H==K.keyCode){D.fire(K.keyCode,K);break;}}}}else{H=F.keys;if(H==K.charCode){D.fire(K.charCode,K);}else{if(H==K.keyCode){D.fire(K.keyCode,K);}}}}}this.enable=function(){if(!this.enabled){YAHOO.util.Event.addListener(A,C,E);this.enabledEvent.fire(F);}this.enabled=true;};this.disable=function(){if(this.enabled){YAHOO.util.Event.removeListener(A,C,E);this.disabledEvent.fire(F);}this.enabled=false;};this.toString=function(){return"KeyListener ["+F.keys+"] "+A.tagName+(A.id?"["+A.id+"]":"");};};YAHOO.util.KeyListener.KEYDOWN="keydown";YAHOO.util.KeyListener.KEYUP="keyup";YAHOO.register("event",YAHOO.util.Event,{version:"2.3.1",build:"541"});YAHOO.register("yahoo-dom-event", YAHOO, {version: "2.3.1", build: "541"});

/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.3.1
*/
/**
 * Provides Attribute configurations.
 * @namespace YAHOO.util
 * @class Attribute
 * @constructor
 * @param hash {Object} The intial Attribute.
 * @param {YAHOO.util.AttributeProvider} The owner of the Attribute instance.
 */

YAHOO.util.Attribute = function(hash, owner) {
    if (owner) { 
        this.owner = owner;
        this.configure(hash, true);
    }
};

YAHOO.util.Attribute.prototype = {
	/**
     * The name of the attribute.
	 * @property name
	 * @type String
	 */
    name: undefined,
    
	/**
     * The value of the attribute.
	 * @property value
	 * @type String
	 */
    value: null,
    
	/**
     * The owner of the attribute.
	 * @property owner
	 * @type YAHOO.util.AttributeProvider
	 */
    owner: null,
    
	/**
     * Whether or not the attribute is read only.
	 * @property readOnly
	 * @type Boolean
	 */
    readOnly: false,
    
	/**
     * Whether or not the attribute can only be written once.
	 * @property writeOnce
	 * @type Boolean
	 */
    writeOnce: false,

	/**
     * The attribute's initial configuration.
     * @private
	 * @property _initialConfig
	 * @type Object
	 */
    _initialConfig: null,
    
	/**
     * Whether or not the attribute's value has been set.
     * @private
	 * @property _written
	 * @type Boolean
	 */
    _written: false,
    
	/**
     * The method to use when setting the attribute's value.
     * The method recieves the new value as the only argument.
	 * @property method
	 * @type Function
	 */
    method: null,
    
	/**
     * The validator to use when setting the attribute's value.
	 * @property validator
	 * @type Function
     * @return Boolean
	 */
    validator: null,
    
    /**
     * Retrieves the current value of the attribute.
     * @method getValue
     * @return {any} The current value of the attribute.
     */
    getValue: function() {
        return this.value;
    },
    
    /**
     * Sets the value of the attribute and fires beforeChange and change events.
     * @method setValue
     * @param {Any} value The value to apply to the attribute.
     * @param {Boolean} silent If true the change events will not be fired.
     * @return {Boolean} Whether or not the value was set.
     */
    setValue: function(value, silent) {
        var beforeRetVal;
        var owner = this.owner;
        var name = this.name;
        
        var event = {
            type: name, 
            prevValue: this.getValue(),
            newValue: value
        };
        
        if (this.readOnly || ( this.writeOnce && this._written) ) {
            return false; // write not allowed
        }
        
        if (this.validator && !this.validator.call(owner, value) ) {
            return false; // invalid value
        }

        if (!silent) {
            beforeRetVal = owner.fireBeforeChangeEvent(event);
            if (beforeRetVal === false) {
                return false;
            }
        }

        if (this.method) {
            this.method.call(owner, value);
        }
        
        this.value = value;
        this._written = true;
        
        event.type = name;
        
        if (!silent) {
            this.owner.fireChangeEvent(event);
        }
        
        return true;
    },
    
    /**
     * Allows for configuring the Attribute's properties.
     * @method configure
     * @param {Object} map A key-value map of Attribute properties.
     * @param {Boolean} init Whether or not this should become the initial config.
     */
    configure: function(map, init) {
        map = map || {};
        this._written = false; // reset writeOnce
        this._initialConfig = this._initialConfig || {};
        
        for (var key in map) {
            if ( key && YAHOO.lang.hasOwnProperty(map, key) ) {
                this[key] = map[key];
                if (init) {
                    this._initialConfig[key] = map[key];
                }
            }
        }
    },
    
    /**
     * Resets the value to the initial config value.
     * @method resetValue
     * @return {Boolean} Whether or not the value was set.
     */
    resetValue: function() {
        return this.setValue(this._initialConfig.value);
    },
    
    /**
     * Resets the attribute config to the initial config state.
     * @method resetConfig
     */
    resetConfig: function() {
        this.configure(this._initialConfig);
    },
    
    /**
     * Resets the value to the current value.
     * Useful when values may have gotten out of sync with actual properties.
     * @method refresh
     * @return {Boolean} Whether or not the value was set.
     */
    refresh: function(silent) {
        this.setValue(this.value, silent);
    }
};

(function() {
    var Lang = YAHOO.util.Lang;

    /*
    Copyright (c) 2006, Yahoo! Inc. All rights reserved.
    Code licensed under the BSD License:
    http://developer.yahoo.net/yui/license.txt
    */
    
    /**
     * Provides and manages YAHOO.util.Attribute instances
     * @namespace YAHOO.util
     * @class AttributeProvider
     * @uses YAHOO.util.EventProvider
     */
    YAHOO.util.AttributeProvider = function() {};

    YAHOO.util.AttributeProvider.prototype = {
        
        /**
         * A key-value map of Attribute configurations
         * @property _configs
         * @protected (may be used by subclasses and augmentors)
         * @private
         * @type {Object}
         */
        _configs: null,
        /**
         * Returns the current value of the attribute.
         * @method get
         * @param {String} key The attribute whose value will be returned.
         */
        get: function(key){
            this._configs = this._configs || {};
            var config = this._configs[key];
            
            if (!config) {
                return undefined;
            }
            
            return config.value;
        },
        
        /**
         * Sets the value of a config.
         * @method set
         * @param {String} key The name of the attribute
         * @param {Any} value The value to apply to the attribute
         * @param {Boolean} silent Whether or not to suppress change events
         * @return {Boolean} Whether or not the value was set.
         */
        set: function(key, value, silent){
            this._configs = this._configs || {};
            var config = this._configs[key];
            
            if (!config) {
                return false;
            }
            
            return config.setValue(value, silent);
        },
    
        /**
         * Returns an array of attribute names.
         * @method getAttributeKeys
         * @return {Array} An array of attribute names.
         */
        getAttributeKeys: function(){
            this._configs = this._configs;
            var keys = [];
            var config;
            for (var key in this._configs) {
                config = this._configs[key];
                if ( Lang.hasOwnProperty(this._configs, key) && 
                        !Lang.isUndefined(config) ) {
                    keys[keys.length] = key;
                }
            }
            
            return keys;
        },
        
        /**
         * Sets multiple attribute values.
         * @method setAttributes
         * @param {Object} map  A key-value map of attributes
         * @param {Boolean} silent Whether or not to suppress change events
         */
        setAttributes: function(map, silent){
            for (var key in map) {
                if ( Lang.hasOwnProperty(map, key) ) {
                    this.set(key, map[key], silent);
                }
            }
        },
    
        /**
         * Resets the specified attribute's value to its initial value.
         * @method resetValue
         * @param {String} key The name of the attribute
         * @param {Boolean} silent Whether or not to suppress change events
         * @return {Boolean} Whether or not the value was set
         */
        resetValue: function(key, silent){
            this._configs = this._configs || {};
            if (this._configs[key]) {
                this.set(key, this._configs[key]._initialConfig.value, silent);
                return true;
            }
            return false;
        },
    
        /**
         * Sets the attribute's value to its current value.
         * @method refresh
         * @param {String | Array} key The attribute(s) to refresh
         * @param {Boolean} silent Whether or not to suppress change events
         */
        refresh: function(key, silent){
            this._configs = this._configs;
            
            key = ( ( Lang.isString(key) ) ? [key] : key ) || 
                    this.getAttributeKeys();
            
            for (var i = 0, len = key.length; i < len; ++i) { 
                if ( // only set if there is a value and not null
                    this._configs[key[i]] && 
                    ! Lang.isUndefined(this._configs[key[i]].value) &&
                    ! Lang.isNull(this._configs[key[i]].value) ) {
                    this._configs[key[i]].refresh(silent);
                }
            }
        },
    
        /**
         * Adds an Attribute to the AttributeProvider instance. 
         * @method register
         * @param {String} key The attribute's name
         * @param {Object} map A key-value map containing the
         * attribute's properties.
         * @deprecated Use setAttributeConfig
         */
        register: function(key, map) {
            this.setAttributeConfig(key, map);
        },
        
        
        /**
         * Returns the attribute's properties.
         * @method getAttributeConfig
         * @param {String} key The attribute's name
         * @private
         * @return {object} A key-value map containing all of the
         * attribute's properties.
         */
        getAttributeConfig: function(key) {
            this._configs = this._configs || {};
            var config = this._configs[key] || {};
            var map = {}; // returning a copy to prevent overrides
            
            for (key in config) {
                if ( Lang.hasOwnProperty(config, key) ) {
                    map[key] = config[key];
                }
            }
    
            return map;
        },
        
        /**
         * Sets or updates an Attribute instance's properties. 
         * @method setAttributeConfig
         * @param {String} key The attribute's name.
         * @param {Object} map A key-value map of attribute properties
         * @param {Boolean} init Whether or not this should become the intial config.
         */
        setAttributeConfig: function(key, map, init) {
            this._configs = this._configs || {};
            map = map || {};
            if (!this._configs[key]) {
                map.name = key;
                this._configs[key] = this.createAttribute(map);
            } else {
                this._configs[key].configure(map, init);
            }
        },
        
        /**
         * Sets or updates an Attribute instance's properties. 
         * @method configureAttribute
         * @param {String} key The attribute's name.
         * @param {Object} map A key-value map of attribute properties
         * @param {Boolean} init Whether or not this should become the intial config.
         * @deprecated Use setAttributeConfig
         */
        configureAttribute: function(key, map, init) {
            this.setAttributeConfig(key, map, init);
        },
        
        /**
         * Resets an attribute to its intial configuration. 
         * @method resetAttributeConfig
         * @param {String} key The attribute's name.
         * @private
         */
        resetAttributeConfig: function(key){
            this._configs = this._configs || {};
            this._configs[key].resetConfig();
        },
        
        // wrapper for EventProvider.subscribe
        // to create events on the fly
        subscribe: function(type, callback) {
            this._events = this._events || {};

            if ( !(type in this._events) ) {
                this._events[type] = this.createEvent(type);
            }

            YAHOO.util.EventProvider.prototype.subscribe.apply(this, arguments);
        },

        on: function() {
            this.subscribe.apply(this, arguments);
        },

        addListener: function() {
            this.subscribe.apply(this, arguments);
        },

        /**
         * Fires the attribute's beforeChange event. 
         * @method fireBeforeChangeEvent
         * @param {String} key The attribute's name.
         * @param {Obj} e The event object to pass to handlers.
         */
        fireBeforeChangeEvent: function(e) {
            var type = 'before';
            type += e.type.charAt(0).toUpperCase() + e.type.substr(1) + 'Change';
            e.type = type;
            return this.fireEvent(e.type, e);
        },
        
        /**
         * Fires the attribute's change event. 
         * @method fireChangeEvent
         * @param {String} key The attribute's name.
         * @param {Obj} e The event object to pass to the handlers.
         */
        fireChangeEvent: function(e) {
            e.type += 'Change';
            return this.fireEvent(e.type, e);
        },

        createAttribute: function(map) {
            return new YAHOO.util.Attribute(map, this);
        }
    };
    
    YAHOO.augment(YAHOO.util.AttributeProvider, YAHOO.util.EventProvider);
})();

(function() {
// internal shorthand
var Dom = YAHOO.util.Dom,
    AttributeProvider = YAHOO.util.AttributeProvider;

/**
 * Element provides an wrapper object to simplify adding
 * event listeners, using dom methods, and managing attributes. 
 * @module element
 * @namespace YAHOO.util
 * @requires yahoo, dom, event
 * @beta
 */

/**
 * Element provides an wrapper object to simplify adding
 * event listeners, using dom methods, and managing attributes. 
 * @class Element
 * @uses YAHOO.util.AttributeProvider
 * @constructor
 * @param el {HTMLElement | String} The html element that 
 * represents the Element.
 * @param {Object} map A key-value map of initial config names and values
 */
YAHOO.util.Element = function(el, map) {
    if (arguments.length) {
        this.init(el, map);
    }
};

YAHOO.util.Element.prototype = {
    /**
     * Dom events supported by the Element instance.
     * @property DOM_EVENTS
     * @type Object
     */
    DOM_EVENTS: null,

    /**
     * Wrapper for HTMLElement method.
     * @method appendChild
     * @param {YAHOO.util.Element || HTMLElement} child The element to append. 
     */
    appendChild: function(child) {
        child = child.get ? child.get('element') : child;
        this.get('element').appendChild(child);
    },
    
    /**
     * Wrapper for HTMLElement method.
     * @method getElementsByTagName
     * @param {String} tag The tagName to collect
     */
    getElementsByTagName: function(tag) {
        return this.get('element').getElementsByTagName(tag);
    },
    
    /**
     * Wrapper for HTMLElement method.
     * @method hasChildNodes
     * @return {Boolean} Whether or not the element has childNodes
     */
    hasChildNodes: function() {
        return this.get('element').hasChildNodes();
    },
    
    /**
     * Wrapper for HTMLElement method.
     * @method insertBefore
     * @param {HTMLElement} element The HTMLElement to insert
     * @param {HTMLElement} before The HTMLElement to insert
     * the element before.
     */
    insertBefore: function(element, before) {
        element = element.get ? element.get('element') : element;
        before = (before && before.get) ? before.get('element') : before;
        
        this.get('element').insertBefore(element, before);
    },
    
    /**
     * Wrapper for HTMLElement method.
     * @method removeChild
     * @param {HTMLElement} child The HTMLElement to remove
     */
    removeChild: function(child) {
        child = child.get ? child.get('element') : child;
        this.get('element').removeChild(child);
        return true;
    },
    
    /**
     * Wrapper for HTMLElement method.
     * @method replaceChild
     * @param {HTMLElement} newNode The HTMLElement to insert
     * @param {HTMLElement} oldNode The HTMLElement to replace
     */
    replaceChild: function(newNode, oldNode) {
        newNode = newNode.get ? newNode.get('element') : newNode;
        oldNode = oldNode.get ? oldNode.get('element') : oldNode;
        return this.get('element').replaceChild(newNode, oldNode);
    },

    
    /**
     * Registers Element specific attributes.
     * @method initAttributes
     * @param {Object} map A key-value map of initial attribute configs
     */
    initAttributes: function(map) {
    },

    /**
     * Adds a listener for the given event.  These may be DOM or 
     * customEvent listeners.  Any event that is fired via fireEvent
     * can be listened for.  All handlers receive an event object. 
     * @method addListener
     * @param {String} type The name of the event to listen for
     * @param {Function} fn The handler to call when the event fires
     * @param {Any} obj A variable to pass to the handler
     * @param {Object} scope The object to use for the scope of the handler 
     */
    addListener: function(type, fn, obj, scope) {
        var el = this.get('element');
        scope = scope || this;
        
        el = this.get('id') || el;
        var self = this; 
        if (!this._events[type]) { // create on the fly
            if ( this.DOM_EVENTS[type] ) {
                YAHOO.util.Event.addListener(el, type, function(e) {
                    if (e.srcElement && !e.target) { // supplement IE with target
                        e.target = e.srcElement;
                    }
                    self.fireEvent(type, e);
                }, obj, scope);
            }
            
            this.createEvent(type, this);
        }
        
        YAHOO.util.EventProvider.prototype.subscribe.apply(this, arguments); // notify via customEvent
    },
    
    
    /**
     * Alias for addListener
     * @method on
     * @param {String} type The name of the event to listen for
     * @param {Function} fn The function call when the event fires
     * @param {Any} obj A variable to pass to the handler
     * @param {Object} scope The object to use for the scope of the handler 
     */
    on: function() { this.addListener.apply(this, arguments); },
    
    /**
     * Alias for addListener
     * @method subscribe
     * @param {String} type The name of the event to listen for
     * @param {Function} fn The function call when the event fires
     * @param {Any} obj A variable to pass to the handler
     * @param {Object} scope The object to use for the scope of the handler 
     */
    subscribe: function() { this.addListener.apply(this, arguments); },
    
    /**
     * Remove an event listener
     * @method removeListener
     * @param {String} type The name of the event to listen for
     * @param {Function} fn The function call when the event fires
     */
    removeListener: function(type, fn) {
        this.unsubscribe.apply(this, arguments);
    },
    
    /**
     * Wrapper for Dom method.
     * @method addClass
     * @param {String} className The className to add
     */
    addClass: function(className) {
        Dom.addClass(this.get('element'), className);
    },
    
    /**
     * Wrapper for Dom method.
     * @method getElementsByClassName
     * @param {String} className The className to collect
     * @param {String} tag (optional) The tag to use in
     * conjunction with class name
     * @return {Array} Array of HTMLElements
     */
    getElementsByClassName: function(className, tag) {
        return Dom.getElementsByClassName(className, tag,
                this.get('element') );
    },
    
    /**
     * Wrapper for Dom method.
     * @method hasClass
     * @param {String} className The className to add
     * @return {Boolean} Whether or not the element has the class name
     */
    hasClass: function(className) {
        return Dom.hasClass(this.get('element'), className); 
    },
    
    /**
     * Wrapper for Dom method.
     * @method removeClass
     * @param {String} className The className to remove
     */
    removeClass: function(className) {
        return Dom.removeClass(this.get('element'), className);
    },
    
    /**
     * Wrapper for Dom method.
     * @method replaceClass
     * @param {String} oldClassName The className to replace
     * @param {String} newClassName The className to add
     */
    replaceClass: function(oldClassName, newClassName) {
        return Dom.replaceClass(this.get('element'), 
                oldClassName, newClassName);
    },
    
    /**
     * Wrapper for Dom method.
     * @method setStyle
     * @param {String} property The style property to set
     * @param {String} value The value to apply to the style property
     */
    setStyle: function(property, value) {
        var el = this.get('element');
        if (!el) {
            return this._queue[this._queue.length] = ['setStyle', arguments];
        }

        return Dom.setStyle(el,  property, value); // TODO: always queuing?
    },
    
    /**
     * Wrapper for Dom method.
     * @method getStyle
     * @param {String} property The style property to retrieve
     * @return {String} The current value of the property
     */
    getStyle: function(property) {
        return Dom.getStyle(this.get('element'),  property);
    },
    
    /**
     * Apply any queued set calls.
     * @method fireQueue
     */
    fireQueue: function() {
        var queue = this._queue;
        for (var i = 0, len = queue.length; i < len; ++i) {
            this[queue[i][0]].apply(this, queue[i][1]);
        }
    },
    
    /**
     * Appends the HTMLElement into either the supplied parentNode.
     * @method appendTo
     * @param {HTMLElement | Element} parentNode The node to append to
     * @param {HTMLElement | Element} before An optional node to insert before
     */
    appendTo: function(parent, before) {
        parent = (parent.get) ?  parent.get('element') : Dom.get(parent);
        
        this.fireEvent('beforeAppendTo', {
            type: 'beforeAppendTo',
            target: parent
        });
        
        
        before = (before && before.get) ? 
                before.get('element') : Dom.get(before);
        var element = this.get('element');
        
        if (!element) {
            return false;
        }
        
        if (!parent) {
            return false;
        }
        
        if (element.parent != parent) {
            if (before) {
                parent.insertBefore(element, before);
            } else {
                parent.appendChild(element);
            }
        }
        
        
        this.fireEvent('appendTo', {
            type: 'appendTo',
            target: parent
        });
    },
    
    get: function(key) {
        var configs = this._configs || {};
        var el = configs.element; // avoid loop due to 'element'
        if (el && !configs[key] && !YAHOO.lang.isUndefined(el.value[key]) ) {
            return el.value[key];
        }

        return AttributeProvider.prototype.get.call(this, key);
    },

    setAttributes: function(map, silent){
        var el = this.get('element');
        for (var key in map) {
            // need to configure if setting unconfigured HTMLElement attribute 
            if ( !this._configs[key] && !YAHOO.lang.isUndefined(el[key]) ) {
                this.setAttributeConfig(key);
            }
        }

        // set based on configOrder
        for (var i = 0, len = this._configOrder.length; i < len; ++i) {
            if (map[this._configOrder[i]]) {
                this.set(this._configOrder[i], map[this._configOrder[i]], silent);
            }
        }
    },

    set: function(key, value, silent) {
        var el = this.get('element');
        if (!el) {
            this._queue[this._queue.length] = ['set', arguments];
            if (this._configs[key]) {
                this._configs[key].value = value; // so "get" works while queueing
            
            }
            return;
        }
        
        // set it on the element if not configured and is an HTML attribute
        if ( !this._configs[key] && !YAHOO.lang.isUndefined(el[key]) ) {
            _registerHTMLAttr.call(this, key);
        }

        return AttributeProvider.prototype.set.apply(this, arguments);
    },
    
    setAttributeConfig: function(key, map, init) {
        var el = this.get('element');

        if (el && !this._configs[key] && !YAHOO.lang.isUndefined(el[key]) ) {
            _registerHTMLAttr.call(this, key, map);
        } else {
            AttributeProvider.prototype.setAttributeConfig.apply(this, arguments);
        }
        this._configOrder.push(key);
    },
    
    getAttributeKeys: function() {
        var el = this.get('element');
        var keys = AttributeProvider.prototype.getAttributeKeys.call(this);
        
        //add any unconfigured element keys
        for (var key in el) {
            if (!this._configs[key]) {
                keys[key] = keys[key] || el[key];
            }
        }
        
        return keys;
    },

    createEvent: function(type, scope) {
        this._events[type] = true;
        AttributeProvider.prototype.createEvent.apply(this, arguments);
    },
    
    init: function(el, attr) {
        _initElement.apply(this, arguments); 
    }
};

var _initElement = function(el, attr) {
    this._queue = this._queue || [];
    this._events = this._events || {};
    this._configs = this._configs || {};
    this._configOrder = []; 
    attr = attr || {};
    attr.element = attr.element || el || null;

    this.DOM_EVENTS = {
        'click': true,
        'dblclick': true,
        'keydown': true,
        'keypress': true,
        'keyup': true,
        'mousedown': true,
        'mousemove': true,
        'mouseout': true, 
        'mouseover': true, 
        'mouseup': true,
        'focus': true,
        'blur': true,
        'submit': true
    };

    var isReady = false;  // to determine when to init HTMLElement and content

    if (YAHOO.lang.isString(el) ) { // defer until available/ready
        _registerHTMLAttr.call(this, 'id', { value: attr.element });
    }

    if (Dom.get(el)) {
        isReady = true;
        _initHTMLElement.call(this, attr);
        _initContent.call(this, attr);
    } 

    YAHOO.util.Event.onAvailable(attr.element, function() {
        if (!isReady) { // otherwise already done
            _initHTMLElement.call(this, attr);
        }

        this.fireEvent('available', { type: 'available', target: attr.element });  
    }, this, true);
    
    YAHOO.util.Event.onContentReady(attr.element, function() {
        if (!isReady) { // otherwise already done
            _initContent.call(this, attr);
        }
        this.fireEvent('contentReady', { type: 'contentReady', target: attr.element });  
    }, this, true);
};

var _initHTMLElement = function(attr) {
    /**
     * The HTMLElement the Element instance refers to.
     * @attribute element
     * @type HTMLElement
     */
    this.setAttributeConfig('element', {
        value: Dom.get(attr.element),
        readOnly: true
     });
};

var _initContent = function(attr) {
    this.initAttributes(attr);
    this.setAttributes(attr, true);
    this.fireQueue();

};

/**
 * Sets the value of the property and fires beforeChange and change events.
 * @private
 * @method _registerHTMLAttr
 * @param {YAHOO.util.Element} element The Element instance to
 * register the config to.
 * @param {String} key The name of the config to register
 * @param {Object} map A key-value map of the config's params
 */
var _registerHTMLAttr = function(key, map) {
    var el = this.get('element');
    map = map || {};
    map.name = key;
    map.method = map.method || function(value) {
        el[key] = value;
    };
    map.value = map.value || el[key];
    this._configs[key] = new YAHOO.util.Attribute(map, this);
};

/**
 * Fires when the Element's HTMLElement can be retrieved by Id.
 * <p>See: <a href="#addListener">Element.addListener</a></p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> available<br>
 * <code>&lt;HTMLElement&gt;
 * target</code> the HTMLElement bound to this Element instance<br>
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var target = e.target};<br>
 * myTabs.addListener('available', handler);</code></p>
 * @event available
 */
 
/**
 * Fires when the Element's HTMLElement subtree is rendered.
 * <p>See: <a href="#addListener">Element.addListener</a></p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> contentReady<br>
 * <code>&lt;HTMLElement&gt;
 * target</code> the HTMLElement bound to this Element instance<br>
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var target = e.target};<br>
 * myTabs.addListener('contentReady', handler);</code></p>
 * @event contentReady
 */


YAHOO.augment(YAHOO.util.Element, AttributeProvider);
})();

YAHOO.register("element", YAHOO.util.Element, {version: "2.3.1", build: "541"});

/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.2.2
*/
/**
* @module button
* @description <p>The Button Control enables the creation of rich, graphical 
* buttons that function like traditional HTML form buttons.  <em>Unlike</em> 
* tradition HTML form buttons, buttons created with the Button Control can have 
* a label that is different from its value.  With the inclusion of the optional 
* <a href="module_menu.html">Menu Control</a>, the Button Control can also be
* used to create menu buttons and split buttons, controls that are not 
* available natively in HTML.  The Button Control can also be thought of as a 
* way to create more visually engaging implementations of the browser's 
* default radio-button and check-box controls.</p>
* <p>The Button Control supports the following types:</p>
* <dl>
* <dt>button</dt>
* <dd>Basic push button that can execute a user-specified command when 
* pressed.</dd>
* <dt>link</dt>
* <dd>Navigates to a specified url when pressed.</dd>
* <dt>submit</dt>
* <dd>Submits the parent form when pressed.</dd>
* <dt>reset</dt>
* <dd>Resets the parent form when pressed.</dd>
* <dt>checkbox</dt>
* <dd>Maintains a "checked" state that can be toggled on and off.</dd>
* <dt>radio</dt>
* <dd>Maintains a "checked" state that can be toggled on and off.  Use with 
* the ButtonGroup class to create a set of controls that are mutually 
* exclusive; checking one button in the set will uncheck all others in 
* the group.</dd>
* <dt>menubutton</dt>
* <dd>When pressed will show/hide a menu.</dd>
* <dt>splitbutton</dt>
* <dd>Can execute a user-specified command or display a menu when pressed.</dd>
* </dl>
* @title Button
* @namespace YAHOO.widget
* @requires yahoo, dom, element, event
* @optional container, menu
* @beta
*/


(function() {

// Shorthard for utilities

var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.lang,


    // Private member variables

    m_oUserAgent = navigator.userAgent.toLowerCase(),
    m_bOpera = (m_oUserAgent.indexOf('opera') > -1),
    m_bSafari = (m_oUserAgent.indexOf('safari') > -1),
    m_bGecko = (!m_bOpera && !m_bSafari && m_oUserAgent.indexOf('gecko') > -1),
    m_bIE7 = (!m_bOpera && m_oUserAgent.indexOf('msie 7') > -1),
    m_bIE = (!m_bOpera && m_oUserAgent.indexOf('msie') > -1),
    m_oButtons = {},
    m_oFocusedButton = null;



//  Constructor


/**
* The Button class creates a rich, graphical button.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;input&#62;</code>, <code>&#60;a&#62;</code> or 
* <code>&#60;span&#62;</code> element to be used to create the button.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>|<a href="
* http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#
* ID-33759296">HTMLElement</a>} p_oElement Object reference for the 
* <code>&#60;input&#62;</code>, <code>&#60;a&#62;</code> or 
* <code>&#60;span&#62;</code> element to be used to create the button.
* @param {Object} p_oElement Object literal specifying a set of configuration  
* attributes used to create the button.
* @param {Object} p_oAttributes Optional. Object literal specifying a set of 
* configuration attributes used to create the button.
* @namespace YAHOO.widget
* @class Button
* @constructor
* @extends YAHOO.util.Element
*/
YAHOO.widget.Button = function(p_oElement, p_oAttributes) {

    var fnSuperClass = YAHOO.widget.Button.superclass.constructor;

    if(
        arguments.length == 1 && 
        !Lang.isString(p_oElement) && 
        !p_oElement.nodeName
    ) {

        if(!p_oElement.id) {

            p_oElement.id = Dom.generateId();


        }



        fnSuperClass.call(
            this,
            (this._createButtonElement(p_oElement.type)),
            p_oElement
        );

    }
    else {

        var oConfig = {
        
            element: null,
            attributes: (p_oAttributes || {})
            
        },

        sTagName;


        if(Lang.isString(p_oElement)) {

            var oElement = Dom.get(p_oElement);

            if (oElement) {

                sTagName = oElement.tagName.toUpperCase();
            
                if(sTagName == this.TAG_NAME) {
            
                    oConfig.attributes.id = oElement.id;
            
                }
                else if(sTagName == "INPUT" && !oConfig.attributes.id) {
            
                    oConfig.attributes.id = Dom.generateId();
            
                
                }
            
            
            
            
                oConfig.attributes.srcelement = oElement;
            
                initConfig.call(this, oConfig);
            
            
                if(!oConfig.element) {
            
            
                    oConfig.element = 
                        this._createButtonElement(oConfig.attributes.type);
            
                }
            
                fnSuperClass.call(this, oConfig.element, oConfig.attributes);

            }

        }
        else {

            sTagName = p_oElement.tagName.toUpperCase();

            if(sTagName == this.TAG_NAME) {

                if(p_oElement.id) {

                    oConfig.attributes.id = p_oElement.id;
                
                }
                else {

                    oConfig.attributes.id = Dom.generateId();


                }


            }
            else if(sTagName == "INPUT" && !oConfig.attributes.id) {

                oConfig.attributes.id = Dom.generateId();

            
            }




            oConfig.attributes.srcelement = p_oElement;
    
            initConfig.call(this, oConfig);
    
    
            if(!oConfig.element) {

        
                oConfig.element = 
                    this._createButtonElement(oConfig.attributes.type);
        
            }
        
            fnSuperClass.call(this, oConfig.element, oConfig.attributes);
        
        }

    }

};



// Private methods


/**
* @method getFirstElement
* @description Returns an HTML element's first HTML element node.
* @private
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-58190037">HTMLElement</a>} p_oElement Object 
* reference specifying the element to be evaluated.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-58190037">HTMLElement</a>}
*/
function getFirstElement(p_oElement) {

    var oFirstChild = p_oElement.firstChild;

    if(oFirstChild) {

        if(oFirstChild.nodeType == 1) {

            return oFirstChild;

        }
        else {

            var oNextSibling = oFirstChild.nextSibling;

            if(oNextSibling && oNextSibling.nodeType == 1) {
            
                return oNextSibling;
            
            }

        }

    }

}


/**
* @method createInputElement
* @description Creates an <code>&#60;input&#62;</code> element of the 
* specified type.
* @private
* @param {String} p_sType String specifying the type of 
* <code>&#60;input&#62;</code> element to create.
* @param {String} p_sName String specifying the name of 
* <code>&#60;input&#62;</code> element to create.
* @param {String} p_sValue String specifying the value of 
* <code>&#60;input&#62;</code> element to create.
* @param {String} p_bChecked Boolean specifying if the  
* <code>&#60;input&#62;</code> element is to be checked.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>}
*/
function createInputElement(p_sType, p_sName, p_sValue, p_bChecked) {

    var oInput;

    if(m_bIE) {

        /*
            For IE it is necessary to create the element with the 
            "type," "name," "value," and "checked" properties set all at once.
        */
    
        var sInput = "<input type=\"" + p_sType + "\" name=\"" + p_sName + "\"";

        if(p_bChecked) {

            sInput += " checked";
        
        }
        
        sInput += ">";

        oInput = document.createElement(sInput);

    }
    else {
    
        oInput = document.createElement("input");
        oInput.name = p_sName;
        oInput.type = p_sType;

        if(p_bChecked) {

            oInput.checked = true;
        
        }

    }

    oInput.value = p_sValue;
    
    return oInput;

}


/**
* @method setAttributesFromSrcElement
* @description Gets the values for all the attributes of the source element 
* (either <code>&#60;input&#62;</code> or <code>&#60;a&#62;</code>) that map to
* Button configuration attributes and sets them into a collection that is
* passed to the Button constructor.
* @private
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>|<a href="http://www.w3.org/
* TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-
* 48250443">HTMLAnchorElement</a>} p_oElement Object reference to the HTML 
* element (either <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code>) 
* used to create the button.
* @param {Object} p_oAttributes Object reference for the collection of 
* configuration attributes used to create the button.
*/
function setAttributesFromSrcElement(p_oElement, p_oAttributes) {

    var me = this;

    /**
    * @method setAttributeFromDOMAttribute
    * @description Gets the value of the specified DOM attribute and sets it 
    * into the collection of configuration attributes used to configure 
    * the button.
    * @private
    * @param {String} p_sAttribute String representing the name of the 
    * attribute to retrieve from the DOM element.
    */
    function setAttributeFromDOMAttribute(p_sAttribute) {

        if( !(p_sAttribute in p_oAttributes) ) {

            /*
                Need to use "getAttributeNode" instead of "getAttribute" 
                because using "getAttribute," IE will return the innerText of 
                a <code>&#60;button&#62;</code> for the value attribute rather 
                than the value of the "value" attribute.
            */
    
            var oAttribute = p_oElement.getAttributeNode(p_sAttribute);
    

            if(oAttribute && ("value" in oAttribute)) {


                p_oAttributes[p_sAttribute] = oAttribute.value;

            }

        }
    
    }


    /**
    * @method setFormElementProperties
    * @description Gets the value of the attributes from the form element and 
    * sets them into the collection of configuration attributes used to 
    * configure the button.
    * @private
    */
    function setFormElementProperties() {

        setAttributeFromDOMAttribute("type");

        if( !("disabled" in p_oAttributes) ) {

            p_oAttributes.disabled = p_oElement.disabled;

        }

        setAttributeFromDOMAttribute("name");
        setAttributeFromDOMAttribute("value");
        setAttributeFromDOMAttribute("title");

    }


    var sSrcElementTagName = p_oElement.tagName.toUpperCase();


    if( !("label" in p_oAttributes) ) {

        // Set the "label" property
    
        var sText = sSrcElementTagName == "INPUT" ? 
                        p_oElement.value : p_oElement.innerHTML;
    
    
        if(sText && sText.length > 0) {
            
            p_oAttributes.label = sText;
            
        } 

    }


    setAttributeFromDOMAttribute("tabindex");
    setAttributeFromDOMAttribute("accesskey");


    switch(sSrcElementTagName) {
    
        case "A":
        
            p_oAttributes.type = "link";

            setAttributeFromDOMAttribute("href");
            setAttributeFromDOMAttribute("target");

        break;

        case "INPUT":

            setFormElementProperties();

            if( !("checked" in p_oAttributes) ) {
    
                p_oAttributes.checked = p_oElement.checked;
    
            }

        break;

        case "BUTTON":

            setFormElementProperties();

            var oRootNode = p_oElement.parentNode.parentNode;

            if(Dom.hasClass(oRootNode, "checked")) {
            
                p_oAttributes.checked = true;
            
            }

            if(Dom.hasClass(oRootNode, "disabled")) {

                p_oAttributes.disabled = true;
            
            }

            p_oElement.removeAttribute("name");
            p_oElement.removeAttribute("value");

            p_oElement.setAttribute("type", "button");

        break;
    
    }

}


/**
* @method initConfig
* @description Initializes the set of configuration attributes that are used to  
* instantiate the button.
* @private
* @param {Object} Object representing the button's set of 
* configuration attributes.
*/
function initConfig(p_oConfig) {

    var oAttributes = p_oConfig.attributes,
        oSrcElement = oAttributes.srcelement,
        sSrcElementTagName = oSrcElement.tagName.toUpperCase();


    if(sSrcElementTagName == this.TAG_NAME) {

        p_oConfig.element = oSrcElement;

        var oFirstChild = getFirstElement(p_oConfig.element);

        Dom.addClass(oFirstChild, "first-child");

        if(oFirstChild) {

            var oButton = getFirstElement(oFirstChild);


            if(oButton) {

                var sButtonTagName = oButton.tagName.toUpperCase();


                if(sButtonTagName == "A" || sButtonTagName == "BUTTON") {

                    setAttributesFromSrcElement.call(
                            this, 
                            oButton, 
                            oAttributes
                        );
                
                }
            
            }

        }
    
    }
    else if(sSrcElementTagName == "INPUT") {

        setAttributesFromSrcElement.call(this, oSrcElement, oAttributes);
    
    }

}


YAHOO.extend(YAHOO.widget.Button, YAHOO.util.Element, {


// Protected properties


/** 
* @property _button
* @description Object reference to the button's internal 
* <code>&#60;a&#62;</code> or <code>&#60;button&#62;</code> element.
* @default null
* @protected
* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-48250443">HTMLAnchorElement</a>|<a href="
* http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-
* 34812697">HTMLButtonElement</a>
*/
_button: null,


/** 
* @property _menu
* @description Object reference to the button's menu.
* @default null
* @protected
* @type <a href="YAHOO.widget.Menu.html">YAHOO.widget.Menu</a>
*/
_menu: null,


/** 
* @property _hiddenField
* @description Object reference to the <code>&#60;input&#62;</code> element 
* used when the button's parent form is submitted.
* @default null
* @protected
* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>
*/
_hiddenField: null,


/** 
* @property _onclickAttributeValue
* @description Object reference to the button's current value for the "onclick"
* configuration attribute.
* @default null
* @protected
* @type Object
*/
_onclickAttributeValue: null,


/** 
* @property _activationKeyPressed
* @description Boolean indicating if the key(s) that toggle the button's 
* "active" state have been pressed.
* @default false
* @protected
* @type Boolean
*/
_activationKeyPressed: false,


/** 
* @property _activationButtonPressed
* @description Boolean indicating if the mouse button that toggles the button's
* "active" state has been pressed.
* @default false
* @protected
* @type Boolean
*/
_activationButtonPressed: false,


/** 
* @property _hasKeyEventHandlers
* @description Boolean indicating if the button's "blur", "keydown" and 
* "keyup" event handlers are assigned
* @default false
* @protected
* @type Boolean
*/
_hasKeyEventHandlers: false,


/** 
* @property _hasMouseEventHandlers
* @description Boolean indicating if the button's "mouseout" and "mousedown" 
* and "mouseup" event handlers are assigned
* @default false
* @protected
* @type Boolean
*/
_hasMouseEventHandlers: false,



// Constants


/**
* @property TAG_NAME
* @description The name of the tag to be used for the button's root element. 
* @default "SPAN"
* @final
* @type String
*/
TAG_NAME: "SPAN",


/**
* @property CHECK_ACTIVATION_KEYS
* @description Array of numbers representing keys that (when pressed) toggle 
* the button's "checked" attribute.
* @default [32]
* @final
* @type Array
*/
CHECK_ACTIVATION_KEYS: [32],


/**
* @property ACTIVATION_KEYS
* @description Array of numbers representing keys that (when presed) toggle 
* the button's "active" state.
* @default [13, 32]
* @final
* @type Array
*/
ACTIVATION_KEYS: [13, 32],


/**
* @property OPTION_AREA_WIDTH
* @description Width (in pixels) of the area of a split button that when 
* pressed will display a menu.
* @default 20
* @final
* @type Number
*/
OPTION_AREA_WIDTH: 20,


/**
* @property CSS_CLASS_NAME
* @description String representing the CSS class(es) to be applied to the 
* button's root element.
* @default "yuibutton"
* @final
* @type String
*/
CSS_CLASS_NAME: "yuibutton",


/**
* @property RADIO_DEFAULT_TITLE
* @description String representing the default title applied to buttons of 
* type "radio." 
* @default "Unchecked.  Click to check."
* @final
* @type String
*/
RADIO_DEFAULT_TITLE: "Unchecked.  Click to check.",


/**
* @property RADIO_CHECKED_TITLE
* @description String representing the title applied to buttons of type "radio" 
* when checked.
* @default "Checked.  Click to uncheck."
* @final
* @type String
*/
RADIO_CHECKED_TITLE: "Checked.  Click to uncheck.",


/**
* @property CHECKBOX_DEFAULT_TITLE
* @description String representing the default title applied to buttons of 
* type "checkbox." 
* @default "Unchecked.  Click to check."
* @final
* @type String
*/
CHECKBOX_DEFAULT_TITLE: "Unchecked.  Click to check.",


/**
* @property CHECKBOX_CHECKED_TITLE
* @description String representing the title applied to buttons of type 
* "checkbox" when checked.
* @default "Checked.  Click to uncheck."
* @final
* @type String
*/
CHECKBOX_CHECKED_TITLE: "Checked.  Click to uncheck.",


/**
* @property MENUBUTTON_DEFAULT_TITLE
* @description String representing the default title applied to buttons of 
* type "menubutton." 
* @default "Menu collapsed.  Click to expand."
* @final
* @type String
*/
MENUBUTTON_DEFAULT_TITLE: "Menu collapsed.  Click to expand.",


/**
* @property MENUBUTTON_MENU_VISIBLE_TITLE
* @description String representing the title applied to buttons of type 
* "menubutton" when the button's menu is visible. 
* @default "Menu expanded.  Click or press Esc to collapse."
* @final
* @type String
*/
MENUBUTTON_MENU_VISIBLE_TITLE: 
    "Menu expanded.  Click or press Esc to collapse.",


/**
* @property SPLITBUTTON_DEFAULT_TITLE
* @description  String representing the default title applied to buttons of 
* type "splitebutton." 
* @default "Menu collapsed.  Click inside option region or press 
* Ctrl + Shift + M to show the menu."
* @final
* @type String
*/
SPLITBUTTON_DEFAULT_TITLE: 
    "Menu collapsed.  Click inside option region or press Ctrl + Shift + M to show the menu.",


/**
* @property SPLITBUTTON_OPTION_VISIBLE_TITLE
* @description String representing the title applied to buttons of type 
* "splitbutton" when the button's menu is visible. 
* @default "Menu expanded.  Press Esc or Ctrl + Shift + M to hide the menu."
* @final
* @type String
*/
SPLITBUTTON_OPTION_VISIBLE_TITLE: 
    "Menu expanded.  Press Esc or Ctrl + Shift + M to hide the menu.",


/**
* @property SUBMIT_TITLE
* @description String representing the title applied to buttons of 
* type "submit." 
* @default "Click to submit form."
* @final
* @type String
*/
SUBMIT_TITLE: "Click to submit form.",



// Protected attribute setter methods


/**
* @method _setType
* @description Sets the value of the button's "type" attribute.
* @protected
* @param {String} p_sType String indicating the value for the button's 
* "type" attribute.
*/
_setType: function(p_sType) {

    if(p_sType == "splitbutton") {

        this.on("option", this._onOption);

    }

},


/**
* @method _setLabel
* @description Sets the value of the button's "label" attribute.
* @protected
* @param {String} p_sLabel String indicating the value for the button's 
* "label" attribute.
*/
_setLabel: function(p_sLabel) {

    this._button.innerHTML = p_sLabel;                

},


/**
* @method _setTabIndex
* @description Sets the value of the button's "tabindex" attribute.
* @protected
* @param {Number} p_nTabIndex Number indicating the value for the button's 
* "tabindex" attribute.
*/
_setTabIndex: function(p_nTabIndex) {

    this._button.tabIndex = p_nTabIndex;

},


/**
* @method _setTitle
* @description Sets the value of the button's "title" attribute.
* @protected
* @param {String} p_nTabIndex Number indicating the value for the button's 
* "title" attribute.
*/
_setTitle: function(p_sTitle) {

    if(this.get("type") != "link") {

        var sTitle = p_sTitle;

        if(!sTitle) {


            var sType = this.get("type");

            switch(sType) {

                case "radio":

                    sTitle = this.RADIO_DEFAULT_TITLE;

                break;

                case "checkbox":

                    sTitle = this.CHECKBOX_DEFAULT_TITLE;

                break;
                
                case "menubutton":

                    sTitle = this.MENUBUTTON_DEFAULT_TITLE;

                break;

                case "splitbutton":

                    sTitle = this.SPLITBUTTON_DEFAULT_TITLE;

                break;

                case "submit":

                    sTitle = this.SUBMIT_TITLE;

                break;

            }

        }

        this._button.title = sTitle;

    }

},


/**
* @method _setDisabled
* @description Sets the value of the button's "disabled" attribute.
* @protected
* @param {Boolean} p_bDisabled Boolean indicating the value for the button's 
* "disabled" attribute.
*/
_setDisabled: function(p_bDisabled) {

    if(this.get("type") != "link") {

        if(p_bDisabled) {

            if(this.hasFocus()) {
            
                this.blur();
            
            }

            this._button.setAttribute("disabled", "disabled");

            this.addClass("disabled");

        }
        else {

            this._button.removeAttribute("disabled");

            this.removeClass("disabled");
        
        }

    }

},


/**
* @method _setAccessKey
* @description Sets the value of the button's "accesskey" attribute.
* @protected
* @param {String} p_sAccessKey String indicating the value for the button's 
* "accesskey" attribute.
*/
_setAccessKey: function(p_sAccessKey) {

    this._button.accessKey = p_sAccessKey;

},


/**
* @method _setHref
* @description Sets the value of the button's "href" attribute.
* @protected
* @param {String} p_sHref String indicating the value for the button's 
* "href" attribute.
*/
_setHref: function(p_sHref) {

    if(this.get("type") == "link") {

        this._button.href = p_sHref;
    
    }

},


/**
* @method _setTarget
* @description Sets the value of the button's "target" attribute.
* @protected
* @param {String} p_sTarget String indicating the value for the button's 
* "target" attribute.
*/
_setTarget: function(p_sTarget) {

    if(this.get("type") == "link") {

        this._button.setAttribute("target", p_sTarget);
    
    }

},


/**
* @method _setChecked
* @description Sets the value of the button's "target" attribute.
* @protected
* @param {Boolean} p_bChecked Boolean indicating the value for the button's 
* "checked" attribute.
*/
_setChecked: function(p_bChecked) {

    var sType = this.get("type"),
        sTitle;

    if(sType == "checkbox" || sType == "radio") {

        if(p_bChecked) {

            this.addClass("checked");
            
            sTitle = (sType == "radio") ? 
                        this.RADIO_CHECKED_TITLE : 
                        this.CHECKBOX_CHECKED_TITLE;
        
        }
        else {

            this.removeClass("checked");

            sTitle = (sType == "radio") ? 
                        this.RADIO_DEFAULT_TITLE : 
                        this.CHECKBOX_DEFAULT_TITLE;
        
        }

        this.set("title", sTitle);

    }

},


/**
* @method _setMenu
* @description Sets the value of the button's "menu" attribute.
* @protected
* @param {Object} p_oMenu Object indicating the value for the button's 
* "menu" attribute.
*/
_setMenu: function(p_oMenu) {

    var Menu = YAHOO.widget.Menu,
        oMenu,
        me = this;

    if(!Menu) {


        return false;
    
    }


    function initMenu() {
    
        if(oMenu) {
    
            oMenu.showEvent.subscribe(this._onMenuShow, this, true);
            oMenu.hideEvent.subscribe(this._onMenuHide, this, true);
            oMenu.keyDownEvent.subscribe(this._onMenuKeyDown, this, true);
            oMenu.renderEvent.subscribe(this._onMenuRender, this, true);
            oMenu.clickEvent.subscribe(this._onMenuClick, this, true);
            oMenu.itemAddedEvent.subscribe(this._onMenuItemAdded, this, true);

            var oSrcElement = oMenu.srcElement;
    
            if(oSrcElement && oSrcElement.tagName.toUpperCase() == "SELECT") {
    
                oSrcElement.style.display = "none";
                oSrcElement.parentNode.removeChild(oSrcElement);
    
            }
    
            this._menu = oMenu;
    
        }
        else {
    
            this._menu.destroy();
            this._menu = null;
    
        }
    
    }


    if(p_oMenu instanceof Menu) {

        oMenu = p_oMenu;
        
        var aItems = oMenu.getItems(),
            nItems = aItems.length,
            oItem;
    
        if(nItems > 0) {
    
            var i = nItems - 1;
    
            do {
    
                oItem = aItems[i];
    
                if(oItem) {
    
                    oItem.cfg.subscribeToConfigEvent(
                                "selected", 
                                this._onMenuItemSelected, 
                                oItem, 
                                this
                            );
    
                }
            
            }
            while(i--);
    
        }

        initMenu.call(this);

    }
    else if(Lang.isArray(p_oMenu)) {

        this.on("appendTo", function() {

            oMenu = new Menu(
                            Dom.generateId(), 
                            { lazyload: true, itemdata: p_oMenu }
                        );
    
            initMenu.call(me);
        
        });
       
    }
    else if(Lang.isString(p_oMenu)) {

        Event.onContentReady(p_oMenu, function() {

            oMenu = new Menu(this, { lazyload: true });

            initMenu.call(me);
        
        });
    
    }
    else if(p_oMenu && p_oMenu.nodeName) {

        oMenu = new Menu(p_oMenu, { lazyload: true });
    
        initMenu.call(this);
    
    }

},


/**
* @method _setOnClick
* @description Sets the value of the button's "onclick" attribute.
* @protected
* @param {Object} p_oObject Object indicating the value for the button's 
* "onclick" attribute.
*/
_setOnClick: function(p_oObject) {

    /*
        Remove any existing listeners if a "click" event handler has already 
        been specified.
    */

    if(
        this._onclickAttributeValue && 
        (this._onclickAttributeValue != p_oObject)
    ) {

        this.removeListener("click", this._onclickAttributeValue.fn);

        this._onclickAttributeValue = null;

    }


    if(
        !this._onclickAttributeValue && 
        Lang.isObject(p_oObject) && 
        Lang.isFunction(p_oObject.fn)
    ) {

        this.on("click", p_oObject.fn, p_oObject.obj, p_oObject.scope);

        this._onclickAttributeValue = p_oObject;

    }

},



// Protected methods


/**
* @method _createButtonElement
* @description Creates the button's element.
* @protected
* @param {String} p_sType String indicating the type of element to create.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-58190037">HTMLElement</a>}
*/
_createButtonElement: function(p_sType) {

    var sTagName = this.TAG_NAME,
        oElement = document.createElement(sTagName);

    oElement.innerHTML =  
    
        "<" + sTagName + " class=\"first-child\">" + 
        (p_sType == "link" ? "<a></a>" : "<button type=\"button\"></button>") + 
        "</" + sTagName + ">";

    return oElement;

},


/**
* @method _isActivationKey
* @description Determines if the specified keycode is one that toggles the 
* button's "active" state.
* @protected
* @param {Number} p_nKeyCode Number representing the keycode to be evaluated.
* @return {Boolean}
*/
_isActivationKey: function(p_nKeyCode) {

    var sType = this.get("type"),
        aKeyCodes = (sType == "checkbox" || sType == "radio") ? 
            this.CHECK_ACTIVATION_KEYS : this.ACTIVATION_KEYS,

        nKeyCodes = aKeyCodes.length;

    if(nKeyCodes > 0) {

        var i = nKeyCodes - 1;

        do {

            if(p_nKeyCode == aKeyCodes[i]) {

                return true;

            }

        }
        while(i--);
    
    }

},


/**
* @method _isSplitButtonOptionKey
* @description Determines if the specified keycode is one that toggles the 
* display of the split button's menu.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @return {Boolean}
*/
_isSplitButtonOptionKey: function(p_oEvent) {

    return (
        p_oEvent.ctrlKey && 
        p_oEvent.shiftKey && 
        Event.getCharCode(p_oEvent) == 77
    );

},


/**
* @method _addListenersToForm
* @description Adds event handlers to the button's form.
* @protected
*/
_addListenersToForm: function() {

    var oForm = this.getForm();

    if(oForm) {

        Event.on(oForm, "reset", this._onFormReset, null, this);
        Event.on(oForm, "submit", this._onFormSubmit, null, this);

        var oSrcElement = this.get("srcelement");


        if (
            (m_bIE || m_bGecko) && 
            (
                this.get("type") == "submit" || 
                (oSrcElement && oSrcElement.type == "submit")
            )
        ) {
        
            var aListeners = Event.getListeners(oForm, "keydown"),
                bHasKeyDownListener = false;
    
            if(aListeners) {
    
                var nListeners = aListeners.length;
    
                if(nListeners > 0) {
    
                    var i = nListeners - 1;
                    
                    do {
       
                        if(
                            aListeners[i].fn == 
                            YAHOO.widget.Button.onFormKeyDown
                        ) {
        
                            bHasKeyDownListener = true;
                            break;
                        
                        }
        
                    }
                    while(i--);
                
                }
            
            }
    
    
            if(!bHasKeyDownListener) {
    
                Event.on(
                        oForm, 
                        "keydown", 
                        YAHOO.widget.Button.onFormKeyDown, 
                        null, 
                        this
                    );
    
            }

        }
    
    }

},


_originalMaxHeight: -1,


/**
* @method _showMenu
* @description Shows the button's menu.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event) that triggered the display of
* the menu.
*/
_showMenu: function(p_oEvent) {

    var oMenu = this._menu;

    if(oMenu) {

        YAHOO.widget.MenuManager.hideVisible();

        oMenu.cfg.applyConfig({
                context:[this.get("id"), "tl", "bl"], 
                clicktohide: false,
                constraintoviewport: false,
                visible: true
            });
            
        oMenu.cfg.fireQueue();

        /*
            Stop the propagation of the event so that the MenuManager 
            doesn't blur the menu after it gets focus.
        */

        if(p_oEvent.type == "mousedown") {

            Event.stopPropagation(p_oEvent);

        }

        this._menu.focus(); 


        var nViewportHeight = Dom.getViewportHeight(),
            nMenuHeight = oMenu.element.offsetHeight;


        if((oMenu.cfg.getProperty("y") + nMenuHeight) > nViewportHeight) {


            oMenu.align("bl", "tl");

            var nY = oMenu.cfg.getProperty("y"),

                nScrollTop = (
                                document.documentElement.scrollTop || 
                                document.body.scrollTop
                            );
            

            if(nScrollTop >= nY) {

                if(this._originalMaxHeight == -1) {

                    this._originalMaxHeight = 
                            oMenu.cfg.getProperty("maxheight");

                }

                oMenu.cfg.setProperty(
                            "maxheight", 
                            (nMenuHeight - ((nScrollTop - nY) + 20))
                        );

                oMenu.align("bl", "tl");

            }

        }

        oMenu.cfg.setProperty("constraintoviewport", true);

    }            

},


/**
* @method _hideMenu
* @description Hides the button's menu.
* @protected
*/
_hideMenu: function() {

    var oMenu = this._menu;

    if(oMenu && oMenu.cfg.getProperty("visible")) {

        oMenu.hide();

    }

},




// Protected event handlers


/**
* @method _onMouseOver
* @description "mouseover" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onMouseOver: function(p_oEvent) {

    if(!this._hasMouseEventHandlers) {

        this.on("mouseout", this._onMouseOut);
        this.on("mousedown", this._onMouseDown);
        this.on("mouseup", this._onMouseUp);

        this._hasMouseEventHandlers = true;

    }

    this.addClass("hover");

    if(this._activationButtonPressed) {

        this.addClass("active");

    }


    if(this._bOptionPressed) {

        this.addClass("activeoption");
    
    }

},


/**
* @method _onMouseOut
* @description "mouseout" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onMouseOut: function(p_oEvent) {

    this.removeClass("hover");

    if(this.get("type") != "menubutton") {

        this.removeClass("active");

    }

    if(this._activationButtonPressed || this._bOptionPressed) {

        Event.on(document, "mouseup", this._onDocumentMouseUp, null, this);

    }
    
},


/**
* @method _onDocumentMouseUp
* @description "mouseup" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onDocumentMouseUp: function(p_oEvent) {

    this._activationButtonPressed = false;
    this._bOptionPressed = false;

    var sType = this.get("type");

    if(sType == "menubutton" || sType == "splitbutton") {

        this.removeClass((sType == "menubutton" ? "active" : "activeoption"));

        this._hideMenu();

    }

    Event.removeListener(document, "mouseup", this._onDocumentMouseUp);

},


/**
* @method _onMouseDown
* @description "mousedown" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onMouseDown: function(p_oEvent) {

    if((p_oEvent.which || p_oEvent.button) == 1) {

        if(!this.hasFocus()) {
        
            this.focus();
        
        }


        var sType = this.get("type");


        if(sType == "splitbutton") {
        
            var oElement = this.get("element"),
                nX = Event.getPageX(p_oEvent) - Dom.getX(oElement);

            if((oElement.offsetWidth - this.OPTION_AREA_WIDTH) < nX) {
                
                this.fireEvent("option", p_oEvent);

            }
            else {

                this.addClass("active");

                this._activationButtonPressed = true;

            }

        }
        else if(sType == "menubutton") {

            if(this.hasClass("active")) {

                this._hideMenu();

                this._activationButtonPressed = false;

            }
            else {

                this._showMenu(p_oEvent);

                this._activationButtonPressed = true;
            
            }

        }
        else {

            this.addClass("active");

            this._activationButtonPressed = true;
        
        }



        if(sType == "splitbutton" || sType == "menubutton") {

            var me = this;

            
            function onMouseUp() {
            
                me._hideMenu();
                me.removeListener("mouseup", onMouseUp);
            
            }


            this._hideMenuTimerId = window.setTimeout(function() {
            
                me.on("mouseup", onMouseUp);
            
            }, 250);

        }

    }
    
},


/**
* @method _onMouseUp
* @description "mouseup" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onMouseUp: function(p_oEvent) {

    if(this._hideMenuTimerId) {

        window.clearTimeout(this._hideMenuTimerId);

    }

    var sType = this.get("type");

    if(sType == "checkbox" || sType == "radio") {

        this.set("checked", !(this.get("checked")));
    
    }


    this._activationButtonPressed = false;
    

    if(this.get("type") != "menubutton") {

        this.removeClass("active");
    
    }
    
},


/**
* @method _onFocus
* @description "focus" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onFocus: function(p_oEvent) {

    this.addClass("focus");

    if(this._activationKeyPressed) {

        this.addClass("active");
   
    }

    m_oFocusedButton = this;


    if(!this._hasKeyEventHandlers) {

        var oElement = this._button;

        Event.on(oElement, "blur", this._onBlur, null, this);
        Event.on(oElement, "keydown", this._onKeyDown, null, this);
        Event.on(oElement, "keyup", this._onKeyUp, null, this);

        this._hasKeyEventHandlers = true;

    }


    this.fireEvent("focus", p_oEvent);

},


/**
* @method _onBlur
* @description "blur" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onBlur: function(p_oEvent) {

    this.removeClass("focus");

    if(this.get("type") != "menubutton") {

        this.removeClass("active");

    }    

    if(this._activationKeyPressed) {

        Event.on(document, "keyup", this._onDocumentKeyUp, null, this);

    }


    m_oFocusedButton = null;

    this.fireEvent("blur", p_oEvent);
   
},


/**
* @method _onDocumentKeyUp
* @description "keyup" event handler for the document.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onDocumentKeyUp: function(p_oEvent) {

    if(this._isActivationKey(Event.getCharCode(p_oEvent))) {

        this._activationKeyPressed = false;
        
        Event.removeListener(document, "keyup", this._onDocumentKeyUp);
    
    }

},


/**
* @method _onKeyDown
* @description "keydown" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onKeyDown: function(p_oEvent) {

    if(
        this.get("type") == "splitbutton" && 
        this._isSplitButtonOptionKey(p_oEvent)
    ) {

        this.fireEvent("option", p_oEvent);

    }
    else if(this._isActivationKey(Event.getCharCode(p_oEvent))) {

        if(this.get("type") == "menubutton") {

            this._showMenu(p_oEvent);

        }
        else {

            this._activationKeyPressed = true;
            
            this.addClass("active");
        
        }
    
    }


    var oMenu = this._menu;

    if(
        oMenu && oMenu.cfg.getProperty("visible") && 
        Event.getCharCode(p_oEvent) == 27
    ) {
    
        oMenu.hide();
        this.focus();
    
    }

},


/**
* @method _onKeyUp
* @description "keyup" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onKeyUp: function(p_oEvent) {

    if(this._isActivationKey(Event.getCharCode(p_oEvent))) {

        var sType = this.get("type");

        if(sType == "checkbox" || sType == "radio") {

            this.set("checked", !(this.get("checked")));
        
        }

        this._activationKeyPressed = false;

        if(this.get("type") != "menubutton") {

            this.removeClass("active");

        }

    }

},


/**
* @method _onClick
* @description "click" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onClick: function(p_oEvent) {

    var sType = this.get("type"),
        sTitle;

    switch(sType) {

        case "radio":
        case "checkbox":

            if(this.get("checked")) {
                
                sTitle = (sType == "radio") ? 
                            this.RADIO_CHECKED_TITLE : 
                            this.CHECKBOX_CHECKED_TITLE;
            
            }
            else {
            
                sTitle = (sType == "radio") ? 
                            this.RADIO_DEFAULT_TITLE : 
                            this.CHECKBOX_DEFAULT_TITLE;
            
            }
            
            this.set("title", sTitle);

        break;

        case "submit":

            this.submitForm();
        
        break;

        case "reset":

            var oForm = this.getForm();

            if(oForm) {

                oForm.reset();
            
            }

        break;

        case "menubutton":

            sTitle = this._menu.cfg.getProperty("visible") ? 
                            this.MENUBUTTON_MENU_VISIBLE_TITLE : 
                            this.MENUBUTTON_DEFAULT_TITLE;

            this.set("title", sTitle);

        break;

        case "splitbutton":

            var oElement = this.get("element"),
                nX = Event.getPageX(p_oEvent) - Dom.getX(oElement);

            if((oElement.offsetWidth - this.OPTION_AREA_WIDTH) < nX) {

                return false;
            
            }
            else {

                this._hideMenu();
    
                var oSrcElement = this.get("srcelement");
    
                if(oSrcElement && oSrcElement.type == "submit") {
    
                    this.submitForm();
                
                }
            
            }

            sTitle = this._menu.cfg.getProperty("visible") ? 
                            this.SPLITBUTTON_OPTION_VISIBLE_TITLE : 
                            this.SPLITBUTTON_DEFAULT_TITLE;

            this.set("title", sTitle);

        break;

    }

},


/**
* @method _onAppendTo
* @description "appendTo" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onAppendTo: function(p_oEvent) {

    /*
        It is necessary to call "getForm" using "setTimeout" to make sure that 
        the button's "form" property returns a node reference.  Sometimes, if
        you try to get the reference immediately after appending the field, it
        is null.
    */

    var me = this;

    window.setTimeout(function() {

        me._addListenersToForm();

    }, 0);

},


/**
* @method _onFormSubmit
* @description "submit" event handler for the button's form.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onFormSubmit: function(p_oEvent) {

    var sType = this.get("type"),
        oMenuItem = this.get("selectedMenuItem"),
        oForm = this.getForm();
    
    
    if(sType == "radio" || sType == "checkbox") {
    
    
        this.createHiddenField();
    
    }
    else if(oMenuItem) {
    
        var oSrcElement = this._menu.srcElement;

        if(oSrcElement && oSrcElement.tagName.toUpperCase() == "SELECT") {

            oForm.appendChild(oSrcElement);
            oSrcElement.selectedIndex = oMenuItem.index;

        }
        else {
    
            var oValue = (oMenuItem.value === null || oMenuItem.value === "") ? 
                                oMenuItem.cfg.getProperty("text") : 
                                oMenuItem.value;


            if(oValue) {
    
                var oField = createInputElement(
                                    "hidden", 
                                    (this.get("name") + "_options"),
                                    oValue
                                );
    
                oForm.appendChild(oField);
    
            }
    
        }                
    
    }

},


/**
* @method _onFormReset
* @description "reset" event handler for the button's form.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onFormReset: function(p_oEvent) {

    var sType = this.get("type");

    if(sType == "checkbox" || sType == "radio") {

        this.resetValue("checked");

    }

    if(this._menu) {

        this.resetValue("selectedMenuItem");

    }

},


/**
* @method _onDocumentMouseDown
* @description "mousedown" event handler for the document.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onDocumentMouseDown: function(p_oEvent) {

    var oTarget = Event.getTarget(p_oEvent),
        oButtonElement = this.get("element"),
        oMenuElement = this._menu.element;

    if(
        oTarget != oButtonElement && 
        !Dom.isAncestor(oButtonElement, oTarget) && 
        oTarget != oMenuElement && 
        !Dom.isAncestor(oMenuElement, oTarget)
    ) {

        this._hideMenu();

        Event.removeListener(
                document, 
                "mousedown", 
                this._onDocumentMouseDown
            );    
    
    }

},


/**
* @method _onOption
* @description "option" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onOption: function(p_oEvent) {

    if(this.hasClass("activeoption")) {

        this._hideMenu();

        this._bOptionPressed = false;

    }
    else {

        this._showMenu(p_oEvent);    

        this._bOptionPressed = true;

    }

},


/**
* @method _onMenuShow
* @description "show" event handler for the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
*/
_onMenuShow: function(p_sType, p_aArgs) {

    Event.on(document, "mousedown", this._onDocumentMouseDown, null, this);

    var sTitle,
        sClass;
    
    if(this.get("type") == "splitbutton") {

        sTitle = this.SPLITBUTTON_OPTION_VISIBLE_TITLE;
        sClass = "activeoption";
    
    }
    else {

        sTitle = this.MENUBUTTON_MENU_VISIBLE_TITLE;        
        sClass = "active";

    }

    this.addClass(sClass);
    this.set("title", sTitle);

},


/**
* @method _onMenuHide
* @description "hide" event handler for the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
*/
_onMenuHide: function(p_sType, p_aArgs) {
    
    if(this._originalMaxHeight != -1) {
    
        this._menu.cfg.setProperty("maxheight", this._originalMaxHeight);

    }


    var sTitle,
        sClass;
    
    if(this.get("type") == "splitbutton") {

        sTitle = this.SPLITBUTTON_DEFAULT_TITLE;
        sClass = "activeoption";

    }
    else {

        sTitle = this.MENUBUTTON_DEFAULT_TITLE;        
        sClass = "active";
    }


    this.removeClass(sClass);
    this.set("title", sTitle);


    if(this.get("type") == "splitbutton") {

        this._bOptionPressed = false;
    
    }

},


/**
* @method _onMenuKeyDown
* @description "keydown" event handler for the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
*/
_onMenuKeyDown: function(p_sType, p_aArgs) {

    var oEvent = p_aArgs[0];

    if(Event.getCharCode(oEvent) == 27) {

        this.focus();

        if(this.get("type") == "splitbutton") {
        
            this._bOptionPressed = false;
        
        }

    }

},


/**
* @method _onMenuRender
* @description "render" event handler for the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
*/
_onMenuRender: function(p_sType, p_aArgs) {

    this.get("element").parentNode.appendChild(this._menu.element);

},


/**
* @method _onMenuItemSelected
* @description "selectedchange" event handler for each item in the 
* button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {<a href="YAHOO.widget.MenuItem.html">YAHOO.widget.MenuItem</a>} 
* p_oItem Object representing the menu item that subscribed to the event.
*/
_onMenuItemSelected: function(p_sType, p_aArgs, p_oItem) {
    
    this.set("selectedMenuItem", p_oItem);

},


/**
* @method _onMenuItemAdded
* @description "itemadded" event handler for the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {<a href="YAHOO.widget.MenuItem.html">YAHOO.widget.MenuItem</a>} 
* p_oItem Object representing the menu item that subscribed to the event.
*/
_onMenuItemAdded: function(p_sType, p_aArgs, p_oItem) {
    
    var oItem = p_aArgs[0];

    oItem.cfg.subscribeToConfigEvent(
                "selected", 
                this._onMenuItemSelected, 
                oItem, 
                this
            );

},


/**
* @method _onMenuClick
* @description "click" event handler for the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
*/
_onMenuClick: function(p_sType, p_aArgs) {

    var oItem = p_aArgs[1];

    if(oItem) {

        var oSrcElement = this.get("srcelement");
    
        if(oSrcElement && oSrcElement.type == "submit") {
    
            this.submitForm();
    
        }
    
        this._hideMenu();
    
    }

},



// Public methods


/**
* @method createHiddenField
* @description Creates the button's hidden form field and appends it to its
* parent form.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>}
*/
createHiddenField: function () {

    if (!this.get("disabled")) {

        var sType = this.get("type"),
        
            bCheckable = (sType == "checkbox" || sType == "radio"),
        
            oField = createInputElement(
            
                        /*
                            Use "submit" type for IE so that the input 
                            element will be able to be clicked via a call to 
                            the "click" method by the "submitForm" method.
                        */
            
                        (bCheckable ? sType : (m_bIE ? "submit" : "hidden")),
                        this.get("name"),
                        this.get("value"),
                        this.get("checked")
                    ),
                    
            oForm = this.getForm();
    

        if (oField) {

            if (bCheckable || oField.type == "submit") {

                oField.style.display = "none";

            }


            if (oForm) {
        
                var oHiddenField = this._hiddenField;
        
                if (oHiddenField && Dom.inDocument(oHiddenField)) {
        
                    oForm.replaceChild(oField, oHiddenField);
        
                }
                else {
        
                    oForm.appendChild(oField);
                    
                }
            
            }
    
            this._hiddenField = oField;
    
            return oField;

        }

    }

},


/**
* @method submitForm
* @description Submits the form to which the button belongs.
* @protected
*/
submitForm: function(p_oMenuItem) {

    var oForm = this.getForm();

    if (oForm) {

        var oInput = this.createHiddenField();

        if (m_bIE) {

            /*
                Clicking the button via a call to the "click" method will 
                cause IE to both fire the form's "submit" event as well as 
                submit the form.  Originally tried just firing the "submit"
                event via "fireEvent," but then the event could not 
                be cancelled.
            */            

            oInput.click();

        }
        else {  // Gecko, Opera, and Safari

            var oEvent = document.createEvent("HTMLEvents");
            oEvent.initEvent("submit", true, true);

            /*
                In Safari, dispatching a "submit" event to a form WILL cause  
                the form's "submit" event to fire, but WILL NOT submit the   
                form.  Therefore, we need to call the "submit" method as well.
            */

            var bSubmitForm = oForm.dispatchEvent(oEvent);
          
            if(m_bSafari && bSubmitForm) {

                oForm.submit();
            
            }

        }
    
    }

},


/**
* @method init
* @description The Button class's initialization method.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;input&#62;</code>, <code>&#60;a&#62;</code> or 
* <code>&#60;span&#62;</code> element to be used to create the button.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>|<a href="
* http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#
* ID-33759296">HTMLElement</a>} p_oElement Object reference for the 
* <code>&#60;input&#62;</code>, <code>&#60;a&#62;</code> or 
* <code>&#60;span&#62;</code> element to be used to create the button.
* @param {Object} p_oElement Object literal specifying a set of configuration 
* attributes used to create the button.
* @param {Object} p_oAttributes Optional. Object literal specifying a set of  
* configuration attributes used to create the button.
*/
init: function(p_oElement, p_oAttributes) {

    var sTagName = p_oAttributes.type == "link" ? "A" : "BUTTON",
        oSrcElement = p_oAttributes.srcelement;


    this._button = p_oElement.getElementsByTagName(sTagName)[0];


    YAHOO.widget.Button.superclass.init.call(
            this, p_oElement, 
            p_oAttributes
        );


    m_oButtons[this.get("id")] = this;


    this.addClass(this.CSS_CLASS_NAME);
    
    if(m_bIE && !m_bIE7) {

        this.addClass("ie6");

    }
    
    this.addClass(this.get("type"));

    Event.on(this._button, "focus", this._onFocus, null, this);
    this.on("mouseover", this._onMouseOver);
    this.on("click", this._onClick);
    this.on("appendTo", this._onAppendTo);
    
    var oContainer = this.get("container"),
        oElement = this.get("element");


    if(oContainer) {

        if(Lang.isString(oContainer)) {

            var me = this;

            Event.onContentReady(oContainer, function() {

                me.appendTo(this);            
            
            });

        }
        else {

            this.appendTo(oContainer);

        }

    }
    else if(
        !Dom.inDocument(oElement) && 
        oSrcElement && 
        oSrcElement.tagName.toUpperCase() == "INPUT"
    ) {

        var oParentNode = oSrcElement.parentNode;

        if(oParentNode) {

            this.fireEvent("beforeAppendTo", {
                type: "beforeAppendTo",
                target: oParentNode
            });
    
            oParentNode.replaceChild(oElement, oSrcElement);
    
            this.fireEvent("appendTo", {
                type: "appendTo",
                target: oParentNode
            });
        
        }

    }
    else if(
        Dom.inDocument(oElement) && 
        oSrcElement.tagName.toUpperCase() == "SPAN"
    ) {

        this._addListenersToForm();

    }


},


/**
* @method initAttributes
* @description Initializes all of the configuration attributes used to create 
* the button.
* @param {Object} p_oAttributes Object literal specifying a set of 
* configuration attributes used to create the button.
*/
initAttributes: function(p_oAttributes) {

    var oAttributes = p_oAttributes || {};

    YAHOO.widget.Button.superclass.initAttributes.call(this, oAttributes);


    /**
    * @config type
    * @description String specifying the button's type.  Possible values are: 
    * "button," "link," "submit," "reset," "checkbox," "radio," "menubutton," 
    * and "splitbutton."
    * @default "button"
    * @type String
    */
    this.setAttributeConfig("type", {

        value: (oAttributes.type || "button"),
        validator: Lang.isString,
        writeOnce: true,
        method: this._setType

    });


    /**
    * @config label
    * @description String specifying the button's text label or innerHTML.
    * @default null
    * @type String
    */
    this.setAttributeConfig("label", {

        value: oAttributes.label,
        validator: Lang.isString,
        method: this._setLabel

    });


    /**
    * @config value
    * @description Object specifying the value for the button.
    * @default null
    * @type Object
    */
    this.setAttributeConfig("value", {

        value: oAttributes.value

    });


    /**
    * @config name
    * @description String specifying the name for the button.
    * @default null
    * @type String
    */
    this.setAttributeConfig("name", {

        value: oAttributes.name,
        validator: Lang.isString

    });


    /**
    * @config tabindex
    * @description Number specifying the tabindex for the button.
    * @default null
    * @type Number
    */
    this.setAttributeConfig("tabindex", {

        value: oAttributes.tabindex,
        validator: Lang.isNumber,
        method: this._setTabIndex

    });


    /**
    * @config title
    * @description String specifying the title for the button.
    * @default null
    * @type String
    */
    this.configureAttribute("title", {

        value: oAttributes.title,
        validator: Lang.isString,
        method: this._setTitle

    });


    /**
    * @config disabled
    * @description Boolean indicating if the button should be disabled.  
    * (Disabled buttons are dimmed and will not respond to user input 
    * or fire events.  Does not apply to button's of type "link.")
    * @default false
    * @type Boolean
    */
    this.setAttributeConfig("disabled", {

        value: (oAttributes.disabled || false),
        validator: Lang.isBoolean,
        method: this._setDisabled

    });


    /**
    * @config href
    * @description String specifying the href for the button.  Applies only to 
    * buttons of type "link."
    * @type String
    */
    this.setAttributeConfig("href", {

        value: oAttributes.href,
        validator: Lang.isString,
        method: this._setHref

    });


    /**
    * @config target
    * @description String specifying the target for the button.  Applies only  
    * to buttons of type "link."
    * @type String
    */
    this.setAttributeConfig("target", {

        value: oAttributes.target,
        validator: Lang.isString,
        method: this._setTarget

    });


    /**
    * @config checked
    * @description Boolean indicating if the button is checked.  Applies only
    * to buttons of type "radio" and "checkbox."
    * @default false
    * @type Boolean
    */
    this.setAttributeConfig("checked", {

        value: (oAttributes.checked || false),
        validator: Lang.isBoolean,
        method: this._setChecked

    });


	/**
	* @config container
	* @description HTML element reference or string specifying the id 
	* attribute of the HTML element that the button's markup should be 
	* rendered into.
	* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
	* level-one-html.html#ID-58190037">HTMLElement</a>|String
	* @default null
	*/
    this.setAttributeConfig("container", {

        value: oAttributes.container

    });


	/**
	* @config srcelement
    * @description Object reference to the HTML element (either 
    * <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code>) used to 
    * create the button.
	* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
	* level-one-html.html#ID-58190037">HTMLElement</a>|String
	* @default null
	*/
    this.setAttributeConfig("srcelement", {

        value: oAttributes.srcelement,
        writeOnce: true

    });


	/**
	* @config menu
    * @description Object specifying the menu for the button.  The value can be
    * one of the following:
    * <ul>
    * <li>Object specifying a <a href="YAHOO.widget.Menu.html">
    * YAHOO.widget.Menu</a> instance.</li>
    * <li>String specifying the id attribute of the <code>&#60;div&#62;</code> 
    * element used to create the menu.</li>
    * <li>String specifying the id attribute of the 
    * <code>&#60;select&#62;</code> element used to create the menu.</li>
    * <li>Object specifying the <code>&#60;div&#62;</code> element used to 
    * create the menu.</li>
    * <li>Object specifying the <code>&#60;select&#62;</code> element used to 
    * create the menu.</li>
    * <li>Array of object literals, each representing a set of 
    * <a href="YAHOO.widget.MenuItem.html">YAHOO.widget.MenuItem</a> 
    * configuration attributes.</li>
    * <li>Array of strings representing the text labels for each menu item in 
    * the menu.</li>
    * </ul>
	* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
	* level-one-html.html#ID-58190037">HTMLElement</a>|String|Array
	* @default null
	*/
    this.setAttributeConfig("menu", {

        value: null,
        method: this._setMenu
    
    });


	/**
	* @config selectedMenuItem
    * @description Reference to the item in the button's menu that is
    * currently selected.
	* @type <a href="YAHOO.widget.MenuItem.html">YAHOO.widget.MenuItem</a>
	* @default null
	*/
    this.setAttributeConfig("selectedMenuItem", {

        value: null
    
    });


	/**
	* @config onclick
    * @description Object literal representing the code to be executed when 
    * the button is clicked.  Format:<br> <code> {<br> 
    * <strong>fn:</strong> Function,   &#47;&#47; The handler to call when the 
    * event fires.<br> <strong>obj:</strong> Object, &#47;&#47; An object to 
    * pass back to the handler.<br> <strong>scope:</strong> Object &#47;&#47; 
    * The object to use for the scope of the handler.<br> } </code>
    * @type Object
	* @default null
	*/
    this.setAttributeConfig("onclick", {

        value: oAttributes.onclick,
        method: this._setOnClick
    
    });

},


/**
* @method focus
* @description Causes the button to receive the focus and fires the button's
* "focus" event.
*/
focus: function() {

    if(!this.get("disabled")) {

        this._button.focus();
    
    }

},


/**
* @method blur
* @description Causes the button to lose focus and fires the button's
* "blur" event.
*/
blur: function() {

    if(!this.get("disabled")) {

        this._button.blur();

    }

},


/**
* @method hasFocus
* @description Returns a boolean indicating whether or not the button has focus.
* @return {Boolean}
*/
hasFocus: function() {

    return (m_oFocusedButton == this);

},


/**
* @method isActive
* @description Returns a boolean indicating whether or not the button is active.
* @return {Boolean}
*/
isActive: function() {

    return this.hasClass("active");

},


/**
* @method getMenu
* @description Returns a reference to the button's menu.
* @return {<a href="YAHOO.widget.Menu.html">YAHOO.widget.Menu</a>}
*/
getMenu: function() {

    return this._menu;

},


/**
* @method getForm
* @description Returns a reference to the button's parent form.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-40002357">HTMLFormElement</a>}
*/
getForm: function() {

    return this._button.form;

},


/** 
* @method getHiddenField
* @description Returns a reference to the <code>&#60;input&#62;</code> element 
* used when the button's parent form is submitted.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>}
*/
getHiddenField: function() {

    return this._hiddenField;

},


/**
* @method destroy
* @description Removes the button's element from its parent element and 
* removes all event handlers.
*/
destroy: function() {


    var oElement = this.get("element"),
        oParentNode = oElement.parentNode,
        oMenu = this._menu;

    if(oMenu) {


        oMenu.destroy();

    }


    Event.purgeElement(oElement);
    Event.purgeElement(this._button);
    Event.removeListener(document, "mouseup", this._onDocumentMouseUp);
    Event.removeListener(document, "keyup", this._onDocumentKeyUp);
    Event.removeListener(document, "mousedown", this._onDocumentMouseDown);


    var oForm = this.getForm();
    
    if(oForm) {

        Event.removeListener(oForm, "reset", this._onFormReset);
        Event.removeListener(oForm, "submit", this._onFormSubmit);

    }


    oParentNode.removeChild(oElement);


    delete m_oButtons[this.get("id")];


},


fireEvent: function(p_sType , p_aArgs) {

    //  Disabled buttons should not respond to DOM events

    if(this.DOM_EVENTS[p_sType] && this.get("disabled")) {

        return;

    }

    YAHOO.widget.Button.superclass.fireEvent.call(this, p_sType, p_aArgs);

},


/**
* @method toString
* @description Returns a string representing the button.
* @return {String}
*/
toString: function() {

    return ("Button " + this.get("id"));

}

});


/**
* @method onFormKeyDown
* @description "keydown" event handler for the button's form.
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
YAHOO.widget.Button.onFormKeyDown = function(p_oEvent) {

    var oTarget = Event.getTarget(p_oEvent),
        nCharCode = Event.getCharCode(p_oEvent);


    if (
        nCharCode == 13 && 
        oTarget.tagName && 
        oTarget.tagName.toUpperCase() == "INPUT"
    ) {

        var sType = oTarget.type;


        if(
            sType == "text" || sType == "password" || sType == "checkbox" || 
            sType == "radio" || sType == "file"
        ) {


            function isYUISubmitButton(p_oElement) {
    
                var sId = p_oElement.id;
    
                if (sId) {
    
                    var oButton = m_oButtons[sId];
        
                    if (oButton) {
        
                        var oSrcElement = oButton.get("srcelement");
        
                        return (
                                    oButton.get("type") == "submit" || 
                                    (
                                        oSrcElement && 
                                        oSrcElement.type == "submit"
                                    )
                                );
        
                    }
                
                }
            
            }
    
    
            var aButtons = Dom.getElementsBy(
                                isYUISubmitButton,
                                this.TAG_NAME, 
                                this.getForm()
                            ),
    
                nButtons = aButtons.length;
    
    
            if (nButtons > 0) {
    
                m_oButtons[aButtons[0].id].submitForm();
            
            }

        
        }

    }

};


/**
* @method addHiddenFieldsToForm
* @description Searches the specified form and adds hidden fields for instances 
* of YAHOO.widget.Button that are of type "radio," "checkbox," "menubutton," 
* and "splitbutton."
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-40002357">HTMLFormElement</a>} p_oForm Object reference 
* for the form to search.
*/
YAHOO.widget.Button.addHiddenFieldsToForm = function(p_oForm) {

    var aButtons = Dom.getElementsByClassName("yuibutton", "*", p_oForm),
        nButtons = aButtons.length;


    if(nButtons > 0) {


        var oButton = null,
            sType = null,
            oMenuItem = null,
            oMenu = null;

        for(var i=0; i<nButtons; i++) {

            oButton = m_oButtons[aButtons[i].id];

            if(oButton) {

                sType = oButton.get("type");
                oMenuItem = oButton.get("selectedMenuItem");


                if(sType == "radio" || sType == "checkbox") {
    
    
                    oButton.createHiddenField();
                
                }
                else if(oMenuItem) {
    
                    oMenu = oButton.getMenu();
    
                    var oSrcElement = oMenu.srcElement;
                        
                    if(
                        oSrcElement && 
                        oSrcElement.tagName.toUpperCase() == "SELECT"
                    ) {
            
                        p_oForm.appendChild(oSrcElement);
                        oSrcElement.selectedIndex = oMenuItem.index;
            
                    }
                    else {
    
                        var oValue = (
                                        oMenuItem.value === null || 
                                        oMenuItem.value === ""
                                    ) ? oMenuItem.cfg.getProperty("text") : 
                                    oMenuItem.value;

                        if(oValue) {

                            var oHiddenField = oButton.getHiddenField(),
    
                                oField = createInputElement(
                                            "hidden",
                                            (oButton.get("name") + "_options"),
                                            oValue
                                        );
                                        
                            if(oHiddenField && Dom.inDocument(oHiddenField)) {

                                p_oForm.replaceChild(oField, oHiddenField);

                            }
                            else {

                                p_oForm.appendChild(oField);
                            
                            }
    
                        }
    
                    }                
    
                }
                
            }
        
        }

    }

};



// Events


/**
* @event focus
* @description Fires when the menu item receives focus.  Passes back a single 
* object representing the original DOM event object passed back by the event 
* utility (YAHOO.util.Event) when the event was fired.  See <a href="
* YAHOO.util.Element.html#addListener">Element.addListener</a> for more 
* information on listening for this event.
* @type YAHOO.util.CustomEvent
*/


/**
* @event blur
* @description Fires when the menu item loses the input focus.  Passes back a 
* single object representing the original DOM event object passed back by the 
* event utility (YAHOO.util.Event) when the event was fired.  See <a href="
* YAHOO.util.Element.html#addListener">Element.addListener</a> for more 
* information on listening for this event.
* @type YAHOO.util.CustomEvent
*/


/**
* @event option
* @description Fires when the user invokes the button's option.  Passes back a 
* single object representing the original DOM event (either "mousedown" or 
* "keydown") that caused the "option" event to fire.  See <a href="
* YAHOO.util.Element.html#addListener">Element.addListener</a> for more 
* information on listening for this event.
* @type YAHOO.util.CustomEvent
*/

})();
(function() {

// Shorthard for utilities

var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.lang,
    Button = YAHOO.widget.Button;    

    // Private collection of radio buttons

    m_oButtons = {};



/**
* The ButtonGroup class creates a set of buttons that are mutually exclusive; 
* checking one button in the set will uncheck all others in the button group.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;div&#62;</code> element of the button group.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-22445964">HTMLDivElement</a>} p_oElement Object 
* specifying the <code>&#60;div&#62;</code> element of the button group.
* @param {Object} p_oElement Object literal specifying a set of 
* configuration attributes used to create the button group.
* @param {Object} p_oAttributes Optional. Object literal specifying a set of 
* configuration attributes used to create the button group.
* @namespace YAHOO.widget
* @class ButtonGroup
* @constructor
* @extends YAHOO.util.Element
*/
YAHOO.widget.ButtonGroup = function(p_oElement, p_oAttributes) {

    var fnSuperClass = YAHOO.widget.ButtonGroup.superclass.constructor;

    if(
        arguments.length == 1 && 
        !Lang.isString(p_oElement) && 
        !p_oElement.nodeName
    ) {

        if(!p_oElement.id) {

            var sId = Dom.generateId();

            p_oElement.id = sId;


        }



        fnSuperClass.call(this, (this._createGroupElement()), p_oElement);

    }
    else if(Lang.isString(p_oElement)) {

        var oElement = Dom.get(p_oElement);

        if (oElement) {
        
            if(oElement.nodeName.toUpperCase() == this.TAG_NAME) {

        
                fnSuperClass.call(this, oElement, p_oAttributes);

            }

        }
    
    }
    else {

        var sNodeName = p_oElement.nodeName;

        if(sNodeName && sNodeName == this.TAG_NAME) {
    
            if(!p_oElement.id) {
    
                p_oElement.id = Dom.generateId();
    
    
            }
    
    
            fnSuperClass.call(this, p_oElement, p_oAttributes);

        }

    }

};


YAHOO.extend(YAHOO.widget.ButtonGroup, YAHOO.util.Element, {


// Protected properties


/** 
* @property _buttons
* @description Array of buttons in the button group.
* @default null
* @protected
* @type Array
*/
_buttons: null,



// Constants


/**
* @property TAG_NAME
* @description The name of the tag to be used for the button group's element. 
* @default "DIV"
* @final
* @type String
*/
TAG_NAME: "DIV",


/**
* @property CSS_CLASS_NAME
* @description String representing the CSS class(es) to be applied to the 
* button group's element.
* @default "yuibuttongroup"
* @final
* @type String
*/
CSS_CLASS_NAME: "yuibuttongroup",



// Protected methods


/**
* @method _createGroupElement
* @description Creates the button group's element.
* @protected
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-22445964">HTMLDivElement</a>}
*/
_createGroupElement: function() {

    var oElement = document.createElement(this.TAG_NAME);

    oElement.className = this.CSS_CLASS_NAME;

    return oElement;

},



// Protected attribute setter methods


/**
* @method _setDisabled
* @description Sets the value of the button groups's "disabled" attribute.
* @protected
* @param {Boolean} p_bDisabled Boolean indicating the value for the button
* group's "disabled" attribute.
*/
_setDisabled: function(p_bDisabled) {

    var nButtons = this.getCount();

    if(nButtons > 0) {

        var i = nButtons - 1;
        
        do {

            this._buttons[i].set("disabled", p_bDisabled);
        
        }
        while(i--);

    }

},



// Protected event handlers


/**
* @method _onKeyDown
* @description "keydown" event handler for the button group.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onKeyDown: function(p_oEvent) {

    var oTarget = Event.getTarget(p_oEvent),
        nCharCode = Event.getCharCode(p_oEvent),
        sId = oTarget.parentNode.parentNode.id,
        oButton = m_oButtons[sId],
        nIndex = -1;


    if(nCharCode == 37 || nCharCode == 38) {

        nIndex = (oButton.index === 0) ? 
                    (this._buttons.length -1) : (oButton.index - 1);
    
    }
    else if(nCharCode == 39 || nCharCode == 40) {

        nIndex = (oButton.index === (this._buttons.length - 1)) ? 
                    0 : (oButton.index + 1);

    }


    if(nIndex > -1) {

        this.check(nIndex);
        this.getButton(nIndex).focus();
    
    }        

},


/**
* @method _onAppendTo
* @description "appendTo" event handler for the button group.
* @protected
* @param {Event} p_oEvent Object representing the event that was fired.
*/
_onAppendTo: function(p_oEvent) {

    var aButtons = this._buttons,
        nButtons = aButtons.length;

    for(var i=0; i<nButtons; i++) {

        aButtons[i].appendTo(this.get("element"));

    }

},


/**
* @method _onButtonCheckedChange
* @description "checkedChange" event handler for each button in the 
* button group.
* @protected
* @param {Event} p_oEvent Object representing the event that was fired.
* @param {<a href="YAHOO.widget.Button.html">YAHOO.widget.Button</a>} p_oButton 
* Object representing the button that fired the event.
*/
_onButtonCheckedChange: function(p_oEvent, p_oButton) {

    var bChecked = p_oEvent.newValue,
        oCheckedButton = this.get("checkedButton");

    if(bChecked && oCheckedButton != p_oButton) {

        if(oCheckedButton) {

            oCheckedButton.set("checked", false, true);

        }

        this.set("checkedButton", p_oButton);
        this.set("value", p_oButton.get("value"));

    }
    else if(oCheckedButton && !oCheckedButton.set("checked")) {

        oCheckedButton.set("checked", true, true);

    }
   
},



// Public methods


/**
* @method init
* @description The ButtonGroup class's initialization method.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;div&#62;</code> element of the button group.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-22445964">HTMLDivElement</a>} p_oElement Object 
* specifying the <code>&#60;div&#62;</code> element of the button group.
* @param {Object} p_oElement Object literal specifying a set of configuration 
* attributes used to create the button group.
* @param {Object} p_oAttributes Optional. Object literal specifying a set of 
* configuration attributes used to create the button group.
*/
init: function(p_oElement, p_oAttributes) {

    this._buttons = [];

    YAHOO.widget.ButtonGroup.superclass.init.call(
            this, p_oElement, 
            p_oAttributes
        );



    var aButtons = this.getElementsByClassName("yuibutton");


    if(aButtons.length > 0) {


        this.addButtons(aButtons);

    }



    function isRadioButton(p_oElement) {

        return (p_oElement.type == "radio");

    }

    aButtons = Dom.getElementsBy(isRadioButton, "input", this.get("element"));


    if(aButtons.length > 0) {


        this.addButtons(aButtons);

    }

    this.on("keydown", this._onKeyDown);
    this.on("appendTo", this._onAppendTo);

    var oContainer = this.get("container");

    if(oContainer) {

        if(Lang.isString(oContainer)) {

            var me = this;

            Event.onContentReady(oContainer, function() {

                me.appendTo(this);            
            
            });

        }
        else {

            this.appendTo(oContainer);

        }

    }



},


/**
* @method initAttributes
* @description Initializes all of the configuration attributes used to create  
* the button group.
* @param {Object} p_oAttributes Object literal specifying a set of 
* configuration attributes used to create the button group.
*/
initAttributes: function(p_oAttributes) {

    var oAttributes = p_oAttributes || {};

    YAHOO.widget.ButtonGroup.superclass.initAttributes.call(
        this, 
        oAttributes
    );


    /**
    * @config name
    * @description String specifying the name for the button group.  This
    * name will be applied to each button in the button group.
    * @default null
    * @type String
    */
    this.setAttributeConfig("name", {

        value: oAttributes.name,
        validator: Lang.isString

    });


    /**
    * @config disabled
    * @description Boolean indicating if the button group should be disabled.  
    * Disabling the button group will disable each button in the button group.  
    * Disabled buttons are dimmed and will not respond to user input 
    * or fire events.
    * @default false
    * @type Boolean
    */
    this.setAttributeConfig("disabled", {

        value: (oAttributes.disabled || false),
        validator: Lang.isBoolean,
        method: this._setDisabled

    });


    /**
    * @config value
    * @description Object specifying the value for the button group.
    * @default null
    * @type Object
    */
    this.setAttributeConfig("value", {

        value: oAttributes.value

    });


	/**
	* @config container
	* @description HTML element reference or string specifying the id 
	* attribute of the HTML element that the button group's markup should be 
	* rendered into.
	* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
	* level-one-html.html#ID-58190037">HTMLElement</a>|String
	* @default null
	*/
    this.setAttributeConfig("container", {

        value: oAttributes.container

    });


	/**
	* @config checkedButton
    * @description Reference for the button in the button group that 
    * is checked.
	* @type {<a href="YAHOO.widget.Button.html">YAHOO.widget.Button</a>}
	* @default null
	*/
    this.setAttributeConfig("checkedButton", {

        value: null

    });

},


/**
* @method addButton
* @description Adds the button to the button group.
* @param {<a href="YAHOO.widget.Button.html">YAHOO.widget.Button</a>} p_oButton 
* Object reference for the <a href="YAHOO.widget.Button.html">
* YAHOO.widget.Button</a> instance to be added to the button group.
* @param {String} p_oButton String specifying the id attribute of the 
* <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code> element to be 
* used to create the button to be added to the button group.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>|<a href="
* http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#
* ID-33759296">HTMLElement</a>} p_oButton Object reference for the 
* <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code> element to be 
* used to create the button to be added to the button group.
* @param {Object} p_oButton Object literal specifying a set of 
* <a href="YAHOO.widget.Button.html">YAHOO.widget.Button</a> configuration 
* attributes used to configure the button to be added to the button group.
* @return {<a href="YAHOO.widget.Button.html">YAHOO.widget.Button</a>} 
*/
addButton: function(p_oButton) {

    var oButton;


    if(p_oButton instanceof Button && p_oButton.get("type") == "radio") {

        oButton = p_oButton;

    }
    else if(!Lang.isString(p_oButton) && !p_oButton.nodeName) {

        p_oButton.type = "radio";

        oButton = new Button(p_oButton);
    
    }
    else {

        oButton = new Button(p_oButton, { type: "radio" });

    }


    if(oButton) {

        var nIndex = this._buttons.length,
            sButtonName = oButton.get("name"),
            sGroupName = this.get("name");

        oButton.index = nIndex;

        this._buttons[nIndex] = oButton;
        m_oButtons[oButton.get("id")] = oButton;


        if(sButtonName != sGroupName) {

            oButton.set("name", sGroupName);
        
        }


        if(this.get("disabled")) {

            oButton.set("disabled", true);

        }


        if(oButton.get("checked")) {

            this.set("checkedButton", oButton);

        }

        
        oButton.on("checkedChange", this._onButtonCheckedChange, oButton, this);


        return oButton;

    }

},


/**
* @method addButtons
* @description Adds the array of buttons to the button group.
* @param {Array} p_aButtons Array of <a href="YAHOO.widget.Button.html">
* YAHOO.widget.Button</a> instances to be added 
* to the button group.
* @param {Array} p_aButtons Array of strings specifying the id attribute of 
* the <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code> elements to 
* be used to create the buttons to be added to the button group.
* @param {Array} p_aButtons Array of object references for the 
* <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code> elements to be 
* used to create the buttons to be added to the button group.
* @param {Array} p_aButtons Array of object literals, each containing a set of 
* <a href="YAHOO.widget.Button.html">YAHOO.widget.Button</a> configuration 
* attributes used to configure each button to be added to the button group.
* @return {Array}
*/
addButtons: function(p_aButtons) {

    if(Lang.isArray(p_aButtons)) {
    
        var nButtons = p_aButtons.length,
            oButton,
            aButtons = [];

        if(nButtons > 0) {

            for(var i=0; i<nButtons; i++) {

                oButton = this.addButton(p_aButtons[i]);
                
                if(oButton) {

                    aButtons[aButtons.length] = oButton;

                }
            
            }

            if(aButtons.length > 0) {


                return aButtons;

            }
        
        }

    }

},


/**
* @method removeButton
* @description Removes the button at the specified index from the button group.
* @param {Number} p_nIndex Number specifying the index of the button to be 
* removed from the button group.
*/
removeButton: function(p_nIndex) {

    var oButton = this.getButton(p_nIndex);
    
    if(oButton) {


        this._buttons.splice(p_nIndex, 1);
        delete m_oButtons[oButton.get("id")];

        oButton.removeListener("checkedChange", this._onButtonCheckedChange);
        oButton.destroy();


        var nButtons = this._buttons.length;
        
        if(nButtons > 0) {

            var i = this._buttons.length - 1;
            
            do {

                this._buttons[i].index = i;

            }
            while(i--);
        
        }


    }

},


/**
* @method getButton
* @description Returns the button at the specified index.
* @param {Number} p_nIndex The index of the button to retrieve from the 
* button group.
* @return {<a href="YAHOO.widget.Button.html">YAHOO.widget.Button</a>}
*/
getButton: function(p_nIndex) {

    if(Lang.isNumber(p_nIndex)) {

        return this._buttons[p_nIndex];

    }

},


/**
* @method getButtons
* @description Returns an array of the buttons in the button group.
* @return {Array}
*/
getButtons: function() {

    return this._buttons;

},


/**
* @method getCount
* @description Returns the number of buttons in the button group.
* @return {Number}
*/
getCount: function() {

    return this._buttons.length;

},


/**
* @method focus
* @description Sets focus to the button at the specified index.
* @param {Number} p_nIndex Number indicating the index of the button to focus. 
*/
focus: function(p_nIndex) {

    var oButton;

    if(Lang.isNumber(p_nIndex)) {

        oButton = this._buttons[p_nIndex];
        
        if(oButton) {

            oButton.focus();

        }
    
    }
    else {

        var nButtons = this.getCount();

        for(var i=0; i<nButtons; i++) {

            oButton = this._buttons[i];

            if(!oButton.get("disabled")) {

                oButton.focus();
                break;

            }

        }

    }

},


/**
* @method check
* @description Checks the button at the specified index.
* @param {Number} p_nIndex Number indicating the index of the button to check. 
*/
check: function(p_nIndex) {

    var oButton = this.getButton(p_nIndex);
    
    if(oButton) {

        oButton.set("checked", true);
    
    }

},


/**
* @method destroy
* @description Removes the button group's element from its parent element and 
* removes all event handlers.
*/
destroy: function() {


    var nButtons = this._buttons.length,
        oElement = this.get("element"),
        oParentNode = oElement.parentNode;
    
    if(nButtons > 0) {

        var i = this._buttons.length - 1;

        do {

            this._buttons[i].destroy();

        }
        while(i--);
    
    }


    Event.purgeElement(oElement);
    

    oParentNode.removeChild(oElement);

},


/**
* @method toString
* @description Returns a string representing the button group.
* @return {String}
*/
toString: function() {

    return ("ButtonGroup " + this.get("id"));

}

});

})();
YAHOO.register("button", YAHOO.widget.Button, {version: "2.2.2", build: "204"});

/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.3.1
*/
(function() {

    /**
     * The tabview module provides a widget for managing content bound to tabs.
     * @module tabview
     * @requires yahoo, dom, event, element
     *
     */
    /**
     * A widget to control tabbed views.
     * @namespace YAHOO.widget
     * @class TabView
     * @extends YAHOO.util.Element
     * @constructor
     * @param {HTMLElement | String | Object} el(optional) The html 
     * element that represents the TabView, or the attribute object to use. 
     * An element will be created if none provided.
     * @param {Object} attr (optional) A key map of the tabView's 
     * initial attributes.  Ignored if first arg is attributes object.
     */
    YAHOO.widget.TabView = function(el, attr) {
        attr = attr || {};
        if (arguments.length == 1 && !YAHOO.lang.isString(el) && !el.nodeName) {
            attr = el; // treat first arg as attr object
            el = attr.element || null;
        }
        
        if (!el && !attr.element) { // create if we dont have one
            el = _createTabViewElement.call(this, attr);
        }
    	YAHOO.widget.TabView.superclass.constructor.call(this, el, attr); 
    };

    YAHOO.extend(YAHOO.widget.TabView, YAHOO.util.Element);
    
    var proto = YAHOO.widget.TabView.prototype;
    var Dom = YAHOO.util.Dom;
    var Event = YAHOO.util.Event;
    var Tab = YAHOO.widget.Tab;
    
    
    /**
     * The className to add when building from scratch. 
     * @property CLASSNAME
     * @default "navset"
     */
    proto.CLASSNAME = 'yui-navset';
    
    /**
     * The className of the HTMLElement containing the TabView's tab elements
     * to look for when building from existing markup, or to add when building
     * from scratch. 
     * All childNodes of the tab container are treated as Tabs when building
     * from existing markup.
     * @property TAB_PARENT_CLASSNAME
     * @default "nav"
     */
    proto.TAB_PARENT_CLASSNAME = 'yui-nav';
    
    /**
     * The className of the HTMLElement containing the TabView's label elements
     * to look for when building from existing markup, or to add when building
     * from scratch. 
     * All childNodes of the content container are treated as content elements when
     * building from existing markup.
     * @property CONTENT_PARENT_CLASSNAME
     * @default "nav-content"
     */
    proto.CONTENT_PARENT_CLASSNAME = 'yui-content';
    
    proto._tabParent = null;
    proto._contentParent = null; 
    
    /**
     * Adds a Tab to the TabView instance.  
     * If no index is specified, the tab is added to the end of the tab list.
     * @method addTab
     * @param {YAHOO.widget.Tab} tab A Tab instance to add.
     * @param {Integer} index The position to add the tab. 
     * @return void
     */
    proto.addTab = function(tab, index) {
        var tabs = this.get('tabs');
        if (!tabs) { // not ready yet
            this._queue[this._queue.length] = ['addTab', arguments];
            return false;
        }
        
        index = (index === undefined) ? tabs.length : index;
        
        var before = this.getTab(index);
        
        var self = this;
        var el = this.get('element');
        var tabParent = this._tabParent;
        var contentParent = this._contentParent;

        var tabElement = tab.get('element');
        var contentEl = tab.get('contentEl');

        if ( before ) {
            tabParent.insertBefore(tabElement, before.get('element'));
        } else {
            tabParent.appendChild(tabElement);
        }

        if ( contentEl && !Dom.isAncestor(contentParent, contentEl) ) {
            contentParent.appendChild(contentEl);
        }
        
        if ( !tab.get('active') ) {
            tab.set('contentVisible', false, true); /* hide if not active */
        } else {
            this.set('activeTab', tab, true);
            
        }

        var activate = function(e) {
            YAHOO.util.Event.preventDefault(e);
            var silent = false;

            if (this == self.get('activeTab')) {
                silent = true; // dont fire activeTabChange if already active
            }
            self.set('activeTab', this, silent);
        };
        
        tab.addListener( tab.get('activationEvent'), activate);
        
        tab.addListener('activationEventChange', function(e) {
            if (e.prevValue != e.newValue) {
                tab.removeListener(e.prevValue, activate);
                tab.addListener(e.newValue, activate);
            }
        });
        
        tabs.splice(index, 0, tab);
    };

    /**
     * Routes childNode events.
     * @method DOMEventHandler
     * @param {event} e The Dom event that is being handled.
     * @return void
     */
    proto.DOMEventHandler = function(e) {
        var el = this.get('element');
        var target = YAHOO.util.Event.getTarget(e);
        var tabParent = this._tabParent;
        
        if (Dom.isAncestor(tabParent, target) ) {
            var tabEl;
            var tab = null;
            var contentEl;
            var tabs = this.get('tabs');

            for (var i = 0, len = tabs.length; i < len; i++) {
                tabEl = tabs[i].get('element');
                contentEl = tabs[i].get('contentEl');

                if ( target == tabEl || Dom.isAncestor(tabEl, target) ) {
                    tab = tabs[i];
                    break; // note break
                }
            } 
            
            if (tab) {
                tab.fireEvent(e.type, e);
            }
        }
    };
    
    /**
     * Returns the Tab instance at the specified index.
     * @method getTab
     * @param {Integer} index The position of the Tab.
     * @return YAHOO.widget.Tab
     */
    proto.getTab = function(index) {
    	return this.get('tabs')[index];
    };
    
    /**
     * Returns the index of given tab.
     * @method getTabIndex
     * @param {YAHOO.widget.Tab} tab The tab whose index will be returned.
     * @return int
     */
    proto.getTabIndex = function(tab) {
        var index = null;
        var tabs = this.get('tabs');
    	for (var i = 0, len = tabs.length; i < len; ++i) {
            if (tab == tabs[i]) {
                index = i;
                break;
            }
        }
        
        return index;
    };
    
    /**
     * Removes the specified Tab from the TabView.
     * @method removeTab
     * @param {YAHOO.widget.Tab} item The Tab instance to be removed.
     * @return void
     */
    proto.removeTab = function(tab) {
        var tabCount = this.get('tabs').length;

        var index = this.getTabIndex(tab);
        var nextIndex = index + 1;
        if ( tab == this.get('activeTab') ) { // select next tab
            if (tabCount > 1) {
                if (index + 1 == tabCount) {
                    this.set('activeIndex', index - 1);
                } else {
                    this.set('activeIndex', index + 1);
                }
            }
        }
        
        this._tabParent.removeChild( tab.get('element') );
        this._contentParent.removeChild( tab.get('contentEl') );
        this._configs.tabs.value.splice(index, 1);
    	
    };
    
    /**
     * Provides a readable name for the TabView instance.
     * @method toString
     * @return String
     */
    proto.toString = function() {
        var name = this.get('id') || this.get('tagName');
        return "TabView " + name; 
    };
    
    /**
     * The transiton to use when switching between tabs.
     * @method contentTransition
     */
    proto.contentTransition = function(newTab, oldTab) {
        newTab.set('contentVisible', true);
        oldTab.set('contentVisible', false);
    };
    
    /**
     * setAttributeConfigs TabView specific properties.
     * @method initAttributes
     * @param {Object} attr Hash of initial attributes
     */
    proto.initAttributes = function(attr) {
        YAHOO.widget.TabView.superclass.initAttributes.call(this, attr);
        
        if (!attr.orientation) {
            attr.orientation = 'top';
        }
        
        var el = this.get('element');

        if (!YAHOO.util.Dom.hasClass(el, this.CLASSNAME)) {
            YAHOO.util.Dom.addClass(el, this.CLASSNAME);        
        }
        
        /**
         * The Tabs belonging to the TabView instance.
         * @attribute tabs
         * @type Array
         */
        this.setAttributeConfig('tabs', {
            value: [],
            readOnly: true
        });

        /**
         * The container of the tabView's label elements.
         * @property _tabParent
         * @private
         * @type HTMLElement
         */
        this._tabParent = 
                this.getElementsByClassName(this.TAB_PARENT_CLASSNAME,
                        'ul' )[0] || _createTabParent.call(this);
            
        /**
         * The container of the tabView's content elements.
         * @property _contentParent
         * @type HTMLElement
         * @private
         */
        this._contentParent = 
                this.getElementsByClassName(this.CONTENT_PARENT_CLASSNAME,
                        'div')[0] ||  _createContentParent.call(this);
        
        /**
         * How the Tabs should be oriented relative to the TabView.
         * @attribute orientation
         * @type String
         * @default "top"
         */
        this.setAttributeConfig('orientation', {
            value: attr.orientation,
            method: function(value) {
                var current = this.get('orientation');
                this.addClass('yui-navset-' + value);
                
                if (current != value) {
                    this.removeClass('yui-navset-' + current);
                }
                
                switch(value) {
                    case 'bottom':
                    this.appendChild(this._tabParent);
                    break;
                }
            }
        });
        
        /**
         * The index of the tab currently active.
         * @attribute activeIndex
         * @type Int
         */
        this.setAttributeConfig('activeIndex', {
            value: attr.activeIndex,
            method: function(value) {
                this.set('activeTab', this.getTab(value));
            },
            validator: function(value) {
                return !this.getTab(value).get('disabled'); // cannot activate if disabled
            }
        });
        
        /**
         * The tab currently active.
         * @attribute activeTab
         * @type YAHOO.widget.Tab
         */
        this.setAttributeConfig('activeTab', {
            value: attr.activeTab,
            method: function(tab) {
                var activeTab = this.get('activeTab');
                
                if (tab) {  
                    tab.set('active', true);
                    this._configs['activeIndex'].value = this.getTabIndex(tab); // keep in sync
                }
                
                if (activeTab && activeTab != tab) {
                    activeTab.set('active', false);
                }
                
                if (activeTab && tab != activeTab) { // no transition if only 1
                    this.contentTransition(tab, activeTab);
                } else if (tab) {
                    tab.set('contentVisible', true);
                }
            },
            validator: function(value) {
                return !value.get('disabled'); // cannot activate if disabled
            }
        });

        if ( this._tabParent ) {
            _initTabs.call(this);
        }
        
        // Due to delegation we add all DOM_EVENTS to the TabView container
        // but IE will leak when unsupported events are added, so remove these
        this.DOM_EVENTS.submit = false;
        this.DOM_EVENTS.focus = false;
        this.DOM_EVENTS.blur = false;

        for (var type in this.DOM_EVENTS) {
            if ( YAHOO.lang.hasOwnProperty(this.DOM_EVENTS, type) ) {
                this.addListener.call(this, type, this.DOMEventHandler);
            }
        }
    };
    
    /**
     * Creates Tab instances from a collection of HTMLElements.
     * @method initTabs
     * @private
     * @return void
     */
    var _initTabs = function() {
        var tab,
            attr,
            contentEl;
            
        var el = this.get('element');   
        var tabs = _getChildNodes(this._tabParent);
        var contentElements = _getChildNodes(this._contentParent);

        for (var i = 0, len = tabs.length; i < len; ++i) {
            attr = {};
            
            if (contentElements[i]) {
                attr.contentEl = contentElements[i];
            }

            tab = new YAHOO.widget.Tab(tabs[i], attr);
            this.addTab(tab);
            
            if (tab.hasClass(tab.ACTIVE_CLASSNAME) ) {
                this._configs.activeTab.value = tab; // dont invoke method
                this._configs.activeIndex.value = this.getTabIndex(tab);
            }
        }
    };
    
    var _createTabViewElement = function(attr) {
        var el = document.createElement('div');

        if ( this.CLASSNAME ) {
            el.className = this.CLASSNAME;
        }
        
        return el;
    };
    
    var _createTabParent = function(attr) {
        var el = document.createElement('ul');

        if ( this.TAB_PARENT_CLASSNAME ) {
            el.className = this.TAB_PARENT_CLASSNAME;
        }
        
        this.get('element').appendChild(el);
        
        return el;
    };
    
    var _createContentParent = function(attr) {
        var el = document.createElement('div');

        if ( this.CONTENT_PARENT_CLASSNAME ) {
            el.className = this.CONTENT_PARENT_CLASSNAME;
        }
        
        this.get('element').appendChild(el);
        
        return el;
    };
    
    var _getChildNodes = function(el) {
        var nodes = [];
        var childNodes = el.childNodes;
        
        for (var i = 0, len = childNodes.length; i < len; ++i) {
            if (childNodes[i].nodeType == 1) {
                nodes[nodes.length] = childNodes[i];
            }
        }
        
        return nodes;
    };
})();

(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;
    
    /**
     * A representation of a Tab's label and content.
     * @namespace YAHOO.widget
     * @class Tab
     * @extends YAHOO.util.Element
     * @constructor
     * @param element {HTMLElement | String} (optional) The html element that 
     * represents the TabView. An element will be created if none provided.
     * @param {Object} properties A key map of initial properties
     */
    var Tab = function(el, attr) {
        attr = attr || {};
        if (arguments.length == 1 && !YAHOO.lang.isString(el) && !el.nodeName) {
            attr = el;
            el = attr.element;
        }

        if (!el && !attr.element) {
            el = _createTabElement.call(this, attr);
        }

        this.loadHandler =  {
            success: function(o) {
                this.set('content', o.responseText);
            },
            failure: function(o) {
            }
        };
        
        Tab.superclass.constructor.call(this, el, attr);
        
        this.DOM_EVENTS = {}; // delegating to tabView
    };

    YAHOO.extend(Tab, YAHOO.util.Element);
    var proto = Tab.prototype;
    
    /**
     * The default tag name for a Tab's inner element.
     * @property LABEL_INNER_TAGNAME
     * @type String
     * @default "em"
     */
    proto.LABEL_TAGNAME = 'em';
    
    /**
     * The class name applied to active tabs.
     * @property ACTIVE_CLASSNAME
     * @type String
     * @default "selected"
     */
    proto.ACTIVE_CLASSNAME = 'selected';
    
    /**
     * The class name applied to disabled tabs.
     * @property DISABLED_CLASSNAME
     * @type String
     * @default "disabled"
     */
    proto.DISABLED_CLASSNAME = 'disabled';
    
    /**
     * The class name applied to dynamic tabs while loading.
     * @property LOADING_CLASSNAME
     * @type String
     * @default "disabled"
     */
    proto.LOADING_CLASSNAME = 'loading';

    /**
     * Provides a reference to the connection request object when data is
     * loaded dynamically.
     * @property dataConnection
     * @type Object
     */
    proto.dataConnection = null;
    
    /**
     * Object containing success and failure callbacks for loading data.
     * @property loadHandler
     * @type object
     */
    proto.loadHandler = null;

    proto._loading = false;
    
    /**
     * Provides a readable name for the tab.
     * @method toString
     * @return String
     */
    proto.toString = function() {
        var el = this.get('element');
        var id = el.id || el.tagName;
        return "Tab " + id; 
    };
    
    /**
     * setAttributeConfigs TabView specific properties.
     * @method initAttributes
     * @param {Object} attr Hash of initial attributes
     */
    proto.initAttributes = function(attr) {
        attr = attr || {};
        Tab.superclass.initAttributes.call(this, attr);
        
        var el = this.get('element');
        
        /**
         * The event that triggers the tab's activation.
         * @attribute activationEvent
         * @type String
         */
        this.setAttributeConfig('activationEvent', {
            value: attr.activationEvent || 'click'
        });        

        /**
         * The element that contains the tab's label.
         * @attribute labelEl
         * @type HTMLElement
         */
        this.setAttributeConfig('labelEl', {
            value: attr.labelEl || _getlabelEl.call(this),
            method: function(value) {
                var current = this.get('labelEl');

                if (current) {
                    if (current == value) {
                        return false; // already set
                    }
                    
                    this.replaceChild(value, current);
                } else if (el.firstChild) { // ensure label is firstChild by default
                    this.insertBefore(value, el.firstChild);
                } else {
                    this.appendChild(value);
                }  
            } 
        });

        /**
         * The tab's label text (or innerHTML).
         * @attribute label
         * @type String
         */
        this.setAttributeConfig('label', {
            value: attr.label || _getLabel.call(this),
            method: function(value) {
                var labelEl = this.get('labelEl');
                if (!labelEl) { // create if needed
                    this.set('labelEl', _createlabelEl.call(this));
                }
                
                _setLabel.call(this, value);
            }
        });
        
        /**
         * The HTMLElement that contains the tab's content.
         * @attribute contentEl
         * @type HTMLElement
         */
        this.setAttributeConfig('contentEl', {
            value: attr.contentEl || document.createElement('div'),
            method: function(value) {
                var current = this.get('contentEl');

                if (current) {
                    if (current == value) {
                        return false; // already set
                    }
                    this.replaceChild(value, current);
                }
            }
        });
        
        /**
         * The tab's content.
         * @attribute content
         * @type String
         */
        this.setAttributeConfig('content', {
            value: attr.content,
            method: function(value) {
                this.get('contentEl').innerHTML = value;
            }
        });

        var _dataLoaded = false;
        
        /**
         * The tab's data source, used for loading content dynamically.
         * @attribute dataSrc
         * @type String
         */
        this.setAttributeConfig('dataSrc', {
            value: attr.dataSrc
        });
        
        /**
         * Whether or not content should be reloaded for every view.
         * @attribute cacheData
         * @type Boolean
         * @default false
         */
        this.setAttributeConfig('cacheData', {
            value: attr.cacheData || false,
            validator: YAHOO.lang.isBoolean
        });
        
        /**
         * The method to use for the data request.
         * @attribute loadMethod
         * @type String
         * @default "GET"
         */
        this.setAttributeConfig('loadMethod', {
            value: attr.loadMethod || 'GET',
            validator: YAHOO.lang.isString
        });

        /**
         * Whether or not any data has been loaded from the server.
         * @attribute dataLoaded
         * @type Boolean
         */        
        this.setAttributeConfig('dataLoaded', {
            value: false,
            validator: YAHOO.lang.isBoolean,
            writeOnce: true
        });
        
        /**
         * Number if milliseconds before aborting and calling failure handler.
         * @attribute dataTimeout
         * @type Number
         * @default null
         */
        this.setAttributeConfig('dataTimeout', {
            value: attr.dataTimeout || null,
            validator: YAHOO.lang.isNumber
        });
        
        /**
         * Whether or not the tab is currently active.
         * If a dataSrc is set for the tab, the content will be loaded from
         * the given source.
         * @attribute active
         * @type Boolean
         */
        this.setAttributeConfig('active', {
            value: attr.active || this.hasClass(this.ACTIVE_CLASSNAME),
            method: function(value) {
                if (value === true) {
                    this.addClass(this.ACTIVE_CLASSNAME);
                    this.set('title', 'active');
                } else {
                    this.removeClass(this.ACTIVE_CLASSNAME);
                    this.set('title', '');
                }
            },
            validator: function(value) {
                return YAHOO.lang.isBoolean(value) && !this.get('disabled') ;
            }
        });
        
        /**
         * Whether or not the tab is disabled.
         * @attribute disabled
         * @type Boolean
         */
        this.setAttributeConfig('disabled', {
            value: attr.disabled || this.hasClass(this.DISABLED_CLASSNAME),
            method: function(value) {
                if (value === true) {
                    Dom.addClass(this.get('element'), this.DISABLED_CLASSNAME);
                } else {
                    Dom.removeClass(this.get('element'), this.DISABLED_CLASSNAME);
                }
            },
            validator: YAHOO.lang.isBoolean
        });
        
        /**
         * The href of the tab's anchor element.
         * @attribute href
         * @type String
         * @default '#'
         */
        this.setAttributeConfig('href', {
            value: attr.href ||
                    this.getElementsByTagName('a')[0].getAttribute('href', 2) || '#',
            method: function(value) {
                this.getElementsByTagName('a')[0].href = value;
            },
            validator: YAHOO.lang.isString
        });
        
        /**
         * The Whether or not the tab's content is visible.
         * @attribute contentVisible
         * @type Boolean
         * @default false
         */
        this.setAttributeConfig('contentVisible', {
            value: attr.contentVisible,
            method: function(value) {
                if (value) {
                    this.get('contentEl').style.display = 'block';
                    
                    if ( this.get('dataSrc') ) {
                     // load dynamic content unless already loading or loaded and caching
                        if ( !this._loading && !(this.get('dataLoaded') && this.get('cacheData')) ) {
                            _dataConnect.call(this);
                        }
                    }
                } else {
                    this.get('contentEl').style.display = 'none';
                }
            },
            validator: YAHOO.lang.isBoolean
        });
    };
    
    var _createTabElement = function(attr) {
        var el = document.createElement('li');
        var a = document.createElement('a');
        
        a.href = attr.href || '#';
        
        el.appendChild(a);
        
        var label = attr.label || null;
        var labelEl = attr.labelEl || null;
        
        if (labelEl) { // user supplied labelEl
            if (!label) { // user supplied label
                label = _getLabel.call(this, labelEl);
            }
        } else {
            labelEl = _createlabelEl.call(this);
        }
        
        a.appendChild(labelEl);
        
        return el;
    };
    
    var _getlabelEl = function() {
        return this.getElementsByTagName(this.LABEL_TAGNAME)[0];
    };
    
    var _createlabelEl = function() {
        var el = document.createElement(this.LABEL_TAGNAME);
        return el;
    };
    
    var _setLabel = function(label) {
        var el = this.get('labelEl');
        el.innerHTML = label;
    };
    
    var _getLabel = function() {
        var label,
            el = this.get('labelEl');
            
            if (!el) {
                return undefined;
            }
        
        return el.innerHTML;
    };
    
    var _dataConnect = function() {
        if (!YAHOO.util.Connect) {
            return false;
        }

        Dom.addClass(this.get('contentEl').parentNode, this.LOADING_CLASSNAME);
        this._loading = true; 
        this.dataConnection = YAHOO.util.Connect.asyncRequest(
            this.get('loadMethod'),
            this.get('dataSrc'), 
            {
                success: function(o) {
                    this.loadHandler.success.call(this, o);
                    this.set('dataLoaded', true);
                    this.dataConnection = null;
                    Dom.removeClass(this.get('contentEl').parentNode,
                            this.LOADING_CLASSNAME);
                    this._loading = false;
                },
                failure: function(o) {
                    this.loadHandler.failure.call(this, o);
                    this.dataConnection = null;
                    Dom.removeClass(this.get('contentEl').parentNode,
                            this.LOADING_CLASSNAME);
                    this._loading = false;
                },
                scope: this,
                timeout: this.get('dataTimeout')
            }
        );
    };
    
    YAHOO.widget.Tab = Tab;
})();

YAHOO.register("tabview", YAHOO.widget.TabView, {version: "2.3.1", build: "541"});

 g_sid=window.parent.g_sid;$i=function(id){return document.getElementById(id);}
cabecalhojanela="";var h=parseInt(window.parent.document.getElementById("wdocai").style.height);navm=false;navn=false;var app=navigator.appName.substring(0,1);if(app=='N')navn=true;else navm=true;if(!$i("mascaraaguarde")){ if(navm){var s="filter:'alpha(opacity=20)'";}
 if(navn){var s="opacity:.2'";}
 document.body.innerHTML+="<div id=mascaraaguarde style=display:none;position:absolute;top:0px;left:0px;width:100%;height:"+h+"px;background-color:gray;border-size:0px;z-index:6000;"+s+" >&nbsp;</div>";}
reduzAltura=30;for(i=0;i<7;i++){ if(document.getElementById("guia"+i)){reduzAltura=50;}}
if(navn){ if(document.getElementById("fundo")){ document.getElementById("fundo").style.width="100%"; document.getElementById("fundo").style.height="100%";}
 if(document.getElementById("geral")){ document.getElementById("geral").style.height="90%"; document.getElementById("geral").style.width="97%";}}
else{ if(document.getElementById("fundo")){ document.getElementById("fundo").style.width="104%"; document.getElementById("fundo").style.height="99%";}
 if(document.getElementById("geral")){ document.getElementById("geral").style.height="90%"; document.getElementById("geral").style.width="100%";}}
document.body.style.backgroundColor="#F0F0F0";function aguarde(tipo){ if(tipo=="block"){ if(window.parent.document.getElementById("wdoca_h")){ cabecalhojanela=window.parent.document.getElementById("wdoca_h").innerHTML; window.parent.document.getElementById("wdoca_h").innerHTML="<img src=\'"+window.parent.g_locaplic+"/imagens/aguarde.gif\'/><span style=color:red >&nbsp;Aguarde...</span>"; $i("mascaraaguarde").style.display="block";}}
 if(tipo=="none"){ if(window.parent.document.getElementById("wdoca_h")){window.parent.document.getElementById("wdoca_h").innerHTML=cabecalhojanela;}
 if($i("mascaraaguarde")){$i("mascaraaguarde").style.display="none";}}
 if(document.getElementById("aguarde")){document.getElementById("aguarde").style.display="none";}}function cor(obj){window.parent.abreCor("wdocai",obj);} function mostraOpcao(anterior,proxima,texto,idatual){ if(!document.getElementById(idatual)){ var ndiv=document.createElement("div"); ndiv.id=idatual; texto+="<br><br><table style='width:100%;background-color:#F2F2F2;' ><tr style='width:100%'>"; if(anterior !=""){texto+="<td style='border:0px solid white;text-align:left;cursor:pointer;background-color:#F2F2F2;'><img onclick="+anterior+" src=../../imagens/anterior.gif ></td>";}
 if(proxima !=""){texto+="<td style='border:0px solid white;text-align:right;cursor:pointer;background-color:#F2F2F2;'><img onclick="+proxima+" src=../../imagens/proxima.gif ></td>";}
 ndiv.innerHTML=texto+"</tr></table>"; document.getElementById("resultado").appendChild(ndiv);}
 var ids=new Array("t0","t1","t2","t3","t4","t5","t6","t7"); for(i=0;i<ids.length;i++){ if(document.getElementById(ids[i])){document.getElementById(ids[i]).style.display="none";}}
 document.getElementById(idatual).style.display="block";}function simnao(id){ var combo="<select name="+id+" id="+id+" >"; combo+="<option value=TRUE selected>sim</option>"; combo+="<option value=FALSE >não</option>"; combo+="</select>"; return(combo);}function naosim(id){ var combo="<select name="+id+" id="+id+" >"; combo+="<option value=TRUE >sim</option>"; combo+="<option value=FALSE selected >não</option>"; combo+="</select>"; return(combo);}function combocor(id,def,s){ var combo="<select name="+id+" id="+id+" >"; if(def==0){s='selected';}
 combo+='<option value="0" '+s+' >branco</option>'; s=""; combo+='<option value="2">vermelho</option>'; combo+='<option value="7">amarelo</option>'; if(def==1){s='selected'}; combo+='<option value="1" '+s+' >preto</option>'; combo+='<option value="rgb(1,1,0.8)">bege</option>'; combo+='<option value="3">verde</option>'; combo+='<option value="8">cinza</option>'; combo+='<option value="4">azul</option>'; combo+='<option value="5">ciano</option>'; combo+='<option value="6">magenta</option>'; combo+="</select>"; return(combo);}  function comboitens(id,tema,funcao,onde){ if(arguments.length==4) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando itens...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<select id="+id+" >"); ins.push("<option value='' >---</option>"); for(i=0;i<retorno.data.valores.length;i++){ if(retorno.data.valores[i].tema==tema){ins.push("<option value='"+retorno.data.valores[i].item+"' >"+retorno.data.valores[i].item+"</option>");}}
 ins.push("</select>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{ var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);}  function checkitensf(tema,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando itens...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<table class=lista >"); for(i=0;i<retorno.data.valores.length;i++){ ins.push("<tr><td><input size=2 style='cursor:pointer' name='"+retorno.data.valores[i].tema+"' type=checkbox id='"+retorno.data.valores[i].item+"'/></td>"); ins.push("<td>"+retorno.data.valores[i].item+"-"+retorno.data.valores[i].nome+"</td></tr>");}
 ins.push("</table>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{ var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);}function radioitensf(tema,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando itens...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<table class=lista >"); for(i=0;i<retorno.data.valores.length;i++){ ins.push("<tr><td><input size=2 style='cursor:pointer' name='itensradio' type=radio id='"+retorno.data.valores[i].item+";"+retorno.data.valores[i].tema+"'/></td>"); ins.push("<td>"+retorno.data.valores[i].item+"-"+retorno.data.valores[i].nome+"</td></tr>");}
 ins.push("</table>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);}function valoresItem(tema,itemTema,funcao,onde){ if(arguments.length==4) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando valores...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); for(i=0;i<retorno.data[1].registros.length;i++){ var pares=retorno.data[1].registros[i].valores; for(j=0;j<pares.length;j++){ins.push(pares[j].valor+"<br>");}}
 ins.push("<br>"); ins.sort; var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaregistros&unico=sim&tema="+tema+"&itemtema="+itemTema,"listaRegistros",monta);}function valoresItemCombo(id,tema,itemTema,funcao,onde){ if(arguments.length==5) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando valores...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<select id="+id+" >"); ins.push("<option value='' >---</option>"); for(i=0;i<retorno.data[1].registros.length;i++){ var pares=retorno.data[1].registros[i].valores; for(j=0;j<pares.length;j++){ins.push("<option value='"+pares[j].valor+"' >"+pares[j].valor+"</option>");}}
 ins.push("</select>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaregistros&unico=sim&tema="+tema+"&itemtema="+itemTema,"listaRegistros",monta);}
     function comboCamadas(id,tema,funcao,onde){ if(arguments.length==4) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.temas.length > 1){ var combot="<select id="+id+" >"; combot=combot+"<option value='' >---</option>"; for(i=0;i<retorno.data.temas.length;i++){ combot=combot+"<option value="+retorno.data.temas[i]+" >"+retorno.data.nomes[i]+"</option>";}
 combot=combot+"</select>"; var temp={dados:combot,tipo:"dados"};}
 else{var temp={dados:"",tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);}   function comboTemasSel(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; eval("funcao('<div style=color:red;font-size:10px;>Aguarde...</div>')"); var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:comboTemas,tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema possui sele&ccedil;&atilde;o. Utilize a op&ccedil;&atilde;o de sele&ccedil;&atilde;o ou a tabela de um tema para escolher algum elemento de algum tema.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemascomsel","listaTemasComSel",monta);}   function comboTemasLigados(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:comboTemas,tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema está ligado.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemas&opcao=ligados","listaTemas",monta);}   function comboTemasLocais(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas locais...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:comboTemas,tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema local dispon&iacute;vel.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemaslocais","listaTemasLocais",monta);}function comboTemasPt(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:"comboTemas",tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema de pontos dispon&iacute;vel.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=ponto","listaTemasTipo",monta);}function comboTemasPol(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:comboTemas,tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema de pol&iacute;gonos dispon&iacute;vel.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=poligono","listaTemasTipo",monta);}function comboTemasRaster(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:comboTemas,tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema raster dispon&iacute;vel.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=raster","listaTemasTipo",monta);}  function checkTemasPolRaster(funcao,onde){ if(arguments.length==2) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<table class=lista >"); for(i=0;i<retorno.data.length;i++){ ins.push("<tr><td><input size=2 style='cursor:pointer' value="+retorno.data[i].tema+" type=checkbox id="+retorno.data[i].tema+"/></td>"); ins.push("<td>"+retorno.data[i].nome+"</td></tr>");}
 ins.push("</table>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=poligono,raster","listaTemasTipo",monta);}
   function comboTrueType(funcao,onde){ if(arguments.length==2) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando fontes...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var lista=retorno.data.split(","); var ins="<select id=fonte >"; ins=ins+"<option value='bitmap' >bitmap</option>"; for(i=0;i<lista.length;i++){ins=ins+"<option value="+lista[i]+" >"+lista[i]+"</option>";}
 ins=ins+"</select>"; var temp={dados:ins,tipo:"dados"};}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatruetype","listaTrueType",monta);}
 function removeAcentos(palavra){ var re=/ã|á|à|â/gi; palavra=palavra.replace(re,"a"); var re=/é/gi; palavra=palavra.replace(re,"e"); var re=/í/gi; palavra=palavra.replace(re,"i"); var re=/ó|õ/gi; palavra=palavra.replace(re,"o"); var re=/ç/gi; palavra=palavra.replace(re,"c"); var re=/ú/gi; palavra=palavra.replace(re,"u"); return(palavra);}function htmlAcentos(palavra){ var re=/ã/gi; palavra=palavra.replace(re,"*atilde|"); var re=/á/gi; palavra=palavra.replace(re,"*aacute|"); var re=/â/gi; palavra=palavra.replace(re,"*acirc|"); var re=/õ/gi; palavra=palavra.replace(re,"*otilde|"); var re=/ó/gi; palavra=palavra.replace(re,"*oacute|"); var re=/ô/gi; palavra=palavra.replace(re,"*ocirc|"); var re=/é/gi; palavra=palavra.replace(re,"*eacute|"); var re=/ê/gi; palavra=palavra.replace(re,"*ecirc|"); var re=/í/gi; palavra=palavra.replace(re,"*iacute|"); var re=/ú/gi; palavra=palavra.replace(re,"*uacute|"); var re=/ç/gi; palavra=palavra.replace(re,"*ccedil|"); var re=/Ã/gi; palavra=palavra.replace(re,"*Atilde|"); var re=/Á/gi; palavra=palavra.replace(re,"*Aacute|"); var re=/Â/gi; palavra=palavra.replace(re,"*Acirc|"); var re=/Õ/gi; palavra=palavra.replace(re,"*otilde|"); var re=/Ó/gi; palavra=palavra.replace(re,"*Oacute|"); var re=/Ô/gi; palavra=palavra.replace(re,"*Ocirc|"); var re=/É/gi; palavra=palavra.replace(re,"*Eacute|"); var re=/Ê/gi; palavra=palavra.replace(re,"*Ecirc|"); var re=/Í/gi; palavra=palavra.replace(re,"*Iacute|"); var re=/Ú/gi; palavra=palavra.replace(re,"*Uacute|"); var re=/Ç/gi; palavra=palavra.replace(re,"*Ccedil|"); return(palavra);}function randomRGB(){ var v=Math.random(); var r=parseInt(255*v); var v=Math.random(); var g=parseInt(255*v); var v=Math.random(); var b=parseInt(255*v); return(r+","+g+","+b);}function parametrosURL(){ g_locaplic=window.parent.g_locaplic; g_r=window.parent.g_r; var temp=(window.location.href).split("tema="); if(temp[1]){tema=(temp[1].split("&"))[0];}}function zoomf(ext){ window.parent.borra("sim"); var p=g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=mudaext&ext="+ext; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"mudaExtensao",window.parent.remapaf);}function pinf(ext){ valores=ext.split(" "); vx=(valores[0]*1)+((((valores[0]*-1)-(valores[2]*-1))/2)*1); vy=(valores[1]*1)+((((valores[1]*-1)-(valores[3]*-1))/2)*1); window.parent.borra("sim"); var p=g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=zoomponto&pin=pin&xy="+vx+" "+vy; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"zoomPonto",window.parent.ajaxredesenha);}
function convdmsddf(g,m,s){ cd=$i(g).value; cm=$i(m).value; cs=$i(s).value; var sinal='positivo'; if(cd < 0){ cd=cd*-1; sinal='negativo';}
 spm=cs/3600; mpg=cm/60; var dd=(cd*1)+(mpg*1)+(spm*1); if(sinal=='negativo'){dd=dd*-1;}
 return dd;}
function mensagemAjuda(onde,texto){ var ins="<table style='width:100%;padding:2;vertical-align:top;background-color:#ffffff;' ><tr><th style='background-color: #cedff2;font-family:Verdana, Arial, Helvetica, sans-serif;font-size: 8pt;border: 1px solid #B1CDEB;text-align: left;padding-left: 7px;padding-right: 11px;'>"; ins+='<div style="float:right"><img src="../../imagens/question.gif"/></div>'; ins+='<div style="left;">'; if(texto==""){var texto=$i(onde).innerHTML;}
 ins+=texto; ins+='</div></th></tr></table>'; if(onde !=""){$i(onde).innerHTML=ins;}
 else{return(ins);}}
function mensagemOpcao(onde,texto){ var ins="<table style='width:100%;padding:2;vertical-align:top;background-color:#ffffff;' ><tr><th style='background-color: #cedff2;font-family:Verdana, Arial, Helvetica, sans-serif;font-size: 8pt;border: 1px solid #B1CDEB;text-align: left;padding-left: 7px;padding-right: 11px;'>"; ins+='<div style="float:right"><img src="../../imagens/opcoes.gif"/></div>'; ins+='<div style="left;">'; if(texto==""){var texto=$i(onde).innerHTML;}
 ins+=texto; ins+='</div></th></tr></table>'; if(onde !=""){$i(onde).innerHTML=ins;}
 else{return(ins);}}
function ativaGuias(){ for(g=0;g<12;g++){ if($i("guia"+g)) var gpai=$i("guia"+g).parentNode;}
 gpai.id="guiasYUI"; gpai.className="yui-navset"; var ins='<ul class="yui-nav" style="border-width:0pt 0pt 2px;border-color:rgb(240,240,240)">'; for(g=0;g<12;g++){ if($i("guia"+g)) ins+='<li><a href="#"><em><div id=guia'+g+' style=text-align:center;font-size:10px;left:0px;>'+$i("guia"+g).innerHTML+'</div></em></a></li>';}
 ins+="</ul>"; gpai.innerHTML=ins;}
function mostraGuia(guia){ for(g=0;g<12;g++){ if($i("guia"+g+"obj")) $i("guia"+g+"obj").style.display="none";}
 $i(guia+"obj").style.display="block";}

/**
* CPAINT - Cross-Platform Asynchronous INterface Toolkit
*
* http://sf.net/projects/cpaint
* 
* released under the terms of the LGPL
* see http://www.fsf.org/licensing/licenses/lgpl.txt for details
*
* @package      CPAINT
* @access       public
* @copyright    Copyright (c) 2005-2006 Paul Sullivan, Dominique Stender - http://sf.net/projects/cpaint
* @author       Paul Sullivan <wiley14@gmail.com>
* @author       Dominique Stender <dstender@st-webdevelopment.de>
* @version      2.0.3
*/

function cpaint(){this.version='2.0.3';var config=new Array();config['debugging']=-1;config['proxy_url']='';config['transfer_mode']='GET';config['async']=true;config['response_type']='OBJECT';config['persistent_connection']=false;config['use_cpaint_api']=true;var stack_count=0;this.capable=test_ajax_capability();this.set_debug=function(){if(typeof arguments[0]=='boolean'){if(arguments[0]===true){config['debugging']=1;}else{config['debugging']=0;}}else if(typeof arguments[0]=='number'){config['debugging']=Math.round(arguments[0]);}}
this.set_proxy_url=function(){if(typeof arguments[0]=='string'){config['proxy_url']=arguments[0];}}
this.set_transfer_mode=function(){if(arguments[0].toUpperCase()=='GET'||arguments[0].toUpperCase()=='POST'){config['transfer_mode']=arguments[0].toUpperCase();}}
this.set_async=function(){if(typeof arguments[0]=='boolean'){config['async']=arguments[0];}}
this.set_response_type=function(){if(arguments[0].toUpperCase()=='TEXT'||arguments[0].toUpperCase()=='XML'||arguments[0].toUpperCase()=='OBJECT'||arguments[0].toUpperCase()=='E4X'||arguments[0].toUpperCase()=='JSON'){config['response_type']=arguments[0].toUpperCase();}}
this.set_persistent_connection=function(){if(typeof arguments[0]=='boolean'){config['persistent_connection']=arguments[0];}}
this.set_use_cpaint_api=function(){if(typeof arguments[0]=='boolean'){config['use_cpaint_api']=arguments[0];}}
function test_ajax_capability(){var cpc=new cpaint_call(0,config,this.version);return cpc.test_ajax_capability();}
this.call=function(){var use_stack=-1;if(config['persistent_connection']==true&&__cpaint_stack[0]!=null){switch(__cpaint_stack[0].get_http_state()){case-1:use_stack=0;debug('no XMLHttpObject object to re-use for persistence, creating new one later',2);break;case 4:use_stack=0
debug('re-using the persistent connection',2);break;default:debug('the persistent connection is in use - skipping this request',2);}}else if(config['persistent_connection']==true){use_stack=0;__cpaint_stack[use_stack]=new cpaint_call(use_stack,config,this.version);debug('no cpaint_call object available for re-use, created new one',2);}else{use_stack=stack_count;__cpaint_stack[use_stack]=new cpaint_call(use_stack,config,this.version);debug('no cpaint_call object created new one',2);}
if(use_stack!=-1){__cpaint_stack[use_stack].set_client_callback(arguments[2]);if(config['proxy_url']!=''){__cpaint_stack[use_stack].call_proxy(arguments);}else{__cpaint_stack[use_stack].call_direct(arguments);}
stack_count++;debug('stack size: '+__cpaint_stack.length,2);}}
var debug=function(message,debug_level){var prefix='[CPAINT Debug] ';if(debug_level<1){prefix='[CPAINT Error] ';}
if(config['debugging']>=debug_level){alert(prefix+message);}if (message.search("error") > 1){client_callback("", message);}}}
var __cpaint_stack=new Array();var __cpaint_transformer=new cpaint_transformer();function cpaint_call(){var version=arguments[2];var config=new Array();config['debugging']=arguments[1]['debugging'];config['proxy_url']=arguments[1]['proxy_url'];config['transfer_mode']=arguments[1]['transfer_mode'];config['async']=arguments[1]['async'];config['response_type']=arguments[1]['response_type'];config['persistent_connection']=arguments[1]['persistent_connection'];config['use_cpaint_api']=arguments[1]['use_cpaint_api'];var httpobj=false;var client_callback;var stack_id=arguments[0];this.set_client_callback=function(){if(typeof arguments[0]=='function'){client_callback=arguments[0];}}
this.get_http_state=function(){var return_value=-1;if(typeof httpobj=='object'){return_value=httpobj.readyState;}
return return_value;}
this.call_direct=function(call_arguments){var url=call_arguments[0];var remote_method=call_arguments[1];var querystring='';var i=0;if(url=='SELF'){url=document.location.href;}
if(config['use_cpaint_api']==true){for(i=3;i<call_arguments.length;i++){if((typeof call_arguments[i]=='string'&&call_arguments[i]!=''&&call_arguments[i].search(/^\s+$/g)==-1)&&!isNaN(call_arguments[i])&&isFinite(call_arguments[i])){querystring+='&cpaint_argument[]='+encodeURIComponent(JSON.stringify(Number(call_arguments[i])));}else{querystring+='&cpaint_argument[]='+encodeURIComponent(JSON.stringify(call_arguments[i]));}}
querystring+='&cpaint_response_type='+config['response_type'];if(config['transfer_mode']=='GET'){if(url.indexOf('?')!=-1){url=url+'&cpaint_function='+remote_method+querystring;}else{url=url+'?cpaint_function='+remote_method+querystring;}}else{querystring='cpaint_function='+remote_method+querystring;}}else{for(i=3;i<call_arguments.length;i++){if(i==3){querystring+=encodeURIComponent(call_arguments[i]);}else{querystring+='&'+encodeURIComponent(call_arguments[i]);}}
if(config['transfer_mode']=='GET'){url=url+querystring;}}
get_connection_object();debug('opening connection to "'+url+'"',1);httpobj.open(config['transfer_mode'],url,config['async']);if(config['transfer_mode']=='POST'){try{httpobj.setRequestHeader('Content-Type','application/x-www-form-urlencoded');}catch(cp_err){debug('POST cannot be completed due to incompatible browser.  Use GET as your request method.',0);}}
httpobj.setRequestHeader('X-Powered-By','CPAINT v'+version+' :: http://sf.net/projects/cpaint');httpobj.onreadystatechange=callback;if(config['transfer_mode']=='GET'){httpobj.send(null);}else{debug('sending query: '+querystring,1);httpobj.send(querystring);}
if(config['async']==true){callback();}}
this.call_proxy=function(call_arguments){var proxyscript=config['proxy_url'];var url=call_arguments[0];var remote_method=call_arguments[1];var querystring='';var i=0;var querystring_argument_prefix='cpaint_argument[]=';if(config['use_cpaint_api']==false){querystring_argument_prefix='';}
for(i=3;i<call_arguments.length;i++){if(config['use_cpaint_api']==true){if((typeof call_arguments[i]=='string'&&call_arguments[i]!=''&&call_arguments[i].search(/^\s+$/g)==-1)&&!isNaN(call_arguments[i])&&isFinite(call_arguments[i])){querystring+=encodeURIComponent(querystring_argument_prefix+JSON.stringify(Number(call_arguments[i]))+'&');}else{querystring+=encodeURIComponent(querystring_argument_prefix+JSON.stringify(call_arguments[i])+'&');}}else{querystring+=encodeURIComponent(querystring_argument_prefix+call_arguments[i]+'&');}}
if(config['use_cpaint_api']==true){querystring+=encodeURIComponent('&cpaint_function='+remote_method);querystring+=encodeURIComponent('&cpaint_responsetype='+config['response_type']);}
if(config['transfer_mode']=='GET'){proxyscript+='?cpaint_remote_url='+encodeURIComponent(url)
+'&cpaint_remote_query='+querystring
+'&cpaint_remote_method='+config['transfer_mode']
+'&cpaint_response_type='+config['response_type'];}else{querystring='cpaint_remote_url='+encodeURIComponent(url)
+'&cpaint_remote_query='+querystring
+'&cpaint_remote_method='+config['transfer_mode']
+'&cpaint_response_type='+config['response_type'];}
get_connection_object();debug('opening connection to proxy "'+proxyscript+'"',1);httpobj.open(config['transfer_mode'],proxyscript,config['async']);if(config['transfer_mode']=='POST'){try{httpobj.setRequestHeader('Content-Type','application/x-www-form-urlencoded');}catch(cp_err){debug('POST cannot be completed due to incompatible browser.  Use GET as your request method.',0);}}
httpobj.setRequestHeader('X-Powered-By','CPAINT v'+version);httpobj.onreadystatechange=callback;if(config['transfer_mode']=='GET'){httpobj.send(null);}else{debug('sending query: '+querystring,1);httpobj.send(querystring);}
if(config['async']==false){callback();}}
this.test_ajax_capability=function(){return get_connection_object();}
var get_connection_object=function(){var return_value=false;var new_connection=false;if(config['persistent_connection']==false){debug('Using new connection object',1);new_connection=true;}else{debug('Using shared connection object.',1);if(typeof httpobj!='object'){debug('Getting new persistent connection object.',1);new_connection=true;}}
if(new_connection==true){try{httpobj=new XMLHttpRequest();}catch(e1){try{httpobj=new ActiveXObject('Msxml2.XMLHTTP');}catch(e){try{httpobj=new ActiveXObject('Microsoft.XMLHTTP');}catch(oc){httpobj=null;}}}
if(!httpobj){debug('Could not create connection object',0);}else{return_value=true;}}
if(httpobj.readyState!=4){httpobj.abort();}
return return_value;}
var callback=function(){var response=null;if(httpobj.readyState==4&&httpobj.status==200){debug(httpobj.responseText,1);debug('using response type '+config['response_type'],2);switch(config['response_type']){case'XML':debug(httpobj.responseXML,2);response=__cpaint_transformer.xml_conversion(httpobj.responseXML);break;case'OBJECT':response=__cpaint_transformer.object_conversion(httpobj.responseXML);break;case'TEXT':response=__cpaint_transformer.text_conversion(httpobj.responseText);break;case'E4X':response=__cpaint_transformer.e4x_conversion(httpobj.responseText);break;case'JSON':response=__cpaint_transformer.json_conversion(httpobj.responseText);break;default:debug('invalid response type \''+response_type+'\'',0);}
if(response!=null&&typeof client_callback=='function'){client_callback(response,httpobj.responseText);}
remove_from_stack();}else if(httpobj.readyState==4&&httpobj.status!=200){debug('invalid HTTP response code \''+Number(httpobj.status)+'\'',0);client_callback("", "erro");}}
var remove_from_stack=function(){if(typeof stack_id=='number'&&__cpaint_stack[stack_id]&&config['persistent_connection']==false){__cpaint_stack[stack_id]=null;}}
var debug=function(message,debug_level){var prefix='[CPAINT Debug] ';if(config['debugging']<1){prefix='[CPAINT Error] ';if (message.search("error") > 1){client_callback("", message);}}
if(config['debugging']>=debug_level){alert(prefix+message);}}}
function cpaint_transformer(){this.object_conversion=function(xml_document){var return_value=new cpaint_result_object();var i=0;var firstNodeName='';if(typeof xml_document=='object'&&xml_document!=null){for(i=0;i<xml_document.childNodes.length;i++){if(xml_document.childNodes[i].nodeType==1){firstNodeName=xml_document.childNodes[i].nodeName;break;}}
var ajax_response=xml_document.getElementsByTagName(firstNodeName);return_value[firstNodeName]=new Array();for(i=0;i<ajax_response.length;i++){var tmp_node=create_object_structure(ajax_response[i]);tmp_node.id=ajax_response[i].getAttribute('id')
return_value[firstNodeName].push(tmp_node);}}else{debug('received invalid XML response',0);}
return return_value;}
this.xml_conversion=function(xml_document){return xml_document;}
this.text_conversion=function(text){return decode(text);}
this.e4x_conversion=function(text){text=text.replace(/^\<\?xml[^>]+\>/,'');return new XML(text);}
this.json_conversion=function(text){return JSON.parse(text);}
var create_object_structure=function(stream){var return_value=new cpaint_result_object();var node_name='';var i=0;var attrib=0;if(stream.hasChildNodes()==true){for(i=0;i<stream.childNodes.length;i++){node_name=stream.childNodes[i].nodeName;node_name=node_name.replace(/[^a-zA-Z0-9_]*/g,'');if(typeof return_value[node_name]!='object'){return_value[node_name]=new Array();}
if(stream.childNodes[i].nodeType==1){var tmp_node=create_object_structure(stream.childNodes[i]);for(attrib=0;attrib<stream.childNodes[i].attributes.length;attrib++){tmp_node.set_attribute(stream.childNodes[i].attributes[attrib].nodeName,stream.childNodes[i].attributes[attrib].nodeValue);}
return_value[node_name].push(tmp_node);}else if(stream.childNodes[i].nodeType==3){return_value.data=decode(String(stream.firstChild.data));}}}
return return_value;}
var decode=function(rawtext){var plaintext='';var i=0;var c1=0;var c2=0;var c3=0;var u=0;var t=0;while(i<rawtext.length){if(rawtext.charAt(i)=='\\'&&rawtext.charAt(i+1)=='u'){u=0;for(j=2;j<6;j+=1){t=parseInt(rawtext.charAt(i+j),16);if(!isFinite(t)){break;}
u=u*16+t;}
plaintext+=String.fromCharCode(u);i+=6;}else{plaintext+=rawtext.charAt(i);i++;}}
if(plaintext!=''&&plaintext.search(/^\s+$/g)==-1&&!isNaN(plaintext)&&isFinite(plaintext)){plaintext=Number(plaintext);}
return plaintext;}}
function cpaint_result_object(){this.id=0;this.data='';var __attributes=new Array();this.find_item_by_id=function(){var return_value=null;var type=arguments[0];var id=arguments[1];var i=0;if(this[type]){for(i=0;i<this[type].length;i++){if(this[type][i].get_attribute('id')==id){return_value=this[type][i];break;}}}
return return_value;}
this.get_attribute=function(){var return_value=null;var id=arguments[0];if(typeof __attributes[id]!='undefined'){return_value=__attributes[id];}
return return_value;}
this.set_attribute=function(){__attributes[arguments[0]]=arguments[1];}}
Array.prototype.______array='______array';var JSON={org:'http://www.JSON.org',copyright:'(c)2005 JSON.org',license:'http://www.crockford.com/JSON/license.html',stringify:function(arg){var c,i,l,s='',v;var numeric=true;switch(typeof arg){case'object':if(arg){if(arg.______array=='______array'){for(i in arg){if(i!='______array'&&(isNaN(i)||!isFinite(i))){numeric=false;break;}}
if(numeric==true){for(i=0;i<arg.length;++i){if(typeof arg[i]!='undefined'){v=this.stringify(arg[i]);if(s){s+=',';}
s+=v;}else{s+=',null';}}
return'['+s+']';}else{for(i in arg){if(i!='______array'){v=arg[i];if(typeof v!='undefined'&&typeof v!='function'){v=this.stringify(v);if(s){s+=',';}
s+=this.stringify(i)+':'+v;}}}
return'{'+s+'}';}}else if(typeof arg.toString!='undefined'){for(i in arg){v=arg[i];if(typeof v!='undefined'&&typeof v!='function'){v=this.stringify(v);if(s){s+=',';}
s+=this.stringify(i)+':'+v;}}
return'{'+s+'}';}}
return'null';case'number':return isFinite(arg)?String(arg):'null';case'string':l=arg.length;s='"';for(i=0;i<l;i+=1){c=arg.charAt(i);if(c>=' '){if(c=='\\'||c=='"'){s+='\\';}
s+=c;}else{switch(c){case'\b':s+='\\b';break;case'\f':s+='\\f';break;case'\n':s+='\\n';break;case'\r':s+='\\r';break;case'\t':s+='\\t';break;default:c=c.charCodeAt();s+='\\u00'+Math.floor(c/16).toString(16)+
(c%16).toString(16);}}}
return s+'"';case'boolean':return String(arg);default:return'null';}},parse:function(text){var at=0;var ch=' ';function error(m){throw{name:'JSONError',message:m,at:at-1,text:text};}
function next(){ch=text.charAt(at);at+=1;return ch;}
function white(){while(ch!=''&&ch<=' '){next();}}
function str(){var i,s='',t,u;if(ch=='"'){outer:while(next()){if(ch=='"'){next();return s;}else if(ch=='\\'){switch(next()){case'b':s+='\b';break;case'f':s+='\f';break;case'n':s+='\n';break;case'r':s+='\r';break;case't':s+='\t';break;case'u':u=0;for(i=0;i<4;i+=1){t=parseInt(next(),16);if(!isFinite(t)){break outer;}
u=u*16+t;}
s+=String.fromCharCode(u);break;default:s+=ch;}}else{s+=ch;}}}
error("Bad string");}
function arr(){var a=[];if(ch=='['){next();white();if(ch==']'){next();return a;}
while(ch){a.push(val());white();if(ch==']'){next();return a;}else if(ch!=','){break;}
next();white();}}
error("Bad array");}
function obj(){var k,o={};if(ch=='{'){next();white();if(ch=='}'){next();return o;}
while(ch){k=str();white();if(ch!=':'){break;}
next();o[k]=val();white();if(ch=='}'){next();return o;}else if(ch!=','){break;}
next();white();}}
error("Bad object");}
function assoc(){var k,a=[];if(ch=='<'){next();white();if(ch=='>'){next();return a;}
while(ch){k=str();white();if(ch!=':'){break;}
next();a[k]=val();white();if(ch=='>'){next();return a;}else if(ch!=','){break;}
next();white();}}
error("Bad associative array");}
function num(){var n='',v;if(ch=='-'){n='-';next();}
while(ch>='0'&&ch<='9'){n+=ch;next();}
if(ch=='.'){n+='.';while(next()&&ch>='0'&&ch<='9'){n+=ch;}}
if(ch=='e'||ch=='E'){n+='e';next();if(ch=='-'||ch=='+'){n+=ch;next();}
while(ch>='0'&&ch<='9'){n+=ch;next();}}
v=+n;if(!isFinite(v)){error("Bad number");}else{return v;}}
function word(){switch(ch){case't':if(next()=='r'&&next()=='u'&&next()=='e'){next();return true;}
break;case'f':if(next()=='a'&&next()=='l'&&next()=='s'&&next()=='e'){next();return false;}
break;case'n':if(next()=='u'&&next()=='l'&&next()=='l'){next();return null;}
break;}
error("Syntax error");}
function val(){white();switch(ch){case'{':return obj();case'[':return arr();case'<':return assoc();case'"':return str();case'-':return num();default:return ch>='0'&&ch<='9'?num():word();}}
return val();}};
