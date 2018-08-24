<script id="templateFormCdados" type="x-tmpl-mustache">
<form id="form-edicao-cdados" style="" action="#" onsubmit="{{onSalvar}}('{{codigo}}','{{id_tema}}');return false;"   class="form-horizontal" role="form"
	method="post"  >
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="escala">
					{{{escalaTitulo}}}
				</label>
				<p class="small">
					{{{Escala}}} (metadata: ESCALA)
				</p>
			</div>
			<div class="col-md-6">
				<input type="text" value="{{{escala}}}" class="form-control" name="escala" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="extensao">
					{{{extenTitulo}}}
				</label>
				<p class="small">
					{{{exten}}} (metadata: EXTENSAO)
				</p>
			</div>
			<div class="col-md-6">
				<input type="text" value="{{{extensao}}}" class="form-control" name="extensao" >
				<div class="pull-right">
					<button onclick="i3GEOadmin.cdados.calcularExtensao('{{codigo}}','{{id_tema}}');return false;" class="btn btn-primary" role="button" style="color:#5F4B8B;">{{calcular}}</button>
				</div>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="encoding">
					{{{tituloEncoding}}}
				</label>
				<p class="small">
					{{{txtEncoding}}}
				</p>
			</div>
			<div class="col-md-6">
				<input type="text" value="{{{encoding}}}" class="form-control" name="encoding" >
			</div>
		</div>
	</div>

	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#5F4B8B;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>