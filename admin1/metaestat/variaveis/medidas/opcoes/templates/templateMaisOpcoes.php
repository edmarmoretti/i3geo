<script id="templateMaisOpcoes" type="x-tmpl-mustache">
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{parametrosTxt}}}" href="../parametros/index.php?codigo_variavel={{codigo_variavel}}&id_medida_variavel={{id_medida_variavel}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			{{{parametrosTxt}}}
			<span id="helpBlock" class="help-block">
				{{{parametrosDesc}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{classificacoesTxt}}}" href="../classificacoes/index.php?codigo_variavel={{codigo_variavel}}&id_medida_variavel={{id_medida_variavel}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			{{{classificacoesTxt}}}
			<span id="helpBlock" class="help-block">
				{{{classificacoesDesc}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{linksTxt}}}" href="../links/index.php?codigo_variavel={{codigo_variavel}}&id_medida_variavel={{id_medida_variavel}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			{{{linksTxt}}}
			<span id="helpBlock" class="help-block">
				{{{linksDesc}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<div class="list-group-item">
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<a title="{{{fontesTxt}}}" href="../fontes/index.php?codigo_variavel={{codigo_variavel}}&id_medida_variavel={{id_medida_variavel}}" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
				<i class="material-icons  md-18">more_horiz</i>
			</a>
			{{{fontesTxt}}}
			<span id="helpBlock" class="help-block">
				{{{fontesDesc}}}
			</span>
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
</script>
