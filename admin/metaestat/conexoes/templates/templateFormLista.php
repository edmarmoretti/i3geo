<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{codigo_estat_conexao}}" style="" action="#" onsubmit="{{onSalvar}}('{{codigo_estat_conexao}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="host" >{{{hostTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{hostTxt}}}" type="text" value="{{{host}}}" class="form-control" name="host" required>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="bancodedados" >{{{bancodedadosTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{bancodedadosTxt}}}" type="text" value="{{{bancodedados}}}" class="form-control" name="bancodedados" required>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="porta" >{{{portaTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{portaTxt}}}" type="text" value="{{{porta}}}" class="form-control" name="porta" required>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="usuario" >{{{usuarioTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{usuarioTxt}}}" type="text" value="{{{usuario}}}" class="form-control" name="usuario" required>
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
