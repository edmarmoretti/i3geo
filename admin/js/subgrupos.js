/*
Title: subgrupos.js

Fun&ccedil;&otilde;es que controlam a interface do editor de subgrupos

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c�pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/js/subgrupos.js
*/
//YAHOO.namespace("admin.container");
/*
Function: initEditorSubGrupos

Inicializa o editor

<ALTERASUBGRUPOS>
*/
if(typeof(i3GEOadmin) === 'undefined'){
	var i3GEOadmin = {};
}
i3GEOadmin.subgrupos = {
	dados: "",
	letra: "",
	dataTable: null,
	colunas: ["it","es","en","desc_subgrupo","id_subgrupo","nome_subgrupo"],
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
			{key:"excluir",label:"excluir",formatter:i3GEOadmin.subgrupos.formatExclui},
			{key:"mais",label:"editar",formatter:i3GEOadmin.subgrupos.formatMais},
			{label:"id",key:"id_subgrupo", formatter:i3GEOadmin.subgrupos.formatTexto},
			{label:"nome",resizeable:true,key:"nome_subgrupo", formatter:i3GEOadmin.subgrupos.formatTexto},
			{label:"descri&ccedil;&atilde;o",resizeable:true,key:"desc_subgrupo", formatter:i3GEOadmin.subgrupos.formatTexto},
			{label:"en",resizeable:true,key:"en", formatter:i3GEOadmin.subgrupos.formatTexto},
			{label:"es",resizeable:true,key:"es", formatter:i3GEOadmin.subgrupos.formatTexto},
			{label:"it",resizeable:true,key:"it", formatter:i3GEOadmin.subgrupos.formatTexto}
		];
	},
	/*
	 * Inicializa o menu
	 */
	inicia: function(){
		YAHOO.namespace("subgrupos");
		YAHOO.namespace("admin.container");
		core_ativaPainelAjuda("ajuda","botaoAjuda");
		var temp = function(o){
			i3GEOadmin.subgrupos.obtem();
			return;
		};
		core_ativaBotaoAdicionaLinha("../php/menutemas.php?funcao=alteraSubGrupos","adicionaNovoSubGrupo",temp);
		i3GEOadmin.subgrupos.obtem();
	},
	/*
	 * Obt&eacute;m a lista de menus
	 */
	obtem: function(){
		i3GEOadmin.subgrupos.dados = "";
		core_carregando("ativa");
		core_pegaDados("buscando subgrupos...","../php/menutemas.php?funcao=pegaSubGrupos","i3GEOadmin.subgrupos.tabela");
	},
	tabela: function(dados){
		if(i3GEOadmin.subgrupos.dados == ""){
			i3GEOadmin.subgrupos.dados = dados;
		}
		core_listaDeLetras("letras_SG","i3GEOadmin.subgrupos.filtra");
		YAHOO.example.InlineCellEditing = new function(){
			// Custom formatter for "address" column to preserve line breaks
			var myDataSource = new YAHOO.util.DataSource(dados);
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			myDataSource.responseSchema = {
				fields: i3GEOadmin.subgrupos.colunas
			};
			//i3GEOadmin.subgrupos.dataTable = new YAHOO.widget.DataTable("tabela", i3GEOadmin.subgrupos.defColunas(), myDataSource);
			i3GEOadmin.subgrupos.dataTable = new YAHOO.widget.ScrollingDataTable("tabela", i3GEOadmin.subgrupos.defColunas(), myDataSource,{width:"100%"});
			i3GEOadmin.subgrupos.dataTable.subscribe('postRenderEvent',function(){
					//abre o editor
					if(i3GEOadmin.subgrupos.dados[0].nome_subgrupo == ""){
						var rec = i3GEOadmin.subgrupos.dataTable.getRecordSet().getRecord(0);
						i3GEOadmin.subgrupos.editor([i3GEOadmin.subgrupos.dados[0]],i3GEOadmin.subgrupos.dados[0].id_subgrupo,rec.getId());
					}
				}
			);			
			i3GEOadmin.subgrupos.dataTable.subscribe('cellClickEvent',function(ev){
				var sUrl, callback,$clicouId, $recordid,
					target = YAHOO.util.Event.getTarget(ev),
					column = this.getColumn(target),
					registro = this.getRecord(target);
				if(YAHOO.subgrupos.panelCK)	{
					YAHOO.subgrupos.panelCK.destroy();
					YAHOO.subgrupos.panelCK = null;
				}
				if (column.key == 'excluir'){
					i3GEOadmin.subgrupos.exclui(registro.getData('id_subgrupo'),target);
				}
				if (column.key == 'mais'){
					core_carregando("ativa");
					core_carregando("buscando dados...");
					$clicouId = registro.getData('id_subgrupo');
					$recordid = registro.getId();
					sUrl = "../php/menutemas.php?funcao=pegaSubGrupos&id_subgrupo="+$clicouId;
					callback = {
	  					success:function(o){
	  						try{
	  							i3GEOadmin.subgrupos.editor(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
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
				i3GEOadmin.subgrupos.salva(id,recordid);
			}
			YAHOO.subgrupos.panelEditor2.destroy();
			YAHOO.subgrupos.panelEditor2 = null;
		};
		if(!$i("janela_editor2")){
			var editorBotoes,ins,
				novoel = document.createElement("div");
			novoel.id =  "janela_editor2";
			ins = '<div class="hd">Editor</div>';
			ins += "<div class='bd' style='height:354px;overflow:auto'>";
			ins += "<div id='okcancel_checkbox2'></div><div id='editor_bd2'></div>";
			ins += "<div id='letras_SG'></div>";
			novoel.innerHTML = ins;

			document.body.appendChild(novoel);
			editorBotoes = new YAHOO.widget.ButtonGroup({id:"okcancel_checkbox_id2", name:  "okcancel_checkbox_id2", container:  "okcancel_checkbox2" });
			editorBotoes.addButtons([
				{ label: "Salva", value: "OK", checked: false},
				{ label: "Cancela", value: "CANCEL", checked: false }
			]);
			editorBotoes.on("checkedButtonChange", on_editorCheckBoxChange);
			YAHOO.subgrupos.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { modal:true,fixedcenter:true,close:false,width:"450px", height:"480px",overflow:"auto", visible:false,constraintoviewport:true } );
			YAHOO.subgrupos.panelEditor2.render();
		}
		YAHOO.subgrupos.panelEditor2.show();
		$i("editor_bd2").innerHTML = i3GEOadmin.subgrupos.formulario(dados[0]);
		core_carregando("desativa");
	},
	formulario: function(i){
		var param = {
				"linhas":[
					{titulo:"Nome padr&atilde;o:",id:"Enome_subgrupo",size:"50",value:i.nome_subgrupo,tipo:"text",div:""},
					{titulo:"Descricao (opcional):",id:"Edesc_subgrupo",size:"50",value:i.desc_subgrupo,tipo:"text",div:""},
					{titulo:"Nome em ingl&ecirc;s (opcional):",id:"Een",size:"50",value:i.en,tipo:"text",div:""},
					{titulo:"Espanhol (opcional):",id:"Ees",size:"50",value:i.es,tipo:"text",div:""},
					{titulo:"Italiano (opcional):",id:"Eit",size:"50",value:i.it,tipo:"text",div:""}
				]
			},
			ins = "";
		ins += core_geraLinhas(param);
		return(ins);
	},
	atualizaFiltro: function(dados){
		i3GEOadmin.subgrupos.dados = dados;
		i3GEOadmin.subgrupos.filtra(i3GEOadmin.subgrupos.letra);
	},
	filtra: function(letra){
		i3GEOadmin.subgrupos.letra = letra;
		if(i3GEOadmin.subgrupos.dados == ""){
			core_carregando("ativa");
			core_pegaDados("buscando subgrupos...","../php/menutemas.php?funcao=pegaSubGrupos","i3GEOadmin.subgrupos.atualizaFiltro");
			return;
		}
		var i,temp,
			n = i3GEOadmin.subgrupos.dados.length,
			novo;
		if(letra == "Todos"){
			novo = i3GEOadmin.subgrupos.dados;
		}
		else{
			novo = [];
			for(i=0;i<n;i++){
				temp = i3GEOadmin.subgrupos.dados[i].nome_subgrupo;
				if(temp.charAt(0).toUpperCase() == letra.toUpperCase()){
					novo.push(i3GEOadmin.subgrupos.dados[i]);
				}
			}
		}
		i3GEOadmin.subgrupos.tabela(novo);
	},
	exclui: function(id,row){
		var mensagem = " excluindo o registro do id= "+id,
			sUrl = "../php/menutemas.php?funcao=excluirRegistro&id="+id+"&tabela=subgrupos";
		core_excluiLinha(sUrl,row,mensagem,"",i3GEOadmin.subgrupos.dataTable);
		i3GEOadmin.subgrupos.dados = "";
	},
	salva: function(id,recordid){
		var i,c,sUrl, callback,
			campos = i3GEOadmin.subgrupos.colunas,
			par = "",
			n = campos.length;
		for (i=0;i<n;i++){
			c = $i("E"+campos[i].key);
			if(c){
				par += "&"+campos[i].key+"="+(c.value);
			}
		}
		par += "&id_subgrupo="+id;
		core_carregando("ativa");
		core_carregando(" gravando o registro do id= "+id);
		sUrl = "../php/menutemas.php?funcao=alteraSubGrupos"+par;
		callback = {
	  		success:function(o){
	  			try	{
	  				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
	  					core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem registros vinculados</span>");
	  					setTimeout("core_carregando('desativa')",3000);
	  				}
	  				else{
	  					var rec = i3GEOadmin.subgrupos.dataTable.getRecordSet().getRecord(recordid);
	  					i3GEOadmin.subgrupos.dataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0]);
	  					i3GEOadmin.subgrupos.dados = "";
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
