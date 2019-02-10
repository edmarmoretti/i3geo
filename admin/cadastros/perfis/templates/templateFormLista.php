<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_perfil}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_perfil}}');return false;"   class="form-horizontal" role="form"
	method="post"  >
	<div class="row">
		<div class="col-md-12">
			<h4>{{{txtPerfil}}}</h4>
			<div class="form-group form-group-lg">
				<div class="col-md-10">
					<input title="{{{perfil}}}" type="text" value="{{{perfil}}}" class="form-control" name="perfil" required>
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