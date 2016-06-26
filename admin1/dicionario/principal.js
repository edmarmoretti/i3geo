//+$trad(1,i3GEOadmin.principal.dicionario)+
i3GEOadmin.principal = {};
i3GEOadmin.principal.dicionario = {
	'atencao' : [ {
		pt : "Aten&ccedil;&atilde;o: o sistema de administra&ccedil;&atilde;o n&atilde;o funciona corretamente com o navegador Internet Explorer.",
		en : "",
		es : ""
	} ],
    'adminI3geo' : [ {
		pt : "Administra&ccedil;&atilde;o do i3geo",
		en : "",
		es : ""
	} ],
    'msgVerMapserv' : [ {
		pt : "Se voc&ecirc; atualizou o Mapserver para a vers&atilde;o 5.2.2, seus mapfiles antigos podem n&atilde;o funcionar. Veja em	'Outras op&ccedil;&otilde;es' o item 'Ajusta mapfiles'.",
		en : "",
		es : ""
	} ],
    'msgCadastraUsr' : [ {
		pt : "Para informa&ccedil;&otilde;es sobre cadastro de usu&aacute;rios veja o t&oacute;pico espec&iacute;fico no manual.",
		en : "",
		es : ""
	} ],
    'manualAdmin' : [ {
		pt : "Manual do sistema de administra&ccedil;&atilde;o",
		en : "",
		es : ""
	} ],
    'msgSqlite' : [ {
		pt : "Se vc est&aacute; usando o banco de dados SQLITE, voc&ecirc; pode acessar	diretamente as tabelas por meio de formul&aacute;rios ",
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
		pt : "<p>Entre uma vers&atilde;o e outra do i3Geo o banco de dados de administra&ccedil;&atilde;o pode sofrer altera&ccedil;&otilde;es. Consulte o documento i3geo/guia_de_migracao.txt para verificar os detalhes.</p> <p>Antes da vers&atilde;o 4.0 o i3geo utilizava arquivos armazenados em disco (arquivos XML) para configurar as	&aacute;rvores de adi&ccedil;&atilde;o de camadas, listagens de	endere&ccedil;os, lista de mapas, etc. Com a nova estrutura de	administra&ccedil;&atilde;o, esses arquivos foram substitu&iacute;dos por registros em bancos de dados.</p><p>Para possibilitar a distribui&ccedil;&atilde;o do i3geo de forma independente de banco de dados, optou-se pelo uso do	gerenciador SQLITE, cujo arquivo com os dados fica armazenado em i3geo/admin/admin.db. Os programas em PHP que gerenciam esse banco	utilizam o pacote PDO, possibilitando que seja utilizado outro gerenciador, como o POSTGRESQL, entre outros.</p><p>Para modificar a configura&ccedil;&atilde;o do PDO, e utilizar outro gerenciador, deve-se editar o arquivo i3geo/admin/conexao.php ou ent&atilde;o alterar a vari&aacute;vel	de configura&ccedil;&atilde;o, definida no ms_configura.php, chamada $conexaoadmin. Essa vari&aacute;vel indica o nome de um programa em PHP que ser&aacute; inclu&iacute;do nos programas que fazem acesso ao banco de dados de administra&ccedil;&atilde;o. Um exemplo de conex&atilde;o em PHP pode ser visto em	i3geo/admin/php/conexaomma.php.</p><p>Para usar um gerenciador diferente do SQLITE &eacute;	necess&aacute;rio criar as tabelas no novo banco de dados. Os sqls	para essa cria&ccedil;&atilde;o podem ser obtidos no item 'Outras op&ccedil;&otilde;es.</p><p>O SQLITE usa um arquivo em disco. Em sistemas Linux principalmente, verifique as permiss&otilde;es de acesso caso ocorram	probelmas de escrita no banco.",
		en : "",
		es : ""
	} ],
    'msgIe' : [ {
		pt : "<p style='color: red'>Aten&ccedil;&atilde;o: o sistema de	administra&ccedil;&atilde;o funciona melhor no Firefox.</p><p>No Internet Explorer, vc deve alterar as configura&ccedil;&otilde;es	de armazenamento de 'cache' para n&atilde;o ter problemas.</p><p>No menu 'Ferramentas - Op&ccedil;&otilde;es da Internet - Geral'	clique em 'Configura&ccedil;&otilde;es' no item 'Hist&oacute;rico de	navega&ccedil;&atilde;o'</p><p>Marque a op&ccedil;&atilde;o 'Sempre que eu visitar a	p&aacute;gina da web'</p>",
		en : "",
		es : ""
	} ]
        
};
