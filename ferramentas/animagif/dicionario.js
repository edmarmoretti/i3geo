//+$trad(1,i3GEOF.animagif.dicionario)+
i3GEOF.animagif.dicionario = {
	'descricao' : [ {
		pt: "Gera uma anima&ccedil;&atilde;o no formato Gif por meio da cria&ccedil;&atilde;o de quadros baseados em uma coluna na tabela de atributos. Para cada valor &uacute;nico existente na coluna &eacute; aplicado um filtro. Ao sobrepor v&aacute;rias imagens, cria-se um arquivo Gif.",
		es: "Genera una animaci&oacute;n en formato GIF mediante la creaci&oacute;n de cuadros basados en una columna de la tabla de atributos. Para cada valor &uacute;nico existente en la columna se aplica un filtro. Al sobreponer varias im&aacute;genes se crea un archivo GIF.",
		en: "It generates an animation in GIF format by creating frames based on a column of the attribute table. A filter is applied for each unique value of a column. When overlapping several images a GIF file will be created."
	} ],
	'ativaAoAdic' : [ {
		pt : "Abre a ferramenta quando a camada &eacute; adicionada ao mapa, permitindo que o usu&aacute;rio escolha os par&acirc;metros",
		en : "Opens the tool when the layer is added to the map, allowing the user to select the parameters",
		es : "Abre la herramienta cuando la capa se agrega al mapa, permitiendo al usuario elegir los par&aacute;metros"
	} ],
	'execAoAdic' : [ {
		pt : "Gera a anima&ccedil;&atilde;o quando o usu&aacute;rio adiciona a camada ao mapa",
		en : "Creates the animation when the user adds a layer to the map",
		es : "Crea la animaci&oacute;n cuando el usuario agrega la capa al mapa"
	} ],
	'colunat' : [ {
		pt : "Coluna que ser&aacute; utilizada para obter a lista de datas e que receber&aacute; o filtro de data para cada quadro da anima&ccedil;&atilde;o",
		en : "Column that will be used to obtain the list of dates and will be filtered by date for each animation frame",
		es : "Columna que se utilizar&aacute; para obtener la lista de fechas y que recibir&aacute; el filtro de fecha para cada cuadro de animaci&oacute;n"
	} ],
	'tempo' : [ {
		pt : "Tempo em milisegundos entre cada quadro",
		en : "Time in milliseconds between each frame",
		es : "Tiempo en milisegundos entre cada cuadro"
	} ],
	'w' : [ {
		pt : "Largura da imagem gif que ser&aacute; gerada",
		en : "Gif image width that will be generated",
		es : "Ancho de la imagen gif que se generar&aacute;"
	} ],
	'cache' : [ {
		pt : "Reaproveita o arquivo gif em cache",
		en : "Reuse the cached gif file",
		es : "Reutilice el archivo gif en el cach&eacute;"
	} ],
	'extensao' : [ {
		pt : "Extens&atilde;o geogr&aacute;fica (xmin, ymin, xmax, ymax)",
		en : "Geographic extent (xmin, ymin, xmax, ymax)",
		es : "Extensi&oacute;n geogr&aacute;fica (xmin, ymin, xmax, ymax)"
	} ],
	'legenda' : [ {
		pt : "Mostra a legenda",
		en : "Show legend",
		es : "Muestra la leyenda"
	} ],
	'transparencia' : [ {
		pt : "Cada quadro ser&aacute; transparente",
		en : "Each frame will be transparent",
		es : "Cada cuadro ser&aacute; transparente"
	} ],
	'tipocolunat' : [ {
		pt : "Tipo da coluna com os valores",
		en : "Column type with values",
		es : "Tipo de columna con valores"
	} ],
	'nulos' : [ {
		pt : "Lista de valores, separados por v&iacute;rgula, que ser&atilde;o exclu&iacute;dos no processo de obten&ccedil;&atilde;o da lista de datas",
		en : "List of values separated by commas that will be deleted in the process of obtaining the list of dates",
		es : "Lista de valores separados por coma que ser&aacute;n eliminados en el proceso de obtenci&oacute;n de la lista de fechas"
	} ],
	'operador' : [ {
		pt : "Operador de liga&ccedil;&atilde;o entre a coluna e o valor da data, por default utiliza-se '=', mas pode ser definido tamb&eacute;m 'lt' (menor que) ou 'gt' (maior que)",
		en : "By default '=' is used as operator for the connection between a column and a date value, but you can also use 'lt' (less than) or 'gt' (greater than)",
		es : "Se utiliza '=' como operador por defecto de la conexi&oacute;n entre la columna y el valor de la fecha, pero se puede emplear tambi&eacute;n 'lt' (menor que) o 'gt' (mayor que)"
	} ],
	'geragif' : [{
		pt : "Cria o gif animado",
		en : "Create an animated gif",
		es : "Crea un gif animado"
	}],
	'numerico' : [{
		pt : "Num&eacute;rico",
		en : "Numeric",
		es : "Num&eacute;rico"
	}],
	'texto' : [{
		pt : "Texto",
		en : "Text",
		es : "Texto"
	}],
	'sim' : [{
		pt : "Sim",
		en : "Yes",
		es : "S&iacute;"
	}],
	'nao' : [{
		pt : "N&atilde;o",
		en : "No",
		es : "No"
	}],
	'selecionaCol' : [{
		pt : "Selecione uma coluna",
		en : "Select a column",
		es : "Seleccione una columna"
	}],
	'salvaParametros' : [ {
		pt : "Salva par&acirc;metros no mapfile",
		en : "Save parameters in the mapfile",
		es : "Guarda par&aacute;metros en el mapfile"
	} ],
	'removeParametros' : [ {
		pt : "Remove par&acirc;metros do mapfile",
		en : "Remove parameters from the mapfile",
		es : "Eliminar par&aacute;metros del mapfile"
	} ],
	'removePar' : [ {
		pt : "Remove os par&acirc;metros armazenados no tema?",
		en : "Do you want to remove the parameters stored in the theme?",
		es : "&iquest;Se eliminan los par&aacute;metros almacenados en el tema?"
	} ],
	'incluiPar' : [ {
		pt : "Inclui os par&acirc;metros no tema?",
		en : "Do you want to include the parameters in the theme?",
		es : "&iquest;Se incluyen los par&aacute;metros en el tema?"
	} ],
	'selecionaTema' : [ {
		pt : "Tema que ser&aacute; utilizado",
		en : "Theme that will be used",
		es : "Tema que se utilizar&aacute;"
	} ]
};
