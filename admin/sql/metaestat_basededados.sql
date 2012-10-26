-- i3geoestat_conexao
INSERT INTO i3geoestat_conexao (codigo_estat_conexao, bancodedados, host, porta, usuario, senha) VALUES ('1', 'geosaude', 'localhost', '5432', 'postgres', 'postgres');
INSERT INTO i3geoestat_conexao (codigo_estat_conexao, bancodedados, host, porta, usuario, senha) VALUES ('0', 'i3geo_metaestat', 'localhost', '5432', 'postgres', 'postgres');


-- i3geoestat_tipo_periodo
INSERT INTO i3geoestat_tipo_periodo (codigo_tipo_periodo, nome, descricao) VALUES ('1', 'Anual', '');
INSERT INTO i3geoestat_tipo_periodo (codigo_tipo_periodo, nome, descricao) VALUES ('2', 'Mensal', '');
INSERT INTO i3geoestat_tipo_periodo (codigo_tipo_periodo, nome, descricao) VALUES ('3', 'Diário', '');
INSERT INTO i3geoestat_tipo_periodo (codigo_tipo_periodo, nome, descricao) VALUES ('4', 'Horário', '');


-- i3geoestat_tipo_regiao
INSERT INTO i3geoestat_tipo_regiao (codigo_tipo_regiao, nome_tipo_regiao, descricao_tipo_regiao, codigo_estat_conexao, esquemadb, tabela, colunageo, data, identificador, colunanomeregiao, srid, colunacentroide, colunasvisiveis) VALUES ('2', 'Município', 'Limites municipais', '1', 'i3geo_metaestat', 'municipios', 'the_geom', '2010', 'co_municipio', 'no_cidade', '4326', 'the_geom2', 'co_municipio,no_cidade,co_uf,area_territorial,nu_ano_instalacao');
INSERT INTO i3geoestat_tipo_regiao (codigo_tipo_regiao, nome_tipo_regiao, descricao_tipo_regiao, codigo_estat_conexao, esquemadb, tabela, colunageo, data, identificador, colunanomeregiao, srid, colunacentroide, colunasvisiveis) VALUES ('3', 'Estado', 'Limites estaduais', '1', 'i3geo_metaestat', 'uf', 'the_geom', '2010', 'co_uf', 'no_uf', '4326', 'the_geom', 'co_uf,sg_uf,no_uf,no_regiao');
INSERT INTO i3geoestat_tipo_regiao (codigo_tipo_regiao, nome_tipo_regiao, descricao_tipo_regiao, codigo_estat_conexao, esquemadb, tabela, colunageo, data, identificador, colunanomeregiao, srid, colunacentroide, colunasvisiveis) VALUES ('1', 'Bairro', 'Limites de bairros', '1', 'i3geo_metaestat', 'bairros', 'the_geom', '2010', 'co_bairro', 'no_bairro', '4326', 'the_geom', 'co_bairro,no_bairro,no_distr,no_municip');


-- i3geoestat_unidade_medida
INSERT INTO i3geoestat_unidade_medida (codigo_unidade_medida, nome, sigla, permitesoma, permitemedia) VALUES ('1', 'Quantidade', 'Un', '1', '1');


-- i3geoestat_medida_variavel
INSERT INTO i3geoestat_medida_variavel (id_medida_variavel, codigo_unidade_medida, codigo_tipo_periodo, codigo_variavel, codigo_tipo_regiao, codigo_estat_conexao, esquemadb, tabela, colunavalor, colunaidgeo, filtro, nomemedida, colunaidunico) VALUES ('1', '1', '2', '1', '2', '1', 'dbdemografia', 'tb_demografia', 'nu_populacao', 'co_ibge', '', 'População residente', '');


-- i3geoestat_parametro_medida
INSERT INTO i3geoestat_parametro_medida (id_parametro_medida, coluna, nome, descricao, id_pai, id_medida_variavel, tipo) VALUES ('1', 'nu_ano', 'ano', '', '0', '1', '1');


-- i3geoestat_variavel
INSERT INTO i3geoestat_variavel (codigo_variavel, nome, descricao) VALUES ('1', 'População', 'Caracterização da população');


-- i3geoestat_classificacao
INSERT INTO i3geoestat_classificacao (id_classificacao, nome, id_medida_variavel, observacao) VALUES ('1', 'Intervalos aleatórios', '1', '');


-- i3geoestat_classes
INSERT INTO i3geoestat_classes (id_classe, expressao, titulo, vermelho, verde, azul, id_classificacao, tamanho, simbolo, overmelho, overde, oazul, otamanho) VALUES ('1', '([nu_populacao]<=6379.5)', '<= 6379.5', '255', '250', '250', '1', '', '', '', '', '', '');
INSERT INTO i3geoestat_classes (id_classe, expressao, titulo, vermelho, verde, azul, id_classificacao, tamanho, simbolo, overmelho, overde, oazul, otamanho) VALUES ('2', '(([nu_populacao]>6379.5)and([nu_populacao]<=12157))', '> 6379.5 e <= 12157', '255', '230', '230', '1', '', '', '', '', '', '');
INSERT INTO i3geoestat_classes (id_classe, expressao, titulo, vermelho, verde, azul, id_classificacao, tamanho, simbolo, overmelho, overde, oazul, otamanho) VALUES ('3', '(([nu_populacao]>12157)and([nu_populacao]<=22861.5))', '> 12157 e <= 22861.5', '255', '150', '150', '1', '', '', '', '', '', '');
INSERT INTO i3geoestat_classes (id_classe, expressao, titulo, vermelho, verde, azul, id_classificacao, tamanho, simbolo, overmelho, overde, oazul, otamanho) VALUES ('4', '([nu_populacao]>22861.5)', '> 22861.5', '255', '0', '0', '1', '', '', '', '', '', '');


-- i3geoestat_medida_variavel_link
INSERT INTO i3geoestat_medida_variavel_link (link, id_medida_variavel, nome, id_link) VALUES ('http://portal.saude.gov.br/portal/saude/area.cfm?id_area=1095', '1', 'Site das Fármacias Populares', '1');


-- i3geoestat_fonteinfo_medida
INSERT INTO i3geoestat_fonteinfo_medida (id_medida_variavel, id_fonteinfo) VALUES ('1', '1');


-- i3geoestat_fonteinfo
INSERT INTO i3geoestat_fonteinfo (id_fonteinfo, titulo, link) VALUES ('1', 'Ministério da Saúde', 'http://saude.gov.br');


-- i3geoestat_agregaregiao
INSERT INTO i3geoestat_agregaregiao (id_agregaregiao, codigo_tipo_regiao, codigo_tipo_regiao_pai, colunaligacao_regiaopai) VALUES ('1', '1', '2', 'co_municipio');
INSERT INTO i3geoestat_agregaregiao (id_agregaregiao, codigo_tipo_regiao, codigo_tipo_regiao_pai, colunaligacao_regiaopai) VALUES ('2', '2', '3', 'co_uf');


