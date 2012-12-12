function initEditor(){
	YAHOO.namespace("admin.container");
	core_ativaBotaoAdicionaLinha("../php/metaestat.php?funcao=alterarTipoRegiao","adicionaNovaLinha","pegaDados");
	pegaDados();
}
function pegaDados(){
	core_carregando("ativa");
	core_pegaDados("buscando dados...","../php/metaestat.php?funcao=listaTipoRegiao","montaTabela");
}
function pegaDadosAgregacoes(codigo_tipo_regiao){
	core_carregando("ativa");
	core_carregando("buscando dados...");
	sUrl = "../php/metaestat.php?funcao=listaAgregaRegiao&codigo_tipo_regiao="+codigo_tipo_regiao;
	callback = {
		success:function(o){
			try{
				iniciaEditorAgregacoes(YAHOO.lang.JSON.parse(o.responseText),codigo_tipo_regiao);
			}
			catch(e){core_handleFailure(e,o.responseText);}
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
function montaTabela(dados){
	YAHOO.namespace("editorregiao");
	YAHOO.editorregiao.InlineCellEditing = new function()	{
		// Custom formatter for "address" column to preserve line breaks
		var formatTexto = function(elCell, oRecord, oColumn, oData){
			if(oData === ""){
				oData = "<span style='color:gray' ></span>";
			}
			elCell.innerHTML = "<pre ><p>" + oData + "</pre>";
		},
		formatExclui = function(elCell, oRecord, oColumn){
			elCell.innerHTML = "<div class=excluir title='exclui' style='text-align:center' ></div>";
		},
		formatMais = function(elCell, oRecord, oColumn){
			elCell.innerHTML = "<div class=editar style='text-align:center' ></div>";
		},
		formatRel = function(elCell, oRecord, oColumn){
			elCell.innerHTML = "<div class=editar style='text-align:center' ></div>";
		},
		myColumnDefs = [
		                {key:"excluir",label:"excluir",formatter:formatExclui},
		                {key:"rel",label:"agrega&ccedil;&otilde;es",formatter:formatRel},
		                {key:"mais",label:"editar",formatter:formatMais},
		                {label:"c&oacute;digo",key:"codigo_tipo_regiao", formatter:formatTexto},
		                {label:"Nome",resizeable:true,key:"nome_tipo_regiao", formatter:formatTexto},
		                {label:"Descri&ccedil;&atilde;o",resizeable:true,key:"descricao_tipo_regiao", formatter:formatTexto},
		                {label:"Esquema",key:"esquemadb",formatter:formatTexto},
		                {label:"Tabela",key:"tabela",formatter:formatTexto},
		                {label:"Coluna geo",key:"colunageo",formatter:formatTexto},
		                {label:"Centr&oacute;ide",key:"colunacentroide",formatter:formatTexto},
		                {label:"Data",key:"data",formatter:formatTexto},
		                {label:"C&oacute;digo",key:"identificador",formatter:formatTexto},
		                {label:"Conexão",key:"codigo_estat_conexao",formatter:formatTexto},
		                {label:"Nomes das regi&otilde;es",resizeable:false,key:"colunanomeregiao",formatter:formatTexto},
		                {label:"Colunas vis&iacute;veis (separa com v&iacute;rgula)",resizeable:false,key:"colunasvisiveis",formatter:formatTexto},
		                {label:"Apelidos das colunas vis&iacute;veis (separa com v&iacute;rgula)",resizeable:false,key:"apelidos",formatter:formatTexto},
		                {label:"SRID",key:"srid",formatter:formatTexto}
		                ];
		myDataSource = new YAHOO.util.DataSource(dados);
		myDataTable = new YAHOO.widget.DataTable("tabela", myColumnDefs, myDataSource);

		myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
		myDataSource.responseSchema = {
				fields: ["codigo_tipo_regiao","nome_tipo_regiao","descricao_tipo_regiao","esquemadb","tabela","colunageo","colunacentroide","data","identificador","codigo_estat_conexao","colunanomeregiao","colunasvisiveis","apelidos","srid"]
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
					excluiLinha(record.getData('codigo_tipo_regiao'),target);
				}
				if (column.key == 'mais'){
					record = this.getRecord(target);
					core_carregando("ativa");
					core_carregando("buscando dados...");
					$clicouId = record.getData('codigo_tipo_regiao');
					$recordid = record.getId();
					sUrl = "../php/metaestat.php?funcao=listaTipoRegiao&codigo_tipo_regiao="+record.getData('codigo_tipo_regiao');
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
				if (column.key == 'rel'){
					record = this.getRecord(target);
					$clicouId = record.getData('codigo_tipo_regiao');
					$recordid = record.getId();
					pegaDadosAgregacoes(record.getData('codigo_tipo_regiao'));
				}
			}
		);
	};
	core_carregando("desativa");
}
function iniciaEditorAgregacoes(dados,codigo_tipo_regiao){
	core_carregando("desativa");
	//if($i("editor_bd")){return;}
	core_montaEditor("","550px","250px","","Agrega&ccedil;&otilde;es");
	$i("editor_bd").innerHTML = '<p class=paragrafo ><p class=paragrafo ><input type=button id=adicionaNovaAgregacao value="Adicionar nova rela&ccedil;&atilde;o" style="left:-5px;" /></p><p><br><br><div id="tabelaAgrega" style="left:-5px;"> </div>';
	core_ativaBotaoAdicionaLinha("../php/metaestat.php?funcao=alteraAgregaRegiao&codigo_tipo_regiao="+codigo_tipo_regiao,"adicionaNovaAgregacao","pegaDadosAgregacoes('"+codigo_tipo_regiao+"')");
	montaTabelaAgregacoes(dados);
}
function montaTabelaAgregacoes(dados){
	YAHOO.namespace("editoragregacoes");
	YAHOO.editoragregacoes.InlineCellEditing = new function()	{
		// Custom formatter for "address" column to preserve line breaks
		var formatTexto = function(elCell, oRecord, oColumn, oData){
			if(oData === ""){
				oData = "<span style='color:gray' ></span>";
			}
			elCell.innerHTML = "<pre ><p>" + oData + "</pre>";
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
		{label:"c&oacute;digo",key:"id_agregaregiao", formatter:formatTexto},
		{label:"Tipo de limite",resizeable:true,key:"codigo_tipo_regiao", formatter:formatTexto},
		{label:"Pai",resizeable:true,key:"codigo_tipo_regiao_pai", formatter:formatTexto},
		{label:"Coluna de ligacao",key:"colunaligacao_regiaopai",formatter:formatTexto}
		];
		myDataSource = new YAHOO.util.DataSource(dados);
		myDataTable = new YAHOO.widget.DataTable("tabelaAgrega", myColumnDefs, myDataSource);
		myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
		myDataSource.responseSchema = {
			fields: ["id_agregaregiao","codigo_tipo_regiao","codigo_regiao_pai","colunaligacao_regiaopai"]
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
					excluiLinhaAgregacao(record.getData('id_agregaregiao'),target);
				}
				if (column.key == 'mais'){
					record = this.getRecord(target);
					core_carregando("ativa");
					core_carregando("buscando dados...");
					$clicouId = record.getData('id_agregaregiao');
					$recordid = record.getId();
					sUrl = "../php/metaestat.php?funcao=listaAgregaRegiao&id_agregaregiao="+$clicouId;
					callback = {
							success:function(o){
								try{
									montaEditorAgregacoes(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
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
function montaEditorAgregacoes(dados,id,recordid){
	function on_editorCheckBoxChange(p_oEvent){
		if(p_oEvent.newValue.get("value") == "OK"){
			gravaDadosAgregacoes(id,recordid);
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
		YAHOO.admin.container.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { fixedcenter:true,close:false,width:"400px", height:"280px",overflow:"auto", visible:false,constraintoviewport:true } );
		YAHOO.admin.container.panelEditor2.render();
	}
	YAHOO.admin.container.panelEditor2.show();
	$i("editor_bd2").innerHTML = montaDivAgregacoes(dados);
	core_carregando("desativa");
}
function montaDiv(i){
	var param = {
			"linhas":[
			{titulo:"Nome:",id:"Enome_tipo_regiao",size:"50",value:i.nome_tipo_regiao,tipo:"text",div:""},
			{titulo:"Descri&ccedil;&atilde;o:",id:"Edescricao_tipo_regiao",size:"50",value:i.descricao_tipo_regiao,tipo:"text",div:""},
			{titulo:"Esquema no banco de dados:",id:"Eesquemadb",size:"50",value:i.esquemadb,tipo:"text",div:""},
			{titulo:"Tabela:",id:"Etabela",size:"50",value:i.tabela,tipo:"text",div:""},
			{titulo:"Coluna com a geometria principal (normalmente poligonal):",id:"Ecolunageo",size:"50",value:i.colunageo,tipo:"text",div:""},
			{titulo:"Coluna com pontos (pode ser a mesmo que a anterior):",id:"Ecolunacentroide",size:"50",value:i.colunacentroide,tipo:"text",div:""},
			{titulo:"Data a qual se referem os dados:",id:"Edata",size:"50",value:i.data,tipo:"text",div:""},
			{titulo:"Coluna com o c&oacute;digo de cada registro:",id:"Eidentificador",size:"50",value:i.identificador,tipo:"text",div:""},
			{titulo:"C&oacute;digo da conex&atilde;o com o banco:",id:"Ecodigo_estat_conexao",size:"50",value:i.codigo_estat_conexao,tipo:"text",div:""},
			{titulo:"Coluna com o nome ddo limite geogr&aacute;fico:",id:"Ecolunanomeregiao",size:"50",value:i.colunanomeregiao,tipo:"text",div:""},
			{titulo:"Colunas que ficar&atilde;o vis&iacute;veis no mapa:",id:"Ecolunasvisiveis",size:"50",value:i.colunasvisiveis,tipo:"text",div:""},
			{titulo:"Apelidos das colunas que ficar&atilde;o vis&iacute;veis no mapa:",id:"Eapelidos",size:"50",value:i.apelidos,tipo:"text",div:""},
			{titulo:"C&oacute;digo SRID:",id:"Esrid",size:"50",value:i.srid,tipo:"text",div:""}
			]
		},
		ins = "";

	ins += core_geraLinhas(param);
	return(ins);
}
function montaDivAgregacoes(i){
	var param = {
			"linhas":[
			{titulo:"C&oacute;digo do limite geogr&aacute;fico de n&iacute;vel superior:",id:"Ecodigo_tipo_regiao_pai",size:"50",value:i.codigo_tipo_regiao_pai,tipo:"text",div:""},
			{titulo:"Coluna na tabela do limite geogr&aacute;fico de n&iacute;vel inferior que permite a liga&ccedil;&atilde;o:",id:"Ecolunaligacao_regiaopai",size:"50",value:i.colunaligacao_regiaopai,tipo:"text",div:""}
			]
		},
		ins = "";
	ins += core_geraLinhas(param);
	return(ins);
}

function gravaDados(id,recordid){
	var campos = new Array("codigo_estat_conexao","nome_tipo_regiao","descricao_tipo_regiao","esquemadb","tabela","colunageo","colunacentroide","data","identificador","colunanomeregiao","srid","colunasvisiveis","apelidos"),
		par = "",
		i = 0,
		sUrl,callback;

	for (i=0;i<campos.length;i++){
		par += "&"+campos[i]+"="+($i("E"+campos[i]).value);
	}
	par += "&codigo_tipo_regiao="+id;
	core_carregando("ativa");
	core_carregando(" gravando o registro do id= "+id);
	sUrl = "../php/metaestat.php?funcao=alterarTipoRegiao"+par;
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
function gravaDadosAgregacoes(id,recordid){
	var campos = new Array("codigo_tipo_regiao_pai","colunaligacao_regiaopai"),
		par = "",
		i = 0,
		sUrl,callback;

	for (i=0;i<campos.length;i++){
		par += "&"+campos[i]+"="+($i("E"+campos[i]).value);
	}
	par += "&id_agregaregiao="+id;
	core_carregando("ativa");
	core_carregando(" gravando o registro do id= "+id);
	sUrl = "../php/metaestat.php?funcao=alteraAgregaregiao"+par;
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
		sUrl = "../php/metaestat.php?funcao=excluirTipoRegiao&codigo_tipo_regiao="+id;
	core_excluiLinha(sUrl,row,mensagem);
}
function excluiLinhaAgregacao(id,row){
	var mensagem = " excluindo o registro do id= "+id,
		sUrl = "../php/metaestat.php?funcao=excluirAgregaRegiao&id_agregaregiao="+id;
	core_excluiLinha(sUrl,row,mensagem);
}
//YAHOO.util.Event.addListener(window, "load", initMenu);