/*
Function: editorMetadados

Abre o editor de metadados

<PEGAMETADADOS>
*/
//
//Dependencias: Este programa necessita do arquivo "../dicionario/editormapfile.js"
//

function editorMetadados(codigoMap,codigoLayer){
	//core_montaEditor("","450px","500px","","Miscel&acirc;nea");
	var sUrl = "../php/editormapfile.php?funcao=pegaMetadados&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados($trad("obtemDados",i3GEOadmin.core.dicionario),sUrl,"montaEditorMetadados");
}
function montaEditorMetadados(dados){
	//core_montaEditor("","450px","500px","","Miscel&acirc;nea");
	var temp = function(){
		salvarDadosEditor('metadados',dados.codigoMap,dados.codigoLayer);
	};
	core_montaEditor(temp,"450px","500px","","Miscel&acirc;nea&nbsp;"+dados.codigoMap,true,true,false);
	var paramRaster = {
		"linhas":[
			{ajuda:$trad("palletefile",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("palletefileTitulo",i3GEOadmin.editormapfile.dicionario),id:"palletefile",value:dados.palletefile,tipo:"text"},
			{ajuda:$trad("palletestep",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("palletestepTitulo",i3GEOadmin.editormapfile.dicionario),id:"palletestep",value:dados.palletestep,tipo:"text"}
		]
	};
	var paramVetor = {
		"linhas":[
			{ajuda:$trad("editorsql",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("editorsqlTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.editorsql,tipo:"text",div:"<div id=cEditorsql ></div>"},
			{ajuda:$trad("ltempoformatodata",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("ltempoformatodataTitulo",i3GEOadmin.editormapfile.dicionario),id:"ltempoformatodata",value:dados.ltempoformatodata,tipo:"text"},
			{ajuda:$trad("ltempoiteminicio",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("ltempoiteminicioTitulo",i3GEOadmin.editormapfile.dicionario),id:"ltempoiteminicio",value:dados.ltempoiteminicio,tipo:"text"},
			{ajuda:$trad("ltempoitemfim",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("ltempoitemfimTitulo",i3GEOadmin.editormapfile.dicionario),id:"ltempoitemfim",value:dados.ltempoitemfim,tipo:"text"},
			{ajuda:$trad("ltempoitemtitulo",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("ltempoitemtituloTitulo",i3GEOadmin.editormapfile.dicionario),id:"ltempoitemtitulo",value:dados.ltempoitemtitulo,tipo:"text"},
			{ajuda:$trad("ltempoitemdescricao",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("ltempoitemdescricaoTitulo",i3GEOadmin.editormapfile.dicionario),id:"ltempoitemdescricao",value:dados.ltempoitemdescricao,tipo:"text"},
			{ajuda:$trad("ltempoitemtip",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("ltempoitemtipTitulo",i3GEOadmin.editormapfile.dicionario),id:"ltempoitemtip",value:dados.ltempoitemtip,tipo:"text"},
			{ajuda:$trad("ltempoitemimagem",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("ltempoitemimagemTitulo",i3GEOadmin.editormapfile.dicionario),id:"ltempoitemimagem",value:dados.ltempoitemimagem,tipo:"text"},
			{ajuda:$trad("ltempoitemlink",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("ltempoitemlinkTitulo",i3GEOadmin.editormapfile.dicionario),id:"ltempoitemlink",value:dados.ltempoitemlink,tipo:"text"},
			{ajuda:$trad("ltempoitemicone",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("ltempoitemiconeTitulo",i3GEOadmin.editormapfile.dicionario),id:"ltempoitemicone",value:dados.ltempoitemicone,tipo:"text"},
			{ajuda:$trad("ltempoconvencode",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("ltempoconvencodeTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.ltempoconvencode,tipo:"text",div:"<div id=cLtempoconvencode ></div>"},
		]
	};
	var paramNaoOWS = {
		"linhas":[
			{ajuda:$trad("classesitem",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("classesitemTitulo",i3GEOadmin.editormapfile.dicionario),id:"classesitem",value:dados.classesitem,tipo:"text"},
			{ajuda:$trad("classesnome",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("classesnomeTitulo",i3GEOadmin.editormapfile.dicionario),id:"classesnome",value:dados.classesnome,tipo:"text"},
			{ajuda:$trad("classescor",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("classescorTitulo",i3GEOadmin.editormapfile.dicionario),id:"classescor",value:dados.classescor,tipo:"text"},
			{ajuda:$trad("classessimbolo",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("classessimboloTitulo",i3GEOadmin.editormapfile.dicionario),id:"classessimbolo",value:dados.classessimbolo,tipo:"text"},
			{ajuda:$trad("classestamanho",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("classestamanhoTitulo",i3GEOadmin.editormapfile.dicionario),id:"classestamanho",value:dados.classestamanho,tipo:"text"}
		]
	};
	var param = {
		"linhas":[
			{ajuda:$trad("itembuscarapida",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("itembuscarapidaTitulo",i3GEOadmin.editormapfile.dicionario),id:"itembuscarapida",value:dados.itembuscarapida,tipo:"text"},
			{ajuda:$trad("itens",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("itensTitulo",i3GEOadmin.editormapfile.dicionario),id:"itens",value:dados.itens,tipo:"text"},
			{ajuda:$trad("itensdesc",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("itensdescTitulo",i3GEOadmin.editormapfile.dicionario),id:"itensdesc",value:dados.itensdesc,tipo:"text"},
			{ajuda:$trad("itenslink",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("itenslinkTitulo",i3GEOadmin.editormapfile.dicionario),id:"itenslink",value:dados.itenslink,tipo:"text"},
			{ajuda:$trad("descriptiontemplate",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("descriptiontemplateTitulo",i3GEOadmin.editormapfile.dicionario),id:"description_template",value:dados.description_template,tipo:"text"},
			{ajuda:$trad("tip",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("tipTitulo",i3GEOadmin.editormapfile.dicionario),id:"tip",value:dados.tip,tipo:"text"}
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
			{ajuda:$trad("wmstile",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("wmstileTitulo",i3GEOadmin.editormapfile.dicionario),id:"wms_tile",value:dados.wms_tile,tipo:"text"}
		]
	};
	//var ins = "<input type=button title='Salvar' value='Salvar' id=salvarEditor />";
	var ins = "";
	if(dados.colunas != "")
	{
		ins += "<p>"+ $trad("atributos",i3GEOadmin.editormapfile.dicionario) +"<br>";
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
		temp = "<div class='styled-select150'><select id='editorsql' >";
		temp += core_combosimnao(dados.editorsql);
		temp += "</select></div>";
		$i("cEditorsql").innerHTML = temp;
	}
	if($i("cLtempoconvencode")){
		temp = "<div class='styled-select150'><select id='ltempoconvencode' >";
		temp += core_combosimnao(dados.ltempoconvencode);
		temp += "</select></div>";
		$i("cLtempoconvencode").innerHTML = temp;
	}
}
