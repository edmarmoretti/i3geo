<script id="templateNos" type="x-tmpl-mustache">
<div class="list-group-item" data-id="{{id_n1}}" id="formNo-{{id_n1}}">
	<div class="row-content">
		<h4 class="list-group-item-heading {{escondido}}">
			<div class="pull-right">
			<a role="button" class="btn btn-danger btn-fab btn-fab-mini pull-left" onclick="i3GEOadmin.grupos.editarSubGrupos('{{id_n1}}','{{{nome_grupo}}}')" href="javascript:void(0)">
				<i class="material-icons md-18">folder_open</i>
			</a>
  			<label class=pull-right><h6 style="margin-top: 5px; margin-bottom: 5px;">&nbsp;{{{editarSubgrupos}}}</h6></label>
			</div>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onEditar}}('{{id_n1}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">edit</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)" onclick="{{onExcluir}}('{{id_n1}}')" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">delete_forever</i>
			</a>
			<span class="nomeitem">
				<i class="material-icons move" style="color: gray; display:none;position:absolute;left:-5px;">swap_vert</i>
				{{{nome_grupo}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
</script>