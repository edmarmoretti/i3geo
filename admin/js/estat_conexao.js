if(typeof(i3GEOadmin) === 'undefined'){
	var i3GEOadmin = {};
}
i3GEOadmin.conexao = {
	dados: "",
	letra: "",
	dataTable: null,
	colunas: ["codigo_estat_conexao","bancodedados","host","porta","usuario","senha"],
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
	formatSenha: function(elCell, oRecord, oColumn){
		elCell.innerHTML = "a senha deve ser editada<br>diretamente no banco de dados";
	},
	defColunas: function(){
		return [
			{key:"excluir",label:"excluir",formatter:i3GEOadmin.conexao.formatExclui},
			{key:"mais",label:"editar",formatter:i3GEOadmin.conexao.formatMais},
			{label:"c&oacute;digo",key:"codigo_estat_conexao", formatter:i3GEOadmin.conexao.formatTexto},
			{label:"Banco de dados",resizeable:true,key:"bancodedados", formatter:i3GEOadmin.conexao.formatTexto},
			{label:"Host",resizeable:true,key:"host", formatter:i3GEOadmin.conexao.formatTexto},
			{label:"Porta",key:"porta",formatter:i3GEOadmin.conexao.formatTexto},
			{label:"Usu&aacute;rio",key:"usuario",formatter:i3GEOadmin.conexao.formatTexto},
			{label:"Senha",key:"senha",formatter:i3GEOadmin.conexao.formatSenha}
		];
	},
	/*
	 * Inicializa o menu
	 */
	inicia: function(){
		YAHOO.namespace("conexao");
		YAHOO.namespace("admin.container");
		core_ativaPainelAjuda("ajuda","botaoAjuda");
		core_ativaBotaoAdicionaLinha("../php/metaestat.php?funcao=alterarConexao","adicionaNovaLinha","i3GEOadmin.conexao.obtem");
		i3GEOadmin.conexao.obtem();
	},
	/*
	 * Obt&eacute;m a lista de menus
	 */
	obtem: function(){
		i3GEOadmin.conexao.dados = "";
		core_carregando("ativa");
		core_pegaDados("buscando endere&ccedil;os...","../php/metaestat.php?funcao=listaConexao","i3GEOadmin.conexao.tabela");
	},
	tabela: function(dados){
		if(i3GEOadmin.conexao.dados == ""){
			i3GEOadmin.conexao.dados = dados;
		}
		core_listaDeLetras("letras","i3GEOadmin.conexao.filtra");
		YAHOO.example.InlineCellEditing = new function(){
			// Custom formatter for "address" column to preserve line breaks
			var myDataSource = new YAHOO.util.DataSource(dados);
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			myDataSource.responseSchema = {
				fields: i3GEOadmin.conexao.colunas
			};
			i3GEOadmin.conexao.dataTable = new YAHOO.widget.DataTable("tabela", i3GEOadmin.conexao.defColunas(), myDataSource);
			i3GEOadmin.conexao.dataTable.subscribe('cellClickEvent',function(ev){
				var sUrl, callback,$clicouId, $recordid,
					target = YAHOO.util.Event.getTarget(ev),
					column = this.getColumn(target),
					registro = this.getRecord(target);
				if(YAHOO.conexao.panelCK)	{
					YAHOO.conexao.panelCK.destroy();
					YAHOO.conexao.panelCK = null;
				}
				if (column.key == 'excluir'){
					i3GEOadmin.conexao.exclui(registro.getData('codigo_estat_conexao'),target);
				}
				if (column.key == 'mais'){
					core_carregando("ativa");
					core_carregando("buscando dados...");
					$clicouId = registro.getData('codigo_estat_conexao');
					$recordid = registro.getId();
					sUrl = "../php/metaestat.php?funcao=listaConexao&codigo_estat_conexao="+$clicouId;
					callback = {
	  					success:function(o){
	  						try{
	  							i3GEOadmin.conexao.editor(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
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
				i3GEOadmin.conexao.salva(id,recordid);
			}
			YAHOO.conexao.panelEditor2.destroy();
			YAHOO.conexao.panelEditor2 = null;
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
			YAHOO.conexao.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { modal:true,fixedcenter:true,close:false,width:"400px", height:"360px",overflow:"auto", visible:false,constraintoviewport:true } );
			YAHOO.conexao.panelEditor2.render();
		}
		YAHOO.conexao.panelEditor2.show();
		$i("editor_bd2").innerHTML = i3GEOadmin.conexao.formulario(dados);
		core_carregando("desativa");
	},
	formulario: function(i){
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
	},
	atualizaFiltro: function(dados){
		i3GEOadmin.conexao.dados = dados;
		i3GEOadmin.conexao.filtra(i3GEOadmin.conexao.letra);
	},
	filtra: function(letra){
		i3GEOadmin.conexao.letra = letra;
		if(i3GEOadmin.conexao.dados == ""){
			core_carregando("ativa");
			core_pegaDados("buscando endere&ccedil;os...","../php/metaestat.php?funcao=listaConexao","i3GEOadmin.conexao.atualizaFiltro");
			return;
		}
		var i,temp,
			n = i3GEOadmin.conexao.dados.length,
			novo = [];
		if(letra == "Todos"){
			novo = i3GEOadmin.conexao.dados;
		}
		else{
			for(i=0;i<n;i++){
				temp = i3GEOadmin.conexao.dados[i].bancodedados;
				if(temp.charAt(0).toUpperCase() == letra.toUpperCase()){
					novo.push(i3GEOadmin.conexao.dados[i]);
				}
			}
		}
		i3GEOadmin.conexao.tabela(novo);
	},
	exclui: function(id,row){
		var mensagem = " excluindo o registro do id= "+id,
			sUrl = "../php/metaestat.php?funcao=excluirConexao&codigo_estat_conexao="+id;
		core_excluiLinha(sUrl,row,mensagem,"",i3GEOadmin.conexao.dataTable);
		i3GEOadmin.conexao.dados = "";
	},
	salva: function(id,recordid){
		var i,c,sUrl, callback,
			campos = i3GEOadmin.conexao.colunas,
			par = "",
			n = campos.length;
		for (i=0;i<n;i++){
			c = $i("E"+campos[i].key);
			if(c){
				par += "&"+campos[i].key+"="+(c.value);
			}
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
	  					var rec = i3GEOadmin.conexao.dataTable.getRecordSet().getRecord(recordid);
	  					i3GEOadmin.conexao.dataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText));
	  					i3GEOadmin.conexao.dados = "";
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