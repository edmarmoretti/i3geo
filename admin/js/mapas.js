/*
Title: mapas.js

Funções que controlam a interface do editor de mapas

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

i3geo/admin/js/mapas.js
*/
YAHOO.namespace("example.container");
/*
Function: initMenu

Inicializa o editor

<ALTERARMAPA>
*/
function initMenu()
{
	core_ativaBotaoAdicionaLinha("../php/mapas.php?funcao=alterarMapa")
	core_carregando("ativa");
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	//core_pegaPerfis("pegaMapas()");
	pegaMapas();
}
/*
Function: pegaMapas

Obtém a lista de mapas

<PEGAMAPAS>
*/
function pegaMapas()
{
	core_pegaDados("buscando mapas...","../php/mapas.php?funcao=pegaMapas","montaTabela")
}
/*
Function: montaTabela

Monta a tabela com as opções de edição de cada registro

<PEGADADOSMAPA>
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
            {key:"mais",label:"mais",formatter:formatMais},
            {label:"id",key:"id_mapa", formatter:formatTextoId},
            {label:"nome",key:"nome_mapa", formatter:formatTextoId},
            {label:"ordem",key:"ordem_mapa", formatter:formatTextoId}
        ];
        myDataSource = new YAHOO.util.DataSource(dados);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema =
        {
            fields: ["id_mapa","nome_mapa","ordem_mapa"]
        };
        myDataTable = new YAHOO.widget.DataTable("tabela", myColumnDefs, myDataSource);
        // Set up editing flow
		myDataTable.subscribe('cellClickEvent',function(ev)
		{
			var target = YAHOO.util.Event.getTarget(ev);
			var column = this.getColumn(target);
			if (column.key == 'excluir')
			{
				var record = this.getRecord(target);
				excluiLinha(record.getData('id_mapa'),target);
			}
			if (column.key == 'mais')
			{
				var record = this.getRecord(target);
				core_carregando("ativa");
				core_carregando("buscando dados...");
				$clicouId = record.getData('id_mapa');
				$recordid = record.getId();
				var sUrl = "../php/mapas.php?funcao=pegaDadosMapa&id_mapa="+record.getData('id_mapa');
				var callback =
				{
  					success:function(o)
  					{
  						try
  						{
  							montaEditorMapa(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
  						}
  						catch(e){core_handleFailure(e,o.responseText);}
  					},
  					failure:core_handleFailure,
  					argument: { foo:"foo", bar:"bar" }
				}; 
				core_makeRequest(sUrl,callback)
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
function montaEditorMapa(dados,id,recordid)
{
	function on_editorCheckBoxChange(p_oEvent)
	{
		var ins = "";
		if(p_oEvent.newValue.get("value") == "OK")
		{
			gravaDadosMapa(id,recordid);
		}
		else
		{
			YAHOO.example.container.panelEditorMapa.destroy();
			YAHOO.example.container.panelEditorMapa = null;
		}
	};
	if(!YAHOO.example.container.panelEditorMapa)
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
		YAHOO.example.container.panelEditorMapa = new YAHOO.widget.Panel("janela_editor", { fixedcenter:true,close:false,width:"400px", height:"400px",overflow:"auto", visible:false,constraintoviewport:true } );
		YAHOO.example.container.panelEditorMapa.render();
	}
	YAHOO.example.container.panelEditorMapa.show();
	//carrega os dados na janela
	$i("editor_bd").innerHTML = montaDivMapas(dados[0])
	core_carregando("desativa");
	//
	//preenche a div com a lista de mapfiles e perfis
	//
	core_comboMapfiles("comboMapfiles","Etemas_mapa","",'registraMapfile(this.value,\"Etemas_mapa\")');
	core_comboPerfis("comboPerfis","Eperfil_mapa","","registraPerfil(this.value)");
}
function registraPerfil(valor)
{
	var inp = $i("Eperfil_mapa")
	var perfis = inp.value
	if(perfis == "")
	inp.value = valor
	else
	inp.value = perfis+" "+valor
}

function registraMapfile(valor,onde)
{
	var inp = $i(onde)
	var temas = inp.value
	if(temas == "")
	inp.value = valor
	else
	inp.value = temas+" "+valor
}
function montaDivMapas(i)
{
	var ins = ""

	//ins += "<p>Mapfile (código do mapfile que será utilizado para criar a camada no i3geo):"
	//ins += "<div id=comboMapfiles >Buscando...</div>";
	ins += "<p>Ordem de apresentação do mapa:<br>";
	ins += "<input size=10 type=text id=Eordem_mapa value='"+i.ordem_mapa+"' /></p>"

	ins += "<p>Nome do mapa:<br>";
	ins += "<input size=50 type=text id=Enome_mapa value='"+i.nome_mapa+"' /></p>"

	ins += "<p>Publicado?<br>"
	ins += "<select  id='Epublicado_mapa' >"
	ins += core_combosimnao(i.publicado_mapa)
	ins += "</select></p>"

	ins += "<p>Descrição:<br>";
	ins += "<input size=50 type=text id=Edesc_mapa value='"+i.desc_mapa+"' /></p>"

	ins += "<p>Extensão geográfica:<br>";
	ins += "<input size=50 type=text id=Eext_mapa value='"+i.ext_mapa+"' /></p>"

	ins += "<p>URL da imagem miniatura:<br>";
	ins += "<input size=50 type=text id=Eimagem_mapa value='"+i.imagem_mapa+"' /></p>"
	ins += "<img src='"+i.imagem_mapa+"' />"

	ins += "<p>Temas que serão incluídos nesse mapa (utilize os códigos dos mapfiles mostrados na lista abaixo): </p>"
	ins += "<input size=50 type=text id='Etemas_mapa' value='"+i.temas_mapa+"' /></p>"
	ins += "<div id=comboMapfiles >Buscando...</div>";

	ins += "<p>Temas que serão ligados. Devem constar na lista de temas incluídos: </p>"
	ins += "<input size=50 type=text id='Eligados_mapa' value='"+i.ligados_mapa+"' /></p>"
	//ins += "<div id=comboMapfilesLigados >Buscando...</div>";

	ins += "<p>Perfis que podem ver este mapa: </p>"
	ins += "<input size=50 type=text id='Eperfil_mapa' value='"+i.perfil_mapa+"' /></p>"
	ins += "<div id=comboPerfis >Buscando...</div>";

	ins += "<p>Outros parâmetros (separe com '&'):<br>";
	ins += "<input size=50 type=text id=Eoutros_mapa value='"+i.outros_mapa+"' /></p>"

	ins += "<p>Link direto para abertura do mapa (despreza os outros parâmetros):<br>";
	ins += "<input size=50 type=text id=Elinkdireto_mapa value='"+i.linkdireto_mapa+"' /></p>"
	ins += "<br><br><br>"
	return(ins)
}
function excluiLinha(id,row)
{
	var mensagem = " excluindo o registro do id= "+id;
	var sUrl = "../php/mapas.php?funcao=excluirMapa&id="+id;
	core_excluiLinha(sUrl,row,mensagem)
}
/*
Function: gravaDadosMapa

Aplica as alterações feitas em um mapa

<ALTERARMAPA>
*/
function gravaDadosMapa(id,recordid)
{
	var campos = new Array("publicado","ordem","perfil","ligados","temas","desc","ext","imagem","linkdireto","nome","outros")
	var par = ""
	for (i=0;i<campos.length;i++)
	{
		par += "&"+campos[i]+"_mapa="+($i("E"+campos[i]+"_mapa").value)
	}
	par += "&id_mapa="+id
	core_carregando("ativa");
	core_carregando(" gravando o registro do id= "+id);
	var sUrl = "../php/mapas.php?funcao=alterarMapa"+par;
	var callback =
	{
  		success:function(o)
  		{
  			try
  			{
  				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")
  				{
  					core_carregando("<span style=color:red >Não foi possível excluir. Verifique se não existem víncilos com outros elementos</span>");
  					setTimeout("core_carregando('desativa')",3000)
  				}
  				else
  				{
  					var rec = myDataTable.getRecordSet().getRecord(recordid);
  					myDataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0])
  					core_carregando("desativa");
  				}
				YAHOO.example.container.panelEditorMapa.destroy();
				YAHOO.example.container.panelEditorMapa = null;
  			}
  			catch(e){core_handleFailure(e,o.responseText);}
  		},
  		failure:core_handleFailure,
  		argument: { foo:"foo", bar:"bar" }
	}; 
	core_makeRequest(sUrl,callback)
}
YAHOO.util.Event.addListener(window, "load", initMenu);