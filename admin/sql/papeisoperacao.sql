SELECT P."id_papel", P."nome", P."descricao", OP."id_operacao"
  FROM
       I3GEOADMIN_OPERACOES AS O JOIN I3GEOADMIN_OPERACOESPAPEIS AS OP ON O."id_operacao" = OP."id_operacao" JOIN I3GEOADMIN_PAPEIS AS P ON OP."id_papel" = P."id_papel"
