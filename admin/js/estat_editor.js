if(typeof(i3GEOadmin) === 'undefined'){
	var i3GEOadmin = {};
}
i3GEOadmin.editor = {
	/*
	 * Inicializa o sistema
	 */
	inicia: function(){
		YAHOO.namespace("editor");
		YAHOO.namespace("admin.container");
		//opcao de escolha da conexao
		i3GEOadmin.editor.conexao.lista();
	},
	/*
	 *  algumas operacoes sao permitidas apenas para o esquema i3geo_metaestat do banco de dados
	 */
	verificaEsquema: function(nomeEsquema){
		if(nomeEsquema != "i3geo_metaestat"){
			alert("Operacao permitida apenas para o esquema i3geo_metaestat");
			return;
		}
	},
	conexao:{
		onde: "i3GEOadminEditorConexao",
		lista: function(){
			var callback = {
					success:function(o){
						try	{
							var dados = YAHOO.lang.JSON.parse(o.responseText),
							temp = "Escolha a conex&atilde;o com o banco: ";
							temp += "<select id='i3GEOadmincodigo_estat_conexao' onchange='i3GEOadmin.editor.esquema.lista()'>";
							temp += core_comboObjeto(dados,"codigo_estat_conexao","bancodedados","","usuario");
							temp += "</select>";
							$i(i3GEOadmin.editor.conexao.onde).innerHTML = temp;
							core_carregando("desativa");
						}
						catch(e){core_handleFailure(e,o.responseText);}
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
			};
			core_carregando("buscando dados...");
			core_makeRequest("../php/metaestat.php?funcao=listaConexao",callback);
		}
	},
	esquema: {
		onde: "i3GEOadminEditorEsquema",
		lista: function(){
			var callback = {
					success:function(o){
						try	{
							var dados = YAHOO.lang.JSON.parse(o.responseText),
							temp = "<fieldset>Escolha um esquema: ";
							temp += "<select id='i3GEOadminesquema' onchange='i3GEOadmin.editor.tabela.lista()'>";
							temp += core_comboObjeto(dados,"esquema","esquema");
							temp += "</select>";
							$i(i3GEOadmin.editor.esquema.onde).innerHTML = temp+"</fieldset>";
							core_carregando("desativa");
							$i(i3GEOadmin.editor.tabela.onde).innerHTML = "";
						}
						catch(e){core_handleFailure(e,o.responseText);}
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
			},
			codigo_estat_conexao = $i("i3GEOadmincodigo_estat_conexao").value;
			if(codigo_estat_conexao == ""){
				alert("Escolha uma conexao");
				$i(i3GEOadmin.editor.esquema.onde).innerHTML = "";
				$i(i3GEOadmin.editor.tabela.onde).innerHTML = "";
				return;
			}
			core_carregando("buscando dados...");
			core_makeRequest("../php/metaestat.php?funcao=esquemasConexao&formato=json&codigo_estat_conexao="+codigo_estat_conexao,callback);
		},
	},
	tabela:{
		onde: "i3GEOadminEditorTabela",
		lista: function(){
			var callback = {
					success:function(o){
						try	{
							var dados = YAHOO.lang.JSON.parse(o.responseText),
							temp = "<fieldset>Escolha uma tabela: ";
							temp += "<select id='i3GEOadmintabela' onchange='i3GEOadmin.editor.coluna.lista()'>";
							temp += core_comboObjeto(dados,"tabela","tabela");
							temp += "</select>";
							temp += "" +
									"<p>Digite um nome: <input id='i3GEOadmintabelaNomeNovo' title='digite o nome' type=text width=30 style='cursor:text' />" +
									"<p><input type=button value='Criar tabela' id='i3GEOadmintabelaCriar' onclick='i3GEOadmin.editor.tabela.criar()'/>" +
									"<input type=button value='Alterar nome atual' id='i3GEOadmintabelaAlterarNome' onclick='i3GEOadmin.editor.tabela.alterarNome()'/>" +
									"<input type=button value='Copiar para' id='i3GEOadmintabelaCopiar' onclick='i3GEOadmin.editor.tabela.copiar()'/>";

							$i(i3GEOadmin.editor.tabela.onde).innerHTML = temp+"</fieldset>";
							core_carregando("desativa");
							$i(i3GEOadmin.editor.coluna.onde).innerHTML = "";
						}
						catch(e){core_handleFailure(e,o.responseText);}
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
			},
			codigo_estat_conexao = $i("i3GEOadmincodigo_estat_conexao").value,
			nome_esquema = $i("i3GEOadminesquema").value;
			if(nome_esquema == ""){
				alert("Escolha um esquema");
				$i(i3GEOadmin.editor.tabela.onde).innerHTML = "";
				$i(i3GEOadmin.editor.coluna.onde).innerHTML = "";
				return;
			}
			core_carregando("adicionando...");
			core_makeRequest("../php/metaestat.php?funcao=tabelasEsquema&formato=json&nome_esquema="+nome_esquema+"&codigo_estat_conexao="+codigo_estat_conexao,callback);
		},
		criar: function(){
			if(!window.confirm("Cria nova tabela?")){
				return;
			}
			var callback = {
					success:function(o){
						try	{
							core_carregando("desativa");
							i3GEOadmin.editor.tabela.lista();
						}
						catch(e){core_handleFailure(e,o.responseText);}
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
			},
			novaTabela = $i("i3GEOadmintabelaNomeNovo").value,
			nomeEsquema = $i("i3GEOadminesquema").value;
			if(i3GEOadmin.editor.verificaEsquema(nomeEsquema) == false){
				return;
			}
			if(novaTabela == ""){
				alert("Digite um nome");
				return;
			}
			if(i3GEOadmin.editor.tabela.verificaExiste(novaTabela) == false){
				core_carregando("adicionando...");
				core_makeRequest("../php/metaestat.php?funcao=criaTabelaDB&formato=json&nome_tabela="+novaTabela+"&nome_esquema="+nomeEsquema+"&codigo_estat_conexao="+$i("i3GEOadmincodigo_estat_conexao").value,callback);
			}
			else{
				alert("Tabela ja existe");
			}
		},
		alterarNome: function(){
			if(!window.confirm("Altera o nome?")){
				return;
			}
			var callback = {
					success:function(o){
						try	{
							core_carregando("desativa");
							i3GEOadmin.editor.tabela.lista();
						}
						catch(e){core_handleFailure(e,o.responseText);}
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
			},
			novaTabela = $i("i3GEOadmintabelaNomeNovo").value,
			nomeEsquema = $i("i3GEOadminesquema").value;
			if(i3GEOadmin.editor.verificaEsquema(nomeEsquema) == false){
				return;
			}
			if(novaTabela == ""){
				alert("Digite um nome");
				return;
			}
			if(i3GEOadmin.editor.tabela.verificaExiste(novaTabela) == false){
				core_carregando("adicionando...");
				core_makeRequest("../php/metaestat.php?funcao=alteraNomeTabelaDB&formato=json&nome_tabela="+$i("i3GEOadmintabela").value+"&novonome_tabela="+novaTabela+"&nome_esquema="+nomeEsquema+"&codigo_estat_conexao="+$i("i3GEOadmincodigo_estat_conexao").value,callback);
			}
			else{
				alert("Tabela ja existe");
			}
		},
		copiar: function(){
			if(!window.confirm("Copiar tabela?")){
				return;
			}
			var callback = {
					success:function(o){
						try	{
							core_carregando("desativa");
							i3GEOadmin.editor.tabela.lista();
						}
						catch(e){core_handleFailure(e,o.responseText);}
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
			},
			novaTabela = $i("i3GEOadmintabelaNomeNovo").value,
			nomeEsquema = $i("i3GEOadminesquema").value;
			if(i3GEOadmin.editor.verificaEsquema(nomeEsquema) == false){
				return;
			}
			if(novaTabela == ""){
				alert("Digite um nome");
				return;
			}
			if(i3GEOadmin.editor.tabela.verificaExiste(novaTabela) == false){
				core_carregando("adicionando...");
				core_makeRequest("../php/metaestat.php?funcao=copiaTabelaDB&formato=json&nome_tabela="+$i("i3GEOadmintabela").value+"&novonome_tabela="+novaTabela+"&nome_esquema="+nomeEsquema+"&codigo_estat_conexao="+$i("i3GEOadmincodigo_estat_conexao").value,callback);
			}
			else{
				alert("Tabela ja existe");
			}
		},
		verificaExiste: function(valor){
			var combo = $i("i3GEOadmintabela"),
				n = combo.options.length,
				i;
			for(i=0;i<n;i++){
				if(combo.options[i].value == valor){
					return true;
				}
			}
			return false;
		}
	},
	coluna: {
		onde: "i3GEOadminEditorColuna",
		lista: function(){
			var callback = {
					success:function(o){
						try	{
							var dados = YAHOO.lang.JSON.parse(o.responseText),
							temp = "<fieldset>Escolha uma coluna: ";
							temp += "<select id='i3GEOadmincoluna' >";
							temp += core_comboObjeto(dados,"","");
							temp += "</select>";
							temp += "" +
									"<p>Digite um nome: <input id='i3GEOadmincolunaNomeNovo' title='digite o nome' type=text width=30 style='cursor:text' />" +
									"<p>Tipo (integer, numeric, text, geometry): <input id='i3GEOadmincolunaTipo' title='digite o tipo' type=text width=30 style='cursor:text' />" +
									"<p><input type=button value='Adicionar a nova coluna' id='i3GEOadmincolunaCriar' onclick='i3GEOadmin.editor.coluna.criar()'/>" +
									"<input type=button value='Alterar nome atual' id='i3GEOadmincolunaAlterarNome' onclick='i3GEOadmin.editor.coluna.alterarNome()'/>" +
									"<p>Digite um novo nome e um tipo caso queira criar uma nova coluna";
							$i(i3GEOadmin.editor.coluna.onde).innerHTML = temp+"</fieldset>";
							core_carregando("desativa");
						}
						catch(e){core_handleFailure(e,o.responseText);}
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
			},
			codigo_estat_conexao = $i("i3GEOadmincodigo_estat_conexao").value,
			nome_esquema = $i("i3GEOadminesquema").value,
			nome_tabela = $i("i3GEOadmintabela").value;
			if(nome_tabela == ""){
				alert("Escolha uma tabela");
				$i(i3GEOadmin.editor.coluna.onde).innerHTML = "";
				return;
			}
			core_carregando("adicionando...");
			core_makeRequest("../php/metaestat.php?funcao=colunasTabela&formato=json&nome_tabela="+nome_tabela+"&nome_esquema="+nome_esquema+"&codigo_estat_conexao="+codigo_estat_conexao,callback);
		},
		criar: function(){
			if(!window.confirm("Cria nova coluna?")){
				return;
			}
			var callback = {
					success:function(o){
						try	{
							core_carregando("desativa");
							i3GEOadmin.editor.coluna.lista();
						}
						catch(e){core_handleFailure(e,o.responseText);}
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
			},
			novaColuna = $i("i3GEOadmincolunaNomeNovo").value,
			tipo = $i("i3GEOadmincolunaTipo").value,
			nomeEsquema = $i("i3GEOadminesquema").value,
			nomeTabela = $i("i3GEOadmintabela").value;
			if(i3GEOadmin.editor.verificaEsquema(nomeEsquema) == false){
				return;
			}
			if(novaColuna == ""){
				alert("Digite um nome");
				return;
			}
			if(i3GEOadmin.editor.coluna.verificaExiste(novaColuna) == false){
				core_carregando("adicionando...");
				core_makeRequest("../php/metaestat.php?funcao=criaColunaDB&formato=json&tipo="+tipo+"&nova_coluna="+novaColuna+"&nome_tabela="+nomeTabela+"&nome_esquema="+nomeEsquema+"&codigo_estat_conexao="+$i("i3GEOadmincodigo_estat_conexao").value,callback);
			}
			else{
				alert("Coluna ja existe");
			}
		},
		alterarNome: function(){
			if(!window.confirm("Altera o nome?")){
				return;
			}
			var callback = {
					success:function(o){
						try	{
							core_carregando("desativa");
							i3GEOadmin.editor.coluna.lista();
						}
						catch(e){core_handleFailure(e,o.responseText);}
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
			},
			novaColuna = $i("i3GEOadmincolunaNomeNovo").value,
			nomeEsquema = $i("i3GEOadminesquema").value,
			nomeColuna = $i("i3GEOadmincoluna").value;
			if(i3GEOadmin.editor.verificaEsquema(nomeEsquema) == false){
				return;
			}
			if(novaColuna == ""){
				alert("Digite um nome");
				return;
			}
			if(i3GEOadmin.editor.coluna.verificaExiste(novaColuna) == false){
				core_carregando("adicionando...");
				core_makeRequest("../php/metaestat.php?funcao=alteraNomeColunaDB&formato=json&nome_coluna="+nomeColuna+"&nome_tabela="+$i("i3GEOadmintabela").value+"&novonome_coluna="+novaColuna+"&nome_esquema="+nomeEsquema+"&codigo_estat_conexao="+$i("i3GEOadmincodigo_estat_conexao").value,callback);
			}
			else{
				alert("Coluna ja existe");
			}
		},
		verificaExiste: function(valor){
			var combo = $i("i3GEOadmincoluna"),
				n = combo.options.length,
				i;
			for(i=0;i<n;i++){
				if(combo.options[i].value == valor){
					return true;
				}
			}
			return false;
		}
	}
};