<script id="templateLista" type="x-tmpl-mustache">
<div class="list-group-item" id="form-{{codigo}}">
	<div class="row-content">
		<h4 class="list-group-item-heading">
			<a href="opcoes/index.php?codigo={{codigo}}&id_tema={{id_tema}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
<!-- utiliza o codigo aqui pois o mapfile pode nao estar no banco -->
			<a title="{{{testaLayer}}}" href="javascript:void(0)" onclick="i3GEOadmin.mapfile.testa('{{codigo}}');" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">gavel</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a title="{{{tituloTxt}}}" href="javascript:void(0)" onclick="i3GEOadmin.mapfile.editarDialogo('{{codigo}}');" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">mode_edit</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>

			<a title="{{{criaCopia}}}" href="javascript:void(0)" onclick="i3GEOadmin.mapfile.clonaDialogo('{{codigo}}')" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons md-18">content_copy</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>

			<a title="{{{excluir}}}" href="javascript:void(0)" onclick="i3GEOadmin.mapfile.excluirDialogo('{{codigo}}')" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons md-18">delete_forever</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>

			<a title="{{{favorito}}}" href="javascript:void(0)" onclick="i3GEOadmin.mapfile.registraFavoritos('{{codigo}}')" class="pull-right btn btn-primary btn-fab btn-fab-mini" role="button">
				<i class="material-icons md-18">star_border</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>

			&nbsp;<div style="min-width:250px;" class="pull-left"><strong>{{{codigo}}}</strong></div> <small> {{{nome}}}</small>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>

</script>