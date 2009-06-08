<?php if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>$i = function(id){return document.getElementById(id);}
 g_sid="";try{ g_sid=window.parent.i3GEO.configura.sid; g_locaplic=window.parent.i3GEO.configura.locaplic;}
catch(e){}
$i=function(id){return document.getElementById(id);}
cabecalhojanela="";var h=0;try{ if(window.parent.document.getElementById("wdocai")){var h=parseInt(window.parent.document.getElementById("wdocai").style.height);}}
catch(e){}
navm=false;navn=false;var app=navigator.appName.substring(0,1);if(app=='N')navn=true;else navm=true;if(!$i("mascaraaguarde")){ if(navm){var s="filter:'alpha(opacity=20)'";}
 if(navn){var s="opacity:.2";}
 var ins="<div id=mascaraaguarde style=color:red;display:none;position:absolute;top:0px;left:0px;width:120%;height:"+h+"px;background-color:gray;border-size:0px;z-index:6000;"+s+" >"; ins+="&nbsp;</div>"; document.body.innerHTML+=ins }
if(navn){ if(document.getElementById("fundo")){ document.getElementById("fundo").style.width="100%"; document.getElementById("fundo").style.height="100%";}
 if(document.getElementById("geral")){ document.getElementById("geral").style.height="90%"; document.getElementById("geral").style.width="97%";}}
else{ if(document.getElementById("fundo")){ document.getElementById("fundo").style.width="104%"; document.getElementById("fundo").style.height="99%";}
 if(document.getElementById("geral")){ document.getElementById("geral").style.height="95%"; document.getElementById("geral").style.width="100%";}}
document.body.style.backgroundColor="#F0F0F0";$tradAjuda=function(tipo,id){ eval("var t=g_traducao_ajuda."+tipo); eval("var texto=t[id]."+window.parent.i3GEO.idioma.ATUAL); return(texto);}; imagemAguardeCabecalho=false;function aguarde(tipo){ try{ if(!imagemAguardeCabecalho){ var fs=window.parent.document.getElementsByTagName("iframe"); var nfs=fs.length; for(i=0;i<nfs;i++){ if(fs[i].src==window.location.href){ imagemAguardeCabecalho=fs[i].parentNode.parentNode.id; imagemAguardeCabecalho=window.parent.document.getElementById(imagemAguardeCabecalho+"_imagemCabecalho");}}}}
 catch(e){}
 if(tipo=="block"){ $i("mascaraaguarde").style.display="block"; if(imagemAguardeCabecalho) imagemAguardeCabecalho.style.visibility="visible";}
 if(tipo=="none"){ if($i("mascaraaguarde")){$i("mascaraaguarde").style.display="none";}
 if(imagemAguardeCabecalho) imagemAguardeCabecalho.style.visibility="hidden";}
 if(document.getElementById("aguarde")){document.getElementById("aguarde").style.display="none";}}function aguardeTotal(tipo){ var w=parseInt(screen.availWidth); var h=parseInt(screen.availHeight); if(!document.getElementById("aguardeTotal")){ var novoel=document.createElement("div"); novoel.style.width=w+"px"; novoel.style.height=h+"px"; novoel.id="aguardeTotal"; novoel.display="none"; novoel.style.zIndex=10000; novoel.style.position="absolute"; novoel.style.top=0; novoel.style.left=0; novoel.style.backgroundColor="gray"; if(navn){novoel.style.opacity=0.45;}
 else{novoel.style.filter='alpha(opacity=45)';}
 if(!g_locaplic){g_locaplic="..";}
 var i="<div id=aguardeTotal1 style='display:none;padding:5px;border:1px solid black;text-align:center;background-color:white;position:absolute;z-index:10001;left:"+w/2+"px;top:"+((h/2)-200)+"px;'><img src='"+g_locaplic+"/imagens/aguarde.gif'/><span style=color:red >&nbsp;<b>Aguarde...</b></span></div>"; document.body.appendChild(novoel); document.body.innerHTML+=i;}
 document.getElementById("aguardeTotal").style.display=tipo; document.getElementById("aguardeTotal1").style.display=tipo;}function cor(obj){window.parent.i3GEO.util.abreCor("wdocai",obj);} function mostraOpcao(anterior,proxima,texto,idatual){ if(document.getElementById(idatual)){document.getElementById("resultado").removeChild(document.getElementById(idatual))}
 if(!document.getElementById(idatual)){ var ndiv=document.createElement("div"); ndiv.id=idatual; texto+="<br><br><table style='width:100%;background-color:#F2F2F2;' ><tr style='width:100%'>"; if(anterior !=""){texto+="<td style='border:0px solid white;text-align:left;cursor:pointer;background-color:#F2F2F2;'><img onclick='"+anterior+"' src=../../imagens/anterior.gif ></td>";}
 if(proxima !=""){texto+="<td style='border:0px solid white;text-align:right;cursor:pointer;background-color:#F2F2F2;'><img onclick='javascript:this.src=\"../../imagens/aguarde.gif\";"+proxima+"' src=../../imagens/proxima.gif ></td>";}
 ndiv.innerHTML=texto+"</tr></table>"; document.getElementById("resultado").appendChild(ndiv);}
 var ids=new Array("t0","t1","t2","t3","t4","t5","t6","t7"); for(i=0;i<ids.length;i++){ if(document.getElementById(ids[i])){document.getElementById(ids[i]).style.display="none";}}
 document.getElementById(idatual).style.display="block";}function simnao(id){ var combo="<select name="+id+" id="+id+" >"; combo+="<option value=TRUE selected>sim</option>"; combo+="<option value=FALSE >não</option>"; combo+="</select>"; return(combo);}function naosim(id){ var combo="<select name="+id+" id="+id+" >"; combo+="<option value=TRUE >sim</option>"; combo+="<option value=FALSE selected >não</option>"; combo+="</select>"; return(combo);}function combocor(id,def,s){ var combo="<select name="+id+" id="+id+" >"; if(def==0){s='selected';}
 combo+='<option value="0" '+s+' >branco</option>'; s=""; combo+='<option value="2">vermelho</option>'; combo+='<option value="7">amarelo</option>'; if(def==1){s='selected'}; combo+='<option value="1" '+s+' >preto</option>'; combo+='<option value="rgb(1,1,0.8)">bege</option>'; combo+='<option value="3">verde</option>'; combo+='<option value="8">cinza</option>'; combo+='<option value="4">azul</option>'; combo+='<option value="5">ciano</option>'; combo+='<option value="6">magenta</option>'; combo+="</select>"; return(combo);}  function comboitens(id,tema,funcao,onde,nome){ if(arguments.length > 3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando itens...</span>"; if(arguments.length !=5){nome="";}
 var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<select id='"+id+"' name='"+nome+"'>"); ins.push("<option value='' >---</option>"); for(i=0;i<retorno.data.valores.length;i++){ if(retorno.data.valores[i].tema==tema){ins.push("<option value='"+retorno.data.valores[i].item+"' >"+retorno.data.valores[i].item+"</option>");}}
 ins.push("</select>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{ var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);}  function checkitensf(tema,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando itens...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<table class=lista >"); for(i=0;i<retorno.data.valores.length;i++){ ins.push("<tr><td><input size=2 style='cursor:pointer' name='"+retorno.data.valores[i].tema+"' type=checkbox id='"+retorno.data.valores[i].item+"'/></td>"); ins.push("<td>"+retorno.data.valores[i].item+"-"+retorno.data.valores[i].nome+"</td></tr>");}
 ins.push("</table>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{ var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);}  function checkitenseditaveis(tema,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando itens...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<table class=lista >"); for(i=0;i<retorno.data.valores.length;i++){ ins.push("<tr><td><input size=2 style='cursor:pointer' name='"+retorno.data.valores[i].tema+"' type=checkbox id='"+retorno.data.valores[i].item+"'/></td>"); ins.push("<td><input id='"+retorno.data.valores[i].item+retorno.data.valores[i].tema+"' type=text size=25 value='"+retorno.data.valores[i].item+"-"+retorno.data.valores[i].nome+"'/></td></tr>");}
 ins.push("</table>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{ var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);}
 function radioitensf(tema,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando itens...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<table class=lista >"); for(i=0;i<retorno.data.valores.length;i++){ ins.push("<tr><td><input size=2 style='cursor:pointer' name='itensradio' type=radio id='"+retorno.data.valores[i].item+";"+retorno.data.valores[i].tema+"'/></td>"); ins.push("<td>"+retorno.data.valores[i].item+"-"+retorno.data.valores[i].nome+"</td></tr>");}
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
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemascomsel","listaTemasComSel",monta);}   function comboTemasLigados(id,funcao,onde,nome,multiplo){ if(arguments.length > 2) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; if(arguments.length==3){nome="";}
 if(arguments.length < 5){multiplo=false;}
 var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ if(multiplo) comboTemas="<select id='"+id+"' size='4' multiple='multiple' name='"+nome+"'>"; else comboTemas="<select id='"+id+"' name='"+nome+"'>"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:comboTemas,tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema está ligado.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemas&opcao=ligados","listaTemas",monta);}   function comboTemasLocais(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas locais...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:comboTemas,tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema local dispon&iacute;vel.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemaslocais","listaTemasLocais",monta);}function comboTemasPt(id,funcao,onde,selecao){ if(arguments.length==3){ $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var selecao="nao";}
 if(arguments.length==2){var selecao="nao";}
 var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
 comboTemas+="</select>"; var temp={dados:comboTemas,tipo:"dados"};}
 else{var temp={dados:'<div class=alerta >Nenhum tema de pontos dispon&iacute;vel.</div>',tipo:"mensagem"};}}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=ponto&selecao="+selecao,"listaTemasTipo",monta);}function comboTemasPol(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
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
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatruetype","listaTrueType",monta);}function radioepsg(funcao,onde){ if(arguments.length==2) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<table class=lista >"); ins.push("<tr><td><input size=2 style='cursor:pointer' name='epsg' type=radio checked value=''/></td>"); ins.push("<td>"+retorno.data[0].nome+"</td></tr>"); for(i=1;i<retorno.data.length;i++){ ins.push("<tr><td><input size=2 style='cursor:pointer' name='epsg' type=radio value='"+retorno.data[i].codigo+"'/></td>"); ins.push("<td>"+retorno.data[i].nome+"</td></tr>");}
 ins.push("</table>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{var temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaEpsg","listaEpsg",monta);}
 function removeAcentos(palavra){ var re=/ã|á|à|â/gi; palavra=palavra.replace(re,"a"); var re=/é/gi; palavra=palavra.replace(re,"e"); var re=/í/gi; palavra=palavra.replace(re,"i"); var re=/ó|õ/gi; palavra=palavra.replace(re,"o"); var re=/ç/gi; palavra=palavra.replace(re,"c"); var re=/ú/gi; palavra=palavra.replace(re,"u"); return(palavra);}function htmlAcentos(palavra){ var re=/ã/gi; palavra=palavra.replace(re,"*atilde|"); var re=/á/gi; palavra=palavra.replace(re,"*aacute|"); var re=/â/gi; palavra=palavra.replace(re,"*acirc|"); var re=/õ/gi; palavra=palavra.replace(re,"*otilde|"); var re=/ó/gi; palavra=palavra.replace(re,"*oacute|"); var re=/ô/gi; palavra=palavra.replace(re,"*ocirc|"); var re=/é/gi; palavra=palavra.replace(re,"*eacute|"); var re=/ê/gi; palavra=palavra.replace(re,"*ecirc|"); var re=/í/gi; palavra=palavra.replace(re,"*iacute|"); var re=/ú/gi; palavra=palavra.replace(re,"*uacute|"); var re=/ç/gi; palavra=palavra.replace(re,"*ccedil|"); var re=/Ã/gi; palavra=palavra.replace(re,"*Atilde|"); var re=/Á/gi; palavra=palavra.replace(re,"*Aacute|"); var re=/Â/gi; palavra=palavra.replace(re,"*Acirc|"); var re=/Õ/gi; palavra=palavra.replace(re,"*otilde|"); var re=/Ó/gi; palavra=palavra.replace(re,"*Oacute|"); var re=/Ô/gi; palavra=palavra.replace(re,"*Ocirc|"); var re=/É/gi; palavra=palavra.replace(re,"*Eacute|"); var re=/Ê/gi; palavra=palavra.replace(re,"*Ecirc|"); var re=/Í/gi; palavra=palavra.replace(re,"*Iacute|"); var re=/Ú/gi; palavra=palavra.replace(re,"*Uacute|"); var re=/Ç/gi; palavra=palavra.replace(re,"*Ccedil|"); return(palavra);}function randomRGB(){ var v=Math.random(); var r=parseInt(255*v); var v=Math.random(); var g=parseInt(255*v); var v=Math.random(); var b=parseInt(255*v); return(r+","+g+","+b);}function parametrosURL(){ try{ if(!window.parent.i3GEO){g_locaplic="../..";}
 else{ if(window.parent.i3GEO.configura) g_locaplic=window.parent.i3GEO.configura.locaplic; if(window.parent.i3GEO.parametros) g_r=window.parent.i3GEO.parametros.r;}
 var temp=(window.location.href).split("tema="); if(temp[1]){tema=(temp[1].split("&"))[0];}}catch(e){}}function zoomf(ext){ window.parent.objaguarde.abre("i3GEO.atualiza",window.parent.$trad("o1")); var p=g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=mudaext&ext="+ext; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"mudaExtensao",window.parent.remapaf);}function pinf(ext){ window.parent.objaguarde.abre("i3GEO.atualiza",window.parent.$trad("o1")); valores=ext.split(" "); vx=(valores[0]*1)+((((valores[0]*-1)-(valores[2]*-1))/2)*1); vy=(valores[1]*1)+((((valores[1]*-1)-(valores[3]*-1))/2)*1); var p=g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=zoomponto&pin=pin&xy="+vx+" "+vy; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"zoomPonto",window.parent.i3GEO.atualiza);}
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
 if($i(guia+"obj")){$i(guia+"obj").style.display="block";}}
function protocolo(){ var u=window.location.href; var u=u.split(":"); return(u[0]);}

/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.2
*/
if(typeof YAHOO=="undefined"||!YAHOO){var YAHOO={};}YAHOO.namespace=function(){var A=arguments,E=null,C,B,D;for(C=0;C<A.length;C=C+1){D=A[C].split(".");E=YAHOO;for(B=(D[0]=="YAHOO")?1:0;B<D.length;B=B+1){E[D[B]]=E[D[B]]||{};E=E[D[B]];}}return E;};YAHOO.log=function(D,A,C){var B=YAHOO.widget.Logger;if(B&&B.log){return B.log(D,A,C);}else{return false;}};YAHOO.register=function(A,E,D){var I=YAHOO.env.modules;if(!I[A]){I[A]={versions:[],builds:[]};}var B=I[A],H=D.version,G=D.build,F=YAHOO.env.listeners;B.name=A;B.version=H;B.build=G;B.versions.push(H);B.builds.push(G);B.mainClass=E;for(var C=0;C<F.length;C=C+1){F[C](B);}if(E){E.VERSION=H;E.BUILD=G;}else{YAHOO.log("mainClass is undefined for module "+A,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[]};YAHOO.env.getVersion=function(A){return YAHOO.env.modules[A]||null;};YAHOO.env.ua=function(){var C={ie:0,opera:0,gecko:0,webkit:0,mobile:null,air:0};var B=navigator.userAgent,A;if((/KHTML/).test(B)){C.webkit=1;}A=B.match(/AppleWebKit\/([^\s]*)/);if(A&&A[1]){C.webkit=parseFloat(A[1]);if(/ Mobile\//.test(B)){C.mobile="Apple";}else{A=B.match(/NokiaN[^\/]*/);if(A){C.mobile=A[0];}}A=B.match(/AdobeAIR\/([^\s]*)/);if(A){C.air=A[0];}}if(!C.webkit){A=B.match(/Opera[\s\/]([^\s]*)/);if(A&&A[1]){C.opera=parseFloat(A[1]);A=B.match(/Opera Mini[^;]*/);if(A){C.mobile=A[0];}}else{A=B.match(/MSIE\s([^;]*)/);if(A&&A[1]){C.ie=parseFloat(A[1]);}else{A=B.match(/Gecko\/([^\s]*)/);if(A){C.gecko=1;A=B.match(/rv:([^\s\)]*)/);if(A&&A[1]){C.gecko=parseFloat(A[1]);}}}}}return C;}();(function(){YAHOO.namespace("util","widget","example");if("undefined"!==typeof YAHOO_config){var B=YAHOO_config.listener,A=YAHOO.env.listeners,D=true,C;if(B){for(C=0;C<A.length;C=C+1){if(A[C]==B){D=false;break;}}if(D){A.push(B);}}}})();YAHOO.lang=YAHOO.lang||{};(function(){var A=YAHOO.lang,C=["toString","valueOf"],B={isArray:function(D){if(D){return A.isNumber(D.length)&&A.isFunction(D.splice);}return false;},isBoolean:function(D){return typeof D==="boolean";},isFunction:function(D){return typeof D==="function";},isNull:function(D){return D===null;},isNumber:function(D){return typeof D==="number"&&isFinite(D);},isObject:function(D){return(D&&(typeof D==="object"||A.isFunction(D)))||false;},isString:function(D){return typeof D==="string";},isUndefined:function(D){return typeof D==="undefined";},_IEEnumFix:(YAHOO.env.ua.ie)?function(F,E){for(var D=0;D<C.length;D=D+1){var H=C[D],G=E[H];if(A.isFunction(G)&&G!=Object.prototype[H]){F[H]=G;}}}:function(){},extend:function(H,I,G){if(!I||!H){throw new Error("extend failed, please check that "+"all dependencies are included.");}var E=function(){};E.prototype=I.prototype;H.prototype=new E();H.prototype.constructor=H;H.superclass=I.prototype;if(I.prototype.constructor==Object.prototype.constructor){I.prototype.constructor=I;}if(G){for(var D in G){if(A.hasOwnProperty(G,D)){H.prototype[D]=G[D];}}A._IEEnumFix(H.prototype,G);}},augmentObject:function(H,G){if(!G||!H){throw new Error("Absorb failed, verify dependencies.");}var D=arguments,F,I,E=D[2];if(E&&E!==true){for(F=2;F<D.length;F=F+1){H[D[F]]=G[D[F]];}}else{for(I in G){if(E||!(I in H)){H[I]=G[I];}}A._IEEnumFix(H,G);}},augmentProto:function(G,F){if(!F||!G){throw new Error("Augment failed, verify dependencies.");}var D=[G.prototype,F.prototype];for(var E=2;E<arguments.length;E=E+1){D.push(arguments[E]);}A.augmentObject.apply(this,D);},dump:function(D,I){var F,H,K=[],L="{...}",E="f(){...}",J=", ",G=" => ";if(!A.isObject(D)){return D+"";}else{if(D instanceof Date||("nodeType" in D&&"tagName" in D)){return D;}else{if(A.isFunction(D)){return E;}}}I=(A.isNumber(I))?I:3;if(A.isArray(D)){K.push("[");for(F=0,H=D.length;F<H;F=F+1){if(A.isObject(D[F])){K.push((I>0)?A.dump(D[F],I-1):L);}else{K.push(D[F]);}K.push(J);}if(K.length>1){K.pop();}K.push("]");}else{K.push("{");for(F in D){if(A.hasOwnProperty(D,F)){K.push(F+G);if(A.isObject(D[F])){K.push((I>0)?A.dump(D[F],I-1):L);}else{K.push(D[F]);}K.push(J);}}if(K.length>1){K.pop();}K.push("}");}return K.join("");},substitute:function(S,E,L){var I,H,G,O,P,R,N=[],F,J="dump",M=" ",D="{",Q="}";for(;;){I=S.lastIndexOf(D);if(I<0){break;}H=S.indexOf(Q,I);if(I+1>=H){break;}F=S.substring(I+1,H);O=F;R=null;G=O.indexOf(M);if(G>-1){R=O.substring(G+1);O=O.substring(0,G);}P=E[O];if(L){P=L(O,P,R);}if(A.isObject(P)){if(A.isArray(P)){P=A.dump(P,parseInt(R,10));}else{R=R||"";var K=R.indexOf(J);if(K>-1){R=R.substring(4);}if(P.toString===Object.prototype.toString||K>-1){P=A.dump(P,parseInt(R,10));}else{P=P.toString();}}}else{if(!A.isString(P)&&!A.isNumber(P)){P="~-"+N.length+"-~";N[N.length]=F;}}S=S.substring(0,I)+P+S.substring(H+1);}for(I=N.length-1;I>=0;I=I-1){S=S.replace(new RegExp("~-"+I+"-~"),"{"+N[I]+"}","g");}return S;},trim:function(D){try{return D.replace(/^\s+|\s+$/g,"");}catch(E){return D;}},merge:function(){var G={},E=arguments;for(var F=0,D=E.length;F<D;F=F+1){A.augmentObject(G,E[F],true);}return G;},later:function(K,E,L,G,H){K=K||0;E=E||{};var F=L,J=G,I,D;if(A.isString(L)){F=E[L];}if(!F){throw new TypeError("method undefined");}if(!A.isArray(J)){J=[G];}I=function(){F.apply(E,J);};D=(H)?setInterval(I,K):setTimeout(I,K);return{interval:H,cancel:function(){if(this.interval){clearInterval(D);}else{clearTimeout(D);}}};},isValue:function(D){return(A.isObject(D)||A.isString(D)||A.isNumber(D)||A.isBoolean(D));}};A.hasOwnProperty=(Object.prototype.hasOwnProperty)?function(D,E){return D&&D.hasOwnProperty(E);}:function(D,E){return !A.isUndefined(D[E])&&D.constructor.prototype[E]!==D[E];};B.augmentObject(A,B,true);YAHOO.util.Lang=A;A.augment=A.augmentProto;YAHOO.augment=A.augmentProto;YAHOO.extend=A.extend;})();YAHOO.register("yahoo",YAHOO,{version:"2.5.2",build:"1076"});(function(){var B=YAHOO.util,K,I,J={},F={},M=window.document;YAHOO.env._id_counter=YAHOO.env._id_counter||0;var C=YAHOO.env.ua.opera,L=YAHOO.env.ua.webkit,A=YAHOO.env.ua.gecko,G=YAHOO.env.ua.ie;var E={HYPHEN:/(-[a-z])/i,ROOT_TAG:/^body|html$/i,OP_SCROLL:/^(?:inline|table-row)$/i};var N=function(P){if(!E.HYPHEN.test(P)){return P;}if(J[P]){return J[P];}var Q=P;while(E.HYPHEN.exec(Q)){Q=Q.replace(RegExp.$1,RegExp.$1.substr(1).toUpperCase());}J[P]=Q;return Q;};var O=function(Q){var P=F[Q];if(!P){P=new RegExp("(?:^|\\s+)"+Q+"(?:\\s+|$)");F[Q]=P;}return P;};if(M.defaultView&&M.defaultView.getComputedStyle){K=function(P,S){var R=null;if(S=="float"){S="cssFloat";}var Q=P.ownerDocument.defaultView.getComputedStyle(P,"");if(Q){R=Q[N(S)];}return P.style[S]||R;};}else{if(M.documentElement.currentStyle&&G){K=function(P,R){switch(N(R)){case"opacity":var T=100;try{T=P.filters["DXImageTransform.Microsoft.Alpha"].opacity;}catch(S){try{T=P.filters("alpha").opacity;}catch(S){}}return T/100;case"float":R="styleFloat";default:var Q=P.currentStyle?P.currentStyle[R]:null;return(P.style[R]||Q);}};}else{K=function(P,Q){return P.style[Q];};}}if(G){I=function(P,Q,R){switch(Q){case"opacity":if(YAHOO.lang.isString(P.style.filter)){P.style.filter="alpha(opacity="+R*100+")";if(!P.currentStyle||!P.currentStyle.hasLayout){P.style.zoom=1;}}break;case"float":Q="styleFloat";default:P.style[Q]=R;}};}else{I=function(P,Q,R){if(Q=="float"){Q="cssFloat";}P.style[Q]=R;};}var D=function(P,Q){return P&&P.nodeType==1&&(!Q||Q(P));};YAHOO.util.Dom={get:function(R){if(R&&(R.nodeType||R.item)){return R;}if(YAHOO.lang.isString(R)||!R){return M.getElementById(R);}if(R.length!==undefined){var S=[];for(var Q=0,P=R.length;Q<P;++Q){S[S.length]=B.Dom.get(R[Q]);}return S;}return R;},getStyle:function(P,R){R=N(R);var Q=function(S){return K(S,R);};return B.Dom.batch(P,Q,B.Dom,true);},setStyle:function(P,R,S){R=N(R);var Q=function(T){I(T,R,S);};B.Dom.batch(P,Q,B.Dom,true);},getXY:function(P){var Q=function(R){if((R.parentNode===null||R.offsetParent===null||this.getStyle(R,"display")=="none")&&R!=R.ownerDocument.body){return false;}return H(R);};return B.Dom.batch(P,Q,B.Dom,true);},getX:function(P){var Q=function(R){return B.Dom.getXY(R)[0];};return B.Dom.batch(P,Q,B.Dom,true);},getY:function(P){var Q=function(R){return B.Dom.getXY(R)[1];};return B.Dom.batch(P,Q,B.Dom,true);},setXY:function(P,S,R){var Q=function(V){var U=this.getStyle(V,"position");if(U=="static"){this.setStyle(V,"position","relative");U="relative";}var X=this.getXY(V);if(X===false){return false;}var W=[parseInt(this.getStyle(V,"left"),10),parseInt(this.getStyle(V,"top"),10)];if(isNaN(W[0])){W[0]=(U=="relative")?0:V.offsetLeft;}if(isNaN(W[1])){W[1]=(U=="relative")?0:V.offsetTop;}if(S[0]!==null){V.style.left=S[0]-X[0]+W[0]+"px";}if(S[1]!==null){V.style.top=S[1]-X[1]+W[1]+"px";}if(!R){var T=this.getXY(V);if((S[0]!==null&&T[0]!=S[0])||(S[1]!==null&&T[1]!=S[1])){this.setXY(V,S,true);}}};B.Dom.batch(P,Q,B.Dom,true);},setX:function(Q,P){B.Dom.setXY(Q,[P,null]);},setY:function(P,Q){B.Dom.setXY(P,[null,Q]);},getRegion:function(P){var Q=function(R){if((R.parentNode===null||R.offsetParent===null||this.getStyle(R,"display")=="none")&&R!=R.ownerDocument.body){return false;}var S=B.Region.getRegion(R);return S;};return B.Dom.batch(P,Q,B.Dom,true);},getClientWidth:function(){return B.Dom.getViewportWidth();},getClientHeight:function(){return B.Dom.getViewportHeight();},getElementsByClassName:function(T,X,U,V){X=X||"*";U=(U)?B.Dom.get(U):null||M;if(!U){return[];}var Q=[],P=U.getElementsByTagName(X),W=O(T);for(var R=0,S=P.length;R<S;++R){if(W.test(P[R].className)){Q[Q.length]=P[R];if(V){V.call(P[R],P[R]);}}}return Q;},hasClass:function(R,Q){var P=O(Q);var S=function(T){return P.test(T.className);};return B.Dom.batch(R,S,B.Dom,true);},addClass:function(Q,P){var R=function(S){if(this.hasClass(S,P)){return false;}S.className=YAHOO.lang.trim([S.className,P].join(" "));return true;};return B.Dom.batch(Q,R,B.Dom,true);},removeClass:function(R,Q){var P=O(Q);var S=function(T){if(!Q||!this.hasClass(T,Q)){return false;}var U=T.className;T.className=U.replace(P," ");if(this.hasClass(T,Q)){this.removeClass(T,Q);}T.className=YAHOO.lang.trim(T.className);return true;};return B.Dom.batch(R,S,B.Dom,true);},replaceClass:function(S,Q,P){if(!P||Q===P){return false;}var R=O(Q);var T=function(U){if(!this.hasClass(U,Q)){this.addClass(U,P);return true;}U.className=U.className.replace(R," "+P+" ");if(this.hasClass(U,Q)){this.replaceClass(U,Q,P);}U.className=YAHOO.lang.trim(U.className);return true;};return B.Dom.batch(S,T,B.Dom,true);},generateId:function(P,R){R=R||"yui-gen";var Q=function(S){if(S&&S.id){return S.id;}var T=R+YAHOO.env._id_counter++;if(S){S.id=T;}return T;};return B.Dom.batch(P,Q,B.Dom,true)||Q.apply(B.Dom,arguments);},isAncestor:function(P,Q){P=B.Dom.get(P);Q=B.Dom.get(Q);if(!P||!Q){return false;}if(P.contains&&Q.nodeType&&!L){return P.contains(Q);}else{if(P.compareDocumentPosition&&Q.nodeType){return !!(P.compareDocumentPosition(Q)&16);}else{if(Q.nodeType){return !!this.getAncestorBy(Q,function(R){return R==P;});}}}return false;},inDocument:function(P){return this.isAncestor(M.documentElement,P);},getElementsBy:function(W,Q,R,T){Q=Q||"*";R=(R)?B.Dom.get(R):null||M;if(!R){return[];}var S=[],V=R.getElementsByTagName(Q);for(var U=0,P=V.length;U<P;++U){if(W(V[U])){S[S.length]=V[U];if(T){T(V[U]);}}}return S;},batch:function(T,W,V,R){T=(T&&(T.tagName||T.item))?T:B.Dom.get(T);if(!T||!W){return false;}var S=(R)?V:window;if(T.tagName||T.length===undefined){return W.call(S,T,V);}var U=[];for(var Q=0,P=T.length;Q<P;++Q){U[U.length]=W.call(S,T[Q],V);}return U;},getDocumentHeight:function(){var Q=(M.compatMode!="CSS1Compat")?M.body.scrollHeight:M.documentElement.scrollHeight;var P=Math.max(Q,B.Dom.getViewportHeight());return P;},getDocumentWidth:function(){var Q=(M.compatMode!="CSS1Compat")?M.body.scrollWidth:M.documentElement.scrollWidth;var P=Math.max(Q,B.Dom.getViewportWidth());return P;},getViewportHeight:function(){var P=self.innerHeight;
var Q=M.compatMode;if((Q||G)&&!C){P=(Q=="CSS1Compat")?M.documentElement.clientHeight:M.body.clientHeight;}return P;},getViewportWidth:function(){var P=self.innerWidth;var Q=M.compatMode;if(Q||G){P=(Q=="CSS1Compat")?M.documentElement.clientWidth:M.body.clientWidth;}return P;},getAncestorBy:function(P,Q){while(P=P.parentNode){if(D(P,Q)){return P;}}return null;},getAncestorByClassName:function(Q,P){Q=B.Dom.get(Q);if(!Q){return null;}var R=function(S){return B.Dom.hasClass(S,P);};return B.Dom.getAncestorBy(Q,R);},getAncestorByTagName:function(Q,P){Q=B.Dom.get(Q);if(!Q){return null;}var R=function(S){return S.tagName&&S.tagName.toUpperCase()==P.toUpperCase();};return B.Dom.getAncestorBy(Q,R);},getPreviousSiblingBy:function(P,Q){while(P){P=P.previousSibling;if(D(P,Q)){return P;}}return null;},getPreviousSibling:function(P){P=B.Dom.get(P);if(!P){return null;}return B.Dom.getPreviousSiblingBy(P);},getNextSiblingBy:function(P,Q){while(P){P=P.nextSibling;if(D(P,Q)){return P;}}return null;},getNextSibling:function(P){P=B.Dom.get(P);if(!P){return null;}return B.Dom.getNextSiblingBy(P);},getFirstChildBy:function(P,R){var Q=(D(P.firstChild,R))?P.firstChild:null;return Q||B.Dom.getNextSiblingBy(P.firstChild,R);},getFirstChild:function(P,Q){P=B.Dom.get(P);if(!P){return null;}return B.Dom.getFirstChildBy(P);},getLastChildBy:function(P,R){if(!P){return null;}var Q=(D(P.lastChild,R))?P.lastChild:null;return Q||B.Dom.getPreviousSiblingBy(P.lastChild,R);},getLastChild:function(P){P=B.Dom.get(P);return B.Dom.getLastChildBy(P);},getChildrenBy:function(Q,S){var R=B.Dom.getFirstChildBy(Q,S);var P=R?[R]:[];B.Dom.getNextSiblingBy(R,function(T){if(!S||S(T)){P[P.length]=T;}return false;});return P;},getChildren:function(P){P=B.Dom.get(P);if(!P){}return B.Dom.getChildrenBy(P);},getDocumentScrollLeft:function(P){P=P||M;return Math.max(P.documentElement.scrollLeft,P.body.scrollLeft);},getDocumentScrollTop:function(P){P=P||M;return Math.max(P.documentElement.scrollTop,P.body.scrollTop);},insertBefore:function(Q,P){Q=B.Dom.get(Q);P=B.Dom.get(P);if(!Q||!P||!P.parentNode){return null;}return P.parentNode.insertBefore(Q,P);},insertAfter:function(Q,P){Q=B.Dom.get(Q);P=B.Dom.get(P);if(!Q||!P||!P.parentNode){return null;}if(P.nextSibling){return P.parentNode.insertBefore(Q,P.nextSibling);}else{return P.parentNode.appendChild(Q);}},getClientRegion:function(){var R=B.Dom.getDocumentScrollTop(),Q=B.Dom.getDocumentScrollLeft(),S=B.Dom.getViewportWidth()+Q,P=B.Dom.getViewportHeight()+R;return new B.Region(R,S,P,Q);}};var H=function(){if(M.documentElement.getBoundingClientRect){return function(Q){var R=Q.getBoundingClientRect();var P=Q.ownerDocument;return[R.left+B.Dom.getDocumentScrollLeft(P),R.top+B.Dom.getDocumentScrollTop(P)];};}else{return function(R){var S=[R.offsetLeft,R.offsetTop];var Q=R.offsetParent;var P=(L&&B.Dom.getStyle(R,"position")=="absolute"&&R.offsetParent==R.ownerDocument.body);if(Q!=R){while(Q){S[0]+=Q.offsetLeft;S[1]+=Q.offsetTop;if(!P&&L&&B.Dom.getStyle(Q,"position")=="absolute"){P=true;}Q=Q.offsetParent;}}if(P){S[0]-=R.ownerDocument.body.offsetLeft;S[1]-=R.ownerDocument.body.offsetTop;}Q=R.parentNode;while(Q.tagName&&!E.ROOT_TAG.test(Q.tagName)){if(Q.scrollTop||Q.scrollLeft){if(!E.OP_SCROLL.test(B.Dom.getStyle(Q,"display"))){if(!C||B.Dom.getStyle(Q,"overflow")!=="visible"){S[0]-=Q.scrollLeft;S[1]-=Q.scrollTop;}}}Q=Q.parentNode;}return S;};}}();})();YAHOO.util.Region=function(C,D,A,B){this.top=C;this[1]=C;this.right=D;this.bottom=A;this.left=B;this[0]=B;};YAHOO.util.Region.prototype.contains=function(A){return(A.left>=this.left&&A.right<=this.right&&A.top>=this.top&&A.bottom<=this.bottom);};YAHOO.util.Region.prototype.getArea=function(){return((this.bottom-this.top)*(this.right-this.left));};YAHOO.util.Region.prototype.intersect=function(E){var C=Math.max(this.top,E.top);var D=Math.min(this.right,E.right);var A=Math.min(this.bottom,E.bottom);var B=Math.max(this.left,E.left);if(A>=C&&D>=B){return new YAHOO.util.Region(C,D,A,B);}else{return null;}};YAHOO.util.Region.prototype.union=function(E){var C=Math.min(this.top,E.top);var D=Math.max(this.right,E.right);var A=Math.max(this.bottom,E.bottom);var B=Math.min(this.left,E.left);return new YAHOO.util.Region(C,D,A,B);};YAHOO.util.Region.prototype.toString=function(){return("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+"}");};YAHOO.util.Region.getRegion=function(D){var F=YAHOO.util.Dom.getXY(D);var C=F[1];var E=F[0]+D.offsetWidth;var A=F[1]+D.offsetHeight;var B=F[0];return new YAHOO.util.Region(C,E,A,B);};YAHOO.util.Point=function(A,B){if(YAHOO.lang.isArray(A)){B=A[1];A=A[0];}this.x=this.right=this.left=this[0]=A;this.y=this.top=this.bottom=this[1]=B;};YAHOO.util.Point.prototype=new YAHOO.util.Region();YAHOO.register("dom",YAHOO.util.Dom,{version:"2.5.2",build:"1076"});YAHOO.util.CustomEvent=function(D,B,C,A){this.type=D;this.scope=B||window;this.silent=C;this.signature=A||YAHOO.util.CustomEvent.LIST;this.subscribers=[];if(!this.silent){}var E="_YUICEOnSubscribe";if(D!==E){this.subscribeEvent=new YAHOO.util.CustomEvent(E,this,true);}this.lastError=null;};YAHOO.util.CustomEvent.LIST=0;YAHOO.util.CustomEvent.FLAT=1;YAHOO.util.CustomEvent.prototype={subscribe:function(B,C,A){if(!B){throw new Error("Invalid callback for subscriber to '"+this.type+"'");}if(this.subscribeEvent){this.subscribeEvent.fire(B,C,A);}this.subscribers.push(new YAHOO.util.Subscriber(B,C,A));},unsubscribe:function(D,F){if(!D){return this.unsubscribeAll();}var E=false;for(var B=0,A=this.subscribers.length;B<A;++B){var C=this.subscribers[B];if(C&&C.contains(D,F)){this._delete(B);E=true;}}return E;},fire:function(){this.lastError=null;var K=[],E=this.subscribers.length;if(!E&&this.silent){return true;}var I=[].slice.call(arguments,0),G=true,D,J=false;if(!this.silent){}var C=this.subscribers.slice(),A=YAHOO.util.Event.throwErrors;for(D=0;D<E;++D){var M=C[D];if(!M){J=true;}else{if(!this.silent){}var L=M.getScope(this.scope);if(this.signature==YAHOO.util.CustomEvent.FLAT){var B=null;if(I.length>0){B=I[0];}try{G=M.fn.call(L,B,M.obj);}catch(F){this.lastError=F;if(A){throw F;}}}else{try{G=M.fn.call(L,this.type,I,M.obj);}catch(H){this.lastError=H;if(A){throw H;}}}if(false===G){if(!this.silent){}break;}}}return(G!==false);},unsubscribeAll:function(){for(var A=this.subscribers.length-1;A>-1;A--){this._delete(A);}this.subscribers=[];return A;},_delete:function(A){var B=this.subscribers[A];if(B){delete B.fn;delete B.obj;}this.subscribers.splice(A,1);},toString:function(){return"CustomEvent: "+"'"+this.type+"', "+"scope: "+this.scope;}};YAHOO.util.Subscriber=function(B,C,A){this.fn=B;this.obj=YAHOO.lang.isUndefined(C)?null:C;this.override=A;};YAHOO.util.Subscriber.prototype.getScope=function(A){if(this.override){if(this.override===true){return this.obj;}else{return this.override;}}return A;};YAHOO.util.Subscriber.prototype.contains=function(A,B){if(B){return(this.fn==A&&this.obj==B);}else{return(this.fn==A);}};YAHOO.util.Subscriber.prototype.toString=function(){return"Subscriber { obj: "+this.obj+", override: "+(this.override||"no")+" }";};if(!YAHOO.util.Event){YAHOO.util.Event=function(){var H=false;var I=[];var J=[];var G=[];var E=[];var C=0;var F=[];var B=[];var A=0;var D={63232:38,63233:40,63234:37,63235:39,63276:33,63277:34,25:9};return{POLL_RETRYS:2000,POLL_INTERVAL:20,EL:0,TYPE:1,FN:2,WFN:3,UNLOAD_OBJ:3,ADJ_SCOPE:4,OBJ:5,OVERRIDE:6,lastError:null,isSafari:YAHOO.env.ua.webkit,webkit:YAHOO.env.ua.webkit,isIE:YAHOO.env.ua.ie,_interval:null,_dri:null,DOMReady:false,throwErrors:false,startInterval:function(){if(!this._interval){var K=this;var L=function(){K._tryPreloadAttach();};this._interval=setInterval(L,this.POLL_INTERVAL);}},onAvailable:function(P,M,Q,O,N){var K=(YAHOO.lang.isString(P))?[P]:P;for(var L=0;L<K.length;L=L+1){F.push({id:K[L],fn:M,obj:Q,override:O,checkReady:N});}C=this.POLL_RETRYS;this.startInterval();},onContentReady:function(M,K,N,L){this.onAvailable(M,K,N,L,true);},onDOMReady:function(K,M,L){if(this.DOMReady){setTimeout(function(){var N=window;if(L){if(L===true){N=M;}else{N=L;}}K.call(N,"DOMReady",[],M);},0);}else{this.DOMReadyEvent.subscribe(K,M,L);}},addListener:function(M,K,V,Q,L){if(!V||!V.call){return false;}if(this._isValidCollection(M)){var W=true;for(var R=0,T=M.length;R<T;++R){W=this.on(M[R],K,V,Q,L)&&W;}return W;}else{if(YAHOO.lang.isString(M)){var P=this.getEl(M);if(P){M=P;}else{this.onAvailable(M,function(){YAHOO.util.Event.on(M,K,V,Q,L);});return true;}}}if(!M){return false;}if("unload"==K&&Q!==this){J[J.length]=[M,K,V,Q,L];return true;}var Y=M;if(L){if(L===true){Y=Q;}else{Y=L;}}var N=function(Z){return V.call(Y,YAHOO.util.Event.getEvent(Z,M),Q);};var X=[M,K,V,N,Y,Q,L];var S=I.length;I[S]=X;if(this.useLegacyEvent(M,K)){var O=this.getLegacyIndex(M,K);if(O==-1||M!=G[O][0]){O=G.length;B[M.id+K]=O;G[O]=[M,K,M["on"+K]];E[O]=[];M["on"+K]=function(Z){YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(Z),O);};}E[O].push(X);}else{try{this._simpleAdd(M,K,N,false);}catch(U){this.lastError=U;this.removeListener(M,K,V);return false;}}return true;},fireLegacyEvent:function(O,M){var Q=true,K,S,R,T,P;S=E[M].slice();for(var L=0,N=S.length;L<N;++L){R=S[L];if(R&&R[this.WFN]){T=R[this.ADJ_SCOPE];P=R[this.WFN].call(T,O);Q=(Q&&P);}}K=G[M];if(K&&K[2]){K[2](O);}return Q;},getLegacyIndex:function(L,M){var K=this.generateId(L)+M;if(typeof B[K]=="undefined"){return -1;}else{return B[K];}},useLegacyEvent:function(L,M){if(this.webkit&&("click"==M||"dblclick"==M)){var K=parseInt(this.webkit,10);if(!isNaN(K)&&K<418){return true;}}return false;},removeListener:function(L,K,T){var O,R,V;if(typeof L=="string"){L=this.getEl(L);}else{if(this._isValidCollection(L)){var U=true;for(O=L.length-1;O>-1;O--){U=(this.removeListener(L[O],K,T)&&U);}return U;}}if(!T||!T.call){return this.purgeElement(L,false,K);}if("unload"==K){for(O=J.length-1;O>-1;O--){V=J[O];if(V&&V[0]==L&&V[1]==K&&V[2]==T){J.splice(O,1);return true;}}return false;}var P=null;var Q=arguments[3];if("undefined"===typeof Q){Q=this._getCacheIndex(L,K,T);}if(Q>=0){P=I[Q];}if(!L||!P){return false;}if(this.useLegacyEvent(L,K)){var N=this.getLegacyIndex(L,K);var M=E[N];if(M){for(O=0,R=M.length;O<R;++O){V=M[O];if(V&&V[this.EL]==L&&V[this.TYPE]==K&&V[this.FN]==T){M.splice(O,1);break;}}}}else{try{this._simpleRemove(L,K,P[this.WFN],false);}catch(S){this.lastError=S;return false;}}delete I[Q][this.WFN];delete I[Q][this.FN];I.splice(Q,1);return true;},getTarget:function(M,L){var K=M.target||M.srcElement;return this.resolveTextNode(K);},resolveTextNode:function(L){try{if(L&&3==L.nodeType){return L.parentNode;}}catch(K){}return L;},getPageX:function(L){var K=L.pageX;if(!K&&0!==K){K=L.clientX||0;if(this.isIE){K+=this._getScrollLeft();}}return K;},getPageY:function(K){var L=K.pageY;if(!L&&0!==L){L=K.clientY||0;if(this.isIE){L+=this._getScrollTop();}}return L;
},getXY:function(K){return[this.getPageX(K),this.getPageY(K)];},getRelatedTarget:function(L){var K=L.relatedTarget;if(!K){if(L.type=="mouseout"){K=L.toElement;}else{if(L.type=="mouseover"){K=L.fromElement;}}}return this.resolveTextNode(K);},getTime:function(M){if(!M.time){var L=new Date().getTime();try{M.time=L;}catch(K){this.lastError=K;return L;}}return M.time;},stopEvent:function(K){this.stopPropagation(K);this.preventDefault(K);},stopPropagation:function(K){if(K.stopPropagation){K.stopPropagation();}else{K.cancelBubble=true;}},preventDefault:function(K){if(K.preventDefault){K.preventDefault();}else{K.returnValue=false;}},getEvent:function(M,K){var L=M||window.event;if(!L){var N=this.getEvent.caller;while(N){L=N.arguments[0];if(L&&Event==L.constructor){break;}N=N.caller;}}return L;},getCharCode:function(L){var K=L.keyCode||L.charCode||0;if(YAHOO.env.ua.webkit&&(K in D)){K=D[K];}return K;},_getCacheIndex:function(O,P,N){for(var M=0,L=I.length;M<L;M=M+1){var K=I[M];if(K&&K[this.FN]==N&&K[this.EL]==O&&K[this.TYPE]==P){return M;}}return -1;},generateId:function(K){var L=K.id;if(!L){L="yuievtautoid-"+A;++A;K.id=L;}return L;},_isValidCollection:function(L){try{return(L&&typeof L!=="string"&&L.length&&!L.tagName&&!L.alert&&typeof L[0]!=="undefined");}catch(K){return false;}},elCache:{},getEl:function(K){return(typeof K==="string")?document.getElementById(K):K;},clearCache:function(){},DOMReadyEvent:new YAHOO.util.CustomEvent("DOMReady",this),_load:function(L){if(!H){H=true;var K=YAHOO.util.Event;K._ready();K._tryPreloadAttach();}},_ready:function(L){var K=YAHOO.util.Event;if(!K.DOMReady){K.DOMReady=true;K.DOMReadyEvent.fire();K._simpleRemove(document,"DOMContentLoaded",K._ready);}},_tryPreloadAttach:function(){if(F.length===0){C=0;clearInterval(this._interval);this._interval=null;return ;}if(this.locked){return ;}if(this.isIE){if(!this.DOMReady){this.startInterval();return ;}}this.locked=true;var Q=!H;if(!Q){Q=(C>0&&F.length>0);}var P=[];var R=function(T,U){var S=T;if(U.override){if(U.override===true){S=U.obj;}else{S=U.override;}}U.fn.call(S,U.obj);};var L,K,O,N,M=[];for(L=0,K=F.length;L<K;L=L+1){O=F[L];if(O){N=this.getEl(O.id);if(N){if(O.checkReady){if(H||N.nextSibling||!Q){M.push(O);F[L]=null;}}else{R(N,O);F[L]=null;}}else{P.push(O);}}}for(L=0,K=M.length;L<K;L=L+1){O=M[L];R(this.getEl(O.id),O);}C--;if(Q){for(L=F.length-1;L>-1;L--){O=F[L];if(!O||!O.id){F.splice(L,1);}}this.startInterval();}else{clearInterval(this._interval);this._interval=null;}this.locked=false;},purgeElement:function(O,P,R){var M=(YAHOO.lang.isString(O))?this.getEl(O):O;var Q=this.getListeners(M,R),N,K;if(Q){for(N=Q.length-1;N>-1;N--){var L=Q[N];this.removeListener(M,L.type,L.fn);}}if(P&&M&&M.childNodes){for(N=0,K=M.childNodes.length;N<K;++N){this.purgeElement(M.childNodes[N],P,R);}}},getListeners:function(M,K){var P=[],L;if(!K){L=[I,J];}else{if(K==="unload"){L=[J];}else{L=[I];}}var R=(YAHOO.lang.isString(M))?this.getEl(M):M;for(var O=0;O<L.length;O=O+1){var T=L[O];if(T){for(var Q=0,S=T.length;Q<S;++Q){var N=T[Q];if(N&&N[this.EL]===R&&(!K||K===N[this.TYPE])){P.push({type:N[this.TYPE],fn:N[this.FN],obj:N[this.OBJ],adjust:N[this.OVERRIDE],scope:N[this.ADJ_SCOPE],index:Q});}}}}return(P.length)?P:null;},_unload:function(Q){var K=YAHOO.util.Event,N,M,L,P,O,R=J.slice();for(N=0,P=J.length;N<P;++N){L=R[N];if(L){var S=window;if(L[K.ADJ_SCOPE]){if(L[K.ADJ_SCOPE]===true){S=L[K.UNLOAD_OBJ];}else{S=L[K.ADJ_SCOPE];}}L[K.FN].call(S,K.getEvent(Q,L[K.EL]),L[K.UNLOAD_OBJ]);R[N]=null;L=null;S=null;}}J=null;if(I){for(M=I.length-1;M>-1;M--){L=I[M];if(L){K.removeListener(L[K.EL],L[K.TYPE],L[K.FN],M);}}L=null;}G=null;K._simpleRemove(window,"unload",K._unload);},_getScrollLeft:function(){return this._getScroll()[1];},_getScrollTop:function(){return this._getScroll()[0];},_getScroll:function(){var K=document.documentElement,L=document.body;if(K&&(K.scrollTop||K.scrollLeft)){return[K.scrollTop,K.scrollLeft];}else{if(L){return[L.scrollTop,L.scrollLeft];}else{return[0,0];}}},regCE:function(){},_simpleAdd:function(){if(window.addEventListener){return function(M,N,L,K){M.addEventListener(N,L,(K));};}else{if(window.attachEvent){return function(M,N,L,K){M.attachEvent("on"+N,L);};}else{return function(){};}}}(),_simpleRemove:function(){if(window.removeEventListener){return function(M,N,L,K){M.removeEventListener(N,L,(K));};}else{if(window.detachEvent){return function(L,M,K){L.detachEvent("on"+M,K);};}else{return function(){};}}}()};}();(function(){var EU=YAHOO.util.Event;EU.on=EU.addListener;
/* DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller */
if(EU.isIE){YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach,YAHOO.util.Event,true);var n=document.createElement("p");EU._dri=setInterval(function(){try{n.doScroll("left");clearInterval(EU._dri);EU._dri=null;EU._ready();n=null;}catch(ex){}},EU.POLL_INTERVAL);}else{if(EU.webkit&&EU.webkit<525){EU._dri=setInterval(function(){var rs=document.readyState;if("loaded"==rs||"complete"==rs){clearInterval(EU._dri);EU._dri=null;EU._ready();}},EU.POLL_INTERVAL);}else{EU._simpleAdd(document,"DOMContentLoaded",EU._ready);}}EU._simpleAdd(window,"load",EU._load);EU._simpleAdd(window,"unload",EU._unload);EU._tryPreloadAttach();})();}YAHOO.util.EventProvider=function(){};YAHOO.util.EventProvider.prototype={__yui_events:null,__yui_subscribers:null,subscribe:function(A,C,F,E){this.__yui_events=this.__yui_events||{};var D=this.__yui_events[A];if(D){D.subscribe(C,F,E);}else{this.__yui_subscribers=this.__yui_subscribers||{};var B=this.__yui_subscribers;if(!B[A]){B[A]=[];}B[A].push({fn:C,obj:F,override:E});}},unsubscribe:function(C,E,G){this.__yui_events=this.__yui_events||{};var A=this.__yui_events;if(C){var F=A[C];if(F){return F.unsubscribe(E,G);}}else{var B=true;for(var D in A){if(YAHOO.lang.hasOwnProperty(A,D)){B=B&&A[D].unsubscribe(E,G);}}return B;}return false;},unsubscribeAll:function(A){return this.unsubscribe(A);},createEvent:function(G,D){this.__yui_events=this.__yui_events||{};var A=D||{};var I=this.__yui_events;
if(I[G]){}else{var H=A.scope||this;var E=(A.silent);var B=new YAHOO.util.CustomEvent(G,H,E,YAHOO.util.CustomEvent.FLAT);I[G]=B;if(A.onSubscribeCallback){B.subscribeEvent.subscribe(A.onSubscribeCallback);}this.__yui_subscribers=this.__yui_subscribers||{};var F=this.__yui_subscribers[G];if(F){for(var C=0;C<F.length;++C){B.subscribe(F[C].fn,F[C].obj,F[C].override);}}}return I[G];},fireEvent:function(E,D,A,C){this.__yui_events=this.__yui_events||{};var G=this.__yui_events[E];if(!G){return null;}var B=[];for(var F=1;F<arguments.length;++F){B.push(arguments[F]);}return G.fire.apply(G,B);},hasEvent:function(A){if(this.__yui_events){if(this.__yui_events[A]){return true;}}return false;}};YAHOO.util.KeyListener=function(A,F,B,C){if(!A){}else{if(!F){}else{if(!B){}}}if(!C){C=YAHOO.util.KeyListener.KEYDOWN;}var D=new YAHOO.util.CustomEvent("keyPressed");this.enabledEvent=new YAHOO.util.CustomEvent("enabled");this.disabledEvent=new YAHOO.util.CustomEvent("disabled");if(typeof A=="string"){A=document.getElementById(A);}if(typeof B=="function"){D.subscribe(B);}else{D.subscribe(B.fn,B.scope,B.correctScope);}function E(J,I){if(!F.shift){F.shift=false;}if(!F.alt){F.alt=false;}if(!F.ctrl){F.ctrl=false;}if(J.shiftKey==F.shift&&J.altKey==F.alt&&J.ctrlKey==F.ctrl){var G;if(F.keys instanceof Array){for(var H=0;H<F.keys.length;H++){G=F.keys[H];if(G==J.charCode){D.fire(J.charCode,J);break;}else{if(G==J.keyCode){D.fire(J.keyCode,J);break;}}}}else{G=F.keys;if(G==J.charCode){D.fire(J.charCode,J);}else{if(G==J.keyCode){D.fire(J.keyCode,J);}}}}}this.enable=function(){if(!this.enabled){YAHOO.util.Event.addListener(A,C,E);this.enabledEvent.fire(F);}this.enabled=true;};this.disable=function(){if(this.enabled){YAHOO.util.Event.removeListener(A,C,E);this.disabledEvent.fire(F);}this.enabled=false;};this.toString=function(){return"KeyListener ["+F.keys+"] "+A.tagName+(A.id?"["+A.id+"]":"");};};YAHOO.util.KeyListener.KEYDOWN="keydown";YAHOO.util.KeyListener.KEYUP="keyup";YAHOO.util.KeyListener.KEY={ALT:18,BACK_SPACE:8,CAPS_LOCK:20,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,META:224,NUM_LOCK:144,PAGE_DOWN:34,PAGE_UP:33,PAUSE:19,PRINTSCREEN:44,RIGHT:39,SCROLL_LOCK:145,SHIFT:16,SPACE:32,TAB:9,UP:38};YAHOO.register("event",YAHOO.util.Event,{version:"2.5.2",build:"1076"});YAHOO.register("yahoo-dom-event", YAHOO, {version: "2.5.2", build: "1076"});

/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.2
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
            if (map[this._configOrder[i]] !== undefined) {
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

/**
 * Fires before the Element is appended to another Element.
 * <p>See: <a href="#addListener">Element.addListener</a></p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> beforeAppendTo<br>
 * <code>&lt;HTMLElement/Element&gt;
 * target</code> the HTMLElement/Element being appended to 
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var target = e.target};<br>
 * myTabs.addListener('beforeAppendTo', handler);</code></p>
 * @event beforeAppendTo
 */

/**
 * Fires after the Element is appended to another Element.
 * <p>See: <a href="#addListener">Element.addListener</a></p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> appendTo<br>
 * <code>&lt;HTMLElement/Element&gt;
 * target</code> the HTMLElement/Element being appended to 
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var target = e.target};<br>
 * myTabs.addListener('appendTo', handler);</code></p>
 * @event appendTo
 */

YAHOO.augment(YAHOO.util.Element, AttributeProvider);
})();

YAHOO.register("element", YAHOO.util.Element, {version: "2.5.2", build: "1076"});

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
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.2
*/
(function(){YAHOO.widget.TabView=function(K,J){J=J||{};if(arguments.length==1&&!YAHOO.lang.isString(K)&&!K.nodeName){J=K;K=J.element||null;}if(!K&&!J.element){K=I.call(this,J);}YAHOO.widget.TabView.superclass.constructor.call(this,K,J);};YAHOO.extend(YAHOO.widget.TabView,YAHOO.util.Element);var F=YAHOO.widget.TabView.prototype;var E=YAHOO.util.Dom;var H=YAHOO.util.Event;var D=YAHOO.widget.Tab;F.CLASSNAME="yui-navset";F.TAB_PARENT_CLASSNAME="yui-nav";F.CONTENT_PARENT_CLASSNAME="yui-content";F._tabParent=null;F._contentParent=null;F.addTab=function(M,O){var P=this.get("tabs");if(!P){this._queue[this._queue.length]=["addTab",arguments];return false;}O=(O===undefined)?P.length:O;var R=this.getTab(O);var T=this;var L=this.get("element");var S=this._tabParent;var Q=this._contentParent;var J=M.get("element");var K=M.get("contentEl");if(R){S.insertBefore(J,R.get("element"));}else{S.appendChild(J);}if(K&&!E.isAncestor(Q,K)){Q.appendChild(K);}if(!M.get("active")){M.set("contentVisible",false,true);}else{this.set("activeTab",M,true);}var N=function(V){YAHOO.util.Event.preventDefault(V);var U=false;if(this==T.get("activeTab")){U=true;}T.set("activeTab",this,U);};M.addListener(M.get("activationEvent"),N);M.addListener("activationEventChange",function(U){if(U.prevValue!=U.newValue){M.removeListener(U.prevValue,N);M.addListener(U.newValue,N);}});P.splice(O,0,M);};F.DOMEventHandler=function(P){var K=this.get("element");var Q=YAHOO.util.Event.getTarget(P);var S=this._tabParent;if(E.isAncestor(S,Q)){var L;var M=null;var J;var R=this.get("tabs");for(var N=0,O=R.length;N<O;N++){L=R[N].get("element");J=R[N].get("contentEl");if(Q==L||E.isAncestor(L,Q)){M=R[N];break;}}if(M){M.fireEvent(P.type,P);}}};F.getTab=function(J){return this.get("tabs")[J];};F.getTabIndex=function(N){var K=null;var M=this.get("tabs");for(var L=0,J=M.length;L<J;++L){if(N==M[L]){K=L;break;}}return K;};F.removeTab=function(M){var L=this.get("tabs").length;var K=this.getTabIndex(M);var J=K+1;if(M==this.get("activeTab")){if(L>1){if(K+1==L){this.set("activeIndex",K-1);}else{this.set("activeIndex",K+1);}}}this._tabParent.removeChild(M.get("element"));this._contentParent.removeChild(M.get("contentEl"));this._configs.tabs.value.splice(K,1);};F.toString=function(){var J=this.get("id")||this.get("tagName");return"TabView "+J;};F.contentTransition=function(K,J){K.set("contentVisible",true);J.set("contentVisible",false);};F.initAttributes=function(J){YAHOO.widget.TabView.superclass.initAttributes.call(this,J);if(!J.orientation){J.orientation="top";}var L=this.get("element");if(!YAHOO.util.Dom.hasClass(L,this.CLASSNAME)){YAHOO.util.Dom.addClass(L,this.CLASSNAME);}this.setAttributeConfig("tabs",{value:[],readOnly:true});this._tabParent=this.getElementsByClassName(this.TAB_PARENT_CLASSNAME,"ul")[0]||G.call(this);this._contentParent=this.getElementsByClassName(this.CONTENT_PARENT_CLASSNAME,"div")[0]||C.call(this);this.setAttributeConfig("orientation",{value:J.orientation,method:function(M){var N=this.get("orientation");this.addClass("yui-navset-"+M);if(N!=M){this.removeClass("yui-navset-"+N);}switch(M){case"bottom":this.appendChild(this._tabParent);break;}}});this.setAttributeConfig("activeIndex",{value:J.activeIndex,method:function(M){this.set("activeTab",this.getTab(M));},validator:function(M){return !this.getTab(M).get("disabled");}});this.setAttributeConfig("activeTab",{value:J.activeTab,method:function(N){var M=this.get("activeTab");if(N){N.set("active",true);this._configs["activeIndex"].value=this.getTabIndex(N);}if(M&&M!=N){M.set("active",false);}if(M&&N!=M){this.contentTransition(N,M);}else{if(N){N.set("contentVisible",true);}}},validator:function(M){return !M.get("disabled");}});if(this._tabParent){B.call(this);}this.DOM_EVENTS.submit=false;this.DOM_EVENTS.focus=false;this.DOM_EVENTS.blur=false;for(var K in this.DOM_EVENTS){if(YAHOO.lang.hasOwnProperty(this.DOM_EVENTS,K)){this.addListener.call(this,K,this.DOMEventHandler);}}};var B=function(){var Q,L,P;var O=this.get("element");var N=A(this._tabParent);var K=A(this._contentParent);for(var M=0,J=N.length;M<J;++M){L={};if(K[M]){L.contentEl=K[M];}Q=new YAHOO.widget.Tab(N[M],L);this.addTab(Q);if(Q.hasClass(Q.ACTIVE_CLASSNAME)){this._configs.activeTab.value=Q;this._configs.activeIndex.value=this.getTabIndex(Q);}}};var I=function(J){var K=document.createElement("div");if(this.CLASSNAME){K.className=this.CLASSNAME;}return K;};var G=function(J){var K=document.createElement("ul");if(this.TAB_PARENT_CLASSNAME){K.className=this.TAB_PARENT_CLASSNAME;}this.get("element").appendChild(K);return K;};var C=function(J){var K=document.createElement("div");if(this.CONTENT_PARENT_CLASSNAME){K.className=this.CONTENT_PARENT_CLASSNAME;}this.get("element").appendChild(K);return K;};var A=function(M){var K=[];var N=M.childNodes;for(var L=0,J=N.length;L<J;++L){if(N[L].nodeType==1){K[K.length]=N[L];}}return K;};})();(function(){var E=YAHOO.util.Dom,J=YAHOO.util.Event;var B=function(L,K){K=K||{};if(arguments.length==1&&!YAHOO.lang.isString(L)&&!L.nodeName){K=L;L=K.element;}if(!L&&!K.element){L=H.call(this,K);}this.loadHandler={success:function(M){this.set("content",M.responseText);},failure:function(M){}};B.superclass.constructor.call(this,L,K);this.DOM_EVENTS={};};YAHOO.extend(B,YAHOO.util.Element);var F=B.prototype;F.LABEL_TAGNAME="em";F.ACTIVE_CLASSNAME="selected";F.ACTIVE_TITLE="active";F.DISABLED_CLASSNAME="disabled";F.LOADING_CLASSNAME="loading";F.dataConnection=null;F.loadHandler=null;F._loading=false;F.toString=function(){var K=this.get("element");var L=K.id||K.tagName;return"Tab "+L;};F.initAttributes=function(K){K=K||{};B.superclass.initAttributes.call(this,K);var M=this.get("element");this.setAttributeConfig("activationEvent",{value:K.activationEvent||"click"});this.setAttributeConfig("labelEl",{value:K.labelEl||G.call(this),method:function(N){var O=this.get("labelEl");if(O){if(O==N){return false;}this.replaceChild(N,O);}else{if(M.firstChild){this.insertBefore(N,M.firstChild);}else{this.appendChild(N);}}}});this.setAttributeConfig("label",{value:K.label||D.call(this),method:function(O){var N=this.get("labelEl");
if(!N){this.set("labelEl",I.call(this));}C.call(this,O);}});this.setAttributeConfig("contentEl",{value:K.contentEl||document.createElement("div"),method:function(N){var O=this.get("contentEl");if(O){if(O==N){return false;}this.replaceChild(N,O);}}});this.setAttributeConfig("content",{value:K.content,method:function(N){this.get("contentEl").innerHTML=N;}});var L=false;this.setAttributeConfig("dataSrc",{value:K.dataSrc});this.setAttributeConfig("cacheData",{value:K.cacheData||false,validator:YAHOO.lang.isBoolean});this.setAttributeConfig("loadMethod",{value:K.loadMethod||"GET",validator:YAHOO.lang.isString});this.setAttributeConfig("dataLoaded",{value:false,validator:YAHOO.lang.isBoolean,writeOnce:true});this.setAttributeConfig("dataTimeout",{value:K.dataTimeout||null,validator:YAHOO.lang.isNumber});this.setAttributeConfig("active",{value:K.active||this.hasClass(this.ACTIVE_CLASSNAME),method:function(N){if(N===true){this.addClass(this.ACTIVE_CLASSNAME);this.set("title",this.ACTIVE_TITLE);}else{this.removeClass(this.ACTIVE_CLASSNAME);this.set("title","");}},validator:function(N){return YAHOO.lang.isBoolean(N)&&!this.get("disabled");}});this.setAttributeConfig("disabled",{value:K.disabled||this.hasClass(this.DISABLED_CLASSNAME),method:function(N){if(N===true){E.addClass(this.get("element"),this.DISABLED_CLASSNAME);}else{E.removeClass(this.get("element"),this.DISABLED_CLASSNAME);}},validator:YAHOO.lang.isBoolean});this.setAttributeConfig("href",{value:K.href||this.getElementsByTagName("a")[0].getAttribute("href",2)||"#",method:function(N){this.getElementsByTagName("a")[0].href=N;},validator:YAHOO.lang.isString});this.setAttributeConfig("contentVisible",{value:K.contentVisible,method:function(N){if(N){this.get("contentEl").style.display="block";if(this.get("dataSrc")){if(!this._loading&&!(this.get("dataLoaded")&&this.get("cacheData"))){A.call(this);}}}else{this.get("contentEl").style.display="none";}},validator:YAHOO.lang.isBoolean});};var H=function(K){var O=document.createElement("li");var L=document.createElement("a");L.href=K.href||"#";O.appendChild(L);var N=K.label||null;var M=K.labelEl||null;if(M){if(!N){N=D.call(this,M);}}else{M=I.call(this);}L.appendChild(M);return O;};var G=function(){return this.getElementsByTagName(this.LABEL_TAGNAME)[0];};var I=function(){var K=document.createElement(this.LABEL_TAGNAME);return K;};var C=function(K){var L=this.get("labelEl");L.innerHTML=K;};var D=function(){var K,L=this.get("labelEl");if(!L){return undefined;}return L.innerHTML;};var A=function(){if(!YAHOO.util.Connect){return false;}E.addClass(this.get("contentEl").parentNode,this.LOADING_CLASSNAME);this._loading=true;this.dataConnection=YAHOO.util.Connect.asyncRequest(this.get("loadMethod"),this.get("dataSrc"),{success:function(K){this.loadHandler.success.call(this,K);this.set("dataLoaded",true);this.dataConnection=null;E.removeClass(this.get("contentEl").parentNode,this.LOADING_CLASSNAME);this._loading=false;},failure:function(K){this.loadHandler.failure.call(this,K);this.dataConnection=null;E.removeClass(this.get("contentEl").parentNode,this.LOADING_CLASSNAME);this._loading=false;},scope:this,timeout:this.get("dataTimeout")});};YAHOO.widget.Tab=B;})();YAHOO.register("tabview",YAHOO.widget.TabView,{version:"2.5.2",build:"1076"});
/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.2
*/
(function(){var B=YAHOO.util;var A=function(D,C,E,F){if(!D){}this.init(D,C,E,F);};A.NAME="Anim";A.prototype={toString:function(){var C=this.getEl()||{};var D=C.id||C.tagName;return(this.constructor.NAME+": "+D);},patterns:{noNegatives:/width|height|opacity|padding/i,offsetAttribute:/^((width|height)|(top|left))$/,defaultUnit:/width|height|top$|bottom$|left$|right$/i,offsetUnit:/\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i},doMethod:function(C,E,D){return this.method(this.currentFrame,E,D-E,this.totalFrames);},setAttribute:function(C,E,D){if(this.patterns.noNegatives.test(C)){E=(E>0)?E:0;}B.Dom.setStyle(this.getEl(),C,E+D);},getAttribute:function(C){var E=this.getEl();var G=B.Dom.getStyle(E,C);if(G!=="auto"&&!this.patterns.offsetUnit.test(G)){return parseFloat(G);}var D=this.patterns.offsetAttribute.exec(C)||[];var H=!!(D[3]);var F=!!(D[2]);if(F||(B.Dom.getStyle(E,"position")=="absolute"&&H)){G=E["offset"+D[0].charAt(0).toUpperCase()+D[0].substr(1)];}else{G=0;}return G;},getDefaultUnit:function(C){if(this.patterns.defaultUnit.test(C)){return"px";}return"";},setRuntimeAttribute:function(D){var I;var E;var F=this.attributes;this.runtimeAttributes[D]={};var H=function(J){return(typeof J!=="undefined");};if(!H(F[D]["to"])&&!H(F[D]["by"])){return false;}I=(H(F[D]["from"]))?F[D]["from"]:this.getAttribute(D);if(H(F[D]["to"])){E=F[D]["to"];}else{if(H(F[D]["by"])){if(I.constructor==Array){E=[];for(var G=0,C=I.length;G<C;++G){E[G]=I[G]+F[D]["by"][G]*1;}}else{E=I+F[D]["by"]*1;}}}this.runtimeAttributes[D].start=I;this.runtimeAttributes[D].end=E;this.runtimeAttributes[D].unit=(H(F[D].unit))?F[D]["unit"]:this.getDefaultUnit(D);return true;},init:function(E,J,I,C){var D=false;var F=null;var H=0;E=B.Dom.get(E);this.attributes=J||{};this.duration=!YAHOO.lang.isUndefined(I)?I:1;this.method=C||B.Easing.easeNone;this.useSeconds=true;this.currentFrame=0;this.totalFrames=B.AnimMgr.fps;this.setEl=function(M){E=B.Dom.get(M);};this.getEl=function(){return E;};this.isAnimated=function(){return D;};this.getStartTime=function(){return F;};this.runtimeAttributes={};this.animate=function(){if(this.isAnimated()){return false;}this.currentFrame=0;this.totalFrames=(this.useSeconds)?Math.ceil(B.AnimMgr.fps*this.duration):this.duration;if(this.duration===0&&this.useSeconds){this.totalFrames=1;}B.AnimMgr.registerElement(this);return true;};this.stop=function(M){if(!this.isAnimated()){return false;}if(M){this.currentFrame=this.totalFrames;this._onTween.fire();}B.AnimMgr.stop(this);};var L=function(){this.onStart.fire();this.runtimeAttributes={};for(var M in this.attributes){this.setRuntimeAttribute(M);}D=true;H=0;F=new Date();};var K=function(){var O={duration:new Date()-this.getStartTime(),currentFrame:this.currentFrame};O.toString=function(){return("duration: "+O.duration+", currentFrame: "+O.currentFrame);};this.onTween.fire(O);var N=this.runtimeAttributes;for(var M in N){this.setAttribute(M,this.doMethod(M,N[M].start,N[M].end),N[M].unit);}H+=1;};var G=function(){var M=(new Date()-F)/1000;var N={duration:M,frames:H,fps:H/M};N.toString=function(){return("duration: "+N.duration+", frames: "+N.frames+", fps: "+N.fps);};D=false;H=0;this.onComplete.fire(N);};this._onStart=new B.CustomEvent("_start",this,true);this.onStart=new B.CustomEvent("start",this);this.onTween=new B.CustomEvent("tween",this);this._onTween=new B.CustomEvent("_tween",this,true);this.onComplete=new B.CustomEvent("complete",this);this._onComplete=new B.CustomEvent("_complete",this,true);this._onStart.subscribe(L);this._onTween.subscribe(K);this._onComplete.subscribe(G);}};B.Anim=A;})();YAHOO.util.AnimMgr=new function(){var C=null;var B=[];var A=0;this.fps=1000;this.delay=1;this.registerElement=function(F){B[B.length]=F;A+=1;F._onStart.fire();this.start();};this.unRegister=function(G,F){F=F||E(G);if(!G.isAnimated()||F==-1){return false;}G._onComplete.fire();B.splice(F,1);A-=1;if(A<=0){this.stop();}return true;};this.start=function(){if(C===null){C=setInterval(this.run,this.delay);}};this.stop=function(H){if(!H){clearInterval(C);for(var G=0,F=B.length;G<F;++G){this.unRegister(B[0],0);}B=[];C=null;A=0;}else{this.unRegister(H);}};this.run=function(){for(var H=0,F=B.length;H<F;++H){var G=B[H];if(!G||!G.isAnimated()){continue;}if(G.currentFrame<G.totalFrames||G.totalFrames===null){G.currentFrame+=1;if(G.useSeconds){D(G);}G._onTween.fire();}else{YAHOO.util.AnimMgr.stop(G,H);}}};var E=function(H){for(var G=0,F=B.length;G<F;++G){if(B[G]==H){return G;}}return -1;};var D=function(G){var J=G.totalFrames;var I=G.currentFrame;var H=(G.currentFrame*G.duration*1000/G.totalFrames);var F=(new Date()-G.getStartTime());var K=0;if(F<G.duration*1000){K=Math.round((F/H-1)*G.currentFrame);}else{K=J-(I+1);}if(K>0&&isFinite(K)){if(G.currentFrame+K>=J){K=J-(I+1);}G.currentFrame+=K;}};};YAHOO.util.Bezier=new function(){this.getPosition=function(E,D){var F=E.length;var C=[];for(var B=0;B<F;++B){C[B]=[E[B][0],E[B][1]];}for(var A=1;A<F;++A){for(B=0;B<F-A;++B){C[B][0]=(1-D)*C[B][0]+D*C[parseInt(B+1,10)][0];C[B][1]=(1-D)*C[B][1]+D*C[parseInt(B+1,10)][1];}}return[C[0][0],C[0][1]];};};(function(){var A=function(F,E,G,H){A.superclass.constructor.call(this,F,E,G,H);};A.NAME="ColorAnim";var C=YAHOO.util;YAHOO.extend(A,C.Anim);var D=A.superclass;var B=A.prototype;B.patterns.color=/color$/i;B.patterns.rgb=/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;B.patterns.hex=/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;B.patterns.hex3=/^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;B.patterns.transparent=/^transparent|rgba\(0, 0, 0, 0\)$/;B.parseColor=function(E){if(E.length==3){return E;}var F=this.patterns.hex.exec(E);if(F&&F.length==4){return[parseInt(F[1],16),parseInt(F[2],16),parseInt(F[3],16)];}F=this.patterns.rgb.exec(E);if(F&&F.length==4){return[parseInt(F[1],10),parseInt(F[2],10),parseInt(F[3],10)];}F=this.patterns.hex3.exec(E);if(F&&F.length==4){return[parseInt(F[1]+F[1],16),parseInt(F[2]+F[2],16),parseInt(F[3]+F[3],16)];}return null;};B.getAttribute=function(E){var G=this.getEl();if(this.patterns.color.test(E)){var H=YAHOO.util.Dom.getStyle(G,E);
if(this.patterns.transparent.test(H)){var F=G.parentNode;H=C.Dom.getStyle(F,E);while(F&&this.patterns.transparent.test(H)){F=F.parentNode;H=C.Dom.getStyle(F,E);if(F.tagName.toUpperCase()=="HTML"){H="#fff";}}}}else{H=D.getAttribute.call(this,E);}return H;};B.doMethod=function(F,J,G){var I;if(this.patterns.color.test(F)){I=[];for(var H=0,E=J.length;H<E;++H){I[H]=D.doMethod.call(this,F,J[H],G[H]);}I="rgb("+Math.floor(I[0])+","+Math.floor(I[1])+","+Math.floor(I[2])+")";}else{I=D.doMethod.call(this,F,J,G);}return I;};B.setRuntimeAttribute=function(F){D.setRuntimeAttribute.call(this,F);if(this.patterns.color.test(F)){var H=this.attributes;var J=this.parseColor(this.runtimeAttributes[F].start);var G=this.parseColor(this.runtimeAttributes[F].end);if(typeof H[F]["to"]==="undefined"&&typeof H[F]["by"]!=="undefined"){G=this.parseColor(H[F].by);for(var I=0,E=J.length;I<E;++I){G[I]=J[I]+G[I];}}this.runtimeAttributes[F].start=J;this.runtimeAttributes[F].end=G;}};C.ColorAnim=A;})();
/*
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright 2001 Robert Penner All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
YAHOO.util.Easing={easeNone:function(B,A,D,C){return D*B/C+A;},easeIn:function(B,A,D,C){return D*(B/=C)*B+A;},easeOut:function(B,A,D,C){return -D*(B/=C)*(B-2)+A;},easeBoth:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B+A;}return -D/2*((--B)*(B-2)-1)+A;},easeInStrong:function(B,A,D,C){return D*(B/=C)*B*B*B+A;},easeOutStrong:function(B,A,D,C){return -D*((B=B/C-1)*B*B*B-1)+A;},easeBothStrong:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B*B*B+A;}return -D/2*((B-=2)*B*B*B-2)+A;},elasticIn:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F)==1){return A+G;}if(!E){E=F*0.3;}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}return -(B*Math.pow(2,10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E))+A;},elasticOut:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F)==1){return A+G;}if(!E){E=F*0.3;}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}return B*Math.pow(2,-10*C)*Math.sin((C*F-D)*(2*Math.PI)/E)+G+A;},elasticBoth:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F/2)==2){return A+G;}if(!E){E=F*(0.3*1.5);}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}if(C<1){return -0.5*(B*Math.pow(2,10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E))+A;}return B*Math.pow(2,-10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E)*0.5+G+A;},backIn:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}return E*(B/=D)*B*((C+1)*B-C)+A;},backOut:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}return E*((B=B/D-1)*B*((C+1)*B+C)+1)+A;},backBoth:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}if((B/=D/2)<1){return E/2*(B*B*(((C*=(1.525))+1)*B-C))+A;}return E/2*((B-=2)*B*(((C*=(1.525))+1)*B+C)+2)+A;},bounceIn:function(B,A,D,C){return D-YAHOO.util.Easing.bounceOut(C-B,0,D,C)+A;},bounceOut:function(B,A,D,C){if((B/=C)<(1/2.75)){return D*(7.5625*B*B)+A;}else{if(B<(2/2.75)){return D*(7.5625*(B-=(1.5/2.75))*B+0.75)+A;}else{if(B<(2.5/2.75)){return D*(7.5625*(B-=(2.25/2.75))*B+0.9375)+A;}}}return D*(7.5625*(B-=(2.625/2.75))*B+0.984375)+A;},bounceBoth:function(B,A,D,C){if(B<C/2){return YAHOO.util.Easing.bounceIn(B*2,0,D,C)*0.5+A;}return YAHOO.util.Easing.bounceOut(B*2-C,0,D,C)*0.5+D*0.5+A;}};(function(){var A=function(H,G,I,J){if(H){A.superclass.constructor.call(this,H,G,I,J);}};A.NAME="Motion";var E=YAHOO.util;YAHOO.extend(A,E.ColorAnim);var F=A.superclass;var C=A.prototype;C.patterns.points=/^points$/i;C.setAttribute=function(G,I,H){if(this.patterns.points.test(G)){H=H||"px";F.setAttribute.call(this,"left",I[0],H);F.setAttribute.call(this,"top",I[1],H);}else{F.setAttribute.call(this,G,I,H);}};C.getAttribute=function(G){if(this.patterns.points.test(G)){var H=[F.getAttribute.call(this,"left"),F.getAttribute.call(this,"top")];}else{H=F.getAttribute.call(this,G);}return H;};C.doMethod=function(G,K,H){var J=null;if(this.patterns.points.test(G)){var I=this.method(this.currentFrame,0,100,this.totalFrames)/100;J=E.Bezier.getPosition(this.runtimeAttributes[G],I);}else{J=F.doMethod.call(this,G,K,H);}return J;};C.setRuntimeAttribute=function(P){if(this.patterns.points.test(P)){var H=this.getEl();var J=this.attributes;var G;var L=J["points"]["control"]||[];var I;var M,O;if(L.length>0&&!(L[0] instanceof Array)){L=[L];}else{var K=[];for(M=0,O=L.length;M<O;++M){K[M]=L[M];}L=K;}if(E.Dom.getStyle(H,"position")=="static"){E.Dom.setStyle(H,"position","relative");}if(D(J["points"]["from"])){E.Dom.setXY(H,J["points"]["from"]);}else{E.Dom.setXY(H,E.Dom.getXY(H));}G=this.getAttribute("points");if(D(J["points"]["to"])){I=B.call(this,J["points"]["to"],G);
var N=E.Dom.getXY(this.getEl());for(M=0,O=L.length;M<O;++M){L[M]=B.call(this,L[M],G);}}else{if(D(J["points"]["by"])){I=[G[0]+J["points"]["by"][0],G[1]+J["points"]["by"][1]];for(M=0,O=L.length;M<O;++M){L[M]=[G[0]+L[M][0],G[1]+L[M][1]];}}}this.runtimeAttributes[P]=[G];if(L.length>0){this.runtimeAttributes[P]=this.runtimeAttributes[P].concat(L);}this.runtimeAttributes[P][this.runtimeAttributes[P].length]=I;}else{F.setRuntimeAttribute.call(this,P);}};var B=function(G,I){var H=E.Dom.getXY(this.getEl());G=[G[0]-H[0]+I[0],G[1]-H[1]+I[1]];return G;};var D=function(G){return(typeof G!=="undefined");};E.Motion=A;})();(function(){var D=function(F,E,G,H){if(F){D.superclass.constructor.call(this,F,E,G,H);}};D.NAME="Scroll";var B=YAHOO.util;YAHOO.extend(D,B.ColorAnim);var C=D.superclass;var A=D.prototype;A.doMethod=function(E,H,F){var G=null;if(E=="scroll"){G=[this.method(this.currentFrame,H[0],F[0]-H[0],this.totalFrames),this.method(this.currentFrame,H[1],F[1]-H[1],this.totalFrames)];}else{G=C.doMethod.call(this,E,H,F);}return G;};A.getAttribute=function(E){var G=null;var F=this.getEl();if(E=="scroll"){G=[F.scrollLeft,F.scrollTop];}else{G=C.getAttribute.call(this,E);}return G;};A.setAttribute=function(E,H,G){var F=this.getEl();if(E=="scroll"){F.scrollLeft=H[0];F.scrollTop=H[1];}else{C.setAttribute.call(this,E,H,G);}};B.Scroll=D;})();YAHOO.register("animation",YAHOO.util.Anim,{version:"2.5.2",build:"1076"});
/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.2
*/
YAHOO.widget.AutoComplete=function(G,B,J,C){if(G&&B&&J){if(J instanceof YAHOO.widget.DataSource){this.dataSource=J;}else{return ;}if(YAHOO.util.Dom.inDocument(G)){if(YAHOO.lang.isString(G)){this._sName="instance"+YAHOO.widget.AutoComplete._nIndex+" "+G;this._elTextbox=document.getElementById(G);}else{this._sName=(G.id)?"instance"+YAHOO.widget.AutoComplete._nIndex+" "+G.id:"instance"+YAHOO.widget.AutoComplete._nIndex;this._elTextbox=G;}YAHOO.util.Dom.addClass(this._elTextbox,"yui-ac-input");}else{return ;}if(YAHOO.util.Dom.inDocument(B)){if(YAHOO.lang.isString(B)){this._elContainer=document.getElementById(B);}else{this._elContainer=B;}if(this._elContainer.style.display=="none"){}var D=this._elContainer.parentNode;var A=D.tagName.toLowerCase();if(A=="div"){YAHOO.util.Dom.addClass(D,"yui-ac");}else{}}else{return ;}if(C&&(C.constructor==Object)){for(var I in C){if(I){this[I]=C[I];}}}this._initContainer();this._initProps();this._initList();this._initContainerHelpers();var H=this;var F=this._elTextbox;var E=this._elContent;YAHOO.util.Event.addListener(F,"keyup",H._onTextboxKeyUp,H);YAHOO.util.Event.addListener(F,"keydown",H._onTextboxKeyDown,H);YAHOO.util.Event.addListener(F,"focus",H._onTextboxFocus,H);YAHOO.util.Event.addListener(F,"blur",H._onTextboxBlur,H);YAHOO.util.Event.addListener(E,"mouseover",H._onContainerMouseover,H);YAHOO.util.Event.addListener(E,"mouseout",H._onContainerMouseout,H);YAHOO.util.Event.addListener(E,"scroll",H._onContainerScroll,H);YAHOO.util.Event.addListener(E,"resize",H._onContainerResize,H);YAHOO.util.Event.addListener(F,"keypress",H._onTextboxKeyPress,H);YAHOO.util.Event.addListener(window,"unload",H._onWindowUnload,H);this.textboxFocusEvent=new YAHOO.util.CustomEvent("textboxFocus",this);this.textboxKeyEvent=new YAHOO.util.CustomEvent("textboxKey",this);this.dataRequestEvent=new YAHOO.util.CustomEvent("dataRequest",this);this.dataReturnEvent=new YAHOO.util.CustomEvent("dataReturn",this);this.dataErrorEvent=new YAHOO.util.CustomEvent("dataError",this);this.containerExpandEvent=new YAHOO.util.CustomEvent("containerExpand",this);this.typeAheadEvent=new YAHOO.util.CustomEvent("typeAhead",this);this.itemMouseOverEvent=new YAHOO.util.CustomEvent("itemMouseOver",this);this.itemMouseOutEvent=new YAHOO.util.CustomEvent("itemMouseOut",this);this.itemArrowToEvent=new YAHOO.util.CustomEvent("itemArrowTo",this);this.itemArrowFromEvent=new YAHOO.util.CustomEvent("itemArrowFrom",this);this.itemSelectEvent=new YAHOO.util.CustomEvent("itemSelect",this);this.unmatchedItemSelectEvent=new YAHOO.util.CustomEvent("unmatchedItemSelect",this);this.selectionEnforceEvent=new YAHOO.util.CustomEvent("selectionEnforce",this);this.containerCollapseEvent=new YAHOO.util.CustomEvent("containerCollapse",this);this.textboxBlurEvent=new YAHOO.util.CustomEvent("textboxBlur",this);F.setAttribute("autocomplete","off");YAHOO.widget.AutoComplete._nIndex++;}else{}};YAHOO.widget.AutoComplete.prototype.dataSource=null;YAHOO.widget.AutoComplete.prototype.minQueryLength=1;YAHOO.widget.AutoComplete.prototype.maxResultsDisplayed=10;YAHOO.widget.AutoComplete.prototype.queryDelay=0.2;YAHOO.widget.AutoComplete.prototype.highlightClassName="yui-ac-highlight";YAHOO.widget.AutoComplete.prototype.prehighlightClassName=null;YAHOO.widget.AutoComplete.prototype.delimChar=null;YAHOO.widget.AutoComplete.prototype.autoHighlight=true;YAHOO.widget.AutoComplete.prototype.typeAhead=false;YAHOO.widget.AutoComplete.prototype.animHoriz=false;YAHOO.widget.AutoComplete.prototype.animVert=true;YAHOO.widget.AutoComplete.prototype.animSpeed=0.3;YAHOO.widget.AutoComplete.prototype.forceSelection=false;YAHOO.widget.AutoComplete.prototype.allowBrowserAutocomplete=true;YAHOO.widget.AutoComplete.prototype.alwaysShowContainer=false;YAHOO.widget.AutoComplete.prototype.useIFrame=false;YAHOO.widget.AutoComplete.prototype.useShadow=false;YAHOO.widget.AutoComplete.prototype.toString=function(){return"AutoComplete "+this._sName;};YAHOO.widget.AutoComplete.prototype.isContainerOpen=function(){return this._bContainerOpen;};YAHOO.widget.AutoComplete.prototype.getListItems=function(){return this._aListItems;};YAHOO.widget.AutoComplete.prototype.getListItemData=function(A){if(A._oResultData){return A._oResultData;}else{return false;}};YAHOO.widget.AutoComplete.prototype.setHeader=function(B){if(this._elHeader){var A=this._elHeader;if(B){A.innerHTML=B;A.style.display="block";}else{A.innerHTML="";A.style.display="none";}}};YAHOO.widget.AutoComplete.prototype.setFooter=function(B){if(this._elFooter){var A=this._elFooter;if(B){A.innerHTML=B;A.style.display="block";}else{A.innerHTML="";A.style.display="none";}}};YAHOO.widget.AutoComplete.prototype.setBody=function(A){if(this._elBody){var B=this._elBody;if(A){B.innerHTML=A;B.style.display="block";B.style.display="block";}else{B.innerHTML="";B.style.display="none";}this._maxResultsDisplayed=0;}};YAHOO.widget.AutoComplete.prototype.formatResult=function(B,C){var A=B[0];if(A){return A;}else{return"";}};YAHOO.widget.AutoComplete.prototype.doBeforeExpandContainer=function(D,A,C,B){return true;};YAHOO.widget.AutoComplete.prototype.sendQuery=function(A){this._sendQuery(A);};YAHOO.widget.AutoComplete.prototype.doBeforeSendQuery=function(A){return A;};YAHOO.widget.AutoComplete.prototype.destroy=function(){var B=this.toString();var A=this._elTextbox;var D=this._elContainer;this.textboxFocusEvent.unsubscribeAll();this.textboxKeyEvent.unsubscribeAll();this.dataRequestEvent.unsubscribeAll();this.dataReturnEvent.unsubscribeAll();this.dataErrorEvent.unsubscribeAll();this.containerExpandEvent.unsubscribeAll();this.typeAheadEvent.unsubscribeAll();this.itemMouseOverEvent.unsubscribeAll();this.itemMouseOutEvent.unsubscribeAll();this.itemArrowToEvent.unsubscribeAll();this.itemArrowFromEvent.unsubscribeAll();this.itemSelectEvent.unsubscribeAll();this.unmatchedItemSelectEvent.unsubscribeAll();this.selectionEnforceEvent.unsubscribeAll();this.containerCollapseEvent.unsubscribeAll();this.textboxBlurEvent.unsubscribeAll();YAHOO.util.Event.purgeElement(A,true);
YAHOO.util.Event.purgeElement(D,true);D.innerHTML="";for(var C in this){if(YAHOO.lang.hasOwnProperty(this,C)){this[C]=null;}}};YAHOO.widget.AutoComplete.prototype.textboxFocusEvent=null;YAHOO.widget.AutoComplete.prototype.textboxKeyEvent=null;YAHOO.widget.AutoComplete.prototype.dataRequestEvent=null;YAHOO.widget.AutoComplete.prototype.dataReturnEvent=null;YAHOO.widget.AutoComplete.prototype.dataErrorEvent=null;YAHOO.widget.AutoComplete.prototype.containerExpandEvent=null;YAHOO.widget.AutoComplete.prototype.typeAheadEvent=null;YAHOO.widget.AutoComplete.prototype.itemMouseOverEvent=null;YAHOO.widget.AutoComplete.prototype.itemMouseOutEvent=null;YAHOO.widget.AutoComplete.prototype.itemArrowToEvent=null;YAHOO.widget.AutoComplete.prototype.itemArrowFromEvent=null;YAHOO.widget.AutoComplete.prototype.itemSelectEvent=null;YAHOO.widget.AutoComplete.prototype.unmatchedItemSelectEvent=null;YAHOO.widget.AutoComplete.prototype.selectionEnforceEvent=null;YAHOO.widget.AutoComplete.prototype.containerCollapseEvent=null;YAHOO.widget.AutoComplete.prototype.textboxBlurEvent=null;YAHOO.widget.AutoComplete._nIndex=0;YAHOO.widget.AutoComplete.prototype._sName=null;YAHOO.widget.AutoComplete.prototype._elTextbox=null;YAHOO.widget.AutoComplete.prototype._elContainer=null;YAHOO.widget.AutoComplete.prototype._elContent=null;YAHOO.widget.AutoComplete.prototype._elHeader=null;YAHOO.widget.AutoComplete.prototype._elBody=null;YAHOO.widget.AutoComplete.prototype._elFooter=null;YAHOO.widget.AutoComplete.prototype._elShadow=null;YAHOO.widget.AutoComplete.prototype._elIFrame=null;YAHOO.widget.AutoComplete.prototype._bFocused=true;YAHOO.widget.AutoComplete.prototype._oAnim=null;YAHOO.widget.AutoComplete.prototype._bContainerOpen=false;YAHOO.widget.AutoComplete.prototype._bOverContainer=false;YAHOO.widget.AutoComplete.prototype._aListItems=null;YAHOO.widget.AutoComplete.prototype._nDisplayedItems=0;YAHOO.widget.AutoComplete.prototype._maxResultsDisplayed=0;YAHOO.widget.AutoComplete.prototype._sCurQuery=null;YAHOO.widget.AutoComplete.prototype._sSavedQuery=null;YAHOO.widget.AutoComplete.prototype._oCurItem=null;YAHOO.widget.AutoComplete.prototype._bItemSelected=false;YAHOO.widget.AutoComplete.prototype._nKeyCode=null;YAHOO.widget.AutoComplete.prototype._nDelayID=-1;YAHOO.widget.AutoComplete.prototype._iFrameSrc="javascript:false;";YAHOO.widget.AutoComplete.prototype._queryInterval=null;YAHOO.widget.AutoComplete.prototype._sLastTextboxValue=null;YAHOO.widget.AutoComplete.prototype._initProps=function(){var B=this.minQueryLength;if(!YAHOO.lang.isNumber(B)){this.minQueryLength=1;}var D=this.maxResultsDisplayed;if(!YAHOO.lang.isNumber(D)||(D<1)){this.maxResultsDisplayed=10;}var E=this.queryDelay;if(!YAHOO.lang.isNumber(E)||(E<0)){this.queryDelay=0.2;}var A=this.delimChar;if(YAHOO.lang.isString(A)&&(A.length>0)){this.delimChar=[A];}else{if(!YAHOO.lang.isArray(A)){this.delimChar=null;}}var C=this.animSpeed;if((this.animHoriz||this.animVert)&&YAHOO.util.Anim){if(!YAHOO.lang.isNumber(C)||(C<0)){this.animSpeed=0.3;}if(!this._oAnim){this._oAnim=new YAHOO.util.Anim(this._elContent,{},this.animSpeed);}else{this._oAnim.duration=this.animSpeed;}}if(this.forceSelection&&A){}};YAHOO.widget.AutoComplete.prototype._initContainerHelpers=function(){if(this.useShadow&&!this._elShadow){var A=document.createElement("div");A.className="yui-ac-shadow";this._elShadow=this._elContainer.appendChild(A);}if(this.useIFrame&&!this._elIFrame){var B=document.createElement("iframe");B.src=this._iFrameSrc;B.frameBorder=0;B.scrolling="no";B.style.position="absolute";B.style.width="100%";B.style.height="100%";B.tabIndex=-1;this._elIFrame=this._elContainer.appendChild(B);}};YAHOO.widget.AutoComplete.prototype._initContainer=function(){YAHOO.util.Dom.addClass(this._elContainer,"yui-ac-container");if(!this._elContent){var C=document.createElement("div");C.className="yui-ac-content";C.style.display="none";this._elContent=this._elContainer.appendChild(C);var B=document.createElement("div");B.className="yui-ac-hd";B.style.display="none";this._elHeader=this._elContent.appendChild(B);var D=document.createElement("div");D.className="yui-ac-bd";this._elBody=this._elContent.appendChild(D);var A=document.createElement("div");A.className="yui-ac-ft";A.style.display="none";this._elFooter=this._elContent.appendChild(A);}else{}};YAHOO.widget.AutoComplete.prototype._initList=function(){this._aListItems=[];while(this._elBody.hasChildNodes()){var B=this.getListItems();if(B){for(var A=B.length-1;A>=0;A--){B[A]=null;}}this._elBody.innerHTML="";}var E=document.createElement("ul");E=this._elBody.appendChild(E);for(var C=0;C<this.maxResultsDisplayed;C++){var D=document.createElement("li");D=E.appendChild(D);this._aListItems[C]=D;this._initListItem(D,C);}this._maxResultsDisplayed=this.maxResultsDisplayed;};YAHOO.widget.AutoComplete.prototype._initListItem=function(C,B){var A=this;C.style.display="none";C._nItemIndex=B;C.mouseover=C.mouseout=C.onclick=null;YAHOO.util.Event.addListener(C,"mouseover",A._onItemMouseover,A);YAHOO.util.Event.addListener(C,"mouseout",A._onItemMouseout,A);YAHOO.util.Event.addListener(C,"click",A._onItemMouseclick,A);};YAHOO.widget.AutoComplete.prototype._onIMEDetected=function(A){A._enableIntervalDetection();};YAHOO.widget.AutoComplete.prototype._enableIntervalDetection=function(){var A=this._elTextbox.value;var B=this._sLastTextboxValue;if(A!=B){this._sLastTextboxValue=A;this._sendQuery(A);}};YAHOO.widget.AutoComplete.prototype._cancelIntervalDetection=function(A){if(A._queryInterval){clearInterval(A._queryInterval);}};YAHOO.widget.AutoComplete.prototype._isIgnoreKey=function(A){if((A==9)||(A==13)||(A==16)||(A==17)||(A>=18&&A<=20)||(A==27)||(A>=33&&A<=35)||(A>=36&&A<=40)||(A>=44&&A<=45)){return true;}return false;};YAHOO.widget.AutoComplete.prototype._sendQuery=function(G){if(this.minQueryLength==-1){this._toggleContainer(false);return ;}var C=(this.delimChar)?this.delimChar:null;if(C){var E=-1;for(var B=C.length-1;B>=0;B--){var F=G.lastIndexOf(C[B]);if(F>E){E=F;
}}if(C[B]==" "){for(var A=C.length-1;A>=0;A--){if(G[E-1]==C[A]){E--;break;}}}if(E>-1){var D=E+1;while(G.charAt(D)==" "){D+=1;}this._sSavedQuery=G.substring(0,D);G=G.substr(D);}else{if(G.indexOf(this._sSavedQuery)<0){this._sSavedQuery=null;}}}if((G&&(G.length<this.minQueryLength))||(!G&&this.minQueryLength>0)){if(this._nDelayID!=-1){clearTimeout(this._nDelayID);}this._toggleContainer(false);return ;}G=encodeURIComponent(G);this._nDelayID=-1;G=this.doBeforeSendQuery(G);this.dataRequestEvent.fire(this,G);this.dataSource.getResults(this._populateList,G,this);};YAHOO.widget.AutoComplete.prototype._populateList=function(K,L,I){if(L===null){I.dataErrorEvent.fire(I,K);}if(!I._bFocused||!L){return ;}var A=(navigator.userAgent.toLowerCase().indexOf("opera")!=-1);var O=I._elContent.style;O.width=(!A)?null:"";O.height=(!A)?null:"";var H=decodeURIComponent(K);I._sCurQuery=H;I._bItemSelected=false;if(I._maxResultsDisplayed!=I.maxResultsDisplayed){I._initList();}var C=Math.min(L.length,I.maxResultsDisplayed);I._nDisplayedItems=C;if(C>0){I._initContainerHelpers();var D=I._aListItems;for(var G=C-1;G>=0;G--){var N=D[G];var B=L[G];N.innerHTML=I.formatResult(B,H);N.style.display="list-item";N._sResultKey=B[0];N._oResultData=B;}for(var F=D.length-1;F>=C;F--){var M=D[F];M.innerHTML=null;M.style.display="none";M._sResultKey=null;M._oResultData=null;}var J=I.doBeforeExpandContainer(I._elTextbox,I._elContainer,K,L);I._toggleContainer(J);if(I.autoHighlight){var E=D[0];I._toggleHighlight(E,"to");I.itemArrowToEvent.fire(I,E);I._typeAhead(E,K);}else{I._oCurItem=null;}}else{I._toggleContainer(false);}I.dataReturnEvent.fire(I,K,L);};YAHOO.widget.AutoComplete.prototype._clearSelection=function(){var C=this._elTextbox.value;var B=(this.delimChar)?this.delimChar[0]:null;var A=(B)?C.lastIndexOf(B,C.length-2):-1;if(A>-1){this._elTextbox.value=C.substring(0,A);}else{this._elTextbox.value="";}this._sSavedQuery=this._elTextbox.value;this.selectionEnforceEvent.fire(this);};YAHOO.widget.AutoComplete.prototype._textMatchesOption=function(){var D=null;for(var A=this._nDisplayedItems-1;A>=0;A--){var C=this._aListItems[A];var B=C._sResultKey.toLowerCase();if(B==this._sCurQuery.toLowerCase()){D=C;break;}}return(D);};YAHOO.widget.AutoComplete.prototype._typeAhead=function(D,G){if(!this.typeAhead||(this._nKeyCode==8)){return ;}var F=this._elTextbox;var E=this._elTextbox.value;if(!F.setSelectionRange&&!F.createTextRange){return ;}var B=E.length;this._updateValue(D);var C=F.value.length;this._selectText(F,B,C);var A=F.value.substr(B,C);this.typeAheadEvent.fire(this,G,A);};YAHOO.widget.AutoComplete.prototype._selectText=function(D,A,B){if(D.setSelectionRange){D.setSelectionRange(A,B);}else{if(D.createTextRange){var C=D.createTextRange();C.moveStart("character",A);C.moveEnd("character",B-D.value.length);C.select();}else{D.select();}}};YAHOO.widget.AutoComplete.prototype._toggleContainerHelpers=function(B){var D=false;var C=this._elContent.offsetWidth+"px";var A=this._elContent.offsetHeight+"px";if(this.useIFrame&&this._elIFrame){D=true;if(B){this._elIFrame.style.width=C;this._elIFrame.style.height=A;}else{this._elIFrame.style.width=0;this._elIFrame.style.height=0;}}if(this.useShadow&&this._elShadow){D=true;if(B){this._elShadow.style.width=C;this._elShadow.style.height=A;}else{this._elShadow.style.width=0;this._elShadow.style.height=0;}}};YAHOO.widget.AutoComplete.prototype._toggleContainer=function(K){var E=this._elContainer;if(this.alwaysShowContainer&&this._bContainerOpen){return ;}if(!K){this._elContent.scrollTop=0;var C=this._aListItems;if(C&&(C.length>0)){for(var H=C.length-1;H>=0;H--){C[H].style.display="none";}}if(this._oCurItem){this._toggleHighlight(this._oCurItem,"from");}this._oCurItem=null;this._nDisplayedItems=0;this._sCurQuery=null;}if(!K&&!this._bContainerOpen){this._elContent.style.display="none";return ;}var B=this._oAnim;if(B&&B.getEl()&&(this.animHoriz||this.animVert)){if(!K){this._toggleContainerHelpers(K);}if(B.isAnimated()){B.stop();}var I=this._elContent.cloneNode(true);E.appendChild(I);I.style.top="-9000px";I.style.display="block";var G=I.offsetWidth;var D=I.offsetHeight;var A=(this.animHoriz)?0:G;var F=(this.animVert)?0:D;B.attributes=(K)?{width:{to:G},height:{to:D}}:{width:{to:A},height:{to:F}};if(K&&!this._bContainerOpen){this._elContent.style.width=A+"px";this._elContent.style.height=F+"px";}else{this._elContent.style.width=G+"px";this._elContent.style.height=D+"px";}E.removeChild(I);I=null;var J=this;var L=function(){B.onComplete.unsubscribeAll();if(K){J.containerExpandEvent.fire(J);}else{J._elContent.style.display="none";J.containerCollapseEvent.fire(J);}J._toggleContainerHelpers(K);};this._elContent.style.display="block";B.onComplete.subscribe(L);B.animate();this._bContainerOpen=K;}else{if(K){this._elContent.style.display="block";this.containerExpandEvent.fire(this);}else{this._elContent.style.display="none";this.containerCollapseEvent.fire(this);}this._toggleContainerHelpers(K);this._bContainerOpen=K;}};YAHOO.widget.AutoComplete.prototype._toggleHighlight=function(A,C){var B=this.highlightClassName;if(this._oCurItem){YAHOO.util.Dom.removeClass(this._oCurItem,B);}if((C=="to")&&B){YAHOO.util.Dom.addClass(A,B);this._oCurItem=A;}};YAHOO.widget.AutoComplete.prototype._togglePrehighlight=function(A,C){if(A==this._oCurItem){return ;}var B=this.prehighlightClassName;if((C=="mouseover")&&B){YAHOO.util.Dom.addClass(A,B);}else{YAHOO.util.Dom.removeClass(A,B);}};YAHOO.widget.AutoComplete.prototype._updateValue=function(E){var F=this._elTextbox;var D=(this.delimChar)?(this.delimChar[0]||this.delimChar):null;var B=this._sSavedQuery;var C=E._sResultKey;F.focus();F.value="";if(D){if(B){F.value=B;}F.value+=C+D;if(D!=" "){F.value+=" ";}}else{F.value=C;}if(F.type=="textarea"){F.scrollTop=F.scrollHeight;}var A=F.value.length;this._selectText(F,A,A);this._oCurItem=E;};YAHOO.widget.AutoComplete.prototype._selectItem=function(A){this._bItemSelected=true;this._updateValue(A);this._cancelIntervalDetection(this);this.itemSelectEvent.fire(this,A,A._oResultData);
this._toggleContainer(false);};YAHOO.widget.AutoComplete.prototype._jumpSelection=function(){if(this._oCurItem){this._selectItem(this._oCurItem);}else{this._toggleContainer(false);}};YAHOO.widget.AutoComplete.prototype._moveSelection=function(G){if(this._bContainerOpen){var E=this._oCurItem;var F=-1;if(E){F=E._nItemIndex;}var D=(G==40)?(F+1):(F-1);if(D<-2||D>=this._nDisplayedItems){return ;}if(E){this._toggleHighlight(E,"from");this.itemArrowFromEvent.fire(this,E);}if(D==-1){if(this.delimChar&&this._sSavedQuery){if(!this._textMatchesOption()){this._elTextbox.value=this._sSavedQuery;}else{this._elTextbox.value=this._sSavedQuery+this._sCurQuery;}}else{this._elTextbox.value=this._sCurQuery;}this._oCurItem=null;return ;}if(D==-2){this._toggleContainer(false);return ;}var C=this._aListItems[D];var A=this._elContent;var B=((YAHOO.util.Dom.getStyle(A,"overflow")=="auto")||(YAHOO.util.Dom.getStyle(A,"overflowY")=="auto"));if(B&&(D>-1)&&(D<this._nDisplayedItems)){if(G==40){if((C.offsetTop+C.offsetHeight)>(A.scrollTop+A.offsetHeight)){A.scrollTop=(C.offsetTop+C.offsetHeight)-A.offsetHeight;}else{if((C.offsetTop+C.offsetHeight)<A.scrollTop){A.scrollTop=C.offsetTop;}}}else{if(C.offsetTop<A.scrollTop){this._elContent.scrollTop=C.offsetTop;}else{if(C.offsetTop>(A.scrollTop+A.offsetHeight)){this._elContent.scrollTop=(C.offsetTop+C.offsetHeight)-A.offsetHeight;}}}}this._toggleHighlight(C,"to");this.itemArrowToEvent.fire(this,C);if(this.typeAhead){this._updateValue(C);}}};YAHOO.widget.AutoComplete.prototype._onItemMouseover=function(A,B){if(B.prehighlightClassName){B._togglePrehighlight(this,"mouseover");}else{B._toggleHighlight(this,"to");}B.itemMouseOverEvent.fire(B,this);};YAHOO.widget.AutoComplete.prototype._onItemMouseout=function(A,B){if(B.prehighlightClassName){B._togglePrehighlight(this,"mouseout");}else{B._toggleHighlight(this,"from");}B.itemMouseOutEvent.fire(B,this);};YAHOO.widget.AutoComplete.prototype._onItemMouseclick=function(A,B){B._toggleHighlight(this,"to");B._selectItem(this);};YAHOO.widget.AutoComplete.prototype._onContainerMouseover=function(A,B){B._bOverContainer=true;};YAHOO.widget.AutoComplete.prototype._onContainerMouseout=function(A,B){B._bOverContainer=false;if(B._oCurItem){B._toggleHighlight(B._oCurItem,"to");}};YAHOO.widget.AutoComplete.prototype._onContainerScroll=function(A,B){B._elTextbox.focus();};YAHOO.widget.AutoComplete.prototype._onContainerResize=function(A,B){B._toggleContainerHelpers(B._bContainerOpen);};YAHOO.widget.AutoComplete.prototype._onTextboxKeyDown=function(A,B){var C=A.keyCode;switch(C){case 9:if((navigator.userAgent.toLowerCase().indexOf("mac")==-1)){if(B._oCurItem){if(B.delimChar&&(B._nKeyCode!=C)){if(B._bContainerOpen){YAHOO.util.Event.stopEvent(A);}}B._selectItem(B._oCurItem);}else{B._toggleContainer(false);}}break;case 13:if((navigator.userAgent.toLowerCase().indexOf("mac")==-1)){if(B._oCurItem){if(B._nKeyCode!=C){if(B._bContainerOpen){YAHOO.util.Event.stopEvent(A);}}B._selectItem(B._oCurItem);}else{B._toggleContainer(false);}}break;case 27:B._toggleContainer(false);return ;case 39:B._jumpSelection();break;case 38:YAHOO.util.Event.stopEvent(A);B._moveSelection(C);break;case 40:YAHOO.util.Event.stopEvent(A);B._moveSelection(C);break;default:break;}};YAHOO.widget.AutoComplete.prototype._onTextboxKeyPress=function(A,B){var C=A.keyCode;if((navigator.userAgent.toLowerCase().indexOf("mac")!=-1)){switch(C){case 9:if(B._oCurItem){if(B.delimChar&&(B._nKeyCode!=C)){if(B._bContainerOpen){YAHOO.util.Event.stopEvent(A);}}B._selectItem(B._oCurItem);}else{B._toggleContainer(false);}break;case 13:if(B._oCurItem){if(B._nKeyCode!=C){if(B._bContainerOpen){YAHOO.util.Event.stopEvent(A);}}B._selectItem(B._oCurItem);}else{B._toggleContainer(false);}break;default:break;}}else{if(C==229){B._queryInterval=setInterval(function(){B._onIMEDetected(B);},500);}}};YAHOO.widget.AutoComplete.prototype._onTextboxKeyUp=function(B,D){D._initProps();var E=B.keyCode;D._nKeyCode=E;var C=this.value;if(D._isIgnoreKey(E)||(C.toLowerCase()==D._sCurQuery)){return ;}else{D._bItemSelected=false;YAHOO.util.Dom.removeClass(D._oCurItem,D.highlightClassName);D._oCurItem=null;D.textboxKeyEvent.fire(D,E);}if(D.queryDelay>0){var A=setTimeout(function(){D._sendQuery(C);},(D.queryDelay*1000));if(D._nDelayID!=-1){clearTimeout(D._nDelayID);}D._nDelayID=A;}else{D._sendQuery(C);}};YAHOO.widget.AutoComplete.prototype._onTextboxFocus=function(A,B){B._elTextbox.setAttribute("autocomplete","off");B._bFocused=true;if(!B._bItemSelected){B.textboxFocusEvent.fire(B);}};YAHOO.widget.AutoComplete.prototype._onTextboxBlur=function(A,B){if(!B._bOverContainer||(B._nKeyCode==9)){if(!B._bItemSelected){var C=B._textMatchesOption();if(!B._bContainerOpen||(B._bContainerOpen&&(C===null))){if(B.forceSelection){B._clearSelection();}else{B.unmatchedItemSelectEvent.fire(B);}}else{if(B.forceSelection){B._selectItem(C);}}}if(B._bContainerOpen){B._toggleContainer(false);}B._cancelIntervalDetection(B);B._bFocused=false;B.textboxBlurEvent.fire(B);}};YAHOO.widget.AutoComplete.prototype._onWindowUnload=function(A,B){if(B&&B._elTextbox&&B.allowBrowserAutocomplete){B._elTextbox.setAttribute("autocomplete","on");}};YAHOO.widget.DataSource=function(){};YAHOO.widget.DataSource.ERROR_DATANULL="Response data was null";YAHOO.widget.DataSource.ERROR_DATAPARSE="Response data could not be parsed";YAHOO.widget.DataSource.prototype.maxCacheEntries=15;YAHOO.widget.DataSource.prototype.queryMatchContains=false;YAHOO.widget.DataSource.prototype.queryMatchSubset=false;YAHOO.widget.DataSource.prototype.queryMatchCase=false;YAHOO.widget.DataSource.prototype.toString=function(){return"DataSource "+this._sName;};YAHOO.widget.DataSource.prototype.getResults=function(A,D,B){var C=this._doQueryCache(A,D,B);if(C.length===0){this.queryEvent.fire(this,B,D);this.doQuery(A,D,B);}};YAHOO.widget.DataSource.prototype.doQuery=function(A,C,B){};YAHOO.widget.DataSource.prototype.flushCache=function(){if(this._aCache){this._aCache=[];}if(this._aCacheHelper){this._aCacheHelper=[];
}this.cacheFlushEvent.fire(this);};YAHOO.widget.DataSource.prototype.queryEvent=null;YAHOO.widget.DataSource.prototype.cacheQueryEvent=null;YAHOO.widget.DataSource.prototype.getResultsEvent=null;YAHOO.widget.DataSource.prototype.getCachedResultsEvent=null;YAHOO.widget.DataSource.prototype.dataErrorEvent=null;YAHOO.widget.DataSource.prototype.cacheFlushEvent=null;YAHOO.widget.DataSource._nIndex=0;YAHOO.widget.DataSource.prototype._sName=null;YAHOO.widget.DataSource.prototype._aCache=null;YAHOO.widget.DataSource.prototype._init=function(){var A=this.maxCacheEntries;if(!YAHOO.lang.isNumber(A)||(A<0)){A=0;}if(A>0&&!this._aCache){this._aCache=[];}this._sName="instance"+YAHOO.widget.DataSource._nIndex;YAHOO.widget.DataSource._nIndex++;this.queryEvent=new YAHOO.util.CustomEvent("query",this);this.cacheQueryEvent=new YAHOO.util.CustomEvent("cacheQuery",this);this.getResultsEvent=new YAHOO.util.CustomEvent("getResults",this);this.getCachedResultsEvent=new YAHOO.util.CustomEvent("getCachedResults",this);this.dataErrorEvent=new YAHOO.util.CustomEvent("dataError",this);this.cacheFlushEvent=new YAHOO.util.CustomEvent("cacheFlush",this);};YAHOO.widget.DataSource.prototype._addCacheElem=function(B){var A=this._aCache;if(!A||!B||!B.query||!B.results){return ;}if(A.length>=this.maxCacheEntries){A.shift();}A.push(B);};YAHOO.widget.DataSource.prototype._doQueryCache=function(A,I,N){var H=[];var G=false;var J=this._aCache;var F=(J)?J.length:0;var K=this.queryMatchContains;var D;if((this.maxCacheEntries>0)&&J&&(F>0)){this.cacheQueryEvent.fire(this,N,I);if(!this.queryMatchCase){D=I;I=I.toLowerCase();}for(var P=F-1;P>=0;P--){var E=J[P];var B=E.results;var C=(!this.queryMatchCase)?encodeURIComponent(E.query).toLowerCase():encodeURIComponent(E.query);if(C==I){G=true;H=B;if(P!=F-1){J.splice(P,1);this._addCacheElem(E);}break;}else{if(this.queryMatchSubset){for(var O=I.length-1;O>=0;O--){var R=I.substr(0,O);if(C==R){G=true;for(var M=B.length-1;M>=0;M--){var Q=B[M];var L=(this.queryMatchCase)?encodeURIComponent(Q[0]).indexOf(I):encodeURIComponent(Q[0]).toLowerCase().indexOf(I);if((!K&&(L===0))||(K&&(L>-1))){H.unshift(Q);}}E={};E.query=I;E.results=H;this._addCacheElem(E);break;}}if(G){break;}}}}if(G){this.getCachedResultsEvent.fire(this,N,D,H);A(D,H,N);}}return H;};YAHOO.widget.DS_XHR=function(C,A,D){if(D&&(D.constructor==Object)){for(var B in D){this[B]=D[B];}}if(!YAHOO.lang.isArray(A)||!YAHOO.lang.isString(C)){return ;}this.schema=A;this.scriptURI=C;this._init();};YAHOO.widget.DS_XHR.prototype=new YAHOO.widget.DataSource();YAHOO.widget.DS_XHR.TYPE_JSON=0;YAHOO.widget.DS_XHR.TYPE_XML=1;YAHOO.widget.DS_XHR.TYPE_FLAT=2;YAHOO.widget.DS_XHR.ERROR_DATAXHR="XHR response failed";YAHOO.widget.DS_XHR.prototype.connMgr=YAHOO.util.Connect;YAHOO.widget.DS_XHR.prototype.connTimeout=0;YAHOO.widget.DS_XHR.prototype.scriptURI=null;YAHOO.widget.DS_XHR.prototype.scriptQueryParam="query";YAHOO.widget.DS_XHR.prototype.scriptQueryAppend="";YAHOO.widget.DS_XHR.prototype.responseType=YAHOO.widget.DS_XHR.TYPE_JSON;YAHOO.widget.DS_XHR.prototype.responseStripAfter="\n<!-";YAHOO.widget.DS_XHR.prototype.doQuery=function(E,G,B){var J=(this.responseType==YAHOO.widget.DS_XHR.TYPE_XML);var D=this.scriptURI+"?"+this.scriptQueryParam+"="+G;if(this.scriptQueryAppend.length>0){D+="&"+this.scriptQueryAppend;}var C=null;var F=this;var I=function(K){if(!F._oConn||(K.tId!=F._oConn.tId)){F.dataErrorEvent.fire(F,B,G,YAHOO.widget.DataSource.ERROR_DATANULL);return ;}for(var N in K){}if(!J){K=K.responseText;}else{K=K.responseXML;}if(K===null){F.dataErrorEvent.fire(F,B,G,YAHOO.widget.DataSource.ERROR_DATANULL);return ;}var M=F.parseResponse(G,K,B);var L={};L.query=decodeURIComponent(G);L.results=M;if(M===null){F.dataErrorEvent.fire(F,B,G,YAHOO.widget.DataSource.ERROR_DATAPARSE);M=[];}else{F.getResultsEvent.fire(F,B,G,M);F._addCacheElem(L);}E(G,M,B);};var A=function(K){F.dataErrorEvent.fire(F,B,G,YAHOO.widget.DS_XHR.ERROR_DATAXHR);return ;};var H={success:I,failure:A};if(YAHOO.lang.isNumber(this.connTimeout)&&(this.connTimeout>0)){H.timeout=this.connTimeout;}if(this._oConn){this.connMgr.abort(this._oConn);}F._oConn=this.connMgr.asyncRequest("GET",D,H,null);};YAHOO.widget.DS_XHR.prototype.parseResponse=function(sQuery,oResponse,oParent){var aSchema=this.schema;var aResults=[];var bError=false;var nEnd=((this.responseStripAfter!=="")&&(oResponse.indexOf))?oResponse.indexOf(this.responseStripAfter):-1;if(nEnd!=-1){oResponse=oResponse.substring(0,nEnd);}switch(this.responseType){case YAHOO.widget.DS_XHR.TYPE_JSON:var jsonList,jsonObjParsed;if(YAHOO.lang.JSON){jsonObjParsed=YAHOO.lang.JSON.parse(oResponse);if(!jsonObjParsed){bError=true;break;}else{try{jsonList=eval("jsonObjParsed."+aSchema[0]);}catch(e){bError=true;break;}}}else{if(oResponse.parseJSON){jsonObjParsed=oResponse.parseJSON();if(!jsonObjParsed){bError=true;}else{try{jsonList=eval("jsonObjParsed."+aSchema[0]);}catch(e){bError=true;break;}}}else{if(window.JSON){jsonObjParsed=JSON.parse(oResponse);if(!jsonObjParsed){bError=true;break;}else{try{jsonList=eval("jsonObjParsed."+aSchema[0]);}catch(e){bError=true;break;}}}else{try{while(oResponse.substring(0,1)==" "){oResponse=oResponse.substring(1,oResponse.length);}if(oResponse.indexOf("{")<0){bError=true;break;}if(oResponse.indexOf("{}")===0){break;}var jsonObjRaw=eval("("+oResponse+")");if(!jsonObjRaw){bError=true;break;}jsonList=eval("(jsonObjRaw."+aSchema[0]+")");}catch(e){bError=true;break;}}}}if(!jsonList){bError=true;break;}if(!YAHOO.lang.isArray(jsonList)){jsonList=[jsonList];}for(var i=jsonList.length-1;i>=0;i--){var aResultItem=[];var jsonResult=jsonList[i];for(var j=aSchema.length-1;j>=1;j--){var dataFieldValue=jsonResult[aSchema[j]];if(!dataFieldValue){dataFieldValue="";}aResultItem.unshift(dataFieldValue);}if(aResultItem.length==1){aResultItem.push(jsonResult);}aResults.unshift(aResultItem);}break;case YAHOO.widget.DS_XHR.TYPE_XML:var xmlList=oResponse.getElementsByTagName(aSchema[0]);if(!xmlList){bError=true;break;}for(var k=xmlList.length-1;k>=0;k--){var result=xmlList.item(k);
var aFieldSet=[];for(var m=aSchema.length-1;m>=1;m--){var sValue=null;var xmlAttr=result.attributes.getNamedItem(aSchema[m]);if(xmlAttr){sValue=xmlAttr.value;}else{var xmlNode=result.getElementsByTagName(aSchema[m]);if(xmlNode&&xmlNode.item(0)&&xmlNode.item(0).firstChild){sValue=xmlNode.item(0).firstChild.nodeValue;}else{sValue="";}}aFieldSet.unshift(sValue);}aResults.unshift(aFieldSet);}break;case YAHOO.widget.DS_XHR.TYPE_FLAT:if(oResponse.length>0){var newLength=oResponse.length-aSchema[0].length;if(oResponse.substr(newLength)==aSchema[0]){oResponse=oResponse.substr(0,newLength);}if(oResponse.length>0){var aRecords=oResponse.split(aSchema[0]);for(var n=aRecords.length-1;n>=0;n--){if(aRecords[n].length>0){aResults[n]=aRecords[n].split(aSchema[1]);}}}}break;default:break;}sQuery=null;oResponse=null;oParent=null;if(bError){return null;}else{return aResults;}};YAHOO.widget.DS_XHR.prototype._oConn=null;YAHOO.widget.DS_ScriptNode=function(D,A,C){if(C&&(C.constructor==Object)){for(var B in C){this[B]=C[B];}}if(!YAHOO.lang.isArray(A)||!YAHOO.lang.isString(D)){return ;}this.schema=A;this.scriptURI=D;this._init();};YAHOO.widget.DS_ScriptNode.prototype=new YAHOO.widget.DataSource();YAHOO.widget.DS_ScriptNode.prototype.getUtility=YAHOO.util.Get;YAHOO.widget.DS_ScriptNode.prototype.scriptURI=null;YAHOO.widget.DS_ScriptNode.prototype.scriptQueryParam="query";YAHOO.widget.DS_ScriptNode.prototype.asyncMode="allowAll";YAHOO.widget.DS_ScriptNode.prototype.scriptCallbackParam="callback";YAHOO.widget.DS_ScriptNode.callbacks=[];YAHOO.widget.DS_ScriptNode._nId=0;YAHOO.widget.DS_ScriptNode._nPending=0;YAHOO.widget.DS_ScriptNode.prototype.doQuery=function(A,F,C){var B=this;if(YAHOO.widget.DS_ScriptNode._nPending===0){YAHOO.widget.DS_ScriptNode.callbacks=[];YAHOO.widget.DS_ScriptNode._nId=0;}var E=YAHOO.widget.DS_ScriptNode._nId;YAHOO.widget.DS_ScriptNode._nId++;YAHOO.widget.DS_ScriptNode.callbacks[E]=function(G){if((B.asyncMode!=="ignoreStaleResponses")||(E===YAHOO.widget.DS_ScriptNode.callbacks.length-1)){B.handleResponse(G,A,F,C);}else{}delete YAHOO.widget.DS_ScriptNode.callbacks[E];};YAHOO.widget.DS_ScriptNode._nPending++;var D=this.scriptURI+"&"+this.scriptQueryParam+"="+F+"&"+this.scriptCallbackParam+"=YAHOO.widget.DS_ScriptNode.callbacks["+E+"]";this.getUtility.script(D,{autopurge:true,onsuccess:YAHOO.widget.DS_ScriptNode._bumpPendingDown,onfail:YAHOO.widget.DS_ScriptNode._bumpPendingDown});};YAHOO.widget.DS_ScriptNode.prototype.handleResponse=function(oResponse,oCallbackFn,sQuery,oParent){var aSchema=this.schema;var aResults=[];var bError=false;var jsonList,jsonObjParsed;try{jsonList=eval("(oResponse."+aSchema[0]+")");}catch(e){bError=true;}if(!jsonList){bError=true;jsonList=[];}else{if(!YAHOO.lang.isArray(jsonList)){jsonList=[jsonList];}}for(var i=jsonList.length-1;i>=0;i--){var aResultItem=[];var jsonResult=jsonList[i];for(var j=aSchema.length-1;j>=1;j--){var dataFieldValue=jsonResult[aSchema[j]];if(!dataFieldValue){dataFieldValue="";}aResultItem.unshift(dataFieldValue);}if(aResultItem.length==1){aResultItem.push(jsonResult);}aResults.unshift(aResultItem);}if(bError){aResults=null;}if(aResults===null){this.dataErrorEvent.fire(this,oParent,sQuery,YAHOO.widget.DataSource.ERROR_DATAPARSE);aResults=[];}else{var resultObj={};resultObj.query=decodeURIComponent(sQuery);resultObj.results=aResults;this._addCacheElem(resultObj);this.getResultsEvent.fire(this,oParent,sQuery,aResults);}oCallbackFn(sQuery,aResults,oParent);};YAHOO.widget.DS_ScriptNode._bumpPendingDown=function(){YAHOO.widget.DS_ScriptNode._nPending--;};YAHOO.widget.DS_JSFunction=function(A,C){if(C&&(C.constructor==Object)){for(var B in C){this[B]=C[B];}}if(!YAHOO.lang.isFunction(A)){return ;}else{this.dataFunction=A;this._init();}};YAHOO.widget.DS_JSFunction.prototype=new YAHOO.widget.DataSource();YAHOO.widget.DS_JSFunction.prototype.dataFunction=null;YAHOO.widget.DS_JSFunction.prototype.doQuery=function(C,F,D){var B=this.dataFunction;var E=[];E=B(F);if(E===null){this.dataErrorEvent.fire(this,D,F,YAHOO.widget.DataSource.ERROR_DATANULL);return ;}var A={};A.query=decodeURIComponent(F);A.results=E;this._addCacheElem(A);this.getResultsEvent.fire(this,D,F,E);C(F,E,D);return ;};YAHOO.widget.DS_JSArray=function(A,C){if(C&&(C.constructor==Object)){for(var B in C){this[B]=C[B];}}if(!YAHOO.lang.isArray(A)){return ;}else{this.data=A;this._init();}};YAHOO.widget.DS_JSArray.prototype=new YAHOO.widget.DataSource();YAHOO.widget.DS_JSArray.prototype.data=null;YAHOO.widget.DS_JSArray.prototype.doQuery=function(E,I,A){var F;var C=this.data;var J=[];var D=false;var B=this.queryMatchContains;if(I){if(!this.queryMatchCase){I=I.toLowerCase();}for(F=C.length-1;F>=0;F--){var H=[];if(YAHOO.lang.isString(C[F])){H[0]=C[F];}else{if(YAHOO.lang.isArray(C[F])){H=C[F];}}if(YAHOO.lang.isString(H[0])){var G=(this.queryMatchCase)?encodeURIComponent(H[0]).indexOf(I):encodeURIComponent(H[0]).toLowerCase().indexOf(I);if((!B&&(G===0))||(B&&(G>-1))){J.unshift(H);}}}}else{for(F=C.length-1;F>=0;F--){if(YAHOO.lang.isString(C[F])){J.unshift([C[F]]);}else{if(YAHOO.lang.isArray(C[F])){J.unshift(C[F]);}}}}this.getResultsEvent.fire(this,A,I,J);E(I,J,A);};YAHOO.register("autocomplete",YAHOO.widget.AutoComplete,{version:"2.5.2",build:"1076"});
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
* @author		Stephan Tijink <stijink@googlemail.com>
* @version      2.0.3
*/
function cpaint() {
  /**
  * CPAINT version
  * 
  * @access     protected
  * @var        string      version
  */
  this.version = '2.0.3';
  
  /**
  * configuration options both for this class but also for  the cpaint_call() objects.
  *
  * @access     protected
  * @var        array       config
  */
  var config                      = new Array();
  config['debugging']             = -1;
  config['proxy_url']             = '';
  config['transfer_mode']         = 'GET';
  config['async']                 = true;
  config['response_type']         = 'OBJECT';
  config['persistent_connection'] = false;
  config['use_cpaint_api']        = true;
  
  /**
  * maintains the next free index in the stack
  *
  * @access   protected
  * @var      integer   stack_count
  */
  var stack_count = 0;

  /**
  * property returns whether or not the browser is AJAX capable
  * 
  * @access		public
  * @return		boolean
  */
  this.capable = test_ajax_capability();
  
  /**
  * switches debug mode on/off.
  *
  * @access   public
  * @param    boolean    debug    debug flag
  * @return   void
  */
  this.set_debug = function() {
    
    if (typeof arguments[0] == 'boolean') {
      if (arguments[0] === true) {
        config['debugging'] = 1;

      } else {
        config['debugging'] = 0;
      }
      
    } else if (typeof arguments[0] == 'number') {
      config['debugging'] = Math.round(arguments[0]);
    }
  }

  /**
  * defines the URL of the proxy script.
  *
  * @access   public
  * @param    string    proxy_url    URL of the proxyscript to connect
  * @return   void
  */
  this.set_proxy_url = function() {
    
    if (typeof arguments[0] == 'string') {

      config['proxy_url'] = arguments[0];
    }
  }

  /**
  * sets the transfer_mode (GET|POST).
  *
  * @access   public
  * @param    string    transfer_mode    transfer_mode
  * @return   void
  */
  this.set_transfer_mode = function() {
    
    if (arguments[0].toUpperCase() == 'GET'
      || arguments[0].toUpperCase() == 'POST') {

      config['transfer_mode'] = arguments[0].toUpperCase();
    }
  }

  /**
  * sets the flag whether or not to use asynchronous calls.
  *
  * @access   public
  * @param    boolean    async    syncronization flag
  * @return   void
  */
  this.set_async = function() {
    
    if (typeof arguments[0] == 'boolean') {
      config['async'] = arguments[0];
    }
  }

  /**
  * defines the response type.
  *
  * allowed values are:
  *   TEXT    = raw text response
  *   XML     = raw XMLHttpObject
  *   OBJECT  = parsed JavaScript object structure from XMLHttpObject
  *
  * the default is OBJECT.
  *
  * @access   public
  * @param    string    response_type    response type
  * @return   void
  */
  this.set_response_type = function() {
    
    if (arguments[0].toUpperCase() == 'TEXT'
      || arguments[0].toUpperCase() == 'XML'
      || arguments[0].toUpperCase() == 'OBJECT'
      || arguments[0].toUpperCase() == 'E4X'
      || arguments[0].toUpperCase() == 'JSON') {

      config['response_type'] = arguments[0].toUpperCase();
    }
  }

  /**
  * sets the flag whether or not to use a persistent connection.
  *
  * @access   public
  * @param    boolean    persistent_connection    persistance flag
  * @return   void
  */
  this.set_persistent_connection = function() {
    
    if (typeof arguments[0] == 'boolean') {
      config['persistent_connection'] = arguments[0];
    }
  }
  
  
  /**
  * sets the flag whether or not to use the cpaint api on the backend.
  *
  * @access    public
  * @param     boolean    cpaint_api      api_flag
  * @return    void
  */
  this.set_use_cpaint_api = function() {
    if (typeof arguments[0] == 'boolean') {
      config['use_cpaint_api'] = arguments[0];
    }
  }
  
  /**
  * tests whether one of the necessary implementations
  * of the XMLHttpRequest class are available
  *
  * @access     protected
  * @return     boolean
  */
  function test_ajax_capability() {
    var cpc = new cpaint_call(0, config, this.version);
    return cpc.test_ajax_capability();
  }

  /**
  * takes the arguments supplied and triggers a call to the CPAINT backend
  * based on the settings.
  *
  * upon response cpaint_call.callback() will automatically be called
  * to perform post-processing operations.
  *
  * @access   public
  * @param    string    url                 remote URL to call
  * @param    string    remote_method       remote method to call
  * @param    object    client_callback     client side callback method to deliver the remote response to. do NOT supply a string!
  * @param    mixed     argN                remote parameters from now on
  * @return   void
  */
  this.call = function() {
    //incluido por edmar
	var sUrl = escape(arguments[0]);
	var re = new RegExp("%3F", "g");
	var sUrl = sUrl.replace(re,'?');
	var re = new RegExp("%3D", "g");
	var sUrl = sUrl.replace(re,'=');
	var re = new RegExp("%26", "g");
	var sUrl = sUrl.replace(re,'&');
	var re = new RegExp("%3A", "g");
	var sUrl = sUrl.replace(re,':');
    //alert(sUrl)
    arguments[0] = sUrl;
    //
    var use_stack = -1;
    
    if (config['persistent_connection'] == true
      && __cpaint_stack[0] != null) {

      switch (__cpaint_stack[0].get_http_state()) {
        case -1:
          // no XMLHttpObject object has already been instanciated
          // create new object and configure it
          use_stack = 0;
          debug('no XMLHttpObject object to re-use for persistence, creating new one later', 2);
          break;
          
        case 4:
          // object is ready for a new request, no need to do anything
          use_stack = 0
          debug('re-using the persistent connection', 2);
          break;
          
        default:
          // connection is currently in use, don't do anything
          debug('the persistent connection is in use - skipping this request', 2);
      }
      
    } else if (config['persistent_connection'] == true) {
      // persistent connection is active, but no object has been instanciated
      use_stack = 0;
      __cpaint_stack[use_stack] = new cpaint_call(use_stack, config, this.version);
      debug('no cpaint_call object available for re-use, created new one', 2);
    
    } else {
      // no connection persistance
      use_stack = stack_count;
      __cpaint_stack[use_stack] = new cpaint_call(use_stack, config, this.version);
      debug('no cpaint_call object created new one', 2);
    }

    // configure cpaint_call if allowed to
    if (use_stack != -1) {
      __cpaint_stack[use_stack].set_client_callback(arguments[2]);
      
      // distribute according to proxy use
      if (config['proxy_url'] != '') {
        __cpaint_stack[use_stack].call_proxy(arguments);
      
      } else {
        __cpaint_stack[use_stack].call_direct(arguments);
      }

      // increase stack counter
      stack_count++;
      debug('stack size: ' + __cpaint_stack.length, 2);
    }
  }

  /**
  * debug method
  *
  * @access  protected
  * @param   string       message         the message to debug
  * @param   integer      debug_level     debug level at which the message appears
  * @return  void
  */
  var debug  = function(message, debug_level) {
    var prefix = '[CPAINT Debug] ';
    
    if (debug_level < 1) {
      prefix = '[CPAINT Error] ';
    }
    
    if (config['debugging'] >= debug_level) {
      alert(prefix + message);
    }
  }
}

/**
* internal FIFO stack of cpaint_call() objects.
*
* @access   protected
* @var      array    __cpaint_stack
*/
var __cpaint_stack = new Array();

/**
* local instance of cpaint_transformer
* MSIE is unable to handle static classes... sheesh.
*
* @access   public
* @var      object    __cpaint_transformer
*/
var __cpaint_transformer = new cpaint_transformer();

/**
* transport agent class
*
* creates the request object, takes care of the response, handles the 
* client callback. Is configured by the cpaint() object.
*
* @package      CPAINT
* @access       public
* @copyright    Copyright (c) 2005-2006 Paul Sullivan, Dominique Stender - http://sf.net/projects/cpaint
* @author       Dominique Stender <dstender@st-webdevelopment.de>
* @author       Paul Sullivan <wiley14@gmail.com>
* @param        integer     stack_id      stack Id in cpaint
* @param        array       config        configuration array for this call
* @param        string      version       CPAINT API version
*/
function cpaint_call() {
  /**
  * CPAINT version
  * 
  * @access     protected
  * @var        string      version
  */
  var version = arguments[2];
  
  /**
  * configuration options both for this class objects.
  *
  * @access     protected
  * @var        array       config
  */
  var config                      = new Array();
  config['debugging']             = arguments[1]['debugging'];
  config['proxy_url']             = arguments[1]['proxy_url'];
  config['transfer_mode']         = arguments[1]['transfer_mode'];
  config['async']                 = arguments[1]['async'];
  config['response_type']         = arguments[1]['response_type'];
  config['persistent_connection'] = arguments[1]['persistent_connection'];
  config['use_cpaint_api']        = arguments[1]['use_cpaint_api'];

  /**
  * XMLHttpObject used for this request.
  *
  * @access   protected
  * @var      object     httpobj
  */
  var httpobj    = false;

  /**
  * client callback function.
  *
  * @access   public
  * @var      function    client_callback
  */
  var client_callback;

  /**
  * stores the stack Id within the cpaint object
  *
  * @access   protected
  * @var      stack_id
  */
  var stack_id = arguments[0];
  
  /**
  * sets the client callback function.
  *
  * @access   public
  * @param    function    client_callback     the client callback function
  * @return   void
  */
  this.set_client_callback = function() {
    
    if (typeof arguments[0] == 'function') {
      client_callback = arguments[0];
    }
  }

  /**
  * returns the ready state of the internal XMLHttpObject
  *
  * if no such object was set up already, -1 is returned
  * 
  * @access     public
  * @return     integer
  */
  this.get_http_state = function() {
    var return_value = -1;
    
    if (typeof httpobj == 'object') {
      return_value = httpobj.readyState;
    }
    
    return return_value;
  }
  
  /**
  * internal method for remote calls to the local server without use of the proxy script.
  *
  * @access   public
  * @param    array    call_arguments    array of arguments initially passed to cpaint.call()
  * @return   void
  */
  this.call_direct = function(call_arguments) {
    var url             = call_arguments[0];
    var remote_method   = call_arguments[1];
    var querystring     = '';
    var i               = 0;
    
    // correct link to self
    if (url == 'SELF') {
      url = document.location.href;
    }
  
    if (config['use_cpaint_api'] == true) {
      // backend uses cpaint api
      // pass parameters to remote method
      for (i = 3; i < call_arguments.length; i++) {

        if ((typeof call_arguments[i] == 'string'
              && call_arguments[i] != ''
              && call_arguments[i].search(/^\s+$/g) == -1)
          && !isNaN(call_arguments[i])
          && isFinite(call_arguments[i])) {
          // numerical value, convert it first
          querystring += '&cpaint_argument[]=' + encodeURIComponent(JSON.stringify(Number(call_arguments[i])));
        
        } else {
          querystring += '&cpaint_argument[]=' + encodeURIComponent(JSON.stringify(call_arguments[i]));
        }
      }
    
      // add response type to querystring
      querystring += '&cpaint_response_type=' + config['response_type'];
    
      // build header
      if (config['transfer_mode'] == 'GET') {
				
        if(url.indexOf('?') != -1) {
					url = url + '&cpaint_function=' + remote_method +	querystring;
				
        } else {
					url = url + '?cpaint_function=' + remote_method +	querystring; 
				}
      
      } else {
        querystring = 'cpaint_function=' + remote_method + querystring;
      }
      
    } else {
      // backend does not use cpaint api
      // pass parameters to remote method
      for (i = 3; i < call_arguments.length; i++) {
        
        if (i == 3) {
          querystring += encodeURIComponent(call_arguments[i]);
        
        } else {
          querystring += '&' + encodeURIComponent(call_arguments[i]);
        }
      }
    
      // build header
      if (config['transfer_mode'] == 'GET') {
        url = url + querystring;
      } 
    }
  
    // open connection 
    get_connection_object();

    // open connection to remote target
    debug('opening connection to "' + url + '"', 1);
    httpobj.open(config['transfer_mode'], url, config['async']);

    // send "urlencoded" header if necessary (if POST)
    if (config['transfer_mode'] == 'POST') {

      try {
        httpobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      } catch (cp_err) {
        debug('POST cannot be completed due to incompatible browser.  Use GET as your request method.', 0);
      }
    }

    // make ourselves known
    httpobj.setRequestHeader('X-Powered-By', 'CPAINT v' + version + ' :: http://sf.net/projects/cpaint');

    // callback handling for asynchronous calls
    httpobj.onreadystatechange = callback;

    // send content
    if (config['transfer_mode'] == 'GET') {
      httpobj.send(null);

    } else {
      debug('sending query: ' + querystring, 1);
      httpobj.send(querystring);
    }

    if (config['async'] == true) {
      // manual callback handling for synchronized calls
      callback();
    }
  }
    
  /**
  * internal method for calls to remote servers through the proxy script.
  *
  * @access   public
  * @param    array    call_arguments    array of arguments passed to cpaint.call()
  * @return   void
  */
  this.call_proxy = function(call_arguments) {
    var proxyscript     = config['proxy_url'];
    var url             = call_arguments[0];
    var remote_method   = call_arguments[1];
    var querystring     = '';
    var i               = 0;
    
    var querystring_argument_prefix = 'cpaint_argument[]=';

    // pass parameters to remote method
    if (config['use_cpaint_api'] == false) {
      // when not talking to a CPAINT backend, don't prefix arguments
      querystring_argument_prefix = '';
    }

    for (i = 3; i < call_arguments.length; i++) {

      if (config['use_cpaint_api'] == true) {
      
        if ((typeof call_arguments[i] == 'string'
              && call_arguments[i] != ''
              && call_arguments[i].search(/^\s+$/g) == -1)
          && !isNaN(call_arguments[i])
          && isFinite(call_arguments[i])) {
          // numerical value, convert it first
          querystring += encodeURIComponent(querystring_argument_prefix + JSON.stringify(Number(call_arguments[i])) + '&');

        } else {
          querystring += encodeURIComponent(querystring_argument_prefix + JSON.stringify(call_arguments[i]) + '&');
        }
        
      } else {
        // no CPAINT in the backend
        querystring += encodeURIComponent(querystring_argument_prefix + call_arguments[i] + '&');
      }
    }

    if (config['use_cpaint_api'] == true) {
      // add remote function name to querystring
      querystring += encodeURIComponent('&cpaint_function=' + remote_method);
  
      // add response type to querystring
      querystring += encodeURIComponent('&cpaint_responsetype=' + config['response_type']);
    }
    
    // build header
    if (config['transfer_mode'] == 'GET') {
      proxyscript += '?cpaint_remote_url=' + encodeURIComponent(url) 
        + '&cpaint_remote_query=' + querystring
        + '&cpaint_remote_method=' + config['transfer_mode'] 
        + '&cpaint_response_type=' + config['response_type'];

    } else {
      querystring = 'cpaint_remote_url=' + encodeURIComponent(url)
        + '&cpaint_remote_query=' + querystring
        + '&cpaint_remote_method=' + config['transfer_mode'] 
        + '&cpaint_response_type=' + config['response_type'];
    }

    // open connection
    get_connection_object();

    // open connection to remote target
    debug('opening connection to proxy "' + proxyscript + '"', 1);
    httpobj.open(config['transfer_mode'], proxyscript, config['async']);

    // send "urlencoded" header if necessary (if POST)
    if (config['transfer_mode'] == 'POST') {

      try {
        httpobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      } catch (cp_err) {
        debug('POST cannot be completed due to incompatible browser.  Use GET as your request method.', 0);
      }
    }

    httpobj.setRequestHeader('X-Powered-By', 'CPAINT v' + version);

    // callback handling for asynchronous calls
    httpobj.onreadystatechange = callback;

    // send content
    if (config['transfer_mode'] == 'GET') {
      httpobj.send(null);

    } else {
      debug('sending query: ' + querystring, 1);
      httpobj.send(querystring);
    }

    if (config['async'] == false) {
      // manual callback handling for synchronized calls
      callback();
    }
  }

  this.test_ajax_capability = function() {
    return get_connection_object();
  }
  
  /**
  * creates a new connection object.
  *
  * @access   protected
  * @return   boolean
  */
  var get_connection_object = function() {
    var return_value    = false;
    var new_connection  = false;

    // open new connection only if necessary
    if (config['persistent_connection'] == false) {
      // no persistance, create a new object every time
      debug('Using new connection object', 1);
      new_connection = true;

    } else {
      // persistent connection object, only open one if no object exists
      debug('Using shared connection object.', 1);

      if (typeof httpobj != 'object') {
        debug('Getting new persistent connection object.', 1);
        new_connection = true;
      }
    }

    if (new_connection == true) {
		
	 try {
        httpobj = new XMLHttpRequest();
      } catch (e1) {

		  try {
			httpobj = new ActiveXObject('Msxml2.XMLHTTP');
	  
		  } catch (e) {
			
			try {  
			  httpobj = new ActiveXObject('Microsoft.XMLHTTP');
 
			} catch (oc) {
			  httpobj = null;
			} 
		 }
	  }
     
  
      if (!httpobj) {
        debug('Could not create connection object', 0);
      
      } else {
        return_value = true;
      }
    }

    if (httpobj.readyState != 4) {
      httpobj.abort();
    }

    return return_value;
  }

  /**
  * internal callback function.
  *
  * will perform some consistency checks (response code, NULL value testing)
  * and if response_type = 'OBJECT' it will automatically call
  * cpaint_call.parse_ajax_xml() to have a JavaScript object structure generated.
  *
  * after all that is done the client side callback function will be called 
  * with the generated response as single value.
  *
  * @access   protected
  * @return   void
  */
  var callback = function() {
    var response = null;
    if (httpobj.readyState == 4
      && httpobj.status == 200) {
      if(httpobj.responseText == ""){
      	alert("O servidor demorou muito - timeout");
		client_callback("", "erro");
		return;
      }
      debug(httpobj.responseText, 1);
      debug('using response type ' + config['response_type'], 2);
      
      // fetch correct response
      switch (config['response_type']) {
        case 'XML':
          debug(httpobj.responseXML, 2);
          response = __cpaint_transformer.xml_conversion(httpobj.responseXML);
          break;
          
        case 'OBJECT':
          response = __cpaint_transformer.object_conversion(httpobj.responseXML);
          break;
        
        case 'TEXT':
          response = __cpaint_transformer.text_conversion(httpobj.responseText);
          break;
          
        case 'E4X':
          response = __cpaint_transformer.e4x_conversion(httpobj.responseText);
          break;
          
        case 'JSON':
          response = __cpaint_transformer.json_conversion(httpobj.responseText);
          break;
          
        default:
          debug('invalid response type \'' + response_type + '\'', 0);
      }
      
      // call client side callback
      if (response != null 
        && typeof client_callback == 'function') {
        try{
        	if(response.data)
        		client_callback(response, httpobj.responseText);
        	else
        		client_callback("", "erro");
        }
        catch(e){
        	client_callback("", "erro");
        }
      }
      // remove ourselves from the stack
      remove_from_stack();
    
    } else
    {       
		if(httpobj.readyState==4&&httpobj.status!=200)
		{
			debug('invalid HTTP response code \''+Number(httpobj.status)+'\'',0);
			if(httpobj.status==500){
				alert("O servidor demorou muito - timeout");
				client_callback("", "erro");	
			}
			else{
				client_callback("", "erro");
			}
		}      
      
    }
  }

  /**
  * removes an entry from the stack
  *
  * @access     protected
  * @return     void
  */
  var remove_from_stack = function() {
    // remove only if everything is okay and we're not configured as persistent connection
    if (typeof stack_id == 'number'
      && __cpaint_stack[stack_id]
      && config['persistent_connection'] == false) {
      
      __cpaint_stack[stack_id] = null;
    }
  }

  /**
  * debug method
  *
  * @access  protected
  * @param   string       message         the message to debug
  * @param   integer      debug_level     debug level at which the message appears
  * @return  void
  */
  var debug  = function(message, debug_level) {
    var prefix = '[CPAINT Debug] ';
    
    if (config['debugging'] < 1) {
      prefix = '[CPAINT Error] ';
    }
    
    if (config['debugging'] >= debug_level) {
      alert(prefix + message);
    }
    if (message.search(" error") > 1){client_callback("", message);}
  }
}

/**
* CPAINT transformation object
*
* @package      CPAINT
* @access       public
* @copyright    Copyright (c) 2005-2006 Paul Sullivan, Dominique Stender - http://sf.net/projects/cpaint
* @author       Paul Sullivan <wiley14@gmail.com>
* @author       Dominique Stender <dstender@st-webdevelopment.de>
*/
function cpaint_transformer() {

  /**
  * will take a XMLHttpObject and generate a JavaScript
  * object structure from it.
  *
  * is internally called by cpaint_call.callback() if necessary.
  * will call cpaint_call.create_object_structure() to create nested object structures.
  *
  * @access   public
  * @param    object    xml_document  a XMLHttpObject
  * @return   object
  */
  this.object_conversion = function(xml_document) {
    var return_value  = new cpaint_result_object();
    var i             = 0;
    var firstNodeName = '';
    
    if (typeof xml_document == 'object'
      && xml_document != null) {

      // find the first element node - for MSIE the <?xml?> node is the very first...
      for (i = 0; i < xml_document.childNodes.length; i++) {

        if (xml_document.childNodes[i].nodeType == 1) {
          firstNodeName = xml_document.childNodes[i].nodeName;
          break;
        }
      }
      
      var ajax_response = xml_document.getElementsByTagName(firstNodeName);

      return_value[firstNodeName] = new Array();
    
      for (i = 0; i < ajax_response.length; i++) {
        var tmp_node = create_object_structure(ajax_response[i]);
        tmp_node.id  = ajax_response[i].getAttribute('id')
        return_value[firstNodeName].push(tmp_node);
      }

    } else {
      debug('received invalid XML response', 0);
    }

    return return_value;
  }

  /**
  * performs the necessary conversions for the XML response type
  *
  * @access   public
  * @param    object    xml_document  a XMLHttpObject
  * @return   object
  */
  this.xml_conversion = function(xml_document) {
    return xml_document;
  }
  
  /**
  * performs the necessary conversions for the TEXT response type
  *
  * @access   public
  * @param    string    text  the response text
  * @return   string
  */
  this.text_conversion = function(text) {
    return decode(text);
  }
  
  /**
  * performs the necessary conversions for the E4X response type
  *
  * @access   public
  * @param    string    text  the response text
  * @return   string
  */
  this.e4x_conversion = function(text) {
    // remove <?xml ?>tag
    text = text.replace(/^\<\?xml[^>]+\>/, '');
    return new XML(text);
  }
  
  /**
  * performs the necessary conversions for the JSON response type
  *
  * @access   public
  * @param    string    text  the response text
  * @return   string
  */
  this.json_conversion = function(text) {
    return JSON.parse(text);
  }
  
  /**
  * this method takes a HTML / XML node object and creates a
  * JavaScript object structure from it.
  *
  * @access   public
  * @param    object    stream    a node in the XML structure
  * @return   object
  */
  var create_object_structure = function(stream) {
    var return_value = new cpaint_result_object();
    var node_name = '';
    var i         = 0;
    var attrib    = 0;
    
    if (stream.hasChildNodes() == true) {
      for (i = 0; i < stream.childNodes.length; i++) {
  
        node_name = stream.childNodes[i].nodeName;
        node_name = node_name.replace(/[^a-zA-Z0-9_]*/g, '');
        
        // reset / create subnode
        if (typeof return_value[node_name] != 'object') {
          return_value[node_name] = new Array();
        }
        
        if (stream.childNodes[i].nodeType == 1) {
          var tmp_node  = create_object_structure(stream.childNodes[i]);

          for (attrib = 0; attrib < stream.childNodes[i].attributes.length; attrib++) {
            tmp_node.set_attribute(stream.childNodes[i].attributes[attrib].nodeName, stream.childNodes[i].attributes[attrib].nodeValue);
          }
          
          return_value[node_name].push(tmp_node);
        
        } else if (stream.childNodes[i].nodeType == 3) {
          return_value.data  = decode(String(stream.firstChild.data));
        }
      }
    }
    
    return return_value;
  }

  /**
  * converts an encoded text back to viewable characters.
  *
  * @access     public
  * @param      string      rawtext     raw text as provided by the backend
  * @return     mixed
  */
  var decode = function(rawtext) {
    var plaintext = ''; 
    var i         = 0; 
    var c1        = 0;
    var c2        = 0;
    var c3        = 0;
    var u         = 0;
    var t         = 0;

    // remove special JavaScript encoded non-printable characters
    while (i < rawtext.length) {
      if (rawtext.charAt(i) == '\\'
        && rawtext.charAt(i + 1) == 'u') {
        
        u = 0;
        
        for (j = 2; j < 6; j += 1) {
          t = parseInt(rawtext.charAt(i + j), 16);
          
          if (!isFinite(t)) {
            break;
          }
          u = u * 16 + t;
        }

        plaintext += String.fromCharCode(u);
        i       += 6;
      
      } else {
        plaintext += rawtext.charAt(i);
        i++;
      }
    }

    // convert numeric data to number type
    if (plaintext != ''
      && plaintext.search(/^\s+$/g) == -1
      && !isNaN(plaintext) 
      && isFinite(plaintext)) {
      
      plaintext = Number(plaintext);
    }
  
    return plaintext;
  }
}

/**
* this is the basic prototype for a cpaint node object
* as used in cpaint_call.parse_ajax_xml()
*
* @package      CPAINT
* @access       public
* @copyright    Copyright (c) 2005-2006 Paul Sullivan, Dominique Stender - http://sf.net/projects/cpaint
* @author       Paul Sullivan <wiley14@gmail.com>
* @author       Dominique Stender <dstender@st-webdevelopment.de>
*/
function cpaint_result_object() {
  this.id           = 0;
  this.data         = '';
  var __attributes  = new Array();
  
  /**
  * Returns a subnode with the given type and id.
  *
  * @access     public
  * @param      string    type    The type of the subnode. Equivalent to the XML tag name.
  * @param      string    id      The id of the subnode. Equivalent to the XML tag names id attribute.
  * @return     object
  */
  this.find_item_by_id = function() {
    var return_value  = null;
    var type    = arguments[0];
    var id      = arguments[1];
    var i       = 0;
    
    if (this[type]) {

      for (i = 0; i < this[type].length; i++) {

        if (this[type][i].get_attribute('id') == id) {
          return_value = this[type][i];
          break;
        }
      }
    }

    return return_value;
  }
  
  /**
  * retrieves the value of an attribute.
  *
  * @access   public
  * @param    string    name    name of the attribute
  * @return   mixed
  */
  this.get_attribute = function() {
    var return_value  = null;
    var id            = arguments[0];
    
    if (typeof __attributes[id] != 'undefined') {
      return_value = __attributes[id];
    }
    
    return return_value;
  }
  
  /**
  * assigns a value to an attribute.
  *
  * if that attribute does not exist it will be created.
  *
  * @access     public
  * @param      string    name    name of the attribute
  * @param      string    value   value of the attribute
  * @return     void
  */
  this.set_attribute = function() {
    __attributes[arguments[0]] = arguments[1];
  }
}


/*
Copyright (c) 2005 JSON.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The Software shall be used for Good, not Evil.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


Array.prototype.______array = '______array';

var JSON = {
  org: 'http://www.JSON.org',
  copyright: '(c)2005 JSON.org',
  license: 'http://www.crockford.com/JSON/license.html',

  stringify: function (arg) {
    var c, i, l, s = '', v;
    var numeric = true;
    
    switch (typeof arg) {
    case 'object':
      if (arg) {
        if (arg.______array == '______array') {
          // do a test whether all array keys are numeric
          for (i in arg) {
            if (i != '______array'
              && (isNaN(i) 
                || !isFinite(i))) {
              numeric = false;
              break;
            }
          }
          
          if (numeric == true) {
            for (i = 0; i < arg.length; ++i) {
              if (typeof arg[i] != 'undefined') {
                v = this.stringify(arg[i]);
                if (s) {
                  s += ',';
                }
                s += v;
              } else {
                s += ',null';
              }
            }
            return '[' + s + ']';
          } else {
            for (i in arg) {
              if (i != '______array') {
                v = arg[i];
                if (typeof v != 'undefined' && typeof v != 'function') {
                  v = this.stringify(v);
                  if (s) {
                    s += ',';
                  }
                  s += this.stringify(i) + ':' + v;
                }
              }
            }
            // return as object
            return '{' + s + '}';
          }
        } else if (typeof arg.toString != 'undefined') {
          for (i in arg) {
            v = arg[i];
            if (typeof v != 'undefined' && typeof v != 'function') {
              v = this.stringify(v);
              if (s) {
                s += ',';
              }
              s += this.stringify(i) + ':' + v;
            }
          }
          return '{' + s + '}';
        }
      }
      return 'null';
    case 'number':
      return isFinite(arg) ? String(arg) : 'null';
    case 'string':
      l = arg.length;
      s = '"';
      for (i = 0; i < l; i += 1) {
        c = arg.charAt(i);
        if (c >= ' ') {
          if (c == '\\' || c == '"') {
            s += '\\';
          }
          s += c;
        } else {
          switch (c) {
            case '\b':
              s += '\\b';
              break;
            case '\f':
              s += '\\f';
              break;
            case '\n':
              s += '\\n';
              break;
            case '\r':
              s += '\\r';
              break;
            case '\t':
              s += '\\t';
              break;
            default:
              c = c.charCodeAt();
              s += '\\u00' + Math.floor(c / 16).toString(16) +
                (c % 16).toString(16);
          }
        }
      }
      return s + '"';
    case 'boolean':
      return String(arg);
    default:
      return 'null';
    }
  },
  parse: function (text) {
    var at = 0;
    var ch = ' ';

    function error(m) {
      throw {
        name: 'JSONError',
        message: m,
        at: at - 1,
        text: text
      };
    }

    function next() {
      ch = text.charAt(at);
      at += 1;
      return ch;
    }

    function white() {
      while (ch != '' && ch <= ' ') {
        next();
      }
    }

    function str() {
      var i, s = '', t, u;

      if (ch == '"') {
outer:      while (next()) {
          if (ch == '"') {
            next();
            return s;
          } else if (ch == '\\') {
            switch (next()) {
            case 'b':
              s += '\b';
              break;
            case 'f':
              s += '\f';
              break;
            case 'n':
              s += '\n';
              break;
            case 'r':
              s += '\r';
              break;
            case 't':
              s += '\t';
              break;
            case 'u':
              u = 0;
              for (i = 0; i < 4; i += 1) {
                t = parseInt(next(), 16);
                if (!isFinite(t)) {
                  break outer;
                }
                u = u * 16 + t;
              }
              s += String.fromCharCode(u);
              break;
            default:
              s += ch;
            }
          } else {
            s += ch;
          }
        }
      }
      error("Bad string");
    }

    function arr() {
      var a = [];

      if (ch == '[') {
        next();
        white();
        if (ch == ']') {
          next();
          return a;
        }
        while (ch) {
          a.push(val());
          white();
          if (ch == ']') {
            next();
            return a;
          } else if (ch != ',') {
            break;
          }
          next();
          white();
        }
      }
      error("Bad array");
    }

    function obj() {
      var k, o = {};

      if (ch == '{') {
        next();
        white();
        if (ch == '}') {
          next();
          return o;
        }
        while (ch) {
          k = str();
          white();
          if (ch != ':') {
            break;
          }
          next();
          o[k] = val();
          white();
          if (ch == '}') {
            next();
            return o;
          } else if (ch != ',') {
            break;
          }
          next();
          white();
        }
      }
      error("Bad object");
    }

    function assoc() {
      var k, a = [];

      if (ch == '<') {
        next();
        white();
        if (ch == '>') {
          next();
          return a;
        }
        while (ch) {
          k = str();
          white();
          if (ch != ':') {
            break;
          }
          next();
          a[k] = val();
          white();
          if (ch == '>') {
            next();
            return a;
          } else if (ch != ',') {
            break;
          }
          next();
          white();
        }
      }
      error("Bad associative array");
    }

    function num() {
      var n = '', v;
      if (ch == '-') {
        n = '-';
        next();
      }
      while (ch >= '0' && ch <= '9') {
        n += ch;
        next();
      }
      if (ch == '.') {
        n += '.';
        while (next() && ch >= '0' && ch <= '9') {
          n += ch;
        }
      }
      if (ch == 'e' || ch == 'E') {
        n += 'e';
        next();
        if (ch == '-' || ch == '+') {
          n += ch;
          next();
        }
        while (ch >= '0' && ch <= '9') {
          n += ch;
          next();
        }
      }
      v = +n;
      if (!isFinite(v)) {
        error("Bad number");
      } else {
        return v;
      }
    }

    function word() {
      switch (ch) {
        case 't':
          if (next() == 'r' && next() == 'u' && next() == 'e') {
            next();
            return true;
          }
          break;
        case 'f':
          if (next() == 'a' && next() == 'l' && next() == 's' &&
              next() == 'e') {
            next();
            return false;
          }
          break;
        case 'n':
          if (next() == 'u' && next() == 'l' && next() == 'l') {
            next();
            return null;
          }
          break;
      }
      error("Syntax error");
    }

    function val() {
      white();
      switch (ch) {
        case '{':
          return obj();
        case '[':
          return arr();
        case '<':
          return assoc();
        case '"':
          return str();
        case '-':
          return num();
        default:
          return ch >= '0' && ch <= '9' ? num() : word();
      }
    }

    return val();
  }
};


/*
Title: PHP

File: i3geo/classesjs/classe_php.js

About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEO) == 'undefined'){
	i3GEO = new Array();
}
/*
Variable: cpJSON

Objeto CPAINT (ver biblioteca CPAINT) utilizado nas chamadas AJAX assíncronas com retorno no formato JSON

Exemplo:

	cpJSON.call()
	
Return:
	
	O objeto CPAINT retorna os dados encapsulados em um objeto JSON. Os programas PHP
	que fazem uso dessa biblioteca (CPAINT) devem fazer o include da mesma.
	Os dados de interesse retornados no objeto JSON, ficam embutidos na propriedade "data", por exemplo:
	
	var temp = function(retorno){alert(retorno.data);}
	
	cpJSON.call(p,"teste",temp);
	
	onde, p contém o nome do programa PHP e seus parâmetros
	"teste" é o nome da função PHP (no caso do i3Geo, isso não afeta em nada)
	e temp é a função que tratará o retorno dos dados.
	
*/
cpJSON = new cpaint();
cpJSON.set_response_type("JSON");
/*
Class: i3GEO.php

Chamadas em AJAX que executam programas no lado do servidor

Muitos dos parâmetros exigidos pelos programas em PHP são obtidos da variável
de seção aberta no servidor quando o i3Geo é inicializado, é o caso por exemplo do nome
do arquivo correspondente ao mapfile atualmente em uso

Quando classe_php.js é carregado, é criado o objeto cpJSON que necessita da biblioteca CPAINT. Esse objeto
é utilizado nas chamadas AJAX.

O objeto cpJSON possuí um método .call que executa a operação AJAX. Esse método utiliza basicamente dois parâmetros,
sendo o primeiro o endereço do programa PHP que será executado no servidor e o outro é o nome da função que irá
receber e processar os resultados do programa. Exemplo:

cpJSON.call(p,"",funcao);

"p" é a URL e funcao o nome da função

Para compor "p" o i3geo utiliza normalmente a variável i3GEO.configura.locaplic e i3GEO.configura.sid, por exemplo:

var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHPgrafico&g_sid="+i3GEO.configura.sid

Para mais detalhes sobre as funções, veja <mapa_controle.php>
*/
i3GEO.php = {
	/*
	Function: verifica
	
	Verifica se as variáveis i3GEO.configura.locaplic e i3GEO.configura.sid existem
	*/
	verifica: function(){
		if(i3GEO.configura.locaplic == undefined)
		{alert("variavel i3GEO.configura.locaplic não esta definida");}
		if(i3GEO.configura.sid == undefined)
		{alert("variavel i3GEO.configura.locaplic não esta definida");}
	},
	/*
	Function: insereSHPgrafico
	
	PHP:
	classesphp/classe_shp.php
	
	<SHP->__construct>
	
	<SHP->insereSHPgrafico>
	*/
	insereSHPgrafico: function(funcao,tema,x,y,itens,shadow_height,width,inclinacao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHPgrafico&tipo=pizza&tema="+tema+"&x="+x+"&y="+y+"&itens="+itens+"&shadow_height="+shadow_height+"&width="+width+"&inclinacao="+inclinacao+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"insereSHPgrafico",funcao);
	},
	/*
	Function: insereSHP
	
	PHP:
	classesphp/classe_shp.php
	
	<SHP->__construct>
	
	<SHP->insereSHP>
	*/
	insereSHP: function(funcao,tema,item,valoritem,xy){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHP&item="+item+"&valor="+valoritem+"&tema="+tema+"&xy="+xy+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"insereSHPgrafico",funcao);
	},
	/*
	Function: pegaMensagens

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->pegaMensagens>	
	*/
	pegaMensagens: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaMensagens&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pegaMensagem",funcao);	
	},
	/*
	Function: areaPixel

	PHP:
	classesphp/funcoes_gerais.php
	
	<calculaAreaPixel>	
	*/
	areaPixel: function(funcao,g_celula){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=areaPixel&celsize="+g_celula+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"areaPixel",funcao);	
	},
	/*
	Function: excluitema

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->excluiTemas>	
	*/
	excluitema: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=excluitema&temas="+tema+"&g_sid="+i3GEO.arvoreDeCamadas.SID;
		cpJSON.call(p,"excluitema",funcao);	
	},
	/*
	Function: reordenatemas

	PHP:
	classesphp/classe_temas.php
	
	<Temas->reordenatemas>	
	*/
	reordenatemas: function(funcao,lista){
		i3GEO.php.verifica();
		var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=reordenatemas&lista="+lista+"&g_sid="+i3GEO.arvoreDeCamadas.SID;
		cpJSON.call(p,"reordenatemas",funcao);	
	},
	/*
	Function: criaLegendaHTML

	PHP:
	classesphp/classe_legenda.php
	
	<Legenda->__construct>
	
	<Legenda->criaLegenda>	
	*/
	criaLegendaHTML: function(funcao,tema,template){
		i3GEO.php.verifica();
		var c = "sim";
		if(arguments.length == 1)
		{
			var tema = "";
			var template = "legenda2.htm";
		}
		if(arguments.length == 2)
		{var template = "legenda2.htm";}
		
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaHTML&tema="+tema+"&templateLegenda="+template+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"criaLegendaHTML",funcao);	
	},
	/*
	Function: inverteStatusClasse

	PHP:
	classesphp/classe_alteraclasse.php
	
	<Alteraclasse->__construct>
	
	<Alteraclasse->inverteStatusClasse>	
	*/
	inverteStatusClasse: function(funcao,tema,classe){
		i3GEO.php.verifica();
		var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=inverteStatusClasse&g_sid="+i3GEO.arvoreDeCamadas.SID+"&tema="+tema+"&classe="+classe;
		cpJSON.call(p,"inverteStatusClasse",funcao);	
	},
	/*
	Function: ligatemas

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->ligaDesligaTemas>	
	*/
	ligatemas: function(funcao,desligar,ligar){
		i3GEO.php.verifica();
		var p = i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=ligatemas&desligar="+desligar+"&ligar="+ligar+"&g_sid="+i3GEO.arvoreDeCamadas.SID;
		cpJSON.call(p,"ligaDesligaTemas",funcao);	
	},
	/*
	Function: pegalistademenus

	PHP:
	classesphp/classe_menutemas.php
	
	<Menutemas->pegaListaDeMenus>	
	*/
	pegalistademenus: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistademenus&g_sid="+i3GEO.configura.sid+"&map_file=";
		cpJSON.call(p,"pegalistademenus",funcao);	
	},
	/*
	Function: pegalistademenus

	PHP:
	classesphp/classe_menutemas.php
	
	<Menutemas->pegaListaDeGrupos>	
	*/
	pegalistadegrupos: function(funcao,id_menu,listasgrupos){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadegrupos&map_file=&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&listasistemas=nao&listasgrupos="+listasgrupos;
		cpJSON.call(p,"pegalistadegrupos",funcao);	
	},
	/*
	Function: pegalistadeSubgrupos

	PHP:
	classesphp/classe_menutemas.php
	
	<Menutemas->pegaListaDeSubGrupos>	
	*/
	pegalistadeSubgrupos: function(funcao,id_menu,id_grupo){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadeSubgrupos&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&grupo="+id_grupo+"&map_file=";
		cpJSON.call(p,"pegalistadeSubgrupos",funcao);	
	},
	/*
	Function: pegalistadetemas

	PHP:
	classesphp/classe_menutemas.php
	
	<Menutemas->pegaListaDeTemas>	
	*/
	pegalistadetemas: function(funcao,id_menu,id_grupo,id_subgrupo){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadetemas&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&grupo="+id_grupo+"&subgrupo="+id_subgrupo+"&map_file=";
		cpJSON.call(p,"pegalistadetemas",funcao);	
	},
	/*
	Function: pegaSistemas

	PHP:
	classesphp/classe_menutemas.php
	
	<Menutemas->pegaSistemas>	
	*/
	pegaSistemas: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaSistemas&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pegaSistemas",funcao);	
	},
	/*
	Function: listadrives

	<listaDrives>	
	*/
	listadrives: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=listaDrives&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"listaDrives",funcao);	
	},
	/*
	Function: listaarquivos

	<listaArquivos>	
	*/
	listaarquivos: function(funcao,caminho){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaArquivos&diretorio="+caminho;
		cpJSON.call(p,"listaArquivos",funcao);	
	},
	/*
	Function: geo2utm

	<geo2utm>	
	*/
	geo2utm: function(funcao,x,y){
		i3GEO.php.verifica();
		if($i("aguardeGifAberto")){return;}
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=geo2utm&x="+x+"&y="+y+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"geo2utm",funcao);	
	},
	/*
	Function: desativacgi

	<desativacgi>	
	*/
	desativacgi: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=desativacgi&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"desativacgi",funcao);	
	},
	/*
	Function: pegaMapas

	PHP:
	classesphp/classe_menutemas.php
	
	<Menutemas->pegaListaDeMapas>	
	*/
	pegaMapas: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaMapas&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pegaSistemas",funcao);	
	},
	/*
	Function: mudatamanho

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->mudaQS>	
	*/
	mudatamanho: function(funcao,altura,largura){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudatamanho&altura="+altura+"&largura="+largura+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pegaSistemas",funcao);	
	},
	/*
	Function: ativalogo

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->ativalogo>	
	*/
	ativalogo: function(funcao,altura,largura){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=ativalogo&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"ativalogo",funcao);	
	},
	/*
	Function: insereAnnotation

	PHP:
	classesphp/classe_temas.php
	
	<Temas->insereFeature>	
	*/
	insereAnnotation: function(funcao,pin,xy,texto,position,partials,offsetx,offsety,minfeaturesize,mindistance,force,shadowcolor,shadowsizex,shadowsizey,outlinecolor,cor,sombray,sombrax,sombra,fundo,angulo,tamanho,fonte){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=inserefeature&pin="+pin+"&tipo=ANNOTATION&xy="+xy+"&texto="+texto+"&position="+position+"&partials="+partials+"&offsetx="+offsetx+"&offsety="+offsety+"&minfeaturesize="+minfeaturesize+"&mindistance="+mindistance+"&force="+force+"&shadowcolor="+shadowcolor+"&shadowsizex="+shadowsizex+"&shadowsizey="+shadowsizey+"&outlinecolor="+outlinecolor+"&cor="+cor+"&sombray="+sombray+"&sombrax="+sombrax+"&sombra="+sombra+"&fundo="+fundo+"&angulo="+angulo+"&tamanho="+tamanho+"&fonte="+fonte+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"inserefeature",funcao);	
	},
	/*
	Function: identificaunico

	PHP:
	classesphp/classe_atributos.php
	
	<Atributos->identificaQBP>	
	*/
	identificaunico: function(funcao,xy,tema,item){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=identificaunico&xy="+xy+"&resolucao=5&tema="+tema+"&item="+item+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"identificaunico",funcao);	
	},
	/*
	Function: recuperamapa

	PHP:
	classesphp/mapa_controle.php
	
	<recuperamapa>	
	*/
	recuperamapa: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=recuperamapa&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"recuperamapa",funcao);	
	},
	/*
	Function: criaLegendaImagem

	PHP:
	classesphp/classe_legenda.php
	
	<Atributos->legendaGrafica>	
	*/
	criaLegendaImagem: function(funcao){
		i3GEO.php.verifica();
		var p =i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaImagem&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"criaLegendaImagem",funcao);	
	},
	/*
	Function: referenciadinamica

	PHP:
	classesphp/funcoes_gerais.php
	
	<retornaReferenciaDinamica>	
	*/
	referenciadinamica: function(funcao,zoom,tipo){
		i3GEO.php.verifica();
		if(arguments.length == 2)
		{var tipo = "dinamico"}
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=referenciadinamica&g_sid="+i3GEO.configura.sid+"&zoom="+zoom+"&tipo="+tipo;
		cpJSON.call(p,"retornaReferenciaDinamica",funcao);	
	},
	/*
	Function: referencia

	PHP:
	classesphp/funcoes_gerais.php
	
	<retornaReferencia>	
	*/
	referencia: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=referencia&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"retornaReferencia",funcao);	
	},
	/*
	Function: pan

	PHP:
	classesphp/classe_navegacao.php
	
	<Navegacao->pan>	
	*/
	pan: function(funcao,escala,tipo,x,y){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pan&escala="+escala+"&tipo="+tipo+"&x="+x+"&y="+y+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"pan",funcao);	
	},
	/*
	Function: aproxima

	PHP:
	classesphp/classe_navegacao.php
	
	<Navegacao->aproxima>	
	*/
	aproxima: function(funcao,nivel){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=aproxima&nivel="+nivel+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"aproxima",funcao);	
	},
	/*
	Function: afasta

	PHP:
	classesphp/classe_navegacao.php
	
	<Navegacao->afasta>	
	*/
	afasta: function(funcao,nivel){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=afasta&nivel="+nivel+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"afasta",funcao);	
	},
	/*
	Function: zoomponto

	PHP:
	classesphp/classe_navegacao.php
	
	<Navegacao->zoomponto>	
	*/
	zoomponto: function(funcao,x,y){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=zoomponto&pin=pin&xy="+x+" "+y+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"zoomponto",funcao);	
	},
	/*
	Function: localizaIP

	PHP:
	classesphp/funccoes_gerais.php
	*/
	localizaIP: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=localizaIP&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"localizaIP",funcao);	
	},
	/*
	Function: mudaext

	PHP:
	classesphp/classe_navegacao.php
	
	<Navegacao->mudaExtensao>	
	*/
	mudaext: function(funcao,tipoimagem,ext){
		i3GEO.php.verifica();
		if(ext == 'undefined'){alert("extensao nao definida");return;}
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&tipoimagem="+tipoimagem+"&ext="+ext+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"mudaext",funcao);	
	},
	/*
	Function: mudaescala

	PHP:
	classesphp/classe_navegacao.php
	
	<Navegacao->mudaEscala>	
	*/
	mudaescala: function(funcao,escala){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudaescala&escala="+escala+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"mudaescala",funcao);	
	},
	/*
	Function: aplicaResolucao

	PHP:
	classesphp/classe_navegacao.php
	
	<Navegacao->aplicaResolucao>	
	*/
	aplicaResolucao: function(funcao,resolucao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=crialente&resolucao="+resolucao+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"crialente",funcao);	
	},
	/*
	Function: geradestaque

	PHP:
	classesphp/classe_temas.php
	
	<Temas->geraDestaque>	
	*/
	geradestaque: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=geradestaque&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"geradestaque",funcao);	
	},
	/*
	Function: selecaopt

	PHP:
	classesphp/classe_selecao.php
	
	<Selecao->selecaoPT>	
	*/
	selecaopt: function(funcao,tema,xy,tipo,tolerancia){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=selecaopt&tema="+tema+"&tipo="+tipo+"&xy="+xy+"&tolerancia="+tolerancia+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"selecaoPT",funcao);	
	},
	/*
	Function: selecaobox

	PHP:
	classesphp/classe_selecao.php
	
	<Selecao->selecaoBOX>	
	*/
	selecaobox: function(funcao,tema,tipo,box){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=selecaobox&ext="+box+"&g_sid="+i3GEO.configura.sid+"&tipo="+tipo+"&tema="+tema;
		cpJSON.call(p,"selecaobox",funcao);	
	},
	/*
	Function: sobetema

	PHP:
	classesphp/classe_temas.php
	
	<Temas->sobeTema>	
	*/
	sobetema: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=sobetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"sobetema",funcao);	
	},
	/*
	Function: descetema

	PHP:
	classesphp/classe_temas.php
	
	<Temas->desceTema>	
	*/
	descetema: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?&funcao=descetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"descetema",funcao);	
	},
	/*
	Function: fontetema

	PHP:
	classesphp/classe_temas.php
	
	<Temas->fonteTema>	
	*/
	fontetema: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=fontetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"fontetema",funcao);	
	},
	/*
	Function: zoomtema

	PHP:
	classesphp/classe_temas.php
	
	<Temas->zoomTema>	
	*/
	zoomtema: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=zoomtema&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"zoomtema",funcao);	
	},
	/*
	Function: limpasel

	PHP:
	classesphp/classe_selecao.php
	
	<Selecao->selecaoLimpa>	
	*/
	limpasel: function(funcao,tema){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=limpasel&tema="+tema+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"limpasel",funcao);	
	},
	/*
	Function: mudatransp

	PHP:
	classesphp/classe_temas.php
	
	<Temas->mudaTransparencia>	
	*/
	mudatransp: function(funcao,tema,valor){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudatransp&tema="+tema+"&valor="+valor+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"mudatransp",funcao);	
	},
	/*
	Function: mudanome

	PHP:
	classesphp/classe_temas.php
	
	<Temas->mudaTransparencia>	
	*/
	mudanome: function(funcao,tema,valor){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudanome&tema="+tema+"&valor="+valor+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"mudanome",funcao);	
	},
	/*
	Function: adicionaTemaWMS

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->adicionatemawms>	
	*/
	adicionaTemaWMS: function(funcao,servico,tema,nome,proj,formato,versao,nomecamada,tiporep,suportasld,formatosinfo){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionatemawms&servico="+servico+"&tema="+tema+"&nome="+nome+"&proj="+proj+"&formato="+formato+"&versao="+versao+"&nomecamada="+nomecamada+"&tiporep="+tiporep+"&suportasld="+suportasld+"&formatosinfo="+formatosinfo;
		cpJSON.call(p,"adicionatemawms",funcao);	
	},
	/*
	Function: adicionaTemaSHP

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->adicionaTemaSHP>	
	*/
	adicionaTemaSHP: function(funcao,path){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionaTemaSHP&arq="+path;
		cpJSON.call(p,"adicionaTemaSHP",funcao);	
	},
	/*
	Function: adicionaTemaIMG

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->adicionaTemaIMG>	
	*/
	adicionaTemaIMG: function(funcao,path){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionaTemaIMG&arq="+path;
		cpJSON.call(p,"adicionaTemaIMG",funcao);	
	},
	/*
	Function: identifica

	PHP:
	classesphp/classe_atributos.php
	
	<Atributos->identifica>	
	*/
	identifica: function(funcao,x,y,resolucao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=identifica&opcao=tip&xy="+x+","+y+"&resolucao=5&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"identifica",funcao);	
	},
	/*
	Function: reiniciaMapa

	PHP:
	classesphp/mapa_controle.php
	*/
	reiniciaMapa: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=reiniciaMapa&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"reiniciaMapa",funcao);	
	},
	/*
	Function: procurartemas

	PHP:
	classesphp/classe_menutemas.php
	
	<Menutemas->procurartemas>	
	*/
	procurartemas: function(funcao,procurar){
		i3GEO.php.verifica();
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=procurartemas&procurar="+procurar+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"procurartemas",funcao);	
	},
	/*
	Function: adtema

	PHP:
	classesphp/classe_mapa.php
	
	<Mapa->adicionaTema>	
	*/
	adtema: function(funcao,temas){
		i3GEO.php.verifica();
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=adtema&temas="+temas+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"adtema",funcao);	
	},
	/*
	Function: escalagrafica

	PHP:
	classesphp/classe_escala.php
	
	<Escala->retornaBarraEscala>	
	*/
	escalagrafica: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=escalagrafica&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"escalagrafica",funcao);	
	},
	/*
	Function: flamingo

	PHP:
	classesphp/mapa_controle.php
	
	<montaFlamingo>	
	*/
	flamingo: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=montaFlamingo&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"montaFlamingo",funcao);	
	},
	/*
	Function: openlayers

	PHP:
	classesphp/mapa_controle.php
	
	<openlayers>	
	*/
	openlayers: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=openlayers&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"openlayers",funcao);	
	},
	/*
	Function: corpo

	PHP:
	classesphp/mapa_controle.php
	
	<redesenhaMapa>	
	*/
	corpo: function(funcao,tipoimagem){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=corpo&tipoimagem="+tipoimagem+"&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"corpo",funcao);	
	},
	/*
	Function: criamapa

	PHP:
	classesphp/mapa_controle.php
	
	<criaMapa>	
	*/
	criamapa: function(funcao,parametros){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaMapa&"+parametros;
		cpJSON.call(p,"criaMapa",funcao);	
	},
	/*
	Function: inicia

	PHP:
	classesphp/mapa_controle.php
	
	<iniciaMapa>	
	*/
	inicia: function(funcao,embedLegenda,w,h){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=inicia&embedLegenda="+embedLegenda+"&w="+w+"&h="+h+"&g_sid="+i3GEO.configura.sid+"&interface="+i3GEO.interface.ATUAL;
		cpJSON.call(p,"iniciaMapa",funcao);	
	},
	/*
	Function: chaveGoogle

	PHP:
	classesphp/mapa_controle.php
	
	<chavegoogle>	
	*/
	chaveGoogle: function(funcao){
		i3GEO.php.verifica();
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=chavegoogle&g_sid="+i3GEO.configura.sid;
		cpJSON.call(p,"chavegoogle",funcao);	
	},
	/*
	Function: listaRSSwsARRAY

	PHP:
	classesphp/wscliente.php
	
	<listaRSSwsARRAY>	
	*/
	listaRSSwsARRAY: function(funcao,tipo){
		var p = i3GEO.configura.locaplic+"/classesphp/wscliente.php?funcao=listaRSSwsARRAY&rss="+new Array("|")+"&tipo="+tipo;
		cpJSON.call(p,"listaRSSwsARRAY",funcao);	
	},
	/*
	Function: listaLayersWMS

	PHP:
	classesphp/wmswfs.php
	
	<listaLayersWMS>	
	*/
	listaLayersWMS: function(funcao,servico,nivel,id_ws,nomelayer){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=listaLayersWMS&servico="+servico+"&nivel="+nivel+"&id_ws="+id_ws+"&nomelayer="+nomelayer;
		cpJSON.call(p,"listaLayersWMS",funcao);	
	}
};
//YAHOO.log("carregou classe php", "Classes i3geo");

<?php if(extension_loaded('zlib')){ob_end_flush();}?>