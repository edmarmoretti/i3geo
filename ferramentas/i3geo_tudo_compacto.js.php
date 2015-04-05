<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>$i = function(id){return document.getElementById(id);}
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
 document.getElementById("aguardeTotal").style.display=tipo; document.getElementById("aguardeTotal1").style.display=tipo;}function cor(obj){window.parent.i3GEO.util.abreCor("wdocai",obj);}   function mostraOpcao(anterior,proxima,texto,idatual){ if(document.getElementById(idatual)){document.getElementById("resultado").removeChild(document.getElementById(idatual))}
 if(!document.getElementById(idatual)){ var ndiv=document.createElement("div"); ndiv.id=idatual; texto+="<br><br><table style='width:100%;background-color:#F2F2F2;' ><tr style='width:100%'>"; if(anterior !=""){texto+="<td style='border:0px solid white;text-align:left;cursor:pointer;background-color:#F2F2F2;'><input id="+idatual+"anterior_ onclick='"+anterior+"' type='button' value='&nbsp;&nbsp;'/></td>";}
 if(proxima !=""){texto+="<td style='border:0px solid white;text-align:right;cursor:pointer;background-color:#F2F2F2;'><input id="+idatual+"proxima_ onclick='"+proxima+"' type='button' value='&nbsp;&nbsp;'/></td>";}
 ndiv.innerHTML=texto+"</tr></table>"; document.getElementById("resultado").appendChild(ndiv); new YAHOO.widget.Button(idatual+"anterior_",{ onclick:{fn: function(){ eval(anterior+"()");}, lazyloadmenu:true }}); new YAHOO.widget.Button(idatual+"proxima_",{onclick:{fn: function(){ eval(proxima+"()");}, lazyloadmenu:true }}); var i=$i(idatual+"proxima_-button"); if(i){ i.style.backgroundImage="url('../../imagens/player_avanca.png')"; i.style.backgroundRepeat="no-repeat"; i.style.backgroundPosition="center center";}
 var i=$i(idatual+"anterior_-button"); if(i){ i.style.backgroundImage="url('../../imagens/player_volta.png')"; i.style.backgroundRepeat="no-repeat"; i.style.backgroundPosition="center center";}}
 var ids=new Array("t0","t1","t2","t3","t4","t5","t6","t7"); for(i=0;i<ids.length;i++){ if(document.getElementById(ids[i])){document.getElementById(ids[i]).style.display="none";}}
 document.getElementById(idatual).style.display="block";}function simnao(id){ var combo="<select name="+id+" id="+id+" >"; combo+="<option value=TRUE selected>sim</option>"; combo+="<option value=FALSE >n&atilde;o</option>"; combo+="</select>"; return(combo);}function naosim(id){ var combo="<select name="+id+" id="+id+" >"; combo+="<option value=TRUE >sim</option>"; combo+="<option value=FALSE selected >n&atilde;o</option>"; combo+="</select>"; return(combo);}function combocor(id,def,s){ var combo="<select name="+id+" id="+id+" >"; if(def==0){s='selected';}
 combo+='<option value="0" '+s+' >branco</option>'; s=""; combo+='<option value="2">vermelho</option>'; combo+='<option value="7">amarelo</option>'; if(def==1){s='selected'}; combo+='<option value="1" '+s+' >preto</option>'; combo+='<option value="rgb(1,1,0.8)">bege</option>'; combo+='<option value="3">verde</option>'; combo+='<option value="8">cinza</option>'; combo+='<option value="4">azul</option>'; combo+='<option value="5">ciano</option>'; combo+='<option value="6">magenta</option>'; combo+="</select>"; return(combo);}   function comboitens(id,tema,funcao,onde,nome){ if(arguments.length > 3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando itens...</span>"; if(arguments.length !=5){nome="";}
 var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<select id='"+id+"' name='"+nome+"'>"); ins.push("<option value='' >---</option>"); for(i=0;i<retorno.data.valores.length;i++){ if(retorno.data.valores[i].tema==tema){ins.push("<option value='"+retorno.data.valores[i].item+"' >"+retorno.data.valores[i].item+"</option>");}}
 ins.push("</select>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{ var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);}  function checkitensf(tema,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando itens...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<table class=lista >"); for(i=0;i<retorno.data.valores.length;i++){ ins.push("<tr><td><input size=2 style='cursor:pointer' name='"+retorno.data.valores[i].tema+"' type=checkbox id='"+retorno.data.valores[i].item+"'/></td>"); ins.push("<td>"+retorno.data.valores[i].item+"-"+retorno.data.valores[i].nome+"</td></tr>");}
 ins.push("</table>"); var ins=ins.join(''); var temp={dados:ins,tipo:"dados"};}
 else{ var temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"};}
 eval("funcao(temp)");}
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listaitens&tema="+tema,"listaItens",monta);}  function checkitenseditaveis(tema,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando itens...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ var ins=new Array(); ins.push("<table class=lista >"); for(i=0;i<retorno.data.valores.length;i++){ ins.push("<tr><td><input size=2 style='cursor:pointer' name='"+retorno.data.valores[i].tema+"' type=checkbox id='"+retorno.data.valores[i].item+"'/></td>"); ins.push("<td><input onclick='javascript:this.select();' id='"+retorno.data.valores[i].item+retorno.data.valores[i].tema+"' type=text size=25 value='"+retorno.data.valores[i].item+"-"+retorno.data.valores[i].nome+"'/></td></tr>");}
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
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemascomsel","listaTemasComSel",monta);}    function comboTemasLigados(id,funcao,onde,nome,multiplo){ if(arguments.length > 2) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; if(arguments.length==3){nome="";}
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
 var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemasTipo&tipo=poligono","listaTemasTipo",monta);} function comboTemasRaster(id,funcao,onde){ if(arguments.length==3) $i(onde).innerHTML="<span style=color:red;font-size:10px;>buscando temas...</span>"; var monta=function(retorno){ if(retorno.data !=undefined){ if(retorno.data.length > 0){ comboTemas="<select id="+id+" >"; comboTemas+="<option value=''>----</option>"; for(i=0;i<retorno.data.length;i++){comboTemas+="<option value="+retorno.data[i].tema+" >"+retorno.data[i].nome+"</option>";}
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
 function removeAcentos(palavra){ var re=/&atilde;|á|à|â/gi; palavra=palavra.replace(re,"a"); var re=/é/gi; palavra=palavra.replace(re,"e"); var re=/í/gi; palavra=palavra.replace(re,"i"); var re=/ó|õ/gi; palavra=palavra.replace(re,"o"); var re=/ç/gi; palavra=palavra.replace(re,"c"); var re=/ú/gi; palavra=palavra.replace(re,"u"); return(palavra);}function htmlAcentos(palavra){ var re=/&atilde;/gi; palavra=palavra.replace(re,"*atilde|"); var re=/á/gi; palavra=palavra.replace(re,"*aacute|"); var re=/â/gi; palavra=palavra.replace(re,"*acirc|"); var re=/õ/gi; palavra=palavra.replace(re,"*otilde|"); var re=/ó/gi; palavra=palavra.replace(re,"*oacute|"); var re=/ô/gi; palavra=palavra.replace(re,"*ocirc|"); var re=/é/gi; palavra=palavra.replace(re,"*eacute|"); var re=/ê/gi; palavra=palavra.replace(re,"*ecirc|"); var re=/í/gi; palavra=palavra.replace(re,"*iacute|"); var re=/ú/gi; palavra=palavra.replace(re,"*uacute|"); var re=/ç/gi; palavra=palavra.replace(re,"*ccedil|"); var re=/&Atilde;/gi; palavra=palavra.replace(re,"*Atilde|"); var re=/Á/gi; palavra=palavra.replace(re,"*Aacute|"); var re=/Â/gi; palavra=palavra.replace(re,"*Acirc|"); var re=/Õ/gi; palavra=palavra.replace(re,"*otilde|"); var re=/Ó/gi; palavra=palavra.replace(re,"*Oacute|"); var re=/Ô/gi; palavra=palavra.replace(re,"*Ocirc|"); var re=/É/gi; palavra=palavra.replace(re,"*Eacute|"); var re=/Ê/gi; palavra=palavra.replace(re,"*Ecirc|"); var re=/Í/gi; palavra=palavra.replace(re,"*Iacute|"); var re=/Ú/gi; palavra=palavra.replace(re,"*Uacute|"); var re=/&Ccedil;/gi; palavra=palavra.replace(re,"*Ccedil|"); return(palavra);} function randomRGB(){ var v=Math.random(); var r=parseInt(255*v); var v=Math.random(); var g=parseInt(255*v); var v=Math.random(); var b=parseInt(255*v); return(r+","+g+","+b);}function parametrosURL(){ try{ if(!window.parent.i3GEO){g_locaplic="../..";}
 else{ if(window.parent.i3GEO.configura) g_locaplic=window.parent.i3GEO.configura.locaplic; if(window.parent.i3GEO.parametros) g_r=window.parent.i3GEO.parametros.r;}
 var temp=(window.location.href).split("tema="); if(temp[1]){tema=(temp[1].split("&"))[0];}}catch(e){}}function zoomf(ext){ window.parent.objaguarde.abre("i3GEO.atualiza",window.parent.$trad("o1")); var p=g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=mudaext&ext="+ext; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"mudaExtensao",window.parent.remapaf);}function pinf(ext){ window.parent.objaguarde.abre("i3GEO.atualiza",window.parent.$trad("o1")); valores=ext.split(" "); vx=(valores[0]*1)+((((valores[0]*-1)-(valores[2]*-1))/2)*1); vy=(valores[1]*1)+((((valores[1]*-1)-(valores[3]*-1))/2)*1); var p=g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=zoomponto&pin=pin&xy="+vx+" "+vy; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"zoomPonto",window.parent.i3GEO.atualiza);}
function convdmsddf(g,m,s){ cd=$i(g).value; cm=$i(m).value; cs=$i(s).value; var sinal='positivo'; if(cd < 0){ cd=cd*-1; sinal='negativo';}
 spm=cs/3600; mpg=cm/60; var dd=(cd*1)+(mpg*1)+(spm*1); if(sinal=='negativo'){dd=dd*-1;}
 return dd;}function mensagemAjuda(onde,texto){ var local="../.."; try{var local=window.parent.i3GEO.configura.locaplic;}catch(e){}
 var ins="<table style='width:100%;padding:2;vertical-align:top;background-color:#ffffff;' ><tr><th style='background-color: #cedff2;font-family:Verdana, Arial, Helvetica, sans-serif;font-size: 8pt;border: 1px solid #B1CDEB;text-align: left;padding-left: 7px;padding-right: 11px;'>"; ins+='<div style="float:right"><img src="'+local+'/imagens/question.gif"/></div>'; ins+='<div style="left;">'; if(texto==""){var texto=$i(onde).innerHTML;}
 ins+=texto; ins+='</div></th></tr></table>'; if(onde !=""){$i(onde).innerHTML=ins;}
 else{return(ins);}}
function mensagemOpcao(onde,texto){ var ins="<table style='width:100%;padding:2;vertical-align:top;background-color:#ffffff;' ><tr><th style='background-color: #cedff2;font-family:Verdana, Arial, Helvetica, sans-serif;font-size: 8pt;border: 1px solid #B1CDEB;text-align: left;padding-left: 7px;padding-right: 11px;'>"; ins+='<div style="float:right"><img src="../../imagens/opcoes.gif"/></div>'; ins+='<div style="left;">'; if(texto==""){var texto=$i(onde).innerHTML;}
 ins+=texto; ins+='</div></th></tr></table>'; if(onde !=""){$i(onde).innerHTML=ins;}
 else{return(ins);}}
function ativaGuias(){ 	for(g=0;g<12;g++){ 		if($i("guia"+g) && $i("guia"+g).parentNode){		var gpai=$i("guia"+g).parentNode;		gpai.id="guiasYUI";		gpai.className="yui-navset";	}}
 if($i("guiasYUI")){return;}
 var ins='<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">'; for(g=0;g<12;g++){ if($i("guia"+g)) ins+='<li><a href="#ancora"><em><div id=guia'+g+' style=text-align:center;font-size:10px;left:0px;>'+$i("guia"+g).innerHTML+'</div></em></a></li>';}
 ins+="</ul>";   if(gpai) gpai.innerHTML=ins;   for(g=0;g<12;g++){ var guia=$i("guia"+g);}}function mostraGuia(guia,namespace){ if(arguments.length==1){var namespace="guia";}
 for(g=0;g<12;g++){ if($i(namespace+g+"obj")){ $i(namespace+g+"obj").style.display="none";}}
 if($i(guia+"obj")){ $i(guia+"obj").style.display="block";}}
function protocolo(){ var u=window.location.href; var u=u.split(":"); return(u[0]);}

/*jslint plusplus:false,white:false,undef: false, rhino: false, onevar: false, evil: false */

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
  };

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
  };

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
  };

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
  };

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
  };

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
  };
  
  
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
  };
  
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
          use_stack = 0;
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
  };

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
  };
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
  };

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
  };
  
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
  };
    
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
  };

  this.test_ajax_capability = function() {
    return get_connection_object();
  };
  
  
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
  };

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
      
	  //tenta remover cabeçalhos espúrios
	  //alert(httpobj.responseText);
	  var r = httpobj.responseText;
	  r = r.split("{");
	  if(r[0] != "" && r.length > 1);
	  {r[0] = "";}
	  var responseText = r.join("{");
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
		  response = __cpaint_transformer.json_conversion(responseText);
          break;
          
        default:
          debug('invalid response type \'' + response_type + '\'', 0);
      }
      
      // call client side callback
      if (response != null 
        && typeof client_callback == 'function') {
        try{
        	if(response.data)
        		client_callback(response, responseText);
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
  };

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
  };

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
  };
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
        tmp_node.id  = ajax_response[i].getAttribute('id');
        return_value[firstNodeName].push(tmp_node);
      }

    } else {
      debug('received invalid XML response', 0);
    }

    return return_value;
  };

  /**
  * performs the necessary conversions for the XML response type
  *
  * @access   public
  * @param    object    xml_document  a XMLHttpObject
  * @return   object
  */
  this.xml_conversion = function(xml_document) {
    return xml_document;
  };
  
  /**
  * performs the necessary conversions for the TEXT response type
  *
  * @access   public
  * @param    string    text  the response text
  * @return   string
  */
  this.text_conversion = function(text) {
    return decode(text);
  };
  
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
  };
  
  /**
  * performs the necessary conversions for the JSON response type
  *
  * @access   public
  * @param    string    text  the response text
  * @return   string
  */
  this.json_conversion = function(text) {
    return JSON.parse(text);
  };
  
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
  };

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
  };
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
  };
  
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
  };
  
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
  };
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
    };

    function next() {
      ch = text.charAt(at);
      at += 1;
      return ch;
    };

    function white() {
      while (ch != '' && ch <= ' ') {
        next();
      }
    };

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
    };

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
    };

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
    };

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
    };

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
    };

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
    };

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
    };

    return val();
  }
};

/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
if(typeof YAHOO=="undefined"||!YAHOO){var YAHOO={};}YAHOO.namespace=function(){var A=arguments,E=null,C,B,D;for(C=0;C<A.length;C=C+1){D=(""+A[C]).split(".");E=YAHOO;for(B=(D[0]=="YAHOO")?1:0;B<D.length;B=B+1){E[D[B]]=E[D[B]]||{};E=E[D[B]];}}return E;};YAHOO.log=function(D,A,C){var B=YAHOO.widget.Logger;if(B&&B.log){return B.log(D,A,C);}else{return false;}};YAHOO.register=function(A,E,D){var I=YAHOO.env.modules,B,H,G,F,C;if(!I[A]){I[A]={versions:[],builds:[]};}B=I[A];H=D.version;G=D.build;F=YAHOO.env.listeners;B.name=A;B.version=H;B.build=G;B.versions.push(H);B.builds.push(G);B.mainClass=E;for(C=0;C<F.length;C=C+1){F[C](B);}if(E){E.VERSION=H;E.BUILD=G;}else{YAHOO.log("mainClass is undefined for module "+A,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[]};YAHOO.env.getVersion=function(A){return YAHOO.env.modules[A]||null;};YAHOO.env.ua=function(){var C={ie:0,opera:0,gecko:0,webkit:0,mobile:null,air:0,caja:0},B=navigator.userAgent,A;if((/KHTML/).test(B)){C.webkit=1;}A=B.match(/AppleWebKit\/([^\s]*)/);if(A&&A[1]){C.webkit=parseFloat(A[1]);if(/ Mobile\//.test(B)){C.mobile="Apple";}else{A=B.match(/NokiaN[^\/]*/);if(A){C.mobile=A[0];}}A=B.match(/AdobeAIR\/([^\s]*)/);if(A){C.air=A[0];}}if(!C.webkit){A=B.match(/Opera[\s\/]([^\s]*)/);if(A&&A[1]){C.opera=parseFloat(A[1]);A=B.match(/Opera Mini[^;]*/);if(A){C.mobile=A[0];}}else{A=B.match(/MSIE\s([^;]*)/);if(A&&A[1]){C.ie=parseFloat(A[1]);}else{A=B.match(/Gecko\/([^\s]*)/);if(A){C.gecko=1;A=B.match(/rv:([^\s\)]*)/);if(A&&A[1]){C.gecko=parseFloat(A[1]);}}}}}A=B.match(/Caja\/([^\s]*)/);if(A&&A[1]){C.caja=parseFloat(A[1]);}return C;}();(function(){YAHOO.namespace("util","widget","example");if("undefined"!==typeof YAHOO_config){var B=YAHOO_config.listener,A=YAHOO.env.listeners,D=true,C;if(B){for(C=0;C<A.length;C=C+1){if(A[C]==B){D=false;break;}}if(D){A.push(B);}}}})();YAHOO.lang=YAHOO.lang||{};(function(){var B=YAHOO.lang,F="[object Array]",C="[object Function]",A=Object.prototype,E=["toString","valueOf"],D={isArray:function(G){return A.toString.apply(G)===F;},isBoolean:function(G){return typeof G==="boolean";},isFunction:function(G){return A.toString.apply(G)===C;},isNull:function(G){return G===null;},isNumber:function(G){return typeof G==="number"&&isFinite(G);},isObject:function(G){return(G&&(typeof G==="object"||B.isFunction(G)))||false;},isString:function(G){return typeof G==="string";},isUndefined:function(G){return typeof G==="undefined";},_IEEnumFix:(YAHOO.env.ua.ie)?function(I,H){var G,K,J;for(G=0;G<E.length;G=G+1){K=E[G];J=H[K];if(B.isFunction(J)&&J!=A[K]){I[K]=J;}}}:function(){},extend:function(J,K,I){if(!K||!J){throw new Error("extend failed, please check that "+"all dependencies are included.");}var H=function(){},G;H.prototype=K.prototype;J.prototype=new H();J.prototype.constructor=J;J.superclass=K.prototype;if(K.prototype.constructor==A.constructor){K.prototype.constructor=K;}if(I){for(G in I){if(B.hasOwnProperty(I,G)){J.prototype[G]=I[G];}}B._IEEnumFix(J.prototype,I);}},augmentObject:function(K,J){if(!J||!K){throw new Error("Absorb failed, verify dependencies.");}var G=arguments,I,L,H=G[2];if(H&&H!==true){for(I=2;I<G.length;I=I+1){K[G[I]]=J[G[I]];}}else{for(L in J){if(H||!(L in K)){K[L]=J[L];}}B._IEEnumFix(K,J);}},augmentProto:function(J,I){if(!I||!J){throw new Error("Augment failed, verify dependencies.");}var G=[J.prototype,I.prototype],H;for(H=2;H<arguments.length;H=H+1){G.push(arguments[H]);}B.augmentObject.apply(this,G);},dump:function(G,L){var I,K,N=[],O="{...}",H="f(){...}",M=", ",J=" => ";if(!B.isObject(G)){return G+"";}else{if(G instanceof Date||("nodeType" in G&&"tagName" in G)){return G;}else{if(B.isFunction(G)){return H;}}}L=(B.isNumber(L))?L:3;if(B.isArray(G)){N.push("[");for(I=0,K=G.length;I<K;I=I+1){if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}if(N.length>1){N.pop();}N.push("]");}else{N.push("{");for(I in G){if(B.hasOwnProperty(G,I)){N.push(I+J);if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}}if(N.length>1){N.pop();}N.push("}");}return N.join("");},substitute:function(V,H,O){var L,K,J,R,S,U,Q=[],I,M="dump",P=" ",G="{",T="}",N;for(;;){L=V.lastIndexOf(G);if(L<0){break;}K=V.indexOf(T,L);if(L+1>=K){break;}I=V.substring(L+1,K);R=I;U=null;J=R.indexOf(P);if(J>-1){U=R.substring(J+1);R=R.substring(0,J);}S=H[R];if(O){S=O(R,S,U);}if(B.isObject(S)){if(B.isArray(S)){S=B.dump(S,parseInt(U,10));}else{U=U||"";N=U.indexOf(M);if(N>-1){U=U.substring(4);}if(S.toString===A.toString||N>-1){S=B.dump(S,parseInt(U,10));}else{S=S.toString();}}}else{if(!B.isString(S)&&!B.isNumber(S)){S="~-"+Q.length+"-~";Q[Q.length]=I;}}V=V.substring(0,L)+S+V.substring(K+1);}for(L=Q.length-1;L>=0;L=L-1){V=V.replace(new RegExp("~-"+L+"-~"),"{"+Q[L]+"}","g");}return V;},trim:function(G){try{return G.replace(/^\s+|\s+$/g,"");}catch(H){return G;}},merge:function(){var J={},H=arguments,G=H.length,I;for(I=0;I<G;I=I+1){B.augmentObject(J,H[I],true);}return J;},later:function(N,H,O,J,K){N=N||0;H=H||{};var I=O,M=J,L,G;if(B.isString(O)){I=H[O];}if(!I){throw new TypeError("method undefined");}if(!B.isArray(M)){M=[J];}L=function(){I.apply(H,M);};G=(K)?setInterval(L,N):setTimeout(L,N);return{interval:K,cancel:function(){if(this.interval){clearInterval(G);}else{clearTimeout(G);}}};},isValue:function(G){return(B.isObject(G)||B.isString(G)||B.isNumber(G)||B.isBoolean(G));}};B.hasOwnProperty=(A.hasOwnProperty)?function(G,H){return G&&G.hasOwnProperty(H);}:function(G,H){return !B.isUndefined(G[H])&&G.constructor.prototype[H]!==G[H];};D.augmentObject(B,D,true);YAHOO.util.Lang=B;B.augment=B.augmentProto;YAHOO.augment=B.augmentProto;YAHOO.extend=B.extend;})();YAHOO.register("yahoo",YAHOO,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
if(typeof YAHOO=="undefined"||!YAHOO){var YAHOO={};}YAHOO.namespace=function(){var A=arguments,E=null,C,B,D;for(C=0;C<A.length;C=C+1){D=(""+A[C]).split(".");E=YAHOO;for(B=(D[0]=="YAHOO")?1:0;B<D.length;B=B+1){E[D[B]]=E[D[B]]||{};E=E[D[B]];}}return E;};YAHOO.log=function(D,A,C){var B=YAHOO.widget.Logger;if(B&&B.log){return B.log(D,A,C);}else{return false;}};YAHOO.register=function(A,E,D){var I=YAHOO.env.modules,B,H,G,F,C;if(!I[A]){I[A]={versions:[],builds:[]};}B=I[A];H=D.version;G=D.build;F=YAHOO.env.listeners;B.name=A;B.version=H;B.build=G;B.versions.push(H);B.builds.push(G);B.mainClass=E;for(C=0;C<F.length;C=C+1){F[C](B);}if(E){E.VERSION=H;E.BUILD=G;}else{YAHOO.log("mainClass is undefined for module "+A,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[]};YAHOO.env.getVersion=function(A){return YAHOO.env.modules[A]||null;};YAHOO.env.ua=function(){var C={ie:0,opera:0,gecko:0,webkit:0,mobile:null,air:0,caja:0},B=navigator.userAgent,A;if((/KHTML/).test(B)){C.webkit=1;}A=B.match(/AppleWebKit\/([^\s]*)/);if(A&&A[1]){C.webkit=parseFloat(A[1]);if(/ Mobile\//.test(B)){C.mobile="Apple";}else{A=B.match(/NokiaN[^\/]*/);if(A){C.mobile=A[0];}}A=B.match(/AdobeAIR\/([^\s]*)/);if(A){C.air=A[0];}}if(!C.webkit){A=B.match(/Opera[\s\/]([^\s]*)/);if(A&&A[1]){C.opera=parseFloat(A[1]);A=B.match(/Opera Mini[^;]*/);if(A){C.mobile=A[0];}}else{A=B.match(/MSIE\s([^;]*)/);if(A&&A[1]){C.ie=parseFloat(A[1]);}else{A=B.match(/Gecko\/([^\s]*)/);if(A){C.gecko=1;A=B.match(/rv:([^\s\)]*)/);if(A&&A[1]){C.gecko=parseFloat(A[1]);}}}}}A=B.match(/Caja\/([^\s]*)/);if(A&&A[1]){C.caja=parseFloat(A[1]);}return C;}();(function(){YAHOO.namespace("util","widget","example");if("undefined"!==typeof YAHOO_config){var B=YAHOO_config.listener,A=YAHOO.env.listeners,D=true,C;if(B){for(C=0;C<A.length;C=C+1){if(A[C]==B){D=false;break;}}if(D){A.push(B);}}}})();YAHOO.lang=YAHOO.lang||{};(function(){var B=YAHOO.lang,F="[object Array]",C="[object Function]",A=Object.prototype,E=["toString","valueOf"],D={isArray:function(G){return A.toString.apply(G)===F;},isBoolean:function(G){return typeof G==="boolean";},isFunction:function(G){return A.toString.apply(G)===C;},isNull:function(G){return G===null;},isNumber:function(G){return typeof G==="number"&&isFinite(G);},isObject:function(G){return(G&&(typeof G==="object"||B.isFunction(G)))||false;},isString:function(G){return typeof G==="string";},isUndefined:function(G){return typeof G==="undefined";},_IEEnumFix:(YAHOO.env.ua.ie)?function(I,H){var G,K,J;for(G=0;G<E.length;G=G+1){K=E[G];J=H[K];if(B.isFunction(J)&&J!=A[K]){I[K]=J;}}}:function(){},extend:function(J,K,I){if(!K||!J){throw new Error("extend failed, please check that "+"all dependencies are included.");}var H=function(){},G;H.prototype=K.prototype;J.prototype=new H();J.prototype.constructor=J;J.superclass=K.prototype;if(K.prototype.constructor==A.constructor){K.prototype.constructor=K;}if(I){for(G in I){if(B.hasOwnProperty(I,G)){J.prototype[G]=I[G];}}B._IEEnumFix(J.prototype,I);}},augmentObject:function(K,J){if(!J||!K){throw new Error("Absorb failed, verify dependencies.");}var G=arguments,I,L,H=G[2];if(H&&H!==true){for(I=2;I<G.length;I=I+1){K[G[I]]=J[G[I]];}}else{for(L in J){if(H||!(L in K)){K[L]=J[L];}}B._IEEnumFix(K,J);}},augmentProto:function(J,I){if(!I||!J){throw new Error("Augment failed, verify dependencies.");}var G=[J.prototype,I.prototype],H;for(H=2;H<arguments.length;H=H+1){G.push(arguments[H]);}B.augmentObject.apply(this,G);},dump:function(G,L){var I,K,N=[],O="{...}",H="f(){...}",M=", ",J=" => ";if(!B.isObject(G)){return G+"";}else{if(G instanceof Date||("nodeType" in G&&"tagName" in G)){return G;}else{if(B.isFunction(G)){return H;}}}L=(B.isNumber(L))?L:3;if(B.isArray(G)){N.push("[");for(I=0,K=G.length;I<K;I=I+1){if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}if(N.length>1){N.pop();}N.push("]");}else{N.push("{");for(I in G){if(B.hasOwnProperty(G,I)){N.push(I+J);if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}}if(N.length>1){N.pop();}N.push("}");}return N.join("");},substitute:function(V,H,O){var L,K,J,R,S,U,Q=[],I,M="dump",P=" ",G="{",T="}",N;for(;;){L=V.lastIndexOf(G);if(L<0){break;}K=V.indexOf(T,L);if(L+1>=K){break;}I=V.substring(L+1,K);R=I;U=null;J=R.indexOf(P);if(J>-1){U=R.substring(J+1);R=R.substring(0,J);}S=H[R];if(O){S=O(R,S,U);}if(B.isObject(S)){if(B.isArray(S)){S=B.dump(S,parseInt(U,10));}else{U=U||"";N=U.indexOf(M);if(N>-1){U=U.substring(4);}if(S.toString===A.toString||N>-1){S=B.dump(S,parseInt(U,10));}else{S=S.toString();}}}else{if(!B.isString(S)&&!B.isNumber(S)){S="~-"+Q.length+"-~";Q[Q.length]=I;}}V=V.substring(0,L)+S+V.substring(K+1);}for(L=Q.length-1;L>=0;L=L-1){V=V.replace(new RegExp("~-"+L+"-~"),"{"+Q[L]+"}","g");}return V;},trim:function(G){try{return G.replace(/^\s+|\s+$/g,"");}catch(H){return G;}},merge:function(){var J={},H=arguments,G=H.length,I;for(I=0;I<G;I=I+1){B.augmentObject(J,H[I],true);}return J;},later:function(N,H,O,J,K){N=N||0;H=H||{};var I=O,M=J,L,G;if(B.isString(O)){I=H[O];}if(!I){throw new TypeError("method undefined");}if(!B.isArray(M)){M=[J];}L=function(){I.apply(H,M);};G=(K)?setInterval(L,N):setTimeout(L,N);return{interval:K,cancel:function(){if(this.interval){clearInterval(G);}else{clearTimeout(G);}}};},isValue:function(G){return(B.isObject(G)||B.isString(G)||B.isNumber(G)||B.isBoolean(G));}};B.hasOwnProperty=(A.hasOwnProperty)?function(G,H){return G&&G.hasOwnProperty(H);}:function(G,H){return !B.isUndefined(G[H])&&G.constructor.prototype[H]!==G[H];};D.augmentObject(B,D,true);YAHOO.util.Lang=B;B.augment=B.augmentProto;YAHOO.augment=B.augmentProto;YAHOO.extend=B.extend;})();YAHOO.register("yahoo",YAHOO,{version:"2.7.0",build:"1799"});(function(){YAHOO.env._id_counter=YAHOO.env._id_counter||0;var E=YAHOO.util,L=YAHOO.lang,m=YAHOO.env.ua,A=YAHOO.lang.trim,d={},h={},N=/^t(?:able|d|h)$/i,X=/color$/i,K=window.document,W=K.documentElement,e="ownerDocument",n="defaultView",v="documentElement",t="compatMode",b="offsetLeft",P="offsetTop",u="offsetParent",Z="parentNode",l="nodeType",C="tagName",O="scrollLeft",i="scrollTop",Q="getBoundingClientRect",w="getComputedStyle",a="currentStyle",M="CSS1Compat",c="BackCompat",g="class",F="className",J="",B=" ",s="(?:^|\\s)",k="(?= |$)",U="g",p="position",f="fixed",V="relative",j="left",o="top",r="medium",q="borderLeftWidth",R="borderTopWidth",D=m.opera,I=m.webkit,H=m.gecko,T=m.ie;E.Dom={CUSTOM_ATTRIBUTES:(!W.hasAttribute)?{"for":"htmlFor","class":F}:{"htmlFor":"for","className":g},get:function(y){var AA,Y,z,x,G;if(y){if(y[l]||y.item){return y;}if(typeof y==="string"){AA=y;y=K.getElementById(y);if(y&&y.id===AA){return y;}else{if(y&&K.all){y=null;Y=K.all[AA];for(x=0,G=Y.length;x<G;++x){if(Y[x].id===AA){return Y[x];}}}}return y;}if(y.DOM_EVENTS){y=y.get("element");}if("length" in y){z=[];for(x=0,G=y.length;x<G;++x){z[z.length]=E.Dom.get(y[x]);}return z;}return y;}return null;},getComputedStyle:function(G,Y){if(window[w]){return G[e][n][w](G,null)[Y];}else{if(G[a]){return E.Dom.IE_ComputedStyle.get(G,Y);}}},getStyle:function(G,Y){return E.Dom.batch(G,E.Dom._getStyle,Y);},_getStyle:function(){if(window[w]){return function(G,y){y=(y==="float")?y="cssFloat":E.Dom._toCamel(y);var x=G.style[y],Y;if(!x){Y=G[e][n][w](G,null);if(Y){x=Y[y];}}return x;};}else{if(W[a]){return function(G,y){var x;switch(y){case"opacity":x=100;try{x=G.filters["DXImageTransform.Microsoft.Alpha"].opacity;}catch(z){try{x=G.filters("alpha").opacity;}catch(Y){}}return x/100;case"float":y="styleFloat";default:y=E.Dom._toCamel(y);x=G[a]?G[a][y]:null;return(G.style[y]||x);}};}}}(),setStyle:function(G,Y,x){E.Dom.batch(G,E.Dom._setStyle,{prop:Y,val:x});},_setStyle:function(){if(T){return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){switch(x){case"opacity":if(L.isString(Y.style.filter)){Y.style.filter="alpha(opacity="+y*100+")";if(!Y[a]||!Y[a].hasLayout){Y.style.zoom=1;}}break;case"float":x="styleFloat";default:Y.style[x]=y;}}else{}};}else{return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){if(x=="float"){x="cssFloat";}Y.style[x]=y;}else{}};}}(),getXY:function(G){return E.Dom.batch(G,E.Dom._getXY);},_canPosition:function(G){return(E.Dom._getStyle(G,"display")!=="none"&&E.Dom._inDoc(G));},_getXY:function(){if(K[v][Q]){return function(y){var z,Y,AA,AF,AE,AD,AC,G,x,AB=Math.floor,AG=false;if(E.Dom._canPosition(y)){AA=y[Q]();AF=y[e];z=E.Dom.getDocumentScrollLeft(AF);Y=E.Dom.getDocumentScrollTop(AF);AG=[AB(AA[j]),AB(AA[o])];if(T&&m.ie<8){AE=2;AD=2;AC=AF[t];G=S(AF[v],q);x=S(AF[v],R);if(m.ie===6){if(AC!==c){AE=0;AD=0;}}if((AC==c)){if(G!==r){AE=parseInt(G,10);}if(x!==r){AD=parseInt(x,10);}}AG[0]-=AE;AG[1]-=AD;}if((Y||z)){AG[0]+=z;AG[1]+=Y;}AG[0]=AB(AG[0]);AG[1]=AB(AG[1]);}else{}return AG;};}else{return function(y){var x,Y,AA,AB,AC,z=false,G=y;if(E.Dom._canPosition(y)){z=[y[b],y[P]];x=E.Dom.getDocumentScrollLeft(y[e]);Y=E.Dom.getDocumentScrollTop(y[e]);AC=((H||m.webkit>519)?true:false);while((G=G[u])){z[0]+=G[b];z[1]+=G[P];if(AC){z=E.Dom._calcBorders(G,z);}}if(E.Dom._getStyle(y,p)!==f){G=y;while((G=G[Z])&&G[C]){AA=G[i];AB=G[O];if(H&&(E.Dom._getStyle(G,"overflow")!=="visible")){z=E.Dom._calcBorders(G,z);}if(AA||AB){z[0]-=AB;z[1]-=AA;}}z[0]+=x;z[1]+=Y;}else{if(D){z[0]-=x;z[1]-=Y;}else{if(I||H){z[0]+=x;z[1]+=Y;}}}z[0]=Math.floor(z[0]);z[1]=Math.floor(z[1]);}else{}return z;};}}(),getX:function(G){var Y=function(x){return E.Dom.getXY(x)[0];};return E.Dom.batch(G,Y,E.Dom,true);},getY:function(G){var Y=function(x){return E.Dom.getXY(x)[1];};return E.Dom.batch(G,Y,E.Dom,true);},setXY:function(G,x,Y){E.Dom.batch(G,E.Dom._setXY,{pos:x,noRetry:Y});},_setXY:function(G,z){var AA=E.Dom._getStyle(G,p),y=E.Dom.setStyle,AD=z.pos,Y=z.noRetry,AB=[parseInt(E.Dom.getComputedStyle(G,j),10),parseInt(E.Dom.getComputedStyle(G,o),10)],AC,x;if(AA=="static"){AA=V;y(G,p,AA);}AC=E.Dom._getXY(G);if(!AD||AC===false){return false;}if(isNaN(AB[0])){AB[0]=(AA==V)?0:G[b];}if(isNaN(AB[1])){AB[1]=(AA==V)?0:G[P];}if(AD[0]!==null){y(G,j,AD[0]-AC[0]+AB[0]+"px");}if(AD[1]!==null){y(G,o,AD[1]-AC[1]+AB[1]+"px");}if(!Y){x=E.Dom._getXY(G);if((AD[0]!==null&&x[0]!=AD[0])||(AD[1]!==null&&x[1]!=AD[1])){E.Dom._setXY(G,{pos:AD,noRetry:true});}}},setX:function(Y,G){E.Dom.setXY(Y,[G,null]);},setY:function(G,Y){E.Dom.setXY(G,[null,Y]);},getRegion:function(G){var Y=function(x){var y=false;if(E.Dom._canPosition(x)){y=E.Region.getRegion(x);}else{}return y;};return E.Dom.batch(G,Y,E.Dom,true);},getClientWidth:function(){return E.Dom.getViewportWidth();},getClientHeight:function(){return E.Dom.getViewportHeight();},getElementsByClassName:function(AB,AF,AC,AE,x,AD){AB=L.trim(AB);AF=AF||"*";AC=(AC)?E.Dom.get(AC):null||K;if(!AC){return[];}var Y=[],G=AC.getElementsByTagName(AF),z=E.Dom.hasClass;for(var y=0,AA=G.length;y<AA;++y){if(z(G[y],AB)){Y[Y.length]=G[y];}}if(AE){E.Dom.batch(Y,AE,x,AD);}return Y;},hasClass:function(Y,G){return E.Dom.batch(Y,E.Dom._hasClass,G);},_hasClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom.getAttribute(x,F)||J;if(Y.exec){G=Y.test(y);}else{G=Y&&(B+y+B).indexOf(B+Y+B)>-1;}}else{}return G;},addClass:function(Y,G){return E.Dom.batch(Y,E.Dom._addClass,G);},_addClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom.getAttribute(x,F)||J;if(!E.Dom._hasClass(x,Y)){E.Dom.setAttribute(x,F,A(y+B+Y));G=true;}}else{}return G;},removeClass:function(Y,G){return E.Dom.batch(Y,E.Dom._removeClass,G);},_removeClass:function(y,x){var Y=false,AA,z,G;if(y&&x){AA=E.Dom.getAttribute(y,F)||J;E.Dom.setAttribute(y,F,AA.replace(E.Dom._getClassRegex(x),J));z=E.Dom.getAttribute(y,F);if(AA!==z){E.Dom.setAttribute(y,F,A(z));Y=true;if(E.Dom.getAttribute(y,F)===""){G=(y.hasAttribute&&y.hasAttribute(g))?g:F;y.removeAttribute(G);}}}else{}return Y;},replaceClass:function(x,Y,G){return E.Dom.batch(x,E.Dom._replaceClass,{from:Y,to:G});
},_replaceClass:function(y,x){var Y,AB,AA,G=false,z;if(y&&x){AB=x.from;AA=x.to;if(!AA){G=false;}else{if(!AB){G=E.Dom._addClass(y,x.to);}else{if(AB!==AA){z=E.Dom.getAttribute(y,F)||J;Y=(B+z.replace(E.Dom._getClassRegex(AB),B+AA)).split(E.Dom._getClassRegex(AA));Y.splice(1,0,B+AA);E.Dom.setAttribute(y,F,A(Y.join(J)));G=true;}}}}else{}return G;},generateId:function(G,x){x=x||"yui-gen";var Y=function(y){if(y&&y.id){return y.id;}var z=x+YAHOO.env._id_counter++;if(y){if(y[e].getElementById(z)){return E.Dom.generateId(y,z+x);}y.id=z;}return z;};return E.Dom.batch(G,Y,E.Dom,true)||Y.apply(E.Dom,arguments);},isAncestor:function(Y,x){Y=E.Dom.get(Y);x=E.Dom.get(x);var G=false;if((Y&&x)&&(Y[l]&&x[l])){if(Y.contains&&Y!==x){G=Y.contains(x);}else{if(Y.compareDocumentPosition){G=!!(Y.compareDocumentPosition(x)&16);}}}else{}return G;},inDocument:function(G,Y){return E.Dom._inDoc(E.Dom.get(G),Y);},_inDoc:function(Y,x){var G=false;if(Y&&Y[C]){x=x||Y[e];G=E.Dom.isAncestor(x[v],Y);}else{}return G;},getElementsBy:function(Y,AF,AB,AD,y,AC,AE){AF=AF||"*";AB=(AB)?E.Dom.get(AB):null||K;if(!AB){return[];}var x=[],G=AB.getElementsByTagName(AF);for(var z=0,AA=G.length;z<AA;++z){if(Y(G[z])){if(AE){x=G[z];break;}else{x[x.length]=G[z];}}}if(AD){E.Dom.batch(x,AD,y,AC);}return x;},getElementBy:function(x,G,Y){return E.Dom.getElementsBy(x,G,Y,null,null,null,true);},batch:function(x,AB,AA,z){var y=[],Y=(z)?AA:window;x=(x&&(x[C]||x.item))?x:E.Dom.get(x);if(x&&AB){if(x[C]||x.length===undefined){return AB.call(Y,x,AA);}for(var G=0;G<x.length;++G){y[y.length]=AB.call(Y,x[G],AA);}}else{return false;}return y;},getDocumentHeight:function(){var Y=(K[t]!=M||I)?K.body.scrollHeight:W.scrollHeight,G=Math.max(Y,E.Dom.getViewportHeight());return G;},getDocumentWidth:function(){var Y=(K[t]!=M||I)?K.body.scrollWidth:W.scrollWidth,G=Math.max(Y,E.Dom.getViewportWidth());return G;},getViewportHeight:function(){var G=self.innerHeight,Y=K[t];if((Y||T)&&!D){G=(Y==M)?W.clientHeight:K.body.clientHeight;}return G;},getViewportWidth:function(){var G=self.innerWidth,Y=K[t];if(Y||T){G=(Y==M)?W.clientWidth:K.body.clientWidth;}return G;},getAncestorBy:function(G,Y){while((G=G[Z])){if(E.Dom._testElement(G,Y)){return G;}}return null;},getAncestorByClassName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return E.Dom.hasClass(y,G);};return E.Dom.getAncestorBy(Y,x);},getAncestorByTagName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return y[C]&&y[C].toUpperCase()==G.toUpperCase();};return E.Dom.getAncestorBy(Y,x);},getPreviousSiblingBy:function(G,Y){while(G){G=G.previousSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getPreviousSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getPreviousSiblingBy(G);},getNextSiblingBy:function(G,Y){while(G){G=G.nextSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getNextSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getNextSiblingBy(G);},getFirstChildBy:function(G,x){var Y=(E.Dom._testElement(G.firstChild,x))?G.firstChild:null;return Y||E.Dom.getNextSiblingBy(G.firstChild,x);},getFirstChild:function(G,Y){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getFirstChildBy(G);},getLastChildBy:function(G,x){if(!G){return null;}var Y=(E.Dom._testElement(G.lastChild,x))?G.lastChild:null;return Y||E.Dom.getPreviousSiblingBy(G.lastChild,x);},getLastChild:function(G){G=E.Dom.get(G);return E.Dom.getLastChildBy(G);},getChildrenBy:function(Y,y){var x=E.Dom.getFirstChildBy(Y,y),G=x?[x]:[];E.Dom.getNextSiblingBy(x,function(z){if(!y||y(z)){G[G.length]=z;}return false;});return G;},getChildren:function(G){G=E.Dom.get(G);if(!G){}return E.Dom.getChildrenBy(G);},getDocumentScrollLeft:function(G){G=G||K;return Math.max(G[v].scrollLeft,G.body.scrollLeft);},getDocumentScrollTop:function(G){G=G||K;return Math.max(G[v].scrollTop,G.body.scrollTop);},insertBefore:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}return G[Z].insertBefore(Y,G);},insertAfter:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}if(G.nextSibling){return G[Z].insertBefore(Y,G.nextSibling);}else{return G[Z].appendChild(Y);}},getClientRegion:function(){var x=E.Dom.getDocumentScrollTop(),Y=E.Dom.getDocumentScrollLeft(),y=E.Dom.getViewportWidth()+Y,G=E.Dom.getViewportHeight()+x;return new E.Region(x,y,G,Y);},setAttribute:function(Y,G,x){G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;Y.setAttribute(G,x);},getAttribute:function(Y,G){G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;return Y.getAttribute(G);},_toCamel:function(Y){var x=d;function G(y,z){return z.toUpperCase();}return x[Y]||(x[Y]=Y.indexOf("-")===-1?Y:Y.replace(/-([a-z])/gi,G));},_getClassRegex:function(Y){var G;if(Y!==undefined){if(Y.exec){G=Y;}else{G=h[Y];if(!G){Y=Y.replace(E.Dom._patterns.CLASS_RE_TOKENS,"\\$1");G=h[Y]=new RegExp(s+Y+k,U);}}}return G;},_patterns:{ROOT_TAG:/^body|html$/i,CLASS_RE_TOKENS:/([\.\(\)\^\$\*\+\?\|\[\]\{\}])/g},_testElement:function(G,Y){return G&&G[l]==1&&(!Y||Y(G));},_calcBorders:function(x,y){var Y=parseInt(E.Dom[w](x,R),10)||0,G=parseInt(E.Dom[w](x,q),10)||0;if(H){if(N.test(x[C])){Y=0;G=0;}}y[0]+=G;y[1]+=Y;return y;}};var S=E.Dom[w];if(m.opera){E.Dom[w]=function(Y,G){var x=S(Y,G);if(X.test(G)){x=E.Dom.Color.toRGB(x);}return x;};}if(m.webkit){E.Dom[w]=function(Y,G){var x=S(Y,G);if(x==="rgba(0, 0, 0, 0)"){x="transparent";}return x;};}})();YAHOO.util.Region=function(C,D,A,B){this.top=C;this.y=C;this[1]=C;this.right=D;this.bottom=A;this.left=B;this.x=B;this[0]=B;this.width=this.right-this.left;this.height=this.bottom-this.top;};YAHOO.util.Region.prototype.contains=function(A){return(A.left>=this.left&&A.right<=this.right&&A.top>=this.top&&A.bottom<=this.bottom);};YAHOO.util.Region.prototype.getArea=function(){return((this.bottom-this.top)*(this.right-this.left));};YAHOO.util.Region.prototype.intersect=function(E){var C=Math.max(this.top,E.top),D=Math.min(this.right,E.right),A=Math.min(this.bottom,E.bottom),B=Math.max(this.left,E.left);if(A>=C&&D>=B){return new YAHOO.util.Region(C,D,A,B);
}else{return null;}};YAHOO.util.Region.prototype.union=function(E){var C=Math.min(this.top,E.top),D=Math.max(this.right,E.right),A=Math.max(this.bottom,E.bottom),B=Math.min(this.left,E.left);return new YAHOO.util.Region(C,D,A,B);};YAHOO.util.Region.prototype.toString=function(){return("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+", height: "+this.height+", width: "+this.width+"}");};YAHOO.util.Region.getRegion=function(D){var F=YAHOO.util.Dom.getXY(D),C=F[1],E=F[0]+D.offsetWidth,A=F[1]+D.offsetHeight,B=F[0];return new YAHOO.util.Region(C,E,A,B);};YAHOO.util.Point=function(A,B){if(YAHOO.lang.isArray(A)){B=A[1];A=A[0];}YAHOO.util.Point.superclass.constructor.call(this,B,A,B,A);};YAHOO.extend(YAHOO.util.Point,YAHOO.util.Region);(function(){var B=YAHOO.util,A="clientTop",F="clientLeft",J="parentNode",K="right",W="hasLayout",I="px",U="opacity",L="auto",D="borderLeftWidth",G="borderTopWidth",P="borderRightWidth",V="borderBottomWidth",S="visible",Q="transparent",N="height",E="width",H="style",T="currentStyle",R=/^width|height$/,O=/^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,M={get:function(X,Z){var Y="",a=X[T][Z];if(Z===U){Y=B.Dom.getStyle(X,U);}else{if(!a||(a.indexOf&&a.indexOf(I)>-1)){Y=a;}else{if(B.Dom.IE_COMPUTED[Z]){Y=B.Dom.IE_COMPUTED[Z](X,Z);}else{if(O.test(a)){Y=B.Dom.IE.ComputedStyle.getPixel(X,Z);}else{Y=a;}}}}return Y;},getOffset:function(Z,e){var b=Z[T][e],X=e.charAt(0).toUpperCase()+e.substr(1),c="offset"+X,Y="pixel"+X,a="",d;if(b==L){d=Z[c];if(d===undefined){a=0;}a=d;if(R.test(e)){Z[H][e]=d;if(Z[c]>d){a=d-(Z[c]-d);}Z[H][e]=L;}}else{if(!Z[H][Y]&&!Z[H][e]){Z[H][e]=b;}a=Z[H][Y];}return a+I;},getBorderWidth:function(X,Z){var Y=null;if(!X[T][W]){X[H].zoom=1;}switch(Z){case G:Y=X[A];break;case V:Y=X.offsetHeight-X.clientHeight-X[A];break;case D:Y=X[F];break;case P:Y=X.offsetWidth-X.clientWidth-X[F];break;}return Y+I;},getPixel:function(Y,X){var a=null,b=Y[T][K],Z=Y[T][X];Y[H][K]=Z;a=Y[H].pixelRight;Y[H][K]=b;return a+I;},getMargin:function(Y,X){var Z;if(Y[T][X]==L){Z=0+I;}else{Z=B.Dom.IE.ComputedStyle.getPixel(Y,X);}return Z;},getVisibility:function(Y,X){var Z;while((Z=Y[T])&&Z[X]=="inherit"){Y=Y[J];}return(Z)?Z[X]:S;},getColor:function(Y,X){return B.Dom.Color.toRGB(Y[T][X])||Q;},getBorderColor:function(Y,X){var Z=Y[T],a=Z[X]||Z.color;return B.Dom.Color.toRGB(B.Dom.Color.toHex(a));}},C={};C.top=C.right=C.bottom=C.left=C[E]=C[N]=M.getOffset;C.color=M.getColor;C[G]=C[P]=C[V]=C[D]=M.getBorderWidth;C.marginTop=C.marginRight=C.marginBottom=C.marginLeft=M.getMargin;C.visibility=M.getVisibility;C.borderColor=C.borderTopColor=C.borderRightColor=C.borderBottomColor=C.borderLeftColor=M.getBorderColor;B.Dom.IE_COMPUTED=C;B.Dom.IE_ComputedStyle=M;})();(function(){var C="toString",A=parseInt,B=RegExp,D=YAHOO.util;D.Dom.Color={KEYWORDS:{black:"000",silver:"c0c0c0",gray:"808080",white:"fff",maroon:"800000",red:"f00",purple:"800080",fuchsia:"f0f",green:"008000",lime:"0f0",olive:"808000",yellow:"ff0",navy:"000080",blue:"00f",teal:"008080",aqua:"0ff"},re_RGB:/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,re_hex:/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,re_hex3:/([0-9A-F])/gi,toRGB:function(E){if(!D.Dom.Color.re_RGB.test(E)){E=D.Dom.Color.toHex(E);}if(D.Dom.Color.re_hex.exec(E)){E="rgb("+[A(B.$1,16),A(B.$2,16),A(B.$3,16)].join(", ")+")";}return E;},toHex:function(H){H=D.Dom.Color.KEYWORDS[H]||H;if(D.Dom.Color.re_RGB.exec(H)){var G=(B.$1.length===1)?"0"+B.$1:Number(B.$1),F=(B.$2.length===1)?"0"+B.$2:Number(B.$2),E=(B.$3.length===1)?"0"+B.$3:Number(B.$3);H=[G[C](16),F[C](16),E[C](16)].join("");}if(H.length<6){H=H.replace(D.Dom.Color.re_hex3,"$1$1");}if(H!=="transparent"&&H.indexOf("#")<0){H="#"+H;}return H.toLowerCase();}};}());YAHOO.register("dom",YAHOO.util.Dom,{version:"2.7.0",build:"1799"});YAHOO.util.CustomEvent=function(D,C,B,A){this.type=D;this.scope=C||window;this.silent=B;this.signature=A||YAHOO.util.CustomEvent.LIST;this.subscribers=[];if(!this.silent){}var E="_YUICEOnSubscribe";if(D!==E){this.subscribeEvent=new YAHOO.util.CustomEvent(E,this,true);}this.lastError=null;};YAHOO.util.CustomEvent.LIST=0;YAHOO.util.CustomEvent.FLAT=1;YAHOO.util.CustomEvent.prototype={subscribe:function(A,B,C){if(!A){throw new Error("Invalid callback for subscriber to '"+this.type+"'");}if(this.subscribeEvent){this.subscribeEvent.fire(A,B,C);}this.subscribers.push(new YAHOO.util.Subscriber(A,B,C));},unsubscribe:function(D,F){if(!D){return this.unsubscribeAll();}var E=false;for(var B=0,A=this.subscribers.length;B<A;++B){var C=this.subscribers[B];if(C&&C.contains(D,F)){this._delete(B);E=true;}}return E;},fire:function(){this.lastError=null;var K=[],E=this.subscribers.length;if(!E&&this.silent){return true;}var I=[].slice.call(arguments,0),G=true,D,J=false;if(!this.silent){}var C=this.subscribers.slice(),A=YAHOO.util.Event.throwErrors;for(D=0;D<E;++D){var M=C[D];if(!M){J=true;}else{if(!this.silent){}var L=M.getScope(this.scope);if(this.signature==YAHOO.util.CustomEvent.FLAT){var B=null;if(I.length>0){B=I[0];}try{G=M.fn.call(L,B,M.obj);}catch(F){this.lastError=F;if(A){throw F;}}}else{try{G=M.fn.call(L,this.type,I,M.obj);}catch(H){this.lastError=H;if(A){throw H;}}}if(false===G){if(!this.silent){}break;}}}return(G!==false);},unsubscribeAll:function(){var A=this.subscribers.length,B;for(B=A-1;B>-1;B--){this._delete(B);}this.subscribers=[];return A;},_delete:function(A){var B=this.subscribers[A];if(B){delete B.fn;delete B.obj;}this.subscribers.splice(A,1);},toString:function(){return"CustomEvent: "+"'"+this.type+"', "+"context: "+this.scope;}};YAHOO.util.Subscriber=function(A,B,C){this.fn=A;this.obj=YAHOO.lang.isUndefined(B)?null:B;this.overrideContext=C;};YAHOO.util.Subscriber.prototype.getScope=function(A){if(this.overrideContext){if(this.overrideContext===true){return this.obj;}else{return this.overrideContext;}}return A;};YAHOO.util.Subscriber.prototype.contains=function(A,B){if(B){return(this.fn==A&&this.obj==B);}else{return(this.fn==A);}};YAHOO.util.Subscriber.prototype.toString=function(){return"Subscriber { obj: "+this.obj+", overrideContext: "+(this.overrideContext||"no")+" }";};if(!YAHOO.util.Event){YAHOO.util.Event=function(){var H=false;var I=[];var J=[];var G=[];var E=[];var C=0;var F=[];var B=[];var A=0;var D={63232:38,63233:40,63234:37,63235:39,63276:33,63277:34,25:9};var K=YAHOO.env.ua.ie?"focusin":"focus";var L=YAHOO.env.ua.ie?"focusout":"blur";return{POLL_RETRYS:2000,POLL_INTERVAL:20,EL:0,TYPE:1,FN:2,WFN:3,UNLOAD_OBJ:3,ADJ_SCOPE:4,OBJ:5,OVERRIDE:6,lastError:null,isSafari:YAHOO.env.ua.webkit,webkit:YAHOO.env.ua.webkit,isIE:YAHOO.env.ua.ie,_interval:null,_dri:null,DOMReady:false,throwErrors:false,startInterval:function(){if(!this._interval){var M=this;var N=function(){M._tryPreloadAttach();};this._interval=setInterval(N,this.POLL_INTERVAL);}},onAvailable:function(S,O,Q,R,P){var M=(YAHOO.lang.isString(S))?[S]:S;for(var N=0;N<M.length;N=N+1){F.push({id:M[N],fn:O,obj:Q,overrideContext:R,checkReady:P});}C=this.POLL_RETRYS;this.startInterval();},onContentReady:function(P,M,N,O){this.onAvailable(P,M,N,O,true);},onDOMReady:function(M,N,O){if(this.DOMReady){setTimeout(function(){var P=window;if(O){if(O===true){P=N;}else{P=O;}}M.call(P,"DOMReady",[],N);},0);}else{this.DOMReadyEvent.subscribe(M,N,O);}},_addListener:function(O,M,Y,S,W,b){if(!Y||!Y.call){return false;}if(this._isValidCollection(O)){var Z=true;for(var T=0,V=O.length;T<V;++T){Z=this.on(O[T],M,Y,S,W)&&Z;}return Z;}else{if(YAHOO.lang.isString(O)){var R=this.getEl(O);if(R){O=R;}else{this.onAvailable(O,function(){YAHOO.util.Event.on(O,M,Y,S,W);});return true;}}}if(!O){return false;}if("unload"==M&&S!==this){J[J.length]=[O,M,Y,S,W];return true;}var N=O;if(W){if(W===true){N=S;}else{N=W;}}var P=function(c){return Y.call(N,YAHOO.util.Event.getEvent(c,O),S);};var a=[O,M,Y,P,N,S,W];var U=I.length;I[U]=a;if(this.useLegacyEvent(O,M)){var Q=this.getLegacyIndex(O,M);if(Q==-1||O!=G[Q][0]){Q=G.length;B[O.id+M]=Q;G[Q]=[O,M,O["on"+M]];E[Q]=[];O["on"+M]=function(c){YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(c),Q);};}E[Q].push(a);}else{try{this._simpleAdd(O,M,P,b);}catch(X){this.lastError=X;this.removeListener(O,M,Y);return false;}}return true;},addListener:function(N,Q,M,O,P){return this._addListener(N,Q,M,O,P,false);},addFocusListener:function(N,M,O,P){return this._addListener(N,K,M,O,P,true);},removeFocusListener:function(N,M){return this.removeListener(N,K,M);},addBlurListener:function(N,M,O,P){return this._addListener(N,L,M,O,P,true);},removeBlurListener:function(N,M){return this.removeListener(N,L,M);},fireLegacyEvent:function(R,P){var T=true,M,V,U,N,S;V=E[P].slice();for(var O=0,Q=V.length;O<Q;++O){U=V[O];if(U&&U[this.WFN]){N=U[this.ADJ_SCOPE];S=U[this.WFN].call(N,R);T=(T&&S);}}M=G[P];if(M&&M[2]){M[2](R);}return T;},getLegacyIndex:function(N,O){var M=this.generateId(N)+O;if(typeof B[M]=="undefined"){return -1;}else{return B[M];}},useLegacyEvent:function(M,N){return(this.webkit&&this.webkit<419&&("click"==N||"dblclick"==N));},removeListener:function(N,M,V){var Q,T,X;if(typeof N=="string"){N=this.getEl(N);}else{if(this._isValidCollection(N)){var W=true;for(Q=N.length-1;Q>-1;Q--){W=(this.removeListener(N[Q],M,V)&&W);}return W;}}if(!V||!V.call){return this.purgeElement(N,false,M);}if("unload"==M){for(Q=J.length-1;Q>-1;Q--){X=J[Q];if(X&&X[0]==N&&X[1]==M&&X[2]==V){J.splice(Q,1);return true;}}return false;}var R=null;var S=arguments[3];if("undefined"===typeof S){S=this._getCacheIndex(N,M,V);}if(S>=0){R=I[S];}if(!N||!R){return false;}if(this.useLegacyEvent(N,M)){var P=this.getLegacyIndex(N,M);var O=E[P];if(O){for(Q=0,T=O.length;Q<T;++Q){X=O[Q];if(X&&X[this.EL]==N&&X[this.TYPE]==M&&X[this.FN]==V){O.splice(Q,1);break;}}}}else{try{this._simpleRemove(N,M,R[this.WFN],false);}catch(U){this.lastError=U;return false;}}delete I[S][this.WFN];delete I[S][this.FN];
I.splice(S,1);return true;},getTarget:function(O,N){var M=O.target||O.srcElement;return this.resolveTextNode(M);},resolveTextNode:function(N){try{if(N&&3==N.nodeType){return N.parentNode;}}catch(M){}return N;},getPageX:function(N){var M=N.pageX;if(!M&&0!==M){M=N.clientX||0;if(this.isIE){M+=this._getScrollLeft();}}return M;},getPageY:function(M){var N=M.pageY;if(!N&&0!==N){N=M.clientY||0;if(this.isIE){N+=this._getScrollTop();}}return N;},getXY:function(M){return[this.getPageX(M),this.getPageY(M)];},getRelatedTarget:function(N){var M=N.relatedTarget;if(!M){if(N.type=="mouseout"){M=N.toElement;}else{if(N.type=="mouseover"){M=N.fromElement;}}}return this.resolveTextNode(M);},getTime:function(O){if(!O.time){var N=new Date().getTime();try{O.time=N;}catch(M){this.lastError=M;return N;}}return O.time;},stopEvent:function(M){this.stopPropagation(M);this.preventDefault(M);},stopPropagation:function(M){if(M.stopPropagation){M.stopPropagation();}else{M.cancelBubble=true;}},preventDefault:function(M){if(M.preventDefault){M.preventDefault();}else{M.returnValue=false;}},getEvent:function(O,M){var N=O||window.event;if(!N){var P=this.getEvent.caller;while(P){N=P.arguments[0];if(N&&Event==N.constructor){break;}P=P.caller;}}return N;},getCharCode:function(N){var M=N.keyCode||N.charCode||0;if(YAHOO.env.ua.webkit&&(M in D)){M=D[M];}return M;},_getCacheIndex:function(Q,R,P){for(var O=0,N=I.length;O<N;O=O+1){var M=I[O];if(M&&M[this.FN]==P&&M[this.EL]==Q&&M[this.TYPE]==R){return O;}}return -1;},generateId:function(M){var N=M.id;if(!N){N="yuievtautoid-"+A;++A;M.id=N;}return N;},_isValidCollection:function(N){try{return(N&&typeof N!=="string"&&N.length&&!N.tagName&&!N.alert&&typeof N[0]!=="undefined");}catch(M){return false;}},elCache:{},getEl:function(M){return(typeof M==="string")?document.getElementById(M):M;},clearCache:function(){},DOMReadyEvent:new YAHOO.util.CustomEvent("DOMReady",this),_load:function(N){if(!H){H=true;var M=YAHOO.util.Event;M._ready();M._tryPreloadAttach();}},_ready:function(N){var M=YAHOO.util.Event;if(!M.DOMReady){M.DOMReady=true;M.DOMReadyEvent.fire();M._simpleRemove(document,"DOMContentLoaded",M._ready);}},_tryPreloadAttach:function(){if(F.length===0){C=0;if(this._interval){clearInterval(this._interval);this._interval=null;}return;}if(this.locked){return;}if(this.isIE){if(!this.DOMReady){this.startInterval();return;}}this.locked=true;var S=!H;if(!S){S=(C>0&&F.length>0);}var R=[];var T=function(V,W){var U=V;if(W.overrideContext){if(W.overrideContext===true){U=W.obj;}else{U=W.overrideContext;}}W.fn.call(U,W.obj);};var N,M,Q,P,O=[];for(N=0,M=F.length;N<M;N=N+1){Q=F[N];if(Q){P=this.getEl(Q.id);if(P){if(Q.checkReady){if(H||P.nextSibling||!S){O.push(Q);F[N]=null;}}else{T(P,Q);F[N]=null;}}else{R.push(Q);}}}for(N=0,M=O.length;N<M;N=N+1){Q=O[N];T(this.getEl(Q.id),Q);}C--;if(S){for(N=F.length-1;N>-1;N--){Q=F[N];if(!Q||!Q.id){F.splice(N,1);}}this.startInterval();}else{if(this._interval){clearInterval(this._interval);this._interval=null;}}this.locked=false;},purgeElement:function(Q,R,T){var O=(YAHOO.lang.isString(Q))?this.getEl(Q):Q;var S=this.getListeners(O,T),P,M;if(S){for(P=S.length-1;P>-1;P--){var N=S[P];this.removeListener(O,N.type,N.fn);}}if(R&&O&&O.childNodes){for(P=0,M=O.childNodes.length;P<M;++P){this.purgeElement(O.childNodes[P],R,T);}}},getListeners:function(O,M){var R=[],N;if(!M){N=[I,J];}else{if(M==="unload"){N=[J];}else{N=[I];}}var T=(YAHOO.lang.isString(O))?this.getEl(O):O;for(var Q=0;Q<N.length;Q=Q+1){var V=N[Q];if(V){for(var S=0,U=V.length;S<U;++S){var P=V[S];if(P&&P[this.EL]===T&&(!M||M===P[this.TYPE])){R.push({type:P[this.TYPE],fn:P[this.FN],obj:P[this.OBJ],adjust:P[this.OVERRIDE],scope:P[this.ADJ_SCOPE],index:S});}}}}return(R.length)?R:null;},_unload:function(T){var N=YAHOO.util.Event,Q,P,O,S,R,U=J.slice(),M;for(Q=0,S=J.length;Q<S;++Q){O=U[Q];if(O){M=window;if(O[N.ADJ_SCOPE]){if(O[N.ADJ_SCOPE]===true){M=O[N.UNLOAD_OBJ];}else{M=O[N.ADJ_SCOPE];}}O[N.FN].call(M,N.getEvent(T,O[N.EL]),O[N.UNLOAD_OBJ]);U[Q]=null;}}O=null;M=null;J=null;if(I){for(P=I.length-1;P>-1;P--){O=I[P];if(O){N.removeListener(O[N.EL],O[N.TYPE],O[N.FN],P);}}O=null;}G=null;N._simpleRemove(window,"unload",N._unload);},_getScrollLeft:function(){return this._getScroll()[1];},_getScrollTop:function(){return this._getScroll()[0];},_getScroll:function(){var M=document.documentElement,N=document.body;if(M&&(M.scrollTop||M.scrollLeft)){return[M.scrollTop,M.scrollLeft];}else{if(N){return[N.scrollTop,N.scrollLeft];}else{return[0,0];}}},regCE:function(){},_simpleAdd:function(){if(window.addEventListener){return function(O,P,N,M){O.addEventListener(P,N,(M));};}else{if(window.attachEvent){return function(O,P,N,M){O.attachEvent("on"+P,N);};}else{return function(){};}}}(),_simpleRemove:function(){if(window.removeEventListener){return function(O,P,N,M){O.removeEventListener(P,N,(M));};}else{if(window.detachEvent){return function(N,O,M){N.detachEvent("on"+O,M);};}else{return function(){};}}}()};}();(function(){var EU=YAHOO.util.Event;EU.on=EU.addListener;EU.onFocus=EU.addFocusListener;EU.onBlur=EU.addBlurListener;
/* DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller */
if(EU.isIE){YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach,YAHOO.util.Event,true);var n=document.createElement("p");EU._dri=setInterval(function(){try{n.doScroll("left");clearInterval(EU._dri);EU._dri=null;EU._ready();n=null;}catch(ex){}},EU.POLL_INTERVAL);}else{if(EU.webkit&&EU.webkit<525){EU._dri=setInterval(function(){var rs=document.readyState;if("loaded"==rs||"complete"==rs){clearInterval(EU._dri);EU._dri=null;EU._ready();}},EU.POLL_INTERVAL);}else{EU._simpleAdd(document,"DOMContentLoaded",EU._ready);}}EU._simpleAdd(window,"load",EU._load);EU._simpleAdd(window,"unload",EU._unload);EU._tryPreloadAttach();})();}YAHOO.util.EventProvider=function(){};YAHOO.util.EventProvider.prototype={__yui_events:null,__yui_subscribers:null,subscribe:function(A,C,F,E){this.__yui_events=this.__yui_events||{};var D=this.__yui_events[A];if(D){D.subscribe(C,F,E);
}else{this.__yui_subscribers=this.__yui_subscribers||{};var B=this.__yui_subscribers;if(!B[A]){B[A]=[];}B[A].push({fn:C,obj:F,overrideContext:E});}},unsubscribe:function(C,E,G){this.__yui_events=this.__yui_events||{};var A=this.__yui_events;if(C){var F=A[C];if(F){return F.unsubscribe(E,G);}}else{var B=true;for(var D in A){if(YAHOO.lang.hasOwnProperty(A,D)){B=B&&A[D].unsubscribe(E,G);}}return B;}return false;},unsubscribeAll:function(A){return this.unsubscribe(A);},createEvent:function(G,D){this.__yui_events=this.__yui_events||{};var A=D||{};var I=this.__yui_events;if(I[G]){}else{var H=A.scope||this;var E=(A.silent);var B=new YAHOO.util.CustomEvent(G,H,E,YAHOO.util.CustomEvent.FLAT);I[G]=B;if(A.onSubscribeCallback){B.subscribeEvent.subscribe(A.onSubscribeCallback);}this.__yui_subscribers=this.__yui_subscribers||{};var F=this.__yui_subscribers[G];if(F){for(var C=0;C<F.length;++C){B.subscribe(F[C].fn,F[C].obj,F[C].overrideContext);}}}return I[G];},fireEvent:function(E,D,A,C){this.__yui_events=this.__yui_events||{};var G=this.__yui_events[E];if(!G){return null;}var B=[];for(var F=1;F<arguments.length;++F){B.push(arguments[F]);}return G.fire.apply(G,B);},hasEvent:function(A){if(this.__yui_events){if(this.__yui_events[A]){return true;}}return false;}};(function(){var A=YAHOO.util.Event,C=YAHOO.lang;YAHOO.util.KeyListener=function(D,I,E,F){if(!D){}else{if(!I){}else{if(!E){}}}if(!F){F=YAHOO.util.KeyListener.KEYDOWN;}var G=new YAHOO.util.CustomEvent("keyPressed");this.enabledEvent=new YAHOO.util.CustomEvent("enabled");this.disabledEvent=new YAHOO.util.CustomEvent("disabled");if(C.isString(D)){D=document.getElementById(D);}if(C.isFunction(E)){G.subscribe(E);}else{G.subscribe(E.fn,E.scope,E.correctScope);}function H(O,N){if(!I.shift){I.shift=false;}if(!I.alt){I.alt=false;}if(!I.ctrl){I.ctrl=false;}if(O.shiftKey==I.shift&&O.altKey==I.alt&&O.ctrlKey==I.ctrl){var J,M=I.keys,L;if(YAHOO.lang.isArray(M)){for(var K=0;K<M.length;K++){J=M[K];L=A.getCharCode(O);if(J==L){G.fire(L,O);break;}}}else{L=A.getCharCode(O);if(M==L){G.fire(L,O);}}}}this.enable=function(){if(!this.enabled){A.on(D,F,H);this.enabledEvent.fire(I);}this.enabled=true;};this.disable=function(){if(this.enabled){A.removeListener(D,F,H);this.disabledEvent.fire(I);}this.enabled=false;};this.toString=function(){return"KeyListener ["+I.keys+"] "+D.tagName+(D.id?"["+D.id+"]":"");};};var B=YAHOO.util.KeyListener;B.KEYDOWN="keydown";B.KEYUP="keyup";B.KEY={ALT:18,BACK_SPACE:8,CAPS_LOCK:20,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,META:224,NUM_LOCK:144,PAGE_DOWN:34,PAGE_UP:33,PAUSE:19,PRINTSCREEN:44,RIGHT:39,SCROLL_LOCK:145,SHIFT:16,SPACE:32,TAB:9,UP:38};})();YAHOO.register("event",YAHOO.util.Event,{version:"2.7.0",build:"1799"});YAHOO.register("yahoo-dom-event", YAHOO, {version: "2.7.0", build: "1799"});

/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){YAHOO.env._id_counter=YAHOO.env._id_counter||0;var E=YAHOO.util,L=YAHOO.lang,m=YAHOO.env.ua,A=YAHOO.lang.trim,d={},h={},N=/^t(?:able|d|h)$/i,X=/color$/i,K=window.document,W=K.documentElement,e="ownerDocument",n="defaultView",v="documentElement",t="compatMode",b="offsetLeft",P="offsetTop",u="offsetParent",Z="parentNode",l="nodeType",C="tagName",O="scrollLeft",i="scrollTop",Q="getBoundingClientRect",w="getComputedStyle",a="currentStyle",M="CSS1Compat",c="BackCompat",g="class",F="className",J="",B=" ",s="(?:^|\\s)",k="(?= |$)",U="g",p="position",f="fixed",V="relative",j="left",o="top",r="medium",q="borderLeftWidth",R="borderTopWidth",D=m.opera,I=m.webkit,H=m.gecko,T=m.ie;E.Dom={CUSTOM_ATTRIBUTES:(!W.hasAttribute)?{"for":"htmlFor","class":F}:{"htmlFor":"for","className":g},get:function(y){var AA,Y,z,x,G;if(y){if(y[l]||y.item){return y;}if(typeof y==="string"){AA=y;y=K.getElementById(y);if(y&&y.id===AA){return y;}else{if(y&&K.all){y=null;Y=K.all[AA];for(x=0,G=Y.length;x<G;++x){if(Y[x].id===AA){return Y[x];}}}}return y;}if(y.DOM_EVENTS){y=y.get("element");}if("length" in y){z=[];for(x=0,G=y.length;x<G;++x){z[z.length]=E.Dom.get(y[x]);}return z;}return y;}return null;},getComputedStyle:function(G,Y){if(window[w]){return G[e][n][w](G,null)[Y];}else{if(G[a]){return E.Dom.IE_ComputedStyle.get(G,Y);}}},getStyle:function(G,Y){return E.Dom.batch(G,E.Dom._getStyle,Y);},_getStyle:function(){if(window[w]){return function(G,y){y=(y==="float")?y="cssFloat":E.Dom._toCamel(y);var x=G.style[y],Y;if(!x){Y=G[e][n][w](G,null);if(Y){x=Y[y];}}return x;};}else{if(W[a]){return function(G,y){var x;switch(y){case"opacity":x=100;try{x=G.filters["DXImageTransform.Microsoft.Alpha"].opacity;}catch(z){try{x=G.filters("alpha").opacity;}catch(Y){}}return x/100;case"float":y="styleFloat";default:y=E.Dom._toCamel(y);x=G[a]?G[a][y]:null;return(G.style[y]||x);}};}}}(),setStyle:function(G,Y,x){E.Dom.batch(G,E.Dom._setStyle,{prop:Y,val:x});},_setStyle:function(){if(T){return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){switch(x){case"opacity":if(L.isString(Y.style.filter)){Y.style.filter="alpha(opacity="+y*100+")";if(!Y[a]||!Y[a].hasLayout){Y.style.zoom=1;}}break;case"float":x="styleFloat";default:Y.style[x]=y;}}else{}};}else{return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){if(x=="float"){x="cssFloat";}Y.style[x]=y;}else{}};}}(),getXY:function(G){return E.Dom.batch(G,E.Dom._getXY);},_canPosition:function(G){return(E.Dom._getStyle(G,"display")!=="none"&&E.Dom._inDoc(G));},_getXY:function(){if(K[v][Q]){return function(y){var z,Y,AA,AF,AE,AD,AC,G,x,AB=Math.floor,AG=false;if(E.Dom._canPosition(y)){AA=y[Q]();AF=y[e];z=E.Dom.getDocumentScrollLeft(AF);Y=E.Dom.getDocumentScrollTop(AF);AG=[AB(AA[j]),AB(AA[o])];if(T&&m.ie<8){AE=2;AD=2;AC=AF[t];G=S(AF[v],q);x=S(AF[v],R);if(m.ie===6){if(AC!==c){AE=0;AD=0;}}if((AC==c)){if(G!==r){AE=parseInt(G,10);}if(x!==r){AD=parseInt(x,10);}}AG[0]-=AE;AG[1]-=AD;}if((Y||z)){AG[0]+=z;AG[1]+=Y;}AG[0]=AB(AG[0]);AG[1]=AB(AG[1]);}else{}return AG;};}else{return function(y){var x,Y,AA,AB,AC,z=false,G=y;if(E.Dom._canPosition(y)){z=[y[b],y[P]];x=E.Dom.getDocumentScrollLeft(y[e]);Y=E.Dom.getDocumentScrollTop(y[e]);AC=((H||m.webkit>519)?true:false);while((G=G[u])){z[0]+=G[b];z[1]+=G[P];if(AC){z=E.Dom._calcBorders(G,z);}}if(E.Dom._getStyle(y,p)!==f){G=y;while((G=G[Z])&&G[C]){AA=G[i];AB=G[O];if(H&&(E.Dom._getStyle(G,"overflow")!=="visible")){z=E.Dom._calcBorders(G,z);}if(AA||AB){z[0]-=AB;z[1]-=AA;}}z[0]+=x;z[1]+=Y;}else{if(D){z[0]-=x;z[1]-=Y;}else{if(I||H){z[0]+=x;z[1]+=Y;}}}z[0]=Math.floor(z[0]);z[1]=Math.floor(z[1]);}else{}return z;};}}(),getX:function(G){var Y=function(x){return E.Dom.getXY(x)[0];};return E.Dom.batch(G,Y,E.Dom,true);},getY:function(G){var Y=function(x){return E.Dom.getXY(x)[1];};return E.Dom.batch(G,Y,E.Dom,true);},setXY:function(G,x,Y){E.Dom.batch(G,E.Dom._setXY,{pos:x,noRetry:Y});},_setXY:function(G,z){var AA=E.Dom._getStyle(G,p),y=E.Dom.setStyle,AD=z.pos,Y=z.noRetry,AB=[parseInt(E.Dom.getComputedStyle(G,j),10),parseInt(E.Dom.getComputedStyle(G,o),10)],AC,x;if(AA=="static"){AA=V;y(G,p,AA);}AC=E.Dom._getXY(G);if(!AD||AC===false){return false;}if(isNaN(AB[0])){AB[0]=(AA==V)?0:G[b];}if(isNaN(AB[1])){AB[1]=(AA==V)?0:G[P];}if(AD[0]!==null){y(G,j,AD[0]-AC[0]+AB[0]+"px");}if(AD[1]!==null){y(G,o,AD[1]-AC[1]+AB[1]+"px");}if(!Y){x=E.Dom._getXY(G);if((AD[0]!==null&&x[0]!=AD[0])||(AD[1]!==null&&x[1]!=AD[1])){E.Dom._setXY(G,{pos:AD,noRetry:true});}}},setX:function(Y,G){E.Dom.setXY(Y,[G,null]);},setY:function(G,Y){E.Dom.setXY(G,[null,Y]);},getRegion:function(G){var Y=function(x){var y=false;if(E.Dom._canPosition(x)){y=E.Region.getRegion(x);}else{}return y;};return E.Dom.batch(G,Y,E.Dom,true);},getClientWidth:function(){return E.Dom.getViewportWidth();},getClientHeight:function(){return E.Dom.getViewportHeight();},getElementsByClassName:function(AB,AF,AC,AE,x,AD){AB=L.trim(AB);AF=AF||"*";AC=(AC)?E.Dom.get(AC):null||K;if(!AC){return[];}var Y=[],G=AC.getElementsByTagName(AF),z=E.Dom.hasClass;for(var y=0,AA=G.length;y<AA;++y){if(z(G[y],AB)){Y[Y.length]=G[y];}}if(AE){E.Dom.batch(Y,AE,x,AD);}return Y;},hasClass:function(Y,G){return E.Dom.batch(Y,E.Dom._hasClass,G);},_hasClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom.getAttribute(x,F)||J;if(Y.exec){G=Y.test(y);}else{G=Y&&(B+y+B).indexOf(B+Y+B)>-1;}}else{}return G;},addClass:function(Y,G){return E.Dom.batch(Y,E.Dom._addClass,G);},_addClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom.getAttribute(x,F)||J;if(!E.Dom._hasClass(x,Y)){E.Dom.setAttribute(x,F,A(y+B+Y));G=true;}}else{}return G;},removeClass:function(Y,G){return E.Dom.batch(Y,E.Dom._removeClass,G);},_removeClass:function(y,x){var Y=false,AA,z,G;if(y&&x){AA=E.Dom.getAttribute(y,F)||J;E.Dom.setAttribute(y,F,AA.replace(E.Dom._getClassRegex(x),J));z=E.Dom.getAttribute(y,F);if(AA!==z){E.Dom.setAttribute(y,F,A(z));Y=true;if(E.Dom.getAttribute(y,F)===""){G=(y.hasAttribute&&y.hasAttribute(g))?g:F;y.removeAttribute(G);}}}else{}return Y;},replaceClass:function(x,Y,G){return E.Dom.batch(x,E.Dom._replaceClass,{from:Y,to:G});
},_replaceClass:function(y,x){var Y,AB,AA,G=false,z;if(y&&x){AB=x.from;AA=x.to;if(!AA){G=false;}else{if(!AB){G=E.Dom._addClass(y,x.to);}else{if(AB!==AA){z=E.Dom.getAttribute(y,F)||J;Y=(B+z.replace(E.Dom._getClassRegex(AB),B+AA)).split(E.Dom._getClassRegex(AA));Y.splice(1,0,B+AA);E.Dom.setAttribute(y,F,A(Y.join(J)));G=true;}}}}else{}return G;},generateId:function(G,x){x=x||"yui-gen";var Y=function(y){if(y&&y.id){return y.id;}var z=x+YAHOO.env._id_counter++;if(y){if(y[e].getElementById(z)){return E.Dom.generateId(y,z+x);}y.id=z;}return z;};return E.Dom.batch(G,Y,E.Dom,true)||Y.apply(E.Dom,arguments);},isAncestor:function(Y,x){Y=E.Dom.get(Y);x=E.Dom.get(x);var G=false;if((Y&&x)&&(Y[l]&&x[l])){if(Y.contains&&Y!==x){G=Y.contains(x);}else{if(Y.compareDocumentPosition){G=!!(Y.compareDocumentPosition(x)&16);}}}else{}return G;},inDocument:function(G,Y){return E.Dom._inDoc(E.Dom.get(G),Y);},_inDoc:function(Y,x){var G=false;if(Y&&Y[C]){x=x||Y[e];G=E.Dom.isAncestor(x[v],Y);}else{}return G;},getElementsBy:function(Y,AF,AB,AD,y,AC,AE){AF=AF||"*";AB=(AB)?E.Dom.get(AB):null||K;if(!AB){return[];}var x=[],G=AB.getElementsByTagName(AF);for(var z=0,AA=G.length;z<AA;++z){if(Y(G[z])){if(AE){x=G[z];break;}else{x[x.length]=G[z];}}}if(AD){E.Dom.batch(x,AD,y,AC);}return x;},getElementBy:function(x,G,Y){return E.Dom.getElementsBy(x,G,Y,null,null,null,true);},batch:function(x,AB,AA,z){var y=[],Y=(z)?AA:window;x=(x&&(x[C]||x.item))?x:E.Dom.get(x);if(x&&AB){if(x[C]||x.length===undefined){return AB.call(Y,x,AA);}for(var G=0;G<x.length;++G){y[y.length]=AB.call(Y,x[G],AA);}}else{return false;}return y;},getDocumentHeight:function(){var Y=(K[t]!=M||I)?K.body.scrollHeight:W.scrollHeight,G=Math.max(Y,E.Dom.getViewportHeight());return G;},getDocumentWidth:function(){var Y=(K[t]!=M||I)?K.body.scrollWidth:W.scrollWidth,G=Math.max(Y,E.Dom.getViewportWidth());return G;},getViewportHeight:function(){var G=self.innerHeight,Y=K[t];if((Y||T)&&!D){G=(Y==M)?W.clientHeight:K.body.clientHeight;}return G;},getViewportWidth:function(){var G=self.innerWidth,Y=K[t];if(Y||T){G=(Y==M)?W.clientWidth:K.body.clientWidth;}return G;},getAncestorBy:function(G,Y){while((G=G[Z])){if(E.Dom._testElement(G,Y)){return G;}}return null;},getAncestorByClassName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return E.Dom.hasClass(y,G);};return E.Dom.getAncestorBy(Y,x);},getAncestorByTagName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return y[C]&&y[C].toUpperCase()==G.toUpperCase();};return E.Dom.getAncestorBy(Y,x);},getPreviousSiblingBy:function(G,Y){while(G){G=G.previousSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getPreviousSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getPreviousSiblingBy(G);},getNextSiblingBy:function(G,Y){while(G){G=G.nextSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getNextSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getNextSiblingBy(G);},getFirstChildBy:function(G,x){var Y=(E.Dom._testElement(G.firstChild,x))?G.firstChild:null;return Y||E.Dom.getNextSiblingBy(G.firstChild,x);},getFirstChild:function(G,Y){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getFirstChildBy(G);},getLastChildBy:function(G,x){if(!G){return null;}var Y=(E.Dom._testElement(G.lastChild,x))?G.lastChild:null;return Y||E.Dom.getPreviousSiblingBy(G.lastChild,x);},getLastChild:function(G){G=E.Dom.get(G);return E.Dom.getLastChildBy(G);},getChildrenBy:function(Y,y){var x=E.Dom.getFirstChildBy(Y,y),G=x?[x]:[];E.Dom.getNextSiblingBy(x,function(z){if(!y||y(z)){G[G.length]=z;}return false;});return G;},getChildren:function(G){G=E.Dom.get(G);if(!G){}return E.Dom.getChildrenBy(G);},getDocumentScrollLeft:function(G){G=G||K;return Math.max(G[v].scrollLeft,G.body.scrollLeft);},getDocumentScrollTop:function(G){G=G||K;return Math.max(G[v].scrollTop,G.body.scrollTop);},insertBefore:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}return G[Z].insertBefore(Y,G);},insertAfter:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}if(G.nextSibling){return G[Z].insertBefore(Y,G.nextSibling);}else{return G[Z].appendChild(Y);}},getClientRegion:function(){var x=E.Dom.getDocumentScrollTop(),Y=E.Dom.getDocumentScrollLeft(),y=E.Dom.getViewportWidth()+Y,G=E.Dom.getViewportHeight()+x;return new E.Region(x,y,G,Y);},setAttribute:function(Y,G,x){G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;Y.setAttribute(G,x);},getAttribute:function(Y,G){G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;return Y.getAttribute(G);},_toCamel:function(Y){var x=d;function G(y,z){return z.toUpperCase();}return x[Y]||(x[Y]=Y.indexOf("-")===-1?Y:Y.replace(/-([a-z])/gi,G));},_getClassRegex:function(Y){var G;if(Y!==undefined){if(Y.exec){G=Y;}else{G=h[Y];if(!G){Y=Y.replace(E.Dom._patterns.CLASS_RE_TOKENS,"\\$1");G=h[Y]=new RegExp(s+Y+k,U);}}}return G;},_patterns:{ROOT_TAG:/^body|html$/i,CLASS_RE_TOKENS:/([\.\(\)\^\$\*\+\?\|\[\]\{\}])/g},_testElement:function(G,Y){return G&&G[l]==1&&(!Y||Y(G));},_calcBorders:function(x,y){var Y=parseInt(E.Dom[w](x,R),10)||0,G=parseInt(E.Dom[w](x,q),10)||0;if(H){if(N.test(x[C])){Y=0;G=0;}}y[0]+=G;y[1]+=Y;return y;}};var S=E.Dom[w];if(m.opera){E.Dom[w]=function(Y,G){var x=S(Y,G);if(X.test(G)){x=E.Dom.Color.toRGB(x);}return x;};}if(m.webkit){E.Dom[w]=function(Y,G){var x=S(Y,G);if(x==="rgba(0, 0, 0, 0)"){x="transparent";}return x;};}})();YAHOO.util.Region=function(C,D,A,B){this.top=C;this.y=C;this[1]=C;this.right=D;this.bottom=A;this.left=B;this.x=B;this[0]=B;this.width=this.right-this.left;this.height=this.bottom-this.top;};YAHOO.util.Region.prototype.contains=function(A){return(A.left>=this.left&&A.right<=this.right&&A.top>=this.top&&A.bottom<=this.bottom);};YAHOO.util.Region.prototype.getArea=function(){return((this.bottom-this.top)*(this.right-this.left));};YAHOO.util.Region.prototype.intersect=function(E){var C=Math.max(this.top,E.top),D=Math.min(this.right,E.right),A=Math.min(this.bottom,E.bottom),B=Math.max(this.left,E.left);if(A>=C&&D>=B){return new YAHOO.util.Region(C,D,A,B);
}else{return null;}};YAHOO.util.Region.prototype.union=function(E){var C=Math.min(this.top,E.top),D=Math.max(this.right,E.right),A=Math.max(this.bottom,E.bottom),B=Math.min(this.left,E.left);return new YAHOO.util.Region(C,D,A,B);};YAHOO.util.Region.prototype.toString=function(){return("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+", height: "+this.height+", width: "+this.width+"}");};YAHOO.util.Region.getRegion=function(D){var F=YAHOO.util.Dom.getXY(D),C=F[1],E=F[0]+D.offsetWidth,A=F[1]+D.offsetHeight,B=F[0];return new YAHOO.util.Region(C,E,A,B);};YAHOO.util.Point=function(A,B){if(YAHOO.lang.isArray(A)){B=A[1];A=A[0];}YAHOO.util.Point.superclass.constructor.call(this,B,A,B,A);};YAHOO.extend(YAHOO.util.Point,YAHOO.util.Region);(function(){var B=YAHOO.util,A="clientTop",F="clientLeft",J="parentNode",K="right",W="hasLayout",I="px",U="opacity",L="auto",D="borderLeftWidth",G="borderTopWidth",P="borderRightWidth",V="borderBottomWidth",S="visible",Q="transparent",N="height",E="width",H="style",T="currentStyle",R=/^width|height$/,O=/^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,M={get:function(X,Z){var Y="",a=X[T][Z];if(Z===U){Y=B.Dom.getStyle(X,U);}else{if(!a||(a.indexOf&&a.indexOf(I)>-1)){Y=a;}else{if(B.Dom.IE_COMPUTED[Z]){Y=B.Dom.IE_COMPUTED[Z](X,Z);}else{if(O.test(a)){Y=B.Dom.IE.ComputedStyle.getPixel(X,Z);}else{Y=a;}}}}return Y;},getOffset:function(Z,e){var b=Z[T][e],X=e.charAt(0).toUpperCase()+e.substr(1),c="offset"+X,Y="pixel"+X,a="",d;if(b==L){d=Z[c];if(d===undefined){a=0;}a=d;if(R.test(e)){Z[H][e]=d;if(Z[c]>d){a=d-(Z[c]-d);}Z[H][e]=L;}}else{if(!Z[H][Y]&&!Z[H][e]){Z[H][e]=b;}a=Z[H][Y];}return a+I;},getBorderWidth:function(X,Z){var Y=null;if(!X[T][W]){X[H].zoom=1;}switch(Z){case G:Y=X[A];break;case V:Y=X.offsetHeight-X.clientHeight-X[A];break;case D:Y=X[F];break;case P:Y=X.offsetWidth-X.clientWidth-X[F];break;}return Y+I;},getPixel:function(Y,X){var a=null,b=Y[T][K],Z=Y[T][X];Y[H][K]=Z;a=Y[H].pixelRight;Y[H][K]=b;return a+I;},getMargin:function(Y,X){var Z;if(Y[T][X]==L){Z=0+I;}else{Z=B.Dom.IE.ComputedStyle.getPixel(Y,X);}return Z;},getVisibility:function(Y,X){var Z;while((Z=Y[T])&&Z[X]=="inherit"){Y=Y[J];}return(Z)?Z[X]:S;},getColor:function(Y,X){return B.Dom.Color.toRGB(Y[T][X])||Q;},getBorderColor:function(Y,X){var Z=Y[T],a=Z[X]||Z.color;return B.Dom.Color.toRGB(B.Dom.Color.toHex(a));}},C={};C.top=C.right=C.bottom=C.left=C[E]=C[N]=M.getOffset;C.color=M.getColor;C[G]=C[P]=C[V]=C[D]=M.getBorderWidth;C.marginTop=C.marginRight=C.marginBottom=C.marginLeft=M.getMargin;C.visibility=M.getVisibility;C.borderColor=C.borderTopColor=C.borderRightColor=C.borderBottomColor=C.borderLeftColor=M.getBorderColor;B.Dom.IE_COMPUTED=C;B.Dom.IE_ComputedStyle=M;})();(function(){var C="toString",A=parseInt,B=RegExp,D=YAHOO.util;D.Dom.Color={KEYWORDS:{black:"000",silver:"c0c0c0",gray:"808080",white:"fff",maroon:"800000",red:"f00",purple:"800080",fuchsia:"f0f",green:"008000",lime:"0f0",olive:"808000",yellow:"ff0",navy:"000080",blue:"00f",teal:"008080",aqua:"0ff"},re_RGB:/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,re_hex:/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,re_hex3:/([0-9A-F])/gi,toRGB:function(E){if(!D.Dom.Color.re_RGB.test(E)){E=D.Dom.Color.toHex(E);}if(D.Dom.Color.re_hex.exec(E)){E="rgb("+[A(B.$1,16),A(B.$2,16),A(B.$3,16)].join(", ")+")";}return E;},toHex:function(H){H=D.Dom.Color.KEYWORDS[H]||H;if(D.Dom.Color.re_RGB.exec(H)){var G=(B.$1.length===1)?"0"+B.$1:Number(B.$1),F=(B.$2.length===1)?"0"+B.$2:Number(B.$2),E=(B.$3.length===1)?"0"+B.$3:Number(B.$3);H=[G[C](16),F[C](16),E[C](16)].join("");}if(H.length<6){H=H.replace(D.Dom.Color.re_hex3,"$1$1");}if(H!=="transparent"&&H.indexOf("#")<0){H="#"+H;}return H.toLowerCase();}};}());YAHOO.register("dom",YAHOO.util.Dom,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){YAHOO.util.Config=function(D){if(D){this.init(D);}};var B=YAHOO.lang,C=YAHOO.util.CustomEvent,A=YAHOO.util.Config;A.CONFIG_CHANGED_EVENT="configChanged";A.BOOLEAN_TYPE="boolean";A.prototype={owner:null,queueInProgress:false,config:null,initialConfig:null,eventQueue:null,configChangedEvent:null,init:function(D){this.owner=D;this.configChangedEvent=this.createEvent(A.CONFIG_CHANGED_EVENT);this.configChangedEvent.signature=C.LIST;this.queueInProgress=false;this.config={};this.initialConfig={};this.eventQueue=[];},checkBoolean:function(D){return(typeof D==A.BOOLEAN_TYPE);},checkNumber:function(D){return(!isNaN(D));},fireEvent:function(D,F){var E=this.config[D];if(E&&E.event){E.event.fire(F);}},addProperty:function(E,D){E=E.toLowerCase();this.config[E]=D;D.event=this.createEvent(E,{scope:this.owner});D.event.signature=C.LIST;D.key=E;if(D.handler){D.event.subscribe(D.handler,this.owner);}this.setProperty(E,D.value,true);if(!D.suppressEvent){this.queueProperty(E,D.value);}},getConfig:function(){var D={},F=this.config,G,E;for(G in F){if(B.hasOwnProperty(F,G)){E=F[G];if(E&&E.event){D[G]=E.value;}}}return D;},getProperty:function(D){var E=this.config[D.toLowerCase()];if(E&&E.event){return E.value;}else{return undefined;}},resetProperty:function(D){D=D.toLowerCase();var E=this.config[D];if(E&&E.event){if(this.initialConfig[D]&&!B.isUndefined(this.initialConfig[D])){this.setProperty(D,this.initialConfig[D]);return true;}}else{return false;}},setProperty:function(E,G,D){var F;E=E.toLowerCase();if(this.queueInProgress&&!D){this.queueProperty(E,G);return true;}else{F=this.config[E];if(F&&F.event){if(F.validator&&!F.validator(G)){return false;}else{F.value=G;if(!D){this.fireEvent(E,G);this.configChangedEvent.fire([E,G]);}return true;}}else{return false;}}},queueProperty:function(S,P){S=S.toLowerCase();var R=this.config[S],K=false,J,G,H,I,O,Q,F,M,N,D,L,T,E;if(R&&R.event){if(!B.isUndefined(P)&&R.validator&&!R.validator(P)){return false;}else{if(!B.isUndefined(P)){R.value=P;}else{P=R.value;}K=false;J=this.eventQueue.length;for(L=0;L<J;L++){G=this.eventQueue[L];if(G){H=G[0];I=G[1];if(H==S){this.eventQueue[L]=null;this.eventQueue.push([S,(!B.isUndefined(P)?P:I)]);K=true;break;}}}if(!K&&!B.isUndefined(P)){this.eventQueue.push([S,P]);}}if(R.supercedes){O=R.supercedes.length;for(T=0;T<O;T++){Q=R.supercedes[T];F=this.eventQueue.length;for(E=0;E<F;E++){M=this.eventQueue[E];if(M){N=M[0];D=M[1];if(N==Q.toLowerCase()){this.eventQueue.push([N,D]);this.eventQueue[E]=null;break;}}}}}return true;}else{return false;}},refireEvent:function(D){D=D.toLowerCase();var E=this.config[D];if(E&&E.event&&!B.isUndefined(E.value)){if(this.queueInProgress){this.queueProperty(D);}else{this.fireEvent(D,E.value);}}},applyConfig:function(D,G){var F,E;if(G){E={};for(F in D){if(B.hasOwnProperty(D,F)){E[F.toLowerCase()]=D[F];}}this.initialConfig=E;}for(F in D){if(B.hasOwnProperty(D,F)){this.queueProperty(F,D[F]);}}},refresh:function(){var D;for(D in this.config){if(B.hasOwnProperty(this.config,D)){this.refireEvent(D);}}},fireQueue:function(){var E,H,D,G,F;this.queueInProgress=true;for(E=0;E<this.eventQueue.length;E++){H=this.eventQueue[E];if(H){D=H[0];G=H[1];F=this.config[D];F.value=G;this.eventQueue[E]=null;this.fireEvent(D,G);}}this.queueInProgress=false;this.eventQueue=[];},subscribeToConfigEvent:function(E,F,H,D){var G=this.config[E.toLowerCase()];if(G&&G.event){if(!A.alreadySubscribed(G.event,F,H)){G.event.subscribe(F,H,D);}return true;}else{return false;}},unsubscribeFromConfigEvent:function(D,E,G){var F=this.config[D.toLowerCase()];if(F&&F.event){return F.event.unsubscribe(E,G);}else{return false;}},toString:function(){var D="Config";if(this.owner){D+=" ["+this.owner.toString()+"]";}return D;},outputEventQueue:function(){var D="",G,E,F=this.eventQueue.length;for(E=0;E<F;E++){G=this.eventQueue[E];if(G){D+=G[0]+"="+G[1]+", ";}}return D;},destroy:function(){var E=this.config,D,F;for(D in E){if(B.hasOwnProperty(E,D)){F=E[D];F.event.unsubscribeAll();F.event=null;}}this.configChangedEvent.unsubscribeAll();this.configChangedEvent=null;this.owner=null;this.config=null;this.initialConfig=null;this.eventQueue=null;}};A.alreadySubscribed=function(E,H,I){var F=E.subscribers.length,D,G;if(F>0){G=F-1;do{D=E.subscribers[G];if(D&&D.obj==I&&D.fn==H){return true;}}while(G--);}return false;};YAHOO.lang.augmentProto(A,YAHOO.util.EventProvider);}());(function(){YAHOO.widget.Module=function(R,Q){if(R){this.init(R,Q);}else{}};var F=YAHOO.util.Dom,D=YAHOO.util.Config,N=YAHOO.util.Event,M=YAHOO.util.CustomEvent,G=YAHOO.widget.Module,I=YAHOO.env.ua,H,P,O,E,A={"BEFORE_INIT":"beforeInit","INIT":"init","APPEND":"append","BEFORE_RENDER":"beforeRender","RENDER":"render","CHANGE_HEADER":"changeHeader","CHANGE_BODY":"changeBody","CHANGE_FOOTER":"changeFooter","CHANGE_CONTENT":"changeContent","DESTORY":"destroy","BEFORE_SHOW":"beforeShow","SHOW":"show","BEFORE_HIDE":"beforeHide","HIDE":"hide"},J={"VISIBLE":{key:"visible",value:true,validator:YAHOO.lang.isBoolean},"EFFECT":{key:"effect",suppressEvent:true,supercedes:["visible"]},"MONITOR_RESIZE":{key:"monitorresize",value:true},"APPEND_TO_DOCUMENT_BODY":{key:"appendtodocumentbody",value:false}};G.IMG_ROOT=null;G.IMG_ROOT_SSL=null;G.CSS_MODULE="yui-module";G.CSS_HEADER="hd";G.CSS_BODY="bd";G.CSS_FOOTER="ft";G.RESIZE_MONITOR_SECURE_URL="javascript:false;";G.RESIZE_MONITOR_BUFFER=1;G.textResizeEvent=new M("textResize");G.forceDocumentRedraw=function(){var Q=document.documentElement;if(Q){Q.className+=" ";Q.className=YAHOO.lang.trim(Q.className);}};function L(){if(!H){H=document.createElement("div");H.innerHTML=('<div class="'+G.CSS_HEADER+'"></div>'+'<div class="'+G.CSS_BODY+'"></div><div class="'+G.CSS_FOOTER+'"></div>');P=H.firstChild;O=P.nextSibling;E=O.nextSibling;}return H;}function K(){if(!P){L();}return(P.cloneNode(false));}function B(){if(!O){L();}return(O.cloneNode(false));}function C(){if(!E){L();}return(E.cloneNode(false));}G.prototype={constructor:G,element:null,header:null,body:null,footer:null,id:null,imageRoot:G.IMG_ROOT,initEvents:function(){var Q=M.LIST;
this.beforeInitEvent=this.createEvent(A.BEFORE_INIT);this.beforeInitEvent.signature=Q;this.initEvent=this.createEvent(A.INIT);this.initEvent.signature=Q;this.appendEvent=this.createEvent(A.APPEND);this.appendEvent.signature=Q;this.beforeRenderEvent=this.createEvent(A.BEFORE_RENDER);this.beforeRenderEvent.signature=Q;this.renderEvent=this.createEvent(A.RENDER);this.renderEvent.signature=Q;this.changeHeaderEvent=this.createEvent(A.CHANGE_HEADER);this.changeHeaderEvent.signature=Q;this.changeBodyEvent=this.createEvent(A.CHANGE_BODY);this.changeBodyEvent.signature=Q;this.changeFooterEvent=this.createEvent(A.CHANGE_FOOTER);this.changeFooterEvent.signature=Q;this.changeContentEvent=this.createEvent(A.CHANGE_CONTENT);this.changeContentEvent.signature=Q;this.destroyEvent=this.createEvent(A.DESTORY);this.destroyEvent.signature=Q;this.beforeShowEvent=this.createEvent(A.BEFORE_SHOW);this.beforeShowEvent.signature=Q;this.showEvent=this.createEvent(A.SHOW);this.showEvent.signature=Q;this.beforeHideEvent=this.createEvent(A.BEFORE_HIDE);this.beforeHideEvent.signature=Q;this.hideEvent=this.createEvent(A.HIDE);this.hideEvent.signature=Q;},platform:function(){var Q=navigator.userAgent.toLowerCase();if(Q.indexOf("windows")!=-1||Q.indexOf("win32")!=-1){return"windows";}else{if(Q.indexOf("macintosh")!=-1){return"mac";}else{return false;}}}(),browser:function(){var Q=navigator.userAgent.toLowerCase();if(Q.indexOf("opera")!=-1){return"opera";}else{if(Q.indexOf("msie 7")!=-1){return"ie7";}else{if(Q.indexOf("msie")!=-1){return"ie";}else{if(Q.indexOf("safari")!=-1){return"safari";}else{if(Q.indexOf("gecko")!=-1){return"gecko";}else{return false;}}}}}}(),isSecure:function(){if(window.location.href.toLowerCase().indexOf("https")===0){return true;}else{return false;}}(),initDefaultConfig:function(){this.cfg.addProperty(J.VISIBLE.key,{handler:this.configVisible,value:J.VISIBLE.value,validator:J.VISIBLE.validator});this.cfg.addProperty(J.EFFECT.key,{suppressEvent:J.EFFECT.suppressEvent,supercedes:J.EFFECT.supercedes});this.cfg.addProperty(J.MONITOR_RESIZE.key,{handler:this.configMonitorResize,value:J.MONITOR_RESIZE.value});this.cfg.addProperty(J.APPEND_TO_DOCUMENT_BODY.key,{value:J.APPEND_TO_DOCUMENT_BODY.value});},init:function(V,U){var S,W;this.initEvents();this.beforeInitEvent.fire(G);this.cfg=new D(this);if(this.isSecure){this.imageRoot=G.IMG_ROOT_SSL;}if(typeof V=="string"){S=V;V=document.getElementById(V);if(!V){V=(L()).cloneNode(false);V.id=S;}}this.id=F.generateId(V);this.element=V;W=this.element.firstChild;if(W){var R=false,Q=false,T=false;do{if(1==W.nodeType){if(!R&&F.hasClass(W,G.CSS_HEADER)){this.header=W;R=true;}else{if(!Q&&F.hasClass(W,G.CSS_BODY)){this.body=W;Q=true;}else{if(!T&&F.hasClass(W,G.CSS_FOOTER)){this.footer=W;T=true;}}}}}while((W=W.nextSibling));}this.initDefaultConfig();F.addClass(this.element,G.CSS_MODULE);if(U){this.cfg.applyConfig(U,true);}if(!D.alreadySubscribed(this.renderEvent,this.cfg.fireQueue,this.cfg)){this.renderEvent.subscribe(this.cfg.fireQueue,this.cfg,true);}this.initEvent.fire(G);},initResizeMonitor:function(){var R=(I.gecko&&this.platform=="windows");if(R){var Q=this;setTimeout(function(){Q._initResizeMonitor();},0);}else{this._initResizeMonitor();}},_initResizeMonitor:function(){var Q,S,U;function W(){G.textResizeEvent.fire();}if(!I.opera){S=F.get("_yuiResizeMonitor");var V=this._supportsCWResize();if(!S){S=document.createElement("iframe");if(this.isSecure&&G.RESIZE_MONITOR_SECURE_URL&&I.ie){S.src=G.RESIZE_MONITOR_SECURE_URL;}if(!V){U=["<html><head><script ",'type="text/javascript">',"window.onresize=function(){window.parent.","YAHOO.widget.Module.textResizeEvent.","fire();};<","/script></head>","<body></body></html>"].join("");S.src="data:text/html;charset=utf-8,"+encodeURIComponent(U);}S.id="_yuiResizeMonitor";S.title="Text Resize Monitor";S.style.position="absolute";S.style.visibility="hidden";var R=document.body,T=R.firstChild;if(T){R.insertBefore(S,T);}else{R.appendChild(S);}S.style.width="2em";S.style.height="2em";S.style.top=(-1*(S.offsetHeight+G.RESIZE_MONITOR_BUFFER))+"px";S.style.left="0";S.style.borderWidth="0";S.style.visibility="visible";if(I.webkit){Q=S.contentWindow.document;Q.open();Q.close();}}if(S&&S.contentWindow){G.textResizeEvent.subscribe(this.onDomResize,this,true);if(!G.textResizeInitialized){if(V){if(!N.on(S.contentWindow,"resize",W)){N.on(S,"resize",W);}}G.textResizeInitialized=true;}this.resizeMonitor=S;}}},_supportsCWResize:function(){var Q=true;if(I.gecko&&I.gecko<=1.8){Q=false;}return Q;},onDomResize:function(S,R){var Q=-1*(this.resizeMonitor.offsetHeight+G.RESIZE_MONITOR_BUFFER);this.resizeMonitor.style.top=Q+"px";this.resizeMonitor.style.left="0";},setHeader:function(R){var Q=this.header||(this.header=K());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeHeaderEvent.fire(R);this.changeContentEvent.fire();},appendToHeader:function(R){var Q=this.header||(this.header=K());Q.appendChild(R);this.changeHeaderEvent.fire(R);this.changeContentEvent.fire();},setBody:function(R){var Q=this.body||(this.body=B());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeBodyEvent.fire(R);this.changeContentEvent.fire();},appendToBody:function(R){var Q=this.body||(this.body=B());Q.appendChild(R);this.changeBodyEvent.fire(R);this.changeContentEvent.fire();},setFooter:function(R){var Q=this.footer||(this.footer=C());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeFooterEvent.fire(R);this.changeContentEvent.fire();},appendToFooter:function(R){var Q=this.footer||(this.footer=C());Q.appendChild(R);this.changeFooterEvent.fire(R);this.changeContentEvent.fire();},render:function(S,Q){var T=this,U;function R(V){if(typeof V=="string"){V=document.getElementById(V);}if(V){T._addToParent(V,T.element);T.appendEvent.fire();}}this.beforeRenderEvent.fire();if(!Q){Q=this.element;}if(S){R(S);}else{if(!F.inDocument(this.element)){return false;}}if(this.header&&!F.inDocument(this.header)){U=Q.firstChild;
if(U){Q.insertBefore(this.header,U);}else{Q.appendChild(this.header);}}if(this.body&&!F.inDocument(this.body)){if(this.footer&&F.isAncestor(this.moduleElement,this.footer)){Q.insertBefore(this.body,this.footer);}else{Q.appendChild(this.body);}}if(this.footer&&!F.inDocument(this.footer)){Q.appendChild(this.footer);}this.renderEvent.fire();return true;},destroy:function(){var Q;if(this.element){N.purgeElement(this.element,true);Q=this.element.parentNode;}if(Q){Q.removeChild(this.element);}this.element=null;this.header=null;this.body=null;this.footer=null;G.textResizeEvent.unsubscribe(this.onDomResize,this);this.cfg.destroy();this.cfg=null;this.destroyEvent.fire();},show:function(){this.cfg.setProperty("visible",true);},hide:function(){this.cfg.setProperty("visible",false);},configVisible:function(R,Q,S){var T=Q[0];if(T){this.beforeShowEvent.fire();F.setStyle(this.element,"display","block");this.showEvent.fire();}else{this.beforeHideEvent.fire();F.setStyle(this.element,"display","none");this.hideEvent.fire();}},configMonitorResize:function(S,R,T){var Q=R[0];if(Q){this.initResizeMonitor();}else{G.textResizeEvent.unsubscribe(this.onDomResize,this,true);this.resizeMonitor=null;}},_addToParent:function(Q,R){if(!this.cfg.getProperty("appendtodocumentbody")&&Q===document.body&&Q.firstChild){Q.insertBefore(R,Q.firstChild);}else{Q.appendChild(R);}},toString:function(){return"Module "+this.id;}};YAHOO.lang.augmentProto(G,YAHOO.util.EventProvider);}());(function(){YAHOO.widget.Overlay=function(P,O){YAHOO.widget.Overlay.superclass.constructor.call(this,P,O);};var I=YAHOO.lang,M=YAHOO.util.CustomEvent,G=YAHOO.widget.Module,N=YAHOO.util.Event,F=YAHOO.util.Dom,D=YAHOO.util.Config,K=YAHOO.env.ua,B=YAHOO.widget.Overlay,H="subscribe",E="unsubscribe",C="contained",J,A={"BEFORE_MOVE":"beforeMove","MOVE":"move"},L={"X":{key:"x",validator:I.isNumber,suppressEvent:true,supercedes:["iframe"]},"Y":{key:"y",validator:I.isNumber,suppressEvent:true,supercedes:["iframe"]},"XY":{key:"xy",suppressEvent:true,supercedes:["iframe"]},"CONTEXT":{key:"context",suppressEvent:true,supercedes:["iframe"]},"FIXED_CENTER":{key:"fixedcenter",value:false,supercedes:["iframe","visible"]},"WIDTH":{key:"width",suppressEvent:true,supercedes:["context","fixedcenter","iframe"]},"HEIGHT":{key:"height",suppressEvent:true,supercedes:["context","fixedcenter","iframe"]},"AUTO_FILL_HEIGHT":{key:"autofillheight",supercedes:["height"],value:"body"},"ZINDEX":{key:"zindex",value:null},"CONSTRAIN_TO_VIEWPORT":{key:"constraintoviewport",value:false,validator:I.isBoolean,supercedes:["iframe","x","y","xy"]},"IFRAME":{key:"iframe",value:(K.ie==6?true:false),validator:I.isBoolean,supercedes:["zindex"]},"PREVENT_CONTEXT_OVERLAP":{key:"preventcontextoverlap",value:false,validator:I.isBoolean,supercedes:["constraintoviewport"]}};B.IFRAME_SRC="javascript:false;";B.IFRAME_OFFSET=3;B.VIEWPORT_OFFSET=10;B.TOP_LEFT="tl";B.TOP_RIGHT="tr";B.BOTTOM_LEFT="bl";B.BOTTOM_RIGHT="br";B.CSS_OVERLAY="yui-overlay";B.STD_MOD_RE=/^\s*?(body|footer|header)\s*?$/i;B.windowScrollEvent=new M("windowScroll");B.windowResizeEvent=new M("windowResize");B.windowScrollHandler=function(P){var O=N.getTarget(P);if(!O||O===window||O===window.document){if(K.ie){if(!window.scrollEnd){window.scrollEnd=-1;}clearTimeout(window.scrollEnd);window.scrollEnd=setTimeout(function(){B.windowScrollEvent.fire();},1);}else{B.windowScrollEvent.fire();}}};B.windowResizeHandler=function(O){if(K.ie){if(!window.resizeEnd){window.resizeEnd=-1;}clearTimeout(window.resizeEnd);window.resizeEnd=setTimeout(function(){B.windowResizeEvent.fire();},100);}else{B.windowResizeEvent.fire();}};B._initialized=null;if(B._initialized===null){N.on(window,"scroll",B.windowScrollHandler);N.on(window,"resize",B.windowResizeHandler);B._initialized=true;}B._TRIGGER_MAP={"windowScroll":B.windowScrollEvent,"windowResize":B.windowResizeEvent,"textResize":G.textResizeEvent};YAHOO.extend(B,G,{CONTEXT_TRIGGERS:[],init:function(P,O){B.superclass.init.call(this,P);this.beforeInitEvent.fire(B);F.addClass(this.element,B.CSS_OVERLAY);if(O){this.cfg.applyConfig(O,true);}if(this.platform=="mac"&&K.gecko){if(!D.alreadySubscribed(this.showEvent,this.showMacGeckoScrollbars,this)){this.showEvent.subscribe(this.showMacGeckoScrollbars,this,true);}if(!D.alreadySubscribed(this.hideEvent,this.hideMacGeckoScrollbars,this)){this.hideEvent.subscribe(this.hideMacGeckoScrollbars,this,true);}}this.initEvent.fire(B);},initEvents:function(){B.superclass.initEvents.call(this);var O=M.LIST;this.beforeMoveEvent=this.createEvent(A.BEFORE_MOVE);this.beforeMoveEvent.signature=O;this.moveEvent=this.createEvent(A.MOVE);this.moveEvent.signature=O;},initDefaultConfig:function(){B.superclass.initDefaultConfig.call(this);var O=this.cfg;O.addProperty(L.X.key,{handler:this.configX,validator:L.X.validator,suppressEvent:L.X.suppressEvent,supercedes:L.X.supercedes});O.addProperty(L.Y.key,{handler:this.configY,validator:L.Y.validator,suppressEvent:L.Y.suppressEvent,supercedes:L.Y.supercedes});O.addProperty(L.XY.key,{handler:this.configXY,suppressEvent:L.XY.suppressEvent,supercedes:L.XY.supercedes});O.addProperty(L.CONTEXT.key,{handler:this.configContext,suppressEvent:L.CONTEXT.suppressEvent,supercedes:L.CONTEXT.supercedes});O.addProperty(L.FIXED_CENTER.key,{handler:this.configFixedCenter,value:L.FIXED_CENTER.value,validator:L.FIXED_CENTER.validator,supercedes:L.FIXED_CENTER.supercedes});O.addProperty(L.WIDTH.key,{handler:this.configWidth,suppressEvent:L.WIDTH.suppressEvent,supercedes:L.WIDTH.supercedes});O.addProperty(L.HEIGHT.key,{handler:this.configHeight,suppressEvent:L.HEIGHT.suppressEvent,supercedes:L.HEIGHT.supercedes});O.addProperty(L.AUTO_FILL_HEIGHT.key,{handler:this.configAutoFillHeight,value:L.AUTO_FILL_HEIGHT.value,validator:this._validateAutoFill,supercedes:L.AUTO_FILL_HEIGHT.supercedes});O.addProperty(L.ZINDEX.key,{handler:this.configzIndex,value:L.ZINDEX.value});O.addProperty(L.CONSTRAIN_TO_VIEWPORT.key,{handler:this.configConstrainToViewport,value:L.CONSTRAIN_TO_VIEWPORT.value,validator:L.CONSTRAIN_TO_VIEWPORT.validator,supercedes:L.CONSTRAIN_TO_VIEWPORT.supercedes});
O.addProperty(L.IFRAME.key,{handler:this.configIframe,value:L.IFRAME.value,validator:L.IFRAME.validator,supercedes:L.IFRAME.supercedes});O.addProperty(L.PREVENT_CONTEXT_OVERLAP.key,{value:L.PREVENT_CONTEXT_OVERLAP.value,validator:L.PREVENT_CONTEXT_OVERLAP.validator,supercedes:L.PREVENT_CONTEXT_OVERLAP.supercedes});},moveTo:function(O,P){this.cfg.setProperty("xy",[O,P]);},hideMacGeckoScrollbars:function(){F.replaceClass(this.element,"show-scrollbars","hide-scrollbars");},showMacGeckoScrollbars:function(){F.replaceClass(this.element,"hide-scrollbars","show-scrollbars");},_setDomVisibility:function(O){F.setStyle(this.element,"visibility",(O)?"visible":"hidden");if(O){F.removeClass(this.element,"yui-overlay-hidden");}else{F.addClass(this.element,"yui-overlay-hidden");}},configVisible:function(R,O,X){var Q=O[0],S=F.getStyle(this.element,"visibility"),Y=this.cfg.getProperty("effect"),V=[],U=(this.platform=="mac"&&K.gecko),g=D.alreadySubscribed,W,P,f,c,b,a,d,Z,T;if(S=="inherit"){f=this.element.parentNode;while(f.nodeType!=9&&f.nodeType!=11){S=F.getStyle(f,"visibility");if(S!="inherit"){break;}f=f.parentNode;}if(S=="inherit"){S="visible";}}if(Y){if(Y instanceof Array){Z=Y.length;for(c=0;c<Z;c++){W=Y[c];V[V.length]=W.effect(this,W.duration);}}else{V[V.length]=Y.effect(this,Y.duration);}}if(Q){if(U){this.showMacGeckoScrollbars();}if(Y){if(Q){if(S!="visible"||S===""){this.beforeShowEvent.fire();T=V.length;for(b=0;b<T;b++){P=V[b];if(b===0&&!g(P.animateInCompleteEvent,this.showEvent.fire,this.showEvent)){P.animateInCompleteEvent.subscribe(this.showEvent.fire,this.showEvent,true);}P.animateIn();}}}}else{if(S!="visible"||S===""){this.beforeShowEvent.fire();this._setDomVisibility(true);this.cfg.refireEvent("iframe");this.showEvent.fire();}else{this._setDomVisibility(true);}}}else{if(U){this.hideMacGeckoScrollbars();}if(Y){if(S=="visible"){this.beforeHideEvent.fire();T=V.length;for(a=0;a<T;a++){d=V[a];if(a===0&&!g(d.animateOutCompleteEvent,this.hideEvent.fire,this.hideEvent)){d.animateOutCompleteEvent.subscribe(this.hideEvent.fire,this.hideEvent,true);}d.animateOut();}}else{if(S===""){this._setDomVisibility(false);}}}else{if(S=="visible"||S===""){this.beforeHideEvent.fire();this._setDomVisibility(false);this.hideEvent.fire();}else{this._setDomVisibility(false);}}}},doCenterOnDOMEvent:function(){var O=this.cfg,P=O.getProperty("fixedcenter");if(O.getProperty("visible")){if(P&&(P!==C||this.fitsInViewport())){this.center();}}},fitsInViewport:function(){var S=B.VIEWPORT_OFFSET,Q=this.element,T=Q.offsetWidth,R=Q.offsetHeight,O=F.getViewportWidth(),P=F.getViewportHeight();return((T+S<O)&&(R+S<P));},configFixedCenter:function(S,Q,T){var U=Q[0],P=D.alreadySubscribed,R=B.windowResizeEvent,O=B.windowScrollEvent;if(U){this.center();if(!P(this.beforeShowEvent,this.center)){this.beforeShowEvent.subscribe(this.center);}if(!P(R,this.doCenterOnDOMEvent,this)){R.subscribe(this.doCenterOnDOMEvent,this,true);}if(!P(O,this.doCenterOnDOMEvent,this)){O.subscribe(this.doCenterOnDOMEvent,this,true);}}else{this.beforeShowEvent.unsubscribe(this.center);R.unsubscribe(this.doCenterOnDOMEvent,this);O.unsubscribe(this.doCenterOnDOMEvent,this);}},configHeight:function(R,P,S){var O=P[0],Q=this.element;F.setStyle(Q,"height",O);this.cfg.refireEvent("iframe");},configAutoFillHeight:function(T,S,P){var V=S[0],Q=this.cfg,U="autofillheight",W="height",R=Q.getProperty(U),O=this._autoFillOnHeightChange;Q.unsubscribeFromConfigEvent(W,O);G.textResizeEvent.unsubscribe(O);this.changeContentEvent.unsubscribe(O);if(R&&V!==R&&this[R]){F.setStyle(this[R],W,"");}if(V){V=I.trim(V.toLowerCase());Q.subscribeToConfigEvent(W,O,this[V],this);G.textResizeEvent.subscribe(O,this[V],this);this.changeContentEvent.subscribe(O,this[V],this);Q.setProperty(U,V,true);}},configWidth:function(R,O,S){var Q=O[0],P=this.element;F.setStyle(P,"width",Q);this.cfg.refireEvent("iframe");},configzIndex:function(Q,O,R){var S=O[0],P=this.element;if(!S){S=F.getStyle(P,"zIndex");if(!S||isNaN(S)){S=0;}}if(this.iframe||this.cfg.getProperty("iframe")===true){if(S<=0){S=1;}}F.setStyle(P,"zIndex",S);this.cfg.setProperty("zIndex",S,true);if(this.iframe){this.stackIframe();}},configXY:function(Q,P,R){var T=P[0],O=T[0],S=T[1];this.cfg.setProperty("x",O);this.cfg.setProperty("y",S);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},configX:function(Q,P,R){var O=P[0],S=this.cfg.getProperty("y");this.cfg.setProperty("x",O,true);this.cfg.setProperty("y",S,true);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");F.setX(this.element,O,true);this.cfg.setProperty("xy",[O,S],true);this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},configY:function(Q,P,R){var O=this.cfg.getProperty("x"),S=P[0];this.cfg.setProperty("x",O,true);this.cfg.setProperty("y",S,true);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");F.setY(this.element,S,true);this.cfg.setProperty("xy",[O,S],true);this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},showIframe:function(){var P=this.iframe,O;if(P){O=this.element.parentNode;if(O!=P.parentNode){this._addToParent(O,P);}P.style.display="block";}},hideIframe:function(){if(this.iframe){this.iframe.style.display="none";}},syncIframe:function(){var O=this.iframe,Q=this.element,S=B.IFRAME_OFFSET,P=(S*2),R;if(O){O.style.width=(Q.offsetWidth+P+"px");O.style.height=(Q.offsetHeight+P+"px");R=this.cfg.getProperty("xy");if(!I.isArray(R)||(isNaN(R[0])||isNaN(R[1]))){this.syncPosition();R=this.cfg.getProperty("xy");}F.setXY(O,[(R[0]-S),(R[1]-S)]);}},stackIframe:function(){if(this.iframe){var O=F.getStyle(this.element,"zIndex");if(!YAHOO.lang.isUndefined(O)&&!isNaN(O)){F.setStyle(this.iframe,"zIndex",(O-1));}}},configIframe:function(R,Q,S){var O=Q[0];function T(){var V=this.iframe,W=this.element,X;if(!V){if(!J){J=document.createElement("iframe");if(this.isSecure){J.src=B.IFRAME_SRC;}if(K.ie){J.style.filter="alpha(opacity=0)";
J.frameBorder=0;}else{J.style.opacity="0";}J.style.position="absolute";J.style.border="none";J.style.margin="0";J.style.padding="0";J.style.display="none";J.tabIndex=-1;}V=J.cloneNode(false);X=W.parentNode;var U=X||document.body;this._addToParent(U,V);this.iframe=V;}this.showIframe();this.syncIframe();this.stackIframe();if(!this._hasIframeEventListeners){this.showEvent.subscribe(this.showIframe);this.hideEvent.subscribe(this.hideIframe);this.changeContentEvent.subscribe(this.syncIframe);this._hasIframeEventListeners=true;}}function P(){T.call(this);this.beforeShowEvent.unsubscribe(P);this._iframeDeferred=false;}if(O){if(this.cfg.getProperty("visible")){T.call(this);}else{if(!this._iframeDeferred){this.beforeShowEvent.subscribe(P);this._iframeDeferred=true;}}}else{this.hideIframe();if(this._hasIframeEventListeners){this.showEvent.unsubscribe(this.showIframe);this.hideEvent.unsubscribe(this.hideIframe);this.changeContentEvent.unsubscribe(this.syncIframe);this._hasIframeEventListeners=false;}}},_primeXYFromDOM:function(){if(YAHOO.lang.isUndefined(this.cfg.getProperty("xy"))){this.syncPosition();this.cfg.refireEvent("xy");this.beforeShowEvent.unsubscribe(this._primeXYFromDOM);}},configConstrainToViewport:function(P,O,Q){var R=O[0];if(R){if(!D.alreadySubscribed(this.beforeMoveEvent,this.enforceConstraints,this)){this.beforeMoveEvent.subscribe(this.enforceConstraints,this,true);}if(!D.alreadySubscribed(this.beforeShowEvent,this._primeXYFromDOM)){this.beforeShowEvent.subscribe(this._primeXYFromDOM);}}else{this.beforeShowEvent.unsubscribe(this._primeXYFromDOM);this.beforeMoveEvent.unsubscribe(this.enforceConstraints,this);}},configContext:function(T,S,P){var W=S[0],Q,O,U,R,V=this.CONTEXT_TRIGGERS;if(W){Q=W[0];O=W[1];U=W[2];R=W[3];if(V&&V.length>0){R=(R||[]).concat(V);}if(Q){if(typeof Q=="string"){this.cfg.setProperty("context",[document.getElementById(Q),O,U,R],true);}if(O&&U){this.align(O,U);}if(this._contextTriggers){this._processTriggers(this._contextTriggers,E,this._alignOnTrigger);}if(R){this._processTriggers(R,H,this._alignOnTrigger);this._contextTriggers=R;}}}},_alignOnTrigger:function(P,O){this.align();},_findTriggerCE:function(O){var P=null;if(O instanceof M){P=O;}else{if(B._TRIGGER_MAP[O]){P=B._TRIGGER_MAP[O];}}return P;},_processTriggers:function(S,U,R){var Q,T;for(var P=0,O=S.length;P<O;++P){Q=S[P];T=this._findTriggerCE(Q);if(T){T[U](R,this,true);}else{this[U](Q,R);}}},align:function(P,O){var U=this.cfg.getProperty("context"),T=this,S,R,V;function Q(W,X){switch(P){case B.TOP_LEFT:T.moveTo(X,W);break;case B.TOP_RIGHT:T.moveTo((X-R.offsetWidth),W);break;case B.BOTTOM_LEFT:T.moveTo(X,(W-R.offsetHeight));break;case B.BOTTOM_RIGHT:T.moveTo((X-R.offsetWidth),(W-R.offsetHeight));break;}}if(U){S=U[0];R=this.element;T=this;if(!P){P=U[1];}if(!O){O=U[2];}if(R&&S){V=F.getRegion(S);switch(O){case B.TOP_LEFT:Q(V.top,V.left);break;case B.TOP_RIGHT:Q(V.top,V.right);break;case B.BOTTOM_LEFT:Q(V.bottom,V.left);break;case B.BOTTOM_RIGHT:Q(V.bottom,V.right);break;}}}},enforceConstraints:function(P,O,Q){var S=O[0];var R=this.getConstrainedXY(S[0],S[1]);this.cfg.setProperty("x",R[0],true);this.cfg.setProperty("y",R[1],true);this.cfg.setProperty("xy",R,true);},getConstrainedX:function(V){var S=this,O=S.element,e=O.offsetWidth,c=B.VIEWPORT_OFFSET,h=F.getViewportWidth(),d=F.getDocumentScrollLeft(),Y=(e+c<h),b=this.cfg.getProperty("context"),Q,X,j,T=false,f,W,g=d+c,P=d+h-e-c,i=V,U={"tltr":true,"blbr":true,"brbl":true,"trtl":true};var Z=function(){var k;if((S.cfg.getProperty("x")-d)>X){k=(X-e);}else{k=(X+j);}S.cfg.setProperty("x",(k+d),true);return k;};var R=function(){if((S.cfg.getProperty("x")-d)>X){return(W-c);}else{return(f-c);}};var a=function(){var k=R(),l;if(e>k){if(T){Z();}else{Z();T=true;l=a();}}return l;};if(V<g||V>P){if(Y){if(this.cfg.getProperty("preventcontextoverlap")&&b&&U[(b[1]+b[2])]){Q=b[0];X=F.getX(Q)-d;j=Q.offsetWidth;f=X;W=(h-(X+j));a();i=this.cfg.getProperty("x");}else{if(V<g){i=g;}else{if(V>P){i=P;}}}}else{i=c+d;}}return i;},getConstrainedY:function(Z){var W=this,P=W.element,i=P.offsetHeight,h=B.VIEWPORT_OFFSET,d=F.getViewportHeight(),g=F.getDocumentScrollTop(),e=(i+h<d),f=this.cfg.getProperty("context"),U,a,b,X=false,V,Q,c=g+h,S=g+d-i-h,O=Z,Y={"trbr":true,"tlbl":true,"bltl":true,"brtr":true};var T=function(){var k;if((W.cfg.getProperty("y")-g)>a){k=(a-i);}else{k=(a+b);}W.cfg.setProperty("y",(k+g),true);return k;};var R=function(){if((W.cfg.getProperty("y")-g)>a){return(Q-h);}else{return(V-h);}};var j=function(){var l=R(),k;if(i>l){if(X){T();}else{T();X=true;k=j();}}return k;};if(Z<c||Z>S){if(e){if(this.cfg.getProperty("preventcontextoverlap")&&f&&Y[(f[1]+f[2])]){U=f[0];b=U.offsetHeight;a=(F.getY(U)-g);V=a;Q=(d-(a+b));j();O=W.cfg.getProperty("y");}else{if(Z<c){O=c;}else{if(Z>S){O=S;}}}}else{O=h+g;}}return O;},getConstrainedXY:function(O,P){return[this.getConstrainedX(O),this.getConstrainedY(P)];},center:function(){var R=B.VIEWPORT_OFFSET,S=this.element.offsetWidth,Q=this.element.offsetHeight,P=F.getViewportWidth(),T=F.getViewportHeight(),O,U;if(S<P){O=(P/2)-(S/2)+F.getDocumentScrollLeft();}else{O=R+F.getDocumentScrollLeft();}if(Q<T){U=(T/2)-(Q/2)+F.getDocumentScrollTop();}else{U=R+F.getDocumentScrollTop();}this.cfg.setProperty("xy",[parseInt(O,10),parseInt(U,10)]);this.cfg.refireEvent("iframe");if(K.webkit){this.forceContainerRedraw();}},syncPosition:function(){var O=F.getXY(this.element);this.cfg.setProperty("x",O[0],true);this.cfg.setProperty("y",O[1],true);this.cfg.setProperty("xy",O,true);},onDomResize:function(Q,P){var O=this;B.superclass.onDomResize.call(this,Q,P);setTimeout(function(){O.syncPosition();O.cfg.refireEvent("iframe");O.cfg.refireEvent("context");},0);},_getComputedHeight:(function(){if(document.defaultView&&document.defaultView.getComputedStyle){return function(P){var O=null;if(P.ownerDocument&&P.ownerDocument.defaultView){var Q=P.ownerDocument.defaultView.getComputedStyle(P,"");if(Q){O=parseInt(Q.height,10);}}return(I.isNumber(O))?O:null;};}else{return function(P){var O=null;
if(P.style.pixelHeight){O=P.style.pixelHeight;}return(I.isNumber(O))?O:null;};}})(),_validateAutoFillHeight:function(O){return(!O)||(I.isString(O)&&B.STD_MOD_RE.test(O));},_autoFillOnHeightChange:function(R,P,Q){var O=this.cfg.getProperty("height");if((O&&O!=="auto")||(O===0)){this.fillHeight(Q);}},_getPreciseHeight:function(P){var O=P.offsetHeight;if(P.getBoundingClientRect){var Q=P.getBoundingClientRect();O=Q.bottom-Q.top;}return O;},fillHeight:function(R){if(R){var P=this.innerElement||this.element,O=[this.header,this.body,this.footer],V,W=0,X=0,T=0,Q=false;for(var U=0,S=O.length;U<S;U++){V=O[U];if(V){if(R!==V){X+=this._getPreciseHeight(V);}else{Q=true;}}}if(Q){if(K.ie||K.opera){F.setStyle(R,"height",0+"px");}W=this._getComputedHeight(P);if(W===null){F.addClass(P,"yui-override-padding");W=P.clientHeight;F.removeClass(P,"yui-override-padding");}T=Math.max(W-X,0);F.setStyle(R,"height",T+"px");if(R.offsetHeight!=T){T=Math.max(T-(R.offsetHeight-T),0);}F.setStyle(R,"height",T+"px");}}},bringToTop:function(){var S=[],R=this.element;function V(Z,Y){var b=F.getStyle(Z,"zIndex"),a=F.getStyle(Y,"zIndex"),X=(!b||isNaN(b))?0:parseInt(b,10),W=(!a||isNaN(a))?0:parseInt(a,10);if(X>W){return -1;}else{if(X<W){return 1;}else{return 0;}}}function Q(Y){var X=F.hasClass(Y,B.CSS_OVERLAY),W=YAHOO.widget.Panel;if(X&&!F.isAncestor(R,Y)){if(W&&F.hasClass(Y,W.CSS_PANEL)){S[S.length]=Y.parentNode;}else{S[S.length]=Y;}}}F.getElementsBy(Q,"DIV",document.body);S.sort(V);var O=S[0],U;if(O){U=F.getStyle(O,"zIndex");if(!isNaN(U)){var T=false;if(O!=R){T=true;}else{if(S.length>1){var P=F.getStyle(S[1],"zIndex");if(!isNaN(P)&&(U==P)){T=true;}}}if(T){this.cfg.setProperty("zindex",(parseInt(U,10)+2));}}}},destroy:function(){if(this.iframe){this.iframe.parentNode.removeChild(this.iframe);}this.iframe=null;B.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent,this);B.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent,this);G.textResizeEvent.unsubscribe(this._autoFillOnHeightChange);B.superclass.destroy.call(this);},forceContainerRedraw:function(){var O=this;F.addClass(O.element,"yui-force-redraw");setTimeout(function(){F.removeClass(O.element,"yui-force-redraw");},0);},toString:function(){return"Overlay "+this.id;}});}());(function(){YAHOO.widget.OverlayManager=function(G){this.init(G);};var D=YAHOO.widget.Overlay,C=YAHOO.util.Event,E=YAHOO.util.Dom,B=YAHOO.util.Config,F=YAHOO.util.CustomEvent,A=YAHOO.widget.OverlayManager;A.CSS_FOCUSED="focused";A.prototype={constructor:A,overlays:null,initDefaultConfig:function(){this.cfg.addProperty("overlays",{suppressEvent:true});this.cfg.addProperty("focusevent",{value:"mousedown"});},init:function(I){this.cfg=new B(this);this.initDefaultConfig();if(I){this.cfg.applyConfig(I,true);}this.cfg.fireQueue();var H=null;this.getActive=function(){return H;};this.focus=function(J){var K=this.find(J);if(K){K.focus();}};this.remove=function(K){var M=this.find(K),J;if(M){if(H==M){H=null;}var L=(M.element===null&&M.cfg===null)?true:false;if(!L){J=E.getStyle(M.element,"zIndex");M.cfg.setProperty("zIndex",-1000,true);}this.overlays.sort(this.compareZIndexDesc);this.overlays=this.overlays.slice(0,(this.overlays.length-1));M.hideEvent.unsubscribe(M.blur);M.destroyEvent.unsubscribe(this._onOverlayDestroy,M);M.focusEvent.unsubscribe(this._onOverlayFocusHandler,M);M.blurEvent.unsubscribe(this._onOverlayBlurHandler,M);if(!L){C.removeListener(M.element,this.cfg.getProperty("focusevent"),this._onOverlayElementFocus);M.cfg.setProperty("zIndex",J,true);M.cfg.setProperty("manager",null);}if(M.focusEvent._managed){M.focusEvent=null;}if(M.blurEvent._managed){M.blurEvent=null;}if(M.focus._managed){M.focus=null;}if(M.blur._managed){M.blur=null;}}};this.blurAll=function(){var K=this.overlays.length,J;if(K>0){J=K-1;do{this.overlays[J].blur();}while(J--);}};this._manageBlur=function(J){var K=false;if(H==J){E.removeClass(H.element,A.CSS_FOCUSED);H=null;K=true;}return K;};this._manageFocus=function(J){var K=false;if(H!=J){if(H){H.blur();}H=J;this.bringToTop(H);E.addClass(H.element,A.CSS_FOCUSED);K=true;}return K;};var G=this.cfg.getProperty("overlays");if(!this.overlays){this.overlays=[];}if(G){this.register(G);this.overlays.sort(this.compareZIndexDesc);}},_onOverlayElementFocus:function(I){var G=C.getTarget(I),H=this.close;if(H&&(G==H||E.isAncestor(H,G))){this.blur();}else{this.focus();}},_onOverlayDestroy:function(H,G,I){this.remove(I);},_onOverlayFocusHandler:function(H,G,I){this._manageFocus(I);},_onOverlayBlurHandler:function(H,G,I){this._manageBlur(I);},_bindFocus:function(G){var H=this;if(!G.focusEvent){G.focusEvent=G.createEvent("focus");G.focusEvent.signature=F.LIST;G.focusEvent._managed=true;}else{G.focusEvent.subscribe(H._onOverlayFocusHandler,G,H);}if(!G.focus){C.on(G.element,H.cfg.getProperty("focusevent"),H._onOverlayElementFocus,null,G);G.focus=function(){if(H._manageFocus(this)){if(this.cfg.getProperty("visible")&&this.focusFirst){this.focusFirst();}this.focusEvent.fire();}};G.focus._managed=true;}},_bindBlur:function(G){var H=this;if(!G.blurEvent){G.blurEvent=G.createEvent("blur");G.blurEvent.signature=F.LIST;G.focusEvent._managed=true;}else{G.blurEvent.subscribe(H._onOverlayBlurHandler,G,H);}if(!G.blur){G.blur=function(){if(H._manageBlur(this)){this.blurEvent.fire();}};G.blur._managed=true;}G.hideEvent.subscribe(G.blur);},_bindDestroy:function(G){var H=this;G.destroyEvent.subscribe(H._onOverlayDestroy,G,H);},_syncZIndex:function(G){var H=E.getStyle(G.element,"zIndex");if(!isNaN(H)){G.cfg.setProperty("zIndex",parseInt(H,10));}else{G.cfg.setProperty("zIndex",0);}},register:function(G){var J=false,H,I;if(G instanceof D){G.cfg.addProperty("manager",{value:this});this._bindFocus(G);this._bindBlur(G);this._bindDestroy(G);this._syncZIndex(G);this.overlays.push(G);this.bringToTop(G);J=true;}else{if(G instanceof Array){for(H=0,I=G.length;H<I;H++){J=this.register(G[H])||J;}}}return J;},bringToTop:function(M){var I=this.find(M),L,G,J;if(I){J=this.overlays;J.sort(this.compareZIndexDesc);G=J[0];if(G){L=E.getStyle(G.element,"zIndex");
if(!isNaN(L)){var K=false;if(G!==I){K=true;}else{if(J.length>1){var H=E.getStyle(J[1].element,"zIndex");if(!isNaN(H)&&(L==H)){K=true;}}}if(K){I.cfg.setProperty("zindex",(parseInt(L,10)+2));}}J.sort(this.compareZIndexDesc);}}},find:function(G){var K=G instanceof D,I=this.overlays,M=I.length,J=null,L,H;if(K||typeof G=="string"){for(H=M-1;H>=0;H--){L=I[H];if((K&&(L===G))||(L.id==G)){J=L;break;}}}return J;},compareZIndexDesc:function(J,I){var H=(J.cfg)?J.cfg.getProperty("zIndex"):null,G=(I.cfg)?I.cfg.getProperty("zIndex"):null;if(H===null&&G===null){return 0;}else{if(H===null){return 1;}else{if(G===null){return -1;}else{if(H>G){return -1;}else{if(H<G){return 1;}else{return 0;}}}}}},showAll:function(){var H=this.overlays,I=H.length,G;for(G=I-1;G>=0;G--){H[G].show();}},hideAll:function(){var H=this.overlays,I=H.length,G;for(G=I-1;G>=0;G--){H[G].hide();}},toString:function(){return"OverlayManager";}};}());(function(){YAHOO.widget.ContainerEffect=function(E,H,G,D,F){if(!F){F=YAHOO.util.Anim;}this.overlay=E;this.attrIn=H;this.attrOut=G;this.targetElement=D||E.element;this.animClass=F;};var B=YAHOO.util.Dom,C=YAHOO.util.CustomEvent,A=YAHOO.widget.ContainerEffect;A.FADE=function(D,F){var G=YAHOO.util.Easing,I={attributes:{opacity:{from:0,to:1}},duration:F,method:G.easeIn},E={attributes:{opacity:{to:0}},duration:F,method:G.easeOut},H=new A(D,I,E,D.element);H.handleUnderlayStart=function(){var K=this.overlay.underlay;if(K&&YAHOO.env.ua.ie){var J=(K.filters&&K.filters.length>0);if(J){B.addClass(D.element,"yui-effect-fade");}}};H.handleUnderlayComplete=function(){var J=this.overlay.underlay;if(J&&YAHOO.env.ua.ie){B.removeClass(D.element,"yui-effect-fade");}};H.handleStartAnimateIn=function(K,J,L){B.addClass(L.overlay.element,"hide-select");if(!L.overlay.underlay){L.overlay.cfg.refireEvent("underlay");}L.handleUnderlayStart();L.overlay._setDomVisibility(true);B.setStyle(L.overlay.element,"opacity",0);};H.handleCompleteAnimateIn=function(K,J,L){B.removeClass(L.overlay.element,"hide-select");if(L.overlay.element.style.filter){L.overlay.element.style.filter=null;}L.handleUnderlayComplete();L.overlay.cfg.refireEvent("iframe");L.animateInCompleteEvent.fire();};H.handleStartAnimateOut=function(K,J,L){B.addClass(L.overlay.element,"hide-select");L.handleUnderlayStart();};H.handleCompleteAnimateOut=function(K,J,L){B.removeClass(L.overlay.element,"hide-select");if(L.overlay.element.style.filter){L.overlay.element.style.filter=null;}L.overlay._setDomVisibility(false);B.setStyle(L.overlay.element,"opacity",1);L.handleUnderlayComplete();L.overlay.cfg.refireEvent("iframe");L.animateOutCompleteEvent.fire();};H.init();return H;};A.SLIDE=function(F,D){var I=YAHOO.util.Easing,L=F.cfg.getProperty("x")||B.getX(F.element),K=F.cfg.getProperty("y")||B.getY(F.element),M=B.getClientWidth(),H=F.element.offsetWidth,J={attributes:{points:{to:[L,K]}},duration:D,method:I.easeIn},E={attributes:{points:{to:[(M+25),K]}},duration:D,method:I.easeOut},G=new A(F,J,E,F.element,YAHOO.util.Motion);G.handleStartAnimateIn=function(O,N,P){P.overlay.element.style.left=((-25)-H)+"px";P.overlay.element.style.top=K+"px";};G.handleTweenAnimateIn=function(Q,P,R){var S=B.getXY(R.overlay.element),O=S[0],N=S[1];if(B.getStyle(R.overlay.element,"visibility")=="hidden"&&O<L){R.overlay._setDomVisibility(true);}R.overlay.cfg.setProperty("xy",[O,N],true);R.overlay.cfg.refireEvent("iframe");};G.handleCompleteAnimateIn=function(O,N,P){P.overlay.cfg.setProperty("xy",[L,K],true);P.startX=L;P.startY=K;P.overlay.cfg.refireEvent("iframe");P.animateInCompleteEvent.fire();};G.handleStartAnimateOut=function(O,N,R){var P=B.getViewportWidth(),S=B.getXY(R.overlay.element),Q=S[1];R.animOut.attributes.points.to=[(P+25),Q];};G.handleTweenAnimateOut=function(P,O,Q){var S=B.getXY(Q.overlay.element),N=S[0],R=S[1];Q.overlay.cfg.setProperty("xy",[N,R],true);Q.overlay.cfg.refireEvent("iframe");};G.handleCompleteAnimateOut=function(O,N,P){P.overlay._setDomVisibility(false);P.overlay.cfg.setProperty("xy",[L,K]);P.animateOutCompleteEvent.fire();};G.init();return G;};A.prototype={init:function(){this.beforeAnimateInEvent=this.createEvent("beforeAnimateIn");this.beforeAnimateInEvent.signature=C.LIST;this.beforeAnimateOutEvent=this.createEvent("beforeAnimateOut");this.beforeAnimateOutEvent.signature=C.LIST;this.animateInCompleteEvent=this.createEvent("animateInComplete");this.animateInCompleteEvent.signature=C.LIST;this.animateOutCompleteEvent=this.createEvent("animateOutComplete");this.animateOutCompleteEvent.signature=C.LIST;this.animIn=new this.animClass(this.targetElement,this.attrIn.attributes,this.attrIn.duration,this.attrIn.method);this.animIn.onStart.subscribe(this.handleStartAnimateIn,this);this.animIn.onTween.subscribe(this.handleTweenAnimateIn,this);this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn,this);this.animOut=new this.animClass(this.targetElement,this.attrOut.attributes,this.attrOut.duration,this.attrOut.method);this.animOut.onStart.subscribe(this.handleStartAnimateOut,this);this.animOut.onTween.subscribe(this.handleTweenAnimateOut,this);this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut,this);},animateIn:function(){this.beforeAnimateInEvent.fire();this.animIn.animate();},animateOut:function(){this.beforeAnimateOutEvent.fire();this.animOut.animate();},handleStartAnimateIn:function(E,D,F){},handleTweenAnimateIn:function(E,D,F){},handleCompleteAnimateIn:function(E,D,F){},handleStartAnimateOut:function(E,D,F){},handleTweenAnimateOut:function(E,D,F){},handleCompleteAnimateOut:function(E,D,F){},toString:function(){var D="ContainerEffect";if(this.overlay){D+=" ["+this.overlay.toString()+"]";}return D;}};YAHOO.lang.augmentProto(A,YAHOO.util.EventProvider);})();YAHOO.register("containercore",YAHOO.widget.Module,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){var S="DIV",O="hd",K="bd",N="ft",X="LI",A="disabled",D="mouseover",F="mouseout",U="mousedown",G="mouseup",R=YAHOO.env.ua.ie?"focusin":"focus",V="click",B="keydown",M="keyup",I="keypress",L="clicktohide",T="position",P="dynamic",Y="showdelay",J="selected",E="visible",W="UL",Q="MenuManager",C=YAHOO.util.Dom,Z=YAHOO.util.Event,H=YAHOO.lang;YAHOO.widget.MenuManager=function(){var a=false,c={},r={},d={},n={"click":"clickEvent","mousedown":"mouseDownEvent","mouseup":"mouseUpEvent","mouseover":"mouseOverEvent","mouseout":"mouseOutEvent","keydown":"keyDownEvent","keyup":"keyUpEvent","keypress":"keyPressEvent","focus":"focusEvent","focusin":"focusEvent","blur":"blurEvent","focusout":"blurEvent"},m=null,k=null;function o(u){var s,t;if(u&&u.tagName){switch(u.tagName.toUpperCase()){case S:s=u.parentNode;if((C.hasClass(u,O)||C.hasClass(u,K)||C.hasClass(u,N))&&s&&s.tagName&&s.tagName.toUpperCase()==S){t=s;}else{t=u;}break;case X:t=u;break;default:s=u.parentNode;if(s){t=o(s);}break;}}return t;}function q(w){var s=Z.getTarget(w),t=o(s),y,u,v,AA,z;if(t){u=t.tagName.toUpperCase();if(u==X){v=t.id;if(v&&d[v]){AA=d[v];z=AA.parent;}}else{if(u==S){if(t.id){z=c[t.id];}}}}if(z){y=n[w.type];if(AA&&!AA.cfg.getProperty(A)){AA[y].fire(w);}z[y].fire(w,AA);}else{if(w.type==U){for(var x in r){if(H.hasOwnProperty(r,x)){z=r[x];if(z.cfg.getProperty(L)&&!(z instanceof YAHOO.widget.MenuBar)&&z.cfg.getProperty(T)==P){z.hide();}else{if(z.cfg.getProperty(Y)>0){z._cancelShowDelay();}if(z.activeItem){z.activeItem.blur();z.activeItem.cfg.setProperty(J,false);z.activeItem=null;}}}}}else{if(w.type==R){m=s;}}}}function f(t,s,u){if(c[u.id]){this.removeMenu(u);}}function j(t,s){var u=s[1];if(u){k=u;}}function i(t,s){k=null;}function b(t,s,v){if(v&&v.focus){try{v.focus();}catch(u){}}this.hideEvent.unsubscribe(b,v);}function l(t,s){if(this===this.getRoot()&&this.cfg.getProperty(T)===P){this.hideEvent.subscribe(b,m);this.focus();}}function g(u,t){var s=t[0],v=this.id;if(s){r[v]=this;}else{if(r[v]){delete r[v];}}}function h(t,s){p(this);}function p(t){var s=t.id;if(s&&d[s]){if(k==t){k=null;}delete d[s];t.destroyEvent.unsubscribe(h);}}function e(t,s){var v=s[0],u;if(v instanceof YAHOO.widget.MenuItem){u=v.id;if(!d[u]){d[u]=v;v.destroyEvent.subscribe(h);}}}return{addMenu:function(t){var s;if(t instanceof YAHOO.widget.Menu&&t.id&&!c[t.id]){c[t.id]=t;if(!a){s=document;Z.on(s,D,q,this,true);Z.on(s,F,q,this,true);Z.on(s,U,q,this,true);Z.on(s,G,q,this,true);Z.on(s,V,q,this,true);Z.on(s,B,q,this,true);Z.on(s,M,q,this,true);Z.on(s,I,q,this,true);Z.onFocus(s,q,this,true);Z.onBlur(s,q,this,true);a=true;}t.cfg.subscribeToConfigEvent(E,g);t.destroyEvent.subscribe(f,t,this);t.itemAddedEvent.subscribe(e);t.focusEvent.subscribe(j);t.blurEvent.subscribe(i);t.showEvent.subscribe(l);}},removeMenu:function(v){var t,s,u;if(v){t=v.id;if((t in c)&&(c[t]==v)){s=v.getItems();if(s&&s.length>0){u=s.length-1;do{p(s[u]);}while(u--);}delete c[t];if((t in r)&&(r[t]==v)){delete r[t];}if(v.cfg){v.cfg.unsubscribeFromConfigEvent(E,g);}v.destroyEvent.unsubscribe(f,v);v.itemAddedEvent.unsubscribe(e);v.focusEvent.unsubscribe(j);v.blurEvent.unsubscribe(i);}}},hideVisible:function(){var s;for(var t in r){if(H.hasOwnProperty(r,t)){s=r[t];if(!(s instanceof YAHOO.widget.MenuBar)&&s.cfg.getProperty(T)==P){s.hide();}}}},getVisible:function(){return r;},getMenus:function(){return c;},getMenu:function(t){var s;if(t in c){s=c[t];}return s;},getMenuItem:function(t){var s;if(t in d){s=d[t];}return s;},getMenuItemGroup:function(w){var t=C.get(w),s,y,x,u,v;if(t&&t.tagName&&t.tagName.toUpperCase()==W){y=t.firstChild;if(y){s=[];do{u=y.id;if(u){x=this.getMenuItem(u);if(x){s[s.length]=x;}}}while((y=y.nextSibling));if(s.length>0){v=s;}}}return v;},getFocusedMenuItem:function(){return k;},getFocusedMenu:function(){var s;if(k){s=k.parent.getRoot();}return s;},toString:function(){return Q;}};}();})();(function(){var AN=YAHOO.lang,Ao="Menu",H="DIV",K="div",Ak="id",AI="SELECT",f="xy",R="y",Av="UL",L="ul",AK="first-of-type",l="LI",i="OPTGROUP",Ax="OPTION",Af="disabled",AY="none",z="selected",Ar="groupindex",j="index",O="submenu",As="visible",AX="hidedelay",Ab="position",AE="dynamic",C="static",Al=AE+","+C,Y="windows",Q="url",M="#",V="target",AU="maxheight",T="topscrollbar",y="bottomscrollbar",e="_",P=T+e+Af,E=y+e+Af,c="mousemove",At="showdelay",d="submenuhidedelay",AG="iframe",x="constraintoviewport",A2="preventcontextoverlap",AP="submenualignment",a="autosubmenudisplay",AD="clicktohide",h="container",k="scrollincrement",Ah="minscrollheight",A0="classname",Ae="shadow",Ap="keepopen",Ay="hd",D="hastitle",q="context",v="",Ai="mousedown",Ac="keydown",Am="height",U="width",AR="px",Aw="effect",AF="monitorresize",AW="display",AV="block",J="visibility",AA="absolute",AT="zindex",m="yui-menu-body-scrolled",AL="&#32;",Az=" ",Ag="mouseover",G="mouseout",AS="itemAdded",o="itemRemoved",AM="hidden",t="yui-menu-shadow",AH=t+"-visible",n=t+Az+AH;YAHOO.widget.Menu=function(A4,A3){if(A3){this.parent=A3.parent;this.lazyLoad=A3.lazyLoad||A3.lazyload;this.itemData=A3.itemData||A3.itemdata;}YAHOO.widget.Menu.superclass.constructor.call(this,A4,A3);};function B(A4){var A3=false;if(AN.isString(A4)){A3=(Al.indexOf((A4.toLowerCase()))!=-1);}return A3;}var g=YAHOO.util.Dom,AB=YAHOO.util.Event,Au=YAHOO.widget.Module,AC=YAHOO.widget.Overlay,s=YAHOO.widget.Menu,A1=YAHOO.widget.MenuManager,F=YAHOO.util.CustomEvent,Aq=YAHOO.env.ua,An,Aa=[["mouseOverEvent",Ag],["mouseOutEvent",G],["mouseDownEvent",Ai],["mouseUpEvent","mouseup"],["clickEvent","click"],["keyPressEvent","keypress"],["keyDownEvent",Ac],["keyUpEvent","keyup"],["focusEvent","focus"],["blurEvent","blur"],["itemAddedEvent",AS],["itemRemovedEvent",o]],AZ={key:As,value:false,validator:AN.isBoolean},AQ={key:x,value:true,validator:AN.isBoolean,supercedes:[AG,"x",R,f]},AJ={key:A2,value:true,validator:AN.isBoolean,supercedes:[x]},S={key:Ab,value:AE,validator:B,supercedes:[As,AG]},A={key:AP,value:["tl","tr"]},u={key:a,value:true,validator:AN.isBoolean,suppressEvent:true},Z={key:At,value:250,validator:AN.isNumber,suppressEvent:true},r={key:AX,value:0,validator:AN.isNumber,suppressEvent:true},w={key:d,value:250,validator:AN.isNumber,suppressEvent:true},p={key:AD,value:true,validator:AN.isBoolean,suppressEvent:true},AO={key:h,suppressEvent:true},Ad={key:k,value:1,validator:AN.isNumber,supercedes:[AU],suppressEvent:true},N={key:Ah,value:90,validator:AN.isNumber,supercedes:[AU],suppressEvent:true},X={key:AU,value:0,validator:AN.isNumber,supercedes:[AG],suppressEvent:true},W={key:A0,value:null,validator:AN.isString,suppressEvent:true},b={key:Af,value:false,validator:AN.isBoolean,suppressEvent:true},I={key:Ae,value:true,validator:AN.isBoolean,suppressEvent:true,supercedes:[As]},Aj={key:Ap,value:false,validator:AN.isBoolean};
YAHOO.lang.extend(s,AC,{CSS_CLASS_NAME:"yuimenu",ITEM_TYPE:null,GROUP_TITLE_TAG_NAME:"h6",OFF_SCREEN_POSITION:"-999em",_useHideDelay:false,_bHandledMouseOverEvent:false,_bHandledMouseOutEvent:false,_aGroupTitleElements:null,_aItemGroups:null,_aListElements:null,_nCurrentMouseX:0,_bStopMouseEventHandlers:false,_sClassName:null,lazyLoad:false,itemData:null,activeItem:null,parent:null,srcElement:null,init:function(A5,A4){this._aItemGroups=[];this._aListElements=[];this._aGroupTitleElements=[];if(!this.ITEM_TYPE){this.ITEM_TYPE=YAHOO.widget.MenuItem;}var A3;if(AN.isString(A5)){A3=g.get(A5);}else{if(A5.tagName){A3=A5;}}if(A3&&A3.tagName){switch(A3.tagName.toUpperCase()){case H:this.srcElement=A3;if(!A3.id){A3.setAttribute(Ak,g.generateId());}s.superclass.init.call(this,A3);this.beforeInitEvent.fire(s);break;case AI:this.srcElement=A3;s.superclass.init.call(this,g.generateId());this.beforeInitEvent.fire(s);break;}}else{s.superclass.init.call(this,A5);this.beforeInitEvent.fire(s);}if(this.element){g.addClass(this.element,this.CSS_CLASS_NAME);this.initEvent.subscribe(this._onInit);this.beforeRenderEvent.subscribe(this._onBeforeRender);this.renderEvent.subscribe(this._onRender);this.beforeShowEvent.subscribe(this._onBeforeShow);this.hideEvent.subscribe(this._onHide);this.showEvent.subscribe(this._onShow);this.beforeHideEvent.subscribe(this._onBeforeHide);this.mouseOverEvent.subscribe(this._onMouseOver);this.mouseOutEvent.subscribe(this._onMouseOut);this.clickEvent.subscribe(this._onClick);this.keyDownEvent.subscribe(this._onKeyDown);this.keyPressEvent.subscribe(this._onKeyPress);this.blurEvent.subscribe(this._onBlur);if((Aq.gecko&&Aq.gecko<1.9)||Aq.webkit){this.cfg.subscribeToConfigEvent(R,this._onYChange);}if(A4){this.cfg.applyConfig(A4,true);}A1.addMenu(this);this.initEvent.fire(s);}},_initSubTree:function(){var A4=this.srcElement,A3,A6,A9,BA,A8,A7,A5;if(A4){A3=(A4.tagName&&A4.tagName.toUpperCase());if(A3==H){BA=this.body.firstChild;if(BA){A6=0;A9=this.GROUP_TITLE_TAG_NAME.toUpperCase();do{if(BA&&BA.tagName){switch(BA.tagName.toUpperCase()){case A9:this._aGroupTitleElements[A6]=BA;break;case Av:this._aListElements[A6]=BA;this._aItemGroups[A6]=[];A6++;break;}}}while((BA=BA.nextSibling));if(this._aListElements[0]){g.addClass(this._aListElements[0],AK);}}}BA=null;if(A3){switch(A3){case H:A8=this._aListElements;A7=A8.length;if(A7>0){A5=A7-1;do{BA=A8[A5].firstChild;if(BA){do{if(BA&&BA.tagName&&BA.tagName.toUpperCase()==l){this.addItem(new this.ITEM_TYPE(BA,{parent:this}),A5);}}while((BA=BA.nextSibling));}}while(A5--);}break;case AI:BA=A4.firstChild;do{if(BA&&BA.tagName){switch(BA.tagName.toUpperCase()){case i:case Ax:this.addItem(new this.ITEM_TYPE(BA,{parent:this}));break;}}}while((BA=BA.nextSibling));break;}}}},_getFirstEnabledItem:function(){var A3=this.getItems(),A7=A3.length,A6,A5;for(var A4=0;A4<A7;A4++){A6=A3[A4];if(A6&&!A6.cfg.getProperty(Af)&&A6.element.style.display!=AY){A5=A6;break;}}return A5;},_addItemToGroup:function(A8,A9,BD){var BB,BE,A6,BC,A7,A4,A5,BA;function A3(BF,BG){return(BF[BG]||A3(BF,(BG+1)));}if(A9 instanceof this.ITEM_TYPE){BB=A9;BB.parent=this;}else{if(AN.isString(A9)){BB=new this.ITEM_TYPE(A9,{parent:this});}else{if(AN.isObject(A9)){A9.parent=this;BB=new this.ITEM_TYPE(A9.text,A9);}}}if(BB){if(BB.cfg.getProperty(z)){this.activeItem=BB;}BE=AN.isNumber(A8)?A8:0;A6=this._getItemGroup(BE);if(!A6){A6=this._createItemGroup(BE);}if(AN.isNumber(BD)){A7=(BD>=A6.length);if(A6[BD]){A6.splice(BD,0,BB);}else{A6[BD]=BB;}BC=A6[BD];if(BC){if(A7&&(!BC.element.parentNode||BC.element.parentNode.nodeType==11)){this._aListElements[BE].appendChild(BC.element);}else{A4=A3(A6,(BD+1));if(A4&&(!BC.element.parentNode||BC.element.parentNode.nodeType==11)){this._aListElements[BE].insertBefore(BC.element,A4.element);}}BC.parent=this;this._subscribeToItemEvents(BC);this._configureSubmenu(BC);this._updateItemProperties(BE);this.itemAddedEvent.fire(BC);this.changeContentEvent.fire();BA=BC;}}else{A5=A6.length;A6[A5]=BB;BC=A6[A5];if(BC){if(!g.isAncestor(this._aListElements[BE],BC.element)){this._aListElements[BE].appendChild(BC.element);}BC.element.setAttribute(Ar,BE);BC.element.setAttribute(j,A5);BC.parent=this;BC.index=A5;BC.groupIndex=BE;this._subscribeToItemEvents(BC);this._configureSubmenu(BC);if(A5===0){g.addClass(BC.element,AK);}this.itemAddedEvent.fire(BC);this.changeContentEvent.fire();BA=BC;}}}return BA;},_removeItemFromGroupByIndex:function(A6,A4){var A5=AN.isNumber(A6)?A6:0,A7=this._getItemGroup(A5),A9,A8,A3;if(A7){A9=A7.splice(A4,1);A8=A9[0];if(A8){this._updateItemProperties(A5);if(A7.length===0){A3=this._aListElements[A5];if(this.body&&A3){this.body.removeChild(A3);}this._aItemGroups.splice(A5,1);this._aListElements.splice(A5,1);A3=this._aListElements[0];if(A3){g.addClass(A3,AK);}}this.itemRemovedEvent.fire(A8);this.changeContentEvent.fire();}}return A8;},_removeItemFromGroupByValue:function(A6,A3){var A8=this._getItemGroup(A6),A9,A7,A5,A4;if(A8){A9=A8.length;A7=-1;if(A9>0){A4=A9-1;do{if(A8[A4]==A3){A7=A4;break;}}while(A4--);if(A7>-1){A5=this._removeItemFromGroupByIndex(A6,A7);}}}return A5;},_updateItemProperties:function(A4){var A5=this._getItemGroup(A4),A8=A5.length,A7,A6,A3;if(A8>0){A3=A8-1;do{A7=A5[A3];if(A7){A6=A7.element;A7.index=A3;A7.groupIndex=A4;A6.setAttribute(Ar,A4);A6.setAttribute(j,A3);g.removeClass(A6,AK);}}while(A3--);if(A6){g.addClass(A6,AK);}}},_createItemGroup:function(A5){var A3,A4;if(!this._aItemGroups[A5]){this._aItemGroups[A5]=[];A3=document.createElement(L);this._aListElements[A5]=A3;A4=this._aItemGroups[A5];}return A4;},_getItemGroup:function(A5){var A3=AN.isNumber(A5)?A5:0,A6=this._aItemGroups,A4;if(A3 in A6){A4=A6[A3];}return A4;},_configureSubmenu:function(A3){var A4=A3.cfg.getProperty(O);if(A4){this.cfg.configChangedEvent.subscribe(this._onParentMenuConfigChange,A4,true);this.renderEvent.subscribe(this._onParentMenuRender,A4,true);}},_subscribeToItemEvents:function(A3){A3.destroyEvent.subscribe(this._onMenuItemDestroy,A3,this);A3.cfg.configChangedEvent.subscribe(this._onMenuItemConfigChange,A3,this);
},_onVisibleChange:function(A5,A4){var A3=A4[0];if(A3){g.addClass(this.element,As);}else{g.removeClass(this.element,As);}},_cancelHideDelay:function(){var A3=this.getRoot()._hideDelayTimer;if(A3){A3.cancel();}},_execHideDelay:function(){this._cancelHideDelay();var A3=this.getRoot();A3._hideDelayTimer=AN.later(A3.cfg.getProperty(AX),this,function(){if(A3.activeItem){if(A3.hasFocus()){A3.activeItem.focus();}A3.clearActiveItem();}if(A3==this&&!(this instanceof YAHOO.widget.MenuBar)&&this.cfg.getProperty(Ab)==AE){this.hide();}});},_cancelShowDelay:function(){var A3=this.getRoot()._showDelayTimer;if(A3){A3.cancel();}},_execSubmenuHideDelay:function(A5,A4,A3){A5._submenuHideDelayTimer=AN.later(50,this,function(){if(this._nCurrentMouseX>(A4+10)){A5._submenuHideDelayTimer=AN.later(A3,A5,function(){this.hide();});}else{A5.hide();}});},_disableScrollHeader:function(){if(!this._bHeaderDisabled){g.addClass(this.header,P);this._bHeaderDisabled=true;}},_disableScrollFooter:function(){if(!this._bFooterDisabled){g.addClass(this.footer,E);this._bFooterDisabled=true;}},_enableScrollHeader:function(){if(this._bHeaderDisabled){g.removeClass(this.header,P);this._bHeaderDisabled=false;}},_enableScrollFooter:function(){if(this._bFooterDisabled){g.removeClass(this.footer,E);this._bFooterDisabled=false;}},_onMouseOver:function(BF,A8){var BG=A8[0],BC=A8[1],A3=AB.getTarget(BG),A7=this.getRoot(),BE=this._submenuHideDelayTimer,A4,A6,BB,A5,BA,A9;var BD=function(){if(this.parent.cfg.getProperty(z)){this.show();}};if(!this._bStopMouseEventHandlers){if(!this._bHandledMouseOverEvent&&(A3==this.element||g.isAncestor(this.element,A3))){if(this._useHideDelay){this._cancelHideDelay();}this._nCurrentMouseX=0;AB.on(this.element,c,this._onMouseMove,this,true);if(!(BC&&g.isAncestor(BC.element,AB.getRelatedTarget(BG)))){this.clearActiveItem();}if(this.parent&&BE){BE.cancel();this.parent.cfg.setProperty(z,true);A4=this.parent.parent;A4._bHandledMouseOutEvent=true;A4._bHandledMouseOverEvent=false;}this._bHandledMouseOverEvent=true;this._bHandledMouseOutEvent=false;}if(BC&&!BC.handledMouseOverEvent&&!BC.cfg.getProperty(Af)&&(A3==BC.element||g.isAncestor(BC.element,A3))){A6=this.cfg.getProperty(At);BB=(A6>0);if(BB){this._cancelShowDelay();}A5=this.activeItem;if(A5){A5.cfg.setProperty(z,false);}BA=BC.cfg;BA.setProperty(z,true);if(this.hasFocus()||A7._hasFocus){BC.focus();A7._hasFocus=false;}if(this.cfg.getProperty(a)){A9=BA.getProperty(O);if(A9){if(BB){A7._showDelayTimer=AN.later(A7.cfg.getProperty(At),A9,BD);}else{A9.show();}}}BC.handledMouseOverEvent=true;BC.handledMouseOutEvent=false;}}},_onMouseOut:function(BB,A5){var BC=A5[0],A9=A5[1],A6=AB.getRelatedTarget(BC),BA=false,A8,A7,A3,A4;if(!this._bStopMouseEventHandlers){if(A9&&!A9.cfg.getProperty(Af)){A8=A9.cfg;A7=A8.getProperty(O);if(A7&&(A6==A7.element||g.isAncestor(A7.element,A6))){BA=true;}if(!A9.handledMouseOutEvent&&((A6!=A9.element&&!g.isAncestor(A9.element,A6))||BA)){if(!BA){A9.cfg.setProperty(z,false);if(A7){A3=this.cfg.getProperty(d);A4=this.cfg.getProperty(At);if(!(this instanceof YAHOO.widget.MenuBar)&&A3>0&&A4>=A3){this._execSubmenuHideDelay(A7,AB.getPageX(BC),A3);}else{A7.hide();}}}A9.handledMouseOutEvent=true;A9.handledMouseOverEvent=false;}}if(!this._bHandledMouseOutEvent&&((A6!=this.element&&!g.isAncestor(this.element,A6))||BA)){if(this._useHideDelay){this._execHideDelay();}AB.removeListener(this.element,c,this._onMouseMove);this._nCurrentMouseX=AB.getPageX(BC);this._bHandledMouseOutEvent=true;this._bHandledMouseOverEvent=false;}}},_onMouseMove:function(A4,A3){if(!this._bStopMouseEventHandlers){this._nCurrentMouseX=AB.getPageX(A4);}},_onClick:function(BE,A5){var BF=A5[0],A9=A5[1],BB=false,A7,BC,A4,A3,A8,BA,BD;var A6=function(){if(!((Aq.gecko&&this.platform==Y)&&BF.button>0)){A4=this.getRoot();if(A4 instanceof YAHOO.widget.MenuBar||A4.cfg.getProperty(Ab)==C){A4.clearActiveItem();}else{A4.hide();}}};if(A9){if(A9.cfg.getProperty(Af)){AB.preventDefault(BF);A6.call(this);}else{A7=A9.cfg.getProperty(O);A8=A9.cfg.getProperty(Q);if(A8){BA=A8.indexOf(M);BD=A8.length;if(BA!=-1){A8=A8.substr(BA,BD);BD=A8.length;if(BD>1){A3=A8.substr(1,BD);BC=YAHOO.widget.MenuManager.getMenu(A3);if(BC){BB=(this.getRoot()===BC.getRoot());}}else{if(BD===1){BB=true;}}}}if(BB&&!A9.cfg.getProperty(V)){AB.preventDefault(BF);if(Aq.webkit){A9.focus();}else{A9.focusEvent.fire();}}if(!A7&&!this.cfg.getProperty(Ap)){A6.call(this);}}}},_onKeyDown:function(BH,BB){var BE=BB[0],BD=BB[1],BA,BF,A4,A8,BI,A3,BK,A7,BG,A6,BC,BJ,A9;if(this._useHideDelay){this._cancelHideDelay();}function A5(){this._bStopMouseEventHandlers=true;AN.later(10,this,function(){this._bStopMouseEventHandlers=false;});}if(BD&&!BD.cfg.getProperty(Af)){BF=BD.cfg;A4=this.parent;switch(BE.keyCode){case 38:case 40:BI=(BE.keyCode==38)?BD.getPreviousEnabledSibling():BD.getNextEnabledSibling();if(BI){this.clearActiveItem();BI.cfg.setProperty(z,true);BI.focus();if(this.cfg.getProperty(AU)>0){A3=this.body;BK=A3.scrollTop;A7=A3.offsetHeight;BG=this.getItems();A6=BG.length-1;BC=BI.element.offsetTop;if(BE.keyCode==40){if(BC>=(A7+BK)){A3.scrollTop=BC-A7;}else{if(BC<=BK){A3.scrollTop=0;}}if(BI==BG[A6]){A3.scrollTop=BI.element.offsetTop;}}else{if(BC<=BK){A3.scrollTop=BC-BI.element.offsetHeight;}else{if(BC>=(BK+A7)){A3.scrollTop=BC;}}if(BI==BG[0]){A3.scrollTop=0;}}BK=A3.scrollTop;BJ=A3.scrollHeight-A3.offsetHeight;if(BK===0){this._disableScrollHeader();this._enableScrollFooter();}else{if(BK==BJ){this._enableScrollHeader();this._disableScrollFooter();}else{this._enableScrollHeader();this._enableScrollFooter();}}}}AB.preventDefault(BE);A5();break;case 39:BA=BF.getProperty(O);if(BA){if(!BF.getProperty(z)){BF.setProperty(z,true);}BA.show();BA.setInitialFocus();BA.setInitialSelection();}else{A8=this.getRoot();if(A8 instanceof YAHOO.widget.MenuBar){BI=A8.activeItem.getNextEnabledSibling();if(BI){A8.clearActiveItem();BI.cfg.setProperty(z,true);BA=BI.cfg.getProperty(O);if(BA){BA.show();BA.setInitialFocus();}else{BI.focus();}}}}AB.preventDefault(BE);A5();break;case 37:if(A4){A9=A4.parent;
if(A9 instanceof YAHOO.widget.MenuBar){BI=A9.activeItem.getPreviousEnabledSibling();if(BI){A9.clearActiveItem();BI.cfg.setProperty(z,true);BA=BI.cfg.getProperty(O);if(BA){BA.show();BA.setInitialFocus();}else{BI.focus();}}}else{this.hide();A4.focus();}}AB.preventDefault(BE);A5();break;}}if(BE.keyCode==27){if(this.cfg.getProperty(Ab)==AE){this.hide();if(this.parent){this.parent.focus();}}else{if(this.activeItem){BA=this.activeItem.cfg.getProperty(O);if(BA&&BA.cfg.getProperty(As)){BA.hide();this.activeItem.focus();}else{this.activeItem.blur();this.activeItem.cfg.setProperty(z,false);}}}AB.preventDefault(BE);}},_onKeyPress:function(A5,A4){var A3=A4[0];if(A3.keyCode==40||A3.keyCode==38){AB.preventDefault(A3);}},_onBlur:function(A4,A3){if(this._hasFocus){this._hasFocus=false;}},_onYChange:function(A4,A3){var A6=this.parent,A8,A5,A7;if(A6){A8=A6.parent.body.scrollTop;if(A8>0){A7=(this.cfg.getProperty(R)-A8);g.setY(this.element,A7);A5=this.iframe;if(A5){g.setY(A5,A7);}this.cfg.setProperty(R,A7,true);}}},_onScrollTargetMouseOver:function(A9,BC){var BB=this._bodyScrollTimer;if(BB){BB.cancel();}this._cancelHideDelay();var A5=AB.getTarget(A9),A7=this.body,A6=this.cfg.getProperty(k),A3,A4;function BA(){var BD=A7.scrollTop;if(BD<A3){A7.scrollTop=(BD+A6);this._enableScrollHeader();}else{A7.scrollTop=A3;this._bodyScrollTimer.cancel();this._disableScrollFooter();}}function A8(){var BD=A7.scrollTop;if(BD>0){A7.scrollTop=(BD-A6);this._enableScrollFooter();}else{A7.scrollTop=0;this._bodyScrollTimer.cancel();this._disableScrollHeader();}}if(g.hasClass(A5,Ay)){A4=A8;}else{A3=A7.scrollHeight-A7.offsetHeight;A4=BA;}this._bodyScrollTimer=AN.later(10,this,A4,null,true);},_onScrollTargetMouseOut:function(A5,A3){var A4=this._bodyScrollTimer;if(A4){A4.cancel();}this._cancelHideDelay();},_onInit:function(A4,A3){this.cfg.subscribeToConfigEvent(As,this._onVisibleChange);var A5=!this.parent,A6=this.lazyLoad;if(((A5&&!A6)||(A5&&(this.cfg.getProperty(As)||this.cfg.getProperty(Ab)==C))||(!A5&&!A6))&&this.getItemGroups().length===0){if(this.srcElement){this._initSubTree();}if(this.itemData){this.addItems(this.itemData);}}else{if(A6){this.cfg.fireQueue();}}},_onBeforeRender:function(A6,A5){var A7=this.element,BA=this._aListElements.length,A4=true,A9=0,A3,A8;if(BA>0){do{A3=this._aListElements[A9];if(A3){if(A4){g.addClass(A3,AK);A4=false;}if(!g.isAncestor(A7,A3)){this.appendToBody(A3);}A8=this._aGroupTitleElements[A9];if(A8){if(!g.isAncestor(A7,A8)){A3.parentNode.insertBefore(A8,A3);}g.addClass(A3,D);}}A9++;}while(A9<BA);}},_onRender:function(A4,A3){if(this.cfg.getProperty(Ab)==AE){if(!this.cfg.getProperty(As)){this.positionOffScreen();}}},_onBeforeShow:function(A5,A4){var A7,BA,A6,A8=this.cfg.getProperty(h);if(this.lazyLoad&&this.getItemGroups().length===0){if(this.srcElement){this._initSubTree();}if(this.itemData){if(this.parent&&this.parent.parent&&this.parent.parent.srcElement&&this.parent.parent.srcElement.tagName.toUpperCase()==AI){A7=this.itemData.length;for(BA=0;BA<A7;BA++){if(this.itemData[BA].tagName){this.addItem((new this.ITEM_TYPE(this.itemData[BA])));}}}else{this.addItems(this.itemData);}}A6=this.srcElement;if(A6){if(A6.tagName.toUpperCase()==AI){if(g.inDocument(A6)){this.render(A6.parentNode);}else{this.render(A8);}}else{this.render();}}else{if(this.parent){this.render(this.parent.element);}else{this.render(A8);}}}var A9=this.parent,A3;if(!A9&&this.cfg.getProperty(Ab)==AE){this.cfg.refireEvent(f);}if(A9){A3=A9.parent.cfg.getProperty(AP);this.cfg.setProperty(q,[A9.element,A3[0],A3[1]]);this.align();}},getConstrainedY:function(BF){var BQ=this,BM=BQ.cfg.getProperty(q),BT=BQ.cfg.getProperty(AU),BP,BE={"trbr":true,"tlbl":true,"bltl":true,"brtr":true},A8=(BM&&BE[BM[1]+BM[2]]),BA=BQ.element,BU=BA.offsetHeight,BO=AC.VIEWPORT_OFFSET,BJ=g.getViewportHeight(),BN=g.getDocumentScrollTop(),BK=(BQ.cfg.getProperty(Ah)+BO<BJ),BS,BB,BH,BI,BD=false,BC,A5,BG=BN+BO,A7=BN+BJ-BU-BO,A3=BF;var A9=function(){var BV;if((BQ.cfg.getProperty(R)-BN)>BH){BV=(BH-BU);}else{BV=(BH+BI);}BQ.cfg.setProperty(R,(BV+BN),true);return BV;};var A6=function(){if((BQ.cfg.getProperty(R)-BN)>BH){return(A5-BO);}else{return(BC-BO);}};var BL=function(){var BV;if((BQ.cfg.getProperty(R)-BN)>BH){BV=(BH+BI);}else{BV=(BH-BA.offsetHeight);}BQ.cfg.setProperty(R,(BV+BN),true);};var A4=function(){BQ._setScrollHeight(this.cfg.getProperty(AU));BQ.hideEvent.unsubscribe(A4);};var BR=function(){var BY=A6(),BV=(BQ.getItems().length>0),BX,BW;if(BU>BY){BX=BV?BQ.cfg.getProperty(Ah):BU;if((BY>BX)&&BV){BP=BY;}else{BP=BT;}BQ._setScrollHeight(BP);BQ.hideEvent.subscribe(A4);BL();if(BY<BX){if(BD){A9();}else{A9();BD=true;BW=BR();}}}else{if(BP&&(BP!==BT)){BQ._setScrollHeight(BT);BQ.hideEvent.subscribe(A4);BL();}}return BW;};if(BF<BG||BF>A7){if(BK){if(BQ.cfg.getProperty(A2)&&A8){BB=BM[0];BI=BB.offsetHeight;BH=(g.getY(BB)-BN);BC=BH;A5=(BJ-(BH+BI));BR();A3=BQ.cfg.getProperty(R);}else{if(!(BQ instanceof YAHOO.widget.MenuBar)&&BU>=BJ){BS=(BJ-(BO*2));if(BS>BQ.cfg.getProperty(Ah)){BQ._setScrollHeight(BS);BQ.hideEvent.subscribe(A4);BL();A3=BQ.cfg.getProperty(R);}}else{if(BF<BG){A3=BG;}else{if(BF>A7){A3=A7;}}}}}else{A3=BO+BN;}}return A3;},_onHide:function(A4,A3){if(this.cfg.getProperty(Ab)===AE){this.positionOffScreen();}},_onShow:function(BB,A9){var A3=this.parent,A5,A6,A8,A4;function A7(BD){var BC;if(BD.type==Ai||(BD.type==Ac&&BD.keyCode==27)){BC=AB.getTarget(BD);if(BC!=A5.element||!g.isAncestor(A5.element,BC)){A5.cfg.setProperty(a,false);AB.removeListener(document,Ai,A7);AB.removeListener(document,Ac,A7);}}}function BA(BD,BC,BE){this.cfg.setProperty(U,v);this.hideEvent.unsubscribe(BA,BE);}if(A3){A5=A3.parent;if(!A5.cfg.getProperty(a)&&(A5 instanceof YAHOO.widget.MenuBar||A5.cfg.getProperty(Ab)==C)){A5.cfg.setProperty(a,true);AB.on(document,Ai,A7);AB.on(document,Ac,A7);}if((this.cfg.getProperty("x")<A5.cfg.getProperty("x"))&&(Aq.gecko&&Aq.gecko<1.9)&&!this.cfg.getProperty(U)){A6=this.element;A8=A6.offsetWidth;A6.style.width=A8+AR;A4=(A8-(A6.offsetWidth-A8))+AR;this.cfg.setProperty(U,A4);this.hideEvent.subscribe(BA,A4);
}}},_onBeforeHide:function(A5,A4){var A3=this.activeItem,A7=this.getRoot(),A8,A6;if(A3){A8=A3.cfg;A8.setProperty(z,false);A6=A8.getProperty(O);if(A6){A6.hide();}}if(Aq.ie&&this.cfg.getProperty(Ab)===AE&&this.parent){A7._hasFocus=this.hasFocus();}if(A7==this){A7.blur();}},_onParentMenuConfigChange:function(A4,A3,A7){var A5=A3[0][0],A6=A3[0][1];switch(A5){case AG:case x:case AX:case At:case d:case AD:case Aw:case A0:case k:case AU:case Ah:case AF:case Ae:case A2:A7.cfg.setProperty(A5,A6);break;case AP:if(!(this.parent.parent instanceof YAHOO.widget.MenuBar)){A7.cfg.setProperty(A5,A6);}break;}},_onParentMenuRender:function(A4,A3,A9){var A6=A9.parent.parent,A5=A6.cfg,A7={constraintoviewport:A5.getProperty(x),xy:[0,0],clicktohide:A5.getProperty(AD),effect:A5.getProperty(Aw),showdelay:A5.getProperty(At),hidedelay:A5.getProperty(AX),submenuhidedelay:A5.getProperty(d),classname:A5.getProperty(A0),scrollincrement:A5.getProperty(k),maxheight:A5.getProperty(AU),minscrollheight:A5.getProperty(Ah),iframe:A5.getProperty(AG),shadow:A5.getProperty(Ae),preventcontextoverlap:A5.getProperty(A2),monitorresize:A5.getProperty(AF)},A8;if(!(A6 instanceof YAHOO.widget.MenuBar)){A7[AP]=A5.getProperty(AP);}A9.cfg.applyConfig(A7);if(!this.lazyLoad){A8=this.parent.element;if(this.element.parentNode==A8){this.render();}else{this.render(A8);}}},_onMenuItemDestroy:function(A5,A4,A3){this._removeItemFromGroupByValue(A3.groupIndex,A3);},_onMenuItemConfigChange:function(A5,A4,A3){var A7=A4[0][0],A8=A4[0][1],A6;switch(A7){case z:if(A8===true){this.activeItem=A3;}break;case O:A6=A4[0][1];if(A6){this._configureSubmenu(A3);}break;}},configVisible:function(A5,A4,A6){var A3,A7;if(this.cfg.getProperty(Ab)==AE){s.superclass.configVisible.call(this,A5,A4,A6);}else{A3=A4[0];A7=g.getStyle(this.element,AW);g.setStyle(this.element,J,As);if(A3){if(A7!=AV){this.beforeShowEvent.fire();g.setStyle(this.element,AW,AV);this.showEvent.fire();}}else{if(A7==AV){this.beforeHideEvent.fire();g.setStyle(this.element,AW,AY);this.hideEvent.fire();}}}},configPosition:function(A5,A4,A8){var A7=this.element,A6=A4[0]==C?C:AA,A9=this.cfg,A3;g.setStyle(A7,Ab,A6);if(A6==C){g.setStyle(A7,AW,AV);A9.setProperty(As,true);}else{g.setStyle(A7,J,AM);}if(A6==AA){A3=A9.getProperty(AT);if(!A3||A3===0){A9.setProperty(AT,1);}}},configIframe:function(A4,A3,A5){if(this.cfg.getProperty(Ab)==AE){s.superclass.configIframe.call(this,A4,A3,A5);}},configHideDelay:function(A4,A3,A5){var A6=A3[0];this._useHideDelay=(A6>0);},configContainer:function(A4,A3,A6){var A5=A3[0];if(AN.isString(A5)){this.cfg.setProperty(h,g.get(A5),true);}},_clearSetWidthFlag:function(){this._widthSetForScroll=false;this.cfg.unsubscribeFromConfigEvent(U,this._clearSetWidthFlag);},_setScrollHeight:function(BE){var BA=BE,A9=false,BF=false,A6,A7,BD,A4,BC,BG,A3,BB,A8,A5;if(this.getItems().length>0){A6=this.element;A7=this.body;BD=this.header;A4=this.footer;BC=this._onScrollTargetMouseOver;BG=this._onScrollTargetMouseOut;A3=this.cfg.getProperty(Ah);if(BA>0&&BA<A3){BA=A3;}g.setStyle(A7,Am,v);g.removeClass(A7,m);A7.scrollTop=0;BF=((Aq.gecko&&Aq.gecko<1.9)||Aq.ie);if(BA>0&&BF&&!this.cfg.getProperty(U)){A8=A6.offsetWidth;A6.style.width=A8+AR;A5=(A8-(A6.offsetWidth-A8))+AR;this.cfg.unsubscribeFromConfigEvent(U,this._clearSetWidthFlag);this.cfg.setProperty(U,A5);this._widthSetForScroll=true;this.cfg.subscribeToConfigEvent(U,this._clearSetWidthFlag);}if(BA>0&&(!BD&&!A4)){this.setHeader(AL);this.setFooter(AL);BD=this.header;A4=this.footer;g.addClass(BD,T);g.addClass(A4,y);A6.insertBefore(BD,A7);A6.appendChild(A4);}BB=BA;if(BD&&A4){BB=(BB-(BD.offsetHeight+A4.offsetHeight));}if((BB>0)&&(A7.offsetHeight>BA)){g.addClass(A7,m);g.setStyle(A7,Am,(BB+AR));if(!this._hasScrollEventHandlers){AB.on(BD,Ag,BC,this,true);AB.on(BD,G,BG,this,true);AB.on(A4,Ag,BC,this,true);AB.on(A4,G,BG,this,true);this._hasScrollEventHandlers=true;}this._disableScrollHeader();this._enableScrollFooter();A9=true;}else{if(BD&&A4){if(this._widthSetForScroll){this._widthSetForScroll=false;this.cfg.unsubscribeFromConfigEvent(U,this._clearSetWidthFlag);this.cfg.setProperty(U,v);}this._enableScrollHeader();this._enableScrollFooter();if(this._hasScrollEventHandlers){AB.removeListener(BD,Ag,BC);AB.removeListener(BD,G,BG);AB.removeListener(A4,Ag,BC);AB.removeListener(A4,G,BG);this._hasScrollEventHandlers=false;}A6.removeChild(BD);A6.removeChild(A4);this.header=null;this.footer=null;A9=true;}}if(A9){this.cfg.refireEvent(AG);this.cfg.refireEvent(Ae);}}},_setMaxHeight:function(A4,A3,A5){this._setScrollHeight(A5);this.renderEvent.unsubscribe(this._setMaxHeight);},configMaxHeight:function(A4,A3,A5){var A6=A3[0];if(this.lazyLoad&&!this.body&&A6>0){this.renderEvent.subscribe(this._setMaxHeight,A6,this);}else{this._setScrollHeight(A6);}},configClassName:function(A5,A4,A6){var A3=A4[0];if(this._sClassName){g.removeClass(this.element,this._sClassName);}g.addClass(this.element,A3);this._sClassName=A3;},_onItemAdded:function(A4,A3){var A5=A3[0];if(A5){A5.cfg.setProperty(Af,true);}},configDisabled:function(A5,A4,A8){var A7=A4[0],A3=this.getItems(),A9,A6;if(AN.isArray(A3)){A9=A3.length;if(A9>0){A6=A9-1;do{A3[A6].cfg.setProperty(Af,A7);}while(A6--);}if(A7){this.clearActiveItem(true);g.addClass(this.element,Af);this.itemAddedEvent.subscribe(this._onItemAdded);}else{g.removeClass(this.element,Af);this.itemAddedEvent.unsubscribe(this._onItemAdded);}}},configShadow:function(BB,A5,BA){var A9=function(){var BE=this.element,BD=this._shadow;if(BD&&BE){if(BD.style.width&&BD.style.height){BD.style.width=v;BD.style.height=v;}BD.style.width=(BE.offsetWidth+6)+AR;BD.style.height=(BE.offsetHeight+1)+AR;}};var BC=function(){this.element.appendChild(this._shadow);};var A7=function(){g.addClass(this._shadow,AH);};var A8=function(){g.removeClass(this._shadow,AH);};var A4=function(){var BE=this._shadow,BD;if(!BE){BD=this.element;if(!An){An=document.createElement(K);An.className=n;}BE=An.cloneNode(false);BD.appendChild(BE);this._shadow=BE;this.beforeShowEvent.subscribe(A7);this.beforeHideEvent.subscribe(A8);
if(Aq.ie){AN.later(0,this,function(){A9.call(this);this.syncIframe();});this.cfg.subscribeToConfigEvent(U,A9);this.cfg.subscribeToConfigEvent(Am,A9);this.cfg.subscribeToConfigEvent(AU,A9);this.changeContentEvent.subscribe(A9);Au.textResizeEvent.subscribe(A9,this,true);this.destroyEvent.subscribe(function(){Au.textResizeEvent.unsubscribe(A9,this);});}this.cfg.subscribeToConfigEvent(AU,BC);}};var A6=function(){if(this._shadow){BC.call(this);if(Aq.ie){A9.call(this);}}else{A4.call(this);}this.beforeShowEvent.unsubscribe(A6);};var A3=A5[0];if(A3&&this.cfg.getProperty(Ab)==AE){if(this.cfg.getProperty(As)){if(this._shadow){BC.call(this);if(Aq.ie){A9.call(this);}}else{A4.call(this);}}else{this.beforeShowEvent.subscribe(A6);}}},initEvents:function(){s.superclass.initEvents.call(this);var A4=Aa.length-1,A5,A3;do{A5=Aa[A4];A3=this.createEvent(A5[1]);A3.signature=F.LIST;this[A5[0]]=A3;}while(A4--);},positionOffScreen:function(){var A4=this.iframe,A5=this.element,A3=this.OFF_SCREEN_POSITION;A5.style.top=v;A5.style.left=v;if(A4){A4.style.top=A3;A4.style.left=A3;}},getRoot:function(){var A5=this.parent,A4,A3;if(A5){A4=A5.parent;A3=A4?A4.getRoot():this;}else{A3=this;}return A3;},toString:function(){var A4=Ao,A3=this.id;if(A3){A4+=(Az+A3);}return A4;},setItemGroupTitle:function(A8,A7){var A6,A5,A4,A3;if(AN.isString(A8)&&A8.length>0){A6=AN.isNumber(A7)?A7:0;A5=this._aGroupTitleElements[A6];if(A5){A5.innerHTML=A8;}else{A5=document.createElement(this.GROUP_TITLE_TAG_NAME);A5.innerHTML=A8;this._aGroupTitleElements[A6]=A5;}A4=this._aGroupTitleElements.length-1;do{if(this._aGroupTitleElements[A4]){g.removeClass(this._aGroupTitleElements[A4],AK);A3=A4;}}while(A4--);if(A3!==null){g.addClass(this._aGroupTitleElements[A3],AK);}this.changeContentEvent.fire();}},addItem:function(A3,A4){return this._addItemToGroup(A4,A3);},addItems:function(A7,A6){var A9,A3,A8,A4,A5;if(AN.isArray(A7)){A9=A7.length;A3=[];for(A4=0;A4<A9;A4++){A8=A7[A4];if(A8){if(AN.isArray(A8)){A3[A3.length]=this.addItems(A8,A4);}else{A3[A3.length]=this._addItemToGroup(A6,A8);}}}if(A3.length){A5=A3;}}return A5;},insertItem:function(A3,A4,A5){return this._addItemToGroup(A5,A3,A4);},removeItem:function(A3,A5){var A6,A4;if(!AN.isUndefined(A3)){if(A3 instanceof YAHOO.widget.MenuItem){A6=this._removeItemFromGroupByValue(A5,A3);}else{if(AN.isNumber(A3)){A6=this._removeItemFromGroupByIndex(A5,A3);}}if(A6){A6.destroy();A4=A6;}}return A4;},getItems:function(){var A6=this._aItemGroups,A4,A5,A3=[];if(AN.isArray(A6)){A4=A6.length;A5=((A4==1)?A6[0]:(Array.prototype.concat.apply(A3,A6)));}return A5;},getItemGroups:function(){return this._aItemGroups;},getItem:function(A4,A5){var A6,A3;if(AN.isNumber(A4)){A6=this._getItemGroup(A5);if(A6){A3=A6[A4];}}return A3;},getSubmenus:function(){var A4=this.getItems(),A8=A4.length,A3,A5,A7,A6;if(A8>0){A3=[];for(A6=0;A6<A8;A6++){A7=A4[A6];if(A7){A5=A7.cfg.getProperty(O);if(A5){A3[A3.length]=A5;}}}}return A3;},clearContent:function(){var A7=this.getItems(),A4=A7.length,A5=this.element,A6=this.body,BB=this.header,A3=this.footer,BA,A9,A8;if(A4>0){A8=A4-1;do{BA=A7[A8];if(BA){A9=BA.cfg.getProperty(O);if(A9){this.cfg.configChangedEvent.unsubscribe(this._onParentMenuConfigChange,A9);this.renderEvent.unsubscribe(this._onParentMenuRender,A9);}this.removeItem(BA,BA.groupIndex);}}while(A8--);}if(BB){AB.purgeElement(BB);A5.removeChild(BB);}if(A3){AB.purgeElement(A3);A5.removeChild(A3);}if(A6){AB.purgeElement(A6);A6.innerHTML=v;}this.activeItem=null;this._aItemGroups=[];this._aListElements=[];this._aGroupTitleElements=[];this.cfg.setProperty(U,null);},destroy:function(){this.clearContent();this._aItemGroups=null;this._aListElements=null;this._aGroupTitleElements=null;s.superclass.destroy.call(this);},setInitialFocus:function(){var A3=this._getFirstEnabledItem();if(A3){A3.focus();}},setInitialSelection:function(){var A3=this._getFirstEnabledItem();if(A3){A3.cfg.setProperty(z,true);}},clearActiveItem:function(A5){if(this.cfg.getProperty(At)>0){this._cancelShowDelay();}var A3=this.activeItem,A6,A4;if(A3){A6=A3.cfg;if(A5){A3.blur();this.getRoot()._hasFocus=true;}A6.setProperty(z,false);A4=A6.getProperty(O);if(A4){A4.hide();}this.activeItem=null;}},focus:function(){if(!this.hasFocus()){this.setInitialFocus();}},blur:function(){var A3;if(this.hasFocus()){A3=A1.getFocusedMenuItem();if(A3){A3.blur();}}},hasFocus:function(){return(A1.getFocusedMenu()==this.getRoot());},subscribe:function(){function A6(BB,BA,BD){var BE=BA[0],BC=BE.cfg.getProperty(O);if(BC){BC.subscribe.apply(BC,BD);}}function A9(BB,BA,BD){var BC=this.cfg.getProperty(O);if(BC){BC.subscribe.apply(BC,BD);}}s.superclass.subscribe.apply(this,arguments);s.superclass.subscribe.call(this,AS,A6,arguments);var A3=this.getItems(),A8,A7,A4,A5;if(A3){A8=A3.length;if(A8>0){A5=A8-1;do{A7=A3[A5];A4=A7.cfg.getProperty(O);if(A4){A4.subscribe.apply(A4,arguments);}else{A7.cfg.subscribeToConfigEvent(O,A9,arguments);}}while(A5--);}}},initDefaultConfig:function(){s.superclass.initDefaultConfig.call(this);var A3=this.cfg;A3.addProperty(AZ.key,{handler:this.configVisible,value:AZ.value,validator:AZ.validator});A3.addProperty(AQ.key,{handler:this.configConstrainToViewport,value:AQ.value,validator:AQ.validator,supercedes:AQ.supercedes});A3.addProperty(AJ.key,{value:AJ.value,validator:AJ.validator,supercedes:AJ.supercedes});A3.addProperty(S.key,{handler:this.configPosition,value:S.value,validator:S.validator,supercedes:S.supercedes});A3.addProperty(A.key,{value:A.value,suppressEvent:A.suppressEvent});A3.addProperty(u.key,{value:u.value,validator:u.validator,suppressEvent:u.suppressEvent});A3.addProperty(Z.key,{value:Z.value,validator:Z.validator,suppressEvent:Z.suppressEvent});A3.addProperty(r.key,{handler:this.configHideDelay,value:r.value,validator:r.validator,suppressEvent:r.suppressEvent});A3.addProperty(w.key,{value:w.value,validator:w.validator,suppressEvent:w.suppressEvent});A3.addProperty(p.key,{value:p.value,validator:p.validator,suppressEvent:p.suppressEvent});A3.addProperty(AO.key,{handler:this.configContainer,value:document.body,suppressEvent:AO.suppressEvent});
A3.addProperty(Ad.key,{value:Ad.value,validator:Ad.validator,supercedes:Ad.supercedes,suppressEvent:Ad.suppressEvent});A3.addProperty(N.key,{value:N.value,validator:N.validator,supercedes:N.supercedes,suppressEvent:N.suppressEvent});A3.addProperty(X.key,{handler:this.configMaxHeight,value:X.value,validator:X.validator,suppressEvent:X.suppressEvent,supercedes:X.supercedes});A3.addProperty(W.key,{handler:this.configClassName,value:W.value,validator:W.validator,supercedes:W.supercedes});A3.addProperty(b.key,{handler:this.configDisabled,value:b.value,validator:b.validator,suppressEvent:b.suppressEvent});A3.addProperty(I.key,{handler:this.configShadow,value:I.value,validator:I.validator});A3.addProperty(Aj.key,{value:Aj.value,validator:Aj.validator});}});})();(function(){YAHOO.widget.MenuItem=function(AS,AR){if(AS){if(AR){this.parent=AR.parent;this.value=AR.value;this.id=AR.id;}this.init(AS,AR);}};var x=YAHOO.util.Dom,j=YAHOO.widget.Module,AB=YAHOO.widget.Menu,c=YAHOO.widget.MenuItem,AK=YAHOO.util.CustomEvent,k=YAHOO.env.ua,AQ=YAHOO.lang,AL="text",O="#",Q="-",L="helptext",n="url",AH="target",A="emphasis",N="strongemphasis",b="checked",w="submenu",H="disabled",B="selected",P="hassubmenu",U="checked-disabled",AI="hassubmenu-disabled",AD="hassubmenu-selected",T="checked-selected",q="onclick",J="classname",AJ="",i="OPTION",v="OPTGROUP",K="LI",AE="href",r="SELECT",X="DIV",AN='<em class="helptext">',a="<em>",I="</em>",W="<strong>",y="</strong>",Y="preventcontextoverlap",h="obj",AG="scope",t="none",V="visible",E=" ",m="MenuItem",AA="click",D="show",M="hide",S="li",AF='<a href="#"></a>',p=[["mouseOverEvent","mouseover"],["mouseOutEvent","mouseout"],["mouseDownEvent","mousedown"],["mouseUpEvent","mouseup"],["clickEvent",AA],["keyPressEvent","keypress"],["keyDownEvent","keydown"],["keyUpEvent","keyup"],["focusEvent","focus"],["blurEvent","blur"],["destroyEvent","destroy"]],o={key:AL,value:AJ,validator:AQ.isString,suppressEvent:true},s={key:L,supercedes:[AL],suppressEvent:true},G={key:n,value:O,suppressEvent:true},AO={key:AH,suppressEvent:true},AP={key:A,value:false,validator:AQ.isBoolean,suppressEvent:true,supercedes:[AL]},d={key:N,value:false,validator:AQ.isBoolean,suppressEvent:true,supercedes:[AL]},l={key:b,value:false,validator:AQ.isBoolean,suppressEvent:true,supercedes:[H,B]},F={key:w,suppressEvent:true,supercedes:[H,B]},AM={key:H,value:false,validator:AQ.isBoolean,suppressEvent:true,supercedes:[AL,B]},f={key:B,value:false,validator:AQ.isBoolean,suppressEvent:true},u={key:q,suppressEvent:true},AC={key:J,value:null,validator:AQ.isString,suppressEvent:true},z={key:"keylistener",value:null,suppressEvent:true},C=null,e={};var Z=function(AU,AT){var AR=e[AU];if(!AR){e[AU]={};AR=e[AU];}var AS=AR[AT];if(!AS){AS=AU+Q+AT;AR[AT]=AS;}return AS;};var g=function(AR){x.addClass(this.element,Z(this.CSS_CLASS_NAME,AR));x.addClass(this._oAnchor,Z(this.CSS_LABEL_CLASS_NAME,AR));};var R=function(AR){x.removeClass(this.element,Z(this.CSS_CLASS_NAME,AR));x.removeClass(this._oAnchor,Z(this.CSS_LABEL_CLASS_NAME,AR));};c.prototype={CSS_CLASS_NAME:"yuimenuitem",CSS_LABEL_CLASS_NAME:"yuimenuitemlabel",SUBMENU_TYPE:null,_oAnchor:null,_oHelpTextEM:null,_oSubmenu:null,_oOnclickAttributeValue:null,_sClassName:null,constructor:c,index:null,groupIndex:null,parent:null,element:null,srcElement:null,value:null,browser:j.prototype.browser,id:null,init:function(AR,Ab){if(!this.SUBMENU_TYPE){this.SUBMENU_TYPE=AB;}this.cfg=new YAHOO.util.Config(this);this.initDefaultConfig();var AX=this.cfg,AY=O,AT,Aa,AZ,AS,AV,AU,AW;if(AQ.isString(AR)){this._createRootNodeStructure();AX.queueProperty(AL,AR);}else{if(AR&&AR.tagName){switch(AR.tagName.toUpperCase()){case i:this._createRootNodeStructure();AX.queueProperty(AL,AR.text);AX.queueProperty(H,AR.disabled);this.value=AR.value;this.srcElement=AR;break;case v:this._createRootNodeStructure();AX.queueProperty(AL,AR.label);AX.queueProperty(H,AR.disabled);this.srcElement=AR;this._initSubTree();break;case K:AZ=x.getFirstChild(AR);if(AZ){AY=AZ.getAttribute(AE,2);AS=AZ.getAttribute(AH);AV=AZ.innerHTML;}this.srcElement=AR;this.element=AR;this._oAnchor=AZ;AX.setProperty(AL,AV,true);AX.setProperty(n,AY,true);AX.setProperty(AH,AS,true);this._initSubTree();break;}}}if(this.element){AU=(this.srcElement||this.element).id;if(!AU){AU=this.id||x.generateId();this.element.id=AU;}this.id=AU;x.addClass(this.element,this.CSS_CLASS_NAME);x.addClass(this._oAnchor,this.CSS_LABEL_CLASS_NAME);AW=p.length-1;do{Aa=p[AW];AT=this.createEvent(Aa[1]);AT.signature=AK.LIST;this[Aa[0]]=AT;}while(AW--);if(Ab){AX.applyConfig(Ab);}AX.fireQueue();}},_createRootNodeStructure:function(){var AR,AS;if(!C){C=document.createElement(S);C.innerHTML=AF;}AR=C.cloneNode(true);AR.className=this.CSS_CLASS_NAME;AS=AR.firstChild;AS.className=this.CSS_LABEL_CLASS_NAME;this.element=AR;this._oAnchor=AS;},_initSubTree:function(){var AX=this.srcElement,AT=this.cfg,AV,AU,AS,AR,AW;if(AX.childNodes.length>0){if(this.parent.lazyLoad&&this.parent.srcElement&&this.parent.srcElement.tagName.toUpperCase()==r){AT.setProperty(w,{id:x.generateId(),itemdata:AX.childNodes});}else{AV=AX.firstChild;AU=[];do{if(AV&&AV.tagName){switch(AV.tagName.toUpperCase()){case X:AT.setProperty(w,AV);break;case i:AU[AU.length]=AV;break;}}}while((AV=AV.nextSibling));AS=AU.length;if(AS>0){AR=new this.SUBMENU_TYPE(x.generateId());AT.setProperty(w,AR);for(AW=0;AW<AS;AW++){AR.addItem((new AR.ITEM_TYPE(AU[AW])));}}}}},configText:function(Aa,AT,AV){var AS=AT[0],AU=this.cfg,AY=this._oAnchor,AR=AU.getProperty(L),AZ=AJ,AW=AJ,AX=AJ;if(AS){if(AR){AZ=AN+AR+I;}if(AU.getProperty(A)){AW=a;AX=I;}if(AU.getProperty(N)){AW=W;AX=y;}AY.innerHTML=(AW+AS+AX+AZ);}},configHelpText:function(AT,AS,AR){this.cfg.refireEvent(AL);},configURL:function(AT,AS,AR){var AV=AS[0];if(!AV){AV=O;}var AU=this._oAnchor;if(k.opera){AU.removeAttribute(AE);}AU.setAttribute(AE,AV);},configTarget:function(AU,AT,AS){var AR=AT[0],AV=this._oAnchor;if(AR&&AR.length>0){AV.setAttribute(AH,AR);}else{AV.removeAttribute(AH);}},configEmphasis:function(AT,AS,AR){var AV=AS[0],AU=this.cfg;
if(AV&&AU.getProperty(N)){AU.setProperty(N,false);}AU.refireEvent(AL);},configStrongEmphasis:function(AU,AT,AS){var AR=AT[0],AV=this.cfg;if(AR&&AV.getProperty(A)){AV.setProperty(A,false);}AV.refireEvent(AL);},configChecked:function(AT,AS,AR){var AV=AS[0],AU=this.cfg;if(AV){g.call(this,b);}else{R.call(this,b);}AU.refireEvent(AL);if(AU.getProperty(H)){AU.refireEvent(H);}if(AU.getProperty(B)){AU.refireEvent(B);}},configDisabled:function(AT,AS,AR){var AV=AS[0],AW=this.cfg,AU=AW.getProperty(w),AX=AW.getProperty(b);if(AV){if(AW.getProperty(B)){AW.setProperty(B,false);}g.call(this,H);if(AU){g.call(this,AI);}if(AX){g.call(this,U);}}else{R.call(this,H);if(AU){R.call(this,AI);}if(AX){R.call(this,U);}}},configSelected:function(AT,AS,AR){var AX=this.cfg,AW=this._oAnchor,AV=AS[0],AY=AX.getProperty(b),AU=AX.getProperty(w);if(k.opera){AW.blur();}if(AV&&!AX.getProperty(H)){g.call(this,B);if(AU){g.call(this,AD);}if(AY){g.call(this,T);}}else{R.call(this,B);if(AU){R.call(this,AD);}if(AY){R.call(this,T);}}if(this.hasFocus()&&k.opera){AW.focus();}},_onSubmenuBeforeHide:function(AU,AT){var AV=this.parent,AR;function AS(){AV._oAnchor.blur();AR.beforeHideEvent.unsubscribe(AS);}if(AV.hasFocus()){AR=AV.parent;AR.beforeHideEvent.subscribe(AS);}},configSubmenu:function(AY,AT,AW){var AV=AT[0],AU=this.cfg,AS=this.parent&&this.parent.lazyLoad,AX,AZ,AR;if(AV){if(AV instanceof AB){AX=AV;AX.parent=this;AX.lazyLoad=AS;}else{if(AQ.isObject(AV)&&AV.id&&!AV.nodeType){AZ=AV.id;AR=AV;AR.lazyload=AS;AR.parent=this;AX=new this.SUBMENU_TYPE(AZ,AR);AU.setProperty(w,AX,true);}else{AX=new this.SUBMENU_TYPE(AV,{lazyload:AS,parent:this});AU.setProperty(w,AX,true);}}if(AX){AX.cfg.setProperty(Y,true);g.call(this,P);if(AU.getProperty(n)===O){AU.setProperty(n,(O+AX.id));}this._oSubmenu=AX;if(k.opera){AX.beforeHideEvent.subscribe(this._onSubmenuBeforeHide);}}}else{R.call(this,P);if(this._oSubmenu){this._oSubmenu.destroy();}}if(AU.getProperty(H)){AU.refireEvent(H);}if(AU.getProperty(B)){AU.refireEvent(B);}},configOnClick:function(AT,AS,AR){var AU=AS[0];if(this._oOnclickAttributeValue&&(this._oOnclickAttributeValue!=AU)){this.clickEvent.unsubscribe(this._oOnclickAttributeValue.fn,this._oOnclickAttributeValue.obj);this._oOnclickAttributeValue=null;}if(!this._oOnclickAttributeValue&&AQ.isObject(AU)&&AQ.isFunction(AU.fn)){this.clickEvent.subscribe(AU.fn,((h in AU)?AU.obj:this),((AG in AU)?AU.scope:null));this._oOnclickAttributeValue=AU;}},configClassName:function(AU,AT,AS){var AR=AT[0];if(this._sClassName){x.removeClass(this.element,this._sClassName);}x.addClass(this.element,AR);this._sClassName=AR;},_dispatchClickEvent:function(){var AT=this,AS,AR;if(!AT.cfg.getProperty(H)){AS=x.getFirstChild(AT.element);if(k.ie){AS.fireEvent(q);}else{if((k.gecko&&k.gecko>=1.9)||k.opera||k.webkit){AR=document.createEvent("HTMLEvents");AR.initEvent(AA,true,true);}else{AR=document.createEvent("MouseEvents");AR.initMouseEvent(AA,true,true,window,0,0,0,0,0,false,false,false,false,0,null);}AS.dispatchEvent(AR);}}},_createKeyListener:function(AU,AT,AW){var AV=this,AS=AV.parent;var AR=new YAHOO.util.KeyListener(AS.element.ownerDocument,AW,{fn:AV._dispatchClickEvent,scope:AV,correctScope:true});if(AS.cfg.getProperty(V)){AR.enable();}AS.subscribe(D,AR.enable,null,AR);AS.subscribe(M,AR.disable,null,AR);AV._keyListener=AR;AS.unsubscribe(D,AV._createKeyListener,AW);},configKeyListener:function(AT,AS){var AV=AS[0],AU=this,AR=AU.parent;if(AU._keyData){AR.unsubscribe(D,AU._createKeyListener,AU._keyData);AU._keyData=null;}if(AU._keyListener){AR.unsubscribe(D,AU._keyListener.enable);AR.unsubscribe(M,AU._keyListener.disable);AU._keyListener.disable();AU._keyListener=null;}if(AV){AU._keyData=AV;AR.subscribe(D,AU._createKeyListener,AV,AU);}},initDefaultConfig:function(){var AR=this.cfg;AR.addProperty(o.key,{handler:this.configText,value:o.value,validator:o.validator,suppressEvent:o.suppressEvent});AR.addProperty(s.key,{handler:this.configHelpText,supercedes:s.supercedes,suppressEvent:s.suppressEvent});AR.addProperty(G.key,{handler:this.configURL,value:G.value,suppressEvent:G.suppressEvent});AR.addProperty(AO.key,{handler:this.configTarget,suppressEvent:AO.suppressEvent});AR.addProperty(AP.key,{handler:this.configEmphasis,value:AP.value,validator:AP.validator,suppressEvent:AP.suppressEvent,supercedes:AP.supercedes});AR.addProperty(d.key,{handler:this.configStrongEmphasis,value:d.value,validator:d.validator,suppressEvent:d.suppressEvent,supercedes:d.supercedes});AR.addProperty(l.key,{handler:this.configChecked,value:l.value,validator:l.validator,suppressEvent:l.suppressEvent,supercedes:l.supercedes});AR.addProperty(AM.key,{handler:this.configDisabled,value:AM.value,validator:AM.validator,suppressEvent:AM.suppressEvent});AR.addProperty(f.key,{handler:this.configSelected,value:f.value,validator:f.validator,suppressEvent:f.suppressEvent});AR.addProperty(F.key,{handler:this.configSubmenu,supercedes:F.supercedes,suppressEvent:F.suppressEvent});AR.addProperty(u.key,{handler:this.configOnClick,suppressEvent:u.suppressEvent});AR.addProperty(AC.key,{handler:this.configClassName,value:AC.value,validator:AC.validator,suppressEvent:AC.suppressEvent});AR.addProperty(z.key,{handler:this.configKeyListener,value:z.value,suppressEvent:z.suppressEvent});},getNextEnabledSibling:function(){var AU,AX,AR,AW,AV,AS;function AT(AY,AZ){return AY[AZ]||AT(AY,(AZ+1));}if(this.parent instanceof AB){AU=this.groupIndex;AX=this.parent.getItemGroups();if(this.index<(AX[AU].length-1)){AR=AT(AX[AU],(this.index+1));}else{if(AU<(AX.length-1)){AW=AU+1;}else{AW=0;}AV=AT(AX,AW);AR=AT(AV,0);}AS=(AR.cfg.getProperty(H)||AR.element.style.display==t)?AR.getNextEnabledSibling():AR;}return AS;},getPreviousEnabledSibling:function(){var AW,AY,AS,AR,AV,AU;function AX(AZ,Aa){return AZ[Aa]||AX(AZ,(Aa-1));}function AT(AZ,Aa){return AZ[Aa]?Aa:AT(AZ,(Aa+1));}if(this.parent instanceof AB){AW=this.groupIndex;AY=this.parent.getItemGroups();if(this.index>AT(AY[AW],0)){AS=AX(AY[AW],(this.index-1));}else{if(AW>AT(AY,0)){AR=AW-1;}else{AR=AY.length-1;
}AV=AX(AY,AR);AS=AX(AV,(AV.length-1));}AU=(AS.cfg.getProperty(H)||AS.element.style.display==t)?AS.getPreviousEnabledSibling():AS;}return AU;},focus:function(){var AU=this.parent,AT=this._oAnchor,AR=AU.activeItem;function AS(){try{if(!(k.ie&&!document.hasFocus())){if(AR){AR.blurEvent.fire();}AT.focus();this.focusEvent.fire();}}catch(AV){}}if(!this.cfg.getProperty(H)&&AU&&AU.cfg.getProperty(V)&&this.element.style.display!=t){AQ.later(0,this,AS);}},blur:function(){var AR=this.parent;if(!this.cfg.getProperty(H)&&AR&&AR.cfg.getProperty(V)){AQ.later(0,this,function(){try{this._oAnchor.blur();this.blurEvent.fire();}catch(AS){}},0);}},hasFocus:function(){return(YAHOO.widget.MenuManager.getFocusedMenuItem()==this);},destroy:function(){var AT=this.element,AS,AR,AV,AU;if(AT){AS=this.cfg.getProperty(w);if(AS){AS.destroy();}AR=AT.parentNode;if(AR){AR.removeChild(AT);this.destroyEvent.fire();}AU=p.length-1;do{AV=p[AU];this[AV[0]].unsubscribeAll();}while(AU--);this.cfg.configChangedEvent.unsubscribeAll();}},toString:function(){var AS=m,AR=this.id;if(AR){AS+=(E+AR);}return AS;}};AQ.augmentProto(c,YAHOO.util.EventProvider);})();(function(){var B="xy",C="mousedown",F="ContextMenu",J=" ";YAHOO.widget.ContextMenu=function(L,K){YAHOO.widget.ContextMenu.superclass.constructor.call(this,L,K);};var I=YAHOO.util.Event,E=YAHOO.env.ua,G=YAHOO.widget.ContextMenu,A={"TRIGGER_CONTEXT_MENU":"triggerContextMenu","CONTEXT_MENU":(E.opera?C:"contextmenu"),"CLICK":"click"},H={key:"trigger",suppressEvent:true};function D(L,K,M){this.cfg.setProperty(B,M);this.beforeShowEvent.unsubscribe(D,M);}YAHOO.lang.extend(G,YAHOO.widget.Menu,{_oTrigger:null,_bCancelled:false,contextEventTarget:null,triggerContextMenuEvent:null,init:function(L,K){G.superclass.init.call(this,L);this.beforeInitEvent.fire(G);if(K){this.cfg.applyConfig(K,true);}this.initEvent.fire(G);},initEvents:function(){G.superclass.initEvents.call(this);this.triggerContextMenuEvent=this.createEvent(A.TRIGGER_CONTEXT_MENU);this.triggerContextMenuEvent.signature=YAHOO.util.CustomEvent.LIST;},cancel:function(){this._bCancelled=true;},_removeEventHandlers:function(){var K=this._oTrigger;if(K){I.removeListener(K,A.CONTEXT_MENU,this._onTriggerContextMenu);if(E.opera){I.removeListener(K,A.CLICK,this._onTriggerClick);}}},_onTriggerClick:function(L,K){if(L.ctrlKey){I.stopEvent(L);}},_onTriggerContextMenu:function(M,K){var L;if(!(M.type==C&&!M.ctrlKey)){this.contextEventTarget=I.getTarget(M);this.triggerContextMenuEvent.fire(M);if(!this._bCancelled){I.stopEvent(M);YAHOO.widget.MenuManager.hideVisible();L=I.getXY(M);if(!YAHOO.util.Dom.inDocument(this.element)){this.beforeShowEvent.subscribe(D,L);}else{this.cfg.setProperty(B,L);}this.show();}this._bCancelled=false;}},toString:function(){var L=F,K=this.id;if(K){L+=(J+K);}return L;},initDefaultConfig:function(){G.superclass.initDefaultConfig.call(this);this.cfg.addProperty(H.key,{handler:this.configTrigger,suppressEvent:H.suppressEvent});},destroy:function(){this._removeEventHandlers();G.superclass.destroy.call(this);},configTrigger:function(L,K,N){var M=K[0];if(M){if(this._oTrigger){this._removeEventHandlers();}this._oTrigger=M;I.on(M,A.CONTEXT_MENU,this._onTriggerContextMenu,this,true);if(E.opera){I.on(M,A.CLICK,this._onTriggerClick,this,true);}}else{this._removeEventHandlers();}}});}());YAHOO.widget.ContextMenuItem=YAHOO.widget.MenuItem;(function(){var D=YAHOO.lang,N="static",M="dynamic,"+N,A="disabled",F="selected",B="autosubmenudisplay",G="submenu",C="visible",Q=" ",H="submenutoggleregion",P="MenuBar";YAHOO.widget.MenuBar=function(T,S){YAHOO.widget.MenuBar.superclass.constructor.call(this,T,S);};function O(T){var S=false;if(D.isString(T)){S=(M.indexOf((T.toLowerCase()))!=-1);}return S;}var R=YAHOO.util.Event,L=YAHOO.widget.MenuBar,K={key:"position",value:N,validator:O,supercedes:[C]},E={key:"submenualignment",value:["tl","bl"]},J={key:B,value:false,validator:D.isBoolean,suppressEvent:true},I={key:H,value:false,validator:D.isBoolean};D.extend(L,YAHOO.widget.Menu,{init:function(T,S){if(!this.ITEM_TYPE){this.ITEM_TYPE=YAHOO.widget.MenuBarItem;}L.superclass.init.call(this,T);this.beforeInitEvent.fire(L);if(S){this.cfg.applyConfig(S,true);}this.initEvent.fire(L);},CSS_CLASS_NAME:"yuimenubar",SUBMENU_TOGGLE_REGION_WIDTH:20,_onKeyDown:function(U,T,Y){var S=T[0],Z=T[1],W,X,V;if(Z&&!Z.cfg.getProperty(A)){X=Z.cfg;switch(S.keyCode){case 37:case 39:if(Z==this.activeItem&&!X.getProperty(F)){X.setProperty(F,true);}else{V=(S.keyCode==37)?Z.getPreviousEnabledSibling():Z.getNextEnabledSibling();if(V){this.clearActiveItem();V.cfg.setProperty(F,true);W=V.cfg.getProperty(G);if(W){W.show();W.setInitialFocus();}else{V.focus();}}}R.preventDefault(S);break;case 40:if(this.activeItem!=Z){this.clearActiveItem();X.setProperty(F,true);Z.focus();}W=X.getProperty(G);if(W){if(W.cfg.getProperty(C)){W.setInitialSelection();W.setInitialFocus();}else{W.show();W.setInitialFocus();}}R.preventDefault(S);break;}}if(S.keyCode==27&&this.activeItem){W=this.activeItem.cfg.getProperty(G);if(W&&W.cfg.getProperty(C)){W.hide();this.activeItem.focus();}else{this.activeItem.cfg.setProperty(F,false);this.activeItem.blur();}R.preventDefault(S);}},_onClick:function(e,Y,b){L.superclass._onClick.call(this,e,Y,b);var d=Y[1],T=true,S,f,U,W,Z,a,c,V;var X=function(){if(a.cfg.getProperty(C)){a.hide();}else{a.show();}};if(d&&!d.cfg.getProperty(A)){f=Y[0];U=R.getTarget(f);W=this.activeItem;Z=this.cfg;if(W&&W!=d){this.clearActiveItem();}d.cfg.setProperty(F,true);a=d.cfg.getProperty(G);if(a){S=d.element;c=YAHOO.util.Dom.getX(S);V=c+(S.offsetWidth-this.SUBMENU_TOGGLE_REGION_WIDTH);if(Z.getProperty(H)){if(R.getPageX(f)>V){X();R.preventDefault(f);T=false;}}else{X();}}}return T;},configSubmenuToggle:function(U,T){var S=T[0];if(S){this.cfg.setProperty(B,false);}},toString:function(){var T=P,S=this.id;if(S){T+=(Q+S);}return T;},initDefaultConfig:function(){L.superclass.initDefaultConfig.call(this);var S=this.cfg;S.addProperty(K.key,{handler:this.configPosition,value:K.value,validator:K.validator,supercedes:K.supercedes});
S.addProperty(E.key,{value:E.value,suppressEvent:E.suppressEvent});S.addProperty(J.key,{value:J.value,validator:J.validator,suppressEvent:J.suppressEvent});S.addProperty(I.key,{value:I.value,validator:I.validator,handler:this.configSubmenuToggle});}});}());YAHOO.widget.MenuBarItem=function(B,A){YAHOO.widget.MenuBarItem.superclass.constructor.call(this,B,A);};YAHOO.lang.extend(YAHOO.widget.MenuBarItem,YAHOO.widget.MenuItem,{init:function(B,A){if(!this.SUBMENU_TYPE){this.SUBMENU_TYPE=YAHOO.widget.Menu;}YAHOO.widget.MenuBarItem.superclass.init.call(this,B);var C=this.cfg;if(A){C.applyConfig(A,true);}C.fireQueue();},CSS_CLASS_NAME:"yuimenubaritem",CSS_LABEL_CLASS_NAME:"yuimenubaritemlabel",toString:function(){var A="MenuBarItem";if(this.cfg&&this.cfg.getProperty("text")){A+=(": "+this.cfg.getProperty("text"));}return A;}});YAHOO.register("menu",YAHOO.widget.Menu,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
YAHOO.widget.LogMsg=function(A){this.msg=this.time=this.category=this.source=this.sourceDetail=null;if(A&&(A.constructor==Object)){for(var B in A){if(A.hasOwnProperty(B)){this[B]=A[B];}}}};YAHOO.widget.LogWriter=function(A){if(!A){YAHOO.log("Could not instantiate LogWriter due to invalid source.","error","LogWriter");return;}this._source=A;};YAHOO.widget.LogWriter.prototype.toString=function(){return"LogWriter "+this._sSource;};YAHOO.widget.LogWriter.prototype.log=function(A,B){YAHOO.widget.Logger.log(A,B,this._source);};YAHOO.widget.LogWriter.prototype.getSource=function(){return this._source;};YAHOO.widget.LogWriter.prototype.setSource=function(A){if(!A){YAHOO.log("Could not set source due to invalid source.","error",this.toString());return;}else{this._source=A;}};YAHOO.widget.LogWriter.prototype._source=null;YAHOO.widget.LogReader=function(B,A){this._sName=YAHOO.widget.LogReader._index;YAHOO.widget.LogReader._index++;this._buffer=[];this._filterCheckboxes={};this._lastTime=YAHOO.widget.Logger.getStartTime();if(A&&(A.constructor==Object)){for(var C in A){if(A.hasOwnProperty(C)){this[C]=A[C];}}}this._initContainerEl(B);if(!this._elContainer){YAHOO.log("Could not instantiate LogReader due to an invalid container element "+B,"error",this.toString());return;}this._initHeaderEl();this._initConsoleEl();this._initFooterEl();this._initDragDrop();this._initCategories();this._initSources();YAHOO.widget.Logger.newLogEvent.subscribe(this._onNewLog,this);YAHOO.widget.Logger.logResetEvent.subscribe(this._onReset,this);YAHOO.widget.Logger.categoryCreateEvent.subscribe(this._onCategoryCreate,this);YAHOO.widget.Logger.sourceCreateEvent.subscribe(this._onSourceCreate,this);this._filterLogs();YAHOO.log("LogReader initialized",null,this.toString());};YAHOO.lang.augmentObject(YAHOO.widget.LogReader,{_index:0,ENTRY_TEMPLATE:(function(){var A=document.createElement("pre");YAHOO.util.Dom.addClass(A,"yui-log-entry");return A;})(),VERBOSE_TEMPLATE:"<p><span class='{category}'>{label}</span> {totalTime}ms (+{elapsedTime}) {localTime}:</p><p>{sourceAndDetail}</p><p>{message}</p>",BASIC_TEMPLATE:"<p><span class='{category}'>{label}</span> {totalTime}ms (+{elapsedTime}) {localTime}: {sourceAndDetail}: {message}</p>"});YAHOO.widget.LogReader.prototype={logReaderEnabled:true,width:null,height:null,top:null,left:null,right:null,bottom:null,fontSize:null,footerEnabled:true,verboseOutput:true,entryFormat:null,newestOnTop:true,outputBuffer:100,thresholdMax:500,thresholdMin:100,isCollapsed:false,isPaused:false,draggable:true,toString:function(){return"LogReader instance"+this._sName;},pause:function(){this.isPaused=true;this._timeout=null;this.logReaderEnabled=false;if(this._btnPause){this._btnPause.value="Resume";}},resume:function(){this.isPaused=false;this.logReaderEnabled=true;this._printBuffer();if(this._btnPause){this._btnPause.value="Pause";}},hide:function(){this._elContainer.style.display="none";},show:function(){this._elContainer.style.display="block";},collapse:function(){this._elConsole.style.display="none";if(this._elFt){this._elFt.style.display="none";}this._btnCollapse.value="Expand";this.isCollapsed=true;},expand:function(){this._elConsole.style.display="block";if(this._elFt){this._elFt.style.display="block";}this._btnCollapse.value="Collapse";this.isCollapsed=false;},getCheckbox:function(A){return this._filterCheckboxes[A];},getCategories:function(){return this._categoryFilters;},showCategory:function(B){var D=this._categoryFilters;if(D.indexOf){if(D.indexOf(B)>-1){return;}}else{for(var A=0;A<D.length;A++){if(D[A]===B){return;}}}this._categoryFilters.push(B);this._filterLogs();var C=this.getCheckbox(B);if(C){C.checked=true;}},hideCategory:function(B){var D=this._categoryFilters;for(var A=0;A<D.length;A++){if(B==D[A]){D.splice(A,1);break;}}this._filterLogs();var C=this.getCheckbox(B);if(C){C.checked=false;}},getSources:function(){return this._sourceFilters;},showSource:function(A){var D=this._sourceFilters;if(D.indexOf){if(D.indexOf(A)>-1){return;}}else{for(var B=0;B<D.length;B++){if(A==D[B]){return;}}}D.push(A);this._filterLogs();var C=this.getCheckbox(A);if(C){C.checked=true;}},hideSource:function(A){var D=this._sourceFilters;for(var B=0;B<D.length;B++){if(A==D[B]){D.splice(B,1);break;}}this._filterLogs();var C=this.getCheckbox(A);if(C){C.checked=false;}},clearConsole:function(){this._timeout=null;this._buffer=[];this._consoleMsgCount=0;var A=this._elConsole;A.innerHTML="";},setTitle:function(A){this._title.innerHTML=this.html2Text(A);},getLastTime:function(){return this._lastTime;},formatMsg:function(C){var B=YAHOO.widget.LogReader,A=this.entryFormat||(this.verboseOutput?B.VERBOSE_TEMPLATE:B.BASIC_TEMPLATE),D={category:C.category,label:C.category.substring(0,4).toUpperCase(),sourceAndDetail:C.sourceDetail?C.source+" "+C.sourceDetail:C.source,message:this.html2Text(C.msg||C.message||"")};if(C.time&&C.time.getTime){D.localTime=C.time.toLocaleTimeString?C.time.toLocaleTimeString():C.time.toString();D.elapsedTime=C.time.getTime()-this.getLastTime();D.totalTime=C.time.getTime()-YAHOO.widget.Logger.getStartTime();}var E=B.ENTRY_TEMPLATE.cloneNode(true);if(this.verboseOutput){E.className+=" yui-log-verbose";}E.innerHTML=A.replace(/\{(\w+)\}/g,function(F,G){return(G in D)?D[G]:"";});return E;},html2Text:function(A){if(A){A+="";return A.replace(/&/g,"&#38;").replace(/</g,"&#60;").replace(/>/g,"&#62;");}return"";},_sName:null,_buffer:null,_consoleMsgCount:0,_lastTime:null,_timeout:null,_filterCheckboxes:null,_categoryFilters:null,_sourceFilters:null,_elContainer:null,_elHd:null,_elCollapse:null,_btnCollapse:null,_title:null,_elConsole:null,_elFt:null,_elBtns:null,_elCategoryFilters:null,_elSourceFilters:null,_btnPause:null,_btnClear:null,_initContainerEl:function(B){B=YAHOO.util.Dom.get(B);if(B&&B.tagName&&(B.tagName.toLowerCase()=="div")){this._elContainer=B;YAHOO.util.Dom.addClass(this._elContainer,"yui-log");}else{this._elContainer=document.body.appendChild(document.createElement("div"));YAHOO.util.Dom.addClass(this._elContainer,"yui-log");
YAHOO.util.Dom.addClass(this._elContainer,"yui-log-container");var A=this._elContainer.style;if(this.width){A.width=this.width;}if(this.right){A.right=this.right;}if(this.top){A.top=this.top;}if(this.left){A.left=this.left;A.right="auto";}if(this.bottom){A.bottom=this.bottom;A.top="auto";}if(this.fontSize){A.fontSize=this.fontSize;}if(navigator.userAgent.toLowerCase().indexOf("opera")!=-1){document.body.style+="";}}},_initHeaderEl:function(){var A=this;if(this._elHd){YAHOO.util.Event.purgeElement(this._elHd,true);this._elHd.innerHTML="";}this._elHd=this._elContainer.appendChild(document.createElement("div"));this._elHd.id="yui-log-hd"+this._sName;this._elHd.className="yui-log-hd";this._elCollapse=this._elHd.appendChild(document.createElement("div"));this._elCollapse.className="yui-log-btns";this._btnCollapse=document.createElement("input");this._btnCollapse.type="button";this._btnCollapse.className="yui-log-button";this._btnCollapse.value="Collapse";this._btnCollapse=this._elCollapse.appendChild(this._btnCollapse);YAHOO.util.Event.addListener(A._btnCollapse,"click",A._onClickCollapseBtn,A);this._title=this._elHd.appendChild(document.createElement("h4"));this._title.innerHTML="Logger Console";},_initConsoleEl:function(){if(this._elConsole){YAHOO.util.Event.purgeElement(this._elConsole,true);this._elConsole.innerHTML="";}this._elConsole=this._elContainer.appendChild(document.createElement("div"));this._elConsole.className="yui-log-bd";if(this.height){this._elConsole.style.height=this.height;}},_initFooterEl:function(){var A=this;if(this.footerEnabled){if(this._elFt){YAHOO.util.Event.purgeElement(this._elFt,true);this._elFt.innerHTML="";}this._elFt=this._elContainer.appendChild(document.createElement("div"));this._elFt.className="yui-log-ft";this._elBtns=this._elFt.appendChild(document.createElement("div"));this._elBtns.className="yui-log-btns";this._btnPause=document.createElement("input");this._btnPause.type="button";this._btnPause.className="yui-log-button";this._btnPause.value="Pause";this._btnPause=this._elBtns.appendChild(this._btnPause);YAHOO.util.Event.addListener(A._btnPause,"click",A._onClickPauseBtn,A);this._btnClear=document.createElement("input");this._btnClear.type="button";this._btnClear.className="yui-log-button";this._btnClear.value="Clear";this._btnClear=this._elBtns.appendChild(this._btnClear);YAHOO.util.Event.addListener(A._btnClear,"click",A._onClickClearBtn,A);this._elCategoryFilters=this._elFt.appendChild(document.createElement("div"));this._elCategoryFilters.className="yui-log-categoryfilters";this._elSourceFilters=this._elFt.appendChild(document.createElement("div"));this._elSourceFilters.className="yui-log-sourcefilters";}},_initDragDrop:function(){if(YAHOO.util.DD&&this.draggable&&this._elHd){var A=new YAHOO.util.DD(this._elContainer);A.setHandleElId(this._elHd.id);this._elHd.style.cursor="move";}},_initCategories:function(){this._categoryFilters=[];var C=YAHOO.widget.Logger.categories;for(var A=0;A<C.length;A++){var B=C[A];this._categoryFilters.push(B);if(this._elCategoryFilters){this._createCategoryCheckbox(B);}}},_initSources:function(){this._sourceFilters=[];var C=YAHOO.widget.Logger.sources;for(var B=0;B<C.length;B++){var A=C[B];this._sourceFilters.push(A);if(this._elSourceFilters){this._createSourceCheckbox(A);}}},_createCategoryCheckbox:function(B){var A=this;if(this._elFt){var E=this._elCategoryFilters;var D=E.appendChild(document.createElement("span"));D.className="yui-log-filtergrp";var C=document.createElement("input");C.id="yui-log-filter-"+B+this._sName;C.className="yui-log-filter-"+B;C.type="checkbox";C.category=B;C=D.appendChild(C);C.checked=true;YAHOO.util.Event.addListener(C,"click",A._onCheckCategory,A);var F=D.appendChild(document.createElement("label"));F.htmlFor=C.id;F.className=B;F.innerHTML=B;this._filterCheckboxes[B]=C;}},_createSourceCheckbox:function(A){var D=this;if(this._elFt){var F=this._elSourceFilters;var E=F.appendChild(document.createElement("span"));E.className="yui-log-filtergrp";var C=document.createElement("input");C.id="yui-log-filter"+A+this._sName;C.className="yui-log-filter"+A;C.type="checkbox";C.source=A;C=E.appendChild(C);C.checked=true;YAHOO.util.Event.addListener(C,"click",D._onCheckSource,D);var B=E.appendChild(document.createElement("label"));B.htmlFor=C.id;B.className=A;B.innerHTML=A;this._filterCheckboxes[A]=C;}},_filterLogs:function(){if(this._elConsole!==null){this.clearConsole();this._printToConsole(YAHOO.widget.Logger.getStack());}},_printBuffer:function(){this._timeout=null;if(this._elConsole!==null){var B=this.thresholdMax;B=(B&&!isNaN(B))?B:500;if(this._consoleMsgCount<B){var A=[];for(var C=0;C<this._buffer.length;C++){A[C]=this._buffer[C];}this._buffer=[];this._printToConsole(A);}else{this._filterLogs();}if(!this.newestOnTop){this._elConsole.scrollTop=this._elConsole.scrollHeight;}}},_printToConsole:function(I){var B=I.length,M=document.createDocumentFragment(),P=[],Q=this.thresholdMin,C=this._sourceFilters.length,N=this._categoryFilters.length,K,H,G,F,L;if(isNaN(Q)||(Q>this.thresholdMax)){Q=0;}K=(B>Q)?(B-Q):0;for(H=K;H<B;H++){var E=false;var J=false;var O=I[H];var A=O.source;var D=O.category;for(G=0;G<C;G++){if(A==this._sourceFilters[G]){J=true;break;}}if(J){for(G=0;G<N;G++){if(D==this._categoryFilters[G]){E=true;break;}}}if(E){F=this.formatMsg(O);if(typeof F==="string"){P[P.length]=F;}else{M.insertBefore(F,this.newestOnTop?M.firstChild||null:null);}this._consoleMsgCount++;this._lastTime=O.time.getTime();}}if(P.length){P.splice(0,0,this._elConsole.innerHTML);this._elConsole.innerHTML=this.newestOnTop?P.reverse().join(""):P.join("");}else{if(M.firstChild){this._elConsole.insertBefore(M,this.newestOnTop?this._elConsole.firstChild||null:null);}}},_onCategoryCreate:function(D,C,A){var B=C[0];A._categoryFilters.push(B);if(A._elFt){A._createCategoryCheckbox(B);}},_onSourceCreate:function(D,C,A){var B=C[0];A._sourceFilters.push(B);if(A._elFt){A._createSourceCheckbox(B);}},_onCheckCategory:function(A,B){var C=this.category;
if(!this.checked){B.hideCategory(C);}else{B.showCategory(C);}},_onCheckSource:function(A,B){var C=this.source;if(!this.checked){B.hideSource(C);}else{B.showSource(C);}},_onClickCollapseBtn:function(A,B){if(!B.isCollapsed){B.collapse();}else{B.expand();}},_onClickPauseBtn:function(A,B){if(!B.isPaused){B.pause();}else{B.resume();}},_onClickClearBtn:function(A,B){B.clearConsole();},_onNewLog:function(D,C,A){var B=C[0];A._buffer.push(B);if(A.logReaderEnabled===true&&A._timeout===null){A._timeout=setTimeout(function(){A._printBuffer();},A.outputBuffer);}},_onReset:function(C,B,A){A._filterLogs();}};if(!YAHOO.widget.Logger){YAHOO.widget.Logger={loggerEnabled:true,_browserConsoleEnabled:false,categories:["info","warn","error","time","window"],sources:["global"],_stack:[],maxStackEntries:2500,_startTime:new Date().getTime(),_lastTime:null,_windowErrorsHandled:false,_origOnWindowError:null};YAHOO.widget.Logger.log=function(B,F,G){if(this.loggerEnabled){if(!F){F="info";}else{F=F.toLocaleLowerCase();if(this._isNewCategory(F)){this._createNewCategory(F);}}var C="global";var A=null;if(G){var D=G.indexOf(" ");if(D>0){C=G.substring(0,D);A=G.substring(D,G.length);}else{C=G;}if(this._isNewSource(C)){this._createNewSource(C);}}var H=new Date();var J=new YAHOO.widget.LogMsg({msg:B,time:H,category:F,source:C,sourceDetail:A});var I=this._stack;var E=this.maxStackEntries;if(E&&!isNaN(E)&&(I.length>=E)){I.shift();}I.push(J);this.newLogEvent.fire(J);if(this._browserConsoleEnabled){this._printToBrowserConsole(J);}return true;}else{return false;}};YAHOO.widget.Logger.reset=function(){this._stack=[];this._startTime=new Date().getTime();this.loggerEnabled=true;this.log("Logger reset");this.logResetEvent.fire();};YAHOO.widget.Logger.getStack=function(){return this._stack;};YAHOO.widget.Logger.getStartTime=function(){return this._startTime;};YAHOO.widget.Logger.disableBrowserConsole=function(){YAHOO.log("Logger output to the function console.log() has been disabled.");this._browserConsoleEnabled=false;};YAHOO.widget.Logger.enableBrowserConsole=function(){this._browserConsoleEnabled=true;YAHOO.log("Logger output to the function console.log() has been enabled.");};YAHOO.widget.Logger.handleWindowErrors=function(){if(!YAHOO.widget.Logger._windowErrorsHandled){if(window.error){YAHOO.widget.Logger._origOnWindowError=window.onerror;}window.onerror=YAHOO.widget.Logger._onWindowError;YAHOO.widget.Logger._windowErrorsHandled=true;YAHOO.log("Logger handling of window.onerror has been enabled.");}else{YAHOO.log("Logger handling of window.onerror had already been enabled.");}};YAHOO.widget.Logger.unhandleWindowErrors=function(){if(YAHOO.widget.Logger._windowErrorsHandled){if(YAHOO.widget.Logger._origOnWindowError){window.onerror=YAHOO.widget.Logger._origOnWindowError;YAHOO.widget.Logger._origOnWindowError=null;}else{window.onerror=null;}YAHOO.widget.Logger._windowErrorsHandled=false;YAHOO.log("Logger handling of window.onerror has been disabled.");}else{YAHOO.log("Logger handling of window.onerror had already been disabled.");}};YAHOO.widget.Logger.categoryCreateEvent=new YAHOO.util.CustomEvent("categoryCreate",this,true);YAHOO.widget.Logger.sourceCreateEvent=new YAHOO.util.CustomEvent("sourceCreate",this,true);YAHOO.widget.Logger.newLogEvent=new YAHOO.util.CustomEvent("newLog",this,true);YAHOO.widget.Logger.logResetEvent=new YAHOO.util.CustomEvent("logReset",this,true);YAHOO.widget.Logger._createNewCategory=function(A){this.categories.push(A);this.categoryCreateEvent.fire(A);};YAHOO.widget.Logger._isNewCategory=function(B){for(var A=0;A<this.categories.length;A++){if(B==this.categories[A]){return false;}}return true;};YAHOO.widget.Logger._createNewSource=function(A){this.sources.push(A);this.sourceCreateEvent.fire(A);};YAHOO.widget.Logger._isNewSource=function(A){if(A){for(var B=0;B<this.sources.length;B++){if(A==this.sources[B]){return false;}}return true;}};YAHOO.widget.Logger._printToBrowserConsole=function(C){if(window.console&&console.log){var E=C.category;var D=C.category.substring(0,4).toUpperCase();var G=C.time;var F;if(G.toLocaleTimeString){F=G.toLocaleTimeString();}else{F=G.toString();}var H=G.getTime();var B=(YAHOO.widget.Logger._lastTime)?(H-YAHOO.widget.Logger._lastTime):0;YAHOO.widget.Logger._lastTime=H;var A=F+" ("+B+"ms): "+C.source+": ";if(YAHOO.env.ua.webkit){A+=C.msg;}console.log(A,C.msg);}};YAHOO.widget.Logger._onWindowError=function(A,C,B){try{YAHOO.widget.Logger.log(A+" ("+C+", line "+B+")","window");if(YAHOO.widget.Logger._origOnWindowError){YAHOO.widget.Logger._origOnWindowError();}}catch(D){return false;}};YAHOO.widget.Logger.log("Logger initialized");}YAHOO.register("logger",YAHOO.widget.Logger,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
if(!YAHOO.util.DragDropMgr){YAHOO.util.DragDropMgr=function(){var A=YAHOO.util.Event,B=YAHOO.util.Dom;return{useShim:false,_shimActive:false,_shimState:false,_debugShim:false,_createShim:function(){var C=document.createElement("div");C.id="yui-ddm-shim";if(document.body.firstChild){document.body.insertBefore(C,document.body.firstChild);}else{document.body.appendChild(C);}C.style.display="none";C.style.backgroundColor="red";C.style.position="absolute";C.style.zIndex="99999";B.setStyle(C,"opacity","0");this._shim=C;A.on(C,"mouseup",this.handleMouseUp,this,true);A.on(C,"mousemove",this.handleMouseMove,this,true);A.on(window,"scroll",this._sizeShim,this,true);},_sizeShim:function(){if(this._shimActive){var C=this._shim;C.style.height=B.getDocumentHeight()+"px";C.style.width=B.getDocumentWidth()+"px";C.style.top="0";C.style.left="0";}},_activateShim:function(){if(this.useShim){if(!this._shim){this._createShim();}this._shimActive=true;var C=this._shim,D="0";if(this._debugShim){D=".5";}B.setStyle(C,"opacity",D);this._sizeShim();C.style.display="block";}},_deactivateShim:function(){this._shim.style.display="none";this._shimActive=false;},_shim:null,ids:{},handleIds:{},dragCurrent:null,dragOvers:{},deltaX:0,deltaY:0,preventDefault:true,stopPropagation:true,initialized:false,locked:false,interactionInfo:null,init:function(){this.initialized=true;},POINT:0,INTERSECT:1,STRICT_INTERSECT:2,mode:0,_execOnAll:function(E,D){for(var F in this.ids){for(var C in this.ids[F]){var G=this.ids[F][C];if(!this.isTypeOfDD(G)){continue;}G[E].apply(G,D);}}},_onLoad:function(){this.init();A.on(document,"mouseup",this.handleMouseUp,this,true);A.on(document,"mousemove",this.handleMouseMove,this,true);A.on(window,"unload",this._onUnload,this,true);A.on(window,"resize",this._onResize,this,true);},_onResize:function(C){this._execOnAll("resetConstraints",[]);},lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isLocked:function(){return this.locked;},locationCache:{},useCache:true,clickPixelThresh:3,clickTimeThresh:1000,dragThreshMet:false,clickTimeout:null,startX:0,startY:0,fromTimeout:false,regDragDrop:function(D,C){if(!this.initialized){this.init();}if(!this.ids[C]){this.ids[C]={};}this.ids[C][D.id]=D;},removeDDFromGroup:function(E,C){if(!this.ids[C]){this.ids[C]={};}var D=this.ids[C];if(D&&D[E.id]){delete D[E.id];}},_remove:function(E){for(var D in E.groups){if(D){var C=this.ids[D];if(C&&C[E.id]){delete C[E.id];}}}delete this.handleIds[E.id];},regHandle:function(D,C){if(!this.handleIds[D]){this.handleIds[D]={};}this.handleIds[D][C]=C;},isDragDrop:function(C){return(this.getDDById(C))?true:false;},getRelated:function(H,D){var G=[];for(var F in H.groups){for(var E in this.ids[F]){var C=this.ids[F][E];if(!this.isTypeOfDD(C)){continue;}if(!D||C.isTarget){G[G.length]=C;}}}return G;},isLegalTarget:function(G,F){var D=this.getRelated(G,true);for(var E=0,C=D.length;E<C;++E){if(D[E].id==F.id){return true;}}return false;},isTypeOfDD:function(C){return(C&&C.__ygDragDrop);},isHandle:function(D,C){return(this.handleIds[D]&&this.handleIds[D][C]);},getDDById:function(D){for(var C in this.ids){if(this.ids[C][D]){return this.ids[C][D];}}return null;},handleMouseDown:function(E,D){this.currentTarget=YAHOO.util.Event.getTarget(E);this.dragCurrent=D;var C=D.getEl();this.startX=YAHOO.util.Event.getPageX(E);this.startY=YAHOO.util.Event.getPageY(E);this.deltaX=this.startX-C.offsetLeft;this.deltaY=this.startY-C.offsetTop;this.dragThreshMet=false;this.clickTimeout=setTimeout(function(){var F=YAHOO.util.DDM;F.startDrag(F.startX,F.startY);F.fromTimeout=true;},this.clickTimeThresh);},startDrag:function(C,E){if(this.dragCurrent&&this.dragCurrent.useShim){this._shimState=this.useShim;this.useShim=true;}this._activateShim();clearTimeout(this.clickTimeout);var D=this.dragCurrent;if(D&&D.events.b4StartDrag){D.b4StartDrag(C,E);D.fireEvent("b4StartDragEvent",{x:C,y:E});}if(D&&D.events.startDrag){D.startDrag(C,E);D.fireEvent("startDragEvent",{x:C,y:E});}this.dragThreshMet=true;},handleMouseUp:function(C){if(this.dragCurrent){clearTimeout(this.clickTimeout);if(this.dragThreshMet){if(this.fromTimeout){this.fromTimeout=false;this.handleMouseMove(C);}this.fromTimeout=false;this.fireEvents(C,true);}else{}this.stopDrag(C);this.stopEvent(C);}},stopEvent:function(C){if(this.stopPropagation){YAHOO.util.Event.stopPropagation(C);}if(this.preventDefault){YAHOO.util.Event.preventDefault(C);}},stopDrag:function(E,D){var C=this.dragCurrent;if(C&&!D){if(this.dragThreshMet){if(C.events.b4EndDrag){C.b4EndDrag(E);C.fireEvent("b4EndDragEvent",{e:E});}if(C.events.endDrag){C.endDrag(E);C.fireEvent("endDragEvent",{e:E});}}if(C.events.mouseUp){C.onMouseUp(E);C.fireEvent("mouseUpEvent",{e:E});}}if(this._shimActive){this._deactivateShim();if(this.dragCurrent&&this.dragCurrent.useShim){this.useShim=this._shimState;this._shimState=false;}}this.dragCurrent=null;this.dragOvers={};},handleMouseMove:function(F){var C=this.dragCurrent;if(C){if(YAHOO.util.Event.isIE&&!F.button){this.stopEvent(F);return this.handleMouseUp(F);}else{if(F.clientX<0||F.clientY<0){}}if(!this.dragThreshMet){var E=Math.abs(this.startX-YAHOO.util.Event.getPageX(F));var D=Math.abs(this.startY-YAHOO.util.Event.getPageY(F));if(E>this.clickPixelThresh||D>this.clickPixelThresh){this.startDrag(this.startX,this.startY);}}if(this.dragThreshMet){if(C&&C.events.b4Drag){C.b4Drag(F);C.fireEvent("b4DragEvent",{e:F});}if(C&&C.events.drag){C.onDrag(F);C.fireEvent("dragEvent",{e:F});}if(C){this.fireEvents(F,false);}}this.stopEvent(F);}},fireEvents:function(V,L){var a=this.dragCurrent;if(!a||a.isLocked()||a.dragOnly){return;}var N=YAHOO.util.Event.getPageX(V),M=YAHOO.util.Event.getPageY(V),P=new YAHOO.util.Point(N,M),K=a.getTargetCoord(P.x,P.y),F=a.getDragEl(),E=["out","over","drop","enter"],U=new YAHOO.util.Region(K.y,K.x+F.offsetWidth,K.y+F.offsetHeight,K.x),I=[],D={},Q=[],c={outEvts:[],overEvts:[],dropEvts:[],enterEvts:[]};for(var S in this.dragOvers){var d=this.dragOvers[S];if(!this.isTypeOfDD(d)){continue;
}if(!this.isOverTarget(P,d,this.mode,U)){c.outEvts.push(d);}I[S]=true;delete this.dragOvers[S];}for(var R in a.groups){if("string"!=typeof R){continue;}for(S in this.ids[R]){var G=this.ids[R][S];if(!this.isTypeOfDD(G)){continue;}if(G.isTarget&&!G.isLocked()&&G!=a){if(this.isOverTarget(P,G,this.mode,U)){D[R]=true;if(L){c.dropEvts.push(G);}else{if(!I[G.id]){c.enterEvts.push(G);}else{c.overEvts.push(G);}this.dragOvers[G.id]=G;}}}}}this.interactionInfo={out:c.outEvts,enter:c.enterEvts,over:c.overEvts,drop:c.dropEvts,point:P,draggedRegion:U,sourceRegion:this.locationCache[a.id],validDrop:L};for(var C in D){Q.push(C);}if(L&&!c.dropEvts.length){this.interactionInfo.validDrop=false;if(a.events.invalidDrop){a.onInvalidDrop(V);a.fireEvent("invalidDropEvent",{e:V});}}for(S=0;S<E.length;S++){var Y=null;if(c[E[S]+"Evts"]){Y=c[E[S]+"Evts"];}if(Y&&Y.length){var H=E[S].charAt(0).toUpperCase()+E[S].substr(1),X="onDrag"+H,J="b4Drag"+H,O="drag"+H+"Event",W="drag"+H;if(this.mode){if(a.events[J]){a[J](V,Y,Q);a.fireEvent(J+"Event",{event:V,info:Y,group:Q});}if(a.events[W]){a[X](V,Y,Q);a.fireEvent(O,{event:V,info:Y,group:Q});}}else{for(var Z=0,T=Y.length;Z<T;++Z){if(a.events[J]){a[J](V,Y[Z].id,Q[0]);a.fireEvent(J+"Event",{event:V,info:Y[Z].id,group:Q[0]});}if(a.events[W]){a[X](V,Y[Z].id,Q[0]);a.fireEvent(O,{event:V,info:Y[Z].id,group:Q[0]});}}}}}},getBestMatch:function(E){var G=null;var D=E.length;if(D==1){G=E[0];}else{for(var F=0;F<D;++F){var C=E[F];if(this.mode==this.INTERSECT&&C.cursorIsOver){G=C;break;}else{if(!G||!G.overlap||(C.overlap&&G.overlap.getArea()<C.overlap.getArea())){G=C;}}}}return G;},refreshCache:function(D){var F=D||this.ids;for(var C in F){if("string"!=typeof C){continue;}for(var E in this.ids[C]){var G=this.ids[C][E];if(this.isTypeOfDD(G)){var H=this.getLocation(G);if(H){this.locationCache[G.id]=H;}else{delete this.locationCache[G.id];}}}}},verifyEl:function(D){try{if(D){var C=D.offsetParent;if(C){return true;}}}catch(E){}return false;},getLocation:function(H){if(!this.isTypeOfDD(H)){return null;}var F=H.getEl(),K,E,D,M,L,N,C,J,G;try{K=YAHOO.util.Dom.getXY(F);}catch(I){}if(!K){return null;}E=K[0];D=E+F.offsetWidth;M=K[1];L=M+F.offsetHeight;N=M-H.padding[0];C=D+H.padding[1];J=L+H.padding[2];G=E-H.padding[3];return new YAHOO.util.Region(N,C,J,G);},isOverTarget:function(K,C,E,F){var G=this.locationCache[C.id];if(!G||!this.useCache){G=this.getLocation(C);this.locationCache[C.id]=G;}if(!G){return false;}C.cursorIsOver=G.contains(K);var J=this.dragCurrent;if(!J||(!E&&!J.constrainX&&!J.constrainY)){return C.cursorIsOver;}C.overlap=null;if(!F){var H=J.getTargetCoord(K.x,K.y);var D=J.getDragEl();F=new YAHOO.util.Region(H.y,H.x+D.offsetWidth,H.y+D.offsetHeight,H.x);}var I=F.intersect(G);if(I){C.overlap=I;return(E)?true:C.cursorIsOver;}else{return false;}},_onUnload:function(D,C){this.unregAll();},unregAll:function(){if(this.dragCurrent){this.stopDrag();this.dragCurrent=null;}this._execOnAll("unreg",[]);this.ids={};},elementCache:{},getElWrapper:function(D){var C=this.elementCache[D];if(!C||!C.el){C=this.elementCache[D]=new this.ElementWrapper(YAHOO.util.Dom.get(D));}return C;},getElement:function(C){return YAHOO.util.Dom.get(C);},getCss:function(D){var C=YAHOO.util.Dom.get(D);return(C)?C.style:null;},ElementWrapper:function(C){this.el=C||null;this.id=this.el&&C.id;this.css=this.el&&C.style;},getPosX:function(C){return YAHOO.util.Dom.getX(C);},getPosY:function(C){return YAHOO.util.Dom.getY(C);},swapNode:function(E,C){if(E.swapNode){E.swapNode(C);}else{var F=C.parentNode;var D=C.nextSibling;if(D==E){F.insertBefore(E,C);}else{if(C==E.nextSibling){F.insertBefore(C,E);}else{E.parentNode.replaceChild(C,E);F.insertBefore(E,D);}}}},getScroll:function(){var E,C,F=document.documentElement,D=document.body;if(F&&(F.scrollTop||F.scrollLeft)){E=F.scrollTop;C=F.scrollLeft;}else{if(D){E=D.scrollTop;C=D.scrollLeft;}else{}}return{top:E,left:C};},getStyle:function(D,C){return YAHOO.util.Dom.getStyle(D,C);},getScrollTop:function(){return this.getScroll().top;},getScrollLeft:function(){return this.getScroll().left;},moveToEl:function(C,E){var D=YAHOO.util.Dom.getXY(E);YAHOO.util.Dom.setXY(C,D);},getClientHeight:function(){return YAHOO.util.Dom.getViewportHeight();},getClientWidth:function(){return YAHOO.util.Dom.getViewportWidth();},numericSort:function(D,C){return(D-C);},_timeoutCount:0,_addListeners:function(){var C=YAHOO.util.DDM;if(YAHOO.util.Event&&document){C._onLoad();}else{if(C._timeoutCount>2000){}else{setTimeout(C._addListeners,10);if(document&&document.body){C._timeoutCount+=1;}}}},handleWasClicked:function(C,E){if(this.isHandle(E,C.id)){return true;}else{var D=C.parentNode;while(D){if(this.isHandle(E,D.id)){return true;}else{D=D.parentNode;}}}return false;}};}();YAHOO.util.DDM=YAHOO.util.DragDropMgr;YAHOO.util.DDM._addListeners();}(function(){var A=YAHOO.util.Event;var B=YAHOO.util.Dom;YAHOO.util.DragDrop=function(E,C,D){if(E){this.init(E,C,D);}};YAHOO.util.DragDrop.prototype={events:null,on:function(){this.subscribe.apply(this,arguments);},id:null,config:null,dragElId:null,handleElId:null,invalidHandleTypes:null,invalidHandleIds:null,invalidHandleClasses:null,startPageX:0,startPageY:0,groups:null,locked:false,lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isTarget:true,padding:null,dragOnly:false,useShim:false,_domRef:null,__ygDragDrop:true,constrainX:false,constrainY:false,minX:0,maxX:0,minY:0,maxY:0,deltaX:0,deltaY:0,maintainOffset:false,xTicks:null,yTicks:null,primaryButtonOnly:true,available:false,hasOuterHandles:false,cursorIsOver:false,overlap:null,b4StartDrag:function(C,D){},startDrag:function(C,D){},b4Drag:function(C){},onDrag:function(C){},onDragEnter:function(C,D){},b4DragOver:function(C){},onDragOver:function(C,D){},b4DragOut:function(C){},onDragOut:function(C,D){},b4DragDrop:function(C){},onDragDrop:function(C,D){},onInvalidDrop:function(C){},b4EndDrag:function(C){},endDrag:function(C){},b4MouseDown:function(C){},onMouseDown:function(C){},onMouseUp:function(C){},onAvailable:function(){},getEl:function(){if(!this._domRef){this._domRef=B.get(this.id);
}return this._domRef;},getDragEl:function(){return B.get(this.dragElId);},init:function(F,C,D){this.initTarget(F,C,D);A.on(this._domRef||this.id,"mousedown",this.handleMouseDown,this,true);for(var E in this.events){this.createEvent(E+"Event");}},initTarget:function(E,C,D){this.config=D||{};this.events={};this.DDM=YAHOO.util.DDM;this.groups={};if(typeof E!=="string"){this._domRef=E;E=B.generateId(E);}this.id=E;this.addToGroup((C)?C:"default");this.handleElId=E;A.onAvailable(E,this.handleOnAvailable,this,true);this.setDragElId(E);this.invalidHandleTypes={A:"A"};this.invalidHandleIds={};this.invalidHandleClasses=[];this.applyConfig();},applyConfig:function(){this.events={mouseDown:true,b4MouseDown:true,mouseUp:true,b4StartDrag:true,startDrag:true,b4EndDrag:true,endDrag:true,drag:true,b4Drag:true,invalidDrop:true,b4DragOut:true,dragOut:true,dragEnter:true,b4DragOver:true,dragOver:true,b4DragDrop:true,dragDrop:true};if(this.config.events){for(var C in this.config.events){if(this.config.events[C]===false){this.events[C]=false;}}}this.padding=this.config.padding||[0,0,0,0];this.isTarget=(this.config.isTarget!==false);this.maintainOffset=(this.config.maintainOffset);this.primaryButtonOnly=(this.config.primaryButtonOnly!==false);this.dragOnly=((this.config.dragOnly===true)?true:false);this.useShim=((this.config.useShim===true)?true:false);},handleOnAvailable:function(){this.available=true;this.resetConstraints();this.onAvailable();},setPadding:function(E,C,F,D){if(!C&&0!==C){this.padding=[E,E,E,E];}else{if(!F&&0!==F){this.padding=[E,C,E,C];}else{this.padding=[E,C,F,D];}}},setInitPosition:function(F,E){var G=this.getEl();if(!this.DDM.verifyEl(G)){if(G&&G.style&&(G.style.display=="none")){}else{}return;}var D=F||0;var C=E||0;var H=B.getXY(G);this.initPageX=H[0]-D;this.initPageY=H[1]-C;this.lastPageX=H[0];this.lastPageY=H[1];this.setStartPosition(H);},setStartPosition:function(D){var C=D||B.getXY(this.getEl());this.deltaSetXY=null;this.startPageX=C[0];this.startPageY=C[1];},addToGroup:function(C){this.groups[C]=true;this.DDM.regDragDrop(this,C);},removeFromGroup:function(C){if(this.groups[C]){delete this.groups[C];}this.DDM.removeDDFromGroup(this,C);},setDragElId:function(C){this.dragElId=C;},setHandleElId:function(C){if(typeof C!=="string"){C=B.generateId(C);}this.handleElId=C;this.DDM.regHandle(this.id,C);},setOuterHandleElId:function(C){if(typeof C!=="string"){C=B.generateId(C);}A.on(C,"mousedown",this.handleMouseDown,this,true);this.setHandleElId(C);this.hasOuterHandles=true;},unreg:function(){A.removeListener(this.id,"mousedown",this.handleMouseDown);this._domRef=null;this.DDM._remove(this);},isLocked:function(){return(this.DDM.isLocked()||this.locked);},handleMouseDown:function(J,I){var D=J.which||J.button;if(this.primaryButtonOnly&&D>1){return;}if(this.isLocked()){return;}var C=this.b4MouseDown(J),F=true;if(this.events.b4MouseDown){F=this.fireEvent("b4MouseDownEvent",J);}var E=this.onMouseDown(J),H=true;if(this.events.mouseDown){H=this.fireEvent("mouseDownEvent",J);}if((C===false)||(E===false)||(F===false)||(H===false)){return;}this.DDM.refreshCache(this.groups);var G=new YAHOO.util.Point(A.getPageX(J),A.getPageY(J));if(!this.hasOuterHandles&&!this.DDM.isOverTarget(G,this)){}else{if(this.clickValidator(J)){this.setStartPosition();this.DDM.handleMouseDown(J,this);this.DDM.stopEvent(J);}else{}}},clickValidator:function(D){var C=YAHOO.util.Event.getTarget(D);return(this.isValidHandleChild(C)&&(this.id==this.handleElId||this.DDM.handleWasClicked(C,this.id)));},getTargetCoord:function(E,D){var C=E-this.deltaX;var F=D-this.deltaY;if(this.constrainX){if(C<this.minX){C=this.minX;}if(C>this.maxX){C=this.maxX;}}if(this.constrainY){if(F<this.minY){F=this.minY;}if(F>this.maxY){F=this.maxY;}}C=this.getTick(C,this.xTicks);F=this.getTick(F,this.yTicks);return{x:C,y:F};},addInvalidHandleType:function(C){var D=C.toUpperCase();this.invalidHandleTypes[D]=D;},addInvalidHandleId:function(C){if(typeof C!=="string"){C=B.generateId(C);}this.invalidHandleIds[C]=C;},addInvalidHandleClass:function(C){this.invalidHandleClasses.push(C);},removeInvalidHandleType:function(C){var D=C.toUpperCase();delete this.invalidHandleTypes[D];},removeInvalidHandleId:function(C){if(typeof C!=="string"){C=B.generateId(C);}delete this.invalidHandleIds[C];},removeInvalidHandleClass:function(D){for(var E=0,C=this.invalidHandleClasses.length;E<C;++E){if(this.invalidHandleClasses[E]==D){delete this.invalidHandleClasses[E];}}},isValidHandleChild:function(F){var E=true;var H;try{H=F.nodeName.toUpperCase();}catch(G){H=F.nodeName;}E=E&&!this.invalidHandleTypes[H];E=E&&!this.invalidHandleIds[F.id];for(var D=0,C=this.invalidHandleClasses.length;E&&D<C;++D){E=!B.hasClass(F,this.invalidHandleClasses[D]);}return E;},setXTicks:function(F,C){this.xTicks=[];this.xTickSize=C;var E={};for(var D=this.initPageX;D>=this.minX;D=D-C){if(!E[D]){this.xTicks[this.xTicks.length]=D;E[D]=true;}}for(D=this.initPageX;D<=this.maxX;D=D+C){if(!E[D]){this.xTicks[this.xTicks.length]=D;E[D]=true;}}this.xTicks.sort(this.DDM.numericSort);},setYTicks:function(F,C){this.yTicks=[];this.yTickSize=C;var E={};for(var D=this.initPageY;D>=this.minY;D=D-C){if(!E[D]){this.yTicks[this.yTicks.length]=D;E[D]=true;}}for(D=this.initPageY;D<=this.maxY;D=D+C){if(!E[D]){this.yTicks[this.yTicks.length]=D;E[D]=true;}}this.yTicks.sort(this.DDM.numericSort);},setXConstraint:function(E,D,C){this.leftConstraint=parseInt(E,10);this.rightConstraint=parseInt(D,10);this.minX=this.initPageX-this.leftConstraint;this.maxX=this.initPageX+this.rightConstraint;if(C){this.setXTicks(this.initPageX,C);}this.constrainX=true;},clearConstraints:function(){this.constrainX=false;this.constrainY=false;this.clearTicks();},clearTicks:function(){this.xTicks=null;this.yTicks=null;this.xTickSize=0;this.yTickSize=0;},setYConstraint:function(C,E,D){this.topConstraint=parseInt(C,10);this.bottomConstraint=parseInt(E,10);this.minY=this.initPageY-this.topConstraint;this.maxY=this.initPageY+this.bottomConstraint;if(D){this.setYTicks(this.initPageY,D);
}this.constrainY=true;},resetConstraints:function(){if(this.initPageX||this.initPageX===0){var D=(this.maintainOffset)?this.lastPageX-this.initPageX:0;var C=(this.maintainOffset)?this.lastPageY-this.initPageY:0;this.setInitPosition(D,C);}else{this.setInitPosition();}if(this.constrainX){this.setXConstraint(this.leftConstraint,this.rightConstraint,this.xTickSize);}if(this.constrainY){this.setYConstraint(this.topConstraint,this.bottomConstraint,this.yTickSize);}},getTick:function(I,F){if(!F){return I;}else{if(F[0]>=I){return F[0];}else{for(var D=0,C=F.length;D<C;++D){var E=D+1;if(F[E]&&F[E]>=I){var H=I-F[D];var G=F[E]-I;return(G>H)?F[D]:F[E];}}return F[F.length-1];}}},toString:function(){return("DragDrop "+this.id);}};YAHOO.augment(YAHOO.util.DragDrop,YAHOO.util.EventProvider);})();YAHOO.util.DD=function(C,A,B){if(C){this.init(C,A,B);}};YAHOO.extend(YAHOO.util.DD,YAHOO.util.DragDrop,{scroll:true,autoOffset:function(C,B){var A=C-this.startPageX;var D=B-this.startPageY;this.setDelta(A,D);},setDelta:function(B,A){this.deltaX=B;this.deltaY=A;},setDragElPos:function(C,B){var A=this.getDragEl();this.alignElWithMouse(A,C,B);},alignElWithMouse:function(C,G,F){var E=this.getTargetCoord(G,F);if(!this.deltaSetXY){var H=[E.x,E.y];YAHOO.util.Dom.setXY(C,H);var D=parseInt(YAHOO.util.Dom.getStyle(C,"left"),10);var B=parseInt(YAHOO.util.Dom.getStyle(C,"top"),10);this.deltaSetXY=[D-E.x,B-E.y];}else{YAHOO.util.Dom.setStyle(C,"left",(E.x+this.deltaSetXY[0])+"px");YAHOO.util.Dom.setStyle(C,"top",(E.y+this.deltaSetXY[1])+"px");}this.cachePosition(E.x,E.y);var A=this;setTimeout(function(){A.autoScroll.call(A,E.x,E.y,C.offsetHeight,C.offsetWidth);},0);},cachePosition:function(B,A){if(B){this.lastPageX=B;this.lastPageY=A;}else{var C=YAHOO.util.Dom.getXY(this.getEl());this.lastPageX=C[0];this.lastPageY=C[1];}},autoScroll:function(J,I,E,K){if(this.scroll){var L=this.DDM.getClientHeight();var B=this.DDM.getClientWidth();var N=this.DDM.getScrollTop();var D=this.DDM.getScrollLeft();var H=E+I;var M=K+J;var G=(L+N-I-this.deltaY);var F=(B+D-J-this.deltaX);var C=40;var A=(document.all)?80:30;if(H>L&&G<C){window.scrollTo(D,N+A);}if(I<N&&N>0&&I-N<C){window.scrollTo(D,N-A);}if(M>B&&F<C){window.scrollTo(D+A,N);}if(J<D&&D>0&&J-D<C){window.scrollTo(D-A,N);}}},applyConfig:function(){YAHOO.util.DD.superclass.applyConfig.call(this);this.scroll=(this.config.scroll!==false);},b4MouseDown:function(A){this.setStartPosition();this.autoOffset(YAHOO.util.Event.getPageX(A),YAHOO.util.Event.getPageY(A));},b4Drag:function(A){this.setDragElPos(YAHOO.util.Event.getPageX(A),YAHOO.util.Event.getPageY(A));},toString:function(){return("DD "+this.id);}});YAHOO.util.DDProxy=function(C,A,B){if(C){this.init(C,A,B);this.initFrame();}};YAHOO.util.DDProxy.dragElId="ygddfdiv";YAHOO.extend(YAHOO.util.DDProxy,YAHOO.util.DD,{resizeFrame:true,centerFrame:false,createFrame:function(){var B=this,A=document.body;if(!A||!A.firstChild){setTimeout(function(){B.createFrame();},50);return;}var F=this.getDragEl(),E=YAHOO.util.Dom;if(!F){F=document.createElement("div");F.id=this.dragElId;var D=F.style;D.position="absolute";D.visibility="hidden";D.cursor="move";D.border="2px solid #aaa";D.zIndex=999;D.height="25px";D.width="25px";var C=document.createElement("div");E.setStyle(C,"height","100%");E.setStyle(C,"width","100%");E.setStyle(C,"background-color","#ccc");E.setStyle(C,"opacity","0");F.appendChild(C);A.insertBefore(F,A.firstChild);}},initFrame:function(){this.createFrame();},applyConfig:function(){YAHOO.util.DDProxy.superclass.applyConfig.call(this);this.resizeFrame=(this.config.resizeFrame!==false);this.centerFrame=(this.config.centerFrame);this.setDragElId(this.config.dragElId||YAHOO.util.DDProxy.dragElId);},showFrame:function(E,D){var C=this.getEl();var A=this.getDragEl();var B=A.style;this._resizeProxy();if(this.centerFrame){this.setDelta(Math.round(parseInt(B.width,10)/2),Math.round(parseInt(B.height,10)/2));}this.setDragElPos(E,D);YAHOO.util.Dom.setStyle(A,"visibility","visible");},_resizeProxy:function(){if(this.resizeFrame){var H=YAHOO.util.Dom;var B=this.getEl();var C=this.getDragEl();var G=parseInt(H.getStyle(C,"borderTopWidth"),10);var I=parseInt(H.getStyle(C,"borderRightWidth"),10);var F=parseInt(H.getStyle(C,"borderBottomWidth"),10);var D=parseInt(H.getStyle(C,"borderLeftWidth"),10);if(isNaN(G)){G=0;}if(isNaN(I)){I=0;}if(isNaN(F)){F=0;}if(isNaN(D)){D=0;}var E=Math.max(0,B.offsetWidth-I-D);var A=Math.max(0,B.offsetHeight-G-F);H.setStyle(C,"width",E+"px");H.setStyle(C,"height",A+"px");}},b4MouseDown:function(B){this.setStartPosition();var A=YAHOO.util.Event.getPageX(B);var C=YAHOO.util.Event.getPageY(B);this.autoOffset(A,C);},b4StartDrag:function(A,B){this.showFrame(A,B);},b4EndDrag:function(A){YAHOO.util.Dom.setStyle(this.getDragEl(),"visibility","hidden");},endDrag:function(D){var C=YAHOO.util.Dom;var B=this.getEl();var A=this.getDragEl();C.setStyle(A,"visibility","");C.setStyle(B,"visibility","hidden");YAHOO.util.DDM.moveToEl(B,A);C.setStyle(A,"visibility","hidden");C.setStyle(B,"visibility","");},toString:function(){return("DDProxy "+this.id);}});YAHOO.util.DDTarget=function(C,A,B){if(C){this.initTarget(C,A,B);}};YAHOO.extend(YAHOO.util.DDTarget,YAHOO.util.DragDrop,{toString:function(){return("DDTarget "+this.id);}});YAHOO.register("dragdrop",YAHOO.util.DragDropMgr,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){var B=YAHOO.util.Dom.getXY,A=YAHOO.util.Event,D=Array.prototype.slice;function C(G,E,F,H){C.ANIM_AVAIL=(!YAHOO.lang.isUndefined(YAHOO.util.Anim));if(G){this.init(G,E,true);this.initSlider(H);this.initThumb(F);}}YAHOO.lang.augmentObject(C,{getHorizSlider:function(F,G,I,H,E){return new C(F,F,new YAHOO.widget.SliderThumb(G,F,I,H,0,0,E),"horiz");},getVertSlider:function(G,H,E,I,F){return new C(G,G,new YAHOO.widget.SliderThumb(H,G,0,0,E,I,F),"vert");},getSliderRegion:function(G,H,J,I,E,K,F){return new C(G,G,new YAHOO.widget.SliderThumb(H,G,J,I,E,K,F),"region");},SOURCE_UI_EVENT:1,SOURCE_SET_VALUE:2,SOURCE_KEY_EVENT:3,ANIM_AVAIL:false},true);YAHOO.extend(C,YAHOO.util.DragDrop,{_mouseDown:false,dragOnly:true,initSlider:function(E){this.type=E;this.createEvent("change",this);this.createEvent("slideStart",this);this.createEvent("slideEnd",this);this.isTarget=false;this.animate=C.ANIM_AVAIL;this.backgroundEnabled=true;this.tickPause=40;this.enableKeys=true;this.keyIncrement=20;this.moveComplete=true;this.animationDuration=0.2;this.SOURCE_UI_EVENT=1;this.SOURCE_SET_VALUE=2;this.valueChangeSource=0;this._silent=false;this.lastOffset=[0,0];},initThumb:function(F){var E=this;this.thumb=F;F.cacheBetweenDrags=true;if(F._isHoriz&&F.xTicks&&F.xTicks.length){this.tickPause=Math.round(360/F.xTicks.length);}else{if(F.yTicks&&F.yTicks.length){this.tickPause=Math.round(360/F.yTicks.length);}}F.onAvailable=function(){return E.setStartSliderState();};F.onMouseDown=function(){E._mouseDown=true;return E.focus();};F.startDrag=function(){E._slideStart();};F.onDrag=function(){E.fireEvents(true);};F.onMouseUp=function(){E.thumbMouseUp();};},onAvailable:function(){this._bindKeyEvents();},_bindKeyEvents:function(){A.on(this.id,"keydown",this.handleKeyDown,this,true);A.on(this.id,"keypress",this.handleKeyPress,this,true);},handleKeyPress:function(F){if(this.enableKeys){var E=A.getCharCode(F);switch(E){case 37:case 38:case 39:case 40:case 36:case 35:A.preventDefault(F);break;default:}}},handleKeyDown:function(J){if(this.enableKeys){var G=A.getCharCode(J),F=this.thumb,H=this.getXValue(),E=this.getYValue(),I=true;switch(G){case 37:H-=this.keyIncrement;break;case 38:E-=this.keyIncrement;break;case 39:H+=this.keyIncrement;break;case 40:E+=this.keyIncrement;break;case 36:H=F.leftConstraint;E=F.topConstraint;break;case 35:H=F.rightConstraint;E=F.bottomConstraint;break;default:I=false;}if(I){if(F._isRegion){this._setRegionValue(C.SOURCE_KEY_EVENT,H,E,true);}else{this._setValue(C.SOURCE_KEY_EVENT,(F._isHoriz?H:E),true);}A.stopEvent(J);}}},setStartSliderState:function(){this.setThumbCenterPoint();this.baselinePos=B(this.getEl());this.thumb.startOffset=this.thumb.getOffsetFromParent(this.baselinePos);if(this.thumb._isRegion){if(this.deferredSetRegionValue){this._setRegionValue.apply(this,this.deferredSetRegionValue);this.deferredSetRegionValue=null;}else{this.setRegionValue(0,0,true,true,true);}}else{if(this.deferredSetValue){this._setValue.apply(this,this.deferredSetValue);this.deferredSetValue=null;}else{this.setValue(0,true,true,true);}}},setThumbCenterPoint:function(){var E=this.thumb.getEl();if(E){this.thumbCenterPoint={x:parseInt(E.offsetWidth/2,10),y:parseInt(E.offsetHeight/2,10)};}},lock:function(){this.thumb.lock();this.locked=true;},unlock:function(){this.thumb.unlock();this.locked=false;},thumbMouseUp:function(){this._mouseDown=false;if(!this.isLocked()&&!this.moveComplete){this.endMove();}},onMouseUp:function(){this._mouseDown=false;if(this.backgroundEnabled&&!this.isLocked()&&!this.moveComplete){this.endMove();}},getThumb:function(){return this.thumb;},focus:function(){this.valueChangeSource=C.SOURCE_UI_EVENT;var E=this.getEl();if(E.focus){try{E.focus();}catch(F){}}this.verifyOffset();return !this.isLocked();},onChange:function(E,F){},onSlideStart:function(){},onSlideEnd:function(){},getValue:function(){return this.thumb.getValue();},getXValue:function(){return this.thumb.getXValue();},getYValue:function(){return this.thumb.getYValue();},setValue:function(){var E=D.call(arguments);E.unshift(C.SOURCE_SET_VALUE);return this._setValue.apply(this,E);},_setValue:function(I,L,G,H,E){var F=this.thumb,K,J;if(!F.available){this.deferredSetValue=arguments;return false;}if(this.isLocked()&&!H){return false;}if(isNaN(L)){return false;}if(F._isRegion){return false;}this._silent=E;this.valueChangeSource=I||C.SOURCE_SET_VALUE;F.lastOffset=[L,L];this.verifyOffset(true);this._slideStart();if(F._isHoriz){K=F.initPageX+L+this.thumbCenterPoint.x;this.moveThumb(K,F.initPageY,G);}else{J=F.initPageY+L+this.thumbCenterPoint.y;this.moveThumb(F.initPageX,J,G);}return true;},setRegionValue:function(){var E=D.call(arguments);E.unshift(C.SOURCE_SET_VALUE);return this._setRegionValue.apply(this,E);},_setRegionValue:function(F,J,H,I,G,K){var L=this.thumb,E,M;if(!L.available){this.deferredSetRegionValue=arguments;return false;}if(this.isLocked()&&!G){return false;}if(isNaN(J)){return false;}if(!L._isRegion){return false;}this._silent=K;this.valueChangeSource=F||C.SOURCE_SET_VALUE;L.lastOffset=[J,H];this.verifyOffset(true);this._slideStart();E=L.initPageX+J+this.thumbCenterPoint.x;M=L.initPageY+H+this.thumbCenterPoint.y;this.moveThumb(E,M,I);return true;},verifyOffset:function(F){var G=B(this.getEl()),E=this.thumb;if(!this.thumbCenterPoint||!this.thumbCenterPoint.x){this.setThumbCenterPoint();}if(G){if(G[0]!=this.baselinePos[0]||G[1]!=this.baselinePos[1]){this.setInitPosition();this.baselinePos=G;E.initPageX=this.initPageX+E.startOffset[0];E.initPageY=this.initPageY+E.startOffset[1];E.deltaSetXY=null;this.resetThumbConstraints();return false;}}return true;},moveThumb:function(K,J,I,G){var L=this.thumb,M=this,F,E,H;if(!L.available){return;}L.setDelta(this.thumbCenterPoint.x,this.thumbCenterPoint.y);E=L.getTargetCoord(K,J);F=[Math.round(E.x),Math.round(E.y)];if(this.animate&&L._graduated&&!I){this.lock();this.curCoord=B(this.thumb.getEl());this.curCoord=[Math.round(this.curCoord[0]),Math.round(this.curCoord[1])];setTimeout(function(){M.moveOneTick(F);
},this.tickPause);}else{if(this.animate&&C.ANIM_AVAIL&&!I){this.lock();H=new YAHOO.util.Motion(L.id,{points:{to:F}},this.animationDuration,YAHOO.util.Easing.easeOut);H.onComplete.subscribe(function(){M.unlock();if(!M._mouseDown){M.endMove();}});H.animate();}else{L.setDragElPos(K,J);if(!G&&!this._mouseDown){this.endMove();}}}},_slideStart:function(){if(!this._sliding){if(!this._silent){this.onSlideStart();this.fireEvent("slideStart");}this._sliding=true;}},_slideEnd:function(){if(this._sliding&&this.moveComplete){var E=this._silent;this._sliding=false;this._silent=false;this.moveComplete=false;if(!E){this.onSlideEnd();this.fireEvent("slideEnd");}}},moveOneTick:function(F){var H=this.thumb,G=this,I=null,E,J;if(H._isRegion){I=this._getNextX(this.curCoord,F);E=(I!==null)?I[0]:this.curCoord[0];I=this._getNextY(this.curCoord,F);J=(I!==null)?I[1]:this.curCoord[1];I=E!==this.curCoord[0]||J!==this.curCoord[1]?[E,J]:null;}else{if(H._isHoriz){I=this._getNextX(this.curCoord,F);}else{I=this._getNextY(this.curCoord,F);}}if(I){this.curCoord=I;this.thumb.alignElWithMouse(H.getEl(),I[0]+this.thumbCenterPoint.x,I[1]+this.thumbCenterPoint.y);if(!(I[0]==F[0]&&I[1]==F[1])){setTimeout(function(){G.moveOneTick(F);},this.tickPause);}else{this.unlock();if(!this._mouseDown){this.endMove();}}}else{this.unlock();if(!this._mouseDown){this.endMove();}}},_getNextX:function(E,F){var H=this.thumb,J,G=[],I=null;if(E[0]>F[0]){J=H.tickSize-this.thumbCenterPoint.x;G=H.getTargetCoord(E[0]-J,E[1]);I=[G.x,G.y];}else{if(E[0]<F[0]){J=H.tickSize+this.thumbCenterPoint.x;G=H.getTargetCoord(E[0]+J,E[1]);I=[G.x,G.y];}else{}}return I;},_getNextY:function(E,F){var H=this.thumb,J,G=[],I=null;if(E[1]>F[1]){J=H.tickSize-this.thumbCenterPoint.y;G=H.getTargetCoord(E[0],E[1]-J);I=[G.x,G.y];}else{if(E[1]<F[1]){J=H.tickSize+this.thumbCenterPoint.y;G=H.getTargetCoord(E[0],E[1]+J);I=[G.x,G.y];}else{}}return I;},b4MouseDown:function(E){if(!this.backgroundEnabled){return false;}this.thumb.autoOffset();this.resetThumbConstraints();},onMouseDown:function(F){if(!this.backgroundEnabled||this.isLocked()){return false;}this._mouseDown=true;var E=A.getPageX(F),G=A.getPageY(F);this.focus();this._slideStart();this.moveThumb(E,G);},onDrag:function(F){if(this.backgroundEnabled&&!this.isLocked()){var E=A.getPageX(F),G=A.getPageY(F);this.moveThumb(E,G,true,true);this.fireEvents();}},endMove:function(){this.unlock();this.fireEvents();this.moveComplete=true;this._slideEnd();},resetThumbConstraints:function(){var E=this.thumb;E.setXConstraint(E.leftConstraint,E.rightConstraint,E.xTickSize);E.setYConstraint(E.topConstraint,E.bottomConstraint,E.xTickSize);},fireEvents:function(G){var F=this.thumb,I,H,E;if(!G){F.cachePosition();}if(!this.isLocked()){if(F._isRegion){I=F.getXValue();H=F.getYValue();if(I!=this.previousX||H!=this.previousY){if(!this._silent){this.onChange(I,H);this.fireEvent("change",{x:I,y:H});}}this.previousX=I;this.previousY=H;}else{E=F.getValue();if(E!=this.previousVal){if(!this._silent){this.onChange(E);this.fireEvent("change",E);}}this.previousVal=E;}}},toString:function(){return("Slider ("+this.type+") "+this.id);}});YAHOO.lang.augmentProto(C,YAHOO.util.EventProvider);YAHOO.widget.Slider=C;})();YAHOO.widget.SliderThumb=function(G,B,E,D,A,F,C){if(G){YAHOO.widget.SliderThumb.superclass.constructor.call(this,G,B);this.parentElId=B;}this.isTarget=false;this.tickSize=C;this.maintainOffset=true;this.initSlider(E,D,A,F,C);this.scroll=false;};YAHOO.extend(YAHOO.widget.SliderThumb,YAHOO.util.DD,{startOffset:null,dragOnly:true,_isHoriz:false,_prevVal:0,_graduated:false,getOffsetFromParent0:function(C){var A=YAHOO.util.Dom.getXY(this.getEl()),B=C||YAHOO.util.Dom.getXY(this.parentElId);return[(A[0]-B[0]),(A[1]-B[1])];},getOffsetFromParent:function(H){var A=this.getEl(),E,I,F,B,K,D,C,J,G;if(!this.deltaOffset){I=YAHOO.util.Dom.getXY(A);F=H||YAHOO.util.Dom.getXY(this.parentElId);E=[(I[0]-F[0]),(I[1]-F[1])];B=parseInt(YAHOO.util.Dom.getStyle(A,"left"),10);K=parseInt(YAHOO.util.Dom.getStyle(A,"top"),10);D=B-E[0];C=K-E[1];if(isNaN(D)||isNaN(C)){}else{this.deltaOffset=[D,C];}}else{J=parseInt(YAHOO.util.Dom.getStyle(A,"left"),10);G=parseInt(YAHOO.util.Dom.getStyle(A,"top"),10);E=[J+this.deltaOffset[0],G+this.deltaOffset[1]];}return E;},initSlider:function(D,C,A,E,B){this.initLeft=D;this.initRight=C;this.initUp=A;this.initDown=E;this.setXConstraint(D,C,B);this.setYConstraint(A,E,B);if(B&&B>1){this._graduated=true;}this._isHoriz=(D||C);this._isVert=(A||E);this._isRegion=(this._isHoriz&&this._isVert);},clearTicks:function(){YAHOO.widget.SliderThumb.superclass.clearTicks.call(this);this.tickSize=0;this._graduated=false;},getValue:function(){return(this._isHoriz)?this.getXValue():this.getYValue();},getXValue:function(){if(!this.available){return 0;}var A=this.getOffsetFromParent();if(YAHOO.lang.isNumber(A[0])){this.lastOffset=A;return(A[0]-this.startOffset[0]);}else{return(this.lastOffset[0]-this.startOffset[0]);}},getYValue:function(){if(!this.available){return 0;}var A=this.getOffsetFromParent();if(YAHOO.lang.isNumber(A[1])){this.lastOffset=A;return(A[1]-this.startOffset[1]);}else{return(this.lastOffset[1]-this.startOffset[1]);}},toString:function(){return"SliderThumb "+this.id;},onChange:function(A,B){}});(function(){var A=YAHOO.util.Event,B=YAHOO.widget;function C(I,F,H,D){var G=this,J={min:false,max:false},E,K;this.minSlider=I;this.maxSlider=F;this.activeSlider=I;this.isHoriz=I.thumb._isHoriz;E=this.minSlider.thumb.onMouseDown;K=this.maxSlider.thumb.onMouseDown;this.minSlider.thumb.onMouseDown=function(){G.activeSlider=G.minSlider;E.apply(this,arguments);};this.maxSlider.thumb.onMouseDown=function(){G.activeSlider=G.maxSlider;K.apply(this,arguments);};this.minSlider.thumb.onAvailable=function(){I.setStartSliderState();J.min=true;if(J.max){G.fireEvent("ready",G);}};this.maxSlider.thumb.onAvailable=function(){F.setStartSliderState();J.max=true;if(J.min){G.fireEvent("ready",G);}};I.onMouseDown=F.onMouseDown=function(L){return this.backgroundEnabled&&G._handleMouseDown(L);
};I.onDrag=F.onDrag=function(L){G._handleDrag(L);};I.onMouseUp=F.onMouseUp=function(L){G._handleMouseUp(L);};I._bindKeyEvents=function(){G._bindKeyEvents(this);};F._bindKeyEvents=function(){};I.subscribe("change",this._handleMinChange,I,this);I.subscribe("slideStart",this._handleSlideStart,I,this);I.subscribe("slideEnd",this._handleSlideEnd,I,this);F.subscribe("change",this._handleMaxChange,F,this);F.subscribe("slideStart",this._handleSlideStart,F,this);F.subscribe("slideEnd",this._handleSlideEnd,F,this);this.createEvent("ready",this);this.createEvent("change",this);this.createEvent("slideStart",this);this.createEvent("slideEnd",this);D=YAHOO.lang.isArray(D)?D:[0,H];D[0]=Math.min(Math.max(parseInt(D[0],10)|0,0),H);D[1]=Math.max(Math.min(parseInt(D[1],10)|0,H),0);if(D[0]>D[1]){D.splice(0,2,D[1],D[0]);}this.minVal=D[0];this.maxVal=D[1];this.minSlider.setValue(this.minVal,true,true,true);this.maxSlider.setValue(this.maxVal,true,true,true);}C.prototype={minVal:-1,maxVal:-1,minRange:0,_handleSlideStart:function(E,D){this.fireEvent("slideStart",D);},_handleSlideEnd:function(E,D){this.fireEvent("slideEnd",D);},_handleDrag:function(D){B.Slider.prototype.onDrag.call(this.activeSlider,D);},_handleMinChange:function(){this.activeSlider=this.minSlider;this.updateValue();},_handleMaxChange:function(){this.activeSlider=this.maxSlider;this.updateValue();},_bindKeyEvents:function(D){A.on(D.id,"keydown",this._handleKeyDown,this,true);A.on(D.id,"keypress",this._handleKeyPress,this,true);},_handleKeyDown:function(D){this.activeSlider.handleKeyDown.apply(this.activeSlider,arguments);},_handleKeyPress:function(D){this.activeSlider.handleKeyPress.apply(this.activeSlider,arguments);},setValues:function(H,K,I,E,J){var F=this.minSlider,M=this.maxSlider,D=F.thumb,L=M.thumb,N=this,G={min:false,max:false};if(D._isHoriz){D.setXConstraint(D.leftConstraint,L.rightConstraint,D.tickSize);L.setXConstraint(D.leftConstraint,L.rightConstraint,L.tickSize);}else{D.setYConstraint(D.topConstraint,L.bottomConstraint,D.tickSize);L.setYConstraint(D.topConstraint,L.bottomConstraint,L.tickSize);}this._oneTimeCallback(F,"slideEnd",function(){G.min=true;if(G.max){N.updateValue(J);setTimeout(function(){N._cleanEvent(F,"slideEnd");N._cleanEvent(M,"slideEnd");},0);}});this._oneTimeCallback(M,"slideEnd",function(){G.max=true;if(G.min){N.updateValue(J);setTimeout(function(){N._cleanEvent(F,"slideEnd");N._cleanEvent(M,"slideEnd");},0);}});F.setValue(H,I,E,false);M.setValue(K,I,E,false);},setMinValue:function(F,H,I,E){var G=this.minSlider,D=this;this.activeSlider=G;D=this;this._oneTimeCallback(G,"slideEnd",function(){D.updateValue(E);setTimeout(function(){D._cleanEvent(G,"slideEnd");},0);});G.setValue(F,H,I);},setMaxValue:function(D,H,I,F){var G=this.maxSlider,E=this;this.activeSlider=G;this._oneTimeCallback(G,"slideEnd",function(){E.updateValue(F);setTimeout(function(){E._cleanEvent(G,"slideEnd");},0);});G.setValue(D,H,I);},updateValue:function(J){var E=this.minSlider.getValue(),K=this.maxSlider.getValue(),F=false,D,M,H,I,L,G;if(E!=this.minVal||K!=this.maxVal){F=true;D=this.minSlider.thumb;M=this.maxSlider.thumb;H=this.isHoriz?"x":"y";G=this.minSlider.thumbCenterPoint[H]+this.maxSlider.thumbCenterPoint[H];I=Math.max(K-G-this.minRange,0);L=Math.min(-E-G-this.minRange,0);if(this.isHoriz){I=Math.min(I,M.rightConstraint);D.setXConstraint(D.leftConstraint,I,D.tickSize);M.setXConstraint(L,M.rightConstraint,M.tickSize);}else{I=Math.min(I,M.bottomConstraint);D.setYConstraint(D.leftConstraint,I,D.tickSize);M.setYConstraint(L,M.bottomConstraint,M.tickSize);}}this.minVal=E;this.maxVal=K;if(F&&!J){this.fireEvent("change",this);}},selectActiveSlider:function(H){var E=this.minSlider,D=this.maxSlider,J=E.isLocked()||!E.backgroundEnabled,G=D.isLocked()||!E.backgroundEnabled,F=YAHOO.util.Event,I;if(J||G){this.activeSlider=J?D:E;}else{if(this.isHoriz){I=F.getPageX(H)-E.thumb.initPageX-E.thumbCenterPoint.x;}else{I=F.getPageY(H)-E.thumb.initPageY-E.thumbCenterPoint.y;}this.activeSlider=I*2>D.getValue()+E.getValue()?D:E;}},_handleMouseDown:function(D){if(!D._handled){D._handled=true;this.selectActiveSlider(D);return B.Slider.prototype.onMouseDown.call(this.activeSlider,D);}else{return false;}},_handleMouseUp:function(D){B.Slider.prototype.onMouseUp.apply(this.activeSlider,arguments);},_oneTimeCallback:function(F,D,E){F.subscribe(D,function(){F.unsubscribe(D,arguments.callee);E.apply({},[].slice.apply(arguments));});},_cleanEvent:function(K,E){var J,I,D,G,H,F;if(K.__yui_events&&K.events[E]){for(I=K.__yui_events.length;I>=0;--I){if(K.__yui_events[I].type===E){J=K.__yui_events[I];break;}}if(J){H=J.subscribers;F=[];G=0;for(I=0,D=H.length;I<D;++I){if(H[I]){F[G++]=H[I];}}J.subscribers=F;}}}};YAHOO.lang.augmentProto(C,YAHOO.util.EventProvider);B.Slider.getHorizDualSlider=function(H,J,K,G,F,D){var I=new B.SliderThumb(J,H,0,G,0,0,F),E=new B.SliderThumb(K,H,0,G,0,0,F);return new C(new B.Slider(H,H,I,"horiz"),new B.Slider(H,H,E,"horiz"),G,D);};B.Slider.getVertDualSlider=function(H,J,K,G,F,D){var I=new B.SliderThumb(J,H,0,0,0,G,F),E=new B.SliderThumb(K,H,0,0,0,G,F);return new B.DualSlider(new B.Slider(H,H,I,"vert"),new B.Slider(H,H,E,"vert"),G,D);};YAHOO.widget.DualSlider=C;})();YAHOO.register("slider",YAHOO.widget.Slider,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){var B=YAHOO.util;var A=function(D,C,E,F){if(!D){}this.init(D,C,E,F);};A.NAME="Anim";A.prototype={toString:function(){var C=this.getEl()||{};var D=C.id||C.tagName;return(this.constructor.NAME+": "+D);},patterns:{noNegatives:/width|height|opacity|padding/i,offsetAttribute:/^((width|height)|(top|left))$/,defaultUnit:/width|height|top$|bottom$|left$|right$/i,offsetUnit:/\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i},doMethod:function(C,E,D){return this.method(this.currentFrame,E,D-E,this.totalFrames);},setAttribute:function(C,F,E){var D=this.getEl();if(this.patterns.noNegatives.test(C)){F=(F>0)?F:0;}if("style" in D){B.Dom.setStyle(D,C,F+E);}else{if(C in D){D[C]=F;}}},getAttribute:function(C){var E=this.getEl();var G=B.Dom.getStyle(E,C);if(G!=="auto"&&!this.patterns.offsetUnit.test(G)){return parseFloat(G);}var D=this.patterns.offsetAttribute.exec(C)||[];var H=!!(D[3]);var F=!!(D[2]);if("style" in E){if(F||(B.Dom.getStyle(E,"position")=="absolute"&&H)){G=E["offset"+D[0].charAt(0).toUpperCase()+D[0].substr(1)];}else{G=0;}}else{if(C in E){G=E[C];}}return G;},getDefaultUnit:function(C){if(this.patterns.defaultUnit.test(C)){return"px";}return"";},setRuntimeAttribute:function(D){var I;var E;var F=this.attributes;this.runtimeAttributes[D]={};var H=function(J){return(typeof J!=="undefined");};if(!H(F[D]["to"])&&!H(F[D]["by"])){return false;}I=(H(F[D]["from"]))?F[D]["from"]:this.getAttribute(D);if(H(F[D]["to"])){E=F[D]["to"];}else{if(H(F[D]["by"])){if(I.constructor==Array){E=[];for(var G=0,C=I.length;G<C;++G){E[G]=I[G]+F[D]["by"][G]*1;}}else{E=I+F[D]["by"]*1;}}}this.runtimeAttributes[D].start=I;this.runtimeAttributes[D].end=E;this.runtimeAttributes[D].unit=(H(F[D].unit))?F[D]["unit"]:this.getDefaultUnit(D);return true;},init:function(E,J,I,C){var D=false;var F=null;var H=0;E=B.Dom.get(E);this.attributes=J||{};this.duration=!YAHOO.lang.isUndefined(I)?I:1;this.method=C||B.Easing.easeNone;this.useSeconds=true;this.currentFrame=0;this.totalFrames=B.AnimMgr.fps;this.setEl=function(M){E=B.Dom.get(M);};this.getEl=function(){return E;};this.isAnimated=function(){return D;};this.getStartTime=function(){return F;};this.runtimeAttributes={};this.animate=function(){if(this.isAnimated()){return false;}this.currentFrame=0;this.totalFrames=(this.useSeconds)?Math.ceil(B.AnimMgr.fps*this.duration):this.duration;if(this.duration===0&&this.useSeconds){this.totalFrames=1;}B.AnimMgr.registerElement(this);return true;};this.stop=function(M){if(!this.isAnimated()){return false;}if(M){this.currentFrame=this.totalFrames;this._onTween.fire();}B.AnimMgr.stop(this);};var L=function(){this.onStart.fire();this.runtimeAttributes={};for(var M in this.attributes){this.setRuntimeAttribute(M);}D=true;H=0;F=new Date();};var K=function(){var O={duration:new Date()-this.getStartTime(),currentFrame:this.currentFrame};O.toString=function(){return("duration: "+O.duration+", currentFrame: "+O.currentFrame);};this.onTween.fire(O);var N=this.runtimeAttributes;for(var M in N){this.setAttribute(M,this.doMethod(M,N[M].start,N[M].end),N[M].unit);}H+=1;};var G=function(){var M=(new Date()-F)/1000;var N={duration:M,frames:H,fps:H/M};N.toString=function(){return("duration: "+N.duration+", frames: "+N.frames+", fps: "+N.fps);};D=false;H=0;this.onComplete.fire(N);};this._onStart=new B.CustomEvent("_start",this,true);this.onStart=new B.CustomEvent("start",this);this.onTween=new B.CustomEvent("tween",this);this._onTween=new B.CustomEvent("_tween",this,true);this.onComplete=new B.CustomEvent("complete",this);this._onComplete=new B.CustomEvent("_complete",this,true);this._onStart.subscribe(L);this._onTween.subscribe(K);this._onComplete.subscribe(G);}};B.Anim=A;})();YAHOO.util.AnimMgr=new function(){var C=null;var B=[];var A=0;this.fps=1000;this.delay=1;this.registerElement=function(F){B[B.length]=F;A+=1;F._onStart.fire();this.start();};this.unRegister=function(G,F){F=F||E(G);if(!G.isAnimated()||F==-1){return false;}G._onComplete.fire();B.splice(F,1);A-=1;if(A<=0){this.stop();}return true;};this.start=function(){if(C===null){C=setInterval(this.run,this.delay);}};this.stop=function(H){if(!H){clearInterval(C);for(var G=0,F=B.length;G<F;++G){this.unRegister(B[0],0);}B=[];C=null;A=0;}else{this.unRegister(H);}};this.run=function(){for(var H=0,F=B.length;H<F;++H){var G=B[H];if(!G||!G.isAnimated()){continue;}if(G.currentFrame<G.totalFrames||G.totalFrames===null){G.currentFrame+=1;if(G.useSeconds){D(G);}G._onTween.fire();}else{YAHOO.util.AnimMgr.stop(G,H);}}};var E=function(H){for(var G=0,F=B.length;G<F;++G){if(B[G]==H){return G;}}return -1;};var D=function(G){var J=G.totalFrames;var I=G.currentFrame;var H=(G.currentFrame*G.duration*1000/G.totalFrames);var F=(new Date()-G.getStartTime());var K=0;if(F<G.duration*1000){K=Math.round((F/H-1)*G.currentFrame);}else{K=J-(I+1);}if(K>0&&isFinite(K)){if(G.currentFrame+K>=J){K=J-(I+1);}G.currentFrame+=K;}};};YAHOO.util.Bezier=new function(){this.getPosition=function(E,D){var F=E.length;var C=[];for(var B=0;B<F;++B){C[B]=[E[B][0],E[B][1]];}for(var A=1;A<F;++A){for(B=0;B<F-A;++B){C[B][0]=(1-D)*C[B][0]+D*C[parseInt(B+1,10)][0];C[B][1]=(1-D)*C[B][1]+D*C[parseInt(B+1,10)][1];}}return[C[0][0],C[0][1]];};};(function(){var A=function(F,E,G,H){A.superclass.constructor.call(this,F,E,G,H);};A.NAME="ColorAnim";A.DEFAULT_BGCOLOR="#fff";var C=YAHOO.util;YAHOO.extend(A,C.Anim);var D=A.superclass;var B=A.prototype;B.patterns.color=/color$/i;B.patterns.rgb=/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;B.patterns.hex=/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;B.patterns.hex3=/^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;B.patterns.transparent=/^transparent|rgba\(0, 0, 0, 0\)$/;B.parseColor=function(E){if(E.length==3){return E;}var F=this.patterns.hex.exec(E);if(F&&F.length==4){return[parseInt(F[1],16),parseInt(F[2],16),parseInt(F[3],16)];}F=this.patterns.rgb.exec(E);if(F&&F.length==4){return[parseInt(F[1],10),parseInt(F[2],10),parseInt(F[3],10)];}F=this.patterns.hex3.exec(E);if(F&&F.length==4){return[parseInt(F[1]+F[1],16),parseInt(F[2]+F[2],16),parseInt(F[3]+F[3],16)];
}return null;};B.getAttribute=function(E){var G=this.getEl();if(this.patterns.color.test(E)){var I=YAHOO.util.Dom.getStyle(G,E);var H=this;if(this.patterns.transparent.test(I)){var F=YAHOO.util.Dom.getAncestorBy(G,function(J){return !H.patterns.transparent.test(I);});if(F){I=C.Dom.getStyle(F,E);}else{I=A.DEFAULT_BGCOLOR;}}}else{I=D.getAttribute.call(this,E);}return I;};B.doMethod=function(F,J,G){var I;if(this.patterns.color.test(F)){I=[];for(var H=0,E=J.length;H<E;++H){I[H]=D.doMethod.call(this,F,J[H],G[H]);}I="rgb("+Math.floor(I[0])+","+Math.floor(I[1])+","+Math.floor(I[2])+")";}else{I=D.doMethod.call(this,F,J,G);}return I;};B.setRuntimeAttribute=function(F){D.setRuntimeAttribute.call(this,F);if(this.patterns.color.test(F)){var H=this.attributes;var J=this.parseColor(this.runtimeAttributes[F].start);var G=this.parseColor(this.runtimeAttributes[F].end);if(typeof H[F]["to"]==="undefined"&&typeof H[F]["by"]!=="undefined"){G=this.parseColor(H[F].by);for(var I=0,E=J.length;I<E;++I){G[I]=J[I]+G[I];}}this.runtimeAttributes[F].start=J;this.runtimeAttributes[F].end=G;}};C.ColorAnim=A;})();
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
YAHOO.util.Easing={easeNone:function(B,A,D,C){return D*B/C+A;},easeIn:function(B,A,D,C){return D*(B/=C)*B+A;},easeOut:function(B,A,D,C){return -D*(B/=C)*(B-2)+A;},easeBoth:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B+A;}return -D/2*((--B)*(B-2)-1)+A;},easeInStrong:function(B,A,D,C){return D*(B/=C)*B*B*B+A;},easeOutStrong:function(B,A,D,C){return -D*((B=B/C-1)*B*B*B-1)+A;},easeBothStrong:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B*B*B+A;}return -D/2*((B-=2)*B*B*B-2)+A;},elasticIn:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F)==1){return A+G;}if(!E){E=F*0.3;}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}return -(B*Math.pow(2,10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E))+A;},elasticOut:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F)==1){return A+G;}if(!E){E=F*0.3;}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}return B*Math.pow(2,-10*C)*Math.sin((C*F-D)*(2*Math.PI)/E)+G+A;},elasticBoth:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F/2)==2){return A+G;}if(!E){E=F*(0.3*1.5);}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}if(C<1){return -0.5*(B*Math.pow(2,10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E))+A;}return B*Math.pow(2,-10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E)*0.5+G+A;},backIn:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}return E*(B/=D)*B*((C+1)*B-C)+A;},backOut:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}return E*((B=B/D-1)*B*((C+1)*B+C)+1)+A;},backBoth:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}if((B/=D/2)<1){return E/2*(B*B*(((C*=(1.525))+1)*B-C))+A;}return E/2*((B-=2)*B*(((C*=(1.525))+1)*B+C)+2)+A;},bounceIn:function(B,A,D,C){return D-YAHOO.util.Easing.bounceOut(C-B,0,D,C)+A;},bounceOut:function(B,A,D,C){if((B/=C)<(1/2.75)){return D*(7.5625*B*B)+A;}else{if(B<(2/2.75)){return D*(7.5625*(B-=(1.5/2.75))*B+0.75)+A;}else{if(B<(2.5/2.75)){return D*(7.5625*(B-=(2.25/2.75))*B+0.9375)+A;}}}return D*(7.5625*(B-=(2.625/2.75))*B+0.984375)+A;},bounceBoth:function(B,A,D,C){if(B<C/2){return YAHOO.util.Easing.bounceIn(B*2,0,D,C)*0.5+A;}return YAHOO.util.Easing.bounceOut(B*2-C,0,D,C)*0.5+D*0.5+A;}};(function(){var A=function(H,G,I,J){if(H){A.superclass.constructor.call(this,H,G,I,J);}};A.NAME="Motion";var E=YAHOO.util;YAHOO.extend(A,E.ColorAnim);var F=A.superclass;var C=A.prototype;C.patterns.points=/^points$/i;C.setAttribute=function(G,I,H){if(this.patterns.points.test(G)){H=H||"px";F.setAttribute.call(this,"left",I[0],H);F.setAttribute.call(this,"top",I[1],H);}else{F.setAttribute.call(this,G,I,H);}};C.getAttribute=function(G){if(this.patterns.points.test(G)){var H=[F.getAttribute.call(this,"left"),F.getAttribute.call(this,"top")];}else{H=F.getAttribute.call(this,G);}return H;};C.doMethod=function(G,K,H){var J=null;if(this.patterns.points.test(G)){var I=this.method(this.currentFrame,0,100,this.totalFrames)/100;J=E.Bezier.getPosition(this.runtimeAttributes[G],I);}else{J=F.doMethod.call(this,G,K,H);}return J;};C.setRuntimeAttribute=function(P){if(this.patterns.points.test(P)){var H=this.getEl();var J=this.attributes;var G;var L=J["points"]["control"]||[];var I;var M,O;if(L.length>0&&!(L[0] instanceof Array)){L=[L];}else{var K=[];for(M=0,O=L.length;M<O;++M){K[M]=L[M];}L=K;}if(E.Dom.getStyle(H,"position")=="static"){E.Dom.setStyle(H,"position","relative");}if(D(J["points"]["from"])){E.Dom.setXY(H,J["points"]["from"]);
}else{E.Dom.setXY(H,E.Dom.getXY(H));}G=this.getAttribute("points");if(D(J["points"]["to"])){I=B.call(this,J["points"]["to"],G);var N=E.Dom.getXY(this.getEl());for(M=0,O=L.length;M<O;++M){L[M]=B.call(this,L[M],G);}}else{if(D(J["points"]["by"])){I=[G[0]+J["points"]["by"][0],G[1]+J["points"]["by"][1]];for(M=0,O=L.length;M<O;++M){L[M]=[G[0]+L[M][0],G[1]+L[M][1]];}}}this.runtimeAttributes[P]=[G];if(L.length>0){this.runtimeAttributes[P]=this.runtimeAttributes[P].concat(L);}this.runtimeAttributes[P][this.runtimeAttributes[P].length]=I;}else{F.setRuntimeAttribute.call(this,P);}};var B=function(G,I){var H=E.Dom.getXY(this.getEl());G=[G[0]-H[0]+I[0],G[1]-H[1]+I[1]];return G;};var D=function(G){return(typeof G!=="undefined");};E.Motion=A;})();(function(){var D=function(F,E,G,H){if(F){D.superclass.constructor.call(this,F,E,G,H);}};D.NAME="Scroll";var B=YAHOO.util;YAHOO.extend(D,B.ColorAnim);var C=D.superclass;var A=D.prototype;A.doMethod=function(E,H,F){var G=null;if(E=="scroll"){G=[this.method(this.currentFrame,H[0],F[0]-H[0],this.totalFrames),this.method(this.currentFrame,H[1],F[1]-H[1],this.totalFrames)];}else{G=C.doMethod.call(this,E,H,F);}return G;};A.getAttribute=function(E){var G=null;var F=this.getEl();if(E=="scroll"){G=[F.scrollLeft,F.scrollTop];}else{G=C.getAttribute.call(this,E);}return G;};A.setAttribute=function(E,H,G){var F=this.getEl();if(E=="scroll"){F.scrollLeft=H[0];F.scrollTop=H[1];}else{C.setAttribute.call(this,E,H,G);}};B.Scroll=D;})();YAHOO.register("animation",YAHOO.util.Anim,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){YAHOO.util.Config=function(D){if(D){this.init(D);}};var B=YAHOO.lang,C=YAHOO.util.CustomEvent,A=YAHOO.util.Config;A.CONFIG_CHANGED_EVENT="configChanged";A.BOOLEAN_TYPE="boolean";A.prototype={owner:null,queueInProgress:false,config:null,initialConfig:null,eventQueue:null,configChangedEvent:null,init:function(D){this.owner=D;this.configChangedEvent=this.createEvent(A.CONFIG_CHANGED_EVENT);this.configChangedEvent.signature=C.LIST;this.queueInProgress=false;this.config={};this.initialConfig={};this.eventQueue=[];},checkBoolean:function(D){return(typeof D==A.BOOLEAN_TYPE);},checkNumber:function(D){return(!isNaN(D));},fireEvent:function(D,F){var E=this.config[D];if(E&&E.event){E.event.fire(F);}},addProperty:function(E,D){E=E.toLowerCase();this.config[E]=D;D.event=this.createEvent(E,{scope:this.owner});D.event.signature=C.LIST;D.key=E;if(D.handler){D.event.subscribe(D.handler,this.owner);}this.setProperty(E,D.value,true);if(!D.suppressEvent){this.queueProperty(E,D.value);}},getConfig:function(){var D={},F=this.config,G,E;for(G in F){if(B.hasOwnProperty(F,G)){E=F[G];if(E&&E.event){D[G]=E.value;}}}return D;},getProperty:function(D){var E=this.config[D.toLowerCase()];if(E&&E.event){return E.value;}else{return undefined;}},resetProperty:function(D){D=D.toLowerCase();var E=this.config[D];if(E&&E.event){if(this.initialConfig[D]&&!B.isUndefined(this.initialConfig[D])){this.setProperty(D,this.initialConfig[D]);return true;}}else{return false;}},setProperty:function(E,G,D){var F;E=E.toLowerCase();if(this.queueInProgress&&!D){this.queueProperty(E,G);return true;}else{F=this.config[E];if(F&&F.event){if(F.validator&&!F.validator(G)){return false;}else{F.value=G;if(!D){this.fireEvent(E,G);this.configChangedEvent.fire([E,G]);}return true;}}else{return false;}}},queueProperty:function(S,P){S=S.toLowerCase();var R=this.config[S],K=false,J,G,H,I,O,Q,F,M,N,D,L,T,E;if(R&&R.event){if(!B.isUndefined(P)&&R.validator&&!R.validator(P)){return false;}else{if(!B.isUndefined(P)){R.value=P;}else{P=R.value;}K=false;J=this.eventQueue.length;for(L=0;L<J;L++){G=this.eventQueue[L];if(G){H=G[0];I=G[1];if(H==S){this.eventQueue[L]=null;this.eventQueue.push([S,(!B.isUndefined(P)?P:I)]);K=true;break;}}}if(!K&&!B.isUndefined(P)){this.eventQueue.push([S,P]);}}if(R.supercedes){O=R.supercedes.length;for(T=0;T<O;T++){Q=R.supercedes[T];F=this.eventQueue.length;for(E=0;E<F;E++){M=this.eventQueue[E];if(M){N=M[0];D=M[1];if(N==Q.toLowerCase()){this.eventQueue.push([N,D]);this.eventQueue[E]=null;break;}}}}}return true;}else{return false;}},refireEvent:function(D){D=D.toLowerCase();var E=this.config[D];if(E&&E.event&&!B.isUndefined(E.value)){if(this.queueInProgress){this.queueProperty(D);}else{this.fireEvent(D,E.value);}}},applyConfig:function(D,G){var F,E;if(G){E={};for(F in D){if(B.hasOwnProperty(D,F)){E[F.toLowerCase()]=D[F];}}this.initialConfig=E;}for(F in D){if(B.hasOwnProperty(D,F)){this.queueProperty(F,D[F]);}}},refresh:function(){var D;for(D in this.config){if(B.hasOwnProperty(this.config,D)){this.refireEvent(D);}}},fireQueue:function(){var E,H,D,G,F;this.queueInProgress=true;for(E=0;E<this.eventQueue.length;E++){H=this.eventQueue[E];if(H){D=H[0];G=H[1];F=this.config[D];F.value=G;this.eventQueue[E]=null;this.fireEvent(D,G);}}this.queueInProgress=false;this.eventQueue=[];},subscribeToConfigEvent:function(E,F,H,D){var G=this.config[E.toLowerCase()];if(G&&G.event){if(!A.alreadySubscribed(G.event,F,H)){G.event.subscribe(F,H,D);}return true;}else{return false;}},unsubscribeFromConfigEvent:function(D,E,G){var F=this.config[D.toLowerCase()];if(F&&F.event){return F.event.unsubscribe(E,G);}else{return false;}},toString:function(){var D="Config";if(this.owner){D+=" ["+this.owner.toString()+"]";}return D;},outputEventQueue:function(){var D="",G,E,F=this.eventQueue.length;for(E=0;E<F;E++){G=this.eventQueue[E];if(G){D+=G[0]+"="+G[1]+", ";}}return D;},destroy:function(){var E=this.config,D,F;for(D in E){if(B.hasOwnProperty(E,D)){F=E[D];F.event.unsubscribeAll();F.event=null;}}this.configChangedEvent.unsubscribeAll();this.configChangedEvent=null;this.owner=null;this.config=null;this.initialConfig=null;this.eventQueue=null;}};A.alreadySubscribed=function(E,H,I){var F=E.subscribers.length,D,G;if(F>0){G=F-1;do{D=E.subscribers[G];if(D&&D.obj==I&&D.fn==H){return true;}}while(G--);}return false;};YAHOO.lang.augmentProto(A,YAHOO.util.EventProvider);}());(function(){YAHOO.widget.Module=function(R,Q){if(R){this.init(R,Q);}else{}};var F=YAHOO.util.Dom,D=YAHOO.util.Config,N=YAHOO.util.Event,M=YAHOO.util.CustomEvent,G=YAHOO.widget.Module,I=YAHOO.env.ua,H,P,O,E,A={"BEFORE_INIT":"beforeInit","INIT":"init","APPEND":"append","BEFORE_RENDER":"beforeRender","RENDER":"render","CHANGE_HEADER":"changeHeader","CHANGE_BODY":"changeBody","CHANGE_FOOTER":"changeFooter","CHANGE_CONTENT":"changeContent","DESTORY":"destroy","BEFORE_SHOW":"beforeShow","SHOW":"show","BEFORE_HIDE":"beforeHide","HIDE":"hide"},J={"VISIBLE":{key:"visible",value:true,validator:YAHOO.lang.isBoolean},"EFFECT":{key:"effect",suppressEvent:true,supercedes:["visible"]},"MONITOR_RESIZE":{key:"monitorresize",value:true},"APPEND_TO_DOCUMENT_BODY":{key:"appendtodocumentbody",value:false}};G.IMG_ROOT=null;G.IMG_ROOT_SSL=null;G.CSS_MODULE="yui-module";G.CSS_HEADER="hd";G.CSS_BODY="bd";G.CSS_FOOTER="ft";G.RESIZE_MONITOR_SECURE_URL="javascript:false;";G.RESIZE_MONITOR_BUFFER=1;G.textResizeEvent=new M("textResize");G.forceDocumentRedraw=function(){var Q=document.documentElement;if(Q){Q.className+=" ";Q.className=YAHOO.lang.trim(Q.className);}};function L(){if(!H){H=document.createElement("div");H.innerHTML=('<div class="'+G.CSS_HEADER+'"></div>'+'<div class="'+G.CSS_BODY+'"></div><div class="'+G.CSS_FOOTER+'"></div>');P=H.firstChild;O=P.nextSibling;E=O.nextSibling;}return H;}function K(){if(!P){L();}return(P.cloneNode(false));}function B(){if(!O){L();}return(O.cloneNode(false));}function C(){if(!E){L();}return(E.cloneNode(false));}G.prototype={constructor:G,element:null,header:null,body:null,footer:null,id:null,imageRoot:G.IMG_ROOT,initEvents:function(){var Q=M.LIST;
this.beforeInitEvent=this.createEvent(A.BEFORE_INIT);this.beforeInitEvent.signature=Q;this.initEvent=this.createEvent(A.INIT);this.initEvent.signature=Q;this.appendEvent=this.createEvent(A.APPEND);this.appendEvent.signature=Q;this.beforeRenderEvent=this.createEvent(A.BEFORE_RENDER);this.beforeRenderEvent.signature=Q;this.renderEvent=this.createEvent(A.RENDER);this.renderEvent.signature=Q;this.changeHeaderEvent=this.createEvent(A.CHANGE_HEADER);this.changeHeaderEvent.signature=Q;this.changeBodyEvent=this.createEvent(A.CHANGE_BODY);this.changeBodyEvent.signature=Q;this.changeFooterEvent=this.createEvent(A.CHANGE_FOOTER);this.changeFooterEvent.signature=Q;this.changeContentEvent=this.createEvent(A.CHANGE_CONTENT);this.changeContentEvent.signature=Q;this.destroyEvent=this.createEvent(A.DESTORY);this.destroyEvent.signature=Q;this.beforeShowEvent=this.createEvent(A.BEFORE_SHOW);this.beforeShowEvent.signature=Q;this.showEvent=this.createEvent(A.SHOW);this.showEvent.signature=Q;this.beforeHideEvent=this.createEvent(A.BEFORE_HIDE);this.beforeHideEvent.signature=Q;this.hideEvent=this.createEvent(A.HIDE);this.hideEvent.signature=Q;},platform:function(){var Q=navigator.userAgent.toLowerCase();if(Q.indexOf("windows")!=-1||Q.indexOf("win32")!=-1){return"windows";}else{if(Q.indexOf("macintosh")!=-1){return"mac";}else{return false;}}}(),browser:function(){var Q=navigator.userAgent.toLowerCase();if(Q.indexOf("opera")!=-1){return"opera";}else{if(Q.indexOf("msie 7")!=-1){return"ie7";}else{if(Q.indexOf("msie")!=-1){return"ie";}else{if(Q.indexOf("safari")!=-1){return"safari";}else{if(Q.indexOf("gecko")!=-1){return"gecko";}else{return false;}}}}}}(),isSecure:function(){if(window.location.href.toLowerCase().indexOf("https")===0){return true;}else{return false;}}(),initDefaultConfig:function(){this.cfg.addProperty(J.VISIBLE.key,{handler:this.configVisible,value:J.VISIBLE.value,validator:J.VISIBLE.validator});this.cfg.addProperty(J.EFFECT.key,{suppressEvent:J.EFFECT.suppressEvent,supercedes:J.EFFECT.supercedes});this.cfg.addProperty(J.MONITOR_RESIZE.key,{handler:this.configMonitorResize,value:J.MONITOR_RESIZE.value});this.cfg.addProperty(J.APPEND_TO_DOCUMENT_BODY.key,{value:J.APPEND_TO_DOCUMENT_BODY.value});},init:function(V,U){var S,W;this.initEvents();this.beforeInitEvent.fire(G);this.cfg=new D(this);if(this.isSecure){this.imageRoot=G.IMG_ROOT_SSL;}if(typeof V=="string"){S=V;V=document.getElementById(V);if(!V){V=(L()).cloneNode(false);V.id=S;}}this.id=F.generateId(V);this.element=V;W=this.element.firstChild;if(W){var R=false,Q=false,T=false;do{if(1==W.nodeType){if(!R&&F.hasClass(W,G.CSS_HEADER)){this.header=W;R=true;}else{if(!Q&&F.hasClass(W,G.CSS_BODY)){this.body=W;Q=true;}else{if(!T&&F.hasClass(W,G.CSS_FOOTER)){this.footer=W;T=true;}}}}}while((W=W.nextSibling));}this.initDefaultConfig();F.addClass(this.element,G.CSS_MODULE);if(U){this.cfg.applyConfig(U,true);}if(!D.alreadySubscribed(this.renderEvent,this.cfg.fireQueue,this.cfg)){this.renderEvent.subscribe(this.cfg.fireQueue,this.cfg,true);}this.initEvent.fire(G);},initResizeMonitor:function(){var R=(I.gecko&&this.platform=="windows");if(R){var Q=this;setTimeout(function(){Q._initResizeMonitor();},0);}else{this._initResizeMonitor();}},_initResizeMonitor:function(){var Q,S,U;function W(){G.textResizeEvent.fire();}if(!I.opera){S=F.get("_yuiResizeMonitor");var V=this._supportsCWResize();if(!S){S=document.createElement("iframe");if(this.isSecure&&G.RESIZE_MONITOR_SECURE_URL&&I.ie){S.src=G.RESIZE_MONITOR_SECURE_URL;}if(!V){U=["<html><head><script ",'type="text/javascript">',"window.onresize=function(){window.parent.","YAHOO.widget.Module.textResizeEvent.","fire();};<","/script></head>","<body></body></html>"].join("");S.src="data:text/html;charset=utf-8,"+encodeURIComponent(U);}S.id="_yuiResizeMonitor";S.title="Text Resize Monitor";S.style.position="absolute";S.style.visibility="hidden";var R=document.body,T=R.firstChild;if(T){R.insertBefore(S,T);}else{R.appendChild(S);}S.style.width="2em";S.style.height="2em";S.style.top=(-1*(S.offsetHeight+G.RESIZE_MONITOR_BUFFER))+"px";S.style.left="0";S.style.borderWidth="0";S.style.visibility="visible";if(I.webkit){Q=S.contentWindow.document;Q.open();Q.close();}}if(S&&S.contentWindow){G.textResizeEvent.subscribe(this.onDomResize,this,true);if(!G.textResizeInitialized){if(V){if(!N.on(S.contentWindow,"resize",W)){N.on(S,"resize",W);}}G.textResizeInitialized=true;}this.resizeMonitor=S;}}},_supportsCWResize:function(){var Q=true;if(I.gecko&&I.gecko<=1.8){Q=false;}return Q;},onDomResize:function(S,R){var Q=-1*(this.resizeMonitor.offsetHeight+G.RESIZE_MONITOR_BUFFER);this.resizeMonitor.style.top=Q+"px";this.resizeMonitor.style.left="0";},setHeader:function(R){var Q=this.header||(this.header=K());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeHeaderEvent.fire(R);this.changeContentEvent.fire();},appendToHeader:function(R){var Q=this.header||(this.header=K());Q.appendChild(R);this.changeHeaderEvent.fire(R);this.changeContentEvent.fire();},setBody:function(R){var Q=this.body||(this.body=B());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeBodyEvent.fire(R);this.changeContentEvent.fire();},appendToBody:function(R){var Q=this.body||(this.body=B());Q.appendChild(R);this.changeBodyEvent.fire(R);this.changeContentEvent.fire();},setFooter:function(R){var Q=this.footer||(this.footer=C());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeFooterEvent.fire(R);this.changeContentEvent.fire();},appendToFooter:function(R){var Q=this.footer||(this.footer=C());Q.appendChild(R);this.changeFooterEvent.fire(R);this.changeContentEvent.fire();},render:function(S,Q){var T=this,U;function R(V){if(typeof V=="string"){V=document.getElementById(V);}if(V){T._addToParent(V,T.element);T.appendEvent.fire();}}this.beforeRenderEvent.fire();if(!Q){Q=this.element;}if(S){R(S);}else{if(!F.inDocument(this.element)){return false;}}if(this.header&&!F.inDocument(this.header)){U=Q.firstChild;
if(U){Q.insertBefore(this.header,U);}else{Q.appendChild(this.header);}}if(this.body&&!F.inDocument(this.body)){if(this.footer&&F.isAncestor(this.moduleElement,this.footer)){Q.insertBefore(this.body,this.footer);}else{Q.appendChild(this.body);}}if(this.footer&&!F.inDocument(this.footer)){Q.appendChild(this.footer);}this.renderEvent.fire();return true;},destroy:function(){var Q;if(this.element){N.purgeElement(this.element,true);Q=this.element.parentNode;}if(Q){Q.removeChild(this.element);}this.element=null;this.header=null;this.body=null;this.footer=null;G.textResizeEvent.unsubscribe(this.onDomResize,this);this.cfg.destroy();this.cfg=null;this.destroyEvent.fire();},show:function(){this.cfg.setProperty("visible",true);},hide:function(){this.cfg.setProperty("visible",false);},configVisible:function(R,Q,S){var T=Q[0];if(T){this.beforeShowEvent.fire();F.setStyle(this.element,"display","block");this.showEvent.fire();}else{this.beforeHideEvent.fire();F.setStyle(this.element,"display","none");this.hideEvent.fire();}},configMonitorResize:function(S,R,T){var Q=R[0];if(Q){this.initResizeMonitor();}else{G.textResizeEvent.unsubscribe(this.onDomResize,this,true);this.resizeMonitor=null;}},_addToParent:function(Q,R){if(!this.cfg.getProperty("appendtodocumentbody")&&Q===document.body&&Q.firstChild){Q.insertBefore(R,Q.firstChild);}else{Q.appendChild(R);}},toString:function(){return"Module "+this.id;}};YAHOO.lang.augmentProto(G,YAHOO.util.EventProvider);}());(function(){YAHOO.widget.Overlay=function(P,O){YAHOO.widget.Overlay.superclass.constructor.call(this,P,O);};var I=YAHOO.lang,M=YAHOO.util.CustomEvent,G=YAHOO.widget.Module,N=YAHOO.util.Event,F=YAHOO.util.Dom,D=YAHOO.util.Config,K=YAHOO.env.ua,B=YAHOO.widget.Overlay,H="subscribe",E="unsubscribe",C="contained",J,A={"BEFORE_MOVE":"beforeMove","MOVE":"move"},L={"X":{key:"x",validator:I.isNumber,suppressEvent:true,supercedes:["iframe"]},"Y":{key:"y",validator:I.isNumber,suppressEvent:true,supercedes:["iframe"]},"XY":{key:"xy",suppressEvent:true,supercedes:["iframe"]},"CONTEXT":{key:"context",suppressEvent:true,supercedes:["iframe"]},"FIXED_CENTER":{key:"fixedcenter",value:false,supercedes:["iframe","visible"]},"WIDTH":{key:"width",suppressEvent:true,supercedes:["context","fixedcenter","iframe"]},"HEIGHT":{key:"height",suppressEvent:true,supercedes:["context","fixedcenter","iframe"]},"AUTO_FILL_HEIGHT":{key:"autofillheight",supercedes:["height"],value:"body"},"ZINDEX":{key:"zindex",value:null},"CONSTRAIN_TO_VIEWPORT":{key:"constraintoviewport",value:false,validator:I.isBoolean,supercedes:["iframe","x","y","xy"]},"IFRAME":{key:"iframe",value:(K.ie==6?true:false),validator:I.isBoolean,supercedes:["zindex"]},"PREVENT_CONTEXT_OVERLAP":{key:"preventcontextoverlap",value:false,validator:I.isBoolean,supercedes:["constraintoviewport"]}};B.IFRAME_SRC="javascript:false;";B.IFRAME_OFFSET=3;B.VIEWPORT_OFFSET=10;B.TOP_LEFT="tl";B.TOP_RIGHT="tr";B.BOTTOM_LEFT="bl";B.BOTTOM_RIGHT="br";B.CSS_OVERLAY="yui-overlay";B.STD_MOD_RE=/^\s*?(body|footer|header)\s*?$/i;B.windowScrollEvent=new M("windowScroll");B.windowResizeEvent=new M("windowResize");B.windowScrollHandler=function(P){var O=N.getTarget(P);if(!O||O===window||O===window.document){if(K.ie){if(!window.scrollEnd){window.scrollEnd=-1;}clearTimeout(window.scrollEnd);window.scrollEnd=setTimeout(function(){B.windowScrollEvent.fire();},1);}else{B.windowScrollEvent.fire();}}};B.windowResizeHandler=function(O){if(K.ie){if(!window.resizeEnd){window.resizeEnd=-1;}clearTimeout(window.resizeEnd);window.resizeEnd=setTimeout(function(){B.windowResizeEvent.fire();},100);}else{B.windowResizeEvent.fire();}};B._initialized=null;if(B._initialized===null){N.on(window,"scroll",B.windowScrollHandler);N.on(window,"resize",B.windowResizeHandler);B._initialized=true;}B._TRIGGER_MAP={"windowScroll":B.windowScrollEvent,"windowResize":B.windowResizeEvent,"textResize":G.textResizeEvent};YAHOO.extend(B,G,{CONTEXT_TRIGGERS:[],init:function(P,O){B.superclass.init.call(this,P);this.beforeInitEvent.fire(B);F.addClass(this.element,B.CSS_OVERLAY);if(O){this.cfg.applyConfig(O,true);}if(this.platform=="mac"&&K.gecko){if(!D.alreadySubscribed(this.showEvent,this.showMacGeckoScrollbars,this)){this.showEvent.subscribe(this.showMacGeckoScrollbars,this,true);}if(!D.alreadySubscribed(this.hideEvent,this.hideMacGeckoScrollbars,this)){this.hideEvent.subscribe(this.hideMacGeckoScrollbars,this,true);}}this.initEvent.fire(B);},initEvents:function(){B.superclass.initEvents.call(this);var O=M.LIST;this.beforeMoveEvent=this.createEvent(A.BEFORE_MOVE);this.beforeMoveEvent.signature=O;this.moveEvent=this.createEvent(A.MOVE);this.moveEvent.signature=O;},initDefaultConfig:function(){B.superclass.initDefaultConfig.call(this);var O=this.cfg;O.addProperty(L.X.key,{handler:this.configX,validator:L.X.validator,suppressEvent:L.X.suppressEvent,supercedes:L.X.supercedes});O.addProperty(L.Y.key,{handler:this.configY,validator:L.Y.validator,suppressEvent:L.Y.suppressEvent,supercedes:L.Y.supercedes});O.addProperty(L.XY.key,{handler:this.configXY,suppressEvent:L.XY.suppressEvent,supercedes:L.XY.supercedes});O.addProperty(L.CONTEXT.key,{handler:this.configContext,suppressEvent:L.CONTEXT.suppressEvent,supercedes:L.CONTEXT.supercedes});O.addProperty(L.FIXED_CENTER.key,{handler:this.configFixedCenter,value:L.FIXED_CENTER.value,validator:L.FIXED_CENTER.validator,supercedes:L.FIXED_CENTER.supercedes});O.addProperty(L.WIDTH.key,{handler:this.configWidth,suppressEvent:L.WIDTH.suppressEvent,supercedes:L.WIDTH.supercedes});O.addProperty(L.HEIGHT.key,{handler:this.configHeight,suppressEvent:L.HEIGHT.suppressEvent,supercedes:L.HEIGHT.supercedes});O.addProperty(L.AUTO_FILL_HEIGHT.key,{handler:this.configAutoFillHeight,value:L.AUTO_FILL_HEIGHT.value,validator:this._validateAutoFill,supercedes:L.AUTO_FILL_HEIGHT.supercedes});O.addProperty(L.ZINDEX.key,{handler:this.configzIndex,value:L.ZINDEX.value});O.addProperty(L.CONSTRAIN_TO_VIEWPORT.key,{handler:this.configConstrainToViewport,value:L.CONSTRAIN_TO_VIEWPORT.value,validator:L.CONSTRAIN_TO_VIEWPORT.validator,supercedes:L.CONSTRAIN_TO_VIEWPORT.supercedes});
O.addProperty(L.IFRAME.key,{handler:this.configIframe,value:L.IFRAME.value,validator:L.IFRAME.validator,supercedes:L.IFRAME.supercedes});O.addProperty(L.PREVENT_CONTEXT_OVERLAP.key,{value:L.PREVENT_CONTEXT_OVERLAP.value,validator:L.PREVENT_CONTEXT_OVERLAP.validator,supercedes:L.PREVENT_CONTEXT_OVERLAP.supercedes});},moveTo:function(O,P){this.cfg.setProperty("xy",[O,P]);},hideMacGeckoScrollbars:function(){F.replaceClass(this.element,"show-scrollbars","hide-scrollbars");},showMacGeckoScrollbars:function(){F.replaceClass(this.element,"hide-scrollbars","show-scrollbars");},_setDomVisibility:function(O){F.setStyle(this.element,"visibility",(O)?"visible":"hidden");if(O){F.removeClass(this.element,"yui-overlay-hidden");}else{F.addClass(this.element,"yui-overlay-hidden");}},configVisible:function(R,O,X){var Q=O[0],S=F.getStyle(this.element,"visibility"),Y=this.cfg.getProperty("effect"),V=[],U=(this.platform=="mac"&&K.gecko),g=D.alreadySubscribed,W,P,f,c,b,a,d,Z,T;if(S=="inherit"){f=this.element.parentNode;while(f.nodeType!=9&&f.nodeType!=11){S=F.getStyle(f,"visibility");if(S!="inherit"){break;}f=f.parentNode;}if(S=="inherit"){S="visible";}}if(Y){if(Y instanceof Array){Z=Y.length;for(c=0;c<Z;c++){W=Y[c];V[V.length]=W.effect(this,W.duration);}}else{V[V.length]=Y.effect(this,Y.duration);}}if(Q){if(U){this.showMacGeckoScrollbars();}if(Y){if(Q){if(S!="visible"||S===""){this.beforeShowEvent.fire();T=V.length;for(b=0;b<T;b++){P=V[b];if(b===0&&!g(P.animateInCompleteEvent,this.showEvent.fire,this.showEvent)){P.animateInCompleteEvent.subscribe(this.showEvent.fire,this.showEvent,true);}P.animateIn();}}}}else{if(S!="visible"||S===""){this.beforeShowEvent.fire();this._setDomVisibility(true);this.cfg.refireEvent("iframe");this.showEvent.fire();}else{this._setDomVisibility(true);}}}else{if(U){this.hideMacGeckoScrollbars();}if(Y){if(S=="visible"){this.beforeHideEvent.fire();T=V.length;for(a=0;a<T;a++){d=V[a];if(a===0&&!g(d.animateOutCompleteEvent,this.hideEvent.fire,this.hideEvent)){d.animateOutCompleteEvent.subscribe(this.hideEvent.fire,this.hideEvent,true);}d.animateOut();}}else{if(S===""){this._setDomVisibility(false);}}}else{if(S=="visible"||S===""){this.beforeHideEvent.fire();this._setDomVisibility(false);this.hideEvent.fire();}else{this._setDomVisibility(false);}}}},doCenterOnDOMEvent:function(){var O=this.cfg,P=O.getProperty("fixedcenter");if(O.getProperty("visible")){if(P&&(P!==C||this.fitsInViewport())){this.center();}}},fitsInViewport:function(){var S=B.VIEWPORT_OFFSET,Q=this.element,T=Q.offsetWidth,R=Q.offsetHeight,O=F.getViewportWidth(),P=F.getViewportHeight();return((T+S<O)&&(R+S<P));},configFixedCenter:function(S,Q,T){var U=Q[0],P=D.alreadySubscribed,R=B.windowResizeEvent,O=B.windowScrollEvent;if(U){this.center();if(!P(this.beforeShowEvent,this.center)){this.beforeShowEvent.subscribe(this.center);}if(!P(R,this.doCenterOnDOMEvent,this)){R.subscribe(this.doCenterOnDOMEvent,this,true);}if(!P(O,this.doCenterOnDOMEvent,this)){O.subscribe(this.doCenterOnDOMEvent,this,true);}}else{this.beforeShowEvent.unsubscribe(this.center);R.unsubscribe(this.doCenterOnDOMEvent,this);O.unsubscribe(this.doCenterOnDOMEvent,this);}},configHeight:function(R,P,S){var O=P[0],Q=this.element;F.setStyle(Q,"height",O);this.cfg.refireEvent("iframe");},configAutoFillHeight:function(T,S,P){var V=S[0],Q=this.cfg,U="autofillheight",W="height",R=Q.getProperty(U),O=this._autoFillOnHeightChange;Q.unsubscribeFromConfigEvent(W,O);G.textResizeEvent.unsubscribe(O);this.changeContentEvent.unsubscribe(O);if(R&&V!==R&&this[R]){F.setStyle(this[R],W,"");}if(V){V=I.trim(V.toLowerCase());Q.subscribeToConfigEvent(W,O,this[V],this);G.textResizeEvent.subscribe(O,this[V],this);this.changeContentEvent.subscribe(O,this[V],this);Q.setProperty(U,V,true);}},configWidth:function(R,O,S){var Q=O[0],P=this.element;F.setStyle(P,"width",Q);this.cfg.refireEvent("iframe");},configzIndex:function(Q,O,R){var S=O[0],P=this.element;if(!S){S=F.getStyle(P,"zIndex");if(!S||isNaN(S)){S=0;}}if(this.iframe||this.cfg.getProperty("iframe")===true){if(S<=0){S=1;}}F.setStyle(P,"zIndex",S);this.cfg.setProperty("zIndex",S,true);if(this.iframe){this.stackIframe();}},configXY:function(Q,P,R){var T=P[0],O=T[0],S=T[1];this.cfg.setProperty("x",O);this.cfg.setProperty("y",S);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},configX:function(Q,P,R){var O=P[0],S=this.cfg.getProperty("y");this.cfg.setProperty("x",O,true);this.cfg.setProperty("y",S,true);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");F.setX(this.element,O,true);this.cfg.setProperty("xy",[O,S],true);this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},configY:function(Q,P,R){var O=this.cfg.getProperty("x"),S=P[0];this.cfg.setProperty("x",O,true);this.cfg.setProperty("y",S,true);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");F.setY(this.element,S,true);this.cfg.setProperty("xy",[O,S],true);this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},showIframe:function(){var P=this.iframe,O;if(P){O=this.element.parentNode;if(O!=P.parentNode){this._addToParent(O,P);}P.style.display="block";}},hideIframe:function(){if(this.iframe){this.iframe.style.display="none";}},syncIframe:function(){var O=this.iframe,Q=this.element,S=B.IFRAME_OFFSET,P=(S*2),R;if(O){O.style.width=(Q.offsetWidth+P+"px");O.style.height=(Q.offsetHeight+P+"px");R=this.cfg.getProperty("xy");if(!I.isArray(R)||(isNaN(R[0])||isNaN(R[1]))){this.syncPosition();R=this.cfg.getProperty("xy");}F.setXY(O,[(R[0]-S),(R[1]-S)]);}},stackIframe:function(){if(this.iframe){var O=F.getStyle(this.element,"zIndex");if(!YAHOO.lang.isUndefined(O)&&!isNaN(O)){F.setStyle(this.iframe,"zIndex",(O-1));}}},configIframe:function(R,Q,S){var O=Q[0];function T(){var V=this.iframe,W=this.element,X;if(!V){if(!J){J=document.createElement("iframe");if(this.isSecure){J.src=B.IFRAME_SRC;}if(K.ie){J.style.filter="alpha(opacity=0)";
J.frameBorder=0;}else{J.style.opacity="0";}J.style.position="absolute";J.style.border="none";J.style.margin="0";J.style.padding="0";J.style.display="none";J.tabIndex=-1;}V=J.cloneNode(false);X=W.parentNode;var U=X||document.body;this._addToParent(U,V);this.iframe=V;}this.showIframe();this.syncIframe();this.stackIframe();if(!this._hasIframeEventListeners){this.showEvent.subscribe(this.showIframe);this.hideEvent.subscribe(this.hideIframe);this.changeContentEvent.subscribe(this.syncIframe);this._hasIframeEventListeners=true;}}function P(){T.call(this);this.beforeShowEvent.unsubscribe(P);this._iframeDeferred=false;}if(O){if(this.cfg.getProperty("visible")){T.call(this);}else{if(!this._iframeDeferred){this.beforeShowEvent.subscribe(P);this._iframeDeferred=true;}}}else{this.hideIframe();if(this._hasIframeEventListeners){this.showEvent.unsubscribe(this.showIframe);this.hideEvent.unsubscribe(this.hideIframe);this.changeContentEvent.unsubscribe(this.syncIframe);this._hasIframeEventListeners=false;}}},_primeXYFromDOM:function(){if(YAHOO.lang.isUndefined(this.cfg.getProperty("xy"))){this.syncPosition();this.cfg.refireEvent("xy");this.beforeShowEvent.unsubscribe(this._primeXYFromDOM);}},configConstrainToViewport:function(P,O,Q){var R=O[0];if(R){if(!D.alreadySubscribed(this.beforeMoveEvent,this.enforceConstraints,this)){this.beforeMoveEvent.subscribe(this.enforceConstraints,this,true);}if(!D.alreadySubscribed(this.beforeShowEvent,this._primeXYFromDOM)){this.beforeShowEvent.subscribe(this._primeXYFromDOM);}}else{this.beforeShowEvent.unsubscribe(this._primeXYFromDOM);this.beforeMoveEvent.unsubscribe(this.enforceConstraints,this);}},configContext:function(T,S,P){var W=S[0],Q,O,U,R,V=this.CONTEXT_TRIGGERS;if(W){Q=W[0];O=W[1];U=W[2];R=W[3];if(V&&V.length>0){R=(R||[]).concat(V);}if(Q){if(typeof Q=="string"){this.cfg.setProperty("context",[document.getElementById(Q),O,U,R],true);}if(O&&U){this.align(O,U);}if(this._contextTriggers){this._processTriggers(this._contextTriggers,E,this._alignOnTrigger);}if(R){this._processTriggers(R,H,this._alignOnTrigger);this._contextTriggers=R;}}}},_alignOnTrigger:function(P,O){this.align();},_findTriggerCE:function(O){var P=null;if(O instanceof M){P=O;}else{if(B._TRIGGER_MAP[O]){P=B._TRIGGER_MAP[O];}}return P;},_processTriggers:function(S,U,R){var Q,T;for(var P=0,O=S.length;P<O;++P){Q=S[P];T=this._findTriggerCE(Q);if(T){T[U](R,this,true);}else{this[U](Q,R);}}},align:function(P,O){var U=this.cfg.getProperty("context"),T=this,S,R,V;function Q(W,X){switch(P){case B.TOP_LEFT:T.moveTo(X,W);break;case B.TOP_RIGHT:T.moveTo((X-R.offsetWidth),W);break;case B.BOTTOM_LEFT:T.moveTo(X,(W-R.offsetHeight));break;case B.BOTTOM_RIGHT:T.moveTo((X-R.offsetWidth),(W-R.offsetHeight));break;}}if(U){S=U[0];R=this.element;T=this;if(!P){P=U[1];}if(!O){O=U[2];}if(R&&S){V=F.getRegion(S);switch(O){case B.TOP_LEFT:Q(V.top,V.left);break;case B.TOP_RIGHT:Q(V.top,V.right);break;case B.BOTTOM_LEFT:Q(V.bottom,V.left);break;case B.BOTTOM_RIGHT:Q(V.bottom,V.right);break;}}}},enforceConstraints:function(P,O,Q){var S=O[0];var R=this.getConstrainedXY(S[0],S[1]);this.cfg.setProperty("x",R[0],true);this.cfg.setProperty("y",R[1],true);this.cfg.setProperty("xy",R,true);},getConstrainedX:function(V){var S=this,O=S.element,e=O.offsetWidth,c=B.VIEWPORT_OFFSET,h=F.getViewportWidth(),d=F.getDocumentScrollLeft(),Y=(e+c<h),b=this.cfg.getProperty("context"),Q,X,j,T=false,f,W,g=d+c,P=d+h-e-c,i=V,U={"tltr":true,"blbr":true,"brbl":true,"trtl":true};var Z=function(){var k;if((S.cfg.getProperty("x")-d)>X){k=(X-e);}else{k=(X+j);}S.cfg.setProperty("x",(k+d),true);return k;};var R=function(){if((S.cfg.getProperty("x")-d)>X){return(W-c);}else{return(f-c);}};var a=function(){var k=R(),l;if(e>k){if(T){Z();}else{Z();T=true;l=a();}}return l;};if(V<g||V>P){if(Y){if(this.cfg.getProperty("preventcontextoverlap")&&b&&U[(b[1]+b[2])]){Q=b[0];X=F.getX(Q)-d;j=Q.offsetWidth;f=X;W=(h-(X+j));a();i=this.cfg.getProperty("x");}else{if(V<g){i=g;}else{if(V>P){i=P;}}}}else{i=c+d;}}return i;},getConstrainedY:function(Z){var W=this,P=W.element,i=P.offsetHeight,h=B.VIEWPORT_OFFSET,d=F.getViewportHeight(),g=F.getDocumentScrollTop(),e=(i+h<d),f=this.cfg.getProperty("context"),U,a,b,X=false,V,Q,c=g+h,S=g+d-i-h,O=Z,Y={"trbr":true,"tlbl":true,"bltl":true,"brtr":true};var T=function(){var k;if((W.cfg.getProperty("y")-g)>a){k=(a-i);}else{k=(a+b);}W.cfg.setProperty("y",(k+g),true);return k;};var R=function(){if((W.cfg.getProperty("y")-g)>a){return(Q-h);}else{return(V-h);}};var j=function(){var l=R(),k;if(i>l){if(X){T();}else{T();X=true;k=j();}}return k;};if(Z<c||Z>S){if(e){if(this.cfg.getProperty("preventcontextoverlap")&&f&&Y[(f[1]+f[2])]){U=f[0];b=U.offsetHeight;a=(F.getY(U)-g);V=a;Q=(d-(a+b));j();O=W.cfg.getProperty("y");}else{if(Z<c){O=c;}else{if(Z>S){O=S;}}}}else{O=h+g;}}return O;},getConstrainedXY:function(O,P){return[this.getConstrainedX(O),this.getConstrainedY(P)];},center:function(){var R=B.VIEWPORT_OFFSET,S=this.element.offsetWidth,Q=this.element.offsetHeight,P=F.getViewportWidth(),T=F.getViewportHeight(),O,U;if(S<P){O=(P/2)-(S/2)+F.getDocumentScrollLeft();}else{O=R+F.getDocumentScrollLeft();}if(Q<T){U=(T/2)-(Q/2)+F.getDocumentScrollTop();}else{U=R+F.getDocumentScrollTop();}this.cfg.setProperty("xy",[parseInt(O,10),parseInt(U,10)]);this.cfg.refireEvent("iframe");if(K.webkit){this.forceContainerRedraw();}},syncPosition:function(){var O=F.getXY(this.element);this.cfg.setProperty("x",O[0],true);this.cfg.setProperty("y",O[1],true);this.cfg.setProperty("xy",O,true);},onDomResize:function(Q,P){var O=this;B.superclass.onDomResize.call(this,Q,P);setTimeout(function(){O.syncPosition();O.cfg.refireEvent("iframe");O.cfg.refireEvent("context");},0);},_getComputedHeight:(function(){if(document.defaultView&&document.defaultView.getComputedStyle){return function(P){var O=null;if(P.ownerDocument&&P.ownerDocument.defaultView){var Q=P.ownerDocument.defaultView.getComputedStyle(P,"");if(Q){O=parseInt(Q.height,10);}}return(I.isNumber(O))?O:null;};}else{return function(P){var O=null;
if(P.style.pixelHeight){O=P.style.pixelHeight;}return(I.isNumber(O))?O:null;};}})(),_validateAutoFillHeight:function(O){return(!O)||(I.isString(O)&&B.STD_MOD_RE.test(O));},_autoFillOnHeightChange:function(R,P,Q){var O=this.cfg.getProperty("height");if((O&&O!=="auto")||(O===0)){this.fillHeight(Q);}},_getPreciseHeight:function(P){var O=P.offsetHeight;if(P.getBoundingClientRect){var Q=P.getBoundingClientRect();O=Q.bottom-Q.top;}return O;},fillHeight:function(R){if(R){var P=this.innerElement||this.element,O=[this.header,this.body,this.footer],V,W=0,X=0,T=0,Q=false;for(var U=0,S=O.length;U<S;U++){V=O[U];if(V){if(R!==V){X+=this._getPreciseHeight(V);}else{Q=true;}}}if(Q){if(K.ie||K.opera){F.setStyle(R,"height",0+"px");}W=this._getComputedHeight(P);if(W===null){F.addClass(P,"yui-override-padding");W=P.clientHeight;F.removeClass(P,"yui-override-padding");}T=Math.max(W-X,0);F.setStyle(R,"height",T+"px");if(R.offsetHeight!=T){T=Math.max(T-(R.offsetHeight-T),0);}F.setStyle(R,"height",T+"px");}}},bringToTop:function(){var S=[],R=this.element;function V(Z,Y){var b=F.getStyle(Z,"zIndex"),a=F.getStyle(Y,"zIndex"),X=(!b||isNaN(b))?0:parseInt(b,10),W=(!a||isNaN(a))?0:parseInt(a,10);if(X>W){return -1;}else{if(X<W){return 1;}else{return 0;}}}function Q(Y){var X=F.hasClass(Y,B.CSS_OVERLAY),W=YAHOO.widget.Panel;if(X&&!F.isAncestor(R,Y)){if(W&&F.hasClass(Y,W.CSS_PANEL)){S[S.length]=Y.parentNode;}else{S[S.length]=Y;}}}F.getElementsBy(Q,"DIV",document.body);S.sort(V);var O=S[0],U;if(O){U=F.getStyle(O,"zIndex");if(!isNaN(U)){var T=false;if(O!=R){T=true;}else{if(S.length>1){var P=F.getStyle(S[1],"zIndex");if(!isNaN(P)&&(U==P)){T=true;}}}if(T){this.cfg.setProperty("zindex",(parseInt(U,10)+2));}}}},destroy:function(){if(this.iframe){this.iframe.parentNode.removeChild(this.iframe);}this.iframe=null;B.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent,this);B.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent,this);G.textResizeEvent.unsubscribe(this._autoFillOnHeightChange);B.superclass.destroy.call(this);},forceContainerRedraw:function(){var O=this;F.addClass(O.element,"yui-force-redraw");setTimeout(function(){F.removeClass(O.element,"yui-force-redraw");},0);},toString:function(){return"Overlay "+this.id;}});}());(function(){YAHOO.widget.OverlayManager=function(G){this.init(G);};var D=YAHOO.widget.Overlay,C=YAHOO.util.Event,E=YAHOO.util.Dom,B=YAHOO.util.Config,F=YAHOO.util.CustomEvent,A=YAHOO.widget.OverlayManager;A.CSS_FOCUSED="focused";A.prototype={constructor:A,overlays:null,initDefaultConfig:function(){this.cfg.addProperty("overlays",{suppressEvent:true});this.cfg.addProperty("focusevent",{value:"mousedown"});},init:function(I){this.cfg=new B(this);this.initDefaultConfig();if(I){this.cfg.applyConfig(I,true);}this.cfg.fireQueue();var H=null;this.getActive=function(){return H;};this.focus=function(J){var K=this.find(J);if(K){K.focus();}};this.remove=function(K){var M=this.find(K),J;if(M){if(H==M){H=null;}var L=(M.element===null&&M.cfg===null)?true:false;if(!L){J=E.getStyle(M.element,"zIndex");M.cfg.setProperty("zIndex",-1000,true);}this.overlays.sort(this.compareZIndexDesc);this.overlays=this.overlays.slice(0,(this.overlays.length-1));M.hideEvent.unsubscribe(M.blur);M.destroyEvent.unsubscribe(this._onOverlayDestroy,M);M.focusEvent.unsubscribe(this._onOverlayFocusHandler,M);M.blurEvent.unsubscribe(this._onOverlayBlurHandler,M);if(!L){C.removeListener(M.element,this.cfg.getProperty("focusevent"),this._onOverlayElementFocus);M.cfg.setProperty("zIndex",J,true);M.cfg.setProperty("manager",null);}if(M.focusEvent._managed){M.focusEvent=null;}if(M.blurEvent._managed){M.blurEvent=null;}if(M.focus._managed){M.focus=null;}if(M.blur._managed){M.blur=null;}}};this.blurAll=function(){var K=this.overlays.length,J;if(K>0){J=K-1;do{this.overlays[J].blur();}while(J--);}};this._manageBlur=function(J){var K=false;if(H==J){E.removeClass(H.element,A.CSS_FOCUSED);H=null;K=true;}return K;};this._manageFocus=function(J){var K=false;if(H!=J){if(H){H.blur();}H=J;this.bringToTop(H);E.addClass(H.element,A.CSS_FOCUSED);K=true;}return K;};var G=this.cfg.getProperty("overlays");if(!this.overlays){this.overlays=[];}if(G){this.register(G);this.overlays.sort(this.compareZIndexDesc);}},_onOverlayElementFocus:function(I){var G=C.getTarget(I),H=this.close;if(H&&(G==H||E.isAncestor(H,G))){this.blur();}else{this.focus();}},_onOverlayDestroy:function(H,G,I){this.remove(I);},_onOverlayFocusHandler:function(H,G,I){this._manageFocus(I);},_onOverlayBlurHandler:function(H,G,I){this._manageBlur(I);},_bindFocus:function(G){var H=this;if(!G.focusEvent){G.focusEvent=G.createEvent("focus");G.focusEvent.signature=F.LIST;G.focusEvent._managed=true;}else{G.focusEvent.subscribe(H._onOverlayFocusHandler,G,H);}if(!G.focus){C.on(G.element,H.cfg.getProperty("focusevent"),H._onOverlayElementFocus,null,G);G.focus=function(){if(H._manageFocus(this)){if(this.cfg.getProperty("visible")&&this.focusFirst){this.focusFirst();}this.focusEvent.fire();}};G.focus._managed=true;}},_bindBlur:function(G){var H=this;if(!G.blurEvent){G.blurEvent=G.createEvent("blur");G.blurEvent.signature=F.LIST;G.focusEvent._managed=true;}else{G.blurEvent.subscribe(H._onOverlayBlurHandler,G,H);}if(!G.blur){G.blur=function(){if(H._manageBlur(this)){this.blurEvent.fire();}};G.blur._managed=true;}G.hideEvent.subscribe(G.blur);},_bindDestroy:function(G){var H=this;G.destroyEvent.subscribe(H._onOverlayDestroy,G,H);},_syncZIndex:function(G){var H=E.getStyle(G.element,"zIndex");if(!isNaN(H)){G.cfg.setProperty("zIndex",parseInt(H,10));}else{G.cfg.setProperty("zIndex",0);}},register:function(G){var J=false,H,I;if(G instanceof D){G.cfg.addProperty("manager",{value:this});this._bindFocus(G);this._bindBlur(G);this._bindDestroy(G);this._syncZIndex(G);this.overlays.push(G);this.bringToTop(G);J=true;}else{if(G instanceof Array){for(H=0,I=G.length;H<I;H++){J=this.register(G[H])||J;}}}return J;},bringToTop:function(M){var I=this.find(M),L,G,J;if(I){J=this.overlays;J.sort(this.compareZIndexDesc);G=J[0];if(G){L=E.getStyle(G.element,"zIndex");
if(!isNaN(L)){var K=false;if(G!==I){K=true;}else{if(J.length>1){var H=E.getStyle(J[1].element,"zIndex");if(!isNaN(H)&&(L==H)){K=true;}}}if(K){I.cfg.setProperty("zindex",(parseInt(L,10)+2));}}J.sort(this.compareZIndexDesc);}}},find:function(G){var K=G instanceof D,I=this.overlays,M=I.length,J=null,L,H;if(K||typeof G=="string"){for(H=M-1;H>=0;H--){L=I[H];if((K&&(L===G))||(L.id==G)){J=L;break;}}}return J;},compareZIndexDesc:function(J,I){var H=(J.cfg)?J.cfg.getProperty("zIndex"):null,G=(I.cfg)?I.cfg.getProperty("zIndex"):null;if(H===null&&G===null){return 0;}else{if(H===null){return 1;}else{if(G===null){return -1;}else{if(H>G){return -1;}else{if(H<G){return 1;}else{return 0;}}}}}},showAll:function(){var H=this.overlays,I=H.length,G;for(G=I-1;G>=0;G--){H[G].show();}},hideAll:function(){var H=this.overlays,I=H.length,G;for(G=I-1;G>=0;G--){H[G].hide();}},toString:function(){return"OverlayManager";}};}());(function(){YAHOO.widget.Tooltip=function(P,O){YAHOO.widget.Tooltip.superclass.constructor.call(this,P,O);};var E=YAHOO.lang,N=YAHOO.util.Event,M=YAHOO.util.CustomEvent,C=YAHOO.util.Dom,J=YAHOO.widget.Tooltip,H=YAHOO.env.ua,G=(H.ie&&(H.ie<=6||document.compatMode=="BackCompat")),F,I={"PREVENT_OVERLAP":{key:"preventoverlap",value:true,validator:E.isBoolean,supercedes:["x","y","xy"]},"SHOW_DELAY":{key:"showdelay",value:200,validator:E.isNumber},"AUTO_DISMISS_DELAY":{key:"autodismissdelay",value:5000,validator:E.isNumber},"HIDE_DELAY":{key:"hidedelay",value:250,validator:E.isNumber},"TEXT":{key:"text",suppressEvent:true},"CONTAINER":{key:"container"},"DISABLED":{key:"disabled",value:false,suppressEvent:true}},A={"CONTEXT_MOUSE_OVER":"contextMouseOver","CONTEXT_MOUSE_OUT":"contextMouseOut","CONTEXT_TRIGGER":"contextTrigger"};J.CSS_TOOLTIP="yui-tt";function K(Q,O){var P=this.cfg,R=P.getProperty("width");if(R==O){P.setProperty("width",Q);}}function D(P,O){if("_originalWidth" in this){K.call(this,this._originalWidth,this._forcedWidth);}var Q=document.body,U=this.cfg,T=U.getProperty("width"),R,S;if((!T||T=="auto")&&(U.getProperty("container")!=Q||U.getProperty("x")>=C.getViewportWidth()||U.getProperty("y")>=C.getViewportHeight())){S=this.element.cloneNode(true);S.style.visibility="hidden";S.style.top="0px";S.style.left="0px";Q.appendChild(S);R=(S.offsetWidth+"px");Q.removeChild(S);S=null;U.setProperty("width",R);U.refireEvent("xy");this._originalWidth=T||"";this._forcedWidth=R;}}function B(P,O,Q){this.render(Q);}function L(){N.onDOMReady(B,this.cfg.getProperty("container"),this);}YAHOO.extend(J,YAHOO.widget.Overlay,{init:function(P,O){J.superclass.init.call(this,P);this.beforeInitEvent.fire(J);C.addClass(this.element,J.CSS_TOOLTIP);if(O){this.cfg.applyConfig(O,true);}this.cfg.queueProperty("visible",false);this.cfg.queueProperty("constraintoviewport",true);this.setBody("");this.subscribe("changeContent",D);this.subscribe("init",L);this.subscribe("render",this.onRender);this.initEvent.fire(J);},initEvents:function(){J.superclass.initEvents.call(this);var O=M.LIST;this.contextMouseOverEvent=this.createEvent(A.CONTEXT_MOUSE_OVER);this.contextMouseOverEvent.signature=O;this.contextMouseOutEvent=this.createEvent(A.CONTEXT_MOUSE_OUT);this.contextMouseOutEvent.signature=O;this.contextTriggerEvent=this.createEvent(A.CONTEXT_TRIGGER);this.contextTriggerEvent.signature=O;},initDefaultConfig:function(){J.superclass.initDefaultConfig.call(this);this.cfg.addProperty(I.PREVENT_OVERLAP.key,{value:I.PREVENT_OVERLAP.value,validator:I.PREVENT_OVERLAP.validator,supercedes:I.PREVENT_OVERLAP.supercedes});this.cfg.addProperty(I.SHOW_DELAY.key,{handler:this.configShowDelay,value:200,validator:I.SHOW_DELAY.validator});this.cfg.addProperty(I.AUTO_DISMISS_DELAY.key,{handler:this.configAutoDismissDelay,value:I.AUTO_DISMISS_DELAY.value,validator:I.AUTO_DISMISS_DELAY.validator});this.cfg.addProperty(I.HIDE_DELAY.key,{handler:this.configHideDelay,value:I.HIDE_DELAY.value,validator:I.HIDE_DELAY.validator});this.cfg.addProperty(I.TEXT.key,{handler:this.configText,suppressEvent:I.TEXT.suppressEvent});this.cfg.addProperty(I.CONTAINER.key,{handler:this.configContainer,value:document.body});this.cfg.addProperty(I.DISABLED.key,{handler:this.configContainer,value:I.DISABLED.value,supressEvent:I.DISABLED.suppressEvent});},configText:function(P,O,Q){var R=O[0];if(R){this.setBody(R);}},configContainer:function(Q,P,R){var O=P[0];if(typeof O=="string"){this.cfg.setProperty("container",document.getElementById(O),true);}},_removeEventListeners:function(){var R=this._context,O,Q,P;if(R){O=R.length;if(O>0){P=O-1;do{Q=R[P];N.removeListener(Q,"mouseover",this.onContextMouseOver);N.removeListener(Q,"mousemove",this.onContextMouseMove);N.removeListener(Q,"mouseout",this.onContextMouseOut);}while(P--);}}},configContext:function(T,P,U){var S=P[0],V,O,R,Q;if(S){if(!(S instanceof Array)){if(typeof S=="string"){this.cfg.setProperty("context",[document.getElementById(S)],true);}else{this.cfg.setProperty("context",[S],true);}S=this.cfg.getProperty("context");}this._removeEventListeners();this._context=S;V=this._context;if(V){O=V.length;if(O>0){Q=O-1;do{R=V[Q];N.on(R,"mouseover",this.onContextMouseOver,this);N.on(R,"mousemove",this.onContextMouseMove,this);N.on(R,"mouseout",this.onContextMouseOut,this);}while(Q--);}}}},onContextMouseMove:function(P,O){O.pageX=N.getPageX(P);O.pageY=N.getPageY(P);},onContextMouseOver:function(Q,P){var O=this;if(O.title){P._tempTitle=O.title;O.title="";}if(P.fireEvent("contextMouseOver",O,Q)!==false&&!P.cfg.getProperty("disabled")){if(P.hideProcId){clearTimeout(P.hideProcId);P.hideProcId=null;}N.on(O,"mousemove",P.onContextMouseMove,P);P.showProcId=P.doShow(Q,O);}},onContextMouseOut:function(Q,P){var O=this;if(P._tempTitle){O.title=P._tempTitle;P._tempTitle=null;}if(P.showProcId){clearTimeout(P.showProcId);P.showProcId=null;}if(P.hideProcId){clearTimeout(P.hideProcId);P.hideProcId=null;}P.fireEvent("contextMouseOut",O,Q);P.hideProcId=setTimeout(function(){P.hide();},P.cfg.getProperty("hidedelay"));},doShow:function(Q,O){var R=25,P=this;
if(H.opera&&O.tagName&&O.tagName.toUpperCase()=="A"){R+=12;}return setTimeout(function(){var S=P.cfg.getProperty("text");if(P._tempTitle&&(S===""||YAHOO.lang.isUndefined(S)||YAHOO.lang.isNull(S))){P.setBody(P._tempTitle);}else{P.cfg.refireEvent("text");}P.moveTo(P.pageX,P.pageY+R);if(P.cfg.getProperty("preventoverlap")){P.preventOverlap(P.pageX,P.pageY);}N.removeListener(O,"mousemove",P.onContextMouseMove);P.contextTriggerEvent.fire(O);P.show();P.hideProcId=P.doHide();},this.cfg.getProperty("showdelay"));},doHide:function(){var O=this;return setTimeout(function(){O.hide();},this.cfg.getProperty("autodismissdelay"));},preventOverlap:function(S,R){var O=this.element.offsetHeight,Q=new YAHOO.util.Point(S,R),P=C.getRegion(this.element);P.top-=5;P.left-=5;P.right+=5;P.bottom+=5;if(P.contains(Q)){this.cfg.setProperty("y",(R-O-5));}},onRender:function(S,R){function T(){var W=this.element,V=this.underlay;if(V){V.style.width=(W.offsetWidth+6)+"px";V.style.height=(W.offsetHeight+1)+"px";}}function P(){C.addClass(this.underlay,"yui-tt-shadow-visible");if(H.ie){this.forceUnderlayRedraw();}}function O(){C.removeClass(this.underlay,"yui-tt-shadow-visible");}function U(){var X=this.underlay,W,V,Z,Y;if(!X){W=this.element;V=YAHOO.widget.Module;Z=H.ie;Y=this;if(!F){F=document.createElement("div");F.className="yui-tt-shadow";}X=F.cloneNode(false);W.appendChild(X);this.underlay=X;this._shadow=this.underlay;P.call(this);this.subscribe("beforeShow",P);this.subscribe("hide",O);if(G){window.setTimeout(function(){T.call(Y);},0);this.cfg.subscribeToConfigEvent("width",T);this.cfg.subscribeToConfigEvent("height",T);this.subscribe("changeContent",T);V.textResizeEvent.subscribe(T,this,true);this.subscribe("destroy",function(){V.textResizeEvent.unsubscribe(T,this);});}}}function Q(){U.call(this);this.unsubscribe("beforeShow",Q);}if(this.cfg.getProperty("visible")){U.call(this);}else{this.subscribe("beforeShow",Q);}},forceUnderlayRedraw:function(){var O=this;C.addClass(O.underlay,"yui-force-redraw");setTimeout(function(){C.removeClass(O.underlay,"yui-force-redraw");},0);},destroy:function(){this._removeEventListeners();J.superclass.destroy.call(this);},toString:function(){return"Tooltip "+this.id;}});}());(function(){YAHOO.widget.Panel=function(V,U){YAHOO.widget.Panel.superclass.constructor.call(this,V,U);};var S=null;var E=YAHOO.lang,F=YAHOO.util,A=F.Dom,T=F.Event,M=F.CustomEvent,K=YAHOO.util.KeyListener,I=F.Config,H=YAHOO.widget.Overlay,O=YAHOO.widget.Panel,L=YAHOO.env.ua,P=(L.ie&&(L.ie<=6||document.compatMode=="BackCompat")),G,Q,C,D={"SHOW_MASK":"showMask","HIDE_MASK":"hideMask","DRAG":"drag"},N={"CLOSE":{key:"close",value:true,validator:E.isBoolean,supercedes:["visible"]},"DRAGGABLE":{key:"draggable",value:(F.DD?true:false),validator:E.isBoolean,supercedes:["visible"]},"DRAG_ONLY":{key:"dragonly",value:false,validator:E.isBoolean,supercedes:["draggable"]},"UNDERLAY":{key:"underlay",value:"shadow",supercedes:["visible"]},"MODAL":{key:"modal",value:false,validator:E.isBoolean,supercedes:["visible","zindex"]},"KEY_LISTENERS":{key:"keylisteners",suppressEvent:true,supercedes:["visible"]},"STRINGS":{key:"strings",supercedes:["close"],validator:E.isObject,value:{close:"Close"}}};O.CSS_PANEL="yui-panel";O.CSS_PANEL_CONTAINER="yui-panel-container";O.FOCUSABLE=["a","button","select","textarea","input","iframe"];function J(V,U){if(!this.header&&this.cfg.getProperty("draggable")){this.setHeader("&#160;");}}function R(V,U,W){var Z=W[0],X=W[1],Y=this.cfg,a=Y.getProperty("width");if(a==X){Y.setProperty("width",Z);}this.unsubscribe("hide",R,W);}function B(V,U){var Y,X,W;if(P){Y=this.cfg;X=Y.getProperty("width");if(!X||X=="auto"){W=(this.element.offsetWidth+"px");Y.setProperty("width",W);this.subscribe("hide",R,[(X||""),W]);}}}YAHOO.extend(O,H,{init:function(V,U){O.superclass.init.call(this,V);this.beforeInitEvent.fire(O);A.addClass(this.element,O.CSS_PANEL);this.buildWrapper();if(U){this.cfg.applyConfig(U,true);}this.subscribe("showMask",this._addFocusHandlers);this.subscribe("hideMask",this._removeFocusHandlers);this.subscribe("beforeRender",J);this.subscribe("render",function(){this.setFirstLastFocusable();this.subscribe("changeContent",this.setFirstLastFocusable);});this.subscribe("show",this.focusFirst);this.initEvent.fire(O);},_onElementFocus:function(Z){if(S===this){var Y=T.getTarget(Z),X=document.documentElement,V=(Y!==X&&Y!==window);if(V&&Y!==this.element&&Y!==this.mask&&!A.isAncestor(this.element,Y)){try{if(this.firstElement){this.firstElement.focus();}else{if(this._modalFocus){this._modalFocus.focus();}else{this.innerElement.focus();}}}catch(W){try{if(V&&Y!==document.body){Y.blur();}}catch(U){}}}}},_addFocusHandlers:function(V,U){if(!this.firstElement){if(L.webkit||L.opera){if(!this._modalFocus){this._createHiddenFocusElement();}}else{this.innerElement.tabIndex=0;}}this.setTabLoop(this.firstElement,this.lastElement);T.onFocus(document.documentElement,this._onElementFocus,this,true);S=this;},_createHiddenFocusElement:function(){var U=document.createElement("button");U.style.height="1px";U.style.width="1px";U.style.position="absolute";U.style.left="-10000em";U.style.opacity=0;U.tabIndex=-1;this.innerElement.appendChild(U);this._modalFocus=U;},_removeFocusHandlers:function(V,U){T.removeFocusListener(document.documentElement,this._onElementFocus,this);if(S==this){S=null;}},focusFirst:function(W,U,Y){var V=this.firstElement;if(U&&U[1]){T.stopEvent(U[1]);}if(V){try{V.focus();}catch(X){}}},focusLast:function(W,U,Y){var V=this.lastElement;if(U&&U[1]){T.stopEvent(U[1]);}if(V){try{V.focus();}catch(X){}}},setTabLoop:function(X,Z){var V=this.preventBackTab,W=this.preventTabOut,U=this.showEvent,Y=this.hideEvent;if(V){V.disable();U.unsubscribe(V.enable,V);Y.unsubscribe(V.disable,V);V=this.preventBackTab=null;}if(W){W.disable();U.unsubscribe(W.enable,W);Y.unsubscribe(W.disable,W);W=this.preventTabOut=null;}if(X){this.preventBackTab=new K(X,{shift:true,keys:9},{fn:this.focusLast,scope:this,correctScope:true});V=this.preventBackTab;U.subscribe(V.enable,V,true);
Y.subscribe(V.disable,V,true);}if(Z){this.preventTabOut=new K(Z,{shift:false,keys:9},{fn:this.focusFirst,scope:this,correctScope:true});W=this.preventTabOut;U.subscribe(W.enable,W,true);Y.subscribe(W.disable,W,true);}},getFocusableElements:function(U){U=U||this.innerElement;var X={};for(var W=0;W<O.FOCUSABLE.length;W++){X[O.FOCUSABLE[W]]=true;}function V(Y){if(Y.focus&&Y.type!=="hidden"&&!Y.disabled&&X[Y.tagName.toLowerCase()]){return true;}return false;}return A.getElementsBy(V,null,U);},setFirstLastFocusable:function(){this.firstElement=null;this.lastElement=null;var U=this.getFocusableElements();this.focusableElements=U;if(U.length>0){this.firstElement=U[0];this.lastElement=U[U.length-1];}if(this.cfg.getProperty("modal")){this.setTabLoop(this.firstElement,this.lastElement);}},initEvents:function(){O.superclass.initEvents.call(this);var U=M.LIST;this.showMaskEvent=this.createEvent(D.SHOW_MASK);this.showMaskEvent.signature=U;this.hideMaskEvent=this.createEvent(D.HIDE_MASK);this.hideMaskEvent.signature=U;this.dragEvent=this.createEvent(D.DRAG);this.dragEvent.signature=U;},initDefaultConfig:function(){O.superclass.initDefaultConfig.call(this);this.cfg.addProperty(N.CLOSE.key,{handler:this.configClose,value:N.CLOSE.value,validator:N.CLOSE.validator,supercedes:N.CLOSE.supercedes});this.cfg.addProperty(N.DRAGGABLE.key,{handler:this.configDraggable,value:(F.DD)?true:false,validator:N.DRAGGABLE.validator,supercedes:N.DRAGGABLE.supercedes});this.cfg.addProperty(N.DRAG_ONLY.key,{value:N.DRAG_ONLY.value,validator:N.DRAG_ONLY.validator,supercedes:N.DRAG_ONLY.supercedes});this.cfg.addProperty(N.UNDERLAY.key,{handler:this.configUnderlay,value:N.UNDERLAY.value,supercedes:N.UNDERLAY.supercedes});this.cfg.addProperty(N.MODAL.key,{handler:this.configModal,value:N.MODAL.value,validator:N.MODAL.validator,supercedes:N.MODAL.supercedes});this.cfg.addProperty(N.KEY_LISTENERS.key,{handler:this.configKeyListeners,suppressEvent:N.KEY_LISTENERS.suppressEvent,supercedes:N.KEY_LISTENERS.supercedes});this.cfg.addProperty(N.STRINGS.key,{value:N.STRINGS.value,handler:this.configStrings,validator:N.STRINGS.validator,supercedes:N.STRINGS.supercedes});},configClose:function(X,V,Y){var Z=V[0],W=this.close,U=this.cfg.getProperty("strings");if(Z){if(!W){if(!C){C=document.createElement("a");C.className="container-close";C.href="#";}W=C.cloneNode(true);this.innerElement.appendChild(W);W.innerHTML=(U&&U.close)?U.close:"&#160;";T.on(W,"click",this._doClose,this,true);this.close=W;}else{W.style.display="block";}}else{if(W){W.style.display="none";}}},_doClose:function(U){T.preventDefault(U);this.hide();},configDraggable:function(V,U,W){var X=U[0];if(X){if(!F.DD){this.cfg.setProperty("draggable",false);return;}if(this.header){A.setStyle(this.header,"cursor","move");this.registerDragDrop();}this.subscribe("beforeShow",B);}else{if(this.dd){this.dd.unreg();}if(this.header){A.setStyle(this.header,"cursor","auto");}this.unsubscribe("beforeShow",B);}},configUnderlay:function(d,c,Z){var b=(this.platform=="mac"&&L.gecko),e=c[0].toLowerCase(),V=this.underlay,W=this.element;function X(){var f=false;if(!V){if(!Q){Q=document.createElement("div");Q.className="underlay";}V=Q.cloneNode(false);this.element.appendChild(V);this.underlay=V;if(P){this.sizeUnderlay();this.cfg.subscribeToConfigEvent("width",this.sizeUnderlay);this.cfg.subscribeToConfigEvent("height",this.sizeUnderlay);this.changeContentEvent.subscribe(this.sizeUnderlay);YAHOO.widget.Module.textResizeEvent.subscribe(this.sizeUnderlay,this,true);}if(L.webkit&&L.webkit<420){this.changeContentEvent.subscribe(this.forceUnderlayRedraw);}f=true;}}function a(){var f=X.call(this);if(!f&&P){this.sizeUnderlay();}this._underlayDeferred=false;this.beforeShowEvent.unsubscribe(a);}function Y(){if(this._underlayDeferred){this.beforeShowEvent.unsubscribe(a);this._underlayDeferred=false;}if(V){this.cfg.unsubscribeFromConfigEvent("width",this.sizeUnderlay);this.cfg.unsubscribeFromConfigEvent("height",this.sizeUnderlay);this.changeContentEvent.unsubscribe(this.sizeUnderlay);this.changeContentEvent.unsubscribe(this.forceUnderlayRedraw);YAHOO.widget.Module.textResizeEvent.unsubscribe(this.sizeUnderlay,this,true);this.element.removeChild(V);this.underlay=null;}}switch(e){case"shadow":A.removeClass(W,"matte");A.addClass(W,"shadow");break;case"matte":if(!b){Y.call(this);}A.removeClass(W,"shadow");A.addClass(W,"matte");break;default:if(!b){Y.call(this);}A.removeClass(W,"shadow");A.removeClass(W,"matte");break;}if((e=="shadow")||(b&&!V)){if(this.cfg.getProperty("visible")){var U=X.call(this);if(!U&&P){this.sizeUnderlay();}}else{if(!this._underlayDeferred){this.beforeShowEvent.subscribe(a);this._underlayDeferred=true;}}}},configModal:function(V,U,X){var W=U[0];if(W){if(!this._hasModalityEventListeners){this.subscribe("beforeShow",this.buildMask);this.subscribe("beforeShow",this.bringToTop);this.subscribe("beforeShow",this.showMask);this.subscribe("hide",this.hideMask);H.windowResizeEvent.subscribe(this.sizeMask,this,true);this._hasModalityEventListeners=true;}}else{if(this._hasModalityEventListeners){if(this.cfg.getProperty("visible")){this.hideMask();this.removeMask();}this.unsubscribe("beforeShow",this.buildMask);this.unsubscribe("beforeShow",this.bringToTop);this.unsubscribe("beforeShow",this.showMask);this.unsubscribe("hide",this.hideMask);H.windowResizeEvent.unsubscribe(this.sizeMask,this);this._hasModalityEventListeners=false;}}},removeMask:function(){var V=this.mask,U;if(V){this.hideMask();U=V.parentNode;if(U){U.removeChild(V);}this.mask=null;}},configKeyListeners:function(X,U,a){var W=U[0],Z,Y,V;if(W){if(W instanceof Array){Y=W.length;for(V=0;V<Y;V++){Z=W[V];if(!I.alreadySubscribed(this.showEvent,Z.enable,Z)){this.showEvent.subscribe(Z.enable,Z,true);}if(!I.alreadySubscribed(this.hideEvent,Z.disable,Z)){this.hideEvent.subscribe(Z.disable,Z,true);this.destroyEvent.subscribe(Z.disable,Z,true);}}}else{if(!I.alreadySubscribed(this.showEvent,W.enable,W)){this.showEvent.subscribe(W.enable,W,true);}if(!I.alreadySubscribed(this.hideEvent,W.disable,W)){this.hideEvent.subscribe(W.disable,W,true);
this.destroyEvent.subscribe(W.disable,W,true);}}}},configStrings:function(V,U,W){var X=E.merge(N.STRINGS.value,U[0]);this.cfg.setProperty(N.STRINGS.key,X,true);},configHeight:function(X,V,Y){var U=V[0],W=this.innerElement;A.setStyle(W,"height",U);this.cfg.refireEvent("iframe");},_autoFillOnHeightChange:function(X,V,W){O.superclass._autoFillOnHeightChange.apply(this,arguments);if(P){var U=this;setTimeout(function(){U.sizeUnderlay();},0);}},configWidth:function(X,U,Y){var W=U[0],V=this.innerElement;A.setStyle(V,"width",W);this.cfg.refireEvent("iframe");},configzIndex:function(V,U,X){O.superclass.configzIndex.call(this,V,U,X);if(this.mask||this.cfg.getProperty("modal")===true){var W=A.getStyle(this.element,"zIndex");if(!W||isNaN(W)){W=0;}if(W===0){this.cfg.setProperty("zIndex",1);}else{this.stackMask();}}},buildWrapper:function(){var W=this.element.parentNode,U=this.element,V=document.createElement("div");V.className=O.CSS_PANEL_CONTAINER;V.id=U.id+"_c";if(W){W.insertBefore(V,U);}V.appendChild(U);this.element=V;this.innerElement=U;A.setStyle(this.innerElement,"visibility","inherit");},sizeUnderlay:function(){var V=this.underlay,U;if(V){U=this.element;V.style.width=U.offsetWidth+"px";V.style.height=U.offsetHeight+"px";}},registerDragDrop:function(){var V=this;if(this.header){if(!F.DD){return;}var U=(this.cfg.getProperty("dragonly")===true);this.dd=new F.DD(this.element.id,this.id,{dragOnly:U});if(!this.header.id){this.header.id=this.id+"_h";}this.dd.startDrag=function(){var X,Z,W,c,b,a;if(YAHOO.env.ua.ie==6){A.addClass(V.element,"drag");}if(V.cfg.getProperty("constraintoviewport")){var Y=H.VIEWPORT_OFFSET;X=V.element.offsetHeight;Z=V.element.offsetWidth;W=A.getViewportWidth();c=A.getViewportHeight();b=A.getDocumentScrollLeft();a=A.getDocumentScrollTop();if(X+Y<c){this.minY=a+Y;this.maxY=a+c-X-Y;}else{this.minY=a+Y;this.maxY=a+Y;}if(Z+Y<W){this.minX=b+Y;this.maxX=b+W-Z-Y;}else{this.minX=b+Y;this.maxX=b+Y;}this.constrainX=true;this.constrainY=true;}else{this.constrainX=false;this.constrainY=false;}V.dragEvent.fire("startDrag",arguments);};this.dd.onDrag=function(){V.syncPosition();V.cfg.refireEvent("iframe");if(this.platform=="mac"&&YAHOO.env.ua.gecko){this.showMacGeckoScrollbars();}V.dragEvent.fire("onDrag",arguments);};this.dd.endDrag=function(){if(YAHOO.env.ua.ie==6){A.removeClass(V.element,"drag");}V.dragEvent.fire("endDrag",arguments);V.moveEvent.fire(V.cfg.getProperty("xy"));};this.dd.setHandleElId(this.header.id);this.dd.addInvalidHandleType("INPUT");this.dd.addInvalidHandleType("SELECT");this.dd.addInvalidHandleType("TEXTAREA");}},buildMask:function(){var U=this.mask;if(!U){if(!G){G=document.createElement("div");G.className="mask";G.innerHTML="&#160;";}U=G.cloneNode(true);U.id=this.id+"_mask";document.body.insertBefore(U,document.body.firstChild);this.mask=U;if(YAHOO.env.ua.gecko&&this.platform=="mac"){A.addClass(this.mask,"block-scrollbars");}this.stackMask();}},hideMask:function(){if(this.cfg.getProperty("modal")&&this.mask){this.mask.style.display="none";A.removeClass(document.body,"masked");this.hideMaskEvent.fire();}},showMask:function(){if(this.cfg.getProperty("modal")&&this.mask){A.addClass(document.body,"masked");this.sizeMask();this.mask.style.display="block";this.showMaskEvent.fire();}},sizeMask:function(){if(this.mask){var V=this.mask,W=A.getViewportWidth(),U=A.getViewportHeight();if(V.offsetHeight>U){V.style.height=U+"px";}if(V.offsetWidth>W){V.style.width=W+"px";}V.style.height=A.getDocumentHeight()+"px";V.style.width=A.getDocumentWidth()+"px";}},stackMask:function(){if(this.mask){var U=A.getStyle(this.element,"zIndex");if(!YAHOO.lang.isUndefined(U)&&!isNaN(U)){A.setStyle(this.mask,"zIndex",U-1);}}},render:function(U){return O.superclass.render.call(this,U,this.innerElement);},destroy:function(){H.windowResizeEvent.unsubscribe(this.sizeMask,this);this.removeMask();if(this.close){T.purgeElement(this.close);}O.superclass.destroy.call(this);},forceUnderlayRedraw:function(){var U=this.underlay;A.addClass(U,"yui-force-redraw");setTimeout(function(){A.removeClass(U,"yui-force-redraw");},0);},toString:function(){return"Panel "+this.id;}});}());(function(){YAHOO.widget.Dialog=function(J,I){YAHOO.widget.Dialog.superclass.constructor.call(this,J,I);};var B=YAHOO.util.Event,G=YAHOO.util.CustomEvent,E=YAHOO.util.Dom,A=YAHOO.widget.Dialog,F=YAHOO.lang,H={"BEFORE_SUBMIT":"beforeSubmit","SUBMIT":"submit","MANUAL_SUBMIT":"manualSubmit","ASYNC_SUBMIT":"asyncSubmit","FORM_SUBMIT":"formSubmit","CANCEL":"cancel"},C={"POST_METHOD":{key:"postmethod",value:"async"},"POST_DATA":{key:"postdata",value:null},"BUTTONS":{key:"buttons",value:"none",supercedes:["visible"]},"HIDEAFTERSUBMIT":{key:"hideaftersubmit",value:true}};A.CSS_DIALOG="yui-dialog";function D(){var L=this._aButtons,J,K,I;if(F.isArray(L)){J=L.length;if(J>0){I=J-1;do{K=L[I];if(YAHOO.widget.Button&&K instanceof YAHOO.widget.Button){K.destroy();}else{if(K.tagName.toUpperCase()=="BUTTON"){B.purgeElement(K);B.purgeElement(K,false);}}}while(I--);}}}YAHOO.extend(A,YAHOO.widget.Panel,{form:null,initDefaultConfig:function(){A.superclass.initDefaultConfig.call(this);this.callback={success:null,failure:null,argument:null};this.cfg.addProperty(C.POST_METHOD.key,{handler:this.configPostMethod,value:C.POST_METHOD.value,validator:function(I){if(I!="form"&&I!="async"&&I!="none"&&I!="manual"){return false;}else{return true;}}});this.cfg.addProperty(C.POST_DATA.key,{value:C.POST_DATA.value});this.cfg.addProperty(C.HIDEAFTERSUBMIT.key,{value:C.HIDEAFTERSUBMIT.value});this.cfg.addProperty(C.BUTTONS.key,{handler:this.configButtons,value:C.BUTTONS.value,supercedes:C.BUTTONS.supercedes});},initEvents:function(){A.superclass.initEvents.call(this);var I=G.LIST;this.beforeSubmitEvent=this.createEvent(H.BEFORE_SUBMIT);this.beforeSubmitEvent.signature=I;this.submitEvent=this.createEvent(H.SUBMIT);this.submitEvent.signature=I;this.manualSubmitEvent=this.createEvent(H.MANUAL_SUBMIT);this.manualSubmitEvent.signature=I;this.asyncSubmitEvent=this.createEvent(H.ASYNC_SUBMIT);
this.asyncSubmitEvent.signature=I;this.formSubmitEvent=this.createEvent(H.FORM_SUBMIT);this.formSubmitEvent.signature=I;this.cancelEvent=this.createEvent(H.CANCEL);this.cancelEvent.signature=I;},init:function(J,I){A.superclass.init.call(this,J);this.beforeInitEvent.fire(A);E.addClass(this.element,A.CSS_DIALOG);this.cfg.setProperty("visible",false);if(I){this.cfg.applyConfig(I,true);}this.showEvent.subscribe(this.focusFirst,this,true);this.beforeHideEvent.subscribe(this.blurButtons,this,true);this.subscribe("changeBody",this.registerForm);this.initEvent.fire(A);},doSubmit:function(){var P=YAHOO.util.Connect,Q=this.form,K=false,N=false,R,M,L,I;switch(this.cfg.getProperty("postmethod")){case"async":R=Q.elements;M=R.length;if(M>0){L=M-1;do{if(R[L].type=="file"){K=true;break;}}while(L--);}if(K&&YAHOO.env.ua.ie&&this.isSecure){N=true;}I=this._getFormAttributes(Q);P.setForm(Q,K,N);var J=this.cfg.getProperty("postdata");var O=P.asyncRequest(I.method,I.action,this.callback,J);this.asyncSubmitEvent.fire(O);break;case"form":Q.submit();this.formSubmitEvent.fire();break;case"none":case"manual":this.manualSubmitEvent.fire();break;}},_getFormAttributes:function(K){var I={method:null,action:null};if(K){if(K.getAttributeNode){var J=K.getAttributeNode("action");var L=K.getAttributeNode("method");if(J){I.action=J.value;}if(L){I.method=L.value;}}else{I.action=K.getAttribute("action");I.method=K.getAttribute("method");}}I.method=(F.isString(I.method)?I.method:"POST").toUpperCase();I.action=F.isString(I.action)?I.action:"";return I;},registerForm:function(){var I=this.element.getElementsByTagName("form")[0];if(this.form){if(this.form==I&&E.isAncestor(this.element,this.form)){return;}else{B.purgeElement(this.form);this.form=null;}}if(!I){I=document.createElement("form");I.name="frm_"+this.id;this.body.appendChild(I);}if(I){this.form=I;B.on(I,"submit",this._submitHandler,this,true);}},_submitHandler:function(I){B.stopEvent(I);this.submit();this.form.blur();},setTabLoop:function(I,J){I=I||this.firstButton;J=this.lastButton||J;A.superclass.setTabLoop.call(this,I,J);},setFirstLastFocusable:function(){A.superclass.setFirstLastFocusable.call(this);var J,I,K,L=this.focusableElements;this.firstFormElement=null;this.lastFormElement=null;if(this.form&&L&&L.length>0){I=L.length;for(J=0;J<I;++J){K=L[J];if(this.form===K.form){this.firstFormElement=K;break;}}for(J=I-1;J>=0;--J){K=L[J];if(this.form===K.form){this.lastFormElement=K;break;}}}},configClose:function(J,I,K){A.superclass.configClose.apply(this,arguments);},_doClose:function(I){B.preventDefault(I);this.cancel();},configButtons:function(S,R,M){var N=YAHOO.widget.Button,U=R[0],K=this.innerElement,T,P,J,Q,O,I,L;D.call(this);this._aButtons=null;if(F.isArray(U)){O=document.createElement("span");O.className="button-group";Q=U.length;this._aButtons=[];this.defaultHtmlButton=null;for(L=0;L<Q;L++){T=U[L];if(N){J=new N({label:T.text});J.appendTo(O);P=J.get("element");if(T.isDefault){J.addClass("default");this.defaultHtmlButton=P;}if(F.isFunction(T.handler)){J.set("onclick",{fn:T.handler,obj:this,scope:this});}else{if(F.isObject(T.handler)&&F.isFunction(T.handler.fn)){J.set("onclick",{fn:T.handler.fn,obj:((!F.isUndefined(T.handler.obj))?T.handler.obj:this),scope:(T.handler.scope||this)});}}this._aButtons[this._aButtons.length]=J;}else{P=document.createElement("button");P.setAttribute("type","button");if(T.isDefault){P.className="default";this.defaultHtmlButton=P;}P.innerHTML=T.text;if(F.isFunction(T.handler)){B.on(P,"click",T.handler,this,true);}else{if(F.isObject(T.handler)&&F.isFunction(T.handler.fn)){B.on(P,"click",T.handler.fn,((!F.isUndefined(T.handler.obj))?T.handler.obj:this),(T.handler.scope||this));}}O.appendChild(P);this._aButtons[this._aButtons.length]=P;}T.htmlButton=P;if(L===0){this.firstButton=P;}if(L==(Q-1)){this.lastButton=P;}}this.setFooter(O);I=this.footer;if(E.inDocument(this.element)&&!E.isAncestor(K,I)){K.appendChild(I);}this.buttonSpan=O;}else{O=this.buttonSpan;I=this.footer;if(O&&I){I.removeChild(O);this.buttonSpan=null;this.firstButton=null;this.lastButton=null;this.defaultHtmlButton=null;}}this.changeContentEvent.fire();},getButtons:function(){return this._aButtons||null;},focusFirst:function(K,I,M){var J=this.firstFormElement;if(I&&I[1]){B.stopEvent(I[1]);}if(J){try{J.focus();}catch(L){}}else{if(this.defaultHtmlButton){this.focusDefaultButton();}else{this.focusFirstButton();}}},focusLast:function(K,I,M){var N=this.cfg.getProperty("buttons"),J=this.lastFormElement;if(I&&I[1]){B.stopEvent(I[1]);}if(N&&F.isArray(N)){this.focusLastButton();}else{if(J){try{J.focus();}catch(L){}}}},_getButton:function(J){var I=YAHOO.widget.Button;if(I&&J&&J.nodeName&&J.id){J=I.getButton(J.id)||J;}return J;},focusDefaultButton:function(){var I=this._getButton(this.defaultHtmlButton);if(I){try{I.focus();}catch(J){}}},blurButtons:function(){var N=this.cfg.getProperty("buttons"),K,M,J,I;if(N&&F.isArray(N)){K=N.length;if(K>0){I=(K-1);do{M=N[I];if(M){J=this._getButton(M.htmlButton);if(J){try{J.blur();}catch(L){}}}}while(I--);}}},focusFirstButton:function(){var L=this.cfg.getProperty("buttons"),K,I;if(L&&F.isArray(L)){K=L[0];if(K){I=this._getButton(K.htmlButton);if(I){try{I.focus();}catch(J){}}}}},focusLastButton:function(){var M=this.cfg.getProperty("buttons"),J,L,I;if(M&&F.isArray(M)){J=M.length;if(J>0){L=M[(J-1)];if(L){I=this._getButton(L.htmlButton);if(I){try{I.focus();}catch(K){}}}}}},configPostMethod:function(J,I,K){this.registerForm();},validate:function(){return true;},submit:function(){if(this.validate()){this.beforeSubmitEvent.fire();this.doSubmit();this.submitEvent.fire();if(this.cfg.getProperty("hideaftersubmit")){this.hide();}return true;}else{return false;}},cancel:function(){this.cancelEvent.fire();this.hide();},getData:function(){var Y=this.form,K,R,U,M,S,P,O,J,V,L,W,Z,I,N,a,X,T;function Q(c){var b=c.tagName.toUpperCase();return((b=="INPUT"||b=="TEXTAREA"||b=="SELECT")&&c.name==M);}if(Y){K=Y.elements;R=K.length;U={};for(X=0;X<R;X++){M=K[X].name;S=E.getElementsBy(Q,"*",Y);
P=S.length;if(P>0){if(P==1){S=S[0];O=S.type;J=S.tagName.toUpperCase();switch(J){case"INPUT":if(O=="checkbox"){U[M]=S.checked;}else{if(O!="radio"){U[M]=S.value;}}break;case"TEXTAREA":U[M]=S.value;break;case"SELECT":V=S.options;L=V.length;W=[];for(T=0;T<L;T++){Z=V[T];if(Z.selected){I=Z.value;if(!I||I===""){I=Z.text;}W[W.length]=I;}}U[M]=W;break;}}else{O=S[0].type;switch(O){case"radio":for(T=0;T<P;T++){N=S[T];if(N.checked){U[M]=N.value;break;}}break;case"checkbox":W=[];for(T=0;T<P;T++){a=S[T];if(a.checked){W[W.length]=a.value;}}U[M]=W;break;}}}}}return U;},destroy:function(){D.call(this);this._aButtons=null;var I=this.element.getElementsByTagName("form"),J;if(I.length>0){J=I[0];if(J){B.purgeElement(J);if(J.parentNode){J.parentNode.removeChild(J);}this.form=null;}}A.superclass.destroy.call(this);},toString:function(){return"Dialog "+this.id;}});}());(function(){YAHOO.widget.SimpleDialog=function(E,D){YAHOO.widget.SimpleDialog.superclass.constructor.call(this,E,D);};var C=YAHOO.util.Dom,B=YAHOO.widget.SimpleDialog,A={"ICON":{key:"icon",value:"none",suppressEvent:true},"TEXT":{key:"text",value:"",suppressEvent:true,supercedes:["icon"]}};B.ICON_BLOCK="blckicon";B.ICON_ALARM="alrticon";B.ICON_HELP="hlpicon";B.ICON_INFO="infoicon";B.ICON_WARN="warnicon";B.ICON_TIP="tipicon";B.ICON_CSS_CLASSNAME="yui-icon";B.CSS_SIMPLEDIALOG="yui-simple-dialog";YAHOO.extend(B,YAHOO.widget.Dialog,{initDefaultConfig:function(){B.superclass.initDefaultConfig.call(this);this.cfg.addProperty(A.ICON.key,{handler:this.configIcon,value:A.ICON.value,suppressEvent:A.ICON.suppressEvent});this.cfg.addProperty(A.TEXT.key,{handler:this.configText,value:A.TEXT.value,suppressEvent:A.TEXT.suppressEvent,supercedes:A.TEXT.supercedes});},init:function(E,D){B.superclass.init.call(this,E);this.beforeInitEvent.fire(B);C.addClass(this.element,B.CSS_SIMPLEDIALOG);this.cfg.queueProperty("postmethod","manual");if(D){this.cfg.applyConfig(D,true);}this.beforeRenderEvent.subscribe(function(){if(!this.body){this.setBody("");}},this,true);this.initEvent.fire(B);},registerForm:function(){B.superclass.registerForm.call(this);this.form.innerHTML+='<input type="hidden" name="'+this.id+'" value=""/>';},configIcon:function(F,E,J){var K=E[0],D=this.body,I=B.ICON_CSS_CLASSNAME,H,G;if(K&&K!="none"){H=C.getElementsByClassName(I,"*",D);if(H){G=H.parentNode;if(G){G.removeChild(H);H=null;}}if(K.indexOf(".")==-1){H=document.createElement("span");H.className=(I+" "+K);H.innerHTML="&#160;";}else{H=document.createElement("img");H.src=(this.imageRoot+K);H.className=I;}if(H){D.insertBefore(H,D.firstChild);}}},configText:function(E,D,F){var G=D[0];if(G){this.setBody(G);this.cfg.refireEvent("icon");}},toString:function(){return"SimpleDialog "+this.id;}});}());(function(){YAHOO.widget.ContainerEffect=function(E,H,G,D,F){if(!F){F=YAHOO.util.Anim;}this.overlay=E;this.attrIn=H;this.attrOut=G;this.targetElement=D||E.element;this.animClass=F;};var B=YAHOO.util.Dom,C=YAHOO.util.CustomEvent,A=YAHOO.widget.ContainerEffect;A.FADE=function(D,F){var G=YAHOO.util.Easing,I={attributes:{opacity:{from:0,to:1}},duration:F,method:G.easeIn},E={attributes:{opacity:{to:0}},duration:F,method:G.easeOut},H=new A(D,I,E,D.element);H.handleUnderlayStart=function(){var K=this.overlay.underlay;if(K&&YAHOO.env.ua.ie){var J=(K.filters&&K.filters.length>0);if(J){B.addClass(D.element,"yui-effect-fade");}}};H.handleUnderlayComplete=function(){var J=this.overlay.underlay;if(J&&YAHOO.env.ua.ie){B.removeClass(D.element,"yui-effect-fade");}};H.handleStartAnimateIn=function(K,J,L){B.addClass(L.overlay.element,"hide-select");if(!L.overlay.underlay){L.overlay.cfg.refireEvent("underlay");}L.handleUnderlayStart();L.overlay._setDomVisibility(true);B.setStyle(L.overlay.element,"opacity",0);};H.handleCompleteAnimateIn=function(K,J,L){B.removeClass(L.overlay.element,"hide-select");if(L.overlay.element.style.filter){L.overlay.element.style.filter=null;}L.handleUnderlayComplete();L.overlay.cfg.refireEvent("iframe");L.animateInCompleteEvent.fire();};H.handleStartAnimateOut=function(K,J,L){B.addClass(L.overlay.element,"hide-select");L.handleUnderlayStart();};H.handleCompleteAnimateOut=function(K,J,L){B.removeClass(L.overlay.element,"hide-select");if(L.overlay.element.style.filter){L.overlay.element.style.filter=null;}L.overlay._setDomVisibility(false);B.setStyle(L.overlay.element,"opacity",1);L.handleUnderlayComplete();L.overlay.cfg.refireEvent("iframe");L.animateOutCompleteEvent.fire();};H.init();return H;};A.SLIDE=function(F,D){var I=YAHOO.util.Easing,L=F.cfg.getProperty("x")||B.getX(F.element),K=F.cfg.getProperty("y")||B.getY(F.element),M=B.getClientWidth(),H=F.element.offsetWidth,J={attributes:{points:{to:[L,K]}},duration:D,method:I.easeIn},E={attributes:{points:{to:[(M+25),K]}},duration:D,method:I.easeOut},G=new A(F,J,E,F.element,YAHOO.util.Motion);G.handleStartAnimateIn=function(O,N,P){P.overlay.element.style.left=((-25)-H)+"px";P.overlay.element.style.top=K+"px";};G.handleTweenAnimateIn=function(Q,P,R){var S=B.getXY(R.overlay.element),O=S[0],N=S[1];if(B.getStyle(R.overlay.element,"visibility")=="hidden"&&O<L){R.overlay._setDomVisibility(true);}R.overlay.cfg.setProperty("xy",[O,N],true);R.overlay.cfg.refireEvent("iframe");};G.handleCompleteAnimateIn=function(O,N,P){P.overlay.cfg.setProperty("xy",[L,K],true);P.startX=L;P.startY=K;P.overlay.cfg.refireEvent("iframe");P.animateInCompleteEvent.fire();};G.handleStartAnimateOut=function(O,N,R){var P=B.getViewportWidth(),S=B.getXY(R.overlay.element),Q=S[1];R.animOut.attributes.points.to=[(P+25),Q];};G.handleTweenAnimateOut=function(P,O,Q){var S=B.getXY(Q.overlay.element),N=S[0],R=S[1];Q.overlay.cfg.setProperty("xy",[N,R],true);Q.overlay.cfg.refireEvent("iframe");};G.handleCompleteAnimateOut=function(O,N,P){P.overlay._setDomVisibility(false);P.overlay.cfg.setProperty("xy",[L,K]);P.animateOutCompleteEvent.fire();};G.init();return G;};A.prototype={init:function(){this.beforeAnimateInEvent=this.createEvent("beforeAnimateIn");this.beforeAnimateInEvent.signature=C.LIST;this.beforeAnimateOutEvent=this.createEvent("beforeAnimateOut");
this.beforeAnimateOutEvent.signature=C.LIST;this.animateInCompleteEvent=this.createEvent("animateInComplete");this.animateInCompleteEvent.signature=C.LIST;this.animateOutCompleteEvent=this.createEvent("animateOutComplete");this.animateOutCompleteEvent.signature=C.LIST;this.animIn=new this.animClass(this.targetElement,this.attrIn.attributes,this.attrIn.duration,this.attrIn.method);this.animIn.onStart.subscribe(this.handleStartAnimateIn,this);this.animIn.onTween.subscribe(this.handleTweenAnimateIn,this);this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn,this);this.animOut=new this.animClass(this.targetElement,this.attrOut.attributes,this.attrOut.duration,this.attrOut.method);this.animOut.onStart.subscribe(this.handleStartAnimateOut,this);this.animOut.onTween.subscribe(this.handleTweenAnimateOut,this);this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut,this);},animateIn:function(){this.beforeAnimateInEvent.fire();this.animIn.animate();},animateOut:function(){this.beforeAnimateOutEvent.fire();this.animOut.animate();},handleStartAnimateIn:function(E,D,F){},handleTweenAnimateIn:function(E,D,F){},handleCompleteAnimateIn:function(E,D,F){},handleStartAnimateOut:function(E,D,F){},handleTweenAnimateOut:function(E,D,F){},handleCompleteAnimateOut:function(E,D,F){},toString:function(){var D="ContainerEffect";if(this.overlay){D+=" ["+this.overlay.toString()+"]";}return D;}};YAHOO.lang.augmentProto(A,YAHOO.util.EventProvider);})();YAHOO.register("container",YAHOO.widget.Module,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
YAHOO.util.Attribute=function(B,A){if(A){this.owner=A;this.configure(B,true);}};YAHOO.util.Attribute.prototype={name:undefined,value:null,owner:null,readOnly:false,writeOnce:false,_initialConfig:null,_written:false,method:null,setter:null,getter:null,validator:null,getValue:function(){var A=this.value;if(this.getter){A=this.getter.call(this.owner,this.name);}return A;},setValue:function(F,B){var E,A=this.owner,C=this.name;var D={type:C,prevValue:this.getValue(),newValue:F};if(this.readOnly||(this.writeOnce&&this._written)){return false;}if(this.validator&&!this.validator.call(A,F)){return false;}if(!B){E=A.fireBeforeChangeEvent(D);if(E===false){return false;}}if(this.setter){F=this.setter.call(A,F,this.name);if(F===undefined){}}if(this.method){this.method.call(A,F,this.name);}this.value=F;this._written=true;D.type=C;if(!B){this.owner.fireChangeEvent(D);}return true;},configure:function(B,C){B=B||{};if(C){this._written=false;}this._initialConfig=this._initialConfig||{};for(var A in B){if(B.hasOwnProperty(A)){this[A]=B[A];if(C){this._initialConfig[A]=B[A];}}}},resetValue:function(){return this.setValue(this._initialConfig.value);},resetConfig:function(){this.configure(this._initialConfig,true);},refresh:function(A){this.setValue(this.value,A);}};(function(){var A=YAHOO.util.Lang;YAHOO.util.AttributeProvider=function(){};YAHOO.util.AttributeProvider.prototype={_configs:null,get:function(C){this._configs=this._configs||{};var B=this._configs[C];if(!B||!this._configs.hasOwnProperty(C)){return null;}return B.getValue();},set:function(D,E,B){this._configs=this._configs||{};var C=this._configs[D];if(!C){return false;}return C.setValue(E,B);},getAttributeKeys:function(){this._configs=this._configs;var C=[],B;for(B in this._configs){if(A.hasOwnProperty(this._configs,B)&&!A.isUndefined(this._configs[B])){C[C.length]=B;}}return C;},setAttributes:function(D,B){for(var C in D){if(A.hasOwnProperty(D,C)){this.set(C,D[C],B);}}},resetValue:function(C,B){this._configs=this._configs||{};if(this._configs[C]){this.set(C,this._configs[C]._initialConfig.value,B);return true;}return false;},refresh:function(E,C){this._configs=this._configs||{};var F=this._configs;E=((A.isString(E))?[E]:E)||this.getAttributeKeys();for(var D=0,B=E.length;D<B;++D){if(F.hasOwnProperty(E[D])){this._configs[E[D]].refresh(C);}}},register:function(B,C){this.setAttributeConfig(B,C);},getAttributeConfig:function(C){this._configs=this._configs||{};var B=this._configs[C]||{};var D={};for(C in B){if(A.hasOwnProperty(B,C)){D[C]=B[C];}}return D;},setAttributeConfig:function(B,C,D){this._configs=this._configs||{};C=C||{};if(!this._configs[B]){C.name=B;this._configs[B]=this.createAttribute(C);}else{this._configs[B].configure(C,D);}},configureAttribute:function(B,C,D){this.setAttributeConfig(B,C,D);},resetAttributeConfig:function(B){this._configs=this._configs||{};this._configs[B].resetConfig();},subscribe:function(B,C){this._events=this._events||{};if(!(B in this._events)){this._events[B]=this.createEvent(B);}YAHOO.util.EventProvider.prototype.subscribe.apply(this,arguments);},on:function(){this.subscribe.apply(this,arguments);},addListener:function(){this.subscribe.apply(this,arguments);},fireBeforeChangeEvent:function(C){var B="before";B+=C.type.charAt(0).toUpperCase()+C.type.substr(1)+"Change";C.type=B;return this.fireEvent(C.type,C);},fireChangeEvent:function(B){B.type+="Change";return this.fireEvent(B.type,B);},createAttribute:function(B){return new YAHOO.util.Attribute(B,this);}};YAHOO.augment(YAHOO.util.AttributeProvider,YAHOO.util.EventProvider);})();(function(){var B=YAHOO.util.Dom,C=YAHOO.util.AttributeProvider;var A=function(D,E){this.init.apply(this,arguments);};A.DOM_EVENTS={"click":true,"dblclick":true,"keydown":true,"keypress":true,"keyup":true,"mousedown":true,"mousemove":true,"mouseout":true,"mouseover":true,"mouseup":true,"focus":true,"blur":true,"submit":true,"change":true};A.prototype={DOM_EVENTS:null,DEFAULT_HTML_SETTER:function(F,D){var E=this.get("element");if(E){E[D]=F;}},DEFAULT_HTML_GETTER:function(D){var E=this.get("element"),F;if(E){F=E[D];}return F;},appendChild:function(D){D=D.get?D.get("element"):D;return this.get("element").appendChild(D);},getElementsByTagName:function(D){return this.get("element").getElementsByTagName(D);},hasChildNodes:function(){return this.get("element").hasChildNodes();},insertBefore:function(D,E){D=D.get?D.get("element"):D;E=(E&&E.get)?E.get("element"):E;return this.get("element").insertBefore(D,E);},removeChild:function(D){D=D.get?D.get("element"):D;return this.get("element").removeChild(D);},replaceChild:function(D,E){D=D.get?D.get("element"):D;E=E.get?E.get("element"):E;return this.get("element").replaceChild(D,E);},initAttributes:function(D){},addListener:function(H,G,I,F){var E=this.get("element")||this.get("id");F=F||this;var D=this;if(!this._events[H]){if(E&&this.DOM_EVENTS[H]){YAHOO.util.Event.addListener(E,H,function(J){if(J.srcElement&&!J.target){J.target=J.srcElement;}D.fireEvent(H,J);},I,F);}this.createEvent(H,this);}return YAHOO.util.EventProvider.prototype.subscribe.apply(this,arguments);},on:function(){return this.addListener.apply(this,arguments);},subscribe:function(){return this.addListener.apply(this,arguments);},removeListener:function(E,D){return this.unsubscribe.apply(this,arguments);},addClass:function(D){B.addClass(this.get("element"),D);},getElementsByClassName:function(E,D){return B.getElementsByClassName(E,D,this.get("element"));},hasClass:function(D){return B.hasClass(this.get("element"),D);},removeClass:function(D){return B.removeClass(this.get("element"),D);},replaceClass:function(E,D){return B.replaceClass(this.get("element"),E,D);},setStyle:function(E,D){return B.setStyle(this.get("element"),E,D);},getStyle:function(D){return B.getStyle(this.get("element"),D);},fireQueue:function(){var E=this._queue;for(var F=0,D=E.length;F<D;++F){this[E[F][0]].apply(this,E[F][1]);}},appendTo:function(E,F){E=(E.get)?E.get("element"):B.get(E);this.fireEvent("beforeAppendTo",{type:"beforeAppendTo",target:E});
F=(F&&F.get)?F.get("element"):B.get(F);var D=this.get("element");if(!D){return false;}if(!E){return false;}if(D.parent!=E){if(F){E.insertBefore(D,F);}else{E.appendChild(D);}}this.fireEvent("appendTo",{type:"appendTo",target:E});return D;},get:function(D){var F=this._configs||{},E=F.element;if(E&&!F[D]&&!YAHOO.lang.isUndefined(E.value[D])){this._setHTMLAttrConfig(D);}return C.prototype.get.call(this,D);},setAttributes:function(J,G){var E={},H=this._configOrder;for(var I=0,D=H.length;I<D;++I){if(J[H[I]]!==undefined){E[H[I]]=true;this.set(H[I],J[H[I]],G);}}for(var F in J){if(J.hasOwnProperty(F)&&!E[F]){this.set(F,J[F],G);}}},set:function(E,G,D){var F=this.get("element");if(!F){this._queue[this._queue.length]=["set",arguments];if(this._configs[E]){this._configs[E].value=G;}return;}if(!this._configs[E]&&!YAHOO.lang.isUndefined(F[E])){this._setHTMLAttrConfig(E);}return C.prototype.set.apply(this,arguments);},setAttributeConfig:function(D,E,F){this._configOrder.push(D);C.prototype.setAttributeConfig.apply(this,arguments);},createEvent:function(E,D){this._events[E]=true;return C.prototype.createEvent.apply(this,arguments);},init:function(E,D){this._initElement(E,D);},destroy:function(){var D=this.get("element");YAHOO.util.Event.purgeElement(D,true);this.unsubscribeAll();if(D&&D.parentNode){D.parentNode.removeChild(D);}this._queue=[];this._events={};this._configs={};this._configOrder=[];},_initElement:function(F,E){this._queue=this._queue||[];this._events=this._events||{};this._configs=this._configs||{};this._configOrder=[];E=E||{};E.element=E.element||F||null;var H=false;var D=A.DOM_EVENTS;this.DOM_EVENTS=this.DOM_EVENTS||{};for(var G in D){if(D.hasOwnProperty(G)){this.DOM_EVENTS[G]=D[G];}}if(typeof E.element==="string"){this._setHTMLAttrConfig("id",{value:E.element});}if(B.get(E.element)){H=true;this._initHTMLElement(E);this._initContent(E);}YAHOO.util.Event.onAvailable(E.element,function(){if(!H){this._initHTMLElement(E);}this.fireEvent("available",{type:"available",target:B.get(E.element)});},this,true);YAHOO.util.Event.onContentReady(E.element,function(){if(!H){this._initContent(E);}this.fireEvent("contentReady",{type:"contentReady",target:B.get(E.element)});},this,true);},_initHTMLElement:function(D){this.setAttributeConfig("element",{value:B.get(D.element),readOnly:true});},_initContent:function(D){this.initAttributes(D);this.setAttributes(D,true);this.fireQueue();},_setHTMLAttrConfig:function(D,F){var E=this.get("element");F=F||{};F.name=D;F.setter=F.setter||this.DEFAULT_HTML_SETTER;F.getter=F.getter||this.DEFAULT_HTML_GETTER;F.value=F.value||E[D];this._configs[D]=new YAHOO.util.Attribute(F,this);}};YAHOO.augment(A,C);YAHOO.util.Element=A;})();YAHOO.register("element",YAHOO.util.Element,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){var B=YAHOO.util,C=B.Dom,H=B.Event,F=window.document,J="active",D="activeIndex",E="activeTab",A="contentEl",G="element",I=function(L,K){K=K||{};if(arguments.length==1&&!YAHOO.lang.isString(L)&&!L.nodeName){K=L;L=K.element||null;}if(!L&&!K.element){L=this._createTabViewElement(K);}I.superclass.constructor.call(this,L,K);};YAHOO.extend(I,B.Element,{CLASSNAME:"yui-navset",TAB_PARENT_CLASSNAME:"yui-nav",CONTENT_PARENT_CLASSNAME:"yui-content",_tabParent:null,_contentParent:null,addTab:function(P,L){var N=this.get("tabs"),Q=this.getTab(L),R=this._tabParent,K=this._contentParent,M=P.get(G),O=P.get(A);if(!N){this._queue[this._queue.length]=["addTab",arguments];return false;}L=(L===undefined)?N.length:L;if(Q){R.insertBefore(M,Q.get(G));}else{R.appendChild(M);}if(O&&!C.isAncestor(K,O)){K.appendChild(O);}if(!P.get(J)){P.set("contentVisible",false,true);}else{this.set(E,P,true);}this._initTabEvents(P);N.splice(L,0,P);},_initTabEvents:function(K){K.addListener(K.get("activationEvent"),K._onActivate,this,K);K.addListener("activationEventChange",function(L){if(L.prevValue!=L.newValue){K.removeListener(L.prevValue,K._onActivate);K.addListener(L.newValue,K._onActivate,this,K);}});},DOMEventHandler:function(P){var Q=H.getTarget(P),S=this._tabParent,R=this.get("tabs"),M,L,K;if(C.isAncestor(S,Q)){for(var N=0,O=R.length;N<O;N++){L=R[N].get(G);K=R[N].get(A);if(Q==L||C.isAncestor(L,Q)){M=R[N];break;}}if(M){M.fireEvent(P.type,P);}}},getTab:function(K){return this.get("tabs")[K];},getTabIndex:function(O){var L=null,N=this.get("tabs");for(var M=0,K=N.length;M<K;++M){if(O==N[M]){L=M;break;}}return L;},removeTab:function(M){var L=this.get("tabs").length,K=this.getTabIndex(M);if(M===this.get(E)){if(L>1){if(K+1===L){this.set(D,K-1);}else{this.set(D,K+1);}}else{this.set(E,null);}}this._tabParent.removeChild(M.get(G));this._contentParent.removeChild(M.get(A));this._configs.tabs.value.splice(K,1);M.fireEvent("remove",{type:"remove",tabview:this});},toString:function(){var K=this.get("id")||this.get("tagName");return"TabView "+K;},contentTransition:function(L,K){if(L){L.set("contentVisible",true);}if(K){K.set("contentVisible",false);}},initAttributes:function(K){I.superclass.initAttributes.call(this,K);if(!K.orientation){K.orientation="top";}var M=this.get(G);if(!C.hasClass(M,this.CLASSNAME)){C.addClass(M,this.CLASSNAME);}this.setAttributeConfig("tabs",{value:[],readOnly:true});this._tabParent=this.getElementsByClassName(this.TAB_PARENT_CLASSNAME,"ul")[0]||this._createTabParent();this._contentParent=this.getElementsByClassName(this.CONTENT_PARENT_CLASSNAME,"div")[0]||this._createContentParent();this.setAttributeConfig("orientation",{value:K.orientation,method:function(N){var O=this.get("orientation");this.addClass("yui-navset-"+N);if(O!=N){this.removeClass("yui-navset-"+O);}if(N==="bottom"){this.appendChild(this._tabParent);}}});this.setAttributeConfig(D,{value:K.activeIndex,method:function(N){},validator:function(O){var N=true;if(O&&this.getTab(O).get("disabled")){N=false;}return N;}});this.setAttributeConfig(E,{value:K.activeTab,method:function(O){var N=this.get(E);if(O){O.set(J,true);}if(N&&N!==O){N.set(J,false);}if(N&&O!==N){this.contentTransition(O,N);}else{if(O){O.set("contentVisible",true);}}},validator:function(O){var N=true;if(O&&O.get("disabled")){N=false;}return N;}});this.on("activeTabChange",this._onActiveTabChange);this.on("activeIndexChange",this._onActiveIndexChange);if(this._tabParent){this._initTabs();}this.DOM_EVENTS.submit=false;this.DOM_EVENTS.focus=false;this.DOM_EVENTS.blur=false;for(var L in this.DOM_EVENTS){if(YAHOO.lang.hasOwnProperty(this.DOM_EVENTS,L)){this.addListener.call(this,L,this.DOMEventHandler);}}},deselectTab:function(K){if(this.getTab(K)===this.get("activeTab")){this.set("activeTab",null);}},selectTab:function(K){this.set("activeTab",this.getTab(K));},_onActiveTabChange:function(M){var K=this.get(D),L=this.getTabIndex(M.newValue);if(K!==L){if(!(this.set(D,L))){this.set(E,M.prevValue);}}},_onActiveIndexChange:function(K){if(K.newValue!==this.getTabIndex(this.get(E))){if(!(this.set(E,this.getTab(K.newValue)))){this.set(D,K.prevValue);}}},_initTabs:function(){var P=C.getChildren(this._tabParent),N=C.getChildren(this._contentParent),M=this.get(D),Q,L,R;for(var O=0,K=P.length;O<K;++O){L={};if(N[O]){L.contentEl=N[O];}Q=new YAHOO.widget.Tab(P[O],L);this.addTab(Q);if(Q.hasClass(Q.ACTIVE_CLASSNAME)){R=Q;}}if(M){this.set(E,this.getTab(M));}else{this._configs.activeTab.value=R;this._configs.activeIndex.value=this.getTabIndex(R);}},_createTabViewElement:function(K){var L=F.createElement("div");if(this.CLASSNAME){L.className=this.CLASSNAME;}return L;},_createTabParent:function(K){var L=F.createElement("ul");if(this.TAB_PARENT_CLASSNAME){L.className=this.TAB_PARENT_CLASSNAME;}this.get(G).appendChild(L);return L;},_createContentParent:function(K){var L=F.createElement("div");if(this.CONTENT_PARENT_CLASSNAME){L.className=this.CONTENT_PARENT_CLASSNAME;}this.get(G).appendChild(L);return L;}});YAHOO.widget.TabView=I;})();(function(){var D=YAHOO.util,I=D.Dom,L=YAHOO.lang,M="activeTab",J="label",G="labelEl",Q="content",C="contentEl",O="element",P="cacheData",B="dataSrc",H="dataLoaded",A="dataTimeout",N="loadMethod",F="postData",K="disabled",E=function(S,R){R=R||{};if(arguments.length==1&&!L.isString(S)&&!S.nodeName){R=S;S=R.element;}if(!S&&!R.element){S=this._createTabElement(R);}this.loadHandler={success:function(T){this.set(Q,T.responseText);},failure:function(T){}};E.superclass.constructor.call(this,S,R);this.DOM_EVENTS={};};YAHOO.extend(E,YAHOO.util.Element,{LABEL_TAGNAME:"em",ACTIVE_CLASSNAME:"selected",HIDDEN_CLASSNAME:"yui-hidden",ACTIVE_TITLE:"active",DISABLED_CLASSNAME:K,LOADING_CLASSNAME:"loading",dataConnection:null,loadHandler:null,_loading:false,toString:function(){var R=this.get(O),S=R.id||R.tagName;return"Tab "+S;},initAttributes:function(R){R=R||{};E.superclass.initAttributes.call(this,R);this.setAttributeConfig("activationEvent",{value:R.activationEvent||"click"});this.setAttributeConfig(G,{value:R[G]||this._getLabelEl(),method:function(S){S=I.get(S);
var T=this.get(G);if(T){if(T==S){return false;}T.parentNode.replaceChild(S,T);this.set(J,S.innerHTML);}}});this.setAttributeConfig(J,{value:R.label||this._getLabel(),method:function(T){var S=this.get(G);if(!S){this.set(G,this._createLabelEl());}S.innerHTML=T;}});this.setAttributeConfig(C,{value:R[C]||document.createElement("div"),method:function(S){S=I.get(S);var T=this.get(C);if(T){if(T===S){return false;}if(!this.get("selected")){I.addClass(S,"yui-hidden");}T.parentNode.replaceChild(S,T);this.set(Q,S.innerHTML);}}});this.setAttributeConfig(Q,{value:R[Q],method:function(S){this.get(C).innerHTML=S;}});this.setAttributeConfig(B,{value:R.dataSrc});this.setAttributeConfig(P,{value:R.cacheData||false,validator:L.isBoolean});this.setAttributeConfig(N,{value:R.loadMethod||"GET",validator:L.isString});this.setAttributeConfig(H,{value:false,validator:L.isBoolean,writeOnce:true});this.setAttributeConfig(A,{value:R.dataTimeout||null,validator:L.isNumber});this.setAttributeConfig(F,{value:R.postData||null});this.setAttributeConfig("active",{value:R.active||this.hasClass(this.ACTIVE_CLASSNAME),method:function(S){if(S===true){this.addClass(this.ACTIVE_CLASSNAME);this.set("title",this.ACTIVE_TITLE);}else{this.removeClass(this.ACTIVE_CLASSNAME);this.set("title","");}},validator:function(S){return L.isBoolean(S)&&!this.get(K);}});this.setAttributeConfig(K,{value:R.disabled||this.hasClass(this.DISABLED_CLASSNAME),method:function(S){if(S===true){I.addClass(this.get(O),this.DISABLED_CLASSNAME);}else{I.removeClass(this.get(O),this.DISABLED_CLASSNAME);}},validator:L.isBoolean});this.setAttributeConfig("href",{value:R.href||this.getElementsByTagName("a")[0].getAttribute("href",2)||"#",method:function(S){this.getElementsByTagName("a")[0].href=S;},validator:L.isString});this.setAttributeConfig("contentVisible",{value:R.contentVisible,method:function(S){if(S){I.removeClass(this.get(C),this.HIDDEN_CLASSNAME);if(this.get(B)){if(!this._loading&&!(this.get(H)&&this.get(P))){this._dataConnect();}}}else{I.addClass(this.get(C),this.HIDDEN_CLASSNAME);}},validator:L.isBoolean});},_dataConnect:function(){if(!D.Connect){return false;}I.addClass(this.get(C).parentNode,this.LOADING_CLASSNAME);this._loading=true;this.dataConnection=D.Connect.asyncRequest(this.get(N),this.get(B),{success:function(R){this.loadHandler.success.call(this,R);this.set(H,true);this.dataConnection=null;I.removeClass(this.get(C).parentNode,this.LOADING_CLASSNAME);this._loading=false;},failure:function(R){this.loadHandler.failure.call(this,R);this.dataConnection=null;I.removeClass(this.get(C).parentNode,this.LOADING_CLASSNAME);this._loading=false;},scope:this,timeout:this.get(A)},this.get(F));},_createTabElement:function(R){var V=document.createElement("li"),S=document.createElement("a"),U=R.label||null,T=R.labelEl||null;S.href=R.href||"#";V.appendChild(S);if(T){if(!U){U=this._getLabel();}}else{T=this._createLabelEl();}S.appendChild(T);return V;},_getLabelEl:function(){return this.getElementsByTagName(this.LABEL_TAGNAME)[0];},_createLabelEl:function(){var R=document.createElement(this.LABEL_TAGNAME);return R;},_getLabel:function(){var R=this.get(G);if(!R){return undefined;}return R.innerHTML;},_onActivate:function(U,T){var S=this,R=false;D.Event.preventDefault(U);if(S===T.get(M)){R=true;}T.set(M,S,R);}});YAHOO.widget.Tab=E;})();YAHOO.register("tabview",YAHOO.widget.TabView,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
if(typeof YAHOO=="undefined"||!YAHOO){var YAHOO={};}YAHOO.namespace=function(){var A=arguments,E=null,C,B,D;for(C=0;C<A.length;C=C+1){D=(""+A[C]).split(".");E=YAHOO;for(B=(D[0]=="YAHOO")?1:0;B<D.length;B=B+1){E[D[B]]=E[D[B]]||{};E=E[D[B]];}}return E;};YAHOO.log=function(D,A,C){var B=YAHOO.widget.Logger;if(B&&B.log){return B.log(D,A,C);}else{return false;}};YAHOO.register=function(A,E,D){var I=YAHOO.env.modules,B,H,G,F,C;if(!I[A]){I[A]={versions:[],builds:[]};}B=I[A];H=D.version;G=D.build;F=YAHOO.env.listeners;B.name=A;B.version=H;B.build=G;B.versions.push(H);B.builds.push(G);B.mainClass=E;for(C=0;C<F.length;C=C+1){F[C](B);}if(E){E.VERSION=H;E.BUILD=G;}else{YAHOO.log("mainClass is undefined for module "+A,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[]};YAHOO.env.getVersion=function(A){return YAHOO.env.modules[A]||null;};YAHOO.env.ua=function(){var C={ie:0,opera:0,gecko:0,webkit:0,mobile:null,air:0,caja:0},B=navigator.userAgent,A;if((/KHTML/).test(B)){C.webkit=1;}A=B.match(/AppleWebKit\/([^\s]*)/);if(A&&A[1]){C.webkit=parseFloat(A[1]);if(/ Mobile\//.test(B)){C.mobile="Apple";}else{A=B.match(/NokiaN[^\/]*/);if(A){C.mobile=A[0];}}A=B.match(/AdobeAIR\/([^\s]*)/);if(A){C.air=A[0];}}if(!C.webkit){A=B.match(/Opera[\s\/]([^\s]*)/);if(A&&A[1]){C.opera=parseFloat(A[1]);A=B.match(/Opera Mini[^;]*/);if(A){C.mobile=A[0];}}else{A=B.match(/MSIE\s([^;]*)/);if(A&&A[1]){C.ie=parseFloat(A[1]);}else{A=B.match(/Gecko\/([^\s]*)/);if(A){C.gecko=1;A=B.match(/rv:([^\s\)]*)/);if(A&&A[1]){C.gecko=parseFloat(A[1]);}}}}}A=B.match(/Caja\/([^\s]*)/);if(A&&A[1]){C.caja=parseFloat(A[1]);}return C;}();(function(){YAHOO.namespace("util","widget","example");if("undefined"!==typeof YAHOO_config){var B=YAHOO_config.listener,A=YAHOO.env.listeners,D=true,C;if(B){for(C=0;C<A.length;C=C+1){if(A[C]==B){D=false;break;}}if(D){A.push(B);}}}})();YAHOO.lang=YAHOO.lang||{};(function(){var B=YAHOO.lang,F="[object Array]",C="[object Function]",A=Object.prototype,E=["toString","valueOf"],D={isArray:function(G){return A.toString.apply(G)===F;},isBoolean:function(G){return typeof G==="boolean";},isFunction:function(G){return A.toString.apply(G)===C;},isNull:function(G){return G===null;},isNumber:function(G){return typeof G==="number"&&isFinite(G);},isObject:function(G){return(G&&(typeof G==="object"||B.isFunction(G)))||false;},isString:function(G){return typeof G==="string";},isUndefined:function(G){return typeof G==="undefined";},_IEEnumFix:(YAHOO.env.ua.ie)?function(I,H){var G,K,J;for(G=0;G<E.length;G=G+1){K=E[G];J=H[K];if(B.isFunction(J)&&J!=A[K]){I[K]=J;}}}:function(){},extend:function(J,K,I){if(!K||!J){throw new Error("extend failed, please check that "+"all dependencies are included.");}var H=function(){},G;H.prototype=K.prototype;J.prototype=new H();J.prototype.constructor=J;J.superclass=K.prototype;if(K.prototype.constructor==A.constructor){K.prototype.constructor=K;}if(I){for(G in I){if(B.hasOwnProperty(I,G)){J.prototype[G]=I[G];}}B._IEEnumFix(J.prototype,I);}},augmentObject:function(K,J){if(!J||!K){throw new Error("Absorb failed, verify dependencies.");}var G=arguments,I,L,H=G[2];if(H&&H!==true){for(I=2;I<G.length;I=I+1){K[G[I]]=J[G[I]];}}else{for(L in J){if(H||!(L in K)){K[L]=J[L];}}B._IEEnumFix(K,J);}},augmentProto:function(J,I){if(!I||!J){throw new Error("Augment failed, verify dependencies.");}var G=[J.prototype,I.prototype],H;for(H=2;H<arguments.length;H=H+1){G.push(arguments[H]);}B.augmentObject.apply(this,G);},dump:function(G,L){var I,K,N=[],O="{...}",H="f(){...}",M=", ",J=" => ";if(!B.isObject(G)){return G+"";}else{if(G instanceof Date||("nodeType" in G&&"tagName" in G)){return G;}else{if(B.isFunction(G)){return H;}}}L=(B.isNumber(L))?L:3;if(B.isArray(G)){N.push("[");for(I=0,K=G.length;I<K;I=I+1){if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}if(N.length>1){N.pop();}N.push("]");}else{N.push("{");for(I in G){if(B.hasOwnProperty(G,I)){N.push(I+J);if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}}if(N.length>1){N.pop();}N.push("}");}return N.join("");},substitute:function(V,H,O){var L,K,J,R,S,U,Q=[],I,M="dump",P=" ",G="{",T="}",N;for(;;){L=V.lastIndexOf(G);if(L<0){break;}K=V.indexOf(T,L);if(L+1>=K){break;}I=V.substring(L+1,K);R=I;U=null;J=R.indexOf(P);if(J>-1){U=R.substring(J+1);R=R.substring(0,J);}S=H[R];if(O){S=O(R,S,U);}if(B.isObject(S)){if(B.isArray(S)){S=B.dump(S,parseInt(U,10));}else{U=U||"";N=U.indexOf(M);if(N>-1){U=U.substring(4);}if(S.toString===A.toString||N>-1){S=B.dump(S,parseInt(U,10));}else{S=S.toString();}}}else{if(!B.isString(S)&&!B.isNumber(S)){S="~-"+Q.length+"-~";Q[Q.length]=I;}}V=V.substring(0,L)+S+V.substring(K+1);}for(L=Q.length-1;L>=0;L=L-1){V=V.replace(new RegExp("~-"+L+"-~"),"{"+Q[L]+"}","g");}return V;},trim:function(G){try{return G.replace(/^\s+|\s+$/g,"");}catch(H){return G;}},merge:function(){var J={},H=arguments,G=H.length,I;for(I=0;I<G;I=I+1){B.augmentObject(J,H[I],true);}return J;},later:function(N,H,O,J,K){N=N||0;H=H||{};var I=O,M=J,L,G;if(B.isString(O)){I=H[O];}if(!I){throw new TypeError("method undefined");}if(!B.isArray(M)){M=[J];}L=function(){I.apply(H,M);};G=(K)?setInterval(L,N):setTimeout(L,N);return{interval:K,cancel:function(){if(this.interval){clearInterval(G);}else{clearTimeout(G);}}};},isValue:function(G){return(B.isObject(G)||B.isString(G)||B.isNumber(G)||B.isBoolean(G));}};B.hasOwnProperty=(A.hasOwnProperty)?function(G,H){return G&&G.hasOwnProperty(H);}:function(G,H){return !B.isUndefined(G[H])&&G.constructor.prototype[H]!==G[H];};D.augmentObject(B,D,true);YAHOO.util.Lang=B;B.augment=B.augmentProto;YAHOO.augment=B.augmentProto;YAHOO.extend=B.extend;})();YAHOO.register("yahoo",YAHOO,{version:"2.7.0",build:"1799"});YAHOO.util.Get=function(){var M={},L=0,R=0,E=false,N=YAHOO.env.ua,S=YAHOO.lang;var J=function(W,T,X){var U=X||window,Y=U.document,Z=Y.createElement(W);for(var V in T){if(T[V]&&YAHOO.lang.hasOwnProperty(T,V)){Z.setAttribute(V,T[V]);}}return Z;};var I=function(T,U,W){var V=W||"utf-8";return J("link",{"id":"yui__dyn_"+(R++),"type":"text/css","charset":V,"rel":"stylesheet","href":T},U);
};var P=function(T,U,W){var V=W||"utf-8";return J("script",{"id":"yui__dyn_"+(R++),"type":"text/javascript","charset":V,"src":T},U);};var A=function(T,U){return{tId:T.tId,win:T.win,data:T.data,nodes:T.nodes,msg:U,purge:function(){D(this.tId);}};};var B=function(T,W){var U=M[W],V=(S.isString(T))?U.win.document.getElementById(T):T;if(!V){Q(W,"target node not found: "+T);}return V;};var Q=function(W,V){var T=M[W];if(T.onFailure){var U=T.scope||T.win;T.onFailure.call(U,A(T,V));}};var C=function(W){var T=M[W];T.finished=true;if(T.aborted){var V="transaction "+W+" was aborted";Q(W,V);return;}if(T.onSuccess){var U=T.scope||T.win;T.onSuccess.call(U,A(T));}};var O=function(V){var T=M[V];if(T.onTimeout){var U=T.scope||T;T.onTimeout.call(U,A(T));}};var G=function(V,Z){var U=M[V];if(U.timer){U.timer.cancel();}if(U.aborted){var X="transaction "+V+" was aborted";Q(V,X);return;}if(Z){U.url.shift();if(U.varName){U.varName.shift();}}else{U.url=(S.isString(U.url))?[U.url]:U.url;if(U.varName){U.varName=(S.isString(U.varName))?[U.varName]:U.varName;}}var c=U.win,b=c.document,a=b.getElementsByTagName("head")[0],W;if(U.url.length===0){if(U.type==="script"&&N.webkit&&N.webkit<420&&!U.finalpass&&!U.varName){var Y=P(null,U.win,U.charset);Y.innerHTML='YAHOO.util.Get._finalize("'+V+'");';U.nodes.push(Y);a.appendChild(Y);}else{C(V);}return;}var T=U.url[0];if(!T){U.url.shift();return G(V);}if(U.timeout){U.timer=S.later(U.timeout,U,O,V);}if(U.type==="script"){W=P(T,c,U.charset);}else{W=I(T,c,U.charset);}F(U.type,W,V,T,c,U.url.length);U.nodes.push(W);if(U.insertBefore){var e=B(U.insertBefore,V);if(e){e.parentNode.insertBefore(W,e);}}else{a.appendChild(W);}if((N.webkit||N.gecko)&&U.type==="css"){G(V,T);}};var K=function(){if(E){return;}E=true;for(var T in M){var U=M[T];if(U.autopurge&&U.finished){D(U.tId);delete M[T];}}E=false;};var D=function(a){var X=M[a];if(X){var Z=X.nodes,T=Z.length,Y=X.win.document,W=Y.getElementsByTagName("head")[0];if(X.insertBefore){var V=B(X.insertBefore,a);if(V){W=V.parentNode;}}for(var U=0;U<T;U=U+1){W.removeChild(Z[U]);}X.nodes=[];}};var H=function(U,T,V){var X="q"+(L++);V=V||{};if(L%YAHOO.util.Get.PURGE_THRESH===0){K();}M[X]=S.merge(V,{tId:X,type:U,url:T,finished:false,aborted:false,nodes:[]});var W=M[X];W.win=W.win||window;W.scope=W.scope||W.win;W.autopurge=("autopurge" in W)?W.autopurge:(U==="script")?true:false;S.later(0,W,G,X);return{tId:X};};var F=function(c,X,W,U,Y,Z,b){var a=b||G;if(N.ie){X.onreadystatechange=function(){var d=this.readyState;if("loaded"===d||"complete"===d){X.onreadystatechange=null;a(W,U);}};}else{if(N.webkit){if(c==="script"){if(N.webkit>=420){X.addEventListener("load",function(){a(W,U);});}else{var T=M[W];if(T.varName){var V=YAHOO.util.Get.POLL_FREQ;T.maxattempts=YAHOO.util.Get.TIMEOUT/V;T.attempts=0;T._cache=T.varName[0].split(".");T.timer=S.later(V,T,function(j){var f=this._cache,e=f.length,d=this.win,g;for(g=0;g<e;g=g+1){d=d[f[g]];if(!d){this.attempts++;if(this.attempts++>this.maxattempts){var h="Over retry limit, giving up";T.timer.cancel();Q(W,h);}else{}return;}}T.timer.cancel();a(W,U);},null,true);}else{S.later(YAHOO.util.Get.POLL_FREQ,null,a,[W,U]);}}}}else{X.onload=function(){a(W,U);};}}};return{POLL_FREQ:10,PURGE_THRESH:20,TIMEOUT:2000,_finalize:function(T){S.later(0,null,C,T);},abort:function(U){var V=(S.isString(U))?U:U.tId;var T=M[V];if(T){T.aborted=true;}},script:function(T,U){return H("script",T,U);},css:function(T,U){return H("css",T,U);}};}();YAHOO.register("get",YAHOO.util.Get,{version:"2.7.0",build:"1799"});(function(){var Y=YAHOO,util=Y.util,lang=Y.lang,env=Y.env,PROV="_provides",SUPER="_supersedes",REQ="expanded",AFTER="_after";var YUI={dupsAllowed:{"yahoo":true,"get":true},info:{"root":"2.7.0/build/","base":"http://yui.yahooapis.com/2.7.0/build/","comboBase":"http://yui.yahooapis.com/combo?","skin":{"defaultSkin":"sam","base":"assets/skins/","path":"skin.css","after":["reset","fonts","grids","base"],"rollup":3},dupsAllowed:["yahoo","get"],"moduleInfo":{"animation":{"type":"js","path":"animation/animation-min.js","requires":["dom","event"]},"autocomplete":{"type":"js","path":"autocomplete/autocomplete-min.js","requires":["dom","event","datasource"],"optional":["connection","animation"],"skinnable":true},"base":{"type":"css","path":"base/base-min.css","after":["reset","fonts","grids"]},"button":{"type":"js","path":"button/button-min.js","requires":["element"],"optional":["menu"],"skinnable":true},"calendar":{"type":"js","path":"calendar/calendar-min.js","requires":["event","dom"],"skinnable":true},"carousel":{"type":"js","path":"carousel/carousel-min.js","requires":["element"],"optional":["animation"],"skinnable":true},"charts":{"type":"js","path":"charts/charts-min.js","requires":["element","json","datasource"]},"colorpicker":{"type":"js","path":"colorpicker/colorpicker-min.js","requires":["slider","element"],"optional":["animation"],"skinnable":true},"connection":{"type":"js","path":"connection/connection-min.js","requires":["event"]},"container":{"type":"js","path":"container/container-min.js","requires":["dom","event"],"optional":["dragdrop","animation","connection"],"supersedes":["containercore"],"skinnable":true},"containercore":{"type":"js","path":"container/container_core-min.js","requires":["dom","event"],"pkg":"container"},"cookie":{"type":"js","path":"cookie/cookie-min.js","requires":["yahoo"]},"datasource":{"type":"js","path":"datasource/datasource-min.js","requires":["event"],"optional":["connection"]},"datatable":{"type":"js","path":"datatable/datatable-min.js","requires":["element","datasource"],"optional":["calendar","dragdrop","paginator"],"skinnable":true},"dom":{"type":"js","path":"dom/dom-min.js","requires":["yahoo"]},"dragdrop":{"type":"js","path":"dragdrop/dragdrop-min.js","requires":["dom","event"]},"editor":{"type":"js","path":"editor/editor-min.js","requires":["menu","element","button"],"optional":["animation","dragdrop"],"supersedes":["simpleeditor"],"skinnable":true},"element":{"type":"js","path":"element/element-min.js","requires":["dom","event"]},"event":{"type":"js","path":"event/event-min.js","requires":["yahoo"]},"fonts":{"type":"css","path":"fonts/fonts-min.css"},"get":{"type":"js","path":"get/get-min.js","requires":["yahoo"]},"grids":{"type":"css","path":"grids/grids-min.css","requires":["fonts"],"optional":["reset"]},"history":{"type":"js","path":"history/history-min.js","requires":["event"]},"imagecropper":{"type":"js","path":"imagecropper/imagecropper-min.js","requires":["dom","event","dragdrop","element","resize"],"skinnable":true},"imageloader":{"type":"js","path":"imageloader/imageloader-min.js","requires":["event","dom"]},"json":{"type":"js","path":"json/json-min.js","requires":["yahoo"]},"layout":{"type":"js","path":"layout/layout-min.js","requires":["dom","event","element"],"optional":["animation","dragdrop","resize","selector"],"skinnable":true},"logger":{"type":"js","path":"logger/logger-min.js","requires":["event","dom"],"optional":["dragdrop"],"skinnable":true},"menu":{"type":"js","path":"menu/menu-min.js","requires":["containercore"],"skinnable":true},"paginator":{"type":"js","path":"paginator/paginator-min.js","requires":["element"],"skinnable":true},"profiler":{"type":"js","path":"profiler/profiler-min.js","requires":["yahoo"]},"profilerviewer":{"type":"js","path":"profilerviewer/profilerviewer-min.js","requires":["profiler","yuiloader","element"],"skinnable":true},"reset":{"type":"css","path":"reset/reset-min.css"},"reset-fonts-grids":{"type":"css","path":"reset-fonts-grids/reset-fonts-grids.css","supersedes":["reset","fonts","grids","reset-fonts"],"rollup":4},"reset-fonts":{"type":"css","path":"reset-fonts/reset-fonts.css","supersedes":["reset","fonts"],"rollup":2},"resize":{"type":"js","path":"resize/resize-min.js","requires":["dom","event","dragdrop","element"],"optional":["animation"],"skinnable":true},"selector":{"type":"js","path":"selector/selector-min.js","requires":["yahoo","dom"]},"simpleeditor":{"type":"js","path":"editor/simpleeditor-min.js","requires":["element"],"optional":["containercore","menu","button","animation","dragdrop"],"skinnable":true,"pkg":"editor"},"slider":{"type":"js","path":"slider/slider-min.js","requires":["dragdrop"],"optional":["animation"],"skinnable":true},"stylesheet":{"type":"js","path":"stylesheet/stylesheet-min.js","requires":["yahoo"]},"tabview":{"type":"js","path":"tabview/tabview-min.js","requires":["element"],"optional":["connection"],"skinnable":true},"treeview":{"type":"js","path":"treeview/treeview-min.js","requires":["event","dom"],"optional":["json"],"skinnable":true},"uploader":{"type":"js","path":"uploader/uploader.js","requires":["element"]},"utilities":{"type":"js","path":"utilities/utilities.js","supersedes":["yahoo","event","dragdrop","animation","dom","connection","element","yahoo-dom-event","get","yuiloader","yuiloader-dom-event"],"rollup":8},"yahoo":{"type":"js","path":"yahoo/yahoo-min.js"},"yahoo-dom-event":{"type":"js","path":"yahoo-dom-event/yahoo-dom-event.js","supersedes":["yahoo","event","dom"],"rollup":3},"yuiloader":{"type":"js","path":"yuiloader/yuiloader-min.js","supersedes":["yahoo","get"]},"yuiloader-dom-event":{"type":"js","path":"yuiloader-dom-event/yuiloader-dom-event.js","supersedes":["yahoo","dom","event","get","yuiloader","yahoo-dom-event"],"rollup":5},"yuitest":{"type":"js","path":"yuitest/yuitest-min.js","requires":["logger"],"skinnable":true}}},ObjectUtil:{appendArray:function(o,a){if(a){for(var i=0;
i<a.length;i=i+1){o[a[i]]=true;}}},keys:function(o,ordered){var a=[],i;for(i in o){if(lang.hasOwnProperty(o,i)){a.push(i);}}return a;}},ArrayUtil:{appendArray:function(a1,a2){Array.prototype.push.apply(a1,a2);},indexOf:function(a,val){for(var i=0;i<a.length;i=i+1){if(a[i]===val){return i;}}return -1;},toObject:function(a){var o={};for(var i=0;i<a.length;i=i+1){o[a[i]]=true;}return o;},uniq:function(a){return YUI.ObjectUtil.keys(YUI.ArrayUtil.toObject(a));}}};YAHOO.util.YUILoader=function(o){this._internalCallback=null;this._useYahooListener=false;this.onSuccess=null;this.onFailure=Y.log;this.onProgress=null;this.onTimeout=null;this.scope=this;this.data=null;this.insertBefore=null;this.charset=null;this.varName=null;this.base=YUI.info.base;this.comboBase=YUI.info.comboBase;this.combine=false;this.root=YUI.info.root;this.timeout=0;this.ignore=null;this.force=null;this.allowRollup=true;this.filter=null;this.required={};this.moduleInfo=lang.merge(YUI.info.moduleInfo);this.rollups=null;this.loadOptional=false;this.sorted=[];this.loaded={};this.dirty=true;this.inserted={};var self=this;env.listeners.push(function(m){if(self._useYahooListener){self.loadNext(m.name);}});this.skin=lang.merge(YUI.info.skin);this._config(o);};Y.util.YUILoader.prototype={FILTERS:{RAW:{"searchExp":"-min\\.js","replaceStr":".js"},DEBUG:{"searchExp":"-min\\.js","replaceStr":"-debug.js"}},SKIN_PREFIX:"skin-",_config:function(o){if(o){for(var i in o){if(lang.hasOwnProperty(o,i)){if(i=="require"){this.require(o[i]);}else{this[i]=o[i];}}}}var f=this.filter;if(lang.isString(f)){f=f.toUpperCase();if(f==="DEBUG"){this.require("logger");}if(!Y.widget.LogWriter){Y.widget.LogWriter=function(){return Y;};}this.filter=this.FILTERS[f];}},addModule:function(o){if(!o||!o.name||!o.type||(!o.path&&!o.fullpath)){return false;}o.ext=("ext" in o)?o.ext:true;o.requires=o.requires||[];this.moduleInfo[o.name]=o;this.dirty=true;return true;},require:function(what){var a=(typeof what==="string")?arguments:what;this.dirty=true;YUI.ObjectUtil.appendArray(this.required,a);},_addSkin:function(skin,mod){var name=this.formatSkin(skin),info=this.moduleInfo,sinf=this.skin,ext=info[mod]&&info[mod].ext;if(!info[name]){this.addModule({"name":name,"type":"css","path":sinf.base+skin+"/"+sinf.path,"after":sinf.after,"rollup":sinf.rollup,"ext":ext});}if(mod){name=this.formatSkin(skin,mod);if(!info[name]){var mdef=info[mod],pkg=mdef.pkg||mod;this.addModule({"name":name,"type":"css","after":sinf.after,"path":pkg+"/"+sinf.base+skin+"/"+mod+".css","ext":ext});}}return name;},getRequires:function(mod){if(!mod){return[];}if(!this.dirty&&mod.expanded){return mod.expanded;}mod.requires=mod.requires||[];var i,d=[],r=mod.requires,o=mod.optional,info=this.moduleInfo,m;for(i=0;i<r.length;i=i+1){d.push(r[i]);m=info[r[i]];YUI.ArrayUtil.appendArray(d,this.getRequires(m));}if(o&&this.loadOptional){for(i=0;i<o.length;i=i+1){d.push(o[i]);YUI.ArrayUtil.appendArray(d,this.getRequires(info[o[i]]));}}mod.expanded=YUI.ArrayUtil.uniq(d);return mod.expanded;},getProvides:function(name,notMe){var addMe=!(notMe),ckey=(addMe)?PROV:SUPER,m=this.moduleInfo[name],o={};if(!m){return o;}if(m[ckey]){return m[ckey];}var s=m.supersedes,done={},me=this;var add=function(mm){if(!done[mm]){done[mm]=true;lang.augmentObject(o,me.getProvides(mm));}};if(s){for(var i=0;i<s.length;i=i+1){add(s[i]);}}m[SUPER]=o;m[PROV]=lang.merge(o);m[PROV][name]=true;return m[ckey];},calculate:function(o){if(o||this.dirty){this._config(o);this._setup();this._explode();if(this.allowRollup){this._rollup();}this._reduce();this._sort();this.dirty=false;}},_setup:function(){var info=this.moduleInfo,name,i,j;for(name in info){if(lang.hasOwnProperty(info,name)){var m=info[name];if(m&&m.skinnable){var o=this.skin.overrides,smod;if(o&&o[name]){for(i=0;i<o[name].length;i=i+1){smod=this._addSkin(o[name][i],name);}}else{smod=this._addSkin(this.skin.defaultSkin,name);}m.requires.push(smod);}}}var l=lang.merge(this.inserted);if(!this._sandbox){l=lang.merge(l,env.modules);}if(this.ignore){YUI.ObjectUtil.appendArray(l,this.ignore);}if(this.force){for(i=0;i<this.force.length;i=i+1){if(this.force[i] in l){delete l[this.force[i]];}}}for(j in l){if(lang.hasOwnProperty(l,j)){lang.augmentObject(l,this.getProvides(j));}}this.loaded=l;},_explode:function(){var r=this.required,i,mod;for(i in r){if(lang.hasOwnProperty(r,i)){mod=this.moduleInfo[i];if(mod){var req=this.getRequires(mod);if(req){YUI.ObjectUtil.appendArray(r,req);}}}}},_skin:function(){},formatSkin:function(skin,mod){var s=this.SKIN_PREFIX+skin;if(mod){s=s+"-"+mod;}return s;},parseSkin:function(mod){if(mod.indexOf(this.SKIN_PREFIX)===0){var a=mod.split("-");return{skin:a[1],module:a[2]};}return null;},_rollup:function(){var i,j,m,s,rollups={},r=this.required,roll,info=this.moduleInfo;if(this.dirty||!this.rollups){for(i in info){if(lang.hasOwnProperty(info,i)){m=info[i];if(m&&m.rollup){rollups[i]=m;}}}this.rollups=rollups;}for(;;){var rolled=false;for(i in rollups){if(!r[i]&&!this.loaded[i]){m=info[i];s=m.supersedes;roll=false;if(!m.rollup){continue;}var skin=(m.ext)?false:this.parseSkin(i),c=0;if(skin){for(j in r){if(lang.hasOwnProperty(r,j)){if(i!==j&&this.parseSkin(j)){c++;roll=(c>=m.rollup);if(roll){break;}}}}}else{for(j=0;j<s.length;j=j+1){if(this.loaded[s[j]]&&(!YUI.dupsAllowed[s[j]])){roll=false;break;}else{if(r[s[j]]){c++;roll=(c>=m.rollup);if(roll){break;}}}}}if(roll){r[i]=true;rolled=true;this.getRequires(m);}}}if(!rolled){break;}}},_reduce:function(){var i,j,s,m,r=this.required;for(i in r){if(i in this.loaded){delete r[i];}else{var skinDef=this.parseSkin(i);if(skinDef){if(!skinDef.module){var skin_pre=this.SKIN_PREFIX+skinDef.skin;for(j in r){if(lang.hasOwnProperty(r,j)){m=this.moduleInfo[j];var ext=m&&m.ext;if(!ext&&j!==i&&j.indexOf(skin_pre)>-1){delete r[j];}}}}}else{m=this.moduleInfo[i];s=m&&m.supersedes;if(s){for(j=0;j<s.length;j=j+1){if(s[j] in r){delete r[s[j]];}}}}}}},_onFailure:function(msg){YAHOO.log("Failure","info","loader");var f=this.onFailure;if(f){f.call(this.scope,{msg:"failure: "+msg,data:this.data,success:false});
}},_onTimeout:function(){YAHOO.log("Timeout","info","loader");var f=this.onTimeout;if(f){f.call(this.scope,{msg:"timeout",data:this.data,success:false});}},_sort:function(){var s=[],info=this.moduleInfo,loaded=this.loaded,checkOptional=!this.loadOptional,me=this;var requires=function(aa,bb){var mm=info[aa];if(loaded[bb]||!mm){return false;}var ii,rr=mm.expanded,after=mm.after,other=info[bb],optional=mm.optional;if(rr&&YUI.ArrayUtil.indexOf(rr,bb)>-1){return true;}if(after&&YUI.ArrayUtil.indexOf(after,bb)>-1){return true;}if(checkOptional&&optional&&YUI.ArrayUtil.indexOf(optional,bb)>-1){return true;}var ss=info[bb]&&info[bb].supersedes;if(ss){for(ii=0;ii<ss.length;ii=ii+1){if(requires(aa,ss[ii])){return true;}}}if(mm.ext&&mm.type=="css"&&!other.ext&&other.type=="css"){return true;}return false;};for(var i in this.required){if(lang.hasOwnProperty(this.required,i)){s.push(i);}}var p=0;for(;;){var l=s.length,a,b,j,k,moved=false;for(j=p;j<l;j=j+1){a=s[j];for(k=j+1;k<l;k=k+1){if(requires(a,s[k])){b=s.splice(k,1);s.splice(j,0,b[0]);moved=true;break;}}if(moved){break;}else{p=p+1;}}if(!moved){break;}}this.sorted=s;},toString:function(){var o={type:"YUILoader",base:this.base,filter:this.filter,required:this.required,loaded:this.loaded,inserted:this.inserted};lang.dump(o,1);},_combine:function(){this._combining=[];var self=this,s=this.sorted,len=s.length,js=this.comboBase,css=this.comboBase,target,startLen=js.length,i,m,type=this.loadType;YAHOO.log("type "+type);for(i=0;i<len;i=i+1){m=this.moduleInfo[s[i]];if(m&&!m.ext&&(!type||type===m.type)){target=this.root+m.path;target+="&";if(m.type=="js"){js+=target;}else{css+=target;}this._combining.push(s[i]);}}if(this._combining.length){YAHOO.log("Attempting to combine: "+this._combining,"info","loader");var callback=function(o){var c=this._combining,len=c.length,i,m;for(i=0;i<len;i=i+1){this.inserted[c[i]]=true;}this.loadNext(o.data);},loadScript=function(){if(js.length>startLen){YAHOO.util.Get.script(self._filter(js),{data:self._loading,onSuccess:callback,onFailure:self._onFailure,onTimeout:self._onTimeout,insertBefore:self.insertBefore,charset:self.charset,timeout:self.timeout,scope:self});}};if(css.length>startLen){YAHOO.util.Get.css(this._filter(css),{data:this._loading,onSuccess:loadScript,onFailure:this._onFailure,onTimeout:this._onTimeout,insertBefore:this.insertBefore,charset:this.charset,timeout:this.timeout,scope:self});}else{loadScript();}return;}else{this.loadNext(this._loading);}},insert:function(o,type){this.calculate(o);this._loading=true;this.loadType=type;if(this.combine){return this._combine();}if(!type){var self=this;this._internalCallback=function(){self._internalCallback=null;self.insert(null,"js");};this.insert(null,"css");return;}this.loadNext();},sandbox:function(o,type){this._config(o);if(!this.onSuccess){throw new Error("You must supply an onSuccess handler for your sandbox");}this._sandbox=true;var self=this;if(!type||type!=="js"){this._internalCallback=function(){self._internalCallback=null;self.sandbox(null,"js");};this.insert(null,"css");return;}if(!util.Connect){var ld=new YAHOO.util.YUILoader();ld.insert({base:this.base,filter:this.filter,require:"connection",insertBefore:this.insertBefore,charset:this.charset,onSuccess:function(){this.sandbox(null,"js");},scope:this},"js");return;}this._scriptText=[];this._loadCount=0;this._stopCount=this.sorted.length;this._xhr=[];this.calculate();var s=this.sorted,l=s.length,i,m,url;for(i=0;i<l;i=i+1){m=this.moduleInfo[s[i]];if(!m){this._onFailure("undefined module "+m);for(var j=0;j<this._xhr.length;j=j+1){this._xhr[j].abort();}return;}if(m.type!=="js"){this._loadCount++;continue;}url=m.fullpath;url=(url)?this._filter(url):this._url(m.path);var xhrData={success:function(o){var idx=o.argument[0],name=o.argument[2];this._scriptText[idx]=o.responseText;if(this.onProgress){this.onProgress.call(this.scope,{name:name,scriptText:o.responseText,xhrResponse:o,data:this.data});}this._loadCount++;if(this._loadCount>=this._stopCount){var v=this.varName||"YAHOO";var t="(function() {\n";var b="\nreturn "+v+";\n})();";var ref=eval(t+this._scriptText.join("\n")+b);this._pushEvents(ref);if(ref){this.onSuccess.call(this.scope,{reference:ref,data:this.data});}else{this._onFailure.call(this.varName+" reference failure");}}},failure:function(o){this.onFailure.call(this.scope,{msg:"XHR failure",xhrResponse:o,data:this.data});},scope:this,argument:[i,url,s[i]]};this._xhr.push(util.Connect.asyncRequest("GET",url,xhrData));}},loadNext:function(mname){if(!this._loading){return;}if(mname){if(mname!==this._loading){return;}this.inserted[mname]=true;if(this.onProgress){this.onProgress.call(this.scope,{name:mname,data:this.data});}}var s=this.sorted,len=s.length,i,m;for(i=0;i<len;i=i+1){if(s[i] in this.inserted){continue;}if(s[i]===this._loading){return;}m=this.moduleInfo[s[i]];if(!m){this.onFailure.call(this.scope,{msg:"undefined module "+m,data:this.data});return;}if(!this.loadType||this.loadType===m.type){this._loading=s[i];var fn=(m.type==="css")?util.Get.css:util.Get.script,url=m.fullpath,self=this,c=function(o){self.loadNext(o.data);};url=(url)?this._filter(url):this._url(m.path);if(env.ua.webkit&&env.ua.webkit<420&&m.type==="js"&&!m.varName){c=null;this._useYahooListener=true;}fn(url,{data:s[i],onSuccess:c,onFailure:this._onFailure,onTimeout:this._onTimeout,insertBefore:this.insertBefore,charset:this.charset,timeout:this.timeout,varName:m.varName,scope:self});return;}}this._loading=null;if(this._internalCallback){var f=this._internalCallback;this._internalCallback=null;f.call(this);}else{if(this.onSuccess){this._pushEvents();this.onSuccess.call(this.scope,{data:this.data});}}},_pushEvents:function(ref){var r=ref||YAHOO;if(r.util&&r.util.Event){r.util.Event._load();}},_filter:function(str){var f=this.filter;return(f)?str.replace(new RegExp(f.searchExp,"g"),f.replaceStr):str;},_url:function(path){return this._filter((this.base||"")+path);}};})();YAHOO.register("yuiloader",YAHOO.util.YUILoader,{version:"2.7.0",build:"1799"});
(function(){YAHOO.env._id_counter=YAHOO.env._id_counter||0;var E=YAHOO.util,L=YAHOO.lang,m=YAHOO.env.ua,A=YAHOO.lang.trim,d={},h={},N=/^t(?:able|d|h)$/i,X=/color$/i,K=window.document,W=K.documentElement,e="ownerDocument",n="defaultView",v="documentElement",t="compatMode",b="offsetLeft",P="offsetTop",u="offsetParent",Z="parentNode",l="nodeType",C="tagName",O="scrollLeft",i="scrollTop",Q="getBoundingClientRect",w="getComputedStyle",a="currentStyle",M="CSS1Compat",c="BackCompat",g="class",F="className",J="",B=" ",s="(?:^|\\s)",k="(?= |$)",U="g",p="position",f="fixed",V="relative",j="left",o="top",r="medium",q="borderLeftWidth",R="borderTopWidth",D=m.opera,I=m.webkit,H=m.gecko,T=m.ie;E.Dom={CUSTOM_ATTRIBUTES:(!W.hasAttribute)?{"for":"htmlFor","class":F}:{"htmlFor":"for","className":g},get:function(y){var AA,Y,z,x,G;if(y){if(y[l]||y.item){return y;}if(typeof y==="string"){AA=y;y=K.getElementById(y);if(y&&y.id===AA){return y;}else{if(y&&K.all){y=null;Y=K.all[AA];for(x=0,G=Y.length;x<G;++x){if(Y[x].id===AA){return Y[x];}}}}return y;}if(y.DOM_EVENTS){y=y.get("element");}if("length" in y){z=[];for(x=0,G=y.length;x<G;++x){z[z.length]=E.Dom.get(y[x]);}return z;}return y;}return null;},getComputedStyle:function(G,Y){if(window[w]){return G[e][n][w](G,null)[Y];}else{if(G[a]){return E.Dom.IE_ComputedStyle.get(G,Y);}}},getStyle:function(G,Y){return E.Dom.batch(G,E.Dom._getStyle,Y);},_getStyle:function(){if(window[w]){return function(G,y){y=(y==="float")?y="cssFloat":E.Dom._toCamel(y);var x=G.style[y],Y;if(!x){Y=G[e][n][w](G,null);if(Y){x=Y[y];}}return x;};}else{if(W[a]){return function(G,y){var x;switch(y){case"opacity":x=100;try{x=G.filters["DXImageTransform.Microsoft.Alpha"].opacity;}catch(z){try{x=G.filters("alpha").opacity;}catch(Y){}}return x/100;case"float":y="styleFloat";default:y=E.Dom._toCamel(y);x=G[a]?G[a][y]:null;return(G.style[y]||x);}};}}}(),setStyle:function(G,Y,x){E.Dom.batch(G,E.Dom._setStyle,{prop:Y,val:x});},_setStyle:function(){if(T){return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){switch(x){case"opacity":if(L.isString(Y.style.filter)){Y.style.filter="alpha(opacity="+y*100+")";if(!Y[a]||!Y[a].hasLayout){Y.style.zoom=1;}}break;case"float":x="styleFloat";default:Y.style[x]=y;}}else{}};}else{return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){if(x=="float"){x="cssFloat";}Y.style[x]=y;}else{}};}}(),getXY:function(G){return E.Dom.batch(G,E.Dom._getXY);},_canPosition:function(G){return(E.Dom._getStyle(G,"display")!=="none"&&E.Dom._inDoc(G));},_getXY:function(){if(K[v][Q]){return function(y){var z,Y,AA,AF,AE,AD,AC,G,x,AB=Math.floor,AG=false;if(E.Dom._canPosition(y)){AA=y[Q]();AF=y[e];z=E.Dom.getDocumentScrollLeft(AF);Y=E.Dom.getDocumentScrollTop(AF);AG=[AB(AA[j]),AB(AA[o])];if(T&&m.ie<8){AE=2;AD=2;AC=AF[t];G=S(AF[v],q);x=S(AF[v],R);if(m.ie===6){if(AC!==c){AE=0;AD=0;}}if((AC==c)){if(G!==r){AE=parseInt(G,10);}if(x!==r){AD=parseInt(x,10);}}AG[0]-=AE;AG[1]-=AD;}if((Y||z)){AG[0]+=z;AG[1]+=Y;}AG[0]=AB(AG[0]);AG[1]=AB(AG[1]);}else{}return AG;};}else{return function(y){var x,Y,AA,AB,AC,z=false,G=y;if(E.Dom._canPosition(y)){z=[y[b],y[P]];x=E.Dom.getDocumentScrollLeft(y[e]);Y=E.Dom.getDocumentScrollTop(y[e]);AC=((H||m.webkit>519)?true:false);while((G=G[u])){z[0]+=G[b];z[1]+=G[P];if(AC){z=E.Dom._calcBorders(G,z);}}if(E.Dom._getStyle(y,p)!==f){G=y;while((G=G[Z])&&G[C]){AA=G[i];AB=G[O];if(H&&(E.Dom._getStyle(G,"overflow")!=="visible")){z=E.Dom._calcBorders(G,z);}if(AA||AB){z[0]-=AB;z[1]-=AA;}}z[0]+=x;z[1]+=Y;}else{if(D){z[0]-=x;z[1]-=Y;}else{if(I||H){z[0]+=x;z[1]+=Y;}}}z[0]=Math.floor(z[0]);z[1]=Math.floor(z[1]);}else{}return z;};}}(),getX:function(G){var Y=function(x){return E.Dom.getXY(x)[0];};return E.Dom.batch(G,Y,E.Dom,true);},getY:function(G){var Y=function(x){return E.Dom.getXY(x)[1];};return E.Dom.batch(G,Y,E.Dom,true);},setXY:function(G,x,Y){E.Dom.batch(G,E.Dom._setXY,{pos:x,noRetry:Y});},_setXY:function(G,z){var AA=E.Dom._getStyle(G,p),y=E.Dom.setStyle,AD=z.pos,Y=z.noRetry,AB=[parseInt(E.Dom.getComputedStyle(G,j),10),parseInt(E.Dom.getComputedStyle(G,o),10)],AC,x;if(AA=="static"){AA=V;y(G,p,AA);}AC=E.Dom._getXY(G);if(!AD||AC===false){return false;}if(isNaN(AB[0])){AB[0]=(AA==V)?0:G[b];}if(isNaN(AB[1])){AB[1]=(AA==V)?0:G[P];}if(AD[0]!==null){y(G,j,AD[0]-AC[0]+AB[0]+"px");}if(AD[1]!==null){y(G,o,AD[1]-AC[1]+AB[1]+"px");}if(!Y){x=E.Dom._getXY(G);if((AD[0]!==null&&x[0]!=AD[0])||(AD[1]!==null&&x[1]!=AD[1])){E.Dom._setXY(G,{pos:AD,noRetry:true});}}},setX:function(Y,G){E.Dom.setXY(Y,[G,null]);},setY:function(G,Y){E.Dom.setXY(G,[null,Y]);},getRegion:function(G){var Y=function(x){var y=false;if(E.Dom._canPosition(x)){y=E.Region.getRegion(x);}else{}return y;};return E.Dom.batch(G,Y,E.Dom,true);},getClientWidth:function(){return E.Dom.getViewportWidth();},getClientHeight:function(){return E.Dom.getViewportHeight();},getElementsByClassName:function(AB,AF,AC,AE,x,AD){AB=L.trim(AB);AF=AF||"*";AC=(AC)?E.Dom.get(AC):null||K;if(!AC){return[];}var Y=[],G=AC.getElementsByTagName(AF),z=E.Dom.hasClass;for(var y=0,AA=G.length;y<AA;++y){if(z(G[y],AB)){Y[Y.length]=G[y];}}if(AE){E.Dom.batch(Y,AE,x,AD);}return Y;},hasClass:function(Y,G){return E.Dom.batch(Y,E.Dom._hasClass,G);},_hasClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom.getAttribute(x,F)||J;if(Y.exec){G=Y.test(y);}else{G=Y&&(B+y+B).indexOf(B+Y+B)>-1;}}else{}return G;},addClass:function(Y,G){return E.Dom.batch(Y,E.Dom._addClass,G);},_addClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom.getAttribute(x,F)||J;if(!E.Dom._hasClass(x,Y)){E.Dom.setAttribute(x,F,A(y+B+Y));G=true;}}else{}return G;},removeClass:function(Y,G){return E.Dom.batch(Y,E.Dom._removeClass,G);},_removeClass:function(y,x){var Y=false,AA,z,G;if(y&&x){AA=E.Dom.getAttribute(y,F)||J;E.Dom.setAttribute(y,F,AA.replace(E.Dom._getClassRegex(x),J));z=E.Dom.getAttribute(y,F);if(AA!==z){E.Dom.setAttribute(y,F,A(z));Y=true;if(E.Dom.getAttribute(y,F)===""){G=(y.hasAttribute&&y.hasAttribute(g))?g:F;y.removeAttribute(G);}}}else{}return Y;},replaceClass:function(x,Y,G){return E.Dom.batch(x,E.Dom._replaceClass,{from:Y,to:G});
},_replaceClass:function(y,x){var Y,AB,AA,G=false,z;if(y&&x){AB=x.from;AA=x.to;if(!AA){G=false;}else{if(!AB){G=E.Dom._addClass(y,x.to);}else{if(AB!==AA){z=E.Dom.getAttribute(y,F)||J;Y=(B+z.replace(E.Dom._getClassRegex(AB),B+AA)).split(E.Dom._getClassRegex(AA));Y.splice(1,0,B+AA);E.Dom.setAttribute(y,F,A(Y.join(J)));G=true;}}}}else{}return G;},generateId:function(G,x){x=x||"yui-gen";var Y=function(y){if(y&&y.id){return y.id;}var z=x+YAHOO.env._id_counter++;if(y){if(y[e].getElementById(z)){return E.Dom.generateId(y,z+x);}y.id=z;}return z;};return E.Dom.batch(G,Y,E.Dom,true)||Y.apply(E.Dom,arguments);},isAncestor:function(Y,x){Y=E.Dom.get(Y);x=E.Dom.get(x);var G=false;if((Y&&x)&&(Y[l]&&x[l])){if(Y.contains&&Y!==x){G=Y.contains(x);}else{if(Y.compareDocumentPosition){G=!!(Y.compareDocumentPosition(x)&16);}}}else{}return G;},inDocument:function(G,Y){return E.Dom._inDoc(E.Dom.get(G),Y);},_inDoc:function(Y,x){var G=false;if(Y&&Y[C]){x=x||Y[e];G=E.Dom.isAncestor(x[v],Y);}else{}return G;},getElementsBy:function(Y,AF,AB,AD,y,AC,AE){AF=AF||"*";AB=(AB)?E.Dom.get(AB):null||K;if(!AB){return[];}var x=[],G=AB.getElementsByTagName(AF);for(var z=0,AA=G.length;z<AA;++z){if(Y(G[z])){if(AE){x=G[z];break;}else{x[x.length]=G[z];}}}if(AD){E.Dom.batch(x,AD,y,AC);}return x;},getElementBy:function(x,G,Y){return E.Dom.getElementsBy(x,G,Y,null,null,null,true);},batch:function(x,AB,AA,z){var y=[],Y=(z)?AA:window;x=(x&&(x[C]||x.item))?x:E.Dom.get(x);if(x&&AB){if(x[C]||x.length===undefined){return AB.call(Y,x,AA);}for(var G=0;G<x.length;++G){y[y.length]=AB.call(Y,x[G],AA);}}else{return false;}return y;},getDocumentHeight:function(){var Y=(K[t]!=M||I)?K.body.scrollHeight:W.scrollHeight,G=Math.max(Y,E.Dom.getViewportHeight());return G;},getDocumentWidth:function(){var Y=(K[t]!=M||I)?K.body.scrollWidth:W.scrollWidth,G=Math.max(Y,E.Dom.getViewportWidth());return G;},getViewportHeight:function(){var G=self.innerHeight,Y=K[t];if((Y||T)&&!D){G=(Y==M)?W.clientHeight:K.body.clientHeight;}return G;},getViewportWidth:function(){var G=self.innerWidth,Y=K[t];if(Y||T){G=(Y==M)?W.clientWidth:K.body.clientWidth;}return G;},getAncestorBy:function(G,Y){while((G=G[Z])){if(E.Dom._testElement(G,Y)){return G;}}return null;},getAncestorByClassName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return E.Dom.hasClass(y,G);};return E.Dom.getAncestorBy(Y,x);},getAncestorByTagName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return y[C]&&y[C].toUpperCase()==G.toUpperCase();};return E.Dom.getAncestorBy(Y,x);},getPreviousSiblingBy:function(G,Y){while(G){G=G.previousSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getPreviousSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getPreviousSiblingBy(G);},getNextSiblingBy:function(G,Y){while(G){G=G.nextSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getNextSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getNextSiblingBy(G);},getFirstChildBy:function(G,x){var Y=(E.Dom._testElement(G.firstChild,x))?G.firstChild:null;return Y||E.Dom.getNextSiblingBy(G.firstChild,x);},getFirstChild:function(G,Y){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getFirstChildBy(G);},getLastChildBy:function(G,x){if(!G){return null;}var Y=(E.Dom._testElement(G.lastChild,x))?G.lastChild:null;return Y||E.Dom.getPreviousSiblingBy(G.lastChild,x);},getLastChild:function(G){G=E.Dom.get(G);return E.Dom.getLastChildBy(G);},getChildrenBy:function(Y,y){var x=E.Dom.getFirstChildBy(Y,y),G=x?[x]:[];E.Dom.getNextSiblingBy(x,function(z){if(!y||y(z)){G[G.length]=z;}return false;});return G;},getChildren:function(G){G=E.Dom.get(G);if(!G){}return E.Dom.getChildrenBy(G);},getDocumentScrollLeft:function(G){G=G||K;return Math.max(G[v].scrollLeft,G.body.scrollLeft);},getDocumentScrollTop:function(G){G=G||K;return Math.max(G[v].scrollTop,G.body.scrollTop);},insertBefore:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}return G[Z].insertBefore(Y,G);},insertAfter:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}if(G.nextSibling){return G[Z].insertBefore(Y,G.nextSibling);}else{return G[Z].appendChild(Y);}},getClientRegion:function(){var x=E.Dom.getDocumentScrollTop(),Y=E.Dom.getDocumentScrollLeft(),y=E.Dom.getViewportWidth()+Y,G=E.Dom.getViewportHeight()+x;return new E.Region(x,y,G,Y);},setAttribute:function(Y,G,x){G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;Y.setAttribute(G,x);},getAttribute:function(Y,G){G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;return Y.getAttribute(G);},_toCamel:function(Y){var x=d;function G(y,z){return z.toUpperCase();}return x[Y]||(x[Y]=Y.indexOf("-")===-1?Y:Y.replace(/-([a-z])/gi,G));},_getClassRegex:function(Y){var G;if(Y!==undefined){if(Y.exec){G=Y;}else{G=h[Y];if(!G){Y=Y.replace(E.Dom._patterns.CLASS_RE_TOKENS,"\\$1");G=h[Y]=new RegExp(s+Y+k,U);}}}return G;},_patterns:{ROOT_TAG:/^body|html$/i,CLASS_RE_TOKENS:/([\.\(\)\^\$\*\+\?\|\[\]\{\}])/g},_testElement:function(G,Y){return G&&G[l]==1&&(!Y||Y(G));},_calcBorders:function(x,y){var Y=parseInt(E.Dom[w](x,R),10)||0,G=parseInt(E.Dom[w](x,q),10)||0;if(H){if(N.test(x[C])){Y=0;G=0;}}y[0]+=G;y[1]+=Y;return y;}};var S=E.Dom[w];if(m.opera){E.Dom[w]=function(Y,G){var x=S(Y,G);if(X.test(G)){x=E.Dom.Color.toRGB(x);}return x;};}if(m.webkit){E.Dom[w]=function(Y,G){var x=S(Y,G);if(x==="rgba(0, 0, 0, 0)"){x="transparent";}return x;};}})();YAHOO.util.Region=function(C,D,A,B){this.top=C;this.y=C;this[1]=C;this.right=D;this.bottom=A;this.left=B;this.x=B;this[0]=B;this.width=this.right-this.left;this.height=this.bottom-this.top;};YAHOO.util.Region.prototype.contains=function(A){return(A.left>=this.left&&A.right<=this.right&&A.top>=this.top&&A.bottom<=this.bottom);};YAHOO.util.Region.prototype.getArea=function(){return((this.bottom-this.top)*(this.right-this.left));};YAHOO.util.Region.prototype.intersect=function(E){var C=Math.max(this.top,E.top),D=Math.min(this.right,E.right),A=Math.min(this.bottom,E.bottom),B=Math.max(this.left,E.left);if(A>=C&&D>=B){return new YAHOO.util.Region(C,D,A,B);
}else{return null;}};YAHOO.util.Region.prototype.union=function(E){var C=Math.min(this.top,E.top),D=Math.max(this.right,E.right),A=Math.max(this.bottom,E.bottom),B=Math.min(this.left,E.left);return new YAHOO.util.Region(C,D,A,B);};YAHOO.util.Region.prototype.toString=function(){return("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+", height: "+this.height+", width: "+this.width+"}");};YAHOO.util.Region.getRegion=function(D){var F=YAHOO.util.Dom.getXY(D),C=F[1],E=F[0]+D.offsetWidth,A=F[1]+D.offsetHeight,B=F[0];return new YAHOO.util.Region(C,E,A,B);};YAHOO.util.Point=function(A,B){if(YAHOO.lang.isArray(A)){B=A[1];A=A[0];}YAHOO.util.Point.superclass.constructor.call(this,B,A,B,A);};YAHOO.extend(YAHOO.util.Point,YAHOO.util.Region);(function(){var B=YAHOO.util,A="clientTop",F="clientLeft",J="parentNode",K="right",W="hasLayout",I="px",U="opacity",L="auto",D="borderLeftWidth",G="borderTopWidth",P="borderRightWidth",V="borderBottomWidth",S="visible",Q="transparent",N="height",E="width",H="style",T="currentStyle",R=/^width|height$/,O=/^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,M={get:function(X,Z){var Y="",a=X[T][Z];if(Z===U){Y=B.Dom.getStyle(X,U);}else{if(!a||(a.indexOf&&a.indexOf(I)>-1)){Y=a;}else{if(B.Dom.IE_COMPUTED[Z]){Y=B.Dom.IE_COMPUTED[Z](X,Z);}else{if(O.test(a)){Y=B.Dom.IE.ComputedStyle.getPixel(X,Z);}else{Y=a;}}}}return Y;},getOffset:function(Z,e){var b=Z[T][e],X=e.charAt(0).toUpperCase()+e.substr(1),c="offset"+X,Y="pixel"+X,a="",d;if(b==L){d=Z[c];if(d===undefined){a=0;}a=d;if(R.test(e)){Z[H][e]=d;if(Z[c]>d){a=d-(Z[c]-d);}Z[H][e]=L;}}else{if(!Z[H][Y]&&!Z[H][e]){Z[H][e]=b;}a=Z[H][Y];}return a+I;},getBorderWidth:function(X,Z){var Y=null;if(!X[T][W]){X[H].zoom=1;}switch(Z){case G:Y=X[A];break;case V:Y=X.offsetHeight-X.clientHeight-X[A];break;case D:Y=X[F];break;case P:Y=X.offsetWidth-X.clientWidth-X[F];break;}return Y+I;},getPixel:function(Y,X){var a=null,b=Y[T][K],Z=Y[T][X];Y[H][K]=Z;a=Y[H].pixelRight;Y[H][K]=b;return a+I;},getMargin:function(Y,X){var Z;if(Y[T][X]==L){Z=0+I;}else{Z=B.Dom.IE.ComputedStyle.getPixel(Y,X);}return Z;},getVisibility:function(Y,X){var Z;while((Z=Y[T])&&Z[X]=="inherit"){Y=Y[J];}return(Z)?Z[X]:S;},getColor:function(Y,X){return B.Dom.Color.toRGB(Y[T][X])||Q;},getBorderColor:function(Y,X){var Z=Y[T],a=Z[X]||Z.color;return B.Dom.Color.toRGB(B.Dom.Color.toHex(a));}},C={};C.top=C.right=C.bottom=C.left=C[E]=C[N]=M.getOffset;C.color=M.getColor;C[G]=C[P]=C[V]=C[D]=M.getBorderWidth;C.marginTop=C.marginRight=C.marginBottom=C.marginLeft=M.getMargin;C.visibility=M.getVisibility;C.borderColor=C.borderTopColor=C.borderRightColor=C.borderBottomColor=C.borderLeftColor=M.getBorderColor;B.Dom.IE_COMPUTED=C;B.Dom.IE_ComputedStyle=M;})();(function(){var C="toString",A=parseInt,B=RegExp,D=YAHOO.util;D.Dom.Color={KEYWORDS:{black:"000",silver:"c0c0c0",gray:"808080",white:"fff",maroon:"800000",red:"f00",purple:"800080",fuchsia:"f0f",green:"008000",lime:"0f0",olive:"808000",yellow:"ff0",navy:"000080",blue:"00f",teal:"008080",aqua:"0ff"},re_RGB:/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,re_hex:/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,re_hex3:/([0-9A-F])/gi,toRGB:function(E){if(!D.Dom.Color.re_RGB.test(E)){E=D.Dom.Color.toHex(E);}if(D.Dom.Color.re_hex.exec(E)){E="rgb("+[A(B.$1,16),A(B.$2,16),A(B.$3,16)].join(", ")+")";}return E;},toHex:function(H){H=D.Dom.Color.KEYWORDS[H]||H;if(D.Dom.Color.re_RGB.exec(H)){var G=(B.$1.length===1)?"0"+B.$1:Number(B.$1),F=(B.$2.length===1)?"0"+B.$2:Number(B.$2),E=(B.$3.length===1)?"0"+B.$3:Number(B.$3);H=[G[C](16),F[C](16),E[C](16)].join("");}if(H.length<6){H=H.replace(D.Dom.Color.re_hex3,"$1$1");}if(H!=="transparent"&&H.indexOf("#")<0){H="#"+H;}return H.toLowerCase();}};}());YAHOO.register("dom",YAHOO.util.Dom,{version:"2.7.0",build:"1799"});YAHOO.util.CustomEvent=function(D,C,B,A){this.type=D;this.scope=C||window;this.silent=B;this.signature=A||YAHOO.util.CustomEvent.LIST;this.subscribers=[];if(!this.silent){}var E="_YUICEOnSubscribe";if(D!==E){this.subscribeEvent=new YAHOO.util.CustomEvent(E,this,true);}this.lastError=null;};YAHOO.util.CustomEvent.LIST=0;YAHOO.util.CustomEvent.FLAT=1;YAHOO.util.CustomEvent.prototype={subscribe:function(A,B,C){if(!A){throw new Error("Invalid callback for subscriber to '"+this.type+"'");}if(this.subscribeEvent){this.subscribeEvent.fire(A,B,C);}this.subscribers.push(new YAHOO.util.Subscriber(A,B,C));},unsubscribe:function(D,F){if(!D){return this.unsubscribeAll();}var E=false;for(var B=0,A=this.subscribers.length;B<A;++B){var C=this.subscribers[B];if(C&&C.contains(D,F)){this._delete(B);E=true;}}return E;},fire:function(){this.lastError=null;var K=[],E=this.subscribers.length;if(!E&&this.silent){return true;}var I=[].slice.call(arguments,0),G=true,D,J=false;if(!this.silent){}var C=this.subscribers.slice(),A=YAHOO.util.Event.throwErrors;for(D=0;D<E;++D){var M=C[D];if(!M){J=true;}else{if(!this.silent){}var L=M.getScope(this.scope);if(this.signature==YAHOO.util.CustomEvent.FLAT){var B=null;if(I.length>0){B=I[0];}try{G=M.fn.call(L,B,M.obj);}catch(F){this.lastError=F;if(A){throw F;}}}else{try{G=M.fn.call(L,this.type,I,M.obj);}catch(H){this.lastError=H;if(A){throw H;}}}if(false===G){if(!this.silent){}break;}}}return(G!==false);},unsubscribeAll:function(){var A=this.subscribers.length,B;for(B=A-1;B>-1;B--){this._delete(B);}this.subscribers=[];return A;},_delete:function(A){var B=this.subscribers[A];if(B){delete B.fn;delete B.obj;}this.subscribers.splice(A,1);},toString:function(){return"CustomEvent: "+"'"+this.type+"', "+"context: "+this.scope;}};YAHOO.util.Subscriber=function(A,B,C){this.fn=A;this.obj=YAHOO.lang.isUndefined(B)?null:B;this.overrideContext=C;};YAHOO.util.Subscriber.prototype.getScope=function(A){if(this.overrideContext){if(this.overrideContext===true){return this.obj;}else{return this.overrideContext;}}return A;};YAHOO.util.Subscriber.prototype.contains=function(A,B){if(B){return(this.fn==A&&this.obj==B);}else{return(this.fn==A);}};YAHOO.util.Subscriber.prototype.toString=function(){return"Subscriber { obj: "+this.obj+", overrideContext: "+(this.overrideContext||"no")+" }";};if(!YAHOO.util.Event){YAHOO.util.Event=function(){var H=false;var I=[];var J=[];var G=[];var E=[];var C=0;var F=[];var B=[];var A=0;var D={63232:38,63233:40,63234:37,63235:39,63276:33,63277:34,25:9};var K=YAHOO.env.ua.ie?"focusin":"focus";var L=YAHOO.env.ua.ie?"focusout":"blur";return{POLL_RETRYS:2000,POLL_INTERVAL:20,EL:0,TYPE:1,FN:2,WFN:3,UNLOAD_OBJ:3,ADJ_SCOPE:4,OBJ:5,OVERRIDE:6,lastError:null,isSafari:YAHOO.env.ua.webkit,webkit:YAHOO.env.ua.webkit,isIE:YAHOO.env.ua.ie,_interval:null,_dri:null,DOMReady:false,throwErrors:false,startInterval:function(){if(!this._interval){var M=this;var N=function(){M._tryPreloadAttach();};this._interval=setInterval(N,this.POLL_INTERVAL);}},onAvailable:function(S,O,Q,R,P){var M=(YAHOO.lang.isString(S))?[S]:S;for(var N=0;N<M.length;N=N+1){F.push({id:M[N],fn:O,obj:Q,overrideContext:R,checkReady:P});}C=this.POLL_RETRYS;this.startInterval();},onContentReady:function(P,M,N,O){this.onAvailable(P,M,N,O,true);},onDOMReady:function(M,N,O){if(this.DOMReady){setTimeout(function(){var P=window;if(O){if(O===true){P=N;}else{P=O;}}M.call(P,"DOMReady",[],N);},0);}else{this.DOMReadyEvent.subscribe(M,N,O);}},_addListener:function(O,M,Y,S,W,b){if(!Y||!Y.call){return false;}if(this._isValidCollection(O)){var Z=true;for(var T=0,V=O.length;T<V;++T){Z=this.on(O[T],M,Y,S,W)&&Z;}return Z;}else{if(YAHOO.lang.isString(O)){var R=this.getEl(O);if(R){O=R;}else{this.onAvailable(O,function(){YAHOO.util.Event.on(O,M,Y,S,W);});return true;}}}if(!O){return false;}if("unload"==M&&S!==this){J[J.length]=[O,M,Y,S,W];return true;}var N=O;if(W){if(W===true){N=S;}else{N=W;}}var P=function(c){return Y.call(N,YAHOO.util.Event.getEvent(c,O),S);};var a=[O,M,Y,P,N,S,W];var U=I.length;I[U]=a;if(this.useLegacyEvent(O,M)){var Q=this.getLegacyIndex(O,M);if(Q==-1||O!=G[Q][0]){Q=G.length;B[O.id+M]=Q;G[Q]=[O,M,O["on"+M]];E[Q]=[];O["on"+M]=function(c){YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(c),Q);};}E[Q].push(a);}else{try{this._simpleAdd(O,M,P,b);}catch(X){this.lastError=X;this.removeListener(O,M,Y);return false;}}return true;},addListener:function(N,Q,M,O,P){return this._addListener(N,Q,M,O,P,false);},addFocusListener:function(N,M,O,P){return this._addListener(N,K,M,O,P,true);},removeFocusListener:function(N,M){return this.removeListener(N,K,M);},addBlurListener:function(N,M,O,P){return this._addListener(N,L,M,O,P,true);},removeBlurListener:function(N,M){return this.removeListener(N,L,M);},fireLegacyEvent:function(R,P){var T=true,M,V,U,N,S;V=E[P].slice();for(var O=0,Q=V.length;O<Q;++O){U=V[O];if(U&&U[this.WFN]){N=U[this.ADJ_SCOPE];S=U[this.WFN].call(N,R);T=(T&&S);}}M=G[P];if(M&&M[2]){M[2](R);}return T;},getLegacyIndex:function(N,O){var M=this.generateId(N)+O;if(typeof B[M]=="undefined"){return -1;}else{return B[M];}},useLegacyEvent:function(M,N){return(this.webkit&&this.webkit<419&&("click"==N||"dblclick"==N));},removeListener:function(N,M,V){var Q,T,X;if(typeof N=="string"){N=this.getEl(N);}else{if(this._isValidCollection(N)){var W=true;for(Q=N.length-1;Q>-1;Q--){W=(this.removeListener(N[Q],M,V)&&W);}return W;}}if(!V||!V.call){return this.purgeElement(N,false,M);}if("unload"==M){for(Q=J.length-1;Q>-1;Q--){X=J[Q];if(X&&X[0]==N&&X[1]==M&&X[2]==V){J.splice(Q,1);return true;}}return false;}var R=null;var S=arguments[3];if("undefined"===typeof S){S=this._getCacheIndex(N,M,V);}if(S>=0){R=I[S];}if(!N||!R){return false;}if(this.useLegacyEvent(N,M)){var P=this.getLegacyIndex(N,M);var O=E[P];if(O){for(Q=0,T=O.length;Q<T;++Q){X=O[Q];if(X&&X[this.EL]==N&&X[this.TYPE]==M&&X[this.FN]==V){O.splice(Q,1);break;}}}}else{try{this._simpleRemove(N,M,R[this.WFN],false);}catch(U){this.lastError=U;return false;}}delete I[S][this.WFN];delete I[S][this.FN];
I.splice(S,1);return true;},getTarget:function(O,N){var M=O.target||O.srcElement;return this.resolveTextNode(M);},resolveTextNode:function(N){try{if(N&&3==N.nodeType){return N.parentNode;}}catch(M){}return N;},getPageX:function(N){var M=N.pageX;if(!M&&0!==M){M=N.clientX||0;if(this.isIE){M+=this._getScrollLeft();}}return M;},getPageY:function(M){var N=M.pageY;if(!N&&0!==N){N=M.clientY||0;if(this.isIE){N+=this._getScrollTop();}}return N;},getXY:function(M){return[this.getPageX(M),this.getPageY(M)];},getRelatedTarget:function(N){var M=N.relatedTarget;if(!M){if(N.type=="mouseout"){M=N.toElement;}else{if(N.type=="mouseover"){M=N.fromElement;}}}return this.resolveTextNode(M);},getTime:function(O){if(!O.time){var N=new Date().getTime();try{O.time=N;}catch(M){this.lastError=M;return N;}}return O.time;},stopEvent:function(M){this.stopPropagation(M);this.preventDefault(M);},stopPropagation:function(M){if(M.stopPropagation){M.stopPropagation();}else{M.cancelBubble=true;}},preventDefault:function(M){if(M.preventDefault){M.preventDefault();}else{M.returnValue=false;}},getEvent:function(O,M){var N=O||window.event;if(!N){var P=this.getEvent.caller;while(P){N=P.arguments[0];if(N&&Event==N.constructor){break;}P=P.caller;}}return N;},getCharCode:function(N){var M=N.keyCode||N.charCode||0;if(YAHOO.env.ua.webkit&&(M in D)){M=D[M];}return M;},_getCacheIndex:function(Q,R,P){for(var O=0,N=I.length;O<N;O=O+1){var M=I[O];if(M&&M[this.FN]==P&&M[this.EL]==Q&&M[this.TYPE]==R){return O;}}return -1;},generateId:function(M){var N=M.id;if(!N){N="yuievtautoid-"+A;++A;M.id=N;}return N;},_isValidCollection:function(N){try{return(N&&typeof N!=="string"&&N.length&&!N.tagName&&!N.alert&&typeof N[0]!=="undefined");}catch(M){return false;}},elCache:{},getEl:function(M){return(typeof M==="string")?document.getElementById(M):M;},clearCache:function(){},DOMReadyEvent:new YAHOO.util.CustomEvent("DOMReady",this),_load:function(N){if(!H){H=true;var M=YAHOO.util.Event;M._ready();M._tryPreloadAttach();}},_ready:function(N){var M=YAHOO.util.Event;if(!M.DOMReady){M.DOMReady=true;M.DOMReadyEvent.fire();M._simpleRemove(document,"DOMContentLoaded",M._ready);}},_tryPreloadAttach:function(){if(F.length===0){C=0;if(this._interval){clearInterval(this._interval);this._interval=null;}return;}if(this.locked){return;}if(this.isIE){if(!this.DOMReady){this.startInterval();return;}}this.locked=true;var S=!H;if(!S){S=(C>0&&F.length>0);}var R=[];var T=function(V,W){var U=V;if(W.overrideContext){if(W.overrideContext===true){U=W.obj;}else{U=W.overrideContext;}}W.fn.call(U,W.obj);};var N,M,Q,P,O=[];for(N=0,M=F.length;N<M;N=N+1){Q=F[N];if(Q){P=this.getEl(Q.id);if(P){if(Q.checkReady){if(H||P.nextSibling||!S){O.push(Q);F[N]=null;}}else{T(P,Q);F[N]=null;}}else{R.push(Q);}}}for(N=0,M=O.length;N<M;N=N+1){Q=O[N];T(this.getEl(Q.id),Q);}C--;if(S){for(N=F.length-1;N>-1;N--){Q=F[N];if(!Q||!Q.id){F.splice(N,1);}}this.startInterval();}else{if(this._interval){clearInterval(this._interval);this._interval=null;}}this.locked=false;},purgeElement:function(Q,R,T){var O=(YAHOO.lang.isString(Q))?this.getEl(Q):Q;var S=this.getListeners(O,T),P,M;if(S){for(P=S.length-1;P>-1;P--){var N=S[P];this.removeListener(O,N.type,N.fn);}}if(R&&O&&O.childNodes){for(P=0,M=O.childNodes.length;P<M;++P){this.purgeElement(O.childNodes[P],R,T);}}},getListeners:function(O,M){var R=[],N;if(!M){N=[I,J];}else{if(M==="unload"){N=[J];}else{N=[I];}}var T=(YAHOO.lang.isString(O))?this.getEl(O):O;for(var Q=0;Q<N.length;Q=Q+1){var V=N[Q];if(V){for(var S=0,U=V.length;S<U;++S){var P=V[S];if(P&&P[this.EL]===T&&(!M||M===P[this.TYPE])){R.push({type:P[this.TYPE],fn:P[this.FN],obj:P[this.OBJ],adjust:P[this.OVERRIDE],scope:P[this.ADJ_SCOPE],index:S});}}}}return(R.length)?R:null;},_unload:function(T){var N=YAHOO.util.Event,Q,P,O,S,R,U=J.slice(),M;for(Q=0,S=J.length;Q<S;++Q){O=U[Q];if(O){M=window;if(O[N.ADJ_SCOPE]){if(O[N.ADJ_SCOPE]===true){M=O[N.UNLOAD_OBJ];}else{M=O[N.ADJ_SCOPE];}}O[N.FN].call(M,N.getEvent(T,O[N.EL]),O[N.UNLOAD_OBJ]);U[Q]=null;}}O=null;M=null;J=null;if(I){for(P=I.length-1;P>-1;P--){O=I[P];if(O){N.removeListener(O[N.EL],O[N.TYPE],O[N.FN],P);}}O=null;}G=null;N._simpleRemove(window,"unload",N._unload);},_getScrollLeft:function(){return this._getScroll()[1];},_getScrollTop:function(){return this._getScroll()[0];},_getScroll:function(){var M=document.documentElement,N=document.body;if(M&&(M.scrollTop||M.scrollLeft)){return[M.scrollTop,M.scrollLeft];}else{if(N){return[N.scrollTop,N.scrollLeft];}else{return[0,0];}}},regCE:function(){},_simpleAdd:function(){if(window.addEventListener){return function(O,P,N,M){O.addEventListener(P,N,(M));};}else{if(window.attachEvent){return function(O,P,N,M){O.attachEvent("on"+P,N);};}else{return function(){};}}}(),_simpleRemove:function(){if(window.removeEventListener){return function(O,P,N,M){O.removeEventListener(P,N,(M));};}else{if(window.detachEvent){return function(N,O,M){N.detachEvent("on"+O,M);};}else{return function(){};}}}()};}();(function(){var EU=YAHOO.util.Event;EU.on=EU.addListener;EU.onFocus=EU.addFocusListener;EU.onBlur=EU.addBlurListener;
/* DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller */
if(EU.isIE){YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach,YAHOO.util.Event,true);var n=document.createElement("p");EU._dri=setInterval(function(){try{n.doScroll("left");clearInterval(EU._dri);EU._dri=null;EU._ready();n=null;}catch(ex){}},EU.POLL_INTERVAL);}else{if(EU.webkit&&EU.webkit<525){EU._dri=setInterval(function(){var rs=document.readyState;if("loaded"==rs||"complete"==rs){clearInterval(EU._dri);EU._dri=null;EU._ready();}},EU.POLL_INTERVAL);}else{EU._simpleAdd(document,"DOMContentLoaded",EU._ready);}}EU._simpleAdd(window,"load",EU._load);EU._simpleAdd(window,"unload",EU._unload);EU._tryPreloadAttach();})();}YAHOO.util.EventProvider=function(){};YAHOO.util.EventProvider.prototype={__yui_events:null,__yui_subscribers:null,subscribe:function(A,C,F,E){this.__yui_events=this.__yui_events||{};var D=this.__yui_events[A];if(D){D.subscribe(C,F,E);
}else{this.__yui_subscribers=this.__yui_subscribers||{};var B=this.__yui_subscribers;if(!B[A]){B[A]=[];}B[A].push({fn:C,obj:F,overrideContext:E});}},unsubscribe:function(C,E,G){this.__yui_events=this.__yui_events||{};var A=this.__yui_events;if(C){var F=A[C];if(F){return F.unsubscribe(E,G);}}else{var B=true;for(var D in A){if(YAHOO.lang.hasOwnProperty(A,D)){B=B&&A[D].unsubscribe(E,G);}}return B;}return false;},unsubscribeAll:function(A){return this.unsubscribe(A);},createEvent:function(G,D){this.__yui_events=this.__yui_events||{};var A=D||{};var I=this.__yui_events;if(I[G]){}else{var H=A.scope||this;var E=(A.silent);var B=new YAHOO.util.CustomEvent(G,H,E,YAHOO.util.CustomEvent.FLAT);I[G]=B;if(A.onSubscribeCallback){B.subscribeEvent.subscribe(A.onSubscribeCallback);}this.__yui_subscribers=this.__yui_subscribers||{};var F=this.__yui_subscribers[G];if(F){for(var C=0;C<F.length;++C){B.subscribe(F[C].fn,F[C].obj,F[C].overrideContext);}}}return I[G];},fireEvent:function(E,D,A,C){this.__yui_events=this.__yui_events||{};var G=this.__yui_events[E];if(!G){return null;}var B=[];for(var F=1;F<arguments.length;++F){B.push(arguments[F]);}return G.fire.apply(G,B);},hasEvent:function(A){if(this.__yui_events){if(this.__yui_events[A]){return true;}}return false;}};(function(){var A=YAHOO.util.Event,C=YAHOO.lang;YAHOO.util.KeyListener=function(D,I,E,F){if(!D){}else{if(!I){}else{if(!E){}}}if(!F){F=YAHOO.util.KeyListener.KEYDOWN;}var G=new YAHOO.util.CustomEvent("keyPressed");this.enabledEvent=new YAHOO.util.CustomEvent("enabled");this.disabledEvent=new YAHOO.util.CustomEvent("disabled");if(C.isString(D)){D=document.getElementById(D);}if(C.isFunction(E)){G.subscribe(E);}else{G.subscribe(E.fn,E.scope,E.correctScope);}function H(O,N){if(!I.shift){I.shift=false;}if(!I.alt){I.alt=false;}if(!I.ctrl){I.ctrl=false;}if(O.shiftKey==I.shift&&O.altKey==I.alt&&O.ctrlKey==I.ctrl){var J,M=I.keys,L;if(YAHOO.lang.isArray(M)){for(var K=0;K<M.length;K++){J=M[K];L=A.getCharCode(O);if(J==L){G.fire(L,O);break;}}}else{L=A.getCharCode(O);if(M==L){G.fire(L,O);}}}}this.enable=function(){if(!this.enabled){A.on(D,F,H);this.enabledEvent.fire(I);}this.enabled=true;};this.disable=function(){if(this.enabled){A.removeListener(D,F,H);this.disabledEvent.fire(I);}this.enabled=false;};this.toString=function(){return"KeyListener ["+I.keys+"] "+D.tagName+(D.id?"["+D.id+"]":"");};};var B=YAHOO.util.KeyListener;B.KEYDOWN="keydown";B.KEYUP="keyup";B.KEY={ALT:18,BACK_SPACE:8,CAPS_LOCK:20,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,META:224,NUM_LOCK:144,PAGE_DOWN:34,PAGE_UP:33,PAUSE:19,PRINTSCREEN:44,RIGHT:39,SCROLL_LOCK:145,SHIFT:16,SPACE:32,TAB:9,UP:38};})();YAHOO.register("event",YAHOO.util.Event,{version:"2.7.0",build:"1799"});YAHOO.util.Connect={_msxml_progid:["Microsoft.XMLHTTP","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP"],_http_headers:{},_has_http_headers:false,_use_default_post_header:true,_default_post_header:"application/x-www-form-urlencoded; charset=UTF-8",_default_form_header:"application/x-www-form-urlencoded",_use_default_xhr_header:true,_default_xhr_header:"XMLHttpRequest",_has_default_headers:true,_default_headers:{},_isFormSubmit:false,_isFileUpload:false,_formNode:null,_sFormData:null,_poll:{},_timeOut:{},_polling_interval:50,_transaction_id:0,_submitElementValue:null,_hasSubmitListener:(function(){if(YAHOO.util.Event){YAHOO.util.Event.addListener(document,"click",function(C){var B=YAHOO.util.Event.getTarget(C),A=B.nodeName.toLowerCase();if((A==="input"||A==="button")&&(B.type&&B.type.toLowerCase()=="submit")){YAHOO.util.Connect._submitElementValue=encodeURIComponent(B.name)+"="+encodeURIComponent(B.value);}});return true;}return false;})(),startEvent:new YAHOO.util.CustomEvent("start"),completeEvent:new YAHOO.util.CustomEvent("complete"),successEvent:new YAHOO.util.CustomEvent("success"),failureEvent:new YAHOO.util.CustomEvent("failure"),uploadEvent:new YAHOO.util.CustomEvent("upload"),abortEvent:new YAHOO.util.CustomEvent("abort"),_customEvents:{onStart:["startEvent","start"],onComplete:["completeEvent","complete"],onSuccess:["successEvent","success"],onFailure:["failureEvent","failure"],onUpload:["uploadEvent","upload"],onAbort:["abortEvent","abort"]},setProgId:function(A){this._msxml_progid.unshift(A);},setDefaultPostHeader:function(A){if(typeof A=="string"){this._default_post_header=A;}else{if(typeof A=="boolean"){this._use_default_post_header=A;}}},setDefaultXhrHeader:function(A){if(typeof A=="string"){this._default_xhr_header=A;}else{this._use_default_xhr_header=A;}},setPollingInterval:function(A){if(typeof A=="number"&&isFinite(A)){this._polling_interval=A;}},createXhrObject:function(F){var E,A;try{A=new XMLHttpRequest();E={conn:A,tId:F};}catch(D){for(var B=0;B<this._msxml_progid.length;++B){try{A=new ActiveXObject(this._msxml_progid[B]);E={conn:A,tId:F};break;}catch(C){}}}finally{return E;}},getConnectionObject:function(A){var C;var D=this._transaction_id;try{if(!A){C=this.createXhrObject(D);}else{C={};C.tId=D;C.isUpload=true;}if(C){this._transaction_id++;}}catch(B){}finally{return C;}},asyncRequest:function(F,C,E,A){var D=(this._isFileUpload)?this.getConnectionObject(true):this.getConnectionObject();var B=(E&&E.argument)?E.argument:null;if(!D){return null;}else{if(E&&E.customevents){this.initCustomEvents(D,E);}if(this._isFormSubmit){if(this._isFileUpload){this.uploadFile(D,E,C,A);return D;}if(F.toUpperCase()=="GET"){if(this._sFormData.length!==0){C+=((C.indexOf("?")==-1)?"?":"&")+this._sFormData;}}else{if(F.toUpperCase()=="POST"){A=A?this._sFormData+"&"+A:this._sFormData;}}}if(F.toUpperCase()=="GET"&&(E&&E.cache===false)){C+=((C.indexOf("?")==-1)?"?":"&")+"rnd="+new Date().valueOf().toString();}D.conn.open(F,C,true);if(this._use_default_xhr_header){if(!this._default_headers["X-Requested-With"]){this.initHeader("X-Requested-With",this._default_xhr_header,true);}}if((F.toUpperCase()==="POST"&&this._use_default_post_header)&&this._isFormSubmit===false){this.initHeader("Content-Type",this._default_post_header);}if(this._has_default_headers||this._has_http_headers){this.setHeader(D);}this.handleReadyState(D,E);D.conn.send(A||"");if(this._isFormSubmit===true){this.resetFormState();}this.startEvent.fire(D,B);if(D.startEvent){D.startEvent.fire(D,B);}return D;}},initCustomEvents:function(A,C){var B;for(B in C.customevents){if(this._customEvents[B][0]){A[this._customEvents[B][0]]=new YAHOO.util.CustomEvent(this._customEvents[B][1],(C.scope)?C.scope:null);A[this._customEvents[B][0]].subscribe(C.customevents[B]);}}},handleReadyState:function(C,D){var B=this;var A=(D&&D.argument)?D.argument:null;if(D&&D.timeout){this._timeOut[C.tId]=window.setTimeout(function(){B.abort(C,D,true);},D.timeout);}this._poll[C.tId]=window.setInterval(function(){if(C.conn&&C.conn.readyState===4){window.clearInterval(B._poll[C.tId]);delete B._poll[C.tId];if(D&&D.timeout){window.clearTimeout(B._timeOut[C.tId]);delete B._timeOut[C.tId];}B.completeEvent.fire(C,A);if(C.completeEvent){C.completeEvent.fire(C,A);}B.handleTransactionResponse(C,D);}},this._polling_interval);},handleTransactionResponse:function(F,G,A){var D,C;var B=(G&&G.argument)?G.argument:null;try{if(F.conn.status!==undefined&&F.conn.status!==0){D=F.conn.status;}else{D=13030;}}catch(E){D=13030;}if(D>=200&&D<300||D===1223){C=this.createResponseObject(F,B);if(G&&G.success){if(!G.scope){G.success(C);}else{G.success.apply(G.scope,[C]);}}this.successEvent.fire(C);if(F.successEvent){F.successEvent.fire(C);}}else{switch(D){case 12002:case 12029:case 12030:case 12031:case 12152:case 13030:C=this.createExceptionObject(F.tId,B,(A?A:false));if(G&&G.failure){if(!G.scope){G.failure(C);}else{G.failure.apply(G.scope,[C]);}}break;default:C=this.createResponseObject(F,B);if(G&&G.failure){if(!G.scope){G.failure(C);}else{G.failure.apply(G.scope,[C]);}}}this.failureEvent.fire(C);if(F.failureEvent){F.failureEvent.fire(C);}}this.releaseObject(F);C=null;},createResponseObject:function(A,G){var D={};var I={};try{var C=A.conn.getAllResponseHeaders();var F=C.split("\n");for(var E=0;E<F.length;E++){var B=F[E].indexOf(":");if(B!=-1){I[F[E].substring(0,B)]=F[E].substring(B+2);}}}catch(H){}D.tId=A.tId;D.status=(A.conn.status==1223)?204:A.conn.status;D.statusText=(A.conn.status==1223)?"No Content":A.conn.statusText;D.getResponseHeader=I;D.getAllResponseHeaders=C;D.responseText=A.conn.responseText;D.responseXML=A.conn.responseXML;if(G){D.argument=G;}return D;},createExceptionObject:function(H,D,A){var F=0;var G="communication failure";var C=-1;var B="transaction aborted";var E={};E.tId=H;if(A){E.status=C;E.statusText=B;}else{E.status=F;E.statusText=G;}if(D){E.argument=D;}return E;},initHeader:function(A,D,C){var B=(C)?this._default_headers:this._http_headers;B[A]=D;if(C){this._has_default_headers=true;
}else{this._has_http_headers=true;}},setHeader:function(A){var B;if(this._has_default_headers){for(B in this._default_headers){if(YAHOO.lang.hasOwnProperty(this._default_headers,B)){A.conn.setRequestHeader(B,this._default_headers[B]);}}}if(this._has_http_headers){for(B in this._http_headers){if(YAHOO.lang.hasOwnProperty(this._http_headers,B)){A.conn.setRequestHeader(B,this._http_headers[B]);}}delete this._http_headers;this._http_headers={};this._has_http_headers=false;}},resetDefaultHeaders:function(){delete this._default_headers;this._default_headers={};this._has_default_headers=false;},setForm:function(M,H,C){var L,B,K,I,P,J=false,F=[],O=0,E,G,D,N,A;this.resetFormState();if(typeof M=="string"){L=(document.getElementById(M)||document.forms[M]);}else{if(typeof M=="object"){L=M;}else{return;}}if(H){this.createFrame(C?C:null);this._isFormSubmit=true;this._isFileUpload=true;this._formNode=L;return;}for(E=0,G=L.elements.length;E<G;++E){B=L.elements[E];P=B.disabled;K=B.name;if(!P&&K){K=encodeURIComponent(K)+"=";I=encodeURIComponent(B.value);switch(B.type){case"select-one":if(B.selectedIndex>-1){A=B.options[B.selectedIndex];F[O++]=K+encodeURIComponent((A.attributes.value&&A.attributes.value.specified)?A.value:A.text);}break;case"select-multiple":if(B.selectedIndex>-1){for(D=B.selectedIndex,N=B.options.length;D<N;++D){A=B.options[D];if(A.selected){F[O++]=K+encodeURIComponent((A.attributes.value&&A.attributes.value.specified)?A.value:A.text);}}}break;case"radio":case"checkbox":if(B.checked){F[O++]=K+I;}break;case"file":case undefined:case"reset":case"button":break;case"submit":if(J===false){if(this._hasSubmitListener&&this._submitElementValue){F[O++]=this._submitElementValue;}J=true;}break;default:F[O++]=K+I;}}}this._isFormSubmit=true;this._sFormData=F.join("&");this.initHeader("Content-Type",this._default_form_header);return this._sFormData;},resetFormState:function(){this._isFormSubmit=false;this._isFileUpload=false;this._formNode=null;this._sFormData="";},createFrame:function(A){var B="yuiIO"+this._transaction_id;var C;if(YAHOO.env.ua.ie){C=document.createElement('<iframe id="'+B+'" name="'+B+'" />');if(typeof A=="boolean"){C.src="javascript:false";}}else{C=document.createElement("iframe");C.id=B;C.name=B;}C.style.position="absolute";C.style.top="-1000px";C.style.left="-1000px";document.body.appendChild(C);},appendPostData:function(A){var D=[],B=A.split("&"),C,E;for(C=0;C<B.length;C++){E=B[C].indexOf("=");if(E!=-1){D[C]=document.createElement("input");D[C].type="hidden";D[C].name=decodeURIComponent(B[C].substring(0,E));D[C].value=decodeURIComponent(B[C].substring(E+1));this._formNode.appendChild(D[C]);}}return D;},uploadFile:function(D,N,E,C){var I="yuiIO"+D.tId,J="multipart/form-data",L=document.getElementById(I),O=this,K=(N&&N.argument)?N.argument:null,M,H,B,G;var A={action:this._formNode.getAttribute("action"),method:this._formNode.getAttribute("method"),target:this._formNode.getAttribute("target")};this._formNode.setAttribute("action",E);this._formNode.setAttribute("method","POST");this._formNode.setAttribute("target",I);if(YAHOO.env.ua.ie){this._formNode.setAttribute("encoding",J);}else{this._formNode.setAttribute("enctype",J);}if(C){M=this.appendPostData(C);}this._formNode.submit();this.startEvent.fire(D,K);if(D.startEvent){D.startEvent.fire(D,K);}if(N&&N.timeout){this._timeOut[D.tId]=window.setTimeout(function(){O.abort(D,N,true);},N.timeout);}if(M&&M.length>0){for(H=0;H<M.length;H++){this._formNode.removeChild(M[H]);}}for(B in A){if(YAHOO.lang.hasOwnProperty(A,B)){if(A[B]){this._formNode.setAttribute(B,A[B]);}else{this._formNode.removeAttribute(B);}}}this.resetFormState();var F=function(){if(N&&N.timeout){window.clearTimeout(O._timeOut[D.tId]);delete O._timeOut[D.tId];}O.completeEvent.fire(D,K);if(D.completeEvent){D.completeEvent.fire(D,K);}G={tId:D.tId,argument:N.argument};try{G.responseText=L.contentWindow.document.body?L.contentWindow.document.body.innerHTML:L.contentWindow.document.documentElement.textContent;G.responseXML=L.contentWindow.document.XMLDocument?L.contentWindow.document.XMLDocument:L.contentWindow.document;}catch(P){}if(N&&N.upload){if(!N.scope){N.upload(G);}else{N.upload.apply(N.scope,[G]);}}O.uploadEvent.fire(G);if(D.uploadEvent){D.uploadEvent.fire(G);}YAHOO.util.Event.removeListener(L,"load",F);setTimeout(function(){document.body.removeChild(L);O.releaseObject(D);},100);};YAHOO.util.Event.addListener(L,"load",F);},abort:function(E,G,A){var D;var B=(G&&G.argument)?G.argument:null;if(E&&E.conn){if(this.isCallInProgress(E)){E.conn.abort();window.clearInterval(this._poll[E.tId]);delete this._poll[E.tId];if(A){window.clearTimeout(this._timeOut[E.tId]);delete this._timeOut[E.tId];}D=true;}}else{if(E&&E.isUpload===true){var C="yuiIO"+E.tId;var F=document.getElementById(C);if(F){YAHOO.util.Event.removeListener(F,"load");document.body.removeChild(F);if(A){window.clearTimeout(this._timeOut[E.tId]);delete this._timeOut[E.tId];}D=true;}}else{D=false;}}if(D===true){this.abortEvent.fire(E,B);if(E.abortEvent){E.abortEvent.fire(E,B);}this.handleTransactionResponse(E,G,true);}return D;},isCallInProgress:function(B){if(B&&B.conn){return B.conn.readyState!==4&&B.conn.readyState!==0;}else{if(B&&B.isUpload===true){var A="yuiIO"+B.tId;return document.getElementById(A)?true:false;}else{return false;}}},releaseObject:function(A){if(A&&A.conn){A.conn=null;A=null;}}};YAHOO.register("connection",YAHOO.util.Connect,{version:"2.7.0",build:"1799"});(function(){var B=YAHOO.util;var A=function(D,C,E,F){if(!D){}this.init(D,C,E,F);};A.NAME="Anim";A.prototype={toString:function(){var C=this.getEl()||{};var D=C.id||C.tagName;return(this.constructor.NAME+": "+D);},patterns:{noNegatives:/width|height|opacity|padding/i,offsetAttribute:/^((width|height)|(top|left))$/,defaultUnit:/width|height|top$|bottom$|left$|right$/i,offsetUnit:/\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i},doMethod:function(C,E,D){return this.method(this.currentFrame,E,D-E,this.totalFrames);},setAttribute:function(C,F,E){var D=this.getEl();if(this.patterns.noNegatives.test(C)){F=(F>0)?F:0;}if("style" in D){B.Dom.setStyle(D,C,F+E);}else{if(C in D){D[C]=F;}}},getAttribute:function(C){var E=this.getEl();var G=B.Dom.getStyle(E,C);if(G!=="auto"&&!this.patterns.offsetUnit.test(G)){return parseFloat(G);}var D=this.patterns.offsetAttribute.exec(C)||[];var H=!!(D[3]);var F=!!(D[2]);if("style" in E){if(F||(B.Dom.getStyle(E,"position")=="absolute"&&H)){G=E["offset"+D[0].charAt(0).toUpperCase()+D[0].substr(1)];}else{G=0;}}else{if(C in E){G=E[C];}}return G;},getDefaultUnit:function(C){if(this.patterns.defaultUnit.test(C)){return"px";}return"";},setRuntimeAttribute:function(D){var I;var E;var F=this.attributes;this.runtimeAttributes[D]={};var H=function(J){return(typeof J!=="undefined");};if(!H(F[D]["to"])&&!H(F[D]["by"])){return false;}I=(H(F[D]["from"]))?F[D]["from"]:this.getAttribute(D);if(H(F[D]["to"])){E=F[D]["to"];}else{if(H(F[D]["by"])){if(I.constructor==Array){E=[];for(var G=0,C=I.length;G<C;++G){E[G]=I[G]+F[D]["by"][G]*1;}}else{E=I+F[D]["by"]*1;}}}this.runtimeAttributes[D].start=I;this.runtimeAttributes[D].end=E;this.runtimeAttributes[D].unit=(H(F[D].unit))?F[D]["unit"]:this.getDefaultUnit(D);return true;},init:function(E,J,I,C){var D=false;var F=null;var H=0;E=B.Dom.get(E);this.attributes=J||{};this.duration=!YAHOO.lang.isUndefined(I)?I:1;this.method=C||B.Easing.easeNone;this.useSeconds=true;this.currentFrame=0;this.totalFrames=B.AnimMgr.fps;this.setEl=function(M){E=B.Dom.get(M);};this.getEl=function(){return E;};this.isAnimated=function(){return D;};this.getStartTime=function(){return F;};this.runtimeAttributes={};this.animate=function(){if(this.isAnimated()){return false;}this.currentFrame=0;this.totalFrames=(this.useSeconds)?Math.ceil(B.AnimMgr.fps*this.duration):this.duration;if(this.duration===0&&this.useSeconds){this.totalFrames=1;}B.AnimMgr.registerElement(this);return true;};this.stop=function(M){if(!this.isAnimated()){return false;}if(M){this.currentFrame=this.totalFrames;this._onTween.fire();}B.AnimMgr.stop(this);};var L=function(){this.onStart.fire();this.runtimeAttributes={};for(var M in this.attributes){this.setRuntimeAttribute(M);}D=true;H=0;F=new Date();};var K=function(){var O={duration:new Date()-this.getStartTime(),currentFrame:this.currentFrame};O.toString=function(){return("duration: "+O.duration+", currentFrame: "+O.currentFrame);};this.onTween.fire(O);var N=this.runtimeAttributes;for(var M in N){this.setAttribute(M,this.doMethod(M,N[M].start,N[M].end),N[M].unit);}H+=1;};var G=function(){var M=(new Date()-F)/1000;var N={duration:M,frames:H,fps:H/M};N.toString=function(){return("duration: "+N.duration+", frames: "+N.frames+", fps: "+N.fps);};D=false;H=0;this.onComplete.fire(N);};this._onStart=new B.CustomEvent("_start",this,true);this.onStart=new B.CustomEvent("start",this);this.onTween=new B.CustomEvent("tween",this);this._onTween=new B.CustomEvent("_tween",this,true);this.onComplete=new B.CustomEvent("complete",this);this._onComplete=new B.CustomEvent("_complete",this,true);this._onStart.subscribe(L);this._onTween.subscribe(K);this._onComplete.subscribe(G);}};B.Anim=A;})();YAHOO.util.AnimMgr=new function(){var C=null;var B=[];var A=0;this.fps=1000;this.delay=1;this.registerElement=function(F){B[B.length]=F;A+=1;F._onStart.fire();this.start();};this.unRegister=function(G,F){F=F||E(G);if(!G.isAnimated()||F==-1){return false;}G._onComplete.fire();B.splice(F,1);A-=1;if(A<=0){this.stop();}return true;};this.start=function(){if(C===null){C=setInterval(this.run,this.delay);}};this.stop=function(H){if(!H){clearInterval(C);for(var G=0,F=B.length;G<F;++G){this.unRegister(B[0],0);}B=[];C=null;A=0;}else{this.unRegister(H);}};this.run=function(){for(var H=0,F=B.length;H<F;++H){var G=B[H];if(!G||!G.isAnimated()){continue;}if(G.currentFrame<G.totalFrames||G.totalFrames===null){G.currentFrame+=1;if(G.useSeconds){D(G);}G._onTween.fire();}else{YAHOO.util.AnimMgr.stop(G,H);}}};var E=function(H){for(var G=0,F=B.length;G<F;++G){if(B[G]==H){return G;}}return -1;};var D=function(G){var J=G.totalFrames;var I=G.currentFrame;var H=(G.currentFrame*G.duration*1000/G.totalFrames);var F=(new Date()-G.getStartTime());var K=0;if(F<G.duration*1000){K=Math.round((F/H-1)*G.currentFrame);}else{K=J-(I+1);}if(K>0&&isFinite(K)){if(G.currentFrame+K>=J){K=J-(I+1);}G.currentFrame+=K;}};};YAHOO.util.Bezier=new function(){this.getPosition=function(E,D){var F=E.length;var C=[];for(var B=0;B<F;++B){C[B]=[E[B][0],E[B][1]];}for(var A=1;A<F;++A){for(B=0;B<F-A;++B){C[B][0]=(1-D)*C[B][0]+D*C[parseInt(B+1,10)][0];C[B][1]=(1-D)*C[B][1]+D*C[parseInt(B+1,10)][1];}}return[C[0][0],C[0][1]];};};(function(){var A=function(F,E,G,H){A.superclass.constructor.call(this,F,E,G,H);};A.NAME="ColorAnim";A.DEFAULT_BGCOLOR="#fff";var C=YAHOO.util;YAHOO.extend(A,C.Anim);var D=A.superclass;var B=A.prototype;B.patterns.color=/color$/i;B.patterns.rgb=/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;B.patterns.hex=/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;B.patterns.hex3=/^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;B.patterns.transparent=/^transparent|rgba\(0, 0, 0, 0\)$/;B.parseColor=function(E){if(E.length==3){return E;}var F=this.patterns.hex.exec(E);if(F&&F.length==4){return[parseInt(F[1],16),parseInt(F[2],16),parseInt(F[3],16)];}F=this.patterns.rgb.exec(E);if(F&&F.length==4){return[parseInt(F[1],10),parseInt(F[2],10),parseInt(F[3],10)];}F=this.patterns.hex3.exec(E);if(F&&F.length==4){return[parseInt(F[1]+F[1],16),parseInt(F[2]+F[2],16),parseInt(F[3]+F[3],16)];
}return null;};B.getAttribute=function(E){var G=this.getEl();if(this.patterns.color.test(E)){var I=YAHOO.util.Dom.getStyle(G,E);var H=this;if(this.patterns.transparent.test(I)){var F=YAHOO.util.Dom.getAncestorBy(G,function(J){return !H.patterns.transparent.test(I);});if(F){I=C.Dom.getStyle(F,E);}else{I=A.DEFAULT_BGCOLOR;}}}else{I=D.getAttribute.call(this,E);}return I;};B.doMethod=function(F,J,G){var I;if(this.patterns.color.test(F)){I=[];for(var H=0,E=J.length;H<E;++H){I[H]=D.doMethod.call(this,F,J[H],G[H]);}I="rgb("+Math.floor(I[0])+","+Math.floor(I[1])+","+Math.floor(I[2])+")";}else{I=D.doMethod.call(this,F,J,G);}return I;};B.setRuntimeAttribute=function(F){D.setRuntimeAttribute.call(this,F);if(this.patterns.color.test(F)){var H=this.attributes;var J=this.parseColor(this.runtimeAttributes[F].start);var G=this.parseColor(this.runtimeAttributes[F].end);if(typeof H[F]["to"]==="undefined"&&typeof H[F]["by"]!=="undefined"){G=this.parseColor(H[F].by);for(var I=0,E=J.length;I<E;++I){G[I]=J[I]+G[I];}}this.runtimeAttributes[F].start=J;this.runtimeAttributes[F].end=G;}};C.ColorAnim=A;})();
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
YAHOO.util.Easing={easeNone:function(B,A,D,C){return D*B/C+A;},easeIn:function(B,A,D,C){return D*(B/=C)*B+A;},easeOut:function(B,A,D,C){return -D*(B/=C)*(B-2)+A;},easeBoth:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B+A;}return -D/2*((--B)*(B-2)-1)+A;},easeInStrong:function(B,A,D,C){return D*(B/=C)*B*B*B+A;},easeOutStrong:function(B,A,D,C){return -D*((B=B/C-1)*B*B*B-1)+A;},easeBothStrong:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B*B*B+A;}return -D/2*((B-=2)*B*B*B-2)+A;},elasticIn:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F)==1){return A+G;}if(!E){E=F*0.3;}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}return -(B*Math.pow(2,10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E))+A;},elasticOut:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F)==1){return A+G;}if(!E){E=F*0.3;}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}return B*Math.pow(2,-10*C)*Math.sin((C*F-D)*(2*Math.PI)/E)+G+A;},elasticBoth:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F/2)==2){return A+G;}if(!E){E=F*(0.3*1.5);}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}if(C<1){return -0.5*(B*Math.pow(2,10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E))+A;}return B*Math.pow(2,-10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E)*0.5+G+A;},backIn:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}return E*(B/=D)*B*((C+1)*B-C)+A;},backOut:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}return E*((B=B/D-1)*B*((C+1)*B+C)+1)+A;},backBoth:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}if((B/=D/2)<1){return E/2*(B*B*(((C*=(1.525))+1)*B-C))+A;}return E/2*((B-=2)*B*(((C*=(1.525))+1)*B+C)+2)+A;},bounceIn:function(B,A,D,C){return D-YAHOO.util.Easing.bounceOut(C-B,0,D,C)+A;},bounceOut:function(B,A,D,C){if((B/=C)<(1/2.75)){return D*(7.5625*B*B)+A;}else{if(B<(2/2.75)){return D*(7.5625*(B-=(1.5/2.75))*B+0.75)+A;}else{if(B<(2.5/2.75)){return D*(7.5625*(B-=(2.25/2.75))*B+0.9375)+A;}}}return D*(7.5625*(B-=(2.625/2.75))*B+0.984375)+A;},bounceBoth:function(B,A,D,C){if(B<C/2){return YAHOO.util.Easing.bounceIn(B*2,0,D,C)*0.5+A;}return YAHOO.util.Easing.bounceOut(B*2-C,0,D,C)*0.5+D*0.5+A;}};(function(){var A=function(H,G,I,J){if(H){A.superclass.constructor.call(this,H,G,I,J);}};A.NAME="Motion";var E=YAHOO.util;YAHOO.extend(A,E.ColorAnim);var F=A.superclass;var C=A.prototype;C.patterns.points=/^points$/i;C.setAttribute=function(G,I,H){if(this.patterns.points.test(G)){H=H||"px";F.setAttribute.call(this,"left",I[0],H);F.setAttribute.call(this,"top",I[1],H);}else{F.setAttribute.call(this,G,I,H);}};C.getAttribute=function(G){if(this.patterns.points.test(G)){var H=[F.getAttribute.call(this,"left"),F.getAttribute.call(this,"top")];}else{H=F.getAttribute.call(this,G);}return H;};C.doMethod=function(G,K,H){var J=null;if(this.patterns.points.test(G)){var I=this.method(this.currentFrame,0,100,this.totalFrames)/100;J=E.Bezier.getPosition(this.runtimeAttributes[G],I);}else{J=F.doMethod.call(this,G,K,H);}return J;};C.setRuntimeAttribute=function(P){if(this.patterns.points.test(P)){var H=this.getEl();var J=this.attributes;var G;var L=J["points"]["control"]||[];var I;var M,O;if(L.length>0&&!(L[0] instanceof Array)){L=[L];}else{var K=[];for(M=0,O=L.length;M<O;++M){K[M]=L[M];}L=K;}if(E.Dom.getStyle(H,"position")=="static"){E.Dom.setStyle(H,"position","relative");}if(D(J["points"]["from"])){E.Dom.setXY(H,J["points"]["from"]);
}else{E.Dom.setXY(H,E.Dom.getXY(H));}G=this.getAttribute("points");if(D(J["points"]["to"])){I=B.call(this,J["points"]["to"],G);var N=E.Dom.getXY(this.getEl());for(M=0,O=L.length;M<O;++M){L[M]=B.call(this,L[M],G);}}else{if(D(J["points"]["by"])){I=[G[0]+J["points"]["by"][0],G[1]+J["points"]["by"][1]];for(M=0,O=L.length;M<O;++M){L[M]=[G[0]+L[M][0],G[1]+L[M][1]];}}}this.runtimeAttributes[P]=[G];if(L.length>0){this.runtimeAttributes[P]=this.runtimeAttributes[P].concat(L);}this.runtimeAttributes[P][this.runtimeAttributes[P].length]=I;}else{F.setRuntimeAttribute.call(this,P);}};var B=function(G,I){var H=E.Dom.getXY(this.getEl());G=[G[0]-H[0]+I[0],G[1]-H[1]+I[1]];return G;};var D=function(G){return(typeof G!=="undefined");};E.Motion=A;})();(function(){var D=function(F,E,G,H){if(F){D.superclass.constructor.call(this,F,E,G,H);}};D.NAME="Scroll";var B=YAHOO.util;YAHOO.extend(D,B.ColorAnim);var C=D.superclass;var A=D.prototype;A.doMethod=function(E,H,F){var G=null;if(E=="scroll"){G=[this.method(this.currentFrame,H[0],F[0]-H[0],this.totalFrames),this.method(this.currentFrame,H[1],F[1]-H[1],this.totalFrames)];}else{G=C.doMethod.call(this,E,H,F);}return G;};A.getAttribute=function(E){var G=null;var F=this.getEl();if(E=="scroll"){G=[F.scrollLeft,F.scrollTop];}else{G=C.getAttribute.call(this,E);}return G;};A.setAttribute=function(E,H,G){var F=this.getEl();if(E=="scroll"){F.scrollLeft=H[0];F.scrollTop=H[1];}else{C.setAttribute.call(this,E,H,G);}};B.Scroll=D;})();YAHOO.register("animation",YAHOO.util.Anim,{version:"2.7.0",build:"1799"});if(!YAHOO.util.DragDropMgr){YAHOO.util.DragDropMgr=function(){var A=YAHOO.util.Event,B=YAHOO.util.Dom;return{useShim:false,_shimActive:false,_shimState:false,_debugShim:false,_createShim:function(){var C=document.createElement("div");C.id="yui-ddm-shim";if(document.body.firstChild){document.body.insertBefore(C,document.body.firstChild);}else{document.body.appendChild(C);}C.style.display="none";C.style.backgroundColor="red";C.style.position="absolute";C.style.zIndex="99999";B.setStyle(C,"opacity","0");this._shim=C;A.on(C,"mouseup",this.handleMouseUp,this,true);A.on(C,"mousemove",this.handleMouseMove,this,true);A.on(window,"scroll",this._sizeShim,this,true);},_sizeShim:function(){if(this._shimActive){var C=this._shim;C.style.height=B.getDocumentHeight()+"px";C.style.width=B.getDocumentWidth()+"px";C.style.top="0";C.style.left="0";}},_activateShim:function(){if(this.useShim){if(!this._shim){this._createShim();}this._shimActive=true;var C=this._shim,D="0";if(this._debugShim){D=".5";}B.setStyle(C,"opacity",D);this._sizeShim();C.style.display="block";}},_deactivateShim:function(){this._shim.style.display="none";this._shimActive=false;},_shim:null,ids:{},handleIds:{},dragCurrent:null,dragOvers:{},deltaX:0,deltaY:0,preventDefault:true,stopPropagation:true,initialized:false,locked:false,interactionInfo:null,init:function(){this.initialized=true;},POINT:0,INTERSECT:1,STRICT_INTERSECT:2,mode:0,_execOnAll:function(E,D){for(var F in this.ids){for(var C in this.ids[F]){var G=this.ids[F][C];if(!this.isTypeOfDD(G)){continue;}G[E].apply(G,D);}}},_onLoad:function(){this.init();A.on(document,"mouseup",this.handleMouseUp,this,true);A.on(document,"mousemove",this.handleMouseMove,this,true);A.on(window,"unload",this._onUnload,this,true);A.on(window,"resize",this._onResize,this,true);},_onResize:function(C){this._execOnAll("resetConstraints",[]);},lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isLocked:function(){return this.locked;},locationCache:{},useCache:true,clickPixelThresh:3,clickTimeThresh:1000,dragThreshMet:false,clickTimeout:null,startX:0,startY:0,fromTimeout:false,regDragDrop:function(D,C){if(!this.initialized){this.init();}if(!this.ids[C]){this.ids[C]={};}this.ids[C][D.id]=D;},removeDDFromGroup:function(E,C){if(!this.ids[C]){this.ids[C]={};}var D=this.ids[C];if(D&&D[E.id]){delete D[E.id];}},_remove:function(E){for(var D in E.groups){if(D){var C=this.ids[D];if(C&&C[E.id]){delete C[E.id];}}}delete this.handleIds[E.id];},regHandle:function(D,C){if(!this.handleIds[D]){this.handleIds[D]={};}this.handleIds[D][C]=C;},isDragDrop:function(C){return(this.getDDById(C))?true:false;},getRelated:function(H,D){var G=[];for(var F in H.groups){for(var E in this.ids[F]){var C=this.ids[F][E];if(!this.isTypeOfDD(C)){continue;}if(!D||C.isTarget){G[G.length]=C;}}}return G;},isLegalTarget:function(G,F){var D=this.getRelated(G,true);for(var E=0,C=D.length;E<C;++E){if(D[E].id==F.id){return true;}}return false;},isTypeOfDD:function(C){return(C&&C.__ygDragDrop);},isHandle:function(D,C){return(this.handleIds[D]&&this.handleIds[D][C]);},getDDById:function(D){for(var C in this.ids){if(this.ids[C][D]){return this.ids[C][D];}}return null;},handleMouseDown:function(E,D){this.currentTarget=YAHOO.util.Event.getTarget(E);this.dragCurrent=D;var C=D.getEl();this.startX=YAHOO.util.Event.getPageX(E);this.startY=YAHOO.util.Event.getPageY(E);this.deltaX=this.startX-C.offsetLeft;this.deltaY=this.startY-C.offsetTop;this.dragThreshMet=false;this.clickTimeout=setTimeout(function(){var F=YAHOO.util.DDM;F.startDrag(F.startX,F.startY);F.fromTimeout=true;},this.clickTimeThresh);},startDrag:function(C,E){if(this.dragCurrent&&this.dragCurrent.useShim){this._shimState=this.useShim;this.useShim=true;}this._activateShim();clearTimeout(this.clickTimeout);var D=this.dragCurrent;if(D&&D.events.b4StartDrag){D.b4StartDrag(C,E);D.fireEvent("b4StartDragEvent",{x:C,y:E});}if(D&&D.events.startDrag){D.startDrag(C,E);D.fireEvent("startDragEvent",{x:C,y:E});}this.dragThreshMet=true;},handleMouseUp:function(C){if(this.dragCurrent){clearTimeout(this.clickTimeout);if(this.dragThreshMet){if(this.fromTimeout){this.fromTimeout=false;this.handleMouseMove(C);}this.fromTimeout=false;this.fireEvents(C,true);}else{}this.stopDrag(C);this.stopEvent(C);}},stopEvent:function(C){if(this.stopPropagation){YAHOO.util.Event.stopPropagation(C);}if(this.preventDefault){YAHOO.util.Event.preventDefault(C);}},stopDrag:function(E,D){var C=this.dragCurrent;if(C&&!D){if(this.dragThreshMet){if(C.events.b4EndDrag){C.b4EndDrag(E);C.fireEvent("b4EndDragEvent",{e:E});}if(C.events.endDrag){C.endDrag(E);C.fireEvent("endDragEvent",{e:E});}}if(C.events.mouseUp){C.onMouseUp(E);C.fireEvent("mouseUpEvent",{e:E});}}if(this._shimActive){this._deactivateShim();if(this.dragCurrent&&this.dragCurrent.useShim){this.useShim=this._shimState;this._shimState=false;}}this.dragCurrent=null;this.dragOvers={};},handleMouseMove:function(F){var C=this.dragCurrent;if(C){if(YAHOO.util.Event.isIE&&!F.button){this.stopEvent(F);return this.handleMouseUp(F);}else{if(F.clientX<0||F.clientY<0){}}if(!this.dragThreshMet){var E=Math.abs(this.startX-YAHOO.util.Event.getPageX(F));var D=Math.abs(this.startY-YAHOO.util.Event.getPageY(F));if(E>this.clickPixelThresh||D>this.clickPixelThresh){this.startDrag(this.startX,this.startY);}}if(this.dragThreshMet){if(C&&C.events.b4Drag){C.b4Drag(F);C.fireEvent("b4DragEvent",{e:F});}if(C&&C.events.drag){C.onDrag(F);C.fireEvent("dragEvent",{e:F});}if(C){this.fireEvents(F,false);}}this.stopEvent(F);}},fireEvents:function(V,L){var a=this.dragCurrent;if(!a||a.isLocked()||a.dragOnly){return;}var N=YAHOO.util.Event.getPageX(V),M=YAHOO.util.Event.getPageY(V),P=new YAHOO.util.Point(N,M),K=a.getTargetCoord(P.x,P.y),F=a.getDragEl(),E=["out","over","drop","enter"],U=new YAHOO.util.Region(K.y,K.x+F.offsetWidth,K.y+F.offsetHeight,K.x),I=[],D={},Q=[],c={outEvts:[],overEvts:[],dropEvts:[],enterEvts:[]};for(var S in this.dragOvers){var d=this.dragOvers[S];if(!this.isTypeOfDD(d)){continue;
}if(!this.isOverTarget(P,d,this.mode,U)){c.outEvts.push(d);}I[S]=true;delete this.dragOvers[S];}for(var R in a.groups){if("string"!=typeof R){continue;}for(S in this.ids[R]){var G=this.ids[R][S];if(!this.isTypeOfDD(G)){continue;}if(G.isTarget&&!G.isLocked()&&G!=a){if(this.isOverTarget(P,G,this.mode,U)){D[R]=true;if(L){c.dropEvts.push(G);}else{if(!I[G.id]){c.enterEvts.push(G);}else{c.overEvts.push(G);}this.dragOvers[G.id]=G;}}}}}this.interactionInfo={out:c.outEvts,enter:c.enterEvts,over:c.overEvts,drop:c.dropEvts,point:P,draggedRegion:U,sourceRegion:this.locationCache[a.id],validDrop:L};for(var C in D){Q.push(C);}if(L&&!c.dropEvts.length){this.interactionInfo.validDrop=false;if(a.events.invalidDrop){a.onInvalidDrop(V);a.fireEvent("invalidDropEvent",{e:V});}}for(S=0;S<E.length;S++){var Y=null;if(c[E[S]+"Evts"]){Y=c[E[S]+"Evts"];}if(Y&&Y.length){var H=E[S].charAt(0).toUpperCase()+E[S].substr(1),X="onDrag"+H,J="b4Drag"+H,O="drag"+H+"Event",W="drag"+H;if(this.mode){if(a.events[J]){a[J](V,Y,Q);a.fireEvent(J+"Event",{event:V,info:Y,group:Q});}if(a.events[W]){a[X](V,Y,Q);a.fireEvent(O,{event:V,info:Y,group:Q});}}else{for(var Z=0,T=Y.length;Z<T;++Z){if(a.events[J]){a[J](V,Y[Z].id,Q[0]);a.fireEvent(J+"Event",{event:V,info:Y[Z].id,group:Q[0]});}if(a.events[W]){a[X](V,Y[Z].id,Q[0]);a.fireEvent(O,{event:V,info:Y[Z].id,group:Q[0]});}}}}}},getBestMatch:function(E){var G=null;var D=E.length;if(D==1){G=E[0];}else{for(var F=0;F<D;++F){var C=E[F];if(this.mode==this.INTERSECT&&C.cursorIsOver){G=C;break;}else{if(!G||!G.overlap||(C.overlap&&G.overlap.getArea()<C.overlap.getArea())){G=C;}}}}return G;},refreshCache:function(D){var F=D||this.ids;for(var C in F){if("string"!=typeof C){continue;}for(var E in this.ids[C]){var G=this.ids[C][E];if(this.isTypeOfDD(G)){var H=this.getLocation(G);if(H){this.locationCache[G.id]=H;}else{delete this.locationCache[G.id];}}}}},verifyEl:function(D){try{if(D){var C=D.offsetParent;if(C){return true;}}}catch(E){}return false;},getLocation:function(H){if(!this.isTypeOfDD(H)){return null;}var F=H.getEl(),K,E,D,M,L,N,C,J,G;try{K=YAHOO.util.Dom.getXY(F);}catch(I){}if(!K){return null;}E=K[0];D=E+F.offsetWidth;M=K[1];L=M+F.offsetHeight;N=M-H.padding[0];C=D+H.padding[1];J=L+H.padding[2];G=E-H.padding[3];return new YAHOO.util.Region(N,C,J,G);},isOverTarget:function(K,C,E,F){var G=this.locationCache[C.id];if(!G||!this.useCache){G=this.getLocation(C);this.locationCache[C.id]=G;}if(!G){return false;}C.cursorIsOver=G.contains(K);var J=this.dragCurrent;if(!J||(!E&&!J.constrainX&&!J.constrainY)){return C.cursorIsOver;}C.overlap=null;if(!F){var H=J.getTargetCoord(K.x,K.y);var D=J.getDragEl();F=new YAHOO.util.Region(H.y,H.x+D.offsetWidth,H.y+D.offsetHeight,H.x);}var I=F.intersect(G);if(I){C.overlap=I;return(E)?true:C.cursorIsOver;}else{return false;}},_onUnload:function(D,C){this.unregAll();},unregAll:function(){if(this.dragCurrent){this.stopDrag();this.dragCurrent=null;}this._execOnAll("unreg",[]);this.ids={};},elementCache:{},getElWrapper:function(D){var C=this.elementCache[D];if(!C||!C.el){C=this.elementCache[D]=new this.ElementWrapper(YAHOO.util.Dom.get(D));}return C;},getElement:function(C){return YAHOO.util.Dom.get(C);},getCss:function(D){var C=YAHOO.util.Dom.get(D);return(C)?C.style:null;},ElementWrapper:function(C){this.el=C||null;this.id=this.el&&C.id;this.css=this.el&&C.style;},getPosX:function(C){return YAHOO.util.Dom.getX(C);},getPosY:function(C){return YAHOO.util.Dom.getY(C);},swapNode:function(E,C){if(E.swapNode){E.swapNode(C);}else{var F=C.parentNode;var D=C.nextSibling;if(D==E){F.insertBefore(E,C);}else{if(C==E.nextSibling){F.insertBefore(C,E);}else{E.parentNode.replaceChild(C,E);F.insertBefore(E,D);}}}},getScroll:function(){var E,C,F=document.documentElement,D=document.body;if(F&&(F.scrollTop||F.scrollLeft)){E=F.scrollTop;C=F.scrollLeft;}else{if(D){E=D.scrollTop;C=D.scrollLeft;}else{}}return{top:E,left:C};},getStyle:function(D,C){return YAHOO.util.Dom.getStyle(D,C);},getScrollTop:function(){return this.getScroll().top;},getScrollLeft:function(){return this.getScroll().left;},moveToEl:function(C,E){var D=YAHOO.util.Dom.getXY(E);YAHOO.util.Dom.setXY(C,D);},getClientHeight:function(){return YAHOO.util.Dom.getViewportHeight();},getClientWidth:function(){return YAHOO.util.Dom.getViewportWidth();},numericSort:function(D,C){return(D-C);},_timeoutCount:0,_addListeners:function(){var C=YAHOO.util.DDM;if(YAHOO.util.Event&&document){C._onLoad();}else{if(C._timeoutCount>2000){}else{setTimeout(C._addListeners,10);if(document&&document.body){C._timeoutCount+=1;}}}},handleWasClicked:function(C,E){if(this.isHandle(E,C.id)){return true;}else{var D=C.parentNode;while(D){if(this.isHandle(E,D.id)){return true;}else{D=D.parentNode;}}}return false;}};}();YAHOO.util.DDM=YAHOO.util.DragDropMgr;YAHOO.util.DDM._addListeners();}(function(){var A=YAHOO.util.Event;var B=YAHOO.util.Dom;YAHOO.util.DragDrop=function(E,C,D){if(E){this.init(E,C,D);}};YAHOO.util.DragDrop.prototype={events:null,on:function(){this.subscribe.apply(this,arguments);},id:null,config:null,dragElId:null,handleElId:null,invalidHandleTypes:null,invalidHandleIds:null,invalidHandleClasses:null,startPageX:0,startPageY:0,groups:null,locked:false,lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isTarget:true,padding:null,dragOnly:false,useShim:false,_domRef:null,__ygDragDrop:true,constrainX:false,constrainY:false,minX:0,maxX:0,minY:0,maxY:0,deltaX:0,deltaY:0,maintainOffset:false,xTicks:null,yTicks:null,primaryButtonOnly:true,available:false,hasOuterHandles:false,cursorIsOver:false,overlap:null,b4StartDrag:function(C,D){},startDrag:function(C,D){},b4Drag:function(C){},onDrag:function(C){},onDragEnter:function(C,D){},b4DragOver:function(C){},onDragOver:function(C,D){},b4DragOut:function(C){},onDragOut:function(C,D){},b4DragDrop:function(C){},onDragDrop:function(C,D){},onInvalidDrop:function(C){},b4EndDrag:function(C){},endDrag:function(C){},b4MouseDown:function(C){},onMouseDown:function(C){},onMouseUp:function(C){},onAvailable:function(){},getEl:function(){if(!this._domRef){this._domRef=B.get(this.id);
}return this._domRef;},getDragEl:function(){return B.get(this.dragElId);},init:function(F,C,D){this.initTarget(F,C,D);A.on(this._domRef||this.id,"mousedown",this.handleMouseDown,this,true);for(var E in this.events){this.createEvent(E+"Event");}},initTarget:function(E,C,D){this.config=D||{};this.events={};this.DDM=YAHOO.util.DDM;this.groups={};if(typeof E!=="string"){this._domRef=E;E=B.generateId(E);}this.id=E;this.addToGroup((C)?C:"default");this.handleElId=E;A.onAvailable(E,this.handleOnAvailable,this,true);this.setDragElId(E);this.invalidHandleTypes={A:"A"};this.invalidHandleIds={};this.invalidHandleClasses=[];this.applyConfig();},applyConfig:function(){this.events={mouseDown:true,b4MouseDown:true,mouseUp:true,b4StartDrag:true,startDrag:true,b4EndDrag:true,endDrag:true,drag:true,b4Drag:true,invalidDrop:true,b4DragOut:true,dragOut:true,dragEnter:true,b4DragOver:true,dragOver:true,b4DragDrop:true,dragDrop:true};if(this.config.events){for(var C in this.config.events){if(this.config.events[C]===false){this.events[C]=false;}}}this.padding=this.config.padding||[0,0,0,0];this.isTarget=(this.config.isTarget!==false);this.maintainOffset=(this.config.maintainOffset);this.primaryButtonOnly=(this.config.primaryButtonOnly!==false);this.dragOnly=((this.config.dragOnly===true)?true:false);this.useShim=((this.config.useShim===true)?true:false);},handleOnAvailable:function(){this.available=true;this.resetConstraints();this.onAvailable();},setPadding:function(E,C,F,D){if(!C&&0!==C){this.padding=[E,E,E,E];}else{if(!F&&0!==F){this.padding=[E,C,E,C];}else{this.padding=[E,C,F,D];}}},setInitPosition:function(F,E){var G=this.getEl();if(!this.DDM.verifyEl(G)){if(G&&G.style&&(G.style.display=="none")){}else{}return;}var D=F||0;var C=E||0;var H=B.getXY(G);this.initPageX=H[0]-D;this.initPageY=H[1]-C;this.lastPageX=H[0];this.lastPageY=H[1];this.setStartPosition(H);},setStartPosition:function(D){var C=D||B.getXY(this.getEl());this.deltaSetXY=null;this.startPageX=C[0];this.startPageY=C[1];},addToGroup:function(C){this.groups[C]=true;this.DDM.regDragDrop(this,C);},removeFromGroup:function(C){if(this.groups[C]){delete this.groups[C];}this.DDM.removeDDFromGroup(this,C);},setDragElId:function(C){this.dragElId=C;},setHandleElId:function(C){if(typeof C!=="string"){C=B.generateId(C);}this.handleElId=C;this.DDM.regHandle(this.id,C);},setOuterHandleElId:function(C){if(typeof C!=="string"){C=B.generateId(C);}A.on(C,"mousedown",this.handleMouseDown,this,true);this.setHandleElId(C);this.hasOuterHandles=true;},unreg:function(){A.removeListener(this.id,"mousedown",this.handleMouseDown);this._domRef=null;this.DDM._remove(this);},isLocked:function(){return(this.DDM.isLocked()||this.locked);},handleMouseDown:function(J,I){var D=J.which||J.button;if(this.primaryButtonOnly&&D>1){return;}if(this.isLocked()){return;}var C=this.b4MouseDown(J),F=true;if(this.events.b4MouseDown){F=this.fireEvent("b4MouseDownEvent",J);}var E=this.onMouseDown(J),H=true;if(this.events.mouseDown){H=this.fireEvent("mouseDownEvent",J);}if((C===false)||(E===false)||(F===false)||(H===false)){return;}this.DDM.refreshCache(this.groups);var G=new YAHOO.util.Point(A.getPageX(J),A.getPageY(J));if(!this.hasOuterHandles&&!this.DDM.isOverTarget(G,this)){}else{if(this.clickValidator(J)){this.setStartPosition();this.DDM.handleMouseDown(J,this);this.DDM.stopEvent(J);}else{}}},clickValidator:function(D){var C=YAHOO.util.Event.getTarget(D);return(this.isValidHandleChild(C)&&(this.id==this.handleElId||this.DDM.handleWasClicked(C,this.id)));},getTargetCoord:function(E,D){var C=E-this.deltaX;var F=D-this.deltaY;if(this.constrainX){if(C<this.minX){C=this.minX;}if(C>this.maxX){C=this.maxX;}}if(this.constrainY){if(F<this.minY){F=this.minY;}if(F>this.maxY){F=this.maxY;}}C=this.getTick(C,this.xTicks);F=this.getTick(F,this.yTicks);return{x:C,y:F};},addInvalidHandleType:function(C){var D=C.toUpperCase();this.invalidHandleTypes[D]=D;},addInvalidHandleId:function(C){if(typeof C!=="string"){C=B.generateId(C);}this.invalidHandleIds[C]=C;},addInvalidHandleClass:function(C){this.invalidHandleClasses.push(C);},removeInvalidHandleType:function(C){var D=C.toUpperCase();delete this.invalidHandleTypes[D];},removeInvalidHandleId:function(C){if(typeof C!=="string"){C=B.generateId(C);}delete this.invalidHandleIds[C];},removeInvalidHandleClass:function(D){for(var E=0,C=this.invalidHandleClasses.length;E<C;++E){if(this.invalidHandleClasses[E]==D){delete this.invalidHandleClasses[E];}}},isValidHandleChild:function(F){var E=true;var H;try{H=F.nodeName.toUpperCase();}catch(G){H=F.nodeName;}E=E&&!this.invalidHandleTypes[H];E=E&&!this.invalidHandleIds[F.id];for(var D=0,C=this.invalidHandleClasses.length;E&&D<C;++D){E=!B.hasClass(F,this.invalidHandleClasses[D]);}return E;},setXTicks:function(F,C){this.xTicks=[];this.xTickSize=C;var E={};for(var D=this.initPageX;D>=this.minX;D=D-C){if(!E[D]){this.xTicks[this.xTicks.length]=D;E[D]=true;}}for(D=this.initPageX;D<=this.maxX;D=D+C){if(!E[D]){this.xTicks[this.xTicks.length]=D;E[D]=true;}}this.xTicks.sort(this.DDM.numericSort);},setYTicks:function(F,C){this.yTicks=[];this.yTickSize=C;var E={};for(var D=this.initPageY;D>=this.minY;D=D-C){if(!E[D]){this.yTicks[this.yTicks.length]=D;E[D]=true;}}for(D=this.initPageY;D<=this.maxY;D=D+C){if(!E[D]){this.yTicks[this.yTicks.length]=D;E[D]=true;}}this.yTicks.sort(this.DDM.numericSort);},setXConstraint:function(E,D,C){this.leftConstraint=parseInt(E,10);this.rightConstraint=parseInt(D,10);this.minX=this.initPageX-this.leftConstraint;this.maxX=this.initPageX+this.rightConstraint;if(C){this.setXTicks(this.initPageX,C);}this.constrainX=true;},clearConstraints:function(){this.constrainX=false;this.constrainY=false;this.clearTicks();},clearTicks:function(){this.xTicks=null;this.yTicks=null;this.xTickSize=0;this.yTickSize=0;},setYConstraint:function(C,E,D){this.topConstraint=parseInt(C,10);this.bottomConstraint=parseInt(E,10);this.minY=this.initPageY-this.topConstraint;this.maxY=this.initPageY+this.bottomConstraint;if(D){this.setYTicks(this.initPageY,D);
}this.constrainY=true;},resetConstraints:function(){if(this.initPageX||this.initPageX===0){var D=(this.maintainOffset)?this.lastPageX-this.initPageX:0;var C=(this.maintainOffset)?this.lastPageY-this.initPageY:0;this.setInitPosition(D,C);}else{this.setInitPosition();}if(this.constrainX){this.setXConstraint(this.leftConstraint,this.rightConstraint,this.xTickSize);}if(this.constrainY){this.setYConstraint(this.topConstraint,this.bottomConstraint,this.yTickSize);}},getTick:function(I,F){if(!F){return I;}else{if(F[0]>=I){return F[0];}else{for(var D=0,C=F.length;D<C;++D){var E=D+1;if(F[E]&&F[E]>=I){var H=I-F[D];var G=F[E]-I;return(G>H)?F[D]:F[E];}}return F[F.length-1];}}},toString:function(){return("DragDrop "+this.id);}};YAHOO.augment(YAHOO.util.DragDrop,YAHOO.util.EventProvider);})();YAHOO.util.DD=function(C,A,B){if(C){this.init(C,A,B);}};YAHOO.extend(YAHOO.util.DD,YAHOO.util.DragDrop,{scroll:true,autoOffset:function(C,B){var A=C-this.startPageX;var D=B-this.startPageY;this.setDelta(A,D);},setDelta:function(B,A){this.deltaX=B;this.deltaY=A;},setDragElPos:function(C,B){var A=this.getDragEl();this.alignElWithMouse(A,C,B);},alignElWithMouse:function(C,G,F){var E=this.getTargetCoord(G,F);if(!this.deltaSetXY){var H=[E.x,E.y];YAHOO.util.Dom.setXY(C,H);var D=parseInt(YAHOO.util.Dom.getStyle(C,"left"),10);var B=parseInt(YAHOO.util.Dom.getStyle(C,"top"),10);this.deltaSetXY=[D-E.x,B-E.y];}else{YAHOO.util.Dom.setStyle(C,"left",(E.x+this.deltaSetXY[0])+"px");YAHOO.util.Dom.setStyle(C,"top",(E.y+this.deltaSetXY[1])+"px");}this.cachePosition(E.x,E.y);var A=this;setTimeout(function(){A.autoScroll.call(A,E.x,E.y,C.offsetHeight,C.offsetWidth);},0);},cachePosition:function(B,A){if(B){this.lastPageX=B;this.lastPageY=A;}else{var C=YAHOO.util.Dom.getXY(this.getEl());this.lastPageX=C[0];this.lastPageY=C[1];}},autoScroll:function(J,I,E,K){if(this.scroll){var L=this.DDM.getClientHeight();var B=this.DDM.getClientWidth();var N=this.DDM.getScrollTop();var D=this.DDM.getScrollLeft();var H=E+I;var M=K+J;var G=(L+N-I-this.deltaY);var F=(B+D-J-this.deltaX);var C=40;var A=(document.all)?80:30;if(H>L&&G<C){window.scrollTo(D,N+A);}if(I<N&&N>0&&I-N<C){window.scrollTo(D,N-A);}if(M>B&&F<C){window.scrollTo(D+A,N);}if(J<D&&D>0&&J-D<C){window.scrollTo(D-A,N);}}},applyConfig:function(){YAHOO.util.DD.superclass.applyConfig.call(this);this.scroll=(this.config.scroll!==false);},b4MouseDown:function(A){this.setStartPosition();this.autoOffset(YAHOO.util.Event.getPageX(A),YAHOO.util.Event.getPageY(A));},b4Drag:function(A){this.setDragElPos(YAHOO.util.Event.getPageX(A),YAHOO.util.Event.getPageY(A));},toString:function(){return("DD "+this.id);}});YAHOO.util.DDProxy=function(C,A,B){if(C){this.init(C,A,B);this.initFrame();}};YAHOO.util.DDProxy.dragElId="ygddfdiv";YAHOO.extend(YAHOO.util.DDProxy,YAHOO.util.DD,{resizeFrame:true,centerFrame:false,createFrame:function(){var B=this,A=document.body;if(!A||!A.firstChild){setTimeout(function(){B.createFrame();},50);return;}var F=this.getDragEl(),E=YAHOO.util.Dom;if(!F){F=document.createElement("div");F.id=this.dragElId;var D=F.style;D.position="absolute";D.visibility="hidden";D.cursor="move";D.border="2px solid #aaa";D.zIndex=999;D.height="25px";D.width="25px";var C=document.createElement("div");E.setStyle(C,"height","100%");E.setStyle(C,"width","100%");E.setStyle(C,"background-color","#ccc");E.setStyle(C,"opacity","0");F.appendChild(C);A.insertBefore(F,A.firstChild);}},initFrame:function(){this.createFrame();},applyConfig:function(){YAHOO.util.DDProxy.superclass.applyConfig.call(this);this.resizeFrame=(this.config.resizeFrame!==false);this.centerFrame=(this.config.centerFrame);this.setDragElId(this.config.dragElId||YAHOO.util.DDProxy.dragElId);},showFrame:function(E,D){var C=this.getEl();var A=this.getDragEl();var B=A.style;this._resizeProxy();if(this.centerFrame){this.setDelta(Math.round(parseInt(B.width,10)/2),Math.round(parseInt(B.height,10)/2));}this.setDragElPos(E,D);YAHOO.util.Dom.setStyle(A,"visibility","visible");},_resizeProxy:function(){if(this.resizeFrame){var H=YAHOO.util.Dom;var B=this.getEl();var C=this.getDragEl();var G=parseInt(H.getStyle(C,"borderTopWidth"),10);var I=parseInt(H.getStyle(C,"borderRightWidth"),10);var F=parseInt(H.getStyle(C,"borderBottomWidth"),10);var D=parseInt(H.getStyle(C,"borderLeftWidth"),10);if(isNaN(G)){G=0;}if(isNaN(I)){I=0;}if(isNaN(F)){F=0;}if(isNaN(D)){D=0;}var E=Math.max(0,B.offsetWidth-I-D);var A=Math.max(0,B.offsetHeight-G-F);H.setStyle(C,"width",E+"px");H.setStyle(C,"height",A+"px");}},b4MouseDown:function(B){this.setStartPosition();var A=YAHOO.util.Event.getPageX(B);var C=YAHOO.util.Event.getPageY(B);this.autoOffset(A,C);},b4StartDrag:function(A,B){this.showFrame(A,B);},b4EndDrag:function(A){YAHOO.util.Dom.setStyle(this.getDragEl(),"visibility","hidden");},endDrag:function(D){var C=YAHOO.util.Dom;var B=this.getEl();var A=this.getDragEl();C.setStyle(A,"visibility","");C.setStyle(B,"visibility","hidden");YAHOO.util.DDM.moveToEl(B,A);C.setStyle(A,"visibility","hidden");C.setStyle(B,"visibility","");},toString:function(){return("DDProxy "+this.id);}});YAHOO.util.DDTarget=function(C,A,B){if(C){this.initTarget(C,A,B);}};YAHOO.extend(YAHOO.util.DDTarget,YAHOO.util.DragDrop,{toString:function(){return("DDTarget "+this.id);}});YAHOO.register("dragdrop",YAHOO.util.DragDropMgr,{version:"2.7.0",build:"1799"});YAHOO.util.Attribute=function(B,A){if(A){this.owner=A;this.configure(B,true);}};YAHOO.util.Attribute.prototype={name:undefined,value:null,owner:null,readOnly:false,writeOnce:false,_initialConfig:null,_written:false,method:null,setter:null,getter:null,validator:null,getValue:function(){var A=this.value;if(this.getter){A=this.getter.call(this.owner,this.name);}return A;},setValue:function(F,B){var E,A=this.owner,C=this.name;var D={type:C,prevValue:this.getValue(),newValue:F};if(this.readOnly||(this.writeOnce&&this._written)){return false;}if(this.validator&&!this.validator.call(A,F)){return false;}if(!B){E=A.fireBeforeChangeEvent(D);if(E===false){return false;}}if(this.setter){F=this.setter.call(A,F,this.name);if(F===undefined){}}if(this.method){this.method.call(A,F,this.name);}this.value=F;this._written=true;D.type=C;if(!B){this.owner.fireChangeEvent(D);}return true;},configure:function(B,C){B=B||{};if(C){this._written=false;}this._initialConfig=this._initialConfig||{};for(var A in B){if(B.hasOwnProperty(A)){this[A]=B[A];if(C){this._initialConfig[A]=B[A];}}}},resetValue:function(){return this.setValue(this._initialConfig.value);},resetConfig:function(){this.configure(this._initialConfig,true);},refresh:function(A){this.setValue(this.value,A);}};(function(){var A=YAHOO.util.Lang;YAHOO.util.AttributeProvider=function(){};YAHOO.util.AttributeProvider.prototype={_configs:null,get:function(C){this._configs=this._configs||{};var B=this._configs[C];if(!B||!this._configs.hasOwnProperty(C)){return null;}return B.getValue();},set:function(D,E,B){this._configs=this._configs||{};var C=this._configs[D];if(!C){return false;}return C.setValue(E,B);},getAttributeKeys:function(){this._configs=this._configs;var C=[],B;for(B in this._configs){if(A.hasOwnProperty(this._configs,B)&&!A.isUndefined(this._configs[B])){C[C.length]=B;}}return C;},setAttributes:function(D,B){for(var C in D){if(A.hasOwnProperty(D,C)){this.set(C,D[C],B);}}},resetValue:function(C,B){this._configs=this._configs||{};if(this._configs[C]){this.set(C,this._configs[C]._initialConfig.value,B);return true;}return false;},refresh:function(E,C){this._configs=this._configs||{};var F=this._configs;E=((A.isString(E))?[E]:E)||this.getAttributeKeys();for(var D=0,B=E.length;D<B;++D){if(F.hasOwnProperty(E[D])){this._configs[E[D]].refresh(C);}}},register:function(B,C){this.setAttributeConfig(B,C);},getAttributeConfig:function(C){this._configs=this._configs||{};var B=this._configs[C]||{};var D={};for(C in B){if(A.hasOwnProperty(B,C)){D[C]=B[C];}}return D;},setAttributeConfig:function(B,C,D){this._configs=this._configs||{};C=C||{};if(!this._configs[B]){C.name=B;this._configs[B]=this.createAttribute(C);}else{this._configs[B].configure(C,D);}},configureAttribute:function(B,C,D){this.setAttributeConfig(B,C,D);},resetAttributeConfig:function(B){this._configs=this._configs||{};this._configs[B].resetConfig();},subscribe:function(B,C){this._events=this._events||{};if(!(B in this._events)){this._events[B]=this.createEvent(B);}YAHOO.util.EventProvider.prototype.subscribe.apply(this,arguments);},on:function(){this.subscribe.apply(this,arguments);},addListener:function(){this.subscribe.apply(this,arguments);},fireBeforeChangeEvent:function(C){var B="before";B+=C.type.charAt(0).toUpperCase()+C.type.substr(1)+"Change";C.type=B;return this.fireEvent(C.type,C);},fireChangeEvent:function(B){B.type+="Change";return this.fireEvent(B.type,B);},createAttribute:function(B){return new YAHOO.util.Attribute(B,this);}};YAHOO.augment(YAHOO.util.AttributeProvider,YAHOO.util.EventProvider);})();(function(){var B=YAHOO.util.Dom,C=YAHOO.util.AttributeProvider;var A=function(D,E){this.init.apply(this,arguments);};A.DOM_EVENTS={"click":true,"dblclick":true,"keydown":true,"keypress":true,"keyup":true,"mousedown":true,"mousemove":true,"mouseout":true,"mouseover":true,"mouseup":true,"focus":true,"blur":true,"submit":true,"change":true};A.prototype={DOM_EVENTS:null,DEFAULT_HTML_SETTER:function(F,D){var E=this.get("element");if(E){E[D]=F;}},DEFAULT_HTML_GETTER:function(D){var E=this.get("element"),F;if(E){F=E[D];}return F;},appendChild:function(D){D=D.get?D.get("element"):D;return this.get("element").appendChild(D);},getElementsByTagName:function(D){return this.get("element").getElementsByTagName(D);},hasChildNodes:function(){return this.get("element").hasChildNodes();},insertBefore:function(D,E){D=D.get?D.get("element"):D;E=(E&&E.get)?E.get("element"):E;return this.get("element").insertBefore(D,E);},removeChild:function(D){D=D.get?D.get("element"):D;return this.get("element").removeChild(D);},replaceChild:function(D,E){D=D.get?D.get("element"):D;E=E.get?E.get("element"):E;return this.get("element").replaceChild(D,E);},initAttributes:function(D){},addListener:function(H,G,I,F){var E=this.get("element")||this.get("id");F=F||this;var D=this;if(!this._events[H]){if(E&&this.DOM_EVENTS[H]){YAHOO.util.Event.addListener(E,H,function(J){if(J.srcElement&&!J.target){J.target=J.srcElement;}D.fireEvent(H,J);},I,F);}this.createEvent(H,this);}return YAHOO.util.EventProvider.prototype.subscribe.apply(this,arguments);},on:function(){return this.addListener.apply(this,arguments);},subscribe:function(){return this.addListener.apply(this,arguments);},removeListener:function(E,D){return this.unsubscribe.apply(this,arguments);},addClass:function(D){B.addClass(this.get("element"),D);},getElementsByClassName:function(E,D){return B.getElementsByClassName(E,D,this.get("element"));},hasClass:function(D){return B.hasClass(this.get("element"),D);},removeClass:function(D){return B.removeClass(this.get("element"),D);},replaceClass:function(E,D){return B.replaceClass(this.get("element"),E,D);},setStyle:function(E,D){return B.setStyle(this.get("element"),E,D);},getStyle:function(D){return B.getStyle(this.get("element"),D);},fireQueue:function(){var E=this._queue;for(var F=0,D=E.length;F<D;++F){this[E[F][0]].apply(this,E[F][1]);}},appendTo:function(E,F){E=(E.get)?E.get("element"):B.get(E);this.fireEvent("beforeAppendTo",{type:"beforeAppendTo",target:E});
F=(F&&F.get)?F.get("element"):B.get(F);var D=this.get("element");if(!D){return false;}if(!E){return false;}if(D.parent!=E){if(F){E.insertBefore(D,F);}else{E.appendChild(D);}}this.fireEvent("appendTo",{type:"appendTo",target:E});return D;},get:function(D){var F=this._configs||{},E=F.element;if(E&&!F[D]&&!YAHOO.lang.isUndefined(E.value[D])){this._setHTMLAttrConfig(D);}return C.prototype.get.call(this,D);},setAttributes:function(J,G){var E={},H=this._configOrder;for(var I=0,D=H.length;I<D;++I){if(J[H[I]]!==undefined){E[H[I]]=true;this.set(H[I],J[H[I]],G);}}for(var F in J){if(J.hasOwnProperty(F)&&!E[F]){this.set(F,J[F],G);}}},set:function(E,G,D){var F=this.get("element");if(!F){this._queue[this._queue.length]=["set",arguments];if(this._configs[E]){this._configs[E].value=G;}return;}if(!this._configs[E]&&!YAHOO.lang.isUndefined(F[E])){this._setHTMLAttrConfig(E);}return C.prototype.set.apply(this,arguments);},setAttributeConfig:function(D,E,F){this._configOrder.push(D);C.prototype.setAttributeConfig.apply(this,arguments);},createEvent:function(E,D){this._events[E]=true;return C.prototype.createEvent.apply(this,arguments);},init:function(E,D){this._initElement(E,D);},destroy:function(){var D=this.get("element");YAHOO.util.Event.purgeElement(D,true);this.unsubscribeAll();if(D&&D.parentNode){D.parentNode.removeChild(D);}this._queue=[];this._events={};this._configs={};this._configOrder=[];},_initElement:function(F,E){this._queue=this._queue||[];this._events=this._events||{};this._configs=this._configs||{};this._configOrder=[];E=E||{};E.element=E.element||F||null;var H=false;var D=A.DOM_EVENTS;this.DOM_EVENTS=this.DOM_EVENTS||{};for(var G in D){if(D.hasOwnProperty(G)){this.DOM_EVENTS[G]=D[G];}}if(typeof E.element==="string"){this._setHTMLAttrConfig("id",{value:E.element});}if(B.get(E.element)){H=true;this._initHTMLElement(E);this._initContent(E);}YAHOO.util.Event.onAvailable(E.element,function(){if(!H){this._initHTMLElement(E);}this.fireEvent("available",{type:"available",target:B.get(E.element)});},this,true);YAHOO.util.Event.onContentReady(E.element,function(){if(!H){this._initContent(E);}this.fireEvent("contentReady",{type:"contentReady",target:B.get(E.element)});},this,true);},_initHTMLElement:function(D){this.setAttributeConfig("element",{value:B.get(D.element),readOnly:true});},_initContent:function(D){this.initAttributes(D);this.setAttributes(D,true);this.fireQueue();},_setHTMLAttrConfig:function(D,F){var E=this.get("element");F=F||{};F.name=D;F.setter=F.setter||this.DEFAULT_HTML_SETTER;F.getter=F.getter||this.DEFAULT_HTML_GETTER;F.value=F.value||E[D];this._configs[D]=new YAHOO.util.Attribute(F,this);}};YAHOO.augment(A,C);YAHOO.util.Element=A;})();YAHOO.register("element",YAHOO.util.Element,{version:"2.7.0",build:"1799"});YAHOO.register("utilities", YAHOO, {version: "2.7.0", build: "1799"});

/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function () {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Lang = YAHOO.lang,
        Widget = YAHOO.widget;
        
    

/**
 * The treeview widget is a generic tree building tool.
 * @module treeview
 * @title TreeView Widget
 * @requires yahoo, event
 * @optional animation, json
 * @namespace YAHOO.widget
 */

/**
 * Contains the tree view state data and the root node.
 *
 * @class TreeView
 * @uses YAHOO.util.EventProvider
 * @constructor
 * @param {string|HTMLElement} id The id of the element, or the element itself that the tree will be inserted into.  Existing markup in this element, if valid, will be used to build the tree
 * @param {Array|object|string}  oConfig (optional)  An array containing the definition of the tree.  (see buildTreeFromObject)
 * 
 */
YAHOO.widget.TreeView = function(id, oConfig) {
    if (id) { this.init(id); }
    if (oConfig) {
        if (!Lang.isArray(oConfig)) {
            oConfig = [oConfig];
        }
        this.buildTreeFromObject(oConfig);
    } else if (Lang.trim(this._el.innerHTML)) {
        this.buildTreeFromMarkup(id);
    }
};

var TV = Widget.TreeView;

TV.prototype = {

    /**
     * The id of tree container element
     * @property id
     * @type String
     */
    id: null,

    /**
     * The host element for this tree
     * @property _el
     * @private
     * @type HTMLelement
     */
    _el: null,

     /**
     * Flat collection of all nodes in this tree.  This is a sparse
     * array, so the length property can't be relied upon for a
     * node count for the tree.
     * @property _nodes
     * @type Node[]
     * @private
     */
    _nodes: null,

    /**
     * We lock the tree control while waiting for the dynamic loader to return
     * @property locked
     * @type boolean
     */
    locked: false,

    /**
     * The animation to use for expanding children, if any
     * @property _expandAnim
     * @type string
     * @private
     */
    _expandAnim: null,

    /**
     * The animation to use for collapsing children, if any
     * @property _collapseAnim
     * @type string
     * @private
     */
    _collapseAnim: null,

    /**
     * The current number of animations that are executing
     * @property _animCount
     * @type int
     * @private
     */
    _animCount: 0,

    /**
     * The maximum number of animations to run at one time.
     * @property maxAnim
     * @type int
     */
    maxAnim: 2,

    /**
     * Whether there is any subscriber to dblClickEvent
     * @property _hasDblClickSubscriber
     * @type boolean
     * @private
     */
    _hasDblClickSubscriber: false,
    
    /**
     * Stores the timer used to check for double clicks
     * @property _dblClickTimer
     * @type window.timer object
     * @private
     */
    _dblClickTimer: null,

  /**
     * A reference to the Node currently having the focus or null if none.
     * @property currentFocus
     * @type YAHOO.widget.Node
     */
    currentFocus: null,
    
    /**
    * If true, only one Node can be highlighted at a time
    * @property singleNodeHighlight
    * @type boolean
    * @default false
    */
    
    singleNodeHighlight: false,
    
    /**
    * A reference to the Node that is currently highlighted.
    * It is only meaningful if singleNodeHighlight is enabled
    * @property _currentlyHighlighted
    * @type YAHOO.widget.Node
    * @default null
    * @private
    */
    
    _currentlyHighlighted: null,

    /**
     * Sets up the animation for expanding children
     * @method setExpandAnim
     * @param {string} type the type of animation (acceptable values defined 
     * in YAHOO.widget.TVAnim)
     */
    setExpandAnim: function(type) {
        this._expandAnim = (Widget.TVAnim.isValid(type)) ? type : null;
    },

    /**
     * Sets up the animation for collapsing children
     * @method setCollapseAnim
     * @param {string} the type of animation (acceptable values defined in 
     * YAHOO.widget.TVAnim)
     */
    setCollapseAnim: function(type) {
        this._collapseAnim = (Widget.TVAnim.isValid(type)) ? type : null;
    },

    /**
     * Perform the expand animation if configured, or just show the
     * element if not configured or too many animations are in progress
     * @method animateExpand
     * @param el {HTMLElement} the element to animate
     * @param node {YAHOO.util.Node} the node that was expanded
     * @return {boolean} true if animation could be invoked, false otherwise
     */
    animateExpand: function(el, node) {

        if (this._expandAnim && this._animCount < this.maxAnim) {
            // this.locked = true;
            var tree = this;
            var a = Widget.TVAnim.getAnim(this._expandAnim, el, 
                            function() { tree.expandComplete(node); });
            if (a) { 
                ++this._animCount;
                this.fireEvent("animStart", {
                        "node": node, 
                        "type": "expand"
                    });
                a.animate();
            }

            return true;
        }

        return false;
    },

    /**
     * Perform the collapse animation if configured, or just show the
     * element if not configured or too many animations are in progress
     * @method animateCollapse
     * @param el {HTMLElement} the element to animate
     * @param node {YAHOO.util.Node} the node that was expanded
     * @return {boolean} true if animation could be invoked, false otherwise
     */
    animateCollapse: function(el, node) {

        if (this._collapseAnim && this._animCount < this.maxAnim) {
            // this.locked = true;
            var tree = this;
            var a = Widget.TVAnim.getAnim(this._collapseAnim, el, 
                            function() { tree.collapseComplete(node); });
            if (a) { 
                ++this._animCount;
                this.fireEvent("animStart", {
                        "node": node, 
                        "type": "collapse"
                    });
                a.animate();
            }

            return true;
        }

        return false;
    },

    /**
     * Function executed when the expand animation completes
     * @method expandComplete
     */
    expandComplete: function(node) {
        --this._animCount;
        this.fireEvent("animComplete", {
                "node": node, 
                "type": "expand"
            });
        // this.locked = false;
    },

    /**
     * Function executed when the collapse animation completes
     * @method collapseComplete
     */
    collapseComplete: function(node) {
        --this._animCount;
        this.fireEvent("animComplete", {
                "node": node, 
                "type": "collapse"
            });
        // this.locked = false;
    },

    /**
     * Initializes the tree
     * @method init
     * @parm {string|HTMLElement} id the id of the element that will hold the tree
     * @private
     */
    init: function(id) {
        this._el = Dom.get(id);
        this.id = Dom.generateId(this._el,"yui-tv-auto-id-");

    /**
         * When animation is enabled, this event fires when the animation
         * starts
         * @event animStart
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that is expanding/collapsing
         * @parm {String} type the type of animation ("expand" or "collapse")
         */
        this.createEvent("animStart", this);

        /**
         * When animation is enabled, this event fires when the animation
         * completes
         * @event animComplete
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that is expanding/collapsing
         * @parm {String} type the type of animation ("expand" or "collapse")
         */
        this.createEvent("animComplete", this);

        /**
         * Fires when a node is going to be collapsed.  Return false to stop
         * the collapse.
         * @event collapse
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that is collapsing
         */
        this.createEvent("collapse", this);

        /**
         * Fires after a node is successfully collapsed.  This event will not fire
         * if the "collapse" event was cancelled.
         * @event collapseComplete
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that was collapsed
         */
        this.createEvent("collapseComplete", this);

        /**
         * Fires when a node is going to be expanded.  Return false to stop
         * the collapse.
         * @event expand
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that is expanding
         */
        this.createEvent("expand", this);

        /**
         * Fires after a node is successfully expanded.  This event will not fire
         * if the "expand" event was cancelled.
         * @event expandComplete
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that was expanded
         */
        this.createEvent("expandComplete", this);

    /**
         * Fires when the Enter key is pressed on a node that has the focus
         * @event enterKeyPressed
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that has the focus
         */
        this.createEvent("enterKeyPressed", this);
        
    /**
         * Fires when the label in a TextNode or MenuNode or content in an HTMLNode receives a Click.
    * The listener may return false to cancel toggling and focusing on the node.
         * @event clickEvent
         * @type CustomEvent
         * @param oArgs.event  {HTMLEvent} The event object
         * @param oArgs.node {YAHOO.widget.Node} node the node that was clicked
         */
        this.createEvent("clickEvent", this);
        
    /**
         * Fires when the focus receives the focus, when it changes from a Node 
    * to another Node or when it is completely lost (blurred)
         * @event focusChanged
         * @type CustomEvent
         * @param oArgs.oldNode  {YAHOO.widget.Node} Node that had the focus or null if none
         * @param oArgs.newNode {YAHOO.widget.Node} Node that receives the focus or null if none
         */
        
        this.createEvent('focusChanged',this);

    /**
         * Fires when the label in a TextNode or MenuNode or content in an HTMLNode receives a double Click
         * @event dblClickEvent
         * @type CustomEvent
         * @param oArgs.event  {HTMLEvent} The event object
         * @param oArgs.node {YAHOO.widget.Node} node the node that was clicked
         */
        var self = this;
        this.createEvent("dblClickEvent", {
            scope:this,
            onSubscribeCallback: function() {
                self._hasDblClickSubscriber = true;
            }
        });
        
    /**
         * Custom event that is fired when the text node label is clicked. 
         *  The node clicked is  provided as an argument
         *
         * @event labelClick
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node clicked
    * @deprecated use clickEvent or dblClickEvent
         */
        this.createEvent("labelClick", this);
        
    /**
     * Custom event fired when the highlight of a node changes.
     * The node that triggered the change is provided as an argument:
     * The status of the highlight can be checked in 
     * <a href="YAHOO.widget.Node.html#property_highlightState">nodeRef.highlightState</a>.
     * Depending on <a href="YAHOO.widget.Node.html#property_propagateHighlight">nodeRef.propagateHighlight</a>, other nodes might have changed
     * @event highlightEvent
     * @type CustomEvent
        * @param node{YAHOO.widget.Node} the node that started the change in highlighting state
    */
        this.createEvent("highlightEvent",this);
     


        this._nodes = [];

        // store a global reference
        TV.trees[this.id] = this;

        // Set up the root node
        this.root = new Widget.RootNode(this);

        var LW = Widget.LogWriter;


        
        // YAHOO.util.Event.onContentReady(this.id, this.handleAvailable, this, true);
        // YAHOO.util.Event.on(this.id, "click", this.handleClick, this, true);
    },

    //handleAvailable: function() {
        //var Event = YAHOO.util.Event;
        //Event.on(this.id, 
    //},
 /**
     * Builds the TreeView from an object.  
     * This is the method called by the constructor to build the tree when it has a second argument.
     *  A tree can be described by an array of objects, each object corresponding to a node.
     *  Node descriptions may contain values for any property of a node plus the following extra properties: <ul>
     * <li>type:  can be one of the following:<ul>
     *  <li> A shortname for a node type (<code>'text','menu','html'</code>) </li>
     * <li>The name of a Node class under YAHOO.widget (<code>'TextNode', 'MenuNode', 'DateNode'</code>, etc) </li>
     * <li>a reference to an actual class: <code>YAHOO.widget.DateNode</code></li></ul></li>
     * <li>children: an array containing further node definitions</li></ul>
     * @method buildTreeFromObject
     * @param  oConfig {Array}  array containing a full description of the tree
     * 
     */
    buildTreeFromObject: function (oConfig) {
        var build = function (parent, oConfig) {
            var i, item, node, children, type, NodeType, ThisType;
            for (i = 0; i < oConfig.length; i++) {
                item = oConfig[i];
                if (Lang.isString(item)) {
                    node = new Widget.TextNode(item, parent);
                } else if (Lang.isObject(item)) {
                    children = item.children;
                    delete item.children;
                    type = item.type || 'text';
                    delete item.type;
                    switch (Lang.isString(type) && type.toLowerCase()) {
                        case 'text':
                            node = new Widget.TextNode(item, parent);
                            break;
                        case 'menu':
                            node = new Widget.MenuNode(item, parent);
                            break;
                        case 'html':
                            node = new Widget.HTMLNode(item, parent);
                            break;
                        default:
                            if (Lang.isString(type)) {
                                NodeType = Widget[type];
                            } else {
                                NodeType = type;
                            }
                            if (Lang.isObject(NodeType)) {
                                for (ThisType = NodeType; ThisType && ThisType !== Widget.Node; ThisType = ThisType.superclass.constructor) {}
                                if (ThisType) {
                                    node = new NodeType(item, parent);
                                } else {
                                }
                            } else {
                            }
                    }
                    if (children) {
                        build(node,children);
                    }
                } else {
                }
            }
        };
                            
                    
        build(this.root,oConfig);
    },
/**
     * Builds the TreeView from existing markup.   Markup should consist of &lt;UL&gt; or &lt;OL&gt; elements containing &lt;LI&gt; elements.  
     * Each &lt;LI&gt; can have one element used as label and a second optional element which is to be a &lt;UL&gt; or &lt;OL&gt;
     * containing nested nodes.
     * Depending on what the first element of the &lt;LI&gt; element is, the following Nodes will be created: <ul>
     *           <li>plain text:  a regular TextNode</li>
     *           <li>anchor &lt;A&gt;: a TextNode with its <code>href</code> and <code>target</code> taken from the anchor</li>
     *           <li>anything else: an HTMLNode</li></ul>
     * Only the first  outermost (un-)ordered list in the markup and its children will be parsed.
     * Nodes will be collapsed unless  an  &lt;LI&gt;  tag has a className called 'expanded'.
     * All other className attributes will be copied over to the Node className property.
     * If the &lt;LI&gt; element contains an attribute called <code>yuiConfig</code>, its contents should be a JSON-encoded object
     * as the one used in method <a href="#method_buildTreeFromObject">buildTreeFromObject</a>.
     * @method buildTreeFromMarkup
     * @param  id{string|HTMLElement} The id of the element that contains the markup or a reference to it.
     */
    buildTreeFromMarkup: function (id) {
        var build = function (markup) {
            var el, child, branch = [], config = {}, label, yuiConfig;
            // Dom's getFirstChild and getNextSibling skip over text elements
            for (el = Dom.getFirstChild(markup); el; el = Dom.getNextSibling(el)) {
                switch (el.tagName.toUpperCase()) {
                    case 'LI':
                        label = '';
                        config = {
                            expanded: Dom.hasClass(el,'expanded'),
                            title: el.title || el.alt || null,
                            className: Lang.trim(el.className.replace(/\bexpanded\b/,'')) || null
                        };
                        // I cannot skip over text elements here because I want them for labels
                        child = el.firstChild;
                        if (child.nodeType == 3) {
                            // nodes with only whitespace, tabs and new lines don't count, they are probably just formatting.
                            label = Lang.trim(child.nodeValue.replace(/[\n\t\r]*/g,''));
                            if (label) {
                                config.type = 'text';
                                config.label = label;
                            } else {
                                child = Dom.getNextSibling(child);
                            }
                        }
                        if (!label) {
                            if (child.tagName.toUpperCase() == 'A') {
                                config.type = 'text';
                                config.label = child.innerHTML;
                                config.href = child.href;
                                config.target = child.target;
                                config.title = child.title || child.alt || config.title;
                            } else {
                                config.type = 'html';
                                var d = document.createElement('div');
                                d.appendChild(child.cloneNode(true));
                                config.html = d.innerHTML;
                                config.hasIcon = true;
                            }
                        }
                        // see if after the label it has a further list which will become children of this node.
                        child = Dom.getNextSibling(child);
                        switch (child && child.tagName.toUpperCase()) {
                            case 'UL':
                            case 'OL':
                                config.children = build(child);
                                break;
                        }
                        // if there are further elements or text, it will be ignored.
                        
                        if (YAHOO.lang.JSON) {
                            yuiConfig = el.getAttribute('yuiConfig');
                            if (yuiConfig) {
                                yuiConfig = YAHOO.lang.JSON.parse(yuiConfig);
                                config = YAHOO.lang.merge(config,yuiConfig);
                            }
                        }
                        
                        branch.push(config);
                        break;
                    case 'UL':
                    case 'OL':
                        config = {
                            type: 'text',
                            label: '',
                            children: build(child)
                        };
                        branch.push(config);
                        break;
                }
            }
            return branch;
        };

        var markup = Dom.getChildrenBy(Dom.get(id),function (el) { 
            var tag = el.tagName.toUpperCase();
            return  tag == 'UL' || tag == 'OL';
        });
        if (markup.length) {
            this.buildTreeFromObject(build(markup[0]));
        } else {
        }
    },
  /**
     * Returns the TD element where the event has occurred
     * @method _getEventTargetTdEl
     * @private
     */
    _getEventTargetTdEl: function (ev) {
        var target = Event.getTarget(ev); 
        // go up looking for a TD with a className with a ygtv prefix
        while (target && !(target.tagName.toUpperCase() == 'TD' && Dom.hasClass(target.parentNode,'ygtvrow'))) { 
            target = Dom.getAncestorByTagName(target,'td'); 
        }
        if (Lang.isNull(target)) { return null; }
        // If it is a spacer cell, do nothing
        if (/\bygtv(blank)?depthcell/.test(target.className)) { return null;}
        // If it has an id, search for the node number and see if it belongs to a node in this tree.
        if (target.id) {
            var m = target.id.match(/\bygtv([^\d]*)(.*)/);
            if (m && m[2] && this._nodes[m[2]]) {
                return target;
            }
        }
        return null;
    },
  /**
     * Event listener for click events
     * @method _onClickEvent
     * @private
     */
    _onClickEvent: function (ev) {
        var self = this,
            td = this._getEventTargetTdEl(ev),
            node,
            target,
            toggle = function () {
                node.toggle();
                node.focus();
                try {
                    Event.preventDefault(ev);
                } catch (e) {
                    // @TODO
                    // For some reason IE8 is providing an event object with
                    // most of the fields missing, but only when clicking on
                    // the node's label, and only when working with inline
                    // editing.  This generates a "Member not found" error
                    // in that browser.  Determine if this is a browser
                    // bug, or a problem with this code.  Already checked to
                    // see if the problem has to do with access the event
                    // in the outer scope, and that isn't the problem.
                    // Maybe the markup for inline editing is broken.
                }
            };

        if (!td) {
            return; 
        }

        node = this.getNodeByElement(td);
        if (!node) { 
            return; 
        }
        
        // exception to handle deprecated event labelClick
        // @TODO take another look at this deprecation.  It is common for people to
        // only be interested in the label click, so why make them have to test
        // the node type to figure out whether the click was on the label?
        target = Event.getTarget(ev);
        if (Dom.hasClass(target, node.labelStyle) || Dom.getAncestorByClassName(target,node.labelStyle)) {
            this.fireEvent('labelClick',node);
        }
        
        //  If it is a toggle cell, toggle
        if (/\bygtv[tl][mp]h?h?/.test(td.className)) {
            toggle();
        } else {
            if (this._dblClickTimer) {
                window.clearTimeout(this._dblClickTimer);
                this._dblClickTimer = null;
            } else {
                if (this._hasDblClickSubscriber) {
                    this._dblClickTimer = window.setTimeout(function () {
                        self._dblClickTimer = null;
                        if (self.fireEvent('clickEvent', {event:ev,node:node}) !== false) { 
                            toggle();
                        }
                    }, 200);
                } else {
                    if (self.fireEvent('clickEvent', {event:ev,node:node}) !== false) { 
                        //toggle();
                    }
                }
            }
        }
    },

  /**
     * Event listener for double-click events
     * @method _onDblClickEvent
     * @private
     */
    _onDblClickEvent: function (ev) {
        if (!this._hasDblClickSubscriber) { return; }
        var td = this._getEventTargetTdEl(ev);
        if (!td) {return;}

        if (!(/\bygtv[tl][mp]h?h?/.test(td.className))) {
            this.fireEvent('dblClickEvent', {event:ev, node:this.getNodeByElement(td)}); 
            if (this._dblClickTimer) {
                window.clearTimeout(this._dblClickTimer);
                this._dblClickTimer = null;
            }
        }
    },
  /**
     * Event listener for mouse over events
     * @method _onMouseOverEvent
     * @private
     */
    _onMouseOverEvent:function (ev) {
        var target;
        if ((target = this._getEventTargetTdEl(ev)) && (target = this.getNodeByElement(target)) && (target = target.getToggleEl())) {
            target.className = target.className.replace(/\bygtv([lt])([mp])\b/gi,'ygtv$1$2h');
        }
    },
  /**
     * Event listener for mouse out events
     * @method _onMouseOutEvent
     * @private
     */
    _onMouseOutEvent: function (ev) {
        var target;
        if ((target = this._getEventTargetTdEl(ev)) && (target = this.getNodeByElement(target)) && (target = target.getToggleEl())) {
            target.className = target.className.replace(/\bygtv([lt])([mp])h\b/gi,'ygtv$1$2');
        }
    },
  /**
     * Event listener for key down events
     * @method _onKeyDownEvent
     * @private
     */
    _onKeyDownEvent: function (ev) {
        var target = Event.getTarget(ev),
            node = this.getNodeByElement(target),
            newNode = node,
            KEY = YAHOO.util.KeyListener.KEY;

        switch(ev.keyCode) {
            case KEY.UP:
                do {
                    if (newNode.previousSibling) {
                        newNode = newNode.previousSibling;
                    } else {
                        newNode = newNode.parent;
                    }
                } while (newNode && !newNode._canHaveFocus());
                if (newNode) { newNode.focus(); }
                Event.preventDefault(ev);
                break;
            case KEY.DOWN:
                do {
                    if (newNode.nextSibling) {
                        newNode = newNode.nextSibling;
                    } else {
                        newNode.expand();
                        newNode = (newNode.children.length || null) && newNode.children[0];
                    }
                } while (newNode && !newNode._canHaveFocus);
                if (newNode) { newNode.focus();}
                Event.preventDefault(ev);
                break;
            case KEY.LEFT:
                do {
                    if (newNode.parent) {
                        newNode = newNode.parent;
                    } else {
                        newNode = newNode.previousSibling;
                    }
                } while (newNode && !newNode._canHaveFocus());
                if (newNode) { newNode.focus();}
                Event.preventDefault(ev);
                break;
            case KEY.RIGHT:
                do {
                    newNode.expand();
                    if (newNode.children.length) {
                        newNode = newNode.children[0];
                    } else {
                        newNode = newNode.nextSibling;
                    }
                } while (newNode && !newNode._canHaveFocus());
                if (newNode) { newNode.focus();}
                Event.preventDefault(ev);
                break;
            case KEY.ENTER:
                if (node.href) {
                    if (node.target) {
                        window.open(node.href,node.target);
                    } else {
                        window.location(node.href);
                    }
                } else {
                    node.toggle();
                }
                this.fireEvent('enterKeyPressed',node);
                Event.preventDefault(ev);
                break;
            case KEY.HOME:
                newNode = this.getRoot();
                if (newNode.children.length) {newNode = newNode.children[0];}
                if (newNode._canHaveFocus()) { newNode.focus(); }
                Event.preventDefault(ev);
                break;
            case KEY.END:
                newNode = newNode.parent.children;
                newNode = newNode[newNode.length -1];
                if (newNode._canHaveFocus()) { newNode.focus(); }
                Event.preventDefault(ev);
                break;
            // case KEY.PAGE_UP:
                // break;
            // case KEY.PAGE_DOWN:
                // break;
            case 107:  // plus key
                if (ev.shiftKey) {
                    node.parent.expandAll();
                } else {
                    node.expand();
                }
                break;
            case 109: // minus key
                if (ev.shiftKey) {
                    node.parent.collapseAll();
                } else {
                    node.collapse();
                }
                break;
            default:
                break;
        }
    },
    /**
     * Renders the tree boilerplate and visible nodes
     * @method render
     */
    render: function() {
        var html = this.root.getHtml(),
            el = this.getEl();
        el.innerHTML = html;
        if (!this._hasEvents) {
            Event.on(el, 'click', this._onClickEvent, this, true);
            Event.on(el, 'dblclick', this._onDblClickEvent, this, true);
            Event.on(el, 'mouseover', this._onMouseOverEvent, this, true);
            Event.on(el, 'mouseout', this._onMouseOutEvent, this, true);
            Event.on(el, 'keydown', this._onKeyDownEvent, this, true);
        }
        this._hasEvents = true;
    },
    
  /**
     * Returns the tree's host element
     * @method getEl
     * @return {HTMLElement} the host element
     */
    getEl: function() {
        if (! this._el) {
            this._el = Dom.get(this.id);
        }
        return this._el;
    },

    /**
     * Nodes register themselves with the tree instance when they are created.
     * @method regNode
     * @param node {Node} the node to register
     * @private
     */
    regNode: function(node) {
        this._nodes[node.index] = node;
    },

    /**
     * Returns the root node of this tree
     * @method getRoot
     * @return {Node} the root node
     */
    getRoot: function() {
        return this.root;
    },

    /**
     * Configures this tree to dynamically load all child data
     * @method setDynamicLoad
     * @param {function} fnDataLoader the function that will be called to get the data
     * @param iconMode {int} configures the icon that is displayed when a dynamic
     * load node is expanded the first time without children.  By default, the 
     * "collapse" icon will be used.  If set to 1, the leaf node icon will be
     * displayed.
     */
    setDynamicLoad: function(fnDataLoader, iconMode) { 
        this.root.setDynamicLoad(fnDataLoader, iconMode);
    },

    /**
     * Expands all child nodes.  Note: this conflicts with the "multiExpand"
     * node property.  If expand all is called in a tree with nodes that
     * do not allow multiple siblings to be displayed, only the last sibling
     * will be expanded.
     * @method expandAll
     */
    expandAll: function() { 
        if (!this.locked) {
            this.root.expandAll(); 
        }
    },

    /**
     * Collapses all expanded child nodes in the entire tree.
     * @method collapseAll
     */
    collapseAll: function() { 
        if (!this.locked) {
            this.root.collapseAll(); 
        }
    },

    /**
     * Returns a node in the tree that has the specified index (this index
     * is created internally, so this function probably will only be used
     * in html generated for a given node.)
     * @method getNodeByIndex
     * @param {int} nodeIndex the index of the node wanted
     * @return {Node} the node with index=nodeIndex, null if no match
     */
    getNodeByIndex: function(nodeIndex) {
        var n = this._nodes[nodeIndex];
        return (n) ? n : null;
    },

    /**
     * Returns a node that has a matching property and value in the data
     * object that was passed into its constructor.
     * @method getNodeByProperty
     * @param {object} property the property to search (usually a string)
     * @param {object} value the value we want to find (usuall an int or string)
     * @return {Node} the matching node, null if no match
     */
    getNodeByProperty: function(property, value) {
        for (var i in this._nodes) {
            if (this._nodes.hasOwnProperty(i)) {
                var n = this._nodes[i];
                if ((property in n && n[property] == value) || (n.data && value == n.data[property])) {
                    return n;
                }
            }
        }

        return null;
    },

    /**
     * Returns a collection of nodes that have a matching property 
     * and value in the data object that was passed into its constructor.  
     * @method getNodesByProperty
     * @param {object} property the property to search (usually a string)
     * @param {object} value the value we want to find (usuall an int or string)
     * @return {Array} the matching collection of nodes, null if no match
     */
    getNodesByProperty: function(property, value) {
        var values = [];
        for (var i in this._nodes) {
            if (this._nodes.hasOwnProperty(i)) {
                var n = this._nodes[i];
                if ((property in n && n[property] == value) || (n.data && value == n.data[property])) {
                    values.push(n);
                }
            }
        }

        return (values.length) ? values : null;
    },

    /**
     * Returns the treeview node reference for an anscestor element
     * of the node, or null if it is not contained within any node
     * in this tree.
     * @method getNodeByElement
     * @param {HTMLElement} the element to test
     * @return {YAHOO.widget.Node} a node reference or null
     */
    getNodeByElement: function(el) {

        var p=el, m, re=/ygtv([^\d]*)(.*)/;

        do {

            if (p && p.id) {
                m = p.id.match(re);
                if (m && m[2]) {
                    return this.getNodeByIndex(m[2]);
                }
            }

            p = p.parentNode;

            if (!p || !p.tagName) {
                break;
            }

        } 
        while (p.id !== this.id && p.tagName.toLowerCase() !== "body");

        return null;
    },

    /**
     * Removes the node and its children, and optionally refreshes the 
     * branch of the tree that was affected.
     * @method removeNode
     * @param {Node} The node to remove
     * @param {boolean} autoRefresh automatically refreshes branch if true
     * @return {boolean} False is there was a problem, true otherwise.
     */
    removeNode: function(node, autoRefresh) { 

        // Don't delete the root node
        if (node.isRoot()) {
            return false;
        }

        // Get the branch that we may need to refresh
        var p = node.parent;
        if (p.parent) {
            p = p.parent;
        }

        // Delete the node and its children
        this._deleteNode(node);

        // Refresh the parent of the parent
        if (autoRefresh && p && p.childrenRendered) {
            p.refresh();
        }

        return true;
    },

    /**
     * wait until the animation is complete before deleting 
     * to avoid javascript errors
     * @method _removeChildren_animComplete
     * @param o the custom event payload
     * @private
     */
    _removeChildren_animComplete: function(o) {
        this.unsubscribe(this._removeChildren_animComplete);
        this.removeChildren(o.node);
    },

    /**
     * Deletes this nodes child collection, recursively.  Also collapses
     * the node, and resets the dynamic load flag.  The primary use for
     * this method is to purge a node and allow it to fetch its data
     * dynamically again.
     * @method removeChildren
     * @param {Node} node the node to purge
     */
    removeChildren: function(node) { 

        if (node.expanded) {
            // wait until the animation is complete before deleting to
            // avoid javascript errors
            if (this._collapseAnim) {
                this.subscribe("animComplete", 
                        this._removeChildren_animComplete, this, true);
                Widget.Node.prototype.collapse.call(node);
                return;
            }

            node.collapse();
        }

        while (node.children.length) {
            this._deleteNode(node.children[0]);
        }

        if (node.isRoot()) {
            Widget.Node.prototype.expand.call(node);
        }

        node.childrenRendered = false;
        node.dynamicLoadComplete = false;

        node.updateIcon();
    },

    /**
     * Deletes the node and recurses children
     * @method _deleteNode
     * @private
     */
    _deleteNode: function(node) { 
        // Remove all the child nodes first
        this.removeChildren(node);

        // Remove the node from the tree
        this.popNode(node);
    },

    /**
     * Removes the node from the tree, preserving the child collection 
     * to make it possible to insert the branch into another part of the 
     * tree, or another tree.
     * @method popNode
     * @param {Node} the node to remove
     */
    popNode: function(node) { 
        var p = node.parent;

        // Update the parent's collection of children
        var a = [];

        for (var i=0, len=p.children.length;i<len;++i) {
            if (p.children[i] != node) {
                a[a.length] = p.children[i];
            }
        }

        p.children = a;

        // reset the childrenRendered flag for the parent
        p.childrenRendered = false;

         // Update the sibling relationship
        if (node.previousSibling) {
            node.previousSibling.nextSibling = node.nextSibling;
        }

        if (node.nextSibling) {
            node.nextSibling.previousSibling = node.previousSibling;
        }

        node.parent = null;
        node.previousSibling = null;
        node.nextSibling = null;
        node.tree = null;

        // Update the tree's node collection 
        delete this._nodes[node.index];
    },

    /**
    * Nulls out the entire TreeView instance and related objects, removes attached
    * event listeners, and clears out DOM elements inside the container. After
    * calling this method, the instance reference should be expliclitly nulled by
    * implementer, as in myDataTable = null. Use with caution!
    *
    * @method destroy
    */
    destroy : function() {
        // Since the label editor can be separated from the main TreeView control
        // the destroy method for it might not be there.
        if (this._destroyEditor) { this._destroyEditor(); }
        var el = this.getEl();
        Event.removeListener(el,'click');
        Event.removeListener(el,'dblclick');
        Event.removeListener(el,'mouseover');
        Event.removeListener(el,'mouseout');
        Event.removeListener(el,'keydown');
        for (var i = 0 ; i < this._nodes.length; i++) {
            var node = this._nodes[i];
            if (node && node.destroy) {node.destroy(); }
        }
        el.innerHTML = '';
        this._hasEvents = false;
    },
        
            


    /**
     * TreeView instance toString
     * @method toString
     * @return {string} string representation of the tree
     */
    toString: function() {
        return "TreeView " + this.id;
    },

    /**
     * Count of nodes in tree
     * @method getNodeCount
     * @return {int} number of nodes in the tree
     */
    getNodeCount: function() {
        return this.getRoot().getNodeCount();
    },

    /**
     * Returns an object which could be used to rebuild the tree.
     * It can be passed to the tree constructor to reproduce the same tree.
     * It will return false if any node loads dynamically, regardless of whether it is loaded or not.
     * @method getTreeDefinition
     * @return {Object | false}  definition of the tree or false if any node is defined as dynamic
     */
    getTreeDefinition: function() {
        return this.getRoot().getNodeDefinition();
    },

    /**
     * Abstract method that is executed when a node is expanded
     * @method onExpand
     * @param node {Node} the node that was expanded
     * @deprecated use treeobj.subscribe("expand") instead
     */
    onExpand: function(node) { },

    /**
     * Abstract method that is executed when a node is collapsed.
     * @method onCollapse
     * @param node {Node} the node that was collapsed.
     * @deprecated use treeobj.subscribe("collapse") instead
     */
    onCollapse: function(node) { },
    
    /**
    * Sets the value of a property for all loaded nodes in the tree.
    * @method setNodesProperty
    * @param name {string} Name of the property to be set
    * @param value {any} value to be set
    * @param refresh {boolean} if present and true, it does a refresh
    */
    setNodesProperty: function(name, value, refresh) {
        this.root.setNodesProperty(name,value);
        if (refresh) {
            this.root.refresh();
        }
    },
    /**
    * Event listener to toggle node highlight.
    * Can be assigned as listener to clickEvent, dblClickEvent and enterKeyPressed.
    * It returns false to prevent the default action.
    * @method onEventToggleHighlight
    * @param oArgs {any} it takes the arguments of any of the events mentioned above
    * @return {false} Always cancels the default action for the event
    */
    onEventToggleHighlight: function (oArgs) {
        var node;
        if ('node' in oArgs && oArgs.node instanceof Widget.Node) {
            node = oArgs.node;
        } else if (oArgs instanceof Widget.Node) {
            node = oArgs;
        } else {
            return false;
        }
        node.toggleHighlight();
        return false;
    }
        

};

/* Backwards compatibility aliases */
var PROT = TV.prototype;
 /**
     * Renders the tree boilerplate and visible nodes.
     *  Alias for render
     * @method draw
     * @deprecated Use render instead
     */
PROT.draw = PROT.render;

/* end backwards compatibility aliases */

YAHOO.augment(TV, YAHOO.util.EventProvider);

/**
 * Running count of all nodes created in all trees.  This is 
 * used to provide unique identifies for all nodes.  Deleting
 * nodes does not change the nodeCount.
 * @property YAHOO.widget.TreeView.nodeCount
 * @type int
 * @static
 */
TV.nodeCount = 0;

/**
 * Global cache of tree instances
 * @property YAHOO.widget.TreeView.trees
 * @type Array
 * @static
 * @private
 */
TV.trees = [];

/**
 * Global method for getting a tree by its id.  Used in the generated
 * tree html.
 * @method YAHOO.widget.TreeView.getTree
 * @param treeId {String} the id of the tree instance
 * @return {TreeView} the tree instance requested, null if not found.
 * @static
 */
TV.getTree = function(treeId) {
    var t = TV.trees[treeId];
    return (t) ? t : null;
};


/**
 * Global method for getting a node by its id.  Used in the generated
 * tree html.
 * @method YAHOO.widget.TreeView.getNode
 * @param treeId {String} the id of the tree instance
 * @param nodeIndex {String} the index of the node to return
 * @return {Node} the node instance requested, null if not found
 * @static
 */
TV.getNode = function(treeId, nodeIndex) {
    var t = TV.getTree(treeId);
    return (t) ? t.getNodeByIndex(nodeIndex) : null;
};


/**
     * Class name assigned to elements that have the focus
     *
     * @property TreeView.FOCUS_CLASS_NAME
     * @type String
     * @static
     * @final
     * @default "ygtvfocus"

    */ 
TV.FOCUS_CLASS_NAME = 'ygtvfocus';

/**
 * Attempts to preload the images defined in the styles used to draw the tree by
 * rendering off-screen elements that use the styles.
 * @method YAHOO.widget.TreeView.preload
 * @param {string} prefix the prefix to use to generate the names of the
 * images to preload, default is ygtv
 * @static
 */
TV.preload = function(e, prefix) {
    prefix = prefix || "ygtv";


    var styles = ["tn","tm","tmh","tp","tph","ln","lm","lmh","lp","lph","loading"];
    // var styles = ["tp"];

    var sb = [];
    
    // save the first one for the outer container
    for (var i=1; i < styles.length; i=i+1) { 
        sb[sb.length] = '<span class="' + prefix + styles[i] + '">&#160;</span>';
    }

    var f = document.createElement("div");
    var s = f.style;
    s.className = prefix + styles[0];
    s.position = "absolute";
    s.height = "1px";
    s.width = "1px";
    s.top = "-1000px";
    s.left = "-1000px";
    f.innerHTML = sb.join("");

    document.body.appendChild(f);

    Event.removeListener(window, "load", TV.preload);

};

Event.addListener(window,"load", TV.preload);
})();
(function () {
    var Dom = YAHOO.util.Dom,
        Lang = YAHOO.lang,
        Event = YAHOO.util.Event;
/**
 * The base class for all tree nodes.  The node's presentation and behavior in
 * response to mouse events is handled in Node subclasses.
 * @namespace YAHOO.widget
 * @class Node
 * @uses YAHOO.util.EventProvider
 * @param oData {object} a string or object containing the data that will
 * be used to render this node, and any custom attributes that should be
 * stored with the node (which is available in noderef.data).
 * All values in oData will be used to set equally named properties in the node
 * as long as the node does have such properties, they are not undefined, private or functions,
 * the rest of the values will be stored in noderef.data
 * @param oParent {Node} this node's parent node
 * @param expanded {boolean} the initial expanded/collapsed state (deprecated, use oData.expanded)
 * @constructor
 */
YAHOO.widget.Node = function(oData, oParent, expanded) {
    if (oData) { this.init(oData, oParent, expanded); }
};

YAHOO.widget.Node.prototype = {

    /**
     * The index for this instance obtained from global counter in YAHOO.widget.TreeView.
     * @property index
     * @type int
     */
    index: 0,

    /**
     * This node's child node collection.
     * @property children
     * @type Node[] 
     */
    children: null,

    /**
     * Tree instance this node is part of
     * @property tree
     * @type TreeView
     */
    tree: null,

    /**
     * The data linked to this node.  This can be any object or primitive
     * value, and the data can be used in getNodeHtml().
     * @property data
     * @type object
     */
    data: null,

    /**
     * Parent node
     * @property parent
     * @type Node
     */
    parent: null,

    /**
     * The depth of this node.  We start at -1 for the root node.
     * @property depth
     * @type int
     */
    depth: -1,

    /**
     * The node's expanded/collapsed state
     * @property expanded
     * @type boolean
     */
    expanded: false,

    /**
     * Can multiple children be expanded at once?
     * @property multiExpand
     * @type boolean
     */
    multiExpand: true,

    /**
     * Should we render children for a collapsed node?  It is possible that the
     * implementer will want to render the hidden data...  @todo verify that we 
     * need this, and implement it if we do.
     * @property renderHidden
     * @type boolean
     */
    renderHidden: false,

    /**
     * This flag is set to true when the html is generated for this node's
     * children, and set to false when new children are added.
     * @property childrenRendered
     * @type boolean
     */
    childrenRendered: false,

    /**
     * Dynamically loaded nodes only fetch the data the first time they are
     * expanded.  This flag is set to true once the data has been fetched.
     * @property dynamicLoadComplete
     * @type boolean
     */
    dynamicLoadComplete: false,

    /**
     * This node's previous sibling
     * @property previousSibling
     * @type Node
     */
    previousSibling: null,

    /**
     * This node's next sibling
     * @property nextSibling
     * @type Node
     */
    nextSibling: null,

    /**
     * We can set the node up to call an external method to get the child
     * data dynamically.
     * @property _dynLoad
     * @type boolean
     * @private
     */
    _dynLoad: false,

    /**
     * Function to execute when we need to get this node's child data.
     * @property dataLoader
     * @type function
     */
    dataLoader: null,

    /**
     * This is true for dynamically loading nodes while waiting for the
     * callback to return.
     * @property isLoading
     * @type boolean
     */
    isLoading: false,

    /**
     * The toggle/branch icon will not show if this is set to false.  This
     * could be useful if the implementer wants to have the child contain
     * extra info about the parent, rather than an actual node.
     * @property hasIcon
     * @type boolean
     */
    hasIcon: true,

    /**
     * Used to configure what happens when a dynamic load node is expanded
     * and we discover that it does not have children.  By default, it is
     * treated as if it still could have children (plus/minus icon).  Set
     * iconMode to have it display like a leaf node instead.
     * @property iconMode
     * @type int
     */
    iconMode: 0,

    /**
     * Specifies whether or not the content area of the node should be allowed
     * to wrap.
     * @property nowrap
     * @type boolean
     * @default false
     */
    nowrap: false,

 /**
     * If true, the node will alway be rendered as a leaf node.  This can be
     * used to override the presentation when dynamically loading the entire
     * tree.  Setting this to true also disables the dynamic load call for the
     * node.
     * @property isLeaf
     * @type boolean
     * @default false
     */
    isLeaf: false,

/**
     * The CSS class for the html content container.  Defaults to ygtvhtml, but 
     * can be overridden to provide a custom presentation for a specific node.
     * @property contentStyle
     * @type string
     */
    contentStyle: "",


    /**
     * The generated id that will contain the data passed in by the implementer.
     * @property contentElId
     * @type string
     */
    contentElId: null,
    
/** 
 * Enables node highlighting.  If true, the node can be highlighted and/or propagate highlighting
 * @property enableHighlight
 * @type boolean
 * @default true
 */
    enableHighlight: false,
    
/** 
 * Stores the highlight state.  Can be any of:
 * <ul>
 * <li>0 - not highlighted</li>
 * <li>1 - highlighted</li>
 * <li>2 - some children highlighted</li>
 * </ul>
 * @property highlightState
 * @type integer
 * @default 0
 */
 
 highlightState: 0,
 
 /**
 * Tells whether highlighting will be propagated up to the parents of the clicked node
 * @property propagateHighlightUp
 * @type boolean
 * @default false
 */
 
 propagateHighlightUp: false,
 
 /**
 * Tells whether highlighting will be propagated down to the children of the clicked node
 * @property propagateHighlightDown
 * @type boolean
 * @default false
 */
 
 propagateHighlightDown: false,
 
 /**
  * User-defined className to be added to the Node
  * @property className
  * @type string
  * @default null
  */
 
 className: null,
 
 /**
     * The node type
     * @property _type
     * @private
     * @type string
     * @default "Node"
*/
    _type: "Node",

    /*
    spacerPath: "http://us.i1.yimg.com/us.yimg.com/i/space.gif",
    expandedText: "Expanded",
    collapsedText: "Collapsed",
    loadingText: "Loading",
    */

    /**
     * Initializes this node, gets some of the properties from the parent
     * @method init
     * @param oData {object} a string or object containing the data that will
     * be used to render this node
     * @param oParent {Node} this node's parent node
     * @param expanded {boolean} the initial expanded/collapsed state
     */
    init: function(oData, oParent, expanded) {

        this.data = {};
        this.children   = [];
        this.index      = YAHOO.widget.TreeView.nodeCount;
        ++YAHOO.widget.TreeView.nodeCount;
        this.contentElId = "ygtvcontentel" + this.index;
        
        if (Lang.isObject(oData)) {
            for (var property in oData) {
                if (oData.hasOwnProperty(property)) {
                    if (property.charAt(0) != '_'  && !Lang.isUndefined(this[property]) && !Lang.isFunction(this[property]) ) {
                        this[property] = oData[property];
                    } else {
                        this.data[property] = oData[property];
                    }
                }
            }
        }
        if (!Lang.isUndefined(expanded) ) { this.expanded  = expanded;  }
        

        /**
         * The parentChange event is fired when a parent element is applied
         * to the node.  This is useful if you need to apply tree-level
         * properties to a tree that need to happen if a node is moved from
         * one tree to another.
         *
         * @event parentChange
         * @type CustomEvent
         */
        this.createEvent("parentChange", this);

        // oParent should never be null except when we create the root node.
        if (oParent) {
            oParent.appendChild(this);
        }
    },

    /**
     * Certain properties for the node cannot be set until the parent
     * is known. This is called after the node is inserted into a tree.
     * the parent is also applied to this node's children in order to
     * make it possible to move a branch from one tree to another.
     * @method applyParent
     * @param {Node} parentNode this node's parent node
     * @return {boolean} true if the application was successful
     */
    applyParent: function(parentNode) {
        if (!parentNode) {
            return false;
        }

        this.tree   = parentNode.tree;
        this.parent = parentNode;
        this.depth  = parentNode.depth + 1;

        // @todo why was this put here.  This causes new nodes added at the
        // root level to lose the menu behavior.
        // if (! this.multiExpand) {
            // this.multiExpand = parentNode.multiExpand;
        // }

        this.tree.regNode(this);
        parentNode.childrenRendered = false;

        // cascade update existing children
        for (var i=0, len=this.children.length;i<len;++i) {
            this.children[i].applyParent(this);
        }

        this.fireEvent("parentChange");

        return true;
    },

    /**
     * Appends a node to the child collection.
     * @method appendChild
     * @param childNode {Node} the new node
     * @return {Node} the child node
     * @private
     */
    appendChild: function(childNode) {
        if (this.hasChildren()) {
            var sib = this.children[this.children.length - 1];
            sib.nextSibling = childNode;
            childNode.previousSibling = sib;
        }
        this.children[this.children.length] = childNode;
        childNode.applyParent(this);

        // part of the IE display issue workaround. If child nodes
        // are added after the initial render, and the node was
        // instantiated with expanded = true, we need to show the
        // children div now that the node has a child.
        if (this.childrenRendered && this.expanded) {
            this.getChildrenEl().style.display = "";
        }

        return childNode;
    },

    /**
     * Appends this node to the supplied node's child collection
     * @method appendTo
     * @param parentNode {Node} the node to append to.
     * @return {Node} The appended node
     */
    appendTo: function(parentNode) {
        return parentNode.appendChild(this);
    },

    /**
    * Inserts this node before this supplied node
    * @method insertBefore
    * @param node {Node} the node to insert this node before
    * @return {Node} the inserted node
    */
    insertBefore: function(node) {
        var p = node.parent;
        if (p) {

            if (this.tree) {
                this.tree.popNode(this);
            }

            var refIndex = node.isChildOf(p);
            p.children.splice(refIndex, 0, this);
            if (node.previousSibling) {
                node.previousSibling.nextSibling = this;
            }
            this.previousSibling = node.previousSibling;
            this.nextSibling = node;
            node.previousSibling = this;

            this.applyParent(p);
        }

        return this;
    },
 
    /**
    * Inserts this node after the supplied node
    * @method insertAfter
    * @param node {Node} the node to insert after
    * @return {Node} the inserted node
    */
    insertAfter: function(node) {
        var p = node.parent;
        if (p) {

            if (this.tree) {
                this.tree.popNode(this);
            }

            var refIndex = node.isChildOf(p);

            if (!node.nextSibling) {
                this.nextSibling = null;
                return this.appendTo(p);
            }

            p.children.splice(refIndex + 1, 0, this);

            node.nextSibling.previousSibling = this;
            this.previousSibling = node;
            this.nextSibling = node.nextSibling;
            node.nextSibling = this;

            this.applyParent(p);
        }

        return this;
    },

    /**
    * Returns true if the Node is a child of supplied Node
    * @method isChildOf
    * @param parentNode {Node} the Node to check
    * @return {boolean} The node index if this Node is a child of 
    *                   supplied Node, else -1.
    * @private
    */
    isChildOf: function(parentNode) {
        if (parentNode && parentNode.children) {
            for (var i=0, len=parentNode.children.length; i<len ; ++i) {
                if (parentNode.children[i] === this) {
                    return i;
                }
            }
        }

        return -1;
    },

    /**
     * Returns a node array of this node's siblings, null if none.
     * @method getSiblings
     * @return Node[]
     */
    getSiblings: function() {
        var sib =  this.parent.children.slice(0);
        for (var i=0;i < sib.length && sib[i] != this;i++) {}
        sib.splice(i,1);
        if (sib.length) { return sib; }
        return null;
    },

    /**
     * Shows this node's children
     * @method showChildren
     */
    showChildren: function() {
        if (!this.tree.animateExpand(this.getChildrenEl(), this)) {
            if (this.hasChildren()) {
                this.getChildrenEl().style.display = "";
            }
        }
    },

    /**
     * Hides this node's children
     * @method hideChildren
     */
    hideChildren: function() {

        if (!this.tree.animateCollapse(this.getChildrenEl(), this)) {
            this.getChildrenEl().style.display = "none";
        }
    },

    /**
     * Returns the id for this node's container div
     * @method getElId
     * @return {string} the element id
     */
    getElId: function() {
        return "ygtv" + this.index;
    },

    /**
     * Returns the id for this node's children div
     * @method getChildrenElId
     * @return {string} the element id for this node's children div
     */
    getChildrenElId: function() {
        return "ygtvc" + this.index;
    },

    /**
     * Returns the id for this node's toggle element
     * @method getToggleElId
     * @return {string} the toggel element id
     */
    getToggleElId: function() {
        return "ygtvt" + this.index;
    },


    /*
     * Returns the id for this node's spacer image.  The spacer is positioned
     * over the toggle and provides feedback for screen readers.
     * @method getSpacerId
     * @return {string} the id for the spacer image
     */
    /*
    getSpacerId: function() {
        return "ygtvspacer" + this.index;
    }, 
    */

    /**
     * Returns this node's container html element
     * @method getEl
     * @return {HTMLElement} the container html element
     */
    getEl: function() {
        return Dom.get(this.getElId());
    },

    /**
     * Returns the div that was generated for this node's children
     * @method getChildrenEl
     * @return {HTMLElement} this node's children div
     */
    getChildrenEl: function() {
        return Dom.get(this.getChildrenElId());
    },

    /**
     * Returns the element that is being used for this node's toggle.
     * @method getToggleEl
     * @return {HTMLElement} this node's toggle html element
     */
    getToggleEl: function() {
        return Dom.get(this.getToggleElId());
    },
    /**
    * Returns the outer html element for this node's content
    * @method getContentEl
    * @return {HTMLElement} the element
    */
    getContentEl: function() { 
        return Dom.get(this.contentElId);
    },


    /*
     * Returns the element that is being used for this node's spacer.
     * @method getSpacer
     * @return {HTMLElement} this node's spacer html element
     */
    /*
    getSpacer: function() {
        return document.getElementById( this.getSpacerId() ) || {};
    },
    */

    /*
    getStateText: function() {
        if (this.isLoading) {
            return this.loadingText;
        } else if (this.hasChildren(true)) {
            if (this.expanded) {
                return this.expandedText;
            } else {
                return this.collapsedText;
            }
        } else {
            return "";
        }
    },
    */

  /**
     * Hides this nodes children (creating them if necessary), changes the toggle style.
     * @method collapse
     */
    collapse: function() {
        // Only collapse if currently expanded
        if (!this.expanded) { return; }

        // fire the collapse event handler
        var ret = this.tree.onCollapse(this);

        if (false === ret) {
            return;
        }

        ret = this.tree.fireEvent("collapse", this);

        if (false === ret) {
            return;
        }


        if (!this.getEl()) {
            this.expanded = false;
        } else {
            // hide the child div
            this.hideChildren();
            this.expanded = false;

            this.updateIcon();
        }

        // this.getSpacer().title = this.getStateText();

        ret = this.tree.fireEvent("collapseComplete", this);

    },

    /**
     * Shows this nodes children (creating them if necessary), changes the
     * toggle style, and collapses its siblings if multiExpand is not set.
     * @method expand
     */
    expand: function(lazySource) {
        // Only expand if currently collapsed.
        if (this.expanded && !lazySource) { 
            return; 
        }

        var ret = true;

        // When returning from the lazy load handler, expand is called again
        // in order to render the new children.  The "expand" event already
        // fired before fething the new data, so we need to skip it now.
        if (!lazySource) {
            // fire the expand event handler
            ret = this.tree.onExpand(this);

            if (false === ret) {
                return;
            }
            
            ret = this.tree.fireEvent("expand", this);
        }

        if (false === ret) {
            return;
        }

        if (!this.getEl()) {
            this.expanded = true;
            return;
        }

        if (!this.childrenRendered) {
            this.getChildrenEl().innerHTML = this.renderChildren();
        } else {
        }

        this.expanded = true;

        this.updateIcon();

        // this.getSpacer().title = this.getStateText();

        // We do an extra check for children here because the lazy
        // load feature can expose nodes that have no children.

        // if (!this.hasChildren()) {
        if (this.isLoading) {
            this.expanded = false;
            return;
        }

        if (! this.multiExpand) {
            var sibs = this.getSiblings();
            for (var i=0; sibs && i<sibs.length; ++i) {
                if (sibs[i] != this && sibs[i].expanded) { 
                    sibs[i].collapse(); 
                }
            }
        }

        this.showChildren();

        ret = this.tree.fireEvent("expandComplete", this);
    },

    updateIcon: function() {
        if (this.hasIcon) {
            var el = this.getToggleEl();
            if (el) {
                el.className = el.className.replace(/\bygtv(([tl][pmn]h?)|(loading))\b/gi,this.getStyle());
            }
        }
    },

    /**
     * Returns the css style name for the toggle
     * @method getStyle
     * @return {string} the css class for this node's toggle
     */
    getStyle: function() {
        if (this.isLoading) {
            return "ygtvloading";
        } else {
            // location top or bottom, middle nodes also get the top style
            var loc = (this.nextSibling) ? "t" : "l";

            // type p=plus(expand), m=minus(collapase), n=none(no children)
            var type = "n";
            if (this.hasChildren(true) || (this.isDynamic() && !this.getIconMode())) {
            // if (this.hasChildren(true)) {
                type = (this.expanded) ? "m" : "p";
            }

            return "ygtv" + loc + type;
        }
    },

    /**
     * Returns the hover style for the icon
     * @return {string} the css class hover state
     * @method getHoverStyle
     */
    getHoverStyle: function() { 
        var s = this.getStyle();
        if (this.hasChildren(true) && !this.isLoading) { 
            s += "h"; 
        }
        return s;
    },

    /**
     * Recursively expands all of this node's children.
     * @method expandAll
     */
    expandAll: function() { 
        var l = this.children.length;
        for (var i=0;i<l;++i) {
            var c = this.children[i];
            if (c.isDynamic()) {
                break;
            } else if (! c.multiExpand) {
                break;
            } else {
                c.expand();
                c.expandAll();
            }
        }
    },

    /**
     * Recursively collapses all of this node's children.
     * @method collapseAll
     */
    collapseAll: function() { 
        for (var i=0;i<this.children.length;++i) {
            this.children[i].collapse();
            this.children[i].collapseAll();
        }
    },

    /**
     * Configures this node for dynamically obtaining the child data
     * when the node is first expanded.  Calling it without the callback
     * will turn off dynamic load for the node.
     * @method setDynamicLoad
     * @param fmDataLoader {function} the function that will be used to get the data.
     * @param iconMode {int} configures the icon that is displayed when a dynamic
     * load node is expanded the first time without children.  By default, the 
     * "collapse" icon will be used.  If set to 1, the leaf node icon will be
     * displayed.
     */
    setDynamicLoad: function(fnDataLoader, iconMode) { 
        if (fnDataLoader) {
            this.dataLoader = fnDataLoader;
            this._dynLoad = true;
        } else {
            this.dataLoader = null;
            this._dynLoad = false;
        }

        if (iconMode) {
            this.iconMode = iconMode;
        }
    },

    /**
     * Evaluates if this node is the root node of the tree
     * @method isRoot
     * @return {boolean} true if this is the root node
     */
    isRoot: function() { 
        return (this == this.tree.root);
    },

    /**
     * Evaluates if this node's children should be loaded dynamically.  Looks for
     * the property both in this instance and the root node.  If the tree is
     * defined to load all children dynamically, the data callback function is
     * defined in the root node
     * @method isDynamic
     * @return {boolean} true if this node's children are to be loaded dynamically
     */
    isDynamic: function() { 
        if (this.isLeaf) {
            return false;
        } else {
            return (!this.isRoot() && (this._dynLoad || this.tree.root._dynLoad));
            // return lazy;
        }
    },

    /**
     * Returns the current icon mode.  This refers to the way childless dynamic
     * load nodes appear (this comes into play only after the initial dynamic
     * load request produced no children).
     * @method getIconMode
     * @return {int} 0 for collapse style, 1 for leaf node style
     */
    getIconMode: function() {
        return (this.iconMode || this.tree.root.iconMode);
    },

    /**
     * Checks if this node has children.  If this node is lazy-loading and the
     * children have not been rendered, we do not know whether or not there
     * are actual children.  In most cases, we need to assume that there are
     * children (for instance, the toggle needs to show the expandable 
     * presentation state).  In other times we want to know if there are rendered
     * children.  For the latter, "checkForLazyLoad" should be false.
     * @method hasChildren
     * @param checkForLazyLoad {boolean} should we check for unloaded children?
     * @return {boolean} true if this has children or if it might and we are
     * checking for this condition.
     */
    hasChildren: function(checkForLazyLoad) { 
        if (this.isLeaf) {
            return false;
        } else {
            return ( this.children.length > 0 || 
(checkForLazyLoad && this.isDynamic() && !this.dynamicLoadComplete) );
        }
    },

    /**
     * Expands if node is collapsed, collapses otherwise.
     * @method toggle
     */
    toggle: function() {
        if (!this.tree.locked && ( this.hasChildren(true) || this.isDynamic()) ) {
            if (this.expanded) { this.collapse(); } else { this.expand(); }
        }
    },

    /**
     * Returns the markup for this node and its children.
     * @method getHtml
     * @return {string} the markup for this node and its expanded children.
     */
    getHtml: function() {

        this.childrenRendered = false;

        return ['<div class="ygtvitem" id="' , this.getElId() , '">' ,this.getNodeHtml() , this.getChildrenHtml() ,'</div>'].join("");
    },

    /**
     * Called when first rendering the tree.  We always build the div that will
     * contain this nodes children, but we don't render the children themselves
     * unless this node is expanded.
     * @method getChildrenHtml
     * @return {string} the children container div html and any expanded children
     * @private
     */
    getChildrenHtml: function() {


        var sb = [];
        sb[sb.length] = '<div class="ygtvchildren" id="' + this.getChildrenElId() + '"';

        // This is a workaround for an IE rendering issue, the child div has layout
        // in IE, creating extra space if a leaf node is created with the expanded
        // property set to true.
        if (!this.expanded || !this.hasChildren()) {
            sb[sb.length] = ' style="display:none;"';
        }
        sb[sb.length] = '>';


        // Don't render the actual child node HTML unless this node is expanded.
        if ( (this.hasChildren(true) && this.expanded) ||
                (this.renderHidden && !this.isDynamic()) ) {
            sb[sb.length] = this.renderChildren();
        }

        sb[sb.length] = '</div>';

        return sb.join("");
    },

    /**
     * Generates the markup for the child nodes.  This is not done until the node
     * is expanded.
     * @method renderChildren
     * @return {string} the html for this node's children
     * @private
     */
    renderChildren: function() {


        var node = this;

        if (this.isDynamic() && !this.dynamicLoadComplete) {
            this.isLoading = true;
            this.tree.locked = true;

            if (this.dataLoader) {

                setTimeout( 
                    function() {
                        node.dataLoader(node, 
                            function() { 
                                node.loadComplete(); 
                            });
                    }, 10);
                
            } else if (this.tree.root.dataLoader) {

                setTimeout( 
                    function() {
                        node.tree.root.dataLoader(node, 
                            function() { 
                                node.loadComplete(); 
                            });
                    }, 10);

            } else {
                return "Error: data loader not found or not specified.";
            }

            return "";

        } else {
            return this.completeRender();
        }
    },

    /**
     * Called when we know we have all the child data.
     * @method completeRender
     * @return {string} children html
     */
    completeRender: function() {
        var sb = [];

        for (var i=0; i < this.children.length; ++i) {
            // this.children[i].childrenRendered = false;
            sb[sb.length] = this.children[i].getHtml();
        }
        
        this.childrenRendered = true;

        return sb.join("");
    },

    /**
     * Load complete is the callback function we pass to the data provider
     * in dynamic load situations.
     * @method loadComplete
     */
    loadComplete: function() {
        this.getChildrenEl().innerHTML = this.completeRender();
        this.dynamicLoadComplete = true;
        this.isLoading = false;
        this.expand(true);
        this.tree.locked = false;
    },

    /**
     * Returns this node's ancestor at the specified depth.
     * @method getAncestor
     * @param {int} depth the depth of the ancestor.
     * @return {Node} the ancestor
     */
    getAncestor: function(depth) {
        if (depth >= this.depth || depth < 0)  {
            return null;
        }

        var p = this.parent;
        
        while (p.depth > depth) {
            p = p.parent;
        }

        return p;
    },

    /**
     * Returns the css class for the spacer at the specified depth for
     * this node.  If this node's ancestor at the specified depth
     * has a next sibling the presentation is different than if it
     * does not have a next sibling
     * @method getDepthStyle
     * @param {int} depth the depth of the ancestor.
     * @return {string} the css class for the spacer
     */
    getDepthStyle: function(depth) {
        return (this.getAncestor(depth).nextSibling) ? 
            "ygtvdepthcell" : "ygtvblankdepthcell";
    },

    /**
     * Get the markup for the node.  This may be overrided so that we can
     * support different types of nodes.
     * @method getNodeHtml
     * @return {string} The HTML that will render this node.
     */
    getNodeHtml: function() { 
        var sb = [];

        sb[sb.length] = '<table id="ygtvtableel' + this.index + '"border="0" cellpadding="0" cellspacing="0" class="ygtvtable ygtvdepth' + this.depth;
        if (this.enableHighlight) {
            //sb[sb.length] = ' ygtv-highlight' + this.highlightState;
        }
        if (this.className) {
            sb[sb.length] = ' ' + this.className;
        }           
        sb[sb.length] = '"><tr class="ygtvrow">';
        
        for (var i=0;i<this.depth;++i) {
            sb[sb.length] = '<td class="ygtvcell ' + this.getDepthStyle(i) + '"><div class="ygtvspacer"></div></td>';
        }

        if (this.hasIcon) {
            sb[sb.length] = '<td id="' + this.getToggleElId();
            sb[sb.length] = '" class="ygtvcell ';
            sb[sb.length] = this.getStyle() ;
            sb[sb.length] = '"><a href="#" class="ygtvspacer">&nbsp;</a></td>';
        }

        sb[sb.length] = '<td id="' + this.contentElId; 
        sb[sb.length] = '" class="ygtvcell ';
        sb[sb.length] = this.contentStyle  + ' ygtvcontent" ';
        sb[sb.length] = (this.nowrap) ? ' nowrap="nowrap" ' : '';
        sb[sb.length] = ' >';
        sb[sb.length] = this.getContentHtml();
        sb[sb.length] = '</td></tr></table>';

        return sb.join("");

    },
    /**
     * Get the markup for the contents of the node.  This is designed to be overrided so that we can
     * support different types of nodes.
     * @method getContentHtml
     * @return {string} The HTML that will render the content of this node.
     */
    getContentHtml: function () {
        return "";
    },

    /**
     * Regenerates the html for this node and its children.  To be used when the
     * node is expanded and new children have been added.
     * @method refresh
     */
    refresh: function() {
        // this.loadComplete();
        this.getChildrenEl().innerHTML = this.completeRender();

        if (this.hasIcon) {
            var el = this.getToggleEl();
            if (el) {
                el.className = el.className.replace(/\bygtv[lt][nmp]h*\b/gi,this.getStyle());
            }
        }
    },

    /**
     * Node toString
     * @method toString
     * @return {string} string representation of the node
     */
    toString: function() {
        return this._type + " (" + this.index + ")";
    },
    /**
    * array of items that had the focus set on them
    * so that they can be cleaned when focus is lost
    * @property _focusHighlightedItems
    * @type Array of DOM elements
    * @private
    */
    _focusHighlightedItems: [],
    /**
    * DOM element that actually got the browser focus
    * @property _focusedItem
    * @type DOM element
    * @private
    */
    _focusedItem: null,
    
    /**
    * Returns true if there are any elements in the node that can 
    * accept the real actual browser focus
    * @method _canHaveFocus
    * @return {boolean} success
    * @private
    */
    _canHaveFocus: function() {
        return this.getEl().getElementsByTagName('a').length > 0;
    },
    /**
    * Removes the focus of previously selected Node
    * @method _removeFocus
    * @private
    */
    _removeFocus:function () {
        if (this._focusedItem) {
            Event.removeListener(this._focusedItem,'blur');
            this._focusedItem = null;
        }
        var el;
        while ((el = this._focusHighlightedItems.shift())) {  // yes, it is meant as an assignment, really
            Dom.removeClass(el,YAHOO.widget.TreeView.FOCUS_CLASS_NAME );
        }
    },
    /**
    * Sets the focus on the node element.
    * It will only be able to set the focus on nodes that have anchor elements in it.  
    * Toggle or branch icons have anchors and can be focused on.  
    * If will fail in nodes that have no anchor
    * @method focus
    * @return {boolean} success
    */
    focus: function () {
        var focused = false, self = this;

        if (this.tree.currentFocus) {
            this.tree.currentFocus._removeFocus();
        }
    
        var  expandParent = function (node) {
            if (node.parent) {
                expandParent(node.parent);
                node.parent.expand();
            } 
        };
        expandParent(this);

        Dom.getElementsBy  ( 
            function (el) {
                return /ygtv(([tl][pmn]h?)|(content))/.test(el.className);
            } ,
            'td' , 
            self.getEl().firstChild , 
            function (el) {
                Dom.addClass(el, YAHOO.widget.TreeView.FOCUS_CLASS_NAME );
                if (!focused) { 
                    var aEl = el.getElementsByTagName('a');
                    if (aEl.length) {
                        aEl = aEl[0];
                        aEl.focus();
                        self._focusedItem = aEl;
                        Event.on(aEl,'blur',function () {
                            //console.log('f1');
                            self.tree.fireEvent('focusChanged',{oldNode:self.tree.currentFocus,newNode:null});
                            self.tree.currentFocus = null;
                            self._removeFocus();
                        });
                        focused = true;
                    }
                }
                self._focusHighlightedItems.push(el);
            }
        );
        if (focused) { 
                            //console.log('f2');
            this.tree.fireEvent('focusChanged',{oldNode:this.tree.currentFocus,newNode:this});
            this.tree.currentFocus = this;
        } else {
                            //console.log('f3');
            this.tree.fireEvent('focusChanged',{oldNode:self.tree.currentFocus,newNode:null});
            this.tree.currentFocus = null;
            this._removeFocus(); 
        }
        return focused;
    },

  /**
     * Count of nodes in a branch
     * @method getNodeCount
     * @return {int} number of nodes in the branch
     */
    getNodeCount: function() {
        for (var i = 0, count = 0;i< this.children.length;i++) {
            count += this.children[i].getNodeCount();
        }
        return count + 1;
    },
    
      /**
     * Returns an object which could be used to build a tree out of this node and its children.
     * It can be passed to the tree constructor to reproduce this node as a tree.
     * It will return false if the node or any children loads dynamically, regardless of whether it is loaded or not.
     * @method getNodeDefinition
     * @return {Object | false}  definition of the tree or false if the node or any children is defined as dynamic
     */
    getNodeDefinition: function() {
    
        if (this.isDynamic()) { return false; }
        
        var def, defs = Lang.merge(this.data), children = []; 
        
        

        if (this.expanded) {defs.expanded = this.expanded; }
        if (!this.multiExpand) { defs.multiExpand = this.multiExpand; }
        if (!this.renderHidden) { defs.renderHidden = this.renderHidden; }
        if (!this.hasIcon) { defs.hasIcon = this.hasIcon; }
        if (this.nowrap) { defs.nowrap = this.nowrap; }
        if (this.className) { defs.className = this.className; }
        if (this.editable) { defs.editable = this.editable; }
        if (this.enableHighlight) { defs.enableHighlight = this.enableHighlight; }
        if (this.highlightState) { defs.highlightState = this.highlightState; }
        if (this.propagateHighlightUp) { defs.propagateHighlightUp = this.propagateHighlightUp; }
        if (this.propagateHighlightDown) { defs.propagateHighlightDown = this.propagateHighlightDown; }
        defs.type = this._type;
        
        
        
        for (var i = 0; i < this.children.length;i++) {
            def = this.children[i].getNodeDefinition();
            if (def === false) { return false;}
            children.push(def);
        }
        if (children.length) { defs.children = children; }
        return defs;
    },


    /**
     * Generates the link that will invoke this node's toggle method
     * @method getToggleLink
     * @return {string} the javascript url for toggling this node
     */
    getToggleLink: function() {
        return 'return false;';
    },
    
    /**
    * Sets the value of property for this node and all loaded descendants.  
    * Only public and defined properties can be set, not methods.  
    * Values for unknown properties will be assigned to the refNode.data object
    * @method setNodesProperty
    * @param name {string} Name of the property to be set
    * @param value {any} value to be set
    * @param refresh {boolean} if present and true, it does a refresh
    */
    setNodesProperty: function(name, value, refresh) {
        if (name.charAt(0) != '_'  && !Lang.isUndefined(this[name]) && !Lang.isFunction(this[name]) ) {
            this[name] = value;
        } else {
            this.data[name] = value;
        }
        for (var i = 0; i < this.children.length;i++) {
            this.children[i].setNodesProperty(name,value);
        }
        if (refresh) {
            this.refresh();
        }
    },
    /**
    * Toggles the highlighted state of a Node
    * @method toggleHighlight
    */
    toggleHighlight: function() {
        if (this.enableHighlight) {
            // unhighlights only if fully highligthed.  For not or partially highlighted it will highlight
            if (this.highlightState == 1) {
                this.unhighlight();
            } else {
                this.highlight();
            }
        }
    },
    
    /**
    * Turns highlighting on node.  
    * @method highlight
    * @param _silent {boolean} optional, don't fire the highlightEvent
    */
    highlight: function(_silent) {
        return;
        if (this.enableHighlight) {
            if (this.tree.singleNodeHighlight) {
                if (this.tree._currentlyHighlighted) {
                    this.tree._currentlyHighlighted.unhighlight();
                }
                this.tree._currentlyHighlighted = this;
            }
            this.highlightState = 1;
            this._setHighlightClassName();
            if (this.propagateHighlightDown) {
                for (var i = 0;i < this.children.length;i++) {
                    this.children[i].highlight(true);
                }
            }
            if (this.propagateHighlightUp) {
                if (this.parent) {
                    this.parent._childrenHighlighted();
                }
            }
            if (!_silent) {
                this.tree.fireEvent('highlightEvent',this);
            }
        }
    },
    /**
    * Turns highlighting off a node.  
    * @method unhighlight
    * @param _silent {boolean} optional, don't fire the highlightEvent
    */
    unhighlight: function(_silent) {
        if (this.enableHighlight) {
            this.highlightState = 0;
            this._setHighlightClassName();
            if (this.propagateHighlightDown) {
                for (var i = 0;i < this.children.length;i++) {
                    this.children[i].unhighlight(true);
                }
            }
            if (this.propagateHighlightUp) {
                if (this.parent) {
                    this.parent._childrenHighlighted();
                }
            }
            if (!_silent) {
                this.tree.fireEvent('highlightEvent',this);
            }
        }
    },
    /** 
    * Checks whether all or part of the children of a node are highlighted and
    * sets the node highlight to full, none or partial highlight.
    * If set to propagate it will further call the parent
    * @method _childrenHighlighted
    * @private
    */
    _childrenHighlighted: function() {
        var yes = false, no = false;
        if (this.enableHighlight) {
            for (var i = 0;i < this.children.length;i++) {
                switch(this.children[i].highlightState) {
                    case 0:
                        no = true;
                        break;
                    case 1:
                        yes = true;
                        break;
                    case 2:
                        yes = no = true;
                        break;
                }
            }
            if (yes && no) {
                this.highlightState = 2;
            } else if (yes) {
                this.highlightState = 1;
            } else {
                this.highlightState = 0;
            }
            this._setHighlightClassName();
            if (this.propagateHighlightUp) {
                if (this.parent) {
                    this.parent._childrenHighlighted();
                }
            }
        }
    },
    
    /**
    * Changes the classNames on the toggle and content containers to reflect the current highlighting
    * @method _setHighlightClassName
    * @private
    */
    _setHighlightClassName: function() {
        var el = Dom.get('ygtvtableel' + this.index);
        if (el) {
            el.className = el.className.replace(/\bygtv-highlight\d\b/gi,'ygtv-highlight' + this.highlightState);
        }
    }
    
};

YAHOO.augment(YAHOO.widget.Node, YAHOO.util.EventProvider);
})();
/**
 * A custom YAHOO.widget.Node that handles the unique nature of 
 * the virtual, presentationless root node.
 * @namespace YAHOO.widget
 * @class RootNode
 * @extends YAHOO.widget.Node
 * @param oTree {YAHOO.widget.TreeView} The tree instance this node belongs to
 * @constructor
 */
YAHOO.widget.RootNode = function(oTree) {
    // Initialize the node with null params.  The root node is a
    // special case where the node has no presentation.  So we have
    // to alter the standard properties a bit.
    this.init(null, null, true);
    
    /*
     * For the root node, we get the tree reference from as a param
     * to the constructor instead of from the parent element.
     */
    this.tree = oTree;
};

YAHOO.extend(YAHOO.widget.RootNode, YAHOO.widget.Node, {
    
   /**
     * The node type
     * @property _type
      * @type string
     * @private
     * @default "RootNode"
     */
    _type: "RootNode",
    
    // overrides YAHOO.widget.Node
    getNodeHtml: function() { 
        return ""; 
    },

    toString: function() { 
        return this._type;
    },

    loadComplete: function() { 
        this.tree.draw();
    },
    
   /**
     * Count of nodes in tree.  
    * It overrides Nodes.getNodeCount because the root node should not be counted.
     * @method getNodeCount
     * @return {int} number of nodes in the tree
     */
    getNodeCount: function() {
        for (var i = 0, count = 0;i< this.children.length;i++) {
            count += this.children[i].getNodeCount();
        }
        return count;
    },

  /**
     * Returns an object which could be used to build a tree out of this node and its children.
     * It can be passed to the tree constructor to reproduce this node as a tree.
     * Since the RootNode is automatically created by treeView, 
     * its own definition is excluded from the returned node definition
     * which only contains its children.
     * @method getNodeDefinition
     * @return {Object | false}  definition of the tree or false if any child node is defined as dynamic
     */
    getNodeDefinition: function() {
        
        for (var def, defs = [], i = 0; i < this.children.length;i++) {
            def = this.children[i].getNodeDefinition();
            if (def === false) { return false;}
            defs.push(def);
        }
        return defs;
    },

    collapse: function() {},
    expand: function() {},
    getSiblings: function() { return null; },
    focus: function () {}

});
(function () {
    var Dom = YAHOO.util.Dom,
        Lang = YAHOO.lang,
        Event = YAHOO.util.Event;
/**
 * The default node presentation.  The first parameter should be
 * either a string that will be used as the node's label, or an object
 * that has at least a string property called label.  By default,  clicking the
 * label will toggle the expanded/collapsed state of the node.  By
 * setting the href property of the instance, this behavior can be
 * changed so that the label will go to the specified href.
 * @namespace YAHOO.widget
 * @class TextNode
 * @extends YAHOO.widget.Node
 * @constructor
 * @param oData {object} a string or object containing the data that will
 * be used to render this node.
 * Providing a string is the same as providing an object with a single property named label.
 * All values in the oData will be used to set equally named properties in the node
 * as long as the node does have such properties, they are not undefined, private or functions.
 * All attributes are made available in noderef.data, which
 * can be used to store custom attributes.  TreeView.getNode(s)ByProperty
 * can be used to retrieve a node by one of the attributes.
 * @param oParent {YAHOO.widget.Node} this node's parent node
 * @param expanded {boolean} the initial expanded/collapsed state (deprecated; use oData.expanded) 
 */
YAHOO.widget.TextNode = function(oData, oParent, expanded) {

    if (oData) { 
        if (Lang.isString(oData)) {
            oData = { label: oData };
        }
        this.init(oData, oParent, expanded);
        this.setUpLabel(oData);
    }

};

YAHOO.extend(YAHOO.widget.TextNode, YAHOO.widget.Node, {
    
    /**
     * The CSS class for the label href.  Defaults to ygtvlabel, but can be
     * overridden to provide a custom presentation for a specific node.
     * @property labelStyle
     * @type string
     */
    labelStyle: "ygtvlabel",

    /**
     * The derived element id of the label for this node
     * @property labelElId
     * @type string
     */
    labelElId: null,

    /**
     * The text for the label.  It is assumed that the oData parameter will
     * either be a string that will be used as the label, or an object that
     * has a property called "label" that we will use.
     * @property label
     * @type string
     */
    label: null,

    /**
     * The text for the title (tooltip) for the label element
     * @property title
     * @type string
     */
    title: null,
    
    /**
     * The href for the node's label.  If one is not specified, the href will
     * be set so that it toggles the node.
     * @property href
     * @type string
     */
    href: null,

    /**
     * The label href target, defaults to current window
     * @property target
     * @type string
     */
    target: "_self",
    
    /**
     * The node type
     * @property _type
     * @private
     * @type string
     * @default "TextNode"
     */
    _type: "TextNode",


    /**
     * Sets up the node label
     * @method setUpLabel
     * @param oData string containing the label, or an object with a label property
     */
    setUpLabel: function(oData) { 
        
        if (Lang.isString(oData)) {
            oData = { 
                label: oData 
            };
        } else {
            if (oData.style) {
                this.labelStyle = oData.style;
            }
        }

        this.label = oData.label;

        this.labelElId = "ygtvlabelel" + this.index;
        
    },

    /**
     * Returns the label element
     * @for YAHOO.widget.TextNode
     * @method getLabelEl
     * @return {object} the element
     */
    getLabelEl: function() { 
        return Dom.get(this.labelElId);
    },

    // overrides YAHOO.widget.Node
    getContentHtml: function() { 
        var sb = [];
        sb[sb.length] = this.href?'<a':'<span';
        sb[sb.length] = ' id="' + this.labelElId + '"';
        sb[sb.length] = ' class="' + this.labelStyle  + '"';
        if (this.href) {
            sb[sb.length] = ' href="' + this.href + '"';
            sb[sb.length] = ' target="' + this.target + '"';
        } 
        if (this.title) {
            sb[sb.length] = ' title="' + this.title + '"';
        }
        sb[sb.length] = ' >';
        sb[sb.length] = this.label;
        sb[sb.length] = this.href?'</a>':'</span>';
        return sb.join("");
    },



  /**
     * Returns an object which could be used to build a tree out of this node and its children.
     * It can be passed to the tree constructor to reproduce this node as a tree.
     * It will return false if the node or any descendant loads dynamically, regardless of whether it is loaded or not.
     * @method getNodeDefinition
     * @return {Object | false}  definition of the tree or false if this node or any descendant is defined as dynamic
     */
    getNodeDefinition: function() {
        var def = YAHOO.widget.TextNode.superclass.getNodeDefinition.call(this);
        if (def === false) { return false; }

        // Node specific properties
        def.label = this.label;
        if (this.labelStyle != 'ygtvlabel') { def.style = this.labelStyle; }
        if (this.title) { def.title = this.title; }
        if (this.href) { def.href = this.href; }
        if (this.target != '_self') { def.target = this.target; }       

        return def;
    
    },

    toString: function() { 
        return YAHOO.widget.TextNode.superclass.toString.call(this) + ": " + this.label;
    },

    // deprecated
    onLabelClick: function() {
        return false;
    },
    refresh: function() {
        YAHOO.widget.TextNode.superclass.refresh.call(this);
        var label = this.getLabelEl();
        label.innerHTML = this.label;
        if (label.tagName.toUpperCase() == 'A') {
            label.href = this.href;
            label.target = this.target;
        }
    }
        
    

    
});
})();
/**
 * A menu-specific implementation that differs from TextNode in that only 
 * one sibling can be expanded at a time.
 * @namespace YAHOO.widget
 * @class MenuNode
 * @extends YAHOO.widget.TextNode
 * @param oData {object} a string or object containing the data that will
 * be used to render this node.
 * Providing a string is the same as providing an object with a single property named label.
 * All values in the oData will be used to set equally named properties in the node
 * as long as the node does have such properties, they are not undefined, private or functions.
 * All attributes are made available in noderef.data, which
 * can be used to store custom attributes.  TreeView.getNode(s)ByProperty
 * can be used to retrieve a node by one of the attributes.
 * @param oParent {YAHOO.widget.Node} this node's parent node
 * @param expanded {boolean} the initial expanded/collapsed state (deprecated; use oData.expanded) 
 * @constructor
 */
YAHOO.widget.MenuNode = function(oData, oParent, expanded) {
    YAHOO.widget.MenuNode.superclass.constructor.call(this,oData,oParent,expanded);

   /*
     * Menus usually allow only one branch to be open at a time.
     */
    this.multiExpand = false;

};

YAHOO.extend(YAHOO.widget.MenuNode, YAHOO.widget.TextNode, {

    /**
     * The node type
     * @property _type
     * @private
    * @default "MenuNode"
     */
    _type: "MenuNode"

});
(function () {
    var Dom = YAHOO.util.Dom,
        Lang = YAHOO.lang,
        Event = YAHOO.util.Event;

/**
 * This implementation takes either a string or object for the
 * oData argument.  If is it a string, it will use it for the display
 * of this node (and it can contain any html code).  If the parameter
 * is an object,it looks for a parameter called "html" that will be
 * used for this node's display.
 * @namespace YAHOO.widget
 * @class HTMLNode
 * @extends YAHOO.widget.Node
 * @constructor
 * @param oData {object} a string or object containing the data that will
 * be used to render this node.  
 * Providing a string is the same as providing an object with a single property named html.
 * All values in the oData will be used to set equally named properties in the node
 * as long as the node does have such properties, they are not undefined, private or functions.
 * All other attributes are made available in noderef.data, which
 * can be used to store custom attributes.  TreeView.getNode(s)ByProperty
 * can be used to retrieve a node by one of the attributes.
 * @param oParent {YAHOO.widget.Node} this node's parent node
 * @param expanded {boolean} the initial expanded/collapsed state (deprecated; use oData.expanded) 
 * @param hasIcon {boolean} specifies whether or not leaf nodes should
 * be rendered with or without a horizontal line line and/or toggle icon. If the icon
 * is not displayed, the content fills the space it would have occupied.
 * This option operates independently of the leaf node presentation logic
 * for dynamic nodes.
 * (deprecated; use oData.hasIcon) 
 */
YAHOO.widget.HTMLNode = function(oData, oParent, expanded, hasIcon) {
    if (oData) { 
        this.init(oData, oParent, expanded);
        this.initContent(oData, hasIcon);
    }
};

YAHOO.extend(YAHOO.widget.HTMLNode, YAHOO.widget.Node, {

    /**
     * The CSS class for the html content container.  Defaults to ygtvhtml, but 
     * can be overridden to provide a custom presentation for a specific node.
     * @property contentStyle
     * @type string
     */
    contentStyle: "ygtvhtml",


    /**
     * The HTML content to use for this node's display
     * @property html
     * @type string
     */
    html: null,
    
/**
     * The node type
     * @property _type
     * @private
     * @type string
     * @default "HTMLNode"
     */
    _type: "HTMLNode",

    /**
     * Sets up the node label
     * @property initContent
     * @param oData {object} An html string or object containing an html property
     * @param hasIcon {boolean} determines if the node will be rendered with an
     * icon or not
     */
    initContent: function(oData, hasIcon) { 
        this.setHtml(oData);
        this.contentElId = "ygtvcontentel" + this.index;
        if (!Lang.isUndefined(hasIcon)) { this.hasIcon  = hasIcon; }
        
    },

    /**
     * Synchronizes the node.data, node.html, and the node's content
     * @property setHtml
     * @param o {object} An html string or object containing an html property
     */
    setHtml: function(o) {

        this.html = (typeof o === "string") ? o : o.html;

        var el = this.getContentEl();
        if (el) {
            el.innerHTML = this.html;
        }

    },

    // overrides YAHOO.widget.Node
    getContentHtml: function() { 
        return this.html;
    },
    
      /**
     * Returns an object which could be used to build a tree out of this node and its children.
     * It can be passed to the tree constructor to reproduce this node as a tree.
     * It will return false if any node loads dynamically, regardless of whether it is loaded or not.
     * @method getNodeDefinition
     * @return {Object | false}  definition of the tree or false if any node is defined as dynamic
     */
    getNodeDefinition: function() {
        var def = YAHOO.widget.HTMLNode.superclass.getNodeDefinition.call(this);
        if (def === false) { return false; }
        def.html = this.html;
        return def;
    
    }
});
})();
(function () {
    var Dom = YAHOO.util.Dom,
        Lang = YAHOO.lang,
        Event = YAHOO.util.Event,
        Calendar = YAHOO.widget.Calendar;
        
/**
 * A Date-specific implementation that differs from TextNode in that it uses 
 * YAHOO.widget.Calendar as an in-line editor, if available
 * If Calendar is not available, it behaves as a plain TextNode.
 * @namespace YAHOO.widget
 * @class DateNode
 * @extends YAHOO.widget.TextNode
 * @param oData {object} a string or object containing the data that will
 * be used to render this node.
 * Providing a string is the same as providing an object with a single property named label.
 * All values in the oData will be used to set equally named properties in the node
 * as long as the node does have such properties, they are not undefined, private nor functions.
 * All attributes are made available in noderef.data, which
 * can be used to store custom attributes.  TreeView.getNode(s)ByProperty
 * can be used to retrieve a node by one of the attributes.
 * @param oParent {YAHOO.widget.Node} this node's parent node
 * @param expanded {boolean} the initial expanded/collapsed state (deprecated; use oData.expanded) 
 * @constructor
 */
YAHOO.widget.DateNode = function(oData, oParent, expanded) {
    YAHOO.widget.DateNode.superclass.constructor.call(this,oData, oParent, expanded);
};

YAHOO.extend(YAHOO.widget.DateNode, YAHOO.widget.TextNode, {

    /**
     * The node type
     * @property _type
     * @type string
     * @private
     * @default  "DateNode"
     */
    _type: "DateNode",
    
    /**
    * Configuration object for the Calendar editor, if used.
    * See <a href="http://developer.yahoo.com/yui/calendar/#internationalization">http://developer.yahoo.com/yui/calendar/#internationalization</a>
    * @property calendarConfig
    */
    calendarConfig: null,
    
    
    
    /** 
     *  If YAHOO.widget.Calendar is available, it will pop up a Calendar to enter a new date.  Otherwise, it falls back to a plain &lt;input&gt;  textbox
     * @method fillEditorContainer
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @return void
     */
    fillEditorContainer: function (editorData) {
    
        var cal, container = editorData.inputContainer;
        
        if (Lang.isUndefined(Calendar)) {
            Dom.replaceClass(editorData.editorPanel,'ygtv-edit-DateNode','ygtv-edit-TextNode');
            YAHOO.widget.DateNode.superclass.fillEditorContainer.call(this, editorData);
            return;
        }
            
        if (editorData.nodeType != this._type) {
            editorData.nodeType = this._type;
            editorData.saveOnEnter = false;
            
            editorData.node.destroyEditorContents(editorData);

            editorData.inputObject = cal = new Calendar(container.appendChild(document.createElement('div')));
            if (this.calendarConfig) { 
                cal.cfg.applyConfig(this.calendarConfig,true); 
                cal.cfg.fireQueue();
            }
            cal.selectEvent.subscribe(function () {
                this.tree._closeEditor(true);
            },this,true);
        } else {
            cal = editorData.inputObject;
        }

        cal.cfg.setProperty("selected",this.label, false); 

        var delim = cal.cfg.getProperty('DATE_FIELD_DELIMITER');
        var pageDate = this.label.split(delim);
        cal.cfg.setProperty('pagedate',pageDate[cal.cfg.getProperty('MDY_MONTH_POSITION') -1] + delim + pageDate[cal.cfg.getProperty('MDY_YEAR_POSITION') -1]);
        cal.cfg.fireQueue();

        cal.render();
        cal.oDomContainer.focus();
    },
    /**
    * Saves the date entered in the editor into the DateNode label property and displays it.
    * Overrides Node.saveEditorValue
    * @method saveEditorValue
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     */
    saveEditorValue: function (editorData) {
        var node = editorData.node, 
            validator = node.tree.validator,
            value;
        if (Lang.isUndefined(Calendar)) {
            value = editorData.inputElement.value;
        } else {
            var cal = editorData.inputObject,
                date = cal.getSelectedDates()[0],
                dd = [];
                
            dd[cal.cfg.getProperty('MDY_DAY_POSITION') -1] = date.getDate();
            dd[cal.cfg.getProperty('MDY_MONTH_POSITION') -1] = date.getMonth() + 1;
            dd[cal.cfg.getProperty('MDY_YEAR_POSITION') -1] = date.getFullYear();
            value = dd.join(cal.cfg.getProperty('DATE_FIELD_DELIMITER'));
        }
        if (Lang.isFunction(validator)) {
            value = validator(value,node.label,node);
            if (Lang.isUndefined(value)) { return false; }
        }

        node.label = value;
        node.getLabelEl().innerHTML = value;
    },
  /**
     * Returns an object which could be used to build a tree out of this node and its children.
     * It can be passed to the tree constructor to reproduce this node as a tree.
     * It will return false if the node or any descendant loads dynamically, regardless of whether it is loaded or not.
     * @method getNodeDefinition
     * @return {Object | false}  definition of the node or false if this node or any descendant is defined as dynamic
     */ 
    getNodeDefinition: function() {
        var def = YAHOO.widget.DateNode.superclass.getNodeDefinition.call(this);
        if (def === false) { return false; }
        if (this.calendarConfig) { def.calendarConfig = this.calendarConfig; }
        return def;
    }


});
})();
(function () {
    var Dom = YAHOO.util.Dom,
        Lang = YAHOO.lang, 
        Event = YAHOO.util.Event,
        TV = YAHOO.widget.TreeView,
        TVproto = TV.prototype;

    /**
     * An object to store information used for in-line editing
     * for all Nodes of all TreeViews. It contains:
     * <ul>
    * <li>active {boolean}, whether there is an active cell editor </li>
    * <li>whoHasIt {YAHOO.widget.TreeView} TreeView instance that is currently using the editor</li>
    * <li>nodeType {string} value of static Node._type property, allows reuse of input element if node is of the same type.</li>
    * <li>editorPanel {HTMLelement (&lt;div&gt;)} element holding the in-line editor</li>
    * <li>inputContainer {HTMLelement (&lt;div&gt;)} element which will hold the type-specific input element(s) to be filled by the fillEditorContainer method</li>
    * <li>buttonsContainer {HTMLelement (&lt;div&gt;)} element which holds the &lt;button&gt; elements for Ok/Cancel.  If you don't want any of the buttons, hide it via CSS styles, don't destroy it</li>
    * <li>node {YAHOO.widget.Node} reference to the Node being edited</li>
    * <li>saveOnEnter {boolean}, whether the Enter key should be accepted as a Save command (Esc. is always taken as Cancel), disable for multi-line input elements </li>
    * </ul>
    *  Editors are free to use this object to store additional data.
     * @property editorData
     * @static
     * @for YAHOO.widget.TreeView
     */
    TV.editorData = {
        active:false,
        whoHasIt:null, // which TreeView has it
        nodeType:null,
        editorPanel:null,
        inputContainer:null,
        buttonsContainer:null,
        node:null, // which Node is being edited
        saveOnEnter:true
        // Each node type is free to add its own properties to this as it sees fit.
    };
    
    /**
    * Validator function for edited data, called from the TreeView instance scope, 
    * receives the arguments (newValue, oldValue, nodeInstance) 
    * and returns either the validated (or type-converted) value or undefined. 
    * An undefined return will prevent the editor from closing
    * @property validator
    * @default null
     * @for YAHOO.widget.TreeView
     */
    TVproto.validator = null;
    
    /**
    * Entry point of the editing plug-in.  
    * TreeView will call this method if it exists when a node label is clicked
    * @method _nodeEditing
    * @param node {YAHOO.widget.Node} the node to be edited
    * @return {Boolean} true to indicate that the node is editable and prevent any further bubbling of the click.
     * @for YAHOO.widget.TreeView
     * @private
    */
    
    
    TVproto._nodeEditing = function (node) {
        if (node.fillEditorContainer && node.editable) {
            var ed, topLeft, buttons, button, editorData = TV.editorData;
            editorData.active = true;
            editorData.whoHasIt = this;
            if (!editorData.nodeType) {
                editorData.editorPanel = ed = document.body.appendChild(document.createElement('div'));
                Dom.addClass(ed,'ygtv-label-editor');

                buttons = editorData.buttonsContainer = ed.appendChild(document.createElement('div'));
                Dom.addClass(buttons,'ygtv-button-container');
                button = buttons.appendChild(document.createElement('button'));
                Dom.addClass(button,'ygtvok');
                button.innerHTML = ' ';
                button = buttons.appendChild(document.createElement('button'));
                Dom.addClass(button,'ygtvcancel');
                button.innerHTML = ' ';
                Event.on(buttons, 'click', function (ev) {
                    var target = Event.getTarget(ev);
                    var node = TV.editorData.node;
                    if (Dom.hasClass(target,'ygtvok')) {
                        Event.stopEvent(ev);
                        this._closeEditor(true);
                    }
                    if (Dom.hasClass(target,'ygtvcancel')) {
                        Event.stopEvent(ev);
                        this._closeEditor(false);
                    }
                }, this, true);

                editorData.inputContainer = ed.appendChild(document.createElement('div'));
                Dom.addClass(editorData.inputContainer,'ygtv-input');
                
                Event.on(ed,'keydown',function (ev) {
                    var editorData = TV.editorData,
                        KEY = YAHOO.util.KeyListener.KEY;
                    switch (ev.keyCode) {
                        case KEY.ENTER:
                            Event.stopEvent(ev);
                            if (editorData.saveOnEnter) { 
                                this._closeEditor(true);
                            }
                            break;
                        case KEY.ESCAPE:
                            Event.stopEvent(ev);
                            this._closeEditor(false);
                            break;
                    }
                },this,true);


                
            } else {
                ed = editorData.editorPanel;
            }
            editorData.node = node;
            if (editorData.nodeType) {
                Dom.removeClass(ed,'ygtv-edit-' + editorData.nodeType);
            }
            Dom.addClass(ed,' ygtv-edit-' + node._type);
            topLeft = Dom.getXY(node.getContentEl());
            Dom.setStyle(ed,'left',topLeft[0] + 'px');
            Dom.setStyle(ed,'top',topLeft[1] + 'px');
            Dom.setStyle(ed,'display','block');
            ed.focus();
            node.fillEditorContainer(editorData);

            return true;  // If inline editor available, don't do anything else.
        }
    };
    
    /**
    * Method to be associated with an event (clickEvent, dblClickEvent or enterKeyPressed) to pop up the contents editor
    *  It calls the corresponding node editNode method.
    * @method onEventEditNode
    * @param oArgs {object} Object passed as arguments to TreeView event listeners
     * @for YAHOO.widget.TreeView
    */

    TVproto.onEventEditNode = function (oArgs) {
        if (oArgs instanceof YAHOO.widget.Node) {
            oArgs.editNode();
        } else if (oArgs.node instanceof YAHOO.widget.Node) {
            oArgs.node.editNode();
        }
    };
    
    /**
    * Method to be called when the inline editing is finished and the editor is to be closed
    * @method _closeEditor
    * @param save {Boolean} true if the edited value is to be saved, false if discarded
    * @private
     * @for YAHOO.widget.TreeView
    */
    
    TVproto._closeEditor = function (save) {
        var ed = TV.editorData, 
            node = ed.node,
            close = true;
        if (save) { 
            close = ed.node.saveEditorValue(ed) !== false; 
        }
        if (close) {
            Dom.setStyle(ed.editorPanel,'display','none');  
            ed.active = false;
            node.focus();
        }
    };
    
    /**
    *  Entry point for TreeView's destroy method to destroy whatever the editing plug-in has created
    * @method _destroyEditor
    * @private
     * @for YAHOO.widget.TreeView
    */
    TVproto._destroyEditor = function() {
        var ed = TV.editorData;
        if (ed && ed.nodeType && (!ed.active || ed.whoHasIt === this)) {
            Event.removeListener(ed.editorPanel,'keydown');
            Event.removeListener(ed.buttonContainer,'click');
            ed.node.destroyEditorContents(ed);
            document.body.removeChild(ed.editorPanel);
            ed.nodeType = ed.editorPanel = ed.inputContainer = ed.buttonsContainer = ed.whoHasIt = ed.node = null;
            ed.active = false;
        }
    };
    
    var Nproto = YAHOO.widget.Node.prototype;
    
    /**
    * Signals if the label is editable.  (Ignored on TextNodes with href set.)
    * @property editable
    * @type boolean
         * @for YAHOO.widget.Node
    */
    Nproto.editable = false;
    
    /**
    * pops up the contents editor, if there is one and the node is declared editable
    * @method editNode
     * @for YAHOO.widget.Node
    */
    
    Nproto.editNode = function () {
        this.tree._nodeEditing(this);
    };
    
    


    /** Placeholder for a function that should provide the inline node label editor.
     *   Leaving it set to null will indicate that this node type is not editable.
     * It should be overridden by nodes that provide inline editing.
     *  The Node-specific editing element (input box, textarea or whatever) should be inserted into editorData.inputContainer.
     * @method fillEditorContainer
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @return void
     * @for YAHOO.widget.Node
     */
    Nproto.fillEditorContainer = null;

    
    /**
    * Node-specific destroy function to empty the contents of the inline editor panel
    * This function is the worst case alternative that will purge all possible events and remove the editor contents
    * Method Event.purgeElement is somewhat costly so if it can be replaced by specifc Event.removeListeners, it is better to do so.
    * @method destroyEditorContents
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @for YAHOO.widget.Node
     */
    Nproto.destroyEditorContents = function (editorData) {
        // In the worst case, if the input editor (such as the Calendar) has no destroy method
        // we can only try to remove all possible events on it.
        Event.purgeElement(editorData.inputContainer,true);
        editorData.inputContainer.innerHTML = '';
    };

    /**
    * Saves the value entered into the editor.
    * Should be overridden by each node type
    * @method saveEditorValue
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @return a return of exactly false will prevent the editor from closing
     * @for YAHOO.widget.Node
     */
    Nproto.saveEditorValue = function (editorData) {
    };
    
    var TNproto = YAHOO.widget.TextNode.prototype;
    


    /** 
     *  Places an &lt;input&gt;  textbox in the input container and loads the label text into it
     * @method fillEditorContainer
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @return void
     * @for YAHOO.widget.TextNode
     */
    TNproto.fillEditorContainer = function (editorData) {
    
        var input;
        // If last node edited is not of the same type as this one, delete it and fill it with our editor
        if (editorData.nodeType != this._type) {
            editorData.nodeType = this._type;
            editorData.saveOnEnter = true;
            editorData.node.destroyEditorContents(editorData);

            editorData.inputElement = input = editorData.inputContainer.appendChild(document.createElement('input'));
            
        } else {
            // if the last node edited was of the same time, reuse the input element.
            input = editorData.inputElement;
        }

        input.value = this.label;
        input.focus();
        input.select();
    };
    
    /**
    * Saves the value entered in the editor into the TextNode label property and displays it
    * Overrides Node.saveEditorValue
    * @method saveEditorValue
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @for YAHOO.widget.TextNode
     */
    TNproto.saveEditorValue = function (editorData) {
        var node = editorData.node, 
            value = editorData.inputElement.value,
            validator = node.tree.validator;
        
        if (Lang.isFunction(validator)) {
            value = validator(value,node.label,node);
            if (Lang.isUndefined(value)) { return false; }
        }
        node.label = value;
        node.getLabelEl().innerHTML = value;
    };

    /**
    * Destroys the contents of the inline editor panel
    * Overrides Node.destroyEditorContent
    * Since we didn't set any event listeners on this inline editor, it is more efficient to avoid the generic method in Node
    * @method destroyEditorContents
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @for YAHOO.widget.TextNode
     */
    TNproto.destroyEditorContents = function (editorData) {
        editorData.inputContainer.innerHTML = '';
    };
})();
YAHOO.register("treeview", YAHOO.widget.TreeView, {version: "2.7.0", build: "1799"});

/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){var G=YAHOO.util.Dom,M=YAHOO.util.Event,I=YAHOO.lang,L=YAHOO.env.ua,B=YAHOO.widget.Overlay,J=YAHOO.widget.Menu,D={},K=null,E=null,C=null;function F(O,N,R,P){var S,Q;if(I.isString(O)&&I.isString(N)){if(L.ie){Q='<input type="'+O+'" name="'+N+'"';if(P){Q+=" checked";}Q+=">";S=document.createElement(Q);}else{S=document.createElement("input");S.name=N;S.type=O;if(P){S.checked=true;}}S.value=R;}return S;}function H(O,U){var N=O.nodeName.toUpperCase(),S=this,T,P,Q;function V(W){if(!(W in U)){T=O.getAttributeNode(W);if(T&&("value" in T)){U[W]=T.value;}}}function R(){V("type");if(U.type=="button"){U.type="push";}if(!("disabled" in U)){U.disabled=O.disabled;}V("name");V("value");V("title");}switch(N){case"A":U.type="link";V("href");V("target");break;case"INPUT":R();if(!("checked" in U)){U.checked=O.checked;}break;case"BUTTON":R();P=O.parentNode.parentNode;if(G.hasClass(P,this.CSS_CLASS_NAME+"-checked")){U.checked=true;}if(G.hasClass(P,this.CSS_CLASS_NAME+"-disabled")){U.disabled=true;}O.removeAttribute("value");O.setAttribute("type","button");break;}O.removeAttribute("id");O.removeAttribute("name");if(!("tabindex" in U)){U.tabindex=O.tabIndex;}if(!("label" in U)){Q=N=="INPUT"?O.value:O.innerHTML;if(Q&&Q.length>0){U.label=Q+"&nbsp;";}}}function A(P){var O=P.attributes,N=O.srcelement,R=N.nodeName.toUpperCase(),Q=this;if(R==this.NODE_NAME){P.element=N;P.id=N.id;G.getElementsBy(function(S){switch(S.nodeName.toUpperCase()){case"BUTTON":case"A":case"INPUT":H.call(Q,S,O);break;}},"*",N);}else{switch(R){case"BUTTON":case"A":case"INPUT":H.call(this,N,O);break;}}}YAHOO.widget.Button=function(R,O){if(!B&&YAHOO.widget.Overlay){B=YAHOO.widget.Overlay;}if(!J&&YAHOO.widget.Menu){J=YAHOO.widget.Menu;}var Q=YAHOO.widget.Button.superclass.constructor,P,N;if(arguments.length==1&&!I.isString(R)&&!R.nodeName){if(!R.id){R.id=G.generateId();}Q.call(this,(this.createButtonElement(R.type)),R);}else{P={element:null,attributes:(O||{})};if(I.isString(R)){N=G.get(R);if(N){if(!P.attributes.id){P.attributes.id=R;}P.attributes.srcelement=N;A.call(this,P);if(!P.element){P.element=this.createButtonElement(P.attributes.type);}Q.call(this,P.element,P.attributes);}}else{if(R.nodeName){if(!P.attributes.id){if(R.id){P.attributes.id=R.id;}else{P.attributes.id=G.generateId();}}P.attributes.srcelement=R;A.call(this,P);if(!P.element){P.element=this.createButtonElement(P.attributes.type);}Q.call(this,P.element,P.attributes);}}}};YAHOO.extend(YAHOO.widget.Button,YAHOO.util.Element,{_button:null,_menu:null,_hiddenFields:null,_onclickAttributeValue:null,_activationKeyPressed:false,_activationButtonPressed:false,_hasKeyEventHandlers:false,_hasMouseEventHandlers:false,_nOptionRegionX:0,NODE_NAME:"SPAN",CHECK_ACTIVATION_KEYS:[32],ACTIVATION_KEYS:[13,32],OPTION_AREA_WIDTH:20,CSS_CLASS_NAME:"yui-button",RADIO_DEFAULT_TITLE:"Unchecked.  Click to check.",RADIO_CHECKED_TITLE:"Checked.  Click another button to uncheck",CHECKBOX_DEFAULT_TITLE:"Unchecked.  Click to check.",CHECKBOX_CHECKED_TITLE:"Checked.  Click to uncheck.",MENUBUTTON_DEFAULT_TITLE:"Menu collapsed.  Click to expand.",MENUBUTTON_MENU_VISIBLE_TITLE:"Menu expanded.  Click or press Esc to collapse.",SPLITBUTTON_DEFAULT_TITLE:("Menu collapsed.  Click inside option "+"region or press down arrow key to show the menu."),SPLITBUTTON_OPTION_VISIBLE_TITLE:"Menu expanded.  Press Esc to hide the menu.",SUBMIT_TITLE:"Click to submit form.",_setType:function(N){if(N=="split"){this.on("option",this._onOption);}},_setLabel:function(O){this._button.innerHTML=O;var P,N=L.gecko;if(N&&N<1.9&&G.inDocument(this.get("element"))){P=this.CSS_CLASS_NAME;this.removeClass(P);I.later(0,this,this.addClass,P);}},_setTabIndex:function(N){this._button.tabIndex=N;},_setTitle:function(O){var N=O;if(this.get("type")!="link"){if(!N){switch(this.get("type")){case"radio":N=this.RADIO_DEFAULT_TITLE;break;case"checkbox":N=this.CHECKBOX_DEFAULT_TITLE;break;case"menu":N=this.MENUBUTTON_DEFAULT_TITLE;break;case"split":N=this.SPLITBUTTON_DEFAULT_TITLE;break;case"submit":N=this.SUBMIT_TITLE;break;}}this._button.title=N;}},_setDisabled:function(N){if(this.get("type")!="link"){if(N){if(this._menu){this._menu.hide();}if(this.hasFocus()){this.blur();}this._button.setAttribute("disabled","disabled");this.addStateCSSClasses("disabled");this.removeStateCSSClasses("hover");this.removeStateCSSClasses("active");this.removeStateCSSClasses("focus");}else{this._button.removeAttribute("disabled");this.removeStateCSSClasses("disabled");}}},_setHref:function(N){if(this.get("type")=="link"){this._button.href=N;}},_setTarget:function(N){if(this.get("type")=="link"){this._button.setAttribute("target",N);}},_setChecked:function(O){var P=this.get("type"),N;if(P=="checkbox"||P=="radio"){if(O){this.addStateCSSClasses("checked");N=(P=="radio")?this.RADIO_CHECKED_TITLE:this.CHECKBOX_CHECKED_TITLE;}else{this.removeStateCSSClasses("checked");N=(P=="radio")?this.RADIO_DEFAULT_TITLE:this.CHECKBOX_DEFAULT_TITLE;}if(!this._hasDefaultTitle){this.set("title",N);}}},_setMenu:function(U){var P=this.get("lazyloadmenu"),R=this.get("element"),N,W=false,X,O,Q;function V(){X.render(R.parentNode);this.removeListener("appendTo",V);}function T(){X.cfg.queueProperty("container",R.parentNode);this.removeListener("appendTo",T);}function S(){var Y;if(X){G.addClass(X.element,this.get("menuclassname"));G.addClass(X.element,"yui-"+this.get("type")+"-button-menu");X.showEvent.subscribe(this._onMenuShow,null,this);X.hideEvent.subscribe(this._onMenuHide,null,this);X.renderEvent.subscribe(this._onMenuRender,null,this);if(J&&X instanceof J){if(P){Y=this.get("container");if(Y){X.cfg.queueProperty("container",Y);}else{this.on("appendTo",T);}}X.cfg.queueProperty("clicktohide",false);X.keyDownEvent.subscribe(this._onMenuKeyDown,this,true);X.subscribe("click",this._onMenuClick,this,true);this.on("selectedMenuItemChange",this._onSelectedMenuItemChange);Q=X.srcElement;if(Q&&Q.nodeName.toUpperCase()=="SELECT"){Q.style.display="none";Q.parentNode.removeChild(Q);}}else{if(B&&X instanceof B){if(!K){K=new YAHOO.widget.OverlayManager();
}K.register(X);}}this._menu=X;if(!W&&!P){if(G.inDocument(R)){X.render(R.parentNode);}else{this.on("appendTo",V);}}}}if(B){if(J){N=J.prototype.CSS_CLASS_NAME;}if(U&&J&&(U instanceof J)){X=U;W=true;S.call(this);}else{if(B&&U&&(U instanceof B)){X=U;W=true;X.cfg.queueProperty("visible",false);S.call(this);}else{if(J&&I.isArray(U)){X=new J(G.generateId(),{lazyload:P,itemdata:U});this._menu=X;this.on("appendTo",S);}else{if(I.isString(U)){O=G.get(U);if(O){if(J&&G.hasClass(O,N)||O.nodeName.toUpperCase()=="SELECT"){X=new J(U,{lazyload:P});S.call(this);}else{if(B){X=new B(U,{visible:false});S.call(this);}}}}else{if(U&&U.nodeName){if(J&&G.hasClass(U,N)||U.nodeName.toUpperCase()=="SELECT"){X=new J(U,{lazyload:P});S.call(this);}else{if(B){if(!U.id){G.generateId(U);}X=new B(U,{visible:false});S.call(this);}}}}}}}}},_setOnClick:function(N){if(this._onclickAttributeValue&&(this._onclickAttributeValue!=N)){this.removeListener("click",this._onclickAttributeValue.fn);this._onclickAttributeValue=null;}if(!this._onclickAttributeValue&&I.isObject(N)&&I.isFunction(N.fn)){this.on("click",N.fn,N.obj,N.scope);this._onclickAttributeValue=N;}},_isActivationKey:function(N){var S=this.get("type"),O=(S=="checkbox"||S=="radio")?this.CHECK_ACTIVATION_KEYS:this.ACTIVATION_KEYS,Q=O.length,R=false,P;if(Q>0){P=Q-1;do{if(N==O[P]){R=true;break;}}while(P--);}return R;},_isSplitButtonOptionKey:function(P){var O=(M.getCharCode(P)==40);var N=function(Q){M.preventDefault(Q);this.removeListener("keypress",N);};if(O){if(L.opera){this.on("keypress",N);}M.preventDefault(P);}return O;},_addListenersToForm:function(){var T=this.getForm(),S=YAHOO.widget.Button.onFormKeyPress,R,N,Q,P,O;if(T){M.on(T,"reset",this._onFormReset,null,this);M.on(T,"submit",this._onFormSubmit,null,this);N=this.get("srcelement");if(this.get("type")=="submit"||(N&&N.type=="submit")){Q=M.getListeners(T,"keypress");R=false;if(Q){P=Q.length;if(P>0){O=P-1;do{if(Q[O].fn==S){R=true;break;}}while(O--);}}if(!R){M.on(T,"keypress",S);}}}},_showMenu:function(R){if(YAHOO.widget.MenuManager){YAHOO.widget.MenuManager.hideVisible();}if(K){K.hideAll();}var N=this._menu,Q=this.get("menualignment"),P=this.get("focusmenu"),O;if(this._renderedMenu){N.cfg.setProperty("context",[this.get("element"),Q[0],Q[1]]);N.cfg.setProperty("preventcontextoverlap",true);N.cfg.setProperty("constraintoviewport",true);}else{N.cfg.queueProperty("context",[this.get("element"),Q[0],Q[1]]);N.cfg.queueProperty("preventcontextoverlap",true);N.cfg.queueProperty("constraintoviewport",true);}this.focus();if(J&&N&&(N instanceof J)){O=N.focus;N.focus=function(){};if(this._renderedMenu){N.cfg.setProperty("minscrollheight",this.get("menuminscrollheight"));N.cfg.setProperty("maxheight",this.get("menumaxheight"));}else{N.cfg.queueProperty("minscrollheight",this.get("menuminscrollheight"));N.cfg.queueProperty("maxheight",this.get("menumaxheight"));}N.show();N.focus=O;N.align();if(R.type=="mousedown"){M.stopPropagation(R);}if(P){N.focus();}}else{if(B&&N&&(N instanceof B)){if(!this._renderedMenu){N.render(this.get("element").parentNode);}N.show();N.align();}}},_hideMenu:function(){var N=this._menu;if(N){N.hide();}},_onMouseOver:function(O){var Q=this.get("type"),N,P;if(Q==="split"){N=this.get("element");P=(G.getX(N)+(N.offsetWidth-this.OPTION_AREA_WIDTH));this._nOptionRegionX=P;}if(!this._hasMouseEventHandlers){if(Q==="split"){this.on("mousemove",this._onMouseMove);}this.on("mouseout",this._onMouseOut);this._hasMouseEventHandlers=true;}this.addStateCSSClasses("hover");if(Q==="split"&&(M.getPageX(O)>P)){this.addStateCSSClasses("hoveroption");}if(this._activationButtonPressed){this.addStateCSSClasses("active");}if(this._bOptionPressed){this.addStateCSSClasses("activeoption");}if(this._activationButtonPressed||this._bOptionPressed){M.removeListener(document,"mouseup",this._onDocumentMouseUp);}},_onMouseMove:function(N){var O=this._nOptionRegionX;if(O){if(M.getPageX(N)>O){this.addStateCSSClasses("hoveroption");}else{this.removeStateCSSClasses("hoveroption");}}},_onMouseOut:function(N){var O=this.get("type");this.removeStateCSSClasses("hover");if(O!="menu"){this.removeStateCSSClasses("active");}if(this._activationButtonPressed||this._bOptionPressed){M.on(document,"mouseup",this._onDocumentMouseUp,null,this);}if(O==="split"&&(M.getPageX(N)>this._nOptionRegionX)){this.removeStateCSSClasses("hoveroption");}},_onDocumentMouseUp:function(P){this._activationButtonPressed=false;this._bOptionPressed=false;var Q=this.get("type"),N,O;if(Q=="menu"||Q=="split"){N=M.getTarget(P);O=this._menu.element;if(N!=O&&!G.isAncestor(O,N)){this.removeStateCSSClasses((Q=="menu"?"active":"activeoption"));this._hideMenu();}}M.removeListener(document,"mouseup",this._onDocumentMouseUp);},_onMouseDown:function(P){var Q,O=true;function N(){this._hideMenu();this.removeListener("mouseup",N);}if((P.which||P.button)==1){if(!this.hasFocus()){this.focus();}Q=this.get("type");if(Q=="split"){if(M.getPageX(P)>this._nOptionRegionX){this.fireEvent("option",P);O=false;}else{this.addStateCSSClasses("active");this._activationButtonPressed=true;}}else{if(Q=="menu"){if(this.isActive()){this._hideMenu();this._activationButtonPressed=false;}else{this._showMenu(P);this._activationButtonPressed=true;}}else{this.addStateCSSClasses("active");this._activationButtonPressed=true;}}if(Q=="split"||Q=="menu"){this._hideMenuTimer=I.later(250,this,this.on,["mouseup",N]);}}return O;},_onMouseUp:function(P){var Q=this.get("type"),N=this._hideMenuTimer,O=true;if(N){N.cancel();}if(Q=="checkbox"||Q=="radio"){this.set("checked",!(this.get("checked")));}this._activationButtonPressed=false;if(Q!="menu"){this.removeStateCSSClasses("active");}if(Q=="split"&&M.getPageX(P)>this._nOptionRegionX){O=false;}return O;},_onFocus:function(O){var N;this.addStateCSSClasses("focus");if(this._activationKeyPressed){this.addStateCSSClasses("active");}C=this;if(!this._hasKeyEventHandlers){N=this._button;M.on(N,"blur",this._onBlur,null,this);M.on(N,"keydown",this._onKeyDown,null,this);M.on(N,"keyup",this._onKeyUp,null,this);
this._hasKeyEventHandlers=true;}this.fireEvent("focus",O);},_onBlur:function(N){this.removeStateCSSClasses("focus");if(this.get("type")!="menu"){this.removeStateCSSClasses("active");}if(this._activationKeyPressed){M.on(document,"keyup",this._onDocumentKeyUp,null,this);}C=null;this.fireEvent("blur",N);},_onDocumentKeyUp:function(N){if(this._isActivationKey(M.getCharCode(N))){this._activationKeyPressed=false;M.removeListener(document,"keyup",this._onDocumentKeyUp);}},_onKeyDown:function(O){var N=this._menu;if(this.get("type")=="split"&&this._isSplitButtonOptionKey(O)){this.fireEvent("option",O);}else{if(this._isActivationKey(M.getCharCode(O))){if(this.get("type")=="menu"){this._showMenu(O);}else{this._activationKeyPressed=true;this.addStateCSSClasses("active");}}}if(N&&N.cfg.getProperty("visible")&&M.getCharCode(O)==27){N.hide();this.focus();}},_onKeyUp:function(N){var O;if(this._isActivationKey(M.getCharCode(N))){O=this.get("type");if(O=="checkbox"||O=="radio"){this.set("checked",!(this.get("checked")));}this._activationKeyPressed=false;if(this.get("type")!="menu"){this.removeStateCSSClasses("active");}}},_onClick:function(Q){var S=this.get("type"),N,R,O,P;switch(S){case"radio":case"checkbox":if(!this._hasDefaultTitle){if(this.get("checked")){N=(S=="radio")?this.RADIO_CHECKED_TITLE:this.CHECKBOX_CHECKED_TITLE;}else{N=(S=="radio")?this.RADIO_DEFAULT_TITLE:this.CHECKBOX_DEFAULT_TITLE;}this.set("title",N);}break;case"submit":if(Q.returnValue!==false){this.submitForm();}break;case"reset":R=this.getForm();if(R){R.reset();}break;case"menu":N=this._menu.cfg.getProperty("visible")?this.MENUBUTTON_MENU_VISIBLE_TITLE:this.MENUBUTTON_DEFAULT_TITLE;this.set("title",N);break;case"split":if(this._nOptionRegionX>0&&(M.getPageX(Q)>this._nOptionRegionX)){P=false;}else{this._hideMenu();O=this.get("srcelement");if(O&&O.type=="submit"&&Q.returnValue!==false){this.submitForm();}}N=this._menu.cfg.getProperty("visible")?this.SPLITBUTTON_OPTION_VISIBLE_TITLE:this.SPLITBUTTON_DEFAULT_TITLE;this.set("title",N);break;}return P;},_onDblClick:function(O){var N=true;if(this.get("type")=="split"&&M.getPageX(O)>this._nOptionRegionX){N=false;}return N;},_onAppendTo:function(N){I.later(0,this,this._addListenersToForm);},_onFormReset:function(O){var P=this.get("type"),N=this._menu;if(P=="checkbox"||P=="radio"){this.resetValue("checked");}if(J&&N&&(N instanceof J)){this.resetValue("selectedMenuItem");}},_onFormSubmit:function(N){this.createHiddenFields();},_onDocumentMouseDown:function(Q){var N=M.getTarget(Q),P=this.get("element"),O=this._menu.element;if(N!=P&&!G.isAncestor(P,N)&&N!=O&&!G.isAncestor(O,N)){this._hideMenu();M.removeListener(document,"mousedown",this._onDocumentMouseDown);}},_onOption:function(N){if(this.hasClass("yui-split-button-activeoption")){this._hideMenu();this._bOptionPressed=false;}else{this._showMenu(N);this._bOptionPressed=true;}},_onMenuShow:function(O){M.on(document,"mousedown",this._onDocumentMouseDown,null,this);var N,P;if(this.get("type")=="split"){N=this.SPLITBUTTON_OPTION_VISIBLE_TITLE;P="activeoption";}else{N=this.MENUBUTTON_MENU_VISIBLE_TITLE;P="active";}this.addStateCSSClasses(P);this.set("title",N);},_onMenuHide:function(P){var O=this._menu,N,Q;if(this.get("type")=="split"){N=this.SPLITBUTTON_DEFAULT_TITLE;Q="activeoption";}else{N=this.MENUBUTTON_DEFAULT_TITLE;Q="active";}this.removeStateCSSClasses(Q);this.set("title",N);if(this.get("type")=="split"){this._bOptionPressed=false;}},_onMenuKeyDown:function(P,O){var N=O[0];if(M.getCharCode(N)==27){this.focus();if(this.get("type")=="split"){this._bOptionPressed=false;}}},_onMenuRender:function(P){var S=this.get("element"),O=S.parentNode,N=this._menu,R=N.element,Q=N.srcElement;if(O!=R.parentNode){O.appendChild(R);}this._renderedMenu=true;if(Q&&Q.nodeName.toLowerCase()==="select"&&Q.value){this.set("selectedMenuItem",N.getItem(Q.selectedIndex));}},_onMenuClick:function(O,N){var Q=N[1],P;if(Q){this.set("selectedMenuItem",Q);P=this.get("srcelement");if(P&&P.type=="submit"){this.submitForm();}this._hideMenu();}},_onSelectedMenuItemChange:function(N){var O=N.prevValue,P=N.newValue;if(O){G.removeClass(O.element,"yui-button-selectedmenuitem");}if(P){G.addClass(P.element,"yui-button-selectedmenuitem");}},createButtonElement:function(N){var P=this.NODE_NAME,O=document.createElement(P);O.innerHTML="<"+P+' class="first-child">'+(N=="link"?"<a></a>":'<button type="button"></button>')+"</"+P+">";return O;},addStateCSSClasses:function(N){var O=this.get("type");if(I.isString(N)){if(N!="activeoption"&&N!="hoveroption"){this.addClass(this.CSS_CLASS_NAME+("-"+N));}this.addClass("yui-"+O+("-button-"+N));}},removeStateCSSClasses:function(N){var O=this.get("type");if(I.isString(N)){this.removeClass(this.CSS_CLASS_NAME+("-"+N));this.removeClass("yui-"+O+("-button-"+N));}},createHiddenFields:function(){this.removeHiddenFields();var V=this.getForm(),Z,O,S,X,Y,T,U,N,R,W,P,Q=false;if(V&&!this.get("disabled")){O=this.get("type");S=(O=="checkbox"||O=="radio");if((S&&this.get("checked"))||(E==this)){Z=F((S?O:"hidden"),this.get("name"),this.get("value"),this.get("checked"));if(Z){if(S){Z.style.display="none";}V.appendChild(Z);}}X=this._menu;if(J&&X&&(X instanceof J)){Y=this.get("selectedMenuItem");P=X.srcElement;Q=(P&&P.nodeName.toUpperCase()=="SELECT");if(Y){U=(Y.value===null||Y.value==="")?Y.cfg.getProperty("text"):Y.value;T=this.get("name");if(Q){W=P.name;}else{if(T){W=(T+"_options");}}if(U&&W){N=F("hidden",W,U);V.appendChild(N);}}else{if(Q){V.appendChild(P);}}}if(Z&&N){this._hiddenFields=[Z,N];}else{if(!Z&&N){this._hiddenFields=N;}else{if(Z&&!N){this._hiddenFields=Z;}}}R=this._hiddenFields;}return R;},removeHiddenFields:function(){var Q=this._hiddenFields,O,P;function N(R){if(G.inDocument(R)){R.parentNode.removeChild(R);}}if(Q){if(I.isArray(Q)){O=Q.length;if(O>0){P=O-1;do{N(Q[P]);}while(P--);}}else{N(Q);}this._hiddenFields=null;}},submitForm:function(){var Q=this.getForm(),P=this.get("srcelement"),O=false,N;if(Q){if(this.get("type")=="submit"||(P&&P.type=="submit")){E=this;
}if(L.ie){O=Q.fireEvent("onsubmit");}else{N=document.createEvent("HTMLEvents");N.initEvent("submit",true,true);O=Q.dispatchEvent(N);}if((L.ie||L.webkit)&&O){Q.submit();}}return O;},init:function(O,a){var Q=a.type=="link"?"a":"button",V=a.srcelement,Z=O.getElementsByTagName(Q)[0],X;if(!Z){X=O.getElementsByTagName("input")[0];if(X){Z=document.createElement("button");Z.setAttribute("type","button");X.parentNode.replaceChild(Z,X);}}this._button=Z;this._hasDefaultTitle=(a.title&&a.title.length>0);YAHOO.widget.Button.superclass.init.call(this,O,a);var T=this.get("id"),N=T+"-button";Z.id=N;var U,W;var d=function(e){return(e.htmlFor===T);};var S=function(){W.setAttribute((L.ie?"htmlFor":"for"),N);};if(V&&this.get("type")!="link"){U=G.getElementsBy(d,"label");if(I.isArray(U)&&U.length>0){W=U[0];}}D[T]=this;this.addClass(this.CSS_CLASS_NAME);this.addClass("yui-"+this.get("type")+"-button");M.on(this._button,"focus",this._onFocus,null,this);this.on("mouseover",this._onMouseOver);this.on("mousedown",this._onMouseDown);this.on("mouseup",this._onMouseUp);this.on("click",this._onClick);var Y=this.get("onclick");this.set("onclick",null);this.set("onclick",Y);this.on("dblclick",this._onDblClick);if(W){this.on("appendTo",S);}this.on("appendTo",this._onAppendTo);var c=this.get("container"),P=this.get("element"),b=G.inDocument(P),R;if(c){if(V&&V!=P){R=V.parentNode;if(R){R.removeChild(V);}}if(I.isString(c)){M.onContentReady(c,this.appendTo,c,this);}else{this.on("init",function(){I.later(0,this,this.appendTo,c);});}}else{if(!b&&V&&V!=P){R=V.parentNode;if(R){this.fireEvent("beforeAppendTo",{type:"beforeAppendTo",target:R});R.replaceChild(P,V);this.fireEvent("appendTo",{type:"appendTo",target:R});}}else{if(this.get("type")!="link"&&b&&V&&V==P){this._addListenersToForm();}}}this.fireEvent("init",{type:"init",target:this});},initAttributes:function(O){var N=O||{};YAHOO.widget.Button.superclass.initAttributes.call(this,N);this.setAttributeConfig("type",{value:(N.type||"push"),validator:I.isString,writeOnce:true,method:this._setType});this.setAttributeConfig("label",{value:N.label,validator:I.isString,method:this._setLabel});this.setAttributeConfig("value",{value:N.value});this.setAttributeConfig("name",{value:N.name,validator:I.isString});this.setAttributeConfig("tabindex",{value:N.tabindex,validator:I.isNumber,method:this._setTabIndex});this.configureAttribute("title",{value:N.title,validator:I.isString,method:this._setTitle});this.setAttributeConfig("disabled",{value:(N.disabled||false),validator:I.isBoolean,method:this._setDisabled});this.setAttributeConfig("href",{value:N.href,validator:I.isString,method:this._setHref});this.setAttributeConfig("target",{value:N.target,validator:I.isString,method:this._setTarget});this.setAttributeConfig("checked",{value:(N.checked||false),validator:I.isBoolean,method:this._setChecked});this.setAttributeConfig("container",{value:N.container,writeOnce:true});this.setAttributeConfig("srcelement",{value:N.srcelement,writeOnce:true});this.setAttributeConfig("menu",{value:null,method:this._setMenu,writeOnce:true});this.setAttributeConfig("lazyloadmenu",{value:(N.lazyloadmenu===false?false:true),validator:I.isBoolean,writeOnce:true});this.setAttributeConfig("menuclassname",{value:(N.menuclassname||"yui-button-menu"),validator:I.isString,method:this._setMenuClassName,writeOnce:true});this.setAttributeConfig("menuminscrollheight",{value:(N.menuminscrollheight||90),validator:I.isNumber});this.setAttributeConfig("menumaxheight",{value:(N.menumaxheight||0),validator:I.isNumber});this.setAttributeConfig("menualignment",{value:(N.menualignment||["tl","bl"]),validator:I.isArray});this.setAttributeConfig("selectedMenuItem",{value:null});this.setAttributeConfig("onclick",{value:N.onclick,method:this._setOnClick});this.setAttributeConfig("focusmenu",{value:(N.focusmenu===false?false:true),validator:I.isBoolean});},focus:function(){if(!this.get("disabled")){this._button.focus();}},blur:function(){if(!this.get("disabled")){this._button.blur();}},hasFocus:function(){return(C==this);},isActive:function(){return this.hasClass(this.CSS_CLASS_NAME+"-active");},getMenu:function(){return this._menu;},getForm:function(){var N=this._button,O;if(N){O=N.form;}return O;},getHiddenFields:function(){return this._hiddenFields;},destroy:function(){var P=this.get("element"),O=P.parentNode,N=this._menu,R;if(N){if(K&&K.find(N)){K.remove(N);}N.destroy();}M.purgeElement(P);M.purgeElement(this._button);M.removeListener(document,"mouseup",this._onDocumentMouseUp);M.removeListener(document,"keyup",this._onDocumentKeyUp);M.removeListener(document,"mousedown",this._onDocumentMouseDown);var Q=this.getForm();if(Q){M.removeListener(Q,"reset",this._onFormReset);M.removeListener(Q,"submit",this._onFormSubmit);}this.unsubscribeAll();if(O){O.removeChild(P);}delete D[this.get("id")];R=G.getElementsByClassName(this.CSS_CLASS_NAME,this.NODE_NAME,Q);if(I.isArray(R)&&R.length===0){M.removeListener(Q,"keypress",YAHOO.widget.Button.onFormKeyPress);}},fireEvent:function(O,N){var P=arguments[0];if(this.DOM_EVENTS[P]&&this.get("disabled")){return false;}return YAHOO.widget.Button.superclass.fireEvent.apply(this,arguments);},toString:function(){return("Button "+this.get("id"));}});YAHOO.widget.Button.onFormKeyPress=function(R){var P=M.getTarget(R),S=M.getCharCode(R),Q=P.nodeName&&P.nodeName.toUpperCase(),N=P.type,T=false,V,X,O,W;function U(a){var Z,Y;switch(a.nodeName.toUpperCase()){case"INPUT":case"BUTTON":if(a.type=="submit"&&!a.disabled){if(!T&&!O){O=a;}}break;default:Z=a.id;if(Z){V=D[Z];if(V){T=true;if(!V.get("disabled")){Y=V.get("srcelement");if(!X&&(V.get("type")=="submit"||(Y&&Y.type=="submit"))){X=V;}}}}break;}}if(S==13&&((Q=="INPUT"&&(N=="text"||N=="password"||N=="checkbox"||N=="radio"||N=="file"))||Q=="SELECT")){G.getElementsBy(U,"*",this);if(O){O.focus();}else{if(!O&&X){M.preventDefault(R);if(L.ie){X.get("element").fireEvent("onclick");}else{W=document.createEvent("HTMLEvents");W.initEvent("click",true,true);if(L.gecko<1.9){X.fireEvent("click",W);
}else{X.get("element").dispatchEvent(W);}}}}}};YAHOO.widget.Button.addHiddenFieldsToForm=function(N){var S=G.getElementsByClassName(YAHOO.widget.Button.prototype.CSS_CLASS_NAME,"*",N),Q=S.length,R,O,P;if(Q>0){for(P=0;P<Q;P++){O=S[P].id;if(O){R=D[O];if(R){R.createHiddenFields();}}}}};YAHOO.widget.Button.getButton=function(N){return D[N];};})();(function(){var C=YAHOO.util.Dom,B=YAHOO.util.Event,D=YAHOO.lang,A=YAHOO.widget.Button,E={};YAHOO.widget.ButtonGroup=function(J,H){var I=YAHOO.widget.ButtonGroup.superclass.constructor,K,G,F;if(arguments.length==1&&!D.isString(J)&&!J.nodeName){if(!J.id){F=C.generateId();J.id=F;}I.call(this,(this._createGroupElement()),J);}else{if(D.isString(J)){G=C.get(J);if(G){if(G.nodeName.toUpperCase()==this.NODE_NAME){I.call(this,G,H);}}}else{K=J.nodeName.toUpperCase();if(K&&K==this.NODE_NAME){if(!J.id){J.id=C.generateId();}I.call(this,J,H);}}}};YAHOO.extend(YAHOO.widget.ButtonGroup,YAHOO.util.Element,{_buttons:null,NODE_NAME:"DIV",CSS_CLASS_NAME:"yui-buttongroup",_createGroupElement:function(){var F=document.createElement(this.NODE_NAME);return F;},_setDisabled:function(G){var H=this.getCount(),F;if(H>0){F=H-1;do{this._buttons[F].set("disabled",G);}while(F--);}},_onKeyDown:function(K){var G=B.getTarget(K),I=B.getCharCode(K),H=G.parentNode.parentNode.id,J=E[H],F=-1;if(I==37||I==38){F=(J.index===0)?(this._buttons.length-1):(J.index-1);}else{if(I==39||I==40){F=(J.index===(this._buttons.length-1))?0:(J.index+1);}}if(F>-1){this.check(F);this.getButton(F).focus();}},_onAppendTo:function(H){var I=this._buttons,G=I.length,F;for(F=0;F<G;F++){I[F].appendTo(this.get("element"));}},_onButtonCheckedChange:function(G,F){var I=G.newValue,H=this.get("checkedButton");if(I&&H!=F){if(H){H.set("checked",false,true);}this.set("checkedButton",F);this.set("value",F.get("value"));}else{if(H&&!H.set("checked")){H.set("checked",true,true);}}},init:function(I,H){this._buttons=[];YAHOO.widget.ButtonGroup.superclass.init.call(this,I,H);this.addClass(this.CSS_CLASS_NAME);var J=this.getElementsByClassName("yui-radio-button");if(J.length>0){this.addButtons(J);}function F(K){return(K.type=="radio");}J=C.getElementsBy(F,"input",this.get("element"));if(J.length>0){this.addButtons(J);}this.on("keydown",this._onKeyDown);this.on("appendTo",this._onAppendTo);var G=this.get("container");if(G){if(D.isString(G)){B.onContentReady(G,function(){this.appendTo(G);},null,this);}else{this.appendTo(G);}}},initAttributes:function(G){var F=G||{};YAHOO.widget.ButtonGroup.superclass.initAttributes.call(this,F);this.setAttributeConfig("name",{value:F.name,validator:D.isString});this.setAttributeConfig("disabled",{value:(F.disabled||false),validator:D.isBoolean,method:this._setDisabled});this.setAttributeConfig("value",{value:F.value});this.setAttributeConfig("container",{value:F.container,writeOnce:true});this.setAttributeConfig("checkedButton",{value:null});},addButton:function(J){var L,K,G,F,H,I;if(J instanceof A&&J.get("type")=="radio"){L=J;}else{if(!D.isString(J)&&!J.nodeName){J.type="radio";L=new A(J);}else{L=new A(J,{type:"radio"});}}if(L){F=this._buttons.length;H=L.get("name");I=this.get("name");L.index=F;this._buttons[F]=L;E[L.get("id")]=L;if(H!=I){L.set("name",I);}if(this.get("disabled")){L.set("disabled",true);}if(L.get("checked")){this.set("checkedButton",L);}K=L.get("element");G=this.get("element");if(K.parentNode!=G){G.appendChild(K);}L.on("checkedChange",this._onButtonCheckedChange,L,this);}return L;},addButtons:function(G){var H,I,J,F;if(D.isArray(G)){H=G.length;J=[];if(H>0){for(F=0;F<H;F++){I=this.addButton(G[F]);if(I){J[J.length]=I;}}}}return J;},removeButton:function(H){var I=this.getButton(H),G,F;if(I){this._buttons.splice(H,1);delete E[I.get("id")];I.removeListener("checkedChange",this._onButtonCheckedChange);I.destroy();G=this._buttons.length;if(G>0){F=this._buttons.length-1;do{this._buttons[F].index=F;}while(F--);}}},getButton:function(F){return this._buttons[F];},getButtons:function(){return this._buttons;},getCount:function(){return this._buttons.length;},focus:function(H){var I,G,F;if(D.isNumber(H)){I=this._buttons[H];if(I){I.focus();}}else{G=this.getCount();for(F=0;F<G;F++){I=this._buttons[F];if(!I.get("disabled")){I.focus();break;}}}},check:function(F){var G=this.getButton(F);if(G){G.set("checked",true);}},destroy:function(){var I=this._buttons.length,H=this.get("element"),F=H.parentNode,G;if(I>0){G=this._buttons.length-1;do{this._buttons[G].destroy();}while(G--);}B.purgeElement(H);F.removeChild(H);},toString:function(){return("ButtonGroup "+this.get("id"));}});})();YAHOO.register("button",YAHOO.widget.Button,{version:"2.7.0",build:"1799"});
if(typeof(i3GEO)==='undefined'){i3GEO=[]}cpJSON=new cpaint();cpJSON.set_response_type("JSON");i3GEO.php={verifica:function(){if(i3GEO.configura.locaplic===undefined){alert("variavel i3GEO.configura.locaplic n&atilde;o esta definida")}if(i3GEO.configura.sid===undefined){alert("variavel i3GEO.configura.locaplic n&atilde;o esta definida")}},insereSHPgrafico:function(funcao,tema,x,y,itens,shadow_height,width,inclinacao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHPgrafico&tipo=pizza&tema="+tema+"&x="+x+"&y="+y+"&itens="+itens+"&shadow_height="+shadow_height+"&width="+width+"&inclinacao="+inclinacao+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"insereSHPgrafico",funcao)},insereSHP:function(funcao,tema,item,valoritem,xy,projecao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHP&item="+item+"&valor="+valoritem+"&tema="+tema+"&xy="+xy+"&projecao="+projecao+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"insereSHP",funcao)},pegaMensagens:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaMensagens&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"pegaMensagem",funcao)},areaPixel:function(funcao,g_celula){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=areaPixel&celsize="+g_celula+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"areaPixel",funcao)},excluitema:function(funcao,tema){var layer;i3GEO.php.verifica();var retorno=function(retorno){if(i3GEO.Interface.ATUAL==="openlayers"){layers=i3geoOL.getLayersByName(tema);if(layers.length>0){i3geoOL.removeLayer(layers[0])}}funcao.call(retorno)};var p=i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=excluitema&temas="+tema+"&g_sid="+i3GEO.arvoreDeCamadas.SID;cpJSON.call(p,"excluitema",retorno)},reordenatemas:function(funcao,lista){i3GEO.php.verifica();var p=i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=reordenatemas&lista="+lista+"&g_sid="+i3GEO.arvoreDeCamadas.SID;cpJSON.call(p,"reordenatemas",funcao)},criaLegendaHTML:function(funcao,tema,template){i3GEO.php.verifica();if(arguments.length===1){tema="";template="legenda2.htm"}if(arguments.length===2){template="legenda2.htm"}var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaHTML&tema="+tema+"&templateLegenda="+template+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"criaLegendaHTML",funcao)},inverteStatusClasse:function(funcao,tema,classe){i3GEO.php.verifica();var p=i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=inverteStatusClasse&g_sid="+i3GEO.arvoreDeCamadas.SID+"&tema="+tema+"&classe="+classe;cpJSON.call(p,"inverteStatusClasse",funcao)},ligatemas:function(funcao,desligar,ligar,adicionar){i3GEO.php.verifica();if(arguments.length===3){adicionar="nao"}var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=ligatemas&desligar="+desligar+"&ligar="+ligar+"&adicionar="+adicionar+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"ligaDesligaTemas",funcao)},pegalistademenus:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistademenus&g_sid="+i3GEO.configura.sid+"&map_file=&idioma="+i3GEO.idioma.ATUAL;cpJSON.call(p,"pegalistademenus",funcao)},pegalistadegrupos:function(funcao,id_menu,listasgrupos){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadegrupos&map_file=&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&listasistemas=nao&listasgrupos="+listasgrupos+"&idioma="+i3GEO.idioma.ATUAL;cpJSON.call(p,"pegalistadegrupos",funcao)},pegalistadeSubgrupos:function(funcao,id_menu,id_grupo){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadeSubgrupos&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&grupo="+id_grupo+"&map_file=&idioma="+i3GEO.idioma.ATUAL;cpJSON.call(p,"pegalistadeSubgrupos",funcao)},pegalistadetemas:function(funcao,id_menu,id_grupo,id_subgrupo){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadetemas&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&grupo="+id_grupo+"&subgrupo="+id_subgrupo+"&map_file=&idioma="+i3GEO.idioma.ATUAL;cpJSON.call(p,"pegalistadetemas",funcao)},listaTemas:function(funcao,tipo,locaplic,sid){if(arguments.length===2){locaplic=i3GEO.configura.locaplic;sid=i3GEO.configura.sid}var p=locaplic+"/classesphp/mapa_controle.php?funcao=listatemas&g_sid="+sid+"&tipo="+tipo;cpJSON.call(p,"listaTemas",funcao)},listaTemasEditaveis:function(funcao,locaplic,sid){if(arguments.length===1){locaplic=i3GEO.configura.locaplic;sid=i3GEO.configura.sid}var p=locaplic+"/classesphp/mapa_controle.php?funcao=listatemaslocais&g_sid="+sid;cpJSON.call(p,"listatemaslocais",funcao)},listaTemasComSel:function(funcao,locaplic,sid){if(arguments.length===1){locaplic=i3GEO.configura.locaplic;sid=i3GEO.configura.sid}var p=locaplic+"/classesphp/mapa_controle.php?funcao=listatemascomsel&g_sid="+sid;cpJSON.call(p,"listaTemasComSel",funcao)},listatemasTipo:function(funcao,tipo,locaplic,sid){if(arguments.length===2){locaplic=i3GEO.configura.locaplic;sid=i3GEO.configura.sid}var p=locaplic+"/classesphp/mapa_controle.php?funcao=&funcao=listatemasTipo&tipo="+tipo+"&g_sid="+sid;cpJSON.call(p,"listatemasTipo",funcao)},pegaSistemas:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaSistemas&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"pegaSistemas",funcao)},listadrives:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=listaDrives&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"listaDrives",funcao)},listaarquivos:function(funcao,caminho){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaArquivos&diretorio="+caminho;cpJSON.call(p,"listaArquivos",funcao)},geo2utm:function(funcao,x,y){i3GEO.php.verifica();if($i("aguardeGifAberto")||x<-180){return}var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=geo2utm&x="+x+"&y="+y+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"geo2utm",funcao)},desativacgi:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=desativacgi&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"desativacgi",funcao)},pegaMapas:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaMapas&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"pegaSistemas",funcao)},mudatamanho:function(funcao,altura,largura){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudatamanho&altura="+altura+"&largura="+largura+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"pegaSistemas",funcao)},ativalogo:function(funcao,altura,largura){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=ativalogo&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"ativalogo",funcao)},insereAnnotation:function(funcao,pin,xy,texto,position,partials,offsetx,offsety,minfeaturesize,mindistance,force,shadowcolor,shadowsizex,shadowsizey,outlinecolor,cor,sombray,sombrax,sombra,fundo,angulo,tamanho,fonte){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=inserefeature&pin="+pin+"&tipo=ANNOTATION&xy="+xy+"&texto="+texto+"&position="+position+"&partials="+partials+"&offsetx="+offsetx+"&offsety="+offsety+"&minfeaturesize="+minfeaturesize+"&mindistance="+mindistance+"&force="+force+"&shadowcolor="+shadowcolor+"&shadowsizex="+shadowsizex+"&shadowsizey="+shadowsizey+"&outlinecolor="+outlinecolor+"&cor="+cor+"&sombray="+sombray+"&sombrax="+sombrax+"&sombra="+sombra+"&fundo="+fundo+"&angulo="+angulo+"&tamanho="+tamanho+"&fonte="+fonte+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"inserefeature",funcao)},identificaunico:function(funcao,xy,tema,item){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=identificaunico&xy="+xy+"&resolucao=5&tema="+tema+"&item="+item+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"identificaunico",funcao)},recuperamapa:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=recuperamapa&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"recuperamapa",funcao)},criaLegendaImagem:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaImagem&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"criaLegendaImagem",funcao)},referenciadinamica:function(funcao,zoom,tipo){i3GEO.php.verifica();if(arguments.length===2){tipo="dinamico"}var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=referenciadinamica&g_sid="+i3GEO.configura.sid+"&zoom="+zoom+"&tipo="+tipo+"&ext="+i3GEO.parametros.mapexten;cpJSON.call(p,"retornaReferenciaDinamica",funcao)},referencia:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=referencia&g_sid="+i3GEO.configura.sid+"&ext="+i3GEO.parametros.mapexten;cpJSON.call(p,"retornaReferencia",funcao)},pan:function(funcao,escala,tipo,x,y){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pan&escala="+escala+"&tipo="+tipo+"&x="+x+"&y="+y+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"pan",funcao)},aproxima:function(funcao,nivel){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=aproxima&nivel="+nivel+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"aproxima",funcao)},afasta:function(funcao,nivel){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=afasta&nivel="+nivel+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"afasta",funcao)},zoomponto:function(funcao,x,y){i3GEO.php.verifica();var retorno=function(retorno){if(i3GEO.Interface.ATUAL==="openlayers"){i3GEO.Interface.openlayers.pan2ponto(x,y);i3GEO.janela.fechaAguarde()}funcao.call(retorno)};var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=zoomponto&pin=pin&xy="+x+" "+y+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"zoomponto",retorno)},localizaIP:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=localizaIP&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"localizaIP",funcao)},mudaext:function(funcao,tipoimagem,ext,locaplic,sid){var retorno,p;if(arguments.length===3){i3GEO.php.verifica();locaplic=i3GEO.configura.locaplic;sid=i3GEO.configura.sid}if(ext==='undefined'){alert("extensao nao definida");return}retorno=function(retorno){if(i3GEO.Interface.ATUAL==="googlemaps"){i3GEO.Interface.googlemaps.zoom2extent(ext);i3GEO.janela.fechaAguarde()}if(i3GEO.Interface.ATUAL==="googleearth"){i3GEO.Interface.googleearth.redesenha();i3GEO.janela.fechaAguarde()}if(i3GEO.Interface.ATUAL==="openlayers"){i3GEO.Interface.openlayers.zoom2ext(ext);i3GEO.janela.fechaAguarde()}funcao.call(retorno)};p=locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&tipoimagem="+tipoimagem+"&ext="+ext+"&g_sid="+sid;cpJSON.call(p,"mudaext",retorno)},mudaescala:function(funcao,escala){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudaescala&escala="+escala+"&g_sid="+i3GEO.configura.sid+"&tipoimagem="+i3GEO.configura.tipoimagem;cpJSON.call(p,"mudaescala",funcao)},aplicaResolucao:function(funcao,resolucao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=crialente&resolucao="+resolucao+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"crialente",funcao)},geradestaque:function(funcao,tema){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=geradestaque&tema="+tema+"&g_sid="+i3GEO.configura.sid+"&ext="+i3GEO.parametros.mapexten;cpJSON.call(p,"geradestaque",funcao)},selecaopt:function(funcao,tema,xy,tipo,tolerancia){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=selecaopt&tema="+tema+"&tipo="+tipo+"&xy="+xy+"&tolerancia="+tolerancia+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"selecaoPT",funcao)},selecaobox:function(funcao,tema,tipo,box){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=selecaobox&ext="+box+"&g_sid="+i3GEO.configura.sid+"&tipo="+tipo+"&tema="+tema;cpJSON.call(p,"selecaobox",funcao)},selecaoext:function(funcao,tema,tipo){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=selecaoext&tema="+tema+"&tipo="+tipo;cpJSON.call(p,"selecaobox",funcao)},selecaoatrib2:function(funcao,tema,filtro,tipo){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=selecaoatrib2&tema="+tema+"&filtro="+filtro+"&tipo="+tipo;cpJSON.call(p,"selecaoatrib2",funcao)},selecaotema:function(funcao,temao,tema,tipo){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=selecaotema&temao="+temao+"&tema="+tema+"&tipo="+tipo;cpJSON.call(p,"selecaotema",funcao)},sobetema:function(funcao,tema){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=sobetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"sobetema",funcao)},descetema:function(funcao,tema){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?&funcao=descetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"descetema",funcao)},fontetema:function(funcao,tema){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=fontetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"fontetema",funcao)},zoomtema:function(funcao,tema){i3GEO.php.verifica();var retorno,p;retorno=function(retorno){if(i3GEO.Interface.ATUAL==="googlemaps"){eval(retorno.data.variaveis);i3GEO.Interface.googlemaps.zoom2extent(mapexten);i3GEO.janela.fechaAguarde()}if(i3GEO.Interface.ATUAL==="openlayers"){eval(retorno.data.variaveis);i3GEO.Interface.openlayers.zoom2ext(mapexten);i3GEO.janela.fechaAguarde()}if(i3GEO.Interface.ATUAL==="padrao"){i3GEO.atualiza(retorno)}};p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=zoomtema&tema="+tema+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"zoomtema",retorno)},zoomsel:function(funcao,tema){i3GEO.php.verifica();var retorno,p;retorno=function(retorno){if(i3GEO.Interface.ATUAL==="googlemaps"){eval(retorno.data.variaveis);i3GEO.Interface.googlemaps.zoom2extent(mapexten);i3GEO.janela.fechaAguarde()}if(i3GEO.Interface.ATUAL==="openlayers"){eval(retorno.data.variaveis);i3GEO.Interface.openlayers.zoom2ext(mapexten);i3GEO.janela.fechaAguarde()}if(i3GEO.Interface.ATUAL==="padrao"){i3GEO.atualiza(retorno)}};p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=zoomsel&tema="+tema+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"zoomsel",retorno)},limpasel:function(funcao,tema){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=limpasel&tema="+tema+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"limpasel",funcao)},mudatransp:function(funcao,tema,valor){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudatransp&tema="+tema+"&valor="+valor+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"mudatransp",funcao)},mudanome:function(funcao,tema,valor){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudanome&tema="+tema+"&valor="+valor+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"mudanome",funcao)},adicionaTemaWMS:function(funcao,servico,tema,nome,proj,formato,versao,nomecamada,tiporep,suportasld,formatosinfo,locaplic,sid){if(arguments.length===11){i3GEO.php.verifica();locaplic=i3GEO.configura.locaplic;sid=i3GEO.configura.sid}var p=locaplic+"/classesphp/mapa_controle.php?g_sid="+sid+"&funcao=adicionatemawms&servico="+servico+"&tema="+tema+"&nome="+nome+"&proj="+proj+"&formato="+formato+"&versao="+versao+"&nomecamada="+nomecamada+"&tiporep="+tiporep+"&suportasld="+suportasld+"&formatosinfo="+formatosinfo;cpJSON.call(p,"adicionatemawms",funcao)},adicionaTemaSHP:function(funcao,path){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionaTemaSHP&arq="+path;cpJSON.call(p,"adicionaTemaSHP",funcao)},adicionaTemaIMG:function(funcao,path){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionaTemaIMG&arq="+path;cpJSON.call(p,"adicionaTemaIMG",funcao)},identifica:function(funcao,x,y,resolucao,locaplic,sid){var p=locaplic+"/classesphp/mapa_controle.php?funcao=identifica&opcao=tip&xy="+x+","+y+"&resolucao=5&g_sid="+sid;cpJSON.call(p,"identifica",funcao)},identifica2:function(funcao,x,y,resolucao,opcao,locaplic,sid,tema,ext,listaDeTemas){if(arguments.length===4){opcao="tip";locaplic=i3GEO.configura.locaplic;sid=i3GEO.configura.sid;ext="";listaDeTemas=""}if(arguments.length===5){locaplic=i3GEO.configura.locaplic;sid=i3GEO.configura.sid;ext="";listaDeTemas=""}if(listaDeTemas===undefined){listaDeTemas=""}var p=locaplic+"/classesphp/mapa_controle.php?funcao=identifica2&opcao="+opcao+"&xy="+x+","+y+"&resolucao=5&g_sid="+sid+"&ext="+ext+"&listaDeTemas="+listaDeTemas;if(opcao!=="tip"){p+="&tema="+tema}cpJSON.call(p,"identifica",funcao)},reiniciaMapa:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=reiniciaMapa&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"reiniciaMapa",funcao)},procurartemas:function(funcao,procurar,locaplic){if(arguments.length===2){locaplic=i3GEO.configura.locaplic}try{var p=locaplic+"/classesphp/mapa_controle.php?funcao=procurartemas&map_file=&procurar="+procurar+"&idioma="+i3GEO.idioma.ATUAL;cpJSON.call(p,"procurartemas",funcao)}catch(e){}},adtema:function(funcao,temas,locaplic,sid){if(arguments.length===2){i3GEO.php.verifica();locaplic=i3GEO.configura.locaplic;sid=i3GEO.configura.sid}var p=locaplic+"/classesphp/mapa_controle.php?funcao=adtema&temas="+temas+"&g_sid="+sid;cpJSON.call(p,"adtema",funcao)},escalagrafica:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=escalagrafica&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"escalagrafica",funcao)},flamingo:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=montaFlamingo&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"montaFlamingo",funcao)},openlayers:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=openlayers&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"openlayers",funcao)},corpo:function(funcao,tipoimagem){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=corpo&tipoimagem="+tipoimagem+"&g_sid="+i3GEO.configura.sid+"&interface="+i3GEO.Interface.ATUAL;if(i3GEO.Interface.ATUAL==="googleearth"){i3GEO.Interface.googleearth.recalcPar();p+="&mapexten="+i3GEO.parametros.mapexten}cpJSON.call(p,"corpo",funcao)},criamapa:function(funcao,parametros){var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaMapa&"+parametros;cpJSON.call(p,"criaMapa",funcao)},inicia:function(funcao,embedLegenda,w,h){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=inicia&embedLegenda="+embedLegenda+"&w="+w+"&h="+h+"&g_sid="+i3GEO.configura.sid+"&interface="+i3GEO.Interface.ATUAL;cpJSON.call(p,"iniciaMapa",funcao)},chaveGoogle:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=chavegoogle&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"chavegoogle",funcao)},listaRSSwsARRAY:function(funcao,tipo){var p=i3GEO.configura.locaplic+"/classesphp/wscliente.php?funcao=listaRSSwsARRAY&rss="+["|"]+"&tipo="+tipo;cpJSON.call(p,"listaRSSwsARRAY",funcao)},listaLayersWMS:function(funcao,servico,nivel,id_ws,nomelayer){var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=listaLayersWMS&servico="+servico+"&nivel="+nivel+"&id_ws="+id_ws+"&nomelayer="+nomelayer;cpJSON.call(p,"listaLayersWMS",funcao)},buscaRapida:function(funcao,locaplic,servico,palavra){var p=locaplic+"/classesphp/mapa_controle.php?map_file=&funcao=buscaRapida&palavra="+palavra+"&servico="+servico;cpJSON.call(p,"buscaRapida",funcao)},listaItensTema:function(funcao,tema){var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaitens&tema="+tema;cpJSON.call(p,"listaItensTema",funcao)},listaValoresItensTema:function(funcao,tema,itemTema){var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaregistros&unico=sim&tema="+tema+"&itemtema="+itemTema;cpJSON.call(p,"listaRegistros",funcao)},extRegistros:function(funcao,tema,reg){var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=extregistros&registro="+reg+"&tema="+tema;cpJSON.call(p,"listaItensTema",funcao)},listaFontesTexto:function(funcao){var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listatruetype";cpJSON.call(p,"listaTrueType",funcao)},listaEpsg:function(funcao){var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaEpsg";cpJSON.call(p,"listaEpsg",funcao)},criatemaSel:function(funcao,tema){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=criatemasel&tema="+tema+"&nome=Novo tema "+tema;cpJSON.call(p,"chavegoogle",funcao)},pegaData:function(funcao,tema){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=pegadata&tema="+tema;cpJSON.call(p,"pegadata",funcao)},alteraData:function(funcao,tema,data){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=alteradata&tema="+tema+"&novodata="+data;cpJSON.call(p,"alteradata",funcao)}};
if(typeof(i3GEO)==='undefined'){i3GEO=[]}navm=false;navn=false;var app=navigator.appName.substring(0,1);if(app==='N'){navn=true}else{navm=true}g_operacao="";g_tipoacao="zoomli";g_postpx="px";g_tipotop="top";g_tipoleft="left";if(navm){g_postpx="";g_tipotop="pixelTop";g_tipoleft="pixelLeft"}$i=function(id){return document.getElementById(id)};Array.prototype.remove=function(s){try{var i=this.indexOf(s);if(i!==-1){this.splice(i,1)}}catch(e){}};i3GEO.util={PINS:[],BOXES:[],escapeURL:function(sUrl){var re;sUrl=escape(sUrl);re=new RegExp("%3F","g");sUrl=sUrl.replace(re,'?');re=new RegExp("%3D","g");sUrl=sUrl.replace(re,'=');re=new RegExp("%26","g");sUrl=sUrl.replace(re,'&');return sUrl},insereCookie:function(nome,valor){document.cookie=nome+"="+valor+";path=/"},pegaCookie:function(nome){var cookies,i,fim;cookies=document.cookie;i=cookies.indexOf(nome);if(i===-1){return null}fim=cookies.indexOf(";",i);if(fim===-1){fim=cookies.length}return(unescape(cookies.substring(i,fim))).split("=")[1]},listaChaves:function(obj){var keys,key;keys=[];for(key in obj){if(obj[key]){keys.push(key)}}return keys},criaBotaoAplicar:function(nomeFuncao,titulo,classe,obj){try{clearTimeout(tempoBotaoAplicar)}catch(e){}var novoel,xy;tempoBotaoAplicar=eval("setTimeout('"+nomeFuncao+"\(\)',(i3GEO.configura.tempoAplicar))");autoRedesenho("reinicia");if(arguments.length===1){titulo="Aplicar"}if(arguments.length===1||arguments.length===2){classe="i3geoBotaoAplicar"}if(!document.getElementById("i3geo_aplicar")){novoel=document.createElement("input");novoel.id='i3geo_aplicar';novoel.type='button';novoel.value=titulo;novoel.style.cursor="pointer";novoel.style.fontSize="10px";novoel.style.zIndex=15000;novoel.style.position="absolute";novoel.style.display="none";novoel.onmouseover=function(){this.style.display="block"};novoel.onmouseout=function(){this.style.display="none"};novoel.className=classe;document.body.appendChild(novoel)}else{novoel=document.getElementById("i3geo_aplicar")}novoel.onclick=function(){clearTimeout(i3GEO.parametros.tempo);i3GEO.parametros.tempo="";this.style.display='none';eval(nomeFuncao+"\(\)")};if(arguments.length===4){novoel.style.display="block";xy=YAHOO.util.Dom.getXY(obj);YAHOO.util.Dom.setXY(novoel,xy)}return(novoel)},arvore:function(titulo,onde,obj){var arvore,root,tempNode,currentIconMode,d,c,i,linha,conteudo;if(!$i(onde)){return}try{arvore=new YAHOO.widget.TreeView(onde);root=arvore.getRoot();tempNode=new YAHOO.widget.TextNode('',root,false);tempNode.isLeaf=false;tempNode.enableHighlight=false}catch(e){}titulo="<table><tr><td><b>"+titulo+"</b></td><td></td></tr></table>";d={html:titulo};tempNode=new YAHOO.widget.HTMLNode(d,root,true,true);tempNode.enableHighlight=false;c=obj.propriedades.length;for(i=0,j=c;i<j;i++){linha=obj.propriedades[i];if(linha.url!==""){conteudo="<a href='#' onclick='"+linha.url+"'>"+$trad(linha.text)+"</a>"}else{conteudo=linha.text}d={html:conteudo};temaNode=new YAHOO.widget.HTMLNode(d,tempNode,false,true);temaNode.enableHighlight=false}arvore.collapseAll();arvore.draw()},removeAcentos:function(palavra){var re;re=/&atilde;|á|à|â/gi;palavra=palavra.replace(re,"a");re=/é|ê/gi;palavra=palavra.replace(re,"e");re=/í/gi;palavra=palavra.replace(re,"i");re=/ó|õ|ô/gi;palavra=palavra.replace(re,"o");re=/ç/gi;palavra=palavra.replace(re,"c");re=/ú/gi;palavra=palavra.replace(re,"u");return(palavra)},protocolo:function(){var u=window.location.href;u=u.split(":");return(u[0])},pegaPosicaoObjeto:function(obj){if(obj){if(!obj.style){return[0,0]}var curleft=0,curtop=0,teste;if(obj){if(obj.offsetParent){do{curleft+=obj.offsetLeft-obj.scrollLeft;curtop+=obj.offsetTop-obj.scrollTop;obj=obj.offsetParent}while(obj)}}return[curleft+document.body.scrollLeft,curtop+document.body.scrollTop]}else{return[0,0]}},pegaElementoPai:function(e){var targ;if(!e){e=window.event}if(e.target){targ=e.target}else if(e.srcElement){targ=e.srcElement}if(targ.nodeType===3){targ=targ.parentNode}tparent=targ.parentNode;return(tparent)},mudaCursor:function(cursores,tipo,idobjeto,locaplic){var os=[],o,i,c,n,layers;if(i3GEO.Interface.ATUAL==="openlayers"){os=YAHOO.util.Dom.getElementsByClassName('olTileImage','img')}else{os.push(document.getElementById(idobjeto))}n=os.length;for(i=0;i<n;i++){o=os[i];c=eval("cursores."+tipo+".ie");if(c==="default"||c==="pointer"||c==="crosshair"||c==="help"||c==="move"||c==="text"){o.style.cursor=c}else{if(o){if(navm){o.style.cursor="URL(\""+locaplic+eval("cursores."+tipo+".ie")+"\"),auto"}else{o.style.cursor="URL(\""+locaplic+eval("cursores."+tipo+".ff")+"\"),auto"}}}}},criaBox:function(id){if(arguments.length===0){id="boxg"}if(!$i(id)){var novoel=document.createElement("div");novoel.id=id;novoel.style.zIndex=1;novoel.innerHTML='<font face="Arial" size=0></font>';document.body.appendChild(novoel);novoel.onmouseover=function(){novoel.style.display='none'};novoel.onmouseout=function(){novoel.style.display='block'};i3GEO.util.BOXES.push(id)}else{$i(id).style.display="block"}},escondeBox:function(){var l,i;l=i3GEO.util.BOXES.length;for(i=0;i<l;i++){if($i(i3GEO.util.BOXES[i])){$i(i3GEO.util.BOXES[i]).style.display="none"}}},criaPin:function(id,imagem,w,h){if(arguments.length<1||id===""){id="boxpin"}if(arguments.length<2||imagem===""){imagem=i3GEO.configura.locaplic+'/imagens/marker.png'}if(arguments.length<3||w===""){w="21px"}if(arguments.length<4||h===""){h="25px"}if(!$i(id)){var novoel=document.createElement("img");novoel.id=id;novoel.style.zIndex=10000;novoel.style.position="absolute";novoel.style.width=w;novoel.style.height=h;novoel.src=imagem;if(id==="boxpin"){novoel.onmouseover=function(){$i("boxpin").style.display="none"}}document.body.appendChild(novoel);i3GEO.util.PINS.push(id)}},posicionaImagemNoMapa:function(id){var i,mx,my;i=$i(id);mx=parseInt(i.style.width,10)/2;my=parseInt(i.style.height,10)/2;i.style.position="absolute";i.style.top=objposicaocursor.telay-my;i.style.left=objposicaocursor.telax-mx},escondePin:function(){var l,i;l=i3GEO.util.PINS.length;for(i=0;i<l;i++){if($i(i3GEO.util.PINS[i])){$i(i3GEO.util.PINS[i]).style.display="none"}}},$im:function(g){return i3GEO.configura.locaplic+"/imagens/visual/"+i3GEO.configura.visual+"/"+g},$inputText:function(idPai,larguraIdPai,idInput,titulo,digitos,valor,nome){if(arguments.length===6){nome=""}if(idPai!==""){if(larguraIdPai!==""){$i(idPai).style.width=larguraIdPai+"px"}$i(idPai).style.padding="3";$i(idPai).style.textAlign="center";$i(idPai).onmouseover=function(){this.className="digitarMouseover"};$i(idPai).onmouseout=function(){this.className=""}}return"<input tabindex='0' onmouseover='javascript:this.className=\"digitarOver\";' onmouseout='javascript:this.className=\"digitar\";' onclick='javascript:this.select();this.className=\"digitarMouseclick\";' id='"+idInput+"' title='"+titulo+"' type='text' size='"+digitos+"' class='digitar' value='"+valor+"' name='"+nome+"' />"},$inputTextMudaCor:function(obj){var n=obj.value.split(" ");obj.style.color="rgb("+n[0]+","+n[1]+","+n[2]+")"},$top:function(id,valor){if(document.getElementById(id).style){if(document.getElementById(id).style.pixelTop){document.getElementById(id).style.pixelTop=valor}else{document.getElementById(id).style.top=valor+"px"}}},$left:function(id,valor){if(document.getElementById(id).style){if(document.getElementById(id).style.pixelLeft){document.getElementById(id).style.pixelLeft=valor}else{document.getElementById(id).style.left=valor+"px"}}},insereMarca:{CONTAINER:[],cria:function(xi,yi,funcaoOnclick,container,texto){if(i3GEO.Interface.ATUAL==="googleearth"){i3GEO.Interface.googleearth.insereMarca(texto,xi,yi,container);return}try{var novoel,i,novoimg,temp;if(i3GEO.util.insereMarca.CONTAINER.toString().search(container)<0){i3GEO.util.insereMarca.CONTAINER.push(container)}if(!$i(container)){novoel=document.createElement("div");novoel.id=container;i=novoel.style;i.position="absolute";if($i(i3GEO.Interface.IDCORPO)){i.top=parseInt($i(i3GEO.Interface.IDCORPO).style.top,10);i.left=parseInt($i(i3GEO.Interface.IDCORPO).style.left,10)}else{i.top=parseInt($i(i3GEO.Interface.IDMAPA).style.top,10);i.left=parseInt($i(i3GEO.Interface.IDMAPA).style.left,10)}document.body.appendChild(novoel)}container=$i(container);novoel=document.createElement("div");i=novoel.style;i.position="absolute";i.zIndex=2000;i.top=(yi-4)+"px";i.left=(xi-4)+"px";i.width="4px";i.height="4px";novoimg=document.createElement("img");if(funcaoOnclick!==""){novoimg.onclick=funcaoOnclick}else{novoimg.onclick=function(){i3GEO.util.insereMarca.limpa()}}novoimg.src=i3GEO.configura.locaplic+"/imagens/dot1.gif";temp=novoimg.style;temp.width="6px";temp.height="6px";temp.zIndex=2000;novoel.appendChild(novoimg);container.appendChild(novoel);if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.util.insereMarca.limpa()")<0){i3GEO.eventos.NAVEGAMAPA.push("i3GEO.util.insereMarca.limpa()")}}catch(e){alert("Ocorreu um erro. inseremarca"+e)}},limpa:function(){try{var n,i;n=i3GEO.util.insereMarca.CONTAINER.length;for(i=0;i<n;i++){if($i(i3GEO.util.insereMarca.CONTAINER[i])){$i(i3GEO.util.insereMarca.CONTAINER[i]).innerHTML=""}}i3GEO.util.insereMarca.CONTAINER=[];i3GEO.eventos.NAVEGAMAPA.remove("i3GEO.util.insereMarca.limpa()")}catch(e){}}},adicionaSHP:function(path){i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));var temp=path.split(".");i3GEO.contadorAtualiza++;if((temp[1]==="SHP")||(temp[1]==="shp")){i3GEO.php.adicionaTemaSHP(i3GEO.atualiza,path)}else{i3GEO.php.adicionaTemaIMG(i3GEO.atualiza,path)}},abreCor:function(janela,elemento,tipo){if(arguments.length==2){tipo="rgb"}var ins,temp,novoel,wdocaiframe,fix=false,wlargura="400",waltura="240",wsrc=i3GEO.configura.locaplic+"/ferramentas/colorpicker/index.htm?doc="+janela+"&elemento="+elemento+"&tipo="+tipo,nx="",ny="",texto="Cor",id="i3geo_janelaCor",modal=true,classe="hd",wlargura_="400px";YAHOO.namespace("janelaCor.xp");if($i(id)){YAHOO.janelaCor.xp.panel.destroy()}ins='<div id="'+id+'_cabecalho" class="hd">';ins+="<span><img id='i3geo_janelaCor_imagemCabecalho' style='visibility:hidden;' src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' /></span>";ins+=texto;ins+='</div><div id="i3geo_janelaCor_corpo" class="bd" style="padding:5px">';if(wsrc!==""){ins+='<iframe name="'+id+'i" id="i3geo_janelaCori" valign="top" style="border:0px white solid"></iframe>'}ins+='</div>';novoel=document.createElement("div");novoel.id="i3geo_janelaCor";novoel.style.display="block";novoel.innerHTML=ins;if($i("i3geo")){$i("i3geo").appendChild(novoel)}else{document.body.appendChild(novoel)}wdocaiframe=$i("i3geo_janelaCori");if(wdocaiframe){temp=wdocaiframe.style;temp.width=parseInt(wlargura,10)-12;temp.height=waltura;wdocaiframe.style.display="block";wdocaiframe.src=wsrc}if(nx===""||nx==="center"){fix=true}YAHOO.janelaCor.xp.panel=new YAHOO.widget.ResizePanel(id,{zIndex:5000,modal:modal,width:wlargura_,fixedcenter:fix,constraintoviewport:false,visible:true,iframe:false});YAHOO.janelaCor.xp.panel.render();$i(id+'_cabecalho').className=classe},ajaxhttp:function(){var objhttp1;try{objhttp1=new XMLHttpRequest()}catch(ee){try{objhttp1=new ActiveXObject("Msxml2.XMLHTTP")}catch(e){try{objhttp1=new ActiveXObject("Microsoft.XMLHTTP")}catch(E){objhttp1=false}}}return(objhttp1)},ajaxexecASXml:function(programa,funcao){var h,ohttp,retorno;if(programa.search("http")===0){h=window.location.host;if(programa.search(h)<0){alert("OOps! Nao e possivel chamar um XML de outro host.\nContacte o administrador do sistema.\nConfigure corretamente o ms_configura.php");return}}ohttp=i3GEO.util.ajaxhttp();ohttp.open("GET",programa,true);retorno="";ohttp.onreadystatechange=function(){var retorno,parser,dom;if(ohttp.readyState===4){retorno=ohttp.responseText;if(retorno!==undefined){if(document.implementation.createDocument){parser=new DOMParser();dom=parser.parseFromString(retorno,"text/xml")}else{dom=new ActiveXObject("Microsoft.XMLDOM");dom.async="false";dom.load(programa)}}else{dom="erro"}if(funcao!=="volta"){eval(funcao+'(dom)')}else{return dom}}};ohttp.send(null)},aparece:function(id,tempo,intervalo){var n,obj,opacidade,fadei,tempoFadei;n=parseInt(tempo/intervalo,10);obj=$i(id);if(n===1){obj.style.display="block";if(navm){obj.style.filter='alpha(opacity=100)'}else{obj.style.opacity=1}}tempo=n*intervalo;intervalo=(intervalo*100)/tempo;opacidade=0;if(navm){obj.style.filter='alpha(opacity=0)'}else{obj.style.opacity=0}obj.style.display="block";fadei=function(){opacidade+=intervalo;if(navm){obj.style.filter='alpha(opacity='+opacidade+')'}else{obj.style.opacity=opacidade/100}if(opacidade<100){tempoFadei=setTimeout(fadei,tempo)}else{clearTimeout(tempoFadei);if(navm){obj.style.filter='alpha(opacity=100)'}else{obj.style.opacity=1}}};tempoFadei=setTimeout(fadei,tempo)},desaparece:function(id,tempo,intervalo,removeobj){var n,obj,opacidade,fade,p,tempoFade;n=parseInt(tempo/intervalo,10);obj=$i(id);if(n===1){obj.style.display="none";if(removeobj){p=obj.parentNode;if(p){p.removeChild(obj)}}return}tempo=n*intervalo;intervalo=(intervalo*100)/tempo;opacidade=100;if(navm){obj.style.filter='alpha(opacity=100)'}else{obj.style.opacity=1}obj.style.display="block";fade=function(){opacidade-=intervalo;if(navm){obj.style.filter='alpha(opacity='+opacidade+')'}else{obj.style.opacity=opacidade/100}if(opacidade>0){tempoFade=setTimeout(fade,tempo)}else{clearTimeout(tempoFade);obj.style.display="none";if(navm){obj.style.filter='alpha(opacity=100)'}else{obj.style.opacity=1}if(removeobj){p=obj.parentNode;if(p){p.removeChild(obj)}}}};tempoFade=setTimeout(fade,tempo)},wkt2ext:function(wkt,tipo){var re,x,y,w,xMin,xMax,yMin,yMax,temp;tipo=tipo.toLowerCase();ext=false;if(tipo==="polygon"){try{re=new RegExp("POLYGON","g");wkt=wkt.replace(re,"");wkt=wkt.split("(")[2].split(")")[0];wkt=wkt.split(",");x=[];y=[];for(w=0;w<wkt.length;w++){temp=wkt[w].split(" ");x.push(temp[0]);y.push(temp[1])}x.sort(i3GEO.util.sortNumber);xMin=x[0];xMax=x[(x.length)-1];y.sort(i3GEO.util.sortNumber);yMin=y[0];yMax=y[(y.length)-1];return xMin+" "+yMin+" "+xMax+" "+yMax}catch(e){}}if(tipo==="point"){try{re=new RegExp("POINT","g");wkt=wkt.replace(re,"");wkt=wkt.split("(")[1].split(")")[0];wkt=wkt.split(" ");return(wkt[0]*1-0.01)+" "+(wkt[1]*1-0.01)+" "+(wkt[0]*1+0.01)+" "+(wkt[1]*1+0.01)}catch(e){}}return ext},sortNumber:function(a,b){return a-b},getScrollerWidth:function(){var scr=null,inn=null,wNoScroll=0,wScroll=0;scr=document.createElement('div');scr.style.position='absolute';scr.style.top='-1000px';scr.style.left='-1000px';scr.style.width='100px';scr.style.height='50px';scr.style.overflow='hidden';inn=document.createElement('div');inn.style.width='100%';inn.style.height='200px';scr.appendChild(inn);document.body.appendChild(scr);wNoScroll=inn.offsetWidth;scr.style.overflow='auto';wScroll=inn.offsetWidth;document.body.removeChild(document.body.lastChild);return(wNoScroll-wScroll)},scriptTag:function(js,ini,id){var head,script;if(!$i(id)||id===""){head=document.getElementsByTagName('head')[0];script=document.createElement('script');script.type='text/javascript';if(ini!==""){if(navm){script.onreadystatechange=function(){if(this.readyState==='loaded'||this.readyState==='complete'){eval(ini)}}}else{script.onload=function(){eval(ini)}}}script.src=js;if(id!==""){script.id=id}head.appendChild(script)}else{if(ini!==""){eval(ini)}}},mensagemAjuda:function(onde,texto){var ins="<table style='width:100%;padding:2;vertical-align:top;background-color:#ffffff;' ><tr><th style='background-color: #cedff2; font-family:Verdana, Arial, Helvetica, sans-serif; font-size: 8pt; border: 1px solid #B1CDEB; text-align: left; padding-left: 7px;padding-right: 11px;'>";ins+='<div style="float:right"><img src="'+i3GEO.configura.locaplic+'/imagens/question.gif" /></div>';ins+='<div style="text-align:left;">';if(texto===""){texto=$i(onde).innerHTML}ins+=texto;ins+='</div></th></tr></table>';if(onde!==""){$i(onde).innerHTML=ins}else{return(ins)}},randomRGB:function(){var v=Math.random(),r=parseInt(255*v,10),g;v=Math.random();g=parseInt(255*v,10);v=Math.random();b=parseInt(255*v,10);return(r+","+g+","+b)},rgb2hex:function(str){var rgb=str.split(",");function hex(x){var hexDigits=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];return hexDigits[(x-x%16)/16]+hexDigits[x%16]};return"#"+hex(rgb[0])+hex(rgb[1])+hex(rgb[2])},comboTemas:function(id,funcao,onde,nome,multiplo,tipoCombo){if(arguments.length>2){$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando temas...</span>"}if(arguments.length===3){nome=""}if(arguments.length<5){multiplo=false}var monta,lista,temp;monta=function(retorno){var i,comboTemas,temp,n,nome;if(retorno!==undefined){if(retorno.data){retorno=retorno.data}n=retorno.length;if(n>0){if(multiplo){comboTemas="<select style='font-size:12px;' id='"+id+"' size='4' multiple='multiple' name='"+nome+"'>"}else{comboTemas="<select style='font-size:12px;' id='"+id+"' name='"+nome+"'>"}comboTemas+="<option value=''>----</option>";for(i=0;i<n;i++){if(retorno[i].nome){nome=retorno[i].nome;tema=retorno[i].tema}else{nome=retorno[i].tema;tema=retorno[i].name}if(retorno[i].escondido!=="sim"){comboTemas+="<option value="+tema+" >"+nome+"</option>"}}comboTemas+="</select>";temp={dados:comboTemas,tipo:"dados"}}else{temp={dados:'<div class=alerta >Nenhum tema encontrado.</div>',tipo:"mensagem"}}}else{temp={dados:"<p style=color:red >Ocorreu um erro<br>",tipo:"erro"}}eval("funcao(temp);")};if(tipoCombo==="ligados"){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){monta(i3GEO.arvoreDeCamadas.filtraCamadas("status",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS))}else{i3GEO.php.listaTemas(monta,"ligados",i3GEO.configura.locaplic,i3GEO.configura.sid)}}if(tipoCombo==="editaveis"){i3GEO.php.listaTemasEditaveis(monta,i3GEO.configura.locaplic,i3GEO.configura.sid)}if(tipoCombo==="selecionados"){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel","sim","igual",i3GEO.arvoreDeCamadas.CAMADAS))}else{i3GEO.php.listaTemasComSel(monta,i3GEO.configura.locaplic,i3GEO.configura.sid)}}if(tipoCombo==="raster"){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){monta(i3GEO.arvoreDeCamadas.filtraCamadas("type",3,"igual",i3GEO.arvoreDeCamadas.CAMADAS))}else{i3GEO.php.listatemasTipo(monta,"raster",i3GEO.configura.locaplic,i3GEO.configura.sid)}}if(tipoCombo==="pontosSelecionados"){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){temp=i3GEO.arvoreDeCamadas.filtraCamadas("type",0,"igual",i3GEO.arvoreDeCamadas.CAMADAS);monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel","sim","igual",temp))}else{alert("Arvore de camadas n&atilde;o encontrada")}}if(tipoCombo==="pontos"){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){monta(i3GEO.arvoreDeCamadas.filtraCamadas("type",0,"igual",i3GEO.arvoreDeCamadas.CAMADAS))}else{alert("Arvore de camadas n&atilde;o encontrada")}}if(tipoCombo==="poligonos"){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){monta(i3GEO.arvoreDeCamadas.filtraCamadas("type",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS))}else{alert("Arvore de camadas n&atilde;o encontrada")}}if(tipoCombo==="poligonosSelecionados"){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){temp=i3GEO.arvoreDeCamadas.filtraCamadas("type",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS);monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel","sim","igual",temp))}else{alert("Arvore de camadas n&atilde;o encontrada")}}if(tipoCombo==="linhaDoTempo"){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){monta(i3GEO.arvoreDeCamadas.filtraCamadas("linhadotempo","sim","igual",i3GEO.arvoreDeCamadas.CAMADAS))}else{alert("Arvore de camadas n&atilde;o encontrada")}}if(tipoCombo===""){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){monta(i3GEO.arvoreDeCamadas.filtraCamadas("type","","diferente",i3GEO.arvoreDeCamadas.CAMADAS))}else{alert("Arvore de camadas n&atilde;o encontrada")}}},checkTemas:function(id,funcao,onde,nome,tipoLista,prefixo,size){if(arguments.length>2){$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando temas...</span>"}if(arguments.length===3){nome=""}var monta,lista,temp,temp1,n,i;monta=function(retorno){try{var i,comboTemas,temp,n,nome;if(retorno!==undefined){if(retorno.data){retorno=retorno.data}n=retorno.length;if(n>0){comboTemas="<table class=lista3 >";for(i=0;i<n;i++){if(retorno[i].nome){nome=retorno[i].nome;tema=retorno[i].tema}else{nome=retorno[i].tema;tema=retorno[i].name}comboTemas+="<tr><td><input size=2 style='cursor:pointer' type=checkbox name='"+tema+"' /></td>";comboTemas+="<td>&nbsp;<input style='text-align:left; cursor:text;' onclick='javascript:this.select();' id='"+prefixo+tema+"' type=text size='"+size+"' value='"+nome+"' /></td></tr>"}comboTemas+="</table>";temp={dados:comboTemas,tipo:"dados"}}else{temp={dados:'<div class=alerta >Nenhum tema encontrado.</div>',tipo:"mensagem"}}}else{temp={dados:"<p style=color:red >Ocorreu um erro<br>",tipo:"erro"}}eval("funcao(temp);")}catch(e){}};if(tipoLista==="ligados"){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){monta(i3GEO.arvoreDeCamadas.filtraCamadas("status",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS))}else{i3GEO.php.listaTemas(monta,"ligados",i3GEO.configura.locaplic,i3GEO.configura.sid)}}if(tipoLista==="selecionados"){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel","sim","igual",i3GEO.arvoreDeCamadas.CAMADAS))}else{i3GEO.php.listaTemasComSel(monta,i3GEO.configura.locaplic,i3GEO.configura.sid)}}if(tipoLista==="raster"){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){monta(i3GEO.arvoreDeCamadas.filtraCamadas("type",3,"igual",i3GEO.arvoreDeCamadas.CAMADAS))}else{i3GEO.php.listatemasTipo(monta,"raster",i3GEO.configura.locaplic,i3GEO.configura.sid)}}if(tipoLista==="polraster"){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){temp=i3GEO.arvoreDeCamadas.filtraCamadas("type",3,"igual",i3GEO.arvoreDeCamadas.CAMADAS);temp1=i3GEO.arvoreDeCamadas.filtraCamadas("type",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS);n=temp1.length;for(i=0;i<n;i++){temp.push(temp1[i])}monta(temp)}else{alert("Arvore de camadas n&atilde;o encontrada")}}if(tipoLista==="pontosSelecionados"){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){temp=i3GEO.arvoreDeCamadas.filtraCamadas("type",0,"igual",i3GEO.arvoreDeCamadas.CAMADAS);monta(i3GEO.arvoreDeCamadas.filtraCamadas("sel","sim","igual",temp))}else{alert("Arvore de camadas n&atilde;o encontrada")}}if(tipoLista==="pontos"){if(i3GEO.arvoreDeCamadas.CAMADAS!==""){monta(i3GEO.arvoreDeCamadas.filtraCamadas("type",0,"igual",i3GEO.arvoreDeCamadas.CAMADAS))}else{alert("Arvore de camadas n&atilde;o encontrada")}}},comboItens:function(id,tema,funcao,onde,nome){if(arguments.length>3){$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando itens...</span>"}if(arguments.length!==5){nome=""}var monta=function(retorno){var ins,temp,i;if(retorno.data!==undefined){ins=[];ins.push("<select  id='"+id+"' name='"+nome+"'>");ins.push("<option value='' >---</option>");temp=retorno.data.valores.length;for(i=0;i<temp;i++){if(retorno.data.valores[i].tema===tema){ins.push("<option value='"+retorno.data.valores[i].item+"' >"+retorno.data.valores[i].item+"</option>")}}ins.push("</select>");ins=ins.join('');temp={dados:ins,tipo:"dados"}}else{temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"}}eval("funcao(temp)")};i3GEO.php.listaItensTema(monta,tema)},comboValoresItem:function(id,tema,itemTema,funcao,onde){if(arguments.length==5){$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando valores...</span>"}var monta=function(retorno){var ins=[],i,pares,j,temp;if(retorno.data!=undefined){ins.push("<select  id="+id+" >");ins.push("<option value='' >---</option>");for(i=0;i<retorno.data[1].registros.length;i++){pares=retorno.data[1].registros[i].valores;for(j=0;j<pares.length;j++){ins.push("<option value='"+pares[j].valor+"' >"+pares[j].valor+"</option>")}}ins.push("</select>");ins=ins.join('');temp={dados:ins,tipo:"dados"}}else{temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"}}eval("funcao(temp)")};i3GEO.php.listaValoresItensTema(monta,tema,itemTema)},comboFontes:function(id,onde){$i(onde).innerHTML="<span style=color:red >buscando fontes...</span>";var monta=function(retorno){var ins="",temp,i,dados;if(retorno.data!==undefined){ins+="<select  id='"+id+"'>";ins+="<option value='bitmap' >bitmap</option>";dados=retorno.data.split(",");temp=dados.length;for(i=0;i<temp;i++){ins+="<option value='"+dados[i]+"' >"+dados[i]+"</option>"}ins+="</select>"}$i(onde).innerHTML=ins};i3GEO.php.listaFontesTexto(monta)},comboSimNao:function(id,selecionado){var combo="<select name="+id+" id="+id+" >";combo+="<option value='' >---</option>";if(selecionado==="sim"){combo+="<option value=TRUE selected >sim</option>"}else{combo+="<option value=TRUE >sim</option>"}if(selecionado==="nao"){combo+="<option value=FALSE selected >n&atilde;o</option>"}else{combo+="<option value=FALSE >n&atilde;o</option>"}combo+="</select>";return(combo)},checkItensEditaveis:function(tema,funcao,onde,size,prefixo){if(onde!==""){$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando itens...</span>"}var monta=function(retorno){var ins=[],i,temp,n;if(retorno.data!==undefined){ins.push("<table class=lista3 >");n=retorno.data.valores.length;for(i=0;i<n;i++){ins.push("<tr><td><input size=2 style='cursor:pointer' name='"+retorno.data.valores[i].tema+"' type=checkbox id='"+prefixo+retorno.data.valores[i].item+"' /></td>");ins.push("<td><input style='text-align:left; cursor:text;' onclick='javascript:this.select();' id='"+prefixo+retorno.data.valores[i].item+retorno.data.valores[i].tema+"' type=text size='"+size+"' value='"+retorno.data.valores[i].item+"' /></td></tr>")}ins.push("</table>");ins=ins.join('');temp={dados:ins,tipo:"dados"}}else{temp={dados:'<div class=erro >Ocorreu um erro</div>',tipo:"erro"}}eval("funcao(temp)")};i3GEO.php.listaItensTema(monta,tema)},radioEpsg:function(funcao,onde,prefixo){if(arguments.length===2){$i(onde).innerHTML="<span style=color:red;font-size:10px; >buscando...</span>"}var cp,monta=function(retorno){var ins=new Array(),i,n,temp;if(retorno.data!==undefined){ins.push("<table class=lista2 >");ins.push("<tr><td><input size=2 style='cursor:pointer' name='"+prefixo+"EPSG' type=radio checked value='' /></td>");ins.push("<td>"+retorno.data[0].nome+"</td></tr>");n=retorno.data.length;for(i=1;i<n;i++){ins.push("<tr><td><input size=2 style='cursor:pointer' name='"+prefixo+"EPSG' type=radio value='"+retorno.data[i].codigo+"' /></td>");ins.push("<td>"+retorno.data[i].nome+"</td></tr>")}ins.push("</table>");ins=ins.join('');temp={dados:ins,tipo:"dados"}}else{temp={dados:'<div class=erro >Ocorreu um erro</erro>',tipo:"erro"}}eval("funcao(temp)")};i3GEO.php.listaEpsg(monta)},proximoAnterior:function(anterior,proxima,texto,idatual,container){var temp=$i(idatual),ndiv=document.createElement("div"),nids,i,fundo;if(temp){$i(container).removeChild(temp)}if(!document.getElementById(idatual)){fundo=$i(container).style.backgroundColor;ndiv.id=idatual;texto+="<br><br><table style='width:100%;background-color:"+fundo+";' ><tr style='width:100%'>";if(anterior!==""){texto+="<td style='border:0px solid white;text-align:left;cursor:pointer;background-color:"+fundo+";'><input id='"+idatual+"anterior_' onclick='"+anterior+"' type='button' value='&nbsp;&nbsp;' /></td>"}if(proxima!==""){texto+="<td style='border:0px solid white;text-align:right;cursor:pointer;background-color:"+fundo+";'><input id='"+idatual+"proxima_' onclick='"+proxima+"' type='button' value='&nbsp;&nbsp;' /></td>"}ndiv.innerHTML=texto+"</tr></table>";$i(container).appendChild(ndiv);new YAHOO.widget.Button(idatual+"anterior_",{onclick:{fn:function(){eval(anterior+"()")},lazyloadmenu:true}});new YAHOO.widget.Button(idatual+"proxima_",{onclick:{fn:function(){eval(proxima+"()")},lazyloadmenu:true}});i=$i(idatual+"proxima_-button");if(i){i.style.backgroundImage="url('"+i3GEO.configura.locaplic+"/imagens/player_avanca.png')";i.style.backgroundRepeat="no-repeat";i.style.backgroundPosition="center center"}i=$i(idatual+"anterior_-button");if(i){i.style.backgroundImage="url('"+i3GEO.configura.locaplic+"/imagens/player_volta.png')";i.style.backgroundRepeat="no-repeat";i.style.backgroundPosition="center center"}}temp=$i(container).getElementsByTagName("div");nids=temp.length;for(i=0;i<nids;i++){temp[i].style.display="none"}$i(idatual).style.display="block"}};YAHOO.namespace("lutsr");YAHOO.lutsr.accordion={properties:{animation:true,animationDuration:10,multipleOpen:false,Id:"sanfona",altura:200,ativa:0},init:function(animation,animationDuration,multipleOpen,Id,altura,ativa){if(animation){this.properties.animation=animation}if(animationDuration){this.properties.animationDuration=animationDuration}if(multipleOpen){this.properties.multipleOpen=multipleOpen}if(Id){this.properties.Id=Id}if(altura){this.properties.altura=altura}if(ativa){this.properties.ativa=ativa}var accordionObject=document.getElementById(this.properties.Id);if(accordionObject){if(accordionObject.nodeName=="DL"){var headers=accordionObject.getElementsByTagName("dt");var bodies=headers[0].parentNode.getElementsByTagName("dd")}this.attachEvents(headers,0)}},attachEvents:function(headers,nr){for(var i=0;i<headers.length;i++){var headerProperties={objRef:headers[i],nr:i,jsObj:this};YAHOO.util.Event.addListener(headers[i],"click",this.clickHeader,headerProperties)}var parentObj=headers[this.properties.ativa].parentNode;var headers=parentObj.getElementsByTagName("dd");var header=headers[this.properties.ativa];this.expand(header)},clickHeader:function(e,headerProperties){var parentObj=headerProperties.objRef.parentNode;var headers=parentObj.getElementsByTagName("dd");var header=headers[headerProperties.nr];if(YAHOO.util.Dom.hasClass(header,"open")){headerProperties.jsObj.collapse(header)}else{if(headerProperties.jsObj.properties.multipleOpen){headerProperties.jsObj.expand(header)}else{for(var i=0;i<headers.length;i++){if(YAHOO.util.Dom.hasClass(headers[i],"open")){headerProperties.jsObj.collapse(headers[i])}}headerProperties.jsObj.expand(header)}}},collapse:function(header){YAHOO.util.Dom.removeClass(YAHOO.util.Dom.getPreviousSibling(header),"selected");if(!this.properties.animation){YAHOO.util.Dom.removeClass(header,"open")}else{this.initAnimation(header,"close")}},expand:function(header){YAHOO.util.Dom.addClass(YAHOO.util.Dom.getPreviousSibling(header),"selected");if(!this.properties.animation){YAHOO.util.Dom.addClass(header,"open")}else{this.initAnimation(header,"open")}},initAnimation:function(header,dir){if(dir=="open"){YAHOO.util.Dom.setStyle(header,"visibility","hidden");YAHOO.util.Dom.setStyle(header,"height",this.properties.altura);YAHOO.util.Dom.addClass(header,"open");var attributes={height:{from:0,to:this.properties.altura}};YAHOO.util.Dom.setStyle(header,"height",0);YAHOO.util.Dom.setStyle(header,"visibility","visible");var animation=new YAHOO.util.Anim(header,attributes);animationEnd=function(){header.style.height=this.properties.altura+"px"};animation.duration=this.properties.animationDuration;animation.useSeconds=false;animation.onComplete.subscribe(animationEnd);animation.animate()}else if("close"){var attributes={height:{to:0}};animationEnd=function(){YAHOO.util.Dom.removeClass(header,"open")};var animation=new YAHOO.util.Anim(header,attributes);animation.duration=this.properties.animationDuration;animation.useSeconds=false;animation.onComplete.subscribe(animationEnd);animation.animate()}}};$im=function(g){return i3GEO.util.$im(g)};$inputText=function(idPai,larguraIdPai,idInput,titulo,digitos,valor,nome){if(arguments.length===6){nome=""}return i3GEO.util.$inputText(idPai,larguraIdPai,idInput,titulo,digitos,valor,nome)};$top=function(id,valor){i3GEO.util.$top(id,valor)};$left=function(id,valor){i3GEO.util.$left(id,valor)};

<?php if(extension_loaded('zlib')){ob_end_flush();}?>