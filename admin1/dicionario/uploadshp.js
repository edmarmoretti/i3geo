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
		pt : "Envie e armazene no servidor arquivos no formato shapefile. Os arquivos poder&atilde;o ser utilizados para incluir camadas no cat&aacute;logo de temas ou utilizados de outras maneiras para compor mapas.",
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
		pt : "Importação de arquivo shapefile para Postgis",
		en : "",
		es : ""
	} ],
	'txtDescShp2Pg' : [ {
		pt : "Faz o upload de um arquivo shapefile e converte para o banco de dados Postgis existente no servidor web.",
		en : "",
		es : ""
	} ],
	'txtAjudaShp2Pg' : [ {
		pt : "No formul&aacute;rio deve-se indicar os arquivos nos formatos SHP, SHX e DBF que formam o SHAPEFILE. O arquivo &eacute; enviado ao servidor e armazenado temporariamente para que a convers&atilde;o para Postgis seja poss&iacute;vel. O resultado do processo ser&aacute; uma tabela no banco de dados no esquema escolhido pelo usu&aacute;rio. O acesso ao banco &eacute; feito por meio do usu&aacute;rio administrativo da aplica&ccedil;&atilde;o i3Geo (o mesmo que gerencia o sistema de administra&ccedil;&atilde;o, veja em ms_configura.php). Esse usu&aacute;rio, definido pelo administrador do servidor, deve ter os direitos de escrita no esquema do banco de dados escolhido para importar os dados.",
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
		pt : "Importação de arquivo CSV para Postgis",
		en : "",
		es : ""
	} ],
	'txtDescCsv2Pg' : [ {
		pt : "Faz o upload de um arquivo CSV e converte para o banco de dados Postgis existente no servidor web. Permite ainda a convers&atilde;o de colunas com a latitude e longitude em uma coluna do tipo geometria.",
		en : "",
		es : ""
	} ],
	'txtAjudaCsv2Pg' : [ {
		pt : "No formul&aacute;rio deve-se indicar o arquivo no formato CSV. O arquivo &eacute; enviado ao servidor e armazenado temporariamente para que a convers&atilde;o para Postgis seja poss&iacute;vel. O resultado do processo ser&aacute; uma tabela no banco de dados no esquema escolhido pelo usu&aacute;rio. O acesso ao banco &eacute; feito por meio do usu&aacute;rio administrativo da aplica&ccedil;&atilde;o i3Geo (o mesmo que gerencia o sistema de administra&ccedil;&atilde;o, veja em ms_configura.php). Esse usu&aacute;rio, definido pelo administrador do servidor, deve ter os direitos de escrita no esquema do banco de dados escolhido para importar os dados.",
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
