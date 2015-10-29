/*
Title: identifica.js

Fun&ccedil;&otilde;es que controlam a interface do editor dos sistemas adicionais de identifica&ccedil;&atilde;o

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

i3geo/admin/js/identifica.js
*/
if(typeof(i3GEOadmin) === 'undefined'){
	var i3GEOadmin = {};
}
i3GEOadmin.identifica = {
	dados: "",
	letra: "",
	dataTable: null,
	colunas: ["publicado_i","abrir_i","id_i","nome_i","target_i"],
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
			{key:"excluir",label:$trad("excluir",i3GEOadmin.core.dicionario),formatter:i3GEOadmin.identifica.formatExclui},
			{key:"mais",label:$trad("editar",i3GEOadmin.core.dicionario),formatter:i3GEOadmin.identifica.formatMais},
			{label:"id",key:"id_i", formatter:i3GEOadmin.identifica.formatTexto},
			{label:$trad("nome",i3GEOadmin.core.dicionario),resizeable:true,key:"nome_i", formatter:i3GEOadmin.identifica.formatTexto},
			{label:$trad("publicado",i3GEOadmin.identifica.dicionario),resizeable:true,key:"publicado_i", formatter:i3GEOadmin.identifica.formatTexto},
			{label:$trad("programa",i3GEOadmin.identifica.dicionario),resizeable:true,key:"abrir_i", formatter:i3GEOadmin.identifica.formatTexto},
			{label:$trad("abreComo",i3GEOadmin.identifica.dicionario),resizeable:true,key:"target_i", formatter:i3GEOadmin.identifica.formatTexto}
		];
	},
	/*
	 * Inicializa o menu
	 */
	inicia: function(){
		YAHOO.namespace("identifica");
		YAHOO.namespace("admin.container");
		core_ativaPainelAjuda("ajuda","botaoAjuda");
		var temp = function(o){
			i3GEOadmin.identifica.obtem();
			return;
		};
		core_ativaBotaoAdicionaLinha("../php/identifica.php?funcao=alterarFuncoes","adicionaNovoIdentifica",temp);
		i3GEOadmin.identifica.obtem();
	},
	/*
	 * Obt&eacute;m a lista de menus
	 */
	obtem: function(){
		i3GEOadmin.identifica.dados = "";
		core_carregando("ativa");
		core_pegaDados($trad("msgBuscaEndereco",i3GEOadmin.identifica.dicionario),"../php/identifica.php?funcao=pegaFuncoes","i3GEOadmin.identifica.tabela");
	},
	tabela: function(dados){
		if(i3GEOadmin.identifica.dados == ""){
			i3GEOadmin.identifica.dados = dados;
		}
		core_listaDeLetras("letras_I","i3GEOadmin.identifica.filtra",false,300);
		YAHOO.example.InlineCellEditing = new function(){
			// Custom formatter for "address" column to preserve line breaks
			var myDataSource = new YAHOO.util.DataSource(dados);
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			myDataSource.responseSchema = {
				fields: i3GEOadmin.identifica.colunas
			};
			//i3GEOadmin.identifica.dataTable = new YAHOO.widget.DataTable("tabela", i3GEOadmin.identifica.defColunas(), myDataSource);
			i3GEOadmin.identifica.dataTable = new YAHOO.widget.ScrollingDataTable("tabela", i3GEOadmin.identifica.defColunas(), myDataSource,{width:"100%"});
			i3GEOadmin.identifica.dataTable.subscribe('postRenderEvent',function(){
					//abre o editor
					if(i3GEOadmin.identifica.dados[0].nome_i == ""){
						var rec = i3GEOadmin.identifica.dataTable.getRecordSet().getRecord(0);
						i3GEOadmin.identifica.editor([i3GEOadmin.identifica.dados[0]],i3GEOadmin.identifica.dados[0].id_i,rec.getId());
					}
				}
			);
			i3GEOadmin.identifica.dataTable.subscribe('cellClickEvent',function(ev){
				var sUrl, callback,$clicouId, $recordid,
					target = YAHOO.util.Event.getTarget(ev),
					column = this.getColumn(target),
					registro = this.getRecord(target);
				if(YAHOO.identifica.panelCK)	{
					YAHOO.identifica.panelCK.destroy();
					YAHOO.identifica.panelCK = null;
				}
				if (column.key == 'excluir'){
					i3GEOadmin.identifica.exclui(registro.getData('id_i'),target);
				}
				if (column.key == 'mais'){
					core_carregando("ativa");
					core_carregando($trad("msgBuscaDados",i3GEOadmin.core.dicionario));
					$clicouId = registro.getData('id_i');
					$recordid = registro.getId();
					sUrl = "../php/identifica.php?funcao=pegafuncoes&id_i="+$clicouId;
					callback = {
							success:function(o){
								try{
									i3GEOadmin.identifica.editor(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
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
				i3GEOadmin.identifica.salva(id,recordid);
			}
			YAHOO.identifica.panelEditor2.destroy();
			YAHOO.identifica.panelEditor2 = null;
		};
		if(!$i("janela_editor2")){
			var editorBotoes,ins,
				novoel = document.createElement("div");
			novoel.id =  "janela_editor2";
			ins = '<div class="hd">'+ $trad("editor",i3GEOadmin.core.dicionario) +'</div>';
			ins += "<div class='bd' style='height:354px;overflow:auto'>";
			ins += "<div id='okcancel_checkbox2'></div><div id='editor_bd2'></div>";
			ins += "<div id='letras_I'></div>";
			novoel.innerHTML = ins;

			document.body.appendChild(novoel);
			editorBotoes = new YAHOO.widget.ButtonGroup({id:"okcancel_checkbox_id2", name:  "okcancel_checkbox_id2", container:  "okcancel_checkbox2" });
			editorBotoes.addButtons([
				{ label: $trad("salva",i3GEOadmin.core.dicionario), value: "OK", checked: false},
				{ label: $trad("cancela",i3GEOadmin.core.dicionario), value: "CANCEL", checked: false }
			]);
			editorBotoes.on("checkedButtonChange", on_editorCheckBoxChange);
			YAHOO.identifica.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { modal:true,fixedcenter:true,close:false,width:"400px", height:"480px",overflow:"auto", visible:false,constraintoviewport:true } );
			YAHOO.identifica.panelEditor2.render();
		}
		YAHOO.identifica.panelEditor2.show();
		$i("editor_bd2").innerHTML = i3GEOadmin.identifica.formulario(dados[0]);
		core_carregando("desativa");
	},
	formulario: function(i){
		var param = {
			"linhas":[
			{titulo:$trad("nome",i3GEOadmin.identifica.dicionario),id:"Enome_i",size:"50",value:i.nome_i,tipo:"text",div:""},
			{titulo:$trad("programaDesc",i3GEOadmin.identifica.dicionario),id:"Eabrir_i",size:"50",value:i.abrir_i,tipo:"text",div:""},
			{titulo:$trad("abreComoDesc",i3GEOadmin.identifica.dicionario),id:"Etarget_i",size:"50",value:i.target_i,tipo:"text",div:""}
			]
		};
		var ins = "";
		ins += core_geraLinhas(param)	;

		ins += "<p><b>"+ $trad("publicado2",i3GEOadmin.identifica.dicionario) +"</b><br>";
		ins += "<select  id='Epublicado_i' />";
		ins += "<option value='' ";
		if (i.publicado_i == ""){ins += "selected";}
		ins += ">---</option>";
		ins += "<option value='SIM' ";
		if (i.publicado_i == "SIM"){ins += "selected";}
		ins += " >sim</option>";
		ins += "<option value='NAO' ";
		if (i.publicado_i == "NAO"){ins += "selected";}
		ins += " >n&atilde;o</option>";
		ins += "</select></p>";
		return(ins);
	},
	atualizaFiltro: function(dados){
		i3GEOadmin.identifica.dados = dados;
		i3GEOadmin.identifica.filtra(i3GEOadmin.identifica.letra);
	},
	filtra: function(letra){
		i3GEOadmin.identifica.letra = letra;
		if(i3GEOadmin.identifica.dados == ""){
			core_carregando("ativa");
			core_pegaDados($trad("msgBuscaEndereco",i3GEOadmin.identifica.dicionario),"../php/identifica.php?funcao=pegaFuncoes","i3GEOadmin.identifica.atualizaFiltro");
		}
		var i,temp,
			n = i3GEOadmin.identifica.dados.length,
			novo;
		if(letra == "Todos"){
			novo = i3GEOadmin.identifica.dados;
		}
		else{
			novo = [];
			for(i=0;i<n;i++){
				temp = i3GEOadmin.identifica.dados[i].nome_i;
				if(temp.charAt(0).toUpperCase() == letra.toUpperCase()){
					novo.push(i3GEOadmin.identifica.dados[i]);
				}
			}
		}
		i3GEOadmin.identifica.tabela(novo);
	},
	exclui: function(id,row){
		var mensagem = $trad("msgExclui",i3GEOadmin.core.dicionario)+id,
			sUrl = "../php/identifica.php?funcao=excluir&id="+id;
		core_excluiLinha(sUrl,row,mensagem,"",i3GEOadmin.identifica.dataTable);
		i3GEOadmin.identifica.dados = "";
	},
	salva: function(id,recordid){
		var i,c,sUrl, callback,
			campos = i3GEOadmin.identifica.colunas,
			par = "",
			n = campos.length;
		for (i=0;i<n;i++){
			c = $i("E"+campos[i].key);
			if(c){
				par += "&"+campos[i].key+"="+(c.value);
			}
		}
		par += "&id_i="+id;
		core_carregando("ativa");
		core_carregando($trad("gravaId",i3GEOadmin.core.dicionario)+id);
		sUrl = "../php/identifica.php?funcao=alterarFuncoes"+par;
		callback = {
				success:function(o){
					try	{
						if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
							core_carregando("<span style=color:red >"+ $trad("msgErroExclui",i3GEOadmin.core.dicionario) +"</span>");
							setTimeout("core_carregando('desativa')",3000);
						}
						else{
							var rec = i3GEOadmin.identifica.dataTable.getRecordSet().getRecord(recordid);
							i3GEOadmin.identifica.dataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0]);
							i3GEOadmin.identifica.dados = "";
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
