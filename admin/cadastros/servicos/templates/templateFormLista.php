<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_ws}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_ws}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<h4>{{{nome_ws}}}</h4>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="nome_ws" >{{{nomeTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{nomeTxt}}}" type="text" value="{{{nome_ws}}}" class="form-control" name="nome_ws" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="desc_ws">{{{descricaoTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{descricaoTxt}}}" type="text" value="{{{desc_ws}}}" class="form-control" name="desc_ws" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="autor_ws">{{{autor}}}</label>
				<div class="col-md-10">
					<input title="{{{autor}}}" type="text" value="{{{autor_ws}}}" class="form-control" name="autor_ws" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="link_ws">{{{endereco}}}</label>
				<div class="col-md-10">
					<input title="{{{endereco}}}" type="text" value="{{{link_ws}}}" class="form-control" name="link_ws">
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="tipo_ws">{{{tipo}}}</label>
				<div class="col-md-10">
					<select title="{{{tipo}}}" name="tipo_ws" class="form-control">
						{{{opcoesTipo}}}
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#5F4B8B;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
    <h5 class='alert alert-info'>
		{{{ajudawmstime}}}
	</h5>
</form>
</script>
