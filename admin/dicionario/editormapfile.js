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
	} ]
};
