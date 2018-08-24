<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_sistema}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_sistema}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="nome_sistema" >{{{sistema}}}</label>
				<div class="col-md-8">
					<input title="{{{nome_sistema}}}" type="text" value="{{{nome_sistema}}}" class="form-control" name="nome_sistema" required>
				</div>
			</div>

			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="publicado_sistema">{{{publicado}}}</label>
				<div class="col-md-8">
					<select title="{{{publicado}}}" name="publicado_sistema" class="form-control" required >
						{{{opcoesPublicado}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-3 control-label" for="perfil_sistema">{{{perfilAjuda}}}</label>
				<div class="col-md-5">
					<input title="{{{perfilAjuda}}}" id="perfil-{{id_sistema}}" type="text" value="{{{perfil_sistema}}}" class="form-control"
					name="perfil_sistema">
				</div>
				<div class="col-md-4">
					<select title="{{{perfilAjuda}}}" class="form-control"
						onchange="i3GEOadmin.sistemas.addPerfil('perfil-{{id_sistema}}',this.value)"> {{{opcoesPerfil}}}
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
