if(typeof(i3GEOadmin) === 'undefined'){
	var i3GEOadmin = {};
}
i3GEOadmin.umedida = {
	dados: "",
	letra: "",
	dataTable: null,
	colunas: ["codigo_unidade_medida","nome","sigla","permitesoma","permitemedia"],
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
			{key:"excluir",label:"excluir",formatter:i3GEOadmin.umedida.formatExclui},
			{key:"mais",label:"editar",formatter:i3GEOadmin.umedida.formatMais},
			{label:"c&oacute;digo",key:"codigo_unidade_medida", formatter:i3GEOadmin.umedida.formatTexto},
			{label:"Nome",resizeable:true,key:"nome", formatter:i3GEOadmin.umedida.formatTexto},
			{label:"Sigla",resizeable:true,key:"sigla", formatter:i3GEOadmin.umedida.formatTexto},
			{label:"Permite soma?",key:"permitesoma", formatter:i3GEOadmin.umedida.formatTexto},
			{label:"Permite m&eacute;dia?",key:"permitemedia", formatter:i3GEOadmin.umedida.formatTexto}
		];
	},
	/*
	 * Inicializa o menu
	 */
	inicia: function(){
		YAHOO.namespace("umedida");
		YAHOO.namespace("admin.container");
		core_ativaPainelAjuda("ajuda","botaoAjuda");
		var temp = function(o){
			i3GEOadmin.umedida.obtem();
			return;
		};
		core_ativaBotaoAdicionaLinha("../php/metaestat.php?funcao=alterarUnidadeMedida","adicionaNovaLinha",temp);
		i3GEOadmin.umedida.obtem();
	},
	/*
	 * Obt&eacute;m a lista de menus
	 */
	obtem: function(){
		i3GEOadmin.umedida.dados = "";
		core_carregando("ativa");
		core_pegaDados("buscando endere&ccedil;os...","../php/metaestat.php?funcao=listaUnidadeMedida","i3GEOadmin.umedida.tabela");
	},
	tabela: function(dados){
		if(i3GEOadmin.umedida.dados == ""){
			i3GEOadmin.umedida.dados = dados;
		}
		core_listaDeLetras("letras","i3GEOadmin.umedida.filtra",false,300);
		YAHOO.example.InlineCellEditing = new function(){
			// Custom formatter for "address" column to preserve line breaks
			var myDataSource = new YAHOO.util.DataSource(dados);
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			myDataSource.responseSchema = {
				fields: i3GEOadmin.umedida.colunas
			};
			//i3GEOadmin.umedida.dataTable = new YAHOO.widget.DataTable("tabela", i3GEOadmin.umedida.defColunas(), myDataSource);
			i3GEOadmin.umedida.dataTable = new YAHOO.widget.ScrollingDataTable("tabela", i3GEOadmin.umedida.defColunas(), myDataSource,{width:"100%"});
			i3GEOadmin.umedida.dataTable.subscribe('postRenderEvent',function(){
					//abre o editor
					if(i3GEOadmin.umedida.dados[0].nome == ""){
						var rec = i3GEOadmin.umedida.dataTable.getRecordSet().getRecord(0);
						i3GEOadmin.umedida.editor([i3GEOadmin.umedida.dados[0]],i3GEOadmin.umedida.dados[0].codigo_unidade_medida,rec.getId());
					}
				}
			);
			i3GEOadmin.umedida.dataTable.subscribe('cellClickEvent',function(ev){
				var sUrl, callback,$clicouId, $recordid,
					target = YAHOO.util.Event.getTarget(ev),
					column = this.getColumn(target),
					registro = this.getRecord(target);
				if(YAHOO.umedida.panelCK)	{
					YAHOO.umedida.panelCK.destroy();
					YAHOO.umedida.panelCK = null;
				}
				if (column.key == 'excluir'){
					i3GEOadmin.umedida.exclui(registro.getData('codigo_unidade_medida'),target);
				}
				if (column.key == 'mais'){
					core_carregando("ativa");
					core_carregando("buscando dados...");
					$clicouId = registro.getData('codigo_unidade_medida');
					$recordid = registro.getId();
					sUrl = "../php/metaestat.php?funcao=listaUnidadeMedida&codigo_unidade_medida="+$clicouId;
					callback = {
							success:function(o){
								try{
									i3GEOadmin.umedida.editor(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
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
				i3GEOadmin.umedida.salva(id,recordid);
			}
			YAHOO.umedida.panelEditor2.destroy();
			YAHOO.umedida.panelEditor2 = null;
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
			YAHOO.umedida.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { modal:true,fixedcenter:true,close:false,width:"400px", height:"360px",overflow:"auto", visible:false,constraintoviewport:true } );
			YAHOO.umedida.panelEditor2.render();
		}
		YAHOO.umedida.panelEditor2.show();
		$i("editor_bd2").innerHTML = i3GEOadmin.umedida.formulario(dados);
		core_carregando("desativa");
	},
	formulario: function(i){
		var param = {
				"linhas":[{
					titulo:"Nome:",id:"Enome",size:"50",value:i.nome,tipo:"text",div:""
				},{
					titulo:"Sigla:",id:"Esigla",size:"50",value:i.sigla,tipo:"text",div:""
				}]
			},
			ins = "";

		ins += core_geraLinhas(param);
		ins += "<p>Possibilita somar os valores?<br>";
		ins += "<select  id='Epermitesoma' />";
		ins += "<option value='' ";
		if (i.permitesoma == ""){ins += "selected";}
		ins += ">---</option>";
		ins += "<option value='1' ";
		if (i.permitesoma == 1){ins += "selected";}
		ins += " >sim</option>";
		ins += "<option value='0' ";
		if (i.permitesoma == 0 ){ins += "selected";}
		ins += " >n&atilde;o</option>";
		ins += "</select></p>";

		ins += "<p>Possibilita calcular m&eacute;dia?<br>";
		ins += "<select  id='Epermitemedia' />";
		ins += "<option value='' ";
		if (i.permitemedia == ""){ins += "selected";}
		ins += ">---</option>";
		ins += "<option value='1' ";
		if (i.permitemedia == 1){ins += "selected";}
		ins += " >sim</option>";
		ins += "<option value='0' ";
		if (i.permitemedia == 0 ){ins += "selected";}
		ins += " >n&atilde;o</option>";
		ins += "</select></p>";
		return(ins);
	},
	atualizaFiltro: function(dados){
		i3GEOadmin.umedida.dados = dados;
		i3GEOadmin.umedida.filtra(i3GEOadmin.umedida.letra);
	},
	filtra: function(letra){
		i3GEOadmin.umedida.letra = letra;
		if(i3GEOadmin.umedida.dados == ""){
			core_carregando("ativa");
			core_pegaDados("buscando endere&ccedil;os...","../php/metaestat.php?funcao=listaUnidadeMedida","i3GEOadmin.umedida.atualizaFiltro");
			return;
		}
		var i,temp,
			n = i3GEOadmin.umedida.dados.length,
			novo;
		if(letra == "Todos"){
			novo = i3GEOadmin.umedida.dados;
		}
		else{
			novo = [];
			for(i=0;i<n;i++){
				temp = i3GEOadmin.umedida.dados[i].nome;
				if(temp.charAt(0).toUpperCase() == letra.toUpperCase()){
					novo.push(i3GEOadmin.umedida.dados[i]);
				}
			}
		}
		i3GEOadmin.umedida.tabela(novo);
	},
	exclui: function(id,row){
		var mensagem = " excluindo o registro do id= "+id,
			sUrl = "../php/metaestat.php?funcao=excluirUnidadeMedida&codigo_unidade_medida="+id;
		core_excluiLinha(sUrl,row,mensagem,"",i3GEOadmin.umedida.dataTable);
		i3GEOadmin.umedida.dados = "";
	},
	salva: function(id,recordid){
		var i,c,sUrl, callback,
			campos = i3GEOadmin.umedida.colunas,
			par = "",
			n = campos.length;
		for (i=0;i<n;i++){
			c = $i("E"+campos[i].key);
			if(c){
				par += "&"+campos[i].key+"="+(c.value);
			}
		}
		par += "&codigo_unidade_medida="+id;
		core_carregando("ativa");
		core_carregando(" gravando o registro do id= "+id);
		sUrl = "../php/metaestat.php?funcao=alterarUnidadeMedida"+par;
		callback = {
				success:function(o){
					try	{
						if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
							core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem registros vinculados</span>");
							setTimeout("core_carregando('desativa')",3000);
						}
						else{
							var rec = i3GEOadmin.umedida.dataTable.getRecordSet().getRecord(recordid);
							i3GEOadmin.umedida.dataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText));
							i3GEOadmin.umedida.dados = "";
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
