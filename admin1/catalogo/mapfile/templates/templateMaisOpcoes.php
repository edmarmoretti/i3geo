<script id="templateMaisOpcoes" type="x-tmpl-mustache">

			<a title="{{{limpaCache}}}" href="javascript:void(0)" onclick="i3GEOadmin.mapfile.limpaCacheDialogo('{{codigo}}')" class="btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">layers_clear</i>
			</a>
			&nbsp;

			<a title="{{{editorTxt}}}" href="javascript:void(0)" onclick="window.open('../../../admin/php/editortexto.php?mapfile={{codigo}}')" class="btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">mode_edit</i>
			</a>
			&nbsp;

			<a title="{{{testaLayer}}}" href="javascript:void(0)" onclick="window.open('../../../testamapfile.php?map={{codigo}}.map')" class="btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">report</i>
			</a>
			&nbsp;

			<a title="{{{editarI3geo}}}" href="javascript:void(0)" onclick="window.open('../../../interface/black_editor.php?&temaEdicao={{codigo}}')" class="btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">settings</i>
			</a>
			&nbsp;
			<a title="{{{testarI3geo}}}" href="javascript:void(0)" onclick="window.open('../../../ms_criamapa.php?temasa={{codigo}}&layers={{codigo}}')" class="btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">sending</i>
			</a>
		</div>
</script>