<script id="templateLista" type="x-tmpl-mustache">
<div class="list-group-item" id="form-{{codigo}}">
	<div class="row-content">
		<h4 class="list-group-item-heading">
			<a href="javascript:void(0)" onclick="i3GEOadmin.mapfile.maisOpcoesDialogo('{{codigo}}');" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			<span class="pull-right">&nbsp;&nbsp;</span>
<!-- utiliza o codigo aqui pois o mapfile pode nao estar no banco -->
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

			&nbsp;<strong>{{{nome}}}</strong> <small> {{{arquivoTxt}}}:</small> {{{codigo}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>

</script>