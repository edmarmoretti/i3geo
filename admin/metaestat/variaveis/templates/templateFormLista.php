<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{codigo_variavel}}" style="" action="#" onsubmit="{{onSalvar}}('{{codigo_variavel}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="nome" >{{{nomeVariavelTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{nomeVariavelTxt}}}" type="text" value="{{{nome}}}" class="form-control" name="nome" required >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="descricao" >{{{descricaoTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{descricaoVariavelTxt}}}" type="text" value="{{{descricao}}}" class="form-control" name="descricao" >
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
