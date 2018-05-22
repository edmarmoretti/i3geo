/*
Gerador de links

Classe javascript da aplica&ccedil;&atilde;o de gera&ccedil;&atilde;o de links.

L&ecirc; o conjunto de javascripts para o funcionamento da interface geradordelinks.htm

As depend&ecirc;ncias s&atilde;o carregadas pelo pr&oacute;prio geradordelinks.js, n&atilde;o sendo necess&aacute;rio incluir no HTML.

Licen&ccedil;a

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Veja

<i3geo/geradordelinks.htm>

<i3geo/classesjs/funcoes.js>
*/
//
//carrega as depend&ecirc;ncias
//
(function(){
	var scriptLocation = "";
	var scripts = document.getElementsByTagName('script');
	for (var i = 0; i < scripts.length; i++) {
		var src = scripts[i].getAttribute('src');
		if (src) {
			var index = src.lastIndexOf("geradordelinks.js");
			// is it found, at the end of the URL?
			if ((index > -1) && (index + "geradordelinks.js".length == src.length)) {
				scriptLocation = src.slice(0, -"geradordelinks.js".length);
				break;
			}
		}
	}
	var allScriptTags = "";
	var jsfiles = [];
	//jsfiles[0] = "i3geo_tudo_compacto.js.php"
	jsfiles[0] = "../pacotes/openlayers/OpenLayers2131.js.php";
	for (var i = 0; i < jsfiles.length; i++)
	{
		var currentScriptTag = "<script src='" + scriptLocation + jsfiles[i] + "'></script>";
		allScriptTags += currentScriptTag;
	}
	document.write(allScriptTags);
})();
/*
Classe i3geo_gl_configura

Cria o objeto javascript com os parametros de configura&ccedil;&atilde;o da api e com as fun&ccedil;&otilde;es de manipula&ccedil;&atilde;o.

Example

var i3geo_gl_configura = new i3geo_gl_configura("http://localhost/i3geo","estadosl","temasa","link")

Parameters

loc_i3geo - endere&ccedil;o web onde est&aacute; instalado o i3geo.

nomeseltema - identificador do tema inicial que ser&aacute; incluido no link, normalmente estadosl

temasa - Id do elemento HTML onde a lista de temas adicionados, ou seja, os que forem escolhidos pelo usu&aacute;rio, ser&aacute; inclu&iacute;da.

link - Id do elemento HTML do tipo <a> onde ser&aacute; mostrado o link criado para o mapa.

grupo - Id do elemento HTML que receber&aacute; o combo com os grupos

subgrupo - Id do elemento HTML que receber&aacute; o combo com os subgrupos

tema - Id do elemento HTML que receber&aacute; o combo com a lista de temas

buscageo - Id do elemento HTML onde ser&aacute; inclu&iacute;da a op&ccedil;&atilde;o de busca de coordenadas geogr&aacute;ficas

menu - id do elemento HTML onde ser&aacute; incluido a lista de menus
*/
function i3geo_gl_configura(loc_i3geo,nomeseltema,temasa,link,grupo,subgrupo,tema,buscageo,menu)
{
	/*
	Id do elemento HTML onde a lista de temas adicionados, ou seja, os que forem escolhidos pelo usu&aacute;rio, ser&aacute; inclu&iacute;da.
	 */
	this.temasa = temasa;
	/*
	Id do elemento HTML do tipo <a> onde ser&aacute; mostrado o link criado para o mapa.
	 */
	this.link = link;
	/*
	Guarda o valor do parametro seltema
	*/
	this.nomeseltema = nomeseltema;
	/*
	Guarda o valor do parametro loc_i3geo
	*/
	this.loc_i3geo = loc_i3geo;
	/*
	Guarda o valor do parametro menu
	*/
	this.menu = menu;
	/*
	Guarda o valor do parametro grupo
	*/
	this.grupo = grupo;
	/*
	Guarda o valor do parametro subgrupo
	*/
	this.subgrupo = subgrupo;
	/*
	Guarda o valor do parametro tema
	*/
	this.tema = tema;
	/*
	Guarda o valor do parametro buscageo
	*/
	this.buscageo = buscageo;
	/*
	Function seltema

	Adiciona na lista de temas escolhidos pelo usu&aacute;rio um novo tema.

	Ativada quando um grupo ou subgrupo &eacute; escolhido.

	Parameters

	idtema = identificador do tema conforme definido em menutemas/menutemas.xml
	 */
	this.seltema = function(idtema)
	{
		var novodiv = document.createElement("div");
		novodiv.style.textAlign="left";
		novodiv.id = idtema;
		$i($i3geo_gl.temasa).appendChild(novodiv);
		var novoel = document.createElement("img");
		novoel.title = "excluir";
		//novoel.onclick = excluir
		eval("novoel.onclick = $i3geo_gl.excluir");
		novoel.src = "imagens/x.png";
		novodiv.appendChild(novoel);
		var novoel = document.createElement("img");
		novoel.title = "subir";
		novoel.src = "imagens/sobe.gif";
		//novoel.onclick = subir
		eval("novoel.onclick = $i3geo_gl.subir");
		novodiv.appendChild(novoel);
		var novoel = document.createElement("img");
		novoel.title = "descer";
		novoel.src = "imagens/desce.gif";
		//novoel.onclick = descer
		eval("novoel.onclick = $i3geo_gl.descer;");
		novodiv.appendChild(novoel);
		var novoel = document.createElement("input");
		eval("novoel.onclick = function(){$i3geo_gl.crialink()}");
		novoel.title = "vis&iacute;vel/n&atilde;o vis&iacute;vel";
		novoel.type = "checkbox";
		novoel.style.cursor="pointer";
		novoel.style.top="3px";
		novoel.style.position="relative";
		novoel.style.border="0px";
		novoel.value=idtema;
		novodiv.appendChild(novoel);
		var novoel = document.createElement("span");
		novoel.style.cursor="pointer";
		novoel.title="preview";
		novoel.style.textDecoration = "underline";
		novoel.innerHTML = idtema;
		eval("novoel.onclick = $i3geo_gl.preview");
		novodiv.appendChild(novoel);
		novodiv.appendChild(document.createElement("br"));
		this.crialink();
	};
	/*
	Function crialink

	Pega os parametros especificados pelo usu&aacute;rio e monta o link para mostrar na tela.
	*/
	this.crialink = function()
	{
		var ins = $i3geo_gl.loc_i3geo+"/ms_criamapa.php?";
		var iguias = $i($i3geo_gl.temasa).getElementsByTagName("input");
		var tsl = []; //temas ligados
		var tsd = []; //temas
		for (var i=0;i<iguias.length; i++)
		{
			if (iguias[i].type == "checkbox")
			{
				tsd.push(iguias[i].value);
				if (iguias[i].checked == true)
				{tsl.push(iguias[i].value);}
			}
		}
		if(tsd.length > 0)
		{ins += "&temasa="+tsd.join(" ");}
		if(tsl.length > 0)
		{ins += "&layers="+tsl.join(" ");}
		if($i("pontos").value != "")
		{
			ins += "&pontos="+$i("pontos").value;
			ins += "&nometemapontos="+$i("nometemapontos").value;
		}
		if($i("perfili") && $i("perfili").value != "")
		{
			ins += "&perfil="+$i("perfili").value;
		}
		if($i("interface").value != "")
		{
			ins += "&interface="+$i("interface").value;
		}
		if($i($i3geo_gl.buscageo))
		{
			if($i("i3geo_gl_xmin").value != "")
			{
				ins += "&mapext="+$i("i3geo_gl_xmin").value+" ";
				ins += $i("i3geo_gl_ymin").value+" ";
				ins += $i("i3geo_gl_xmax").value+" ";
				ins += $i("i3geo_gl_ymax").value;
			}
		}
		$i($i3geo_gl.link).href = ins;
		$i($i3geo_gl.link).innerHTML = ins;
	};
	/*
	Function combogrupos

	Chama a fun&ccedil;&atilde;o do i3geo que monta um combo com a lista de grupos de um menu do i3geo

	Parameters

	idMenu - id do menu que ser&aacute; pesquisado
	*/
	this.combogrupos = function(idMenu)
	{
		$i($i3geo_gl.grupo).innerHTML = "<span style=color:red >Aguarde...</span>";
		i3GEO.arvoreDeTemas.comboGruposMenu($i3geo_gl.loc_i3geo,"$i3geo_gl.combosubgrupos",$i3geo_gl.grupo,"","530","1",idMenu);
	};
	/*
	Function combosubgrupos

	Chama a fun&ccedil;&atilde;o do i3geo que monta um combo com a lista de subgrupos de um grupo do menu do i3geo

	Parameters

	idGrupo - id do grupo que ser&aacute; pesquisado
	*/
	this.combosubgrupos = function(idGrupo,dados)
	{
		//alert($i3geo_gl.subgrupo);
		$i3geo_gl.combotemas(idGrupo,"",i3GEO.arvoreDeTemas.temasRaizGrupos[idGrupo]);
		//if(dados != undefined)
		//{$i3geo_gl.combotemas(idGrupo,$i3geo_gl.subgrupo,dados.temasgrupo);}
		$i($i3geo_gl.subgrupo).innerHTML = "<span style=color:red >Aguarde...</span>";
		i3GEO.arvoreDeTemas.comboSubGruposMenu($i3geo_gl.loc_i3geo,"$i3geo_gl.combotemas",$i3geo_gl.subgrupo,"",idGrupo,"530","1");
	};
	/*
	Function combotemas

	Monta um combo com a lista de temas vinculados diretamente a um grupo.

	Chamado pela fun&ccedil;&atilde;o combosubgrupos.

	Parameters

	idGrupo - id que identifica o grupo escolhido.

	idSubGrupo - id do sibgrupo
	*/
	this.combotemas = function (idGrupo,idSubGrupo,temas)
	{
		if(temas == undefined)
		{temas = "";}
		$i($i3geo_gl.tema).innerHTML = "<span style=color:red >Aguarde...</span>";
		i3GEO.arvoreDeTemas.comboTemasMenu($i3geo_gl.loc_i3geo,"$i3geo_gl.preseltema",$i3geo_gl.tema,"",idGrupo,idSubGrupo,"530","5","",temas);
	};
	/*
	Function preseltema

	Compatibiliza a chamada da fun&ccedil;&atilde;o i3geo_combotemasMenu com a fun&ccedil;&atilde;o this.seltema em termos de n&uacute;mero de parametros
	*/
	this.preseltema = function(idgrupo,idsubgrupo,idtema)
	{
		$i3geo_gl.seltema(idtema);
	};
	/*
	Function preview

	Mostra um preview do tema clicado.

	Parameters

	e - elemento do DOM do objeto clicado.
	*/
	this.preview = function(e)
	{
		var id = i3GEO.util.pegaElementoPai(e).id;
		window.open("testamapfile.php?map="+id+".map&tipo=grande");
	};
	/*
	Function descer

	Desce um tema na lista de temas selecionados.

	Parameters

	e - elemento do DOM do objeto clicado.
	*/
	this.descer = function(e)
	{
		var pai = i3GEO.util.pegaElementoPai(e);
		divpai = pai.parentNode;
		if(pai.nextSibling)
		divpai.insertBefore(pai,pai.nextSibling.nextSibling);
		$i3geo_gl.crialink();
	};
	/*
	Function subir

	Sobe um tema na lista de temas selecionados

	Parameters

	e - elemento do DOM.
	*/
	this.subir = function(e)
	{
		var pai = i3GEO.util.pegaElementoPai(e);
		divpai = pai.parentNode;
		divpai.insertBefore(pai,pai.previousSibling);
		$i3geo_gl.crialink();
	};
	/*
	Function excluir

	Exclui um tema da lista de temas selecionados

	Parameters

	e - elemento do DOM.
	*/
	this.excluir = function(e)
	{
		var pai = i3GEO.util.pegaElementoPai(e);
		pai.parentNode.removeChild(pai);
		$i3geo_gl.crialink();
	};
	/*
	Function buscageo_init

	Inicializa o OpenLayers para permitir ao usu&aacute;rio escolher a abrang&ecirc;ncia espacial do link.
	*/
	this.buscageo_init = function()
	{
		var ins = "<div style=margin:10px;text-align:left; >";
		ins += "<p class=paragrafo ><b>Utilize o navegador abaixo para definir as coordenadas geogr&aacute;ficas do seu mapa, ou digite os valores desejados (opcional):</b></p>";
		ins += "<div id=i3geo_gl_mapa1 style='width:256px;height:256px;border:1px solid blue;display:none'></div>";
		ins += "<div style=position:absolute;top:40px;left:270px;text-align:left; >";
		ins += "Coordenadas geogr&aacute;ficas:<br><br>";
		ins += "<table style=text-align:left >";
		ins += "<tr><td style=text-align:left >Longitude m&iacute;nima:</td>";
		ins += "<td><div style=padding:5px;width:80px; id=paiXmin >";
		ins += "<input onchange='$i3geo_gl.crialink()' type=text style=width:85px; value='' id=i3geo_gl_xmin />";
		ins += "</div></td></tr>";
		ins += "<tr><td style=text-align:left >Longitude m&aacute;xima:</td>";
		ins += "<td><div style=padding:5px;width:80px; id=paiXmax >";
		ins += "<input onchange='$i3geo_gl.crialink()' type=text style=width:85px; value='' id=i3geo_gl_xmax />";
		ins += "</div></td></tr>";
		ins += "<tr><td style=text-align:left >Latitude m&iacute;nima:</td>";
		ins += "<td><div style=padding:5px;width:80px; id=paiYmin >";
		ins += "<input onchange='$i3geo_gl.crialink()' type=text style=width:85px; value='' id=i3geo_gl_ymin />";
		ins += "</div></td></tr>";
		ins += "<tr><td style=text-align:left >Latitude m&aacute;xima:</td>";
		ins += "<td><div style=padding:5px;width:80px; id=paiYmax >";
		ins += "<input onchange='$i3geo_gl.crialink()' type=text style=width:85px; value='' id=i3geo_gl_ymax />";
		ins += "</div></td></tr></table>";
		ins += "<input style='width:140px;position:relative;top:10px;left:-10px' class=aplicar type='button' value='capturar' onclick='$i3geo_gl.OL.capturageo()' />";
		ins += "</div></div>";
		document.getElementById(this.buscageo).innerHTML = ins;
		$i("i3geo_gl_mapa1").style.display = "block";
		$i3geo_gl.OL = new OpenLayers.Map('i3geo_gl_mapa1',{controls:[],numZoomLevels: 13});
		//
		//layers
		//
		var wsm = new OpenLayers.Layer.ArcGIS93Rest(
			"ESRI World Street Map",
			"http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer/export",
			{
				format : "jpeg"
			}, {
				isBaseLayer : true,
				visibility : true
			});
		$i3geo_gl.OL.addLayer(wsm);

		var bra = new OpenLayers.Layer.WMS(
			"Base carto MMA",
			"http://mapas.mma.gov.br/cgi-bin/mapserv?map=/opt/www/html/webservices/baseraster.map",
			{
				layers : "baseraster",
				srs : "EPSG:4618",
				format : "image/png",
				isBaseLayer : false
			}, {
				isBaseLayer : true,
				visibility : false
			});
		$i3geo_gl.OL.addLayer(bra);

		//
		//zoom e controle de layers
		//
		var ls = new OpenLayers.Control.LayerSwitcher();
		$i3geo_gl.OL.addControl(ls);
		$i(ls.id).style.zIndex=2000;
		$i3geo_gl.OL.setCenter(new OpenLayers.LonLat(-55,-14), 3);
		var panel = new OpenLayers.Control.NavToolbar();
		$i3geo_gl.OL.addControl(panel);
		panel.div.style.left="-4px";
		panel.div.style.top="-298px";
		var zb = new OpenLayers.Control.PanZoomBar();
		$i3geo_gl.OL.addControl(zb);
		zb.div.style.left="0px";
		$i3geo_gl.OL.capturageo = function()
		{
			var b = $i3geo_gl.OL.getExtent();
			$i("i3geo_gl_xmin").value = b.left;
			$i("i3geo_gl_xmax").value = b.right;
			$i("i3geo_gl_ymin").value = b.bottom;
			$i("i3geo_gl_ymax").value = b.top;
			$i3geo_gl.crialink();
		};
	};
}

/*
Function i3geo_gl_inicia

Inicia a interface do gerador de links.

Parameters

objeto_i3geo_gl_configura - objeto com os paramentros de configura&ccedil;&atilde;o criado pela fun&ccedil;&atilde;o i3geo_gl_configura
*/
function i3geo_gl_inicia(objeto_i3geo_gl_configura)
{
	/*
	Propriedade $i3geo_gl

	Cont&eacute;m o objeto $i3geo_gl com todas as propriedades e fun&ccedil;&otilde;es de controle da interface
	*/
	i3GEO.configura.sid = "";
	$i3geo_gl = objeto_i3geo_gl_configura;
	if(document.getElementById($i3geo_gl.buscageo))
	$i3geo_gl.buscageo_init();
	$i3geo_gl.seltema($i3geo_gl.nomeseltema);
	i3GEO.arvoreDeTemas.comboMenus($i3geo_gl.loc_i3geo,"$i3geo_gl.combogrupos",$i3geo_gl.menu,"","530","1","");
	/*
	$inputText("paiPontos","","pontos","","","")
	$inputText("paiNometemapontos","","nometemapontos","","","")
	$inputText("paiPerfil","","perfil","","","")
	*/
}