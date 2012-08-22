/*
Title: grupos.js

Fun&ccedil;&otilde;es que controlam a interface do editor de grupos

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

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

i3geo/admin/js/grupos.js
*/

/*
Title: menu.js

Fun&ccedil;&otilde;es que controlam a interface do editor de menus

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

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

if(typeof(i3GEOadmin) === 'undefined'){
	var i3GEOadmin = {};
}
i3GEOadmin.grupos = {
	dados: "",
	dataTable: null,
	colunas: ["it","es","en","desc_grupo","id_grupo","nome_grupo"],
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
			{key:"excluir",label:"excluir",formatter:i3GEOadmin.grupos.formatExclui},
			{key:"mais",label:"editar",formatter:i3GEOadmin.grupos.formatMais},
			{label:"id",key:"id_grupo", formatter:i3GEOadmin.grupos.formatTexto},
			{label:"nome",resizeable:true,key:"nome_grupo", formatter:i3GEOadmin.grupos.formatTexto},
			{label:"descri&ccedil;&atilde;o",resizeable:true,key:"desc_grupo", formatter:i3GEOadmin.grupos.formatTexto},
			{label:"en",resizeable:true,key:"en", formatter:i3GEOadmin.grupos.formatTexto},
			{label:"es",resizeable:true,key:"es", formatter:i3GEOadmin.grupos.formatTexto},
			{label:"it",resizeable:true,key:"it", formatter:i3GEOadmin.grupos.formatTexto}
		];
	},
	/*
	 * Inicializa o menu
	 */
	inicia: function(){
		YAHOO.namespace("grupos");
		YAHOO.namespace("admin.container");
		core_ativaPainelAjuda("ajuda","botaoAjuda");
		core_ativaBotaoAdicionaLinha("../php/menutemas.php?funcao=alteraGrupos","adicionaNovoGrupo","i3GEOadmin.grupos.obtem");
		i3GEOadmin.grupos.obtem();
	},
	/*
	 * Obt&eacute;m a lista de menus
	 */
	obtem: function(){
		i3GEOadmin.grupos.dados = "";
		core_carregando("ativa");
		core_pegaDados("buscando grupos...","../php/menutemas.php?funcao=pegaGrupos","i3GEOadmin.grupos.tabela");
	},
	tabela: function(dados){
		if(i3GEOadmin.grupos.dados == ""){
			i3GEOadmin.grupos.dados = dados;
		}
		core_listaDeLetras("letras_G","i3GEOadmin.grupos.filtra");
		YAHOO.example.InlineCellEditing = new function(){
			// Custom formatter for "address" column to preserve line breaks
			var myDataSource = new YAHOO.util.DataSource(dados);
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			myDataSource.responseSchema = {
				fields: i3GEOadmin.grupos.colunas
			};
			i3GEOadmin.grupos.dataTable = new YAHOO.widget.DataTable("tabela", i3GEOadmin.grupos.defColunas(), myDataSource);
			i3GEOadmin.grupos.dataTable.subscribe('cellClickEvent',function(ev){
				var sUrl, callback,$clicouId, $recordid,
					target = YAHOO.util.Event.getTarget(ev),
					column = this.getColumn(target),
					registro = this.getRecord(target);
				if(YAHOO.grupos.panelCK)	{
					YAHOO.grupos.panelCK.destroy();
					YAHOO.grupos.panelCK = null;
				}
				if (column.key == 'excluir'){
					i3GEOadmin.grupos.exclui(registro.getData('id_grupo'),target);
				}
				if (column.key == 'mais'){
					core_carregando("ativa");
					core_carregando("buscando dados...");
					$clicouId = registro.getData('id_grupo');
					$recordid = registro.getId();
					sUrl = "../php/menutemas.php?funcao=pegaGrupos&id_grupo="+$clicouId;
					callback = {
	  					success:function(o){
	  						try{
	  							i3GEOadmin.grupos.editor(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
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
				i3GEOadmin.grupos.salva(id,recordid);
			}
			YAHOO.grupos.panelEditor2.destroy();
			YAHOO.grupos.panelEditor2 = null;
		};
		if(!$i("janela_editor2")){
			var editorBotoes,ins,
				novoel = document.createElement("div");
			novoel.id =  "janela_editor2";
			ins = '<div class="hd">Editor</div>';
			ins += "<div class='bd' style='height:354px;overflow:auto'>";
			ins += "<div id='okcancel_checkbox2'></div><div id='editor_bd2'></div>";
			ins += "<div id='letras_G'></div>";
			novoel.innerHTML = ins;

			document.body.appendChild(novoel);
			editorBotoes = new YAHOO.widget.ButtonGroup({id:"okcancel_checkbox_id2", name:  "okcancel_checkbox_id2", container:  "okcancel_checkbox2" });
			editorBotoes.addButtons([
				{ label: "Salva", value: "OK", checked: false},
				{ label: "Cancela", value: "CANCEL", checked: false }
			]);
			editorBotoes.on("checkedButtonChange", on_editorCheckBoxChange);
			YAHOO.grupos.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { modal:true,fixedcenter:true,close:false,width:"400px", height:"480px",overflow:"auto", visible:false,constraintoviewport:true } );
			YAHOO.grupos.panelEditor2.render();
		}
		YAHOO.grupos.panelEditor2.show();
		$i("editor_bd2").innerHTML = i3GEOadmin.grupos.formulario(dados[0]);
		core_carregando("desativa");
	},
	formulario: function(i){
		var param = {
				"linhas":[
					{titulo:"Nome padr&atilde;o:",id:"Enome_grupo",size:"50",value:i.nome_grupo,tipo:"text",div:""},
					{titulo:"Descricao (opcional):",id:"Edesc_grupo",size:"50",value:i.desc_grupo,tipo:"text",div:""},
					{titulo:"Nome em ingl&ecirc;s (opcional):",id:"Een",size:"50",value:i.en,tipo:"text",div:""},
					{titulo:"Espanhol (opcional):",id:"Ees",size:"50",value:i.es,tipo:"text",div:""},
					{titulo:"Italiano (opcional):",id:"Eit",size:"50",value:i.it,tipo:"text",div:""}
				]
			},
			ins = "";
		ins += core_geraLinhas(param);
		return(ins);
	},
	filtra: function(letra){
		var i,temp,
			n = i3GEOadmin.grupos.dados.length,
			novo = [];
		if(letra == "Todos"){
			novo = i3GEOadmin.grupos.dados;
		}
		else{
			for(i=0;i<n;i++){
				temp = i3GEOadmin.grupos.dados[i].nome_grupo;
				if(temp.charAt(0).toUpperCase() == letra.toUpperCase()){
					novo.push(i3GEOadmin.grupos.dados[i]);
				}
			}
		}
		i3GEOadmin.grupos.tabela(novo);
	},
	exclui: function(id,row){
		var mensagem = " excluindo o registro do id= "+id,
			sUrl = "../php/menutemas.php?funcao=excluirRegistro&id="+id+"&tabela=grupos";
		core_excluiLinha(sUrl,row,mensagem,"",i3GEOadmin.grupos.dataTable);
	},
	salva: function(id,recordid){
		var i,c,sUrl, callback,
			campos = i3GEOadmin.grupos.colunas,
			par = "",
			n = campos.length;
		for (i=0;i<n;i++){
			c = $i("E"+campos[i].key);
			if(c){
				par += "&"+campos[i].key+"="+(c.value);
			}
		}
		par += "&id_grupo="+id;
		core_carregando("ativa");
		core_carregando(" gravando o registro do id= "+id);
		sUrl = "../php/menutemas.php?funcao=alteraGrupos"+par;
		callback = {
	  		success:function(o){
	  			try	{
	  				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
	  					core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem registros vinculados</span>");
	  					setTimeout("core_carregando('desativa')",3000);
	  				}
	  				else{
	  					var rec = i3GEOadmin.grupos.dataTable.getRecordSet().getRecord(recordid);
	  					i3GEOadmin.grupos.dataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0]);
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