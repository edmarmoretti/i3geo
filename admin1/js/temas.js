
contaN = 0;
objcontype = [
	{texto:"MS_INLINE",valor:"0"},
	{texto:"MS_SHAPEFILE",valor:"1"},
	{texto:"MS_TILED_SHAPEFILE",valor:"2"},
	{texto:"MS_SDE",valor:"3"},
	{texto:"MS_OGR",valor:"4"},
	{texto:"MS_TILED_OGR",valor:"5"},
	{texto:"MS_POSTGIS",valor:"6"},
	{texto:"MS_WMS",valor:"7"},
	{texto:"MS_ORACLESPATIAL",valor:"8"},
	{texto:"MS_WFS",valor:"9"},
	{texto:"MS_GRATICULE",valor:"10"},
	{texto:"MS_MYGIS",valor:"11"},
	{texto:"MS_RASTER",valor:"12"},
	{texto:"MS_PLUGIN",valor:"13"}
];
objbool_tf = [
	{texto:"MS_TRUE",valor:"0"},
	{texto:"MS_FALSE",valor:"1"}
];
objbool_of = [
	{texto:"MS_ON",valor:"2"},
	{texto:"MS_OFF",valor:"3"}
];
objbool_yn = [
	{texto:"MS_YES",valor:"4"},
	{texto:"MS_NO",valor:"5"}
];
objmapunits = [
	{texto:"MS_INCHES",valor:"0"},
	{texto:"MS_FEET",valor:"1"},
	{texto:"MS_MILES",valor:"2"},
	{texto:"MS_METERS",valor:"3"},
	{texto:"MS_KILOMETERS",valor:"4"},
	{texto:"MS_DD",valor:"5"},
	{texto:"MS_PIXELS",valor:"6"}
];
objlayertypes = [
	{texto:"MS_LAYER_POINT",valor:"0"},
	{texto:"MS_LAYER_LINE",valor:"1"},
	{texto:"MS_LAYER_POLYGON",valor:"2"},
	{texto:"MS_LAYER_RASTER",valor:"3"},
	{texto:"MS_LAYER_ANNOTATION",valor:"4"},
	{texto:"MS_LAYER_QUERY",valor:"5"},
	{texto:"MS_LAYER_CIRCLE",valor:"6"},
	{texto:"MS_LAYER_TILEINDEX",valor:"7"},
	{texto:"MS_LAYER_CHART",valor:"8"}
];
objstatus = [
	{texto:"MS_ON",valor:"1"},
	{texto:"MS_OFF",valor:"0"},
	{texto:"MS_DEFAULT",valor:"2"}
];
objfonttypes = [
	{texto:"MS_TRUETYPE",valor:"0"},
	{texto:"MS_BITMAP",valor:"1"}
];
objposition = [
	{texto:"MS_UL",valor:"0"},
	{texto:"MS_LR",valor:"1"},
	{texto:"MS_UR",valor:"2"},
	{texto:"MS_LL",valor:"3"},
	{texto:"MS_CR",valor:"4"},
	{texto:"MS_CL",valor:"5"},
	{texto:"MS_UC",valor:"6"},
	{texto:"MS_WMS",valor:"7"},
	{texto:"MS_LC",valor:"8"},
	{texto:"MS_CC",valor:"9"},
	{texto:"MS_AUTO",valor:"10"},
	{texto:"MS_XY",valor:"11"},
	{texto:"MS_FOLLOW",valor:"12"}
];
objfontstyle = [
	{texto:"MS_TINY",valor:"0"},
	{texto:"MS_SMALL",valor:"1"},
	{texto:"MS_MEDIUM",valor:"2"},
	{texto:"MS_LARGE",valor:"3"},
	{texto:"MS_GIANT",valor:"4"},
];
objshapetype = [
	{texto:"MS_SHAPE_POINT",valor:"0"},
	{texto:"MS_SHAPE_LINE",valor:"1"},
	{texto:"MS_SHAPE_POLYGON",valor:"2"},
	{texto:"MS_SHAPE_NULL",valor:"3"}
];
objshapefiletype = [
	{texto:"MS_SHP_POINT",valor:"0"},
	{texto:"MS_SHP_ARC",valor:"1"},
	{texto:"MS_SHP_POLYGON",valor:"2"},
	{texto:"MS_SHP_MULTIPOINT",valor:"3"}
];
objalignment = [
	{texto:"MS_ALIGN_LEFT",valor:"0"},
	{texto:"MS_ALIGN_CENTER",valor:"1"},
	{texto:"MS_ALIGN_RIGHT",valor:"2"}
];

$i = function(i)
{return document.getElementById(i);};

retorna = function(retorno)
{
	fontes = retorno.data;
};
p = "../php/temas.php?funcao=pegaFontes";
cPaint.call(p,"",retorna);

function iniciaAdmin()
{
	verificaEditores();
}

function montaParametros()
{
	var retorna = function(retorno)
	{
		ins = "<div class='styled-select'><select id=temaAtivo onchange='ativaTema(this.value)'>";
		ins += comboObjeto(retorno.data,"codigo_tema","nome_tema","");
		ins += "</select></div>";
		$i("arquivoAtivo").innerHTML = ins;
	};
	var p = "../php/menutemas.php?funcao=pegaTemas";
	cPaint.call(p,"",retorna);
}
function adicionarLayer()
{
	var codigoMap = $i("temaAtivo").value;
	if(codigoMap != "")
	{
		var retorna = function(retorno)
		{
			ativaTema(codigoMap);
		};
		var p = "../php/temas.php?funcao=criarNovoLayer&codigoMap="+codigoMap;
		cPaint.call(p,"",retorna);
	}
}
function criarNovoMap()
{
	var nome = $i("nomeNovoMap").value;
	var codigo = $i("codigoNovoMap").value;
	if(nome != "" && codigo != "")
	{
		var retorna = function(retorno)
		{
			$i("nomeNovoMap").value = "";
			$i("codigoNovoMap").value = "";
			$i("forms").style.display="none";
			montaParametros();
		};
		var p = "../php/temas.php?funcao=criarNovoMap&nome="+nome+"&codigo="+codigo;
		cPaint.call(p,"",retorna);
	}
}
function ativaTema(codigoMap)
{
	var retorna = function(retorno)
	{
		var cl = retorno.data.layers;
		var ins = "";
		for(var c=0;c<cl.length;c++)
		{
			ins += "<br><fieldset><legend>+- "+cl[c]+"</legend><div >";
			ins += "<div id='geral_"+cl[c]+"_"+codigoMap+"'  >";
			ins += "</div>";
			ins += "<div id='metadados_"+cl[c]+"_"+codigoMap+"'  >";
			ins += "</div>";
			ins += "<div id='classes_"+cl[c]+"_"+codigoMap+"'  >";
			ins += "</div>";

			ins += "</div></fieldset>";
		}
		$i("forms").innerHTML = ins;
		ins = "";
		for(var c=0;c<cl.length;c++)
		{
			pegaCaracteristicasGerais(codigoMap,cl[c]);
			pegaMetadados(codigoMap,cl[c]);
			pegaClasses(codigoMap,cl[c]);
		}
	};
	$i("forms").style.display="block";
	var p = "../php/temas.php?funcao=pegaLayers&codigoMap="+codigoMap;
	cPaint.call(p,"",retorna);
}
function pegaClasses(codigoMap,codigoLayer)
{
	var ins = "<br><fieldset style='background-color:beige'><legend>+- Classes</legend><div style=display:none >";
	ins += "<p><input onclick=adicionarClasse('"+codigoLayer+"',this) type=button value='Adicionar classe' /></p>";
	ins += "<br><fieldset><legend>+- Legenda (amostra)</legend><div style=display:none >";
	ins += "<img id='legenda_"+codigoLayer+"' src='../ogc.php?tema=bioma&service=wms&request=getlegendgraphic&layer="+codigoLayer+"&format=image/png' />";
	ins += "</div></fieldset>";
	var retorna = function(retorna)
	{
		var nc = retorna.data.length;
		for(var c=0;c<nc;c++)
		{
			var d = retorna.data[c];
			var param = {
				"linhas":[
					{texto:"Nome da classe para ser mostrada na legenda",
					titulo:"name",prefixoid:"name_",id:codigoLayer+"_"+d.id,valor:"name"}
				]
			};

			ins += "<br><fieldset><legend>+- "+d.id+"</legend><div style=display:none >";
			ins += "<p><input onclick=excluirClasse('"+codigoLayer+"','"+d.id+"',this) type=button value='Excluir classe' /></p>";
			ins += "<br><fieldset><legend>+- status</legend><div style=display:none >";
			ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Sets the current display status of the class. Default turns the class on.</p>";
			ins += "<div class='styled-select'><select onchange='this.style.color=\"blue\"' id='status_"+codigoLayer+"_"+d.id+"' >";
			ins += comboObjeto(objstatus,"valor","texto",d.dados.status);
			ins += "</select></p>";
			ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarClasse(\""+codigoLayer+"_"+d.id+"\",\"status\",this)'/>";
			ins += "</p></div></fieldset>";

			ins += "<br><fieldset><legend>+- expression</legend><div style=display:none >";
			ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Four types of expressions are now supported to define class membership. String comparisons, regular expressions, simple logical expressions, and string functions. If no expression is given, then all features are said to belong to this class.<br>String comparisons are case sensitive and are the fastest to evaluate. No special delimiters are necessary although string must be quoted if they contain special characters. (As a matter of good habit, it is recommended you quote all strings).<br>Regular expressions function just like previous versions of MapServer. However, you must now delimit a regular expression using /regex/. No quotes should be used.<br><br>Logical expressions allow you to build fairly complex tests based on one or more attributes and therefore are only available with shapefiles. Logical expressions are delimited by parentheses '(expression)'. Attribute names are delimited by square brackets '[ATTRIBUTE]'. These names are case sensitive and must match the items in the shapefile. For example: EXPRESSION ([POPULATION] > 50000 AND '[LANGUAGE]' eq 'FRENCH') ... The following logical operators are supported: =,>,<,<=,>=,=,or,and,lt,gt,ge,le,eq,ne. As you might expect this level of complexity is slower to process.<br>One string function exists: length(). This obviously computes the length of a string. An example follows:<br>EXPRESSION (length('[NAME_E]') < 8)<br>String comparisons and regular expressions work from the classitem defined at the layer level. You may mix expression types within the different classes of a layer.</p>";
			ins += "<p><input type=text onchange='this.style.color=\"blue\"' id='expression_"+codigoLayer+"_"+d.id+"' value=\""+d.dados.expression+"\" />";
			ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarClasse(\""+codigoLayer+"_"+d.id+"\",\"expression\",this)'/>";
			ins += "</p></div></fieldset>";

			ins += (geraLinhas2(d.dados,param,"salvarClasse"));

			var param = {
				"linhas":[
					{texto:"Full filename of the legend image for the CLASS. This image is used when building a legend (or requesting a legend icon via MapScript or the CGI application).",
					titulo:"keyimage",prefixoid:"keyimage_",id:codigoLayer+"_"+d.id,valor:"keyimage"},
					{texto:"Maximum scale at which this CLASS is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.",
					titulo:"maxscale",prefixoid:"maxscale_",id:codigoLayer+"_"+d.id,valor:"maxscale"},
					{texto:"Minimum scale at which this CLASS is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.",
					titulo:"minscale",prefixoid:"minscale_",id:codigoLayer+"_"+d.id,valor:"minscale"},
					{texto:"Maximum size in pixels to draw a symbol. Default is 50.",
					titulo:"maxsize",prefixoid:"maxsize_",id:codigoLayer+"_"+d.id,valor:"maxsize"},
					{texto:"Minimum size in pixels to draw a symbol. Default is 0.",
					titulo:"minsize",prefixoid:"minsize_",id:codigoLayer+"_"+d.id,valor:"minsize"},
					{texto:"Height, in pixels, of the symbol/pattern to be used. Only useful with scalable symbols. For vector (and ellipse) symbol types the default size is based on the range of Y values in the POINTS defining the symbol. For pixmaps, the default is the vertical size of the image. Default size is 1 for TTF symbols.",
					titulo:"size",prefixoid:"size_",id:codigoLayer+"_"+d.id,valor:"size"},
					{texto:"Static text to label features in this class with. This overrides values obtained from the LABELTIEM. The string may be given as an expression delimited using the ()'s. This allows you to concatenate multiple attributes into a single label. For example: ([FIRSTNAME],[LASTNAME]).",
					titulo:"text",prefixoid:"text_",id:codigoLayer+"_"+d.id,valor:"text"}
				]
			};

			ins += "<br><fieldset style=background-color:#f0e68c ><legend style=color:brown >+- Mais...</legend><div style=display:none >";
			ins += (geraLinhas2(d.dados,param,"salvarClasse"));
			ins += "</fieldset>";
			//labels
			ins += "<br><fieldset><legend style=color:brown >+- Label (para ativar, defina LABELITEM em caract. gerais)</legend><div style=display:none >";
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
			};

			ins += "<br><fieldset><legend>+- font</legend><div style=display:none >";
			ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Font alias (as defined in the FONTSET) to use for labeling.</p>";
			ins += "<div class='styled-select'><select onchange='this.style.color=\"blue\"' id='label_font_"+codigoLayer+"_"+d.id+"' >";
			ins += combolista(fontes,d.dados.label.font);
			ins += "</select></div>";
			ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarClasseLabel(\""+codigoLayer+"_"+d.id+"\",\".font\",this)'/>";
			ins += "</p></div></fieldset>";

			ins += "<br><fieldset><legend>+- type</legend><div style=display:none >";
			ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Type of font to use. Generally bitmap fonts are faster to draw then TrueType fonts. However,TrueType fonts are scalable and available in a variety of faces. Be sure to set the FONT parameter ifyou select TrueType.</p>";
			ins += "<div class='styled-select'><select onchange='this.style.color=\"blue\"' id='label_type_"+codigoLayer+"_"+d.id+"' >";
			ins += comboObjeto(objfonttypes,"valor","texto",d.dados.label.type);
			ins += "</select></div>";
			ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarClasseLabel(\""+codigoLayer+"_"+d.id+"\",\".type\",this)'/>";
			ins += "</p></div></fieldset>";

			ins += "<br><fieldset><legend>+- partials</legend><div style=display:none >";
			ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Can text run off the edge of the map? Default is true.</p>";
			ins += "<div class='styled-select'><select onchange='this.style.color=\"blue\"' id='label_type_"+codigoLayer+"_"+d.id+"' >";
			ins += comboObjeto(objbool_tf,"valor","texto",d.dados.label.partials);
			ins += "</select></div>";
			ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarClasseLabel(\""+codigoLayer+"_"+d.id+"\",\".partials\",this)'/>";
			ins += "</p></div></fieldset>";

			ins += "<br><fieldset><legend>+- force</legend><div style=display:none >";
			ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Forces labels for a particular class on, regardless of collisions. Available only for cached labels. Default is false.</p>";
			ins += "<div class='styled-select'><select onchange='this.style.color=\"blue\"' id='label_type_"+codigoLayer+"_"+d.id+"' >";
			ins += comboObjeto(objbool_tf,"valor","texto",d.dados.label.force);
			ins += "</select></div>";
			ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarClasseLabel(\""+codigoLayer+"_"+d.id+"\",\".force\",this)'/>";
			ins += "</p></div></fieldset>";

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
			};
			ins += "<br><fieldset style=background-color:#f0e68c ><legend style=color:brown >+- Mais...</legend><div style=display:none >";
			ins += (geraLinhas2(d.dados,param,"salvarClasseLabel"));
			ins += "</fieldset>";

			ins += "</div></fieldset>";

			ins += "<br><fieldset><legend style=color:brown >+- Estilos</legend><div style=display:none >";
			ins += "<p><input onclick=adicionarEstilo('"+codigoLayer+"','"+d.id+"',this) type=button value='Adicionar estilo' /></p>";
			ins += "<div id='estilos_"+codigoLayer+"_"+d.id+"' ></div>";
			ins += "</div></fieldset>";
			ins += "</div></fieldset>";
		}
		ins += "</div></fieldset>";
		$i("classes_"+codigoLayer+"_"+codigoMap).innerHTML = ins;
		pegaEstilos(codigoMap,codigoLayer);
	};
	var p = "../php/temas.php?funcao=pegaClasses&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	cPaint.call(p,"",retorna);

}
function pegaEstilos(codigoMap,codigoLayer)
{
	var retorna = function(retorno)
	{
		var nc = retorno.data.length;
		for(var c=0;c<nc;c++)
		{
			var idclasse = retorno.data[c].classe;
			var divestilos = "estilos_"+codigoLayer+"_"+idclasse;
			var nes = retorno.data[c].estilos.length;
			for(var est=0;est<nes;est++)
			{
				var ins = "";
				var d = retorno.data[c].estilos[est].dados;
				var preid = codigoLayer+"_"+idclasse+"_"+est;
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
				};
				ins += "<br><fieldset style='background-color:rgb(240,240,240)'><legend>+- "+est+"</legend>";
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
				};
				ins += "<br><fieldset style=background-color:#f0e68c ><legend style=color:brown >+- Mais...</legend><div style=display:none >";
				ins += (geraLinhas2(d,param,"salvarEstilo"));
				ins += "</fieldset>";
				ins += "</fieldset>";
				$i(divestilos).innerHTML = ins;
			}
		}
		ativaLegenda();
	};
	var p = "../php/temas.php?funcao=pegaEstilos&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	cPaint.call(p,"",retorna);
}
function pegaMetadados(codigoMap,codigoLayer)
{
	var ins = "<br><fieldset><legend>+- Metadados</legend><div style=display:none >";
	var retorna = function(retorna)
	{
		ins += "";
		var param = {
			"linhas":[
				{texto:"Nome que ser&aacute; utilizado na legenda do mapa e na guia 'Temas'",
				titulo:"tema",prefixoid:"tema_",id:codigoLayer,valor:"tema"},
				{texto:"Denominador da escala da fonte dos dados utilizado pelo tema. &Eacute; utilizado para apresentar a indica&ccedil;&atilde;o de compatibilidade entre a escala do tema e a escala do mapa que est&aacute; sendo visto.",
				titulo:"escala",prefixoid:"escala_",id:codigoLayer,valor:"escala"},
				{texto:"Extens&atilde;o geogr&aacute;fica m&aacute;xima do tema, no formato xmin ymin xmax ymax. &Eacute; utilizado na op&ccedil;&atilde;o de 'zoom para o tema'. Quando o tema &eacute; baseado em shapefile, esse metadata n&atilde;o &eacute; necess&aacute;rio, pois o mapserver consegue calcular a extens&atilde;o. J&aacute; em outros tipos de dados, como Postgis, o par&acirc;metro &eacute; necess&aacute;rio. Nesse caso, se n&atilde;o for indicado, o bot&atilde;o de zoom para o tema n&atilde;o ser&aacute; vis&iacute;vel para o usu&aacute;rio",
				titulo:"extensao",prefixoid:"extensao_",id:codigoLayer,valor:"extensao"}
			]
		};
		ins += (geraLinhas2(retorna.data,param,"salvarMetadados"));

		ins += "<br><fieldset><legend>+- aplicaextensao</legend><div style=display:none >";
		ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Indica se a extens&atilde;o geogr&aacute;fica do mapa deve ser alterada quando o tema for adicionado ao mapa</p>";
		ins += "<div class='styled-select150'><select onchange='this.style.color=\"blue\"' id='aplicaextensao_"+codigoLayer+"' >";
		ins += combosimnao(retorna.data.aplicaextensao);
		ins += "</select></div>";
		ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarMetadados(\""+codigoLayer+"\",\"aplicaextensao\",this)'/>";
		ins += "</p></div></fieldset>";


		ins += "<br><fieldset><legend>+- download</legend><div style=display:none >";
		ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Indica se o usu&aacute;rio pode fazer download do tema</p>";
		ins += "<div class='styled-select150'><select onchange='this.style.color=\"blue\"' id='download_"+codigoLayer+"' >";
		ins += combosimnao(retorna.data.download);
		ins += "</select></div>";
		ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarMetadados(\""+codigoLayer+"\",\"download\",this)'/>";
		ins += "</p></div></fieldset>";

		var param = {
			"linhas":[
				{texto:"Nomes das colunas da tabela de atributos do tema, que ser&atilde;o mostradas na ferramenta de identifica&ccedil;&atilde;o. Se for vazio, todas as colunas ser&atilde;o mostradas. A lista de itens deve ser separada por ',' e grafada em caixa alta no caso de shapefile.",
				titulo:"itens",prefixoid:"itens_",id:codigoLayer,valor:"itens"},
				{texto:"Lista com os 'alias', ou apelidos, para os nomes das colunas listados no metadata 'itens'. Os alias devem ser separados por ',' e seguir a ordem definida em ITENS.",
				titulo:"itensdesc",prefixoid:"itensdesc_",id:codigoLayer,valor:"itensdesc"},
				{texto:"Lista de links que ser&atilde;o inclu&iacute;dos em cada resultado de busca da ferramenta de identifica&ccedil;&atilde;o. A lista de links deve ser separada por ',', podendo-se incluir '' para indicar que o item n&atilde;o tem link. Exemplo de uso para inclus&atilde;o de links para o site do IBGE quando um munic&iacute;pio &eacute; clicado no mapa:<br>ITENS 'codigo,nome2,uf'<br>ITENSDESC 'codigo do IBGE,nome do munic&iacute;pio,uf'<br>ITENSLLINK ',http://www.ibge.gov.br/munic2001/tabelas.php?codmun=[codigo]&descricao=[nome],'",
				titulo:"itenslink",prefixoid:"itenslink_",id:codigoLayer,valor:"itenslink"},
				{texto:"Lista de colunas que ser&atilde;o utilizadas na op&ccedil;&atilde;o de inclus&atilde;o de 'etiquetas'. As etiquetas s&atilde;o mostradas no mapa quando o usu&aacute;rio estaciona o mouse por alguns instantes sobre o mapa. Separe a lista com ','.",
				titulo:"tip",prefixoid:"tip_",id:codigoLayer,valor:"tip"},
				{texto:"Mensagem que ser&aacute; mostrada no rodap&eacute; do mapa quando o tema estiver vis&iacute;vel. &Eacute; &uacute;til para apresentar ao usu&aacute;rio observa&ccedil;&otilde;es especiais sobre o uso daquele tema.",
				titulo:"mensagem",prefixoid:"mensagem_",id:codigoLayer,valor:"mensagem"},
				{texto:"&Eacute; poss&iacute;vel a gera&ccedil;&atilde;o de classes automaticamente por meio da defini&ccedil;&atilde;o de colunas na tabela de atributos do tema que armazenam as informa&ccedil;&otilde;es sobre cor, tamanho, etc. Esse metadata &eacute; utilizado para definir qual a coluna da tabela que identifica unicamente cada classe. Para cada valor ser&aacute; criada uma classe.<br>O tema que utiliza a gera&ccedil;&atilde;o de classes de forma autom&aacute;tica, deve ter definido apenas uma classe. Essa classe ser&aacute; utilizada como padr&atilde;o para gera&ccedil;&atilde;o das demais.",
				titulo:"classesitem",prefixoid:"classesitem_",id:codigoLayer,valor:"classesitem"},
				{texto:"Nome da coluna que ser&aacute; utilizada para compor o nome das classes geradas automaticamente.",
				titulo:"classesnome",prefixoid:"classesnome_",id:codigoLayer,valor:"classesnome"},
				{texto:"Nome da coluna que definir&aacute; a cor do s&iacute;mbolo utilizado em cada classe. As cores devem ser definidas em RGB.",
				titulo:"classescor",prefixoid:"classescor_",id:codigoLayer,valor:"classescor"},
				{texto:"Nome da coluna que definir&aacute; o s&iacute;mbolo utilizado em cada classe.",
				titulo:"classessimbolo",prefixoid:"classessimbolo_",id:codigoLayer,valor:"classessimbolo"},
				{texto:"Nome da coluna que definir&aacute; o tamanho de cada s&iacute;mbolo.",
				titulo:"classestamanho",prefixoid:"classestamanho_",id:codigoLayer,valor:"classestamanho"}
			]
		};


		ins += "<br><fieldset style=background-color:#f0e68c ><legend style=color:brown >+- Mais...</legend><div style=display:none >";

		ins += (geraLinhas2(retorna.data,param,"salvarMetadados"));

		ins += "<br><fieldset><legend>+- classe</legend><div style=display:none >";
		ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Indica se as classes ser&atilde;o mostradas ou n&atilde;o na legenda. Por padr&atilde;o &eacute; SIM.</p>";
		ins += "<div class='styled-select150'><select onchange='this.style.color=\"blue\"' id='classe_"+codigoLayer+"' >";
		ins += combosimnao(retorna.data.classe);
		ins += "</select></div>";
		ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarMetadados(\""+codigoLayer+"\",\"classe\",this)'/>";
		ins += "</p></div></fieldset>";

		ins += "<br><fieldset><legend>+- escondido</legend><div style=display:none >";
		ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Indica se o tema &eacute; mostrado no mapa mas n&atilde;o nas listas da legenda e na guia 'temas'</p>"	;
		ins += "<div class='styled-select150'><select onchange='this.style.color=\"blue\"' id='escondido_"+codigoLayer+"' >";
		ins += combosimnao(retorna.data.escondido);
		ins += "</select></div>";
		ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarMetadados(\""+codigoLayer+"\",\"escondido\",this)'/>";
		ins += "</p></div></fieldset>";

		ins += "<br><fieldset><legend>+- identifica</legend><div style=display:none >";
		ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);'>Indica se o tema ir&aacute; ser mostrado na ferramenta de identifica&ccedil;&atilde;o</p>";
		ins += "<div class='styled-select150'><select onchange='this.style.color=\"blue\"' id='identifica_"+codigoLayer+"' >";
		ins += combosimnao(retorna.data.identifica);
		ins += "</select></div>";
		ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarMetadados(\""+codigoLayer+"\",\"identifica\",this)'/>";
		ins += "</p></div></fieldset>";

		ins += "</div></fieldset>";

		$i("metadados_"+codigoLayer+"_"+codigoMap).innerHTML = ins;
	};
	var p = "../php/temas.php?funcao=pegaMetadados&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	cPaint.call(p,"",retorna);
}
function pegaCaracteristicasGerais(codigoMap,codigoLayer)
{
	var ins = "<p><input onclick=excluirLayer('"+codigoLayer+"',this) type=button value='Excluir este layer' /></p>";
	ins += "<br><fieldset><legend>+- Caracter&iacute;sticas gerais</legend><div style=display:none >";
	var retorna = function(retorna)
	{
		var param = {
			"linhas":[
			{texto:"Layer name",
			titulo:"name",prefixoid:"name_",id:codigoLayer,valor:"name"},
			{texto:"Database connection string to retrieve remote data.An SDE connection string consists of a hostname, instance name, database name, username and password separated by commas.A PostGIS connection string is basically a regular PostgreSQL connection string, it takes the form of 'user=nobody password=****** dbname=dbname host=localhost port=5432' An Oracle connection string: user/pass[@db]",
			titulo:"connection",prefixoid:"connection_",id:codigoLayer,valor:"connection"},
			{texto:"Full filename of the spatial data to process. No file extension is necessary for shapefiles. Can be specified relative to the SHAPEPATH option from the Map Object.If this is an SDE layer, the parameter should include the name of the layer as well as the geometry column, i.e. 'mylayer,shape,myversion'.If this is a PostGIS layer, the parameter should be in the form of '<columnname> from <tablename>', where 'columnname' is the name of the column containing the geometry objects and 'tablename' is the name of the table from which the geometry data will be read.For Oracle, use 'shape FROM table' or 'shape FROM (SELECT statement)' or even more complex Oracle compliant queries! Note that there are important performance impacts when using spatial subqueries however. Try using MapServer's FILTER whenever possible instead. You can also see the SQL submitted by forcing an error, for instance by submitting a DATA parameter you know won't work, using for example a bad column name.",
			titulo:"data",prefixoid:"data_",id:codigoLayer,valor:"data"}
			]
		};
		ins += "<p>Colunas: "+retorna.data.colunas+"</p>";
		ins += "<br><fieldset><legend>+- status</legend><div style=display:none >";
		ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);' >Sets the current status of the layer. Often modified by MapServer itself. Default turns the layer on permanently.</b></p>";
		ins += "<div class='styled-select'><select onchange='this.style.color=\"blue\"' id='status_"+codigoLayer+"' >";
		ins += comboObjeto(objstatus,"valor","texto",retorna.data.status);
		ins += "</select></div>";
		ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarLayer(\""+codigoLayer+"\",\"status\",this)'/>";
		ins += "</p></fieldset>";

		ins += "<br><fieldset><legend>+- type</legend><div style=display:none >";
		ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);' >Specifies how the data should be drawn. Need not be the same as the shapefile type. For example, a polygon shapefile may be drawn as a point layer, but a point shapefile may not be drawn as a polygon layer. Common sense rules. Annotation means that a label point will be calculated for the features, but the feature itself will not be drawn although a marker symbol can be optionally drawn. this allows for advanced labeling like numbered highway shields. Points are labeled at that point. Polygons are labeled first using a centroid, and if that doesn't fall in the polygon a scanline approach is used to guarantee the label falls within the feature. Lines are labeled at the middle of the longest arc in the visible portion of the line. Query only means the layer can be queried but not drawn.In order to differentiate between POLYGONs and POLYLINEs (which do not exist as a type), simply respectively use or ommit the COLOR keyword when classifying. If you use it, it's a polygon with a fill color, otherwise it's a polyline with only an OUTLINECOLOR.For CHART layers, see the Dynamic Charting howto.A circle must be defined by a a minimum bounding rectangle. That is, 2 points that define the smallest square that can contain it. These 2 points are the two opposite corners of said box.</b></p>";
		ins += "<div class='styled-select'><select onchange='this.style.color=\"blue\"' id='type_"+codigoLayer+"' >";
		ins += comboObjeto(objlayertypes,"valor","texto",retorna.data.type);
		ins += "</select></div>";
		ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarLayer(\""+codigoLayer+"\",\"type\",this)'/>";
		ins += "</p></fieldset>";

		ins += "<br><fieldset><legend>+- connectiontype</legend><div style=display:none >";
		ins += "<p class=textoAjuda  style='background-color:rgb(250,250,250);' >Tipo de conex&atilde;o. Padr&atilde;o &eacute; local.</b></p>";
		ins += "<div class='styled-select'><select onchange='this.style.color=\"blue\"' id='connectiontype_"+codigoLayer+"' >";
		ins += comboObjeto(objcontype,"valor","texto",retorna.data.connectiontype);
		ins += "</select></div>";
		ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarLayer(\""+codigoLayer+"\",\"connectiontype\",this)'/>";
		ins += "</p></div></fieldset>";

		ins += (geraLinhas2(retorna.data,param,"salvarLayer"));


		var param = {
			"linhas":[
			{texto:"Name of a group that this layer belongs to. The group name can then be reference as a regular layer name in the template files, allowing to do things like turning on and off a group of layers at once.",
			titulo:"group",prefixoid:"group_",id:codigoLayer,valor:"group"},
			{texto:"Item that contains the location of an individual tile, default is 'location'.",
			titulo:"tileitem",prefixoid:"tileitem_",id:codigoLayer,valor:"tileitem"},
			{texto:"Name of the tileindex file or layer. A tileindex is similar to an ArcInfo library index. The tileindex contains polygon features for each tile. The item that contains the location of the tiled data is given using the TILEITEM parameter. When a file is used as the tileindex for shapefile or raster layers, the tileindex should be a shapefile. For CONNECTIONTYPE OGR layers, any OGR supported datasource can be a tileindex. Normally the location should contain the path to the tile file relative to the shapepath, not relative to the tileindex itself. If the DATA parameter contains a value then it is added to the end of the location. When a tileindex layer is used, it works similarly to directly referring to a file, but any supported feature source can be used (ie. postgres, oracle).NOTE: All files in the tileindex should have the same coordinate system, and for vector files the same set of attributes in the same order.",
			titulo:"tileindex",prefixoid:"tileindex_",id:codigoLayer,valor:"tileindex"},
			{texto:"Maximum scale at which this LAYER is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.",
			titulo:"maxscale",prefixoid:"maxscale_",id:codigoLayer,valor:"maxscale"},
			{texto:"Minimum scale at which this LAYER is drawn. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.",
			titulo:"minscale",prefixoid:"minscale_",id:codigoLayer,valor:"minscale"},
			{texto:"Sets the color index to treat as transparent for raster layers.",
			titulo:"offsite (R,G,B)",prefixoid:"offsite_",id:codigoLayer,valor:"offsite"},
			{texto:"Sets the opacity level (or the inability to see through the layer) of all classed pixels for a given layer. The value can either be an integer in the range (0-100) or the named symbol 'ALPHA'. A value of 100 is opaque and 0 is fully transparent. Implemented in MapServer 5.0, to replace the deprecated TRANSPARENCY parameter.The 'ALPHA' symbol directs the MapServer rendering code to honor the indexed or alpha transparency of pixmap symbols used to style a layer. This is only needed in the case of RGB output formats, and should be used only when necessary as it is expensive to render transparent pixmap symbols onto an RGB map image.",
			titulo:"opacity",prefixoid:"opacity_",id:codigoLayer,valor:"opacity"},
			{texto:"This parameter allows for data specific attribute filtering that is done at the same time spatial filtering is done, but before any CLASS expressions are evaluated. For OGR and shapefiles the string is simply a mapserver regular expression. For spatial databases the string is a SQL WHERE clause that is valid with respect to the underlying database.For example: FILTER type='road' and size <2",
			titulo:"filter",prefixoid:"filter_",id:codigoLayer,valor:"filter"},
			{texto:"Item to use with simple FILTER expressions. OGR and shapefiles only.",
			titulo:"filteritem",prefixoid:"filteritem_",id:codigoLayer,valor:"filteritem"},
			{texto:"Item name in attribute table to use for class annotation angles. Values should be in degrees.",
			titulo:"labelangleitem",prefixoid:"labelangleitem_",id:codigoLayer,valor:"labelangleitem"},
			{texto:"Item name in attribute table to use for class annotation (i.e. labeling).",
			titulo:"labelitem",prefixoid:"labelitem_",id:codigoLayer,valor:"labelitem"},
			{texto:"Maximum scale at which this LAYER is labeled. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.",
			titulo:"labelmaxscale",prefixoid:"labelmaxscale_",id:codigoLayer,valor:"labelmaxscale"},
			{texto:"Minimum scale at which this LAYER is labeled. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.",
			titulo:"labelminscale",prefixoid:"labelminscale_",id:codigoLayer,valor:"labelminscale"},
			{texto:"Item name in attribute table to use for class annotation sizes. Values should be in pixels.",
			titulo:"labelsizeitem",prefixoid:"labelsizeitem_",id:codigoLayer,valor:"labelsizeitem"},
			{texto:"The scale at which symbols and/or text appear full size. This allows for dynamic scaling of objects based on the scale of the map. If not set then this layer will always appear at the same size. Scaling only takes place within the limits of MINSIZE and MAXSIZE as described above. Scale is given as the denominator of the actual scale fraction, for example for a map at a scale of 1:24,000 use 24000.",
			titulo:"symbolscale",prefixoid:"symbolscale_",id:codigoLayer,valor:"symbolscale"},
			{texto:"Sensitivity for point based queries (i.e. via mouse and/or map coordinates). Given in TOLERANCEUNITS. If the layer is a POINT or a LINE, the default is 3. For all other layer types, the default is 0. To restrict polygon searches so that the point must occur in the polygon set the tolerance to zero.",
			titulo:"tolerance",prefixoid:"tolerance_",id:codigoLayer,valor:"tolerance"},
			{texto:" ",
			titulo:"projection",prefixoid:"projection_",id:codigoLayer,valor:"projection"}
			]
		};


		ins += "<br><fieldset style=background-color:#f0e68c ><legend style=color:brown >+- Mais...</legend><div style=display:none >";
		ins += (geraLinhas2(retorna.data,param,"salvarLayer"));

		ins += "<br><fieldset><legend>+- sizeunits</legend><div style=display:none >";
		ins += "<p class=textoAjuda style='background-color:rgb(250,250,250);' >Sets the unit of CLASS object SIZE values (default is pixels). Useful for simulating buffering.</b><p>";
		ins += "<div class='styled-select'><select onchange='this.style.color=\"blue\"' id='sizeunits_"+codigoLayer+"' >";
		ins += comboObjeto(objmapunits,"valor","texto",retorna.data.sizeunits);
		ins += "</select></div>";
		ins += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='salvarLayer(\""+codigoLayer+"\",\"sizeunits\",this)'/>";
		ins += "</p></div></fieldset>";

		ins += "</div></fieldset>";

		ins += "</div></fieldset>";
		$i("geral_"+codigoLayer+"_"+codigoMap).innerHTML = ins;
	};
	var p = "../php/temas.php?funcao=pegaCaracteristicasGerais&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	cPaint.call(p,"",retorna);
}
function testarMap()
{
	var codigo = $i("temaAtivo").value;
	window.open("../testamapfile.php?map="+codigo+".map");
}
function salvarLayer(layer,parametro,icone)
{
	icone.src="../imagens/aguarde.gif";
	var retorna = function(retorno)
	{icone.src="../imagens/02.png";};
	var valor = $i(parametro+"_"+layer).value;
	$i(parametro+"_"+layer).style.color="black";
	var p = "../php/temas.php?funcao=alteraLayer&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function salvarMetadados(layer,parametro,icone)
{
	icone.src="../imagens/aguarde.gif";
	var retorna = function(retorno)
	{icone.src="../imagens/02.png";};
	var valor = $i(parametro+"_"+layer).value;
	$i(parametro+"_"+layer).style.color="black";
	var p = "../php/temas.php?funcao=alteraMetadados&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function salvarClasse(layer,parametro,icone)
{
	icone.src="../imagens/aguarde.gif";
	var temp = layer.split("_");
	var layer = temp[0];
	var classe = temp[1];
	var retorna = function(retorno)
	{
		icone.src="../imagens/02.png";
		contaN++;
		$i('legenda_'+layer).src='../ogc.php?tema='+layer+'&service=wms&request=getlegendgraphic&layer='+layer+'&format=image/png&'+contaN;
	};
	var valor = $i(parametro+"_"+layer+"_"+classe).value;
	$i(parametro+"_"+layer+"_"+classe).style.color="black";
	var p = "../php/temas.php?funcao=alteraClasse&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&classe="+classe+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function salvarClasseLabel(layer,parametro,icone)
{
	icone.src="../imagens/aguarde.gif";
	var temp = layer.split("_");
	var layer = temp[0];
	var classe = temp[1];
	parametro = parametro.split(".");
	parametro = parametro[1];
	var retorna = function(retorno)
	{icone.src="../imagens/02.png";};
	var valor = $i("label_"+parametro+"_"+layer+"_"+classe).value;
	$i("label_"+parametro+"_"+layer+"_"+classe).style.color="black";
	var p = "../php/temas.php?funcao=alteraClasseLabel&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&classe="+classe+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function salvarEstilo(estilo,parametro,icone)
{
	icone.src="../imagens/aguarde.gif";
	var temp = estilo.split("_");
	var layer = temp[1];
	var classe = temp[2];
	var estilo = temp[3];
	var retorna = function(retorno)
	{
		icone.src="../imagens/02.png";
		contaN++;
		$i('legenda_'+layer).src='../ogc.php?tema='+layer+'&service=wms&request=getlegendgraphic&layer='+layer+'&format=image/png&'+contaN;
	};
	var valor = $i(parametro+"_"+layer+"_"+classe+"_"+estilo).value;
	$i(parametro+"_"+layer+"_"+classe+"_"+estilo).style.color="black";
	var p = "../php/temas.php?funcao=alteraEstilo&codigoMap="+$i("temaAtivo").value+"&codigoLayer="+layer+"&classe="+classe+"&estilo="+estilo+"&parametro="+parametro+"&valor="+valor;
	cPaint.call(p,"",retorna);
}
function adicionarClasse(codigoLayer,botao)
{
	botao.style.color="red";
	botao.value = "Aguarde...";
	var codigoMap = $i("temaAtivo").value;
	if(codigoMap != "")
	{
		var retorna = function(retorno)
		{
			pegaClasses(codigoMap,codigoLayer);
		};
		var p = "../php/temas.php?funcao=adicionarClasse&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
		cPaint.call(p,"",retorna);
	}
}
function adicionarEstilo(codigoLayer,codigoClasse,botao)
{
	botao.style.color="red";
	botao.value = "Aguarde...";
	var codigoMap = $i("temaAtivo").value;
	if(codigoMap != "")
	{
		var retorna = function(retorno)
		{
			pegaEstilos(codigoMap,codigoLayer);
		};
		var p = "../php/temas.php?funcao=adicionarClasse&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&codigoClasse="+codigoClasse;
		cPaint.call(p,"",retorna);
	}
}
function excluirClasse(codigoLayer,codigoClasse,botao)
{
	if(confirm("Voc&ecirc; realmente quer fazer isso?"))
	{
		botao.style.color="red";
		botao.value = "Aguarde...";
		var codigoMap = $i("temaAtivo").value;
		if(codigoMap != "")
		{
			var retorna = function(retorno)
			{
				pegaClasses(codigoMap,codigoLayer);
			};
			var p = "../php/temas.php?funcao=excluirClasse&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&codigoClasse="+codigoClasse;
			cPaint.call(p,"",retorna);
		}
	}
}
function excluirLayer(codigoLayer,botao)
{
	if(confirm("Voc&ecirc; realmente quer fazer isso?"))
	{
		botao.style.color="red";
		botao.value = "Aguarde...";
		var codigoMap = $i("temaAtivo").value;
		if(codigoMap != "")
		{
			var retorna = function(retorno)
			{
				ativaTema(codigoMap);
			};
			var p = "../php/temas.php?funcao=excluirLayer&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
			cPaint.call(p,"",retorna);
		}
	}
}