<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{codigo_unidade_medida}}" style="" action="#" onsubmit="{{onSalvar}}('{{codigo_unidade_medida}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="nome" >{{{nomeTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{nomeTxt}}}" type="text" value="{{{nome}}}" class="form-control" name="nome" required>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="sigla" >{{{siglaTxt}}}</label>
				<div class="col-md-10">
					<input title="{{{siglaTxt}}}" type="text" value="{{{sigla}}}" class="form-control" name="sigla" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="permitesoma" >{{{permitesomaTxt}}}</label>
				<div class="col-md-10">
					<select title="{{{permitesomaTxt}}}" name="permitesoma" class="form-control"> {{{opcoesSoma}}}
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="permitemedia" >{{{permitemediaTxt}}}</label>
				<div class="col-md-10">
					<select title="{{{permitemediaTxt}}}" name="permitemedia" class="form-control"> {{{opcoesMedia}}}
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
