//+$trad(1,i3GEOadmin.editormapfile.dicionario)+
i3GEOadmin.editormapfile = {};
i3GEOadmin.editormapfile.dicionario = {
	'adminMapfile' : [ {
		pt : "Administra&ccedil;&atilde;o do i3geo - mapfiles dos temas",
		en : "",
		es : ""
	} ],
    'txtAjudaMapfile' : [ {
		pt : "<p>Importante: a restri&ccedil;&atilde;o ao tema por meio da defini&ccedil;&atilde;o de grupos de usu&aacute;rios n&atilde;o bloqueia o acesso por meio de download, WMS, KML, etc. Para bloquear esse tipo de acesso &eacute; necess&aacute;rio alterar as op&ccedil;&otilde;es espec&iacute;ficas. Por padr&atilde;o, esses servi&ccedil;os s&atilde;o habilitados para qualquer usu&aacute;rio, n&atilde;o sendo poss&iacute;vel bloquear apenas para determinados grupos. <p>Este formul&aacute;rio permite criar ou editar os arquivos mapfile que comp&otilde;em temas no i3geo. <p>Os arquivo .map s&atilde;o armazenados no diret�rio i3geo/temas e podem tamb&eacute;m ser editados manualmente. <p>Cada arquivo cont&eacute;m layers definidos conforme a sintaxe utilizada pelo Mapserver. Esses arquivos s&atilde;o as estruturas b&aacute;sicas utilizadas pelo i3geo na apresenta&ccedil;&atilde;o de dados e montagem das camadas que s&atilde;o vistas no mapa. <p>Ap�s criados os mapfiles, deve-se ainda definir as caracter&iacute;sticas de cada LAYER. <p>A lista de IPs dos usu&aacute;rios que podem administrar o i3geo &eacute; definida no arquivo i3geo/ms_configura.php <p>Apenas os mapfiles que forem vinculados a um tema poder&atilde;o ser vistos na janela de inclus&atilde;o de temas na &aacute;rvore de temas. Se voc&ecirc; criou um mapfile manualmente, utilize a op&ccedil;&atilde;o de edi&ccedil;&atilde;o (&iacute;cone apresentado ao lado de cada mapfile) para fazer essa associa&ccedil;&atilde;o. <p>A op&ccedil;&atilde;o 'Verifica temas sem mapfiles' possibilita resolver problemas decorrentes da elimina&ccedil;&atilde;o manual de um arquivo mapfile do servidor. Nesses casos, o registro no banco de dados permanece. Com essa op&ccedil;&atilde;o &eacute; poss&iacute;vel apagar os registros ou recriar o mapfile perdido.",
		en : "",
		es : ""
	} ],
    'ajuda' : [ {
		pt : "Ajuda",
		en : "",
		es : ""
	} ],
    'criaMapfile' : [ {
		pt : "Criar um novo mapfile",
		en : "",
		es : ""
	} ],
    'upGvsig' : [ {
		pt : "Upload gvSIG",
		en : "",
		es : ""
	} ],
    'semMapfile' : [ {
		pt : "Verificar temas sem mapfiles",
		en : "",
		es : ""
	} ],
    'txtDesc' : [ {
		pt : "<p class=paragrafo>Al&eacute;m de criar os mapfiles, &eacute; necess&aacute;rio definir as caracter&iacute;sticas de cada LAYER nas op&ccedil;&otilde;es abaixo. <br> Para incluir o tema nos menus,<a href='arvore.html'>edite a &aacute;rvore de temas </a></p><p class=paragrafo>O texto marcado em cinza corresponde ao nome do tema registrados na &aacute;rvore de temas (registro no banco de dados). Nem todos os temas s&atilde;o utilizados na &aacute;rvore, por isso n&atilde;o necessitam ser associados a um 'tema' e registrados no banco de dados.</p>",
		en : "",
		es : ""
	} ],
    'listaMapfile' : [ {
		pt : "<p>Mapfiles (arquivos existentes no diret&oacute;rio i3geo/temas):</p>",
		en : "",
		es : ""
	} ],
    'gvp' : [ {
		pt : "Arquivo gvp: ",
		en : "",
		es : ""
	} ],
    'nomeMap' : [ {
		pt : "Nome do novo arquivo mapfile (sem .map) </b>N&atilde;o utilize caracteres acentuados ou espa&ccedil;os em branco",
		en : "",
		es : ""
	} ],
    'permiteOgc' : [ {
		pt : "Permitir o acesso aos dados via download e Web Services (WMS, WFS, etc.)",
		en : "",
		es : ""
	} ],
    'metaestat' : [ {
		pt : "Esse mapfile baseia-se no sistema de metadados estat&iacute;sticos?</b> Caso escolha sim, a conex&atilde;o com o banco e o sql de acesso aos dados ser&atilde;o constru&iacute;dos de forma din&acirc;mica",
		en : "",
		es : ""
	} ],
    'tituloTema' : [ {
		pt : "T&iacute;tulo do novo tema",
		en : "",
		es : ""
	} ],
    'tituloPt' : [ {
		pt : "Em portugu&ecirc;s: ",
		en : "",
		es : ""
	} ],
    'tituloEs' : [ {
		pt : "Espanhol (opcional): ",
		en : "",
		es : ""
	} ],
    'tituloEn' : [ {
		pt : "Ingl&ecirc;s: (opcional)",
		en : "",
		es : ""
	} ],
    'filtraLista' : [ {
		pt : "filtrar lista",
		en : "",
		es : ""
	} ],
    'retiraFavoritos' : [ {
		pt : "retira dos favoritos",
		en : "",
		es : ""
	} ],
    'favorito' : [ {
		pt : "favorito",
		en : "",
		es : ""
	} ],
    'criaCopia' : [ {
		pt : "cria uma copia",
		en : "",
		es : ""
	} ],
    'limpaCache' : [ {
		pt : "limpa o cache de imagens se houver",
		en : "",
		es : ""
	} ],
    'editaTema' : [ {
		pt : "editar tema associado",
		en : "",
		es : ""
	} ],
    'gruposUsuarios' : [ {
		pt : "Grupos de usu&aacute;rios que podem utilizar",
		en : "",
		es : ""
	} ],
    'semMap' : [ {
		pt : "Os temas listados a seguir n&atilde;o possuem mapfiles criados. Voc&ecirc; pode excluir o registro do tema (remo&ccedil;&atilde;o do banco de dados) clicando na op&ccedil;&atilde;o 'excluir' ou criar o mapfile na op&ccedil;&atilde;o existente no formul&aacute;rio principal.",
		en : "",
		es : ""
	} ],
    'digitaNome' : [ {
		pt : "Digite o nome do arquivo",
		en : "",
		es : ""
	} ],
    'msgLimpa' : [ {
		pt : " limpando ",
		en : "",
		es : ""
	} ],
    'excluiCache' : [ {
		pt : "Exclui o cache tempor&aacute;rio de renderiza&ccedil;&atilde;o?",
		en : "",
		es : ""
	} ],
    'extensao' : [ {
		pt : "Sao necessarios 4 valores em extensao",
		en : "",
		es : ""
	} ],
    'xmin' : [ {
		pt : "xmin maior que xmax em extensao",
		en : "",
		es : ""
	} ],
    'ymin' : [ {
		pt : "ymin maior que ymax em extensao",
		en : "",
		es : ""
	} ],
    'erroEscala' : [ {
		pt : "Valor de escala incorreto",
		en : "",
		es : ""
	} ],
    'senhaBd' : [ {
		pt : "Senha de acesso ao banco",
		en : "",
		es : ""
	} ],
    'valorSenha' : [ {
		pt : "Complete com o valor da senha de acesso em 'password', exemplo: password=postgres",
		en : "",
		es : ""
	} ],
    'apenasShp' : [ {
		pt : "Opcao disponivel apenas para o tipo shapefile", // esta sem acento pois alguns navegadores n�o aceitam acentuacao em alert
		en : "",
		es : ""
	} ],
    'editaCaractClasses' : [ {
		pt : "edita caracter&iacute;sticas da classe",
		en : "",
		es : ""
	} ],
    'editaIdentTxt' : [ {
		pt : "edita identificadores de texto",
		en : "",
		es : ""
	} ],
    'editaCaractGerais' : [ {
		pt : " Editar caracter&iacute;sticas gerais",
		en : "",
		es : ""
	} ],
    'editaToponimia' : [ {
		pt : " Editar topon&iacute;mia",
		en : "",
		es : ""
	} ],
    'estilos' : [ {
		pt : "Estilos",
		en : "",
		es : ""
	} ],
    'msgNovaClasse' : [ {
		pt : " adicionando uma nova classe",
		en : "",
		es : ""
	} ],
    'msgGeraClasse' : [ {
		pt : " gerando as classes",
		en : "",
		es : ""
	} ],
    'criaClasses' : [ {
		pt : "Criar classes",
		en : "",
		es : ""
	} ],
    'itemExpressao' : [ {
		pt : "Item da tabela de atributos que ser&aacute; utilizado para compor a express&atilde;o de sele&ccedil;&atilde;o de cada classe",
		en : "",
		es : ""
	} ],
    'itemNome' : [ {
		pt : "Item da tabela de atributos que ser&aacute; utilizado para compor o nome de cada classe",
		en : "",
		es : ""
	} ],
    'excluiClasse' : [ {
		pt : "Exclui a classe?",
		en : "",
		es : ""
	} ],
    'nomeClasse' : [ {
		pt : "Nome da classe para ser mostrada na legenda",
		en : "",
		es : ""
	} ],
    'descricaoClasse' : [ {
		pt : "Descri&ccedil;&atilde;o da classe (mostrada na legenda quando o mouse &eacute; sobreposto",
		en : "",
		es : ""
	} ],
    'exibeClasse' : [ {
		pt : "Define o estado atual de exibi&ccedil;&atilde;o da classe. Default ativa a camada permanentemente.",
		en : "",
		es : ""
	} ],
    'expressaoClasse' : [ {
		pt : "Quatro tipos de express&otilde;es s&atilde;o suportadas para definir as classes. Compara&ccedil;&atilde;o de strings, express&otilde;es regulares, express&otilde;es l&oacute;gicas simples e fun&ccedil;&otilde;es de string. Se nenhuma express&atilde;o &eacute; fornecida, ent&atilde;o todas as fei&ccedil;&otilde;es pertencem &agrave; classe em quest&atilde;o. Compara&ccedil;&atilde;o de strings s&atilde;o sens&iacute;veis a caracteres e s&atilde;o as mais r&aacute;pidas e se processar. N&atilde;o s&atilde;o necess&aacute;rios delimitadores especiais, mas &eacute; preciso citar entre aspas strings que contenham caracteres especiais. Como boas pr&aacute;ticas, &eacute; recomendado citar todas as strings. Express&otilde;es regulares s&atilde;o delimitadas utilizando barras (/regex/). N&atilde;o devem ser usadas aspas. O atributo a ser usado como compara&ccedil;&atilde;o &eacute; definido no par&acirc;metro CLASSITEM do n&iacute;vel do LAYER. Express&otilde;es l&oacute;gicas te permitem construir testes bastante complexos em um ou mais atributos e portanto s&oacute; s&atilde;o permitas com shapefiles. Express&otilde;es l&oacute;gicas s&atilde;o delimitadas com par&ecirc;nteses &#8220;(express&atilde;o)&#8221;. Nomes de atributos s&atilde;o delimitados por colchetes &#8220;[ATRIBUTO]&#8221;. Estes nomes s&atilde;o sens&iacute;veis a caracteres e devem concordar com os itens no shapefile. Por exemplo: EXPRESSION ([POPULATION] &gt; 50000 AND  [LANGUAGE]  eq  FRENCH ). Os seguintes operadores l&oacute;gicos s&atilde;o suportados: =, &gt;, &lt;, &lt;=, &gt;=, =, or, and, lt, gt, ge, le, eq, ne, in, ~, ~*. Este n&iacute;vel de complexidade &eacute; mais lento a se processar. Existe uma fun&ccedil;&atilde;o de string: lenght(). Ela computa o comprimento de uma string. Exemplo: EXPRESSION (length( [NAME_E] ) &lt; 8). Compara&ccedil;&atilde;o de strings e express&otilde;es regulares trabalham a partir do CLASSITEM definido no n&iacute;vel da LAYER. Voc&ecirc; pode combinar diferentes tipos de express&otilde;es juntamente com diferentes classes de uma camada. ",
		en : "",
		es : ""
	} ],
    'arquivoLegenda' : [ {
		pt : "Nome completo do arquivo de imagem da legenda para a CLASS. Esta imagem &eacute; usada ao construir uma legenda (ou quando requisitando um &iacute;cone de legenda via MapScript ou uma aplica&ccedil;&atilde;o CGI).",
		en : "",
		es : ""
	} ],
    'escalaMax' : [ {
		pt : "Escala m&aacute;xima na qual a CLASS &eacute; desenhada. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
		en : "",
		es : ""
	} ],
    'escalaMin' : [ {
		pt : "Escala m&iacute;nima na qual a CLASS &eacute; desenhada. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
		en : "",
		es : ""
	} ],
    'atributos' : [ {
		pt : "O layer possu&iacute; as seguintes colunas na tabela de atributos: ",
		en : "",
		es : ""
	} ],
    'status' : [ {
		pt : "Define o estado atual da camada. Geralmente modificado pelo pr&oacute;prio MapServer. Default ativa a camada permanentemente.",
		en : "",
		es : ""
	} ],
    'identifica' : [ {
		pt : "Indica se o tema ir&aacute; ser mostrado na ferramenta de identifica&ccedil;&atilde;o",
		en : "",
		es : ""
	} ],
    'identificaTitulo' : [ {
		pt : "Identifica (IDENTIFICA)",
		en : "",
		es : ""
	} ],
    'opacidade' : [ {
		pt : "Define o n&iacute;vel de opacidade (ou a inabilidade de ver atrav&eacute;s da camada) de todos os pixeis classificados para uma dada camada. O valor pode ser um n&uacute;mero inteiro entre 0 e 100 ou o s&iacute;mbolo nomeado  ALPHA . Um valor de 100 &eacute; opaco e 0 &eacute; completamente transparente. O s&iacute;mbolo  ALPHA  direciona o MapServer para honrar a transpar&ecirc;ncia dos s&iacute;mbolos utilizados como pixmap no estilo de uma camada. Isso s&oacute; &eacute; necess&aacute;rio no caso de formatos de sa&iacute;da RGB, e deve ser usado somente quando necess&aacute;rio pois &eacute; dispendioso renderizar s&iacute;mbolos transparentes como pixmap em um mapa de imagem RGB.",
		en : "",
		es : ""
	} ],
    'aplicaExtensao' : [ {
		pt : "Indica se a extens&atilde;o geogr&aacute;fica do mapa deve ser alterada quando o tema for adicionado ao mapa",
		en : "",
		es : ""
	} ],
    'aplicaExtensaoTitulo' : [ {
		pt : "Aplica extensao (APLICAEXTENSAO)",
		en : "",
		es : ""
	} ],
    'comentario' : [ {
		pt : "Indica se o usu&aacute;rio pode incluir coment&aacute;rios no tema",
		en : "",
		es : ""
	} ],
    'comentarioTitulo' : [ {
		pt : "Permite comentar (PERMITECOMENTARIO)",
		en : "",
		es : ""
	} ],
    'temporizador' : [ {
		pt : "Temporizador (em segundos) para atualiza&ccedil;&atilde;o autom&aacute;tica da camada. A camada ser&aacute; redesenhada continuamente a cada intervalo de tempo definido",
		en : "",
		es : ""
	} ],
    'temporizadorTitulo' : [ {
		pt : "Temporizador em segundos (METADATA: TEMPORIZADOR)",
		en : "",
		es : ""
	} ],
    'classe' : [ {
		pt : "Indica se as classes ser&atilde;o mostradas ou n&atilde;o na legenda. Por padr&atilde;o &eacute; SIM. ",
		en : "",
		es : ""
	} ],
    'classeTitulo' : [ {
		pt : "Classe (CLASSE)",
		en : "",
		es : ""
	} ],
    'legendaImg' : [ {
		pt : "URL de uma imagem que ser&aacute; utilizada em substitui&ccedil;&atilde;o � gera&ccedil;&atilde;o normal da legenda ",
		en : "",
		es : ""
	} ],
    'legendaImgTitulo' : [ {
		pt : "URL da legenda (opcional) (LEGENDAIMG)",
		en : "",
		es : ""
	} ],
    'escondido' : [ {
		pt : "Indica se o tema &eacute; mostrado no mapa mas n&atilde;o nas listas da legenda e na guia 'temas'",
		en : "",
		es : ""
	} ],
    'escondidoTitulo' : [ {
		pt : "Escondido (ESCONDIDO)",
		en : "",
		es : ""
	} ],
    'transition' : [ {
		pt : "Aplica efeitos de transi&ccedil;&atilde;o nas opera&ccedil;&otilde;es de zoom e pan na interface Openlayers",
		en : "",
		es : ""
	} ],
    'transitionTitulo' : [ {
		pt : "Efeitos de transi&ccedil;&atilde;o zoom (TRANSITIONEFFECT)",
		en : "",
		es : ""
	} ],
    'offsite' : [ {
		pt : "Define o padr&atilde;o de cores RGB para tratar como transparente em camadas raster.",
		en : "",
		es : ""
	} ],
    'offsiteTitulo' : [ {
		pt : "Offsite (R,G,B) (utilize -1,-1,-1 para anular o valor)",
		en : "",
		es : ""
	} ],
    'maxscale' : [ {
		pt : "Escala m&aacute;xima na qual o LAYER &eacute; desenhado. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
		en : "",
		es : ""
	} ],
    'maxscaleTitulo' : [ {
		pt : "Maxscale (utilize -1 para anular o valor)",
		en : "",
		es : ""
	} ],
    'minscale' : [ {
		pt : "Escala m&iacute;nima na qual o LAYER &eacute; desenhado. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
		en : "",
		es : ""
	} ],
    'minscaleTitulo' : [ {
		pt : "Minscale (utilize -1 para anular o valor)",
		en : "",
		es : ""
	} ],
    'labelitem' : [ {
		pt : "Nome do item na tabela de atributos para utilizar como etiqueta (label).",
		en : "",
		es : ""
	} ],
    'labelMaxscale' : [ {
		pt : "Escala m&aacute;xima na qual a LABEL &eacute; desenhada. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
		en : "",
		es : ""
	} ],
    'labelMaxscaleTitulo' : [ {
		pt : "Labelmaxscale (utilize -1 para anular o valor)",
		en : "",
		es : ""
	} ],
    'labelMinscale' : [ {
		pt : "Escala m&iacute;nima na qual a LABEL &eacute; desenhada. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
		en : "",
		es : ""
	} ],
    'labelMinscaleTitulo' : [ {
		pt : "Labelminscale (utilize -1 para anular o valor)",
		en : "",
		es : ""
	} ],
    'symbolscale' : [ {
		pt : "A escala na qual s&iacute;mbolos e/ou textos aparecem em tamanho total. Isso permite alterar dinamicamente a escala de objetos de acordo com a escala do mapa. Se n&atilde;o for definido, ent&atilde;o o objeto sempre aparecer&aacute; no mesmo tamanho. Essa opera&ccedil;&atilde;o s&oacute; ocorre dentro dos limites de MINSIZE e MAXSIZE como descrito acima. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
		en : "",
		es : ""
	} ],
    'symbolscaleTitulo' : [ {
		pt : "Symbolscale (utilize -1 para anular o valor)",
		en : "",
		es : ""
	} ],
    'tolerance' : [ {
		pt : "Sensibilidade para consultas baseadas em pontos (por exemplo, via mouse e/ou coordenadas do mapa). Dada em TOLERANCEUNITS. Se a camada for um ponto ou uma linha, o padr&atilde;o &eacute; 3. Para todos os outros tipos de camada, o padr&atilde;o &eacute; 0. Para restringir pesquisas por pol&iacute;gonos para que o ponto ocorra dentro do pol&iacute;gono defina a toler&acirc;ncia como 0.",
		en : "",
		es : ""
	} ],
    'sizeunits' : [ {
		pt : "Define as unidades de valores do par&acirc;metro SIZE do objeto CLASS (padr&atilde;o &eacute; pixeis). &Uacute;til para simular um buffer.",
		en : "",
		es : ""
	} ],
    'type' : [ {
		pt : "Especifica como o dado deve ser desenhado. N&atilde;o precisa ser do mesmo tipo do shapefile. Por exemplo, um shapefile de pol&iacute;gonos pode ser desenhado como pontos, mas um shape de pontos n&atilde;o pode ser desenhado como um pol&iacute;gono. Para diferenciar entre POLYGON e POLYLINE, simplesmente use ou omita o par&acirc;metro COLOR na classifica&ccedil;&atilde;o. Se voc&ecirc; utiliz&aacute;-lo, &eacute; um pol&iacute;gono com uma cor de preenchimento, sen&atilde;o, &eacute; uma polilinha cuja cor &eacute; definida em OUTLINECOLOR. Um c&iacute;rculo (circle) deve ser definido por um ret&acirc;ngulo de limites m&iacute;nimos. Isto &eacute;, dois pontos que definem o menor quadrado que pode cont&ecirc;-lo.",
		en : "",
		es : ""
	} ],
    'typeTitulo' : [ {
		pt : "Type - tipo das geometrias",
		en : "",
		es : ""
	} ],
    'connectiontype' : [ {
		pt : "Tipo de conex&atilde;o. com os dados",
		en : "",
		es : ""
	} ],
    'connectiontypeTitulo' : [ {
		pt : "Connectiontype - tipo de conex&atilde;o com a fonte de dados",
		en : "",
		es : ""
	} ],
    'connection' : [ {
		pt : "Voc&ecirc; pode digitar apenas o 'alias' para esconder a string de conex&atilde;o. Database connection string to retrieve remote data.An SDE connection string consists of a hostname, instance name, database name, username and password separated by commas.A PostGIS connection string is basically a regular PostgreSQL connection string, it takes the form of 'user=nobody password=****** dbname=dbname host=localhost port=5432' An Oracle connection string: user/pass[@db] . Se vc tiver problemas com acentua&ccedil;&atilde;o, experimente algo como: user=postgres password=postgres dbname=pgutf8 host=localhost port=5432 options='-c client_encoding=LATIN1'",
		en : "",
		es : ""
	} ],
    'connectionTitulo' : [ {
		pt : "Connection - par&acirc;metros de conex&atilde;o com a fonte de dados",
		en : "",
		es : ""
	} ],
    'data' : [ {
		pt : "Nome completo do arquivo de dado espacial a ser processado. N&atilde;o &eacute; necess&aacute;ria a extens&atilde;o do arquivo para shapefiles. Exemplo: c://ms4w/Apache/htdocs/geodados/brasil/limitespol/localidades.shp. Pode ser especificado relativo &agrave; op&ccedil;&atilde;o SHAPEPATH do objeto MAP. Se for uma camada SDE, deve ser inclu&iacute;do o nome da camada bem como da coluna de geometria, por exemplo, mylayer,shape,myversion. Se &eacute; uma camada PostGIS, o par&acirc;metro deve seguir a forma <columnname> from <tablename>, na qual columnname &eacute; o nome da coluna que cont&eacute;m a geometria e tablename &eacute; o nome da tabela cuja geometria ser&aacute; lida. Exemplo: the_geom FROM (select * FROM biomas) as foo USING UNIQUE gid USING SRID=4291. Para Oracle, use shape FROM table ou shape FROM (SELECT statement) ou at&eacute; express&otilde;es mais complexas. Note que, no entanto, h&aacute; impactos importantes de performance quando utilizadas subconsultas espaciais. Tente utilizar o objeto FILTER sempre que poss&iacute;vel. Voc&ecirc; tamb&eacute;m pode ver o SQL submetido ao for&ccedil;ar um erro, submetendo um par&acirc;metro DATA que voc&ecirc; sabe que n&atilde;o funcionar&aacute;, como uma nome de coluna errado.",
		en : "",
		es : ""
	} ],
    'dataTitulo' : [ {
		pt : "Data - SQL ou caminho do arquivo com os dados",
		en : "",
		es : ""
	} ],
    'cache' : [ {
		pt : "Ativa ou n&atilde;o a manuten&ccedil;&atilde;o de um cache para armazenar as imagens geradas para montar o mapa. O cache &eacute; mantido no diret&oacute;rio tempor&aacute;rio utilizado pelo i3Geo, na pasta chamada cache. Para cada camada &eacute; criada uma sub-pasta. Para limpar o cache, utilize a op&ccedil;&atilde;o existente junto ao n&oacute; principal desse mapfile. Camadas WMS s&atilde;o acessadas diretamente do servidor de origem quando o cache estiver inativo.",
		en : "",
		es : ""
	} ],
    'cacheTitulo' : [ {
		pt : "Cache de mapas (CACHE)",
		en : "",
		es : ""
	} ],
    'cortepixels' : [ {
		pt : "Ao desenhar a imagem de um TILE que comp&otilde;e o mapa, a imagem &eacute; extendida e depois cortada para o tamanho correto. Isso evita que s&iacute;mbolos apare&ccedil;am de forma parcial no mapa. Indicado para temas com representa&ccedil;&atilde;o pontual e que tamb&eacute;m utilizem cache, pois pode degradar a performance.",
		en : "",
		es : ""
	} ],
    'cortepixelsTitulo' : [ {
		pt : "Extende e corta imagem em pixels (cortepixels)",
		en : "",
		es : ""
	} ],
    'metaestat' : [ {
		pt : "Indica se as defini&ccedil;&otilde;es da camada est&atilde;o relacionadas ao sistema de metadados estat&iacute;sticos. Se estiver, alguns par&acirc;metros s&atilde;o obtidos de forma autom&aacute;tica, como a conex&atilde;o e o SQL de acesso aos dados.",
		en : "",
		es : ""
	} ],
    'metaestatTitulo' : [ {
		pt : "Esse mapfile est&aacute; integrado ao sistema de metadados estat&iacute;sticos?",
		en : "",
		es : ""
	} ],
    'medidaVariavel' : [ {
		pt : "ID da medida da vari&aacute;vel que relaciona a camada ao sistema de metadados estat&iacute;sticos. S&oacute; deve ser definido se o mapfile for integrado a esse sistema.",
		en : "",
		es : ""
	} ],
    'medidaVariavelTitulo' : [ {
		pt : "ID da vari&aacute;vel no sistema de metadados estat&iacute;sticos ",
		en : "",
		es : ""
	} ],
    'convCaracter' : [ {
		pt : "Aplica a convers&atilde;o de caracteres nas ferramentas que obt&eacute;m os dados descritivos referentes aos elementos do LAYER. Em alguns casos, a convers&atilde;o pode provocar problemas de acentua&ccedil;&atilde;o. Se isso ocorrer, na ferramenta tabela por exemplo, experimente marcar essa op&ccedil;&atilde;o como 'nao'",
		en : "",
		es : ""
	} ],
    'convCaracterTitulo' : [ {
		pt : "Convers&atilde;o de caracteres (METADATA: CONVCARACTER)",
		en : "",
		es : ""
	} ],
    'projecao' : [ {
		pt : "Proje&ccedil;&atilde;o",
		en : "",
		es : ""
	} ],
    'filter' : [ {
		pt : "Este par&acirc;metro permite filtrar atributos espec&iacute;ficos ao mesmo tempo em que &eacute; feita uma filtragem espacial, mas antes de que qualquer express&atilde;o em CLASS seja contabilizada. Para OGR e shapefiles, a string &eacute; simplesmente uma express&atilde;o regular do MapServer. Por exemplo: FILTER type= road  and size &lt;2. Para bancos de dados espaciais &eacute; uma cl&aacute;usula SQL WHERE que &eacute; v&aacute;lida de acordo com o banco de dados subjacente. ",
		en : "",
		es : ""
	} ],
    'filterItem' : [ {
		pt : "Item a ser usado com simples express&otilde;es FILTER. Somente para OGR e shapefile.",
		en : "",
		es : ""
	} ],
    'tileItem' : [ {
		pt : "Item que cont&eacute;m a localiza&ccedil;&atilde;o individual de um tile. Padr&atilde;o &eacute;  location .",
		en : "",
		es : ""
	} ],
    'tileIndex' : [ {
		pt : "Nome do arquivo ou camada de tileindex. Um tileindex &eacute; semelhante a uma biblioteca de &iacute;ndices do ArcInfo. O tileindex cont&eacute;m fei&ccedil;&otilde;es de pol&iacute;gono para cada tile (ladrilho). O item que cont&eacute;m a localiza&ccedil;&atilde;o do dado ladrilhado &eacute; obtido utilizando o par&acirc;metro TILEITEM. Quando um arquivo &eacute; utilizado como o tileindex para camadas shapefiles ou raster, o tileindex pode ser um shapefile. Para camadas com CONNECTIONTYPE OGR, qualquer fonte de dados OGR suportada pode ser um tileindex. Normalmente a localiza&ccedil;&atilde;o deve conter o caminho do arquivo de tile relativo ao caminho do shape, e n&atilde;o relativo ao pr&oacute;prio tileindex. Se o par&acirc;metro DATA cont&eacute;m algum valor ent&atilde;o ele &eacute; adicionado ao fim da localiza&ccedil;&atilde;o. Quando uma camada de tileindex &eacute; utilizada, ela funciona de forma similar a referir-se diretamente a um arquivo, sendo que qualquer fonte de fei&ccedil;&atilde;o suportada pode ser usada (como PostgreSQL, Oracle etc.).",
		en : "",
		es : ""
	} ],
    'tipoOriginal' : [ {
		pt : "Tipo de representa&ccedil;&atilde;o das fei&ccedil;&otilde;es mostradas da camada. &Eacute; importante definir esse par&acirc;metro para que as fun&ccedil;&otilde;es de gera&ccedil;&atilde;o de SLD funcionem corretamente.",
		en : "",
		es : ""
	} ],
    'tipoOriginalTitulo' : [ {
		pt : "Tipo de representa&ccedil;&atilde;o (tipooriginal) - para temas do tipo WMS",
		en : "",
		es : ""
	} ],
    'tiles' : [ {
		pt : "A camada ser&aacute; desenhada em tiles (ladrilhos) de 256x256 pixels. O default &eacute; vazio, nesse caso a camada obedecer&aacute; a l&oacute;gica default de decis&atilde;o para definir se o modo tile ser&aacute; ou n&atilde;o aplicado (depender&aacute; do tipo de layer). Quando for 'nao', o modo tile n&atilde;o ser&aacute; aplicado. Quando 'sim' o modo tile &eacute; sempre aplicado. ",
		en : "",
		es : ""
	} ],
    'tilesTitulo' : [ {
		pt : "Utiliza o modo TILE (TILES)",
		en : "",
		es : ""
	} ],
    'atributosLayer' : [ {
		pt : "O layer possui as seguintes colunas na tabela de atributos: ",
		en : "",
		es : ""
	} ],
    'msgAlias' : [ {
		pt : "Prefira sempre usar um 'alias'. Os seguintes 'alias' podem ser utilizados aqui no lugar da string de conex&atilde;o completa: ",
		en : "",
		es : ""
	} ],
    'defineAlias' : [ {
		pt : "Para definir um novo, &eacute; necess&aacute;rio editar o arquivo i3geo/ms_configura.php, consulte o administrador do servidor",
		en : "",
		es : ""
	} ],
    'disponibilidade' : [ {
		pt : "Disponibilidade",
		en : "",
		es : ""
	} ],
    'conexao' : [ {
		pt : "Conex&atilde;o",
		en : "",
		es : ""
	} ],
    'permiteDownload' : [ {
		pt : "Indica se o usu&aacute;rio pode fazer download do tema. Se sim, o &iacute;cone de download ser&aacute; mostrado na &aacute;rvore de camadas dispon&iacute;veis no mapa.",
		en : "",
		es : ""
	} ],
    'permiteDownloadTitulo' : [ {
		pt : "Permite download (METADATA: DOWNLOAD)",
		en : "",
		es : ""
	} ],
    'endereco' : [ {
		pt : "Endere&ccedil;o de um arquivo pr&eacute;-existente para download dos dados (caminho completo no servidor). Se definido, o sistema ir&aacute; usar esse arquivo ao inv&eacute;s de gerar os dados, quando o usu&aacute;rio clicar nas op&ccedil;&otilde;es de download. Se n&atilde;o for definido, o arquivo de download &eacute; gerado diretamente do original, convertendo do banco ou copiando o arquivo definido em DATA.",
		en : "",
		es : ""
	} ],
    'enderecoTitulo' : [ {
		pt : "Arquivo download (ARQUIVODOWNLOAD)",
		en : "",
		es : ""
	} ],
    'arquivoKmz' : [ {
		pt : "Endere&ccedil;o de um arquivo KMZ ou KML pr&eacute;-existente para download dos dados (caminho completo no servidor). Se definido, o sistema ir&aacute; usar esse arquivo ao inv&eacute;s de gerar os dados, quando o usu&aacute;rio clicar nas op&ccedil;&otilde;es de visualiza&ccedil;&atilde;o de KML ou KMZ. Se n&atilde;o for definido, o arquivo &eacute; gerado diretamente do original.",
		en : "",
		es : ""
	} ],
    'arquivoKmzTitulo' : [ {
		pt : "Arquivo KML ou KMZ (ARQUIVOKMZ)",
		en : "",
		es : ""
	} ],
    'permiteOgc2' : [ {
		pt : "Permite acesso via WMS/WFS? (n&atilde;o ocasiona restri&ccedil;&atilde;o em temas do tipo gvSIG)",
		en : "",
		es : ""
	} ],
    'permiteDownload2' : [ {
		pt : "Permite o download na aplica&ccedil;&atilde;o datadownload.htm? (n&atilde;o afeta temas do tipo gvSIG) (n&atilde;o afeta a permiss&atilde;o de download definida no item 'disponibilidade' existente em cada layer)",
		en : "",
		es : ""
	} ],
    'permiteKml' : [ {
		pt : "Permite acesso via kml? (n&atilde;o restringe em temas do tipo gvSIG)",
		en : "",
		es : ""
	} ],
    'permiteKmz' : [ {
		pt : "Permite acesso via kmz (kml com dados vetoriais)? (n&atilde;o restringe em temas do tipo gvSIG)",
		en : "",
		es : ""
	} ],
    'edicao' : [ {
		pt : "Edi&ccedil;&atilde;o",
		en : "",
		es : ""
	} ],
    'editavel' : [ {
		pt : "Indica se o tema poder&aacute; ser utilizado nos editores vetoriais e de atributos",
		en : "",
		es : ""
	} ],
    'editavelTitulo' : [ {
		pt : "O tema pode ser editado? (METADATA: EDITAVEL)",
		en : "",
		es : ""
	} ],
    'esquemaBd' : [ {
		pt : "Esquema do banco de dados onde est&aacute; a tabela que poder&aacute; ser editada",
		en : "",
		es : ""
	} ],
    'esquemaBdTitulo' : [ {
		pt : "Esquema no banco de dados",
		en : "",
		es : ""
	} ],
    'tabelaBd' : [ {
		pt : "Tabela do banco que poder&aacute; ser editada",
		en : "",
		es : ""
	} ],
    'tabelaBdTitulo' : [ {
		pt : "Tabela no banco de dados",
		en : "",
		es : ""
	} ],
    'colunaBd' : [ {
		pt : "Coluna que identifica de forma &uacute;nica cada registro da tabela",
		en : "",
		es : ""
	} ],
    'colunaBdTitulo' : [ {
		pt : "Coluna com IDs &uacute;nicos",
		en : "",
		es : ""
	} ],
    'bdGeom' : [ {
		pt : "Coluna que contem as geometrias da tabela",
		en : "",
		es : ""
	} ],
    'bdGeomTitulo' : [ {
		pt : "Coluna com geometria edit&aacute;vel",
		en : "",
		es : ""
	} ],
    'obsPostgis' : [ {
		pt : "Obs.: Apenas temas baseados em Postgis podem ser editados",
		en : "",
		es : ""
	} ],
    'excluiEstilo' : [ {
		pt : "Exclui o estilo?",
		en : "",
		es : ""
	} ],
    'symbolname' : [ {
		pt : "O s&iacute;mbolo a ser usado para representar as fei&ccedil;&otilde;es. Integer &eacute; o &iacute;ndice do s&iacute;mbolo no symbolset, come&ccedil;ando em 1 (o quinto s&iacute;mbolo &eacute; o s&iacute;mbolo 5). String &eacute; o nome do s&iacute;mbolo (como definido usando o par&acirc;metro SYMBOL NAME). Filename especifica o caminho para um arquivo contendo um s&iacute;mbolo. Por exemplo, um arquivo PNG. Especifique o caminho relativo ao diret&oacute;rio contendo o mapfile. URL especifica o endere&ccedil;o de um arquivo contendo um s&iacute;mbolo pixmap. Por exemplo, um arquivo PNG. Uma URL deve come&ccedil;ar com &#8220;http&#8221;. Exemplo: SYMBOL &#8220;http://myserver.org/path/to/file.png . [ATRIBUTO] permite representa&ccedil;&atilde;o individual de fei&ccedil;&otilde;es usando um atributo no conjunto de dados que especifica o nome do s&iacute;mbolo (como definido usando o par&acirc;metro SYMBOL NAME). S&atilde;o necess&aacute;rios os colchetes []. Se SYMBOL n&atilde;o for especificado, o comportamento depende do tipo de fei&ccedil;&atilde;o: Para pontos, nada ser&aacute; representado; Para linhas, SYMBOL s&oacute; &eacute; relevante se voc&ecirc; quer estilizar as linhas utilizando s&iacute;mbolos, ent&atilde;o a aus&ecirc;ncia de SYMBOL significa que voc&ecirc; ter&aacute; as linhas como especificadas utilizando os par&acirc;metros de representa&ccedil;&atilde;o de linhas (COLOR, WIDTH, PATTERN, LINECAP, etc.); Para pol&iacute;gonos, o interior dos pol&iacute;gonos ser&aacute; representado utilizando um preenchimento s&oacute;lido da cor especificada no par&acirc;metro COLOR.",
		en : "",
		es : ""
	} ],
    'symbolnameTitulo' : [ {
		pt : "Symbolname (pode ser utilizado uma imagem, exemplo: /var/www/i3geo/imagensteste.png) :",
		en : "",
		es : ""
	} ],
    'color' : [ {
		pt : "Cor a ser utilizada para desenhar fei&ccedil;&otilde;es.",
		en : "",
		es : ""
	} ],
    'colorTitulo' : [ {
		pt : "Color",
		en : "",
		es : ""
	} ],
    'backgroundcolor' : [ {
		pt : "Cor de fundo a ser utilizada para desenhar fei&ccedil;&otilde;es.",
		en : "",
		es : ""
	} ],
    'backgroundcolorTitulo' : [ {
		pt : "Backgroundcolor",
		en : "",
		es : ""
	} ],
    'size' : [ {
		pt : "Tamanho, em SIZEUNITS, do SYMBOL/PATTERN a ser usado. O valor padr&atilde;o depende do tipo do s&iacute;mbolo: para pixmap, o tamanho (em pixeis) do pixmap; para ellipse e vector, o valor m&aacute;ximo de y do par&acirc;metro SYMBOL POINTS; para hatch, 1,0; para truetype, 1,0. Quando a escala de s&iacute;mbolos &eacute; utilizada (SYMBOLSCALEDENOM &eacute; utilizado no n&iacute;vel da LAYER) o SIZE define o tamanho - de acordo com o SIZEUNITS da camada - do SYMBOL /PATTERN a ser usado na escala 1:SYMBOLSCALEDENOM. Para s&iacute;mbolos do tipo hatch, o tamanho &eacute; a dist&acirc;ncia de centro a centro entre as linhas. [ATRIBUTO] especifica um atributo a ser usado para usar como valor de tamanho. Os colchetes [] s&atilde;o necess&aacute;rios.",
		en : "",
		es : ""
	} ],
    'sizeTitulo' : [ {
		pt : "Size",
		en : "",
		es : ""
	} ],
    'outlinecolor' : [ {
		pt : "Cor usada para contornar pol&iacute;gonos e alguns s&iacute;mbolos de marcadores (marker). N&atilde;o possui efeito para linhas. A largura do contorno pode ser especificada usando WIDTH. Se n&atilde;o for especificado nenhum WIDTH, ser&aacute; tra&ccedil;ado um contorno de 1 pixel de largura. Se h&aacute; algum s&iacute;mbolo definido em STYLE, ser&aacute; criado um contorno para este s&iacute;mbolo (somente ellipse, truetype e polygon vector ganhar&atilde;o um contorno). Se n&atilde;o houver s&iacute;mbolo definido em STYLE, o pol&iacute;gono ganhar&aacute; um contorno. [ATRIBUTO] especifica um atributo a ser usado para usar como valor de cor. Os colchetes [] s&atilde;o necess&aacute;rios.",
		en : "",
		es : ""
	} ],
    'outlinecolorTitulo' : [ {
		pt : "Outlinecolor",
		en : "",
		es : ""
	} ],
    'width' : [ {
		pt : "WIDTH se refere &agrave; espessura da linha desenhada, em pixeis. Padr&atilde;o &eacute; 1. Quando a escala de s&iacute;mbolos &eacute; utilizada (SYMBOLSCALEDENOM &eacute; utilizado no n&iacute;vel da LAYER) o WIDTH define a espessura da linha - de acordo com o SIZEUNITS da camada &#8211; em rela&ccedil;&atilde;o &agrave; escala 1:SYMBOLSCALEDENOM. Se utilizado com SYMBOL e OUTLINECOLOR, WIDTH define a espessura do contorno dos s&iacute;mbolos. Isto se aplica para os s&iacute;mbolos do tipo  ellipse, truetype e polygon vector. Para linhas, WIDTH especifica a espessura da linha. Para pol&iacute;gonos, se utilizado com OUTLINECOLOR, WIDTH especifica a espessura da linha do pol&iacute;gono. Para um s&iacute;mbolo do tipo hatch, WIDTH especifica a largura das linhas hachuradas. [ATRIBUTO] especifica o atributo a ser usado para valores de WIDTH. Os colchetes [] s&atilde;o necess&aacute;rios.",
		en : "",
		es : ""
	} ],
    'widthTitulo' : [ {
		pt : "Width",
		en : "",
		es : ""
	} ],
    'minsize' : [ {
		pt : "Tamanho m&iacute;nimo em pixeis para desenhar um s&iacute;mbolo. Padr&atilde;o &eacute; 0. S&oacute; &eacute; &uacute;til quando usada escala de s&iacute;mbolos. Para s&iacute;mbolos do tipo hatch, o tamanho &eacute; a dist&acirc;ncia entre linhas hachuradas.",
		en : "",
		es : ""
	} ],
    'minsizeTitulo' : [ {
		pt : "Minsize",
		en : "",
		es : ""
	} ],
    'maxsize' : [ {
		pt : "Tamanho m&aacute;ximo em pixeis para desenhar um s&iacute;mbolo. Padr&atilde;o &eacute; 500.",
		en : "",
		es : ""
	} ],
    'maxsizeTitulo' : [ {
		pt : "Maxsize",
		en : "",
		es : ""
	} ],
    'offsetx' : [ {
		pt : "Valor de deslocamento no eixo x para s&iacute;mbolos com sombras, vazios etc.",
		en : "",
		es : ""
	} ],
    'offsetxTitulo' : [ {
		pt : "Offsetx",
		en : "",
		es : ""
	} ],
    'offsety' : [ {
		pt : "Valor de deslocamento no eixo y para s&iacute;mbolos com sombras, vazios etc.",
		en : "",
		es : ""
	} ],
    'offsetyTitulo' : [ {
		pt : "Offsety",
		en : "",
		es : ""
	} ],
    'antialias' : [ {
		pt : "Ativa ou desativa o antialias para fontes truetype.",
		en : "",
		es : ""
	} ],
    'antialiasTitulo' : [ {
		pt : "Antialias",
		en : "",
		es : ""
	} ],
    'minwidth' : [ {
		pt : "Tamanho m&iacute;nimo em pixeis para desenhar uma linha. Padr&atilde;o &eacute; 0.",
		en : "",
		es : ""
	} ],
    'minwidthTitulo' : [ {
		pt : "Minwidth",
		en : "",
		es : ""
	} ],
    'maxwidth' : [ {
		pt : "Tamanho m&aacute;ximo em pixeis para desenhar uma linha. Padr&atilde;o &eacute; 32.",
		en : "",
		es : ""
	} ],
    'maxwidthTitulo' : [ {
		pt : "Maxwidth",
		en : "",
		es : ""
	} ],
    'angle' : [ {
		pt : "&Acirc;ngulo, em graus, para rotacionar um s&iacute;mbolo (sentido anti-hor&aacute;rio). Padr&atilde;o &eacute; 0 (sem rota&ccedil;&atilde;o). Para pontos, especifica a rota&ccedil;&atilde;o de um s&iacute;mbolo em rela&ccedil;&atilde;o a seu centro. Para linhas estilizadas, o comportamento depende do valor do elemento GAP. Para valores de GAP negativos, ele especifica o rotacionamento de um s&iacute;mbolo relativo &agrave; dire&ccedil;&atilde;o da linha. Um &acirc;ngulo de 0 significa que o eixo x do s&iacute;mbolo &eacute; orientado juntamente com a dire&ccedil;&atilde;o da linha. Se o valor do GAP for positivo, ele especifica o rotacionamento do s&iacute;mbolo em rela&ccedil;&atilde;o ao seu pr&oacute;prio centro.",
		en : "",
		es : ""
	} ],
    'angleTitulo' : [ {
		pt : "Angle",
		en : "",
		es : ""
	} ],
    'msgNovoEstilo' : [ {
		pt : " adicionando um novo estilo",
		en : "",
		es : ""
	} ],
    'colorLabel' : [ {
		pt : "Cor com a qual o texto ser&aacute; desenhado. [ATRIBUTO] especifica o nome do item na tabela de atributos para usar como valores de cor. Os colchetes [] s&atilde;o necess&aacute;rios. Por exemplo, se o DBF do seu shapefile tem um campo chamado &#8220;MYCOLOR&#8221; o objeto LABEL deve conter: LABEL &#8594; COLOR [MYCOLOR].",
		en : "",
		es : ""
	} ],
    'colorLabelTitulo' : [ {
		pt : "Color",
		en : "",
		es : ""
	} ],
    'sizeLabelTitulo' : [ {
		pt : "Size",
		en : "",
		es : ""
	} ],
    'sizeLabel' : [ {
		pt : "Tamanho do texto. Use um n&uacute;mero inteiro para dar o tamanho e pixeis da sua fonte TrueType, ou qualquer outra das 5 palavras para fontes bitmap. Quando a escala de s&iacute;mbolos e utilizada, SIZE representa o tamanho da fonte a ser usada com o mapa na escala 1:SYMBOLSCALEDENOM. [ATRIBUTO] especifica o nome do item na tabela de atributos para usar como valores de tamanho. Os colchetes [] s&atilde;o necess&aacute;rios. Por exemplo, se o DBF do seu shapefile tem um campo chamado &#8220;MYSIZE&#8221; o objeto LABEL deve conter: LABEL &#8594; SIZE [MYSIZE].",
		en : "",
		es : ""
	} ],
    'positonLabel' : [ {
		pt : "Posi&ccedil;&atilde;o da label relativa ao ponto de etiquetagem (somente para camadas). A primeira letra &eacute; a posi&ccedil;&atilde;o Y, a segunda letra &eacute; a posi&ccedil;&atilde;o X. Auto diz ao MapServer para calcular a posi&ccedil;&atilde;o que n&atilde;o vai interferir com as outras labels. Com pontos e pol&iacute;gonos, o MapServer seleciona uma das 8 posi&ccedil;&otilde;es exteriores (ou seja, exclui a op&ccedil;&atilde;o cc). Com linhas, s&oacute; &eacute; utilazando lc ou uc, at&eacute; que ele use uma posi&ccedil;&atilde;o que n&atilde;o colida com labels que j&aacute; tenham sido desenhadas. Se todas as posi&ccedil;&otilde;es causarem conflitos, ent&atilde;o a label n&atilde;o &eacute; desenhada (a n&atilde;o ser que o par&acirc;metro FORCE esteja habilitado). O posicionamento AUTO s&oacute; &eacute; permitido com labels em cache.",
		en : "",
		es : ""
	} ],
    'positonLabelTitulo' : [ {
		pt : "Position",
		en : "",
		es : ""
	} ],
    'bufferLabel' : [ {
		pt : "Espa&ccedil;o livre, em pixeis, ao redor das labels. &Uacute;til para manter um espa&ccedil;o ao redor do texto para melhorar a leitura. S&oacute; &eacute; permitido com labels em cache. Padr&atilde;o &eacute; 0.",
		en : "",
		es : ""
	} ],
    'bufferLabelTitulo' : [ {
		pt : "Buffer",
		en : "",
		es : ""
	} ],
    'font' : [ {
		pt : "Apelido da fonte (como definido em FONTSET) para usar nas labels. [ATRIBUTO] especifica o campo para o apelido da fonte. Pode conter uma lista de fontes para ser usada como recupera&ccedil;&atilde;o para fontes que n&atilde;o suportam grifos, sendo o m&aacute;ximo de fontes de reserva definido em MS_MAX_LABEL_FONTS (geralmente 5). Se especificada diretamente, n&atilde;o se esque&ccedil;a de incluir a lista citada entre aspas.",
		en : "",
		es : ""
	} ],
    'fontTitulo' : [ {
		pt : "Font",
		en : "",
		es : ""
	} ],
    'labeltype' : [ {
		pt : "Tipo de fonte a ser usado. Geralmente fontes bitmap s&atilde;o mais r&aacute;pidas de se desenhar do que fontes TrueType. No entanto, fontes TrueType s&atilde;o pass&iacute;veis de serem usadas com escala e dispon&iacute;veis em uma variedade de tipos. N&atilde;o se esque&ccedil;a de acionar o par&acirc;metro FONT se voc&ecirc; selecionar TrueType.",
		en : "",
		es : ""
	} ],
    'labeltypeTitulo' : [ {
		pt : "Type",
		en : "",
		es : ""
	} ],
    'partials' : [ {
		pt : "O texto pode cruzar o limite do mapa? Padr&atilde;o &eacute; true.",
		en : "",
		es : ""
	} ],
    'partialsTitulo' : [ {
		pt : "Partials",
		en : "",
		es : ""
	} ],
    'force' : [ {
		pt : "For&ccedil;a as labels para uma classe em particular ativada, independente de colis&otilde;es. Dispon&iacute;vel somente para labels em cache. Padr&atilde;o &eacute; false. Se FORCE est&aacute; ligado e PARTIALS desligado, FORCE toma prefer&ecirc;ncia e labels parciais s&atilde;o desenhadas.",
		en : "",
		es : ""
	} ],
    'forceTitulo' : [ {
		pt : "Force",
		en : "",
		es : ""
	} ],
    'backgroundcolorLabel' : [ {
		pt : "Cor a ser desenhado o ret&acirc;ngulo de fundo. Desligado por padr&atilde;o.",
		en : "",
		es : ""
	} ],
    'backgroundcolorLabelTitulo' : [ {
		pt : "Backgroundcolor",
		en : "",
		es : ""
	} ],
    'backgroundshadowcolor' : [ {
		pt : "Cor a ser desenhada a sombra do ret&acirc;ngulo de fundo. Desligado por padr&atilde;o.",
		en : "",
		es : ""
	} ],
    'backgroundshadowcolorTitulo' : [ {
		pt : "Backgroundshadowcolor",
		en : "",
		es : ""
	} ],
    'outlinecolorLabel' : [ {
		pt : "Cor a ser desenhado o contorno de 1 pixel ao redor dos caracteres no texto.[ATRIBUTO] especifica o nome do item na tabela de atributos para usar como valores de cor de contorno. Os colchetes [] s&atilde;o necess&aacute;rios. Por exemplo, se o DBF do seu shapefile tem um campo chamado &#8220;MYOUTCOLOR&#8221; o objeto LABEL deve conter: LABEL &#8594; OUTLINECOLOR [MYOUTCOLOR].",
		en : "",
		es : ""
	} ],
    'outlinecolorLabelTitulo' : [ {
		pt : "Outlinecolor",
		en : "",
		es : ""
	} ],
    'shadowcolor' : [ {
		pt : "Cor da sombra. Uma label com o mesmo texto ser&aacute; desenhada nesta cor antes da label principal, resultando num efeito de sombra nos caracteres da label. O deslocamento da sombra desenhada &eacute; definido em SHADOWSIZE.",
		en : "",
		es : ""
	} ],
    'shadowcolorTitulo' : [ {
		pt : "Shadowcolor",
		en : "",
		es : ""
	} ],
    'shadowsizex' : [ {
		pt : "Deslocamento da sombra no eixo x em pixeis.",
		en : "",
		es : ""
	} ],
    'shadowsizexTitulo' : [ {
		pt : "Shadowsizex",
		en : "",
		es : ""
	} ],
    'shadowsizey' : [ {
		pt : "Deslocamento da sombra no eixo y em pixeis.",
		en : "",
		es : ""
	} ],
    'shadowsizeyTitulo' : [ {
		pt : "Shadowsizey",
		en : "",
		es : ""
	} ],
    'backgroundshadowsizex' : [ {
		pt : "Valor do deslocamento do ret&acirc;ngulo de fundo da sombra no eixo x. Padr&atilde;o &eacute; 1.",
		en : "",
		es : ""
	} ],
    'backgroundshadowsizexTitulo' : [ {
		pt : "Backgroundshadowsizex",
		en : "",
		es : ""
	} ],
    'backgroundshadowsizey' : [ {
		pt : "Valor do deslocamento do ret&acirc;ngulo de fundo da sombra no eixo y. Padr&atilde;o &eacute; 1.",
		en : "",
		es : ""
	} ],
    'backgroundshadowsizeyTitulo' : [ {
		pt : "Backgroundshadowsizey",
		en : "",
		es : ""
	} ],
    'minsizeLabel' : [ {
		pt : "Tamanho m&iacute;nimo da fonte (pixeis) para usar quando desenhando textos conforme a escala. Padr&atilde;o &eacute; 4.",
		en : "",
		es : ""
	} ],
    'minsizeLabelTitulo' : [ {
		pt : "Minsize",
		en : "",
		es : ""
	} ],
    'maxsizeLabel' : [ {
		pt : "Tamanho m&aacute;ximo da fonte (pixeis) para usar quando desenhando textos conforme a escala. Padr&atilde;o &eacute; 256.",
		en : "",
		es : ""
	} ],
    'maxsizeLabelTitulo' : [ {
		pt : "Maxsize",
		en : "",
		es : ""
	} ],
    'offsetxLabel' : [ {
		pt : "",
		en : "",
		es : ""
	} ],
    'offsetxLabelTitulo' : [ {
		pt : "Offsetx",
		en : "",
		es : ""
	} ],
    'offsetyLabel' : [ {
		pt : "Valor de deslocamento no eixo X para labels, relativo ao canto inferior esquerdo da label e do ponto de etiquetagem. Dado em pixeis. No caso de testo rotacionado, especificar os valores como se todas as labels fossem horizontais e qualquer rota&ccedil;&atilde;o ser&aacute; compensada.",
		en : "",
		es : ""
	} ],
    'offsetyLabelTitulo' : [ {
		pt : "Offsety",
		en : "",
		es : ""
	} ],
    'angleLabel' : [ {
		pt : "&Acirc;ngulo, em graus, para desenhar as labels. AUTO permite ao MapServer computar o &acirc;ngulo. V&aacute;lido somente para camadas do tipo linha. AUTO2 &eacute; igual ao AUTO, exceto que nenhuma l&oacute;gica &eacute; aplicada para tentar manter o texto numa orienta&ccedil;&atilde;o de leitura (ou seja, o texto pode ser desenhado de cabe&ccedil;a para baixo). &Uacute;til quando se adiciona textos de seta para indicar a dire&ccedil;&atilde;o da linha. FOLLOW diz ao MapServer para computar uma label curva para fei&ccedil;&otilde;es lineares apropriadas.[ATRIBUTO] especifica o nome do item na tabela de atributos para se usar como valores de &acirc;gulo. Os colchetes [] s&atilde;o necess&aacute;rios. Por exemplo, se o DBF do seu shapefile tem um campo chamado &#8220;MYANGLE&#8221; o objeto LABEL deve conter: LABEL &#8594; ANGLE [MYANGLE].",
		en : "",
		es : ""
	} ],
    'angleLabelTitulo' : [ {
		pt : "Angle (utilize MS_FOLLOW para textos curvos)",
		en : "",
		es : ""
	} ],
    'autoangle' : [ {
		pt : "C&aacute;lculo autom&aacute;tico do &acirc;ngulo quando os elementos forem lineares",
		en : "",
		es : ""
	} ],
    'autoangleTitulo' : [ {
		pt : "Autoangle",
		en : "",
		es : ""
	} ],
    'antialiasLabel' : [ {
		pt : "Ativa ou desativa o antialias. Note que isto requere mais cores dispon&iacute;veis, diminui a performance e resulta em imagens de sa&iacute;da bem maiores. S&oacute; &eacute; &uacute;til para desenhos em gif. Padr&atilde;o &eacute; falso. N&atilde;o tem efeito para outros processamentos (nos quais o antialias n&atilde;o pode ser desligado).",
		en : "",
		es : ""
	} ],
    'antialiasLabelTitulo' : [ {
		pt : "Antialias",
		en : "",
		es : ""
	} ],
    'wrap' : [ {
		pt : "Caractere que define a condi&ccedil;&atilde;o de fim de linha num texto de label, resultando numa label de m&uacute;ltiplas linhas. Interage com MAXLENGHT para defini&ccedil;&atilde;o condicional de quebra de linha ap&oacute;s um dado n&uacute;mero de caracteres.",
		en : "",
		es : ""
	} ],
    'wrapTitulo' : [ {
		pt : "Wrap",
		en : "",
		es : ""
	} ],
    'minfeaturesize' : [ {
		pt : "Tamanho m&iacute;nimo que uma fei&ccedil;&atilde;o deve ter para ser etiquetada. Dado em pixeis. Para dados do tipo linha o comprimento geral da linha exibida &eacute; usada. Para pol&iacute;gonos, a menor dimens&atilde;o da caixa circundante &eacute; usada. AUTO diz ao MapServer s&oacute; etiquetar fei&ccedil;&otilde;es que s&atilde;o maiores do que sua respectiva label. Dispon&iacute;vel somente para labels em cache.",
		en : "",
		es : ""
	} ],
    'minfeaturesizeTitulo' : [ {
		pt : "Minfeaturesize",
		en : "",
		es : ""
	} ],
    'mindistance' : [ {
		pt : "Dist&acirc;ncia m&iacute;nima entre labels duplicadas. Dada em pixeis.",
		en : "",
		es : ""
	} ],
    'mindistanceTitulo' : [ {
		pt : "Mindistance",
		en : "",
		es : ""
	} ],
    'encoding' : [ {
		pt : "Formato de codifica&ccedil;&atilde;o suportado para ser usado para as labels. Se o formato n&atilde;o for suprotado, a label n&atilde;o ser&aacute; desenhada. Requer a biblioteca iconv (presente na maior parte dos sistemas). A biblioteca &eacute; sempre detectada se estiver presente no sistema, mas, se n&atilde;o for, a label n&atilde;o ser&aacute; desenhada. Necess&aacute;rio para exibi&ccedil;&atilde;o de caracteres internacionais. Mais informa&ccedil;&otilde;es podem ser encontradas em: http://www.foss4g.org/FOSS4G/MAPSERVER/mpsnf-i18n-en.html.",
		en : "",
		es : ""
	} ],
    'encodingTitulo' : [ {
		pt : "Encoding",
		en : "",
		es : ""
	} ],
    'conexaoLayer' : [ {
		pt : " Conex&atilde;o com os dados",
		en : "",
		es : ""
	} ],
    'tituloLayer' : [ {
		pt : " T&iacute;tulo, escala, extens&atilde;o",
		en : "",
		es : ""
	} ],
    'editavelLayer' : [ {
		pt : " Edit&aacute;vel (define se o tema &eacute; edit&aacute;vel)",
		en : "",
		es : ""
	} ],
    'comportamentoLayer' : [ {
		pt : " Comportamento no mapa",
		en : "",
		es : ""
	} ],
    'disponibLayer' : [ {
		pt : " Disponibilidade (download, wms,...)",
		en : "",
		es : ""
	} ],
    'miscLayer' : [ {
		pt : " Miscel&acirc;nea",
		en : "",
		es : ""
	} ],
    'adicionaClasseLayer' : [ {
		pt : " Adicionar uma classe",
		en : "",
		es : ""
	} ],
    'criaClassesLayer' : [ {
		pt : " Criar classes automaticamente",
		en : "",
		es : ""
	} ],
    'testaLayer' : [ {
		pt : " Testar",
		en : "",
		es : ""
	} ],
    'pluginLayer' : [ {
		pt : "Plugin (s&oacute; &eacute; poss&iacute;vel ativar um plugin por LAYER)",
		en : "",
		es : ""
	} ],
    'msgAdicionaNovoLayer' : [ {
		pt : " adicionando um novo layer",
		en : "",
		es : ""
	} ],
    'palletefile' : [ {
		pt : "A palete &eacute; v&aacute;lida apenas para temas RASTER. Entre com o endere&ccedil;o do arquivo no servidor. Veja exemplo em i3geo/localhost/symbols/testepalete.txt",
		en : "",
		es : ""
	} ],
    'palletefileTitulo' : [ {
		pt : "Arquivo com palete de cores (opcional e serve apenas para temas raster) (PALLETEFILE)",
		en : "",
		es : ""
	} ],
    'palletestep' : [ {
		pt : "Quantas cores em cada n&iacute;vel da palete. Veja exemplo em i3geo/localhost/symbols/testepalete.txt",
		en : "",
		es : ""
	} ],
    'palletestepTitulo' : [ {
		pt : "Passo (opcional e serve apenas para temas raster) (PALLETESTEP)",
		en : "",
		es : ""
	} ],
    'editorsql' : [ {
		pt : "Indica se o usu&aacute;rio pode abrir o editor de SQL para poder alterar o elemento DATA do Mapfile.",
		en : "",
		es : ""
	} ],
    'editorsqlTitulo' : [ {
		pt : "Permite editar SQL (EDITORSQL)",
		en : "",
		es : ""
	} ],
    'ltempoformatodata' : [ {
		pt : "Formato das datas existentes na tabela de atributos p.e. iso8601",
		en : "",
		es : ""
	} ],
    'ltempoformatodataTitulo' : [ {
		pt : "Linha do tempo: LTEMPOFORMATODATA",
		en : "",
		es : ""
	} ],
    'ltempoiteminicio' : [ {
		pt : "Item que indica a data de in&iacute;cio de um evento",
		en : "",
		es : ""
	} ],
    'ltempoiteminicioTitulo' : [ {
		pt : "Linha do tempo: LTEMPOITEMINICIO",
		en : "",
		es : ""
	} ],
    'ltempoitemfim' : [ {
		pt : "Item que indica a data final de um evento (opcional)",
		en : "",
		es : ""
	} ],
    'ltempoitemfimTitulo' : [ {
		pt : "Linha do tempo: LTEMPOITEMFIM",
		en : "",
		es : ""
	} ],
    'ltempoitemtitulo' : [ {
		pt : "Item que cont&eacute;m o t&iacute;tulo de cada evento",
		en : "",
		es : ""
	} ],
    'ltempoitemtituloTitulo' : [ {
		pt : "Linha do tempo: LTEMPOITEMTITULO",
		en : "",
		es : ""
	} ],
    'ltempoitemdescricao' : [ {
		pt : "Item com a descri&ccedil;&atilde;o do evento (opcional)",
		en : "",
		es : ""
	} ],
    'ltempoitemdescricaoTitulo' : [ {
		pt : "Linha do tempo: LTEMPOITEMDESCRICAO",
		en : "",
		es : ""
	} ],
    'ltempoitemtip' : [ {
		pt : "Item para etiquetas do t&iacute;tulo (opcional)",
		en : "",
		es : ""
	} ],
    'ltempoitemtipTitulo' : [ {
		pt : "Linha do tempo: LTEMPOITEMTIP",
		en : "",
		es : ""
	} ],
    'ltempoitemimagem' : [ {
		pt : "Item com o endere&ccedil;o de uma imagem que ser&aacute; inclu&iacute;da no menu popup, aberto quando o usu&aacute;rio clica em um evento (opcional)",
		en : "",
		es : ""
	} ],
    'ltempoitemimagemTitulo' : [ {
		pt : "Linha do tempo: LTEMPOITEMIMAGEM",
		en : "",
		es : ""
	} ],
    'ltempoitemlink' : [ {
		pt : "Link para uma p&aacute;gina que ser&aacute; inclu&iacute;do no menu popup",
		en : "",
		es : ""
	} ],
    'ltempoitemlinkTitulo' : [ {
		pt : "Linha do tempo: LTEMPOITEMLINK",
		en : "",
		es : ""
	} ],
    'ltempoitemicone' : [ {
		pt : "Endere&ccedil;o da imagem do &iacute;cone que ir&aacute; representar o evento (opcional)",
		en : "",
		es : ""
	} ],
    'ltempoitemiconeTitulo' : [ {
		pt : "Linha do tempo: LTEMPOITEMICONE",
		en : "",
		es : ""
	} ],
    'ltempoconvencode' : [ {
		pt : "Aplica convers&atilde;o do c�digo de caracteres? Pode ser necess&aacute;rio para corrigir problemas de acentua&ccedil;&atilde;o",
		en : "",
		es : ""
	} ],
    'ltempoconvencodeTitulo' : [ {
		pt : "Aplica convers&atilde;o do c�digo de caracteres? Pode ser necess&aacute;rio para corrigir problemas de acentua&ccedil;&atilde;o",
		en : "",
		es : ""
	} ],
    'classesitem' : [ {
		pt : "&Eacute; poss&iacute;vel a gera&ccedil;&atilde;o de classes automaticamente por meio da defini&ccedil;&atilde;o de colunas na tabela de atributos do tema que armazenam as informa&ccedil;&otilde;es sobre cor, tamanho, etc. Esse metadata &eacute; utilizado para definir qual a coluna da tabela que identifica unicamente cada classe. Para cada valor ser&aacute; criada uma classe.<br>O tema que utiliza a gera&ccedil;&atilde;o de classes de forma autom&aacute;tica, deve ter definido apenas uma classe. Essa classe ser&aacute; utilizada como padr&atilde;o para gera&ccedil;&atilde;o das demais.",
		en : "",
		es : ""
	} ],
    'classesitemTitulo' : [ {
		pt : "Auto-legenda: id das classes (CLASSESITEM)",
		en : "",
		es : ""
	} ],
    'classesnome' : [ {
		pt : "Nome da coluna que ser&aacute; utilizada para compor o nome das classes geradas automaticamente.",
		en : "",
		es : ""
	} ],
    'classesnomeTitulo' : [ {
		pt : "Auto-legenda: nome das classes (CLASSESNOME)",
		en : "",
		es : ""
	} ],
    'classescor' : [ {
		pt : "Nome da coluna que definir&aacute; a cor do s&iacute;mbolo utilizado em cada classe. As cores devem ser definidas em RGB.",
		en : "",
		es : ""
	} ],
    'classescorTitulo' : [ {
		pt : "Auto-legenda: cor da classe (CLASSESCOR)",
		en : "",
		es : ""
	} ],
    'classessimbolo' : [ {
		pt : "Nome da coluna que definir&aacute; o s&iacute;mbolo utilizado em cada classe.",
		en : "",
		es : ""
	} ],
    'classessimboloTitulo' : [ {
		pt : "Auto-legenda: s&iacute;mbolo (CLASSESSIMBOLO)",
		en : "",
		es : ""
	} ],
    'classestamanho' : [ {
		pt : "Nome da coluna que definir&aacute; o tamanho de cada s&iacute;mbolo.",
		en : "",
		es : ""
	} ],
    'classestamanhoTitulo' : [ {
		pt : "Auto-legenda: tamanho (CLASSESTAMANHO)",
		en : "",
		es : ""
	} ],
    'itembuscarapida' : [ {
		pt : "Nome da coluna da tabela de atributos do tema que ser&aacute; utilizado na ferramenta busca r&aacute;pida. Entre apenas uma coluna",
		en : "",
		es : ""
	} ],
    'itembuscarapidaTitulo' : [ {
		pt : "Item utilizado no busca r&aacute;pida (itembuscarapida)",
		en : "",
		es : ""
	} ],
    'itens' : [ {
		pt : "Nomes das colunas da tabela de atributos do tema, que ser&atilde;o mostradas na ferramenta de identifica&ccedil;&atilde;o. Se for vazio, todas as colunas ser&atilde;o mostradas. A lista de itens deve ser separada por ',' e grafada em caixa alta no caso de shapefile.",
		en : "",
		es : ""
	} ],
    'itensTitulo' : [ {
		pt : "Itens (ITENS)",
		en : "",
		es : ""
	} ],
    'itensdesc' : [ {
		pt : "Lista com os 'alias', ou apelidos, para os nomes das colunas listados no metadata 'itens'. Os alias devem ser separados por ',' e seguir a ordem definida em ITENS.",
		en : "",
		es : ""
	} ],
    'itensdescTitulo' : [ {
		pt : "Nomes dos itens (ITENSDESC)",
		en : "",
		es : ""
	} ],
    'itenslink' : [ {
		pt : "Lista de links que ser&atilde;o inclu&iacute;dos em cada resultado de busca da ferramenta de identifica&ccedil;&atilde;o. A lista de links deve ser separada por ',', podendo-se incluir '' para indicar que o item n&atilde;o tem link. Exemplo de uso para inclus&atilde;o de links para o site do IBGE quando um munic&iacute;pio &eacute; clicado no mapa:<br>ITENS 'codigo,nome2,uf'<br>ITENSDESC 'codigo do IBGE,nome do munic&iacute;pio,uf'<br>ITENSLLINK ',http://www.ibge.gov.br/munic2001/tabelas.php?codmun=[codigo]&descricao=[nome],'<br>Podem ser inclu&iacute;dos comandos javascript, para isso utilize sempre aspas simples para fechar o link e acrescente o c�digo javascript, exemplo:<br>ITENSLINK \",'../ferramentas/identifica/testelink.php?sid='+i3GEO.configura.sid\"",
		en : "",
		es : ""
	} ],
    'itenslinkTitulo' : [ {
		pt : "Links dos itens (ITENSLINK)",
		en : "",
		es : ""
	} ],
    'descriptiontemplate' : [ {
		pt : "Template utilizado no gerador de KML para definir o conte&uacute;do dos bal&otilde;es de informa&ccedil;&atilde;o. O template utiliza o caractere '%' para iniciar e fechar o nome de uma coluna. O template pode usar tamb&eacute;m elementos HTML, por exemplo: <code>'<b>Nome do municipio</b>: %NOMEMUN%'</code>. Se o template n&atilde;o for especificado, o i3Geo ir&aacute; utilizar o metadata ITENS e ITENSDESC. Se esses n&atilde;o forem especificados, ser&aacute; utilizado o nome original da coluna.",
		en : "",
		es : ""
	} ],
    'descriptiontemplateTitulo' : [ {
		pt : "KML template (DESCRIPTION_TEMPLATE)",
		en : "",
		es : ""
	} ],
    'tip' : [ {
		pt : "Lista de colunas que ser&atilde;o utilizadas na op&ccedil;&atilde;o de inclus&atilde;o de 'etiquetas'. As etiquetas s&atilde;o mostradas no mapa quando o usu&aacute;rio estaciona o mouse por alguns instantes sobre o mapa. Separe a lista com ','.",
		en : "",
		es : ""
	} ],
    'tipTitulo' : [ {
		pt : "Etiqueta (TIP)",
		en : "",
		es : ""
	} ],
    'wmstile' : [ {
		pt : "Metadata espec&iacute;fico do i3Geo. Indica se o layer &eacute; do tipo TILECACHE",
		en : "",
		es : ""
	} ],
    'wmstileTitulo' : [ {
		pt : "&Eacute; do tipo TileCache (0 ou 1 indicam n&atilde;o ou sim) - wms_tile",
		en : "",
		es : ""
	} ],
    'name' : [ {
		pt : "Elemento 'NAME'. N&atilde;o confunda com o nome que aparece no mapa ou  na &aacute;rvore de temas. Normalmente o c�digo recebe o mesmo nome do arquivo mapfile, sem a extens&atilde;o '.map'",
		en : "",
		es : ""
	} ],
    'nameTitulo' : [ {
		pt : "C&oacute;digo do layer",
		en : "",
		es : ""
	} ],
    'group' : [ {
		pt : "Nome do grupo a qual a camada pertence. O nome do grupo pode ser refer&ecirc;ncia como um nome regular de uma camada, permitindo fazer coisas como ligar e desligar um grupo de camadas de uma vez.",
		en : "",
		es : ""
	} ],
    'groupTitulo' : [ {
		pt : "Group",
		en : "",
		es : ""
	} ],
    'tema' : [ {
		pt : "Nome que ser&aacute; utilizado na legenda do mapa e na guia 'Temas'",
		en : "",
		es : ""
	} ],
    'temaTitulo' : [ {
		pt : "T&iacute;tulo (METADATA: TEMA)",
		en : "",
		es : ""
	} ],
    'escala' : [ {
		pt : "Denominador da escala da fonte dos dados utilizado pelo tema. &Eacute; utilizado para apresentar a indica&ccedil;&atilde;o de compatibilidade entre a escala do tema e a escala do mapa que est&aacute; sendo visto.",
		en : "",
		es : ""
	} ],
    'escalaTitulo' : [ {
		pt : "Escala (ESCALA)",
		en : "",
		es : ""
	} ],
    'exten' : [ {
		pt : "Extens&atilde;o geogr&aacute;fica m&aacute;xima do tema, no formato xmin ymin xmax ymax. &Eacute; utilizado na op&ccedil;&atilde;o de 'zoom para o tema'. Quando o tema &eacute; baseado em shapefile, esse metadata n&atilde;o &eacute; necess&aacute;rio, pois o mapserver consegue calcular a extens&atilde;o. J&aacute; em outros tipos de dados, como Postgis, o par&acirc;metro &eacute; necess&aacute;rio. Nesse caso, se n&atilde;o for indicado, o bot&atilde;o de zoom para o tema n&atilde;o ser&aacute; vis&iacute;vel para o usu&aacute;rio",
		en : "",
		es : ""
	} ],
    'extenTitulo' : [ {
		pt : "Extensao (EXTENSAO)",
		en : "",
		es : ""
	} ],
    'iconetema' : [ {
		pt : "&Iacute;cone que ser&aacute; mostrado na &aacute;rvore de camadas. A imagem deve existir na web e deve ser inclu&iacute;do o caminho completo ou relativo em rela&ccedil;&atilde;o ao local da interface HTML do mapa.",
		en : "",
		es : ""
	} ],
    'iconetemaTitulo' : [ {
		pt : "&Iacute;cone (METADATA: ICONETEMA)",
		en : "",
		es : ""
	} ],
    'mensagem' : [ {
		pt : "Mensagem que ser&aacute; mostrada no rodap&eacute; do mapa quando o tema estiver vis&iacute;vel. &Eacute; &uacute;til para apresentar ao usu&aacute;rio observa&ccedil;&otilde;es especiais sobre o uso daquele tema.",
		en : "",
		es : ""
	} ],
    'mensagemTitulo' : [ {
		pt : "Mensagem (MENSAGEM)",
		en : "",
		es : ""
	} ],
    'colunaLabel' : [ {
		pt : "Coluna da tabela de atributos",
		en : "",
		es : ""
	} ],
    '' : [ {
		pt : "",
		en : "",
		es : ""
	} ]
};
