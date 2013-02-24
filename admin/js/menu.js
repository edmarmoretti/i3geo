/*
Title: menu.js

Fun&ccedil;&otilde;es que controlam a interface do editor de menus

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
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/js/menus.js
*/
/*
Function: initEditorMenu

Inicializa o editor

<ALTERAMENUS>
*/
if(typeof(i3GEOadmin) === 'undefined'){
	var i3GEOadmin = {};
}
i3GEOadmin.menus = {
	letra: "",
	dados: "",
	dataTable: null,
	colunas: ["it","es","en","publicado_menu","perfil_menu","aberto","desc_menu","id_menu","nome_menu"],
	formatTexto: function(elCell, oRecord, oColumn, oData){
		if(oData === ""){
			oData = "<span style='color:gray' ></span>";
		}
		elCell.innerHTML = "<pre ><p style=cursor:default >" + oData + "</pre>";
	},
	formatExclui: function(elCell, oRecord, oColumn){
		elCell.innerHTML = "<div class=excluir title='exclui' style='text-align:center' ></div>";
	},
	formatMais: function(elCell, oRecord, oColumn){
		elCell.innerHTML = "<div class=editar style='text-align:center' ></div>";
	},
	defColunas: function(){
		return [
			{key:"excluir",label:"excluir",formatter:i3GEOadmin.menus.formatExclui},
			{key:"mais",label:"editar",formatter:i3GEOadmin.menus.formatMais},
			{label:"id",key:"id_menu", formatter:i3GEOadmin.menus.formatTexto},
			{label:"nome padr&atilde;o do menu",resizeable:true,key:"nome_menu", formatter:i3GEOadmin.menus.formatTexto},
			{label:"nome em ingl&ecirc;s (opcional)",resizeable:true,key:"en", formatter:i3GEOadmin.menus.formatTexto},
			{label:"nome em espanhol (opcional)",resizeable:true,key:"es", formatter:i3GEOadmin.menus.formatTexto},
			{label:"nome em italiano (opcional)",resizeable:true,key:"it", formatter:i3GEOadmin.menus.formatTexto},
			{label:"publicado para todos verem?",key:"publicado_menu", formatter:i3GEOadmin.menus.formatTexto},
			{label:"perfis",resizeable:true,key:"perfil_menu", formatter:i3GEOadmin.menus.formatTexto},
			{label:"inicia aberto?",key:"aberto", formatter:i3GEOadmin.menus.formatTexto},
			{label:"descri&ccedil;&atilde;o",resizeable:true,key:"desc_menu", formatter:i3GEOadmin.menus.formatTexto}
		];
	},
	/*
	 * Inicializa o menu
	 */
	inicia: function(){
		YAHOO.namespace("admin.container");
		core_ativaPainelAjuda("ajuda","botaoAjuda");
		YAHOO.namespace("menus");
		core_ativaBotaoAdicionaLinha("../php/menutemas.php?funcao=alteraMenus&publicado_menu=&perfil=&nome=&desc=&id=&aberto=","adicionaNovoMenu","i3GEOadmin.menus.obtem");
		i3GEOadmin.menus.obtem();
	},
	/*
	 * Obt&eacute;m a lista de menus
	 */
	obtem: function(){
		i3GEOadmin.menus.dados = "";
		core_carregando("ativa");
		core_pegaDados("buscando menus...","../php/menutemas.php?funcao=pegaMenus","i3GEOadmin.menus.tabela");
	},
	tabela: function(dados){
		if(i3GEOadmin.menus.dados == ""){
			i3GEOadmin.menus.dados = dados;
		}
		core_listaDeLetras("letras_M","i3GEOadmin.menus.filtra");
		YAHOO.example.InlineCellEditing = new function(){
			// Custom formatter for "address" column to preserve line breaks
			var myDataSource = new YAHOO.util.DataSource(dados);
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			myDataSource.responseSchema = {
				fields: i3GEOadmin.menus.colunas
			};
			i3GEOadmin.menus.dataTable = new YAHOO.widget.DataTable("tabela", i3GEOadmin.menus.defColunas(), myDataSource);
			i3GEOadmin.menus.dataTable.subscribe('cellClickEvent',function(ev){
				var sUrl, callback,$clicouId, $recordid,
					target = YAHOO.util.Event.getTarget(ev),
					column = this.getColumn(target),
					registro = this.getRecord(target);
				if(YAHOO.menus.panelCK)	{
					YAHOO.menus.panelCK.destroy();
					YAHOO.menus.panelCK = null;
				}
				if (column.key == 'excluir'){
					i3GEOadmin.menus.exclui(registro.getData('id_menu'),target);
				}
				if (column.key == 'mais'){
					core_carregando("ativa");
					core_carregando("buscando dados...");
					$clicouId = registro.getData('id_menu');
					$recordid = registro.getId();
					sUrl = "../php/menutemas.php?funcao=pegamenus&id_menu="+$clicouId;
					callback = {
	  					success:function(o){
	  						try{
	  							i3GEOadmin.menus.editor(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
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
				i3GEOadmin.menus.salva(id,recordid);
			}
			YAHOO.menus.panelEditor2.destroy();
			YAHOO.menus.panelEditor2 = null;
		};
		if(!$i("janela_editor2")){
			var editorBotoes,ins,
				novoel = document.createElement("div");
			novoel.id =  "janela_editor2";
			ins = '<div class="hd">Editor</div>';
			ins += "<div class='bd' style='height:354px;overflow:auto'>";
			ins += "<div id='okcancel_checkbox2'></div><div id='editor_bd2'></div>";
			ins += "<div id='letras_M'></div>";
			novoel.innerHTML = ins;

			document.body.appendChild(novoel);
			editorBotoes = new YAHOO.widget.ButtonGroup({id:"okcancel_checkbox_id2", name:  "okcancel_checkbox_id2", container:  "okcancel_checkbox2" });
			editorBotoes.addButtons([
				{ label: "Salva", value: "OK", checked: false},
				{ label: "Cancela", value: "CANCEL", checked: false }
			]);
			editorBotoes.on("checkedButtonChange", on_editorCheckBoxChange);
			YAHOO.menus.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { modal:true,fixedcenter:true,close:false,width:"480px", height:"480px",overflow:"auto", visible:false,constraintoviewport:true } );
			YAHOO.menus.panelEditor2.render();
		}
		YAHOO.menus.panelEditor2.show();
		$i("editor_bd2").innerHTML = i3GEOadmin.menus.formulario(dados[0]);
		core_carregando("desativa");
	},
	formulario: function(i){
		var param = {
				"linhas":[
					{titulo:"Nome padr&atilde;o:",id:"Enome_menu",size:"50",value:i.nome_menu,tipo:"text",div:""},
					{titulo:"Descri&ccedil;&atilde;ao (opcional):",id:"Edesc_menu",size:"50",value:i.desc_menu,tipo:"text",div:""},
					{titulo:"Nome em ingl&ecirc;s (opcional):",id:"Een",size:"50",value:i.en,tipo:"text",div:""},
					{titulo:"Espanhol (opcional):",id:"Ees",size:"50",value:i.es,tipo:"text",div:""},
					{titulo:"Italiano (opcional):",id:"Eit",size:"50",value:i.it,tipo:"text",div:""},
					{titulo:"Perfis (opcional):",id:"Eperfil_menu",size:"50",value:i.perfil_menu,tipo:"text",div:""}
				]
			},
			ins = "";
		ins += core_geraLinhas(param);
		ins += "<p>Publicado para todos verem?<br>";
		ins += "<select  id='Epublicado_menu' />";
		ins += "<option value='' ";
		if (i.publicado_menu == ""){ins += "selected";}
		ins += ">---</option>";
		ins += "<option value='SIM' ";
		if ((i.publicado_menu).toLowerCase() == "sim"){ins += "selected";}
		ins += " >sim</option>";
		ins += "<option value='NAO' ";
		if ((i.publicado_menu).toLowerCase() == "nao"){ins += "selected";}
		ins += " >n&atilde;o</option>";
		ins += "</select></p>";
		ins += "<p>Inicia aberto na &aacute;rvore?<br>";
		ins += "<select  id='Eaberto' />";
		ins += "<option value='' ";
		if (i.aberto == ""){ins += "selected";}
		ins += ">---</option>";
		ins += "<option value='SIM' ";
		if ((i.aberto).toLowerCase() == "sim"){ins += "selected";}
		ins += " >sim</option>";
		ins += "<option value='NAO' ";
		if ((i.aberto).toLowerCase() == "nao"){ins += "selected";}
		ins += " >n&atilde;o</option>";
		ins += "</select></p>";
		return(ins);
	},
	atualizaFiltro: function(dados){
		i3GEOadmin.menus.dados = dados;
		i3GEOadmin.menus.filtra(i3GEOadmin.menus.letra);
	},
	filtra: function(letra){
		i3GEOadmin.menus.letra = letra;
		if(i3GEOadmin.menus.dados == ""){
			core_carregando("ativa");
			core_pegaDados("buscando menus...","../php/menutemas.php?funcao=pegaMenus","i3GEOadmin.menus.atualizaFiltro");
			return;
		}
		var i,temp,
			n = i3GEOadmin.menus.dados.length,
			novo = [];
		if(letra == "Todos"){
			novo = i3GEOadmin.menus.dados;
		}
		else{
			for(i=0;i<n;i++){
				temp = i3GEOadmin.menus.dados[i].nome_menu;
				if(temp.charAt(0).toUpperCase() == letra.toUpperCase()){
					novo.push(i3GEOadmin.menus.dados[i]);
				}
			}
		}
		i3GEOadmin.menus.tabela(novo);
	},
	exclui: function(id,row){
		var mensagem = " excluindo o registro do id= "+id,
			sUrl = "../php/menutemas.php?funcao=excluirRegistro&id="+id+"&tabela=menus";
		core_excluiLinha(sUrl,row,mensagem,"",i3GEOadmin.menus.dataTable);
		i3GEOadmin.menus.dados = "";
	},
	salva: function(id,recordid){
		var i,c,sUrl, callback,
			campos = i3GEOadmin.menus.colunas,
			par = "",
			n = campos.length;
		for (i=0;i<n;i++){
			c = $i("E"+campos[i].key);
			if(c){
				par += "&"+campos[i].key+"="+(c.value);
			}
		}
		par += "&id_menu="+id;
		core_carregando("ativa");
		core_carregando(" gravando o registro do id= "+id);
		sUrl = "../php/menutemas.php?funcao=alteraMenus"+par;
		callback = {
	  		success:function(o){
	  			try	{
	  				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
	  					core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem registros vinculados</span>");
	  					setTimeout("core_carregando('desativa')",3000);
	  				}
	  				else{
	  					var rec = i3GEOadmin.menus.dataTable.getRecordSet().getRecord(recordid);
	  					i3GEOadmin.menus.dataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0]);
	  					i3GEOadmin.menus.dados = "";
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