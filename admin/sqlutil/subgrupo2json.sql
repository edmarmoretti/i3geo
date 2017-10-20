SELECT json_build_object(
	'subgrupo',array(
		SELECT
			json_build_object(
			'id_n2', n2.id_n2,
			'nome', sub.nome_subgrupo,
			'temas',array_agg(
				json_build_object(
					'id_n3', t.id_tema,
					'nome_tema', t.nome_tema,
					'codigo_tema',t.codigo_tema
				)
			)
		)
		FROM
			public.i3geoadmin_n2 n2
			JOIN public.i3geoadmin_subgrupos sub ON n2.id_subgrupo = sub.id_subgrupo
			JOIN public.i3geoadmin_n3 n3 ON n2.id_n2 = n3.id_n2
			JOIN public.i3geoadmin_temas t ON t.id_tema = n3.id_tema
		WHERE
			id_n1 = 1068
		GROUP BY n2.id_n2,sub.nome_subgrupo
		ORDER BY
		sub.nome_subgrupo ASC
	)
)

Resultado:

{"subgrupo" : [{"id_n2" : 1321, "nome" : "UBS", "temas" : [{"id_n3" : 2237, "nome_tema" : "Obra em ação preparatória", "codigo_tema" : "obras_ubs_3"},{"id_n3" : 2236, "nome_tema" : "Obra concluída sem funcionamento", "codigo_tema" : "obras_ubs_1"},{"id_n3" : 2239, "nome_tema" : "Obra concluída em funcionamento", "codigo_tema" : "obras_ubs_7"},{"id_n3" : 2238, "nome_tema" : "Obra em andamento", "codigo_tema" : "obras_ubs_4"},{"id_n3" : 2236, "nome_tema" : "Obra concluída sem funcionamento", "codigo_tema" : "obras_ubs_1"}]},{"id_n2" : 1320, "nome" : "UPA", "temas" : [{"id_n3" : 2231, "nome_tema" : "Obra concluída sem funcionamento com $ de equipamento", "codigo_tema" : "obras_upa_2"},{"id_n3" : 2232, "nome_tema" : "Obra em ação preparatória", "codigo_tema" : "obras_upa_3"},{"id_n3" : 2233, "nome_tema" : "Obra em andamento", "codigo_tema" : "obras_upa_4"},{"id_n3" : 2234, "nome_tema" : "Obra em funcionamento habilitada em custeio", "codigo_tema" : "obras_upa_5"},{"id_n3" : 2250, "nome_tema" : "Obra civil concluída", "codigo_tema" : "obras_upa_4_"},{"id_n3" : 2235, "nome_tema" : "Obra em funcionamento não habilitada em custeio", "codigo_tema" : "obras_upa_6"},{"id_n3" : 2251, "nome_tema" : "Aguardando pagamento da 3a parcela", "codigo_tema" : "obras_upa_41"},{"id_n3" : 2252, "nome_tema" : "Aquisição de equipamentos e contratação de pessoas", "codigo_tema" : "obras_upa_42"},{"id_n3" : 2253, "nome_tema" : "Aguardando data para entrada em funcionamento", "codigo_tema" : "obras_upa_43"},{"id_n3" : 2230, "nome_tema" : "Obra concluída sem funcionamento", "codigo_tema" : "obras_upa_1"}]}]}
