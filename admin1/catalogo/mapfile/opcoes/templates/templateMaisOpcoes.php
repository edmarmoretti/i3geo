<script id="templateMaisOpcoes" type="x-tmpl-mustache">
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{gruposUsuarios}}}" href="../gruposusuarios/index.php?codigo={{codigo}}&id_tema={{id_tema}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">sending</i>
			</a>
			{{{gruposUsuarios}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{editarI3geo}}}" onclick="window.open('../../../../interface/black_editor.php?temaEdicao={{codigo}}')" href="javascript:void(0)" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">sending</i>
			</a>
			{{{editarI3geo}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{editorTxt}}}" onclick="window.open('../../../../admin/php/editortexto.php?mapfile={{codigo}}')" href="javascript:void(0)" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">sending</i>
			</a>
			{{{editorTxt}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content">
		<h4 class="list-group-item-heading">
			<a title="{{{limpaCache}}}" onclick="i3GEOadmin.opcoesmapfile.limpaCacheDialogo('{{codigo}}')" href="javascript:void(0)" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">sending</i>
			</a>
			{{{limpaCache}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{testaLayer}}}" onclick="window.open('../../../../testamapfile.php?map={{codigo}}.map')" href="javascript:void(0)" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">sending</i>
			</a>
			{{{testaLayer}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{testarI3geo}}}" onclick="window.open('../../../../ms_criamapa.php?temasa={{codigo}}&layers={{codigo}}')" href="javascript:void(0)" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons">sending</i>
			</a>
			{{{testarI3geo}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
</script>
