<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_menu}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_menu}}');return false;"   class="form-horizontal"
	role="form" method="post" >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="nome_menu">{{{nomeMenu}}}</label>
				<div class="col-md-7">
					<input title="{{{nomeMenu}}}" type="text" value="{{{nome_menu}}}" class="form-control" name="nome_menu" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="es">{{{nomeEs}}}</label>
				<div class="col-md-7">
					<input title="{{{nomeEs}}}" type="text" value="{{{es}}}" class="form-control" name="es">
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="en">{{{nomeIn}}}</label>
				<div class="col-md-7">
					<input title="{{{nomeIn}}}" type="text" value="{{{en}}}" class="form-control" name="en" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="desc_menu">{{{descricao}}}</label>
				<div class="col-md-7">
					<input title="{{{descricao}}}" type="text" value="{{{desc_menu}}}" class="form-control" name="desc_menu">
				</div>
			</div>

			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="perfil_menu">{{{perfilAjuda}}}</label>
				<div class="col-md-4">
					<input title="{{{perfilAjuda}}}" id="perfil-{{id_menu}}" type="text" value="{{{perfil_menu}}}" class="form-control"
						name="perfil_menu">
				</div>
				<div class="col-md-3">
					<select title="{{{perfilAjuda}}}" class="form-control"
						onchange="i3GEOadmin.menus.addPerfil('perfil-{{id_menu}}',this.value)"> {{{opcoesPerfil}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="publicado_menu">{{{publicadoTxt}}}</label>
				<div class="col-md-7">
					<select title="{{{publicadoTxt}}}" name="publicado_menu" class="form-control" required > {{{opcoesPublicado}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="aberto">{{{iniciaAberto}}}</label>
				<div class="col-md-7">
					<select title="{{{iniciaAberto}}}" name="aberto" class="form-control"> {{{opcoesAberto}}}
					</select>
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