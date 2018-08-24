<script id="templateClonarTema" type="x-tmpl-mustache">
		<h4>{{{clonaMapfile}}}</h4>
        <h5>{{{codigoAtual}}}</h5>
		<form id="form-modal-adiciona" style="" action="#" onsubmit="i3GEOadmin.mapfile.clona();return false;"   class="form-horizontal" role="form" method="post"   >
			<div class="row">
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="novocodigo" >{{{nomeMap}}}</label>
						<div class="col-md-6">
							<input title="{{{nomeArquivo}}}" type="text" value="" class="form-control" name="novocodigo" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="titulo" >{{{tituloTema}}}</label>
						<div class="col-md-6">
							<input title="{{{tituloTema}}}" type="text" value="" class="form-control" name="titulo" >
						</div>
					</div>
				</div>
				<input type="hidden" value="{{codigoAtual}}" class="form-control" name="codigo" >
			<div class="pull-right">
				<button type="submit" class="btn btn-primary" role="button" style="color:#5F4B8B;">{{criaCopia}}</button>
			</div>
			</div>
		</form>
</script>