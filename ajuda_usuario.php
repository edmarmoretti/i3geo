<?php
include("classesphp/pega_variaveis.php");
?>
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="css/i3geo_ferramentas.css">
<title></title>
</head>
<body>
<div style=text-align:center >
<p><img src="imagens/i3geo1.jpg" />
<p style='font-size:16px'>Documentação do usuário. Para ver toda a documentação, 
clique <a href="ajuda_usuario.php" >aqui</a></p><br>
</div>
<div id=resultado >
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
			ins += "<p style='font-size:16px'>"+obj[k].titulo+"</p>"
			ins += "<p>"+obj[k].pt+"</p>"
			ins += "<p>"+obj[k].complemento+"</p>"
			ins += "<p style='color:gray'>"+obj[k].diretorio+"</p>"
		}
	}	
}
function inicia()
{
	ins = "<div>"
	for(var key in g_traducao_ajuda_categorias){
		if(idcategoria != "" && idcategoria != key)
		{}
		else
		{
			ins += "<p style='font-size:18px' ><b>"+g_traducao_ajuda_categorias[key].titulo+"</b></p>"
			pegaAjuda("ferramentas",g_traducao_ajuda_categorias[key])
		}
	}
	document.getElementById("resultado").innerHTML = ins+"</div>"
}
inicia()
</script>
</body>
</html>