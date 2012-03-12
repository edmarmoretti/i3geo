/*
Title: perfis.js

Funções que controlam a interface do editor de perfis

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

i3geo/admin/js/perfis.js
*/
YAHOO.namespace("example.container");
/*
Function: initMenu

Inicializa o editor

<ALTERAPERFIS>
*/
function initMenu()
{
	core_ativaBotaoAdicionaLinha("../php/menutemas.php?funcao=alteraPerfis");
	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	pegaPerfis();
}
/*
Function: pegaPerfis

Obtém a lista de perfis

<PEGAPERFIS>
*/
function pegaPerfis()
{
	core_pegaDados("buscando perfis...","../php/menutemas.php?funcao=pegaPerfis","montaTabela");
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
            elCell.innerHTML = "<div class=salvar style='text-align:center' onclick='gravaLinha(\""+oRecord._sId+"\")'></div>";
        };
        var formatExclui = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div class=excluir style='text-align:center' ></div>";
        };
        var myColumnDefs = [
            {key:"excluir",label:"excluir",formatter:formatExclui},
            {label:"salvar",formatter:formatSalva},
            {label:"id",key:"id_perfil", formatter:formatTextoId},
			{label:"nome",resizeable:true,key:"perfil", formatter:formatTexto, editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})}
        ];
        myDataSource = new YAHOO.util.DataSource(dados);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema =
        {
            fields: ["id_perfil","perfil"]
        };
        myDataTable = new YAHOO.widget.DataTable("tabela", myColumnDefs, myDataSource);
        // Set up editing flow
        myDataTable.highlightEditableCell = function(oArgs)
        {
            var elCell = oArgs.target;
            var column = myDataTable.getColumn(oArgs.target);
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
				excluiLinha(record.getData('id_perfil'),target);
			}
			else
			{
				this.onEventShowCellEditor(ev);
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
        myDataTable.subscribe("editorSaveEvent", function(oArgs)
        {
			if(oArgs.newData != oArgs.oldData){
				var linha = myDataTable.getTrEl(oArgs.editor.getRecord());
				linha.style.color = "blue";
				linha.style.textDecoration = "blink";
			}
        });
        
        myDataTable.subscribe("editorBlurEvent", function(oArgs)
        {
            this.cancelCellEditor();
        });
    };
    core_carregando("desativa");
}
/*
Function: gravaLinha

Aplica as alterações feitas em um perfil

<ALTERAPERFIS>
*/
function gravaLinha(row)
{
	var r = myDataTable.getRecordSet().getRecord(row);
	var id_perfil = r.getData("id_perfil");
	var perfil = r.getData("perfil");
	core_carregando("ativa");
	var mensagem = " gravando registro do id= "+id_perfil;
	var sUrl = "../php/menutemas.php?funcao=alteraPerfis&perfil="+perfil+"&id="+id_perfil;
	core_gravaLinha(mensagem,row,sUrl);
}
function excluiLinha(id,row)
{
	var mensagem = " excluindo o registro do id= "+id;
	var sUrl = "../php/menutemas.php?funcao=excluirRegistro&id="+id+"&tabela=perfis";
	core_excluiLinha(sUrl,row,mensagem);
}
YAHOO.util.Event.addListener(window, "load", initMenu);