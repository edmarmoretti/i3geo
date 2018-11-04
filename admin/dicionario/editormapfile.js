if (typeof (i3GEOadmin.mapfile) === 'undefined') {
    i3GEOadmin["mapfile"] = {};
}
i3GEOadmin.mapfile.dicionario = {
    'ajudaEditor' : [ {
		pt : "Salve antes de testar. Mais detalhes sobre a edi&ccedil;&atilde;o de mapfiles veja em:",
		en : "Save before testing. More details about mapfile editing at:",
		es : "Guardar antes de probar. M&aacute;s detalles sobre la edici&oacute;n de mapfiles en:"
	} ],
    'editarI3geo' : [ {
		pt : "Editar usando o i3Geo",
		en : "Edit using i3Geo",
		es : "Editar usando i3Geo"
	} ],
    'txtEditarI3geo' : [ {
		pt : "Utilize essa op&ccedil;&atilde;o principalmente para definir a classifica&ccedil;&atilde;o dos dados, textos, simbologia e outras caracter&iacute;sticas que afetam a visualiza&ccedil;&atilde;o da camada.",
		en : "Use this option mainly to define data classification, texts, symbolgy, and other features that could affect layer rendering.",
		es : "Utilice esta opci&oacute;n principalmente para definir la clasificaci&oacute;n de los datos, textos, simbolog&iacute;a y otras caracter&iacute;sticas que puedan afectar la visualizaci&oacute;n de la capa."
	} ],
    'testarI3geo' : [ {
		pt : "Testar no i3Geo",
		en : "Test using i3geo",
		es : "Probar en i3Geo"
	} ],
    'editorTxt' : [ {
		pt : "Editar mapfile com editor de textos",
		en : "Edit mapfile using text editor",
		es : "Editar mapfile con el editor de textos"
	} ],
	'txtTitulo' : [ {
		pt : "Edi&ccedil;&atilde;o de arquivos Mapfiles",
		en : "Mapfile file edition",
		es : "Edici&oacute;n de archivos Mapfiles"
	} ],
    'txtAjuda' : [ {
		pt : "<p>Na lista, o texto marcado corresponde ao nome do tema registrado na &aacute;rvore de temas (&lsquo;T&iacute;tulo para o cat&aacute;logo&rsquo;). Nem todos os temas s&atilde;o utilizados na &aacute;rvore, por isso n&atilde;o necessitam ser associados a um 'tema' e registrados no banco de dados. Ao criar um mapfile por esse sistema, o registro no banco de dados &eacute; autom&aacute;tico.</p><p>Importante: a restri&ccedil;&atilde;o ao tema por meio da defini&ccedil;&atilde;o de grupos de usu&aacute;rios n&atilde;o bloqueia o acesso por meio de download, WMS, KML, etc. Para bloquear esse tipo de acesso &eacute; necess&aacute;rio alterar as op&ccedil;&otilde;es espec&iacute;ficas. Por padr&atilde;o, esses servi&ccedil;os s&atilde;o habilitados para qualquer usu&aacute;rio, n&atilde;o sendo poss&iacute;vel bloquear apenas para determinados grupos. </p><p>Este formul&aacute;rio permite criar ou editar os arquivos mapfile que comp&otilde;em temas no i3Geo. </p><p>Os arquivo .map s&atilde;o armazenados no diret&oacute;rio i3geo/temas e podem tamb&eacute;m ser editados manualmente. </p><p>Cada arquivo cont&eacute;m LAYERS definidos conforme a sintaxe utilizada pelo Mapserver. Esses arquivos s&atilde;o as estruturas b&aacute;sicas utilizadas pelo i3Geo na apresenta&ccedil;&atilde;o de dados e montagem das camadas que s&atilde;o vistas no mapa. </p><p>Ap&oacute;s criados os mapfiles, deve-se ainda definir as caracter&iacute;sticas de cada LAYER. </p><p>Apenas os mapfiles que possuem &lsquo;T&iacute;tulo para o cat&aacute;logo&rsquo; podem ser vistos na janela de inclus&atilde;o de temas na &aacute;rvore de temas. Se voc&ecirc; criou um mapfile manualmente, utilize a op&ccedil;&atilde;o de edi&ccedil;&atilde;o (&iacute;cone apresentado ao lado de cada mapfile) para fazer essa associa&ccedil;&atilde;o. </p>",
		en : "<p>Each bold text on the list below is a theme name recorded on the theme tree (title for the catalog). No all themes are used in the tree, so they do not need to be linked to a theme or registered on a database. When you create a mapfile using this method the database registration is automatic.</p><p>Important: a theme constraint through a user group definition do not block from accessing to downloads, WMS, KML, etc. To block this kind of access you should change some specific options. These services are enabled by default for any user, it is not possible to block them for some groups only.</p><p>This form allows you to create or edit mapfile files that make up the i3Geo's themes.</p><p>.map files are located in i3geo/temas and can be manually edited.</p><p>Each file contains LAYERS defined according to Mapserver sintax. These files are the basic structures used by i3Geo to show data and layers deployment.</p><p>After creating a mapfile, you must specify the properties of each LAYER.</p><p>Only those mapfiles that have 'title for the catalog' can be shown in the windows of theme inclusion of the theme tree. If you have created a mapfile manually, use the edition option (icon next to each mapfile) to create this linkage. </p>",
		es : "<p>En la lista, el texto en negritas es el nombre del tema registrado en el &aacute;rbol de temas (t&iacute;tulo para el cat&aacute;logo). No todos los temas son utilizados en el &aacute;rbol, por lo que no necesitan ser asociados a un tema ni registrarlos en la base de datos. Al crear un mapfile a trav&eacute;s de este sistema el registro en la base de datos es autom&aacute;tico.</p><p>Importante: la restricci&oacute;n del tema mediante la definici&oacute;n de grupos de usuarios no bloquea el acceso a trav&eacute;s de la descarga, WMS, KML, etc. Para bloquear este tipo de acceso es necesario cambiar las opciones espec&iacute;ficas. De forma predeterminada, estos servicios est&aacute;n habilitados para cualquier usuario, no siendo posible bloquearlos solo para determinados grupos.</p><p>Este formulario permite crear o editar los archivos mapfile que componen los temas en i3Geo.</p><p>Los archivos .map se almacenan en el directorio i3geo/temas y se pueden editar manualmente.</p><p>Cada archivo contiene LAYERS definidos seg&uacute;n la sintaxis utilizada por Mapserver. Estos archivos son las estructuras b&aacute;sicas utilizadas por el i3Geo en la presentaci&oacute;n de datos y el montaje de las capas que se ven en el mapa.</p><p>Despu&eacute;s de crear los mapfiles, se deben definir las caracter&iacute;sticas de cada LAYER.</p><p>Solo los mapfiles que poseen 'T&iacute;tulo para en el cat&aacute;logo' pueden ser visualizados en la ventana de inclusi&oacute;n de temas en el &aacute;rbol de temas. Si ha creado un mapfile manualmente, utilice la opci&oacute;n de edici&oacute;n (icono que aparece junto a cada mapfile) para realizar esta asociaci&oacute;n. </p>"
	} ],
    'criaMapfile' : [ {
		pt : "Cria&ccedil;&atilde;o de um novo arquivo mapfile",
		en : "New mapfile file creation",
		es : "Creaci&oacute;n de un nuevo archivo mapfile"
	} ],
    'txtDesc' : [ {
		pt : "Aqui s&atilde;o criados os arquivos mapfiles. Mapfiles s&atilde;o arquivos de configura&ccedil;&atilde;o que definem as camadas que podem ser adicionadas a um mapa e ao cat&aacute;logo de temas. Os mapfiles criados aqui s&atilde;o armazenados na pasta <samp>i3geo/temas</samp> e registrados no banco de dados de administra&ccedil;&atilde;o. Ao se editar um mapfile priorize faz&ecirc;-lo por aqui para que as altera&ccedil;&otilde;es realizadas sejam registradas.</p>",
		en : "Here is where mapfiles files are created. Mapfiles are setup files that define layers that can be added to a map and the catalog of themes. Mapfiles created here are stored in <samp>i3geo/temas</samp> folder and recorded on the administration database. When editing a mapfile, you must first do it here so that changes made to be registered.</p>",
		es : "Aqu&iacute; se crean los archivos mapfiles. Los Mapfiles son archivos con par&aacute;metros que definen las capas que pueden ser agregadas a un mapa y a un cat&aacute;logo de temas. Los mapfiles creados aqu&iacute; se almacenan en la carpeta <samp>i3geo/temas</samp> y son registrados en la base de datos de administraci&oacute;n. Al editar un mapfile, primero debe hacerlo aqu&iacute; para que los cambios realizados sean registrados.</p>"
	} ],
	'txtDesc1' : [ {
		pt : "<p>Utilize as op&ccedil;&otilde;es do mapfile para definir as configura&ccedil;&otilde;es de seu tema como conex&atilde;o com os dados, criar classes, s&iacute;mbolos e estilos, incluir par&acirc;metros e testar as camadas criadas. </p><p>Para incluir um tema no cat&aacute;logo utilize a op&ccedil;&atilde;o &Aacute;rvore de Temas no menu superior.",
		en : "<p>Use the mapfile options to configure your theme settings, such as data connection, class creation, symbols and styles, parameter adding, and testing of layers you have created. </p><p>To include a theme in the catalog use the Theme Tree option on the top menu.",
		es : "<p>Utilice las opciones de mapfile para definir la configuraci&oacute;n de su tema, tal como conexi&oacute;n a los datos, crear clases, s&iacute;mbolos y estilos, incluir par&aacute;metros y probar las capas creadas. </p><p>Para incluir un tema en el cat&aacute;logo, utilice la opci&oacute;n &Aacute;rbol de Temas en el men&uacute; superior."
	} ],
    'nomeMap' : [ {
		pt : "Nome do novo arquivo mapfile (sem .map). N&atilde;o utilize caracteres acentuados ou espa&ccedil;os em branco",
		en : "Filename of new mapfile (without .map). Do not use accented characters or blank spaces",
		es : "Nombre del nuevo archivo mapfile (sin .map). No utilice caracteres acentuados o espacios en blanco"
	} ],
    'permiteOgc' : [ {
		pt : "Permitir o acesso aos dados via download e Web Services (WMS, WFS, etc.)",
		en : "Allow to get data via download and Web Services (WMS, WFS, etc.)",
		es : "Permitir el acceso a los datos a trav&eacute;s de la descarga y los servicios web (WMS, WFS, etc.)"
	} ],
    'metaestatTxt' : [ {
		pt : "Esse mapfile baseia-se no sistema de metadados estat&iacute;sticos? Caso escolha sim, a conex&atilde;o com o banco e o sql de acesso aos dados ser&atilde;o constru&iacute;dos de forma din&acirc;mica quando a camada for adicionada ao mapa",
		en : "Is this a mapfile based on the statistical metadata system? If you choose yes, the database connection and sql to get data will be dynamically created when the layer is added to the map",
		es : "&iquest;Este mapfile se basa en el sistema de metadatos estad&iacute;sticos? Si selecciona s&iacute;, la conexi&oacute;n con la base de datos y el sql de acceso a los datos se construir&aacute; de forma din&aacute;mica cuando se a&ntilde;ada la capa al mapa"
	} ],
    'tituloTema' : [ {
		pt : "T&iacute;tulo para o catálogo",
		en : "Title for the catalog",
		es : "T&iacute;tulo para el cat&aacute;logo"
	} ],
    'tituloPt' : [ {
		pt : "Em portugu&ecirc;s: ",
		en : "In Portuguese: ",
		es : "En portugu&eacute;s: "
	} ],
    'tituloEs' : [ {
		pt : "Espanhol (opcional): ",
		en : "Spanish (optional): ",
		es : "Espa&ntilde;ol (opcional): "
	} ],
    'tituloEn' : [ {
		pt : "Ingl&ecirc;s: (opcional)",
		en : "English: (optional)",
		es : "Ingl&eacute;s: (opcional)"
	} ],
    'favorito' : [ {
		pt : "favorito",
		en : "favourite",
		es : "favorito"
	} ],
    'favoritos' : [ {
		pt : "Favoritos",
		en : "Favourites",
		es : "Favoritos"
	} ],
    'criaCopia' : [ {
		pt : "cria uma copia",
		en : "create a copy",
		es : "crear una copia"
	} ],
    'limpaCache' : [ {
		pt : "Limpa o cache de imagens",
		en : "Clear imagery cache",
		es : "Limpia la cach&eacute; de im&aacute;genes"
	} ],
    'txtLimpaCache' : [ {
		pt : "Remove os arquivos de imagem tempor&aacute;rios gerados no processo de renderiza&ccedil;&atilde;o da camada. A gera&ccedil;&atilde;o do cache &eacute; uma op&ccedil;&atilde;o de cada camada. A limpeza pode n&atilde;o funcionar em alguns sistemas, o que exige a interven&ccedil;&atilde;o manual do administrador. A pasta onde o cache &eacute; armazenado &eacute; definida em ms_configura.php.",
		en : "Removes temporary image files generated by the layer rendering process. Cache generation is an option for each layer. Cleaning may not work on some systems, thus administrator should configure the system manually.The folder where the cache is stored is set to ms_configura.php.",
		es : "Quita los archivos de imagen temporales generados en el proceso de renderizado de la capa. La generaci&oacute;n del cach&eacute; es una opci&oacute;n de cada capa. La limpieza puede que no funcione en algunos sistemas, lo que requiere la intervenci&oacute;n manual del administrador. La carpeta donde se almacena el cach&eacute; se establece en ms_configura.php."
	} ],
    'gruposEusuarios' : [ {
		pt : "Grupos de usu&aacute;rios que podem utilizar",
		en : "User groups that can use this layer",
		es : "Grupos de usuarios que pueden utilizar"
	} ],
    'txtGruposUsuarios' : [ {
		pt : "Grupos de usu&aacute;rios que podem utilizar essa camada. Os grupos s&atilde;o definidos na op&ccedil;&atilde;o existente no menu principal.",
		en : "User groups that can use this layer. There is an option on the main menu to define those groups.",
		es : "Grupos de usuarios que pueden utilizar esta capa. Los grupos se definen en la opci&oacute;n del men&uacute; principal."
	} ],
    'extensao' : [ {
		pt : "Sao necessarios 4 valores em extensao",
		en : "The extent requires 4 values",
		es : "Es necesario 4 valores para la extensi&oacute;n"
	} ],
    'atributos' : [ {
		pt : "O layer possu&iacute; as seguintes colunas na tabela de atributos: ",
		en : "The layer has the following columns in the attribute table: ",
		es : "La capa tiene las siguientes columnas en la tabla de atributos: "
	} ],
    'statusTitulo' : [ {
		pt : "Define o estado de visibilidade da camada. Geralmente modificado pelo pr&oacute;prio i3Geo.",
		en : "Set layer visibility. Generally modified by i3Geo itself.",
		es : "Define la visibilidad de la capa. Generalmente modificada por el mismo i3Geo."
	} ],
    'aplicaExtensao' : [ {
		pt : "Indica se a extens&atilde;o geogr&aacute;fica do mapa deve ser alterada quando o tema for adicionado ao mapa",
		en : "It indicates whether the geographical extent of the map should be changed when the theme is added to the map",
		es : "Indica si la extensi&oacute;n geogr&aacute;fica del mapa debe cambiar cuando el tema se a&ntilde;ada al mapa"
	} ],
    'aplicaExtensaoTitulo' : [ {
		pt : "Aplica extensao",
		en : "Apply extent",
		es : "Aplicar extensi&oacute;n"
	} ],
    'comentario' : [ {
		pt : "Indica se o usu&aacute;rio pode incluir coment&aacute;rios no tema",
		en : "It indicates whether a user can include comments on the theme",
		es : "Indica si el usuario puede incluir comentarios en el tema"
	} ],
    'comentarioTitulo' : [ {
		pt : "Permite comentar",
		en : "Allow commenting",
		es : "Permite comentar"
	} ],
    'temporiZador' : [ {
		pt : "Temporizador (em segundos) para atualiza&ccedil;&atilde;o autom&aacute;tica da camada. A camada ser&aacute; redesenhada continuamente a cada intervalo de tempo definido",
		en : "Timer (in seconds) for automatic layer update. The layer will be redesigned continuously at each defined time interval",
		es : "Temporizador (en segundos) para la actualizaci&oacute;n autom&aacute;tica de la capa. La capa se redise&ntilde;ar&aacute; continuamente a cada intervalo de tiempo definido"
	} ],
    'temporizadorTitulo' : [ {
		pt : "Temporizador em segundos",
		en : "Timer in seconds",
		es : "Temporizador en segundos"
	} ],
    'esconDido' : [ {
		pt : "Indica se o tema &eacute; mostrado no mapa mas n&atilde;o nas listas da legenda e na guia 'temas'",
		en : "It indicates whether the theme will be shown on the map but not in legend lists and theme tabs.",
		es : "Indica si el tema se muestra en el mapa pero no en las listas de la leyenda ni en la ficha temas."
	} ],
    'escondidoTitulo' : [ {
		pt : "Escondido",
		en : "Hidden",
		es : "Escondido"
	} ],
    'transition' : [ {
		pt : "Aplica efeitos de transi&ccedil;&atilde;o nas opera&ccedil;&otilde;es de zoom e pan na interface Openlayers",
		en : "It applies transition effects to zoom and pan operations for the Openlayers interface",
		es : "Aplica efectos de transici&oacute;n en las operaciones de zoom y pan en la interfaz Openlayers"
	} ],
    'transitionTitulo' : [ {
		pt : "Efeitos de transi&ccedil;&atilde;o zoom",
		en : "Zoom transition effects",
		es : "Efectos de transici&oacute;n zoom"
	} ],
    'Type' : [ {
		pt : "Especifica como o dado deve ser desenhado. N&atilde;o precisa ser do mesmo tipo do shapefile. Por exemplo, um shapefile de pol&iacute;gonos pode ser desenhado como pontos, mas um shape de pontos n&atilde;o pode ser desenhado como um pol&iacute;gono.",
		en : "It specifies how data should be designed. It does not have to be the same type as the shapefile. For example, a shapefile of polygons can be designed as points, but a point shape cannot be designed as a polygon.",
		es : "Especifica c&oacute;mo el dato debe ser dise&ntilde;ado. No necesita ser del mismo tipo del shapefile. Por ejemplo, un shapefile de pol&iacute;gonos puede ser dise&ntilde;ado como puntos, pero un shape de puntos no puede ser dise&ntilde;ado como un pol&iacute;gono."
	} ],
    'typeTitulo' : [ {
		pt : "Type - tipo das geometrias",
		en : "Type - type of geometries",
		es : "Type - tipo de las geometr&iacute;as"
	} ],
    'Connectiontype' : [ {
		pt : "Tipo de conex&atilde;o. com os dados",
		en : "Type of data connection",
		es : "Tipo de conexi&oacute;n con los datos"
	} ],
    'connectiontypeTitulo' : [ {
		pt : "Connectiontype - tipo de conex&atilde;o com a fonte de dados",
		en : "Connectiontype - data source connection type",
		es : "Connectiontype - tipo de conexi&oacute;n con el origen de datos"
	} ],
    'Connection' : [ {
		pt : "<i>Voc&ecirc; pode digitar apenas o 'alias' para esconder a string de conex&atilde;o.</i> Os alias devem ser definidos pelo administrador da instala&ccedil;&atilde;o do i3Geo e registrados no arquivo ms_configura.php.<br> Database connection string to retrieve remote data.An SDE connection string consists of a hostname, instance name, database name, username and password separated by commas.A PostGIS connection string is basically a regular PostgreSQL connection string, it takes the form of 'user=nobody password=****** dbname=dbname host=localhost port=5432' An Oracle connection string: user/pass[@db] . Se vc tiver problemas com acentua&ccedil;&atilde;o, experimente algo como: user=postgres password=postgres dbname=pgutf8 host=localhost port=5432 options='-c client_encoding=LATIN1'",
		en : "<i>You can only type the 'alias' to hide connection string.</i> Aliases must be set by the i3Geo installation administrator and registered on ms_configura.php file. <br> Database connection string to retrieve remote data. An SDE connection string consists of a hostname, instance name, database name, username and password separated by commas.A PostGIS connection string is basically a regular PostgreSQL connection string, it takes the form of 'user=nobody password=****** dbname=dbname host=localhost port=5432' An Oracle connection string: user/pass[@db] . If you have accentuation issues, try the following: user=postgres password=postgres dbname=pgutf8 host=localhost port=5432 options='-c client_encoding=LATIN1'",
		es : "<i>Usted puede escribir solo el alias para ocultar los par&aacute;metros de conexi&oacute;n.</i> Los alias deben ser definidos por el administrador de la instalaci&oacute;n de i3Geo y registrados en el archivo ms_configura.php.<br> Los par&aacute;metros de conexi&oacute;n de base de datos para recuperar datos remotos. Como par&aacute;metros de conexi&oacute;n SDE tenemos el nombre de host, nombre de la instancia, nombre de la base de datos, nombre del usuario y contrase&ntilde;a separados por comas. Una cadena de conexi&oacute;n PostGIS es b&aacute;sicamente la misma que PostgreSQL, toma la forma de 'user = alguien password = ****** dbname = dbname host = localhost puert = 5432' Una cadena de conexi&oacute;n de Oracle: user / pass [@db ]. Si tiene problemas con la acentuaci&oacute;n, pruebe lo siguiente: user = postgres password = postgres dbname = pgutf8 host = localhost port = 5432 options = '- c client_encoding = LATIN1'"
	} ],
    'connectionTitulo' : [ {
		pt : "Connection - par&acirc;metros de conex&atilde;o com a fonte de dados",
		en : "Connection - connection parameters to data source",
		es : "Connection - par&aacute;metros de conexi&oacute;n con el origen de datos"
	} ],
    'Data' : [ {
		pt : "Nome completo do arquivo de dado espacial a ser processado. N&atilde;o &eacute; necess&aacute;ria a extens&atilde;o do arquivo para shapefiles. Exemplo: c://ms4w/Apache/htdocs/geodados/brasil/limitespol/localidades.shp. Pode ser especificado relativo &agrave; op&ccedil;&atilde;o SHAPEPATH do objeto MAP. Se for uma camada SDE, deve ser inclu&iacute;do o nome da camada bem como da coluna de geometria, por exemplo, mylayer,shape,myversion. Se &eacute; uma camada PostGIS, o par&acirc;metro deve seguir a forma <columnname> from <tablename>, na qual columnname &eacute; o nome da coluna que cont&eacute;m a geometria e tablename &eacute; o nome da tabela cuja geometria ser&aacute; lida. Exemplo: the_geom FROM (select * FROM biomas) as foo USING UNIQUE gid USING SRID=4291. Para Oracle, use shape FROM table ou shape FROM (SELECT statement) ou at&eacute; express&otilde;es mais complexas. Note que, no entanto, h&aacute; impactos importantes de performance quando utilizadas subconsultas espaciais.",
		en : "Full name of geospatial data that will be processed. File extension is not required for shapefiles. For example: c://ms4w/Apache/htdocs/geodados/brasil/limitespol/localidades.shp. It can be specified relative to SHAPEPATH option of MAP object. If it is a SDE layer, you must include layer name as well as geometry column, for example mylayer, shape, myversion. If it is a PostGIS layer, the parameter must follow the FROM clause, where columnname is the column name containing the geometry and tablename is the table name whose geometry will be read. For example: the_geom FROM (select * FROM biomas) as foo USING UNIQUE gid USING SRID=4291. For Oracle, use shape FROM table or shape FROM (SELECT statement) or more complex expressions.",
		es : "Nombre completo del archivo de datos geoespaciales a ser procesado. No es necesaria la extensi&oacute;n del archivo para shapefiles. Ejemplo: c://ms4w/Apache/htdocs/geodados/brasil/limitespol/localidades.shp. Se puede especificar relativo a la opci&oacute;n SHAPEPATH del objeto MAP. Si fuese una capa SDE, se debe incluir el nombre de la capa as&iacute; como la columna de geometr&iacute;a, por ejemplo mylayer, shape, myversion. Si es una capa PostGIS, el par&aacute;metro debe seguir la forma from, en la que columnname es el nombre de la columna que contiene la geometr&iacute;a y el tablename es el nombre de la tabla cuya geometr&iacute;a ser&aacute; leida. Ejemplo: the_geom FROM (select * FROM biomas) as foo USING UNIQUE gid USING SRID=4291. Para Oracle, use shape FROM table ou shape FROM (SELECT statement) o expresiones m&aacute;s complejas. Sin embargo, hay impactos importantes de rendimiento cuando se utilizan subconsultas espaciales."
	} ],
    'dataTitulo' : [ {
		pt : "Data - SQL ou caminho do arquivo com os dados",
		en : "Data - SQL or file path with data",
		es : "Data - SQL o ruta de acceso del archivo con los datos"
	} ],
    'Cache' : [ {
		pt : "Ativa ou n&atilde;o a manuten&ccedil;&atilde;o de um cache para armazenar as imagens geradas para montar o mapa. O cache &eacute; mantido no diret&oacute;rio tempor&aacute;rio utilizado pelo i3Geo, na pasta chamada cache. Para cada camada &eacute; criada uma sub-pasta. Para limpar o cache, utilize a op&ccedil;&atilde;o existente junto ao n&oacute; principal desse mapfile. Camadas WMS s&atilde;o acessadas diretamente do servidor de origem quando o cache estiver inativo.",
		en : "Activate or not cache maintenance to store images generated for map production. Cache is maintained in a temporary directory used by i3Geo in a folder named cache. A sub-folder is created for each layer. To clear cache, use an existing option next to the main node of this mapfile. WMS layers are accessed directly from the source server when cache is inactive.",
		es : "Activa o no el mantenimiento del cach&eacute; para almacenar las im&aacute;genes generadas para montar el mapa. El cach&eacute; se mantiene en el directorio temporal utilizado por el i3Geo en la carpeta denominada cache. Para cada capa se crea una subcarpeta. Para borrar el cach&eacute;, utilice la opci&oacute;n existente junto al nodo principal de este mapfile. Las capas WMS se accede directamente desde el servidor de origen cuando el cach&eacute; est&aacute; inactivo."
	} ],
    'cacheTitulo' : [ {
		pt : "Cache de mapas",
		en : "Map cache",
		es : "Cache de mapas"
	} ],
    'Cortepixels' : [ {
		pt : "Ao desenhar a imagem de um TILE que comp&otilde;e o mapa, a imagem &eacute; extendida e depois cortada para o tamanho correto. Isso evita que s&iacute;mbolos apare&ccedil;am de forma parcial no mapa. Indicado para temas com representa&ccedil;&atilde;o pontual e que tamb&eacute;m utilizem cache, pois pode degradar a performance.",
		en : "When defining a TILE image that makes up the map, the image is stretched and then cropped to an adequate size. This prevents symbols from appearing partially on the map. This is adequate for themes that use cache and with point representation also, as it can generate performance degradation.",
		es : "Cuando se define la imagen de un TILE que compone el mapa, la imagen se extiende y luego se corta al tama&ntilde;o correcto. Esto evita que los s&iacute;mbolos aparecen de forma parcial en el mapa. Esto es adecuado para temas con representaci&oacute;n puntual y que tambi&eacute;n usen cach&eacute;, pues puede degradar el rendimiento."
	} ],
    'cortepixelsTitulo' : [ {
		pt : "Extende e corta imagem em pixels (cortepixels)",
		en : "Stretch and crop image to pixels (cortepixels)",
		es : "Extiende y corta la imagen en pixeles (cortepixels)"
	} ],
    'Metaestat' : [ {
		pt : "Indica se as defini&ccedil;&otilde;es da camada est&atilde;o relacionadas ao sistema de metadados estat&iacute;sticos. Se estiver, alguns par&acirc;metros s&atilde;o obtidos de forma autom&aacute;tica quando a camada for adicionada ao mapa.",
		en : "It indicates if layer definitions are related to the statistical metadata system. If available, some parameters are automatically obtained when the layer is added to the map.",
		es : "Indica si las definiciones de la capa est&aacute;n relacionadas con el sistema de metadatos estad&iacute;sticos. Si est&aacute;n disponibles, algunos par&aacute;metros se obtienen de forma autom&aacute;tica cuando se a&ntilde;ade la capa al mapa."
	} ],
    'metaestatTitulo' : [ {
		pt : "Esse mapfile est&aacute; integrado ao sistema de metadados estat&iacute;sticos?",
		en : "Is the mapfile integrated with the statistical metadata system?",
		es : "&iquest;Este mapfile est&aacute; integrado al sistema de metadatos estat&iacute;sticos?"
	} ],
    'medidaVariavel' : [ {
		pt : "ID da medida da vari&aacute;vel que relaciona a camada ao sistema de metadados estat&iacute;sticos. S&oacute; deve ser definido se o mapfile for integrado a esse sistema.",
		en : "Measure ID of the variable that relates the layer with the statistical metadata system. It should only be defined if the mapfile is integrated into the system.",
		es : "ID de la medida de la variable que relaciona la capa con el sistema de metadados estad&iacute;sticos. Solo debe ser definido si el mapfile se integra al sistema."
	} ],
    'medidaVariavelTitulo' : [ {
		pt : "ID da vari&aacute;vel no sistema de metadados estat&iacute;sticos ",
		en : "Variable ID of statistical metadata system ",
		es : "ID de la variable del sistema de metadatos estad&iacute;sticos "
	} ],
    'convCaracter' : [ {
		pt : "Aplica a convers&atilde;o de caracteres nas ferramentas que obt&eacute;m os dados descritivos referentes aos elementos do LAYER. Em alguns casos, a convers&atilde;o pode provocar problemas de acentua&ccedil;&atilde;o. Se isso ocorrer, na ferramenta tabela por exemplo, experimente marcar essa op&ccedil;&atilde;o como 'nao'",
		en : "It applies character transformations on tools that obtain descriptive data concerning LAYER elements. In some cases, conversion may cause accentuation problems. If this occurs, for example on the table tool, try to mark this option as 'no'",
		es : "Aplica la conversi&oacute;n de caracteres en las herramientas que obtienen datos descriptivos concernientes a los elementos del LAYER. En algunos casos la conversi&oacute;n puede causar problemas de acentuaci&oacute;n. En caso de que esto ocurra, en la herramienta tabla, por ejemplo, intente marcar esta opci&oacute;n como 'no'"
	} ],
    'convCaracterTitulo' : [ {
		pt : "Convers&atilde;o de caracteres (METADATA: CONVCARACTER)",
		en : "Character Conversion (METADATA: CONVCARACTER)",
		es : "Conversi&oacute;n de caracteres (METADATA: CONVCARACTER)"
	} ],
    'projecao' : [ {
		pt : "Proje&ccedil;&atilde;o",
		en : "Projection",
		es : "Proyección"
	} ],
	'projecaoTitulo' : [{
		pt : "Se for mantido como vazio, n&atilde;o ser&aacute; feita nenhuma convers&atilde;o de proje&ccedil;&atilde;o, assumindo os par&acirc;metros definidos para o mapa como um todo. MapServer relies on the PROJ.4 library for projections. Projection objects therefore consist of a series of PROJ.4 keywords, which are either specified within the object directly or referred to in an EPSG file. An EPSG file is a lookup file containing projection parameters, and is part of the PROJ.4 library.",
		en : "If it is kept as empty, projection conversion won't be executed, assuming parameters defined for the map as a whole. MapServer relies on PROJ.4 library for projections. Projection objects therefore consist of a series of PROJ.4 keywords, which are either specified within the object directly or referred to in a EPSG file. An EPSG file is a lookup file containing projection parameters, and it is part of PROJ.4 library.",
		es : "Si se mantiene vac&iacute;o, no se realizar&aacute; ninguna conversi&oacute;n de proyecci&oacute;n, asumiendo los par&aacute;metros definidos para el mapa como un todo. MapServer depende de la biblioteca PROJ.4 para las proyecciones. Por lo tanto, los objetos de proyecci&oacute;n consisten en una serie de palabras clave de PROJ.4, que se especifican en el objeto directamente o se refieren a un archivo EPSG. Un archivo EPSG es un archivo de b&uacute;squeda que contiene par&aacute;metros de proyecci&oacute;n y forma parte de la biblioteca PROJ.4."
	}],
    'disponibilidade' : [ {
		pt : "Disponibilidade",
		en : "Availability",
		es : "Disponibilidad"
	} ],
    'txtDisponibilidade' : [ {
		pt : "Os dados de uma camada podem ficar dispon&iacute;veis para download ou acess&iacute;veis por meio de servi&ccedil;os OGC. Para uso com o aplicativo 'mashup' os dados devem estar dispon&iacute;veis como servi&ccedil;os OGC.",
		en : "Layer data can be available for downloading or accessible through OGC services. For use with the mashup application, data must be available as OGC services.",
		es : "Los datos de una capa pueden estar disponibles para descargar o accesibles a trav&eacute;s de servicios OGC. Para uso con la aplicaci&oacute;n mashup, los datos deben estar disponibles como servicios de OGC."
	} ],
    'conexaoLocal' : [ {
		pt : "Conex&atilde;o local",
		en : "Local connection",
		es : "Conexi&oacute;n local"
	} ],
    'permiteDownload' : [ {
		pt : "Indica se o usu&aacute;rio pode fazer download do tema. Se sim, o &iacute;cone de download ser&aacute; mostrado na &aacute;rvore de camadas dispon&iacute;veis no mapa.",
		en : "It indicates if a user can download the theme. If so, a download icon will be shown in the tree of available layers on the map.",
		es : "Indica si el usuario puede descargar el tema. Si es as&iacute;, el icono de descarga se mostrar&aacute; en el &aacute;rbol de capas disponibles en el mapa."
	} ],
    'permiteDownloadTitulo' : [ {
		pt : "Permite download",
		en : "Allow downloading",
		es : "Permitir descargar"
	} ],
    'endereco' : [ {
		pt : "Endere&ccedil;o de um arquivo pr&eacute;-existente para download dos dados (caminho completo no servidor). Se definido, o sistema ir&aacute; usar esse arquivo ao inv&eacute;s de gerar os dados, quando o usu&aacute;rio clicar nas op&ccedil;&otilde;es de download. Se n&atilde;o for definido, o arquivo de download &eacute; gerado diretamente do original, convertendo do banco ou copiando o arquivo definido em DATA.",
		en : "Address of a pre-existing file to download data (full path on the server). If set, the system will use this file instead of generating data when a user clicks on download options. If not set, the download file will be generated directly from the original one, obtaining it from the database or copying the file defined in DATA.",
		es : "Direcci&oacute;n de un archivo preexistente para descargar los datos (ruta completa en el servidor). Si se define, el sistema utilizar&aacute; este archivo en lugar de generar los datos cuando el usuario haga clic en las opciones de descarga. Si no se define, el archivo de descarga se genera directamente desde el original a partir del banco de datos o copiando el archivo definido en DATA."
	} ],
    'enderecoTitulo' : [ {
		pt : "Arquivo download",
		en : "Download file",
		es : "Archivo descarga"
	} ],
    'arquivoKmz' : [ {
		pt : "Endere&ccedil;o de um arquivo KMZ ou KML pr&eacute;-existente para download dos dados (caminho completo no servidor). Se definido, o sistema ir&aacute; usar esse arquivo ao inv&eacute;s de gerar os dados, quando o usu&aacute;rio clicar nas op&ccedil;&otilde;es de visualiza&ccedil;&atilde;o de KML ou KMZ. Se n&atilde;o for definido, o arquivo &eacute; gerado diretamente do original.",
		en : "Address of a pre-existing KMZ or KML file to download data (full path on the server). If set, the system will use this file instead of generating data when a user clicks on KMZ or KML visualization options. If not set, the download file will be generated directly from the original one.",
		es : "Direcci&oacute;n de un archivo KMZ o KML preexistente para descargar los datos (ruta completa en el servidor). Si se define, el sistema utilizar&aacute; este archivo en lugar de generar los datos cuando el usuario haga clic en las opciones de visualizaci&oacute;n de KML o KMZ. Si no se define, el archivo se generar&aacute; directamente del original."
	} ],
    'arquivoKmzTitulo' : [ {
		pt : "Arquivo KML ou KMZ",
		en : "KML or KMZ file",
		es : "Archivo KML o KMZ"
	} ],
    'permiteOgc2' : [ {
		pt : "Permite acesso via WMS/WFS",
		en : "Allow accessing via WMS/WFS",
		es : "Permite acesso v&iacute;a WMS/WFS"
	} ],
    'permiteDownload2' : [ {
		pt : "Mostra essa camada no aplicativo de acesso aos servi&ccedil;os OGC e download",
		en : "Display this layer on the OGC service access application and download",
		es : "Muestra esta capa en la aplicaci&oacute;n de acceso a los servicios OGC y descarga"
	} ],
    'permiteKml' : [ {
		pt : "Permite acesso via kml",
		en : "Allow accessing via kml",
		es : "Permite acesso v&iacute;a kml"
	} ],
    'permiteKmz' : [ {
		pt : "Permite acesso via kmz (kml com dados vetoriais)",
		en : "Allow accessing via kmz (kml with vector data)",
		es : "Permite acesso v&iacute;a kmz (kml con datos vectoriales)"
	} ],
    'editavelOpt' : [ {
		pt : "Par&acirc;metros que definem se os dados que comp&otilde;em a camada poder&atilde;o ser editados pelo usu&aacute;rio. &Eacute; necess&aacute;rio informar a tabela que contem os dados e as colunas com geometria e chave prim&aacute;ria. &Eacute; recomend&aacute;vel que se utilizem mapfiles espec&iacute;ficos para edi&ccedil;&atilde;o, mesmo que sejam c&oacute;pias de outro j&aacute; existente.",
		en : "Parameters that define if data that makes up the layer can be edited by the user. It is necessary to define the table that contains data and columns with geometry and primary key. It is recommended that you use specific mapfiles for editing, even if they are copies of an existing one.",
		es : "Par&aacute;metros que definen si los datos que componen la capa podr&aacute;n ser editados por el usuario. Es necesario definir la tabla que contiene los datos y las columnas con la geometr&iacute;a y la clave principal. Es recomendable que se utilicen mapfiles espec&iacute;ficos para la edici&oacute;n, aunque sean copias de otros ya existentes."
	} ],
    'editavelOptTitulo' : [ {
		pt : "Edi&ccedil;&atilde;o (apenas para camadas POSTGIS)",
		en : "Editing (POSTGIS layers only)",
		es : "Edici&oacute;n (solo para capas POSTGIS)"
	} ],
    'esquemaBd' : [ {
		pt : "Esquema no banco de dados onde fica a tabela alvo da edi&ccedil;&atilde;o.",
		en : "Schema in the database where the target table is located.",
		es : "Esquema en la base de datos donde se encuentra la tabla de destino de la edici&oacute;n."
	} ],
    'esquemaBdTitulo' : [ {
		pt : "Esquema",
		en : "Schema",
		es : "Esquema"
	} ],
    'tabelaBd' : [ {
		pt : "Tabela que poder&aacute; ser editada.",
		en : "Table that you will be able to edit.",
		es : "Tabla que podr&aacute; ser editar."
	} ],
    'tabela' : [ {
		pt : "Tabela",
		en : "Table",
		es : "Tabla"
	} ],
    'colunaBd' : [ {
		pt : "Coluna que identifica de forma &uacute;nica cada registro da tabela. Deve ser do tipo serial para permitir a inclus&atilde;o de novos registros de forma correta.",
		en : "Column that uniquely identifies each table record",
		es : "Columna que identifica de forma &uacute;nica cada registro de la tabla"
	} ],
    'colunaBdTitulo' : [ {
		pt : "Coluna com IDs &uacute;nicos",
		en : "Column with unique IDs",
		es : "Columna con identificadores &uacute;nicos"
	} ],
    'bdGeom' : [ {
		pt : "Coluna que contem as geometrias da tabela e que poder&aacute; ser editada. Essa coluna deve ter o SRID conhecido para permitir a edi&ccedil;&atilde;o. Para isso &eacute; necess&aacute;rio que exista uma CONSTRAINT, como nesse exemplo: ALTER TABLE esquema.tabela ADD CONSTRAINT enforce_srid_geom CHECK (st_srid(coluna_geometria) = 4326);",
		en : "Column that can be edited and contains geometries of the table.",
		es : "Columna que contiene las geometr&iacute;as de la tabla y que puede ser editada."
	} ],
    'bdGeomTitulo' : [ {
		pt : "Coluna com geometria",
		en : "Column with geometry",
		es : "Columna con geometr&iacute;a"
	} ],
    'minsize' : [ {
		pt : "Tamanho m&iacute;nimo em pixeis para desenhar um s&iacute;mbolo. Padr&atilde;o &eacute; 0. S&oacute; &eacute; &uacute;til quando usada escala de s&iacute;mbolos. Para s&iacute;mbolos do tipo hatch, o tamanho &eacute; a dist&acirc;ncia entre linhas hachuradas.",
		en : "Minimum size in pixels to draw a symbol. Default is 0. It is only useful when using symbol scale. For hatch symbols, size is the distance between hatched lines.",
		es : "Tama&ntilde;o m&iacute;nimo en p&iacute;xeles para dibujar un s&iacute;mbolo. El valor predeterminado es 0. Solo es &uacute;til cuando se utiliza escala de s&iacute;mbolos. Para los s&iacute;mbolos de tipo hatch, el tama&ntilde;o es la distancia entre l&iacute;neas."
	} ],
    'encoding' : [ {
		pt : "Formato de codifica&ccedil;&atilde;o suportado para ser usado para as labels. Se o formato n&atilde;o for suprotado, a label n&atilde;o ser&aacute; desenhada. Requer a biblioteca iconv (presente na maior parte dos sistemas). A biblioteca &eacute; sempre detectada se estiver presente no sistema, mas, se n&atilde;o for, a label n&atilde;o ser&aacute; desenhada. Necess&aacute;rio para exibi&ccedil;&atilde;o de caracteres internacionais. Mais informa&ccedil;&otilde;es podem ser encontradas em: http://www.foss4g.org/FOSS4G/MAPSERVER/mpsnf-i18n-en.html.",
		en : "Supported encoding format that will be used for labeling. If the format is not supported, the label will not be drawn. It requires the iconv library (installed on most systems). The library is always detected if it is present on the system, conversely, the label will not be drawn. It is required for displaying international characters. More information can be found at: http://www.foss4g.org/FOSS4G/MAPSERVER/mpsnf-i18n-en.html.",
		es : "Formato de codificaci&oacute;n soportado para ser utilizado para las etiquetas. Si el formato no es soportado, la etiqueta no se dibujar&aacute;. Requiere la biblioteca iconv (presente en la mayor&iacute;a de los sistemas). La biblioteca siempre se detecta si est&aacute; presente en el sistema, pero si no, la etiqueta no ser&aacute; dibujada. Necesario para la visualizaci&oacute;n de caracteres internacionales. Puede encontrar m&aacute;s informaci&oacute;n en: http://www.foss4g.org/FOSS4G/MAPSERVER/mpsnf-i18n-en.html."
	} ],
    'conexaoLayerLocal' : [ {
		pt : "Par&acirc;metros que permitem a conex&atilde;o com a fonte de dados local, como arquivos shapefile, bancos de dados, imagens de sat&eacute;lite, etc.",
		en : "Parameters that allow connection to local data source, such as shapefile files, databases, satellite images, etc.",
		es : "Par&aacute;metros que permiten la conexi&oacute;n con el origen de datos locales, como archivos shapefile, bases de datos, im&aacute;genes de sat&eacute;lite, etc."
	} ],
    'editavelLayer' : [ {
		pt : "Permite edi&ccedil;&atilde;o",
		en : "Allow editing",
		es : "Permite editar"
	} ],
    'comportamentoLayer' : [ {
		pt : "Comportamento no mapa",
		en : "Performance on the map",
		es : "Comportamiento en el mapa"
	} ],
    'txtComportamentoLayer' : [ {
		pt : "Par&acirc;metros que definem como a camada ir&aacute; se comportar quando for adicionada ao mapa.",
		en : "Parameters that define how the layer will perform when it is added to the map.",
		es : "Par&aacute;metros que definen c&oacute;mo la capa se comportar&aacute; cuando se a&ntilde;ada al mapa."
	} ],
    'testaLayer' : [ {
		pt : "Testar",
		en : "Test",
		es : "Probar"
	} ],
    'descriptiontemplate' : [ {
		pt : "Template utilizado no gerador de KML para definir o conte&uacute;do dos bal&otilde;es de informa&ccedil;&atilde;o. O template utiliza o caractere '%' para iniciar e fechar o nome de uma coluna. O template pode usar tamb&eacute;m elementos HTML, por exemplo: <code>'<b>Nome do municipio</b>: %NOMEMUN%'</code>. Se o template n&atilde;o for especificado, o i3Geo ir&aacute; utilizar o metadata ITENS e ITENSDESC. Se esses n&atilde;o forem especificados, ser&aacute; utilizado o nome original da coluna.",
		en : "Template used by the KML generator to define pop-up window content. The template uses '%' character to open and close a column name. The template can also use HTML elements, for example: <code>'<b>Nome do municipio</b>: %NOMEMUN%'</code>. If a template is not specified, i3Geo will use ITEMS and ITENSDESC from metadata. If not specified, the original column name will be used.",
		es : "Plantilla utilizada por el generador de KML para definir el contenido de las ventanas emergentes de informaci&oacute;n. La plantilla utiliza el car&aacute;cter '%' para iniciar y cerrar el nombre de una columna. La plantilla puede utilizar tambi&eacute;n elementos HTML, por ejemplo: <code>'<b>Nome do municipio</b>: %NOMEMUN%'</code>. Si la plantilla no se especifica, i3Geo utilizar&aacute; el metadato ITENS e ITENSDESC. Si no se especifica, se utilizar&aacute; el nombre original de la columna."
	} ],
    'descriptiontemplateTitulo' : [ {
		pt : "KML template",
		en : "KML template",
		es : "Plantilla KML"
	} ],
    'tema' : [ {
		pt : "Nome que ser&aacute; utilizado na legenda do mapa e na guia 'Temas'",
		en : "Name that will be shown in the map legend and the tab 'Themes'",
		es : "Nombre que se utilizar&aacute; en la leyenda del mapa y en la pesta&ntilde;a 'Temas'"
	} ],
    'Escala' : [ {
		pt : "Denominador da escala da fonte dos dados utilizado pelo tema. &Eacute; utilizado para apresentar a indica&ccedil;&atilde;o de compatibilidade entre a escala do tema e a escala do mapa que est&aacute; sendo visto.",
		en : "Scale denominator of data source used by the theme. It is used to display the compatibility indication  between the scale of the theme and the scale of the map being viewed.",
		es : "Denominador de la escala de la fuente de los datos utilizado por el tema. Se utiliza para mostrar la indicaci&oacute;n de compatibilidad entre la escala del tema y la escala del mapa que se est&aacute; viendo."
	} ],
    'escalaTitulo' : [ {
		pt : "Escala",
		en : "Scale",
		es : "Escala"
	} ],
    'exten' : [ {
		pt : "Extens&atilde;o geogr&aacute;fica m&aacute;xima do tema, no formato xmin ymin xmax ymax. &Eacute; utilizado na op&ccedil;&atilde;o de 'zoom para o tema'. Quando o tema &eacute; baseado em shapefile, esse metadata n&atilde;o &eacute; necess&aacute;rio, pois o mapserver consegue calcular a extens&atilde;o. J&aacute; em outros tipos de dados, como Postgis, o par&acirc;metro &eacute; necess&aacute;rio. Nesse caso, se n&atilde;o for indicado, o bot&atilde;o de zoom para o tema n&atilde;o ser&aacute; vis&iacute;vel para o usu&aacute;rio. Especificar a extens&atilde;o melhora a performance geral do i3Geo.",
		en : "Theme max extent (xmin ymin xmax ymax). It is used for the 'zoom to theme' option. When a theme is based on a shapefile, this metadata is not required because mapserver can calculate the extent. In other data types, such as Postgis, the parameter is required. In this case, if not indicated, the theme zoom button will not be available to users. Specifying an extent improves overall i3Geo performance.",
		es : "Extensi&oacute;n geogr&aacute;fica m&aacute;xima del tema en formato xmin ymin xmax ymax. Se utiliza en la opci&oacute;n 'zoom para el tema'. Cuando el tema se basa en un shapefile, este metadato no es necesario, ya que mapserver puede calcular la extensi&oacute;n. En otros tipos de datos, como Postgis, el par&aacute;metro es necesario. En todo caso, si no se indica, el bot&oacute;n de zoom para el tema no estar&aacute; visible para el usuario. Especificar la extensi&oacute;n mejora el rendimiento general del i3Geo."
	} ],
    'extenTitulo' : [ {
		pt : "Extensão",
		en : "Extent",
		es : "Extensi&oacute;n"
	} ],
    'iconeTema' : [ {
		pt : "&Iacute;cone que ser&aacute; mostrado na &aacute;rvore de camadas. A imagem deve existir na web e deve ser inclu&iacute;do o caminho completo ou relativo em rela&ccedil;&atilde;o ao local da interface HTML do mapa.",
		en : "Icon that will be shown in the layer tree. The icon should have an image on the web. You should include a full or relative path of the map HTML interface.",
		es : "Icono que se mostrar&aacute; en el &aacute;rbol de capas. La imagen debe existir en la web y debe incluirse la ruta completa o relativa en relaci&oacute;n con la ubicaci&oacute;n de la interfaz HTML del mapa."
	} ],
    'iconetemaTitulo' : [ {
		pt : "&Iacute;cone que ilustra o t&iacute;tulo",
		en : "Icon that illustrates the title",
		es : "Icono que ilustra el t&iacute;tulo"
	} ],
    'Mensagem' : [ {
		pt : "Mensagem que ser&aacute; mostrada no rodap&eacute; do mapa quando o tema estiver vis&iacute;vel. &Eacute; &uacute;til para apresentar ao usu&aacute;rio observa&ccedil;&otilde;es especiais sobre o uso daquele tema.",
		en : "Message that will be shown on the map footer when the theme is visible. It is useful for presenting to users special remarks on how to use that theme.",
		es : "Mensaje que se muestra en el pie de mapa cuando el tema es visible. Es &uacute;til para presentar al usuario observaciones especiales sobre el uso de ese tema."
	} ],
    'mensagemTitulo' : [ {
		pt : "Mensagem",
		en : "Message",
		es : "Mensaje"
	} ],
	'fonteTema' : [{
		pt : "Link para os metadados",
		en : "Link to metadata",
		es : "Enlace a los metadatos"
	}],
	'clonaMapfile' : [{
		pt : "Faz uma c&oacute;pia do mapfile atual com um novo nome e novo t&iacute;tulo",
		en : "Make a copy of the current mapfile with a new name and new title",
		es : "Hace una copia del mapfile actual con un nuevo nombre y nuevo t&iacute;tulo"
	}],
	'validar' : [{
		pt : "Listar apenas os mapfiles segundo os seguintes crit&eacute;rios",
		en : "List only mapfiles according to the following criteria",
		es : "Listar solo los mapfiles seg&uacute;n los siguientes criterios"
	}],
	'tituloLegenda' : [{
		pt : "T&iacute;tulo para a legenda e &aacute;rvore de camadas",
		en : "Title for the legend and the layer tree",
		es : "T&iacute;tulo para la leyenda y &aacute;rbol de capas"
	}],
	'cdados' : [{
		pt : "Caracter&iacute;sticas gerais dos dados",
		en : "Main characteristics of data",
		es : "Caracter&iacute;sticas generales de los datos"
	}],
	'txtCdados' : [{
		pt : "Par&acirc;metros que apresentam as caracter&iacute;sticas gerais dos dados, como escala, extens&atilde;o geogr&aacute;fica, codifica&ccedil;&atilde;o de caracteres, etc.",
		en : "Parameters that present main characteristics of data, such as scale, geographic extent, character encoding, etc.",
		es : "Par&aacute;metros que presentan las caracter&iacute;sticas generales de los datos, como escala, extensi&oacute;n geogr&aacute;fica, codificaci&oacute;n de caracteres, etc."
	}],
	'tituloEncoding' : [{
		pt : "C&oacute;digo de caracteres (encoding)",
		en : "Code of characters (encoding)",
		es : "C&oacute;digo de caracteres (encoding)"
	}],
	'txtEncoding' : [{
		pt : "Para vers&atilde;o 7 e posteriores. O Mapserver sempre renderiza etiquetas em UTF-8. Se os dados n&atilde;o est&atilde;o nessa codifica&ccedil;&atilde;o, deve-se especific&aacute;-la aqui para que a convers&atilde;o ocorra de forma correta.",
		en : "In version 7 and later. Mapserver always renders tags using UTF-8 codification. If the data is not in this encoding, you must specify it here so that conversion occurs correctly.",
		es : "Para la versi&oacute;n 7 y posterior. Mapserver siempre renderiza etiquetas en UTF-8. Si los datos no est&aacute;n en esta codificaci&oacute;n, se debe especificar aqu&iacute; para que la conversi&oacute;n ocurra de forma correcta."
	}],
	'renderizacao' : [{
		pt : "Renderiza&ccedil;&atilde;o",
		en : "Rendering",
		es : "Renderizaci&oacute;n"
	}],
	'txtRenderizacao' : [{
		pt : "Par&acirc;metros que controlam caracter&iacute;sticas gerais de renderiza&ccedil;&atilde;o, como uso de tiles, corte de tiles, etc.",
		en : "Parameters that control main rendering characteristics, such as tiles use, cutting tiles, etc.",
		es : "Par&aacute;metros que controlan las caracter&iacute;sticas generales de renderizaci&oacute;n, como uso de teselas, corte de teselas, etc."
	}],
	'maxfeaturesTitulo' : [{
		pt : "M&aacute;ximo de elementos",
		en : "Max features",
		es : "M&aacute;ximo de entidades"
	}],
	'Maxfeatures' : [{
		pt : "N&uacute;mero m&aacute;ximo de elementos que podem ser mostrados em cada janela de apresenta&ccedil;&atilde;o (imagem renderizada).",
		en : "Maximum number of features that can be shown in each presentation window (rendered image).",
		es : "N&uacute;mero m&aacute;ximo de entidades que se pueden mostrar en cada ventana de presentaci&oacute;n (imagen renderizada)."
	}],
    'conexaoOgc' : [ {
		pt : "Conex&atilde;o com servi&ccedil;os OGC (webservices)",
		en : "OGC service connection (webservices)",
		es : "Conexi&oacute;n con servicios OGC (webservices)"
	} ],
    'conexaoLayerOgc' : [ {
		pt : "Par&acirc;metros que permitem a conex&atilde;o com dados externos por meio dos padr&otilde;es OGC",
		en : "Parameters that allow connection to external data by OGC standards",
		es : "Par&aacute;metros que permiten la conexi&oacute;n con datos externos a trav&eacute;s de los est&aacute;ndares OGC"
	} ],
    'conexaoLayerOgcUrl' : [ {
		pt : "Sobre os par&acirc;metros utilizados, veja detalhes em ",
		en : "To obtain details about the parameters used to enable this connection, see at ",
		es : "Sobre los par&aacute;metros utilizados, vea detalles en "
	} ],
    'filtroPrefixo' : [ {
		pt : "Palavra para filtrar a lista de mapfiles",
		en : "Filter the mapfile list by using keywords in the search box",
		es : "Palabra para filtrar la lista de mapfiles"
	} ],
    'WkttipTitulo' : [ {
		pt : "Mostra a geometria ao clicar no mapa com a ferramenta de identifica&ccedil;&atilde;o (tip)",
		en : "Show the geometry when clicking on the map with the identification tool (tip)",
		es : "Muestra la geometr&iacute;a al hacer clic sobre el mapa con la herramienta de identificaci&oacute;n (tip)"
	} ],
    'Wkttip' : [ {
		pt : "Mostra a geometria",
		en : "Show the geometry",
		es : "Muestra la geometr&iacute;a"
	} ],
	'txtCompatibilidade' : [ {
		pt : "<p><b>Mudan&ccedil;as na vers&atilde;o 7 do Mapserver</b></p><li>N&atilde;o permite o uso do tipo de layer ANNOTATION. Voc&ecirc; deve substituir por um dos tipos permitidos (POINT, LINE, POLYGON...).</li><li>Ao usar CLUSTER substitua Cluster:FeatureCount por Cluster_FeatureCount.</li>",
		en : "<p><b>Changes in Mapserver 7</b></p><li>It does not allow to use ANNOTATION layer type. You must replace it with one of the allowed types (POINT, LINE, POLYGON ...).</li><li>When using CLUSTER replace Cluster: FeatureCount with Cluster_FeatureCount.</li>",
		es : "<p><b>Cambios en la versi&oacute;n 7 de Mapserver</b></p><li>No permite el uso del layer del tipo ANNOTATION. Usted debe reemplazarlo por uno de los tipos permitidos (POINT, LINE, POLYGON ...).</li><li>Al utilizar CLUSTER, reemplace Cluster: FeatureCount por Cluster_FeatureCount.</li>"
	} ],
    'cacheprefixoTitulo' : [ {
		pt : "Prefixo utilizado para o cache",
		en : "",
		es : ""
	} ],
    'Cacheprefixo' : [ {
		pt : "Prefixo (texto sem caracteres especiais e sem espa&ccedil;os em branco) que ser&aacute; utilizado para dar nome ao arquivo de armazenamento de cache. Voc&ecirc; pode alterar esse prefixo quando for necess&aacute;rio utilizar um novo cache, por exemplo, quando for feita alguma altera&ccedil;&atilde;o na simbologia da camada.",
		en : "",
		es : ""
	} ]
};
