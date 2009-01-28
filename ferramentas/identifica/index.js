/*
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
//inicializa
function inicializaJanela()
{
	aguarde("block")
	ativaGuias("")
	mostraGuia("guia1")
	g_locaplic = window.parent.g_locaplic
	xpt = unescape(((((window.location.href).split("x="))[1]).split("&"))[0] );
	ypt = unescape(((((window.location.href).split("y="))[1]).split("&"))[0] );
	escala = unescape(((((window.location.href).split("x="))[1]).split("&"))[0] );
	//eventos das guias
	$i("guia1").onclick = function(){listaTemasLigados();mostraGuia("guia1")}
	$i("guia2").onclick = function(){listaTodos()}
	$i("guia3").onclick = function(){mostraGuia("guia3")}
	$i("xy").innerHTML = "x: " + xpt + "  y: " + ypt
	listaTemasLigados()
}
//le o arquivo opcional de sistemas
function pegavalSistemas(xmlDoc)
{
	aguarde("none");
	if (xmlDoc != undefined)
	{
		var sis = xmlDoc.getElementsByTagName("FUNCAO")
		for (ig=0;ig<sis.length;ig++)
		{	
			var sistema = sis[ig].getElementsByTagName("NOMESIS")[0].firstChild.nodeValue
			if(sis[ig].getElementsByTagName("PUBLICADO")[0])
			{
				if(sis[ig].getElementsByTagName("PUBLICADO")[0].firstChild)
				{
					var pub = sis[ig].getElementsByTagName("PUBLICADO")[0].firstChild.nodeValue;
					if(pub == "NAO" || pub == "nao")
					{var sistema = "<s>"+sistema+"</s>";}
				}
			}
			var exec = sis[ig].getElementsByTagName("ABRIR")[0].firstChild.nodeValue
			var temp = exec.split('"')
			if(temp.length == 1)
			var exec = '"'+exec+'"'
			var temp = exec.split("?")
			if(temp.length != 2)
			exec += '+"?"'
			exec += '+"'+"&x="+xpt+"&y="+ypt+'"'
			var t = "blank"
			if (sis[ig].getElementsByTagName("TARGET")[0])
			{t = sis[ig].getElementsByTagName("TARGET")[0].firstChild.nodeValue}
			sistemasAdicionais.push(sistema+","+exec+","+t)
		}
		if (sistemasAdicionais.length > 0)
		{
			var linhas = ""
			for (l=0;l<sistemasAdicionais.length;l++)
			{
				var ltema = sistemasAdicionais[l].split(",")
				if (ltema.length > 1)
				linhas += "<span style='text-align:left;font-size:10px;cursor:pointer' onclick='identificasistema("+ltema[1]+",\""+ltema[2]+"\")'><input style=cursor:default type=radio name=tema />"+ltema[0]+"<br></span>"
			}
			$i("resultado").innerHTML += linhas
		}
	}
	aguarde("none");
}
//lista os temas ligados
function listaTemasLigados()
{
	aguarde("none");
	var retorno = function (retorno)
	{
		//var lista = (window.parent.objmapa.temas).split(";")
		var lista = retorno.data;
		var b = window.parent.i3GEO.calculo.dd2dms(xpt,ypt);
		var x = b[0].split(" ")
		var y = b[1].split(" ")
		var w = "W"
		var s = "S"
		if (x[0]*1 > 0){w = "L"}
		if (y[0]*1 > 0){s = "N"}
		if (x[0]*1 < 0){x[0] = x[0]*-1}
		if (y[0]*1 < 0){y[0] = y[0]*-1}
		var param = y[0]+"_"+y[1]+"_"+y[2]+"_"+s+"_"+x[0]+"_"+x[1]+"_"+x[2]+"_"+w
		var url = "http://tools.wikimedia.de/~magnus/geo/geohack.php?params="+param//15_48_00_S_47_51_50_W
		var linhas = "<a href='"+url+"' target=blank >Buscadores web</a><br>"
		linhas += "Clique no tema para ver os dados<table class=lista2 >"
		var linhas1 = "";
		for (l=0;l<lista.length;l++)
		{
			var nome = lista[l].nome
			var tema = lista[l].tema
			if(lista[l].identifica != "nao")
			{
		 		linhas1 += "<tr><td><input onclick='identifica(\""+tema+"\")' style=cursor:pointer type=radio name=tema /></td><td>"+nome+"</td></tr>"
			}
		}
		$i("resultado").innerHTML = linhas+"<table class=lista ><tr><td style=text-align:left ><input onclick='identifica(\"ligados\")' style=cursor:pointer type=radio name=tema /></td><td>Todos</td></tr>"+linhas1+"</table>"
		//verifica se existem sistemas para identificar
		g_locidentifica = window.parent.i3GEO.parametros.locidentifica
		if (g_locidentifica != "")
		{
			sistemasAdicionais = new Array()
			i3GEO.util.ajaxexecASXml(g_locidentifica,"pegavalSistemas")
		}
		if (window.parent.i3GEO.temaAtivo == "")
		{
			var temp = "";
			for (l=0;l<lista.length;l++)
			{
				if(lista[l].identifica != "nao")
				{var temp = lista[l].tema;break;}
			}			
			identifica(temp)
		}
		else
		{identifica(window.parent.i3GEO.temaAtivo)}
	};
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatemas&opcao=ligados"
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"listatemas",retorno);
	
	
}
//lista os temas ligados
function listaTodos()
{
	var lista = (window.parent.objmapa.temas).split(";")
	var linhas = "Clique no tema para ver os dados<table class=lista2 >"
	for (l=0;l<lista.length;l++)
	{
		var ltema = lista[l].split("*")
		if (ltema[2] != 2)
		linhas += "<tr><td><input onclick='identifica(\""+ltema[0]+"\")' style=cursor:pointer type=radio name=tema /></td><td>"+ltema[2]+"</td></tr>"
	}
	$i("resultado").innerHTML = "<table>"+linhas+"</table>"
	mostraGuia("guia1");
}
//identifica o sistema clicado
function identificasistema(exec,t)
{
	var resolucao = $i("resolucao").value;
	if ((t == "blank") || (t == "new") || (t == "BLANK") || (t == "NEW") || (t == ""))
	{window.open(exec)}
	else
	{window.location.href = exec}
}
//identifica o tema clicado
function identifica(tema)
{
	aguarde("block")
	var resolucao = $i("resolucao").value;
	window.parent.i3GEO.temaAtivo = tema;
	var temp = $i("xy").innerHTML
	var tempy = temp.split("y: ")
	ypt = tempy[1]
	var tempx = tempy[0]
	tempx = tempx.split("x: ")
	xpt = tempx[1]
	$i("ocorrencia").innerHTML="<img src='../../imagens/aguarde.gif' />"
	//var resolucao = "0.01"
	if (tema == "ligados"){var opcao = "ligados"}
	else
	{var opcao = "tema"}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=identifica&xy="+xpt+" ,"+ypt+"&opcao="+opcao+"&resolucao="+resolucao+"&tema="+tema
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"identifica",mostraf);
}
//mostra uma ocorrencia em um div a parte
function mostraf(retorno)
{
	var res = ""
	if (retorno.data != undefined)
	{
		var retorno = retorno.data
		var re = new RegExp("zzzzzzzzzz","g")
		var retorno = retorno.replace(re,"<br>")
		var re = new RegExp('" ',"g")
		var retorno = retorno.replace(re,'"<br>')
		var re = new RegExp("' ","g")
		var retorno = retorno.replace(re,"'<br>")	
		var reg = /Erro./;
		if (retorno.search(reg) != -1)
		{
			$i("ocorrencia").innerHTML="OOps! Ocorreu um erro\n"+retorno;
			return;
		}
		$i("ocorrencia").innerHTML=""
		var octemas = retorno.split("!")
		for (octemasc=0;octemasc<octemas.length;octemasc++)
		{
			var titulo = octemas[octemasc].split("@")
			var contat = 0
			if (!titulo[1])
			{
			 	//aguarde("none")
				//$i("ocorrencia").innerHTML = "<p style=color:red >Ocorreu um erro<br>"
				break
			}
			var ocs = titulo[1].split("*")
			res += "<div style='left:2px;text-align:left;background-color:white;width:80%' >"+titulo[0]+"</div>"
			//verifica se é WS
			var pares = ocs[1].split("##")
			var valores = pares[0].split("#")
			//dados vem de uma chamada WS
			if (valores[1] == undefined)
			{
				res += "<div style=text-align:left >Resultado: <pre><i>" + valores[0] + "</i></pre></div>"
				res += "<div>------</div>"
				$i("ocorrencia").innerHTML=res
				//return
			}
			var contao = 0
			for (oc=0;oc<ocs.length;oc++)
			{
				if (ocs[oc] != "")
				{
					var pares = ocs[oc].split("##")
					if (contao == 1){var ver = true}
					else {var ver = false}
					var contav = 0
					var cor = "RGB(245,245,245)";
					for (par=0;par<pares.length;par++)
					{
						var valores = pares[par].split("#")
						var vlink = valores[2]
						if ((valores[2] != " ") && (valores[2] != undefined))
						{res = res + "<div style='width:80%;text-align:left;background-color:"+cor+"' >&nbsp;&nbsp;" + valores[0] + " <a href='" + vlink + "' > link</a></div>"}
						else if ((valores[2] == " ") || (valores[2] != undefined))
						{
							var testaIcone = (valores[0].split(".png")).length
							if (testaIcone == 1) //nao é do tipo ícone
							{res = res + "<div style='border-top:0px solid brown;font-size:9px;width:90%;text-align:left;background-color:"+cor+"' ><b>&nbsp;&nbsp;" + valores[0] + " </b>" + valores[1] + "</div>"}
							else //corrige o caminho do ícone
							{
								var i = valores[0].replace("..","../..")
								res = res + "<div style='width:80%;text-align:left;background-color:"+cor+"' >" + i + " <i>" + valores[1] + "</i></div>"
							}
						}
						contav = contav + 1
						if (cor == "RGB(245,245,245)"){cor = "RGB(230,230,230)";}
						else
						{cor = "RGB(245,245,245)";}
					}
					//res += "<div style='border-top:1px solid gray;background-color:gray;width:100%;' ><br></div>"
				}
				contao = contao + 1
			}
		}
		$i("ocorrencia").innerHTML=res
		aguarde("none")
	}
	else
	{
		aguarde("none")
		$i("ocorrencia").innerHTML = "<p style=color:red >Ocorreu um erro<br>"
	}
}