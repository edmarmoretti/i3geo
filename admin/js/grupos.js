//YAHOO.namespace("example.container");
function initEditorGrupos()
{
	core_ativaBotaoAdicionaLinha("../php/menutemas.php?funcao=alteraGrupos","adicionaNovoGrupo","pegaGrupos_G")
	pegaGrupos_G()
}
function pegaGrupos_G()
{
	core_carregando("ativa");
	core_pegaDados("buscando grupos...","../php/menutemas.php?funcao=pegaGrupos","montaTabela_G")
}
function montaTabela_G(dados)
{
    YAHOO.example.InlineCellEditing = new function()
    {
        // Custom formatter for "address" column to preserve line breaks
        var formatTexto = function(elCell, oRecord, oColumn, oData)
        {
            elCell.innerHTML = "<p style=width:250px >" + oData + "</p>";
        };
        var formatTextoId = function(elCell, oRecord, oColumn, oData)
        {
            elCell.innerHTML = "<p style=width:20px >" + oData + "</p>";
        };

        var formatSalva = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div class=aplicar style='text-align:center' onclick='gravaLinha_G(\""+oRecord._sId+"\")'></div>";
        };
        var formatExclui = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div class=excluir style='text-align:center' ></div>";
        };
        var myColumnDefs = [
            {key:"excluir",label:"excluir",formatter:formatExclui},
            {label:"salvar",formatter:formatSalva},
            {label:"id",key:"id_grupo", formatter:formatTextoId},
			{label:"nome",resizeable:true,key:"nome_grupo", formatter:formatTexto, editor:"textbox"},
			{label:"descrição",resizeable:true,key:"desc_grupo", formatter:formatTexto, editor:"textbox"}
        ];
        myDataSource = new YAHOO.util.DataSource(dados);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema =
        {
            fields: ["desc_grupo","id_grupo","nome_grupo"]
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
				excluiLinha_G(record.getData('id_grupo'),target);
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
function gravaLinha_G(row)
{
	var r = myDataTable.getRecordSet().getRecord(row);
	var id_grupo = r.getData("id_grupo");
	var nome_grupo = r.getData("nome_grupo");
	var desc_grupo = r.getData("desc_grupo");
	core_carregando("ativa");
	var mensagem = " gravando registro do id= "+id_grupo;
	var sUrl = "../php/menutemas.php?funcao=alteraGrupos&nome="+nome_grupo+"&desc="+desc_grupo+"&id="+id_grupo;
	core_gravaLinha(mensagem,row,sUrl,"pegaGrupos_G")
}
function excluiLinha_G(id,row)
{
	var mensagem = " excluindo o registro do id= "+id;
	var sUrl = "../php/menutemas.php?funcao=excluirRegistro&id="+id+"&tabela=grupos";
	core_excluiLinha(sUrl,row,mensagem)
}
//YAHOO.util.Event.addListener(window, "load", initMenu);