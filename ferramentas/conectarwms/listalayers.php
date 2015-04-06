<?php
/**
 * Este programa e utilizado pela ferramenta buscainde
 * E uma copia da ferramenta conctarwms sem mostrar as guias de esolha de servico
 * Isso pq o endereco do servico e um parametro obtido em $_GET["servico"]
 */
?>
<html>

<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="../../css/i3geo_ferramentas6.css">
<title></title>
<style type="text/css" >button{background:url(../../imagens/tic.png) 98% 50% no-repeat;}</style>
<link rel="stylesheet" type="text/css" href="../../pacotes/yui290/build/button/assets/skins/sam/button.css"/>
<style type="text/css">
body {
	margin:0;
	padding:0;border:0px;
}
p{
	text-align: left;
}
.guiaobj {
	background-color: white;
	display: block;
	height: 97%;
	left: 0;
	overflow: auto;
	text-align: left;
	top: 0;
	width: 98%;
}
</style>
</head>
<body class="yui-skin-sam" style="background-color: white;">

		<div class=guiaobj id="guia3obj" style="left:0px;display:block;">
			<div id=listatemas style="display:block;position:relative;top:10px;left:0px;">
			Aguarde...
			</div>
		</div>

<input type=hidden id=servico value="<?php echo $_GET["servico"];?>" />

<script type="text/javascript" src="../../classesjs/i3geo.js"></script>
<script type="text/javascript" src="index.js"></script>

<script type="text/javascript" >
//
//tenta pegar o codigo do layer do endereco do servico
//
var buscarEm = ["LAYER","LAYERS","layer","layers","tema","typename","typeName"],
	n = buscarEm.length,
	i,s,partes,
	b = [],
	codLayer = "",
	u = window.location.href;

//acrescenta novas strings
for(i = 0; i < n; i++){
	b.push("&" + buscarEm[i] + "=");
	b.push("?" + buscarEm[i] + "=");
}
n = b.length;
//quebra as strings pra achar o padrao
for(i = 0; i < n; i++){
	s = b[i];
	partes = u.split(s);
	if(partes.length > 1){
		partes = partes[1].split("&");
		codLayer = partes[0];
	}
}
g_locaplic = "../..";
//console.info(codLayer)
clickGuia3(codLayer);
</script>
</body>
</html>
