if(typeof(i3GEOadmin) === 'undefined'){
	var i3GEOadmin = {};
}
i3GEOadmin.uploaddados = {
	COLUNASARQUIVO: "",
	NOMEARQUIVOSERV: "",
	/*
	 * Inicializa o sistema
	 */
	inicia: function(){
		YAHOO.namespace("editor");
		YAHOO.namespace("admin.container");
		i3GEOadmin.uploaddados.variaveis.lista();
		//i3GEOadmin.uploaddados.conexao.lista();
	},
	upload:{
		onde: "i3GEOadminEditorColunas",
		submit: function(){
			i3GEOadmin.uploaddados.COLUNASARQUIVO = "";
			i3GEOadmin.uploaddados.NOMEARQUIVOSERV = "";
			core_carregando("enviando...");
		},
		comboColunas: function(id){
			var i=0,
				c = i3GEOadmin.uploaddados.COLUNASARQUIVO.split(","),
				n = c.length,
				ins = "<div class='styled-select'><select id='"+id+"'><option value='' >---</option>";
			for(i=0;i<n;i++){
				ins += "<option value='"+c[i]+"' >"+c[i]+"</option>";
			}
			ins += "</select></div>";
			return ins;
		},
		tipoValores: function(id){
			var i=0,
				c = ["inteiro","num&eacute;rico","texto"],
				d = ["valor_int","valor_num","valor_txt"],
				n = c.length,
				ins = "<div class='styled-select'><select id='"+id+"'><option value='' >---</option>";
			for(i=0;i<n;i++){
				ins += "<option value='"+d[i]+"' >"+c[i]+"</option>";
			}
			ins += "</select></div>";
			return ins;
		},
		tipoInclusao: function(id){
			var i=0,
				c = ["substituir","acrescentar"],
				d = ["substituir","acrescentar"],
				n = c.length,
				ins = "<div class='styled-select'><select id='"+id+"'><option value='' >---</option>";
			for(i=0;i<n;i++){
				ins += "<option value='"+d[i]+"' >"+c[i]+"</option>";
			}
			ins += "</select></div>";
			return ins;
		},
		fimsubmit: function(){
			core_carregando("desativa");
			var botao, ins = "";
			ins += "<p class=paragrafo ><b>Abaixo voc&ecirc; deve definir quais colunas do arquivo que foi enviado corresponde &agrave;s colunas do banco de dados de destino</b></p>" +
				"<p class=paragrafo >Cont&eacute;m os c&oacute;digos que identificam o limite geogr&aacute;fico, como o c&oacute;digo do munic&iacute;pio ou bairro</p>" +
				i3GEOadmin.uploaddados.upload.comboColunas("i3geoupload_codigoregiao") +
				"<p class=paragrafo >Cont&eacute;m os valores da medida</p>" +
				i3GEOadmin.uploaddados.upload.comboColunas("i3geoupload_valor") +
				"<p class=paragrafo >Cont&eacute;m o ano (opcional)</p>" +
				i3GEOadmin.uploaddados.upload.comboColunas("i3geoupload_ano") +
				"<p class=paragrafo >Cont&eacute;m o m&ecirc;s (opcional)</p>" +
				i3GEOadmin.uploaddados.upload.comboColunas("i3geoupload_mes") +
				"<p class=paragrafo >Cont&eacute;m o dia (opcional)</p>" +
				i3GEOadmin.uploaddados.upload.comboColunas("i3geoupload_dia") +
				"<p class=paragrafo >Cont&eacute;m a hora (opcional)</p>" +
				i3GEOadmin.uploaddados.upload.comboColunas("i3geoupload_hora") +
				//"<p>Tipo de valores</p>" +
				//i3GEOadmin.uploaddados.upload.tipoValores("i3geoupload_tipoval") +
				"<p class=paragrafo >Tipo de inclus&atilde;o</p>" +
				i3GEOadmin.uploaddados.upload.tipoInclusao("i3geoupload_tipoinclusao") +
				"<p class=paragrafo ><input type=button value='Concluir envio' id='i3geoupload_concluir' /></p>";

			$i(i3GEOadmin.uploaddados.upload.onde).innerHTML = ins;
			botao = new YAHOO.widget.Button(
				"i3geoupload_concluir",
				{onclick:{fn: i3GEOadmin.uploaddados.upload.concluir}}
			);
			botao.addClass("rodar");
		},
		verificaForm: function(){
			var el = ["i3GEOadminEditorMedidas_combo","i3GEOadminEditorVariaveis_combo","i3geoupload_codigoregiao","i3geoupload_valor","i3geoupload_tipoinclusao"],
				i = 0,
				n = el.length,
				ok = true;
			for(i=0;i<n;i++){
				if(!$i(el[i])){
					ok = false;
				}
				if($i(el[i]) && $i(el[i]).value == ""){
					ok = false;
				}
			}
			if(i3GEOadmin.uploaddados.COLUNASARQUIVO === "" || i3GEOadmin.uploaddados.NOMEARQUIVOSERV === ""){
				ok = false;
			}
			return ok;
		},
		concluir: function(){
			if(i3GEOadmin.uploaddados.upload.verificaForm() === false){
				alert("Verifique a escolha dos parametros");
				return;
			};
			var par = "";
			par += "&nomearquivoserv="+i3GEOadmin.uploaddados.NOMEARQUIVOSERV;
			par += "&id_medida_variavel="+$i("i3GEOadminEditorMedidas_combo").value;
			par += "&codigoregiao="+$i("i3geoupload_codigoregiao").value;
			par += "&valor="+$i("i3geoupload_valor").value;
			//par += "&tipoval="+$i("i3geoupload_tipoval").value;
			par += "&tipoinclusao="+$i("i3geoupload_tipoinclusao").value;
			par += "&ano="+$i("i3geoupload_ano").value;
			par += "&mes="+$i("i3geoupload_mes").value;
			par += "&dia="+$i("i3geoupload_dia").value;
			par += "&hora="+$i("i3geoupload_hora").value;
			var callback = {
					success:function(o){
						try	{
							core_carregando("desativa");
							alert(o.responseText);
						}
						catch(e){core_handleFailure(e,o.responseText);}
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
			};
			core_carregando("inserindo dados...");
			if(i3GEO && i3GEO.configura.locaplic){
				core_makeRequest(i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=inserirDados"+par,callback);
			}
			else{
				core_makeRequest("../php/metaestat.php?funcao=inserirDados"+par,callback);
			}
		}
	},
	conexao:{
		onde: "i3GEOadminUploaddadosConexao",
		lista: function(){
			var callback = {
					success:function(o){
						try	{
							var dados = YAHOO.lang.JSON.parse(o.responseText),
							temp = "<p>Escolha a conex&atilde;o com o banco que receber&aacute; os dados:</p>";
							temp += "<div class='styled-select'><select id='i3GEOadmincodigo_estat_conexao' style='box-shadow:0 1px 5px gray;width:"+(i3GEOF.metaestat.LARGURA - 20)+"px'>";
							temp += core_comboObjeto(dados,"codigo_estat_conexao","bancodedados","","usuario");
							temp += "</select></div>";
							$i(i3GEOadmin.uploaddados.conexao.onde).innerHTML = temp;
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
	variaveis:{
		onde: "i3GEOadminUploaddadosVariaveis",
		lista: function(){
			i3GEOF.metaestat.comum.aguarde($i(i3GEOadmin.uploaddados.variaveis.onde));
			i3GEO.php.listaVariavel(i3GEOadmin.uploaddados.variaveis.combo,"i3geo_metaestat");
		},
		combo: function(dados){
			if(dados.length == 0){
				$i(i3GEOadmin.uploaddados.variaveis.onde).innerHTML = "<span style=color:red >N&atilde;o existem vari&aacute;veis cadastradas que possam ser editadas. Apenas as vari&aacute;veis criadas por meio do assistente podem ser editadas.</span>";
				return;
			}
			else{
				$i(i3GEOadmin.uploaddados.variaveis.onde).innerHTML = "<p class=paragrafo >Escolha a vari&aacute;vel</p>" +
					i3GEOF.metaestat.principal.comboVariaveis(dados,"i3GEOadminEditorVariaveis_combo","i3GEOadmin.uploaddados.medidas.lista()","250","nao","nao");
				if($i("i3GEOadminEditorVariaveis_combo").value != ""){
					i3GEOadmin.uploaddados.medidas.lista();
				}
			}
		}
	},
	medidas:{
		onde: "i3GEOadminUploaddadosMedidas",
		lista: function(){
			if($i("i3GEOadminEditorVariaveis_combo").value == ""){
				$i(i3GEOadmin.uploaddados.medidas.onde).innerHTML = "";
				return ;
			}
			i3GEOF.metaestat.comum.aguarde($i(i3GEOadmin.uploaddados.medidas.onde));
			i3GEO.php.listaMedidaVariavel($i("i3GEOadminEditorVariaveis_combo").value,i3GEOadmin.uploaddados.medidas.combo);
		},
		combo: function(dados){
			$i(i3GEOadmin.uploaddados.medidas.onde).innerHTML = "<p class=paragrafo >Escolha a medida da vari&aacute;vel</p>" +
				i3GEOF.metaestat.principal.comboMedidasVariavel(dados,"i3GEOadminEditorMedidas_combo","","","250","nao","nao");
		}
	}
};