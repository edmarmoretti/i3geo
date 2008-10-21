/*
Title: Arvore

Funções javascript utilizadas no sistema de administração do menu de mapas

File: i3geo/admin/mapas.js

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

$i = function(i)
{return document.getElementById(i);};

YAHOO.namespace("example.container");

function pegaClasses(codigoMap,codigoLayer)
{
	var ins = "<br><fieldset style='background-color:beige'><legend>+- Classes</legend><div style=display:none >"
	ins += "<p><input onclick=adicionarClasse('"+codigoLayer+"',this) type=button value='Adicionar classe' /></p>"
	ins += "<br><fieldset><legend>+- Legenda (amostra)</legend><div style=display:none >"
	ins += "<img id='legenda_"+codigoLayer+"' src='../ogc.php?tema=bioma&service=wms&request=getlegendgraphic&layer="+codigoLayer+"&format=image/png' />"
	ins += "</div></fieldset>"
	var retorna = function(retorna)
	{
		var nc = retorna.data.length
		for(c=0;c<nc;c++)
		{
			d = retorna.data[c]
					
			ins += (geraLinhas2(d.dados,param,"salvarClasse"));

			var param = {
				"linhas":[
				]
			}

			ins += "<br><fieldset style=background-color:#f0e68c ><legend style=color:brown >+- Mais...</legend><div style=display:none >"
			ins += (geraLinhas2(d.dados,param,"salvarClasse"));
			ins += "</fieldset>"
			//labels
			ins += "<br><fieldset><legend style=color:brown >+- Label (para ativar, defina LABELITEM em caract. gerais)</legend><div style=display:none >"		
			var param = {
				"linhas":[
					{texto:"Color to draw text with.",
					titulo:"color",prefixoid:"label_color_",id:codigoLayer+"_"+d.id,valor:"label.color"},
					{texto:"Text size. Use integer to give the size in pixels of your TrueType font based label, or any of theother 5 listed keywords to bitmap fonts.",
					titulo:"size",prefixoid:"label_size_",id:codigoLayer+"_"+d.id,valor:"label.size"},
					{texto:"Position of the label relative to the labeling point (layers only). First letter is Y position, second letter is X position. Auto tells MapServer to calculate a label position that will not interfere with other labels. With points and polygons, MapServer selects from the 8 outer positions (i.e. excluding cc). With lines, it only uses lc or uc, until it finds a position that doesn't collide with labels that have already been drawn. If all positions cause a conflict, then the label is not drawn (Unless the label's FORCE a parameter is set to true). Auto placement is only available with cached labels.",
					titulo:"position",prefixoid:"label_position_",id:codigoLayer+"_"+d.id,valor:"label.position"},
					{texto:"Padding, in pixels, around labels. Useful for maintaining spacing around text to enhance readability. Available only for cached labels. Default is 0.",
					titulo:"buffer",prefixoid:"label_buffer_",id:codigoLayer+"_"+d.id,valor:"label.buffer"}
				]
			}

			ins += "<br><fieldset><legend>+- font</legend><div style=display:none >"
			ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Font alias (as defined in the FONTSET) to use for labeling.</p>"
			ins += "<p><select onchange='this.style.color=\"blue\"' id='label_font_"+codigoLayer+"_"+d.id+"' >"
			ins += combolista(fontes,d.dados.label.font)
			ins += "</select>"
			ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarClasseLabel(\""+codigoLayer+"_"+d.id+"\",\".font\",this)'/>"
			ins += "</p></div></fieldset>"

			ins += "<br><fieldset><legend>+- type</legend><div style=display:none >"
			ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Type of font to use. Generally bitmap fonts are faster to draw then TrueType fonts. However,TrueType fonts are scalable and available in a variety of faces. Be sure to set the FONT parameter ifyou select TrueType.</p>"
			ins += "<p><select onchange='this.style.color=\"blue\"' id='label_type_"+codigoLayer+"_"+d.id+"' >"
			ins += comboObjeto(objfonttypes,"valor","texto",d.dados.label.type)
			ins += "</select>"
			ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarClasseLabel(\""+codigoLayer+"_"+d.id+"\",\".type\",this)'/>"
			ins += "</p></div></fieldset>"

			ins += "<br><fieldset><legend>+- partials</legend><div style=display:none >"
			ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Can text run off the edge of the map? Default is true.</p>"
			ins += "<p><select onchange='this.style.color=\"blue\"' id='label_type_"+codigoLayer+"_"+d.id+"' >"
			ins += comboObjeto(objbool_tf,"valor","texto",d.dados.label.partials)
			ins += "</select>"
			ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarClasseLabel(\""+codigoLayer+"_"+d.id+"\",\".partials\",this)'/>"
			ins += "</p></div></fieldset>"
			
			ins += "<br><fieldset><legend>+- force</legend><div style=display:none >"
			ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Forces labels for a particular class on, regardless of collisions. Available only for cached labels. Default is false.</p>"
			ins += "<p><select onchange='this.style.color=\"blue\"' id='label_type_"+codigoLayer+"_"+d.id+"' >"
			ins += comboObjeto(objbool_tf,"valor","texto",d.dados.label.force)
			ins += "</select>"
			ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarClasseLabel(\""+codigoLayer+"_"+d.id+"\",\".force\",this)'/>"
			ins += "</p></div></fieldset>"
			
			ins += (geraLinhas2(d.dados,param,"salvarClasseLabel"));
			var param = {
				"linhas":[
					{texto:"Color to draw a background rectangle (i.e. billboard). Off by default.",
					titulo:"backgroundcolor",prefixoid:"label_backgroundcolor_",id:codigoLayer+"_"+d.id,valor:"label.backgroundcolor"},
					{texto:"Color to draw a background rectangle (i.e. billboard) shadow. Off by default.",
					titulo:"backgroundshadowcolor",prefixoid:"label_backgroundshadowcolor_",id:codigoLayer+"_"+d.id,valor:"label.backgroundshadowcolor"},
					{texto:"Color to draw a one pixel outline around the text.",
					titulo:"outlinecolor",prefixoid:"label_outlinecolor_",id:codigoLayer+"_"+d.id,valor:"label.outlinecolor"},
					{texto:"Color of drop shadow.",
					titulo:"shadowcolor",prefixoid:"label_shadowcolor_",id:codigoLayer+"_"+d.id,valor:"label.shadowcolor"},
					{texto:"Shadow offset in pixels.",
					titulo:"shadowsizex",prefixoid:"label_shadowsizex_",id:codigoLayer+"_"+d.id,valor:"label.shadowsizex"},
					{texto:"Shadow offset in pixels.",
					titulo:"shadowsizey",prefixoid:"label_shadowsizey_",id:codigoLayer+"_"+d.id,valor:"label.shadowsizey"},
					{texto:"How far should the background rectangle be offset? Default is 1.",
					titulo:"backgroundshadowsizex",prefixoid:"label_backgroundshadowsizex_",id:codigoLayer+"_"+d.id,valor:"label.backgroundshadowsizex"},
					{texto:"How far should the background rectangle be offset? Default is 1.",
					titulo:"backgroundshadowsizey",prefixoid:"label_backgroundshadowsizey_",id:codigoLayer+"_"+d.id,valor:"label.backgroundshadowsizey"},
					{texto:"Minimum font size to use when scaling text (pixels). Default is 4.",
					titulo:"minsize",prefixoid:"label_minsize_",id:codigoLayer+"_"+d.id,valor:"label.minsize"},
					{texto:"Maximum font size to use when scaling text (pixels). Default is 256.",
					titulo:"maxsize",prefixoid:"label_maxsize_",id:codigoLayer+"_"+d.id,valor:"label.maxsize"},
					{texto:"Offset values for labels, relative to the lower left hand corner of the label and the label point. Given in pixels. In the case of rotated text specify the values as if all labels are horizontal and any rotation will be compensated for.",
					titulo:"offsetx",prefixoid:"label_offsetx_",id:codigoLayer+"_"+d.id,valor:"label.offsetx"},
					{texto:"Offset values for labels, relative to the lower left hand corner of the label and the label point. Given in pixels. In the case of rotated text specify the values as if all labels are horizontal and any rotation will be compensated for.",
					titulo:"offsety",prefixoid:"label_offsety_",id:codigoLayer+"_"+d.id,valor:"label.offsety"},
					{texto:"Angle, given in degrees, to draw the label or AUTO to allow the software to compute the angle, AUTO is valid for LINE layers only. FOLLOW was introduced in version 4.10 and tells map server to compute a curved label for appropriate linear features",
					titulo:"angle",prefixoid:"label_angle_",id:codigoLayer+"_"+d.id,valor:"label.angle"},
					{texto:"Should text be antialiased? Note that this requires more available colors, decreased drawing performance, and results in slightly larger output images.",
					titulo:"antialias",prefixoid:"label_antialias_",id:codigoLayer+"_"+d.id,valor:"label.antialias"},
					{texto:"Character that represents an end-of-line condition in label text, thus resulting in a multi-line label.",
					titulo:"wrap",prefixoid:"label_wrap_",id:codigoLayer+"_"+d.id,valor:"label.wrap"},
					{texto:"Minimum size a feature must be to be labeled. Given in pixels. For line data the overall length of the displayed line is used, for polygons features the smallest dimension of the bounding box is used. Auto keyword tells MapServer to only label features that are larger than their corresponding label. Available for cached labels only.",
					titulo:"minfeaturesize",prefixoid:"label_minfeaturesize_",id:codigoLayer+"_"+d.id,valor:"label.minfeaturesize"},
					{texto:"Minimum distance between duplicate labels. Given in pixels.",
					titulo:"mindistance",prefixoid:"label_mindistance_",id:codigoLayer+"_"+d.id,valor:"label.mindistance"},
					{texto:"Supported encoding format to be used for labels. If the format is not supported, the label will not be drawn. Requires the iconv library (present on most systems). The library is always detected if present on the system, but if not the label will not be drawn. Required for displaying international characters in MapServer. More information can be found at: http://www.foss4g.org/FOSS4G/MAPSERVER/mpsnf-i18n-en.html.",
					titulo:"encoding",prefixoid:"label_encoding_",id:codigoLayer+"_"+d.id,valor:"label.encoding"}
				]
			}			
			ins += "<br><fieldset style=background-color:#f0e68c ><legend style=color:brown >+- Mais...</legend><div style=display:none >"
			ins += (geraLinhas2(d.dados,param,"salvarClasseLabel"));
			ins += "</fieldset>"

			ins += "</div></fieldset>"

			ins += "<br><fieldset><legend style=color:brown >+- Estilos</legend><div style=display:none >"
			ins += "<p><input onclick=adicionarEstilo('"+codigoLayer+"','"+d.id+"',this) type=button value='Adicionar estilo' /></p>"
			ins += "<div id='estilos_"+codigoLayer+"_"+d.id+"' ></div>"
			ins += "</div></fieldset>"
			ins += "</div></fieldset>"
		}
		ins += "</div></fieldset>"
		$i("classes_"+codigoLayer+"_"+codigoMap).innerHTML = ins
		pegaEstilos(codigoMap,codigoLayer)
	}
	var p = "../php/temas.php?funcao=pegaClasses&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	cPaint.call(p,"",retorna);

}
function pegaEstilos(codigoMap,codigoLayer)
{
	var retorna = function(retorno)
	{
		var nc = retorno.data.length
		for(c=0;c<nc;c++)
		{
			var idclasse = retorno.data[c].classe
			var estilos = retorno.data[c].estilos
			var divestilos = "estilos_"+codigoLayer+"_"+idclasse;
			var nes = retorno.data[c].estilos.length
			for(est=0;est<nes;est++)
			{
				var ins = ""
				var d = retorno.data[c].estilos[est].dados
				var preid = codigoLayer+"_"+idclasse+"_"+est
				var param = {
					"linhas":[
						{texto:"The symbol name or number to use for all features if attribute tables are not used. The number is the index of the symbol in the symbol file, starting at 1, the 5th symbol in the file is therefore symbol number 5. You can also give your symbols names using the NAME keyword in the symbol definition file, and use those to refer to them. Default is 0, which results in a single pixel, single width line, or solid polygon fill, depending on layer type.You can also specify a gif or png filename. The path is relative to the location of the mapfile.",
						titulo:"symbolname",prefixoid:"",id:"symbolname_"+preid,valor:"symbolname"},
						{texto:"Color to use for drawing features.",
						titulo:"color",prefixoid:"",id:"color_"+preid,valor:"color"},
						{texto:"Height, in pixels, of the symbol/pattern to be used. Only useful with scalable symbols. Default is 1. For symbols of Type HATCH, the SIZE is the distance between hatched lines. For its use with hatched lines, see Example#8 in the SYMBOL examples.",
						titulo:"size",prefixoid:"",id:"size_"+preid,valor:"size"},
						{texto:"Color to use for outlining polygons and certain marker symbols. Line symbols do not support outline colors.",
						titulo:"outlinecolor",prefixoid:"",id:"outlinecolor_"+preid,valor:"outlinecolor"},
						{texto:"Width refers to the thickness of line work drawn, in pixels. Default is 1. For symbols of Type HATCH, the WIDTH is how thick the hatched lines are. For its use with hatched lines, see Example#8 in the SYMBOL examples.",
						titulo:"width",prefixoid:"",id:"width_"+preid,valor:"width"},
					]
				}
				ins += "<br><fieldset style='background-color:rgb(240,240,240)'><legend>+- "+est+"</legend>"
				ins += (geraLinhas2(d,param,"salvarEstilo"));
				
				var param = {
					"linhas":[
						{texto:"Height, in pixels, of the symbol/pattern to be used. Only useful with scalable symbols. Default is 1. For symbols of Type HATCH, the SIZE is the distance between hatched lines. For its use with hatched lines, see Example#8 in the SYMBOL examples.",
						titulo:"minsize",prefixoid:"",id:"minsize_"+preid,valor:"minsize"},
						{texto:"Maximum size in pixels to draw a symbol. Default is 50.",
						titulo:"maxsize",prefixoid:"",id:"maxsize_"+preid,valor:"maxsize"},
						{texto:"Offset values for shadows, hollow symbols, etc ...",
						titulo:"offsetx",prefixoid:"",id:"offsetx_"+preid,valor:"offsetx"},
						{texto:"Offset values for shadows, hollow symbols, etc ...",
						titulo:"offsety",prefixoid:"",id:"offsety_"+preid,valor:"offsety"},
						{texto:"Should TrueType fonts and Cartoline symbols be antialiased.",
						titulo:"antialias",prefixoid:"",id:"antialias_"+preid,valor:"antialias"},
						{texto:"Minimum width in pixels to draw the line work.",
						titulo:"minwidth",prefixoid:"",id:"minwidth_"+preid,valor:"minwidth"},
						{texto:"Angle, given in degrees, to draw the line work. Default is 0. For symbols of Type HATCH, this is the angle of the hatched lines. For its use with hatched lines, see Example#8 in the SYMBOL examples.",
						titulo:"angle",prefixoid:"",id:"angle_"+preid,valor:"angle"},
						{texto:"For MapServer versions <5, this is the attribute/field that stores the angle to be used in rendering. Angle is given in degrees with 0 meaning no rotation.",
						titulo:"angleitem",prefixoid:"",id:"angleitem_"+preid,valor:"angleitem"},  
						{texto:"For MapServer versions <5, this is the attribute/field that stores the size to be used in rendering. Value is given in pixels.",
						titulo:"sizeitem",prefixoid:"",id:"sizeitem_"+preid,valor:"sizeitem"}
					]
				}
				ins += "<br><fieldset style=background-color:#f0e68c ><legend style=color:brown >+- Mais...</legend><div style=display:none >"
				ins += (geraLinhas2(d,param,"salvarEstilo"));
				ins += "</fieldset>"
				ins += "</fieldset>"
				$i(divestilos).innerHTML = ins
			}
		}
		ativaLegenda()
	}
	var p = "../php/temas.php?funcao=pegaEstilos&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	cPaint.call(p,"",retorna);
}

function testarMap()
{
	var codigo = $i("temaAtivo").value
	window.open("../testamapfile.php?map="+codigo+".map")
}
function salvarLayer(layer,parametro,icone)
{
	icone.src="../imagens/aguarde.gif"
	var retorna = function(retorno)
	{icone.src="../imagens/02.png";}
	var valor = $i(parametro+"_"+layer).value
	$i(parametro+"_"+layer).style.color="black"
	var p = "../php/temas.php?funcao=alteraLayer&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function salvarMetadados(layer,parametro,icone)
{
	icone.src="../imagens/aguarde.gif"
	var retorna = function(retorno)
	{icone.src="../imagens/02.png";}
	var valor = $i(parametro+"_"+layer).value
	$i(parametro+"_"+layer).style.color="black"
	var p = "../php/temas.php?funcao=alteraMetadados&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function salvarClasse(layer,parametro,icone)
{
	icone.src="../imagens/aguarde.gif"
	var temp = layer.split("_")
	var layer = temp[0]
	var classe = temp[1]
	var retorna = function(retorno)
	{
		icone.src="../imagens/02.png";
		contaN++
		$i('legenda_'+layer).src='../ogc.php?tema='+layer+'&service=wms&request=getlegendgraphic&layer='+layer+'&format=image/png&'+contaN
	}
	var valor = $i(parametro+"_"+layer+"_"+classe).value
	$i(parametro+"_"+layer+"_"+classe).style.color="black"
	var p = "../php/temas.php?funcao=alteraClasse&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&classe="+classe+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function salvarClasseLabel(layer,parametro,icone)
{
	icone.src="../imagens/aguarde.gif"
	var temp = layer.split("_")
	var layer = temp[0]
	var classe = temp[1]
	var parametro = parametro.split(".");
	var parametro = parametro[1]
	var retorna = function(retorno)
	{icone.src="../imagens/02.png";}
	var valor = $i("label_"+parametro+"_"+layer+"_"+classe).value
	$i("label_"+parametro+"_"+layer+"_"+classe).style.color="black"
	var p = "../php/temas.php?funcao=alteraClasseLabel&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&classe="+classe+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function salvarEstilo(estilo,parametro,icone)
{
	icone.src="../imagens/aguarde.gif"
	var temp = estilo.split("_")
	var layer = temp[1]
	var classe = temp[2]
	var estilo = temp[3]
	var retorna = function(retorno)
	{
		icone.src="../imagens/02.png";
		contaN++
		$i('legenda_'+layer).src='../ogc.php?tema='+layer+'&service=wms&request=getlegendgraphic&layer='+layer+'&format=image/png&'+contaN
	}
	var valor = $i(parametro+"_"+layer+"_"+classe+"_"+estilo).value
	$i(parametro+"_"+layer+"_"+classe+"_"+estilo).style.color="black"
	var p = "../php/temas.php?funcao=alteraEstilo&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&classe="+classe+"&estilo="+estilo+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function adicionarClasse(codigoLayer,botao)
{
	botao.style.color="red"
	var o = botao.value
	botao.value = "Aguarde..."
	var codigoMap = $i("temaAtivo").value
	if(codigoMap != "")
	{
		var retorna = function(retorno)
		{
			pegaClasses(codigoMap,codigoLayer)
		}
		var p = "../php/temas.php?funcao=adicionarClasse&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		cPaint.call(p,"",retorna);		
	}
}
function adicionarEstilo(codigoLayer,codigoClasse,botao)
{
	botao.style.color="red"
	var o = botao.value
	botao.value = "Aguarde..."
	var codigoMap = $i("temaAtivo").value
	if(codigoMap != "")
	{
		var retorna = function(retorno)
		{
			pegaEstilos(codigoMap,codigoLayer)
		}
		var p = "../php/temas.php?funcao=adicionarClasse&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&codigoClasse="+codigoClasse;
		cPaint.call(p,"",retorna);		
	}
}
function excluirClasse(codigoLayer,codigoClasse,botao)
{
	if(confirm("Você realmente quer fazer isso?"))
	{
		botao.style.color="red"
		var o = botao.value
		botao.value = "Aguarde..."
		var codigoMap = $i("temaAtivo").value
		if(codigoMap != "")
		{
			var retorna = function(retorno)
			{
				pegaClasses(codigoMap,codigoLayer)
			}
			var p = "../php/temas.php?funcao=excluirClasse&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&codigoClasse="+codigoClasse;
			cPaint.call(p,"",retorna);		
		}
	}
}
function excluirLayer(codigoLayer,botao)
{
	if(confirm("Você realmente quer fazer isso?"))
	{
		botao.style.color="red"
		var o = botao.value
		botao.value = "Aguarde..."
		var codigoMap = $i("temaAtivo").value
		if(codigoMap != "")
		{
			var retorna = function(retorno)
			{
				ativaTema(codigoMap)
			}
			var p = "../php/temas.php?funcao=excluirLayer&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
			cPaint.call(p,"",retorna);		
		}
	}
}
YAHOO.util.Event.addListener(window, "load", initMenu);