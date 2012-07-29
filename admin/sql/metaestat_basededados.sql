-- i3geoestat_conexao
INSERT INTO i3geoestat_conexao (codigo_estat_conexao, bancodedados, host, porta, usuario, senha) VALUES ('1', 'dbspo', 'localhost', '5432', 'postgres', 'postgres');


-- i3geoestat_tipo_periodo
INSERT INTO i3geoestat_tipo_periodo (codigo_tipo_periodo, nome, descricao) VALUES ('1', 'Anual', '');
INSERT INTO i3geoestat_tipo_periodo (codigo_tipo_periodo, nome, descricao) VALUES ('2', 'Mensal', '');


-- i3geoestat_tipo_regiao
INSERT INTO i3geoestat_tipo_regiao (codigo_tipo_regiao, nome_tipo_regiao, descricao_tipo_regiao, codigo_estat_conexao, esquemadb, tabela, colunageo, data, identificador, colunanomeregiao, srid) VALUES ('1', 'Município', 'Limites municipais', '1', 'public', 'tb_ibge', 'the_geom', '', 'ibge', 'no_cidade', '4326');


-- i3geoestat_unidade_medida
INSERT INTO i3geoestat_unidade_medida (codigo_unidade_medida, nome, sigla, permitesoma, permitemedia) VALUES ('1', 'Unidade', 'Un', '', '');


-- i3geoestat_medida_variavel
INSERT INTO i3geoestat_medida_variavel (id_medida_variavel, codigo_unidade_medida, codigo_tipo_periodo, codigo_variavel, codigo_tipo_regiao, codigo_estat_conexao, esquemadb, tabela, colunavalor, colunaidgeo, filtro, nomemedida) VALUES ('1', '1', '2', '1', '1', '1', 'dbacoes_saude', 'tb_farmacia_pop', 'nu_farm_funcionando', 'co_ibge', '', 'Número de farmácias em funcionamento por mês e ano');


-- i3geoestat_dimensao_medida
INSERT INTO i3geoestat_dimensao_medida (id_dimensao_medida, coluna, nomedimensao, descricao, agregavalores, id_medida_variavel) VALUES ('1', "to_date(mes_farm_pop||' '||ano_farm,'MM YYYY') as mes", 'mês e ano', '', '0', '1');
INSERT INTO i3geoestat_dimensao_medida (id_dimensao_medida, coluna, nomedimensao, descricao, agregavalores, id_medida_variavel) VALUES ('2', 'ano_farm', 'ano', '', '1', '1');


-- i3geoestat_variavel
INSERT INTO i3geoestat_variavel (codigo_variavel, nome, descricao) VALUES ('1', 'Farmácias populares existentes', 'Quantidade de farmácias populares existentes');


