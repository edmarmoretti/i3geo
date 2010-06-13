parametrosURL()
var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=pegalistacompleta"
var cp = new cpaint();
//cp.set_debug(2)
cp.set_response_type("JSON");
cp.call(p,"pegaListaCompleta",processaTemas);
function processaTemas(retorno)
{
	if (retorno.data != undefined)
	{
		var retorno = retorno.data
		ins = ""
		var notWhitespace = /\S/;
		var grupos = retorno.split("**")
		for (ig=0;ig<grupos.length;ig++)
		{
			var  temp = grupos[ig].split("||")
			var nomeGrupo = temp[0]
			var ngSgrupo = temp[1].split("##")
			for (sg=0;sg<ngSgrupo.length;sg++)
			{
				var temp = ngSgrupo[sg].split("#")
				var nomeSgrupo = temp[0]
				var ngTema = temp[1].split("*")
				for (st=0;st<ngTema.length;st++)
				{
					var temp = ngTema[st].split("|")
					var nome = temp[1]
					var lk = ""
					if ( temp[2] != "")
					{var lk = "<a href="+temp[2]+" target=blank>&nbsp;fonte</a>"}
					var tid = temp[0]
					var inp = "<input style='text-align:left' onclick='mudaboxnf()' class=inputsb style='cursor:pointer' type=\"checkbox\" value="+tid+" onmouseover=\"javascript:mostradicasf(this,'Clique para ligar ou desligar esse tema','ligadesliga')\" onmouseout=\"javascript:mostradicasf(this,'')\" />"
					nomeTema = inp+nome+lk
					if (temp[3] == "sim")
					{
						var inp = "<p><img src="+g_locaplic+"/imagens/down1.gif style='cursor:pointer;text-align:left' onclick='window.parent.download(\""+tid+"\")' />&nbsp;"
						ins += inp+nome+" <span style='color:gray'> ("+nomeGrupo+"->"+nomeSgrupo+")</span><br><br>"
					}
				}
			}
		}
		$i("resultado").innerHTML = ins
	}
	else
	{
		aguarde("none")
		$i("resultado").innerHTML = "<p style=color:red >Ocorreu um erro<br>"
	}
}
