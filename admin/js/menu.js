/*
Title: menu.js

Fun&ccedil;&otilde;es que controlam a interface do editor de menus

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
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
	YAHOO.namespace("admin.container");
	core_ativaBotaoAdicionaLinha("../php/menutemas.php?funcao=alteraMenus&publicado_menu=&perfil=&nome=&desc=&id=&aberto=","adicionaNovoMenu","pegaMenus_M");
	pegaMenus_M();
}
/*
Function: pegaMenus_M

Obt&eacute;m a lista de menus

<PEGAMENUS>
*/
function pegaMenus_M()
{
	core_carregando("ativa");
	core_pegaDados("buscando menus...","../php/menutemas.php?funcao=pegaMenus","montaTabela_M");
}
function montaTabela_M(dados)
{
    YAHOO.example.InlineCellEditing = new function()
    {
        // Custom formatter for "address" column to preserve line breaks
        var formatTexto = function(elCell, oRecord, oColumn, oData)
        {
            if(oData === ""){
				oData = "<span style='color:gray' ></span>";
			}
			elCell.innerHTML = "<pre ><p style=cursor:pointer title='clique para editar'>" + oData + "</pre>";
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
			{label:"nome padr&atilde;o do menu",resizeable:true,key:"nome_menu", formatter:formatTexto,editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"nome em ingl&ecirc;s (opcional)",resizeable:true,key:"en", formatter:formatTexto,editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"nome em espanhol (opcional)",resizeable:true,key:"es", formatter:formatTexto,editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"nome em italiano (opcional)",resizeable:true,key:"it", formatter:formatTexto,editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"publicado para todos verem?",key:"publicado_menu",editor:"radio" ,editorOptions:{radioOptions:["SIM","NAO"],disableBtns:false,LABEL_SAVE:"OK"}},
			{label:"perfis",resizeable:true,key:"perfil_menu", formatter:formatTexto,editor:"textbox",editorOptions:{LABEL_SAVE:"OK"}},
			{label:"inicia aberto?",key:"aberto", editor:"radio" ,editorOptions:{radioOptions:["SIM","NAO"],disableBtns:false,LABEL_SAVE:"OK"}},
			{label:"descri&ccedil;&atilde;o",resizeable:true,key:"desc_menu", formatter:formatTexto,editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})}
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
			if(YAHOO.admin.container.panelCK)
			{
				YAHOO.admin.container.panelCK.destroy();
				YAHOO.admin.container.panelCK = null;
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
				core_makeRequest(sUrl,callback);
			}
		});
    };
    core_carregando("desativa");
}
function montaEditor_M(dados,id,recordid)
{
	function on_editorCheckBoxChange(p_oEvent)
	{
		if(p_oEvent.newValue.get("value") == "OK")
		{
			gravaDados_M(id,recordid);
		}
		YAHOO.admin.container.panelEditor2.destroy();
		YAHOO.admin.container.panelEditor2 = null;
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
		YAHOO.admin.container.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { fixedcenter:true,close:false,width:"400px", height:"480px",overflow:"auto", visible:false,constraintoviewport:true } );
		YAHOO.admin.container.panelEditor2.render();
	}
	YAHOO.admin.container.panelEditor2.show();
	$i("editor_bd2").innerHTML = montaDiv_M(dados[0]);
	core_carregando("desativa");
}
function montaDiv_M(i)
{
	var param = {
		"linhas":[
			{titulo:"Nome padr&atilde;o:",id:"Enome_menu",size:"50",value:i.nome_menu,tipo:"text",div:""},
			{titulo:"Descricao (opcional):",id:"Edesc_menu",size:"50",value:i.desc_menu,tipo:"text",div:""},
			{titulo:"Nome em ingl&ecirc;s (opcional):",id:"Een",size:"50",value:i.en,tipo:"text",div:""},
			{titulo:"Espanhol (opcional):",id:"Ees",size:"50",value:i.es,tipo:"text",div:""},
			{titulo:"Italiano (opcional):",id:"Eit",size:"50",value:i.it,tipo:"text",div:""},
			{titulo:"Perfis (opcional):",id:"Eperfil_menu",size:"50",value:i.perfil_menu,tipo:"text",div:""}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	ins += "<p>Publicado para todos verem?<br>";
	ins += "<select  id='Epublicado_menu' />";
	ins += "<option value='' ";
	if (i.publicado_menu == ""){ins += "selected";}
	ins += ">---</option>";
	ins += "<option value='SIM' ";
	if ((i.publicado_menu).toLowerCase() == "sim"){ins += "selected";}
	ins += " >sim</option>";
	ins += "<option value='NAO' ";
	if ((i.publicado_menu).toLowerCase() == "nao"){ins += "selected";}
	ins += " >n&atilde;o</option>";
	ins += "</select></p>";
	ins += "<p>Inicia aberto na &aacute;rvore?<br>";
	ins += "<select  id='Eaberto' />";
	ins += "<option value='' ";
	if (i.aberto == ""){ins += "selected";}
	ins += ">---</option>";
	ins += "<option value='SIM' ";
	if ((i.aberto).toLowerCase() == "sim"){ins += "selected";}
	ins += " >sim</option>";
	ins += "<option value='NAO' ";
	if ((i.aberto).toLowerCase() == "nao"){ins += "selected";}
	ins += " >n&atilde;o</option>";
	ins += "</select></p>";
	return(ins);
}
/*
Function: gravaDados_M

Salva as altera&ccedil;&otilde;es feitas

<ALTERAMENUS>
*/
function gravaDados_M(id,recordid)
{
	var campos = new Array("publicado_menu","perfil_menu","nome_menu","desc_menu","aberto","en","es","it");
	var par = "";
	for (var i=0;i<campos.length;i++)
	{
		par += "&"+campos[i]+"="+($i("E"+campos[i]).value);
	}
	par += "&id_menu="+id;
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
  					core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem registros vinculados</span>");
  					setTimeout("core_carregando('desativa')",3000);
  				}
  				else
  				{
  					var rec = myDataTable.getRecordSet().getRecord(recordid);
  					myDataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0]);
  					core_carregando("desativa");
  				}
  			}
  			catch(e){core_handleFailure(e,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback);
}
function excluiLinha_M(id,row)
{
	var mensagem = " excluindo o registro do id= "+id;
	var sUrl = "../php/menutemas.php?funcao=excluirRegistro&id="+id+"&tabela=menus";
	core_excluiLinha(sUrl,row,mensagem);
}
//YAHOO.util.Event.addListener(window, "load", initMenu);