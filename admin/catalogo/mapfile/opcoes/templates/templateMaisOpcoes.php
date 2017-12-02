<script id="templateMaisOpcoes" type="x-tmpl-mustache">
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{conexaoLocal}}}" href="../conexao/local/index.php?codigo={{codigo}}&id_tema={{id_tema}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			{{{conexaoLocal}}}
			<span id="helpBlock" class="help-block">
				{{{conexaoLayerLocal}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{conexaoOgc}}}" href="../conexao/ogc/index.php?codigo={{codigo}}&id_tema={{id_tema}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			{{{conexaoOgc}}}
			<span id="helpBlock" class="help-block">
				{{{conexaoLayerOgc}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{testaLayer}}}" onclick="i3GEOadmin.opcoesmapfile.testa('{{codigo}}')" href="javascript:void(0)" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">gavel</i>
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
				<i class="material-icons  md-18">gavel</i>
			</a>
			{{{testarI3geo}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{editarI3geo}}}" onclick="window.open('../../../../admin/black_editor.php?temaEdicao={{codigo}}&mapext={{mapext}}')" href="javascript:void(0)" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">map</i>
			</a>
			{{{editarI3geo}}}
			<span id="helpBlock" class="help-block">
				{{{txtEditarI3geo}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{editorTxt}}}" href="../editor/index.php?codigo={{codigo}}&id_tema={{id_tema}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">mode_edit</i>
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
				<i class="material-icons  md-18">clear_all</i>
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
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{comportamentoLayer}}}" href="../comportamento/index.php?codigo={{codigo}}&id_tema={{id_tema}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			{{{comportamentoLayer}}}
			<span id="helpBlock" class="help-block">
				{{{txtComportamentoLayer}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{cdados}}}" href="../cdados/index.php?codigo={{codigo}}&id_tema={{id_tema}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			{{{cdados}}}
			<span id="helpBlock" class="help-block">
				{{{txtCdados}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{renderizacao}}}" href="../renderizacao/index.php?codigo={{codigo}}&id_tema={{id_tema}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			{{{renderizacao}}}
			<span id="helpBlock" class="help-block">
				{{{txtRenderizacao}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{editavel}}}" href="../editavel/index.php?codigo={{codigo}}&id_tema={{id_tema}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			{{{editavelOptTitulo}}}
			<span id="helpBlock" class="help-block">
				{{{editavelOpt}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>

</script>
