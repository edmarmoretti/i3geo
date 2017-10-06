if(typeof i3GEOadmin.uploadshp == "undefined" ){
	i3GEOadmin.uploadshp = {};
}
i3GEOadmin.uploadshp.dicionario = {
	'pastaArmazenamento' : [ {
		pt : "Pasta no servidor onde os dados ser&atilde;o armazenados.",
		en : "",
		es : ""
	} ],
	'projecao' : [ {
		pt : "Proje&ccedil;&atilde;o (apenas ser&aacute; utilizado se n&atilde;o for feito o upload de um arquivo .prj)",
		en : "",
		es : ""
	} ],
	'envia' : [ {
		pt : "Enviar",
		en : "",
		es : ""
	} ],
	'criaMapfile' : [ {
		pt : "Marque para criar o arquivo de configura&ccedil;&atilde;o (mapfile) e visualizar os dados no mapa interativo (voc&ecirc; poder&aacute; editar esse arquivo posteriormente no editor de mapfiles)",
		en : "",
		es : ""
	} ],
	'txtTitulo' : [ {
		pt : "Upload de arquivo shapefile",
		en : "",
		es : ""
	} ],
	'txtDesc' : [ {
		pt : "Aqui &eacute; poss&iacute;vel subir um arquivo shapefile (.shp, .shx, .dbf e .prj) diretamente para o servidor onde est&aacute; instalado o i3Geo. Caso n&atilde;o seja inclu&iacute;do um arquivo .prj, o usu&aacute;rio pode informar a proje&ccedil;&atilde;o no momento da subida a partir de uma lista. Tamb&eacute;m &eacute; poss&iacute;vel escolher se se deseja criar um mapfile para o tema automaticamente.</p><p>&Eacute; preciso configurar a vari&aacute;vel <code>$i3geoUploadDataWL</code> do arquivo <samp>i3geo/ms_configura.php</samp> com as pastas no servidor que podem receber arquivos.",
		en : "",
		es : ""
	} ],
	'txtAjuda' : [ {
		pt : "A pasta no servidor onde o arquivo ficar&aacute; armazenado deve ter as permiss&otilde;es adequadas para permitir o armazenamento dos arquivos. Verifique com o administrador do servidor essas permiss&otilde;es e os endere&ccedil;os das pastas que podem receber arquivos.<br>Para evitar a remo&ccedil;&atilde;o de arquivos que est&atilde;o em uso por outros usu&aacute;rios, n&atilde;o &eacute; permitido apagar arquivos. Para apagar arquivos, solicite diretamente ao administrador do servidor.",
		en : "",
		es : ""
	} ],
	'txtArquivos' : [ {
		pt : "Escolha os arquivos que formam o shapefile",
		en : "",
		es : ""
	} ],
	'txtTituloShp2Pg' : [ {
		pt : "Importação de arquivo shapefile para PostGIS",
		en : "",
		es : ""
	} ],
	'txtDescShp2Pg' : [ {
		pt : "Aqui &eacute; poss&iacute;vel subir uma camada shapefile (.shp, .shx, .dbf) diretamente para um banco PostGIS. O usu&aacute;rio deve escolher o esquema e incluir o nome de uma tabela. Caso j&aacute; exista uma tabela com o mesmo nome, &eacute; poss&iacute;vel escolher se se quer inserir novos registros na tabela ou apagar os registros existentes e inserir novos. &Eacute; poss&iacute;vel fazer a reproje&ccedil;&atilde;o do arquivo shapefile incluindo a proje&ccedil;&atilde;o de destino diferente da de origem. Tamb&eacute;m &eacute; poss&iacute;vel escolher se se deseja criar um mapfile para o tema automaticamente.<p></p>&Eacute; preciso configurar a vari&aacute;vel <code>$i3geoUploadDataWL</code> do arquivo <samp>i3geo/ms_configura.php</samp> com a string de conex&atilde;o com banco e esquema.",
		en : "",
		es : ""
	} ],
	'txtAjudaShp2Pg' : [ {
		pt : "No formul&aacute;rio deve-se indicar os arquivos nos formatos SHP, SHX e DBF que formam o SHAPEFILE. O arquivo &eacute; enviado ao servidor e armazenado temporariamente para que a convers&atilde;o para PostGIS seja poss&iacute;vel. O resultado do processo ser&aacute; uma tabela no banco de dados no esquema escolhido pelo usu&aacute;rio. O acesso ao banco &eacute; feito por meio do usu&aacute;rio administrativo da aplica&ccedil;&atilde;o i3Geo (o mesmo que gerencia o sistema de administra&ccedil;&atilde;o, veja em ms_configura.php). Esse usu&aacute;rio, definido pelo administrador do servidor, deve ter os direitos de escrita no esquema do banco de dados escolhido para importar os dados.",
		en : "",
		es : ""
	} ],
	'esquemaArmazenamento' : [ {
		pt : "Esquema no banco de dados onde a tabela ser&aacute; criada",
		en : "",
		es : ""
	} ],
	'sridOrigem' : [ {
		pt : "Código numérico SRID (projeção cartográfica) referente ao arquivo shapefile",
		en : "",
		es : ""
	} ],
	'sridDestino' : [ {
		pt : "Código numérico SRID (projeção cartográfica) que será utilizado para armazenar os dados no banco",
		en : "",
		es : ""
	} ],
	'tipoOperacao' : [ {
		pt : "Tipo de opera&ccedil;&atilde;o. Sempre &eacute; criado um backup no banco caso a tabela j&aacute; exista.",
		en : "",
		es : ""
	} ],
	'tabelaNova' : [ {
		pt : "Tabela nova",
		en : "",
		es : ""
	} ],
	'tabelaUpdate' : [ {
		pt : "Apagar registros e inserir novos",
		en : "",
		es : ""
	} ],
	'tabelaInsert' : [ {
		pt : "Inserir registros novos",
		en : "",
		es : ""
	} ],
	'nomeTabela' : [ {
		pt : "Nome da nova tabela ou de uma tabela j&aacute; existente",
		en : "",
		es : ""
	} ],
	'apenasScript' : [ {
		pt : "N&atilde;o cria ou modifica a tabela, apenas mostra nos resultados o script SQL",
		en : "",
		es : ""
	} ],
	'comentarioTabela' : [ {
		pt : "Coment&aacute;rio que ser&aacute; inserido nas propriedades da tabela caso seja uma nova tabela",
		en : "",
		es : ""
	} ],
	'colunaGid' : [ {
		pt : "Nome de uma nova coluna, ou de uma existente no shapefile, que ser&aacute; considerada como identificadores &uacute;nicos de cada registro. Caso a coluna n&atilde;o exista, ser&aacute; criada.",
		en : "",
		es : ""
	} ],
	'comboAliasConexao' : [ {
		pt : "Alias da conex&atilde;o com o banco de dados. Ser&aacute; utilizado apenas para o caso de constru&ccedil;&atilde;o do arquivo mapfile.",
		en : "",
		es : ""
	} ],
	'txtTituloCsv2Pg' : [ {
		pt : "Importação de arquivo CSV para PostGIS",
		en : "",
		es : ""
	} ],
	'txtDescCsv2Pg' : [ {
		pt : "Aqui &eacute; poss&iacute;vel subir um arquivo .csv como uma camada geogr&aacute;fica em um banco PostGIS. O usu&aacute;rio deve escolher o esquema, as colunas que representam as coordenadas x (longitude) e y (latitude) e incluir o nome de uma tabela. Caso j&aacute; exista uma tabela com o mesmo nome, &eacute; poss&iacute;vel escolher se se quer inserir novos registros na tabela ou apagar os registros existentes e inserir novos. Tamb&eacute;m &eacute; poss&iacute;vel escolher se se deseja criar um mapfile para o tema automaticamente.<p></p>&Eacute; preciso configurar a vari&aacute;vel <code>$i3geoUploadDataWL</code> do arquivo <samp>i3geo/ms_configura.php</samp> com a string de conex&atilde;o com banco e esquema.",
		en : "",
		es : ""
	} ],
	'txtAjudaCsv2Pg' : [ {
		pt : "No formul&aacute;rio deve-se indicar o arquivo no formato CSV. O arquivo &eacute; enviado ao servidor e armazenado temporariamente para que a convers&atilde;o para PostGIS seja poss&iacute;vel. O resultado do processo ser&aacute; uma tabela no banco de dados no esquema escolhido pelo usu&aacute;rio. O acesso ao banco &eacute; feito por meio do usu&aacute;rio administrativo da aplica&ccedil;&atilde;o i3Geo (o mesmo que gerencia o sistema de administra&ccedil;&atilde;o, veja em ms_configura.php). Esse usu&aacute;rio, definido pelo administrador do servidor, deve ter os direitos de escrita no esquema do banco de dados escolhido para importar os dados.",
		en : "",
		es : ""
	} ],
	'txtArquivoCsv' : [ {
		pt : "Escolha o arquivo texto no formato CSV",
		en : "",
		es : ""
	} ],
	'sridOrigemCsv' : [ {
		pt : "Código numérico SRID (projeção cartográfica) referente aos dados das colunas x e y caso sejam especificadas",
		en : "",
		es : ""
	} ],
	'colunaX' : [ {
		pt : "Nome da coluna no arquivo CSV que contém os valores de coordenadas do eixo x (longitude)",
		en : "",
		es : ""
	} ],
	'colunaY' : [ {
		pt : "Nome da coluna no arquivo CSV que contém os valores de coordenadas do eixo y (latitude)",
		en : "",
		es : ""
	} ]
};
