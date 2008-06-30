YAHOO.namespace("example.container");
function initMenu()
{
	ativaBotaoAdicionaGrupo()
	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	core_pegaPerfis("pegaGrupos()");
}
function ativaBotaoAdicionaGrupo()
{
	var adicionalinha = function()
	{
		core_carregando("ativa");
		core_carregando(" adicionando um novo registro");
		var sUrl = "../php/menutemas.php?funcao=alteraGrupos";
		var callback =
		{
  			success:function(o)
  			{
  				try
  				{
  					myDataTable.addRow(YAHOO.lang.JSON.parse(o.responseText)[0],0);
  					core_carregando("desativa");
  				}
  				catch(e){core_handleFailure(o,o.responseText);}
  			},
  			failure:core_handleFailure,
  			argument: { foo:"foo", bar:"bar" }
		}; 
		core_makeRequest(sUrl,callback)
	};
	//cria o botão de adição de um novo menu
	var adiciona = new YAHOO.widget.Button("adiciona",{ onclick: { fn: adicionalinha } });
}
function pegaGrupos()
{
	core_carregando("buscando grupos...");
	var sUrl = "../php/menutemas.php?funcao=pegaGrupos";
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{montaTabela(YAHOO.lang.JSON.parse(o.responseText));}
  			catch(e){core_handleFailure(o,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback)
}
function montaTabela(dados)
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
            elCell.innerHTML = "<div class=aplicar style='text-align:center' onclick='gravaLinha(\""+oRecord._sId+"\")'></div>";
        };
        var formatExclui = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div class=excluir style='text-align:center' ></div>";//onclick='excluiLinha(\""+oRecord.getData("id_menu")+"\",\""+oRecord.getId()+"\")'></div>";
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
				excluiLinha(record.getData('id_grupo'),target);
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
    };
    core_carregando("desativa");
}
function gravaLinha(row)
{
	var r = myDataTable.getRecordSet().getRecord(row);
	var id_grupo = r.getData("id_grupo");
	var nome_grupo = r.getData("nome_grupo");
	var desc_grupo = r.getData("desc_grupo");
	core_carregando("ativa");
	core_carregando(" gravando registro do id= "+id_grupo);
	var sUrl = "../php/menutemas.php?funcao=alteraGrupos&nome="+nome_grupo+"&desc="+desc_grupo+"&id="+id_grupo;
	var callback =
	{
  		success:function(o)
  		{
  			core_carregando("desativa");
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback)
}
function excluiLinha(id,row)
{
	//dialogo
	// Define various event handlers for Dialog
	var handleYes = function() {
		this.hide();
		core_carregando("ativa");
		core_carregando(" excluindo o registro do id= "+id);
		var sUrl = "../php/menutemas.php?funcao=excluirRegistro&id="+id+"&tabela=grupos";
		var callback =
		{
  			success:function(o)
  			{
  				try
  				{
  					if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
  					{
  						core_carregando("<span style=color:red >Não foi possível excluir. Verifique se não existem sub-grupos vinculados a este grupo</span>");
  						setTimeout("core_carregando('desativa')",3000)
  					}
  					else
  					{
  						myDataTable.deleteRow(row);
  						core_carregando("desativa");
  					}
  				}
  				catch(e){core_handleFailure(o,o.responseText);}
  			},
  			failure:core_handleFailure,
  			argument: { foo:"foo", bar:"bar" }
		}; 
		core_makeRequest(sUrl,callback)
	};
	var handleNo = function()
	{
		this.hide();
	};
	var mensagem = "Exclui o registro?";
	var largura = "300"
	core_dialogoContinua(handleYes,handleNo,mensagem,largura)	
}
YAHOO.util.Event.addListener(window, "load", initMenu);