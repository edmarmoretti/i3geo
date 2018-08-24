<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_subgrupo}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_subgrupo}}');return false;"   class="form-horizontal" role="form"
	method="post"  >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="nome">{{{nomeTxt}}} (Pt)</label>
				<div class="col-md-10">
					<input title="{{{nomeTxt}}}" type="text" value="{{{nome_subgrupo}}}" class="form-control" name="nome_subgrupo" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="desc_grupo">{{{descricaoTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{descricaoTxt}}}" type="text" value="{{{desc_subgrupo}}}" class="form-control" name="desc_subgrupo" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="es">Es</label>
					<div class="col-md-10">
						<input title="Espanhol" type="text" value="{{{es}}}" class="form-control" name="es" >
					</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="en">En</label>
				<div class="col-md-10">
					<input title="Ingles" type="text" value="{{{en}}}" class="form-control" name="en" >
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