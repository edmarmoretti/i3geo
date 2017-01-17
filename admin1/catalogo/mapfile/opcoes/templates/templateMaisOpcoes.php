<script id="templateMaisOpcoes" type="x-tmpl-mustache">
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{testaLayer}}}" onclick="i3GEOadmin.opcoesmapfile.testa('{{codigo}}')" href="javascript:void(0)" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">send</i>
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
				<i class="material-icons  md-18">send</i>
			</a>
			{{{testarI3geo}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{editarI3geo}}}" onclick="window.open('../../../../interface/black_editor.php?temaEdicao={{codigo}}')" href="javascript:void(0)" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			{{{editarI3geo}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{editorTxt}}}" href="../editor/index.php?codigo={{codigo}}&id_tema={{id_tema}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
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
				<i class="material-icons  md-18">send</i>
			</a>
			{{{limpaCache}}}
			<span id="helpBlock" class="help-block">
				{{{txtLimpaCache}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{gruposUsuarios}}}" href="../gruposusuarios/index.php?codigo={{codigo}}&id_tema={{id_tema}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			{{{gruposEusuarios}}}
			<span id="helpBlock" class="help-block">
				{{{txtGruposUsuarios}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{disponibilidade}}}" href="../disponibilidade/index.php?codigo={{codigo}}&id_tema={{id_tema}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			{{{disponibilidade}}}
			<span id="helpBlock" class="help-block">
				{{{txtDisponibilidade}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>

</script>
