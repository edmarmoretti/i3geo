//YAHOO.namespace("example.container");
function initEditorSubGrupos()
{
	core_ativaBotaoAdicionaLinha("../php/menutemas.php?funcao=alteraSubGrupos","adicionaNovoSubGrupo","pegaSubGrupos_S")
	pegaSubGrupos_S()
}
function pegaSubGrupos_S()
{
	core_carregando("ativa");
	core_pegaDados("buscando sub-grupos...","../php/menutemas.php?funcao=pegaSubGrupos","montaTabela_S")
}
function montaTabela_S(dados)
{
    YAHOO.example.InlineCellEditing = new function()
    {
        // Custom formatter for "address" column to preserve line breaks
        var formatTexto = function(elCell, oRecord, oColumn, oData)
        {
            elCell.innerHTML = "<p style=width:250px;cursor:pointer title='clique para editar'>" + oData + "</p>";
        };
        var formatTextoId = function(elCell, oRecord, oColumn, oData)
        {
            elCell.innerHTML = "<p style=width:20px >" + oData + "</p>";
        };

        var formatSalva = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div title='salva' class=aplicar style='text-align:center' onclick='gravaLinha_S(\""+oRecord._sId+"\")'></div>";
        };
        var formatExclui = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div title='exclui' class=excluir style='text-align:center' ></div>";
        };
        var myColumnDefs = [
            {key:"excluir",label:"excluir",formatter:formatExclui},
            {label:"salvar",formatter:formatSalva},
            {label:"id",key:"id_subgrupo", formatter:formatTextoId},
			{label:"nome",resizeable:true,key:"nome_subgrupo", formatter:formatTexto, editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"descrição",resizeable:true,key:"desc_subgrupo", formatter:formatTexto, editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"en",resizeable:true,key:"en", formatter:formatTexto, editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"es",resizeable:true,key:"es", formatter:formatTexto, editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"it",resizeable:true,key:"it", formatter:formatTexto, editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})}
        ];
        myDataSource = new YAHOO.util.DataSource(dados);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema =
        {
            fields: ["it","es","en","desc_subgrupo","id_subgrupo","nome_subgrupo"]
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
				excluiLinha_S(record.getData('id_subgrupo'),target);
			}
			else
			{this.onEventShowCellEditor(ev);}
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
        myDataTable.subscribe("editorSaveEvent", function(oArgs)
        {
			if(oArgs.newData != oArgs.oldData)
			var linha = myDataTable.getTrEl(oArgs.editor.getRecord())
			linha.style.color = "blue";
			linha.style.textDecoration = "blink";
        });

    };
    core_carregando("desativa");
}
function gravaLinha_S(row)
{
	var r = myDataTable.getRecordSet().getRecord(row);
	var id_subgrupo = r.getData("id_subgrupo");
	var nome_subgrupo = r.getData("nome_subgrupo");
	var desc_subgrupo = r.getData("desc_subgrupo");
	var en = r.getData("en");
	var es = r.getData("es");
	var it = r.getData("it");
	core_carregando("ativa");
	var mensagem = " gravando registro do id= "+id_subgrupo;
	var sUrl = "../php/menutemas.php?funcao=alteraSubGrupos&nome="+nome_subgrupo+"&desc="+desc_subgrupo+"&id="+id_subgrupo+"&en="+en+"&es="+es+"&it="+it;
	core_gravaLinha(mensagem,row,sUrl,"pegaSubGrupos_S")
}
function excluiLinha_S(id,row)
{
	var mensagem = " excluindo o registro do id= "+id;
	var sUrl = "../php/menutemas.php?funcao=excluirRegistro&id="+id+"&tabela=subgrupos";
	core_excluiLinha(sUrl,row,mensagem)
}
//YAHOO.util.Event.addListener(window, "load", initMenu);