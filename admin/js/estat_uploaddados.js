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
		i3GEOadmin.uploaddados.conexao.lista();
	},
	upload:{
		submit: function(){
			core_carregando("enviando...");
		},
		comboColunas: function(id){
			var i=0,
				c = i3GEOadmin.uploaddados.COLUNASARQUIVO,
				n = c.length,
				ins = "<select id='"+id+"'>";
			for(i=0;i<n;i++){
				ins += "<option value='"+c[i]+"' >"+c[i]+"</option>";
			}
			ins = "</select>";
			return ins;
		},
		fimsubmit: function(){
			//TODO escolher a tabela
			core_carregando("desativa");
			var ins = "";
			ins += "<p>Abaixo voc&circ; deve definir quais colunas do arquivo que foi enviado corresponde &agrave;s colunas do banco de dados de destino</p>" +
				"<p>Cont&eacute;m os c&oacute;digos que identificam a regi&atilde;o, como o c&oacute;digo do munic&iacute;pio ou bairro</p>" +
				i3GEOadmin.uploaddados.upload.comboColunas("i3geoupload_codigoregiao") +
				"<p>Cont&eacute;m os valores da medida</p>" +
				i3GEOadmin.uploaddados.upload.comboColunas("i3geoupload_valor") +
				"<p>Cont&eacute;m o ano (opcional)</p>" +
				i3GEOadmin.uploaddados.upload.comboColunas("i3geoupload_ano") +
				"<p>Cont&eacute;m o m&ecirc;s (opcional)</p>" +
				i3GEOadmin.uploaddados.upload.comboColunas("i3geoupload_mes") +
				"<p>Cont&eacute;m o dia (opcional)</p>" +
				i3GEOadmin.uploaddados.upload.comboColunas("i3geoupload_dia") +
				"<p>Cont&eacute;m a hora (opcional)</p>" +
				i3GEOadmin.uploaddados.upload.comboColunas("i3geoupload_hora") +
				"<p>Tipo de valores</p>";
		}
	},
	conexao:{
		onde: "i3GEOadminUploaddadosConexao",
		lista: function(){
			var callback = {
					success:function(o){
						try	{
							var dados = YAHOO.lang.JSON.parse(o.responseText),
							temp = "<p>Escolha a conex&atilde;o com o banco:</p>";
							temp += "<select id='i3GEOadmincodigo_estat_conexao' >";
							temp += core_comboObjeto(dados,"codigo_estat_conexao","bancodedados","","usuario");
							temp += "</select>";
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
			$i(i3GEOadmin.uploaddados.variaveis.onde).innerHTML = "<p>Escolha a vari&aacute;vel que receberá os dados</p>" +
				i3GEOF.metaestat.principal.comboVariaveis(dados,"i3GEOadminEditorVariaveis_combo","i3GEOadmin.uploaddados.medidas.lista()");
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
			$i(i3GEOadmin.uploaddados.medidas.onde).innerHTML = "<p>Escolha a medida da vari&aacute;vel</p>" +
				i3GEOF.metaestat.principal.comboMedidasVariavel(dados,"i3GEOadminEditorMedidas_combo","");
		}
	}
};