SELECT O."codigo", PU."id_usuario"
  FROM
       i3geoadmin_operacoes AS O 
       JOIN i3geoadmin_operacoespapeis AS OP ON O."id_operacao" = OP."id_operacao" 
       JOIN i3geoadmin_papelusuario AS PU ON OP."id_papel" = PU."id_papel"

