//
//Utilizado por editormapfile.js
//

/*
Function: editorDados

Abre o editor de conex&atilde;o com a fonte dos dados de um layer

<PEGACONEXAO>
*/
function editorDados(codigoMap,codigoLayer)
{
	core_montaEditor("","500px","650px","","Conex&atilde;o");
	var sUrl = "../php/editormapfile.php?funcao=pegaConexao&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorDados");
}

function montaEditorDados(dados)
{
	var idsForms = ["connection","data","tileitem","tileindex","type","tipooriginal","metaestat_id_medida_variavel"],
		idsMetaestat = ["connection","data","tileitem","tileindex","tipooriginal"],
		limg = i3GEO.configura.locaplic+"/imagens/ic_zoom.png",
		param = {
			"linhas":[
			{ajuda:"Indica se as defini&ccedil;&otilde;es da camada est&atilde;o relacionadas ao sistema de metadados estat&iacute;sticos. Se estiver, alguns par&acirc;metros s&atilde;o obtidos de forma autom&aacute;tica, como a conex&atilde;o e o SQL de acesso aos dados.",
			titulo:"Esse mapfile est&aacute; integrado ao sistema de metadados estat&iacute;sticos?",id:"",value:dados.metaestat,tipo:"text",div:"<div id=cMetaestat ></div>"},
			{ajuda:"ID da medida da vari&aacute;vel que relaciona a camada ao sistema de metadados estat&iacute;sticos. S&oacute; deve ser definido se o mapfile for integrado a esse sistema.",
			titulo:"ID da vari&aacute;vel no sistema de metadados estat&iacute;sticos ",id:"",value:"",tipo:"text",div:"<div id=cMetaestat_id_medida_variavel ></div>"},
			{ajuda:"Tipo de conex&atilde;o. Padr&atilde;o &eacute; local.",
			titulo:"Connectiontype",id:"",value:"",div:"<div id=cConnectiontype ></div>",tipo:"text"},
			{ajuda:"Aplica a convers&atilde;o de caracteres nas ferramentas que obt&eacute;m os dados descritivos referentes aos elementos do LAYER. Em alguns casos, a convers&atilde;o pode provocar problemas de acentua&ccedil;&atilde;o. Se isso ocorrer, na ferramenta tabela por exemplo, experimente marcar essa op&ccedil;&atilde;o como 'nao'",
			titulo:"Convers&atilde;o de caracteres (METADATA: CONVCARACTER)",id:"",value:dados.convcaracter,tipo:"text",div:"<div id=cConvcaracter ></div>"},
			{ajuda:"Voc&ecirc; pode digitar apenas o 'alias' para esconder a string de conex&atilde;o. Database connection string to retrieve remote data.An SDE connection string consists of a hostname, instance name, database name, username and password separated by commas.A PostGIS connection string is basically a regular PostgreSQL connection string, it takes the form of 'user=nobody password=****** dbname=dbname host=localhost port=5432' An Oracle connection string: user/pass[@db] . Se vc tiver problemas com acentua&ccedil;&atilde;o, experimente algo como: user=postgres password=postgres dbname=pgutf8 host=localhost port=5432 options='-c client_encoding=LATIN1'",
			titulo:"Connection ",id:"",value:"",tipo:"text",div:"<div id=cConnection ></div>"},
			{ajuda:"Nome completo do arquivo de dado espacial a ser processado. N&atilde;o &eacute; necess&aacute;ria a extens&atilde;o do arquivo para shapefiles. Exemplo: c://ms4w/Apache/htdocs/geodados/brasil/limitespol/localidades.shp. Pode ser especificado relativo &agrave; op&ccedil;&atilde;o SHAPEPATH do objeto MAP. Se for uma camada SDE, deve ser inclu&iacute;do o nome da camada bem como da coluna de geometria, por exemplo, mylayer,shape,myversion. Se &eacute; uma camada PostGIS, o par&acirc;metro deve seguir a forma <columnname> from <tablename>, na qual columnname &eacute; o nome da coluna que cont&eacute;m a geometria e tablename &eacute; o nome da tabela cuja geometria ser&aacute; lida. Exemplo: the_geom FROM (select * FROM biomas) as foo USING UNIQUE gid USING SRID=4291. Para Oracle, use shape FROM table ou shape FROM (SELECT statement) ou at&eacute; express&otilde;es mais complexas. Note que, no entanto, h&aacute; impactos importantes de performance quando utilizadas subconsultas espaciais. Tente utilizar o objeto FILTER sempre que poss&iacute;vel. Voc&ecirc; tamb&eacute;m pode ver o SQL submetido ao for&ccedil;ar um erro, submetendo um par&acirc;metro DATA que voc&ecirc; sabe que n&atilde;o funcionar&aacute;, como uma nome de coluna errado.",
			titulo:"Data",id:"",value:"",tipo:"textarea",div:"<div id=cData ></div>"},
			{ajuda:"Especifica como o dado deve ser desenhado. N&atilde;o precisa ser do mesmo tipo do shapefile. Por exemplo, um shapefile de pol&iacute;gonos pode ser desenhado como pontos, mas um shape de pontos n&atilde;o pode ser desenhado como um pol&iacute;gono. Para diferenciar entre POLYGON e POLYLINE, simplesmente use ou omita o par&acirc;metro COLOR na classifica&ccedil;&atilde;o. Se voc&ecirc; utiliz&aacute;-lo, &eacute; um pol&iacute;gono com uma cor de preenchimento, sen&atilde;o, &eacute; uma polilinha cuja cor &eacute; definida em OUTLINECOLOR. Um c&iacute;rculo (circle) deve ser definido por um ret&acirc;ngulo de limites m&iacute;nimos. Isto &eacute;, dois pontos que definem o menor quadrado que pode cont&ecirc;-lo.",
			titulo:"Type",id:"",value:dados.type,tipo:"text",div:"<div id=cType ></div>"},
			{ajuda:"Ativa ou n&atilde;o a manuten&ccedil;&atilde;o de um cache para armazenar as imagens geradas para montar o mapa. Essa op&ccedil;&atilde;o afeta apenas as interfaces do i3Geo que utilizam o modo TILE (como a interface OpenLayers). O cache &eacute; mantido no diretório tempor&aacute;rio utilizado pelo i3Geo, na pasta chamada cache. Para cada camada &eacute; criada uma sub-pasta. Para limpar o cache, utilize a op&ccedil;&atilde;o existente junto ao nó principal desse mapfile",
			titulo:"Cache de mapas. Camadas WMS s&atilde;o acessadas diretamente do servidor de origem quando o cache estiver inativo. (CACHE)",id:"",value:dados.cache,tipo:"text",div:"<div id=cCache ></div>"},
			{ajuda:"Ao desenhar a imagem de um TILE que comp&otilde;e o mapa, a imagem &eacute; extendida e depois cortada para o tamanho correto. Isso evita que s&iacute;mbolos apare&ccedil;am de forma parcial no mapa. Indicado para temas com representa&ccedil;&atilde;o pontual e que tamb&eacute;m utilizem cache, pois pode degradar a performance.",
			titulo:"Extende e corta imagem em pixels (cortepixels)",id:"cortepixels",value:dados.cortepixels,tipo:"text"},
			{ajuda:"Proje&ccedil;&atilde;o",
			titulo:"Projection",id:"projection",value:dados.projection,tipo:"text"},
			{ajuda:"Este par&acirc;metro permite filtrar atributos espec&iacute;ficos ao mesmo tempo em que &eacute; feita uma filtragem espacial, mas antes de que qualquer express&atilde;o em CLASS seja contabilizada. Para OGR e shapefiles, a string &eacute; simplesmente uma express&atilde;o regular do MapServer. Por exemplo: FILTER type= road  and size &lt;2. Para bancos de dados espaciais &eacute; uma cl&aacute;usula SQL WHERE que &eacute; v&aacute;lida de acordo com o banco de dados subjacente. ",
			titulo:"Filter",id:"filter",value:dados.filter,tipo:"text"},
			{ajuda:"Item a ser usado com simples express&otilde;es FILTER. Somente para OGR e shapefile.",
			titulo:"Filteritem",id:"filteritem",value:dados.filteritem,tipo:"text"},
			{ajuda:"Item que cont&eacute;m a localiza&ccedil;&atilde;o individual de um tile. Padr&atilde;o &eacute;  location .",
			titulo:"tileitem",id:"tileitem",value:dados.tileitem,tipo:"text"},
			{ajuda:"Nome do arquivo ou camada de tileindex. Um tileindex &eacute; semelhante a uma biblioteca de &iacute;ndices do ArcInfo. O tileindex cont&eacute;m fei&ccedil;&otilde;es de pol&iacute;gono para cada tile (ladrilho). O item que cont&eacute;m a localiza&ccedil;&atilde;o do dado ladrilhado &eacute; obtido utilizando o par&acirc;metro TILEITEM. Quando um arquivo &eacute; utilizado como o tileindex para camadas shapefiles ou raster, o tileindex pode ser um shapefile. Para camadas com CONNECTIONTYPE OGR, qualquer fonte de dados OGR suportada pode ser um tileindex. Normalmente a localiza&ccedil;&atilde;o deve conter o caminho do arquivo de tile relativo ao caminho do shape, e n&atilde;o relativo ao pr&oacute;prio tileindex. Se o par&acirc;metro DATA cont&eacute;m algum valor ent&atilde;o ele &eacute; adicionado ao fim da localiza&ccedil;&atilde;o. Quando uma camada de tileindex &eacute; utilizada, ela funciona de forma similar a referir-se diretamente a um arquivo, sendo que qualquer fonte de fei&ccedil;&atilde;o suportada pode ser usada (como PostgreSQL, Oracle etc.).",
			titulo:"tileindex",id:"tileindex",value:dados.tileindex,tipo:"text"},
			{ajuda:"Tipo de representa&ccedil;&atilde;o das fei&ccedil;&otilde;es mostradas da camada. &Eacute; importante definir esse par&acirc;metro para que as fun&ccedil;&otilde;es de gera&ccedil;&atilde;o de SLD funcionem corretamente.",
			titulo:"Tipo de representa&ccedil;&atilde;o (tipooriginal) - para temas do tipo WMS",id:"",value:dados.tipooriginal,tipo:"text",div:"<div id=cTipoOriginal ></div>"}
			]
		};
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	ins += "&nbsp;<input type=button title='Testar' value='Testar' id=testarEditor />";

	if(dados.colunas != "" && dados.colunas != undefined){
		ins += "<p>O layer possui as seguintes colunas na tabela de atributos: ";
		ins += dados.colunas+"</p><br>";
	}
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	if($i("cConnection")){
		temp = "";
		if(dados.postgis_mapa.length > 0){
			temp += "<p class=paragrafo >Os seguintes 'alias' est&atilde;o definidos em ms_configura como nomes de conex&otilde;es e podem ser utilizados aqui no lugar da string completa: ";
			temp += "<b>"+dados.postgis_mapa+"</b>. Para definir um novo, &eacute; necess&aacute;rio editar o arquivo i3geo/ms_configura.php, consulte o administrador do servidor";
			temp += "</p>";
		}
		temp += '<input type="text" value="'+dados.connection+'" id="connection" style="width:90%;">';
		temp += "<img onclick='selConexaoBanco(\"connection\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cConnection").innerHTML = temp;
	}
	if($i("cData")){
		temp = '<textarea value="'+dados.data+'" id="data" style="width:90%;">'+dados.data+'</textarea>';
		temp += "<img onclick='selNavegador(\"data\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cData").innerHTML = temp;
	}
	if($i("cMetaestat_id_medida_variavel")){
		temp = '<input type="text" value="'+dados.metaestat_id_medida_variavel+'" id="metaestat_id_medida_variavel" style="width:90%;">';
		temp += "<img onclick='selIdMedidaVariavel(\"metaestat_id_medida_variavel\",\"metaestat_id_medida_variavel\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cMetaestat_id_medida_variavel").innerHTML = temp;
	}
	if($i("cMetaestat")){
		temp = "<select id='metaestat' >";
		temp += core_combosimnao(dados.metaestat);
		temp += "</select>";
		//temp += "&nbsp;<input type=button value='Par&acirc;metros' id=parametrosMetaestat />";
		$i("cMetaestat").innerHTML = temp;
		//new YAHOO.widget.Button("parametrosMetaestat",{ onclick: { fn: parametrosMetaestat }});
	}
	if($i("cCache")){
		temp = "<select id='cache' >";
		temp += core_combosimnao(dados.cache);
		temp += "</select>";
		$i("cCache").innerHTML = temp;
	}
	if($i("cTipoOriginal")){
		temp = "<select id='tipooriginal' >";
		temp += core_comboObjeto(objtipooriginal,"valor","texto",dados.tipooriginal);
		temp += "</select>";
		$i("cTipoOriginal").innerHTML = temp;
	}
	temp = "<select id='connectiontype' >";
	temp += core_comboObjeto(objcontype,"valor","texto",dados.connectiontype);
	temp += "</select>";
	$i("cConnectiontype").innerHTML = temp;

	temp = "<select id='type' >";
	temp += core_comboObjeto(objlayertypes,"valor","texto",dados.type);
	temp += "</select>";
	$i("cType").innerHTML = temp;

	if($i("cConvcaracter")){
		temp = "<select id='convcaracter' >";
		temp += core_combosimnao(dados.convcaracter);
		temp += "</select>";
		$i("cConvcaracter").innerHTML = temp;
	}

	var temp = function()
	{salvarDadosEditor('conexao',dados.codigoMap,dados.codigoLayer,false);};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});

	var temp = function()
	{salvarDadosEditor('conexao',dados.codigoMap,dados.codigoLayer,"","",true);};
	new YAHOO.widget.Button("testarEditor",{ onclick: { fn: temp }});

	$i("connectiontype").onchange = function(){
		core_desativaforms(idsForms);
		var valor = $i("connectiontype").value,
			d = [];
		//["connection","data","tileitem","tileindex"]
		if(valor == 0 || valor == 10)
		{d = [];}
		if(valor == 1 || valor == 12)
		{d = ["data","type"];}
		if(valor == 2)
		{d = ["tileitem","tileindex","type"];}
		if(valor == 3 || valor == 4 || valor == 6 || valor == 8 || valor == 13)
		{d = idsForms;}
		if(valor == 5)
		{d = ["connection","tileitem","tileindex","type"];}
		if(valor == 7 || valor == 9)
		{d = ["connection","type","tipooriginal"];}
		core_ativaforms(d);
	};
	$i("metaestat").onchange = function(){
		core_desativaforms(idsMetaestat);
		var valor = $i("metaestat").value,
			d = [];
		if(valor === "SIM"){
			d = ["metaestat_id_medida_variavel"];
		}
		else{
			core_desativaforms(idsForms);
			$i("connectiontype").onchange.call();
		}
		core_ativaforms(d);
	};
	if(dados.metaestat === "SIM"){
		core_desativaforms(idsMetaestat);
	}
	else{
		core_desativaforms(idsForms);
		$i("connectiontype").onchange.call();
	}
}
