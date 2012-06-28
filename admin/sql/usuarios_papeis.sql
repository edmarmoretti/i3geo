SELECT i3geoadmin_usuarios."id_usuario", i3geoadmin_usuarios."nome_usuario",
  i3geoadmin_usuarios."data_cadastro", i3geoadmin_usuarios."email", i3geoadmin_papeis.id_papel
  FROM
       i3geoadmin_usuarios JOIN i3geoadmin_papelusuario ON 
       i3geoadmin_usuarios."id_usuario" = i3geoadmin_papelusuario."id_usuario" 
       JOIN i3geoadmin_papeis ON i3geoadmin_papelusuario."id_papel" = i3geoadmin_papeis."id_papel"
