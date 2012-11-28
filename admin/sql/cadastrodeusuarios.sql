
/* drop tables */

drop table i3geousr_grupotema;
drop table i3geousr_grupousuario;
drop table i3geousr_grupos;
drop table i3geousr_operacoespapeis;
drop table i3geousr_operacoes;
drop table i3geousr_papelusuario;
drop table i3geousr_papeis;
drop table i3geousr_usuarios;




/* create tables */

-- grupos de usuários
create table i3geousr_grupos
(
	-- identificador único do grupo
	id_grupo integer not null unique primary key autoincrement,
	-- nome do grupo
	nome text,
	-- descricao do grupo
	descricao text
);


-- define os grupos que podem utilizar os temas (mapfiles)
create table i3geousr_grupotema
(
	-- identificador único do grupo
	id_grupo integer not null,
	-- código do tema na tabela i3geoadmin_temas
	id_tema integer not null,
	foreign key (id_grupo)
	references i3geousr_grupos (id_grupo)
);


-- cadastro de usuários
create table i3geousr_usuarios
(
	id_usuario integer not null unique primary key autoincrement,
	-- 0 ou 1 indicando se o usuário está ativo ou não
	ativo numeric not null,
	-- data do cadastro do usuário
	data_cadastro text,
	email text,
	-- login do usuário
	login text not null,
	-- nome real do usuário
	nome_usuario text,
	senha text not null
);


create table i3geousr_grupousuario
(
	id_usuario integer not null,
	-- identificador único do grupo
	id_grupo integer not null,
	foreign key (id_grupo)
	references i3geousr_grupos (id_grupo),
	foreign key (id_usuario)
	references i3geousr_usuarios (id_usuario)
);


-- cadastro de operações do sistema
create table i3geousr_operacoes
(
	id_operacao integer not null unique primary key autoincrement,
	-- código da operação
	codigo text,
	descricao text
);


-- cadastro de papéis que permitem definir as operações
create table i3geousr_papeis
(
	id_papel integer not null unique,
	nome text not null unique,
	descricao text
);


create table i3geousr_operacoespapeis
(
	id_operacao integer not null,
	id_papel integer not null,
	foreign key (id_papel)
	references i3geousr_papeis (id_papel),
	foreign key (id_operacao)
	references i3geousr_operacoes (id_operacao)
);


create table i3geousr_papelusuario
(
	id_usuario integer not null,
	id_papel integer not null,
	foreign key (id_papel)
	references i3geousr_papeis (id_papel),
	foreign key (id_usuario)
	references i3geousr_usuarios (id_usuario)
);



