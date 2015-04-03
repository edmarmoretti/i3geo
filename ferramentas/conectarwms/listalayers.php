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
</style>
</head>
<body class="yui-skin-sam" >
	<div id=geral style="left:0px;top:0px;">
		<div class=guiaobj id="guia3obj" style="left:0px;display:block;">
			<div id="aguarde">
				<img alt="" src="../../imagens/aguarde.gif" />Aguarde...
			</div>
			<div style="text-align:left;top:0px;left:0px;font-size:10px">
				<div id=men2 style="top:5px;left:0px;">
				Ap&oacute;s a conex&atilde;o ser estabelecida e surgir a lista de temas, selecione a camada que ser&aacute; adicionada ao mapa.<br>
				</div>
				<div id=textoSLD style="display:none;font-size:10px" >
				<p>Opcionalmente vc pode indicar o tipo de representa&ccedil;&atilde;o que ser&aacute; utilizada.<br>
				N&atilde;o altere o tipo de representa&ccedil;&atilde;o se a camada escolhida for uma imagem (dados raster) ou se voc&ecirc; tiver d&uacute;vidas sobre ela.<br>
				<div class=styled-select><select id=tiporep >
				<option value="">---</option>
				<option value="poligonal">poligonal</option>
				<option value="linear">linear</option>
				<option value="pontual">pontual</option>
				</select>
				</div>
				</div>

			</div>
			<div id=listatemas style="display:block;position:relative;top:10px;left:0px;">
			</div>
		</div>
	</div>
<input type=hidden id=servico value="<?php echo $_GET["servico"];?>" />

<script src="../i3geo_tudo_compacto.js.php" type="text/javascript"></script>

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
clickGuia3(codLayer);
</script>
</body>
</html>
