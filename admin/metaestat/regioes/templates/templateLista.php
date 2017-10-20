<script id="templateLista" type="x-tmpl-mustache">
<div class="list-group-item" id="form-{{codigo_tipo_regiao}}">
	<div class="row-content" >
		<h4 class="list-group-item-heading {{escondido}}">
			<div class="pull-right">
			<a role="button" class="btn btn-danger btn-fab btn-fab-mini pull-left" onclick="i3GEOadmin.regioes.editarHierarquia('{{codigo_tipo_regiao}}')" href="javascript:void(0)">
				<i class="material-icons md-18">device_hub</i>
			</a>
  			<label class=pull-right><h6 style="margin-top: 5px; margin-bottom: 5px;">&nbsp;{{{hierarquia}}}</h6></label>
			</div>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onEditar}}('{{codigo_tipo_regiao}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button" aria-expanded="false" >
				<i class="material-icons md-18">edit</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{codigo_tipo_regiao}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">delete_forever</i>
			</a>
			&nbsp;{{{nome_tipo_regiao}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
</script>
