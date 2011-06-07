/*
Title: menu.js

Funções que controlam a interface do editor de menus

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

i3geo/admin/js/menus.js
*/
/*
Function: initEditorMenu

Inicializa o editor

<ALTERAMENUS>
*/
function initEditorMenu()
{
	YAHOO.namespace("example.container");
	core_ativaBotaoAdicionaLinha("../php/menutemas.php?funcao=alteraMenus&publicado_menu=&perfil=&nome=&desc=&id=&aberto=","adicionaNovoMenu","pegaMenus_M")
	pegaMenus_M()
}
/*
Function: pegaMenus_M

Obtém a lista de menus

<PEGAMENUS>
*/
function pegaMenus_M()
{
	core_carregando("ativa");
	core_pegaDados("buscando menus...","../php/menutemas.php?funcao=pegaMenus","montaTabela_M")
}
function montaTabela_M(dados)
{
    YAHOO.example.InlineCellEditing = new function()
    {
        // Custom formatter for "address" column to preserve line breaks
        var formatTexto = function(elCell, oRecord, oColumn, oData)
        {
            elCell.innerHTML = "<pre ><p style=cursor:pointer title='clique para editar'>" + oData + "</pre>";
        };
        var formatSalva = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div class=salvar title='salva' style='text-align:center' onclick='gravaLinha_M(\""+oRecord._sId+"\")'></div>";
        };
        var formatExclui = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div class=excluir title='exclui' style='text-align:center' ></div>";//onclick='excluiLinha_M(\""+oRecord.getData("id_menu")+"\",\""+oRecord.getId()+"\")'></div>";
        };
        var formatMais = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div class=editar style='text-align:center' ></div>";
        };
        var myColumnDefs = [
            {key:"excluir",label:"excluir",formatter:formatExclui},
			{key:"mais",label:"editar",formatter:formatMais},
            {label:"id",key:"id_menu", formatter:formatTexto},
			{label:"nome",resizeable:true,key:"nome_menu", formatter:formatTexto,editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"en",resizeable:true,key:"en", formatter:formatTexto,editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"es",resizeable:true,key:"es", formatter:formatTexto,editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"it",resizeable:true,key:"it", formatter:formatTexto,editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"publicado?",key:"publicado_menu",editor:"radio" ,editorOptions:{radioOptions:["SIM","NAO"],disableBtns:false,LABEL_SAVE:"OK"}},
			{label:"perfis",resizeable:true,key:"perfil_menu", formatter:formatTexto,editor:"textbox",editorOptions:{LABEL_SAVE:"OK"}},
			{label:"aberto?",key:"aberto", editor:"radio" ,editorOptions:{radioOptions:["SIM","NAO"],disableBtns:false,LABEL_SAVE:"OK"}},
			{label:"descrição",resizeable:true,key:"desc_menu", formatter:formatTexto,editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})}
        ];
		//YAHOO.widget.CellEditor.LABEL_SAVE = "Aplicar";
        myDataSource = new YAHOO.util.DataSource(dados);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema =
        {
            fields: ["it","es","en","publicado_menu","perfil_menu","aberto","desc_menu","id_menu","nome_menu"]
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
				excluiLinha_M(record.getData('id_menu'),target);
			}
			if (column.key == 'mais')
			{
				var record = this.getRecord(target);
				core_carregando("ativa");
				core_carregando("buscando dados...");
				$clicouId = record.getData('id_menu');
				$recordid = record.getId();
				var sUrl = "../php/menutemas.php?funcao=pegamenus&id_menu="+record.getData('id_menu');
				var callback =
				{
  					success:function(o)
  					{
  						try
  						{
  							montaEditor_M(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
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
function montaEditor_M(dados,id,recordid)
{
	function on_editorCheckBoxChange(p_oEvent)
	{
		var ins = "";
		if(p_oEvent.newValue.get("value") == "OK")
		{
			gravaDados_M(id,recordid);
		}
		else
		{
			YAHOO.example.container.panelEditor.destroy();
			YAHOO.example.container.panelEditor = null;
		}
	};
	if(!$i("janela_editor2"))
	{
		var novoel = document.createElement("div");
		novoel.id =  "janela_editor2";
		var ins = '<div class="hd">Editor</div>';
		ins += "<div class='bd' style='height:354px;overflow:auto'>";
		ins += "<div id='okcancel_checkbox2'></div><div id='editor_bd2'></div>";
		novoel.innerHTML = ins;
		document.body.appendChild(novoel);
		var editorBotoes = new YAHOO.widget.ButtonGroup({id:"okcancel_checkbox_id2", name:  "okcancel_checkbox_id2", container:  "okcancel_checkbox2" });
		editorBotoes.addButtons([
            { label: "Salva", value: "OK", checked: false},
            { label: "Cancela", value: "CANCEL", checked: false }
        ]);
		editorBotoes.on("checkedButtonChange", on_editorCheckBoxChange);	
		YAHOO.example.container.panelEditor = new YAHOO.widget.Panel("janela_editor2", { fixedcenter:true,close:false,width:"400px", height:"480px",overflow:"auto", visible:false,constraintoviewport:true } );
		YAHOO.example.container.panelEditor.render();
	}
	YAHOO.example.container.panelEditor.show();
	$i("editor_bd2").innerHTML = montaDiv_M(dados[0])
	core_carregando("desativa");
}
function montaDiv_M(i)
{
	var param = {
		"linhas":[
			{titulo:"Nome:",id:"Enome_menu",size:"50",value:i.nome_menu,tipo:"text",div:""},
			{titulo:"Descricao:",id:"Edesc_menu",size:"50",value:i.desc_menu,tipo:"text",div:""},
			{titulo:"Inglês:",id:"Een",size:"50",value:i.en,tipo:"text",div:""},
			{titulo:"Espanhol:",id:"Ees",size:"50",value:i.es,tipo:"text",div:""},
			{titulo:"Italiano:",id:"Eit",size:"50",value:i.it,tipo:"text",div:""},
			{titulo:"Perfis:",id:"Eperfil_menu",size:"50",value:i.perfil_menu,tipo:"text",div:""}
		]
	};
	var ins = ""
	ins += core_geraLinhas(param)	
	ins += "<p>Publicado?<br>"
	ins += "<select  id='Epublicado_menu' />"
	ins += "<option value='' "
	if (i.publicado_menu == ""){ins += "selected";}
	ins += ">---</option>"
	ins += "<option value='SIM' "
	if ((i.publicado_menu).toLowerCase() == "sim"){ins += "selected";}
	ins += " >sim</option>"
	ins += "<option value='NAO' "
	if ((i.publicado_menu).toLowerCase() == "nao"){ins += "selected";}
	ins += " >não</option>"
	ins += "</select></p>"
	ins += "<p>Aberto?<br>"
	ins += "<select  id='Eaberto' />"
	ins += "<option value='' "
	if (i.aberto == ""){ins += "selected";}
	ins += ">---</option>"
	ins += "<option value='SIM' "
	if ((i.aberto).toLowerCase() == "sim"){ins += "selected";}
	ins += " >sim</option>"
	ins += "<option value='NAO' "
	if ((i.aberto).toLowerCase() == "nao"){ins += "selected";}
	ins += " >não</option>"
	ins += "</select></p>"
	return(ins)
}
/*
Function: gravaDados_M

Salva as alterações feitas

<ALTERAMENUS>
*/
function gravaDados_M(id,recordid)
{
	var campos = new Array("publicado_menu","perfil_menu","nome_menu","desc_menu","aberto","en","es","it");
	var par = ""
	for (i=0;i<campos.length;i++)
	{
		par += "&"+campos[i]+"="+($i("E"+campos[i]).value)
	}
	par += "&id_menu="+id
	core_carregando("ativa");
	core_carregando(" gravando o registro do id= "+id);
	var sUrl = "../php/menutemas.php?funcao=alteraMenus"+par;
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
function excluiLinha_M(id,row)
{
	var mensagem = " excluindo o registro do id= "+id;
	var sUrl = "../php/menutemas.php?funcao=excluirRegistro&id="+id+"&tabela=menus";
	core_excluiLinha(sUrl,row,mensagem)
}
//YAHOO.util.Event.addListener(window, "load", initMenu);