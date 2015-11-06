//
//Utilizado por editormapfile.js
//
//
//Dependencias: Este programa necessita do arquivo "../dicionario/editormapfile.js"
//
/*
Function: editorDados

Abre o editor de conex&atilde;o com a fonte dos dados de um layer

<PEGACONEXAO>
*/
function editorDados(codigoMap,codigoLayer)
{
	var sUrl = "../php/editormapfile.php?funcao=pegaConexao&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados($trad("obtemDados",i3GEOadmin.core.dicionario),sUrl,"montaEditorDados");
}

function montaEditorDados(dados)
{
	//nao use modal aqui!!!!
	core_montaEditor(
		function(){
			salvarDadosEditor('conexao',dados.codigoMap,dados.codigoLayer,false);
		},
		"500px","650px","",$trad("conexao",i3GEOadmin.editormapfile.dicionario) + "&nbsp;"+dados.codigoMap,false,true,false
	);

	var temp,ins = "",idsForms = ["connection","data","tileitem","tileindex","type","tipooriginal","metaestat_id_medida_variavel"],
		idsMetaestat = ["connection","data","tileitem","tileindex","tipooriginal"],
		limg = i3GEO.configura.locaplic+"/imagens/ic_zoom.png",
		param = {
			"linhas":[
			{ajuda:$trad("type",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("typeTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.type,tipo:"text",div:"<div id=cType ></div>"},
			{ajuda:$trad("connectiontype",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("connectiontypeTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:"",div:"<div id=cConnectiontype ></div>",tipo:"text"},
			{ajuda:$trad("connection",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("connectionTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:"",tipo:"text",div:"<div id=cConnection ></div>"},
			{ajuda:$trad("data",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("dataTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:"",tipo:"textarea",div:"<div id=cData ></div>"},
			{ajuda:$trad("cache",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("cacheTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.cache,tipo:"text",div:"<div id=cCache ></div>"},
			{ajuda:$trad("cortepixels",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("cortepixelsTitulo",i3GEOadmin.editormapfile.dicionario),id:"cortepixels",value:dados.cortepixels,tipo:"text"},

			{ajuda:$trad("tiles",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("tilesTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.tiles,tipo:"text",div:"<div id=cTiles ></div>"},

			{ajuda:$trad("metaestat",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("metaestatTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.metaestat,tipo:"text",div:"<div id=cMetaestat ></div>"},
			{ajuda:$trad("medidaVariavel",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("medidaVariavelTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:"",tipo:"text",div:"<div id=cMetaestat_id_medida_variavel ></div>"},
			{ajuda:$trad("convCaracter",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("convCaracterTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.convcaracter,tipo:"text",div:"<div id=cConvcaracter ></div>"},
			{ajuda:$trad("projecao",i3GEOadmin.editormapfile.dicionario),
			titulo:"Projection",id:"projection",value:dados.projection,tipo:"text"},
			{ajuda:$trad("filter",i3GEOadmin.editormapfile.dicionario),
			titulo:"Filter",id:"filter",value:dados.filter,tipo:"text"},
			{ajuda:$trad("filterItem",i3GEOadmin.editormapfile.dicionario),
			titulo:"Filteritem",id:"filteritem",value:dados.filteritem,tipo:"text"},
			{ajuda:$trad("tileItem",i3GEOadmin.editormapfile.dicionario),
			titulo:"tileitem",id:"tileitem",value:dados.tileitem,tipo:"text"},
			{ajuda:$trad("tileIndex",i3GEOadmin.editormapfile.dicionario),
			titulo:"tileindex",id:"tileindex",value:dados.tileindex,tipo:"text"},
			{ajuda:$trad("tipoOriginal",i3GEOadmin.editormapfile.dicionario),
			titulo:$trad("tipoOriginalTitulo",i3GEOadmin.editormapfile.dicionario),id:"",value:dados.tipooriginal,tipo:"text",div:"<div id=cTipoOriginal ></div>"}
			]
		};

	if(dados.colunas != "" && dados.colunas != undefined){
		ins += "<p>"+ $trad("atributosLayer",i3GEOadmin.editormapfile.dicionario) +"";
		temp = dados.colunas.split(",");
		ins += temp.join(" ")+"</p><br>";
	}
	ins += core_geraLinhas(param);
	ins += "<br>";
	$i("editor_bd").innerHTML = ins;

	if($i("cConnection")){
		temp = "";
		if(dados.postgis_mapa.length > 0){
			temp += "<p class=paragrafo >"+ $trad("msgAlias",i3GEOadmin.editormapfile.dicionario) +"";
			temp += "<br><b>"+dados.postgis_mapa+"</b>.<br><br>"+ $trad("defineAlias",i3GEOadmin.editormapfile.dicionario) +"";
			temp += "</p>";
		}
		temp += '<input type="text" value="'+dados.connection+'" id="connection" style="width:90%;">';
		temp += "<img onclick='selConexaoBanco(\"connection\")' src='"+limg+"' style='cursor:pointer;position :relative;top:2px'/>";
		$i("cConnection").innerHTML = temp;
	}
	if($i("cData")){
		temp = '<textarea value="'+dados.data+'" id="data" style="height: 100px;width:90%;">'+dados.data+'</textarea>';
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
	if($i("cTiles")){
		temp = "<select id='tiles' >";
		temp += core_combosimnao(dados.tiles);
		temp += "</select>";
		$i("cTiles").innerHTML = temp;
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

	$i("connectiontype").onchange = function(){
		d = [],valor = $i("connectiontype").value;
		core_desativaforms(idsForms);
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
			d.push("metaestat_id_medida_variavel");
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
