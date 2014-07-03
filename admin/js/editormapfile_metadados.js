/*
Function: editorMetadados

Abre o editor de metadados

<PEGAMETADADOS>
*/
function editorMetadados(codigoMap,codigoLayer)
{
	core_montaEditor("","450px","500px","","Metadados");
	var sUrl = "../php/editormapfile.php?funcao=pegaMetadados&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorMetadados");
}
function montaEditorMetadados(dados)
{
	var paramRaster = {
		"linhas":[
			{ajuda:"A palete &eacute; v&aacute;lida apenas para temas RASTER. Entre com o endere&ccedil;o do arquivo no servidor. Veja exemplo em i3geo/localhost/symbols/testepalete.txt",
			titulo:"Arquivo com palete de cores (opcional e serve apenas para temas raster) (PALLETEFILE)",id:"palletefile",value:dados.palletefile,tipo:"text"},
			{ajuda:"Quantas cores em cada n&iacute;vel da palete. Veja exemplo em i3geo/localhost/symbols/testepalete.txt",
			titulo:"Passo (opcional e serve apenas para temas raster) (PALLETESTEP)",id:"palletestep",value:dados.palletestep,tipo:"text"}
		]
	};
	var paramVetor = {
		"linhas":[
			{ajuda:"Indica se o usu&aacute;rio pode abrir o editor de SQL para poder alterar o elemento DATA do Mapfile.",
			titulo:"Permite editar SQL (EDITORSQL)",id:"",value:dados.editorsql,tipo:"text",div:"<div id=cEditorsql ></div>"},
			{ajuda:"Formato das datas existentes na tabela de atributos p.e. iso8601",
			titulo:"Linha do tempo: LTEMPOFORMATODATA",id:"ltempoformatodata",value:dados.ltempoformatodata,tipo:"text"},
			{ajuda:"Item que indica a data de in&iacute;cio de um evento",
			titulo:"Linha do tempo: LTEMPOITEMINICIO",id:"ltempoiteminicio",value:dados.ltempoiteminicio,tipo:"text"},
			{ajuda:"Item que indica a data final de um evento (opcional)",
			titulo:"Linha do tempo: LTEMPOITEMFIM",id:"ltempoitemfim",value:dados.ltempoitemfim,tipo:"text"},
			{ajuda:"Item que cont&eacute;m o t&iacute;tulo de cada evento",
			titulo:"Linha do tempo: LTEMPOITEMTITULO",id:"ltempoitemtitulo",value:dados.ltempoitemtitulo,tipo:"text"},
			{ajuda:"Item com a descri&ccedil;&atilde;o do evento (opcional)",
			titulo:"Linha do tempo: LTEMPOITEMDESCRICAO",id:"ltempoitemdescricao",value:dados.ltempoitemdescricao,tipo:"text"},
			{ajuda:"Item para etiquetas do t&iacute;tulo (opcional)",
			titulo:"Linha do tempo: LTEMPOITEMTIP",id:"ltempoitemtip",value:dados.ltempoitemtip,tipo:"text"},
			{ajuda:"Item com o endere&ccedil;o de uma imagem que ser&aacute; inclu&iacute;da no menu popup, aberto quando o usu&aacute;rio clica em um evento (opcional)",
			titulo:"Linha do tempo: LTEMPOITEMIMAGEM",id:"ltempoitemimagem",value:dados.ltempoitemimagem,tipo:"text"},
			{ajuda:"Link para uma p&aacute;gina que ser&aacute; inclu&iacute;do no menu popup",
			titulo:"Linha do tempo: LTEMPOITEMLINK",id:"ltempoitemlink",value:dados.ltempoitemlink,tipo:"text"},
			{ajuda:"Endere&ccedil;o da imagem do &iacute;cone que ir&aacute; representar o evento (opcional)",
			titulo:"Linha do tempo: LTEMPOITEMICONE",id:"ltempoitemicone",value:dados.ltempoitemicone,tipo:"text"},
			{ajuda:"Aplica convers&atilde;o do código de caracteres? Pode ser necess&aacute;rio para corrigir problemas de acentua&ccedil;&atilde;o",
			titulo:"Linha do tempo: LTEMPOCONVENCODE",id:"",value:dados.ltempoconvencode,tipo:"text",div:"<div id=cLtempoconvencode ></div>"},
		]
	};
	var paramNaoOWS = {
		"linhas":[
			{ajuda:"&Eacute; poss&iacute;vel a gera&ccedil;&atilde;o de classes automaticamente por meio da defini&ccedil;&atilde;o de colunas na tabela de atributos do tema que armazenam as informa&ccedil;&otilde;es sobre cor, tamanho, etc. Esse metadata &eacute; utilizado para definir qual a coluna da tabela que identifica unicamente cada classe. Para cada valor ser&aacute; criada uma classe.<br>O tema que utiliza a gera&ccedil;&atilde;o de classes de forma autom&aacute;tica, deve ter definido apenas uma classe. Essa classe ser&aacute; utilizada como padr&atilde;o para gera&ccedil;&atilde;o das demais.",
			titulo:"Auto-legenda: id das classes (CLASSESITEM)",id:"classesitem",value:dados.classesitem,tipo:"text"},
			{ajuda:"Nome da coluna que ser&aacute; utilizada para compor o nome das classes geradas automaticamente.",
			titulo:"Auto-legenda: nome das classes (CLASSESNOME)",id:"classesnome",value:dados.classesnome,tipo:"text"},
			{ajuda:"Nome da coluna que definir&aacute; a cor do s&iacute;mbolo utilizado em cada classe. As cores devem ser definidas em RGB.",
			titulo:"Auto-legenda: cor da classe (CLASSESCOR)",id:"classescor",value:dados.classescor,tipo:"text"},
			{ajuda:"Nome da coluna que definir&aacute; o s&iacute;mbolo utilizado em cada classe.",
			titulo:"Auto-legenda: s&iacute;mbolo (CLASSESSIMBOLO)",id:"classessimbolo",value:dados.classessimbolo,tipo:"text"},
			{ajuda:"Nome da coluna que definir&aacute; o tamanho de cada s&iacute;mbolo.",
			titulo:"Auto-legenda: tamanho (CLASSESTAMANHO)",id:"classestamanho",value:dados.classestamanho,tipo:"text"}
		]
	};
	var param = {
		"linhas":[
			{ajuda:"Nome da coluna da tabela de atributos do tema que ser&aacute; utilizado na ferramenta busca r&aacute;pida. Entre apenas uma coluna",
			titulo:"Item utilizado no busca r&aacute;pida (itembuscarapida)",id:"itembuscarapida",value:dados.itembuscarapida,tipo:"text"},
			{ajuda:"Nomes das colunas da tabela de atributos do tema, que ser&atilde;o mostradas na ferramenta de identifica&ccedil;&atilde;o. Se for vazio, todas as colunas ser&atilde;o mostradas. A lista de itens deve ser separada por ',' e grafada em caixa alta no caso de shapefile.",
			titulo:"Itens (ITENS)",id:"itens",value:dados.itens,tipo:"text"},
			{ajuda:"Lista com os 'alias', ou apelidos, para os nomes das colunas listados no metadata 'itens'. Os alias devem ser separados por ',' e seguir a ordem definida em ITENS.",
			titulo:"Nomes dos itens (ITENSDESC)",id:"itensdesc",value:dados.itensdesc,tipo:"text"},
			{ajuda:"Lista de links que ser&atilde;o inclu&iacute;dos em cada resultado de busca da ferramenta de identifica&ccedil;&atilde;o. A lista de links deve ser separada por ',', podendo-se incluir '' para indicar que o item n&atilde;o tem link. Exemplo de uso para inclus&atilde;o de links para o site do IBGE quando um munic&iacute;pio &eacute; clicado no mapa:<br>ITENS 'codigo,nome2,uf'<br>ITENSDESC 'codigo do IBGE,nome do munic&iacute;pio,uf'<br>ITENSLLINK ',http://www.ibge.gov.br/munic2001/tabelas.php?codmun=[codigo]&descricao=[nome],'<br>Podem ser inclu&iacute;dos comandos javascript, para isso utilize sempre aspas simples para fechar o link e acrescente o código javascript, exemplo:<br>ITENSLINK \",'../ferramentas/identifica/testelink.php?sid='+i3GEO.configura.sid\"",
			titulo:"Links dos itens (ITENSLINK)",id:"itenslink",value:dados.itenslink,tipo:"text"},
			{ajuda:"Template utilizado no gerador de KML para definir o conte&uacute;do dos bal&otilde;es de informa&ccedil;&atilde;o. O template utiliza o caractere '%' para iniciar e fechar o nome de uma coluna. O template pode usar tamb&eacute;m elementos HTML, por exemplo: <code>'<b>Nome do municipio</b>: %NOMEMUN%'</code>. Se o template n&atilde;o for especificado, o i3Geo ir&aacute; utilizar o metadata ITENS e ITENSDESC. Se esses n&atilde;o forem especificados, ser&aacute; utilizado o nome original da coluna.",
			titulo:"KML template (DESCRIPTION_TEMPLATE)",id:"description_template",value:dados.description_template,tipo:"text"},
			{ajuda:"Lista de colunas que ser&atilde;o utilizadas na op&ccedil;&atilde;o de inclus&atilde;o de 'etiquetas'. As etiquetas s&atilde;o mostradas no mapa quando o usu&aacute;rio estaciona o mouse por alguns instantes sobre o mapa. Separe a lista com ','.",
			titulo:"Etiqueta (TIP)",id:"tip",value:dados.tip,tipo:"text"}
		]
	};

	var paramOWS = {
		"linhas":[
			{ajuda:"space-delimited list of EPSG projection codes supported by the remote server. You normally get this from the servers capabilities output. This value should be upper case (EPSG:4236.....not epsg:4236) to avoid problems with case sensitive platforms. The value is used to set the SRS WMS URL parameter",
			titulo:"wms_srs",id:"wms_srs",value:dados.wms_srs,tipo:"text"},
			{ajuda:"comma-separated list of layers to be fetched from the remote WMS server. This value is used to set the LAYERS and QUERY_LAYERS WMS URL parameters.",
			titulo:"wms_name",id:"wms_name",value:dados.wms_name,tipo:"text"},
			{ajuda:"the version of the WMS protocol supported by the remote WMS server and that will be used for issuing GetMap requests",
			titulo:"wms_server_version",id:"wms_server_version",value:dados.wms_server_version,tipo:"text"},
			{ajuda:"the image format to use in GetMap requests",
			titulo:"wms_format",id:"wms_format",value:dados.wms_format,tipo:"text"},
			{ajuda:"",
			titulo:"wms_auth_username",id:"wms_auth_username",value:dados.wms_auth_username,tipo:"text"},
			{ajuda:"msEncrypt-style authorization string. Empty strings are also accepted",
			titulo:"wms_auth_password",id:"wms_auth_password",value:dados.wms_auth_password,tipo:"text"},
			{ajuda:"the authorization type to use for a proxy connection. Supported types include: basic, digest, ntlm, any (the underlying http library picks the best among the opotions supported by the remote server), anysafe (the underlying http library picks only safe methods among the options supported by the remote server)",
			titulo:"wms_auth_type",id:"wms_auth_type",value:dados.wms_auth_type,tipo:"text"},
			{ajuda:"the maximum time to wait for a remote WMS layer to load, set in seconds (default is 30 seconds). This metadata can be added at the layer level so that it affects only that layer, or it can be added at the map level (in the web object) so that it affects all of the layers. Note that wms_connectiontimeout at the layer level has priority over the map level.",
			titulo:"wms_connectiontimeout",id:"wms_connectiontimeout",value:dados.wms_connectiontimeout,tipo:"text"},
			{ajuda:"the bounding box of this layer in geographic coordinates in the format lon_min lat_min lon_max lat_max. If it is set then MapServer will request the layer only when the map view overlaps that bounding box. You normally get this from the servers capabilities output.",
			titulo:"wms_latlonboundingbox",id:"wms_latlonboundingbox",value:dados.wms_latlonboundingbox,tipo:"text"},
			{ajuda:"",
			titulo:"wms_proxy_auth_type",id:"wms_proxy_auth_type",value:dados.wms_proxy_auth_type,tipo:"text"},
			{ajuda:"",
			titulo:"wms_proxy_host",id:"wms_proxy_host",value:dados.wms_proxy_host,tipo:"text"},
			{ajuda:"",
			titulo:"wms_proxy_port",id:"wms_proxy_port",value:dados.wms_proxy_port,tipo:"text"},
			{ajuda:"the type of the proxy connection. Valid values are http and socks5, which are case sensitive",
			titulo:"wms_proxy_type",id:"wms_proxy_type",value:dados.wms_proxy_type,tipo:"text"},
			{ajuda:"",
			titulo:"wms_proxy_username",id:"wms_proxy_username",value:dados.wms_proxy_username,tipo:"text"},
			{ajuda:"",
			titulo:"wms_proxy_password",id:"wms_proxy_password",value:dados.wms_proxy_password,tipo:"text"},
			{ajuda:"Can be used to specify an inline SLD document",
			titulo:"wms_sld_body",id:"wms_sld_body",value:dados.wms_sld_body,tipo:"text"},
			{ajuda:"can be used to specify a link to an SLD document",
			titulo:"wms_sld_url",id:"wms_sld_url",value:dados.wms_sld_url,tipo:"text"},
			{ajuda:"name of style to use for the STYLES parameter in GetMap requests for this layer.",
			titulo:"wms_style",id:"wms_style",value:dados.wms_style,tipo:"text"},
			{ajuda:"specifies the color to be used as the background of the map. The general format of BGCOLOR is a hexadecimal encoding of an RGB value where two hexadecimal characters are used for each of Red, Green, and Blue color values. The values can range between 00 and FF for each (0 and 255, base 10). The format is 0xRRGGBB; either upper or lower case characters are allowed for RR, GG, and BB values. The '0x' prefix shall have a lower case 'x'",
			titulo:"wms_bgcolor",id:"wms_bgcolor",value:dados.wms_bgcolor,tipo:"text"},
			{ajuda:"specifies whether the map background is to be made transparent or not. TRANSPARENT can take on two values, 'TRUE' or 'FALSE'. If not specified, MapServer sets default to 'TRUE'",
			titulo:"wms_transparent",id:"wms_transparent",value:dados.wms_transparent,tipo:"text"},
			{ajuda:"value to use for the TIME parameter in GetMap requests for this layer",
			titulo:"wms_time",id:"wms_time",value:dados.wms_time,tipo:"text"},
			{ajuda:"Metadata espec&iacut;fico do i3Geo. Indica se o layer &eacute; do tipo TILECACHE",
			titulo:"&Eacute; do tipo TileCache (0 ou 1 indicam n&atilde;o ou sim) - wms_tile",id:"wms_tile",value:dados.wms_tile,tipo:"text"}
		]
	};
	var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	if(dados.colunas != "")
	{
		ins += "<p>O layer possu&iacute; as seguintes colunas na tabela de atributos: ";
		ins += dados.colunas+"</p>";
	}
	ins += core_geraLinhas(param);
	if(dados.type !== 3 && dados.type !== 4)
	{ins += core_geraLinhas(paramVetor);}
	if(dados.connectiontype !== 7 && dados.connectiontype !== 9)
	{ins += core_geraLinhas(paramNaoOWS);}
	if(dados.type === 3)
	{ins += core_geraLinhas(paramRaster);}
	if(dados.connectiontype === 7 || dados.connectiontype === 9)
	{ins += core_geraLinhas(paramOWS);}
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	if($i("cEditorsql")){
		temp = "<select id='editorsql' >";
		temp += core_combosimnao(dados.editorsql);
		temp += "</select>";
		$i("cEditorsql").innerHTML = temp;
	}
	if($i("cLtempoconvencode")){
		temp = "<select id='ltempoconvencode' >";
		temp += core_combosimnao(dados.ltempoconvencode);
		temp += "</select>";
		$i("cLtempoconvencode").innerHTML = temp;
	}
	var temp = function()
	{salvarDadosEditor('metadados',dados.codigoMap,dados.codigoLayer);};
	new YAHOO.widget.Button("salvarEditor",{ onclick: { fn: temp }});
}
