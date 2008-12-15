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
busca()
//pega a lista de temas editaveis
function busca()
{
	var listaretorno = function(retorno)
	{
		var ins = "Nada encontrado";
		if (retorno.data)
		{
			if (retorno.data.geonames)
			{
				for (i=0;i<retorno.data.geonames.length; i++)
				{
					if (i == 0){var ins = "<table >";}
					ins += "<tr><td style='width:30%;text-align:left;background-color:rgb(220,220,220)' colspan=2 ><b>"+retorno.data.geonames[i].tema+"</b></td></tr>";
					var layer = retorno.data.geonames[i].layer
					for (j=0;j<retorno.data.geonames[i].lugares.length; j++)
					{
						ins += "<tr><td style='text-align:left'>"
						var nm = retorno.data.geonames[i].lugares[j].nome;
						ins += nm;
						var wkt = retorno.data.geonames[i].lugares[j].limite
						var gid = retorno.data.geonames[i].lugares[j].gid
						ins += "</td><td onclick=\"zoom('"+wkt+"','"+layer+"','"+gid+"','"+nm+"')\" onmouseover=\"mostraxy('"+wkt+"')\" onmouseout='escondexy()' style='color:blue;cursor:pointer'>zoom</td></tr>"
					}
				}
			}
			ins += "</table>"
		}
		$i("resultado").innerHTML = ins
		aguarde("none")
		//var palavra = window.parent.document.getElementById("valorBuscaRapida").value
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=procurartemas&procurar="+palavra+"&g_sid="+g_sid;
		var cp = new cpaint();
		//cp.set_debug(2);
		cp.set_response_type("json");
		cp.call(p,"procurartemas",resultadoTemas);
		
	}
	aguarde("block")
	$i("resultado").innerHTML = "Aguarde..."
	var palavra = window.parent.document.getElementById("valorBuscaRapida").value
	palavra = removeAcentos(palavra);
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=buscaRapida&palavra="+palavra+"&servico="+servico
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("json");
	cp.call(p,"buscaRapida",listaretorno);	
}
function resultadoTemas(retorno)
{
	var retorno = retorno.data;
	if ((retorno != "erro") && (retorno != undefined))
	{
		var ins = "";
		for (ig=0;ig<retorno.length;ig++)
		{
			var ngSgrupo = retorno[ig].subgrupos;
			for (sg=0;sg<ngSgrupo.length;sg++)
			{
				var nomeSgrupo = ngSgrupo[sg].subgrupo;
				var ngTema = ngSgrupo[sg].temas;
				for (st=0;st<ngTema.length;st++)
				{
					if (ngTema[st].link != " ")
					{var lk = "<a href="+ngTema[st].link+" target=blank>&nbsp;fonte</a>";}
					var tid = ngTema[st].tid;
					var inp = "<input style='text-align:left;cursor:pointer;' onclick='adicionatema(this)' class=inputsb style='cursor:pointer' type=\"checkbox\" value='"+tid+"'  /> ("+nomeSgrupo+")";
					var nomeTema = inp+(ngTema[st].nome)+lk+"<br>";
					ins += nomeTema;
				}
			}
		}
		if (ins != "")
		{
			$i("resultado").innerHTML += "<br><b>Temas:</b><br>"+ins
		}
	}
}
function adicionatema(obj)
{
	if (obj.checked)
	{
		window.parent.objaguarde.abre("ajaxredesenha","Aguarde...");
		var temp = function()
		{window.parent.ajaxredesenha("");}
		var p = window.parent.g_locaplic+"/classesphp/mapa_controle.php?funcao=adtema&temas="+obj.value+"&g_sid="+g_sid;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"adicionaTema",temp);
	}
}
function mostraxy(wkt)
{
	var re = new RegExp("POLYGON", "g")
	wkt = wkt.replace(re,"")
	wkt = wkt.split("(")[2].split(")")[0]
	wkt = wkt.split(",");
	x = new Array();
	y = new Array();
	for (w=0;w<wkt.length; w++)
	{
 		temp = wkt[w].split(" ");
 		x.push(temp[0])
 		y.push(temp[1])
	}
	x.sort(sortNumber)
	xMin = x[0]
	xMax = x[(x.length)-1]
	y.sort(sortNumber)
	yMin = y[0]
	yMax = y[(y.length)-1]
 	var xyMin = window.parent.i3GEO.util.dd2tela(xMin,yMin,window.parent.document,window.parent.objmapa.extent,window.parent.objmapa.cellsize)
 	var xyMax = window.parent.i3GEO.util.dd2tela(xMax,yMax,window.parent.document,window.parent.objmapa.extent,window.parent.objmapa.cellsize)
	var box = window.parent.$i("boxg")
	var w = xyMax[0]-xyMin[0]
	var h = xyMin[1]-xyMax[1]
	box.style.display = "block"
	box.style.width = w
	box.style.height = h
	box.style.top = xyMax[1]+"px"
	box.style.left = xyMin[0]+"px"
	
}
function zoom(wkt,layer,gid,nm)
{
    var adicionaCamada = function(layer,gid,nm)
    {
	 	var s = "&tema="+layer
	 	s += "&servico=http://mapas.mma.gov.br/webservices/geonameswms.php?gid="+gid+"&";
	 	s += "&nome=default"
	 	s += "&proj=EPSG:4291&formato=image/png&nomecamada="+nm+" - "+layer
	 	s += "&suportasld=nao&versao=1.1.0"
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=adicionatemawms&g_sid="+g_sid+s;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"mudaExtensao",window.parent.ajaxredesenha);
    }
	var re = new RegExp("POLYGON", "g")
	wkt = wkt.replace(re,"")
	wkt = wkt.split("(")[2].split(")")[0]
	wkt = wkt.split(",");
	x = new Array();
	y = new Array();
	for (w=0;w<wkt.length; w++)
	{
 		temp = wkt[w].split(" ");
 		x.push(temp[0])
 		y.push(temp[1])
	}
	x.sort(sortNumber)
	xMin = x[0]
	xMax = x[(x.length)-1]
	y.sort(sortNumber)
	yMin = y[0]
	yMax = y[(y.length)-1]
	var ext = xMin+" "+yMin+" "+xMax+" "+yMax
	window.parent.objaguarde.abre("ajaxredesenha","Aguarde...");
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&ext="+ext+"&g_sid="+g_sid;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"mudaExtensao",adicionaCamada(layer,gid,nm));
	
}
function sortNumber(a,b)
{
	return a - b
}
function escondexy()
{
	if (window.parent.$i("boxg"))
	{
		var box = window.parent.$i("boxg")
		box.style.display = "none"
		box.style.top = "0px"
		box.style.left = "0px"
	}
}