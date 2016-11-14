<script id="templateLista" type="x-tmpl-mustache">
<div class="list-group-item" id="form-{{id_subgrupo}}">
	<div class="row-content">
		<h4 class="list-group-item-heading {{escondido}}">
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onEditar}}('{{id_subgrupo}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">edit</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_subgrupo}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">delete_forever</i>
			</a>
			<span class="nomeitem">
				<i class="material-icons move" style="color: gray; display:none;position:absolute;left:-5px;">swap_vert</i>
				&nbsp;{{{nome_subgrupo}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
</script>