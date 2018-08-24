<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_fonteinfo}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_fonteinfo}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="titulo" >{{{tituloTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{tituloTxt}}}" type="text" value="{{{titulo}}}" class="form-control" name="titulo" required>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="link" >URI</label>
				<div class="col-md-10">
					<input title="URI" type="text" value="{{{link}}}" class="form-control" name="link" required>
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
