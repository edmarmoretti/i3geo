-- i3geousr_usuarios
INSERT INTO i3geousr_usuarios (id_usuario, ativo, data_cadastro, email, login, nome_usuario, senha) VALUES ('1', '0', '', '', 'admingeral', 'administrador do i3geo', 'admingeral');
INSERT INTO i3geousr_usuarios (id_usuario, ativo, data_cadastro, email, login, nome_usuario, senha) VALUES ('2', '1', '', '', 'editor', 'teste de editor', 'editor');
INSERT INTO i3geousr_usuarios (id_usuario, ativo, data_cadastro, email, login, nome_usuario, senha) VALUES ('3', '1', '', '', 'publicador', 'teste de publicador', 'publicador');
INSERT INTO i3geousr_usuarios (id_usuario, ativo, data_cadastro, email, login, nome_usuario, senha) VALUES ('4', '1', '', '', 'editorgeo', 'teste de editor geo', 'editorgeo');
INSERT INTO i3geousr_usuarios (id_usuario, ativo, data_cadastro, email, login, nome_usuario, senha) VALUES ('5', '1', '', '', 'editormetaestat', 'teste de editor do METAESTAT', 'editormetaestat');


-- i3geousr_operacoes
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('1', 'admin/html/editormapfile', 'editor de mapfiles do sistema de administracao');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('2', 'admin/html/operacoes', 'abre o editor de operacoes');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('3', 'teste/', 'teste');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('4', 'admin/html/arvore', 'edicao da arvore do catalogo de temas');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('5', 'admin/html/menus', 'edicao da lista de menus');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('6', 'admin/html/ogcws', 'edicao das preferencias do servico WMS');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('7', 'admin/html/atlas', 'edicao de atlas');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('8', 'admin/html/identifica', 'lista de sistemas incluidos na ferramenta de identificacao');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('9', 'admin/html/incluimap', 'adapta mapfiles antigos para versoes novas do Mapserver');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('10', 'admin/html/mapas', 'lista de links para mapas');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('11', 'admin/html/perfis', 'lista controlada de perfis');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('12', 'admin/html/sistemas', 'lista de sistemas complementares adicionados ao catalogo de camadas');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('13', 'admin/html/subirshapefile', 'upload de shapefile para uma pasta específica no servidor');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('14', 'admin/html/tags', 'lista controlada de tags');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('15', 'admin/html/webservices', 'cadastro de links para webservices');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('16', 'admin/php/editortexto', 'editor de textos para edicao de mapfiles');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('17', 'admin/html/usuarios', 'cadastro de usuarios');
INSERT INTO i3geousr_operacoes (id_operacao, codigo, descricao) VALUES ('18', 'admin/metaestat/geral', 'permite edicoes mais comuns do sistema de metadados estatisticos');


-- i3geousr_operacoespapeis
INSERT INTO i3geousr_operacoespapeis (id_operacao, id_papel) VALUES ('16', '2');
INSERT INTO i3geousr_operacoespapeis (id_operacao, id_papel) VALUES ('1', '2');
INSERT INTO i3geousr_operacoespapeis (id_operacao, id_papel) VALUES ('1', '3');
INSERT INTO i3geousr_operacoespapeis (id_operacao, id_papel) VALUES ('4', '3');
INSERT INTO i3geousr_operacoespapeis (id_operacao, id_papel) VALUES ('5', '3');
INSERT INTO i3geousr_operacoespapeis (id_operacao, id_papel) VALUES ('7', '3');
INSERT INTO i3geousr_operacoespapeis (id_operacao, id_papel) VALUES ('10', '3');
INSERT INTO i3geousr_operacoespapeis (id_operacao, id_papel) VALUES ('13', '2');
INSERT INTO i3geousr_operacoespapeis (id_operacao, id_papel) VALUES ('13', '4');
INSERT INTO i3geousr_operacoespapeis (id_operacao, id_papel) VALUES ('15', '3');
INSERT INTO i3geousr_operacoespapeis (id_operacao, id_papel) VALUES ('18', '1');
INSERT INTO i3geousr_operacoespapeis (id_operacao, id_papel) VALUES ('18', '5');


-- i3geousr_papeis
INSERT INTO i3geousr_papeis (id_papel, nome, descricao) VALUES ('1', 'admin', 'Podem executar qualquer tarefa, inclusive cadastrar novos administradores');
INSERT INTO i3geousr_papeis (id_papel, nome, descricao) VALUES ('2', 'editores', 'Podem criar/editar qualquer tema (mapfile) mas nao podem editar a arvore do catalogo de temas');
INSERT INTO i3geousr_papeis (id_papel, nome, descricao) VALUES ('3', 'publicadores', 'Podem alterar a arvore do catalogo de temas e dos atlas');
INSERT INTO i3geousr_papeis (id_papel, nome, descricao) VALUES ('4', 'editoresgeo', 'Podem editar dados geograficos');
INSERT INTO i3geousr_papeis (id_papel, nome, descricao) VALUES ('5', 'adminmetaestat', 'Podem administrar o sistema METAESTAT');


-- i3geousr_papelusuario
INSERT INTO i3geousr_papelusuario (id_usuario, id_papel) VALUES ('2', '2');
INSERT INTO i3geousr_papelusuario (id_usuario, id_papel) VALUES ('3', '3');
INSERT INTO i3geousr_papelusuario (id_usuario, id_papel) VALUES ('4', '4');
INSERT INTO i3geousr_papelusuario (id_usuario, id_papel) VALUES ('1', '1');
INSERT INTO i3geousr_papelusuario (id_usuario, id_papel) VALUES ('5', '5');


