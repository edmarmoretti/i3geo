<script id="templateFormRenderizacao" type="x-tmpl-mustache">
<form id="form-edicao-renderizacao" style="" action="#" onsubmit="{{onSalvar}}('{{codigo}}','{{id_tema}}');return false;"   class="form-horizontal" role="form"
	method="post"  >
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="cache">
					{{{cacheTitulo}}}
				</label>
				<p class="small">
					{{{Cache}}} (metadata: CACHE)
				</p>
			</div>
			<div class="col-md-6">
				<select title="{{{cacheTitulo}}}" name="cache" class="form-control" required >
					{{{cache}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="cacheprefixo">
					{{{cacheprefixoTitulo}}}
				</label>
				<p class="small">
					{{{Cacheprefixo}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{cacheprefixoTitulo}}}" type="text" value="{{{cacheprefixo}}}" class="form-control" name="cacheprefixo" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="tiles">
					{{{tilesTitulo}}}
				</label>
				<p class="small">
					{{{Tiles}}} (metadata: TILES)
				</p>
			</div>
			<div class="col-md-6">
				<select title="{{{tilesTitulo}}}" name="tiles" class="form-control" required >
					{{{tiles}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="cortepixels">
					{{{cortepixelsTitulo}}}
				</label>
				<p class="small">
					{{{Cortepixels}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{cortepixelsTitulo}}}" type="text" value="{{{cortepixels}}}" class="form-control" name="cortepixels" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="maxfeatures">
					{{{maxfeaturesTitulo}}}
				</label>
				<p class="small">
					{{{Maxfeatures}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{maxfeaturesTitulo}}}" type="text" value="{{{maxfeatures}}}" class="form-control" name="maxfeatures" >
			</div>
		</div>
	</div>

	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#FF6F61;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>