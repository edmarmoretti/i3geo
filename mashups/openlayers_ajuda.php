<?php
include("../versao.php");
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
    width: 100%;
	float: left;
}

</style>

</head>
<body >
<div style=text-align:left >
<p><img src="../imagens/i3geo1.jpg" /></p>
<p><?php echo $mensagemInicia;?></p>
<p style='font-size:16px'>Documentação do editor</p>
</div> 
<table class="olControlEditingToolbar1" >
	<tr>
		<td style=width:20px ><div class="procuraItemInactive"></div></td>
		<td>Procure um elemento no tema que estiver ativo</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="panItemInactive"></div></td>
		<td>Clique e arraste um ponto no mapa para deslocar a região visível</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="zoomboxItemInactive"></div></td>
		<td>Desenhe um retângulo no mapa para alterar a região visível</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="zoomtotItemInactive"></div></td>
		<td>Altere a abrangência do mapa para que a região toda fique visível</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="legendaItemInactive"></div></td>
		<td>Veja a legenda do mapa</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="distanciaItemInactive"></div></td>
		<td>Calcule a distância entre pontos indicados no mapa. Clique em vários lugares, traçando uma linha. Para terminar, clique duas vezes sobre o mesmo ponto.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="areaItemInactive"></div></td>
		<td>Calcule a área de uma região do mapa. Clique em vários pontos, traçando uma figura. Para terminar, clique duas vezes sobre o mesmo ponto.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="identificaItemInactive"></div></td>
		<td>Clique em um lugar no mapa para ver as informações descritivas. Ao ativar essa função, se aberta uma telka com a lista de camadas, escolha qual camada do mapa será utilizada para obter os dados. No cabeçalho dos resultados, aparecerá a opção 'capturar'. Clique nela para obter a geometria encontrada. Essa geometria poderá então ser editada.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="linhaItemInactive"></div></td>
		<td>Digitalize uma nova linha</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="pontoItemInactive"></div></td>
		<td>Digitalize um novo ponto</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="poligonoItemInactive"></div></td>
		<td>Digitalize um novo polígono</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="editaItemInactive"></div></td>
		<td>Edite uma geometria selecionada. Após ativar essa opção, clique na geometria desejada para que as opções de edição fiquem ativas. Clique e arraste o ponto ou vértice destacado ou pressione 'del' para apagar um ponto indicado.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="selecaoItemInactive"></div></td>
		<td>Clique sobre uma geometria para selecioná-la. Utilize a tecla 'shift' para adicionar ou remover geometrias de um conjunto selecionado.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="apagaItemInactive"></div></td>
		<td>Clique para apagar as geometrias selecionadas.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="salvaItemInactive"></div></td>
		<td>Salve ou obtenha as coordenadas das geometrias selecionadas.</td>
	</tr>
	<tr>
		<td style=width:20px ><div class="propriedadesItemInactive"></div></td>
		<td>Defina as propriedades de edição, como a distância de aproximação eoutros comportamentos das operações</td>
	</tr>	
	<tr>
		<td style=width:20px ><div class="ajudaItemInactive"></div></td>
		<td>Abre essa página de ajuda.</td>
	</tr>	
</table>
</body>
</html>