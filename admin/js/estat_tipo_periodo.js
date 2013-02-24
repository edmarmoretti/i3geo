if(typeof(i3GEOadmin) === 'undefined'){
	var i3GEOadmin = {};
}
i3GEOadmin.periodo = {
	letra: "",
	dados: "",
	dataTable: null,
	colunas: ["codigo_tipo_periodo","nome","descricao"],
	formatTexto: function(elCell, oRecord, oColumn, oData){
		if(oData === ""){
			oData = "<span style='color:gray' ></span>";
		}
		elCell.innerHTML = "<pre ><p style=cursor:default >" + oData + "</pre>";
	},
	formatExclui: function(elCell, oRecord, oColumn){
		elCell.innerHTML = "<div title='exclui' class=excluir style='text-align:center' ></div>";
	},
	formatMais: function(elCell, oRecord, oColumn){
		elCell.innerHTML = "<div class=editar style='text-align:center' ></div>";
	},
	defColunas: function(){
		return [
			{key:"excluir",label:"excluir",formatter:i3GEOadmin.periodo.formatExclui},
			{key:"mais",label:"editar",formatter:i3GEOadmin.periodo.formatMais},
			{label:"c&oacute;digo",key:"codigo_tipo_periodo", formatter:i3GEOadmin.periodo.formatTexto},
			{label:"Nome",resizeable:true,key:"nome", formatter:i3GEOadmin.periodo.formatTexto},
			{label:"Descricao",resizeable:true,key:"descricao", formatter:i3GEOadmin.periodo.formatTexto}
		];
	},
	/*
	 * Inicializa o menu
	 */
	inicia: function(){
		YAHOO.namespace("periodo");
		YAHOO.namespace("admin.container");
		core_ativaPainelAjuda("ajuda","botaoAjuda");
		core_ativaBotaoAdicionaLinha("../php/metaestat.php?funcao=alterarTipoPeriodo","adicionaNovaLinha","i3GEOadmin.periodo.obtem");
		i3GEOadmin.periodo.obtem();
	},
	/*
	 * Obt&eacute;m a lista de menus
	 */
	obtem: function(){
		i3GEOadmin.periodo.dados = "";
		core_carregando("ativa");
		core_pegaDados("buscando endere&ccedil;os...","../php/metaestat.php?funcao=listaTipoPeriodo","i3GEOadmin.periodo.tabela");
	},
	tabela: function(dados){
		if(i3GEOadmin.periodo.dados == ""){
			i3GEOadmin.periodo.dados = dados;
		}
		core_listaDeLetras("letras","i3GEOadmin.periodo.filtra");
		YAHOO.example.InlineCellEditing = new function(){
			// Custom formatter for "address" column to preserve line breaks
			var myDataSource = new YAHOO.util.DataSource(dados);
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			myDataSource.responseSchema = {
				fields: i3GEOadmin.periodo.colunas
			};
			//i3GEOadmin.periodo.dataTable = new YAHOO.widget.DataTable("tabela", i3GEOadmin.periodo.defColunas(), myDataSource);
			i3GEOadmin.periodo.dataTable = new YAHOO.widget.ScrollingDataTable("tabela", i3GEOadmin.periodo.defColunas(), myDataSource,{width:"100%"});
			i3GEOadmin.periodo.dataTable.subscribe('cellClickEvent',function(ev){
				var sUrl, callback,$clicouId, $recordid,
					target = YAHOO.util.Event.getTarget(ev),
					column = this.getColumn(target),
					registro = this.getRecord(target);
				if(YAHOO.periodo.panelCK)	{
					YAHOO.periodo.panelCK.destroy();
					YAHOO.periodo.panelCK = null;
				}
				if (column.key == 'excluir'){
					i3GEOadmin.periodo.exclui(registro.getData('codigo_tipo_periodo'),target);
				}
				if (column.key == 'mais'){
					core_carregando("ativa");
					core_carregando("buscando dados...");
					$clicouId = registro.getData('codigo_tipo_periodo');
					$recordid = registro.getId();
					sUrl = "../php/metaestat.php?funcao=listaTipoPeriodo&codigo_tipo_periodo="+$clicouId;
					callback = {
	  					success:function(o){
	  						try{
	  							i3GEOadmin.periodo.editor(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
	  						}
	  						catch(e){core_handleFailure(e,o.responseText);}
	  					},
	  					failure:core_handleFailure,
	  					argument: { foo:"foo", bar:"bar" }
					};
					core_makeRequest(sUrl,callback);
				}
			});
		};
		core_carregando("desativa");
	},
	editor: function(dados,id,recordid){
		function on_editorCheckBoxChange(p_oEvent){
			if(p_oEvent.newValue.get("value") == "OK"){
				i3GEOadmin.periodo.salva(id,recordid);
			}
			YAHOO.periodo.panelEditor2.destroy();
			YAHOO.periodo.panelEditor2 = null;
		};
		if(!$i("janela_editor2")){
			var editorBotoes,ins,
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
			YAHOO.periodo.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { modal:true,fixedcenter:true,close:false,width:"400px", height:"360px",overflow:"auto", visible:false,constraintoviewport:true } );
			YAHOO.periodo.panelEditor2.render();
		}
		YAHOO.periodo.panelEditor2.show();
		$i("editor_bd2").innerHTML = i3GEOadmin.periodo.formulario(dados);
		core_carregando("desativa");
	},
	formulario: function(i){
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
	},
	atualizaFiltro: function(dados){
		i3GEOadmin.periodo.dados = dados;
		i3GEOadmin.periodo.filtra(i3GEOadmin.periodo.letra);
	},
	filtra: function(letra){
		i3GEOadmin.periodo.letra = letra;
		if(i3GEOadmin.periodo.dados == ""){
			core_carregando("ativa");
			core_pegaDados("buscando endere&ccedil;os...","../php/metaestat.php?funcao=listaTipoPeriodo","i3GEOadmin.periodo.atualizaFiltro");
			return;
		}
		var i,temp,
			n = i3GEOadmin.periodo.dados.length,
			novo = [];
		if(letra == "Todos"){
			novo = i3GEOadmin.periodo.dados;
		}
		else{
			for(i=0;i<n;i++){
				temp = i3GEOadmin.periodo.dados[i].nome;
				if(temp.charAt(0).toUpperCase() == letra.toUpperCase()){
					novo.push(i3GEOadmin.periodo.dados[i]);
				}
			}
		}
		i3GEOadmin.periodo.tabela(novo);
	},
	exclui: function(id,row){
		var mensagem = " excluindo o registro do id= "+id,
			sUrl = "../php/metaestat.php?funcao=excluirTipoPeriodo&codigo_tipo_periodo="+id;
		core_excluiLinha(sUrl,row,mensagem,"",i3GEOadmin.periodo.dataTable);
		i3GEOadmin.periodo.dados = "";
	},
	salva: function(id,recordid){
		var i,c,sUrl, callback,
			campos = i3GEOadmin.periodo.colunas,
			par = "",
			n = campos.length;
		for (i=0;i<n;i++){
			c = $i("E"+campos[i].key);
			if(c){
				par += "&"+campos[i].key+"="+(c.value);
			}
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
	  					var rec = i3GEOadmin.periodo.dataTable.getRecordSet().getRecord(recordid);
	  					i3GEOadmin.periodo.dataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText));
	  					i3GEOadmin.periodo.dados = "";
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
};