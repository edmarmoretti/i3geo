/*
Title: grupos.js

Fun&ccedil;&otilde;es que controlam a interface do editor de grupos

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

i3geo/admin/js/grupos.js
*/
/*
Function: initEditorGrupos

Inicializa o editor

<ALTERAGRUPOS>
*/
function initEditorGrupos()
{
	core_ativaBotaoAdicionaLinha("../php/menutemas.php?funcao=alteraGrupos","adicionaNovoGrupo","pegaGrupos_G");
	pegaGrupos_G();
}
/*
Function: pegaGrupos_G

Obt&eacute;m a lista de grupos

<PEGAGRUPOS>
*/
function pegaGrupos_G()
{
	dados_G = "";
	core_carregando("ativa");
	core_pegaDados("buscando grupos...","../php/menutemas.php?funcao=pegaGrupos","montaTabela_G");
}
function filtraDadosLetras_G(letra){
	var i,temp,
		n = dados_G.length,
		novo = [];
	if(letra == "Todos"){
		novo = dados_G;
	}
	else{
		for(i=0;i<n;i++){
			temp = dados_G[i].nome_grupo;
			if(temp.charAt(0).toUpperCase() == letra.toUpperCase()){
				novo.push(dados_G[i]);
			}
		}
	}
	montaTabela_G(novo);
}
function montaTabela_G(dados)
{
    if(dados_G == ""){
    	dados_G = dados;
    }
    core_listaDeLetras("letras_G","filtraDadosLetras_G");
	YAHOO.example.InlineCellEditing = new function()
    {
        // Custom formatter for "address" column to preserve line breaks
        var formatTexto = function(elCell, oRecord, oColumn, oData)
        {
            if(oData === ""){
				oData = "<span style='color:gray' >Clique para editar, tecle enter e depois salve</span>";
			}
			elCell.innerHTML = "<p style=width:250px;cursor:pointer title='clique para editar'>" + oData + "</p>";
        };
        var formatTextoId = function(elCell, oRecord, oColumn, oData)
        {
            elCell.innerHTML = "<p style=width:20px >" + oData + "</p>";
        };
        var formatSalva = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div title='salva' class=salvar style='text-align:center' onclick='gravaLinha_G(\""+oRecord._sId+"\")'></div>";
        };
        var formatExclui = function(elCell, oRecord, oColumn)
        {
            elCell.innerHTML = "<div title='exclui' class=excluir style='text-align:center' ></div>";
        };
        var myColumnDefs = [
            {key:"excluir",label:"excluir",formatter:formatExclui},
            {label:"salvar",formatter:formatSalva},
            {label:"id",key:"id_grupo", formatter:formatTextoId},
			{label:"nome",resizeable:true,key:"nome_grupo", formatter:formatTexto, editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"descri&ccedil;&atilde;o",resizeable:true,key:"desc_grupo", formatter:formatTexto, editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"en",resizeable:true,key:"en", formatter:formatTexto, editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"es",resizeable:true,key:"es", formatter:formatTexto, editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
			{label:"it",resizeable:true,key:"it", formatter:formatTexto, editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})}
        ];
        myDataSource = new YAHOO.util.DataSource(dados);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema =
        {
            fields: ["it","es","en","desc_grupo","id_grupo","nome_grupo"]
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
			if(YAHOO.admin.container.panelCK)
			{
				YAHOO.admin.container.panelCK.destroy();
				YAHOO.admin.container.panelCK = null;
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
			if(oArgs.newData != oArgs.oldData){
				var linha = myDataTable.getTrEl(oArgs.editor.getRecord());
				if(linha){
					linha.style.color = "blue";
					linha.style.textDecoration = "blink";
				}
			}
        });
    };
    core_carregando("desativa");
}
/*
Function: gravaLinha_G

Aplica as altera&ccedil;&otilde;es feitas em um registro

<ALTERAGRUPOS>
*/
function gravaLinha_G(row)
{
	var r = myDataTable.getRecordSet().getRecord(row);
	var id_grupo = r.getData("id_grupo");
	var nome_grupo = r.getData("nome_grupo");
	var desc_grupo = r.getData("desc_grupo");
	var en = r.getData("en");
	var es = r.getData("es");
	var it = r.getData("it");
	core_carregando("ativa");
	var mensagem = " gravando registro do id= "+id_grupo;
	var sUrl = "../php/menutemas.php?funcao=alteraGrupos&nome="+nome_grupo+"&desc="+desc_grupo+"&id="+id_grupo+"&en="+en+"&es="+es+"&it="+it;
	core_gravaLinha(mensagem,row,sUrl,"pegaGrupos_G");
}
function excluiLinha_G(id,row)
{
	var mensagem = " excluindo o registro do id= "+id;
	var sUrl = "../php/menutemas.php?funcao=excluirRegistro&id="+id+"&tabela=grupos";
	core_excluiLinha(sUrl,row,mensagem);
}
//YAHOO.util.Event.addListener(window, "load", initMenu);