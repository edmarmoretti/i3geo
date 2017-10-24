if(typeof i3GEOadmin.uploadshp == "undefined" ){
	i3GEOadmin.uploadshp = {};
}
i3GEOadmin.uploadshp.dicionario = {
	'pastaArmazenamento' : [ {
		pt : "Pasta no servidor onde os dados ser&atilde;o armazenados.",
		en : "Folder on the server where the data will be stored.",
		es : "Carpeta del servidor donde los datos ser&aacute;n almacenados."
	} ],
	'projecao' : [ {
		pt : "Proje&ccedil;&atilde;o (apenas ser&aacute; utilizado se n&atilde;o for feito o upload de um arquivo .prj)",
		en : "Projection (it will be used only if a .prj file is not uploaded)",
		es : "Proyecci&oacute;n (solo se utilizar&aacute; si no se carga un archivo.prj)"
	} ],
	'envia' : [ {
		pt : "Enviar",
		en : "Send",
		es : "Enviar"
	} ],
	'criaMapfile' : [ {
		pt : "Marque para criar o arquivo de configura&ccedil;&atilde;o (mapfile) e visualizar os dados no mapa interativo (voc&ecirc; poder&aacute; editar esse arquivo posteriormente no editor de mapfiles)",
		en : "Check to create a configuration file (mapfile) and visualize the data on an interactive map (you will be able to edit this file later using the mapfile editor)",
		es : "Marque para crear el archivo de configuraci&oacute;n (mapfile) y ver los datos en el mapa interactivo (usted puede editar este archivo m&aacute;s adelante en el editor de mapfiles)"
	} ],
	'txtTitulo' : [ {
		pt : "Upload de arquivo shapefile",
		en : "Upload shapefile",
		es : "Cargar archivo shapefile"
	} ],
	'txtDesc' : [ {
		pt : "Aqui &eacute; poss&iacute;vel subir um arquivo shapefile (.shp, .shx, .dbf e .prj) diretamente para o servidor onde est&aacute; instalado o i3Geo. Caso n&atilde;o seja inclu&iacute;do um arquivo .prj, o usu&aacute;rio pode informar a proje&ccedil;&atilde;o no momento da subida a partir de uma lista. Tamb&eacute;m &eacute; poss&iacute;vel escolher se se deseja criar um mapfile para o tema automaticamente.</p><p>&Eacute; preciso configurar a vari&aacute;vel <code>$i3geoUploadDataWL</code> do arquivo <samp>i3geo/ms_configura.php</samp> com as pastas no servidor que podem receber arquivos.",
		en : "Here it is possible to upload a shapefile (.shp, .shx, .dbf and .prj) directly to the server where i3Geo is installed. If a .prj file is not included, the user can specify the projection when uploading from a list. If you wish you can create automatically a mapfile for the theme.</p><p> You must set up the <code>$i3geoUploadDataWL</code> variable of the <samp>i3geo/ms_configura.php</samp> file with the server folders that can receive files.",
		es : "Aqu&iacute; es posible subir un archivo shapefile (.shp, .shx, .dbf y .prj) directamente al servidor donde est&aacute; instalado i3Geo. Si no se incluye el archivo .prj el usuario puede indicar la proyecci&oacute;n al momento de cargar desde una lista. Si lo desea, tambi&eacute;n puede crear autom&aacute;ticamente un mapfile para el tema.</p><p>Es necesario configurar la variable <code>$i3geoUploadDataWL</code> del <samp>i3geo/ms_configura.php</samp> con las carpetas en el servidor que pueden recibir archivos."
	} ],
	'txtAjuda' : [ {
		pt : "A pasta no servidor onde o arquivo ficar&aacute; armazenado deve ter as permiss&otilde;es adequadas para permitir o armazenamento dos arquivos. Verifique com o administrador do servidor essas permiss&otilde;es e os endere&ccedil;os das pastas que podem receber arquivos.<br>Para evitar a remo&ccedil;&atilde;o de arquivos que est&atilde;o em uso por outros usu&aacute;rios, n&atilde;o &eacute; permitido apagar arquivos. Para apagar arquivos, solicite diretamente ao administrador do servidor.",
		en : "The folder on the server where the file will be stored must have appropriate permissions to allow the files to be stored. Check with the server administrator permissions and paths of the folders that can receive files.<br>To prevent the loss of files that are in use by other users, it is not allowed to delete files. Ask the server administrator directly if you want to delete files.",
		es : "La carpeta en el servidor donde se almacenar&aacute; el archivo debe tener los permisos adecuados para permitir el almacenamiento de los archivos. Compruebe con el administrador del servidor estos permisos y las rutas de las carpetas que pueden recibir archivos.<br>Para evitar la eliminaci&oacute;n de archivos que est&aacute;n en uso por otros usuarios no se permite borrar archivos. Haga la solicitud directamente al administrador del servidor si desea borrar un archivo."
	} ],
	'txtArquivos' : [ {
		pt : "Escolha os arquivos que formam o shapefile",
		en : "Choose the files that make up the shapefile",
		es : "Seleccione los archivos que forman el shapefile"
	} ],
	'txtTituloShp2Pg' : [ {
		pt : "Importa&ccedil;&atilde;o de arquivo shapefile para PostGIS",
		en : "Importing shapefile file to PostGIS",
		es : "Importaci&oacute;n de archivos shapefile a PostGIS"
	} ],
	'txtDescShp2Pg' : [ {
		pt : "Aqui &eacute; poss&iacute;vel subir uma camada shapefile (.shp, .shx, .dbf) diretamente para um banco PostGIS. O usu&aacute;rio deve escolher o esquema e incluir o nome de uma tabela. Caso j&aacute; exista uma tabela com o mesmo nome, &eacute; poss&iacute;vel escolher se se quer inserir novos registros na tabela ou apagar os registros existentes e inserir novos. &Eacute; poss&iacute;vel fazer a reproje&ccedil;&atilde;o do arquivo shapefile incluindo a proje&ccedil;&atilde;o de destino diferente da de origem. Tamb&eacute;m &eacute; poss&iacute;vel escolher se se deseja criar um mapfile para o tema automaticamente.<p></p>&Eacute; preciso configurar a vari&aacute;vel <code>$i3geoUploadDataWL</code> do arquivo <samp>i3geo/ms_configura.php</samp> com a string de conex&atilde;o com banco e esquema.",
		en : "Here, it is possible to upload a shapefile (.shp, .shx, .dbf) directly to a PostGIS database. The user must select a schema and type a table name. If a table with the same name already exists, you can choose whether to insert new records  or delete existing records and insert new ones. It is possible to reproject the shapefile including a projection different from the source. If you wish you can create automatically a mapfile for the theme.</p><p>You must configure the <code>$i3geoUploadDataWL</code> variable of the <samp>i3geo/ms_configura.php</samp> file with the connection string of the database and schema.",
		es : "Aqu&iacute; es posible subir una capa shapefile (.shp, .shx, .dbf) directamente a una base de datos PostGIS. El usuario debe seleccionar un esquema e incluir el nombre de la tabla. Si ya existe una tabla con el mismo nombre, puede optar por insertar  registros nuevos en la tabla o borrar los registros existentes e insertar nuevos. Puede reproyectar el archivo shapefile incluyendo una proyecci&oacute;n de destino distinta de la de origen. Si lo desea, tambi&eacute;n puede optar por crear un mapfile para el tema.<p></p> Es necesario configurar la variable <code>$i3geoUploadDataWL</code> del archivo <samp>i3geo/ms_configura.php</samp> con la cadena de conexi&oacute;n con la base de datos y esquema."
	} ],
	'txtAjudaShp2Pg' : [ {
		pt : "No formul&aacute;rio deve-se indicar os arquivos nos formatos SHP, SHX e DBF que formam o SHAPEFILE. O arquivo &eacute; enviado ao servidor e armazenado temporariamente para que a convers&atilde;o para PostGIS seja poss&iacute;vel. O resultado do processo ser&aacute; uma tabela no banco de dados no esquema escolhido pelo usu&aacute;rio. O acesso ao banco &eacute; feito por meio do usu&aacute;rio administrativo da aplica&ccedil;&atilde;o i3Geo (o mesmo que gerencia o sistema de administra&ccedil;&atilde;o, veja em ms_configura.php). Esse usu&aacute;rio, definido pelo administrador do servidor, deve ter os direitos de escrita no esquema do banco de dados escolhido para importar os dados.",
		en : "You must indicate on the form the SHP, SHX and DBF formats that make up a SHAPEFILE. The file will be uploaded to the server and stored temporarily to convert it to PostGIS. The result of the process will be a table in a database schema chosen by the user. The access to the database is done through the administrator user of i3Geo (the same who manages the management system, see ms_configura.php). This user, defined by the server administrator, must have write permissions to the database schema chosen to import the data.",
		es : "En el formulario se deben indicar los archivos en los formatos SHP, SHX y DBF que forman el SHAPEFILE. El archivo se env&iacute;a al servidor y se almacena temporalmente para que la conversi&oacute;n a PostGIS sea posible. El resultado del proceso ser&aacute; una tabla en la base de datos del esquema elegido por el usuario. El acceso a la base de datos se realiza a trav&eacute;s del usuario administrador de la aplicaci&oacute;n i3Geo (el mismo que administra el sistema de administraci&oacute;n, vea en ms_configura.php). Este usuario, definido por el administrador del servidor, debe tener los derechos de escritura en el esquema elegido de la base de datos para importar los datos."
	} ],
	'esquemaArmazenamento' : [ {
		pt : "Esquema no banco de dados onde a tabela ser&aacute; criada",
		en : "Database schema where the table will be created",
		es : "Esquema de la base de datos donde se crear&aacute; la tabla"
	} ],
	'sridOrigem' : [ {
		pt : "C&oacute;digo num&eacute;rico SRID (proje&ccedil;&atilde;o cartogr&aacute;fica) referente ao arquivo shapefile",
		en : "SRID numeric code (cartographic projection) of the shapefile",
		es : "C&oacute;digo num&eacute;rico SRID (proyecci&oacute;n cartogr&aacute;fica) relacionado con el archivo shapefile"
	} ],
	'sridDestino' : [ {
		pt : "C&oacute;digo num&eacute;rico SRID (proje&ccedil;&atilde;o cartogr&aacute;fica) que ser&aacute; utilizado para armazenar os dados no banco",
		en : "SRID numeric code (cartographic projection) that will be used to store the data in the database",
		es : "C&oacute;digo num&eacute;rico SRID (proyecci&oacute;n cartogr&aacute;fica) que se utilizar&aacute; para almacenar los datos en la base de datos"
	} ],
	'tipoOperacao' : [ {
		pt : "Tipo de opera&ccedil;&atilde;o. Sempre &eacute; criado um backup no banco caso a tabela j&aacute; exista.",
		en : "Operation type. A backup is always created in the database if the table already exists.",
		es : "Tipo de operaci&oacute;n. Siempre se crea una copia de seguridad en el base de datos si la tabla ya existe."
	} ],
	'tabelaNova' : [ {
		pt : "Tabela nova",
		en : "New table",
		es : "Tabla nueva"
	} ],
	'tabelaUpdate' : [ {
		pt : "Apagar registros e inserir novos",
		en : "Delete records and insert new ones",
		es : "Borrar los registros e insertar nuevos"
	} ],
	'tabelaInsert' : [ {
		pt : "Inserir registros novos",
		en : "Insert new records",
		es : "Insertar registros nuevos"
	} ],
	'nomeTabela' : [ {
		pt : "Nome da nova tabela ou de uma tabela j&aacute; existente",
		en : "Name of a new table or an existing table",
		es : "Nombre de la nueva tabla o de una tabla existente"
	} ],
	'apenasScript' : [ {
		pt : "N&atilde;o cria ou modifica a tabela, apenas mostra nos resultados o script SQL",
		en : "Do not create or modify the table, show only the SQL script on the results",
		es : "No crea o modifica la tabla, solo muestra en los resultados el script SQL"
	} ],
	'comentarioTabela' : [ {
		pt : "Coment&aacute;rio que ser&aacute; inserido nas propriedades da tabela caso seja uma nova tabela",
		en : "If it is a new table, comment that will be inserted into the table properties",
		es : "Comentario que se insertar&aacute; en las propiedades de la tabla en caso de que sea una tabla nueva"
	} ],
	'colunaGid' : [ {
		pt : "Nome de uma nova coluna, ou de uma existente no arquivo de upload, que ser&aacute; considerada como identificadores &uacute;nicos de cada registro. Caso a coluna n&atilde;o exista, ser&aacute; criada.",
		en : "Name of a new column or an existing one in the shapefile, which will be considered as unique identifiers for each record.",
		es : "Nombre de una columna nueva o de una existente en el shapefile que se considerar&aacute; como identificadores &uacute;nicos de cada registro."
	} ],
	'comboAliasConexao' : [ {
		pt : "Alias da conex&atilde;o com o banco de dados. Ser&aacute; utilizado apenas para o caso de constru&ccedil;&atilde;o do arquivo mapfile.",
		en : "Alias to connect to the database. It will be used for building mapfiles only.",
		es : "Alias de conexi&oacute;n con la base de datos. Se utilizar&aacute; solo para el caso de construcci&oacute;n del archivo mapfile."
	} ],
	'txtTituloCsv2Pg' : [ {
		pt : "Importa&ccedil;&atilde;o de arquivo CSV para PostGIS",
		en : "Importing CSV file to PostGIS",
		es : "Importaci&oacute;n de archivos CSV a PostGIS"
	} ],
	'txtDescCsv2Pg' : [ {
		pt : "Aqui &eacute; poss&iacute;vel subir um arquivo .csv como uma camada geogr&aacute;fica em um banco PostGIS. O usu&aacute;rio deve escolher o esquema, as colunas que representam as coordenadas x (longitude) e y (latitude) e incluir o nome de uma tabela. Caso j&aacute; exista uma tabela com o mesmo nome, &eacute; poss&iacute;vel escolher se se quer inserir novos registros na tabela ou apagar os registros existentes e inserir novos. Tamb&eacute;m &eacute; poss&iacute;vel escolher se se deseja criar um mapfile para o tema automaticamente.<p></p>&Eacute; preciso configurar a vari&aacute;vel <code>$i3geoUploadDataWL</code> do arquivo <samp>i3geo/ms_configura.php</samp> com a string de conex&atilde;o com banco e esquema.",
		en : "Here, it is possible to upload a .csv file as a geographic layer in a PostGIS database. The user must choose a schema, columns that represent x (longitude) and y (latitude) coordinates, and include a table name. If a table with the same name already exists, you can choose whether to insert new records  or delete existing records and insert new ones. If you wish you can create automatically a mapfile for the theme.<p></p>You must configure the <code>$i3geoUploadDataWL</code> variable of the <samp>i3geo/ms_configura.php</samp> file with the connection string of the database and schema.",
		es : "Aqu&iacute; es posible subir un archivo .csv como una capa geogr&aacute;fica a una base de datos PostGIS. El usuario debe elegir el esquema, las columnas que representan las coordenadas x (longitud) e y (latitud) e incluir el nombre de una tabla. Si ya existe una tabla con el mismo nombre, puede insertar  registros nuevos en la tabla o borrar los registros existentes e insertar nuevos. Si lo desea, tambi&eacute;n puede optar por crear un mapfile para el tema.<p></p> Es necesario configurar la variable <code>$i3geoUploadDataWL</code> del archivo <samp>i3geo/ms_configura.php</samp> con la cadena de conexi&oacute;n con la base de datos y esquema."
	} ],
	'txtAjudaCsv2Pg' : [ {
		pt : "No formul&aacute;rio deve-se indicar o arquivo no formato CSV. O arquivo &eacute; enviado ao servidor e armazenado temporariamente para que a convers&atilde;o para PostGIS seja poss&iacute;vel. O resultado do processo ser&aacute; uma tabela no banco de dados no esquema escolhido pelo usu&aacute;rio. O acesso ao banco &eacute; feito por meio do usu&aacute;rio administrativo da aplica&ccedil;&atilde;o i3Geo (o mesmo que gerencia o sistema de administra&ccedil;&atilde;o, veja em ms_configura.php). Esse usu&aacute;rio, definido pelo administrador do servidor, deve ter os direitos de escrita no esquema do banco de dados escolhido para importar os dados.",
		en : "You must indicate on the form the file in CSV format. The file will be uploaded to the server and stored temporarily to convert it to PostGIS. The result of the process will be a table in a database schema chosen by the user. The access to the database is done through the administrator user of i3Geo (the same who manages the management system, see ms_configura.php). This user, defined by the server administrator, must have write permissions to the database schema chosen to import the data.",
		es : "En el formulario se debe indicar el archivo en formato CSV. El archivo se env&iacute;a al servidor y se almacena temporalmente para que la conversi&oacute;n a PostGIS sea posible. El resultado del proceso ser&aacute; una tabla en la base de datos del esquema elegido por el usuario. El acceso a la base de datos se realiza a trav&eacute;s del usuario administrador de la aplicaci&oacute;n i3Geo (el mismo que administra el sistema de administraci&oacute;n, vea en ms_configura.php). Este usuario, definido por el administrador del servidor, debe tener los derechos de escritura en el esquema elegido de la base de datos para importar los datos."
	} ],
	'txtArquivoCsv' : [ {
		pt : "Escolha o arquivo texto no formato CSV",
		en : "Choose a text file in CSV format",
		es : "Seleccione el archivo de texto en formato CSV"
	} ],
	'sridOrigemCsv' : [ {
		pt : "C&oacute;digo num&eacute;rico SRID (proje&ccedil;&atilde;o cartogr&aacute;fica) referente aos dados das colunas x e y caso sejam especificadas",
		en : "If specified, SRID numeric code (cartographic projection) of the x and y column",
		es : "C&oacute;digo num&eacute;rico SRID (proyecci&oacute;n cartogr&aacute;fica) relacionado con los datos de las columnas x e y, si se especifican"
	} ],
	'colunaX' : [ {
		pt : "Nome da coluna no arquivo CSV que contém os valores de coordenadas do eixo x (longitude)",
		en : "Column name of the CSV file that contains the x-coordinate values (longitude)",
		es : "Nombre de columna en el archivo CSV que contiene los valores de coordenadas del eje x (longitud)"
	} ],
	'colunaY' : [ {
		pt : "Nome da coluna no arquivo CSV que cont&eacute;m os valores de coordenadas do eixo y (latitude)",
		en : "Column name of the CSV file that contains the y-coordinate values (latitude)",
		es : "Nombre de columna en el archivo CSV que contiene los valores de coordenadas del eje y (latitud)"
	} ]
};
