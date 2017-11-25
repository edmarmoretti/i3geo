//+$trad(1,i3GEOF.gradeDePoligonos.dicionario)+
i3GEOF.melhorcaminho.dicionario = {
	'ajuda' : [ {
		pt : "O melhor caminho &eacute; calculado sobre uma imagem raster. Os valores dos pixels ser&atilde;o considerados como o custo.",
		en : "The best route is calculated over a raster image. Pixel values will be considered as the cost.",
		es : "La ruta &oacute;ptima se calcula sobre una imagen raster. Los valores de los p&iacute;xeles se considerar&aacute;n como el costo."
	} ],
	'ajuda2' : [ {
		pt : "O c&aacute;lculo &eacute; feito a partir de um ponto inicial e um final. Esses dois pontos podem ser apontados no mapa ou pode ser utilizada uma camada j&aacute; existente no mapa.",
		en : "The calculation is done from a starting point to an ending point. These two points can be clicked on the map or you can use an existing map layer.",
		es : "El c&aacute;lculo se realiza desde un punto inicial hasta un punto final. Estos dos puntos se pueden se&ntilde;alar en el mapa o se puede utilizar una capa existente en el mapa."
	} ],
	'ajuda3' : [ {
		pt : "O resultado do c&aacute;lculo ser&aacute; inclu&iacute;do no mapa como uma nova camada com dados no formato shapefile.",
		en : "The result will be added to the map as a new layer with data in shapefile format.",
		es : "El resultado del c&aacute;lculo se incluir&aacute; en el mapa como una capa nueva con datos en formato shapefile."
	} ],
	'raster' : [ {
		pt : "Escolha o tema que cont&eacute;m a imagem raster que ser&aacute; utilizada para tra&ccedil;ar o melhor caminho",
		en : "Select a theme that contains the raster image that will be used to plot the best route",
		es : "Seleccione el tema que contiene la imagen raster que se utilizar&aacute; para trazar la ruta &oacute;ptima"
	} ],
	'temas' : [ {
		pt : "(Opcional) Escolha o tema que ser&aacute; utilizado para obter o ponto inicial e final. Ser&aacute; considerada a sele&ccedil;&atilde;o, se houver. No caso de tema pontual, ser&atilde;o considerados o primeiro e o &uacute;ltimo ponto. No caso de tema linear, ser&atilde;o considerados o primeiro e o &uacute;ltimo n&oacute;. No caso de tema poligonal, ser&atilde;o considerados o primeiro n&oacute; e o centr&oacute;ide. <br>Voc&ecirc; pode pular essa etapa caso queira escolher os pontos clicando no mapa.",
		en : "(Optional) Choose a theme that will be used to gather the start and end point. If there is a selection, it will be taken into account. In the case of a point-based theme the first and last points will be considered. In the case of a line-based theme the first and last node will be taken into account. In the case of a polygon-based theme the first node and the centroid they will be considered. <br>You can skip this step if you want to select the points by clicking on the map.",
		es : "(Opcional) Elija el tema que se utilizar&aacute; para obtener el punto inicial y final. De existir una selecci&oacute;n  ser&aacute; considerar&aacute;. En el caso de temas de puntos se considerar&aacute;n el primer y el &uacute;ltimo punto. En el caso de tema de l&iacute;neas se considerar&aacute;n el primer y el &uacute;ltimo nodo. En el caso de tema de pol&iacute;gonos se considerar&aacute;n el primer nodo y el centroide.<br> Puede saltar este paso, si desea seleccionar los puntos directamente sobre el mapa haciendo clic sobre el mismo."
	} ],
	'grau' : [ {
		pt : "Grau",
		en : "Degree",
		es : "Grado"
	} ],
	'minuto' : [ {
		pt : "Minuto",
		en : "Minute",
		es : "Minuto"
	} ],
	'segundo' : [ {
		pt : "Segundo",
		en : "Second",
		es : "Segundo"
	} ],
	'coord' : [ {
		pt : "Coordenadas do ponto inicial superior esquerdo (utilize o sinal negativo no grau quando ao sul do equador e a oeste). <b>Voc&ecirc; pode clicar no mapa para pegar o ponto.</b>",
		en : "Coordinates of the upper left starting point (degree values must have a negative sign when the point is located at south of the equator and/or at west of the Greenwich meridian). <b>You can click on the map to fetch the point.</b>",
		es : "Coordenadas del punto inicial superior izquierdo (utilice el signo negativo en el grado cuando se encuentre al sur del ecuador y/o al oeste del meridano de Greenwich). <b>Usted puede hacer clic en el mapa para tomar el punto.</b>"
	} ],
	'pti' : [ {
		pt : "Ponto inicial (A). Voc&ecirc; pode clicar no mapa ou digitar novos valores",
		en : "Starting point (A). You can either click on the map or enter new values",
		es : "Punto inicial (A). Usted puede hacer clic en el mapa o introducir valores nuevos"
	} ],
	'ptf' : [ {
		pt : "Ponto final (B). Voc&ecirc; pode clicar no mapa ou digitar novos valores",
		en : "End point (B). You can either click on the map or enter new values",
		es : "Punto final (B). Usted puede hacer clic en el mapa o introducir valores nuevos"
	} ],
	'lut' : [ {
		pt : "Voc&ecirc; pode reclassificar a imagem definindo novos valores para os pixels. Escolha os valores iniciais e finais do original (intervalos fechados) e o novo valor. Podem ser definidos v&aacute;rios valores.",
		en : "You can reclassify an image by setting new pixel values. Select an initial and a final value from the original ones (closed intervals) and a new value. You can set several values.",
		es : "Usted puede reclasificar la imagen estableciendo valores nuevos para los p&iacute;xeles. Seleccione los valores iniciales y finales a partir de los originales (intervalos cerrados) y el valor nuevo. Se pueden definir varios valores."
	} ],
	'novovalor' : [ {
		pt : "novo valor",
		en : "new value",
		es : "valor nuevo"
	} ],
	'menorque' : [ {
		pt : "igual ou menor que",
		en : "equal to or less than",
		es : "igual o menor que"
	} ],
	'maiorque' : [ {
		pt : "igual ou maior que",
		en : "equal to or greater than",
		es : "igual o mayor que"
	} ],
	'executa' : [ {
		pt : "Calcular",
		en : "Calculate",
		es : "Calcular"
	} ],
	'fim' : [ {
		pt : "Ap&oacute;s calcular o melhor tra&ccedil;ado, ser&aacute; adicionado ao mapa uma nova camada. O valor do custo calculado ser&aacute; inclu&iacute;do na tabela de atributos desse tema.",
		en : "After calculating the best route, a new layer will be added to the map. The computed cost value will be included in the attribute table of that theme.",
		es : "Despu&eacute;s de calcular la ruta &oacute;ptima se a&ntilde;adir&aacute; al mapa una capa nueva. El valor del costo calculado se incluir&aacute; en la tabla de atributos de este tema."
	} ],
	'mesf1' : [ {
		pt : "Escolha um tema com o mapa de custo",
		en : "Select a theme with the cost map",
		es : "Seleccione un tema con el mapa de costo"
	} ],
	'mesf2' : [ {
		pt : "Erro ao calcular as coordenadas dos pontos A e B",
		en : "Error in calculating coordinates of points A and B",
		es : "Error al calcular las coordenadas de los puntos A y B"
	} ],
	'buffer' : [ {
		pt : "(Opcional) Valor em Km do entorno da linha reta entre A e B que ser&aacute; considerada como &aacute;rea onde o caminho poder&aacute; ser tra&ccedil;ado",
		en : "(Optional) Value in Km of a straight line buffer between A and B that will be considered as the area where the path can be plotted",
		es : "(Opcional) Valor en Km del entorno (buffer) de la l&iacute;nea recta entre A y B que ser&aacute; considerada como &aacute;rea donde la ruta podr&aacute; ser trazada"
	} ],
	'relatoriofinal' : [ {
		pt : "Relat&oacute;rio de melhor caminho",
		en : "Best route summary",
		es : "Reporte de la ruta &oacute;ptima"
	} ]
};
