<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_grupo}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_grupo}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-4" style="max-height: 230px; overflow-y: auto;">
			<h4> {{{usuariosv}}}</h4>
			<div class="form-group form-group-lg" style="padding-left:5px;">{{{inputUsuarios}}}</div>
		</div>
		<div class="col-md-8">
			<h4>{{{grupo}}}</h4>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="nome" >{{{nomeTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{nomeTxt}}}" type="text" value="{{{nome}}}" class="form-control" name="nome" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="login">{{{descricaoTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{descricaoTxt}}}" type="text" value="{{{descricao}}}" class="form-control" name="descricao">
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
