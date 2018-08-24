<script id="templateFormDisponibilidade" type="x-tmpl-mustache">
<form id="form-edicao-disponibilidade" style="" action="#" onsubmit="{{onSalvar}}('{{codigo}}','{{id_tema}}');return false;"   class="form-horizontal" role="form"
	method="post"  >
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="download">
					{{{permiteDownloadTitulo}}}
				</label>
				<p class="small">
					{{{permiteDownload}}} (metadata: DOWNLOAD)
				</p>
			</div>
			<div class="col-md-6">
				<select title="{{{permiteDownloadTitulo}}}" name="download" class="form-control" required >
					{{{download}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="permitedownload">
					{{{permiteDownload2}}}
				</label>
				<p class="small">
					(metadata: PERMITEDOWNLOAD)
				</p>
			</div>
			<div class="col-md-6">
				<select name="permitedownload" class="form-control" required >
					{{{permitedownload}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="permiteogc">
					{{{permiteOgc2}}}
				</label>
				<p class="small">
					(metadata: PERMITEOGC)
				</p>
			</div>
			<div class="col-md-6">
				<select name="permiteogc" class="form-control" required >
					{{{permiteogc}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="permitekml">
					{{{permiteKml}}}
				</label>
				<p class="small">
					(metadata: PERMITEKML)
				</p>
			</div>
			<div class="col-md-6">
				<select name="permitekml" class="form-control" required >
					{{{permitekml}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="permitekmz">
					{{{permiteKmz}}}
				</label>
				<p class="small">
					(metadata: PERMITEKMZ)
				</p>
			</div>
			<div class="col-md-6">
				<select name="permitekmz" class="form-control" required >
					{{{permitekmz}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="arquivodownload">
					{{{enderecoTitulo}}}
				</label>
				<p class="small">
					{{{endereco}}} (metadata: ARQUIVODOWNLOAD)
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{enderecoTitulo}}}" type="text" value="{{{arquivodownload}}}" class="form-control" name="arquivodownload" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="arquivokmz">
					{{{arquivoKmzTitulo}}}
				</label>
				<p class="small">
					{{{arquivoKmz}}} (metadata: ARQUIVOKMZ)
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{arquivoKmzTitulo}}}" type="text" value="{{{arquivokmz}}}" class="form-control" name="arquivokmz" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="description_template">
					{{{descriptiontemplateTitulo}}}
				</label>
				<p class="small">
					{{{descriptiontemplate}}} (metadata: description_template)
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{arquivoKmzTitulo}}}" type="text" value="{{{description_template}}}" class="form-control" name="description_template" >
			</div>
		</div>
	</div>
	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#5F4B8B;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>