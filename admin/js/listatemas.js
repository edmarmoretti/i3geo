function editorTemaMapfile(mapfile)
{
	core_pegaDados("buscando dados...","../php/menutemas.php?funcao=pegaTemaPorMapfile&codigo_tema="+mapfile,"montaEditorTema")
}
function montaEditorTema(dados)
{
	function on_editorCheckBoxChange(p_oEvent)
	{
		var ins = "";
		if(p_oEvent.newValue.get("value") == "OK")
		{
			gravaDadosTema(dados[0].id_tema);
		}
		else
		{
			YAHOO.example.container.panelEditorTema.destroy();
			YAHOO.example.container.panelEditorTema = null;
		}
	};
	if(!YAHOO.example.container.panelEditorTema)
	{
		var novoel = document.createElement("div");
		novoel.id =  "janela_editor";
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
		YAHOO.example.container.panelEditorTema = new YAHOO.widget.Panel("janela_editor", { fixedcenter:true,close:true,width:"400px", height:"400px",overflow:"auto", visible:false,constraintoviewport:true } );
		YAHOO.example.container.panelEditorTema.render();
	}
	YAHOO.example.container.panelEditorTema.show();
	//carrega os dados na janela
	$i("editor_bd").innerHTML = montaDivTemas(dados[0])
	core_carregando("desativa");
	//
	//preenche a div com a lista de tags
	//
	core_comboTags("comboTags","tags_tema","registraTagTema");
}
function registraTagTema(valor)
{
	var inp = $i("tags_tema")
	var tags = inp.value
	if(tags == "")
	inp.value = valor
	else
	inp.value = tags+" "+valor
}
function montaDivTemas(i)
{
	var param = {
		"linhas":[
		{titulo:"Nome que será mostrado na árvore de menus:",id:"nome_tema",size:"50",value:i.nome_tema,tipo:"text",div:""}
		]
	}
	var ins = ""
	ins += core_geraLinhas(param)	
	
	ins += "<p>Descrição:<br>";
	ins += "<input size=50 type=text id=desc_tema value='"+i.desc_tema+"' /></p>"
	
	ins += "<p>Link para a fonte:<br>";
	ins += "<input size=50 type=text id=link_tema value='"+i.link_tema+"' /></p>"
	
	ins += "<p>Tags (separe com espaço). Você pode digitar novos tags ou pegar da lista abaixo:"
	ins += "<input type=text size=50 value='"+i.tags_tema+"' id='tags_tema' ><br>"
	ins += "<div id=comboTags >Buscando...</div>";
	
	ins += "<p>Tipo (preencha apenas se for do tipo WMS):<br>"
	ins += "<select  id='tipo_tema' />"
	ins += "<option value='' "
	if (i.tipoa_tema == ""){ins += "selected";}
	ins += ">Normal</option>"
	ins += "<option value='WMS' "
	if (i.tipoa_tema == "WMS"){ins += "selected";}
	ins += " >WMS<option></select></p>"
	
	ins += "<p>Permite acesso via WMS/WFS?<br>"
	ins += "<select  id='ogc_tema' >"
	ins += core_combosimnao(i.ogc_tema)
	ins += "</select></p>"
	
	ins += "<p>Permite o download na aplicação datadownload.htm?<br>"
	ins += "<select  id='download_tema' >"
	ins += core_combosimnao(i.download_tema)
	ins += "</select></p>"

	ins += "<p>Permite acesso via kml?<br>"
	ins += "<select  id='kml_tema' >"
	ins += core_combosimnao(i.kml_tema)
	ins += "</select></p><br><br><br>"
	
	ins += "<input type=hidden id=codigo_tema value='"+i.codigo_tema+"'/>"
	return(ins)
}
function gravaDadosTema(id)
{
	var campos = new Array("nome","desc","link","tags","tipo","ogc","download","kml","codigo")
	var par = ""
	for (i=0;i<campos.length;i++)
	{par += "&"+campos[i]+"="+($i(campos[i]+"_tema").value)}
	par += "&id="+id
	core_carregando("ativa");
	core_carregando(" gravando o registro do id= "+id);
	var sUrl = "../php/menutemas.php?funcao=alteraTemas"+par;
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{
  				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
  				{
  					core_carregando("<span style=color:red >Não foi possível excluir. Verifique se não existem menus vinculados a este tema</span>");
  					setTimeout("core_carregando('desativa')",3000)
  				}
  				else
  				{
  					//var rec = myDataTable.getRecordSet().getRecord(recordid);
  					//myDataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0])
  					core_carregando("desativa");
  				}
				YAHOO.example.container.panelEditorTema.destroy();
				YAHOO.example.container.panelEditorTema = null;
  			}
  			catch(e){core_handleFailure(e,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback,"POST")
}