<?php
/*
Title: ajuda_usuario.php

Lista as funcionalidades cadastradas em i3geo/classesjs/dicionario_ajuda.js. A listagem é organizada em grupos que podem ser expandidos individualmente ou no total.

É utilizado pelo i3geo para fornecer ajuda ao usuário em como utilizar as funcionalidades cadatsradas.

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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

Arquivo: i3geo/ajuda_usuario.php

Parametros:

idcategoria {string} - (opcional) id da categoria que será listada. Lista apenas uma categoria de funcionalidade

idajuda {string} - (opcional) id da funcionalidade. Lista apenas uma funcionalidade
*/
include("classesphp/pega_variaveis.php");
include("ms_configura.php");
?>
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="css/i3geo_ferramentas.css">
<title></title>
</head>
<body style=overflow:auto; >
<div style=text-align:center;width:600px >
<p><img src="imagens/i3geo1.jpg" />
<p style='font-size:16px'>Documentação do usuário. 
<p><?php echo $mensagemInicia;?></p>
<?php
if (isset($idcategoria))
{
	echo "<p>Para ver toda a documentação, ";
	echo "clique <a href='ajuda_usuario.php' >aqui</a>";
}
else
{
	echo "<p style='padding-left:10px;text-align:left;color:blue;cursor:pointer' onclick='expandirtudo()'>expandir tudo</p>";
}
?>
</div>
<div id=resultado style='width:600px;'>
</div>
<script language="JavaScript" type="text/javascript" src="classesjs/dicionario_ajuda.js"></script>
<script>
var idcategoria = "<?php echo $idcategoria;?>"
var idajuda = "<?php echo $idajuda;?>"

function pegaAjuda(tipo,categoria){
	eval("var obj = g_traducao_ajuda."+tipo)
	for(var k in obj){
		if(idajuda != "" && idajuda != k)
		{}
		else
		{
			if(idajuda == "" && categoria != obj[k].categoria){}
			else{
				ins += "<br><li onclick='expande(\""+k+"\")' style='cursor:pointer;font-size:16px;color:#759555'><b>"+obj[k].titulo+"</b></li>"
				ins += "<div id='"+k+"' style='display:none'><p>"+obj[k].pt+"</p>"
				ins += "<p>"+obj[k].complemento+"</p>"
				ins += "<p style='color:gray;padding-left:20px'>"+obj[k].diretorio+"</p>"
				if(obj[k].apijs){
					ins += "<p style='color:gray;padding-left:20px'>API js: "+obj[k].apijs+"</p>"
				}
				if(obj[k].tela){
					ins += "<p><a href='"+obj[k].tela+"' target=_blank style='padding-left:20px' >Exemplo de tela</a></p>"
				}
				if(obj[k].gadget){
					ins += "<p><a href='"+obj[k].gadget+"' target=_blank style='padding-left:20px' >Gadget</a></p>"
				}

				ins += "</div>"
			}
			
		}
	}
}
function inicia()
{
	ins = "<div style='text-align:justify'>"
	for(var key in g_traducao_ajuda_categorias){
		if(idcategoria != "" && idcategoria != key)
		{}
		else
		{
			if(idajuda == "")
			ins += "<p style='font-size:18px' ><b>"+g_traducao_ajuda_categorias[key].titulo+"</b></p>"
			if(g_traducao_ajuda_categorias[key].observacao)
			ins += "<p style='font-size:14px;color:gray' >"+g_traducao_ajuda_categorias[key].observacao+"</p>"
			if(idajuda == "")
			pegaAjuda("ferramentas",key)
			else{
				pegaAjuda("ferramentas",g_traducao_ajuda_categorias[key])
			}
		}
	}
	document.getElementById("resultado").innerHTML = ins+"</div>"
	if(idcategoria != ""){expande(idajuda)}
}
function expande(id){
	var i = document.getElementById(id);
	if(i.style.display=="none")
	i.style.display = "block";
	else
	i.style.display="none"	
}
function expandirtudo(){
	for(var key in g_traducao_ajuda.ferramentas){
		var j = document.getElementById(key);
		if(j)
		{expande(key)}	
	}
}
inicia()
</script>
</body>
</html>