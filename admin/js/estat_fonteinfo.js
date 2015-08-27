if(typeof(i3GEOadmin) === 'undefined'){
	var i3GEOadmin = {};
}
i3GEOadmin.fonteinfo = {
	dados: "",
	letra: "",
	dataTable: null,
	colunas: ["id_fonteinfo","titulo","link"],
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
			{key:"excluir",label:"excluir",formatter:i3GEOadmin.fonteinfo.formatExclui},
			{key:"mais",label:"editar",formatter:i3GEOadmin.fonteinfo.formatMais},
			{label:"Id",resizeable:true,key:"id_fonteinfo", formatter:i3GEOadmin.fonteinfo.formatTexto},
			{label:"T&iacute;tulo",resizeable:true,key:"titulo", formatter:i3GEOadmin.fonteinfo.formatTexto},
			{label:"Link",resizeable:true,key:"link", formatter:i3GEOadmin.fonteinfo.formatTexto}
		];
	},
	/*
	 * Inicializa o menu
	 */
	inicia: function(){
		YAHOO.namespace("fonteinfo");
		YAHOO.namespace("admin.container");
		core_ativaPainelAjuda("ajuda","botaoAjuda");
		var temp = function(o){
			i3GEOadmin.fonteinfo.obtem();
			return;
		};
		core_ativaBotaoAdicionaLinha("../php/metaestat.php?funcao=alteraFonteinfo","adicionaNovaLinha",temp);
		i3GEOadmin.fonteinfo.obtem();
	},
	/*
	 * Obt&eacute;m a lista de menus
	 */
	obtem: function(){
		i3GEOadmin.fonteinfo.dados = "";
		core_carregando("ativa");
		core_pegaDados("buscando endere&ccedil;os...","../php/metaestat.php?funcao=listaFonteinfo","i3GEOadmin.fonteinfo.tabela");
	},
	tabela: function(dados){
		if(i3GEOadmin.fonteinfo.dados == ""){
			i3GEOadmin.fonteinfo.dados = dados;
		}
		core_listaDeLetras("letras","i3GEOadmin.fonteinfo.filtra",false,300);
		YAHOO.example.InlineCellEditing = new function(){
			// Custom formatter for "address" column to preserve line breaks
			var myDataSource = new YAHOO.util.DataSource(dados);
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			myDataSource.responseSchema = {
				fields: i3GEOadmin.fonteinfo.colunas
			};
			//i3GEOadmin.fonteinfo.dataTable = new YAHOO.widget.DataTable("tabela", i3GEOadmin.fonteinfo.defColunas(), myDataSource);
			i3GEOadmin.fonteinfo.dataTable = new YAHOO.widget.ScrollingDataTable("tabela", i3GEOadmin.fonteinfo.defColunas(), myDataSource,{width:"100%"});
			i3GEOadmin.fonteinfo.dataTable.subscribe('postRenderEvent',function(){
					//abre o editor
					if(i3GEOadmin.fonteinfo.dados[0].titulo == "" || i3GEOadmin.fonteinfo.dados[0].titulo == null ){
						var rec = i3GEOadmin.fonteinfo.dataTable.getRecordSet().getRecord(0);
						i3GEOadmin.fonteinfo.editor([i3GEOadmin.fonteinfo.dados[0]],i3GEOadmin.fonteinfo.dados[0].id_fonteinfo,rec.getId());
					}
				}
			);
			i3GEOadmin.fonteinfo.dataTable.subscribe('cellClickEvent',function(ev){
				var sUrl, callback,$clicouId, $recordid,
					target = YAHOO.util.Event.getTarget(ev),
					column = this.getColumn(target),
					registro = this.getRecord(target);
				if(YAHOO.fonteinfo.panelCK)	{
					YAHOO.fonteinfo.panelCK.destroy();
					YAHOO.fonteinfo.panelCK = null;
				}
				if (column.key == 'excluir'){
					i3GEOadmin.fonteinfo.exclui(registro.getData('id_fonteinfo'),target);
				}
				if (column.key == 'mais'){
					core_carregando("ativa");
					core_carregando("buscando dados...");
					$clicouId = registro.getData('id_fonteinfo');
					$recordid = registro.getId();
					sUrl = "../php/metaestat.php?funcao=listaFonteinfo&id_fonteinfo="+$clicouId;
					callback = {
							success:function(o){
								try{
									i3GEOadmin.fonteinfo.editor(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
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
				i3GEOadmin.fonteinfo.salva(id,recordid);
			}
			YAHOO.fonteinfo.panelEditor2.destroy();
			YAHOO.fonteinfo.panelEditor2 = null;
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
			YAHOO.fonteinfo.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { modal:true,fixedcenter:true,close:false,width:"400px", height:"360px",overflow:"auto", visible:false,constraintoviewport:true } );
			YAHOO.fonteinfo.panelEditor2.render();
		}
		YAHOO.fonteinfo.panelEditor2.show();
		$i("editor_bd2").innerHTML = i3GEOadmin.fonteinfo.formulario(dados);
		core_carregando("desativa");
	},
	formulario: function(i){
		var param = {
				"linhas":[{
					titulo:"T&iacute;tulo:",id:"Etitulo",size:"50",value:i.titulo,tipo:"text",div:""
				},{
					titulo:"Link:",id:"Elink",size:"50",value:i.link,tipo:"text",div:""
				}]
			},
			ins = "";

		ins += core_geraLinhas(param);
		return(ins);
	},
	atualizaFiltro: function(dados){
		i3GEOadmin.fonteinfo.dados = dados;
		i3GEOadmin.fonteinfo.filtra(i3GEOadmin.fonteinfo.letra);
	},
	filtra: function(letra){
		i3GEOadmin.fonteinfo.letra = letra;
		if(i3GEOadmin.fonteinfo.dados == ""){
			core_carregando("ativa");
			core_pegaDados("buscando endere&ccedil;os...","../php/metaestat.php?funcao=listaFonteinfo","i3GEOadmin.fonteinfo.atualizaFiltro");
			return;
		}
		var i,temp,
			n = i3GEOadmin.fonteinfo.dados.length,
			novo;
		if(letra == "Todos"){
			novo = i3GEOadmin.fonteinfo.dados;
		}
		else{
			novo = [];
			for(i=0;i<n;i++){
				temp = i3GEOadmin.fonteinfo.dados[i].titulo;
				if(temp.charAt(0).toUpperCase() == letra.toUpperCase()){
					novo.push(i3GEOadmin.fonteinfo.dados[i]);
				}
			}
		}
		i3GEOadmin.fonteinfo.tabela(novo);
	},
	exclui: function(id,row){
		var mensagem = " excluindo o registro do id= "+id,
			sUrl = "../php/metaestat.php?funcao=excluirFonteinfo&id_fonteinfo="+id;
		core_excluiLinha(sUrl,row,mensagem,"",i3GEOadmin.fonteinfo.dataTable);
		i3GEOadmin.fonteinfo.dados = "";
	},
	salva: function(id,recordid){
		var i,c,sUrl, callback,
			campos = i3GEOadmin.fonteinfo.colunas,
			par = "",
			n = campos.length;
		for (i=0;i<n;i++){
			c = $i("E"+campos[i].key);
			if(c){
				par += "&"+campos[i].key+"="+(c.value);
			}
		}
		par += "&id_fonteinfo="+id;
		core_carregando("ativa");
		core_carregando(" gravando o registro do id= "+id);
		sUrl = "../php/metaestat.php?funcao=alteraFonteinfo"+par;
		callback = {
				success:function(o){
					try	{
						if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
							core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem registros vinculados</span>");
							setTimeout("core_carregando('desativa')",3000);
						}
						else{
							var rec = i3GEOadmin.fonteinfo.dataTable.getRecordSet().getRecord(recordid);
							i3GEOadmin.fonteinfo.dataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText));
							i3GEOadmin.fonteinfo.dados = "";
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