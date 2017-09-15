i3GEOadmin.principal = {};
i3GEOadmin.principal.dicionario = {
    'adminI3geo' : [ {
		pt : "Administra&ccedil;&atilde;o do i3Geo",
		en : "",
		es : ""
	} ],
	'msgBemVindo' : [ {
		pt : "<big>Bem-vindo ao sistema de administra&ccedil;&atilde;o do i3Geo. Aqui voc&ecirc; tem acesso &agrave;s principais funcionalidades de administra&ccedil;&atilde;o do sistema. No menu superior voc&ecirc; encontra atalhos para cada m&oacute;dulo do sistema de administra&ccedil;&atilde;o. Configura&ccedil;&otilde;es adicionais s&atilde;o feitas a partir da edi&ccedil;&atilde;o do arquivo <samp>i3geo/ms_configura.php</samp>. Caso n&atilde;o tenha acesso a esse arquivo, entre em contato com o administrador do seu servidor.",
		en : "",
		es : ""
	} ],
	'msgLogin' : [ {
		pt : "Se voc&ecirc; tem acesso a essa p&aacute;gina voc&ecirc; est&aacute; logado como administrador. Caso seja a primeira vez que acessa o sistema voc&ecirc; deve estar logado como usu&aacute;rio master. As credenciais para acesso como master podem ser encontradas na vari&aacute;vel <code>$i3geomaster</code> do arquivo <samp>i3geo/ms_configura.php</samp>. &Eacute; importante alterar o login e a senha padr&atilde;o desse usu&aacute;rio, caso contr&aacute;rio os mapas ser&atilde;o bloqueados quando n&atilde;o estiver trabalhando em um ambiente local.",
		en : "",
		es : ""
	} ],
	'msgFerramentas' : [ {
		pt : "Na guia <kbd>Ferramentas</kbd> voc&ecirc; tem acesso &agrave;s funcionalidades mais b&aacute;sicas de administra&ccedil;&atilde;o. A partir dela voc&ecirc; pode abrir o mapa do i3Geo em sua interface padr&atilde;o e realizar o teste de instala&ccedil;&atilde;o. O <kbd>Teste de Instala&ccedil;&atilde;o</kbd> &eacute; importante para verificar se todas as depend&ecirc;ncias do sistema foram instaladas corretamente, a vers&atilde;o do i3Geo, do MapServer e do PHP, a localiza&ccedil;&atilde;o e permiss&otilde;es dos arquivos e pastas padr&atilde;o, al&eacute;m de identificar poss&iacute;veis erros de renderiza&ccedil;&atilde;o e codifica&ccedil;&atilde;o. &Eacute; recomendado rodar um teste de instala&ccedil;&atilde;o se estiver trabalhando em uma instala&ccedil;&atilde;o nova ou que sofreu altera&ccedil;&otilde;es em suas depend&ecirc;ncias.",
		en : "",
		es : ""
	} ],
	'msgSqlite' : [ {
		pt : "O i3Geo utiliza como padr&atilde;o o gerenciador de banco de dados SQLite, cujo arquivo com os dados fica armazenado em <samp>i3geo/admin/admin.db</samp>. Como o SQLite usa um arquivo em disco &eacute;, necess&aacute;rio se atentar &agrave;s permiss&otilde;es de acesso caso ocorram problemas de escrita no banco, principalmente em ambientes Linux. Os programas em PHP que gerenciam esse banco utilizam o pacote PDO, possibilitando que seja utilizado outro gerenciador, como o PostgreSQL, por exemplo. Para modificar a configura&ccedil;&atilde;o do PDO e utilizar outro gerenciador deve-se editar o arquivo <samp>i3geo/admin/conexao.php</samp> ou ent&atilde;o alterar a vari&aacute;vel de <code>$conexaoadmin</code> definida no arquivo <samp>i3geo/ms_configura.php</samp>. Essa vari&aacute;vel indica o nome de um programa em PHP que ser&aacute; inclu&iacute;do nos programas que fazem acesso ao banco de dados de administra&ccedil;&atilde;o. Para usar um gerenciador diferente do SQLite &eacute; necess&aacute;rio criar as tabelas no novo banco de dados. Os scripts SQL para essa cria&ccedil;&atilde;o podem ser obtidos no item <kbd>Ferramentas</kbd> > <kbd>Outras op&ccedil;&otilde;es</kbd> > <kbd>Criar banco de dados</kbd>.",
		en : "",
		es : ""
	} ],
	'msgUsr' : [ {
		pt : "Na guia <kbd>Usu&aacute;rios</kbd> voc&ecirc; pode criar e manipular os usu&aacute;rios, grupos de usu&aacute;rios e as opera&ccedil;&otilde;es que cada elemento pode realizar dentro do sistema.",
		en : "",
		es : ""
	} ],
	'msgMetaestat' : [ {
		pt : "Em <kbd>Metaestat</kbd> &eacute; poss&iacute;vel cadastrar vari&aacute;veis e medidas que compor&atilde;o metadados para a visualiza&ccedil;&atilde;o de informa&ccedil;&otilde;es estat&iacute;sticas em uma determinada regi&atilde;o, os chamados metadados estat&iacute;sticos. Dessa forma, &eacute; poss&iacute;vel configurar visualiza&ccedil;&otilde;es espaciais padr&atilde;o para vari&aacute;veis estat&iacute;sticas.",
		en : "",
		es : ""
	} ],
	'msgUpload' : [ {
		pt : "No m&oacute;dulo <kbd>Upload</kbd> voc&ecirc; pode realizar a subida para o servidor ou diretamente para o banco de dados de arquivos nos formato shapefile ou CSV. Para isso, &eacute; preciso configurar a vari&aacute;vel  <code>$i3geoUploadDataWL</code> do arquivo <samp>i3geo/ms_configura</samp> com as pastas no servidor que podem receber arquivos ou com a string de conex&atilde;o com banco e esquema, no caso de carga em banco de dados.",
		en : "",
		es : ""
	} ],
	'msgCatalogo' : [ {
		pt : "Na guia <kbd>Cat&aacute;logo</kbd> &eacute; onde s&atilde;o criadas as camadas dos mapas (arquivos mapfiles). As camadas s&atilde;o organizadas em uma &aacute;rvore de temas compostas por menus, grupos e subgrupos. &Eacute; poss&iacute;vel atribuir perfis para camadas espec&iacute;ficas ou para um agrupamento de camadas, tornando-os vis&iacute;veis apenas para os perfis desejados.",
		en : "",
		es : ""
	} ],
	'msgCatalogo' : [ {
		pt : "Em <kbd>Cadastros</kbd> &eacute; onde s&atilde;o realizadas as configura&ccedil;&otilde;es de conex&otilde;es com servi&ccedil;os e sistemas externos que podem ser utilizados como camadas ou como configura&ccedil;&otilde;es adicionais para os temas.",
		en : "",
		es : ""
	} ],
    'manualAdmin' : [ {
		pt : "Manual do sistema de administra&ccedil;&atilde;o",
		en : "",
		es : ""
	} ],
    'veja' : [ {
		pt : "Veja tamb&eacute;m:",
		en : "",
		es : ""
	} ],
    'merBdAdmin' : [ {
		pt : "diagrama MER do banco de dados de administra&ccedil;&atilde;o.",
		en : "",
		es : ""
	} ],
    'merBdUsr' : [ {
		pt : "diagrama MER do banco de dados de usu&aacute;rios.",
		en : "",
		es : ""
	} ],
    'merBdMetaestat' : [ {
		pt : "diagrama MER do banco de dados do sistema de metadados estat&iacute;sticos.",
		en : "",
		es : ""
	} ],
    'leiaMe' : [ {
		pt : "Entre uma vers&atilde;o e outra do i3Geo o banco de dados de administra&ccedil;&atilde;o pode sofrer altera&ccedil;&otilde;es. Consulte o documento <samp>i3geo/guia_de_migracao.txt</samp> para verificar os detalhes.",
		en : "",
		es : ""
	} ]

};
