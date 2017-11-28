i3GEOadmin.principal = {};
i3GEOadmin.principal.dicionario = {
    'adminI3geo' : [ {
		pt : "Administra&ccedil;&atilde;o do i3Geo",
		en : "i3Geo management system",
		es : "Administraci&oacute;n del i3Geo"
	} ],
	'msgBemVindo' : [ {
		pt : "<big>Bem-vindo ao sistema de administra&ccedil;&atilde;o do i3Geo. Aqui voc&ecirc; tem acesso &agrave;s principais funcionalidades de administra&ccedil;&atilde;o do sistema. No menu superior voc&ecirc; encontra atalhos para cada m&oacute;dulo do sistema de administra&ccedil;&atilde;o. Configura&ccedil;&otilde;es adicionais s&atilde;o feitas a partir da edi&ccedil;&atilde;o do arquivo <samp>i3geo/ms_configura.php</samp>. Caso n&atilde;o tenha acesso a esse arquivo, entre em contato com o administrador do seu servidor.",
		en : "<big>Welcome to the i3Geo management system. Here you can access to the main features of the management system. On the top menu you will find shortcuts for each module of the management system. For additional settings you should edit the <samp>i3geo/ms_configura.php</samp> file. If you do not have access to this file, contact your server administrator.",
		es : "<big>Bienvenido al sistema de administraci&oacute;n de i3Geo. Aqu&iacute; usted tiene acceso a las principales funciones de administraci&oacute;n del sistema. En el men&uacute; superior encontrar&aacute; accesos directos para cada m&oacute;dulo del sistema de administraci&oacute;n. Las configuraciones adicionales se realizan con la edici&oacute;n del archivo <samp>i3geo/ms_configura.php</samp>. Si no tiene acceso a este archivo, p&oacute;ngase en contacto con el administrador del servidor."
	} ],
	'msgLogin' : [ {
		pt : "Se voc&ecirc; tem acesso a essa p&aacute;gina voc&ecirc; est&aacute; logado como administrador. Caso seja a primeira vez que acessa o sistema voc&ecirc; deve estar logado como usu&aacute;rio master. As credenciais para acesso como master podem ser encontradas na vari&aacute;vel <code>$i3geomaster</code> do arquivo <samp>i3geo/ms_configura.php</samp>. &Eacute; importante alterar o login e a senha padr&atilde;o desse usu&aacute;rio, caso contr&aacute;rio os mapas ser&atilde;o bloqueados quando n&atilde;o estiver trabalhando em um ambiente local.",
		en : "If you have reached this page you are logged in as an administrator. If it is the first time you access the system you must be logged in as a master user. Credentials for access as a master user can be found on the <code>$i3geomaster</code> variable of the <samp>i3geo/ms_configura.php</samp> file. It is important to change the default login and password of this user, otherwise maps will be blocked when i3Geo is not working as localhost.",
		es : "Si usted tiene acceso a esta p&aacute;gina es porque usted ha ingresado como administrador. Si es la primera vez que accede al sistema, usted debe estar registrado como usuario master. Las credenciales para el acceso master se pueden encontrar en la variable <code>$i3geomaster</code> del archivo <samp>i3geo/ms_configura.php</samp>. Es importante cambiar el inicio de sesi&oacute;n y la contrase&ntilde;a predeterminada de ese usuario, de lo contrario los mapas se bloquear&aacute;n cuando no est&eacute; trabajando de manera local."
	} ],
	'msgFerramentas' : [ {
		pt : "Na guia <kbd>Ferramentas</kbd> voc&ecirc; tem acesso &agrave;s funcionalidades mais b&aacute;sicas de administra&ccedil;&atilde;o. A partir dela voc&ecirc; pode abrir o mapa do i3Geo em sua interface padr&atilde;o e realizar o teste de instala&ccedil;&atilde;o. O <kbd>Teste de Instala&ccedil;&atilde;o</kbd> &eacute; importante para verificar se todas as depend&ecirc;ncias do sistema foram instaladas corretamente, a vers&atilde;o do i3Geo, do MapServer e do PHP, a localiza&ccedil;&atilde;o e permiss&otilde;es dos arquivos e pastas padr&atilde;o, al&eacute;m de identificar poss&iacute;veis erros de renderiza&ccedil;&atilde;o e codifica&ccedil;&atilde;o. &Eacute; recomendado rodar um teste de instala&ccedil;&atilde;o se estiver trabalhando em uma instala&ccedil;&atilde;o nova ou que sofreu altera&ccedil;&otilde;es em suas depend&ecirc;ncias.",
		en : "On the <kbd>Tools</kbd> tab you have access to the most basic funcionalities of the management system. From there you can open an i3Geo map in its default interface and perform an installation test. The <kbd>Installation Test</kbd> is important to verify that all system dependencies have been properly installed, i3Geo version, MapServer and PHP , the locations and permissions of the default files and folders, and also to identify possible rendering and coding errors. It is recommended that you run an installation test if you are working on a new installation or if the installation have undergone changes of its dependencies.",
		es : "En la pesta&ntilde;a <kbd>Herramientas</kbd> usted tiene acceso a las caracter&iacute;sticas m&aacute;s b&aacute;sicas de administraci&oacute;n. A trav&eacute;s de esa pesta&ntilde;a usted puede abrir el mapa del i3Geo en su interfaz est&aacute;ndar y realizar la prueba de instalaci&oacute;n. <kbd>La prueba de instalaci&oacute;n</kbd> es importante para comprobar que todas las dependencias del sistema se hayan instalado correctamente, la versi&oacute;n de i3Geo, MapServer y PHP, la ubicaci&oacute;n y los permisos de los archivos y las carpetas predeterminadas, adem&aacute;s de identificar posibles errores de renderizaci&oacute;n y codificaci&oacute;n. Se recomienda ejecutar una prueba de instalaci&oacute;n si est&aacute; trabajando en una instalaci&oacute;n nueva o que haya sufrido cambios en sus dependencias."
	} ],
	'msgSqlite' : [ {
		pt : "O i3Geo utiliza como padr&atilde;o o gerenciador de banco de dados SQLite, cujo arquivo com os dados fica armazenado em <samp>i3geo/admin/admin.db</samp>. Como o SQLite usa um arquivo em disco &eacute;, necess&aacute;rio se atentar &agrave;s permiss&otilde;es de acesso caso ocorram problemas de escrita no banco, principalmente em ambientes Linux. Os programas em PHP que gerenciam esse banco utilizam o pacote PDO, possibilitando que seja utilizado outro gerenciador, como o PostgreSQL, por exemplo. Para modificar a configura&ccedil;&atilde;o do PDO e utilizar outro gerenciador deve-se editar o arquivo <samp>i3geo/admin/conexao.php</samp> ou ent&atilde;o alterar a vari&aacute;vel de <code>$conexaoadmin</code> definida no arquivo <samp>i3geo/ms_configura.php</samp>. Essa vari&aacute;vel indica o nome de um programa em PHP que ser&aacute; inclu&iacute;do nos programas que fazem acesso ao banco de dados de administra&ccedil;&atilde;o. Para usar um gerenciador diferente do SQLite &eacute; necess&aacute;rio criar as tabelas no novo banco de dados. Os scripts SQL para essa cria&ccedil;&atilde;o podem ser obtidos no item <kbd>Ferramentas</kbd> > <kbd>Outras op&ccedil;&otilde;es</kbd> > <kbd>Criar banco de dados</kbd>.",
		en : "By default, i3Geo uses  the SQLite database manager, whose data file is stored in <samp>i3geo/admin/admin.db</samp>. Since SQLite uses a file on disk, it is necessary to pay attention to access permissions because there could be writing issues in the database, especially in Linux environments. PHP programs that manage this database use the PDO package, it allows you to use another DB manager such as PostgreSQL. To modify PDO settings and to use another DB manager edit the <samp>i3geo/admin/conexao.php</samp> file or change the <code>$conexaoadmin</code> variable defined in the <samp>i3geo/ms_configura.php</samp> file. This variable indicates the name of a PHP program that will be included in programs that access the administration database. To use a DB manager other than SQLite, you must create tables in the new database. The SQL scripts to do this can be obtained from <kbd>Tools</kbd> > <kbd>Other options</kbd> > <kbd>Create database</kbd>.",
		es : "i3Geo utiliza por defecto el gestor de base de datos SQLite, cuyo archivo con los datos se almacena en <samp>i3geo/admin/admin.db</samp>. Como SQLite utiliza un archivo en el disco es necesario tener en cuenta los permisos de acceso si se presentan problemas de escritura en la base de datos, principalmente en entornos Linux. Los programas en PHP que gestionan esta base de datos utilizan el paquete PDO, posibilitando que se utilice otro gestor, como PostgreSQL, por ejemplo. Para modificar la configuraci&oacute;n del PDO y utilizar otro gestor se debe editar el archivo <samp>i3geo/admin/conexion.php</samp> o cambiar la variable de <code>$conexaoadmin</code> definida en el archivo <samp>i3geo/ms_configura.php</samp>. Esta variable indica el nombre de un programa en PHP que se incluir&aacute; en los programas que tienen acceso a la base de datos de administraci&oacute;n. Para utilizar un gestor diferente de SQLite es necesario crear las tablas en la nueva base de datos. Los scripts SQL para esta creaci&oacute;n se pueden obtener en el item <kbd>Herramientas</kbd> > <kbd>Otras opciones</kbd> > <kbd>Crear base de datos</kbd>."
	} ],
	'msgUsr' : [ {
		pt : "Na guia <kbd>Usu&aacute;rios</kbd> voc&ecirc; pode criar e manipular os usu&aacute;rios, grupos de usu&aacute;rios e as opera&ccedil;&otilde;es que cada elemento pode realizar dentro do sistema.",
		en : "On the <kbd>Users</kbd> tab you can create and handle users, user groups, and operations that each component can perform within the system.",
		es : "En la pesta&ntilde;a <kbd>Usuarios</kbd> usted puede crear y manipular los usuarios, grupos de usuarios y las operaciones que cada componente puede realizar dentro del sistema."
	} ],
	'msgMetaestat' : [ {
		pt : "Em <kbd>Metaestat</kbd> &eacute; poss&iacute;vel cadastrar vari&aacute;veis e medidas que compor&atilde;o metadados para a visualiza&ccedil;&atilde;o de informa&ccedil;&otilde;es estat&iacute;sticas em uma determinada regi&atilde;o, os chamados metadados estat&iacute;sticos. Dessa forma, &eacute; poss&iacute;vel configurar visualiza&ccedil;&otilde;es espaciais padr&atilde;o para vari&aacute;veis estat&iacute;sticas.",
		en : "<kbd>Metaestat</kbd> allows you to register variables and measures that will make up metadata for statistical information visualization of a  given region, the so-called statistical metadata. In this way, you can configure default spatial views for statistical variables.",
		es : "En <kbd>Metaestat</kbd> es posible registrar variables y medidas que conformar&aacute;n los metadatos para la visualizaci&oacute;n de informaciones estad&iacute;sticas de una determinada regi&oacute;n, los llamados metadatos estad&iacute;sticos. De esta manera, es posible configurar vistas espaciales est&aacute;ndar para variables estad&iacute;sticas."
	} ],
	'msgUpload' : [ {
		pt : "No m&oacute;dulo <kbd>Upload</kbd> voc&ecirc; pode realizar a subida para o servidor ou diretamente para o banco de dados de arquivos nos formato shapefile ou CSV. Para isso, &eacute; preciso configurar a vari&aacute;vel  <code>$i3geoUploadDataWL</code> do arquivo <samp>i3geo/ms_configura</samp> com as pastas no servidor que podem receber arquivos ou com a string de conex&atilde;o com banco e esquema, no caso de carga em banco de dados.",
		en : "The <kbd>Upload</kbd> module allows you to upload to the server or directly to the database, files in shapefile or CSV format. To do this, you must set up the <code>$i3geoUploadDataWL</code> variable of the <samp>i3geo/ms_configura</samp> file with the folders on the server that can receive files or in the case of database loading,  with the connection string of the database and schema.",
		es : "En el m&oacute;dulo <kbd>Subir</kbd> usted puede subir al servidor o directamente a la base de datos, archivos en formato shapefile o CSV. Para ello es necesario configurar la variable <code>$i3geoUploadDataWL</code> del archivo <samp>i3geo/ms_configura</samp> con las carpetas en el servidor que pueden recibir archivos o con la cadena de conexi&oacute;n con la base de datos y el esquema, en el caso de carga en base de datos."
	} ],
	'msgCatalogo' : [ {
		pt : "Na guia <kbd>Cat&aacute;logo</kbd> &eacute; onde s&atilde;o criadas as camadas dos mapas (arquivos mapfiles). As camadas s&atilde;o organizadas em uma &aacute;rvore de temas compostas por menus, grupos e subgrupos. &Eacute; poss&iacute;vel atribuir perfis para camadas espec&iacute;ficas ou para um agrupamento de camadas, tornando-os vis&iacute;veis apenas para os perfis desejados.",
		en : "The <kbd>Catalog</kbd> tab allows you to create map layers (mapfiles). Layers are arranged in a theme tree made up of menus, groups, and subgroups. You can assign profiles for specific layers or for a layer group, making them visible for desired profiles only.",
		es : "En la pesta&ntilde;a <kbd>Cat&aacute;logo</kbd> es donde se crean las capas de los mapas (archivos mapfiles). Las capas se organizan en un &aacute;rbol de temas compuesto por men&uacute;s, grupos y subgrupos. Usted puede asignar perfiles para capas espec&iacute;ficas o para una agrupaci&oacute;n de capas, haci&eacute;ndolas visibles solo para los perfiles deseados."
	} ],
	'msgCadastro' : [ {
		pt : "Em <kbd>Cadastros</kbd> &eacute; onde s&atilde;o realizadas as configura&ccedil;&otilde;es de conex&otilde;es com servi&ccedil;os e sistemas externos que podem ser utilizados como camadas ou como configura&ccedil;&otilde;es adicionais para os temas.",
		en : "The <kbd>Registers</kbd> tab allows you to set up connection parameters with external services and systems that can be used as layers or as additional settings for themes.",
		es : "En <kbd>Registros</kbd> es donde se realizan las configuraciones de conexiones con servicios y sistemas externos que pueden ser utilizados como capas o como configuraciones adicionales para los temas."
	} ],
    'manualAdmin' : [ {
		pt : "Manual do sistema de administra&ccedil;&atilde;o",
		en : "Management system manual",
		es : "Manual del sistema de administraci&oacute;n"
	} ],
    'veja' : [ {
		pt : "Veja tamb&eacute;m:",
		en : "See also:",
		es : "Ver tambi&eacute;n:"
	} ],
    'merBdAdmin' : [ {
		pt : "diagrama MER do banco de dados de administra&ccedil;&atilde;o.",
		en : "MER diagram of the administration database.",
		es : "diagrama MER de la base de datos de administraci&oacute;n."
	} ],
    'merBdUsr' : [ {
		pt : "diagrama MER do banco de dados de usu&aacute;rios.",
		en : "MER diagram of the user database.",
		es : "diagrama MER de la base de datos de usuarios."
	} ],
    'merBdMetaestat' : [ {
		pt : "diagrama MER do banco de dados do sistema de metadados estat&iacute;sticos.",
		en : "MER diagram of the database for the statistical metadata system.",
		es : "diagrama MER de la base de datos del sistema de metadatos estad&iacute;sticos."
	} ],
    'leiaMe' : [ {
		pt : "Entre uma vers&atilde;o e outra do i3Geo o banco de dados de administra&ccedil;&atilde;o pode sofrer altera&ccedil;&otilde;es. Consulte o documento <samp>i3geo/guia_de_migracao.txt</samp> para verificar os detalhes.",
		en : "The administration database may change from one i3Geo version to another. See: <samp>i3geo/guia_de_migracao.txt</samp> for details.",
		es : "Entre una versi&oacute;n y otra de i3Geo, la base de datos de administraci&oacute;n puede sufrir cambios. Consulte el documento <samp>i3geo/guia_de_migracao.txt</samp> para ver detalles."
	} ],
    'leiaMe1' : [ {
		pt : "Na vers&atilde;o 7 do i3Geo, a op&ccedil;&atilde;o de cadastro de conex&otilde;es com o banco de dados foi removida. A string de conex&atilde;o deve ser definida no arquivo i3geo/ms_configura.php por meio da vari&aacute;vel $postgis_mapa (veja detalhes nesse mesmo arquivo).",
		en : "In i3Geo version 7, the option for registering connections to the database has been removed. A connection string must be defined in the i3geo/ms_configura.php file through the $postgis_mapa variable (see details in that file).",
		es : "En la versi&oacute;n 7 de i3Geo se ha eliminado la opci&oacute;n de registro de conexiones con la base de datos. La cadena de conexi&oacute;n debe ser definida en el archivo i3geo/ms_configura.php a trav&eacute;s de la variable $postgis_mapa (ver detalles en ese mismo archivo)."
	} ],
    'erroLogin' : [ {
		pt : "&Eacute; necess&aacute;rio fazer login",
		en : "Login required",
		es : "Es necesario iniciar sesi&oacute;n"
	} ]

};
