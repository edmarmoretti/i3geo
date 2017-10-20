<script id="templateLista" type="x-tmpl-mustache">
<div class="list-group-item" id="form-{{id_medida_variavel}}">
	<div class="row-content" >
		<h4 class="list-group-item-heading {{escondido}}">
			<div class="pull-right">
			<a role="button" class="btn btn-danger btn-fab btn-fab-mini pull-left" onclick="i3GEOadmin.medidas.editarOpcoes('{{id_medida_variavel}}')" href="javascript:void(0)">
				<i class="material-icons md-18">more_horiz</i>
			</a>
			</div>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onEditar}}('{{id_medida_variavel}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button" aria-expanded="false" >
				<i class="material-icons md-18">edit</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_medida_variavel}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">delete_forever</i>
			</a>
			&nbsp;{{{nomemedida}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
</script>
