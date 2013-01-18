/*
Title: mapas.js

Fun&ccedil;&otilde;es que controlam a interface do editor de mapas

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

i3geo/admin/js/mapas.js
*/
if(typeof(i3GEOadmin) === 'undefined'){
	var i3GEOadmin = {};
}
i3GEOadmin.mapas = {
	dados: "",
	letra: "",
	dataTable: null,
	colunas: ["id_mapa","publicado_mapa","ordem_mapa","perfil_mapa","ligados_mapa","temas_mapa","desc_mapa","ext_mapa","imagem_mapa","linkdireto_mapa","nome_mapa","outros_mapa","contemmapfile"],
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
			{key:"excluir",label:"excluir",formatter:i3GEOadmin.mapas.formatExclui},
			{key:"mais",label:"editar",formatter:i3GEOadmin.mapas.formatMais},
			{label:"id",key:"id_mapa", formatter:i3GEOadmin.mapas.formatTexto},
			{label:"nome",resizeable:true,key:"nome_mapa", formatter:i3GEOadmin.mapas.formatTexto},
			{label:"ordem",resizeable:true,key:"ordem_mapa", formatter:i3GEOadmin.mapas.formatTexto},
			{label:"contem mapfile",resizeable:true,key:"contemmapfile", formatter:i3GEOadmin.mapas.formatTexto}
		];
	},
	/*
	 * Inicializa o menu
	 */
	inicia: function(){
		YAHOO.namespace("mapas");
		YAHOO.namespace("admin.container");
		core_ativaPainelAjuda("ajuda","botaoAjuda");
		core_ativaBotaoAdicionaLinha("../php/mapas.php?funcao=alterarMapa","adicionaNovoMapa","i3GEOadmin.mapas.obtem");
		i3GEOadmin.mapas.obtem();
	},
	/*
	 * Obt&eacute;m a lista de menus
	 */
	obtem: function(){
		i3GEOadmin.mapas.dados = "";
		core_carregando("ativa");
		core_pegaDados("buscando dados...","../php/mapas.php?funcao=pegaMapas","i3GEOadmin.mapas.tabela");
	},
	tabela: function(dados){
		if(i3GEOadmin.mapas.dados == ""){
			i3GEOadmin.mapas.dados = dados;
		}
		core_listaDeLetras("letras_Mp","i3GEOadmin.mapas.filtra");
		YAHOO.example.InlineCellEditing = new function(){
			// Custom formatter for "address" column to preserve line breaks
			var myDataSource = new YAHOO.util.DataSource(dados);
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			myDataSource.responseSchema = {
				fields: i3GEOadmin.mapas.colunas
			};
			i3GEOadmin.mapas.dataTable = new YAHOO.widget.DataTable("tabela", i3GEOadmin.mapas.defColunas(), myDataSource);
			i3GEOadmin.mapas.dataTable.subscribe('cellClickEvent',function(ev){
				var sUrl, callback,$clicouId, $recordid,
					target = YAHOO.util.Event.getTarget(ev),
					column = this.getColumn(target),
					registro = this.getRecord(target);
				if(YAHOO.mapas.panelCK)	{
					YAHOO.mapas.panelCK.destroy();
					YAHOO.mapas.panelCK = null;
				}
				if (column.key == 'excluir'){
					i3GEOadmin.mapas.exclui(registro.getData('id_mapa'),target);
				}
				if (column.key == 'mais'){
					core_carregando("ativa");
					core_carregando("buscando dados...");
					$clicouId = registro.getData('id_mapa');
					$recordid = registro.getId();
					sUrl = "../php/mapas.php?funcao=pegaDadosMapa&id_mapa="+$clicouId;
					callback = {
	  					success:function(o){
	  						try{
	  							i3GEOadmin.mapas.editor(YAHOO.lang.JSON.parse(o.responseText),$clicouId,$recordid);
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
				i3GEOadmin.mapas.salva(id,recordid);
			}
			YAHOO.mapas.panelEditor2.destroy();
			YAHOO.mapas.panelEditor2 = null;
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
			YAHOO.mapas.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { modal:true,fixedcenter:true,close:false,width:"400px", height:"480px",overflow:"auto", visible:false,constraintoviewport:true } );
			YAHOO.mapas.panelEditor2.render();
		}
		YAHOO.mapas.panelEditor2.show();
		$i("editor_bd2").innerHTML = i3GEOadmin.mapas.formulario(dados[0]);
		core_comboMapfiles("comboMapfiles","Etemas_mapa","",'registraMapfile(this.value,\"Etemas_mapa\")');
		core_comboPerfis("comboPerfis","Eperfil_mapa","","registraPerfil(this.value)");
		core_carregando("desativa");
	},
	formulario: function(i){
		var ins = "";

		//ins += "<p>Mapfile (código do mapfile que ser&aacute; utilizado para criar a camada no i3geo):"
		//ins += "<div id=comboMapfiles >Buscando...</div>";
		ins += "<p>Ordem de apresenta&ccedil;&atilde;o do mapa:<br>";
		ins += "<input size=10 type=text id=Eordem_mapa value='"+i.ordem_mapa+"' /></p>";

		ins += "<p>Nome do mapa:<br>";
		ins += "<input size=50 type=text id=Enome_mapa value='"+i.nome_mapa+"' /></p>";

		ins += "<p>Publicado?<br>";
		ins += "<select  id='Epublicado_mapa' >";
		ins += core_combosimnao(i.publicado_mapa);
		ins += "</select></p>";

		ins += "<p>Descri&ccedil;&atilde;o:<br>";
		ins += "<input size=50 type=text id=Edesc_mapa value='"+i.desc_mapa+"' /></p>";

		ins += "<p>Extens&atilde;o geogr&aacute;fica:<br>";
		ins += "<input size=50 type=text id=Eext_mapa value='"+i.ext_mapa+"' /></p>";

		ins += "<p>URL da imagem miniatura:<br>";
		ins += "<input size=50 type=text id=Eimagem_mapa value='"+i.imagem_mapa+"' /></p>";
		ins += "<img src='"+i.imagem_mapa+"' />";

		ins += "<p>Temas que ser&atilde;o inclu&iacute;dos nesse mapa (utilize os códigos dos mapfiles mostrados na lista abaixo): </p>";
		ins += "<input size=50 type=text id='Etemas_mapa' value='"+i.temas_mapa+"' /></p>";
		ins += "<div id=comboMapfiles >Buscando...</div>";

		ins += "<p>Temas que ser&atilde;o ligados. Devem constar na lista de temas inclu&iacute;dos: </p>";
		ins += "<input size=50 type=text id='Eligados_mapa' value='"+i.ligados_mapa+"' /></p>";

		ins += "<p>Perfis que podem ver este mapa: </p>";
		ins += "<input size=50 type=text id='Eperfil_mapa' value='"+i.perfil_mapa+"' /></p>";
		ins += "<div id=comboPerfis >Buscando...</div>";

		ins += "<p>Outros par&acirc;metros (separe com '&'):<br>";
		ins += "<input size=50 type=text id=Eoutros_mapa value='"+i.outros_mapa+"' /></p>";

		ins += "<p>Link direto para abertura do mapa (despreza os outros par&acirc;metros):<br>";
		ins += "<input size=50 type=text id=Elinkdireto_mapa value='"+i.linkdireto_mapa+"' /></p>";
		ins += "<br><br><br>";
		return(ins);
	},
	atualizaFiltro: function(dados){
		i3GEOadmin.mapas.dados = dados;
		i3GEOadmin.mapas.filtra(i3GEOadmin.mapas.letra);
	},
	filtra: function(letra){
		i3GEOadmin.mapas.letra = letra;
		if(i3GEOadmin.mapas.dados == ""){
			core_carregando("ativa");
			core_pegaDados("buscando dados...","../php/mapas.php?funcao=pegaMapas","i3GEOadmin.mapas.atualizaFiltro");
			return;
		}
		var i,temp,
			n = i3GEOadmin.mapas.dados.length,
			novo = [];
		if(letra == "Todos"){
			novo = i3GEOadmin.mapas.dados;
		}
		else{
			for(i=0;i<n;i++){
				temp = i3GEOadmin.mapas.dados[i].nome_mapa;
				if(temp.charAt(0).toUpperCase() == letra.toUpperCase()){
					novo.push(i3GEOadmin.mapas.dados[i]);
				}
			}
		}
		i3GEOadmin.mapas.tabela(novo);
	},
	exclui: function(id,row){
		var mensagem = " excluindo o registro do id= "+id,
			sUrl = "../php/mapas.php?funcao=excluirMapa&id="+id;
		core_excluiLinha(sUrl,row,mensagem,"",i3GEOadmin.mapas.dataTable);
		i3GEOadmin.mapas.dados = "";
	},
	salva: function(id,recordid){
		var i,c,sUrl, callback,
			campos = i3GEOadmin.mapas.colunas,
			par = "",
			n = campos.length;
		for (i=0;i<n;i++){
			c = $i("E"+campos[i].key);
			if(c){
				par += "&"+campos[i].key+"="+(c.value);
			}
		}
		par += "&id_mapa="+id;
		core_carregando("ativa");
		core_carregando(" gravando o registro do id= "+id);
		sUrl = "../php/mapas.php?funcao=alterarMapa"+par;
		callback = {
	  		success:function(o){
	  			try	{
	  				if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
	  					core_carregando("<span style=color:red >N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem registros vinculados</span>");
	  					setTimeout("core_carregando('desativa')",3000);
	  				}
	  				else{
	  					var rec = i3GEOadmin.mapas.dataTable.getRecordSet().getRecord(recordid);
	  					i3GEOadmin.mapas.dataTable.updateRow(rec,YAHOO.lang.JSON.parse(o.responseText)[0]);
	  					i3GEOadmin.mapas.dados = "";
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
