function initEditor(){
	YAHOO.namespace("admin.container");
	core_ativaBotaoAdicionaLinha("../php/metaestat.php?funcao=alterarConexao","adicionaNovaLinha","pegaDados");
	pegaDados();
}
function pegaDados(){
	core_carregando("ativa");
	core_pegaDados("buscando dados...","../php/metaestat.php?funcao=listaConexao","montaTabela");
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
		formatSenha = function(elCell, oRecord, oColumn){
			elCell.innerHTML = "a senha deve ser editada<br>diretamente no banco de dados";
		},
		myColumnDefs = [
		                {key:"excluir",label:"excluir",formatter:formatExclui},
		                {key:"mais",label:"editar",formatter:formatMais},
		                {label:"c&oacute;digo",key:"codigo_estat_conexao", formatter:formatTexto},
		                {label:"Banco de dados",resizeable:true,key:"bancodedados", formatter:formatTexto},
		                {label:"Host",resizeable:true,key:"host", formatter:formatTexto},
		                {label:"Porta",key:"porta",formatter:formatTexto},
		                {label:"Usu&aacute;rio",key:"usuario",formatter:formatTexto},
   		                {label:"Senha",key:"senha",formatter:formatSenha}
		                ];
		myDataSource = new YAHOO.util.DataSource(dados);
		myDataTable = new YAHOO.widget.DataTable("tabela", myColumnDefs, myDataSource);

		myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
		myDataSource.responseSchema = {
				fields: ["codigo_estat_conexao","bancodedados","host","porta","usuario","senha"]
		};
		myDataTable.subscribe(
			'cellClickEvent',
			function(ev){
				var record,$clicouId,$recordid,sUrl,callback,
				target = YAHOO.util.Event.getTarget(ev),
				column = this.getColumn(target);
				if(YAHOO.admin.container.panelCK){
					YAHOO.admin.container.panelCK.destroy();
					YAHOO.admin.container.panelCK = null;
				}
				if (column.key == 'excluir'){
					record = this.getRecord(target);
					excluiLinha(record.getData('codigo_estat_conexao'),target);
				}
				if (column.key == 'mais'){
					record = this.getRecord(target);
					core_carregando("ativa");
					core_carregando("buscando dados...");
					$clicouId = record.getData('codigo_estat_conexao');
					$recordid = record.getId();
					sUrl = "../php/metaestat.php?funcao=listaConexao&codigo_estat_conexao="+record.getData('codigo_estat_conexao');
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
		YAHOO.admin.container.panelEditor2.destroy();
		YAHOO.admin.container.panelEditor2 = null;
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
		YAHOO.admin.container.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { fixedcenter:true,close:false,width:"400px", height:"380px",overflow:"auto", visible:false,constraintoviewport:true } );
		YAHOO.admin.container.panelEditor2.render();
	}
	YAHOO.admin.container.panelEditor2.show();
	$i("editor_bd2").innerHTML = montaDiv(dados);
	core_carregando("desativa");
}
function montaDiv(i){
	var param = {
			"linhas":[
			{titulo:"Banco de dados:",id:"Ebancodedados",size:"50",value:i.bancodedados,tipo:"text",div:""},
			{titulo:"Servidor:",id:"Ehost",size:"50",value:i.host,tipo:"text",div:""},
			{titulo:"Porta:",id:"Eporta",size:"50",value:i.porta,tipo:"text",div:""},
			{titulo:"Usu&aacute;rio:",id:"Eusuario",size:"50",value:i.usuario,tipo:"text",div:""}
			]
		},
		ins = "";

	ins += core_geraLinhas(param);
	return(ins);
}

function gravaDados(id,recordid){
	var campos = new Array("bancodedados","host","porta","usuario"),
		par = "",
		i = 0,
		sUrl,callback;

	for (i=0;i<campos.length;i++){
		par += "&"+campos[i]+"="+($i("E"+campos[i]).value);
	}
	par += "&codigo_estat_conexao="+id;
	core_carregando("ativa");
	core_carregando(" gravando o registro do id= "+id);
	sUrl = "../php/metaestat.php?funcao=alterarConexao"+par;
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
		sUrl = "../php/metaestat.php?funcao=excluirConexao&codigo_estat_conexao="+id;
	core_excluiLinha(sUrl,row,mensagem);
}
//YAHOO.util.Event.addListener(window, "load", initMenu);