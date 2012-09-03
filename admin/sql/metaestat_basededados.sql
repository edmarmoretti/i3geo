-- i3geoestat_conexao
INSERT INTO i3geoestat_conexao (codigo_estat_conexao, bancodedados, host, porta, usuario, senha) VALUES ('1', 'dbspo', 'localhost', '5432', 'postgres', 'postgres');
INSERT INTO i3geoestat_conexao (codigo_estat_conexao, bancodedados, host, porta, usuario, senha) VALUES ('0', 'default', '', '', '', '');


-- i3geoestat_tipo_periodo
INSERT INTO i3geoestat_tipo_periodo (codigo_tipo_periodo, nome, descricao) VALUES ('1', 'Anual', '');
INSERT INTO i3geoestat_tipo_periodo (codigo_tipo_periodo, nome, descricao) VALUES ('2', 'Mensal', '');


-- i3geoestat_tipo_regiao
INSERT INTO i3geoestat_tipo_regiao (codigo_tipo_regiao, nome_tipo_regiao, descricao_tipo_regiao, codigo_estat_conexao, esquemadb, tabela, colunageo, data, identificador, colunanomeregiao, srid, colunacentroide) VALUES ('1', 'Município', 'Limites municipais', '1', 'public', 'tb_ibge', 'the_geom', '', 'ibge', 'no_cidade', '4326', 'the_geom2');
INSERT INTO i3geoestat_tipo_regiao (codigo_tipo_regiao, nome_tipo_regiao, descricao_tipo_regiao, codigo_estat_conexao, esquemadb, tabela, colunageo, data, identificador, colunanomeregiao, srid, colunacentroide) VALUES ('3', 'Estados', 'Limites estaduais', '1', 'public', 'tb_ibge_estados', 'the_geom', '', 'co_ibge_uf', 'no_uf', '4326', 'the_geom');


-- i3geoestat_unidade_medida
INSERT INTO i3geoestat_unidade_medida (codigo_unidade_medida, nome, sigla, permitesoma, permitemedia) VALUES ('1', 'Unidade', 'Un', '1', '1');


-- i3geoestat_medida_variavel
INSERT INTO i3geoestat_medida_variavel (id_medida_variavel, codigo_unidade_medida, codigo_tipo_periodo, codigo_variavel, codigo_tipo_regiao, codigo_estat_conexao, esquemadb, tabela, colunavalor, colunaidgeo, filtro, nomemedida) VALUES ('1', '1', '2', '1', '1', '1', 'dbacoes_saude', 'tb_farmacia_pop', 'nu_farm_funcionando', 'co_ibge', '', 'Número de farmácias em funcionamento por mês e ano');


-- i3geoestat_parametro_medida
INSERT INTO i3geoestat_parametro_medida (id_parametro_medida, coluna, nome, descricao, id_pai, id_medida_variavel) VALUES ('1', 'mes_farm_pop', 'mês', '', '2', '1');
INSERT INTO i3geoestat_parametro_medida (id_parametro_medida, coluna, nome, descricao, id_pai, id_medida_variavel) VALUES ('2', 'ano_farm', 'ano', '', '0', '1');


-- i3geoestat_variavel
INSERT INTO i3geoestat_variavel (codigo_variavel, nome, descricao) VALUES ('1', 'Farmácias populares existentes', 'Quantidade de farmácias populares existentes');


-- i3geoestat_classificacao
INSERT INTO i3geoestat_classificacao (id_classificacao, nome, id_medida_variavel, observacao) VALUES ('1', 'Pela média', '1', '');


-- i3geoestat_classes
INSERT INTO i3geoestat_classes (id_classe, expressao, titulo, vermelho, verde, azul, id_classificacao, tamanho, simbolo, overmelho, overde, oazul, otamanho) VALUES ('1', '([nu_farm_funcionando] < 1)', 'Nenhuma', '255', '0', '0', '1', '', '', '0', '0', '0', '');
INSERT INTO i3geoestat_classes (id_classe, expressao, titulo, vermelho, verde, azul, id_classificacao, tamanho, simbolo, overmelho, overde, oazul, otamanho) VALUES ('2', '([nu_farm_funcionando] = 1)', 'Uma', '0', '255', '0', '1', '', '', '', '', '', '');
INSERT INTO i3geoestat_classes (id_classe, expressao, titulo, vermelho, verde, azul, id_classificacao, tamanho, simbolo, overmelho, overde, oazul, otamanho) VALUES ('3', '([nu_farm_funcionando] > 1)', 'Mais de uma', '0', '0', '255', '1', '', '', '', '', '', '');


-- i3geoestat_medida_variavel_link
INSERT INTO i3geoestat_medida_variavel_link (link, id_medida_variavel, nome, id_link) VALUES ('http://portal.saude.gov.br/portal/saude/area.cfm?id_area=1095', '1', 'Site das Fármacias Populares', '1');


-- i3geoestat_fonteinfo_medida
INSERT INTO i3geoestat_fonteinfo_medida (id_medida_variavel, id_fonteinfo) VALUES ('1', '1');


-- i3geoestat_fonteinfo
INSERT INTO i3geoestat_fonteinfo (id_fonteinfo, titulo, link) VALUES ('1', 'Ministério da Saúde', 'http://saude.gov.br');


