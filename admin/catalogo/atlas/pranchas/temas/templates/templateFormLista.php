<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_tema}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_tema}}','{{{codigo_tema}}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="codigo_tema" >{{{codigoTema}}}</label>
				<div class="col-md-8">
					<select title="{{{codigoTema}}}" name="codigo_tema" class="form-control">
						{{{opcoesTema}}}
					</select>
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ordem_tema" >{{{ordem}}}</label>
				<div class="col-md-8">
					<input title="{{{ordem}}}" type="text" value="{{{ordem_tema}}}" class="form-control" name="ordem_tema" required >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ligado_tema" >{{{temaVisivel}}}</label>
				<div class="col-md-8">
					<select title="{{{temaVisivel}}}" name="ligado_tema" class="form-control" required >
						{{{opcoesLigado}}}
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#5F4B8B;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>