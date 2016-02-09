//
//Dependencias: Este programa necessita do arquivo "../dicionario/editormapfile.js"
//
function editorTemaMapfile(mapfile)
{
	core_pegaDados("buscando dados...","../php/menutemas.php?funcao=pegaTemaPorMapfile&codigo_tema="+mapfile,"montaEditorTema");
}
function montaEditorTema(dados){
	var temp = function(){
		gravaDadosTema(dados[0].id_tema);
	};
	core_montaEditor(temp,"400px","400px","","Tema",true,true,false);
	$i("editor_bd").innerHTML = montaDivTemas(dados[0]);
	//
	//preenche a div com a lista de tags
	//
	core_comboTags("comboTags","tags_tema","registraTagTema");
	/*
	function on_editorCheckBoxChange(p_oEvent)
	{
		var temp;
		if(p_oEvent.newValue.get("value") == "OK")
		{
			gravaDadosTema(dados[0].id_tema);
			temp = $i("idNome_"+dados[0].codigo_tema);
			if(temp){
				temp.innerHTML = $i("nome_tema").value;
			}
		}
		else
		{
			YAHOO.admin.container.panelEditorTema.destroy();
			YAHOO.admin.container.panelEditorTema = null;
		}
	};
	if(!YAHOO.admin.container.panelEditorTema)
	{
		var novoel = document.createElement("div");
		novoel.id =  "janela_editor_tema";
		var ins = '<div class="hd">Editor</div>';
		ins += "<div class='bd' style='height:354px;overflow:auto'>";
		ins += "<div id='okcancel_checkbox'></div><div id='editor_bd'></div>";
		novoel.innerHTML = ins;
		document.body.appendChild(novoel);
		var editorBotoes = new YAHOO.widget.ButtonGroup({id:"okcancel_checkbox_id", name:  "okcancel_checkbox_id", container:  "okcancel_checkbox" });
		editorBotoes.addButtons([
			{ label: "Salva", value: "OK", checked: false},
			{ label: "Cancela", value: "CANCEL", checked: false }
		]);
		editorBotoes.on("checkedButtonChange", on_editorCheckBoxChange);
		YAHOO.admin.container.panelEditorTema = new YAHOO.widget.Panel("janela_editor_tema", { fixedcenter:true,close:true,width:"400px", height:"400px",overflow:"auto", visible:false,constraintoviewport:true } );
		YAHOO.admin.container.panelEditorTema.render();
		var fecha = function()
		{
			YAHOO.admin.container.panelEditorTema.destroy();
			YAHOO.admin.container.panelEditorTema = null;
		};
		YAHOO.util.Event.addListener(YAHOO.admin.container.panelEditorTema.close, "click", fecha);
	}
	YAHOO.admin.container.panelEditorTema.show();
	//carrega os dados na janela
	$i("editor_bd").innerHTML = montaDivTemas(dados[0]);
	core_carregando("desativa");
	//
	//preenche a div com a lista de tags
	//
	core_comboTags("comboTags","tags_tema","registraTagTema");
	*/
}
function registraTagTema(valor)
{
	var inp = $i("tags_tema");
	var tags = inp.value;
	if(tags == "")
	inp.value = valor;
	else
	inp.value = tags+" "+valor;
}
function montaDivTemas(i)
{
	var param = {
		"linhas":[
		{titulo:$trad("nomeTema",i3GEOadmin.listatemas.dicionario),id:"nome_tema",size:"30",value:i.nome_tema,tipo:"text",div:""},
		{titulo:$trad("en",i3GEOadmin.listatemas.dicionario),id:"en",size:"30",value:i.en,tipo:"text",div:""},
		{titulo:$trad("es",i3GEOadmin.listatemas.dicionario),id:"es",size:"30",value:i.es,tipo:"text",div:""},
		{titulo:$trad("it",i3GEOadmin.listatemas.dicionario),id:"it",size:"30",value:i.it,tipo:"text",div:""}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	ins += "<p>"+ $trad("descricao",i3GEOadmin.listatemas.dicionario) +"<br>";
	ins += "<input size=30 type=text id=desc_tema value='"+i.desc_tema+"' /></p>";
	ins += "<p>"+ $trad("fonte",i3GEOadmin.listatemas.dicionario) +"<br>";
	ins += "<input size=30 type=text id=link_tema value='"+i.link_tema+"' /></p>";
	ins += "<p>"+ $trad("tags",i3GEOadmin.listatemas.dicionario) +"";
	ins += "<input type=text size=30 value='"+i.tags_tema+"' id='tags_tema' ><br>";
	ins += "<div id=comboTags >"+ $trad("busca",i3GEOadmin.listatemas.dicionario) +"</div>";
	//tipoa_tema pode receber o valor META indicando que baseia-se no sistema de metadados estatisticos
	//nesse caso, tipoa_tema e preenchido pelo editor de mapfile
	ins += "<p>"+ $trad("tipo",i3GEOadmin.listatemas.dicionario) +"<br>";
	ins += "<select  id='tipoa_tema' />";
	ins += "<option value='' ";
	if (i.tipoa_tema == ""){ins += "selected";}
	ins += ">"+ $trad("Normal",i3GEOadmin.listatemas.dicionario) +"</option>";
	ins += "<option value='META' ";
	if (i.tipoa_tema == "META"){ins += "selected";}
	ins += ">"+ $trad("metaestat",i3GEOadmin.listatemas.dicionario) +"</option>";
	ins += "<option value='WMS' ";
	if (i.tipoa_tema == "WMS"){ins += "selected";}
	ins += " >WMS<option></select></p>";
	ins += "<p>"+ $trad("permiteOgc",i3GEOadmin.listatemas.dicionario) +"<br>";
	ins += "<select  id='ogc_tema' >";
	ins += core_combosimnao(i.ogc_tema);
	ins += "</select></p>";
	ins += "<p>"+ $trad("permiteDownload",i3GEOadmin.listatemas.dicionario) +"<br>";
	ins += "<select  id='download_tema' >";
	ins += core_combosimnao(i.download_tema);
	ins += "</select></p>";
	ins += "<p>"+ $trad("permiteKml",i3GEOadmin.listatemas.dicionario) +"<br>";
	ins += "<select  id='kml_tema' >";
	ins += core_combosimnao(i.kml_tema);
	ins += "</select></p>";
	ins += "<p>"+ $trad("permiteKmz",i3GEOadmin.listatemas.dicionario) +"<br>";
	ins += "<select  id='kmz_tema' >";
	ins += core_combosimnao(i.kmz_tema);
	ins += "</select></p>";
	ins += "<p><span onclick='atualizaMiniatura()' style='color:blue;cursor:pointer' >"+ $trad("miniatura",i3GEOadmin.listatemas.dicionario) +"<br>";
	ins += "<img id='imagemMiniatura' src='../../temas/miniaturas/"+i.imagem+"' /></p><br><br>";
	ins += "<input type=hidden id=codigo_tema value='"+i.codigo_tema+"'/>";
	return(ins);
}
function atualizaMiniatura(){
	var i = $i("imagemMiniatura");
	i.src = "../../imagens/aguarde.gif";
	var tema = $i("codigo_tema").value;
	var sUrl = "../php/menutemas.php?funcao=atualizaMiniatura&tema="+tema;
	var callback =
	{
  		success:function(o)
  		{
  			var i = $i("imagemMiniatura");
  			//i.style.display = none;
  			//i.onLoad = function(){
  			//	$i("imagemMiniatura").style.display = "block";
  			//};
  			i.src = "../../temas/miniaturas/"+tema+".map.grande.png";
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback,"GET");
}
function gravaDadosTema(id)
{
	//validacao
	if($i("kml_tema") && $i("ogc_tema")){
		if(($i("ogc_tema").value).toLowerCase() == "sim")
		{$i("kml_tema").value = "SIM";}
	}
	if($i("kml_tema") && $i("kmz_tema")){
		if(($i("kmz_tema").value).toLowerCase() == "sim")
		{$i("kml_tema").value = "SIM";}
		if(($i("kml_tema").value).toLowerCase() == "nao")
		{$i("kmz_tema").value = "NAO";}
	}
	var campos = new Array("tipoa","nome","desc","link","tags","tipo","ogc","download","kml","codigo","kmz");
	var par = "";
	for (var i=0;i<campos.length;i++)
	{
		if($i(campos[i]+"_tema"))
		par += "&"+campos[i]+"="+($i(campos[i]+"_tema").value);
	}
	campos = new Array("en","es","it");
	for (i=0;i<campos.length;i++)
	{
		if($i(campos[i]))
		par += "&"+campos[i]+"="+($i(campos[i]).value);
	}
	par += "&id="+id;
	core_carregando("ativa");
	core_carregando($trad("gravaId",i3GEOadmin.core.dicionario)+id);
	var sUrl = "../php/menutemas.php?funcao=alteraTemas"+par;
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{
  				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
  				{
  					core_carregando("<span style=color:red >"+ $trad("msgNaoExcluiTema",i3GEOadmin.listatemas.dicionario) +"</span>");
  					setTimeout("core_carregando('desativa')",3000);
  				}
  				else
  				{
  					//var rec = myDataTable.getRecordSet().getRecord(recordid);
  					//myDataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0])
  					core_carregando("desativa");
  				}
				YAHOO.admin.container.panelEditor.destroy();
				YAHOO.admin.container.panelEditor = null;

  			}
  			catch(e){core_handleFailure(e,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback,"POST");
}
