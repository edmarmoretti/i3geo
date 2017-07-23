//+$trad(1,i3GEOadmin.principal.dicionario)+
i3GEOadmin.atlas = {};
i3GEOadmin.atlas.dicionario = {
	'adminAtlas' : [ {
		pt : "Administra&ccedil;&atilde;o do i3geo - Atlas ",
		en : "i3geo management - Atlas ",
		es : "Administraci&oacute;n de i3geo - Atlas "
	} ],
    'ajuda' : [ {
		pt : "Ajuda",
		en : "Help",
		es : "Ayuda"
	} ],
    'txtAjudaAtlas' : [ {
		pt : "<p>O cadastro de Atlas &eacute; utilizado na interface 'Atlas' do i3geo. Essa interface pode ser vista em http://localhost/i3geo/atlas<p>Cada Atlas possu&iacute; uma lista de pranchas e cada prancha uma lista de temas e outros par&acirc;metros.<p>A montagem de cada Atlas &eacute; feito definindo-se os par&acirc;metros de cada n&iacute;vel hier&aacute;rquico, editando-se uma &aacute;rvore cuja raiz &eacute; cada Atlas, seguido pelas pranchas e temas.<p>Para cada Atlas e cada prancha pode ser definido um texto explicativo que ser&aacute; aberto ao iniciar o Atlas ou a prancha.",
		es : "<p>El registro del Atlas es utilizado en la interfaz 'Atlas' de i3Geo. Esta interfaz puede ser vista en http://localhost/i3geo/atlas<p>Cada Atlas posee pesta&ntilde;as, cada pesta&ntilde;a posee una lista de temas y otros par&aacute;metros.<p> El montaje de cada Atlas se realiza estableciendo los par&aacute;metros de cada nivel jer&aacute;rquico, editando un &aacute;rbol cuya ra&iacute;z es cada Atlas, seguido por las pesta&ntilde;as y temas.<p>Para cada Atlas y cada pesta&ntilde;a se puede definir un texto explicativo que puede ser abierto al iniciar el Atlas o la pesta&ntilde;a.",
		en : "<p>The 'Atlas' interface of i3Geo is where you can record your atlases. You can access to this interface by http://localhost/i3geo/atlas<p>Each atlas contains tabs, each tab contains a list of themes and other parameters.<p> When you set up each atlas you must define the parameters of each hierarchical level, editing a tree whose root is each atlas, followed by tabs and themes.<p> For each Atlas and tab you can put an explanatory text that can be visualized when an Atlas or tab is initialized."
	} ],
    'criaAtlas' : [ {
		pt : "Criar um novo atlas",
		en : "Create a new atlas",
		es : "Crear un atlas nuevo"
	} ],
    'atlasExistente' : [ {
		pt : "Atlas existentes:",
		en : "Existing atlas",
		es : "Atlas existentes"
	} ],
    'msgNovoRegistro' : [ {
		pt : " adicionando um novo registro",
		en : " adding a new record",
		es : " agregando un registro nuevo"
	} ],
    'msgBuscaAtlas' : [ {
		pt : "buscando atlas...",
		en : "searching atlas",
		es : "buscando atlas"
	} ],
    'adicionaTema' : [ {
		pt : "Adicionar novo tema:",
		en : "Add new theme",
		es : "Agregar un tema nuevo"
	} ],
    'editeTema' : [ {
		pt : "Edite para definir o tema!!!",
		en : "Edit to define the theme!!!",
		es : "Editar para definir el tema!!!"
	} ],
    'adicionaPrancha' : [ {
		pt : "Adicionar nova prancha",
		en : "Add a new table",
		es : "Agregar una tabla nueva"
	} ],
    'editePrancha' : [ {
		pt : "Edite para definir a prancha!!!",
		en : "Edit to define the table",
		es : "Editar para definir la  tabla"
	} ],
    'editeAtlas' : [ {
		pt : "Edite para definir o Atlas!!!",
		en : "Edit to define the Atlas!!!",
		es : "Edite para definir el Atlas!!!"
	} ],
    'codigoTema' : [ {
		pt : "C&oacute;digo do tema:",
		en : "Code of theme :",
		es : "C&oacute;digo del tema:"
	} ],
    'temaVisivel' : [ {
		pt : "Ligado (ao abrir a prancha, esse tema estar&aacute; vis&iacute;vel)?",
		en : "Connected (when opening the table, that theme will be visible)?",
		es : "&iquest;Conectado (al abrir la table, ese tema estar&aacute; visible)?"
	} ],
    'titulo' : [ {
		pt : "T&iacute;tulo:",
		en : "Title:",
		es : "T&iacute;tulo:"
	} ],
    'descricao' : [ {
		pt : "(opcional) Descri&ccedil;&atilde;o:",
		en : "(optional) Description:",
		es : "(opcional) Descripci&oacute;n:"
	} ],
    'linkTxt' : [ {
		pt : "(opcional) Link para o texto que ser&aacute; mostrado na inicializa&ccedil;&atilde;o:",
		en : "(optional) Link to text to be displayed at startup:",
		es : "(opcional) Enlace al texto que se mostrar&aacute; en el inicio:"
	} ],
    'largura' : [ {
		pt : "Largura da janela do texto inicial:",
		en : "Width of the initial text window:",
		es : "Ancho de la ventana del texto inicial:"
	} ],
    'altura' : [ {
		pt : "Altura",
		en : "Height",
		es : "Altura"
	} ],
    'icone' : [ {
		pt : "(opcional) &Iacute;cone que ser&aacute; utilizado na apresenta&ccedil;&atilde;o da prancha:",
		en : "(optional) Icon to be used in table presentation:",
		es : "(opcional) Icono que ser&aacute; utilizado en la presentaci&oacute;n de la tabla:"
	} ],
    'extGeo' : [ {
		pt : "Extens&atilde;o geogr&aacute;fica (xmin ymin xmax ymax):",
		en : "Map extent (xmin ymin xmax ymax):",
		es : "Extensi&oacute;n geogr&aacute;fica (xmin ymin xmax ymax):"
	} ],
    'mapfileInicia' : [ {
		pt : "(opcional) Mapfile inicial (mapfile que ser&aacute; usado como base para montagem do mapa inicial. Se n&atilde;o for definido, ser&aacute; usado o default do i3geo. Utilize o endere&ccedil;o completo do aquivo mapfile no servidor.):",
		en : "(optional) Initial mapfile (mapfile that will be used as base for initial map building. If it is not defined, the default i3Geo mapfile will be used. On the server use a mapfile full path):",
		es : "(opcional) Mapfile inicial (mapfile que ser&aacute; utilizado como base para el montaje del mapa inicial. Si no es definido, ser&aacute; utilizado &eacute;l predeterminado de i3Geo. Utilice la direcci&oacute;n completa del archivo mapfile en el servidor):"
	} ],
    'linkAtlas' : [ {
		pt : "(opcional) Link para o texto que ser&aacute; mostrado na inicializa&ccedil;&atilde;o do Atlas:",
		en : "(optional) Link to the text that will be shown at the Atlas beginning:",
		es : "(opcional) Link para el texto que ser&aacute; mostrado en el inicio del Atlas:"
	} ],
    'iconeAtlas' : [ {
		pt : "(opcional) &Iacute;cone que ser&aacute; utilizado na montagem da lista de todos os Atlas:",
		en : "(optional) Icon that will be used to build a list of every Atlas:",
		es : "(opcional) Icono que ser&aacute; utilizado en la creaci&oacute;n de la lista de todos los Atlas:"
	} ],
    'template' : [ {
		pt : "(opcional) Template HTML (se n&atilde;o for especificado, ser&aacute; usado o default do i3geo. Utilize o caminho completo do arquivo html no servidor):",
		en : "(optional) HTML template (if not specified, it will be used the i3Geo default. Use full path of HTML file on the server):",
		es : "(opcional) Plantilla HTML (si no es especificada, ser&aacute; utilizada la predeterminada de i3Geo. Utilice la ruta completa del archivo HTML en el servidor):"
	} ],
    'pranchaInicia' : [ {
		pt : "Prancha inicial (ser&aacute; mostrada quando iniciar o atlas):",
		en : "Startup table (it will be shown when atlas starts):",
		es : "Tabla inicial (Ser&aacute; mostrada cuando se inicie el atlas):"
	} ],
    'tipoGuia' : [ {
		pt : "Tipo da apresenta&ccedil;&atilde;o das guias:",
		en : "Types of guide presentation:",
		es : "Tipo de presentaci&oacute;n de las gu&iacute;as:"
	} ],
    'automatica' : [ {
		pt : "autom&aacute;tica",
		en : "automatic",
		es : "autom&aacute;tica"
	} ],
    'combo' : [ {
		pt : "combo",
		en : "combo",
		es : "combo"
	} ],
    'expandida' : [ {
		pt : "expandida",
		en : "expanded",
		es : "expandida"
	} ],
    'publicado' : [ {
		pt : "Publicado (os n&atilde;o publicados s&atilde;o mostrados apenas para os usu&aacute;rios administradores)?",
		en : "",
		es : ""
	} ],
    'msgNaoExclui' : [ {
		pt : "N&atilde;o foi poss&iacute;vel excluir. Verifique se n&atilde;o existem menus vinculados a este tema",
		en : "",
		es : ""
	} ],
    '' : [ {
		pt : "",
		en : "",
		es : ""
	} ],
    '' : [ {
		pt : "",
		en : "",
		es : ""
	} ],
    '' : [ {
		pt : "",
		en : "",
		es : ""
	} ],
    '' : [ {
		pt : "",
		en : "",
		es : ""
	} ],
    '' : [ {
		pt : "",
		en : "",
		es : ""
	} ],
    '' : [ {
		pt : "",
		en : "",
		es : ""
	} ],
    '' : [ {
		pt : "",
		en : "",
		es : ""
	} ],
    '' : [ {
		pt : "",
		en : "",
		es : ""
	} ]
};
