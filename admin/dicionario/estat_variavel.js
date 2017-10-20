if (typeof (i3GEOadmin.variaveis) === 'undefined') {
    i3GEOadmin.variaveis = {};
}
i3GEOadmin.variaveis.dicionario = {
    'txtTituloVariavel' : [ {
        pt : "Cadastro de vari&aacute;veis",
        en : "Variable register",
        es : "Registro de variables"
    } ],
    'txtDescVariavel' : [ {
        pt : "Aqui s&atilde;o criados os conjuntos de dados do sistema de metadados estat&iacute;sticos, chamadas de vari&aacute;veis. As vari&aacute;veis cont&eacute;m Medidas, que s&atilde;o os dados em si.",
        en : "Here, you can create datasets of the statistical metadata system, variable calls. Variables contain Measures which are data in itself.",
        es : "Aqu&iacute; se crean los conjuntos de datos del sistema de metadatos estad&iacute;sticos, llamadas de variables. Las variables contienen medidas que son los datos en s&iacute;."
    } ],
    'txtAjudaVariavel' : [ {
        pt : "Esse formul&aacute;rio permite editar as var&iacute;&aacute;veis e suas medidas, definindo-se as fontes dos dados, tipos de classifica&ccedil;&atilde;o, forma de representa&ccedil;&atilde;o etc. As v&aacute;ri&aacute;veis s&atilde;o fen&ocirc;menos que possuem medidas estat&iacute;sticas. Os par&acirc;metros definem como as vari&aacute;veis s&atilde;o acessadas para a montagem dos cartogramas.",
        en : "This form allows you to edit variables and their measures, defining data sources, classification types, way of representation,  etc. Variables are phenomena that have statistical measures. Parameters define how variables are accessed to assemble cartograms.",
        es : "Este formulario permite editar las variables y sus medidas, definiendo las fuentes de los datos, tipos de clasificaci&oacute;n, forma de representaci&oacute;n, etc. Las variables son fen&oacute;menos que poseen medidas estad&iacute;sticas. Los par&aacute;metros definen c&oacute;mo se puede acceder a las variables para el montaje de los cartogramas."
    } ],
    'medidas' : [ {
        pt : "medidas",
        en : "measures",
        es : "medidas"
    } ],
    'nomeVariavelTxt' : [ {
        pt : "Nome que ser&aacute; utilizado nos menus de escolha da vari&aacute;vel",
        en : "Name that will be used in the variable selection menus",
        es : "Nombre que se utilizar&aacute; en los men&uacute;s de elecci&oacute;n de la variable"
    } ],
    'txtTituloMedida' : [ {
        pt : "Cadastro de medidas de uma vari&aacute;vel",
        en : "register of measures of a variable",
        es : "Registro de las medidas de una variable"
    } ],
    'txtDescMedida' : [ {
        pt : "As medidas s&atilde;o valores existentes em uma tabela no banco de dados e est&aacute; relacionada &agrave; vari&aacute;vel em foco. Cada medida de vari&aacute;vel possui atributos (metadados) que indicam onde os dados est&atilde;o localizados no banco de dados e quais suas principais caracter&iacute;sticas. Nas op&ccedil;&otilde;es da medida &eacute; poss&iacute;vel configurar par&acirc;metros para a medida, criar classifica&ccedil;&otilde;es e simbologias, al&eacute;m de cadastrar links e fontes de dados.",
        en : "Measurements are values that exist in a database table and are related to the variable in focus.Each measure of a variable has attributes (metadata) that indicate where the data is located into the database and what its main characteristics are. In the measure options you can configure parameters for measurements, creating classifications and symbologies, and also registering links and data sources.",
        es : "Las medidas son valores existentes en una tabla de la base de datos y est&aacute; relacionada con la variable en estudio. Cada medida de variable tiene atributos (metadatos) que indican d&oacute;nde se encuentran los datos en la base de datos y cu&aacute;les son sus principales caracter&iacute;sticas. En las opciones de medida es posible configurar los par&aacute;metros para efectuar la medici&oacute;n, crear clasificaciones y simbolog&iacute;as, adem&aacute;s de registrar enlaces y fuentes de datos."
    } ],
    'txtAjudaMedida' : [ {
        pt : "Vari&aacute;veis podem ter mais de uma medida. Cada medida possu&iacute; atributos que indicam onde os dados est&atilde;o localizados no banco de dados e quais suas principais caracter&iacute;sticas. Nas op&ccedil;&otilde;es da medida &eacute; poss&iacute;vel configurar par&acirc;metros para a medida, criar classifica&ccedil;&otilde;es e simbologias, al&eacute;m cadastrar links e fontes de dados",
        en : "Variables can have more than one measurement. Each measurement has attributes that indicate where the data is located into the database and what its main characteristics are. In the measure options you can configure parameters for measurements, creating classifications and symbologies, and also registering links and data sources",
        es : "Las variables pueden tener m&aacute;s de una medida. Cada medida tiene atributos que indican d&oacute;nde se encuentran los datos en la base de datos y cu&aacute;les son sus principales caracter&iacute;sticas. En las opciones de medida es posible configurar los par&aacute;metros para efectuar la medici&oacute;n, crear clasificaciones y simbolog&iacute;as, adem&aacute;s de registrar enlaces y fuentes de datos"
    } ],
    'nomemedidaTxt' : [ {
        pt : "Nome da medida",
        en : "Measurement name",
        es : "Nombre de la medida"
    } ],
    'codigo_tipo_periodoTxt' : [ {
        pt : "Tipo de per&iacute;odo de tempo",
        en : "Type of time period",
        es : "Tipo de per&iacute;odo de tiempo"
    } ],
    'codigo_tipo_regiaoTxt' : [ {
        pt : "Tipo de regi&atilde;o geogr&aacute;fica relacionada",
        en : "Type of related geographic region",
        es : "Tipo de regi&oacute;n geogr&aacute;fica relacionada"
    } ],
    'codigo_estat_conexaoTxt' : [ {
        pt : "Conex&atilde;o com o banco de dados",
        en : "Connection to the database",
        es : "Conexi&oacute;n con la base de datos"
    } ],
    'esquemadbTxt' : [ {
        pt : "Esquema do banco onde fica a tabela com os dados. Apenas os esquemas configurados previamente no ms_configura s&atilde;o mostrados na lista. Outros esquemas podem ser utilizados, mas &eacute; necess&aacute;rio conhecer o seu nome. A listagem de nomes de tabelas e colunas tamb&eacute;m s&atilde;o restringidas pela lista registrada de esquemas.",
        en : "Database Schema where the table with data is located. Only schemas previously configured in the ms_configuration file are shown on the list. Other schemes may be used, but you must know their names. The listing of table and column names are also restricted by the registered list of schemas.",
        es : "Esquema de la base de datos donde se encuentra la tabla con los datos. Solo los esquemas configurados previamente en el ms_configura se muestran en la lista. Otros esquemas pueden ser utilizados, pero es necesario conocer su nombre. La lista de nombres de tablas y columnas tambi&eacute;n est&aacute; restringida por la lista registrada de esquemas."
    } ],
    'tabelaTxt' : [ {
        pt : "Tabela que cont&eacute;m os dados",
        en : "Table containing data",
        es : "Tabla que contiene los datos"
    } ],
    'colunavalorTxt' : [ {
        pt : "Coluna da tabela que cont&eacute;m os valores",
        en : "Column of the table that contains values",
        es : "Columna de la tabla que contiene los valores"
    } ],
    'colunaidunicoTxt' : [ {
        pt : "Coluna da tabela que cont&eacute;m os identificadores &uacute;nicos de cada registro",
        en : "Column of the table that contains unique identifiers of each record",
        es : "Columna de tabla que contiene los identificadores &uacute;nicos de cada registro"
    } ],
    'colunaidgeoTxt' : [ {
        pt : "Coluna da tabela que cont&eacute;m os identificadores da regi&atilde;o geogr&aacute;fica relacionada aos valores",
        en : "Column of the table that contains geographic region identifiers related to the values",
        es : "Columna de la tabla que contiene los identificadores de la regi&oacute;n geogr&aacute;fica relacionada con los valores"
    } ],
    'filtroTxt1' : [ {
        pt : "Filtro adicional que ser&aacute; inclu&iacute;do na sele&ccedil;&atilde;o dos dados. Utilize a sintaxe SQL, por exemplo: nomedacoluna = 'a' AND nomedacoluna1 = 2 ",
        en : "Additional filter that will be included in data selection. Use the SQL syntax, for example: columnname = 'a' AND columnname1 = 2 ",
        es : "Filtro adicional que ser&aacute; incluido en la selecci&oacute;n de los datos. Utilice la sintaxis SQL, por ejemplo: nomedacoluna = 'a' AND nomedacoluna1 = 2 "
    } ],
    'codigo_unidade_medidaTxt' : [ {
        pt : "Unidade de medida",
        en : "Unit of measurement",
        es : "Unidad de medida"
    } ],
    'opcoesMedidas' : [ {
        pt : "Op&ccedil;&otilde;es da medida",
        en : "Measurement options",
        es : "Opciones de la medida"
    } ],
    'parametrosTxt' : [ {
        pt : "Par&acirc;metros",
        en : "Parameters",
        es : "Par&aacute;metros"
    } ],
    'parametrosDesc' : [ {
        pt : "Os par&acirc;metros s&atilde;o colunas existentes na tabela onde est&atilde;o os valores da medida e que devem ser selecionados pelo usu&aacute;rio, por exemplo, a coluna com valores correspondentes ao ano da medida",
        en : "Parameters are table columns where values of measurements are located that should be selected by the users, for example, a column with values corresponding to year measurement",
        es : "Los par&aacute;metros son columnas existentes en la tabla donde est&aacute;n los valores de medida y que deben ser seleccionados por el usuario, por ejemplo, la columna con valores correspondientes al a&ntilde;o de la medida"
    } ],
    'classificacoesTxt' : [ {
        pt : "Classifica&ccedil;&otilde;es",
        en : "classifications",
        es : "Clasificaci&oacute;nes"
    } ],
    'classificacoesDesc' : [ {
        pt : "As classifica&ccedil;&otilde;es definem como os dados ser&atilde;o representados no mapa, especificando os limites de classe e a simbologia",
        en : "Classifications define how data will be shown on the map, specifying class boundaries and symbology",
        es : "Las clasificaciones definen c&oacute;mo se representan los datos en el mapa, especificando los l&iacute;mites de clase y la simbolog&iacute;a"
    } ],
    'classificacoesAjuda' : [ {
        pt : "Uma medida pode ter v&aacute;rias classifica&ccedil;&otilde;es. Primeiro crie a classifica&ccedil;&atilde;o, definindo um nome, e depois crie as classes",
        en : "A measure can have various classifications. First create the classification, choose a name, and then create the classes",
        es : "Una medida puede tener varias clasificaciones. Primero cree la clasificaci&oacute;n, defina un nombre, y luego cree las clases"
    } ],
    'linksTxt' : [ {
        pt : "Links",
        en : "Links",
        es : "Enlaces"
    } ],
    'linksDesc' : [ {
        pt : "Links com informa&ccedil;&otilde;es adicionais sobre os dados ou para aplicativos",
        en : "Links with additional information about data or applications",
        es : "Enlaces con informaci&oacute;n adicional sobre los datos o las aplicaciones"
    } ],
    'fontesTxt' : [ {
        pt : "Lista de fontes",
        en : "Font lists",
        es : "Lista de fuentes"
    } ],
    'fontesDesc' : [ {
        pt : "Links para os metadados. A lista de fontes &eacute; controlada por meio do cadastro de fontes.",
        en : "Links to metadata. The list of fonts is controlled by the font register.",
        es : "Enlaces a los metadatos. La lista de fuentes se controla mediante el registro de fuentes."
    } ],
    'escolhaFonte' : [ {
        pt : "Escolha a fonte",
        en : "Choose a font type",
        es : "Seleccione la fuente"
    } ],
    'nomeParametro' : [ {
        pt : "Nome do par&acirc;metro",
        en : "Parameter Name",
        es : "Nombre del par&aacute;metro"
    } ],
    'colunaPar' : [ {
        pt : "Coluna existente na tabela relacionada &agrave; medida e que cont&eacute;m os valores do par&acirc;metro",
        en : "Table column related to the measurement that contains parameter values",
        es : "Columna existente en la tabla relacionada con la medidici&oacute;n y que contiene los valores del par&amp;aacute;metro"
    } ],
    'tipoColunaPar' : [ {
        pt : "Tipo do par&acirc;metro",
        en : "Parameter type",
        es : "Tipo de par&aacute;metro"
    } ],
    'id_paiTxt' : [ {
        pt : "Par&acirc;metro de hierarquia superior (pai) que deve ser escolhido primeiro nos formul&aacute;rios (opcional)",
        en : "Upper hierarchy parameter (parent) that first must be chosen on the forms (optional)",
        es : "Par&aacute;metro de jerarqu&iacute;a superior (padre) que se debe elegir primero en los formularios (opcional)"
    } ],
    'classesAjuda' : [ {
        pt : "A classifica&ccedil;&atilde;o pode conter uma ou mais classes. Cada classe possu&iacute; um nome, a express&atilde;o que define a classe e a simbologia. Classes podem ser criadas manualmente ou por meio de uma opera&ccedil;&atilde;o de c&aacute;lculo autom&aacute;tico.",
        en : "A classification may contain one or more classes. Each class has a name, an expression that defines the class and symbology. Classes can be created manually or through an automatic calculation operation.",
        es : "La clasificaci&oacute;n puede contener una o m&aacute;s clases. Cada clase tiene un nombre, la expresi&oacute;n que define la clase y la simbolog&iacute;a. Las clases se pueden crear manualmente o mediante una operaci&oacute;n de c&aacute;lculo autom&aacute;tico."
    } ],
    'expressaoTxt' : [ {
        pt : "Expressão que define que valores entram nessa classe, ver detalhes em: <a href=http://mapserver.org/mapfile/expressions.html target=_blank >http://mapserver.org/mapfile/expressions.html</a>",
        en : "Expression that defines which values correspond to this class, see details at: <a href=http://mapserver.org/mapfile/expressions.html target=_blank >http://mapserver.org/mapfile/expressions.html</a>",
        es : "Expresi&oacute;n que define qu&eacute; valores entran en esa clase, ver detalles en:  <a href=http://mapserver.org/mapfile/expressions.html target=_blank >http://mapserver.org/mapfile/expressions.html</a>"
    } ],
    'azulTxt' : [ {
        pt : "Azul (cor do fundo na composi&ccedil;&atilde;o RGB de 0 e 255)",
        en : "Blue (background-color in RGB composition of 0 and 255)",
        es : "Azul (color de fondo en la composici&oacute;n RGB de 0 y 255)"
    } ],
    'verdeTxt' : [ {
        pt : "Verde (cor do fundo na composi&ccedil;&atilde;o RGB de 0 e 255)",
        en : "Green (background-color in RGB composition of 0 and 255)",
        es : "Verde (color de fondo en la composici&oacute;n RGB de 0 y 255)"
    } ],
    'vermelhoTxt' : [ {
        pt : "Vermelho (cor do fundo na composi&ccedil;&atilde;o RGB de 0 e 255)",
        en : "Red (background-color in RGB composition of 0 and 255)",
        es : "Rojo (color de fondo en la composici&oacute;n RGB de 0 y 255)"
    } ],
    'tamanhoTxt' : [ {
        pt : "Tamanho em pixels do s&iacute;mbolo, quando definido",
        en : "Symbol Size in pixels, when you define it",
        es : "Tama&ntilde;o en p&iacute;xeles del s&iacute;mbolo, cuando se define"
    } ],
    'simboloTxt' : [ {
        pt : "Nome do s&iacute;mbolo utilizado em pontos (conforme c&oacute;digos de s&iacute;mbolos)",
        en : "Symbol name used for points (according to symbol codes)",
        es : "Nombre del s&iacute;mbolo utilizado para los puntos (seg&uacute;n los c&oacute;digos de s&iacute;mbolos)"
    } ],
    'oazulTxt' : [ {
        pt : "Azul (cor do contorno na composi&ccedil;&atilde;o RGB de 0 e 255)",
        en : "Blue (outline-color in RGB composition of 0 and 255)",
        es : "Azul (color del contorno en la composici&oacute;n RGB de 0 y 255)"
    } ],
    'overdeTxt' : [ {
        pt : "Verde (cor do contorno na composi&ccedil;&atilde;o RGB de 0 e 255)",
        en : "Green (outline-color in RGB composition of 0 and 255)",
        es : "Verde (color del contorno en la composici&oacute;n RGB de 0 y 255)"
    } ],
    'overmelhoTxt' : [ {
        pt : "Vermelho (cor do contorno na composi&ccedil;&atilde;o RGB de 0 e 255)",
        en : "Red (outline-color in RGB composition of 0 and 255)",
        es : "Rojo (color del contorno en la composici&oacute;n RGB de 0 y 255)"
    } ],
    'otamanhoTxt' : [ {
        pt : "Tamanho em pixels do s&iacute;mbolo do contorno, quando definido",
        en : "Size in pixels of the outline symbol, when you define it",
        es : "Tama&ntilde;o en p&iacute;xeles del s&iacute;mbolo del contorno, cuando se define"
    } ]

};