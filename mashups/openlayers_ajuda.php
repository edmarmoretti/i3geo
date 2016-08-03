<?php
include(dirname(__FILE__)."/../versao.php");
include_once(dirname(__FILE__)."/../classesphp/sani_request.php");
$completo = "block";
if(!empty($_GET["completo"]) && $_GET["completo"] == "none"){
	$completo = "none";
}
?>
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<title></title>
<link rel="stylesheet" href="openlayers.css" type="text/css" />
<style>
p,td
{
	text-align:left;
	border: 0px solid #FFFFFF;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	position:relative;
	font-size:14px;
	padding:2px;
}
.olControlEditingToolbar1 {
	height: 20px;
	left: 20px;
	position: relative;
	width: 90%;
	float: left;
}

</style>

</head>
<body>
<div style="text-align:left;display:<?php echo $completo;?>" >
<p><img src="../imagens/i3geo1.jpg" /></p>
<p><?php echo $mensagemInicia;?></p>
<p style='font-size:16px'>Documenta&ccedil;&atilde;o do editor</p>
<p>Para ver os par&acirc;metros que podem ser utilizados na URL para abrir o mapa, <a href='openlayers.php?ajuda' target='_blank'>clique aqui</a></p>

</div>
<table class="olControlEditingToolbar1" >
	<tr>
		<td style=width:20px ><div class="editorOLprocuraItemInactive"></div></td>
		<td>Procure um elemento no tema que estiver ativo</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLpanItemInactive"></div></td>
		<td>Clique e arraste um ponto no mapa para deslocar a regi&atilde;o vis&iacute;vel</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLzoomboxItemInactive"></div></td>
		<td>Desenhe um ret&acirc;ngulo no mapa para alterar a regi&atilde;o vis&iacute;vel</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLzoomtotItemInactive"></div></td>
		<td>Altere a abrang&ecirc;ncia do mapa para que a regi&atilde;o toda fique vis&iacute;vel</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLlegendaItemInactive"></div></td>
		<td>Veja a legenda do mapa</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLdistanciaItemInactive"></div></td>
		<td>Calcule a dist&acirc;ncia entre pontos indicados no mapa. Clique em v&aacute;rios lugares, tra&ccedil;ando uma linha. Para terminar, clique duas vezes sobre o mesmo ponto.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLareaItemInactive"></div></td>
		<td>Calcule a &aacute;rea de uma regi&atilde;o do mapa. Clique em v&aacute;rios pontos, tra&ccedil;ando uma figura. Para terminar, clique duas vezes sobre o mesmo ponto.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLidentificaItemInactive"></div></td>
		<td>Clique em um lugar no mapa para ver as informa&ccedil;&otilde;es descritivas. Ao ativar essa fun&ccedil;&atilde;o, se aberta uma telka com a lista de camadas, escolha qual camada do mapa ser&aacute; utilizada para obter os dados. No cabe&ccedil;alho dos resultados, aparecer&aacute; a op&ccedil;&atilde;o 'capturar'. Clique nela para obter a geometria encontrada. Essa geometria poder&aacute; ent&atilde;o ser editada.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLlinhaItemInactive"></div></td>
		<td>Digitalize uma nova linha. Clique em um nó inicial e nos v&eacute;rtices posteriores. Termine com um duplo clique.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLpontoItemInactive"></div></td>
		<td>Digitalize um novo ponto</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLpoligonoItemInactive"></div></td>
		<td>Digitalize um novo pol&iacute;gono. Clique em um nó inicial e nos v&eacute;rtices posteriores. Termine com um duplo clique. Pressione "shift" para desenhar com a m&atilde;o livre.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLeditaItemInactive"></div></td>
		<td>Edite uma geometria selecionada. Após ativar essa op&ccedil;&atilde;o, clique na geometria desejada para que as op&ccedil;&otilde;es de edi&ccedil;&atilde;o fiquem ativas. Clique e arraste o ponto ou v&eacute;rtice destacado ou pressione 'del' para apagar um ponto ou v&eacute;rtice indicado.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLtoolsItemInactive"></div></td>
		<td>Modifique as geometrias aplicando opera&ccedil;&otilde;es como uni&atilde;o, intersec&ccedil;&atilde;o, etc.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLselecaoItemInactive"></div></td>
		<td>Clique sobre uma geometria para selecion&aacute;-la. Utilize a tecla 'shift' para adicionar ou remover geometrias de um conjunto selecionado.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLapagaItemInactive"></div></td>
		<td>Clique para apagar as geometrias selecionadas.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLundoItemInactive"></div></td>
		<td>Recupere a &uacute;ltima geometria apagada ou modificada.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLsalvaItemInactive"></div></td>
		<td>Converta para shapefile, salve ou obtenha as coordenadas das geometrias selecionadas.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLfrenteItemInactive"></div></td>
		<td>Traz a figura selecionada para a frente das demais.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLpropriedadesItemInactive"></div></td>
		<td>Defina as propriedades de edi&ccedil;&atilde;o, como a dist&acirc;ncia de aproxima&ccedil;&atilde;o e outros comportamentos das opera&ccedil;&otilde;es. Defina tamb&eacute;m o comportamento da ferramenta de edi&ccedil;&atilde;o, permitindo alterar uma figura ou rotacion&aacute;-la, mov&ecirc;-la ou redimensionar.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editorOLajudaItemInactive"></div></td>
		<td>Abre essa p&aacute;gina de ajuda.</td>
	</tr>
</table>
</body>
</html>