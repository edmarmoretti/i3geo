if (typeof (i3GEOadmin.variaveis) === 'undefined') {
	i3GEOadmin.variaveis = {};
}
i3GEOadmin.variaveis.dicionario = {
	'txtTituloVariavel' : [ {
		pt : "Cadastro de vari&aacute;veis",
		en : "",
		es : ""
	} ],
	'txtDescVariavel' : [ {
		pt : "As vari&aacute;veis s&atilde;o agrupamentos de medidas e recebem um nome e uma descri&ccedil;&atilde;o",
		en : "",
		es : ""
	} ],
    'txtAjudaVariavel' : [ {
		pt : "Esse formul&aacute;rio permite editar as var&iacute;&aacute;veis e suas medidas, definindo-se as fontes dos dados, tipos de classifica&ccedil;&atilde;o, forma de representa&ccedil;&atilde;o etc. As v&aacute;ri&aacute;veis s&atilde;o fen&ocirc;menos que possuem medidas estat&iacute;sticas. Os par&acirc;metros definem como as vari&aacute;veis s&atilde;o acessadas para a montagem dos cartogramas.",
		en : "",
		es : ""
	} ],
    'medidas' : [ {
		pt : "medidas",
		en : "",
		es : ""
	} ],
    'nomeVariavelTxt' : [ {
		pt : "Nome que ser&aacute; utilizado nos menus de escolha da vari&aacute;vel",
		en : "",
		es : ""
	} ],
    'txtTituloMedida' : [ {
		pt : "Cadastro de medidas de uma vari&aacute;vel",
		en : "",
		es : ""
	} ],
    'txtDescMedida' : [ {
		pt : "As medidas s&atilde;o valores existentes em uma tabela no banco de dados e est&aacute; relacionada &agrave; vari&aacute;vel em foco",
		en : "",
		es : ""
	} ],
    'txtAjudaMedida' : [ {
		pt : "Var&iacute;av&eacute;s podem ter mais de uma medida. Cada medida possu&iacute; atributos que indicam onde os dados est&atilde;o localizados no banco de dados e quais suas principais caracter&iacute;sticas. O formul&aacute;rio permite ainda editar outras op&ccedil;&otilde;es que definem como os dados s&atilde;o classificados em um mapa e outras.",
		en : "",
		es : ""
	} ],
    'nomemedidaTxt' : [ {
		pt : "Nome da medida",
		en : "",
		es : ""
	} ],
    'codigo_tipo_periodoTxt' : [ {
		pt : "Tipo de per&iacute;odo de tempo",
		en : "",
		es : ""
	} ],
    'codigo_tipo_regiaoTxt' : [ {
		pt : "Tipo de regi&atilde;o geogr&aacute;fica relacionada",
		en : "",
		es : ""
	} ],
    'codigo_estat_conexaoTxt' : [ {
		pt : "Conex&atilde;o com o banco de dados",
		en : "",
		es : ""
	} ],
    'esquemadbTxt' : [ {
		pt : "Esquema do banco onde fica a tabela com os dados. Apenas os esquemas configurados previamente no ms_configura s&atilde;o mostrados na lista. Outros esquemas podem ser utilizados, mas &eacute; necess&aacute;rio conhecer o seu nome. A listagem de nomes de tabelas e colunas tamb&eacute;m s&atilde;o restringidas pela lista registrada de esquemas.",
		en : "",
		es : ""
	} ],
    'tabelaTxt' : [ {
		pt : "Tabela que cont&eacute;m os dados",
		en : "",
		es : ""
	} ],
    'colunavalorTxt' : [ {
		pt : "Coluna da tabela que cont&eacute;m os valores",
		en : "",
		es : ""
	} ],
    'colunaidunicoTxt' : [ {
		pt : "Coluna da tabela que cont&eacute;m os identificadores &uacute;nicos de cada registro",
		en : "",
		es : ""
	} ],
    'colunaidgeoTxt' : [ {
		pt : "Coluna da tabela que cont&eacute;m os identificadores da regi&atilde;o geogr&aacute;fica relacionada aos valores",
		en : "",
		es : ""
	} ],
    'filtroTxt1' : [ {
		pt : "Filtro adicional que ser&aacute; inclu&iacute;do na sele&ccedil;&atilde;o dos dados. Utilize a sintaxe SQL, por exemplo: nomedacoluna = 'a' AND nomedacoluna1 = 2 ",
		en : "",
		es : ""
	} ],
    'codigo_unidade_medidaTxt' : [ {
		pt : "Unidade de medida",
		en : "",
		es : ""
	} ],
    'opcoesMedidas' : [ {
		pt : "Opções da medida",
		en : "",
		es : ""
	} ],
    'parametrosTxt' : [ {
		pt : "Par&acirc;metros",
		en : "",
		es : ""
	} ],
    'parametrosDesc' : [ {
		pt : "Os par&acirc;metros s&atilde;o colunas existentes na tabela onde est&atilde;o os valores da medida e que devem ser selecionados pelo usu&aacute;rio, por exemplo, a coluna com valores correspondentes ao ano da medida",
		en : "",
		es : ""
	} ],
    'classificacoesTxt' : [ {
		pt : "Classificações",
		en : "",
		es : ""
	} ],
    'classificacoesDesc' : [ {
		pt : "As classifica&ccedil;&otilde;es definem como os dados ser&atilde;o representados no mapa, especificando os limites de classe e a simbologia",
		en : "",
		es : ""
	} ],
    'classificacoesAjuda' : [ {
		pt : "Uma medida pode ter v&aacute;rias classifica&ccedil;&otilde;es. Primeiro crie a classifica&ccedil;&atilde;o, definindo um nome, e depois crie as classes",
		en : "",
		es : ""
	} ],
    'linksTxt' : [ {
		pt : "Links",
		en : "",
		es : ""
	} ],
    'linksDesc' : [ {
		pt : "Links com informações adicionais sobre os dados ou para aplicativos",
		en : "",
		es : ""
	} ],
    'fontesTxt' : [ {
		pt : "Lista de fontes",
		en : "",
		es : ""
	} ],
    'fontesDesc' : [ {
		pt : "Links para os metadados. A lista de fontes &eacute; controlada por meio do cadastro de fontes.",
		en : "",
		es : ""
	} ],
    'escolhaFonte' : [ {
		pt : "Escolha a fonte",
		en : "",
		es : ""
	} ],
    'nomeParametro' : [ {
		pt : "Nome do par&acirc;metro",
		en : "",
		es : ""
	} ],
    'colunaPar' : [ {
		pt : "Coluna existente na tabela relacionada &agrave; medida e que cont&eacute;m os valores do par&acirc;metro",
		en : "",
		es : ""
	} ],
    'tipoColunaPar' : [ {
		pt : "Tipo do par&acirc;metro",
		en : "",
		es : ""
	} ],
    'id_paiTxt' : [ {
		pt : "Par&acirc;metro de hierarquia superior (pai) que deve ser escolhido primeiro nos formul&aacute;rios (opcional)",
		en : "",
		es : ""
	} ],
    'classesAjuda' : [ {
		pt : "A classifica&ccedil;&atilde;o pode conter uma ou mais classes. Cada classe possu&iacute; um nome, a express&atilde;o que define a classe e a simbologia. Classes podem ser criadas manualmente ou por meio de uma opera&ccedil;&atilde;o de c&aacute;lculo autom&aacute;tico.",
		en : "",
		es : ""
	} ],
    'expressaoTxt' : [ {
		pt : "Expressão que define que valores entram nessa classe, ver detalhes em: <a href=http://mapserver.org/mapfile/expressions.html target=_blank >http://mapserver.org/mapfile/expressions.html</a>",
		en : "",
		es : ""
	} ],
    'azulTxt' : [ {
		pt : "Azul (cor do fundo na composi&ccedil;&atilde;o RGB de 0 e 255)",
		en : "",
		es : ""
	} ],
    'verdeTxt' : [ {
		pt : "Verde (cor do fundo na composi&ccedil;&atilde;o RGB de 0 e 255)",
		en : "",
		es : ""
	} ],
    'vermelhoTxt' : [ {
		pt : "Vermelho (cor do fundo na composi&ccedil;&atilde;o RGB de 0 e 255)",
		en : "",
		es : ""
	} ],
    'tamanhoTxt' : [ {
		pt : "Tamanho em pixels do s&iacute;mbolo, quando definido",
		en : "",
		es : ""
	} ],
    'simboloTxt' : [ {
		pt : "Nome do s&iacute;mbolo utilizado em pontos (conforme c&oacute;digos de s&iacute;mbolos)",
		en : "",
		es : ""
	} ],
    'oazulTxt' : [ {
		pt : "Azul (cor do contorno na composi&ccedil;&atilde;o RGB de 0 e 255)",
		en : "",
		es : ""
	} ],
    'overdeTxt' : [ {
		pt : "Verde (cor do contorno na composi&ccedil;&atilde;o RGB de 0 e 255)",
		en : "",
		es : ""
	} ],
    'overmelhoTxt' : [ {
		pt : "Vermelho (cor do contorno na composi&ccedil;&atilde;o RGB de 0 e 255)",
		en : "",
		es : ""
	} ],
    'otamanhoTxt' : [ {
		pt : "Tamanho em pixels do s&iacute;mbolo do contorno, quando definido",
		en : "",
		es : ""
	} ]

};
