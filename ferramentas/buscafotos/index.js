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
parametrosURL()
new YAHOO.widget.Button("botao1",{onclick:{fn: function(){
	busca("1")
}}});
new YAHOO.widget.Button("botao2",{onclick:{fn: function(){
	mostramenu()
}}});
new YAHOO.widget.Button("botao3",{onclick:{fn: function(){
	window.parent.i3GEO.parametros.mapscale=150000;
	window.parent.i3GEO.navega.aplicaEscala(window.parent.i3GEO.configura.locaplic,window.parent.i3GEO.configura.sid,150000)
	mostramenu()
}}});

function mostramenu()
{
	$i("mensagem").style.display="none"
	$i("busca").style.display="block"
	//busca(1)
}	
function busca(pagina)
{
	aguarde("block")
	$i("resultadofotos").innerHTML = "Aguarde...";
	$i("paginas").innerHTML = "";
	var texto = $i("texto").value;
	var ai = $i("ai").value;
	var af = $i("af").value;
	escondexy();
	if(window.parent.i3GEO.parametros.mapexten)
	{var m = window.parent.i3GEO.parametros.mapexten}
	else
	{var m = "-43.5680912209 -23.1679922593 -42.6162372815 -22.4685575305";} //apenas para exemplo

	var cp = new cpaint();
	cp.set_response_type("JSON");
	if($i("buscaflickr").checked)
	{
		$i("f").style.display="block"
		var p = g_locaplic+"/ferramentas/buscafotos/funcoes.php?funcao=listafotosflickr&ret="+m+"&key="+key+"&texto="+texto+"&ai="+ai+"&af="+af+"&page="+pagina;
		cp.call(p,"listafotosflickr",listafotosflickr);
	}
	if($i("buscapanoramio").checked)
	{
		$i("f").style.display="none"
		$i("paginas").innerHTML = pagina+50;
		var ai = pagina
		var af = pagina+50
		var p = g_locaplic+"/ferramentas/buscafotos/funcoes.php?funcao=listafotospanoramio&ret="+m+"&ai="+ai+"&af="+af;
		cp.call(p,"listafotospanoramio",listafotospanoramio);
	}
	if($i("buscalocr").checked)
	{
		$i("f").style.display="none"
		$i("paginas").innerHTML = pagina+50;
		var ai = pagina
		var af = pagina+50
		var p = g_locaplic+"/ferramentas/buscafotos/funcoes.php?funcao=listafotoslocr&ret="+m+"&ai="+ai+"&af="+af;
		cp.call(p,"listafotoslocr",listafotoslocr);
	}

}
function listafotospanoramio(retorno)
{
	aguarde("none")
	if (retorno.data==undefined )
	{$i("resultadofotos").innerHTML = "Erro. A operação demorou muito.";return;}
	$i("resultadofotos").style.height = "335px"
	eval("var data = "+retorno.data)
	if(!retorno.data)
	{ins += "<br><span style=color:red>Problemas no acesso aos dados!</span><br><br>";return;}
	var res = data.count
	var ins = ""
	ins += "<span><b>Fotos encontradas na regi&atilde;o vista no mapa:</span><br><br>"
	if (res == 1)
	{ins += "<br><span style=color:red>Nada encontrado nessa regi&atilde;o!</span><br><br>";}
	else
	{
		ins += "<table width='90%'>"
		for (i=0;i<res;i++)
		{
			if(data.photos[i])
			{
				ins += "<tr><td>"
				ins += "<img src='"+data.photos[i].photo_file_url+"' "
				ins += " onmouseout='escondexy()' onmouseover='mostraxy(\""+data.photos[i].latitude+","+data.photos[i].longitude+"\")'"
				ins += "/></td>"
				ins += "<td style='text-align:left' ><a href='"+data.photos[i].owner_url+"' target='_blank' >autor: "+data.photos[i].owner_name+" - "+data.photos[i].photo_title+"</a><br><br>"
				ins += "</td></tr>"
			}
		}
		ins += "</table>"
	}
	$i("resultadofotos").innerHTML = ins;
	var p = parseInt($i("paginas").innerHTML)
	if(res > 50)
	{
		var ins = "<span onclick='busca(\""+p+"\")' style='cursor:pointer;text-decoration:underline' >mais...&nbsp;</span>"
		$i("paginas").innerHTML = ins;
	}
	else
	$i("paginas").innerHTML = "";
}
function listafotosflickr(retorno)
{
	aguarde("none")
	if (retorno.data==undefined )
	{$i("resultadofotos").innerHTML = "Erro. A operação demorou muito.";return;}
	$i("resultadofotos").style.height = "150px"
	if((!retorno.data) || (retorno.data == ""))
	{ins = "<br><span style=color:red>Problemas no acesso aos dados!</span><br><br>";$i("resultadofotos").innerHTML = ins;return;}
	var data = retorno.data.photo
	var res = data.length
	var ins = ""
	ins += "<span><b>Fotos encontradas na regi&atilde;o vista no mapa:</span><br><br>"
	if (res == 0)
	{ins += "<br><span style=color:red>Nada encontrado nessa regi&atilde;o!</span><br><br>";}
	else
	{
		ins += "<table width='90%'>"
		for (i=0;i<res;i++)
		{
			ins += "<tr><td>"
			ins += "<img src='http://farm"+data[i].farm+".static.flickr.com/"+data[i].server+"/"+data[i].id+"_"+data[i].secret+"_s.jpg' "
			ins += " onmouseout='escondexy()' onmouseover='mostraxy(\""+data[i].latitude+","+data[i].longitude+"\")'"
			ins += "/></td>"
			ins += "<td style='text-align:left' ><a href='http://www.flickr.com/photos/"+data[i].owner+"/"+data[i].id+"/' target='_blank' >"+data[i].title+"</a><br><br>"
			ins += "</td></tr>"
		}
		ins += "</table>"
	}
	$i("resultadofotos").innerHTML = ins;
	var p = retorno.data.pages
	var ins = "";
	for (i=0;i<p;i++)
	{
		ins += "<span onclick='busca(\""+i+"\")' style='cursor:pointer;text-decoration:underline' >"+i+"&nbsp;</span>"
	}
	$i("paginas").innerHTML = ins;
}
function listafotoslocr(retorno)
{
	aguarde("none")
	if (retorno.data==undefined )
	{$i("resultadofotos").innerHTML = "Erro. A operação demorou muito.";return;}
	$i("resultadofotos").style.height = "340px"
	eval("var data = "+retorno.data)
	if(!retorno.data)
	{ins += "<br><span style=color:red>Problemas no acesso aos dados!</span><br><br>";return;}
	var res = data.photos.length
	var ins = ""
	ins += "<span><b>Fotos encontradas na regi&atilde;o vista no mapa:</span><br><br>"
	if (res == 0)
	{ins += "<br><span style=color:red>Nada encontrado nessa regi&atilde;o!</span><br><br>";}
	else
	{
		ins += "<table width='90%'>"
		for (i=0;i<res;i++)
		{
			if(data.photos[i])
			{
				ins += "<tr><td>"
				ins += "<img src='"+data.photos[i].photo_file_url+"' "
				ins += " onmouseout='escondexy()' onmouseover='mostraxy(\""+data.photos[i].latitude+","+data.photos[i].longitude+"\")'"
				ins += "/></td>"
				ins += "<td style='text-align:left' ><a href='"+data.photos[i].user_url+"' target='_blank' >autor: "+data.photos[i].user_name+" - "+data.photos[i].caption+"</a><br><br>"
				ins += "</td></tr>"
			}
		}
		ins += "</table>"
	}
	$i("resultadofotos").innerHTML = ins;
	var p = parseInt($i("paginas").innerHTML)
	if(res > 50)
	{
		var ins = "<span onclick='busca(\""+p+"\")' style='cursor:pointer;text-decoration:underline' >mais...&nbsp;</span>"
		$i("paginas").innerHTML = ins;
	}
	else
	$i("paginas").innerHTML = "";
}

function mostraxy(xy)
{
	var xy = xy.split(",")
 	var xy = window.parent.i3GEO.calculo.dd2tela(xy[1]*1,xy[0]*1,window.parent.document.getElementById("img"),window.parent.i3GEO.parametros.mapexten,window.parent.i3GEO.parametros.pixelsize)
	var box = window.parent.$i("boxpin")
	box.style.display = "block"
	box.style.width = "21px"
	box.style.height = "25px"
	box.style.top = parseInt(xy[1])+"px"
	box.style.left = parseInt(xy[0])+"px"
}
function escondexy()
{
	if(window.parent.$i("boxpin"))
	{
		var box = window.parent.$i("boxpin")
		box.style.display = "none"
		box.style.top = "0px"
		box.style.left = "0px"
	}
}
function esconde(obj)
{
	$i("f").style.display="none"
	$i("resultadofotos").innerHTML = "";
	$i("paginas").innerHTML = ""
	if(obj.value=="flickr")
	{$i("f").style.display="block"}
	else
	{busca("1")}
}