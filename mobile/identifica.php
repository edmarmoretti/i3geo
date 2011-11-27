<?php
/*
Title: identifica.php

Identifica elementos no mapa em determinada coordenada x e y e apresenta o resultado na tela

Licenca:

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo: i3geo/mobile/adicionatema.php

Parametro:

tmpfname {string} - nome do mapfile em uso

x {numerico} - coordenada x em unidades de tela

y {numerico} - coordenada y em unidades de tela
*/

error_reporting(0);
require_once("../classesphp/funcoes_gerais.php");
include_once ("../classesphp/pega_variaveis.php");
include_once("../classesphp/carrega_ext.php");
require_once("../classesphp/classe_vermultilayer.php");
require_once("../classesphp/classe_atributos.php");
?>
<html>
<style>
body
{
	font:14pt arial,helvetica,clean,sans-serif;
	color:rgb(100,100,100);
}
p
{
	font:12pt arial,helvetica,clean,sans-serif;
	color:black;
}
input
{
	font:14pt arial,helvetica,clean,sans-serif;
	color:black;
	cursor:pointer;
	background-color:white;
}
h1
{
	font:16pt arial,helvetica,clean,sans-serif;
	color:brown;
}
</style>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../css/i3geo_ferramentas45.css">
<body>
<form id='f' action='mobile.php?' method='get'>
	<input type='hidden' name='tmpfname' value='<?php echo $tmpfname; ?>' />
	<input id='tipo' type=hidden name='tipo' value='retorno' />
	<input id='tema' type=hidden name='tema' value='' />
</form>
<input type='button' value='retorna' style='cursor:pointer;' onclick='retorno()' />
<br><br>
<?php
if (!isset($tema)){$tema = "";}
if (!isset($resolucao)){$resolucao = 5;}
$xy = imagem2xy($tmpfname,($x." ".$y));
$m = new Atributos($tmpfname);
$retorno = $m->identifica("ligados",implode(",",$xy),$resolucao);
echo "Coordenadas: ".implode(",",$xy)."<br><br>";
?>
<div id=ocorrencia ></div>
<br><input type='button' value='retorna' style='cursor:pointer;' onclick='retorno()' /><br>
</body>
<script>

function mostraf(retorno)
{
	var res = ""
	if (retorno != undefined)
	{
		var re = new RegExp("zzzzzzzzzz","g")
		var retorno = retorno.replace(re,"<br>")
		var re = new RegExp('" ',"g")
		var retorno = retorno.replace(re,'"<br>')
		var re = new RegExp("' ","g")
		var retorno = retorno.replace(re,"'<br>")	
		var reg = /Erro./;
		if (retorno.search(reg) != -1)
		{
			document.getElementById("ocorrencia").innerHTML="OOps! Ocorreu um erro\n"+retorno;
			return;
		}
		var octemas = retorno.split("!")
		for (octemasc=0;octemasc<octemas.length;octemasc++)
		{
			var titulo = octemas[octemasc].split("@")
			var contat = 0
			if (!titulo[1])
			{
				continue
			}
			var ocs = titulo[1].split("*")
			res += "<div style='color:black;font-size:14px;left:2px;text-align:left;background-color:white;width:80%' >"+titulo[0]+"</div>"
			//verifica se é WS
			var pares = ocs[1].split("##")
			var valores = pares[0].split("#")
			//dados vem de uma chamada WS
			if (valores[1] == undefined)
			{
				res += "<div style=text-align:left;font-size:14px >Resultado: <pre><i>" + valores[0] + "</i></pre></div>"
				res += "<div>------</div>"
				document.getElementById("ocorrencia").innerHTML=res
				//return
			}
			var contao = 0
			for (oc=0;oc<ocs.length;oc++)
			{
				if (ocs[oc] != "")
				{
					var pares = ocs[oc].split("##")
					if (contao == 1){var ver = true}
					else {var ver = false}
					var contav = 0
					var cor = "RGB(245,245,245)";
					for (par=0;par<pares.length;par++)
					{
						var valores = pares[par].split("#")
						var vlink = valores[2]
						if ((valores[2] != " ") && (valores[2] != undefined))
						{res = res + "<div style='font-size:14px;width:80%;text-align:left;background-color:"+cor+"' >&nbsp;&nbsp;" + valores[0] + " <a href='" + vlink + "' > link</a></div>"}
						else if ((valores[2] == " ") || (valores[2] != undefined))
						{
							var testaIcone = (valores[0].split(".png")).length
							if (testaIcone == 1) //nao é do tipo ícone
							{res = res + "<div style='font-size:14px;border-top:0px solid brown;width:90%;text-align:left;background-color:"+cor+"' ><b>&nbsp;&nbsp;" + valores[0] + " </b>" + valores[1] + "</div>"}
							else //corrige o caminho do ícone
							{
								var i = valores[0] //.replace("..","../..")
								res = res + "<div style='width:80%;text-align:left;background-color:"+cor+"' >" + i + " <i>" + valores[1] + "</i></div>"
							}
						}
						contav = contav + 1
						if (cor == "RGB(245,245,245)"){cor = "RGB(230,230,230)";}
						else
						{cor = "RGB(245,245,245)";}
					}
					//res += "<div style='border-top:1px solid gray;background-color:gray;width:100%;' ><br></div>"
				}
				contao = contao + 1
			}
		}
		document.getElementById("ocorrencia").innerHTML=res
	}
	else
	{
		document.getElementById("ocorrencia").innerHTML = "<p style=color:red >Ocorreu um erro<br>"
	}
}
function retorno()
{
	document.getElementById('tipo').value='retorno';
	document.getElementById('f').action = 'mobile.php';
	document.getElementById('f').submit();
}
mostraf(<?php echo '"'.(mb_convert_encoding($retorno,"ISO-8859-1","UTF-8")).'"'; ?>)
</script>
</html>