//+$trad(1,i3GEOadmin.editormapfile.dicionario)+
i3GEOadmin.editormapfile = {};
i3GEOadmin.editormapfile.dicionario = {
	'adminMapfile' : [ {
		pt : "Administra&ccedil;&atilde;o do i3geo - mapfiles dos temas",
		en : "",
		es : ""
	} ],
    'txtAjudaMapfile' : [ {
		pt : "<p>Importante: a restri&ccedil;&atilde;o ao tema por meio da defini&ccedil;&atilde;o de grupos de usu&aacute;rios n&atilde;o bloqueia o acesso por meio de download, WMS, KML, etc. Para bloquear esse tipo de acesso &eacute; necess&aacute;rio alterar as op&ccedil;&otilde;es espec&iacute;ficas. Por padr&atilde;o, esses servi&ccedil;os s&atilde;o habilitados para qualquer usu&aacute;rio, n&atilde;o sendo poss&iacute;vel bloquear apenas para determinados grupos. <p>Este formul&aacute;rio permite criar ou editar os arquivos mapfile que comp&otilde;em temas no i3geo. <p>Os arquivo .map s&atilde;o armazenados no diretório i3geo/temas e podem tamb&eacute;m ser editados manualmente. <p>Cada arquivo cont&eacute;m layers definidos conforme a sintaxe utilizada pelo Mapserver. Esses arquivos s&atilde;o as estruturas b&aacute;sicas utilizadas pelo i3geo na apresenta&ccedil;&atilde;o de dados e montagem das camadas que s&atilde;o vistas no mapa. <p>Após criados os mapfiles, deve-se ainda definir as caracter&iacute;sticas de cada LAYER. <p>A lista de IPs dos usu&aacute;rios que podem administrar o i3geo &eacute; definida no arquivo i3geo/ms_configura.php <p>Apenas os mapfiles que forem vinculados a um tema poder&atilde;o ser vistos na janela de inclus&atilde;o de temas na &aacute;rvore de temas. Se voc&ecirc; criou um mapfile manualmente, utilize a op&ccedil;&atilde;o de edi&ccedil;&atilde;o (&iacute;cone apresentado ao lado de cada mapfile) para fazer essa associa&ccedil;&atilde;o. <p>A op&ccedil;&atilde;o 'Verifica temas sem mapfiles' possibilita resolver problemas decorrentes da elimina&ccedil;&atilde;o manual de um arquivo mapfile do servidor. Nesses casos, o registro no banco de dados permanece. Com essa op&ccedil;&atilde;o &eacute; poss&iacute;vel apagar os registros ou recriar o mapfile perdido.",
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
		pt : "Opcao disponivel apenas para o tipo shapefile", // esta sem acento pois alguns navegadores não aceitam acentuacao em alert
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
		pt : "URL de uma imagem que ser&aacute; utilizada em substitui&ccedil;&atilde;o à gera&ccedil;&atilde;o normal da legenda ",
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
	} ]
};
