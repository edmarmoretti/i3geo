<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_grupo}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_grupo}}');return false;"   class="form-horizontal" role="form"
	method="post"  >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="nome">{{{nomeTxt}}} (Pt)</label>
				<div class="col-md-10">
					<input title="{{{nomeTxt}}}" type="text" value="{{{nome_grupo}}}" class="form-control" name="nome_grupo" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="desc_grupo">{{{descricaoTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{descricaoTxt}}}" type="text" value="{{{desc_grupo}}}" class="form-control" name="desc_grupo" >
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
		<button type="submit" class="btn btn-primary" role="button" style="color:#FF6F61;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>