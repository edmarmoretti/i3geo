<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_funcao}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_funcao}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="nome_funcao" >{{{nomeTxt}}}</label>
				<div class="col-md-8">
					<input title="{{{nomeTxt}}}" type="text" value="{{{nome_funcao}}}" class="form-control" name="nome_funcao" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="abrir_funcao" >{{{programa}}}</label>
				<div class="col-md-8">
					<input title="{{{programa}}}" type="text" value="{{{abrir_funcao}}}" class="form-control" name="abrir_funcao" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="w_funcao" >{{{largura}}}</label>
				<div class="col-md-8">
					<input title="{{{largura}}}" type="text" value="{{{w_funcao}}}" class="form-control" name="w_funcao" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="h_funcao" >{{{altura}}}</label>
				<div class="col-md-8">
					<input title="{{{altura}}}" type="text" value="{{{h_funcao}}}" class="form-control" name="h_funcao" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-3 control-label" for="perfil_funcao">{{{perfilAjuda}}}</label>
				<div class="col-md-5">
					<input title="{{{perfilAjuda}}}" id="perfil-{{id_funcao}}" type="text" value="{{{perfil_funcao}}}" class="form-control"
					name="perfil_funcao">
				</div>
				<div class="col-md-4">
					<select title="{{{perfilAjuda}}}" class="form-control"
						onchange="i3GEOadmin.funcao.addPerfil('perfil-{{id_funcao}}',this.value)"> {{{opcoesPerfil}}}
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
