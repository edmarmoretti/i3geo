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
