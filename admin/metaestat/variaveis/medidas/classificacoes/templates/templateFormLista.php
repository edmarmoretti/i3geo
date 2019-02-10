<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_classificacao}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_classificacao}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="control-label" for="nome" >{{{nomeTxt}}}</label>
				<div>
					<input title="{{{nomeTxt}}}" type="text" value="{{{nome}}}" class="form-control" name="nome" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="control-label" for="link" >{{{descricaoTxt}}}</label>
				<div>
					<input title="{{{descricaoTxt}}}" type="text" value="{{{observacao}}}" class="form-control" name="observacao" >
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
