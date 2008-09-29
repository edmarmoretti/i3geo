YAHOO.namespace("example.container");
function initMenu()
{
	core_ativaBotaoAdicionaLinha("../php/menutemas.php?funcao=alteraMenus&publicado_menu=&perfil=&nome=&desc=&id=&aberto=")
	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	core_pegaPerfis("pegaMenus()");
}
function pegaMenus()
{
	core_pegaDados("buscando menus...","../php/menutemas.php?funcao=pegaMenus","montaTabela")
}
function montaTabela(dados)
{
    YAHOO.example.InlineCellEditing = new function()
    {
        // Custom formatter for "address" column to preserve line breaks
        var formatTexto = function(elCell, oRecord, oColumn, oData)
        {
            elCell.innerHTML = "<pre ><p>" + oData + "</pre>";
        };
        var formatSalva = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div class=aplicar style='text-align:center' onclick='gravaLinha(\""+oRecord._sId+"\")'></div>";
        };
        var formatExclui = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div class=excluir style='text-align:center' ></div>";//onclick='excluiLinha(\""+oRecord.getData("id_menu")+"\",\""+oRecord.getId()+"\")'></div>";
        };
        var myColumnDefs = [
            {key:"excluir",label:"excluir",formatter:formatExclui},
            {label:"salvar",formatter:formatSalva},
            {label:"id",key:"id_menu", formatter:formatTexto},
			{label:"nome",resizeable:true,key:"nome_menu", formatter:formatTexto, editor:"textbox"},
			{label:"publicado?",key:"publicado_menu",editor:"radio" ,editorOptions:{radioOptions:["SIM","NAO"],disableBtns:false}},
			{label:"perfis",resizeable:true,key:"perfil_menu", formatter:formatTexto,editor:"textbox"},
			{label:"aberto?",key:"aberto", editor:"radio" ,editorOptions:{radioOptions:["SIM","NAO"],disableBtns:false}},
			{label:"descrição",resizeable:true,key:"desc_menu", formatter:formatTexto, editor:"textbox"}
        ];
        myDataSource = new YAHOO.util.DataSource(dados);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema =
        {
            fields: ["publicado_menu","perfil_menu","aberto","desc_menu","id_menu","nome_menu"]
        };
        myDataTable = new YAHOO.widget.DataTable("tabela", myColumnDefs, myDataSource);
        // Set up editing flow
        myDataTable.highlightEditableCell = function(oArgs)
        {
            var elCell = oArgs.target;
            var column = myDataTable.getColumn(oArgs.target);
            //if(column.editor != "null")
            if(!YAHOO.lang.isNull(column.editor))
            {
				YAHOO.util.Dom.addClass(elCell,'yui-dt-highlighted');
            }
        };
        myDataTable.unhighlightEditableCell = function(oArgs)
        {
            var elCell = oArgs.target;
            if(elCell.style.cursor="pointer")
            {
				YAHOO.util.Dom.removeClass(elCell,'yui-dt-highlighted');
            }
        };
        myDataTable.subscribe("cellMouseoverEvent", myDataTable.highlightEditableCell);
        myDataTable.subscribe("cellMouseoutEvent", myDataTable.unhighlightEditableCell);
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
				excluiLinha(record.getData('id_menu'),target);
			}
			else
			{
				if (column.key == 'perfil_menu')
				{
					var record = this.getRecord(target);
					var selecionados = record.getData('perfil_menu');
					var selecionados = selecionados.split(",");
					core_menuCheckBox($perfisArray,$perfisArray,selecionados,target,record,"perfil_menu");
				}
				else
				{this.onEventShowCellEditor(ev);}
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
function gravaLinha(row)
{
	var r = myDataTable.getRecordSet().getRecord(row);
	var publicado_menu = r.getData("publicado_menu");
	var perfil_menu = r.getData("perfil_menu");
	var aberto = r.getData("aberto")
	var desc_menu = r.getData("desc_menu")
	var id_menu = r.getData("id_menu")
	var nome_menu = r.getData("nome_menu")
	core_carregando("ativa");
	var sUrl = "../php/menutemas.php?funcao=alteraMenus&publicado_menu="+publicado_menu+"&perfil="+perfil_menu+"&nome="+nome_menu+"&desc="+desc_menu+"&id="+id_menu+"&aberto="+aberto+"";
	core_gravaLinha(mensagem,row,sUrl)
}
function excluiLinha(id,row)
{
	var mensagem = " excluindo o registro do id= "+id;
	var sUrl = "../php/menutemas.php?funcao=excluirRegistro&id="+id+"&tabela=menus";
	core_excluiLinha(sUrl,row,mensagem)
}
YAHOO.util.Event.addListener(window, "load", initMenu);