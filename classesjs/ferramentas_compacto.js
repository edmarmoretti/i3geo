function autoredesenha(){wdocaf("300px","180px",g_locaplic+"/ferramentas/opcoes_autoredesenha/index.htm","","","");}
function salvaMapa(){wdocaf("300px","180px",g_locaplic+"/ferramentas/salvamapa/index.htm","","","Salva mapa");}
function carregaMapa(){wdocaf("300px","150px",g_locaplic+"/ferramentas/carregamapa/index.htm?urlatual="+window.location,"","","Carrega mapa");}
function convertews(){wdocaf("440px","280px",g_locaplic+"/ferramentas/convertews/index.htm","","","Web service");}
function queryMap(){wdocaf("210px","170px",g_locaplic+"/ferramentas/opcoes_querymap/index.htm","","","Querymap");}
function template(){wdocaf("300px","400px",g_locaplic+"/ferramentas/template/index.htm","","","Template");}
function ativaLogo(){ var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=ativalogo&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"ativalogo",ajaxredesenha);}
function tamanho(){wdocaf("150px","170px",g_locaplic+"/ferramentas/opcoes_tamanho/index.htm","","","Tamanho");}
function tipoimagem(){wdocaf("300px","200px",g_locaplic+"/ferramentas/tipoimagem/index.htm","","","Tipo de imagem");}
function corFundo(){wdocaf("210px","170px",g_locaplic+"/ferramentas/opcoes_fundo/index.htm","","","Fundo");}
function destacaTema(tema){ if($i("img_d")){$i("img_d").src="";}
 if($i(objmapa.guiaTemas+"obj")){ var iguias=$i(objmapa.guiaTemas+"obj").getElementsByTagName("input"); for(i=0;i<iguias.length;i++){ if((iguias[i].type=="checkbox")&&(iguias[i].value==tema)&&(iguias[i].checked==true)){alert("Desligue o tema antes de destacar");return;}}}
 objaguarde.abre("ajaxdestaca","Aguarde...gerando imagem"); g_destaca=tema; var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=geradestaque&tema="+tema+"&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"geraDestaque",ajaxdestaca); if($i("img")){$i("img").title="utilize as teclas+-para mudar o tamanho do destaque";}}
function excluitemaf(tema){ g_operacao="excluitema"; var p=document.getElementById("idx"+tema).parentNode.parentNode.parentNode; do{ p.removeChild(p.childNodes[0]);}while(p.childNodes.length > 0); p.parentNode.removeChild(p); objaguarde.abre("ajaxredesenha","Aguarde..."); var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=excluitema&temas="+tema+"&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"excluiTemas",ajaxredesenha); objmapa.temaAtivo="";}
function sobetemaf(tema){ objaguarde.abre("ajaxredesenha","Aguarde..."); var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=sobetema&tema="+tema+"&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"sobeTema",ajaxredesenha);}
function descetemaf(tema){ objaguarde.abre("ajaxredesenha","Aguarde..."); var p=g_locaplic+"/classesphp/mapa_controle.php?&funcao=descetema&tema="+tema+"&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"desceTema",ajaxredesenha);}
function zoomtemaf(tema){ objaguarde.abre("ajaxredesenha","Aguarde..."); var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=zoomtema&tema="+tema+"&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"zoomTema",ajaxredesenha);}
function limpaseltemaf(celula){ g_operacao="limpasel"; objaguarde.abre("ajaxredesenha","Aguarde..."); var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=limpasel&tema="+pegaTema(celula)+"&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"selecaoLimpa",ajaxredesenha);}
function mudatranspf(idtema){ g_operacao="transparencia"; if($i("tr"+idtema)){var valor=$i("tr"+idtema).value;}
 else{alert("Ocorreu um erro");}
 if(valor !=""){ objaguarde.abre("ajaxredesenha","Aguarde..."); var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=mudatransp&tema="+idtema+"&valor="+valor+"&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"mudaTransparencia",ajaxredesenha);}
 else{alert("Valor não definido.");}}
function mudanomef(idtema){ g_operacao="mudanome"; if($i("nn"+idtema)){var valor=$i("nn"+idtema).value;}
 else{alert("Ocorreu um erro");}
 if(valor !=""){ var p=$i("nometema"+idtema); $i("nometema"+idtema).innerHTML=valor; objaguarde.abre("ajaxredesenha","Aguarde..."); var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=mudanome&tema="+idtema+"&valor="+valor+"&g_sid="+g_sid; var cp=new cpaint(); cp.set_response_type("JSON"); cp.call(p,"mudaNome",ajaxredesenha);}
 else{alert("Nome não definido");}}
function toponimiaf(idtema){wdocaf("350px","340px",g_locaplic+"/ferramentas/toponimia/index.htm?tema="+idtema,"","","Topon&iacute;mia");}
function filtrof(idtema){wdocaf("480px","250px",g_locaplic+"/ferramentas/filtro/index.htm?tema="+idtema,"","","Filtro");}
function pontosdistri(){ if(g_r=="nao"){alert("Opção não disponível");}
 else{wdocaf("400px","250px",g_locaplic+"/ferramentas/pontosdistri/index.htm","","","Distribuição de pontos");}}
function pontoempoligono(){wdocaf("400px","250px",g_locaplic+"/ferramentas/pontoempoligono/index.htm","","","Ponto em pol&iacute;gono");}
function nptPol(){wdocaf("400px","200px",g_locaplic+"/ferramentas/nptpol/index.htm","","","Pontos por pol&iacute;gono");}
function buffer(){wdocaf("400px","180px",g_locaplic+"/ferramentas/buffer/index.htm","","","Entorno");}
function centroide(){wdocaf("400px","180px",g_locaplic+"/ferramentas/centroide/index.htm","","","Centróide");}
function analisaGeometrias(){ g_tipoacao="selecao"; mudaiconf("selecao"); pontosdistobj=new pontosdist(); objmapa.temaAtivo=""; wdocaf("500px","400px",g_locaplic+'/ferramentas/analisageometrias/index.htm',"","","Sele&ccedil;&atilde;o");}
function gradePontos(){wdocaf("400px","250px",g_locaplic+"/ferramentas/gradepontos/index.htm","","","Grade de pontos");}
function gradePol(){wdocaf("400px","250px",g_locaplic+"/ferramentas/gradepol/index.htm","","","Grade de pol&iacute;gonos");}
function gradeHex(){wdocaf("400px","250px",g_locaplic+"/ferramentas/gradehex/index.htm","","","Grade de hex&aacute;gonos");}
function gradeCoord(){wdocaf("300px","180px",g_locaplic+"/ferramentas/gradecoord/index.htm","","","Grade de coordenadas");}
function procuraratribf(idtema){wdocaf("550px","340px",g_locaplic+"/ferramentas/busca/index.htm?tema="+idtema,"","","Procurar");}
function tabelaf(idtema){wdocaf("500px","400px",g_locaplic+"/ferramentas/tabela/index.htm?tema="+idtema,"","","Tabela");}
function etiquetas(idtema){wdocaf("400px","300px",g_locaplic+"/ferramentas/etiqueta/index.htm?tema="+idtema,"","","Etiquetas");}
function opcoesLegenda(){wdocaf("300px","280px",g_locaplic+"/ferramentas/opcoes_legenda/index.htm","","","Legenda");}
function abreCor(janela,elemento){wdocaf2("385px","280px",g_locaplic+"/ferramentas/colorpicker/index.htm?doc="+janela+"&elemento="+elemento,"","","Cor");}
function editaLegenda(idtema){wdocaf("490px","340px",g_locaplic+"/ferramentas/legenda/index.htm?tema="+idtema,"","","Legenda");}
function conectarwms(){wdocaf("400px","300px",g_locaplic+"/ferramentas/conectarwms/index.htm","","","WMS");}
function conectarwfs(){wdocaf("400px","300px",g_locaplic+"/ferramentas/conectarwfs/index.htm","","","WFS");}
function conectargeorss(){wdocaf("400px","300px",g_locaplic+"/ferramentas/conectargeorss/index.htm","","","GeoRSS");}
function abreSistema(endereco,w,h){ if(endereco !=""){wdocaf(w+"px",h+"px",endereco,"","","Sistemas");}
 else{alert("Endereço não definido");}}
function upload(){wdocaf("300px","200px",g_locaplic+"/ferramentas/upload/index.htm","","","Upload");}
function pegaimagens(){ if($i("lugarquadros")){ if(navm){var wi=window.open("",null,"width=550,height=650,resizable=yes,scrollbars=yes");}
 if(navn){var wi=window.open("","Cor","width=550,height=650,resizable,scrollbars");}
 wi.document.write("<p style='font-size: 12px;font-family: verdana, arial, helvetica, sans-serif;'>Click com o bot&atilde;o da direita do mouse sobre a imagem para fazer o download<br>"); var mensagem="<br><b>N&atilde;o existem imagens guardadas."; for(i=1;i <(quadrosfilme.length);i++){ if(quadrosfilme[i].imagem !=" "){ wi.document.write("<p style='font-size: 12px;font-family: verdana, arial, helvetica, sans-serif;'>Imagem: "+i+"<br>"); wi.document.write("<p style='font-size: 12px;font-family: verdana, arial, helvetica, sans-serif;'>Abrang&eacute;ncia: "+quadrosfilme[i].extensao+"<br>"); wi.document.write("<img src="+quadrosfilme[i].imagem+">"); wi.document.write("<img src="+quadrosfilme[i].referencia+">"); mensagem="<br>Fim" }}
 wi.document.write(mensagem);}}
function abreDoc(){window.open(g_locaplic+"/documentacao/index.html");}
function downloadbase(){window.open(g_locaplic+"/datadownload.htm");}
function download(idtema){wdocaf("300px","150px",g_locaplic+"/ferramentas/download/index.htm?tema="+idtema,"","","Download");}
function opcoesQuadros(){wdocaf("150px","150px",g_locaplic+"/ferramentas/opcoes_quadros/index.htm",objposicaomouse.x-75,objposicaomouse.y-160,"Quadros");}
function opcoesEscala(){wdocaf("250px","300px",g_locaplic+"/ferramentas/opcoes_escala/index.htm",objposicaomouse.x-75,objposicaomouse.y-260,"Escala");}
 function testaferramentas(){}

