function initEditor(){
	YAHOO.namespace("example.container");
	core_ativaBotaoAdicionaLinha("../php/metaestat.php?funcao=alterarTipoPeriodo","adicionaNovaLinha","pegaDados");
	pegaDados();
}
function pegaDados(){
	core_carregando("ativa");
	core_pegaDados("buscando dados...","../php/metaestat.php?funcao=listaTipoPeriodo","montaTabela");
}
function montaTabela(dados){
	YAHOO.example.InlineCellEditing = new function()	{
		// Custom formatter for "address" column to preserve line breaks
		var formatTexto = function(elCell, oRecord, oColumn, oData){
			if(oData === ""){
				oData = "<span style='color:gray' ></span>";
			}
			elCell.innerHTML = "<pre ><p style=cursor:pointer title='clique para editar'>" + oData + "</pre>";
		},
		formatExclui = function(elCell, oRecord, oColumn){
			elCell.innerHTML = "<div class=excluir title='exclui' style='text-align:center' ></div>";
		},
		formatMais = function(elCell, oRecord, oColumn){
			elCell.innerHTML = "<div class=editar style='text-align:center' ></div>";
		},
		myColumnDefs = [
		                {key:"excluir",label:"excluir",formatter:formatExclui},
		                {key:"mais",label:"editar",formatter:formatMais},
		                {label:"c&oacute;digo",key:"codigo_tipo_periodo", formatter:formatTexto},
		                {label:"Nome",resizeable:true,key:"nome", formatter:formatTexto,editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
		                {label:"Descricao",resizeable:true,key:"descricao", formatter:formatTexto,editor:new YAHOO.widget.TextboxCellEditor({disableBtns:true})}
		                ];
		myDataSource = new YAHOO.util.DataSource(dados);
		myDataTable = new YAHOO.widget.DataTable("tabela", myColumnDefs, myDataSource);

		myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
		myDataSource.responseSchema = {
				fields: ["codigo_tipo_periodo","nome","descricao"]
		};
		myDataTable.subscribe(
			'cellClickEvent',
			function(ev){
				var record,$clicouId,$recordid,sUrl,callback,
				target = YAHOO.util.Event.getTarget(ev),
				column = this.getColumn(target);
				if(YAHOO.example.container.panelCK){
					YAHOO.example.container.panelCK.destroy();
					YAHOO.example.container.panelCK = null;
				}
				if (column.key == 'excluir'){
					record = this.getRecord(target);
					excluiLinha(record.getData('codigo_tipo_periodo'),target);
				}
				if (column.key == 'mais'){
					record = this.getRecord(target);
					core_carregando("ativa");
					core_carregando("buscando dados...");
					$clicouId = record.getData('codigo_tipo_periodo');
					$recordid = record.getId();
					sUrl = "../php/metaestat.php?funcao=listaTipoPeriodo&codigo_tipo_periodo="+record.getData('codigo_tipo_periodo');
					callback = {
							success:function(o){
								try{
									montaEditor(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
								}
								catch(e){core_handleFailure(e,o.responseText);}
							},
							failure:core_handleFailure,
							argument: { foo:"foo", bar:"bar" }
					};
					core_makeRequest(sUrl,callback);
				}
			}
		);
	};
	core_carregando("desativa");
}
function montaEditor(dados,id,recordid){
	function on_editorCheckBoxChange(p_oEvent){
		if(p_oEvent.newValue.get("value") == "OK"){
			gravaDados(id,recordid);
		}
		YAHOO.example.container.panelEditor2.destroy();
		YAHOO.example.container.panelEditor2 = null;
	};
	if(!$i("janela_editor2")){
		var ins,editorBotoes,
			novoel = document.createElement("div");

		novoel.id =  "janela_editor2";
		ins = '<div class="hd">Editor</div>';
		ins += "<div class='bd' style='height:354px;overflow:auto'>";
		ins += "<div id='okcancel_checkbox2'></div><div id='editor_bd2'></div>";
		novoel.innerHTML = ins;
		document.body.appendChild(novoel);
		editorBotoes = new YAHOO.widget.ButtonGroup({id:"okcancel_checkbox_id2", name:  "okcancel_checkbox_id2", container:  "okcancel_checkbox2" });
		editorBotoes.addButtons([
		                         { label: "Salva", value: "OK", checked: false},
		                         { label: "Cancela", value: "CANCEL", checked: false }
		                         ]);
		editorBotoes.on("checkedButtonChange", on_editorCheckBoxChange);
		YAHOO.example.container.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { fixedcenter:true,close:false,width:"400px", height:"380px",overflow:"auto", visible:false,constraintoviewport:true } );
		YAHOO.example.container.panelEditor2.render();
	}
	YAHOO.example.container.panelEditor2.show();
	$i("editor_bd2").innerHTML = montaDiv(dados);
	core_carregando("desativa");
}
function montaDiv(i){
	var param = {
			"linhas":[{
				titulo:"Nome:",id:"Enome",size:"50",value:i.nome,tipo:"text",div:""
			},{
				titulo:"Descricao:",id:"Edescricao",size:"50",value:i.descricao,tipo:"text",div:""
			}]
		},
		ins = "";

	ins += core_geraLinhas(param);
	return(ins);
}

function gravaDados(id,recordid){
	var campos = new Array("nome","descricao"),
		par = "",
		i = 0,
		sUrl,callback;

	for (i=0;i<campos.length;i++){
		par += "&"+campos[i]+"="+($i("E"+campos[i]).value);
	}
	par += "&codigo_tipo_periodo="+id;
	core_carregando("ativa");
	core_carregando(" gravando o registro do id= "+id);
	sUrl = "../php/metaestat.php?funcao=alterarTipoPeriodo"+par;
	callback = {
			success:function(o){
				try	{
					if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
						core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem registros vinculados</span>");
						setTimeout("core_carregando('desativa')",3000);
					}
					else{
						var rec = myDataTable.getRecordSet().getRecord(recordid);
						myDataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText));
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
function excluiLinha(id,row){
	var mensagem = " excluindo o registro do id= "+id,
		sUrl = "../php/metaestat.php?funcao=excluirTipoPeriodo&codigo_tipo_periodo="+id;
	core_excluiLinha(sUrl,row,mensagem);
}
//YAHOO.util.Event.addListener(window, "load", initMenu);