/*
Title: identifica.js

Funções que controlam a interface do editor dos sistemas adicionais de identificação

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

i3geo/admin/js/identifica.js
*/

YAHOO.namespace("example.container");
function initMenu()
{
	core_ativaBotaoAdicionaLinha("../php/identifica.php?funcao=alterarFuncoes")
	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	pegaFuncoes();
}
function pegaFuncoes()
{
	core_pegaDados("buscando funções...","../php/identifica.php?funcao=pegaFuncoes","montaTabela")
}
function montaTabela(dados)
{
    YAHOO.example.InlineCellEditing = new function()
    {
        // Custom formatter for "address" column to preserve line breaks
        var formatMais = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div class=editar style='text-align:center' ></div>";
        };
        var formatTexto = function(elCell, oRecord, oColumn, oData)
        {
            elCell.innerHTML = "<pre ><p>" + oData + "</pre>";
        };
        var formatSalva = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div class=salvar style='text-align:center' onclick='gravaLinha(\""+oRecord._sId+"\")'></div>";
        };
        var formatExclui = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div class=excluir style='text-align:center' ></div>";//onclick='excluiLinha(\""+oRecord.getData("id_menu")+"\",\""+oRecord.getId()+"\")'></div>";
        };
        var myColumnDefs = [
            {key:"excluir",label:"excluir",formatter:formatExclui},
			{key:"mais",label:"editar",formatter:formatMais},
            {label:"id",key:"id_i", formatter:formatTexto},
			{label:"nome",resizeable:true,key:"nome_i", formatter:formatTexto, editor:"textbox"},
			{label:"publicado?",key:"publicado_i",editor:"radio" ,editorOptions:{radioOptions:["SIM","NAO"],disableBtns:false}},
			{label:"programa",resizeable:true,key:"abrir_i", formatter:formatTexto, editor:"textbox"},
			{label:"abrir como?",key:"target_i", formatter:formatTexto,editor:"dropdown" ,editorOptions:{dropdownOptions:["self","target"],disableBtns:false}}
        ];
        myDataSource = new YAHOO.util.DataSource(dados);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema =
        {
            fields: ["publicado_i","abrir_i","id_i","nome_i","target_i"]
        };
        myDataTable = new YAHOO.widget.DataTable("tabela", myColumnDefs, myDataSource);
		myDataTable.subscribe('cellClickEvent',function(ev)
		{
			var target = YAHOO.util.Event.getTarget(ev);
			var column = this.getColumn(target);
			if(YAHOO.example.container.panelCK)
			{
				YAHOO.example.container.panelCK.destroy();
				YAHOO.example.container.panelCK = null;
			}
			if (column.key == 'excluir')
			{
				var record = this.getRecord(target);
				excluiLinha(record.getData('id_i'),target);
			}
			if (column.key == 'mais')
			{
				var record = this.getRecord(target);
				core_carregando("ativa");
				core_carregando("buscando dados...");
				$clicouId = record.getData('id_i');
				$recordid = record.getId();
				var sUrl = "../php/identifica.php?funcao=pegafuncoes&id_i="+record.getData('id_i');
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
				core_makeRequest(sUrl,callback)
			}
		});

    };
    core_carregando("desativa");
}
function montaEditor(dados,id,recordid)
{
	function on_editorCheckBoxChange(p_oEvent)
	{
		var ins = "";
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
	$i("editor_bd").innerHTML = montaDiv(dados[0])
	core_carregando("desativa");
}
function montaDiv(i)
{
	var param = {
		"linhas":[
		{titulo:"Nome:",id:"Enome_i",size:"50",value:i.nome_i,tipo:"text",div:""},
		{titulo:"Programa:",id:"Eabrir_i",size:"50",value:i.abrir_i,tipo:"text",div:""},
		{titulo:"Abrir como:",id:"Etarget_i",size:"50",value:i.target_i,tipo:"text",div:""}
		]
	}
	var ins = ""
	ins += core_geraLinhas(param)	

	ins += "<p>Publicado?<br>"
	ins += "<select  id='Epublicado_i' />"
	ins += "<option value='' "
	if (i.publicado_i == ""){ins += "selected";}
	ins += ">---</option>"
	ins += "<option value='SIM' "
	if (i.publicado_i == "SIM"){ins += "selected";}
	ins += " >sim</option>"
	ins += "<option value='NAO' "
	if (i.publicado_i == "NAO"){ins += "selected";}
	ins += " >não</option>"
	ins += "</select></p>"
	return(ins)
}
/*
Function: gravaDados

Salva as alterações feitas

<ALTERARFUNCOES>
*/
function gravaDados(id,recordid)
{
	var campos = new Array("nome","publicado","abrir","target")
	var par = ""
	for (i=0;i<campos.length;i++)
	{par += "&"+campos[i]+"_i="+($i("E"+campos[i]+"_i").value)}
	par += "&id_i="+id
	core_carregando("ativa");
	core_carregando(" gravando o registro do id= "+id);
	var sUrl = "../php/identifica.php?funcao=alterarFuncoes"+par;
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{
  				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
  				{
  					core_carregando("<span style=color:red >Não foi possível excluir. Verifique se não existem registros vinculados</span>");
  					setTimeout("core_carregando('desativa')",3000)
  				}
  				else
  				{
  					var rec = myDataTable.getRecordSet().getRecord(recordid);
  					myDataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0])
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
	core_makeRequest(sUrl,callback)
}

function excluiLinha(id,row)
{
	var mensagem = " excluindo o registro do id= "+id;
	var sUrl = "../php/identifica.php?funcao=excluir&id="+id;
	core_excluiLinha(sUrl,row,mensagem)
}
YAHOO.util.Event.addListener(window, "load", initMenu);