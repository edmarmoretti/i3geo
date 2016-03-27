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
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
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
			{key:"excluir",label:$trad('excluir',i3GEOadmin.core.dicionario),formatter:i3GEOadmin.menus.formatExclui},
			{key:"mais",label:$trad('editar',i3GEOadmin.core.dicionario),formatter:i3GEOadmin.menus.formatMais},
			{label:"id",key:"id_menu", formatter:i3GEOadmin.menus.formatTexto},
			{label:$trad("nomeMenu",i3GEOadmin.listamenu.dicionario),resizeable:true,key:"nome_menu", formatter:i3GEOadmin.menus.formatTexto},
			{label:$trad("nomeIn",i3GEOadmin.listamenu.dicionario),resizeable:true,key:"en", formatter:i3GEOadmin.menus.formatTexto},
			{label:$trad("nomeEs",i3GEOadmin.listamenu.dicionario),resizeable:true,key:"es", formatter:i3GEOadmin.menus.formatTexto},
			{label:$trad("nomeIt",i3GEOadmin.listamenu.dicionario),resizeable:true,key:"it", formatter:i3GEOadmin.menus.formatTexto},
			{label:$trad("publicado",i3GEOadmin.listamenu.dicionario),resizeable:true,key:"publicado_menu", formatter:i3GEOadmin.menus.formatTexto},
			{label:$trad("perfil",i3GEOadmin.listamenu.dicionario),resizeable:true,key:"perfil_menu", formatter:i3GEOadmin.menus.formatTexto},
			{label:$trad("iniciaAberto",i3GEOadmin.listamenu.dicionario),resizeable:true,key:"aberto", formatter:i3GEOadmin.menus.formatTexto},
			{label:$trad("descricao",i3GEOadmin.listamenu.dicionario),resizeable:true,key:"desc_menu", formatter:i3GEOadmin.menus.formatTexto}
		];
	},
	/*
	 * Inicializa o menu
	 */
	inicia: function(){
		YAHOO.namespace("admin.container");
		core_ativaPainelAjuda("ajuda","botaoAjuda");
		YAHOO.namespace("menus");
		var temp = function(o){
			i3GEOadmin.menus.obtem();
			return;
		};
		core_ativaBotaoAdicionaLinha("../php/menutemas.php?funcao=alteraMenus&publicado_menu=&perfil=&nome=&desc=&id=&aberto=","adicionaNovoMenu",temp);
		i3GEOadmin.menus.obtem();
	},
	/*
	 * Obt&eacute;m a lista de menus
	 */
	obtem: function(){
		i3GEOadmin.menus.dados = "";
		core_carregando("ativa");
		core_pegaDados($trad("msgBuscaMenu",i3GEOadmin.core.dicionario),"../php/menutemas.php?funcao=pegaMenus","i3GEOadmin.menus.tabela");
	},
	tabela: function(dados){
		if(i3GEOadmin.menus.dados == ""){
			i3GEOadmin.menus.dados = dados;
		}
		core_listaDeLetras("letras_M","i3GEOadmin.menus.filtra",false,300);
		YAHOO.example.InlineCellEditing = new function(){
			// Custom formatter for "address" column to preserve line breaks
			var myDataSource = new YAHOO.util.DataSource(dados);
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			myDataSource.responseSchema = {
				fields: i3GEOadmin.menus.colunas
			};
			//i3GEOadmin.menus.dataTable = new YAHOO.widget.DataTable("tabela", i3GEOadmin.menus.defColunas(), myDataSource);
			i3GEOadmin.menus.dataTable = new YAHOO.widget.ScrollingDataTable("tabela", i3GEOadmin.menus.defColunas(), myDataSource,{width:"100%",height: "250px"});
			i3GEOadmin.menus.dataTable.subscribe('postRenderEvent',function(){
					//abre o editor
					if(i3GEOadmin.menus.dados[0].nome_menu == ""){
						var rec = i3GEOadmin.menus.dataTable.getRecordSet().getRecord(0);
						i3GEOadmin.menus.editor([i3GEOadmin.menus.dados[0]],i3GEOadmin.menus.dados[0].id_menu,rec.getId());
					}
				}
			);
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
					core_carregando($trad("msgBuscaDados",i3GEOadmin.core.dicionario));
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
		if(!$i("janela_editor2")){
			var botao, ins,
				novoel = document.createElement("div");
			novoel.id =  "janela_editor2";
			ins = '<div class="hd"><input id=okcancel_checkbox_id2 type="buttom" value="Salva" /><span style="margin-left:10px;position:relative;top:-10px;">Menu</span></div>';
			ins += "<div class='bd' style='height:354px;overflow:auto'>";
			ins += "<div id='editor_bd2'></div>";
			ins += "<div id='letras_M'></div>";
			novoel.innerHTML = ins;

			document.body.appendChild(novoel);

			botao = new YAHOO.widget.Button(
				"okcancel_checkbox_id2",
				{onclick:{fn: function(){
					i3GEOadmin.menus.salva(id,recordid);
					YAHOO.menus.panelEditor2.destroy();
					YAHOO.menus.panelEditor2 = null;
				}}}
			);
			botao.addClass("rodar");

			YAHOO.menus.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { modal:true,fixedcenter:true,close:true,width:"480px", height:"480px",overflow:"auto", visible:false,constraintoviewport:true } );
			YAHOO.menus.panelEditor2.render();
		}
		var fecha = function(){
			YAHOO.menus.panelEditor2.destroy();
			YAHOO.menus.panelEditor2 = null;
		};
		YAHOO.util.Event.addListener(YAHOO.menus.panelEditor2.close, "click", fecha);

		YAHOO.menus.panelEditor2.show();
		$i("editor_bd2").innerHTML = i3GEOadmin.menus.formulario(dados[0]);
		core_carregando("desativa");
	},
	formulario: function(i){
		var param = {
				"linhas":[
					{titulo:$trad("nomePadrao",i3GEOadmin.listamenu.dicionario),id:"Enome_menu",size:"50",value:i.nome_menu,tipo:"text",div:""},
					{titulo:$trad("descricao1",i3GEOadmin.listamenu.dicionario),id:"Edesc_menu",size:"50",value:i.desc_menu,tipo:"text",div:""},
					{titulo:$trad("nomeIn1",i3GEOadmin.listamenu.dicionario),id:"Een",size:"50",value:i.en,tipo:"text",div:""},
					{titulo:$trad("nomeEs1",i3GEOadmin.listamenu.dicionario),id:"Ees",size:"50",value:i.es,tipo:"text",div:""},
					{titulo:$trad("nomeIt1",i3GEOadmin.listamenu.dicionario),id:"Eit",size:"50",value:i.it,tipo:"text",div:""},
					{titulo:$trad("perfil1",i3GEOadmin.listamenu.dicionario),id:"Eperfil_menu",size:"50",value:i.perfil_menu,tipo:"text",div:""}
				]
			},
			ins = "";
		ins += core_geraLinhas(param);
		ins += "<p>"+ $trad("publicado1",i3GEOadmin.listamenu.dicionario) +"</p>";
		ins += "<div class='styled-select'><select  id='Epublicado_menu' />";
		ins += "<option value='' ";
		if (i.publicado_menu == ""){ins += "selected";}
		ins += ">---</option>";
		ins += "<option value='SIM' ";
		if ((i.publicado_menu).toLowerCase() == "sim"){ins += "selected";}
		ins += " >"+ $trad("sim",i3GEOadmin.core.dicionario) +"</option>";
		ins += "<option value='NAO' ";
		if ((i.publicado_menu).toLowerCase() == "nao"){ins += "selected";}
		ins += " >"+ $trad("nao",i3GEOadmin.core.dicionario) +"</option>";
		ins += "</select></div>";
		ins += "<p>"+ $trad("iniciaAberto1",i3GEOadmin.listamenu.dicionario) +"</p>";
		ins += "<div class='styled-select'><select  id='Eaberto' />";
		ins += "<option value='' ";
		if (i.aberto == ""){ins += "selected";}
		ins += ">---</option>";
		ins += "<option value='SIM' ";
		if ((i.aberto).toLowerCase() == "sim"){ins += "selected";}
		ins += " >"+ $trad("sim",i3GEOadmin.core.dicionario) +"</option>";
		ins += "<option value='NAO' ";
		if ((i.aberto).toLowerCase() == "nao"){ins += "selected";}
		ins += " >"+ $trad("nao",i3GEOadmin.core.dicionario) +"</option>";
		ins += "</select></div>";
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
			core_pegaDados($trad("msgBuscaMenu",i3GEOadmin.core.dicionario),"../php/menutemas.php?funcao=pegaMenus","i3GEOadmin.menus.atualizaFiltro");
			return;
		}
		var i,temp,
			n = i3GEOadmin.menus.dados.length,
			novo;
		if(letra == "Todos"){
			novo = i3GEOadmin.menus.dados;
		}
		else{
			novo = [];
			for(i=0;i<n;i++){
				temp = i3GEOadmin.menus.dados[i].nome_menu;
				//if(temp.charAt(0).toUpperCase() == letra.toUpperCase()){
				if(temp.toUpperCase().startsWith(letra.toUpperCase(),0)){
					novo.push(i3GEOadmin.menus.dados[i]);
				}
			}
		}
		i3GEOadmin.menus.tabela(novo);
	},
	exclui: function(id,row){
		var mensagem = $trad("msgExclui",i3GEOadmin.core.dicionario)+id,
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
		core_carregando($trad("gravaId",i3GEOadmin.core.dicionario)+id);
		sUrl = "../php/menutemas.php?funcao=alteraMenus"+par;
		callback = {
	  		success:function(o){
	  			try	{
	  				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
	  					core_carregando("<span style=color:red >"+ $trad("msgErroExclui",i3GEOadmin.core.dicionario) +"</span>");
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
