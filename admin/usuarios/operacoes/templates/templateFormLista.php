<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_operacao}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_operacao}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-4" >
			<h4> {{{papeisv}}}</h4>
			<div class="form-group form-group-lg" style="padding-left:5px;">{{{inputPapeis}}}</div>
		</div>
		<div class="col-md-8">
			<h4>{{{operacao}}}</h4>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="codigo">{{{labelCodigo}}}</label>
				<div class="col-md-10">
					<input title="{{{labelCodigo}}}" type="text" value="{{{codigo}}}" class="form-control" name="codigo" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="descricao">{{{labelDescricao}}}</label>
				<div class="col-md-10">
					<input title="{{{labelDescricao}}}" type="text" value="{{{descricao}}}" class="form-control" name="descricao" >
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
