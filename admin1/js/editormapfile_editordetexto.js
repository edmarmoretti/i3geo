//
//Utilizado por editormapfile.js
//
//
//Dependencias: Este programa necessita do arquivo "../dicionario/editormapfile.js"
//
function editorDeTexto(codigoMap)
{
	core_carregando("ativa");
	core_carregando($trad("obtemDados",i3GEOadmin.core.dicionario));
	sUrl = "../php/editormapfile.php?funcao=pegaTextoMapfile&codigoMap="+codigoMap;
	var callback =
	{
		success:function(o)
		{
			core_montaEditor("","600px","800px","","Editor");
			var ins = "<input type=button id=salvarTexto value='Salvar' />";
			ins += "<textarea id='editorArea' rows='19' cols='70'>"+YAHOO.lang.JSON.parse(o.responseText)+"</textarea>";
			var botao, temp = function()
			{
				core_carregando("ativa");
				core_carregando($trad("salvaTxt",i3GEOadmin.core.dicionario));
				var callback1 =
				{
					success:function(o)
					{
						$i("editorArea").innerHTML = YAHOO.lang.JSON.parse(o.responseText);
						core_carregando("desativa");
					},
					failure:core_handleFailure,
					argument: { foo:"foo", bar:"bar" }
				};
				var linhas = $i("editorArea").value.split("\n");
				var tempLinhas = "";
				for(var i=0, j=linhas.length; i<j; i++)
				{tempLinhas += linhas[i]+"xxxxxxxx";}
				sUrl = "../php/editormapfile.php?funcao=salvaTextoMapfile&codigoMap="+codigoMap+"&texto="+tempLinhas;
				core_makeRequest(sUrl,callback1,"GET");
			};
			$i("editor_bd").innerHTML = ins;
			botao = new YAHOO.widget.Button("salvarTexto",{ onclick: { fn: temp }});
			botao.addClass("rodar");
			core_carregando("desativa");
		},
		failure:core_handleFailure,
		argument: { foo:"foo", bar:"bar" }
	};
	core_makeRequest(sUrl,callback);
}
