<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_link}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_link}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="control-label" for="nomemedida" >{{{nomeTxt}}}</label>
				<div>
					<input title="{{{nomeTxt}}}" type="text" value="{{{nome}}}" class="form-control" name="nome" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="control-label" for="link" >Link</label>
				<div>
					<input title="URI" type="text" value="{{{link}}}" class="form-control" name="link" >
				</div>
			</div>
		</div>
	</div>
	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#FF6F61;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>
