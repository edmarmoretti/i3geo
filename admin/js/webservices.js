/*
Title: webservices.js

Fun&ccedil;&otilde;es que controlam a interface do editor do cadastro de Web Services

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
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/js/webservices.js
*/
if(typeof(i3GEOadmin) === 'undefined'){
	var i3GEOadmin = {};
}
i3GEOadmin.webservices = {
	dados: "",
	letra: "",
	dataTable: null,
	colunas: ["id_ws","desc_ws","nome_ws","link_ws","tipo_ws","autor_ws"],
	formatTexto: function(elCell, oRecord, oColumn, oData){
		if(oData === ""){
			oData = "<span style='color:gray' ></span>";
		}
		elCell.innerHTML = "<pre ><p style=cursor:default >" + oData + "</pre>";
	},
	formatExclui: function(elCell, oRecord, oColumn){
		elCell.innerHTML = "<div title="+ $trad("excluiTitulo",i3GEOadmin.core.dicionario) +" class=excluir style='text-align:center' ></div>";
	},
	formatMais: function(elCell, oRecord, oColumn){
		elCell.innerHTML = "<div class="+ $trad("editar",i3GEOadmin.core.dicionario) +" style='text-align:center' ></div>";
	},
	defColunas: function(){
		return [
			{key:"excluir",label:$trad("excluir",i3GEOadmin.core.dicionario),formatter:i3GEOadmin.webservices.formatExclui},
			{key:"mais",label:$trad("editar",i3GEOadmin.core.dicionario),formatter:i3GEOadmin.webservices.formatMais},
			{label:"id",key:"id_ws", formatter:i3GEOadmin.webservices.formatTexto},
			{label:$trad("nome",i3GEOadmin.core.dicionario),resizeable:true,key:"nome_ws", formatter:i3GEOadmin.webservices.formatTexto},
			{label:$trad("tipo",i3GEOadmin.webservices.dicionario),resizeable:true,key:"tipo_ws", formatter:i3GEOadmin.webservices.formatTexto}
		];
	},
	/*
	 * Inicializa o menu
	 */
	inicia: function(){
		YAHOO.namespace("webservices");
		YAHOO.namespace("admin.container");
		core_ativaPainelAjuda("ajuda","botaoAjuda");
		var temp = function(o){
			i3GEOadmin.webservices.obtem();
			return;
		};
		core_ativaBotaoAdicionaLinha("../php/webservices.php?funcao=alterarWS","adicionaNovoWebservice",temp);
		i3GEOadmin.webservices.obtem();
	},
	/*
	 * Obt&eacute;m a lista de menus
	 */
	obtem: function(){
		i3GEOadmin.webservices.dados = "";
		core_carregando("ativa");
		var tipows = "",u;
		try{
			u = window.location.href.split("?");
			u = u[1].split("=");
			tipows = u[1];
		}
		catch(e){tipows = "";}
		core_pegaDados($trad("msgBuscaEndereco",i3GEOadmin.webservices.dicionario),"../php/webservices.php?funcao=pegaWS&tipows="+tipows,"i3GEOadmin.webservices.tabela");
	},
	tabela: function(dados){
		if(i3GEOadmin.webservices.dados == ""){
			i3GEOadmin.webservices.dados = dados;
		}
		core_listaDeLetras("letras_W","i3GEOadmin.webservices.filtra",false,300);
		YAHOO.example.InlineCellEditing = new function(){
			// Custom formatter for "address" column to preserve line breaks
			var myDataSource = new YAHOO.util.DataSource(dados);
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			myDataSource.responseSchema = {
				fields: i3GEOadmin.webservices.colunas
			};
			//i3GEOadmin.webservices.dataTable = new YAHOO.widget.DataTable("tabela", i3GEOadmin.webservices.defColunas(), myDataSource);
			i3GEOadmin.webservices.dataTable = new YAHOO.widget.ScrollingDataTable("tabela", i3GEOadmin.webservices.defColunas(), myDataSource,{width:"100%"});
			i3GEOadmin.webservices.dataTable.subscribe('postRenderEvent',function(){
					//abre o editor
					if(i3GEOadmin.webservices.dados[0].nome_ws == ""){
						var rec = i3GEOadmin.webservices.dataTable.getRecordSet().getRecord(0);
						i3GEOadmin.webservices.editor([i3GEOadmin.webservices.dados[0]],i3GEOadmin.webservices.dados[0].id_ws,rec.getId());
					}
				}
			);
			i3GEOadmin.webservices.dataTable.subscribe('cellClickEvent',function(ev){
				var sUrl, callback,$clicouId, $recordid,
					target = YAHOO.util.Event.getTarget(ev),
					column = this.getColumn(target),
					registro = this.getRecord(target);
				if(YAHOO.webservices.panelCK)	{
					YAHOO.webservices.panelCK.destroy();
					YAHOO.webservices.panelCK = null;
				}
				if (column.key == 'excluir'){
					i3GEOadmin.webservices.exclui(registro.getData('id_ws'),target);
				}
				if (column.key == 'mais'){
					core_carregando("ativa");
					core_carregando($trad("msgBuscaDados",i3GEOadmin.core.dicionario));
					$clicouId = registro.getData('id_ws');
					$recordid = registro.getId();
					sUrl = "../php/webservices.php?funcao=pegaDados&id_ws="+$clicouId;
					callback = {
							success:function(o){
								try{
									i3GEOadmin.webservices.editor(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
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
				i3GEOadmin.webservices.salva(id,recordid);
			}
			YAHOO.webservices.panelEditor2.destroy();
			YAHOO.webservices.panelEditor2 = null;
		};
		if(!$i("janela_editor2")){
			var editorBotoes,ins,
				novoel = document.createElement("div");
			novoel.id =  "janela_editor2";
			ins = '<div class="hd">'+ $trad("editor",i3GEOadmin.core.dicionario) +'</div>';
			ins += "<div class='bd' style='height:354px;overflow:auto'>";
			ins += "<div id='okcancel_checkbox2'></div><div id='editor_bd2'></div>";
			ins += "<div id='letras_W'></div>";
			novoel.innerHTML = ins;

			document.body.appendChild(novoel);
			editorBotoes = new YAHOO.widget.ButtonGroup({id:"okcancel_checkbox_id2", name:  "okcancel_checkbox_id2", container:  "okcancel_checkbox2" });
			editorBotoes.addButtons([
				{ label: $trad("salva1",i3GEOadmin.core.dicionario), value: "OK", checked: false},
				{ label: $trad("cancela",i3GEOadmin.core.dicionario), value: "CANCEL", checked: false }
			]);
			editorBotoes.on("checkedButtonChange", on_editorCheckBoxChange);
			YAHOO.webservices.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { modal:true,fixedcenter:true,close:false,width:"400px", height:"480px",overflow:"auto", visible:false,constraintoviewport:true } );
			YAHOO.webservices.panelEditor2.render();
		}
		YAHOO.webservices.panelEditor2.show();
		$i("editor_bd2").innerHTML = i3GEOadmin.webservices.formulario(dados[0]);
		core_carregando("desativa");
	},
	formulario: function(i){
		var param = {
			"linhas":[
			{titulo:$trad("nome",i3GEOadmin.webservices.dicionario),id:"Enome_ws",size:"50",value:i.nome_ws,tipo:"text",div:""},
			{titulo:$trad("descricao",i3GEOadmin.webservices.dicionario),id:"Edesc_ws",size:"50",value:i.desc_ws,tipo:"text",div:""},
			{titulo:$trad("autor",i3GEOadmin.webservices.dicionario),id:"Eautor_ws",size:"50",value:i.autor_ws,tipo:"text",div:""},
			{titulo:$trad("endereco",i3GEOadmin.webservices.dicionario),id:"Elink_ws",size:"50",value:i.link_ws,tipo:"text",div:""}
			]
		};
		var ins = "";
		ins += core_geraLinhas(param);

		ins += "<p>"+ $trad("tipo1",i3GEOadmin.webservices.dicionario) +"<br>";
		ins += "<div class='styled-select'><select  id='Etipo_ws' />";
		ins += "<option value='' ";
		if (i.tipo_ws == ""){ins += "selected";}
		ins += ">---</option>";
		ins += "<option value='KML' ";
		if (i.tipo_ws == "KML"){ins += "selected";}
		ins += " >KML</option>";
		ins += "<option value='WMS' ";
		if (i.tipo_ws == "WMS"){ins += "selected";}
		ins += " >WMS</option>";
		ins += "<option value='WMS-Tile' ";
		if (i.tipo_ws == "WMS-Tile"){ins += "selected";}
		ins += " >WMS-Tile</option>";
		ins += "<option value='GEORSS' ";
		if (i.tipo_ws == "GEORSS"){ins += "selected";}
		ins += " >GEORSS</option>";
		ins += "<option value='WS' ";
		if (i.tipo_ws == "WS"){ins += "selected";}
		ins += " >WS</option>";
		ins += "<option value='DOWNLOAD' ";
		if (i.tipo_ws == "DOWNLOAD"){ins += "selected";}
		ins += " >DOWNLOAD</option>";
		ins += "<option value='GEOJSON' ";
		if (i.tipo_ws == "GEOJSON"){ins += "selected";}
		ins += " >GEOJSON</option>";

		ins += "</select></div>";
		return(ins);
	},
	atualizaFiltro: function(dados){
		i3GEOadmin.webservices.dados = dados;
		i3GEOadmin.webservices.filtra(i3GEOadmin.webservices.letra);
	},
	filtra: function(letra){
		i3GEOadmin.webservices.letra = letra;
		if(i3GEOadmin.webservices.dados == ""){
			var tipows = "",u;
			try{
				u = window.location.href.split("?");
				u = u[1].split("=");
				tipows = u[1];
			}
			catch(e){tipows = "";}
			core_pegaDados($trad("msgBuscaEndereco",i3GEOadmin.webservices.dicionario),"../php/webservices.php?funcao=pegaWS&tipows="+tipows,"i3GEOadmin.webservices.atualizaFiltro");
			return;
		}
		var i,temp,
			n = i3GEOadmin.webservices.dados.length,
			novo;
		if(letra == "Todos"){
			novo = i3GEOadmin.webservices.dados;
		}
		else{
			novo = [];
			for(i=0;i<n;i++){
				temp = i3GEOadmin.webservices.dados[i].nome_ws;
				//if(temp.charAt(0).toUpperCase() == letra.toUpperCase()){
				if(temp.toUpperCase().startsWith(letra.toUpperCase(),0)){
					novo.push(i3GEOadmin.webservices.dados[i]);
				}
			}
		}
		i3GEOadmin.webservices.tabela(novo);
	},
	exclui: function(id,row){
		var mensagem = $trad("msgExclui",i3GEOadmin.core.dicionario)+id,
			sUrl = "../php/webservices.php?funcao=excluir&id="+id;
		core_excluiLinha(sUrl,row,mensagem,"",i3GEOadmin.webservices.dataTable);
		i3GEOadmin.webservices.dados = "";
	},
	salva: function(id,recordid){
		var i,c,sUrl, callback,
			campos = i3GEOadmin.webservices.colunas,
			par = "",
			n = campos.length;
		for (i=0;i<n;i++){
			c = $i("E"+campos[i].key);
			if(c){
				par += "&"+campos[i].key+"="+(c.value);
			}
		}
		par += "&id_ws="+id;
		core_carregando("ativa");
		core_carregando($trad("gravaId",i3GEOadmin.core.dicionario)+id);
		sUrl = "../php/webservices.php?funcao=alterarWS"+par;
		callback = {
				success:function(o){
					try	{
						if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
							core_carregando("<span style=color:red >"+ $trad("msgErroExclui",i3GEOadmin.core.dicionario) +"</span>");
							setTimeout("core_carregando('desativa')",3000);
						}
						else{
							var rec = i3GEOadmin.webservices.dataTable.getRecordSet().getRecord(recordid);
							i3GEOadmin.webservices.dataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0]);
							i3GEOadmin.webservices.dados = "";
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
