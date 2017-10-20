<script id="templateLista" type="x-tmpl-mustache">
<div class="list-group-item" id="form-{{codigo_estat_conexao}}">
	<div class="row-content" >
		<h4 class="list-group-item-heading {{escondido}}">
			<a href="javascript:void(0)" onclick="{{onEditar}}('{{codigo_estat_conexao}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button" aria-expanded="false" >
				<i class="material-icons md-18">edit</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{codigo_estat_conexao}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">delete_forever</i>
			</a>
			&nbsp;{{{codigo_estat_conexao}}}, db: {{{bancodedados}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
</script>
