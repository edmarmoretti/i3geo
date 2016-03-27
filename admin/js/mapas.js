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
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
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
			{key:"excluir",label:$trad("excluir",i3GEOadmin.core.dicionario),formatter:i3GEOadmin.mapas.formatExclui},
			{key:"mais",label:$trad("editar",i3GEOadmin.core.dicionario),formatter:i3GEOadmin.mapas.formatMais},
			{label:"id",key:"id_mapa", formatter:i3GEOadmin.mapas.formatTexto},
			{label:$trad("nome",i3GEOadmin.core.dicionario),resizeable:true,key:"nome_mapa", formatter:i3GEOadmin.mapas.formatTexto},
			{label:$trad("ordem",i3GEOadmin.mapas.dicionario),resizeable:true,key:"ordem_mapa", formatter:i3GEOadmin.mapas.formatTexto},
			{label:$trad("contemMapfile",i3GEOadmin.mapas.dicionario),resizeable:true,key:"contemmapfile", formatter:i3GEOadmin.mapas.formatTexto}
		];
	},
	/*
	 * Inicializa o menu
	 */
	inicia: function(){
		YAHOO.namespace("mapas");
		YAHOO.namespace("admin.container");
		core_ativaPainelAjuda("ajuda","botaoAjuda");
		var temp = function(o){
			i3GEOadmin.mapas.obtem();
			return;
		};
		core_ativaBotaoAdicionaLinha("../php/mapas.php?funcao=alterarMapa","adicionaNovoMapa",temp);
		i3GEOadmin.mapas.obtem();
	},
	/*
	 * Obt&eacute;m a lista de menus
	 */
	obtem: function(){
		i3GEOadmin.mapas.dados = "";
		core_carregando("ativa");
		core_pegaDados($trad("msgBuscaDados",i3GEOadmin.core.dicionario),"../php/mapas.php?funcao=pegaMapas","i3GEOadmin.mapas.tabela");
	},
	tabela: function(dados){
		if(i3GEOadmin.mapas.dados == ""){
			i3GEOadmin.mapas.dados = dados;
		}
		core_listaDeLetras("letras_Mp","i3GEOadmin.mapas.filtra",false,300);
		YAHOO.example.InlineCellEditing = new function(){
			// Custom formatter for "address" column to preserve line breaks
			var myDataSource = new YAHOO.util.DataSource(dados);
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			myDataSource.responseSchema = {
				fields: i3GEOadmin.mapas.colunas
			};
			//i3GEOadmin.mapas.dataTable = new YAHOO.widget.DataTable("tabela", i3GEOadmin.mapas.defColunas(), myDataSource);
			i3GEOadmin.mapas.dataTable = new YAHOO.widget.ScrollingDataTable("tabela", i3GEOadmin.mapas.defColunas(), myDataSource,{width:"100%"});
			i3GEOadmin.mapas.dataTable.subscribe('postRenderEvent',function(){
					//abre o editor
					if(i3GEOadmin.mapas.dados[0].nome_mapa == ""){
						var rec = i3GEOadmin.mapas.dataTable.getRecordSet().getRecord(0);
						i3GEOadmin.mapas.editor([i3GEOadmin.mapas.dados[0]],i3GEOadmin.mapas.dados[0].id_mapa,rec.getId());
					}
				}
			);
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
					core_carregando($trad("msgBuscaDados",i3GEOadmin.core.dicionario));
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
		if(!$i("janela_editor2")){
			var botao, ins,
				novoel = document.createElement("div");
			novoel.id =  "janela_editor2";
			ins = '<div class="hd"><input id=okcancel_checkboxOK type="buttom" value="Salva" />' +
				'<span style="margin-left:10px;position:relative;top:-10px;">Editor</div>' +
				"<div class='bd' style='height:354px;overflow:auto'>" +
				"<div id='okcancel_checkbox2'></div><div id='editor_bd2'></div>" +
				"<div id='letras_SG'></div>";
			novoel.innerHTML = ins;

			document.body.appendChild(novoel);

			botao = new YAHOO.widget.Button(
				"okcancel_checkboxOK",
				{onclick:{fn: function(){
					i3GEOadmin.mapas.salva(id,recordid);
					YAHOO.mapas.panelEditor2.destroy();
					YAHOO.mapas.panelEditor2 = null;
				}}}
			);
			botao.addClass("rodar");
			YAHOO.mapas.panelEditor2 = new YAHOO.widget.Panel("janela_editor2", { modal:true,fixedcenter:true,close:true,width:"400px", height:"480px",overflow:"auto", visible:false,constraintoviewport:true } );
			YAHOO.mapas.panelEditor2.render();
		}

		var fecha = function(){
			try{
				YAHOO.admin.container.panelEditor.destroy();
				YAHOO.admin.container.panelEditor = null;
			}
			catch(e){}
		};
		YAHOO.util.Event.addListener(YAHOO.mapas.panelEditor2.close, "click", fecha);
		YAHOO.mapas.panelEditor2.show();

		$i("editor_bd2").innerHTML = i3GEOadmin.mapas.formulario(dados[0]);
		core_comboMapfiles("comboMapfiles","Etemas_mapa","",'registraMapfile(this.value,\"Etemas_mapa\")');
		core_comboPerfis("comboPerfis","Eperfil_mapa","","registraPerfil(this.value)");
		core_carregando("desativa");
	},
	formulario: function(i){
		var ins = "";

		ins += "<p>"+ $trad("ordemMapa",i3GEOadmin.mapas.dicionario) +"</p>";
		ins += "<div class='styled-select'><input type=text id=Eordem_mapa value='"+i.ordem_mapa+"' /></div>";

		ins += "<p>"+ $trad("nomeMapa",i3GEOadmin.mapas.dicionario) +"</p>";
		ins += "<div class='styled-select'><input type=text id=Enome_mapa value='"+i.nome_mapa+"' /></div>";

		ins += "<p>"+ $trad("publicado",i3GEOadmin.mapas.dicionario) +"</p>";
		ins += "<div class='styled-select'><select  id='Epublicado_mapa' >";
		ins += core_combosimnao(i.publicado_mapa);
		ins += "</select></div>";

		ins += "<p>"+ $trad("descricao",i3GEOadmin.mapas.dicionario) +"</p>";
		ins += "<div class='styled-select'><input type=text id=Edesc_mapa value='"+i.desc_mapa+"' /></div>";

		ins += "<p>"+ $trad("extensao",i3GEOadmin.mapas.dicionario) +"</p>";
		ins += "<div class='styled-select'><input type=text id=Eext_mapa value='"+i.ext_mapa+"' /></div>";

		ins += "<p>"+ $trad("img",i3GEOadmin.mapas.dicionario) +"</p>";
		ins += "<div class='styled-select'><input type=text id=Eimagem_mapa value='"+i.imagem_mapa+"' /></div>";
		ins += "<img src='"+i.imagem_mapa+"' />";

		ins += "<p>"+ $trad("temas",i3GEOadmin.mapas.dicionario) +"</p>";
		ins += "<div class='styled-select'><input type=text id='Etemas_mapa' value='"+i.temas_mapa+"' /></div>";
		ins += "<div id=comboMapfiles >"+ $trad("msgBusca",i3GEOadmin.mapas.dicionario) +"</div>";

		ins += "<p>"+ $trad("temasLigados",i3GEOadmin.mapas.dicionario) +"</p>";
		ins += "<div class='styled-select'><input type=text id='Eligados_mapa' value='"+i.ligados_mapa+"' /></div>";

		ins += "<p>"+ $trad("perfis",i3GEOadmin.mapas.dicionario) +"</p>";
		ins += "<div class='styled-select'><input type=text id='Eperfil_mapa' value='"+i.perfil_mapa+"' /></div>";
		ins += "<div id=comboPerfis >"+ $trad("msgBusca",i3GEOadmin.mapas.dicionario) +"</div>";

		ins += "<p>"+ $trad("parametros",i3GEOadmin.mapas.dicionario) +"<br>";
		ins += "<div class='styled-select'><input type=text id=Eoutros_mapa value='"+i.outros_mapa+"' /></div>";

		ins += "<p>"+ $trad("linkDireto",i3GEOadmin.mapas.dicionario) +"<br>";
		ins += "<div class='styled-select'><input type=text id=Elinkdireto_mapa value='"+i.linkdireto_mapa+"' /></div>";
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
			core_pegaDados($trad("msgBuscaDados",i3GEOadmin.core.dicionario),"../php/mapas.php?funcao=pegaMapas","i3GEOadmin.mapas.atualizaFiltro");
			return;
		}
		var i,temp,
			n = i3GEOadmin.mapas.dados.length,
			novo;
		if(letra == "Todos"){
			novo = i3GEOadmin.mapas.dados;
		}
		else{
			novo = [];
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
		var mensagem = $trad("msgExclui",i3GEOadmin.core.dicionario)+id,
			sUrl = "../php/mapas.php?funcao=excluirMapa&id="+id;
		core_excluiLinha(sUrl,row,mensagem,"",i3GEOadmin.mapas.dataTable);
		i3GEOadmin.mapas.dados = "";
	},
	salva: function(id,recordid){
		var i,c,sUrl, callback,
			campos = i3GEOadmin.mapas.colunas,
			par = "",
			n = campos.length,
			reg = new RegExp("&", "g");
		for (i=0;i<n;i++){
			c = $i("E"+campos[i].key);
			if(c){
				//substitui o & dos parametros
				par += "&"+campos[i].key+"="+(c.value.replace(reg,'*'));
			}
		}
		par += "&id_mapa="+id;
		core_carregando("ativa");
		core_carregando($trad("gravaId",i3GEOadmin.core.dicionario)+id);
		sUrl = "../php/mapas.php?funcao=alterarMapa"+par;
		callback = {
				success:function(o){
					try	{
						if(YAHOO.lang.JSON.parse(o.responseText) == "erro")	{
							core_carregando("<span style=color:red >"+ $trad("msgErroExclui",i3GEOadmin.core.dicionario) +"</span>");
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
