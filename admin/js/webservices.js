/*
Title: webservices.js

Funções que controlam a interface do editor do cadastro de Web Services

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/js/webservices.js
*/
YAHOO.namespace("example.container");
/*
Function: initMenu

Inicializa o editor

<ALTERARWS>
*/
function initMenu()
{
	core_ativaBotaoAdicionaLinha("../php/webservices.php?funcao=alterarWS","adiciona");
	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	pegaWS();
}
/*
Function: pegaWS

Obtém a lista de WS

<PEGAWS>
*/
function pegaWS()
{
    //
	//pega o tipo de WS que será listado se tiver sido definido na url
	//
	var tipows = "",u;
	try{
		u = window.location.href.split("?");
		u = u[1].split("=");
		tipows = u[1];
	}
	catch(e){tipows = "";}
	core_pegaDados("buscando endereços...","../php/webservices.php?funcao=pegaWS&tipows="+tipows,"montaTabela");
}
/*
Function: montaTabela

Monta a tabela de edição

<PEGADADOS>
*/
function montaTabela(dados)
{
	YAHOO.example.InlineCellEditing = new function()
    {
        // Custom formatter for "address" column to preserve line breaks
        var formatTextoId = function(elCell, oRecord, oColumn, oData)
        {
            elCell.innerHTML = "<p>" + oData + "</p>";
        };
        var formatMais = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div class=editar style='text-align:center' ></div>";
        };
        var formatExclui = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div class=excluir style='text-align:center' ></div>";
        };
        var myColumnDefs = [
            {key:"excluir",label:"excluir",formatter:formatExclui},
            {key:"mais",label:"editar",formatter:formatMais},
            {label:"id",key:"id_ws", formatter:formatTextoId},
            {label:"tipo",key:"tipo_ws", formatter:formatTextoId},
            {label:"nome",key:"nome_ws", formatter:formatTextoId},
        ];
        myDataSource = new YAHOO.util.DataSource(dados);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema =
        {fields: ["id_ws","nome_ws","tipo_ws"]};
        myDataTable = new YAHOO.widget.DataTable("tabela", myColumnDefs, myDataSource);
        // Set up editing flow
		myDataTable.subscribe('cellClickEvent',function(ev)
		{
			var target = YAHOO.util.Event.getTarget(ev);
			var column = this.getColumn(target);
			if (column.key == 'excluir')
			{
				var record = this.getRecord(target);
				excluiLinha(record.getData('id_ws'),target);
			}
			if (column.key == 'mais')
			{
				var record = this.getRecord(target);
				core_carregando("ativa");
				core_carregando("buscando dados...");
				$clicouId = record.getData('id_ws');
				$recordid = record.getId();
				var sUrl = "../php/webservices.php?funcao=pegaDados&id_ws="+record.getData('id_ws');
				var callback =
				{
  					success:function(o)
  					{
  						try
  						{
  							montaEditor(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
  						}
  						catch(e){core_handleFailure(e,o.responseText);}
  					},
  					failure:core_handleFailure,
  					argument: { foo:"foo", bar:"bar" }
				}; 
				core_makeRequest(sUrl,callback);
			}

		});
        // Hook into custom event to customize save-flow of "radio" editor
        myDataTable.subscribe("editorUpdateEvent", function(oArgs)
        {
            if(oArgs.editor.column.key === "active")
            {
                this.saveCellEditor();  
            }
        });
        myDataTable.subscribe("editorBlurEvent", function(oArgs)
        {
            this.cancelCellEditor();
        });
    };
    core_carregando("desativa");
}
function montaEditor(dados,id,recordid)
{
	function on_editorCheckBoxChange(p_oEvent)
	{
		if(p_oEvent.newValue.get("value") == "OK")
		{
			gravaDados(id,recordid);
		}
		else
		{
			YAHOO.example.container.panelEditor.destroy();
			YAHOO.example.container.panelEditor = null;
		}
	};
	if(!YAHOO.example.container.panelEditor)
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
		YAHOO.example.container.panelEditor = new YAHOO.widget.Panel("janela_editor", { fixedcenter:true,close:false,width:"400px", height:"400px",overflow:"auto", visible:false,constraintoviewport:true } );
		YAHOO.example.container.panelEditor.render();
	}
	YAHOO.example.container.panelEditor.show();
	//carrega os dados na janela
	$i("editor_bd").innerHTML = montaDiv(dados[0]);
	core_carregando("desativa");
}
function montaDiv(i)
{
	var param = {
		"linhas":[
		{titulo:"Nome:",id:"Enome_ws",size:"50",value:i.nome_ws,tipo:"text",div:""},
		{titulo:"Descrição:",id:"Edesc_ws",size:"50",value:i.desc_ws,tipo:"text",div:""},
		{titulo:"Autor:",id:"Eautor_ws",size:"50",value:i.autor_ws,tipo:"text",div:""},
		{titulo:"Endereço:",id:"Elink_ws",size:"50",value:i.link_ws,tipo:"text",div:""}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);	

	ins += "<p>Tipo:<br>";
	ins += "<select  id='Etipo_ws' />";
	ins += "<option value='' ";
	if (i.tipo_ws == ""){ins += "selected";}
	ins += ">---</option>";
	ins += "<option value='KML' ";
	if (i.tipo_ws == "KML"){ins += "selected";}
	ins += " >KML</option>";
	ins += "<option value='WMS' ";
	if (i.tipo_ws == "WMS"){ins += "selected";}
	ins += " >WMS</option>";
	ins += "<option value='GEORSS' ";
	if (i.tipo_ws == "GEORSS"){ins += "selected";}
	ins += " >GEORSS</option>";
	ins += "<option value='WS' ";
	if (i.tipo_ws == "WS"){ins += "selected";}
	ins += " >WS</option>";
	ins += "<option value='DOWNLOAD' ";
	if (i.tipo_ws == "DOWNLOAD"){ins += "selected";}
	ins += " >DOWNLOAD</option>";
	ins += "<option value='GEOJSON' ";
	if (i.tipo_ws == "GEOJSON"){ins += "selected";}
	ins += " >GEOJSON</option>";

	ins += "</select></p>";
	return(ins);
}
function excluiLinha(id,row)
{
	var mensagem = " excluindo o registro do id= "+id;
	var sUrl = "../php/webservices.php?funcao=excluir&id="+id;
	core_excluiLinha(sUrl,row,mensagem);
}
/*
Function: gravaDados

Aplica as alterações feitas em um WS

<ALTERARWS>
*/
function gravaDados(id,recordid)
{
	var campos = new Array("desc","nome","link","tipo","autor"),
		par = "",
		i;
	for (i=0;i<campos.length;i++)
	{par += "&"+campos[i]+"_ws="+($i("E"+campos[i]+"_ws").value);}
	par += "&id_ws="+id;
	core_carregando("ativa");
	core_carregando(" gravando o registro do id= "+id);
	var sUrl = "../php/webservices.php?funcao=alterarWS"+par;
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{
  				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
  				{
  					core_carregando("<span style=color:red >Não foi possível excluir. Verifique se não existem registros vinculados</span>");
  					setTimeout("core_carregando('desativa')",3000);
  				}
  				else
  				{
  					var rec = myDataTable.getRecordSet().getRecord(recordid);
  					myDataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0]);
  					core_carregando("desativa");
  				}
				YAHOO.example.container.panelEditor.destroy();
				YAHOO.example.container.panelEditor = null;
  			}
  			catch(e){core_handleFailure(e,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback);
}
YAHOO.util.Event.addListener(window, "load", initMenu);